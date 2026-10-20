# Design Document: The Node Graph Portfolio

## Overview

This design document specifies the architecture and art direction system for SOLEZ's portfolio website using "The Node Graph" concept. The portfolio presents projects, skills, and experiences as an interactive node-graph visualization with spring physics, creating a memorable demonstration of technical sophistication that directly reflects SOLEZ's work on Nodex (his data visualization tool).

The design follows the Phase 2 art direction requirements, defining a complete visual system including palette, typography, grid, shape language, motion choreography, and compositional layouts for all views.

## Concept

**Concept Statement:** SOLEZ's portfolio is a Nodex-style data visualization graph where projects, skills, and experiences are draggable nodes connected by edges. Drag a node and watch the entire system respond with spring physics — everything has mass and momentum.

**Motion Verb:** "Settle like physics" — every interaction triggers spring-based motion where nodes have mass, momentum, and natural equilibrium states.

**Signature Moment:** The instant a dragged node is released and the entire connected graph bounces back into equilibrium, with edges flexing and all connected nodes responding to the disturbance propagating through the system.

**Concept Anchor:** This concept is anchored in SOLEZ's own work — Nodex, his data visualization project. The portfolio becomes a self-referential demonstration of his technical capabilities, using the visual language of computational graphs, network diagrams, and force-directed layouts.

## Art Direction System

### 1. Palette

The palette is derived from technical data visualization systems, computational graphs, and developer tools. High contrast for node legibility against a deep background, with accent colors that signal interactivity and connection states.

**Named Colors:**

- **ground**: `#0A0E14` — Deep slate, almost black but with a subtle blue undertone like a terminal background
- **ink**: `#F4F4F5` — Near-white with a cool cast, high contrast for text and primary nodes
- **muted**: `#8B92A0` — Mid-gray blue for secondary text and inactive states (AA contrast on ground)
- **line**: `#1E2530` — Subtle line color at ~15% brightness for edges and grid (when visible)
- **accent**: `#3DF5A8` — Bright teal-green signal color for hover states, active connections, and interactive feedback
- **node**: `#162432` — Slightly lighter than ground for node backgrounds, creates subtle depth
- **edge**: `rgba(141, 146, 160, 0.35)` — Muted with 35% opacity for connecting lines

**Rationale:** Avoided generic cream/terracotta and acid-green-only palettes. The teal-green accent is borrowed from data visualization and dev tools (think network graphs, monitoring dashboards) rather than being a pure UI color. The near-black background provides maximum contrast for the interactive graph while feeling technical rather than minimal-for-minimal's-sake.

### 2. Typography

**Display Family:** [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Google Fonts)  
**Role:** All node labels, technical metadata, project titles, and data-focused content  
**Weights:** 400 (regular), 500 (medium), 700 (bold)  
**Character:** Monospace with excellent legibility, designed for code but works beautifully for technical data visualization. Clear distinction between characters (0/O, 1/l/I), which matters for a portfolio about precision.

**Text Family:** [Geist](https://fonts.google.com/specimen/Geist) (Google Fonts, Vercel's grotesk)  
**Role:** Body copy, longer descriptions, case study content  
**Weights:** 400 (regular), 500 (medium), 600 (semi-bold)  
**Character:** Clean, developer-coded grotesk. Pairs naturally with JetBrains Mono without fighting for attention. Neutral enough to let the graph be the star.

**Pairing Rationale:** Mono for the graph/data layer (the concept), grotesk for the text layer (readability). Avoids the reflex Inter/Fraunces combination. Both fonts are clearly from the developer/technical world, reinforcing the concept's anchor.

**Type Scale:**

```css
--t-mega:  clamp(3.5rem, 2rem + 7.5vw, 10rem);      /* Hero name, major headings */
--t-xl:    clamp(2rem, 1.5rem + 2.5vw, 4rem);       /* Section headings */
--t-l:     clamp(1.5rem, 1.3rem + 1vw, 2.25rem);    /* Node labels (large) */
--t-m:     clamp(1.125rem, 1.05rem + 0.375vw, 1.375rem); /* Node labels (medium) */
--t-body:  clamp(1rem, 0.95rem + 0.25vw, 1.125rem); /* 16-18px body text */
--t-s:     0.875rem;  /* 14px - metadata, small labels */
--t-xs:    0.75rem;   /* 12px - very small metadata */
```

**Display Type Settings:**

```css
.display {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--t-mega);
  line-height: 0.95;               /* Tight for large mono */
  letter-spacing: -0.025em;        /* Slight tightening */
  font-variant-numeric: tabular-nums;
}

.node-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: var(--t-m);
  line-height: 1.3;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
}

.body {
  font-family: 'Geist', sans-serif;
  font-size: var(--t-body);
  line-height: 1.6;
  letter-spacing: -0.005em;
  max-width: 65ch;
}
```

### 3. Grid & Rhythm

**Desktop Grid (≥1024px):**
- 12 columns
- Gutter: `clamp(1rem, 2vw, 2rem)` (16px to 32px)
- Outer margin = gutter
- Key alignment lines: columns 1, 5, 9 (asymmetric hangs)

**Tablet Grid (768px - 1023px):**
- 8 columns
- Gutter: `1.5rem` (24px)

**Mobile Grid (< 768px):**
- 4 columns
- Gutter: `1rem` (16px)
- Simplified to 1-2 column layouts for most content

**Vertical Rhythm (Section Spacing):**
- **Tight:** `clamp(2rem, 4vw, 4rem)` — Between related content
- **Normal:** `clamp(4rem, 8vw, 8rem)` — Standard section breaks
- **Airy:** `clamp(6rem, 12vw, 12rem)` — Major transitions
- **Full:** `100svh` — For the graph canvas itself

**Node Spacing System:**
- Minimum node spacing: `80px` (desktop), `60px` (mobile)
- Edge-to-edge minimum: `20px` (after physics settle)
- Grid snap (optional, when not dragging): `40px` intervals
- Hover expansion buffer: `24px` additional clearance

**Rationale:** The grid is functional rather than decorative. The graph itself doesn't conform to the grid (it's physics-based), but the text content around it (header, case studies, footer) does. Variable spacing per section maintains visual interest without feeling random.

