# SOLEZ Portfolio — Design Directions

## Three Possible Approaches

### 1. Constellation Constructivism
**Very Brief Intro:** A digital Bauhaus composition where technical projects become a rising constellation of geometric forms, sharp colour blocks, and editorial scale. It turns a software portfolio into an authored visual manifesto.

**Probability:** 0.07

### 2. Studio Ledger
**Very Brief Intro:** A restrained, almost archival developer journal, built from annotated project plates and typographic specimen sheets. The mood is methodical, studious, and quietly confident.

**Probability:** 0.04

### 3. Signal Workshop
**Very Brief Intro:** An energetic, tool-bench-inspired interface that treats every project like a tactile instrument panel. Bright functional colours and hard edges make engineering feel physical and immediate.

**Probability:** 0.09

---

## Chosen Direction: Constellation Constructivism

### Design Movement

**Bauhaus Constructivism**, translated into a premium contemporary editorial website. The portfolio is an asymmetric poster sequence: technical work and founder identity are composed as a constellation rather than arranged in a conventional product grid.

### Core Principles

1. **Built, never decorated:** every visual element resolves to a purposeful square, circle, line, or triangle.
2. **Bold hierarchy:** enormous, tightly tracked headlines create poster-scale rhythm; calm body copy makes the work legible.
3. **Functional contrast:** primary colour blocks signal shifts in content and guide navigation, while black borders and hard shadows make structure explicit.
4. **Asymmetric balance:** overlapping modules, unexpected offsets, and cropped shapes create tension without sacrificing usability.

### Color Philosophy

The site begins on **off-white paper** to make ideas feel printed and authored. **Cobalt blue** is the ownable technical signal, used for systems thinking and deep work. **Signal red** carries urgency, making action and founding ambition visible. **Bauhaus yellow** sparks optimistic emphasis. Stark black grounds every layer, so the vivid palette feels disciplined rather than decorative.

### Layout Paradigm

The home page is a **vertical exhibition route**: a split hero with an editorial nameplate and portrait, a colour-blocked skills ledger, a staggered project gallery with deliberately varied card spans, a career timeline treated as a connected route, and a contact workshop at the end. Major content is never trapped in a centered, uniform card grid.

### Signature Elements

1. **Orbit marks:** repeated tiny circles, lines, and registration dots suggest a constellation moving through technical space.
2. **Project plates:** each project gets a strongly bordered visual plate with a cropped asset, a numbered prefix, and a coloured geometry marker.
3. **Hard-offset layers:** deliberate 4–8px black shadows imply the literal stacking of printed forms.

### Interaction Philosophy

Interaction is decisive and mechanical. Buttons press down and cards shift upward like placed paper blocks. Navigation scrolls to named stations in the portfolio route. External project links are clearly marked, keyboard accessible, and never concealed behind gesture-only interactions.

### Animation

Motion is intentionally sparse and geometric. On initial view, headline lines, portrait framing, and project plates reveal in a quick stagger using opacity and short translations only. Hover states operate in 160–220ms with hard shifts, not floaty effects. The ambient orbit marks do not animate continuously. All non-essential movement respects `prefers-reduced-motion`.

### Typography System

**Outfit** anchors display type, using black 900-weight uppercase text with a compressed feeling and tight tracking. **DM Mono** provides the technical counterpoint for labels, indices, technology lists, and navigation. Display headlines may break across unexpected lines; body copy retains a generous reading measure and relaxed leading.

### Brand Essence

**SOLEZ is an independent full-stack founder’s portfolio for people who value technical depth, open-source craft, and products that move culture forward.**

**Personality:** rigorous, kinetic, human.

### Brand Voice

Headlines are declarative, concise, and built from verbs and concrete nouns. CTAs sound like invitations into the work, not generic conversion prompts. Microcopy is exact and useful.

> “BUILDING TOOLS THAT MAKE HELP MORE HUMAN.”

> “OPEN A PROJECT PLATE →”

### Wordmark & Logo

The wordmark is a custom typographic **SOLEZ/** lock-up set in black Outfit with a slash used as a structural divider. The standalone mark is an interlocking cobalt circle, red bar, and yellow triangular cut-out: a compact upward constellation that hints at an S without relying on a literal letterform.

### Signature Brand Color

**SOLEZ Cobalt — #1040C0.** It is the site’s technical signal: deep enough to feel credible, vivid enough to be recognized across project plates, interactions, and the logo mark.

## Style Decisions

The large stacked display words, including `MENTOR / MIND`, retain their constructivist density but gain modest positive letter spacing and a little more leading. This makes the letterforms feel more deliberate and materially placed, particularly on compact screens.

The hero’s personal identity layer becomes more immediate: GitHub, LinkedIn, X, Instagram, and email appear as an integrated contact rail beside the introductory statement. The QR treatment is removed in favour of a clearer, link-led contact composition.

The Fälschen affiliation uses the official publicly served anvil emblem and is framed as a co-founder role in a two-person research team exploring robotics, physics, and AI. Its visual language is adapted to the SOLEZ system without imitating or redrawing the source brand.

The GitHub section uses the public `Solez-ai` events API at runtime. It is explicitly labelled as public push activity, and its 42-cell matrix is treated as an ambient constructivist signal rather than a claim of complete private contribution history.

## Motion Decisions

Motion behaves like a printed exhibition being assembled. Major stations reveal in quick, offset stages; project plates arrive on an angled track; and individual technical components resolve from a small positional shift rather than floating or fading generically. The active navigation state follows the station currently passing through the reader’s focus area.

The constellation language gains movement through a travelling route node, the MentorMind orbital mark, and the public GitHub matrix’s active cells. Continuous motion is limited, deliberately paced, and never used as a substitute for hierarchy. All visual movement uses transform and opacity, is gated by reduced-motion preferences, and remains secondary to readable content and link interaction.

### Loading Sequence

The first visit opens with a brief **construction card** rather than a generic spinner. The SOLEZ mark locks into place while a cobalt circle, red structural bar, and yellow triangular plane assemble on the printed-paper field. A mono status line reads as a technical boot signal, a segmented route line resolves, and the overlay lifts away to reveal the first portfolio station. The interaction can be skipped, and reduced-motion settings shorten it to a near-instant handoff.
