// ---------------- kills at the moment they happened ----------------
// Some demos deliver the kill message late: in the 2006 NoA vs Pentagram Train demo it trails the
// victim's death sound by 0.11 s on average and up to 0.33 s (the 2011 demos: 0 s, with a rare late one).
// By then a peeking AWPer is back behind cover, so the wallbang check and the kill marker were wrong.
// The death sound is recorded at the real moment. A kill whose message trails it by more than 0.05 s is
// moved back to the killing shot (the killer's last shot up to 0.3 s before the death sound), or to the
// death sound itself when the demo has no such shot, and its positions and aim are read from that moment.
// Kills that arrive on time are left exactly as they were. k.tMsg keeps when the message arrived.
// The kill itself (kill feed, markers, death cam, timeline) is shown at the death sound, when the victim's
// death animation starts and his health drops. The positions and aim stay those of the killing shot
// (k.tPos), for the wallbang check. In that demo the gun's fire events come about 0.2 s ahead of the hits
// they cause (neo's M4 on ave, round 22: last shot 27:43.99, hit and death sound 27:44.21, message
// 27:44.43), so showing the kill at the shot had the kill feed say "dead" while ave still ran on 9 HP (0.15.5).
function retimeKills() {
  const sn = (i) => String((D.sounds && D.sounds[i]) || '').toLowerCase();
  const dieAt = {}, shotAt = {};
  const s = D.snds || [];
  for (let i = 0; i < s.length; i += 10) if (/player\/(die|death)/.test(sn(s[i + 1]))) (dieAt[s[i + 2]] || (dieAt[s[i + 2]] = [])).push(s[i]);
  const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) (shotAt[sh[i + 1]] || (shotAt[sh[i + 1]] = [])).push(sh[i]);
  const S = D.stride, times = D.times;
  const idx = (t) => { let lo = 0, hi = times.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (times[m] <= t) lo = m; else hi = m - 1; } return lo; };
  const lastIn = (arr, from, to) => { let r = null; if (arr) for (const t of arr) { if (t > to) break; if (t > from) r = t; } return r; };
  let moved = 0;
  for (const k of D.kills) {
    if (k.tMsg != null) continue;
    k.tMsg = k.t;
    if (k.killer === k.victim) continue;
    const ds = lastIn(dieAt[k.victim], k.t - 1, k.t + 0.001);
    if (ds == null || k.t - ds <= 0.05) continue;
    const st = lastIn(shotAt[k.killer], ds - 0.3, ds + 0.001);
    const tA = st != null ? st : ds;
    const a = D.slots[k.killer], v = D.slots[k.victim], i = idx(tA) * S;
    if (a && !isNaN(a[i])) { k.kpos = [a[i], a[i + 1], a[i + 2]]; k.kang = [a[i + 4], a[i + 3]]; k.kduck = a[i + 7]; }
    if (v && !isNaN(v[i])) { k.vpos = [v[i], v[i + 1], v[i + 2]]; k.vduck = v[i + 7]; }
    k.t = ds; k.tPos = tA; k.retimed = st != null ? 'shot' : 'sound'; moved++;
  }
  D.kills.sort((x, y) => x.t - y.t);
  D.killsRetimed = moved;
}

