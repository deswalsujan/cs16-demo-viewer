// ---------------- player models (3D) ----------------
// Real CS 1.6 player and weapon models, read from the Half-Life folder like the maps are. Legs run
// with the movement (gait), the upper body aims where the player looks, shots and reloads play their
// animations, and dead players fall and stay on the floor until the round ends. When a model file
// isn't available, the simple figure is drawn instead.
const MODELS = {}; // resource name -> { status, mdl, tex, gaitMask, custom, done }
async function fingerprint(u8) {
  try {
    if (!(window.crypto && crypto.subtle)) return null;
    const h = new Uint8Array(await crypto.subtle.digest('SHA-256', u8));
    return [...h.slice(0, 8)].map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) { return null; }
}
// start loading a model if needed; returns the entry (check .status, or await .done)
function modelEntry(name) {
  name = name.toLowerCase().replace(/\\/g, '/');
  let m = MODELS[name];
  if (m) return m;
  m = MODELS[name] = { status: 'loading', name };
  m.done = (async () => {
    try {
      let blob = files.mdl[name] || null, tblob = files.mdl[name.replace(/\.mdl$/, 't.mdl')] || null;
      let fromFolder = !!blob;
      let u8 = blob ? await readPicked(blob, name) : null, t8 = u8 && tblob ? await readPicked(tblob, name.replace(/\.mdl$/, 't.mdl')) : null;
      // not in the folder, or changed on disk since it was chosen: use this browser's saved copy if there is one
      if (!u8 || (tblob && !t8)) {
        fromFolder = false;
        const c = await idb.get('mdl:' + name);
        if (c) { blob = c.m; tblob = c.t || null; u8 = new Uint8Array(await blob.arrayBuffer()); t8 = tblob ? new Uint8Array(await tblob.arrayBuffer()) : null; }
      }
      if (!u8) { m.status = 'missing'; return m; }
      const fp = await fingerprint(u8);
      m.custom = fp != null && STOCK_MDL[name] !== fp;
      const mdl = parseMdl(u8, t8);
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
    } catch (e) { m.status = 'broken'; m.error = e.message || String(e); }
    return m;
  })();
  return m;
}
function getModel(name) {
  if (!name) return null;
  const m = modelEntry(name);
  return m.status === 'ok' ? m : null;
}
// forget models from an earlier folder pick that were missing, so a new pick gets another try
function retryMissingModels() { for (const k in MODELS) if (MODELS[k].status !== 'ok' && MODELS[k].status !== 'loading') delete MODELS[k]; }

