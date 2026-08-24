/**
 * Constellation Constructivism — SOLEZ portfolio page.
 * Bauhaus geometry, hard-offset layers, and a public GitHub signal frame a founder-led body of work.
 */
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  MoveRight,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const assets = {
  avatar: "/manus-storage/avatar-BGvGc5p-_d7aa1e6f.jpg",
  mentorMind: "/manus-storage/mentormind-Cyu8EyIx_d3d4d546.png",
  dragWin: "/manus-storage/proj-3dragwin-Ddo0AT6L_126a3e7f.png",
  nodex: "/manus-storage/proj-nodex-EEd-03-i_34687fb6.png",
  pySketch: "/manus-storage/proj-pysketch-iSOhaQGs_2bebd439.png",
  urlPad: "/manus-storage/proj-urlpad-Bb5P0A9a_bbe3b03b.png",
  vell: "/manus-storage/proj-vell-BpHkJlB6_f52ff9a1.png",
  solven: "/manus-storage/solvenai-2Dmhfokv_45304f09.png",
  falschen: "/manus-storage/falschen-anvil_0bdd9a9b.svg",
  heroArt: "/manus-storage/solez-hero-constellation_a440490c.jpg",
  architectureArt: "/manus-storage/solez-architectural-grid_cd3e0f12.jpg",
  systemsArt: "/manus-storage/solez-systems-poster_5eca1c3c.jpg",
  workshopArt: "/manus-storage/solez-workshop-texture_4ff0a0e7.jpg",
  mark: "/manus-storage/solez-geometric-mark_b02a782c.png",
};

const projects = [
  { number: "01", name: "Nodex", tagline: "SEE STRUCTURED DATA THINK.", description: "A browser-native data visualization and intelligence platform for exploring pasted or uploaded structured data as interactive graphs and trees.", tags: ["React", "Data Viz", "Browser-native"], image: assets.nodex, live: "https://nodex-launch.vercel.app", github: "https://github.com/Solez-ai/nodex", tone: "blue", feature: true },
  { number: "02", name: "PySketch", tagline: "DRAW THE IDEA. RUN THE CODE.", description: "A visual programming platform that transforms freehand sketches into executable Python Turtle graphics.", tags: ["Python", "Turtle", "Creative code"], image: assets.pySketch, live: "https://py-sketch.vercel.app/", github: "https://github.com/Solez-ai/PySketch", tone: "red", feature: false },
  { number: "03", name: "Vell", tagline: "WRITE WITH COMPILER-GRADE CLARITY.", description: "A reactive document markup language combining Markdown readability with LaTeX-level expressive power, deterministic ASTs, and HTML or PDF output.", tags: ["Language design", "LSP", "MathML"], image: assets.vell, live: "https://vell.mintlify.site", github: "https://github.com/Solez-ai/Vell", tone: "yellow", feature: false },
  { number: "04", name: "URLPad", tagline: "NOTES THAT TRAVEL LIGHT.", description: "A minimalist text editor that stores its entire document in the URL hash—private, portable, and instantly shareable.", tags: ["Web platform", "Privacy", "Minimalism"], image: assets.urlPad, live: "https://url-pad.vercel.app/", github: "https://github.com/Solez-ai/url-pad", tone: "ink", feature: false },
  { number: "05", name: "3 Drag Win", tagline: "MOVE WINDOWS. KEEP FLOW.", description: "A Windows utility for three-finger touchpad window dragging, built with Rust, C++, and WinAPI for native low-latency interaction.", tags: ["Rust", "C++", "WinAPI"], image: assets.dragWin, github: "https://github.com/Solez-ai/3-drag-win", tone: "green", feature: false },
];

const skillGroups = [
  ["Frontend", "React · Next.js · TypeScript · JavaScript · HTML/CSS · Tailwind"],
  ["Backend", "Node.js · Python · Rust · Supabase · Firebase · PostgreSQL"],
  ["Cloud", "Docker · AWS · GCP · Vercel · Git"],
  ["Explorations", "C++ · WebAssembly · VS Code Extension API"],
];

const navLinks = [["WORK", "#work"], ["METHOD", "#method"], ["STORY", "#story"], ["CONTACT", "#contact"]];

