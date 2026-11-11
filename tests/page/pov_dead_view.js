// POV mode: leaves the view a few seconds after the recorder's first death, while he spectates someone in
// first person, for a screenshot. Returns whose eyes the view is in.
(() => {
  POV.i = 0;
  const d = D.kills.find((k) => k.victim === povView(k.t).rec);
  if (!d) return { death: null };
  for (let t = d.t + 3; t < d.t + 30; t += 0.25) {
    POV.i = 0; povFollow(t);
    if (POV.who != null && POV.who !== POV.v.rec) { seek(t); playing = false; setView('3d'); return { died: fmt(d.t - D.start), shownAt: fmt(t - D.start), inEyesOf: nameAt(POV.who, t), label: $('pov').innerText }; }
  }
  return { died: fmt(d.t - D.start), inEyesOf: null };
})()
