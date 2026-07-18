'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onEvent, logEvent } from '@/lib/telemetry';

const MAX = 6;

function stamp(d) {
  return (
    d.toTimeString().slice(0, 8) +
    '.' +
    String(d.getMilliseconds()).padStart(3, '0').slice(0, 2)
  );
}

export default function Telemetry() {
  const [lines, setLines] = useState([]);
  const last = useRef(0);
  const id = useRef(0);

  useEffect(() => {
    const off = onEvent(({ evt, detail, at }) => {
      const now = performance.now();
      const forced = evt.startsWith('session.') || evt.startsWith('chapter.');
      if (!forced && now - last.current < 350) return; // rate-limit chatter
      last.current = now;
      setLines((prev) =>
        [...prev, { key: id.current++, evt, detail, at }].slice(-MAX)
      );
    });
    logEvent('session.start', 'visitor connected');
    const t1 = setTimeout(() => logEvent('hero.render', '3d topology online'), 700);
    const t2 = setTimeout(() => logEvent('fonts.loaded', 'clash-display · satoshi'), 1500);
    const vis = () =>
      logEvent(document.hidden ? 'session.background' : 'session.resume');
    document.addEventListener('visibilitychange', vis);
    return () => {
      off();
      clearTimeout(t1);
      clearTimeout(t2);
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  return (
    <aside
      aria-hidden="true"
      className="fixed left-[22px] bottom-[22px] z-50 hidden md:block w-[296px] max-h-[176px] overflow-hidden rounded-[10px] border hairline bg-ink/80 backdrop-blur-xl px-3 pt-2.5 pb-3 font-mono text-[10.5px] leading-[1.75] text-dim"
    >
      <div className="flex items-center gap-2 text-mute uppercase tracking-[0.06em] text-[10px] mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-ok shadow-[0_0_8px_rgba(95,191,138,.7)] animate-pulse" />
        session telemetry · live
      </div>
      <AnimatePresence initial={false}>
        {lines.map((l) => (
          <motion.div
            key={l.key}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="whitespace-nowrap overflow-hidden text-ellipsis"
          >
            <span className="text-steel">{stamp(l.at)}</span>{' '}
            <span className="text-amber">{l.evt}</span> {l.detail}
          </motion.div>
        ))}
      </AnimatePresence>
    </aside>
  );
}
