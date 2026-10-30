// ---------------- skips in the recording ----------------
// Some HLTV recordings skip ahead: the demo's game clock runs on as if 0.1 s had passed, but 5 to 10 s of game
// are missing (FX vs Lions, Nuke, DreamHack Winter 2010: 7 times; at 11:17.9 742 goes from one roof at 100 HP to
// another at 36 HP in one snapshot). Found 14 Oct 2026; why HLTV does it isn't known. The file has no marker for it
// (packet numbers and update numbering run on without a gap), so a skip is found from what it does to the game:
//   1. Too fast: a player who moved over 60 units since the snapshot before, and faster than 400 units a second
//      over that snapshot and over the last two (running is capped at 260, ReGameDLL weapons.h; 400 allows for
//      bunny hopping; the second test stops a stale snapshot followed by a catch-up from counting). At least 3
//      living players, and at least 60% of them, too fast at once.
//   2. With only 1 or 2 alive: all of them too fast, and silent damage at the same moment (below).
//   3. Players standing still through it: silent damage to 3 or more players at the same moment.
// Silent damage: health down 20 or more with no hit, pain, death or fall sound for that player in the 0.6 s before
// and no grenade blast. None within 1.5 s of a round start (respawns). Checked 14 Oct 2026 on 47 demos against the
// bomb's fixed fuse: the 7 bombs that went off early (25 to 30 s instead of 35) all had a skip in their fuse, and
// none of the 118 that took the full time did. Players snap across a skip instead of sliding, the timeline marks
// it (//), a note says so from 2 s before to 1 s after, a wallbang on one is tagged UNSURE and every kill on
// one gets // in the Kills list (approved mockups, docs/recording-skip-mock.png and docs/skip-tags-mock.png; 0.19.0 to 0.21.0).
function findSkips() {
  const S = D.stride, tt = D.times, n = tt.length, starts = D.rounds.map((r) => r.start).concat(M.rounds.map((r) => r.start));
  const nearStart = (t) => starts.some((st) => Math.abs(t - st) < 1.5);
  // silent damage
  const hitIdx = new Set(); for (const k in D.sounds) if (/bhit_|headshot|pl_pain|die|death|pl_fallpain|pl_jumpland/.test(D.sounds[k])) hitIdx.add(+k);
  const hits = []; const SN = D.snds || []; for (let i = 0; i < SN.length; i += 10) if (hitIdx.has(SN[i + 1])) hits.push(SN[i], SN[i + 2]);
  const booms = []; const BM = D.booms || []; for (let i = 0; i < BM.length; i += 4) booms.push(BM[i]);
  const last = {}, silent = [], HP = D.hp || [];
  for (let i = 0; i < HP.length; i += 3) {
    const t = HP[i], e = HP[i + 1], h = HP[i + 2], prev = last[e]; last[e] = h;
    if (prev == null || prev - h < 20 || starts.some((st) => Math.abs(t - st) < 2)) continue;
    let heard = false; for (let k = 0; k < hits.length; k += 2) if (hits[k + 1] === e && hits[k] > t - 0.6 && hits[k] < t + 0.15) { heard = true; break; }
    if (heard || booms.some((b) => b > t - 0.8 && b < t + 0.15)) continue;
    silent.push([t, e]);
  }
  const silentAt = (t) => new Set(silent.filter(([st]) => Math.abs(st - t) <= 0.3).map(([, e]) => e)).size;
  M.skipIdx = new Set(); M.skipT = []; M.skipRestart = [];
  // kills by a player on another (not suicides, the world or the bomb): none can happen in the snapshot where
  // everyone is put back at the spawns for a new round
  const killT = D.kills.filter((k) => k.killer !== k.victim && k.kp && !NO_WB.has(k.weapon)).map((k) => k.tMsg != null ? k.tMsg : k.t);
  for (let i = 1; i < n; i++) {
    if (tt[i] < D.start + 2) continue;
    // Near a round start everyone jumps to the spawns, so a jump there is the respawn, unless kills arrive in that
    // same snapshot: then HLTV left out the end of the round and the restart, and the kills that ended it land at
    // the spawns (roccat vs fnatic, Inferno, Extreme Masters II, R18, R21, R26; mTw vs Lions, Nuke, DreamHack
    // Summer 2011, minet on dennis in R23; 23 Oct 2026)
    if (nearStart(tt[i]) && !killT.some((kt) => Math.abs(kt - tt[i]) < 0.06)) continue;
    const gap = Math.max(0.05, gameSpan(tt[i - 1], tt[i])), gap2 = i >= 2 ? Math.max(0.05, gameSpan(tt[i - 2], tt[i])) : gap;
    let alive = 0, fast = 0;
    for (const e in D.slots) {
      const a = D.slots[e], p = (i - 1) * S, q = i * S, o = (i - 2) * S;
      if (!(a[q + 5] > 0) || a[q + 5] !== a[p + 5] || isNaN(a[p]) || isNaN(a[q])) continue;
      alive++;
      const m = Math.hypot(a[q] - a[p], a[q + 1] - a[p + 1]);
      const two = i >= 2 && a[o + 5] === a[q + 5] && !isNaN(a[o]);
      const m2 = two ? Math.hypot(a[q] - a[o], a[q + 1] - a[o + 1]) : m, g2 = two ? gap2 : gap;
      if (m > 60 && m > 400 * gap && m2 > 400 * g2) fast++;
    }
    if ((alive >= 3 && fast >= Math.max(3, alive * 0.6)) || (alive >= 1 && alive < 3 && fast === alive && silentAt(tt[i]) >= 1)) { M.skipIdx.add(i); M.skipT.push(tt[i]); if (nearStart(tt[i])) M.skipRestart.push(tt[i]); }
  }
  // silent damage to 3 or more players at once, away from the skips found so far: the snapshot it arrives in
  const groups = []; for (const [t, e] of silent) { let g = groups.find((x) => Math.abs(x.t - t) < 0.15); if (!g) { g = { t, es: new Set() }; groups.push(g); } g.es.add(e); }
  for (const g of groups) {
    if (g.es.size < 3 || M.skipT.some((st) => Math.abs(st - g.t) <= 0.3)) continue;
    let i = 0; while (i < n && tt[i] < g.t - 0.001) i++;
    if (i > 0 && i < n) { M.skipIdx.add(i); M.skipT.push(tt[i]); }
  }
  M.skipT.sort((x, y) => x - y);
}
// a kill within 0.3 s of a skip: the wallbang finder saw where everyone stood after it, not at the shot
const SKIP_BEFORE = 2, SKIP_AFTER = 1; // seconds of game time the skip note shows before and after a skip (0.19.1)
const skipNear = (t) => !!(M && M.skipT) && M.skipT.some((s) => Math.abs(s - t) <= 0.3);
const UNSURE_TIP = 'The recording skips at this kill, so the wallbang was judged from where everyone stood after the skip';
const unsureTag = (k) => (k.wb && skipNear(k.t) ? `<span class="wbtag unsure" title="${UNSURE_TIP}">UNSURE</span>` : '');
// Sujan's three levels (24 Oct 2026; built in 0.23.0): a strict wallbang has none of the victim in view from the
// shooter's eye; a loose one has part of him in view (50 pixels or more in the picture check, view3d.part.js).
const LOOSE_TIP = (k) => k.wb.dmg ? `Loose wallbang: part of him was in view, and the demo's damage shows a bullet of the killer's went through cover just before the kill (${k.wb.dmg.dmg} HP where his gun does at least ${k.wb.dmg.open} in the open)` : k.wb.loose === 'sliver' ? `Loose wallbang: the bullet went through cover, and the check can't say he was fully hidden: some of its sight lines reach him, though the shooter's view shows almost none of him (${k.wb.px} pixels in the check)` : `Loose wallbang: the bullet went through cover, but part of him was in view from the shooter's eye (${k.wb.loose} pixels in the check, 50 or more counts as in view)`;
const looseTag = (k) => (k.wb && k.wb.loose ? `<span class="wbtag loose" title="${LOOSE_TIP(k)}">LOOSE WB</span>` : '');
const STRICT_TIP = 'Strict wallbang: the bullet went through cover and none of him was in view from the shooter\'s eye';
const DMG_TIP = 'Wallbang damage: hits through cover that didn\'t kill him';
