(async () => {
  // 0.14.0: the Free camera button (and V) starts near the player being followed, not where the free camera was left
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  closeSummary();
  document.querySelector('#viewSeg [data-v="3d"]').click(); await wait(300);
  const r = M.liveR[Math.min(3, M.liveR.length - 1)];
  playing = false; seek(r.start + 25); await wait(300);
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const out = {};
  for (const from of ['eyes', 'chase']) {
    // leave the free camera in a far corner first
    setCam('free'); cam3.pos = [-9000, -9000, 3000]; await wait(200);
    selected = alivePlayers()[0]; setCam(from, true); await wait(600);
    const s = playerState(selected, T), eye = [s.x, s.y, s.z + 17];
    document.querySelector('#cam3 [data-c="free"]').click(); await wait(400);
    out[from] = { mode: cam3.mode, unitsFromPlayer: Math.round(dist(cam3.pos, eye)), yawDiff: Math.round(Math.abs(((cam3.yaw - s.yaw) % 360 + 540) % 360 - 180)) };
  }
  // the V key from Behind player goes to Free camera too
  setCam('chase', true); await wait(400);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' })); await wait(300);
  const s = playerState(selected, T);
  out.vKey = { mode: cam3.mode, unitsFromPlayer: Math.round(dist(cam3.pos, [s.x, s.y, s.z + 17])) };
  // dragging from Player's eyes still takes over the exact view (unchanged)
  setCam('eyes', true); await wait(400);
  const c = R3.camera.position.clone();
  setCam('free', false, true);
  out.dragTakeover = { units: Math.round(dist(cam3.pos, [c.x, -c.z, c.y])) };
  return out;
})()
