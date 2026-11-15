import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import {
  EXPERIENCES,
  PROJECTS,
  SITE_META,
  SKILLS,
} from '@/data/portfolio-content';

export const AboutSection: React.FC = () => {
  const [hoveredSlug, setHoveredSlug] = useState<string>(PROJECTS[0].slug);

  const activePreviewProject =
    PROJECTS.find((p) => p.slug === hoveredSlug) ?? PROJECTS[0];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative bg-[#08090B] border-t border-[rgba(242,240,235,0.09)] py-24 md:py-36 px-5 md:px-10"
    >
      <div className="max-w-7xl mx-auto space-y-28 md:space-y-36">
        {/* Part 1: Interactive Selected Works Ledger */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[rgba(242,240,235,0.09)]">
            <div>
              <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
                Selected Works (2025 / 2026)
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-xl)' }}
                className="font-semibold tracking-[-0.035em] text-[#F2F0EB] mt-2 leading-none"
              >
                Engineered Systems
              </h2>
            </div>
            <p className="font-mono text-xs text-[#9A9DA6] max-w-xs">
              Select any system below to open its full architectural breakdown
              and repository metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-6">
            {/* Left 8 Columns: Index Rows */}
            <div className="lg:col-span-8 divide-y divide-[rgba(242,240,235,0.09)] border-b border-[rgba(242,240,235,0.09)]">
              {PROJECTS.map((proj, idx) => {
                const isSelected = hoveredSlug === proj.slug;
                return (
                  <Link
                    key={proj.slug}
                    to="/project/$slug"
                    params={{ slug: proj.slug }}
                    onPointerEnter={() => setHoveredSlug(proj.slug)}
                    onFocus={() => setHoveredSlug(proj.slug)}
                    className="group py-6 md:py-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 transition-all duration-200 hover:pl-1"
                  >
                    <div className="flex items-baseline gap-4 md:gap-6">
                      <span
                        className={[
                          'font-mono text-xs tabular-nums transition-colors duration-200',
                          isSelected ? 'text-[#5E8BFF]' : 'text-[#9A9DA6]',
                        ].join(' ')}
                      >
                        0{idx + 1}
                      </span>
                      <div>
                        <h3
                          style={{ fontFamily: 'var(--f-display)' }}
                          className="text-2xl md:text-4xl font-semibold tracking-[-0.03em] text-[#F2F0EB] transition-transform duration-200 ease-out group-hover:translate-x-2"
                        >
                          {proj.name}
                        </h3>
                        <p className="mt-1.5 text-sm text-[#9A9DA6] max-w-xl font-sans">
                          {proj.brief}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-8 sm:pl-0">
                      <div className="hidden md:flex items-center gap-1.5">
                        {proj.technologies.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-[3px] bg-[#111317] border border-[rgba(242,240,235,0.09)] px-2 py-0.5 font-mono text-[10px] text-[#9A9DA6]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
                        {proj.year}
                      </span>
                      <span
                        className={[
                          'w-8 h-8 rounded-[4px] border flex items-center justify-center transition-all duration-200',
                          isSelected
                            ? 'bg-[#5E8BFF] border-[#5E8BFF] text-[#08090B]'
                            : 'bg-[#111317] border-[rgba(242,240,235,0.1)] text-[#9A9DA6]',
                        ].join(' ')}
                      >
                        <ArrowUpRight
                          className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right 4 Columns: Sticky Live Inspector Frame */}
            <div className="lg:col-span-4 hidden lg:block sticky top-24">
              <div className="rounded-[7px] workbench-window overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-[rgba(242,240,235,0.09)] flex items-center justify-between font-mono text-[11px] text-[#9A9DA6]">
                  <span className="flex items-center gap-2 text-[#F2F0EB]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E8BFF]" />
                    {activePreviewProject.slug}.inspector
                  </span>
                  <span className="tabular-nums">
                    {activePreviewProject.metrics[0]?.value}
                  </span>
                </div>
                <div className="relative aspect-[16/10] bg-[#08090B] overflow-hidden">
                  <img
                    key={activePreviewProject.slug}
                    src={activePreviewProject.thumbnailUrl}
                    alt={`Screenshot of ${activePreviewProject.name}`}
                    width={640}
                    height={400}
                    loading="lazy"
                    className="w-full h-full object-cover object-top animate-popover-in"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#F2F0EB] font-medium">
                      {activePreviewProject.role}
                    </span>
                    <span className="text-[#9A9DA6]">
                      {activePreviewProject.client}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[rgba(242,240,235,0.08)]">
                    {activePreviewProject.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="block font-mono text-[9px] text-[#9A9DA6]">
                          {m.label}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#F2F0EB] tabular-nums">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Engineering Manifesto & Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-12 border-t border-[rgba(242,240,235,0.09)]">
          <div className="lg:col-span-4 space-y-6">
            <span className="font-mono text-xs text-[#9A9DA6] tabular-nums block">
              Engineering Profile
            </span>

            <div className="rounded-[6px] workbench-window p-4 max-w-[290px]">
              <div className="flex items-center gap-3.5">
                <img
                  src={SITE_META.avatar}
                  alt="Portrait of Samin Yeasar, Full Stack Developer and Co-Founder of MentorMind"
                  width={64}
                  height={64}
                  loading="lazy"
                  className="w-14 h-14 rounded-[4px] object-cover grayscale contrast-125 border border-[rgba(242,240,235,0.12)]"
                />
                <div>
                  <p
                    style={{ fontFamily: 'var(--f-display)' }}
                    className="text-base font-semibold text-[#F2F0EB] tracking-tight"
                  >
                    {SITE_META.name}
                  </p>
                  <p className="font-mono text-xs text-[#9A9DA6]">
                    @{SITE_META.alias} · Dhaka, BD
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[rgba(242,240,235,0.08)] flex items-center justify-between font-mono text-[11px] text-[#9A9DA6]">
                <span>Role</span>
                <span className="inline-flex items-center gap-1.5 text-[#F2F0EB]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5E8BFF]" />
                  Co-Founder &amp; CTO
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            <div>
              <h2
                id="about-heading"
                style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-xl)' }}
                className="font-semibold tracking-[-0.035em] text-[#F2F0EB] leading-[0.96]"
              >
                Engineering software with physical mass and zero bloat.
              </h2>
              <p className="body mt-6 text-[#9A9DA6] text-base md:text-lg leading-relaxed">
                {SITE_META.bio}
              </p>
            </div>

            <div className="pt-6 border-t border-[rgba(242,240,235,0.09)]">
              <span className="font-mono text-xs text-[#9A9DA6] block mb-4">
                Core Technical Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s, i) => (
                  <span
                    key={s.name}
                    className="rounded-[4px] bg-[#111317] border border-[rgba(242,240,235,0.09)] px-3.5 py-2 font-mono text-xs text-[#F2F0EB] flex items-center gap-2"
                  >
                    <span className="text-[#9A9DA6] text-[10px] tabular-nums">
                      0{i + 1}
                    </span>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Part 3: Experience Ledger */}
        <div className="pt-12 border-t border-[rgba(242,240,235,0.09)]">
          <div className="mb-8">
            <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
              Leadership &amp; Experience
            </span>
          </div>

          <div className="divide-y divide-[rgba(242,240,235,0.09)] border-y border-[rgba(242,240,235,0.09)]">
            {EXPERIENCES.map((exp) => (
              <article
                key={exp.id}
                className="py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-3 font-mono text-xs text-[#9A9DA6] tabular-nums space-y-1">
                  <span className="text-[#F2F0EB] font-medium block">
                    {exp.dateLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <span
                      className={[
                        'w-1.5 h-1.5 rounded-full',
                        exp.status === 'Active' ? 'bg-[#5E8BFF]' : 'bg-[#9A9DA6]',
                      ].join(' ')}
                    />
                    {exp.status}
                  </span>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    <h3
                      style={{ fontFamily: 'var(--f-display)' }}
                      className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[#F2F0EB]"
                    >
                      {exp.company}
                    </h3>
                    <span className="font-mono text-xs text-[#9A9DA6]">
                      / {exp.role}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-[#9A9DA6] leading-relaxed font-sans">
                    {exp.description}
                  </p>
                </div>

                <div className="lg:col-span-3 flex flex-col lg:items-end justify-between gap-4">
                  <div className="flex flex-wrap lg:justify-end gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-[3px] bg-[#111317] border border-[rgba(242,240,235,0.09)] px-2 py-0.5 font-mono text-[10px] text-[#9A9DA6]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[30px] items-center gap-1.5 rounded-[4px] border border-[rgba(242,240,235,0.1)] bg-[#111317] px-3 py-1.5 font-mono text-xs text-[#F2F0EB] hover:border-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
                  >
                    <span>Inspect {exp.company}</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
