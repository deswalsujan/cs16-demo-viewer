"""The HUD layer in the game's look (0.28.0): the kill feed and the spectator bars on the 3D view, POV mode's HUD on the
600-line basis (tests/logs/kill-feed-spectating-2026-11-27.md, "The build plan", PR 2; tests/logs/0.28.0.md).

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 hud_check.py [page.html] [shots dir]
Needs SK vs Na`Vi, Train, DreamHack Winter 2011 (sk-vs-navi-dhwinter2011-1111261019-de_train) and the GP Tourney POV
(Team Guardians vs Lanka Dahan, Mirage, 25 Oct 2026; forgotten-de_mirage-2026), with de_train and de_mirage_32.
Exit code 0 = pass. Fails on 0.27.7 (no bars while following, 5 rows in 3D, the names under a flashbang's white).

1. SK vs Na`Vi at demo 1382.0 s (R9 0:31, after markeloff on RobbaN), Player's eyes on Na`Vi Zeus /A/, Vanilla, the
   3D view 800x600 at 1 device pixel a CSS pixel, against what Sujan's 800x600 shot of his game has
   (docs/reference/zeus-r9/800x600/20261127163514_1.jpg, measured in the log, 5): the bars 0 to 79 and 520 to 599;
   4 kill feed rows, each name's first ink row where his shot has it; each victim's last letter at 783 within 1 px; the red names'
   ink against the shot's (the side held to the edge within 1 px, the other within 4% of the name: the browser's letters
   aren't the game's, tests/logs/hud-text-variants-2026-11-28.md); the top bar's lines ending at 677, capitals at 20 and
   36; the bottom name centred at his height; every printable character drawn with ink (at least half covered) at both
   sizes; i, j, ! ? : ; keep the empty row between dot and stem (no pixel half covered) where the browser's own smoothed
   drawing has one (Sujan, 28 Nov 2026: Na`Vi read Na`Vf in the hard-edged text he dropped the same day).
2. The same at 1440x900 (1.5 device pixels a unit) and 2560x1440 (2.4): the bars and rows where the scale puts them, and
   even strokes: each run of a name's ink across a row weighs the scale times its weight at 800x600 (within a third of
   a pixel), where the nearest pixel would make 1-unit strokes 1 or 2 pixels.
3. The free camera: the game's kill feed, no bars, the header's score back. Theatre mode with the side panel out (0.28.1):
   the feed's rows end left of the panel, none of the feed under it.
4. The GP Tourney POV: alive at R20 1:22, the radar 128 units (128 px at 600 lines; 100 up to 0.27.7) and the feed's
   first row at 42; dead at R5 with the bomb down, the bars with his money; R3 1:17 at full flashbang white with the
   whiteout ticked, the names drawn over the white, the icons added onto it.
"""
import functools, http.server, json, os, shutil, sys, threading
from playwright.sync_api import sync_playwright
import demo_dirs

