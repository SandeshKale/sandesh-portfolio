'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Reveal, Eyebrow } from './primitives';
import { logEvent } from '@/lib/telemetry';

/* sys/query — two live inference subsystems.
   Left: a grounded terminal that answers from the verified career record.
   Right: the Architecture Consult — describe an enterprise AI use case and
   receive a structured solution blueprint (typed JSON, rendered live).
   The blueprint IS the demonstration: structured outputs, deterministic
   contracts over a stochastic model. */

const SUGGESTIONS = [
  'has he integrated AI into legacy enterprise systems?',
  'what production llm systems has he actually shipped?',
  'can he bridge a mainframe to the cloud?',
];

const PRESETS = [
  'Claims triage copilot for an insurer',
  'KYC document intelligence for onboarding',
  'Agentic assistant over payment-ops runbooks',
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

/* ---------------- grounded terminal ---------------- */
function Terminal() {
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [answer, typeAnswer, setAnswer] = useTypewriter();
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
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="holo rounded-[14px] border hairline bg-ink/70 backdrop-blur-md overflow-hidden h-full">
      <div className="flex items-center gap-2 px-5 py-3 border-b hairline font-mono text-[10.5px] tracking-[0.08em] text-mute uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
        grounded terminal · answers only from the verified record
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
                    routing → groq · retrieving grounded context<span className="animate-pulse"> ▍</span>
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
        {err && <p className="mt-3 font-mono text-[11px] text-[#c96a6a]">// {err}</p>}
      </div>
    </div>
  );
}

/* ---------------- architecture consult ---------------- */
/* The blueprint renders as an isometric structure assembling in 3D:
   foundation blocks = component stack · pillar = the pattern · roof = guardrails.
   A raw-mode switch flattens it back into the validated JSON — the contract itself. */
function IsoBlueprint({ bp }) {
  return (
    <div className="flex justify-center py-4" style={{ perspective: 900 }} aria-hidden="true">
      <div
        className="relative w-[280px] h-[190px]"
        style={{ transform: 'rotateX(52deg) rotateZ(-38deg)', transformStyle: 'preserve-3d' }}
      >
        {/* foundation: the component stack */}
        <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 gap-1.5" style={{ transform: 'translateZ(0px)' }}>
          {(bp.stack || []).slice(0, 6).map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.09, duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
              title={c}
              className="border border-steel/50 bg-steel/10 rounded px-1.5 py-1 font-mono text-[8px] text-steel truncate shadow-[0_10px_18px_-8px_rgb(var(--c-ink))]"
            >
              {c}
            </motion.div>
          ))}
        </div>
        {/* pillar: the pattern */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          title={bp.pattern}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-amber/70 bg-amber/10 rounded px-2.5 py-2 font-mono text-[9px] text-amber text-center max-w-[170px] shadow-[0_0_22px_rgb(var(--c-amber)/.25)]"
          style={{ transform: 'translate(-50%,-50%) translateZ(34px)' }}
        >
          {bp.pattern}
        </motion.div>
        {/* roof: guardrails */}
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.5 }}
          className="absolute inset-x-4 top-0 border border-ok/60 bg-ok/10 rounded px-2 py-1.5 font-mono text-[8px] text-ok"
          style={{ transform: 'translateZ(68px)' }}
        >
          <span className="opacity-70">guardrails ·</span> {(bp.guardrails || []).length} active
        </motion.div>
      </div>
    </div>
  );
}

