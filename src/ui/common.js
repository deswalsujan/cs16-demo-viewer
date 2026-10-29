const COL = { t: '#e8574d', ct: '#5ea3e8', kill: '#ff9a3c', sand: '#cbb47e', wb: '#ff4fd8', loose: '#c9a3e8', fg: '#e7e3d9', muted: '#8d959c', line: '#2a3137' };
const SPEEDS = [0.25, 0.5, 1, 2, 4, 8];

// ---------------- state ----------------
let D = null;            // parsed demo
let OV = null;           // overview {img, zoom, ox, oy, rotated, w, h}
let T = 0;               // current demo time
let playing = false, speed = 1;
let view = { s: 1, x: 0, y: 0 };
let selected = null;     // selected player entity
let scope = 'match';
let tab = 'rounds';
let wbFilter = 'all', pickedBurst = null; // Wallbangs list filter and the clicked damage row (wip/wallbang-hits)
const opts = { names: true, nades: true, lines: true, xray: false, teamColours: false };
// kill moments that just happened, for the hit markers (timed in real seconds so they stay visible at any speed)
const flashes = [];
let prevT = null;
const FLASH_MS = 750;
const files = { overviews: {}, demos: [], maps: {}, wads: {}, mdl: {}, snd: {}, sentences: null, lang: null, hud: { txt: null, spr: {} } }; // from folder pick
let M = null;            // derived match data
// Theatre mode state (see the Theatre mode section)
const TH = { on: false, before: false, hint: false, timers: {}, idle: null, drag: false, x: -1, y: -1 };

// ---------------- storage (per-browser convenience) ----------------
const idb = {
  db: null,
  async open() {
    if (this.db) return this.db;
    return this.db = await new Promise((res, rej) => {
      const r = indexedDB.open('wallbang-viewer', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('overviews');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  },
  async get(k) { try { const db = await this.open(); return await new Promise((res) => { const q = db.transaction('overviews').objectStore('overviews').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }); } catch { return null; } },
  async put(k, v) { try { const db = await this.open(); db.transaction('overviews', 'readwrite').objectStore('overviews').put(v, k); } catch { } },
};
const ls = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } },
};

// ---------------- helpers ----------------
const fmt = (s) => { s = Math.max(0, s); const m = Math.floor(s / 60), x = Math.floor(s % 60); return m + ':' + String(x).padStart(2, '0'); };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// the monospace font stack, read from the page styles once (reading styles every frame is slow)
let MONO = null;
const monoFont = () => MONO || (MONO = getComputedStyle(document.body).getPropertyValue('--f-mono'));
const cleanName = (s) => (s || '?').replace(/[\x00-\x1f]/g, '');
function setMsg(t, err) { $('msg').textContent = t || ''; $('msg').classList.toggle('err', !!err); if (err && t && !$('load').hidden) $('msg').scrollIntoView({ block: 'nearest' }); }
function sideCol(side) { return side === 1 ? COL.t : side === 2 ? COL.ct : COL.muted; }
function weaponShort(m) { if (!m) return ''; const x = /p_(\w+)\.mdl/.exec(m); return x ? x[1] : ''; }
// A file picked from the folder that can't be read any more: it was deleted, moved, renamed or
// changed on disk after the folder was chosen. The browser only lets the page read the files as they
// were at that moment, so the fix is to choose the folder again.
const STALE = new Set();
function isStale(e) { return !!e && (e.name === 'NotFoundError' || e.name === 'NotReadableError'); }
function noteStale(e, name) { if (isStale(e)) STALE.add(name); return isStale(e); }
// read a picked file, or null when it has gone stale (noted for the load summary)
async function readPicked(blob, name) {
  try { return new Uint8Array(await blob.arrayBuffer()); } catch (e) { if (noteStale(e, name)) return null; throw e; }
}
