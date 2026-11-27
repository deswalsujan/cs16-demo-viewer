// ---------------- The HUD layer in the game's look (0.28.0) ----------------
// Sujan's plan of 27 Nov 2026, approved 28 Nov 2026 (tests/logs/kill-feed-spectating-2026-11-27.md, "The build plan";
// DECISIONS.md): the kill feed and the spectator bars are laid out in the game's 800x600 screen units (600 high, as wide
// as the view's shape: 1067 at 16:9), with the fonts of the game's 800x600 band and the sprites at their own size, then
// scaled to the view: at a whole scale with no smoothing, otherwise drawn at the next whole scale with no smoothing and
// shrunk to the view with smoothing ("sharp bilinear"), so every game pixel keeps one width with at most one soft screen
// pixel at its edge. Each piece (a text, an icon, a sprite) goes through that on its own, its enlarged copy kept, so the
// letters are made only when a text changes and a frame copies the pieces already made. POV mode's HUD, plant bar and
// radar use the same units since 0.28.0 (600 lines; 768 up to 0.27.7, so 28% larger now). Interface size no longer
// sizes them: it sizes the viewer's own controls and the Tab scoreboard (Sujan, 27 Nov 2026).
// The layers: the text and the bars on #spec3, over a flashbang's whiteout, so the names stay readable at full white
// (Sujan, 27 Nov 2026, his YouTube POV's shot 8); the kill feed's icons added onto the picture on #hud3, as the game
// draws its sprites (SPR_DrawAdditive), so they vanish in the white.
const HUD_H = 600;
const HUDP = { k: 1, ki: 1, whole: true, Wu: 800 };
// the scale for a canvas, in device pixels per unit
function hudScale(cv) {
  const k = cv.height / HUD_H, r = Math.round(k), whole = r >= 1 && Math.abs(k - r) < 0.01;
  HUDP.k = whole ? r : k; HUDP.ki = whole ? r : Math.max(1, Math.ceil(k)); HUDP.whole = whole; HUDP.Wu = cv.width / HUDP.k;
  return HUDP;
}
// a piece enlarged by the whole scale, nearest pixel, kept with the piece
const HUD_UP = new WeakMap();
function hudUp(src) {
  const ki = HUDP.ki; if (ki === 1) return src;
  const e = HUD_UP.get(src); if (e && e.ki === ki) return e.cv;
  const cv = document.createElement('canvas'); cv.width = src.width * ki; cv.height = src.height * ki;
  const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(src, 0, 0, cv.width, cv.height);
  HUD_UP.set(src, { ki, cv }); return cv;
}
// a piece at x, y (units), w by h units (its own size by default); g in device pixels (identity transform)
function hudImg(g, src, x, y, w = src.width, h = src.height) {
  const k = HUDP.k;
  if (HUDP.whole) { g.imageSmoothingEnabled = false; g.drawImage(src, Math.round(x * k), Math.round(y * k), Math.round(w * k), Math.round(h * k)); return; }
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'low'; g.drawImage(hudUp(src), x * k, y * k, w * k, h * k);
}
function hudRect(g, x, y, w, h) {
  const k = HUDP.k;
  if (HUDP.whole) g.fillRect(Math.round(x * k), Math.round(y * k), Math.round(w * k), Math.round(h * k));
  else g.fillRect(x * k, y * k, w * k, h * k);
}
// device pixels of the context's canvas, then back to what it was
function hudOn(g, f) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; try { f(); } finally { g.restore(); } }

