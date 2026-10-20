import dragWinImg from '@/assets/proj-3dragwin.png';
import nodexImg from '@/assets/proj-nodex.png';
import vellImg from '@/assets/proj-vell.png';
import urlpadImg from '@/assets/proj-urlpad.png';
import pysketchImg from '@/assets/proj-pysketch.png';
import mentormindLogo from '@/assets/mentormind.png';
import solvenaiLogo from '@/assets/solvenai.png';
import avatarImg from '@/assets/avatar.jpg';

export type NodeType = 'project' | 'experience' | 'skill' | 'contact';

export interface ProjectData {
  slug: string;
  name: string;
  brief: string;
  description: string;
  technologies: string[];
  thumbnailUrl: string;
  client: string;
  year: number;
  role: string;
  liveUrl?: string;
  githubUrl?: string;
  badge?: string;
  context: string;
  challenge: string;
  architecture: string[];
  outcome: string;
  metrics: { label: string; value: string }[];
}

export interface ExperienceData {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  dateLabel: string;
  status: 'Active' | 'Completed';
  description: string;
  highlights: string[];
  technologies: string[];
  url: string;
  logoUrl: string;
}

export interface SkillData {
  name: string;
  category: 'language' | 'framework' | 'tool';
}

export interface ContactData {
  platform: string;
  handle: string;
  url: string;
  icon: 'github' | 'twitter' | 'linkedin' | 'instagram' | 'email' | 'resume';
}

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  sublabel?: string;
  position: { x: number; y: number };
  equilibrium: { x: number; y: number };
  velocity: { x: number; y: number };
  mass: number;
  radius: number;
  fixed: boolean;
  ring: 0 | 1 | 2;
  data: ProjectData | ExperienceData | SkillData | ContactData;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  strength: number;
}

export const SITE_META = {
  name: 'Samin Yeasar',
  alias: 'SOLEZ',
  aliases: ['SOLEZ', 'Solez-ai', 'SOLEZ-AI', 'solez.ai'],
  role: 'Full Stack Developer & Co-Founder',
  tagline: 'Full Stack Developer / Building elegant technical solutions',
  heroSummary:
    'I build low-latency systems, developer tools, and full-stack platforms with React, TypeScript, and Rust.',
  location: 'Dhaka, Bangladesh',
  timezone: 'Asia/Dhaka',
  email: 'sheditzofficial918@gmail.com',
  resumeUrl:
    'https://drive.google.com/file/d/19R008pQKPVudWaSHJMHDOymkIu571LFM/view?usp=sharing',
  url: 'https://solez.vercel.app',
  avatar: avatarImg,
  bio: 'I am Samin Yeasar (known online as SOLEZ), a Full Stack Developer and Co-Founder & CTO at MentorMind in Bangladesh. My work spans browser-native graph visualization in React and TypeScript, deterministic compilers and desktop utilities in Rust, and production backends on Supabase, PostgreSQL, and Node.js.',
};

