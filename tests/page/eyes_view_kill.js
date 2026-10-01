(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // eyes view during play, with a kill landing: markeloff round 1
  const r = M.liveR[0]; const k = r.kills.find((x) => x.kp && x.killer !== x.victim);
  selected = k.killer; setCam('eyes', true); T = k.t - 1.2; speed = 1; playing = true;
  await wait(4000); playing = false;
  return { mode: cam3.mode, T: clockText(T), smoothBtn: $('tgSmooth').classList.contains('on'), quality: $('q3').value, ratio: R3.renderer.getPixelRatio() };
})()
