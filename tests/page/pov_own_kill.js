// POV mode (wip/pov-mode): the recorder's own kills seen from his eyes. Just before each gun kill, how far the
// victim's head sits from where the recorder aims, as Player's eyes draws it; then leaves the view on one kill
// (window.__killN, default the median one) for a screenshot.
(() => {
  const rec = D.serverInfo.playerIndex + 1;
  const ks = D.kills.filter((k) => k.killer === rec && k.victim !== rec && k.weapon && !/grenade|knife|world/.test(k.weapon));
  const off = [];
  for (const k of ks) {
    const t = k.t - 0.05, a = playerState(rec, t), v = playerState(k.victim, t);
    if (!a || !v || !(a.state > 0) || (!v.x && !v.y)) continue;
    const eye = [a.x, a.y, a.z + (a.duck ? 12 : 17)], head = [v.x, v.y, v.z + (v.duck ? 12 : 24)];
    const dx = head[0] - eye[0], dy = head[1] - eye[1], dz = head[2] - eye[2];
    const yawTo = Math.atan2(dy, dx) * 180 / Math.PI, pitchTo = -Math.atan2(dz, Math.hypot(dx, dy)) * 180 / Math.PI;
    const myPitch = a.pitch; // playerState gives the real view pitch (down is positive)
    const dyaw = Math.abs(((a.yaw - yawTo) % 360 + 540) % 360 - 180);
    off.push({ k, dyaw, dpitch: Math.abs(myPitch - pitchTo), dist: Math.hypot(dx, dy) });
  }
  const q = (arr, p) => { const s = arr.map((o) => Math.hypot(o.dyaw, o.dpitch)).sort((x, y) => x - y); return s.length ? +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(2) : null; };
  const sorted = [...off].sort((x, y) => Math.hypot(x.dyaw, x.dpitch) - Math.hypot(y.dyaw, y.dpitch));
  const pick = sorted[window.__killN ?? (sorted.length >> 1)];
  if (pick) {
    seek(pick.k.t - 0.05); playing = false; setView('3d'); selected = null; selectPlayer(rec); setCam('eyes', true);
  }
  return { recorderGunKills: ks.length, measured: off.length, degreesOffMedian: q(off, .5), p90: q(off, .9),
    shown: pick && { at: (pick.k.t - D.start).toFixed(2), victim: D.players[pick.k.victim].name, weapon: pick.k.weapon, dist: Math.round(pick.dist), off: +Math.hypot(pick.dyaw, pick.dpitch).toFixed(2) } };
})()
