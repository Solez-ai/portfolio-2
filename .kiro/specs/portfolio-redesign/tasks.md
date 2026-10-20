# Implementation Plan: The Node Graph Portfolio

## Overview

This plan implements SOLEZ's portfolio as an interactive node-graph visualization using Next.js 14+, TypeScript, GSAP, and custom spring physics. The implementation follows the /awwwards workflow (Build → QA Loop → Ship), creating a memorable portfolio that demonstrates technical sophistication through draggable nodes with spring physics settling behavior.

The portfolio presents 5 projects, 2 work experiences, and skills as an interconnected graph where visitors can drag nodes, explore relationships, and navigate to detailed case studies through shared-element transitions.

## Tasks

- [x] 1. Scaffold Next.js project and install dependencies
  - Run `npx create-next-app@latest` with TypeScript, App Router, Tailwind CSS, and src/ directory
  - Install core dependencies: `gsap@3.12+`, `@gsap/react`, `lenis@1.0+` (smooth scroll)
  - Install development dependencies: `playwright`, `@axe-core/playwright`
  - Remove default Next.js boilerplate from app/page.tsx
  - _Requirements: Architecture setup for 1.1, 6.1, 6.6_

- [ ] 2. Setup motion engine and fonts
  - [-] 2.1 Configure GSAP and Lenis
    - Create `src/lib/motion/engine.ts` following references/engine.md Next.js adapter pattern
    - Setup GSAP Context for React 18+ compatibility
    - Initialize Lenis smooth scroll in root layout
    - Export `useGSAP` hook and `gsap` instance
    - _Requirements: Motion foundation for 1.4, 2.3, 3.1_

  - [-] 2.2 Setup typography system
    - Import JetBrains Mono and Geist from Google Fonts in `app/layout.tsx`
    - Define CSS custom properties for type scale (--t-mega through --t-xs) in `globals.css`
    - Create typography utility classes (.display, .node-label, .body)
    - _Requirements: Visual design system for 12.1_

- [ ] 3. Create design tokens and content data
  - [ ] 3.1 Define design system tokens
    - Create `src/styles/tokens.css` with color palette (ground, ink, muted, line, accent, node, edge)
    - Define spacing scale, duration palette (--dur-instant through --dur-transition), and shape constants (8px radius)
    - Create responsive grid custom properties (12-col desktop, 8-col tablet, 4-col mobile)
    - _Requirements: Visual design system for 12.2, 12.3, 12.5, 12.6_

  - [~] 3.2 Create content data file
    - Create `src/data/portfolio-content.ts` with typed interfaces for Node, Edge, ProjectData, ExperienceData
    - Define project nodes: 3DragWin, Nodex, Vell, URLPad, PySketch with descriptions, tech stacks, URLs
    - Define experience nodes: MentorMind (Co-Founder & CTO, Feb 2026 - Present), Solven.ai (Junior Web Developer, 2025, 6 months)
    - Define skill edges connecting projects: React, Next.js, TypeScript, Node.js, Python, Rust, Supabase
    - Define contact nodes: GitHub, Twitter, LinkedIn, Instagram, Email
    - _Requirements: Content accuracy for 8.1, 8.2, 8.3, 8.4, 8.6_

- [ ] 4. Build physics engine
  - [~] 4.1 Create spring simulation core
    - Create `src/lib/physics/spring.ts` with SpringConfig interface (stiffness: 150, damping: 20, mass: 1.0)
    - Implement `calculateSpringForce()` function using Hooke's law
    - Implement `updateVelocity()` and `updatePosition()` functions with damping
    - Implement `hasSettled()` check using precision threshold (0.01)
    - Export node type configurations (project: mass 1.2, experience: mass 1.5, skill: mass 0.6, contact: mass 0.8)
    - _Requirements: Physics behavior for 2.3, 2.4, 2.6_

  - [~] 4.2 Create physics engine manager
    - Create `src/lib/physics/engine.ts` with PhysicsEngine class
    - Implement collision detection to prevent node overlap (minimum spacing 60px)
    - Implement repulsion forces between nearby nodes
    - Implement `tick()` method for frame-based updates using requestAnimationFrame
    - Add `isSettled` state tracking when all nodes reach equilibrium
    - Support pausing/resuming simulation
    - _Requirements: Physics behavior for 2.4, 2.6_

