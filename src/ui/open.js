// ---------------- demo parsing (web worker) ----------------
let worker = null;
function makeWorker() {
  const src = $('parserSrc').textContent.replace(/^export\s+/m, '');
  const code = src + `
self.onmessage = (e) => {
  try {
    const d = parseDemo(new Uint8Array(e.data), (p) => self.postMessage({ progress: p }));
    const bufs = [d.times.buffer]; for (const k in d.slots) bufs.push(d.slots[k].buffer);
    self.postMessage({ done: d }, bufs);
  } catch (err) { self.postMessage({ error: err.message || String(err) }); }
};`;
  return new Worker(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })));
}

async function loadDemoFile(f, opts = {}) {
  // a part of a map joined before: open the joined map, when every part is still in the folder
  const js = !opts.alone && joinedSetOf(f.name);
  if (js) {
    const list = js.set.map((n) => n === f.name ? f : (files && files.demos || []).find((x) => x.name === n));
    if (list.every(Boolean)) { CUR_FILE = f; return openJoinedUI(list); }
  }
  CUR_FILE = f;
  setMsg(`Reading ${f.name}…`);
  $('prog').hidden = false; $('progBar').style.width = '2%';
  let buf;
  try { buf = await f.arrayBuffer(); }
  catch (e) {
    $('prog').hidden = true;
    if (isStale(e)) {
      // the file was moved, renamed or deleted after the folder was chosen: say so, and drop it from the list
      files.demos = files.demos.filter((x) => x !== f); renderDemoList();
      // The browser can't read a file that changed after the folder was read: a demo still being recorded
      // keeps growing, so it lands here as well as one that was moved, renamed or deleted.
      setMsg(`${f.name} couldn't be read. It changed after the folder was read, or it was moved, renamed or deleted. If you're still recording it, stop the recording first. Then ${HL.handle ? 'come back to this page' : 'choose the folder again'} and open it from the list.`, true);
    } else setMsg(`Could not read ${f.name}. ${e.message || ''}`, true);
    return;
  }
  if (worker) worker.terminate();
  worker = makeWorker();
  worker.onmessage = async (e) => {
    const m = e.data;
    if (m.progress != null) { $('progBar').style.width = (m.progress * 100).toFixed(0) + '%'; return; }
    if (m.error) { setMsg('This file could not be read as a CS 1.6 demo: ' + m.error, true); $('prog').hidden = true; showFailCard(f.name, m.error); return; }
    if (m.done) {
      worker.terminate(); worker = null;
      $('progBar').style.width = '100%';
      resetForNewDemo();
      D = m.done; D.fileName = f.name;
      if (MAP && MAP.name !== (D.mapName || '').toLowerCase()) { MAP = null; clear3d(); }
      await onDemo();
    }
  };
  worker.onerror = (e) => { setMsg('The demo reader crashed: ' + (e.message || 'unknown error'), true); };
  worker.postMessage(buf, [buf]);
}

