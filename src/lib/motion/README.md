# Motion Engine

GSAP + Lenis motion engine for TanStack Router. Provides smooth scroll, spring physics utilities, and React 18+ compatibility.

## Features

- **Single Clock Architecture**: Lenis runs on GSAP ticker for perfect sync
- **60fps Smooth Scroll**: Lenis with optimized settings
- **Spring Physics**: Utilities for physics-based animations
- **React 18+ Compatible**: useGSAP hook with automatic cleanup
- **Accessibility**: Respects `prefers-reduced-motion`
- **Type-Safe**: Full TypeScript support

## Setup

The motion engine is already integrated into the root layout via `MotionProvider`. No additional setup required.

## Usage

### Basic GSAP Animation

```tsx
import { useGSAP, gsap, ease, duration } from '@/lib/motion';

function MyComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    gsap.to('.element', {
      x: 100,
      duration: duration.settle,
      ease: ease.spring,
    });
  }, { scope: containerRef });
  
  return <div ref={containerRef}>...</div>;
}
```

### Spring Animation

```tsx
import { createSpringAnimation } from '@/lib/motion';

// Create a spring animation with default config
createSpringAnimation('.node', { x: 100, y: 50 });

// Custom spring config
createSpringAnimation('.node', { x: 100 }, {
  stiffness: 200,
  damping: 15,
  mass: 1.5,
});
```

### Scroll Management

```tsx
import { 
  scrollToTarget, 
  onScroll, 
  getScrollState,
  stopScroll,
  startScroll 
} from '@/lib/motion';

// Scroll to element
scrollToTarget('#target', { duration: 1.2 });

// Listen to scroll events
useEffect(() => {
  const unsubscribe = onScroll(({ y, velocity, progress }) => {
    console.log('Scroll position:', y);
    console.log('Velocity:', velocity);
    console.log('Progress:', progress);
  });
  
  return unsubscribe;
}, []);

// Get current scroll state
const { y, velocity, progress } = getScrollState();

// Pause/resume scroll (e.g., during modals)
stopScroll();
startScroll();
```

### Stagger Animations

```tsx
import { staggerAnimation, duration } from '@/lib/motion';

staggerAnimation('.nodes', {
  opacity: 1,
  y: 0,
  duration: duration.quick,
}, 0.04); // 40ms stagger between items
```

### Environment Detection

```tsx
import { prefersReducedMotion, isTouch, isMobile } from '@/lib/motion';

if (prefersReducedMotion()) {
  // Use instant animations
}

if (isTouch()) {
  // Enable touch-specific interactions
}

if (isMobile()) {
  // Adjust for mobile viewport
}
```

## Motion Tokens

### Easing

```tsx
import { ease } from '@/lib/motion';

ease.spring  // 'back.out(1.6)' - Spring physics
ease.out     // 'expo.out' - Default entrance
ease.inOut   // 'expo.inOut' - Page transitions
ease.soft    // 'power3.out' - Small UI, hover
```

### Durations

```tsx
import { duration } from '@/lib/motion';

duration.instant     // 0s - Immediate
duration.feedback    // 0.15s - Hover feedback
duration.quick       // 0.3s - UI state changes
duration.settle      // 1.2s - Physics settle
duration.transition  // 0.8s - Page transitions
```

### Spring Config

```tsx
import { springConfig } from '@/lib/motion';

springConfig.stiffness  // 150 - Return speed
springConfig.damping    // 20 - Resistance
springConfig.mass       // 1.0 - Default mass
springConfig.precision  // 0.01 - Stop threshold
```

## Design Spec References

This implementation follows the design specifications:

- **Spring Physics**: stiffness 150, damping 20, mass 1.0
- **Duration Palette**: instant (0ms), feedback (150ms), quick (300ms), settle (1200ms), transition (800ms)
- **Easing**: Spring curve, expo out, power3 out
- **Lenis Config**: 60fps target, lerp 0.1

## Browser Compatibility

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Requires CSS Custom Properties support
- Requires `requestAnimationFrame` support
- Falls back to native scroll under `prefers-reduced-motion`

## Performance

- Lenis is throttled to 60fps max
- GSAP uses optimized transforms
- ScrollTrigger updates are batched
- No layout thrashing
- Memory efficient (auto-cleanup via React hooks)

## Troubleshooting

### Scroll not working

- Check that `MotionProvider` is mounted in root
- Verify no CSS `overflow: hidden` on html/body
- Check browser console for errors

### Animations jittering

- Ensure `gsap.ticker.lagSmoothing(0)` is set (already configured)
- Check for conflicting CSS transitions
- Verify no other scroll libraries are active

### Spring animations not settling

- Increase `damping` value for faster settling
- Decrease `stiffness` for gentler motion
- Check `precision` threshold (default 0.01)

## Examples

See `/src/components/graph/` for real-world usage examples.
