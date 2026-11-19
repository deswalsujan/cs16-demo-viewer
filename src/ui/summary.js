// ---------------- what loaded ----------------
// After a demo opens: which of the files it needs were found, which are custom and which are
// missing. Shown briefly over the view, and kept for "Copy debug info".
let ASSETS = null;
async function loadSummary(sndDone) {
  const d = D;
  SUM.joinList = null; SUM.joinOffer = false; // a previous demo's offer to join (the Rounds tab reads it, item 10)
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
      // the file's own structure says what's wrong: that's the reason, not a guess. The card says it in plain words; the
      // file's detail (its index, where it stops, in bytes) goes to Copy debug info (UI review, item 2)
      ERRLOG.push(`Can't play ${D.fileName}: ${hr.t}. ${hr.n.replace(/ It plays up to where the file stops: .*$/, '')} What's readable is ${fmt(D.end - D.start)} of recording.`);
      renderSummary({ state: 'fail', closeDemo: true, title: "This demo can't be played", text: (!moved ? 'The file stops before any player moved, so there is nothing to show.' : 'The file stops before the first round started, so there is nothing to show.') + ' It was probably cut off by an interrupted recording, download or copy. Try another copy of the demo.', rows: [] });
      return;
    }
    if (!moved) why.push('It was stopped right after it started, before anyone moved.', 'It was cut off: the download or the recording was interrupted.');
    else why.push("It's from a game mode without rounds, like deathmatch or a training map.", 'It was stopped before the first round started.');
    if (!other) why.push("It's from another game: the viewer only plays Counter-Strike 1.6.");
    renderSummary({ state: 'fail', closeDemo: true, title: "This demo can't be played", text: !moved ? "The file opened, but there's no player movement in it. The likely reasons:" : "The file opened and players move in it, but there are no rounds the viewer can find. The likely reasons:", rows: why.map((t) => ({ s: 'info', t })) });
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
    rows.push({ s: 'info', t: `${n} ${n === 1 ? 'round was' : 'rounds were'} played after ${who} reached 16 (${sc})`, n: M.auto30 ? 'Counted: the teams played on to round 30, as events that count all 30 rounds did.' : M.count30 ? 'Counted, as chosen for this demo (up to round 30).' : `Some events played all 30 rounds and count them. Not counted now: the match ends at ${sc}.`, btn: { id: 'sumCount30', label: M.count30 ? 'Stop at 16' : 'Count them' } });
  }
  // POV mode's own line and its Turn on button went with the setting (Sujan signed POV mode off, 11 Nov 2026; 0.26.30):
  // a POV demo always opens in it. Only a file without the record of his own view, which POV mode needs, says why.
  // the card's first line says what kind of demo it is (Sujan, 19 Nov 2026), so a POV demo without the record of the player's
  // own view only says what that changes
  if (D.pov && !D.povOn) rows.push({ s: 'info', tail: "without the player's view", t: "No record of the player's own view", n: "This file has no record of the player's own view, so it plays like an HLTV demo, with the player at the map's zero point." });
  // the anti-wallhack note, which no longer shows over the HUD (the POV mockup round, Sujan, 11 Nov 2026; the ! on See
  // through walls brings it back), as a line of its own that keeps the card open (Sujan, 19 Nov 2026; up to then one short
  // line with "His view only, in 3D", the UI review's item 2)
  if (D.povOn && POV.on && povHidesEnemies().on) rows.push({ s: 'info', keep: true, t: 'It seems the server used an anti-wallhack plugin. Click ! on the **See through walls** button below to know more.' });
  // A map recorded in two or more files: a part on its own says so whenever it starts late or ends before anyone won, with
  // Join parts… (Sujan, 19 Nov 2026). With other parts in the folder (same map, at least 8 of the same Steam IDs) the note
  // names them and keeps the card open; with none, the note and its Join parts…, which opens the Join card's picker, are only
  // under Details and the card doesn't stay open, since those two alone were wrong on all four demos on Sujan's Mac that
  // showed them with no other part (2 Oct 2026): a draw the server announced, two recordings cut off in their last round,
  // and an overtime-only file. Up to 19 Nov 2026 the note showed only with another part in the folder. With none, its words
  // say it may have been a draw or a recording that stopped early (Sujan, 20 Nov 2026).
  if (D.parts) {
    const js = joinedSetOf(D.parts[0].fileName);
    // a joined map is a quiet note, unless it was joined in an order the rounds don't support, which keeps the card open; each
    // part on its own line (Sujan, 20 Nov 2026)
    rows.push({ s: 'info', tail: `joined from ${D.parts.length} files`, keep: !!(js && js.keep && js.why), t: `One map, joined from ${D.parts.length} files`, n: D.parts.map((x, i) => `Part ${i + 1}: ${x.fileName}`).join('\n') + '\n' + (js && js.keep && js.why ? `Joined in your order, which the rounds don't support: ${js.why} ` : '') + 'Split them in the Rounds tab.' });
  } else {
    const st = liveStart(M), before = st.sbT + st.sbCT, partway = st.partway;
    const last = M.liveR[M.liveR.length - 1], open = !!last && !M.wonAt, late = before > 0 || partway;
    if (late || open) {
      const others = await findOtherParts();
      if (d !== D) return;
      const ends = last ? `${last.scoreAfter[0]}:${last.scoreAfter[1]}` : '';
      const lateText = (partway ? 'The recording starts partway into a round.' : '') + (before ? ` The game's scoreboard already shows ${plural(before, 'round')} played before ${partway ? 'that one' : 'the recording starts'}.` : '');
      let t, n;
      SUM.joinList = null;
      if (others.length) {
        if (late && !open) { t = 'This is probably part 2 of a map recorded in two or more files'; n = lateText.trim(); }
        else if (open && !late) { t = `This recording ends at ${ends}, before anyone won`; n = 'The rest of the map is probably in another file.'; }
        else { t = 'This is probably one part of a map recorded in two or more files'; n = `${lateText.trim()} It ends before anyone won.`; } // this file's own score means nothing for the map
        n += others.length === 1 ? ` ${others[0].name} has the same players on ${D.mapName}.` : ` ${others.length} other demos have the same players on ${D.mapName}: ${others.map((f) => f.name).join(', ')}.`;
        SUM.joinList = [CUR_FILE || fileByName(D.fileName), ...others].filter(Boolean);
      } else {
        // no other part found: neutral words, since the file may be a plain draw or a recording that stopped early (Sujan,
        // 20 Nov 2026). Starting late and ending with no winner, the title has no score: this file's own score leaves out
        // the rounds before it
        const may = 'It may have been a draw, or the recording may have stopped early.', join = ' **Join parts…** adds it, from your Half-Life folder or from anywhere.';
        if (open && !late) { t = `This recording ends at ${ends} with no winner.`; n = `${may} If the rest of the map is in another file,${join}`; }
        else if (late && !open) { t = 'This recording starts partway through the map.'; n = `${lateText.trim()} If the start of the map is in another file,${join}`; }
        else { t = 'This recording starts partway through the map and ends with no winner.'; n = `${lateText.trim()} ${may} If the start or the rest of the map is in another file,${join}`; }
      }
      // one name for it (UI review, item 10); quiet: a button that doesn't keep the card open
      rows.push({ s: 'info', t, n, btn: { id: 'sumJoin', label: 'Join parts…' }, quiet: !others.length, notail: !others.length });
      SUM.joinOffer = true;
      if (tab === 'rounds') renderPane(); // the Rounds tab asks about joining now
    }
  }
  // the recording switched maps: no longer the card's first note (Sujan, 19 Nov 2026); under Details when the other maps
  // played under a minute in all, a note that keeps the card open from a minute (up to then it always kept the card open).
  // The other maps are every stretch but the one shown, added up, with three or more maps too (Sujan, 19 Nov 2026): the
  // reader plays the first stretch when it's the longest, else the last (parseDemo), and the viewer only that one
  if (D.maps && D.maps.length > 1) {
    const L = D.maps, nm = (m) => m.map.toLowerCase(), want = D.mapName.toLowerCase();
    const longest = L.reduce((b, m, i) => (m.dur > L[b].dur ? i : b), 0);
    let shown = longest === 0 ? 0 : L.length - 1;
    if (nm(L[shown]) !== want) { shown = -1; L.forEach((m, i) => { if (nm(m) === want) shown = i; }); }
    const other = L.reduce((a, m, i) => a + (i === shown ? 0 : Math.max(0, m.dur)), 0);
    rows.push({ s: 'info', keep: other >= 60, notail: true, t: `The recording switched maps. Showing ${D.mapName}, where it spent longest.`, n: D.maps.map((m) => `${m.map} ${fmt(m.dur)}`).join(', then ') });
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
  if (custom.length) rows.push({ s: 'info', tail: 'custom models', t: `Custom models: ${few(custom)}`, n: 'Different from the stock game files. Used as they are; they may look or move slightly differently.' });
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
  if (STALE.size) rows.splice(1, 0, { s: 'warn', t: 'Your Half-Life folder changed after you chose it', n: `${STALE.size} ${STALE.size === 1 ? 'file' : 'files'} couldn't be read, for example ${few([...STALE].map((n) => n.split('/').pop()))}. Choose the folder again to pick up the changes.` });

  const onlyDemo = !map && !OV && !players.found && !sounds.found;
  const anyBad = rows.some((r) => r.s === 'warn' || r.s === 'fail');
  let res;
  if (onlyDemo) {
    rows.splice(STALE.size ? 2 : 1, rows.length, { s: 'warn', t: 'Map, overview, models and sounds: none loaded yet', n: 'The radar uses a plain grid, there is no 3D view, and the demo plays silently.' });
    res = { state: 'warn', title: 'The demo will play, in 2D only', text: 'Only the demo file is loaded. Choose your Half-Life folder to add the map, player models and sounds.', folder: true };
  }
  // the only problem is the file stopping early: say that plainly in the title
  else if (healthRows.some((r) => r.s === 'warn') && !rows.some((r) => (r.s === 'warn' || r.s === 'fail') && !healthRows.includes(r))) res = { state: 'warn', title: 'The demo will play up to where the file stops', text: 'Everything it needs loaded. The file itself is incomplete; what follows says exactly how.' };
  // the one-line card says the demo type too ("Ready: HLTV demo, 27 rounds (2D and 3D)"; Sujan, 19 Nov 2026); the full card
  // has it in its first line, so its title stays "Ready: 27 rounds"
  else if (!anyBad) res = { state: 'ok', title: `Ready: ${plural(live, 'round')}`, lineTitle: `Ready: ${D.pov ? 'POV' : 'HLTV'} demo, ${plural(live, 'round')}${D.povOn ? '' : ' (2D and 3D)'}`, text: '' };
  else res = { state: 'warn', title: 'The demo will play, with a few gaps', text: 'Some files are missing or damaged. Playback works; the parts marked below will look or sound different.', folder: !map || STALE.size > 0 };
  renderSummary(Object.assign(res, { rows, kind: demoKindLine(!!map) }));
}
// The card's first line whenever it's open (Sujan, 19 Nov 2026): which kind of demo it is and which views it has. map: the
// map loaded, so there's a 3D view (without it an HLTV demo plays in 2D only)
function demoKindLine(map) {
  if (D.povOn) return 'You are viewing a POV demo (3D only)';
  // a POV file without the record of the player's view plays like an HLTV demo (Sujan, 19 Nov 2026)
  const a = D.pov ? "a POV demo without the player's view" : 'an HLTV demo';
  return `You are viewing ${a} (${map ? '2D and 3D available' : '2D only, without the map file'})`;
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
  if (h.index === 'extra') return { s: 'info', tail: 'extra bytes after the end', t: `${lead}This file has ${plural(h.extra, 'extra byte')} after its end`, n: 'They come after the index the recorder writes when it stops, so they were added later (by a download or copy, say). The demo is complete and plays in full; the extra bytes are left out.' };
  if (h.index === 'never') return { s: 'warn', t: `${lead}This recording was never finished`, n: `When a recording stops properly, the recorder writes an index at the end of the file, and this file has none: HLTV or the game stopped without closing the file, or it was copied or downloaded while still being written.${tail}${bad} ${plays}` };
  if (h.index === 'past' || h.index === 'short') return { s: 'warn', t: `${lead}This file was cut short`, n: `The recording was finished, but ${h.index === 'past' ? "the index it ends with isn't in the file" : "the index it ends with is only partly in the file"}: the end of the file is missing, usually from an interrupted download or copy.${tail}${bad} ${plays}` };
  return { s: 'warn', t: `${lead}This file's index is damaged`, n: `The index at the end of the file doesn't fit the file, so the frames were read one by one from the start instead.${tail}${bad} ${plays}` };
}

