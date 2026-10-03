// ---------------- 3D view ----------------
let viewMode = '2d';
let wbFocus = null;
const view3 = { ready: false, map: null };
const cam3 = { mode: 'free', pos: [0, 0, 1500], yaw: 0, pitch: 60, keys: {} };
const g3 = (x, y, z) => new THREE.Vector3(x, z, -y); // GoldSrc (z up) -> three (y up)
function status3(t, withButton) {
  const el = $('status3');
  if (!t) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  el.innerHTML = `<div><span>${esc(t)}</span>${withButton ? '<button class="btn" type="button" id="bFolder3">' + (HL.handle ? 'Refresh Half-Life folder' : 'Choose Half-Life folder') + '</button><small>The map lives in cstrike\\maps or cstrike_downloads\\maps. Its textures come from the .wad files.</small>' : ''}</div>`;
  if (withButton) $('bFolder3').onclick = () => refreshOrPick();
}
document.querySelectorAll('#viewSeg button').forEach((b) => b.onclick = () => setView(b.dataset.v));
function setView(v) {
  viewMode = v; savePrefs();
  document.querySelectorAll('#viewSeg button').forEach((x) => x.classList.toggle('on', x.dataset.v === v));
  const r = $('radar');
  r.classList.toggle('m2d', v === '2d'); r.classList.toggle('m3d', v === '3d'); r.classList.toggle('msplit', v === 'split');
  $('cam3').hidden = v === '2d' || !D;
  if (v !== '2d' && !window.THREE) status3('The 3D engine could not load. Check your internet connection and reload the page.');
  else if (v !== '2d' && D && !MAP) loadMap(D.mapName);
  requestAnimationFrame(() => { resize(); resize3(); });
}

let R3 = null; // three.js objects
function init3() {
  if (R3 || !window.THREE) return;
  const canvas = $('gl');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(qualityRatio());
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7d93a6);
  const camera = new THREE.PerspectiveCamera(70, 1, 4, 16000);
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const sun = new THREE.DirectionalLight(0xffffff, 0.5); sun.position.set(0.4, 1, 0.3); scene.add(sun);
  const world = new THREE.Group(); scene.add(world);
  const dyn = new THREE.Group(); scene.add(dyn);
  R3 = { renderer, scene, camera, world, dyn, players: {}, ov: null };
  // camera input: drag to look, wheel to move
  let dragging = null;
  canvas.addEventListener('pointerdown', (e) => { canvas.focus(); dragging = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    if (!dragging.moved && Math.hypot(e.clientX - dragging.sx, e.clientY - dragging.sy) < 5) return;
    dragging.moved = true;
    const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y; dragging.x = e.clientX; dragging.y = e.clientY;
    if (cam3.mode !== 'free') { setCam('free', false, true); }
    cam3.yaw -= dx * 0.25; cam3.pitch = Math.max(-89, Math.min(89, cam3.pitch + dy * 0.25));
  });
  canvas.addEventListener('pointerup', (e) => {
    const moved = dragging && dragging.moved;
    dragging = null;
    if (!moved && cam3.mode !== 'free' && D) nextPlayer(e.button === 2 ? -1 : 1);
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (cam3.mode !== 'free') { setCam('free', false, true); }
    const f = fwd(cam3.yaw, cam3.pitch); const d = -e.deltaY * 1.5;
    cam3.pos[0] += f[0] * d; cam3.pos[1] += f[1] * d; cam3.pos[2] += f[2] * d;
  }, { passive: false });
  resize3();
}
// Render quality: how many pixels the 3D view draws. High = the screen's full sharpness (up to 2x),
// low = fewer pixels than the screen (softer, much lighter on the graphics chip). Auto starts at high and
// steps down to 1x once if the 3D view averages under 45 frames a second for a few seconds.
const Q = { lowered: false, acc: 0, n: 0 };
function qualityRatio() {
  const full = Math.min(2, window.devicePixelRatio || 1);
  const q = $('q3') ? $('q3').value : 'auto';
  if (q === 'low') return Math.min(1, full) * 0.75;
  if (q === 'auto' && Q.lowered) return Math.min(1, full);
  return full;
}
function applyQuality(reset) {
  if (reset) { Q.lowered = false; Q.acc = 0; Q.n = 0; }
  if (R3) { R3.renderer.setPixelRatio(qualityRatio()); resize3(); }
}
function qualityTick(dt) {
  if ($('q3').value !== 'auto' || Q.lowered || document.hidden || Math.min(2, window.devicePixelRatio || 1) <= 1) return;
  if (dt >= 0.1) return; // a stall (tab switch, loading), not a sign of a slow machine
  Q.acc += dt; Q.n++;
  if (Q.acc < 3) return;
  const fps = Q.n / Q.acc; Q.acc = 0; Q.n = 0;
  if (fps < 45) { Q.lowered = true; applyQuality(false); toast('3D sharpness lowered to keep playback smooth. Choose "Quality: high" in the 3D bar to change it back.', 7000); }
}
function fwd(yaw, pitch) { const y = yaw * Math.PI / 180, p = pitch * Math.PI / 180; return [Math.cos(p) * Math.cos(y), Math.cos(p) * Math.sin(y), -Math.sin(p)]; }
function resize3() {
  if (!R3) return;
  const r = $('gl').getBoundingClientRect();
  if (!r.width) return;
  R3.renderer.setSize(r.width, r.height, false);
  R3.camera.aspect = r.width / r.height; R3.camera.updateProjectionMatrix();
  const l = $('lbl'); l.width = Math.round(r.width * dpr); l.height = Math.round(r.height * dpr);
}
new ResizeObserver(() => resize3()).observe($('radar'));

