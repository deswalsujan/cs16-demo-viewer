// ---------------- the game's light (0.26.31) ----------------
// Sujan, 12 Nov 2026 (DECISIONS.md, "The 3D picture's contrast"): the 3D picture uses Valve's defaults as one fixed
// curve for everyone, with no setting, and gl_overbright 1; player models are lit by the floor under them, as the
// game does, even where that makes them hard to see. Built as Xash3D FWGS builds it (commit 707596f, 10 Nov 2026):
// the tables in engine/client/gamma.c (BuildGammaTable), the world's lightmaps in ref/gl/gl_rsurf.c (R_BuildLightMap,
// R_BlendLightmaps), the light on a model in ref/common/ref_light.c (R_EntityDynamicLight) and ref/gl/gl_studio.c
// (R_StudioLighting). Up to 0.26.30 the map was each texture times min(lightmap x 2, 1.8), then to the power 0.85,
// and every model had the same light everywhere (ambient 0.75 and a sun of 0.5 from above).

// Valve's defaults (Valve Developer Community, list of Half-Life console variables): gamma 2.5, brightness 1,
// texgamma 2, lightgamma 2.5 (Xash3D's own brightness default is 0). tex: a texture's colour through texgamma; light:
// the light table (0 to 1023); lm: a lightmap byte at light style "m" (264 of 256) through it, as R_BuildLightMap
// writes it with gl_overbright 1 (lightscale 256), to be drawn at 4/3 (R_BlendLightmaps: DST_COLOR, SRC_COLOR with
// the colour 128/192). Math.fround where the engine works in single precision. Checked 12 Nov 2026 against Xash3D's
// own test tables for BuildGammaTable (gamma 2.5, brightness 0, texgamma 2, lightgamma 2.5; and 2.2, 1, 2.2, 2.4):
// every entry the same (tests/logs/0.26.31.md).
function buildCurve(gamma, brightness, texgamma, lightgamma) {
  const f32 = Math.fround;
  const g1 = f32(1 / gamma), g2 = f32(g1 * texgamma);
  const g3 = f32(brightness <= 0 ? 0.125 : brightness <= 1 ? 0.125 - brightness * brightness * 0.075 : 0.05);
  const tex = new Uint8Array(256), light = new Uint16Array(1024), lm = new Uint8Array(256);
  for (let i = 0; i < 256; i++) tex[i] = Math.max(0, Math.min(255, Math.trunc(f32(f32(Math.pow(i / 255, g2)) * 255))));
  for (let i = 0; i < 1024; i++) {
    let f = f32(Math.pow(i / 1023, lightgamma));
    if (brightness > 1) f = f32(f * brightness);
    f = f <= g3 ? f32((f / g3) * 0.125) : f32(((f - g3) / (1 - g3)) * 0.875 + 0.125);
    light[i] = Math.max(0, Math.min(1023, Math.trunc(Math.pow(f, g1) * 1023)));
  }
  for (let i = 0; i < 256; i++) lm[i] = light[Math.min(1023, (i * 264 * 256) >> 14)] >> 2;
  return { tex, light, lm, g1, g3, lightgamma };
}
const CURVE = buildCurve(2.5, 1, 2, 2.5);

// A texture's colours through texgamma, as the game loads a Half-Life texture (LUMP_TEXGAMMA, Image_SetPalette in
// Xash3D's imagelib): every world texture but the masked ones (names starting with {, fences and grates), water too,
// and every model skin but the masked ones (STUDIO_NF_MASKED). The sky and the sprites keep their colours.
function texGamma(rgba) {
  const out = new Uint8Array(rgba.length), T = CURVE.tex;
  for (let i = 0; i < rgba.length; i += 4) { out[i] = T[rgba[i]]; out[i + 1] = T[rgba[i + 1]]; out[i + 2] = T[rgba[i + 2]]; out[i + 3] = rgba[i + 3]; }
  return out;
}
// The lightmap atlas (buildMesh) through the light table, in place
function lightmapCurve(data) {
  const T = CURVE.lm;
  for (let i = 0; i < data.length; i += 4) { data[i] = T[data[i]]; data[i + 1] = T[data[i + 1]]; data[i + 2] = T[data[i + 2]]; }
  return data;
}

