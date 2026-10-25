// Wallbang damage trial (wip/wallbang-hits, 26 Oct 2026): the bursts the viewer finds, the Wallbangs list's filters
// and rows, a damage row clicked, and Player's eyes at LoordB's hits on Xizt (FX vs Lions, Nuke, DreamHack Winter 2010,
// R18 0:55) with option A then C, for screenshots (window.__step = 'A' or 'C' picks the view left on screen).
// DEMO=fx-vs-lions-dhw2010-bronze-1011272059, waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && M.bursts && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  while ((M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null)) && Date.now() - t0 < 600000) await wait(500);
  const out = { bursts: M.bursts.length, withKill: M.bursts.filter((b) => b.kill).length, damageRows: M.bursts.filter((b) => !b.kill).length };
  document.querySelector('.tabs button[data-tab="wb"]').click(); await wait(300);
  out.chips = [...document.querySelectorAll('#pane .wbchips button')].map((b) => b.textContent + (b.title ? ' [tip]' : ''));
  out.rows = document.querySelectorAll('#pane .wbrow').length;
  out.tags = { strict: document.querySelectorAll('#pane .wbtag:not(.loose):not(.dmg):not(.unsure)').length, loose: document.querySelectorAll('#pane .wbtag.loose').length, dmg: document.querySelectorAll('#pane .wbtag.dmg').length, dlines: document.querySelectorAll('#pane .dline').length };
  for (const f of ['strict', 'loose', 'damage', 'all']) { const b = document.querySelector(`#pane [data-wf="${f}"]`); if (b) { b.click(); await wait(200); out['rows_' + f] = document.querySelectorAll('#pane .wbrow').length; } }
  const xk = D.kills.find((k) => k.burst && Math.abs(k.t - 2174.984) < 0.05);
  out.xizt = xk ? { total: xk.burst.total, hits: xk.burst.hits.map((h) => `${h.dmg}${h.head ? 'HS' : ''}${h.kill ? 'K' : ''}`).join(' '), counts: hitCounts(xk.burst, xk.t), row: (document.querySelector(`#pane [data-ki="${D.kills.indexOf(xk)}"] .dline`) || {}).textContent } : null;
  const dr = document.querySelector('#pane [data-hb]');
  if (dr) { dr.click(); await wait(500); out.clicked = { selected: selected, main: M.bursts[+dr.dataset.hb].main, T: +T.toFixed(2), start: M.bursts[+dr.dataset.hb].start, cam: cam3.mode, text: dr.textContent.replace(/\s+/g, ' ') }; }
  setView('3d'); await wait(800);
  if (!opts.xray) $('tgXray').click();
  if (!opts.names) $('tgNames').click();
  $('hit3').value = window.__step || 'A';
  playing = false; selected = 13; T = window.__at || 2174.80; prevT = T; setCam('eyes', true); await wait(1500); update3(); await wait(400);
  out.style = $('hit3').value; out.burstNow = burstAt(10, T) ? hitCounts(burstAt(10, T), T) : null;
  return out;
})()
