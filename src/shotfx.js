// ---------------- shot feedback in 3D: the gun flash, shells and blood puffs (Batch A, 0.26.27) ----------------
// From Sujan's answers of 8 and 9 Nov 2026 on the approved mockup (docs/gun-flash-shells-blood-mock.jpg). What the
// player's own game draws is read in cs16-client (a rebuild of CS 1.6's client) and Xash3D (a rebuild of the engine),
// not Valve's code; Sujan's checks in the game outrank them. Vanilla keeps all three: the game's own look.
//   The gun flash: each shoot animation carries an event (5001, 5011, 5021 or 5031: attachment 0 to 3) whose options
//     "XY" pick the sprite and its size: muzzleflash(Y % 10 % 3 + 1).spr at X / 10 of its pixels, 0.5 when X is 0,
//     drawn additive for one frame at a random frame and roll (Xash3D R_MuzzleFlash). In Player's eyes it's the v_
//     model's animation, at its attachment, so the silenced M4A1 and USP and the TMP keep their small one at the
//     silencer (Sujan, in the game); none on a shot from the scope. On everyone else it's the player model's shoot
//     animation, at the p_ gun model's attachment when it has any, else the player model's own at the right hand
//     (cs16-client GameStudioModelRenderer.cpp, _StudioDrawPlayer, as Sujan read it): the M4A1, the Scout and the M3,
//     whose p_ models have none, flash mid-gun, as Sujan saw the silenced M4A1 do. Every fire event gives one (the
//     Scout's too, Sujan: not the EF_MUZZLEFLASH flag, which the Scout never sets).
//   Shells: only for the player whose eyes the view is, in Player's eyes and POV mode (none from behind until Sujan
//     sees one in the game): each fire event ejects one as the client does in first person, right-handed (cs16-client
//     EV_GetDefaultShellInfo with each gun's numbers: from the right of the view, flying left); the AWP's, Scout's and
//     M3's come from the server (the Brass message, D.brass). Gravity, half the speed lost at each bounce, stopped on
//     the floor once slow, gone after 2.5 s (cs16-client HUD_TempEntUpdate), and the landing sound (fxShellSounds).
//   Blood puffs: where the server marked a bullet's hit on a player (TE_BLOODSPRITE, D.hitPoints), as the engine draws
//     them (Xash3D R_BloodSprite): bloodspray.spr played once in 0.25 s, and a splatter of blood.spr drops thrown out
//     and falling for 1 to 3 s, tinted red from the game's palette (gfx/palette.lmp).
// Random choices (frame, roll, size, the shell's throw) come from a seed per shot, so a paused frame looks the same
// every time it's drawn.
const FX = { src: null, ready: false, spr: {}, pal: null, dyn: null, pools: {}, n: {}, last: {}, win: {}, paths: new Map(), pathsFor: null };
const FLASH_WIN = 0.02; // paused or after a jump: a shot up to this long before the moment shows its gun flash

