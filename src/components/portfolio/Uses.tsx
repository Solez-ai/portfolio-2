import { SectionLabel } from "./SectionLabel";
import { SiAndroidstudio, SiIntellijidea, SiAnthropic, SiGoogle } from "react-icons/si";
import { FaCode, FaRobot } from "react-icons/fa6";
import { Sparkles, Wand2, Code2 } from "lucide-react";
import type { ReactNode } from "react";

type Tool = { name: string; note?: string; icon: ReactNode; color: string };

const IDES: Tool[] = [
  { name: "Zed", icon: <Code2 />, color: "#d4b26a" },
  { name: "Android Studio", icon: <SiAndroidstudio />, color: "#3ddc84" },
  { name: "VS Code", note: "Code Editor", icon: <FaCode />, color: "#0098ff" },
  { name: "Cursor", icon: <SiIntellijidea />, color: "#ffffff" },
];

const AIS: Tool[] = [
  { name: "Claude", note: "brainstorming", icon: <SiAnthropic />, color: "#d97757" },
  { name: "ChatGPT", note: "discussion", icon: <FaRobot />, color: "#10a37f" },
  { name: "Codex", note: "building", icon: <FaRobot />, color: "#10a37f" },
  { name: "Claude Code", note: "building", icon: <SiAnthropic />, color: "#d97757" },
  { name: "Stitch AI", note: "designing", icon: <SiGoogle />, color: "#4285f4" },
];

const Item = ({ t }: { t: Tool }) => (
  <span className="inline-flex items-center gap-2 whitespace-nowrap px-4 text-sm group cursor-hover">
    <span className="text-lg transition-transform group-hover:scale-125" style={{ color: t.color }}>{t.icon}</span>
    <span className="font-medium group-hover:text-foreground transition-colors">
      {t.name}
      {t.note && <span className="text-muted-foreground font-normal"> ({t.note})</span>}
    </span>
  </span>
);

const Row = ({ items, reverse = false }: { items: Tool[]; reverse?: boolean }) => {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max hover:[animation-play-state:paused]" style={{ animation: `${reverse ? "marquee-reverse" : "marquee"} 40s linear infinite` }}>
        {doubled.map((t, i) => <Item key={i} t={t} />)}
      </div>
    </div>
  );
};

export function Uses() {
  return (
    <div className="relative animate-fade-up">
      <SectionLabel>/ai-stack</SectionLabel>
      <div className="section-card section-card-hover space-y-3">
        <div>
          <p className="text-xs font-mono text-muted-foreground mb-1 flex items-center gap-1.5"><Wand2 className="w-3.5 h-3.5" /> My Fav IDEs</p>
          <Row items={IDES} />
        </div>
        <div>
          <p className="text-xs font-mono text-muted-foreground mb-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> My Most Used AIs</p>
          <Row items={AIS} reverse />
        </div>
      </div>
    </div>
  );
}
