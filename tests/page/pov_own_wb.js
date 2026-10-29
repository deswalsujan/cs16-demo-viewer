// POV mode: his own gun kills, and whether the wallbang finder could check them (victim position at death). For
// each, his exact aim at his last shot before the kill message, traced 4,000 units through the map: the solid
// stretches it crosses (start and length), so a kill of a victim the server held back can be looked at.
(() => {
  const S = D.ownShots, out = { kills: 0, withVictimPos: 0, finderWallbangs: 0, noVictimPos: [] };
  for (const k of D.kills) {
    POV.i = 0; const v0 = povView(k.t);
    if (k.killer !== v0.rec || k.victim === k.killer || !k.weapon || /grenade|knife|world/.test(k.weapon)) continue;
    out.kills++;
    if (k.vpos && k.vpos.every(Number.isFinite)) { out.withVictimPos++; if (k.wb) out.finderWallbangs++; continue; }
    let ts = null; for (let i = 0; i < S.length; i += 3) if (S[i] <= k.t + 0.001 && S[i] > k.t - 1) ts = S[i];
    if (ts == null) { out.noVictimPos.push({ at: fmt(k.t - D.start), victim: nameAt(k.victim, k.t), shot: null }); continue; }
    POV.i = 0; const v = povView(ts), f = fwd(v.yaw, v.pitch);
    const end = [v.pos[0] + f[0] * 4000, v.pos[1] + f[1] * 4000, v.pos[2] + f[2] * 4000];
    const r = solidAlong(MAP.bsp, v.pos, end, 2, R3.broken, R3.poses);
    out.noVictimPos.push({ at: fmt(k.t - D.start), victim: nameAt(k.victim, k.t), hs: k.hs, shotBefore: +(k.t - ts).toFixed(2),
      solid: r.hit.slice(0, 3).map((h) => ({ from: Math.round(h.f0 * r.len), thick: Math.round((h.f1 - h.f0) * r.len) })) });
  }
  return out;
})()
