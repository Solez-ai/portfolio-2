import React, { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion/engine';

interface WitnessPeekIntroProps {
  onComplete: () => void;
}

export const WitnessPeekIntro: React.FC<WitnessPeekIntroProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<'idle' | 'intro' | 'zoom' | 'finished'>('intro');

  useEffect(() => {
    // If reduced motion is requested, immediately complete
    if (prefersReducedMotion()) {
      onComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
    if (!gl) {
      // Fallback timer if WebGL fails
      const timer = setTimeout(() => {
        setPhase('finished');
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }

    const vertexShaderSrc = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSrc = `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform float uIntensity;

      // Simplex-esque procedural chromatic dispersion
      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.1, 0.4);
        vec3 b = vec3(0.6, 0.3, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.1, 0.33, 0.67);
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / min(uResolution.x, uResolution.y);
        float d = length(uv);
        
        // Dynamic fractal warped rings
        vec3 col = vec3(0.0);
        for (float i = 0.0; i < 3.0; i++) {
          uv = fract(uv * 1.6) - 0.5;
          float ring = length(uv) * exp(-d);
          vec3 pCol = palette(d + i * 0.4 + uTime * 0.5);
          ring = sin(ring * 9.0 + uTime * 2.0) / 9.0;
          ring = abs(ring);
          ring = pow(0.012 / max(ring, 0.001), 1.25);
          col += pCol * ring;
        }

        // Tint towards fiery red, vibrant purple, and rich orange
        vec3 fiery = vec3(col.r * 1.5, col.g * 0.35 + col.r * 0.4, col.b * 1.4);
        gl_FragColor = vec4(fiery * uIntensity, clamp(length(col) * uIntensity, 0.0, 0.95));
      }
    `;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const timeUni = gl.getUniformLocation(program, 'uTime');
    const resUni = gl.getUniformLocation(program, 'uResolution');
    const intensityUni = gl.getUniformLocation(program, 'uIntensity');

    let animId: number;
    const startTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let currentIntensity = 0.0;

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      
      // Animate intensity up and down
      if (elapsed < 1.4) {
        currentIntensity = Math.min(1.0, elapsed * 1.5);
      } else if (elapsed > 2.2) {
        currentIntensity = Math.max(0.0, currentIntensity - 0.04);
      }

      gl.uniform1f(timeUni, elapsed);
      gl.uniform2f(resUni, canvas.width, canvas.height);
      gl.uniform1f(intensityUni, currentIntensity);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    // Timeline phases:
    // 0.0s - 1.8s: Intro text & WebGL chromatic shader
    // 1.8s: Zoom camera plunge toward Earth
    // 2.7s: Reveal main page
    const zoomTimer = setTimeout(() => {
      setPhase('zoom');
    }, 1900);

    const finishTimer = setTimeout(() => {
      setPhase('finished');
      onComplete();
    }, 2800);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(zoomTimer);
      clearTimeout(finishTimer);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(vbo);
    };
  }, [onComplete]);

  if (phase === 'finished') return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-[#050506] transition-all duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] ${
        phase === 'zoom'
          ? 'scale-[3.2] opacity-0 blur-md pointer-events-none'
          : 'scale-100 opacity-100'
      }`}
    >
      {/* Background WebGL Shader Canvas for the chromatic energy field */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85 mix-blend-screen"
      />

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#050506]/50 to-[#050506] pointer-events-none" />

      {/* Dramatic Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center select-none px-6">
        <div className="overflow-hidden">
          <p
            style={{ fontFamily: 'var(--f-mono)' }}
            className="text-xs md:text-sm tracking-[0.45em] uppercase text-[#8E8B84] mb-3 animate-pulse"
          >
            System Initialization
          </p>
        </div>

        <h1
          style={{ fontFamily: 'var(--f-display)' }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-[-0.04em] text-[#F3F1EC] leading-none uppercase"
        >
          <span>Witness</span>{' '}
          <span className="relative inline-block ml-1">
            {/* Multi-layered fiery WebGPU/WebGL Shader text styling */}
            <span
              className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#FF3B1D] via-[#FF007A] to-[#8A2BE2] animate-text"
              style={{
                textShadow: '0 0 50px rgba(255, 59, 29, 0.8), 0 0 90px rgba(138, 43, 226, 0.6)',
              }}
            >
              Peek
            </span>
            {/* Glowing neon aura behind */}
            <span
              aria-hidden="true"
              className="absolute inset-0 blur-2xl opacity-75 bg-gradient-to-r from-[#FF3B1D] via-[#FF0055] to-[#7B2CBF] -z-10"
            />
          </span>
        </h1>

        <div className="mt-6 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1D] animate-ping" />
          <span
            style={{ fontFamily: 'var(--f-mono)' }}
            className="text-[11px] md:text-xs tracking-widest text-[#F3F1EC]/60 uppercase"
          >
            Orchestrating Orbital Mesh &amp; Telemetry
          </span>
        </div>
      </div>
    </div>
  );
};
