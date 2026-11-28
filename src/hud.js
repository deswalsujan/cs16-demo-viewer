// ---------------- The HUD layer in the game's look (0.28.0) ----------------
// Sujan's plan of 27 Nov 2026, approved 28 Nov 2026 (tests/logs/kill-feed-spectating-2026-11-27.md, "The build plan";
// DECISIONS.md): the kill feed and the spectator bars are laid out in the game's 800x600 screen units (600 high, as wide
// as the view's shape: 1067 at 16:9), with the fonts of the game's 800x600 band and the sprites at their own size, then
// scaled to the view: at a whole scale with no smoothing, otherwise drawn at the next whole scale with no smoothing and
// shrunk to the view with smoothing ("sharp bilinear"), so every game pixel keeps one width with at most one soft screen
// pixel at its edge. Each piece (a text, an icon, a sprite) goes through that on its own, its enlarged copy kept, so the
// letters are made only when a text changes and a frame copies the pieces already made. The text is the exception since
// 0.28.2: laid out in the same units, its letters are drawn at the view's own screen size, as sharp as the rest of the
// viewer (Sujan, 28 Nov 2026: enlarged from 800x600 it looked blurry); the icons and sprites still go the first way. POV mode's HUD, plant bar and
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
// 800x600, Windows draws weight 600 as Verdana Regular made bold, each letter 1 px wider and smeared 1 px to the right
// (tests/logs/kill-feed-spectating-2026-11-27.md, 5). The viewer draws the browser's own smoothed Verdana (Sujan, 28 Nov
// 2026, on #73; tests/logs/hud-text-variants-2026-11-28.md): the line drawn at once, 1 px between letters, no edge
// cutting, then a 0.75 smear (each pixel takes three quarters of its left neighbour's ink), the setting that comes
// closest to the game's weight (ink 0.91 and 1.14 of his 800x600 shot's in the feed and the bars), and for EngineFont
// the 1-px black shadow right and down. The feed at 12.34 px, the em the scheme's height gives (15 / 1.2153), the bars at
// 11 px. Its edges are soft where the game's are hard. Before, in #73: every pixel cut fully on or off at half (the first
// build), then R6, each letter on a whole pixel keeping 0.8 of its coverage; Sujan dropped R6 the same day, since its I
// and J merged into a box, the $ lost its bar, the # and the ! broke (its code: tests/text_variants/r6.js).
const HUD_FACE = 'Verdana, "DejaVu Sans", "Liberation Sans", sans-serif';
const HUD_EF = { css: `400 12.34px ${HUD_FACE}`, size: 12.34, weight: 400, shadow: true, name: 'EF' };
const HUD_DF = { css: `400 11px ${HUD_FACE}`, size: 11, weight: 400, shadow: false, name: 'DF' };
// the font at s device pixels a unit (1: the game's own 800x600 pixels)
const hudFont = (f, s) => `${f.weight} ${f.size * s}px ${HUD_FACE}`;
const HUD_SMEAR = 0.75;
const HUD_TXT = new Map();
const hudMeasure = document.createElement('canvas').getContext('2d');
const HUD_LS = 'letterSpacing' in hudMeasure;
function hudAdvance(str, f, s = 1) {
  const g = hudMeasure; g.font = hudFont(f, s);
  if (HUD_LS) { g.letterSpacing = s + 'px'; return g.measureText(str).width; }
  let w = 0; for (const ch of str) w += g.measureText(ch).width + s; return w;
}
// the white mask of a text drawn s device pixels to a unit (1 by default: the game's 800x600 pixels): { cv, ox, oy
// (where the text's origin sits in it), adv, inkL, inkR (columns at least half covered, from the origin) }, all in the
// mask's own pixels. One unit between letters and the smear exactly one unit wide (s pixels: the whole ones at three
// quarters, the last part-pixel at its share of that), so the weight is the same at any size: against 0.28.1's enlarged
// text at 1.5, 2, 2.4 and 3.27 device pixels a unit, the bars' ink within 4% and the feed's and chat's 4 to 7% lighter
// (the browser's small letters carry a little more ink than its large ones); at s = 1 exactly as up to 0.28.1.
function hudMask(str, f, s = 1) {
  const adv = hudAdvance(str, f, s), ox = Math.ceil(3 * s), oy = Math.ceil(6 * s), w = Math.ceil(adv) + ox + Math.ceil(5 * s), h = Math.ceil(40 * s);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d'); g.font = hudFont(f, s); g.fillStyle = '#fff'; g.textBaseline = 'alphabetic';
  const base = oy + Math.round(14 * s);
  if (HUD_LS) { g.letterSpacing = s + 'px'; g.fillText(str, ox, base); }
  else { let x = ox; for (const ch of str) { g.fillText(ch, x, base); x += g.measureText(ch).width + s; } }
  const id = g.getImageData(0, 0, w, h), d = id.data, K = Math.floor(s + 1e-6), part = s - K, row = new Uint8Array(w);
  let inkL = w, inkR = -1;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) row[i] = d[(j * w + i) * 4 + 3];
    for (let i = 0; i < w; i++) {
      const o = (j * w + i) * 4;
      // the smear: each pixel takes three quarters of the ink of the K pixels to its left, as read before smearing, and
      // of the one after them that share of it which the unit's last part-pixel has
      let a = row[i]; for (let q = 1; q <= K && q <= i; q++) a = Math.max(a, Math.round(row[i - q] * HUD_SMEAR));
      if (part > 0.01 && i > K) a = Math.max(a, Math.round(row[i - K - 1] * HUD_SMEAR * part));
      d[o] = d[o + 1] = d[o + 2] = 255; d[o + 3] = a;
      if (a >= 128) { inkL = Math.min(inkL, i); inkR = Math.max(inkR, i); }
    }
  }
  g.putImageData(id, 0, 0);
  return { cv, ox, oy, adv, inkL: inkL - ox, inkR: inkR - ox };
}
function hudTintCv(src, rgb) {
  const c = document.createElement('canvas'); c.width = src.width; c.height = src.height;
  const g = c.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = `rgb(${rgb.join(',')})`; g.fillRect(0, 0, c.width, c.height);
  return c;
}
// a text in a colour, made once at the view's scale (s device pixels a unit; HUDP.k, the scale hudScale set last): the
// tinted letters and its shadow in device pixels (cv, fg, sh, ox, oy, shOff), its measures in units (adv, inkL, inkR)
function hudText(str, f, rgb, s = HUDP.k) {
  const sk = Math.max(0.25, Math.round(s * 100) / 100), key = f.name + '|' + sk + '|' + rgb.join(',') + '|' + str;
  let t = HUD_TXT.get(key);
  if (!t) {
    if (HUD_TXT.size > 400) HUD_TXT.clear();
    const m = hudMask(str, f, sk);
    t = { f, cv: m.cv, ox: m.ox, oy: m.oy, s: sk, advPx: m.adv, adv: m.adv / sk, inkL: m.inkL / sk, inkR: m.inkR / sk,
      fg: hudTintCv(m.cv, rgb), sh: f.shadow ? hudTintCv(m.cv, [0, 0, 0]) : null, shOff: Math.max(1, Math.round(sk)) };
    HUD_TXT.set(key, t);
  }
  return t;
}
// how far below the drawing origin's top a capital's ink (at least half covered) starts, in the mask's pixels at scale s
// (the same for every text in a font)
const HUD_CAP = {};
function hudCapTop(f, s = 1) {
  const key = f.name + '|' + s;
  if (HUD_CAP[key] != null) return HUD_CAP[key];
  const m = hudMask('H', f, s), d = m.cv.getContext('2d').getImageData(0, 0, m.cv.width, m.cv.height).data;
  for (let j = 0; j < m.cv.height; j++) for (let i = 0; i < m.cv.width; i++) if (d[(j * m.cv.width + i) * 4 + 3] >= 128) return (HUD_CAP[key] = j - m.oy);
  return (HUD_CAP[key] = 0);
}
// a text made by hudText put on the layer one to one, its origin at X and its capitals' top at CAP (device pixels, whole);
// part: 'sh' the shadow only, 'fg' the letters only, both by default
function hudBlit(g, t, X, CAP, part) {
  const top = CAP - hudCapTop(t.f, t.s);
  g.imageSmoothingEnabled = false;
  if (t.sh && part !== 'fg') g.drawImage(t.sh, X - t.ox + t.shOff, top - t.oy + t.shOff);
  if (part !== 'sh') g.drawImage(t.fg, X - t.ox, top - t.oy);
}
// draws a text with its origin at x0 and its capitals' top at capTop (units), on whole device pixels; returns the text's
// measures in units
function hudDrawText(g, str, f, x0, capTop, rgb) {
  const k = HUDP.k, t = hudText(str, f, rgb, k), X = Math.round(x0 * k);
  hudBlit(g, t, X, Math.round(capTop * k));
  return { x0: X / k, adv: t.adv, inkL: X / k + t.inkL, inkR: X / k + t.inkR };
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
// Theatre mode: the side panel, while it's out, covers the view's right part, and the feed keeps to the edge left of it,
// as the game holds the feed to the visible screen's right edge and as 0.27.7's feed did (Sujan, 28 Nov 2026: the panel
// mustn't hide kills); read from where the panel is, so the feed moves with it as it slides. In units.
function hudVisibleRight(P) {
  const app = $('app'); if (!app || !app.classList.contains('theatre')) return P.Wu;
  const side = document.querySelector('.side'), rad = $('radar'); if (!side || !rad) return P.Wu;
  const s = side.getBoundingClientRect(), r = rad.getBoundingClientRect();
  if (!s.width || s.left >= r.right) return P.Wu;
  return Math.max(0, Math.min(P.Wu, (s.left - r.left) * dpr / P.k));
}
function drawGameFeed(tg, ag, t, playingPov) {
  hudLoadIcons();
  const rows = hudFeedRows(t), P = hudScale(tg.canvas), VR = hudVisibleRight(P), RIGHT = VR - 17, top0 = playingPov ? 42 : 80;
  HUDF.rows = [];
  hudOn(tg, () => hudOn(ag, () => {
    ag.globalCompositeOperation = 'lighter';
    rows.forEach((k, i) => {
      const top = top0 + 20 * i, cap = top + 3;
      const tk = typeof teamKill === 'function' && teamKill(k) ? 'team' : 'kill', iconRgb = tk === 'team' ? [10, 240, 10] : [255, 80, 0];
      const vName = M.pl[k.vp] ? M.pl[k.vp].name : '?', vt = hudText(vName, HUD_EF, hudSideRgb(k.vteam));
      const vx = RIGHT - vt.inkR; // placed on whole device pixels by hudDrawText
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
      HUDF.rows.push({ left: left * s, right: (VR - 15) * s, top: top * s, bottom: (top + 18) * s });
    });
  }));
}

// ---------------- chat and radio lines (0.28.1) ----------------
// Sujan's plan of 27 Nov 2026, part 4, approved 28 Nov 2026 (tests/logs/kill-feed-spectating-2026-11-27.md, "The build
// plan", PR 3): the players' chat and radio lines only, no server or plugin lines (his answer (d) of 27 Nov 2026), in
// HLTV and POV demos, in 3D, every camera. What the demos carry: an HLTV demo dead players' all-chat (the HLTV hears no
// living player and no team chat); a POV demo what the recorder's game got: his own lines, his team's, the dead and
// spectators' while he was dead, and his team's radio words (ReGameDLL's SendSayMessage and CBasePlayer::Radio).
// Kept as Valve's saytext.cpp keeps them (HLSDK, and cs16-client's copy): at most 5 lines (MAX_LINES), the newest at
// the bottom; once the top line has been up 5 seconds of game time (hud_saytext_time 5) it leaves and the rest move up,
// the next one 5 seconds after that; a new line when 5 are up pushes the top one out; a line wider than the screen less
// 40 wraps at its last space, the rest a line of its own that leaves with it. The words are the player's own
// cstrike_english.txt (Cstrike_Chat_*, Game_radio; the radio's phrase as Cstrike_TitlesTXT_<name>), the same English
// without it. The game's colour bytes in them: \x01 the chat's yellow (255 179 0, cs16-client's g_ColorYellow), \x03 the
// sender's team colour, \x04 green (0 255 0). A chat line that starts with \x02, a living player's all-chat, has
// everything up to the end of the sender's name in his team colour, as Valve's HLSDK draws it (Sujan, 28 Nov 2026); a
// radio line, which starts with \x02 too, is yellow from end to end, as his YouTube POV shows it. Laid out on his 800x600 shot: EngineFont with its shadow, the ink from 24 units in,
// the top line's capitals at 437 while spectating (every HLTV demo, and a POV demo while he's dead) and at 430 while he
// plays in POV mode (his YouTube POV: 71.6% of the height), the lines 16 apart (2.7%). The game places the lines when
// one comes in (Y_START, set in SayTextPrint), so the state at the newest line decides. On #spec3, over a flashbang's
// whiteout (Sujan, 27 Nov 2026: the radio lines stay readable at full white).
const HUD_YEL = [255, 179, 0], HUD_GREEN = [0, 255, 0];
const HUD_CHAT_EN = {
  Game_radio: '\x02%s1 (RADIO): %s2', Cstrike_Chat_CT: '\x01(Counter-Terrorist) \x03%s1\x01 :  %s2', Cstrike_Chat_T: '\x01(Terrorist) \x03%s1\x01 :  %s2',
  Cstrike_Chat_CT_Dead: '\x01*DEAD*(Counter-Terrorist) \x03%s1\x01 :  %s2', Cstrike_Chat_T_Dead: '\x01*DEAD*(Terrorist) \x03%s1\x01 :  %s2',
  Cstrike_Chat_Spec: '\x01(Spectator) \x03%s1\x01 :  %s2', Cstrike_Chat_All: '\x02%s1 :  %s2', Cstrike_Chat_AllDead: '\x01*DEAD* \x03%s1\x01 :  %s2',
  Cstrike_Chat_AllSpec: '\x01*SPEC* \x03%s1\x01 :  %s2',
  // a place in the line, which only servers with ReGameDLL's location_area_info send: ReGameDLL's own words for them
  Game_radio_location: '\x03%s1\x01 @ \x04%s2\x01 (RADIO): %s3', Cstrike_Chat_CT_Loc: '\x01(Counter-Terrorist) \x03%s1\x01 @ \x04%s3\x01 :  %s2',
  Cstrike_Chat_T_Loc: '\x01(Terrorist) \x03%s1\x01 @ \x04%s3\x01 :  %s2',
};
// the lines' origin 22 units in: the "<" his shot's line starts with has its ink 2 units after its origin in the browser's
// Verdana, so at 24, as in his shot; the game draws every line from one origin (LINE_START), whatever its first letter
const HUD_CHAT_X = 22, HUD_CHAT_STEP = 16, HUD_CHAT_SPEC = 437, HUD_CHAT_PLAY = 430, HUD_CHAT_SECS = 5, HUD_CHAT_MAX = 5;
// a format by its name ("#Cstrike_Chat_T"), from the player's file or the same English; a format the server wrote out
// itself (ReGameDLL's chat_loc_fallback) as it is
function hudChatFmt(f) {
  if (!f || f[0] !== '#') return f || '';
  const k = f.slice(1);
  return (LANG.fmt && LANG.fmt[k]) || HUD_CHAT_EN[k] || '';
}
// a radio phrase ("#Fire_in_the_hole") in the player's words, as the centre messages are found (folder.js, LANG)
const hudPhrase = (s) => (s && s[0] === '#' ? (LANG.map && LANG.map[s.slice(1)]) || s.slice(1).replace(/_/g, ' ') : s || '');
// a line as the game draws it: its tokens, a letter { ch } or a colour change { rgb }, the line starting in yellow; with
// the sender's name (chat, not radio), a line starting with \x02 is in his team colour up to the end of the name
// (HLSDK's saytext.cpp: g_iNameLengths, the name's first place in the line plus its length)
function hudChatTokens(fmt, args, team, name) {
  const text = fmt.replace(/%s([1-4])/g, (_, n) => (args[+n - 1] != null ? args[+n - 1] : '')).replace(/[\r\n]+$/, '');
  const at = name && text[0] === '\x02' ? text.indexOf(name) : -1, cut = at >= 0 ? at + name.length : -1;
  const out = cut >= 0 ? [{ rgb: hudSideRgb(team) }] : [];
  let i = 0;
  for (const ch of text) {
    if (i === cut) out.push({ rgb: HUD_YEL });
    i += ch.length;
    if (ch === '\x01') out.push({ rgb: HUD_YEL });
    else if (ch === '\x03') out.push({ rgb: hudSideRgb(team) });
    else if (ch === '\x04') out.push({ rgb: HUD_GREEN });
    else if (ch >= ' ') out.push({ ch });
  }
  return out;
}
// the players' lines of the demo, each with its tokens and the moment in game time
function hudChatSource() {
  const L = [];
  for (const c of D.chat || []) {
    if (!/^#Cstrike_Chat_/.test(c.fmt) || !c.id) continue; // players' chat only (Sujan, 27 Nov 2026, (d))
    const f = hudChatFmt(c.fmt); if (!f) continue;
    L.push({ t: c.t, toks: hudChatTokens(f, [c.name || '', c.text || '', ''], c.team, c.name), kind: 'chat' });
  }
  for (const r of D.radioText || []) {
    const f = hudChatFmt(r.fmt); if (!f) continue;
    const a = r.args || [];
    // the name as sent, the place and the phrase in the player's words (cs16-client's MsgFunc_TextMsg)
    L.push({ t: r.t, toks: hudChatTokens(f, [a[0] || '', hudPhrase(a[1]), hudPhrase(a[2])], r.team), kind: 'radio' });
  }
  L.sort((a, b) => a.t - b.t);
  for (const l of L) l.g = gameTime(l.t);
  return L;
}
const HUD_CW = new Map(); // a letter's advance in EngineFont, 1 px of spacing with it
const hudCharW = (ch) => { let w = HUD_CW.get(ch); if (w == null) { w = hudAdvance(ch, HUD_EF); HUD_CW.set(ch, w); } return w; };
// a line too wide for the screen, broken as EnsureTextFitsInOneLineAndWrapIfHaveTo breaks it: at the last space before
// the width from the origin runs over (or the letter before), the rest starting with a space
function hudWrap(toks, maxW) {
  const out = [];
  for (;;) {
    let len = HUD_CHAT_X, brk = -1, cut = -1;
    for (let i = 0; i < toks.length; i++) {
      const t = toks[i]; if (!t.ch) continue;
      if (t.ch === ' ' && i > 0) brk = i;
      len += hudCharW(t.ch);
      if (len > maxW) { cut = brk >= 0 ? brk : Math.max(1, i - 1); break; }
    }
    if (cut < 0) { out.push(toks); return out; }
    out.push(toks.slice(0, cut));
    const rest = toks.slice(cut);
    toks = rest.length && rest[0].ch === ' ' ? rest : [{ ch: ' ' }, ...rest];
    if (out.length > 20) return out;
  }
}
// what's on screen from each moment on: the lines' states, in game time, made again when the demo, its words or the
// width change
const HUDC = { D: null, pov: false, fmt: null, map: null, wu: 0, states: [] };
function hudChatStates(Wu) {
  const wu = Math.round(Wu);
  if (HUDC.D === D && HUDC.pov === POV.on && HUDC.fmt === LANG.fmt && HUDC.map === LANG.map && HUDC.wu === wu) return HUDC.states;
  const states = [], lines = [];
  let scrollAt = Infinity, spec = true;
  const snap = (g) => states.push({ g, lines: lines.slice(), spec });
  const scrollUp = () => { lines.shift(); while (lines.length && lines[0].cont) lines.shift(); };
  const flow = (until) => { while (lines.length && scrollAt <= until) { scrollUp(); snap(scrollAt); scrollAt += HUD_CHAT_SECS; } };
  for (const l of hudChatSource()) {
    flow(l.g);
    // where the game starts the lines: spectating (every HLTV demo, a POV demo while he's dead or watching) or playing
    spec = !(POV.on && povObs(l.t)[0] === 0);
    hudWrap(l.toks, wu - 40).forEach((toks, i) => {
      if (lines.length >= HUD_CHAT_MAX) scrollUp();
      if (!lines.length) scrollAt = l.g + HUD_CHAT_SECS;
      lines.push({ toks, cont: i > 0, kind: l.kind });
    });
    snap(l.g);
  }
  flow(Infinity);
  Object.assign(HUDC, { D, pov: POV.on, fmt: LANG.fmt, map: LANG.map, wu, states });
  return states;
}
// the lines up at game time g
function hudChatAt(Wu, t) {
  const S = hudChatStates(Wu), g = gameTime(t);
  let lo = 0, hi = S.length - 1, r = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (S[m].g <= g) { r = m; lo = m + 1; } else hi = m - 1; }
  return r < 0 ? null : S[r];
}
const HUDCH = { lines: [] }; // the lines drawn last, as text, for the checks
function drawGameChat(tg, t) {
  const P = hudScale(tg.canvas), st = D && hudChatAt(P.Wu, t);
  HUDCH.lines = [];
  if (!st || !st.lines.length) return;
  const top0 = st.spec ? HUD_CHAT_SPEC : HUD_CHAT_PLAY;
  hudOn(tg, () => st.lines.forEach((ln, i) => {
    const cap = top0 + HUD_CHAT_STEP * i;
    // the pieces of one colour, their shadows first, so a piece's shadow never lies over the letters before it
    const parts = []; let rgb = HUD_YEL, s = '';
    for (const k of ln.toks) { if (k.rgb) { if (s) parts.push([s, rgb]); s = ''; rgb = k.rgb; } else s += k.ch; }
    if (s) parts.push([s, rgb]);
    // at the view's own size (0.28.2): each piece from where the one before ends, in device pixels
    const k = HUDP.k, CAP = Math.round(cap * k);
    let x = HUD_CHAT_X * k;
    const at = parts.map(([str, c]) => { const t0 = hudText(str, HUD_EF, c, k), p = { t0, X: Math.round(x) }; x += t0.advPx; return p; });
    for (const p of at) hudBlit(tg, p.t0, p.X, CAP, 'sh');
    for (const p of at) hudBlit(tg, p.t0, p.X, CAP, 'fg');
    HUDCH.lines.push({ text: parts.map((p) => p[0]).join(''), cap, kind: ln.kind, colours: parts.map((p) => p[1].join(' ')) });
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
const HUDB = { on: false, px: -1, clock: '', bottom: '', nameW: 0, colRight: 0, shift: 0 }; // clock and bottom: the texts the bars show now; nameW: the bottom name's width in units
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
  if (!on) hudStrip(false, 0, 0); // the strip back to the view's bottom left, in full (2D, a closed demo)
}
function drawGameBars(tg, W, H) {
  const on = hudBarsWanted();
  hudBarsClass(on, H);
  if (!on) { HUDB.clock = HUDB.bottom = ''; HUDB.nameW = 0; hudStrip(false, W, H); return false; }
  hudLoadTimer();
  const P = hudScale(tg.canvas), Wu = P.Wu, t = tNow3, r = roundAt(t);
  const sc = r ? (t >= (r.endT || r.end) && r.scoreAfter ? r.scoreAfter : r.scoreBefore) : [0, 0];
  const tT = r && r.tTeam != null ? r.tTeam : 0, ctScore = sc[1 - tT], tScore = sc[tT];
  // the clock as the round pill had it before the bars took it over: with Vanilla, "C4" alone after the plant, as the game
  // hides its timer then (0.26.16)
  const c = clockAt(t, true), clock = !c ? '' : VAN.on && c.phase === 'bomb' ? 'C4' : c.text.replace(/^freeze /, '');
  HUDB.clock = clock; HUDB.bottom = ''; HUDB.nameW = 0;
  let upper = null;
  if (POV.on) { const m = D.hud && lastAt(D.hud.money, 2, POV.t); if (m != null) upper = '$' + m; }
  else { const v = viewersAt(t); if (v != null) upper = 'Spectators ' + v; }
  const [, tgt] = POV.on ? povObs(POV.t) : [0, 0], who = POV.on ? (POV.who != null ? POV.who : tgt) : selected;
  hudOn(tg, () => {
    tg.globalAlpha = 196 / 255; tg.fillStyle = '#000'; hudRect(tg, 0, 0, Wu, HUD_BAR); hudRect(tg, 0, HUD_H - HUD_BAR, Wu, HUD_BAR);
    tg.globalAlpha = 1;
    // the right column (Spectators n or his money, the clock icon and the clock) inside the view with the kill feed's right
    // margin, its last ink at most 17 units in from the edge, as the feed's victim (0.28.2; Sujan, 28 Nov 2026: 0.28.0's
    // "Spectators 264" lost its last digit, Sweden vs Poland, Nuke, full screen): where a long count would run past it,
    // the whole top bar's text, the divider and the score lines with it, moves left by as much; a one-digit count stays
    // where his 800x600 shot has it
    const inkEnd = (str, x0) => (str ? x0 + Math.max(0, hudText(str, HUD_DF, HUD_BASE).inkR) : -Infinity);
    const over = Math.max(inkEnd(upper, Wu - 99), inkEnd(clock, Wu - 81)) - (Wu - 17), R = Wu - Math.max(0, over);
    HUDB.colRight = Math.max(inkEnd(upper, R - 99), inkEnd(clock, R - 81)); HUDB.shift = Wu - R; // for the checks
    const R1 = R - 122, l1 = `Counter-Terrorists : ${ctScore}`, l2 = `Terrorists : ${tScore}`;
    hudDrawText(tg, l1, HUD_DF, R1 - hudText(l1, HUD_DF, HUD_BASE).adv, 20, HUD_BASE);
    hudDrawText(tg, l2, HUD_DF, R1 - hudText(l2, HUD_DF, HUD_BASE).adv, 36, HUD_BASE);
    tg.globalAlpha = 0.25; tg.fillStyle = 'rgb(255,176,0)'; hudRect(tg, R - 109, 15, 1, 37); tg.globalAlpha = 1;
    if (upper) hudDrawText(tg, upper, HUD_DF, R - 99, 20, HUD_BASE);
    if (HUD_TIMER.cv) hudImg(tg, HUD_TIMER.cv, R - 100, 31);
    if (clock) hudDrawText(tg, clock, HUD_DF, R - 81, 36, HUD_BASE);
    if (who && D.slots[who]) {
      const s = playerState(who, T), alive = !!(s && s.state > 0), hp = alive ? hpAt(who, tNow3) : null;
      const txt = nameAt(who, T) + (hp != null ? ` (${hp})` : ''), side = s ? Math.abs(s.state) : 0, rgb = side === 1 ? HUD_T : side === 2 ? HUD_CT : HUD_GREY;
      HUDB.bottom = txt; HUDB.nameW = hudText(txt, HUD_DF, rgb).adv;
      hudDrawText(tg, txt, HUD_DF, Wu / 2 - HUDB.nameW / 2, HUD_H - 38, rgb);
    }
  });
  hudStrip(true, W, H);
  return true;
}
// The bottom-left strip (Names to View settings) while the bars are up (0.28.1; Sujan, 28 Nov 2026): inside the bottom
// bar, above the followed player's centred name, clear of the chat's lines; never over the name, in a narrow window or
// with a long name. In the order tried: the whole strip in the bar's upper part, clear of the name's ink (from 2 units
// above its capitals at 562 to 10 below: 560 to 572; the view at least about 465 px high at Interface size 100%); the
// whole strip beside the name, on its line; icons only (Sujan: shorten the strip rather than overlap) above it, then
// beside it; else just above the bar, 0.28.0's place, where it can lie over the chat's 4th and 5th lines but not the name.
// W and H in the view's CSS pixels; worked out again only when the view, the name's width, Interface size or the
// strip's buttons change.
const HUDSTRIP = { key: '', mode: '' };
function hudStrip(on, W, H) {
  const lg = $('legend'), rad = $('radar'); if (!lg) return;
  if (!on || lg.hidden) {
    if (HUDSTRIP.key) { HUDSTRIP.key = ''; HUDSTRIP.mode = ''; hudStripIcons(lg, false); rad.style.removeProperty('--strip-b'); }
    return;
  }
  const kids = [...lg.children].map((e) => (e.hidden ? 0 : 1)).join('') + ($('xrayMark') && !$('xrayMark').hidden ? 1 : 0);
  const key = [Math.round(W), Math.round(H), UI, Math.round(HUDB.nameW || 0), kids].join('|');
  if (key === HUDSTRIP.key) return;
  HUDSTRIP.key = key;
  const size = (icons) => { hudStripIcons(lg, icons); const r = lg.getBoundingClientRect(), b = lg.querySelector('.btn'); return { w: r.width, h: r.height, row: b ? b.getBoundingClientRect().height : r.height }; };
  const full = size(false), ico = size(true);
  const k = H / HUD_H, barTop = H - Math.round(H * HUD_BAR / HUD_H), left = 12 * UI;
  const nTop = 560 * k - 3, nBot = 573 * k + 3, nLeft = HUDB.nameW ? W / 2 - HUDB.nameW * k / 2 - 8 * UI : W;
  // the gap under the bar's top edge: 5 px for the whole strip, 3 for icons only, which is there for tight spots
  const oneRow = (z) => z.h < z.row * 1.5;
  const above = (z, gap) => oneRow(z) && barTop + gap + z.h <= nTop;
  const beside = (z, gap) => oneRow(z) && left + z.w <= nLeft && z.h <= H - barTop - 2 * gap;
  let icons = false, bottom;
  if (above(full, 5 * UI)) bottom = H - (barTop + 5 * UI + full.h);
  else if (beside(full, 5 * UI)) bottom = H - ((nTop + nBot) / 2 + full.h / 2);
  else if (above(ico, 3 * UI)) { icons = true; bottom = H - (barTop + 3 * UI + ico.h); }
  else if (beside(ico, 3 * UI)) { icons = true; bottom = H - ((nTop + nBot) / 2 + ico.h / 2); }
  else bottom = H - barTop + 12 * UI;
  hudStripIcons(lg, icons);
  HUDSTRIP.mode = icons ? 'icons' : 'full';
  rad.style.setProperty('--strip-b', Math.round(Math.max(0, bottom)) + 'px');
}
// icons only: each button's tooltip starts with its name, then its own explanation; on See through walls, while the ! of
// the anti-wallhack warning shows (#xrayMark), the warning's too (Sujan, 28 Nov 2026); the name is the button's
// accessible name, its words being hidden. Back to the button's own tooltip in full.
function hudStripIcons(lg, on) {
  lg.classList.toggle('icons', on);
  const mk = $('xrayMark');
  for (const b of lg.querySelectorAll('.btn')) {
    const l = b.querySelector('.lbl'); if (!l) continue;
    if (b.dataset.tip0 == null) b.dataset.tip0 = b.getAttribute('title') || '';
    const name = l.textContent.trim(), t0 = b.dataset.tip0;
    if (on) {
      let tip = t0 ? `${name}: ${t0}` : name;
      if (b.id === 'tgXray' && mk && !mk.hidden && mk.title) tip += '. ' + mk.title;
      b.title = tip; b.setAttribute('aria-label', name);
    } else if (b.hasAttribute('aria-label')) { if (t0) b.title = t0; else b.removeAttribute('title'); b.removeAttribute('aria-label'); }
  }
}
