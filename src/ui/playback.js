// ---------------- playback ----------------
function seek(t) { T = Math.max(D.start, Math.min(D.end, t)); updateHud(true); }
function setPlayIcon() { $('playIcon').innerHTML = playing ? '<path d="M3 2h4v12H3zM9 2h4v12H9z"/>' : '<path d="M4 2l10 6-10 6z"/>'; }
function togglePlay() { if (!D) return; closeSummary(); if (T >= D.end - 0.05) T = D.start; playing = !playing; setPlayIcon(); }
$('bPlay').onclick = togglePlay;
$('bBack').onclick = () => D && seek(T - 5);
$('bFwd').onclick = () => D && seek(T + 5);
function jumpRound(dir) {
  if (!D) return;
  const rs = visibleRounds();
  const cr = roundAt(T);
  let i = rs.indexOf(cr);
  if (dir < 0) { if (cr && T - cr.start > 3 && i >= 0) return seek(cr.start); i = i < 0 ? rs.findIndex((r) => r.start > T) - 1 : i - 1; }
  else i = i < 0 ? rs.findIndex((r) => r.start > T) : i + 1;
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
  if (e.target.tagName === 'INPUT' || e.target.isContentEditable) return;
  if (e.key === '?' && (!D || !$('load').hidden)) toggleKeys();
  if (e.key === 'Escape' && !$('keys').hidden) toggleKeys(false);
});
document.addEventListener('keydown', (e) => {
  if (!D || !$('load').hidden || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.isContentEditable) return;
  const k = e.key;
  if (k === ' ') { e.preventDefault(); togglePlay(); }
  else if (k === 'ArrowLeft') { e.preventDefault(); seek(T - (e.shiftKey ? 1 : 5)); }
  else if (k === 'ArrowRight') { e.preventDefault(); seek(T + (e.shiftKey ? 1 : 5)); }
  else if (k === 'ArrowUp') { e.preventDefault(); jumpRound(-1); }
  else if (k === 'ArrowDown') { e.preventDefault(); jumpRound(1); }
  else if (k === ',') { playing = false; setPlayIcon(); seek(T - 1 / 30); }
  else if (k === '.') { playing = false; setPlayIcon(); seek(T + 1 / 30); }
  else if (k === '[') { const i = SPEEDS.indexOf(speed); if (i > 0) setSpeed(SPEEDS[i - 1]); }
  else if (k === ']') { const i = SPEEDS.indexOf(speed); if (i < SPEEDS.length - 1) setSpeed(SPEEDS[i + 1]); }
  else if (k === 'n' || k === 'N') toggleOpt('names', 'tgNames');
  else if (k === 'h' || k === 'H') toggleOpt('xray', 'tgXray');
  else if (k === 'm' || k === 'M') setSound(!SND.on);
  else if (k === 'f' || k === 'F') toggleFull();
  else if (k === 't' || k === 'T') setTheatre(!TH.on);
  else if (k === 'x' || k === 'X') { nextPlayer(1); if (viewMode !== '2d' && cam3.mode === 'free') setCam('eyes'); }
  else if (k === 'z' || k === 'Z') { nextPlayer(-1); if (viewMode !== '2d' && cam3.mode === 'free') setCam('eyes'); }
  else if (/^[0-9]$/.test(k) && !POV.on) {
    const pid = playerOrder()[(+k + 9) % 10]; const e = pid && M.slotOf(pid, T);
    if (e && isDeadNow(e)) toast(`${M.pl[pid].name} is dead until the next round.`, 2500);
    else if (e) { selected = e; renderPane(); if (viewMode !== '2d' && cam3.mode === 'free') setCam('eyes'); }
  }
  else if (k === 'Tab') { e.preventDefault(); if (!e.repeat) showScoreboard(true); }
  else if (k === '?') toggleKeys();
  else if (k === 'Escape') { $('keys').hidden = true; showScoreboard(false); closeSummary(); if ($('joinCard') && !$('joinCard').hidden) closeJoinCard(); }
});
document.addEventListener('keyup', (e) => { if (e.key === 'Tab') showScoreboard(false); });
window.addEventListener('blur', () => showScoreboard(false));
function toggleKeys(v) { $('keys').hidden = v != null ? !v : !$('keys').hidden; }
$('bKeys').onclick = () => toggleKeys();
$('bKeysClose').onclick = () => toggleKeys(false);
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
    let h = '<div class="sbcard">';
    for (let ti = 0; ti < 2; ti++) {
      const side = r && r.tTeam != null ? (r.tTeam === ti ? 1 : 2) : 0;
      h += `<div class="sbteam"><h3><span class="${side === 1 ? 'kt' : side === 2 ? 'kct' : ''}">${esc(M.tnames[ti])}${side ? (side === 1 ? ' · T' : ' · CT') : ''}</span><span>${sc[ti]}</span></h3>`;
      h += `<div class="sbrow head"><span>#</span><span>Player</span><span>HP</span><span>K</span><span>D</span><span>Weapon</span></div>`;
      const rows = M.teams[ti].map((pid) => { const e = M.slotOf(pid, T); return { pid, e, s: st[pid] || { k: 0, d: 0 }, p: e ? playerState(e, T) : null }; }).filter((x) => x.e != null).sort((a, b) => b.s.k - a.s.k || a.s.d - b.s.d);
      for (const x of rows) {
        const alive = x.p && x.p.state > 0;
        // what the game shows on the player's back: the C4 on a T, the defusal kit on a CT (0.17.0)
        const pk = alive && packAt(x.e, T) ? (x.p.state === 1 ? '<span class="sbpack c4" title="Carrying the bomb">C4</span>' : '<span class="sbpack kit" title="Has a defusal kit">Kit</span>') : '';
        h += `<div class="sbrow${alive ? '' : ' dead'}"><span>${(playerOrder().indexOf(x.pid) + 1) % 10}</span><span class="nm"><span class="nmt">${esc(M.pl[x.pid].name)}</span>${pk}</span><span>${alive ? (hpAt(x.e, T) ?? '') : 0}</span><span>${x.s.k}</span><span>${x.s.d}</span><span>${alive ? esc(weaponShort(x.p.weapon)) : 'dead'}</span></div>`;
      }
      h += '</div>';
    }
    // spectators on the server right now (admins, casters, HLTV relays), plus how many were watching the broadcast
    const specNow = M.specs.filter((pid) => M.slotOf(pid, T) != null).map((pid) => esc(M.pl[pid].name) + (M.pl[pid].hltv ? ' <span class="sbtag">HLTV</span>' : ''));
    const v = viewersAt(T);
    h += `<div class="sbspecs"><span class="sbl">Spectators</span>${specNow.length ? specNow.join('<span class="sbsep">·</span>') : '<span class="sbl">none on the server</span>'}${v != null ? `<span class="sbv">${v.toLocaleString('en-US')} watching on HLTV</span>` : ''}</div>`;
    el.innerHTML = h + '</div>';
  };
  render(); el.hidden = false;
  sbTimer = setInterval(render, 250);
}

// ---------------- HUD ----------------
// the kill feed: every frame (frame, loop.js), not with the rest of the HUD every 0.1 s, so a kill shows in it in the
// same frame as the killing bullet's ✕ on the damage numbers (Sujan, 1 Nov 2026); it's rebuilt only when it changes
function updateFeed() {
  const feed = D.kills.filter((k) => k.t <= T && k.t > T - 6).slice(-5);
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
  $('rclock').innerHTML = thsc + (r ? `${r.live ? 'Round <b>' + r.ln + (r.ot ? ' (OT)' : '') + '</b>' : '<b>Not counted</b>'} · <b>${clockText(T, true) || fmt(T - r.start)}</b>`: '') + (paused ? ' · <b>match paused</b>' : '');
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
  }
}
