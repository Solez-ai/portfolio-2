import { Download, Mail } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

const RESUME = "https://drive.google.com/file/d/19R008pQKPVudWaSHJMHDOymkIu571LFM/view?usp=sharing";

const Btn = ({ children, href = "#" }: { children: React.ReactNode; href?: string }) => (
  <a href={href} target="_blank" rel="noreferrer" className="cursor-hover inline-flex items-center gap-2 border border-border rounded-md px-3 py-1.5 text-sm hover:bg-foreground hover:text-background hover:-translate-y-0.5 transition-all">
    {children}
  </a>
);

export function QuickLinks() {
  return (
    <div className="flex flex-wrap items-center gap-2 animate-fade-up">
      <Btn href="mailto:sheditzofficial918@gmail.com"><Mail className="w-4 h-4" /> Email Me</Btn>
      <span className="mx-1 text-muted-foreground">|</span>
      <Btn href="https://github.com/Solez-ai"><FaGithub className="w-4 h-4" /></Btn>
      <Btn href={RESUME}><Download className="w-4 h-4" /></Btn>
    </div>
  );
}
