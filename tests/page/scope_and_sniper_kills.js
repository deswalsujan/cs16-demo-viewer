(async () => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(2500); closeSummary();
  const sn = D.kills.filter((k) => k.scope);
  const tally = {}; for (const k of sn) tally[k.scope.kind] = (tally[k.scope.kind] || 0) + 1;
  const list = sn.filter((k) => M.liveR.some((r) => r.n === k.round)).map((k) => { const r = M.rounds.find((x) => x.n === k.round); return `R${r.ln} ${clockText(k.t)}  ${M.pl[k.kp] ? M.pl[k.kp].name : '?'} -> ${M.pl[k.vp] ? M.pl[k.vp].name : '?'}  ${k.weapon}  ${k.scope.kind === 'no' ? 'NO-SCOPE' : k.scope.kind === 'quick' ? 'QUICK-SCOPE' : 'scoped (' + k.scope.lvl + 'x)'}`; });
  // look through the scope just before a scoped AWP kill
  const k = sn.find((x) => x.scope.kind === 'scoped' && x.weapon === 'awp' && M.liveR.some((r) => r.n === x.round));
  setView('3d'); selected = k.killer; setCam('eyes', true); playing = false; T = k.t - 0.05; await w(1500);
  return { tally, zoomedAtShot: zoomLevel(k.killer, k.t - 0.05), fov: +R3.camera.fov.toFixed(1), list };
})()
