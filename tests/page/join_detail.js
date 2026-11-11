(async () => {
  // Join the parts of a map named in window.__parts (substrings of file names, in order), then report like match_detail.js
  const list = window.__parts.map((p) => files.demos.find((f) => f.name.toLowerCase().includes(p)));
  await openJoined(list);
  const st = { all: statsFor('all'), t: statsFor('t'), ct: statsFor('ct'), ot: M.hasOT ? statsFor('ot') : null };
  const last = M.liveR[M.liveR.length - 1];
  const partOf = (r) => r.part != null ? r.part + 1 : '?';
  const rounds = M.liveR.map((r) => `${r.ln}${r.ot ? 'ot' : ''}:${r.winTeam != null ? 'AB'[r.winTeam] : '?'}/p${partOf(r)}${r.partial ? '*' : ''}`).join(' ');
  const dropped = M.rounds.filter((r) => !r.live && (r.swap || r.afterMatch || r.pastHalf)).map((r) => `${r.swap ? 'swap' : r.afterMatch ? 'after' : 'pastHalf'}/p${partOf(r)}@${fmt(r.start - D.start)}`);
  const team = (ti) => ({ name: M.tnames[ti], players: M.teams[ti].filter((p) => st.all[p]).map((p) => `${M.pl[p].name}: ${st.all[p].k}-${st.all[p].d} (T ${st.t[p] ? st.t[p].k + '-' + st.t[p].d : '0-0'}, CT ${st.ct[p] ? st.ct[p].k + '-' + st.ct[p].d : '0-0'}${st.ot && st.ot[p] ? ', OT ' + st.ot[p].k + '-' + st.ot[p].d : ''})`) });
  return { parts: D.parts.map((p) => p.fileName), score: last ? last.scoreAfter.join(':') : '-', live: M.liveR.length, won: M.wonAt ? `R${M.wonAt.ln} in part ${partOf(M.wonAt)}` : 'no winner', rounds, dropped, A: team(0), B: team(1), errors: ERRLOG.slice(0, 5) };
})()
