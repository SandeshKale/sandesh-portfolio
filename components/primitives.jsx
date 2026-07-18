'use client';
import { useRef, useEffect } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { logEvent } from '@/lib/telemetry';
import Decode from './Decode';

/* Section: wraps a chapter, reports itself to telemetry on entry,
   and gives children a shared reveal context. */
export function Section({ id, chapter, children, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once: true });
  useEffect(() => {
    if (inView && chapter) logEvent(`chapter.${chapter}`, 'loaded → rendered');
  }, [inView, chapter]);
  return (
    <section id={id} ref={ref} className={`relative py-24 md:py-32 ${className}`}>
      <div className="max-w-wrap mx-auto px-6 md:px-8">{children}</div>
    </section>
  );
}

/* Reveal: scroll-triggered entrance */
export function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.6, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* TiltCard: 3D perspective card that follows the pointer */
export function TiltCard({ children, className = '', max = 10, glare = true }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });
  const glareX = useTransform(sry, [-max, max], ['20%', '80%']);
  const glareY = useTransform(srx, [max, -max], ['20%', '80%']);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(340px circle at ${x} ${y}, rgba(240,179,76,.08), transparent 65%)`
  );

  function onMove(e) {
    if (reduced) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        data-hot
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        className="relative h-full will-change-transform"
      >
        {children}
        {glare && !reduced && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[14px] opacity-40"
            style={{ background: glareBg }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* Eyebrow: the sys/* section label, resolving out of glyph noise */
export function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <Decode>{children}</Decode>
    </div>
  );
}
