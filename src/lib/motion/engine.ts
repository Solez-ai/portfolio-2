// Motion engine for TanStack Router + React 19
// Adapted from references/engine.md Next.js pattern
// 
// This module provides:
// - GSAP + Lenis integration on a single clock
// - useGSAP hook for React 18+ compatibility
// - Smooth scroll with 60fps target
// - Spring physics utilities

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP as useGSAPReact } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// Environment Detection
// ============================================================================

export const prefersReducedMotion = () => 
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () => 
  matchMedia('(hover: none), (pointer: coarse)').matches;

export const isMobile = () => 
  matchMedia('(max-width: 767px)').matches;

// ============================================================================
// Easing & Motion Tokens
// ============================================================================

/**
 * Shared easing vocabulary matching design spec
 * Use these names consistently; never invent per-component curves
 */
export const ease = {
  spring: 'back.out(1.6)',           // Spring curve for physics-like motion
  out: 'expo.out',                   // Default entrance
  inOut: 'expo.inOut',               // Curtains, page transitions
  soft: 'power3.out',                // Small UI, hover feedback
} as const;

/**
 * Duration palette from design spec
 */
export const duration = {
  instant: 0,                        // Immediate response (drag follow)
  feedback: 0.15,                    // Hover feedback (150ms)
  quick: 0.3,                        // UI state changes (300ms)
  settle: 1.2,                       // Full physics settle time (1200ms)
  transition: 0.8,                   // Page transitions (800ms)
} as const;

/**
 * Spring physics configuration from design spec
 */
export const springConfig = {
  stiffness: 150,                    // How quickly nodes return to equilibrium
  damping: 20,                       // Resistance to motion (prevents endless bouncing)
  mass: 1.0,                         // Default node mass
  precision: 0.01,                   // Stop threshold
} as const;

// ============================================================================
// Lenis Smooth Scroll Integration
// ============================================================================

let lenis: Lenis | null = null;
const scrollListeners = new Set<(state: ScrollState) => void>();

export type ScrollState = {
  y: number;
  velocity: number;
  progress: number;
};

const scrollState: ScrollState = {
  y: 0,
  velocity: 0,
  progress: 0,
};

/**
 * Initialize Lenis smooth scroll on GSAP ticker
 * Called once on app mount
 */
export function initScroll() {
  if (lenis || prefersReducedMotion()) {
    // Under reduced motion, use native scroll but still publish state
    if (!lenis) {
      addEventListener('scroll', nativeScrollTick, { passive: true });
    }
    return;
  }

  // Initialize Lenis with 60fps target
  lenis = new Lenis({
    lerp: 0.1,                       // Smoothness (0.1 = smooth)
    wheelMultiplier: 1,              // Mouse wheel sensitivity
    touchMultiplier: 1.2,            // Touch scroll sensitivity
    infinite: false,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
  });

  // Sync Lenis with GSAP ticker (single clock)
  lenis.on('scroll', (lenisInstance: Lenis) => {
    scrollState.y = lenisInstance.scroll;
    scrollState.velocity = lenisInstance.velocity;
    // Normalize progress: Lenis reports 1 on pages that can't scroll
    scrollState.progress = lenisInstance.limit > 0 
      ? lenisInstance.scroll / lenisInstance.limit 
      : 0;
    
    ScrollTrigger.update();
    scrollListeners.forEach(fn => fn(scrollState));
  });

  // Drive Lenis with GSAP ticker (time in milliseconds)
  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });

  // Disable lag smoothing for consistent animation
  gsap.ticker.lagSmoothing(0);
}

/**
 * Native scroll fallback for reduced motion
 */
function nativeScrollTick() {
  const max = document.documentElement.scrollHeight - innerHeight;
  scrollState.velocity = scrollY - scrollState.y;
  scrollState.y = scrollY;
  scrollState.progress = max > 0 ? scrollY / max : 0;
  scrollListeners.forEach(fn => fn(scrollState));
}

/**
 * Subscribe to scroll updates
 * Returns unsubscribe function
 */
export function onScroll(fn: (state: ScrollState) => void): () => void {
  scrollListeners.add(fn);
  return () => scrollListeners.delete(fn);
}

/**
 * Get current scroll state
 */
export function getScrollState(): ScrollState {
  return { ...scrollState };
}

/**
 * Stop smooth scroll (e.g., during page transitions)
 */
export function stopScroll(): void {
  lenis?.stop();
}

/**
 * Resume smooth scroll
 */
export function startScroll(): void {
  lenis?.start();
}

/**
 * Reset scroll to top
 */
export function resetScroll(): void {
  if (lenis) {
    lenis.scrollTo(0, { immediate: true, force: true });
  } else {
    scrollTo(0, 0);
  }
  scrollState.y = 0;
  scrollState.velocity = 0;
  scrollState.progress = 0;
}

/**
 * Scroll to target element or position
 */
export function scrollToTarget(
  target: string | HTMLElement | number,
  options?: { duration?: number; offset?: number }
): void {
  if (lenis) {
    lenis.scrollTo(target, {
      duration: options?.duration ?? 1.4,
      offset: options?.offset ?? 0,
      easing: (t) => 1 - Math.pow(1 - t, 4), // Expo out
    });
  } else if (typeof target === 'number') {
    scrollTo({ top: target, behavior: 'smooth' });
  } else {
    const element = typeof target === 'string' 
      ? document.querySelector(target) 
      : target;
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Destroy Lenis instance (cleanup)
 */
export function destroyScroll(): void {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
  removeEventListener('scroll', nativeScrollTick);
  scrollListeners.clear();
}

// ============================================================================
// GSAP Context Hook (React 18+ compatibility)
// ============================================================================

/**
 * Re-export useGSAP from @gsap/react for consistent API
 * Provides automatic cleanup and context scoping
 * 
 * Usage:
 * ```tsx
 * useGSAP(() => {
 *   gsap.to('.element', { x: 100 });
 * }, [dependencies]);
 * ```
 */
export const useGSAP = useGSAPReact;

// ============================================================================
// Re-export GSAP instance
// ============================================================================

/**
 * Main GSAP instance with plugins registered
 * Use this for all animations
 */
export { gsap };

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Create a spring animation using GSAP
 * Uses the spring config from design spec
 */
export function createSpringAnimation(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars,
  config: Partial<typeof springConfig> = {}
): gsap.core.Tween {
  const { stiffness, damping, mass, precision } = {
    ...springConfig,
    ...config,
  };

  // Convert spring params to GSAP duration and ease
  // Approximation: duration scales with mass/stiffness
  const estimatedDuration = Math.sqrt(mass / stiffness) * 2;

  return gsap.to(target, {
    ...vars,
    duration: estimatedDuration,
    ease: ease.spring,
  });
}

/**
 * Wait for a duration (useful in animation sequences)
 */
export function wait(seconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/**
 * Kill all GSAP animations on a target
 */
export function killAnimations(target: gsap.TweenTarget): void {
  gsap.killTweensOf(target);
}

/**
 * Batch animations with stagger
 */
export function staggerAnimation(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars,
  staggerAmount: number
): gsap.core.Tween {
  return gsap.to(targets, {
    ...vars,
    stagger: staggerAmount,
  });
}
