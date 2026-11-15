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
    <div className="min-h-screen bg-[#08090B] text-[#F2F0EB] workbench-grid flex flex-col justify-between px-5 md:px-10 py-6">
      <a
        href="#main-content"
        className="fixed -top-24 left-6 z-[1200] inline-flex min-h-[38px] items-center rounded-[4px] bg-[#5E8BFF] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] transition-transform duration-200 focus:top-5"
      >
        Skip to main content
      </a>

      <header className="flex items-center justify-between">
        <Link
          to="/"
          style={{ fontFamily: 'var(--f-display)' }}
          className="inline-flex min-h-[30px] items-center gap-2.5 text-lg font-semibold tracking-[-0.03em] text-[#F2F0EB] hover:-translate-y-0.5 tactile-press"
        >
          <span className="w-2 h-2 rounded-[2px] bg-[#5E8BFF]" />
          {SITE_META.alias}
        </Link>
        <Link
          to="/"
          className="inline-flex min-h-[32px] items-center rounded-[4px] bg-[#111317] border border-[rgba(242,240,235,0.12)] hover:border-[#F2F0EB]/50 hover:-translate-y-0.5 px-3.5 py-1.5 font-mono text-xs text-[#F2F0EB] tactile-press"
        >
          Workbench
        </Link>
      </header>

      <main
        id="main-content"
        className="flex flex-col items-center justify-center text-center my-auto py-16"
      >
        <div
          style={{
            width: '124px',
            height: '124px',
            transform: `translate3d(${drift.x}px, ${drift.y}px, 0)`,
          }}
          className="rounded-[7px] workbench-window-active flex flex-col items-center justify-center p-3 select-none"
        >
          <span className="w-2 h-2 rounded-full bg-[#5E8BFF] mb-2" />
          <h1
            style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-m)' }}
            className="font-semibold text-[#F2F0EB] leading-tight"
          >
            404:
            <br />
            Not Found
          </h1>
        </div>

        <p className="mt-5 font-mono text-xs text-[#9A9DA6]">
          (unlinked process · route window missing)
        </p>

        <Link
          to="/"
          style={{ fontSize: 'var(--t-s)' }}
          className="mt-6 inline-flex min-h-[38px] items-center gap-2 rounded-[4px] bg-[#F2F0EB] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] hover:bg-[#5E8BFF] hover:-translate-y-0.5 tactile-press"
        >
          Back to Workbench
        </Link>
      </main>

      <footer className="flex items-center justify-between font-mono text-xs text-[#9A9DA6]">
        <span>© 2026 {SITE_META.alias}</span>
        <span>STATUS: UNLINKED_ROUTE</span>
      </footer>
    </div>
  );
}

function ErrorComponent({ error }: { error: unknown; reset?: () => void }) {
  const errorMessage =
    error instanceof Error
      ? error.message
      : 'An unexpected runtime error occurred.';

  useEffect(() => {
    console.error('[PortfolioErrorBoundary]', error);
  }, [error]);

  return (
    <FallbackListView
      errorMessage={errorMessage}
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
        title: 'Samin Yeasar (SOLEZ) | Systems Engineer & Co-Founder',
      },
      {
        name: 'description',
        content:
          'Interactive spatial workbench portfolio of Samin Yeasar (SOLEZ), Full Stack Developer and Co-Founder & CTO at MentorMind building React, TypeScript, and Rust tools.',
      },
      {
        name: 'keywords',
        content:
          'Samin Yeasar, SOLEZ, Solez-ai, SOLEZ-AI, solez.ai, Full Stack Developer, MentorMind, Nodex, 3DragWin, Vell, URLPad, PySketch, React, TypeScript, Rust',
      },
      { name: 'author', content: 'Samin Yeasar' },
      {
        property: 'og:title',
        content: 'Samin Yeasar (SOLEZ) | Spatial Workbench Portfolio',
      },
      {
        property: 'og:description',
        content:
          'Explore SOLEZ engineering systems, Rust tooling, and interactive case studies.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://solez.vercel.app' },
      { property: 'og:image', content: 'https://solez.vercel.app/og.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Samin Yeasar (SOLEZ) | Spatial Workbench Portfolio',
      },
      {
        name: 'twitter:description',
        content:
          'Interactive spatial engineering workbench portfolio by Samin Yeasar (SOLEZ).',
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
                name: 'Samin Yeasar Portfolio',
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
