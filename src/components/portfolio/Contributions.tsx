import { useEffect, useState } from "react";

const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const LEVELS = [
  "bg-muted",
  "bg-neutral-700",
  "bg-neutral-500",
  "bg-neutral-300",
  "bg-white",
];

type Day = { date: string; count: number; level: number };

const USERNAME = "Solez-ai";

export function Contributions() {
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: 7 }, () => Array(52).fill(0)));
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`);
        const json: { total: Record<string, number>; contributions: Day[] } = await res.json();
        if (cancel) return;

        const days = json.contributions.slice(-364);
        // arrange into 7 rows x 52 cols (weekday rows)
        const rows: number[][] = Array.from({ length: 7 }, () => [] as number[]);
        for (let i = 0; i < 52; i++) {
          for (let d = 0; d < 7; d++) {
            const day = days[i * 7 + d];
            rows[d].push(day ? day.level : 0);
          }
        }
        setGrid(rows);
        const t = Object.values(json.total).reduce((a, b) => a + b, 0);
        setTotal(t);
      } catch {
        // keep empty grid on failure
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  return (
    <div className="section-card">
      <div className="flex justify-between text-xs text-muted-foreground font-mono mb-2 px-6">
        {MONTHS.map(m => <span key={m}>{m}</span>)}
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex flex-col gap-1 min-w-max">
          {grid.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map((lvl, ci) => (
                <span key={ci} className={`w-3 h-3 rounded-sm ${LEVELS[lvl]}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm">
        <p className="text-muted-foreground">
          {loading
            ? "Loading GitHub contributions…"
            : total !== null
            ? <>This year, I achieved <span className="text-foreground font-semibold">{total}</span> contributions on <a href={`https://github.com/${USERNAME}`} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-accent-green">@{USERNAME}</a></>
            : <>Couldn&apos;t load contributions right now.</>}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
          Less {LEVELS.map((c, i) => <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />)} More
        </div>
      </div>
    </div>
  );
}
