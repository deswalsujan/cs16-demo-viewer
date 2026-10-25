// Pictures for the wallbang hits mockup (25 Oct 2026): for each moment in window.__shots ({t: demo seconds, s:
// shooter slot, v: victim slot}), the shooter's Player's eyes view with See through walls on, paused, as the viewer
// draws it (3D view plus its label layer), and where the victim's head and chest fall on screen. Returns PNG data
// URLs. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  setView('3d'); await wait(1500);
  if (!opts.xray) $('tgXray').click();
  const out = [];
  for (const sh of window.__shots) {
    playing = false; selected = sh.s; T = sh.t; prevT = T; setCam('eyes', true);
    await wait(1200); update3(); await wait(300);
    R3.renderer.render(R3.scene, R3.camera);
    const gl = $('gl'), lb = $('lbl');
    const c = document.createElement('canvas'); c.width = gl.width; c.height = gl.height;
    const x = c.getContext('2d'); x.drawImage(gl, 0, 0); x.drawImage(lb, 0, 0, c.width, c.height);
    const vs = playerState(sh.v, T);
    const proj = (z) => { const p = g3(vs.x, vs.y, vs.z + z).project(R3.camera); return [Math.round((p.x + 1) / 2 * c.width), Math.round((1 - p.y) / 2 * c.height), p.z < 1]; };
    out.push({ t: sh.t, head: proj(vs.duck ? 16 : 28), chest: proj(vs.duck ? 4 : 10), feet: proj(-34), img: c.toDataURL('image/jpeg', 0.88), W: c.width, H: c.height });
  }
  return { demo: D.fileName, shots: out };
})()
