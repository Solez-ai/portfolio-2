import { useCallback, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/portfolio/Header";
import { Bio } from "@/components/portfolio/Bio";
import { SocialCards } from "@/components/portfolio/SocialCards";
import { Skills } from "@/components/portfolio/Skills";
import { WorkExperience } from "@/components/portfolio/WorkExperience";
import { Contributions } from "@/components/portfolio/Contributions";
import { Projects } from "@/components/portfolio/Projects";
import { Uses } from "@/components/portfolio/Uses";
import { LetsConnect } from "@/components/portfolio/LetsConnect";
import { Footer } from "@/components/portfolio/Footer";
import { Cursor } from "@/components/portfolio/Cursor";
import { LockScreen } from "@/components/splash/LockScreen";
import SideRays from "@/components/splash/SideRays";

export const Route = createFileRoute("/")({ component: Index });

const SECTIONS = [
  Header,
  Bio,
  SocialCards,
  Skills,
  WorkExperience,
  Contributions,
  Projects,
  Uses,
  LetsConnect,
  Footer,
];

function Index() {
  const [unlocked, setUnlocked] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Physics-coupled live reveal of portfolio underneath the rising LockScreen (zero React re-renders)
  const handleLockProgress = useCallback((p: number) => {
    const el = contentRef.current;
    if (!el) return;
    if (p >= 0.999) {
      el.style.transform = "";
      el.style.opacity = "1";
      el.style.willChange = "auto";
      return;
    }
    const scale = 0.94 + p * 0.06;
    const translateY = (1 - p) * 20;
    const opacity = 0.25 + p * 0.75;
    el.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    el.style.opacity = opacity.toFixed(3);
  }, []);

  const handleUnlock = useCallback(() => {
    const el = contentRef.current;
    if (el) {
      el.style.transform = "";
      el.style.opacity = "1";
      el.style.willChange = "auto";
    }
    setUnlocked(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <LockScreen onProgress={handleLockProgress} onUnlock={handleUnlock} />

      {/* Mount WebGL SideRays only after unlock so it never burns GPU behind the LockScreen */}
      {unlocked && (
        <div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden animate-fade-up"
          style={{ animationDuration: "0.9s" }}
        >
          <SideRays
            speed={3}
            rayColor1="#FBBF24"
            rayColor2="#60A5FA"
            intensity={2.5}
            spread={3.5}
            origin="top-right"
            tilt={-3}
            saturation={1.5}
            blend={0.55}
            falloff={0.8}
            opacity={0.5}
          />
        </div>
      )}

      <Cursor />
      <div
        ref={contentRef}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 origin-top"
        style={
          unlocked
            ? undefined
            : {
                transform: "translate3d(0, 20px, 0) scale(0.94)",
                opacity: 0.25,
                willChange: "transform, opacity",
              }
        }
      >
        {SECTIONS.map((Comp, i) => (
          <div key={i}>
            <Comp />
          </div>
        ))}
      </div>
    </main>
  );
}
