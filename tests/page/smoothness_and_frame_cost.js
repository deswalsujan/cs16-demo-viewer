(async () => {
  // ---- setup: 3D view; six 10 s stretches in different rounds, each with its busiest living player ----
  setView('3d');
  const SEC = 10, FPS = 60, S = D.stride;
  const pickBusy = (T0) => {
    const i0 = M.idxAt(T0), i1 = M.idxAt(T0 + SEC); let best = null, bestScore = -1;
    for (const e in D.slots) {
      const a = D.slots[e]; let ok = true, score = 0;
      for (let i = i0; i <= i1; i++) { if (!(a[i * S + 5] > 0)) { ok = false; break; } if (i > i0) score += Math.abs(((a[i * S + 3] - a[(i - 1) * S + 3] + 540) % 360) - 180) + Math.hypot(a[i * S] - a[(i - 1) * S], a[i * S + 1] - a[(i - 1) * S + 1]) * 0.2; }
      if (ok && score > bestScore) { bestScore = score; best = +e; }
    }
    return best;
  };
  const realNow = performance.now.bind(performance);
  const runCase = (T0, e) => {
    selected = e; setCam('eyes', true); playing = false;
    let fake = realNow(); performance.now = () => fake;
    T = T0 - 0.5; for (let k = 0; k < 30; k++) { fake += 1000 / FPS; T += 1 / FPS; update3(); }
    const cam = [];
    for (let k = 0; k <= SEC * FPS; k++) {
      fake += 1000 / FPS; T = T0 + k / FPS; update3();
      const c = R3.camera, d = new THREE.Vector3(); c.getWorldDirection(d);
      cam.push([c.position.x, c.position.y, c.position.z, d.x, d.y, d.z]);
    }
    performance.now = realNow;
    const acc = [], aim = [], pitchStill = [];
    for (let k = 1; k < cam.length - 1; k++) {
      const [p0, p1, p2] = [cam[k - 1], cam[k], cam[k + 1]];
      acc.push(Math.hypot(p2[0] - 2 * p1[0] + p0[0], p2[2] - 2 * p1[2] + p0[2]));            // sideways movement: change in motion per frame (units)
      aim.push(Math.hypot(p2[3] - 2 * p1[3] + p0[3], p2[4] - 2 * p1[4] + p0[4], p2[5] - 2 * p1[5] + p0[5]) * 180 / Math.PI); // aim: change in turning per frame (degrees)
      pitchStill.push(Math.abs(p1[4] - p0[4]) < 1e-7 ? 1 : 0);
    }
    return { acc, aim, frozen: pitchStill.reduce((a, b) => a + b, 0) };
  };
  const cases = [], all = { acc: [], aim: [], frozen: 0 };
  const rounds = M.liveR.filter((r) => r.end - r.start > 60);
  for (const ri of [0, 3, 7, 11, 16, 22]) {
    const r = rounds[ri % rounds.length], T0 = r.start + 20, e = pickBusy(T0);
    if (e == null) continue;
    const res = runCase(T0, e);
    cases.push(nameAt(e, T0) + ' R' + r.ln + ' ' + clockText(T0));
    all.acc.push(...res.acc); all.aim.push(...res.aim); all.frozen += res.frozen;
  }
  const pct = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return +s[Math.floor((s.length - 1) * p)].toFixed(3); };
  const over = (arr, th) => arr.filter((x) => x > th).length;
  const smooth = {
    cases, frames: all.aim.length,
    aim: { p50: pct(all.aim, 0.5), p95: pct(all.aim, 0.95), p99: pct(all.aim, 0.99), max: pct(all.aim, 1), jolts: over(all.aim, 0.5) },
    move: { p50: pct(all.acc, 0.5), p95: pct(all.acc, 0.95), p99: pct(all.acc, 0.99), max: pct(all.acc, 1), jolts: over(all.acc, 0.5) },
    pitchFramesFrozen: all.frozen,
  };
  const T0 = rounds[0].start + 20, best = pickBusy(T0);
  // ---- 2. frame cost: our own code per frame (3D drawing call stubbed), 300 frames per camera ----
  const rr = R3.renderer, origRender = rr.render.bind(rr);
  rr.render = () => {};
  const runCost = (label) => {
    const out = []; let f = realNow();
    performance.now = () => f;
    for (let k = 0; k < 300; k++) {
      f += 1000 / 60; T = T0 + k / 60;
      const a = realNow();
      drawPlayhead(); update3(); if (k % 6 === 0) updateHud(false);
      out.push(realNow() - a);
    }
    performance.now = realNow;
    out.sort((x, y) => x - y);
    return { avgMs: +(out.reduce((x, y) => x + y, 0) / out.length).toFixed(2), p95Ms: +out[Math.floor(out.length * 0.95)].toFixed(2), maxMs: +out[out.length - 1].toFixed(2) };
  };
  const cost = { eyes: runCost('eyes') };
  setCam('free'); cam3.pos = [0, 0, 2600]; cam3.yaw = 0; cam3.pitch = 80;
  { const xs = [], ys = []; for (const e in D.slots) { const s = playerState(+e, T0); if (s && s.state > 0) { xs.push(s.x); ys.push(s.y); } } cam3.pos = [xs.reduce((a, b) => a + b) / xs.length, ys.reduce((a, b) => a + b) / ys.length, 2600]; }
  cost.freeOverhead = runCost('free');
  rr.render = origRender;
  selected = best; setCam('eyes', true);
  T = T0 + 3;
  return { smooth, cost };
})()
