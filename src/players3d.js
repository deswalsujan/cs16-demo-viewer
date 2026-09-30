// ---------------- player models (3D) ----------------
// Real CS 1.6 player and weapon models, read from the Half-Life folder like the maps are. Legs run
// with the movement (gait), the upper body aims where the player looks, shots and reloads play their
// animations, and dead players fall and stay on the floor until the round ends. When a model file
// isn't available, the simple figure is drawn instead.
const MODELS = {}; // resource name -> { status, mdl, tex, gaitMask }
function getModel(name) {
  if (!name) return null;
  name = name.toLowerCase().replace(/\\/g, '/');
  let m = MODELS[name];
  if (m) return m.status === 'ok' ? m : null;
  m = MODELS[name] = { status: 'loading' };
  (async () => {
    try {
      let blob = files.mdl[name] || null, tblob = files.mdl[name.replace(/\.mdl$/, 't.mdl')] || null;
      const fromFolder = !!blob;
      if (!blob) { const c = await idb.get('mdl:' + name); if (c) { blob = c.m; tblob = c.t || null; } }
      if (!blob) { m.status = 'missing'; return; }
      const mdl = parseMdl(new Uint8Array(await blob.arrayBuffer()), tblob ? new Uint8Array(await tblob.arrayBuffer()) : null);
      m.tex = mdl.textures.map((t) => {
        const x = new THREE.DataTexture(t.rgba, t.w, t.h, THREE.RGBAFormat);
        x.magFilter = THREE.LinearFilter; x.minFilter = THREE.LinearMipmapLinearFilter; x.generateMipmaps = true;
        x.wrapS = x.wrapT = THREE.RepeatWrapping; x.anisotropy = 4; x.needsUpdate = true;
        return x;
      });
      // legs and hips follow the movement animation; everything from the spine up follows the aim/shoot/reload one
      const spine = mdl.boneByName['Bip01 Spine'];
      const under = new Uint8Array(mdl.numbones);
      for (let b = 0; b < mdl.numbones; b++) under[b] = b === spine || (mdl.bones[b].parent >= 0 && under[mdl.bones[b].parent]) ? 1 : 0;
      m.gaitMask = spine == null ? null : under.map((u) => (u ? 0 : 1));
      m.mdl = mdl;
      if (fromFolder) idb.put('mdl:' + name, { m: blob, t: tblob });
      m.status = 'ok';
    } catch (e) { m.status = 'missing'; }
  })();
  return null;
}
// forget models from an earlier folder pick that were missing, so a new pick gets another try
function retryMissingModels() { for (const k in MODELS) if (MODELS[k].status === 'missing') delete MODELS[k]; }

// one posed instance of a model in the scene
function makeRig(M) {
  const mdl = M.mdl, g = new THREE.Group(), parts = [];
  for (const bp of mdl.bodyparts) {
    const sub = bp.models[0]; if (!sub) continue;
    for (const me of sub.meshes) {
      const geo = new THREE.BufferGeometry();
      const pos = new THREE.BufferAttribute(new Float32Array(me.pos.length), 3), nrm = new THREE.BufferAttribute(new Float32Array(me.nrm.length), 3);
      pos.setUsage(THREE.DynamicDrawUsage); nrm.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('position', pos); geo.setAttribute('normal', nrm); geo.setAttribute('uv', new THREE.BufferAttribute(me.uv, 2));
      const t = mdl.textures[me.tex];
      const mat = new THREE.MeshLambertMaterial({ map: M.tex[me.tex] || null, side: THREE.DoubleSide, alphaTest: t && (t.flags & 64) ? 0.5 : 0 });
      const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false;
      g.add(mesh); parts.push({ me, pos, nrm, mat });
    }
  }
  R3.dyn.add(g);
  const n = mdl.numbones;
  return { M, g, parts, p: new Float32Array(n * 3), q: new Float32Array(n * 4), p2: new Float32Array(n * 3), q2: new Float32Array(n * 4), mats: new Float32Array(n * 12), used: true, tint: null };
}
function disposeRig(r) {
  R3.dyn.remove(r.g);
  for (const x of r.parts) { x.mesh && x.mesh.geometry.dispose(); x.mat.dispose(); }
  r.g.traverse((o) => o.geometry && o.geometry.dispose());
}
// move every vertex with its bone (model space -> three space: x, z, -y)
function skinRig(r) {
  const M = r.mats;
  for (const pt of r.parts) {
    const me = pt.me, P = pt.pos.array, N = pt.nrm.array, sp = me.pos, sn = me.nrm, bo = me.bone, nb = me.nbone;
    for (let i = 0, n = bo.length; i < n; i++) {
      const b = bo[i] * 12, x = sp[i * 3], y = sp[i * 3 + 1], z = sp[i * 3 + 2];
      const wx = M[b] * x + M[b + 1] * y + M[b + 2] * z + M[b + 3];
      const wy = M[b + 4] * x + M[b + 5] * y + M[b + 6] * z + M[b + 7];
      const wz = M[b + 8] * x + M[b + 9] * y + M[b + 10] * z + M[b + 11];
      P[i * 3] = wx; P[i * 3 + 1] = wz; P[i * 3 + 2] = -wy;
      const c = nb[i] * 12, nx = sn[i * 3], ny = sn[i * 3 + 1], nz = sn[i * 3 + 2];
      N[i * 3] = M[c] * nx + M[c + 1] * ny + M[c + 2] * nz;
      N[i * 3 + 1] = M[c + 8] * nx + M[c + 9] * ny + M[c + 10] * nz;
      N[i * 3 + 2] = -(M[c + 4] * nx + M[c + 5] * ny + M[c + 6] * nz);
    }
    pt.pos.needsUpdate = true; pt.nrm.needsUpdate = true;
  }
}
function placeRig(r, x, y, z, yaw, tint) {
  r.g.position.set(x, z, -y); r.g.rotation.set(0, yaw * Math.PI / 180, 0);
  if (r.tint !== tint) { r.tint = tint; for (const pt of r.parts) pt.mat.emissive.setHex(tint || 0); }
  r.g.visible = true; r.used = true;
}

