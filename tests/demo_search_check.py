"""Checks the search box over the demo list on the start screen (0.15.2), and the start screen's message line when
it comes back after a demo (0.26.12).

Usage: HALF_LIFE_DIR=/path/to/Half-Life DEMO_DIRS=... python3 demo_search_check.py [page.html] [screenshot.png]
Needs the Half-Life folder and DEMO_DIRS (for the demos, demo_dirs.py), not maps or sounds. Opens SK vs Na`Vi, Train,
DreamHack Winter 2011 from a filtered row, then again from a temporary Half-Life folder holding only that demo (a
clone or hard link, never moved) and a stand-in demo, so its map has no overview: up to 0.26.11 the message line still
said "Reading name…" when the start screen came back (Sujan, 3 Nov 2026). In 2D, the map ends above the controls along
the bottom of the view where it opens and after Reset view, at three window sizes (0.26.14). In 3D, Player's eyes keeps
the game's 4:3 view top to bottom at three window sizes, unzoomed and through the AWP's scope (0.26.15); this part needs
de_train's map and models in the Half-Life folder. Kill details, Damage numbers, the red skull and Vanilla on that demo, and
kill details and View settings in POV mode on Match 1 CT (de_barcelona's map needed) (0.26.16). Under a minute.
"""
import os, re, sys, http.server, functools, threading, tempfile, shutil, subprocess, atexit
from playwright.sync_api import sync_playwright
import demo_dirs

