import { useEffect, useRef } from 'react';
import { useGraphStore } from '@/store/graph-store';

export interface ParsedURLGraphState {
  x: number;
  y: number;
  z: number;
}

export function encodeGraphStateToHash(x: number, y: number, z: number): string {
  const rx = Math.round(x);
  const ry = Math.round(y);
  const rz = Number(z.toFixed(2));
  return `#x=${rx}&y=${ry}&z=${rz}`;
}

export function decodeGraphStateFromHash(hash: string): ParsedURLGraphState | null {
  if (!hash || !hash.startsWith('#')) return null;
  const params = new URLSearchParams(hash.slice(1));
  const xStr = params.get('x');
  const yStr = params.get('y');
  const zStr = params.get('z');

  if (xStr === null && yStr === null && zStr === null) return null;

  const x = xStr !== null ? Number(xStr) : 0;
  const y = yStr !== null ? Number(yStr) : 0;
  const z = zStr !== null ? Number(zStr) : 1;

  if (Number.isNaN(x) || Number.isNaN(y) || Number.isNaN(z)) return null;

  return {
    x: Math.round(x),
    y: Math.round(y),
    z: Math.min(Math.max(Number(z.toFixed(2)), 0.5), 2.0),
  };
}

/**
 * Synchronizes graph zoom and pan coordinates with the URL hash within 100ms,
 * and restores state on initial load and browser back/forward navigation.
 */
export function useURLState(): void {
  const zoom = useGraphStore((s) => s.zoom);
  const pan = useGraphStore((s) => s.pan);
  const hasInteracted = useGraphStore((s) => s.hasInteracted);
  const setZoom = useGraphStore((s) => s.setZoom);
  const setPan = useGraphStore((s) => s.setPan);
  const isRestoringRef = useRef(false);

  // Restore state on initial mount and popstate (back/forward)
  useEffect(() => {
    const applyFromLocation = () => {
      const parsed = decodeGraphStateFromHash(window.location.hash);
      if (parsed) {
        isRestoringRef.current = true;
        setPan({ x: parsed.x, y: parsed.y });
        setZoom(parsed.z);
        requestAnimationFrame(() => {
          isRestoringRef.current = false;
        });
      }
    };

    applyFromLocation();
    window.addEventListener('popstate', applyFromLocation);
    return () => window.removeEventListener('popstate', applyFromLocation);
  }, [setPan, setZoom]);

  // Write zoom and pan changes to URL hash within 80ms (<100ms requirement)
  useEffect(() => {
    if (!hasInteracted || isRestoringRef.current) return;

    const timer = window.setTimeout(() => {
      const nextHash = encodeGraphStateToHash(pan.x, pan.y, zoom);
      if (window.location.hash !== nextHash) {
        window.history.replaceState(
          { x: pan.x, y: pan.y, z: zoom },
          '',
          `${window.location.pathname}${window.location.search}${nextHash}`
        );
      }
    }, 60);

    return () => window.clearTimeout(timer);
  }, [zoom, pan.x, pan.y, hasInteracted]);
}
