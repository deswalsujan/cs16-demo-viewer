(() => {
  // Two players who both used the placeholder name "Player" in the warmup must stay two people (split maps branch,
  // live-round name rule). Gives two live players of different teams a warmup span named "Player" at the start of
  // their connection, recounts, and reports the people. Run on a demo whose Steam IDs are all "0" (DEMO=1110091449,
  // Na`Vi vs FX, Train, SEC 2011 final), so only names can join connections.
  const first = M.liveR[0].start;
  const before = { people: Object.keys(M.pl).length, teams: M.teams.map((g) => g.length) };
  const picks = [M.teams[0][0], M.teams[1][0]].map((pid) => M.pl[pid].occs.find((o) => o.from < first));
  const names = picks.map((o) => o && M.pl[o.pid].name);
  for (const o of picks) {
    const src = D.occupants[o.id];
    const nt = src.nameT && src.nameT.length ? src.nameT : src.names.map((nm) => [src.from, nm]);
    const at = Math.max(nt[0][0], first - 60);
    src.nameT = [[src.from, 'Player'], [at, nt[nt.length - 1][1]]];
    src.names = ['Player', nt[nt.length - 1][1]];
  }
  derive();
  return { before, after: { people: Object.keys(M.pl).length, teams: M.teams.map((g) => g.length) }, renamed: names, now: M.teams.map((g) => g.map((p) => M.pl[p].name)) };
})()
