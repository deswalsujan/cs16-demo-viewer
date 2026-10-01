"""Viewing preferences are restored on the next visit (0.12.3). No Half-Life folder needed; a few seconds.
    python3 prefs_check.py"""
import os, threading, functools, http.server
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.join(HERE, '..')); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
ok = True
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(HERE, 'three.min.js')), content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    url = f'http://127.0.0.1:{srv.server_port}/index.html'
    pg.goto(url)
    r = pg.evaluate("[...document.querySelectorAll('#legend .btn')].map(b => b.id + ':' + b.classList.contains('on')).join(' ') + ' | ' + document.getElementById('bScope').textContent")
    print('defaults on a first visit:', r); ok &= r == 'tgNames:true tgNades:true tgLines:true tgXray:false tgFit:false | Timeline: match'
    pg.evaluate("""localStorage.setItem('prefs', JSON.stringify({ view: '3d', names: false, nades: true, lines: false, xray: true, scope: 'round' }))""")
    pg.reload(); pg.wait_for_timeout(500)
    r = pg.evaluate("[...document.querySelectorAll('#legend .btn')].map(b => b.id + ':' + b.classList.contains('on')).join(' ') + ' | ' + document.getElementById('bScope').textContent")
    print('after a reload with saved settings:', r); ok &= r == 'tgNames:false tgNades:true tgLines:false tgXray:true tgFit:false | Timeline: round'
    pg.evaluate("localStorage.setItem('prefs', '{broken')"); pg.reload(); pg.wait_for_timeout(500)
    r = pg.evaluate("document.getElementById('bScope').textContent"); errs = []
    print('with damaged saved settings the page still opens with defaults:', r); ok &= r == 'Timeline: match'
    b.close()
print('PASS' if ok else 'FAIL')
