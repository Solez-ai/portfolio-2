import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  ArrowUpRight,
  Command as CommandIcon,
  Network,
  RotateCcw,
} from 'lucide-react';
import { CONTACTS, PROJECTS, SITE_META } from '@/data/portfolio-content';
import { scrollToTarget } from '@/lib/motion/engine';
import { ArtifactWindow } from './ArtifactWindow';

export interface WorkbenchCanvasProps {
  onOpenCommandPalette: () => void;
  onSwitchToGraph: () => void;
}

const DEFAULT_OPEN_SLUGS = ['nodex', 'vell', '3dragwin'];

function computeInitialLayout(stageWidth: number, stageHeight: number) {
  const safeW = Math.max(stageWidth, 560);
  const safeH = Math.max(stageHeight, 620);
  const winW = Math.min(368, Math.max(305, Math.round(safeW * 0.45)));

  const positions: Record<string, { x: number; y: number }> = {
    nodex: {
      x: Math.max(16, Math.round(safeW * 0.03)),
      y: 18,
    },
    vell: {
      x: Math.max(380, Math.round(safeW - winW - 20)),
      y: 28,
    },
    '3dragwin': {
      x: Math.max(24, Math.round((safeW - winW) * 0.5)),
      y: Math.max(326, Math.round(safeH * 0.505)),
    },
    urlpad: {
      x: Math.max(32, Math.round(safeW * 0.14)),
      y: Math.max(84, Math.round(safeH * 0.24)),
    },
    pysketch: {
      x: Math.max(40, Math.round(safeW * 0.34)),
      y: Math.max(64, Math.round(safeH * 0.18)),
    },
  };

  return { winW, positions };
}

