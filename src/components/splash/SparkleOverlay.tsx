import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxAlpha: number;
  phase: number;
  speed: number;
  depth: number;
  tint: string;
}

interface SparkleOverlayProps {
  paused?: boolean;
}

const PARTICLE_COUNT = 28;

export function SparkleOverlay({ paused = false }: SparkleOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const isDeep = i < 10;
      const warm = Math.random() < 0.28;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isDeep ? 4 : 8),
        vy: -(isDeep ? 2 + Math.random() * 4 : 4 + Math.random() * 7),
        radius: isDeep ? 3.5 + Math.random() * 4.5 : 1.0 + Math.random() * 1.8,
        maxAlpha: isDeep ? 0.08 + Math.random() * 0.08 : 0.16 + Math.random() * 0.24,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.45,
        depth: isDeep ? 1.4 + Math.random() * 0.6 : 0.5 + Math.random() * 0.6,
        tint: warm ? "255, 232, 198" : "255, 255, 255",
      };
    });

    // Smooth pointer parallax in canvas space — zero DOM/CSS var writes
    let targetPx = 0;
    let targetPy = 0;
    let px = 0;
    let py = 0;

    const onPointerMove = (e: PointerEvent) => {
      targetPx = (e.clientX / width - 0.5) * 28;
      targetPy = (e.clientY / height - 0.5) * 20;
    };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();

    const draw = (now: number) => {
      rafId = requestAnimationFrame(draw);
      if (pausedRef.current) {
        lastTime = now;
        return;
      }

      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Smooth exponential approach for pointer parallax
      const lerp = 1 - Math.exp(-5 * dt);
      px += (targetPx - px) * lerp;
      py += (targetPy - py) * lerp;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.phase += p.speed * dt;

        // Wrap softly around viewport
        if (p.y < -20) p.y = height + 20;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        const alpha = p.maxAlpha * (0.45 + 0.55 * Math.sin(p.phase));
        if (alpha <= 0.005) continue;

        const drawX = p.x + px * p.depth;
        const drawY = p.y + py * p.depth;

        const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, p.radius * 2.4);
        grad.addColorStop(0, `rgba(${p.tint}, ${alpha})`);
        grad.addColorStop(0.45, `rgba(${p.tint}, ${alpha * 0.45})`);
        grad.addColorStop(1, `rgba(${p.tint}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.radius * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
