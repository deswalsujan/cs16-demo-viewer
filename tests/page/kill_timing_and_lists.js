// 0.13.0: kills re-timed to the killing shot when the kill message is late, the 1-surface gun rule,
// kill feed icons from the player's files, and the clicked / playing-now states in the side panel.
// Run with DEMO=noa.penta (the 2006 Train demo) or any other demo. Returns the wallbang list as the
// viewer has it, so it can be compared with the measurement in CHANGELOG 0.13.0.
(() => {
  const fmt2 = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const wbs = M.wbs.map((k) => {
    const r = M.rounds.find((x) => x.n === k.round);
    return `R${r ? r.ln : '?'} ${clockText(k.t)} demo ${fmt2(k.t - D.start)} ${M.pl[k.kp] ? M.pl[k.kp].name : '?'} ${k.weapon} -> ${M.pl[k.vp] ? M.pl[k.vp].name : '?'} ${k.wb.thick}u${k.retimed ? ' (re-timed from ' + k.retimed + ', ' + (k.tMsg - k.t).toFixed(2) + 's)' : ''}`;
  });
  // the Wallbangs tab, with the R15 kill clicked (or the 6th entry, whichever exists)
  document.querySelector('.tabs button[data-tab="wb"]').click();
  const rows = [...document.querySelectorAll('#pane [data-wb]')];
  const pick = rows[Math.min(5, rows.length - 1)];
  if (pick) pick.click();
  playing = false;
  renderPane();
  const picked = document.querySelectorAll('#pane .row.pick').length;
  const marks = document.querySelectorAll('#pane .row.pick .mark').length;
  const oneSurface = D.kills.filter((k) => k.wb && ONE_SURFACE.has(k.weapon)).length;
  const bad = D.kills.filter((k) => k.retimed && !(k.t < k.tMsg)).length;
  return {
    demo: D.fileName, protocol: D.header.netProtocol, killsRetimed: D.killsRetimed, retimedWrongWay: bad,
    wallbangs: wbs.length, list: wbs, oneSurfaceWallbangs: oneSurface,
    icons: Object.keys(KICONS).length, iconRowsShown: document.querySelectorAll('#pane .kico').length,
    pickedRows: picked, bookmark: marks, rowsInList: rows.length,
  };
})()
