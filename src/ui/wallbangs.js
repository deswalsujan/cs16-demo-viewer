// ---------------- wallbang detection ----------------
// A kill counts as a wallbang when, from the shooter's eye, every point of the victim's body
// (feet to top of head, left to right) is behind solid map geometry AND the shooter's
// crosshair line also passes through that geometry.
const NO_WB = new Set(['grenade', 'knife', 'world', '']);
// Guns whose bullet stops at the first surface it hits, so they can never wallbang. From the game code
// (ReGameDLL, a reverse-engineered copy of CS 1.6's): these fire with a penetration count of 1
// (wpn_<gun>.cpp, FireBullets3 in cbase.cpp, which stops when the count reaches 0 after the first hit).
// The Dual Elites pass BULLET_PLAYER_9MM (= 1) where the count goes. The shotguns use FireBullets,
// which traces each pellet once with no penetration. Checked 1-2 Oct 2026.
// The most damage each gun's bullet does (ReGameDLL weapons.h: *_DAMAGE, M4A1_DAMAGE_SIL, FAMAS_DAMAGE_BURST).
// After passing through a wall, FireBullets3 (cbase.cpp) multiplies what's left by at most 0.6 (wood; 0.5 for
// concrete and most walls, 0.2 metal), and a player's TraceAttack (player.cpp) by at most 1.25 short of a
// headshot (stomach) or 4 for a headshot. Range and armour only take more off. So a kill that needed more
// damage than that from the shots fired can't have gone through a wall: an AWP body shot through any wall
// does at most 115 x 0.6 x 1.25 = 86, too little for a player on 100 HP (Sweden vs Norway, Dust2,
// ASUS ENC 2010: three AWP body-shot kills on players at 100 HP were listed as wallbangs; Sujan saw clear shots).
const MAX_DMG = { ak47: 36, aug: 32, awp: 115, deagle: 54, famas: 34, g3sg1: 80, galil: 30, m249: 32, m4a1: 33, scout: 75, sg550: 70, sg552: 33 };
// The least damage each gun's bullet does in the open (level 2 by damage, 28 Oct 2026): damage and range modifier from
// ReGameDLL weapons.h (M4 silenced or not, FAMAS burst or not), x modifier^(distance/500) cut to a whole number
// (FireBullets3, cbase.cpp); the hit sound says where: helmet = head with a helmet, headshot = head without, kevlar =
// body with armour, flesh = a leg or the body without armour (Pain, player.cpp); head 4, stomach 1.25, chest and arms
// 1, legs 0.75 (TraceAttack); armour lets through 0.5 x the gun's factor (TakeDamage). 30 units are added to the
// distance for the aim recorded ten times a second. Checked on 2,171 hits on 6 demos (tests/page/seen_through_cover.js).
const GUN_DMG = { ak47: [[36, 0.98]], m4a1: [[32, 0.97], [33, 0.95]], famas: [[30, 0.96], [34, 0.96]], galil: [[30, 0.98]], aug: [[32, 0.96]], sg552: [[33, 0.955]], awp: [[115, 0.99]], scout: [[75, 0.98]], deagle: [[54, 0.81]], sg550: [[70, 0.98]], g3sg1: [[80, 0.98]], m249: [[32, 0.97]] };
const GUN_ARMOR = { ak47: 0.775, galil: 0.775, m4a1: 0.7, aug: 0.7, famas: 0.7, sg552: 0.7, awp: 0.975, scout: 0.85, deagle: 0.75, sg550: 0.725, g3sg1: 0.825, m249: 0.75 };
const HIT_LOW = { helmet: [4, true], headshot: [4, false], kevlar: [1, true], flesh: [0.75, false] };
function openLow(gun, dist, sounds) {
  if (!GUN_DMG[gun] || !sounds.length) return 0;
  return sounds.reduce((sum, cls) => { const [m, arm] = HIT_LOW[cls] || HIT_LOW.flesh; return sum + Math.min(...GUN_DMG[gun].map(([dm, r]) => Math.floor(Math.floor(dm * Math.pow(r, (dist + 30) / 500)) * m * (arm ? GUN_ARMOR[gun] : 1) + 1e-6))); }, 0);
}
const ONE_SURFACE = new Set(['usp', 'glock18', 'p228', 'fiveseven', 'elite', 'mac10', 'tmp', 'mp5navy', 'ump45', 'p90', 'm3', 'xm1014']);
// The victim's health just before the killing hit, and the killer's shots that could have done the damage.
// HLTV sends a player's health whenever it changes, so an earlier hit would show as a lower reading; only
// bullets landing after the last reading count: the killer's shots from that reading, and at most 0.6 s before
// the kill (two bullets can land between two readings, and in the 2006 NoA vs Pentagram demo fire events come
// about 0.2 s ahead of their hits, with the kill message 0.2 s after).
// True when even every one of those shots, each through a wall at the best case, couldn't have done it. The wall is
// one surface on the killer's crosshair line, the one whose material lets the most through (wallKeeps; wood's 0.6 for
// every wall before 0.26.7).
function tooMuchDamage(k) {
  const per = MAX_DMG[k.weapon]; if (!per) return false;
  const a = hpIdx && hpIdx[k.victim]; if (!a || !a.length) return false;
  const tEnd = k.tMsg != null ? k.tMsg : k.t, r = M.rounds && M.rounds.find((x) => x.n === k.round);
  let hp = null, at = null;
  for (let i = 0; i < a.length; i += 2) { if (a[i] > tEnd + 0.001) break; if (a[i + 1] > 0) { hp = a[i + 1]; at = a[i]; } }
  if (r && (at == null || at < r.start - 0.5)) { hp = 100; at = r.start; }
  if (hp == null) return false;
  let shots = 0; const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) if (sh[i + 1] === k.killer && sh[i] >= Math.max(at - 0.3, tEnd - 0.6) && sh[i] <= tEnd + 0.001) shots++;
  // no shot of the killer's recorded around the kill (a jump in the recording, where the dead player's
  // health and his respawn arrive at the same instant): the number of bullets isn't known, so leave it
  if (!shots) return false;
  return per * wallKeeps(k) * (k.hs ? 4 : 1.25) * shots < hp;
}
// Each wall's own material (Sujan, 2 Nov 2026, 0.26.7). After a surface a bullet keeps a share of its damage that
// depends on the surface's texture: FireBullets3 (ReGameDLL cbase.cpp) looks it up in the game's materials list,
// cstrike/sound/materials.txt (TEXTURETYPE_Find, sound.cpp; a texture not listed is concrete), and multiplies the
// damage left by metal 0.2, grate 0.4, vent 0.45, computer 0.45, tile 0.3, wood 0.6, anything else 0.5. Through
// several surfaces the game multiplies them, but the crosshair line, recorded ten times a second and up to about 1.5
// degrees off, can cross more surfaces than the bullet did: multiplying broke one of Sujan's answers (Delpan's AWP
// headshot on RashiE, Sweden vs Norway, Dust2, ASUS ENC 2010, R24 1:40, three concrete surfaces on the line). So the
// rule takes one surface, the line's best material: all 229 answers kept, and on the 64 test demos two strict
// wallbangs become normal kills, both AWP body hits through one concrete wall on more health than 115 x 0.5 x 1.25
// leaves, which Sujan confirmed: Delpan on markeloff (SK vs Na`Vi, Train, DreamHack Winter 2011, R23 1:21, 77 HP,
// through the train car's side) and Fox on Zeus (Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011, R5 0:17, 74 HP;
// Sujan's own AWP through that wall does about 53). Measured in tests/logs/wall-material-2026-11-02.md. Without the
// materials list in the folder, or a surface whose texture isn't found, wood's 0.6, the rule before. Damage bursts
// (computeHits) keep 0.6 (Sujan, 2 Nov 2026).
const MAT_KEEP = { M: 0.2, G: 0.4, V: 0.45, T: 0.3, P: 0.45, W: 0.6 };
let MATS = null, matsFor = null;
// the materials list, read from the folder once per file (folder.js finds it): texture name (16 characters, lower
// case) -> type letter, the first line for a name winning, as TEXTURETYPE_Init and TEXTURETYPE_Find read it
async function loadMaterials() {
  const f = files.materials;
  if (f === matsFor) return MATS;
  matsFor = f; MATS = null;
  if (!f) return null;
  let txt; try { txt = await f.text(); } catch (e) { noteStale(e, 'materials.txt'); return null; }
  if (matsFor !== f) return MATS;
  // a line is a letter, then the name up to a space; a last line with no line break after it is skipped, and the game
  // keeps at most 1,024 lines (MAX_TEXTURES, pm_materials.h)
  const m = new Map(), lines = txt.split('\n');
  if (!txt.endsWith('\n')) lines.pop();
  let n = 0;
  for (const line of lines) {
    const x = /^\s*([A-Za-z])\s*(\S+)\s/.exec(line + '\n');
    if (!x || n >= 1024) continue;
    n++;
    const name = x[2].slice(0, 16).toLowerCase();
    if (!m.has(name)) m.set(name, x[1].toUpperCase());
  }
  return (MATS = m);
}
// the material letter of a texture as UTIL_TextureHit (util.cpp) reads it: without a leading -0 or +0 (animated and
// tiled textures) and one { ! ~ or space (see-through, water, lights)
function materialOf(tex) {
  let n = tex; if (n[0] === '-' || n[0] === '+') n = n.slice(2); if ('{!~ '.includes(n[0])) n = n.slice(1);
  return MATS.get(n.slice(0, 16).toLowerCase()) || 'C';
}
// the share of damage a bullet keeps through the best surface on the killer's crosshair line at the shot
function wallKeeps(k) {
  if (k.keep != null) return k.keep;
  let keep = 0.6;
  const line = MATS && MAP && k.kang && aimLine(k);
  if (line) {
    const tP = k.tPos != null ? k.tPos : k.t, skip = brokenSet(tP - 0.05), poses = posesAt(tP - 0.05);
    for (const s of MAP.bsp.solids) if (s.shootable) skip.add(s.model);
    const res = solidAlong(MAP.bsp, line[0], line[1], 2, skip, poses, 'bullet');
    if (res.hit.length) keep = Math.max(...hitTextures(MAP.bsp, line[0], line[1], res, 2, poses).map((t) => (t == null ? 0.6 : MAT_KEEP[materialOf(t)] || 0.5)));
  }
  return (k.keep = keep);
}
// the killer's crosshair line at the shot, from his eye to the victim's distance: [eye, end]
function aimLine(k) {
  const eye = [k.kpos[0], k.kpos[1], k.kpos[2] + (k.kduck ? 12 : 17)];
  let raw = k.kang ? k.kang[0] : 0; if (raw > 180) raw -= 360;
  const pitch = -raw * 3 * Math.PI / 180, yaw = (k.kang ? k.kang[1] : 0) * Math.PI / 180;
  const dist = Math.hypot(k.vpos[0] - eye[0], k.vpos[1] - eye[1], k.vpos[2] - eye[2]);
  return [eye, [eye[0] + Math.cos(pitch) * Math.cos(yaw) * dist, eye[1] + Math.cos(pitch) * Math.sin(yaw) * dist, eye[2] - Math.sin(pitch) * dist]];
}
function computeWallbangs() {
  if (!MAP || !D) return;
  const bsp = MAP.bsp;
  let skip = null; // breakables already broken when this kill happened (e.g. a shot-out vent)
  let poses = null; // doors where they were when this kill happened (open either way, or closed)
  const bodyVisible = (eye, v) => {
    const dx = v[0] - eye[0], dy = v[1] - eye[1]; const hl = Math.hypot(dx, dy) || 1; const px = -dy / hl, py = dx / hl;
    const zs = v[3] ? [-12, 0, 10, 16] : [-30, -12, 6, 22, 30];
    for (const z of zs) for (const sd of [-12, 0, 12]) if (solidAlong(bsp, eye, [v[0] + px * sd, v[1] + py * sd, v[2] + z], 2, skip, poses).solid === 0) return true;
    return false;
  };
  const eyeOf = (p) => [p[0], p[1], p[2] + (p[3] ? 12 : 17)];
  // Not cover: what bullets break (Nuke's vents and upper windows; a kill through them isn't a wallbang, Sujan,
  // 23 Oct 2026). Glass that doesn't break (Nuke's sliding doors at the lower site) and fences, grates and ladders
  // stay cover (Sujan, 23 Oct 2026); the picture check (checkSeen) draws their holes open, so a victim seen through
  // one reads LOOSE (Sujan, 2 Nov 2026). Invisible brushes are never cover (solidAlong in bsp.js).
  const notCover = bsp.solids.filter((s) => s.shootable).map((s) => s.model);
  for (const k of D.kills) {
    k.wb = null; k.seenPx = null; k.seenAim = null; k.keep = null;
    if (!k.kpos || !k.vpos || k.killer === k.victim || NO_WB.has(k.weapon) || ONE_SURFACE.has(k.weapon)) continue;
    const kNow = [...k.kpos, k.kduck], vNow = [...k.vpos, k.vduck];
    const tP = k.tPos != null ? k.tPos : k.t;
    skip = brokenSet(tP - 0.05); for (const m of notCover) skip.add(m);
    poses = posesAt(tP - 0.05);
    const seen = bodyVisible(eyeOf(kNow), vNow);
    if (!seen && tooMuchDamage(k)) continue;
    const [eye, end] = aimLine(k);
    // the crosshair line goes through what a bullet hits (the 15 points above are sight lines)
    const aim = solidAlong(bsp, eye, end, 2, skip, poses, 'bullet');
    const mid = solidAlong(bsp, eye, [k.vpos[0], k.vpos[1], k.vpos[2] + (k.vduck ? 4 : 6)], 2, skip, poses, 'bullet');
    if (aim.solid === 0) continue; // crosshair had a clear line: the victim was hit in the open
    const hit = aim.hit;
    // part of him in view to the 15 points, but the crosshair line goes through cover: computeHits makes it a loose
    // wallbang when the demo's damage shows one of the killer's bullets went through a surface in the same spray
    // (Sujan, 28 Oct 2026; measured with tests/page/seen_through_cover.js), and the picture check lists it when the
    // killer's view shows under 50 pixels of him: strict at 0, LOOSE from 1 (a sliver kill, Sujan, 30 Oct 2026; checkSeen
    // in view3d.part.js)
    if (seen) { k.seenAim = { thick: Math.round(aim.solid > 0 ? aim.solid : mid.solid), aim: Math.round(aim.solid), what: hit.some((h) => h.model !== 0) ? 'object' : 'wall', eye }; continue; }
    k.wb = { thick: Math.round(aim.solid > 0 ? aim.solid : mid.solid), aim: Math.round(aim.solid), what: hit.some((h) => h.model !== 0) ? 'object' : 'wall', eye };
  }
  // a kill that lands on a skip across a round restart was judged from the next round's spawns, thousands of units
  // apart (4,000 units of "wall" for Orwall's AWP kill on coNTE, roccat vs fnatic, Inferno, R21): nothing to judge
  for (const k of D.kills) if ((k.wb || k.seenAim) && (M.skipRestart || []).some((st) => Math.abs(st - k.t) <= 0.3)) { k.wb = null; k.seenAim = null; }
  M.wbs = D.kills.filter((k) => k.wb && M.liveR.some((r) => r.n === k.round));
  renderPane(); drawTimeline();
  // then the picture check (checkSeen, view3d.part.js), once the 3D map is built: loadMap builds it right after this
  setTimeout(() => { if (typeof checkSeen === 'function') checkSeen(); }, 0);
  computeHits();
}

