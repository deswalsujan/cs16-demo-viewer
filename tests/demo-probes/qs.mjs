import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2]));
const ev = (i) => (d.events[i] || '').replace(/^events\//, '').replace(/\.sc$/, '');
const zid = +Object.entries(d.sounds).find(([k, v]) => /zoom/.test(v))[0];
const clicks = {}; for (let i = 0; i < d.snds.length; i += 10) if (d.snds[i + 1] === zid) (clicks[d.snds[i + 2]] ||= []).push(d.snds[i]);
const shots = {}; for (let i = 0; i < d.shots.length; i += 4) if (ev(d.shots[i + 2]) === 'awp') (shots[d.shots[i + 1]] ||= []).push(d.shots[i]);
const T = d.times, S = d.stride;
const idx = (t) => { let lo = 0, hi = T.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (T[m] <= t) lo = m; else hi = m - 1; } return lo; };
const switched = (e, a, b) => { const s = d.slots[e]; if (!s) return null; const w0 = s[idx(a) * S + 6]; for (let i = idx(a); i <= idx(b); i++) if (s[i * S + 6] !== w0) return true; return false; };
const tally = { none: [0, 0], one: [0, 0], twoplus: [0, 0] };
for (const e in shots) { const s = shots[e], c = clicks[e] || [];
  for (let i = 1; i < s.length; i++) { const g = s[i] - s[i - 1]; if (g < 1.4 || g > 4) continue;
    const n = c.filter((t) => t > s[i - 1] && t <= s[i]).length; const k = n === 0 ? 'none' : n === 1 ? 'one' : 'twoplus';
    tally[k][switched(e, s[i - 1], s[i]) ? 1 : 0]++; } }
console.log('clicks between shots: [no weapon switch, weapon switch]', JSON.stringify(tally));
