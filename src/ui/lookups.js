// ---------------- sniper zoom ----------------
// HLTV demos don't record whether a player is zoomed in. They do record the zoom click sound the game
// plays on every right-click with a sniper rifle, with the time and the player, so the zoom is rebuilt
// from those clicks, using the game's own rules (checked against the Tuscan and Dust2 demos):
//   - each click steps the zoom: none -> 1x -> 2x -> none
//   - an AWP or Scout shot drops the zoom while the bolt cycles, then it comes back by itself at the same level
//   - switching weapons, dying and a new round drop the zoom
// Clicks are stamped to the demo's snapshot, about a tenth of a second.
const SNIPERS = {
  awp: { fov: [90, 40, 10], bolt: 1.45 },
  scout: { fov: [90, 40, 15], bolt: 1.25 },
  g3sg1: { fov: [90, 40, 15], bolt: 0 },
  sg550: { fov: [90, 40, 15], bolt: 0 },
};
// A zoom-in and its shot can land in the same snapshot; the scope then shows for this long before the
// shot, and stays for this long after it, so the moment is visible instead of lasting zero frames.
const SCOPE_MIN_SHOW = 0.1;
let ZOOM = {}; // slot -> { pts: [time, level, ...] }
function buildZoom() {
  ZOOM = {};
  if (!D || !M) return;
  const zids = new Set(Object.keys(D.sounds || {}).filter((k) => /(^|\/)weapons\/zoom\.wav$/i.test(String(D.sounds[k]).replace(/\\/g, '/'))).map(Number));
  const S = D.stride, times = D.times, ev = [];
  // order at the same moment: reset (0), weapon change (1), click (2), shot (3)
  const sn = D.snds || [];
  for (let i = 0; i < sn.length; i += 10) if (zids.has(sn[i + 1])) ev.push([sn[i], sn[i + 2], 2]);
  const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) { const n = eventName(sh[i + 2]); if (SNIPERS[n]) ev.push([sh[i], sh[i + 1], 3, n]); }
  for (const e in D.slots) {
    const a = D.slots[e]; let w = -1, alive = false;
    for (let i = 0; i < times.length; i++) {
      const wi = a[i * S + 6], st = a[i * S + 5];
      if (wi !== w) { w = wi; ev.push([times[i], +e, 1, weaponShort(D.models[wi])]); }
      if ((st > 0) !== alive) { alive = st > 0; if (!alive) ev.push([times[i], +e, 0]); }
    }
    for (const r of M.rounds) ev.push([r.start, +e, 0]);
  }
  ev.sort((x, y) => x[0] - y[0] || x[2] - y[2]);
  const st = {};
  for (const [t, e, kind, extra] of ev) {
    const z = st[e] || (st[e] = { lvl: 0, w: '', resumeAt: null, resumeLvl: 0, inAt: null, inIdx: -1 });
    const Z = ZOOM[e] || (ZOOM[e] = { pts: [] });
    const set = (time, lvl) => { if (lvl === z.lvl) return; z.lvl = lvl; Z.pts.push(time, lvl); };
    if (z.resumeAt != null && z.resumeAt <= t) { set(z.resumeAt, z.resumeLvl); z.resumeAt = null; z.inAt = null; }
    if (kind === 0) { set(t, 0); z.resumeAt = null; z.inAt = null; }
    else if (kind === 1) { z.w = extra; set(t, 0); z.resumeAt = null; z.inAt = null; }
    else if (kind === 2) {
      if (!SNIPERS[z.w]) continue;
      let base = z.lvl;
      if (z.resumeAt != null) { base = z.resumeLvl; z.resumeAt = null; }
      const next = (base + 1) % 3;
      if (base === 0 && next > 0) { z.inAt = t; z.inIdx = Z.pts.length; } else if (next === 0) z.inAt = null;
      set(t, next);
    } else {
      const W = SNIPERS[extra]; if (!W) continue;
      if (z.lvl > 0) {
        // a zoom-in in the same snapshot as the shot: show the scope a moment before the shot
        if (z.inAt != null && t - z.inAt < SCOPE_MIN_SHOW && Z.pts[z.inIdx] === z.inAt) {
          const prev = z.inIdx >= 2 ? Z.pts[z.inIdx - 2] : -Infinity;
          Z.pts[z.inIdx] = Math.max(prev + 0.001, t - SCOPE_MIN_SHOW);
        }
        if (W.bolt) { z.resumeLvl = z.lvl; z.resumeAt = t + W.bolt; set(t + SCOPE_MIN_SHOW, 0); z.inAt = null; }
      }
    }
  }
  for (const e in st) { const z = st[e]; if (z.resumeAt != null) { ZOOM[e].pts.push(z.resumeAt, z.resumeLvl); } }
}
// zoom level (0 none, 1, 2) of a player at time t
function zoomLevel(e, t) {
  const Z = ZOOM[e]; if (!Z || !Z.pts.length) return 0;
  const p = Z.pts; let lo = 0, hi = p.length / 2 - 1, r = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (p[m * 2] <= t) { r = m; lo = m + 1; } else hi = m - 1; }
  return r < 0 ? 0 : p[r * 2 + 1];
}

