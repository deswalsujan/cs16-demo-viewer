// POV trial (3 Oct 2026): what the viewer does today with a player's own recording. The load summary, the
// recorder (found by his name), whether he can be followed, and how many players the viewer can draw.
(async () => {
  SUM.closedFor = null;
  await loadSummary(Promise.resolve());
  const summary = $('sumCard').innerText.replace(/\n+/g, ' | ');
  closeSummary();
  const ents = Object.keys(D.players).map(Number);
  const rec = ents.find((e) => /optical|deswal|no hacking/i.test((D.players[e] || {}).name || ''));
  const recName = rec != null ? D.players[rec].name : null;
  const inSlots = rec != null && rec in D.slots;
  // players with a position at 40 moments spread over the live rounds
  const counts = [];
  const span = M.liveR.length ? [M.liveR[0].t0 ?? M.liveR[0].start ?? D.start, D.end] : [D.start, D.end];
  for (let i = 1; i <= 40; i++) {
    const t = span[0] + (span[1] - span[0]) * i / 41;
    counts.push(Object.keys(D.slots).filter((e) => { const s = playerState(+e, t); return s && s.state > 0; }).length);
  }
  counts.sort((a, b) => a - b);
  // the Players tab
  const tabRows = [...document.querySelectorAll('#pane .prow, #pane [data-e]')].length;
  // try to follow the recorder in Player's eyes, mid-demo
  seek((D.start + D.end) / 2);
  setView('3d');
  if (rec != null) { selected = null; selectPlayer(rec); }
  setCam('eyes', true);
  const followed = selected; const followedName = selected != null ? (D.players[selected] || {}).name : null;
  const recState = rec != null ? playerState(rec, T) : null;
  let zero = 0, alive = 0;
  if (rec != null) for (let i = 1; i <= 200; i++) { const t = D.start + (D.end - D.start) * i / 201; const s = playerState(rec, t); if (s && s.state > 0) { alive++; if (!s.x && !s.y && !s.z) zero++; } }
  return {
    demo: D.fileName, map: D.mapName, pov: D.pov, length: ((D.end - D.start) / 60).toFixed(1) + ' min',
    rounds: M.rounds.length, liveRounds: M.liveR.length, kills: D.kills.length,
    score: [...document.querySelectorAll('#score .num')].map((x) => x.textContent).join(':'),
    playersNamed: ents.length, playersWithTrack: Object.keys(D.slots).length,
    recorder: recName, recorderEntity: rec, recorderHasTrack: inSlots, recorderStateMidDemo: recState, recorderAtZeroWhileAlive: zero + ' of ' + alive,
    followedAfterPickingRecorder: followedName, followsRecorder: followed === rec,
    alivePlayersDrawn: { min: counts[0], median: counts[20], max: counts[39] },
    playersTabRows: tabRows, summary,
  };
})()
