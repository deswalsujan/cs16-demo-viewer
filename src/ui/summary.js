// ---------------- what loaded ----------------
// After a demo opens: which of the files it needs were found, which are custom and which are
// missing. Shown briefly over the view, and kept for "Copy debug info".
let ASSETS = null;
async function loadSummary(sndDone) {
  const d = D;
  openSummary({ state: 'busy' });
  // A file that reads but has no player movement, or no rounds, can't be played. Say what was found and
  // list the likely reasons, the likeliest first.
  const moved = D.times.length && Object.keys(D.slots).length;
  if (!moved || !M.rounds.length) {
    const game = String((D.header && D.header.gameDir) || '').toLowerCase();
    const other = game && game !== 'cstrike';
    const why = other ? [`It's from another game: the file says "${game}", and the viewer only plays Counter-Strike 1.6.`] : [];
    const hr = fileHealthRow(D.health, D.end - D.start);
    if (hr && hr.s === 'warn') {
      // the file's own structure says what's wrong: that's the reason, not a guess
      renderSummary({ state: 'fail', title: "This demo can't be played", text: !moved ? 'The file stops before any player moved, so there is nothing to show.' : 'The file stops before the first round started, so there is nothing to show.', rows: [Object.assign({}, hr, { s: 'fail', n: hr.n.replace(/ It plays up to where the file stops: .*$/, '') + ` What's readable is ${fmt(D.end - D.start)} of recording.` })] });
      return;
    }
    if (!moved) why.push('It was stopped right after it started, before anyone moved.', 'It was cut off: the download or the recording was interrupted.');
    else why.push("It's from a game mode without rounds, like deathmatch or a training map.", 'It was stopped before the first round started.');
    if (!other) why.push("It's from another game: the viewer only plays Counter-Strike 1.6.");
    renderSummary({ state: 'fail', title: "This demo can't be played", text: !moved ? "The file opened, but there's no player movement in it. The likely reasons:" : "The file opened and players move in it, but there are no rounds the viewer can find. The likely reasons:", rows: why.map((t) => ({ s: 'info', t })) });
    return;
  }
  const pm = [...new Set((D.pmodels || []).filter((n) => /\.mdl$/i.test(n)).map((n) => n.toLowerCase()))];
  const used = new Set();
  const S = D.stride;
  for (const e in D.slots) { const a = D.slots[e]; for (let i = 6; i < a.length; i += S * 15) if (a[i]) used.add(a[i]); }
  const pw = [...used].map((k) => (D.models[k] || '').toLowerCase()).filter((n) => /(^|\/)p_[^/]+\.mdl$/.test(n));
  const vw = pw.map((n) => vName(n));
  const check = async (list) => {
    const out = { found: 0, total: list.length, custom: [], missing: [], broken: [] };
    for (const n of list) {
      const m = await modelEntry(n).done;
      const short = n.split('/').pop();
      if (m.status === 'ok') { out.found++; if (m.custom) out.custom.push(short); }
      else if (m.status === 'broken') out.broken.push(short);
      else out.missing.push(short);
    }
    return out;
  };
  const [players, weapons, views] = [await check(pm), await check(pw), await check(vw)];
  await sndDone;
  const need = demoSoundList();
  const sounds = { found: need.filter((n) => SND.bufs[n]).length, total: need.length, missing: need.filter((n) => !SND.bufs[n]) };
  let map = null;
  for (let k = 0; k < 40 && !MAP && mapLoading; k++) await new Promise((r) => setTimeout(r, 250));
  if (MAP && MAP.name === D.mapName.toLowerCase()) map = { ok: true, missingTex: MAP.missingTex || 0 };
  if (d !== D) return; // another demo was opened meanwhile
  ASSETS = { map, overview: !!OV, players, weapons, views, sounds };

  // one line per check: ok (✓), warn (!), fail (✗), info (i)
  const rows = [];
  const few = (list) => list.slice(0, 3).join(', ') + (list.length > 3 ? ` and ${list.length - 3} more` : '');
  const live = M.liveR.length;
  // rounds played after the match ended and not counted: say both numbers, so the line below has its context
  const notCounted = M.after16 && !M.count30 ? M.after16.extra : 0;
  const readText = notCounted ? `Demo read: ${live + notCounted} rounds, ${live} counted` : `Demo read: ${live} rounds`;
  if (!D.errors) rows.push({ s: 'ok', t: readText, n: '' });
  else rows.push({ s: 'warn', t: `${readText}, ${D.errors} damaged ${D.errors === 1 ? 'packet' : 'packets'}`, n: 'A few moments may skip or show players in the wrong spot.' });
  // the file itself: never finished, cut short, extra bytes, damaged index (one row per part of a joined map)
  const healthRows = (D.parts ? D.parts.map((P, i) => fileHealthRow(P.health, P.dur, `Part ${i + 1}: `)) : [fileHealthRow(D.health, D.end - D.start)]).filter(Boolean);
  rows.push(...healthRows);
  if (M.after16) {
    const A = M.after16, n = A.extra, who = M.tnames[A.team], sc = `${Math.max(...A.score)}:${Math.min(...A.score)}`;
    rows.push({ s: 'info', t: `${n} ${n === 1 ? 'round was' : 'rounds were'} played after ${who} reached 16 (${sc})`, n: M.count30 ? 'Counted, as chosen for this demo (up to round 30).' : `Some events played all 30 rounds and count them. Not counted now: the match ends at ${sc}.`, btn: { id: 'sumCount30', label: M.count30 ? 'Stop at 16' : 'Count them' } });
  }
  if (D.maps && D.maps.length > 1) rows.push({ s: 'info', t: `The recording switched maps. Showing ${D.mapName}, where it spent longest.`, n: D.maps.map((m) => `${m.map} ${fmt(m.dur)}`).join(', then ') });
  // POV mode (0.25.0, Sujan 29 Oct 2026): off by default, so the line says so and turns it on
  if (D.pov) rows.push(D.povOn
    ? { s: 'info', t: 'Recorded by a player, shown in POV mode', n: "Through his own eyes, as his game showed it. A player's game only receives the players near them, so others drop in and out of view, and wallbangs are found less reliably than in HLTV demos. POV mode can be turned off in View settings." }
    : { s: 'info', t: 'Recorded by a player (a POV demo)', n: "A player's game only receives the players near them, so others drop in and out of view, and wallbangs are found less reliably than in HLTV demos. POV mode is off: turn it on to watch through his eyes, with his crosshair, HUD and gun. It's also in View settings.", btn: D.povData ? { id: 'sumPov', label: 'Turn on POV mode' } : null });
  // A map recorded in two or more files. A part on its own says so only when another part is in the folder
  // (same map, at least 8 of the same Steam IDs) and this one starts late or ends before anyone won. Those two
  // alone were wrong on all four demos on Sujan's Mac that showed them with no other part (2 Oct 2026): a draw
  // the server announced, two recordings cut off in their last round, and an overtime-only file.
  if (D.parts) {
    const js = joinedSetOf(D.parts[0].fileName);
    rows.push({ s: 'info', t: `One map, joined from ${D.parts.length} files`, n: D.parts.map((x, i) => `Part ${i + 1}: ${x.fileName}`).join('. ') + '.' + (js && js.keep && js.why ? ` Joined in your order, which the rounds don't support: ${js.why}` : '') + ' Split them in the Rounds tab.' });
  } else {
    const st = liveStart(M), before = st.sbT + st.sbCT, partway = st.partway;
    const last = M.liveR[M.liveR.length - 1], open = !!last && !M.wonAt, late = before > 0 || partway;
    if (late || open) {
      const others = await findOtherParts();
      if (d !== D) return;
      const ends = last ? `${last.scoreAfter[0]}:${last.scoreAfter[1]}` : '';
      const lateText = (partway ? 'The recording starts partway into a round.' : '') + (before ? ` The game's scoreboard already shows ${plural(before, 'round')} played before ${partway ? 'that one' : 'the recording starts'}.` : '');
      let t, n;
      if (late && !open) { t = 'This is probably part 2 of a map recorded in two or more files'; n = lateText.trim(); }
      else if (open && !late) { t = `This recording ends at ${ends}, before anyone won`; n = 'The rest of the map is probably in another file.'; }
      else { t = 'This is probably one part of a map recorded in two or more files'; n = `${lateText.trim()} It ends before anyone won.`; } // this file's own score means nothing for the map
      SUM.joinList = null;
      if (others.length) {
        n += others.length === 1 ? ` ${others[0].name} has the same players on ${D.mapName}.` : ` ${others.length} other demos have the same players on ${D.mapName}: ${others.map((f) => f.name).join(', ')}.`;
        SUM.joinList = [CUR_FILE || fileByName(D.fileName), ...others].filter(Boolean);
        rows.push({ s: 'info', t, n, btn: { id: 'sumJoin', label: 'Join the parts' } });
      }
    }
  }
  if (!map) rows.push({ s: 'fail', t: `Map ${D.mapName} not found`, n: 'No 3D view and no wallbang finder. Add the .bsp from cstrike\\maps or cstrike_downloads\\maps.' });
  else if (map.missingTex) rows.push({ s: 'warn', t: `Map loaded, ${map.missingTex} textures missing`, n: 'Those surfaces show a grey checkerboard in 3D.' });
  else rows.push({ s: 'ok', t: 'Map and textures', n: '' });
  rows.push(OV ? { s: 'ok', t: 'Radar overview', n: '' } : { s: 'warn', t: 'Radar overview not found', n: `The 2D radar uses a plain grid instead of the map picture. It needs ${D.mapName}.bmp and ${D.mapName}.txt in cstrike\\overviews or cstrike_downloads\\overviews.` });
  const modelRow = (label, o, effect) => {
    const bad = [...o.missing, ...o.broken];
    if (!o.total) return null;
    if (!bad.length) return { s: 'ok', t: `${label}: ${o.found} of ${o.total}`, n: '' };
    return { s: o.found ? 'warn' : 'fail', t: `${label}: ${o.found} of ${o.total}`, n: `${o.broken.length ? "Couldn't read " + few(o.broken) + '. ' : ''}${o.missing.length ? 'Missing ' + few(o.missing) + '. ' : ''}${effect}` };
  };
  for (const r of [modelRow('Player models', players, 'Those players show as simple figures in team colours.'),
    modelRow('Weapons in hand', weapons, 'Those players are drawn without a gun.'),
    modelRow("First-person weapons", views, "Player's eyes shows no gun for those weapons.")]) if (r) rows.push(r);
  const custom = [...players.custom, ...weapons.custom, ...views.custom];
  if (custom.length) rows.push({ s: 'info', t: `Custom models: ${few(custom)}`, n: 'Different from the stock game files. Used as they are; they may look or move slightly differently.' });
  if (!sounds.total) { /* nothing to play */ }
  else if (sounds.found === sounds.total) rows.push({ s: 'ok', t: `Sounds: ${sounds.found} of ${sounds.total}`, n: '' });
  else {
    // say which kind of sound is missing and where it belongs, so the right folder can be checked
    const wpn = sounds.missing.filter((n) => n.startsWith('weapons/')).length;
    const where = wpn ? `${wpn} of them are weapon sounds (cstrike\\sound\\weapons). ` : '';
    rows.push({ s: sounds.found ? 'warn' : 'fail', t: `Sounds: ${sounds.found} of ${sounds.total}`, n: `${where}Missing ${few(sounds.missing.map((n) => n.split('/').pop()))}. ${sounds.found ? 'The missing ones stay silent.' : 'The demo plays without sound.'}` });
  }
  // files that were there when the folder was chosen but can't be read now (deleted, moved or replaced since)
  // listed first, since it's usually the reason for the misses below
  if (STALE.size) rows.splice(1, 0, { s: 'warn', t: 'Your Half-Life folder changed after you chose it', n: `${STALE.size} ${STALE.size === 1 ? 'file' : 'files'} couldn't be read, for example ${few([...STALE].map((n) => n.split('/').pop()))}. ${HL.handle ? 'Go back to the start screen (Open another demo) to pick up the changes' : 'Choose the folder again to pick up the changes'}.` });

  const onlyDemo = !map && !OV && !players.found && !sounds.found;
  const anyBad = rows.some((r) => r.s === 'warn' || r.s === 'fail');
  let res;
  if (onlyDemo) {
    rows.splice(STALE.size ? 2 : 1, rows.length, { s: 'warn', t: 'Map, overview, models and sounds: none loaded yet', n: 'The radar uses a plain grid, there is no 3D view, and the demo plays silently.' });
    res = { state: 'warn', title: 'The demo will play, in 2D only', text: 'Only the demo file is loaded. Choose your Half-Life folder to add the map, player models and sounds.', folder: true };
  }
  // the only problem is the file stopping early: say that plainly in the title
  else if (healthRows.some((r) => r.s === 'warn') && !rows.some((r) => (r.s === 'warn' || r.s === 'fail') && !healthRows.includes(r))) res = { state: 'warn', title: 'The demo will play up to where the file stops', text: 'Everything it needs loaded. The file itself is incomplete; what follows says exactly how.' };
  else if (!anyBad) res = { state: 'ok', title: 'Ready to watch', text: rows.some((r) => r.s === 'info') ? 'Everything loaded. The demo will play in full; a note on it below.' : 'Everything loaded. The demo will play in full.' };
  else res = { state: 'warn', title: 'The demo will play, with a few gaps', text: 'Some files are missing or damaged. Playback works; the parts marked below will look or sound different.', folder: !map || STALE.size > 0 };
  renderSummary(Object.assign(res, { rows }));
}

