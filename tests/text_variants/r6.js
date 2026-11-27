// R6, the HUD's hard-edged text as it was in #73 at commit 778510a (28 Nov 2026), kept for the record: Sujan dropped it
// the same day (I and J merged into a box, $ lost its bar, # malformed, the ! broke) and #73 ships plain smoothed text
// instead (src/hud.js). Loaded by variants.html for its 'r6' mode, which the character sheet (sheet.py) uses. Not part of
// the build. Renamed from src/hud.js's names (hudMask to r6Mask and so on) so both can load in one page.
// ---------------- the game's text ----------------
// The kill feed (and the chat, 0.28.1) are TrackerScheme's EngineFont, the spectator bars ClientScheme's Default: Verdana
// at weight 600 with no antialias line in any band, EngineFont with a drop shadow (docs/reference/game-schemes). At
// 800x600, Windows draws weight 600 as Verdana Regular made bold, each letter 1 px wider and smeared 1 px to the right
// (tests/logs/kill-feed-spectating-2026-11-27.md, 5). The browser's own Verdana, drawn as R6 (Sujan, 28 Nov 2026, on #73;
// tests/logs/hud-text-variants-2026-11-28.md): each letter drawn on its own at a whole pixel, its advance rounded to whole
// pixels, 1 px between letters; of each letter the pixels the browser's smoothing covers most are kept, as many as 0.8
// times its smoothed coverage adds up to, so every pixel is fully on or off and no letter or thin part vanishes however
// the browser smooths; then the 1-px smear, and for EngineFont the 1-px black shadow right and down. The feed at 12.34 px,
// the em the scheme's height gives (15 / 1.2153), the bars at 11 px. Against his 800x600 shot: the bars within 0.2 px of
// the game's widths, the feed 1.8% narrower; strokes 2.26 and 2.39 px against the game's 2.15. Up to the first build of
// 0.28.0 (#73 before 28 Nov 2026): the whole line drawn at once at 12 px with 1 px between letters, every pixel cut at half
// and smeared, which left strokes 2 or 3 px wide by where each letter fell and letters touching, 20% heavier.
const R6_FACE = 'Verdana, "DejaVu Sans", "Liberation Sans", sans-serif';
const R6_EF = { css: `400 12.34px ${R6_FACE}`, shadow: true, name: 'EF' };
const R6_DF = { css: `400 11px ${R6_FACE}`, shadow: false, name: 'DF' };
const R6_KEEP = 0.8; // of each letter's smoothed coverage
const R6_TXT = new Map(), R6_GLYPH = new Map();
const r6Measure = document.createElement('canvas').getContext('2d');
// Which pixels of one letter's smoothed drawing (S, w by h) it keeps (Sujan, 28 Nov 2026, on #73: the i read as an f, its
// dot 3 px wide and its stem with a bump under it). (0) A gap row the browser's smoothing half fills: a row of the letter
// whose strongest pixel is under 200 and fainter by 64 or more than the pixels both above and below it (within 2 rows)
// keeps nothing; the 12.34 px ! reads 255, 190, 157, 255 down its stem and dot, where the game's hinted letter has an
// empty row. A row with a strong pixel anywhere (the a's right stem beside its curl) isn't a gap row. (1) The letter's parts: the pieces of its drawing at
// R6_PART or more, 4-connected, those gaps left out (an i's dot and stem, an accent and its letter, the dots of : ; ! ?),
// each fainter pixel going to the nearest piece. (2) Each part keeps its most covered pixels, as many as R6_KEEP times its own coverage (at least one); where the
// count falls inside a run of equally covered pixels (a stem's half-covered column), all of them or none, whichever comes
// nearer, so a stroke never gets a one-pixel bump. (3) A small part (4 pixels of coverage or less) wholly above or below a
// bigger one it overlaps (the i's dot, an accent) keeps runs no wider than the bigger part's usual run, so the dot is no
// wider than the stem. (4) Such stacked
// parts keep at least one empty row between them: a mark touching its stroke moves away from it, a row at a time.
const R6_PART = 96;
function r6Keep(S, w, h) {
  const n = w * h, lab = new Int32Array(n).fill(-1), parts = [], gap = new Uint8Array(n);
  for (let y = 1; y < h - 1; y++) {
    let top = -1; for (let x = 0; x < w; x++) { const k = y * w + x; if (S[k] && (top < 0 || S[k] > S[top])) top = k; }
    if (top < 0 || S[top] >= 200) continue;
    const up = Math.max(S[top - w], y > 1 ? S[top - 2 * w] : 0), dn = Math.max(S[top + w], y < h - 2 ? S[top + 2 * w] : 0);
    if (up >= 160 && dn >= 160 && up >= S[top] + 64 && dn >= S[top] + 64) for (let x = 0; x < w; x++) gap[y * w + x] = 1;
  }
  for (let k = 0; k < n; k++) {
    if (S[k] < R6_PART || gap[k] || lab[k] >= 0) continue;
    const id = parts.length, st = [k]; lab[k] = id; parts.push({ id, px: [] });
    while (st.length) {
      const q = st.pop(), x = q % w, y = (q / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const X = x + dx, Y = y + dy, r = Y * w + X;
        if (X >= 0 && Y >= 0 && X < w && Y < h && lab[r] < 0 && S[r] >= R6_PART && !gap[r]) { lab[r] = id; st.push(r); }
      }
    }
  }
  // the fainter pixels go to the nearest part, breadth first over the pixels with any ink
  let front = []; for (let k = 0; k < n; k++) if (lab[k] >= 0) front.push(k);
  while (front.length) {
    const next = [];
    for (const q of front) {
      const x = q % w, y = (q / w) | 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const X = x + dx, Y = y + dy, r = Y * w + X;
        if ((dx || dy) && X >= 0 && Y >= 0 && X < w && Y < h && lab[r] < 0 && S[r] > 0 && !gap[r]) { lab[r] = lab[q]; next.push(r); }
      }
    }
    front = next;
  }
  for (let k = 0; k < n; k++) if (lab[k] >= 0) parts[lab[k]].px.push(k);
  const keep = new Uint8Array(n);
  for (const P of parts) {
    const px = P.px.slice().sort((a, b) => S[b] - S[a] || a - b);
    let cov = 0; for (const k of px) cov += S[k];
    const N = Math.max(1, Math.round(cov / 255 * R6_KEEP)), t = S[px[Math.min(N, px.length) - 1]];
    let above = 0, eq = 0; for (const k of px) { if (S[k] > t) above++; else if (S[k] === t) eq++; }
    const withEq = above === 0 || Math.abs(above + eq - N) < Math.abs(above - N);
    for (const k of px) if (S[k] > t || (withEq && S[k] === t)) keep[k] = 1;
  }
  // each part's kept extent and its usual run (the most common width of its kept runs across a row)
  const info = () => parts.map((P) => {
    let x0 = w, x1 = -1, y0 = h, y1 = -1, cov = 0; const runs = {};
    for (const k of P.px) { cov += S[k]; if (!keep[k]) continue; const x = k % w, y = (k / w) | 0; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    for (let y = y0; y <= y1; y++) { let r = 0; for (let x = x0; x <= x1 + 1; x++) { const k = y * w + x; if (x <= x1 && keep[k] && lab[k] === P.id) r++; else if (r) { runs[r] = (runs[r] || 0) + 1; r = 0; } } }
    let run = 1, best = 0; for (const r in runs) if (runs[r] > best || (runs[r] === best && +r < run)) { best = runs[r]; run = +r; }
    return { id: P.id, x0, x1, y0, y1, cov, run };
  });
  const stacked = (A, B) => A.cov < B.cov && A.x1 >= B.x0 && A.x0 <= B.x1 && (A.y1 < B.y0 || A.y0 > B.y1);
  let I = info();
  for (const A of I) for (const B of I) {
    if (A.x1 < 0 || B.x1 < 0 || !stacked(A, B) || A.cov > 4 * 255) continue;
    // (3) A's runs no wider than B's usual run: of a longer run, its most covered pixels
    for (let y = A.y0; y <= A.y1; y++) {
      let x = A.x0;
      while (x <= A.x1) {
        const k = y * w + x;
        if (!(keep[k] && lab[k] === A.id)) { x++; continue; }
        let e = x; const run = [];
        while (e <= A.x1 && keep[y * w + e] && lab[y * w + e] === A.id) { run.push(y * w + e); e++; }
        if (run.length > B.run) run.sort((a, b) => S[b] - S[a] || a - b).slice(B.run).forEach((r) => { keep[r] = 0; });
        x = e;
      }
    }
  }
  I = info();
  for (const A of I) for (const B of I) {
    if (A.x1 < 0 || B.x1 < 0 || !stacked(A, B)) continue;
    // (4) an empty row between them: move A away from B while a kept pixel of A is next to one of B (8 neighbours)
    const up = A.y1 < B.y0;
    for (let step = 0; step < 3; step++) {
      let touch = false;
      for (let k = 0; k < n && !touch; k++) {
        if (!(keep[k] && lab[k] === A.id)) continue;
        const x = k % w, y = (k / w) | 0;
        for (let dy = -1; dy <= 1 && !touch; dy++) for (let dx = -1; dx <= 1; dx++) { const X = x + dx, Y = y + dy, r = Y * w + X; if (X >= 0 && Y >= 0 && X < w && Y < h && keep[r] && lab[r] === B.id) { touch = true; break; } }
        if (!touch && keep[k] && lab[k] === A.id) {
          // a row between: the rows next to A toward B must hold none of B's kept pixels
          const Y = y + (up ? 2 : -2);
          for (let dx = -1; dx <= 1 && !touch; dx++) { const X = x + dx, r = Y * w + X; if (X >= 0 && Y >= 0 && X < w && Y < h && keep[r] && lab[r] === B.id) touch = false; }
        }
      }
      if (!touch) break;
      const moved = [];
      for (let k = 0; k < n; k++) if (keep[k] && lab[k] === A.id) { keep[k] = 0; moved.push(k); }
      for (const k of moved) { const r = k + (up ? -w : w); if (r >= 0 && r < n) { keep[r] = 1; lab[r] = A.id; } }
    }
  }
  return keep;
}
// one letter: its advance (rounded) and the pixels it keeps, as offsets in a canvas 40 high with the letter at x 4,
// its baseline at 20
function r6Glyph(ch, f) {
  const key = f.name + '|' + ch;
  let G = R6_GLYPH.get(key);
  if (G) return G;
  r6Measure.font = f.css;
  const aw = r6Measure.measureText(ch).width, gw = Math.ceil(aw) + 8, h = 40;
  const c = document.createElement('canvas'); c.width = gw; c.height = h;
  const g = c.getContext('2d'); g.font = f.css; g.fillStyle = '#fff'; g.textBaseline = 'alphabetic'; g.fillText(ch, 4, 20);
  const d = g.getImageData(0, 0, gw, h).data, S = new Uint8Array(gw * h);
  for (let k = 0; k < gw * h; k++) S[k] = d[k * 4 + 3];
  const K = r6Keep(S, gw, h), keep = [];
  for (let k = 0; k < gw * h; k++) if (K[k]) keep.push([k % gw - 4, Math.floor(k / gw)]);
  G = { adv: Math.round(aw) + 1, keep };
  if (R6_GLYPH.size > 2000) R6_GLYPH.clear();
  R6_GLYPH.set(key, G);
  return G;
}
function r6Advance(str, f) { let w = 0; for (const ch of str) w += r6Glyph(ch, f).adv; return w; }
// the white mask of a text: { cv, ox, oy (where the text's origin sits in it), adv, inkL, inkR (ink columns from the origin) }
function r6Mask(str, f) {
  const adv = r6Advance(str, f), w = Math.ceil(adv) + 8, h = 40, ox = 3, oy = 6;
  const A = new Uint8Array(w * h);
  let x = 0;
  for (const ch of str) {
    const G = r6Glyph(ch, f);
    for (const [dx, y] of G.keep) { const X = ox + x + dx, Y = y - 20 + oy + 14; if (X >= 0 && X < w && Y >= 0 && Y < h) A[Y * w + X] = 1; }
    x += G.adv;
  }
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d'), id = g.createImageData(w, h), d = id.data;
  let inkL = w, inkR = -1;
  // the 1-px smear: each pixel also takes its left neighbour's ink
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (!(A[j * w + i] || (i > 0 && A[j * w + i - 1]))) continue;
    const o = (j * w + i) * 4; d[o] = d[o + 1] = d[o + 2] = d[o + 3] = 255; inkL = Math.min(inkL, i); inkR = Math.max(inkR, i);
  }
  g.putImageData(id, 0, 0);
  return { cv, ox, oy, adv, inkL: inkL - ox, inkR: inkR - ox };
}
