// For a review list: each kill in window.__want ([{tag: 'R24 1:31', killer: 'f0cus'}], or {at: demo seconds, killer}) with its demo time, both
// names in full, the gun, and its state in this build (wallbang or not, pixels in view, on a skip). Waits for the
// map and the picture check (23 Oct 2026).
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  await wait(1000);
  while ((M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null)) && Date.now() - t0 < 600000) await wait(500);
  const nm = (p) => (M.pl[p] ? M.pl[p].name : '?');
  return window.__want.map((w) => {
    const k = D.kills.find((k) => { const r = M.rounds.find((x) => x.n === k.round); return r && (w.at != null ? Math.abs(k.t - D.start - w.at) < 1 : `R${r.ln} ${clockText(k.t)}` === w.tag) && nm(k.kp).includes(w.killer); });
    if (!k) return { ...w, missing: true };
    const r = M.rounds.find((x) => x.n === k.round);
    return { ...w, round: r ? 'R' + r.ln : '?', demo: D.fileName, demoT: fmt(k.t - D.start), killer: nm(k.kp), victim: nm(k.vp), weapon: k.weapon, hs: !!k.hs, wb: !!k.wb, seenPx: k.seenPx, skip: skipNear(k.t), shown: killClock(k.t) };
  });
})()
