import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Download,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
} from 'lucide-react';
import {
  CONTACTS,
  type GraphEdge,
  type GraphNode,
  SITE_META,
} from '@/data/portfolio-content';
import { PhysicsEngine } from '@/lib/physics/engine';
import { prefersReducedMotion } from '@/lib/motion/engine';

function getContactIcon(icon: string) {
  switch (icon) {
    case 'github':
      return <Github className="w-3.5 h-3.5" aria-hidden="true" />;
    case 'twitter':
      return <Twitter className="w-3.5 h-3.5" aria-hidden="true" />;
    case 'linkedin':
      return <Linkedin className="w-3.5 h-3.5" aria-hidden="true" />;
    case 'instagram':
      return <Instagram className="w-3.5 h-3.5" aria-hidden="true" />;
    case 'email':
      return <Mail className="w-3.5 h-3.5" aria-hidden="true" />;
    default:
      return <Download className="w-3.5 h-3.5" aria-hidden="true" />;
  }
}

function createFooterGraph(width = 640, height = 420): {
  nodes: GraphNode[];
  edges: GraphEdge[];
} {
  const cx = width / 2;
  const cy = height / 2;
  const rx = Math.min(width * 0.34, 210);
  const ry = Math.min(height * 0.34, 145);

  const hubNode: GraphNode = {
    id: 'contact-hub',
    type: 'contact',
    label: 'SOLEZ',
    sublabel: 'Direct',
    position: { x: cx, y: cy },
    equilibrium: { x: cx, y: cy },
    velocity: { x: 0, y: 0 },
    mass: 1.3,
    radius: 44,
    fixed: false,
    ring: 0,
    data: CONTACTS[4],
  };

  const leafNodes: GraphNode[] = CONTACTS.map((contact, idx) => {
    const angle = (idx / CONTACTS.length) * Math.PI * 2 - Math.PI / 2;
    const x = Math.round(cx + Math.cos(angle) * rx);
    const y = Math.round(cy + Math.sin(angle) * ry);
    return {
      id: `contact-${contact.platform.toLowerCase()}`,
      type: 'contact',
      label: contact.platform,
      sublabel: contact.handle,
      position: { x, y },
      equilibrium: { x, y },
      velocity: { x: 0, y: 0 },
      mass: 0.85,
      radius: 30,
      fixed: false,
      ring: 1,
      data: contact,
    };
  });

  const edges: GraphEdge[] = leafNodes.map((leaf) => ({
    id: `edge-hub-${leaf.id}`,
    source: 'contact-hub',
    target: leaf.id,
    label: '',
    strength: 0.9,
  }));

  return {
    nodes: [hubNode, ...leafNodes],
    edges,
  };
}

