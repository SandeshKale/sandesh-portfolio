'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Reveal } from './primitives';
import { logEvent } from '@/lib/telemetry';

/* ============================================================
   sys/sandbox — two live modules that prove the architecture
   instead of describing it.

   1) Dynamic Graph RAG Sandbox: toggle real architectural
      parameters; the pipeline re-routes deterministically on a
      live diagram; an LLM co-processor comments on the tradeoff.
   2) Token & Latency Cost Estimator: semantic cache vs vanilla
      streaming, computed client-side, instantly.
   ============================================================ */

/* ---------------- deterministic pipeline layout ---------------- */
function buildPipeline({ mode, bias, depth }) {
  // returns nodes + edges for the SVG. Pure function — same config, same graph.
  const agents =
    mode === 'multi'
      ? [
          { id: 'planner', x: 330, y: 60, label: 'planner · frontier' },
          { id: 'exec1', x: 330, y: 150, label: 'exec · fast' },
          { id: 'exec2', x: 330, y: 240, label: 'exec · fast' },
        ]
      : [{ id: 'mono', x: 330, y: 150, label: 'monolithic ctx' }];

  const retrieval = Array.from({ length: depth }, (_, i) => ({
    id: `hop${i}`,
    x: 180,
    y: 240 + i * 0, // stacked visually via offset below
    label: `graph hop ${i + 1}`,
  }));

  return { agents, retrieval };
}

function estimate({ mode, bias, depth }) {
  // illustrative model — labelled as such in the UI
  const base = mode === 'multi' ? 380 : 620; // ms
  const hopCost = depth * 90;
  const cacheSave = bias * 260; // latency-bias leans on the semantic cache
  const latency = Math.max(140, Math.round(base + hopCost - cacheSave));
  const accuracy = Math.min(
    98,
    Math.round(62 + depth * 8 + (mode === 'multi' ? 9 : 0) + (1 - bias) * 14)
  );
  const tokens = Math.round(
    (mode === 'multi' ? 2600 : 4800) * (1 + depth * 0.35) * (1 - bias * 0.4)
  );
  return { latency, accuracy, tokens };
}

