import React, { useEffect, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion/engine';

interface WitnessPeekIntroProps {
  onComplete: () => void;
}

/**
 * Stark monochrome optical-slit curtain reveal (<= 0.9s).
 * Parts horizontally into the Spatial Workbench with zero neon blur or shader bloat.
 */
export const WitnessPeekIntro: React.FC<WitnessPeekIntroProps> = ({
  onComplete,
}) => {
  const [stage, setStage] = useState<'focus' | 'slit' | 'open'>('focus');

  useEffect(() => {
    if (prefersReducedMotion()) {
      onComplete();
      return;
    }

    const t1 = window.setTimeout(() => setStage('slit'), 220);
    const t2 = window.setTimeout(() => setStage('open'), 600);
    const t3 = window.setTimeout(() => onComplete(), 900);

    const handleKeySkip = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeySkip);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.removeEventListener('keydown', handleKeySkip);
    };
  }, [onComplete]);

  return (
    <div
      id="loader"
      role="status"
      aria-label="Opening workbench"
      onClick={onComplete}
      className="fixed inset-0 z-[1000] pointer-events-auto cursor-pointer select-none overflow-hidden"
    >
      {/* Top Aperture Shutter */}
      <div
        style={{
          transition: 'transform 340ms cubic-bezier(0.77, 0, 0.175, 1)',
          transform: stage === 'open' ? 'translateY(-102%)' : 'translateY(0%)',
        }}
        className="absolute inset-x-0 top-0 h-1/2 bg-[#08090B] border-b border-[rgba(242,240,235,0.14)] flex items-end justify-center pb-5 md:pb-6"
      >
        <div
          style={{
            fontFamily: 'var(--f-display)',
            transition: 'opacity 180ms ease-out, transform 240ms cubic-bezier(0.23, 1, 0.32, 1)',
            opacity: stage === 'open' ? 0 : 1,
            transform: stage === 'focus' ? 'translateY(4px)' : 'translateY(0px)',
          }}
          className="text-[clamp(2.5rem,7.5vw,6.25rem)] font-semibold tracking-[-0.045em] leading-[0.86] text-[#F2F0EB]"
        >
          WITNESS
        </div>
      </div>

      {/* Bottom Aperture Shutter */}
      <div
        style={{
          transition: 'transform 340ms cubic-bezier(0.77, 0, 0.175, 1)',
          transform: stage === 'open' ? 'translateY(102%)' : 'translateY(0%)',
        }}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#08090B] border-t border-[rgba(242,240,235,0.14)] flex items-start justify-center pt-5 md:pt-6"
      >
        <div
          style={{
            fontFamily: 'var(--f-display)',
            transition: 'opacity 180ms ease-out, transform 280ms cubic-bezier(0.23, 1, 0.32, 1)',
            opacity: stage === 'focus' ? 0.32 : stage === 'open' ? 0 : 1,
            transform: stage === 'focus' ? 'translateY(-4px)' : 'translateY(0px)',
          }}
          className="text-[clamp(2.5rem,7.5vw,6.25rem)] font-semibold tracking-[-0.045em] leading-[0.86] text-[#F2F0EB]"
        >
          PEEK
        </div>
      </div>

      {/* Horizontal Optical Razor Hairline */}
      <div
        aria-hidden="true"
        style={{
          transition:
            'transform 300ms cubic-bezier(0.23, 1, 0.32, 1), opacity 220ms ease-out',
          transform:
            stage === 'focus'
              ? 'scaleX(0.18)'
              : stage === 'slit'
                ? 'scaleX(1)'
                : 'scaleX(1.05)',
          opacity: stage === 'open' ? 0 : 1,
        }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#5E8BFF]"
      />

      {/* Quiet Skip Hint */}
      <span
        style={{ opacity: stage === 'open' ? 0 : 0.65 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-tight text-[#9A9DA6] transition-opacity duration-150"
      >
        SOLEZ WORKBENCH · Click to enter
      </span>
    </div>
  );
};
