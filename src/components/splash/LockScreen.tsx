import { useState, useEffect, useRef, useCallback } from "react";
import { SparkleOverlay } from "./SparkleOverlay";

// ─── helpers ────────────────────────────────────────────────────────────────
function formatTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 || 12;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ─── spring easing ──────────────────────────────────────────────────────────
const c1 = 1.70158;
const c3 = c1 + 1;
function springOut(t: number): number {
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
const c5 = 1.525;
function springInOut(t: number): number {
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c5 + 1) * 2 * t - c5)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c5 + 1) * (t * 2 - 2) + c5) + 2) / 2;
}
function clip(t: number, start: number, end: number): number {
  if (t <= start) return 0;
  if (t >= end) return 1;
  return (t - start) / (end - start);
}

let hapticTimer: ReturnType<typeof setTimeout> | null = null;
function triggerHaptic() {
  if (hapticTimer) return;
  hapticTimer = setTimeout(() => { hapticTimer = null; }, 50);
  try { if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(8); } catch {}
}

let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); }
    catch { return null; }
  }
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}
let soundTimer: ReturnType<typeof setTimeout> | null = null;
function playUnlockSound() {
  if (soundTimer) return;
  soundTimer = setTimeout(() => { soundTimer = null; }, 300);
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime, dur = 0.22;
    const osc = ctx.createOscillator(); osc.type = "sine";
    osc.frequency.setValueAtTime(320, now); osc.frequency.exponentialRampToValueAtTime(880, now + dur);
    const harm = ctx.createOscillator(); harm.type = "sine";
    harm.frequency.setValueAtTime(480, now); harm.frequency.exponentialRampToValueAtTime(1320, now + dur);
    const g1 = ctx.createGain(); g1.gain.setValueAtTime(0, now); g1.gain.linearRampToValueAtTime(0.07, now + 0.03); g1.gain.exponentialRampToValueAtTime(0.001, now + dur);
    const g2 = ctx.createGain(); g2.gain.setValueAtTime(0, now); g2.gain.linearRampToValueAtTime(0.04, now + 0.03); g2.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(g1).connect(ctx.destination); harm.connect(g2).connect(ctx.destination);
    osc.start(now); harm.start(now); osc.stop(now + dur); harm.stop(now + dur);
  } catch {}
}

// ─── LockScreen ─────────────────────────────────────────────────────────────
interface LockScreenProps { onUnlock?: () => void }

