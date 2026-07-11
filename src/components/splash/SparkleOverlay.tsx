import { useMemo } from "react";

// ─── Sparkle definitions ────────────────────────────────────────────────────
interface Sparkle {
  id: number;
  x: number;
  y: number;
  driftX: number;
  driftY: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  hue: number;
  factor: number; // parallax factor (deep = more movement)
}

const FOREGROUND_COUNT = 24;
const DEEP_COUNT = 14;

function generateForeground(): Sparkle[] {
  return Array.from({ length: FOREGROUND_COUNT }, (_, i) => ({
    id: i,
    x: 4 + Math.random() * 92,
    y: 4 + Math.random() * 92,
    driftX: (Math.random() - 0.5) * 100,
    driftY: (Math.random() - 0.6) * 70,
    size: 1.5 + Math.random() * 3,
    opacity: 0.12 + Math.random() * 0.28,
    duration: 14 + Math.random() * 18,
    delay: Math.random() * 14,
    hue: Math.random() < 0.25 ? 40 : 0,
    factor: 0.5 + Math.random() * 0.8, // 0.5–1.3
  }));
}

function generateDeepLayer(): Sparkle[] {
  return Array.from({ length: DEEP_COUNT }, (_, i) => ({
    id: 1000 + i,
    x: 4 + Math.random() * 92,
    y: 4 + Math.random() * 92,
    driftX: (Math.random() - 0.5) * 50,
    driftY: (Math.random() - 0.5) * 30,
    size: 6 + Math.random() * 8,
    opacity: 0.06 + Math.random() * 0.1,
    duration: 28 + Math.random() * 22,
    delay: Math.random() * 20,
    hue: Math.random() < 0.35 ? 210 : 0,
    factor: 1.0 + Math.random() * 1.0, // 1.0–2.0 — moves more = deeper
  }));
}

// ─── render one particle (two nested divs to avoid animation override) ──────
//   Outer div: cursor-driven parallax translate (reads --cx/--cy from parent)
//   Inner div: CSS keyframe animation (sparkle-drift)
//   They operate on separate transforms so they don't conflict.
function Particle({ s, animName }: { s: Sparkle; animName: string }) {
  const glowSize = s.size * (animName === "sparkle-drift-deep" ? 4 : 3);
  const isDeep = animName === "sparkle-drift-deep";

  // Parallax sensitivity: deep layer moves ~2x more than foreground
  const parallaxPxX = isDeep ? 40 : 20;
  const parallaxPxY = isDeep ? 30 : 15;

  return (
    <div
      className="absolute"
      style={{
        left: `${s.x}%`,
        top: `${s.y}%`,
        // Cursor parallax goes on the OUTER wrapper (not animated by CSS)
        transform: `
          translate(
            calc((var(--cx, 0.5) - 0.5) * ${s.factor * parallaxPxX}px),
            calc((var(--cy, 0.5) - 0.5) * ${s.factor * parallaxPxY}px)
          )
        `,
        willChange: "transform",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: `${s.size}px`,
          height: `${s.size}px`,
          borderRadius: "50%",
          opacity: 0,
          background:
            s.hue === 0
              ? isDeep
                ? "rgba(255,255,255,0.6)"
                : "rgba(255,255,255,0.85)"
              : `hsla(${s.hue}, 25%, 80%, ${isDeep ? 0.5 : 0.8})`,
          boxShadow: `0 0 ${glowSize}px ${s.size * (isDeep ? 0.5 : 0.3)}px ${
            s.hue === 0
              ? isDeep
                ? "rgba(255,255,255,0.12)"
                : "rgba(255,255,255,0.25)"
              : `hsla(${s.hue}, 25%, 75%, ${isDeep ? 0.1 : 0.2})`
          }`,
          filter: isDeep ? "blur(1.5px)" : "none",
          animation: `${animName} ${s.duration}s ${s.delay}s ease-in-out infinite`,
          "--sp-x": `${s.driftX}px`,
          "--sp-y": `${s.driftY}px`,
          "--sp-op": s.opacity,
          willChange: "transform, opacity",
        } as React.CSSProperties}
      />
    </div>
  );
}

// ─── SparkleOverlay ─────────────────────────────────────────────────────────
export function SparkleOverlay() {
  const foreground = useMemo(() => generateForeground(), []);
  const deepLayer = useMemo(() => generateDeepLayer(), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {deepLayer.map((s) => (
        <Particle key={s.id} s={s} animName="sparkle-drift-deep" />
      ))}
      {foreground.map((s) => (
        <Particle key={s.id} s={s} animName="sparkle-drift" />
      ))}
    </div>
  );
}
