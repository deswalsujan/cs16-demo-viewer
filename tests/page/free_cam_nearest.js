(async () => {
  // 0.16.0: from Free camera to Player's eyes or Behind player with nobody picked, the view follows the living
  // player nearest the middle of the free camera's view (before: the first living player in the list).
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  closeSummary();
  document.querySelector('#viewSeg [data-v="3d"]').click(); await wait(300);
  const r = M.liveR[Math.min(3, M.liveR.length - 1)];
  playing = false; seek(r.start + 25); await wait(300);
  const name = (e) => nameAt(e, T);
  const out = { checks: [] };
  const ok = (n, pass, got) => out.checks.push({ name: n, pass: !!pass, got });
  const list = alivePlayers();
  out.alive = list.length;
  // aim the free camera at a player from 500 units behind and above them
  const lookAt = async (e, yaw) => {
    const s = playerState(e, T), pitch = 25, f = fwd(yaw, pitch);
    cam3.pos = [s.x - f[0] * 500, s.y - f[1] * 500, s.z + 20 - f[2] * 500]; cam3.yaw = yaw; cam3.pitch = pitch;
    await wait(400);
  };
  for (const to of ['eyes', 'chase']) {
    for (const target of [list[list.length - 1], list[Math.floor(list.length / 2)]]) {
      selected = null; setCam('free'); await lookAt(target, 37); renderPane();
      document.querySelector(`#cam3 [data-c="${to}"]`).click(); await wait(300);
      ok(`${to}: follows ${name(target)}, in the middle of the view (first in list: ${name(list[0])})`, selected === target && cam3.mode === to, name(selected));
    }
  }
  // the V key from Free camera too
  const tv = list[list.length - 2];
  selected = null; setCam('free'); await lookAt(tv, 200);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' })); await wait(300);
  ok(`V key: follows ${name(tv)}`, selected === tv && cam3.mode === 'eyes', name(selected));
  // someone picked: they stay picked, wherever the camera looks
  const picked = list[0];
  selected = picked; setCam('free'); await lookAt(list[list.length - 1], 37);
  document.querySelector('#cam3 [data-c="eyes"]').click(); await wait(300);
  ok(`picked player kept (${name(picked)})`, selected === picked, name(selected));
  out.pass = out.checks.every((c) => c.pass);
  return out;
})()