### 4. Shape

**Radius Rule:** `8px` for all nodes, cards, and UI elements

**Rationale:** A single, moderate radius creates cohesion without being overly rounded (not the soft SaaS card look) or sharp (not brutalist). 8px is large enough to feel intentional on node sizes ranging from 80px to 200px wide, but small enough to maintain the technical precision of the concept.

**Application:**
- Project nodes: 8px radius
- Skill tag badges: 8px radius
- Preview cards: 8px radius
- Buttons and inputs: 8px radius
- Case study image containers: 8px radius

### 5. Motion Language

**Motion Verb:** "Settle like physics"

**Core Principles:**
- Every interaction triggers spring-based physics
- Nodes have mass and momentum
- Motion is continuous, not discrete
- Equilibrium is the default state
- Disturbances propagate through connections

**Spring Physics Parameters:**

```javascript
const springConfig = {
  stiffness: 150,    // How quickly nodes return to equilibrium
  damping: 20,       // Resistance to motion (prevents endless bouncing)
  mass: 1.0,         // Node mass (can vary by node type)
  precision: 0.01,   // Stop threshold
};

// Node type variations:
const nodeTypes = {
  project: { mass: 1.2, radius: 80 },      // Heavier, more momentum
  experience: { mass: 1.5, radius: 100 },  // Heaviest, slowest to settle
  skill: { mass: 0.6, radius: 40 },        // Lighter, quicker response
  contact: { mass: 0.8, radius: 60 },
};
```

**Duration Palette:**

```css
--dur-instant: 0ms;          /* Immediate response (drag follow) */
--dur-feedback: 150ms;       /* Hover feedback */
--dur-quick: 300ms;          /* UI state changes */
--dur-settle: 1200ms;        /* Full physics settle time */
--dur-transition: 800ms;     /* Page transitions */
```

**Easing Functions:**

Primary: **Spring curve** (CSS `cubic-bezier(0.175, 0.885, 0.32, 1.275)` approximation)  
Secondary: **Expo out** for non-physics motion (`cubic-bezier(0.19, 1, 0.22, 1)`)  
Hovers: **Power3 out** (`cubic-bezier(0.215, 0.61, 0.355, 1)`)

**Motion Behaviors:**

1. **Drag Interaction:**
   - Follow pointer with < 50ms latency (direct position update, no interpolation)
   - Dragged node z-index: 100
   - Connected edges update in real-time
   - Other nodes respond with weak repulsion forces

2. **Release & Settle:**
   - Spring force toward original equilibrium position
   - Collision detection prevents overlap
   - Momentum carries initial velocity
   - Complete settle within 1.2 seconds
   - Connected nodes feel pull through edges (propagation)

3. **Hover States:**
   - Node scale: 1.0 → 1.08 (150ms, power3.out)
   - Border color: transparent → accent (150ms)
   - Connected edges: opacity 0.35 → 0.8, color → accent (150ms)
   - Preview card: fade in (200ms, expo.out), slight scale 0.95 → 1.0

4. **Stagger Rules:**
   - Initial load: nodes appear in waves based on distance from center
   - Stagger interval: 40ms per node
   - Max total stagger time: 600ms (for large graphs)
   - Edge connections draw after their nodes appear (80ms delay each)

5. **Page Transitions:**
   - Shared element: clicked node morphs into case study hero (800ms)
   - Other nodes: scale down and fade (400ms)
   - Canvas: fade to transparent (600ms)
   - Reverse on back navigation

**Idle State:**
- Subtle drift on all nodes: ±2-3px slow oscillation
- Period: ~4 seconds per cycle
- Driven by `Math.sin(time * 0.4) * 3` on x and y independently
- Pauses when any node is being interacted with
- Disabled on `prefers-reduced-motion`

**Reduced Motion:**
- Spring physics disabled
- Drag becomes direct position update with no momentum
- Settle is instant with crossfade (300ms)
- Hover scale preserved, spring removed
- Page transitions become simple crossfades (400ms)

**Rationale:** The motion system IS the concept. Spring physics are the signature, not a decoration. Every timing is chosen to feel like real physical objects with mass. Avoided generic GSAP defaults (power2) in favor of spring curves. The idle drift keeps the system "breathing" even at rest.