export const PROJECTS: ProjectData[] = [
  {
    slug: 'nodex',
    name: 'Nodex',
    brief:
      'Browser-native data visualization and graph intelligence platform with zero backend setup.',
    description:
      'Nodex is a high-performance, browser-native data visualization and intelligence platform. Paste or upload structured data in JSON, CSV, or YAML and explore it immediately through interactive force-directed graph and tree layouts without sending a single byte to an external server.',
    technologies: ['React', 'TypeScript', 'Supabase', 'Vite', 'Cytoscape'],
    thumbnailUrl: nodexImg,
    client: 'Open Source / Internal Product',
    year: 2025,
    role: 'Creator & Lead Engineer',
    liveUrl: 'https://nodex-launch.vercel.app',
    githubUrl: 'https://github.com/Solez-ai/nodex',
    badge: 'CONCEPT ANCHOR',
    context:
      'Developers inspecting deeply nested JSON payloads, relational schemas, or dependency trees often resort to heavyweight desktop tools or cloud services that require uploading sensitive data. Nodex was created to make graph intelligence instant and local-first in the browser.',
    challenge:
      'Rendering hundreds of relational nodes and edges in real time inside a browser tab quickly hits layout thrashing if DOM updates and force calculations are not decoupled. Schema inference also needed to handle arbitrary nested objects without manual mapping.',
    architecture: [
      'Deterministic schema parser that converts arbitrary JSON/YAML trees into normalized Node and Edge tables in linear time.',
      'Decoupled force-simulation loop with spatial indexing and viewport culling to hold 60fps during pan, zoom, and node dragging.',
      'Optional Supabase persistence layer for saving and sharing workspace snapshots via encrypted links.',
    ],
    outcome:
      'Shipped a zero-config web application where developers paste raw payloads and inspect interactive relational graphs in under a second. Nodex directly inspired the force-directed architecture of this portfolio.',
    metrics: [
      { label: 'Frame Target', value: '60 FPS' },
      { label: 'Data Privacy', value: '100% Local' },
      { label: 'Parse Complexity', value: 'O(N) Linear' },
    ],
  },
  {
    slug: '3dragwin',
    name: '3DragWin',
    brief:
      'Native Windows background utility bringing low-latency three-finger touchpad window dragging.',
    description:
      '3DragWin is a lightweight Windows background utility that brings macOS-style three-finger touchpad window dragging to Windows desktops with a native, low-latency feel. It lets users grab and move windows from anywhere on screen while running quietly in the system tray.',
    technologies: ['Rust', 'C++', 'WinAPI', 'Raw Input', 'HID', 'FFI'],
    thumbnailUrl: dragWinImg,
    client: 'Open Source Utility',
    year: 2025,
    role: 'Systems Programmer',
    githubUrl: 'https://github.com/Solez-ai/3-drag-win',
    badge: 'STAR PROJECT',
    context:
      'macOS users rely heavily on three-finger touchpad drag to move windows and select text without pressing physical mouse buttons. Windows Precision Touchpads expose raw multi-touch coordinates, but the OS lacks a native low-latency three-finger window drag implementation.',
    challenge:
      'Intercepting Windows Precision Touchpad HID packets and translating 3-finger gestures into window movement requires hooking directly into the Raw Input API and Win32 window manager without introducing cursor jitter or high CPU wakeups.',
    architecture: [
      'Raw Input HID listener written in Rust and C++ FFI to read multi-touch contact frames directly from the precision touchpad digitizer.',
      'State machine filtering contact count, palm rejection, and gesture velocity before issuing synthetic mouse-down and window move events.',
      'Zero-allocation event loop consuming less than 2 MB of RAM while idle in the Windows system tray.',
    ],
    outcome:
      'Delivered a native desktop utility that runs continuously across full workday sessions with negligible CPU and memory overhead, giving Windows laptops tactile three-finger window manipulation.',
    metrics: [
      { label: 'Input Latency', value: '< 4 ms' },
      { label: 'Memory Footprint', value: '< 2 MB' },
      { label: 'Core Stack', value: 'Rust + WinAPI' },
    ],
  },
  {
    slug: 'vell',
    name: 'Vell',
    brief:
      'Reactive document markup language combining Markdown readability with LaTeX math and WASM compilation.',
    description:
      'Vell is a reactive document markup language that pairs Markdown readability with LaTeX expressive power. It parses to a versioned, deterministic AST in linear time and compiles to HTML5 with native MathML or direct PDF, complete with an LSP server and canonical formatter.',
    technologies: ['Rust', 'TypeScript', 'Node.js', 'WebAssembly', 'VS Code Extension API'],
    thumbnailUrl: vellImg,
    client: 'Language & Tooling Toolchain',
    year: 2025,
    role: 'Language Designer & Compiler Engineer',
    liveUrl: 'https://vell.mintlify.site',
    githubUrl: 'https://github.com/Solez-ai/Vell',
    badge: 'COMPILER & LSP',
    context:
      'Technical authors frequently choose between Markdown, which lacks native reactive variables and rigorous math layout, and LaTeX, which suffers from slow compilation cycles and opaque error messages.',
    challenge:
      'Designing a grammar that remains human-readable while supporting reactive variable bindings, deterministic AST serialization, and sub-millisecond incremental re-parsing for live editor feedback.',
    architecture: [
      'Hand-written lexer and recursive descent parser in Rust guaranteeing O(N) linear-time parsing and structured diagnostic recovery.',
      'WebAssembly compilation target enabling live in-browser preview alongside a Node.js CLI and VS Code Language Server Protocol (LSP) extension.',
      'Native MathML emitter for zero-JS mathematical typesetting in modern browsers.',
    ],
    outcome:
      'Published the Vell compiler core, canonical formatter, documentation site, and VS Code extension providing real-time diagnostics, hover types, and instant HTML5/MathML previews.',
    metrics: [
      { label: 'Parser Time', value: 'O(N) Linear' },
      { label: 'Targets', value: 'HTML5 / MathML / PDF' },
      { label: 'Tooling', value: 'Full LSP + Formatter' },
    ],
  },
  {
    slug: 'urlpad',
    name: 'URLPad',
    brief:
      'Serverless minimalist note editor that encodes and compresses the entire document inside the URL hash.',
    description:
      'URLPad is a minimalist text editor that stores the entire document state inside the browser URL hash. Every note is private, portable, and shareable via link without relying on any database or backend server.',
    technologies: ['TypeScript', 'React', 'Compression API', 'HTML5', 'CSS3'],
    thumbnailUrl: urlpadImg,
    client: 'Web Utility',
    year: 2025,
    role: 'Full Stack Developer',
    liveUrl: 'https://url-pad.vercel.app/',
    githubUrl: 'https://github.com/Solez-ai/url-pad',
    context:
      'Sharing quick code snippets, scratchpad notes, or configuration drafts usually requires signing into a pastebin service or creating temporary cloud documents that expire or track readers.',
    challenge:
      'Browser URLs have practical length limits across messaging apps, so raw text must be compressed deterministically into URL-safe Base64 streams on every keystroke without blocking the main UI thread.',
    architecture: [
      'Native browser CompressionStream (Deflate) pipeline paired with URL-safe Base64 encoding stored in window.location.hash.',
      'Debounced state synchronization that updates the address bar and history stack without triggering network requests.',
      'Offline-ready static footprint that loads instantaneously on slow mobile connections.',
    ],
    outcome:
      'Created a zero-backend note utility where the URL itself is the database. The hash-state persistence pattern in URLPad also informs the URL coordinate encoding in this portfolio.',
    metrics: [
      { label: 'Backend Cost', value: '$0 / Serverless' },
      { label: 'Compression', value: 'Deflate + Base64URL' },
      { label: 'Cold Boot', value: '< 100 ms' },
    ],
  },
  {
    slug: 'pysketch',
    name: 'PySketch',
    brief:
      'Visual programming studio that compiles freehand canvas drawings into executable Python Turtle code.',
    description:
      'PySketch is a visual programming platform for Python Turtle graphics. Users draw paths, geometric shapes, and freehand strokes on an interactive canvas, and PySketch compiles those vector trajectories into clean, executable Python code in real time.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Python', 'Tailwind CSS'],
    thumbnailUrl: pysketchImg,
    client: 'Creative Coding & EdTech',
    year: 2025,
    role: 'Lead Developer',
    liveUrl: 'https://py-sketch.vercel.app/',
    githubUrl: 'https://github.com/Solez-ai/PySketch',
    context:
      'Students and creative coders learning Python Turtle graphics often struggle to translate spatial geometry in their head into sequential forward, left, and circle coordinate commands.',
    challenge:
      'Raw pointer input produces thousands of noisy pixel coordinates. Emitting readable Python Turtle scripts requires curve simplification, corner detection, and coordinate normalization.',
    architecture: [
      'Ramer-Douglas-Peucker polyline simplification pipeline that reduces dense pointer streams into clean geometric primitives.',
      'Bidirectional AST generator written in TypeScript that outputs idiomatic Python turtle movement loops and pen controls.',
      'Split-pane Next.js and React 19 studio with live stroke playback, layer management, and one-click script export.',
    ],
    outcome:
      'Shipped an interactive web studio that bridges visual sketching and procedural Python programming for learners and generative art experiments.',
    metrics: [
      { label: 'Stack', value: 'Next.js + Python' },
      { label: 'Code Gen', value: 'Real-time AST' },
      { label: 'Path Reduction', value: 'RDP Algorithm' },
    ],
  },
];

