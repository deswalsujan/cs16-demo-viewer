"""Quick check for 0.9.1: the side panel and the header in Theatre mode. One screen setup."""
import os, sys, os, threading, http.server, functools
from playwright.sync_api import sync_playwright

W, H, DPR = 1440, 900, 2
THREE = os.environ.get('THREE_JS', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'three.min.js'))
HL = os.environ['HALF_LIFE_DIR']
html = open(os.environ.get('PAGE', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'index.html')), encoding='utf-8').read()
i = html.rindex('})();'); html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '_side.html'), 'w', encoding='utf-8').write(html)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.dirname(os.path.abspath(__file__))); handler.log_message = lambda *a: None
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
    pg.goto(f'http://127.0.0.1:{srv.server_port}/_side.html')
    v = lambda c: pg.evaluate('(c) => __v(c)', c)
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
    v("loadDemoFile(files.demos.find(f => f.name.includes('dust2')))")
    pg.wait_for_function('__v("!!(D && M && MAP && R3 && view3.map === MAP.name)")', timeout=240000)
    pg.wait_for_timeout(2500); v('closeSummary()')
    v("setView('3d'); T = M.liveR[0].start + 20; selected = alivePlayers()[0]; setCam('eyes', true); TH.hint = true; setTheatre(true);")
    cls = lambda: v("$('app').className")
    def wait(js, t=15000):
        try: pg.wait_for_function('(c) => __v(c)', arg=js, timeout=t); return True
        except Exception: return False
    pg.mouse.move(W / 2, H / 2); pg.wait_for_timeout(500)
    # bring in the panel from the right edge, then go up to its tabs
    pg.mouse.move(W - 10, H / 2, steps=6)
    wait("$('app').classList.contains('show-r') && Math.abs($('side').getBoundingClientRect().right - innerWidth) < 2")
    tab = v("(() => { const r = document.querySelector('.tabs button[data-tab=\"kills\"]').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()")
    hh = v("$('app').querySelector('.head').offsetHeight")
    check('Panel starts below the header', tab[1] > hh, f'tab middle at {tab[1]:.0f}px, header {hh}px')
    print('before', cls(), v("getComputedStyle($('side')).transform"))
    pg.mouse.move(tab[0], tab[1], steps=8)
    print('after move', cls(), v(f"(() => {{ const e = document.elementFromPoint({tab[0]}, {tab[1]}); return [e && (e.id || e.className || e.tagName), TH.x, TH.y, $('side').contains(e)]; }})()"))
    pg.wait_for_timeout(1200)
    print('after wait', cls())
    check('Pointing at the panel tabs does not bring in the header', 'show-t' not in cls(), cls())
    pg.mouse.click(tab[0], tab[1]); pg.wait_for_timeout(500)
    check('Clicking a tab works', v("tab") == 'kills')
    # the bottom of the panel: no bottom bar
    pb = v("$('side').getBoundingClientRect().bottom")
    pg.mouse.move(W - 150, pb - 15, steps=6); pg.wait_for_timeout(1200)
    check('Pointing at the bottom of the panel does not bring in the bar', 'show-b' not in cls(), cls())
    trh = v("$('app').querySelector('.transport').offsetHeight")
    check('Panel ends above the bottom bar', abs(pb - (H - trh)) < 2, f'panel bottom {pb:.0f}, bar top {H - trh}')
    pg.screenshot(path='side_panel.png')
    # header and panel both open on purpose: no overlap, header buttons on the right still reachable
    pg.mouse.move(W / 2, 10, steps=8); wait("$('app').classList.contains('show-t')")
    pg.mouse.move(W - 120, 20, steps=4); pg.wait_for_timeout(300)
    v("$('app').classList.add('show-r')")
    pg.wait_for_timeout(500)
    btn = v("(() => { const r = $('btnOpen').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; })()")
    top_el = v(f"(() => {{ const e = document.elementFromPoint({btn[0]}, {btn[1]}); return e && e.id; }})()")
    check('With both open, the header buttons on the right are not covered', top_el == 'btnOpen', str(top_el))
    pg.screenshot(path='side_both.png')
    check('No page errors', not errs, '; '.join(errs[:3]))
    b.close()
print('\n'.join(res))
