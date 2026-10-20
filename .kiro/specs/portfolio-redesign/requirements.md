# Requirements Document

## Introduction

This document specifies the requirements for redesigning SOLEZ's portfolio website using "The Node Graph" concept. The portfolio will function as an interactive node-graph visualization inspired by Nodex (SOLEZ's own data visualization tool), where projects, skills, and experiences are represented as nodes with relational edges. The primary goal is to create a memorable, technically sophisticated portfolio that demonstrates SOLEZ's capabilities while providing an intuitive exploration experience for freelance clients, founders, agencies, and potential collaborators.

## Glossary

- **Portfolio_System**: The Next.js-based web application serving SOLEZ's portfolio
- **Node**: A visual element representing a project, skill, experience, or contact point
- **Edge**: A visual connection line between two nodes representing a relationship
- **Graph**: The complete network of interconnected nodes and edges
- **Node_Graph_Component**: The interactive visualization component rendering the graph
- **Visitor**: A user viewing the portfolio website
- **Project_Node**: A node representing one of SOLEZ's completed projects
- **Skill_Node**: A node representing a technology or skill
- **Experience_Node**: A node representing work experience (MentorMind, Solven.ai)
- **Case_Study_View**: A detailed view of a single project accessed by clicking a node
- **Drag_Interaction**: User input where a visitor presses and moves a pointer to reposition a node
- **Spring_Physics**: Animation behavior where nodes move with momentum and settle gradually
- **Home_View**: The primary graph visualization view
- **Mobile_View**: The portfolio layout optimized for touch devices
- **Desktop_View**: The portfolio layout optimized for pointer devices

## Requirements

### Requirement 1: Interactive Node Graph Display

**User Story:** As a visitor, I want to see SOLEZ's work as an interactive graph visualization, so that I can understand his technical ecosystem at a glance.

#### Acceptance Criteria

1. WHEN the Home_View loads, THE Node_Graph_Component SHALL render all Project_Nodes within 2 seconds
2. WHEN the Home_View loads, THE Node_Graph_Component SHALL render all Skill_Nodes as edges connecting related Project_Nodes
3. WHEN the Home_View loads, THE Node_Graph_Component SHALL position MentorMind as the central Experience_Node
4. WHEN the graph rendering completes, THE Node_Graph_Component SHALL animate nodes into position using Spring_Physics over 1.2 seconds
5. THE Node_Graph_Component SHALL display a minimum of 5 Project_Nodes corresponding to featured projects
6. THE Node_Graph_Component SHALL display edges labeled with technology names from the Glossary of skills

### Requirement 2: Node Dragging and Physics

**User Story:** As a visitor, I want to drag nodes around the graph, so that I can explore relationships and interact with the portfolio.

#### Acceptance Criteria

1. WHEN a Visitor initiates Drag_Interaction on any Node, THE Node_Graph_Component SHALL move the Node to follow the pointer position with less than 50ms latency
2. WHILE a Node is being dragged, THE Node_Graph_Component SHALL update connected Edge positions in real-time
3. WHEN a Visitor releases a dragged Node, THE Node_Graph_Component SHALL apply Spring_Physics to settle the Node into equilibrium
4. WHEN a dragged Node is released, THE Node_Graph_Component SHALL apply repulsion forces to prevent Node overlap
5. WHILE a Node is being dragged, THE Node_Graph_Component SHALL increase the visual z-index of the Node
6. WHEN Spring_Physics are active, THE Node_Graph_Component SHALL complete settling animation within 3 seconds

### Requirement 3: Node Hover and Preview

**User Story:** As a visitor, I want to hover over project nodes to see details, so that I can quickly understand what each project is without leaving the graph.

#### Acceptance Criteria

1. WHEN a Visitor hovers over a Project_Node, THE Node_Graph_Component SHALL display a preview card within 100ms
2. WHEN a preview card is displayed, THE Portfolio_System SHALL show the project name, brief description, and primary technologies
3. WHEN a Visitor hovers over a Project_Node, THE Node_Graph_Component SHALL highlight all connected Edges
4. WHEN a Visitor moves the pointer away from a Project_Node, THE Node_Graph_Component SHALL hide the preview card within 100ms
5. WHERE the preview card would extend beyond the viewport, THE Node_Graph_Component SHALL reposition the card to remain fully visible
6. WHEN a Visitor hovers over a Skill_Node edge label, THE Node_Graph_Component SHALL highlight all Project_Nodes using that skill

