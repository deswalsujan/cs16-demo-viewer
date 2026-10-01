// Kill message lag (0.13.0): how long after the victim's death sound, the killer's last shot and the
// victim's health reaching 0 each kill message arrives. Usage: node kill_lag.mjs <demo.dem> [m:ss,m:ss to list]
// Needs src/demo.js copied here as demo.mjs (cp ../../src/demo.js demo.mjs).
import { parseDemo } from './demo.mjs';
import fs from 'fs';
const d = parseDemo(new Uint8Array(fs.readFileSync(process.argv[2])));
const nm = (e) => (d.players[e] || {}).name || '?';
const evName = (i) => (d.events[i] || '').toString();
const sndName = (i) => (d.sounds[i] || '').toString();
const shots = []; for (let i = 0; i < d.shots.length; i += 4) shots.push({ t: d.shots[i], e: d.shots[i + 1], ev: evName(d.shots[i + 2]) });
const dies = []; for (let i = 0; i < d.snds.length; i += 10) { const s = sndName(d.snds[i + 1]); if (/player\/(die|death)/i.test(s)) dies.push({ t: d.snds[i], e: d.snds[i + 2], s }); }
const hp0 = []; for (let i = 0; i < d.hp.length; i += 3) if (d.hp[i + 2] === 0) hp0.push({ t: d.hp[i], e: d.hp[i + 1] });
console.log('protocol', d.header.demoProtocol, d.header.netProtocol, 'shots', shots.length, 'death sounds', dies.length, 'hp0', hp0.length, 'kills', d.kills.length);
console.log('sample events', [...new Set(shots.map(s => s.ev))].slice(0, 8).join(' '));
const gun = d.kills.filter(k => k.weapon && !/grenade|world|knife/.test(k.weapon) && k.killer !== k.victim);
const gS = [], gD = [], gH = [];
for (const k of gun) {
  const s = shots.filter(x => x.e === k.killer && x.t <= k.t + 0.001 && x.t > k.t - 3).pop();
  const ds = dies.filter(x => x.e === k.victim && Math.abs(x.t - k.t) < 3).sort((a, b) => Math.abs(a.t - k.t) - Math.abs(b.t - k.t))[0];
  const h = hp0.filter(x => x.e === k.victim && Math.abs(x.t - k.t) < 3).sort((a, b) => Math.abs(a.t - k.t) - Math.abs(b.t - k.t))[0];
  if (s) gS.push(k.t - s.t); if (ds) gD.push(k.t - ds.t); if (h) gH.push(k.t - h.t);
  k._s = s ? k.t - s.t : null; k._d = ds ? k.t - ds.t : null; k._h = h ? k.t - h.t : null;
}
const q = (a, p) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[Math.min(b.length - 1, Math.floor(p * b.length))].toFixed(2) : '-'; };
const row = (l, a) => console.log(l.padEnd(34), 'n', String(a.length).padStart(3), ' median', q(a, .5), ' p90', q(a, .9), ' max', q(a, 1), ' min', q(a, 0));
row('kill msg minus killer last shot', gS); row('kill msg minus victim death sound', gD); row('kill msg minus victim health 0', gH);
if (process.argv[3]) { const fmt = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
  for (const k of gun) { const m = fmt(k.t - d.start); if (process.argv[3].split(',').includes(m)) console.log(m, nm(k.killer), k.weapon, '->', nm(k.victim), 'shot', k._s?.toFixed(2), 'deathsnd', k._d?.toFixed(2), 'hp0', k._h?.toFixed(2)); } }
