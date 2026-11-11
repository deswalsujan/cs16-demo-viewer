// ---------------- grenades the demo has no object for ----------------
// The old engine sends at most 256 objects per snapshot. On a map with lots of scenery (de_tuscan) the
// map alone nearly fills that, so the server leaves out grenades in flight and guns on the floor, and the
// demo has no flight path for them. What it does have:
//   - smokes: the game's own createsmoke events, one when the smoke pops (its centre) and one every second
//     while it smokes, which is also what the game draws the cloud from. Used for every smoke, so the
//     cloud starts when the smoke pops and lasts as long as it puffs, in every demo.
//   - HE grenades: the explosion temp entity (D.booms), minus the C4.
//   - flashbangs: the flashbang pop sound, which carries its position.
// A grenade object that is in the demo keeps its flight path; these only add what's missing.
function addNadesFromEvents(nades) {
  const near = (a, b, d) => Math.hypot(a[0] - b[0], a[1] - b[1]) <= d;
  // smokes: group the puffs by cloud centre. The recorder drops some of these events (the game sends
  // them unreliably), so a smoke can have gaps of several seconds, or miss its first event.
  const P = D.puffs || [], clouds = [];
  for (let i = 0; i < P.length; i += 5) {
    const t = P[i], kind = P[i + 1], c = [P[i + 2], P[i + 3], P[i + 4]];
    let s = clouds.find((x) => t - x.last < 22 && t - x.t0 < 23 && Math.abs(c[0] - x.c[0]) < 1 && Math.abs(c[1] - x.c[1]) < 1 && Math.abs(c[2] - x.c[2]) < 1);
    if (!s) { s = { c, t0: kind === 1 ? t : t - 0.1, popped: kind === 1, last: t }; clouds.push(s); }
    else { if (kind === 1) { s.t0 = Math.min(s.t0, t); s.popped = true; } s.last = t; }
  }
  // the pop sound (weapons/sg_explode.wav) carries the exact moment and place when the first event is missing
  const sg = new Set(); for (const k in D.sounds) if (D.sounds[k] === 'weapons/sg_explode.wav') sg.add(+k);
  const S = D.snds || [];
  if (sg.size) for (let i = 0; i < S.length; i += 10) {
    if (!sg.has(S[i + 1]) || isNaN(S[i + 7])) continue;
    const s = clouds.find((x) => !x.popped && S[i] <= x.t0 + 0.2 && S[i] > x.t0 - 22 && near([S[i + 7], S[i + 8]], x.c, 64));
    if (s) { s.t0 = S[i]; s.popped = true; }
  }
  // a smoke lasts about 21 seconds (the pop, then 21 puffs a second apart: SG_Smoke), unless the round restarts first
  const starts = (D.rounds || []).map((r) => r.start);
  for (const s of clouds) {
    const next = starts.find((t) => t > s.t0 + 0.5);
    s.last = Math.min(Math.max(s.last, s.t0 + 21), next != null ? next : Infinity);
  }
  for (const s of clouds) {
    // a smoke object in the demo with its flight path: the can was at the cloud's centre when it popped.
    // (After popping, the game throws the can up and sideways, so where it lands isn't where the smoke is.)
    const g = nades.find((n) => {
      if (n.type !== 'smoke' || n.cloud || s.t0 < n.t0 - 0.5 || s.t0 > n.t1 + 0.5) return false;
      const p = n.pts;
      for (let i = 0; i < p.length; i += 4) if (Math.abs(p[i] - s.t0) < 0.35 && near([p[i + 1], p[i + 2]], s.c, 40)) return true;
      return false;
    });
    if (g) { g.stop = Math.max(g.t0, s.t0); g.t1 = Math.max(s.last, g.stop); g.cloud = s.c; }
    else nades.push({ type: 'smoke', pts: [s.t0, s.c[0], s.c[1], s.c[2]], t0: s.t0, stop: s.t0, t1: s.last, cloud: s.c, fromEvents: true });
  }
  const burst = (type, t, pos) => {
    if (nades.some((n) => n.type === type && !n.fromEvents && Math.abs(n.t1 - t) < 0.6 && near(n.pts.slice(-3), pos, 200))) return;
    nades.push({ type, pts: [t, pos[0], pos[1], pos[2]], t0: t, stop: t, t1: t, fromEvents: true });
  };
  // HE grenades: explosions that aren't the C4 (the C4 goes off where it was planted)
  const B = D.booms || [], plants = (D.bomb || []).filter((b) => b.type === 'plantpos');
  for (let i = 0, last = null; i < B.length; i += 4) {
    const pos = [B[i + 1], B[i + 2], B[i + 3]];
    if (last && B[i] - last.t < 0.3 && near(last.pos, pos, 120)) continue; // an HE sends two explosion effects, the second up to 64 units off (ggrenade.cpp)
    last = { t: B[i], pos };
    if (plants.some((b) => B[i] - b.t > 10 && B[i] - b.t < 90 && near(b.pos, pos, 120))) continue;
    burst('he', B[i], pos);
  }
  // flashbangs: the pop sound
  const pops = new Set(); for (const k in D.sounds) if (/^weapons\/flashbang-[12]\.wav$/.test(D.sounds[k])) pops.add(+k);
  if (pops.size) for (let i = 0, last = null; i < S.length; i += 10) {
    if (!pops.has(S[i + 1]) || isNaN(S[i + 7])) continue;
    const pos = [S[i + 7], S[i + 8], S[i + 9]];
    if (last && S[i] - last.t < 0.3 && near(last.pos, pos, 32)) continue; // the same pop sent twice
    last = { t: S[i], pos };
    burst('flash', S[i], pos);
  }
  nades.sort((a, b) => a.t0 - b.t0);
}
