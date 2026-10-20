import React from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, ExternalLink, Network } from 'lucide-react';
import { EXPERIENCES, PROJECTS } from '@/data/portfolio-content';

export interface FallbackListViewProps {
  onSwitchToGraph?: () => void;
  errorMessage?: string | null;
}

export const FallbackListView: React.FC<FallbackListViewProps> = ({
  onSwitchToGraph,
  errorMessage,
}) => {
  return (
    <section
      aria-label="Portfolio Projects and Experience Index"
      className="min-h-screen bg-[#0B0B0C] text-[#F3F1EC] pt-28 pb-20 px-5 md:px-10 max-w-7xl mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 pb-8 border-b border-[#222226]">
        <div>
          <p className="font-mono text-xs text-[#8E8B84] tabular-nums">
            01 / STRUCTURED INDEX VIEW
          </p>
          <h2
            style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-xl)' }}
            className="font-semibold tracking-[-0.035em] mt-2 leading-none"
          >
            Projects &amp;{' '}
            <span className="serif-italic font-normal text-[#8E8B84]">
              Experience
            </span>
          </h2>
          {errorMessage && (
            <p role="alert" className="mt-2 font-mono text-xs text-[#FF3B1D]">
              {errorMessage}
            </p>
          )}
        </div>

        {onSwitchToGraph && (
          <button
            type="button"
            onClick={onSwitchToGraph}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#F3F1EC] px-4 py-2.5 font-mono text-xs font-semibold text-[#0B0B0C] hover:bg-[#FF3B1D] hover:text-[#F3F1EC] cursor-pointer tactile-press"
          >
            <Network className="w-4 h-4" aria-hidden="true" />
            Switch to graph view
          </button>
        )}
      </div>

      {/* Featured Projects Index */}
      <div className="mt-10 divide-y divide-[#222226] border-b border-[#222226]">
        {PROJECTS.map((project, idx) => (
          <article
            key={project.slug}
            className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-xs text-[#8E8B84] tabular-nums">
                <span className="text-[#FF3B1D]">0{idx + 1}</span>
                <span>·</span>
                <span>{project.year}</span>
                <span>·</span>
                <span>{project.role}</span>
              </div>
              <h3
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-[#F3F1EC]"
              >
                {project.name}
              </h3>
              <p className="text-sm text-[#8E8B84] leading-relaxed font-sans">
                {project.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-[3px] bg-[#121214] border border-[#222226] px-2 py-0.5 font-mono text-[10px] text-[#F3F1EC]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/project/$slug"
                params={{ slug: project.slug }}
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#F3F1EC] px-4 py-2 font-mono text-xs font-semibold text-[#0B0B0C] hover:bg-[#FF3B1D] hover:text-[#F3F1EC] tactile-press"
              >
                Case Study <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-[4px] bg-[#121214] border border-[#222226] px-3 py-2 font-mono text-xs text-[#8E8B84] hover:text-[#F3F1EC] tactile-press"
                >
                  Live <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-[4px] bg-[#121214] border border-[#222226] px-3 py-2 font-mono text-xs text-[#8E8B84] hover:text-[#F3F1EC] tactile-press"
                >
                  GitHub <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Experience Section */}
      <div className="mt-16">
        <p className="font-mono text-xs text-[#8E8B84] mb-6">
          02 / EXPERIENCE NODES
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPERIENCES.map((exp) => (
            <article
              key={exp.id}
              className="rounded-[5px] hardware-surface p-6 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4
                    style={{ fontFamily: 'var(--f-display)' }}
                    className="text-xl font-semibold text-[#F3F1EC]"
                  >
                    {exp.company}
                  </h4>
                  <p className="font-mono text-xs text-[#8E8B84]">{exp.role}</p>
                </div>
                <span className="rounded-[3px] bg-[#0B0B0C] border border-[#222226] px-2.5 py-1 font-mono text-xs text-[#8E8B84] tabular-nums">
                  {exp.dateLabel}
                </span>
              </div>
              <p className="text-sm text-[#8E8B84] leading-relaxed font-sans">
                {exp.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-[3px] bg-[#0B0B0C] border border-[#222226] px-2 py-0.5 font-mono text-[10px] text-[#8E8B84]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
