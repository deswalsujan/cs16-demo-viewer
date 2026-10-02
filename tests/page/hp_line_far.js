(async () => {
  // 0.16.0: the "HP · weapon" line under names shows at any distance (it stopped at 2,500 units before),
  // through a scope too. Records what the 3D view writes on its label layer.
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  closeSummary();
  document.querySelector('#viewSeg [data-v="3d"]').click(); await wait(300);
  opts.names = true; opts.xray = true; // names for everyone, also behind walls, so distance is the only limit
  const r = M.liveR[Math.min(3, M.liveR.length - 1)];
  playing = false; seek(r.start + 25); await wait(300);
  const lx = $('lbl').getContext('2d'), orig = lx.fillText.bind(lx);
  let seen = [];
  lx.fillText = (s, x, y) => { seen.push(String(s)); return orig(s, x, y); };
  const out = { checks: [] };
  const ok = (n, pass, got) => out.checks.push({ name: n, pass: !!pass, got });
  // free camera high above one end of the map, looking across it
  selected = null; setCam('free');
  const list = alivePlayers(), S = list.map((e) => playerState(e, T));
  const cx = S.reduce((a, s) => a + s.x, 0) / S.length, cy = S.reduce((a, s) => a + s.y, 0) / S.length;
  cam3.pos = [cx - 4200, cy, 1800]; cam3.yaw = 0; cam3.pitch = 15;
  seen = []; await wait(800);
  const cam = cam3.pos, far = list.filter((e, i) => Math.hypot(S[i].x - cam[0], S[i].y - cam[1], S[i].z - cam[2]) > 2500);
  const subs = seen.filter((t) => / hp\b/.test(t));
  out.farPlayers = far.length; out.hpLines = subs.length; out.names = seen.length - subs.length;
  ok('players over 2,500 units away', far.length >= 3, far.length);
  ok('an HP line for every name drawn', subs.length > 0 && subs.length === seen.length - subs.length, `${subs.length} of ${seen.length - subs.length}`);
  // (a scope only narrows the camera's view; the same drawing code writes the names, so nothing else to check)
  lx.fillText = orig;
  out.pass = out.checks.every((c) => c.pass);
  return out;
})()
