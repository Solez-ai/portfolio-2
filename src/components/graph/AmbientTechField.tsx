import React from 'react';
import {
  SiCplusplus,
  SiDocker,
  SiGit,
  SiGraphql,
  SiLinux,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiRust,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiWebassembly,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

export interface AmbientTechItem {
  id: string;
  name: string;
  skillMatch?: string;
  Icon: IconType;
  /** Viewport percentage coordinates (left %, top %) carefully placed around the orbital node graph */
  xPct: number;
  yPct: number;
  size: number;
  rotation: number;
  opacity: number;
  hideOnMobile?: boolean;
}

export const AMBIENT_TECH_ITEMS: AmbientTechItem[] = [
  // Inner-mid ring around the nodes (core stack that also matches hoveredSkill!)
  {
    id: 'amb-rust',
    name: 'Rust',
    skillMatch: 'Rust',
    Icon: SiRust,
    xPct: 26,
    yPct: 24,
    size: 46,
    rotation: -8,
    opacity: 0.14,
  },
  {
    id: 'amb-typescript',
    name: 'TypeScript',
    skillMatch: 'TypeScript',
    Icon: SiTypescript,
    xPct: 73,
    yPct: 22,
    size: 42,
    rotation: 6,
    opacity: 0.14,
  },
  {
    id: 'amb-react',
    name: 'React',
    skillMatch: 'React',
    Icon: SiReact,
    xPct: 81,
    yPct: 48,
    size: 50,
    rotation: 12,
    opacity: 0.14,
  },
  {
    id: 'amb-nextjs',
    name: 'Next.js',
    skillMatch: 'Next.js',
    Icon: SiNextdotjs,
    xPct: 68,
    yPct: 81,
    size: 44,
    rotation: -6,
    opacity: 0.14,
  },
  {
    id: 'amb-python',
    name: 'Python',
    skillMatch: 'Python',
    Icon: SiPython,
    xPct: 30,
    yPct: 81,
    size: 44,
    rotation: -10,
    opacity: 0.14,
  },
  {
    id: 'amb-nodejs',
    name: 'Node.js',
    skillMatch: 'Node.js',
    Icon: SiNodedotjs,
    xPct: 18,
    yPct: 50,
    size: 46,
    rotation: 7,
    opacity: 0.14,
  },
  {
    id: 'amb-supabase',
    name: 'Supabase',
    skillMatch: 'Supabase',
    Icon: SiSupabase,
    xPct: 61,
    yPct: 16,
    size: 38,
    rotation: -5,
    opacity: 0.13,
  },

  // Outer atmospheric field (broader engineering ecosystem around the canvas perimeter)
  {
    id: 'amb-wasm',
    name: 'WebAssembly',
    skillMatch: 'Rust',
    Icon: SiWebassembly,
    xPct: 38,
    yPct: 15,
    size: 36,
    rotation: 5,
    opacity: 0.11,
  },
  {
    id: 'amb-cpp',
    name: 'C++',
    skillMatch: 'Rust',
    Icon: SiCplusplus,
    xPct: 13,
    yPct: 33,
    size: 38,
    rotation: -12,
    opacity: 0.1,
    hideOnMobile: true,
  },
  {
    id: 'amb-postgres',
    name: 'PostgreSQL',
    skillMatch: 'Supabase',
    Icon: SiPostgresql,
    xPct: 87,
    yPct: 31,
    size: 40,
    rotation: 9,
    opacity: 0.11,
    hideOnMobile: true,
  },
  {
    id: 'amb-tailwind',
    name: 'Tailwind CSS',
    skillMatch: 'React',
    Icon: SiTailwindcss,
    xPct: 88,
    yPct: 67,
    size: 40,
    rotation: -8,
    opacity: 0.11,
    hideOnMobile: true,
  },
  {
    id: 'amb-vite',
    name: 'Vite',
    skillMatch: 'TypeScript',
    Icon: SiVite,
    xPct: 77,
    yPct: 75,
    size: 36,
    rotation: 10,
    opacity: 0.1,
    hideOnMobile: true,
  },
  {
    id: 'amb-docker',
    name: 'Docker',
    skillMatch: 'Node.js',
    Icon: SiDocker,
    xPct: 12,
    yPct: 69,
    size: 40,
    rotation: 6,
    opacity: 0.1,
    hideOnMobile: true,
  },
  {
    id: 'amb-linux',
    name: 'Linux',
    Icon: SiLinux,
    xPct: 21,
    yPct: 86,
    size: 34,
    rotation: -6,
    opacity: 0.09,
    hideOnMobile: true,
  },
  {
    id: 'amb-git',
    name: 'Git',
    Icon: SiGit,
    xPct: 9,
    yPct: 48,
    size: 34,
    rotation: -14,
    opacity: 0.09,
    hideOnMobile: true,
  },
  {
    id: 'amb-graphql',
    name: 'GraphQL',
    skillMatch: 'TypeScript',
    Icon: SiGraphql,
    xPct: 91,
    yPct: 49,
    size: 34,
    rotation: 15,
    opacity: 0.09,
    hideOnMobile: true,
  },
  {
    id: 'amb-redis',
    name: 'Redis',
    skillMatch: 'Node.js',
    Icon: SiRedis,
    xPct: 83,
    yPct: 16,
    size: 34,
    rotation: -7,
    opacity: 0.09,
    hideOnMobile: true,
  },
  {
    id: 'amb-vercel',
    name: 'Vercel',
    skillMatch: 'Next.js',
    Icon: SiVercel,
    xPct: 79,
    yPct: 86,
    size: 32,
    rotation: 0,
    opacity: 0.09,
    hideOnMobile: true,
  },
];

export interface AmbientTechFieldProps {
  hoveredSkill: string | null;
  activeNodeSkills?: string[];
}

export const AmbientTechField: React.FC<AmbientTechFieldProps> = ({
  hoveredSkill,
  activeNodeSkills = [],
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      style={{ zIndex: 0 }}
    >
      {/* Shared SVG defs for metallic greyed-out vertical gradient fade */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="ambient-tech-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F3F1EC" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#8E8B84" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#222226" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="ambient-tech-grad-active" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F3F1EC" stopOpacity="1" />
            <stop offset="60%" stopColor="#FF3B1D" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#8E8B84" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {AMBIENT_TECH_ITEMS.map((item) => {
        const isMatched =
          (hoveredSkill !== null && item.skillMatch === hoveredSkill) ||
          (item.skillMatch !== undefined &&
            activeNodeSkills.includes(item.skillMatch));

        const IconComponent = item.Icon;

        return (
          <div
            key={item.id}
            style={{
              left: `${item.xPct}%`,
              top: `${item.yPct}%`,
              opacity: isMatched ? 0.42 : item.opacity,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg) scale(${isMatched ? 1.12 : 1})`,
              transition:
                'opacity 320ms var(--ease-out), transform 360ms var(--ease-out)',
            }}
            className={[
              'absolute flex flex-col items-center justify-center',
              item.hideOnMobile ? 'hidden md:flex' : 'flex',
            ].join(' ')}
          >
            {/* Subtle radial halo behind each emblem */}
            <div
              className="relative flex items-center justify-center rounded-full p-3.5"
              style={{
                background: isMatched
                  ? 'radial-gradient(circle, rgba(255,59,29,0.12) 0%, rgba(18,18,20,0.4) 65%, transparent 100%)'
                  : 'radial-gradient(circle, rgba(243,241,236,0.045) 0%, transparent 72%)',
                maskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0.45) 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0.45) 100%)',
              }}
            >
              <IconComponent
                size={item.size}
                style={{
                  fill: isMatched
                    ? 'url(#ambient-tech-grad-active)'
                    : 'url(#ambient-tech-grad)',
                }}
              />
            </div>
            <span className="mt-1 font-mono text-[9px] tracking-widest uppercase text-[#8E8B84]/55">
              {item.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};