// the sprites and palette from the picked folder (folder.js puts them in files.fx), once per pick
async function fxLoad() {
  const src = files.fx || {};
  FX.src = src; FX.ready = false;
  const spr = {};
  try {
    for (const n of ['muzzleflash1', 'muzzleflash2', 'muzzleflash3', 'bloodspray', 'blood']) {
      const f = src[`sprites/${n}.spr`]; if (!f) continue;
      const s = sprFrames(await readPicked(f, `sprites/${n}.spr`) || new Uint8Array(0));
      if (s) spr[n] = s;
    }
    const f = src['gfx/palette.lmp'], p = f ? await readPicked(f, 'gfx/palette.lmp') : null;
    if (FX.src !== src) return;
    for (const k in FX.spr) for (const t of FX.spr[k].tex) t.dispose();
    FX.spr = spr; FX.pal = p && p.length >= 768 ? p : null; FX.ready = true;
  } catch (e) { if (FX.src === src) FX.ready = true; }
}
// every frame of a GoldSrc sprite (.spr version 2) as a texture: additive (format 1) as its colours, alpha test (3)
// with its last colour see-through, index alpha (2) in its last colour with the index as alpha
function sprFrames(u8) {
  if (u8.length < 64 || String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== 'IDSP') return null;
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const fmt = dv.getInt32(12, true), nf = dv.getInt32(28, true);
  let p = 40; const n = dv.getInt16(p, true); p += 2;
  if (n <= 0 || n > 256 || nf <= 0 || nf > 64) return null;
  const pal = u8.subarray(p, p + n * 3); p += n * 3;
  const tex = []; let w = 0, h = 0;
  for (let k = 0; k < nf; k++) {
    if (p + 20 > u8.length || dv.getInt32(p, true) !== 0) break; // single frames only
    w = dv.getInt32(p + 12, true); h = dv.getInt32(p + 16, true); p += 20;
    if (w <= 0 || h <= 0 || w > 512 || h > 512 || p + w * h > u8.length) break;
    const px = u8.subarray(p, p + w * h); p += w * h;
    const rgba = new Uint8Array(w * h * 4), last = (n - 1) * 3;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const c = px[y * w + x], o = ((h - 1 - y) * w + x) * 4, q = fmt === 2 ? last : (c < n ? c * 3 : 0);
      rgba[o] = pal[q]; rgba[o + 1] = pal[q + 1]; rgba[o + 2] = pal[q + 2];
      rgba[o + 3] = fmt === 2 ? c : fmt === 3 && c === 255 ? 0 : 255;
    }
    const t = new THREE.DataTexture(rgba, w, h, THREE.RGBAFormat);
    t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false; t.needsUpdate = true;
    tex.push(t);
  }
  return tex.length ? { tex, w, h, fmt } : null;
}
// a small seeded random number source (mulberry32)
function fxRand(seed) {
  let s = (Math.floor(seed) ^ 0x9e3779b9) >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const fxR = (r, a, b) => a + (b - a) * r();
const fxL = (r, a, b) => a + Math.min(b - a, Math.floor(r() * (b - a + 1))); // COM_RandomLong: a to b, both included
// the colour of palette index i (the game's gfx/palette.lmp), as a three.js colour; a plain red without the file
const fxCol = (i) => (FX.pal ? (FX.pal[i * 3] << 16) | (FX.pal[i * 3 + 1] << 8) | FX.pal[i * 3 + 2] : 0x8b0000);

// a studio model's attachments (bone, offset) and the gun flash event of one of its sequences, read once
function mdlAtts(mdl) {
  if (mdl._atts) return mdl._atts;
  const dv = mdl.dv, n = dv.getInt32(212, true), o = dv.getInt32(216, true), a = [];
  for (let i = 0; i < n && i < 8; i++) { const p = o + i * 88; a.push({ bone: dv.getInt32(p + 36, true), org: [dv.getFloat32(p + 40, true), dv.getFloat32(p + 44, true), dv.getFloat32(p + 48, true)] }); }
  return (mdl._atts = a);
}
function seqFlash(mdl, si) {
  const c = mdl._flash || (mdl._flash = {});
  if (si in c) return c[si];
  let r = null;
  if (si >= 0 && si < mdl.seqs.length) {
    const dv = mdl.dv, so = dv.getInt32(168, true) + si * 176, n = dv.getInt32(so + 48, true), o = dv.getInt32(so + 52, true);
    for (let i = 0; i < n && !r; i++) {
      const p = o + i * 76, ev = dv.getInt32(p + 4, true);
      if (ev < 5001 || ev > 5031 || (ev - 5001) % 10) continue;
      let s = ''; for (let k = 0; k < 64; k++) { const ch = mdl.u8[p + 12 + k]; if (!ch) break; s += String.fromCharCode(ch); }
      r = { frame: dv.getInt32(p, true), att: (ev - 5001) / 10, opt: parseInt(s, 10) || 0 };
    }
  }
  return (c[si] = r);
}
// where an attachment is in the scene: its bone's matrix (model space) times its offset, model space -> the rig's
// group (x, z, -y), then the group into the scene
function attWorld(rig, att) {
  const M = rig.mats, b = att.bone * 12, [x, y, z] = att.org;
  if (!(b + 11 < M.length)) return null;
  const wx = M[b] * x + M[b + 1] * y + M[b + 2] * z + M[b + 3], wy = M[b + 4] * x + M[b + 5] * y + M[b + 6] * z + M[b + 7], wz = M[b + 8] * x + M[b + 9] * y + M[b + 10] * z + M[b + 11];
  rig.g.updateMatrixWorld(true);
  return rig.g.localToWorld(new THREE.Vector3(wx, wz, -wy));
}

// sprites and shell models, made once and reused; whatever isn't used in a frame is hidden
function fxPoolReset() {
  for (const k in FX.pools) for (const o of FX.pools[k]) { if (o.g) { if (o.g.parent) o.g.parent.remove(o.g); } else if (o.parent) o.parent.remove(o); }
  FX.pools = {}; FX.n = {};
}
function fxSprite(kind, parent) {
  const P = FX.pools[kind] || (FX.pools[kind] = []), i = FX.n[kind] = (FX.n[kind] || 0) + 1;
  let s = P[i - 1];
  if (!s) {
    const add = kind === 'flash' || kind === 'vflash';
    s = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending }));
    s.renderOrder = add ? 21 : 19; s.frustumCulled = false; P.push(s);
  }
  if (s.parent !== parent) parent.add(s);
  s.visible = true;
  return s;
}
function fxShellRig(name) {
  const M2 = getModel(name); if (!M2 || !M2.mdl) return null;
  const kind = 'shell:' + name, P = FX.pools[kind] || (FX.pools[kind] = []), i = FX.n[kind] = (FX.n[kind] || 0) + 1;
  let r = P[i - 1];
  if (!r) {
    r = makeRig(M2, R3.dyn);
    mdlPose(M2.mdl, 0, 0, 0.5, 0.5, r.p, r.q); mdlBoneMats(M2.mdl, r.p, r.q, r.mats); skinRig(r);
    P.push(r);
  }
  if (r.g.parent !== R3.dyn) R3.dyn.add(r.g);
  r.g.visible = true;
  return r;
}
// a shot is in this frame when it falls since the last frame drawn on that clock, playing forward; paused, after a
// jump or a seek, when it falls in the FLASH_WIN before the moment
function fxWindow(key, now) {
  const last = FX.last[key]; FX.last[key] = now;
  return playing && last != null && now > last && now - last < 0.3 ? [last, now] : [now - FLASH_WIN, now];
}
const inWin = (w, t) => t > w[0] && t <= w[1];

