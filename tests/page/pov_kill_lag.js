// POV mode: at the recorder's own gun kills, measured at his last own shot before the kill message (from his
// gun's round count), how far the victim's head is from the middle of his screen, with the victim drawn
// `lag` seconds in the past. The game draws other players a little in the past (its interpolation delay,
// ex_interp, 0.1 s by default), so the lag that lines up best is how far behind to draw them in POV mode.
(() => {
  const am = D.ownAmmo, shotsT = [];
  for (let i = 1; i < am.length / 3; i++) { const o = i * 3; if (am[o - 2] === am[o + 1] && am[o + 2] < am[o - 1] && am[o - 1] - am[o + 2] <= 3) shotsT.push(am[o]); }
  const res = {};
  const ks = D.kills.filter((k) => { POV.i = 0; return k.killer === povView(k.t).rec && k.victim !== k.killer && k.weapon && !/grenade|knife|world/.test(k.weapon); });
  for (const lag of [0, 0.05, 0.1, 0.15, 0.2]) {
    const off = [];
    for (const k of ks) {
      let ts = null; for (const s of shotsT) if (s <= k.t + 0.001 && s > k.t - 0.6) ts = s;
      if (ts == null) continue;
      POV.i = 0; const v = povView(ts), vs = playerState(k.victim, ts - lag);
      if (!vs || !Number.isFinite(vs.x) || vs.state <= 0) continue;
      const head = [vs.x, vs.y, vs.z + (vs.duck ? 12 : 24)];
      const dx = head[0] - v.pos[0], dy = head[1] - v.pos[1], dz = head[2] - v.pos[2];
      const yawTo = Math.atan2(dy, dx) * 180 / Math.PI, pitchTo = -Math.atan2(dz, Math.hypot(dx, dy)) * 180 / Math.PI;
      off.push(Math.hypot(Math.abs(((v.yaw - yawTo) % 360 + 540) % 360 - 180), Math.abs(v.pitch - pitchTo)));
    }
    off.sort((a, b) => a - b);
    res['lag ' + lag] = { kills: off.length, median: off.length ? +off[off.length >> 1].toFixed(2) : null, p90: off.length ? +off[Math.floor(off.length * 0.9)].toFixed(2) : null };
  }
  return res;
})()