// ---------------- the game's text ----------------
// The kill feed (and the chat, 0.28.1) are TrackerScheme's EngineFont, the spectator bars ClientScheme's Default: Verdana
// at weight 600 with no antialias line in any band, EngineFont with a drop shadow (docs/reference/game-schemes). At
// 800x600, Windows draws weight 600 as Verdana Regular made bold, each letter 1 px wider and smeared 1 px to the right,
// at the em size the scheme's height gives (EngineFont 15: 12 px, Default 13: 11 px); measured on his 800x600 shot
// (tests/logs/kill-feed-spectating-2026-11-27.md, 5). The browser's own Verdana (Sujan, 27 Nov 2026: the browser's text,
// the "fallback" rows of docs/proposed/kill-feed-spectating-compare.png): 1 px between letters, every pixel's edge cut
// fully on or off at half, the 1-px smear, then for EngineFont the 1-px black shadow right and down. The letters are the
// browser's, so lines come out 1 to 2% narrower than the game's.
const HUD_FACE = 'Verdana, "DejaVu Sans", "Liberation Sans", sans-serif';
const HUD_EF = { css: `400 12px ${HUD_FACE}`, shadow: true, name: 'EF' };
const HUD_DF = { css: `400 11px ${HUD_FACE}`, shadow: false, name: 'DF' };
const HUD_TXT = new Map();
const hudMeasure = document.createElement('canvas').getContext('2d');
const HUD_LS = 'letterSpacing' in hudMeasure;
function hudAdvance(str, f) {
  const g = hudMeasure; g.font = f.css;
  if (HUD_LS) { g.letterSpacing = '1px'; return g.measureText(str).width; }
  let w = 0; for (const ch of str) w += g.measureText(ch).width + 1; return w;
}
// the white mask of a text: { cv, ox, oy (where the text's origin sits in it), adv, inkL, inkR (ink columns from the origin) }
function hudMask(str, f) {
  const adv = hudAdvance(str, f), w = Math.ceil(adv) + 8, h = 40, ox = 3, oy = 6;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d'); g.font = f.css; g.fillStyle = '#fff'; g.textBaseline = 'alphabetic';
  if (HUD_LS) { g.letterSpacing = '1px'; g.fillText(str, ox, oy + 14); }
  else { let x = ox; for (const ch of str) { g.fillText(ch, x, oy + 14); x += g.measureText(ch).width + 1; } }
  const id = g.getImageData(0, 0, w, h), d = id.data;
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] >= 128 ? 255 : 0;
  for (let j = 0; j < h; j++) for (let i = w - 1; i > 0; i--) { const o = (j * w + i) * 4 + 3; if (d[o - 4]) d[o] = 255; }
  let inkL = w, inkR = -1;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) { const o = (j * w + i) * 4; if (d[o + 3]) { d[o] = d[o + 1] = d[o + 2] = 255; inkL = Math.min(inkL, i); inkR = Math.max(inkR, i); } }
  g.putImageData(id, 0, 0);
  return { cv, ox, oy, adv, inkL: inkL - ox, inkR: inkR - ox };
}
function hudTintCv(src, rgb) {
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  const g = c.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = `rgb(${rgb.join(',')})`; g.fillRect(0, 0, c.width, c.height);
  return c;
}
// a text in a colour, made once: the tinted letters, its shadow, and where its capitals start below the cell's top
function hudText(str, f, rgb) {
  const key = f.name + '|' + rgb.join(',') + '|' + str;
  let t = HUD_TXT.get(key);
  if (!t) {
    if (HUD_TXT.size > 400) HUD_TXT.clear();
    const m = hudMask(str, f);
    t = { ...m, fg: hudTintCv(m.cv, rgb), sh: f.shadow ? hudTintCv(m.cv, [0, 0, 0]) : null };
    HUD_TXT.set(key, t);
  }
  return t;
}
// how far below the drawing origin's top a capital's ink starts (the same for every text in a font)
const HUD_CAP = {};
function hudCapTop(f) {
  if (HUD_CAP[f.name] != null) return HUD_CAP[f.name];
  const m = hudMask('H', f), d = m.cv.getContext('2d').getImageData(0, 0, m.cv.width, m.cv.height).data;
  for (let j = 0; j < m.cv.height; j++) for (let i = 0; i < m.cv.width; i++) if (d[(j * m.cv.width + i) * 4 + 3]) return (HUD_CAP[f.name] = j - m.oy);
  return (HUD_CAP[f.name] = 0);
}
// draws a text with its origin at x0 and its capitals' top at capTop (units); returns the text's measures in units
function hudDrawText(g, str, f, x0, capTop, rgb) {
  const t = hudText(str, f, rgb), top = capTop - hudCapTop(f);
  x0 = Math.round(x0);
  if (t.sh) hudImg(g, t.sh, x0 - t.ox + 1, top - t.oy + 1);
  hudImg(g, t.fg, x0 - t.ox, top - t.oy);
  return { x0, adv: t.adv, inkL: x0 + t.inkL, inkR: x0 + t.inkR };
}

