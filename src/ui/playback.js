// ---------------- playback ----------------
// the round pill's clock; with Vanilla (0.26.16) the C4 countdown goes and the pill says "C4" after the plant
function pillClock(r) {
  const c = clockAt(T, true);
  if (VAN.on && c && c.phase === 'bomb') return 'C4';
  return (c && c.text) || fmt(T - r.start);
}
function seek(t) { T = Math.max(D.start, Math.min(D.end, t)); updateHud(true); }
function setPlayIcon() { $('playIcon').innerHTML = playing ? '<path d="M3 2h4v12H3zM9 2h4v12H9z"/>' : '<path d="M4 2l10 6-10 6z"/>'; }
function togglePlay() { if (!D) return; closeSummary(); if (T >= D.end - 0.05) T = D.start; playing = !playing; setPlayIcon(); }
$('bPlay').onclick = togglePlay;
$('bBack').onclick = () => D && seek(T - 5);
$('bFwd').onclick = () => D && seek(T + 5);
// Z and X (↑ and ↓ up to 0.26.19; Sujan, 8 Nov 2026): the previous or next round in the list, from anywhere in a round
// (Sujan, 2 Nov 2026). The previous round used to go to the start of the round playing when more than 3 s into it, so
// while playing at 2x or faster a second press landed past 3 s again and went back to the same start.
// k: the last listed round started by now. Inside it, Z goes one before it; between listed rounds (a warmup, the
// restarts between halves, after the match), Z goes to it and X to the one after it.
function jumpRound(dir) {
  if (!D) return;
  const rs = visibleRounds();
  let k = -1; for (let j = 0; j < rs.length && rs[j].start <= T + 0.001; j++) k = j;
  const inside = k >= 0 && (rs[k].end == null || T <= rs[k].end + 0.001);
  const i = dir > 0 ? k + 1 : inside ? k - 1 : k;
  if (i >= 0 && i < rs.length) seek(rs[i].start);
}
$('bPrevR').onclick = () => jumpRound(-1);
$('bNextR').onclick = () => jumpRound(1);
$('bScope').onclick = () => { scope = scope === 'match' ? 'round' : 'match'; $('bScope').textContent = 'Timeline: ' + scope; savePrefs(); drawTimeline(); };
const spEl = $('speeds');
for (const s of SPEEDS) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'btn' + (s === 1 ? ' on' : ''); b.textContent = s + '×';
  b.onclick = () => setSpeed(s); spEl.appendChild(b);
}
function setSpeed(s) { speed = s; [...spEl.children].forEach((b, i) => b.classList.toggle('on', SPEEDS[i] === s)); }

