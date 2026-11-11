// ---------------- GoldSrc studio models (.mdl v10) ----------------
// Reads player and weapon models straight from the game files and poses them for any
// sequence, frame and blend, the same way the game's studio renderer does.
function parseMdl(u8, texU8) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const i32 = (o) => dv.getInt32(o, true), f32 = (o) => dv.getFloat32(o, true), i16 = (o) => dv.getInt16(o, true), u16 = (o) => dv.getUint16(o, true);
  const str = (o, n) => { let s = ''; for (let k = 0; k < n; k++) { const c = u8[o + k]; if (!c) break; s += String.fromCharCode(c); } return s; };
  if (str(0, 4) !== 'IDST' || i32(4) !== 10) throw new Error('not a version 10 studio model');
  const H = {
    numbones: i32(140), boneindex: i32(144), numseq: i32(164), seqindex: i32(168), numseqgroups: i32(172), seqgroupindex: i32(176),
    numtextures: i32(180), textureindex: i32(184), numskinref: i32(192), numskinfamilies: i32(196), skinindex: i32(200),
    numbodyparts: i32(204), bodypartindex: i32(208),
  };
  const bones = [];
  for (let b = 0; b < H.numbones; b++) {
    const o = H.boneindex + b * 112;
    const value = [], scale = [];
    for (let k = 0; k < 6; k++) { value.push(f32(o + 64 + k * 4)); scale.push(f32(o + 88 + k * 4)); }
    bones.push({ name: str(o, 32), parent: i32(o + 32), value, scale });
  }
  const seqs = [];
  for (let s = 0; s < H.numseq; s++) {
    const o = H.seqindex + s * 176;
    const q = {
      name: str(o, 32), fps: f32(o + 32), flags: i32(o + 36), numframes: i32(o + 56), motiontype: i32(o + 68), motionbone: i32(o + 72),
      linear: [f32(o + 76), f32(o + 80), f32(o + 84)], numblends: i32(o + 120), animindex: i32(o + 124),
      blendtype: i32(o + 128), blendstart: f32(o + 136), blendend: f32(o + 144), group: i32(o + 156), anims: [],
    };
    // animations stored in the main file (sequence group 0); extra groups live in NAME01.mdl files, which CS player models don't use
    if (q.group === 0) {
      for (let bl = 0; bl < Math.max(1, q.numblends); bl++) {
        const base = q.animindex + bl * H.numbones * 12, arr = [];
        for (let b = 0; b < H.numbones; b++) { const a = base + b * 12; const offs = []; for (let k = 0; k < 6; k++) { const off = u16(a + k * 2); offs.push(off ? a + off : 0); } arr.push(offs); }
        q.anims.push(arr);
      }
    }
    seqs.push(q);
  }
  // textures come from the model itself, or from NAMEt.mdl when the model keeps them separately
  const tsrc = H.numtextures ? { u8, dv, H } : (texU8 ? (() => { const d2 = new DataView(texU8.buffer, texU8.byteOffset, texU8.byteLength); return { u8: texU8, dv: d2, H: { numtextures: d2.getInt32(180, true), textureindex: d2.getInt32(184, true), numskinref: d2.getInt32(192, true), numskinfamilies: d2.getInt32(196, true), skinindex: d2.getInt32(200, true) } }; })() : null);
  const textures = [];
  let skins = [];
  if (tsrc) {
    const { u8: tu, dv: td, H: th } = tsrc;
    for (let t = 0; t < th.numtextures; t++) {
      const o = th.textureindex + t * 80;
      let name = ''; for (let k = 0; k < 64; k++) { const c = tu[o + k]; if (!c) break; name += String.fromCharCode(c); }
      const flags = td.getInt32(o + 64, true), w = td.getInt32(o + 68, true), h = td.getInt32(o + 72, true), idx = td.getInt32(o + 76, true);
      const pal = idx + w * h, rgba = new Uint8Array(w * h * 4);
      const masked = !!(flags & 64);
      for (let p = 0; p < w * h; p++) {
        const c = tu[idx + p];
        rgba[p * 4] = tu[pal + c * 3]; rgba[p * 4 + 1] = tu[pal + c * 3 + 1]; rgba[p * 4 + 2] = tu[pal + c * 3 + 2];
        rgba[p * 4 + 3] = masked && c === 255 ? 0 : 255;
      }
      textures.push({ name, flags, w, h, rgba });
    }
    for (let k = 0; k < th.numskinref; k++) skins.push(td.getInt16(th.skinindex + k * 2, true));
  }
  // geometry: every triangle corner keeps its bone, its position in that bone's space, normal and uv
  const bodyparts = [];
  for (let bp = 0; bp < H.numbodyparts; bp++) {
    const o = H.bodypartindex + bp * 76;
    const nummodels = i32(o + 64), base = i32(o + 68), modelindex = i32(o + 72);
    const models = [];
    for (let m = 0; m < nummodels; m++) {
      const mo = modelindex + m * 112;
      const nummesh = i32(mo + 72), meshindex = i32(mo + 76), numverts = i32(mo + 80), vertinfo = i32(mo + 84), vertindex = i32(mo + 88);
      const normindex = i32(mo + 100), norminfo = i32(mo + 96);
      const meshes = [];
      for (let me = 0; me < nummesh; me++) {
        const eo = meshindex + me * 20;
        const skinref = i32(eo + 8);
        let p = i32(eo + 4);
        const tex = textures[skins[skinref] != null ? skins[skinref] : skinref];
        const tw = tex ? tex.w : 64, th2 = tex ? tex.h : 64;
        const pos = [], nrm = [], uv = [], bone = [], nbone = [];
        const corner = (c) => {
          const vi = i16(c), ni = i16(c + 2), s = i16(c + 4), t = i16(c + 6);
          pos.push(f32(vertindex + vi * 12), f32(vertindex + vi * 12 + 4), f32(vertindex + vi * 12 + 8));
          nrm.push(f32(normindex + ni * 12), f32(normindex + ni * 12 + 4), f32(normindex + ni * 12 + 8));
          uv.push((s + 0.5) / tw, (t + 0.5) / th2);
          bone.push(u8[vertinfo + vi]); nbone.push(u8[norminfo + ni]);
        };
        for (let guard = 0; guard < 100000; guard++) {
          let n = i16(p); p += 2;
          if (!n) break;
          const fan = n < 0; n = Math.abs(n);
          const cs = []; for (let k = 0; k < n; k++) { cs.push(p); p += 8; }
          for (let k = 2; k < n; k++) {
            if (fan) { corner(cs[0]); corner(cs[k - 1]); corner(cs[k]); }
            else if (k % 2) { corner(cs[k - 1]); corner(cs[k - 2]); corner(cs[k]); }
            else { corner(cs[k - 2]); corner(cs[k - 1]); corner(cs[k]); }
          }
        }
        if (pos.length) meshes.push({ tex: tex ? textures.indexOf(tex) : -1, pos: new Float32Array(pos), nrm: new Float32Array(nrm), uv: new Float32Array(uv), bone: new Uint8Array(bone), nbone: new Uint8Array(nbone) });
      }
      models.push({ name: str(mo, 64), meshes, numverts });
    }
    bodyparts.push({ name: str(o, 64), base, models });
  }
  const seqByName = {}; seqs.forEach((q, k) => { seqByName[q.name.toLowerCase()] = k; });
  const boneByName = {}; bones.forEach((b, k) => { boneByName[b.name] = k; });
  return { u8, dv, bones, seqs, textures, bodyparts, seqByName, boneByName, numbones: H.numbones };
}

