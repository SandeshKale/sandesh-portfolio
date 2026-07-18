'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

/* Terminal decode effect: text resolves out of glyph noise when scrolled into view. */

const GLYPHS = '▖▗▘▝▚▞░▒╱╲<>/#%&@$';

export default function Decode({ children, className = '', as: Tag = 'span' }) {
  const target = String(children);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [text, setText] = useState(reduced ? target : '');

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setText(target);
      return;
    }
    let frame = 0;
    const total = Math.max(14, target.length * 2);
    const id = setInterval(() => {
      frame++;
      const resolved = Math.floor((frame / total) * target.length);
      let out = target.slice(0, resolved);
      for (let i = resolved; i < target.length; i++) {
        out += target[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setText(out);
      if (frame >= total) {
        setText(target);
        clearInterval(id);
      }
    }, 28);
    return () => clearInterval(id);
  }, [inView, target, reduced]);

  return (
    <Tag ref={ref} className={className} aria-label={target}>
      {text || '\u00A0'}
    </Tag>
  );
}
