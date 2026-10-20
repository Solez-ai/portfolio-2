import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { type ReactNode, useEffect, useState } from 'react';

import appCss from '../styles.css?url';
import { gsap, MotionProvider, prefersReducedMotion } from '../lib/motion';
import { FallbackListView } from '../components/graph/FallbackListView';
import { SITE_META } from '../data/portfolio-content';

/**
 * Custom 404 Page (Task 15, Requirements 9.1, 9.2, 9.3):
 * Single disconnected 120px node at viewport center with subtle idle drift and no edges.
 */
function NotFoundComponent() {
  const [drift, setDrift] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tick = (time: number) => {
      setDrift({
        x: Math.sin(time * 1.4) * 3.5,
        y: Math.cos(time * 1.1) * 3.5,
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F3F1EC] graph-grid-bg flex flex-col justify-between px-5 md:px-10 py-6">
      <a
        href="#main-content"
        className="fixed -top-24 left-6 z-[1200] inline-flex min-h-[38px] items-center rounded-[4px] bg-[#FF3B1D] px-4 py-2 font-mono text-xs font-semibold text-[#F3F1EC] transition-transform duration-200 focus:top-5"
      >
        Skip to main content
      </a>

      {/* Top Architectural Header */}
      <header className="flex items-center justify-between">
        <Link
          to="/"
          style={{ fontFamily: 'var(--f-display)' }}
          className="inline-flex items-center gap-2.5 text-lg font-semibold tracking-[-0.03em] text-[#F3F1EC] tactile-press"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF3B1D]" />
          {SITE_META.alias}
        </Link>
        <Link
          to="/"
          className="rounded-[4px] bg-[#121214] border border-[#222226] hover:border-[#F3F1EC]/50 px-3.5 py-1.5 font-mono text-xs text-[#F3F1EC] tactile-press"
        >
          Home
        </Link>
      </header>

      {/* Center Disconnected Node (120px diameter) */}
      <main
        id="main-content"
        className="flex flex-col items-center justify-center text-center my-auto py-16"
      >
        <div
          style={{
            width: '120px',
            height: '120px',
            transform: `translate3d(${drift.x}px, ${drift.y}px, 0)`,
          }}
          className="rounded-[6px] hardware-surface-active flex flex-col items-center justify-center p-3 select-none"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF3B1D] mb-2 animate-pulse" />
          <h1
            style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-m)' }}
            className="font-semibold text-[#F3F1EC] leading-tight"
          >
            404:
            <br />
            Not Found
          </h1>
        </div>

        <p className="mt-5 font-mono text-xs text-[#8E8B84]">
          (disconnected node · no relational edges found)
        </p>

        <Link
          to="/"
          style={{ fontSize: 'var(--t-s)' }}
          className="mt-6 inline-flex items-center gap-2 rounded-[4px] bg-[#F3F1EC] px-4 py-2 font-mono text-xs font-semibold text-[#0B0B0C] hover:bg-[#FF3B1D] hover:text-[#F3F1EC] tactile-press"
        >
          ← Back to Graph
        </Link>
      </main>

      <footer className="flex items-center justify-between font-mono text-xs text-[#8E8B84]">
        <span>© 2025 {SITE_META.alias}</span>
        <span>STATUS: UNLINKED_ROUTE</span>
      </footer>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[PortfolioErrorBoundary]', error);
  }, [error]);

  return (
    <FallbackListView
      errorMessage={error?.message || 'An unexpected runtime error occurred.'}
      onSwitchToGraph={() => {
        window.location.reload();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      {
        title:
          'Samin Yeasar (SOLEZ) — Full Stack Developer & Co-Founder | Interactive Node Graph Portfolio',
      },
      {
        name: 'description',
        content:
          'Interactive node-graph portfolio of Samin Yeasar (SOLEZ / Solez-ai), Full Stack Developer and Co-Founder & CTO at MentorMind. Explore systems built with React, TypeScript, Next.js, and Rust.',
      },
      {
        name: 'keywords',
        content:
          'Samin Yeasar, SOLEZ, Solez-ai, SOLEZ-AI, solez.ai, Full Stack Developer, MentorMind, Nodex, 3DragWin, Vell, URLPad, PySketch, React, TypeScript, Rust',
      },
      { name: 'author', content: 'Samin Yeasar' },
      {
        property: 'og:title',
        content: 'Samin Yeasar (SOLEZ) — The Node Graph Portfolio',
      },
      {
        property: 'og:description',
        content:
          'Explore SOLEZ projects, skills, and engineering case studies through an interactive spring-physics node graph.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://solez.vercel.app' },
      { property: 'og:image', content: 'https://solez.vercel.app/og.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Samin Yeasar (SOLEZ) — The Node Graph Portfolio',
      },
      {
        name: 'twitter:description',
        content:
          'Interactive spring-physics node graph portfolio by Samin Yeasar (SOLEZ).',
      },
      { name: 'twitter:image', content: 'https://solez.vercel.app/og.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'preload',
        href: '/fonts/clash-display-600-normal.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/geist-400_700-normal.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      { rel: 'canonical', href: 'https://solez.vercel.app' },
      { rel: 'alternate', href: 'https://solez.mentormind.bd' },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Samin Yeasar',
              alternateName: 'Solez-ai (SOLEZ / SOLEZ-AI / solez.ai)',
              url: 'https://solez.vercel.app',
              jobTitle: 'Full Stack Developer & Co-Founder',
              description:
                'Full Stack Developer and Co-Founder & CTO at MentorMind in Bangladesh.',
              knowsAbout: [
                'React',
                'TypeScript',
                'Rust',
                'Next.js',
                'Tailwind CSS',
                'PostgreSQL',
                'Supabase',
                'Node.js',
                'Python',
              ],
              sameAs: [
                'https://solez.mentormind.bd',
                'https://solez.vercel.app',
                'https://github.com/Solez-ai',
                'https://x.com/Solez_None',
                'https://www.linkedin.com/in/solez-ai/',
                'https://www.instagram.com/solez.ai',
              ],
              alumniOf: 'Solven.ai',
              affiliation: {
                '@type': 'Organization',
                name: 'MentorMind',
              },
              mainEntityOfPage: {
                '@type': 'WebSite',
                '@id': 'https://solez.vercel.app',
                name: 'Samin Yeasar — Portfolio',
                description:
                  'Full Stack Developer and Co-Founder building MentorMind.',
              },
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;
    try {
      performance.mark('portfolio-hydrated');
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const last = entries[entries.length - 1];
          if (last) {
            performance.mark(`lcp-${Math.round(last.startTime)}ms`);
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        return () => lcpObserver.disconnect();
      }
    } catch {
      // Ignore unsupported observer types
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MotionProvider>
        <Outlet />
      </MotionProvider>
    </QueryClientProvider>
  );
}
