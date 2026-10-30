// Score, live rounds and K-D for the ground truth check's joined maps and Count them (30 Oct 2026, ground_truth_check.py).
// window.__gt, set by a script run just before, holds the parts to join (lower-case file names, in order) or
// count30: true. Same format as regress_summary.js; no map needed.
(async () => {
  const g = window.__gt || {};
  if (g.parts) await openJoined(g.parts.map((p) => files.demos.find((f) => f.name.toLowerCase() === p)));
  if (g.count30) setCount30(true);
  const last = M.liveR[M.liveR.length - 1], st = statsFor('all');
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  return {
    demo: D.fileName, parts: D.parts ? D.parts.map((p) => p.fileName) : [D.fileName],
    score: last && last.scoreAfter ? last.scoreAfter.join(':') : '-', live: M.liveR.length,
    kd: Object.keys(st).sort((a, b) => nm(a).localeCompare(nm(b)) || a - b).map((e) => `${nm(e)} ${st[e].k}-${st[e].d}`),
  };
})()
