'use client';
import { useEffect, useRef } from 'react';
import Nav from '@/components/Nav';
import Cursor from '@/components/Cursor';
import Telemetry from '@/components/Telemetry';
import Hero from '@/components/Hero';
import Thesis from '@/components/Thesis';
import Principles from '@/components/Principles';
import Trace from '@/components/Trace';
import Topology from '@/components/Topology';
import { Stack, AISection, Leadership, Now, Contact, Footer } from '@/components/Sections';
import Query from '@/components/Query';
import { logEvent } from '@/lib/telemetry';

export default function Page() {
  const maxDepth = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const d = Math.round((window.scrollY / total) * 100);
      if (d >= maxDepth.current + 20) {
        maxDepth.current = d - (d % 20);
        logEvent('scroll.depth', `${maxDepth.current}%`);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main>
      <Cursor />
      <Telemetry />
      <Nav />
      <Hero />
      <Thesis />
      <Principles />
      <Trace />
      <Topology />
      <Stack />
      <AISection />
      <Query />
      <Leadership />
      <Now />
      <Contact />
      <Footer />
    </main>
  );
}