// ---------------- a map recorded in parts ----------------
// HLTV often splits one map into two or three files (Xperia Play 2011 FX vs mTw: Inferno and Nuke, two
// files each). Joining puts them on one timeline: each part's times are shifted to follow the one before,
// with a short gap; the files' own numbering of models, sounds and events is translated into one list;
// rounds and connections are renumbered. A restart is marked where each file starts, so the counting rules
// see a new stretch there. Everything downstream (rounds, stats, the 3D view, playback) then works across
// the parts unchanged. Players are matched across files by Steam ID (see derive).
const JOIN_GAP = 3; // seconds of nothing between two parts on the joined timeline
function joinDemos(parts) {
  const S = parts[0].stride;
  const out = Object.assign({}, parts[0], {
    kills: [], rounds: [], bomb: [], chat: [], nades: [], roundTimes: [], pauses: [], occupants: [], notes: [], radio: [], centre: [], corpses: [], viewers: [],
    models: Object.assign({}, parts[0].models), sounds: Object.assign({}, parts[0].sounds), events: Object.assign({}, parts[0].events), pmodels: parts[0].pmodels.slice(),
    players: {}, errors: 0, errSamples: [], parts: [], maps: parts[0].maps, health: null, slow: [],
  });
  // one shared numbering for a file's resource list ({ index: name }): same name, same number
  const unify = (dst, src) => {
    const byName = {}; let next = 0;
    for (const k in dst) { byName[dst[k]] = +k; next = Math.max(next, +k + 1); }
    const map = {};
    for (const k in src) { const nm = src[k]; if (byName[nm] == null) { byName[nm] = next; dst[next++] = nm; } map[k] = byName[nm]; }
    return (i) => (map[i] != null ? map[i] : i);
  };
  const timesL = [], slotsL = {}, hpL = [], packL = [], brushEvL = [], brushPoseL = [], sndsL = [], shotsL = [], boomsL = [], puffsL = [], c4L = [];
  // POV mode (0.25.0): the parts' POV data on the joined timeline, when every part is a POV demo. recs: for each part,
  // its first sample, its number of samples and the recording player's entity there
  const povL = parts.every((P) => P.povData) ? { view: [], ownPos: [], hpInfo: [], shotOrg: [], fovs: [], ownAmmo: [], wanims: [], vmodels: [], obs: [], hud: { hp: [], ap: [], helmet: [], money: [], ammox: [] }, gunAmmo: {}, recs: [] } : null;
  let shift = 0, nRound = 0, nOcc = 0, nSamples = 0;
  parts.forEach((P, pi) => {
    if (pi) shift = (out.end) + JOIN_GAP - P.start;
    const sh = (t) => t + shift;
    const mM = pi ? unify(out.models, P.models) : (i) => i;
    const mS = pi ? unify(out.sounds, P.sounds) : (i) => i;
    const mE = pi ? unify(out.events, P.events) : (i) => i;
    const pmMap = P.pmodels.map((nm) => { let k = out.pmodels.indexOf(nm); if (k < 0) { k = out.pmodels.length; out.pmodels.push(nm); } return k; });
    // rounds: a round the file starts partway into (kills before its first marker) becomes a round of its own
    const roundMap = {};
    const lead = leadingRound(P.kills.filter((k) => k.round === 0), P.rounds[0], P.start, 0);
    const prs = lead ? [lead, ...P.rounds] : P.rounds;
    const firstRound = nRound + 1;
    // Rounds played between two recordings, in neither file: a later part whose scoreboard already shows more
    // rounds at its first marker than the round it starts partway into. They count in the score (the side
    // that won each comes from the scoreboard), not in player stats, and sit just after the part's restart.
    // (counted from the part's own live rounds by openJoined, see liveStart)
    const missT = pi && P.joinMiss ? P.joinMiss.T : 0, missCT = pi && P.joinMiss ? P.joinMiss.CT : 0;
    for (let i = 0; i < missT + missCT; i++) {
      const t = sh(P.start) - 0.4 + i * 0.02;
      out.rounds.push({ n: ++nRound, start: t, end: t + 0.01, endT: null, winner: i < missT ? 'T' : 'CT', reason: 'not in any file', scoreT: null, scoreCT: null, missing: true, part: pi });
    }
    for (const r of prs) { roundMap[r.n] = ++nRound; out.rounds.push(Object.assign({}, r, { n: nRound, start: sh(r.start), end: r.end != null ? sh(r.end) : null, endT: r.endT != null ? sh(r.endT) : null, part: pi, partFirst: pi > 0 && r === prs[0] })); }
    if (!lead) roundMap[0] = 0;
    for (const k of P.kills) out.kills.push(Object.assign({}, k, { t: sh(k.t), round: roundMap[k.round] != null ? roundMap[k.round] : 0, kocc: k.kocc >= 0 ? k.kocc + nOcc : -1, vocc: k.vocc >= 0 ? k.vocc + nOcc : -1, tMsg: undefined, tPos: undefined }));
    for (const o of P.occupants) out.occupants.push(Object.assign({}, o, { id: o.id + nOcc, from: sh(o.from), to: sh(o.to != null ? o.to : P.end), nameT: (o.nameT || []).map(([t, nm]) => [sh(t), nm]) }));
    nOcc += P.occupants.length;
    for (const b of P.bomb) out.bomb.push(Object.assign({}, b, { t: sh(b.t), round: b.round != null ? (roundMap[b.round] || 0) : b.round }));
    // a new file is a new stretch: mark a restart just before it starts
    if (pi) out.bomb.push({ t: sh(P.start) - 0.5, type: 'restart', partStart: pi });
    const tl = (a) => a.map((x) => Object.assign({}, x, { t: sh(x.t) }));
    out.chat.push(...tl(P.chat)); out.roundTimes.push(...tl(P.roundTimes)); out.pauses.push(...tl(P.pauses)); out.notes.push(...tl(P.notes)); out.radio.push(...tl(P.radio)); out.centre.push(...tl(P.centre || []));
    out.corpses.push(...P.corpses.map((c) => Object.assign({}, c, { t: sh(c.t), start: sh(c.start) })));
    out.nades.push(...P.nades.map((g) => { const pts = g.pts.slice(); for (let i = 0; i < pts.length; i += 4) pts[i] = sh(pts[i]); return Object.assign({}, g, { pts }); }));
    for (let i = 0; i < (P.viewers || []).length; i += 2) out.viewers.push(sh(P.viewers[i]), P.viewers[i + 1]);
    const flat = (src, stride, fix, dst) => { const a = new Float32Array(src.length); for (let i = 0; i < src.length; i += stride) { for (let j = 0; j < stride; j++) a[i + j] = src[i + j]; fix(a, i); } dst.push(a); };
    flat(P.hp, 3, (a, i) => { a[i] = sh(a[i]); }, hpL);
    flat(P.pack || [], 3, (a, i) => { a[i] = sh(a[i]); }, packL);
    flat(P.brushEvents, 3, (a, i) => { a[i] = sh(a[i]); }, brushEvL);
    flat(P.brushPose, 8, (a, i) => { a[i] = sh(a[i]); }, brushPoseL);
    flat(P.snds, 10, (a, i) => { a[i] = sh(a[i]); a[i + 1] = mS(a[i + 1]); }, sndsL);
    flat(P.shots, 4, (a, i) => { a[i] = sh(a[i]); a[i + 2] = mE(a[i + 2]); }, shotsL);
    flat(P.booms, 4, (a, i) => { a[i] = sh(a[i]); }, boomsL);
    flat(P.puffs, 5, (a, i) => { a[i] = sh(a[i]); }, puffsL);
    flat(P.c4drops || [], 5, (a, i) => { a[i] = sh(a[i]); a[i + 1] = sh(a[i + 1]); }, c4L);
    for (const [a, b, v] of P.slow || []) out.slow.push([sh(a), sh(b), v]);
    if (povL) {
      const Q = P.povData, t0 = (a, i) => { a[i] = sh(a[i]); };
      flat(Q.view, Q.viewStride, t0, povL.view); flat(Q.ownPos, 4, () => {}, povL.ownPos); flat(Q.hpInfo, 3, t0, povL.hpInfo);
      flat(Q.shotOrg, 3, () => {}, povL.shotOrg); flat(Q.fovs, 2, t0, povL.fovs); flat(Q.ownAmmo, 3, t0, povL.ownAmmo);
      flat(Q.wanims, 2, t0, povL.wanims); flat(Q.vmodels, 2, (a, i) => { a[i] = sh(a[i]); a[i + 1] = mM(a[i + 1]); }, povL.vmodels); flat(Q.obs, 3, t0, povL.obs);
      for (const k in povL.hud) flat(Q.hud[k], k === 'ammox' ? 3 : 2, t0, povL.hud[k]);
      Object.assign(povL.gunAmmo, Q.hud.gunAmmo);
      povL.recs.push([nSamples, P.times.length, P.serverInfo ? P.serverInfo.playerIndex + 1 : 0]);
    }
    // player samples: every slot gets an entry for every sample time (empty where the slot isn't in this part)
    const n = P.times.length, tt = new Float32Array(n);
    for (let i = 0; i < n; i++) tt[i] = sh(P.times[i]);
    timesL.push(tt);
    const allSlots = new Set([...Object.keys(slotsL), ...Object.keys(P.slots)]);
    for (const e of allSlots) {
      if (!slotsL[e]) { slotsL[e] = []; if (nSamples) { const pad = new Float32Array(nSamples * S); for (let i = 0; i < nSamples; i++) pad[i * S] = pad[i * S + 1] = pad[i * S + 2] = NaN; slotsL[e].push(pad); } }
      const src = P.slots[e];
      const a = new Float32Array(n * S);
      if (src) { a.set(src); for (let i = 0; i < n; i++) { const o = i * S; if (a[o + 6]) a[o + 6] = mM(a[o + 6]); a[o + 8] = pmMap[a[o + 8]] != null ? pmMap[a[o + 8]] : a[o + 8]; } }
      else for (let i = 0; i < n; i++) a[i * S] = a[i * S + 1] = a[i * S + 2] = NaN;
      slotsL[e].push(a);
    }
    nSamples += n;
    Object.assign(out.players, P.players);
    out.errors += P.errors || 0; out.errSamples.push(...(P.errSamples || []));
    out.parts.push({ fileName: P.fileName, health: P.health, dur: P.end - P.start, start: sh(P.start), end: sh(P.end), firstRound, missing: missT + missCT, partway: !!lead, startsLate: !!lead || (P.rounds[0] && (P.rounds[0].scoreT || 0) + (P.rounds[0].scoreCT || 0) > 0), scoreAtStart: P.rounds[0] ? [P.rounds[0].scoreT || 0, P.rounds[0].scoreCT || 0] : [0, 0] });
    out.end = sh(P.end);
  });
  const cat = (L) => { let len = 0; for (const a of L) len += a.length; const r = new Float32Array(len); let o = 0; for (const a of L) { r.set(a, o); o += a.length; } return r; };
  out.times = cat(timesL);
  out.slots = {}; for (const e in slotsL) out.slots[e] = cat(slotsL[e]);
  out.povData = povL ? {
    view: cat(povL.view), viewStride: parts[0].povData.viewStride, ownPos: cat(povL.ownPos), hpInfo: cat(povL.hpInfo), shotOrg: cat(povL.shotOrg), fovs: cat(povL.fovs),
    ownAmmo: cat(povL.ownAmmo), wanims: cat(povL.wanims), vmodels: cat(povL.vmodels), obs: cat(povL.obs), recs: povL.recs,
    hud: Object.assign(Object.fromEntries(Object.keys(povL.hud).map((k) => [k, cat(povL.hud[k])])), { gunAmmo: povL.gunAmmo }),
  } : null;
  out.pack = cat(packL); out.hp = cat(hpL); out.brushEvents = cat(brushEvL); out.brushPose = cat(brushPoseL); out.snds = cat(sndsL); out.shots = cat(shotsL); out.booms = cat(boomsL); out.puffs = cat(puffsL); out.c4drops = cat(c4L);
  out.bomb.sort((a, b) => a.t - b.t);
  out.start = parts[0].start;
  out.fileName = parts[0].fileName;
  out.joinKey = parts.map((P) => P.fileName).join('|');
  out._even = null;
  return out;
}