// at the start of each 3D frame: the files, a new demo or map, every pooled object hidden, this frame's windows
function fxBegin() {
  if (FX.src !== (files.fx || {})) fxLoad();
  if (FX.dyn !== R3.dyn) { fxPoolReset(); FX.dyn = R3.dyn; }
  if (FX.pathsFor !== D) { FX.paths.clear(); FX.pathsFor = D; FX.last = {}; }
  for (const k in FX.pools) for (const o of FX.pools[k]) (o.g || o).visible = false;
  FX.n = {};
  FX.win.t3 = fxWindow('t3', T);
  FX.win.own = POV.on ? fxWindow('own', POV.t) : null;
}
function fxFlashSprite(parent, pos, opt, seed) {
  const idx = (opt % 10) % 3, sc = Math.floor(opt / 10) * 0.1 || 0.5, S = FX.spr['muzzleflash' + (idx + 1)];
  if (!S || !pos) return null;
  const r = fxRand(seed), s = fxSprite(parent === R3.dyn ? 'flash' : 'vflash', parent);
  s.material.map = S.tex[fxL(r, 0, S.tex.length - 1)];
  s.material.rotation = (idx === 0 ? fxL(r, 0, 20) : fxL(r, 0, 359)) * Math.PI / 180;
  s.material.color.setHex(0xffffff); s.material.opacity = 1; s.material.depthTest = true;
  s.scale.set(S.w * sc, S.h * sc, 1); s.position.copy(pos);
  s.userData.fx = { kind: 'flash', sprite: 'muzzleflash' + (idx + 1), scale: sc };
  return s;
}

