// ---------------- file loading ----------------
$('btnFolder').onclick = () => pickFolder();
$('btnDemo').onclick = () => $('fDemo').click();
$('btnOpen').onclick = () => { showLoad($('load').hidden); };
$('fDemo').onchange = (e) => { const f = e.target.files[0]; if (f) loadDemoFile(f); e.target.value = ''; };
$('fFolder').onchange = (e) => { const list = [...e.target.files]; e.target.value = ''; if (list.length) hlPicked(list); };

// The whole folder is read again each time, so files deleted since the last pick drop out
function indexFolder(list) {
  let nOv = 0;
  files.demos = []; files.overviews = {}; files.maps = {}; files.wads = {}; files.mdl = {}; files.snd = {}; files.sentences = null; files.materials = null; files.lang = null; files.hud = { txt: null, spr: {} }; files.cfg = null; files.fx = {};
  STALE.clear();
  for (const f of list) {
    const p = (f.webkitRelativePath || f.name).replace(/\\/g, '/').toLowerCase();
    const m = /(?:^|\/)(cstrike(?:_downloads)?)\/overviews\/([^/]+)\.(bmp|txt)$/.exec(p);
    if (m) {
      const key = m[2];
      const o = files.overviews[key] || (files.overviews[key] = {});
      // prefer cstrike over cstrike_downloads when both exist
      if (!o[m[3]] || m[1] === 'cstrike') { o[m[3]] = f; if (m[3] === 'bmp') nOv++; }
    } else if (p.endsWith('.dem')) files.demos.push(f);
    else {
      const mm = /(?:^|\/)(cstrike(?:_downloads)?)\/maps\/([^/]+)\.bsp$/.exec(p);
      if (mm) { if (!files.maps[mm[2]] || mm[1] === 'cstrike') files.maps[mm[2]] = f; continue; }
      const wm = /(?:^|\/)(cstrike|cstrike_downloads|valve)\/([^/]+\.wad)$/.exec(p);
      if (wm) { if (!files.wads[wm[2]] || wm[1] !== 'cstrike_downloads') files.wads[wm[2]] = f; continue; }
      // player and weapon models, sounds: the game's own files take priority over downloaded and Half-Life ones
      const rank = (g) => (g === 'cstrike' ? 3 : g === 'cstrike_downloads' ? 2 : 1);
      const mm2 = /(?:^|\/)(cstrike|cstrike_downloads|valve)\/(models\/.+\.mdl)$/.exec(p);
      if (mm2) { const o = files.mdl[mm2[2]]; if (!o || rank(mm2[1]) > o.rank) { f.rank = rank(mm2[1]); files.mdl[mm2[2]] = f; } continue; }
      const sm = /(?:^|\/)(cstrike|cstrike_downloads|valve)\/sound\/(.+\.wav)$/.exec(p);
      if (sm) { const o = files.snd[sm[2]]; if (!o || rank(sm[1]) > o.rank) { f.rank = rank(sm[1]); files.snd[sm[2]] = f; } continue; }
      if (/(?:^|\/)cstrike\/sound\/sentences\.txt$/.test(p)) files.sentences = f;
      // the game's materials list, for each wall's material in the wallbang finder (0.26.7): cstrike's, else Half-Life's,
      // as the game's file system looks for sound/materials.txt
      const mt = /(?:^|\/)(cstrike|valve)\/sound\/materials\.txt$/.exec(p);
      if (mt) { if (!files.materials || mt[1] === 'cstrike') files.materials = f; continue; }
      if (/(?:^|\/)cstrike\/resource\/cstrike_english\.txt$/.test(p)) files.lang = f;
      if (/(?:^|\/)cstrike\/config\.cfg$/.test(p)) files.cfg = f; // POV mode: the crosshair settings
      // the kill feed's weapon icons: where they sit (hud.txt) and the sprite sheets they're on
      if (/(?:^|\/)cstrike\/sprites\/hud\.txt$/.test(p)) files.hud.txt = f;
      const hm = /(?:^|\/)cstrike\/sprites\/(640hud\d+)\.spr$/.exec(p);
      if (hm) files.hud.spr[hm[1]] = f;
      const wt = /(?:^|\/)cstrike\/sprites\/(weapon_\w+)\.txt$/.exec(p); // POV HUD: each gun's ammo icon
      if (wt) (files.hud.wtxt ||= {})[wt[1]] = f;
      // the gun flash's sprites, the blood puff's and the palette that colours it (0.26.27): cstrike's, else Half-Life's
      const fx = /(?:^|\/)(cstrike|valve)\/(sprites\/(?:muzzleflash[1-3]|blood|bloodspray)\.spr|gfx\/palette\.lmp)$/.exec(p);
      if (fx && (!files.fx[fx[2]] || fx[1] === 'cstrike')) files.fx[fx[2]] = f;
    }
  }
  files.demos.sort((a, b) => b.lastModified - a.lastModified);
  renderDemoList();
  const nPm = Object.keys(files.mdl).filter((k) => k.startsWith('models/player/')).length;
  if (list.length) setMsg(`Found ${Object.keys(files.maps).length} maps, ${Object.keys(files.overviews).length} overviews, ${nPm} player models, ${Object.keys(files.snd).length} sounds and ${files.demos.length} demos.`);
  retryMissingModels(); retryMissingSounds(); SND.sentences = null; LANG.map = null; loadLang();
  if (D) preloadSounds();
  if (D && !MAP) loadMap(D.mapName);
  loadKillIcons();
}

