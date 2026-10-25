// Wallbang hits that didn't kill (prototype, 25 Oct 2026; IDEAS.md "Wallbang hits that didn't kill", rules decided
// by Sujan 25 Oct 2026). Every health drop a player survives, with a hit sound on him, is tied to the enemy who
// fired just before it and whose aim line passes closest to him (left unknown when two are about as close); it
// counts as through cover when both the crosshair line and the line to the part that was hit (head for a headshot
// sound, else the chest) pass through what a bullet hits, as the wallbang finder judges kills (breakables and
// invisible brushes aren't cover). Hits near a grenade blast are left out. Through-cover hits on one victim within
// 2 s of the last make a burst (hits in the open neither break it nor count); a burst of 35 HP or more is listed
// with each shooter's share, largest first, and joins a wallbang kill that ends it. Waits for the map. Changed 26 Oct
// 2026 after Sujan's check of 24 bursts: the first hit of a round counts from 100, a hit with more damage than the
// gun can do through a wall is in the open, the kill adds his health just before it, and in demos without fire
// events the enemy aiming at him is taken.
// window.__hitsMin (default 35) changes the listing threshold.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  while ((M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null)) && Date.now() - t0 < 600000) await wait(500);
  const bsp = MAP.bsp, S = D.stride, times = D.times;
  const idx = (t) => { let lo = 0, hi = times.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (times[m] <= t + 1e-4) lo = m; else hi = m - 1; } return lo; };
  const team = (e, i) => { const n = playerModelName(D.slots[e][i * S + 8]).toLowerCase(); return /terror|leet|arctic|guerilla/.test(n) ? 'T' : /urban|gsg9|sas|gign|vip/.test(n) ? 'CT' : null; };
  const nm = (e, t) => { const k = D.kills.find((x) => x.killer === e && M.pl[x.kp]); const p = k ? M.pl[k.kp] : null; return p ? p.name : (D.players[e] || {}).name || '?'; };
  const sname = (i) => String((D.sounds && D.sounds[i]) || '').toLowerCase();
  const hits = {}; const s = D.snds || [];
  for (let i = 0; i < s.length; i += 10) { const n = sname(s[i + 1]); if (/player\/(bhit|headshot)/.test(n)) (hits[s[i + 2]] ||= []).push([s[i], /headshot|helmet/.test(n)]); }
  // each shot with its gun, from the fire event's name (events/ak47.sc); guns whose bullets stop at the first surface
  // (ONE_SURFACE, as for kills) can't hit through cover
  const evGun = (i) => String((D.events && D.events[i]) || '').toLowerCase().replace(/^.*\//, '').replace(/\.sc$/, '').replace(/^mp5n$/, 'mp5navy').replace(/^elite_(left|right)$/, 'elite');
  const shots = {}, gunAt = {}; const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) { (shots[sh[i + 1]] ||= []).push(sh[i]); (gunAt[sh[i + 1]] ||= []).push(evGun(sh[i + 2])); }
  const booms = []; const b = D.booms || []; for (let i = 0; i < b.length; i += 4) booms.push([b[i], b[i + 1], b[i + 2], b[i + 3]]);
  const notCover = bsp.solids.filter((x) => x.shootable).map((x) => x.model);
  const live = (t) => M.liveR.find((r) => t >= r.start && (r.end == null || t <= r.end + 0.5));
  // health drops a player survived. Everyone starts a round on 100, which the demo doesn't send, so the first hit
  // of a round counts from 100 (26 Oct 2026: the first hit of every round was missed, Tixo 100 to 85, mousesports vs
  // SK, Nuke, Extreme Masters II, R9).
  const starts = (M.rounds || []).map((r) => r.start).sort((x, y) => x - y);
  const roundOf = (t) => { let k = -1; for (let j = 0; j < starts.length && starts[j] <= t; j++) k = j; return k; };
  const last = {}, lastR = {}, drops = [], hpLog = {};
  for (let i = 0; i < D.hp.length; i += 3) {
    const t = D.hp[i], e = D.hp[i + 1], v = D.hp[i + 2], rn = roundOf(t);
    let p = last[e]; if (lastR[e] !== rn) p = 100;
    last[e] = v; lastR[e] = rn; (hpLog[e] ||= []).push([t, v]);
    if (p != null && v > 0 && v < p) drops.push({ t, e, dmg: p - v, hpAfter: v });
  }
  // the victim's health just before a moment (for the killing hit: what the kill took)
  const hpBefore = (e, t) => { let h = 100; const rn = roundOf(t); for (const [tt, v] of hpLog[e] || []) { if (tt > t + 1e-4) break; if (v > 0 && roundOf(tt) === rn) h = v; } return h; }; // a reading in the kill's own snapshot counts (THREAT 15, 3, then 0 at once)
  const stat = { drops: drops.length, withSound: 0, nearNade: 0, noShooter: 0, unknown: 0, open: 0, cover: 0, oneSurface: 0 };
  const coverHits = [], why = [];
  const dbg = window.__debugV; // {v: victim slot, from, to}: why each of his drops was or wasn't counted
  const note = (d, r, extra) => { if (dbg && d.e === dbg.v && d.t >= dbg.from && d.t <= dbg.to) why.push(`${d.t.toFixed(3)} -${d.dmg} ${r}${extra ? ' ' + extra : ''}`); };
  for (const d of drops) {
    if (!live(d.t)) continue;
    const hs = (hits[d.e] || []).filter(([t]) => t >= d.t - 0.12 && t <= d.t + 0.02);
    if (!hs.length) continue; stat.withSound++;
    const head = hs.some(([, h]) => h);
    const i = idx(d.t), v = D.slots[d.e]; if (!v || isNaN(v[i * S])) continue;
    const vp = [v[i * S], v[i * S + 1], v[i * S + 2]], vduck = v[i * S + 7];
    // a fall: the game plays the same hit sound for fall damage (Pain() in player.cpp, after TakeDamage with DMG_FALL),
    // so a drop as he lands after falling 100 units or more in the last second is a fall, not a bullet (Sujan, 26 Oct
    // 2026: zonic falls 330 units and lands on 46 HP, FX vs mTw, Nuke, Xperia Play 2011, R10 1:21)
    { let zTop = vp[2]; for (let j = i; j >= 0 && times[j] >= d.t - 1; j--) if (!isNaN(v[j * S + 2])) zTop = Math.max(zTop, v[j * S + 2]);
      const zPrev = i >= 2 ? v[(i - 2) * S + 2] : vp[2];
      if (zTop - vp[2] >= 100 && zPrev - vp[2] >= 20) { stat.fall = (stat.fall || 0) + 1; note(d, 'fall', `${Math.round(zTop - vp[2])} units`); continue; } }
    if (booms.some(([t, x, y, z]) => d.t - t >= -0.05 && d.t - t < 0.4 && Math.hypot(x - vp[0], y - vp[1], z - vp[2]) < 450)) { stat.nearNade++; note(d, 'grenade'); continue; }
    const vt = team(d.e, i);
    const cands = [];
    for (const e in shots) {
      const se = +e; if (se === d.e) continue;
      let li = -1; shots[se].forEach((t, j) => { if (t >= d.t - 0.15 && t <= d.t + 0.001) li = j; }); if (li < 0) continue;
      const gun = gunAt[se][li]; if (ONE_SURFACE.has(gun) || /knife|grenade|flash|smoke/.test(gun)) { stat.oneSurface++; continue; }
      const a = D.slots[se]; if (!a || isNaN(a[i * S])) continue;
      if (team(se, i) === vt) continue;
      const eye = [a[i * S], a[i * S + 1], a[i * S + 2] + (a[i * S + 7] ? 12 : 17)];
      let raw = a[i * S + 4]; if (raw > 180) raw -= 360;
      const pitch = -raw * 3 * Math.PI / 180, yaw = a[i * S + 3] * Math.PI / 180;
      const dir = [Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), -Math.sin(pitch)];
      const tgt = [vp[0], vp[1], vp[2] + (head ? (vduck ? 16 : 28) : (vduck ? 4 : 10))];
      const rel = [tgt[0] - eye[0], tgt[1] - eye[1], tgt[2] - eye[2]];
      const along = rel[0] * dir[0] + rel[1] * dir[1] + rel[2] * dir[2]; if (along <= 0) continue;
      const off = Math.hypot(rel[0] - dir[0] * along, rel[1] - dir[1] * along, rel[2] - dir[2] * along);
      cands.push({ e: se, eye, dir, along, off, tgt, gun });
    }
    // Some demos leave out fire events (the 2008 ones above all: no shot recorded for most hits). Then the enemy whose
    // aim passes within 32 units of him, with a gun that can shoot through walls, is taken when no other comes close.
    let aimOnly = false;
    if (!cands.length) {
      for (const e in D.slots) {
        const se = +e; if (se === d.e) continue;
        const a = D.slots[se]; if (!a || isNaN(a[i * S]) || !(a[i * S + 5] > 0)) continue;
        if (team(se, i) === vt || team(se, i) == null) continue;
        const gun = weaponShort(D.models[a[i * S + 6]]); if (!MAX_DMG[gun]) continue;
        const eye = [a[i * S], a[i * S + 1], a[i * S + 2] + (a[i * S + 7] ? 12 : 17)];
        let raw = a[i * S + 4]; if (raw > 180) raw -= 360;
        const pitch = -raw * 3 * Math.PI / 180, yaw = a[i * S + 3] * Math.PI / 180;
        const dir = [Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), -Math.sin(pitch)];
        const tgt = [vp[0], vp[1], vp[2] + (head ? (vduck ? 16 : 28) : (vduck ? 4 : 10))];
        const rel = [tgt[0] - eye[0], tgt[1] - eye[1], tgt[2] - eye[2]];
        const along = rel[0] * dir[0] + rel[1] * dir[1] + rel[2] * dir[2]; if (along <= 0) continue;
        const off = Math.hypot(rel[0] - dir[0] * along, rel[1] - dir[1] * along, rel[2] - dir[2] * along);
        if (off <= 32) cands.push({ e: se, eye, dir, along, off, tgt, gun });
      }
      aimOnly = cands.length > 0;
    }
    if (!cands.length) { stat.noShooter++; note(d, 'no shooter'); continue; }
    cands.sort((x, y) => x.off - y.off);
    const c = cands[0];
    // the only enemy shooting may aim a little wider (aim is recorded about ten times a second; NoSound's last hit on
    // SNAJDINHO, mTw vs Lions, Nuke, DreamHack Summer 2011, R8, passed 68 units off)
    if (c.off > (cands.length === 1 && !aimOnly ? 96 : 64) || (cands[1] && cands[1].off - c.off < 16)) { stat.unknown++; note(d, 'unknown', cands.slice(0, 2).map((x) => `${x.e}:${Math.round(x.off)}`).join(' ')); continue; }
    // more damage than this gun's bullet can do through any wall (as for kills, 0.15.5): hit in the open
    const per = MAX_DMG[c.gun];
    // two bullets can land between two health readings: one hit sound each, so the limit is per sound
    const nb = Math.max(1, hs.filter(([t]) => Math.abs(t - d.t) <= 0.02).length);
    if (per && d.dmg > per * 0.6 * (head ? 4 : 1.25) * nb) { stat.tooMuch = (stat.tooMuch || 0) + 1; note(d, 'too much damage for a wall', c.gun); continue; }
    const skip = brokenSet(d.t - 0.05); for (const m of notCover) skip.add(m);
    const poses = posesAt(d.t - 0.05);
    const end = [c.eye[0] + c.dir[0] * c.along, c.eye[1] + c.dir[1] * c.along, c.eye[2] + c.dir[2] * c.along];
    const aim = solidAlong(bsp, c.eye, end, 2, skip, poses, 'bullet');
    const zone = solidAlong(bsp, c.eye, c.tgt, 2, skip, poses, 'bullet');
    if (aim.solid === 0 || zone.solid === 0) { stat.open++; note(d, 'open', `aim ${Math.round(aim.solid)} zone ${Math.round(zone.solid)} off ${Math.round(c.off)}`); continue; }
    note(d, 'cover', `aim ${Math.round(aim.solid)} zone ${Math.round(zone.solid)} off ${Math.round(c.off)}`);
    stat.cover++;
    const r = live(d.t);
    coverHits.push({ t: d.t, v: d.e, s: c.e, dmg: d.dmg, hpAfter: d.hpAfter, head, thick: Math.round(zone.solid), dist: Math.round(c.along), round: r ? r.ln : null, clock: clockText(d.t), demo: fmt(d.t - D.start), offAim: Math.round(c.off), gun: c.gun, aimOnly, what: (aim.hit || []).some((h) => h.model !== 0) ? 'object' : 'wall' });
  }
  // bursts: through-cover hits on one victim, each within 2 s of the last
  const byV = {}; for (const h of coverHits) (byV[h.v] ||= []).push(h);
  const bursts = [];
  for (const v in byV) {
    let cur = null;
    for (const h of byV[v]) {
      if (cur && h.t - cur.end <= 2) { cur.hits.push(h); cur.end = h.t; } else { cur = { v: +v, hits: [h], start: h.t, end: h.t }; bursts.push(cur); }
    }
  }
  const MIN = window.__hitsMin || 35;
  const out = [];
  for (const bu of bursts) {
    const kill = D.kills.find((k) => k.victim === bu.v && k.wb && k.t >= bu.end && k.t - bu.end <= 2 && bu.hits.some((h) => h.s === k.killer));
    const share = {}; for (const h of bu.hits) share[h.s] = (share[h.s] || 0) + h.dmg;
    let total = bu.hits.reduce((a, h) => a + h.dmg, 0);
    // the kill takes what he had left just before it (26 Oct 2026: it used his health after the last counted hit, so
    // ari, SK vs eSTRO, Nuke, WCG 2008, R7, read 91 where hits in the open had taken most of it)
    if (kill) { const before = hpBefore(bu.v, kill.t); share[kill.killer] = (share[kill.killer] || 0) + before; total += before; }
    if (total < MIN) continue;
    const h0 = bu.hits[0];
    out.push({ round: h0.round, clock: h0.clock, demo: h0.demo, t0: +h0.t.toFixed(2), t1: +(kill ? kill.t : bu.end).toFixed(2), victim: nm(bu.v), total, kill: kill ? `${M.pl[kill.kp].name} ${kill.weapon}${kill.wb.loose ? ' (LOOSE)' : ''}` : null,
      shooters: Object.entries(share).sort((a, c) => c[1] - a[1]).map(([e, n]) => `${nm(+e)} ${n}`),
      raw: bu.hits.map((h) => ({ t: +h.t.toFixed(3), s: h.s, v: h.v, dmg: h.dmg, head: h.head, gun: h.gun, aimOnly: h.aimOnly })), killT: kill ? +kill.t.toFixed(3) : null, killer: kill ? kill.killer : null,
      hits: bu.hits.map((h) => `${h.demo} ${nm(h.s)} ${h.gun} -${h.dmg}${h.head ? ' head' : ''} (${h.thick}u ${h.what}, ${h.dist}u away, aim ${h.offAim}u off${h.aimOnly ? ', no shot recorded' : ''})`) });
  }
  return { demo: D.fileName, why, stat, coverHits: coverHits.length, bursts: bursts.length, listed: out.length, withKill: out.filter((x) => x.kill).length, out };
})()