- [~] 5. Create graph state management
  - Create `src/store/graph-store.ts` using Zustand
  - Define GraphState interface with nodes, edges, isDragging, draggedNodeId, hoveredNodeId, focusedNodeId, zoom, pan, isSettled
  - Implement actions: startDrag, updateDrag, endDrag, setHover, setFocus, setZoom, setPan
  - Initialize state with content data (projects, experiences, skills, contacts)
  - Calculate initial node positions in circular/orbital layout (MentorMind center, projects in rings)
  - _Requirements: State management for 1.1, 1.2, 1.3, 2.1_

- [~] 6. Build Node component
  - Create `src/components/graph/Node.tsx` with TypeScript props interface
  - Render node as positioned div with border-radius: 8px
  - Apply node type styling (project/experience/skill/contact) with different sizes and colors
  - Display node label using JetBrains Mono font
  - Handle pointer events for drag initiation
  - Apply z-index elevation during drag (z-100)
  - Support keyboard focus with visible outline (3px accent color, 3:1 contrast)
  - _Requirements: Node rendering for 1.1, 1.5, 2.5, 12.3, 7.1_

- [~] 7. Build Edge component
  - Create `src/components/graph/Edge.tsx` rendering SVG line or curve
  - Calculate edge position from source and target node coordinates
  - Display skill label at edge midpoint using JetBrains Mono (t-xs)
  - Apply base styling: muted color at 35% opacity, 2px stroke width
  - Support highlight state: increase opacity to 80%, change color to accent
  - Update edge position in real-time when connected nodes move
  - _Requirements: Edge rendering for 1.2, 3.2, 3.3_

- [ ] 8. Build GraphCanvas component
  - [~] 8.1 Create canvas container and rendering
    - Create `src/components/graph/GraphCanvas.tsx` as full viewport container (100svh)
    - Render all Node components from graph state with absolute positioning
    - Render all Edge components in SVG overlay layer
    - Handle viewport resize and update graph dimensions
    - Support zoom controls (Ctrl +/-, pinch on mobile) updating transform scale
    - _Requirements: Graph display for 1.1, 1.2, 1.3, 5.2_

  - [~] 8.2 Integrate physics simulation
    - Connect PhysicsEngine to GraphCanvas via useEffect hook
    - Start physics tick loop on mount, stop on unmount
    - Subscribe to graph state changes and update physics engine node positions
    - Apply physics-calculated positions back to graph state on each frame
    - Detect when simulation has settled and update isSettled state
    - _Requirements: Physics integration for 1.4, 2.3, 2.4, 2.6_

- [ ] 9. Implement drag interaction
  - [~] 9.1 Setup drag gesture handling
    - Install `@use-gesture/react` for advanced pointer/touch handling
    - Create `src/hooks/useDragNode.ts` hook wrapping useDrag gesture
    - On drag start: call startDrag action, set dragged node position to follow pointer
    - During drag: update node position with <50ms latency, no interpolation (direct position update)
    - On drag end: call endDrag action, release node to physics simulation
    - _Requirements: Drag interaction for 2.1, 2.2, 2.5, 5.1_

  - [~] 9.2 Add drag momentum and physics response
    - Calculate drag velocity from pointer movement delta
    - Apply initial velocity to node when drag ends
    - During drag, apply weak repulsion forces to nearby nodes
    - Ensure dragged node affects connected edges in real-time
    - Trigger physics settle animation (1.2s max) after release
    - _Requirements: Drag physics for 2.3, 2.4, 2.6_

- [ ] 10. Implement hover and preview interactions
  - [~] 10.1 Create PreviewCard component
    - Create `src/components/graph/PreviewCard.tsx` with project data props
    - Display project name (t-l), brief description (t-body), and tech stack badges
    - Position card near hovered node, detect viewport edges and reposition to stay visible
    - Apply entrance animation: fade in + scale 0.95 → 1.0 over 200ms (expo.out)
    - Apply exit animation: fade out over 100ms
    - _Requirements: Hover preview for 3.1, 3.2, 3.5_

  - [~] 10.2 Wire hover state and edge highlighting
    - Add onPointerEnter/onPointerLeave handlers to Node component
    - Update hoveredNodeId in graph state on pointer enter (100ms debounce)
    - Show PreviewCard when hoveredNodeId matches node
    - Highlight all connected edges when node is hovered (opacity 0.35 → 0.8, color → accent)
    - Clear hover state and hide preview on pointer leave
    - _Requirements: Hover behavior for 3.1, 3.3, 3.4_

  - [~] 10.3 Implement skill edge hover
    - Add hover detection to Edge component labels
    - When skill edge label is hovered, highlight all project nodes using that skill
    - Apply node highlight: scale 1.08, border color → accent (150ms, power3.out)
    - Clear highlights when hover ends
    - _Requirements: Skill hover for 3.6_

