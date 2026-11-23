import { Trophy } from "lucide-react";
import { SectionLabel } from "./SectionLabel";

type AwardItem = {
  lead: string;
  body: string;
};

const AWARDS: AwardItem[] = [
  {
    lead: "Champion, ICT Olympiad Bangladesh 2025 (Season 2)",
    body: ", plus multiple hackathon and coding competition wins",
  },
  {
    lead: "Fibonacci International STEM Olympiad 2026",
    body: ": DORJA recognized, with an invitation to compete in the finals in Italy",
  },
  {
    lead: "BrailleBridge",
    body: ": recognized by BERDO (Blind Education and Rehabilitation Development Organization), the Dhaka University Library Resource Centre for Visually Impaired Students, and DRMC Science Fest at Daffodil International University; reviewed by the Education Minister",
  },
  {
    lead: "26th of 8,000 contestants",
    body: ", International Academic Research Competition, for a medical AI research paper",
  },
  {
    lead: "LifeSphere (co-developer)",
    body: ": medical innovation project shortlisted for a national-level event, with potential review by the Prime Minister",
  },
  {
    lead: "International Computer Science Competition",
    body: ": international recognition",
  },
  {
    lead: "English Olympiad",
    body: ": selected for the Grand Final (Malaysia and Singapore)",
  },
  {
    lead: "Best Overall Student",
    body: ", Lalbagh area administration, among thousands of students",
  },
  {
    lead: "Awarded by the Director General of BGB",
    body: " for International Affairs",
  },
];

export function Awards() {
  return (
    <div className="relative animate-fade-up">
      <SectionLabel>Awards &amp; Recognition</SectionLabel>
      <div className="section-card section-card-hover">
        <ul className="divide-y divide-dashed divide-border/70">
          {AWARDS.map((item) => (
            <li
              key={item.lead}
              className="flex items-start gap-3 py-3 first:pt-1 last:pb-1 group"
            >
              <span className="mt-0.5 shrink-0 w-6 h-6 rounded-md bg-muted border border-border flex items-center justify-center text-accent-green group-hover:scale-110 transition-transform">
                <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">{item.lead}</strong>
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
