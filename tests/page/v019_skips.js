// Skips in the recording (0.19.0): where the viewer finds them, that players snap across them (just before a
// skip a player is still exactly where the snapshot before it put him), the note, and the kills tagged UNSURE.
// Waits for the map when there is one, so the Wallbangs list is there. Run with DEMO=... (FX vs Lions: 7 skips).
(async () => {
  const t0 = Date.now();
  while (!(M && M.wbs && MAP && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 120000) await new Promise((r) => setTimeout(r, 500));
  const out = { skips: (M.skipT || []).map((t) => fmt(t - D.start)) };
  const S = D.stride, k = [...(M.skipIdx || [])][0];
  if (k != null) {
    const tt = evenTimes(); let held = 0, n = 0;
    for (const e in D.slots) {
      const a = D.slots[e]; if (!(a[k * S + 5] > 0) || a[(k - 1) * S + 5] !== a[k * S + 5]) continue;
      const s = playerStateAt(+e, tt[k] - 0.01); if (!s) continue; n++;
      if (Math.hypot(s.x - a[(k - 1) * S], s.y - a[(k - 1) * S + 1]) < 0.5) held++;
    }
    out.snap = `${held} of ${n} players still at the snapshot before, 0.01 s before the first skip`;
    seek(M.skipT[0] + 0.5); updateCentre(); out.noteHalfSecondAfter = !$('skipnote').hidden;
    seek(M.skipT[0] + 3); updateCentre(); out.noteThreeSecondsAfter = !$('skipnote').hidden;
  }
  out.unsure = (M.wbs || []).filter((x) => skipNear(x.t)).map((x) => `${clockText(x.t)} ${M.pl[x.kp].name} -> ${M.pl[x.vp].name}`);
  return out;
})()