here = os.path.dirname(os.path.abspath(__file__))
page = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'index.html'))
shots = sys.argv[2] if len(sys.argv) > 2 else None
hl, inside, outside = demo_dirs.collect()
SK = demo_dirs.find('sk-vs-navi-dhwinter2011-1111261019-de_train', inside, outside).lower()
POVD = demo_dirs.find('forgotten-de_mirage-2026', inside, outside).lower()
HL = demo_dirs.stage(outside)
html = open(page, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
root = os.path.join(os.path.dirname(page), '_hud_check')
os.makedirs(root, exist_ok=True)
open(os.path.join(root, 'page.html'), 'w', encoding='utf-8').write(html)
shutil.copy(os.path.join(here, '..', 'docs', 'reference', 'zeus-r9', '800x600', '20261127163514_1.jpg'), os.path.join(root, 'his.jpg'))
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = functools.partial(Quiet, directory=root)
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/page.html'
THREE = os.path.join(here, '..', 'src', 'vendor', 'three.min.js')
results = []
def check(name, ok, detail=''):
    results.append(ok)
    print(('PASS ' if ok else 'FAIL ') + name + (('  ' + str(detail)) if detail else ''))

# page-side helpers: the layers' pixels, and where things are on them
HELPERS = r"""
// the kill feed's rows on the 3D view: the game's (0.28.0), or the viewer's own boxes on older builds
window.__rows = () => typeof HUDF !== 'undefined' ? HUDF.rows : [...$('feed').children].map((d) => { const r = d.getBoundingClientRect(), g = $('gl').getBoundingClientRect(); return { top: (r.top - g.top) * 600 / g.height }; });
window.__frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r))));
window.__px = (id) => { const c = $(id), g = c.getContext('2d'); return { w: c.width, h: c.height, d: g.getImageData(0, 0, c.width, c.height).data }; };
// premultiplied colour of a pixel
window.__pm = (P, x, y) => { const o = (y * P.w + x) * 4, a = P.d[o + 3] / 255; return [P.d[o] * a, P.d[o + 1] * a, P.d[o + 2] * a, P.d[o + 3]]; };
window.__isRed = (c) => c[0] > 170 && c[1] < 120 && c[2] < 120 && c[2] > 35 && Math.abs(c[1] - c[2]) < 40; // T names, not the orange icons
window.__isBlue = (c) => c[2] > 200 && c[1] > 170 && c[0] > 110 && c[0] < 200;
// the first and last ink column on a band of rows, or null
// text by its hue at half coverage or more (the layer's own colour, not premultiplied): its soft edge over the black shadow
// is darker, but keeps the team colour's lead over the other channels
window.__hue = (P, x, y) => { const o = (y * P.w + x) * 4, r = P.d[o], g = P.d[o + 1], b = P.d[o + 2]; return P.d[o + 3] >= 128 && ((r > g + 60 && r > b + 60) || (b > r + 40 && g > r + 20)); };
window.__ext = (get, x0, x1, y0, y1, pred) => {
  let lo = null, hi = null;
  for (let x = x0; x < x1; x++) { let on = false; for (let y = y0; y < y1 && !on; y++) on = pred(get(x, y)); if (on) { if (lo == null) lo = x; hi = x; } }
  return lo == null ? null : [lo, hi];
};
"""

def open_demo(pg, name, pov=False):
    pg.evaluate('__v("window.__oldD = D; 0")')
    pg.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === ${JSON.stringify(n)}))`)', name)
    pg.wait_for_function('__v("!!(D && D !== window.__oldD && M && MAP && R3 && view3.map === MAP.name' + (' && POV.on' if pov else '') + ')")', timeout=300000)
    pg.evaluate('__v("closeSummary()")')

def ev(pg, js):
    return pg.evaluate('(c) => __v(c)', js)

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    errs = []
    pg = b.new_page(viewport={'width': 800, 'height': 600}, device_scale_factor=1)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
    pg.goto(url)
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
    open_demo(pg, SK)
    ev(pg, HELPERS + '0')
    has = ev(pg, "typeof HUDF !== 'undefined' && typeof drawGameBars === 'function'")
    check('the build has the HUD layer (hud.js)', has)
    # 1. 800x600: Theatre mode with the controls hidden, the view the whole window
    def moment(cam, T=1382.0):
        return ev(pg, f"""(async () => {{ setView('3d'); setTheatre(true); setVanilla(true);
          const zeus = Object.keys(D.slots).map(Number).find((e) => /Zeus/.test(nameAt(e, {T})));
          selected = zeus; playing = false; setCam('{cam}', true); T = {T}; await __frames(); await new Promise((r) => setTimeout(r, 1500)); await __frames();
          const r = $('gl').getBoundingClientRect(); return {{ zeus, gl: [r.width, r.height], dpr: devicePixelRatio, spec: [$('spec3').width, $('spec3').height] }}; }})()""")
    m = moment('eyes')
    print('800x600:', json.dumps(m))
    check('the 3D view is 800x600 device pixels', m['spec'] == [800, 600], m['spec'])
    L = ev(pg, r"""(() => {
      const S = __px('spec3'), A = __px('hud3'), W = S.w, H = S.h;
      // the bars: alpha by row, at a column clear of the text
      const aAt = (y) => S.d[(y * W + 20) * 4 + 3];
      const bars = { top: [aAt(0), aAt(79), aAt(80)], bottom: [aAt(519), aAt(520), aAt(599)] };
      // the kill feed: each 20-unit band from 80, its first ink row (capitals), its rightmost ink column, red names, icons
      const rows = [];
      for (let i = 0; i < 6; i++) {
        const y0 = 80 + 20 * i, y1 = y0 + 18; let capTop = null, right = -1, red = [];
        for (let y = y0; y < y1; y++) for (let x = W / 2; x < W; x++) { if (__hue(S, x, y)) { if (capTop == null) capTop = y; right = Math.max(right, x); } }
        if (capTop == null) continue;
        const nm = __ext((x, y) => __pm(S, x, y), 300, W, y0, y1, (c) => __isRed(c) && c[3] > 128);
        const ic = __ext((x, y) => __pm(A, x, y), 300, W, y0, y0 + 16, (c) => c[3] > 40);
        rows.push({ inkTop: capTop, right, red: nm, icons: ic });
      }
      // top bar: the lines' right ends and capitals (BaseText 255 176 0 over the bar)
      const isBase = (c) => c[0] > 150 && c[1] > 90 && c[1] < 200 && c[2] < 60;
      let l1 = { top: null, right: -1 }, l2 = { top: null, right: -1 };
      for (let y = 10; y < 50; y++) for (let x = 400; x < 690; x++) { const c = __pm(S, x, y); if (!isBase(c)) continue; const L = y < 30 ? l1 : l2; if (L.top == null) L.top = y; L.right = Math.max(L.right, x); }
      let bn = { top: null, left: W, right: -1 }; // the first ink row, ascenders and the ` included
      for (let y = 540; y < 590; y++) for (let x = 0; x < W; x++) { const c = __pm(S, x, y); if (!(__isRed(c) && c[3] > 128)) continue; if (bn.top == null) bn.top = y; bn.left = Math.min(bn.left, x); bn.right = Math.max(bn.right, x); }
      return { bars, rows, l1, l2, bottom: bn, pill: $('rclock').innerText, scoreShown: getComputedStyle($('scA')).display !== 'none', povBox: !$('pov').hidden, legendBottom: getComputedStyle($('legend')).bottom };
    })()""")
    print(json.dumps(L))
    if shots: os.makedirs(shots, exist_ok=True); pg.screenshot(path=os.path.join(shots, 'sk-800x600-eyes.png'))
    bt, bb = L['bars']['top'], L['bars']['bottom']
    check('800x600: bars 0 to 79 and 520 to 599, black at 196', bt[0] == 196 and bt[1] == 196 and bt[2] == 0 and bb[0] == 0 and bb[1] == 196 and bb[2] == 196, L['bars'])
    rows = L['rows']
    check('800x600: 4 kill feed rows', len(rows) == 4, len(rows))
    # within 1 px: the smoothed text's last column is half covered, so its shadow beneath can tip a soft edge either way
    check("800x600: each row's last letter at 783 (his shot's), within 1 px", len(rows) == 4 and all(abs(r['right'] - 783) <= 1 for r in rows), [r['right'] for r in rows])
    # his shot: the red name on each row
    # his shot: the red name on each row, leaving out the columns our icons take (his orange icons over the walls read red),
    # its first ink row, and the bottom name's ink
    his = pg.evaluate(r"""async (icons) => { const im = new Image(); im.src = 'his.jpg'; await im.decode();
      const c = document.createElement('canvas'); c.width = 800; c.height = 600; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const P = { w: 800, h: 600, d: g.getImageData(0, 0, 800, 600).data }, out = [];
      for (let i = 0; i < 4; i++) {
        const y0 = 80 + 20 * i, ic = icons[i], off = (x) => ic && x >= ic[0] - 2 && x <= ic[1] + 2;
        const ext = __ext((x, y) => __pm(P, x, y), 300, 800, y0, y0 + 18, (c) => __isRed(c));
        const get = (x, y) => (off(x) ? [0, 0, 0, 0] : __pm(P, x, y));
        let top = null; for (let y = y0; y < y0 + 18 && top == null; y++) for (let x = 300; x < 800; x++) if (__isRed(get(x, y))) { top = y; break; }
        out.push({ red: __ext(get, 300, 800, y0, y0 + 18, (c) => __isRed(c)), inkTop: top });
      }
      let bn = { top: null, left: 800, right: -1 };
      for (let y = 540; y < 590; y++) for (let x = 0; x < 800; x++) if (__isRed(__pm(P, x, y))) { if (bn.top == null) bn.top = y; bn.left = Math.min(bn.left, x); bn.right = Math.max(bn.right, x); }
      return { rows: out, bottom: bn }; }""", [r['icons'] for r in rows])
    check('800x600: the rows 20 apart, each name\'s first ink row where his shot has it (within 1 px)', len(rows) == 4 and all(his['rows'][i]['inkTop'] is not None and abs(r['inkTop'] - his['rows'][i]['inkTop']) <= 1 for i, r in enumerate(rows)), [(r['inkTop'], his['rows'][i]['inkTop']) for i, r in enumerate(rows)])
    hisb = his['bottom']; his = [x['red'] for x in his['rows']]
    print('his red names:', json.dumps(his), 'ours:', json.dumps([r['red'] for r in rows]))
    # rows 1 and 3: the victim (held to the right edge); rows 2 and 4: the killer (held by the icons and the victim)
    ok, det = len(rows) == 4, []
    for i, r in enumerate(rows[:4]):
        if not his[i] or not r['red']: ok = False; det.append((i, 'no red name')); continue
        hs, us = his[i], r['red']
        width = hs[1] - hs[0] + 1
        if i in (0, 2): good = abs(us[1] - hs[1]) <= 1 and abs(us[0] - hs[0]) <= max(1, round(width * 0.04))
        else: good = abs(us[1] - hs[1]) <= max(1, round(width * 0.03)) + 2 and abs(us[0] - hs[0]) <= max(1, round(width * 0.03)) + 3
        det.append((i + 1, 'his', hs, 'ours', us)); ok = ok and good
    check("800x600: the red names' ink against his shot (victims within 1 px at the edge and 4% of the name; killers within the CT victim's letters)", ok, det)
    G = ev(pg, r"""(() => { if (typeof hudMask !== 'function') return null; const empty = [];
      for (const f of [HUD_EF, HUD_DF]) for (let c = 33; c < 127; c++) { const ch = String.fromCharCode(c), m = hudMask(ch, f); if (!(m.inkR >= m.inkL)) empty.push(f.name + ch); }
      return empty; })()""")
    check('every printable character has ink in the feed and the bars', G == [], G)
    # i, j, ! ? : ;: the rows holding text (at least half covered) as groups of consecutive rows, in the shipped text and in
    # the browser's own smoothed drawing of the letter (no smear); where the drawing parts dot and stem, the text must too
    PARTS = ev(pg, r"""(() => { if (typeof hudMask !== 'function') return null;
      const groups = (d, W, H) => { const rows = []; for (let y = 0; y < H; y++) { let on = false; for (let x = 0; x < W && !on; x++) on = d[(y * W + x) * 4 + 3] >= 128; rows.push(on); }
        let g = 0; rows.forEach((on, y) => { if (on && !rows[y - 1]) g++; }); return g; };
      const out = {};
      for (const f of [HUD_EF, HUD_DF]) for (const ch of 'ij!?:;') {
        const m = hudMask(ch, f), c = m.cv, W = c.width, H = c.height;
        const s = document.createElement('canvas'); s.width = W; s.height = H; const g = s.getContext('2d');
        g.font = f.css; g.fillStyle = '#fff'; g.textBaseline = 'alphabetic'; g.fillText(ch, m.ox, 20);
        out[f.name + ' ' + ch] = { drawn: groups(g.getImageData(0, 0, W, H).data, W, H), text: groups(c.getContext('2d').getImageData(0, 0, W, H).data, W, H) };
      }
      return out; })()""")
    has = {k: v for k, v in (PARTS or {}).items() if v['drawn'] >= 2}
    check('800x600: i, j, ! ? : ; keep the empty row between dot and stem where the smoothed drawing has one (feed and bars)', bool(has) and all(v['text'] >= v['drawn'] for v in has.values()),
          {'kept': sorted(k for k, v in has.items() if v['text'] >= v['drawn']), 'lost': sorted(k for k, v in has.items() if v['text'] < v['drawn']), 'no gap in the drawing': sorted(k for k, v in (PARTS or {}).items() if v['drawn'] < 2)})
    check('800x600: top bar lines end at 677 (within 1 px), capitals at 20 and 36', L['l1']['top'] is not None and L['l2']['top'] is not None and abs(L['l1']['right'] - 677) <= 1 and abs(L['l2']['right'] - 677) <= 1 and L['l1']['top'] == 20 and L['l2']['top'] == 36, (L['l1'], L['l2']))
    bn = L['bottom']
    check('800x600: the bottom name centred and at his height (his ink 330 to 469)', bn['top'] is not None and abs(bn['top'] - hisb['top']) <= 1 and abs((bn['left'] + bn['right']) / 2 - (hisb['left'] + hisb['right']) / 2) <= 1.5, (bn, hisb))
    check('800x600: no name box, the round pill "Round 9" alone; in Theatre mode the header keeps its score (it slides in over the top bar)', not L['povBox'] and L['scoreShown'] and L['pill'].strip() == 'Round 9', (L['povBox'], L['scoreShown'], L['pill']))

    # Theatre mode with the side panel out (0.28.1; Sujan, 28 Nov 2026: the feed keeps left of the panel, as in 0.27.7):
    # the rows end 15 units left of the panel's edge, no feed ink under the panel; back at the view's edge when it goes
    TH = ev(pg, r"""(async () => { thShow('r', true); await __frames(); await new Promise((r) => setTimeout(r, 600)); await __frames();
      const g = $('radar').getBoundingClientRect(), sd = $('side').getBoundingClientRect(), edge = sd.left - g.left, k = g.height / 600;
      const S = __px('spec3'), A = __px('hud3'), dp = S.w / g.width; let ink = 0;
      for (let y = Math.round(82 * k * dp); y < Math.round(160 * k * dp); y++) for (let x = Math.ceil(edge * dp); x < S.w; x++) if (S.d[(y * S.w + x) * 4 + 3] > 40 || A.d[(y * A.w + x) * 4 + 3] > 40) ink++;
      const out = { edge: Math.round(edge), want: Math.round(edge - 15 * k), rows: HUDF.rows.map((r) => Math.round(r.right)), inkUnderPanel: ink };
      thShow('r', false); await __frames(); await new Promise((r) => setTimeout(r, 600)); await __frames();
      out.full = Math.round(g.width - 15 * k); out.after = HUDF.rows.map((r) => Math.round(r.right));
      return out; })()""")
    if shots: pg.screenshot(path=os.path.join(shots, 'sk-800x600-theatre-panel.png'))
    check('Theatre mode, the side panel out: the feed\'s rows end 15 units left of it, none of the feed under it; back at the edge when it goes',
          TH['edge'] < 800 and TH['rows'] and all(abs(r - TH['want']) <= 1 for r in TH['rows']) and TH['inkUnderPanel'] == 0 and TH['after'] and all(abs(r - TH['full']) <= 1 for r in TH['after']), TH)

    # 2. the scale at 1440x900 and 2560x1440: the bars, the rows, even strokes
    def run_profile(row_unit):
        return ev(pg, f"""(() => {{ const S = __px('spec3'), k = S.h / 600, y = Math.floor(({row_unit} + 0.5) * k);
          const xs = []; let run = null;
          for (let x = 0; x < S.w; x++) {{ const c = __pm(S, x, y), cov = c[0] > 2 * c[1] + 10 ? c[0] / 255 : 0;
            if (cov > 0.02) {{ if (!run) run = [x, 0]; run[1] += cov; }} else if (run) {{ xs.push(run); run = null; }} }}
          return {{ k, runs: xs.filter((r) => r[0] > S.w / 2) }}; }})()""")
    base = run_profile(87)  # through the capitals of row 1's victim, Na`Vi starix
    for vw, vh in ((1440, 900), (2560, 1440)):
        pg.set_viewport_size({'width': vw, 'height': vh})
        moment('eyes')
        G = ev(pg, r"""(() => { const S = __px('spec3'), k = S.h / 600, W = S.w;
          const aAt = (y) => S.d[(y * W + 20) * 4 + 3];
          let barEnd = 0; for (let y = 0; y < S.h / 2 && aAt(y) > 150; y++) barEnd = y + 1;
          let capTop = null; for (let y = Math.floor(80 * k); y < Math.floor(100 * k) && capTop == null; y++) for (let x = W / 2; x < W; x++) { const c = __pm(S, x, y); if (c[3] > 128 && (__isRed(c) || __isBlue(c))) { capTop = y; break; } }
          return { k, size: [W, S.h], barEnd, capTop, rows: __rows().length }; })()""")
        prof = run_profile(87)
        # each run of ink: its weight against 800x600's, times the scale; matched in order from the right edge
        a, c = base['runs'][::-1], prof['runs'][::-1]
        ratios = [round(c[j][1] / a[j][1], 3) for j in range(min(len(a), len(c))) if a[j][1] > 0.5]
        k = G['k']
        print(f'{vw}x{vh}:', json.dumps(G), 'runs', len(a), len(c), 'weights / 800x600', ratios)
        if shots: pg.screenshot(path=os.path.join(shots, f'sk-{vw}x{vh}-eyes.png'))
        check(f'{vw}x{vh}: the top bar ends at 80 units ({80 * k:.1f} px, within 1 px)', abs(G['barEnd'] - 80 * k) <= 1, G['barEnd'])
        want = (rows[0]['inkTop'] if rows else 82) * k
        check(f'{vw}x{vh}: the first row\'s ink from {want / k:.0f} units ({want:.1f} px, within 1 px)', G['capTop'] is not None and abs(G['capTop'] - want) <= 1, G['capTop'])
        check(f'{vw}x{vh}: even strokes: every run of ink weighs {k:.1f} times its 800x600 weight (within 0.34 px)', len(a) == len(c) and len(ratios) > 3 and all(abs(r * a[j][1] - k * a[j][1]) <= 0.34 for j, r in enumerate(ratios)), ratios)
    pg.set_viewport_size({'width': 800, 'height': 600})

    # outside Theatre mode, following: the header's score hidden, the camera buttons under the top bar
    F0 = ev(pg, r"""(async () => { setTheatre(false); await __frames(); await new Promise((r) => setTimeout(r, 400)); await __frames();
      const g = $('gl').getBoundingClientRect(), c = $('cam3').getBoundingClientRect(), l = $('legend').getBoundingClientRect(), bh = parseFloat($('radar').style.getPropertyValue('--bar-h'));
      return { scoreShown: getComputedStyle($('scA')).display !== 'none', barH: bh, camTop: c.top - g.top, legendBottom: g.bottom - l.bottom, legendTop: l.top - g.top, viewH: g.height, nameTop: 560 * g.height / 600 }; })()""")
    # the strip inside the bottom bar, above the followed player's name, since 0.28.1 (Sujan, 28 Nov 2026; above the bar in 0.28.0)
    check('outside Theatre mode, following: no header score, the camera buttons under the top bar, the strip inside the bottom bar above the name', not F0['scoreShown'] and abs(F0['barH'] - F0['viewH'] * 80 / 600) <= 1 and F0['camTop'] >= F0['barH'] and F0['legendTop'] >= F0['viewH'] - F0['barH'] and F0['viewH'] - F0['legendBottom'] <= F0['nameTop'], F0)
    # 3. the free camera: the game's feed, no bars, the header's score back
    moment('free')
    F = ev(pg, r"""(async () => { setTheatre(false); await __frames(); await new Promise((r) => setTimeout(r, 300)); updateHud(true); await __frames();
      const S = __px('spec3'); return { topAlpha: S.d[(10 * S.w + 20) * 4 + 3], rows: __rows().length, bars: $('radar').classList.contains('bars'), scoreShown: getComputedStyle($('scA')).display !== 'none', pill: $('rclock').innerText,
        domFeedShown: getComputedStyle($('feed')).display !== 'none' }; })()""")
    check('free camera: no bars, the game\'s kill feed, the header\'s score and the pill\'s clock back', F['topAlpha'] == 0 and not F['bars'] and F['rows'] == 4 and F['scoreShown'] and ':' in F['pill'] and not F['domFeedShown'], F)
    F2 = ev(pg, r"""(async () => { let t = null; for (const k of D.kills) { const r = roundAt(k.t + 0.01); if (D.kills.filter((q) => q.t <= k.t + 0.01 && q.t > k.t + 0.01 - 6 && r && q.t >= r.start).length >= 5) { t = k.t + 0.01; break; } }
      if (t == null) return { none: true };
      playing = false; T = t; await __frames(); await new Promise((r) => setTimeout(r, 400)); await __frames(); const rows3 = __rows().length;
      setView('2d'); await __frames(); updateHud(true); lastFeedKey = ''; updateFeed(); await __frames();
      return { t, rows3, domRows: $('feed').children.length, shown: getComputedStyle($('feed')).display !== 'none', bars: $('radar').classList.contains('bars') }; })()""")
    check('at most 4 rows in 3D; 2D keeps the viewer\'s own kill feed (5 rows), no bars', not F2.get('none') and F2['rows3'] == 4 and F2['shown'] and F2['domRows'] == 5 and not F2['bars'], F2)

    # 4. the GP Tourney POV
    pg.set_viewport_size({'width': 800, 'height': 600})
    open_demo(pg, POVD, pov=True)
    ev(pg, HELPERS + '0')
    def pov_at(rn, clock_s, extra=''):
        # the round's clock: seconds left on the round timer; found by scanning the round for that clock text
        return ev(pg, f"""(async () => {{ setView('3d'); setTheatre(true); setVanilla(false); {extra}
          const r = M.liveR.find((x) => x.ln === {rn}); let t = r.start;
          for (let x = r.start; x < r.end; x += 0.05) {{ const c = clockAt(x, true); if (c && c.text === '{clock_s}') {{ t = x + 0.5; break; }} }}
          playing = false; T = t; await __frames(); await new Promise((r) => setTimeout(r, 1500)); await __frames();
          return {{ t, mode: POV.mode, rad: $('radar').style.getPropertyValue('--pov-radar'), rows: __rows().map((r) => Math.round(r.top)), bars: $('radar').classList.contains('bars') }}; }})()""")
    A = pov_at(20, '1:22')
    print('GP Tourney POV R20 1:22:', json.dumps(A))
    if shots: pg.screenshot(path=os.path.join(shots, 'pov-r20-alive.png'))
    check('POV alive: the radar 128 units, 128 px at 600 lines (100 up to 0.27.7)', A['rad'] == '128px', A['rad'])
    check('POV alive: the feed\'s first row at 42, no bars', A['mode'] == 0 and (not A['rows'] or A['rows'][0] == 42) and not A['bars'], A)
    Dd = ev(pg, r"""(async () => { const r = M.liveR.find((x) => x.ln === 5);
      let t = null; for (let x = r.start + 5; x < r.end; x += 0.25) { const [mode, tg] = povObs(x); POV.i = 0; if (mode !== 0 && !(tg === povView(x).rec && mode !== 4)) { const c = clockAt(x, true); if (c && c.phase === 'bomb') { t = x; break; } } }
      POV.i = 0;
      if (t == null) return { none: true };
      playing = false; T = t; await __frames(); await new Promise((r) => setTimeout(r, 800)); await __frames();
      const S = __px('spec3'), isBase = (c) => c[0] > 150 && c[1] > 90 && c[1] < 200 && c[2] < 60;
      let upperInk = 0; for (let y = 17; y < 29; y++) for (let x = S.w - 100; x < S.w - 20; x++) if (isBase(__pm(S, x, y))) upperInk++;
      return { t, bars: $('radar').classList.contains('bars'), money: lastAt(D.hud.money, 2, POV.t), upperInk, rows: __rows().map((r) => Math.round(r.top)), pill: $('rclock').innerText }; })()""")
    print('GP Tourney POV R5, dead, bomb down:', json.dumps(Dd))
    if shots: pg.screenshot(path=os.path.join(shots, 'pov-r5-dead.png'))
    check('POV dead: the bars, his money on the upper line, the feed from 80, the pill "Round 5" alone', not Dd.get('none') and Dd['bars'] and Dd['upperInk'] > 20 and (not Dd['rows'] or Dd['rows'][0] == 80) and Dd['pill'].strip() == 'Round 5', Dd)
    # full white: a moment with a white ScreenFade at 255 and kill feed rows
    Wt = ev(pg, r"""(async () => { $('fbWhite3').checked = true; let t = null;
      for (const r of M.liveR) { for (let x = r.start; x < r.end && t == null; x += 0.1) if (povFlashAt(x) >= 255 && D.kills.some((k) => k.t <= x && k.t > x - 6 && k.t >= r.start)) t = x; if (t != null) break; }
      if (t == null) return { none: true };
      playing = false; T = t; await __frames(); await new Promise((r) => setTimeout(r, 800)); await __frames();
      // name pixels in the kill feed's band only (from 42 or 80 units, 4 rows), right of a third of the width
      const S = __px('spec3'), k = S.h / 600; let names = 0;
      for (let y = Math.floor(40 * k); y < Math.ceil(165 * k); y++) for (let x = Math.floor(S.w / 3); x < S.w; x++) { const i = (y * S.w + x) * 4, a = S.d[i + 3] / 255; if (a > 0.5 && ((S.d[i] > 170 && S.d[i + 1] < 120) || (S.d[i + 2] > 200 && S.d[i] < 200))) names++; }
      const f3 = $('flash3'), sp = $('spec3'), hu = $('hud3');
      // the names' layer after the whiteout in the page, at the same z-index; the icons' layer added onto the picture
      const order = (a, b) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
      return { t, flash: povFlashAt(t), flashShown: !f3.hidden, namesPx: names, specAfterFlash: order(f3, sp) && getComputedStyle(sp).zIndex === getComputedStyle(f3).zIndex, hudAdds: getComputedStyle(hu).mixBlendMode, rows: __rows().length }; })()""")
    print('full white:', json.dumps(Wt))
    if shots: pg.screenshot(path=os.path.join(shots, 'pov-full-white.png'))
    check('full flashbang white: the names drawn over the whiteout, the icons added onto the picture', not Wt.get('none') and Wt['flashShown'] and Wt['namesPx'] > 100 and Wt['specAfterFlash'] and Wt['hudAdds'] == 'plus-lighter' and Wt['rows'] > 0, Wt)
    ev(pg, "$('fbWhite3').checked = false; 0")
    check('no page errors', not errs, errs[:5])
    b.close()
srv.shutdown()
shutil.rmtree(root, ignore_errors=True)
print('ALL PASS' if all(results) else f'{results.count(False)} FAILED')
sys.exit(0 if all(results) else 1)
