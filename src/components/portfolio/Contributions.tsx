import { useEffect, useState } from "react";

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LEVELS = [
  "bg-muted",
  "bg-neutral-700",
  "bg-neutral-500",
  "bg-neutral-300",
  "bg-white",
];

type DayCell = { date: string; count: number; level: number };

const USERNAME = "Solez-ai";

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

async function loadContributions(username: string): Promise<DayCell[]> {
  const today = todayIso();

  // Primary: same-origin proxy (Vite dev proxy + Vercel rewrite -> github-contributions.vercel.app)
  try {
    const res = await fetchWithTimeout(`/api/github-contributions/${username}`, 6000);
    if (res.ok) {
      const json = (await res.json()) as {
        contributions?: Array<{ date: string; count: number; intensity?: string | number; level?: number }>;
      };
      if (Array.isArray(json.contributions) && json.contributions.length > 0) {
        return json.contributions
          .filter((d) => d.date <= today)
          .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
          .map((d) => ({
            date: d.date,
            count: Number(d.count) || 0,
            level: Math.min(4, Math.max(0, Number(d.intensity ?? d.level ?? 0))),
          }));
      }
    }
  } catch {
    // Fall through to backup endpoint
  }

  // Fallback: jogruber API
  const res = await fetchWithTimeout(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
    5000
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as {
    contributions?: Array<{ date: string; count: number; level: number }>;
  };
  if (!Array.isArray(json.contributions) || json.contributions.length === 0) {
    throw new Error("Empty contributions");
  }
  return json.contributions
    .filter((d) => d.date <= today)
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .map((d) => ({
      date: d.date,
      count: Number(d.count) || 0,
      level: Math.min(4, Math.max(0, Number(d.level) || 0)),
    }));
}

function buildCalendar(days: DayCell[]): {
  grid: (DayCell | null)[][];
  months: string[];
  total: number;
} {
  // Take up to last 364 days aligned to 52 columns x 7 rows (Sun..Sat)
  const slice = days.slice(-364);
  const total = days.slice(-365).reduce((sum, d) => sum + d.count, 0);

  const rows: (DayCell | null)[][] = Array.from({ length: 7 }, () => Array(52).fill(null));
  const months: string[] = [];
  let lastMonth = -1;

  for (let col = 0; col < 52; col++) {
    const colStart = slice[col * 7];
    if (colStart) {
      const m = Number(colStart.date.slice(5, 7)) - 1;
      if (m !== lastMonth && m >= 0 && m < 12) {
        months.push(MONTH_NAMES[m]);
        lastMonth = m;
      }
    }
    for (let row = 0; row < 7; row++) {
      const day = slice[col * 7 + row];
      rows[row][col] = day ?? null;
    }
  }

  return {
    grid: rows,
    months: months.length >= 10 ? months.slice(-12) : MONTH_NAMES,
    total,
  };
}

export function Contributions() {
  const [grid, setGrid] = useState<(DayCell | null)[][]>(() =>
    Array.from({ length: 7 }, () => Array(52).fill(null))
  );
  const [months, setMonths] = useState<string[]>(MONTH_NAMES);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const days = await loadContributions(USERNAME);
        if (cancel) return;
        const cal = buildCalendar(days);
        setGrid(cal.grid);
        setMonths(cal.months);
        setTotal(cal.total);
      } catch {
        // keep empty grid on failure
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  return (
    <div className="section-card">
      <div className="flex justify-between text-xs text-muted-foreground font-mono mb-2 px-2">
        {months.map((m, idx) => (
          <span key={`${m}-${idx}`}>{m}</span>
        ))}
      </div>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex flex-col gap-1 min-w-max">
          {grid.map((row, ri) => (
            <div key={ri} className="flex gap-1">
              {row.map((cell, ci) => (
                <span
                  key={ci}
                  title={
                    cell
                      ? `${cell.count} contribution${cell.count === 1 ? "" : "s"} on ${cell.date}`
                      : undefined
                  }
                  className={`w-3 h-3 rounded-sm transition-colors duration-300 ${
                    LEVELS[cell?.level ?? 0]
                  } ${loading ? "animate-pulse" : ""}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 text-sm">
        <p className="text-muted-foreground">
          {loading ? (
            "Loading GitHub contributions…"
          ) : total !== null ? (
            <>
              This year, I achieved{" "}
              <span className="text-foreground font-semibold">{total.toLocaleString()}</span>{" "}
              contributions on{" "}
              <a
                href={`https://github.com/${USERNAME}`}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:text-accent-green"
              >
                @{USERNAME}
              </a>
            </>
          ) : (
            <>Couldn&apos;t load contributions right now.</>
          )}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
          Less {LEVELS.map((c, i) => <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />)} More
        </div>
      </div>
    </div>
  );
}
