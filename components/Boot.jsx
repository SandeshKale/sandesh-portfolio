'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* First-visit boot sequence. Skippable, session-scoped, honest about what it is.
   Reduced-motion or return visitors never see it. */

const LINES = [
  '> sys.boot — sandesh-kale.dev',
  '> loading constellation … ok',
  '> binding scroll → scene phases … ok',
  '> llm subsystems: grounded terminal · architecture consult … online',
  '> welcome, observer.',
];

export default function Boot() {
  const [show, setShow] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seen = sessionStorage.getItem('sk-booted');
    if (!reduced && !seen) setShow(true);
  }, []);

  const dismiss = useCallback(() => {
    sessionStorage.setItem('sk-booted', '1');
    setShow(false);
  }, []);

  useEffect(() => {
    if (!show) return;
    if (lineIdx >= LINES.length) {
      const t = setTimeout(dismiss, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLineIdx((i) => i + 1), lineIdx === 0 ? 500 : 420);
    return () => clearTimeout(t);
  }, [show, lineIdx, dismiss]);

  useEffect(() => {
    if (!show) return;
    const skip = () => dismiss();
    window.addEventListener('click', skip);
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchstart', skip, { passive: true });
    return () => {
      window.removeEventListener('click', skip);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchstart', skip);
    };
  }, [show, dismiss]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[90] bg-ink flex items-center justify-center px-6"
          aria-hidden="true"
        >
          <div className="w-full max-w-[560px] font-mono text-[13px] leading-[2.1] text-mute">
            {LINES.slice(0, lineIdx).map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                {i === LINES.length - 1 ? <span className="text-amber">{l}</span> : l}
              </motion.div>
            ))}
            <span className="inline-block w-[9px] h-[17px] bg-amber align-middle animate-pulse" />
            <div className="mt-6 text-[10px] tracking-[0.15em] text-dim uppercase">
              click · scroll · any key to skip
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
