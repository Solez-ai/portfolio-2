import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { usePinch } from '@use-gesture/react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import {
  CONTACTS,
  type GraphNode,
  type ProjectData,
  SITE_META,
  SKILLS,
} from '@/data/portfolio-content';
import { gsap, prefersReducedMotion } from '@/lib/motion/engine';
import { PhysicsEngine } from '@/lib/physics/engine';
import type { Vector2D } from '@/lib/physics/spring';
import { useIdleDrift } from '@/hooks/useIdleDrift';
import { useURLState } from '@/hooks/useURLState';
import { useGraphStore } from '@/store/graph-store';
import { AmbientTechField } from './AmbientTechField';
import { Edge } from './Edge';
import { Node } from './Node';
import { PreviewCard } from './PreviewCard';

export interface GraphCanvasProps {
  onFallbackRequested?: () => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const physicsRef = useRef<PhysicsEngine | null>(null);
  const morphOverlayRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const nodes = useGraphStore((s) => s.nodes);
  const edges = useGraphStore((s) => s.edges);
  const hoveredNodeId = useGraphStore((s) => s.hoveredNodeId);
  const focusedNodeId = useGraphStore((s) => s.focusedNodeId);
  const hoveredSkill = useGraphStore((s) => s.hoveredSkill);
  const zoom = useGraphStore((s) => s.zoom);
  const pan = useGraphStore((s) => s.pan);
  const viewport = useGraphStore((s) => s.viewport);
  const hasInteracted = useGraphStore((s) => s.hasInteracted);

  const setViewport = useGraphStore((s) => s.setViewport);
  const setHover = useGraphStore((s) => s.setHover);
  const setFocus = useGraphStore((s) => s.setFocus);
  const setEdgeHover = useGraphStore((s) => s.setEdgeHover);
  const setZoom = useGraphStore((s) => s.setZoom);
  const setPan = useGraphStore((s) => s.setPan);
  const syncPhysicsNodes = useGraphStore((s) => s.syncPhysicsNodes);
  const resetGraph = useGraphStore((s) => s.resetGraph);
  const setTransitionSource = useGraphStore((s) => s.setTransitionSource);

  const [isLoaded, setIsLoaded] = useState(() => prefersReducedMotion());
  const [morphingNode, setMorphingNode] = useState<{
    label: string;
    rect: DOMRect;
  } | null>(null);

  useURLState();

  const nodeIds = useMemo(() => nodes.map((n) => n.id), [nodes]);
  const driftOffsets = useIdleDrift(nodeIds);

  useEffect(() => {
    const engine = new PhysicsEngine({
      onUpdate: (updatedNodes, isSettled) => {
        syncPhysicsNodes(updatedNodes, isSettled);
      },
    });

    const initialNodes = useGraphStore.getState().nodes;
    const initialEdges = useGraphStore.getState().edges;

    if (!prefersReducedMotion()) {
      const cx = useGraphStore.getState().viewport.width / 2;
      const cy = useGraphStore.getState().viewport.height / 2;
      const seededNodes = initialNodes.map((n) => {
        if (n.id === 'exp-mentormind') return n;
        return {
          ...n,
          position: {
            x: cx + (n.equilibrium.x - cx) * 0.85,
            y: cy + (n.equilibrium.y - cy) * 0.85,
          },
        };
      });
      engine.setGraph(seededNodes, initialEdges);
    } else {
      engine.setGraph(initialNodes, initialEdges);
    }

    engine.start();
    physicsRef.current = engine;

    const loadTimer = window.setTimeout(
      () => setIsLoaded(true),
      prefersReducedMotion() ? 0 : 40
    );

    return () => {
      window.clearTimeout(loadTimer);
      engine.stop();
      physicsRef.current = null;
    };
  }, [syncPhysicsNodes]);

