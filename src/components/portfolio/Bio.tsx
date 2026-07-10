import { SiReact, SiTailwindcss, SiPostgresql, SiSupabase, SiNextdotjs, SiTypescript } from "react-icons/si";
import { Database } from "lucide-react";
import type { ReactNode } from "react";

const Chip = ({ icon, children }: { icon?: ReactNode; children: ReactNode }) => (
  <span className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-accent-green transition-colors">
    {icon}
    {children}
  </span>
);

export function Bio() {
  return (
    <div className="animate-fade-up space-y-3">
      <p className="text-muted-foreground leading-relaxed">
        Yup! I&apos;m a <Chip>Full Stack Developer</Chip> and solo founder known as <Chip icon={<SiTypescript className="w-4 h-4 text-[#3178c6]" />}>SOLEZ</Chip> (<Chip>SOLEZ-AI</Chip> / <Chip>solez.ai</Chip>) who is currently building{" "}
        <Chip>MentorMind</Chip> — introducing a new culture of help to Bangladesh. I use{" "}
        <Chip icon={<SiReact className="w-4 h-4 text-[#61dafb]" />}>React</Chip>,{" "}
        <Chip icon={<SiTailwindcss className="w-4 h-4 text-[#38bdf8] />}>Tailwind</Chip> to build frontends,{" "}
        <Chip icon={<Database className="w-4 h-4 text-[#e5e5e5]" />}>SQL</Chip> &{" "}
        <Chip icon={<SiSupabase className="w-4 h-4 text-[#3ecf8e]" />}>Supabase</Chip> for backends,{" "}
        <Chip icon={<SiNextdotjs className="w-4 h-4" />}>Next.js</Chip> to create complete full-stack web apps,
        and by using modern databases like{" "}
        <Chip icon={<SiPostgresql className="w-4 h-4 text-[#4169e1]" />}>PostgreSQL</Chip>.
      </p>
      <p className="text-xs text-muted-foreground font-mono">
        <span className="text-accent-green">//</span> aliases: <strong className="text-foreground">Solez-ai</strong> · <strong className="text-foreground">SOLEZ-AI</strong> · <strong className="text-foreground">solez.ai</strong> · <strong className="text-foreground">SOLEZ</strong>
      </p>
    </div>
  );
}
