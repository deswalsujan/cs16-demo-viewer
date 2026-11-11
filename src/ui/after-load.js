// ---------------- after load ----------------
// POV mode (0.25.0, Sujan 29 Oct 2026): the setting is on, and this is a demo recorded by a player with the view block
// his game writes. Then, before anything reads the demo (retimeKills, the wallbang finder, the picture check), his own
// position goes into his track and into the kills by or on him: the snapshots never carry it, so with POV mode off he
// stands at the map's zero point, as in 0.24.0. The rest of POV mode's data is put on D for the 3D view.
function povApply() {
  const P = D.povData;
  D.povOn = !!($('pov3').checked && D.pov && P && P.view.length >= P.viewStride * 2);
  if (!D.povOn) return;
  Object.assign(D, P);
  const S = D.stride, recs = P.recs || [[0, D.times.length, D.serverInfo ? D.serverInfo.playerIndex + 1 : 0]];
  for (const [from, n, e] of recs) {
    const a = D.slots[e]; if (!a) continue;
    for (let i = from; i < from + n; i++) {
      const o = i * 4, q = i * S;
      if (!Number.isFinite(P.ownPos[o]) || Number.isNaN(a[q])) continue;
      a[q] = P.ownPos[o]; a[q + 1] = P.ownPos[o + 1]; a[q + 2] = P.ownPos[o + 2]; a[q + 7] = P.ownPos[o + 3];
    }
  }
  for (const k of D.kills) {
    if (k.kOwn) { k.kpos = k.kOwn.slice(0, 3); k.kduck = k.kOwn[3]; }
    if (k.vOwn) { k.vpos = k.vOwn.slice(0, 3); k.vduck = k.vOwn[3]; }
  }
}
// What each kind of demo offers (POV mockup round, docs/pov-mockup-round-mock.jpg, section 1; Sujan, 3 Nov 2026,
// approved 11 Nov 2026): one list, read by the header, the 3D bar, View settings, the side panel and the load summary.
// What a demo doesn't have is hidden, not greyed out. A POV demo in POV mode has only 3D and only his own view (his
// game only received the players near him), no Reset view (there's no camera of the viewer's to reset), and its Kills
// tab lists his own kills and deaths; its Wallbangs tab goes on a server that held enemies back, and lists only his
// own wallbangs otherwise (Sujan, 9 Nov 2026). The POV mode row of View settings shows only with a POV demo open (or
// none), since it does nothing to an HLTV demo (Sujan, 10 Nov 2026), until the setting is dropped at the sign-off.
function demoOffers() {
  const pov = !!(D && D.povOn);
  return {
    views: pov ? ['3d'] : ['2d', '3d', 'split'],
    cameras: pov ? ['eyes'] : ['free', 'eyes', 'behind'],
    resetView: !pov,
    povSetting: !D || !!D.pov,
    crosshairSize: !pov, glowOnHits: !pov, damageNumbers: !pov,
    killsTab: pov ? 'his' : 'round',
    wallbangsTab: pov ? (typeof povHidesEnemies === 'function' && POV.on && povHidesEnemies().on ? null : 'his') : 'all',
    noticesTop: pov,
  };
}
function applyOffers() {
  const of = demoOffers();
  $('viewSeg').hidden = of.views.length < 2;
  $('tgFit').hidden = !of.resetView;
  $('pov3').closest('.vrow').hidden = !of.povSetting;
  { const h = $('pov3').closest('.vrow').previousElementSibling; if (h && h.classList.contains('vhead')) h.hidden = !of.povSetting; }
  const wb = document.querySelector('.tabs button[data-tab="wb"]');
  wb.hidden = !of.wallbangsTab;
  if (!of.wallbangsTab && tab === 'wb') document.querySelector('.tabs button[data-tab="kills"]').click();
  $('radar').classList.toggle('povm', of.noticesTop);
  if (typeof povMarkInit === 'function') povMarkInit();
}
// The POV mode setting is read when a demo opens, so changing it with a POV demo open opens that demo again, at the
// same moment (REOPEN_T)
let REOPEN_T = null;
function reopenForPov() {
  if (!D || !D.pov) return;
  REOPEN_T = T;
  if (D.partFiles) openJoinedUI(D.partFiles);
  else if (CUR_FILE) loadDemoFile(CUR_FILE, { alone: true });
}
async function onDemo() {
  povApply();
  derive();
  OV = null;
  const ok = await tryLoadOverview(D.mapName);
  $('prog').hidden = true;
  showLoad(false);
  const first = M.liveR[0];
  T = first ? first.start : D.start;
  if (REOPEN_T != null) { T = Math.max(D.start, Math.min(D.end, REOPEN_T)); REOPEN_T = null; }
  playing = false; selected = null; pickedKill = null; pickedBurst = null;
  $('meta').textContent = D.parts ? `${D.mapName} · ${D.parts[0].fileName} and ${plural(D.parts.length - 1, 'more file')} · ${fmt(D.end - D.start)}` : `${D.mapName} · ${D.fileName} · ${fmt(D.end - D.start)}`;
  const chip = $('partsChip');
  chip.onclick = () => { const b = document.querySelector('.tabs button[data-tab="rounds"]'); if (b) b.click(); $('pane').scrollTop = 0; };
  chip.hidden = !D.parts; if (D.parts) { chip.textContent = `${D.parts.length} files`; chip.title = 'One map joined from ' + D.parts.map((p) => p.fileName).join(', then ') + '. Rounds tab: Split them to undo.'; }
  $('score').hidden = false; $('legend').hidden = false; $('heatbar').hidden = false; $('rclock').hidden = false;
  $('tnA').textContent = M.tnames[0]; $('tnB').textContent = M.tnames[1];
  heat = null; $('hmMode').value = 'off';
  afterOverview(ok, true);
  M.wbs = [];
  buildHp(); buildPack(); buildBrk(); buildPose(); prepAnim(); buildZoom();
  const sndDone = preloadSounds();
  renderPane(); fitView(); drawTimeline(); updateHud(true);
  if (MAP && MAP.name === D.mapName.toLowerCase()) computeWallbangs();
  else { MAP = null; clear3d(); loadMap(D.mapName); }
  resetCam3();
  povInit();
  applyOffers();
  { const of = demoOffers(); setView(of.views.includes(viewPref) ? viewPref : of.views[0], false); }
  loadSummary(sndDone);
}
function afterOverview(ok, quiet) {
  if (ok === true || OV) setMsg('');
  if (!OV && !quiet) {
    toast(`No overview found for ${D.mapName}. Showing positions on a plain grid. Drop overviews/${D.mapName}.bmp and .txt here to add it.`);
  }
  heat = null; fitView();
}
let toastTimer = null;
function toast(t, ms = 9000) {
  let el = $('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'rclock'; el.style.cssText = 'top:auto;bottom:calc(56px * var(--ui));left:calc(12px * var(--ui));right:calc(12px * var(--ui));max-width:calc(520px * var(--ui));color:var(--fg)'; $('radar').appendChild(el); }
  el.textContent = t; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, ms);
  if (typeof placeHiddenNote === 'function') placeHiddenNote(); // POV mode: the anti-wallhack note sits under it
}
// Back to how the page looks before any demo is opened. Used by Clear saved files: it forgets the folder,
// so the open demo has nothing left to draw from, and the header, side panel and timeline shouldn't keep
// showing a match that's no longer open.
function closeDemo() {
  if (!D) return;
  $('cmsg').hidden = true;
  if (worker) { worker.terminate(); worker = null; }
  sndPreload++; // stops a sound preload that's still running for this demo
  resetForNewDemo(); clear3d(); closeSummary(); if ($('joinCard')) closeJoinCard();
  D = null; M = null; MAP = null; OV = null; T = 0; prevT = null; pickedKill = null; pickedBurst = null; heat = null;
  $('meta').textContent = 'CS 1.6 HLTV demos, played in your browser';
  for (const id of ['score', 'legend', 'heatbar', 'rclock', 'cam3', 'status3', 'pov', 'sb']) $(id).hidden = true;
  $('feed').innerHTML = '';
  $('pane').innerHTML = '<div class="opt">Rounds, kills and player stats appear here once a demo is open.</div>';
  $('time').innerHTML = '<b>0:00</b> / 0:00';
  tlCache.key = ''; tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.clearRect(0, 0, tlc.width, tlc.height);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
  setControls(false);
  applyOffers();
}
function showLoad(v) {
  $('load').hidden = !v;
  applyTheatre(); // the start screen needs the header, so Theatre mode pauses while it's open
  // the load summary goes at once rather than counting down behind the start screen (Sujan, 14 Oct 2026).
  // The message line starts empty each time the start screen comes back, whether or not an overview loaded: up to
  // 0.26.11 "Reading name…" stayed there after a demo whose map has no overview (Sujan, 3 Nov 2026). checkDemoList
  // runs after, so its note on a demo deleted since the pick still shows.
  if (v) { playing = false; setPlayIcon(); $('prog').hidden = true; setMsg(''); if (D && $('sumCard') && !$('sumCard').hidden) closeSummary(); checkDemoList(); }
  setControls(!v && !!D);
}
// Everything that needs a demo stays disabled until one is loaded (Shortcuts always works)
function setControls(on) {
  const ids = ['bPrevR', 'bBack', 'bPlay', 'bFwd', 'bNextR', 'bScope', 'bTheatre', 'bFull'];
  for (const id of ids) $(id).disabled = !on;
  document.querySelectorAll('#speeds button, #viewSeg button, .tabs button').forEach((b) => b.disabled = !on);
  $('tl').classList.toggle('off', !on);
  $('btnOpen').hidden = !D; // nothing to go "back" to until a demo has been opened once
  if (D && !on) $('btnOpen').textContent = 'Back to the demo';
  else $('btnOpen').textContent = 'Open another demo';
}
