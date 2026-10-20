// Motion engine exports
// Single entry point for all motion utilities

export {
  // Core GSAP instance
  gsap,
  useGSAP,
  
  // Scroll management
  initScroll,
  destroyScroll,
  onScroll,
  getScrollState,
  stopScroll,
  startScroll,
  resetScroll,
  scrollToTarget,
  
  // Environment detection
  prefersReducedMotion,
  isTouch,
  isMobile,
  
  // Motion tokens
  ease,
  duration,
  springConfig,
  
  // Utilities
  createSpringAnimation,
  wait,
  killAnimations,
  staggerAnimation,
  
  // Types
  type ScrollState,
} from './engine';

export { MotionProvider } from './MotionProvider';
