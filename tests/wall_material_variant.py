"""A measurement copy of the built page with each wall's own material in the wallbang finder's damage rule (Sujan,
2 Nov 2026: measure it on his answers first, a report only; results in tests/logs/wall-material-2026-11-02.md).

  python3 wall_material_variant.py A|B|C PAGE OUT

  A  the kill rule (tooMuchDamage) multiplies the damage a bullet keeps through every surface on the killer's
     crosshair line, each by its own material, as FireBullets3 does
  B  A, and the same for the hit rule in computeHits ("too much for a wall")
  C  the kill rule takes one surface, the line's best material (concrete and unlisted textures 0.5, wood 0.6)

Materials come from cstrike/sound/materials.txt in HALF_LIFE_DIR (default ~/code/cs16-data/Half-Life), read when
the copy is made and written into it: the copy is for the tests only, never published (Valve's file). Texture names
are matched as ReGameDLL's UTIL_TextureHit and TEXTURETYPE_Find do (a leading -0/+0 and {, !, ~ dropped, the first
16 characters, any case, the first line that matches; anything else is concrete); the modifiers are FireBullets3's
(cbase.cpp): metal 0.2, grate 0.4, vent and computer 0.45, tile 0.3, wood 0.6, and concrete or any other type keeps
the one before (0.5 at the first surface). Each kill the rule looks at goes to window.__matLog, and in B each hit
whose answer changes to window.__hitLog (page/wall_material_dump.js prints both). Patches index.html's text, so it
fits the build of 2 Nov 2026 (0.26.6) and stops with an assertion when the code it patches has changed.
"""
import json, os, sys
variant, src, out = sys.argv[1].upper(), sys.argv[2], sys.argv[3]
assert variant in ('A', 'B', 'C'), 'variant A, B or C'

mt = os.path.join(os.path.expanduser(os.environ.get('HALF_LIFE_DIR', '~/code/cs16-data/Half-Life')), 'cstrike', 'sound', 'materials.txt')
mats = []
for line in open(mt, encoding='latin-1'):
    s = line.lstrip()
    if not s or s[0] == '/' or not s[0].isalpha(): continue
    c = s[0].upper(); rest = s[1:].lstrip()
    parts = rest.split()
    if not parts or len(rest.rstrip('\r\n')) == len(parts[0]) and not rest.endswith(('\n', ' ', '\t')): continue
    mats.append([parts[0][:16].lower(), c])
