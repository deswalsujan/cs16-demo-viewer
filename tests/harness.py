"""Headless test harness for the CS 1.6 Demo Viewer.

Usage: python3 harness.py <page.html> <script.js>[,<script.js>...] [screenshot prefix]
Environment: HALF_LIFE_DIR (required), DEMO_DIRS (more folders with demos, see demo_dirs.py), THREE_JS (default src/vendor/three.min.js, for builds before 0.26.2, which load it from cdnjs), DEMO (the demo's file name or a part of it that only one demo has, default navi-vs-fx-sec2011-final-1110091531), MAP_NEEDED (default 1), POV_MODE (1: the POV mode setting on, 0.25.0)
Loads the page from a local server, feeds it the Half-Life folder (with the DEMO_DIRS demos
added, demo_dirs.py), opens the demo (Na`Vi vs FX, Dust2, SEC 2011 final by default), waits
for the 3D map, then runs <script.js> in the page and prints the JSON it returns. A DEMO that
more than one demo's name contains stops with the list (Sujan, 1 Nov 2026).
"""
import os, sys, json, os, threading, http.server, functools, time
from playwright.sync_api import sync_playwright
import demo_dirs

# the demo and the folder first, so a DEMO that matches no demo or several stops before anything is written
_hl, _inside, _outside = demo_dirs.collect()
DEMO = demo_dirs.find(os.environ.get('DEMO', 'navi-vs-fx-sec2011-final-1110091531'), _inside, _outside).lower()
print('harness: opening ' + DEMO, file=sys.stderr)
HL = demo_dirs.stage(_outside)

src_path = os.path.abspath(sys.argv[1])
html = open(src_path, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
page_path = os.path.join(os.path.dirname(src_path), '_test_' + os.path.basename(src_path))
open(page_path, 'w', encoding='utf-8').write(html)
shot = sys.argv[3] if len(sys.argv) > 3 else None
# MAP_NEEDED=0 waits only for the demo (for demos whose map isn't in the folder)
MAP_NEEDED = os.environ.get('MAP_NEEDED', '1') != '0'
THREE = os.environ.get('THREE_JS', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'vendor', 'three.min.js'))

root = os.path.dirname(page_path)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
handler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/{os.path.basename(page_path)}'

with sync_playwright() as p:
    # CHROME: a Chromium to use instead of Playwright's own (27 Oct 2026: the Linux VM on Sujan's Mac can't download
    # Playwright's, so a Chromium build from GitHub is used there)
    b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1440, 'height': 900})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('console.' + m.type + ': ' + m.text) if m.type == 'error' else None)
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(url)
    # POV_MODE=1: the POV mode setting on before the demo opens (0.25.0; it's off by default)
    if os.environ.get('POV_MODE') == '1': pg.evaluate("__v(\"$('pov3').checked = true\")")
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
    pg.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === ${JSON.stringify(n)}))`)', DEMO)
    # stop at once when the page says the demo can't be played (a broken or cut-off file), instead of waiting
    # 4 minutes for a demo that will never load (the mousesports vs Virus demo looked "slow" this way)
    failed = "$('sumCard') && !$('sumCard').hidden && !!$('sumCard').querySelector('.sum-top.fail')"
    ready = '!!(D && M && MAP && R3 && view3.map === MAP.name)' if MAP_NEEDED else '!!(D && M)'
    pg.wait_for_function(f'__v("({ready}) || ({failed})")', timeout=240000)
    if pg.evaluate(f'__v("{failed}")'):
        print(json.dumps({'cant_play': pg.evaluate('__v("$(\'sumCard\').innerText")')}))
        b.close(); srv.shutdown(); os.remove(page_path); sys.exit(2)
    pg.evaluate('__v("closeSummary()")')
    t0 = time.time()
    for n, sc in enumerate(sys.argv[2].split(',')):
        out = pg.evaluate('(c) => __v(c)', open(sc).read())
        print(json.dumps(out))
        if shot:
            pg.wait_for_timeout(800)
            pg.screenshot(path=f'{shot}{n}.png', timeout=120000)
    if errs:
        print('PAGE ERRORS:', *errs[:20], sep='\n  ')
    b.close()
