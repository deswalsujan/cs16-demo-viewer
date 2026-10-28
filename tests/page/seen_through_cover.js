// Kills the finder's 15 points see (so they aren't wallbangs) whose crosshair line still goes through what a bullet
// hits (27 Oct 2026). Sujan's question: does the demo, the source of truth, show a bullet that can only have come
// through a surface? For each such kill: every health drop on the victim in the fight before the kill (each within 2 s
// of the next, up to 6 s back), its hit sound, who fired it and from how far, what that gun can do there in the open
// and through one surface, and a verdict. The game's numbers, from ReGameDLL: FireBullets3 in cbase.cpp (range:
// damage x modifier^(distance/500), cut to a whole number; after a surface x 0.6 at most, wood; 0.5 most walls),
// CBasePlayer::TraceAttack in player.cpp (head 4, stomach 1.25, chest and arms 1, legs 0.75), CBasePlayer::TakeDamage
// (armour: x 0.5 x the gun's factor, M4 1.4, AK 1.55, AWP 1.95; health cut to a whole number) and Pain (helmet sound:
// head with a helmet; headshot sound: head without one; kevlar sound: body with armour; flesh: a leg, or the body
// without armour). Distances get 30 units either way for the aim recorded ten times a second. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && M.liveR && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  const bsp = MAP.bsp, S = D.stride, times = D.times;
  const GUN = { ak47: [[36, 0.98]], m4a1: [[32, 0.97], [33, 0.95]], famas: [[30, 0.96], [34, 0.96]], galil: [[30, 0.98]], aug: [[32, 0.96]], sg552: [[33, 0.955]], awp: [[115, 0.99]], scout: [[75, 0.98]], deagle: [[54, 0.81]], sg550: [[70, 0.98]], g3sg1: [[80, 0.98]], m249: [[32, 0.97]] };
  const RATIO = { ak47: 0.775, galil: 0.775, m4a1: 0.7, aug: 0.7, famas: 0.7, sg552: 0.7, awp: 0.975, scout: 0.85, deagle: 0.75, sg550: 0.725, g3sg1: 0.825, m249: 0.75 };
  const CLASS = { helmet: { hg: [4], arm: true }, headshot: { hg: [4], arm: false }, kevlar: { hg: [1, 1.25], arm: true }, flesh: { hg: [0.75, 1, 1.25], arm: false } };
  const sclass = (n) => /helmet/.test(n) ? 'helmet' : /headshot/.test(n) ? 'headshot' : /kevlar/.test(n) ? 'kevlar' : 'flesh';
  const at = (gun, d) => (GUN[gun] || []).map(([dm, r]) => Math.floor(dm * Math.pow(r, Math.max(0, d) / 500)));
  // [lowest in the open, highest in the open, highest through one surface] for one bullet of this gun, distance and sound
  const range = (gun, d, cls) => {
    if (!GUN[gun]) return null;
    const c = CLASS[cls], rat = c.arm ? RATIO[gun] : 1;
    const lo = Math.min(...at(gun, d + 30).map((x) => Math.floor(x * Math.min(...c.hg) * rat + 1e-6)));
    const hi = Math.max(...at(gun, d - 30).map((x) => Math.floor(x * Math.max(...c.hg) + 1e-6)));
    const wall = Math.max(...at(gun, d - 60).map((x) => Math.floor(Math.floor(x * 0.6) * Math.max(...c.hg) + 1e-6)));
    return [lo, hi, wall];
  };
  const idx = (t) => { let lo = 0, hi = times.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (times[m] <= t + 1e-4) lo = m; else hi = m - 1; } return lo; };
  const team = (e, i) => { const n = playerModelName(D.slots[e][i * S + 8]).toLowerCase(); return /terror|leet|arctic|guerilla/.test(n) ? 'T' : /urban|gsg9|sas|gign|vip/.test(n) ? 'CT' : null; };
  const nm = (e, t) => { try { return labelAt(e, t); } catch (x) { return (D.players[e] || {}).name || '#' + e; } };
  const evGun = (i) => String((D.events && D.events[i]) || '').toLowerCase().replace(/^.*\//, '').replace(/\.sc$/, '').replace(/^mp5n$/, 'mp5navy').replace(/^elite_(left|right)$/, 'elite');
  const sname = (i) => String((D.sounds && D.sounds[i]) || '').toLowerCase();
  const hits = {}; const sn = D.snds || [];
  for (let i = 0; i < sn.length; i += 10) { const n = sname(sn[i + 1]); if (/player\/(bhit|headshot)/.test(n)) (hits[sn[i + 2]] || (hits[sn[i + 2]] = [])).push([sn[i], sclass(n)]); }
  const shots = {}, gunAt = {}; const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) { const g = evGun(sh[i + 2]); if (/smoke/.test(g)) continue; (shots[sh[i + 1]] || (shots[sh[i + 1]] = [])).push(sh[i]); (gunAt[sh[i + 1]] || (gunAt[sh[i + 1]] = [])).push(g); }
  const starts = (M.rounds || []).map((r) => r.start).sort((x, y) => x - y);
  const roundOf = (t) => { let k = -1; for (let j = 0; j < starts.length && starts[j] <= t; j++) k = j; return k; };
  // health drops, paired with their hit sounds exactly as computeHits does
  const last = {}, lastR = {}, drops = [];
  for (let i = 0; i < D.hp.length; i += 3) {
    const t = D.hp[i], e = D.hp[i + 1], v = D.hp[i + 2], rn = roundOf(t);
    let p = last[e]; if (lastR[e] !== rn) p = 100;
    last[e] = v; lastR[e] = rn;
    if (v > 0 && v < p) drops.push({ t, e, from: p, to: v, dmg: p - v });
    else if (v === 0 && p > 0) drops.push({ t, e, from: p, to: 0, dmg: p, dead: true });
  }
  const used = new Set(), byT = {};
  for (const d of drops) (byT[d.e + ':' + d.t] || (byT[d.e + ':' + d.t] = [])).push(d);
  for (const key in byT) {
    const grp = byT[key], e = grp[0].e, t0 = grp[0].t;
    const W = (hits[e] || []).map((h, k) => [h, k]).filter(([h, k]) => !used.has(e + ':' + k) && h[0] >= t0 - 0.4 && h[0] <= t0 + 0.02);
    grp.forEach((d, gi) => { if (!W.length) return; const take = gi < grp.length - 1 ? [W.shift()] : W.splice(0); for (const [, k] of take) used.add(e + ':' + k); d.snd = take.map(([h]) => h); });
  }
  const byV = {}; for (const d of drops) (byV[d.e] || (byV[d.e] = [])).push(d);
  const booms = []; const bm = D.booms || []; for (let i = 0; i < bm.length; i += 4) booms.push([bm[i], bm[i + 1], bm[i + 2], bm[i + 3]]);
  const aimAt = (a, i, vp, head, vduck) => {
    const eye = [a[i * S], a[i * S + 1], a[i * S + 2] + (a[i * S + 7] ? 12 : 17)];
    let raw = a[i * S + 4]; if (raw > 180) raw -= 360;
    const pitch = -raw * 3 * Math.PI / 180, yaw = a[i * S + 3] * Math.PI / 180;
    const dir = [Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), -Math.sin(pitch)];
    const tgt = [vp[0], vp[1], vp[2] + (head ? (vduck ? 16 : 28) : (vduck ? 4 : 10))];
    const rel = [tgt[0] - eye[0], tgt[1] - eye[1], tgt[2] - eye[2]];
    const along = rel[0] * dir[0] + rel[1] * dir[1] + rel[2] * dir[2];
    const off = Math.hypot(rel[0] - dir[0] * along, rel[1] - dir[1] * along, rel[2] - dir[2] * along);
    return { eye, dir, along, off, tgt, dist: Math.hypot(...rel) };
  };
  const notCover = bsp.solids.filter((x) => x.shootable).map((x) => x.model);
  const lines = (c, t) => {
    const skip = brokenSet(t - 0.05); for (const m of notCover) skip.add(m);
    const poses = posesAt(t - 0.05), end = c.eye.map((x, j) => x + c.dir[j] * c.along);
    return [Math.round(solidAlong(bsp, c.eye, end, 2, skip, poses, 'bullet').solid), Math.round(solidAlong(bsp, c.eye, c.tgt, 2, skip, poses, 'bullet').solid)];
  };
  // one hit: who fired it (as computeHits picks), from how far, and what his gun can do there
  const judge = (d, killer) => {
    const th = d.snd ? d.snd[0][0] : d.t, i = idx(th), v = D.slots[d.e];
    const vp = [v[i * S], v[i * S + 1], v[i * S + 2]], vduck = v[i * S + 7], head = (d.snd || []).some(([, c]) => c === 'helmet' || c === 'headshot');
    let zTop = vp[2]; for (let j = i; j >= 0 && times[j] >= th - 1; j--) if (!isNaN(v[j * S + 2])) zTop = Math.max(zTop, v[j * S + 2]);
    const fall = zTop - vp[2] >= 100 && (i >= 2 ? v[(i - 2) * S + 2] : vp[2]) - vp[2] >= 20;
    const nade = booms.some(([t, x, y, z]) => th - t >= -0.05 && th - t < 0.4 && Math.hypot(x - vp[0], y - vp[1], z - vp[2]) < 450);
    const vt = team(d.e, i), cands = [], seen = new Set();
    for (const e in shots) {
      const se = +e; if (se === d.e) continue;
      let li = -1; shots[se].forEach((t, j) => { if (t >= th - 0.2 && t <= th + 0.001) li = j; }); if (li < 0) continue;
      const a = D.slots[se]; if (!a || isNaN(a[i * S]) || team(se, i) === vt) continue;
      const c = aimAt(a, i, vp, head, vduck); if (c.along <= 0) continue;
      cands.push(Object.assign(c, { e: se, gun: gunAt[se][li], shot: true })); seen.add(se);
    }
    if (!M.firesKept) for (const e in D.slots) {
      const se = +e; if (se === d.e || seen.has(se)) continue;
      const a = D.slots[se]; if (!a || isNaN(a[i * S]) || !(a[i * S + 5] > 0) || team(se, i) === vt || team(se, i) == null) continue;
      const gun = weaponShort(D.models[a[i * S + 6]]); if (!GUN[gun]) continue;
      const c = aimAt(a, i, vp, head, vduck); if (c.along > 0 && c.off <= 32) cands.push(Object.assign(c, { e: se, gun, shot: false }));
    }
    cands.sort((x, y) => x.off - y.off);
    const c = cands[0];
    // a teammate of his who fired then and aimed near him (team damage is cut to 0.35 in the game, so it looks small)
    let mate = null;
    for (const e in shots) {
      const se = +e; if (se === d.e || !shots[se].some((t) => t >= th - 0.2 && t <= th + 0.001)) continue;
      const a = D.slots[se]; if (!a || isNaN(a[i * S]) || team(se, i) !== vt) continue;
      const m = aimAt(a, i, vp, head, vduck); if (m.along > 0 && m.off <= 32) mate = nm(se, th);
    }
    // another player on the line between them (a bullet through a player keeps 0.75 of its damage): Sujan's question
    // on cArNaGe on STRIKE, Sweden vs Ukraine, Train, R22 C4 0:07, 28 Oct 2026 (valentinich 16 units off the line)
    const onLine = [];
    if (c) for (const e in D.slots) {
      const se = +e; if (se === c.e || se === d.e) continue;
      const p = D.slots[se]; if (!p || isNaN(p[i * S]) || !(p[i * S + 5] > 0)) continue;
      const rel = [p[i * S] - c.eye[0], p[i * S + 1] - c.eye[1], p[i * S + 2] + 18 - c.eye[2]], u = [c.tgt[0] - c.eye[0], c.tgt[1] - c.eye[1], c.tgt[2] - c.eye[2]], L = Math.hypot(...u);
      const al = (rel[0] * u[0] + rel[1] * u[1] + rel[2] * u[2]) / L;
      if (al < 20 || al > L - 10) continue;
      if (Math.hypot(...rel.map((x, j) => x - u[j] / L * al)) < 32) onLine.push(nm(se, th) + (team(se, i) === vt ? ' (his teammate)' : ''));
    }
    const out = { t: +(th - killer.t).toFixed(2), hp: `${d.from}>${d.to}`, dmg: d.dmg, snd: (d.snd || []).map(([, s]) => s), dead: !!d.dead };
    if (!c) return Object.assign(out, { by: null, why: 'no enemy fired or aimed at him' });
    out.by = nm(c.e, th); out.byKiller = c.e === killer.killer; out.gun = c.gun; out.dist = Math.round(c.dist); out.off = Math.round(c.off);
    out.fired = c.shot; out.unsure = !!(cands[1] && cands[1].off - c.off < 16); if (out.unsure) out.rival = `${nm(cands[1].e, th)} ${Math.round(cands[1].off)}`;
    [out.aimLine, out.bodyLine] = lines(c, th);
    if (fall) { out.verdict = 'fall'; return out; }
    if (nade) { out.verdict = 'grenade nearby'; return out; }
    if (mate) out.mate = mate;
    if (onLine.length) out.onLine = onLine;
    if (!d.snd || !d.snd.length) { out.verdict = 'no hit sound'; return out; }
    const rs = d.snd.map(([, s]) => range(c.gun, c.dist, s)); if (rs.some((r) => !r)) { out.verdict = 'gun not modelled'; return out; }
    out.open = rs.length === 1 ? `${rs[0][0]}-${rs[0][1]}` : rs.map((r) => `${r[0]}-${r[1]}`).join(' + ');
    out.wallMax = rs.reduce((a, r) => a + r[2], 0);
    const lo = rs.reduce((a, r) => a + r[0], 0), hi = rs.reduce((a, r) => a + r[1], 0);
    if (d.dead) { out.left = d.dmg; out.verdict = d.dmg > out.wallMax + 1 ? 'open (more than a surface lets through)' : 'unknown (kill: only what he had left shows)'; return out; }
    out.verdict = d.dmg < lo - 1 ? 'through a surface (less than the gun does in the open)' : d.dmg > out.wallMax + 1 ? 'open (more than a surface lets through)' : 'either';
    if (d.dmg > hi + 1) out.verdict += '; more than one bullet?';
    return out;
  };
  // calibration (window.__calib): every survived hit with one hit sound and one shooter who fired, as damage over the
  // bullet's damage at that distance (the gun's first variant), so the game's hit groups and armour show as peaks
  if (window.__calib) {
    const out = [];
    for (const d of drops) {
      if (d.dead || !d.snd || d.snd.length !== 1) continue;
      const h = judge(d, { t: d.t, killer: -1 });
      if (!h.by || !h.fired || h.unsure || !GUN[h.gun]) continue;
      out.push([h.gun, h.snd[0], h.dmg, at(h.gun, h.dist)[0], h.dist, h.aimLine, h.bodyLine]);
    }
    return { map: D.mapName, firesKept: M.firesKept, calib: out };
  }
  const eyeOf = (p) => [p[0], p[1], p[2] + (p[3] ? 12 : 17)];
  const res = [];
  for (const k of D.kills) {
    if (!k.kpos || !k.vpos || k.killer === k.victim || NO_WB.has(k.weapon) || ONE_SURFACE.has(k.weapon) || k.wb) continue;
    if (!M.liveR.some((r) => r.n === k.round) || (M.skipRestart || []).some((st) => Math.abs(st - k.t) <= 0.3)) continue;
    const tP = k.tPos != null ? k.tPos : k.t;
    const skip = brokenSet(tP - 0.05); for (const m of notCover) skip.add(m);
    const poses = posesAt(tP - 0.05), kNow = [...k.kpos, k.kduck], vNow = [...k.vpos, k.vduck], eye = eyeOf(kNow);
    // the finder's 15 points (computeWallbangs): which of them see him
    const dx = vNow[0] - eye[0], dy = vNow[1] - eye[1], hl = Math.hypot(dx, dy) || 1, px = -dy / hl, py = dx / hl;
    let seenPts = 0; for (const z of (vNow[3] ? [-12, 0, 10, 16] : [-30, -12, 6, 22, 30])) for (const sd of [-12, 0, 12]) if (solidAlong(bsp, eye, [vNow[0] + px * sd, vNow[1] + py * sd, vNow[2] + z], 2, skip, poses).solid === 0) seenPts++;
    if (!seenPts) continue; // hidden: the finder judged it (wallbang, or too much damage for a wall)
    let raw = k.kang ? k.kang[0] : 0; if (raw > 180) raw -= 360;
    const pitch = -raw * 3 * Math.PI / 180, yaw = (k.kang ? k.kang[1] : 0) * Math.PI / 180;
    const dist = Math.hypot(k.vpos[0] - eye[0], k.vpos[1] - eye[1], k.vpos[2] - eye[2]);
    const end = [eye[0] + Math.cos(pitch) * Math.cos(yaw) * dist, eye[1] + Math.cos(pitch) * Math.sin(yaw) * dist, eye[2] - Math.sin(pitch) * dist];
    const aim = solidAlong(bsp, eye, end, 2, skip, poses, 'bullet');
    if (aim.solid === 0) continue;
    // the fight: his drops going back from the kill, each within 2 s of the next, at most 6 s
    const tEnd = (k.tMsg != null ? k.tMsg : k.t) + 0.05, fight = [];
    let edge = tEnd;
    for (const d of (byV[k.victim] || []).filter((x) => x.t <= tEnd && x.t >= tEnd - 6).reverse()) { if (edge - d.t > 2) break; fight.unshift(d); edge = d.t; }
    const r = M.rounds.find((x) => x.n === k.round);
    const hs = fight.map((d) => judge(d, k));
    const mine = hs.filter((h) => h.byKiller && !h.dead);
    const kill = hs.find((h) => h.dead);
    // proof: a hit of the killer's that only a surface explains, with no doubt about who fired it
    // and the demo has his shot (a shooter matched only by his aim isn't proof: NEO on Edward, Na`Vi vs FX, Dust2, SEC
    // 2011, R23 1:09, Sujan saw him reloading), and no other player stood on the line
    const sure = mine.filter((h) => /^through/.test(h.verdict || '') && !h.unsure && !h.mate && h.fired && !h.onLine);
    const proven = sure.length > 0;
    res.push({
      at: `R${r ? r.ln : '?'} ${clockText(k.t)}`, demoTime: +(k.t - D.start).toFixed(1), killer: nm(k.killer, k.t), victim: nm(k.victim, k.t), gun: k.weapon, hs: !!k.hs,
      dist: Math.round(dist), seenPts, aimSolid: Math.round(aim.solid),
      verdict: proven ? (kill && /^open/.test(kill.verdict) ? 'THROUGH A SURFACE BEFORE, KILLING BULLET IN THE OPEN' : 'THROUGH A SURFACE') : (kill && /^open/.test(kill.verdict) ? 'NO: killing bullet in the open' : mine.length ? 'NO PROOF' : 'NO PROOF (killing bullet only)'),
      lastWall: proven ? Math.max(...sure.map((h) => h.t)) : null, killerFired: hs.some((h) => h.dead && h.byKiller && h.fired),
      hits: hs,
    });
  }
  return { map: D.mapName, firesKept: M.firesKept, wallbangs: (M.wbs || []).length, n: res.length, kills: res };
})()
