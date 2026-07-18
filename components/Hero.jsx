'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.12 + i * 0.12, ease: [0.2, 0.6, 0.2, 1] },
  }),
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none hero-veil" />

      <div className="relative z-10 w-full max-w-wrap mx-auto px-6 md:px-8 text-center">
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={0}
          className="font-mono text-[12px] md:text-[13px] tracking-[0.22em] text-mute uppercase mb-5"
        >
          GenAI Solutions Architect · Singapore
        </motion.div>

        {/* the name leads */}
        <motion.h1
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          style={{ y, opacity }}
          className="font-disp font-semibold leading-none tracking-tight text-[clamp(56px,11vw,150px)]"
        >
          Sandesh <span className="text-amber">Kale</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          style={{ opacity }}
          className="mt-7 font-disp font-medium leading-[1.08] tracking-tight text-[clamp(24px,3.6vw,44px)] text-mist/90"
        >
          Architecting Frontier GenAI Ecosystems
        </motion.p>

        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={3}
          style={{ opacity }}
          className="mt-5 mx-auto max-w-[620px] text-mute text-lg"
        >
          Engineering enterprise intelligence at scale — from orchestration layers to
          production-grade guardrails, on a decade of BFSI core-systems engineering.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={4}
          style={{ opacity }}
          className="mt-11 flex flex-wrap justify-center gap-x-10 gap-y-4 font-mono text-[11.5px] tracking-[0.05em] text-dim"
        >
          {[
            ['DISCIPLINE', 'LLM Orchestration · RAG · Guardrails'],
            ['SUBSTRATE', 'BFSI Enterprise Core · 10 yrs'],
            ['EDGE', 'Deterministic AI Systems'],
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
