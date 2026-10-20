import { gsap, prefersReducedMotion } from '@/lib/motion/engine';
import type { GraphEdge, GraphNode } from '@/data/portfolio-content';
import {
  calculateSpringForce,
  DEFAULT_SPRING_CONFIG,
  hasSettled,
  type SpringConfig,
  updatePosition,
  updateVelocity,
  type Vector2D,
} from './spring';

export interface PhysicsEngineOptions {
  springConfig?: Partial<SpringConfig>;
  minSpacing?: number;
  repulsionStrength?: number;
  edgeCouplingStrength?: number;
  onUpdate?: (nodes: GraphNode[], isSettled: boolean) => void;
}

export class PhysicsEngine {
  private nodes: GraphNode[] = [];
  private edges: GraphEdge[] = [];
  private draggedNodeId: string | null = null;
  private isPaused = false;
  private settled = false;
  private running = false;
  private springConfig: SpringConfig;
  private minSpacing: number;
  private repulsionStrength: number;
  private edgeCouplingStrength: number;
  private onUpdate?: (nodes: GraphNode[], isSettled: boolean) => void;
  private tickerFn: ((time: number, deltaTime: number) => void) | null = null;

  constructor(options: PhysicsEngineOptions = {}) {
    this.springConfig = {
      ...DEFAULT_SPRING_CONFIG,
      ...options.springConfig,
    };
    this.minSpacing = options.minSpacing ?? 60;
    this.repulsionStrength = options.repulsionStrength ?? 14000;
    this.edgeCouplingStrength = options.edgeCouplingStrength ?? 26;
    this.onUpdate = options.onUpdate;
  }

  public setGraph(nodes: GraphNode[], edges: GraphEdge[]): void {
    this.nodes = nodes.map((n) => ({
      ...n,
      position: { ...n.position },
      equilibrium: { ...n.equilibrium },
      velocity: { ...n.velocity },
    }));
    this.edges = [...edges];
    this.settled = false;
  }

  public updateNodePosition(
    nodeId: string,
    position: Vector2D,
    velocity: Vector2D = { x: 0, y: 0 }
  ): void {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    node.position = { ...position };
    node.velocity = { ...velocity };
    this.settled = false;
  }

  public setDraggedNode(nodeId: string | null, releaseVelocity?: Vector2D): void {
    if (this.draggedNodeId && !nodeId && releaseVelocity) {
      const prevNode = this.nodes.find((n) => n.id === this.draggedNodeId);
      if (prevNode) {
        prevNode.velocity = {
          x: releaseVelocity.x * 0.45,
          y: releaseVelocity.y * 0.45,
        };
      }
    }
    this.draggedNodeId = nodeId;
    this.settled = false;
  }

  public get isSettled(): boolean {
    return this.settled;
  }

  public getNodes(): GraphNode[] {
    return this.nodes;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
    this.settled = false;
  }

  public start(): void {
    if (this.running) return;
    this.running = true;

    this.tickerFn = (_time: number, deltaMs: number) => {
      if (this.isPaused) return;
      const dt = Math.min(Math.max(deltaMs / 1000, 0.004), 0.033);
      this.tick(dt);
    };

    gsap.ticker.add(this.tickerFn);
  }

  public stop(): void {
    if (this.tickerFn) {
      gsap.ticker.remove(this.tickerFn);
      this.tickerFn = null;
    }
    this.running = false;
  }

