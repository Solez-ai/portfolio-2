import { ExternalLink, Lock, ArrowRight, Info, Award } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { SectionLabel } from "./SectionLabel";
import dragWin from "@/assets/proj-3dragwin.png";
import nodex from "@/assets/proj-nodex.png";
import urlpad from "@/assets/proj-urlpad.png";
import pysketch from "@/assets/proj-pysketch.png";
import vell from "@/assets/proj-vell.png";

type Project = {
  title: string;
  subtitle?: string;
  badge: string;
  image?: string;
  desc: string;
  recognition?: string;
  tech: string[];
  live?: string;
  github?: string;
  status?: "lock" | "info";
};

const PROJECTS: Project[] = [
  {
    title: "BrailleBridge",
    subtitle: "custom hardware + software",
    badge: "FEATURED",
    desc: "Low-cost bilingual Braille writing system that gives visually impaired students an affordable digital Braille writing experience.",
    recognition:
      "Recognized by BERDO and the Dhaka University Library Resource Centre for Visually Impaired Students; reviewed by the Education Minister",
    tech: ["Custom Hardware", "Embedded Systems", "Bilingual Braille", "Accessibility"],
    live: "https://braillebridge.solez.me",
  },
  {
    title: "DORJA",
    subtitle: "property management and verification platform",
    badge: "FEATURED",
    desc: "Digital handover documentation, property check-in, and interactive property viewing to make property management transparent.",
    recognition:
      "Recognized at the Fibonacci International STEM Olympiad 2026, with a place to compete in the finals in Italy",
    tech: ["Full Stack", "Verification", "Interactive Viewing", "Property Tech"],
    github: "https://github.com/Solez-ai/dorja",
  },
  {
    title: "3 Drag Win",
    status: "lock",
    badge: "STAR PROJECT",
    image: dragWin,
    desc: "3 Drag Win is a Windows background utility that brings true three-finger touchpad window dragging to the desktop with a native, low-latency feel. It lets users move windows from anywhere on screen while staying lightweight enough to run quietly for an entire session.",
    tech: ["Rust", "C++", "WinAPI", "Raw Input", "HID", "FFI"],
    github: "https://github.com/Solez-ai/3-drag-win",
  },
  {
    title: "Nodex",
    badge: "",
    image: nodex,
    desc: "Nodex is a high-performance, browser-native data visualization and intelligence platform. Paste or upload structured data in any supported format and instantly explore it through interactive graph and tree visualizations — with zero setup, no backend, and no data leaving your machine.",
    tech: ["React", "TypeScript", "Vite", "Supabase", "Cytoscape"],
    live: "https://nodex-launch.vercel.app",
    github: "https://github.com/Solez-ai/nodex",
  },
  {
    title: "Vell",
    status: "info",
    badge: "",
    image: vell,
    desc: "Vell is a reactive document markup language that combines Markdown's readability with LaTeX's expressive power. It parses to a versioned, deterministic AST in linear time and compiles down to HTML5 (with native MathML) or direct PDF, featuring a full-featured LSP server, a canonical formatter, and a native variables and reactivity system.",
    tech: ["Rust", "TypeScript", "WebAssembly", "Node.js", "VS Code Extension API"],
    live: "https://vell.mintlify.site",
    github: "https://github.com/Solez-ai/Vell",
  },
  {
    title: "URLPad",
    badge: "",
    image: urlpad,
    desc: "URLPad is a minimalist text editor that keeps the entire document inside the URL hash, making every note private, portable, and instantly shareable without relying on any backend.",
    tech: ["Vanilla JS", "Compression API", "HTML5", "CSS3"],
    live: "https://url-pad.vercel.app/",
    github: "https://github.com/Solez-ai/url-pad",
  },
  {
    title: "PySketch",
    badge: "",
    image: pysketch,
    desc: "PySketch is a cutting-edge visual programming platform that revolutionizes how users interact with Python's Turtle graphics. By seamlessly transforming freehand sketches into clean, executable Python code, it empowers both artists and creative coders to prototype, learn, and create generative art without writing a single line of syntax manually.",
    tech: ["Next.js 15", "React 19", "Tailwind CSS", "TypeScript"],
    live: "https://py-sketch.vercel.app/",
    github: "https://github.com/Solez-ai/PySketch",
  },
];

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="cursor-hover inline-block text-xs border border-border rounded-md px-2 py-0.5 mr-1.5 mb-1.5 hover:border-accent-green hover:text-accent-green transition-colors">
    {children}
  </span>
);

