"""Quick check for 0.9.2: all three Theatre panels come and go together. One screen setup."""
import os, threading, http.server, functools
from playwright.sync_api import sync_playwright

W, H, DPR = 1440, 900, 2
THREE = '/tmp/claude-0/-home-claude/99ed9e8c-aead-50b9-bc48-61a8c8ebb34d/scratchpad/t/package/build/three.min.js'
HL = '/mnt/user-data/uploads/Half-Life'
html = open('/home/claude/th.html', encoding='utf-8').read()
i = html.rindex('})();'); html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
open('/home/claude/_all.html', 'w', encoding='utf-8').write(html)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory='/home/claude'); handler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()
res = []
def check(what, ok, d=''): res.append(('PASS' if ok else 'FAIL') + '  ' + what + (f'  ({d})' if d else ''))

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    pg = b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=DPR)
    errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(f'http://127.0.0.1:{srv.server_port}/_all.html')
    v = lambda c: pg.evaluate('(c) => __v(c)', c)
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
    v("loadDemoFile(files.demos.find(f => f.name.includes('dust2')))")
    pg.wait_for_function('__v("!!(D && M && MAP && R3 && view3.map === MAP.name)")', timeout=240000)
    pg.wait_for_timeout(2500); v('closeSummary()')
    v("setView('3d'); T = M.liveR[0].start + 20; selected = alivePlayers()[0]; setCam('eyes', true); TH.hint = true; setTheatre(true);")
    allShown = "['t','r','b'].every((k) => $('app').classList.contains('show-' + k))"
    noneShown = "!['t','r','b'].some((k) => $('app').classList.contains('show-' + k))"
    def wait(js, t=15000):
        try: pg.wait_for_function('(c) => __v(c)', arg=js, timeout=t); return True
        except Exception: return False
    pg.mouse.move(W / 2, H / 2); pg.wait_for_timeout(500)
    for name, x, y in [('right', W - 10, H / 2), ('top', W / 2, 10), ('bottom', W / 2, H - 15)]:
        pg.mouse.move(x, y, steps=6)
        check(f'{name.capitalize()} edge brings in all three', wait(allShown))
        pg.mouse.move(W / 2, H / 2, steps=6)
        check(f'All three hide after leaving ({name})', wait(noneShown))
    # use the panel: click a tab, everything stays
    pg.mouse.move(W - 10, H / 2, steps=6); wait(allShown)
    wait("Math.abs($('side').getBoundingClientRect().right - innerWidth) < 2")
    tab = v("(() => { const r = document.querySelector('.tabs button[data-tab=\"players\"]').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()")
    pg.mouse.move(tab[0], tab[1], steps=6); pg.mouse.click(tab[0], tab[1]); pg.wait_for_timeout(2600)
    check('Clicking a panel tab works and everything stays', v('tab') == 'players' and v(allShown))
    btn = v("(() => { const r = $('btnOpen').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()")
    check('Header buttons on the right are not covered', v(f"(() => {{ const e = document.elementFromPoint({btn[0]}, {btn[1]}); return e && e.id; }})()") == 'btnOpen')
    pg.screenshot(path='/home/claude/all_three.png')
    # dragging across the view still never pulls them in
    pg.mouse.move(W / 2, H / 2, steps=6); wait(noneShown)
    pg.mouse.down(); pg.mouse.move(W - 5, H - 5, steps=12); pg.wait_for_timeout(300)
    check('Drag to a corner does not bring them in', v(noneShown))
    pg.mouse.up()
    check('No page errors', not errs, '; '.join(errs[:3]))
    b.close()
print('\n'.join(res))
