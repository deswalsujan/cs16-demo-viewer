// POV mode: why a kill of the recorder's isn't listed as a wallbang. Lists his gun kills with demo time and round
// clock; for those within 15 s of window.__wbAt (demo seconds from the start, default 123 = 2:03) or whose round
// clock reads window.__wbClock (default '2:03'), runs the finder's steps one by one: victim position, live round,
// one-surface gun, body visible from his eye (finder's 15 points), damage rule, and the crosshair line both from
// the snapshot aim the finder uses and from his exact view at his last shot (traced to the victim's distance).
(() => {
  const at = window.__wbAt != null ? window.__wbAt : 123, clock = window.__wbClock || '2:03';
  const bsp = MAP.bsp, out = { start: fmt(0), live: M.liveR.map((r) => r.n), kills: [] };
  const eyeOf = (p) => [p[0], p[1], p[2] + (p[3] ? 12 : 17)];
  const S = D.ownShots;
  for (const k of D.kills) {
    POV.i = 0; const v0 = povView(k.t);
    if (k.killer !== v0.rec || k.victim === k.killer || !k.weapon || /grenade|knife|world/.test(k.weapon)) continue;
    const ck = clockText(k.t) || '';
    const row = { at: fmt(k.t - D.start), clock: ck, round: k.round, victim: nameAt(k.victim, k.t), gun: k.weapon, hs: !!k.hs, wb: !!k.wb };
    out.kills.push(row);
    if (Math.abs(k.t - D.start - at) > 15 && ck !== clock) continue;
    const d = row.detail = {};
    d.liveRound = M.liveR.some((r) => r.n === k.round);
    d.oneSurfaceGun = ONE_SURFACE.has(k.weapon);
    d.killerPos = !!(k.kpos && k.kpos.every(Number.isFinite));
    d.victimPos = !!(k.vpos && k.vpos.every(Number.isFinite));
    if (!d.killerPos || !d.victimPos) continue;
    const tP = k.tPos != null ? k.tPos : k.t, skip = brokenSet(tP - 0.05), poses = posesAt(tP - 0.05);
    const eye = eyeOf([...k.kpos, k.kduck]), v = [...k.vpos, k.vduck];
    d.dist = Math.round(Math.hypot(v[0] - eye[0], v[1] - eye[1], v[2] - eye[2]));
    const dx = v[0] - eye[0], dy = v[1] - eye[1], hl = Math.hypot(dx, dy) || 1, px = -dy / hl, py = dx / hl;
    const zs = v[3] ? [-12, 0, 10, 16] : [-30, -12, 6, 22, 30];
    const open = [];
    for (const z of zs) for (const sd of [-12, 0, 12]) if (solidAlong(bsp, eye, [v[0] + px * sd, v[1] + py * sd, v[2] + z], 2, skip, poses).solid === 0) open.push(`z${z} side${sd}`);
    d.bodyPointsVisible = open.length + ' of ' + zs.length * 3 + (open.length ? ' (' + open.join(', ') + ')' : '');
    d.tooMuchDamage = tooMuchDamage(k);
    let raw = k.kang ? k.kang[0] : 0; if (raw > 180) raw -= 360;
    const pitch = -raw * 3 * Math.PI / 180, yaw = (k.kang ? k.kang[1] : 0) * Math.PI / 180;
    const end = [eye[0] + Math.cos(pitch) * Math.cos(yaw) * d.dist, eye[1] + Math.cos(pitch) * Math.sin(yaw) * d.dist, eye[2] - Math.sin(pitch) * d.dist];
    const a = solidAlong(bsp, eye, end, 2, skip, poses);
    d.snapshotAim = { solid: Math.round(a.solid), walls: a.hit.map((h) => ({ from: Math.round(h.f0 * a.len), thick: Math.round((h.f1 - h.f0) * a.len), model: h.model })) };
    let ts = null; for (let i = 0; i < S.length; i += 3) if (S[i] <= k.t + 0.001 && S[i] > k.t - 1) ts = S[i];
    if (ts != null) {
      POV.i = 0; const pv = povView(ts), f = fwd(pv.yaw, pv.pitch);
      const e2 = [pv.pos[0] + f[0] * d.dist, pv.pos[1] + f[1] * d.dist, pv.pos[2] + f[2] * d.dist];
      const b = solidAlong(bsp, pv.pos, e2, 2, skip, poses);
      d.exactAimLastShot = { before: +(k.t - ts).toFixed(2), eyeGap: Math.round(Math.hypot(pv.pos[0] - eye[0], pv.pos[1] - eye[1], pv.pos[2] - eye[2])), solid: Math.round(b.solid), walls: b.hit.map((h) => ({ from: Math.round(h.f0 * b.len), thick: Math.round((h.f1 - h.f0) * b.len), model: h.model })) };
    }
    // does the victim stand where the server last sent him? seconds since his last snapshot position
    d.kpos = k.kpos.map(Math.round); d.vpos = k.vpos.map(Math.round);
  }
  return out;
})()
