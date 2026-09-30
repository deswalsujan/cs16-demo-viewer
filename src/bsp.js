// GoldSrc BSP v30 + WAD3 reader: geometry for rendering and line-of-sight traces.

export function parseBsp(buffer) {
  const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const version = dv.getInt32(0, true);
  if (version !== 30) throw new Error('Not a GoldSrc (v30) map file');
  const L = [];
  for (let i = 0; i < 15; i++) L.push({ off: dv.getInt32(4 + i * 8, true), len: dv.getInt32(8 + i * 8, true) });
  const f32 = (o) => dv.getFloat32(o, true), i32 = (o) => dv.getInt32(o, true), u32 = (o) => dv.getUint32(o, true),
    i16 = (o) => dv.getInt16(o, true), u16 = (o) => dv.getUint16(o, true);
  const cstr = (o, n) => { let s = ''; for (let i = 0; i < n; i++) { const c = u8[o + i]; if (!c) break; s += String.fromCharCode(c); } return s; };

  // entities
  const entText = cstr(L[0].off, L[0].len);
  const entities = [];
  const re = /\{([^}]*)\}/g; let m;
  while ((m = re.exec(entText))) {
    const e = {}; const kv = /"([^"]*)"\s*"([^"]*)"/g; let k;
    while ((k = kv.exec(m[1]))) e[k[1]] = k[2];
    entities.push(e);
  }

  // planes
  const np = L[1].len / 20;
  const planes = new Float32Array(np * 4);
  for (let i = 0; i < np; i++) { const o = L[1].off + i * 20; planes[i * 4] = f32(o); planes[i * 4 + 1] = f32(o + 4); planes[i * 4 + 2] = f32(o + 8); planes[i * 4 + 3] = f32(o + 12); }

  // nodes
  const nn = L[5].len / 24;
  const nodePlane = new Int32Array(nn), nodeC0 = new Int32Array(nn), nodeC1 = new Int32Array(nn);
  for (let i = 0; i < nn; i++) { const o = L[5].off + i * 24; nodePlane[i] = u32(o); nodeC0[i] = i16(o + 4); nodeC1[i] = i16(o + 6); }

  // leaves
  const nl = L[10].len / 28;
  const leafContents = new Int32Array(nl);
  for (let i = 0; i < nl; i++) leafContents[i] = i32(L[10].off + i * 28);

  // models
  const models = [];
  for (let i = 0; i < L[14].len / 64; i++) {
    const o = L[14].off + i * 64;
    models.push({ mins: [f32(o), f32(o + 4), f32(o + 8)], maxs: [f32(o + 12), f32(o + 16), f32(o + 20)], origin: [f32(o + 24), f32(o + 28), f32(o + 32)], head: i32(o + 36), firstFace: i32(o + 56), numFaces: i32(o + 60) });
  }

  // vertices, edges, surfedges
  const verts = new Float32Array(u8.buffer.slice(u8.byteOffset + L[3].off, u8.byteOffset + L[3].off + L[3].len));
  const edgesArr = new Uint16Array(u8.buffer.slice(u8.byteOffset + L[12].off, u8.byteOffset + L[12].off + L[12].len));
  const surfedges = new Int32Array(u8.buffer.slice(u8.byteOffset + L[13].off, u8.byteOffset + L[13].off + L[13].len));

  // texinfo
  const texinfo = [];
  for (let i = 0; i < L[6].len / 40; i++) {
    const o = L[6].off + i * 40;
    texinfo.push({ s: [f32(o), f32(o + 4), f32(o + 8), f32(o + 12)], t: [f32(o + 16), f32(o + 20), f32(o + 24), f32(o + 28)], mip: u32(o + 32), flags: u32(o + 36) });
  }

  // textures
  const textures = [];
  {
    const base = L[2].off; const n = u32(base);
    for (let i = 0; i < n; i++) {
      const off = i32(base + 4 + i * 4);
      if (off < 0) { textures.push({ name: 'missing', w: 16, h: 16, data: null }); continue; }
      const o = base + off;
      const name = cstr(o, 16).toLowerCase(), w = u32(o + 16), h = u32(o + 20), m0 = u32(o + 24);
      let data = null;
      if (m0) data = decodeMip(u8, o, m0, w, h, name);
      textures.push({ name, w, h, data });
    }
  }

  // faces
  const faces = [];
  const lightBase = L[8].off, lightLen = L[8].len;
  for (let i = 0; i < L[7].len / 20; i++) {
    const o = L[7].off + i * 20;
    faces.push({ plane: u16(o), side: u16(o + 2), firstEdge: i32(o + 4), numEdges: u16(o + 8), tex: u16(o + 10), styles: [u8[o + 12], u8[o + 13], u8[o + 14], u8[o + 15]], light: i32(o + 16) });
  }
  const lighting = u8.subarray(lightBase, lightBase + lightLen);

  const bsp = { entities, planes, nodePlane, nodeC0, nodeC1, leafContents, models, verts, edges: edgesArr, surfedges, texinfo, textures, faces, lighting };
  bsp.wads = ((entities[0] && entities[0].wad) || '').split(';').map((s) => s.replace(/\\/g, '/').split('/').pop().toLowerCase()).filter(Boolean);
  bsp.solids = solidModels(bsp);
  return bsp;
}

