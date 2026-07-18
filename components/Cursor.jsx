'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export default function Cursor() {
  const reduced = useReducedMotion();
  const [hot, setHot] = useState(false);
  const [visible, setVisible] = useState(false);
  const [waves, setWaves] = useState([]);
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness: 320, damping: 30, mass: 0.6 });
  const ry = useSpring(my, { stiffness: 320, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia('(pointer:fine)').matches) return;
    setVisible(true);
    const move = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const over = (e) => {
      if (e.target.closest('a,button,[data-hot]')) setHot(true);
    };
    const out = (e) => {
      if (e.target.closest('a,button,[data-hot]')) setHot(false);
    };
    const click = (e) => {
      const id = Date.now();
      setWaves((w) => [...w.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setWaves((w) => w.filter((v) => v.id !== id)), 650);
    };
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    window.addEventListener('mousedown', click);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
      window.removeEventListener('mousedown', click);
    };
  }, [reduced, mx, my]);

  if (!visible) return null;
  return (
    <>
      <motion.div
        className="cursor-el fixed top-0 left-0 z-[100] w-[5px] h-[5px] rounded-full bg-amber pointer-events-none"
        style={{ x: mx, y: my, translateX: '-50%', translateY: '-50%' }}
      />
      {/* probe ring: rotating dashed circle */}
      <motion.div
        className="cursor-el fixed top-0 left-0 z-[100] pointer-events-none"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hot ? 52 : 30, height: hot ? 52 : 30 }}
        transition={{ duration: 0.25 }}
      >
        <motion.svg
          viewBox="0 0 40 40"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: hot ? 1.4 : 3, ease: 'linear' }}
        >
          <circle
            cx="20" cy="20" r="18" fill={hot ? 'rgb(var(--c-amber) / .06)' : 'none'}
            stroke="rgb(var(--c-amber))" strokeOpacity={hot ? 1 : 0.5}
            strokeWidth="1.4" strokeDasharray="6 7" strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>
      {/* click shockwaves */}
      {waves.map((w) => (
        <motion.div
          key={w.id}
          initial={{ opacity: 0.55, scale: 0.2 }}
          animate={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="cursor-el fixed z-[99] w-[70px] h-[70px] rounded-full border border-amber pointer-events-none"
          style={{ left: w.x - 35, top: w.y - 35 }}
        />
      ))}
    </>
  );
}