### 6. Composition Plan

#### A. Home View (Graph Canvas)

```
┌────────────────────────────────────────────────────────┐
│ SOLEZ              Work  About  Contact │  [Four corners]
│                                                          │
│                                                          │
│               ●────────●──────●                         │
│              ╱│╲       │      │╲                        │
│             ╱ │ ╲      │      │ ●                       │
│            ●  │  ●─────●──────┘  ╲                      │
│           ╱   │   ╲    │          ●                     │
│          ╱    ●────●───●                                │
│         ●    MentorMind                                 │
│       Projects spread                                    │
│       with physics                                       │
│                                                          │
│                                                          │
│ GitHub · LinkedIn                        Drag to explore│
└────────────────────────────────────────────────────────┘
```

**Layout:**
- Full viewport height (`100svh`)
- Graph canvas fills the viewport (no scroll initially)
- Four-corner frame:
  - Top-left: "SOLEZ" (name as home link, t-l size)
  - Top-right: Nav links (Work, About, Contact, t-s size)
  - Bottom-left: Social links (GitHub, Twitter, LinkedIn, Instagram, t-xs)
  - Bottom-right: Contextual hint ("Drag to explore", fades after first interaction)
- MentorMind node at center (largest node, 120px diameter)
- 5 project nodes orbiting around MentorMind
- Skill tags as edge labels between connected nodes
- Scroll down reveals footer section (additional content below the fold)

**Node Layout (Initial Positions):**
- Center: MentorMind (Experience node, y: 50vh)
- Ring 1 (~220px radius): 3DragWin, Nodex, URLPad (Project nodes)
- Ring 2 (~360px radius): Vell, PySketch (Project nodes)
- Edges connect projects to MentorMind and to each other based on shared skills

#### B. Case Study Page Layout

```
┌────────────────────────────────────────────────────────┐
│ ← Back                                            SOLEZ │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │          [Hero Image / Demo]                     │  │
│  │                                                    │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  PROJECT NAME                                           │
│  Brief description here                                 │
│                                                          │
│  ┌────────────┐                                         │
│  │  Meta Grid │  Client: [Name] · Year: 2026           │
│  │            │  Role: Full Stack Developer             │
│  │  Stacked   │  Tech: React, Node.js, PostgreSQL      │
│  └────────────┘                                         │
│                                                          │
│  ┌──────────────────────────┐  ┌──────────────────────┐│
│  │ Context                  │  │  Challenge           ││
│  │ (spans 6 cols)           │  │  (spans 6 cols)      ││
│  └──────────────────────────┘  └──────────────────────┘│
│                                                          │
│  [Screenshots / Media Gallery]                          │
│  [Staggered asymmetric pairs]                           │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Outcome                                          │  │
│  │ (full width, 10 cols centered)                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  [Live Demo] · [GitHub]                                 │
│                                                          │
│  Next Project → [Node preview]                          │
│                                                          │
└────────────────────────────────────────────────────────┘
```

**Layout Family:** Asymmetric pairs + statement blocks
- Back navigation: top-left corner, returns to graph
- Name persists: top-right corner
- Hero: Full width, 60vh min-height, contains morphed node from transition
- Project title: t-xl, left-aligned, col 2-11
- Meta grid: Stacked labels (Client, Year, Role, Tech), col 2-4, t-s mono
- Content: Alternating 6-6 column splits and full-width statement blocks
- Media: Asymmetric pairs (large image 7-8 cols, offset vertically)
- Footer action: "Next Project" as a small node preview with spring hover

#### C. Footer Section

```
┌────────────────────────────────────────────────────────┐
│                                                          │
│                     LET'S CONNECT                       │
│                                                          │
│              ●────────●────────●────────●               │
│              │        │        │        │               │
│           GitHub  LinkedIn Twitter  Email              │
│              │        │        │        │               │
│              └────────●────────┘        │               │
│                    Contact              │               │
│                                         ●               │
│                                      Resume             │
│                                                          │
│  Full Stack Developer                                   │
│  Building elegant technical solutions                   │
│                                                          │
│  © 2025 SOLEZ                                           │
│                                                          │
└────────────────────────────────────────────────────────┘
```

**Layout:**
- Full viewport height section
- "LET'S CONNECT" headline (t-xl, centered)
- Contact links as small leaf nodes (60px diameter) connected to central "Contact" hub node
- Same spring physics as main graph
- Brief statement below: 2 lines, t-m, centered, Geist font
- Copyright: t-xs, bottom-left corner

#### D. 404 Page

```
┌────────────────────────────────────────────────────────┐
│ SOLEZ                                              Home │
│                                                          │
│                                                          │
│                         ●                               │
│                       404:                              │
│                    Not Found                            │
│                                                          │
│                  (disconnected node)                     │
│                   (no edges)                            │
│                                                          │
│                                                          │
│                   ← Back to Graph                       │
│                                                          │
│                                                          │
│                                                          │
└────────────────────────────────────────────────────────┘
```

**Layout:**
- Same four-corner frame
- Single disconnected node at center (120px diameter)
- "404: Not Found" label inside node (t-m mono)
- Node has subtle idle drift but no connections
- "Back to Graph" link below (t-s)
- Reinforces the concept: a node that doesn't belong in the system

