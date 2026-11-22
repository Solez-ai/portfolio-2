import { useState, useEffect, useRef, useCallback } from "react";
import { SparkleOverlay } from "./SparkleOverlay";

// ─── Time & Date formatting ─────────────────────────────────────────────────
function formatTime(d: Date) {
  const h = d.getHours();
  const m = d.getMinutes();
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")}`;
}

function formatStatusTime(d: Date) {
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

// ─── Real Damped Harmonic Oscillator (Apple-style mass-spring-damper) ───────
class Spring1D {
  value: number;
  velocity = 0;
  target: number;
  stiffness: number;
  damping: number;
  mass: number;

  constructor(initial: number, stiffness: number, damping: number, mass = 1) {
    this.value = initial;
    this.target = initial;
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
  }

  /** Sub-stepped symplectic Euler integration — identical physics at 60/120/240Hz */
  step(dt: number): void {
    const clamped = Math.min(dt, 0.032);
    const maxSubStep = 1 / 240;
    const steps = Math.max(1, Math.ceil(clamped / maxSubStep));
    const h = clamped / steps;

    for (let i = 0; i < steps; i++) {
      const force = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
      const accel = force / this.mass;
      this.velocity += accel * h;
      this.value += this.velocity * h;
    }
  }

  isSettled(posEps = 0.35, velEps = 1.5): boolean {
    return Math.abs(this.value - this.target) <= posEps && Math.abs(this.velocity) <= velEps;
  }
}

/** iOS rubber-band resistance for over-dragging downward */
function rubberBand(distance: number, dimension: number, constant = 0.55): number {
  if (distance <= 0) return distance;
  return (distance * dimension * constant) / (dimension + constant * distance);
}

function clamp(v: number, min: number, max: number): number {
  return v < min ? min : v > max ? max : v;
}

// ─── Haptics & Subtle Unlock Chime ──────────────────────────────────────────
let hapticTimer: ReturnType<typeof setTimeout> | null = null;
function triggerHaptic(ms = 8) {
  if (hapticTimer) return;
  hapticTimer = setTimeout(() => {
    hapticTimer = null;
  }, 50);
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
  } catch {}
}

let audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

let soundTimer: ReturnType<typeof setTimeout> | null = null;
function playUnlockSound() {
  if (soundTimer) return;
  soundTimer = setTimeout(() => {
    soundTimer = null;
  }, 300);
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const dur = 0.2;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(920, now + dur);

    const harm = ctx.createOscillator();
    harm.type = "sine";
    harm.frequency.setValueAtTime(510, now);
    harm.frequency.exponentialRampToValueAtTime(1380, now + dur);

    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0, now);
    g1.gain.linearRampToValueAtTime(0.06, now + 0.025);
    g1.gain.exponentialRampToValueAtTime(0.001, now + dur);

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(0.032, now + 0.025);
    g2.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(g1).connect(ctx.destination);
    harm.connect(g2).connect(ctx.destination);
    osc.start(now);
    harm.start(now);
    osc.stop(now + dur);
    harm.stop(now + dur);
  } catch {}
}

// ─── LockScreen ─────────────────────────────────────────────────────────────
interface LockScreenProps {
  onUnlock?: () => void;
  /** Called directly inside rAF with normalized reveal progress [0..1] — zero React re-renders */
  onProgress?: (progress: number) => void;
}