// Player health over time (HLTV sends it to spectators whenever it changes)
let hpIdx = null;
function buildHp() {
  hpIdx = {};
  const h = D.hp || [];
  for (const e in D.slots) hpIdx[e] = [];
  for (let i = 0; i < h.length; i += 3) {
    const t = h[i], e = h[i + 1], v = h[i + 2];
    if (e === 0) { for (const k in hpIdx) hpIdx[k].push(t, v); }
    else if (hpIdx[e]) hpIdx[e].push(t, v);
  }
  // POV mode: teammates' health, which the server sends the recording player (HealthInfo; opponents' it hides). For
  // the labels only: D.hp, which the damage and skip finders read, stays as HLTV sent it (none in a POV demo)
  const hi = D.povOn ? D.hpInfo || [] : [];
  for (let i = 0; i < hi.length; i += 3) if (hpIdx[hi[i + 1]]) hpIdx[hi[i + 1]].push(hi[i], hi[i + 2]);
}
// The C4 backpack (T) or defusal kit (CT) a player carries: the body value the game sets on the player (0.17.0)
let packIdx = null;
function buildPack() {
  packIdx = {};
  const h = D.pack || [];
  for (let i = 0; i < h.length; i += 3) (packIdx[h[i + 1]] || (packIdx[h[i + 1]] = [])).push(h[i], h[i + 2]);
}
function packAt(e, t) {
  const a = packIdx && packIdx[e]; if (!a || !a.length) return 0;
  let lo = 0, hi = a.length / 2 - 1, res = -1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (a[mid * 2] <= t) { res = mid; lo = mid + 1; } else hi = mid - 1; }
  return res < 0 ? 0 : a[res * 2 + 1];
}
function hpAt(e, t) {
  const a = hpIdx && hpIdx[e]; if (!a || !a.length) return null;
  let lo = 0, hi = a.length / 2 - 1, res = -1;
  while (lo <= hi) { const mid = (lo + hi) >> 1; if (a[mid * 2] <= t) { res = mid; lo = mid + 1; } else hi = mid - 1; }
  if (res < 0) return null;
  const r = roundAt(t);
  if (r && a[res * 2] < r.start - 0.5) return 100; // new round, nobody hurt yet
  return a[res * 2 + 1];
}

// ---- HLTV slow motion ----
// HLTV's director slowed some broadcasts to half speed for a few seconds around a kill (svc_timescale 0.5:
// 21 times in FX vs Lions, Nuke, DreamHack Winter 2010; 28 in Sweden vs Norway, Dust2, ASUS ENC 2010). Inside
// those stretches the demo's clock runs 1 / value times faster than the game's: a snapshot every 0.2 s of
// demo time for 0.1 s of game (checked against the demo's own game clock, svc_time). Playback runs through
// them that much faster, so the match plays at real speed (Sujan, 14 Oct 2026), and the round and C4 timers
// count game time, as the game's do. The timeline and "demo time" stay on the demo's clock.
function slowAt(t) { const L = D && D.slow; if (L) for (const s of L) { if (t < s[0]) break; if (t < s[1]) return s[2]; } return 1; }
function gameTime(t) { let g = t; const L = D && D.slow; if (L) for (const [a, b, v] of L) { if (a >= t) break; g -= (Math.min(t, b) - a) * (1 - v); } return g; }
const gameSpan = (a, b) => gameTime(b) - gameTime(a);