### 7. Mobile Composition (390px)

**Key Changes:**
- Graph becomes scrollable vertically (nodes stack more densely)
- Touch target minimum: 60px (up from desktop 44px for better ergonomics)
- Drag remains core interaction (touch-based)
- Pinch-to-zoom enabled for graph exploration
- Tap on node shows preview card (replaces hover)
- Four-corner frame collapses:
  - Top bar: Name left, hamburger menu right
  - Bottom bar: Contextual actions only
- Node sizes reduced:
  - Experience: 80px (from 120px)
  - Project: 60px (from 80px)
  - Skill: 32px (from 40px)
- Case study: Single column (all content spans full width minus margins)
- Footer nodes: Inline list with icons, spring physics removed

**Interaction Adaptations:**
- Hover states → Tap to preview, tap outside to dismiss
- Cursor follower → Disabled
- Idle drift → Reduced to ±1px (less distracting on small screens)
- Initial graph zoom: 0.7x to show more nodes in viewport

## Architecture

The portfolio is built as a Next.js 14+ application using the App Router, with React 18+ and TypeScript. The architecture separates concerns into four main layers:

1. **Presentation Layer**: React components managing UI rendering and user interactions
2. **Physics Layer**: Custom spring simulation engine handling node positions and motion
3. **State Layer**: Zustand store managing graph state, drag interactions, and navigation
4. **Data Layer**: Static content from markdown, type-safe data models

The graph can be rendered via SVG (for smaller graphs, better accessibility) or Canvas (for performance with 15+ nodes). A hybrid approach is also viable where the graph renders to Canvas but DOM elements overlay for interactive nodes and labels.

### Technology Stack

**Framework:** Next.js 14+ (App Router)  
**UI:** React 18+ with TypeScript, Tailwind CSS + CSS Modules  
**Animation:** GSAP 3.12+ for page transitions and choreography  
**Physics:** Custom spring simulation (or react-spring for DOM-based nodes)  
**State:** Zustand for graph state, React Context for theme/interactions  
**Build:** Turbopack (Next.js default)

**Key Libraries:**
- `d3-force` (optional, for initial force-directed layout)
- `react-use-gesture` for advanced touch/drag handling
- GSAP ScrollTrigger for footer reveals and scroll-based animations
- Sharp for image optimization

### Data Flow

```
Content (MD) → Parser → Typed Data Models → State Store → Components → Canvas/SVG → Screen
                                              ↓
                              Physics Engine (Node positions, velocities)
                                              ↓
                              Interaction Manager (Drag, hover, keyboard)
```

User interactions flow through the Interaction Manager, which updates the state store. The Physics Engine reads state and computes new positions on each frame. Components subscribe to state changes and re-render. Page transitions are coordinated by GSAP timelines that morph shared elements between views.

## Components and Interfaces

## Data Models

The portfolio uses strongly-typed data models to represent the graph structure and content.

**Node Interface:**
```typescript
interface Node {
  id: string;
  type: 'project' | 'experience' | 'skill' | 'contact';
  label: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  mass: number;
  radius: number;
  fixed: boolean;  // If true, doesn't respond to physics
  data: ProjectData | ExperienceData | SkillData | ContactData;
}

interface ProjectData {
  slug: string;
  name: string;
  brief: string;
  technologies: string[];
  thumbnailUrl: string;
  client?: string;
  year: number;
  role: string;
}

interface ExperienceData {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
}

interface SkillData {
  name: string;
  category: 'language' | 'framework' | 'tool';
}

interface ContactData {
  platform: string;
  url: string;
  icon: string;
}
```

**Edge Interface:**
```typescript
interface Edge {
  id: string;
  source: string;  // Node id
  target: string;  // Node id
  label?: string;  // Skill name for project edges
  strength: number; // Spring strength (0-1)
}
```

**Graph State Interface:**
```typescript
interface GraphState {
  nodes: Node[];
  edges: Edge[];
  isDragging: boolean;
  draggedNodeId: string | null;
  hoveredNodeId: string | null;
  focusedNodeId: string | null;
  zoom: number;
  pan: { x: number; y: number };
  isSettled: boolean;
  viewport: { width: number; height: number };
}
```

**Physics Configuration:**
```typescript
interface SpringConfig {
  stiffness: number;    // 150
  damping: number;      // 20
  mass: number;         // 1.0 base
  precision: number;    // 0.01 stop threshold
}

interface NodeTypeConfig {
  mass: number;
  radius: number;
  color: string;
}
```

These models ensure type safety throughout the application and provide clear contracts between components, the physics engine, and the state store.

## Testing Strategy

### Unit Testing
- **Component tests**: React Testing Library for Node, Edge, PreviewCard components
- **Physics tests**: Jest for spring simulation math, collision detection, equilibrium convergence
- **State tests**: Zustand store actions and selectors
- **Data transformation**: Parser tests for content.md → data models

### Integration Testing
- **Graph rendering**: Verify nodes and edges render from data
- **Drag interaction**: Simulate pointer events, verify position updates
- **Navigation**: Click node → route changes → case study loads
- **Accessibility**: Keyboard navigation, focus management, ARIA labels

