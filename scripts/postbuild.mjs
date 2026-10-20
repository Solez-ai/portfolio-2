import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Extract compiled Vite asset tags (<script type="module"...> and <link rel="stylesheet"...>)
const assetTags = [
  ...(baseHtml.match(/<script\b[^>]*src="\/assets\/[^"]+"[^>]*><\/script>/gi) || []),
  ...(baseHtml.match(/<link\b[^>]*href="\/assets\/[^"]+"[^>]*>/gi) || []),
].join('\n    ');

const CASE_STUDIES = [
  {
    slug: 'nodex',
    title: 'Nodex Case Study | Samin Yeasar (SOLEZ)',
    description:
      'Nodex: Browser-native data visualization and graph intelligence platform built with React, TypeScript, and Supabase by Samin Yeasar.',
    heading: 'Nodex: Browser-Native Data Visualization & Graph Intelligence',
    body: `Nodex is a high-performance, browser-native data visualization and intelligence platform created by Samin Yeasar (SOLEZ). Users paste or upload structured JSON, CSV, or YAML payloads and explore them immediately through interactive force-directed graph and tree layouts without sending data to an external server. Built with React, TypeScript, Vite, Supabase, and Cytoscape, Nodex parses nested schemas in linear time and maintains 60 frames per second during graph interaction.`,
  },
  {
    slug: '3dragwin',
    title: '3DragWin Case Study | Samin Yeasar (SOLEZ)',
    description:
      '3DragWin: Native Windows background utility for low-latency three-finger touchpad window dragging built in Rust and C++ by Samin Yeasar.',
    heading: '3DragWin: Native Windows Three-Finger Touchpad Drag Utility',
    body: `3DragWin is a lightweight Windows background utility built by Samin Yeasar (SOLEZ) that brings macOS-style three-finger touchpad window dragging to Windows desktops with native sub-4ms latency. Written in Rust and C++ using the Windows Raw Input API, HID packets, and Win32 FFI, it filters multi-touch contact frames and runs quietly in the system tray with under 2 MB of memory consumption.`,
  },
  {
    slug: 'vell',
    title: 'Vell Case Study | Samin Yeasar (SOLEZ)',
    description:
      'Vell: Reactive document markup language compiling to HTML5, MathML, and PDF using Rust, WebAssembly, and TypeScript by Samin Yeasar.',
    heading: 'Vell: Reactive Document Markup Language & WASM Compiler',
    body: `Vell is a reactive document markup language designed by Samin Yeasar (SOLEZ) that pairs Markdown readability with LaTeX mathematical typesetting. Its hand-written recursive descent parser in Rust builds a deterministic AST in linear time and compiles to HTML5 with native MathML or PDF, accompanied by a full Language Server Protocol (LSP) server and canonical formatter.`,
  },
  {
    slug: 'urlpad',
    title: 'URLPad Case Study | Samin Yeasar (SOLEZ)',
    description:
      'URLPad: Serverless minimalist note editor that compresses and stores the entire document inside the browser URL hash by Samin Yeasar.',
    heading: 'URLPad: Serverless Hash-Encoded Document Editor',
    body: `URLPad is a minimalist note editor created by Samin Yeasar (SOLEZ) that stores the entire document state inside the browser URL hash using native Deflate compression and URL-safe Base64 encoding. Every note is private, portable, and shareable via link without relying on any database or backend server.`,
  },
  {
    slug: 'pysketch',
    title: 'PySketch Case Study | Samin Yeasar (SOLEZ)',
    description:
      'PySketch: Visual programming studio compiling freehand canvas drawings into executable Python Turtle code with Next.js and React.',
    heading: 'PySketch: Visual Canvas to Python Turtle Code Compiler',
    body: `PySketch is a visual programming studio built by Samin Yeasar (SOLEZ) that transforms freehand canvas drawings and geometric paths into clean, executable Python Turtle scripts. Built with Next.js, React, TypeScript, and Ramer-Douglas-Peucker polyline simplification, it bridges visual sketching and procedural Python programming.`,
  },
];

for (const cs of CASE_STUDIES) {
  const dir = path.join(distDir, 'project', cs.slug);
  fs.mkdirSync(dir, { recursive: true });
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${cs.title}</title>
    <meta name="description" content="${cs.description}" />
    <link rel="canonical" href="https://solez.vercel.app/project/${cs.slug}" />
    <meta property="og:title" content="${cs.title}" />
    <meta property="og:description" content="${cs.description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://solez.vercel.app/project/${cs.slug}" />
    <meta property="og:image" content="https://solez.vercel.app/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${cs.title}" />
    <meta name="twitter:description" content="${cs.description}" />
    <meta name="twitter:image" content="https://solez.vercel.app/og.png" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="preload" href="/fonts/clash-display-600-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/geist-400_700-normal.woff2" as="font" type="font/woff2" crossorigin />
    ${assetTags}
  </head>
  <body style="background-color:#0B0B0C;color:#F3F1EC;margin:0;">
    <div id="root">
      <main id="main-content" style="max-width:64rem;margin:0 auto;padding:3rem 1.5rem;font-family:'Geist',system-ui,sans-serif;">
        <p><a href="/">Back to Graph</a></p>
        <h1 style="font-family:'JetBrains Mono',monospace;">${cs.heading}</h1>
        <p>${cs.body}</p>
        <h2>Context &amp; Engineering Architecture</h2>
        <p>Designed and engineered by Samin Yeasar (SOLEZ), Full Stack Developer and Co-Founder &amp; CTO at MentorMind in Bangladesh. Explore the interactive node graph or inspect the source repository and live deployment.</p>
      </main>
    </div>
  </body>
</html>`;
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
}

// Generate styled 404.html with React bundle + semantic static markup
const notFoundHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>404: Not Found | Samin Yeasar (SOLEZ)</title>
    <meta name="description" content="404 Not Found: This route is a disconnected node outside the SOLEZ portfolio graph. Return to the main interactive node graph." />
    <link rel="canonical" href="https://solez.vercel.app/404" />
    <meta property="og:title" content="404: Not Found | Samin Yeasar (SOLEZ)" />
    <meta property="og:description" content="Disconnected node: return to the interactive SOLEZ portfolio graph." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://solez.vercel.app/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="preload" href="/fonts/clash-display-600-normal.woff2" as="font" type="font/woff2" crossorigin />
    <link rel="preload" href="/fonts/geist-400_700-normal.woff2" as="font" type="font/woff2" crossorigin />
    ${assetTags}
  </head>
  <body style="background-color:#0B0B0C;color:#F3F1EC;margin:0;">
    <div id="root">
      <a href="#main-content" style="position:fixed;top:-100px;left:16px;padding:8px 16px;background:#FF3B1D;color:#F3F1EC;">Skip to main content</a>
      <main id="main-content" style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:2rem;font-family:'JetBrains Mono',monospace;">
        <div style="width:120px;height:120px;border-radius:6px;background:#121214;border:1px solid #F3F1EC;display:flex;align-items:center;justify-content:center;padding:0.75rem;">
          <h1 style="font-size:1.125rem;margin:0;color:#F3F1EC;">404: Not Found</h1>
        </div>
        <p style="color:#8E8B84;font-size:0.875rem;margin-top:1.25rem;max-width:32rem;">This requested URL is a disconnected node with no relational edges in the SOLEZ portfolio graph. Use the link below to return to the primary interactive graph visualization and explore featured engineering projects including Nodex, 3DragWin, Vell, URLPad, and PySketch.</p>
        <p style="margin-top:1.5rem;"><a href="/" style="color:#F3F1EC;text-decoration:underline;">Back to Graph</a></p>
      </main>
    </div>
  </body>
</html>`;

fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');
console.log('Postbuild complete: generated static case study pages and 404.html in dist/');
