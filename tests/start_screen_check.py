import os, sys
from playwright.sync_api import sync_playwright
import threading, http.server, functools
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900})
    pg.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'three.min.js')), content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(f'http://127.0.0.1:{srv.server_port}/index.html'); pg.wait_for_timeout(800)
    d = pg.eval_on_selector('#bTheatre', 'e => e.disabled'), pg.eval_on_selector('#bFull', 'e => e.disabled')
    print('Theatre disabled:', d[0], '| Full screen disabled:', d[1])
    pg.keyboard.press('t'); pg.keyboard.press('f'); pg.wait_for_timeout(500)
    t = pg.evaluate("!document.querySelector('.app').classList.contains('theatre') && !document.fullscreenElement")
    print('T and F do nothing on the start screen:', t)
    pg.screenshot(path='start_disabled.png', clip={'x': 1000, 'y': 0, 'width': 440, 'height': 60})
    # the footer's Source on GitHub link (0.25.1): the repo, in a new tab, and at phone width the version, the link and
    # Clear saved files don't overlap (the footer wraps) and the page doesn't scroll sideways
    g = pg.eval_on_selector('.loadfoot a', "a => a.href + ' ' + a.target + ' ' + a.rel + ' ' + a.textContent")
    print('Footer link:', g); gl = g == 'https://github.com/deswalsujan/cs16-demo-viewer _blank noopener Source on GitHub'
    pg.set_viewport_size({'width': 375, 'height': 812}); pg.wait_for_timeout(300)
    ph = pg.evaluate("""() => { const r = (q) => document.querySelector(q).getBoundingClientRect(), s = r('.loadfoot span'), c = r('#bClear');
      return !(s.left < c.right && c.left < s.right && s.top < c.bottom && c.top < s.bottom) && document.documentElement.scrollWidth <= innerWidth; }""")
    print('At 375 px the footer wraps without overlapping:', ph); b.close()
sys.exit(0 if all(d) and t and gl and ph else 1)
