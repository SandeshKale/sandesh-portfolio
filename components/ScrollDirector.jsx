'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { phaseState } from '@/lib/scrollPhase';
import { logEvent } from '@/lib/telemetry';

/* The director. GSAP ScrollTrigger observes the DOM sections and writes
   the desired scene phase into shared state; the R3F loop reads and damps it.
   Phase map:
     #composition   0 → 1  (core pulls apart into agent constellation)
     #observability 1 → 2  (constellation streams into neural pipelines)
     #contact       2 → 3  (everything consolidates into the monolith)   */

const PHASES = [
  { id: '#composition', from: 0, to: 1, name: 'constellation' },
  { id: '#observability', from: 1, to: 2, name: 'pipelines' },
  { id: '#contact', from: 2, to: 3, name: 'monolith' },
];

export default function ScrollDirector() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers = [];
    const announced = new Set();

    PHASES.forEach(({ id, from, to, name }) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: id,
          start: 'top 92%',
          end: 'top 22%',
          scrub: true,
          onUpdate: (self) => {
            phaseState.target = from + (to - from) * self.progress;
            if (self.progress > 0.5 && !announced.has(name)) {
              announced.add(name);
              logEvent('scene.morph', `→ ${name}`);
            }
          },
        })
      );
    });

    // page-level trigger: velocity + normalized position for gutter parallax
    triggers.push(
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          phaseState.scrollNorm = self.progress;
          // getVelocity is px/s — normalize into a gentle 0..1-ish signal
          phaseState.velocity = Math.min(Math.abs(self.getVelocity()) / 4000, 1.5);
        },
      })
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
}
