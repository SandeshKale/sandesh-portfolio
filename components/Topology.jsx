'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Section, Reveal } from './primitives';
import { logEvent } from '@/lib/telemetry';

const NODES = {
  gateway: {
    t: 'API Gateway',
    c: 'edge · auth · rate-limit',
    p: 'Where the outside world meets the platform. I design gateways as contracts: authentication, throttling, and versioning handled once — so fifty services behind it never have to.',
  },
  workflow: {
    t: 'Workflow Engine',
    c: 'ibm baw · vm clustering',
    p: 'Led the end-to-end delivery of an IBM BAW workflow platform at Prudential — including VM clustering for resiliency and throughput. Enterprise workflow is where business logic lives; I make it survivable.',
  },
  underwriting: {
    t: 'Underwriting Engine',
    c: 'underwriteme · product owner',
    p: 'Product owner for the UnderwriteMe engine, integrated organization-wide. Owning a product means owning its failure modes — every integration designed for the day something upstream breaks.',
  },
  core: {
    t: 'Core System Bridge',
    c: 'life/asia · as400',
    p: 'Designed the end-to-end integration with the LIFE/ASIA AS400 core. Bridging a decades-old mainframe to cloud-native services is the truest test of architecture: both sides must stay honest.',
  },
  kafka: {
    t: 'Kafka Event Bus',
    c: 'confluent accredited',
    p: "Events decouple teams, not just services. Partitioning strategy, consumer-group design, dead-letter handling, replay — the event bus is the platform's memory and its pulse. Confluent-accredited, production-proven.",
  },
  stores: {
    t: 'Data Stores',
    c: 'sql server · snowflake · couchbase',
    p: 'Polyglot by need, not fashion. Relational for transactions, Snowflake for analytics, Couchbase and RocksDB where latency is the feature, MongoDB where documents fit the domain.',
  },
  aks: {
    t: 'AKS Runtime',
    c: 'high-availability zones',
    p: 'Migrated multiple legacy applications to high-availability AKS zones with significant performance gains. Kubernetes is the easy part — the migration path without downtime is the craft.',
  },
  observe: {
    t: 'Observability',
    c: 'prometheus · grafana',
    p: "Integrated Prometheus–Grafana across mission-critical applications. If the 3 a.m. engineer can't see it, it isn't done. This site logs itself for the same reason — bottom left.",
  },
};

const NODE_LAYOUT = [
  { id: 'gateway', x: 30, y: 180, w: 90, label: 'gateway' },
  { id: 'workflow', x: 220, y: 84, w: 116, label: 'baw-workflow' },
  { id: 'underwriting', x: 220, y: 180, w: 116, label: 'underwrite' },
  { id: 'core', x: 220, y: 276, w: 116, label: 'as400-bridge' },
  { id: 'kafka', x: 408, y: 168, w: 80, label: 'kafka', h: 60, sub: 'event bus' },
  { id: 'aks', x: 548, y: 76, w: 78, label: 'aks' },
  { id: 'stores', x: 548, y: 168, w: 78, label: 'stores' },
  { id: 'observe', x: 548, y: 260, w: 78, label: 'observe' },
];

const EDGES = [
  'M120,200 C170,200 170,104 220,104',
  'M120,200 C170,200 170,200 220,200',
  'M120,200 C170,200 170,296 220,296',
  'M336,104 C374,104 374,186 408,192',
  'M336,200 C364,200 378,198 408,198',
  'M336,296 C374,296 374,212 408,206',
  'M488,182 C520,150 522,108 548,96',
  'M488,198 C518,198 522,190 548,188',
  'M488,214 C520,248 522,268 548,280',
];

export default function Topology() {
  const [sel, setSel] = useState(null);
  const panelRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start 0.95', 'start 0.35'],
  });
  // the whole diagram unfolds in 3D as it scrolls into view
  const rotateX = useTransform(scrollYProgress, [0, 1], [24, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  const info = sel ? NODES[sel] : null;

  function pick(id) {
    setSel(id);
    logEvent('node.select', id);
  }

  return (
    <Section id="topology" chapter="topology">
      <Reveal>
        <div className="eyebrow">sys/topology</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          The platform I run.
          <br />
          <span className="text-dim">Living architecture.</span>
        </h2>
        <p className="max-w-[620px] text-mute text-lg">
          Not a diagram of a hypothetical — a composite of the systems I lead at
          Prudential Singapore. Select any node.
        </p>
      </Reveal>

      <div className="mt-12 grid lg:grid-cols-[1fr_300px] gap-8 items-start" style={{ perspective: 1200 }}>
        <motion.div
          ref={panelRef}
          style={{ rotateX, scale, opacity, transformStyle: 'preserve-3d' }}
          className="rounded-[14px] border hairline bg-panel p-5 md:p-6 overflow-hidden origin-center"
        >
          <svg viewBox="0 0 640 400" className="w-full h-auto block" role="img" aria-label="Interactive architecture: gateway, BAW workflow, underwriting engine, AS400 bridge, Kafka, AKS, data stores and observability">
            {EDGES.map((d, i) => (
              <path key={i} id={`edge-${i}`} d={d} fill="none" stroke="rgba(231,236,246,.16)" strokeWidth="1" />
            ))}
            {EDGES.map((d, i) => (
              <circle key={`p${i}`} r="3" fill={i % 2 ? '#7C96C4' : '#F0B34C'} opacity="0.9">
                <animateMotion dur={`${2.2 + (i % 4) * 0.45}s`} begin={`${i * 0.35}s`} repeatCount="indefinite">
                  <mpath href={`#edge-${i}`} />
                </animateMotion>
              </circle>
            ))}
            {NODE_LAYOUT.map((n) => (
              <g
                key={n.id}
                data-hot
                tabIndex={0}
                onMouseEnter={() => pick(n.id)}
                onClick={() => pick(n.id)}
                onFocus={() => pick(n.id)}
                className="cursor-pointer outline-none"
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={n.w}
                  height={n.h || 40}
                  rx="9"
                  fill={sel === n.id ? 'rgba(240,179,76,.08)' : '#141926'}
                  stroke={sel === n.id ? '#F0B34C' : 'rgba(231,236,246,.16)'}
                  style={{ transition: 'all .3s' }}
                />
                <text
                  x={n.x + n.w / 2}
                  y={n.y + (n.h ? 26 : 24)}
                  textAnchor="middle"
                  fill={sel === n.id ? '#F0B34C' : '#8A92A6'}
                  style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 10.5, transition: 'fill .3s' }}
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text x={n.x + n.w / 2} y={n.y + 42} textAnchor="middle" fill="#5A6275" style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 8.5 }}>
                    {n.sub}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </motion.div>

        <div className="rounded-[14px] border hairline bg-panel p-6 min-h-[230px] lg:sticky lg:top-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={sel || 'empty'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h4 className="font-disp font-medium text-xl mb-1">{info ? info.t : 'Select a node'}</h4>
              <span className="font-mono text-[10.5px] text-amber tracking-[0.08em] block mb-3.5">
                // {info ? info.c : 'hover or tap any component'}
              </span>
              <p className="text-[14.5px] text-mute">
                {info
                  ? info.p
                  : 'Each node maps to systems I have designed, delivered, or modernized in production at Prudential. The packets in flight are how I think about software: events, always moving.'}
              </p>
              {!info && (
                <p className="font-mono text-[10.5px] text-dim mt-4 tracking-[0.05em]">
                  9 edges · 8 nodes · 0 single points of failure
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
