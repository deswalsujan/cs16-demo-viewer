// Sujan's GP css_cache feedback, 4 Oct 2026: (1) the kill at 4:13 (his M4A1 wallbang): what the viewer knows
// about it; (2) zoom while spectating Zulfi at 5:59: the zoom messages around then; (3) enemies in the file
// per moment while he plays against while he spectates (does the server send more once he's dead?)
(() => {
  const out = {};
  const near = (t0) => D.kills.filter((k) => Math.abs(k.t - D.start - t0) < 3);
  out.killsNear413 = near(253).map((k) => ({ at: fmt(k.t - D.start), killer: nameAt(k.killer, k.t), victim: nameAt(k.victim, k.t), weapon: k.weapon, hs: k.hs, wb: k.wb ? { thick: k.wb.thick, what: k.wb.what } : k.wb, kpos: k.kpos && k.kpos.map(Math.round), vpos: k.vpos && k.vpos.map((x) => Math.round(x)), victimInFileAtDeath: (() => { const s = playerState(k.victim, k.t - 0.05); return !!(s && Number.isFinite(s.x) && (s.x || s.y)); })(), corpse: (D.corpses.find((c) => c.e === k.victim && Math.abs(c.t - k.t) < 3) || {}).pos }));
  const t1 = D.start + 359; const F = D.fovs, f = [];
  for (let i = 0; i < F.length; i += 2) if (F[i] > t1 - 6 && F[i] < t1 + 4) f.push([fmt(F[i] - D.start), F[i + 1]]);
  POV.i = 0; povFollow(t1);
  out.zoom559 = { mode: POV.mode, watching: POV.who != null ? nameAt(POV.who, t1) : null, gun: (() => { const s = POV.who && playerState(POV.who, t1); return s && weaponShort(s.weapon); })(), setFovMessages: f, viewerZoomGuess: POV.who ? zoomLevel(POV.who, t1) : null };
  const c = { playing: { n: 0, en: 0, tm: 0 }, spectating: { n: 0, en: 0, tm: 0 } };
  for (let t = D.start + 1; t < D.end; t += 1) {
    POV.i = 0; povFollow(t); const v = POV.v, rs = playerState(v.rec, t);
    const k = POV.mode === 0 && rs && rs.state > 0 ? 'playing' : POV.mode === 4 ? 'spectating' : null; if (!k) continue;
    const side = POV.mode === 0 ? rs.state : (() => { const s = playerState(POV.who, t); return s && s.state; })(); if (!side) continue;
    c[k].n++;
    for (const e in D.slots) { if (+e === v.rec || +e === POV.who) continue; const s = playerState(+e, t); if (!(s && s.state > 0 && Number.isFinite(s.x) && (s.x || s.y))) continue; if (s.state !== side) c[k].en++; else c[k].tm++; }
  }
  for (const k in c) { c[k].enemiesPerMoment = +(c[k].en / c[k].n).toFixed(2); c[k].teammatesPerMoment = +(c[k].tm / c[k].n).toFixed(2); }
  out.enemiesSent = c;
  return out;
})()