// one posed instance of a model in the scene
function makeRig(M, parent) {
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
      g.add(mesh); parts.push({ me, pos, nrm, mat, mesh, map0: mat.map });
    }
  }
  (parent || R3.dyn).add(g);
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
  const shotK = {}; // index of each shot in D.shots, to know the weapon event and silencer state
  for (let i = 0; i < sh.length; i += 4) { const e = sh[i + 1]; if (e >= 1 && e <= 64) { (shotT[e] || (shotT[e] = [])).push(sh[i]); (shotK[e] || (shotK[e] = [])).push(i / 4); } }
  for (const e in D.slots) {
    const a = D.slots[e];
    const rs = new Float32Array(n), gs = new Float32Array(n), gy = new Float32Array(n), gd = new Float32Array(n), ws = new Float32Array(n);
    let cw = -1, w0 = 0;
    let cs = -1, cg = -1, s0 = 0, g0 = 0, yaw = null, dist = 0, px = NaN, py = NaN;
    for (let i = 0; i < n; i++) {
      const o = i * S, t = times[i], x = a[o], y = a[o + 1], vy = a[o + 3];
      if (a[o + 9] !== cs) { cs = a[o + 9]; s0 = t; }
      if (a[o + 10] !== cg) { cg = a[o + 10]; g0 = t; }
      if (a[o + 6] !== cw) { cw = a[o + 6]; w0 = t; }
      ws[i] = w0;
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
    ANIM[e] = { rs, gs, gy, gd, ws, shots: shotT[e] || [], shotK: shotK[e] || [] };
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
// "Team colours": real models drawn in flat red (Terrorists) or blue (Counter-Terrorists), shading kept
const TEAM_SKIN = { 1: 0xc42a1e, 2: 0x3462dc }; // clearly red and blue in sun and shade (the selected player also gets the sand highlight)
function colourRig(r, team) {
  const key = opts.teamColours && TEAM_SKIN[team] ? team : 0;
  if (r.colourKey === key) return;
  r.colourKey = key;
  for (const pt of r.parts) { pt.mat.map = key ? null : pt.map0; pt.mat.color.setHex(key ? TEAM_SKIN[key] : 0xffffff); pt.mat.needsUpdate = true; }
}
// "See through walls": a see-through copy of a player's body, drawn on top of walls in their team colour.
// It shares the body's shape, so it moves and animates with it.
const GHOST_MAT = {};
function ghostMat(team) { return GHOST_MAT[team] || (GHOST_MAT[team] = new THREE.MeshBasicMaterial({ color: team === 1 ? 0xff5a4a : 0x5a9bff, transparent: true, opacity: 0.5, depthTest: false, depthWrite: false })); }
function ghostRig(r, team, on) {
  if (!on) { if (r.ghost) r.ghost.visible = false; return; }
  if (!r.ghost) {
    r.ghost = new THREE.Group();
    for (const pt of r.parts) { const m = new THREE.Mesh(pt.mesh.geometry, ghostMat(team)); m.frustumCulled = false; m.renderOrder = 5; r.ghost.add(m); }
    r.g.add(r.ghost); r.ghostTeam = team;
  }
  if (r.ghostTeam !== team) { r.ghostTeam = team; for (const m of r.ghost.children) m.material = ghostMat(team); }
  r.ghost.visible = true;
}
// the model a player is drawn with, as the game does: the one named in their player info
const playerModelName = (k) => ((D.pmodels ? D.pmodels[k] : D.models[k]) || '');
// a living or dying player; returns true when drawn with a real model
// ghost: the player is behind a wall and "See through walls" is on
function drawModelPlayer(e, s, hide, ghost) {
  const a = D.slots[e], S = D.stride, i = M.idxAt(T);
  const pname = playerModelName(a[i * S + 8]);
  if (!pname || !/\.mdl$/i.test(pname)) return false;
  const r = rigFor('p' + e, pname);
  if (!r) return false;
  if (hide) { r.used = true; r.g.visible = false; const w = R3.rigs['w' + e]; if (w) { w.used = true; w.g.visible = false; } return true; }
  const yaw = posePlayer(r, e, s, T);
  if (yaw === false) return false;
  const tint = e === selected && cam3.mode === 'free' ? SEL_TINT : 0;
  placeRig(r, s.x, s.y, s.z, yaw, tint);
  colourRig(r, Math.abs(s.state));
  ghostRig(r, Math.abs(s.state), !!ghost && s.state > 0);
  if (s.state > 0 && s.weapon && /\.mdl$/i.test(s.weapon)) {
    const w = rigFor('w' + e, s.weapon);
    if (w) { poseWeapon(w, r); placeRig(w, s.x, s.y, s.z, yaw, tint); }
  }
  return true;
}
// bodies left on the floor after a death (the game sends them as "corpse" messages)
function drawCorpses(r) {
  if (!D.corpses || !r) return new Set();
  const lying = new Set();
  const end = r.end != null ? r.end : D.end;
  D.corpses.forEach((c, k) => {
    if (c.t < r.start || c.t > T || c.t > end) return;
    lying.add(c.e);
    // the camera sits on this body during the death cam, so leave it out then
    if (c.e === selected && cam3.mode !== 'free') return;
    // same model the player had when they died (the corpse message can name a different one)
    const sl = D.slots[c.e], pn = sl ? playerModelName(sl[M.idxAt(Math.max(r.start, c.start)) * D.stride + 8]) : '';
    const name = /^models\/player\//i.test(pn) ? pn : `models/player/${c.model}/${c.model}.mdl`;
    const rig = rigFor('c' + k, name); if (!rig) return;
    const mdl = rig.M.mdl, q = mdl.seqs[c.seq] || mdl.seqs[0];
    if (rig.frameFor !== k || rig.lastFrame !== Math.min(q.numframes - 1, (T - c.start) * q.fps)) {
      rig.frameFor = k; rig.lastFrame = Math.min(q.numframes - 1, (T - c.start) * q.fps);
      mdlPose(mdl, c.seq, rig.lastFrame, 0.5, 0.5, rig.p, rig.q);
      mdlBoneMats(mdl, rig.p, rig.q, rig.mats); skinRig(rig);
    }
    placeRig(rig, c.pos[0], c.pos[1], c.pos[2], c.yaw, 0);
    colourRig(rig, sl ? Math.abs(sl[M.idxAt(Math.max(r.start, c.start)) * D.stride + 5]) : 0);
  });
  return lying;
}

// ---------------- first-person weapon (Player's eyes) ----------------
// The v_ model the player holds, drawn on top of the world like in-game. HLTV demos don't record
// what the view model is doing, so its animation is worked out from the demo: drawing the weapon
// when it changes, a shot on every fire event, reloads, grenade throws and bomb plants from the
// player's own body animation, and idle in between.
let VM = null;
function vmScene() {
  if (VM) return VM;
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const d = new THREE.DirectionalLight(0xffffff, 0.45); d.position.set(-0.3, 1, 0.6); scene.add(d);
  return VM = { scene, camera: new THREE.PerspectiveCamera(70, 1, 0.5, 400), rig: null };
}
const vName = (p) => (p ? p.replace(/(^|\/)p_([^/]+\.mdl)$/i, '$1v_$2') : null);
function vmSeq(mdl, name) { for (let k = 0; k < mdl.seqs.length; k++) if (mdl.seqs[k].name.toLowerCase() === name) return k; return -1; }
// which animation the view model plays at time t, and how far into it
function vmAnim(mdl, e, t) {
  const A = ANIM[e]; if (!A) return null;
  const a = D.slots[e], S = D.stride, i = M.idxAt(t);
  const wModel = D.models[a[i * S + 6]] || '';
  const w = (/p_(\w+)\.mdl/i.exec(wModel) || [])[1] || '';
  // silencer on or off: from this player's latest shot with that weapon (their first one if none yet)
  let unsil = false;
  if (w === 'usp' || w === 'm4a1') {
    let b = null;
    for (let k = A.shotK.length - 1; k >= 0; k--) { const j = A.shotK[k]; if (eventName(D.shots[j * 4 + 2]) !== w) continue; b = D.shots[j * 4 + 3]; if (D.shots[j * 4] <= t) break; }
    unsil = b === 0;
  }
  const pick = (...names) => { for (const n of names) { let k = unsil ? vmSeq(mdl, n + '_unsil') : -1; if (k < 0) k = vmSeq(mdl, n); if (k >= 0) return k; } return -1; };
  const idle = pick('idle', 'idle1');
  const cands = [];
  const drawT = A.ws[i];
  const draw = pick('draw', 'deploy');
  if (draw >= 0) cands.push({ t: drawT, seq: draw });
  // the last shot since the weapon came out
  let lastK = -1;
  for (let k = A.shotK.length - 1; k >= 0; k--) { const j = A.shotK[k]; if (D.shots[j * 4] <= t) { lastK = k; break; } }
  if (lastK >= 0) {
    const j = A.shotK[lastK], st = D.shots[j * 4];
    if (st >= drawT - 0.05) {
      const ev = eventName(D.shots[j * 4 + 2]);
      let seq = -1;
      if (w === 'knife') seq = pick(lastK % 2 ? 'midslash2' : 'midslash1');
      else if (ev === 'elite_left' || ev === 'elite_right') seq = pick(ev === 'elite_left' ? 'shoot_left1' : 'shoot_right1');
      else { const opts = [1, 2, 3].map((n) => pick('shoot' + n)).filter((k) => k >= 0); seq = opts.length ? opts[lastK % opts.length] : pick('shoot'); }
      if (seq >= 0) cands.push({ t: st, seq });
    }
  }
  // reloads, grenade throws and bomb plants show in the player's body animation
  const pm = MODELS[playerModelName(a[i * S + 8]).toLowerCase()];
  const body = pm && pm.mdl && pm.mdl.seqs[a[i * S + 9]] ? pm.mdl.seqs[a[i * S + 9]].name : '';
  if (/reload/.test(body)) {
    const r = pick('reload');
    if (r >= 0) cands.push({ t: A.rs[i], seq: r });
    else { const ins = pick('insert'); if (ins >= 0) cands.push({ t: A.rs[i], seq: ins, loop: true }); } // shotguns load shell by shell
  } else if (/shoot_grenade|shoot_shieldgren/.test(body)) { const k = pick('throw'); if (k >= 0) cands.push({ t: A.rs[i], seq: k }); }
  else if (/shoot_c4/.test(body)) { const k = pick('pressbutton'); if (k >= 0) cands.push({ t: A.rs[i], seq: k }); }
  let cur = null;
  for (const c of cands) if (c.t <= t + 0.001 && (!cur || c.t >= cur.t)) cur = c;
  if (cur) {
    const q = mdl.seqs[cur.seq], f = (t - cur.t) * q.fps;
    if (cur.loop || (q.flags & 1) || f < q.numframes - 1) return { seq: cur.seq, frame: f };
    if (idle >= 0) return { seq: idle, frame: (t - cur.t - q.numframes / q.fps) * mdl.seqs[idle].fps };
    return { seq: cur.seq, frame: q.numframes - 1 };
  }
  return idle >= 0 ? { seq: idle, frame: t * mdl.seqs[idle].fps } : { seq: 0, frame: 0 };
}
// draw the held weapon over the finished frame (called right after the world is rendered)
function drawViewModel(renderer, camera, e, s) {
  if (!s || s.state <= 0 || !s.weapon) return;
  const M2 = getModel(vName(s.weapon)); if (!M2) return;
  const V = vmScene();
  if (!V.rig || V.rig.M !== M2) {
    if (V.rig) { V.scene.remove(V.rig.g); V.rig.g.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); }
    V.rig = makeRig(M2, V.scene);
    // model space (x forward, y left, z up) -> camera space (looking down -z)
    V.rig.g.rotation.set(0, Math.PI / 2, 0);
    // The stock v_ models are left-handed in the files; CS 1.6 mirrors them to the right hand by
    // default (cl_righthand 1), so do the same: flip the model's left/right axis.
    V.rig.g.scale.set(1, 1, -1);
  }
  const an = vmAnim(M2.mdl, e, T); if (!an) return;
  mdlPose(M2.mdl, an.seq, an.frame, 0.5, 0.5, V.rig.p, V.rig.q);
  mdlBoneMats(M2.mdl, V.rig.p, V.rig.q, V.rig.mats);
  skinRig(V.rig);
  V.camera.fov = camera.fov; V.camera.aspect = camera.aspect; V.camera.updateProjectionMatrix();
  // drawn last, over a cleared depth buffer, so the gun never pokes into walls
  const ac = renderer.autoClear; renderer.autoClear = false;
  renderer.clearDepth(); renderer.render(V.scene, V.camera);
  renderer.autoClear = ac;
}
