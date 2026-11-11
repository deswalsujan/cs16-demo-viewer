// Kill moments (24 Oct 2026, Sujan's question on the kill feed delay): for every gun kill, how far apart are the
// killer's last shot, the victim's last hit (hit sound, health drop), his death sound, the kill message and the
// snapshots around it. Usage: node kill_moments.mjs <demo.dem> [killer:victim,killer:victim ...] (name parts)
// Needs src/demo.js copied here as demo.mjs (cp ../../src/demo.js demo.mjs).
import { parseDemo } from './demo.mjs';
import fs from 'fs';
const d = parseDemo(new Uint8Array(fs.readFileSync(process.argv[2])));
const nm = (e) => (d.players[e] || {}).name || '?';
const sndName = (i) => String(d.sounds[i] || '').toLowerCase();
const shots = {}; for (let i = 0; i < d.shots.length; i += 4) (shots[d.shots[i + 1]] ||= []).push(d.shots[i]);
const dies = {}, hits = {};
for (let i = 0; i < d.snds.length; i += 10) {
  const s = sndName(d.snds[i + 1]), e = d.snds[i + 2], t = d.snds[i];
  if (/player\/(die|death)/.test(s)) (dies[e] ||= []).push(t);
  else if (/player\/(bhit|headshot)/.test(s)) (hits[e] ||= []).push(t);
}
const hpd = {}; let last = {};
for (let i = 0; i < d.hp.length; i += 3) { const t = d.hp[i], e = d.hp[i + 1], v = d.hp[i + 2]; (hpd[e] ||= []).push([t, v]); }
const T = d.times;
const snapAtOrBefore = (t) => { let lo = 0, hi = T.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (T[m] <= t + 1e-4) lo = m; else hi = m - 1; } return lo; };
const lastIn = (a, from, to) => { let r = null; for (const t of a || []) { if (t > to) break; if (t >= from) r = t; } return r; };
const gun = d.kills.filter((k) => k.weapon && !/grenade|world|knife/.test(k.weapon) && k.killer !== k.victim);
const rows = [];
for (const k of gun) {
  const s = lastIn(shots[k.killer], k.t - 1, k.t + 0.001), ds = lastIn(dies[k.victim], k.t - 1, k.t + 0.5);
  const h = lastIn(hits[k.victim], k.t - 1, k.t + 0.001);
  const hp0 = (hpd[k.victim] || []).find(([t, v]) => v === 0 && Math.abs(t - k.t) < 1);
  const si = snapAtOrBefore(k.t);
  rows.push({ k, s: s != null ? k.t - s : null, ds: ds != null ? k.t - ds : null, h: h != null ? k.t - h : null, hp0: hp0 ? k.t - hp0[0] : null, snapGap: k.t - T[si], snapStep: T[si + 1] - T[si] });
}
const q = (a, p) => { const b = a.filter((x) => x != null).sort((x, y) => x - y); return b.length ? b[Math.min(b.length - 1, Math.floor(p * b.length))].toFixed(3) : '-'; };
const n = (a) => a.filter((x) => x != null).length;
const line = (l, key) => { const a = rows.map((r) => r[key]); console.log(l.padEnd(40), 'n', String(n(a)).padStart(4), ' min', q(a, 0), ' median', q(a, .5), ' p90', q(a, .9), ' max', q(a, 1)); };
console.log(process.argv[2].split('/').pop(), 'gun kills', rows.length);
line('message minus killer last shot', 's'); line('message minus victim last hit sound', 'h'); line('message minus victim health 0', 'hp0');
line('message minus death sound', 'ds'); line('message minus snapshot before it', 'snapGap'); line('snapshot spacing at the kill', 'snapStep');
const want = (process.argv[3] || '').split(',').filter(Boolean).map((x) => x.toLowerCase().split(':'));
const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`;
for (const r of rows) {
  const k = r.k;
  if (!want.some(([a, b]) => nm(k.killer).toLowerCase().includes(a) && nm(k.victim).toLowerCase().includes(b))) continue;
  console.log(`\n${nm(k.killer)} ${k.weapon} -> ${nm(k.victim)}  R${k.round}  message ${fmt(k.t)}`);
  const from = k.t - 1.5, to = k.t + 0.3;
  const ev = [];
  for (const t of shots[k.killer] || []) if (t >= from && t <= to) ev.push([t, 'killer shot']);
  for (const t of hits[k.victim] || []) if (t >= from && t <= to) ev.push([t, 'victim hit sound']);
  for (const [t, v] of hpd[k.victim] || []) if (t >= from && t <= to) ev.push([t, `victim health ${v}`]);
  for (const t of dies[k.victim] || []) if (t >= from && t <= to) ev.push([t, 'victim death sound']);
  for (let i = 0; i < T.length; i++) if (T[i] >= k.t - 0.35 && T[i] <= to) ev.push([T[i], 'snapshot']);
  ev.push([k.t, 'KILL MESSAGE']);
  ev.sort((a, b) => a[0] - b[0] || (a[1] === 'snapshot' ? -1 : 1));
  for (const [t, l] of ev) console.log('  ', fmt(t), (t - k.t >= 0 ? '+' : '') + (t - k.t).toFixed(3), l);
}
