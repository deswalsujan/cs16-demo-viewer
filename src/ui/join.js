// ---------------- finding the parts of a map, and the Join card ----------------
// Approved design: docs/split-map-mock.png. Background and decisions: IDEAS.md, "Join a map split over several
// demo files". Words: "map", never "match" (a match is often several maps, each its own demo or demos).
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// The recording time in a file name, when it has one: HLTV's own "1104240025" is 24 Apr 2011 at 00:25 (yymmddhhmm),
// "1110231216--auto_..." the same form, "2006-07-02_15h00_..." another. HLTV's comes first: the three parts of Na`Vi vs SK,
// Inferno, ESWC 2011 all start "2011-10-24_16h08_NaVi_SK-", and only their 1609, 1724 and 1740 put them in order (Sujan,
// 7 Nov 2026; the Join card suggested 1609, 1740, 1724 up to 0.26.18). Names like FX-vs-sk-iem5-inf.dem have none.
function fileTime(name) {
  for (const m of name.matchAll(/(?:^|\D)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(?=\D|$)/g)) {
    if (+m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= 31 && +m[4] < 24 && +m[5] < 60) return Date.UTC(2000 + +m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  }
  const m = /(\d{4})-(\d\d)-(\d\d)_(\d\d)h(\d\d)/.exec(name);
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) : null;
}
const hhmm = (d) => String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
const dayOf = (d) => `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
// "16:09, 17:24, 17:40": the recording times as clock times, with the day where it changes from the time before
function clockList(ts) {
  return ts.map((t, k) => { const d = new Date(t), p = k ? new Date(ts[k - 1]) : null; return (p && dayOf(d) !== dayOf(p) ? `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ` : '') + hhmm(d); }).join(', ');
}
// A file name shown in full, with .dem. It may wrap only after a - _ or . and never inside its last piece
// ("de_inferno.dem"), since the part that tells two parts apart is often in the middle.
function fileNameHtml(n) {
  const m = /(?:[a-z0-9]+_)?[a-z0-9]+\.dem$/i.exec(n);
  const tail = m ? m[0] : '', head = n.slice(0, n.length - tail.length);
  return esc(head).replace(/([-_.])/g, '$1<wbr>') + `<span class="nw">${esc(tail)}</span>`;
}
// per-demo settings (team names, Count them) are kept per file, or per set of files for a joined map
const demoKey = () => D.joinKey || D.fileName;
// How the live rounds of a demo begin: partway into a round (kills before the first round marker, and that
// round counts), and with how many rounds already on the game's scoreboard by side, played before the
// recording started. Read at the first live round, never at the file's first marker, which is usually in
// the warmup and carries the warmup's score.
function liveStart(M) {
  const f = M.liveR[0];
  if (!f) return { partway: false, sbT: 0, sbCT: 0 };
  if (f.partial) {
    const nx = M.rounds[M.rounds.indexOf(f) + 1];
    return { partway: true, sbT: Math.max(0, (nx ? nx.scoreT || 0 : 0) - (f.winner === 'T' ? 1 : 0)), sbCT: Math.max(0, (nx ? nx.scoreCT || 0 : 0) - (f.winner === 'CT' ? 1 : 0)) };
  }
  return { partway: false, sbT: f.scoreT || 0, sbCT: f.scoreCT || 0 };
}
const realSid = (s) => !!s && /^\d+$/.test(s) && !/^0+$/.test(s);
const plural = (n, one, many) => `${n} ${n === 1 ? one : (many || one + 's')}`;
// The map name and the real Steam IDs in the first 4 MB of a demo, without reading all of it. The players'
// info comes early: all 12 to 13 Steam IDs of the Xperia Play 2011 FX vs mTw files are in the first 256 KB.
const QUICK = new Map();
async function quickInfo(f) {
  const key = f.name + '|' + f.size + '|' + f.lastModified;
  if (QUICK.has(key)) return QUICK.get(key);
  let out = null;
  try {
    const txt = new TextDecoder('latin1').decode(new Uint8Array(await f.slice(0, 4 << 20).arrayBuffer()));
    if (txt.startsWith('HLDEMO')) {
      const sids = new Set();
      for (const m of txt.matchAll(/\\\*sid\\(\d+)/g)) if (realSid(m[1])) sids.add(m[1]);
      out = { map: txt.slice(16, 276).split('\0')[0].toLowerCase(), sids };
    }
  } catch (e) { out = null; }
  QUICK.set(key, out);
  return out;
}
// The real Steam IDs of the people who played the open demo's live rounds
function liveSids() {
  const s = new Set();
  for (const g of M.teams) for (const pid of g) for (const o of (M.pl[pid] && M.pl[pid].occs) || []) if (realSid(o.sid)) s.add(o.sid);
  return s;
}
// Other parts of the open demo's map in the folder: another demo on the same map with at least 8 of the same
// Steam IDs. When both file names carry a recording time, only files recorded within 6 hours of this one.
async function findOtherParts() {
  const mine = liveSids();
  if (mine.size < 8 || !files || !files.demos) return [];
  const map = (D.mapName || '').toLowerCase(), t0 = fileTime(D.fileName), out = [];
  for (const f of files.demos) {
    if (f.name === D.fileName) continue;
    const t = fileTime(f.name);
    if (t0 != null && t != null && Math.abs(t - t0) > 6 * 3600e3) continue;
    const q = await quickInfo(f);
    if (!q || q.map !== map) continue;
    let n = 0; for (const s of q.sids) if (mine.has(s)) n++;
    if (n >= 8) out.push(f);
  }
  return out;
}
// What one part says on its own: counted by itself (a copy, so the part stays as read for joining), then the
// facts the Join card needs.
function partFacts(P) {
  const keep = [D, M];
  D = Object.assign({}, P, { kills: P.kills.map((k) => Object.assign({}, k)), _even: null });
  try {
    derive();
    const live = M.liveR, first = live[0], last = live[live.length - 1];
    const idOf = (pid) => { const o = ((M.pl[pid] && M.pl[pid].occs) || []).find((x) => realSid(x.sid)); return o ? o.sid : 'name:' + (M.pl[pid] ? M.pl[pid].name : pid); };
    const players = new Set(); for (const g of M.teams) for (const pid of g) players.add(idOf(pid));
    const onT = (r) => { const s = new Set(); if (r) for (const pid in r.sides) if (r.sides[pid] === 1) s.add(idOf(pid)); return s; };
    const ls0 = liveStart(M), sb = [ls0.sbT, ls0.sbCT];
    const lead = ls0.partway ? first : null;
    const teamOnT = first ? M.tnames[first.tTeam] : null, teamOnCT = first ? M.tnames[1 - first.tTeam] : null;
    const missT = sb[0], missCT = sb[1];
    return {
      fileName: P.fileName, map: (P.mapName || '').toLowerCase(), host: (P.serverInfo && P.serverInfo.hostName) || '', time: fileTime(P.fileName),
      live: live.length, score: last ? last.scoreAfter.slice() : [0, 0], tnames: M.tnames.slice(),
      won: !!M.wonAt, wonBy: M.wonAt && M.wonAt.winTeam != null ? M.tnames[M.wonAt.winTeam] : null,
      sb, partway: !!lead, leadWinner: lead && lead.winner ? (lead.winner === 'T' ? teamOnT : teamOnCT) : null,
      missT, missCT, teamOnT, teamOnCT, startsLate: missT + missCT > 0 || !!lead,
      players, byName: [...players].every((p) => p.startsWith('name:')), firstT: onT(first), lastT: onT(last),
      // rounds replayed from 0:0 (see derive), and how many rounds count before the teams first change sides (null: never)
      replayed: M.rounds.filter((r) => r.replayed).length,
      swapAt: first ? (((i) => (i < 0 ? null : i))(live.findIndex((r) => r.tTeam !== first.tTeam))) : null,
    };
  } finally { D = keep[0]; M = keep[1]; }
}
// Whether the teams are on other sides from part a to part b: who was on T in a's last round that counts and b's first
const sidesSwap = (a, b) => { let same = 0; for (const p of a.lastT) if (b.firstT.has(p)) same++; return same <= Math.min(a.lastT.size, b.firstT.size) / 2; };
// How many rounds of the map come before part i + 1: the parts before it, with the rounds no file holds
const roundsBefore = (F, i) => { let n = 0; for (let j = 0; j <= i; j++) n += F[j].live + (j ? F[j].missT + F[j].missCT : 0); return n; };
// A half's end in MR15 (15, 30, every 3 rounds of overtime) or MR12 (12, 24, every 3 after)
const halfEndAny = (x) => x === 12 || x === 15 || x === 24 || x === 30 || (x > 24 && x < 30 && (x - 24) % 3 === 0) || (x > 30 && (x - 30) % 3 === 0);
// Why the rounds don't allow this order (null when they do): the first part must start from 0:0, and only the
// last part can have a winner. Then (Sujan, 7 Nov 2026, from WeMadeFox vs Ravens, Nuke, EM4 finals with part 2 put first):
// A, the first part's teams change sides only after a whole half, or its first half began in an earlier recording;
// B, the teams are on other sides from one part to the next only at a half end, and on the same sides not at half time.
// Tested on every order of the six joined maps of 7 Nov 2026, no right order caught (tests/logs/join-replay-carry-2026-11-07.md).
// The same sides after 12 rounds aren't refused: in MR15 that's a crash after the 12th round of a half, which carries on.
function orderProblem(F) {
  const head = (f) => f.partway ? 'starts partway into a round' : `starts with ${plural(f.sb[0] + f.sb[1], 'round')} already on the scoreboard`;
  if (F[0].startsLate) {
    const fresh = F.findIndex((f, i) => i && !f.startsLate);
    return `Part 1 ${head(F[0])}${fresh > 0 ? `, and part ${fresh + 1} starts from 0:0 with the first half` : ''}.`;
  }
  for (let i = 0; i < F.length - 1; i++) if (F[i].won) return `Part ${i + 1} ends with ${F[i].wonBy} winning the map, so no part can come after it.`;
  if (F[0].swapAt != null && F[0].swapAt !== 15 && F[0].swapAt !== 12) return `Part 1's teams change sides after ${plural(F[0].swapAt, 'round')}, so its first half began in an earlier recording.`;
  for (let i = 0; i < F.length - 1; i++) {
    if (!F[i].live || !F[i + 1].live) continue;
    const n = roundsBefore(F, i), swap = sidesSwap(F[i], F[i + 1]);
    if (swap && !halfEndAny(n)) return `The map is ${plural(n, 'round')} in when part ${i + 1} ends, partway through a half, but the teams are on other sides in part ${i + 2}.`;
    if (!swap && n === 15) return `The map is at half time when part ${i + 1} ends, after 15 rounds, but the teams are on the same sides in part ${i + 2}.`;
  }
  return null;
}
// What Join them would count for these parts in this order (Ps parsed, F their facts), for the card's words on a half carried
// on across two recordings (see derive): for each part, null, or where the map stands when it starts and how the half goes
// on. Joined and counted on a copy, as openJoined does; nothing else is kept.
function carryFacts(Ps, F) {
  const keep = [D, M];
  try {
    D = joinDemos(Ps.map((P, i) => Object.assign({}, P, { kills: P.kills.map((k) => Object.assign({}, k)), joinMiss: { T: F[i].missT, CT: F[i].missCT } })));
    derive();
    return Ps.map((P, k) => {
      const carried = k ? M.rounds.filter((r) => r.part === k - 1 && r.carry && r.live) : [];
      const mine = M.liveR.filter((r) => r.part === k), first = mine[0];
      if (!carried.length || !first) return null;
      let n = 0; for (const r of mine) { if (r.tTeam !== carried[0].tTeam) break; n++; }
      const pos = M.liveR.indexOf(carried[0]), end = pos < 15 ? 15 : pos < 30 ? 30 : 30 + 3 * (Math.floor((pos - 30) / 3) + 1);
      return {
        carried: carried.length, n, half: pos < 30 ? 15 : 3, complete: pos + carried.length + n === end,
        replayed: M.rounds.filter((r) => r.part === k && r.replayed && r.start < first.start).length,
        score: first.scoreBefore.slice(), tnames: M.tnames.slice(),
      };
    });
  } catch (e) { return Ps.map(() => null); } finally { D = keep[0]; M = keep[1]; }
}
const perms = (a) => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
// The order to suggest, in this order of trust: the recording times in the file names when every part has
// one, then the rounds when exactly one order makes a map, else none. Every order is tried only up to 8 parts (40,320
// orders): two picks of 5 demos at once (the Join batch) could reach 10, 3.6 million, which would stop the page.
function suggestOrder(F) {
  const idx = F.map((f, i) => i);
  const valid = F.length <= 8 ? perms(idx).filter((p) => !orderProblem(p.map((i) => F[i]))) : [];
  if (F.every((f) => f.time != null)) {
    const o = idx.slice().sort((a, b) => F[a].time - F[b].time);
    return { order: o, by: 'times', agree: !orderProblem(o.map((i) => F[i])), roundsOrder: valid.length === 1 ? valid[0] : null };
  }
  return valid.length === 1 ? { order: valid[0], by: 'rounds', agree: true, roundsOrder: valid[0] } : null;
}

