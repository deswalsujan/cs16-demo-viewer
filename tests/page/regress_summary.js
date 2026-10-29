// One demo's results, for comparing two builds with compare_all.sh (0.25.0, 29 Oct 2026: POV mode came into main on
// the promise that with it off every demo gives the same results as 0.24.0). Score, live rounds, every player's K-D,
// and once the map and the picture check are done, every wallbang with its tag (strict, loose by pixels, loose by
// damage) and every damage burst with its shooters. Waits for the map itself, so it runs with MAP_NEEDED=0.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  // the 3D map built, then the picture check done: every wallbang has its pixel count (seenPx) and none is pending
  while (!(MAP && M && M.bursts && M.wbs && MAP.name === D.mapName.toLowerCase() && R3 && view3.map === MAP.name) && Date.now() - t0 < 200000) await wait(500);
  const open = () => M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null);
  while (open() && Date.now() - t0 < 400000) await wait(500);
  const last = M.liveR[M.liveR.length - 1], st = statsFor('all');
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  const at = (t, rn) => { const r = M.rounds.find((x) => x.n === rn); return `R${r ? r.ln : '?'} ${clockText(t)}`; };
  return {
    demo: D.fileName, pov: !!D.pov, povMode: !!D.povOn, map: D.mapName, mapLoaded: !!(MAP && MAP.name === D.mapName.toLowerCase()), pictureCheckDone: !open(),
    score: last && last.scoreAfter ? last.scoreAfter.join(':') : '-', live: M.liveR.length, kills: D.kills.length,
    kd: Object.keys(st).sort((a, b) => nm(a).localeCompare(nm(b)) || a - b).map((e) => `${nm(e)} ${st[e].k}-${st[e].d}`),
    wallbangs: M.wbs.map((k) => `${at(k.t, k.round)} ${nm(k.kp)} -> ${nm(k.vp)} ${k.weapon} ${k.wb.loose ? 'loose' + (k.wb.loose === 'dmg' ? ' (damage)' : '') : 'strict'} ${k.wb.thick}`),
    bursts: (M.bursts || []).map((b) => `${at(b.start, b.round)} on ${nm(b.v)} ${b.total} HP${b.kill ? ' kill' : ''}: ${Object.keys(b.share).map((s) => `${s} ${b.share[s]}`).join(', ')}`),
  };
})()
