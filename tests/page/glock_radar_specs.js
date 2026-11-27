// 0.27.7 (tests/logs/0.27.7.md): the Glock's gun in Player's eyes, the POV radar's dot size and the Tab scoreboard's
// spectators. Run with tests/harness.py on any demo; on SK vs Na`Vi, Train, DreamHack Winter 2011 it also checks starix's
// R1 shots against what the rule expects (only 0:29 to 0:26 is confirmed against markeloff's POV; the rest is the rule's).
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const out = { version: typeof VERSION_TEXT !== 'undefined' ? VERSION_TEXT : null };
  setView('3d'); await wait(1500);
  const sh = fxShots();
  // every player's Glock shots, grouped by frame, with the animation the view model plays just after each frame
  const nameOf = (mdl, an) => (an && mdl.seqs[an.seq] ? mdl.seqs[an.seq].name : null);
  async function gunModel(e, t) {
    selected = e; playing = false; setCam('eyes', true); T = t; await frames();
    for (let i = 0; i < 40 && !(getModel('models/v_glock18.mdl') || {}).mdl; i++) { await wait(150); await frames(); }
    return (getModel('models/v_glock18.mdl') || {}).mdl;
  }
  const glockBy = {};
  for (let i = 0; i < sh.length; i += 4) if (eventName(sh[i + 2]) === 'glock18' && sh[i + 1] >= 1 && sh[i + 1] <= 64) (glockBy[sh[i + 1]] || (glockBy[sh[i + 1]] = [])).push(sh[i]);
  // the whole demo: three shots within 0.12 s against what the gun plays
  let threes = 0, shownBurst = 0, singlesShownBurst = 0, framesSeen = 0, mdl = null;
  for (const e in glockBy) {
    const ts = glockBy[e];
    if (!mdl) mdl = await gunModel(+e, ts[0] + 0.02);
    if (!mdl) break;
    for (let k = 0; k < ts.length; k++) {
      if (k + 1 < ts.length && ts[k + 1] === ts[k]) continue; // the frame's last shot
      const inThree = [[k - 2, k], [k - 1, k + 1], [k, k + 2]].some(([a, b]) => a >= 0 && b < ts.length && ts[b] - ts[a] <= 0.12);
      const s = playerState(+e, ts[k] + 0.02); if (!s || s.state <= 0 || !/glock18/.test(s.weapon || '')) continue;
      const nm = nameOf(mdl, vmAnim(mdl, +e, ts[k] + 0.02)); framesSeen++;
      if (inThree) { threes++; if (nm === 'shoot') shownBurst++; } else if (nm !== 'shoot3') singlesShownBurst++;
    }
  }
  out.glock = { framesSeen, framesInThrees: threes, threesShownAsBurst: shownBurst, otherFramesNotShoot3: singlesShownBurst };
  // starix in R1 of SK vs Na`Vi, Train, DreamHack Winter 2011 (demo time: R1 went live at 541.72 s)
  const starix = Object.keys(D.players).map(Number).find((e) => /Na`Vi starix/.test((D.players[e] || {}).name || ''));
  if (starix && /de_train/.test(D.mapName) && glockBy[starix]) {
    const clock = (t) => { const r = 105 - (t - 541.717); return `${Math.floor(r / 60)}:${String(Math.floor(r % 60)).padStart(2, '0')}`; };
    const want = (c) => (['1:40', '0:37', '0:36', '0:34', '0:33', '0:29', '0:27', '0:26'].includes(c) ? 'shoot' : 'shoot3');
    const rows = [], ts = glockBy[starix].filter((t) => t > 541 && t < 640);
    for (let k = 0; k < ts.length; k++) {
      if (k + 1 < ts.length && ts[k + 1] === ts[k]) continue;
      const c = clock(ts[k]), got = nameOf(mdl, vmAnim(mdl, starix, ts[k] + 0.02));
      rows.push({ t: +ts[k].toFixed(2), clock: c, got, want: want(c), ok: got === want(c) });
    }
    // a burst plays on without restarting: 0.25 s after the 0:29 burst, still 'shoot', 10 frames in
    const b29 = rows.find((r) => r.clock === '0:29'), mid = b29 ? vmAnim(mdl, starix, b29.t + 0.25) : null;
    out.starixR1 = { frames: rows.length, wrong: rows.filter((r) => !r.ok), midBurst: mid ? { seq: nameOf(mdl, mid), frame: +mid.frame.toFixed(1) } : null };
  }
  // POV mode: the recorder's own Glock bursts (from his clip), and the radar's dots: 2 of 128 units at 768 lines
  if (POV.on) {
    const B = D.ownBurst || [], S = D.ownShots || [];
    let glock = 0, burst = 0; for (let k = 0; k < S.length / 3; k++) if (S[k * 3 + 1] === 17) { glock++; if (!Number.isNaN(B[k])) burst++; }
    out.povOwnGlock = { shots: glock, inBursts: burst };
    const sizes = new Set(), orig = CanvasRenderingContext2D.prototype.fillRect;
    const bg = document.createElement('canvas').getContext('2d'), lx = document.createElement('canvas').getContext('2d');
    lx.fillRect = function (x, y, w, h) { sizes.add(`${+w.toFixed(2)}x${+h.toFixed(2)}`); return orig.call(this, x, y, w, h); };
    let n = 0;
    for (const r of M.liveR) { T = r.start + 20; POV.t = T; try { drawPovRadar(bg, lx, 1024, 768); } catch (e) { out.radarError = String(e); } if (sizes.size && ++n > 3) break; }
    out.radarMarkSizesAt768 = [...sizes];
  }
  // the Tab scoreboard: the spectators one per line, under a line
  const r = M.liveR[Math.min(M.liveR.length - 1, 5)]; T = r.start + 10; showScoreboard(true); await wait(400);
  const sb = $('sb');
  out.scoreboard = { line: !!sb.querySelector('.tline.spec'), spectatorRows: sb.querySelectorAll('.specs > div').length, text: (sb.querySelector('.specs') || {}).innerText || '' };
  showScoreboard(false);
  return out;
})()
