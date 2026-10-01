(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // a smoke that has popped, seen from above
  const sm = M.nades.find((n) => n.type === 'smoke' && n.t0 > M.liveR[0].start);
  const p = sm.pts; let k = 0; for (let i = 0; i < p.length; i += 4) if (p[i] >= sm.stop) { k = i; break; }
  cam3.pos = [p[k + 1] - 600, p[k + 2], p[k + 3] + 600]; cam3.yaw = 0; cam3.pitch = 40;
  T = sm.stop + 3; await wait(1500);
  return { smokeOpacity: [...R3.ov.m.entries()].filter(([k, o]) => k.startsWith('sm:') && o.visible).map(([k, o]) => +o.material.opacity.toFixed(2)) };
})()
