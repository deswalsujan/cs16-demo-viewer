// ---------------- sidebar ----------------
document.querySelectorAll('.tabs button').forEach((b) => b.onclick = () => {
  tab = b.dataset.tab;
  document.querySelectorAll('.tabs button').forEach((x) => x.classList.toggle('on', x === b));
  renderPane();
  // back on the Rounds tab, the round playing now is in view, in the middle of the list (it opened at the top
  // before, so at round 23 the list had to be scrolled by hand; Sujan, 23 Oct 2026)
  if (tab === 'rounds') { const cur = $('pane').querySelector('.row.cur'); if (cur) cur.scrollIntoView({ block: 'center' }); }
  // the other tabs open at the top: the panel kept the Rounds list's scroll, so the Kills list opened scrolled down with
  // its "Round 23" heading out of sight (Sujan, 2 Nov 2026)
  else $('pane').scrollTop = 0;
});
const teamSpan = (r, e) => {
  const side = teamOfSlot(e, T) != null && r && r.tTeam != null ? (teamOfSlot(e, T) === r.tTeam ? 1 : 2) : 0;
  return side;
};
// e is a person id. The lists show the short name (full name on hover); full: the kill feed, as in the game
function nameHtml(e, side, full) {
  const nm = M.pl[e] ? M.pl[e].name : '?', sn = full ? nm : shortName(e);
  return `<span class="${side === 1 ? 'kt' : side === 2 ? 'kct' : ''}"${sn !== nm ? ` title="${esc(nm)}"` : ''}>${esc(sn)}</span>`;
}
// a kill inside a skip in the recording: // by its time in the Kills list (0.20.0) and the Wallbangs list (0.26.5)
const SKIP_MARK = `<span class="skipk" title="Happened inside a skip in the recording: you won't see it happen">//</span>`;
function killHtml(k) {
  const ks = k.kteam === 'TERRORIST' ? 1 : k.kteam === 'CT' ? 2 : 0;
  const vs = k.vteam === 'TERRORIST' ? 1 : k.vteam === 'CT' ? 2 : 0;
  if (k.killer === k.victim || !k.kp) return `${nameHtml(k.vp, vs)}<span class="kw">${esc(k.weapon || 'suicide')}</span>`;
  return `${nameHtml(k.kp, ks)}<span class="kw">${esc(k.weapon)}</span>${nameHtml(k.vp, vs)}${k.hs ? '<span class="khs">HS</span>' : ''}${k.wb ? `<span class="kwb${k.wb.loose ? ' loose' : ''}" title="Through ${k.wb.thick} units of ${k.wb.what === 'object' ? 'a breakable or door' : 'wall or crate'}">WB</span>` : ''}`;
}
// A kill on three lines, for the Kills and Wallbangs lists: killer, then the gun (its kill feed icon from the
// player's own files, its name, and the headshot icon), then the victim.
function killRow3(k, wbTag) {
  const ks = k.kteam === 'TERRORIST' ? 1 : k.kteam === 'CT' ? 2 : 0;
  const vs = k.vteam === 'TERRORIST' ? 1 : k.vteam === 'CT' ? 2 : 0;
  const w = k.weapon || 'suicide';
  const hs = k.hs ? (KICONS.headshot ? kicon('headshot', 'hs') : '<span class="khs">HS</span>') : '';
  // WALLBANG and UNSURE on a line of their own under the gun, so they always fit the panel (Sujan, 15 Oct 2026,
  // docs/skip-tags-mock.png; side by side after the gun, UNSURE was cut off at the right edge)
  // LOOSE (0.23.0) follows WALLBANG in the Kills list and stands alone in the Wallbangs list, like UNSURE
  // Kills list: WALLBANG for a strict one, LOOSE WB for a loose one; Wallbangs list: STRICT WB or LOOSE WB (Sujan, 25 Oct 2026)
  const strict = k.wb && !k.wb.loose;
  const tags = (strict ? (wbTag ? '<span class="wbtag">WALLBANG</span>' : `<span class="wbtag" title="${STRICT_TIP}">STRICT WB</span>`) : '') + looseTag(k) + unsureTag(k);
  // the damage line under the gun (Sujan's option 2, 25 Oct 2026): what this shooter took through walls in the burst, and teammates' share before it
  const b = !wbTag && k.burst;
  const dline = b ? `<span class="dline"><b>${b.share[k.killer]} HP</b> (${hitCounts({ hits: b.hits.filter((h) => h.s === k.killer) }, k.t)})${dmore(Object.keys(b.share).filter((e) => +e !== k.killer).map((e) => `${esc(labelAt(+e, k.t))} ${b.share[e]} before`))}</span>` : '';
  const gun = `<span class="gun">${kicon(w)}${esc(w)}${hs}</span>${tags ? `<span class="ktags">${tags}</span>` : ''}${dline || ''}`;
  if (k.killer === k.victim || !k.kp) return `<span class="kname">${nameHtml(k.vp, vs)}</span>${gun}`;
  return `<span class="kname">${nameHtml(k.kp, ks)}</span>${gun}<span class="kname">${nameHtml(k.vp, vs)}</span>`;
}
// The kill last clicked in the Kills or Wallbangs list: it keeps its highlight until another kill is
// clicked or another demo is opened. A kill that playback is passing gets a lighter one.
let pickedKill = null;
const MARK = '<svg class="mark" viewBox="0 0 10 13" aria-hidden="true"><path d="M1 0h8v13L5 9.5 1 13z" fill="currentColor"/></svg>';
const killState = (k) => (k === pickedKill ? ' pick' : Math.abs(k.t - T) < 2 ? ' pass' : '');
// The side panel used to be rebuilt every half second of playback on the Kills and Wallbangs tabs (to move
// the "playback is passing" tint), on every death on the Players tab and at every new round. A click is a
// press and a release on the same row, so a row replaced in between lost the click: it took two or three
// tries (Sujan, 14 Oct 2026). Now the tint moves in place (paneMarks), and a rebuild that comes while a mouse
// button is held down on the panel waits until it's released and the click has gone through.
const PANE = { held: false, later: false };
$('pane').addEventListener('pointerdown', () => { PANE.held = true; });
const paneRelease = () => {
  if (!PANE.held) return;
  PANE.held = false;
  if (PANE.later) { PANE.later = false; setTimeout(renderPane, 0); } // after the click event
};
window.addEventListener('pointerup', paneRelease, true);
window.addEventListener('pointercancel', paneRelease, true);
window.addEventListener('blur', paneRelease);
function paneMarks() {
  if (tab !== 'kills' && tab !== 'wb') return;
  $('pane').querySelectorAll(tab === 'wb' ? '[data-wb]' : '[data-kill]').forEach((el) => {
    const k = D.kills[+el.dataset.ki]; // by its place in the kill list: two kills can share one time (0.22.2)
    if (!k) return;
    el.classList.toggle('pick', k === pickedKill); el.classList.toggle('pass', k !== pickedKill && Math.abs(k.t - T) < 2);
  });
}
function renderPane() {
  if (!D) return;
  if (PANE.held) { PANE.later = true; return; }
  const p = $('pane');
  const cr = roundAt(T);
  if (tab === 'rounds') {
    let h = `<label class="opt"><input type="checkbox" id="optAll" ${showAll ? 'checked' : ''}> Show warmup, restarts and idle rounds</label>`;
    if (D.parts) h += `<div class="joinrow"><span>One map, joined from ${D.parts.length} files.</span><button class="btn sm" type="button" id="bSplit">Split them</button></div>`;
    let prevPart = D.parts ? 0 : null;
    // rounds played after a team reached 16: listed after a note, faded unless this demo counts them
    const A = M.after16, list = visibleRounds().slice();
    if (A && !showAll) for (const r of M.rounds) if (r.afterMatch && r.kills.length && r.start > A.at.start && !list.includes(r)) list.push(r);
    let noted = false;
    for (const r of list) {
      if (A && !noted && r.start > A.at.start) {
        noted = true;
        const who = esc(M.tnames[A.team]);
        h += `<div class="note16"><span>${M.count30 ? `Counting the ${A.extra} ${A.extra === 1 ? 'round' : 'rounds'} played after ${who} reached 16.` : `${A.extra} ${A.extra === 1 ? 'round was' : 'rounds were'} played after ${who} reached 16. Some events count them.`}</span><button class="btn sm" type="button" id="bCount30">${M.count30 ? 'Stop at 16' : 'Count them'}</button></div>`;
      }
      // where the file changes: the part's full file name
      if (prevPart != null && r.part != null && r.part !== prevPart) {
        const P = D.parts[r.part];
        if (P && r.part > prevPart) h += `<div class="partmark">Part ${r.part + 1} · ${fileNameHtml(P.fileName)}${P.partway ? '<small>The recording starts partway into the round below; its kills from then on count.</small>' : ''}</div>`;
        prevPart = r.part;
      }
      const wt = r.winTeam != null ? r.winTeam : null;
      const side = r.winner === 'T' ? 't' : r.winner === 'CT' ? 'ct' : 'x';
      if (r.missing) {
        h += `<div class="row gap" title="Played between two recordings: counted in the score from the scoreboard, not in player stats"><span class="n">${r.live ? 'R' + r.ln : '·'}</span>
          <span class="main"><span class="pill ${side}">${r.winner}</span>${esc(wt != null ? M.tnames[wt] : r.winner + ' side')}<div class="sub">not in any file</div></span>
          <span class="d">${r.live && r.scoreAfter ? r.scoreAfter.join(':') : ''}<br>–</span></div>`;
        continue;
      }
      const who = wt != null ? M.tnames[wt] : (r.winner ? r.winner + ' side' : 'No result');
      const sc = r.live && r.scoreAfter ? `${r.scoreAfter[0]}:${r.scoreAfter[1]}` : '';
      const after = r.afterMatch && !r.live;
      h += `<div class="row${r === cr ? ' cur' : ''}${after ? ' after16' : ''}" data-t="${r.start}"><span class="n">${r.live ? 'R' + r.ln : '·'}</span>
        <span class="main"><span class="pill ${side}">${r.winner || '—'}</span>${esc(who)}${after ? '<span class="tag16">after the match</span>' : ''}<div class="sub">${esc(r.reason || (r.live ? '' : 'not counted'))} · ${r.kills.length} kills${r.sides ? ' · ' + Math.max(0, Object.keys(r.sides).length - new Set(r.kills.map((k) => k.victim)).size) + ' alive at end' : ''}</div></span>
        <span class="d">${sc}<br>${fmt(clockSpan(r.start, r.start + r.dur))}</span></div>`;
    }
    h += `<div class="joinrow"><span>${D.parts ? 'Another part of this map in a file of its own?' : 'Is this map split over two or more demo files?'}</span><button class="btn sm" type="button" id="bJoinWith">Join with another demo…</button></div>`;
    p.innerHTML = h;
    $('optAll').onchange = (e) => { showAll = e.target.checked; renderPane(); drawTimeline(); };
    if ($('bSplit')) $('bSplit').onclick = splitJoined;
    $('bJoinWith').onclick = () => { const cur = D.parts ? D.parts.map((x) => fileByName(x.fileName)).filter(Boolean) : [CUR_FILE || fileByName(D.fileName)].filter(Boolean); JOIN.picking = true; openJoinCard(cur).then(() => { JOIN.picking = true; renderJoinCard(); }); };
    if ($('bCount30')) $('bCount30').onclick = () => setCount30(!M.count30);
  } else if (tab === 'kills') {
    const r = cr;
    let h = `<div class="sechead"><span>${r && r.live ? 'Round ' + r.ln : 'This round'}</span><span>${r ? r.kills.length : 0} kills</span></div>`;
    if (r) for (const k of r.kills) {
      // a kill inside a skip in the recording: // by its time (0.20.0), wallbangs included since 0.21.0, which keep UNSURE too
      const sk = skipNear(k.t) ? SKIP_MARK : '';
      h += `<div class="row krow kill3${killState(k)}" data-kill="${k.t}" data-ki="${D.kills.indexOf(k)}"><span class="n" title="Round timer as shown in game">${k === pickedKill ? MARK : ''}${killClock(k.t) ? cellClock(k.t) : '<span class="nw">+' + fmt(k.t - r.start) + '</span>'}${sk}</span><span class="main">${killRow3(k, true)}</span></div>`;
    }
    if (!r || !r.kills.length) h += `<div class="opt">No kills in this round.</div>`;
    p.innerHTML = h;
  } else if (tab === 'wb') {
    let h;
    if (!MAP || MAP.name !== D.mapName.toLowerCase()) h = `<div class="opt">Wallbang detection needs the map file (${esc(D.mapName)}.bsp). Choose your Half-Life folder or drop the .bsp here.</div>`;
    else {
      // filters (Sujan, 25 Oct 2026): All, Strict wb, Loose wb, Damage, each with a tooltip; rows tagged STRICT WB,
      // LOOSE WB or DAMAGE; a damage row is a burst of hits through cover that didn't kill (wip/wallbang-hits)
      const busy = !!M.seenPending;
      const kills = M.wbs.map((k) => ({ t: k.t, k, kind: k.wb.loose ? 'loose' : 'strict' }));
      const dmg = (M.bursts || []).filter((b) => !b.kill).map((b) => ({ t: b.start, b, kind: 'damage' }));
      const all = kills.concat(dmg).sort((a, b) => a.t - b.t);
      const n = { all: all.length, strict: kills.filter((x) => x.kind === 'strict').length, loose: kills.filter((x) => x.kind === 'loose').length, damage: dmg.length };
      if (!n[wbFilter]) wbFilter = 'all';
      const TIPS = { all: 'Every kill and every burst of damage through walls', strict: 'Kills through cover with none of the victim in view from the shooter\'s eye', loose: 'Kills through cover with part of the victim in view from the shooter\'s eye', damage: D.povOn ? 'Not found in POV mode: the server sends a player only his teammates\' health, so hits through cover can\'t be checked' : `Hits through cover that didn't kill: ${HITS_MIN} HP or more from one or more shooters, each hit within 2 s of the last` };
      const LBL = { all: 'All', strict: 'Strict wb', loose: 'Loose wb', damage: 'Damage' };
      h = `<div class="wbchips" role="group" aria-label="Show">${['all', 'strict', 'loose', 'damage'].map((f) => `<button type="button" data-wf="${f}" class="${wbFilter === f ? 'on' : ''}" title="${TIPS[f]}">${LBL[f]} ${n[f]}</button>`).join('')}</div>`;
      h += `<div class="copyrow"><span>Times: round and in-game round timer, then demo time.${busy ? ` <b>Checking ${M.seenPending} from the shooter's eye…</b>` : ''}</span><button class="btn" id="bCopyWb" type="button">Copy list</button></div>`;
      for (const x of all) {
        if (wbFilter !== 'all' && x.kind !== wbFilter) continue;
        if (x.k) {
          const k = x.k, r = M.rounds.find((y) => y.n === k.round);
          // the round, the round timer and the demo time on three lines; "C4 0:16" never splits (0.21.1, Sujan 15 Oct 2026);
          // // under them for a wallbang inside a skip in the recording, as in the Kills list (Sujan, 2 Nov 2026)
          h += `<div class="row krow wbrow kill3${killState(k)}" data-wb="${k.t}" data-ki="${D.kills.indexOf(k)}" title="Through ${k.wb.thick} units of ${k.wb.what === 'object' ? 'a breakable or door' : 'wall or crate'}"><span class="n">${k === pickedKill ? MARK : ''}R${r ? r.ln : '?'} ·<br>${cellClock(k.t)}<br>${fmt(k.t - D.start)}${skipNear(k.t) ? SKIP_MARK : ''}</span><span class="main">${killRow3(k, false)}</span></div>`;
        } else {
          const b = x.b, r = M.rounds.find((y) => y.n === b.round), bi = M.bursts.indexOf(b);
          const sideOf = (e) => { const st = playerState(e, b.start); return st ? (Math.abs(st.state) === 1 ? 1 : 2) : 0; };
          const gun = b.hits.find((hh) => hh.s === b.main).gun;
          const others = dmore(Object.keys(b.share).filter((e) => +e !== b.main).map((e) => `${esc(labelAt(+e, b.start))} ${b.share[e]}`));
          const mine = b.hits.filter((hh) => hh.s === b.main);
          h += `<div class="row krow wbrow kill3${b === pickedBurst ? ' pick' : ''}" data-hb="${bi}" title="${DMG_TIP}"><span class="n">${b === pickedBurst ? MARK : ''}R${r ? r.ln : '?'} ·<br>${cellClock(b.start)}<br>${fmt(b.start - D.start)}</span><span class="main"><span class="kname"><span class="${sideOf(b.main) === 1 ? 'kt' : 'kct'}">${esc(labelAt(b.main, b.start))}</span></span><span class="gun">${kicon(gun)}${esc(gun)}</span><span class="ktags"><span class="wbtag dmg" title="${DMG_TIP}">DAMAGE</span></span><span class="dline"><b>${b.share[b.main]} HP</b> (${hitCounts({ hits: mine }, b.end)})${others}</span><span class="kname"><span class="${sideOf(b.v) === 1 ? 'kt' : 'kct'}">${esc(labelAt(b.v, b.start))}</span></span></span></div>`;
        }
      }
      if (!all.length) h += `<div class="opt">No wallbang kills or wallbang damage found in the live rounds.</div>`;
    }
    p.innerHTML = h;
    if ($('bCopyWb')) $('bCopyWb').onclick = () => {
      const txt = M.wbs.map((k) => { const r = M.rounds.find((x) => x.n === k.round); return `R${r ? r.ln : '?'}  timer ${clockText(k.t)}  demo ${fmt(k.t - D.start)}  ${M.pl[k.kp] ? M.pl[k.kp].name : '?'} -> ${M.pl[k.vp] ? M.pl[k.vp].name : '?'}  ${k.weapon}${k.hs ? ' HS' : ''}  (${k.wb.thick} units)${k.wb.loose ? '  LOOSE: part of him in view' : ''}${skipNear(k.t) ? '  UNSURE: the recording skips here' : ''}`; }).join('\n');
      const b = $('bCopyWb');
      const ok = () => { b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy list', 1500); };
      const dtx = (M.bursts || []).filter((b) => !b.kill).map((b) => { const r = M.rounds.find((y) => y.n === b.round); return `R${r ? r.ln : '?'}  timer ${clockText(b.start)}  demo ${fmt(b.start - D.start)}  DAMAGE ${b.total} HP to ${labelAt(b.v, b.start)}: ${Object.keys(b.share).map((e) => `${labelAt(+e, b.start)} ${b.share[e]}`).join(', ')}`; }).join('\n');
      try { navigator.clipboard.writeText(`${D.fileName}\n${txt}${dtx ? '\n' + dtx : ''}`).then(ok, () => { b.textContent = 'Copy failed'; }); } catch { b.textContent = 'Copy failed'; }
    };
    p.querySelectorAll('[data-wf]').forEach((el) => el.onclick = () => { wbFilter = el.dataset.wf; renderPane(); });
    p.querySelectorAll('[data-hb]').forEach((el) => el.onclick = () => {
      const b = M.bursts[+el.dataset.hb]; if (!b) return;
      pickedBurst = b; pickedKill = null; selected = b.main;
      seek(b.start - 3); playing = true; setPlayIcon();
      if (viewMode !== '2d') setCam('eyes', true);
      renderPane();
    });
    p.querySelectorAll('[data-wb]').forEach((el) => el.onclick = () => {
      const k = D.kills[+el.dataset.ki];
      wbFocus = k; pickedKill = k; pickedBurst = null;
      watchKill(k, 3); renderPane();
    });
  } else {
    const buckets = [['all', 'Total'], ['t', 'T side'], ['ct', 'CT side']].concat(M.hasOT ? [['ot', 'Overtime']] : []);
    if (!buckets.some((b) => b[0] === statBucket)) statBucket = 'all';
    let h = `<div class="statseg">${buckets.map(([k, l]) => `<button type="button" data-b="${k}" class="${statBucket === k ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const st = statsFor(statBucket);
    const r0 = M.liveR[0];
    for (let ti = 0; ti < 2; ti++) {
      const firstSide = r0 ? (r0.tTeam === ti ? 'T' : 'CT') : '';
      const rows = M.teams[ti].map((e) => ({ e, s: st[e] || { k: 0, d: 0, hs: 0, tk: 0, rounds: 0 } })).filter((x) => x.s.rounds || x.s.k || x.s.d).sort((a, b) => b.s.k - a.s.k || a.s.d - b.s.d);
      const tk = rows.reduce((a, x) => a + x.s.k, 0);
      const short = M.short || {};
      h += `<div class="sechead"><span>${esc(M.tnames[ti])}${firstSide ? ` · started ${firstSide}` : ''}</span></div>
        <div class="row prow stathead"><span class="main"></span><span class="sc">K</span><span class="sc">D</span><span class="sc" title="Kills minus deaths">K−D</span><span class="sc" title="Headshot kills as a share of all kills">HS</span></div>`;
      for (const { e, s: x } of rows) {
        const pm = x.k - x.d;
        const slot = M.slotOf(e, T), dead = slot != null && isDeadNow(slot);
        const full = M.pl[e].name, nm = short[e] || full;
        h += `<div class="row prow${selected != null && slot === selected ? ' sel' : ''}${slot == null ? ' gone' : ''}${dead ? ' dead' : ''}" data-p="${e}" title="${esc(full)}${dead ? ' · dead until the next round' : ''}"><span class="main">${dead ? `<span class="pnum skull" aria-label="dead">${SKULL}</span>` : (D.povOn ? '' : `<span class="pnum">${(playerOrder().indexOf(e) + 1) % 10}</span>`)}<span class="nm">${esc(nm)}</span>${x.tk ? `<span class="sub"> · ${x.tk} TK</span>` : ''}</span><span class="sc">${x.k}</span><span class="sc">${x.d}</span><span class="sc ${pm > 0 ? 'pos' : pm < 0 ? 'neg' : ''}">${pm > 0 ? '+' : ''}${pm}</span><span class="sc">${x.k ? Math.round(x.hs / x.k * 100) : 0}%</span></div>`;
      }
    }
    h += `<div class="opt">Kills and deaths from the kill feed only: no bonus points for bomb plants or defuses, and team kills (TK) are not counted as kills. Only live rounds count${M.hasOT ? `; overtime is every round after round ${M.reg}` : ''}. ${D.povOn ? 'The highlighted player is the one whose eyes the 3D view shows.' : 'Click a player to highlight them. The number is their 1 to 0 key.'}</div>`;
    p.innerHTML = h;
    p.querySelectorAll('[data-b]').forEach((b) => b.onclick = () => { statBucket = b.dataset.b; renderPane(); });
  }
  p.querySelectorAll('[data-t]').forEach((el) => el.onclick = () => { seek(+el.dataset.t); });
  p.querySelectorAll('[data-kill]').forEach((el) => el.onclick = () => {
    // by the kill's place in the list, not its time: kills in the same snapshot share a time, and the first of them
    // was picked (FX vs Lions, Nuke, DreamHack Winter 2010, R20 C4 0:05: NEO's wallbang showed KUB3N's view; Sujan,
    // 24 Oct 2026). The Wallbangs list only looked right because one of them was a wallbang.
    const k = D.kills[+el.dataset.ki];
    if (!k) return;
    pickedKill = k;
    watchKill(k, 4); renderPane();
  });
  p.querySelectorAll('[data-p]').forEach((el) => el.onclick = () => {
    const e = M.slotOf(el.dataset.p, T);
    if (e == null) { toast(`${M.pl[el.dataset.p].name} isn't on the server at this point in the demo.`); return; }
    if (isDeadNow(e) && e !== selected) { toast(`${M.pl[el.dataset.p].name} is dead until the next round. Pick a living player, or press ↓ for the next round.`, 4000); return; }
    selectPlayer(e);
  });
}

// team renaming
for (const [id, i] of [['tnA', 0], ['tnB', 1]]) {
  $(id).onclick = () => {
    const el = $(id);
    el.contentEditable = 'true'; el.focus();
    const range = document.createRange(); range.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(range);
    const done = () => { el.contentEditable = 'false'; const v = el.textContent.trim().slice(0, 30); if (v) M.tnames[i] = v; el.textContent = M.tnames[i]; ls.set('names:' + demoKey(), M.tnames); renderPane(); };
    el.onblur = done;
    el.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); el.blur(); } e.stopPropagation(); };
  };
}
