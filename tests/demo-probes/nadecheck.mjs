import { parseDemo } from './demo_probe.mjs';
import { addNadesFromEvents } from './nades_fn.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2])); globalThis.D = d;
const nades = d.nades.filter((g) => { const p = g.pts; const L = p.length; if (L < 8) return false; return Math.hypot(p[L-3]-p[1], p[L-2]-p[2]) > 64; }).map((g) => { const p = g.pts; let stop = p[p.length - 4]; for (let i = 4; i < p.length; i += 4) { if (Math.hypot(p[i + 1] - p[i - 3], p[i + 2] - p[i - 2]) < 0.5) { stop = p[i]; break; } } return { type: g.type, pts: p, t0: p[0], t1: p[p.length - 4], stop }; });
const before = {}; for (const g of nades) before[g.type]=(before[g.type]||0)+1;
addNadesFromEvents(nades);
const after = {}, ev = {}; for (const g of nades) { after[g.type]=(after[g.type]||0)+1; if (g.fromEvents) ev[g.type]=(ev[g.type]||0)+1; }
const sm = nades.filter(g=>g.type==='smoke'); const dur = sm.map(g=>g.t1-g.stop).sort((a,b)=>a-b);
console.log('objects', JSON.stringify(before), '-> all', JSON.stringify(after), 'added from events', JSON.stringify(ev));
console.log('smokes with cloud from events', sm.filter(g=>g.cloud).length, '/', sm.length, 'duration median', dur[dur.length>>1]?.toFixed(1), 'min', dur[0]?.toFixed(1), 'max', dur.at(-1)?.toFixed(1));
const lo=+process.argv[3], hi=+process.argv[4]; if (lo) console.log(JSON.stringify(nades.filter(g=>g.t0>lo&&g.t0<hi).map(g=>[g.type, g.t0.toFixed(1), g.stop.toFixed(1), g.t1.toFixed(1), g.fromEvents?'events':'object'])));
