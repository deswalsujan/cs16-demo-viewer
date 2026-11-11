// POV mode: the spectator bars while he watches a teammate, and the hidden-enemies note with See through walls on
(() => {
  setView('3d');
  let tt = null; for (let u = D.start + 200; u < D.end; u += 0.2) { POV.i = 0; povFollow(u); if (POV.mode === 4 && POV.who != null) { tt = u + 1; break; } }
  seek(tt); playing = false; POV.i = 0; povFollow(tt);
  if (!opts.xray) toggleOpt('xray', 'tgXray');
  const n = $('povNote');
  return { at: fmt(tt - D.start), barsOn: povBarsOn(), mode: POV.mode, watching: nameAt(POV.who, tt), hiddenEnemies: povHidesEnemies(), note: n && !n.hidden ? n.innerText : null };
})()