### Visual Regression Testing
- **Chromatic or Percy**: Screenshot comparison for graph layouts, hover states, page transitions
- **Mobile views**: Touch targets, responsive breakpoints

### Performance Testing
- **Lighthouse**: FCP, TTI, performance scores
- **Manual profiling**: Physics frame rate, drag latency measurement
- **Memory**: Heap snapshots for state size

### Property-Based Testing (Selected Properties)
- **Property 2**: Physics equilibrium convergence (random initial states → always settles)
- **Property 9**: URL state round-trip (random states → encode → decode → equals)
- **Property 4**: Highlighting (any node hover → connected edges highlighted)

Minimum 100 iterations per property test due to randomization.

### Content Validation
- **Snapshot tests**: Ensure 5 projects, 2 experiences, required contact links present
- **Link validation**: Verify external URLs are well-formed

---

### Core Components

**1. GraphCanvas**
- Manages SVG or Canvas rendering of entire graph
- Owns physics simulation state
- Handles window resize and zoom
- Exposes node positions for overlaid DOM elements (if using hybrid approach)

**2. Node**
- Individual node rendering (project, experience, skill, contact)
- Handles drag interactions
- Manages hover/focus states
- Contains label and metadata
- Can be SVG, Canvas-rendered, or DOM element

**3. Edge**
- Line/curve connecting two nodes
- Updates position when connected nodes move
- Animates on hover (parent node highlight)
- Contains skill label for project-project connections

**4. PreviewCard**
- Hover/tap card showing project details
- Positioned near hovered node (avoids viewport edges)
- Contains: thumbnail, title, brief description, tech stack
- Fades in with slight scale

**5. PhysicsEngine**
- Spring simulation loop
- Collision detection
- Force calculations (attraction, repulsion, spring)
- Velocity and position updates
- Exposes settle state for animation coordination

**6. InteractionManager**
- Mouse/touch event handling
- Drag state management
- Zoom and pan controls
- Keyboard navigation support
- Focus trap for accessibility

**7. PageTransition**
- Shared element animation controller
- Morphs clicked node into case study hero
- Manages z-index and position interpolation
- Coordinates with routing

### Data Models (moved above)

## Accessibility

**Keyboard Navigation:**
- Tab cycles through nodes in logical order (center outward)
- Enter/Space on focused node navigates to case study
- Arrow keys for manual graph navigation
- Ctrl/Cmd + or - for zoom
- Escape dismisses preview cards

**Screen Readers:**
- Each node has descriptive ARIA label: "Project: Nodex, connected to React, Node.js, D3.js"
- Graph announced as "Interactive portfolio graph, 5 projects, 2 experiences"
- Edge connections described in node labels
- Preview cards use `aria-live="polite"` for content updates
- "Drag to explore" hint has `aria-describedby` relationship with canvas

**Focus Indicators:**
- 3px accent color outline on focused nodes
- Persists during drag if drag initiated with keyboard
- High contrast mode: uses system focus color

**Reduced Motion:**
- Spring physics disabled, instant position updates
- Hover scales preserved, momentum removed
- Page transitions become simple crossfades
- Idle drift disabled
- User preference honored: `prefers-reduced-motion: reduce`

**Color Contrast:**
- All text meets WCAG AA (4.5:1 minimum)
- Muted text: 4.6:1 on ground
- Node labels: 13.8:1 on node background
- Accent on ground: 8.2:1
- Focus indicators: 3:1 minimum against backgrounds

## Error Handling

**Graph Load Failure:**
- Display fallback list view of projects (vertical cards)
- "Switch to graph view" button to retry
- Console error logged for debugging

**Image Load Failure:**
- Node shows placeholder icon
- Preview card shows title/description only
- Doesn't block graph rendering

**Physics Performance Issues:**
- Detect low frame rate (< 30fps sustained)
- Reduce simulation precision
- Optionally disable idle drift
- Show "Performance mode" indicator

**Network Errors:**
- Retry logic for case study data (3 attempts)
- Offline indicator if no connection
- Cache case study data in sessionStorage after first load

## Performance Targets

**Loading:**
- First Contentful Paint: < 1.5s (3G)
- Time to Interactive (graph): < 3s (3G)
- Lighthouse Performance: 90+

**Runtime:**
- Physics simulation: 60fps on devices from 2020+
- Drag latency: < 50ms from pointer to visual update
- Memory: < 50MB for graph state and rendering
- Node count limit: 20 nodes before performance degradation (current: 10-12)

**Optimization Strategies:**
- Request idle callback for non-critical updates
- Canvas rendering for large graphs (> 15 nodes)
- Lazy load case study content (route-based code splitting)
- Preload first 3 project images during idle
- Debounce resize recalculations (150ms)
- Use CSS `will-change` only during active drag

## Genericness Test Review

**Palette:** ✓ Custom deep slate + teal accent derived from dev tools, not AI cream/terracotta default  
**Typography:** ✓ JetBrains Mono + Geist, not Inter/Fraunces reflex  
**Motion:** ✓ Spring physics as concept, not decoration  
**Layout:** ✓ Graph canvas, not broadsheet/card kit  
**Signature:** ✓ "Drag and settle" is specific to this concept  
**Hover:** ✓ Scale + edge highlight, not generic magnetic pull + cursor dot  
**Accents:** ✓ Mono for data layer, not "→" appended to every link  
**404:** ✓ Disconnected node, concept-driven

