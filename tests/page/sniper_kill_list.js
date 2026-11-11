(() => {
  const sn = D.kills.filter((k) => k.scope && M.liveR.some((r) => r.n === k.round));
  const tally = {}; for (const k of sn) tally[k.scope.kind] = (tally[k.scope.kind] || 0) + 1;
  return { tally, list: sn.filter((k) => k.scope.kind !== 'scoped').map((k) => { const r = M.rounds.find((x) => x.n === k.round); const Z = ZOOM[k.killer]; const shot = Z.shots.filter((x) => x[0] <= k.t + 0.05).pop(); return `R${r.ln} ${clockText(k.t)}  ${M.pl[k.kp] ? M.pl[k.kp].name : '?'} -> ${M.pl[k.vp] ? M.pl[k.vp].name : '?'}  ${k.weapon}  ${k.scope.kind === 'no' ? 'NO-SCOPE' : 'QUICK-SCOPE'}${shot && shot[2] != null ? '  (zoomed ' + (shot[0] - shot[2]).toFixed(2) + ' s before)' : ''}`; }) };
})()