// Joined sets are remembered per file, so opening any part opens the joined map; Split them forgets it. Each part's size is
// remembered with them (Sujan, 20 Nov 2026), so another file with the same name isn't joined: see loadDemoFile.
const joinedSetOf = (name) => { const v = ls.get('join:' + name); return v && Array.isArray(v.set) && v.set.length > 1 ? v : null; };
function rememberJoin(list, keep, why) { const names = list.map((f) => f.name), sizes = list.map((f) => f.size); for (const n of names) ls.set('join:' + n, { set: names, sizes, keep: !!keep, why: why || null }); }
function forgetJoin(names) { for (const n of names) ls.set('join:' + n, null); }
let CUR_FILE = null; // the file the open demo came from (one opened from elsewhere isn't in the folder list)
const fileByName = (n) => (CUR_FILE && CUR_FILE.name === n ? CUR_FILE : null) || (files && files.demos || []).find((f) => f.name === n) || ((D && D.partFiles) || []).find((f) => f.name === n) || null;

// Read the parts with the progress bar, then open them joined
async function openJoinedUI(list, parsed) {
  setMsg(`Reading ${list.length} files…`);
  $('prog').hidden = false; $('progBar').style.width = '2%';
  try { await openJoined(list, (p) => { $('progBar').style.width = (p * 100).toFixed(0) + '%'; }, parsed); }
  catch (e) { $('prog').hidden = true; setMsg(`Could not join the parts: ${e.message || e}`, true); }
}
function splitJoined() {
  if (!D || !D.parts) return;
  const names = D.parts.map((p) => p.fileName);
  const at = D.parts.slice().reverse().find((p) => p.start <= T) || D.parts[0];
  forgetJoin(names);
  const f = fileByName(at.fileName);
  if (f) loadDemoFile(f, { alone: true });
}

