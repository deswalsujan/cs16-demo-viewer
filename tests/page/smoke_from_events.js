(async () => {
  // 0.14.0: smokes from the game's createsmoke events, HE and flash bursts for grenades the demo has no object for.
  // Set window.__smokeAt to a demo time (seconds) to look at the smoke that pops nearest to it; default: the first live one.
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const count = (f) => { const o = {}; for (const n of M.nades.filter(f)) o[n.type] = (o[n.type] || 0) + 1; return o; };
  const out = { all: count(() => true), fromObjects: count((n) => !n.fromEvents), addedFromEvents: count((n) => n.fromEvents), smokesWithEventCloud: M.nades.filter((n) => n.type === 'smoke' && n.cloud).length };
  const at = window.__smokeAt;
  const smokes = M.nades.filter((n) => n.type === 'smoke' && n.t0 > M.liveR[0].start);
  const sm = at != null ? smokes.slice().sort((a, b) => Math.abs(a.stop - at) - Math.abs(b.stop - at))[0] : smokes[0];
  const c = sm.cloud || sm.pts.slice(-3);
  out.picked = { pop: +sm.stop.toFixed(2), ends: +sm.t1.toFixed(2), centre: c.map(Math.round), fromEvents: !!sm.fromEvents };
  document.querySelector('#viewSeg [data-v="split"]').click(); await wait(300);
  setCam('free');
  cam3.pos = [c[0] - 520, c[1] - 120, c[2] + 260]; cam3.yaw = 12; cam3.pitch = 22;
  playing = false; seek(sm.stop - 0.5); await wait(1200);
  const vis = () => [...R3.ov.m.entries()].filter(([k, o]) => k.startsWith('sm:') && o.visible).map(([, o]) => +o.material.opacity.toFixed(2));
  out.halfSecondBefore = vis();
  seek(sm.stop + 3); await wait(1500);
  out.threeSecondsAfter = vis();
  closeSummary(); document.querySelector('#viewSeg [data-v="3d"]').click(); await wait(1500);
  out.colour = (() => { const o = [...R3.ov.m.entries()].find(([k, v]) => k.startsWith('sm:') && v.visible); return o ? '#' + o[1].material.color.getHexString() : null; })();
  return out;
})()