const SHADER = {
  vertexShader: `varying vec2 vUv; varying vec2 vUv2; attribute vec2 uv2;
    void main(){ vUv = uv; vUv2 = uv2; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform sampler2D map; uniform sampler2D lm; uniform float opacity; uniform float bright;
    varying vec2 vUv; varying vec2 vUv2;
    void main(){ vec4 t = texture2D(map, vUv); if (t.a < 0.5) discard;
      vec3 l = texture2D(lm, vUv2).rgb;
      vec3 c = t.rgb * min(l * bright, vec3(1.8));
      gl_FragColor = vec4(pow(c, vec3(0.85)), opacity); }`,
};
function build3d() {
  init3();
  if (!R3 || !MAP) return;
  const { world } = R3;
  while (world.children.length) { const c = world.children.pop(); c.geometry && c.geometry.dispose(); }
  const mesh = buildMesh(MAP.bsp, new Set([...MAP.breakables, ...MAP.movers.keys()]));
  R3.brk = {}; R3.mov = {};
  const lmTex = new THREE.DataTexture(mesh.atlas.data, mesh.atlas.w, mesh.atlas.h, THREE.RGBAFormat);
  lmTex.magFilter = THREE.LinearFilter; lmTex.minFilter = THREE.LinearFilter; lmTex.needsUpdate = true;
  const texCache = {};
  const checker = (() => { const d = new Uint8Array(16 * 16 * 4); for (let i = 0; i < 256; i++) { const c = (((i & 15) >> 3) ^ ((i >> 7) & 1)) ? 150 : 110; d[i * 4] = d[i * 4 + 1] = d[i * 4 + 2] = c; d[i * 4 + 3] = 255; } return { w: 16, h: 16, data: d }; })();
  const getTex = (name) => {
    if (texCache[name]) return texCache[name];
    const bt = MAP.bsp.textures.find((t) => t.name === name);
    const src = (bt && bt.data) ? bt : (MAP.tex[name] || checker);
    const t = new THREE.DataTexture(src.data, src.w, src.h, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter; t.minFilter = THREE.LinearMipmapLinearFilter; t.generateMipmaps = true;
    t.anisotropy = 4; t.needsUpdate = true;
    return texCache[name] = t;
  };
  for (const g of mesh.groups) {
    if (!g.pos.length) continue;
    const geo = new THREE.BufferGeometry();
    const p = g.pos; const q = new Float32Array(p.length);
    // movers are built around their own origin, then placed each frame where the demo says they are
    const mo = MAP.movers.get(g.model) || [0, 0, 0];
    for (let i = 0; i < p.length; i += 3) { q[i] = p[i] - mo[0]; q[i + 1] = p[i + 2] - mo[2]; q[i + 2] = -(p[i + 1] - mo[1]); }
    geo.setAttribute('position', new THREE.BufferAttribute(q, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(g.uv, 2));
    geo.setAttribute('uv2', new THREE.BufferAttribute(g.uv2, 2));
    const water = g.name[0] === '!';
    const see = water || g.amt < 1;
    const mat = new THREE.ShaderMaterial({
      uniforms: { map: { value: getTex(g.name) }, lm: { value: lmTex }, opacity: { value: water ? 0.7 : g.amt }, bright: { value: water ? 1.0 : 2.0 } },
      vertexShader: SHADER.vertexShader, fragmentShader: SHADER.fragmentShader,
      // one-sided like the game: a face is only drawn from the side it faces (map faces wind clockwise seen from the front,
      // which is three.js's back side). Water is drawn from both sides.
      transparent: see, depthWrite: !see, side: water ? THREE.DoubleSide : THREE.BackSide,
    });
    const m3 = new THREE.Mesh(geo, mat);
    if (g.model >= 0) (R3.brk[g.model] || (R3.brk[g.model] = [])).push(m3);
    if (MAP.movers.has(g.model)) { m3.matrixAutoUpdate = false; (R3.mov[g.model] || (R3.mov[g.model] = [])).push(m3); }
    world.add(m3);
  }
  for (const m in R3.mov) placeMover(R3.mov[m], brushPose(MAP.movers.get(+m), null));
  view3.ready = true; view3.map = MAP.name;
}
// Forget everything tied to the previous demo: who we follow, camera, markers, figures, and
// (when the map changes) the 3D level itself, so nothing from the old demo lingers on screen.
function resetForNewDemo() {
  selected = null; playing = false; wbFocus = null;
  setSpeed(1); setPlayIcon(); // every demo opens at normal speed, paused; viewing preferences stay
  flashes.length = 0; prevT = null;
  cam3.mode = 'free'; cam3.chase = null; cam3.cYaw = null;
  document.querySelectorAll('#cam3 [data-c]').forEach((x) => x.classList.toggle('on', x.dataset.c === 'free'));
  if (R3) {
    for (const e in R3.players) R3.dyn.remove(R3.players[e].g);
    R3.players = {};
    clearOverlays();
    clearRigs();
  }
  ANIM = {}; stopSounds();
  $('pov').hidden = true;
}
// remove the reused round overlays (a new round or a new demo starts a fresh set)
function clearOverlays() {
  if (!R3 || !R3.ov) return;
  for (const o of R3.ov.m.values()) { R3.scene.remove(o); if (o.geometry && !o.userData.shared) o.geometry.dispose(); o.material.dispose(); }
  R3.ov.m.clear(); R3.ov.key = null;
}
function clear3d() {
  if (!R3) return;
  while (R3.world.children.length) { const c = R3.world.children.pop(); c.geometry && c.geometry.dispose(); }
  R3.brk = {}; R3.mov = {};
  view3.ready = false; view3.map = null;
}
// Put a mover's meshes where it is: the engine's forward, left (-right) and up as the brush's axes,
// then from game space (x, y, z) to three.js space (x, z, -y).
const moverMat = new THREE.Matrix4();
function placeMover(list, ps) {
  const f = ps.f || [1, 0, 0], r = ps.r || [0, -1, 0], u = ps.u || [0, 0, 1], o = ps.o;
  // columns are the brush's local x, y, z in three.js space; local y (left) is -right
  const c = (v) => [v[0], v[2], -v[1]];
  const X = c(f), Y = c([-r[0], -r[1], -r[2]]), Z = c(u), O = c(o);
  // three.js local = (x, z, -y) of game local, so the columns are X, Z, -Y
  moverMat.set(X[0], Z[0], -Y[0], O[0], X[1], Z[1], -Y[1], O[1], X[2], Z[2], -Y[2], O[2], 0, 0, 0, 1);
  for (const m of list) { m.matrix.copy(moverMat); m.matrixWorldNeedsUpdate = true; }
}

function resetCam3() {
  if (!D || !M) return;
  // start above the middle of the action, looking down at an angle
  const S = D.stride;
  let sx = 0, sy = 0, sz = 0, n = 0;
  for (const e in D.slots) { const a = D.slots[e]; for (let i = 0; i < a.length; i += S * 40) if (!isNaN(a[i]) && a[i + 5] > 0) { sx += a[i]; sy += a[i + 1]; sz += a[i + 2]; n++; } }
  if (!n) return;
  cam3.pos = [sx / n - 1500, sy / n, sz / n + 1800]; cam3.yaw = 0; cam3.pitch = 48;
  cam3.mode = 'free'; cam3.chase = null; cam3.cYaw = null;
  document.querySelectorAll('#cam3 [data-c]').forEach((x) => x.classList.toggle('on', x.dataset.c === 'free'));
}
function copyCamToFree() {
  if (!R3) return;
  const c = R3.camera; cam3.pos = [c.position.x, -c.position.z, c.position.y];
  if (cam3.lastYaw != null) { cam3.yaw = cam3.lastYaw; cam3.pitch = cam3.lastPitch; }
}
document.querySelectorAll('#cam3 [data-c]').forEach((b) => b.onclick = () => setCam(b.dataset.c));
// Free camera chosen while following someone: start near that player instead of where the free camera was
// last left. From Behind player it takes over the view exactly; from Player's eyes it steps back behind
// their shoulder (the Behind player spot), so the player is in view. Dragging, the wheel and WASD keep the
// exact view instead, since those carry on from what's on screen.
function freeCamFromFollow() {
  if (!R3 || !selected) { copyCamToFree(); return; }
  const s = playerState(selected, T);
  if (cam3.mode !== 'eyes' || !s || s.state <= 0) { copyCamToFree(); return; }
  const head = [s.x, s.y, s.z + (s.duck ? 20 : 30)];
  const pitch = Math.max(-30, Math.min(40, s.pitch * 0.6 + 6));
  const back = fwd(s.yaw, pitch), FULL = 110;
  const far = [head[0] - back[0] * FULL, head[1] - back[1] * FULL, head[2] - back[2] * FULL + 14];
  let f = 1;
  if (MAP) { const r = solidAlong(MAP.bsp, head, far, 2, R3.broken, R3.poses); if (r.hit.length) f = Math.max(0, r.hit[0].f0 * r.len - 10) / FULL; }
  cam3.pos = head.map((v, i) => v + (far[i] - v) * f); cam3.yaw = s.yaw; cam3.pitch = pitch;
}
function setCam(m, keepPlayer, exact) {
  if (POV.on) return; // POV mode always shows the recorder's own view
  // exact: dragging, the wheel, WASD, or nobody left to follow, which carry on from the view on screen
  if (m === 'free' && cam3.mode !== 'free') { if (exact) copyCamToFree(); else freeCamFromFollow(); }
  // nobody picked, going from Free camera to Player's eyes or Behind player: follow the living player nearest
  // the middle of the free camera's view, so the view stays on the same spot (Sujan, 2 Oct 2026). Before, it
  // was the first living player in the list, wherever the camera was.
  if (m !== 'free' && !selected && cam3.mode === 'free') { const e = nearestToView(); if (e != null) { selected = e; renderPane(); } }
  // following needs a living player; keepPlayer = the caller just picked one (e.g. a kill), so don't swap them out
  if (m !== 'free' && !keepPlayer) { const s = selected && playerState(selected, T); if (!s || s.state < 0) nextPlayer(1); }
  if (m !== 'free' && !selected) nextPlayer(1);
  cam3.mode = m; cam3.chase = null; cam3.cYaw = null;
  document.querySelectorAll('#cam3 [data-c]').forEach((x) => x.classList.toggle('on', x.dataset.c === m));
}
// The living player nearest the middle of the 3D view: the smallest angle between where the camera looks and
// the player's chest. Players behind the camera only win when nobody is in front of it.
function nearestToView() {
  if (!R3 || !D) return null;
  const c = R3.camera, f = new THREE.Vector3(); c.getWorldDirection(f);
  let best = null, bestDot = -2;
  for (const e of alivePlayers()) {
    const s = playerState(e, T); if (!s) continue;
    const v = new THREE.Vector3(s.x, s.z + 20, -s.y).sub(c.position);
    if (v.lengthSq() < 1) return e;
    const d = v.normalize().dot(f);
    if (d > bestDot) { bestDot = d; best = e; }
  }
  return best;
}
function alivePlayers() { return Object.keys(D.slots).map(Number).filter((e) => { const s = playerState(e, T); return s && s.state > 0; }).sort((a, b) => ((teamOfSlot(a, T) ?? 9) - (teamOfSlot(b, T) ?? 9)) || a - b); }
function nextPlayer(dir) {
  if (POV.on) return;
  const list = alivePlayers(); if (!list.length) return;
  const i = list.indexOf(selected);
  selected = list[(i + dir + list.length) % list.length];
  renderPane();
}
$('bNextP').onclick = () => { nextPlayer(1); if (cam3.mode === 'free') setCam('eyes'); };
$('bPrevP').onclick = () => { nextPlayer(-1); if (cam3.mode === 'free') setCam('eyes'); };
const k3 = cam3.keys;
document.addEventListener('keydown', (e) => {
  if (viewMode === '2d' || !D || !$('load').hidden || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;
  const k = e.key.toLowerCase();
  if (POV.on) return;
  if (k.length === 1 && 'wasdqe'.includes(k)) { k3[k] = true; if (cam3.mode !== 'free') { setCam('free', false, true); } }
  if (e.key === 'Shift') k3.shift = true;
  if (k === 'v') setCam(cam3.mode === 'free' ? 'eyes' : cam3.mode === 'eyes' ? 'chase' : 'free');
});
document.addEventListener('keyup', (e) => { k3[e.key.toLowerCase()] = false; if (e.key === 'Shift') k3.shift = false; });
window.addEventListener('blur', () => { for (const k in k3) k3[k] = false; });

/*MODELS*/
// simple player figures (used when the model files aren't available): body, head and a gun pointing where they look
const TEAMCOL = { 1: 0xe8574d, 2: 0x5ea3e8 };
let figMats = null;
function playerFig(e) {
  if (R3.players[e]) return R3.players[e];
  if (!figMats) figMats = { 1: new THREE.MeshLambertMaterial({ color: TEAMCOL[1] }), 2: new THREE.MeshLambertMaterial({ color: TEAMCOL[2] }), sel: new THREE.MeshLambertMaterial({ color: 0xcbb47e }), gun: new THREE.MeshLambertMaterial({ color: 0x1e1e1e }) };
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(11, 13, 1, 12), figMats[1]);
  const head = new THREE.Mesh(new THREE.SphereGeometry(7, 12, 8), figMats[1]);
  const gun = new THREE.Mesh(new THREE.BoxGeometry(28, 3, 3), figMats.gun);
  g.add(body, head, gun);
  // see-through copies for "See through walls", following the body and head they belong to
  const gb = new THREE.Mesh(body.geometry, ghostMat(1)), gh = new THREE.Mesh(head.geometry, ghostMat(1));
  for (const x of [gb, gh]) { x.renderOrder = 5; x.visible = false; }
  body.add(gb); head.add(gh);
  R3.dyn.add(g);
  return R3.players[e] = { g, body, head, gun, ghosts: [gb, gh] };
}
function lineMesh(a, b, color, dashed, opacity = 1) {
  const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
  const mat = dashed ? new THREE.LineDashedMaterial({ color, dashSize: 12, gapSize: 8, transparent: true, opacity, depthTest: false }) : new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthTest: false });
  const l = new THREE.Line(geo, mat); if (dashed) l.computeLineDistances(); l.renderOrder = 10;
  return l;
}
const geoCache = {};
const sphere = (r) => geoCache['s' + r] || (geoCache['s' + r] = new THREE.SphereGeometry(r, 14, 10));
let lastFrame3 = performance.now();
function update3() {
  if (!R3 || !D || viewMode === '2d') return;
  const now = performance.now(); const rawDt = (now - lastFrame3) / 1000; const dt = Math.min(0.1, rawDt); lastFrame3 = now;
  qualityTick(rawDt);
  const { camera, renderer } = R3;
  const r = roundAt(T);
  // breakables: hide the ones that have been shot out at this moment
  if (R3.brk) for (const m in R3.brk) { const vis = !brokenAt(+m, T); for (const x of R3.brk[m]) x.visible = vis; }
  // doors and other movers: where the demo says they are right now (open, closed or halfway)
  R3.poses = posesAt(T); R3.broken = brokenSet(T);
  if (R3.mov && MAP) for (const m in R3.mov) placeMover(R3.mov[m], R3.poses.get(+m) || brushPose(MAP.movers.get(+m), null));
  // players
  const lab = [];
  beginRigs();
  const lying = drawCorpses(r);
  for (const e in D.slots) {
    const s = playerState(+e, T);
    const f = R3.players[e];
    // also hidden when the free camera sits inside someone's head (after dragging out of Player's eyes)
    const hideSelf = (+e === selected && (cam3.mode === 'eyes' || (cam3.mode === 'chase' && cam3.chaseDist != null && cam3.chaseDist < 12)))
      || (cam3.mode === 'free' && s && s.state > 0 && Math.hypot(cam3.pos[0] - s.x, cam3.pos[1] - s.y, cam3.pos[2] - s.z - 17) < 24);
    if (!s || s.state < 0) {
      if (f) f.g.visible = false;
      // falling down: the player's own death animation plays until the game swaps in the corpse
      if (s && !lying.has(+e) && isDeathSeq(+e) && !(+e === selected && cam3.mode !== 'free')) drawModelPlayer(+e, s, false);
      continue;
    }
    // behind a wall, as last checked (about 10 times a second, in the labels pass below)
    const vc = R3.vis && R3.vis.get(+e);
    const ghost = opts.xray && !hideSelf && !!(vc && vc.hidden);
    if (drawModelPlayer(+e, s, hideSelf, ghost)) {
      if (f) f.g.visible = false;
      const top = s.z + (s.duck ? 26 : 44);
      lab.push({ e: +e, s, p: g3(s.x, s.y, top + 10) });
      continue;
    }
    const fig = playerFig(e);
    fig.g.visible = !hideSelf;
    const h = s.duck ? 36 : 54, feet = s.z - (s.duck ? 18 : 36);
    fig.body.material = fig.head.material = (+e === selected && cam3.mode === 'free') ? figMats.sel : figMats[s.state];
    fig.body.scale.y = h; fig.body.position.set(0, feet + h / 2, 0);
    fig.head.position.set(0, feet + h + 6, 0);
    const yr = s.yaw * Math.PI / 180, pr = s.pitch * Math.PI / 180;
    fig.gun.position.set(Math.cos(yr) * 16, s.z + (s.duck ? 6 : 12), -Math.sin(yr) * 16);
    fig.gun.rotation.set(0, yr, -pr, 'YXZ');
    for (const x of fig.ghosts) { x.visible = ghost; x.material = ghostMat(s.state); }
    fig.g.position.set(s.x, 0, -s.y);
    lab.push({ e: +e, s, p: g3(s.x, s.y, feet + h + 20) });
  }
  endRigs();
  // round overlays (death marks, kill lines, the bomb, grenades, smokes): each one is made once and then
  // reused, moved or faded every frame; whatever isn't needed this frame is just hidden
  const OVL = R3.ov || (R3.ov = { m: new Map(), used: new Set(), key: null });
  const rkey = D.fileName + '|' + (r ? r.n : '-');
  if (OVL.key !== rkey) { clearOverlays(); OVL.key = rkey; }
  OVL.used.clear();
  const ov = (key, make) => { let o = OVL.m.get(key); if (!o) { o = make(); OVL.m.set(key, o); R3.scene.add(o); } o.visible = true; OVL.used.add(key); return o; };
  if (r) for (let ki = 0; ki < r.kills.length; ki++) {
    const k = r.kills[ki];
    // a position with a part missing (a player whose height the snapshot never sent) draws nothing rather than a line to nowhere
    if (k.t > T || !k.vpos || !k.vpos.every(Number.isFinite)) continue;
    const age = T - k.t;
    const c = k.vteam === 'TERRORIST' ? 0xe8574d : 0x5ea3e8, z = k.vpos[2] - (k.vduck ? 16 : 34);
    ov('x1:' + ki, () => lineMesh(g3(k.vpos[0] - 10, k.vpos[1] - 10, z), g3(k.vpos[0] + 10, k.vpos[1] + 10, z), c));
    ov('x2:' + ki, () => lineMesh(g3(k.vpos[0] + 10, k.vpos[1] - 10, z), g3(k.vpos[0] - 10, k.vpos[1] + 10, z), c));
    const life = k.wb ? 6 : 2.5;
    if (opts.lines && k.kpos && k.kpos.every(Number.isFinite) && k.killer !== k.victim && age < life) {
      const eye = k.wb ? k.wb.eye : [k.kpos[0], k.kpos[1], k.kpos[2] + (k.kduck ? 12 : 17)];
      const l = ov('kl:' + ki, () => lineMesh(g3(eye[0], eye[1], eye[2]), g3(k.vpos[0], k.vpos[1], k.vpos[2] + (k.vduck ? 4 : 10)), k.wb ? 0xff4fd8 : 0xff9a3c, !!k.wb));
      l.material.opacity = 1 - age / life;
    }
  }
  if (r) {
    const bp = D.bomb.find((b) => b.type === 'plantpos' && b.t >= r.start && b.t <= T && b.t <= r.end);
    if (bp) ov('c4', () => { const c4 = new THREE.Mesh(sphere(6), new THREE.MeshBasicMaterial({ color: 0xff9a3c })); c4.userData.shared = true; return c4; }).position.copy(g3(bp.pos[0], bp.pos[1], bp.pos[2] + 4));
  }
  if (opts.nades) for (let gi = 0; gi < M.nades.length; gi++) {
    const g = M.nades[gi];
    if (T < g.t0 || T > g.t1 + 1) continue;
    const p = g.pts;
    const col = g.type === 'he' ? 0xff9a3c : g.type === 'flash' ? 0xf2f0e6 : 0x9fd88a;
    if (g.type === 'smoke' && T >= g.stop) {
      const fade = Math.max(0, Math.min(1, (T - g.stop) / 1.5) * Math.min(1, (g.t1 - T) / 2 + 0.2));
      const sm = ov('sm:' + gi, () => {
        let k = 0; for (let i = 0; i < p.length; i += 4) if (p[i] >= g.stop) { k = i; break; }
        const c = g.cloud || [p[k + 1], p[k + 2], p[k + 3]];
        const m = new THREE.Mesh(sphere(115), new THREE.MeshLambertMaterial({ color: 0xb2dca2, transparent: true, opacity: 0, depthWrite: false }));
        m.userData.shared = true; m.scale.y = 0.6; m.position.copy(g3(c[0], c[1], c[2] + 40)); return m;
      });
      sm.material.opacity = 0.85 * fade;
      continue;
    }
    if (T > g.t1) {
      if (g.type === 'smoke') continue;
      const b = ov('bu:' + gi, () => {
        const m = new THREE.Mesh(sphere(g.type === 'he' ? 90 : 40), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0, depthWrite: false }));
        m.userData.shared = true; m.position.copy(g3(p[p.length - 3], p[p.length - 2], p[p.length - 1])); return m;
      });
      b.material.opacity = (1 - (T - g.t1)) * 0.6;
      continue;
    }
    // the path so far: one line holding the whole flight, drawn up to the latest point
    let cnt = 0; while (cnt * 4 < p.length && p[cnt * 4] <= T) cnt++;
    if (cnt > 1) {
      const ln = ov('tr:' + gi, () => {
        const arr = new Float32Array(p.length / 4 * 3);
        for (let i = 0, o = 0; i < p.length; i += 4, o += 3) { arr[o] = p[i + 1]; arr[o + 1] = p[i + 3]; arr[o + 2] = -p[i + 2]; }
        const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
        const l = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: col })); l.frustumCulled = false; return l;
      });
      ln.geometry.setDrawRange(0, cnt);
    }
    if (cnt) ov('hd:' + gi, () => { const h = new THREE.Mesh(sphere(3), new THREE.MeshBasicMaterial({ color: col })); h.userData.shared = true; return h; }).position.copy(g3(p[(cnt - 1) * 4 + 1], p[(cnt - 1) * 4 + 2], p[(cnt - 1) * 4 + 3]));
  }
  for (const [key, o] of OVL.m) if (!OVL.used.has(key)) o.visible = false;

  // camera
  if (POV.on) {
    // POV mode: the camera exactly as the recorder's game drew it, zoom included (his scope from SetFOV)
    const v = povFollow(T);
    const fov = POV.who === v.rec ? povFov(T) : 90;
    camera.fov = 2 * Math.atan(Math.tan(fov * Math.PI / 360) / camera.aspect) * 180 / Math.PI;
    placeCam(v.pos, v.yaw, v.pitch);
  } else if (cam3.mode === 'free') {
    const sp = (k3.shift ? 1500 : 550) * dt;
    const ff = fwd(cam3.yaw, cam3.pitch), rt = [Math.sin(cam3.yaw * Math.PI / 180), -Math.cos(cam3.yaw * Math.PI / 180)];
    if (k3.w) for (let i = 0; i < 3; i++) cam3.pos[i] += ff[i] * sp;
    if (k3.s) for (let i = 0; i < 3; i++) cam3.pos[i] -= ff[i] * sp;
    if (k3.d) { cam3.pos[0] += rt[0] * sp; cam3.pos[1] += rt[1] * sp; }
    if (k3.a) { cam3.pos[0] -= rt[0] * sp; cam3.pos[1] -= rt[1] * sp; }
    if (k3.e) cam3.pos[2] += sp;
    if (k3.q) cam3.pos[2] -= sp;
    camera.fov = 70;
    placeCam(cam3.pos, cam3.yaw, cam3.pitch);
  } else if (!selected) {
    // nobody to follow any more: hand control back to the free camera where we are
    setCam('free', false, true);
    placeCam(cam3.pos, cam3.yaw, cam3.pitch);
  } else {
    const s = selected && playerState(selected, T);
    if (s && s.state > 0) {
      if (cam3.mode === 'eyes') {
        // CS 1.6 uses a 90 degree horizontal field of view
        camera.fov = 2 * Math.atan(Math.tan(Math.PI / 4) / camera.aspect) * 180 / Math.PI;
        // zoomed in with a sniper rifle: narrower view, like the game's scope
        const zl = zoomLevel(selected, T), zw = SNIPERS[weaponShort(s.weapon)];
        if (zl && zw) camera.fov = 2 * Math.atan(Math.tan(zw.fov[zl] * Math.PI / 360) / camera.aspect) * 180 / Math.PI;
        const yaw = s.yaw, pitch = s.pitch;
        placeCam([s.x, s.y, s.z + (s.duck ? 12 : 17)], yaw, pitch);
      } else {
        camera.fov = 70;
        const b = fwd(s.yaw, 0);
        // like the in-game chase camera: an arm behind the player's head. The arm's direction
        // follows the player's view smoothly; its length shortens instantly when a wall is in the
        // way and grows back slowly, so the camera never bounces in and out.
        const head = [s.x, s.y, s.z + (s.duck ? 20 : 30)];
        const pitchC = Math.max(-30, Math.min(40, s.pitch * 0.6 + 6));
        if (cam3.cYaw == null || cam3.cFor !== selected) { cam3.cYaw = s.yaw; cam3.cPitch = pitchC; cam3.cLen = 110; cam3.cFor = selected; }
        let dy = s.yaw - cam3.cYaw; while (dy > 180) dy -= 360; while (dy < -180) dy += 360;
        const k = Math.min(1, dt * 12);
        cam3.cYaw += dy * k; cam3.cPitch += (pitchC - cam3.cPitch) * k;
        const back = fwd(cam3.cYaw, cam3.cPitch);
        const FULL = 110;
        const far = [head[0] - back[0] * FULL, head[1] - back[1] * FULL, head[2] - back[2] * FULL + 14];
        let allow = FULL;
        if (MAP) {
          const r = solidAlong(MAP.bsp, head, far, 2, R3.broken, R3.poses);
          if (r.hit.length) allow = Math.max(0, r.hit[0].f0 * r.len - 10);
        }
        if (allow < cam3.cLen) cam3.cLen = allow;               // pull in at once
        else cam3.cLen += (allow - cam3.cLen) * Math.min(1, dt * 2.5); // ease back out
        const f = cam3.cLen / FULL;
        const camPos = head.map((v, i) => v + (far[i] - v) * f);
        cam3.chaseDist = cam3.cLen;
        placeCam(camPos, cam3.cYaw, cam3.cPitch);
      }
    } else {
      // death cam: the view drops to the floor and turns toward whoever made the kill
      const death = D.kills.filter((k) => k.victim === selected && k.t <= T + 0.05).pop();
      if (death && death.vpos) {
        const age = Math.max(0, T - death.t);
        const before = playerState(selected, death.t - 0.05);
        const yaw0 = before ? before.yaw : 0, pitch0 = before ? before.pitch : 0;
        const eyeZ = death.vpos[2] + (death.vduck ? 12 : 17);
        const fall = Math.min(1, age / 0.6), turn = Math.min(1, age / 0.9);
        const ease = (x) => 1 - Math.pow(1 - x, 3);
        const z = eyeZ + ((death.vpos[2] - (death.vduck ? 12 : 28)) - eyeZ) * ease(fall);
        let yaw1 = yaw0, pitch1 = pitch0;
        if (death.kpos && death.killer !== death.victim) {
          yaw1 = Math.atan2(death.kpos[1] - death.vpos[1], death.kpos[0] - death.vpos[0]) * 180 / Math.PI;
          pitch1 = -Math.atan2(death.kpos[2] + 17 - z, Math.hypot(death.kpos[0] - death.vpos[0], death.kpos[1] - death.vpos[1])) * 180 / Math.PI;
        }
        let dy = yaw1 - yaw0; while (dy > 180) dy -= 360; while (dy < -180) dy += 360;
        camera.fov = 2 * Math.atan(Math.tan(Math.PI / 4) / camera.aspect) * 180 / Math.PI;
        placeCam([death.vpos[0], death.vpos[1], z], yaw0 + dy * ease(turn), pitch0 + (pitch1 - pitch0) * ease(turn));
      }
    }
  }
  camera.updateProjectionMatrix();
  renderer.render(R3.scene, camera);
  // the gun in hand isn't shown while looking through the scope, as in the game
  const scoped = POV.on ? (POV.who != null && POV.who === POV.v.rec && povFov(T) < 90 && (() => { const ss = playerState(POV.who, T); return ss && SNIPERS[weaponShort(ss.weapon)]; })())
    : cam3.mode === 'eyes' && selected && zoomLevel(selected, T) > 0 && (() => { const ss = playerState(selected, T); return ss && ss.state > 0 && SNIPERS[weaponShort(ss.weapon)]; })();
  // POV mode: no gun in hand while watching from a free or chase spectator camera
  if (cam3.mode === 'eyes' && selected && !scoped && (!POV.on || POV.who != null)) drawViewModel(renderer, camera, selected, playerState(selected, T));

  // name labels on a 2D overlay
  const lc = $('lbl'), lx = lc.getContext('2d');
  lx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const W = lc.width / dpr, H = lc.height / dpr;
  lx.clearRect(0, 0, W, H);
  const mono = monoFont();
  const camW = [camera.position.x, -camera.position.z, camera.position.y];
  let visBudget = 3; // routine re-checks this frame; the rest wait a frame or two
  // Which players are behind walls, for "See through walls" (their bodies are drawn on top of the walls)
  // and for the names (hidden players get no name unless "See through walls" is on). The check traces lines
  // through the map, so each player is re-checked about 10 times a second (and at once after a camera switch
  // or a jump in time), not on every frame.
  if (opts.names || opts.xray) for (const L of lab) {
    if (cam3.mode === 'eyes' && L.e === selected) continue;
    const v = L.p.clone().project(camera);
    if (v.z > 1 || v.z < -1) continue;
    let hidden = false;
    if (MAP) {
      const vis = R3.vis || (R3.vis = new Map());
      const ck = cam3.mode + '|' + selected;
      let c = vis.get(L.e);
      const forced = !c || c.ck !== ck || Math.abs(T - c.t) > 0.5;
      if (forced || (now - c.at > 100 && visBudget-- > 0)) {
        const s = L.s, headZ = s.z + (s.duck ? 12 : 24);
        // a free camera floating above the map starts outside the level, which counts as solid: ignore that first stretch
        const blocked = (to) => { const r = solidAlong(MAP.bsp, camW, to, 4, R3.broken, R3.poses); return r.hit.some((h, i) => !(i === 0 && h.f0 * r.len <= 8)); };
        c = { at: now, ck, t: T, hidden: blocked([s.x, s.y, headZ]) && blocked([s.x, s.y, s.z]) };
        vis.set(L.e, c);
      }
      hidden = c.hidden;
    }
    if (!opts.names || (hidden && !opts.xray)) continue;
    const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H;
    const dist = camera.position.distanceTo(L.p);
    const nm = nameAt(L.e, T);
    lx.font = `500 ${dist < 1500 ? 12 : 10}px ${mono}`; lx.textAlign = 'center';
    lx.lineWidth = 3; lx.strokeStyle = 'rgba(8,10,12,.85)';
    lx.strokeText(nm, sx, sy); lx.fillStyle = L.e === selected ? COL.sand : sideCol(L.s.state); lx.fillText(nm, sx, sy);
    const w = weaponShort(L.s.weapon), hpv = hpAt(L.e, T);
    const sub = [hpv != null ? hpv + ' hp' : '', w].filter(Boolean).join(' · ');
    if (sub) { // at any distance, scoped or not (the 2500-unit limit was dropped in 0.16.0, Sujan)
      lx.font = `400 10px ${mono}`; lx.strokeText(sub, sx, sy + 12); lx.fillStyle = '#d8d3c8'; lx.fillText(sub, sx, sy + 12); }
  }
  drawKillRings(lx, W, H, camera);
  const pov = $('pov');
  const s = selected && playerState(selected, T);
  if (cam3.mode !== 'free' && s && s.state > 0) {
    pov.hidden = false; pov.classList.remove("dead");
    const hpv = hpAt(selected, T);
    pov.innerHTML = `<span class="${s.state === 1 ? 'kt' : 'kct'}">${esc(nameAt(selected, T))}</span>${hpv != null ? ` <b>(${hpv})</b>` : ''}<span class="kw">${esc(weaponShort(s.weapon))}</span>`;
    if (scoped) drawScope(lx, W, H);
    if (cam3.mode === 'eyes') drawHitMarker(lx, W / 2, H / 2);
    if (cam3.mode === 'eyes' && !scoped) { lx.strokeStyle = 'rgba(90,255,90,.85)'; lx.lineWidth = 1.5; const cx = W / 2, cy = H / 2; lx.beginPath(); lx.moveTo(cx - 12, cy); lx.lineTo(cx - 4, cy); lx.moveTo(cx + 4, cy); lx.lineTo(cx + 12, cy); lx.moveTo(cx, cy - 12); lx.lineTo(cx, cy - 4); lx.moveTo(cx, cy + 4); lx.lineTo(cx, cy + 12); lx.stroke(); }
  } else if (cam3.mode !== 'free' && selected) {
    const death = D.kills.filter((k) => k.victim === selected && k.t <= T + 0.05).pop();
    if (death) {
      // red wash over the view that fades to a steady tint, like taking the final hit
      const age = Math.max(0, T - death.t);
      // POV mode: the view is the spectator camera he watched through, so the wash only flashes at the death
      const a = POV.on ? Math.max(0, 0.6 - age * 0.6) : Math.max(0.3, 0.8 - age * 0.35);
      const g = lx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.15, W / 2, H / 2, Math.max(W, H) * 0.7);
      g.addColorStop(0, `rgba(120,0,0,${a * 0.35})`); g.addColorStop(1, `rgba(150,0,0,${a})`);
      lx.fillStyle = g; lx.fillRect(0, 0, W, H);
      const rr = M.rounds.find((r) => r.n === death.round);
      const kside = rr && rr.tTeam != null && death.kp ? (M.teamOf[death.kp] === rr.tTeam ? 'kt' : 'kct') : '';
      const kn = death.kp && death.killer !== death.victim
        ? `killed by <span class="${kside}">${esc(M.pl[death.kp].name)}</span> · ${esc(death.weapon)}${death.hs ? ' · <span class="khs">HS</span>' : ''}${death.wb ? ' · <span class="kwb">wallbang</span>' : ''}`
        : (death.weapon === 'world' ? 'died' : 'killed themselves');
      pov.hidden = false; pov.classList.add('dead');
      pov.innerHTML = `<b>${esc(nameAt(selected, T))}</b> ${kn}${POV.on ? '' : ` <span class="kw">· ${playing && age < 2.5 ? 'switching to a teammate' : 'press X for the next player'}</span>`}`;
    } else { pov.hidden = false; pov.classList.add('dead'); pov.innerHTML = `<span class="kw">${esc(nameAt(selected, T))} is dead.${POV.on ? '' : ' Press X for the next player.'}</span>`; }
    // like CS spectating: after a moment, follow a living teammate (or anyone alive)
    if (death && T - death.t > 2.5 && playing) {
      const alive = alivePlayers();
      const mates = alive.filter((e) => teamOfSlot(e, T) === teamOfSlot(selected, T));
      const pick = (mates.length ? mates : alive)[0];
      if (pick) { selected = pick; renderPane(); }
    }
  } else pov.hidden = true;
}
// Hit marker on the crosshair when the player you're watching gets a kill:
// white for a kill, orange for a headshot, magenta for a wallbang, with a short label underneath
// (the label says which, so colour isn't the only cue).
function drawHitMarker(lx, cx, cy) {
  const f = flashes.filter((x) => x.k.killer === selected).pop();
  if (!f) return;
  const a = (performance.now() - f.at) / FLASH_MS; if (a >= 1) return;
  const k = f.k;
  const col = k.wb ? '#ff4fd8' : k.hs ? '#ff9a3c' : '#ffffff';
  const g0 = 7 + a * 5, g1 = g0 + 9;
  lx.save();
  lx.globalAlpha = a < 0.6 ? 1 : 1 - (a - 0.6) / 0.4;
  lx.lineCap = 'round';
  for (const [w, c] of [[5, 'rgba(0,0,0,.6)'], [2.5, col]]) {
    lx.strokeStyle = c; lx.lineWidth = w; lx.beginPath();
    for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) { lx.moveTo(cx + dx * g0, cy + dy * g0); lx.lineTo(cx + dx * g1, cy + dy * g1); }
    lx.stroke();
  }
  const label = k.wb ? `WALLBANG${k.hs ? ' · HS' : ''}` : k.hs ? 'HEADSHOT' : 'KILL';
  lx.font = `600 11px ${monoFont()}`; lx.textAlign = 'center';
  lx.lineWidth = 3; lx.strokeStyle = 'rgba(0,0,0,.7)'; lx.strokeText(label, cx, cy + 42); lx.fillStyle = col; lx.fillText(label, cx, cy + 42);
  lx.restore();
}
// The sniper scope over Player's eyes. Three styles exist; the viewer uses SCOPE_STYLE and has no menu
// option for it (decided 1 Oct 2026: a choice of scopes would clutter the menu). See IDEAS.md and
// docs/scope-designs.png.
//   'game':  like CS 1.6: thin lines, mil-dots along both lines, a red dot in the middle (used since 0.10.1)
//   'clean': lines and the red dot, no mil-dots, so dark player models aren't covered by dots
//   'lines': lines only, no dots (0.10.0)
const SCOPE_STYLE = 'game';
function drawScope(lx, W, H) {
  const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.46, style = SCOPE_STYLE;
  lx.save();
  lx.fillStyle = '#000';
  lx.beginPath(); lx.rect(0, 0, W, H); lx.arc(cx, cy, r, 0, Math.PI * 2, true); lx.fill('evenodd');
  lx.strokeStyle = '#000'; lx.lineWidth = style === 'game' ? 1 : 1.5;
  lx.beginPath(); lx.moveTo(cx - r, cy); lx.lineTo(cx + r, cy); lx.moveTo(cx, cy - r); lx.lineTo(cx, cy + r); lx.stroke();
  lx.lineWidth = 2; lx.beginPath(); lx.arc(cx, cy, r, 0, Math.PI * 2); lx.stroke();
  if (style === 'game') {
    // mil-dots: six along each half of both lines, evenly spaced from the middle
    lx.fillStyle = '#000';
    const step = r * 0.075, dot = Math.max(2, r * 0.0065);
    for (let i = 1; i <= 6; i++) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { lx.beginPath(); lx.arc(cx + dx * i * step, cy + dy * i * step, dot, 0, Math.PI * 2); lx.fill(); }
  }
  if (style !== 'lines') { lx.fillStyle = '#ff2a1f'; lx.beginPath(); lx.arc(cx, cy, Math.max(2, r * 0.0065), 0, Math.PI * 2); lx.fill(); }
  lx.restore();
}
// A ring that bursts out from the victim in 3D, for every kill
function drawKillRings(lx, W, H, camera) {
  for (const f of flashes) {
    const k = f.k; if (!k.vpos) continue;
    const a = (performance.now() - f.at) / FLASH_MS; if (a >= 1) continue;
    const v = g3(k.vpos[0], k.vpos[1], k.vpos[2] + 6).project(camera);
    if (v.z > 1 || v.z < -1) continue;
    const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H;
    lx.globalAlpha = 1 - a; lx.lineWidth = 3;
    lx.strokeStyle = k.wb ? '#ff4fd8' : k.hs ? '#ff9a3c' : '#ffffff';
    lx.beginPath(); lx.arc(sx, sy, 6 + a * 28, 0, 7); lx.stroke();
    lx.globalAlpha = 1;
  }
}

