import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { window.location.reload(); }}
            className="inline-flex items-center justify-center rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: "Samin Yeasar (SOLEZ) — Full Stack Developer & Solo Founder | Solez-ai | solez.ai" },
      { name: "description", content: "Full Stack Developer by Samin Yeasar (a.k.a. SOLEZ, Solez-ai, SOLEZ-AI, solez.ai) — solo founder building MentorMind, introducing a new culture of help to Bangladesh. Specializing in React, TypeScript, Rust, and modern web development." },
      { name: "keywords", content: "Samin Yeasar, SOLEZ, Solez-ai, SOLEZ-AI, solez.ai, Full Stack Developer, MentorMind, React, TypeScript, Rust, Web Developer, Bangladesh, Solo Founder" },
      { name: "author", content: "Samin Yeasar" },
      { property: "og:title", content: "Samin Yeasar — Full Stack Developer & Solo Founder" },
      { property: "og:description", content: "Full Stack Developer and solo founder building MentorMind — introducing a new culture of help to Bangladesh." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://solez.vercel.app" },
      { property: "og:image", content: "https://solez.vercel.app/og.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Samin Yeasar — Full Stack Developer & Solo Founder" },
      { name: "twitter:description", content: "Full Stack Developer and solo founder building MentorMind." },
      { name: "twitter:image", content: "https://solez.vercel.app/og.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
    ],
    links: [
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=VT323&display=swap" },
      { rel: "canonical", href: "https://solez.vercel.app" },
      { rel: "alternate", href: "https://solez.mentormind.bd" },
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
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Samin Yeasar",
              alternateName: "Solez-ai (SOLEZ / SOLEZ-AI / solez.ai)",
              url: "https://solez.vercel.app",
              jobTitle: "Full Stack Developer & Solo Founder",
              description: "Full Stack Developer and solo founder (SOLEZ) building MentorMind — introducing a new culture of help to Bangladesh.",
              knowsAbout: [
                "React",
                "TypeScript",
                "Rust",
                "Next.js",
                "Tailwind CSS",
                "PostgreSQL",
                "Supabase",
                "Node.js"
              ],
              sameAs: [
                "https://solez.mentormind.bd",
                "https://solez.vercel.app",
                "https://github.com/Solez-ai",
                "https://x.com/Solez_None",
                "https://www.linkedin.com/in/solez-ai/",
                "https://www.instagram.com/solez.ai"
              ],
              alumniOf: "Solven.ai",
              affiliation: {
                "@type": "Organization",
                name: "MentorMind"
              },
              mainEntityOfPage: {
                "@type": "WebSite",
                "@id": "https://solez.vercel.app",
                name: "Samin Yeasar — Portfolio",
                description: "Full Stack Developer and solo founder building MentorMind."
              }
            })
          }}
        />
      </head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
