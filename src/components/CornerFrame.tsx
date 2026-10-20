import React, { useEffect, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ArrowUpRight, Menu, WifiOff, X } from 'lucide-react';
import { CONTACTS, SITE_META } from '@/data/portfolio-content';
import { scrollToTarget } from '@/lib/motion/engine';

export interface CornerFrameProps {
  viewMode?: 'graph' | 'list';
  onToggleViewMode?: () => void;
}

export const CornerFrame: React.FC<CornerFrameProps> = ({
  viewMode = 'graph',
  onToggleViewMode,
}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [dhakaTime, setDhakaTime] = useState('23°48′N 90°24′E');

  useEffect(() => {
    const updateOnline = () => setIsOffline(!navigator.onLine);
    updateOnline();
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);
    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(new Date());
        setDhakaTime(`DAC ${formatted} UTC+6`);
      } catch {
        setDhakaTime('DAC UTC+6');
      }
    };
    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const handleSectionLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string
  ) => {
    setMobileMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      scrollToTarget(`#${sectionId}`, { duration: 1.05 });
    }
  };

  return (
    <>
      {/* Skip link for keyboard accessibility */}
      <a
        href="#main-content"
        className="fixed -top-24 left-6 z-[1200] inline-flex min-h-[38px] items-center rounded-[4px] bg-[#FF3B1D] px-4 py-2 font-mono text-xs font-semibold text-[#F3F1EC] transition-transform duration-200 focus:top-5"
      >
        Skip to main content
      </a>

      {/* Offline network banner */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] inline-flex items-center gap-2 rounded-[4px] bg-[#17171A] border border-[#FF3B1D]/60 px-3.5 py-1.5 font-mono text-xs text-[#F3F1EC]"
        >
          <WifiOff className="w-3.5 h-3.5 text-[#FF3B1D]" aria-hidden="true" />
          Offline mode · Showing cached portfolio state
        </div>
      )}

      {/* Top Architectural Header Bar */}
      <header
        style={{ zIndex: 'var(--z-header)' }}
        className="fixed top-0 left-0 right-0 pointer-events-none px-5 md:px-10 py-3.5 flex items-center justify-between bg-[#0B0B0C]/85 backdrop-blur-md border-b border-[#222226]/70"
      >
        {/* Top-Left: Unboxed Swiss Wordmark + Live Dhaka Telemetry */}
        <div className="pointer-events-auto flex items-center gap-5">
          <Link
            to="/"
            className="group inline-flex min-h-[28px] items-center gap-2.5 py-1 tactile-press"
          >
            <span className="w-2 h-2 rounded-full bg-[#FF3B1D] transition-transform duration-200 group-hover:scale-125" />
            <span
              style={{ fontFamily: 'var(--f-display)' }}
              className="text-lg md:text-xl font-semibold tracking-[-0.03em] text-[#F3F1EC]"
            >
              {SITE_META.alias}
            </span>
            <span className="font-mono text-[11px] text-[#8E8B84] tracking-tight">
              {SITE_META.name}
            </span>
          </Link>

          <span
            aria-hidden="true"
            className="hidden lg:inline-block h-3.5 w-px bg-[#222226]"
          />

          <span className="hidden lg:inline-block font-mono text-[11px] text-[#8E8B84] tabular-nums">
            {dhakaTime}
          </span>
        </div>

        {/* Top-Right: Editorial Index Navigation + Segmented Graph/Index Switch */}
        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto hidden md:flex items-center gap-4"
        >
          <div className="flex items-center gap-2">
            <a
              href="/#work-graph"
              onClick={(e) => handleSectionLink(e, 'work-graph')}
              aria-current={isHome ? 'page' : undefined}
              className="inline-flex min-h-[28px] items-center px-2.5 py-1 rounded-[3px] font-mono text-xs text-[#F3F1EC] hover:text-[#FF3B1D] hover:bg-[#17171A] hover:-translate-y-0.5 transition-all tactile-press"
            >
              <span className="text-[#8E8B84] mr-1">01</span>Work
            </a>
            <a
              href="/#about"
              onClick={(e) => handleSectionLink(e, 'about')}
              className="inline-flex min-h-[28px] items-center px-2.5 py-1 rounded-[3px] font-mono text-xs text-[#8E8B84] hover:text-[#F3F1EC] hover:bg-[#17171A] hover:-translate-y-0.5 transition-all tactile-press"
            >
              <span className="text-[#8E8B84]/60 mr-1">02</span>Index &amp; Bio
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleSectionLink(e, 'contact')}
              className="inline-flex min-h-[28px] items-center px-2.5 py-1 rounded-[3px] font-mono text-xs text-[#8E8B84] hover:text-[#F3F1EC] hover:bg-[#17171A] hover:-translate-y-0.5 transition-all tactile-press"
            >
              <span className="text-[#8E8B84]/60 mr-1">03</span>Contact
            </a>
          </div>

          {isHome && onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              className="inline-flex min-h-[28px] items-center gap-2 rounded-[4px] bg-[#121214] border border-[#222226] hover:border-[#F3F1EC] hover:bg-[#17171A] hover:-translate-y-0.5 px-3 py-1.5 font-mono text-xs text-[#F3F1EC] cursor-pointer tactile-press"
            >
              <span
                className={[
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  viewMode === 'graph' ? 'bg-[#FF3B1D]' : 'bg-[#8E8B84]',
                ].join(' ')}
              />
              <span>{viewMode === 'graph' ? 'View: Index' : 'View: Graph'}</span>
              <span className="sr-only">
                {viewMode === 'graph'
                  ? ' (Switch to structured index list view)'
                  : ' (Switch to interactive node graph view)'}
              </span>
            </button>
          )}
        </nav>

        {/* Mobile Controls (<768px) */}
        <div className="pointer-events-auto flex md:hidden items-center gap-2">
          {isHome && onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              className="rounded-[4px] bg-[#121214]/95 border border-[#222226] px-3 py-2 font-mono text-xs text-[#F3F1EC] tactile-press"
            >
              {viewMode === 'graph' ? 'Index' : 'Graph'}
              <span className="sr-only">
                {viewMode === 'graph'
                  ? ' (Switch to list view)'
                  : ' (Switch to graph view)'}
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            className="rounded-[4px] bg-[#121214]/95 border border-[#222226] p-2.5 text-[#F3F1EC] hover:border-[#FF3B1D] tactile-press"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-label="Mobile navigation menu"
          className="fixed inset-x-4 top-20 z-[250] rounded-[6px] hardware-surface p-6 md:hidden animate-popover-in"
        >
          <nav className="flex flex-col divide-y divide-[#222226] font-mono text-sm">
            <a
              href="/#work-graph"
              onClick={(e) => handleSectionLink(e, 'work-graph')}
              className="py-3 flex items-center justify-between text-[#F3F1EC] hover:text-[#FF3B1D]"
            >
              <span>01 / Interactive Graph</span>
              <ArrowUpRight className="w-4 h-4 text-[#8E8B84]" />
            </a>
            <a
              href="/#about"
              onClick={(e) => handleSectionLink(e, 'about')}
              className="py-3 flex items-center justify-between text-[#F3F1EC] hover:text-[#FF3B1D]"
            >
              <span>02 / Selected Works &amp; Bio</span>
              <ArrowUpRight className="w-4 h-4 text-[#8E8B84]" />
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleSectionLink(e, 'contact')}
              className="py-3 flex items-center justify-between text-[#F3F1EC] hover:text-[#FF3B1D]"
            >
              <span>03 / Direct Channels</span>
              <ArrowUpRight className="w-4 h-4 text-[#8E8B84]" />
            </a>
          </nav>
          <div className="mt-4 pt-4 border-t border-[#222226] flex flex-wrap gap-4">
            {CONTACTS.slice(0, 4).map((c) => (
              <a
                key={c.platform}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs text-[#8E8B84] hover:text-[#F3F1EC]"
              >
                {c.platform}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Bottom-Left Social Links removed from fixed viewport to prevent scrolling overlap; placed inside Hero GraphCanvas */}
    </>
  );
};