// per-player animation bookkeeping, worked out once per demo so any moment can be drawn directly
let ANIM = {};
const angDiff = (a, b) => { let d = (a - b) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };
function prepAnim() {
  ANIM = {};
  const S = D.stride, times = D.times, n = times.length;
  if (S < 11) return;
  const shotT = {};
  const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) { const e = sh[i + 1]; if (e >= 1 && e <= 64) (shotT[e] || (shotT[e] = [])).push(sh[i]); }
  for (const e in D.slots) {
    const a = D.slots[e];
    const rs = new Float32Array(n), gs = new Float32Array(n), gy = new Float32Array(n), gd = new Float32Array(n);
    let cs = -1, cg = -1, s0 = 0, g0 = 0, yaw = null, dist = 0, px = NaN, py = NaN;
    for (let i = 0; i < n; i++) {
      const o = i * S, t = times[i], x = a[o], y = a[o + 1], vy = a[o + 3];
      if (a[o + 9] !== cs) { cs = a[o + 9]; s0 = t; }
      if (a[o + 10] !== cg) { cg = a[o + 10]; g0 = t; }
      rs[i] = s0; gs[i] = g0;
      if (isNaN(x) || a[o + 5] <= 0) { px = NaN; yaw = null; gy[i] = vy; gd[i] = dist; continue; }
      if (yaw == null) yaw = vy;
      const dt = i ? t - times[i - 1] : 0;
      let spd = 0, dir = 0;
      if (!isNaN(px) && dt > 0 && dt < 0.25) { const d = Math.hypot(x - px, y - py); if (d < 80) { spd = d / dt; dir = Math.atan2(y - py, x - px) * 180 / Math.PI; } }
      if (spd > 20) {
        // legs point along the movement; moving backwards turns them around and plays the run in reverse
        let sign = 1, tgt = dir; const diff = angDiff(vy, dir);
        if (diff > 90) { tgt = dir + 180; sign = -1; } else if (diff < -90) { tgt = dir - 180; sign = -1; }
        yaw += angDiff(tgt, yaw) * 0.5;
        dist += spd * dt * sign;
      } else yaw += angDiff(vy, yaw) * 0.12; // standing: legs catch up with where the player looks
      gy[i] = yaw; gd[i] = dist; px = x; py = y;
    }
    ANIM[e] = { rs, gs, gy, gd, shots: shotT[e] || [] };
  }
}
function lastBefore(arr, t) { let lo = 0, hi = arr.length - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (arr[m] <= t) { r = m; lo = m + 1; } else hi = m - 1; } return r >= 0 ? arr[r] : -1e9; }