// The in-game round timer: freeze time counting down, then the round time counting down.
// After a plant, two readings. The lists (Kills, Wallbangs, Copy list, the timeline's hover) give the time since
// the plant ("C4 0:15"), which places a kill in the bomb's 35 s. The timer above the view (countdown = true)
// counts down from 0:35 to 0:00 as the game does, holds 0:00 from the explosion until the next round, and stops
// where it was when the bomb is defused (Sujan, 15 Oct 2026). 35 s is the fuse in every demo measured (118 of 125
// bombs in 47 demos took 35.1 to 35.5 s of game time, the other 7 went off early at a skip; 0.20.0). The game's own
// default, mp_c4timer in ReGameDLL game.cpp, is 45, so a server left on the default would read wrong.
const C4_FUSE = 35;
function c4Countdown(plant, r, t) {
  const end = (re) => D.centre.find((c) => c.t >= plant.t && c.t <= r.end + 0.5 && re.test(c.s));
  const boom = end(/Target_Bombed/), defused = end(/Bomb_Defused/);
  if (boom && t >= boom.t) return 0;
  const stop = defused && t >= defused.t ? defused.t : t;
  return Math.max(0, Math.floor(C4_FUSE - gameSpan(plant.t, stop) + 0.001));
}
function clockAt(t, countdown) {
  const r = roundAt(t);
  if (!r || !D.roundTimes) return null;
  let rt = null;
  for (const x of D.roundTimes) { if (x.t > t + 0.001) break; if (x.t >= r.start - 1) rt = x; }
  if (!rt) return null;
  const freeze = Math.abs(rt.t - r.start) < 1 && D.roundTimes.some((x) => x.t > rt.t && x.t < r.end + 0.5);
  const plant = D.bomb.find((b) => b.type === 'plantpos' && b.t >= r.start && b.t <= r.end);
  if (plant && t >= plant.t) return { text: 'C4 ' + fmt(countdown ? c4Countdown(plant, r, t) : gameSpan(plant.t, t)), phase: 'bomb' };
  const rem = Math.max(0, Math.floor(rt.secs - gameSpan(rt.t, t) + 0.001));
  return { text: (freeze ? 'freeze ' : '') + fmt(rem), phase: freeze ? 'freeze' : 'round' };
}
const clockText = (t, countdown) => { const c = clockAt(t, countdown); return c ? c.text : ''; };
// the round timer in the narrow time cell of the Kills and Wallbangs lists: "C4 0:16" stays in one piece, and
// "freeze 0:15" goes on two lines, since in one it ran into the gun icon beside it (Sujan, 23 Oct 2026)
// A kill that lands on a skip across a round restart belongs to the round it ended, but at that instant the next
// round's freeze time has begun ("R23 freeze 0:15" for minet on dennis, mTw vs Lions, Nuke, DreamHack Summer 2011):
// its timer is the round's own, as last recorded before the skip (23 Oct 2026)
const killClock = (t) => clockText(M && M.skipRestart && M.skipRestart.some((st) => Math.abs(st - t) < 0.06) ? t - 0.05 : t);
const cellClock = (t) => { const c = killClock(t); return c.startsWith('freeze ') ? `<span class="nw">freeze</span><br><span class="nw">${c.slice(7)}</span>` : `<span class="nw">${c}</span>`; };
// ---- team names ----
// Well-known CS 1.6 team names, keyed by how they tend to appear in demo file names and clan tags.
const KNOWN_TEAMS = {
  navi: 'Natus Vincere', natusvincere: 'Natus Vincere', fx: 'Frag eXecutors', fragexecutors: 'Frag eXecutors',
  mtw: 'mTw', sk: 'SK Gaming', skgaming: 'SK Gaming', nip: 'Ninjas in Pyjamas', fnatic: 'fnatic', mouz: 'mousesports',
  mousesports: 'mousesports', m5: 'Moscow Five', moscow5: 'Moscow Five', moscowfive: 'Moscow Five', eg: 'Evil Geniuses',
  evilgeniuses: 'Evil Geniuses', col: 'compLexity', complexity: 'compLexity', mym: 'MeetYourMakers', meetyourmakers: 'MeetYourMakers',
  esc: 'ESC Gaming', again: 'AGAiN', wemadefox: 'WeMadeFox', wmf: 'WeMadeFox', estro: 'eSTRO', vg: 'Virtus.pro', virtuspro: 'Virtus.pro',
  vp: 'Virtus.pro', pentagram: 'Pentagram', h2k: 'H2k', alternate: 'ALTERNATE aTTaX', attax: 'ALTERNATE aTTaX', winfakt: 'WinFakt',
  checksix: 'Check-Six', lions: 'LIONS', lionsesport: 'LIONS e-Sport', zantwerpaces: 'Z-Antwerp Aces', dignitas: 'Team Dignitas',
  wicked: 'Wicked', ksp: 'KSP', lions_e_sport: 'LIONS e-Sport', mortal: 'Mortal Teamwork', aaa: 'against All authority',
  essential: 'eSsential', vs: null,
};
const norm = (x) => (x || '').toLowerCase().replace(/[^a-z0-9]/g, '');
// A shared clan tag looked up in the known teams: the whole tag first, then its first part,
// so "SK.SWE.AMD" and "SK Gaming |" read as SK Gaming and "fnatic.MSI" as fnatic. Unknown tags stay as written.
function knownTeam(tag) {
  const whole = norm(tag);
  if (KNOWN_TEAMS[whole]) return KNOWN_TEAMS[whole];
  const first = norm((tag || '').split(/[^A-Za-z0-9]+/).find((w) => w) || '');
  return first && KNOWN_TEAMS[first] || null;
}
const EVENT_WORDS = /^(final|finals|grand|semi|semifinal|quarter|group|bo\d|map\d?|match|part\d?|half\d?|de|cs|auto|hltv|demo|lan|online|playoff|playoffs|upper|lower|round|day\d?)$/i;
function teamsFromFileName(file, rosters) {
  const base = (file || '').replace(/\.dem$/i, '');
  // "a-vs-b", "a_vs_b" or "a.vs.b"
  const vs = /[-_.]vs[-_.]/i.exec(base);
  if (!vs) return [null, null];
  const i = vs.index;
  let left = base.slice(0, i), right = base.slice(i + 4);
  left = left.split(/[_.]/).pop();
  left = left.replace(/^\d+-*/, '');
  const rt = [];
  for (const tok of right.split(/[-_.]/)) { if (!tok || /\d/.test(tok) && rt.length || EVENT_WORDS.test(tok)) break; rt.push(tok); }
  const pretty = (raw) => {
    const n = norm(raw);
    if (KNOWN_TEAMS[n]) return KNOWN_TEAMS[n];
    return raw.split(/[-_]/).map((w) => w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)).join(' ');
  };
  const A = { raw: left, name: pretty(left) }, B = { raw: rt.join('-'), name: pretty(rt.join('-')) };
  if (!A.raw || !B.raw) return [null, null];
  // which roster does each name belong to? count players whose name contains the team's tag
  const hits = (t, roster) => roster.filter((nm) => { const a = norm(nm); return (norm(t.raw).length >= 2 && a.includes(norm(t.raw))) || a.includes(norm(t.name)); }).length;
  const a0 = hits(A, rosters[0]) + hits(B, rosters[1]), a1 = hits(A, rosters[1]) + hits(B, rosters[0]);
  return a1 > a0 ? [B.name, A.name] : [A.name, B.name];
}