// ---------------- centre-screen messages ----------------
// "Terrorists Win!", "The bomb has been planted!" and the rest, shown where the game shows them: centred, the top
// of the text 35% of the way down, for 2.5 seconds of game time, a newer one replacing an older (0.17.0). The time
// is from Xash3D, a reimplementation of the GoldSrc engine (scr_centertime 2.5). Its CL_CenterPrint puts the text
// at 0.25 of the screen, but Sujan's in-game screenshots (14 Oct 2026) have it at 0.35, so 0.35 it is (0.18.0;
// the look is in the .cmsg style). The words come
// from the player's own cstrike/resource/cstrike_english.txt (UTF-16, "Cstrike_TitlesTXT_<name>"), like everything
// else from the game; without that file the same English lines are used.
const LANG = { map: null };
const CENTRE_EN = { Terrorists_Win: 'Terrorists Win!', CTs_Win: 'Counter-Terrorists Win!', Round_Draw: 'Round Draw!', Target_Bombed: 'Target Successfully Bombed!',
  Target_Saved: 'Target has been saved!', Bomb_Defused: 'The bomb has been defused!', Bomb_Planted: 'The bomb has been planted!',
  Hostages_Not_Rescued: 'Hostages have not been rescued!', All_Hostages_Rescued: 'All Hostages have been rescued!', VIP_Escaped: 'The VIP has escaped!',
  VIP_Assassinated: 'VIP has been assassinated!', VIP_Not_Escaped: 'VIP has not escaped!', Terrorists_Escaped: 'The terrorists have escaped!',
  CTs_PreventEscape: 'The CTs have prevented most of the terrorists from escaping!', Escaping_Terrorists_Neutralized: 'Escaping terrorists have all been neutralized!',
  Game_Commencing: 'Game Commencing!', Game_will_restart_in: 'The game will restart in %s1 %s2' };