// Read a demo file in a worker of its own and hand back the parsed demo (for joining parts; the demo being
// opened normally goes through loadDemoFile). onProgress gets 0..1.
function parseInWorker(f, onProgress) {
  return new Promise(async (res, rej) => {
    let buf;
    try { buf = await f.arrayBuffer(); } catch (e) { rej(e); return; }
    const w = makeWorker();
    w.onmessage = (e) => {
      const m = e.data;
      if (m.progress != null) { if (onProgress) onProgress(m.progress); return; }
      w.terminate();
      if (m.error) rej(new Error(m.error)); else { m.done.fileName = f.name; res(m.done); }
    };
    w.onerror = (e) => { w.terminate(); rej(new Error(e.message || 'the demo reader crashed')); };
    w.postMessage(buf, [buf]);
  });
}
// Open the parts of a map as one demo, in the order given (a list of files from the folder). parsed: the parts
// already read (the Join card reads them to check them), in the same order, so they aren't read twice.
async function openJoined(list, onProgress, parsed) {
  const parts = [];
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    // read afresh even if it's the demo already open: opening a demo adjusts its kills in place
    parts.push(parsed && parsed[i] ? parsed[i] : await parseInWorker(f, (p) => onProgress && onProgress((i + p) / list.length)));
  }
  // each part counted on its own first, for the rounds played between two recordings (see liveStart)
  for (const P of parts) { const f = partFacts(P); P.joinMiss = { T: f.missT, CT: f.missCT }; }
  const J = joinDemos(parts);
  J.partFiles = list.slice();
  resetForNewDemo();
  D = J;
  if (MAP && MAP.name !== (D.mapName || '').toLowerCase()) { MAP = null; clear3d(); }
  await onDemo();
}
