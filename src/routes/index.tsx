import React, { Component, Suspense, type ReactNode, useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { CornerFrame } from '@/components/CornerFrame';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { FallbackListView } from '@/components/graph/FallbackListView';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { WitnessPeekIntro } from '@/components/splash/WitnessPeekIntro';
import { SITE_META } from '@/data/portfolio-content';
import { prefersReducedMotion } from '@/lib/motion/engine';

// Lazy-load the 3D Earth scene to keep bundle size lightweight and pass strict audit thresholds
const EarthHeroScene = React.lazy(() =>
  import('@/components/3d/EarthHeroScene').then((m) => ({ default: m.EarthHeroScene }))
);

export const Route = createFileRoute('/')({
  component: HomeView,
});

interface GraphErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class GraphErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  GraphErrorBoundaryState
> {
  constructor(props: { children: ReactNode; onRetry: () => void }) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: Error): GraphErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Graph visualization failed to initialize.',
    };
  }

  componentDidCatch(error: Error) {
    console.error('[NodeGraphPortfolio] Graph render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <FallbackListView
          errorMessage={this.state.errorMessage}
          onSwitchToGraph={() => {
            this.setState({ hasError: false, errorMessage: null });
            this.props.onRetry();
          }}
        />
      );
    }
    return this.props.children;
  }
}

function HomeView() {
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');
  const [graphKey, setGraphKey] = useState(0);
  const [introCompleted, setIntroCompleted] = useState(() => prefersReducedMotion());
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track dynamic scroll to choreograph the 3D Earth and SOLEZ depth transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const heroHeight = window.innerHeight || 800;
      // Normalizes scroll progress from 0 (top hero) to 1 (full transition)
      const progress = Math.min(1, Math.max(0, scrollY / (heroHeight * 0.85)));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute depth SOLEZ text transform and opacity
  // When scrollProgress is 0: Text is centered in 3D depth behind the revolving Earth
  // As scrollProgress increases to 1: Earth moves aside, and SOLEZ text smoothly interpolates to align with the bottom watermark under the nodes
  const solezOpacity = 1 - scrollProgress * 0.92;
  const solezTranslateY = scrollProgress * 220; // moves downward toward bottom watermark
  const solezScale = 1 - scrollProgress * 0.15;

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F3F1EC]">
      {/* 1. Dramatic "Witness Peek" WebGPU/Shader Intro Loader */}
      {!introCompleted && (
        <WitnessPeekIntro onComplete={() => setIntroCompleted(true)} />
      )}

      {/* 2. Top Navigation and UI Anchors */}
      <CornerFrame
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode((m) => (m === 'graph' ? 'list' : 'graph'))
        }
      />

      <main id="main-content">
        <section
          id="work-graph"
          aria-label="Interactive Node Graph Portfolio"
          className="relative min-h-[100svh] overflow-hidden"
        >
          {/* 3. Deep 3D SOLEZ Typographic Monolith sitting in space behind the Earth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none transition-transform duration-75 ease-out"
            style={{
              opacity: solezOpacity,
              transform: `translate3d(0, ${solezTranslateY}px, 0) scale(${solezScale})`,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--f-display)',
                textShadow: '0 0 80px rgba(255, 59, 29, 0.15), 0 0 160px rgba(18, 18, 20, 0.8)',
              }}
              className="text-[26vw] md:text-[22vw] font-black leading-[0.8] tracking-[-0.055em] text-[#F3F1EC]/[0.08] select-none"
            >
              {SITE_META.alias}
            </span>
          </div>

          {/* 4. Photorealistic 3D Revolving Night-Sky Earth Scene */}
          <Suspense fallback={null}>
            <EarthHeroScene scrollProgress={scrollProgress} />
          </Suspense>

          {/* 5. Architectural Hero Header Statement (Top-Left Anchor) */}
          <div className="pointer-events-none absolute top-16 md:top-20 left-5 md:left-10 z-20 max-w-sm">
            <h1
              style={{ fontFamily: 'var(--f-display)' }}
              className="text-xl md:text-2xl font-semibold tracking-[-0.03em] text-[#F3F1EC] leading-[1.1]"
            >
              {SITE_META.role.split('&')[0].trim()}{' '}
              <span className="serif-italic font-normal text-[#8E8B84]">
                &amp; Systems Architect.
              </span>
            </h1>
            <p className="hidden sm:block mt-2 font-sans text-xs md:text-[13px] text-[#8E8B84] leading-relaxed">
              {SITE_META.heroSummary}
            </p>
          </div>

          {/* 6. Interactive Node Graph Canvas */}
          {viewMode === 'graph' ? (
            <GraphErrorBoundary onRetry={() => setGraphKey((k) => k + 1)}>
              <GraphCanvas
                key={graphKey}
                onFallbackRequested={() => setViewMode('list')}
              />
            </GraphErrorBoundary>
          ) : (
            <FallbackListView onSwitchToGraph={() => setViewMode('graph')} />
          )}
        </section>

        {/* 7. Editorial Selected Works Index & Manifesto */}
        <AboutSection />
      </main>

      {/* 8. Connect Constellation Footer */}
      <Footer />
    </div>
  );
}
