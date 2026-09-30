import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

import "./TechText.css";

const LABEL_FONT = "10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
const FALLOFF_STEPS = 8;
const SPRING = 320;
const DAMPING = 22;

type Reveal = "area" | "letter" | "off";
type LineStyle = "dashed" | "solid";

const approach = (current: number, target: number, dt: number, seconds: number) =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));

const hexToRgb = (hex: string): [number, number, number] => {
  let h = String(hex || "").replace("#", "");
  if (h.length === 3) h = h.replace(/./g, (c) => c + c);
  const n = parseInt(h.slice(0, 6), 16);
  return Number.isNaN(n) ? [255, 255, 255] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const rgba = (hex: string, alpha: number) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const noise = (...values: number[]) => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};

const signed = (value: number) => (value > 0 ? `+${value}` : value < 0 ? `\u2212${-value}` : "0");

export interface TechTextProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: number;
  fontSize?: number;
  letterSpacing?: number;
  color?: string;
  accentColor?: string;
  reveal?: Reveal;
  reach?: number;
  softness?: number;
  dashLength?: number;
  dashGap?: number;
  lineStyle?: LineStyle;
  strokeWidth?: number;
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  sweep?: boolean;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

interface Sprite {
  image: HTMLCanvasElement;
  left: number;
  top: number;
}

interface Glyph {
  char: string;
  x: number;
  index: number;
  box: { x1: number; y1: number; x2: number; y2: number };
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  fill: Sprite;
  dashes: Sprite;
}