// ---------------- the kill feed's icons ----------------
// The player's own d_<weapon> rectangles from cstrike/sprites/hud.txt on the 640hud sheets, at their own size (48x16 for
// the AK, 36x16 for the headshot), tinted as cs16-client's death.cpp tints them: 255 80 0, a team kill 10 240 10. Each
// pixel's brightest channel is how much it adds, so drawn with 'lighter' it adds the palette colour times the tint.
const HUD_KI = { from: null, loading: false, rect: {}, cv: {} };
async function hudLoadIcons() {
  const txt = files.hud && files.hud.txt;
  if (!txt || HUD_KI.from === txt || HUD_KI.loading) return;
  HUD_KI.loading = true;
  const rect = {}, cv = {};
  try {
    const sheets = {};
    for (const line of (await txt.text()).split(/\r?\n/)) {
      const f = line.trim().split(/\s+/);
      if (f.length === 7 && /^d_[a-z0-9]+$/i.test(f[0]) && f[1] === '640') rect[f[0].slice(2).toLowerCase()] = { sheet: f[2].toLowerCase(), x: +f[3], y: +f[4], w: +f[5], h: +f[6] };
    }
    for (const k in rect) {
      const r = rect[k], nm = r.sheet;
      if (!(nm in sheets)) { const f = files.hud.spr[nm]; sheets[nm] = f ? decodeSpr(await readPicked(f, `sprites/${nm}.spr`) || new Uint8Array(0)) : null; }
      const sh = sheets[nm];
      if (!sh || r.w <= 0 || r.h <= 0 || r.x < 0 || r.y < 0 || r.x + r.w > sh.w || r.y + r.h > sh.h) continue;
      cv[k] = {};
      for (const [tn, tint] of [['kill', [255, 80, 0]], ['team', [10, 240, 10]]]) {
        const c = document.createElement('canvas'); c.width = r.w; c.height = r.h;
        const g = c.getContext('2d'), img = g.createImageData(r.w, r.h);
        for (let j = 0; j < r.h; j++) for (let i = 0; i < r.w; i++) {
          const p = sh.px[(r.y + j) * sh.w + r.x + i], o = (j * r.w + i) * 4;
          if (p >= sh.n) continue;
          const v = [0, 1, 2].map((q) => sh.pal[p * 3 + q] * tint[q] / 255), a = Math.max(v[0], v[1], v[2]);
          if (!a) continue;
          img.data[o] = v[0] * 255 / a; img.data[o + 1] = v[1] * 255 / a; img.data[o + 2] = v[2] * 255 / a; img.data[o + 3] = a;
        }
        g.putImageData(img, 0, 0); cv[k][tn] = c;
      }
    }
  } catch (e) { }
  HUD_KI.rect = rect; HUD_KI.cv = cv; HUD_KI.from = txt; HUD_KI.loading = false;
}
// the spectator bars' clock icon: the player's own valve/gfx/vgui/800_timer.tga (cstrike's first), at its own size, about
// 10% dimmer than the file, as his 800x600 shot has it (Sujan, 27 Nov 2026: as dim as the game's)
const HUD_TIMER = { from: null, cv: null, loading: false };
async function hudLoadTimer() {
  const f = files.hud && files.hud.timer;
  if (!f || HUD_TIMER.from === f || HUD_TIMER.loading) return;
  HUD_TIMER.loading = true;
  let cv = null;
  try {
    const p = decodeTga(await readPicked(f, 'gfx/vgui/800_timer.tga') || new Uint8Array(0));
    if (p) {
      cv = document.createElement('canvas'); cv.width = p.w; cv.height = p.h;
      const g = cv.getContext('2d'), img = g.createImageData(p.w, p.h);
      for (let i = 0; i < p.data.length; i += 4) { img.data[i] = p.data[i] * 0.9; img.data[i + 1] = p.data[i + 1] * 0.9; img.data[i + 2] = p.data[i + 2] * 0.9; img.data[i + 3] = p.data[i + 3]; }
      g.putImageData(img, 0, 0);
    }
  } catch (e) { cv = null; }
  HUD_TIMER.cv = cv; HUD_TIMER.from = f; HUD_TIMER.loading = false;
}