const CONTRIBUTION_MONTHS = ["JUL", "AUG", "SEP", "OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
type ContributionDay = { date: string; count: number; level: number };
type ContributionResponse = { total: Record<string, number>; contributions: ContributionDay[] };

function ProjectLink({ href, label, icon = "external" }: { href: string; label: string; icon?: "external" | "github" }) {
  return <a className="project-link" href={href} target="_blank" rel="noreferrer">{icon === "github" ? <Github size={15} strokeWidth={2.4} /> : <ExternalLink size={15} strokeWidth={2.4} />}<span>{label}</span></a>;
}

function GithubActivity() {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("https://github-contributions-api.jogruber.de/v4/Solez-ai?y=last")
      .then((response) => { if (!response.ok) throw new Error("GitHub events unavailable"); return response.json(); })
      .then((data: ContributionResponse) => {
        if (cancelled) return;
        setContributions(data.contributions.slice(-364));
        setTotal(data.total.lastYear ?? Object.values(data.total).reduce((sum, value) => sum + value, 0));
        setStatus("ready");
      })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, []);

  const cells = contributions.length === 364 ? contributions : Array.from({ length: 364 }, (_, index) => ({ date: `pending-${index}`, count: 0, level: 0 }));
  const activeDays = contributions.filter((day) => day.count > 0).length;
  const mostRecent = contributions.filter((day) => day.count > 0).at(-1);
  const statusLabel = status === "loading" ? "SYNCING FULL-YEAR SIGNAL" : status === "error" ? "FULL-YEAR SIGNAL UNAVAILABLE" : "FULL-YEAR CONTRIBUTION SIGNAL";

  return (
    <section className="github-section" id="github" data-reveal data-station="github" aria-labelledby="github-title">
      <div className="section-index section-index-dark">04 <span>THE PUBLIC TRACE</span></div>
      <div className="github-intro">
        <p className="eyebrow"><span className="eyebrow-dot" /> LIVE FROM GITHUB</p>
        <h2 id="github-title">THE BUILD<br />LEAVES <span>TRACES.</span></h2>
        <p>Every public contribution from the last year, rendered as a living technical signal for <strong>@Solez-ai</strong>.</p>
        <a className="project-link project-link-light" href="https://github.com/Solez-ai" target="_blank" rel="noreferrer"><Github size={15} /> TRACE @SOLEZ-AI</a>
      </div>
      <div className="github-board">
        <div className="github-board-head"><span>{statusLabel}</span><span>52 WEEK WINDOW</span></div>
        <div className="contribution-scroll" aria-label="Last-year GitHub contributions"><div className="contribution-months">{CONTRIBUTION_MONTHS.map((month) => <span key={month}>{month}</span>)}</div><div className="activity-grid activity-grid-year">{cells.map((cell) => <span className={`activity-cell level-${cell.level}`} key={cell.date} title={cell.date.startsWith("pending") ? "Loading contribution data" : `${cell.date}: ${cell.count} contributions`} />)}</div></div>
        <div className="github-metrics">
          <div><strong>{status === "ready" ? total : "—"}</strong><span>CONTRIBUTIONS</span></div>
          <div><strong>{status === "ready" ? activeDays : "—"}</strong><span>ACTIVE DAYS</span></div>
          <div><strong>{status === "ready" ? mostRecent?.date.slice(5) : "—"}</strong><span>LATEST ENTRY</span></div>
        </div>
        <p className="github-note">Source: public GitHub contributions endpoint. The full-year total and chart are supplied by the source service.</p>
      </div>
    </section>
  );
}

