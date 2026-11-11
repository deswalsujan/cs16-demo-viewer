// Reset view (0.12.2): back to the starting view in 2D, 3D and split, whatever the camera was doing.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const start = { pos: cam3.pos.slice(), yaw: cam3.yaw, pitch: cam3.pitch };
  const atStart = () => cam3.mode === 'free' && cam3.pos.every((v, i) => Math.abs(v - start.pos[i]) < 0.01) && cam3.yaw === start.yaw && cam3.pitch === start.pitch;
  const reset = async () => { $('tgFit').click(); await wait(400); };
  const res = {};
  setView('3d'); await wait(800);
  nextPlayer(1); setCam('eyes'); await wait(1000);
  const who = selected;
  await reset(); res.eyes_to_overview = atStart(); res.player_still_highlighted = selected === who && who != null;
  setCam('chase'); await wait(800); await reset(); res.chase_to_overview = atStart();
  cam3.pos[0] += 600; cam3.yaw = 120; cam3.pitch = -10; await wait(300); await reset(); res.free_moved_back = atStart();
  setView('2d'); await wait(400); view.s = 3; view.x = 150; view.y = -80; await reset(); res.radar_2d = view.s === 1 && view.x === 0 && view.y === 0;
  setView('split'); await wait(600); setCam('eyes'); view.s = 2; view.x = 40; await reset(); res.split_both = atStart() && view.s === 1 && view.x === 0;
  res.button_says = $('tgFit').title;
  setView('3d'); await wait(800);
  return res;
})()