// The animation extension of each p_ gun model, as each gun deploys it (ReGameDLL wpn_<gun>.cpp, DefaultDeploy):
// the player model plays "ref_shoot_<ext>" standing and "crouch_shoot_<ext>" ducked
const P_EXT = { ak47: 'ak47', galil: 'ak47', aug: 'carbine', famas: 'carbine', p90: 'carbine', ump45: 'carbine', awp: 'rifle', m4a1: 'rifle', scout: 'rifle', sg550: 'rifle', g3sg1: 'mp5', mp5: 'mp5', sg552: 'mp5', deagle: 'onehanded', fiveseven: 'onehanded', glock18: 'onehanded', mac10: 'onehanded', p228: 'onehanded', tmp: 'onehanded', usp: 'onehanded', elite: 'dualpistols', m249: 'm249', xm1014: 'm249', m3: 'shotgun' };
// the player model's shoot animation for a gun, standing or ducked, and for the Elites the one whose event names the
// hand that fired (the left gun's is 5011, attachment 1)
function playerShootSeq(mdl, ext, duck, att) {
  const c = mdl._shoot || (mdl._shoot = {}), key = ext + duck + att;
  if (key in c) return c[key];
  const pre = duck ? 'crouch_shoot' : 'ref_shoot';
  let r = -1;
  for (const nm of [pre + '_' + ext, pre + '2_' + ext]) { const k = vmSeq(mdl, nm); if (k >= 0 && (att == null || (seqFlash(mdl, k) || {}).att === att)) { r = k; break; } }
  return (c[key] = r);
}
// the gun flash on every player drawn in third person (after drawModelPlayer has posed his body and gun)
function fxThirdPerson() {
  const w = FX.win.t3;
  for (const e in D.slots) {
    const r = R3.rigs && R3.rigs['p' + e], A = ANIM[e];
    if (!r || !r.used || !r.g.visible || !A || !A.shots.length) continue;
    let k = Math.max(0, firstAfter(A.shots, 1, w[0]));
    for (; k < A.shots.length && A.shots[k] <= w[1]; k++) {
      const j = A.shotK[k], ev = eventName(D.shots[j * 4 + 2]);
      if (!FIRE[ev]) continue; // guns only
      const s = playerState(+e, T); if (!s || s.state <= 0) continue;
      const ext = P_EXT[weaponShort(s.weapon)]; if (!ext) continue;
      const mdl = r.M.mdl, si = playerShootSeq(mdl, ext, !!s.duck, ev === 'elite_left' ? 1 : ev === 'elite_right' ? 0 : null);
      const fl = seqFlash(mdl, si); if (!fl) continue;
      // the p_ model's attachments replace the player model's, as many as it has (none: the player model's at his hand)
      const g = R3.rigs['w' + e], ga = g && g.used && g.g.visible ? mdlAtts(g.M.mdl) : [];
      const pos = ga.length > fl.att ? attWorld(g, ga[fl.att]) : mdlAtts(mdl)[fl.att] ? attWorld(r, mdlAtts(mdl)[fl.att]) : null;
      const sp = fxFlashSprite(R3.dyn, pos, fl.opt, A.shots[k] * 1000 + +e);
      if (sp) sp.userData.fx = Object.assign(sp.userData.fx, { e: +e, t: A.shots[k], from: ga.length > fl.att ? 'p_ model' : 'player model' });
    }
  }
}
// the gun flash in Player's eyes and POV mode, at the v_ model's attachment (drawViewModel calls it before drawing)
function fxViewFlash(V, mdl, name, e, own) {
  const w = own ? FX.win.own : FX.win.t3; if (!w || !FX.ready) return;
  const shots = [];
  if (own) { const S = D.ownShots || []; for (let k = Math.max(0, firstAfter(S, 3, w[0] - 0.2)); k * 3 < S.length && S[k * 3] <= w[1]; k++) shots.push(S[k * 3]); }
  else { const A = ANIM[e]; if (A) for (let k = Math.max(0, firstAfter(A.shots, 1, w[0] - 0.2)); k < A.shots.length && A.shots[k] <= w[1]; k++) shots.push(A.shots[k]); }
  for (const ts of shots) {
    // none on a shot from a sniper rifle's scope, nor on the first frame after the scope drops (Sujan, 9 Nov 2026); the
    // AUG's and SG552's zoom shows the gun, so theirs stays
    if (own ? povFov(ts) < 90 && SNIPERS[(/v_(\w+)\.mdl/i.exec(name) || [])[1]] : zoomLevel(e, ts) > 0 && (() => { const st = playerState(e, ts); return st && SNIPERS[weaponShort(st.weapon)]; })()) continue;
    const an = own ? povVmAnim(mdl, name, ts + 0.001) : vmAnim(mdl, e, ts + 0.001); if (!an) continue;
    const fl = seqFlash(mdl, an.seq); if (!fl) continue;
    const at = ts + fl.frame / (mdl.seqs[an.seq].fps || 30);
    if (!inWin(w, at)) continue;
    const a = mdlAtts(mdl)[fl.att]; if (!a) continue;
    const sp = fxFlashSprite(V.scene, attWorld(V.rig, a), fl.opt, ts * 1000 + 7);
    if (sp) { sp.material.depthTest = true; sp.userData.fx = Object.assign(sp.userData.fx, { e, t: ts, from: 'v_ model' }); }
  }
}

