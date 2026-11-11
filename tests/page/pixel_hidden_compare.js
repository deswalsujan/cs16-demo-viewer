// Pixel probe (5 Oct 2026, Sujan's last try on the denser hidden check): draws the killer's view of the victim
// with the victim's body and gun in flat magenta and counts the magenta pixels the walls leave, at 0.01, 0.05,
// 0.1, 0.15 and 0.2 s before the killing shot. Needs window.__want = [{id, ln, timer, killer, victim}] (round as
// the viewer shows it, round timer, part of the killer's and victim's names). Result: IDEAS.md, denser check.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const out = [];
  const SZ = 256;
  const rt = new THREE.WebGLRenderTarget(SZ, SZ);
  const cam = new THREE.PerspectiveCamera(10, 1, 1, 20000);
  const MAG = new THREE.MeshBasicMaterial({ color: 0xff00ff, fog: false, side: THREE.DoubleSide });
  const buf = new Uint8Array(SZ * SZ * 4);
  const count = () => { R3.renderer.readRenderTargetPixels(rt, 0, 0, SZ, SZ, buf); let n = 0; for (let i = 0; i < buf.length; i += 4) if (buf[i] > 245 && buf[i + 1] < 12 && buf[i + 2] > 245) n++; return n; };
  for (const w of window.__want) {
    const k = D.kills.find((k) => { const r = M.rounds.find((x) => x.n === k.round); return r && r.ln === w.ln && clockText(k.t) === w.timer && M.pl[k.kp] && M.pl[k.kp].name.includes(w.killer) && (!w.victim || (M.pl[k.vp] && M.pl[k.vp].name.includes(w.victim))); });
    if (!k) { out.push({ id: w.id, missing: true }); continue; }
    const tP = k.tPos != null ? k.tPos : k.t;
    const res = { id: w.id };
    for (const off of [0.01, 0.05, 0.1, 0.15, 0.2]) { const tn = 'm' + Math.round(off * 100), tt = tP - off;
      const ks = playerState(k.killer, tt), vs = playerState(k.victim, tt);
      if (!ks || !vs) { res[tn] = 'nostate'; continue; }
      const eyes = { rec: [k.kpos[0], k.kpos[1], k.kpos[2] + (k.kduck ? 12 : 17)] };
      for (const en in eyes) {
        const eye = eyes[en];
        playing = false; T = tt; prevT = T; selected = null; setCam('free', true); cam3.pos = eye.slice();
        await wait(700); // models load, frame loop places everything
        update3();
        const pr = R3.rigs['p' + k.victim], wr = R3.rigs['w' + k.victim];
        if (!pr || !pr.g.visible) { res[tn] = 'norig'; continue; }
        const tgt = g3(vs.x, vs.y, vs.z + (vs.duck ? 0 : 4));
        const dist = Math.hypot(vs.x - eye[0], vs.y - eye[1], vs.z - eye[2]);
        cam.fov = Math.max(2, Math.min(70, 2 * Math.atan(55 / dist) * 180 / Math.PI));
        cam.position.copy(g3(eye[0], eye[1], eye[2])); cam.lookAt(tgt); cam.updateProjectionMatrix();
        // hide other players, corpses and simple figures; victim in magenta
        const hidden = [];
        for (const key in R3.rigs) { const r = R3.rigs[key]; if (r !== pr && r !== wr && r.g.visible) { r.g.visible = false; hidden.push(r.g); } }
        for (const e in R3.players) { const f = R3.players[e]; if (f && f.g && f.g.visible) { f.g.visible = false; hidden.push(f.g); } }
        const swapped = [];
        for (const r of [pr, wr]) if (r && r.g.visible) for (const pt of r.parts) { swapped.push([pt.mesh, pt.mesh.material]); pt.mesh.material = MAG; }
        const bg = R3.scene.background; R3.scene.background = new THREE.Color(0);
        R3.renderer.setRenderTarget(rt); R3.renderer.render(R3.scene, cam); const vis = count();
        // silhouette alone: everything else hidden
        const off = [];
        for (const c of [...R3.scene.children, ...R3.dyn.children]) if (c !== R3.dyn && c !== pr.g && !(wr && c === wr.g) && c.visible && !c.isLight) { c.visible = false; off.push(c); }
        R3.renderer.render(R3.scene, cam); const sil = count();
        R3.renderer.setRenderTarget(null);
        for (const c of off) c.visible = true;
        for (const [m, mt] of swapped) m.material = mt;
        for (const g of hidden) g.visible = true;
        R3.scene.background = bg;
        res[tn] = [vis, sil];
      }
    }
    out.push(res);
  }
  rt.dispose();
  return out;
})()
