// The killing bullet's ✕ comes in the same frame as the kill feed (Sujan, 1 Nov 2026, 0.26.3). For each wallbang
// kill with damage numbers (a burst ending in it), up to window.__max (default 6), with no other kill by the same
// killer in the 1.5 s before: plays from 0.25 s before the kill to 0.15 s after at 0.25x in Player's eyes on the
// killer, and notes in every frame whether the kill is in the kill feed and whether a ✕ was drawn. Passes when, for
// every kill, the first frame with the ✕ is the first frame with the kill in the feed. Waits for the map and the
// picture check. Run with DEMO=k1ck (k1ck vs eq, Nuke, DreamHack Winter 2011: spekz on DECE, R2 1:18, among them).
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && M.wbs && MAP.name === D.mapName.toLowerCase() && R3 && view3.map === MAP.name) && Date.now() - t0 < 200000) await wait(500);
  while ((M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null)) && Date.now() - t0 < 400000) await wait(500);
  setView('3d'); await wait(1000);
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  const at = (k) => { const r = M.rounds.find((x) => x.n === k.round); return `R${r ? r.ln : '?'} ${clockText(k.t)}`; };
  const kills = M.bursts.filter((b) => b.kill).map((b) => b.kill)
    .filter((k) => !D.kills.some((o) => o !== k && o.killer === k.killer && o.t < k.t && k.t - o.t < 1.5))
    .slice(0, window.__max || 6);
  // spy: a ✕ drawn on any 2D canvas during update3, and the kill feed as frame() left it just before
  let drewX = false;
  const fill = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (txt, ...rest) { if (txt === '✕') drewX = true; return fill.call(this, txt, ...rest); };
  const orig = update3; let log = null;
  update3 = function () {
    const tf = T; drewX = false; const r = orig.apply(this, arguments);
    if (log) log.push({ t: tf, x: drewX, feed: lastFeedKey.split(',').includes(String(log.k.t)) });
    return r;
  };
  const out = [];
  try {
    for (const k of kills) {
      playing = false; selected = k.killer; setCam('eyes', true);
      T = k.t - 0.25; prevT = T; await wait(400);
      log = []; log.k = k; speed = 0.25; playing = true;
      while (T < k.t + 0.15 && Date.now() - t0 < 900000) await wait(30);
      playing = false;
      const f = log; log = null;
      const fx = f.findIndex((e) => e.x), ff = f.findIndex((e) => e.feed);
      out.push({ kill: `${at(k)} ${nm(k.kp)} -> ${nm(k.vp)} ${k.weapon}`, frames: f.length, firstX: fx, firstFeed: ff,
        xMinusKill: fx >= 0 ? +(f[fx].t - k.t).toFixed(3) : null, feedMinusKill: ff >= 0 ? +(f[ff].t - k.t).toFixed(3) : null, same: fx >= 0 && fx === ff });
    }
  } finally {
    update3 = orig; CanvasRenderingContext2D.prototype.fillText = fill; speed = 1;
  }
  return { demo: D.fileName, kills: out.length, pass: out.length > 0 && out.every((o) => o.same), out };
})()
