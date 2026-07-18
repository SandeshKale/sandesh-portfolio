'use client';
import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Section, Reveal } from './primitives';
import { logEvent } from '@/lib/telemetry';

const MiniWire = dynamic(() => import('./MiniWire'), { ssr: false });

/* sys/milestones — the substrate as an architectural milestone tracker.
   Alternating split layout, large type, impact-first copy (all claims
   from the verified record), each era paired with a rotating wireframe. */

const MILESTONES = [
  {
    era: '2016 — 2019',
    org: 'Principal Global Services',
    title: 'Delivery becomes a discipline.',
    impact:
      'Full-lifecycle ownership of IBM BPM process platforms for financial services — from architectural reviews to release. Configured AWS VPCs and IAM across applications when cloud was still the exception in the enterprise.',
    broken: 'bottleneck broken → shipping without a safety net of seniors',
    geo: 'lattice',
    tags: ['IBM BPM', 'AWS VPC · IAM', 'Full lifecycle'],
  },
  {
    era: '2019 — 2021',
    org: 'Principal Global Services',
    title: 'Legacy stops being a life sentence.',
    impact:
      'Led migrations of critical legacy applications onto modern stacks and restructured large-scale pricing data on MongoDB document models — making the right price derivable instead of computable-overnight. Drove clean-code practice across teams through Dev COE forums.',
    broken: 'bottleneck broken → pricing data too big to reason about',
    geo: 'torus',
    tags: ['Legacy migration', 'MongoDB at scale', 'Dev COE'],
  },
  {
    era: '2021 — 2022',
    org: 'GS Lab',
    title: 'An accounting engine with no core.',
    impact:
      'Built a coreless accounting engine for an open-banking fintech and the API surface of a Banking-as-a-Service platform — high-throughput, high-availability systems where the SLA is the product.',
    broken: 'bottleneck broken → the monolithic banking core itself',
    geo: 'sphere',
    tags: ['Open Banking', 'BaaS APIs', 'High availability'],
  },
  {
    era: '2022 — now',
    org: 'Prudential Assurance Singapore',
    title: 'Mission-critical, modernized, measured.',
    impact:
      'Led end-to-end delivery of the IBM BAW workflow platform with VM clustering for resiliency and throughput. Migrated legacy estates to high-availability AKS zones with significant performance gains. Bridged the LIFE/ASIA AS400 core to modern services, drove UnderwriteMe org-wide as product owner, and tuned mission-critical systems with resilient multithreaded designs — while leading engineers and vendors.',
    broken: 'bottleneck broken → a 30-year-old core meeting a cloud-native estate',
    geo: 'icosa',
    tags: ['IBM BAW', 'AKS HA zones', 'AS400 bridge', 'UnderwriteMe', 'Team lead'],
    active: true,
  },
];

function Milestone({ m, i }) {
  const [hover, setHover] = useState(false);
  const flip = i % 2 === 1;
  return (
    <Reveal delay={0.05}>
      <div
        onMouseEnter={() => {
          setHover(true);
          logEvent('milestone.inspect', m.era);
        }}
        onMouseLeave={() => setHover(false)}
        className={`grid md:grid-cols-[220px_1fr] gap-6 md:gap-10 items-center py-10 border-b hairline ${flip ? 'md:[direction:rtl]' : ''}`}
      >
        <div className="[direction:ltr] mx-auto">
          <MiniWire geo={m.geo} hover={hover} active={m.active} />
        </div>
        <div className="[direction:ltr]">
          <div className="font-mono text-[11px] tracking-[0.1em] text-dim mb-1.5 flex items-center gap-3">
            <span className={m.active ? 'text-amber' : ''}>{m.era}</span>
            <span className="w-8 h-px bg-current opacity-30" />
            {m.org}
            {m.active && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse shadow-[0_0_8px_#F0B34C]" />
            )}
          </div>
          <h3 className="font-disp font-medium text-[clamp(24px,3vw,36px)] leading-[1.15] tracking-tight mb-3">
            {m.title}
          </h3>
          <p className="text-mute text-[15.5px] max-w-[640px]">{m.impact}</p>
          <div className="mt-3 font-mono text-[10.5px] tracking-[0.06em] text-amber/90">
            // {m.broken}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {m.tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Milestones() {
  return (
    <Section id="milestones" chapter="milestones">
      <Reveal>
        <div className="eyebrow">sys/milestones</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          The substrate.
          <br />
          <span className="text-dim">A decade of broken bottlenecks.</span>
        </h2>
        <p className="max-w-[640px] text-mute text-lg">
          GenAI architecture is only as strong as what it stands on. Four eras, four
          structural problems that stopped being problems.
        </p>
      </Reveal>
      <div className="mt-8">
        {MILESTONES.map((m, i) => (
          <Milestone key={m.era} m={m} i={i} />
        ))}
      </div>
      <p className="mt-5 font-mono text-[10.5px] text-dim tracking-[0.05em]">
        // b.e. computer engineering · savitribai phule pune university · confluent kafka
        accredited · deeplearning.ai genai certified
      </p>
    </Section>
  );
}