function placeCam(p, yaw, pitch) {
  const c = R3.camera; c.position.copy(g3(p[0], p[1], p[2]));
  const f = fwd(yaw, pitch);
  c.up.set(0, 1, 0);
  c.lookAt(g3(p[0] + f[0], p[1] + f[1], p[2] + f[2]));
  cam3.lastYaw = yaw; cam3.lastPitch = pitch;
}

// ---------------- POV mode (wip/pov-mode) ----------------
// A demo recorded by a player plays through his own eyes, the way the game plays it back: the camera his game
// drew, read from the view block written before every frame (about 100 a second, D.view, see VIEW_STRIDE in the
// reader). It holds his exact aim with the recoil kick in it, and after he dies, the spectator camera he
// watched through. No free camera and no other players' eyes: the file only has players near him (Sujan, 3 Oct 2026).
const POV = { on: false, i: 0 };
// The recorder's own shots, in order: time, weapon id, silenced (1 or 0). A shot is his gun's round count going
// down by 1 to 3 with the same gun in hand (CurWeapon). Whether an M4A1 or USP had its silencer on comes from
// the last animation his game played on it (demo frame type 7): the silenced and unsilenced versions are
// separate sequences in v_m4a1.mdl and v_usp.mdl. Each animation belongs to the gun model in his hands 0.05 s
// after it (his own state's viewmodel; the animation comes a moment before the model at a switch). Checked on
// Match 1 CT (de_barcelona, 27 Mar 2025), 3 Oct 2026: 25 of 989 animations land on a model without that
// sequence (97.5% fit, against 154 wrong when credited 0.1 s earlier). A gun with neither yet: unsilenced, as the
// game hands them out.
const SIL_SEQ = { v_m4a1: { id: 22, on: [0, 1, 2, 3, 4, 5, 6], off: [7, 8, 9, 10, 11, 12, 13] }, v_usp: { id: 16, on: [0, 1, 2, 3, 4, 5, 6, 7], off: [8, 9, 10, 11, 12, 13, 14, 15] } };
function povShots() {
  const A = D.ownAmmo || [], W = D.wanims || [], VM = D.vmodels || [], out = [];
  const vmName = (t) => { let lo = 0, hi = VM.length / 2 - 1, r = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (VM[m * 2] <= t) { r = m; lo = m + 1; } else hi = m - 1; } return r < 0 ? '' : (D.models[VM[r * 2 + 1]] || '').replace(/^models\//, '').replace(/\.mdl$/, ''); };
  const sil = {}; let w = 0;
  for (let i = 0; i < A.length; i += 3) {
    const t = A[i], id = A[i + 1], clip = A[i + 2];
    for (; w < W.length && W[w] <= t; w += 2) {
      const sq = SIL_SEQ[vmName(W[w] + 0.05)];
      if (sq) { if (sq.on.includes(W[w + 1])) sil[sq.id] = 1; else if (sq.off.includes(W[w + 1])) sil[sq.id] = 0; }
    }
    if (i && A[i - 2] === id && clip < A[i - 1] && A[i - 1] - clip <= 3) out.push(t, id, sil[id] || 0);
  }
  return new Float32Array(out);
}
function povInit() {
  POV.on = !!(D && D.pov && D.view && D.view.length >= D.viewStride * 2);
  POV.i = 0;
  D.ownShots = POV.on ? povShots() : null;
  // the camera buttons that pick another view or player go; Team colours and Quality stay
  for (const id of ['free', 'eyes', 'chase']) { const b = document.querySelector(`#cam3 [data-c="${id}"]`); if (b) b.hidden = POV.on; }
  $('bPrevP').hidden = POV.on; $('bNextP').hidden = POV.on;
  if (POV.on) { cam3.mode = 'eyes'; cam3.chase = null; cam3.cYaw = null; povFollow(T); }
}
// The view at time t, between the two frames around it. Angles turn the short way round. Across a jump (a
// respawn, a teleport, the gap between two joined files) there's nothing to blend, so the earlier frame is kept.
function povView(t) {
  const V = D.view, n = D.viewStride, N = V.length / n;
  let i = Math.min(POV.i, N - 1);
  if (V[i * n] > t) { let lo = 0, hi = i; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (V[m * n] <= t) lo = m; else hi = m - 1; } i = lo; }
  else while (i < N - 1 && V[(i + 1) * n] <= t) i++;
  POV.i = i;
  const a = i * n, b = Math.min(i + 1, N - 1) * n;
  const span = V[b] - V[a];
  let f = span > 0 && span < 0.25 ? Math.max(0, Math.min(1, (t - V[a]) / span)) : 0;
  if (Math.hypot(V[b + 1] - V[a + 1], V[b + 2] - V[a + 2], V[b + 3] - V[a + 3]) > 64) f = 0;
  const L = (k) => V[a + k] + (V[b + k] - V[a + k]) * f;
  const LA = (k) => { let d = V[b + k] - V[a + k]; d = ((d % 360) + 540) % 360 - 180; return V[a + k] + d * f; };
  return { pos: [L(1), L(2), L(3)], pitch: LA(4), yaw: LA(5), punch: [V[a + 7], V[a + 8]], rec: V[a + 17] + 1, t: V[a] };
}
// Whose eyes the view is: the recorder while he's alive; after he dies, the player he spectated in first
// person (the camera sits at that player's eyes, looking his way), or nobody when he watched from a free or
// chase spectator camera. Kept in `selected`, so the gun in hand, the name at the bottom and the hidden body
// all follow the right player, and the right panel highlights him.
function povFollow(t) {
  const v = povView(t);
  const rs = playerState(v.rec, t);
  let who = null;
  if (rs && rs.state > 0) who = v.rec;
  else {
    let best = 40;
    for (const e in D.slots) {
      const s = playerState(+e, t); if (!s || !(s.state > 0)) continue;
      const d = Math.hypot(s.x - v.pos[0], s.y - v.pos[1], s.z + (s.duck ? 12 : 17) - v.pos[2]);
      const dy = Math.abs(((s.yaw - v.yaw) % 360 + 540) % 360 - 180);
      if (d < best && dy < 25) { best = d; who = +e; }
    }
  }
  POV.who = who; POV.v = v;
  const sel = who != null ? who : v.rec;
  if (selected !== sel) { selected = sel; if (typeof renderPane === 'function') renderPane(); }
  return v;
}
// The recorder's zoom at time t (field of view, 90 when not zoomed), from the SetFOV messages
function povFov(t) {
  const F = D.fovs; if (!F || !F.length) return 90;
  let lo = 0, hi = F.length / 2 - 1, r = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (F[m * 2] <= t) { r = m; lo = m + 1; } else hi = m - 1; }
  const v = r >= 0 ? F[r * 2 + 1] : 90;
  return v > 0 && v < 90 ? v : 90;
}
