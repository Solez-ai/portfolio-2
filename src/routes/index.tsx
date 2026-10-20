import React, { Component, type ReactNode, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { CornerFrame } from '@/components/CornerFrame';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { FallbackListView } from '@/components/graph/FallbackListView';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { SITE_META } from '@/data/portfolio-content';

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

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F3F1EC]">
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
          className="relative"
        >
          {/* Unboxed Architectural Hero Statement (Top-Left Anchor) */}
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

        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}