// the shortcuts list works everywhere, including the start screen
document.addEventListener('keydown', (e) => {
  if (typingIn(e.target)) return;
  if (e.key === '?' && (!D || !$('load').hidden)) toggleKeys();
  if (e.key === 'Escape' && !$('keys').hidden) toggleKeys(false);
});
document.addEventListener('keydown', (e) => {
  if (!D || !$('load').hidden || typingIn(e.target)) return;
  const k = e.key;
  let used = true;
  if (k === ' ') { e.preventDefault(); togglePlay(); }
  else if (k === 'ArrowLeft') { e.preventDefault(); seek(T - (e.shiftKey ? 1 : 5)); }
  else if (k === 'ArrowRight') { e.preventDefault(); seek(T + (e.shiftKey ? 1 : 5)); }
  // ↑ and ↓: the next or previous player, as a click and a right-click on the view; the default is stopped, so a focused
  // side panel, slider or list doesn't also scroll or change (Sujan, 8 Nov 2026: the keys players had are Z and X)
  else if (k === 'ArrowUp') { e.preventDefault(); nextPlayer(1); if (viewMode !== '2d' && cam3.mode === 'free') setCam('eyes'); }
  else if (k === 'ArrowDown') { e.preventDefault(); nextPlayer(-1); if (viewMode !== '2d' && cam3.mode === 'free') setCam('eyes'); }
  // Z and X: the previous or next round. A held key repeats: one round per press, so holding it a moment too long
  // doesn't skip a round (Sujan, 2 Nov 2026)
  else if (k === 'z' || k === 'Z') { if (!e.repeat) jumpRound(-1); }
  else if (k === 'x' || k === 'X') { if (!e.repeat) jumpRound(1); }
  else if (k === ',') { playing = false; setPlayIcon(); seek(T - 1 / 30); }
  else if (k === '.') { playing = false; setPlayIcon(); seek(T + 1 / 30); }
  else if (k === '[') { const i = SPEEDS.indexOf(speed); if (i > 0) setSpeed(SPEEDS[i - 1]); }
  else if (k === ']') { const i = SPEEDS.indexOf(speed); if (i < SPEEDS.length - 1) setSpeed(SPEEDS[i + 1]); }
  else if (k === 'n' || k === 'N') toggleOpt('names', 'tgNames');
  else if (k === 'h' || k === 'H') toggleOpt('xray', 'tgXray');
  else if (k === 'm' || k === 'M') setSound(!SND.on);
  else if (k === 'f' || k === 'F') toggleFull();
  else if (k === 't' || k === 'T') setTheatre(!TH.on);
  else if (/^[0-9]$/.test(k) && !POV.on) {
    const pid = playerOrder()[(+k + 9) % 10]; const e = pid && M.slotOf(pid, T);
    if (e && isDeadNow(e)) toast(`${M.pl[pid].name} is dead until the next round.`, 2500);
    else if (e) { selected = e; renderPane(); if (viewMode !== '2d' && cam3.mode === 'free') setCam('eyes'); }
  }
  else if (k === 'Tab') { e.preventDefault(); if (!e.repeat) showScoreboard(true); }
  else if (k === '?') toggleKeys();
  else if (k === 'Escape') { $('keys').hidden = true; showScoreboard(false); closeSummary(); if ($('joinCard') && !$('joinCard').hidden) closeJoinCard(); }
  else used = false;
  // a focused list or checkbox doesn't also take the key (a letter would pick an entry in the Quality list)
  if (used && formControl(e.target)) e.preventDefault();
});
document.addEventListener('keyup', (e) => { if (e.key === 'Tab') showScoreboard(false); });
window.addEventListener('blur', () => showScoreboard(false));
function toggleKeys(v) { $('keys').hidden = v != null ? !v : !$('keys').hidden; }
$('bKeys').onclick = () => toggleKeys();
$('bKeysClose').onclick = () => toggleKeys(false);
$('bKeysX').onclick = () => toggleKeys(false);
$('keys').onclick = (e) => { if (e.target === $('keys')) toggleKeys(false); };
// players in scoreboard order: team 1 then team 2, by slot
// players (people, not slots) in scoreboard order: team 1 then team 2
function playerOrder() { return M ? [...M.teams[0], ...M.teams[1]] : []; }
// dead right now (killed this round): can't be followed until they respawn. Read from the recorded
// state, not from playerState: a few seconds after dying the demo stops sending the body, and then
// playerState has no position to give, which must not count as alive.
function isDeadNow(e) { const a = D.slots[e]; if (!a) return false; return a[M.idxAt(T) * D.stride + 5] < 0; }

