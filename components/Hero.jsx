'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.2, 0.6, 0.2, 1] },
  }),
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const tagY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* readability veil over the fixed scene */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(90%_70%_at_50%_45%,rgba(11,14,21,.25)_0%,rgba(11,14,21,.78)_100%)]" />

      <div className="relative z-10 w-full max-w-wrap mx-auto px-6 md:px-8 text-center">
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={0}
          style={{ y: tagY }}
          className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.1em] text-mute mb-7 border hairline rounded-full px-4 py-1.5 bg-ink/40 backdrop-blur-sm"
        >
          <span className="w-[7px] h-[7px] rounded-full bg-ok shadow-[0_0_10px_rgba(95,191,138,.8)] animate-pulse" />
          ORCHESTRATOR ONLINE — SINGAPORE
        </motion.div>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          style={{ y, opacity }}
          className="font-disp font-semibold leading-none tracking-tight mx-auto max-w-[1040px]"
        >
          <span className="block text-[clamp(44px,8vw,112px)]">Architecting Frontier</span>
          <span className="block text-[clamp(44px,8vw,112px)] text-amber mt-2">GenAI Ecosystems</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          style={{ opacity }}
          className="mt-7 mx-auto max-w-[620px] text-mute text-lg"
        >
          Engineering enterprise intelligence at scale — from orchestration layers to
          production-grade guardrails.{' '}
          <b className="text-mist font-medium">Sandesh Kale</b>, GenAI Solutions Architect
          built on a decade of BFSI core-systems engineering.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={3}
          style={{ opacity }}
          className="mt-11 flex flex-wrap justify-center gap-x-10 gap-y-4 font-mono text-[11.5px] tracking-[0.05em] text-dim"
        >
          {[
            ['DISCIPLINE', 'LLM Orchestration · RAG · Guardrails'],
            ['SUBSTRATE', 'BFSI Enterprise Core · 10 yrs'],
            ['EDGE', 'LLM Observability'],
          ].map(([k, v]) => (
            <div key={k}>
              {k}
              <span className="block text-mute mt-0.5">{v}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10.5px] tracking-[0.2em] text-dim animate-bounce"
      >
        SCROLL — THE CORE RESPONDS ↓
      </motion.div>
    </section>
  );
}