// Player stats from the kill feed only (no bonus points for plants or defuses).
// Team kills are not counted as kills. bucket: all | t | ct | ot
function statsFor(bucket, uptoT) {
  const st = {};
  const get = (e) => st[e] || (st[e] = { k: 0, d: 0, hs: 0, tk: 0, rounds: 0 });
  for (const r of M.liveR) {
    if (r.missing) continue; // a round in neither file: counts in the score, not in player stats
    if (bucket === 'ot' && !r.ot) continue;
    if (uptoT != null && r.start > uptoT) break;
    for (const e in r.sides) {
      const side = r.sides[e];
      if (bucket === 't' && side !== 1 || bucket === 'ct' && side !== 2) continue;
      get(e).rounds++;
    }
    for (const k of r.kills) {
      if (uptoT != null && k.t > uptoT) break;
      const ks = r.sides[k.kp], vs = r.sides[k.vp];
      const inK = bucket === 'all' || bucket === 'ot' || (bucket === 't' ? ks === 1 : ks === 2);
      const inV = bucket === 'all' || bucket === 'ot' || (bucket === 't' ? vs === 1 : vs === 2);
      if (inV && k.vp && !k.swap) get(k.vp).d++; // a team-swap suicide isn't a death
      if (k.killer === k.victim || !k.kp) continue;
      if (!inK) continue;
      if (ks && vs && ks === vs) { get(k.kp).tk++; continue; }
      get(k.kp).k++; if (k.hs) get(k.kp).hs++;
    }
  }
  return st;
}
let statBucket = 'all';

