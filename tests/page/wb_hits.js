// Wallbang hits that didn't kill (prototype, 25 Oct 2026; IDEAS.md "Wallbang hits that didn't kill", rules decided
// by Sujan 25 Oct 2026). Every health drop a player survives, with a hit sound on him, is tied to the enemy who
// fired just before it and whose aim line passes closest to him (left unknown when two are about as close); it
// counts as through cover when both the crosshair line and the line to the part that was hit (head for a headshot
// sound, else the chest) pass through what a bullet hits, as the wallbang finder judges kills (breakables and
// invisible brushes aren't cover). Hits near a grenade blast are left out. Through-cover hits on one victim within
// 2 s of the last make a burst (hits in the open neither break it nor count); a burst of 35 HP or more is listed
// with each shooter's share, largest first, and joins a wallbang kill that ends it. Waits for the map.
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
  const shots = {}; const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) (shots[sh[i + 1]] ||= []).push(sh[i]);
  const booms = []; const b = D.booms || []; for (let i = 0; i < b.length; i += 4) booms.push([b[i], b[i + 1], b[i + 2], b[i + 3]]);
  const notCover = bsp.solids.filter((x) => x.shootable).map((x) => x.model);
  const live = (t) => M.liveR.find((r) => t >= r.start && (r.end == null || t <= r.end + 0.5));
  // health drops a player survived
  const last = {}, drops = [];
  for (let i = 0; i < D.hp.length; i += 3) {
    const t = D.hp[i], e = D.hp[i + 1], v = D.hp[i + 2];
    const p = last[e]; last[e] = v;
    if (p != null && v > 0 && v < p) drops.push({ t, e, dmg: p - v, hpAfter: v });
  }
  const stat = { drops: drops.length, withSound: 0, nearNade: 0, noShooter: 0, unknown: 0, open: 0, cover: 0, oneSurface: 0 };
  const coverHits = [];
  for (const d of drops) {
    if (!live(d.t)) continue;
    const hs = (hits[d.e] || []).filter(([t]) => t >= d.t - 0.12 && t <= d.t + 0.02);
    if (!hs.length) continue; stat.withSound++;
    const head = hs.some(([, h]) => h);
    const i = idx(d.t), v = D.slots[d.e]; if (!v || isNaN(v[i * S])) continue;
    const vp = [v[i * S], v[i * S + 1], v[i * S + 2]], vduck = v[i * S + 7];
    if (booms.some(([t, x, y, z]) => d.t - t >= -0.05 && d.t - t < 0.4 && Math.hypot(x - vp[0], y - vp[1], z - vp[2]) < 450)) { stat.nearNade++; continue; }
    const vt = team(d.e, i);
    const cands = [];
    for (const e in shots) {
      const se = +e; if (se === d.e) continue;
      const st = (shots[se]).filter((t) => t >= d.t - 0.15 && t <= d.t + 0.001); if (!st.length) continue;
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
      cands.push({ e: se, eye, dir, along, off, tgt, weapon: null });
    }
    if (!cands.length) { stat.noShooter++; continue; }
    cands.sort((x, y) => x.off - y.off);
    const c = cands[0];
    if (c.off > 64 || (cands[1] && cands[1].off - c.off < 16)) { stat.unknown++; continue; }
    const skip = brokenSet(d.t - 0.05); for (const m of notCover) skip.add(m);
    const poses = posesAt(d.t - 0.05);
    const end = [c.eye[0] + c.dir[0] * c.along, c.eye[1] + c.dir[1] * c.along, c.eye[2] + c.dir[2] * c.along];
    const aim = solidAlong(bsp, c.eye, end, 2, skip, poses, 'bullet');
    const zone = solidAlong(bsp, c.eye, c.tgt, 2, skip, poses, 'bullet');
    if (aim.solid === 0 || zone.solid === 0) { stat.open++; continue; }
    stat.cover++;
    const r = live(d.t);
    coverHits.push({ t: d.t, v: d.e, s: c.e, dmg: d.dmg, hpAfter: d.hpAfter, head, thick: Math.round(zone.solid), dist: Math.round(c.along), round: r ? r.ln : null, clock: clockText(d.t), demo: fmt(d.t - D.start), offAim: Math.round(c.off), what: (aim.hit || []).some((h) => h.model !== 0) ? 'object' : 'wall' });
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
    if (kill) { const before = bu.hits[bu.hits.length - 1].hpAfter; share[kill.killer] = (share[kill.killer] || 0) + before; total += before; }
    if (total < MIN) continue;
    const h0 = bu.hits[0];
    out.push({ round: h0.round, clock: h0.clock, demo: h0.demo, t0: +h0.t.toFixed(2), t1: +(kill ? kill.t : bu.end).toFixed(2), victim: nm(bu.v), total, kill: kill ? `${M.pl[kill.kp].name} ${kill.weapon}${kill.wb.loose ? ' (LOOSE)' : ''}` : null,
      shooters: Object.entries(share).sort((a, c) => c[1] - a[1]).map(([e, n]) => `${nm(+e)} ${n}`),
      raw: bu.hits.map((h) => ({ t: +h.t.toFixed(3), s: h.s, v: h.v, dmg: h.dmg, head: h.head })), killT: kill ? +kill.t.toFixed(3) : null, killer: kill ? kill.killer : null,
      hits: bu.hits.map((h) => `${h.demo} ${nm(h.s)} -${h.dmg}${h.head ? ' head' : ''} (${h.thick}u ${h.what}, ${h.dist}u away, aim ${h.offAim}u off)`) });
  }
  return { demo: D.fileName, stat, coverHits: coverHits.length, bursts: bursts.length, listed: out.length, withKill: out.filter((x) => x.kill).length, out };
})()
