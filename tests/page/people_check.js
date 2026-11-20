// One demo's people, for people_check.py (20 Nov 2026; Sujan's rule of 17 Nov 2026, one person never holds two slots
// at once): each player's deaths against the match's live rounds (statsFor('all'), as the Players tab counts them), every
// second where two slots on a team carry the same name (nameAt, the name the view labels a slot with), every player's
// K-D, and the joins the rule refused (M.refusedJoins, 0.27.1; none on older builds). window.__gt.parts: the parts of
// a joined map, lower-case file names in order, joined first. No map needed.
(async () => {
  const g = window.__gt || {};
  if (g.parts) await openJoined(g.parts.map((p) => files.demos.find((f) => f.name.toLowerCase() === p)));
  const st = statsFor('all'), live = M.liveR.length;
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  const deaths = Object.keys(st).filter((e) => st[e].d > live).map((e) => ({ name: nm(e), deaths: st[e].d, live }));
  // the same name on two slots on a team, each second of the demo; how many of those seconds are in live rounds
  const S = D.stride, lr = M.liveR.filter((r) => !r.missing);
  const inLive = (t) => lr.some((r) => t >= r.start && t < (r.end != null ? r.end : D.end));
  const same = {};
  for (let t = Math.ceil(D.start); t <= D.end; t++) {
    const i = M.idxAt(t) * S, by = {};
    for (const e in D.slots) {
      const sd = Math.abs(D.slots[e][i + 5]);
      if (sd === 1 || sd === 2) (by[nameAt(+e, t)] || (by[nameAt(+e, t)] = [])).push(+e);
    }
    for (const n in by) {
      if (by[n].length < 2) continue;
      const k = JSON.stringify([n, by[n]]), s = same[k] || (same[k] = { name: n, slots: by[n], s: 0, live: 0, from: t });
      s.s++; if (inLive(t)) s.live++;
    }
  }
  // a refused join, once per pair of people: their names, their slots, and the seconds their connections overlap
  const pidOf = {};
  for (const pid in M.pl) for (const o of M.pl[pid].occs) pidOf[o.id] = pid;
  const end = (o) => (o.to != null ? o.to : D.end);
  const overlap = (A, B) => {
    const iv = [];
    for (const x of A) for (const y of B) { const a = Math.max(x.from, y.from), b = Math.min(end(x), end(y)); if (a < b) iv.push([a, b]); }
    iv.sort((p, q) => p[0] - q[0]);
    let sum = 0, cur = null;
    for (const v of iv) { if (cur && v[0] <= cur[1]) cur[1] = Math.max(cur[1], v[1]); else { if (cur) sum += cur[1] - cur[0]; cur = v.slice(); } }
    return cur ? sum + cur[1] - cur[0] : 0;
  };
  const refused = [], seen = new Set();
  for (const [x, y, by] of M.refusedJoins || []) {
    const a = pidOf[x], b = pidOf[y], key = [a, b].sort().join('|');
    if (!a || !b || seen.has(key)) continue;
    seen.add(key);
    const P = M.pl[a], Q = M.pl[b], slots = (p) => [...new Set(p.occs.map((o) => o.slot))].sort((m, n) => m - n);
    refused.push({ a: P.name, aSlots: slots(P), b: Q.name, bSlots: slots(Q), by: by == null ? null : String(by), over: Math.round(overlap(P.occs, Q.occs)) });
  }
  return {
    demo: D.fileName, parts: D.parts ? D.parts.map((p) => p.fileName) : null, live,
    deaths, same: Object.values(same), refused,
    kd: Object.keys(st).sort((a, b) => nm(a).localeCompare(nm(b)) || a.localeCompare(b)).map((e) => [nm(e), `${st[e].k}-${st[e].d}`]),
  };
})()
