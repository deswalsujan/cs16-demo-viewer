(() => {
  // angle (degrees) between an aim direction from the eye and the nearest point of a standing/crouching body
  const rad = Math.PI / 180;
  const aimErr = (eye, yaw, pitch, v, duck) => {
    const f = [Math.cos(pitch * rad) * Math.cos(yaw * rad), Math.cos(pitch * rad) * Math.sin(yaw * rad), -Math.sin(pitch * rad)];
    let best = 1e9;
    const z0 = v[2] - (duck ? 18 : 36), z1 = v[2] + (duck ? 18 : 36) - 4;
    for (let z = z0; z <= z1; z += 2) {
      const d = [v[0] - eye[0], v[1] - eye[1], z - eye[2]], L = Math.hypot(...d);
      const c = (d[0] * f[0] + d[1] * f[1] + d[2] * f[2]) / L;
      best = Math.min(best, Math.acos(Math.max(-1, Math.min(1, c))) / rad - Math.atan(14 / L) / rad); // 14 units: half a body width
    }
    return Math.max(0, best);
  };
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return +s[Math.floor(s.length / 2)].toFixed(2); };
  const kills = D.kills.filter((k) => k.scope && k.kpos && k.vpos && k.kang && M.liveR.some((r) => r.n === k.round));
  const raw = [], view = [], rows = [];
  const lagTry = [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4], lagErr = lagTry.map(() => []);
  for (const k of kills) {
    let rp = k.kang[0]; if (rp > 180) rp -= 360;
    const rawYaw = k.kang[1], rawPitch = -rp * 3;
    const eye = [k.kpos[0], k.kpos[1], k.kpos[2] + (k.kduck ? 12 : 17)];
    const eR = aimErr(eye, rawYaw, rawPitch, k.vpos, k.vduck); raw.push(eR);
    const s = playerState(k.killer, k.t);
    const vs = playerState(k.victim, k.t - 0.001);
    const eV = s ? aimErr([s.x, s.y, s.z + (s.duck ? 12 : 17)], s.yaw, s.pitch, vs && vs.state ? [vs.x, vs.y, vs.z] : k.vpos, k.vduck) : NaN; view.push(eV);
    lagTry.forEach((dt, i) => { const p = playerState(k.victim, k.t - dt); if (p) lagErr[i].push(aimErr(eye, rawYaw, rawPitch, [p.x, p.y, p.z], p.duck)); });
    const r = M.rounds.find((x) => x.n === k.round);
    // how far did the victim move in the 0.15 s before the kill, and how fast was the shooter turning?
    const p0 = playerState(k.victim, k.t - 0.15), sp = p0 ? Math.hypot(p0.x - k.vpos[0], p0.y - k.vpos[1]) / 0.15 : null;
    const a0 = playerState(k.killer, k.t - 0.1), turn = a0 && s ? Math.abs(wrap180(s.yaw - a0.yaw)) / 0.1 : null;
    rows.push(`R${r.ln} ${clockText(k.t)} ${M.pl[k.kp].name} -> ${M.pl[k.vp].name}: stored aim off by ${eR.toFixed(2)}°, viewer ${eV.toFixed(2)}°, victim speed ${sp == null ? '?' : sp.toFixed(0)} u/s, shooter turning ${turn == null ? '?' : turn.toFixed(0)}°/s`);
  }
  return {
    kills: kills.length,
    medianOff: { storedAim: med(raw), viewer: med(view) },
    victimMovedBack: Object.fromEntries(lagTry.map((dt, i) => [dt + ' s', med(lagErr[i])])),
    rows,
  };
})()