// breakables over time, from the demo: model -> [time, visible, time, visible, ...]
let brk = {};
function buildBrk() {
  brk = {};
  const e = D.brushEvents || [];
  for (let i = 0; i < e.length; i += 3) (brk[e[i + 1]] || (brk[e[i + 1]] = [])).push(e[i], e[i + 2]);
}
function brokenAt(model, t) {
  const a = brk[model]; if (!a) return false;
  let v = 1; for (let i = 0; i < a.length; i += 2) { if (a[i] > t) break; v = a[i + 1]; }
  return !v;
}
function brokenSet(t) {
  const s = new Set();
  if (MAP && MAP.breakables) for (const m of MAP.breakables) if (brokenAt(m, t)) s.add(m);
  return s;
}
// doors and other movers over time, from the demo: model -> [time, x, y, z, pitch, yaw, roll, ...]
let bpose = {};
function buildPose() {
  bpose = {};
  const e = D.brushPose || [];
  for (let i = 0; i < e.length; i += 8) (bpose[e[i + 1]] || (bpose[e[i + 1]] = [])).push(e[i], e[i + 2], e[i + 3], e[i + 4], e[i + 5], e[i + 6], e[i + 7]);
}
// where every mover is at time t (only the ones the demo has recorded; the rest stay as the map file has them)
function posesAt(t) {
  const out = new Map();
  if (!MAP || !MAP.movers) return out;
  for (const m of MAP.movers.keys()) {
    const a = bpose[m]; if (!a || a[0] > t) continue;
    let lo = 0, hi = a.length / 7 - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (a[mid * 7] <= t) lo = mid; else hi = mid - 1; }
    const o = lo * 7;
    out.set(m, brushPose([a[o + 1], a[o + 2], a[o + 3]], [a[o + 4], a[o + 5], a[o + 6]]));
  }
  return out;
}
// HLTV broadcast audience at time t (from the relay's status updates)
function viewersAt(t) {
  const v = D.viewers; if (!v || !v.length) return null;
  let res = null;
  for (let i = 0; i < v.length; i += 2) { if (v[i] > t) break; res = v[i + 1]; }
  return res == null ? v[1] : res;
}
// name / team of whoever is in a slot at time t
const nameAt = (slot, t) => { const pid = M.personAt(slot, t); return M.pl[pid] ? M.pl[pid].name : '?'; };
const teamOfSlot = (slot, t) => M.teamOf[M.personAt(slot, t)];

function roundAt(t) {
  let cur = null;
  for (const r of M.rounds) { if (r.start <= t + 0.001) cur = r; else break; }
  return cur;
}
function visibleRounds() { return showAll ? M.rounds.filter((r) => r.dur > 0.5 || r.missing) : M.liveR; }
let showAll = false;
