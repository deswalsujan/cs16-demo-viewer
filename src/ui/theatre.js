// ---------------- Theatre mode ----------------
// The view fills the window. The header, side panel and bottom bar float over it and all slide in
// together when the mouse moves to the top, right or bottom edge, laid out as in the normal view. They
// stay while the mouse is on any of them and hide shortly after it moves away; at an edge but not on a
// bar, they hide after 2 seconds without the mouse moving. Nothing slides in while you drag to look
// around or pan the radar, and the view never changes size when they appear.
// Edge zones are in page pixels, so they work the same on a Retina Mac and on Windows at any scaling.
const TH_PANELS = { t: () => [$('app').querySelector('.head'), $('cam3')], r: () => [$('side')], b: () => [$('app').querySelector('.transport'), $('legend'), $('heatbar')] };
const TH_ZONE = { t: 64, r: 44, b: 96 }; // how close to each edge the mouse must come, in page pixels
function theatreActive() { return TH.on && !!D && $('load').hidden; }
function setTheatre(on) {
  TH.on = !!on;
  applyTheatre();
  // the first time in each: full screen names itself and how to leave it, since T doesn't (Sujan, 23 Oct 2026:
  // choosing Full screen first showed the Theatre mode note)
  const fs = !!document.fullscreenElement, key = fs ? 'hintFs' : 'hint';
  if (theatreActive() && !TH[key]) { TH[key] = true; toast(fs ? 'Full screen. Move the mouse to the top, right or bottom edge for the controls. F or Esc leaves it.' : 'Theatre mode. Move the mouse to the top, right or bottom edge for the controls. T leaves it.', 4500); }
}
function applyTheatre() {
  const app = $('app'), act = theatreActive();
  const was = app.classList.contains('theatre');
  app.classList.toggle('theatre', act);
  $('bTheatre').classList.toggle('on', act);
  $('bTheatre').textContent = act ? 'Exit theatre' : 'Theatre';
  if (!act) { app.classList.remove('show-t', 'show-r', 'show-b', 'idle'); for (const k in TH.timers) clearTimeout(TH.timers[k]); clearTimeout(TH.idle); }
  else measureTheatre();
  if (was !== act) requestAnimationFrame(() => { resize(); resize3(); measureTheatre(); });
}
// the floating bars' sizes, so the on-view display can move out of their way
function measureTheatre() {
  const app = $('app');
  app.style.setProperty('--head-h', app.querySelector('.head').offsetHeight + 'px');
  app.style.setProperty('--tr-h', app.querySelector('.transport').offsetHeight + 'px');
}
function thShow(k, on) { $('app').classList.toggle('show-' + k, on); }
function thShown(k) { return $('app').classList.contains('show-' + k); }
// the mouse is over one of this edge's panels (or a menu from it is open)
function thOver(k, target) {
  const els = TH_PANELS[k]().filter(Boolean);
  if (target && els.some((el) => el.contains(target))) return true;
  const a = document.activeElement;
  if (k === 't' && !$('vsetPanel').hidden) return true; // View settings is open
  return !!(a && a.tagName === 'SELECT' && els.some((el) => el.contains(a)));
}
// what's under the pointer right now: a bar can slide in under a mouse that isn't moving
function thUnder() { return TH.x >= 0 ? document.elementFromPoint(TH.x, TH.y) : null; }
function thInZone(k, x, y) {
  if (k === 't') return y <= TH_ZONE.t;
  if (k === 'b') return y >= innerHeight - TH_ZONE.b;
  return x >= innerWidth - TH_ZONE.r;
}
// All three come in and go out together, so Theatre mode is simply the normal layout, hidden until needed
const TH_KEYS = ['t', 'r', 'b'];
function thShowAll(on) { if (on) measureTheatre(); for (const k of TH_KEYS) thShow(k, on); }
const thOverAny = (target) => TH_KEYS.some((k) => thOver(k, target));
function thUpdate(target) {
  const over = thOverAny(target);
  const want = over || (!TH.drag && TH.x >= 0 && TH_KEYS.some((k) => thInZone(k, TH.x, TH.y)));
  clearTimeout(TH.timers.all);
  if (want) {
    if (!thShown('b')) thShowAll(true);
    // at an edge but not on a bar: hide after 2 s without moving; on a bar: stay
    if (!over) TH.timers.all = setTimeout(() => { if (!thOverAny(thUnder())) thShowAll(false); }, 2000);
  } else if (thShown('b')) TH.timers.all = setTimeout(() => thShowAll(false), 600);
}
document.addEventListener('pointermove', (e) => {
  if (!theatreActive() || e.pointerType === 'touch') return;
  // Chrome also sends "moves" when the mouse is still but something slides under it (a bar coming in,
  // the round pill moving down): those mustn't count, or they keep restarting the hide countdown
  if (e.clientX === TH.x && e.clientY === TH.y) { TH.lastTarget = e.target; return; }
  TH.x = e.clientX; TH.y = e.clientY; TH.lastTarget = e.target;
  const app = $('app');
  app.classList.remove('idle'); clearTimeout(TH.idle);
  TH.idle = setTimeout(() => { const u = thUnder(); if (theatreActive() && !['t', 'r', 'b'].some((k) => thOver(k, u))) app.classList.add('idle'); }, 2000);
  thUpdate(e.target);
}, true);
// dragging on the view (looking around in 3D, panning the radar) never pulls a bar in
document.addEventListener('pointerdown', (e) => { if (theatreActive() && (e.target === $('gl') || e.target === $('cv'))) TH.drag = true; }, true);
document.addEventListener('pointerup', () => { if (TH.drag) { TH.drag = false; if (theatreActive()) thUpdate(TH.lastTarget); } }, true);
document.addEventListener('pointercancel', () => { TH.drag = false; }, true);
// the mouse left the window (another screen, the Dock, the taskbar): tuck everything away
document.documentElement.addEventListener('mouseleave', () => { if (!theatreActive()) return; TH.x = -1; TH.lastTarget = null; thUpdate(null); });
window.addEventListener('blur', () => { if (theatreActive()) { TH.x = -1; TH.lastTarget = null; thUpdate(null); } });
window.addEventListener('resize', () => { if (theatreActive()) measureTheatre(); });
$('bTheatre').onclick = () => setTheatre(!TH.on);
$('sndVol').oninput = (e) => setVolume(+e.target.value);
// browsers only let a page make sound after you've clicked or pressed a key on it
const wake = () => { if (SND.on) audio(); };
document.addEventListener('pointerdown', wake, true); document.addEventListener('keydown', wake, true);
function isDeathSeq(e) { const a = D.slots[e], i = M.idxAt(T), sq = a ? a[i * D.stride + 9] : 0; return sq >= 101 && sq <= 110; }
setSound(SND.on);
// Viewing preferences carry over to the next demo and the next visit: the view (2D, 3D or split), Names,
// Grenades, Kill lines, See through walls and the timeline's match or round. (Team colours, Quality and
// sound are saved on their own above.) Playback speed is not a preference: every demo opens at 1x, paused.
function savePrefs() { ls.set('prefs', { view: viewMode, names: opts.names, nades: opts.nades, lines: opts.lines, xray: opts.xray, scope }); }
(() => {
  const p = ls.get('prefs'); if (!p || typeof p !== 'object') return;
  for (const [k, id] of [['names', 'tgNames'], ['nades', 'tgNades'], ['lines', 'tgLines'], ['xray', 'tgXray']]) if (typeof p[k] === 'boolean') { opts[k] = p[k]; $(id).classList.toggle('on', p[k]); }
  if (p.scope === 'match' || p.scope === 'round') { scope = p.scope; $('bScope').textContent = 'Timeline: ' + scope; }
  if (['2d', '3d', 'split'].includes(p.view)) viewMode = p.view; // applied when a demo opens (onDemo calls setView)
})();