**Changes Made:**
- Avoided cream (#F4F1EA) + terracotta palette
- Avoided "A · B · C" meta strings format
- Avoided uppercase eyebrow labels above every heading
- Avoided identical rounded cards with soft shadows
- Avoided cursor replacement (if implemented, adds to native, never replaces)

## Implementation Notes

**Graph Layout Algorithm:**
- Initial positions: polar coordinates (rings around center)
- MentorMind at origin (0, 0) in graph space
- Projects distributed evenly on 2 rings
- Skill nodes positioned as edge midpoint labels, not independent nodes (simplifies physics)
- Optional: Use force-directed layout for 10 seconds after load, then lock positions for consistency

**Spring Physics Pseudocode:**
```
for each node:
  if not dragging:
    // Spring force toward equilibrium
    force += -stiffness * (position - equilibrium)
    
    // Damping (velocity resistance)
    force += -damping * velocity
    
    // Repulsion from other nodes (prevent overlap)
    for each other_node:
      distance = length(node.position - other.position)
      if distance < (node.radius + other.radius + buffer):
        repulsion = normalize(node.position - other.position) * repulsionStrength
        force += repulsion
  
  // Update velocity and position
  acceleration = force / mass
  velocity += acceleration * deltaTime
  position += velocity * deltaTime
  
  // Check if settled (low velocity)
  if length(velocity) < threshold:
    settled = true
```

**Shared Element Transition:**
1. On node click, capture node's bounding rect
2. Clone node element, position fixed at captured rect
3. Start page transition (fade out other nodes)
4. GSAP morph clone to case study hero position
5. On new page, hero starts at final morph position
6. Remove clone, reveal actual hero content with crossfade

**URL State Persistence:**
- Hash format: `#x={x}&y={y}&z={zoom}`
- Update on drag end, zoom change (debounced 300ms)
- Restore on page load with spring animation to saved position
- Case study URLs: `/work/[project-slug]`

## Content Strategy

**Node Content Sources:**
- Project nodes: From existing `content.md` (3DragWin, Nodex, Vell, URLPad, PySketch)
- Experience nodes: MentorMind (Feb 2026 - Present), Solven.ai (2025, 6 months)
- Contact nodes: GitHub, Twitter, LinkedIn, Instagram, Email
- Skill edges: React, Next.js, TypeScript, Node.js, Python, Rust, Supabase, PostgreSQL, Tailwind

**Case Study Structure:**
1. Hero image/demo (morphed from node)
2. Project name and brief (2-3 sentences)
3. Meta grid (client, year, role, tech stack)
4. Context (problem statement)
5. Challenge (technical obstacles)
6. Screenshots (3-5 images, staggered layout)
7. Outcome (results, impact, learnings)
8. Links (live demo, GitHub, if available)
9. Next project (node preview with hover)

**Copy Voice:**
- Technical but not jargon-heavy
- Confident without boasting
- Specific metrics when available ("Reduced load time by 40%")
- Honest about constraints and tradeoffs
- First person ("I built", "we architected") when appropriate

## Design Tokens

```css
:root {
  /* Colors */
  --ground: #0A0E14;
  --ink: #F4F4F5;
  --muted: #8B92A0;
  --line: #1E2530;
  --accent: #3DF5A8;
  --node-bg: #162432;
  --edge: rgba(141, 146, 160, 0.35);
  
  /* Typography */
  --f-mono: 'JetBrains Mono', monospace;
  --f-sans: 'Geist', sans-serif;
  
  --t-mega: clamp(3.5rem, 2rem + 7.5vw, 10rem);
  --t-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);
  --t-l: clamp(1.5rem, 1.3rem + 1vw, 2.25rem);
  --t-m: clamp(1.125rem, 1.05rem + 0.375vw, 1.375rem);
  --t-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --t-s: 0.875rem;
  --t-xs: 0.75rem;
  
  /* Spacing */
  --gutter: clamp(1rem, 2vw, 2rem);
  --space-tight: clamp(2rem, 4vw, 4rem);
  --space-normal: clamp(4rem, 8vw, 8rem);
  --space-airy: clamp(6rem, 12vw, 12rem);
  
  /* Node sizes */
  --node-experience: 120px;
  --node-project: 80px;
  --node-skill: 40px;
  --node-contact: 60px;
  
  /* Motion */
  --dur-instant: 0ms;
  --dur-feedback: 150ms;
  --dur-quick: 300ms;
  --dur-settle: 1200ms;
  --dur-transition: 800ms;
  
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-power3: cubic-bezier(0.215, 0.61, 0.355, 1);
  
  /* Shape */
  --radius: 8px;
  
  /* Z-index scale */
  --z-base: 0;
  --z-edges: 1;
  --z-nodes: 10;
  --z-preview: 50;
  --z-dragging: 100;
  --z-header: 200;
  --z-transition: 1000;
}

@media (max-width: 767px) {
  :root {
    --node-experience: 80px;
    --node-project: 60px;
    --node-skill: 32px;
    --node-contact: 48px;
  }
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptance Criteria Testing Prework

**1.1** WHEN the Home_View loads, THE Node_Graph_Component SHALL render all Project_Nodes within 2 seconds  
  **Thoughts:** This is a performance requirement about render time. We can test this by measuring time from mount to all nodes visible.  
  **Classification:** EXAMPLE  
  **Test Strategy:** Unit test with mock data, measure render completion time

**1.2** WHEN the Home_View loads, THE Node_Graph_Component SHALL render all Skill_Nodes as edges connecting related Project_Nodes  
  **Thoughts:** This is about data transformation - skills become edge labels. For any graph configuration, edges should represent skills.  
  **Classification:** PROPERTY  
  **Test Strategy:** Generate random graph data, verify edges match skill relationships

**1.3** WHEN the Home_View loads, THE Node_Graph_Component SHALL position MentorMind as the central Experience_Node  
  **Thoughts:** This is a specific layout requirement about one particular node.  
  **Classification:** EXAMPLE  
  **Test Strategy:** Unit test verifying MentorMind position is center

**1.4** WHEN the graph rendering completes, THE Node_Graph_Component SHALL animate nodes into position using Spring_Physics over 1.2 seconds  
  **Thoughts:** This is about animation completion time, specific to initial load.  
  **Classification:** EXAMPLE  
  **Test Strategy:** Unit test with animation mocking, verify duration

**1.5** THE Node_Graph_Component SHALL display a minimum of 5 Project_Nodes corresponding to featured projects  
  **Thoughts:** This is a specific count requirement based on current content.  
  **Classification:** EXAMPLE  
  **Test Strategy:** Snapshot test of rendered output

**1.6** THE Node_Graph_Component SHALL display edges labeled with technology names from the Glossary of skills  
  **Thoughts:** This is about data integrity - edge labels should match skill names from source data.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any set of skills, edge labels should only contain valid skill names

**2.1** WHEN a Visitor initiates Drag_Interaction on any Node, THE Node_Graph_Component SHALL move the Node to follow the pointer position with less than 50ms latency  
  **Thoughts:** This is a performance requirement about input latency.  
  **Classification:** INTEGRATION  
  **Test Strategy:** Manual performance testing, browser dev tools measurement

**2.2** WHILE a Node is being dragged, THE Node_Graph_Component SHALL update connected Edge positions in real-time  
  **Thoughts:** This is a universal property - for any node with edges, dragging updates edge positions.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any node with N edges, all N edge positions update during drag

**2.3** WHEN a Visitor releases a dragged Node, THE Node_Graph_Component SHALL apply Spring_Physics to settle the Node into equilibrium  
  **Thoughts:** This is a universal physics behavior that should apply to all nodes.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any node, release triggers physics simulation until velocity < threshold

**2.4** WHEN a dragged Node is released, THE Node_Graph_Component SHALL apply repulsion forces to prevent Node overlap  
  **Thoughts:** This is an invariant - no two nodes should overlap after physics settle.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any pair of nodes, distance ≥ (radius1 + radius2 + buffer) after settle

**2.5** WHILE a Node is being dragged, THE Node_Graph_Component SHALL increase the visual z-index of the Node  
  **Thoughts:** This is a universal UI behavior for all dragged nodes.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any node being dragged, z-index > resting z-index

**2.6** WHEN Spring_Physics are active, THE Node_Graph_Component SHALL complete settling animation within 3 seconds  
  **Thoughts:** This is a performance invariant about physics completion time.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any physics disturbance, settle time < 3s threshold

**3.1** WHEN a Visitor hovers over a Project_Node, THE Node_Graph_Component SHALL display a preview card within 100ms  
  **Thoughts:** This is a performance requirement about hover feedback timing.  
  **Classification:** INTEGRATION  
  **Test Strategy:** Manual testing with performance measurement

**3.2** WHEN a preview card is displayed, THE Portfolio_System SHALL show the project name, brief description, and primary technologies  
  **Thoughts:** This is about data completeness - preview cards must contain specific fields.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any project node, preview contains name, description, and tech fields

**3.3** WHEN a Visitor hovers over a Project_Node, THE Node_Graph_Component SHALL highlight all connected Edges  
  **Thoughts:** This is a universal behavior - hovering any node highlights its edges.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any node with N edges, hover highlights all N edges

**3.4** WHEN a Visitor moves the pointer away from a Project_Node, THE Node_Graph_Component SHALL hide the preview card within 100ms  
  **Thoughts:** This is a performance requirement about hover exit timing.  
  **Classification:** INTEGRATION  
  **Test Strategy:** Manual testing with performance measurement

**3.5** WHERE the preview card would extend beyond the viewport, THE Node_Graph_Component SHALL reposition the card to remain fully visible  
  **Thoughts:** This is a universal constraint - preview cards must stay in viewport bounds.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any node position, preview card rect intersects with viewport

**3.6** WHEN a Visitor hovers over a Skill_Node edge label, THE Node_Graph_Component SHALL highlight all Project_Nodes using that skill  
  **Thoughts:** This is about relationship highlighting - for any skill, all related projects highlight.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any skill edge, hover highlights all connected project nodes

**4.1** WHEN a Visitor clicks a Project_Node, THE Portfolio_System SHALL navigate to the Case_Study_View for that project  
  **Thoughts:** This is a universal navigation behavior for all project nodes.  
  **Classification:** PROPERTY  
  **Test Strategy:** For any project node, click navigates to correct case study route

**4.2** WHEN navigating to Case_Study_View, THE Portfolio_System SHALL use a shared-element transition animating the clicked Node into the hero section over 400ms  
  **Thoughts:** This is a specific animation requirement about transition timing.  
  **Classification:** EXAMPLE  
  **Test Strategy:** Unit test verifying transition duration

**4.3-4.7** (Case study content display requirements)  
  **Thoughts:** These are all data display requirements - for any project, specific fields must be shown.  
  **Classification:** PROPERTY (for field presence), EXAMPLE (for specific link types)  
  **Test Strategy:** For any project, case study displays required fields; unit tests for link rendering

**5.1-5.6** (Mobile responsiveness requirements)  
  **Thoughts:** These are platform-specific behavior requirements and UI adaptations.  
  **Classification:** INTEGRATION (touch interaction), EXAMPLE (specific breakpoints)  
  **Test Strategy:** Manual testing on real devices, viewport size tests

**6.1-6.6** (Performance and loading requirements)  
  **Thoughts:** These are performance metrics and timing requirements.  
  **Classification:** INTEGRATION  
  **Test Strategy:** Lighthouse audits, manual throttling tests, performance monitoring

**7.1-7.7** (Accessibility requirements)  
  **Thoughts:** These are WCAG compliance and assistive technology requirements.  
  **Classification:** INTEGRATION  
  **Test Strategy:** Automated accessibility tests (axe), manual screen reader testing

**8.1-8.6** (Content accuracy requirements)  
  **Thoughts:** These are specific data requirements about current portfolio content.  
  **Classification:** EXAMPLE  
  **Test Strategy:** Snapshot tests, content validation unit tests

**9.1-9.6** (Error handling requirements)  
  **Thoughts:** These are error state and fallback behaviors.  
  **Classification:** EXAMPLE (specific error states), PROPERTY (fallback behavior pattern)  
  **Test Strategy:** Unit tests with error injection, network throttling

**10.1-10.6** (Footer and contact requirements)  
  **Thoughts:** These are specific UI layout and content requirements.  
  **Classification:** EXAMPLE  
  **Test Strategy:** Snapshot tests, link presence validation

**11.1-11.6** (URL state persistence requirements)  
  **Thoughts:** These are about state serialization - for any graph state, URL encodes/decodes correctly.  
  **Classification:** PROPERTY  
  **Test Strategy:** Round-trip serialization tests for various states

**12.1-12.6** (Visual design system requirements)  
  **Thoughts:** These are CSS and visual styling requirements.  
  **Classification:** EXAMPLE (specific values), PROPERTY (consistency rules)  
  **Test Strategy:** Visual regression tests, CSS unit tests

### Property 1: Edge Position Synchronization

*For any* node in the graph, when its position changes (by drag, physics, or animation), all edges connected to that node SHALL update their positions to maintain connection to the node's current coordinates.

**Validates: Requirements 2.2**

### Property 2: Physics Equilibrium Convergence

*For any* node released after dragging, the spring physics simulation SHALL converge to a stable equilibrium state where (1) velocity approaches zero, (2) no nodes overlap (distance ≥ sum of radii + buffer), and (3) convergence completes within 3 seconds.

**Validates: Requirements 2.3, 2.4, 2.6**

### Property 3: Preview Card Viewport Containment

*For any* node position on the graph canvas, when a preview card is triggered, the card's bounding rectangle SHALL be repositioned if necessary such that it remains fully contained within the viewport bounds.

**Validates: Requirements 3.5**

### Property 4: Node-Edge Relationship Highlighting

*For any* node or edge in the graph, hovering over it SHALL highlight all directly connected elements (edges connected to a hovered node, or nodes connected by a hovered edge).

**Validates: Requirements 3.3, 3.6**

### Property 5: Project Navigation Mapping

*For any* project node in the graph, clicking that node SHALL navigate to a case study view whose URL path corresponds to the project's identifier.

**Validates: Requirements 4.1**

### Property 6: Case Study Content Completeness

*For any* project displayed in case study view, the rendered page SHALL contain all mandatory fields: project name, description, meta grid (client, year, role, technologies), and outcome section.

**Validates: Requirements 4.3, 4.4**

### Property 7: Data-Edge Consistency

*For any* skill relationship in the project data, there SHALL exist a corresponding edge in the rendered graph connecting the related project nodes, labeled with the skill name.

**Validates: Requirements 1.2, 1.6**

### Property 8: Drag Visual Feedback

*For any* node being actively dragged, its rendered z-index SHALL be greater than all non-dragged nodes' z-indexes.

**Validates: Requirements 2.5**

### Property 9: URL State Round-Trip

*For any* valid graph state (zoom level, pan position, focused node), encoding that state into the URL hash and then decoding the hash SHALL produce an equivalent graph state.

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 10: Node Type Visual Distinction

*For any* pair of nodes with different types (project vs. experience vs. contact), the nodes SHALL have visually distinct treatments (different sizes, colors, or styling) such that type can be inferred from appearance.

**Validates: Requirements 12.3**

---

*End of Design Document*
