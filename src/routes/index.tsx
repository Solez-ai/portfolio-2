import React, { Component, type ReactNode, useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  CornerFrame,
  type WorkspaceViewMode,
} from '@/components/CornerFrame';
import { GraphCanvas } from '@/components/graph/GraphCanvas';
import { FallbackListView } from '@/components/graph/FallbackListView';
import { WorkbenchCanvas } from '@/components/workbench/WorkbenchCanvas';
import { CommandPalette } from '@/components/workbench/CommandPalette';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { WitnessPeekIntro } from '@/components/splash/WitnessPeekIntro';
import { prefersReducedMotion } from '@/lib/motion/engine';

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
      errorMessage: error.message || 'Workspace visualization failed to initialize.',
    };
  }

  componentDidCatch(error: Error) {
    console.error('[WorkbenchPortfolio] Render error:', error);
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
  const [viewMode, setViewMode] = useState<WorkspaceViewMode>('workbench');
  const [graphKey, setGraphKey] = useState(0);
  const [commandOpen, setCommandOpen] = useState(false);
  const [introCompleted, setIntroCompleted] = useState(() =>
    prefersReducedMotion()
  );

  useEffect(() => {
    const onWebGLContextLost = () => {
      setViewMode('list');
    };
    window.addEventListener('webglcontextlost', onWebGLContextLost);
    return () =>
      window.removeEventListener('webglcontextlost', onWebGLContextLost);
  }, []);

  return (
    <div className="min-h-screen bg-[#08090B] text-[#F2F0EB]">
      {/* 1. Optical Slit "Witness Peek" Curtain Reveal (<= 0.9s) */}
      {!introCompleted && (
        <WitnessPeekIntro onComplete={() => setIntroCompleted(true)} />
      )}

      {/* 2. Global Keyboard Command Palette (Cmd+K / Ctrl+K) */}
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* 3. Persistent Minimal Top Architectural Navigation Bar */}
      <CornerFrame
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenCommandPalette={() => setCommandOpen(true)}
      />

      {/* Main Content Container */}
      <main id="main-content" className="relative">
        {/* Hero Stage: Spatial Workbench (default) | Kernel Graph | Structured Index */}
        <section
          id="work-graph"
          aria-label="Interactive Engineering Workbench"
          className="relative min-h-[100svh] overflow-hidden"
        >
          {viewMode === 'workbench' && (
            <WorkbenchCanvas
              onOpenCommandPalette={() => setCommandOpen(true)}
              onSwitchToGraph={() => setViewMode('graph')}
            />
          )}

          {viewMode === 'graph' && (
            <GraphErrorBoundary onRetry={() => setGraphKey((k) => k + 1)}>
              <GraphCanvas
                key={graphKey}
                onSwitchToWorkbench={() => setViewMode('workbench')}
              />
            </GraphErrorBoundary>
          )}

          {viewMode === 'list' && (
            <FallbackListView
              onSwitchToGraph={() => setViewMode('workbench')}
            />
          )}
        </section>

        {/* Below-the-Fold Editorial Index, Profile & Experience */}
        <AboutSection />
      </main>

      {/* Direct Channels & Interactive Contact Graph Footer */}
      <Footer />
    </div>
  );
}