// one channel of one bone at a given frame (run-length packed values, as in the HL SDK)
function mdlAnimValue(dv, off, frame) {
  let k = frame, p = off;
  for (let guard = 0; guard < 4096; guard++) {
    const valid = dv.getUint8(p), total = dv.getUint8(p + 1);
    if (total > k) {
      return valid > k ? dv.getInt16(p + (k + 1) * 2, true) : dv.getInt16(p + valid * 2, true);
    }
    k -= total; p += (valid + 1) * 2;
    if (!total) return 0;
  }
  return 0;
}
function eulerToQuat(x, y, z, out) {
  const sy = Math.sin(z * 0.5), cy = Math.cos(z * 0.5), sp = Math.sin(y * 0.5), cp = Math.cos(y * 0.5), sr = Math.sin(x * 0.5), cr = Math.cos(x * 0.5);
  out[0] = sr * cp * cy - cr * sp * sy; out[1] = cr * sp * cy + sr * cp * sy; out[2] = cr * cp * sy - sr * sp * cy; out[3] = cr * cp * cy + sr * sp * sy;
  return out;
}
function slerpQ(a, b, t, out) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3], s = 1;
  if (d < 0) { d = -d; s = -1; }
  let k0 = 1 - t, k1 = t * s;
  if (d < 0.9995) { const om = Math.acos(d), so = Math.sin(om); k0 = Math.sin((1 - t) * om) / so; k1 = Math.sin(t * om) / so * s; }
  for (let i = 0; i < 4; i++) out[i] = a[i] * k0 + b[i] * k1;
  const l = Math.hypot(out[0], out[1], out[2], out[3]) || 1; for (let i = 0; i < 4; i++) out[i] /= l;
  return out;
}
// local bone position + rotation for a sequence at a (fractional) frame.
// bs, bt: blend 0..1. CS player models keep 9 aim poses in a 3x3 grid: columns turn the upper
// body left/right against the legs (bs), rows aim up/down (bt). Two-blend models use bs only.
function mdlPose(mdl, si, frame, bs, bt, pos, quat) {
  const q = mdl.seqs[si] || mdl.seqs[0];
  const nb = mdl.numbones, nf = Math.max(1, q.numframes);
  if (q.flags & 1) { frame %= nf; if (frame < 0) frame += nf; } else frame = Math.max(0, Math.min(nf - 1, frame));
  const f0 = Math.floor(frame), f1 = (q.flags & 1) ? (f0 + 1) % nf : Math.min(nf - 1, f0 + 1), fr = frame - f0;
  const na = q.anims.length;
  // which stored poses to mix, and how
  let picks;
  if (na >= 9) {
    const col = Math.max(0, Math.min(1, bs)) * 2, row = Math.max(0, Math.min(1, bt)) * 2;
    const c0 = Math.min(1, Math.floor(col)), r0 = Math.min(1, Math.floor(row));
    picks = { a: [r0 * 3 + c0, r0 * 3 + c0 + 1, (r0 + 1) * 3 + c0, (r0 + 1) * 3 + c0 + 1], s: col - c0, t: row - r0 };
  } else if (na >= 2) picks = { a: [0, 1], s: Math.max(0, Math.min(1, bs)) };
  else picks = { a: [0] };
  const tq = [[0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1]], tp = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];
  const e0 = [0, 0, 0, 1], e1 = [0, 0, 0, 1];
  for (let b = 0; b < nb; b++) {
    const bone = mdl.bones[b];
    for (let k = 0; k < picks.a.length; k++) {
      const offs = q.anims[picks.a[k]] ? q.anims[picks.a[k]][b] : null;
      const ch = (c, f) => bone.value[c] + (offs && offs[c] ? mdlAnimValue(mdl.dv, offs[c], f) * bone.scale[c] : 0);
      eulerToQuat(ch(3, f0), ch(4, f0), ch(5, f0), e0); eulerToQuat(ch(3, f1), ch(4, f1), ch(5, f1), e1);
      slerpQ(e0, e1, fr, tq[k]);
      for (let c = 0; c < 3; c++) tp[k][c] = ch(c, f0) * (1 - fr) + ch(c, f1) * fr;
    }
    let rq = tq[0], rp = tp[0];
    if (picks.a.length >= 2) {
      slerpQ(tq[0], tq[1], picks.s, tq[0]); for (let c = 0; c < 3; c++) tp[0][c] += (tp[1][c] - tp[0][c]) * picks.s;
      if (picks.a.length === 4) {
        slerpQ(tq[2], tq[3], picks.s, tq[2]); for (let c = 0; c < 3; c++) tp[2][c] += (tp[3][c] - tp[2][c]) * picks.s;
        slerpQ(tq[0], tq[2], picks.t, tq[0]); for (let c = 0; c < 3; c++) tp[0][c] += (tp[2][c] - tp[0][c]) * picks.t;
      }
    }
    pos[b * 3] = rp[0]; pos[b * 3 + 1] = rp[1]; pos[b * 3 + 2] = rp[2];
    quat[b * 4] = rq[0]; quat[b * 4 + 1] = rq[1]; quat[b * 4 + 2] = rq[2]; quat[b * 4 + 3] = rq[3];
  }
  // sequences that walk the model forward have that motion taken out: the entity's origin already moves
  const mb = q.motionbone;
  if (mb >= 0 && mb < nb) { if (q.motiontype & 1) pos[mb * 3] = 0; if (q.motiontype & 2) pos[mb * 3 + 1] = 0; if (q.motiontype & 4) pos[mb * 3 + 2] = 0; }
}
// bone matrices (3x4, row major) in model space from local pose
function mdlBoneMats(mdl, pos, quat, out, merge) {
  for (let b = 0; b < mdl.numbones; b++) {
    const o = b * 12;
    if (merge && merge[b] >= 0) { const src = merge.mats, s = merge[b] * 12; for (let k = 0; k < 12; k++) out[o + k] = src[s + k]; continue; }
    const x = quat[b * 4], y = quat[b * 4 + 1], z = quat[b * 4 + 2], w = quat[b * 4 + 3];
    const m = [1 - 2 * y * y - 2 * z * z, 2 * x * y - 2 * w * z, 2 * x * z + 2 * w * y, pos[b * 3],
      2 * x * y + 2 * w * z, 1 - 2 * x * x - 2 * z * z, 2 * y * z - 2 * w * x, pos[b * 3 + 1],
      2 * x * z - 2 * w * y, 2 * y * z + 2 * w * x, 1 - 2 * x * x - 2 * y * y, pos[b * 3 + 2]];
    const par = mdl.bones[b].parent;
    if (par < 0) { for (let k = 0; k < 12; k++) out[o + k] = m[k]; continue; }
    const p = par * 12;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
      out[o + r * 4 + c] = out[p + r * 4] * m[c] + out[p + r * 4 + 1] * m[4 + c] + out[p + r * 4 + 2] * m[8 + c] + (c === 3 ? out[p + r * 4 + 3] : 0);
    }
  }
  return out;
}
