// Does a demo keep its fire events? (27 Oct 2026) For every gun kill: does the killer have a fire event in the 0.25 s
// up to the kill, only after it (and how late), or none. The 2010 and 2011 Nuke demos keep them (94 to 100%), the 2008
// and 2009 ones lose many (47 to 71%; late ones come 0.1 to 0.3 s after). computeHits uses the same count (M.firesKept,
// 90% or more) to decide whether an enemy with no fire event at a hit may have fired it. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  const shots = {}; const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) { if (/smoke/.test(String(D.events[sh[i + 2]]))) continue; (shots[sh[i + 1]] || (shots[sh[i + 1]] = [])).push(sh[i]); }
  const c = { kills: 0, atKill: 0, onlyAfter: 0, none: 0 }, late = {};
  for (const k of D.kills) {
    if (k.killer === k.victim || !MAX_DMG[k.weapon] || ONE_SURFACE.has(k.weapon)) continue;
    const t = k.tMsg != null ? k.tMsg : k.t, fs = shots[k.killer] || []; c.kills++;
    const before = fs.filter((x) => x >= t - 0.25 && x <= t + 0.001), after = fs.filter((x) => x > t + 0.001 && x <= t + 0.35);
    if (before.length) c.atKill++; else if (after.length) { c.onlyAfter++; const d = (after[0] - t).toFixed(1); late[d] = (late[d] || 0) + 1; } else c.none++;
  }
  return { map: D.mapName, shots: sh.length, ...c, late, firesKept: M.firesKept };
})()
