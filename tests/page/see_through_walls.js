(async () => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(2500); closeSummary();
  const out = {};
  setView('3d');
  // a mid-round moment in Player's eyes with enemies around
  const r = M.liveR[3]; T = r.start + 30; playing = false;
  selected = alivePlayers()[0]; setCam('eyes', true); await w(800);
  // See through walls on: let the wall checks run for a moment
  if (!opts.xray) $('tgXray').click();
  for (let i = 0; i < 20; i++) { T += 0.01; await w(100); }
  const ghosts = Object.keys(R3.rigs).filter((k) => k[0] === 'p' && R3.rigs[k].ghost && R3.rigs[k].ghost.visible && R3.rigs[k].g.visible);
  const hidden = [...(R3.vis || new Map()).entries()].filter(([e, c]) => c.hidden).map(([e]) => 'p' + e);
  out.ghostsShown = ghosts.length; out.playersBehindWalls = hidden.length;
  out.ghostsMatchHidden = ghosts.every((k) => hidden.includes(k));
  window.__stage = 'xray';
  return out;
})()
