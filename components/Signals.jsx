'use client';
import { Section, Reveal, Eyebrow } from './primitives';

/* sys/signals — the public engineering voice.
   Curated from Sandesh's actual LinkedIn posts (his words, lightly tightened). */

const SIGNALS = [
  {
    theme: 'the poc → production gap',
    quote:
      'Impressive POC. Excited stakeholders. Eighteen months later — still not in production.',
    date: 'jun 2026',
    take: 'The pattern behind most enterprise AI failure isn\u2019t the model. It\u2019s the workflow underneath it.',
  },
  {
    theme: 'protocols over glue code',
    quote: 'Stop building custom middleware to connect AI with your enterprise systems.',
    date: 'mar 2026',
    take: 'Every bespoke integration is tomorrow\u2019s migration project. Standard protocols are the only integration that compounds.',
  },
  {
    theme: 'trust is the bottleneck',
    quote:
      'AI ate frontend faster than backend — because frontend is easier to generate, and backend is harder to trust.',
    date: 'mar 2026',
    take: 'The next wave of AI value is behind the trust boundary. That\u2019s an architecture problem, not a model problem.',
  },
  {
    theme: 'governance before agents',
    quote:
      'The real question isn\u2019t whether teams are experimenting with AI agents — they already are. It\u2019s whether governance is in place before they do.',
    date: 'feb 2026',
    take: 'Agent adoption is bottom-up and already happening. Guardrails have to be designed, not decreed.',
  },
];

export default function Signals() {
  return (
    <Section id="signals" chapter="signals">
      <Reveal>
        <Eyebrow>sys/signals</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Positions, in public.
          <br />
          <span className="text-dim">From the writing record.</span>
        </h2>
        <p className="max-w-[620px] text-mute text-lg">
          Recurring arguments from my public writing — each one a bet on where enterprise
          AI actually goes.
        </p>
      </Reveal>
      <div className="mt-12 grid md:grid-cols-2 gap-5">
        {SIGNALS.map((sig, i) => (
          <Reveal key={sig.theme} delay={0.07 * i}>
            <div className="holo rounded-[14px] border hairline bg-ink/70 backdrop-blur-md p-6 h-full flex flex-col">
              <div className="font-mono text-[10px] tracking-[0.1em] text-amber mb-3">
                // {sig.theme} · {sig.date}
              </div>
              <blockquote className="font-disp font-medium text-[19px] leading-[1.35] text-mist flex-1">
                &ldquo;{sig.quote}&rdquo;
              </blockquote>
              <p className="mt-3.5 text-[13.5px] text-mute border-t border-dashed hairline pt-3">
                {sig.take}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <a
          href="https://www.linkedin.com/in/sandesh-kale/recent-activity/all/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-7 font-mono text-[11.5px] tracking-[0.06em] text-steel hover:text-amber transition-colors"
        >
          full writing record on linkedin ↗
        </a>
      </Reveal>
    </Section>
  );
}
