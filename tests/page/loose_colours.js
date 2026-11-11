// Loose wallbangs in light purple (28 Oct 2026): the crosshair marker, its label, the ring, the kill line and the
// timeline diamond for a loose kill, against a strict one. Pass window.__lc = {tag, killer} for the loose kill; takes a
// screenshot through the killer's eyes just after it (harness prefix). Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && M.wbs && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  const w = window.__lc;
  const k = D.kills.find((k) => { const r = M.rounds.find((x) => x.n === k.round); return r && `R${r.ln} ${clockText(k.t)}` === w.tag && labelAt(k.killer, k.t).includes(w.killer); });
  if (!k || !k.wb) return { missing: w, wb: k && k.wb };
  setView('3d'); await wait(1200);
  document.querySelector('.tabs button[data-tab="wb"]').click(); await wait(300);
  playing = false; selected = k.killer; setCam('eyes', true); T = k.t - 0.3; prevT = T; update3(); await wait(300);
  T = k.t + 0.12; prevT = k.t - 0.01; update3(); await wait(150);
  const row = [...document.querySelectorAll('.kill3')].find((r) => r.textContent.includes(clockText(k.t)) && r.textContent.includes(w.killer));
  if (row) row.scrollIntoView({ block: 'center' });
  const tag = row && row.querySelector('.wbtag.loose');
  return { loose: k.wb.loose, dmg: k.wb.dmg ? k.wb.dmg.dmg : null, tagColour: tag ? getComputedStyle(tag).color : null, row: row ? row.innerText.replace(/\s+/g, ' ') : null };
})()
