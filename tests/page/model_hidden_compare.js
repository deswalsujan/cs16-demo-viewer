// Is the victim fully hidden? Three ways, for every kill that would be a wallbang if he was (the crosshair line
// goes through cover, the gun can wallbang, and the damage rule allows it): the 15 points of 0.17.0, the
// body outline every 2 units (wip/denser-hidden-check), and every vertex of the victim's posed player model and
// gun at the shot (one per 2-unit cell). 5 Oct 2026, after Sujan's answers on the review page.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 600 && !(MAP && MAP.name === D.mapName.toLowerCase() && M.wbs && R3); i++) await wait(500);
  if (!MAP || !R3) return { demo: D.fileName, error: 'no map or 3D' };
  if (!R3.rigs) R3.rigs = {};
  const bsp = MAP.bsp, live = (k) => M.liveR.some((r) => r.n === k.round);
  const BODY = (duck) => duck ? [[-16, 4, 10], [4, 8, 10], [8, 16, 5]] : [[-34, -8, 8], [-8, 18, 11], [18, 32, 5]];
  const out = [];
  for (const k of D.kills) {
    if (!k.kpos || !k.vpos || k.killer === k.victim || NO_WB.has(k.weapon) || ONE_SURFACE.has(k.weapon) || !live(k)) continue;
    const tP = k.tPos != null ? k.tPos : k.t;
    const skip = brokenSet(tP - 0.05), poses = posesAt(tP - 0.05);
    const eye = [k.kpos[0], k.kpos[1], k.kpos[2] + (k.kduck ? 12 : 17)];
    let raw = k.kang ? k.kang[0] : 0; if (raw > 180) raw -= 360;
    const pitch = -raw * 3 * Math.PI / 180, yawA = (k.kang ? k.kang[1] : 0) * Math.PI / 180;
    const dist = Math.hypot(k.vpos[0] - eye[0], k.vpos[1] - eye[1], k.vpos[2] - eye[2]);
    const end = [eye[0] + Math.cos(pitch) * Math.cos(yawA) * dist, eye[1] + Math.cos(pitch) * Math.sin(yawA) * dist, eye[2] - Math.sin(pitch) * dist];
    if (solidAlong(bsp, eye, end, 2, skip, poses).solid === 0) continue; // crosshair in the open
    if (tooMuchDamage(k)) continue;
    const v = [...k.vpos, k.vduck], dx = v[0] - eye[0], dy = v[1] - eye[1], hl = Math.hypot(dx, dy) || 1, px = -dy / hl, py = dx / hl;
    const clear = (p) => solidAlong(bsp, eye, p, 2, skip, poses).solid === 0;
    let old = false;
    for (const z of v[3] ? [-12, 0, 10, 16] : [-30, -12, 6, 22, 30]) { for (const sd of [-12, 0, 12]) if (clear([v[0] + px * sd, v[1] + py * sd, v[2] + z])) { old = true; break; } if (old) break; }
    let dense = false;
    for (const [z0, z1, w] of BODY(v[3])) { for (let z = z0; z <= z1 && !dense; z += 2) for (let sd = -w; sd <= w; sd += 2) if (clear([v[0] + px * sd, v[1] + py * sd, v[2] + z])) { dense = true; break; } if (dense) break; }
    // the posed model and gun, placed where the demo records the victim at the kill (k.vpos), like the other two checks
    let model = null, mpts = 0, mvis = 0;
    const e = k.victim, a = D.slots[e], tV = tP - 0.02, s = playerState(e, tV);
    const pname = a && playerModelName(a[M.idxAt(tV) * D.stride + 8]);
    if (s && pname) {
      const ent = modelEntry(pname); await ent.done;
      if (ent.status === 'ok') {
        const r = rigFor('probe' + e, pname); setBody(r, packAt(e, tV));
        const yaw = posePlayer(r, e, s, tV);
        if (yaw !== false) {
          const pts = [], seen = new Set();
          const add = (rig) => { const c = Math.cos(yaw * Math.PI / 180), sn = Math.sin(yaw * Math.PI / 180); for (const pt of rig.parts) { if (!pt.mesh.visible) continue; const P = pt.pos.array; for (let i = 0; i < P.length; i += 3) { const wx = P[i], wz = P[i + 1], wy = -P[i + 2]; const q = [v[0] + wx * c - wy * sn, v[1] + wx * sn + wy * c, v[2] + wz]; const key = q.map((x) => Math.round(x / 2)).join(','); if (!seen.has(key)) { seen.add(key); pts.push(q); } } } };
          add(r);
          if (s.weapon && /\.mdl$/i.test(s.weapon)) { const we = modelEntry(s.weapon); await we.done; if (we.status === 'ok') { const wr = rigFor('probew' + e, s.weapon); poseWeapon(wr, r); add(wr); } }
          mpts = pts.length;
          for (const p of pts) if (clear(p)) mvis++;
          model = mvis > 0;
        }
      }
    }
    const rr = M.rounds.find((x) => x.n === k.round);
    out.push({ line: `R${rr ? rr.ln : '?'} ${clockText(k.t)} ${M.pl[k.kp] ? M.pl[k.kp].name : '?'} ${k.weapon}${k.hs ? ' HS' : ''} -> ${M.pl[k.vp] ? M.pl[k.vp].name : '?'}`, listed: !!k.wb, oldSeen: old, denseSeen: dense, modelSeen: model, mpts, mvis, pname, shift: s ? Math.round(Math.hypot(s.x - v[0], s.y - v[1], s.z - v[2])) : null });
  }
  return { demo: D.fileName, n: out.length, list: out };
})()
