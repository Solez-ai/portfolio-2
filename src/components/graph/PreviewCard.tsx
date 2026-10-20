import React from 'react';
import { ArrowUpRight, ExternalLink, X } from 'lucide-react';
import type {
  ExperienceData,
  GraphNode,
  ProjectData,
} from '@/data/portfolio-content';

export interface PreviewCardProps {
  node: GraphNode | null;
  viewport: { width: number; height: number };
  zoom: number;
  pan: { x: number; y: number };
  onNavigateProject: (node: GraphNode) => void;
  onDismiss: () => void;
}

/**
 * Compute viewport-clamped position for the preview card (Property 3)
 * Guarantees the preview card remains 100% inside viewport bounds.
 */
export function computeClampedCardPosition(
  nodeScreenX: number,
  nodeScreenY: number,
  nodeRadius: number,
  viewport: { width: number; height: number },
  cardWidth = 340,
  cardHeight = 320,
  margin = 16
): { left: number; top: number } {
  const isSmallScreen = viewport.width < 640;

  if (isSmallScreen) {
    const mobileWidth = Math.min(cardWidth, viewport.width - margin * 2);
    const left = Math.max(margin, (viewport.width - mobileWidth) / 2);
    const top = Math.min(
      Math.max(margin + 60, viewport.height - cardHeight - margin - 48),
      viewport.height - cardHeight - margin
    );
    return { left, top };
  }

  let left = nodeScreenX + nodeRadius + 22;
  if (left + cardWidth + margin > viewport.width) {
    left = nodeScreenX - nodeRadius - cardWidth - 22;
  }
  left = Math.min(
    Math.max(margin, left),
    Math.max(margin, viewport.width - cardWidth - margin)
  );

  let top = nodeScreenY - cardHeight / 2;
  top = Math.min(
    Math.max(margin + 56, top),
    Math.max(margin + 56, viewport.height - cardHeight - margin - 48)
  );

  return { left, top };
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  node,
  viewport,
  zoom,
  pan,
  onNavigateProject,
  onDismiss,
}) => {
  if (!node) return null;

  const cx = viewport.width / 2;
  const cy = viewport.height / 2;
  const screenX = cx + (node.position.x - cx) * zoom + pan.x;
  const screenY = cy + (node.position.y - cy) * zoom + pan.y;

  const cardWidth = Math.min(340, viewport.width - 32);
  const isProject = node.type === 'project';
  const isExperience = node.type === 'experience';
  const cardHeight = isProject ? 340 : 250;

  const { left, top } = computeClampedCardPosition(
    screenX,
    screenY,
    node.radius * zoom,
    viewport,
    cardWidth,
    cardHeight
  );

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={`Preview details for ${node.label}`}
      data-testid="preview-card"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${cardWidth}px`,
        zIndex: 'var(--z-preview)',
      }}
      className="fixed rounded-[6px] hardware-surface-active overflow-hidden pointer-events-auto animate-popover-in"
    >
      {isProject && (() => {
        const proj = node.data as ProjectData;
        return (
          <div>
            {/* Project Interface Preview Frame */}
            <div className="relative h-[126px] w-full overflow-hidden bg-[#0B0B0C] border-b border-[#222226]">
              <img
                src={proj.thumbnailUrl}
                alt={`Preview of ${proj.name}`}
                width={640}
                height={360}
                className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#17171A] via-transparent to-transparent opacity-80" />
              <span className="absolute bottom-2.5 left-3 font-mono text-[10px] tracking-tight text-[#F3F1EC] bg-[#0B0B0C]/85 border border-[#222226] rounded-[3px] px-2 py-0.5 tabular-nums">
                {proj.year} · {proj.role}
              </span>
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Close preview card"
                className="absolute top-2.5 right-2.5 inline-flex min-w-[28px] min-h-[28px] items-center justify-center rounded-[4px] bg-[#0B0B0C]/85 border border-[#222226] p-1 text-[#8E8B84] hover:text-[#F3F1EC] transition-colors tactile-press"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4">
              <h3
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-xl font-semibold tracking-[-0.025em] text-[#F3F1EC]"
              >
                {proj.name}
              </h3>

              <p className="mt-1.5 text-xs md:text-[13px] text-[#8E8B84] leading-relaxed font-sans">
                {proj.brief}
              </p>

              {/* Primary Technologies */}
              <div
                className="mt-3 flex flex-wrap gap-1.5"
                aria-label="Primary technologies"
              >
                {proj.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-[3px] bg-[#0B0B0C] border border-[#222226] px-2 py-0.5 font-mono text-[10px] text-[#F3F1EC]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Action links */}
              <div className="mt-4 pt-3 border-t border-[#222226] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onNavigateProject(node)}
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#F3F1EC] px-3 py-1.5 font-mono text-xs font-semibold text-[#0B0B0C] hover:bg-[#FF3B1D] hover:text-[#F3F1EC] cursor-pointer tactile-press"
                >
                  Inspect Case Study
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>

                <div className="flex items-center gap-1.5">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-[4px] border border-[#222226] bg-[#0B0B0C] px-2.5 py-1.5 font-mono text-[11px] text-[#8E8B84] hover:border-[#F3F1EC]/50 hover:text-[#F3F1EC] tactile-press"
                    >
                      Live <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-[4px] border border-[#222226] bg-[#0B0B0C] px-2.5 py-1.5 font-mono text-[11px] text-[#8E8B84] hover:border-[#F3F1EC]/50 hover:text-[#F3F1EC] tactile-press"
                    >
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {isExperience && (() => {
        const exp = node.data as ExperienceData;
        return (
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-[#8E8B84] tabular-nums">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1D]" />
                  <span>{exp.dateLabel}</span>
                </div>
                <h3
                  style={{ fontFamily: 'var(--f-display)' }}
                  className="text-xl font-semibold tracking-[-0.025em] text-[#F3F1EC] mt-1"
                >
                  {exp.company}
                </h3>
                <p className="font-mono text-xs text-[#8E8B84]">{exp.role}</p>
              </div>
              <button
                type="button"
                onClick={onDismiss}
                aria-label="Close preview card"
                className="inline-flex min-w-[28px] min-h-[28px] items-center justify-center rounded-[4px] p-1 text-[#8E8B84] hover:text-[#F3F1EC] hover:bg-[#222226] tactile-press"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-2.5 text-xs md:text-[13px] text-[#8E8B84] leading-relaxed font-sans">
              {exp.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-[3px] bg-[#0B0B0C] border border-[#222226] px-2 py-0.5 font-mono text-[10px] text-[#F3F1EC]"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#222226] flex items-center justify-between">
              <a
                href={exp.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#F3F1EC] px-3 py-1.5 font-mono text-xs font-semibold text-[#0B0B0C] hover:bg-[#FF3B1D] hover:text-[#F3F1EC] tactile-press"
              >
                Visit {exp.company}
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