// ---------------- wallbang damage: hits through cover that didn't kill (trial, wip/wallbang-hits) ----------------
// Sujan's level 3 (24 Oct 2026), rules decided 25 Oct 2026, fixed from his check of 24 bursts (26 Oct 2026; the
// prototype is tests/page/wb_hits.js). HLTV sends each player's health whenever it changes, and the game plays a hit
// sound on the player hit. Every health drop he survives with a hit sound in the same snapshot is tied to the enemy
// who fired in the 0.15 s before it and whose crosshair passes closest to him (in demos that lose fire events, an
// enemy aiming within 32 units of him); it is through cover when the crosshair line and the line to the part hit
// (head for a headshot sound) both pass through what a bullet hits. Left out: hits near a grenade blast, a drop on
// landing after a fall of 100 units or more (the game plays the same hit sound for fall damage), more damage than
// the gun can do through a wall (0.6 x headshot 4 or stomach 1.25, per hit sound), guns whose bullets stop at the
// first surface. Hits on one victim within 2 s of the last make a burst; hits in the open neither break it nor count.
// A burst ending in a wallbang kill (strict or loose) joins it, the kill taking what he had left. Listed from 35 HP, or
// whatever its total when it ends in a wallbang kill (1 Nov 2026).
const HITS_MIN = 35;
function computeHits() {
  M.bursts = []; M.hitByV = {};
  if (D) for (const k of D.kills) k.burst = null; // run again once the picture check lists a sliver kill (checkSeen)
  // POV mode: no wallbang damage, and with it no loose wallbang from damage (Sujan, 29 Oct 2026). The server sends a
  // player his teammates' health only, so most hits can't be seen; the damage finder hasn't been checked there.
  if (!MAP || !D || !D.hp || D.povOn) return;
  const bsp = MAP.bsp, S = D.stride, times = D.times;
  const idx = (t) => { let lo = 0, hi = times.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (times[m] <= t + 1e-4) lo = m; else hi = m - 1; } return lo; };
  const team = (e, i) => { const n = playerModelName(D.slots[e][i * S + 8]).toLowerCase(); return /terror|leet|arctic|guerilla/.test(n) ? 'T' : /urban|gsg9|sas|gign|vip/.test(n) ? 'CT' : null; };
  const sname = (i) => String((D.sounds && D.sounds[i]) || '').toLowerCase();
  const hits = {}; const sn = D.snds || [];
  for (let i = 0; i < sn.length; i += 10) { const n = sname(sn[i + 1]); if (/player\/(bhit|headshot)/.test(n)) (hits[sn[i + 2]] || (hits[sn[i + 2]] = [])).push([sn[i], /headshot|helmet/.test(n), /helmet/.test(n) ? 'helmet' : /headshot/.test(n) ? 'headshot' : /kevlar/.test(n) ? 'kevlar' : 'flesh']); }
  const evGun = (i) => String((D.events && D.events[i]) || '').toLowerCase().replace(/^.*\//, '').replace(/\.sc$/, '').replace(/^mp5n$/, 'mp5navy').replace(/^elite_(left|right)$/, 'elite');
  const shots = {}, gunAt = {}; const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) { (shots[sh[i + 1]] || (shots[sh[i + 1]] = [])).push(sh[i]); (gunAt[sh[i + 1]] || (gunAt[sh[i + 1]] = [])).push(evGun(sh[i + 2])); }
  // Does this demo keep its fire events? Measured on 27 Oct 2026 by whether each gun kill's killer has a fire event at
  // the kill: 94 to 100% in the 2010 and 2011 Nuke demos (k1ck vs eq, DreamHack Winter 2011: 193 of 193), 47 to 71% in
  // the 2008 and 2009 ones (tyloo vs mTw, e-Stars Seoul 2009: 114 of 235; the rest missing or 0.1 to 0.3 s late). Where
  // they're kept, an enemy with no fire event at a hit didn't fire it: n0rx, aiming 9 units off szrtech, took mUtcb's
  // 36 HS (k1ck vs eq, R25 1:24; n0rx's first shot came 0.09 s later), and coachi took fox's FAMAS headshot on EneRyYyYy
  // (R26 1:30; coachi's first shot came 0.6 s later; 78 is what fox's FAMAS does to a helmet from 708 units, coachi's M4
  // from 799 would do 84). So enemies merely aiming at him compete only in demos that lose fire events (Go on zonic).
  let gk = 0, gkf = 0;
  for (const k of D.kills) {
    if (k.killer === k.victim || !MAX_DMG[k.weapon] || ONE_SURFACE.has(k.weapon)) continue;
    const t = k.tMsg != null ? k.tMsg : k.t; gk++;
    if ((shots[k.killer] || []).some((x) => x >= t - 0.25 && x <= t + 0.001)) gkf++;
  }
  const firesKept = M.firesKept = gk >= 20 && gkf / gk >= 0.9;
  const booms = []; const bm = D.booms || []; for (let i = 0; i < bm.length; i += 4) booms.push([bm[i], bm[i + 1], bm[i + 2], bm[i + 3]]);
  const notCover = bsp.solids.filter((x) => x.shootable).map((x) => x.model);
  const live = (t) => M.liveR.find((r) => t >= r.start && (r.end == null || t <= r.end + 0.5));
  const starts = (M.rounds || []).map((r) => r.start).sort((x, y) => x - y);
  const roundOf = (t) => { let k = -1; for (let j = 0; j < starts.length && starts[j] <= t; j++) k = j; return k; };
  const last = {}, lastR = {}, drops = [], hpLog = {};
  for (let i = 0; i < D.hp.length; i += 3) {
    const t = D.hp[i], e = D.hp[i + 1], v = D.hp[i + 2], rn = roundOf(t);
    let p = last[e]; if (lastR[e] !== rn) p = 100;
    last[e] = v; lastR[e] = rn; (hpLog[e] || (hpLog[e] = [])).push([t, v]);
    if (v > 0 && v < p) drops.push({ t, e, dmg: p - v });
    else if (v === 0 && p > 0) drops.push({ t, e, dmg: p, dead: true }); // the killing hit takes its own sound (judged as the kill, not here)
  }
  const hpBefore = (e, t) => { let h = 100; const rn = roundOf(t); for (const [tt, v] of hpLog[e] || []) { if (tt > t + 1e-4) break; if (v > 0 && roundOf(tt) === rn) h = v; } return h; };
  const aimAt = (a, i, vp, head, vduck) => {
    const eye = [a[i * S], a[i * S + 1], a[i * S + 2] + (a[i * S + 7] ? 12 : 17)];
    let raw = a[i * S + 4]; if (raw > 180) raw -= 360;
    const pitch = -raw * 3 * Math.PI / 180, yaw = a[i * S + 3] * Math.PI / 180;
    const dir = [Math.cos(pitch) * Math.cos(yaw), Math.cos(pitch) * Math.sin(yaw), -Math.sin(pitch)];
    const tgt = [vp[0], vp[1], vp[2] + (head ? (vduck ? 16 : 28) : (vduck ? 4 : 10))];
    const rel = [tgt[0] - eye[0], tgt[1] - eye[1], tgt[2] - eye[2]];
    const along = rel[0] * dir[0] + rel[1] * dir[1] + rel[2] * dir[2];
    const off = Math.hypot(rel[0] - dir[0] * along, rel[1] - dir[1] * along, rel[2] - dir[2] * along);
    return { eye, dir, along, off, tgt };
  };
  const cover = [], proven = [];
  // Each health drop is paired with its hit sound (26 Oct 2026). The sound comes at the moment of the hit; in some demos
  // the health follows it by a tenth of a second or more, several readings at once (tyloo vs mTw, Nuke, e-Stars Seoul
  // 2009, R15: zonic's 58 to 48, 38 and 0 arrive 0.1 to 0.33 s after their hit sounds; NoA vs Pentagram, Train 2006,
  // R10: neo's 70 to 49 comes 0.11 s after its sound). So the earliest unused hit sound on him up to 0.4 s before each
  // drop goes with it, one per drop; when several drops arrive at one moment, the last takes the sounds left (two
  // bullets between two readings). The hit is judged at the sound's time.
  const used = new Set();
  const byT = {}; for (const d of drops) (byT[d.e + ':' + d.t] || (byT[d.e + ':' + d.t] = [])).push(d);
  for (const key in byT) {
    const grp = byT[key], e = grp[0].e, t0 = grp[0].t;
    const W = (hits[e] || []).map((h, k) => [h, k]).filter(([h, k]) => !used.has(e + ':' + k) && h[0] >= t0 - 0.4 && h[0] <= t0 + 0.02);
    grp.forEach((d, gi) => {
      if (!W.length) return;
      const take = gi < grp.length - 1 ? [W.shift()] : W.splice(0);
      for (const [, k] of take) used.add(e + ':' + k);
      d.snd = take.map(([h]) => h);
    });
  }
  const why = M.hitWhy = []; const dv = window.__debugV; // for tests: why each of one victim's drops was or wasn't counted
  const note = (d, r) => { if (dv && d.e === dv.v && d.t >= dv.from && d.t <= dv.to) why.push(`${d.t.toFixed(3)} -${d.dmg} ${r}`); };
  for (const d of drops) {
    if (d.dead || !live(d.t) || !d.snd) { if (!d.dead) note(d, d.snd ? 'not live' : 'no hit sound'); continue; }
    const hs = d.snd, th = hs[0][0];
    const head = hs.some(([, h]) => h);
    const i = idx(th), v = D.slots[d.e]; if (!v || isNaN(v[i * S])) continue;
    const vp = [v[i * S], v[i * S + 1], v[i * S + 2]], vduck = v[i * S + 7];
    let zTop = vp[2]; for (let j = i; j >= 0 && times[j] >= th - 1; j--) if (!isNaN(v[j * S + 2])) zTop = Math.max(zTop, v[j * S + 2]);
    if (zTop - vp[2] >= 100 && (i >= 2 ? v[(i - 2) * S + 2] : vp[2]) - vp[2] >= 20) { note(d, 'fall'); continue; }
    if (booms.some(([t, x, y, z]) => th - t >= -0.05 && th - t < 0.4 && Math.hypot(x - vp[0], y - vp[1], z - vp[2]) < 450)) { note(d, 'grenade'); continue; }
    const vt = team(d.e, i), cands = [], seen = new Set();
    for (const e in shots) {
      const se = +e; if (se === d.e) continue;
      let li = -1; shots[se].forEach((t, j) => { if (t >= th - 0.2 && t <= th + 0.001) li = j; }); if (li < 0) continue;
      const gun = gunAt[se][li]; if (ONE_SURFACE.has(gun) || /knife|grenade|flash|smoke/.test(gun)) continue;
      const a = D.slots[se]; if (!a || isNaN(a[i * S]) || team(se, i) === vt) continue;
      const c = aimAt(a, i, vp, head, vduck); if (c.along <= 0) continue;
      cands.push(Object.assign(c, { e: se, gun, shot: true })); seen.add(se);
    }
    // enemies whose fire events the demo left out still count when they aim at him (26 Oct 2026: Go's spray on zonic,
    // tyloo vs mTw, Nuke, R15, has one fire event in two seconds, so GoodRifle, 76 units off, got his headshot)
    for (const e in D.slots) {
      const se = +e; if (se === d.e || seen.has(se)) continue;
      const a = D.slots[se]; if (!a || isNaN(a[i * S]) || !(a[i * S + 5] > 0) || team(se, i) === vt || team(se, i) == null) continue;
      const gun = weaponShort(D.models[a[i * S + 6]]); if (!MAX_DMG[gun]) continue;
      if (firesKept) continue;
      const c = aimAt(a, i, vp, head, vduck); if (c.along > 0 && c.off <= 32) cands.push(Object.assign(c, { e: se, gun, shot: false }));
    }
    if (!cands.length) { note(d, 'no shooter'); continue; }
    cands.sort((x, y) => x.off - y.off);
    const c = cands[0];
    // the only enemy near his line may aim a little wider when the demo has his shot (aim is recorded about ten times a second)
    if (c.off > (cands.length === 1 && c.shot ? 96 : 64) || (cands[1] && cands[1].off - c.off < 16)) { note(d, `unknown ${cands.slice(0, 2).map((x) => x.e + ':' + Math.round(x.off)).join(' ')}`); continue; }
    // less damage than his gun does in the open at that distance, for that hit sound: only a surface explains it
    // (level 2 by damage, Sujan 28 Oct 2026). Not when a teammate of the victim fired and aimed near him (team damage
    // is cut), and not when another player stood on the line (a bullet through a player keeps 0.75: cArNaGe on
    // STRIKE, Sweden vs Ukraine, Train, ClanBase NationsCup XI, R22 C4 0:07, Sujan's catch)
    const lo = openLow(c.gun, Math.hypot(c.tgt[0] - c.eye[0], c.tgt[1] - c.eye[1], c.tgt[2] - c.eye[2]), hs.map((h) => h[2]));
    if (lo && d.dmg < lo - 1) {
      let other = false;
      for (const e in D.slots) {
        const se = +e; if (se === c.e || se === d.e) continue;
        const p = D.slots[se]; if (!p || isNaN(p[i * S]) || !(p[i * S + 5] > 0)) continue;
        if (team(se, i) === vt && (shots[se] || []).some((t) => t >= th - 0.2 && t <= th + 0.001) && aimAt(p, i, vp, head, vduck).off <= 32) { other = true; break; }
        const u = [c.tgt[0] - c.eye[0], c.tgt[1] - c.eye[1], c.tgt[2] - c.eye[2]], L = Math.hypot(...u), rel = [p[i * S] - c.eye[0], p[i * S + 1] - c.eye[1], p[i * S + 2] + 18 - c.eye[2]];
        const al = (rel[0] * u[0] + rel[1] * u[1] + rel[2] * u[2]) / L;
        if (al > 20 && al < L - 10 && Math.hypot(...rel.map((x, j) => x - u[j] / L * al)) < 32) { other = true; break; }
      }
      if (!other) proven.push({ t: th, v: d.e, s: c.e, dmg: d.dmg, head, gun: c.gun, open: lo });
    }
    const per = MAX_DMG[c.gun];
    if (per && d.dmg > per * 0.6 * (head ? 4 : 1.25) * Math.max(1, hs.length)) { note(d, 'too much for a wall'); continue; }
    const skip = brokenSet(th - 0.05); for (const m of notCover) skip.add(m);
    const poses = posesAt(th - 0.05);
    const end = [c.eye[0] + c.dir[0] * c.along, c.eye[1] + c.dir[1] * c.along, c.eye[2] + c.dir[2] * c.along];
    const aimS = solidAlong(bsp, c.eye, end, 2, skip, poses, 'bullet').solid, zoneS = solidAlong(bsp, c.eye, c.tgt, 2, skip, poses, 'bullet').solid;
    if (aimS === 0 || zoneS === 0) { note(d, `open aim ${Math.round(aimS)} zone ${Math.round(zoneS)} off ${Math.round(c.off)} by ${c.e}`); continue; }
    note(d, `cover by ${c.e} off ${Math.round(c.off)}`);
    cover.push({ t: th, v: d.e, s: c.e, dmg: d.dmg, head, gun: c.gun });
  }
  // seen kills with the crosshair through cover (computeWallbangs) become loose wallbangs when a bullet of the
  // killer's that only a surface explains landed 0.5 s or less before the kill (Sujan, 28 Oct 2026: the same spray
  // only; a hit matched by his aim alone counts here, since the kill confirms he was shooting at him then). Their
  // hits through a surface join the burst, so the kill shows its numbers.
  for (const k of D.kills) {
    if (!k.seenAim || (k.wb && k.wb.loose !== 'dmg') || !M.liveR.some((r) => r.n === k.round)) continue;
    const mine = proven.filter((p) => p.v === k.victim && p.s === k.killer && p.t <= k.t + 0.01 && k.t - p.t <= 2);
    // a millisecond more for rounding: the demo's times are 32-bit floats, so Darky's hit on n0rx (k1ck vs eq, Nuke,
    // DreamHack Winter 2011, R15 C4 0:10) reads 0.500244 s before the kill (Sujan, 30 Oct 2026: it counts)
    const near = mine.filter((p) => k.t - p.t <= 0.501);
    if (!near.length) continue;
    k.wb = Object.assign({}, k.seenAim, { loose: 'dmg', dmg: near[near.length - 1] }); k.seenPx = -2;
    for (const p of mine) if (!cover.some((x) => x.t === p.t && x.v === p.v)) cover.push(p);
  }
  M.wbs = D.kills.filter((k) => k.wb && M.liveR.some((r) => r.n === k.round));
  cover.sort((x, y) => x.t - y.t);
  const byV = {}; for (const h of cover) (byV[h.v] || (byV[h.v] = [])).push(h);
  for (const v in byV) {
    let cur = null;
    for (const h of byV[v]) {
      if (cur && h.t - cur.end <= 2) { cur.hits.push(h); cur.end = h.t; }
      else { cur = { v: +v, hits: [h], start: h.t, end: h.t }; M.bursts.push(cur); }
    }
  }
  for (const b of M.bursts) {
    const kill = D.kills.find((k) => k.victim === b.v && k.wb && k.t >= b.end && k.t - b.end <= 2 && b.hits.some((h) => h.s === k.killer));
    if (kill) { b.kill = kill; b.hits.push({ t: kill.t, v: b.v, s: kill.killer, dmg: hpBefore(b.v, kill.tMsg != null ? kill.tMsg : kill.t), head: !!kill.hs, gun: kill.weapon, kill: true }); kill.burst = b; }
    b.total = b.hits.reduce((a, h) => a + h.dmg, 0);
    b.share = {}; for (const h of b.hits) b.share[h.s] = (b.share[h.s] || 0) + h.dmg;
    b.main = +Object.keys(b.share).sort((x, y) => b.share[y] - b.share[x])[0];
    const r = M.rounds.find((x) => b.start >= x.start && (x.end == null || b.start <= x.end + 0.5)); b.round = r ? r.n : 0;
  }
  // the 35 HP minimum is for damage that didn't kill (the DAMAGE rows); a burst ending in a wallbang kill stays
  // whatever its total, so the kill shows its numbers (Sujan, 1 Nov 2026: 115 of 634 wallbang kills on the 64 demos had
  // none, with 10 to 34 HP in the burst: starix's 12 HP through cover and the 7 he had left on RobbaN, Na`Vi vs SK,
  // Inferno, recorded 24 Oct 2011, R14 0:26). A kill whose burst is dropped all the same gets the killing bullet alone below.
  M.bursts = M.bursts.filter((b) => (b.kill || b.total >= HITS_MIN) && M.liveR.some((r) => r.n === b.round)).sort((x, y) => x.start - y.start);
  for (const k of D.kills) if (k.burst && !M.bursts.includes(k.burst)) k.burst = null;
  // every wallbang kill gets its numbers (Sujan, 26 Oct 2026), also one with no hit through cover before it: then the
  // killing bullet alone, taking what he had left
  for (const k of D.kills) {
    if (!k.wb || k.burst || !M.liveR.some((r) => r.n === k.round)) continue;
    const h = { t: k.t, v: k.victim, s: k.killer, dmg: hpBefore(k.victim, k.tMsg != null ? k.tMsg : k.t), head: !!k.hs, gun: k.weapon, kill: true };
    const b = { v: k.victim, hits: [h], start: k.t, end: k.t, kill: k, total: h.dmg, share: { [k.killer]: h.dmg }, main: k.killer, round: k.round, solo: true };
    k.burst = b; M.bursts.push(b);
  }
  M.bursts.sort((x, y) => x.start - y.start);
  for (const b of M.bursts) (M.hitByV[b.v] || (M.hitByV[b.v] = [])).push(b);
  renderPane(); drawTimeline();
}
// the other shooters in a burst go on a line of their own under the damage, so a long name isn't cut off (Sujan,
// 26 Oct 2026: "Xi '2q' Wang 49 before" was cut at "War" on Go's kill of zonic, tyloo vs mTw, Nuke)
const dmore = (list) => list.length ? `<span class="dmore">${list.join(' · ')}</span>` : '';
// "(1 HS, 2 hits)": headshots and the other hits so far in the burst, at time t (Sujan, 26 Oct 2026)
function hitCounts(b, t) {
  const so = b.hits.filter((h) => h.t <= t + 1e-4), nh = so.filter((h) => h.head).length, nb = so.length - nh;
  return [nh ? `${nh} HS` : '', nb ? `${nb} hit${nb > 1 ? 's' : ''}` : ''].filter(Boolean).join(', ');
}
// the burst a player is in at time t, from his first hit until 1.5 s after the last (or his death)
function burstAt(e, t) {
  const L = M.hitByV && M.hitByV[e]; if (!L) return null;
  for (const b of L) { const endT = b.kill ? b.kill.t : b.end + 1.5; if (t >= b.start - 1e-4 && t <= endT) return b; }
  return null;
}

