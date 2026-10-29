// ---------------- finding the parts of a map, and the Join card ----------------
// Approved design: docs/split-map-mock.png. Background and decisions: IDEAS.md, "Join a map split over several
// demo files". Words: "map", never "match" (a match is often several maps, each its own demo or demos).
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
// The recording time in a file name, when it has one: "1104240025" is 24 Apr 2011 at 00:25 (yymmddhhmm),
// "1110231216--auto_..." the same form, "2006-07-02_15h00_..." another. Names like FX-vs-sk-iem5-inf.dem have none.
function fileTime(name) {
  let m = /(\d{4})-(\d\d)-(\d\d)_(\d\d)h(\d\d)/.exec(name);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  m = /(?:^|\D)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(?=\D|$)/.exec(name);
  if (m && +m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= 31 && +m[4] < 24 && +m[5] < 60) return Date.UTC(2000 + +m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  return null;
}
const hhmm = (d) => String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0');
const dayOf = (d) => `${d.getUTCDate()} ${MON[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
// "24 Apr 2011 at 00:25 and at 01:12"
function fileTimesText(ts) {
  const ds = ts.map((t) => new Date(t));
  const bits = ds.map((d, i) => (i && dayOf(d) === dayOf(ds[i - 1]) ? '' : dayOf(d) + ' ') + 'at ' + hhmm(d));
  return bits.length < 3 ? bits.join(' and ') : bits.slice(0, -1).join(', ') + ' and ' + bits[bits.length - 1];
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
    };
  } finally { D = keep[0]; M = keep[1]; }
}
// Why the rounds don't allow this order (null when they do): the first part must start from 0:0, and only the
// last part can have a winner.
function orderProblem(F) {
  const head = (f) => f.partway ? 'starts partway into a round' : `starts with ${plural(f.sb[0] + f.sb[1], 'round')} already on the scoreboard`;
  if (F[0].startsLate) {
    const fresh = F.findIndex((f, i) => i && !f.startsLate);
    return `Part 1 ${head(F[0])}${fresh > 0 ? `, and part ${fresh + 1} starts from 0:0 with the first half` : ''}.`;
  }
  for (let i = 0; i < F.length - 1; i++) if (F[i].won) return `Part ${i + 1} ends with ${F[i].wonBy} winning the map, so no part can come after it.`;
  return null;
}
const perms = (a) => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
// The order to suggest, in this order of trust: the recording times in the file names when every part has
// one, then the rounds when exactly one order makes a map, else none.
function suggestOrder(F) {
  const idx = F.map((f, i) => i);
  const valid = perms(idx).filter((p) => !orderProblem(p.map((i) => F[i])));
  if (F.every((f) => f.time != null)) {
    const o = idx.slice().sort((a, b) => F[a].time - F[b].time);
    return { order: o, by: 'times', agree: !orderProblem(o.map((i) => F[i])), roundsOrder: valid.length === 1 ? valid[0] : null };
  }
  return valid.length === 1 ? { order: valid[0], by: 'rounds', agree: true, roundsOrder: valid[0] } : null;
}

// Joined sets are remembered per file, so opening any part opens the joined map; Split them forgets it.
const joinedSetOf = (name) => { const v = ls.get('join:' + name); return v && Array.isArray(v.set) && v.set.length > 1 ? v : null; };
function rememberJoin(names, keep, why) { for (const n of names) ls.set('join:' + n, { set: names, keep: !!keep, why: why || null }); }
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
const JOIN = { list: [], P: new Map(), F: new Map(), keep: false, moved: false, sugg: null, err: null, picking: false, reading: null };
function joinEl() {
  let el = $('joinCard');
  if (!el) { el = document.createElement('div'); el.className = 'overlay sumwrap'; el.id = 'joinCard'; el.hidden = true; $('sumCard').after(el); }
  return el;
}
function closeJoinCard() { joinEl().hidden = true; JOIN.picking = false; JOIN.err = null; }
async function openJoinCard(list) {
  closeSummary();
  Object.assign(JOIN, { list: list.slice(), keep: false, moved: false, sugg: null, err: null, picking: false });
  await readJoinParts();
}
// Add a demo to the parts: refused when it's another map or has different players
async function addJoinPart(f) {
  JOIN.picking = false;
  if (JOIN.list.some((x) => x.name === f.name)) { renderJoinCard(); return; }
  JOIN.list.push(f);
  await readJoinParts(f);
}
async function readJoinParts(added) {
  for (const f of JOIN.list) {
    if (JOIN.F.has(f.name)) continue;
    JOIN.reading = f.name; renderJoinCard();
    try {
      const P = await parseInWorker(f, (p) => { const b = $('jProg'); if (b) b.style.width = (p * 100).toFixed(0) + '%'; });
      JOIN.P.set(f.name, P); JOIN.F.set(f.name, partFacts(P));
    } catch (e) {
      JOIN.list = JOIN.list.filter((x) => x !== f);
      JOIN.err = { kind: 'read', name: f.name, why: e.message || String(e) };
    }
  }
  JOIN.reading = null;
  // checks that refuse a part outright: another map, or fewer than 8 of the same players
  const F = JOIN.list.map((f) => JOIN.F.get(f.name));
  const bad = (f) => {
    const base = F[0];
    if (f.map !== base.map) return { kind: 'map', name: f.fileName, map: f.map, base: base.map };
    let n = 0; for (const p of f.players) if (base.players.has(p)) n++;
    const of = Math.max(base.players.size, f.players.size);
    if (n < 8) return { kind: 'players', name: f.fileName, n, of, byName: base.byName || f.byName };
    return null;
  };
  for (let i = 1; i < F.length; i++) {
    const e = bad(F[i]);
    if (e) { JOIN.err = e; JOIN.list.splice(i, 1); F.splice(i, 1); i--; }
  }
  if (!JOIN.moved) {
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
function useSuggested() {
  const F = JOIN.list.map((f) => JOIN.F.get(f.name));
  const s = suggestOrder(F);
  const o = s && (s.agree ? s.order : s.roundsOrder);
  if (o) JOIN.list = o.map((i) => JOIN.list[i]);
  JOIN.keep = false; JOIN.moved = false; renderJoinCard();
}
// one part's line under its file name
function partLine(f, i) {
  if (!f.live) return 'no rounds in it';
  const [a, b] = f.score, [tA, tB] = f.tnames;
  if (i === 0 && !f.startsLate) return `${plural(f.live, 'round')}, ends at ${tA} ${a} : ${b} ${tB}, ${f.won ? `${f.wonBy} won the map` : 'no winner'}`;
  const how = f.partway ? `Starts partway into a round, then ${plural(f.live - 1, 'more round')}` : f.startsLate ? `Starts with ${plural(f.sb[0] + f.sb[1], 'round')} already played, then ${plural(f.live, 'round')}` : `Starts from 0:0, ${plural(f.live, 'round')}`;
  return how + (f.won ? `, ${f.wonBy} won the map` : ', no winner');
}
function renderJoinCard() {
  const el = joinEl();
  const F = JOIN.list.map((f) => JOIN.F.get(f.name)).filter(Boolean);
  const ic = { ok: '✓', warn: '!', info: 'i', fail: '✕' };
  const x = '<button class="sum-x" type="button" id="jX" title="Close (Esc)" aria-label="Close">×</button>';
  // a part that was refused: its own card first
  if (JOIN.err) {
    const e = JOIN.err;
    const txt = e.kind === 'map' ? `${esc(e.name)} is on ${esc(e.map)}. The parts so far are on ${esc(e.base)}. Only the parts of one map can be joined; each map of a match stays its own demo.`
      : e.kind === 'players' ? `${esc(e.name)} has only ${e.n} of the same ${e.of} players${e.byName ? ' (matched by name; these demos have no Steam IDs)' : ''}. It's probably another match on the same map, which stays its own demo.`
      : `${esc(e.name)} couldn't be read: ${esc(e.why)}`;
    const title = e.kind === 'map' ? 'This demo is from another map' : e.kind === 'players' ? 'These demos have different players' : "This demo can't be read";
    el.innerHTML = `<div class="sum" role="dialog" aria-labelledby="jTitle"><div class="sum-top fail"><div class="ti"><h2 id="jTitle">${title}</h2><p>${txt}</p></div>${x}</div>
      <div class="sum-foot"><span class="sp"></span><button class="btn" type="button" id="jPick">Pick another demo…</button><button class="btn" type="button" id="jOk">OK</button></div></div>`;
    el.hidden = false;
    $('jX').onclick = closeJoinCard;
    $('jOk').onclick = () => { JOIN.err = null; if (JOIN.list.length > 1) renderJoinCard(); else closeJoinCard(); };
    $('jPick').onclick = () => { JOIN.err = null; JOIN.picking = true; renderJoinCard(); };
    return;
  }
  const problem = F.length === JOIN.list.length && F.length > 1 ? orderProblem(F) : null;
  const rows = JOIN.list.map((f, i) => {
    const fa = JOIN.F.get(f.name);
    const meta = fa ? esc(partLine(fa, i)) : JOIN.reading === f.name ? `Reading… <span class="jbar"><i id="jProg"></i></span>` : 'Waiting to be read';
    return `<li><span class="jn">Part ${i + 1}</span><span class="jf"><span class="jname">${fileNameHtml(f.name)}</span><small>${meta}</small></span>
      <span class="ja"><button class="btn sq" type="button" data-mv="${i},-1" ${i ? '' : 'disabled'} title="Move up" aria-label="Move part ${i + 1} up">↑</button><button class="btn sq" type="button" data-mv="${i},1" ${i < JOIN.list.length - 1 ? '' : 'disabled'} title="Move down" aria-label="Move part ${i + 1} down">↓</button></span></li>`;
  }).join('');
  // how the order was found
  let order = '';
  if (F.length === JOIN.list.length && F.length > 1) {
    const s = JOIN.sugg;
    if (JOIN.moved) order = problem ? 'Your order.' : 'Your order. The rounds agree.';
    else if (s && s.by === 'times') order = `from the recording times in the file names, ${fileTimesText(F.map((f) => f.time))}.${s.agree ? ' The rounds agree.' : ''}`;
    else if (s) order = 'from the rounds: the first part starts from 0:0 and only the last one has a winner, and no other order does that.';
    else order = "the files don't say. Put the parts in order with the arrows.";
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
      let same = 0; for (const p of a.lastT) if (b.firstT.has(p)) same++;
      const between = F.length > 2 ? ` between parts ${i + 1} and ${i + 2}` : ' between the parts';
      if (same <= Math.min(a.lastT.size, b.firstT.size) / 2) checks.push({ s: 'ok', t: `Teams swapped sides${between}` });
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
    const timesNote = s && s.by === 'times' && JOIN.moved && s.agree && s.order.some((v, k) => v !== k) ? ` The file names' recording times put them ${F.length === 2 ? 'the other way round' : 'in another order'}.` : '';
    wrong = `<div class="jwrong"><h3>This order doesn't add up</h3><p>${esc(problem)}${timesNote}</p>
      <div class="jbtns"><button class="btn" type="button" id="jKeep">Keep my order</button>${better && better.some((v, k) => v !== k) ? '<button class="btn primary" type="button" id="jSugg">Use the suggested order</button>' : ''}</div></div>`;
  }
  // picking another part: the folder's demos, the same map first, or a file from elsewhere
  let picker = '';
  if (JOIN.picking) {
    const map = F[0] ? F[0].map : '';
    // the folder's demos, those with the map in their name first (the map in the file itself is checked once picked)
    const opts = (files && files.demos || []).filter((f) => !JOIN.list.some((x) => x.name === f.name));
    const onMap = (f) => !!map && f.name.toLowerCase().includes(map);
    const grp = (label, L) => L.length ? `<optgroup label="${esc(label)}">${L.map((f) => `<option value="${esc(f.name)}">${esc(f.name)}</option>`).join('')}</optgroup>` : '';
    picker = `<div class="jpick"><label for="jSel">Add a part from your folder</label><select id="jSel"><option value="">Pick a demo…</option>${grp(map ? `${map} in the name` : 'Demos', opts.filter(onMap))}${grp('Other demos', opts.filter((f) => !onMap(f)))}</select>
      <button class="btn sm" type="button" id="jFile">A file from elsewhere…</button><input type="file" id="jFileIn" accept=".dem" hidden></div>`;
  }
  const busy = !!JOIN.reading || F.length < JOIN.list.length;
  el.innerHTML = `<div class="sum join" role="dialog" aria-labelledby="jTitle">
    <div class="sum-top"><div class="ti"><h2 id="jTitle">Count these demos as one map?</h2><p>Score, rounds and player stats will cover all parts. Playback runs straight on from one part to the next.</p></div>${x}</div>
    <ol class="jparts">${rows}</ol>
    ${order ? `<div class="jorder"><b>Order:</b> ${esc(order)}</div>` : ''}
    ${checks.length ? `<ul class="sum-list">${checks.map((c) => `<li><span class="sum-ic ${c.s}" aria-hidden="true">${ic[c.s]}</span><span>${esc(c.t)}${c.n ? `<small>${esc(c.n)}</small>` : ''}</span></li>`).join('')}</ul>` : ''}
    ${wrong}${picker}
    <div class="sum-foot"><span class="sp"></span><button class="btn" type="button" id="jAdd" ${busy || JOIN.picking ? 'disabled' : ''} ${JOIN.picking ? 'title="Pick a demo above, or a file from elsewhere"' : ''}>Add another part…</button><button class="btn" type="button" id="jCancel">Cancel</button><button class="btn primary" type="button" id="jGo" ${busy || JOIN.list.length < 2 || (problem && !JOIN.keep) ? 'disabled' : ''}>Join them</button></div>
  </div>`;
  el.hidden = false;
  $('jX').onclick = closeJoinCard; $('jCancel').onclick = closeJoinCard;
  el.onclick = (e) => { if (e.target === el) closeJoinCard(); };
  el.querySelectorAll('[data-mv]').forEach((b) => b.onclick = () => { const [i, d] = b.dataset.mv.split(',').map(Number); joinMove(i, d); });
  // greyed out while the picker row is open and empty: clicking it there only closed the row (Sujan, 23 Oct 2026)
  $('jAdd').onclick = () => { JOIN.picking = true; renderJoinCard(); };
  if ($('jKeep')) $('jKeep').onclick = () => { JOIN.keep = true; renderJoinCard(); };
  if ($('jSugg')) $('jSugg').onclick = useSuggested;
  if ($('jSel')) $('jSel').onchange = (e) => { const f = (files.demos || []).find((x) => x.name === e.target.value); if (f) addJoinPart(f); };
  if ($('jFile')) { $('jFile').onclick = () => $('jFileIn').click(); $('jFileIn').onchange = (e) => { const f = e.target.files[0]; if (f) addJoinPart(f); }; }
  $('jGo').onclick = () => {
    const names = JOIN.list.map((f) => f.name);
    rememberJoin(names, JOIN.keep && !!problem, problem);
    const parsed = JOIN.list.map((f) => JOIN.P.get(f.name));
    closeJoinCard();
    JOIN.P.clear(); JOIN.F.clear(); // the read parts go to the joined map; nothing else keeps them
    openJoinedUI(JOIN.list.slice(), parsed);
  };
}
