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
      className="relative bg-[#0B0B0C] border-t border-[#222226] py-24 md:py-36 px-5 md:px-10"
    >
      <div className="max-w-7xl mx-auto space-y-28 md:space-y-36">
        {/* PART 1: Obys-Style Interactive Selected Works Index */}
        <div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#222226]">
            <div>
              <span className="font-mono text-xs text-[#8E8B84] tabular-nums">
                01 / SELECTED WORKS (2025—2026)
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-xl)' }}
                className="font-semibold tracking-[-0.035em] text-[#F3F1EC] mt-2 leading-none"
              >
                Engineered{' '}
                <span className="serif-italic font-normal text-[#8E8B84]">
                  Systems
                </span>
              </h2>
            </div>
            <p className="font-mono text-xs text-[#8E8B84] max-w-xs">
              Click any system below to open the full architectural case study
              and live telemetry.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-6">
            {/* Left 8 Columns: Interactive Editorial Index Rows */}
            <div className="lg:col-span-8 divide-y divide-[#222226] border-b border-[#222226]">
              {PROJECTS.map((proj, idx) => {
                const isSelected = hoveredSlug === proj.slug;
                return (
                  <Link
                    key={proj.slug}
                    to="/project/$slug"
                    params={{ slug: proj.slug }}
                    onPointerEnter={() => setHoveredSlug(proj.slug)}
                    onFocus={() => setHoveredSlug(proj.slug)}
                    className="group py-6 md:py-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 transition-colors duration-200"
                  >
                    <div className="flex items-baseline gap-4 md:gap-6">
                      <span
                        className={[
                          'font-mono text-xs tabular-nums transition-colors duration-200',
                          isSelected ? 'text-[#FF3B1D]' : 'text-[#8E8B84]',
                        ].join(' ')}
                      >
                        0{idx + 1}
                      </span>
                      <div>
                        <h3
                          style={{ fontFamily: 'var(--f-display)' }}
                          className="text-2xl md:text-4xl font-semibold tracking-[-0.03em] text-[#F3F1EC] transition-transform duration-200 ease-out group-hover:translate-x-2"
                        >
                          {proj.name}
                        </h3>
                        <p className="mt-1.5 text-sm text-[#8E8B84] max-w-xl font-sans">
                          {proj.brief}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-8 sm:pl-0">
                      <div className="hidden md:flex items-center gap-1.5">
                        {proj.technologies.slice(0, 3).map((t) => (
                          <span
                            key={t}
                            className="rounded-[3px] bg-[#121214] border border-[#222226] px-2 py-0.5 font-mono text-[10px] text-[#8E8B84]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="font-mono text-xs text-[#8E8B84] tabular-nums">
                        {proj.year}
                      </span>
                      <span
                        className={[
                          'w-8 h-8 rounded-[4px] border flex items-center justify-center transition-all duration-200',
                          isSelected
                            ? 'bg-[#FF3B1D] border-[#FF3B1D] text-[#F3F1EC]'
                            : 'bg-[#121214] border-[#222226] text-[#8E8B84]',
                        ].join(' ')}
                      >
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Right 4 Columns: Sticky Live Visual Preview Window */}
            <div className="lg:col-span-4 hidden lg:block sticky top-28">
              <div className="rounded-[6px] hardware-surface overflow-hidden">
                <div className="px-3.5 py-2.5 border-b border-[#222226] flex items-center justify-between font-mono text-[11px] text-[#8E8B84]">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1D]" />
                    INSPECTOR · {activePreviewProject.name.toUpperCase()}
                  </span>
                  <span className="tabular-nums">
                    {activePreviewProject.metrics[0]?.value}
                  </span>
                </div>
                <div className="relative aspect-[16/10] bg-[#0B0B0C] overflow-hidden">
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
                    <span className="text-[#F3F1EC] font-medium">
                      {activePreviewProject.role}
                    </span>
                    <span className="text-[#8E8B84]">
                      {activePreviewProject.client}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#222226]">
                    {activePreviewProject.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="block font-mono text-[9px] text-[#8E8B84]">
                          {m.label}
                        </span>
                        <span className="font-mono text-xs font-semibold text-[#F3F1EC] tabular-nums">
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

        {/* PART 2: Asymmetric Editorial Manifesto & Identity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-12 border-t border-[#222226]">
          <div className="lg:col-span-4 space-y-6">
            <span className="font-mono text-xs text-[#8E8B84] tabular-nums block">
              02 / ARCHITECTURAL PROFILE
            </span>

            <div className="rounded-[5px] hardware-surface p-4 max-w-[280px]">
              <div className="flex items-center gap-3.5">
                <img
                  src={SITE_META.avatar}
                  alt="Portrait of Samin Yeasar, Full Stack Developer and Co-Founder of MentorMind"
                  width={64}
                  height={64}
                  loading="lazy"
                  className="w-14 h-14 rounded-[4px] object-cover grayscale contrast-125 border border-[#222226]"
                />
                <div>
                  <p
                    style={{ fontFamily: 'var(--f-display)' }}
                    className="text-base font-semibold text-[#F3F1EC] tracking-tight"
                  >
                    {SITE_META.name}
                  </p>
                  <p className="font-mono text-xs text-[#8E8B84]">
                    @{SITE_META.alias} · Dhaka, BD
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#222226] flex items-center justify-between font-mono text-[11px] text-[#8E8B84]">
                <span>STATUS</span>
                <span className="inline-flex items-center gap-1.5 text-[#F3F1EC]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1D]" />
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
                className="font-semibold tracking-[-0.035em] text-[#F3F1EC] leading-[0.96]"
              >
                Engineering systems with{' '}
                <span className="serif-italic font-normal text-[#8E8B84]">
                  physical mass,
                </span>{' '}
                deterministic speed, and zero bloat.
              </h2>
              <p className="body mt-6 text-[#8E8B84] text-base md:text-lg leading-relaxed">
                {SITE_META.bio}
              </p>
            </div>

            {/* Core Technical Matrix */}
            <div className="pt-6 border-t border-[#222226]">
              <span className="font-mono text-xs text-[#8E8B84] block mb-4">
                CORE TECHNICAL CAPABILITIES
              </span>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s, i) => (
                  <span
                    key={s.name}
                    className="rounded-[4px] bg-[#121214] border border-[#222226] px-3.5 py-2 font-mono text-xs text-[#F3F1EC] flex items-center gap-2"
                  >
                    <span className="text-[#8E8B84] text-[10px] tabular-nums">
                      0{i + 1}
                    </span>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PART 3: Architectural Experience Ledger */}
        <div className="pt-12 border-t border-[#222226]">
          <div className="mb-8">
            <span className="font-mono text-xs text-[#8E8B84] tabular-nums">
              03 / LEADERSHIP &amp; EXPERIENCE
            </span>
          </div>

          <div className="divide-y divide-[#222226] border-y border-[#222226]">
            {EXPERIENCES.map((exp) => (
              <article
                key={exp.id}
                className="py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                <div className="lg:col-span-3 font-mono text-xs text-[#8E8B84] tabular-nums space-y-1">
                  <span className="text-[#F3F1EC] font-medium block">
                    {exp.dateLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px]">
                    <span
                      className={[
                        'w-1.5 h-1.5 rounded-full',
                        exp.status === 'Active' ? 'bg-[#FF3B1D]' : 'bg-[#8E8B84]',
                      ].join(' ')}
                    />
                    {exp.status}
                  </span>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-baseline gap-3">
                    <h3
                      style={{ fontFamily: 'var(--f-display)' }}
                      className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[#F3F1EC]"
                    >
                      {exp.company}
                    </h3>
                    <span className="font-mono text-xs text-[#8E8B84]">
                      — {exp.role}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-[#8E8B84] leading-relaxed font-sans">
                    {exp.description}
                  </p>
                </div>

                <div className="lg:col-span-3 flex flex-col lg:items-end justify-between gap-4">
                  <div className="flex flex-wrap lg:justify-end gap-1.5">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-[3px] bg-[#121214] border border-[#222226] px-2 py-0.5 font-mono text-[10px] text-[#8E8B84]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[28px] items-center gap-1.5 py-1 font-mono text-xs text-[#F3F1EC] hover:text-[#FF3B1D] transition-colors tactile-press"
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
