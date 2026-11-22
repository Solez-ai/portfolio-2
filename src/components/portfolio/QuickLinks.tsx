import { ArrowUpRight, Mail } from "lucide-react";

export function QuickLinks() {
  return (
    <div className="flex flex-wrap items-center gap-3 animate-fade-up">
      <a
        href="mailto:sheditzofficial918@gmail.com"
        className="cursor-hover group relative inline-flex items-center gap-2.5 rounded-lg bg-foreground text-background font-semibold text-sm px-5 py-2.5 border border-white/20 shadow-[0_4px_0_0_rgba(255,255,255,0.22),0_12px_28px_-8px_rgba(255,255,255,0.32)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_0_rgba(255,255,255,0.26),0_16px_32px_-8px_rgba(255,255,255,0.42)] active:translate-y-0.5 active:shadow-[0_1px_0_0_rgba(255,255,255,0.2)]"
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <Mail className="w-4 h-4" aria-hidden="true" />
        <span>Email Me</span>
        <ArrowUpRight
          className="w-4 h-4 opacity-70 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
