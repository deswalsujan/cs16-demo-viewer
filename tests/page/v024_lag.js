// 3D timing like the game (wip/wallbang-hits, 26 Oct 2026; no switch since 27 Oct 2026): Dosia's kill on cArn, fnatic vs Moscow Five, Nuke, DreamHack Summer
// 2011, R2 1:13 (DEMO=fnatic-vs-m5-dhs11-1106191035). At the kill message with "Like the game" on, the kill feed shows
// the kill while the 3D view draws Dosia's view 0.1 s earlier (cArn in the doorway).
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase() && view3.map === MAP.name) && Date.now() - t0 < 150000) await wait(500);
  const k = D.kills.find((x) => Math.abs(x.t - 568.645) < 0.02);
  setView('3d'); await wait(800);
  playing = false; selected = k.killer; T = k.t + 0.001; prevT = T; setCam('eyes', true); await wait(1500); updateHud(true); update3(); await wait(400);
  const cam = R3.camera, v = playerState(k.victim, T - (window.__lag === 'rec' ? 0 : 0.1));
  return { T: +T.toFixed(3), feed: $('feed').textContent.slice(0, 60), camYawDeg: +(Math.atan2(-cam.getWorldDirection(new THREE.Vector3()).z, cam.getWorldDirection(new THREE.Vector3()).x) * 180 / Math.PI).toFixed(2) };
})()
