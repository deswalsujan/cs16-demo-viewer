// Frames for animated mockups (26 Oct 2026, wallbang hits options A, B, C): the shooter's Player's eyes with See
// through walls on and Names off, paused at each moment from window.__fr = {s, v, from, to, step}, as the viewer
// draws it (3D view and its crosshair layer), with where the victim's head and feet fall on screen, his health and
// weapon, and the crosshair size. JPEG data URLs. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  setView('3d'); await wait(1500);
  if (!opts.xray) $('tgXray').click();
  if (opts.names) $('tgNames').click();
  const f = window.__fr, out = [];
  const hpAt = (e, t) => { let h = 100; for (let i = 0; i < D.hp.length; i += 3) { if (D.hp[i] > t + 1e-4) break; if (D.hp[i + 1] === e) h = D.hp[i + 2]; } return h; };
  playing = false; selected = f.s; T = f.from; prevT = T; setCam('eyes', true); await wait(1500);
  for (let t = f.from; t <= f.to + 1e-6; t += f.step) {
    T = t; prevT = T; await wait(250); update3(); await wait(150);
    R3.renderer.render(R3.scene, R3.camera);
    const gl = $('gl'), lb = $('lbl');
    const c = document.createElement('canvas'); c.width = gl.width; c.height = gl.height;
    const x = c.getContext('2d'); x.drawImage(gl, 0, 0); x.drawImage(lb, 0, 0, c.width, c.height);
    const vs = playerState(f.v, T);
    const proj = (z) => { if (!vs) return null; const p = g3(vs.x, vs.y, vs.z + z).project(R3.camera); return [Math.round((p.x + 1) / 2 * c.width), Math.round((1 - p.y) / 2 * c.height)]; };
    out.push({ t: +t.toFixed(3), head: proj(vs && vs.duck ? 16 : 30), feet: proj(-34), hp: hpAt(f.v, t), weapon: vs ? weaponShort(vs.weapon) : '', alive: !!(vs && vs.state > 0), img: c.toDataURL('image/jpeg', 0.9) });
  }
  return { W: $('gl').width, H: $('gl').height, xh: opts.xhair || (typeof XH_SIZE !== 'undefined' ? XH_SIZE : null), victim: M.pl[D.kills.find((k) => k.victim === f.v && M.pl[k.vp]).vp].name, frames: out };
})()