// The sky light's colour and direction (the direction the light travels): the demo's movevars (sv_skycolor and
// sv_skyvec, D.sky from the reader), else the map's light_environment as ReGameDLL's CEnvLight sets them
// (regamedll/dlls/lights.cpp: KeyValue and Spawn; UTIL_MakeAimVectors turns the pitch round), with the "angle" key
// read as the engine reads it (ED_ParseEdict: the yaw, keeping the pitch already set; -1 straight up, -2 straight
// down). null when the colour is 0, which the engine reads as no sky light. Checked 12 Nov 2026 on 8 test demos:
// every one has movevars, matching its map's light_environment within 2 a channel.
function envSky(bsp) {
  let color = null, vec = null;
  for (const e of bsp.entities) {
    if (e.classname !== 'light_environment') continue;
    let ang = [0, 0, 0];
    for (const [k, v] of Object.entries(e)) {
      if (k === 'angles') ang = v.trim().split(/\s+/).map(Number);
      else if (k === 'angle') { const y = +v; ang = y >= 0 ? [ang[0], y, ang[2]] : y === -1 ? [-90, 0, 0] : [90, 0, 0]; }
      else if (k === 'pitch') ang[0] = +v;
      else if (k === '_light') {
        const n = v.trim().split(/\s+/).map((x) => parseInt(x, 10)); let [r, g, b] = n;
        if (n.length === 1) g = b = r;
        else if (n.length >= 4) { const w = n[3] / 255; r = Math.trunc(r * w); g = Math.trunc(g * w); b = Math.trunc(b * w); }
        color = [r, g, b].map((x) => Math.trunc(Math.pow(x / 114, 0.6) * 264));
      }
    }
    const p = -ang[0] * Math.PI / 180, y = ang[1] * Math.PI / 180;
    vec = [Math.cos(p) * Math.cos(y), Math.cos(p) * Math.sin(y), -Math.sin(p)];
  }
  return color && vec ? { color, vec, from: 'light_environment' } : null;
}
function skyLight() {
  const s = (D && D.sky) || (MAP && MAP.bsp ? envSky(MAP.bsp) : null);
  if (!s || s.color[0] + s.color[1] + s.color[2] === 0) return null;
  return { color: s.color.map((c) => Math.max(0, Math.trunc(c))), vec: s.vec, from: s.from };
}

// The light on a model at (x, y, z), in the game's coordinates, as R_EntityDynamicLight works it out: when the line
// from 8 units above it toward the sun (8192 units) first meets a sky face, the sky's colour from the sun's direction;
// otherwise the lightmap under it (2048 units down), from the direction its brightness slopes away (four more
// readings, 16 units out on each side). 90% of it comes from that direction (direct 0.9) and the rest from all round,
// at most 128, the two together at most 255; col is its colour, the brightest channel 1. No dynamic lights: the gun
// flash lights nothing in the viewer (LIMITS.md). Without a map, the engine's light for no world (ambient 192).
const LIGHT = { map: null, demo: null, sky: null, cache: new Map() };
function entityLight(x, y, z) {
  if (!MAP || !MAP.bsp) return { amb: 192, shade: 0, col: [1, 1, 1], dir: [0, 0, -1] };
  if (LIGHT.map !== MAP || LIGHT.demo !== D) { LIGHT.map = MAP; LIGHT.demo = D; LIGHT.sky = skyLight(); LIGHT.cache.clear(); }
  const key = Math.round(x) + ',' + Math.round(y) + ',' + Math.round(z);
  const hit = LIGHT.cache.get(key); if (hit) return hit;
  const bsp = MAP.bsp, sky = LIGHT.sky, src = [x, y, z + 8];
  let c = null, dir = [0, 0, -1];
  const inSun = !!sky && skyAlong(bsp, src, [x - sky.vec[0] * 8192, y - sky.vec[1] * 8192, z - sky.vec[2] * 8192]);
  if (inSun) { c = sky.color.slice(); dir = sky.vec.slice(); }
  else {
    const end = [src[0], src[1], src[2] - 2048];
    c = lightAlong(bsp, src, end) || [0, 0, 0];
    const g = (dx, dy) => { const l = lightAlong(bsp, [src[0] + dx, src[1] + dy, src[2]], [end[0] + dx, end[1] + dy, end[2]]) || [0, 0, 0]; return (l[0] + l[1] + l[2]) / 768; };
    const g0 = g(-16, -16), g1 = g(16, -16), g2 = g(16, 16), g3 = g(-16, 16);
    dir = [g0 - g1 - g2 + g3, g1 + g0 - g2 - g3, -1];
    const n = Math.hypot(dir[0], dir[1], dir[2]); dir = dir.map((v) => v / n);
  }
  let total = Math.max(c[0], c[1], c[2]); if (total === 0) total = 1;
  let shade = total * 0.9, amb = total - shade;
  if (amb > 128) amb = 128;
  if (amb + shade > 255) shade = 255 - amb;
  const top = Math.max(c[0], c[1], c[2]);
  const L = { amb, shade, col: top > 0 ? c.map((v) => v / top) : [1, 1, 1], dir, inSun, light: c };
  if (LIGHT.cache.size > 4096) LIGHT.cache.clear();
  LIGHT.cache.set(key, L);
  return L;
}