function SiteLoader({ isExiting, onSkip }: { isExiting: boolean; onSkip: () => void }) {
  return (
    <div className={`site-loader ${isExiting ? "is-exiting" : ""}`} role="status" aria-live="polite" aria-label="Assembling SOLEZ portfolio">
      <div className="loader-grid" aria-hidden="true" />
      <div className="loader-panel">
        <div className="loader-topline"><span>SOLEZ / BOOT 001</span><button onClick={onSkip}>SKIP INTRO <ArrowUpRight size={14} /></button></div>
        <div className="loader-stage" aria-hidden="true"><i className="loader-orb" /><i className="loader-bar" /><i className="loader-triangle" /><img className="loader-mark" src={assets.mark} alt="" /></div>
        <p className="loader-title">BUILD /<span>READY.</span></p>
        <div className="loader-progress" aria-hidden="true"><i /><i /><i /><i /></div>
        <p className="loader-status">ASSEMBLING PORTFOLIO STATIONS <span>◼</span></p>
      </div>
      <span className="loader-index">SYSTEM / PUBLIC / HUMAN</span>
    </div>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [activeStation, setActiveStation] = useState("top");
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [isLoaderExiting, setIsLoaderExiting] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitLoader = () => {
      setIsLoaderExiting(true);
      window.setTimeout(() => setIsLoaderVisible(false), reduceMotion ? 70 : 460);
    };
    const timer = window.setTimeout(exitLoader, reduceMotion ? 80 : 2300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaderVisible) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealed = document.querySelectorAll<HTMLElement>("[data-reveal]");
    document.documentElement.classList.add("motion-ready");

    if (reduceMotion) {
      revealed.forEach((element) => element.classList.add("is-revealed"));
      return () => document.documentElement.classList.remove("motion-ready");
    }

    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("is-revealed"); }),
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );
    const stationObserver = new IntersectionObserver(
      (entries) => {
        const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (current) setActiveStation(current.target.getAttribute("data-station") ?? "top");
      },
      { threshold: [0.18, 0.32, 0.5], rootMargin: "-26% 0px -56%" },
    );

    revealed.forEach((element) => revealObserver.observe(element));
    document.querySelectorAll<HTMLElement>("[data-station]").forEach((element) => stationObserver.observe(element));
    return () => { revealObserver.disconnect(); stationObserver.disconnect(); document.documentElement.classList.remove("motion-ready"); };
  }, [isLoaderVisible]);

  const skipLoader = () => {
    if (!isLoaderExiting) {
      setIsLoaderExiting(true);
      window.setTimeout(() => setIsLoaderVisible(false), 460);
    }
  };

  const closeMenu = () => {
    if (!isMenuOpen || isMenuClosing) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setIsMenuOpen(false);
      return;
    }
    setIsMenuClosing(true);
    window.setTimeout(() => { setIsMenuOpen(false); setIsMenuClosing(false); }, 240);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
      return;
    }
    setIsMenuClosing(false);
    setIsMenuOpen(true);
  };

  return (
    <div className="site-shell" data-active-station={activeStation}>
      {isLoaderVisible && <SiteLoader isExiting={isLoaderExiting} onSkip={skipLoader} />}
      <a className="skip-link" href="#main-content">Skip to portfolio content</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="SOLEZ home"><img src={assets.mark} alt="" /><span>SOLEZ<span className="wordmark-slash">/</span></span></a>
        <nav className="desktop-nav" aria-label="Primary navigation">{navLinks.map(([label, target]) => <a className={activeStation === target.slice(1) ? "is-active" : undefined} aria-current={activeStation === target.slice(1) ? "location" : undefined} key={label} href={target}>{label}</a>)}</nav>
        <button className="theme-toggle" onClick={() => toggleTheme?.()} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}<span>{theme === "dark" ? "LIGHT" : "DARK"}</span></button>
        <a className="header-resume" href="https://drive.google.com/file/d/19R008pQKPVudWaSHJMHDOymkIu571LFM/view?usp=sharing" target="_blank" rel="noreferrer">RESUME <ArrowUpRight size={15} strokeWidth={2.8} /></a>
        <button className={`menu-button ${isMenuOpen ? "is-open" : ""}`} aria-label={isMenuOpen ? "Close navigation" : "Open navigation"} onClick={toggleMenu}>{isMenuOpen ? <X size={23} /> : <Menu size={23} />}</button>
      </header>
      {isMenuOpen && <><button className={`mobile-nav-backdrop ${isMenuClosing ? "is-closing" : ""}`} aria-label="Close navigation" onClick={closeMenu} /><nav className={`mobile-nav ${isMenuClosing ? "mobile-nav-closing" : "mobile-nav-open"}`} aria-label="Mobile navigation">{navLinks.map(([label, target], index) => <a key={label} href={target} onClick={closeMenu}><span>0{index + 1}</span>{label}<ArrowDownRight size={20} /></a>)}</nav></>}

      <main id="main-content">
        <section className="hero" id="top" data-reveal data-station="top" aria-labelledby="hero-title">
          <div className="hero-art" aria-hidden="true"><img src={assets.heroArt} alt="" /></div>
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> INDEPENDENT FULL-STACK BUILDER</p>
            <h1 id="hero-title">BUILDING<br /><span>HELPFUL</span><br />THINGS.</h1>
            <div className="hero-bottomline">
              <p>Samin Yeasar — known as <strong>SOLEZ</strong>. Full Stack Developer, solo founder, open-source maker.</p>
              <div className="hero-actions">
                <a className="cta-button cta-red" href="#work">OPEN PROJECT PLATES <MoveRight size={18} /></a>
                <div className="hero-socials" aria-label="SOLEZ social links">
                  <a href="https://github.com/Solez-ai" target="_blank" rel="noreferrer"><Github size={15} /> GITHUB</a><a href="https://www.linkedin.com/in/solez-ai/" target="_blank" rel="noreferrer"><Linkedin size={15} /> LINKEDIN</a><a href="https://x.com/Solez_None" target="_blank" rel="noreferrer">X</a><a href="https://www.instagram.com/solez.ai" target="_blank" rel="noreferrer"><Instagram size={15} /> INSTAGRAM</a><a href="mailto:sheditzofficial918@gmail.com"><Mail size={15} /> EMAIL</a>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-portrait"><div className="portrait-label portrait-label-top">DHAKA / BANGLADESH</div><div className="portrait-frame"><img src={assets.avatar} alt="Portrait of Samin Yeasar" /></div><div className="portrait-label portrait-label-bottom">FOUNDER / ENGINEER / LEARNER</div></div>
          <div className="hero-index">SCROLL TO EXPLORE <ArrowDownRight size={19} /></div>
        </section>

        <section className="marquee-strip" aria-label="Technology and practice overview"><div className="marquee-track"><p className="marquee-text">REACT <span>✳</span> TYPESCRIPT <span>✳</span> RUST <span>✳</span> PYTHON <span>✳</span> SYSTEMS <span>✳</span> PEOPLE <span>✳</span></p><p className="marquee-text" aria-hidden="true">REACT <span>✳</span> TYPESCRIPT <span>✳</span> RUST <span>✳</span> PYTHON <span>✳</span> SYSTEMS <span>✳</span> PEOPLE <span>✳</span></p></div></section>

        <section className="mission-section" id="story" data-reveal data-station="story" aria-labelledby="mission-title">
          <div className="section-index">01 <span>THE PRACTICE</span></div>
          <div className="mission-manifesto"><p className="eyebrow">A BUILDER WITH A HUMAN TARGET</p><h2 id="mission-title">CODE IS A MATERIAL.<br /><span>CULTURE IS THE PRODUCT.</span></h2><p className="mission-lead">I build considered tools—from native Windows utilities to markup languages—and I am building MentorMind to introduce a new culture of help to Bangladesh.</p><div className="mission-actions"><a className="cta-button cta-blue" href="https://solez.mentormind.bd" target="_blank" rel="noreferrer">VISIT MENTORMIND <ArrowUpRight size={18} /></a><a className="text-link" href="https://github.com/Solez-ai" target="_blank" rel="noreferrer">FOLLOW THE COMMITS <Github size={17} /></a></div></div>
          <div className="architecture-plate"><img src={assets.architectureArt} alt="Abstract modernist geometric architectural composition" /><span className="plate-stamp">SOLEZ STUDIO<br />2026</span></div>
        </section>

        <section className="mentor-section" data-reveal aria-labelledby="mentor-title">
          <div className="mentor-brand-card"><div className="mentor-logo-wrap"><img src={assets.mentorMind} alt="MentorMind logo" /></div><p className="eyebrow">CO-FOUNDER &amp; CTO / 2026 →</p><h2 id="mentor-title">MENTOR<br />MIND</h2><p>A platform introducing a new culture of help to Bangladesh. I lead technology, product, and engineering.</p><a className="project-link project-link-light" href="https://solez.mentormind.bd" target="_blank" rel="noreferrer"><ExternalLink size={15} /> TRACE THE PLATFORM</a></div>
          <div className="mentor-detail"><p className="large-statement">WE GROW FASTER WHEN KNOWLEDGE CAN <em>MOVE</em>.</p><div className="mentor-orbit" aria-hidden="true"><span /><span /><span /></div><p className="mono-note">THE CURRENT MISSION<br />IS TO MAKE USEFUL HELP<br />EASIER TO FIND &amp; GIVE.</p></div>
        </section>

        <section className="falschen-section" data-reveal aria-labelledby="falschen-title">
          <div className="falschen-identity"><img src={assets.falschen} alt="Official Team Fälschen anvil emblem" /><span>TF / 002</span></div>
          <div className="falschen-copy"><p className="eyebrow">CO-FOUNDER / TEAM FÄLSCHEN</p><h2 id="falschen-title">FORGED<br /><span>TOGETHER.</span></h2><p>Part of Team Fälschen: a two-person research team working across robotics, physics, and AI to connect the physical world, human signals, and intelligent machines.</p><a className="cta-button cta-blue" href="https://falschen-z.vercel.app/" target="_blank" rel="noreferrer">TRACE TEAM FÄLSCHEN <ArrowUpRight size={18} /></a></div>
          <div className="falschen-spec"><span>TEAM / 02</span><span>STATUS / ALIGNED</span><span>ROBOTICS · PHYSICS · AI</span><div className="falschen-cross" aria-hidden="true"><i /><i /><i /></div></div>
        </section>

        <section className="skills-section" id="method" data-reveal data-station="method" aria-labelledby="skills-title">
          <div className="section-index section-index-dark">02 <span>THE TOOLKIT</span></div>
          <div className="skills-header"><h2 id="skills-title">A POLYGLOT<br /><span>BY NECESSITY.</span></h2><p>Tools are chosen for the problem, not for a profile. I move from interaction systems to infrastructure—and treat both as product work.</p></div>
          <div className="skills-list">{skillGroups.map(([name, contents], index) => <article className="skill-row" key={name}><span className="skill-number">0{index + 1}</span><h3>{name}</h3><p>{contents}</p><span className={`skill-shape skill-shape-${index}`} aria-hidden="true" /></article>)}</div>
          <div className="systems-poster"><img src={assets.systemsArt} alt="Constructivist systems map illustration" /></div>
        </section>

        <section className="work-section" id="work" data-reveal data-station="work" aria-labelledby="work-title">
          <div className="work-heading"><div className="section-index">03 <span>SELECTED SYSTEMS</span></div><h2 id="work-title">PROJECTS WITH<br /><span>PERSONALITY.</span></h2><p>Explorations in information, interaction, operating systems, language design, and quiet little tools that get out of the way.</p></div>
          <div className="project-gallery">{projects.map((project) => <article className={`project-card motion-plate ${project.feature ? "project-feature" : ""} project-${project.tone}`} key={project.name}><div className="project-visual"><img src={project.image} alt={`${project.name} product preview`} /><span className="project-number">{project.number}</span><span className="project-plate-label">PLATE / {project.number}</span><div className="project-rules" aria-hidden="true"><i /><i /><i /></div><div className="project-geometry" aria-hidden="true" /></div><div className="project-copy"><div className="project-title-line"><h3>{project.name}</h3><span>{project.tagline}</span></div><p>{project.description}</p><div className="project-meta"><div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="project-links">{project.live && <ProjectLink href={project.live} label="LIVE" />}<ProjectLink href={project.github} label="CODE" icon="github" /></div></div></div></article>)}</div>
        </section>

        <GithubActivity />

        <section className="route-section" data-reveal aria-labelledby="route-title">
          <div className="route-heading"><div className="section-index section-index-dark">05 <span>THE ROUTE</span></div><h2 id="route-title">LEARNING<br />IN PUBLIC.</h2></div>
          <div className="route-track"><article className="route-stop route-stop-blue"><span className="route-year">2025</span><img src={assets.solven} alt="SolvenAI logo" /><h3>JUNIOR WEB<br />DEVELOPER</h3><p>Solven.ai<br />6 months</p></article><div className="route-line" aria-hidden="true"><span /><span /><span /></div><article className="route-stop route-stop-red"><span className="route-year">2026</span><div className="route-mark"><img src={assets.mentorMind} alt="" /></div><h3>CO-FOUNDER<br />&amp; CTO</h3><p>MentorMind<br />Present</p></article></div>
        </section>

        <section className="contact-section" id="contact" data-reveal data-station="contact" aria-labelledby="contact-title">
          <img className="contact-background" src={assets.workshopArt} alt="" />
          <div className="contact-copy"><p className="eyebrow"><span className="eyebrow-dot" /> AVAILABLE FOR THE RIGHT CONVERSATION</p><h2 id="contact-title">LET’S MAKE<br /><span>SOMETHING<br />USEFUL.</span></h2><a className="contact-email" href="mailto:sheditzofficial918@gmail.com">sheditzofficial918@gmail.com <ArrowUpRight size={24} /></a></div>
          <div className="contact-details"><span>PROJECT / COLLAB / RESEARCH</span><p>MentorMind<br />Team Fälschen<br />Open source systems</p><a href="https://github.com/Solez-ai" target="_blank" rel="noreferrer">GITHUB / SOLEZ-AI <ArrowUpRight size={15} /></a></div>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-brand"><img src={assets.mark} alt="" /><span>SOLEZ<span>/</span></span></div><p>BUILT FROM DHAKA WITH INTENT.</p><div className="social-links"><a href="https://github.com/Solez-ai" target="_blank" rel="noreferrer">GITHUB <Github size={14} /></a><a href="https://www.linkedin.com/in/solez-ai/" target="_blank" rel="noreferrer">LINKEDIN <Linkedin size={14} /></a><a href="https://x.com/Solez_None" target="_blank" rel="noreferrer">X / TWITTER <ArrowUpRight size={14} /></a><a href="mailto:sheditzofficial918@gmail.com">EMAIL <Mail size={14} /></a></div></footer>
    </div>
  );
}
