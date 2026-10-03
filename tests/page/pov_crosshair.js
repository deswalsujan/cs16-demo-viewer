// POV mode: the recorder's crosshair through his longest spray (gap in game units at the start, after 4 shots,
// at the last shot, then 0.5 s and 1.5 s after), and the crosshair settings read from config.cfg. Leaves the
// view on the spray's 6th shot for a screenshot.
(() => {
  const S = D.ownShots; let best = null;
  for (let i = 0; i < S.length; i += 3) {
    let j = i; while (j + 3 < S.length && S[j + 3] - S[j] < 0.2 && S[j + 4] === S[i + 1]) j += 3;
    const len = (j - i) / 3 + 1; if (!best || len > best.len) best = { i, j, len };
  }
  if (!best) return { spray: null };
  const at = (t) => { setView('3d'); POV.i = 0; povFollow(t); const c = povCrosshairAt(t); return c ? +c.gap.toFixed(2) : null; };
  const t0 = S[best.i], t4 = S[Math.min(best.j, best.i + 9)], t1 = S[best.j];
  const out = { spray: { shots: best.len, gun: WEAPON_EVENT[S[best.i + 1]], at: fmt(t0 - D.start) },
    gap: { before: at(t0 - 0.01), after4: at(t4 + 0.005), atLast: at(t1 + 0.005), half: at(t1 + 0.5), oneHalf: at(t1 + 1.5) }, cfg: XCFG };
  const ts = S[Math.min(best.j, best.i + 15)] + 0.005; seek(ts); playing = false;
  return out;
})()
