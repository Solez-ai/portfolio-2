import React from 'react';
import type { GraphEdge, GraphNode } from '@/data/portfolio-content';
import { useGraphStore } from '@/store/graph-store';

export interface EdgeProps {
  edge: GraphEdge;
  sourceNode: GraphNode;
  targetNode: GraphNode;
  sourceDrift?: { x: number; y: number };
  targetDrift?: { x: number; y: number };
  isHighlighted: boolean;
  isLoaded: boolean;
  entranceDelayMs?: number;
}

export const Edge: React.FC<EdgeProps> = ({
  edge,
  sourceNode,
  targetNode,
  sourceDrift = { x: 0, y: 0 },
  targetDrift = { x: 0, y: 0 },
  isHighlighted,
  isLoaded,
  entranceDelayMs = 0,
}) => {
  const draggedNodeId = useGraphStore((s) => s.draggedNodeId);
  const hoveredEdgeId = useGraphStore((s) => s.hoveredEdgeId);
  const hoveredSkill = useGraphStore((s) => s.hoveredSkill);
  const setEdgeHover = useGraphStore((s) => s.setEdgeHover);

  const isSourceDragging = draggedNodeId === sourceNode.id;
  const isTargetDragging = draggedNodeId === targetNode.id;

  const x1 = sourceNode.position.x + (isSourceDragging ? 0 : sourceDrift.x);
  const y1 = sourceNode.position.y + (isSourceDragging ? 0 : sourceDrift.y);
  const x2 = targetNode.position.x + (isTargetDragging ? 0 : targetDrift.x);
  const y2 = targetNode.position.y + (isTargetDragging ? 0 : targetDrift.y);

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const isThisEdgeHovered =
    hoveredEdgeId === edge.id ||
    (hoveredSkill !== null && hoveredSkill === edge.label);
  const active = isHighlighted || isThisEdgeHovered;

  const strokeColor = active ? '#FF3B1D' : 'rgba(243, 241, 236, 0.16)';
  const strokeOpacity = !isLoaded ? 0 : active ? 0.92 : 1;
  const strokeWidth = active ? 1.75 : 1;

  return (
    <g
      data-edge-id={edge.id}
      data-edge-skill={edge.label}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: `opacity 300ms var(--ease-out) ${entranceDelayMs}ms`,
      }}
    >
      {/* Subtle signal glow when active */}
      {active && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#FF3B1D"
          strokeWidth={5}
          strokeOpacity={0.14}
          strokeLinecap="round"
        />
      )}

      {/* Architectural Hairline Edge */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        style={{
          transition:
            'stroke 160ms var(--ease-out), stroke-opacity 160ms var(--ease-out), stroke-width 160ms var(--ease-out)',
        }}
      />

      {/* Interactive Skill Coordinate Tag at Edge Midpoint */}
      {edge.label && (
        <g
          transform={`translate(${midX}, ${midY})`}
          className="cursor-pointer pointer-events-auto"
          onPointerEnter={() => setEdgeHover(edge.id, edge.label)}
          onPointerLeave={() => setEdgeHover(null, null)}
        >
          <rect
            x={-(edge.label.length * 3.6 + 9)}
            y={-10}
            width={edge.label.length * 7.2 + 18}
            height={20}
            rx={3}
            ry={3}
            fill={active ? '#17171A' : '#0B0B0C'}
            stroke={active ? '#FF3B1D' : '#222226'}
            strokeWidth={1}
            style={{
              transition:
                'fill 160ms var(--ease-out), stroke 160ms var(--ease-out)',
            }}
          />
          <text
            x={0}
            y={3.5}
            textAnchor="middle"
            fill={active ? '#F3F1EC' : '#8E8B84'}
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: '10px',
              fontWeight: active ? 600 : 400,
              letterSpacing: '-0.01em',
              userSelect: 'none',
              transition: 'fill 160ms var(--ease-out)',
            }}
          >
            {edge.label}
          </text>
        </g>
      )}
    </g>
  );
};