// ---------------- derive match structure ----------------
// A demo that starts partway into a round: its kills come before the first round marker. The second FX
// vs mTw Inferno file (Xperia Play 2011) starts in the second half's pistol round, where mTw kill all five
// FX before the marker at 0:27. That round counts. Its winner comes from the scoreboard at the next
// marker (one side on 1, the other on 0), or failing that from one side losing five players.
// kills0: the kills before the first marker; r1: the first round; returns the round, or null.
function leadingRound(kills0, r1, start, n) {
  const k0 = kills0.filter((k) => k.killer !== k.victim);
  if (!k0.length || !r1) return null;
  let winner = null;
  if ((r1.scoreT || 0) + (r1.scoreCT || 0) === 1) winner = r1.scoreT ? 'T' : 'CT';
  else {
    const dead = { TERRORIST: new Set(), CT: new Set() };
    for (const k of k0) if (dead[k.vteam]) dead[k.vteam].add(k.victim);
    if (dead.CT.size >= 5) winner = 'T'; else if (dead.TERRORIST.size >= 5) winner = 'CT';
  }
  return { n, start, end: r1.start, endT: kills0[kills0.length - 1].t, winner, reason: winner ? 'elimination' : null, scoreT: 0, scoreCT: 0, partial: true };
}
function derive() {
  retimeKills();
  const S = D.stride, times = D.times, n = times.length;
  const idxAt = (t) => { let lo = 0, hi = n - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (times[mid] <= t) lo = mid; else hi = mid - 1; } return lo; };
  // ---- people ----
  // A slot can be reused when someone leaves and another person joins, so identity follows the
  // connection (occupant), and connections are merged into one person by Steam ID or by a shared name.
  const occ = (D.occupants || []).map((o) => Object.assign({}, o));
  const opar = occ.map((o, i) => i);
  const ofind = (x) => opar[x] === x ? x : (opar[x] = ofind(opar[x]));
  // the same Steam ID is the same person, whatever name they used (and across the parts of a joined map).
  // Only a real one: on a LAN server every player can have "0" (Na`Vi vs FX, SEC 2011 final, Train and Dust2),
  // so "0", anything that isn't a number, and an ID two connections hold at the same time identify nobody.
  const sidBad = new Set();
  for (const o of occ) if (!o.sid || !/^\d+$/.test(o.sid) || /^0+$/.test(o.sid)) o.sid && sidBad.add(o.sid);
  for (const a of occ) for (const b of occ) if (a !== b && a.sid && a.sid === b.sid && a.from < (b.to != null ? b.to : D.end) && b.from < (a.to != null ? a.to : D.end)) sidBad.add(a.sid);
  const nameSpans = (o) => { const nt = o.nameT && o.nameT.length ? o.nameT : o.names.map((nm) => [o.from, nm]); return nt.map(([a, nm], i) => [a, i + 1 < nt.length ? nt[i + 1][0] : (o.to != null ? o.to : D.end), nm]); };
  const pl = {};
  // Group connections into people. By name, only names nameOK allows: the people are grouped twice, first by
  // Steam ID alone (enough to find the live rounds), then again with the names used during the live rounds.
  // A name used only in the warmup doesn't join two connections, so two players who both sat on a placeholder
  // nick ("Player") before the match stay apart.
  // the earliest connection stays the root, so a person keeps the same id however they were joined
  const join = (x, y) => { const a = ofind(x), b = ofind(y); if (a !== b) opar[Math.max(a, b)] = Math.min(a, b); };
  const group = (nameOK) => {
    for (let i = 0; i < opar.length; i++) opar[i] = i;
    const bySid = {};
    for (const o of occ) if (o.sid && !sidBad.has(o.sid)) { if (bySid[o.sid] != null) join(o.id, bySid[o.sid]); else bySid[o.sid] = o.id; }
    if (nameOK) {
      // A name joins two connections when one of them used it during the live rounds (cehe4k reconnected in
      // the warmup of Na`Vi vs FX, Train, SEC 2011 final). A name used only outside the live rounds joins them
      // when at most one of them played live: Edward on the Dust2 map of that final reconnected in the warmup as
      // "Na`Vi Edward /A/" both times and played as "EdwardwOw~", while two players who both sat on "Player"
      // in the warmup and then played the match are two people.
      const byName = {};
      for (const o of occ) for (const [a, b, nm] of nameSpans(o)) { if (!nameOK(a, b)) continue; if (byName[nm] != null) join(o.id, byName[nm]); else byName[nm] = o.id; }
      const played = (o) => nameSpans(o).some(([a, b]) => nameOK(a, b));
      const other = {};
      for (const o of occ) for (const [a, b, nm] of nameSpans(o)) if (!nameOK(a, b)) { if (byName[nm] != null) join(o.id, byName[nm]); else (other[nm] || (other[nm] = new Set())).add(o); }
      for (const nm in other) { const L = [...other[nm]]; if (L.filter(played).length <= 1) for (const o of L) join(o.id, L[0].id); }
    }
    for (const k in pl) delete pl[k];
    for (const o of occ) {
      const pid = 'p' + ofind(o.id); o.pid = pid;
      const p = pl[pid] || (pl[pid] = { pid, name: '?', occs: [], hltv: true, lastFrom: -1 });
      p.occs.push(o); p.hltv = p.hltv && o.hltv;
      if (o.from >= p.lastFrom && o.names.length) { p.name = cleanName(o.names[o.names.length - 1]); p.lastFrom = o.from; }
    }
    for (const k of D.kills) {
      k.kp = k.kocc >= 0 && occ[k.kocc] ? occ[k.kocc].pid : (D.players[k.killer] ? personAt(k.killer, k.t) : null);
      k.vp = k.vocc >= 0 && occ[k.vocc] ? occ[k.vocc].pid : personAt(k.victim, k.t);
    }
  };
  const occBySlot = {};
  for (const o of occ) (occBySlot[o.slot] || (occBySlot[o.slot] = [])).push(o);
  // Who is in a slot at time t. When the connection that held it has ended but someone is still playing in
  // the slot (the FX vs SK Inferno demo drops KUBEN's connection at the start of round 28 while he plays on),
  // it's still the slot's last occupant: nobody else has taken it.
  const playingAt = (slot, t) => { const a = D.slots[slot]; return !!a && a[idxAt(t) * S + 5] !== 0; };
  const occAt = (slot, t) => {
    const list = occBySlot[slot]; if (!list) return null;
    for (let i = list.length - 1; i >= 0; i--) { const o = list[i]; if (o.from <= t + 0.01 && (o.to == null || t < o.to)) return o; }
    if (!playingAt(slot, t)) return null;
    for (let i = list.length - 1; i >= 0; i--) if (list[i].from <= t + 0.01) return list[i];
    return null;
  };
  const personAt = (slot, t) => {
    const o = occAt(slot, t); if (o) return o.pid;
    const pid = 's' + slot; // no connection info for this slot: treat the slot as the person
    if (!pl[pid]) pl[pid] = { pid, name: cleanName((D.players[slot] || {}).name), occs: [], hltv: false };
    return pid;
  };
  const slotOf = (pid, t) => {
    const p = pl[pid]; if (!p) return null;
    if (pid[0] === 's') return +pid.slice(1);
    for (const o of p.occs) if (occAt(o.slot, t) === o) return o.slot;
    return null;
  };
  group(null);

  // rounds: mark restarts and live segments
  const restarts = D.bomb.filter((b) => b.type === 'restart').map((b) => b.t);
  const rounds = D.rounds.map((r) => {
    const kills = D.kills.filter((k) => k.round === r.n);
    return Object.assign({}, r, { kills, dur: r.end - r.start });
  });
  // kills before the first round marker: see leadingRound
  const lead = leadingRound(D.kills.filter((k) => k.round === 0), rounds[0], D.start, 0);
  if (lead) { lead.kills = D.kills.filter((k) => k.round === 0); lead.dur = lead.end - lead.start; rounds.unshift(lead); }
  // segments split by restarts: any restart between two rounds starts a new stretch (the three restarts of a
  // "live on 3" each start a round of a second or two, which never count). Restarts used to be grouped
  // when less than 60 s apart, which joined two "lo3" starts 59 s apart in the FX vs SK Inferno demo.
  let seg = 0;
  let ri = 0;
  for (const r of rounds) {
    let any = false;
    while (ri < restarts.length && restarts[ri] < r.start) { ri++; any = true; }
    if (any) seg++;
    r.seg = seg;
  }
  // A stretch of rounds between restarts counts as the match when it starts from a fresh 0:0
  // scoreboard (a proper "live on 3") and has at least 4 real rounds. Warmups, knife rounds and
  // scrapped attempts that carry on an old score are left out.
  const segInfo = {};
  // In a joined map the stretch where a later part starts carries on the map, whatever its scoreboard shows
  // (rounds played before that recording started); a round in neither file says nothing about it.
  for (const r of rounds) {
    if (r.missing) continue;
    const g = segInfo[r.seg] || (segInfo[r.seg] = { fresh: (r.scoreT === 0 && r.scoreCT === 0) || !!r.partFirst, real: 0 });
    if (r.kills.length >= 3 && r.winner) g.real++;
  }
  let liveSegs = Object.keys(segInfo).filter((k) => segInfo[k].fresh && segInfo[k].real >= 4);
  if (!liveSegs.length) { // demo started mid-match: use the longest stretch
    const best = Object.keys(segInfo).sort((a, b) => segInfo[b].real - segInfo[a].real)[0];
    liveSegs = best != null ? [best] : [];
  }
  const counts = (r) => r.kills.length > 0 && r.dur > 5 && r.winner != null;
  // What the server's admin plugin announced beats guessing. Tournament servers print "Live !" (or
  // "LIVE LIVE LIVE") when a half starts, "End of 1st set" or "half time" when it ends, and "Current
  // set canceled" when a start is thrown away. When the demo has these, a round counts only if it
  // started while the match was announced live; otherwise the guess from restarts below decides.
  const windows = liveWindows(D.notes || [], (D.parts || []).slice(1).map((p) => p.start));
  if (windows.length) {
    for (const r of rounds) r.live = counts(r) && windows.some(([a, b]) => r.start >= a - 10 && r.start < b - 1);
    // Inside the announced match, a restart before a half is complete throws away what was played since
    // the last full half: the admins started again (a restart puts the score back to 0:0). In the FX vs SK
    // Inferno demo the second half was started, 7 rounds were played, then restarted with "live now,
    // sorry"; before the first half, two "lo3" starts were restarted after 0 and 1 rounds.
    // Only when the next stretch starts in the same announced window: a stretch the server closed itself (an
    // end of half, or a warmup before the next overtime, as in the Anexis vs fnatic demo, which starts in
    // overtime and plays each overtime as its own short stretch) is a complete part of the match.
    const winOf = (r) => windows.findIndex(([a, b]) => r.start >= a - 10 && r.start < b - 1);
    const segs = [...new Set(rounds.filter((r) => r.live).map((r) => r.seg))].sort((a, b) => a - b);
    let total = 0;
    for (let i = 0; i < segs.length; i++) {
      const rs = rounds.filter((r) => r.live && r.seg === segs[i]);
      const next = i < segs.length - 1 ? rounds.find((r) => r.live && r.seg === segs[i + 1]) : null;
      // a half is 15 rounds (12 in MR12), an overtime half 3
      // (A window closed by a warmup message isn't exempt: in the IOL Final4 SK vs dATeam Dust2 demo a one-round
      // start at 11:48 was followed by "Warmup Settings have been loaded".)
      const w = winOf(rs[rs.length - 1]);
      const closedByEnd = w >= 0 && windows[w][2] === 'end';
      if (next && (winOf(next) === w || !closedByEnd) && rs.length < (total >= 24 ? 3 : 12)) { for (const r of rs) r.live = false; continue; }
      total += rs.length;
    }
  } else if (D.pov) {
    // A demo recorded by a player, usually on a public server: there's no "live on 3" match structure
    // to find, so every round that was played to a result counts.
    for (const r of rounds) r.live = counts(r);
  } else {
    for (const r of rounds) r.live = liveSegs.includes(String(r.seg)) && counts(r);
    // False starts: a live stretch where a half should begin (or an overtime) that stops short
    // of a full half and is followed by another live start. Typical case: a few practice rounds on a
    // fresh 0:0, then the admins restart "live on 3" for the real match.
    const segs = [...new Set(rounds.filter((r) => r.live).map((r) => r.seg))].sort((a, b) => a - b);
    let total = 0;
    for (let i = 0; i < segs.length; i++) {
      const rs = rounds.filter((r) => r.live && r.seg === segs[i]);
      // also at half time: a short stretch played as the second-half warmup, then the real restart
      const halfStart = total === 0 || total === 15 || total === 12 || (total >= 30 && (total - 30) % 6 === 0);
      const minHalf = total >= 30 ? 3 : total ? 6 : 12;
      if (i < segs.length - 1 && halfStart && rs.length < minHalf) { for (const r of rs) r.live = false; continue; }
      total += rs.length;
    }
    // Overtime: after the match stretches, short stretches restarted from 0:0 with one to three real rounds
    // each are overtime halves (MR3). Stretches of restart rounds in between are skipped; anything else ends it.
    const lastSeg = Math.max(-1, ...rounds.filter((r) => r.live).map((r) => r.seg));
    if (lastSeg >= 0) for (let sg = lastSeg + 1; sg <= seg; sg++) {
      const g = segInfo[sg]; if (!g) continue;
      if (!g.real) continue;
      if (!g.fresh || g.real > 3) break;
      for (const r of rounds) if (r.seg === sg && counts(r)) r.live = true;
    }
  }
  // The half-time team swap: when teams switch sides, every player who changes team dies by "world" at
  // once, and the server can score that as a round (the iFNG FX vs fnatic Dust2 demo, 27:07, all ten in two
  // seconds). That round never counts, nor do the warmup rounds played on the new sides before the next
  // restart, when a restart and more live rounds follow (some servers swap sides with no restart: there
  // the second half goes on in the same stretch and only the swap round itself is dropped).
  // The team swap often comes right after a real round has ended, and its suicides then land in that round
  // (Xperia Play FX vs mTw Nuke, second overtime: FX win the round at 45:30, then five players switch). That
  // round still counts. Swap suicides are never counted as deaths (k.swap). The suicides can also straddle
  // the next round marker (fnatic vs EG Dust2, 39:44: two in the ended round, one more a second later in the
  // next), so they're looked for across rounds and the swap belongs to the round of the first one.
  const selfKills = [];
  for (const r of rounds) for (const k of r.kills) if (k.killer === k.victim) selfKills.push({ k, r });
  selfKills.sort((a, b) => a.k.t - b.k.t);
  const swapAtOf = new Map();
  for (let i = 0; i + 2 < selfKills.length; i++) {
    if (selfKills[i + 2].k.t - selfKills[i].k.t > 5) continue;
    const at = selfKills[i].k.t, r0 = selfKills[i].r;
    if (!swapAtOf.has(r0)) swapAtOf.set(r0, at);
    for (const s of selfKills) if (s.k.t >= at - 0.01 && s.k.t <= at + 5) s.k.swap = true;
    while (i + 1 < selfKills.length && selfKills[i + 1].k.t <= at + 5) i++;
  }
  for (const r of rounds) {
    const at = swapAtOf.get(r); if (at == null) continue;
    const realBefore = r.winner && r.endT != null && r.endT <= at + 0.5 && r.kills.some((k) => k.killer !== k.victim && k.t < at);
    if (!realBefore) { if (r.live) { r.live = false; r.swap = true; } }
    if (!r.live && !r.swap) continue;
    const laterLive = rounds.some((x) => x.live && x.seg > r.seg);
    if (laterLive) for (const x of rounds) if (x.seg === r.seg && x.start > r.start) x.live = false;
  }
  // An idle server: two rounds in a row with no kills (players gone, the clock running out) end a stretch.
  for (let i = 1; i < rounds.length; i++) {
    const a = rounds[i - 1], b = rounds[i];
    if (a.seg !== b.seg || a.kills.length || b.kills.length || !a.winner || !b.winner) continue;
    for (const x of rounds) if (x.seg === b.seg && x.start > b.start) x.live = false;
  }
  // A round played between two recordings of a joined map (in neither file) counts when its part has live
  // rounds. It's in the stretch of the part's start, often not the one the part's live rounds are in.
  for (const r of rounds) if (r.missing) r.live = rounds.some((x) => x.part === r.part && x.live && !x.missing);
  // A stretch can't run past the end of a half when a restart and more play follow. Both Xperia Play FX vs mTw
  // matches played on for 5 (Inferno) and 6 (Nuke) rounds at 15:15 on the same sides, then the admins
  // restarted and played the overtime from its start. Half ends: 15, 30, then every 3 rounds of overtime.
  // The stretch is cut at the first half end after which the teams stayed on the same sides. A stretch can
  // cross a half end legitimately when the server swapped sides with no restart, so a half end where the
  // sides did swap is passed over. (Cutting at the last half end crossed instead went wrong when the two
  // Xperia parts were joined: part 2's stretch starts at 15 and runs to 35, crossing 30 and 33, so it was
  // cut at 33 and 3 rounds played on at 15:15 became overtime.)
  {
    const tSide = (r) => { const t = Math.min(r.start + 5, r.end), s = new Set(); for (const e in D.slots) { const a = D.slots[e]; if (Math.abs(a[idxAt(t) * S + 5]) === 1) s.add(personAt(+e, t)); } return s; };
    const sameSides = (a, b) => { const x = tSide(a), y = tSide(b); let n = 0; for (const p of x) if (y.has(p)) n++; return n > Math.min(x.size, y.size) / 2; };
    const segs = [...new Set(rounds.filter((r) => r.live).map((r) => r.seg))].sort((a, b) => a - b);
    let total = 0;
    for (let i = 0; i < segs.length; i++) {
      const rs = rounds.filter((r) => r.live && r.seg === segs[i]);
      const end = total + rs.length;
      const ends = [15, 30]; for (let x = 33; x < end; x += 3) ends.push(x);
      let b = i < segs.length - 1 ? ends.find((x) => x > total && x < end && sameSides(rs[x - total - 1], rs[x - total])) : undefined;
      // The server announced a new start before the next stretch: what was played past the last half end
      // crossed, short of a whole new half, was played while waiting for it. In SK vs Na`Vi, Train, DreamHack
      // Winter 2011 two rounds were played at 15:15 on the overtime sides, before "MR3 overtime is live".
      if (b == null && i < segs.length - 1 && windows.starts) {
        const last = rs[rs.length - 1], next = rounds.find((r) => r.live && r.seg === segs[i + 1]);
        const announced = windows.starts.some((t) => t > last.start && t < next.start);
        const x = announced ? ends.filter((x) => x > total && x < end).pop() : undefined;
        if (x != null && end - x < (x >= 30 ? 3 : 15)) b = x;
      }
      if (b != null) { for (const r of rs.slice(b - total)) { r.live = false; r.pastHalf = true; } total = b; }
      else total = end;
    }
  }
  if (!rounds.some((r) => r.live)) for (const r of rounds) r.live = r.dur > 5;
  // people again, now merged by the names used during the live rounds (see group)
  {
    const lr = rounds.filter((r) => r.live);
    group((a, b) => lr.some((r) => Math.min(b, r.end != null ? r.end : D.end) > Math.max(a, r.start)));
  }

  // sides per player per live round (sample 5s into the round)
  const sideAt = (e, t) => { const a = D.slots[e]; if (!a) return 0; const i = idxAt(t) * S; return Math.abs(a[i + 5]); };
  let liveR = rounds.filter((r) => r.live);
  // Each person's name: the one they used for most of the live rounds. Players rename for fun during
  // warmups (in the FX vs SK Inferno demo RobbaN was "SK.BobbaN" and f0rest "SK.iZnoGouD" for a few
  // seconds before the knife round). Without live rounds, the name they had last.
  for (const pid in pl) {
    const p = pl[pid]; if (!p.occs.length) continue;
    const w = {}; let last = null, lastT = -Infinity;
    for (const o of p.occs) {
      const nt = o.nameT && o.nameT.length ? o.nameT : o.names.map((nm) => [o.from, nm]);
      for (let i = 0; i < nt.length; i++) {
        const a = nt[i][0], b = i + 1 < nt.length ? nt[i + 1][0] : (o.to != null ? o.to : D.end);
        if (a >= lastT) { lastT = a; last = nt[i][1]; }
        for (const r of liveR) { const ov = Math.min(b, r.end) - Math.max(a, r.start); if (ov > 0) w[nt[i][1]] = (w[nt[i][1]] || 0) + ov; }
      }
    }
    const best = Object.keys(w).sort((x, y) => w[y] - w[x])[0];
    if (best || last) p.name = cleanName(best || last);
  }
  const slotsAll = Object.keys(D.slots).map(Number);
  const together = {};
  for (const r of liveR) {
    if (r.missing) continue; // nobody to sample: takes the sides of the next round, below
    const t = Math.min(r.start + 5, r.end);
    r.sides = {};
    for (const e of slotsAll) { const sd = sideAt(e, t); if (sd) r.sides[personAt(e, t)] = sd; }
    const ids = Object.keys(r.sides);
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
      const k = ids[i] + '|' + ids[j];
      const v = together[k] || (together[k] = [0, 0]);
      v[r.sides[ids[i]] === r.sides[ids[j]] ? 0 : 1]++;
    }
  }
  // A round with nobody on a side takes the sides of the next live round, the same half: a round in no file,
  // or one a recording starts partway into before any side is recorded (the OT2 file of mTw vs Na`Vi, Tuscan,
  // ESWC 2010, where Na`Vi win the first round on CT; it went to mTw).
  for (const r of liveR) if (r.missing || !Object.keys(r.sides).length) { const nx = liveR.find((x) => x.start > r.start && !x.missing && Object.keys(x.sides || {}).length); r.sides = nx ? Object.assign({}, nx.sides) : {}; }
  // teammates: people who were on the same side more often than not
  const par = {}; const find = (x) => par[x] === x ? x : (par[x] = find(par[x]));
  const players = Object.keys(pl).filter((pid) => liveR.some((r) => r.sides[pid]));
  players.forEach((pid) => par[pid] = pid);
  for (const k in together) { const [a, b] = k.split('|'); const v = together[k]; if (v[0] > v[1] && par[a] && par[b]) par[find(a)] = find(b); }
  const groups = {};
  for (const pid of players) (groups[find(pid)] || (groups[find(pid)] = [])).push(pid);
  let teams = Object.values(groups).sort((a, b) => b.length - a.length).slice(0, 2);
  while (teams.length < 2) teams.push([]);
  // everyone else seen in a team slot for only a round or two goes with whichever team they played for most
  const teamOf = {}; teams.forEach((g, i) => g.forEach((pid) => teamOf[pid] = i));
  for (const g of Object.values(groups)) if (!teams.includes(g)) for (const pid of g) {
    const votes = [0, 0];
    for (const r of liveR) if (r.sides[pid]) for (const q in r.sides) if (teamOf[q] != null) votes[teamOf[q]] += r.sides[q] === r.sides[pid] ? 1 : -1;
    const ti = votes[0] >= votes[1] ? 0 : 1; teams[ti].push(pid); teamOf[pid] = ti;
  }
  // spectators: admins, casters and HLTV relays who never played a live round
  const specs = Object.keys(pl).filter((pid) => teamOf[pid] == null && pl[pid].occs.length);

  const autoName = (g, i) => {
    const names = g.map((pid) => pl[pid].name);
    const tryAffix = (pre) => {
      const best = {};
      for (const nm of names) for (let L = 3; L <= Math.min(12, nm.length - 1); L++) {
        const a = pre ? nm.slice(0, L) : nm.slice(-L);
        best[a] = (best[a] || 0) + 1;
      }
      let top = null;
      for (const a in best) if (best[a] >= Math.max(3, Math.ceil(names.length * 0.6)) && (!top || a.length > top.length)) top = a;
      return top ? top.replace(/^[\s\W]+|[\s\W]+$/g, '').trim() : null;
    };
    const a = tryAffix(true) || tryAffix(false);
    return a && a.length >= 2 ? knownTeam(a) || a : 'Team ' + (i + 1);
  };
  const saved = ls.get('names:' + demoKey()) || [];
  const fromFile = teamsFromFileName(D.fileName, teams.map((g) => g.map((pid) => pl[pid].name)));
  const tnames = [saved[0] || fromFile[0] || autoName(teams[0], 0), saved[1] || fromFile[1] || autoName(teams[1], 1)];

  // per round: which team was T; winner team; running score
  let sc = [0, 0], played = 0, after16 = null, wonAt = null;
  const count30 = ls.get('count30:' + demoKey()) === true;
  for (const r of rounds) {
    r.scoreBefore = sc.slice();
    if (!r.live) {
      // a round played after the match was won: its winning team, for the Rounds tab
      if (r.afterMatch && r.sides && r.winner) {
        let v = [0, 0]; for (const pid in r.sides) if (teamOf[pid] != null) v[teamOf[pid]] += r.sides[pid] === 1 ? 1 : -1;
        r.tTeam = v[0] >= v[1] ? 0 : 1; r.winTeam = r.winner === 'T' ? r.tTeam : 1 - r.tTeam;
      }
      continue;
    }
    let tVotes = [0, 0];
    for (const pid in r.sides) if (teamOf[pid] != null) tVotes[teamOf[pid]] += r.sides[pid] === 1 ? 1 : -1;
    r.tTeam = tVotes[0] >= tVotes[1] ? 0 : 1;
    if (r.winner) { r.winTeam = r.winner === 'T' ? r.tTeam : 1 - r.tTeam; sc[r.winTeam]++; }
    r.scoreAfter = sc.slice();
    // The match is over once a team has won it: 16 with the other on 14 or less, or, from 15:15, an overtime
    // won (MR3: 19 with the other on 17 or less, then 22 and 20, and so on). Servers often play on (the iFNG FX
    // vs fnatic Dust2 demo plays a 30th round after FX reach 16:13); by default those rounds don't count. Some
    // events played all 30 rounds and counted them (fnatic vs EG, EM3 Global Finals 2009: 17:13), so a demo
    // can be set to count them, up to round 30 (remembered per demo; never affects overtime).
    played++;
    const hi = Math.max(sc[0], sc[1]), lo = Math.min(sc[0], sc[1]);
    const regWin = played <= 30 && hi >= 16 && lo <= 14, otWin = hi > 16 && (hi - 16) % 3 === 0 && lo <= hi - 2 && played > 30;
    if (regWin && !after16) after16 = { team: sc[0] > sc[1] ? 0 : 1, score: sc.slice(), at: r };
    const stop = count30 && after16 && played < 30 && !otWin ? false : (regWin || otWin || (count30 && after16 && played >= 30));
    if (stop) {
      if (!wonAt) wonAt = r;
      for (const x of rounds) if (x.start > r.start && x.live) { x.live = false; x.afterMatch = true; }
    }
  }
  if (after16) after16.extra = rounds.filter((x) => x.start > after16.at.start && (x.afterMatch || x.live) && x.kills.length).length;
  liveR = rounds.filter((r) => r.live);
  // live numbering
  let ln = 0; for (const r of rounds) if (r.live) r.ln = ++ln;

  // regulation length: MR15 (30 rounds) unless the match clearly ended as MR12
  const maxSc = Math.max(sc[0], sc[1]);
  const reg = (liveR.length <= 24 && maxSc === 13) ? 24 : 30;
  for (const r of liveR) r.ot = r.ln > reg;

  // wallbang candidates are filled in once the map geometry is loaded (3D stage)
  // grenades: keep only ones that actually flew
  const nades = D.nades.filter((g) => {
    const p = g.pts; const L = p.length;
    if (L < 8) return false;
    const dx = p[L - 3] - p[1], dy = p[L - 2] - p[2];
    return Math.hypot(dx, dy) > 64;
  }).map((g) => {
    const p = g.pts; let stop = p[p.length - 4];
    // time the grenade came to rest (smoke keeps existing while it smokes)
    for (let i = 4; i < p.length; i += 4) { if (Math.hypot(p[i + 1] - p[i - 3], p[i + 2] - p[i - 2]) < 0.5) { stop = p[i]; break; } }
    return { type: g.type, pts: p, t0: p[0], t1: p[p.length - 4], stop };
  });
  addNadesFromEvents(nades);

  // bounds for the no-overview fallback
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const e in D.slots) { const a = D.slots[e]; for (let i = 0; i < a.length; i += S * 10) { if (isNaN(a[i])) continue; x0 = Math.min(x0, a[i]); x1 = Math.max(x1, a[i]); y0 = Math.min(y0, a[i + 1]); y1 = Math.max(y1, a[i + 1]); } }
  const k = Math.min(960 / (x1 - x0 || 1), 700 / (y1 - y0 || 1));
  const bounds = { x0, y1, k, px: (1024 - (x1 - x0) * k) / 2, py: (768 - (y1 - y0) * k) / 2 };

  M = { idxAt, pl, rounds, liveR, teams, teamOf, tnames, nades, bounds, reg, hasOT: liveR.some((r) => r.ot), personAt, slotOf, specs, wbs: [], after16: after16 && after16.extra ? after16 : null, count30, wonAt: wonAt || (after16 && after16.at) || null };
  buildShort();
  findSkips();
}
