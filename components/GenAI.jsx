'use client';
import { Section, Reveal, TiltCard, Eyebrow } from './primitives';
import { logEvent } from '@/lib/telemetry';

/* ============ sys/composition — architectural methodology ============ */

const FRAMEWORKS = [
  {
    h: 'Token-budget engineering',
    m: 'context is a resource, not a dumping ground',
    p: 'Every context window gets a budget: what earns its tokens, what gets summarized, what gets retrieved on demand. Systems designed this way stay fast and cheap at the hundredth integration, not just the demo.',
  },
  {
    h: 'Deterministic routing over stochastic outputs',
    m: 'the model proposes, the architecture disposes',
    p: 'Typed contracts, schema validation, and rule-based triage wrap every model call. The LLM is a component with a failure rate — the routing layer is what makes the workflow accurate, auditable, and sub-second.',
  },
  {
    h: 'Deterministic multi-agent state',
    m: 'planner + crew · replayable by design',
    p: 'Agent hand-offs run through explicit state machines, not vibes-based message passing. Every decision point is persisted and replayable — the same discipline that makes payment flows survivable makes agent crews debuggable.',
  },
  {
    h: 'Real-time semantic caching',
    m: 'the fastest inference is the one never run',
    p: 'Meaning-level cache keys, hit-rate evaluation, and injection points chosen architecturally — before the router, after retrieval. Shipped in my own multi-provider cascade with cost-aware fallback routing.',
  },
];

export function Composition() {
  return (
    <Section id="composition" chapter="composition">
      <Reveal>
        <Eyebrow>sys/composition</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          I build resilient
          <br />
          <span className="text-dim">intelligence layers.</span>
        </h2>
        <p className="max-w-[680px] text-mute text-lg">
          By engineering deterministic routing mechanisms over stochastic model outputs, I
          keep enterprise workflows{' '}
          <b className="text-mist font-medium">accurate, auditable, and sub-second rapid</b>.
          The constellation forming behind this text is the mental model: autonomous parts,
          composed boundaries, one system.
        </p>
      </Reveal>
      <div className="mt-12 grid md:grid-cols-2 gap-5">
        {FRAMEWORKS.map((c, i) => (
          <Reveal key={c.h} delay={0.08 * i}>
            <TiltCard max={6}>
              <div
                onMouseEnter={() => logEvent('framework.inspect', c.h.toLowerCase())}
                className="rounded-[14px] border hairline bg-ink/70 backdrop-blur-md p-6 h-full"
              >
                <h5 className="font-disp font-medium text-[20px]">{c.h}</h5>
                <span className="font-mono text-[10px] text-amber tracking-[0.08em] block mt-1 mb-3">
                  // {c.m}
                </span>
                <p className="text-[14.5px] text-mute">{c.p}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
