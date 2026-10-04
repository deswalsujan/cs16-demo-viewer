// POV mode, part 1 (wip/pov-mode, pov/pov.html): the recorder's own view at full rate.
// - At each of the recorder's own gun kills, how far the victim's head is from the middle of the screen
//   (the camera, with the recoil kick in it), just before the kill message
// - the camera buttons and player numbers are gone, and the view can't be switched to someone else
// - after he dies: how often the camera is a player's eyes (first-person spectating) or a free spectator camera
// - weapon sounds: where shots by others play from (their own position in the message, the shooter's, or none),
//   and how many of his own shots come from his gun's round count
// Leaves the view on the median kill (window.__killN picks another) for a screenshot.
(() => {
  const out = { pov: POV.on };
  const V = D.view, n = D.viewStride, N = V.length / n;
  out.viewFramesPerSecond = +(N / (V[(N - 1) * n] - V[0])).toFixed(1);
  const rec = (t) => { POV.i = 0; return povView(t).rec; };
  // the kills
  const ks = D.kills.filter((k) => k.killer === rec(k.t) && k.victim !== k.killer && k.weapon && !/grenade|knife|world/.test(k.weapon));
  const off = [];
  for (const k of ks) {
    const t = k.t - 0.05, v = povView(t), vs = playerState(k.victim, t);
    if (!vs || !Number.isFinite(vs.x) || (!vs.x && !vs.y)) continue;
    const head = [vs.x, vs.y, vs.z + (vs.duck ? 12 : 24)];
    const dx = head[0] - v.pos[0], dy = head[1] - v.pos[1], dz = head[2] - v.pos[2];
    const yawTo = Math.atan2(dy, dx) * 180 / Math.PI, pitchTo = -Math.atan2(dz, Math.hypot(dx, dy)) * 180 / Math.PI;
    const dyaw = Math.abs(((v.yaw - yawTo) % 360 + 540) % 360 - 180), dp = Math.abs(v.pitch - pitchTo);
    off.push({ k, d: Math.hypot(dyaw, dp), dist: Math.hypot(dx, dy) });
  }
  const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(2) : null; };
  out.ownGunKills = ks.length; out.measured = off.length;
  out.degreesOff = { median: q(off.map((o) => o.d), .5), p90: q(off.map((o) => o.d), .9) };
  // controls
  const vis = (sel) => { const b = document.querySelector(sel); return !!b && !b.hidden && b.offsetParent !== null; };
  setView('3d');
  out.buttonsShown = { free: vis('#cam3 [data-c="free"]'), eyes: vis('#cam3 [data-c="eyes"]'), chase: vis('#cam3 [data-c="chase"]'), prev: vis('#bPrevP'), next: vis('#bNextP'), teamColours: vis('#tgModels') };
  setView('3d');
  const before = cam3.mode; setCam('free'); nextPlayer(1);
  out.cameraAfterTryingFreeAndNext = cam3.mode + ' (was ' + before + ')';
  out.playerNumbersInPanel = document.querySelectorAll('#pane .pnum:not(.skull)').length;
  // after death: who the view follows, sampled every half second through the demo
  let alive = 0, aliveOnRec = 0, dead = 0, deadEyes = 0, deadFree = 0, preSpawn = 0, preSpawnHidden = 0;
  for (let t = D.start + 1; t < D.end; t += 0.5) {
    POV.i = 0; povFollow(t);
    const r = POV.v.rec, s = playerState(r, t);
    if (s && s.state > 0 && POV.mode !== 0) { preSpawn++; if (povHidesLiving(r)) preSpawnHidden++; }
    else if (s && s.state > 0) { alive++; if (selected === r && POV.who === r) aliveOnRec++; }
    else if (s && s.state < 0) { dead++; if (POV.who != null) deadEyes++; else deadFree++; }
  }
  out.follow = { aliveSamples: alive, onRecorderWhileAlive: aliveOnRec, deadSamples: dead, deadInAPlayersEyes: deadEyes, deadSpectatorCamera: deadFree, spectatingBeforeSpawn: preSpawn, hisBodyHiddenThen: preSpawnHidden };
  // sounds
  const sh = D.shots, so = D.shotOrg; let fromMsg = 0, fromShooter = 0, none = 0;
  for (let i = 0; i < sh.length / 4; i++) {
    if (!isNaN(so[i * 3])) fromMsg++;
    else if (entPos(sh[i * 4 + 1], sh[i * 4])) fromShooter++; else none++;
  }
  const os = D.ownShots, own = os.length / 3, ownGuns = {};
  for (let i = 0; i < os.length; i += 3) { const k = (WEAPON_EVENT[os[i + 1]] || os[i + 1]) + (os[i + 2] ? ' silenced' : ''); ownGuns[k] = (ownGuns[k] || 0) + 1; }
  out.shotSounds = { othersFromMessage: fromMsg, othersFromShooter: fromShooter, othersSilent: none, ownShots: own, ownGuns };
  // teammates' HP
  const withHp = Object.keys(hpIdx || {}).filter((e) => hpIdx[e].length).map((e) => nameAt(+e, D.end));
  out.playersWithHp = withHp.length;
  // leave the view on a kill
  const sorted = [...off].sort((a, b) => a.d - b.d);
  const pick = sorted[window.__killN ?? (sorted.length >> 1)];
  if (pick) { seek(pick.k.t - 0.05); playing = false; out.shown = { at: fmt(pick.k.t - D.start), victim: D.players[pick.k.victim].name, weapon: pick.k.weapon, dist: Math.round(pick.dist), off: +pick.d.toFixed(2) }; }
  return out;
})()
