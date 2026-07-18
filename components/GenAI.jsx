'use client';
import { Section, Reveal, TiltCard } from './primitives';
import { logEvent } from '@/lib/telemetry';

/* ============ sys/composition — the constellation section ============ */
const PATTERNS = [
  {
    h: 'Architect / Crew split',
    m: 'planner + execution layers',
    p: 'A frontier model plans; fast, cheap models execute. I design the split — which decisions deserve deep reasoning, which deserve latency — with typed contracts between the layers so the crew can be swapped without rewiring the system.',
  },
  {
    h: 'Multi-provider cascades',
    m: 'fallback chains · cost-aware routing',
    p: 'Built and shipped: LLM cascades with structured-output contracts, automatic failover across providers, and routing that weighs cost against capability per call. Treated with the same rigor as a payment flow, because in BFSI it is one.',
  },
  {
    h: 'Retrieval & context',
    m: 'hybrid search · dynamic graph rag',
    p: 'Vector infrastructure designed for throughput: hybrid dense-plus-keyword retrieval, graph-shaped context for entangled enterprise data, and context-window budgeting so the model reads what matters — not everything.',
  },
  {
    h: 'Guardrails & evals',
    m: 'the boring parts that ship',
    p: 'Automated evaluation harnesses, output validation, refusal boundaries, and audit trails. Alignment for enterprises is an engineering discipline: measured, versioned, and observable — never vibes.',
  },
];

export function Composition() {
  return (
    <Section id="composition" chapter="composition">
      <Reveal>
        <div className="eyebrow">sys/composition</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Multi-agent systems.
          <br />
          <span className="text-dim">Composed, not improvised.</span>
        </h2>
        <p className="max-w-[640px] text-mute text-lg">
          The core you just watched pull apart is the point: intelligence at scale is an
          architecture problem.{' '}
          <b className="text-mist font-medium">
            Orchestration layers, agent boundaries, and failure domains
          </b>{' '}
          decided before the first token is generated.
        </p>
      </Reveal>
      <div className="mt-12 grid md:grid-cols-2 gap-5">
        {PATTERNS.map((c, i) => (
          <Reveal key={c.h} delay={0.08 * i}>
            <TiltCard max={6}>
              <div
                onMouseEnter={() => logEvent('pattern.inspect', c.h.toLowerCase())}
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

/* ============ sys/llm-observability — the pipelines section ============ */
const SIGNALS = [
  ['TRACES', 'End-to-end spans across agent hops — every reasoning chain reconstructable after the fact.'],
  ['TOKENS', 'Per-route token accounting: cost attribution by feature, team, and prompt version.'],
  ['SEMANTIC CACHE', 'Hit-rate evaluation on meaning, not strings — the fastest inference is the one never run.'],
  ['EVALS', 'Regression suites for model behavior — quality gates in CI, not opinions in Slack.'],
];

export function Observability() {
  return (
    <Section id="observability" chapter="observability">
      <Reveal>
        <div className="eyebrow">sys/llm-observability</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          You can&apos;t align
          <br />
          <span className="text-dim">what you can&apos;t see.</span>
        </h2>
        <p className="max-w-[660px] text-mute text-lg">
          I spent years wiring Prometheus and Grafana through mission-critical insurance
          platforms. That discipline is now the highest-leverage skill in GenAI:{' '}
          <b className="text-mist font-medium">
            maximizing ROI through LLM observability
          </b>{' '}
          — traces, span analytics, token tracking, and semantic-caching evaluation. The
          pipelines flowing behind this text are the mental model.
        </p>
      </Reveal>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(231,236,246,.08)] border hairline rounded-[14px] overflow-hidden">
        {SIGNALS.map(([h, p], i) => (
          <Reveal key={h} delay={0.07 * i}>
            <div className="bg-ink/80 backdrop-blur-md p-6 h-full">
              <h4 className="font-mono text-[11px] tracking-[0.12em] text-amber mb-3">{h}</h4>
              <p className="text-[13.5px] text-mute">{p}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="mt-6 font-mono text-[10.5px] text-dim tracking-[0.05em]">
          // this page practices what it preaches — your session is being traced, bottom
          left. compile it in sys/query.
        </p>
      </Reveal>
    </Section>
  );
}
