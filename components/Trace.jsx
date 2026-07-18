'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Section, Reveal } from './primitives';

/* Career rendered as a distributed trace.
   Timeline: Jul 2016 → today. Span geometry computed from real dates.
   Bars grow with scroll — the trace records as the visitor reads. */

const SPANS = [
  {
    org: 'Principal Global Services',
    role: 'application developer · pune',
    left: 0,
    width: 32.5,
    body: 'Foundation years. IBM BPM process flows for financial services, AWS VPC and IAM at enterprise scale, releases end to end — from architectural reviews to test plans. Learned that enterprise software is a people problem wearing a technology costume.',
    tags: ['IBM BPM', 'AWS', 'Java', 'Clean Code'],
  },
  {
    org: 'Principal Global Services',
    role: 'senior software developer · pune',
    left: 32.5,
    width: 16,
    body: 'Deeper into design ownership: legacy migrations to newer stacks, MongoDB document models for large-scale pricing data, Dev COE forums shaping how teams across the org adopted new technology.',
    tags: ['System Design', 'MongoDB', 'Legacy Migration'],
  },
  {
    org: 'GS Lab',
    role: 'senior software engineer · pune',
    left: 48.5,
    width: 10,
    body: 'Fintech product pace. Built a coreless accounting engine for an open-banking product and the APIs behind a Banking-as-a-Service platform — high-throughput, high-availability systems where downtime is a headline.',
    tags: ['Open Banking', 'BaaS', 'High Availability'],
  },
  {
    org: 'Prudential Assurance Singapore',
    role: 'lead backend engineer · singapore',
    left: 58.5,
    width: 41.5,
    active: true,
    body: 'The current span. Led end-to-end delivery of an IBM BAW workflow platform. Product owner for the UnderwriteMe underwriting engine across the organization. Migrated legacy applications to high-availability AKS zones, integrated the LIFE/ASIA AS400 core, tuned mission-critical systems with resilient multithreaded designs, and wired Prometheus–Grafana observability through the estate — while leading a team of engineers and vendors.',
    tags: ['IBM BAW', 'UnderwriteMe', 'AKS · Azure', 'AS400 Integration', 'Prometheus · Grafana', 'Team Lead'],
  },
];

function SpanBar({ span, progress, index }) {
  // each bar grows during its own slice of the section's scroll
  const start = 0.05 + index * 0.14;
  const width = useTransform(progress, [start, start + 0.28], ['0%', `${span.width}%`]);
  return (
    <div className="py-5 border-b hairline">
      <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2.5">
        <span className="font-body font-bold text-[17px] text-mist">{span.org}</span>
        <span className="font-mono text-[11px] text-mute tracking-[0.04em]">{span.role}</span>
      </div>
      <div className="relative h-[26px] bg-[repeating-linear-gradient(90deg,transparent_0_calc(10%-1px),rgba(231,236,246,.08)_calc(10%-1px)_10%)]">
        <motion.div
          style={{ width, left: `${span.left}%` }}
          className={`absolute top-[5px] h-4 rounded-[3px] ${
            span.active
              ? 'bg-gradient-to-r from-amber/35 to-amber shadow-[0_0_18px_rgba(240,179,76,.25)]'
              : 'bg-gradient-to-r from-steel/35 to-steel/75'
          }`}
        >
          {span.active && (
            <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber shadow-[0_0_10px_#F0B34C] animate-pulse" />
          )}
        </motion.div>
      </div>
      <p className="mt-2.5 text-[14.5px] text-mute max-w-[660px]">{span.body}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {span.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Trace() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.75'],
  });

  return (
    <Section id="trace" chapter="trace">
      <div ref={ref}>
        <Reveal>
          <div className="eyebrow">sys/trace</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="h2">
            One career.
            <br />
            <span className="text-dim">Rendered as a distributed trace.</span>
          </h2>
          <p className="max-w-[600px] text-mute text-lg">
            Ten years, four spans. Scroll, and the trace records. The active span is
            still running.
          </p>
        </Reveal>
        <div className="mt-12 font-mono">
          <div className="flex justify-between text-[10.5px] text-dim pb-2.5 border-b hairline tracking-[0.05em]">
            {['2016', '2018', '2020', '2022', '2024', 'now'].map((y) => (
              <span key={y}>{y}</span>
            ))}
          </div>
          {SPANS.map((s, i) => (
            <SpanBar key={i} span={s} progress={scrollYProgress} index={i} />
          ))}
          <div className="mt-4 text-[10.5px] text-dim tracking-[0.05em]">
            // b.e. computer engineering · savitribai phule pune university · trace still
            recording
          </div>
        </div>
      </div>
    </Section>
  );
}
