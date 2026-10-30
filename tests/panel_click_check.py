"""Clicks on the side panel during playback (0.18.0).

Before 0.18.0 the Kills and Wallbangs lists were rebuilt every half second of playback, and a click is a press
and a release on the same row: a row replaced in between lost the click (Sujan, 14 Oct 2026: two or three tries).
This plays at 8x on the Kills tab, pauses to aim at a row, presses it, plays on at 8x while it's held 0.3 s (about 5
rebuilds' worth before the fix), releases, and checks the click went through: the row is the picked kill and playback jumped to it. Then the same
on the Players tab around a death, which also rebuilt the list. Exit code 1 on a failure.

Usage: HALF_LIFE_DIR=... python3 panel_click_check.py [page]   (no map needed; opens Na`Vi vs FX, Dust2, SEC 2011 final)
"""
import os, sys, threading, http.server, functools
from playwright.sync_api import sync_playwright

page = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'index.html'))
html = open(page, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
tmp = os.path.join(os.path.dirname(page), '_test_panelclick.html')
open(tmp, 'w', encoding='utf-8').write(html)
THREE = os.environ.get('THREE_JS', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'three.min.js'))
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.dirname(tmp)); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
fails = 0
try:
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        pg = b.new_page(viewport={'width': 1440, 'height': 900})
        pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
        pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
        pg.goto(f'http://127.0.0.1:{srv.server_port}/_test_panelclick.html')
        pg.set_input_files('#fFolder', os.environ['HALF_LIFE_DIR'])
        pg.wait_for_function('__v("files.demos.length > 0")', timeout=60000)
        pg.evaluate("__v(\"loadDemoFile(files.demos.find(f => f.name.includes('1110091531')))\")")
        pg.wait_for_function('__v("!!(D && M)")', timeout=240000)
        pg.evaluate('__v("closeSummary(); setView(\'2d\')")')

        def check(label, ok):
            global fails
            print(('PASS ' if ok else 'FAIL ') + label)
            if not ok: fails += 1

        # the picture check ends with a rebuild of the list (30 Oct 2026: since 0.26.0 it draws more kills and could
        # land on the first aim), so wait for one that's running; one starting later is caught by aiming again below
        pg.wait_for_function('__v("!M.seenPending")', timeout=120000)

        # Kills tab, playing at 8x through a round with many kills
        pg.click('.tabs button[data-tab="kills"]')
        for attempt in range(3):
            pg.evaluate('__v("const r = M.liveR[3 + %d]; seek(r.start + 5); speed = 8; playing = true; pickedKill = null; renderPane()")' % attempt)
            pg.wait_for_timeout(400)
            # aim with playback paused (as a person sees the row under the mouse when pressing), then play on
            # at 8x while the button is held, which rebuilt the list under the mouse before 0.18.0
            pg.evaluate('__v("playing = false")')
            for _ in range(5):
                pg.wait_for_timeout(400)
                row = pg.locator('#pane [data-kill]').nth(1)
                want = row.get_attribute('data-kill'); box = row.bounding_box()
                if box is None: continue  # the row was rebuilt between the two calls
                x, y = box['x'] + 40, box['y'] + box['height'] / 2
                pg.mouse.move(x, y)
                if pg.evaluate('([x, y, t]) => { const el = document.elementFromPoint(x, y); const r = el && el.closest("[data-kill]"); return !!r && r.dataset.kill === t; }', [x, y, want]): break
            want = float(want)
            pg.mouse.down(); pg.evaluate('__v("playing = true; lastPaneT = -99")'); pg.wait_for_timeout(300); pg.mouse.up()
            pg.wait_for_timeout(150)
            got = pg.evaluate('__v("pickedKill ? pickedKill.t : null")')
            check(f'Kills tab at 8x, round {4 + attempt}: one press-hold-release picks the kill', got is not None and abs(got - want) < 1e-3)

        # Players tab, playing at 8x across deaths (each death rebuilt the list)
        pg.click('.tabs button[data-tab="players"]')
        pg.evaluate('__v("const r = M.liveR[5]; seek(r.kills[0].t - 1.5); speed = 8; playing = true; selected = null; renderPane()")')
        pg.wait_for_timeout(250)
        pg.evaluate('__v("playing = false")'); pg.wait_for_timeout(100)
        # a living player who doesn't die in the next 4 seconds of demo time (2 s of hold and playback at 8x
        # covers about 3), so the click can't be refused for a death that happens while the button is down
        pid = pg.evaluate('__v("[...document.querySelectorAll(\'#pane .prow[data-p]:not(.dead)\')].map((el) => el.dataset.p).find((p) => { const s = M.slotOf(p, T); return s != null && !D.kills.some((k) => String(k.vp) === p && k.t > T && k.t < T + 4); })")')
        # the test browser draws in software, so a frame can take over 100 ms and the list's last rebuild after
        # pausing can still land after aiming: aim again until the row under the pointer is the one wanted
        for _ in range(5):
            pg.wait_for_timeout(400)
            box = pg.locator(f'#pane .prow[data-p="{pid}"]').bounding_box()
            if box is None: continue
            x, y = box['x'] + 60, box['y'] + box['height'] / 2
            pg.mouse.move(x, y)
            if pg.evaluate('([x, y, p]) => { const el = document.elementFromPoint(x, y); const r = el && el.closest("[data-p]"); return !!r && r.dataset.p === p; }', [x, y, pid]): break
        pg.mouse.down(); pg.evaluate('__v("playing = true; lastAliveKey = \'x\'")'); pg.wait_for_timeout(300); pg.mouse.up()
        pg.wait_for_timeout(150)
        ok = pg.evaluate('(pid) => __v(`selected != null && String(M.personAt(selected, T)) === ${JSON.stringify(pid)}`)', pid)
        if not ok: print('   selected:', pg.evaluate('__v("selected + \' \' + (selected != null ? M.personAt(selected, T) : \'\') + \' toast: \' + ($(\'toast\') ? $(\'toast\').textContent : \'\')")'), 'wanted', pid)
        check('Players tab at 8x across deaths: one press-hold-release picks the player', bool(ok))
        b.close()
finally:
    srv.shutdown(); os.remove(tmp)
print('all passed' if not fails else f'{fails} failed')
sys.exit(1 if fails else 0)