export const EXPERIENCES: ExperienceData[] = [
  {
    id: 'exp-mentormind',
    company: 'MentorMind',
    role: 'Co-Founder & CTO',
    startDate: 'Feb 2026',
    endDate: 'Present',
    dateLabel: 'Feb 2026 - Present',
    status: 'Active',
    description:
      'Building MentorMind, a platform introducing a new culture of structured mentorship and peer help to Bangladesh. Leading technical architecture, product engineering, and full-stack delivery.',
    highlights: [
      'Architected the core mentorship matching, scheduling, and real-time session infrastructure using Next.js, TypeScript, and Supabase.',
      'Designed low-bandwidth mobile experiences tailored for students and mentors across Bangladesh.',
      'Leading product strategy, database modeling in PostgreSQL, and end-to-end engineering execution.',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Node.js'],
    url: 'https://solez.mentormind.bd',
    logoUrl: mentormindLogo,
  },
  {
    id: 'exp-solven',
    company: 'Solven.ai',
    role: 'Junior Web Developer',
    startDate: '2025',
    endDate: '2025 (6 months)',
    dateLabel: '2025, 6 months',
    status: 'Completed',
    description:
      'Worked as a Junior Web Developer at Solven.ai for 6 months in 2025, shipping client-facing web applications, interactive dashboards, and internal automation tooling.',
    highlights: [
      'Built responsive React and TypeScript interfaces with clean component APIs and state management.',
      'Integrated REST and Node.js backend endpoints alongside Python automation workflows.',
      'Collaborated closely with designers and senior engineers to reduce frontend bundle size and improve page load vitals.',
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Python'],
    url: 'https://www.linkedin.com/company/solvenai/',
    logoUrl: solvenaiLogo,
  },
];

export const SKILLS: SkillData[] = [
  { name: 'React', category: 'framework' },
  { name: 'Next.js', category: 'framework' },
  { name: 'TypeScript', category: 'language' },
  { name: 'Node.js', category: 'framework' },
  { name: 'Python', category: 'language' },
  { name: 'Rust', category: 'language' },
  { name: 'Supabase', category: 'tool' },
];

export const CONTACTS: ContactData[] = [
  {
    platform: 'GitHub',
    handle: '@Solez-ai',
    url: 'https://github.com/Solez-ai',
    icon: 'github',
  },
  {
    platform: 'Twitter',
    handle: '@Solez_None',
    url: 'https://x.com/Solez_None',
    icon: 'twitter',
  },
  {
    platform: 'LinkedIn',
    handle: 'solez-ai',
    url: 'https://www.linkedin.com/in/solez-ai/',
    icon: 'linkedin',
  },
  {
    platform: 'Instagram',
    handle: '@solez.ai',
    url: 'https://www.instagram.com/solez.ai',
    icon: 'instagram',
  },
  {
    platform: 'Email',
    handle: 'sheditzofficial918@gmail.com',
    url: 'mailto:sheditzofficial918@gmail.com',
    icon: 'email',
  },
  {
    platform: 'Resume',
    handle: 'PDF Curriculum Vitae',
    url: 'https://drive.google.com/file/d/19R008pQKPVudWaSHJMHDOymkIu571LFM/view?usp=sharing',
    icon: 'resume',
  },
];

/**
 * Initial graph edges connecting experiences and projects through shared technologies
 * Every edge label corresponds to a core technology from the Glossary of skills:
 * React, Next.js, TypeScript, Node.js, Python, Rust, Supabase
 */
export const INITIAL_EDGES: GraphEdge[] = [
  // Connections from central MentorMind hub
  {
    id: 'edge-mentormind-nodex',
    source: 'exp-mentormind',
    target: 'proj-nodex',
    label: 'Supabase',
    strength: 0.9,
  },
  {
    id: 'edge-mentormind-pysketch',
    source: 'exp-mentormind',
    target: 'proj-pysketch',
    label: 'Next.js',
    strength: 0.9,
  },
  {
    id: 'edge-mentormind-urlpad',
    source: 'exp-mentormind',
    target: 'proj-urlpad',
    label: 'TypeScript',
    strength: 0.85,
  },
  {
    id: 'edge-mentormind-vell',
    source: 'exp-mentormind',
    target: 'proj-vell',
    label: 'Node.js',
    strength: 0.85,
  },
  {
    id: 'edge-mentormind-solven',
    source: 'exp-mentormind',
    target: 'exp-solven',
    label: 'React',
    strength: 0.8,
  },

  // Project-to-Project & Solven.ai skill edges
  {
    id: 'edge-3dragwin-vell',
    source: 'proj-3dragwin',
    target: 'proj-vell',
    label: 'Rust',
    strength: 0.95,
  },
  {
    id: 'edge-nodex-urlpad',
    source: 'proj-nodex',
    target: 'proj-urlpad',
    label: 'React',
    strength: 0.8,
  },
  {
    id: 'edge-nodex-vell',
    source: 'proj-nodex',
    target: 'proj-vell',
    label: 'TypeScript',
    strength: 0.8,
  },
  {
    id: 'edge-pysketch-solven',
    source: 'proj-pysketch',
    target: 'exp-solven',
    label: 'Python',
    strength: 0.85,
  },
  {
    id: 'edge-solven-vell',
    source: 'exp-solven',
    target: 'proj-vell',
    label: 'Node.js',
    strength: 0.75,
  },
  {
    id: 'edge-nodex-pysketch',
    source: 'proj-nodex',
    target: 'proj-pysketch',
    label: 'React',
    strength: 0.75,
  },
  {
    id: 'edge-3dragwin-mentormind',
    source: 'proj-3dragwin',
    target: 'exp-mentormind',
    label: 'Rust',
    strength: 0.85,
  },
];

/**
 * Helper to compute responsive orbital node positions around viewport center
 */
export function createInitialNodes(width = 1280, height = 800): GraphNode[] {
  const isSmall = width < 768;
  const cx = width / 2;
  const cy = isSmall ? height * 0.52 : height * 0.52;

  // Orbital radii scaled to viewport so nodes never overflow or overlap on desktop or 390px mobile
  const rx1 = isSmall
    ? Math.min(width * 0.36, 138)
    : Math.min(width * 0.26, 320);
  const ry1 = isSmall
    ? Math.min(height * 0.22, 185)
    : Math.min(height * 0.26, 220);

  const rx2 = isSmall
    ? Math.min(width * 0.34, 132)
    : Math.min(width * 0.38, 470);
  const ry2 = isSmall
    ? Math.min(height * 0.36, 305)
    : Math.min(height * 0.38, 330);

  const expRadius = isSmall ? 38 : 60; // diameter 76px mobile, 120px desktop
  const projRadius = isSmall ? 28 : 40; // diameter 56px mobile, 80px desktop

  const mentorMind = EXPERIENCES[0];
  const solvenAi = EXPERIENCES[1];

  // Ring 1 angles (in radians): Nodex (-35 deg), 3DragWin (-145 deg), URLPad (35 deg), Solven.ai (145 deg)
  const ring1Configs = [
    {
      id: 'proj-nodex',
      type: 'project' as const,
      label: 'Nodex',
      sublabel: 'Data Graph',
      angle: -0.62,
      data: PROJECTS[0],
      mass: 1.2,
      radius: projRadius,
    },
    {
      id: 'proj-3dragwin',
      type: 'project' as const,
      label: '3DragWin',
      sublabel: 'Rust Utility',
      angle: -2.52,
      data: PROJECTS[1],
      mass: 1.2,
      radius: projRadius,
    },
    {
      id: 'proj-urlpad',
      type: 'project' as const,
      label: 'URLPad',
      sublabel: 'Hash Editor',
      angle: 0.62,
      data: PROJECTS[3],
      mass: 1.2,
      radius: projRadius,
    },
    {
      id: 'exp-solven',
      type: 'experience' as const,
      label: 'Solven.ai',
      sublabel: 'Jr. Web Dev · 2025',
      angle: 2.52,
      data: solvenAi,
      mass: 1.5,
      radius: isSmall ? 34 : 52,
    },
  ];

  // Ring 2 angles: Vell (-90 deg top), PySketch (90 deg bottom)
  const ring2Configs = [
    {
      id: 'proj-vell',
      type: 'project' as const,
      label: 'Vell',
      sublabel: 'Markup + WASM',
      angle: -Math.PI / 2,
      data: PROJECTS[2],
      mass: 1.2,
      radius: projRadius,
    },
    {
      id: 'proj-pysketch',
      type: 'project' as const,
      label: 'PySketch',
      sublabel: 'Python Studio',
      angle: Math.PI / 2,
      data: PROJECTS[4],
      mass: 1.2,
      radius: projRadius,
    },
  ];

  const nodes: GraphNode[] = [
    // Center Node: MentorMind
    {
      id: 'exp-mentormind',
      type: 'experience',
      label: 'MentorMind',
      sublabel: 'Co-Founder & CTO',
      position: { x: cx, y: cy },
      equilibrium: { x: cx, y: cy },
      velocity: { x: 0, y: 0 },
      mass: 1.5,
      radius: expRadius,
      fixed: false,
      ring: 0,
      data: mentorMind,
    },
  ];

  for (const item of ring1Configs) {
    const x = Math.round(cx + Math.cos(item.angle) * rx1);
    const y = Math.round(cy + Math.sin(item.angle) * ry1);
    nodes.push({
      id: item.id,
      type: item.type,
      label: item.label,
      sublabel: item.sublabel,
      position: { x, y },
      equilibrium: { x, y },
      velocity: { x: 0, y: 0 },
      mass: item.mass,
      radius: item.radius,
      fixed: false,
      ring: 1,
      data: item.data,
    });
  }

  for (const item of ring2Configs) {
    const x = Math.round(cx + Math.cos(item.angle) * rx2);
    const y = Math.round(cy + Math.sin(item.angle) * ry2);
    nodes.push({
      id: item.id,
      type: item.type,
      label: item.label,
      sublabel: item.sublabel,
      position: { x, y },
      equilibrium: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      mass: item.mass,
      radius: item.radius,
      fixed: false,
      ring: 2,
      data: item.data,
    });
    nodes[nodes.length - 1].equilibrium = { x, y };
  }

  return nodes;
}

export function getProjectBySlug(slug: string): ProjectData | undefined {
  return PROJECTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
}

export function getNextProject(currentSlug: string): ProjectData {
  const index = PROJECTS.findIndex((p) => p.slug === currentSlug);
  if (index === -1) return PROJECTS[0];
  return PROJECTS[(index + 1) % PROJECTS.length];
}
