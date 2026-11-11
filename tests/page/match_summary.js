(() => {
  // Round counting and people at a glance: score, live rounds, when the match starts, who started where, names
  const last = M.liveR[M.liveR.length - 1];
  const r0 = M.liveR[0];
  const team = (ti) => ({
    name: M.tnames[ti], started: r0 ? (r0.tTeam === ti ? 'T' : 'CT') : '?',
    players: (() => { const st = statsFor('all'); const rows = M.teams[ti].map((e) => ({ e, s: st[e] || { k: 0, d: 0, rounds: 0 } })).filter((x) => x.s.rounds || x.s.k || x.s.d); const sh = shortNames(rows.map((x) => x.e)); return rows.map((x) => `${sh[x.e] || M.pl[x.e].name} ${x.s.k}-${x.s.d}`); })(),
  });
  return { demo: D.fileName, score: last && last.scoreAfter ? last.scoreAfter.join(':') : '-', live: M.liveR.length, firstLive: r0 ? fmt(r0.start - D.start) : '-', lastLiveEnds: last ? fmt(last.end - D.start) : '-', teams: [team(0), team(1)] };
})()
