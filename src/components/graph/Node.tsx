import React, { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  type ExperienceData,
  type GraphNode,
  PROJECTS,
  type ProjectData,
} from '@/data/portfolio-content';
import { isTouch } from '@/lib/motion/engine';
import type { Vector2D } from '@/lib/physics/spring';
import { useDragNode } from '@/hooks/useDragNode';
import { useGraphStore } from '@/store/graph-store';

export interface NodeProps {
  node: GraphNode;
  driftOffset?: { x: number; y: number };
  connectedSkills: string[];
  isHighlightedBySkill: boolean;
  isConnectedToActive: boolean;
  entranceDelayMs?: number;
  isLoaded: boolean;
  onDragPosition: (nodeId: string, pos: Vector2D) => void;
  onDragEndVelocity: (nodeId: string, velocity: Vector2D) => void;
  onSelectNode: (node: GraphNode, element: HTMLElement | null) => void;
}

export const Node: React.FC<NodeProps> = ({
  node,
  driftOffset = { x: 0, y: 0 },
  connectedSkills,
  isHighlightedBySkill,
  isConnectedToActive,
  entranceDelayMs = 0,
  isLoaded,
  onDragPosition,
  onDragEndVelocity,
  onSelectNode,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const draggedNodeId = useGraphStore((s) => s.draggedNodeId);
  const hoveredNodeId = useGraphStore((s) => s.hoveredNodeId);
  const focusedNodeId = useGraphStore((s) => s.focusedNodeId);
  const setHover = useGraphStore((s) => s.setHover);
  const setFocus = useGraphStore((s) => s.setFocus);

  const isDragging = draggedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;
  const isFocused = focusedNodeId === node.id;
  const isActive = isHovered || isFocused || isHighlightedBySkill;

  const handleNodeActivation = () => {
    if (isTouch()) {
      if (hoveredNodeId !== node.id) {
        setHover(node.id);
        return;
      }
    }
    onSelectNode(node, nodeRef.current);
  };

  const { bind } = useDragNode({
    nodeId: node.id,
    position: node.position,
    onDragPosition,
    onDragEndVelocity,
    onNodeClick: handleNodeActivation,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectNode(node, nodeRef.current);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setHover(null);
      setFocus(null);
      nodeRef.current?.blur();
    }
  };

  const x = node.position.x + (isDragging ? 0 : driftOffset.x);
  const y = node.position.y + (isDragging ? 0 : driftOffset.y);

  const isExperience = node.type === 'experience';
  const isCentral = node.id === 'exp-mentormind';
  const isProject = node.type === 'project';

  const projectIndex = isProject
    ? PROJECTS.findIndex((p) => `proj-${p.slug}` === node.id) + 1
    : 0;
  const codeTag = isCentral
    ? 'CORE'
    : isExperience
      ? 'EXP'
      : `0${projectIndex || 1}`;

  const srSummary = (() => {
    const skillsText =
      connectedSkills.length > 0
        ? `, connected to ${connectedSkills.join(', ')}`
        : '';
    if (isProject) {
      const p = node.data as ProjectData;
      return ` (${p.brief}${skillsText}. Press Enter to view case study.)`;
    }
    if (isExperience) {
      const exp = node.data as ExperienceData;
      return ` (${exp.description}${skillsText}.)`;
    }
    return skillsText;
  })();

  const zIndex = isDragging
    ? 100
    : isActive
      ? 35
      : isConnectedToActive
        ? 25
        : isCentral
          ? 20
          : 10;

  // Emil Kowalski rule: never animate from scale(0); enter from 0.94
  const scale = isDragging ? 0.97 : isActive ? 1.04 : 1.0;

  return (
    <div
      ref={nodeRef}
      {...bind()}
      role="button"
      tabIndex={0}
      data-node-id={node.id}
      data-node-type={node.type}
      onPointerEnter={() => {
        if (!isTouch()) setHover(node.id);
      }}
      onPointerLeave={() => {
        if (!isTouch() && hoveredNodeId === node.id) setHover(null);
      }}
      onFocus={() => setFocus(node.id)}
      onBlur={() => {
        if (focusedNodeId === node.id) setFocus(null);
      }}
      onKeyDown={handleKeyDown}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        zIndex,
        transform: `translate(-50%, -50%) scale(${isLoaded ? scale : 0.94})`,
        opacity: isLoaded ? 1 : 0,
        transition: isDragging
          ? 'opacity 150ms var(--ease-out), border-color 150ms var(--ease-out), box-shadow 150ms var(--ease-out)'
          : `transform 200ms var(--ease-out), opacity 320ms var(--ease-out) ${entranceDelayMs}ms, border-color 160ms var(--ease-out), box-shadow 160ms var(--ease-out)`,
        willChange: isDragging ? 'left, top, transform' : 'auto',
        touchAction: 'none',
      }}
      className={[
        'group absolute select-none rounded-[5px] cursor-grab active:cursor-grabbing text-left',
        'flex flex-col justify-between',
        isCentral
          ? 'min-w-[128px] min-h-[82px] md:min-w-[178px] md:min-h-[106px] p-2.5 md:p-3.5'
          : isExperience
            ? 'min-w-[112px] min-h-[70px] md:min-w-[152px] md:min-h-[88px] p-2.5 md:p-3'
            : 'min-w-[104px] min-h-[66px] md:min-w-[144px] md:min-h-[84px] p-2.5 md:p-3',
        isActive || isDragging
          ? 'hardware-surface-active'
          : isConnectedToActive
            ? 'bg-[#151518] border border-[#F3F1EC]/45 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.75)]'
            : isCentral
              ? 'bg-[#151518] border border-[#34343A] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_18px_40px_-10px_rgba(0,0,0,0.85)]'
              : 'hardware-surface hover:border-[#F3F1EC]/60',
      ].join(' ')}
    >
      {/* Top Precision Index Header */}
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className={[
              'inline-block w-1.5 h-1.5 rounded-full transition-colors duration-150',
              isCentral || isActive
                ? 'bg-[#FF3B1D]'
                : isConnectedToActive
                  ? 'bg-[#F3F1EC]'
                  : 'bg-[#8E8B84]/60 group-hover:bg-[#FF3B1D]',
            ].join(' ')}
          />
          <span className="font-mono text-[9px] md:text-[10px] tracking-tight text-[#8E8B84] tabular-nums">
            {codeTag}
          </span>
        </div>

        {isProject ? (
          <ArrowUpRight
            aria-hidden="true"
            className="w-3 h-3 text-[#8E8B84] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#F3F1EC]"
          />
        ) : (
          <span className="font-mono text-[9px] text-[#8E8B84] tabular-nums">
            {isCentral ? '2026' : '2025'}
          </span>
        )}
      </div>

      {/* Center Display Title */}
      <div className="my-0.5">
        <span className="node-label block text-[#F3F1EC] text-xs md:text-[15px] tracking-[-0.02em] leading-none">
          {node.label}
        </span>

        {node.sublabel && (
          <span className="mt-1 block font-mono text-[9px] md:text-[10px] text-[#8E8B84] leading-tight truncate max-w-[138px]">
            {node.sublabel}
          </span>
        )}
      </div>

      {/* Experience Date Line for MentorMind & Solven.ai */}
      {isExperience && (
        <div className="pt-1 mt-1 border-t border-[#222226] flex items-center justify-between">
          <span className="font-mono text-[8px] md:text-[9px] text-[#8E8B84] tabular-nums">
            {(node.data as ExperienceData).dateLabel}
          </span>
        </div>
      )}

      {/* Screen reader relationship summary */}
      <span className="sr-only">{srSummary}</span>
    </div>
  );
};
