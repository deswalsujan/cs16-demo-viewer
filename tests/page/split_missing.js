(async () => {
  // A round in neither file (split maps). None of Sujan's demos has one, so this makes one: Xperia Play 2011 FX vs
  // mTw Inferno, part 2 with its kills before the first round marker removed, as if the recording had started one
  // round later. The game's scoreboard at part 2's first marker still shows that round (0:1, mTw on CT). Shows the
  // Join card with those parts, then joins them, and reports the Rounds tab and the stats.
  const f1 = files.demos.find((f) => f.name.includes('1104240025')), f2 = files.demos.find((f) => f.name.includes('1104240112'));
  const P1 = await parseInWorker(f1), P2 = await parseInWorker(f2);
  const cut = P2.kills.filter((k) => k.round === 0).length;
  P2.kills = P2.kills.filter((k) => k.round !== 0);
  closeSummary();
  Object.assign(JOIN, { list: [f1, f2], keep: false, moved: false, err: null, picking: false, reading: null });
  JOIN.P.set(f1.name, P1); JOIN.P.set(f2.name, P2);
  JOIN.F.set(f1.name, partFacts(P1)); JOIN.F.set(f2.name, partFacts(P2));
  JOIN.sugg = suggestOrder([JOIN.F.get(f1.name), JOIN.F.get(f2.name)]);
  renderJoinCard();
  const card = $('joinCard').innerText.replace(/\n+/g, ' | ');
  window.__afterCard = async () => {
    $('jGo').click();
    for (let i = 0; i < 1200 && !(D && D.parts && M && M.liveR.some((r) => r.part === 1)); i++) await new Promise((r) => setTimeout(r, 250));
    await new Promise((r) => setTimeout(r, 500));
    closeSummary();
    document.querySelector('.tabs button[data-tab="rounds"]').click();
    const g = document.querySelector('.row.gap'); if (g) { g.scrollIntoView({ block: 'center' }); }
    const st = statsFor('all'), last = M.liveR[M.liveR.length - 1];
    const neo = Object.keys(st).find((p) => /NEO/.test(M.pl[p].name));
    const gap = M.liveR.find((r) => r.missing);
    return { score: last.scoreAfter.join(':'), live: M.liveR.length, won: M.wonAt ? 'R' + M.wonAt.ln : 'no winner', gap: gap && { ln: gap.ln, winner: M.tnames[gap.winTeam], after: gap.scoreAfter.join(':') }, neo: neo && `${st[neo].k}-${st[neo].d}`, row: g && g.innerText.replace(/\n+/g, ' | ') };
  };
  return { killsCut: cut, card };
})()
