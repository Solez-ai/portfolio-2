import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/portfolio/Header";
import { Bio } from "@/components/portfolio/Bio";
import { SocialCards } from "@/components/portfolio/SocialCards";
import { QuickLinks } from "@/components/portfolio/QuickLinks";
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
  QuickLinks,
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
  const staggerBase = unlocked ? 0 : 9999; // 9999 = effectively infinite delay

  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <LockScreen onUnlock={() => { setUnlocked(true); window.scrollTo(0, 0); }} />

      {/* SideRays */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
        style={{ opacity: unlocked ? 1 : 0, transition: "opacity 1.2s ease-out" }}
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

      <Cursor />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {SECTIONS.map((Comp, i) => (
          <div
            key={i}
            className={unlocked ? "stagger-item" : "opacity-0 translate-y-4"}
            style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
          >
            <Comp />
          </div>
        ))}
      </div>
    </main>
  );
}
