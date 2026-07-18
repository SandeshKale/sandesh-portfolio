'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export default function Cursor() {
  const reduced = useReducedMotion();
  const [hot, setHot] = useState(false);
  const [visible, setVisible] = useState(false);
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
    window.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseover', over);
    document.addEventListener('mouseout', out);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', over);
      document.removeEventListener('mouseout', out);
    };
  }, [reduced, mx, my]);

  if (!visible) return null;
  return (
    <>
      <motion.div
        className="cursor-el fixed top-0 left-0 z-[100] w-[5px] h-[5px] rounded-full bg-amber pointer-events-none"
        style={{ x: mx, y: my, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="cursor-el fixed top-0 left-0 z-[100] rounded-full border pointer-events-none"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hot ? 52 : 30,
          height: hot ? 52 : 30,
          borderColor: hot ? 'rgba(240,179,76,1)' : 'rgba(240,179,76,.45)',
          backgroundColor: hot ? 'rgba(240,179,76,.06)' : 'rgba(240,179,76,0)',
        }}
        transition={{ duration: 0.25 }}
      />
    </>
  );
}
