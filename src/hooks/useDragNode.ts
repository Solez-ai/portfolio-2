import { useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { useGraphStore } from '@/store/graph-store';
import type { Vector2D } from '@/lib/physics/spring';

interface UseDragNodeOptions {
  nodeId: string;
  position: Vector2D;
  onDragPosition?: (nodeId: string, pos: Vector2D) => void;
  onDragEndVelocity?: (nodeId: string, velocity: Vector2D) => void;
  onNodeClick?: () => void;
}

/**
 * Hook wrapping @use-gesture/react useDrag for low-latency (<50ms) direct node dragging
 * with touch & pointer support, zoom compensation, and release momentum.
 */
export function useDragNode({
  nodeId,
  position,
  onDragPosition,
  onDragEndVelocity,
  onNodeClick,
}: UseDragNodeOptions) {
  const startDrag = useGraphStore((s) => s.startDrag);
  const updateDrag = useGraphStore((s) => s.updateDrag);
  const endDrag = useGraphStore((s) => s.endDrag);
  const zoom = useGraphStore((s) => s.zoom);

  const originRef = useRef<Vector2D>({ x: position.x, y: position.y });
  const didMoveRef = useRef(false);

  const bind = useDrag(
    ({ first, active, last, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], tap, event }) => {
      event?.stopPropagation();

      if (tap) {
        onNodeClick?.();
        return;
      }

      if (first) {
        originRef.current = { x: position.x, y: position.y };
        didMoveRef.current = false;
        startDrag(nodeId);
      }

      const distMoved = Math.hypot(mx, my);
      if (distMoved > 5) {
        didMoveRef.current = true;
      }

      if (active) {
        const scale = zoom || 1;
        const nextPos = {
          x: originRef.current.x + mx / scale,
          y: originRef.current.y + my / scale,
        };
        updateDrag(nodeId, nextPos);
        onDragPosition?.(nodeId, nextPos);
      }

      if (last) {
        // @use-gesture velocity is in px/ms; convert to px/s for physics engine
        const releaseVelocity = {
          x: vx * dx * 1000,
          y: vy * dy * 1000,
        };
        endDrag(nodeId, releaseVelocity);
        onDragEndVelocity?.(nodeId, releaseVelocity);

        if (!didMoveRef.current) {
          onNodeClick?.();
        }
      }
    },
    {
      filterTaps: true,
      pointer: { touch: true, capture: true },
      preventScroll: true,
    }
  );

  return {
    bind,
    didMoveRef,
  };
}
