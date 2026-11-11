// A kill frame by frame in Player's eyes (25 Oct 2026, gob b on Xizt, fnatic vs mousesports, Forge, IEM6 Guangzhou,
// R14 1:05: 223 pixels in the picture check, hidden by Sujan's eye at the kill feed). For each moment around the
// kill (window.__offs, seconds from the kill message) it draws the killer's own view as the viewer shows it (the
// 3D view's camera and size, paused), and the same view with the victim's body in flat magenta, counting his
// pixels past the walls; returns PNG data URLs and where the victim sits on screen. Also the picture check's own
// count for the kill. window.__want = {tag: 'R14 1:05', killer: 'gob'}. Run with DEMO=... (waits for the map).
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  while ((M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null)) && Date.now() - t0 < 600000) await wait(500);
  const w = window.__want;
  const k = D.kills.find((k) => { const r = M.rounds.find((x) => x.n === k.round); return r && `R${r.ln} ${clockText(k.t)}` === w.tag && M.pl[k.kp] && M.pl[k.kp].name.includes(w.killer); });
  if (!k) return { missing: w };
  setView('3d'); await wait(1500);
  playing = false; selected = k.killer; T = k.t; prevT = T; setCam('eyes', true); await wait(1200);
  const cv = $('gl'); const W = cv.width, H = cv.height;
  const rt = new THREE.WebGLRenderTarget(W, H);
  const MAG = new THREE.MeshBasicMaterial({ color: 0xff00ff, fog: false, side: THREE.DoubleSide });
  const buf = new Uint8Array(W * H * 4);
  const c2 = document.createElement('canvas'); c2.width = W; c2.height = H; const cx = c2.getContext('2d');
  const shot = () => { R3.renderer.readRenderTargetPixels(rt, 0, 0, W, H, buf); const im = cx.createImageData(W, H); for (let y = 0; y < H; y++) im.data.set(buf.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4); cx.putImageData(im, 0, 0); return c2.toDataURL('image/png'); };
  const out = [];
  for (const off of window.__offs || [-0.1, -0.05, 0, 0.02, 0.05]) {
    T = k.t + off; prevT = T; playing = false;
    await wait(700); update3();
    const cam = R3.camera;
    R3.renderer.setRenderTarget(rt); R3.renderer.render(R3.scene, cam); R3.renderer.setRenderTarget(null);
    const normal = shot();
    const pr = R3.rigs['p' + k.victim];
    let n = -1, magenta = null, sx = null, sy = null, seq = null;
    if (pr && pr.g.visible) {
      const mats = pr.parts.map((p) => p.mesh.material); for (const p of pr.parts) p.mesh.material = MAG;
      const hidden = []; for (const key in R3.rigs) { const r = R3.rigs[key]; if (r !== pr && r.g.visible) { r.g.visible = false; hidden.push(r.g); } }
      R3.renderer.setRenderTarget(rt); R3.renderer.render(R3.scene, cam); R3.renderer.setRenderTarget(null);
      R3.renderer.readRenderTargetPixels(rt, 0, 0, W, H, buf); n = 0; for (let i = 0; i < buf.length; i += 4) if (buf[i] > 245 && buf[i + 1] < 12 && buf[i + 2] > 245) n++;
      magenta = shot();
      pr.parts.forEach((p, i) => { p.mesh.material = mats[i]; }); for (const g of hidden) g.visible = true;
      const vs = playerState(k.victim, T); const v = g3(vs.x, vs.y, vs.z + 20).project(cam); sx = Math.round((v.x + 1) / 2 * W); sy = Math.round((1 - v.y) / 2 * H);
      const a = D.slots[k.victim]; seq = a[M.idxAt(T) * D.stride + 9];
    }
    out.push({ off, n, sx, sy, seq, feed: $('feed').textContent.slice(0, 80), normal, magenta });
  }
  return { tag: w.tag, killer: M.pl[k.kp].name, victim: M.pl[k.vp].name, seenPx: k.seenPx, W, H, dpr: devicePixelRatio, fov: R3.camera.fov, frames: out };
})()