// ---------------- the kill feed (0.28.0) ----------------
// In the 3D view, every camera, HLTV and POV demos alike; the 2D view keeps the viewer's own (Sujan, 28 Nov 2026). As
// cs16-client's death.cpp, measured on his 800x600 shot: up to 4 rows (MAX_DEATHNOTICES), the newest last, each 6 s,
// only the round playing now (as the viewer's own feed, Sujan, 8 Nov 2026); rows 20 units apart; the first row's top at
// 80, just under the top spectator bar, while spectating (every HLTV demo, and POV demos while he's dead), and at 42
// (YRES(32) + 2) while he plays in POV mode; no box; the victim's last letter 16 units from the right edge, so with its
// shadow the row ends 15 from it, whole (Sujan, 27 Nov 2026: the first mockup cut the last letter); 6 units between the
// killer, the gun, the headshot icon and the victim; names in the game's team colours (T 255 64 64, CT 153 204 255,
// anyone else 204 grey).
const HUD_T = [255, 64, 64], HUD_CT = [153, 204, 255], HUD_GREY = [204, 204, 204], HUD_BASE = [255, 176, 0];
const hudSideRgb = (team) => (team === 'TERRORIST' ? HUD_T : team === 'CT' ? HUD_CT : HUD_GREY);
const HUDF = { rows: [] }; // the rows drawn last, in CSS pixels of the view, for the POV notices (placePovNotices)
function hudFeedRows(t) {
  const r = roundAt(t), from = r ? r.start - 1e-4 : -Infinity;
  return D.kills.filter((k) => k.t <= t && k.t > t - 6 && k.t >= from).slice(-4);
}
function drawGameFeed(tg, ag, t, playingPov) {
  hudLoadIcons();
  const rows = hudFeedRows(t), P = hudScale(tg.canvas), RIGHT = P.Wu - 17, top0 = playingPov ? 42 : 80;
  HUDF.rows = [];
  hudOn(tg, () => hudOn(ag, () => {
    ag.globalCompositeOperation = 'lighter';
    rows.forEach((k, i) => {
      const top = top0 + 20 * i, cap = top + 3;
      const tk = typeof teamKill === 'function' && teamKill(k) ? 'team' : 'kill', iconRgb = tk === 'team' ? [10, 240, 10] : [255, 80, 0];
      const vName = M.pl[k.vp] ? M.pl[k.vp].name : '?', vt = hudText(vName, HUD_EF, hudSideRgb(k.vteam));
      const vx = Math.round(RIGHT - vt.inkR);
      const piece = (name) => { const c = HUD_KI.cv[name]; return c ? { cv: c[tk], w: HUD_KI.rect[name].w, h: HUD_KI.rect[name].h } : null; };
      // the gun's icon, or its name in the icon's colour when the player's files don't have it
      const gun = piece(k.weapon), hs = k.hs ? piece('headshot') : null;
      let x = vx;
      let hx = null; if (hs) { x -= 6 + hs.w; hx = x; }
      x -= 6; let gx;
      if (gun) { x -= gun.w; gx = x; } else { x -= hudText(k.weapon, HUD_EF, iconRgb).adv; gx = x; }
      if (hs) hudImg(ag, hs.cv, hx, top);
      if (gun) hudImg(ag, gun.cv, gx, top); else hudDrawText(tg, k.weapon, HUD_EF, gx, cap, iconRgb);
      let left = gx;
      if (!(k.killer === k.victim || !k.kp)) {
        const kName = M.pl[k.kp] ? M.pl[k.kp].name : '?';
        const kx = gx - 6 - hudText(kName, HUD_EF, hudSideRgb(k.kteam)).adv;
        hudDrawText(tg, kName, HUD_EF, kx, cap, hudSideRgb(k.kteam)); left = kx;
      }
      hudDrawText(tg, vName, HUD_EF, vx, cap, hudSideRgb(k.vteam));
      const s = P.k / dpr;
      HUDF.rows.push({ left: left * s, right: (P.Wu - 15) * s, top: top * s, bottom: (top + 18) * s });
    });
  }));
}