// Shells in first person, right-handed: forward, up and right of the eye, the model, a shotgun shell (cs16-client
// events/event_<gun>.cpp, the cl_righthand branch); the AWP, Scout and M3 eject none themselves (the server's Brass)
const SHELL = {
  ak47: [20, -8, 10, 'r'], aug: [17, -8, 14, 'r'], famas: [17, -8, 14, 'r'], galil: [20, -8, 10, 'r'], g3sg1: [17, -8, 10, 'r'], m249: [20, -10, 13, 'r'],
  m4a1: [20, -8, 10, 'r'], sg550: [17, -8, 10, 'r'], sg552: [20, -8, 10, 'r'], mac10: [32, -9, 11, 'r'], mp5n: [36, -10, 11, 'r'], p90: [35, -16, 22, 'r'],
  deagle: [35, -11, 16, 'p'], elite_left: [35, -11, 16, 'p'], elite_right: [35, -11, 16, 'p'], fiveseven: [36, -14, 14, 'p'], glock18: [36, -14, 14, 'p'],
  p228: [36, -14, 14, 'p'], usp: [36, -14, 14, 'p'], tmp: [32, -6, 11, 'p'], ump45: [34, -10, 11, 'p'], xm1014: [22, -9, 11, 's'],
};
const SHELL_MDL = { r: 'models/rshell.mdl', p: 'models/pshell.mdl', s: 'models/shotgunshell.mdl' };
const SHELL_LIFE = 2.5;
// whose eyes the view is, and on which clock: Player's eyes on the followed player; in POV mode the recorder (his own
// moment, POV.t) or the player he spectates in first person
function fxEyes() {
  if (viewMode === '2d' || cam3.mode !== 'eyes' || !D) return null;
  if (POV.on) { if (POV.who == null || !POV.v) return null; return POV.who === POV.v.rec ? { e: POV.who, own: true, now: POV.t } : { e: POV.who, own: false, now: T }; }
  if (!selected) return null;
  const s = playerState(selected, T); return s && s.state > 0 ? { e: selected, own: false, now: T } : null;
}
const gsVecs = (pitch, yaw) => { const p = pitch * Math.PI / 180, y = yaw * Math.PI / 180, sp = Math.sin(p), cp = Math.cos(p), sy = Math.sin(y), cy = Math.cos(y); return { f: [cp * cy, cp * sy, -sp], r: [sy, -cy, 0], u: [sp * cy, sp * sy, cp] }; };
// the player's eye, view and speed at a shot
function fxEyeAt(E, t) {
  if (E.own) {
    const v = povView(t), a = povView(t - 0.05), b = povView(t + 0.05);
    return { eye: v.pos, pitch: v.pitch, yaw: v.yaw, vel: [0, 1, 2].map((k) => (b.pos[k] - a.pos[k]) / 0.1) };
  }
  const s = playerState(E.e, t); if (!s || s.state <= 0) return null;
  const a = playerState(E.e, t - 0.05), b = playerState(E.e, t + 0.05);
  const vel = a && b && Math.hypot(b.x - a.x, b.y - a.y) < 60 ? [(b.x - a.x) / 0.1, (b.y - a.y) / 0.1, (b.z - a.z) / 0.1] : [0, 0, 0];
  return { eye: [s.x, s.y, s.z + (s.duck ? 12 : 17)], pitch: s.pitch, yaw: s.yaw, vel };
}
// every shell of that player's alive in [from, to]: { key, t, o, v, model, shot (shotgun shell), seed }
function fxShellsOf(E, from, to) {
  const out = [];
  const add = (t, gun, seed) => {
    const S = SHELL[gun]; if (!S) return;
    const at = fxEyeAt(E, t); if (!at) return;
    const r = fxRand(seed), V = gsVecs(at.pitch, at.yaw);
    const fR = fxR(r, 50, 70), fU = fxR(r, 75, 175), fF = fxR(r, 25, 250), dir = S[2] > 0 ? -1 : 1;
    const o = [0, 1, 2].map((k) => at.vel[k] * 0.1 + at.eye[k] + S[1] * V.u[k] + S[0] * V.f[k] + S[2] * V.r[k]);
    const v = [0, 1, 2].map((k) => at.vel[k] * 0.5 + V.r[k] * fR * dir + V.u[k] * fU + V.f[k] * fF);
    out.push({ key: 'c' + seed, t, o, v, model: SHELL_MDL[S[3]], slow: false, sound: 1, seed, yaw: at.yaw });
  };
  if (E.own) { const S = D.ownShots || []; for (let k = Math.max(0, firstAfter(S, 3, from)); k * 3 < S.length && S[k * 3] <= to; k++) add(S[k * 3], WEAPON_EVENT[S[k * 3 + 1]], S[k * 3] * 1000 + k); }
  else { const A = ANIM[E.e]; if (A) for (let k = Math.max(0, firstAfter(A.shots, 1, from)); k < A.shots.length && A.shots[k] <= to; k++) add(A.shots[k], eventName(D.shots[A.shotK[k] * 4 + 2]), A.shots[k] * 1000 + k); }
  // the server's shells (AWP, Scout, M3), with the client's own offset for the player whose eyes these are: 9 units to
  // his right, thrown left at 120 (cs16-client ammo.cpp, MsgFunc_Brass, its sin and cos of the yaw)
  const B = D.brass || [];
  for (let k = Math.max(0, firstAfter(B, 12, from)); k * 12 < B.length && B[k * 12] <= to; k++) {
    const o = k * 12; if (B[o + 11] !== E.e) continue;
    const model = D.models && D.models[B[o + 8]]; if (!model || !/\.mdl$/i.test(model)) continue;
    const y = B[o + 7] * Math.PI / 180, rx = Math.sin(y), ry = -Math.cos(y);
    out.push({ key: 'b' + k, t: B[o], o: [B[o + 1] + 9 * rx, B[o + 2] + 9 * ry, B[o + 3]], v: [B[o + 4] - 120 * rx, B[o + 5] - 120 * ry, B[o + 6]], model: model.toLowerCase(), slow: B[o + 9] === 2, sound: B[o + 9], seed: B[o] * 1000 + k, yaw: B[o + 7] });
  }
  return out;
}
// a shell's flight, worked out once in 100 steps a second, as the client moves temp entities: gravity (half for a
// shotgun shell), at a wall or floor the speed reflected and halved, the spin slowed; on a floor while slow it stops
// and lies flat. The bounces that play a sound: the first one fast enough, then one in four (CL_TempEntPlaySound)
const SH_STEP = 0.01;
function fxShellPath(sh) {
  const c = FX.paths.get(sh.key); if (c) return c;
  const N = Math.round(SHELL_LIFE / SH_STEP), P = new Float32Array((N + 1) * 6), bounces = [];
  const r = fxRand(sh.seed + 3), av = [fxR(r, -512, 511), fxR(r, -255, 255), fxR(r, -255, 255)];
  const g = sh.slow ? 400 : 800, bsp = MAP && MAP.bsp, head = bsp && bsp.models[0] ? bsp.models[0].head : null;
  const solid = (x, y, z) => { if (head == null) return false; const k = pointContents(bsp, head, x, y, z); return k === -2 || k === -6; };
  let [x, y, z] = sh.o, [vx, vy, vz] = sh.v, a0 = 0, a1 = 0, a2 = sh.yaw || 0, moving = true, spin = true, out = !solid(x, y, z);
  for (let i = 0; i <= N; i++) {
    P[i * 6] = x; P[i * 6 + 1] = y; P[i * 6 + 2] = z; P[i * 6 + 3] = a0; P[i * 6 + 4] = a1; P[i * 6 + 5] = a2;
    if (!moving) continue;
    if (spin) { a0 += av[0] * SH_STEP; a1 += av[1] * SH_STEP; a2 += av[2] * SH_STEP; }
    const nx = x + vx * SH_STEP, ny = y + vy * SH_STEP, nz = z + vz * SH_STEP;
    if (out && solid(nx, ny, nz)) {
      // which way the surface faces: the axis whose step alone goes in
      let n = [0, 0, vz > 0 ? -1 : 1];
      if (!solid(x, y, nz)) { if (solid(nx, y, z)) n = [vx > 0 ? -1 : 1, 0, 0]; else if (solid(x, ny, z)) n = [0, vy > 0 ? -1 : 1, 0]; }
      let damp = 0.5;
      if (n[2] > 0.9 && vz <= 0 && vz >= -3 * g * SH_STEP) { damp = 0; moving = false; spin = false; a0 = 0; a2 = 0; }
      const zv = Math.abs(vz);
      if (damp > 0 && (zv >= 200 || fxL(r, 0, 3) === 0)) bounces.push(i * SH_STEP, zv);
      if (damp > 0) { const pr = vx * n[0] + vy * n[1] + vz * n[2]; vx -= 2 * pr * n[0]; vy -= 2 * pr * n[1]; vz -= 2 * pr * n[2]; a1 = -a1; }
      vx *= damp; vy *= damp; vz *= damp; a0 *= 0.9; a1 *= 0.9; a2 *= 0.9;
    } else { x = nx; y = ny; z = nz; if (!out && !solid(x, y, z)) out = true; }
    if (moving) vz -= g * SH_STEP;
  }
  const res = { P, bounces };
  FX.paths.set(sh.key, res);
  if (FX.paths.size > 4000) FX.paths.delete(FX.paths.keys().next().value);
  return res;
}
// the shells in the view this frame
function fxShells() {
  const E = fxEyes(); if (!E || !MAP) return;
  for (const sh of fxShellsOf(E, E.now - SHELL_LIFE, E.now)) {
    const age = E.now - sh.t; if (age < 0 || age > SHELL_LIFE) continue;
    const rig = fxShellRig(sh.model); if (!rig) continue;
    const { P } = fxShellPath(sh), f = age / SH_STEP, i = Math.min(P.length / 6 - 2, Math.floor(f)), u = Math.min(1, f - i);
    const L = (k) => P[i * 6 + k] + (P[(i + 1) * 6 + k] - P[i * 6 + k]) * u;
    rig.g.position.copy(g3(L(0), L(1), L(2)));
    lightRig(rig, L(0), L(1), L(2)); // lit where it is, as the game lights a shell (light.js)
    // GoldSrc pitch, yaw, roll -> three: yaw about y, pitch about -z, roll about x
    const d = Math.PI / 180; rig.g.rotation.set(L(5) * d, L(4) * d, -L(3) * d, 'YZX');
    rig.g.userData.fx = { kind: 'shell', t: sh.t, model: sh.model, o: sh.o };
  }
}
// landing sounds of the shells in view, for soundTick: [name, position, volume] for each bounce in (t0, t1]
function fxShellSounds(t0, t1) {
  const E = fxEyes(); if (!E || !MAP) return [];
  const out = [];
  for (const sh of fxShellsOf(E, t1 - SHELL_LIFE - 0.1, t1)) {
    const { P, bounces } = fxShellPath(sh);
    for (let b = 0; b < bounces.length; b += 2) {
      const tb = sh.t + bounces[b]; if (tb <= t0 || tb > t1) continue;
      const i = Math.round(bounces[b] / SH_STEP) * 6, shot = /shotgunshell/.test(sh.model) || sh.slow;
      const name = shot ? `weapons/sshell${1 + Math.floor(sh.seed + b) % 3}.wav` : `player/pl_shell${1 + Math.floor(sh.seed + b) % 3}.wav`;
      out.push([name, [P[i], P[i + 1], P[i + 2]], (shot ? 0.5 : 0.8) * Math.min(1, bounces[b + 1] / 350)]);
    }
  }
  return out;
}

