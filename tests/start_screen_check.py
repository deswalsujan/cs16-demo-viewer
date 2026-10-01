import os
from playwright.sync_api import sync_playwright
import threading, http.server, functools
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900})
    pg.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'three.min.js')), content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(f'http://127.0.0.1:{srv.server_port}/index.html'); pg.wait_for_timeout(800)
    print('Theatre disabled:', pg.eval_on_selector('#bTheatre', 'e => e.disabled'), '| Full screen disabled:', pg.eval_on_selector('#bFull', 'e => e.disabled'))
    pg.keyboard.press('t'); pg.keyboard.press('f'); pg.wait_for_timeout(500)
    print('T and F do nothing on the start screen:', pg.evaluate("!document.querySelector('.app').classList.contains('theatre') && !document.fullscreenElement"))
    pg.screenshot(path='start_disabled.png', clip={'x': 1000, 'y': 0, 'width': 440, 'height': 60}); b.close()