// ---- the Join card ----
// errs: the parts refused, shown one card after another (several demos picked at once can refuse more than one); fresh: the
// card opened with several demos picked at once, so no part is the open demo yet (see readJoinParts); note: the line under
// the picker when more than 5 were picked
const JOIN = { list: [], P: new Map(), F: new Map(), keep: false, moved: false, sugg: null, errs: [], picking: false, reading: null, carry: null, dup: null, checking: false, fresh: false, note: null };
function joinEl() {
  let el = $('joinCard');
  if (!el) { el = document.createElement('div'); el.className = 'overlay sumwrap'; el.id = 'joinCard'; el.hidden = true; $('sumCard').after(el); }
  return el;
}
function closeJoinCard() { joinEl().hidden = true; JOIN.picking = false; JOIN.errs = []; JOIN.note = null; }
// Up to 5 demos picked at once, in Open .dem from elsewhere and the Join card's A file from elsewhere… (Sujan, 19 Nov 2026):
// more than 5 open nothing, with one line saying how many were picked. The viewer's words say "pick", never "upload".
const PICK_MAX = 5;
const tooMany = (n) => n > PICK_MAX ? `Pick up to ${PICK_MAX} demos at once. You picked ${n}.` : null;
// the recording times in the file names first, in time order, then the names without one, by name
const byFileTime = (list) => list.slice().sort((a, b) => { const x = fileTime(a.name), y = fileTime(b.name); return x != null && y != null ? x - y : x != null ? -1 : y != null ? 1 : a.name.localeCompare(b.name, undefined, { numeric: true }); });
// Open .dem from elsewhere: one demo opens as before; two to five open the Join card with them, in recording-time order (then
// the card's own suggestion, as for any parts), each one checked as a part added to the card is
function openPicked(list) {
  if (!list.length) return;
  const many = tooMany(list.length);
  if (many) { setMsg(many, true); return; }
  if (list.length === 1) { loadDemoFile(list[0]); return; }
  setMsg('');
  JOIN.P.clear(); JOIN.F.clear(); JOIN.carry = null;
  openJoinCard(byFileTime(list), true);
}
// the Join card with the open demo's parts and its picker open, to add a part: the Rounds tab's Join parts…, and the load
// card's when no other part is in the folder (Sujan, 19 Nov 2026)
function openJoinPicker() {
  const cur = D.parts ? D.parts.map((x) => fileByName(x.fileName)).filter(Boolean) : [CUR_FILE || fileByName(D.fileName)].filter(Boolean);
  JOIN.picking = true; openJoinCard(cur).then(() => { JOIN.picking = true; renderJoinCard(); });
}
async function openJoinCard(list, fresh) {
  closeSummary();
  Object.assign(JOIN, { list: list.slice(), keep: false, moved: false, sugg: null, errs: [], picking: false, okOpen: false, dup: null, checking: false, fresh: !!fresh, note: null });
  await readJoinParts();
}
// Add demos to the parts (one from the folder's list, up to 5 from elsewhere): each refused when it's another map or has
// different players; a name already among the parts is left out
async function addJoinParts(list) {
  JOIN.picking = false; JOIN.note = null;
  const add = list.filter((f, i) => !JOIN.list.some((x) => x.name === f.name) && list.findIndex((g) => g.name === f.name) === i);
  if (!add.length) { renderJoinCard(); return; }
  JOIN.list.push(...byFileTime(add));
  await readJoinParts();
}
const addJoinPart = (f) => addJoinParts([f]); // one demo, as up to 0.27.2 (tests/page/split_wrong_map.js)
// Whether two files are the same recording under two names (Sujan, 20 Nov 2026): the same size, then the same bytes, read 8 MB
// at a time from each; remembered per pair
const SAME = new Map();
async function sameFile(a, b) {
  if (a.size !== b.size) return false;
  const key = [a, b].map((f) => `${f.name}|${f.size}|${f.lastModified}`).sort().join('\n');
  if (SAME.has(key)) return SAME.get(key);
  let same = true;
  try {
    for (let o = 0; o < a.size && same; o += 8 << 20) {
      const [x, y] = await Promise.all([a, b].map((f) => f.slice(o, o + (8 << 20)).arrayBuffer().then((v) => new Uint8Array(v))));
      for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) { same = false; break; }
    }
  } catch (e) { same = false; }
  SAME.set(key, same);
  return same;
}
async function readJoinParts() {
  for (const f of JOIN.list.slice()) {
    if (JOIN.F.has(f.name)) continue;
    JOIN.reading = f.name; renderJoinCard();
    try {
      const P = await parseInWorker(f, (p) => { const b = $('jProg'); if (b) b.style.width = (p * 100).toFixed(0) + '%'; });
      JOIN.P.set(f.name, P); JOIN.F.set(f.name, partFacts(P));
    } catch (e) {
      JOIN.list = JOIN.list.filter((x) => x !== f);
      JOIN.errs.push({ kind: 'read', name: f.name, why: e.message || String(e) });
    }
  }
  JOIN.reading = null;
  // checks that refuse a part outright: another map, or fewer than 8 of the same players than the part the others are checked
  // against: the first part (the open demo, when the card opened from it), or, with several demos picked at once, the one most
  // of the others pass against, the earliest on a tie, so one stray demo among them is the one refused
  const F = JOIN.list.map((f) => JOIN.F.get(f.name));
  const bad = (f, base) => {
    if (f.map !== base.map) return { kind: 'map', name: f.fileName, map: f.map, base: base.map };
    let n = 0; for (const p of f.players) if (base.players.has(p)) n++;
    const of = Math.max(base.players.size, f.players.size);
    if (n < 8) return { kind: 'players', name: f.fileName, n, of, byName: base.byName || f.byName };
    return null;
  };
  let b = 0;
  if (JOIN.fresh && F.length > 2) { let best = -1; F.forEach((f, i) => { const n = F.filter((g, j) => j !== i && !bad(g, f)).length; if (n > best) { best = n; b = i; } }); }
  JOIN.fresh = false;
  const base = F[b];
  for (let i = 0; i < F.length; i++) {
    const e = F[i] === base ? null : bad(F[i], base);
    if (e) { JOIN.errs.push(e); JOIN.list.splice(i, 1); F.splice(i, 1); i--; }
  }
  // a part that is byte for byte an earlier one under another name: a warning, Join parts off until it's removed (Sujan, 20 Nov
  // 2026; joined, its rounds counted again, as overtime after a 15:15 part: Na`Vi vs SK, Inferno, ESWC 2011, the first file twice)
  JOIN.dup = null; JOIN.checking = true;
  for (let j = 1; j < JOIN.list.length && !JOIN.dup; j++) for (let i = 0; i < j; i++) if (await sameFile(JOIN.list[i], JOIN.list[j])) { JOIN.dup = [JOIN.list[i].name, JOIN.list[j].name]; break; }
  JOIN.checking = false;
  if (!JOIN.moved && F.length > 1) {
    JOIN.sugg = suggestOrder(F);
    if (JOIN.sugg) JOIN.list = JOIN.sugg.order.map((i) => JOIN.list[i]);
  }
  renderJoinCard();
}
function joinMove(i, d) {
  const j = i + d; if (j < 0 || j >= JOIN.list.length) return;
  [JOIN.list[i], JOIN.list[j]] = [JOIN.list[j], JOIN.list[i]];
  JOIN.moved = true; JOIN.keep = false; renderJoinCard();
}
// the order of the recording times in the file names (Sujan, 19 Nov 2026)
function useRecorded() {
  const t = JOIN.list.map((f) => JOIN.F.get(f.name).time);
  JOIN.list = JOIN.list.map((f, i) => i).sort((a, b) => t[a] - t[b]).map((i) => JOIN.list[i]);
  JOIN.keep = false; JOIN.moved = false; renderJoinCard();
}
function useSuggested() {
  const F = JOIN.list.map((f) => JOIN.F.get(f.name));
  const s = suggestOrder(F);
  const o = s && (s.agree ? s.order : s.roundsOrder);
  if (o) JOIN.list = o.map((i) => JOIN.list[i]);
  JOIN.keep = false; JOIN.moved = false; renderJoinCard();
}
// one part's line under its file name. cf: carryFacts for this part, when it carries on the previous part's half; it then says
// where the map stands, since its own scoreboard starts again from 0:0 (Sujan, 7 Nov 2026). It doesn't say why the recording
// broke: the viewer can't tell a server crash from a recording that stopped (Sujan, 7 Nov 2026, before the merge).
function partLine(f, i, cf) {
  if (!f.live) return 'no rounds in it';
  const [a, b] = f.score, [tA, tB] = f.tnames, end = f.won ? `${f.wonBy} won the map` : 'no winner';
  if (cf) return `Carries on at ${cf.tnames[0]} ${cf.score[0]} : ${cf.score[1]} ${cf.tnames[1]}, ${plural(f.live, 'round')}, ${end}.`;
  if (i === 0 && !f.startsLate && f.replayed) return `${plural(f.live, 'round')} ${f.live === 1 ? 'counts' : 'count'}, ending at ${tA} ${a} : ${b} ${tB}, ${end}. ${plural(f.replayed, 'earlier round')} ${f.replayed === 1 ? 'was' : 'were'} replayed: restarted from 0:0 on the same sides.`;
  if (i === 0 && !f.startsLate) return `${plural(f.live, 'round')}, ends at ${tA} ${a} : ${b} ${tB}, ${end}`;
  const how = f.partway ? `Starts partway into a round, then ${plural(f.live - 1, 'more round')}` : f.startsLate ? `Starts with ${plural(f.sb[0] + f.sb[1], 'round')} already played, then ${plural(f.live, 'round')}` : `Starts from 0:0, ${plural(f.live, 'round')}`;
  return how + (f.won ? `, ${f.wonBy} won the map` : ', no winner');
}
function renderJoinCard() {
  const el = joinEl();
  const F = JOIN.list.map((f) => JOIN.F.get(f.name)).filter(Boolean);
  const ic = { ok: '✓', warn: '!', info: 'i', fail: '✕' };
  const x = '<button class="sum-x" type="button" id="jX" title="Close (Esc)" aria-label="Close">×</button>';
  // a part that was refused: its own card first
  if (JOIN.errs.length) {
    const e = JOIN.errs[0];
    const txt = e.kind === 'map' ? `${esc(e.name)} is on ${esc(e.map)}. The parts so far are on ${esc(e.base)}. Only the parts of one map can be joined; each map of a match stays its own demo.`
      : e.kind === 'players' ? `${esc(e.name)} has only ${e.n} of the same ${e.of} players${e.byName ? ' (matched by name; these demos have no Steam IDs)' : ''}. It's probably another match on the same map, which stays its own demo.`
      : `${esc(e.name)} couldn't be read: ${esc(e.why)}`;
    const title = e.kind === 'map' ? 'This demo is from another map' : e.kind === 'players' ? 'These demos have different players' : "This demo can't be read";
    el.innerHTML = `<div class="sum" role="dialog" aria-labelledby="jTitle"><div class="sum-top fail"><div class="ti"><h2 id="jTitle">${title}</h2><p>${txt}</p></div>${x}</div>
      <div class="sum-foot"><span class="sp"></span><button class="btn" type="button" id="jPick">Pick another demo…</button><button class="btn" type="button" id="jOk">OK</button></div></div>`;
    el.hidden = false;
    $('jX').onclick = closeJoinCard;
    // OK: the next part refused, if any, then the card, or nothing when no two parts are left to join
    $('jOk').onclick = () => { JOIN.errs.shift(); if (JOIN.errs.length || JOIN.list.length > 1) renderJoinCard(); else closeJoinCard(); };
    $('jPick').onclick = () => { JOIN.errs = []; JOIN.picking = true; renderJoinCard(); };
    return;
  }
  const problem = F.length === JOIN.list.length && F.length > 1 ? orderProblem(F) : null;
  // what joining in this order would count (a half carried on from one part to the next), worked out once per order
  const key = JOIN.list.map((f) => f.name).join('|');
  if (F.length === JOIN.list.length && F.length > 1 && !JOIN.reading && (!JOIN.carry || JOIN.carry.key !== key)) JOIN.carry = { key, facts: carryFacts(JOIN.list.map((f) => JOIN.P.get(f.name)), F) };
  const CF = JOIN.carry && JOIN.carry.key === key ? JOIN.carry.facts : [];
  const rows = JOIN.list.map((f, i) => {
    const fa = JOIN.F.get(f.name);
    const meta = fa ? esc(partLine(fa, i, CF[i])) : JOIN.reading === f.name ? `Reading… <span class="jbar"><i id="jProg"></i></span>` : 'Waiting to be read';
    return `<li><span class="jn">Part ${i + 1}</span><span class="jf"><span class="jname">${fileNameHtml(f.name)}</span><small>${meta}</small></span>
      <span class="ja"><button class="btn sq" type="button" data-mv="${i},-1" ${i ? '' : 'disabled'} title="Move up" aria-label="Move part ${i + 1} up">↑</button><button class="btn sq" type="button" data-mv="${i},1" ${i < JOIN.list.length - 1 ? '' : 'disabled'} title="Move down" aria-label="Move part ${i + 1} down">↓</button></span></li>`;
  }).join('');
  // The verdict (Sujan, 19 Nov 2026): one line saying which order the parts are in and whether the rounds agree, in place of
  // the order line and the "N checks pass" count of the UI review's item 10, which misled him: on Na`Vi vs SK, Inferno, ESWC
  // 2011 the wrong order (16:09, 17:40, 17:24) showed 3 passes and the right one 2. An order that differs from the recording
  // times in the file names is a warning with Use the recorded order (grey words in the order line up to then, 7 Nov 2026).
  // the same recording twice under two names, named by where the two are now
  const dupAt = JOIN.dup ? JOIN.dup.map((n) => JOIN.list.findIndex((f) => f.name === n)).sort((a, b) => a - b) : null;
  const dupWarn = dupAt && dupAt[0] >= 0 ? { s: 'warn', t: `Part ${dupAt[1] + 1} is the same recording as part ${dupAt[0] + 1}, under another name`, btn: { id: 'jDrop', label: `Remove part ${dupAt[1] + 1}` } } : null;
  // A part that starts from 0:0 after earlier parts already played rounds that count (Sujan, 20 Nov 2026): only a warning, Join
  // parts stays on, since a match can restart from 0:0 after a server crash. It catches the same rounds recorded twice in files
  // that aren't byte for byte the same (the first Na`Vi vs SK, Inferno, ESWC 2011 part twice joined as 47 rounds at 22:25, not
  // 41 at 19:22). The rounds are each earlier part's own count, as its line says (WeMadeFox vs Ravens' part 1: 4, not its 13
  // replayed), with the rounds no file holds; a part that starts partway into a round doesn't start from 0:0. Not on a part
  // the card reads as carrying on the half: WeMadeFox vs Ravens, Nuke, EM4 finals in the right order has none.
  const zeroWarns = [];
  if (F.length === JOIN.list.length && F.length > 1 && JOIN.carry && JOIN.carry.key === key) {
    for (let i = 1; i < F.length; i++) {
      if (!F[i].live || F[i].startsLate || CF[i]) continue;
      const by = F.slice(0, i).map((g, j) => ({ j, n: g.live + (j ? g.missT + g.missCT : 0) })).filter((x) => x.n);
      if (!by.length) continue;
      const nums = by.map((x) => x.j + 1), n = by.reduce((a, x) => a + x.n, 0);
      const who = nums.length === 1 ? `part ${nums[0]}` : `parts ${nums.slice(0, -1).join(', ')} and ${nums[nums.length - 1]}`;
      zeroWarns.push({ s: 'warn', t: `Part ${i + 1} starts from 0:0, but ${who} already played ${plural(n, 'round')}.` });
    }
  }
  let verdict = null, recWarn = null, recIdx = null;
  if (F.length === JOIN.list.length && F.length > 1) {
    const s = JOIN.sugg, t = F.map((f) => f.time), timed = t.every((x) => x != null);
    const off = timed && t.some((x, k) => k && t[k - 1] > x), agree = problem ? '' : ' The rounds agree.';
    let txt;
    if (timed && !off) txt = `In the order they were recorded: ${clockList(t)}.${agree}`;
    else if (JOIN.moved) txt = `In your order.${agree}`;
    else if (s && s.by === 'rounds') txt = 'In the only order the rounds allow: the first part starts from 0:0 and only the last one has a winner.';
    else txt = "The files don't say which order they go in. Put the parts in order with the arrows.";
    // no green tick on an order the rounds allow but the recording times don't: that tick misled Sujan (19 Nov 2026)
    verdict = { s: problem || off || dupWarn || zeroWarns.length ? 'warn' : txt.startsWith('In ') ? 'ok' : 'info', t: txt };
    if (off) {
      recIdx = F.map((f, i) => i).sort((a, b) => t[a] - t[b]);
      // its button the primary (gold) one (Sujan, 20 Nov 2026); in the "doesn't add up" box below when that shows
      recWarn = { s: 'warn', t: 'Not in the order they were recorded', n: `The recording times in the file names put them ${F.length === 2 ? 'the other way round' : 'in another order'}: ${clockList(recIdx.map((i) => t[i]))}.`, btn: { id: 'jRec', label: 'Use the recorded order', primary: true } };
    }
  }
  // the checks
  const checks = [];
  if (F.length === JOIN.list.length && F.length > 1) {
    const sameHost = F.every((f) => f.host && f.host === F[0].host);
    checks.push({ s: 'ok', t: `Same map: ${F[0].map}${sameHost ? ', same server' : ''}` });
    let common = [...F[0].players].filter((p) => F.every((f) => f.players.has(p))).length;
    const of = Math.max(...F.map((f) => f.players.size));
    const by = F.some((f) => f.byName) ? 'by name' : 'by Steam ID';
    checks.push({ s: 'ok', t: common === of ? `Same ${of} players, ${by}` : `${common} of the same ${of} players, ${by}` });
    for (let i = 0; i < F.length - 1; i++) {
      const a = F[i], b = F[i + 1];
      if (!a.live || !b.live) continue;
      const between = F.length > 2 ? ` between parts ${i + 1} and ${i + 2}` : ' between the parts';
      const cf = CF[i + 1];
      if (cf) {
        const c = cf.carried, r = cf.replayed;
        checks.push({ s: 'info', t: `Part ${i + 2} carries on part ${i + 1}'s half`, n: `Same sides: part ${i + 1}'s ${plural(c, 'round')} ${c === 1 ? 'counts' : 'count'}, and part ${i + 2}'s ${cf.n} ${cf.complete ? `${cf.n === 1 ? 'completes' : 'complete'} the half of ${cf.half}` : `${cf.n === 1 ? 'carries' : 'carry'} on the half of ${cf.half}`}.${r ? ` ${plural(r, 'round')} at its start ${r === 1 ? 'was' : 'were'} replayed.` : ''}` });
      } else if (sidesSwap(a, b)) checks.push({ s: halfEndAny(roundsBefore(F, i)) ? 'ok' : 'warn', t: `Teams swapped sides${between}` });
      else checks.push({ s: 'info', t: `Teams on the same sides${between}`, n: `Part ${i + 2} probably picks up partway through a half.` });
    }
    F.forEach((f, i) => {
      if (!i) return;
      const miss = f.missT + f.missCT;
      if (miss) {
        const who = f.missT && f.missCT ? `${f.teamOnT} won ${f.missT} and ${f.teamOnCT} ${f.missCT}` : `${f.missT ? f.teamOnT : f.teamOnCT} won ${miss === 1 ? 'it' : 'them'}`;
        checks.push({ s: 'warn', t: `${miss === 1 ? '1 round isn\'t' : miss + " rounds aren't"} in any file`, n: `${miss === 1 ? 'It was' : 'They were'} played between ${F.length > 2 ? `parts ${i} and ${i + 1}` : 'the two recordings'}. The scoreboard says ${who}, so ${miss === 1 ? 'it counts' : 'they count'} in the score; ${miss === 1 ? 'its' : 'their'} kills can't count in the stats.` });
      }
      if (f.partway) checks.push({ s: 'info', t: `Part ${i + 1} starts partway into a round`, n: `Its kills from where the recording starts are in the file and count.${f.leadWinner ? ` The scoreboard says ${f.leadWinner} won it.` : ''}` });
    });
    F.forEach((f, i) => { if (!f.live) checks.push({ s: 'info', t: `Part ${i + 1} has no rounds in it`, n: 'It adds nothing to the map.' }); });
  }
  // the wrong order: explained, with the order the files support one click away
  let wrong = '';
  if (problem && !JOIN.keep) {
    const s = suggestOrder(F);
    const better = s && (s.agree ? s.order : s.roundsOrder);
    // no second button for the same order when the recorded one is also the rounds' order (Sujan, 19 Nov 2026)
    const same = (a, b) => !!a && !!b && a.every((v, k) => v === b[k]);
    // Use the recorded order moves into this box as its primary (gold) button, beside Keep my order, and the warning above
    // keeps only its text (Sujan, 20 Nov 2026). When the recorded order doesn't add up either, the rounds' order stays the gold
    // button and the recorded one a plain button beside it
    const recOk = !!recIdx && !orderProblem(recIdx.map((i) => F[i]));
    if (recWarn) recWarn.btn = null;
    wrong = `<div class="jwrong"><h3>This order doesn't add up</h3><p>${esc(problem)}</p>
      <div class="jbtns"><button class="btn" type="button" id="jKeep">Keep my order</button>${recIdx ? `<button class="btn${recOk ? ' primary' : ''}" type="button" id="jRec">Use the recorded order</button>` : ''}${better && better.some((v, k) => v !== k) && !same(better, recIdx) ? `<button class="btn${recOk ? '' : ' primary'}" type="button" id="jSugg">Use the suggested order</button>` : ''}</div></div>`;
  }
  // picking another part: the folder's demos, the same map first, or a file from elsewhere
  let picker = '', noneHere = false;
  if (JOIN.picking) {
    const map = F[0] ? F[0].map : '';
    // the folder's demos, those with the map in their name first (the map in the file itself is checked once picked)
    const opts = (files && files.demos || []).filter((f) => !JOIN.list.some((x) => x.name === f.name));
    const onMap = (f) => !!map && f.name.toLowerCase().includes(map);
    const grp = (label, L) => L.length ? `<optgroup label="${esc(label)}">${L.map((f) => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('')}</optgroup>` : '';
    // no other demos in the folder: one line in place of an empty list (Sujan, 8 Nov 2026)
    noneHere = !opts.length;
    const from = !noneHere ? `<label for="jSel">Add a part from your folder</label><select id="jSel"><option value="">Pick a demo…</option>${grp(map ? `${map} in the name` : 'Demos', opts.filter(onMap))}${grp('Other demos', opts.filter((f) => !onMap(f)))}</select>`
      : '<span class="jnone">There are no other demos in your Half-Life folder.</span>';
    picker = `<div class="jpick">${from}
      <button class="btn sm" type="button" id="jFile">A file from elsewhere…</button><input type="file" id="jFileIn" accept=".dem" multiple hidden>${JOIN.note ? `<p class="jmsg" role="alert">${esc(JOIN.note)}</p>` : ''}</div>`;
  }
  const busy = !!JOIN.reading || !!JOIN.checking || F.length < JOIN.list.length;
  // the checks that pass and the notes fold behind the verdict, opening with the link at its right, "Show N checks" / "Hide
  // checks", styled like the load card's Details (Sujan, 20 Nov 2026; a ▸ after the verdict up to then, which nobody saw);
  // warnings always in full (Sujan, 19 Nov 2026; each part's own line stays as approved, 7 Nov 2026)
  const li = (c) => `<li><span class="sum-ic ${c.s}" aria-hidden="true">${ic[c.s]}</span><span>${esc(c.t)}${c.n ? `<small>${esc(c.n)}</small>` : ''}${c.btn ? `<div class="li-btn"><button class="btn sm${c.btn.primary ? ' primary' : ''}" type="button" id="${c.btn.id}">${esc(c.btn.label)}</button></div>` : ''}</span></li>`;
  const folded = checks.filter((c) => c.s !== 'warn'), warns = (dupWarn ? [dupWarn] : []).concat(recWarn ? [recWarn] : [], zeroWarns, checks.filter((c) => c.s === 'warn'));
  const vText = verdict ? `<span class="sum-ic ${verdict.s}" aria-hidden="true">${ic[verdict.s]}</span><span class="jvt">${esc(verdict.t)}</span>` : '';
  const vRow = !verdict ? '' : `<li class="jv${folded.length ? ' more' : ''}">${vText}${folded.length ? `<button class="lnk" type="button" id="jVerdict" aria-expanded="${JOIN.okOpen ? 'true' : 'false'}">${JOIN.okOpen ? 'Hide checks' : `Show ${plural(folded.length, 'check')}`}</button>` : ''}</li>`;
  const checkRows = vRow + (JOIN.okOpen ? folded.map(li).join('') : '') + warns.map(li).join('');
  el.innerHTML = `<div class="sum join" role="dialog" aria-labelledby="jTitle">
    <div class="sum-top"><div class="ti"><h2 id="jTitle">Count these demos as one map?</h2><p>Score, rounds and player stats will cover all parts. Playback runs straight on from one part to the next.</p></div>${x}</div>
    <ol class="jparts">${rows}</ol>
    ${checkRows ? `<ul class="sum-list jchecks">${checkRows}</ul>` : ''}
    ${wrong}${picker}
    <div class="sum-foot"><button class="btn" type="button" id="jAdd" ${busy || JOIN.picking ? 'disabled' : ''} ${JOIN.picking ? `title="${noneHere ? 'Pick a file from elsewhere above' : 'Pick a demo above, or a file from elsewhere'}"` : ''}>Add another part…</button><span class="sp"></span><button class="btn" type="button" id="jCancel">Cancel</button><button class="btn primary" type="button" id="jGo" ${busy || JOIN.list.length < 2 || (problem && !JOIN.keep) || dupWarn ? 'disabled' : ''}>Join parts</button></div>
  </div>`;
  el.hidden = false;
  $('jX').onclick = closeJoinCard; $('jCancel').onclick = closeJoinCard;
  if ($('jVerdict')) $('jVerdict').onclick = () => { JOIN.okOpen = !JOIN.okOpen; renderJoinCard(); };
  if ($('jRec')) $('jRec').onclick = useRecorded;
  if ($('jDrop')) $('jDrop').onclick = () => { JOIN.list.splice(dupAt[1], 1); JOIN.dup = null; JOIN.checking = true; renderJoinCard(); readJoinParts(); };
  el.onclick = (e) => { if (e.target === el) closeJoinCard(); };
  el.querySelectorAll('[data-mv]').forEach((b) => b.onclick = () => { const [i, d] = b.dataset.mv.split(',').map(Number); joinMove(i, d); });
  // greyed out while the picker row is open and empty: clicking it there only closed the row (Sujan, 23 Oct 2026)
  $('jAdd').onclick = () => { JOIN.picking = true; renderJoinCard(); };
  if ($('jKeep')) $('jKeep').onclick = () => { JOIN.keep = true; renderJoinCard(); };
  if ($('jSugg')) $('jSugg').onclick = useSuggested;
  if ($('jSel')) $('jSel').onchange = (e) => { const f = (files.demos || []).find((x) => x.name === e.target.value); if (f) addJoinParts([f]); };
  // up to 5 from elsewhere at once; more add nothing, and the line under the picker says how many were picked
  if ($('jFile')) { $('jFile').onclick = () => $('jFileIn').click(); $('jFileIn').onchange = (e) => { const list = [...e.target.files]; e.target.value = ''; if (!list.length) return; JOIN.note = tooMany(list.length); if (JOIN.note) renderJoinCard(); else addJoinParts(list); }; }
  $('jGo').onclick = () => {
    rememberJoin(JOIN.list, JOIN.keep && !!problem, problem);
    const parsed = JOIN.list.map((f) => JOIN.P.get(f.name));
    closeJoinCard();
    JOIN.P.clear(); JOIN.F.clear(); JOIN.carry = null; // the read parts go to the joined map; nothing else keeps them
    openJoinedUI(JOIN.list.slice(), parsed);
  };
}