page = open(src).read()
helper = r'''
const __MATS = %s;
const __MOD = { M: 0.2, G: 0.4, V: 0.45, T: 0.3, P: 0.45, W: 0.6 };
window.__matLog = [];
function __matOf(name) {
  let n = name; if (n[0] === '-' || n[0] === '+') n = n.slice(2); if ('{!~ '.includes(n[0])) n = n.slice(1);
  n = n.slice(0, 16).toLowerCase();
  for (const [t, c] of __MATS) if (t === n) return c;
  return 'C';
}
function __local(s, poses, x, y, z) {
  const ps = poses && s.model !== 0 ? poses.get(s.model) : null;
  if (ps) { const tx = x - ps.o[0], ty = y - ps.o[1], tz = z - ps.o[2];
    if (ps.f) return [tx * ps.f[0] + ty * ps.f[1] + tz * ps.f[2], -(tx * ps.r[0] + ty * ps.r[1] + tz * ps.r[2]), tx * ps.u[0] + ty * ps.u[1] + tz * ps.u[2]];
    return [tx, ty, tz]; }
  return [x - s.origin[0], y - s.origin[1], z - s.origin[2]];
}
function __texAt(bsp, s, poses, q) {
  const P = bsp.planes, md = bsp.models[s.model]; let best = null;
  for (let i = 0; i < md.numFaces; i++) {
    const f = bsp.faces[md.firstFace + i]; const pi = f.plane * 4; const n = [P[pi], P[pi + 1], P[pi + 2]];
    const dist = n[0] * q[0] + n[1] * q[1] + n[2] * q[2] - P[pi + 3]; if (Math.abs(dist) > 1.5) continue;
    const vs = []; for (let e = 0; e < f.numEdges; e++) { const se = bsp.surfedges[f.firstEdge + e]; const vi = se >= 0 ? bsp.edges[se * 2] : bsp.edges[-se * 2 + 1]; vs.push([bsp.verts[vi * 3], bsp.verts[vi * 3 + 1], bsp.verts[vi * 3 + 2]]); }
    let pos = 0, neg = 0;
    for (let j = 0; j < vs.length; j++) { const a = vs[j], b = vs[(j + 1) %% vs.length]; const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [q[0] - a[0], q[1] - a[1], q[2] - a[2]]; const c = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]; const sg = c[0] * n[0] + c[1] * n[1] + c[2] * n[2]; if (sg > 0.5) pos++; else if (sg < -0.5) neg++; }
    if (pos && neg) continue;
    if (!best || Math.abs(dist) < best.d) { const ti = bsp.texinfo[f.tex]; const t = ti && bsp.textures[ti.mip]; best = { d: Math.abs(dist), tex: t ? t.name : null }; }
  }
  return best ? best.tex : null;
}
// the damage a bullet keeps after every surface on the line a->b at time tP: the product of FireBullets3's modifiers,
// each surface setting it from its material or keeping the one before (concrete and unlisted textures), from 0.5.
// null when the line meets no surface. A surface whose face isn't found counts as wood's 0.6 (the old rule's best case).
function __wallMod(a, b, tP) {
  const bsp = MAP.bsp, skip = brokenSet(tP - 0.05); for (const s of bsp.solids) if (s.shootable) skip.add(s.model);
  const poses = posesAt(tP - 0.05);
  const res = solidAlong(bsp, a, b, 2, skip, poses, 'bullet');
  if (!res.hit.length) return null;
  let mod = 0.5, m = 1; const seen = [];
  const at = (f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
  for (const h of res.hit) {
    const s = bsp.solids.find((x) => x.model === h.model && !x.sightOnly) || bsp.solids.find((x) => x.model === h.model);
    let lo = Math.max(0, h.f0 - 2 * 2 / res.len), hi = h.f0;
    const inside = (f) => { const p = at(f), q = __local(s, poses, p[0], p[1], p[2]); const c = pointContents(bsp, bsp.models[s.model].head, q[0], q[1], q[2]); return c === -2 || c === -6; };
    for (let it = 0; it < 14; it++) { const mid = (lo + hi) / 2; if (inside(mid)) hi = mid; else lo = mid; }
    const p = at(hi), q = __local(s, poses, p[0], p[1], p[2]);
    const tex = __texAt(bsp, s, poses, q);
    const c = tex ? __matOf(tex) : '?';
    mod = c === '?' ? 0.6 : (__MOD[c] != null ? __MOD[c] : mod); m *= mod;
    seen.push((tex || '?') + ':' + c + ':' + mod);
  }
  return { m, seen };
}
''' % json.dumps(mats)
anchor = 'function tooMuchDamage(k) {'
assert page.count(anchor) == 1
page = page.replace(anchor, helper + anchor)
old_k = '  return per * 0.6 * (k.hs ? 4 : 1.25) * shots < hp;'
new_k = r'''  const old = per * 0.6 * (k.hs ? 4 : 1.25) * shots < hp;
  const tP = k.tPos != null ? k.tPos : k.t, eye = [k.kpos[0], k.kpos[1], k.kpos[2] + (k.kduck ? 12 : 17)];
  let raw = k.kang ? k.kang[0] : 0; if (raw > 180) raw -= 360;
  const pitch = -raw * 3 * Math.PI / 180, yaw = (k.kang ? k.kang[1] : 0) * Math.PI / 180;
  const dist = Math.hypot(k.vpos[0] - eye[0], k.vpos[1] - eye[1], k.vpos[2] - eye[2]);
  const end = [eye[0] + Math.cos(pitch) * Math.cos(yaw) * dist, eye[1] + Math.cos(pitch) * Math.sin(yaw) * dist, eye[2] - Math.sin(pitch) * dist];
  const w = k.kang ? __wallMod(eye, end, tP) : null;
  const m = w ? w.m : 0.6;
  const now = per * m * (k.hs ? 4 : 1.25) * shots < hp;
  window.__matLog.push({ t: k.t, kp: k.kp, vp: k.vp, gun: k.weapon, hs: !!k.hs, hp, shots, per, old, now, m: +m.toFixed(4), seen: w ? w.seen : null, max: Math.round(per * m * (k.hs ? 4 : 1.25) * shots) });
  return now;'''
assert page.count(old_k) == 1
page = page.replace(old_k, new_k)
if variant == 'B':
    old_h = "    if (per && d.dmg > per * 0.6 * (head ? 4 : 1.25) * Math.max(1, hs.length)) { note(d, 'too much for a wall'); continue; }"
    new_h = r'''    const __end = [c.eye[0] + c.dir[0] * c.along, c.eye[1] + c.dir[1] * c.along, c.eye[2] + c.dir[2] * c.along];
    const __w = per ? __wallMod(c.eye, __end, th) : null, __m = __w ? __w.m : 0.6;
    if (per && d.dmg > per * 0.6 * (head ? 4 : 1.25) * Math.max(1, hs.length) !== d.dmg > per * __m * (head ? 4 : 1.25) * Math.max(1, hs.length)) (window.__hitLog || (window.__hitLog = [])).push({ t: th, v: d.e, s: c.e, dmg: d.dmg, head, gun: c.gun, m: +__m.toFixed(4), seen: __w && __w.seen });
    if (per && d.dmg > per * __m * (head ? 4 : 1.25) * Math.max(1, hs.length)) { note(d, 'too much for a wall'); continue; }'''
    assert page.count(old_h) == 1
    page = page.replace(old_h, new_h)
if variant == 'C':
    a = "  let mod = 0.5, m = 1; const seen = [];"
    b = "    mod = c === '?' ? 0.6 : (__MOD[c] != null ? __MOD[c] : mod); m *= mod;"
    c = "  return { m, seen };\n}"
    for x in (a, b, c): assert page.count(x) == 1, x
    page = page.replace(a, "  let mod = 0.5, m = 1, own = 0; const seen = [];")
    page = page.replace(b, b + "\n    own = Math.max(own, c === '?' ? 0.6 : (__MOD[c] != null ? __MOD[c] : 0.5));")
    page = page.replace(c, "  return { m: own, seen }; // variant C: one surface, the best material on the line\n}")
open(out, 'w').write(page)
print(out, variant, len(mats), 'materials')
