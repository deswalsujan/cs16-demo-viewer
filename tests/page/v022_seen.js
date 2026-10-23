// The picture check (0.22.0, checkSeen in view3d.part.js): waits for it to finish, then lists every kill the 15
// points called a wallbang with the victim's pixels in view at the shot, and whether it's still in the list
// (fewer than SEEN_PX). Waits for the map. Sujan's three: SK vs eSTRO, Nuke, WCG 2008 (DEMO=0811082043) R15
// C4 0:23 hee on walle; roccat vs fnatic, Inferno, EM II (DEMO=roccat.fnatic) R13 1:37 Torgersen on Niko; MYM vs
// mTw, Dust2, EM3 2009 (DEMO=mtw.mym) R28 1:21 LoordB on MJE.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  await wait(1000);
  while ((M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null)) && Date.now() - t0 < 600000) await wait(500);
  const nm = (p) => (M.pl[p] ? M.pl[p].name : '?');
  const out = D.kills.filter((k) => k.seenPx != null && M.liveR.some((r) => r.n === k.round)).map((k) => {
    const r = M.rounds.find((x) => x.n === k.round);
    return `R${r.ln} ${clockText(k.t)} ${nm(k.kp)} ${k.weapon}${k.hs ? ' HS' : ''} -> ${nm(k.vp)}: ${k.seenPx} px, ${k.wb ? 'wallbang' : 'SEEN, dropped'}`;
  });
  return { demo: D.fileName, wallbangs: M.wbs.length, checked: out.length, dropped: out.filter((x) => /SEEN/.test(x)), secs: Math.round((Date.now() - t0) / 1000), list: out };
})()
