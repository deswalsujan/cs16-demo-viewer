(() => {
  // Score, round by round, and every player's K-D (all, T, CT), for checking counts against known results
  const st = { all: statsFor('all'), t: statsFor('t'), ct: statsFor('ct'), ot: M.hasOT ? statsFor('ot') : null };
  const last = M.liveR[M.liveR.length - 1];
  const rounds = M.liveR.map((r) => `${r.ln}${r.ot ? 'ot' : ''}:${r.winTeam != null ? 'AB'[r.winTeam] : '?'}@${fmt(r.start - D.start)}`).join(' ');
  const dropped = M.rounds.filter((r) => !r.live && (r.swap || r.afterMatch)).map((r) => `${r.swap ? 'swap' : 'after'}@${fmt(r.start - D.start)}`);
  const team = (ti) => ({ name: M.tnames[ti], startedAs: M.liveR[0] ? (M.liveR[0].tTeam === ti ? 'T' : 'CT') : '?',
    players: M.teams[ti].filter((p) => st.all[p]).map((p) => `${M.pl[p].name}: ${st.all[p].k}-${st.all[p].d} (T ${st.t[p] ? st.t[p].k + '-' + st.t[p].d : '0-0'}, CT ${st.ct[p] ? st.ct[p].k + '-' + st.ct[p].d : '0-0'}${st.ot && st.ot[p] ? ', OT ' + st.ot[p].k + '-' + st.ot[p].d : ''})`) });
  return { demo: D.fileName, score: last ? last.scoreAfter.join(':') : '-', live: M.liveR.length, reg: M.reg, rounds, dropped, A: team(0), B: team(1) };
})()
