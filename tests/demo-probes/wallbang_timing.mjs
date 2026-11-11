// Wallbangs before and after 0.13.0 (kills re-timed when the kill message trails the death sound), with the
// viewer's wallbang rules rebuilt outside the page. Usage: node wallbang_timing.mjs <demo.dem> <map.bsp>
// Needs src/demo.js and src/bsp.js copied here as demo.mjs and bsp.mjs. Prints only the kills whose result changes.
import { parseDemo } from './demo.mjs';
import { parseBsp, solidAlong, brushPose } from './bsp.mjs';
import fs from 'fs';
const [demoF, bspF] = process.argv.slice(2);
const d = parseDemo(new Uint8Array(fs.readFileSync(demoF)));
const bsp = parseBsp(new Uint8Array(fs.readFileSync(bspF)));
const nm = (e) => (d.players[e] || {}).name || '?';
const MOVERS = /^func_(door|door_rotating|rotating|train|tracktrain|plat|pushable|vehicle)$/;
const breakables = new Set(bsp.entities.filter((e) => e.classname === 'func_breakable' && e.model && e.model[0] === '*').map((e) => +e.model.slice(1)));
const movers = new Set(bsp.solids.filter((s) => MOVERS.test(s.cls)).map((s) => s.model));
const brk = {}; for (let i = 0; i < d.brushEvents.length; i += 3) (brk[d.brushEvents[i + 1]] ||= []).push(d.brushEvents[i], d.brushEvents[i + 2]);
const brokenSet = (t) => { const s = new Set(); for (const m of breakables) { const a = brk[m]; if (!a) continue; let v = 1; for (let i = 0; i < a.length; i += 2) { if (a[i] > t) break; v = a[i + 1]; } if (!v) s.add(m); } return s; };
const bp = {}; for (let i = 0; i < d.brushPose.length; i += 8) (bp[d.brushPose[i + 1]] ||= []).push(d.brushPose.slice(i, i + 8));
const posesAt = (t) => { const out = new Map(); for (const m of movers) { const a = bp[m]; if (!a) continue; let r = null; for (const x of a) { if (x[0] > t) break; r = x; } if (r) out.set(m, brushPose([r[2], r[3], r[4]], [r[5], r[6], r[7]])); } return out; };
const S = d.stride, times = d.times;
const at = (e, t) => { const a = d.slots[e]; if (!a) return null; let lo = 0, hi = times.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (times[m] <= t) lo = m; else hi = m - 1; } const i = lo * S; return isNaN(a[i]) ? null : { pos: [a[i], a[i + 1], a[i + 2]], ang: [a[i + 4], a[i + 3]], duck: a[i + 7] }; };
const shots = []; for (let i = 0; i < d.shots.length; i += 4) shots.push({ t: d.shots[i], e: d.shots[i + 1] });
const dies = []; for (let i = 0; i < d.snds.length; i += 10) { const nmS = String(d.sounds[d.snds[i + 1]] || ''); if (/player\/(die|death)/i.test(nmS)) dies.push({ t: d.snds[i], e: d.snds[i + 2] }); }
const NO = new Set(['grenade', 'knife', 'world', '']);
function test(kpos, kduck, kang, vpos, vduck, t) {
  const skip = brokenSet(t - 0.05), poses = posesAt(t - 0.05);
  const eye = [kpos[0], kpos[1], kpos[2] + (kduck ? 12 : 17)];
  const dx = vpos[0] - eye[0], dy = vpos[1] - eye[1], hl = Math.hypot(dx, dy) || 1, px = -dy / hl, py = dx / hl;
  const zs = vduck ? [-12, 0, 10, 16] : [-30, -12, 6, 22, 30];
  for (const z of zs) for (const sd of [-12, 0, 12]) if (solidAlong(bsp, eye, [vpos[0] + px * sd, vpos[1] + py * sd, vpos[2] + z], 2, skip, poses).solid === 0) return null;
  let raw = kang[0]; if (raw > 180) raw -= 360;
  const pitch = -raw * 3 * Math.PI / 180, yaw = kang[1] * Math.PI / 180;
  const dist = Math.hypot(vpos[0] - eye[0], vpos[1] - eye[1], vpos[2] - eye[2]);
  const end = [eye[0] + Math.cos(pitch) * Math.cos(yaw) * dist, eye[1] + Math.cos(pitch) * Math.sin(yaw) * dist, eye[2] - Math.sin(pitch) * dist];
  const aim = solidAlong(bsp, eye, end, 2, skip, poses);
  if (aim.solid === 0) return null;
  return { thick: Math.round(aim.solid), cls: [...new Set(aim.hit.map((h) => h.cls))].join('+'), dist: Math.round(dist) };
}

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
let nMsg = 0, nNew = 0; const src2 = { shot: 0, sound: 0, msg: 0 }; const changed = [];
for (const k of d.kills) {
  if (!k.kpos || !k.vpos || k.killer === k.victim || NO.has(k.weapon)) continue;
  const a = test(k.kpos, k.kduck, k.kang || [0, 0], k.vpos, k.vduck, k.t);
  // late only when the kill message trails the victim's death sound
  const ds = dies.filter((x) => x.e === k.victim && x.t <= k.t + 0.001 && x.t > k.t - 1).pop();
  const late = ds && k.t - ds.t > 0.05;
  const s = late ? shots.filter((x) => x.e === k.killer && x.t <= ds.t + 0.001 && x.t > ds.t - 0.3).pop() : null;
  const tA = late ? (s ? s.t : ds.t) : null; src2[!late ? 'msg' : s ? 'shot' : 'sound']++;
  let b = a;
  if (tA != null) { const kA = at(k.killer, tA), vA = at(k.victim, tA); b = kA && vA ? test(kA.pos, kA.duck, kA.ang, vA.pos, vA.duck, tA) : a; }
  if (a) nMsg++; if (b) nNew++;
  if (!!a !== !!b) changed.push(`${fmt(k.t - d.start).padStart(6)} ${(nm(k.killer) + ' ' + k.weapon + ' -> ' + nm(k.victim)).padEnd(58)} now: ${a ? 'WB ' + a.thick + 'u' : 'open'}`.padEnd(88) + ` proposed: ${b ? 'WB ' + b.thick + 'u' : 'open'}  (anchor: ${s ? 'shot ' + (k.t - s.t).toFixed(2) + 's before msg' : ds ? 'death sound' : 'kill message'})`);
}
console.log(changed.join('\n'));
console.log(`\nflagged now: ${nMsg}   proposed: ${nNew}   anchors used: ${JSON.stringify(src2)}`);
