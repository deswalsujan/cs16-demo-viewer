"""Viewing preferences are restored on the next visit (0.12.3), there's no POV mode setting (Sujan signed POV mode off on
11 Nov 2026; 0.26.30) and POV mode's own rows start as the defaults (his crosshair From config.cfg, both flashbang rows
off), and Vanilla and Damage numbers are kept (0.26.16). No Half-Life folder needed; a few seconds.
    python3 prefs_check.py"""
import os, sys, threading, functools, http.server
from playwright.sync_api import sync_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.join(HERE, '..')); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
ok = True
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page()
    pg.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(HERE, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    url = f'http://127.0.0.1:{srv.server_port}/index.html'
    pg.goto(url)
    r = pg.evaluate("[...document.querySelectorAll('#legend .btn')].map(b => b.id + ':' + b.classList.contains('on')).join(' ') + ' | ' + document.getElementById('bScope').textContent")
    print('defaults on a first visit:', r); ok &= r == 'tgNames:true tgNades:true tgLines:true tgXray:false tgFit:false | Timeline: match'
    # no POV mode setting since the sign-off (0.26.30; up to 0.26.29 it was off on a first visit), and POV mode's own rows:
    # his crosshair From config.cfg, the flashbang dot and whiteout off (Sujan, 8 and 11 Nov 2026)
    r = pg.evaluate("[!document.getElementById('pov3'), (document.getElementById('xhp3') || {}).value, (document.getElementById('fbDot3') || {}).checked, (document.getElementById('fbWhite3') || {}).checked]")
    print('no POV mode setting; his crosshair, flashbang dot, whiteout on a first visit:', r); ok &= r == [True, 'cfg', False, False]
    pg.evaluate("""localStorage.setItem('prefs', JSON.stringify({ view: '3d', names: false, nades: true, lines: false, xray: true, scope: 'round' }))""")
    pg.reload(); pg.wait_for_timeout(500)
    r = pg.evaluate("[...document.querySelectorAll('#legend .btn')].map(b => b.id + ':' + b.classList.contains('on')).join(' ') + ' | ' + document.getElementById('bScope').textContent")
    print('after a reload with saved settings:', r); ok &= r == 'tgNames:false tgNades:true tgLines:false tgXray:true tgFit:false | Timeline: round'
    # Vanilla and Damage numbers (0.26.16, Sujan, 3 Nov 2026): Vanilla first in View settings, off on a first visit;
    # Damage numbers Wallbangs by default. Vanilla on turns off Names to See through walls, Glow on hits and the damage
    # numbers, and is kept after a reload; a single switch still works after; Vanilla off brings back what it turned off.
    pg.evaluate("localStorage.clear()"); pg.reload(); pg.wait_for_timeout(500)
    st = "(() => { const L = (id) => document.getElementById(id); return [...document.querySelectorAll('#legend .btn')].slice(0, 4).map(b => b.classList.contains('on') ? 1 : 0).join('') + ' glow:' + L('glow3').checked + ' dn:' + (L('dn3') || {}).value + ' van:' + (L('van3') || {}).checked; })()"
    try:
        first = pg.evaluate("document.querySelector('#vsetPanel .vrow input, #vsetPanel .vrow select, #vsetPanel .vrow button').id")
        r = pg.evaluate(st)
        print('Vanilla and Damage numbers on a first visit:', first, r); ok &= first == 'van3' and r == '1110 glow:true dn:wb van:false'
        pg.evaluate("() => { const L = (id) => document.getElementById(id); L('dn3').value = 'both'; L('dn3').dispatchEvent(new Event('change')); L('tgXray').click(); L('van3').checked = true; L('van3').dispatchEvent(new Event('change')); }")
        r = pg.evaluate(st); print('Vanilla on:', r); ok &= r == '0000 glow:false dn:off van:true'
        pg.reload(); pg.wait_for_timeout(500)
        r = pg.evaluate(st); print('Vanilla on, after a reload:', r); ok &= r == '0000 glow:false dn:off van:true'
        pg.evaluate("document.getElementById('tgNames').click()")
        r = pg.evaluate(st); print('Names clicked with Vanilla on:', r); ok &= r == '1000 glow:false dn:off van:true'
        pg.evaluate("() => { const v = document.getElementById('van3'); v.checked = false; v.dispatchEvent(new Event('change')); }")
        r = pg.evaluate(st); print('Vanilla off brings back what it turned off:', r); ok &= r == '1111 glow:true dn:both van:false'
        pg.reload(); pg.wait_for_timeout(500)
        r = pg.evaluate(st); print('after a reload:', r); ok &= r == '1111 glow:true dn:both van:false'
    except Exception as e:
        print('Vanilla and Damage numbers: FAIL,', str(e).split('\n')[0]); ok = False
    pg.evaluate("localStorage.setItem('prefs', '{broken')"); pg.reload(); pg.wait_for_timeout(500)
    r = pg.evaluate("document.getElementById('bScope').textContent"); errs = []
    print('with damaged saved settings the page still opens with defaults:', r); ok &= r == 'Timeline: match'
    b.close()
print('PASS' if ok else 'FAIL')
sys.exit(0 if ok else 1)
