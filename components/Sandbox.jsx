'use client';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Reveal, Eyebrow } from './primitives';
import { logEvent } from '@/lib/telemetry';

/* ============================================================
   sys/sandbox — two live modules that prove the architecture.
   Rebuilt for clarity: computed layout (no hand-drawn paths),
   hover-to-explain nodes, a plain-language readout of the
   current configuration, and a numbered flow legend.
   ============================================================ */

/* ---------- geometry helpers: every edge derived from node boxes ---------- */
const H = 34;
function edge(a, b, dy = 0) {
  const x1 = a.x + a.w;
  const y1 = a.y + (a.h || H) / 2;
  const x2 = b.x;
  const y2 = b.y + (b.h || H) / 2 + dy;
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

const NODE_DESC = {
  query: 'Your question enters the system — like walking up to a help desk.',
  router: 'The traffic controller. It decides, by fixed rules (not AI guesswork): have we answered something like this before? If yes → cache. If no → go do the research.',
  cache: 'The system\u2019s memory of past answers — matched by MEANING, not exact words. A hit is instant and nearly free, and skips everything else. The thicker this line, the more questions it absorbs.',
  hop: 'One step of research in the knowledge graph. Like following a citation to its source — each extra hop digs one level deeper: more context, more seconds.',
  planner: 'The senior expert. A powerful (slower, pricier) AI that reads the task once, breaks it into pieces, and delegates.',
  exec: 'The fast juniors. Cheap, quick AI models doing the delegated pieces in parallel.',
  mono: 'One AI doing everything alone with one huge briefing document. Simpler to build — but slower and more expensive per answer.',
  guard: 'Security at the exit. Every answer is checked here — format, policy, sensitive data — before anyone sees it. Nothing ships unchecked.',
  resp: 'The final, verified answer — with a paper trail for every step it took.',
};

/* the guided tour: node order + what to say at each stop */
const TOUR = ['query', 'router', 'cache', 'hop0', 'agents', 'guard', 'resp'];
const TOUR_CAPTIONS = {
  query: 'A question arrives.',
  router: 'First stop: the router decides the cheapest safe path — by rules, not AI mood.',
  cache: 'Best case: we\u2019ve answered something with this MEANING before. Instant, nearly free.',
  hop0: 'Cache miss? The system researches — each hop follows the knowledge graph one level deeper.',
  agents: 'The research reaches the AI layer: either one big model, or a planner delegating to fast juniors.',
  guard: 'Before anything ships, the guardrail checks format, policy, and sensitive data.',
  resp: 'A verified answer, with an audit trail. That\u2019s the whole machine.',
};

function buildLayout({ mode, depth }) {
  const nodes = {
    query: { x: 26, y: 132, w: 58, label: 'query' },
    router: { x: 146, y: 132, w: 72, label: 'router' },
    cache: { x: 286, y: 38, w: 124, label: 'semantic cache', kind: 'cache' },
    guard: { x: 628, y: 132, w: 58, label: 'guard', kind: 'guard' },
    resp: { x: 706, y: 132, w: 50, label: 'resp', kind: 'ok' },
  };
  const hops = Array.from({ length: depth }, (_, i) => ({
    id: `hop${i}`,
    x: 286,
    y: 196 + i * 34,
    w: 124,
    h: 26,
    label: `graph hop ${i + 1}`,
    kind: 'hop',
  }));
  const agents =
    mode === 'multi'
      ? [
          { id: 'planner', x: 470, y: 42, w: 122, label: 'planner · frontier', kind: 'planner' },
          { id: 'exec0', x: 470, y: 126, w: 122, label: 'exec · fast', kind: 'exec' },
          { id: 'exec1', x: 470, y: 210, w: 122, label: 'exec · fast', kind: 'exec' },
        ]
      : [{ id: 'mono', x: 470, y: 126, w: 122, h: 46, label: 'monolithic context', kind: 'mono' }];
  return { nodes, hops, agents };
}

function estimate({ mode, bias, depth }) {
  const base = mode === 'multi' ? 380 : 620;
  const latency = Math.max(140, Math.round(base + depth * 90 - bias * 260));
  const accuracy = Math.min(98, Math.round(62 + depth * 8 + (mode === 'multi' ? 9 : 0) + (1 - bias) * 14));
  const tokens = Math.round((mode === 'multi' ? 2600 : 4800) * (1 + depth * 0.35) * (1 - bias * 0.4));
  return { latency, accuracy, tokens };
}

function RagSandbox() {
  const [mode, setMode] = useState('multi');
  const [bias, setBias] = useState(0.5);
  const [depth, setDepth] = useState(2);
  const [focus, setFocus] = useState(null); // hovered node key for the explainer bar
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [chaos, setChaos] = useState(false);
  const [tour, setTour] = useState(-1); // -1 off, else index into TOUR

  const est = useMemo(() => estimate({ mode, bias, depth }), [mode, bias, depth]);
  const tourStop = tour >= 0 ? TOUR[tour] : null;
  const tourNodeId =
    tourStop === 'agents' ? (mode === 'multi' ? 'planner' : 'mono') : tourStop;
  function advanceTour() {
    setTour((t) => (t + 1 >= TOUR.length ? -1 : t + 1));
  }
  const { nodes, hops, agents } = useMemo(() => buildLayout({ mode, depth }), [mode, depth]);
  const cachePct = Math.round((0.2 + bias * 0.6) * 100);
  const graphKey = `${mode}-${depth}-${Math.round(bias * 4)}-${chaos ? 'x' : 'o'}`;

  const chaosSummary =
    'SYSTEM STRESS ACTIVE — the agent tier is failing. Watch the response: red packets die at the guardrail (contained, never shipped), while the router falls back to cached-answers-only mode along the green path. Degraded, honest, up.';
  const summary =
    `${bias > 0.66 ? 'Latency-first' : bias < 0.33 ? 'Accuracy-first' : 'Balanced'}: ` +
    `~${cachePct}% of queries are answered straight from the semantic cache. ` +
    `Misses take ${depth} graph hop${depth > 1 ? 's' : ''} into retrieval, then ` +
    `${mode === 'multi' ? 'a planner delegates to two fast execution models' : 'a single model with one large context'}. ` +
    `Every answer passes the guardrail.`;

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
            cacheHitPct: cachePct,
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

  const kindStyle = (k, active) => ({
    fill:
      k === 'cache' ? 'rgba(240,179,76,.09)'
      : k === 'guard' ? 'rgba(200,120,120,.08)'
      : k === 'ok' ? 'rgba(95,191,138,.08)'
      : 'rgb(var(--c-panel2))',
    stroke: active
      ? 'rgb(var(--c-amber))'
      : k === 'cache' ? 'rgb(var(--c-amber) / .8)'
      : k === 'ok' ? 'rgb(var(--c-ok) / .7)'
      : 'var(--line-strong)',
  });

  function NodeBox({ id, n }) {
    const k = focus === id || tourNodeId === id;
    const st = kindStyle(n.kind, k);
    const descKey = n.kind === 'hop' ? 'hop' : n.kind || id;
    return (
      <g
        tabIndex={0}
        data-hot
        onMouseEnter={() => { setFocus(id); logEvent('sandbox.node', id); }}
        onFocus={() => setFocus(id)}
        onMouseLeave={() => setFocus(null)}
        className="cursor-pointer outline-none"
        aria-label={`${n.label}: ${NODE_DESC[descKey]}`}
      >
        <rect x={n.x} y={n.y} width={n.w} height={n.h || H} rx="8" fill={st.fill} stroke={st.stroke} strokeWidth={k ? 1.6 : 1} style={{ transition: 'all .25s' }} />
        <text x={n.x + n.w / 2} y={n.y + (n.h || H) / 2 + 3.5} textAnchor="middle"
          fill={k ? 'rgb(var(--c-amber))' : 'rgb(var(--c-mute))'}
          style={{ fontFamily: '"JetBrains Mono",monospace', fontSize: 9.5, transition: 'fill .25s' }}>
          {n.label}
        </text>
      </g>
    );
  }

  const lastHop = hops[hops.length - 1];

  return (
    <div className="holo rounded-[14px] border hairline bg-ink/70 backdrop-blur-md overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b hairline font-mono text-[10.5px] tracking-[0.08em] text-mute uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
        dynamic graph rag sandbox
      </div>

      {/* plain-language intro */}
      <div className="px-5 py-3 border-b hairline text-[13px] text-mute leading-[1.7]">
        <span className="text-mist font-medium">What is this?</span> A live model of how a
        serious AI system answers a question. It doesn&apos;t just &quot;ask ChatGPT&quot; — a question is
        triaged, maybe answered from memory, maybe researched, reasoned over, and
        security-checked before anyone sees it. The three levers on the left are the real
        decisions an architect makes. Move them and watch the machine re-route.
        <button
          data-hot
          onClick={() => { setTour(0); logEvent('sandbox.tour', 'started'); }}
          className="ml-2 font-mono text-[11px] text-amber border border-amber/50 rounded-full px-3 py-0.5 hover:bg-amber/10 transition-colors"
        >
          ▸ 30-second guided tour
        </button>
      </div>

      {/* numbered flow legend */}
      <div className="px-5 py-2.5 border-b hairline flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] tracking-[0.04em] text-dim">
        {['1 question in', '2 router triages', '3 memory or research', '4 AI reasons', '5 security check', '6 answer out'].map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      <div className="grid lg:grid-cols-[248px_1fr]">
        {/* controls */}
        <div className="p-5 border-b lg:border-b-0 lg:border-r hairline space-y-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2">Topology</div>
            <div className="flex rounded-lg border hairline-strong overflow-hidden font-mono text-[11px]">
              {[['multi', 'multi-agent'], ['mono', 'monolithic']].map(([v, l]) => (
                <button key={v} data-hot
                  onClick={() => { setMode(v); setNote(''); logEvent('sandbox.toggle', `topology=${v}`); }}
                  className={`flex-1 px-3 py-2 transition-colors ${mode === v ? 'bg-amber/15 text-amber' : 'text-mute hover:text-mist'}`}>
                  {l}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[10.5px] text-dim leading-[1.5]">one big AI vs. a planner delegating to fast helpers</p>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2 flex justify-between">
              <span>← accuracy</span><span>latency →</span>
            </div>
            <input type="range" min="0" max="1" step="0.25" value={bias}
              onChange={(e) => { setBias(+e.target.value); setNote(''); }}
              className="w-full accent-[rgb(var(--c-amber))]"
              aria-label="Latency versus accuracy bias" />
            <p className="mt-1.5 text-[10.5px] text-dim leading-[1.5]">right = faster &amp; cheaper (lean on memory) · left = deeper &amp; slower (always research)</p>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2">Graph search depth</div>
            <div className="flex gap-2">
              {[1, 2, 3].map((d) => (
                <button key={d} data-hot
                  onClick={() => { setDepth(d); setNote(''); logEvent('sandbox.depth', `${d} hops`); }}
                  className={`w-9 h-9 rounded-lg border font-mono text-[12px] transition-colors ${depth === d ? 'border-amber text-amber bg-amber/10' : 'hairline-strong text-mute hover:text-mist'}`}>
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[10.5px] text-dim leading-[1.5]">how many levels deep the research digs before answering</p>
          </div>
          <div className="pt-3 border-t border-dashed hairline font-mono text-[11px] space-y-1.5">
            <div className="flex justify-between text-mute"><span>p50 latency</span><span className={chaos ? 'text-[#d97a5a]' : 'text-amber'}>{chaos ? est.latency + 180 : est.latency} ms</span></div>
            <div className="flex justify-between text-mute"><span>answer quality</span><span className={chaos ? 'text-[#d97a5a]' : 'text-amber'}>{chaos ? 'cached-only' : est.accuracy + '%'}</span></div>
            <div className="flex justify-between text-mute"><span>tokens / query</span><span className="text-amber">{chaos ? Math.round(est.tokens * 0.3).toLocaleString() : est.tokens.toLocaleString()}</span></div>
            {chaos && <div className="flex justify-between text-mute"><span>errors shipped</span><span className="text-ok">0 · guardrail held</span></div>}
            <div className="text-[9.5px] text-dim pt-1">illustrative model — relative, not vendor quotes</div>
          </div>

          {/* the big red switch */}
          <button
            data-hot
            onClick={() => { setChaos((c) => !c); setNote(''); logEvent('sandbox.chaos', chaos ? 'recovered' : 'stress-injected'); }}
            aria-pressed={chaos}
            className={`w-full font-mono text-[11px] tracking-[0.1em] uppercase px-3 py-2.5 rounded-lg border transition-all ${
              chaos
                ? 'border-[#c96a6a] text-[#d97a5a] bg-[#c96a6a]/10 animate-pulse'
                : 'border-[#c96a6a]/50 text-[#c98a8a] hover:bg-[#c96a6a]/10'
            }`}
          >
            {chaos ? '■ restore agent tier' : '⚠ introduce system stress'}
          </button>
        </div>

        {/* live diagram */}
        <div className="p-5">
          <svg viewBox="0 0 760 288" className="w-full h-auto" role="img"
            aria-label="Live RAG pipeline: query, router, semantic cache, graph retrieval hops, agents, guardrail, response">
            <motion.g key={graphKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className={chaos ? "sb-shake" : ""}>
              {/* edges — all computed from node geometry */}
              <path id="e-qr" d={edge(nodes.query, nodes.router)} fill="none" stroke="var(--line-strong)" strokeWidth="1.2" />
              <path id="e-rc" d={edge(nodes.router, nodes.cache)} fill="none" stroke="rgb(var(--c-amber) / .75)" strokeWidth={1 + (cachePct / 100) * 3.2} />
              <path id="e-cg" d={edge(nodes.cache, nodes.guard, -8)} fill="none" stroke="rgb(var(--c-amber) / .45)" strokeWidth={0.8 + (cachePct / 100) * 2} strokeDasharray="3 4" />
              <path id="e-rh" d={edge(nodes.router, hops[0])} fill="none" stroke="rgb(var(--c-steel) / .55)" strokeWidth="1.2" />
              {hops.slice(0, -1).map((h, i) => (
                <path key={`hh${i}`} d={edge(h, hops[i + 1])} fill="none" stroke="rgb(var(--c-steel) / .45)" strokeWidth="1" />
              ))}
              {agents.map((a) => (
                <path key={`ha-${a.id}`} d={edge(lastHop, a)} fill="none" stroke="rgb(var(--c-steel) / .4)" strokeWidth="1" />
              ))}
              {agents.map((a, i) => (
                <path key={`ag-${a.id}`} id={`e-ag-${i}`} d={edge(a, nodes.guard)} fill="none" stroke="var(--line-strong)" strokeWidth="1.1" />
              ))}
              <path id="e-gr" d={edge(nodes.guard, nodes.resp)} fill="none" stroke="rgb(var(--c-ok) / .6)" strokeWidth="1.4" />
              {chaos && (
                <path
                  id="e-fallback"
                  d={`M${nodes.router.x + nodes.router.w / 2},${nodes.router.y + H} C${nodes.router.x + 60},268 ${nodes.guard.x - 60},268 ${nodes.guard.x + nodes.guard.w / 2},${nodes.guard.y + H}`}
                  fill="none" stroke="rgb(var(--c-ok) / .8)" strokeWidth="1.6" strokeDasharray="5 4"
                />
              )}

              {/* packets — restart cleanly on config change via graphKey */}
              {[0, 1].map((i) => (
                <circle key={`p-rc${i}`} r="3" fill="rgb(var(--c-amber))" opacity="0.9">
                  <animateMotion dur={`${1.5 + i * 0.6}s`} begin={`${i * 0.5}s`} repeatCount="indefinite"><mpath href="#e-rc" /></animateMotion>
                </circle>
              ))}
              <circle r="2.8" fill="rgb(var(--c-amber))" opacity="0.75">
                <animateMotion dur="2.1s" begin="0.3s" repeatCount="indefinite"><mpath href="#e-cg" /></animateMotion>
              </circle>
              <circle r="2.8" fill="rgb(var(--c-steel))" opacity="0.9">
                <animateMotion dur="1.9s" repeatCount="indefinite"><mpath href="#e-rh" /></animateMotion>
              </circle>
              {agents.map((a, i) => (
                <circle key={`p-ag${i}`} r={chaos ? 3.2 : 2.6} fill={chaos ? '#c96a6a' : 'rgb(var(--c-steel))'} opacity="0.9">
                  <animateMotion dur={`${1.7 + i * 0.4}s`} begin={`${i * 0.6}s`} repeatCount="indefinite"><mpath href={`#e-ag-${i}`} /></animateMotion>
                  {chaos && <animate attributeName="opacity" values="0.9;0.9;0" keyTimes="0;0.85;1" dur={`${1.7 + i * 0.4}s`} repeatCount="indefinite" />}
                </circle>
              ))}
              {chaos && (
                <>
                  {/* guardrail flare */}
                  <circle cx={nodes.guard.x + nodes.guard.w / 2} cy={nodes.guard.y + H / 2} r="26" fill="none" stroke="#c96a6a" strokeWidth="1">
                    <animate attributeName="r" values="18;30;18" dur="1.1s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.7;0;0.7" dur="1.1s" repeatCount="indefinite" />
                  </circle>
                  {/* fallback traffic */}
                  {[0, 1].map((i) => (
                    <circle key={`fb${i}`} r="3" fill="rgb(var(--c-ok))" opacity="0.9">
                      <animateMotion dur={`${1.6 + i * 0.5}s`} begin={`${i * 0.7}s`} repeatCount="indefinite"><mpath href="#e-fallback" /></animateMotion>
                    </circle>
                  ))}
                </>
              )}
              <circle r="3" fill="rgb(var(--c-ok))" opacity="0.9">
                <animateMotion dur="1.4s" repeatCount="indefinite"><mpath href="#e-gr" /></animateMotion>
              </circle>

              {/* nodes */}
              {Object.entries(nodes).map(([id, n]) => (
                <NodeBox key={id} id={id} n={n} />
              ))}
              {hops.map((h) => (
                <NodeBox key={h.id} id={h.id} n={h} />
              ))}
              {agents.map((a) => (
                <NodeBox key={a.id} id={a.id} n={a} />
              ))}
            </motion.g>
          </svg>

          {/* explainer bar: tour > hover > summary */}
          <div className="mt-2 min-h-[46px] rounded-lg border border-dashed hairline px-3.5 py-2 font-mono text-[11.5px] leading-[1.6] text-mute">
            {tour >= 0 ? (
              <div className="flex items-start justify-between gap-3">
                <span>
                  <span className="text-amber">tour {tour + 1}/{TOUR.length}</span>{' '}
                  {TOUR_CAPTIONS[TOUR[tour]]}
                </span>
                <span className="flex gap-2 shrink-0">
                  <button data-hot onClick={advanceTour}
                    className="text-amber border border-amber/50 rounded px-2.5 py-0.5 hover:bg-amber/10 transition-colors">
                    {tour + 1 >= TOUR.length ? 'done' : 'next →'}
                  </button>
                  <button data-hot onClick={() => setTour(-1)} className="text-dim hover:text-mist transition-colors">✕</button>
                </span>
              </div>
            ) : focus ? (
              NODE_DESC[
                focus.startsWith('hop') ? 'hop'
                : focus.startsWith('exec') ? 'exec'
                : focus
              ] || NODE_DESC[(nodes[focus] || {}).kind] || ''
            ) : (
              <span className={chaos ? 'text-[#d97a5a]' : 'text-dim'}>{chaos ? chaosSummary : <>hover any node to see what it does · {summary}</>}</span>
            )}
          </div>

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

/* ---------------- cost estimator (with plain-language readout) ---------------- */
const COMPLEXITY = {
  light: { label: 'light · 1.2k tok', tokens: 1200 },
  standard: { label: 'standard · 4k tok', tokens: 4000 },
  heavy: { label: 'heavy · 12k tok', tokens: 12000 },
};
const PRICE_PER_M = 2.4;
const VANILLA_P50 = 900;
const CACHED_P50 = 120;

function CostEstimator() {
  const [volume, setVolume] = useState(50000);
  const [cx, setCx] = useState('standard');
  const [hit, setHit] = useState(0.45);

  const t = COMPLEXITY[cx].tokens;
  const vanillaMonthly = (volume * 30 * t * PRICE_PER_M) / 1e6;
  const cachedMonthly = (volume * 30 * (1 - hit) * t * PRICE_PER_M) / 1e6;
  const savings = vanillaMonthly - cachedMonthly;
  const blendedP50 = Math.round(hit * CACHED_P50 + (1 - hit) * VANILLA_P50);
  const maxBar = Math.max(vanillaMonthly, 1);

  return (
    <div className="holo rounded-[14px] border hairline bg-ink/70 backdrop-blur-md overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b hairline font-mono text-[10.5px] tracking-[0.08em] text-mute uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
        token &amp; latency cost estimator
      </div>
      <div className="px-5 py-2.5 border-b hairline font-mono text-[10.5px] text-dim">
        same traffic, two architectures: vanilla streaming vs a semantic cache in front of the model.
        drag the sliders — the bars answer.
      </div>
      <div className="p-5 grid md:grid-cols-[248px_1fr] gap-6">
        <div className="space-y-6">
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] text-dim uppercase mb-2">
              Query volume · {volume.toLocaleString()}/day
            </div>
            <input type="range" min="1000" max="500000" step="1000" value={volume}
              onChange={(e) => setVolume(+e.target.value)}
              className="w-full accent-[rgb(var(--c-amber))]" aria-label="Daily query volume" />
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
              className="w-full accent-[rgb(var(--c-amber))]" aria-label="Semantic cache hit rate" />
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
            <span className="text-ok">${savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo</span>{' '}
            · {Math.round((savings / (vanillaMonthly || 1)) * 100)}% cost · {Math.round(((VANILLA_P50 - blendedP50) / VANILLA_P50) * 100)}% latency
            <div className="text-[9.5px] text-dim mt-1.5">
              illustrative reference pricing — the shape of the curve is the point
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
        <Eyebrow>sys/sandbox</Eyebrow>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="h2">
          Don&apos;t take the copy&apos;s word.
          <br />
          <span className="text-dim">Route traffic yourself.</span>
        </h2>
        <p className="max-w-[660px] text-mute text-lg">
          A live RAG pipeline with three real architectural levers. Change one, watch the
          system re-route, hover any node to learn its job — then let the LLM co-processor
          argue the tradeoff. Below it: what the semantic cache does to the bill.
        </p>
      </Reveal>
      <div className="mt-12 space-y-6">
        <Reveal delay={0.15}><RagSandbox /></Reveal>
        <Reveal delay={0.2}><CostEstimator /></Reveal>
      </div>
    </Section>
  );
}
