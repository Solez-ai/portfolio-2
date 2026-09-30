import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { SectionLabel } from "./SectionLabel";
import solvenaiLogo from "@/assets/solvenai.png";
import mentormindLogo from "@/assets/mentormind.png";

type Job = {
  company: string; role: string; status: "Active" | "Done";
  range: string; url: string; detail: string; logo: string;
};

const JOBS: Job[] = [
  { company: "MentorMind", role: "Co-Founder & CTO", status: "Active", range: "Feb 2026 - Now",
    url: "https://instagram.com/mentormind.bd", logo: mentormindLogo,
    detail: "Building MentorMind — introducing a new culture of help to Bangladesh. Leading the tech, product, and engineering." },
  { company: "Solven.ai", role: "Junior Web Developer", status: "Done", range: "2025 · 6 months",
    url: "https://www.linkedin.com/company/solvenai/", logo: solvenaiLogo,
    detail: "Worked as a Junior Web Developer at Solven.ai, shipping client-facing features and internal tooling." },
];

function Row({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const dotColor = job.status === "Active" ? "bg-accent-green" : "bg-accent-red";
  return (
    <div className="relative pl-8 group/row">
      <span className={`absolute left-1 top-5 w-3 h-3 rounded-full ${dotColor} ring-4 ring-background`}>
        <span className={`absolute inset-0 rounded-full ${dotColor} animate-ping opacity-60`} />
      </span>
      <button onClick={() => setOpen(o => !o)} className="cursor-hover w-full flex items-center justify-between py-3 text-left hover:bg-muted/30 rounded-md px-2 transition-colors" aria-expanded={open} aria-label={`${job.company} — ${job.role}, click to ${open ? "hide" : "show"} details`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-muted overflow-hidden flex items-center justify-center group-hover/row:scale-110 transition-transform">
            <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-semibold inline-flex items-center gap-2">
              <a href={job.url} target="_blank" rel="noreferrer" className="hover:text-accent-green transition-colors" aria-label={`${job.company} website — opens in new tab`}>{job.company}</a>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${job.status === "Active" ? "text-accent-green" : "text-accent-red"} bg-muted`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${dotColor}`} aria-hidden="true" />
                {job.status}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">{job.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
          {job.range}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </div>
      </button>
      {open && (
        <div className="pb-4 pl-4 text-sm text-muted-foreground animate-fade-up">
          {job.detail}
        </div>
      )}
    </div>
  );
}

export function WorkExperience() {
  return (
    <div className="relative animate-fade-up">
      <SectionLabel>Work Experience</SectionLabel>
      <div className="section-card section-card-hover">
        <div className="relative">
          <span className="absolute left-2 top-2 bottom-2 border-l border-dashed border-border" />
          {JOBS.map(j => <Row key={j.company} job={j} />)}
        </div>
      </div>
    </div>
  );
}