interface View {
  size: number;
  baseline: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

const TechText = ({
  text = "React Bits",
  fontFamily = "",
  fontWeight = 600,
  fontSize = 150,
  letterSpacing = -0.05,
  color = "#ffffff",
  accentColor = "#ffffff",
  reveal = "letter",
  reach = 200,
  softness = 0.7,
  dashLength = 4,
  dashGap = 2,
  lineStyle = "dashed",
  strokeWidth = 1.5,
  specks = 15,
  selection = true,
  labels = true,
  draggable = true,
  sweep = true,
  speed = 1,
  className = "",
  style,
}: TechTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef<TechTextProps | null>(null);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    settingsRef.current = {
      text,
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
      color,
      accentColor,
      reach,
      softness,
      dashLength,
      dashGap,
      strokeWidth,
      lineStyle,
      reveal,
      specks,
      selection,
      labels,
      draggable,
      sweep,
      speed,
    };
    wakeRef.current();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const scratch = document.createElement("canvas");
    const scratchCtx = scratch.getContext("2d");
    if (!container || !canvas || !ctx || !scratchCtx) return undefined;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let layoutKey = "";
    let requestedFont = "";
    let word: View | null = null;
    let glyphs: Glyph[] = [];
    let presence = 0;
    let clock = 0;
    let pulse = 0;
    let dragging = -1;
    const pointer = { x: 0, y: 0, inside: false };
    const grab = { x: 0, y: 0 };
    const lens = { x: 0, y: 0 };
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    // Everything is drawn in device pixels; this converts CSS px to that space.
    const P = (v: number) => v * dpr;

    const refreshFonts = () => {
      layoutKey = "";
      wakeRef.current();
    };

    const family = (s: TechTextProps) =>
      s.fontFamily || getComputedStyle(container).fontFamily || "sans-serif";
    const fontFor = (s: TechTextProps, size: number) => `${s.fontWeight} ${size}px ${family(s)}`;

    const setFont = (target: CanvasRenderingContext2D, s: TechTextProps, size: number) => {
      target.font = fontFor(s, size);
      if ("letterSpacing" in target) target.letterSpacing = `${(s.letterSpacing as number) * size}px`;
      target.textAlign = "left";
      target.textBaseline = "alphabetic";
    };

    const sprite = (s: TechTextProps, view: View, glyph: Glyph, stroke: boolean): Sprite => {
      const pad = Math.ceil((s.strokeWidth as number) * 2 + 4);
      const left = glyph.box.x1 - pad;
      const top = glyph.box.y1 - pad;
      const w = glyph.box.x2 - glyph.box.x1 + pad * 2;
      const h = glyph.box.y2 - glyph.box.y1 + pad * 2;
      const image = document.createElement("canvas");
      image.width = Math.max(1, Math.ceil(w * dpr));
      image.height = Math.max(1, Math.ceil(h * dpr));
      const c = image.getContext("2d");
      if (!c) return { image, left, top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      setFont(c, s, view.size);
      if (stroke) {
        c.lineJoin = "round";
        c.lineWidth = (s.strokeWidth as number) * 2;
        c.lineCap = "butt";
        c.strokeStyle = s.color as string;
        if (s.lineStyle !== "solid") {
          c.setLineDash([
            Math.max(1, s.dashLength as number),
            Math.max(1, s.dashGap as number),
          ]);
        }
        c.strokeText(glyph.char, glyph.x, view.baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = "destination-out";
        c.fillStyle = "#000000";
        c.fillText(glyph.char, glyph.x, view.baseline);
        c.globalCompositeOperation = "source-over";
      } else {
        c.fillStyle = s.color as string;
        c.fillText(glyph.char, glyph.x, view.baseline);
      }
      return { image, left, top };
    };

    const ensureLayout = (s: TechTextProps) => {
      const key = [
        s.text,
        family(s),
        s.fontWeight,
        s.fontSize,
        s.letterSpacing,
        s.color,
        s.dashLength,
        s.dashGap,
        s.strokeWidth,
        s.lineStyle,
        width,
        height,
        dpr,
      ].join("|");
      if (key === layoutKey && word) return word;
      layoutKey = key;

      const wanted = fontFor(s, 64);
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted;
        document.fonts.load(wanted, s.text as string).then(refreshFonts, refreshFonts);
      }

      const probe = scratchCtx;
      setFont(probe, s, s.fontSize as number);
      let m = probe.measureText(s.text as string);
      const fit = Math.min(
        1,
        (width * 0.9) / Math.max(m.actualBoundingBoxLeft + m.actualBoundingBoxRight, 1),
        (height * 0.66) / Math.max(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent, 1),
      );
      const size = (s.fontSize as number) * fit;
      setFont(probe, s, size);
      m = probe.measureText(s.text as string);
      const inkWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const x = (width - inkWidth) / 2 + m.actualBoundingBoxLeft;
      const baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent;
      const next: View = {
        size,
        baseline,
        left: x - m.actualBoundingBoxLeft,
        right: x + m.actualBoundingBoxRight,
        top: baseline - m.actualBoundingBoxAscent,
        bottom: baseline + m.actualBoundingBoxDescent,
      };
      word = next;

      const chars = Array.from(s.text as string);
      const previous = glyphs;
      glyphs = [];
      let prefix = "";
      chars.forEach((char, i) => {
        prefix += char;
        const own = probe.measureText(char);
        const gx = x + probe.measureText(prefix).width - own.width;
        if (!char.trim()) return;
        const base = {
          char,
          x: gx,
          box: {
            x1: gx - own.actualBoundingBoxLeft,
            y1: baseline - own.actualBoundingBoxAscent,
            x2: gx + own.actualBoundingBoxRight,
            y2: baseline + own.actualBoundingBoxDescent,
          },
        };
        const kept = previous[glyphs.length];
        const glyph: Glyph = {
          ...base,
          index: i,
          offset: kept?.char === char ? kept.offset : { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          fill: { image: document.createElement("canvas"), left: 0, top: 0 },
          dashes: { image: document.createElement("canvas"), left: 0, top: 0 },
        };
        glyph.fill = sprite(s, next, glyph, false);
        glyph.dashes = sprite(s, next, glyph, true);
        glyphs.push(glyph);
      });
      dragging = -1;
      frame.index = -1;
      return next;
    };

    const glyphAt = (x: number, y: number) => {
      if (!word || y < word.top - 24 || y > word.bottom + 24) return -1;
      let best = -1;
      let bestDistance = Infinity;
      glyphs.forEach((glyph, i) => {
        const x1 = glyph.box.x1 + glyph.offset.x;
        const x2 = glyph.box.x2 + glyph.offset.x;
        const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return bestDistance < 28 ? best : -1;
    };

    const falloff = (
      target: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      strength: number,
      soft: number,
    ) => {
      const inner = Math.min(1, Math.max(0, 1 - soft));
      const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
      if (inner > 0.995) {
        gradient.addColorStop(0.995, `rgba(0, 0, 0, ${strength})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        return gradient;
      }
      for (let i = 0; i <= FALLOFF_STEPS; i++) {
        const t = i / FALLOFF_STEPS;
        const eased = t * t * (3 - 2 * t);
        gradient.addColorStop(
          inner + (1 - inner) * t,
          `rgba(0, 0, 0, ${strength * (1 - eased)})`,
        );
      }
      return gradient;
    };

    const blit = (
      target: CanvasRenderingContext2D,
      art: Sprite,
      dx: number,
      dy: number,
      originX: number,
      originY: number,
    ) => {
      target.drawImage(
        art.image,
        Math.round((art.left + dx) * dpr - originX),
        Math.round((art.top + dy) * dpr - originY),
      );
    };

    // Paints dashed outlines inside the lens, knocking the solid fill out first.
    const drawReveal = (s: TechTextProps, only: number | null) => {
      if (presence < 0.01) return;
      const radius = (s.reach as number) * dpr;
      const cx = lens.x * dpr;
      const cy = lens.y * dpr;

      const x0 = Math.max(0, Math.floor(cx - radius));
      const y0 = Math.max(0, Math.floor(cy - radius));
      const x1 = Math.min(canvas.width, Math.ceil(cx + radius));
      const y1 = Math.min(canvas.height, Math.ceil(cy + radius));
      if (x1 <= x0 || y1 <= y0) return;
      const w = x1 - x0;
      const h = y1 - y0;

      if (scratch.width < w || scratch.height < h) {
        scratch.width = Math.max(scratch.width, w);
        scratch.height = Math.max(scratch.height, h);
      }
      scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
      scratchCtx.globalCompositeOperation = "source-over";
      scratchCtx.clearRect(0, 0, w, h);
      glyphs.forEach((glyph, i) => {
        if (only !== null && i !== only) return;
        blit(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0);
      });
      scratchCtx.globalCompositeOperation = "destination-in";
      scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness as number);
      scratchCtx.fillRect(0, 0, w, h);
      scratchCtx.globalCompositeOperation = "source-over";

      // Knock the solid fill out of the same region, then lay the outlines back in.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, s.softness as number);
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = presence;
      ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
      ctx.globalAlpha = 1;
    };

    const crisp = (value: number) => (Math.round(value * dpr) + 0.5) / dpr;

    const perimeterPoint = (
      distance: number,
      w: number,
      h: number,
    ): [number, number, number, number] => {
      let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    };

    const drawSpecks = (s: TechTextProps, a: number) => {
      const w = frame.x2 - frame.x1;
      const h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      const perimeter = 2 * (w + h);
      const seed = frame.index + 1;
      const grid = 3;

      for (let k = 0; k < (s.specks as number); k++) {
        const period = 0.5 + noise(seed, k, 11) * 1.2;
        const t = pulse / period + noise(seed, k, 17);
        const cycle = Math.floor(t);
        const life = t - cycle;
        if (life > 0.7) continue;
        const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        const pick = noise(seed, k, cycle, 2);
        const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
        const large = size >= 8;
        const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
        const x = (frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid) * dpr;
        const y = (frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid) * dpr;
        const tone = noise(seed, k, cycle, 3);
        const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        const alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
        const left = Math.round(x - (P(size) / 2));
        const top = Math.round(y - (P(size) / 2));
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeStyle = rgba(s.accentColor as string, alpha);
          ctx.strokeRect(left + 0.5, top + 0.5, P(size), P(size));
          if (large && tone > 0.5) {
            ctx.fillStyle = rgba(s.accentColor as string, alpha);
            ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
          }
        } else {
          ctx.fillStyle = rgba(s.accentColor as string, alpha);
          ctx.fillRect(left, top, P(size), P(size));
        }
      }

      for (let j = 0; j < 2; j++) {
        const head = (pulse * 0.42 * (s.speed as number) + j * 0.5) * perimeter;
        for (let i = 0; i < 4; i++) {
          const [x, y] = perimeterPoint(head - i * 6, w, h);
          const size = i === 0 ? 3 : 2;
          ctx.fillStyle = rgba(s.accentColor as string, a * [0.95, 0.55, 0.32, 0.16][i]);
          ctx.fillRect(
            Math.round(x * dpr - P(size) / 2),
            Math.round(y * dpr - P(size) / 2),
            P(size),
            P(size),
          );
        }
      }
    };

    const drawFrame = (s: TechTextProps) => {
      const glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      const a = frame.alpha;
      const x1 = crisp(frame.x1);
      const y1 = crisp(frame.y1);
      const x2 = crisp(frame.x2);
      const y2 = crisp(frame.y2);

      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        const hx = (glyph.box.x1 + glyph.box.x2) / 2;
        const hy = (glyph.box.y1 + glyph.box.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(P(hx), P(hy));
        ctx.lineTo(P(hx + glyph.offset.x), P(hy + glyph.offset.y));
        ctx.strokeStyle = rgba(s.accentColor as string, a * 0.5);
        ctx.lineWidth = P(1);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(P(hx + glyph.offset.x), P(hy + glyph.offset.y), P(2.5), 0, Math.PI * 2);
        ctx.fillStyle = rgba(s.accentColor as string, a);
        ctx.fill();
      }

      ctx.strokeStyle = rgba(s.accentColor as string, a * 0.85);
      ctx.lineWidth = P(1);
      const corner = P(6);
      const corners: [number, number, number, number][] = [
        [x1, y1, 1, 1],
        [x2, y1, -1, 1],
        [x1, y2, 1, -1],
        [x2, y2, -1, -1],
      ];
      corners.forEach(([cx, cy, sx, sy]) => {
        ctx.beginPath();
        ctx.moveTo(P(cx + corner * sx), P(cy));
        ctx.lineTo(P(cx), P(cy));
        ctx.lineTo(P(cx), P(cy + corner * sy));
        ctx.stroke();
      });

      drawSpecks(s, a);

      if (s.labels) {
        ctx.font = LABEL_FONT.replace("10px", `${10 * dpr}px`);
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = rgba(s.accentColor as string, a * 0.9);
        const label = moved > 1 ? signed(Math.round(glyph.offset.y)) : glyph.char;
        const size = moved > 1 ? label : `${label} ${Math.round((word?.size ?? 0) * 10) / 10}`;
        const tx = P(Math.max(x1, Math.min(x2 - 44, x1)));
        const ty = P(y1) - P(8);
        ctx.fillText(size, tx, ty);
        ctx.fillRect(tx, P(y1) - P(5), P(1), P(5));
      }
    };

    const step = (now: number) => {
      raf = 0;
      const s = settingsRef.current;
      if (!s) return;
      const view = ensureLayout(s);
      if (!view) return;

      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
      last = now;
      clock += dt;
      pulse += dt * (s.speed as number);

      const W = canvas.width;
      const H = canvas.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const sweeping = (s.sweep as boolean) && !pointer.inside && !reducedMotion;
      const targetPresence = pointer.inside || sweeping ? 1 : 0;
      presence = approach(presence, targetPresence, dt, 0.18);

      if (sweeping) {
        lens.x = approach(
          lens.x,
          width * 0.5 + Math.sin(clock * 0.5) * width * 0.28,
          dt,
          0.3,
        );
        lens.y = approach(lens.y, view.baseline - view.size * 0.32, dt, 0.3);
      } else {
        lens.x = approach(lens.x, pointer.x, dt, 0.05);
        lens.y = approach(lens.y, pointer.y, dt, 0.05);
      }

      glyphs.forEach((glyph, i) => {
        if (i === dragging) {
          const tx = pointer.x - grab.x - glyph.box.x1;
          const ty = pointer.y - grab.y - glyph.box.y1;
          const k = SPRING;
          glyph.velocity.x += (-k * (tx - glyph.offset.x) - DAMPING * glyph.velocity.x) * dt;
          glyph.velocity.y += (-k * (ty - glyph.offset.y) - DAMPING * glyph.velocity.y) * dt;
        } else {
          glyph.velocity.x += (-SPRING * glyph.offset.x - DAMPING * glyph.velocity.x) * dt;
          glyph.velocity.y += (-SPRING * glyph.offset.y - DAMPING * glyph.velocity.y) * dt;
        }
        glyph.offset.x += glyph.velocity.x * dt;
        glyph.offset.y += glyph.velocity.y * dt;
      });

      const active = glyphAt(lens.x, lens.y);

      glyphs.forEach((glyph) => {
        blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
      });

      if (s.reveal !== "off" && active >= 0) {
        drawReveal(s, s.reveal === "letter" ? active : null);
      }

      if (s.selection && active >= 0 && presence > 0.01) {
        const glyph = glyphs[active];
        const pad = 8;
        const tx1 = glyph.box.x1 + glyph.offset.x - pad;
        const ty1 = glyph.box.y1 + glyph.offset.y - pad;
        const tx2 = glyph.box.x2 + glyph.offset.x + pad;
        const ty2 = glyph.box.y2 + glyph.offset.y + pad;
        const k = 1 - Math.exp(-dt / 0.09);
        if (frame.index === active) {
          frame.x1 += (tx1 - frame.x1) * k;
          frame.y1 += (ty1 - frame.y1) * k;
          frame.x2 += (tx2 - frame.x2) * k;
          frame.y2 += (ty2 - frame.y2) * k;
        } else {
          frame.x1 = tx1;
          frame.y1 = ty1;
          frame.x2 = tx2;
          frame.y2 = ty2;
          frame.index = active;
        }
        frame.alpha = approach(frame.alpha, presence, dt, 0.1);
        drawFrame(s);
      } else {
        frame.alpha = approach(frame.alpha, 0, dt, 0.1);
        if (frame.alpha < 0.01) frame.index = -1;
      }

      const busy = pointer.inside || sweeping || presence > 0.01 || frame.alpha > 0.01;
      if (busy && visible) raf = requestAnimationFrame(step);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    wakeRef.current = wake;

    const locate = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      if (dragging >= 0) e.preventDefault();
      wake();
    };
    const onLeave = () => {
      pointer.inside = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      if (!settingsRef.current?.draggable) return;
      locate(e);
      pointer.inside = true;
      const i = glyphAt(pointer.x, pointer.y);
      if (i < 0) return;
      dragging = i;
      const g = glyphs[i];
      grab.x = pointer.x - (g.box.x1 + g.offset.x);
      grab.y = pointer.y - (g.box.y1 + g.offset.y);
      container.setPointerCapture?.(e.pointerId);
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (dragging >= 0) {
        dragging = -1;
        container.releasePointerCapture?.(e.pointerId);
      }
      wake();
    };

    container.addEventListener("pointermove", onMove, { passive: false });
    container.addEventListener("pointerenter", onMove, { passive: true });
    container.addEventListener("pointerdown", onDown, { passive: true });
    container.addEventListener("pointerleave", onLeave, { passive: true });
    container.addEventListener("pointercancel", onUp, { passive: true });
    container.addEventListener("pointerup", onUp, { passive: true });

    const layout = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      layoutKey = "";
      wake();
    };

    const resizeObserver = new ResizeObserver(layout);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersectionObserver.observe(container);

    layout();

    return () => {
      cancelAnimationFrame(raf);
      wakeRef.current = () => {};
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener("pointermove", onMove);
      container.removeEventListener("pointerenter", onMove);
      container.removeEventListener("pointerdown", onDown);
      container.removeEventListener("pointerleave", onLeave);
      container.removeEventListener("pointercancel", onUp);
      container.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`tech-text ${className}`.trim()}
      style={style}
      role="img"
      aria-label={text}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default TechText;
export { TechText };
