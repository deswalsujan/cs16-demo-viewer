// Level 2 by damage (28 Oct 2026): every kill the viewer now lists as a loose wallbang because the demo's damage shows
// a bullet of the killer's went through a surface in the same spray, with the bullet that proves it, and whether the
// kill has its numbers (a burst) in the Wallbangs list. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && M.wbs && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  const nm = (e) => labelAt(e, 0);
  const ks = D.kills.filter((k) => k.wb && k.wb.dmg && M.liveR.some((r) => r.n === k.round));
  return {
    map: D.mapName, wbs: M.wbs.length, strict: M.wbs.filter((k) => !k.wb.loose).length, loose: M.wbs.filter((k) => k.wb.loose).length, byDamage: ks.length,
    kills: ks.map((k) => { const r = M.rounds.find((x) => x.n === k.round); return `R${r ? r.ln : '?'} ${clockText(k.t)} ${nm(k.killer)} -> ${nm(k.victim)} ${k.weapon}: ${k.wb.dmg.dmg} HP at ${(k.wb.dmg.t - k.t).toFixed(2)} s (open from ${k.wb.dmg.open})${k.burst ? `, numbers ${k.burst.total} HP` : ', NO NUMBERS'}`; }),
  };
})()
