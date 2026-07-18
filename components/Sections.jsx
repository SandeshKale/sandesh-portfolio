'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Section, Reveal, TiltCard, Eyebrow } from './primitives';

/* ------------------------------ STACK ------------------------------ */
const STACK = [
  {
    h: 'Backend Core',
    items: [
      ['Java · Spring Boot', '10 yrs'],
      ['Microservices', 'design + ops'],
      ['Kafka · Streams', 'confluent accredited'],
      ['REST · JMS · MQ', 'architecture'],
      ['Multithreading', 'perf tuning'],
      ['IBM BAW · BPM · ODM', 'enterprise'],
    ],
  },
  {
    h: 'Cloud & Infra',
    items: [
      ['Azure · AKS', 'primary'],
      ['AWS · VPC · IAM', 'multi-cloud'],
      ['Kubernetes · Docker', 'orchestration'],
      ['Terraform', 'infra as code'],
      ['Prometheus · Grafana', 'observability'],
      ['High Availability', 'zone design'],
    ],
  },
  {
    h: 'Data & AI',
    items: [
      ['SQL Server · DB2', 'oltp'],
      ['Snowflake', 'analytics'],
      ['Couchbase · MongoDB', 'low latency'],
      ['LLM Integration', 'deeplearning.ai certified'],
      ['Prompt Engineering', 'production'],
      ['Agentic Workflows', 'n8n + code'],
    ],
  },
];

