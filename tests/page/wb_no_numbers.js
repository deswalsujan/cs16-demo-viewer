// Every wallbang kill (M.wbs) that drawHitNumbers would give no damage number to: no burst in M.bursts ends in it
// (Sujan, 31 Oct 2026: starix on RobbaN, Na`Vi vs SK, Inferno, recorded 24 Oct 2011, R14 0:26). For each: why (its
// burst was built and then dropped by the 35 HP minimum or the live-round test, or it never got one), and the burst's
// hits. 115 of 634 on the 64 demos before 0.26.4 (measured on 0.26.2), 0 since. Run on every demo with compare_all.sh.
// Waits like regress_summary.js for the map and the picture check.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && M.wbs && MAP.name === D.mapName.toLowerCase() && R3 && view3.map === MAP.name) && Date.now() - t0 < 200000) await wait(500);
  const open = () => M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null);
  while (open() && Date.now() - t0 < 400000) await wait(500);
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  const at = (t, rn) => { const r = M.rounds.find((x) => x.n === rn); return `R${r ? r.ln : '?'} ${clockText(t)}`; };
  const shown = new Set(M.bursts.filter((b) => b.kill).map((b) => b.kill));
  const tag = (k) => (k.wb.loose ? 'loose' + (k.wb.loose === 'dmg' ? ' (damage)' : '') : 'strict') + (k.wb.sliver ? ' (sliver)' : '');
  const missing = M.wbs.filter((k) => !shown.has(k)).map((k) => {
    const b = k.burst;
    const why = !b ? 'no burst' : !M.liveR.some((r) => r.n === b.round) ? `burst dropped: round ${b.round} not live` : b.total < 35 ? `burst dropped: ${b.total} HP < 35` : 'burst dropped: other';
    return `${at(k.t, k.round)} ${nm(k.kp)} -> ${nm(k.vp)} ${k.weapon} ${tag(k)} | ${why}${b ? ` | hits ${b.hits.map((h) => (h.kill ? 'kill ' : '') + h.dmg + (h.head ? 'HS' : '')).join(', ')}` : ''}${k.vpos ? '' : ' | no vpos'}`;
  });
  return { demo: D.fileName, map: D.mapName, mapLoaded: !!(MAP && MAP.name === D.mapName.toLowerCase()), pictureCheckDone: !open(), wallbangs: M.wbs.length, missing };
})()
