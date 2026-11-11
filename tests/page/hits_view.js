// Player's eyes at moments around a kill, for the trial's hit numbers and glow (26 Oct 2026). window.__hv = {tag, killer,
// who: name of the player whose eyes, offs: [seconds from the kill]}; each moment is a screenshot (harness prefix) of
// the last one, so pass one offset per run. Also the Wallbangs tab opened on that kill's row. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  const w = window.__hv;
  const k = D.kills.find((k) => { const r = M.rounds.find((x) => x.n === k.round); return r && `R${r.ln} ${clockText(k.t)}` === w.tag && M.pl[k.kp] && M.pl[k.kp].name.includes(w.killer); });
  if (!k) return { missing: w };
  const who = +Object.keys(D.players).find((e) => (D.players[e].name || '').includes(w.who));
  setView('3d'); await wait(1200);
  document.querySelector('.tabs button[data-tab="wb"]').click(); await wait(300);
  playing = false; selected = who; T = k.t + w.off; prevT = T; setCam(w.cam || 'eyes', true); await wait(1500); update3(); await wait(500);
  const row = [...document.querySelectorAll('.kill3')].find((r) => r.textContent.includes(clockText(k.t)) && r.textContent.includes(w.killer));
  if (row) row.scrollIntoView({ block: 'center' });
  return { who: D.players[who].name, T: T.toFixed(2), glow: $('glow3').checked, row: row ? row.innerText.replace(/\s+/g, ' ') : null };
})()
