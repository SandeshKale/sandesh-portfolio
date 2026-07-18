'use client';
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';

const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false });

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
  const reduced = useReducedMotion();
  const progressRef = useRef(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;
  });

  // content parallax: headline drifts up faster than the page, fades out
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const tagY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden">
      {!reduced && <Hero3D progress={progressRef} />}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_90%_at_30%_45%,transparent_30%,#0B0E15_88%)]" />

      <div className="relative z-10 w-full max-w-wrap mx-auto px-8">
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={0}
          style={{ y: tagY }}
          className="flex items-center gap-2.5 font-mono text-xs tracking-[0.1em] text-mute mb-6"
        >
          <span className="w-[7px] h-[7px] rounded-full bg-ok shadow-[0_0_10px_rgba(95,191,138,.8)] animate-pulse" />
          ALL SYSTEMS OPERATIONAL — SINGAPORE
        </motion.div>

        <motion.h1
          variants={fadeUp} initial="hidden" animate="show" custom={1}
          style={{ y, opacity }}
          className="font-disp font-semibold leading-[1.02] tracking-[-0.02em] max-w-[900px]"
        >
          <span className="block text-[clamp(46px,8.2vw,104px)]">Systems that</span>
          <span className="block text-[clamp(46px,8.2vw,104px)] text-amber">stay up.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} initial="hidden" animate="show" custom={2}
          style={{ opacity }}
          className="mt-8 max-w-[540px] text-mute text-lg"
        >
          <b className="text-mist font-medium">Sandesh Kale</b> — Lead Backend Engineer at
          Prudential Singapore. A decade building the platforms banks and insurers bet their
          business on — and the AI that now runs inside them.
        </motion.p>

        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={3}
          style={{ opacity }}
          className="mt-11 flex flex-wrap gap-8 font-mono text-[11.5px] tracking-[0.05em] text-dim"
        >
          {[
            ['ROLE', 'Lead Backend Engineer'],
            ['DOMAIN', 'BFSI · Enterprise Platforms'],
            ['FOCUS', 'Distributed Systems · AI'],
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
        SCROLL ↓
      </motion.div>
    </section>
  );
}
