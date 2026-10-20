import { useEffect, useState } from 'react';
import { gsap, isMobile, prefersReducedMotion } from '@/lib/motion/engine';
import { useGraphStore } from '@/store/graph-store';

export type DriftOffsets = Record<string, { x: number; y: number }>;

/**
 * Subtle idle oscillation on all graph nodes ("Settle like physics" breathing at rest).
 * Driven on the single GSAP ticker clock.
 * - Starts after initial load settle (2800ms) so initial hero frame settles cleanly
 * - Period: ~4 seconds per cycle
 * - Amplitude: ±2.2px desktop, ±1.0px mobile
 * - Pauses when any node is dragged or hovered
 * - Disabled under prefers-reduced-motion
 */
export function useIdleDrift(nodeIds: string[]): DriftOffsets {
  const isDragging = useGraphStore((s) => s.isDragging);
  const hoveredNodeId = useGraphStore((s) => s.hoveredNodeId);
  const [offsets, setOffsets] = useState<DriftOffsets>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timer = window.setTimeout(() => setReady(true), 2900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion() || !ready) {
      setOffsets({});
      return;
    }

    const paused = isDragging || Boolean(hoveredNodeId);
    if (paused) {
      return;
    }

    const tick = (time: number) => {
      if (prefersReducedMotion()) return;
      const amplitude = isMobile() ? 1.0 : 2.2;
      const next: DriftOffsets = {};

      for (let i = 0; i < nodeIds.length; i++) {
        const id = nodeIds[i];
        const phaseX = i * 1.35;
        const phaseY = i * 2.15 + 0.9;
        next[id] = {
          x: Math.sin(time * 1.35 + phaseX) * amplitude,
          y: Math.cos(time * 1.15 + phaseY) * amplitude,
        };
      }
      setOffsets(next);
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [nodeIds.join(','), isDragging, hoveredNodeId, ready]);

  return offsets;
}
