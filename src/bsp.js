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
  const nodeFirstFace = new Uint16Array(nn), nodeNumFaces = new Uint16Array(nn);
  for (let i = 0; i < nn; i++) { const o = L[5].off + i * 24; nodePlane[i] = u32(o); nodeC0[i] = i16(o + 4); nodeC1[i] = i16(o + 6); nodeFirstFace[i] = u16(o + 20); nodeNumFaces[i] = u16(o + 22); }

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

  const bsp = { entities, planes, nodePlane, nodeC0, nodeC1, nodeFirstFace, nodeNumFaces, leafContents, models, verts, edges: edgesArr, surfedges, texinfo, textures, faces, lighting };
  bsp.wads = ((entities[0] && entities[0].wad) || '').split(';').map((s) => s.replace(/\\/g, '/').split('/').pop().toLowerCase()).filter(Boolean);
  bsp.solids = solidModels(bsp);
  return bsp;
}

// Brush entities that stop bullets (doors, walls, crates, glass).
const BLOCKING = /^func_(wall|breakable|door|door_rotating|wall_toggle|pushable|rotating|train|tracktrain|plat|vehicle)$/;
function solidModels(bsp) {
  const out = [{ model: 0, origin: [0, 0, 0], cls: 'worldspawn' }];
  for (const e of bsp.entities) {
    if (!e.model || e.model[0] !== '*') continue;
    const o = (e.origin || '0 0 0').split(/\s+/).map(Number);
    // Drawn solid but not solid to bullets or players: a func_illusionary in the normal render mode. It hides what's
    // behind it, so the sight lines count it (sightOnly), and bullets pass through it. Inferno's lamp posts are one:
    // the post you see is a func_illusionary, and an invisible func_wall of the same size around it (below) is what
    // a bullet hits (23 Oct 2026: ave on PASHA, FX vs mTw, Inferno, Xperia Play 2011, R9 0:53, is a wallbang through
    // the post; mooN on Zeus, ALTERNATE aTTaX vs Virtus.pro, Inferno, Extreme Masters II, R8 0:48, isn't: Zeus was
    // beside it, in view).
    if (e.classname === 'func_illusionary' && !+(e.rendermode || 0)) { out.push({ model: +e.model.slice(1), origin: o, cls: e.classname, sightOnly: true }); continue; }
    if (!BLOCKING.test(e.classname || '')) continue;
    // What a player sees of it, for the wallbang finder (23 Oct 2026):
    //   invisible: drawn with a see-through render mode and no amount (an entity without renderamt has 0, so it
    //     isn't drawn): the box around Inferno's lamp posts, there for players and bullets to hit. Nothing to see,
    //     so the sight lines pass it; bullets don't
    //   shootable: a func_breakable that bullets can break (not flagged "only trigger", spawnflags 1, as Dust2's
    //     crates are, which only the bomb blows up): Nuke's vents and upper windows, Inferno's shutters
    //   fence: drawn with render mode 4 (solid, see-through where the texture's colour 255 is): fences, grates, ladders
    const mode = +(e.rendermode || 0), amt = e.renderamt != null ? +e.renderamt : 0;
    const invisible = mode !== 0 && amt === 0;
    const shootable = e.classname === 'func_breakable' && !(+(e.spawnflags || 0) & 1);
    out.push({ model: +e.model.slice(1), origin: o, cls: e.classname, invisible, shootable, fence: mode === 4 });
  }
  return out;
}

