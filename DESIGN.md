# Design Document: The Node Graph Portfolio (SOLEZ)

## Concept Card

```
Idea:        SOLEZ's portfolio is a Nodex-style data visualization graph where projects, skills, and experiences are draggable nodes connected by edges.
Metaphor:    Force-directed computational graph and developer telemetry system (anchored in SOLEZ's Nodex tool).
Signature:   Drag any node and release — the connected graph bounces back into equilibrium with real spring physics and edge propagation.
Emotion:     Tactile engineering precision: every element has mass, momentum, and relational meaning.
Motion verb: Settle like physics (spring stiffness 150, damping 20, mass-weighted nodes).
Screenshot:  Central MentorMind hub surrounded by orbital project nodes connected via glowing teal skill edges with a live telemetry preview card.
```

## Palette

- **ground**: `#0A0E14` — Deep slate terminal background
- **ink**: `#F4F4F5` — Cool high-contrast near-white
- **muted**: `#8B92A0` — Mid-gray blue (AA contrast on ground)
- **line**: `#1E2530` — Subtle structural grid and border tone
- **accent**: `#3DF5A8` — Signal teal-green for active edges, hover states, and focus rings
- **node**: `#162432` — Elevated slate surface for interactive nodes
- **edge**: `rgba(141, 146, 160, 0.35)` — Connecting relational lines at rest

## Typography

- **Display & Data (`--f-mono`):** `JetBrains Mono` (400, 500, 700) — All node labels, coordinates, technical metadata, headings
- **Body (`--f-sans`):** `Geist` (400, 500, 600) — Descriptions, case study narratives, bio copy

## Layout & Architecture

1. **Four-Corner Frame**: Fixed HUD with SOLEZ identity (top-left), view/section navigation (top-right), social telemetry (bottom-left), and interactive status/physics coordinates (bottom-right).
2. **Interactive Node Graph (`100svh`)**: Central MentorMind experience node (`120px`), Solven.ai experience node, and 5 featured project nodes (`3DragWin`, `Nodex`, `Vell`, `URLPad`, `PySketch`) connected by labeled skill edges (`React`, `Next.js`, `TypeScript`, `Node.js`, `Python`, `Rust`, `Supabase`).
3. **Asymmetric Case Study View (`/project/$slug`)**: Shared-element hero morph, 12-column asymmetric split for Context & Challenge, technical architecture highlights, and Outcome block with next-project node link.
4. **Interactive Contact Graph Footer**: Central Contact hub connected to draggable leaf nodes (`GitHub`, `LinkedIn`, `Twitter`, `Instagram`, `Email`, `Resume`) with spring physics on desktop and accessible inline list on mobile.
