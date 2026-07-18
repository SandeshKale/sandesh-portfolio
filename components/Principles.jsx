'use client';
import { motion } from 'framer-motion';
import { Section, Reveal } from './primitives';
import { logEvent } from '@/lib/telemetry';

const LAWS = [
  {
    name: 'Simple',
    code: 'complexity ∝ failure',
    body: "Every abstraction must earn its place. If a junior engineer can't trace a request through the system, the architecture has failed — not the engineer.",
  },
  {
    name: 'Reliable',
    code: 'design for the bad day',
    body: "Retries, idempotency, circuit breakers, dead-letter queues. Reliability isn't a feature you add later — it's the shape of the system from day one.",
  },
  {
    name: 'Observable',
    code: "if you can't see it, you don't own it",
    body: 'Prometheus, Grafana, distributed tracing — wired into every service I ship. A system that can\'t explain itself under pressure is a liability. This page instruments itself: check the console, bottom left.',
  },
  {
    name: 'Scalable',
    code: 'performance is designed, not added',
    body: 'Partitioning strategy, caching layers, multithreading tuned for throughput. Scale problems solved at design time cost nothing. Solved in production, they cost everything.',
  },
  {
    name: 'Maintainable',
    code: 'the next engineer is the user',
    body: "Code is read a hundred times more than it's written. I optimize for the person inheriting the system — because eventually, that person is always you.",
  },
];

export default function Principles() {
  return (
    <Section id="principles" chapter="principles">
      <Reveal>
        <div className="eyebrow">sys/principles</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Five properties.
          <br />
          <span className="text-dim">Non-negotiable.</span>
        </h2>
      </Reveal>
      <div className="mt-12 border-t hairline">
        {LAWS.map((law, i) => (
          <motion.div
            key={law.name}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.07 }}
            onMouseEnter={() => logEvent('principle.read', law.name.toLowerCase())}
            data-hot
            className="group grid md:grid-cols-[200px_1fr] gap-2 md:gap-7 items-baseline py-6 px-1.5 border-b hairline transition-all duration-300 hover:pl-4 hover:bg-gradient-to-r hover:from-amber/10 hover:to-transparent"
          >
            <div>
              <div className="font-disp font-medium text-2xl group-hover:text-amber transition-colors">
                {law.name}
              </div>
              <span className="font-mono text-[10.5px] text-dim tracking-[0.08em] block mt-1">
                {law.code}
              </span>
            </div>
            <p className="text-mute text-base max-w-[560px]">{law.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
