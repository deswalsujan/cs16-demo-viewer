// POV mode: a kill of the recorder's whose victim has no position in the file. Picks the kill nearest
// window.__wbAt (demo seconds from the start, default 122). His aim at each of his last 8 shots before it, traced
// 3,000 units: every solid stretch (start, thickness, map model). Also when the victim was last and next in the file.
(() => {
  const at = window.__wbAt != null ? window.__wbAt : 122;
  POV.i = 0;
  const own = D.kills.filter((x) => { POV.i = 0; return x.killer === povView(x.t).rec && x.victim !== x.killer; });
  const k = own.reduce((b, x) => (!b || Math.abs(x.t - D.start - at) < Math.abs(b.t - D.start - at) ? x : b), null);
  const S = D.ownShots, shots = [];
  for (let i = 0; i < S.length; i += 3) if (S[i] <= k.t + 0.001 && S[i] > k.t - 3) shots.push(S[i]);
  // the victim's snapshots around the kill
  let last = null, next = null;
  for (let t = k.t - 10; t <= k.t + 3; t += 0.05) { const p = playerStateAt(k.victim, t); if (p) { if (t <= k.t) last = t; else if (next == null) next = t; } }
  const tP = k.t, skip = brokenSet(tP - 0.05), poses = posesAt(tP - 0.05);
  return { kill: fmt(k.t - D.start), clock: clockText(k.t), victim: nameAt(k.victim, k.t), hs: k.hs,
    victimLastInFile: last == null ? 'not in last 10 s' : +(k.t - last).toFixed(2) + ' s before', victimNextInFile: next == null ? 'none in 3 s' : +(next - k.t).toFixed(2) + ' s after',
    shots: shots.slice(-8).map((ts) => {
      POV.i = 0; const v = povView(ts), f = fwd(v.yaw, v.pitch);
      const end = [v.pos[0] + f[0] * 3000, v.pos[1] + f[1] * 3000, v.pos[2] + f[2] * 3000];
      const r = solidAlong(MAP.bsp, v.pos, end, 2, skip, poses);
      return { before: +(k.t - ts).toFixed(2), yaw: +v.yaw.toFixed(1), pitch: +v.pitch.toFixed(1), walls: r.hit.slice(0, 3).map((h) => ({ at: Math.round(h.f0 * r.len), thick: Math.round((h.f1 - h.f0) * r.len), model: h.model })) };
    }) };
})()