- [ ] 11. Implement keyboard navigation and accessibility
  - [~] 11.1 Setup keyboard focus system
    - Make all Node components keyboard focusable (tabIndex={0})
    - Implement logical tab order (center outward, using DOM order or tabindex)
    - Add visible focus indicators (3px accent outline, 3:1 contrast minimum)
    - Show PreviewCard when node receives keyboard focus (same as hover)
    - _Requirements: Keyboard navigation for 7.1, 7.2, 7.3_

  - [~] 11.2 Add keyboard controls
    - Implement Enter/Space key handler on focused node to navigate to case study
    - Implement Arrow keys for manual graph panning (optional, enhances exploration)
    - Implement Ctrl/Cmd +/- for zoom controls
    - Implement Escape key to dismiss preview cards
    - _Requirements: Keyboard controls for 7.4, 7.6_

  - [~] 11.3 Add ARIA labels and screen reader support
    - Add descriptive ARIA labels to each node: "Project: Nodex, connected to React, Node.js, D3.js"
    - Add role="img" and aria-label to GraphCanvas: "Interactive portfolio graph, 5 projects, 2 experiences"
    - Add aria-describedby to canvas for "Drag to explore" hint
    - Add aria-live="polite" to PreviewCard for content updates
    - Test with screen reader to verify announcements
    - _Requirements: Screen reader support for 7.5_

  - [~] 11.4 Implement reduced motion support
    - Detect prefers-reduced-motion media query
    - When active: disable spring physics, use instant position updates with 300ms crossfade
    - When active: disable idle drift animation
    - When active: preserve hover scale but remove spring momentum
    - When active: convert page transitions to simple crossfades (400ms)
    - _Requirements: Reduced motion for 7.7_

- [ ] 12. Build case study page and navigation
  - [~] 12.1 Create case study page layout
    - Create `app/project/[slug]/page.tsx` dynamic route
    - Fetch project data from portfolio-content.ts based on slug param
    - Implement asymmetric layout: hero (60vh), meta grid (left col 2-4), content pairs (6-6 columns)
    - Display: project name (t-xl), description, client, year, role, tech stack, challenges, outcomes
    - Add back navigation button (top-left): "← Back" returns to home
    - Add external links (if available): "Live Demo" and "GitHub" buttons
    - _Requirements: Case study view for 4.3, 4.4, 4.5, 4.6_

  - [~] 12.2 Implement shared-element transition
    - Install Framer Motion or use GSAP Flip plugin for shared-element animation
    - On node click: capture clicked node's bounding rect and visual state
    - Animate clicked node morphing into case study hero section over 800ms
    - Simultaneously: scale down and fade other nodes (400ms), fade canvas (600ms)
    - On back navigation: reverse animation, morph hero back to node position
    - _Requirements: Transition for 4.1, 4.2, 4.7_

- [~] 13. Implement URL state persistence
  - Create `src/hooks/useURLState.ts` for encoding/decoding graph state
  - On zoom change: update URL hash with zoom level within 100ms
  - On pan/scroll: update URL hash with x,y coordinates within 100ms
  - On case study navigation: update URL path with project slug
  - On page load: parse URL hash and restore zoom/pan state
  - Support browser back/forward: restore previous graph state from history API
  - _Requirements: URL state for 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [~] 14. Build footer section with contact nodes
  - Create `src/components/Footer.tsx` component
  - Render "LET'S CONNECT" headline (t-xl, centered)
  - Render contact links as small nodes (60px diameter) with spring physics
  - Create central "Contact" hub node with leaf nodes: GitHub, LinkedIn, Twitter, Email, Resume
  - Apply same spring physics as main graph (reuse PhysicsEngine)
  - Display brief statement below: "Full Stack Developer / Building elegant technical solutions" (t-m, Geist)
  - Display copyright: "© 2025 SOLEZ" (t-xs, bottom-left)
  - _Requirements: Footer for 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

