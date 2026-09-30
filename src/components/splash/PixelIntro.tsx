import { useCallback, useEffect, useRef, useState } from "react";
import DitherVeil from "@/components/reactbits/DitherVeil";

import "./PixelIntro.css";

/** How long the veil keeps dithering before it dissolves away. */
const HOLD_MS = 1500;
/** Must match the dissolve duration in PixelIntro.css. */
const EXIT_MS = 900;

interface PixelIntroProps {
  onRevealDone?: () => void;
}

/**
 * Intro overlay: a DitherVeil that constantly pixelates on its own (wander),
 * holds for a beat, then dissolves in a blocky grid to reveal the portfolio.
 */
export function PixelIntro({ onRevealDone }: PixelIntroProps) {
  const [phase, setPhase] = useState<"loading" | "holding" | "exiting" | "gone">("loading");
  const doneRef = useRef(false);
  const timers = useRef<number[]>([]);

  const track = useCallback((id: number) => {
    timers.current.push(id);
  }, []);

  // Fade the label out as the veil leaves.
  useEffect(() => {
    if (phase !== "exiting") return;
    const id = window.setTimeout(() => setPhase("gone"), EXIT_MS);
    track(id);
  }, [phase, track]);

  // Report once, after the overlay is fully gone.
  useEffect(() => {
    if (phase === "gone" && !doneRef.current) {
      doneRef.current = true;
      onRevealDone?.();
    }
  }, [phase, onRevealDone]);

  useEffect(() => {
    const ids = timers.current;
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      ids.length = 0;
    };
  }, []);

  const handleReady = useCallback(() => {
    setPhase((p) => (p === "loading" ? "holding" : p));
  }, []);

  // Start the dissolve once the image has faded in and the hold is over.
  useEffect(() => {
    if (phase !== "holding") return;
    const id = window.setTimeout(() => setPhase("exiting"), HOLD_MS);
    track(id);
  }, [phase, track]);

  if (phase === "gone") return null;

  const exiting = phase === "exiting";

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden bg-background"
      style={{ pointerEvents: exiting ? "none" : "auto" }}
      aria-hidden={exiting}
    >
      <div
        className={`absolute inset-0 ${exiting ? "pixel-intro pixel-intro__veil" : ""}`}
      >
        <DitherVeil
          src="/wallpaper.jpg"
          fit="cover"
          pattern="floyd"
          pixelSize={3}
          levels={2}
          palette="duotone"
          inkColor="#171717"
          paperColor="#e8e4dc"
          contrast={1.25}
          brightness={0.02}
          revealRadius={260}
          softness={0.7}
          linger={1.2}
          rimColor="#a78bfa"
          rim={0.08}
          wander
          clickBurst={false}
          onReady={handleReady}
        />
      </div>

      {/* status line, sits above the veil while it pixelates */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-8 flex justify-center transition-opacity duration-500 ${
          exiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="pixel-intro__label font-mono text-[11px] uppercase tracking-[0.35em] text-white/50">
          {phase === "loading" ? "loading" : "ready"}
        </span>
      </div>
    </div>
  );
}