// Stretches of the demo that the server announced as live: [start, end] pairs from its text messages.
// Opens on "live", closes on the end of a half or the match, a warmup or knife round, or a pause
// announcement; a "canceled" set throws away the stretch it was in.
// partStarts: where each part of a joined map starts (a part can begin partway through a half, see below).
function liveWindows(notes, partStarts) {
  const clean = (s) => s.replace(/[\x00-\x1f]/g, ' ').trim();
  // short announcements only, so a player called "LiveWire" joining doesn't count
  const isLive = (s) => (/\blive\b/i.test(s) && (s.length < 60 || /\blive\b.*\blive\b/i.test(s)) && !/\b(not|until|before|going|goes)\b.{0,12}\blive\b|\blive\b.{0,12}\b(in|after|soon)\b/i.test(s))
    // "lo3" (live on three): the admin starting the three restarts, as in the FX vs SK Inferno demo (IEM5, 2011)
    || (s.length < 60 && /(^|[\s>:])(lo3|l03|live on (3|three))\b/i.test(s))
    // the ESWC 2010 server plugin (VeryGames): "3 restart and go !", then "Fight !!!" when the half starts
    // (mTw vs Na`Vi, Tuscan and Train, ESWC 2010 semi-final). It ends with "End of 1st set" and "End of fight".
    || (s.length < 60 && (/\b3 restarts? and go\b/i.test(s) || /(^|>)\s*fight\s*!+\s*$/i.test(s)));
  // also the PGL plugin's "Neither team has a 6 point lead. The overtime process will now repeat." (an
  // overtime has ended; a warmup round can start before its "Warmup is commencing" line)
  const isHalfEnd = (s) => /end of (the )?(1st|2nd|first|second|set|half|fight|match|game|map)|half[\s-]?time|match (is )?over|final(e)? score|overtime process will|point lead/i.test(s);
  const isWarm = (s) => /\bwarm[\s-]?up|\bknife\b/i.test(s);
  const isCancel = (s) => /\b(canceled|cancelled|aborted)\b/i.test(s);
  const out = []; let open = null, seenLive = false;
  // A file that starts partway through a half: everything before its first end of half counted, if no live
  // announcement came first. For a joined map, the same holds for each later part (the OT2 file of mTw vs
  // Na`Vi, Tuscan, ESWC 2010 starts in the first half of the second overtime). Warmup lines don't change it:
  // that server prints "2nd Warmup" a second before "End of 1st set".
  const ps = (partStarts || []).slice().sort((a, b) => a - b);
  let pi = 0, fresh = true, freshFrom = -Infinity;
  const starts = [];
  for (const n of notes) {
    while (pi < ps.length && ps[pi] <= n.t) { if (open == null) { fresh = true; freshFrom = ps[pi]; } pi++; }
    const s = clean(n.s);
    if (isCancel(s)) { open = null; continue; }
    if (isHalfEnd(s) || isWarm(s)) {
      // the third value says why the window closed: 'end' (a half or overtime ended) or 'warmup'
      const why = isHalfEnd(s) ? 'end' : 'warmup';
      if (open != null) out.push([open, n.t, why]);
      else if (fresh && isHalfEnd(s)) out.push([freshFrom, n.t, why]);
      if (isHalfEnd(s)) fresh = false;
      open = null; continue;
    }
    if (isLive(s)) { seenLive = true; fresh = false; starts.push(n.t); if (open == null) open = n.t; }
  }
  if (open != null) out.push([open, Infinity, 'open']);
  const res = seenLive ? out : [];
  res.starts = starts; // every live announcement (used to cut a stretch that ran past the end of a half)
  return res;
}
