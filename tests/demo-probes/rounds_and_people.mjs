import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2]));
const f = (t) => { t -= d.start; return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0'); };
console.log('start', d.start, 'end', d.end, 'rounds', d.rounds.length, 'errors', d.errors, 'final', JSON.stringify(d.finalScore));
for (const n of d.notes) console.log('NOTE', f(n.t), JSON.stringify(n.s.replace(/[\x00-\x1f]/g,' ').trim()).slice(0,140));
for (const r of d.rounds) console.log('R', r.n, f(r.start), r.winner, r.reason, 'sc', r.scoreT, r.scoreCT, 'kills', d.kills.filter(k=>k.round===r.n).length);
for (const b of d.bomb) if (b.type==='restart') console.log('RESTART', f(b.t));
for (const o of d.occupants) console.log('OCC', o.id, 'slot', o.slot, JSON.stringify(o.names), f(o.from), o.to!=null?f(o.to):'-', o.hltv?'hltv':'');
