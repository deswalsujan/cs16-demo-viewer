// C4 timer above the view (0.21.0): counts down from 0:35 at the plant to 0:00, holds 0:00 from the explosion until
// the next round, and stops where it was at a defuse. The lists keep the time since the plant ("C4 0:15").
// Run with DEMO=mtw-vs-lions MAP_NEEDED=0 (mTw vs Lions, Nuke, DreamHack Summer 2011: plant at 38:22 with slow motion
// before the explosion). Reads the timer element itself (#rclock) as well as clockText.
(() => {
  const out = [];
  for (const p of D.bomb.filter((b) => b.type === 'plantpos')) {
    const r = roundAt(p.t + 0.01); if (!r) continue;
    const find = (re) => D.centre.find((c) => c.t >= p.t && c.t <= r.end + 0.5 && re.test(c.s));
    const boom = find(/Target_Bombed/), def = find(/Bomb_Defused/);
    const next = M.rounds.find((x) => x.start > p.t + 1);
    const row = { plant: fmt(p.t - D.start), end: boom ? 'exploded' : def ? 'defused' : 'other' };
    row.atPlant = clockText(p.t, true);
    // 10 s of game time after the plant (slow motion counts at half speed on the demo's clock)
    let t10 = p.t; while (gameSpan(p.t, t10) < 10.5 && t10 < r.end) t10 += 0.05;
    row.after10 = clockText(t10, true); row.listAfter10 = clockText(t10);
    if (boom) {
      row.fuse = +gameSpan(p.t, boom.t).toFixed(2);
      row.justBefore = clockText(boom.t - 0.05, true); row.atBoom = clockText(boom.t + 0.01, true);
      if (next) { row.beforeNext = clockText(next.start - 0.2, true); row.nextRound = clockText(next.start + 0.5, true); }
    }
    if (def) { row.atDefuse = clockText(def.t + 0.01, true); row.afterDefuse = clockText(def.t + 2, true); row.defusedAfter = +gameSpan(p.t, def.t).toFixed(2); }
    out.push(row);
  }
  // the 38:22 plant: the timer element itself, at the plant, mid-fuse and after the explosion
  const p = D.bomb.find((b) => b.type === 'plantpos' && fmt(b.t - D.start) === '38:22');
  let el = null;
  if (p) {
    const r = roundAt(p.t + 0.01), boom = D.centre.find((c) => c.t >= p.t && c.t <= r.end + 0.5 && /Target_Bombed/.test(c.s));
    const read = (t) => { seek(t); playing = false; return new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => res($('rclock').innerText)))); };
    return (async () => {
      await read(p.t - 1); // the first seek after opening only wakes the drawing loop
      el = { atPlant: await read(p.t + 0.02), mid: await read(p.t + 15), afterBoom: boom ? await read(boom.t + 1) : null };
      const kills = r.kills.filter((k) => k.t >= p.t).map((k) => clockText(k.t));
      return { bombs: out, r24: el, r24KillsList: kills };
    })();
  }
  return { bombs: out, r24: 'no plant at 38:22' };
})()
