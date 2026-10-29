// POV mode parts 2 and 3: his HUD values at a few moments while playing, and the animation his gun plays
// around his first reload and his first silencer fitting (named sequences from his gun model). Leaves the view
// mid-round, alive, with the HUD showing.
(async () => {
  setView('3d');
  for (let k = 0; k < 50 && !HUDS.spr.number_0; k++) { loadHudSprites(); await new Promise((r) => setTimeout(r, 100)); }
  const out = { sprites: Object.keys(HUDS.spr).length, ammoIcons: Object.keys(HUDS.ammo).map((id) => W_NAME[id]), hud: [], anims: {} };
  for (let t = D.start + 30; t < D.end && out.hud.length < 5; t += 97) { POV.i = 0; povFollow(t); if (POV.mode === 0 && POV.who === POV.v.rec) { const v = povHudValues(t); out.hud.push({ at: fmt(t - D.start), ...v, gun: W_NAME[v.id] }); } }
  for (let k = 0; k < 80 && !(getModel('models/v_m4a1.mdl') && getModel('models/v_usp.mdl')); k++) await new Promise((r) => setTimeout(r, 100));
  const W = D.wanims;
  const seqName = (t) => { const nm = povViewModel(t), m = nm && getModel(nm); if (!m) return nm + ' (model not loaded)'; const a = povVmAnim(m.mdl, nm, t); return nm.replace('models/', '') + ':' + m.mdl.seqs[a.seq].name + '@' + a.frame.toFixed(0); };
  for (const [label, re] of [['reload', /reload/], ['add_silencer', /add_silencer/]]) {
    for (let i = 0; i < W.length; i += 2) {
      const nm = povViewModel(W[i] + 0.05), m = nm && getModel(nm); if (!m) continue;
      const q = m.mdl.seqs[W[i + 1]]; if (!q || !re.test(q.name)) continue;
      POV.i = 0; povFollow(W[i] + 0.01);
      if (POV.mode !== 0) continue;
      out.anims[label] = { at: fmt(W[i] - D.start), before: seqName(W[i] - 0.3), during: seqName(W[i] + 0.5), after: seqName(W[i] + q.numframes / q.fps + 0.4) };
      break;
    }
  }
  // the view for the screenshot: the first HUD moment
  const t = D.start + 30 + 97; seek(t); playing = false;
  return out;
})()
