// POV mode, See through walls (Sujan, 4 Oct 2026: thin walls, close players, nothing shown). Every 0.25 s
// while the recorder is alive, for each other living player the file has a position for: is he behind a wall
// from the recorder's eyes (the same test the viewer uses: head and feet both blocked)? Counted for enemies and
// teammates apart. A server that hides enemies its player can't see (an anti-wallhack plugin) shows up as
// enemies almost never behind walls while teammates often are. Also: how near the nearest enemy is when he
// first appears in the file, and how often an enemy appears or vanishes while close.
(() => {
  if (!MAP) return { map: false };
  const blocked = (a, b) => { const r = solidAlong(MAP.bsp, a, b, 4, R3.broken, R3.poses); return r.hit.some((h, i) => !(i === 0 && h.f0 * r.len <= 8)); };
  const c = { enemy: { visible: 0, hidden: 0 }, team: { visible: 0, hidden: 0 } };
  const appearDist = [], seen = {};
  for (let t = D.start + 1; t < D.end; t += 0.25) {
    POV.i = 0; const v = povView(t); const rs = playerState(v.rec, t);
    if (!rs || !(rs.state > 0) || povObs(t)[0] !== 0) { for (const k in seen) delete seen[k]; continue; }
    for (const e in D.slots) {
      if (+e === v.rec) continue;
      const s = playerState(+e, t);
      const here = !!(s && s.state > 0 && Number.isFinite(s.x) && (s.x || s.y));
      const enemy = s && s.state !== rs.state;
      if (here && enemy && !seen[e]) appearDist.push(Math.hypot(s.x - v.pos[0], s.y - v.pos[1]));
      seen[e] = here;
      if (!here) continue;
      const hid = blocked(v.pos, [s.x, s.y, s.z + (s.duck ? 12 : 24)]) && blocked(v.pos, [s.x, s.y, s.z]);
      c[enemy ? 'enemy' : 'team'][hid ? 'hidden' : 'visible']++;
    }
  }
  appearDist.sort((a, b) => a - b);
  const pct = (o) => o.visible + o.hidden ? Math.round(o.hidden / (o.visible + o.hidden) * 100) + '% behind walls' : '-';
  return { enemies: c.enemy, enemiesBehind: pct(c.enemy), teammates: c.team, teammatesBehind: pct(c.team),
    enemyFirstSeenAtUnits: { n: appearDist.length, p10: Math.round(appearDist[Math.floor(appearDist.length * 0.1)]), median: Math.round(appearDist[appearDist.length >> 1]) } };
})()
