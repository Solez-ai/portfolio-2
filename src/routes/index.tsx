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

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <Cursor />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <Header />
        <Bio />
        <SocialCards />
        <QuickLinks />
        <Skills />
        <WorkExperience />
        <Contributions />
        <Projects />
        <Uses />
        <LetsConnect />
        <Footer />
      </div>
    </main>
  );
}
