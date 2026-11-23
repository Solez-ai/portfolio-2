import { Atom, Cpu, Magnet } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import type { ReactNode } from "react";

type ResearchItem = {
  title: string;
  field: string;
  icon: ReactNode;
  desc: string;
};

const RESEARCH: ResearchItem[] = [
  {
    title: "Ishara",
    field: "AI / ML",
    icon: <Cpu className="w-4 h-4 text-accent-green" aria-hidden="true" />,
    desc: "Real-time sign language recognition that runs on standard hardware, with no GPU or cloud needed, so Deaf communities can use their natural language with digital systems.",
  },
  {
    title: "Convergō",
    field: "Quantum Optics",
    icon: <Atom className="w-4 h-4 text-accent-blue" aria-hidden="true" />,
    desc: "Tests whether interference visibility in a Mach-Zehnder interferometer stays invariant under large controlled phase shifts. Building a low-cost interferometer and using statistical model selection to check whether standard decoherence models suffice.",
  },
  {
    title: "Multi-notch permalloy nanowires",
    field: "Spintronics",
    icon: <Magnet className="w-4 h-4 text-accent-pink" aria-hidden="true" />,
    desc: "Designing notched nanowires as stable data storage points, tuning notch shape, depth, and spacing to move data with minimal current or field and cut memory power.",
  },
];

export function Research() {
  return (
    <div className="relative animate-fade-up">
      <SectionLabel>Current Research</SectionLabel>
      <div className="section-card section-card-hover space-y-4">
        {RESEARCH.map((r) => (
          <div
            key={r.title}
            className="pb-4 last:pb-0 border-b last:border-b-0 border-dashed border-border/70 group"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-muted border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {r.icon}
              </span>
              <h3 className="font-semibold text-base text-foreground">{r.title}</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted border border-border text-muted-foreground">
                {r.field}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2 pl-9">
              {r.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
