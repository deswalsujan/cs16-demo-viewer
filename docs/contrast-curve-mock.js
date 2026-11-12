// Mockup only (UI review notes, 12 Nov 2026): the 3D picture under the game's light curve, drawn into the running
// viewer. Never built into src/. Evaluated inside the page's script through the test hook, so it reaches R3, VM, MAP.
// The curve: Xash3D FWGS engine/client/gamma.c, BuildGammaTable (commit 707596f, 10 Nov 2026). The lightmap:
// ref/gl/gl_rsurf.c, R_BuildLightMap. Models: ref/common/ref_light.c, R_EntityDynamicLight, and ref/gl/gl_studio.c,
// R_StudioLighting.
window.__cx = (() => {
  const SHADE_LAMBERT = 1.4953241, DIRECT = 0.9, STYLE_M = 264; // 'm' * 22: style 0, normal light
  function tables(o) {
    const g1 = o.gamma !== 0 ? 1 / o.gamma : 0.4, g2 = g1 * o.texgamma;
    const g3 = o.brightness <= 0 ? 0.125 : o.brightness <= 1 ? 0.125 - o.brightness * o.brightness * 0.075 : 0.05;
    const tex = new Uint8Array(256), light = new Uint16Array(1024);
    for (let i = 0; i < 256; i++) tex[i] = Math.max(0, Math.min(255, Math.trunc(Math.pow(i / 255, g2) * 255)));
    for (let i = 0; i < 1024; i++) {
      let f = Math.pow(i / 1023, o.lightgamma);
      if (o.brightness > 1) f *= o.brightness;
      f = f <= g3 ? (f / g3) * 0.125 : ((f - g3) / (1 - g3)) * 0.875 + 0.125;
      light[i] = Math.max(0, Math.min(1023, Math.trunc(Math.pow(f, g1) * 1023)));
    }
    return { tex, light, g1, g2, g3 };
  }
  const MAPFRAG = `uniform sampler2D map; uniform sampler2D lm; uniform float opacity; uniform float bright; uniform float g2; uniform float ob;
    varying vec2 vUv; varying vec2 vUv2;
    void main(){ vec4 t = texture2D(map, vUv); if (t.a < 0.5) discard;
      vec3 l = texture2D(lm, vUv2).rgb;
      gl_FragColor = vec4(min(pow(t.rgb, vec3(g2)) * l * ob, vec3(1.0)), opacity); }`;
  const MDLVERT = `uniform float amb; uniform float shade; uniform vec3 lcol; uniform vec3 ldir; uniform sampler2D curve;
    varying vec2 vUv; varying vec3 vCol;
    void main(){ vUv = uv; vec3 n = normalize(mat3(modelMatrix) * normal);
      float lc = min(dot(n, ldir), 1.0);
      float illum = amb + shade;
      lc = (lc + (${SHADE_LAMBERT} - 1.0)) / ${SHADE_LAMBERT};
      if (lc > 0.0) illum -= shade * lc;
      illum = clamp(illum, 0.0, 255.0);
      float lv = texture2D(curve, vec2((floor(illum * 4.0) + 0.5) / 1024.0, 0.5)).r;
      vCol = lcol * lv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
  const MDLFRAG = `uniform sampler2D map; uniform float hasMap; uniform float alphaTest; uniform float g2;
    varying vec2 vUv; varying vec3 vCol;
    void main(){ vec4 t = hasMap > 0.5 ? texture2D(map, vUv) : vec4(1.0); if (t.a < alphaTest) discard;
      gl_FragColor = vec4(min(pow(t.rgb, vec3(g2)) * vCol, vec3(1.0)), 1.0); }`;
  const orig = new Map(); // world material -> { frag, lm }
  const morig = new Map(); // model mesh -> its own material
  let cur = 'today', lastInfo = null;
  // the lightmap byte under a point, straight down, from the atlas the world meshes sample (style 0, as the viewer keeps it)
  const ray = new THREE.Raycaster();
  function floorLM(p3) {
    ray.set(new THREE.Vector3(p3.x, p3.y + 8, p3.z), new THREE.Vector3(0, -1, 0)); ray.far = 2048;
    const hits = ray.intersectObjects(R3.world.children.filter((m) => m.visible), false);
    for (const h of hits) {
      if (!h.uv2) continue;
      const u = h.object.material.uniforms; const tex = (orig.get(h.object.material) || {}).lm || u.lm.value;
      const img = tex.image, x = Math.min(img.width - 1, Math.max(0, Math.floor(h.uv2.x * img.width))), y = Math.min(img.height - 1, Math.max(0, Math.floor(h.uv2.y * img.height)));
      const k = (y * img.width + x) * 4; return { rgb: [img.data[k], img.data[k + 1], img.data[k + 2]], dist: h.distance, tex: h.object.material.uniforms.map.value.name || '' };
    }
    return null;
  }
  // R_EntityDynamicLight: the floor's light at the model, ambient and shade from it (light from straight above here)
  function modelLight(p3) {
    const f = floorLM(p3); const L = f ? f.rgb : [0, 0, 0];
    const c = L.map((v) => Math.min((v * STYLE_M) >> 8, 255));
    let total = Math.max(c[0], c[1], c[2]); const t0 = total; if (total === 0) total = 1;
    let shade = total * DIRECT, amb = total - shade;
    if (amb > 128) amb = 128;
    if (amb + shade > 255) shade = 255 - amb;
    const col = t0 > 0 ? c.map((v) => v / t0) : [1, 1, 1];
    return { floor: L, amb, shade, col };
  }
  function curveTex(T) {
    const d = new Float32Array(1024 * 4); for (let i = 0; i < 1024; i++) { d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = T.light[i] / 1023; d[i * 4 + 3] = 1; }
    const t = new THREE.DataTexture(d, 1024, 1, THREE.RGBAFormat, THREE.FloatType); t.magFilter = t.minFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
  }
  const lmCache = {};
  function lmFor(src, key, T, ob, lg) {
    const k = key + ':' + src.uuid; if (lmCache[k]) return lmCache[k];
    const lightscale = ob ? 256 : Math.trunc(Math.pow(2, 1 / lg) * 256 + 0.5);
    const s = src.image.data, d = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i += 4) {
      for (let c = 0; c < 3; c++) { let t = (s[i + c] * STYLE_M * lightscale) >> 14; if (t > 1023) t = 1023; d[i + c] = T.light[t] >> 2; }
      d[i + 3] = 255;
    }
    const t = new THREE.DataTexture(d, src.image.width, src.image.height, THREE.RGBAFormat);
    t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearFilter; t.needsUpdate = true;
    return lmCache[k] = t;
  }
  function rigs() {
    const out = []; if (R3.rigs) for (const k in R3.rigs) { const r = R3.rigs[k]; if (r && r.g && r.g.visible && r.g.parent) out.push({ r, vm: false }); }
    if (typeof VM !== 'undefined' && VM && VM.rig && VM.rig.g) out.push({ r: VM.rig, vm: true });
    return out;
  }
  function restore() {
    for (const [m, o] of orig) { m.fragmentShader = o.frag; m.uniforms.lm.value = o.lm; m.needsUpdate = true; }
    for (const [mesh, m] of morig) mesh.material = m;
    morig.clear();
  }
  // variant: 'today' or { gamma, brightness, texgamma, lightgamma, ob }
  function apply(v, key) {
    restore(); cur = key || 'today'; lastInfo = [];
    if (v === 'today') return { variant: cur };
    const T = tables(v);
    for (const m of R3.world.children.map((x) => x.material)) {
      if (!m.uniforms || !m.uniforms.lm) continue;
      if (!orig.has(m)) orig.set(m, { frag: m.fragmentShader, lm: m.uniforms.lm.value });
      if (m.uniforms.bright.value === 1.0) continue; // water stays as drawn today
      m.uniforms.g2 = { value: T.g2 }; m.uniforms.ob = { value: v.ob ? 2 * 128 / 192 : 1.0 }; // gl_overbright 1: blend DST_COLOR, SRC_COLOR with the colour 128/192 (R_BlendLightmaps)
      m.uniforms.lm.value = lmFor(orig.get(m).lm, cur, T, v.ob, v.lightgamma);
      m.fragmentShader = MAPFRAG; m.needsUpdate = true;
    }
    const ct = curveTex(T);
    const eye = R3.camera.position.clone();
    for (const { r, vm } of rigs()) {
      const at = vm ? eye : r.g.getWorldPosition(new THREE.Vector3());
      const L = modelLight(at);
      lastInfo.push({ vm, floor: L.floor, amb: +L.amb.toFixed(1), shade: +L.shade.toFixed(1), model: r.M && r.M.name });
      for (const pt of r.parts) {
        const old = pt.mesh.material; morig.set(pt.mesh, old);
        pt.mesh.material = new THREE.ShaderMaterial({
          uniforms: { map: { value: old.map }, hasMap: { value: old.map ? 1 : 0 }, alphaTest: { value: old.alphaTest || 0.0 }, g2: { value: T.g2 },
            amb: { value: L.amb }, shade: { value: L.shade }, lcol: { value: new THREE.Vector3(...L.col) }, ldir: { value: new THREE.Vector3(0, -1, 0) }, curve: { value: ct } },
          vertexShader: MDLVERT, fragmentShader: MDLFRAG, side: THREE.DoubleSide, depthTest: old.depthTest, depthWrite: old.depthWrite,
        });
      }
    }
    return { variant: cur, models: lastInfo };
  }
  return { tables, apply, floorLM, modelLight, rigs };
})();
0
