// POV mode, the 0.1 s question (29 Oct 2026: Sujan asked for both results, and picks): at the recorder's own gun kills,
// measured at his last own shot before the kill message (from his gun's round count), how far the victim's head is
// from the middle of his screen with the victim drawn at that moment (lag 0) and 0.1 s before it (main's 3D delay
// for HLTV demos since 0.24.0). Only kills where the victim has a position at both moments, so both use the same
// kills (pov_kill_lag.js counts each lag on its own kills). Needs POV_MODE=1.
(() => {
  const am = D.ownAmmo, shotsT = [];
  for (let i = 1; i < am.length / 3; i++) { const o = i * 3; if (am[o - 2] === am[o + 1] && am[o + 2] < am[o - 1] && am[o - 1] - am[o + 2] <= 3) shotsT.push(am[o]); }
  const off = (v, vs) => {
    const head = [vs.x, vs.y, vs.z + (vs.duck ? 12 : 24)];
    const dx = head[0] - v.pos[0], dy = head[1] - v.pos[1], dz = head[2] - v.pos[2];
    const yawTo = Math.atan2(dy, dx) * 180 / Math.PI, pitchTo = -Math.atan2(dz, Math.hypot(dx, dy)) * 180 / Math.PI;
    return Math.hypot(Math.abs(((v.yaw - yawTo) % 360 + 540) % 360 - 180), Math.abs(v.pitch - pitchTo));
  };
  const ok = (s) => s && Number.isFinite(s.x) && s.state > 0;
  const ks = D.kills.filter((k) => { POV.i = 0; return k.killer === povView(k.t).rec && k.victim !== k.killer && k.weapon && !/grenade|knife|world/.test(k.weapon); });
  const a = [], b = []; let closer0 = 0, closer1 = 0, tie = 0;
  for (const k of ks) {
    let ts = null; for (const s of shotsT) if (s <= k.t + 0.001 && s > k.t - 0.6) ts = s;
    if (ts == null) continue;
    POV.i = 0; const v = povView(ts), s0 = playerState(k.victim, ts), s1 = playerState(k.victim, ts - 0.1);
    if (!ok(s0) || !ok(s1)) continue;
    const x = off(v, s0), y = off(v, s1); a.push(x); b.push(y);
    if (Math.abs(x - y) < 0.01) tie++; else if (x < y) closer0++; else closer1++;
  }
  const st = (l) => { const s = l.slice().sort((p, q) => p - q); return s.length ? { median: +s[s.length >> 1].toFixed(2), p90: +s[Math.floor(s.length * 0.9)].toFixed(2), mean: +(s.reduce((p, q) => p + q, 0) / s.length).toFixed(2) } : null; };
  return { demo: D.fileName, gunKills: ks.length, sameKills: a.length, lag0: st(a), lag01: st(b), closerAt0: closer0, closerAt01: closer1, same: tie };
})()
