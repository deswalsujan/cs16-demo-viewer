// POV mode: moments when the recorder is alive but the view isn't on him; what his spectator mode, the round
// and his state say then (stretches merged)
(() => {
  const out = []; let cur = null;
  for (let t = D.start + 1; t < D.end; t += 0.5) {
    POV.i = 0; povFollow(t);
    const r = POV.v.rec, s = playerState(r, t);
    if (s && s.state > 0 && !(selected === r && POV.who === r)) {
      const o = povObs(t), rd = roundAt(t);
      const key = o.join(':');
      if (cur && cur.key === key && t - cur.to < 0.6) cur.to = t;
      else { cur = { key, from: t, to: t, mode: o[0], target: o[1] ? nameAt(o[1], t) : 0, round: rd && rd.n, roundStart: rd && fmt(rd.start - D.start) }; out.push(cur); }
    }
  }
  return out.map((c) => ({ from: fmt(c.from - D.start), to: fmt(c.to - D.start), mode: c.mode, target: c.target, round: c.round, roundStart: c.roundStart }));
})()
