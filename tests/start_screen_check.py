import os, sys
from playwright.sync_api import sync_playwright
import threading, http.server, functools
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1440, 'height': 900})
    # the network blocked: three.js is in the page (0.26.2) and the fonts are the player's own (0.26.9), so nothing may
    # be asked for from another site (Sujan, 2 Nov 2026: the viewer collects no user data)
    outside = []
    def net(r):
        u = r.request.url
        if u.startswith('http://127.0.0.1:'): r.continue_()
        else: outside.append(u); r.abort()
    pg.route('**/*', net)
    pg.goto(f'http://127.0.0.1:{srv.server_port}/index.html'); pg.wait_for_timeout(800)
    three = pg.evaluate("typeof THREE === 'object' ? THREE.REVISION : null")
    print('three.js in the page:', three, '| outside requests:', outside or 'none'); tj = three == '128' and not outside
    d = pg.eval_on_selector('#bTheatre', 'e => e.disabled'), pg.eval_on_selector('#bFull', 'e => e.disabled')
    print('Theatre disabled:', d[0], '| Full screen disabled:', d[1])
    pg.keyboard.press('t'); pg.keyboard.press('f'); pg.wait_for_timeout(500)
    t = pg.evaluate("!document.querySelector('.app').classList.contains('theatre') && !document.fullscreenElement")
    print('T and F do nothing on the start screen:', t)
    pg.screenshot(path='start_disabled.png', clip={'x': 1000, 'y': 0, 'width': 440, 'height': 60})
    # the footer's Source on GitHub link (0.25.1): the repo, in a new tab. Phone width is no longer checked (Sujan, 3 Nov
    # 2026: the viewer needs a Half-Life folder, which no phone has)
    g = pg.eval_on_selector('.loadfoot a', "a => a.href + ' ' + a.target + ' ' + a.rel + ' ' + a.textContent")
    print('Footer link:', g); gl = g == 'https://github.com/deswalsujan/cs16-demo-viewer _blank noopener Source on GitHub'
    # Interface size (0.26.13, Sujan, 3 Nov 2026): Auto keeps a laptop's page exactly as 0.26.12 (text 14 px, side panel
    # 340 px) and grows on a big window; it follows a resize and a move to a screen of another density with no reload;
    # a picked size is saved, and lowered when the window is too small for it
    ui = lambda: pg.evaluate("""() => ({ ui: getComputedStyle(document.documentElement).getPropertyValue('--ui').trim(),
      font: getComputedStyle(document.body).fontSize, side: Math.round(document.querySelector('.side').getBoundingClientRect().width),
      mark: window.__mark === 1, dpr: devicePixelRatio, cv: document.getElementById('cv').width, cvCss: document.getElementById('cv').getBoundingClientRect().width })""")
    def size(w, h, want, label, dpr=None, cdp=None):
        if cdp: cdp.send('Emulation.setDeviceMetricsOverride', {'width': w, 'height': h, 'deviceScaleFactor': dpr, 'mobile': False})
        else: pg.set_viewport_size({'width': w, 'height': h})
        pg.wait_for_timeout(300); u = ui()
        ok = u['ui'] == want[0] and u['font'] == want[1] and u['side'] == want[2] and u['mark']
        if dpr: ok = ok and u['dpr'] == dpr and u['cv'] == round(u['cvCss'] * dpr)
        print(f"Interface size, {label}: --ui {u['ui']}, text {u['font']}, side panel {u['side']} px" + (f", canvas at {u['dpr']}x {u['cv']} for {u['cvCss']:.0f}" if dpr else '') + ('' if u['mark'] else ', PAGE RELOADED') + ('' if ok else f'  << expected {want}'))
        return ok
    pg.evaluate('window.__mark = 1')
    sz = [size(1366, 768, ('1', '14px', 340), 'Auto at 1366x768'), size(1920, 1080, ('1', '14px', 340), 'Auto at 1920x1080'),
          size(2560, 1440, ('1.3', '18.2px', 442), 'Auto at 2560x1440 (resized, no reload)'), size(1366, 768, ('1', '14px', 340), 'Auto back at 1366x768')]
    cdp = pg.context.new_cdp_session(pg)
    sz += [size(2560, 1440, ('1.3', '18.2px', 442), 'Auto on a 2560x1440 screen at 1x', 1, cdp), size(1512, 982, ('1', '14px', 340), 'moved to a 1512x982 Retina screen', 2, cdp),
           size(2560, 1440, ('1.3', '18.2px', 442), 'moved to a 2560x1440 screen at 2x', 2, cdp)]
    cdp.send('Emulation.clearDeviceMetricsOverride'); cdp.detach()
    pg.set_viewport_size({'width': 2560, 'height': 1440}); pg.wait_for_timeout(200)
    pg.evaluate("() => { const s = document.getElementById('ui3'); s.value = '150'; s.dispatchEvent(new Event('change')); }")
    sz.append(size(2560, 1440, ('1.5', '21px', 510), '150% picked'))
    pg.reload(); pg.wait_for_timeout(800); pg.evaluate('window.__mark = 1')
    kept = pg.eval_on_selector('#ui3', 'e => e.value') == '150'
    sz.append(size(2560, 1440, ('1.5', '21px', 510), '150% after a reload' + ('' if kept else ' (the list lost it)')) and kept)
    pg.evaluate("() => { const s = document.getElementById('ui3'); s.value = '200'; s.dispatchEvent(new Event('change')); }")
    sz.append(size(1366, 768, ('1.05', '14.7px', 357), '200% at 1366x768, lowered to fit'))
    b.close()
sys.exit(0 if all(d) and t and gl and tj and all(sz) else 1)