let sbTimer = null;
function showScoreboard(v) {
  const el = $('sb');
  clearInterval(sbTimer);
  if (!v || !D) { el.hidden = true; return; }
  const render = () => {
    const r = roundAt(T);
    const st = statsFor('all', T);
    const sc = r ? (T >= (r.endT || r.end) && r.scoreAfter ? r.scoreAfter : r.scoreBefore) : [0, 0];
    // Everyone listed by the side he's on at this moment, as the game's scoreboard does, for every demo type (Sujan, 10
    // Nov 2026): a player who changed team, or went to spectate, shows where he is now; up to 0.26.27 each team's people
    // were listed under the side the team had in the round. Each side is headed by the team with most of its people on it
    // now, at every moment, the round's team only on a tie, and the score goes with the name (Sujan, 11 Nov 2026: just after
    // R15 of SK vs Na`Vi, Train, DreamHack Winter 2011, Na`Vi already on CT read "SK Gaming · CT" until the next round).
    // The side and alive or dead come from the snapshot (the server's TeamInfo and death messages, which every player
    // gets), not from playerState, which has nothing for a player a POV demo's recorder didn't receive at that moment:
    // up to 0.26.27 those read "dead" there; their gun isn't known, so its cell stays empty.
    const si = M.idxAt(T) * D.stride;
    // Each slot once, with the person in it now: a slot with no connection info at some point gets a stand-in person
    // ("s12") whose slot is the same at every moment, who doubled whoever sat there (0.26.27 listed him under the
    // spectators all match, in mousesports vs AGAiN, Inferno, 24 Oct 2011, among others); he shows only on a side.
    const now = Object.keys(M.pl).map((pid) => { const e = M.slotOf(pid, T); const v = e != null && D.slots[e] ? D.slots[e][si + 5] || 0 : 0; return { pid, e, p: e != null ? playerState(e, T) : null, alive: v > 0, side: Math.abs(v) }; })
      .filter((x) => x.e != null);
    // and a stand-in whose slot never has a position in the whole demo is no player: slot 12 of mousesports vs mTw, Inferno,
    // IEM4, part 2 has a team (CT) from the server and never a name, a position, a kill or a death ("?", 0.26.28)
    if (!M.ghost) { M.ghost = new Set(); for (const pid in M.pl) if (pid[0] === 's') { const a = D.slots[+pid.slice(1)], S = D.stride; let any = false; if (a) for (let i = 0; i < a.length; i += S) if (!Number.isNaN(a[i])) { any = true; break; } if (!any) M.ghost.add(pid); } }
    { const held = new Set(now.filter((x) => x.pid[0] !== 's').map((x) => x.e)); for (let i = now.length - 1; i >= 0; i--) if (now[i].pid[0] === 's' && (held.has(now[i].e) || !now[i].side || M.ghost.has(now[i].pid))) now.splice(i, 1); }
    // tT: the team on T. Each team's people on T less its people on CT; the team further toward T has T
    let tT; { const v = [0, 0]; for (const x of now) if (x.side && M.teamOf[x.pid] != null) v[M.teamOf[x.pid]] += x.side === 1 ? 1 : -1; tT = v[0] !== v[1] ? (v[0] > v[1] ? 0 : 1) : r && r.tTeam != null ? r.tTeam : 0; }
    // A team's player the demo gives no side at this moment (no TeamInfo yet, a reconnect, a moment at spectate) goes
    // under the side of the team the viewer computed for him, and only people never on a team are Spectators (Sujan, 10
    // Nov 2026: Virtus.pro vs ALTERNATE aTTaX, Inferno, EM II 2008, has no TeamInfo before 14:01). Dead or alive comes from
    // the kill feed then: dead from his death in this round to its end.
    { const from = r ? r.start - 1e-4 : -Infinity;
      for (const x of now) if (!x.side && M.teamOf[x.pid] != null) { x.side = M.teamOf[x.pid] === tT ? 1 : 2; x.alive = !D.kills.some((k) => k.victim === x.e && k.t >= from && k.t <= T); } }
    // HP: none of it in a POV demo whose server sent no teammate's health (HealthInfo) at all, so no column of blanks
    // there (Sujan, 10 Nov 2026; the GP Tourney's server registers the message and never sends it)
    const showHp = D.povOn ? !!(D.hpInfo && D.hpInfo.length) : true;
    // and in POV mode only his side's: no opponents' HP (Sujan, 3 Oct 2026), even for one who was his teammate earlier and
    // still has a reading from then (Match 1 and 2, public server, 27 Mar 2025)
    const rec = D.povOn && D.serverInfo ? D.serverInfo.playerIndex + 1 : null, recSide = rec != null ? (now.find((x) => x.e === rec) || {}).side : null;
    const cols = (a, b, c, d, e, f) => `<span>${a}</span><span${b.startsWith('<') ? ' class="nm"' : ''}>${b}</span>${showHp ? `<span>${c}</span>` : ''}<span>${d}</span><span>${e}</span><span>${f}</span>`;
    let h = `<div class="sbcard${showHp ? '' : ' nohp'}">`;
    for (let ti = 0; ti < 2; ti++) {
      const side = tT === ti ? 1 : 2;
      h += `<div class="sbteam"><h3><span class="${side === 1 ? 'kt' : 'kct'}">${esc(M.tnames[ti])}${side === 1 ? ' · T' : ' · CT'}</span><span>${sc[ti]}</span></h3>`;
      h += `<div class="sbrow head">${cols('#', 'Player', 'HP', 'K', 'D', 'Weapon')}</div>`;
      const rows = now.filter((x) => x.side === side).map((x) => Object.assign(x, { s: st[x.pid] || { k: 0, d: 0 } })).sort((a, b) => b.s.k - a.s.k || a.s.d - b.s.d || (a.pid < b.pid ? -1 : 1));
      for (const x of rows) {
        const alive = x.alive;
        // what the game shows on the player's back: the C4 on a T, the defusal kit on a CT (0.17.0); only for a player in
        // the snapshot now, since for one a POV demo's recorder doesn't receive the value is the last one seen (0.26.28)
        const pk = alive && x.p && packAt(x.e, T) ? (x.side === 1 ? '<span class="sbpack c4" title="Carrying the bomb">C4</span>' : '<span class="sbpack kit" title="Has a defusal kit">Kit</span>') : '';
        h += `<div class="sbrow${alive ? '' : ' dead'}">${cols((playerOrder().indexOf(x.pid) + 1) % 10, `<span class="nmt">${esc(M.pl[x.pid].name)}</span>${pk}`, alive ? (rec != null && x.side !== recSide ? '' : hpAt(x.e, T) ?? '') : 0, x.s.k, x.s.d, alive ? (x.p ? esc(weaponShort(x.p.weapon)) : '') : 'dead')}</div>`;
      }
      h += '</div>';
    }
    // spectators on the server right now (admins, casters, HLTV relays), plus how many were watching the broadcast
    // and everyone else on the server now: people on neither side who were never on a team
    const specNow = now.filter((x) => !x.side).sort((a, b) => (M.teamOf[a.pid] != null) - (M.teamOf[b.pid] != null) || (a.pid < b.pid ? -1 : 1)).map((x) => esc(M.pl[x.pid].name) + (M.pl[x.pid].hltv ? ' <span class="sbtag">HLTV</span>' : ''));
    const v = viewersAt(T);
    h += `<div class="sbspecs"><span class="sbl">Spectators</span>${specNow.length ? specNow.join('<span class="sbsep">·</span>') : '<span class="sbl">none on the server</span>'}${v != null ? `<span class="sbv">${v.toLocaleString('en-US')} watching on HLTV</span>` : ''}</div>`;
    el.innerHTML = h + '</div>';
  };
  render(); el.hidden = false;
  sbTimer = setInterval(render, 250);
}

