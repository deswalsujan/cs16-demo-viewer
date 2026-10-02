// POV mode (wip/pov-mode): the recorder's track, now from his own state, against the view block written
// every frame. Usage: python3 make_pov_probe.py, then node pov_own_check.mjs <demo.dem>
import { parseDemo } from './pov_probe_demo.mjs';
import fs from 'fs';
const d = parseDemo(new Uint8Array(fs.readFileSync(process.argv[2])));
const P = globalThis.__P, st = d.stride;
const rec = d.serverInfo.playerIndex + 1, sl = d.slots[rec];
// the loading part of the file runs on another clock: keep the frames after the clock's one jump back
let cut = 0; for (let k = 1; k < P.info.length; k++) if (P.info[k][0] < P.info[k - 1][0]) cut = k;
const info = P.info.slice(cut); let j = 0;
let alive = 0, zero = 0, ducked = 0; const gaps = [], speeds = [];
let prev = null;
for (let i = 0; i < d.times.length; i++) {
  const b = i * st, t = d.times[i];
  if (!(sl[b + 5] > 0)) { prev = null; continue; }
  alive++;
  const x = sl[b], y = sl[b + 1], z = sl[b + 2];
  if (!x && !y && !z) { zero++; continue; }
  while (j < info.length - 1 && info[j + 1][0] <= t) j++;
  const f = info[j];
  if (f && f[11] > 0) gaps.push(Math.hypot(f[1] - x, f[2] - y));
  if (prev && t - prev.t > 0) speeds.push(Math.hypot(x - prev.x, y - prev.y) / (t - prev.t));
  prev = { t, x, y };
  if (sl[b + 7]) ducked++;
}
const q = (a, p) => { const s = [...a].sort((u, v) => u - v); return s.length ? +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(1) : null; };
let vo = null, fl = null, duckN = 0, duckAgree = 0;
for (const [, o] of P.cd) { if ('view_ofs[2]' in o) vo = o['view_ofs[2]']; if ('flags' in o) fl = o.flags; if (vo != null && fl != null) { duckN++; if (((fl & (1 << 14)) ? 1 : 0) === (vo < 15 ? 1 : 0)) duckAgree++; } }
console.log(JSON.stringify({ demo: process.argv[2].split('/').pop(), recorder: d.players[rec].name, entity: rec,
  aliveSamples: alive, stillAtZero: zero, crouchedSamples: ducked,
  horizontalGapToViewBlock: { median: q(gaps, .5), p90: q(gaps, .9), max: q(gaps, 1) },
  speedUnitsPerSec: { median: q(speeds, .5), p99: q(speeds, .99), max: q(speeds, 1) },
  crouchFlagMatchesCameraHeight: duckAgree + ' of ' + duckN }));
// aim: the track's yaw and pitch against the recorder's own mouse aim (the user command's view angles)
{ let j2 = 0; const dy = [], dp = [], ratio = [];
  for (let i = 0; i < d.times.length; i++) {
    const b = i * st, t = d.times[i]; if (!(sl[b + 5] > 0)) continue;
    while (j2 < info.length - 1 && info[j2 + 1][0] <= t) j2++;
    const f = info[j2]; if (!f || f[11] <= 0) continue;
    const yaw = sl[b + 3], pitch = sl[b + 4], cp = f[13], cy = f[14];
    dy.push(Math.abs(((yaw - cy) % 360 + 540) % 360 - 180));
    const cpp = cp > 180 ? cp - 360 : cp, pp = pitch > 180 ? pitch - 360 : pitch;
    if (Math.abs(cpp) > 10) ratio.push(pp / cpp); dp.push(Math.abs(pp - cpp));
  }
  console.log(JSON.stringify({ yawGapDeg: { median: q(dy, .5), p90: q(dy, .9) }, pitchGapDeg: { median: q(dp, .5), p90: q(dp, .9) }, trackPitchOverOwnPitch: { median: ratio.length ? +[...ratio].sort((a, b) => a - b)[ratio.length >> 1].toFixed(3) : null } })); }