// the card itself (UI review, item 2, 17 Nov 2026): one line at the top of the view while it checks and when everything
// loaded with nothing to say ("Ready: 48 rounds", Details for the list), closing itself after a few seconds; a card in the
// middle of the view with only the notes when there's a note or a button, staying until it's closed, the passed checks
// under Details; the can't-play card, whose closing goes back to the start screen
const SUM = { timer: null, left: 0, total: 0, paused: false, last: 0, back: null, r: null };
function openSummary(o) { renderSummary(Object.assign({ state: 'busy', title: 'Checking your files…', text: 'Looking for the map, models and sounds this demo needs.', rows: [] }, o)); }
// Count the rounds played after a team reached 16 (up to round 30), or stop at 16: remembered per demo
function setCount30(on) {
  if (!D) return;
  // false is kept too, so Stop at 16 holds where the viewer would count them by itself (0.26.21)
  ls.set('count30:' + demoKey(), on ? true : false);
  derive(); buildZoom(); heat = null;
  if (MAP && MAP.name === D.mapName.toLowerCase()) computeWallbangs();
  tlCache.key = ''; renderPane(); drawTimeline(); updateHud(true);
  if (!$('sumCard').hidden) closeSummary();
  const A = M.after16;
  if (A) toast(on ? `Counting the ${A.extra} ${A.extra === 1 ? 'round' : 'rounds'} played after ${M.tnames[A.team]} reached 16. Rounds tab: Stop at 16 to undo.` : `Stopping at 16. Rounds tab: Count them to count the rounds played after.`, 5000);
}
function closeSummary() {
  const el = $('sumCard'); if (el) el.hidden = true; clearInterval(SUM.timer); SUM.timer = null; SUM.closedFor = D;
  // the can't-play card goes back to the start screen, closing a demo that can't be played (UI review, item 2)
  const back = SUM.back; SUM.back = null;
  if (back) { if (back === 'close' && D) closeDemo(); if ($('load').hidden) showLoad(true); }
}
function showFailCard(name, err) {
  ERRLOG.push('Demo read failed: ' + err);
  // A file that isn't cut off or unfinished (those open and play up to where they stop, see fileHealthRow)
  // but still can't be read: say what the reader met, and only suggest checking the game when the file
  // isn't a Half-Life demo at all.
  // plain words on the card; where the reader stopped (the bytes, its message) is in Copy debug info (UI review, item 2)
  const why = /not a half-life demo/i.test(err) ? "It isn't a Half-Life demo file: it doesn't start the way every demo does. Check that it's a .dem recorded in Counter-Strike 1.6."
    : /bad frame type/i.test(err) ? "It's damaged near its start, before the match begins, so nothing after that can be read. Try another copy of the demo."
    : "Part of it is damaged in a way the viewer can't get past. Try another copy of the demo.";
  renderSummary({ state: 'fail', title: "This demo can't be played", text: `${name} couldn't be opened. ${why}`, rows: [] });
}
function renderSummary(r) {
  // closed while it was still checking (×, Esc, or pressing play): don't bring it back for this demo
  // when the check finishes. A demo that can't be played still says so.
  if (SUM.closedFor && SUM.closedFor === D && r.state !== 'fail') return;
  const el = $('sumCard');
  SUM.r = r; SUM.back = r.state === 'fail' ? (r.closeDemo ? 'close' : 'keep') : null;
  const icon = { ok: '✓', warn: '!', fail: '✕', info: 'i', busy: '…' };
  // a line break in a note's text starts a new line (a joined map's parts)
  const md = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  // Only a row with a button, a warning or keep (the map switch of a minute or more, the anti-wallhack note) keeps the full
  // card open (the UI review's final list, item 2; Sujan, 17 and 19 Nov 2026): a note that needs nothing done (custom models,
  // extra bytes after the end, a joined map) goes under Details, with a short tail on the one-line card ("Ready: HLTV demo,
  // 27 rounds (2D and 3D) · custom models"); a quiet row's button (the split-map note with no other part found) is only
  // under Details too, and a notail row has no tail
  const keeps = (x) => x.s === 'warn' || x.s === 'fail' || (!!x.btn && !x.quiet) || !!x.keep;
  const notes = r.rows.filter(keeps), quiet = r.rows.filter((x) => x.s === 'info' && !keeps(x));
  const line = r.state === 'busy' || (r.state === 'ok' && !notes.length && !r.details);
  // a note marked notail (a map switch of under a minute) is only under Details
  const tails = quiet.filter((x) => !x.notail).map((x) => x.tail || x.t);
  // a full card shows its notes; the rest is under Details
  const shown = r.details ? r.rows : r.rows.filter(keeps), hiddenOk = r.rows.length - shown.length;
  el.classList.toggle('line', line);
  if (line) el.innerHTML = `<div class="sum sline ${r.state}" role="status" aria-live="polite">
    <div class="sl"><span class="sum-ic ${r.state === 'busy' ? 'busy' : 'ok'}" aria-hidden="true">${icon[r.state]}</span><span class="slt"><b id="sumTitle">${esc(r.lineTitle || r.title)}</b>${tails.length ? `<span class="slx"> · ${tails.map(md).join(' · ')}</span>` : ''}</span>${r.state === 'busy' ? '' : '<button class="lnk" type="button" id="sumDetails">Details</button>'}<button class="sum-x" type="button" id="sumX" title="Close (Esc)" aria-label="Close">×</button></div>
    ${r.state === 'busy' ? '' : '<div class="sum-bar"><i id="sumBar"></i></div>'}
  </div>`;
  else el.innerHTML = `<div class="sum" role="dialog" aria-live="polite" aria-labelledby="sumTitle">
    <div class="sum-top ${r.state}"><div class="ti">${r.kind ? `<div class="sum-kind" id="sumKind">${esc(r.kind)}</div>` : ''}<h2 id="sumTitle">${esc(r.title)}</h2>${r.text ? `<p>${esc(r.text)}</p>` : ''}</div><button class="sum-x" type="button" id="sumX" title="Close (Esc)" aria-label="Close">×</button></div>
    ${shown.length ? `<ul class="sum-list">${shown.map((x) => `<li><span class="sum-ic ${x.s}" aria-hidden="true">${icon[x.s]}</span><span>${md(x.t)}${x.n ? `<small>${md(x.n)}</small>` : ''}${x.btn ? `<div class="li-btn"><button class="btn sm" type="button" id="${x.btn.id}">${esc(x.btn.label)}</button></div>` : ''}</span></li>`).join('')}</ul>` : ''}
    <div class="sum-foot">${hiddenOk ? `<button class="lnk" type="button" id="sumDetails" title="What loaded: the demo, the map, the overview, models and sounds">Details</button>` : ''}${r.folder ? `<button class="btn" type="button" id="sumFolder">Choose Half-Life folder</button>` : ''}<span class="sp"></span>${r.state === 'fail' ? '<button class="btn primary" type="button" id="sumAnother">Open another demo</button>' : '<button class="btn" type="button" id="sumClose">Close</button>'}</div>
  </div>`;
  el.hidden = false;
  $('sumX').onclick = closeSummary;
  if ($('sumDetails')) $('sumDetails').onclick = () => renderSummary(Object.assign({}, r, { details: true }));
  if ($('sumCount30')) $('sumCount30').onclick = () => setCount30(!M.count30);
  // the other parts found in the folder open the Join card with them; with none found, its picker (Sujan, 19 Nov 2026)
  if ($('sumJoin')) $('sumJoin').onclick = () => { if (SUM.joinList) openJoinCard(SUM.joinList); else openJoinPicker(); };
  if ($('sumFolder')) $('sumFolder').onclick = () => { closeSummary(); pickFolder(); };
  if ($('sumClose')) $('sumClose').onclick = closeSummary;
  // the can't-play card: back to the demo list (closeSummary goes back to the start screen), its search box ready
  if ($('sumAnother')) $('sumAnother').onclick = () => { closeSummary(); const q = $('demoQ'); if (q && !$('load').hidden && q.offsetParent) q.focus(); };
  el.onclick = (e) => { if (e.target === el && r.state !== 'busy' && !line) closeSummary(); };
  clearInterval(SUM.timer); SUM.timer = null;
  const card = el.querySelector('.sum');
  // pause only when the mouse actually moves over the card (it often opens right under a resting cursor)
  SUM.paused = false;
  card.onpointermove = () => { SUM.paused = true; }; card.onpointerleave = () => { SUM.paused = false; };
  if (!line || r.state === 'busy') return;
  // the one-line card closes on its own after a few seconds, paused while the mouse is on it
  SUM.total = SUM.left = 6; SUM.last = performance.now();
  // The bar is animated by the browser, so it shrinks smoothly on every frame instead of in
  // 10-a-second steps. It pauses and resumes with the countdown.
  const bar = $('sumBar');
  SUM.anim = bar && bar.animate ? bar.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: SUM.total * 1000, fill: 'forwards', easing: 'linear' }) : null;
  const tick = () => {
    const now = performance.now(), dt = (now - SUM.last) / 1000; SUM.last = now;
    if (!SUM.paused) SUM.left -= dt;
    if (SUM.left <= 0) { closeSummary(); return; }
    if (SUM.anim) {
      if (SUM.paused && SUM.anim.playState === 'running') SUM.anim.pause();
      else if (!SUM.paused && SUM.anim.playState === 'paused') { SUM.anim.currentTime = (SUM.total - SUM.left) * 1000; SUM.anim.play(); }
    } else if (bar) bar.style.transform = `scaleX(${Math.max(0, SUM.left / SUM.total)})`;
  };
  tick(); SUM.timer = setInterval(tick, 100);
}
