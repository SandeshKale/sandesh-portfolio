'use client';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Nav from '@/components/Nav';
import Cursor from '@/components/Cursor';
import Telemetry from '@/components/Telemetry';
import ScrollDirector from '@/components/ScrollDirector';
import Hero from '@/components/Hero';
import { Composition } from '@/components/GenAI';
import Sandbox from '@/components/Sandbox';
import Milestones from '@/components/Milestones';
import Query from '@/components/Query';
import { Contact, Footer } from '@/components/Sections';
import { logEvent } from '@/lib/telemetry';

const GlobalScene = dynamic(() => import('@/components/GlobalScene'), { ssr: false });

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
      <GlobalScene />
      <ScrollDirector />
      <Cursor />
      <Telemetry />
      <Nav />
      <Hero />
      <Composition />
      <Sandbox />
      <Milestones />
      <Query />
      <Contact />
      <Footer />
    </main>
  );
}
