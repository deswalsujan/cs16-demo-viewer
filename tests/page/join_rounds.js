(async () => {
  // Every round of a joined map, in order: part, stretch (seg), time, scoreboard, kills, winner, live or why dropped.
  // Set window.__parts (substrings of file names, in order) in a script run just before it.
  const list = window.__parts.map((p) => files.demos.find((f) => f.name.toLowerCase().includes(p)));
  await openJoined(list);
  const why = (r) => r.live ? 'live' : r.swap ? 'swap' : r.afterMatch ? 'after' : r.pastHalf ? 'pastHalf' : 'out';
  const restarts = D.bomb.filter((b) => b.type === 'restart').map((b) => fmt(b.t - D.start) + (b.partStart ? '(part ' + (b.partStart + 1) + ')' : ''));
  const rows = M.rounds.map((r) => [
    'p' + (r.part != null ? r.part + 1 : '?'), 'seg' + r.seg, fmt(r.start - D.start), `sb ${r.scoreT || 0}:${r.scoreCT || 0}`,
    `k${r.kills.length}`, r.winner || '-', why(r), r.live ? `#${r.ln}${r.ot ? 'ot' : ''} ${'AB'[r.winTeam]} -> ${r.scoreAfter.join(':')}` : '',
  ].join(' '));
  return { restarts, rows, notes: (D.notes || []).length };
})()
