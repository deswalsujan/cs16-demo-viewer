// Bullet marks feasibility: rebuild the killing bullet of each headshot kill from the demo and measure how far
// it passes from the victim's head. Compares aim alone, aim + recoil, aim + recoil + spread.
import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2]));
const EV = globalThis.EV, name = (i) => (d.events[i] || '').replace(/^events\//, '').replace(/\.sc$/, '');
const GUNS = /^(ak47|m4a1|deagle|awp|usp|glock18|famas|galil|mp5n|p90|scout|aug|sg552|elite_left|elite_right|fiveseven|p228|ump45|tmp|mac10|g3sg1|sg550|m249)$/;
const rad = Math.PI / 180;
function vecs(pitch, yaw) { // engine AngleVectors (roll 0): forward, right, up
  const sp = Math.sin(pitch * rad), cp = Math.cos(pitch * rad), sy = Math.sin(yaw * rad), cy = Math.cos(yaw * rad);
  return { f: [cp * cy, cp * sy, -sp], r: [sy, -cy, 0], u: [sp * cy, sp * sy, cp] };
}
const sub = (a, b) => a.map((v, i) => v - b[i]), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
// player view pitch from the entity's stored angle, as the viewer does
const viewPitch = (a0) => { let p = a0; if (p > 180) p -= 360; return -p * 3; };
function miss(eye, dir, head) { const v = sub(head, eye), t = dot(v, dir); const c = eye.map((e, i) => e + dir[i] * t); return { d: Math.hypot(...sub(head, c)), dist: t }; }
const rows = [];
for (const k of d.kills) {
  if (!k.hs || !k.kpos || !k.vpos || k.killer === k.victim || !/^(ak47|m4a1|deagle|awp|usp|glock18|famas|galil|mp5navy|p90|scout|aug|sg552|fiveseven|p228)$/.test(k.weapon)) continue;
  const shot = EV.filter((x) => x.e === k.killer && GUNS.test(name(x.ei)) && x.t <= k.t + 0.001 && x.t > k.t - 0.25).pop();
  if (!shot || !shot.ang || !shot.pos) continue;
  const duckK = k.kduck, eye = [shot.pos[0], shot.pos[1], shot.pos[2] + (duckK ? 12 : 17)];
  const head = [k.vpos[0], k.vpos[1], k.vpos[2] + (k.vduck ? 12 : 26)];
  const ev = shot.ev || {}, px = (ev.iparam1 || 0) / 100, py = (ev.iparam2 || 0) / 100, sx = ev.fparam1 || 0, sy = ev.fparam2 || 0;
  const p0 = viewPitch(shot.ang[0]), y0 = shot.ang[1];
  const a = vecs(p0, y0).f;
  const b = vecs(p0 + px, y0 + py).f;
  const V = vecs(p0 + px, y0 + py), c = norm(V.f.map((v, i) => v + sx * V.r[i] + sy * V.u[i]));
  const m = [a, b, c].map((dir) => miss(eye, dir, head));
  rows.push({ w: k.weapon, dist: Math.round(m[0].dist), aim: m[0].d, recoil: m[1].d, full: m[2].d, dt: k.t - shot.t, punch: Math.hypot(px, py), spread: Math.hypot(sx, sy) });
}
const q = (arr, p) => { const s = [...arr].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))]; };
const rep = (key) => { const v = rows.map((r) => r[key]); return `median ${q(v, .5).toFixed(1)}u, 75% under ${q(v, .75).toFixed(1)}u, within 6u of head centre: ${v.filter((x) => x < 6).length}/${v.length}`; };
console.log('headshot kills with a matching fire event:', rows.length);
console.log('aim only            ', rep('aim'));
console.log('aim + recoil        ', rep('recoil'));
console.log('aim + recoil + spread', rep('full'));
const sprayed = rows.filter((r) => r.punch > 1);
console.log('\nshots with more than 1 degree of recoil:', sprayed.length);
for (const k of ['aim', 'recoil', 'full']) { const v = sprayed.map((r) => r[k]); console.log('  ', k.padEnd(7), 'median', q(v, .5).toFixed(1) + 'u'); }
console.log('\nexamples (weapon, distance, miss with aim only / +recoil / +spread, recoil deg, spread):');
for (const r of rows.filter((r) => r.punch > 1).slice(0, 12)) console.log(' ', r.w.padEnd(7), String(r.dist).padStart(5) + 'u', r.aim.toFixed(1).padStart(6), r.recoil.toFixed(1).padStart(6), r.full.toFixed(1).padStart(6), r.punch.toFixed(2).padStart(6), r.spread.toFixed(3));
