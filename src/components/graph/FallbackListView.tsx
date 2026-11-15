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
      className="min-h-screen bg-[#08090B] text-[#F2F0EB] pt-28 pb-20 px-5 md:px-10 max-w-7xl mx-auto"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 pb-8 border-b border-[rgba(242,240,235,0.09)]">
        <div>
          <p className="font-mono text-xs text-[#9A9DA6] tabular-nums">
            Structured Catalog ({PROJECTS.length} Projects · {EXPERIENCES.length} Roles)
          </p>
          <h1
            style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-xl)' }}
            className="font-semibold tracking-[-0.035em] mt-2 leading-none"
          >
            Projects &amp; Experience
          </h1>
          {errorMessage && (
            <p role="alert" className="mt-2 font-mono text-xs text-[#5E8BFF]">
              {errorMessage}
            </p>
          )}
        </div>

        {onSwitchToGraph && (
          <button
            type="button"
            onClick={onSwitchToGraph}
            className="inline-flex min-h-[38px] items-center gap-2 rounded-[4px] bg-[#F2F0EB] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 cursor-pointer tactile-press"
          >
            <Network className="w-4 h-4" aria-hidden="true" />
            <span>Switch to Workbench</span>
          </button>
        )}
      </div>

      {/* Featured Projects Index */}
      <div className="mt-10 divide-y divide-[rgba(242,240,235,0.09)] border-b border-[rgba(242,240,235,0.09)]">
        {PROJECTS.map((project, idx) => (
          <article
            key={project.slug}
            className="py-7 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-3 font-mono text-xs text-[#9A9DA6] tabular-nums">
                <span className="text-[#5E8BFF]">0{idx + 1}</span>
                <span>·</span>
                <span>{project.year}</span>
                <span>·</span>
                <span>{project.role}</span>
              </div>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-2xl md:text-3xl font-semibold tracking-[-0.03em] text-[#F2F0EB]"
              >
                {project.name}
              </h2>
              <p className="text-sm text-[#9A9DA6] leading-relaxed font-sans">
                {project.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-[3px] bg-[#111317] border border-[rgba(242,240,235,0.09)] px-2 py-0.5 font-mono text-[10px] text-[#F2F0EB]"
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
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-[4px] bg-[#F2F0EB] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
              >
                Case Study <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-[4px] bg-[#111317] border border-[rgba(242,240,235,0.12)] px-3 py-2 font-mono text-xs text-[#9A9DA6] hover:text-[#F2F0EB] hover:-translate-y-0.5 tactile-press"
                >
                  Live <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-[4px] bg-[#111317] border border-[rgba(242,240,235,0.12)] px-3 py-2 font-mono text-xs text-[#9A9DA6] hover:text-[#F2F0EB] hover:-translate-y-0.5 tactile-press"
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
        <h2 className="font-mono text-xs text-[#9A9DA6] mb-6">
          Leadership &amp; Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXPERIENCES.map((exp) => (
            <article
              key={exp.id}
              className="rounded-[6px] workbench-window p-6 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3
                    style={{ fontFamily: 'var(--f-display)' }}
                    className="text-xl font-semibold text-[#F2F0EB]"
                  >
                    {exp.company}
                  </h3>
                  <p className="font-mono text-xs text-[#9A9DA6]">{exp.role}</p>
                </div>
                <span className="rounded-[3px] bg-[#08090B] border border-[rgba(242,240,235,0.09)] px-2.5 py-1 font-mono text-xs text-[#9A9DA6] tabular-nums">
                  {exp.dateLabel}
                </span>
              </div>
              <p className="text-sm text-[#9A9DA6] leading-relaxed font-sans">
                {exp.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-1.5">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-[3px] bg-[#08090B] border border-[rgba(242,240,235,0.09)] px-2 py-0.5 font-mono text-[10px] text-[#9A9DA6]"
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
