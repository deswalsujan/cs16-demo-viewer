// Strict and loose wallbangs (0.23.0, Sujan's three levels of 24 Oct 2026): waits for the picture check, then lists
// every wallbang with its pixels in view and its level, the Wallbangs list's heading, and the LOOSE tags drawn in the
// Kills and Wallbangs lists (every loose wallbang must have one, no strict one). Waits for the map. Example: FX vs
// Lions, Nuke, DreamHack Winter 2010 (DEMO=fx-vs-lions-dhw2010-bronze-1011272059): R13 1:19 NIKO on LoordB, 124
// pixels, loose; R22 0:47 THREAT on LoordB, 38, strict.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  await wait(1000);
  while ((M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null)) && Date.now() - t0 < 600000) await wait(500);
  const nm = (p) => (M.pl[p] ? M.pl[p].name : '?');
  const list = M.wbs.map((k) => { const r = M.rounds.find((x) => x.n === k.round); return `R${r.ln} ${clockText(k.t)} ${nm(k.kp)} ${k.weapon}${k.hs ? ' HS' : ''} -> ${nm(k.vp)}: ${k.seenPx} px, ${k.wb.loose ? 'loose' : 'strict'}`; });
  const loose = M.wbs.filter((k) => k.wb.loose);
  document.querySelector('.tabs button[data-tab="wb"]').click(); await wait(300);
  const head = (document.querySelector('#pane .copyrow span') || {}).textContent || '';
  const wbRows = [...document.querySelectorAll('#pane .wbrow')];
  const wbLooseTags = wbRows.filter((r) => r.querySelector('.wbtag.loose')).length;
  document.querySelector('.tabs button[data-tab="kills"]').click(); await wait(300);
  const killLooseTags = document.querySelectorAll('#pane .wbtag.loose').length;
  const killRowLoose = loose.length ? /wbtag loose/.test(killRow3(loose[0], true)) && /WALLBANG/.test(killRow3(loose[0], true)) : null;
  const killRowStrict = M.wbs.find((k) => !k.wb.loose) ? !/wbtag loose/.test(killRow3(M.wbs.find((k) => !k.wb.loose), true)) : null;
  document.querySelector('.tabs button[data-tab="wb"]').click(); await wait(300);
  const lr = document.querySelector('#pane .wbrow .wbtag.loose'); if (lr) lr.closest('.wbrow').scrollIntoView({ block: 'center' });
  const badStrict = M.wbs.filter((k) => !k.wb.loose && k.seenPx >= 50).length;
  return { demo: D.fileName, wallbangs: M.wbs.length, loose: loose.length, strict: M.wbs.length - loose.length, head, wbRows: wbRows.length, wbLooseTags, killLooseTagsInView: killLooseTags, killRowLoose, killRowStrict, badStrict, list };
})()
