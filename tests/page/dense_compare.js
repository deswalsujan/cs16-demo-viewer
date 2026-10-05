// Denser "fully hidden" check (wip/denser-hidden-check, 5 Oct 2026): for every kill the current finder lists
// as a wallbang, trace from the killer's eye to points every 2 units over the victim's body (legs, torso,
// head, each at its own width) instead of the 15 points used now. Lists the wallbangs where some of those
// points can be seen, with which parts. Waits for the map. Run with compare_all.sh on one page.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 600 && !(MAP && MAP.name === D.mapName.toLowerCase() && M.wbs); i++) await wait(500);
  if (!MAP) return { demo: D.fileName, error: 'no map' };
  for (let i = 0; i < 40 && !M.wbs.length; i++) await wait(250);
  const bsp = MAP.bsp;
  // body outline around the origin (the middle of the player's box): standing z -36..36, ducked z -18..18
  const PARTS = (duck) => duck
    ? [['legs and hips', -16, 4, 10], ['chest', 4, 8, 10], ['head', 8, 16, 5]]
    : [['legs', -34, -8, 8], ['body', -8, 18, 11], ['head', 18, 32, 5]];
  const out = [];
  // also the kills the 15 points call hidden that the damage rule (0.15.5) then dropped, as a check
  const live = (k) => M.liveR.some((r) => r.n === k.round);
  const old15 = (eye, v, skip, poses) => {
    const dx = v[0] - eye[0], dy = v[1] - eye[1]; const hl = Math.hypot(dx, dy) || 1; const px = -dy / hl, py = dx / hl;
    for (const z of v[3] ? [-12, 0, 10, 16] : [-30, -12, 6, 22, 30]) for (const sd of [-12, 0, 12]) if (solidAlong(bsp, eye, [v[0] + px * sd, v[1] + py * sd, v[2] + z], 2, skip, poses).solid === 0) return true;
    return false;
  };
  const cands = D.kills.filter((k) => k.kpos && k.vpos && k.killer !== k.victim && !NO_WB.has(k.weapon) && !ONE_SURFACE.has(k.weapon) && live(k));
  for (const k of cands) {
    const kNow = [...k.kpos, k.kduck], vNow = [...k.vpos, k.vduck];
    const tP = k.tPos != null ? k.tPos : k.t;
    const skip = brokenSet(tP - 0.05), poses = posesAt(tP - 0.05);
    const eye = [kNow[0], kNow[1], kNow[2] + (kNow[3] ? 12 : 17)];
    if (!k.wb && (old15(eye, vNow, skip, poses) || !tooMuchDamage(k))) continue; // listed now, or hidden but dropped by the damage rule
    const v = vNow, dx = v[0] - eye[0], dy = v[1] - eye[1], hl = Math.hypot(dx, dy) || 1, px = -dy / hl, py = dx / hl;
    let n = 0, seen = 0; const where = {};
    for (const [nm, z0, z1, w] of PARTS(v[3])) for (let z = z0; z <= z1; z += 2) for (let sd = -w; sd <= w; sd += 2) {
      n++;
      if (solidAlong(bsp, eye, [v[0] + px * sd, v[1] + py * sd, v[2] + z], 2, skip, poses).solid === 0) {
        seen++; const side = sd < -2 ? 'left' : sd > 2 ? 'right' : 'middle';
        (where[nm] || (where[nm] = new Set())).add(side);
      }
    }
    const r = M.rounds.find((x) => x.n === k.round);
    out.push({ round: r ? r.ln : null, timer: clockText(k.t), demoTime: fmt(k.t - D.start), t: k.t, killer: M.pl[k.kp] ? M.pl[k.kp].name : '?', victim: M.pl[k.vp] ? M.pl[k.vp].name : '?', weapon: k.weapon, hs: !!k.hs, listed: !!k.wb, thick: k.wb ? k.wb.thick : null, points: n, seen, where: Object.fromEntries(Object.entries(where).map(([a, b]) => [a, [...b]])), dist: Math.round(Math.hypot(v[0] - eye[0], v[1] - eye[1], v[2] - eye[2])) });
  }
  return { demo: D.fileName, wallbangs: M.wbs.length, removed: out.filter((x) => x.listed && x.seen > 0).length, damageRuleAlsoSeen: out.filter((x) => !x.listed && x.seen > 0).length, list: out };
})()