function Consult() {
  const [useCase, setUseCase] = useState('');
  const [busy, setBusy] = useState(false);
  const [bp, setBp] = useState(null);
  const [raw, setRaw] = useState('');
  const [view, setView] = useState('structure'); // structure | json
  const [err, setErr] = useState('');

  async function consult(preset) {
    const uc = (preset || useCase).trim();
    if (!uc || busy) return;
    setErr('');
    setBusy(true);
    setBp(null);
    setRaw('');
    setView('structure');
    logEvent('ai.consult', uc.slice(0, 40));
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'consult', useCase: uc }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'inference failed');
      const clean = data.text.replace(/```json|```/g, '').trim();
      try {
        const parsed = JSON.parse(clean);
        setBp(parsed);
      } catch {
        setRaw(data.text); // graceful degradation: show prose
      }
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="holo rounded-[14px] border hairline bg-ink/70 backdrop-blur-md overflow-hidden h-full">
      <div className="flex items-center gap-2 px-5 py-3 border-b hairline font-mono text-[10.5px] tracking-[0.08em] text-mute uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
        architecture consult · structured blueprint, live
      </div>
      <div className="p-5">
        <p className="text-sm text-mute mb-3">
          Describe an enterprise AI use case. The consult returns a{' '}
          <span className="text-mist">typed solution blueprint</span> — pattern, stack,
          guardrails, first step — generated as validated JSON and rendered here. The
          contract is the point.
        </p>
        <div className="flex gap-2">
          <input
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && consult()}
            placeholder="e.g. underwriting assistant for life insurance…"
            maxLength={240}
            aria-label="Describe your enterprise AI use case"
            className="w-full bg-transparent font-mono text-sm text-mist placeholder:text-dim py-2 outline-none border-b hairline focus:border-amber/50 transition-colors"
          />
          <button
            onClick={() => consult()}
            disabled={busy}
            data-hot
            className="shrink-0 font-mono text-[11px] tracking-[0.08em] px-4 rounded-lg border border-amber/50 text-amber hover:bg-amber/10 disabled:opacity-40 transition-colors"
          >
            {busy ? 'drafting…' : 'consult'}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setUseCase(s);
                consult(s);
              }}
              data-hot
              className="font-mono text-[10px] tracking-[0.04em] text-steel border border-steel/25 rounded-full px-3 py-1 hover:border-amber/60 hover:text-amber transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {busy && (
            <motion.p
              key="busy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-5 font-mono text-[12px] text-dim"
            >
              schema → model → validate → render<span className="animate-pulse"> ▍</span>
            </motion.p>
          )}
          {bp && (
            <motion.div
              key="bp"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 pt-4 border-t border-dashed hairline space-y-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-[9.5px] tracking-[0.12em] text-dim uppercase">blueprint · assembled from validated json</div>
                <div className="flex rounded-lg border hairline-strong overflow-hidden font-mono text-[10px]">
                  {['structure', 'json'].map((v) => (
                    <button key={v} data-hot onClick={() => setView(v)}
                      className={`px-3 py-1 transition-colors ${view === v ? 'bg-amber/15 text-amber' : 'text-mute hover:text-mist'}`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              {view === 'structure' ? (
                <IsoBlueprint bp={bp} />
              ) : (
                <pre className="font-mono text-[10.5px] leading-[1.7] text-mute bg-panel2/60 rounded-lg p-3 overflow-x-auto">
{JSON.stringify(bp, null, 2)}
                </pre>
              )}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-mono text-[9.5px] tracking-[0.12em] text-dim uppercase">Pattern</div>
                  <div className="font-disp font-medium text-[19px] text-amber mt-0.5">{bp.pattern}</div>
                </div>
                {bp.complexity && (
                  <span className="font-mono text-[10px] border hairline-strong rounded-full px-3 py-1 text-mute">
                    complexity · {bp.complexity}
                  </span>
                )}
              </div>
              {Array.isArray(bp.stack) && (
                <div>
                  <div className="font-mono text-[9.5px] tracking-[0.12em] text-dim uppercase mb-1.5">Component stack</div>
                  <div className="flex flex-wrap gap-2">
                    {bp.stack.map((c) => (
                      <span key={c} className="tag">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {Array.isArray(bp.guardrails) && (
                <div>
                  <div className="font-mono text-[9.5px] tracking-[0.12em] text-dim uppercase mb-1.5">Guardrails</div>
                  <ul className="text-[13px] text-mute space-y-1">
                    {bp.guardrails.map((g) => (
                      <li key={g} className="flex gap-2">
                        <span className="text-amber">›</span>
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {bp.firstStep && (
                <div>
                  <div className="font-mono text-[9.5px] tracking-[0.12em] text-dim uppercase mb-1">Where I&apos;d start</div>
                  <p className="text-[13.5px] text-mute">{bp.firstStep}</p>
                </div>
              )}
            </motion.div>
          )}
          {raw && (
            <motion.p
              key="raw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-5 pt-4 border-t border-dashed hairline font-mono text-[12.5px] leading-[1.8] text-mute whitespace-pre-wrap"
            >
              {raw}
            </motion.p>
          )}
        </AnimatePresence>
        {err && <p className="mt-3 font-mono text-[11px] text-[#c96a6a]">// {err}</p>}
      </div>
    </div>
  );
}

export default function Query() {
  return (
    <Section id="query" chapter="query">
      <Reveal>
        <Eyebrow>sys/query</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Interrogate the architect.
          <br />
          <span className="text-dim">Then commission a blueprint.</span>
        </h2>
        <p className="max-w-[660px] text-mute text-lg">
          Both subsystems run on structured contracts over a stochastic model — grounded
          context on the left, schema-validated output on the right. Small systems,
          production discipline.
        </p>
      </Reveal>
      <div className="mt-12 grid lg:grid-cols-2 gap-6 items-stretch">
        <Reveal delay={0.15}><Terminal /></Reveal>
        <Reveal delay={0.25}><Consult /></Reveal>
      </div>
    </Section>
  );
}
