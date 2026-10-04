// POV mode: a teammate's crosshair while the recorder spectates him in first person (Sujan, 4 Oct 2026: it
// stayed at rest). Finds moments in spectator mode 4 where that teammate fired, and reads his crosshair gap
// just after his shot and 1 s later.
(() => {
  const out = []; let tried = 0;
  for (let t = D.start + 1; t < D.end && out.length < 6; t += 0.1) {
    POV.i = 0; povFollow(t);
    if (POV.mode !== 4 || POV.who == null) continue;
    const S = shotTimesOf(POV.who); let k = -1;
    for (let i = 0; i < S.length; i += 3) if (S[i] > t - 0.1 && S[i] <= t) k = i;
    if (k < 0) continue; tried++;
    const s = playerState(POV.who, t), id = P_WEAPON_ID[weaponShort(s.weapon)];
    const a = povCrosshairAt(t, id, S), b = (POV.i = 0, povFollow(t + 1), POV.who != null ? povCrosshairAt(t + 1, id, S) : null);
    out.push({ at: fmt(t - D.start), who: nameAt(POV.who, t), gun: weaponShort(s.weapon), gapAfterShot: a && +a.gap.toFixed(1), gap1sLater: b && +b.gap.toFixed(1), rest: id ? XHAIR[id - 1][0] : null });
    t += 3;
  }
  return out;
})()
