// Which snapshot of the shooter's aim, and of the victim's position, best fits the headshots? (HLTV stamps
// an event to the snapshot after it happened; the shooter's game hit-tests against slightly older positions.)
import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2]));
const EV = globalThis.EV, name = (i) => (d.events[i] || '').replace(/^events\//, '').replace(/\.sc$/, '');
const GUNS = /^(ak47|m4a1|deagle|awp|usp|glock18|galil|mp5n|p90|scout|aug|sg552|fiveseven|p228)$/;
const S = d.stride, T = d.times, rad = Math.PI / 180;
const idx = (t) => { let lo = 0, hi = T.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (T[m] <= t) lo = m; else hi = m - 1; } return lo; };
const st = (e, i) => { const a = d.slots[e]; if (!a || i < 0 || i >= T.length) return null; const o = i * S; if (isNaN(a[o])) return null; let p = a[o + 4]; if (p > 180) p -= 360; return { x: a[o], y: a[o + 1], z: a[o + 2], yaw: a[o + 3], pitch: -p * 3, duck: a[o + 7] }; };
function vecs(pitch, yaw) { const sp = Math.sin(pitch * rad), cp = Math.cos(pitch * rad), sy = Math.sin(yaw * rad), cy = Math.cos(yaw * rad); return { f: [cp * cy, cp * sy, -sp], r: [sy, -cy, 0], u: [sp * cy, sp * sy, cp] }; }
function miss(eye, dir, head) { const v = head.map((h, i) => h - eye[i]); const t = v[0] * dir[0] + v[1] * dir[1] + v[2] * dir[2]; return Math.hypot(...head.map((h, i) => h - (eye[i] + dir[i] * t))); }
const cases = [];
for (const k of d.kills) {
  if (!k.hs || k.killer === k.victim || !/^(ak47|m4a1|deagle|awp|usp|glock18|galil|mp5navy|p90|scout|aug|sg552|fiveseven|p228)$/.test(k.weapon)) continue;
  const shot = EV.filter((x) => x.e === k.killer && GUNS.test(name(x.ei)) && x.t <= k.t + 0.001 && x.t > k.t - 0.25).pop();
  if (shot) cases.push({ k, shot, i: idx(shot.t) });
}
const q = (v, p) => { const s = [...v].sort((a, b) => a - b); return s[Math.floor(p * s.length)]; };
console.log('cases', cases.length, '\naim snapshot offset, victim snapshot offset, head height -> median miss, share within 6u');
const out = [];
for (const ao of [-2, -1, 0, 1]) for (const vo of [-2, -1, 0]) for (const hz of [22, 26, 30]) {
  const ms = [];
  for (const c of cases) {
    const A = st(c.k.killer, c.i + ao), P = st(c.k.killer, c.i), V = st(c.k.victim, c.i + vo); if (!A || !P || !V) continue;
    const ev = c.shot.ev || {}; const px = Math.abs(ev.iparam1 || 0) > 2000 ? 0 : (ev.iparam1 || 0) / 100, py = Math.abs(ev.iparam2 || 0) > 2000 ? 0 : (ev.iparam2 || 0) / 100;
    const W = vecs(A.pitch + px, A.yaw + py), dir = W.f.map((v, i) => v + (ev.fparam1 || 0) * W.r[i] + (ev.fparam2 || 0) * W.u[i]); const l = Math.hypot(...dir);
    ms.push(miss([P.x, P.y, P.z + (P.duck ? 12 : 17)], dir.map((v) => v / l), [V.x, V.y, V.z + (V.duck ? hz - 14 : hz)]));
  }
  out.push([ao, vo, hz, q(ms, .5), ms.filter((m) => m < 6).length / ms.length]);
}
out.sort((a, b) => a[3] - b[3]);
for (const r of out.slice(0, 8)) console.log(`aim ${r[0]}, victim ${r[1]}, head +${r[2]}: median ${r[3].toFixed(1)}u, within 6u ${(r[4] * 100).toFixed(0)}%`);
console.log('...worst:', out.slice(-1).map((r) => `aim ${r[0]}, victim ${r[1]}: ${r[3].toFixed(1)}u`).join(''));
