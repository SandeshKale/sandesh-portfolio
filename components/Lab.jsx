'use client';
import { Section, Reveal, TiltCard, Eyebrow } from './primitives';
import { logEvent } from '@/lib/telemetry';

/* sys/lab — proof of work. Real repositories, real numbers, real constraints.
   Stats pulled from the actual GitHub account, not adjectives. */

const BUILDS = [
  {
    h: 'Market-Analysis Platform',
    m: '3 repos · ~130 commits · typescript + node',
    constraint: 'constraint → broker APIs geo-blocked from Singapore',
    p: 'Evolved across three architecture generations: n8n workflow → React/Express → a TypeScript Next.js 14 hybrid on Vercel + Supabase. The blocker became the design: a Playwright screenshot service feeds a vision LLM, behind a multi-provider inference cascade with PM2-managed local services.',
    tags: ['Vision LLM', 'Multi-provider cascade', 'Next.js 14', 'Supabase', 'PM2'],
  },
  {
    h: 'Gig Hunter',
    m: 'public · 92 passing tests · plpgsql migrations',
    constraint: 'constraint → source feeds kept dying',
    p: 'An automated job-intelligence pipeline: multi-source scanning, a weighted 0–100 scoring matrix, LLM-drafted proposals, and tiered Telegram alerts — on Supabase with hand-written PLpgSQL migrations. When RSS feeds died, it moved to IMAP email parsing without dropping a day.',
    tags: ['Pipeline design', 'LLM scoring', 'Supabase', '92 tests'],
    href: 'https://github.com/SandeshKale/gig-hunter',
  },
  {
    h: 'B2B Quote Generator',
    m: '60 commits · versioned releases · live in production',
    constraint: 'constraint → non-technical users, daily, on phones',
    p: 'A quoting web app a distributor uses every day. Full lifecycle discipline at small scale: semantic versioning, protected branches for collaborator contributions, mobile-first flows, image pipelines. Shipping is a habit, not an event.',
    tags: ['Production ops', 'Branch protection', 'Real users'],
  },
  {
    h: 'Guided-Selling PWA',
    m: 'llm recommender · jest + eslint · token-managed access',
    constraint: 'constraint → the database had to be a spreadsheet',
    p: 'A retail sales assistant with an LLM combo-recommender and an in-app admin portal — Google Sheets as the datastore by client requirement, Supabase handling token management, and a full test/lint gate anyway. Constraints don\'t excuse discipline.',
    tags: ['PWA', 'LLM recommender', 'Design system'],
  },
];

export default function Lab() {
  return (
    <Section id="lab" chapter="lab">
      <Reveal>
        <Eyebrow>sys/lab</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Proof of work.
          <br />
          <span className="text-dim">Numbers from the repos, not the résumé.</span>
        </h2>
        <p className="max-w-[640px] text-mute text-lg">
          Independent builds, each shipped end to end. Every one started with a constraint
          that would have killed a tutorial project — the constraint is where architecture
          begins.
        </p>
      </Reveal>
      <div className="mt-12 grid md:grid-cols-2 gap-5">
        {BUILDS.map((b, i) => (
          <Reveal key={b.h} delay={0.07 * i}>
            <TiltCard max={6}>
              <div
                onMouseEnter={() => logEvent('lab.inspect', b.h.toLowerCase())}
                className="rounded-[14px] border hairline bg-ink/70 backdrop-blur-md p-6 h-full flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <h5 className="font-disp font-medium text-[20px]">{b.h}</h5>
                  {b.href && (
                    <a
                      href={b.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] tracking-[0.06em] text-steel hover:text-amber transition-colors shrink-0 mt-1.5"
                    >
                      view repo ↗
                    </a>
                  )}
                </div>
                <span className="font-mono text-[10px] text-dim tracking-[0.08em] block mt-1">{b.m}</span>
                <span className="font-mono text-[10.5px] text-amber/90 tracking-[0.05em] block mt-2.5 mb-2.5">
                  // {b.constraint}
                </span>
                <p className="text-[14px] text-mute flex-1">{b.p}</p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {b.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
