// POV mode: the kill at 4:13 of the GP css_cache demo. His aim at each of his last 8 shots before the kill
// message, traced through the map: the first solid stretch (where it starts, how thick), and what lies 300 units
// past it (open or solid).
(() => {
  const k = D.kills.find((x) => Math.abs(x.t - D.start - 253) < 1 && /Yedazavni/.test(nameAt(x.victim, x.t)));
  const S = D.ownShots, shots = [];
  for (let i = 0; i < S.length; i += 3) if (S[i] <= k.t + 0.001 && S[i] > k.t - 3) shots.push(S[i]);
  return { kill: fmt(k.t - D.start), shots: shots.slice(-8).map((ts) => {
    POV.i = 0; const v = povView(ts), f = fwd(v.yaw, v.pitch);
    const end = [v.pos[0] + f[0] * 3000, v.pos[1] + f[1] * 3000, v.pos[2] + f[2] * 3000];
    const r = solidAlong(MAP.bsp, v.pos, end, 1, R3.broken, R3.poses);
    const h = r.hit[0], h2 = r.hit[1];
    return { before: +(k.t - ts).toFixed(2), yaw: +v.yaw.toFixed(1), pitch: +v.pitch.toFixed(1), wallAt: h ? Math.round(h.f0 * r.len) : null, thick: h ? Math.round((h.f1 - h.f0) * r.len) : null, openAfter: h2 ? Math.round((h2.f0 - h.f1) * r.len) : null };
  }) };
})()
