// Motion Provider for TanStack Router
// Initializes GSAP + Lenis globally and provides cleanup

import { useEffect } from 'react';
import { initScroll, destroyScroll } from './engine';

interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * MotionProvider initializes the motion engine (GSAP + Lenis)
 * Mount this once at the root of your app
 * 
 * Usage in TanStack Router:
 * Wrap your RouterProvider or add to root route layout
 */
export function MotionProvider({ children }: MotionProviderProps) {
  useEffect(() => {
    // Initialize smooth scroll on mount
    initScroll();

    // Cleanup on unmount
    return () => {
      destroyScroll();
    };
  }, []);

  return <>{children}</>;
}