  useEffect(() => {
    let resizeTimer: number;
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        setViewport(w, h);
        if (physicsRef.current) {
          const fresh = useGraphStore.getState().nodes;
          const currentEdges = useGraphStore.getState().edges;
          physicsRef.current.setGraph(fresh, currentEdges);
        }
      }, 150);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [setViewport]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        setZoom(useGraphStore.getState().zoom + 0.15);
      } else if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        setZoom(useGraphStore.getState().zoom - 0.15);
      } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        resetGraph();
        if (physicsRef.current) {
          physicsRef.current.setGraph(
            useGraphStore.getState().nodes,
            useGraphStore.getState().edges
          );
        }
      } else if (e.key === 'Escape') {
        setHover(null);
        setFocus(null);
        setEdgeHover(null, null);
      } else if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
        document.activeElement?.getAttribute('data-node-id')
      ) {
        e.preventDefault();
        const currentPan = useGraphStore.getState().pan;
        const step = 28;
        if (e.key === 'ArrowUp') setPan({ x: currentPan.x, y: currentPan.y + step });
        if (e.key === 'ArrowDown') setPan({ x: currentPan.x, y: currentPan.y - step });
        if (e.key === 'ArrowLeft') setPan({ x: currentPan.x + step, y: currentPan.y });
        if (e.key === 'ArrowRight') setPan({ x: currentPan.x - step, y: currentPan.y });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGraph, setEdgeHover, setFocus, setHover, setPan, setZoom]);

  usePinch(
    ({ offset: [scale] }) => {
      setZoom(scale);
    },
    {
      target: containerRef,
      scaleBounds: { min: 0.55, max: 1.85 },
      rubberband: true,
    }
  );

  const handleDragPosition = useCallback((nodeId: string, pos: Vector2D) => {
    if (physicsRef.current) {
      physicsRef.current.setDraggedNode(nodeId);
      physicsRef.current.updateNodePosition(nodeId, pos);
    }
  }, []);

  const handleDragEndVelocity = useCallback(
    (_nodeId: string, velocity: Vector2D) => {
      if (physicsRef.current) {
        physicsRef.current.setDraggedNode(null, velocity);
      }
    },
    []
  );

  const triggerProjectNavigation = useCallback(
    (node: GraphNode, element: HTMLElement | null) => {
      if (node.type !== 'project') {
        setHover(hoveredNodeId === node.id ? null : node.id);
        return;
      }

      const project = node.data as ProjectData;
      const rect = element?.getBoundingClientRect();

      if (rect && !prefersReducedMotion()) {
        setTransitionSource({
          nodeId: node.id,
          slug: project.slug,
          label: project.name,
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
        setMorphingNode({ label: project.name, rect });

        requestAnimationFrame(() => {
          if (morphOverlayRef.current) {
            gsap.fromTo(
              morphOverlayRef.current,
              {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                borderRadius: '5px',
                opacity: 1,
              },
              {
                left: Math.max(24, window.innerWidth * 0.06),
                top: 88,
                width: Math.min(window.innerWidth - 48, 1180),
                height: Math.min(window.innerHeight * 0.52, 440),
                borderRadius: '6px',
                duration: 0.42,
                ease: 'expo.inOut',
                onComplete: () => {
                  navigate({
                    to: '/project/$slug',
                    params: { slug: project.slug },
                  });
                },
              }
            );
          } else {
            navigate({ to: '/project/$slug', params: { slug: project.slug } });
          }
        });
      } else {
        navigate({ to: '/project/$slug', params: { slug: project.slug } });
      }
    },
    [hoveredNodeId, navigate, setHover, setTransitionSource]
  );

  const activeNodeId = hoveredNodeId ?? focusedNodeId;
  const activeNode = useMemo(
    () => nodes.find((n) => n.id === activeNodeId) ?? null,
    [nodes, activeNodeId]
  );

  const nodeConnectionsMap = useMemo(() => {
    const map = new Map<
      string,
      { skills: string[]; connectedNodeIds: Set<string> }
    >();
    for (const n of nodes) {
      map.set(n.id, { skills: [], connectedNodeIds: new Set() });
    }
    for (const e of edges) {
      const sEntry = map.get(e.source);
      const tEntry = map.get(e.target);
      if (sEntry) {
        if (e.label && !sEntry.skills.includes(e.label)) {
          sEntry.skills.push(e.label);
        }
        sEntry.connectedNodeIds.add(e.target);
      }
      if (tEntry) {
        if (e.label && !tEntry.skills.includes(e.label)) {
          tEntry.skills.push(e.label);
        }
        tEntry.connectedNodeIds.add(e.source);
      }
    }
    return map;
  }, [nodes, edges]);

  const orderedNodes = useMemo(
    () => [...nodes].sort((a, b) => a.ring - b.ring),
    [nodes]
  );

  const handleReset = () => {
    resetGraph();
    if (physicsRef.current) {
      physicsRef.current.setGraph(
        useGraphStore.getState().nodes,
        useGraphStore.getState().edges
      );
    }
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive portfolio graph, 5 projects, 2 experiences"
      aria-describedby="graph-drag-hint"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setHover(null);
          setEdgeHover(null, null);
        }
      }}
      className="relative w-full h-[100svh] min-h-[640px] overflow-hidden graph-grid-bg select-none"
    >
      {/* Architectural Crosshair Axis Lines & Orbital Rings */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-full h-px bg-[#222226]/55" />
        <div className="absolute h-full w-px bg-[#222226]/55" />
        <div className="absolute w-[340px] h-[340px] md:w-[540px] md:h-[420px] rounded-full border border-[#222226]/45" />
        <div className="absolute w-[560px] h-[560px] md:w-[880px] md:h-[640px] rounded-full border border-dashed border-[#222226]/35" />
      </div>

      {/* Massive Architectural Poster Watermark behind the graph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-14 md:bottom-12 flex justify-center overflow-hidden"
      >
        <span
          style={{ fontFamily: 'var(--f-display)' }}
          className="text-[24vw] md:text-[19vw] font-bold leading-[0.8] tracking-[-0.055em] text-[#F3F1EC]/[0.028] select-none"
        >
          {SITE_META.alias}
        </span>
      </div>

      {/*Transformed Graph Stage (Pan + Zoom)*/}
      <div
        className="relative w-full h-full origin-center"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transition: useGraphStore.getState().isDragging
            ? 'none'
            : 'transform 160ms var(--ease-out)',
        }}
      >
        {/* Ambient Greyed-Out Gradient Language & Framework Logos around the Nodes */}
        <AmbientTechField
          hoveredSkill={hoveredSkill}
          activeNodeSkills={
            activeNodeId ? nodeConnectionsMap.get(activeNodeId)?.skills ?? [] : []
          }
        />

        {/* SVG Relational Edge Layer */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 'var(--z-edges)' }}
        >
          {edges.map((edge, idx) => {
            const sourceNode = nodes.find((n) => n.id === edge.source);
            const targetNode = nodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted =
              activeNodeId === edge.source ||
              activeNodeId === edge.target ||
              (hoveredSkill !== null && hoveredSkill === edge.label);

            return (
              <Edge
                key={edge.id}
                edge={edge}
                sourceNode={sourceNode}
                targetNode={targetNode}
                sourceDrift={driftOffsets[edge.source]}
                targetDrift={driftOffsets[edge.target]}
                isHighlighted={isHighlighted}
                isLoaded={isLoaded}
                entranceDelayMs={prefersReducedMotion() ? 0 : 120 + idx * 30}
              />
            );
          })}
        </svg>

        {/* Interactive DOM Nodes Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {orderedNodes.map((node, index) => {
            const conn = nodeConnectionsMap.get(node.id);
            const connectedSkills = conn?.skills ?? [];

            const isHighlightedBySkill =
              hoveredSkill !== null &&
              (connectedSkills.includes(hoveredSkill) ||
                (node.type === 'project' &&
                  (node.data as ProjectData).technologies.some(
                    (t) => t.toLowerCase().includes(hoveredSkill.toLowerCase())
                  )));

            const isConnectedToActive =
              activeNodeId !== null &&
              activeNodeId !== node.id &&
              (conn?.connectedNodeIds.has(activeNodeId) ?? false);

            const entranceDelayMs = prefersReducedMotion()
              ? 0
              : Math.min(index * 40, 500);

            return (
              <div key={node.id} className="pointer-events-auto">
                <Node
                  node={node}
                  driftOffset={driftOffsets[node.id]}
                  connectedSkills={connectedSkills}
                  isHighlightedBySkill={isHighlightedBySkill}
                  isConnectedToActive={isConnectedToActive}
                  entranceDelayMs={entranceDelayMs}
                  isLoaded={isLoaded}
                  onDragPosition={handleDragPosition}
                  onDragEndVelocity={handleDragEndVelocity}
                  onSelectNode={triggerProjectNavigation}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover / Focus Preview Card */}
      <PreviewCard
        node={activeNode}
        viewport={viewport}
        zoom={zoom}
        pan={pan}
        onNavigateProject={(n) => {
          const el = containerRef.current?.querySelector(
            `[data-node-id="${n.id}"]`
          ) as HTMLElement | null;
          triggerProjectNavigation(n, el);
        }}
        onDismiss={() => {
          setHover(null);
          setFocus(null);
        }}
      />

      {/* Bottom-Left Corner Anchor inside Hero Stage: Social Telemetry Links */}
      <div className="absolute bottom-5 left-5 md:left-10 z-30 hidden md:flex items-center gap-2">
        {CONTACTS.slice(0, 4).map((social) => (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-[28px] items-center px-2 py-1 font-mono text-xs text-[#8E8B84] hover:text-[#F3F1EC] hover:-translate-y-0.5 transition-all tactile-press"
          >
            {social.platform}
          </a>
        ))}
      </div>

      {/* Bottom-Center: Tactile Skill Matrix Filter Dock (Desktop) */}
      <div
        aria-label="Filter graph nodes by technology skill"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 hidden xl:flex items-center gap-1 rounded-[5px] bg-[#121214]/90 backdrop-blur-md border border-[#222226] px-2.5 py-1"
      >
        <span className="font-mono text-[10px] text-[#8E8B84] px-2">
          FILTER MATRIX
        </span>
        <span aria-hidden="true" className="h-3.5 w-px bg-[#222226] mr-1" />
        {SKILLS.map((skill) => {
          const isSkillActive = hoveredSkill === skill.name;
          return (
            <button
              key={skill.name}
              type="button"
              onPointerEnter={() => setEdgeHover(null, skill.name)}
              onPointerLeave={() => setEdgeHover(null, null)}
              onClick={() =>
                setEdgeHover(
                  null,
                  hoveredSkill === skill.name ? null : skill.name
                )
              }
              className={[
                'inline-flex min-h-[26px] items-center rounded-[3px] px-2.5 py-1 font-mono text-[11px] cursor-pointer tactile-press',
                isSkillActive
                  ? 'bg-[#FF3B1D] text-[#F3F1EC] font-medium'
                  : 'text-[#8E8B84] hover:text-[#F3F1EC] hover:bg-[#17171A]',
              ].join(' ')}
            >
              {skill.name}
            </button>
          );
        })}
      </div>

      {/* Bottom-Right: Telemetry Hint + Precision Zoom Controls */}
      <div className="absolute bottom-5 right-5 md:right-10 z-30 flex items-center gap-3">
        <p
          id="graph-drag-hint"
          className={[
            'font-mono text-[11px] text-[#8E8B84] transition-opacity duration-500 hidden sm:flex items-center gap-2',
            hasInteracted ? 'opacity-45' : 'opacity-90',
          ].join(' ')}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1D]" />
          <span>Drag nodes · Click project to inspect</span>
        </p>

        <div
          role="group"
          aria-label="Graph zoom controls"
          className="flex items-center rounded-[5px] bg-[#121214]/95 border border-[#222226] p-1 gap-0.5"
        >
          <button
            type="button"
            onClick={() => setZoom(zoom - 0.15)}
            aria-label="Zoom out graph"
            className="p-1.5 rounded-[3px] text-[#8E8B84] hover:text-[#F3F1EC] hover:bg-[#17171A] cursor-pointer tactile-press"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] text-[#F3F1EC] px-1.5 tabular-nums min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom(zoom + 0.15)}
            aria-label="Zoom in graph"
            className="p-1.5 rounded-[3px] text-[#8E8B84] hover:text-[#F3F1EC] hover:bg-[#17171A] cursor-pointer tactile-press"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset graph layout and zoom"
            className="p-1.5 rounded-[3px] text-[#8E8B84] hover:text-[#FF3B1D] hover:bg-[#17171A] cursor-pointer tactile-press"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Shared-Element Transition Morph Overlay */}
      {morphingNode && (
        <div
          ref={morphOverlayRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            zIndex: 1000,
          }}
          className="hardware-surface-active rounded-[6px] flex items-center justify-center pointer-events-none"
        >
          <span
            style={{ fontFamily: 'var(--f-display)' }}
            className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-[#F3F1EC]"
          >
            {morphingNode.label}
          </span>
        </div>
      )}
    </div>
  );
};
