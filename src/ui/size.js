// ---------------- Interface size (0.26.13) ----------------
// One scale for the page (Sujan, 3 Nov 2026): every size in app.css is calc(Npx * var(--ui)), and UI is the same
// number for the labels the scripts draw on the radar, the timeline and the 3D view. Auto: 1 up to a 1920x1080
// window, so a laptop looks exactly as before; above that the smaller of width / 1920 and height / 1000, at most 1.5
// (from a 2880x1500 window). A size picked under Interface size in View settings is used as it is, but lowered when
// the window is too small for it: the page always keeps at least 1280x640 page pixels of room, as on a 1366x768
// laptop, so nothing gets cramped and the phone layout (under 860) never comes from the scale. Never below 1, and
// rounded down to 5%. This file runs in the page's head, before anything is drawn, so a big screen never shows the
// small size first; Auto follows the window when it's resized or moved to another screen, with no reload.
const UI_SIZES = ['auto', '100', '125', '150', '175', '200'];
let UI = 1;
function uiSizeSetting() { let v = null; try { v = JSON.parse(localStorage.getItem('uiSize')); } catch (e) { } return UI_SIZES.includes(v) ? v : 'auto'; }
function uiScaleFor(setting, w, h) {
  const want = setting === 'auto' ? Math.min(1.5, w / 1920, h / 1000) : +setting / 100;
  return Math.max(1, Math.floor(Math.min(want, w / 1280, h / 640) * 20 + 1e-6) / 20);
}
// sets --ui; true when the scale changed
function applyUiSize() {
  const s = uiScaleFor(uiSizeSetting(), innerWidth, innerHeight);
  if (s === UI && document.documentElement.style.getPropertyValue('--ui')) return false;
  UI = s; document.documentElement.style.setProperty('--ui', String(s));
  return true;
}
applyUiSize();
// A resize, and a move to a screen with another pixel density (which can leave the window's size in page pixels as it
// was, so no resize comes): the page hears 'uisize' and redraws its canvases at the new scale and sharpness.
addEventListener('resize', () => { if (applyUiSize()) dispatchEvent(new Event('uisize')); });
(function watchDensity() {
  const mq = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
  const on = () => { mq.removeEventListener('change', on); applyUiSize(); dispatchEvent(new Event('uisize')); watchDensity(); };
  mq.addEventListener('change', on);
})();
