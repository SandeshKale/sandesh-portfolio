// Tiny pub/sub for the session telemetry console.
// Every meaningful visitor interaction publishes here.
// `history` keeps the full session — raw material for the AI post-session review.
const listeners = new Set();
const history = [];

export function logEvent(evt, detail = '') {
  const entry = { evt, detail, at: new Date() };
  history.push({ evt, detail, t: entry.at.toTimeString().slice(0, 8) });
  if (history.length > 120) history.shift();
  listeners.forEach((fn) => fn(entry));
}

export function getHistory() {
  return [...history];
}

export function onEvent(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