// Brush entities that stop bullets (doors, walls, crates, glass).
const BLOCKING = /^func_(wall|breakable|door|door_rotating|wall_toggle|pushable|rotating|train|tracktrain|plat|vehicle)$/;
function solidModels(bsp) {
  const out = [{ model: 0, origin: [0, 0, 0], cls: 'worldspawn' }];
  for (const e of bsp.entities) {
    if (!e.model || e.model[0] !== '*' || !BLOCKING.test(e.classname || '')) continue;
    if (e.rendermode && e.rendermode !== '0' && e.classname === 'func_wall' && (e.renderamt === '0')) continue; // invisible helpers
    const o = (e.origin || '0 0 0').split(/\s+/).map(Number);
    out.push({ model: +e.model.slice(1), origin: o, cls: e.classname });
  }
  return out;
}

// Which contents is point p in, for a given model head node (hull 0)
function pointContents(bsp, head, x, y, z) {
  let n = head;
  const P = bsp.planes;
  while (n >= 0) {
    const pi = bsp.nodePlane[n] * 4;
    const d = P[pi] * x + P[pi + 1] * y + P[pi + 2] * z - P[pi + 3];
    n = d >= 0 ? bsp.nodeC0[n] : bsp.nodeC1[n];
  }
  return bsp.leafContents[-1 - n];
}

// Returns the amount of solid (in units) along the segment a->b, sampled every `step` units.
// Walls, sky and blocking brush entities count; water does not.
// skip: optional Set of brush model numbers to ignore (e.g. vents that are already broken)
export function solidAlong(bsp, a, b, step = 2, skip = null) {
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const len = Math.hypot(dx, dy, dz);
  const n = Math.max(1, Math.ceil(len / step));
  let solid = 0;
  const hit = [];
  for (let i = 1; i < n; i++) {
    const f = i / n, x = a[0] + dx * f, y = a[1] + dy * f, z = a[2] + dz * f;
    for (const s of bsp.solids) {
      if (skip && skip.has(s.model)) continue;
      const mdl = bsp.models[s.model];
      const lx = x - s.origin[0], ly = y - s.origin[1], lz = z - s.origin[2];
      if (s.model !== 0 && (lx < mdl.mins[0] || ly < mdl.mins[1] || lz < mdl.mins[2] || lx > mdl.maxs[0] || ly > mdl.maxs[1] || lz > mdl.maxs[2])) continue;
      const c = pointContents(bsp, mdl.head, lx, ly, lz);
      if (c === -2 || c === -6) {
        solid += len / n;
        const last = hit[hit.length - 1];
        if (!last || last.model !== s.model || f - last.f1 > 2 * step / len) hit.push({ model: s.model, cls: s.cls, f0: f, f1: f });
        else last.f1 = f;
        break;
      }
    }
  }
  return { solid, len, hit };
}