export function LockScreen({ onUnlock, onProgress }: LockScreenProps) {
  const [mounted, setMounted] = useState(true);
  const [sparklesPaused, setSparklesPaused] = useState(false);
  const [time, setTime] = useState(() => formatTime(new Date()));
  const [statusTime, setStatusTime] = useState(() => formatStatusTime(new Date()));
  const [date, setDate] = useState(() => formatDate(new Date()));
  const [batteryLevel, setBatteryLevel] = useState(87);
  const [charging, setCharging] = useState(false);

  // Direct DOM refs — mutated inside rAF for 120fps zero-re-render physics
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const lockShackleRef = useRef<SVGPathElement>(null);
  const lockWrapRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const dndRef = useRef<HTMLDivElement>(null);
  const pillWrapRef = useRef<HTMLDivElement>(null);
  const pillBarRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  // Physics engine state in refs
  const physicsRef = useRef({
    sheet: new Spring1D(0, 120, 24, 1.15),
    clock: new Spring1D(0, 95, 19, 1.3),
    date: new Spring1D(0, 115, 21, 1.15),
    notif: new Spring1D(0, 145, 22, 1.0),
    dnd: new Spring1D(0, 170, 23, 0.9),
    pill: new Spring1D(0, 220, 23, 0.75),
    pillScaleX: new Spring1D(1, 260, 22, 0.75),
    status: new Spring1D(0, 140, 24, 1.1),
    shackle: new Spring1D(0, 260, 20, 0.8),
    isDragging: false,
    isUnlocking: false,
    unlockedDone: false,
    pointerId: -1,
    startY: 0,
    lastY: 0,
    lastTime: 0,
    velocityY: 0, // px/s
    thresholdHapticFired: false,
    wheelAccum: 0,
    wheelResetTimer: null as ReturnType<typeof setTimeout> | null,
    rafId: null as number | null,
    lastFrame: 0,
  });

  // Clock & Battery
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(formatTime(d));
      setStatusTime(formatStatusTime(d));
      setDate(formatDate(d));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const update = (b: { level: number; charging: boolean }) => {
      setBatteryLevel(Math.round(b.level * 100));
      setCharging(b.charging);
    };
    try {
      const batt = (navigator as unknown as { getBattery?: () => Promise<{ level: number; charging: boolean; addEventListener: (e: string, cb: () => void) => void }> }).getBattery;
      if (typeof batt === "function") {
        batt().then((b) => {
          update(b);
          b.addEventListener("levelchange", () => update(b));
          b.addEventListener("chargingchange", () => update(b));
        });
      }
    } catch {}
  }, []);

  // Lock page scroll while lockscreen is mounted
  useEffect(() => {
    if (!mounted) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [mounted]);

  // Apply current spring values directly to GPU-composited DOM properties
  const applyTransforms = useCallback(() => {
    const ph = physicsRef.current;
    const vh = window.innerHeight || 800;

    const sy = ph.sheet.value; // 0 at rest, negative when lifted up, positive on rubber-band pull down
    const liftProgress = clamp(-sy / (vh * 0.88), 0, 1);
    const stretchDown = Math.max(0, sy);

    // Notify parent (portfolio content scales in live behind rising curtain)
    onProgressRef.current?.(liftProgress);

    // 1. Main frosted glass curtain — translates smoothly upward like iOS lock screen sheet
    if (sheetRef.current) {
      const sheetOpacity = clamp(1 - Math.max(0, (liftProgress - 0.58) / 0.42), 0, 1);
      sheetRef.current.style.transform = `translate3d(0, ${sy.toFixed(2)}px, 0)`;
      sheetRef.current.style.opacity = sheetOpacity.toFixed(3);
    }

    // 2. Static pre-blurred wallpaper — subtle GPU scale-down/parallax (NEVER re-blurs!)
    if (bgRef.current) {
      const bgScale = 1.08 + stretchDown * 0.0004 - liftProgress * 0.04;
      const bgY = -sy * 0.12;
      bgRef.current.style.transform = `translate3d(0, ${bgY.toFixed(2)}px, 0) scale(${bgScale.toFixed(4)})`;
    }

    // 3. Status bar — stays gently anchored then glides out smoothly
    if (statusRef.current) {
      const stY = ph.status.value;
      const stOp = clamp(1 - liftProgress * 1.9, 0, 1);
      statusRef.current.style.transform = `translate3d(0, ${stY.toFixed(2)}px, 0)`;
      statusRef.current.style.opacity = stOp.toFixed(3);
    }

    // 4. Apple Padlock shackle — pops open with crisp spring physics
    if (lockShackleRef.current) {
      const sh = ph.shackle.value;
      const liftShackle = -sh * 3.2;
      const rotShackle = sh * 18;
      lockShackleRef.current.style.transform = `translate3d(0, ${liftShackle.toFixed(2)}px, 0) rotate(${rotShackle.toFixed(2)}deg)`;
    }
    if (lockWrapRef.current) {
      const lockOp = clamp(1 - liftProgress * 1.7, 0, 1);
      lockWrapRef.current.style.transform = `translate3d(0, ${(ph.date.value * 0.85).toFixed(2)}px, 0)`;
      lockWrapRef.current.style.opacity = lockOp.toFixed(3);
    }

    // 5. Clock — heavier inertia, subtle depth scale & floating glass separation
    if (clockRef.current) {
      const cy = ph.clock.value;
      const cScale = 1 + liftProgress * 0.045 - stretchDown * 0.00025;
      const cOp = clamp(1 - liftProgress * 1.55, 0, 1);
      clockRef.current.style.transform = `translate3d(0, ${cy.toFixed(2)}px, 0) scale(${cScale.toFixed(4)})`;
      clockRef.current.style.opacity = cOp.toFixed(3);
    }

    // 6. Date — slightly snappier than clock for layered typographic depth
    if (dateRef.current) {
      const dy = ph.date.value;
      const dOp = clamp(1 - liftProgress * 1.75, 0, 1);
      dateRef.current.style.transform = `translate3d(0, ${dy.toFixed(2)}px, 0)`;
      dateRef.current.style.opacity = dOp.toFixed(3);
    }

    // 7. Notification card — lifts ahead with subtle scale & crisp fade
    if (notifRef.current) {
      const ny = ph.notif.value;
      const nScale = 1 - liftProgress * 0.06;
      const nOp = clamp(1 - liftProgress * 2.1, 0, 1);
      notifRef.current.style.transform = `translate3d(0, ${ny.toFixed(2)}px, 0) scale(${nScale.toFixed(4)})`;
      notifRef.current.style.opacity = nOp.toFixed(3);
    }

    // 8. Do Not Disturb pill — light mass, dissolves early
    if (dndRef.current) {
      const dndY = ph.dnd.value;
      const dndOp = clamp(1 - liftProgress * 2.8, 0, 1);
      dndRef.current.style.transform = `translate3d(0, ${dndY.toFixed(2)}px, 0)`;
      dndRef.current.style.opacity = dndOp.toFixed(3);
    }

    // 9. Home Indicator pill — lightest, fastest, stretches horizontally when pulled
    if (pillWrapRef.current) {
      const py = ph.pill.value;
      const pOp = clamp(1 - liftProgress * 2.5, 0, 1);
      pillWrapRef.current.style.transform = `translate3d(0, ${py.toFixed(2)}px, 0)`;
      pillWrapRef.current.style.opacity = pOp.toFixed(3);
    }
    if (pillBarRef.current) {
      const sx = ph.pillScaleX.value;
      pillBarRef.current.style.transform = `scale3d(${sx.toFixed(4)}, 1, 1)`;
    }
    if (hintRef.current) {
      const hOp = clamp(1 - liftProgress * 4.5, 0, 1);
      hintRef.current.style.opacity = hOp.toFixed(3);
    }
  }, []);

  // Main physics loop — runs ONLY when springs are active or user is dragging
  const startLoop = useCallback(() => {
    const ph = physicsRef.current;
    if (ph.rafId !== null) return;
    ph.lastFrame = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - ph.lastFrame) / 1000, 0.032);
      ph.lastFrame = now;

      // Update coupled targets from sheet position during drag/spring
      const vh = window.innerHeight || 800;
      if (ph.isUnlocking) {
        ph.sheet.target = -vh * 1.12;
        ph.clock.target = -110;
        ph.date.target = -95;
        ph.notif.target = -140;
        ph.dnd.target = -120;
        ph.pill.target = -60;
        ph.pillScaleX.target = 1.16;
        ph.status.target = -28;
        ph.shackle.target = 1;
      } else if (!ph.isDragging) {
        ph.sheet.target = 0;
        ph.clock.target = 0;
        ph.date.target = 0;
        ph.notif.target = 0;
        ph.dnd.target = 0;
        ph.pill.target = 0;
        ph.pillScaleX.target = 1;
        ph.status.target = 0;
        ph.shackle.target = 0;
      }

      // Step every independent spring
      ph.sheet.step(dt);
      ph.clock.step(dt);
      ph.date.step(dt);
      ph.notif.step(dt);
      ph.dnd.step(dt);
      ph.pill.step(dt);
      ph.pillScaleX.step(dt);
      ph.status.step(dt);
      ph.shackle.step(dt);

      applyTransforms();

      // Finish unlock as soon as curtain has fully cleared viewport
      if (ph.isUnlocking && !ph.unlockedDone && ph.sheet.value <= -vh * 1.01) {
        ph.unlockedDone = true;
        onProgressRef.current?.(1);
        onUnlockRef.current?.();
        ph.rafId = null;
        setMounted(false);
        return;
      }

      const allSettled =
        !ph.isDragging &&
        !ph.isUnlocking &&
        ph.sheet.isSettled() &&
        ph.clock.isSettled() &&
        ph.date.isSettled() &&
        ph.notif.isSettled() &&
        ph.dnd.isSettled() &&
        ph.pill.isSettled() &&
        ph.pillScaleX.isSettled(0.002, 0.02) &&
        ph.status.isSettled() &&
        ph.shackle.isSettled(0.005, 0.02);

      if (allSettled) {
        ph.rafId = null;
        return;
      }

      ph.rafId = requestAnimationFrame(tick);
    };

    ph.rafId = requestAnimationFrame(tick);
  }, [applyTransforms]);

  // Launch spring-driven unlock with weighted, silky Apple-like deceleration
  const triggerUnlock = useCallback(
    (launchVelocityY = -680) => {
      const ph = physicsRef.current;
      if (ph.isUnlocking || ph.unlockedDone) return;

      ph.isUnlocking = true;
      ph.isDragging = false;
      rootRef.current?.removeAttribute("data-cursor-dragging");
      setSparklesPaused(true);
      triggerHaptic(10);
      playUnlockSound();

      // Weighted, silky iOS glide (~0.7s) — never snaps abruptly off-screen
      const clampedVy = clamp(launchVelocityY, -1100, -520);
      ph.sheet.stiffness = 78;
      ph.sheet.damping = 21;
      ph.sheet.mass = 1.2;
      ph.sheet.velocity = clampedVy;

      // Proportional momentum into each independent element for visible layered depth
      const elemImpulse = clamp(clampedVy * 0.16, -210, -110);
      ph.clock.velocity = Math.min(ph.clock.velocity, elemImpulse * 0.78);
      ph.date.velocity = Math.min(ph.date.velocity, elemImpulse * 0.92);
      ph.notif.velocity = Math.min(ph.notif.velocity, elemImpulse * 1.3);
      ph.dnd.velocity = Math.min(ph.dnd.velocity, elemImpulse * 1.15);
      ph.pill.velocity = Math.min(ph.pill.velocity, elemImpulse * 1.05);
      ph.shackle.velocity = 4.5;

      startLoop();
    },
    [startLoop]
  );

  // Keyboard support (Space / Enter / ArrowUp)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (physicsRef.current.isUnlocking || physicsRef.current.unlockedDone) return;
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "Enter") {
        e.preventDefault();
        triggerUnlock(-680);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerUnlock]);

  // Trackpad / mouse wheel unlock support
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const ph = physicsRef.current;
      if (ph.isUnlocking || ph.unlockedDone || ph.isDragging) return;
      e.preventDefault();

      // Treat either scrolling down (deltaY > 0, natural page scroll) or swiping up as intent to unlock
      const mag = Math.abs(e.deltaY);
      if (mag < 2) return;

      ph.wheelAccum += mag;
      const vh = window.innerHeight || 800;
      const previewLift = -Math.min(ph.wheelAccum * 0.55, vh * 0.28);

      ph.sheet.stiffness = 320;
      ph.sheet.damping = 30;
      ph.sheet.target = previewLift;
      ph.clock.target = previewLift * 0.14;
      ph.date.target = previewLift * 0.12;
      ph.notif.target = previewLift * 0.22;
      ph.dnd.target = previewLift * 0.18;
      ph.pill.target = previewLift * 0.1;
      ph.pillScaleX.target = 1 + clamp(-previewLift / 220, 0, 0.14);
      startLoop();

      if (ph.wheelAccum >= 110) {
        ph.wheelAccum = 0;
        triggerUnlock(-700);
        return;
      }

      if (ph.wheelResetTimer) clearTimeout(ph.wheelResetTimer);
      ph.wheelResetTimer = setTimeout(() => {
        ph.wheelAccum = 0;
        if (!ph.isUnlocking && !ph.isDragging) {
          ph.sheet.stiffness = 260;
          ph.sheet.damping = 26;
          startLoop();
        }
      }, 180);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (physicsRef.current.wheelResetTimer) {
        clearTimeout(physicsRef.current.wheelResetTimer);
      }
    };
  }, [startLoop, triggerUnlock]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (physicsRef.current.rafId !== null) {
        cancelAnimationFrame(physicsRef.current.rafId);
      }
    };
  }, []);

  // ─── Direct Manipulation Pointer Handlers ─────────────────────────────────
  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const ph = physicsRef.current;
    if (ph.isUnlocking || ph.unlockedDone) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    ph.isDragging = true;
    ph.pointerId = e.pointerId;
    ph.startY = e.clientY;
    ph.lastY = e.clientY;
    ph.lastTime = performance.now();
    ph.velocityY = 0;
    ph.thresholdHapticFired = false;

    // Tight responsive tracking stiffness while finger/mouse is held down
    ph.sheet.stiffness = 880;
    ph.sheet.damping = 56;
    rootRef.current?.setAttribute("data-cursor-dragging", "true");

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    startLoop();
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const ph = physicsRef.current;
    if (!ph.isDragging || ph.isUnlocking || e.pointerId !== ph.pointerId) return;

    const now = performance.now();
    const dt = Math.max((now - ph.lastTime) / 1000, 0.001);
    const instantVy = (e.clientY - ph.lastY) / dt;
    // Exponentially smoothed velocity (feels natural, filters jitter)
    ph.velocityY = ph.velocityY * 0.55 + instantVy * 0.45;
    ph.lastY = e.clientY;
    ph.lastTime = now;

    const vh = window.innerHeight || 800;
    const rawDy = e.clientY - ph.startY;
    const dy = rawDy > 0 ? rubberBand(rawDy, vh * 0.28) : rawDy;

    ph.sheet.target = dy;

    // Subtle spring-coupled parallax offsets per element during drag
    const lift = Math.min(0, dy);
    const pull = Math.max(0, dy);
    ph.clock.target = lift * 0.12 + pull * 0.08;
    ph.date.target = lift * 0.09 + pull * 0.06;
    ph.notif.target = lift * 0.18 + pull * 0.12;
    ph.dnd.target = lift * 0.15 + pull * 0.1;
    ph.pill.target = lift * 0.06 + pull * 0.05;
    ph.pillScaleX.target = 1 + clamp(Math.abs(dy) / 360, 0, 0.16);
    ph.status.target = lift * 0.04;

    // Pop the padlock shackle open once past unlock threshold
    const pastThreshold = -dy >= vh * 0.2;
    ph.shackle.target = pastThreshold ? 1 : 0;
    if (pastThreshold && !ph.thresholdHapticFired) {
      triggerHaptic(6);
      ph.thresholdHapticFired = true;
    } else if (!pastThreshold) {
      ph.thresholdHapticFired = false;
    }

    startLoop();
  }

  function onPointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    const ph = physicsRef.current;
    if (!ph.isDragging || e.pointerId !== ph.pointerId) return;

    ph.isDragging = false;
    rootRef.current?.removeAttribute("data-cursor-dragging");
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const vh = window.innerHeight || 800;
    const movedY = e.clientY - ph.startY;
    const flickedUp = ph.velocityY < -520 && movedY < -24;
    const draggedPastThreshold = -movedY >= vh * 0.2;

    if (flickedUp || draggedPastThreshold) {
      triggerUnlock(clamp(ph.velocityY * 0.65, -1050, -560));
      return;
    }

    // Spring back smoothly with real momentum!
    ph.sheet.stiffness = 190;
    ph.sheet.damping = 22;
    ph.sheet.velocity = clamp(ph.velocityY * 0.4, -750, 750);
    ph.shackle.target = 0;
    startLoop();
  }

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      data-cursor="grab"
      className="fixed inset-0 z-[9999] overflow-hidden select-none"
      style={{ touchAction: "none" }}
      aria-label="Lock screen — swipe up or press space to unlock"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      {/* ── Rising iOS Frosted Glass Curtain (GPU transform + opacity ONLY) ── */}
      <div
        ref={sheetRef}
        className="absolute inset-0 overflow-hidden will-change-transform"
        style={{
          transform: "translate3d(0, 0, 0)",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55)",
        }}
      >
        {/* Static pre-blurred wallpaper — rasterized ONCE on GPU, never re-blurred! */}
        <div
          ref={bgRef}
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: "url(/wallpaper.jpg)",
            filter: "blur(16px) saturate(1.15) brightness(0.84)",
            transform: "translate3d(0, 0, 0) scale(1.08)",
          }}
        />

        {/* Subtle depth vignette + warm glass atmosphere (no heavy filter blur) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 75% at 50% 45%, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.42) 100%)",
          }}
        />

        {/* Lightweight Canvas Sparkles (pauses automatically on unlock) */}
        <SparkleOverlay paused={sparklesPaused} />

        {/* ── Lock Screen UI Layout ── */}
        <div className="relative z-10 flex flex-col items-center h-full w-full px-6 mx-auto" style={{ maxWidth: "48rem" }}>
          {/* Status Bar */}
          <div ref={statusRef} className="shrink-0 w-full pt-3.5 pb-0 will-change-transform">
            <div className="flex justify-between items-center">
              <span className="text-white/90 text-sm font-semibold tracking-wide drop-shadow-sm">
                {statusTime}
              </span>
              <div className="flex items-center gap-2.5">
                <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                  <rect x="0" y="7" width="3" height="5" rx="0.6" fill="white" opacity="0.35" />
                  <rect x="5" y="4" width="3" height="8" rx="0.6" fill="white" opacity="0.55" />
                  <rect x="10" y="1.5" width="3" height="10.5" rx="0.6" fill="white" opacity="0.8" />
                  <rect x="15" y="0" width="3" height="12" rx="0.6" fill="white" />
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                  <path
                    d="M8 11.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM5.2 8.2a4 4 0 0 1 5.6 0M2.8 5.3a7.5 7.5 0 0 1 10.4 0"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <div className="flex items-center gap-1" aria-label={`Battery ${batteryLevel}%${charging ? ", charging" : ""}`}>
                  {charging && (
                    <svg width="10" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#34c759" />
                    </svg>
                  )}
                  <div className="relative w-[26px] h-[13px] border border-white/70 rounded-[3.5px] flex items-center px-[2px]">
                    <div
                      className="h-[9px] rounded-[1.5px]"
                      style={{
                        width: `${batteryLevel}%`,
                        backgroundColor: batteryLevel > 20 ? "#34c759" : "#ff3b30",
                      }}
                    />
                  </div>
                  <div className="w-[2.5px] h-[5px] bg-white/70 rounded-r-full" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Hero Lock Icon, Date & Clock ── */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 -mt-8">
            {/* Apple-style Padlock with spring-animated shackle */}
            <div ref={lockWrapRef} className="mb-3 will-change-transform">
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none" aria-hidden="true" className="overflow-visible">
                <path
                  ref={lockShackleRef}
                  d="M5.5 10V7a4.5 4.5 0 0 1 9 0v3"
                  stroke="rgba(255,255,255,0.88)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ transformOrigin: "14.5px 10px" }}
                />
                <rect x="3" y="10" width="14" height="11" rx="3" fill="rgba(255,255,255,0.88)" />
              </svg>
            </div>

            {/* Date above Clock (classic iOS Lock Screen hierarchy) */}
            <div
              ref={dateRef}
              className="text-lg sm:text-xl text-white/85 font-medium tracking-wide will-change-transform mb-1"
              style={{ textShadow: "0 1px 16px rgba(0,0,0,0.28)" }}
            >
              {date}
            </div>

            {/* Clock */}
            <div ref={clockRef} className="relative text-center will-change-transform">
              <div
                className="text-[18vw] sm:text-[12vw] md:text-[7.5rem] lg:text-[8.5rem] font-[300] leading-none tracking-[-0.02em] text-white/95"
                style={{
                  textShadow: "0 4px 32px rgba(0,0,0,0.28), 0 1px 6px rgba(0,0,0,0.18)",
                }}
              >
                {time}
              </div>
            </div>
          </div>

          {/* ── Bottom Section: Notification, DND, Home Indicator ── */}
          <div className="shrink-0 flex flex-col items-center pb-7 w-full relative">
            {/* Liquid Glass Notification Card */}
            <div ref={notifRef} className="w-full max-w-sm mb-3.5 relative will-change-transform">
              <div
                className="relative overflow-hidden rounded-2xl p-4 border border-white/20"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.07) 55%, rgba(255,255,255,0.13) 100%)",
                  backdropFilter: "blur(20px) saturate(1.4)",
                  WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)" }}
                />
                <div className="flex items-start gap-3 relative z-10">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #007aff, #5856d6)",
                      boxShadow: "0 2px 8px rgba(0,122,255,0.3)",
                    }}
                    aria-hidden="true"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-white/95 font-semibold text-sm">Portfolio</span>
                      <span className="text-white/55 text-[11px] font-medium">now</span>
                    </div>
                    <p className="text-white/80 text-sm mt-0.5 leading-snug">
                      Welcome to the portfolio — swipe up to explore
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Do Not Disturb Pill */}
            <div ref={dndRef} className="mb-4 relative will-change-transform" aria-label="Do Not Disturb is on">
              <div
                className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white/85 text-sm font-medium"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 100%)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                <span>Do Not Disturb</span>
              </div>
            </div>

            {/* Home Indicator & Swipe Hint (also clickable to launch unlock) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerUnlock(-680);
              }}
              className="flex flex-col items-center gap-2.5 relative bg-transparent border-0 p-2 -m-2 focus:outline-none"
            >
              <div ref={pillWrapRef} className="flex flex-col items-center gap-2.5 will-change-transform">
                <div
                  ref={hintRef}
                  className="flex items-center gap-1.5 text-[11px] text-white/50 font-medium tracking-[0.14em] uppercase"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                  <span>Swipe up to unlock</span>
                </div>
                <div
                  ref={pillBarRef}
                  className="w-[138px] h-[5px] rounded-full will-change-transform"
                  style={{
                    background: "rgba(255,255,255,0.72)",
                    boxShadow: "0 1px 10px rgba(0,0,0,0.28)",
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
