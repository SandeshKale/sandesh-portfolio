'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Section, Reveal } from './primitives';

/* The thesis is Sandesh's own LinkedIn line, revealed word by word
   as the visitor scrolls — the page earns the statement. */

const LINES = [
  { words: 'Most enterprise AI projects', dim: true },
  { words: "don't fail because of the model.", dim: true },
  { words: 'They fail because nobody understood', dim: false },
  { words: 'the workflow underneath it.', dim: false, amber: true },
];

function ScrollLine({ line, progress, range }) {
  const words = line.words.split(' ');
  const step = (range[1] - range[0]) / words.length;
  return (
    <span className="block">
      {words.map((w, i) => {
        const start = range[0] + i * step;
        return (
          <Word key={i} progress={progress} range={[start, start + step]} dim={line.dim} amber={line.amber}>
            {w}
          </Word>
        );
      })}
    </span>
  );
}

function Word({ children, progress, range, dim, amber }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.28em] ${amber ? 'text-amber' : dim ? 'text-dim' : 'text-mist'}`}
    >
      {children}
    </motion.span>
  );
}

export default function Thesis() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.25'],
  });

  return (
    <Section id="thesis" chapter="thesis">
      <div ref={ref}>
        <Reveal>
          <div className="eyebrow">sys/thesis</div>
        </Reveal>
        <p className="font-disp font-medium leading-[1.28] tracking-[-0.01em] max-w-[880px] text-[clamp(26px,3.6vw,42px)]">
          {LINES.map((line, i) => (
            <ScrollLine
              key={i}
              line={line}
              progress={scrollYProgress}
              range={[i / LINES.length, (i + 1) / LINES.length]}
            />
          ))}
        </p>
        <Reveal delay={0.15} className="mt-9 max-w-[580px] text-mute">
          <p>
            I&apos;ve spent a decade inside banks and insurance firms — payments
            infrastructure, BaaS platforms, policy workflows, ISO&nbsp;20022 and SWIFT
            integrations. I know what the core looks like from the inside. Now I bring
            LLMs and cloud-native systems into that core — without the chaos of a full
            transformation project.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