export function LockScreen({ onUnlock }: LockScreenProps) {
  const [locked, setLocked] = useState(true);
  const [show, setShow] = useState(true);
  const [time, setTime] = useState(formatTime(new Date()));
  const [date, setDate] = useState(formatDate(new Date()));
  const [progress, setProgress] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [charging, setCharging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const animId = useRef<number | null>(null);
  const hapticFired = useRef(false);

  useEffect(() => {
    const tick = () => { const d = new Date(); setTime(formatTime(d)); setDate(formatDate(d)); };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const update = (b: any) => { setBatteryLevel(Math.round(b.level * 100)); setCharging(b.charging); };
    try {
      const batt = (navigator as any).getBattery;
      if (typeof batt === "function") batt().then((b: any) => { update(b); b.addEventListener("levelchange", () => update(b)); b.addEventListener("chargingchange", () => update(b)); });
    } catch {}
  }, []);
  useEffect(() => { return () => { if (animId.current) cancelAnimationFrame(animId.current); }; }, []);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const track = (e: PointerEvent) => {
      if (!locked) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--cx", String((e.clientX - r.left) / r.width));
      el.style.setProperty("--cy", String((e.clientY - r.top) / r.height));
    };
    window.addEventListener("pointermove", track);
    return () => window.removeEventListener("pointermove", track);
  }, [locked]);

  const unlock = useCallback(() => {
    if (!locked) return;
    triggerHaptic(); playUnlockSound();
    const start = performance.now(), dur = 900;
    function frame(now: number) {
      const raw = Math.min((now - start) / dur, 1), eased = springOut(raw);
      setProgress(Math.min(eased, 1.15));
      if (raw < 1) animId.current = requestAnimationFrame(frame);
      else { setProgress(1); setLocked(false); onUnlock?.(); setTimeout(() => setShow(false), 300); }
    }
    animId.current = requestAnimationFrame(frame);
  }, [locked, onUnlock]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.code === "Space" && locked) { e.preventDefault(); unlock(); } };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  }, [locked, unlock]);

  function onPointerDown(e: React.PointerEvent) { if (!locked) return; startY.current = e.clientY; hapticFired.current = false; }
  function onPointerMove(e: React.PointerEvent) {
    if (!locked) return;
    const dy = e.clientY - startY.current;
    if (dy < 0) {
      const p = Math.min(Math.abs(dy) / 180, 1); setProgress(p);
      if (p >= 0.4 && !hapticFired.current) { triggerHaptic(); hapticFired.current = true; }
    }
  }
  function onPointerUp() {
    if (!locked) return;
    if (progress >= 0.35) { unlock(); return; }
    hapticFired.current = false;
    const start = performance.now(), dur = 300, startP = Math.min(progress, 1);
    function bounce(now: number) {
      const t = Math.min((now - start) / dur, 1), ease = 1 - Math.pow(1 - t, 3);
      setProgress(Math.max(0, startP * (1 - ease) * (1 + 0.08 * Math.sin(t * Math.PI))));
      if (t < 1) requestAnimationFrame(bounce);
    }
    requestAnimationFrame(bounce);
  }

  if (!show) return null;

  const p = Math.min(progress, 1);
  const bgBlur = Math.max(0, 14 * (1 - p));       // full wallpaper, slightly blurry
  const containerScale = 1 - progress * 0.04;
  const containerY = Math.min(progress, 1) * -50;
  const containerOpacity = Math.max(0, 1 - p);

  // ── per-element stagger ──────────────────────────────────────────────
  const tp = clip(p, 0, 0.6);  const timeY = springOut(tp) * -40;  const timeScale = 1 + (1 - springOut(tp)) * 0.06;  const timeOpacity = 1 - springInOut(tp);
  const dp = clip(p, 0.08, 0.65);  const dateY = springOut(dp) * 20;  const dateOpacity = 1 - springOut(dp);
  const np = clip(p, 0, 0.4);  const notifY = springOut(np) * 60;  const notifScale = 1 - (1 - springOut(np)) * 0.05;  const notifOpacity = 1 - springOut(np);
  const dndOp = Math.max(0, 1 - clip(p, 0, 0.22) * 2);
  const hp = clip(p, 0, 0.35);  const homePillScale = 1 - springOut(hp) * 0.35;  const homePillY = springOut(hp) * 18;  const homePillOpacity = 1 - springOut(hp);
  const swipeLabelOp = Math.max(0, 1 - clip(p, 0, 0.18) * 3);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{ cursor: "auto", opacity: containerOpacity, touchAction: "none", "--cx": 0.5, "--cy": 0.5, willChange: "opacity" } as React.CSSProperties}
      aria-label="Lock screen — press space or swipe up to unlock"
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerCancel={onPointerUp}
    >
      {/* ── FULL wallpaper — always slightly blurred / frosted ────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/wallpaper.jpg)`,
          filter: `blur(${bgBlur}px) saturate(1.05) brightness(0.85)`,
          transform: `scale(${1 + bgBlur / 140})`,
          willChange: "filter",
        }}
      />

      {/* ── frosted overlay — subtle white haze over everything ───────── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)",
        }}
      />

      {/* ── darken vignette for depth ──────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* ── warm tint ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, transparent 45%, rgba(160,100,50,0.06) 100%)" }}
      />

      {/* ── sparkles (full screen — no clip) ──────────────────────────── */}
      <SparkleOverlay />

      {/* ── CONTENT ────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transform: `scale(${containerScale}) translateY(${containerY}px)` }}
      >
        <div className="relative z-10 flex flex-col items-center h-full w-full px-6 mx-auto"
          style={{ maxWidth: "48rem" }}
        >
          {/* ═══ status bar (top) ═══════════════════════════════════════ */}
          <div className="shrink-0 w-full pt-3 pb-0"
            style={{
              opacity: 1 - springOut(clip(p, 0.25, 0.55)),
              transform: `translateY(${springOut(clip(p, 0.15, 0.45)) * -8}px)`,
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-sm">{time}</span>
              <div className="flex items-center gap-2.5">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                  <rect x="0" y="7" width="3" height="5" rx="0.6" fill="white" opacity="0.35" />
                  <rect x="5" y="4" width="3" height="8" rx="0.6" fill="white" opacity="0.55" />
                  <rect x="10" y="1.5" width="3" height="10.5" rx="0.6" fill="white" opacity="0.8" />
                  <rect x="15" y="0" width="3" height="12" rx="0.6" fill="white" />
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                  <path d="M8 11.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM5.2 8.2a4 4 0 0 1 5.6 0M2.8 5.3a7.5 7.5 0 0 1 10.4 0" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
                <div className="flex items-center gap-1" aria-label={`Battery ${batteryLevel}%${charging ? ", charging" : ""}`}>
                  {charging && <svg width="10" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#34c759" /></svg>}
                  <div className="relative w-[26px] h-[13px] border border-white/70 rounded-[3.5px] flex items-center px-[2px]">
                    <div className="h-[9px] rounded-[1.5px]" style={{ width: `${batteryLevel}%`, backgroundColor: batteryLevel > 20 ? "#34c759" : "#ff3b30" }} />
                  </div>
                  <div className="w-[2.5px] h-[5px] bg-white/70 rounded-r-full" />
                </div>
              </div>
            </div>
          </div>

          {/* ═══ clock — moved up (top third of screen) ═════════════════ */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            {/* fluid glass clock container */}
            <div className="relative text-center">
              {/* CSS fluid glass glow behind clock */}
              <div className="absolute -inset-10 blur-[100px] opacity-60 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)",
                }}
              />
              <div className="relative" style={{ opacity: timeOpacity, transform: `translateY(${timeY}px) scale(${timeScale})` }}>
                <div
                  className="text-[13vw] sm:text-[9vw] md:text-[6.5rem] lg:text-[7.5rem] font-[275] leading-none tracking-[0.015em] text-white"
                  style={{
                    textShadow: "0 2px 30px rgba(0,0,0,0.3), 0 1px 8px rgba(0,0,0,0.15)",
                    // Fluid glass effect: refractive edge glow
                    WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 65%, transparent 92%)",
                    maskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 65%, transparent 92%)",
                  }}
                >
                  {time}
                </div>
                {/* glass reflection line */}
                <div className="absolute inset-x-0 h-[1px] top-1/2 -translate-y-3 opacity-25 pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.35) 50%, transparent 90%)" }} />
              </div>
              <div className="text-lg sm:text-xl text-white/85 font-normal mt-2 tracking-wide"
                style={{ opacity: dateOpacity, transform: `translateY(${dateY}px)`, textShadow: "0 1px 20px rgba(0,0,0,0.2)" }}
              >
                {date}
              </div>
            </div>
          </div>

          {/* ═══ bottom section — notification, DND, swipe indicator centered ═══ */}
          <div className="shrink-0 flex flex-col items-center pb-8 w-full relative">
            {/* fluid glass glow behind bottom elements */}
            <div className="absolute inset-0 blur-[60px] opacity-40 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
              }}
            />

            {/* notification with enhanced fluid glass */}
            <div className="w-full max-w-sm mb-4 relative"
              style={{ opacity: notifOpacity, transform: `translateY(${notifY}px) scale(${notifScale})` }}
            >
              <div className="relative overflow-hidden rounded-2xl p-4 border border-white/20"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.14) 100%)",
                  backdropFilter: "blur(50px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(50px) saturate(1.4)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(255,255,255,0.08)",
                }}
              >
                {/* fluid glass refractive edge shine */}
                <div className="absolute -inset-[1px] rounded-2xl opacity-30 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.15) 100%)",
                  }}
                />
                <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)" }} />
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #007aff, #5856d6)", boxShadow: "0 2px 8px rgba(0,122,255,0.3)" }} aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 font-semibold text-sm">Portfolio</span>
                      <span className="text-white/50 text-[11px] font-medium">now</span>
                    </div>
                    <p className="text-white/75 text-sm mt-0.5 leading-snug">Welcome to the portfolio — swipe up to explore</p>
                  </div>
                </div>
              </div>
            </div>

            {/* DND with fluid glass */}
            <div className="mb-4 relative" style={{ opacity: dndOp }} aria-label="Do Not Disturb is on">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full text-white/80 text-sm font-medium"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)",
                  backdropFilter: "blur(25px)", WebkitBackdropFilter: "blur(25px)",
                  border: "1px solid rgba(255,255,255,0.15)", boxShadow: "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2v20M2 12h20" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5" /></svg>
                <span>Do Not Disturb</span>
              </div>
            </div>

            {/* swipe indicator with fluid glass */}
            <div className="flex flex-col items-center gap-3 relative"
              style={{ opacity: homePillOpacity, transform: `translateY(${homePillY}px)` }}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-white/30 font-medium tracking-[0.15em] uppercase"
                style={{ opacity: swipeLabelOp }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
                <span>Swipe up to unlock</span>
              </div>
              <div className="w-[134px] h-[5px] rounded-full"
                style={{
                  background: progress > 0 ? `rgba(255,255,255,${0.5 + Math.min(progress, 1) * 0.3})` : "rgba(255,255,255,0.5)",
                  boxShadow: "0 0 12px rgba(0,0,0,0.3)", transform: `scaleX(${homePillScale})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* unlock burst */}
      <div className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: progress > 0 ? `radial-gradient(circle at 50% 85%, rgba(255,255,255,${Math.min(progress, 1) * 0.07}) 0%, transparent 70%)` : "transparent",
        }}
      />
    </div>
  );
}
