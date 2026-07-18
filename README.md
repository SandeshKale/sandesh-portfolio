# sandesh-kale-portfolio · v2

Next.js 14 (App Router) · Tailwind CSS · Framer Motion · React Three Fiber

An interactive portfolio built as a self-instrumenting system: a live telemetry
console logs the visitor's session, the career renders as a distributed trace,
and a 3D message-sphere carries the hero.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (e.g. `SandeshKale/portfolio`).
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework preset auto-detects **Next.js** — no config needed. Deploy.
4. Optional: add a custom domain under **Settings → Domains**.

Or from the CLI: `npx vercel` in this directory.

## Structure

```
app/
  layout.jsx        fonts (Clash Display, Satoshi, JetBrains Mono), metadata
  page.jsx          page assembly + scroll-depth telemetry
  globals.css       design tokens, grain, shared classes
components/
  Hero.jsx          scroll-parallax hero content
  Hero3D.jsx        R3F scene: 380-node message sphere, packets in flight,
                    pointer parallax, scroll-driven camera dolly
  Thesis.jsx        scroll-linked word-by-word reveal of the thesis
  Principles.jsx    five engineering laws, hover-instrumented
  Trace.jsx         career as a distributed trace — bars grow with scroll
  Topology.jsx      interactive platform architecture, 3D unfold on scroll
  Sections.jsx      Stack, AI (3D tilt cards), Leadership, Now, Contact, Footer
  Telemetry.jsx     the signature: live session console (bottom-left, ≥md)
  Cursor.jsx        magnetic custom cursor (fine pointers only)
  Nav.jsx           scroll progress bar + blur-on-scroll
lib/
  telemetry.js      pub/sub event bus feeding the console
```

## Scroll-driven behaviors

- Nav progress bar: `useScroll` → `scaleX`
- Hero: content parallax + fade; 3D camera dollies back as you descend
- Thesis: words illuminate in sync with scroll position
- Trace: span bars grow across their own scroll ranges
- Topology: diagram unfolds from a 24° 3D tilt into place
- Contact: headline rises into view

## Accessibility & performance

- `prefers-reduced-motion` disables the 3D scene, cursor, and tilt effects
- Keyboard focus visible everywhere; topology nodes are tabbable
- Three.js is dynamically imported (`ssr: false`) — it never blocks first load
- DPR capped at 1.8; packet/point counts tuned for 60fps on mid-range hardware

## Content sources

Copy is drawn from the owner's LinkedIn export (headline, summary, positions,
certifications) — Positions.csv dates drive the trace geometry. When the second
half of the export arrives (posts/articles), a `sys/writing` section can cluster
recurring themes from published posts.
