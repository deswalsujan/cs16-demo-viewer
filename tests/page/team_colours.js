(async () => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  const out = {};
  // free camera above the same moment, Team colours on, See through walls off
  $('tgXray').click(); setCam('free');
  const xs = [], ys = [], zs = []; for (const e of alivePlayers()) { const s = playerState(e, T); xs.push(s.x); ys.push(s.y); zs.push(s.z); }
  const cx = xs.reduce((a, b) => a + b) / xs.length, cy = ys.reduce((a, b) => a + b) / ys.length;
  const e0 = alivePlayers()[0], s0 = playerState(e0, T);
  cam3.pos = [s0.x - 260, s0.y - 60, s0.z + 120]; cam3.yaw = 12; cam3.pitch = 18;
  $('tgModels').click(); await w(1200);
  const rigs = Object.values(R3.rigs).filter((r) => r.g.visible && r.parts.length && r.colourKey !== undefined);
  out.teamColoured = rigs.filter((r) => r.colourKey).length; out.visibleRigs = rigs.length;
  return out;
})()