### Requirement 4: Project Case Study Navigation

**User Story:** As a visitor, I want to click on a project node to see full details, so that I can learn about SOLEZ's work in depth.

#### Acceptance Criteria

1. WHEN a Visitor clicks a Project_Node, THE Portfolio_System SHALL navigate to the Case_Study_View for that project
2. WHEN navigating to Case_Study_View, THE Portfolio_System SHALL use a shared-element transition animating the clicked Node into the hero section over 400ms
3. WHEN Case_Study_View loads, THE Portfolio_System SHALL display project name, description, technologies, challenges, outcomes, and links
4. WHEN Case_Study_View loads, THE Portfolio_System SHALL display project screenshots or demo media
5. WHERE a project has a live URL, THE Portfolio_System SHALL display a clickable link to the live project
6. WHERE a project has a GitHub repository, THE Portfolio_System SHALL display a clickable link to the repository
7. WHEN a Visitor navigates back from Case_Study_View, THE Portfolio_System SHALL reverse the shared-element transition returning to Home_View

### Requirement 5: Mobile Responsiveness

**User Story:** As a visitor on a mobile device, I want to interact with the portfolio naturally using touch, so that I can explore SOLEZ's work on any device.

#### Acceptance Criteria

1. WHEN Mobile_View is active, THE Node_Graph_Component SHALL support touch-based Drag_Interaction with single-finger gestures
2. WHEN Mobile_View is active, THE Node_Graph_Component SHALL support pinch-to-zoom gestures on the graph
3. WHEN Mobile_View is active, THE Node_Graph_Component SHALL display tap-to-preview instead of hover for Project_Nodes
4. WHEN Mobile_View is active and viewport width is less than 768px, THE Portfolio_System SHALL adjust Node sizes to minimum 44px touch targets
5. WHEN Mobile_View is active, THE Portfolio_System SHALL prevent default browser gestures that conflict with graph interaction
6. WHEN a Visitor rotates a mobile device, THE Node_Graph_Component SHALL reflow the graph layout within 500ms

### Requirement 6: Performance and Loading

**User Story:** As a visitor, I want the portfolio to load quickly, so that I can access information without waiting.

#### Acceptance Criteria

1. WHEN a Visitor requests Home_View, THE Portfolio_System SHALL deliver First Contentful Paint within 1.5 seconds on 3G connection
2. WHEN a Visitor requests Home_View, THE Portfolio_System SHALL display interactive graph within 3 seconds on 3G connection
3. THE Portfolio_System SHALL lazy-load Case_Study_View content until a Project_Node is clicked
4. THE Portfolio_System SHALL preload project images under 500KB during idle time after initial render
5. WHEN graph animations are active, THE Node_Graph_Component SHALL maintain 60 frames per second on devices from 2020 or newer
6. THE Portfolio_System SHALL deliver static HTML content before JavaScript execution for SEO indexing

### Requirement 7: Accessibility

**User Story:** As a visitor using assistive technology, I want to navigate the portfolio using keyboard and screen readers, so that I can access all information regardless of ability.

#### Acceptance Criteria

1. WHEN a Visitor uses keyboard navigation, THE Portfolio_System SHALL provide focus indicators on all interactive Nodes with 3:1 contrast ratio
2. WHEN a Visitor uses Tab key, THE Portfolio_System SHALL cycle through all Project_Nodes in logical order
3. WHEN a Node has focus, THE Portfolio_System SHALL display the same preview information shown on hover
4. WHEN a Visitor presses Enter on a focused Project_Node, THE Portfolio_System SHALL navigate to that project's Case_Study_View
5. WHEN a Visitor uses a screen reader, THE Portfolio_System SHALL provide ARIA labels describing each Node's content and relationships
6. THE Portfolio_System SHALL support keyboard-based zoom controls using Ctrl+ and Ctrl- shortcuts
7. WHERE animations are active, THE Portfolio_System SHALL respect prefers-reduced-motion media query by disabling Spring_Physics

### Requirement 8: Content Accuracy