// ---------------- the spectator bars (0.28.0) ----------------
// As the game's spectator screen, measured on his 800x600 shot of SK vs Na`Vi, Train, DreamHack Winter 2011, R9, on
// Na`Vi Zeus /A/ (docs/reference/zeus-r9/800x600; tests/logs/kill-feed-spectating-2026-11-27.md, 5): a bar 80 units
// high at the top and at the bottom (64 of 480 lines; 40 up to 0.27.7), black at 196 of 255 laid over the picture and
// over a flashbang's whiteout. Top right, in ClientScheme's Default and its BaseText colour (255 176 0): "Counter-
// Terrorists : n" and "Terrorists : n" ending 122 units from the right edge, a divider (255 176 0 at a quarter),
// "Spectators n" (the HLTV's viewers; in a POV demo while he's dead, his money, as the game, Sujan, 27 Nov 2026), and
// the clock with the timer icon under it. Bottom, centred: the followed player's name and health in his team's colour.
// While following a player in an HLTV demo (Player's eyes and Behind player; not the free camera, Sujan, 28 Nov 2026)
// and while he spectates in a POV demo (0.26.30). The score is the match's, as the header's, which the bars replace.
const HUD_BAR = 80;
const HUDB = { on: false, px: -1 };
function povBarsOn() { if (!POV.on || POV.mode === 0) return false; const [, tg] = povObs(POV.t); return !(tg === POV.v.rec && POV.mode !== 4) || false; }
function hudBarsWanted() {
  if (!D || viewMode === '2d') return false;
  if (POV.on) return povBarsOn();
  return cam3.mode !== 'free' && !!selected && !!D.slots[selected];
}
// the viewer's own controls make room while the bars are up: no header score, the round pill "Round N" alone, the
// camera buttons under the top bar, the bottom-left strip and the notes above the bottom bar (Sujan, 27 Nov 2026)
function hudBarsClass(on, H) {
  const px = on ? Math.round(H * HUD_BAR / HUD_H) : 0, rad = $('radar');
  if (on !== HUDB.on) { HUDB.on = on; rad.classList.toggle('bars', on); $('score').classList.toggle('bars', on); }
  if (px !== HUDB.px) { HUDB.px = px; rad.style.setProperty('--bar-h', px + 'px'); }
}
function drawGameBars(tg, W, H) {
  const on = hudBarsWanted();
  hudBarsClass(on, H);
  if (!on) return false;
  hudLoadTimer();
  const P = hudScale(tg.canvas), Wu = P.Wu, t = tNow3, r = roundAt(t);
  const sc = r ? (t >= (r.endT || r.end) && r.scoreAfter ? r.scoreAfter : r.scoreBefore) : [0, 0];
  const tT = r && r.tTeam != null ? r.tTeam : 0, ctScore = sc[1 - tT], tScore = sc[tT];
  const c = clockAt(t, true), clock = c ? c.text.replace(/^freeze /, '') : '';
  let upper = null;
  if (POV.on) { const m = D.hud && lastAt(D.hud.money, 2, POV.t); if (m != null) upper = '$' + m; }
  else { const v = viewersAt(t); if (v != null) upper = 'Spectators ' + v; }
  const [, tgt] = POV.on ? povObs(POV.t) : [0, 0], who = POV.on ? (POV.who != null ? POV.who : tgt) : selected;
  hudOn(tg, () => {
    tg.globalAlpha = 196 / 255; tg.fillStyle = '#000'; hudRect(tg, 0, 0, Wu, HUD_BAR); hudRect(tg, 0, HUD_H - HUD_BAR, Wu, HUD_BAR);
    tg.globalAlpha = 1;
    const R1 = Wu - 122, l1 = `Counter-Terrorists : ${ctScore}`, l2 = `Terrorists : ${tScore}`;
    hudDrawText(tg, l1, HUD_DF, R1 - hudText(l1, HUD_DF, HUD_BASE).adv, 20, HUD_BASE);
    hudDrawText(tg, l2, HUD_DF, R1 - hudText(l2, HUD_DF, HUD_BASE).adv, 36, HUD_BASE);
    tg.globalAlpha = 0.25; tg.fillStyle = 'rgb(255,176,0)'; hudRect(tg, Wu - 109, 15, 1, 37); tg.globalAlpha = 1;
    if (upper) hudDrawText(tg, upper, HUD_DF, Wu - 99, 20, HUD_BASE);
    if (HUD_TIMER.cv) hudImg(tg, HUD_TIMER.cv, Wu - 100, 31);
    if (clock) hudDrawText(tg, clock, HUD_DF, Wu - 81, 36, HUD_BASE);
    if (who && D.slots[who]) {
      const s = playerState(who, T), alive = !!(s && s.state > 0), hp = alive ? hpAt(who, tNow3) : null;
      const txt = nameAt(who, T) + (hp != null ? ` (${hp})` : ''), side = s ? Math.abs(s.state) : 0, rgb = side === 1 ? HUD_T : side === 2 ? HUD_CT : HUD_GREY;
      hudDrawText(tg, txt, HUD_DF, Wu / 2 - hudText(txt, HUD_DF, rgb).adv / 2, HUD_H - 38, rgb);
    }
  });
  return true;
}
