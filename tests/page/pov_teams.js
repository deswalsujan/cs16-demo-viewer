(() => {
  // The team split in a POV demo (0.26.28, Sujan, 10 Nov 2026): both teams filled, each team on one side in the rounds
  // of a stretch, and groupTeams giving the same teams whatever order the players and their pairs come in.
  const out = { file: D.fileName, teams: M.teams.map((g, ti) => ({ name: M.tnames[ti], n: g.length })), checks: [] };
  const check = (name, pass, got) => out.checks.push({ name, pass: !!pass, got: got === undefined ? null : got });
  check('both teams have players', M.teams[0].length >= 5 && M.teams[1].length >= 5, out.teams.map((t) => t.n));
  // each round: the share of each team's sampled people on the team's side that round
  let worst = 1, at = null;
  for (const r of M.liveR) {
    for (const ti of [0, 1]) {
      const side = r.tTeam === ti ? 1 : 2; let on = 0, n = 0;
      for (const pid of M.teams[ti]) if (r.sides && r.sides[pid]) { n++; if (r.sides[pid] === side) on++; }
      if (n >= 3 && on / n < worst) { worst = on / n; at = `R${r.ln} ${M.tnames[ti]} ${on}/${n}`; }
    }
  }
  out.worstRound = at;
  // groupTeams on the pair counts of the live rounds, the players and the pairs shuffled 20 times
  const together = {};
  for (const r of M.liveR) {
    if (r.missing || !r.sides) continue;
    const ids = Object.keys(r.sides).sort();
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const v = together[ids[i] + '|' + ids[j]] || (together[ids[i] + '|' + ids[j]] = [0, 0]);
      v[r.sides[ids[i]] === r.sides[ids[j]] ? 0 : 1]++;
    }
  }
  const rank = {}; Object.keys(M.pl).forEach((pid, k) => rank[pid] = k);
  const players = Object.keys(M.pl).filter((pid) => M.liveR.some((r) => r.sides && r.sides[pid]));
  const name = (pid) => M.pl[pid].name;
  const key = (res) => res.all.map((g) => g.slice().sort().join(',')).sort().join(' / ');
  if (typeof groupTeams !== 'function') { check('groupTeams exists (0.26.28)', false); out.betweenTeams = { same: null, apart: null }; out.joins = []; out.pass = false; return out; }
  const base = groupTeams(players, together, rank, name), want = key(base);
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let same = 0;
  for (let k = 0; k < 20; k++) {
    const t2 = {};
    for (const p of shuffle(Object.keys(together))) { const [a, b] = p.split('|'); t2[rnd() < 0.5 ? p : b + '|' + a] = together[p].slice(); }
    if (key(groupTeams(shuffle(players.slice()), t2, rank, name)) === want) same++;
  }
  check('the same teams for 20 shuffled orders of the players and their pairs', same === 20, `${same} of 20`);
  // the two teams' pairs: the rounds on the same side and on opposite sides between them, which keep them apart
  const inT = (ti) => new Set(M.teams[ti]);
  const A = inT(0), B = inT(1); let s = 0, o = 0;
  for (const p in together) { const [a, b] = p.split('|'); if ((A.has(a) && B.has(b)) || (A.has(b) && B.has(a))) { s += together[p][0]; o += together[p][1]; } }
  out.betweenTeams = { same: s, apart: o };
  out.joins = (M.joins || []).map((j) => ({ a: j.a.length === 1 ? j.a[0] : `${j.a.length} (${j.a[0]}, ...)`, b: j.b.length === 1 ? j.b[0] : `${j.b.length} (${j.b[0]}, ...)`, same: j.same, apart: j.apart }));
  out.pass = out.checks.every((c) => c.pass);
  return out;
})()