const CENTRE_SECS = 2.5;
async function loadLang() {
  let txt = null;
  try {
    if (files.lang) { const b = new Uint8Array(await files.lang.arrayBuffer()); txt = (b[0] === 0xff && b[1] === 0xfe) ? new TextDecoder('utf-16le').decode(b) : new TextDecoder().decode(b); idb.put('lang', txt); }
    else txt = await idb.get('lang');
  } catch (e) { txt = null; }
  if (!txt) return;
  const out = {}, re = /"(Cstrike_TitlesTXT_[A-Za-z0-9_]+)"\s+"([^"]*)"/g; let m;
  while ((m = re.exec(txt))) out[m[1].slice(18)] = m[2].replace(/\s*\n\s*/g, ' ');
  LANG.map = out;
}
function centreText(c) {
  const key = c.s.replace(/^#/, '');
  let t = (LANG.map && LANG.map[key]) || CENTRE_EN[key]; if (!t) return '';
  return t.replace(/%s(\d)/g, (_, n) => c.a[+n - 1] != null ? c.a[+n - 1] : '');
}
loadLang(); // from the copy saved on an earlier visit, until the folder is read
// the message on screen at time T: the latest one from the last 2.5 seconds
function updateCentre() {
  const el = $('cmsg'); if (!el) return;
  let txt = '';
  const list = D && D.centre;
  if (list && list.length) {
    let lo = 0, hi = list.length; while (lo < hi) { const m = (lo + hi) >> 1; if (list[m].t <= T) lo = m + 1; else hi = m; }
    const c = list[lo - 1]; if (c && T >= c.t && gameSpan(c.t, T) < CENTRE_SECS) txt = centreText(c);
  }
  if (el.textContent !== txt) el.textContent = txt;
  el.hidden = !txt;
  // the skip note: from 2 s of game time before a skip in the recording, so there's time to read it and then see
  // the jump happen, to 1 s after it (Sujan, 14 Oct 2026; 0.19.0 showed it only after the skip, for 2 s)
  const sn = $('skipnote');
  if (sn) { const on = !!(M && M.skipT && M.skipT.some((st) => (T < st ? gameSpan(T, st) <= SKIP_BEFORE : gameSpan(st, T) < SKIP_AFTER))); if (sn.hidden === on) sn.hidden = !on; }
  if (txt) {
    // the game picks the font size by screen height (ClientScheme.res "Default": 480-599 lines 12, 600-767 13,
    // 768-1023 14, 1024-1199 20, 1200 and up 24); here the view's height stands in for the screen's
    const h = el.parentElement ? el.parentElement.clientHeight : 768;
    const px = h < 600 ? 12 : h < 768 ? 13 : h < 1024 ? 14 : h < 1200 ? 20 : 24;
    if (el._px !== px) { el._px = px; el.style.setProperty('--cm-size', px + 'px'); }
  }
}

// ---------------- kill feed weapon icons ----------------
// Read from the player's own cstrike/sprites, like maps and models; nothing is bundled. hud.txt lists each
// kill feed icon (d_ak47, d_awp, d_headshot ...) as a rectangle on one of the 640hud*.spr sheets. The game
// draws these sheets additively, so a pixel's brightness is how solid it is: each icon becomes a white
// mask, coloured by CSS. Without the files, rows show the weapon's name only.
const KICONS = {}; // weapon -> width in px at 16 px tall
let kiconsFrom = null;
function decodeSpr(u8) {
  if (u8.length < 64 || String.fromCharCode(u8[0], u8[1], u8[2], u8[3]) !== 'IDSP') return null;
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  let p = 40; const n = dv.getInt16(p, true); p += 2;
  if (n <= 0 || n > 256) return null;
  const pal = u8.subarray(p, p + n * 3); p += n * 3;
  if (p + 20 > u8.length) return null;
  const w = dv.getInt32(p + 12, true), h = dv.getInt32(p + 16, true); p += 20;
  if (w <= 0 || h <= 0 || w > 1024 || h > 1024 || p + w * h > u8.length) return null;
  return { w, h, pal, n, px: u8.subarray(p, p + w * h) };
}
async function loadKillIcons() {
  const txt = files.hud.txt;
  if (!txt || kiconsFrom === txt) return;
  kiconsFrom = txt; lastFeedKey = ''; // the kill feed redraws with the icons
  const css = [];
  try {
    const want = {};
    for (const line of (await txt.text()).split(/\r?\n/)) {
      const f = line.trim().split(/\s+/);
      if (f.length === 7 && /^d_[a-z0-9]+$/i.test(f[0]) && f[1] === '640') want[f[0].slice(2).toLowerCase()] = { sheet: f[2].toLowerCase(), x: +f[3], y: +f[4], w: +f[5], h: +f[6] };
    }
    const sheets = {};
    for (const k in want) {
      const nm = want[k].sheet;
      if (!(nm in sheets)) { const f = files.hud.spr[nm]; sheets[nm] = f ? decodeSpr(await readPicked(f, `sprites/${nm}.spr`) || new Uint8Array(0)) : null; }
      const r = want[k], sh = sheets[nm];
      if (!sh || r.w <= 0 || r.h <= 0 || r.x < 0 || r.y < 0 || r.x + r.w > sh.w || r.y + r.h > sh.h) continue;
      const cv = document.createElement('canvas'); cv.width = r.w; cv.height = r.h;
      const g = cv.getContext('2d'), img = g.createImageData(r.w, r.h);
      for (let j = 0; j < r.h; j++) for (let i = 0; i < r.w; i++) {
        const c = sh.px[(r.y + j) * sh.w + r.x + i], o = (j * r.w + i) * 4;
        const a = c < sh.n ? Math.max(sh.pal[c * 3], sh.pal[c * 3 + 1], sh.pal[c * 3 + 2]) : 0;
        img.data[o] = img.data[o + 1] = img.data[o + 2] = 255; img.data[o + 3] = Math.min(255, Math.round(a * 1.9));
      }
      g.putImageData(img, 0, 0);
      const url = cv.toDataURL();
      KICONS[k] = Math.round(r.w * 16 / r.h);
      css.push(`.ki-${k}{width:calc(${KICONS[k]}px * var(--ui));-webkit-mask-image:url(${url});mask-image:url(${url})}`);
    }
  } catch (e) { }
  let st = $('kiconCss'); if (!st) { st = document.createElement('style'); st.id = 'kiconCss'; document.head.appendChild(st); }
  st.textContent = css.join('\n');
  if (D) renderPane();
}
// the kill feed icon for a weapon, or '' when the player's files don't have it
const kicon = (w, cls = '') => (KICONS[w] ? `<span class="kico ki-${w}${cls ? ' ' + cls : ''}" aria-hidden="true"></span>` : '');

// The demo list, narrowed by the search box: a demo stays when its file name contains every word typed
// (upper or lower case), and the typed letters are highlighted. Only the file name is searched, so a demo
// whose name doesn't say the map or the teams can only be found by scrolling.
function renderDemoList() {
  const el = $('demoList');
  el.innerHTML = '';
  const words = $('demoQ').value.toLowerCase().split(/\s+/).filter(Boolean);
  const mark = (name) => {
    const low = name.toLowerCase(), hit = new Array(name.length).fill(false);
    for (const w of words) for (let i = low.indexOf(w); i >= 0; i = low.indexOf(w, i + 1)) for (let k = i; k < i + w.length; k++) hit[k] = true;
    let h = '', on = false;
    for (let i = 0; i < name.length; i++) { if (hit[i] !== on) { h += hit[i] ? '<mark>' : '</mark>'; on = hit[i]; } h += esc(name[i]); }
    return h + (on ? '</mark>' : '');
  };
  let shown = 0;
  for (const f of files.demos) {
    const low = f.name.toLowerCase();
    if (!words.every((w) => low.includes(w))) continue;
    shown++;
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<em>${words.length ? mark(f.name) : esc(f.name)}</em><span>${(f.size / 1048576).toFixed(0)} MB</span>`;
    b.onclick = () => loadDemoFile(f);
    el.appendChild(b);
  }
  if (words.length && !shown) el.innerHTML = `<div class="demos-none">No demo names contain ${esc(words.map((w) => '"' + w + '"').join(' and '))}.</div>`;
  $('demoFind').hidden = !files.demos.length;
  $('demoN').innerHTML = words.length ? `<b>${shown}</b> of ${files.demos.length}` : String(files.demos.length);
  $('demoQx').hidden = !words.length;
}
$('demoQ').oninput = () => { renderDemoList(); $('demoList').scrollTop = 0; };
$('demoQ').onkeydown = (e) => { if (e.key === 'Escape' && $('demoQ').value) { e.preventDefault(); e.stopPropagation(); $('demoQ').value = ''; renderDemoList(); } };
$('demoQx').onclick = () => { $('demoQ').value = ''; renderDemoList(); $('demoQ').focus(); };
// Take demos that can't be read any more off the list, and bring the folder row's count up to date.
function dropDemos(gone) {
  files.demos = files.demos.filter((f) => !gone.includes(f)); renderDemoList();
  if (HL.ok) hlRender('ok');
}
// The folder is read once per pick, so the page only learns that a listed demo was deleted, moved or changed when it
// tries to read it. It tries in two places: here, reading the first 4 bytes of every listed demo whenever the start
// screen is showing and the player comes back to the page (the window gets focus or the tab becomes visible, as after
// deleting demos in Finder or Explorer) or goes back to it from a demo; and when a demo is clicked (loadDemoFile).
let demoChecking = false;
async function checkDemoList() {
  if (demoChecking || $('load').hidden || !files.demos.length) return;
  demoChecking = true;
  const gone = [];
  try { for (const f of files.demos) { try { await f.slice(0, 4).arrayBuffer(); } catch (e) { if (isStale(e)) gone.push(f); } } }
  finally { demoChecking = false; }
  if (!gone.length) return;
  dropDemos(gone);
  setMsg(`${gone.length === 1 ? gone[0].name + ' is' : gone.length + ' demos are'} no longer in your folder, or changed since you chose it, and ${gone.length === 1 ? 'was' : 'were'} taken off the list. Choose the folder again to pick up new or changed files.`, true);
}
window.addEventListener('focus', checkDemoList);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDemoList(); });

// ---------------- the Half-Life folder, chosen on every visit ----------------
// One way to choose the folder, in every browser, on every visit: Choose folder opens the browser's ordinary folder
// pick (<input webkitdirectory>), and the player accepts its "upload" question (Chrome and Edge's word for reading a
// folder; nothing leaves the computer). Sujan, 2 Nov 2026 (0.26.11, docs/folder-one-pick-mock.png): up to 0.26.10
// Chrome and Edge kept the folder between visits through their folder access (showDirectoryPicker), which refuses
// Steam's default folder (Program Files on Windows, Library on a Mac), so 0.26.10 offered the ordinary pick as a
// second way, and two ways would confuse players. The page sees the files as they were at the pick: new or changed
// ones show up when the folder is chosen again. Nothing about the folder is kept between visits; the copies of maps,
// models, sounds and overviews saved from it (map.js, players3d.js, audio.js) stay until Clear saved files.
const HL = { snap: null, ok: false };
const HL_EXAMPLE = 'C:\\Program Files (x86)\\Steam\\steamapps\\common\\Half-Life';
const HL_EXAMPLE_MAC = '~/Library/Application Support/Steam/steamapps/common/Half-Life';
const HL_HELP = 'The Half-Life folder from your Steam install, the one with cstrike and valve inside.';
// the player's system, from what the browser says about it (read in the page, sent nowhere): 'win', 'mac', or ''
// when it says neither (Linux, or nothing), and the row then gives both paths
function hlOS() {
  let p = '';
  try { p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || ''; } catch (e) { }
  return /^win/i.test(p) ? 'win' : /^mac/i.test(p) ? 'mac' : '';
}
$('hlPathWin').textContent = HL_EXAMPLE; $('hlPathMac').textContent = HL_EXAMPLE_MAC;
{ const os = hlOS(); $('hlWin').hidden = os === 'mac'; $('hlMac').hidden = $('hlTip').hidden = os === 'win'; }
// the files the viewer reads, for telling what changed between two picks in one visit (hlApply)
const HL_WANT = /(?:^|\/)(?:cstrike|cstrike_downloads|valve)\/(?:maps\/[^/]+\.bsp|overviews\/[^/]+\.(?:bmp|txt)|models\/.+\.mdl|sound\/.+\.wav|sound\/(?:sentences|materials)\.txt|resource\/cstrike_english\.txt|sprites\/hud\.txt|sprites\/640hud\d+\.spr|sprites\/(?:muzzleflash[1-3]|blood|bloodspray)\.spr|gfx\/palette\.lmp|[^/]+\.wad)$|(?:^|\/)cstrike\/(?:config\.cfg|sprites\/weapon_\w+\.txt)$|\.dem$/;
// path inside the chosen folder, lower case, without the folder's own name
const hlKey = (f) => (f.webkitRelativePath || f.name).replace(/\\/g, '/').toLowerCase().split('/').slice(1).join('/');
function hlSnap(list, name, gameDirs) {
  const out = {};
  for (const f of list) { const k = hlKey(f); if (HL_WANT.test('/' + k)) out[k] = [f.size, f.lastModified]; }
  return { name, files: out, gameDirs: gameDirs || [] };
}
// paths that differ between two file lists (added, removed or replaced)
function hlChanged(a, b) {
  const out = [];
  for (const p in b) if (!a[p] || a[p][0] !== b[p][0] || a[p][1] !== b[p][1]) out.push(p);
  for (const p in a) if (!b[p]) out.push(p);
  return out;
}
// Is this the Half-Life folder? null when it is, otherwise what's wrong with it
function hlProblem(name, gameDirs) {
  const n = (name || '').toLowerCase();
  if (/^(cstrike|cstrike_downloads|valve)$/.test(n)) return `This is the ${name} folder inside Half-Life. Choose the folder one level up, Half-Life, which contains cstrike and valve.`;
  if (!gameDirs.includes('cstrike')) return 'It has no cstrike folder inside. Choose the Half-Life folder from your Steam install, the one with cstrike and valve inside.';
  return null;
}
// the row on the start screen, and whether a demo can be opened: 'none' (nothing chosen yet), 'wrong' or 'ok'
function hlRender(state, o = {}) {
  const title = $('hlTitle'), st = $('hlStatus'), pick = $('btnFolder');
  const name = state === 'none' ? '' : (o.name || (HL.snap && HL.snap.name) || '');
  title.innerHTML = name ? `Folder selected: <span class="nm">${esc(name)}</span>` : 'Choose your Half-Life folder';
  title.title = HL_HELP;
  const line = (cls, head, rest) => `<span class="hlst ${cls}">${esc(head)}</span>${rest ? ' ' + esc(rest) : ''}`;
  HL.ok = state === 'ok';
  $('stepFolder').classList.toggle('done', HL.ok);
  $('stepFolder').querySelector('.k').textContent = HL.ok ? '✓' : '1';
  // where Steam puts the folder and the "upload" line, before a folder is chosen and after a wrong one
  $('hlPaths').hidden = HL.ok;
  pick.textContent = state === 'none' ? 'Choose folder' : 'Choose again';
  pick.title = HL.ok ? 'New demos show up when you choose the folder again.' : '';
  if (state === 'none') st.textContent = HL_HELP;
  else if (state === 'wrong') st.innerHTML = line('bad', 'Not the Half-Life folder.', o.text);
  else {
    // no dot beside the count: the folder isn't watched, so there's no "Up to date" to show (Sujan, 2 Nov 2026)
    const n = files.demos.length;
    st.innerHTML = n ? esc(`${n} ${n === 1 ? 'demo' : 'demos'} found.`)
      : line('chg', 'No demos found.', 'The folder is fine, but has no .dem files. Put demos in cstrike, or open one from anywhere with Open .dem.');
  }
  $('btnDemo').disabled = !HL.ok;
  $('btnDemo').title = HL.ok ? '' : 'Choose your Half-Life folder first';
  // option A (0.18.0): the folder step goes quiet and "Open a demo" takes the eye once the folder is fine
  document.querySelector('.steps').classList.toggle('ready', HL.ok);
  $('btnDemo').textContent = HL.ok ? 'Open .dem from elsewhere' : 'Open .dem';
}
// use a freshly picked folder: index it, and drop anything loaded from files that changed since the last pick
function hlApply(list, snap) {
  const prev = HL.snap;
  if (prev && prev.name === snap.name) for (const p of hlChanged(prev.files, snap.files)) {
    const m = /^(?:cstrike|cstrike_downloads|valve)\/(models\/.+\.mdl|sound\/(.+\.wav)|maps\/([^/]+)\.bsp)$/.exec(p);
    if (!m) continue;
    if (m[3]) { if (MAP && MAP.name === m[3]) { MAP = null; clear3d(); } }
    else if (m[2]) delete SND.bufs[m[2]];
    else delete MODELS[m[1]];
  }
  HL.snap = snap;
  indexFolder(list);
}
// a folder was picked: check it's the Half-Life folder, then use it
function hlUse(list, name, gameDirs) {
  const bad = hlProblem(name, gameDirs);
  if (bad) {
    // keep nothing from a wrong folder: an earlier good folder's files stay out too, so it's clear what's loaded
    HL.snap = { name, files: {}, gameDirs };
    indexFolder([]); hlRender('wrong', { name, text: bad }); return false;
  }
  hlApply(list, hlSnap(list, name, gameDirs));
  hlRender('ok');
  return true;
}
// Choose folder, Choose again, and the "Choose Half-Life folder" buttons in the 3D view and the load summary
function pickFolder() { $('fFolder').click(); }
function hlPicked(list) {
  const name = ((list[0].webkitRelativePath || '').split('/')[0]) || 'folder';
  const dirs = new Set();
  for (const f of list) { const seg = (f.webkitRelativePath || '').split('/'); if (seg.length > 2) dirs.add(seg[1].toLowerCase()); }
  hlUse(list, name, [...dirs].filter((n) => /^(cstrike|cstrike_downloads|valve)$/.test(n)));
}
// Up to 0.26.10 the browser kept the folder's handle, its file list and the 0.26.10 choice of the ordinary pick:
// delete them, so nothing about the folder stays in this browser
for (const k of ['hl:handle', 'hl:input', 'hl:snap']) idb.del(k);
hlRender('none');
// back to a first visit: let go of the folder and everything loaded from it
function hlForget() {
  HL.snap = null;
  indexFolder([]); setMsg('');
  hlRender('none');
}

// drag and drop anywhere
let dragDepth = 0;
document.addEventListener('dragenter', (e) => { e.preventDefault(); dragDepth++; document.body.classList.add('dragging'); });
document.addEventListener('dragleave', () => { if (--dragDepth <= 0) { dragDepth = 0; document.body.classList.remove('dragging'); } });
document.addEventListener('dragover', (e) => e.preventDefault());
document.addEventListener('drop', (e) => {
  e.preventDefault(); dragDepth = 0; document.body.classList.remove('dragging');
  const list = [...(e.dataTransfer.files || [])];
  const ovs = list.filter((f) => /\.(bmp|txt)$/i.test(f.name));
  for (const f of ovs) {
    const key = f.name.toLowerCase().replace(/\.(bmp|txt)$/, '');
    (files.overviews[key] || (files.overviews[key] = {}))[f.name.slice(-3).toLowerCase()] = f;
  }
  for (const f of list) {
    const n = f.name.toLowerCase();
    if (n.endsWith('.bsp')) files.maps[n.slice(0, -4)] = f;
    else if (n.endsWith('.wad')) files.wads[n] = f;
  }
  if (D && !MAP && list.some((f) => /\.(bsp|wad)$/i.test(f.name))) loadMap(D.mapName);
  const dem = list.find((f) => /\.dem$/i.test(f.name));
  // a demo needs the folder: the maps, overviews, models and sounds all come from it
  if (dem && !HL.ok) { if ($('load').hidden) showLoad(true); setMsg('Choose your Half-Life folder first. The viewer takes the maps, overviews, models and sounds from it, then opens any demo.', true); }
  else if (dem) loadDemoFile(dem);
  else if (ovs.length && D) tryLoadOverview(D.mapName).then(afterOverview);
});
