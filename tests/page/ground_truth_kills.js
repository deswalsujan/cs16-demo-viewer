// Every kill and every person, for tests/ground_truth_check.py (30 Oct 2026): each kill's round as the lists number
// it, the timer as the Kills list shows it, killer, victim and gun, and its tag in the Wallbangs list (strict, loose by
// pixels, loose by damage, or none when it isn't listed). Run after regress_summary.js, which waits for the map and the
// picture check; without them (MAP_NEEDED=0 on its own) the tags are null, which is enough for names and rounds.
(() => {
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  const listed = M.wbs ? new Set(M.wbs) : null;
  const tag = (k) => (!listed ? null : !listed.has(k) ? 'none' : k.wb.loose === 'dmg' ? 'loose-damage' : k.wb.loose ? 'loose' : 'strict');
  return {
    demo: D.fileName, parts: D.parts ? D.parts.map((p) => p.fileName) : [D.fileName],
    people: Object.values(M.pl).filter((p) => p.occs.length).map((p) => p.name),
    kills: D.kills.map((k) => {
      const r = M.rounds.find((x) => x.n === k.round);
      return { round: r && r.live ? r.ln : null, timer: killClock(k.t), killer: nm(k.kp), victim: nm(k.vp), gun: k.weapon, tag: tag(k) };
    }),
  };
})()