const Btn = ({ children, href, label }: { children: React.ReactNode; href?: string; label?: string }) => (
  <a
    href={href || "#"}
    target="_blank"
    rel="noreferrer"
    aria-label={label}
    className={`cursor-hover inline-flex items-center gap-1.5 border border-border rounded-md px-2.5 py-1 text-xs transition-all ${
      href ? "hover:bg-foreground hover:text-background hover:-translate-y-0.5" : "opacity-40 pointer-events-none"
    }`}
  >
    {children}
  </a>
);

function Card({ p }: { p: Project }) {
  const hasImage = Boolean(p.image);
  const titleUrl = p.live || p.github;

  return (
    <div className="section-card section-card-hover tilt">
      <div className={hasImage ? "grid md:grid-cols-[280px_1fr] gap-5" : "block"}>
        {hasImage && (
          <div className="relative rounded-md overflow-hidden border border-border group scanlines bg-muted aspect-[4/3]">
            <img
              src={p.image}
              alt={`Screenshot of ${p.title} — ${p.desc.slice(0, 60)}...`}
              loading="lazy"
              width={800}
              height={600}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {p.badge && (
              <span className="absolute top-2 left-2 z-10 bg-background/85 backdrop-blur border border-border rounded-md px-2 py-1 text-xs font-mono">
                {p.badge}
              </span>
            )}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-background/60 to-transparent z-10" />
          </div>
        )}

        <div>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold inline-flex items-center gap-2">
                  {titleUrl ? (
                    <a
                      href={titleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-hover hover:text-accent-green transition-colors"
                    >
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                  {p.status === "lock" && <Lock className="w-4 h-4 text-accent-green" aria-label="Private repository" />}
                  {p.status === "info" && <Info className="w-4 h-4 text-yellow-500" aria-label="More information available" />}
                </h3>
                {!hasImage && p.badge && (
                  <span className="bg-muted border border-border rounded px-2 py-0.5 text-[10px] font-mono text-accent-green">
                    {p.badge}
                  </span>
                )}
              </div>
              {p.subtitle && (
                <p className="text-xs font-mono text-muted-foreground mt-0.5">{p.subtitle}</p>
              )}
            </div>
            <div className="flex gap-2">
              {(!hasImage ? p.live : true) && (
                <Btn href={p.live} label={`View live demo of ${p.title} — opens in new tab`}>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" /> Live
                </Btn>
              )}
              {(!hasImage ? p.github : true) && (
                <Btn href={p.github} label={`View source code of ${p.title} on GitHub — opens in new tab`}>
                  <FaGithub className="w-3 h-3" aria-hidden="true" /> GitHub
                </Btn>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{p.desc}</p>

          {p.recognition && (
            <div className="mt-3 flex items-start gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-foreground/90">
              <Award className="w-4 h-4 text-accent-green shrink-0 mt-0.5" aria-hidden="true" />
              <span className="leading-relaxed">{p.recognition}</span>
            </div>
          )}

          <p className="text-sm font-semibold mt-3">Technologies Used:</p>
          <div className="mt-2 flex flex-wrap">
            {p.tech.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <div className="relative space-y-4 animate-fade-up">
      <SectionLabel>My Projects</SectionLabel>
      <div className="space-y-4">
        {PROJECTS.map((p) => (
          <Card key={p.title} p={p} />
        ))}
      </div>
      <div className="flex justify-end">
        <a
          href="https://github.com/Solez-ai"
          target="_blank"
          rel="noreferrer"
          className="cursor-hover group inline-flex items-center gap-1.5 border border-border rounded-md px-3 py-1.5 text-sm hover:bg-foreground hover:text-background transition-all"
          aria-label="View more projects on GitHub — opens in new tab"
        >
          More Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