// Blood puffs where the server marked a hit, with their drops; the drops fall with half gravity and stop where they hit
const PUFF_LIFE = 0.25, DROP_MAX = 3;
function fxDrops(i, x, y, z, size, r) {
  const c = FX.paths.get('d' + i); if (c) return c;
  const bsp = MAP && MAP.bsp, head = bsp && bsp.models[0] ? bsp.models[0].head : null;
  const solid = (px, py, pz) => { if (head == null) return false; const k = pointContents(bsp, head, px, py, pz); return k === -2 || k === -6; };
  const n = size + fxL(r, 1, 8) + fxL(r, 1, 8), out = [];
  for (let k = 0; k < n; k++) {
    const d = { life: 0, v: [0, 0, 0], frame: 0, scale: 0, roll: 0, stop: Infinity };
    d.scale = fxR(r, size / 15, size / 25);
    d.v = [fxR(r, -96, 95), fxR(r, -96, 95), fxR(r, -32, 95)];
    d.life = fxR(r, 1, 3); d.frame = fxL(r, 1, 8); d.roll = fxR(r, 0, 360);
    for (let s = 0.02; s <= d.life; s += 0.02) { const pz = z + d.v[2] * s - 200 * s * s; if (solid(x + d.v[0] * s, y + d.v[1] * s, pz)) { d.stop = s - 0.02; break; } }
    out.push(d);
  }
  FX.paths.set('d' + i, out);
  return out;
}
function fxBlood() {
  const H = D.hitPoints; if (!H || !H.length || !FX.spr.bloodspray) return;
  const spray = FX.spr.bloodspray, drop = FX.spr.blood;
  for (let i = Math.max(0, firstAfter(H, 5, T - DROP_MAX)); i * 5 < H.length && H[i * 5] <= T; i++) {
    const o = i * 5, tp = H[o], size = H[o + 4]; if (size < 0) continue; // helmet sparks: not drawn
    const age = T - tp, r = fxRand(tp * 1000 + i), ci = 247 + fxL(r, 1, 3);
    const zo = fxR(r, 2, 4), sc = fxR(r, size / 25, size / 35), roll = fxL(r, 0, 360);
    if (age < PUFF_LIFE) {
      const s = fxSprite('puff', R3.dyn), fr = Math.min(spray.tex.length - 1, Math.floor(age * spray.tex.length / PUFF_LIFE));
      s.material.map = spray.tex[fr]; s.material.color.setHex(fxCol(ci)); s.material.opacity = 250 / 255; s.material.rotation = roll * Math.PI / 180;
      s.scale.set(spray.w * sc, spray.h * sc, 1); s.position.copy(g3(H[o + 1], H[o + 2], H[o + 3] + zo));
      s.userData.fx = { kind: 'puff', t: tp, i, size };
    }
    if (!drop) continue;
    for (const d of fxDrops(i, H[o + 1], H[o + 2], H[o + 3], size, r)) {
      if (age > d.life) continue;
      const s0 = Math.min(age, d.stop), s = fxSprite('drop', R3.dyn);
      s.material.map = drop.tex[Math.min(drop.tex.length - 1, d.frame)]; s.material.color.setHex(fxCol(ci - 1)); s.material.opacity = 250 / 255;
      s.material.rotation = (d.roll - 255.5 * Math.min(age, d.stop)) * Math.PI / 180;
      s.scale.set(drop.w * d.scale, drop.h * d.scale, 1);
      s.position.copy(g3(H[o + 1] + d.v[0] * s0, H[o + 2] + d.v[1] * s0, H[o + 3] + d.v[2] * s0 - 200 * s0 * s0));
      s.userData.fx = { kind: 'drop', t: tp, i };
    }
  }
}
// the world's share of a 3D frame: the gun flash on everyone in third person, the shells, the blood
function fxWorld() {
  if (!FX.ready || !D) return;
  fxThirdPerson();
  fxShells();
  fxBlood();
}