function RagSandbox() {
  const [mode, setMode] = useState('multi'); // multi | mono
  const [bias, setBias] = useState(0.5); // 0 accuracy … 1 latency
  const [depth, setDepth] = useState(2); // 1..3
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const cfg = { mode, bias, depth };
  const est = useMemo(() => estimate(cfg), [mode, bias, depth]);
  const cacheStrength = 0.25 + bias * 0.75;
  const graphKey = `${mode}-${depth}-${Math.round(bias * 4)}`;

  async function consult() {
    if (busy) return;
    setBusy(true);
    setNote('');
    logEvent('sandbox.consult', graphKey);
    try {
      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'sandbox',
          config: {
            topology: mode === 'multi' ? 'planner + 2 execution agents' : 'single monolithic context',
            bias: bias > 0.66 ? 'latency-first' : bias < 0.33 ? 'accuracy-first' : 'balanced',
            graphDepth: depth,
            estLatencyMs: est.latency,
            estAccuracy: est.accuracy,
            estTokensPerQuery: est.tokens,
          },
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'inference failed');
      setNote(data.text);
    } catch (e) {
      setNote(`// ${e.message}`);
    } finally {
      setBusy(false);
    }
  }

  const agentNodes =
    mode === 'multi'
      ? [
          { x: 352, y: 52, label: 'planner·frontier' },
          { x: 352, y: 140, label: 'exec·fast' },
          { x: 352, y: 228, label: 'exec·fast' },
        ]
      : [{ x: 352, y: 140, label: 'monolithic·ctx' }];

  return (
    <div className="rounded-[14px] border hairline bg-ink/70 backdrop-blur-md overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b hairline font-mono text-[10.5px] tracking-[0.08em] text-mute uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
        dynamic graph rag sandbox · deterministic routing, live
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-0">
        {/* controls */}
        <div className="p-5 border-b lg:border-b-0 lg:border-r hairline space-y-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2">Topology</div>
            <div className="flex rounded-lg border hairline-strong overflow-hidden font-mono text-[11px]">
              {[
                ['multi', 'multi-agent'],
                ['mono', 'monolithic'],
              ].map(([v, l]) => (
                <button
                  key={v}
                  data-hot
                  onClick={() => { setMode(v); setNote(''); logEvent('sandbox.toggle', `topology=${v}`); }}
                  className={`flex-1 px-3 py-2 transition-colors ${mode === v ? 'bg-amber/15 text-amber' : 'text-mute hover:text-mist'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2 flex justify-between">
              <span>Accuracy</span><span>Latency</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.25" value={bias}
              onChange={(e) => { setBias(+e.target.value); setNote(''); }}
              onMouseUp={() => logEvent('sandbox.bias', bias > 0.5 ? 'latency-first' : 'accuracy-first')}
              className="w-full accent-[#F0B34C]"
              aria-label="Latency versus accuracy bias"
            />
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2">Graph search depth</div>
            <div className="flex gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  key={d} data-hot
                  onClick={() => { setDepth(d); setNote(''); logEvent('sandbox.depth', `${d} hops`); }}
                  className={`w-9 h-9 rounded-lg border font-mono text-[12px] transition-colors ${depth === d ? 'border-amber text-amber bg-amber/10' : 'hairline-strong text-mute hover:text-mist'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-dashed hairline font-mono text-[11px] space-y-1.5">
            <div className="flex justify-between text-mute"><span>p50 latency</span><span className="text-amber">{est.latency} ms</span></div>
            <div className="flex justify-between text-mute"><span>answer quality</span><span className="text-amber">{est.accuracy}%</span></div>
            <div className="flex justify-between text-mute"><span>tokens / query</span><span className="text-amber">{est.tokens.toLocaleString()}</span></div>
            <div className="text-[9.5px] text-dim pt-1">illustrative model — relative, not vendor quotes</div>
          </div>
        </div>

        {/* live diagram */}
        <div className="p-5">
          <svg viewBox="0 0 640 290" className="w-full h-auto" role="img" aria-label="Live RAG pipeline diagram that re-routes as parameters change">
            <AnimatePresence mode="popLayout">
              <motion.g key={graphKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
                {/* edges */}
                <path id="sb-in" d="M78,140 C110,140 118,140 148,140" fill="none" stroke="rgba(231,236,246,.18)" strokeWidth="1.2" />
                {/* router → cache (thickness = cache reliance) */}
                <path id="sb-cache" d="M212,118 C232,92 244,80 268,72" fill="none" stroke="rgba(240,179,76,.75)" strokeWidth={1 + cacheStrength * 3} />
                <path id="sb-cache-out" d="M300,72 C430,60 520,96 560,128" fill="none" stroke="rgba(240,179,76,.45)" strokeWidth={0.8 + cacheStrength * 2} strokeDasharray="3 4" />
                {/* router → retrieval hops */}
                {Array.from({ length: depth }, (_, i) => (
                  <path key={i} id={`sb-hop-${i}`} d={`M206,162 C220,${196 + i * 26} 232,${206 + i * 26} 252,${210 + i * 26}`} fill="none" stroke="rgba(124,150,196,.55)" strokeWidth="1.2" />
                ))}
                {/* retrieval → agents */}
                {agentNodes.map((a, i) => (
                  <path key={`ra${i}`} d={`M316,${210 + (depth - 1) * 13} C330,${(210 + a.y) / 2 + 20} 336,${a.y + 34} 348,${a.y + 22}`} fill="none" stroke="rgba(124,150,196,.4)" strokeWidth="1" />
                ))}
                {/* agents → guardrail */}
                {agentNodes.map((a, i) => (
                  <path key={`ag${i}`} id={`sb-ag-${i}`} d={`M446,${a.y + 16} C470,${a.y + 16} 476,${148} 496,148`} fill="none" stroke="rgba(231,236,246,.2)" strokeWidth="1.1" />
                ))}
                <path id="sb-out" d="M552,148 C560,148 560,140 566,138" fill="none" stroke="rgba(95,191,138,.6)" strokeWidth="1.4" />

                {/* packets */}
                {[0, 1, 2].map((i) => (
                  <circle key={`pk${i}`} r="3" fill="#F0B34C" opacity="0.9">
                    <animateMotion dur={`${1.6 + i * 0.5}s`} begin={`${i * 0.4}s`} repeatCount="indefinite">
                      <mpath href="#sb-cache" />
                    </animateMotion>
                  </circle>
                ))}
                {Array.from({ length: depth }, (_, i) => (
                  <circle key={`hpk${i}`} r="2.6" fill="#7C96C4" opacity="0.9">
                    <animateMotion dur={`${1.8 + i * 0.4}s`} begin={`${i * 0.5}s`} repeatCount="indefinite">
                      <mpath href={`#sb-hop-${i}`} />
                    </animateMotion>
                  </circle>
                ))}

                {/* nodes */}
                {[
                  { x: 30, y: 122, w: 48, l: 'query' },
                  { x: 148, y: 122, w: 64, l: 'router' },
                  { x: 268, y: 54, w: 92, l: `sem-cache ${Math.round(cacheStrength * 100)}%`, amber: true },
                  { x: 496, y: 130, w: 56, l: 'guard' },
                  { x: 566, y: 122, w: 52, l: 'resp', ok: true },
                ].map((n) => (
                  <g key={n.l}>
                    <rect x={n.x} y={n.y} width={n.w} height="36" rx="8"
                      fill={n.amber ? 'rgba(240,179,76,.08)' : n.ok ? 'rgba(95,191,138,.07)' : '#141926'}
                      stroke={n.amber ? '#F0B34C' : n.ok ? 'rgba(95,191,138,.6)' : 'rgba(231,236,246,.16)'} />
                    <text x={n.x + n.w / 2} y={n.y + 22} textAnchor="middle"
                      fill={n.amber ? '#F0B34C' : n.ok ? '#5FBF8A' : '#8A92A6'}
                      style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9.5 }}>{n.l}</text>
                  </g>
                ))}
                {Array.from({ length: depth }, (_, i) => (
                  <g key={`hopn${i}`}>
                    <rect x={252} y={196 + i * 26} width="64" height="20" rx="6" fill="#141926" stroke="rgba(124,150,196,.4)" />
                    <text x={284} y={210 + i * 26} textAnchor="middle" fill="#7C96C4" style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 8.5 }}>
                      hop {i + 1}
                    </text>
                  </g>
                ))}
                {agentNodes.map((a) => (
                  <g key={a.label}>
                    <rect x={348} y={a.y} width="98" height="32" rx="8" fill="#141926" stroke="rgba(231,236,246,.2)" />
                    <text x={397} y={a.y + 20} textAnchor="middle" fill="#c8d4ea" style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9 }}>
                      {a.label}
                    </text>
                  </g>
                ))}
              </motion.g>
            </AnimatePresence>
          </svg>

          <div className="mt-3 flex items-start gap-3 flex-wrap">
            <button onClick={consult} disabled={busy} data-hot
              className="font-mono text-[11px] tracking-[0.08em] px-4 py-2 rounded-lg border border-amber/50 text-amber hover:bg-amber/10 disabled:opacity-40 transition-colors shrink-0">
              {busy ? 'consulting…' : '▸ architect’s note on this config'}
            </button>
            <AnimatePresence>
              {note && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="font-mono text-[12px] leading-[1.75] text-mute flex-1 min-w-[240px]">
                  {note}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- cost estimator ---------------- */
const COMPLEXITY = {
  light: { label: 'light · 1.2k tok', tokens: 1200 },
  standard: { label: 'standard · 4k tok', tokens: 4000 },
  heavy: { label: 'heavy · 12k tok', tokens: 12000 },
};
const PRICE_PER_M = 2.4; // illustrative blended $/M tokens
const VANILLA_P50 = 900; // ms
const CACHED_P50 = 120; // ms on hit

function CostEstimator() {
  const [volume, setVolume] = useState(50000); // queries/day
  const [cx, setCx] = useState('standard');
  const [hit, setHit] = useState(0.45);

  const t = COMPLEXITY[cx].tokens;
  const vanillaMonthly = (volume * 30 * t * PRICE_PER_M) / 1e6;
  const cachedMonthly = (volume * 30 * (1 - hit) * t * PRICE_PER_M) / 1e6;
  const savings = vanillaMonthly - cachedMonthly;
  const blendedP50 = Math.round(hit * CACHED_P50 + (1 - hit) * VANILLA_P50);
  const maxBar = Math.max(vanillaMonthly, 1);

  return (
    <div className="rounded-[14px] border hairline bg-ink/70 backdrop-blur-md overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b hairline font-mono text-[10.5px] tracking-[0.08em] text-mute uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
        token &amp; latency cost estimator · semantic cache vs vanilla streaming
      </div>
      <div className="p-5 grid md:grid-cols-[240px_1fr] gap-6">
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2">
              Query volume · {volume.toLocaleString()}/day
            </div>
            <input type="range" min="1000" max="500000" step="1000" value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              onMouseUp={() => logEvent('estimator.volume', `${volume}/day`)}
              className="w-full accent-[#F0B34C]" aria-label="Daily query volume" />
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2">Structural complexity</div>
            <div className="flex flex-col gap-1.5 font-mono text-[11px]">
              {Object.entries(COMPLEXITY).map(([k, v]) => (
                <button key={k} data-hot onClick={() => setCx(k)}
                  className={`text-left px-3 py-1.5 rounded-lg border transition-colors ${cx === k ? 'border-amber text-amber bg-amber/10' : 'hairline-strong text-mute hover:text-mist'}`}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2">
              Semantic cache hit-rate · {Math.round(hit * 100)}%
            </div>
            <input type="range" min="0" max="0.85" step="0.05" value={hit}
              onChange={(e) => setHit(+e.target.value)}
              onMouseUp={() => logEvent('estimator.hitrate', `${Math.round(hit * 100)}%`)}
              className="w-full accent-[#F0B34C]" aria-label="Semantic cache hit rate" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5">
          {[
            ['vanilla streaming', vanillaMonthly, 'bg-steel/60', `${VANILLA_P50} ms p50`],
            ['with semantic cache', cachedMonthly, 'bg-amber', `${blendedP50} ms blended p50`],
          ].map(([label, val, cls, lat]) => (
            <div key={label}>
              <div className="flex justify-between font-mono text-[11px] text-mute mb-1.5">
                <span>{label}</span>
                <span className="text-mist">${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo · {lat}</span>
              </div>
              <div className="h-4 rounded bg-panel2 overflow-hidden">
                <motion.div className={`h-full ${cls}`} animate={{ width: `${(val / maxBar) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
              </div>
            </div>
          ))}
          <div className="font-mono text-[12px] text-mute pt-1">
            architecture dividend:{' '}
            <span className="text-ok">
              ${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
            </span>{' '}
            · {Math.round((savings / (vanillaMonthly || 1)) * 100)}% cost ·{' '}
            {Math.round(((VANILLA_P50 - blendedP50) / VANILLA_P50) * 100)}% latency
            <div className="text-[9.5px] text-dim mt-1.5">
              illustrative reference pricing — the shape of the curve is the point, not the vendor quote
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Sandbox() {
  return (
    <Section id="sandbox" chapter="sandbox">
      <Reveal>
        <div className="eyebrow">sys/sandbox</div>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Don&apos;t take the copy&apos;s word.
          <br />
          <span className="text-dim">Route traffic yourself.</span>
        </h2>
        <p className="max-w-[660px] text-mute text-lg">
          Two live modules. Re-route a RAG pipeline with real architectural levers and
          watch where the semantic cache injects, how the router triages, where the
          guardrail intercepts — then let the LLM co-processor argue the tradeoff. Below
          it, the economics of the cache itself.
        </p>
      </Reveal>
      <div className="mt-12 space-y-6">
        <Reveal delay={0.15}><RagSandbox /></Reveal>
        <Reveal delay={0.2}><CostEstimator /></Reveal>
      </div>
    </Section>
  );
}
