export const metadata = { title: 'How this site works — Sandesh Kale' };

export default function Blueprint() {
  return (
    <main className="max-w-[760px] mx-auto px-6 py-24">
      <a href="/" className="font-mono text-[11px] tracking-[0.08em] text-mute hover:text-amber transition-colors">
        ← back to the observatory
      </a>
      <h1 className="font-disp font-medium tracking-tight text-[clamp(32px,5vw,52px)] mt-6 mb-3">
        sys/blueprint
      </h1>
      <p className="text-mute text-lg mb-10">
        How this site works — the portfolio, documented like one of my systems. Because a
        GenAI architect&apos;s portfolio should survive its own architecture review.
      </p>

      {[
        ['The stack', 'Next.js 14 (App Router) on Vercel. Tailwind with a CSS-variable palette so dark and light are true themes, not filters. Framer Motion for DOM choreography, GSAP ScrollTrigger for scroll direction, React Three Fiber for the WebGL layer. One Groq-backed API route for all AI features.'],
        ['The scroll → scene bridge', 'GSAP watches the DOM sections and writes a target phase (0–3) into a shared mutable ref. The R3F render loop damps toward it every frame. No React re-renders on scroll — the DOM world and the WebGL world communicate through one object.'],
        ['The four phases', 'Crystalline core (hero) → agent constellation with a cursor gravity-well and periodic inference pulses (composition) → a rolling timeline wireframe that rushes with your scroll velocity (milestones) → an obsidian monolith with cursor inertia (contact). All instanced meshes; displacement is cheap trig noise in vertex shaders.'],
        ['Performance tiering', 'Device class is detected once: DPR caps, instance counts, and glass-transmission materials all downgrade on mobile or weak hardware. prefers-reduced-motion disables the scene, boot sequence, and kinetic type entirely — the reduced version is a first-class layout, not an apology.'],
        ['The AI subsystems', 'Every model call goes through one server route; the key never reaches the browser. Three modes — grounded Q&A, sandbox config review, and the Architecture Consult, which is schema-constrained to a typed JSON contract and validated client-side before rendering. Rate-limited per visitor. The structured output IS the demonstration.'],
        ['Honesty constraints', 'Every claim on this site traces to the verified record: LinkedIn export, public repos, commit counts. The chaos-mode demo, the estimator, and the sandbox label their models as illustrative. No invented metrics, no fabricated testimonials.'],
        ['Cost', 'Vercel hobby tier + Groq free tier + a domain. The most expensive component is taste.'],
      ].map(([h, p]) => (
        <section key={h} className="mb-8">
          <h2 className="font-mono text-[11px] tracking-[0.12em] text-amber uppercase mb-2">{h}</h2>
          <p className="text-mute text-[15.5px] leading-[1.75]">{p}</p>
        </section>
      ))}

      <p className="font-mono text-[10.5px] text-dim tracking-[0.05em] mt-12">
        // source: github.com/SandeshKale/sandesh-portfolio
      </p>
    </main>
  );
}
