"""Headless test harness for the CS 1.6 Demo Viewer.

Usage: python3 harness.py <page.html> <script.js> [screenshot prefix]
Loads the page from a local server, feeds it the staged Half-Life folder, opens the
Na`Vi vs FX Dust2 demo, waits for the 3D map, then runs <script.js> in the page and
prints the JSON it returns.
"""
import sys, json, os, threading, http.server, functools, time
from playwright.sync_api import sync_playwright

src_path = os.path.abspath(sys.argv[1])
html = open(src_path, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
page_path = os.path.join(os.path.dirname(src_path), '_test_' + os.path.basename(src_path))
open(page_path, 'w', encoding='utf-8').write(html)
shot = sys.argv[3] if len(sys.argv) > 3 else None
THREE = '/tmp/claude-0/-home-claude/99ed9e8c-aead-50b9-bc48-61a8c8ebb34d/scratchpad/t/package/build/three.min.js'
HL = '/mnt/user-data/uploads/Half-Life'

root = os.path.dirname(page_path)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root)
handler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/{os.path.basename(page_path)}'

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1440, 'height': 900})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('console.' + m.type + ': ' + m.text) if m.type == 'error' else None)
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(url)
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
    pg.evaluate("""__v("loadDemoFile(files.demos.find(f => f.name.includes('dust2')))")""")
    pg.wait_for_function('__v("!!(D && M && MAP && R3 && view3.map === MAP.name)")', timeout=240000)
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
