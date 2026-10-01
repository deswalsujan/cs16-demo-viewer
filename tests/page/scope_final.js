(async () => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(2500); closeSummary();
  const k = D.kills.find((x) => x.weapon === 'awp' && M.pl[x.kp].name.startsWith('PASHA') && M.pl[x.vp].name.includes('Edward'));
  setView('3d'); selected = k.killer; setCam('eyes', true); playing = false; T = k.t - 0.02;
  tab = 'kills'; renderPane(); await w(1500);
  return { killsTabMentionsScope: /SCOPE/.test($('pane').textContent), style: SCOPE_STYLE };
})()
