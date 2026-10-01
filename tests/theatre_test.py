"""Theatre mode test: real mouse and keyboard, one screen setup per run.

Usage: python3 theatre_test.py <page.html> <label> <width> <height> <scale>
"""
import sys, json, os, threading, http.server, functools
from playwright.sync_api import sync_playwright

src, label, W, H, DPR = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), float(sys.argv[5])
THREE = '/tmp/claude-0/-home-claude/99ed9e8c-aead-50b9-bc48-61a8c8ebb34d/scratchpad/t/package/build/three.min.js'
HL = '/mnt/user-data/uploads/Half-Life'
html = open(src, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
root = os.path.dirname(os.path.abspath(src)); name = '_tt_' + os.path.basename(src)
open(os.path.join(root, name), 'w', encoding='utf-8').write(html)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=root); handler.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

results, fails = [], []
def check(what, ok, detail=''):
    results.append(('PASS' if ok else 'FAIL') + '  ' + what + (f'  ({detail})' if detail else ''))
    if not ok: fails.append(what)

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=DPR)
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(f'http://127.0.0.1:{srv.server_port}/{name}')
    v = lambda c: pg.evaluate('(c) => __v(c)', c)
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
    v("loadDemoFile(files.demos.find(f => f.name.includes('dust2')))")
    pg.wait_for_function('__v("!!(D && M && MAP && R3 && view3.map === MAP.name)")', timeout=240000)
    pg.wait_for_timeout(3000); v('closeSummary()')
    v("setView('3d'); const r = M.liveR[1]; T = r.start + 20; selected = alivePlayers()[0]; setCam('eyes', true); playing = true; speed = 1;")
    pg.wait_for_timeout(800); v('closeSummary()')
    def eventually(js, t=8000):
        try: pg.wait_for_function('(c) => __v(c)', arg=js, timeout=t); return True
        except Exception: return False
    rect = lambda sel: v(f"(() => {{ const r = document.querySelector('{sel}').getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }})()")
    cls = lambda: v("$('app').className")
    normal = rect('#gl')

    # 1. T turns it on and the view fills the whole window
    pg.mouse.move(W / 2, H / 2)
    pg.keyboard.press('t'); pg.wait_for_timeout(600)
    full = rect('#gl')
    check('T turns Theatre mode on', 'theatre' in cls())
    check('3D view fills the window', full == [W, H], f'{normal} -> {full}, window {W}x{H}')
    buf = v("[R3.renderer.domElement.width, R3.renderer.domElement.height, R3.renderer.getPixelRatio()]")
    check('3D drawing size matches the screen', abs(buf[0] - round(W * buf[2])) <= 2 and abs(buf[1] - round(H * buf[2])) <= 2, f'canvas {buf[0]}x{buf[1]} at {buf[2]}x')
    pg.wait_for_function('__v("[\'.head\', \'.side\', \'.transport\', \'#cam3\', \'#legend\'].every((q) => getComputedStyle(document.querySelector(q)).opacity === \'0\')")', timeout=8000)
    hidden = v("['.head', '.side', '.transport', '#cam3', '#legend'].filter((q) => getComputedStyle(document.querySelector(q)).opacity !== '0').map((q) => q + '=' + getComputedStyle(document.querySelector(q)).opacity)")
    check('Header, panel, bar and on-view buttons hidden', not hidden, ', '.join(hidden))
    check('Score shows in the round pill', v("getComputedStyle(document.querySelector('.rclock .thsc')).display !== 'none'"), v("$('rclock').textContent"))
    pg.wait_for_timeout(4000)  # let the hint toast fade
    pg.screenshot(path=f'th_{label}_clean.png')

    # 2. moving around the middle shows nothing
    pg.mouse.move(W / 2 + 80, H / 2 + 40, steps=5); pg.wait_for_timeout(300)
    check('Mouse in the middle shows nothing', not any(x in cls() for x in ['show-t', 'show-r', 'show-b']), cls())

    # 3. bottom edge brings the bar in, without resizing the view
    pg.mouse.move(W / 2, H - 20, steps=8); pg.wait_for_timeout(400)
    check('Bottom edge shows the bar', 'show-b' in cls())
    check('View keeps its size when the bar appears', rect('#gl') == full, str(rect('#gl')))
    try: pg.wait_for_function('__v("Math.round(document.querySelector(\'.transport\').getBoundingClientRect().bottom) === innerHeight")', timeout=8000)
    except Exception: pass
    tr = v("(() => { const r = document.querySelector('.transport').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom), Math.round(r.width)]; })()")
    check('Bar sits on screen, full width', tr[1] == H and tr[2] == W, str(tr))
    pov_b = v("parseFloat(getComputedStyle($('pov')).bottom)"); trh = v("$('app').querySelector('.transport').offsetHeight")
    check('Player name strip moves above the bar', pov_b >= trh, f'strip bottom {pov_b}px, bar {trh}px')
    pg.screenshot(path=f'th_{label}_bottom.png')

    # 4. the bar slid in under a mouse that isn't moving: it stays, since the mouse is on it
    pg.wait_for_timeout(3500)
    check('Bar stays when it slides in under a still mouse', 'show-b' in cls())
    # near the top edge but below the header: hides after 2 s without moving
    pg.mouse.move(W / 2, H / 2, steps=4)
    eventually("!$('app').classList.contains('show-b')")
    hh0 = v("$('app').querySelector('.head').offsetHeight")
    v("window.__pm = []; document.addEventListener('pointermove', (e) => { if (__pm.length < 60) __pm.push([Math.round(performance.now()), e.clientX, e.clientY, e.isTrusted, e.target.id || e.target.className]); }, true); TH.dbg = 0;")
    v("window.__thlog = []; window.__tho = new MutationObserver(() => __thlog.push([performance.now(), $('app').classList.contains('show-t')])); __tho.observe($('app'), { attributes: true, attributeFilter: ['class'] });")
    pg.mouse.move(W / 2, hh0 + 6, steps=6)
    try:
        pg.wait_for_function("() => { const l = window.__thlog || []; const on = l.findIndex((x) => x[1]); return on >= 0 && l.slice(on).some((x) => !x[1]); }", timeout=30000)
    except Exception:
        print('PM', v("JSON.stringify(__pm.slice(-25))"))
        print('DEBUG', v("JSON.stringify({ timers: Object.keys(TH.timers), log: __thlog, cls: $('app').className, TH: { x: TH.x, y: TH.y, drag: TH.drag }, under: (thUnder() || {}).id || (thUnder() || {}).className, active: document.activeElement.tagName + '#' + document.activeElement.id, hh: $('app').querySelector('.head').offsetHeight })"))
        raise
    span = v("(() => { const l = __thlog; const on = l.find((x) => x[1]); const off = l.slice(l.indexOf(on)).find((x) => !x[1]); __tho.disconnect(); return Math.round(off[0] - on[0]); })()")
    check('Near the top edge, below the header: hides after 2 s still', span >= 1900, f'shown for {span} ms')
    pg.mouse.move(W / 2, H - 20, steps=6); pg.wait_for_timeout(400)

    # 5. on the bar: stays while you're on it
    pg.mouse.move(W / 2, H - 30, steps=3); pg.wait_for_timeout(300)
    tly = v("(() => { const r = $('tl').getBoundingClientRect(); return r.top + r.height / 2; })()")
    pg.mouse.move(W / 2, tly, steps=3); pg.wait_for_timeout(3000)
    check('Bar stays while the mouse is on it', 'show-b' in cls())

    # 6. scrubbing the timeline works and keeps the bar
    t0 = v('T')
    pg.mouse.down(); pg.mouse.move(W * 0.3, tly, steps=10); pg.mouse.move(W * 0.7, tly, steps=10); pg.mouse.up()
    pg.wait_for_timeout(300)
    check('Timeline scrub moves playback', abs(v('T') - t0) > 5, f'{t0:.1f} -> {v("T"):.1f}')
    check('Bar stays during and after the scrub', 'show-b' in cls())

    # 7. leaving the bar hides it shortly
    pg.mouse.move(W / 2, H / 2, steps=8)
    check('Bar hides soon after leaving it', eventually("!$('app').classList.contains('show-b')"))

    # 8. dragging to look around never pulls a bar in
    v("setCam('eyes', true)")
    pg.mouse.move(W / 2, H / 2); pg.mouse.down()
    pg.mouse.move(W / 2 + 40, H - 10, steps=15); pg.wait_for_timeout(300)
    during = cls()
    pg.mouse.move(W - 5, H / 2, steps=10); pg.wait_for_timeout(300)
    during2 = cls()
    pg.mouse.up(); pg.mouse.move(W / 2, H / 2, steps=5); pg.wait_for_timeout(900)
    check('Drag to the bottom edge does not pull the bar in', 'show-b' not in during, during)
    check('Drag to the right edge does not pull the panel in', 'show-r' not in during2, during2)
    check('The drag still looked around (free camera)', v('cam3.mode') == 'free')

    # 9. top edge: header and camera buttons, the round pill moves below the header
    pg.mouse.move(W / 2, 10, steps=8); pg.wait_for_timeout(400)
    check('Top edge shows the header and camera buttons', 'show-t' in cls() and v("getComputedStyle($('cam3')).opacity") == '1')
    eventually("$('rclock').getBoundingClientRect().top >= $('app').querySelector('.head').offsetHeight")
    rc = v("$('rclock').getBoundingClientRect().top"); hh = v("$('app').querySelector('.head').offsetHeight")
    check('Round pill moves below the header', rc >= hh, f'pill top {rc:.0f}, header {hh}')
    pg.screenshot(path=f'th_{label}_top.png')
    # an open menu in that bar keeps it
    v("$('q3').focus()"); pg.mouse.move(W / 2, H / 2, steps=5); pg.wait_for_timeout(2600)
    check('Header stays while its Quality menu has focus', 'show-t' in cls())
    v("$('q3').blur()"); pg.mouse.move(W / 2 + 10, H / 2, steps=2)
    check('Header hides after the menu closes', eventually("!$('app').classList.contains('show-t')"))

    # 10. right edge: side panel, kill feed moves left of it
    pg.mouse.move(W - 10, H / 2, steps=8); pg.wait_for_timeout(400)
    check('Right edge shows the side panel', 'show-r' in cls())
    eventually("$('feed').getBoundingClientRect().right <= $('side').getBoundingClientRect().left + 1")
    fr = v("$('feed').getBoundingClientRect().right"); sl = v("$('side').getBoundingClientRect().left")
    check('Kill feed moves left of the panel', fr <= sl + 1, f'feed right {fr:.0f}, panel left {sl:.0f}')
    pg.screenshot(path=f'th_{label}_right.png')
    pg.mouse.move(W / 2, H / 2, steps=5); pg.wait_for_timeout(900)

    # 11. cursor hides after 2 s still over the view
    eventually("$('app').classList.contains('idle')")
    check('Cursor hides when the mouse is still', 'idle' in cls() and v("getComputedStyle($('gl')).cursor") == 'none')
    pg.mouse.move(W / 2 + 5, H / 2); pg.wait_for_timeout(100)
    check('Cursor comes back on moving', 'idle' not in cls())

    # 12. mouse leaves the window: everything tucks away
    pg.mouse.move(W / 2, H - 10, steps=5); pg.wait_for_timeout(300)
    v("document.documentElement.dispatchEvent(new MouseEvent('mouseleave'))")
    check('Leaving the window hides the bar', eventually("!$('app').classList.contains('show-b')"))

    # 13. 2D and split views fill the window too
    pg.mouse.move(W / 2, H / 2)
    v("setView('2d')"); pg.wait_for_timeout(700)
    check('2D radar fills the window', rect('#cv') == [W, H], str(rect('#cv')))
    pg.screenshot(path=f'th_{label}_2d.png')
    v("setView('split')"); pg.wait_for_timeout(700)
    pg.mouse.move(W / 2, H - 20, steps=5); pg.wait_for_timeout(400)
    eventually("$('cv').getBoundingClientRect().bottom <= $('app').querySelector('.transport').getBoundingClientRect().top + 1")
    mb = v("$('cv').getBoundingClientRect().bottom"); tt = v("$('app').querySelector('.transport').getBoundingClientRect().top")
    check('Split view: minimap moves above the bar', mb <= tt + 1, f'minimap bottom {mb:.0f}, bar top {tt:.0f}')
    pg.screenshot(path=f'th_{label}_split.png')
    pg.mouse.move(W / 2, H / 2, steps=5); pg.wait_for_timeout(900)
    v("setView('3d')")

    # 14. start screen pauses it, coming back restores it
    v("showLoad(true)"); pg.wait_for_timeout(300)
    check('Start screen shows the normal layout', 'theatre' not in cls() and v("getComputedStyle(document.querySelector('.head')).opacity") == '1')
    v("showLoad(false)"); pg.wait_for_timeout(300)
    check('Back to the demo restores Theatre mode', 'theatre' in cls())

    # 15. T again leaves it, view back to normal size
    pg.keyboard.press('t'); pg.wait_for_timeout(700)
    check('T leaves Theatre mode', 'theatre' not in cls())
    check('View back to its normal size', rect('#gl') == normal, f'{rect("#gl")} vs {normal}')

    # 16. full screen (F) turns it on, leaving full screen turns it off again
    pg.keyboard.press('f'); pg.wait_for_timeout(1200)
    fs = v('!!document.fullscreenElement')
    check('F enters full screen', fs)
    check('Full screen turns Theatre mode on', 'theatre' in cls())
    v('document.exitFullscreen()'); pg.wait_for_timeout(1200)
    check('Leaving full screen turns it off', 'theatre' not in cls())
    # already in Theatre mode before full screen: stays on after leaving full screen
    pg.keyboard.press('t'); pg.wait_for_timeout(300); pg.keyboard.press('f'); pg.wait_for_timeout(1200)
    v('document.exitFullscreen()'); pg.wait_for_timeout(1200)
    check('Theatre mode chosen before full screen stays on after it', 'theatre' in cls())
    pg.keyboard.press('t'); pg.wait_for_timeout(300)

    check('No page errors', not errs, '; '.join(errs[:3]))
    b.close()

print(f'== {label}: {W}x{H} at {DPR}x')
print('\n'.join(results))
print(f'{len(results) - len(fails)} of {len(results)} passed')
