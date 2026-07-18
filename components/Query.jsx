'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Reveal } from './primitives';
import { logEvent, getHistory } from '@/lib/telemetry';

/* sys/query — the portfolio answers for itself.
   Left: an inference terminal grounded in Sandesh's real career data.
   Right: the visitor's own telemetry, compiled by an LLM into an
   SRE-style post-session review. The site reads you back. */

const SUGGESTIONS = [
  'has he integrated AI into legacy enterprise systems?',
  'what did he do with kafka in production?',
  'can he bridge a mainframe to the cloud?',
  'why do enterprise AI projects fail?',
];

function useTypewriter() {
  const [display, setDisplay] = useState('');
  const timer = useRef(null);

  function type(full) {
    clearInterval(timer.current);
    setDisplay('');
    let i = 0;
    timer.current = setInterval(() => {
      i += 2 + Math.floor(Math.random() * 3);
      setDisplay(full.slice(0, i));
      if (i >= full.length) clearInterval(timer.current);
    }, 14);
  }
  useEffect(() => () => clearInterval(timer.current), []);
  return [display, type, setDisplay];
}

export default function Query() {
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [answer, typeAnswer, setAnswer] = useTypewriter();
  const [report, typeReport, setReport] = useTypewriter();
  const [reportBusy, setReportBusy] = useState(false);
  const [err, setErr] = useState('');

  async function ask(question) {
    const query = (question || q).trim();
    if (!query || busy) return;
    setErr('');
    setBusy(true);
    setAnswer('');
    logEvent('ai.query', query.slice(0, 40));
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'ask', question: query }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'inference failed');
      typeAnswer(data.text);
      logEvent('ai.response', `${data.text.length} chars`);
    } catch (e) {
      setErr(e.message);
      logEvent('ai.error', e.message.slice(0, 40));
    } finally {
      setBusy(false);
    }
  }

  async function compileReport() {
    if (reportBusy) return;
    setErr('');
    setReportBusy(true);
    setReport('');
    logEvent('ai.report.compile', `${getHistory().length} events`);
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'report', events: getHistory() }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'inference failed');
      typeReport(data.text);
    } catch (e) {
      setErr(e.message);
    } finally {
      setReportBusy(false);
    }
  }

  return (
    <Section id="query" chapter="query">
      <Reveal>
        <div className="eyebrow">sys/query</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Interrogate the architect.
          <br />
          <span className="text-dim">It answers for its owner.</span>
        </h2>
        <p className="max-w-[640px] text-mute text-lg">
          Two live AI subsystems. The terminal answers from Sandesh&apos;s real career
          record — nothing invented. The review engine reads the telemetry this page has
          been collecting about <b className="text-mist font-medium">you</b>, and writes
          it up like an incident report.
        </p>
      </Reveal>

      <div className="mt-12 grid lg:grid-cols-2 gap-6 items-start">
        {/* -------- inference terminal -------- */}
        <Reveal delay={0.15}>
          <div className="rounded-[14px] border hairline bg-panel overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b hairline font-mono text-[10.5px] tracking-[0.08em] text-mute uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
              inference terminal · grounded · llama-3.3-70b via groq
            </div>
            <div className="p-5">
              <div className="flex gap-2">
                <span className="font-mono text-amber text-sm pt-2.5 select-none">❯</span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && ask()}
                  placeholder="query the career record…"
                  maxLength={300}
                  aria-label="Ask about Sandesh's experience"
                  className="w-full bg-transparent font-mono text-sm text-mist placeholder:text-dim py-2 outline-none border-b hairline focus:border-amber/50 transition-colors"
                />
                <button
                  onClick={() => ask()}
                  disabled={busy}
                  data-hot
                  className="shrink-0 font-mono text-[11px] tracking-[0.08em] px-4 rounded-lg border hairline-strong text-amber hover:bg-amber/10 disabled:opacity-40 transition-colors"
                >
                  {busy ? 'infer…' : 'run'}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQ(s);
                      ask(s);
                    }}
                    data-hot
                    className="font-mono text-[10px] tracking-[0.04em] text-steel border border-steel/25 rounded-full px-3 py-1 hover:border-amber/60 hover:text-amber transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {(answer || busy) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-4 border-t border-dashed hairline font-mono text-[13px] leading-[1.8] text-mute whitespace-pre-wrap min-h-[40px]">
                      {busy && !answer ? (
                        <span className="text-dim">
                          routing → groq · retrieving grounded context
                          <span className="animate-pulse"> ▍</span>
                        </span>
                      ) : (
                        <>
                          {answer}
                          <span className="text-amber animate-pulse">▍</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* -------- post-session review -------- */}
        <Reveal delay={0.25}>
          <div className="rounded-[14px] border hairline bg-panel overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b hairline font-mono text-[10.5px] tracking-[0.08em] text-mute uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
              post-session review · your telemetry, compiled
            </div>
            <div className="p-5">
              <p className="text-sm text-mute mb-4">
                Since you arrived, this page has logged every chapter you opened, every
                node you inspected, every principle you lingered on. Compile it, and an
                LLM writes the incident report of your visit.
              </p>
              <button
                onClick={compileReport}
                disabled={reportBusy}
                data-hot
                className="font-mono text-[11px] tracking-[0.08em] px-5 py-2.5 rounded-lg border border-amber/50 text-amber hover:bg-amber/10 disabled:opacity-40 transition-colors"
              >
                {reportBusy ? 'compiling telemetry…' : '▸ compile my session report'}
              </button>
              <AnimatePresence>
                {(report || reportBusy) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-5 pt-4 border-t border-dashed hairline font-mono text-[12.5px] leading-[1.85] text-mute whitespace-pre-wrap">
                      {reportBusy && !report ? (
                        <span className="text-dim">
                          flushing event buffer → inference
                          <span className="animate-pulse"> ▍</span>
                        </span>
                      ) : (
                        report
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>

      {err && (
        <p className="mt-4 font-mono text-[11px] text-[#d98080] tracking-[0.04em]">
          // {err}
        </p>
      )}
      <p className="mt-6 font-mono text-[10.5px] text-dim tracking-[0.05em]">
        // grounded generation — the model answers only from the verified career record ·
        telemetry never leaves your session except to compile your report
      </p>
    </Section>
  );
}
