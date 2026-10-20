import { create } from 'zustand';
import {
  createInitialNodes,
  type GraphEdge,
  type GraphNode,
  INITIAL_EDGES,
} from '@/data/portfolio-content';
import type { Vector2D } from '@/lib/physics/spring';

export interface TransitionSourceRect {
  nodeId: string;
  slug: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDragging: boolean;
  draggedNodeId: string | null;
  hoveredNodeId: string | null;
  hoveredEdgeId: string | null;
  hoveredSkill: string | null;
  focusedNodeId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  isSettled: boolean;
  hasInteracted: boolean;
  viewport: { width: number; height: number };
  transitionSource: TransitionSourceRect | null;

  // Actions
  startDrag: (nodeId: string) => void;
  updateDrag: (nodeId: string, position: Vector2D) => void;
  endDrag: (nodeId: string, releaseVelocity?: Vector2D) => void;
  setHover: (nodeId: string | null) => void;
  setEdgeHover: (edgeId: string | null, skillName?: string | null) => void;
  setFocus: (nodeId: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  setViewport: (width: number, height: number) => void;
  syncPhysicsNodes: (nodes: GraphNode[], isSettled: boolean) => void;
  setTransitionSource: (source: TransitionSourceRect | null) => void;
  resetGraph: () => void;
}

const DEFAULT_WIDTH = typeof window !== 'undefined' ? window.innerWidth : 1280;
const DEFAULT_HEIGHT = typeof window !== 'undefined' ? window.innerHeight : 800;

export const useGraphStore = create<GraphState>((set, get) => ({
  nodes: createInitialNodes(DEFAULT_WIDTH, DEFAULT_HEIGHT),
  edges: INITIAL_EDGES,
  isDragging: false,
  draggedNodeId: null,
  hoveredNodeId: null,
  hoveredEdgeId: null,
  hoveredSkill: null,
  focusedNodeId: null,
  zoom: DEFAULT_WIDTH < 768 ? 0.85 : 1.0,
  pan: { x: 0, y: 0 },
  isSettled: false,
  hasInteracted: false,
  viewport: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
  transitionSource: null,

  startDrag: (nodeId) =>
    set({
      isDragging: true,
      draggedNodeId: nodeId,
      isSettled: false,
      hasInteracted: true,
    }),

  updateDrag: (nodeId, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              position: { x: position.x, y: position.y },
            }
          : node
      ),
      isSettled: false,
    })),

  endDrag: (nodeId, releaseVelocity = { x: 0, y: 0 }) =>
    set((state) => ({
      isDragging: false,
      draggedNodeId: null,
      isSettled: false,
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              velocity: {
                x: releaseVelocity.x * 0.45,
                y: releaseVelocity.y * 0.45,
              },
            }
          : node
      ),
    })),

  setHover: (nodeId) =>
    set({
      hoveredNodeId: nodeId,
    }),

  setEdgeHover: (edgeId, skillName = null) =>
    set({
      hoveredEdgeId: edgeId,
      hoveredSkill: skillName,
    }),

  setFocus: (nodeId) =>
    set({
      focusedNodeId: nodeId,
    }),

  setZoom: (zoom) => {
    const clampedZoom = Math.min(Math.max(Number(zoom.toFixed(2)), 0.5), 2.0);
    set({ zoom: clampedZoom, hasInteracted: true });
  },

  setPan: (pan) =>
    set({
      pan: {
        x: Math.round(pan.x),
        y: Math.round(pan.y),
      },
      hasInteracted: true,
    }),

  setViewport: (width, height) => {
    const current = get().viewport;
    if (
      Math.abs(current.width - width) < 4 &&
      Math.abs(current.height - height) < 4
    ) {
      return;
    }
    const recomputed = createInitialNodes(width, height);
    set((state) => ({
      viewport: { width, height },
      zoom: width < 768 && !state.hasInteracted ? 0.85 : state.zoom,
      nodes: recomputed,
      isSettled: false,
    }));
  },

  syncPhysicsNodes: (updatedNodes, isSettled) =>
    set({
      nodes: updatedNodes.map((n) => ({
        ...n,
        position: { ...n.position },
        velocity: { ...n.velocity },
      })),
      isSettled,
    }),

  setTransitionSource: (source) =>
    set({
      transitionSource: source,
    }),

  resetGraph: () => {
    const { width, height } = get().viewport;
    set({
      nodes: createInitialNodes(width, height),
      zoom: width < 768 ? 0.85 : 1.0,
      pan: { x: 0, y: 0 },
      hoveredNodeId: null,
      hoveredEdgeId: null,
      hoveredSkill: null,
      focusedNodeId: null,
      isDragging: false,
      draggedNodeId: null,
      isSettled: false,
    });
  },
}));
