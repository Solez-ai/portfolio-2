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
      ? `${project.name} — Case Study | ${SITE_META.name} (${SITE_META.alias})`
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

  const handleBackToGraph = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion() || !heroRef.current) {
      return;
    }
    e.preventDefault();
    gsap.to(heroRef.current, {
      scale: 0.94,
      opacity: 0,
      duration: 0.28,
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
        className="min-h-screen bg-[#0B0B0C] text-[#F3F1EC] flex flex-col items-center justify-center px-5 text-center"
      >
        <div className="w-[120px] h-[120px] rounded-[6px] hardware-surface-active flex flex-col items-center justify-center mb-6">
          <span className="font-mono text-xs text-[#FF3B1D]">NODE</span>
          <span
            style={{ fontFamily: 'var(--f-display)' }}
            className="text-base font-semibold text-[#F3F1EC] mt-1"
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
        <p className="mt-2 text-sm text-[#8E8B84] max-w-md">
          The requested project node does not exist in the graph or is
          temporarily unavailable.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setRetryCount(0)}
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#121214] border border-[#222226] px-4 py-2 font-mono text-xs text-[#F3F1EC] hover:border-[#F3F1EC]/50 tactile-press"
          >
            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
            Retry
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-[4px] bg-[#F3F1EC] px-4 py-2 font-mono text-xs font-semibold text-[#0B0B0C] hover:bg-[#FF3B1D] hover:text-[#F3F1EC] tactile-press"
          >
            ← Back to Graph
          </Link>
        </div>
      </main>
    );
  }

  const nextProject = getNextProject(project.slug);
  const projectIdx =
    PROJECTS.findIndex((p) => p.slug === project.slug) + 1 || 1;

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F3F1EC]">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="fixed -top-24 left-6 z-[1200] inline-flex min-h-[38px] items-center rounded-[4px] bg-[#FF3B1D] px-4 py-2 font-mono text-xs font-semibold text-[#F3F1EC] transition-transform duration-200 focus:top-5"
      >
        Skip to main content
      </a>

      {/* Architectural Top Navigation Bar */}
      <header
        style={{ zIndex: 'var(--z-header)' }}
        className="fixed top-0 left-0 right-0 px-5 md:px-10 py-4 flex items-center justify-between bg-[#0B0B0C]/85 backdrop-blur-md border-b border-[#222226]"
      >
        <Link
          to="/"
          onClick={handleBackToGraph}
          className="inline-flex items-center gap-2 rounded-[4px] bg-[#121214] border border-[#222226] hover:border-[#F3F1EC]/50 px-3.5 py-1.5 font-mono text-xs text-[#F3F1EC] tactile-press"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Graph</span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-[#8E8B84] tabular-nums">
          <span>CASE STUDY 0{projectIdx}</span>
          <span>/</span>
          <span className="text-[#F3F1EC]">{project.name}</span>
        </div>

        <Link
          to="/"
          style={{ fontFamily: 'var(--f-display)' }}
          className="inline-flex items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-[#F3F1EC] hover:text-[#FF3B1D] transition-colors tactile-press"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF3B1D]" />
          {SITE_META.alias}
        </Link>
      </header>

      <main
        id="main-content"
        className="pt-28 pb-24 px-5 md:px-10 max-w-7xl mx-auto"
      >
        {/* Editorial Title Header */}
        <div className="pb-12 border-b border-[#222226]">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#8E8B84] tabular-nums mb-4">
            <span className="inline-flex items-center gap-1.5 text-[#F3F1EC]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1D]" />
              0{projectIdx} / {project.client.toUpperCase()}
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
                className="font-semibold tracking-[-0.045em] text-[#F3F1EC] leading-[0.88]"
              >
                {project.name}
              </h1>
              <p className="body mt-6 text-[#8E8B84] text-lg md:text-xl max-w-2xl">
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
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[#F3F1EC] px-5 py-3 font-mono text-xs font-semibold text-[#0B0B0C] hover:bg-[#FF3B1D] hover:text-[#F3F1EC] tactile-press"
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
                  className="inline-flex items-center gap-2 rounded-[4px] bg-[#121214] border border-[#222226] hover:border-[#F3F1EC]/50 px-5 py-3 font-mono text-xs text-[#F3F1EC] tactile-press"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>Source Repository</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Full-Bleed Architectural Screenshot Frame */}
        <div
          ref={heroRef}
          className="mt-12 rounded-[6px] overflow-hidden hardware-surface bg-[#0B0B0C]"
        >
          <div className="px-4 py-2.5 border-b border-[#222226] flex items-center justify-between font-mono text-[11px] text-[#8E8B84]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF3B1D]" />
              <span>FIG 0{projectIdx}.0 — SYSTEM INTERFACE CAPTURE</span>
            </div>
            <span className="tabular-nums">{project.slug}.build</span>
          </div>
          <img
            src={project.thumbnailUrl}
            alt={`Interface screenshot of ${project.name}: ${project.brief}`}
            width={1280}
            height={720}
            className="w-full h-auto max-h-[72vh] object-cover object-top"
          />
        </div>

        {/* Asymmetric Case Study Content Grid */}
        <div ref={contentRef} className="mt-20 space-y-24">
          {/* Telemetry Metrics & Spec Table */}
          <section
            aria-label="Project metadata and performance metrics"
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20 border-b border-[#222226]"
          >
            <div className="lg:col-span-4 space-y-6 font-mono text-xs">
              <div>
                <span className="text-[#8E8B84] block mb-1">DOMAIN</span>
                <span className="text-[#F3F1EC] text-sm font-medium">
                  {project.client}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#222226]">
                <div>
                  <span className="text-[#8E8B84] block mb-1">RELEASE</span>
                  <span className="text-[#F3F1EC] text-sm font-medium tabular-nums">
                    {project.year}
                  </span>
                </div>
                <div>
                  <span className="text-[#8E8B84] block mb-1">ROLE</span>
                  <span className="text-[#F3F1EC] text-sm font-medium">
                    {project.role}
                  </span>
                </div>
              </div>
              <div className="pt-4 border-t border-[#222226]">
                <span className="text-[#8E8B84] block mb-2.5">
                  TECHNOLOGY STACK
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-[3px] bg-[#121214] border border-[#222226] px-2.5 py-1 text-xs text-[#F3F1EC]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#222226] border border-[#222226] rounded-[5px] overflow-hidden">
              {project.metrics.map((m, idx) => (
                <div
                  key={m.label}
                  className="bg-[#121214] p-7 flex flex-col justify-between"
                >
                  <span className="font-mono text-[11px] text-[#8E8B84] tabular-nums">
                    0{idx + 1} / {m.label.toUpperCase()}
                  </span>
                  <span
                    style={{ fontFamily: 'var(--f-display)' }}
                    className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-[#F3F1EC] mt-8 tabular-nums"
                  >
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 01 Context & 02 Challenge */}
          <section
            aria-label="Context and technical challenge"
            className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-20 border-b border-[#222226]"
          >
            <div className="md:col-span-6 space-y-4">
              <span className="font-mono text-xs text-[#8E8B84] tabular-nums">
                01 / PROBLEM SPACE
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[#F3F1EC]"
              >
                Context &amp; Motivation
              </h2>
              <p className="body text-[#8E8B84]">{project.context}</p>
            </div>

            <div className="md:col-span-6 space-y-4">
              <span className="font-mono text-xs text-[#8E8B84] tabular-nums">
                02 / ENGINEERING OBSTACLES
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-[#F3F1EC]"
              >
                The Technical Challenge
              </h2>
              <p className="body text-[#8E8B84]">{project.challenge}</p>
            </div>
          </section>

          {/* 03 System Architecture Breakdown */}
          <section
            aria-label="System architecture"
            className="pb-20 border-b border-[#222226]"
          >
            <div className="max-w-2xl mb-10">
              <span className="font-mono text-xs text-[#8E8B84] tabular-nums">
                03 / SYSTEM ARCHITECTURE
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-[#F3F1EC] mt-2"
              >
                Under the{' '}
                <span className="serif-italic font-normal text-[#8E8B84]">
                  hood.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.architecture.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-[5px] hardware-surface p-6 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between font-mono text-xs text-[#8E8B84] pb-4 border-b border-[#222226]">
                    <span>LAYER 0{idx + 1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B1D]" />
                  </div>
                  <p className="mt-5 text-sm md:text-base text-[#F3F1EC]/90 leading-relaxed font-sans">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 04 Shipped Outcome */}
          <section
            aria-label="Project outcome"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-20 border-b border-[#222226]"
          >
            <div className="lg:col-span-4">
              <span className="font-mono text-xs text-[#8E8B84] tabular-nums">
                04 / SHIPPED IMPACT
              </span>
              <h2
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-3xl font-semibold tracking-[-0.03em] text-[#F3F1EC] mt-2"
              >
                Production Outcome
              </h2>
            </div>
            <div className="lg:col-span-8">
              <p
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-xl md:text-3xl font-medium tracking-[-0.02em] text-[#F3F1EC] leading-snug"
              >
                {project.outcome}
              </p>
            </div>
          </section>

          {/* Next Project Editorial Handoff */}
          <section
            aria-label="Next project navigation"
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div>
              <span className="font-mono text-xs text-[#8E8B84] tabular-nums">
                NEXT IN GRAPH SEQUENCE
              </span>
              <h3
                style={{ fontFamily: 'var(--f-display)' }}
                className="text-3xl md:text-5xl font-semibold tracking-[-0.035em] text-[#F3F1EC] mt-2"
              >
                {nextProject.name}
              </h3>
              <p className="text-sm text-[#8E8B84] mt-2 max-w-md font-sans">
                {nextProject.brief}
              </p>
            </div>

            <Link
              to="/project/$slug"
              params={{ slug: nextProject.slug }}
              className="group inline-flex items-center gap-6 rounded-[6px] hardware-surface px-7 py-5 hover:border-[#F3F1EC] tactile-press"
            >
              <div>
                <span className="font-mono text-[10px] text-[#8E8B84] block">
                  INSPECT SYSTEM
                </span>
                <span
                  style={{ fontFamily: 'var(--f-display)' }}
                  className="text-xl font-semibold text-[#F3F1EC]"
                >
                  {nextProject.name}
                </span>
              </div>
              <span className="w-10 h-10 rounded-[4px] bg-[#F3F1EC] text-[#0B0B0C] group-hover:bg-[#FF3B1D] group-hover:text-[#F3F1EC] flex items-center justify-center transition-colors">
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