// ---------------- HUD ----------------
// the kill feed: every frame (frame, loop.js), not with the rest of the HUD every 0.1 s, so a kill shows in it in the
// same frame as the killing bullet's ✕ on the damage numbers (Sujan, 1 Nov 2026); it's rebuilt only when it changes.
// Only the round playing now: a new round wipes the feed, as in the game (Sujan, 8 Nov 2026, checked in the game; Jimmy's
// kill on kubenB at R4 1:15 stayed into R5's freeze time, SK vs AGAiN, Train, Arbalet Cup Europe 2009). An HLTV demo's
// round starts at the server's round restart, which is also where freeze time starts.
function updateFeed() {
  const r = roundAt(T), from = r ? r.start - 1e-4 : -Infinity;
  const feed = D.kills.filter((k) => k.t <= T && k.t > T - 6 && k.t >= from).slice(-5);
  const key = feed.map((k) => k.t).join();
  if (key !== lastFeedKey) {
    lastFeedKey = key;
    $('feed').innerHTML = feed.map((k) => {
      const ks = k.kteam === 'TERRORIST' ? 1 : 2, vs = k.vteam === 'TERRORIST' ? 1 : 2;
      // the weapon's kill feed icon and the headshot icon from the game's own sprites, as in the game's kill
      // feed (Sujan, 14 Oct 2026); the words when those files aren't in the folder
      const gun = KICONS[k.weapon] ? `<span class="w">${kicon(k.weapon)}</span>` : `<span class="w">${esc(k.weapon)}</span>`;
      const hs = k.hs ? (KICONS.headshot ? `<span class="hs">${kicon('headshot')}</span>` : '<span class="hs">HS</span>') : '';
      if (k.killer === k.victim || !k.kp) return `<div>${nameHtml(k.vp, vs, true)}${gun}</div>`;
      return `<div>${nameHtml(k.kp, ks, true)}${gun}${hs}${nameHtml(k.vp, vs, true)}</div>`;
    }).join('');
  }
}
let lastRound = null, lastFeedKey = '', lastPaneT = 0, lastAliveKey = '';
function updateHud(force) {
  const r = roundAt(T);
  $('time').innerHTML = `<b>${fmt(T - D.start)}</b> / ${fmt(D.end - D.start)}`;
  // score shown is the score at the start of the current round
  const sc = r ? (T >= (r.endT || r.end) && r.scoreAfter ? r.scoreAfter : r.scoreBefore) : [0, 0];
  $('scA').textContent = sc[0]; $('scB').textContent = sc[1];
  const vw = viewersAt(T); $('viewers').textContent = vw != null ? `${vw.toLocaleString('en-US')} watching` : '';
  const side = (i) => r && r.tTeam != null ? (r.tTeam === i ? 'side-t' : 'side-ct') : '';
  $('tnA').className = 'tn ' + side(0); $('tnB').className = 'tn ' + side(1);
  const paused = (() => { let on = false; for (const p of D.pauses || []) { if (p.t > T) break; on = p.on; } return on; })();
  // Theatre mode hides the header, so the round pill also carries the score (hidden otherwise)
  const scSide = (i) => side(i) === 'side-t' ? 'kt' : side(i) === 'side-ct' ? 'kct' : '';
  const thsc = `<span class="thsc"><span class="${scSide(0)}">${esc(M.tnames[0])}</span> <b>${sc[0]} : ${sc[1]}</b> <span class="${scSide(1)}">${esc(M.tnames[1])}</span> · </span>`;
  $('rclock').innerHTML = thsc + (r ? `${r.live ? 'Round <b>' + r.ln + (r.ot ? ' (OT)' : '') + '</b>' : '<b>Not counted</b>'} · <b>${pillClock(r)}</b>`: '') + (paused ? ' · <b>match paused</b>' : '');
  updateFeed();
  // the players list greys out whoever is dead right now, so redraw it when someone dies or respawns
  let aliveKey = '';
  if (tab === 'players') aliveKey = Object.keys(D.slots).filter((e) => isDeadNow(+e)).join();
  if ((tab === 'kills' || tab === 'wb') && Math.abs(T - lastPaneT) > 0.25) { lastPaneT = T; paneMarks(); }
  if (r !== lastRound || force || (tab === 'players' && aliveKey !== lastAliveKey)) {
    const changed = r !== lastRound;
    lastRound = r; lastPaneT = T; lastAliveKey = aliveKey; renderPane();
    if (changed && scope === 'round') drawTimeline();
    if (changed && heat && $('hmScope').value === 'round') heat = null;
    if (changed || force) { const cur = $('pane').querySelector('.row.cur'); if (cur && tab === 'rounds') cur.scrollIntoView({ block: 'nearest' }); }
    // a new round on the Kills tab: its heading at the top, not wherever the last round's list was scrolled to
    if (changed && tab === 'kills') $('pane').scrollTop = 0;
  }
}