// What the file itself says about how it was recorded (demo.js, readIndex): a recording never closed, a
// file cut short, extra bytes after the end, or a damaged index. Only things read from the file's own
// structure, so each line is certain. Returns a summary row, or null for a file as a recorder leaves it.
// lead: "Part 2: " in a joined map. dur: how long what's readable plays.
function fileHealthRow(h, dur, lead = '') {
  if (!h || (h.index === 'ok' && h.badFrame == null)) return null;
  const mb = (n) => (n / 1048576).toFixed(n < 10485760 ? 1 : 0) + ' MB';
  const plays = `It plays up to where the file stops: ${fmt(dur)} of recording.`;
  const tail = h.cutInFrame ? ` The file also stops ${plural(h.cutInFrame, 'byte')} into its last frame.` : '';
  const bad = h.badFrame != null ? ` Past ${mb(h.stopAt)} of ${mb(h.fileLen)} the frames can't be read (a damaged stretch), so the rest is left out.` : '';
  if (h.index === 'ok' || (h.index === 'extra' && h.badFrame != null)) return { s: 'warn', t: `${lead}Part of this file is damaged`, n: `Past ${mb(h.stopAt)} of ${mb(h.fileLen)} the frames can't be read, so the rest is left out. ${plays.replace('the file stops', 'the damage starts')}` };
  if (h.index === 'extra') return { s: 'info', t: `${lead}This file has ${plural(h.extra, 'extra byte')} after its end`, n: 'They come after the index the recorder writes when it stops, so they were added later (by a download or copy, say). The demo is complete and plays in full; the extra bytes are left out.' };
  if (h.index === 'never') return { s: 'warn', t: `${lead}This recording was never finished`, n: `When a recording stops properly, the recorder writes an index at the end of the file, and this file has none: HLTV or the game stopped without closing the file, or it was copied or downloaded while still being written.${tail}${bad} ${plays}` };
  if (h.index === 'past' || h.index === 'short') return { s: 'warn', t: `${lead}This file was cut short`, n: `The recording was finished, but ${h.index === 'past' ? "the index it ends with isn't in the file" : "the index it ends with is only partly in the file"}: the end of the file is missing, usually from an interrupted download or copy.${tail}${bad} ${plays}` };
  return { s: 'warn', t: `${lead}This file's index is damaged`, n: `The index at the end of the file doesn't fit the file, so the frames were read one by one from the start instead.${tail}${bad} ${plays}` };
}

