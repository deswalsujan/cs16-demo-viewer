// Every wallbang kill in the live rounds with its damage (with compare_all.sh, one page), for the minimum-damage question
// of 1 Nov 2026 (tests/logs/loose-kills-0.26.4.md): level (strict, loose by pixels, sliver loose, loose from damage), the
// killer's share as the list row shows it (hits through cover in the burst plus the killing bullet's "what he had left"),
// the hits before the kill, and for loose from damage the bullet that made it loose. Waits for the map and the picture
// check, like regress_summary.js.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && M.wbs && MAP.name === D.mapName.toLowerCase() && R3 && view3.map === MAP.name) && Date.now() - t0 < 200000) await wait(500);
  if (!(MAP && MAP.name === D.mapName.toLowerCase())) return { demo: D.fileName, map: 'not loaded' };
  const open = () => M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null);
  while (open() && Date.now() - t0 < 400000) await wait(500);
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  const out = [];
  for (const k of M.wbs) {
    const r = M.rounds.find((x) => x.n === k.round);
    const level = k.wb.loose === 'dmg' ? 'loose-damage' : k.wb.loose ? (k.wb.sliver ? 'loose-sliver' : 'loose') : (k.wb.sliver ? 'strict-sliver' : 'strict');
    const b = k.burst; const mine = b ? b.hits.filter((h) => h.s === k.killer) : [];
    const before = mine.filter((h) => !h.kill), kill = mine.find((h) => h.kill);
    out.push({
      tag: `R${r ? r.ln : '?'} ${clockText(k.t)}`, demoT: fmt(k.t - D.start), killer: nm(k.kp), victim: nm(k.vp), gun: k.weapon + (k.hs ? ' HS' : ''), level, px: k.seenPx,
      row: b ? b.share[k.killer] : null, hitsBefore: before.length, before: before.reduce((a, h) => a + h.dmg, 0), killLeft: kill ? kill.dmg : null,
      others: b ? Object.keys(b.share).filter((e) => +e !== k.killer).map((e) => b.share[e]).reduce((a, x) => a + x, 0) : 0,
      dmgBullet: k.wb.dmg ? k.wb.dmg.dmg : null, skip: !!skipNear(k.t),
    });
  }
  return { demo: D.fileName, n: out.length, out };
})()