// pose a player rig for time t; returns false when the model isn't ready
function posePlayer(r, e, s, t) {
  const A = ANIM[e]; if (!A) return false;
  const mdl = r.M.mdl, S = D.stride, a = D.slots[e];
  const i = M.idxAt(t), j = Math.min(i + 1, D.times.length - 1), o = i * S;
  const span = D.times[j] - D.times[i], f = span > 0 && span < 0.5 ? Math.max(0, Math.min(1, (t - D.times[i]) / span)) : 0;
  const seq = a[o + 9], gait = a[o + 10];
  const q = mdl.seqs[seq] || mdl.seqs[0];
  let start = A.rs[i];
  if (/shoot/.test(q.name)) start = Math.max(start, lastBefore(A.shots, t)); // every shot restarts the recoil
  const upFrame = (t - start) * q.fps;
  const gyaw = s.state > 0 && gait ? A.gy[i] + angDiff(A.gy[j], A.gy[i]) * f : s.yaw;
  const bs = 0.5 - Math.max(-90, Math.min(90, angDiff(s.yaw, gyaw))) / 180;
  const bt = (Math.max(-90, Math.min(90, s.pitch)) + 90) / 180;
  mdlPose(mdl, seq, upFrame, bs, bt, r.p, r.q);
  if (gait && r.M.gaitMask && mdl.seqs[gait]) {
    const gq = mdl.seqs[gait];
    const gf = gq.linear[0] > 1 ? (A.gd[i] + (A.gd[j] - A.gd[i]) * f) / gq.linear[0] * gq.numframes : (t - A.gs[i]) * gq.fps;
    mdlPose(mdl, gait, gf, 0.5, 0.5, r.p2, r.q2);
    const gm = r.M.gaitMask;
    for (let b = 0; b < mdl.numbones; b++) if (gm[b]) {
      r.p[b * 3] = r.p2[b * 3]; r.p[b * 3 + 1] = r.p2[b * 3 + 1]; r.p[b * 3 + 2] = r.p2[b * 3 + 2];
      r.q[b * 4] = r.q2[b * 4]; r.q[b * 4 + 1] = r.q2[b * 4 + 1]; r.q[b * 4 + 2] = r.q2[b * 4 + 2]; r.q[b * 4 + 3] = r.q2[b * 4 + 3];
    }
  }
  mdlBoneMats(mdl, r.p, r.q, r.mats);
  skinRig(r);
  return gyaw;
}
// weapons in hand share the hand bones of the player holding them
function poseWeapon(w, pr) {
  const wm = w.M.mdl, pm = pr.M.mdl;
  if (w.mergeFor !== pm) {
    w.mergeFor = pm;
    w.merge = new Int16Array(wm.numbones);
    for (let b = 0; b < wm.numbones; b++) { const k = pm.boneByName[wm.bones[b].name]; w.merge[b] = k == null ? -1 : k; }
    mdlPose(wm, 0, 0, 0.5, 0.5, w.p, w.q);
  }
  w.merge.mats = pr.mats;
  mdlBoneMats(wm, w.p, w.q, w.mats, w.merge);
  skinRig(w);
}

// the rigs in the scene this frame, by key: "p5" player 5, "w5" their weapon, "c12" a corpse
function rigFor(key, name) {
  const M = getModel(name); if (!M) return null;
  let r = R3.rigs[key];
  if (r && r.M !== M) { disposeRig(r); r = null; }
  if (!r) r = R3.rigs[key] = makeRig(M);
  return r;
}
function beginRigs() { if (!R3.rigs) R3.rigs = {}; for (const k in R3.rigs) R3.rigs[k].used = false; }
function endRigs() { for (const k in R3.rigs) if (!R3.rigs[k].used) R3.rigs[k].g.visible = false; }
function clearRigs() { if (!R3 || !R3.rigs) return; for (const k in R3.rigs) disposeRig(R3.rigs[k]); R3.rigs = {}; }

const SEL_TINT = 0x5a4a22;
// a living or dying player; returns true when drawn with a real model
function drawModelPlayer(e, s, hide) {
  if (!opts.models) return false;
  const a = D.slots[e], S = D.stride, i = M.idxAt(T);
  const pname = D.models[a[i * S + 8]];
  if (!pname || !/\.mdl$/i.test(pname)) return false;
  const r = rigFor('p' + e, pname);
  if (!r) return false;
  if (hide) { r.used = true; r.g.visible = false; const w = R3.rigs['w' + e]; if (w) { w.used = true; w.g.visible = false; } return true; }
  const yaw = posePlayer(r, e, s, T);
  if (yaw === false) return false;
  const tint = e === selected && cam3.mode === 'free' ? SEL_TINT : 0;
  placeRig(r, s.x, s.y, s.z, yaw, tint);
  if (s.state > 0 && s.weapon && /\.mdl$/i.test(s.weapon)) {
    const w = rigFor('w' + e, s.weapon);
    if (w) { poseWeapon(w, r); placeRig(w, s.x, s.y, s.z, yaw, tint); }
  }
  return true;
}
// bodies left on the floor after a death (the game sends them as "corpse" messages)
function drawCorpses(r) {
  if (!opts.models || !D.corpses || !r) return new Set();
  const lying = new Set();
  const end = r.end != null ? r.end : D.end;
  D.corpses.forEach((c, k) => {
    if (c.t < r.start || c.t > T || c.t > end) return;
    lying.add(c.e);
    // the camera sits on this body during the death cam, so leave it out then
    if (c.e === selected && cam3.mode !== 'free') return;
    // same model the player had when they died (the corpse message can name a different one)
    const sl = D.slots[c.e], mi = sl ? sl[M.idxAt(Math.max(r.start, c.start)) * D.stride + 8] : 0;
    const name = mi && /^models\/player\//i.test(D.models[mi] || '') ? D.models[mi] : `models/player/${c.model}/${c.model}.mdl`;
    const rig = rigFor('c' + k, name); if (!rig) return;
    const mdl = rig.M.mdl, q = mdl.seqs[c.seq] || mdl.seqs[0];
    if (rig.frameFor !== k || rig.lastFrame !== Math.min(q.numframes - 1, (T - c.start) * q.fps)) {
      rig.frameFor = k; rig.lastFrame = Math.min(q.numframes - 1, (T - c.start) * q.fps);
      mdlPose(mdl, c.seq, rig.lastFrame, 0.5, 0.5, rig.p, rig.q);
      mdlBoneMats(mdl, rig.p, rig.q, rig.mats); skinRig(rig);
    }
    placeRig(rig, c.pos[0], c.pos[1], c.pos[2], c.yaw, 0);
  });
  return lying;
}