// ---- textures ----
function decodeMip(u8, base, m0, w, h, name) {
  const n = w * h;
  const pal = base + m0 + n + (n >> 2) + (n >> 4) + (n >> 6) + 2;
  const out = new Uint8Array(n * 4);
  const trans = name[0] === '{';
  for (let i = 0; i < n; i++) {
    const c = u8[base + m0 + i];
    const p = pal + c * 3;
    out[i * 4] = u8[p]; out[i * 4 + 1] = u8[p + 1]; out[i * 4 + 2] = u8[p + 2];
    out[i * 4 + 3] = trans && c === 255 ? 0 : 255;
  }
  return out;
}

export function parseWad(buffer, wanted) {
  const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const magic = String.fromCharCode(u8[0], u8[1], u8[2], u8[3]);
  if (magic !== 'WAD3') return {};
  const n = dv.getInt32(4, true), dir = dv.getInt32(8, true);
  const out = {};
  for (let i = 0; i < n; i++) {
    const o = dir + i * 32;
    const off = dv.getInt32(o, true), type = u8[o + 12];
    let name = ''; for (let k = 0; k < 16; k++) { const c = u8[o + 16 + k]; if (!c) break; name += String.fromCharCode(c); }
    name = name.toLowerCase();
    if (type !== 0x43 || (wanted && !wanted.has(name))) continue;
    const w = dv.getUint32(off + 16, true), h = dv.getUint32(off + 20, true), m0 = dv.getUint32(off + 24, true);
    out[name] = { w, h, data: decodeMip(u8, off, m0, w, h, name) };
  }
  return out;
}

