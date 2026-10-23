// Skips that cut across a round restart (23 Oct 2026): HLTV left out the end of a round and the restart, so the
// kills that ended the round arrive in the snapshot where everyone is back at the spawns. Lists each one with the
// kills on it, and the wallbangs left (none should land on one). Run with MAP_NEEDED=0 for the skips alone.
(async () => {
  const t0 = Date.now();
  if (window.__waitMap) while (!(MAP && M && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await new Promise((r) => setTimeout(r, 500));
  const nm = (p) => (M.pl[p] ? M.pl[p].name : '?');
  const lab = (t) => { const r = M.rounds.find((x) => t >= x.start - 0.001 && t < x.end + 0.001) || roundAt(t); return `${r && r.live ? 'R' + r.ln : 'not counted'} ${clockText(t)} (${fmt(t - D.start)})`; };
  return {
    demo: D.fileName, skips: M.skipT.length,
    restart: (M.skipRestart || []).map((st) => ({ at: lab(st), kills: D.kills.filter((k) => Math.abs(k.t - st) <= 0.3 && k.killer !== k.victim).map((k) => `${nm(k.kp)} ${k.weapon} -> ${nm(k.vp)}`) })),
    wbsOnRestart: (M.wbs || []).filter((k) => (M.skipRestart || []).some((st) => Math.abs(st - k.t) <= 0.3)).length,
  };
})()
