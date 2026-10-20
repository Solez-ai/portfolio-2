import type { NodeType } from '@/data/portfolio-content';

export interface Vector2D {
  x: number;
  y: number;
}

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  precision: number;
}

export interface NodeTypeConfig {
  mass: number;
  radius: number;
  mobileRadius: number;
  color: string;
}

export const DEFAULT_SPRING_CONFIG: SpringConfig = {
  stiffness: 150,
  damping: 20,
  mass: 1.0,
  precision: 0.01,
};

export const NODE_TYPE_CONFIGS: Record<NodeType, NodeTypeConfig> = {
  project: {
    mass: 1.2,
    radius: 40, // 80px diameter
    mobileRadius: 30, // 60px diameter
    color: '#162432',
  },
  experience: {
    mass: 1.5,
    radius: 60, // 120px diameter
    mobileRadius: 40, // 80px diameter
    color: '#162432',
  },
  skill: {
    mass: 0.6,
    radius: 20, // 40px diameter
    mobileRadius: 16, // 32px diameter
    color: '#1E2530',
  },
  contact: {
    mass: 0.8,
    radius: 30, // 60px diameter
    mobileRadius: 30, // 60px diameter
    color: '#162432',
  },
};

/**
 * Calculate Hooke's Law spring restoring force: F = -k * (position - equilibrium) - c * velocity
 */
export function calculateSpringForce(
  position: Vector2D,
  equilibrium: Vector2D,
  velocity: Vector2D,
  config: Partial<SpringConfig> = {}
): Vector2D {
  const stiffness = config.stiffness ?? DEFAULT_SPRING_CONFIG.stiffness;
  const damping = config.damping ?? DEFAULT_SPRING_CONFIG.damping;

  const dx = position.x - equilibrium.x;
  const dy = position.y - equilibrium.y;

  return {
    x: -stiffness * dx - damping * velocity.x,
    y: -stiffness * dy - damping * velocity.y,
  };
}

/**
 * Update velocity using semi-implicit Euler integration: v = v + (F / m) * dt
 */
export function updateVelocity(
  velocity: Vector2D,
  force: Vector2D,
  mass: number,
  dt: number
): Vector2D {
  const safeMass = Math.max(0.1, mass);
  const clampedDt = Math.min(dt, 0.033); // Cap delta time at ~30fps step for numerical stability

  const vx = velocity.x + (force.x / safeMass) * clampedDt;
  const vy = velocity.y + (force.y / safeMass) * clampedDt;

  // Clamp maximum velocity to prevent runaway spikes
  const maxSpeed = 2400;
  const speedSq = vx * vx + vy * vy;
  if (speedSq > maxSpeed * maxSpeed) {
    const scale = maxSpeed / Math.sqrt(speedSq);
    return { x: vx * scale, y: vy * scale };
  }

  return { x: vx, y: vy };
}

/**
 * Update position from current velocity: x = x + v * dt
 */
export function updatePosition(
  position: Vector2D,
  velocity: Vector2D,
  dt: number
): Vector2D {
  const clampedDt = Math.min(dt, 0.033);
  return {
    x: position.x + velocity.x * clampedDt,
    y: position.y + velocity.y * clampedDt,
  };
}

/**
 * Check if a node has settled at its equilibrium within precision threshold
 */
export function hasSettled(
  position: Vector2D,
  equilibrium: Vector2D,
  velocity: Vector2D,
  precision: number = DEFAULT_SPRING_CONFIG.precision
): boolean {
  const speed = Math.hypot(velocity.x, velocity.y);
  const distance = Math.hypot(
    position.x - equilibrium.x,
    position.y - equilibrium.y
  );
  // Node is settled when velocity and displacement are near zero
  return speed < precision * 15 && distance < precision * 35;
}