**User Story:** As a visitor, I want to see accurate information about SOLEZ's work, so that I can make informed decisions about collaboration or hiring.

#### Acceptance Criteria

1. THE Portfolio_System SHALL display the following Project_Nodes: 3DragWin, Nodex, Vell, URLPad, PySketch
2. THE Portfolio_System SHALL display MentorMind as Experience_Node with role "Co-Founder & CTO" and date "Feb 2026 – Present"
3. THE Portfolio_System SHALL display Solven.ai as Experience_Node with role "Junior Web Developer" and date "2025, 6 months"
4. THE Portfolio_System SHALL display contact information including GitHub, Twitter, LinkedIn, Instagram, and email
5. WHERE project descriptions are shown, THE Portfolio_System SHALL use content from the existing content.md glossary
6. THE Portfolio_System SHALL display technology Skill_Nodes including: React, Next.js, TypeScript, Node.js, Python, Rust, Supabase

### Requirement 9: 404 and Error States

**User Story:** As a visitor, I want clear feedback when something goes wrong, so that I understand the issue and know what to do next.

#### Acceptance Criteria

1. WHEN a Visitor navigates to a non-existent route, THE Portfolio_System SHALL display a 404 page within 500ms
2. WHEN the 404 page renders, THE Portfolio_System SHALL display a single disconnected Node with the label "404: Not Found"
3. WHEN the 404 page renders, THE Portfolio_System SHALL provide a clickable link back to Home_View
4. IF graph data fails to load, THEN THE Portfolio_System SHALL display a fallback list view of projects
5. IF graph data fails to load, THEN THE Portfolio_System SHALL log the error to browser console for debugging
6. WHEN network errors occur, THE Portfolio_System SHALL display an error message with retry option

### Requirement 10: Footer and Contact

**User Story:** As a visitor, I want to easily find contact and social links, so that I can reach out to SOLEZ or learn more about his work.

#### Acceptance Criteria

1. THE Portfolio_System SHALL display a footer section visible from Home_View after scrolling past the graph
2. WHEN the footer renders, THE Portfolio_System SHALL display contact links as leaf Nodes connected to a central "Contact" Node
3. THE Portfolio_System SHALL provide clickable links to GitHub, Twitter (X), LinkedIn, Instagram, and email
4. THE Portfolio_System SHALL provide a link to SOLEZ's resume PDF hosted on Google Drive
5. WHERE footer contact Nodes are displayed, THE Portfolio_System SHALL apply the same Spring_Physics as Home_View Nodes
6. THE Portfolio_System SHALL display copyright text "© 2025 SOLEZ" in the footer

### Requirement 11: URL State Persistence

**User Story:** As a visitor, I want the URL to reflect my current view state, so that I can share specific portfolio states with others.

#### Acceptance Criteria

1. WHEN a Visitor scrolls the graph, THE Portfolio_System SHALL update the URL hash with scroll position coordinates
2. WHEN a Visitor zooms the graph, THE Portfolio_System SHALL update the URL hash with zoom level
3. WHEN a Visitor opens a Case_Study_View, THE Portfolio_System SHALL update the URL path to include the project identifier
4. WHEN a Visitor shares a URL with hash state, THE Portfolio_System SHALL restore scroll position and zoom level on page load
5. WHEN the browser back button is pressed, THE Portfolio_System SHALL restore the previous graph state from history
6. THE Portfolio_System SHALL encode state changes in URL hash within 100ms of interaction

### Requirement 12: Visual Design System

**User Story:** As a visitor, I want a cohesive visual design that reflects SOLEZ's technical aesthetic, so that the portfolio feels professional and considered.

#### Acceptance Criteria

1. THE Portfolio_System SHALL use a monospace font for all Node labels and technical content
2. THE Portfolio_System SHALL use a color palette with a dark background and high-contrast accent colors for nodes
3. THE Portfolio_System SHALL distinguish Project_Nodes, Skill_Nodes, and Experience_Nodes using different visual treatments
4. WHEN Edges are rendered, THE Portfolio_System SHALL use subtle stroke colors at 40% opacity
5. WHEN a Node is in hover or focus state, THE Portfolio_System SHALL increase the Node's scale by 1.1x over 200ms
6. THE Portfolio_System SHALL maintain consistent spacing of minimum 60px between adjacent Nodes at rest
