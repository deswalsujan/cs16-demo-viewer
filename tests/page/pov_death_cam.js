// POV mode: 2 s after the recorder's first death, the death camera. Expect his spectator mode 2 (chase) on
// himself, nobody's eyes, his body drawn. Then the first moment in first person on a teammate. Leaves the view on
// the death camera for a screenshot.
(() => {
  POV.i = 0;
  const d = D.kills.find((k) => k.victim === povView(k.t).rec);
  if (!d) return { death: null };
  setView('3d');
  const t = d.t + 2; seek(t); playing = false; POV.i = 0; povFollow(t);
  const out = { died: fmt(d.t - D.start), at2s: { mode: POV.mode, watched: nameAt(selected, t), inEyesOf: POV.who != null ? nameAt(POV.who, t) : null, hidesHisBody: hidesBody(POV.v.rec) } };
  for (let u = d.t; u < d.t + 20; u += 0.1) { POV.i = 0; povFollow(u); if (POV.mode === 4) { out.firstPerson = { after: +(u - d.t).toFixed(1), inEyesOf: POV.who != null ? nameAt(POV.who, u) : null }; break; } }
  POV.i = 0; povFollow(t);
  return out;
})()