page_path = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'index.html'))
# a copy of the page with the test hook (window.__v), for the field of view checks in 3D; the shipped page is never changed
_html = open(page_path, encoding='utf-8').read(); _i = _html.rindex('})();')
hooked = os.path.join(os.path.dirname(page_path), '_test_demosearch.html')
open(hooked, 'w', encoding='utf-8').write(_html[:_i] + 'window.__v = (c) => eval(c);\n' + _html[_i:])
atexit.register(lambda: os.path.exists(hooked) and os.remove(hooked))
shot = sys.argv[2] if len(sys.argv) > 2 else None
_hl, _inside, _outside = demo_dirs.collect()
HL = demo_dirs.stage(_outside)
here = os.path.dirname(os.path.abspath(__file__))
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.dirname(page_path)); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
# every demo the viewer lists: the whole folder it's given, subfolders included
names = sorted(os.path.basename(p) for p in demo_dirs.dems(HL))
fails = []
def check(label, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + label + (f'  ({extra})' if extra else ''))
    if not ok: fails.append(label)

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']); pg = b.new_page(viewport={'width': 880, 'height': 1300})
    pg.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(hooked)}')
    check('no search box before a folder is chosen', pg.locator('#demoFind').is_hidden())
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_selector('#demoList button')
    rows = lambda: pg.eval_on_selector_all('#demoList button em', 'els => els.map((e) => e.textContent)')
    count = lambda: pg.inner_text('#demoN')
    check('search box shown with the full list and its count', pg.locator('#demoFind').is_visible() and len(rows()) == len(names) and count() == str(len(names)), count())
    for q in ['tu', 'TU', 'sk train', 'eswc2010 tuscan', 'dhwinter']:
        pg.fill('#demoQ', q)
        words = q.lower().split()
        want = [n for n in names if all(w in n.lower() for w in words)]
        got = rows()
        check(f'"{q}": exactly the demos whose names contain every word', sorted(got) == sorted(want), f'{len(got)} of {len(names)}')
        check(f'"{q}": count reads "{len(want)} of {len(names)}"', count().replace('\n', ' ').strip().lower() == f'{len(want)} of {len(names)}', count())
        marked = pg.eval_on_selector_all('#demoList button em', 'els => els.map((e) => [...e.querySelectorAll("mark")].map((m) => m.textContent.toLowerCase()).join("|"))')
        check(f'"{q}": every typed word highlighted in every row', all(all(any(w in m for m in mk.split('|')) for w in words) for mk in marked))
    pg.fill('#demoQ', 'sk train')
    if shot: pg.locator('.load-card').screenshot(path=shot)
    pg.fill('#demoQ', 'zzzz')
    check('no match: the list says so', 'No demo names contain "zzzz"' in pg.inner_text('#demoList'))
    pg.press('#demoQ', 'Escape')
    check('Esc clears the search and brings back the full list', pg.input_value('#demoQ') == '' and len(rows()) == len(names))
    check('Esc in the box does not open the shortcuts list', pg.locator('#keys').is_hidden())
    pg.fill('#demoQ', 'tu'); pg.click('#demoQx')
    check('Clear empties the box and brings back the full list', pg.input_value('#demoQ') == '' and len(rows()) == len(names) and pg.locator('#demoQx').is_hidden())
    # one row only: "sk train" also matches SK vs eSTRO's 13-second warmup files (WCG 2008) since the test demos joined
    pg.fill('#demoQ', 'sk navi train')
    check('"sk navi train": one row, SK vs Na`Vi, Train, DreamHack Winter 2011', rows() == ['sk-vs-navi-dhwinter2011-1111261019-de_train.dem'], ', '.join(rows()))
    pg.click('#demoList button')
    pg.wait_for_function('() => document.getElementById("load").hidden', timeout=120000)
    check('a filtered row opens its demo', True)

    # the 2D map ends above the controls along the bottom of the view (0.26.14, Sujan, 3 Nov 2026): where the map sits
    # when it opens or resets, at R1 freeze 0:12 (the moment the demo opens). The radar canvas is see-through outside
    # the map's image, so nothing drawn from the controls' top down means the map and its labels end above them
    under = """() => { const cv = document.getElementById('cv'), r = cv.getBoundingClientRect(), k = cv.width / r.width;
      const top = Math.min(...['legend', 'heatbar'].map((id) => document.getElementById(id).getBoundingClientRect().top)) - r.top;
      const y = Math.max(0, Math.floor(top * k)), g = cv.getContext('2d'), n = (y0, y1) => { let c = 0; const d = g.getImageData(0, y0, cv.width, Math.max(1, y1 - y0)).data; for (let i = 3; i < d.length; i += 4) if (d[i]) c++; return c; };
      return { below: n(y, cv.height), above: n(0, y), top: Math.round(top), clock: document.getElementById('rclock').textContent }; }"""
    pg.keyboard.press('Escape')  # the load summary, which would take the click on Reset view below
    pg.click('#viewSeg button[data-v="2d"]')
    pg.wait_for_function("() => { const c = document.getElementById('cv'); return c.width > 0 && c.getContext('2d').getImageData(c.width >> 1, c.height >> 1, 1, 1).data[3] > 0; }", timeout=30000)
    for w, h, label in [(1366, 768, '1366x768'), (2560, 1440, '2560x1440 (Interface size Auto, 130%)'), (880, 1300, 'the test\'s own 880x1300')]:
        pg.set_viewport_size({'width': w, 'height': h}); pg.wait_for_timeout(600)
        u = pg.evaluate(under)
        check(f'2D map at {label}: it ends above the Heatmap, Both sides and Whole match controls and the buttons beside them', u['below'] == 0 and u['above'] > 0,
              f"{u['below']} pixels drawn under the controls' top ({u['top']} px down), {u['above']} above it; {u['clock'].split('·', 1)[-1].strip()}")
    pg.set_viewport_size({'width': 1366, 'height': 768}); pg.wait_for_timeout(400)
    box = pg.locator('#cv').bounding_box(); pg.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
    for _ in range(4): pg.mouse.wheel(0, -300); pg.wait_for_timeout(80)
    pg.wait_for_timeout(300); zoomed = pg.evaluate(under)
    pg.click('#tgFit'); pg.wait_for_timeout(500); reset = pg.evaluate(under)
    check('2D map zoomed in goes under the controls, Reset view brings it back above them (1366x768)', zoomed['below'] > 0 and reset['below'] == 0 and reset['above'] > 0,
          f"zoomed: {zoomed['below']} pixels under; after Reset view: {reset['below']}")
    pg.set_viewport_size({'width': 880, 'height': 1300})

    # Player's eyes keeps the game's 4:3 view top to bottom (0.26.15, Sujan, 3 Nov 2026): the game's 90 degrees, or a
    # zoom level, is the width of a 4:3 picture, so on any view wider than 4:3 three.js's fov (top to bottom) is 73.74
    # unzoomed and 30.54 at the AWP's first zoom (40); a view narrower than 4:3 keeps the fov across its width. Up to
    # 0.26.14 every view kept 90 across, so at 2560x1440 it read 61.08 and guns and players looked 27% too big.
    # markeloff with the AWP at R23 1:22, 0.35 s before his kill on GeT_RiGhT, then at that kill (the pull request's moment)
    pg.click('#viewSeg button[data-v="3d"]')
    pg.wait_for_function('__v("!!(MAP && R3 && view3.map === MAP.name)")', timeout=120000)
    pg.evaluate('(c) => __v(c)', """(() => { const me = D.kills.find((k) => M.pl[k.kp] && /markeloff/.test(M.pl[k.kp].name)).killer;
      const k = D.kills.find((x) => x.killer === me && x.weapon === 'awp' && Math.abs(x.t - D.start - 2663.65) < 0.05);
      window.__fov = { me, eyes: D.start + 2663.3, scope: k.t - 0.05 }; selected = me; setCam('eyes', true); playing = false; })()""")
    at = lambda key: pg.evaluate('(c) => __v(c)', f"(async () => {{ T = __fov.{key}; await new Promise((r) => setTimeout(r, 400)); return {{ fov: R3.camera.fov, aspect: R3.camera.aspect, zoom: zoomLevel(__fov.me, T), clock: (clockAt(T) || {{}}).text }}; }})()")
    import math
    want = lambda game, aspect: 2 * math.degrees(math.atan(math.tan(math.radians(game / 2)) * max(0.75, 1 / aspect)))
    for w, h, label in [(1512, 982, 'a MacBook window, 1512x982'), (2560, 1440, '2560x1440'), (880, 1300, 'the test\'s own 880x1300, narrower than 4:3')]:
        pg.set_viewport_size({'width': w, 'height': h}); pg.wait_for_timeout(600)
        e, z = at('eyes'), at('scope')
        shape = (e['aspect'] > 4 / 3) == (w > 880)
        check(f"Player's eyes at {label}: 90 degrees across a 4:3 picture, and the AWP's first zoom by the same rule",
              shape and e['zoom'] == 0 and z['zoom'] == 1 and abs(e['fov'] - want(90, e['aspect'])) < 0.01 and abs(z['fov'] - want(40, z['aspect'])) < 0.01,
              f"view {e['aspect']:.3f} wide; fov top to bottom {e['fov']:.2f} unzoomed (want {want(90, e['aspect']):.2f}), {z['fov']:.2f} zoomed (want {want(40, z['aspect']):.2f}); R23 {e['clock']}")

    # Kill details, Damage numbers, the red skull and Vanilla (0.26.16; Sujan, 3 Nov 2026, docs/kill-details-damage-vanilla-mock.jpg):
    # R24 0:35, ceh9 kills Delpan with an M4A1 headshot through a wall (strict); before it one hit in the open (-30) and three
    # through the wall (-17), the first two in one frame, -30 first by the demo's health readings; the headshot takes the 12
    # HP he had left, and an HE grenade had taken 7 at 0:45. At a MacBook window, Player's eyes on ceh9, paused 0.03 s after.
    pg.set_viewport_size({'width': 1512, 'height': 982}); pg.wait_for_timeout(400)
    JS = lambda c: pg.evaluate('(c) => __v(c)', c)
    try:
        kd = JS(r"""(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms));
          const k = window.__kd = D.kills.find((x) => Math.abs(x.t - D.start - 2790.34) < 0.05);
          selected = k.killer; setCam('eyes', true); playing = false; T = k.t + 0.03; pickedKill = k; tab = 'kills'; renderPane(); await w(300);
          const read = () => { const b = document.querySelector('.kdet'); return b ? [b.querySelector('.ksum'), b.querySelector('.kpre')].map((e) => e ? e.innerText.trim() : '').concat([...b.querySelectorAll('.kb')].map((x) => x.innerText.replace(/\s+/g, ' ').trim())) : null; };
          const kills = read(); tab = 'wb'; renderPane(); await w(300); const wb = read(); tab = 'kills'; renderPane(); await w(200);
          document.querySelectorAll('.kdet .kb')[1].click(); await w(300);
          const jump = { t: +(T - D.start).toFixed(2), paused: !playing, eyes: cam3.mode === 'eyes' && selected === k.killer };
          return { kills, wb, jump }; })()""")
        want = ['5 hits · 4 through a wall · 93 HP in 0.30 s', 'Earlier: −7 from a grenade at 0:45.', '1 −30 chest or arm* · in the open −0.30 s',
                '2 −17 body · through a wall −0.30 s', '3 −17 body · through a wall −0.21 s', '4 −17 body · through a wall −0.11 s', '5 −12HS head · through a wall kill']
        check('kill details: the picked kill in the Kills list opens to one line per bullet, the "Earlier:" line and the order of the demo', kd['kills'] == want, ' | '.join(kd['kills'] or ['no box']))
        check('kill details: the same in the Wallbangs list', kd['wb'] == want, ' | '.join(kd['wb'] or ['no box']))
        check("kill details: a bullet's line jumps playback to it, paused, through the killer's eyes", kd['jump'] == {'t': 2790.07, 'paused': True, 'eyes': True}, str(kd['jump']))
        # the floating numbers, read from the label canvas: white for a hit in the open, orange through a wall, the red skull
        px = r"""(async (mode, van) => { const w = (ms) => new Promise((r) => setTimeout(r, ms));
          if (mode) $('dn3').value = mode; if (van != null) setVanilla(van); // Vanilla after: it turns the numbers off
          T = __kd.t + 0.03; await w(500); const c = $('lbl'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let red = 0, white = 0, orange = 0, pink = 0;
          for (let i = 0; i < d.length; i += 4) { const r = d[i], g = d[i + 1], b = d[i + 2]; if (d[i + 3] < 120) continue; // numbers fade after 0.15 s
            if (r > 245 && g < 80 && b < 70) red++; else if (r > 170 && g > 165 && b > 155 && r - b < 30) white++; else if (r > 245 && g > 165 && g < 190 && b < 90) orange++; else if (r > 245 && g < 100 && b > 200) pink++; }
          return { red, white, orange, pink, names: opts.names, pill: $('rclock').innerText }; })"""
        JS("$('glow3').checked = false")  # its pink glow would read as the ✕ of 0.26.15
        n = {m: JS(f"({px})('{m}', null)") for m in ['wb', 'both', 'direct', 'off']}
        check('Damage numbers: Wallbangs as before, orange through a wall, the killing bullet a red skull in place of the pink ✕',
              n['wb']['orange'] > 40 and n['wb']['red'] > 20 and n['wb']['white'] < 5 and n['wb']['pink'] < 5, str(n['wb']))
        check('Damage numbers: Both adds the hit in the open in white', n['both']['white'] > 20 and n['both']['orange'] > 40 and n['both']['red'] > 20, str(n['both']))
        check('Damage numbers: Direct hits shows only the hit in the open (the kill is a wallbang), Off none', n['direct']['white'] > 20 and n['direct']['orange'] < 5 and n['direct']['red'] < 5
              and n['off']['white'] < 5 and n['off']['orange'] < 5 and n['off']['red'] < 5, f"direct {n['direct']}, off {n['off']}")
        v = JS(f"({px})('both', true)")
        check('Vanilla: no damage numbers, no names, with Damage numbers on Both before it', v['white'] < 5 and v['orange'] < 5 and v['red'] < 5 and not v['names'], str(v))
        # the C4 countdown: the round pill says "C4" alone after the plant with Vanilla on
        c4 = JS(r"""(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms)); let t = null;
          for (const r of M.liveR) for (let x = r.start; x < r.end; x += 1) if (t == null && (clockAt(x, true) || {}).phase === 'bomb') t = x + 3;
          T = t; updateHud(true); await w(200); const on = $('rclock').innerText; setVanilla(false); updateHud(true); await w(200); return { on, off: $('rclock').innerText }; })()""")
        check('Vanilla: the round pill says "C4" without the countdown after the plant, and counts down again with Vanilla off',
              c4['on'].endswith('· C4') and re.search(r'C4 \d:\d\d$', c4['off']) is not None, f"{c4['on']!r}, then {c4['off']!r}")
    except Exception as e:
        check('kill details, Damage numbers, the red skull and Vanilla', False, str(e).split('\n')[0])
    JS("pickedKill = null; if ($('dn3')) $('dn3').value = 'wb'; $('glow3').checked = true")
    pg.click('#viewSeg button[data-v="2d"]')

    # the message line when the start screen comes back (0.26.12): empty, whether or not an overview loaded
    msg = lambda pg: pg.evaluate("document.getElementById('msg').textContent")
    def back_to_start(pg):
        pg.click('#btnOpen'); pg.wait_for_function('() => !document.getElementById("load").hidden', timeout=5000); pg.wait_for_timeout(500)
    back_to_start(pg)
    check('back to the start screen after a demo whose overview loaded: the message line is empty', msg(pg) == '', msg(pg))
    SK = 'sk-vs-navi-dhwinter2011-1111261019-de_train.dem'
    tmp = tempfile.mkdtemp(prefix='reading_msg_'); atexit.register(shutil.rmtree, tmp, True)
    hl2 = os.path.join(tmp, 'Half-Life'); os.makedirs(os.path.join(hl2, 'cstrike'))
    src = next(q for q in demo_dirs.dems(HL) if os.path.basename(q) == SK); dst = os.path.join(hl2, 'cstrike', SK)
    if not (sys.platform == 'darwin' and subprocess.run(['cp', '-c', src, dst], capture_output=True).returncode == 0):
        try: os.link(src, dst)
        except OSError: shutil.copy2(src, dst)
    stand_in = os.path.join(hl2, 'cstrike', 'deleted-later.dem'); open(stand_in, 'wb').write(b'\0' * 2000)
    # a new browser profile: the overviews the first pick saved in the browser would stand in for the missing one
    ctx2 = b.new_context(viewport={'width': 880, 'height': 1300}); pg2 = ctx2.new_page()
    pg2.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    pg2.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(hooked)}')
    pg2.set_input_files('#fFolder', hl2)
    pg2.wait_for_function("() => document.getElementById('hlStatus').textContent.includes('2 demos found.')", timeout=10000)
    pg2.click(f'#demoList button:has-text("{SK}")')
    pg2.wait_for_function('() => document.getElementById("load").hidden', timeout=120000)
    behind = msg(pg2)
    back_to_start(pg2)
    check('back to the start screen after a demo with no overview in the folder: the message line is empty (it said "Reading …" up to 0.26.11)',
          behind.startswith(f'Reading {SK}') and msg(pg2) == '', f'behind the view: {behind!r}; on the start screen: {msg(pg2)!r}')
    pg2.click('#btnOpen'); pg2.wait_for_function('() => document.getElementById("load").hidden', timeout=5000)
    os.remove(stand_in)
    pg2.click('#btnOpen')
    try: pg2.wait_for_function("() => document.getElementById('msg').textContent.includes('taken off the list')", timeout=5000)
    except Exception: pass
    check('a demo deleted while a demo was open: back on the start screen, its note still shows and the count says 1',
          msg(pg2).startswith('deleted-later.dem is no longer in your folder') and pg2.inner_text('#hlStatus') == '1 demo found.', f'{msg(pg2)!r}, {pg2.inner_text("#hlStatus")!r}')
    ctx2.close()

    # POV mode (0.26.16; Sujan, 3 Nov 2026): kill details have nothing to list, since the recorder's demo has only his
    # teammates' health, and View settings hides Damage numbers, as it hides Glow on hits and Crosshair. Match 1 CT (public
    # server, de_barcelona, 27 Mar 2025): his M4A1 kill on H@rDRoCk at R1 0:49, and Nnewys' kill on his teammate nsnd at 0:46
    POVD = next((n for n in names if n.lower().startswith('match-1_de_barcelona-cts')), None)
    ctx3 = b.new_context(viewport={'width': 1512, 'height': 982}); pg3 = ctx3.new_page()
    pg3.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    try:
        pg3.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(hooked)}')
        pg3.evaluate("__v(\"$('pov3').checked = true\")")
        pg3.set_input_files('#fFolder', HL)
        pg3.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
        pg3.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name === ${JSON.stringify(n)}))`)', POVD)
        pg3.wait_for_function('__v("!!(D && M && MAP && R3 && view3.map === MAP.name)")', timeout=120000)
        pv = pg3.evaluate('(c) => __v(c)', r"""(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms)); closeSummary(); setView('3d'); await w(500);
          const rec = POV.v.rec, near = (t) => D.kills.find((x) => Math.abs(x.t - D.start - t) < 0.3);
          const box = async (k) => { T = k.t + 0.03; playing = false; pickedKill = k; tab = 'kills'; renderPane(); await w(200); const b = document.querySelector('.kdet'); return b ? b.innerText.trim() : null; };
          const his = near(71.99), mate = D.kills.find((x) => x.t > his.t && x.t - his.t < 5 && x.killer !== rec && x.victim !== rec && x.weapon === 'ak47');
          return { his: his && his.killer === rec ? await box(his) : 'not his kill', mate: mate ? await box(mate) : 'no teammate death', mateName: mate && M.pl[mate.vp].name,
            dnHidden: $('dn3').closest('.vrow').hidden, glowHidden: $('glow3').closest('.vrow').hidden, vanShown: !$('van3').closest('.vrow').hidden }; })()""")
        check("POV mode: kill details on an enemy's death say there's nothing to list, naming him", pv['his'] == "No hit details. A demo recorded by a player has only his teammates' health, not H@rDRoCk's.", repr(pv['his']))
        check('POV mode: kill details on a teammate\'s death say "No hit details in POV mode."', pv['mate'] == 'No hit details in POV mode.', f"{pv['mateName']}: {pv['mate']!r}")
        check('POV mode: View settings hides Damage numbers, as it hides Glow on hits; Vanilla stays', pv['dnHidden'] and pv['glowHidden'] and pv['vanShown'], str(pv))
    except Exception as e:
        check('POV mode: kill details and View settings', False, (POVD or 'Match 1 CT not found') + ': ' + str(e).split('\n')[0])
    ctx3.close()
    b.close()
print(f'{len(fails)} failed' if fails else 'all passed')
sys.exit(1 if fails else 0)
