(() => {
  const rad = Math.PI / 180;
  const hs = D.kills.filter((k) => k.hs && k.kpos && k.vpos && k.kang && k.killer !== k.victim && M.liveR.some((r) => r.n === k.round) && !k.wb);
  const res = { stored: { v: [], h: [] }, viewer: { v: [], h: [] } };
  for (const k of hs) {
    const head = [k.vpos[0], k.vpos[1], k.vpos[2] + (k.vduck ? 14 : 28)];
    const dist = Math.hypot(head[0] - k.kpos[0], head[1] - k.kpos[1]);
    if (dist < 300) continue;
    const add = (key, x, y, z, duck, yaw, pitch) => {
      const eye = [x, y, z + (duck ? 12 : 17)];
      const dx = head[0] - eye[0], dy = head[1] - eye[1], dz = head[2] - eye[2];
      const elevToHead = Math.atan2(dz, Math.hypot(dx, dy)) / rad, yawToHead = Math.atan2(dy, dx) / rad;
      res[key].v.push(-pitch - elevToHead); // + means the aim is above the head
      res[key].h.push(wrap180(yaw - yawToHead)); // + means the aim is left of the head
    };
    let rp = k.kang[0]; if (rp > 180) rp -= 360;
    add('stored', k.kpos[0], k.kpos[1], k.kpos[2], k.kduck, k.kang[1], -rp * 3);
    const s = playerState(k.killer, k.t);
    if (s) add('viewer', s.x, s.y, s.z, s.duck, s.yaw, s.pitch);
  }
  const stat = (a) => { const s = [...a].sort((x, y) => x - y); const mean = a.reduce((x, y) => x + y, 0) / a.length; return { n: a.length, mean: +mean.toFixed(2), median: +s[Math.floor(s.length / 2)].toFixed(2), middleHalf: [+s[Math.floor(s.length / 4)].toFixed(2), +s[Math.floor(s.length * 3 / 4)].toFixed(2)] }; };
  return { headshots: hs.length, upDown_aimAboveHead: { stored: stat(res.stored.v), viewer: stat(res.viewer.v) }, leftRight_aimLeftOfHead: { stored: stat(res.stored.h), viewer: stat(res.viewer.h) } };
})()