// A brush entity's placement: origin plus the engine's forward/right/up for its angles (pitch, yaw, roll)
export function brushPose(o, ang) {
  if (!ang || (!ang[0] && !ang[1] && !ang[2])) return { o, f: null, r: null, u: null };
  const d = Math.PI / 180;
  const sy = Math.sin(ang[1] * d), cy = Math.cos(ang[1] * d), sp = Math.sin(ang[0] * d), cp = Math.cos(ang[0] * d), sr = Math.sin(ang[2] * d), cr = Math.cos(ang[2] * d);
  return {
    o,
    f: [cp * cy, cp * sy, -sp],
    r: [-sr * sp * cy + cr * sy, -sr * sp * sy - cr * cy, -sr * cp],
    u: [cr * sp * cy + sr * sy, cr * sp * sy - sr * cy, cr * cp],
  };
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

// A point in a brush entity's own frame: where it is at that moment (poses, see solidAlong) or where the map puts it.
// Into a turned brush's frame the way the engine traces against it.
function localPoint(s, poses, x, y, z) {
  const ps = poses && s.model !== 0 ? poses.get(s.model) : null;
  if (!ps) return [x - s.origin[0], y - s.origin[1], z - s.origin[2]];
  const tx = x - ps.o[0], ty = y - ps.o[1], tz = z - ps.o[2];
  if (!ps.f) return [tx, ty, tz];
  return [tx * ps.f[0] + ty * ps.f[1] + tz * ps.f[2], -(tx * ps.r[0] + ty * ps.r[1] + tz * ps.r[2]), tx * ps.u[0] + ty * ps.u[1] + tz * ps.u[2]];
}

// Returns the amount of solid (in units) along the segment a->b, sampled every `step` units.
// Walls, sky and blocking brush entities count; water does not.
// skip: optional Set of brush model numbers to ignore (e.g. vents that are already broken)
// poses: optional Map of brush model number -> where it is at that moment ({ o, f, r, u }, see brushPose),
//        for doors and other movers that aren't where the map file puts them (a door opened either way)
// use: 'sight' (default) for what a player sees: invisible brushes let the line through and func_illusionary
//      stops it; 'bullet' for what a bullet hits: the other way round
export function solidAlong(bsp, a, b, step = 2, skip = null, poses = null, use = 'sight') {
  const bullet = use === 'bullet';
  const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
  const len = Math.hypot(dx, dy, dz);
  const n = Math.max(1, Math.ceil(len / step));
  let solid = 0;
  const hit = [];
  for (let i = 1; i < n; i++) {
    const f = i / n, x = a[0] + dx * f, y = a[1] + dy * f, z = a[2] + dz * f;
    for (const s of bsp.solids) {
      if ((bullet ? s.sightOnly : s.invisible) || (skip && skip.has(s.model))) continue;
      const mdl = bsp.models[s.model];
      const [lx, ly, lz] = localPoint(s, poses, x, y, z);
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

// The texture where the line a->b enters each surface solidAlong found on it (res, run with use 'bullet' and the same
// step and poses), as the game reads it for a bullet (TRACE_TEXTURE in UTIL_TextureHit, ReGameDLL util.cpp): the edge
// is found between the last sample outside and the first inside, then the face of that brush model it lies on. null
// for a surface whose face isn't found. For the wallbang finder's damage rule (0.26.7).
export function hitTextures(bsp, a, b, res, step = 2, poses = null) {
  const at = (f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  const P = bsp.planes;
  return res.hit.map((h) => {
    const s = bsp.solids.find((x) => x.model === h.model && !x.sightOnly);
    if (!s) return null;
    const head = bsp.models[s.model].head;
    const inside = (f) => { const q = localPoint(s, poses, ...at(f)); const c = pointContents(bsp, head, q[0], q[1], q[2]); return c === -2 || c === -6; };
    let lo = Math.max(0, h.f0 - 2 * step / res.len), hi = h.f0;
    for (let i = 0; i < 14; i++) { const mid = (lo + hi) / 2; if (inside(mid)) hi = mid; else lo = mid; }
    const q = localPoint(s, poses, ...at(hi));
    const md = bsp.models[s.model]; let best = null;
    for (let i = 0; i < md.numFaces; i++) {
      const f = bsp.faces[md.firstFace + i], pi = f.plane * 4, n = [P[pi], P[pi + 1], P[pi + 2]];
      const d = Math.abs(n[0] * q[0] + n[1] * q[1] + n[2] * q[2] - P[pi + 3]);
      if (d > 1.5 || (best && d >= best.d)) continue;
      // inside the face's polygon: q on the same side of every edge
      let pos = 0, neg = 0;
      for (let e = 0; e < f.numEdges; e++) {
        const v = (k) => { const se = bsp.surfedges[f.firstEdge + (k % f.numEdges)]; const vi = se >= 0 ? bsp.edges[se * 2] : bsp.edges[-se * 2 + 1]; return [bsp.verts[vi * 3], bsp.verts[vi * 3 + 1], bsp.verts[vi * 3 + 2]]; };
        const p0 = v(e), p1 = v(e + 1), e1 = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]], e2 = [q[0] - p0[0], q[1] - p0[1], q[2] - p0[2]];
        const sg = (e1[1] * e2[2] - e1[2] * e2[1]) * n[0] + (e1[2] * e2[0] - e1[0] * e2[2]) * n[1] + (e1[0] * e2[1] - e1[1] * e2[0]) * n[2];
        if (sg > 0.5) pos++; else if (sg < -0.5) neg++;
      }
      if (pos && neg) continue;
      const ti = bsp.texinfo[f.tex], t = ti && bsp.textures[ti.mip];
      best = { d, tex: t ? t.name : null };
    }
    return best ? best.tex : null;
  });
}

// ---- the light on models (0.26.31) ----
// Each face's texture axes and extents as the engine works them out (CalcSurfaceExtents): the lowest and highest s
// and t of its corners, floored and ceiled to the 16-unit lightmap grid. lit: the face has a lightmap to read (not
// sky or water, which the engine draws tiled with no lightmap, SURF_DRAWTILED); sky: a sky face (SURF_DRAWSKY).
function surfaceInfo(bsp) {
  return bsp.faces.map((f) => {
    const ti = bsp.texinfo[f.tex]; if (!ti) return null;
    const tex = bsp.textures[ti.mip], name = tex ? tex.name : '';
    const sky = name.startsWith('sky'), turb = name[0] === '!' || name[0] === '*';
    const mins = [1e9, 1e9], maxs = [-1e9, -1e9];
    for (let k = 0; k < f.numEdges; k++) {
      const se = bsp.surfedges[f.firstEdge + k], v = se >= 0 ? bsp.edges[se * 2] : bsp.edges[-se * 2 + 1];
      const x = bsp.verts[v * 3], y = bsp.verts[v * 3 + 1], z = bsp.verts[v * 3 + 2];
      for (let j = 0; j < 2; j++) {
        const a = j ? ti.t : ti.s, val = x * a[0] + y * a[1] + z * a[2] + a[3];
        if (val < mins[j]) mins[j] = val; if (val > maxs[j]) maxs[j] = val;
      }
    }
    const bmin = mins.map((m) => Math.floor(m / 16)), bmax = maxs.map((m) => Math.ceil(m / 16));
    const lit = !sky && !turb && !(ti.flags & 1);
    return {
      s: ti.s, t: ti.t, sky, lit, light: f.light >= 0 && f.styles[0] !== 255 ? f.light : -1,
      // water faces reach any point on their plane, as the engine gives them extents of 16384 (Mod_LoadFaces)
      mins: turb ? [-8192, -8192] : [bmin[0] * 16, bmin[1] * 16], ext: turb ? [16384, 16384] : [(bmax[0] - bmin[0]) * 16, (bmax[1] - bmin[1]) * 16],
    };
  });
}
// The first face the line a->b meets in the world, walking the map's node tree from a, and where it meets it: as
// R_RecursiveLightPoint (Xash3D FWGS ref/common/ref_light.c) does with lit set, which passes faces with no lightmap,
// and as PM_RecursiveSurfCheck does without it, which the engine's sky test reads. null when the line meets none.
function surfaceAlong(bsp, a, b, lit) {
  const S = bsp.surfInfo || (bsp.surfInfo = surfaceInfo(bsp)), P = bsp.planes;
  const walk = (node, s, e) => {
    for (;;) {
      if (node < 0) return null;
      const pi = bsp.nodePlane[node] * 4;
      const front = P[pi] * s[0] + P[pi + 1] * s[1] + P[pi + 2] * s[2] - P[pi + 3];
      const back = P[pi] * e[0] + P[pi + 1] * e[1] + P[pi + 2] * e[2] - P[pi + 3];
      const side = front < 0 ? 1 : 0;
      if ((back < 0 ? 1 : 0) === side) { node = side ? bsp.nodeC1[node] : bsp.nodeC0[node]; continue; }
      const frac = front / (front - back);
      const mid = [s[0] + (e[0] - s[0]) * frac, s[1] + (e[1] - s[1]) * frac, s[2] + (e[2] - s[2]) * frac];
      const hit = walk(side ? bsp.nodeC1[node] : bsp.nodeC0[node], s, mid);
      if (hit) return hit;
      for (let i = 0, f0 = bsp.nodeFirstFace[node]; i < bsp.nodeNumFaces[node]; i++) {
        const f = S[f0 + i];
        if (!f || (lit && !f.lit)) continue;
        const ds = mid[0] * f.s[0] + mid[1] * f.s[1] + mid[2] * f.s[2] + f.s[3] - f.mins[0];
        const dt = mid[0] * f.t[0] + mid[1] * f.t[1] + mid[2] * f.t[2] + f.t[3] - f.mins[1];
        if (ds < 0 || dt < 0 || ds > f.ext[0] || dt > f.ext[1]) continue;
        return { f, ds, dt, at: mid };
      }
      node = side ? bsp.nodeC0[node] : bsp.nodeC1[node]; s = mid;
    }
  };
  return walk(bsp.models[0].head, a, b);
}
// The light under a model, as the engine reads it (R_LightVec): the lightmap texel nearest to where the line a->b
// first meets a lit face of the world, at light style "m" (264 of 256), at most 255 a channel; [0, 0, 0] for a face
// with no light, null when the line meets no lit face. The world only, as in the game: Xash3D also reads doors and
// other brush entities and the ceiling (r_lighting_extended), which the game doesn't. The face's first light style,
// as the 3D view draws the world (buildMesh).
export function lightAlong(bsp, a, b) {
  const h = surfaceAlong(bsp, a, b, true); if (!h) return null;
  if (h.f.light < 0) return [0, 0, 0];
  const smax = (h.f.ext[0] >> 4) + 1, k = h.f.light + (Math.floor(h.dt / 16 + 0.5) * smax + Math.floor(h.ds / 16 + 0.5)) * 3;
  if (k + 2 >= bsp.lighting.length) return [0, 0, 0];
  return [0, 1, 2].map((c) => Math.min((bsp.lighting[k + c] * 264) >> 8, 255));
}
// Whether the line a->b reaches the sky: the first face it meets in the world is a sky face (the engine's
// CL_TraceLine and EV_TraceSurface in R_EntityDynamicLight)
export function skyAlong(bsp, a, b) {
  const h = surfaceAlong(bsp, a, b, false);
  return !!(h && h.f.sky);
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
    // see-through texels (fences, grates) are marked with palette colour 255, usually pure blue:
    // blank them so texture smoothing can't bleed that blue into the visible parts
    const see = trans && c === 255;
    out[i * 4] = see ? 0 : u8[p]; out[i * 4 + 1] = see ? 0 : u8[p + 1]; out[i * 4 + 2] = see ? 0 : u8[p + 2];
    out[i * 4 + 3] = see ? 0 : 255;
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
  // sight: the sight lines count it (solidModels above: the world, what stops bullets, a func_illusionary in the
  // normal render mode); the rest is drawn but not solid, and the picture check leaves it out (view3d.part.js)
  const drawModels = [{ model: 0, origin: [0, 0, 0], amt: 1, mode: 0, solid: true, sight: true }];
  for (const e of bsp.entities) {
    if (!e.model || e.model[0] !== '*' || HIDE.test(e.classname || '')) continue;
    const mode = +(e.rendermode || 0);
    // like the game: an entity without a renderamt has 0, so a see-through render mode with no amount is invisible
    // (Inferno's lamp posts have such a box around them for players to bump into)
    const amt = e.renderamt != null ? +e.renderamt / 255 : 0;
    if (mode && amt === 0) continue;
    const solid = BLOCKING.test(e.classname || '');
    drawModels.push({ model: +e.model.slice(1), origin: (e.origin || '0 0 0').split(/\s+/).map(Number), amt: mode === 0 ? 1 : amt, mode, solid, sight: solid || (e.classname === 'func_illusionary' && !mode) });
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
      const key = name + '|' + dm.amt + '|' + dm.mode + '|' + own + '|' + (dm.solid ? 1 : 0) + (dm.sight ? 1 : 0);
      if (!groups.has(key)) groups.set(key, { name, amt: dm.amt, mode: dm.mode, model: own, solid: !!dm.solid, sight: !!dm.sight, faces: [] });
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
    out.push({ name: g.name, amt: g.amt, mode: g.mode, model: g.model, solid: g.solid, sight: g.sight, pos: new Float32Array(pos), uv: new Float32Array(uv), uv2: new Float32Array(uv2) });
  }
  return { groups: out, atlas: { w: AW, h: AH, data: atlas } };
}
