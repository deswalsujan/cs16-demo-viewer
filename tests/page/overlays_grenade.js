(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms)); await wait(3000); closeSummary();
  const out = {};
  setView('3d');
  // a moment with a grenade in flight in round 2, then a smoke that has popped
  const r = M.liveR[1];
  const g = M.nades.find((n) => n.t0 > r.start && n.t1 < r.end && n.type !== 'smoke');
  const sm = M.nades.find((n) => n.type === 'smoke' && n.t0 > r.start && n.t1 < r.end);
  out.nade = g ? g.type : null; out.smoke = !!sm;
  // free camera above the grenade's path, mid-flight
  const p = g.pts, mid = Math.floor(p.length / 8) * 4;
  setCam('free'); cam3.pos = [p[mid + 1] - 500, p[mid + 2], p[mid + 3] + 700]; cam3.yaw = 0; cam3.pitch = 45;
  T = (g.t0 + g.t1) / 2; playing = false; await wait(1500);
  out.overlaysMid = [...R3.ov.m.keys()].filter((k) => R3.ov.m.get(k).visible).map((k) => k.split(':')[0]).sort().join(',');
  window.__shot = 'nade';
  return out;
})()