- [~] 15. Build 404 page
  - Create `app/not-found.tsx` with custom 404 layout
  - Render single disconnected node (120px diameter) at viewport center
  - Display "404: Not Found" label inside node (t-m, JetBrains Mono)
  - Apply subtle idle drift (no edges, no connections)
  - Add "← Back to Graph" link below node (t-s)
  - Maintain four-corner frame (name top-left, nav top-right)
  - _Requirements: 404 page for 9.1, 9.2, 9.3_

- [~] 16. Add idle drift animation
  - Create `src/hooks/useIdleDrift.ts` for subtle node oscillation
  - Apply slow sine wave to node positions: `Math.sin(time * 0.4) * 3px`
  - Period: ~4 seconds per cycle, independent x and y offsets
  - Pause drift when any node is being dragged or hovered
  - Disable drift when prefers-reduced-motion is active
  - Reduce drift to ±1px on mobile (less distracting)
  - _Requirements: Idle behavior for design motion system_

- [ ] 17. Implement mobile responsiveness
  - [~] 17.1 Add mobile touch interactions
    - Update useDragNode hook to support single-finger touch gestures
    - Add pinch-to-zoom gesture handler using @use-gesture/react
    - Convert hover interactions to tap-to-preview (toggle preview card on tap)
    - Prevent default browser gestures that conflict with graph interaction
    - _Requirements: Mobile interaction for 5.1, 5.2, 5.3, 5.5_

  - [~] 17.2 Add responsive layout adjustments
    - Reduce node sizes on mobile: experience 80px, project 60px, skill 32px, contact 60px
    - Ensure minimum touch targets of 60px (increase hit area if visual is smaller)
    - Adjust initial graph zoom to 0.7x on mobile to show more nodes in viewport
    - Collapse four-corner frame: name + hamburger menu in top bar
    - Make case study layout single column on mobile (full width minus margins)
    - Convert footer contact nodes to inline list with icons (remove physics)
    - _Requirements: Mobile layout for 5.4, 5.6_

- [~] 18. Implement initial load animation
  - Create staggered entrance animation for nodes on first load
  - Animate nodes appearing in waves based on distance from center (MentorMind first)
  - Stagger interval: 40ms per node, max total time 600ms
  - Edge connections draw after their nodes appear (80ms delay each)
  - Initial spring settle animation: 1.2 seconds after all nodes loaded
  - Skip animation if user has prefers-reduced-motion active
  - _Requirements: Load animation for 1.4_

- [~] 19. Setup error states and fallback views
  - Create `src/components/graph/FallbackListView.tsx` for graph load failure
  - Display vertical cards list of projects if graph data fails to load
  - Add "Switch to graph view" button to retry graph rendering
  - Log errors to console for debugging
  - Implement retry logic for case study data: 3 attempts with exponential backoff
  - Show offline indicator if network connection lost
  - Cache case study data in sessionStorage after first load
  - _Requirements: Error handling for 9.4, 9.5, 9.6_

- [~] 20. Checkpoint - Core graph functionality complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 21. Run first QA pass
  - [~] 21.1 Build production bundle and run local preview
    - Run `npm run build` to create production build
    - Run `npm run start` to serve production build locally
    - Verify no build errors or warnings
    - Verify no console errors in browser
    - _Requirements: Production readiness for QA workflow_

  - [~] 21.2 Run shoot.mjs for visual and performance testing
    - Create `scripts/shoot.mjs` following skills/scripts/shoot.mjs pattern
    - Run `node scripts/shoot.mjs --crawl --nav` to capture screenshots, vitals, axe violations, keyboard nav, hover states
    - Review generated reports for issues: horizontal overflow, serious/critical axe violations, failed vitals
    - Verify Core Web Vitals: LCP < 2.5s, CLS < 0.05, FID < 100ms
    - Verify 60fps smooth scroll and physics animation
    - _Requirements: QA metrics from Phase 4 workflow_

  - [~] 21.3 Run audit.mjs for SEO and accessibility
    - Create `scripts/audit.mjs` following skills/scripts/audit.mjs pattern
    - Run `node scripts/audit.mjs` to check SEO, meta tags, accessibility, page weight
    - Fix any FAIL items: missing meta descriptions, incorrect heading hierarchy, images without alt text
    - Verify total page weight is reasonable (< 2MB initial load)
    - Ensure all critic scores are 8+ (if subagent available)
    - _Requirements: QA checklist from Phase 4 workflow_