// Studio models (players, their guns, bodies, shells, his gun in Player's eyes and POV mode) drawn with the light on
// them, vertex by vertex, as R_StudioLighting does it: the all-round light plus the directional part by how far the
// vertex faces the light (SHADE_LAMBERT 1.4953241), through the light table, times the light's colour, times the skin
// (through texgamma when it was loaded). The table is worked out in the shader the way CURVE builds it, so it needs no
// texture in the vertex shader. Flat-shaded skins get 80% of the directional part (STUDIO_NF_FLATSHADE), full-bright
// skins the light's colour alone (STUDIO_NF_FULLBRIGHT). even: Team colours keeps the even light it had up to 0.26.30
// (ambient 0.75 and a sun of 0.5), so red and blue stay clear in the dark (it isn't in the game). emissive: the
// selected player's highlight, added on top.
const STUDIO_VS = `uniform float amb; uniform float shade; uniform vec3 lcol; uniform vec3 ldir; uniform float flatShade;
  uniform float fullBright; uniform float even;
  varying vec2 vUv; varying vec3 vCol;
  float curve(float illum) {
    float i = floor(min(illum, 255.0) * 4.0);
    if (i < 1.0) return 0.0;
    float f = pow(i / 1023.0, ${CURVE.lightgamma.toFixed(1)});
    f = f <= ${CURVE.g3.toFixed(9)} ? f / ${CURVE.g3.toFixed(9)} * 0.125 : (f - ${CURVE.g3.toFixed(9)}) / ${(1 - CURVE.g3).toFixed(9)} * 0.875 + 0.125;
    return min(floor(pow(f, ${CURVE.g1.toFixed(9)}) * 1023.0), 1023.0) / 1023.0;
  }
  void main() {
    vUv = uv;
    vec3 n = normalize(mat3(modelMatrix) * normal);
    if (even > 0.5) vCol = vec3(0.75 + 0.5 * max(dot(n, normalize(vec3(0.4, 1.0, 0.3))), 0.0));
    else if (fullBright > 0.5) vCol = lcol;
    else {
      float illum = amb;
      if (flatShade > 0.5) illum += shade * 0.8;
      else {
        float lc = min(dot(n, ldir), 1.0);
        illum += shade;
        lc = (lc + 0.4953241) / 1.4953241;
        if (lc > 0.0) illum -= shade * lc;
        illum = max(illum, 0.0);
      }
      vCol = lcol * curve(illum);
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const STUDIO_FS = `uniform sampler2D map; uniform float hasMap; uniform float alphaTest; uniform vec3 color; uniform vec3 emissive;
  varying vec2 vUv; varying vec3 vCol;
  void main() {
    vec4 t = hasMap > 0.5 ? texture2D(map, vUv) : vec4(color, 1.0);
    if (t.a < alphaTest) discard;
    gl_FragColor = vec4(min(t.rgb * vCol, vec3(1.0)) + emissive, 1.0);
  }`;
// flags: the skin's texture flags (1 flat-shaded, 4 full-bright, 64 masked)
function studioMat(map, flags) {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map || null }, hasMap: { value: map ? 1 : 0 }, alphaTest: { value: flags & 64 ? 0.5 : 0 },
      color: { value: new THREE.Color(0xffffff) }, emissive: { value: new THREE.Color(0) },
      amb: { value: 192 }, shade: { value: 0 }, lcol: { value: new THREE.Vector3(1, 1, 1) }, ldir: { value: new THREE.Vector3(0, -1, 0) },
      flatShade: { value: flags & 1 ? 1 : 0 }, fullBright: { value: flags & 4 ? 1 : 0 }, even: { value: 0 },
    },
    vertexShader: STUDIO_VS, fragmentShader: STUDIO_FS, side: THREE.DoubleSide,
  });
}
// Give a rig the light at (x, y, z) (game coordinates). dir: the light's direction in the space the rig is drawn in,
// when that isn't the 3D view's world (the gun in Player's eyes is drawn in the camera's space)
const LDIR = new THREE.Vector3();
function lightRig(r, x, y, z, dir) {
  const L = entityLight(x, y, z);
  if (dir) LDIR.copy(dir); else LDIR.set(L.dir[0], L.dir[2], -L.dir[1]);
  for (const pt of r.parts) {
    const u = pt.mat.uniforms; if (!u || !u.amb) continue;
    u.amb.value = L.amb; u.shade.value = L.shade; u.lcol.value.set(L.col[0], L.col[1], L.col[2]); u.ldir.value.copy(LDIR);
  }
  return L;
}