export function Stack() {
  return (
    <Section id="stack" chapter="stack">
      <Reveal>
        <Eyebrow>sys/stack</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Tools are chosen.
          <br />
          <span className="text-dim">Never collected.</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid md:grid-cols-3 gap-px bg-[rgba(231,236,246,.08)] border hairline rounded-[14px] overflow-hidden">
        {STACK.map((col, i) => (
          <motion.div
            key={col.h}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            className="bg-ink p-7"
          >
            <h4 className="font-mono text-[11px] tracking-[0.12em] text-amber uppercase mb-5">{col.h}</h4>
            <ul>
              {col.items.map(([name, meta]) => (
                <li
                  key={name}
                  className="flex justify-between items-baseline gap-3 py-2 border-b hairline last:border-0 text-[15px] text-mute hover:text-mist hover:pl-2 transition-all"
                >
                  {name}
                  <em className="not-italic font-mono text-[10px] text-dim tracking-[0.05em] text-right">{meta}</em>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------ AI ------------------------------ */
const LAB = [
  {
    h: 'Guided-Selling PWA',
    m: 'llm recommender · offline-first · design system',
    p: 'A retail sales assistant with an LLM combo-recommender, admin portal, and token-managed access.',
  },
  {
    h: 'Automated Job Intelligence',
    m: '8 sources · weighted scoring · llm proposals · 92 tests',
    p: 'A pipeline that scans job boards, scores opportunities 0–100, drafts proposals with an LLM, and alerts by tier.',
  },
  {
    h: 'Vision-LLM Market Analyzer',
    m: 'screenshot ingestion · multi-provider cascade',
    p: 'A trading-analysis system that reads charts with vision models when APIs are geo-blocked — constraint-driven engineering.',
  },
  {
    h: 'B2B Quote Generator',
    m: 'live in production · real daily users',
    p: 'A quoting web app used daily by a distributor. Small system, full lifecycle: shipped, versioned, maintained.',
  },
];

export function AISection() {
  return (
    <Section id="ai" chapter="ai">
      <Reveal>
        <Eyebrow>sys/ai</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          AI is not the product.
          <br />
          <span className="text-dim">It&apos;s the multiplier.</span>
        </h2>
        <p className="max-w-[620px] text-mute text-lg">
          Enterprise AI works when someone who understands{' '}
          <b className="text-mist font-medium">reliability, data boundaries, and regulation</b>{' '}
          designs it in. That intersection is where I operate — certified in generative AI
          engineering, proven in BFSI production.
        </p>
      </Reveal>

      <div className="mt-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
        <Reveal delay={0.15}>
          <div className="rounded-[14px] border hairline bg-panel p-7">
            {[
              ['01', 'LLM integration into enterprise workflows', 'Bringing models into IBM BAW, microservices, and cloud estates — with structured-output contracts, fallback chains, and cost-aware routing, treated with the same rigor as any payment flow.'],
              ['02', 'Cloud architecture for regulated environments', 'Azure, AWS, Kubernetes — designed for financial-services compliance from the first diagram, not retrofitted after the audit.'],
              ['03', 'AI readiness audits', 'Where it will work, where it will break, and what to do first. The hard part of enterprise AI was never the model.'],
            ].map(([n, h, p]) => (
              <div key={n} className="flex gap-4 py-4 border-b border-dashed hairline last:border-0">
                <div className="shrink-0 w-[34px] h-[34px] rounded-[9px] border hairline-strong bg-panel2 flex items-center justify-center font-mono text-[11px] text-amber">
                  {n}
                </div>
                <div>
                  <h5 className="font-bold text-[15px]">{h}</h5>
                  <p className="text-[13.5px] text-mute">{p}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="font-mono text-[11px] tracking-[0.12em] text-mute uppercase mb-4">
              // side lab — shipped builds
            </div>
          </Reveal>
          <div className="grid gap-4">
            {LAB.map((item, i) => (
              <Reveal key={item.h} delay={0.08 * i}>
                <TiltCard max={7}>
                  <div className="rounded-[14px] border hairline bg-panel p-5 h-full">
                    <h5 className="font-disp font-medium text-[19px]">{item.h}</h5>
                    <span className="font-mono text-[10px] text-dim tracking-[0.08em] block mt-1 mb-2">{item.m}</span>
                    <p className="text-sm text-mute">{item.p}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------ LEADERSHIP ------------------------------ */
export function Leadership() {
  return (
    <Section id="leadership" chapter="leadership">
      <Reveal>
        <Eyebrow>sys/leadership</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="font-disp font-medium leading-[1.32] tracking-[-0.01em] max-w-[840px] text-[clamp(24px,3.2vw,36px)]">
          I lead the way good systems run:{' '}
          <span className="text-amber">quiet interfaces, clear contracts,</span> and failure
          handled without blame.
        </p>
      </Reveal>
      <div className="mt-12 grid md:grid-cols-3 gap-8">
        {[
          ['Player-coach', "Lead title, engineer's hands. I groom features, break down stories, and still ship code in the same sprint — credibility with a team is earned in the diff, not the org chart."],
          ['Influence over authority', 'The best design decisions are ones the team believes are theirs. My job is to ask the question that makes the right answer obvious — with engineers, vendors, and stakeholders alike.'],
          ['Mentorship as leverage', 'One engineer levelled up is worth more than ten of my commits. I invest where the compound interest is.'],
        ].map(([h, p], i) => (
          <Reveal key={h} delay={0.1 * i}>
            <div>
              <h5 className="font-bold text-base mb-2 flex items-center gap-2.5">
                <span className="w-4 h-px bg-amber inline-block" />
                {h}
              </h5>
              <p className="text-[14.5px] text-mute">{p}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------ NOW ------------------------------ */
export function Now() {
  return (
    <Section id="now" chapter="now">
      <Reveal>
        <Eyebrow>sys/now</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Current focus.
          <br />
          <span className="text-dim">Next horizon.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <div className="mt-8 grid md:grid-cols-2 gap-px bg-[rgba(231,236,246,.08)] border hairline rounded-[14px] overflow-hidden">
          <div className="bg-ink p-8">
            <h4 className="font-mono text-[11px] tracking-[0.12em] text-amber uppercase mb-4">Running now</h4>
            <p className="text-mute text-[15.5px]">
              Modernizing enterprise insurance platforms —{' '}
              <b className="text-mist font-medium">event-driven, cloud-native, observable by default</b>.
              Building agentic AI systems on the side, where fewer rules exist and the learning is fastest.
            </p>
          </div>
          <div className="bg-ink p-8">
            <h4 className="font-mono text-[11px] tracking-[0.12em] text-amber uppercase mb-4">Building toward</h4>
            <p className="text-mute text-[15.5px]">
              Enterprise architecture and AI engineering leadership — the person organizations call when
              the system is <b className="text-mist font-medium">mission-critical, regulated, and can&apos;t afford to be wrong</b>.
              And a public voice for how enterprise AI actually gets built.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ------------------------------ CONTACT ------------------------------ */
export function Contact() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'start 0.4'] });
  const y = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="contact" chapter="contact" className="pb-10">
      <div ref={ref}>
        <Reveal>
          <Eyebrow>sys/contact</Eyebrow>
        </Reveal>
        <motion.h2
          style={{ y, opacity }}
          className="font-disp font-medium tracking-tight leading-none text-[clamp(38px,6.5vw,84px)]"
        >
          Building something
          <br />
          intelligent — <span className="text-dim">that can&apos;t fail?</span>
        </motion.h2>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="https://www.linkedin.com/in/sandesh-kale"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-amber text-ink font-body font-bold text-[15px] px-7 py-3.5 hover:bg-[#f6c56e] transition-colors shadow-[0_0_34px_rgba(240,179,76,.25)]"
            >
              Connect on LinkedIn
              <span aria-hidden>→</span>
            </a>
            <a
              href="mailto:kale.sd111@gmail.com"
              className="inline-flex items-center gap-3 rounded-xl border hairline-strong text-mist font-mono text-[13px] px-6 py-3.5 hover:border-amber/60 hover:text-amber transition-colors"
            >
              kale.sd111@gmail.com
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-12 grid sm:grid-cols-3 gap-px bg-[rgba(231,236,246,.08)] border hairline rounded-[14px] overflow-hidden max-w-[760px]">
            {[
              ['LOCATION', 'Singapore · SGT'],
              ['OPEN TO', 'Solutions Architect · GenAI Architect · Advisory'],
              ['RESPONSE', 'Within one business day'],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink/80 backdrop-blur-md px-6 py-5">
                <div className="font-mono text-[10px] tracking-[0.12em] text-dim">{k}</div>
                <div className="font-mono text-[12px] text-mute mt-1.5">{v}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t hairline mt-16">
      <div className="max-w-wrap mx-auto px-8 py-7 pb-10 flex flex-wrap justify-between gap-5 font-mono text-[10.5px] tracking-[0.06em] text-dim">
        <div>© 2026 SANDESH KALE</div>
        <a href="/blueprint" className="hover:text-amber transition-colors">SYS/BLUEPRINT — HOW THIS SITE WORKS</a>
      </div>
    </footer>
  );
}
