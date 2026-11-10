"""Fails if switching demos or POV mode with a POV demo playing logs an error or stops the 3D view (0.26.28).

Guards the fix of Sujan's two crashes of 3 Nov 2026: with a POV demo playing in POV mode, turning POV mode off or on
(the demo opens again) or opening an HLTV demo left POV mode's state from the old demo while the new one loaded, so
povView threw on a demo with no view of his; on 0.26.16 that stopped the frame loop for good (the 3D view froze while
the side panel filled), and from 0.26.18 it logged the error and showed the error toast. The overview's load is held
0.3 s, so frames run in that gap every time. Steps: Match 1 T (public
server, de_barcelona, 27 Mar 2025) in POV mode, playing in 3D; POV mode off; POV mode on; then mTw vs mousesports,
Inferno, IEM4 World Championship, part 1 (an HLTV demo). After each, the page must have logged no error, and the 3D
view must keep drawing (its frame count goes up) with playback moving.

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 pov_reopen_check.py [page.html]
Needs both demos in the Half-Life folder or DEMO_DIRS (demo_dirs.py) and de_barcelona and de_inferno in the folder.
Exit code 0 = pass. Fails on 0.26.27.
"""
import functools, http.server, json, os, sys, threading, time
from playwright.sync_api import sync_playwright
import demo_dirs

here = os.path.dirname(os.path.abspath(__file__))
page = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'index.html'))
hl, inside, outside = demo_dirs.collect()
POVD = demo_dirs.find('match-1_de_barcelona-ts', inside, outside).lower()
HLTV = demo_dirs.find('mouz.mtw.em4finals-1003021349', inside, outside).lower()
HL = demo_dirs.stage(outside)
html = open(page, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
test_page = os.path.join(os.path.dirname(page), '_test_pov_' + os.path.basename(page))
open(test_page, 'w', encoding='utf-8').write(html)
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.dirname(test_page))
h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/{os.path.basename(test_page)}'
# ready: onDemo() finished for the new demo (counted by the wrapper below) and its 3D map built
READY = '!!(D && M && MAP && R3 && view3.map === MAP.name && window.__opened > window.__before)'
STATE = r'''(() => ({ file: D && D.fileName, T: T, renders: R3 && R3.renderer ? R3.renderer.info.render.frame : -1,
  povOn: !!(D && D.povOn), POVon: POV.on, errors: (typeof ERRLOG !== 'undefined' ? ERRLOG : []).map((e) => e.msg || String(e)) }))()'''
checks, t0 = [], time.time()
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = b.new_page(viewport={'width': 1440, 'height': 900})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(url)
        pg.evaluate("__v(\"$('pov3').checked = true\")")
        # the overview load is held 0.3 s, so frames always run between the new demo taking over and onDemo() setting
        # POV mode up for it, where the crashes were (without it, a cached overview can leave no frame in between)
        pg.evaluate('__v("{ const f = tryLoadOverview; tryLoadOverview = async (n) => { await new Promise((r) => setTimeout(r, 300)); return f(n); }; } 0")')
        pg.evaluate('__v("{ const g = onDemo; window.__opened = 0; onDemo = async () => { await g(); window.__opened++; }; } 0")')
        pg.set_input_files('#fFolder', HL)
        pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)

        def start():
            pg.evaluate('__v("window.__before = window.__opened")')

        def wait_ready():
            pg.wait_for_function(f'__v("{READY}")', timeout=240000)
            pg.evaluate('__v("closeSummary(); playing = true; setPlayIcon()")')

        def check(name, want_pov):
            pg.wait_for_timeout(600)
            a = pg.evaluate('(c) => __v(c)', STATE)
            pg.wait_for_timeout(1500)
            z = pg.evaluate('(c) => __v(c)', STATE)
            ok = not z['errors'] and not errs and z['renders'] > a['renders'] and z['T'] > a['T'] and z['POVon'] == want_pov
            checks.append((ok, name, {'file': z['file'], 'POV mode': z['POVon'], 'frames drawn': z['renders'] - a['renders'],
                                      'playback moved': round(z['T'] - a['T'], 2), 'errors': (z['errors'] + errs)[:3]}))

        start()
        pg.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === ${JSON.stringify(n)}))`)', POVD)
        wait_ready()
        pg.evaluate("__v(\"T = D.start + 120; setView('3d')\")")
        check('POV demo in POV mode, playing in 3D', True)
        for on in (False, True):
            start()
            pg.evaluate(f"__v(\"$('pov3').checked = {str(on).lower()}; $('pov3').onchange()\")")
            wait_ready()
            check(f'after turning POV mode {"on" if on else "off"} with it playing', on)
        start()
        pg.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === ${JSON.stringify(n)}))`)', HLTV)
        wait_ready()
        check('after opening an HLTV demo', False)
        b.close()
finally:
    srv.shutdown()
    os.remove(test_page)
for ok, name, got in checks:
    print(('ok   ' if ok else 'FAIL ') + name + '  ' + json.dumps(got))
passed = len(checks) == 4 and all(c[0] for c in checks)
print(f'{"PASS" if passed else "FAIL"} ({time.time() - t0:.0f} s)')
sys.exit(0 if passed else 1)
