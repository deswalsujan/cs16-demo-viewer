"""Checks the search box over the demo list on the start screen (0.15.2), and the start screen's message line when
it comes back after a demo (0.26.12).

Usage: HALF_LIFE_DIR=/path/to/Half-Life DEMO_DIRS=... python3 demo_search_check.py [page.html] [screenshot.png]
Needs the Half-Life folder and DEMO_DIRS (for the demos, demo_dirs.py), not maps or sounds. Opens SK vs Na`Vi, Train,
DreamHack Winter 2011 from a filtered row, then again from a temporary Half-Life folder holding only that demo (a
clone or hard link, never moved) and a stand-in demo, so its map has no overview: up to 0.26.11 the message line still
said "Reading name…" when the start screen came back (Sujan, 3 Nov 2026). In 2D, the map ends above the controls along
the bottom of the view where it opens and after Reset view, at three window sizes (0.26.14). In 3D, Player's eyes keeps
the game's 4:3 view top to bottom at three window sizes, unzoomed and through the AWP's scope (0.26.15); this part needs
de_train's map and models in the Half-Life folder. Under a minute.
"""
import os, sys, http.server, functools, threading, tempfile, shutil, subprocess, atexit
from playwright.sync_api import sync_playwright
import demo_dirs

page_path = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'index.html'))
# a copy of the page with the test hook (window.__v), for the field of view checks in 3D; the shipped page is never changed
_html = open(page_path, encoding='utf-8').read(); _i = _html.rindex('})();')
hooked = os.path.join(os.path.dirname(page_path), '_test_demosearch.html')
open(hooked, 'w', encoding='utf-8').write(_html[:_i] + 'window.__v = (c) => eval(c);\n' + _html[_i:])
atexit.register(lambda: os.path.exists(hooked) and os.remove(hooked))
shot = sys.argv[2] if len(sys.argv) > 2 else None
_hl, _inside, _outside = demo_dirs.collect()
HL = demo_dirs.stage(_outside)
here = os.path.dirname(os.path.abspath(__file__))
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.dirname(page_path)); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
# every demo the viewer lists: the whole folder it's given, subfolders included
names = sorted(os.path.basename(p) for p in demo_dirs.dems(HL))
fails = []
def check(label, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + label + (f'  ({extra})' if extra else ''))
    if not ok: fails.append(label)

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']); pg = b.new_page(viewport={'width': 880, 'height': 1300})
    pg.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(hooked)}')
    check('no search box before a folder is chosen', pg.locator('#demoFind').is_hidden())
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_selector('#demoList button')
    rows = lambda: pg.eval_on_selector_all('#demoList button em', 'els => els.map((e) => e.textContent)')
    count = lambda: pg.inner_text('#demoN')
    check('search box shown with the full list and its count', pg.locator('#demoFind').is_visible() and len(rows()) == len(names) and count() == str(len(names)), count())
    for q in ['tu', 'TU', 'sk train', 'eswc2010 tuscan', 'dhwinter']:
        pg.fill('#demoQ', q)
        words = q.lower().split()
        want = [n for n in names if all(w in n.lower() for w in words)]
        got = rows()
        check(f'"{q}": exactly the demos whose names contain every word', sorted(got) == sorted(want), f'{len(got)} of {len(names)}')
        check(f'"{q}": count reads "{len(want)} of {len(names)}"', count().replace('\n', ' ').strip().lower() == f'{len(want)} of {len(names)}', count())
        marked = pg.eval_on_selector_all('#demoList button em', 'els => els.map((e) => [...e.querySelectorAll("mark")].map((m) => m.textContent.toLowerCase()).join("|"))')
        check(f'"{q}": every typed word highlighted in every row', all(all(any(w in m for m in mk.split('|')) for w in words) for mk in marked))
    pg.fill('#demoQ', 'sk train')
    if shot: pg.locator('.load-card').screenshot(path=shot)
    pg.fill('#demoQ', 'zzzz')
    check('no match: the list says so', 'No demo names contain "zzzz"' in pg.inner_text('#demoList'))
    pg.press('#demoQ', 'Escape')
    check('Esc clears the search and brings back the full list', pg.input_value('#demoQ') == '' and len(rows()) == len(names))
    check('Esc in the box does not open the shortcuts list', pg.locator('#keys').is_hidden())
    pg.fill('#demoQ', 'tu'); pg.click('#demoQx')
    check('Clear empties the box and brings back the full list', pg.input_value('#demoQ') == '' and len(rows()) == len(names) and pg.locator('#demoQx').is_hidden())
    # one row only: "sk train" also matches SK vs eSTRO's 13-second warmup files (WCG 2008) since the test demos joined
    pg.fill('#demoQ', 'sk navi train')
    check('"sk navi train": one row, SK vs Na`Vi, Train, DreamHack Winter 2011', rows() == ['sk-vs-navi-dhwinter2011-1111261019-de_train.dem'], ', '.join(rows()))
    pg.click('#demoList button')
    pg.wait_for_function('() => document.getElementById("load").hidden', timeout=120000)
    check('a filtered row opens its demo', True)

    # the 2D map ends above the controls along the bottom of the view (0.26.14, Sujan, 3 Nov 2026): where the map sits
    # when it opens or resets, at R1 freeze 0:12 (the moment the demo opens). The radar canvas is see-through outside
    # the map's image, so nothing drawn from the controls' top down means the map and its labels end above them
    under = """() => { const cv = document.getElementById('cv'), r = cv.getBoundingClientRect(), k = cv.width / r.width;
      const top = Math.min(...['legend', 'heatbar'].map((id) => document.getElementById(id).getBoundingClientRect().top)) - r.top;
      const y = Math.max(0, Math.floor(top * k)), g = cv.getContext('2d'), n = (y0, y1) => { let c = 0; const d = g.getImageData(0, y0, cv.width, Math.max(1, y1 - y0)).data; for (let i = 3; i < d.length; i += 4) if (d[i]) c++; return c; };
      return { below: n(y, cv.height), above: n(0, y), top: Math.round(top), clock: document.getElementById('rclock').textContent }; }"""
    pg.keyboard.press('Escape')  # the load summary, which would take the click on Reset view below
    pg.click('#viewSeg button[data-v="2d"]')
    pg.wait_for_function("() => { const c = document.getElementById('cv'); return c.width > 0 && c.getContext('2d').getImageData(c.width >> 1, c.height >> 1, 1, 1).data[3] > 0; }", timeout=30000)
    for w, h, label in [(1366, 768, '1366x768'), (2560, 1440, '2560x1440 (Interface size Auto, 130%)'), (880, 1300, 'the test\'s own 880x1300')]:
        pg.set_viewport_size({'width': w, 'height': h}); pg.wait_for_timeout(600)
        u = pg.evaluate(under)
        check(f'2D map at {label}: it ends above the Heatmap, Both sides and Whole match controls and the buttons beside them', u['below'] == 0 and u['above'] > 0,
              f"{u['below']} pixels drawn under the controls' top ({u['top']} px down), {u['above']} above it; {u['clock'].split('·', 1)[-1].strip()}")
    pg.set_viewport_size({'width': 1366, 'height': 768}); pg.wait_for_timeout(400)
    box = pg.locator('#cv').bounding_box(); pg.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
    for _ in range(4): pg.mouse.wheel(0, -300); pg.wait_for_timeout(80)
    pg.wait_for_timeout(300); zoomed = pg.evaluate(under)
    pg.click('#tgFit'); pg.wait_for_timeout(500); reset = pg.evaluate(under)
    check('2D map zoomed in goes under the controls, Reset view brings it back above them (1366x768)', zoomed['below'] > 0 and reset['below'] == 0 and reset['above'] > 0,
          f"zoomed: {zoomed['below']} pixels under; after Reset view: {reset['below']}")
    pg.set_viewport_size({'width': 880, 'height': 1300})

    # Player's eyes keeps the game's 4:3 view top to bottom (0.26.15, Sujan, 3 Nov 2026): the game's 90 degrees, or a
    # zoom level, is the width of a 4:3 picture, so on any view wider than 4:3 three.js's fov (top to bottom) is 73.74
    # unzoomed and 30.54 at the AWP's first zoom (40); a view narrower than 4:3 keeps the fov across its width. Up to
    # 0.26.14 every view kept 90 across, so at 2560x1440 it read 61.08 and guns and players looked 27% too big.
    # markeloff with the AWP at R23 1:22, 0.35 s before his kill on GeT_RiGhT, then at that kill (the pull request's moment)
    pg.click('#viewSeg button[data-v="3d"]')
    pg.wait_for_function('__v("!!(MAP && R3 && view3.map === MAP.name)")', timeout=120000)
    pg.evaluate('(c) => __v(c)', """(() => { const me = D.kills.find((k) => M.pl[k.kp] && /markeloff/.test(M.pl[k.kp].name)).killer;
      const k = D.kills.find((x) => x.killer === me && x.weapon === 'awp' && Math.abs(x.t - D.start - 2663.65) < 0.05);
      window.__fov = { me, eyes: D.start + 2663.3, scope: k.t - 0.05 }; selected = me; setCam('eyes', true); playing = false; })()""")
    at = lambda key: pg.evaluate('(c) => __v(c)', f"(async () => {{ T = __fov.{key}; await new Promise((r) => setTimeout(r, 400)); return {{ fov: R3.camera.fov, aspect: R3.camera.aspect, zoom: zoomLevel(__fov.me, T), clock: (clockAt(T) || {{}}).text }}; }})()")
    import math
    want = lambda game, aspect: 2 * math.degrees(math.atan(math.tan(math.radians(game / 2)) * max(0.75, 1 / aspect)))
    for w, h, label in [(1512, 982, 'a MacBook window, 1512x982'), (2560, 1440, '2560x1440'), (880, 1300, 'the test\'s own 880x1300, narrower than 4:3')]:
        pg.set_viewport_size({'width': w, 'height': h}); pg.wait_for_timeout(600)
        e, z = at('eyes'), at('scope')
        shape = (e['aspect'] > 4 / 3) == (w > 880)
        check(f"Player's eyes at {label}: 90 degrees across a 4:3 picture, and the AWP's first zoom by the same rule",
              shape and e['zoom'] == 0 and z['zoom'] == 1 and abs(e['fov'] - want(90, e['aspect'])) < 0.01 and abs(z['fov'] - want(40, z['aspect'])) < 0.01,
              f"view {e['aspect']:.3f} wide; fov top to bottom {e['fov']:.2f} unzoomed (want {want(90, e['aspect']):.2f}), {z['fov']:.2f} zoomed (want {want(40, z['aspect']):.2f}); R23 {e['clock']}")
    pg.click('#viewSeg button[data-v="2d"]')

    # the message line when the start screen comes back (0.26.12): empty, whether or not an overview loaded
    msg = lambda pg: pg.evaluate("document.getElementById('msg').textContent")
    def back_to_start(pg):
        pg.click('#btnOpen'); pg.wait_for_function('() => !document.getElementById("load").hidden', timeout=5000); pg.wait_for_timeout(500)
    back_to_start(pg)
    check('back to the start screen after a demo whose overview loaded: the message line is empty', msg(pg) == '', msg(pg))
    SK = 'sk-vs-navi-dhwinter2011-1111261019-de_train.dem'
    tmp = tempfile.mkdtemp(prefix='reading_msg_'); atexit.register(shutil.rmtree, tmp, True)
    hl2 = os.path.join(tmp, 'Half-Life'); os.makedirs(os.path.join(hl2, 'cstrike'))
    src = next(q for q in demo_dirs.dems(HL) if os.path.basename(q) == SK); dst = os.path.join(hl2, 'cstrike', SK)
    if not (sys.platform == 'darwin' and subprocess.run(['cp', '-c', src, dst], capture_output=True).returncode == 0):
        try: os.link(src, dst)
        except OSError: shutil.copy2(src, dst)
    stand_in = os.path.join(hl2, 'cstrike', 'deleted-later.dem'); open(stand_in, 'wb').write(b'\0' * 2000)
    # a new browser profile: the overviews the first pick saved in the browser would stand in for the missing one
    ctx2 = b.new_context(viewport={'width': 880, 'height': 1300}); pg2 = ctx2.new_page()
    pg2.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    pg2.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(hooked)}')
    pg2.set_input_files('#fFolder', hl2)
    pg2.wait_for_function("() => document.getElementById('hlStatus').textContent.includes('2 demos found.')", timeout=10000)
    pg2.click(f'#demoList button:has-text("{SK}")')
    pg2.wait_for_function('() => document.getElementById("load").hidden', timeout=120000)
    behind = msg(pg2)
    back_to_start(pg2)
    check('back to the start screen after a demo with no overview in the folder: the message line is empty (it said "Reading …" up to 0.26.11)',
          behind.startswith(f'Reading {SK}') and msg(pg2) == '', f'behind the view: {behind!r}; on the start screen: {msg(pg2)!r}')
    pg2.click('#btnOpen'); pg2.wait_for_function('() => document.getElementById("load").hidden', timeout=5000)
    os.remove(stand_in)
    pg2.click('#btnOpen')
    try: pg2.wait_for_function("() => document.getElementById('msg').textContent.includes('taken off the list')", timeout=5000)
    except Exception: pass
    check('a demo deleted while a demo was open: back on the start screen, its note still shows and the count says 1',
          msg(pg2).startswith('deleted-later.dem is no longer in your folder') and pg2.inner_text('#hlStatus') == '1 demo found.', f'{msg(pg2)!r}, {pg2.inner_text("#hlStatus")!r}')
    ctx2.close()
    b.close()
print(f'{len(fails)} failed' if fails else 'all passed')
sys.exit(1 if fails else 0)
