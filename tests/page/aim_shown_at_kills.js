(() => {
  // What Player's eyes shows at the moment of each headshot kill: how far the shooter's crosshair is from the
  // victim's head, both as the viewer draws them (playerState at the kill time). Used for the 0.14.3 track
  // timing fix, before and after. Kills from 300 units or more, wallbangs left out (like aim_bias_headshots.js).
  const rad = Math.PI / 180;
  const hs = D.kills.filter((k) => k.hs && k.kpos && k.killer !== k.victim && M.liveR.some((r) => r.n === k.round) && !k.wb);
  const off = [], offStored = [];
  for (const k of hs) {
    const a = playerState(k.killer, k.t), v = playerState(k.victim, k.t);
    if (!a || !v || a.state <= 0) continue;
    const eye = [a.x, a.y, a.z + (a.duck ? 12 : 17)], head = [v.x, v.y, v.z + (v.duck ? 14 : 28)];
    const dx = head[0] - eye[0], dy = head[1] - eye[1], dz = head[2] - eye[2];
    if (Math.hypot(dx, dy) < 300) continue;
    const yawTo = Math.atan2(dy, dx) / rad, elTo = Math.atan2(dz, Math.hypot(dx, dy)) / rad;
    const h = wrap180(a.yaw - yawTo), vv = -a.pitch - elTo;
    off.push(Math.hypot(h, vv));
    // the same against the positions the demo stored with the kill message (what the server had at that moment)
    if (k.vpos) { const hd = [k.vpos[0], k.vpos[1], k.vpos[2] + (k.vduck ? 14 : 28)]; const ex = hd[0] - eye[0], ey = hd[1] - eye[1], ez = hd[2] - eye[2]; offStored.push(Math.hypot(wrap180(a.yaw - Math.atan2(ey, ex) / rad), -a.pitch - Math.atan2(ez, Math.hypot(ex, ey)) / rad)); }
  }
  const stat = (x) => { const s = [...x].sort((p, q) => p - q); return { n: s.length, median: +s[s.length >> 1].toFixed(2), quarter3: +s[Math.floor(s.length * 0.75)].toFixed(2), under1deg: s.filter((y) => y < 1).length, over2deg: s.filter((y) => y > 2).length }; };
  return { demo: D.fileName, crosshairToHead_deg_asDrawn: stat(off), crosshairToStoredHead_deg: stat(offStored) };
})()