  /**
   * Perform a single physics step of duration dt (in seconds)
   */
  public tick(dt = 0.016): { nodes: GraphNode[]; isSettled: boolean } {
    if (prefersReducedMotion()) {
      // Under reduced motion, snap non-dragged nodes directly to equilibrium
      let changed = false;
      for (const node of this.nodes) {
        if (node.id !== this.draggedNodeId && !node.fixed) {
          if (
            node.position.x !== node.equilibrium.x ||
            node.position.y !== node.equilibrium.y
          ) {
            node.position = { ...node.equilibrium };
            node.velocity = { x: 0, y: 0 };
            changed = true;
          }
        }
      }
      this.settled = true;
      if (changed) {
        this.onUpdate?.(this.nodes, true);
      }
      return { nodes: this.nodes, isSettled: true };
    }

    let allSettled = true;
    const forces = new Map<string, Vector2D>();

    // 1. Base spring restoring forces toward equilibrium
    for (const node of this.nodes) {
      if (node.fixed || node.id === this.draggedNodeId) {
        forces.set(node.id, { x: 0, y: 0 });
        continue;
      }

      const springForce = calculateSpringForce(
        node.position,
        node.equilibrium,
        node.velocity,
        this.springConfig
      );
      forces.set(node.id, springForce);
    }

    // 2. Pairwise repulsion / collision prevention (minimum spacing 60px)
    for (let i = 0; i < this.nodes.length; i++) {
      const nodeA = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const nodeB = this.nodes[j];
        const dx = nodeA.position.x - nodeB.position.x;
        const dy = nodeA.position.y - nodeB.position.y;
        const dist = Math.hypot(dx, dy) || 0.001;
        const minDistance = nodeA.radius + nodeB.radius + this.minSpacing;

        if (dist < minDistance) {
          const overlapRatio = (minDistance - dist) / minDistance;
          const nx = dx / dist;
          const ny = dy / dist;
          // Stronger repulsion when a node is actively dragged nearby
          const dragBoost =
            nodeA.id === this.draggedNodeId || nodeB.id === this.draggedNodeId
              ? 1.5
              : 1.0;
          const mag = this.repulsionStrength * overlapRatio * overlapRatio * dragBoost;

          if (!nodeA.fixed && nodeA.id !== this.draggedNodeId) {
            const fA = forces.get(nodeA.id)!;
            fA.x += nx * mag;
            fA.y += ny * mag;
          }
          if (!nodeB.fixed && nodeB.id !== this.draggedNodeId) {
            const fB = forces.get(nodeB.id)!;
            fB.x -= nx * mag;
            fB.y -= ny * mag;
          }
        }
      }
    }

    // 3. Edge elastic coupling: disturbances propagate along connected edges
    for (const edge of this.edges) {
      const source = this.nodes.find((n) => n.id === edge.source);
      const target = this.nodes.find((n) => n.id === edge.target);
      if (!source || !target) continue;

      // Displacement of each node from its own equilibrium
      const sourceOffset = {
        x: source.position.x - source.equilibrium.x,
        y: source.position.y - source.equilibrium.y,
      };
      const targetOffset = {
        x: target.position.x - target.equilibrium.x,
        y: target.position.y - target.equilibrium.y,
      };

      const coupling = this.edgeCouplingStrength * edge.strength;

      if (!source.fixed && source.id !== this.draggedNodeId) {
        const fS = forces.get(source.id)!;
        fS.x += (targetOffset.x - sourceOffset.x) * coupling;
        fS.y += (targetOffset.y - sourceOffset.y) * coupling;
      }

      if (!target.fixed && target.id !== this.draggedNodeId) {
        const fT = forces.get(target.id)!;
        fT.x += (sourceOffset.x - targetOffset.x) * coupling;
        fT.y += (sourceOffset.y - targetOffset.y) * coupling;
      }
    }

    // 4. Integrate velocities and positions
    for (const node of this.nodes) {
      if (node.fixed || node.id === this.draggedNodeId) {
        if (node.id === this.draggedNodeId) {
          allSettled = false;
        }
        continue;
      }

      const force = forces.get(node.id) ?? { x: 0, y: 0 };
      node.velocity = updateVelocity(node.velocity, force, node.mass, dt);
      node.position = updatePosition(node.position, node.velocity, dt);

      if (
        hasSettled(
          node.position,
          node.equilibrium,
          node.velocity,
          this.springConfig.precision
        )
      ) {
        // Snap cleanly to equilibrium when within precision threshold
        node.position.x =
          node.equilibrium.x + (node.position.x - node.equilibrium.x) * 0.85;
        node.position.y =
          node.equilibrium.y + (node.position.y - node.equilibrium.y) * 0.85;
        if (
          Math.hypot(
            node.position.x - node.equilibrium.x,
            node.position.y - node.equilibrium.y
          ) < 0.15
        ) {
          node.position = { ...node.equilibrium };
          node.velocity = { x: 0, y: 0 };
        }
      } else {
        allSettled = false;
      }
    }

    const wasSettled = this.settled;
    this.settled = allSettled;

    if (!allSettled || !wasSettled) {
      this.onUpdate?.(this.nodes, this.settled);
    }

    return { nodes: this.nodes, isSettled: this.settled };
  }
}