export const WorkbenchCanvas: React.FC<WorkbenchCanvasProps> = ({
  onOpenCommandPalette,
  onSwitchToGraph,
}) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 790, height: 650 });
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile' | null>(null);
  const [openSlugs, setOpenSlugs] = useState<string[]>(DEFAULT_OPEN_SLUGS);
  const [zOrder, setZOrder] = useState<string[]>([
    'nodex',
    'vell',
    'urlpad',
    'pysketch',
    '3dragwin',
  ]);
  const [mobileSelectedSlug, setMobileSelectedSlug] = useState<string>(
    PROJECTS[1].slug
  );
  const [customPositions, setCustomPositions] = useState<
    Record<string, { x: number; y: number }>
  >({});

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const syncMode = () => setViewportMode(mq.matches ? 'desktop' : 'mobile');
    syncMode();
    mq.addEventListener('change', syncMode);
    return () => mq.removeEventListener('change', syncMode);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || viewportMode !== 'desktop') return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setStageSize({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewportMode]);

  const baseLayout = useMemo(
    () => computeInitialLayout(stageSize.width, stageSize.height),
    [stageSize.width, stageSize.height]
  );

  const bounds = useMemo(
    () => ({
      minX: 8,
      maxX: Math.max(16, stageSize.width - baseLayout.winW - 8),
      minY: 10,
      maxY: Math.max(40, stageSize.height - 304),
    }),
    [stageSize.width, stageSize.height, baseLayout.winW]
  );

  const bringToFront = useCallback((slug: string) => {
    setOpenSlugs((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    setZOrder((prev) => [...prev.filter((s) => s !== slug), slug]);
  }, []);

  const handleDragMove = useCallback(
    (slug: string, pos: { x: number; y: number }) => {
      setCustomPositions((prev) => ({ ...prev, [slug]: pos }));
    },
    []
  );

  const handleMinimize = useCallback((slug: string) => {
    setOpenSlugs((prev) => prev.filter((s) => s !== slug));
  }, []);

  const handleResetLayout = () => {
    setCustomPositions({});
    setOpenSlugs(DEFAULT_OPEN_SLUGS);
    setZOrder(['nodex', 'vell', 'urlpad', 'pysketch', '3dragwin']);
  };

  const hasCustomLayout =
    Object.keys(customPositions).length > 0 ||
    openSlugs.join(',') !== DEFAULT_OPEN_SLUGS.join(',');

  const activeFrontSlug =
    [...zOrder].reverse().find((s) => openSlugs.includes(s)) ?? openSlugs[0];

  const mobileProject =
    PROJECTS.find((p) => p.slug === mobileSelectedSlug) ?? PROJECTS[0];

  return (
    <div className="relative min-h-[100svh] bg-[#08090B] workbench-grid pt-[72px] lg:pt-20 pb-8 lg:pb-10 px-5 md:px-10 flex flex-col justify-between overflow-hidden">
      {/* Main Spatial Split Grid */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Calm Editorial Column */}
        <div className="lg:col-span-5 flex flex-col justify-between py-2 lg:py-8">
          <div className="space-y-4 lg:space-y-6 my-auto">
            {/* Clean Role Pill */}
            <div className="inline-flex items-center gap-2 rounded-[4px] border border-[rgba(242,240,235,0.1)] bg-[#111317] px-3 py-1 font-mono text-xs text-[#9A9DA6]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E8BFF]" />
              <span>Co-Founder &amp; CTO, MentorMind</span>
            </div>

            {/* Single Hero Display Headline */}
            <h1
              style={{ fontFamily: 'var(--f-display)' }}
              className="text-[clamp(2.25rem,4.1vw,4.15rem)] font-semibold tracking-[-0.04em] leading-[0.94] text-[#F2F0EB]"
            >
              Systems built for speed, clarity, and touch.
            </h1>

            <p className="body text-[#9A9DA6] text-sm sm:text-base md:text-lg leading-relaxed max-w-[44ch]">
              {SITE_META.name} ({SITE_META.alias}) in Dhaka. Engineering
              real-time React workspaces, deterministic Rust compilers, and
              serverless tooling.
            </p>

            {/* Primary Actions */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('#about', { duration: 0.95 });
                }}
                className="inline-flex min-h-[40px] sm:min-h-[42px] items-center gap-2 rounded-[5px] bg-[#F2F0EB] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
              >
                <span>Browse Selected Systems</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={onSwitchToGraph}
                className="inline-flex min-h-[40px] sm:min-h-[42px] items-center gap-2 rounded-[5px] border border-[rgba(242,240,235,0.16)] bg-[#111317] px-4 py-2 font-mono text-xs text-[#F2F0EB] hover:border-[#F2F0EB]/60 hover:bg-[#171A20] hover:-translate-y-0.5 cursor-pointer tactile-press"
              >
                <Network className="w-3.5 h-3.5 text-[#5E8BFF]" aria-hidden="true" />
                <span>Kernel Graph</span>
              </button>

              <button
                type="button"
                onClick={onOpenCommandPalette}
                aria-label="Open command menu (Control or Command K)"
                className="hidden sm:inline-flex min-h-[42px] items-center gap-1.5 rounded-[5px] border border-[rgba(242,240,235,0.12)] bg-[#0C0D10] px-3 py-2 font-mono text-xs text-[#9A9DA6] hover:text-[#F2F0EB] hover:border-[rgba(242,240,235,0.3)] hover:-translate-y-0.5 cursor-pointer tactile-press"
              >
                <CommandIcon className="w-3.5 h-3.5" aria-hidden="true" />
                <span>K</span>
              </button>
            </div>
          </div>

          {/* Bottom-Left Social Anchor Links */}
          <div className="hidden lg:flex items-center gap-2 pt-6">
            {CONTACTS.slice(0, 4).map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[30px] items-center rounded-[4px] px-2.5 py-1 font-mono text-xs text-[#9A9DA6] hover:text-[#F2F0EB] hover:bg-[#111317] hover:-translate-y-0.5 tactile-press"
              >
                {social.platform}
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Spatial Artifact Stage (>= 1024px) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-between min-h-[650px]">
          <div
            ref={stageRef}
            aria-label="Interactive software artifact windows. Drag titlebars to rearrange."
            className="relative flex-1 w-full rounded-[8px] border border-[rgba(242,240,235,0.08)] bg-[#0A0B0E]/60 overflow-hidden"
          >
            {viewportMode === 'desktop' &&
              openSlugs.map((slug) => {
                const projIdx = PROJECTS.findIndex((p) => p.slug === slug);
                const project = PROJECTS[projIdx];
                if (!project) return null;
                const position = customPositions[slug] ??
                  baseLayout.positions[slug] ?? { x: 40, y: 40 };
                const zIndex = 10 + Math.max(0, zOrder.indexOf(slug));

                return (
                  <ArtifactWindow
                    key={project.slug}
                    project={project}
                    index={projIdx}
                    position={position}
                    width={baseLayout.winW}
                    zIndex={zIndex}
                    isActive={activeFrontSlug === project.slug}
                    bounds={bounds}
                    onFocus={bringToFront}
                    onDragMove={handleDragMove}
                    onMinimize={handleMinimize}
                  />
                );
              })}

            {viewportMode === 'desktop' && openSlugs.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <p className="font-mono text-xs text-[#9A9DA6]">
                  All workspace windows minimized. Select any system below to focus.
                </p>
              </div>
            )}
          </div>

          {/* Spatial Window Dock Bar */}
          <div className="mt-3.5 flex items-center justify-between gap-3">
            <div
              role="group"
              aria-label="Open project windows"
              className="flex items-center gap-1.5 rounded-[6px] border border-[rgba(242,240,235,0.1)] bg-[#111317]/95 p-1.5"
            >
              {PROJECTS.map((proj, idx) => {
                const isOpen = openSlugs.includes(proj.slug);
                const isFront = activeFrontSlug === proj.slug;
                return (
                  <button
                    key={proj.slug}
                    type="button"
                    onClick={() => bringToFront(proj.slug)}
                    className={[
                      'inline-flex min-h-[30px] items-center gap-1.5 rounded-[4px] px-2.5 py-1 font-mono text-xs cursor-pointer hover:-translate-y-0.5 tactile-press',
                      isFront
                        ? 'bg-[#F2F0EB] text-[#08090B] font-semibold'
                        : isOpen
                          ? 'bg-[#171A20] text-[#F2F0EB] hover:bg-[#1E222A]'
                          : 'text-[#9A9DA6] hover:text-[#F2F0EB] hover:bg-[#171A20]',
                    ].join(' ')}
                  >
                    <span className="text-[10px] opacity-70 tabular-nums">
                      0{idx + 1}
                    </span>
                    <span>{proj.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#9A9DA6]">
              <span>Drag windows to arrange</span>
              {hasCustomLayout && (
                <button
                  type="button"
                  onClick={handleResetLayout}
                  aria-label="Reset workbench window positions"
                  className="inline-flex min-h-[30px] items-center gap-1 rounded-[4px] border border-[rgba(242,240,235,0.12)] bg-[#111317] px-2.5 py-1 text-xs text-[#F2F0EB] hover:border-[#5E8BFF] hover:-translate-y-0.5 cursor-pointer tactile-press"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tablet & Mobile Focused Artifact Deck (< 1024px) */}
        <div className="lg:hidden space-y-3">
          {viewportMode === 'mobile' && (
            <div className="rounded-[7px] workbench-window-active overflow-hidden">
              <div className="h-8 px-3.5 border-b border-[rgba(242,240,235,0.09)] bg-[#14161B] flex items-center justify-between font-mono text-[11px]">
                <span className="flex items-center gap-2 text-[#F2F0EB]">
                  <span className="w-2 h-2 rounded-full bg-[#5E8BFF]" />
                  {mobileProject.slug}.app
                </span>
                <span className="text-[#9A9DA6] tabular-nums">
                  {mobileProject.metrics[0]?.value}
                </span>
              </div>

              <div className="aspect-[16/9] bg-[#08090B] border-b border-[rgba(242,240,235,0.08)] overflow-hidden">
                <img
                  src={mobileProject.thumbnailUrl}
                  alt={`Interface preview of ${mobileProject.name}: ${mobileProject.brief}`}
                  width={640}
                  height={360}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="p-3.5 space-y-3 bg-[#111317]">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      style={{ fontFamily: 'var(--f-display)' }}
                      className="text-lg font-semibold text-[#F2F0EB] tracking-tight"
                    >
                      {mobileProject.name}
                    </h2>
                    <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
                      {mobileProject.year}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#9A9DA6]">
                    {mobileProject.role} · {mobileProject.technologies.slice(0, 3).join(' · ')}
                  </p>
                </div>

                <Link
                  to="/project/$slug"
                  params={{ slug: mobileProject.slug }}
                  className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#F2F0EB] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
                >
                  <span>Open {mobileProject.name} Case Study</span>
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          )}

          {/* Mobile Selector Strip */}
          <div
            role="group"
            aria-label="Select featured system preview"
            className="flex flex-wrap gap-2"
          >
            {PROJECTS.map((proj, idx) => {
              const selected = proj.slug === mobileProject.slug;
              return (
                <button
                  key={proj.slug}
                  type="button"
                  onClick={() => setMobileSelectedSlug(proj.slug)}
                  className={[
                    'min-h-[38px] rounded-[5px] border px-3 py-1.5 font-mono text-xs cursor-pointer hover:-translate-y-0.5 tactile-press',
                    selected
                      ? 'bg-[#F2F0EB] border-[#F2F0EB] text-[#08090B] font-semibold'
                      : 'bg-[#111317] border-[rgba(242,240,235,0.12)] text-[#9A9DA6] hover:text-[#F2F0EB]',
                  ].join(' ')}
                >
                  0{idx + 1} {proj.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
