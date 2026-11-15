import React, { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, Minus } from 'lucide-react';
import type { ProjectData } from '@/data/portfolio-content';

export interface ArtifactWindowProps {
  project: ProjectData;
  index: number;
  position: { x: number; y: number };
  width: number;
  zIndex: number;
  isActive: boolean;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
  onFocus: (slug: string) => void;
  onDragMove: (slug: string, pos: { x: number; y: number }) => void;
  onMinimize: (slug: string) => void;
}

export const ArtifactWindow: React.FC<ArtifactWindowProps> = ({
  project,
  index,
  position,
  width,
  zIndex,
  isActive,
  bounds,
  onFocus,
  onDragMove,
  onMinimize,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragOriginRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const clampPos = (nx: number, ny: number) => ({
    x: Math.round(Math.min(Math.max(bounds.minX, nx), bounds.maxX)),
    y: Math.round(Math.min(Math.max(bounds.minY, ny), bounds.maxY)),
  });

  const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    e.preventDefault();
    onFocus(project.slug);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragOriginRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
    };
    setIsDragging(true);
  };

  const handleTitlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragOriginRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;
    onDragMove(project.slug, clampPos(drag.origX + dx, drag.origY + dy));
  };

  const handleTitlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragOriginRef.current;
    if (drag && drag.pointerId === e.pointerId) {
      dragOriginRef.current = null;
      setIsDragging(false);
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    }
  };

  const handleKeyboardNudge = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 28 : 14;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onDragMove(project.slug, clampPos(position.x - step, position.y));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onDragMove(project.slug, clampPos(position.x + step, position.y));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onDragMove(project.slug, clampPos(position.x, position.y - step));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onDragMove(project.slug, clampPos(position.x, position.y + step));
    }
  };

  return (
    <article
      aria-label={`${project.name} workspace window`}
      onPointerDown={() => onFocus(project.slug)}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        zIndex,
        transform: isDragging ? 'scale(1.012)' : 'scale(1)',
        transition: isDragging
          ? 'box-shadow 160ms var(--ease-out), border-color 160ms var(--ease-out)'
          : 'box-shadow 220ms var(--ease-out), border-color 220ms var(--ease-out), transform 220ms var(--ease-out)',
      }}
      className={[
        'absolute rounded-[7px] overflow-hidden select-none',
        isActive ? 'workbench-window-active' : 'workbench-window opacity-95',
      ].join(' ')}
    >
      {/* Window Chrome Handle */}
      <div
        role="group"
        aria-label={`Move ${project.name} window`}
        tabIndex={0}
        onPointerDown={handleTitlePointerDown}
        onPointerMove={handleTitlePointerMove}
        onPointerUp={handleTitlePointerUp}
        onPointerCancel={handleTitlePointerUp}
        onKeyDown={handleKeyboardNudge}
        style={{ touchAction: 'none' }}
        className="h-9 px-3 border-b border-[rgba(242,240,235,0.09)] bg-[#14161B] flex items-center justify-between gap-2 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden="true"
            className={[
              'w-2 h-2 rounded-full transition-colors duration-150 shrink-0',
              isActive ? 'bg-[#5E8BFF]' : 'bg-[#F2F0EB]/20',
            ].join(' ')}
          />
          <span className="font-mono text-[11px] text-[#F2F0EB] truncate">
            0{index + 1} · {project.slug}.app
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-[10px] text-[#9A9DA6] tabular-nums hidden xl:inline-block pr-1">
            {position.x},{position.y}
          </span>
          <button
            type="button"
            onClick={() => onMinimize(project.slug)}
            aria-label={`Minimize ${project.name} window`}
            className="inline-flex min-w-[26px] min-h-[26px] items-center justify-center rounded-[4px] text-[#9A9DA6] hover:text-[#F2F0EB] hover:bg-[#1E2129] hover:-translate-y-0.5 cursor-pointer tactile-press"
          >
            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Real Project Interface Screenshot */}
      <div className="relative aspect-[16/9] bg-[#08090B] overflow-hidden border-b border-[rgba(242,240,235,0.08)]">
        <img
          src={project.thumbnailUrl}
          alt={`Interface preview of ${project.name}: ${project.brief}`}
          width={640}
          height={360}
          draggable={false}
          className={[
            'w-full h-full object-cover object-top transition-transform duration-500',
            isActive ? 'scale-[1.015]' : 'scale-100',
          ].join(' ')}
        />
      </div>

      {/* Crisp Status & Open Strip */}
      <div className="px-3.5 py-3 bg-[#111317] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2
              style={{ fontFamily: 'var(--f-display)' }}
              className="text-base font-semibold tracking-[-0.02em] text-[#F2F0EB] leading-none truncate"
            >
              {project.name}
            </h2>
            <span className="font-mono text-[10px] text-[#9A9DA6] tabular-nums shrink-0">
              {project.metrics[0]?.value}
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-[#9A9DA6] truncate">
            {project.technologies.slice(0, 3).join(' · ')}
          </p>
        </div>

        <Link
          to="/project/$slug"
          params={{ slug: project.slug }}
          className="shrink-0 inline-flex min-h-[30px] items-center gap-1 rounded-[4px] bg-[#F2F0EB] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
        >
          <span>Inspect</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};