// ---- render mesh: world + visible brush entities, with texture + lightmap UVs ----
const HIDE = /^(trigger_|func_buyzone|func_bomb_target|func_hostage_rescue|func_escapezone|func_vip_safetyzone|func_ladder|env_|info_|armoury|func_mortar_field)/;
// separate: Set of brush model numbers that get their own meshes (so they can be hidden when broken)
export function buildMesh(bsp, separate = null) {
  const drawModels = [{ model: 0, origin: [0, 0, 0], amt: 1, mode: 0 }];
  for (const e of bsp.entities) {
    if (!e.model || e.model[0] !== '*' || HIDE.test(e.classname || '')) continue;
    const mode = +(e.rendermode || 0), amt = e.renderamt != null ? +e.renderamt / 255 : 1;
    if (mode && amt === 0) continue;
    drawModels.push({ model: +e.model.slice(1), origin: (e.origin || '0 0 0').split(/\s+/).map(Number), amt: mode === 0 ? 1 : amt, mode });
  }
  // gather faces per texture
  const groups = new Map();
  const lmFaces = [];
  for (const dm of drawModels) {
    const mdl = bsp.models[dm.model];
    for (let fi = mdl.firstFace; fi < mdl.firstFace + mdl.numFaces; fi++) {
      const f = bsp.faces[fi];
      const ti = bsp.texinfo[f.tex];
      const tex = bsp.textures[ti.mip];
      const name = tex ? tex.name : 'missing';
      if (name === 'sky' || name.startsWith('aaatrigger') || name === 'clip' || name === 'null' || name === 'origin' || name === 'bevel' || name === 'hint' || name === 'skip') continue;
      // polygon
      const poly = [];
      for (let k = 0; k < f.numEdges; k++) {
        const se = bsp.surfedges[f.firstEdge + k];
        const v = se >= 0 ? bsp.edges[se * 2] : bsp.edges[-se * 2 + 1];
        poly.push(bsp.verts[v * 3] + dm.origin[0], bsp.verts[v * 3 + 1] + dm.origin[1], bsp.verts[v * 3 + 2] + dm.origin[2]);
      }
      // lightmap extents
      let smin = 1e9, smax = -1e9, tmin = 1e9, tmax = -1e9;
      for (let k = 0; k < poly.length; k += 3) {
        const x = poly[k] - dm.origin[0], y = poly[k + 1] - dm.origin[1], z = poly[k + 2] - dm.origin[2];
        const s = x * ti.s[0] + y * ti.s[1] + z * ti.s[2] + ti.s[3];
        const t = x * ti.t[0] + y * ti.t[1] + z * ti.t[2] + ti.t[3];
        smin = Math.min(smin, s); smax = Math.max(smax, s); tmin = Math.min(tmin, t); tmax = Math.max(tmax, t);
      }
      const bs0 = Math.floor(smin / 16), bt0 = Math.floor(tmin / 16);
      const lw = Math.ceil(smax / 16) - bs0 + 1, lh = Math.ceil(tmax / 16) - bt0 + 1;
      const own = separate && separate.has(dm.model) ? dm.model : -1;
      const key = name + '|' + dm.amt + '|' + dm.mode + '|' + own;
      if (!groups.has(key)) groups.set(key, { name, amt: dm.amt, mode: dm.mode, model: own, faces: [] });
      const rec = { poly, ti, tex, origin: dm.origin, bs0, bt0, lw, lh, light: f.light, styles: f.styles, lm: null };
      groups.get(key).faces.push(rec);
      if (f.light >= 0 && f.styles[0] !== 255 && lw > 0 && lh > 0 && lw <= 64 && lh <= 64) lmFaces.push(rec);
    }
  }
  // pack lightmaps (shelf packing)
  const AW = 2048;
  lmFaces.sort((a, b) => b.lh - a.lh);
  let x = 0, y = 0, rowH = 0;
  for (const r of lmFaces) {
    if (x + r.lw + 2 > AW) { x = 0; y += rowH + 2; rowH = 0; }
    r.lm = [x + 1, y + 1]; x += r.lw + 2; rowH = Math.max(rowH, r.lh);
  }
  const AH = Math.max(4, 1 << Math.ceil(Math.log2(y + rowH + 4)));
  const atlas = new Uint8Array(AW * AH * 4);
  for (let i = 0; i < atlas.length; i += 4) { atlas[i] = atlas[i + 1] = atlas[i + 2] = 255; atlas[i + 3] = 255; }
  for (const r of lmFaces) {
    const src = r.light;
    if (src + r.lw * r.lh * 3 > bsp.lighting.length) { r.lm = null; continue; }
    // copy with 1px border (clamped)
    for (let j = -1; j <= r.lh; j++) for (let i = -1; i <= r.lw; i++) {
      const si = Math.min(r.lw - 1, Math.max(0, i)), sj = Math.min(r.lh - 1, Math.max(0, j));
      const s = src + (sj * r.lw + si) * 3;
      const d = ((r.lm[1] + j) * AW + (r.lm[0] + i)) * 4;
      atlas[d] = bsp.lighting[s]; atlas[d + 1] = bsp.lighting[s + 1]; atlas[d + 2] = bsp.lighting[s + 2]; atlas[d + 3] = 255;
    }
  }
  // build buffers per texture group
  const out = [];
  for (const g of groups.values()) {
    const pos = [], uv = [], uv2 = [];
    for (const r of g.faces) {
      const tw = r.tex ? r.tex.w : 64, th = r.tex ? r.tex.h : 64;
      const vs = [];
      for (let k = 0; k < r.poly.length; k += 3) {
        const x = r.poly[k], y = r.poly[k + 1], z = r.poly[k + 2];
        const lx = x - r.origin[0], ly = y - r.origin[1], lz = z - r.origin[2];
        const s = lx * r.ti.s[0] + ly * r.ti.s[1] + lz * r.ti.s[2] + r.ti.s[3];
        const t = lx * r.ti.t[0] + ly * r.ti.t[1] + lz * r.ti.t[2] + r.ti.t[3];
        let lu = 0.5 / AW, lv = 0.5 / AH;
        if (r.lm) { lu = (r.lm[0] + (s / 16 - r.bs0) + 0.5) / AW; lv = (r.lm[1] + (t / 16 - r.bt0) + 0.5) / AH; }
        vs.push([x, y, z, s / tw, t / th, lu, lv]);
      }
      for (let k = 1; k + 1 < vs.length; k++) for (const v of [vs[0], vs[k], vs[k + 1]]) { pos.push(v[0], v[1], v[2]); uv.push(v[3], v[4]); uv2.push(v[5], v[6]); }
    }
    out.push({ name: g.name, amt: g.amt, mode: g.mode, model: g.model, pos: new Float32Array(pos), uv: new Float32Array(uv), uv2: new Float32Array(uv2) });
  }
  return { groups: out, atlas: { w: AW, h: AH, data: atlas } };
}
