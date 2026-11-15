import React, { useEffect, useRef, useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
  Github,
  RefreshCw,
} from 'lucide-react';
import {
  getNextProject,
  getProjectBySlug,
  PROJECTS,
  type ProjectData,
  SITE_META,
} from '@/data/portfolio-content';
import {
  gsap,
  prefersReducedMotion,
  resetScroll,
} from '@/lib/motion/engine';
import { useGraphStore } from '@/store/graph-store';
import { Footer } from '@/components/Footer';

export const Route = createFileRoute('/project/$slug')({
  head: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    const title = project
      ? `${project.name} Case Study | ${SITE_META.name} (${SITE_META.alias})`
      : `Project Case Study | ${SITE_META.name} (${SITE_META.alias})`;
    const description = project
      ? `${project.name}: ${project.brief} Built with ${project.technologies.join(', ')} by ${SITE_META.name}.`
      : `Detailed engineering case study by ${SITE_META.name} (${SITE_META.alias}).`;
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
      ],
    };
  },
  component: CaseStudyPage,
});

const SESSION_CACHE_PREFIX = 'solez_case_study_v1_';

function loadCachedOrFetchProject(slug: string): ProjectData | null {
  try {
    const cached = sessionStorage.getItem(`${SESSION_CACHE_PREFIX}${slug}`);
    if (cached) {
      return JSON.parse(cached) as ProjectData;
    }
  } catch {
    // Ignore storage errors
  }

  const found = getProjectBySlug(slug);
  if (found) {
    try {
      sessionStorage.setItem(
        `${SESSION_CACHE_PREFIX}${slug}`,
        JSON.stringify(found)
      );
    } catch {
      // Ignore storage quota errors
    }
    return found;
  }
  return null;
}

function CaseStudyPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const transitionSource = useGraphStore((s) => s.transitionSource);
  const setTransitionSource = useGraphStore((s) => s.setTransitionSource);

  const [project, setProject] = useState<ProjectData | null>(() =>
    loadCachedOrFetchProject(slug)
  );
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    resetScroll();
    const resolved = loadCachedOrFetchProject(slug);
    if (resolved) {
      setProject(resolved);
      setRetryCount(0);
      return;
    }

    if (retryCount < 3) {
      setIsRetrying(true);
      const backoffMs = Math.pow(2, retryCount) * 200;
      const timer = window.setTimeout(() => {
        const nextTry = loadCachedOrFetchProject(slug);
        setProject(nextTry);
        setIsRetrying(false);
        if (!nextTry) {
          setRetryCount((c) => c + 1);
        }
      }, backoffMs);
      return () => window.clearTimeout(timer);
    }
  }, [slug, retryCount]);

  useEffect(() => {
    if (!project) return;
    if (prefersReducedMotion()) {
      setTransitionSource(null);
      return;
    }

    const ctx = gsap.context(() => {
      if (
        transitionSource &&
        transitionSource.slug === project.slug &&
        heroRef.current
      ) {
        gsap.fromTo(
          heroRef.current,
          {
            scale: 0.96,
            opacity: 0.65,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'expo.out',
            onComplete: () => setTransitionSource(null),
          }
        );
      } else if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: 'expo.out' }
        );
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.48,
            stagger: 0.06,
            ease: 'power3.out',
          }
        );
      }
    });

    return () => ctx.revert();
  }, [project, setTransitionSource, transitionSource]);

  const handleBackToWorkbench = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion() || !heroRef.current) {
      return;
    }
    e.preventDefault();
    gsap.to(heroRef.current, {
      scale: 0.96,
      opacity: 0,
      duration: 0.24,
      ease: 'power3.inOut',
      onComplete: () => {
        navigate({ to: '/' });
      },
    });
  };

  if (!project) {
    return (
      <main
        id="main-content"
        className="min-h-screen bg-[#08090B] text-[#F2F0EB] flex flex-col items-center justify-center px-5 text-center"
      >
        <div className="w-[120px] h-[120px] rounded-[7px] workbench-window-active flex flex-col items-center justify-center mb-6">
          <span className="font-mono text-xs text-[#5E8BFF]">MODULE</span>
          <span
            style={{ fontFamily: 'var(--f-display)' }}
            className="text-base font-semibold text-[#F2F0EB] mt-1"
          >
            {isRetrying ? 'Syncing...' : 'Not Found'}
          </span>
        </div>
        <h1
          style={{ fontFamily: 'var(--f-display)' }}
          className="text-2xl md:text-3xl font-semibold tracking-tight"
        >
          Project &ldquo;{slug}&rdquo; could not be loaded
        </h1>
        <p className="mt-2 text-sm text-[#9A9DA6] max-w-md">
          The requested project entry does not exist in the workspace or is
          temporarily unavailable.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRetryCount(0)}
            className="inline-flex min-h-[36px] items-center gap-2 rounded-[4px] bg-[#111317] border border-[rgba(242,240,235,0.12)] px-4 py-2 font-mono text-xs text-[#F2F0EB] hover:border-[#F2F0EB]/50 hover:-translate-y-0.5 tactile-press"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Retry
          </button>
          <Link
            to="/"
            className="inline-flex min-h-[36px] items-center gap-2 rounded-[4px] bg-[#F2F0EB] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
          >
            Back to Workbench
          </Link>
        </div>
      </main>
    );
  }

  const nextProject = getNextProject(project.slug);
  const projectIdx =
    PROJECTS.findIndex((p) => p.slug === project.slug) + 1 || 1;

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F2F0EB]">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="fixed -top-24 left-6 z-[1200] inline-flex min-h-[38px] items-center rounded-[4px] bg-[#5E8BFF] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] transition-transform duration-200 focus:top-5"
      >
        Skip to main content
      </a>

      {/* Architectural Top Navigation Bar */}
      <header
        style={{ zIndex: 'var(--z-header)' }}
        className="fixed top-0 left-0 right-0 px-5 md:px-10 py-3.5 flex items-center justify-between bg-[#08090B]/88 backdrop-blur-md border-b border-[rgba(242,240,235,0.08)]"
      >
        <Link
          to="/"
          onClick={handleBackToWorkbench}
          className="inline-flex min-h-[34px] items-center gap-2 rounded-[4px] bg-[#111317] border border-[rgba(242,240,235,0.12)] hover:border-[#F2F0EB]/55 hover:-translate-y-0.5 px-3.5 py-1.5 font-mono text-xs text-[#F2F0EB] tactile-press"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Workbench</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#9A9DA6] tabular-nums">
          <span>System 0{projectIdx}</span>
          <span>/</span>
          <span className="text-[#F2F0EB]">{project.name}</span>
        </div>

        <Link
          to="/"
          style={{ fontFamily: 'var(--f-display)' }}
          className="inline-flex min-h-[30px] items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-[#F2F0EB] hover:text-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
        >
          <span className="w-2 h-2 rounded-[2px] bg-[#5E8BFF]" />
          {SITE_META.alias}
        </Link>
      </header>

      <main
        id="main-content"
        className="pt-28 pb-24 px-5 md:px-10 max-w-7xl mx-auto"
      >
        {/* Editorial Title Header */}
        <div className="pb-12 border-b border-[rgba(242,240,235,0.09)]">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#9A9DA6] tabular-nums mb-4">
            <span className="inline-flex items-center gap-1.5 text-[#F2F0EB]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E8BFF]" />
              System 0{projectIdx} · {project.client}
            </span>
            <span>·</span>
            <span>{project.year}</span>
            <span>·</span>
            <span>{project.role}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <h1
                style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: 'var(--t-mega)',
                }}
                className="font-semibold tracking-[-0.045em] text-[#F2F0EB] leading-[0.9]"
              >
                {project.name}
              </h1>
              <p className="body mt-6 text-[#9A9DA6] text-lg md:text-xl max-w-2xl">
                {project.description}
              </p>
            </div>

            {/* External Action Links */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-[5px] bg-[#F2F0EB] px-5 py-2.5 font-mono text-xs font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
                >
                  <span>Launch Live System</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-[5px] bg-[#111317] border border-[rgba(242,240,235,0.14)] hover:border-[#F2F0EB]/55 hover:-translate-y-0.5 px-5 py-2.5 font-mono text-xs text-[#F2F0EB] tactile-press"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>Source Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Window-Framed Screenshot */}
        <div
          ref={heroRef}
          className="mt-12 rounded-[7px] overflow-hidden workbench-window bg-[#08090B]"
        >
          <div className="px-4 py-2.5 border-b border-[rgba(242,240,235,0.09)] bg-[#14161B] flex items-center justify-between font-mono text-[11px] text-[#9A9DA6]">
            <div className="flex items-center gap-2 text-[#F2F0EB]">
              <span className="w-2 h-2 rounded-full bg-[#5E8BFF]" />
              <span>{project.slug}.app / System Capture</span>
            </div>
            <span className="tabular-nums">fig_0{projectIdx}</span>
          </div>
          <img
            src={project.thumbnailUrl}
            alt={`Interface screenshot of ${project.name}: ${project.brief}`}
            width={1280}
            height={720}
            className="w-full h-auto max-h-[72vh] object-cover object-top"
          />
        </div>

        {/* Case Study Content */}
        <div ref={contentRef} className="mt-20 space-y-24">
          <section
            aria-label="Project metadata and performance metrics"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20 border-b border-[rgba(242,240,235,0.09)]"
          >
            <div className="lg:col-span-4 space-y-6 font-mono text-xs">
              <div>
                <span className="text-[#9A9DA6] block mb-1">Domain</span>
                <span className="text-[#F2F0EB] text-sm font-medium">
                  {project.client}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[rgba(242,240,235,0.09)]">
                <div>
                  <span className="text-[#9A9DA6] block mb-1">Release</span>
                  <span className="text-[#F2F0EB] text-sm font-medium tabular-nums">
                    {project.year}
                  </span>
                </div>
                <div>
                  <span className="text-[#9A9DA6] block mb-1">Role</span>
                  <span className="text-[#F2F0EB] text-sm font-medium">
                    {project.role}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-[rgba(242,240,235,0.09)]">
                <span className="text-[#9A9DA6] block mb-2.5">
                  Technology Stack
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-[3px] bg-[#111317] border border-[rgba(242,240,235,0.09)] px-2.5 py-1 text-xs text-[#F2F0EB]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[rgba(242,240,235,0.09)] border border-[rgba(242,240,235,0.09)] rounded-[6px] overflow-hidden">
              {project.metrics.map((m, idx) => (
                <div
                  key={m.label}
                  className="bg-[#111317] p-7 flex flex-col justify-between"
                >
                  <span className="font-mono text-[11px] text-[#9A9DA6] tabular-nums">
                    0{idx + 1} · {m.label}
                  </span>
                  <span
                    style={{ fontFamily: 'var(--f-display)' }}
                    className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-[#F2F0EB] mt-8 tabular-nums"
                  >
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-label="Context and technical challenge"
            className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20 border-b border-[rgba(242,240,235,0.09)]"
          >
            <div className="md:col-span-6 space-y-4">
              <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
                Problem Space
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[#F2F0EB]"
              >
                Context &amp; Motivation
              </h2>
              <p className="body text-[#9A9DA6]">{project.context}</p>
            </div>

            <div className="md:col-span-6 space-y-4">
              <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
                Constraints
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[#F2F0EB]"
              >
                Technical Challenge
              </h2>
              <p className="body text-[#9A9DA6]">{project.challenge}</p>
            </div>
          </section>

          <section
            aria-label="System architecture"
            className="pb-20 border-b border-[rgba(242,240,235,0.09)]"
          >
            <div className="max-w-2xl mb-10">
              <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
                Implementation
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-[#F2F0EB] mt-2"
              >
                Core Architecture Layers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.architecture.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-[6px] workbench-window p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-[#9A9DA6] pb-4 border-b border-[rgba(242,240,235,0.09)]">
                    <span>Layer 0{idx + 1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E8BFF]" />
                  </div>
                  <p className="mt-5 text-sm md:text-base text-[#F2F0EB]/90 leading-relaxed font-sans">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            aria-label="Project outcome"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20 border-b border-[rgba(242,240,235,0.09)]"
          >
            <div className="lg:col-span-4">
              <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
                Shipped Result
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-3xl font-semibold tracking-[-0.03em] text-[#F2F0EB] mt-2"
              >
                Production Outcome
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-xl md:text-3xl font-medium tracking-[-0.02em] text-[#F2F0EB] leading-snug"
              >
                {project.outcome}
              </p>
            </div>
          </section>

          {/* Next Project Handoff */}
          <section
            aria-label="Next project navigation"
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div>
              <span className="font-mono text-xs text-[#9A9DA6] tabular-nums">
                Next System
              </span>
              <h3
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] text-[#F2F0EB] mt-2"
              >
                {nextProject.name}
              </h3>
              <p className="text-sm text-[#9A9DA6] mt-2 max-w-md font-sans">
                {nextProject.brief}
              </p>
            </div>

            <Link
              to="/project/$slug"
              params={{ slug: nextProject.slug }}
              className="group inline-flex items-center gap-6 rounded-[7px] workbench-window px-7 py-5 hover:border-[#F2F0EB] hover:-translate-y-0.5 tactile-press"
            >
              <div>
                <span className="font-mono text-[10px] text-[#9A9DA6] block">
                  Open Case Study
                </span>
                <span
                  style={{ fontFamily: 'var(--f-display)' }}
                  className="text-xl font-semibold text-[#F2F0EB]"
                >
                  {nextProject.name}
                </span>
              </div>
              <span className="w-10 h-10 rounded-[5px] bg-[#F2F0EB] text-[#08090B] group-hover:bg-[#5E8BFF] flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
              </span>
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