// the card itself: opens in the middle of the view, closes on its own (not when it reports a failure)
const SUM = { timer: null, left: 0, total: 0, paused: false, last: 0 };
function openSummary(o) { renderSummary(Object.assign({ state: 'busy', title: 'Checking your files…', text: 'Looking for the map, models and sounds this demo needs.', rows: [] }, o)); }
// Count the rounds played after a team reached 16 (up to round 30), or stop at 16: remembered per demo
function setCount30(on) {
  if (!D) return;
  ls.set('count30:' + demoKey(), on ? true : null);
  derive(); buildZoom(); heat = null;
  if (MAP && MAP.name === D.mapName.toLowerCase()) computeWallbangs();
  tlCache.key = ''; renderPane(); drawTimeline(); updateHud(true);
  if (!$('sumCard').hidden) closeSummary();
  const A = M.after16;
  if (A) toast(on ? `Counting the ${A.extra} ${A.extra === 1 ? 'round' : 'rounds'} played after ${M.tnames[A.team]} reached 16. Rounds tab: Stop at 16 to undo.` : `Stopping at 16. Rounds tab: Count them to count the rounds played after.`, 5000);
}
function closeSummary() { const el = $('sumCard'); if (el) el.hidden = true; clearInterval(SUM.timer); SUM.timer = null; SUM.closedFor = D; }
function showFailCard(name, err) {
  ERRLOG.push('Demo read failed: ' + err);
  // A file that isn't cut off or unfinished (those open and play up to where they stop, see fileHealthRow)
  // but still can't be read: say what the reader met, and only suggest checking the game when the file
  // isn't a Half-Life demo at all.
  const why = /not a half-life demo/i.test(err) ? "It isn't a Half-Life demo file: it doesn't start the way every demo does. Check that it's a .dem recorded in Counter-Strike 1.6."
    : /bad frame type/i.test(err) ? `It's damaged near its start, ${(+((err.match(/at (\d+)/) || [])[1] || 0) / 1024).toFixed(0)} KB in, before the match begins, so nothing after that can be read. Try another copy of the demo.`
    : `Part of it is damaged in a way the reader can't get past (it stopped with "${err}"). Try another copy of the demo.`;
  renderSummary({ state: 'fail', title: "This demo can't be played", text: `${name} couldn't be opened. ${why}`, rows: [] });
}
function renderSummary(r) {
  // closed while it was still checking (×, Esc, or pressing play): don't bring it back for this demo
  // when the check finishes. A demo that can't be played still says so.
  if (SUM.closedFor && SUM.closedFor === D && r.state !== 'fail') return;
  const el = $('sumCard');
  const icon = { ok: '✓', warn: '!', fail: '✕', info: 'i', busy: '…' };
  el.innerHTML = `<div class="sum" role="dialog" aria-live="polite" aria-labelledby="sumTitle">
    <div class="sum-top ${r.state}"><div class="ti"><h2 id="sumTitle">${esc(r.title)}</h2><p>${esc(r.text)}</p></div><button class="sum-x" type="button" id="sumX" title="Close (Esc)" aria-label="Close">×</button></div>
    ${r.rows.length ? `<ul class="sum-list">${r.rows.map((x) => `<li><span class="sum-ic ${x.s}" aria-hidden="true">${icon[x.s]}</span><span>${esc(x.t)}${x.n ? `<small>${esc(x.n)}</small>` : ''}${x.btn ? `<div class="li-btn"><button class="btn sm" type="button" id="${x.btn.id}">${esc(x.btn.label)}</button></div>` : ''}</span></li>`).join('')}</ul>` : ''}
    ${r.state === 'busy' ? '' : `<div class="sum-foot">${r.folder ? `<button class="btn" type="button" id="sumFolder">${HL.handle ? 'Refresh Half-Life folder' : 'Choose Half-Life folder'}</button>` : ''}<span class="sp"></span><span id="sumCount"></span></div>`}
    ${r.state === 'busy' || r.state === 'fail' ? '' : '<div class="sum-bar"><i id="sumBar"></i></div>'}
  </div>`;
  el.hidden = false;
  $('sumX').onclick = closeSummary;
  if ($('sumCount30')) $('sumCount30').onclick = () => setCount30(!M.count30);
  if ($('sumPov')) $('sumPov').onclick = () => { closeSummary(); $('pov3').checked = true; $('pov3').onchange(); };
  if ($('sumJoin')) $('sumJoin').onclick = () => { if (SUM.joinList) openJoinCard(SUM.joinList); };
  if ($('sumFolder')) $('sumFolder').onclick = () => { closeSummary(); refreshOrPick(); };
  el.onclick = (e) => { if (e.target === el && r.state !== 'busy') closeSummary(); };
  clearInterval(SUM.timer); SUM.timer = null;
  const card = el.querySelector('.sum');
  // pause only when the mouse actually moves over the card (it often opens right under a resting cursor)
  SUM.paused = false;
  card.onpointermove = () => { SUM.paused = true; }; card.onpointerleave = () => { SUM.paused = false; };
  if (r.state === 'busy') return;
  if (r.state === 'fail') { $('sumCount').textContent = 'Stays open until you close it'; return; }
  // closes on its own: sooner when there's nothing to read
  SUM.total = SUM.left = r.state === 'ok' && !r.rows.some((x) => x.s === 'info') ? 6 : 15; SUM.last = performance.now();
  // The bar is animated by the browser, so it shrinks smoothly on every frame instead of in
  // 10-a-second steps. It pauses and resumes with the countdown.
  const bar = $('sumBar');
  SUM.anim = bar && bar.animate ? bar.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: SUM.total * 1000, fill: 'forwards', easing: 'linear' }) : null;
  const tick = () => {
    const now = performance.now(), dt = (now - SUM.last) / 1000; SUM.last = now;
    if (!SUM.paused) SUM.left -= dt;
    if (SUM.left <= 0) { closeSummary(); return; }
    $('sumCount').textContent = SUM.paused ? 'Paused while you read' : `Closes in ${Math.ceil(SUM.left)} s`;
    if (SUM.anim) {
      if (SUM.paused && SUM.anim.playState === 'running') SUM.anim.pause();
      else if (!SUM.paused && SUM.anim.playState === 'paused') { SUM.anim.currentTime = (SUM.total - SUM.left) * 1000; SUM.anim.play(); }
    } else if (bar) bar.style.transform = `scaleX(${Math.max(0, SUM.left / SUM.total)})`;
  };
  tick(); SUM.timer = setInterval(tick, 100);
}