- [~] 22. Fix QA issues from first pass
  - Address horizontal overflow issues (check mobile viewport, graph container)
  - Fix serious/critical axe accessibility violations
  - Optimize images to improve LCP (use next/image, add proper sizing)
  - Fix console errors or warnings
  - Improve CLS if above 0.05 (add explicit dimensions, avoid layout shifts)
  - Re-run shoot.mjs to verify fixes
  - _Requirements: Zero FAILs and serious violations per Phase 4 workflow_

- [~] 23. Run second QA pass
  - Run full QA loop again: build production, shoot.mjs, audit.mjs
  - Verify all previous issues are resolved
  - Verify Core Web Vitals meet targets on mobile and desktop
  - Verify zero horizontal overflow
  - Verify zero console errors
  - Verify zero serious/critical axe violations
  - Document any remaining warnings or nice-to-have improvements
  - _Requirements: Minimum 2 full QA passes per Phase 4 workflow_

- [~] 24. Checkpoint - QA complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 25. Implement ship checklist items
  - [~] 25.1 Create OG image and favicon
    - Create `scripts/og.mjs` following skills/scripts/og.mjs pattern to generate OG image
    - Generate 1200x630 OG image with portfolio concept (node graph visual)
    - Create favicon.ico and app icons (16x16, 32x32, 180x180, 192x192, 512x512)
    - Place icons in `public/` directory and `app/` directory (for app metadata)
    - Add metadata to `app/layout.tsx`: title, description, openGraph, twitter card
    - _Requirements: Ship checklist from Phase 5 workflow_

  - [~] 25.2 Create robots.txt and sitemap.xml
    - Create `public/robots.txt` allowing all crawlers
    - Create `app/sitemap.ts` generating sitemap.xml with all project pages
    - Include home, all case study pages, 404 page in sitemap
    - Set appropriate changefreq and priority values
    - _Requirements: Ship checklist from Phase 5 workflow_

  - [~] 25.3 Add analytics and performance monitoring
    - Add Web Vitals reporting using Next.js built-in reportWebVitals
    - Log Core Web Vitals to analytics (Google Analytics or Vercel Analytics)
    - Add performance marks for key interactions (drag, settle, navigation)
    - _Requirements: Production monitoring_

- [~] 26. Final production verification
  - Build final production bundle: `npm run build`
  - Run production server: `npm run start`
  - Test on real devices: mobile phone (iOS and Android), tablet, desktop
  - Verify all interactions work: drag, hover, keyboard, touch, zoom
  - Verify all links work: project case studies, external links, back navigation
  - Verify performance on real 3G connection (Chrome DevTools throttling)
  - Take final screenshots for documentation
  - _Requirements: Final ship verification from Phase 5 workflow_

- [~] 27. Deploy to production
  - Configure deployment target (Vercel, Netlify, or custom hosting)
  - Set environment variables if needed
  - Deploy production build
  - Verify deployed site: test all functionality on live URL
  - Submit sitemap to Google Search Console
  - Test social media sharing (OG image, title, description)
  - _Requirements: Ship phase completion_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Property-based tests are omitted (design has no Correctness Properties section)
- Unit tests are omitted to focus on implementation (can be added later)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- QA loop (tasks 21-23) is REQUIRED with minimum 2 full passes
- Ship checklist (task 25) covers all Phase 5 requirements
- Follow /awwwards workflow: Build (1-20) → QA Loop (21-24) → Ship (25-27)

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "2.2", "3.1"] },
    { "id": 2, "tasks": ["3.2", "4.1"] },
    { "id": 3, "tasks": ["4.2", "5"] },
    { "id": 4, "tasks": ["6", "7"] },
    { "id": 5, "tasks": ["8.1"] },
    { "id": 6, "tasks": ["8.2", "9.1"] },
    { "id": 7, "tasks": ["9.2", "10.1"] },
    { "id": 8, "tasks": ["10.2", "10.3", "11.1"] },
    { "id": 9, "tasks": ["11.2", "11.3", "11.4", "12.1", "13"] },
    { "id": 10, "tasks": ["12.2", "14", "15", "16", "17.1"] },
    { "id": 11, "tasks": ["17.2", "18", "19"] },
    { "id": 12, "tasks": ["21.1"] },
    { "id": 13, "tasks": ["21.2", "21.3"] },
    { "id": 14, "tasks": ["22"] },
    { "id": 15, "tasks": ["23"] },
    { "id": 16, "tasks": ["25.1", "25.2", "25.3"] },
    { "id": 17, "tasks": ["26"] },
    { "id": 18, "tasks": ["27"] }
  ]
}
```
