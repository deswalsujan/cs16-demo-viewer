// The killer's view of the victim at a wallbang, for judging by eye (23 Oct 2026): from the eye the finder
// uses, looking at the victim, at the killing shot and 0.1 s before it. The victim is drawn in flat magenta;
// the magenta pixels left after the walls are counted, next to his whole silhouette. Returns PNG data URLs.
// window.__want = [{tag: 'R10 1:22', killer: 'zet'}] (round and round timer as the Wallbangs list shows them),
// or window.__all = [offsets] for every wallbang in the list with no pictures (counts only).
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  const W = 640, H = 400;
  const rt = new THREE.WebGLRenderTarget(W, H);
  const cam = new THREE.PerspectiveCamera(30, W / H, 1, 20000);
  const MAG = new THREE.MeshBasicMaterial({ color: 0xff00ff, fog: false, side: THREE.DoubleSide });
  const buf = new Uint8Array(W * H * 4);
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const cx = cv.getContext('2d');
  const grab = () => { R3.renderer.readRenderTargetPixels(rt, 0, 0, W, H, buf); let n = 0; for (let i = 0; i < buf.length; i += 4) if (buf[i] > 245 && buf[i + 1] < 12 && buf[i + 2] > 245) n++; return n; };
  const png = () => { const im = cx.createImageData(W, H); for (let y = 0; y < H; y++) im.data.set(buf.subarray((H - 1 - y) * W * 4, (H - y) * W * 4), y * W * 4); cx.putImageData(im, 0, 0); return cv.toDataURL('image/png'); };
  const out = [];
  const wants = window.__all ? M.wbs.map((k) => { const r = M.rounds.find((x) => x.n === k.round); return { tag: `R${r.ln} ${clockText(k.t)}`, killer: M.pl[k.kp].name, k, offs: window.__all }; }) : window.__want;
  for (const w of wants) {
    const k = w.k || D.kills.find((k) => { const r = M.rounds.find((x) => x.n === k.round); return r && `R${r.ln} ${clockText(k.t)}` === w.tag && M.pl[k.kp] && M.pl[k.kp].name.includes(w.killer); });
    if (!k) { out.push({ tag: w.tag, missing: true }); continue; }
    const tP = k.tPos != null ? k.tPos : k.t;
    for (const off of w.offs || [0, 0.1]) {
      const tt = tP - off;
      const vs = playerState(k.victim, tt);
      const eye = off === 0 ? [k.kpos[0], k.kpos[1], k.kpos[2] + (k.kduck ? 12 : 17)] : (() => { const ks = playerState(k.killer, tt); return [ks.x, ks.y, ks.z + (ks.duck ? 12 : 17)]; })();
      playing = false; T = tt; prevT = T; selected = null; setCam('free', true); cam3.pos = eye.slice();
      await wait(900); update3();
      const pr = R3.rigs['p' + k.victim], wr = R3.rigs['w' + k.victim];
      const dist = Math.hypot(vs.x - eye[0], vs.y - eye[1], vs.z - eye[2]);
      cam.fov = Math.max(4, Math.min(60, 2 * Math.atan(110 / dist) * 180 / Math.PI));
      cam.position.copy(g3(eye[0], eye[1], eye[2])); cam.lookAt(g3(vs.x, vs.y, vs.z)); cam.updateProjectionMatrix();
      const hidden = [];
      for (const key in R3.rigs) { const r = R3.rigs[key]; if (r !== pr && r !== wr && r.g.visible) { r.g.visible = false; hidden.push(r.g); } }
      const swapped = [];
      for (const r of [pr, wr]) if (r && r.g.visible) for (const pt of r.parts) { swapped.push([pt.mesh, pt.mesh.material]); pt.mesh.material = MAG; }
      R3.renderer.setRenderTarget(rt); R3.renderer.render(R3.scene, cam); const vis = grab(); const img = window.__all ? null : png();
      const offs = [];
      for (const c of [...R3.scene.children, ...R3.dyn.children]) if (c !== R3.dyn && c !== (pr && pr.g) && !(wr && c === wr.g) && c.visible && !c.isLight) { c.visible = false; offs.push(c); }
      R3.renderer.render(R3.scene, cam); const sil = grab();
      R3.renderer.setRenderTarget(null);
      for (const c of offs) c.visible = true;
      for (const [m, mt] of swapped) m.material = mt;
      for (const g of hidden) g.visible = true;
      out.push({ tag: w.tag, off, who: `${M.pl[k.kp].name} -> ${M.pl[k.vp].name}`, duck: [k.kduck, k.vduck, vs.duck], dist: Math.round(dist), vis, sil, img });
    }
  }
  rt.dispose();
  return out;
})()
