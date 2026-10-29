// POV mode: while he spectates someone in first person, that player's zoom (SetFOV) is used: the moment Zulfi
// zooms at 6:01 of the GP css_cache demo (or the first zoom while spectating in any demo), for a screenshot
(() => {
  setView('3d'); const F = D.fovs;
  for (let i = 0; i < F.length; i += 2) {
    if (F[i + 1] >= 90) continue; const t = F[i] + 0.02; POV.i = 0; povFollow(t);
    if (POV.mode !== 4 || POV.who == null) continue;
    seek(t); playing = false; POV.i = 0; povFollow(t);
    return { at: fmt(t - D.start), watching: nameAt(POV.who, t), fov: povFov(t), barsOn: povBarsOn(), barPx: Math.round($('gl').getBoundingClientRect().height * SPEC_BAR) };
  }
  return null;
})()
