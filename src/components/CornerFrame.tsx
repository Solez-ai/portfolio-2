import React, { useEffect, useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { ArrowUpRight, Command as CommandIcon, Menu, WifiOff, X } from 'lucide-react';
import { CONTACTS, SITE_META } from '@/data/portfolio-content';
import { scrollToTarget } from '@/lib/motion/engine';

export type WorkspaceViewMode = 'workbench' | 'graph' | 'list';

export interface CornerFrameProps {
  viewMode?: WorkspaceViewMode;
  onChangeViewMode?: (mode: WorkspaceViewMode) => void;
  onOpenCommandPalette?: () => void;
}

export const CornerFrame: React.FC<CornerFrameProps> = ({
  viewMode = 'workbench',
  onChangeViewMode,
  onOpenCommandPalette,
}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [dhakaTime, setDhakaTime] = useState('DAC UTC+6');

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
      scrollToTarget(`#${sectionId}`, { duration: 1.0 });
    }
  };

  return (
    <>
      {/* Skip link as very first keyboard focus stop */}
      <a
        href="#main-content"
        className="fixed -top-24 left-6 z-[1200] inline-flex min-h-[38px] items-center rounded-[4px] bg-[#5E8BFF] px-4 py-2 font-mono text-xs font-semibold text-[#08090B] transition-transform duration-200 focus:top-5"
      >
        Skip to main content
      </a>

      {/* Offline network banner */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] inline-flex items-center gap-2 rounded-[4px] bg-[#171A20] border border-[#5E8BFF]/60 px-3.5 py-1.5 font-mono text-xs text-[#F2F0EB]"
        >
          <WifiOff className="w-3.5 h-3.5 text-[#5E8BFF]" aria-hidden="true" />
          Offline mode · Cached workspace active
        </div>
      )}

      {/* Top Architectural Header Bar */}
      <header
        style={{ zIndex: 'var(--z-header)' }}
        className="fixed top-0 left-0 right-0 pointer-events-none px-5 md:px-10 py-3 flex items-center justify-between bg-[#08090B]/88 backdrop-blur-md border-b border-[rgba(242,240,235,0.08)]"
      >
        {/* Top-Left: Wordmark + Live Telemetry */}
        <div className="pointer-events-auto flex items-center gap-4 md:gap-5">
          <Link
            to="/"
            className="group inline-flex min-h-[30px] items-center gap-2.5 py-1 hover:-translate-y-0.5 tactile-press"
          >
            <span
              aria-hidden="true"
              className="w-2 h-2 rounded-[2px] bg-[#5E8BFF] transition-transform duration-200 group-hover:rotate-45"
            />
            <span
              style={{ fontFamily: 'var(--f-display)' }}
              className="text-lg md:text-xl font-semibold tracking-[-0.03em] text-[#F2F0EB]"
            >
              {SITE_META.alias}
            </span>
            <span className="font-mono text-[11px] text-[#9A9DA6] tracking-tight hidden sm:inline">
              {SITE_META.name}
            </span>
          </Link>

          <span
            aria-hidden="true"
            className="hidden lg:inline-block h-3.5 w-px bg-[rgba(242,240,235,0.1)]"
          />

          <span className="hidden lg:inline-block font-mono text-[11px] text-[#9A9DA6] tabular-nums">
            {dhakaTime}
          </span>
        </div>

        {/* Top-Right Desktop Navigation & Mode Switch */}
        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto hidden md:flex items-center gap-3"
        >
          <div className="flex items-center gap-1">
            <a
              href="/#work-graph"
              onClick={(e) => handleSectionLink(e, 'work-graph')}
              aria-current={isHome ? 'page' : undefined}
              className="inline-flex min-h-[30px] items-center px-2.5 py-1 rounded-[4px] font-mono text-xs text-[#F2F0EB] hover:bg-[#171A20] hover:-translate-y-0.5 tactile-press"
            >
              Workbench
            </a>
            <a
              href="/#about"
              onClick={(e) => handleSectionLink(e, 'about')}
              className="inline-flex min-h-[30px] items-center px-2.5 py-1 rounded-[4px] font-mono text-xs text-[#9A9DA6] hover:text-[#F2F0EB] hover:bg-[#171A20] hover:-translate-y-0.5 tactile-press"
            >
              Systems
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleSectionLink(e, 'contact')}
              className="inline-flex min-h-[30px] items-center px-2.5 py-1 rounded-[4px] font-mono text-xs text-[#9A9DA6] hover:text-[#F2F0EB] hover:bg-[#171A20] hover:-translate-y-0.5 tactile-press"
            >
              Contact
            </a>
          </div>

          {isHome && onChangeViewMode && (
            <div
              role="group"
              aria-label="Workspace view mode"
              className="flex items-center rounded-[5px] border border-[rgba(242,240,235,0.1)] bg-[#111317] p-0.5 gap-0.5"
            >
              {(
                [
                  { id: 'workbench', label: 'Desk' },
                  { id: 'graph', label: 'Graph' },
                  { id: 'list', label: 'Index' },
                ] as const
              ).map((item) => {
                const active = viewMode === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onChangeViewMode(item.id)}
                    className={[
                      'inline-flex min-h-[26px] items-center rounded-[3px] px-2.5 py-1 font-mono text-[11px] cursor-pointer hover:-translate-y-0.5 tactile-press',
                      active
                        ? 'bg-[#F2F0EB] text-[#08090B] font-semibold'
                        : 'text-[#9A9DA6] hover:text-[#F2F0EB]',
                    ].join(' ')}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

          {isHome && onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open command menu"
              className="inline-flex min-h-[30px] items-center gap-1.5 rounded-[4px] border border-[rgba(242,240,235,0.12)] bg-[#111317] px-2.5 py-1 font-mono text-[11px] text-[#9A9DA6] hover:text-[#F2F0EB] hover:border-[#F2F0EB]/40 hover:-translate-y-0.5 cursor-pointer tactile-press"
            >
              <CommandIcon className="w-3 h-3" aria-hidden="true" />
              <span>K</span>
            </button>
          )}
        </nav>

        {/* Mobile Controls (<768px) */}
        <div className="pointer-events-auto flex md:hidden items-center gap-2">
          {isHome && onChangeViewMode && (
            <button
              type="button"
              onClick={() =>
                onChangeViewMode(viewMode === 'graph' ? 'workbench' : 'graph')
              }
              className="min-h-[36px] rounded-[4px] bg-[#111317] border border-[rgba(242,240,235,0.12)] px-3 py-1.5 font-mono text-xs text-[#F2F0EB] tactile-press"
            >
              {viewMode === 'graph' ? 'Desk' : 'Graph'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            className="min-w-[38px] min-h-[38px] inline-flex items-center justify-center rounded-[4px] bg-[#111317] border border-[rgba(242,240,235,0.12)] p-2 text-[#F2F0EB] hover:border-[#5E8BFF] tactile-press"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-label="Mobile navigation menu"
          className="fixed inset-x-4 top-20 z-[250] rounded-[7px] workbench-window-active p-6 md:hidden animate-popover-in"
        >
          <nav className="flex flex-col divide-y divide-[rgba(242,240,235,0.08)] font-mono text-sm">
            <a
              href="/#work-graph"
              onClick={(e) => handleSectionLink(e, 'work-graph')}
              className="py-3.5 min-h-[44px] flex items-center justify-between text-[#F2F0EB] hover:text-[#5E8BFF]"
            >
              <span>Spatial Workbench</span>
              <ArrowUpRight className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
            </a>
            <a
              href="/#about"
              onClick={(e) => handleSectionLink(e, 'about')}
              className="py-3.5 min-h-[44px] flex items-center justify-between text-[#F2F0EB] hover:text-[#5E8BFF]"
            >
              <span>Selected Systems &amp; Profile</span>
              <ArrowUpRight className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
            </a>
            <a
              href="/#contact"
              onClick={(e) => handleSectionLink(e, 'contact')}
              className="py-3.5 min-h-[44px] flex items-center justify-between text-[#F2F0EB] hover:text-[#5E8BFF]"
            >
              <span>Direct Channels</span>
              <ArrowUpRight className="w-4 h-4 text-[#9A9DA6]" aria-hidden="true" />
            </a>
          </nav>

          <div className="mt-4 pt-4 border-t border-[rgba(242,240,235,0.08)] flex flex-wrap gap-4">
            {CONTACTS.slice(0, 4).map((c) => (
              <a
                key={c.platform}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="min-h-[32px] inline-flex items-center font-mono text-xs text-[#9A9DA6] hover:text-[#F2F0EB]"
              >
                {c.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
