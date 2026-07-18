# sandesh-kale-portfolio · v3 — GenAI Solutions Architect

Next.js 14 (App Router) · Tailwind CSS · Framer Motion · React Three Fiber · GSAP ScrollTrigger · Groq

"The Architecture of Thought": a single fixed full-viewport 3D scene runs behind
the whole page and morphs through four states as GSAP ScrollTrigger conducts it —
crystalline core (hero) → agent constellation (composition) → neural pipelines
(observability) → obsidian monolith (contact). A live telemetry console traces the
visitor's session; a Groq-powered terminal answers questions grounded in the real
career record and compiles the visitor's own telemetry into an SRE-style
post-session review.

Scene phase state is bridged from GSAP (DOM) to R3F (WebGL) through a shared
mutable ref (`lib/scrollPhase.js`) — zero React re-renders on scroll. Instanced
meshes for constellations/packets/gutters; automatic performance tiering (DPR,
instance counts, transmission materials) by device class; `prefers-reduced-motion`
disables the scene entirely.

Deploy note: set `GROQ_API_KEY` in Vercel → Settings → Environment Variables.

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