export const Footer: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PhysicsEngine | null>(null);
  const dragStateRef = useRef<{
    id: string | null;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
  }>({ id: null, startX: 0, startY: 0, origX: 0, origY: 0, moved: false });

  const [graph, setGraph] = useState(() => createFooterGraph(640, 420));
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    const width = el?.clientWidth || 640;
    const height = el?.clientHeight || 420;
    const initial = createFooterGraph(width, height);
    setGraph(initial);

    const engine = new PhysicsEngine({
      minSpacing: 34,
      onUpdate: (updatedNodes) => {
        setGraph((prev) => ({
          ...prev,
          nodes: updatedNodes.map((n) => ({
            ...n,
            position: { ...n.position },
          })),
        }));
      },
    });
    engine.setGraph(initial.nodes, initial.edges);
    engine.start();
    engineRef.current = engine;

    return () => {
      engine.stop();
      engineRef.current = null;
    };
  }, []);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    node: GraphNode
  ) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStateRef.current = {
      id: node.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.position.x,
      origY: node.position.y,
      moved: false,
    };
    engineRef.current?.setDraggedNode(node.id);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = dragStateRef.current;
    if (!st.id) return;
    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    if (Math.hypot(dx, dy) > 5) {
      st.moved = true;
    }
    const nextPos = { x: st.origX + dx, y: st.origY + dy };
    engineRef.current?.updateNodePosition(st.id, nextPos);
    setGraph((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === st.id ? { ...n, position: nextPos } : n
      ),
    }));
  };

  const handlePointerUp = (
    e: React.PointerEvent<HTMLDivElement>,
    node: GraphNode
  ) => {
    const st = dragStateRef.current;
    if (st.id === node.id) {
      engineRef.current?.setDraggedNode(null, { x: 0, y: 0 });
      if (!st.moved && node.id !== 'contact-hub') {
        const contact = node.data as (typeof CONTACTS)[number];
        window.open(
          contact.url,
          contact.url.startsWith('mailto:') ? '_self' : '_blank',
          'noopener,noreferrer'
        );
      }
      dragStateRef.current.id = null;
    }
    if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  return (
    <footer
      id="contact"
      aria-labelledby="footer-connect-heading"
      className="relative min-h-[84svh] flex flex-col justify-between bg-[#08090B] border-t border-[rgba(242,240,235,0.09)] px-5 md:px-10 py-20 md:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Left 5 Columns: Direct Channel Anchor */}
        <div className="lg:col-span-5 space-y-8">
          <span className="font-mono text-xs text-[#9A9DA6] tabular-nums block">
            Direct Channels
          </span>

          <h2
            id="footer-connect-heading"
            style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-xl)' }}
            className="font-semibold tracking-[-0.04em] text-[#F2F0EB] leading-[0.94]"
          >
            Let&apos;s build what ships cleanly.
          </h2>

          <div className="space-y-1.5">
            <p
              style={{ fontSize: 'var(--t-m)' }}
              className="font-sans font-medium text-[#F2F0EB]"
            >
              {SITE_META.role}
            </p>
            <p
              style={{ fontSize: 'var(--t-m)' }}
              className="font-sans text-[#9A9DA6]"
            >
              Available for architecture collaborations and product engineering.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${SITE_META.email}`}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-[5px] bg-[#F2F0EB] px-4 py-2.5 font-mono text-xs font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
            >
              <span>{SITE_META.email}</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <a
              href={SITE_META.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 rounded-[5px] bg-[#111317] border border-[rgba(242,240,235,0.14)] hover:border-[#F2F0EB]/55 hover:-translate-y-0.5 px-4 py-2.5 font-mono text-xs text-[#F2F0EB] tactile-press"
            >
              <span>Curriculum Vitae</span>
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Right 7 Columns: Interactive Contact Graph Canvas (Desktop) */}
        <div className="lg:col-span-7">
          <div
            ref={stageRef}
            aria-label="Interactive contact nodes graph"
            className="relative hidden md:block w-full h-[430px] rounded-[7px] border border-[rgba(242,240,235,0.09)] bg-[#0A0B0E] graph-grid-bg overflow-hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="w-full h-px bg-[rgba(242,240,235,0.05)]" />
              <div className="absolute h-full w-px bg-[rgba(242,240,235,0.05)]" />
              <div className="absolute w-[290px] h-[240px] rounded-full border border-[rgba(242,240,235,0.05)]" />
            </div>

            <svg
              aria-hidden="true"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              {graph.edges.map((edge) => {
                const source = graph.nodes.find((n) => n.id === edge.source);
                const target = graph.nodes.find((n) => n.id === edge.target);
                if (!source || !target) return null;
                const active =
                  hoveredId === target.id || hoveredId === source.id;
                return (
                  <line
                    key={edge.id}
                    x1={source.position.x}
                    y1={source.position.y}
                    x2={target.position.x}
                    y2={target.position.y}
                    stroke={active ? '#5E8BFF' : 'rgba(242, 240, 235, 0.15)'}
                    strokeWidth={active ? 1.75 : 1}
                  />
                );
              })}
            </svg>

            {graph.nodes.map((node) => {
              const isHub = node.id === 'contact-hub';
              const contact = node.data as (typeof CONTACTS)[number];
              const isHovered = hoveredId === node.id;

              if (isHub) {
                return (
                  <div
                    key={node.id}
                    onPointerDown={(e) => handlePointerDown(e, node)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={(e) => handlePointerUp(e, node)}
                    onPointerEnter={() => setHoveredId(node.id)}
                    onPointerLeave={() => setHoveredId(null)}
                    style={{
                      left: `${node.position.x}px`,
                      top: `${node.position.y}px`,
                      transform: 'translate(-50%, -50%)',
                      touchAction: 'none',
                    }}
                    className="absolute z-20 w-[92px] h-[68px] rounded-[6px] workbench-window-active flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none"
                  >
                    <span className="font-mono text-[9px] text-[#5E8BFF]">
                      HUB · 00
                    </span>
                    <span
                      style={{ fontFamily: 'var(--f-display)' }}
                      className="text-sm font-semibold text-[#F2F0EB] mt-0.5"
                    >
                      {SITE_META.alias}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  onPointerDown={(e) => handlePointerDown(e, node)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={(e) => handlePointerUp(e, node)}
                  onPointerEnter={() => setHoveredId(node.id)}
                  onPointerLeave={() => setHoveredId(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open(
                        contact.url,
                        contact.url.startsWith('mailto:') ? '_self' : '_blank',
                        'noopener,noreferrer'
                      );
                    }
                  }}
                  style={{
                    left: `${node.position.x}px`,
                    top: `${node.position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovered && !prefersReducedMotion() ? 1.05 : 1})`,
                    touchAction: 'none',
                  }}
                  className={[
                    'absolute z-10 min-w-[116px] min-h-[60px] px-3 py-2 rounded-[6px] flex flex-col justify-between cursor-grab active:cursor-grabbing select-none transition-all duration-150',
                    isHovered ? 'workbench-window-active' : 'workbench-window',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="text-[#9A9DA6]">
                      {getContactIcon(contact.icon)}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-[#9A9DA6]" aria-hidden="true" />
                  </div>
                  <div className="text-left mt-1">
                    <span
                      style={{ fontFamily: 'var(--f-display)' }}
                      className="block text-xs font-semibold text-[#F2F0EB] leading-none"
                    >
                      {contact.platform}
                    </span>
                    <span className="block font-mono text-[9px] text-[#9A9DA6] max-w-[108px] truncate mt-0.5">
                      {contact.handle}
                    </span>
                  </div>
                  <span className="sr-only">
                    {' '}
                    (Drag or press Enter to open channel)
                  </span>
                </div>
              );
            })}

            <span className="absolute bottom-3 right-3.5 font-mono text-[10px] text-[#9A9DA6]">
              Drag nodes · Click to open channel
            </span>
          </div>

          {/* Mobile Contact List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden text-left">
            {CONTACTS.map((contact) => (
              <a
                key={contact.platform}
                href={contact.url}
                target={contact.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={
                  contact.url.startsWith('mailto:') ? undefined : 'noreferrer'
                }
                className="min-h-[62px] rounded-[6px] workbench-window px-4 py-3 flex items-center justify-between gap-3 hover:border-[#F2F0EB]/50 tactile-press"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-[4px] bg-[#08090B] border border-[rgba(242,240,235,0.09)] text-[#F2F0EB]">
                    {getContactIcon(contact.icon)}
                  </span>
                  <div>
                    <p
                      style={{ fontFamily: 'var(--f-display)' }}
                      className="text-sm font-semibold text-[#F2F0EB]"
                    >
                      {contact.platform}
                    </p>
                    <p className="font-mono text-[11px] text-[#9A9DA6]">
                      {contact.handle}
                    </p>
                  </div>
                </div>
                <ArrowUpRight
                  className="w-4 h-4 text-[#9A9DA6]"
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Colophon Bar */}
      <div className="max-w-7xl mx-auto w-full mt-16 pt-6 border-t border-[rgba(242,240,235,0.09)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-mono text-xs text-[#9A9DA6] tabular-nums">
          © 2026 {SITE_META.alias} · {SITE_META.name}. All rights reserved.
        </p>
        <p className="font-mono text-xs text-[#9A9DA6]">
          Clash Display · Geist · JetBrains Mono · Spatial Physics Workbench
        </p>
      </div>
    </footer>
  );
};
