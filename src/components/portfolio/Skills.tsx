import { SectionLabel } from "./SectionLabel";
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss,
  SiPython, SiNodedotjs, SiRust, SiCplusplus, SiSupabase, SiFirebase, SiPostgresql,
  SiVercel, SiDocker, SiGooglecloud,
} from "react-icons/si";
import { FaAws } from "react-icons/fa6";
import { SiConvex } from "react-icons/si";
import type { ReactNode } from "react";

type Skill = { name: string; icon: ReactNode; color: string };

const ROW_1: Skill[] = [
  { name: "HTML", icon: <SiHtml5 />, color: "#e34f26" },
  { name: "CSS", icon: <SiCss />, color: "#1572b6" },
  { name: "JavaScript", icon: <SiJavascript />, color: "#f7df1e" },
  { name: "TypeScript", icon: <SiTypescript />, color: "#3178c6" },
  { name: "React", icon: <SiReact />, color: "#61dafb" },
  { name: "Next.js", icon: <SiNextdotjs />, color: "#ffffff" },
  { name: "Tailwind", icon: <SiTailwindcss />, color: "#38bdf8" },
  { name: "Python", icon: <SiPython />, color: "#3776ab" },
  { name: "Node.js", icon: <SiNodedotjs />, color: "#5fa04e" },
  { name: "Rust", icon: <SiRust />, color: "#ce422b" },
  { name: "C++", icon: <SiCplusplus />, color: "#00599c" },
];
const ROW_2: Skill[] = [
  { name: "Supabase", icon: <SiSupabase />, color: "#3ecf8e" },
  { name: "Firebase", icon: <SiFirebase />, color: "#ffca28" },
  { name: "PostgreSQL", icon: <SiPostgresql />, color: "#4169e1" },
  { name: "Convex", icon: <SiConvex />, color: "#ee342f" },
  { name: "AWS", icon: <FaAws />, color: "#ff9900" },
  { name: "GCP", icon: <SiGooglecloud />, color: "#4285f4" },
  { name: "Vercel", icon: <SiVercel />, color: "#ffffff" },
  { name: "Docker", icon: <SiDocker />, color: "#2496ed" },
  { name: "Encore", icon: <SiTypescript />, color: "#a259ff" },
];

const Item = ({ s }: { s: Skill }) => (
  <span className="inline-flex items-center gap-2 whitespace-nowrap px-4 text-sm group cursor-hover">
    <span className="text-lg transition-transform group-hover:scale-125" style={{ color: s.color }}>{s.icon}</span>
    <span className="font-medium group-hover:text-foreground transition-colors">{s.name}</span>
  </span>
);

const Row = ({ items, reverse = false }: { items: Skill[]; reverse?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max hover:[animation-play-state:paused]" style={{ animation: `${reverse ? "marquee-reverse" : "marquee"} 40s linear infinite` }}>
        {doubled.map((s, i) => <Item key={i} s={s} />)}
      </div>
    </div>
  );
};

export function Skills() {
  return (
    <div className="relative animate-fade-up">
      <SectionLabel>My Skills</SectionLabel>
      <div className="section-card section-card-hover space-y-1">
        <Row items={ROW_1} />
        <Row items={ROW_2} reverse />
      </div>
    </div>
  );
}
