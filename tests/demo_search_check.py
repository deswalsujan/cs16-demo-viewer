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
kill details and View settings in POV mode on Match 1 CT (de_barcelona's map needed) (0.26.16). Damage numbers on Both and
Direct hits through three kills with no death spot, on EG vs eXecutors, Train, EM4 finals: no page error, and playback keeps
moving (0.26.17). On that demo, drawHitNumbers and then updateCentre made to throw every frame: playback keeps
moving, the toast shows once and each error is listed once; a fade left by an error is gone the next frame; a 3D build that
throws partway runs once, says the map couldn't be drawn, and is built again after resetForNewDemo (0.26.18). WeMadeFox vs
Ravens, Nuke, EM4 finals, in 2 files: the Join card in the suggested order and with part 2 put first, the joined score and
the Rounds tab's replayed rounds; the order the card suggests for Na`Vi vs SK, Inferno, ESWC 2011 (0.26.19). The keys on SK vs
Na`Vi: ↑ and ↓ for the next and previous player, Z and X for rounds, in 2D, 3D and split, a focused side panel left where it
was, the shortcuts list and tooltips; the Join card's line when the folder holds no other demo (0.26.20). The match rules: the rounds before both teams were
full on compLexity vs WeMadeFox, Nuke, IEM4; the rounds after 16 counted by themselves on SK vs Na`Vi, Dust2, IEM4, Stop at
16 kept, Count them; the admin's team names on Burning vs FairFrag, Inferno, ESWC 2010 (0.26.21). About a minute and a half.
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
        # a crossfire (Sujan, 3 Nov 2026, before merging #47): R23 1:18, edzie kills face with the FAMAS; face had lost 33 HP to
        # three grenades, and after edzie's −19 starix hit him for −21 and a −21 came the hit finder can't pin on anyone, before
        # edzie's last bullet took the 6 he had left. "Earlier:" counts every drop of his in the round that isn't one of edzie's
        # listed bullets; as first built it counted only those before edzie's first and read "−42, source unknown".
        cf = JS(r"""(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms));
          const k = D.kills.find((x) => Math.abs(x.t - D.start - 2667.38) < 0.05); T = k.t + 0.03; pickedKill = k; renderPane(); await w(300);
          const p = document.querySelector('.kdet .kpre'), out = p ? p.innerText.trim() : null;
          pickedKill = __kd; T = __kd.t + 0.03; renderPane(); await w(200); return out; })()""")
        check('kill details: "Earlier:" names a crossfire hit between the killer\'s bullets (starix on face, R23 1:18), "source unknown" only with its time',
              cf == 'Earlier: −12 from a grenade at 1:25, −8 from a grenade at 1:23, −13 from a grenade at 1:23, −21 from starix at 1:19, −21 at 1:19, source unknown.', repr(cf))
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

    # The keys (Sujan, 8 Nov 2026): ↑ and ↓ pick the next and previous player, as a click and a right-click on the view do;
    # Z and X move a round, one per press when held; 1 to 0 as before. Real key presses, so a key's default (scrolling the
    # side panel, a slider's value) would happen if it weren't stopped; the Rounds tab, the one long enough to scroll at a
    # MacBook window. Up to 0.26.19 ↑ and ↓ moved a round and Z and X a player.
    try:
        JS("(() => { window.__dp = []; window.addEventListener('keydown', (e) => __dp.push(e.key + ':' + e.defaultPrevented)); })()")
        state = lambda: JS(r"""(() => { const r = roundAt(T); return { sel: selected, ln: r && r.live ? r.ln : null, t: +(T - D.start).toFixed(2), mode: cam3.mode, view: viewMode,
          held: Object.keys(cam3.keys).filter((k) => cam3.keys[k]), scroll: $('pane').scrollTop }; })()""")
        def setup(view, cam):
            return JS(r"""(async (view, cam) => { const w = (ms) => new Promise((r) => setTimeout(r, ms)); playing = false; setPlayIcon(); setView(view); await w(300);
              const r = M.liveR[10]; seek(r.start + 12); const al = alivePlayers(); selected = al[2]; if (view !== '2d') setCam(cam, true); tab = 'rounds'; renderPane(); await w(200);
              const p = $('pane'); p.tabIndex = -1; p.scrollTop = Math.min(120, p.scrollHeight - p.clientHeight); p.focus(); __dp.length = 0;
              return { al, scroll: p.scrollTop }; })""" + f"('{view}', '{cam}')")
        for view, cam, label in [('3d', 'eyes', "3D, Player's eyes"), ('2d', 'free', '2D'), ('split', 'chase', 'split, Behind player')]:
            st = setup(view, cam); al = st['al']; a = state()
            pg.keyboard.press('ArrowUp'); up = state(); pg.keyboard.press('ArrowDown'); down = state()
            check(f'{label}: ↑ picks the next player and ↓ the previous one, the round and the time unchanged',
                  up['sel'] == al[3] and down['sel'] == al[2] and up['ln'] == down['ln'] == a['ln'] and up['t'] == down['t'] == a['t'], f"{a['sel']} -> {up['sel']} -> {down['sel']} (want {al[3]}, {al[2]}); R{a['ln']} -> R{up['ln']} -> R{down['ln']}")
            dp = JS('__dp.slice()')
            check(f'{label}: ↑ and ↓ leave the focused side panel where it was scrolled, their default stopped',
                  up['scroll'] == down['scroll'] == a['scroll'] and a['scroll'] > 0 and dp == ['ArrowUp:true', 'ArrowDown:true'], f"scroll {a['scroll']} -> {up['scroll']} -> {down['scroll']}; {dp}")
            pg.keyboard.press('x'); x = state(); pg.keyboard.press('z'); z = state()
            check(f'{label}: X goes to the next round and Z back, the player kept', x['ln'] == a['ln'] + 1 and z['ln'] == a['ln'] and x['sel'] == z['sel'] == al[2], f"R{a['ln']} -> R{x['ln']} -> R{z['ln']}, player {x['sel']}, {z['sel']}")
        pg.keyboard.down('x'); pg.keyboard.down('x'); pg.keyboard.down('x'); pg.keyboard.up('x'); held = state()
        check('X held down (two repeats): one round, not three', held['ln'] == a['ln'] + 1, f"R{a['ln']} -> R{held['ln']}")
        st = setup('3d', 'free'); al = st['al']
        pg.keyboard.press('ArrowUp'); f = state()
        check("3D Free view: ↑ holds no camera key (the free camera doesn't move) and goes to the next player's eyes, as X did up to 0.26.19",
              f['held'] == [] and f['mode'] == 'eyes' and f['sel'] == al[3], f"keys held {f['held']}, camera {f['mode']}, player {f['sel']} (want {al[3]})")
        # with the volume slider or the Quality list focused: the key works and the control keeps its value
        st = setup('3d', 'eyes'); al = st['al']; a = state()
        v0 = JS("(() => { const el = $('sndVol'); el.focus(); return el.value; })()"); pg.keyboard.press('ArrowUp'); v1 = JS("$('sndVol').value"); up = state()
        q0 = JS("(() => { vsetOpen(true); const el = $('q3'); el.focus(); return el.value; })()"); pg.keyboard.press('x'); q1 = JS("(() => { const v = $('q3').value; $('q3').blur(); vsetOpen(false); return v; })()"); x = state()
        check('↑ with the volume slider focused, X with the Quality list focused: player and round move, the controls keep their values',
              up['sel'] == al[3] and v1 == v0 and x['ln'] == a['ln'] + 1 and q1 == q0, f"player {a['sel']} -> {up['sel']}, volume {v0} -> {v1}; R{a['ln']} -> R{x['ln']}, Quality {q0} -> {q1}")
        k1 = JS("M.slotOf(playerOrder()[0], T)"); pg.keyboard.press('1')
        check('1 still jumps to the first player in scoreboard order', state()['sel'] == k1, f"{state()['sel']} (want {k1})")
        keys = pg.evaluate("[...document.querySelectorAll('#keys dt')].map((dt) => dt.innerText.replace(/\\s+/g, ' ').trim() + ' = ' + dt.nextElementSibling.innerText.trim())")
        check('shortcuts list: Z X for rounds, ↑ and ↓ for players',
              'Z X = Previous or next round' in keys and '↑ or click = Next player (while following one)' in keys and '↓ or right-click = Previous player' in keys and not any(k.startswith('↑ ↓') for k in keys),
              ' | '.join(k for k in keys if 'round' in k or 'player' in k.lower()))
        tips = pg.evaluate("['bPrevR', 'bNextR', 'bPrevP', 'bNextP'].map((id) => document.getElementById(id).title)")
        check('tooltips name the new keys', tips == ['Previous round (Z)', 'Next round (X)', 'Previous player (↓ or right-click)', 'Next player (↑ or click)'], ' | '.join(tips))
    except Exception as e:
        check('the keys: ↑ and ↓ for players, Z and X for rounds', False, str(e).split('\n')[0])
    JS("$('pane').removeAttribute('tabindex'); setView('2d'); setCam('free', true)")

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
    # the Join card with no other demo in the folder (Sujan, 8 Nov 2026): one line beside "A file from elsewhere…", no empty
    # list. Up to 0.26.19 the card showed a list holding only "Pick a demo…"
    try:
        pg2.click(f'#demoList button:has-text("{SK}")')
        pg2.wait_for_function('() => document.getElementById("load").hidden', timeout=120000)
        pg2.evaluate("__v(\"closeSummary(); tab = 'rounds'; renderPane(); $('bJoinWith').click()\")")
        pg2.wait_for_function("() => !!document.querySelector('#joinCard .jpick')", timeout=30000)
        jp = pg2.evaluate(r"""(() => { const p = document.querySelector('#joinCard .jpick'); return { text: p.innerText.replace(/\s+/g, ' ').trim(), sel: !!p.querySelector('select'), file: !!p.querySelector('#jFile'), tip: document.getElementById('jAdd').title }; })()""")
        check('Join card, no other demo in the folder: one line beside "A file from elsewhere…", no list',
              jp['text'] == 'There are no other demos in your Half-Life folder. A file from elsewhere…' and not jp['sel'] and jp['file'] and jp['tip'] == 'Pick a file from elsewhere above', str(jp))
    except Exception as e:
        check('Join card, no other demo in the folder', False, str(e).split('\n')[0])
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

    # A kill with no death spot (0.26.17; Sujan, 7 Nov 2026): EG vs eXecutors, Train, EM4 finals, R21 1:30, demo 36:18. The
    # recording skips there, and three kills in that snapshot (Loord on Storm[A]_, n0thing on neo, gfn on Loord) have no
    # vpos, since the victim was never in a snapshot before he died. In 0.26.16, Damage numbers on Direct hits or Both read
    # the missing spot for the killing bullet's number ("Cannot read properties of null (reading '0') at drawHitNumbers"),
    # and the error stopped the frame loop for good: the viewer froze. Played from 36:17 to 36:20 at 1x, in Player's eyes
    # on gfn and in Free view; no page error, and playback time keeps moving.
    EMD = 'fx.eg.em4finals-1003021929-de_train.dem'
    ctx4 = b.new_context(viewport={'width': 1512, 'height': 982}); pg4 = ctx4.new_page()
    pg4.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    errs = []; pg4.on('pageerror', lambda e: errs.append(str(e).split('\n')[0]))
    try:
        if EMD not in names: raise Exception(f'{EMD} not found in HALF_LIFE_DIR or DEMO_DIRS')
        pg4.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(hooked)}')
        pg4.set_input_files('#fFolder', HL)
        pg4.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
        pg4.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name === ${JSON.stringify(n)}))`)', EMD)
        pg4.wait_for_function('__v("!!(D && M && MAP && R3 && view3.map === MAP.name)")', timeout=120000)
        JS4 = lambda c: pg4.evaluate('(c) => __v(c)', c)
        nv = JS4(r"""(() => { closeSummary(); setView('3d'); playing = false; setSpeed(1);
          const nm = (i) => (M.pl[i] || {}).name || '?';
          return D.kills.filter((k) => !k.vpos && k.kp && Math.abs(k.t - D.start - 2178) < 2).map((k) => ({ killer: k.killer, k: nm(k.kp), v: nm(k.vp), t: +(k.t - D.start).toFixed(2) })); })()""")
        trio = [(x['k'], x['v']) for x in nv]
        found = all(any(re.search(a, k) and re.search(v, w) for k, w in trio) for a, v in [('Loord', 'Storm'), ('n0thing', 'neo'), ('gfn', 'Loord')])
        check('EG vs eXecutors, Train, EM4 finals, R21 1:30: Loord on Storm[A]_, n0thing on neo and gfn on Loord have no death spot (the case this checks)',
              found, '; '.join(f"{k} on {v} at {t}" for (k, v), t in zip(trio, [x['t'] for x in nv])) or 'none without a death spot')
        gfn = next((x['killer'] for x in nv if re.search('gfn', x['k'])), None)
        for mode, label in [('both', 'Both'), ('direct', 'Direct hits')]:
            for cam in ['eyes', 'free']:
                before = len(errs)
                JS4(f"""(() => {{ $('dn3').value = '{mode}'; playing = false; T = D.start + 2177; prevT = null;
                  {'selected = ' + str(gfn) + "; setCam('eyes', true);" if cam == 'eyes' else "setCam('free');"} playing = true; }})()""")
                try: pg4.wait_for_function('__v("T - D.start >= 2180")', timeout=30000); moved = True
                except Exception: moved = False
                st = JS4("({ t: +(T - D.start).toFixed(2), playing, cam: cam3.mode })"); JS4('playing = false')
                where = "Player's eyes on gfn" if cam == 'eyes' else 'Free view'
                check(f'Damage numbers on {label}, {where}: playing 36:17 to 36:20 through the kills with no death spot, no page error and playback keeps moving',
                      moved and len(errs) == before, f"demo {int(st['t'] // 60)}:{st['t'] % 60:05.2f}, {st['cam']}" + (f"; {errs[before]}" if len(errs) > before else '') + ('' if moved else '; playback stopped'))

        # One error can't stop the frame loop (0.26.18; Sujan, 7 Nov 2026, docs/frame-error-toast-mock.png): drawHitNumbers
        # made to throw every frame, 3 s of playback at 1x in Free view from demo 10:00; then updateCentre (the round
        # announcements) throwing another error for 1 s more. Playback keeps moving, the toast shows once with the
        # approved words, and each error is in Copy debug info's list exactly once. Up to 0.26.17 the first error stopped
        # the loop for good.
        TOAST = 'Something went wrong drawing this moment, so part of the view may be missing. Press ? and click Copy debug info to report it.'
        fe = JS4(r"""(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms));
          const hits = drawHitNumbers, centre = updateCentre, tst = toast, shown = [];
          toast = (t, ms) => { shown.push(t); return tst(t, ms); };
          drawHitNumbers = () => { throw new Error('test: drawHitNumbers throws'); };
          try {
            setCam('free'); playing = false; T = D.start + 600; prevT = null; playing = true; const t0 = T; await w(3000); const t1 = T;
            updateCentre = () => { throw new Error('test: updateCentre throws'); }; await w(1000); const t2 = T; playing = false;
            const n = (m) => ERRLOG.filter((e) => e.includes(m)).length, el = $('toast');
            return { moved: +(t1 - t0).toFixed(2), moved2: +(t2 - t1).toFixed(2), shown, toast: el && !el.hidden ? el.textContent : null,
              hits: n('test: drawHitNumbers throws'), centre: n('test: updateCentre throws'), line: ERRLOG.find((e) => e.includes('test: drawHitNumbers throws')) || null };
          } finally { drawHitNumbers = hits; updateCentre = centre; toast = tst; playing = false; } })()""")
        check('an error thrown every frame (drawHitNumbers): playback keeps moving through 3 s of playing', fe['moved'] >= 1 and fe['moved2'] > 0.3,
              f"{fe['moved']} s of demo in the first 3 s, {fe['moved2']} s in the next 1 s")
        check('an error thrown every frame: the toast shows once, with the approved words, also after a second, different error',
              fe['shown'] == [TOAST] and fe['toast'] == TOAST, f"{len(fe['shown'])} toasts: {fe['shown']}")
        check("each different error in Copy debug info's list exactly once, marked as caught in the frame loop",
              fe['hits'] == 1 and fe['centre'] == 1 and 'caught in the frame loop' in (fe['line'] or ''), f"drawHitNumbers {fe['hits']}, updateCentre {fe['centre']}; {fe['line']!r}")

        # No fade left behind (0.26.18; Sujan, 7 Nov 2026): drawHitNumbers made to set a number's fade (globalAlpha 0.2,
        # textAlign left) and throw, every frame for 1 s. Each next frame still starts the label layer at full opacity,
        # centred, so the names and the crosshair aren't drawn faded; as first built, 0.26.18 left them at 0.2.
        fa = JS4(r"""(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms)); const hits = drawHitNumbers, seen = [];
          drawHitNumbers = (lx) => { seen.push([lx.globalAlpha, lx.textAlign]); lx.globalAlpha = 0.2; lx.textAlign = 'left'; throw new Error('test: drawHitNumbers leaves a fade'); };
          try { await w(1000); return seen; } finally { drawHitNumbers = hits; } })()""")
        later = fa[1:]
        check('an error partway through the label layer: each next frame starts it at full opacity, centred',
              len(later) >= 10 and all(a == 1 and al == 'center' for a, al in later),
              f"{len(fa)} frames; the first after the error {later[:1]}; {sum(1 for a, al in later if a != 1 or al != 'center')} started faded or not centred")

        # A 3D build that throws partway (0.26.18; Sujan, 7 Nov 2026): buildMesh made to throw, and the map's 3D build
        # started from the frame loop (clear3d, so view3.map no longer names the map). Over 2 s, build3d runs once, not
        # every frame; nothing half-built stays, and the 3D view says the map couldn't be drawn. After resetForNewDemo, as
        # opening a demo does, the map is built once more, and the note goes.
        bf = JS4(r"""(async () => { const w = (ms) => new Promise((r) => setTimeout(r, ms));
          const bm = buildMesh, b3 = build3d; let meshes = 0, builds = 0;
          buildMesh = () => { meshes++; throw new Error('test: the 3D build throws partway'); };
          build3d = () => { builds++; return b3(); };
          try {
            clear3d(); await w(2000);
            const st = $('status3'), out = { builds, meshes, note: st.hidden ? null : st.innerText.trim(), left: R3.world.children.length,
              log: ERRLOG.filter((e) => e.includes('test: the 3D build throws partway')).length };
            buildMesh = bm; resetForNewDemo();
            for (let i = 0; i < 100 && view3.map !== MAP.name; i++) await w(100);
            return Object.assign(out, { again: builds, drawn: view3.map === MAP.name && R3.world.children.length > 0, noteGone: $('status3').hidden });
          } finally { buildMesh = bm; build3d = b3; } })()""")
        check('a 3D build that throws partway runs once in 2 s, not every frame, leaves nothing half-built and is listed once',
              bf['builds'] == 1 and bf['meshes'] == 1 and bf['left'] == 0 and bf['log'] == 1,
              f"build3d called {bf['builds']} times, the build reached {bf['meshes']} times, {bf['left']} meshes left, listed {bf['log']} times")
        check("a 3D build that throws partway: the 3D view says the map couldn't be drawn",
              bf['note'] == "de_train couldn't be drawn in 3D. The 2D view still works. Press ? and click Copy debug info to report it.", repr(bf['note']))
        check('a 3D build that failed: after resetForNewDemo (as opening a demo does), built once more and drawn, the note gone',
              bf['again'] == 2 and bf['drawn'] and bf['noteGone'], f"build3d called {bf['again']} times in all; drawn {bf['drawn']}; note gone {bf['noteGone']}")
    except Exception as e:
        check('a kill with no death spot, EG vs eXecutors, Train, EM4 finals', False, str(e).split('\n')[0])
    ctx4.close()

    # A half replayed from 0:0 and a half carried on across a crash (0.26.19; Sujan, 7 Nov 2026, docs/join-replay-carry-mock.png):
    # WeMadeFox vs Ravens, Nuke, EM4 finals, in 2 files. Part 1's 12 rounds to 6:6 were replayed from 0:0 after a player
    # rebooted, WeMadeFox won 4 on CT and the server crashed; part 2 carries the half on from 0:0 ("4-0 score stays"). The
    # Join card in the suggested order, with part 2 put first (checks A and B, the recording times), the joined map's score
    # and the Rounds tab; then the order the card suggests for Na`Vi vs SK, Inferno, ESWC 2011, whose three names all start
    # "2011-10-24_16h08". Up to 0.26.18 the joined map read Ravens 16-9, the wrong order passed with a green tick, and the
    # Na`Vi vs SK files came 1609, 1740, 1724. No map needed.
    W1, W2 = 'ravens.wmf.em4finals-1003030951-de_nuke.dem', 'ravens.wmf.em4finals-1003031026-de_nuke.dem'
    NS = ['2011-10-24_16h08_NaVi_SK-1110241609-de_inferno.dem', '2011-10-24_16h08_NaVi_SK-1110241740-de_inferno.dem', '2011-10-24_16h08_NaVi_SK-1110241724-de_inferno.dem']
    ctx5 = b.new_context(viewport={'width': 1512, 'height': 982}); pg5 = ctx5.new_page()
    pg5.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    errs5 = []; pg5.on('pageerror', lambda e: errs5.append(str(e).split('\n')[0]))
    try:
        for n in [W1, W2] + NS:
            if n not in names: raise Exception(f'{n} not found in HALF_LIFE_DIR or DEMO_DIRS')
        pg5.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(hooked)}')
        pg5.set_input_files('#fFolder', HL)
        pg5.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
        JS5 = lambda c: pg5.evaluate('(c) => __v(c)', c)
        pg5.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name === ${JSON.stringify(n)}))`)', W1)
        pg5.wait_for_function('__v("!!(D && M)")', timeout=120000)
        card = lambda: JS5(r"""(() => { const el = $('joinCard'); const t = (s) => [...el.querySelectorAll(s)].map((x) => x.innerText.replace(/\s+/g, ' ').trim());
          return { parts: t('.jparts li .jf small'), names: t('.jparts li .jname'), order: t('.jorder')[0] || '', checks: [...el.querySelectorAll('.sum-list li')].map((li) => ({ s: li.querySelector('.sum-ic').className.replace('sum-ic ', ''), t: li.innerText.replace(/\s+/g, ' ').trim().replace(/^[✓!i✕] /, '') })),
            wrong: t('.jwrong p')[0] || null, go: !$('jGo').disabled }; })()""")
        JS5(f"closeSummary(); openJoinCard([{W1!r}, {W2!r}].map((n) => files.demos.find((f) => f.name === n)))")
        pg5.wait_for_function('__v("!JOIN.reading && JOIN.F.size === 2 && !!$(\'jGo\')")', timeout=120000)
        c = card()
        check('Join card, WeMadeFox vs Ravens in the suggested order: part 1 first, Join them on, no "doesn\'t add up"',
              c['names'] == [W1, W2] and c['go'] and c['wrong'] is None, f"{c['names']}, Join them {'on' if c['go'] else 'off'}, {c['wrong']!r}")
        check("Join card: part 1's line, its 4 rounds and the 13 replayed before them (the approved words)",
              c['parts'][:1] == ['4 rounds count, ending at WeMadeFox 4 : 0 Ravens, no winner. 13 earlier rounds were replayed: restarted from 0:0 on the same sides.'], repr(c['parts'][:1]))
        check("Join card: part 2's line says where the map stands, not its own 0:0",
              c['parts'][1:] == ['Carries on at WeMadeFox 4 : 0 Ravens, 26 rounds, no winner.'], repr(c['parts'][1:]))
        check("Join card: Part 2 carries on part 1's half, with the half's numbers",
              {'s': 'info', 't': "Part 2 carries on part 1's half Same sides: part 1's 4 rounds count, and part 2's 11 complete the half of 15. 3 rounds at its start were replayed."} in c['checks'],
              '; '.join(f"[{x['s']}] {x['t']}" for x in c['checks']))
        check('Join card: the same 10 players by Steam ID (SIA, bail and BERRY were one person up to 0.26.18), the order from the recording times',
              {'s': 'ok', 't': 'Same 10 players, by Steam ID'} in c['checks'] and c['order'] == 'Order: from the recording times in the file names, 3 Mar 2010 at 09:51 and at 10:26. The rounds agree.', c['order'])
        JS5("JOIN.picking = true; renderJoinCard()")
        jp = JS5("(() => { const p = document.querySelector('#joinCard .jpick'); return { sel: p.querySelectorAll('#jSel option').length, none: !!p.querySelector('.jnone') }; })()")
        check('Join card with other demos in the folder: the list of them, no "no other demos" line', jp['sel'] > 2 and not jp['none'], str(jp))
        JS5("JOIN.picking = false; renderJoinCard()")
        JS5('joinMove(1, -1)')
        c = card()
        check("Join card, part 2 put first: check A says the order doesn't add up, and Join them is off",
              c['names'] == [W2, W1] and c['wrong'] == "Part 1's teams change sides after 11 rounds, so its first half began in an earlier recording." and not c['go'], f"{c['wrong']!r}, Join them {'on' if c['go'] else 'off'}")
        check('Join card, part 2 put first: the recording times named, and no green tick for the teams swapping sides',
              c['order'] == 'Order: Your order. The recording times in the file names, 3 Mar 2010 at 09:51 and at 10:26, put them the other way round.'
              and {'s': 'warn', 't': 'Teams swapped sides between the parts'} in c['checks'], f"{c['order']!r}; " + '; '.join(f"[{x['s']}] {x['t']}" for x in c['checks']))
        B = JS5("orderProblem([JOIN.F.get(JOIN.list[0].name), Object.assign({}, JOIN.F.get(JOIN.list[1].name))].map((f, i) => i ? f : Object.assign({}, f, { swapAt: null })))")
        check('check B on the same order (check A left out): other sides after 26 rounds, partway through a half',
              B == 'The map is 26 rounds in when part 1 ends, partway through a half, but the teams are on other sides in part 2.', repr(B))
        JS5('useSuggested()')
        JS5("$('jGo').click()")
        pg5.wait_for_function('__v("!!(D && D.parts && D.parts.length === 2 && M && M.liveR.length > 20)")', timeout=120000)
        j = JS5(r"""(() => { closeSummary(); const L = M.liveR, last = L[L.length - 1], st = statsFor('all');
          showAll = true; tab = 'rounds'; renderPane();
          const subs = [...$('pane').querySelectorAll('.row .sub')].map((x) => x.textContent.replace(/\s+/g, ' ').trim());
          const out = { score: `${M.tnames[0]} ${last.scoreAfter.join(':')} ${M.tnames[1]}`, live: L.length, ht: L[14].scoreAfter.join(':'),
            replayed: subs.filter((s) => s.startsWith('replayed from 0:0 · ')).length, first: subs.find((s) => s.startsWith('replayed')) || null,
            people: Object.keys(st).map((e) => M.pl[e].name).sort() };
          setCount30(true); const l2 = M.liveR[M.liveR.length - 1]; out.c30 = `${l2.scoreAfter.join(':')} in ${M.liveR.length}`; setCount30(false); showAll = false; renderPane();
          return out; })()""")
        check('joined: WeMadeFox 9:6 at half time, 16:13 after 29 rounds, 17:13 in 30 with Count them (Ravens 16-9 up to 0.26.18)',
              j['score'] == 'WeMadeFox 16:13 Ravens' and j['live'] == 29 and j['ht'] == '9:6' and j['c30'] == '17:13 in 30', f"{j['score']} in {j['live']}, {j['ht']} at half time, Count them {j['c30']}")
        check('joined: 10 players in the stats, BERRY and bail among them', len(j['people']) == 10 and any('BERRY' in p for p in j['people']) and any('bail' in p for p in j['people']), ', '.join(j['people']))
        check('Rounds tab with Show warmup, restarts and idle rounds: the 16 replayed rounds read "replayed from 0:0" before their result',
              j['replayed'] == 16 and j['first'] == 'replayed from 0:0 · elimination · 6 kills', f"{j['replayed']} rows; the first {j['first']!r}")
        # Na`Vi vs SK, Inferno, ESWC 2011: the order the Join card suggests, from the times later in the names
        JS5("closeJoinCard(); openJoinCard(%s.map((n) => files.demos.find((f) => f.name === n)))" % repr(NS))
        pg5.wait_for_function('__v("!JOIN.reading && JOIN.F.size >= 3 && !!$(\'jGo\')")', timeout=180000)
        c = card()
        check('Join card, Na`Vi vs SK, Inferno, ESWC 2011: suggests 1609, 1724, 1740 from the times later in the names (1609, 1740, 1724 up to 0.26.18)',
              [re.search(r'-(\d{10})-', n).group(1)[-4:] for n in c['names']] == ['1609', '1724', '1740']
              and c['order'] == 'Order: from the recording times in the file names, 24 Oct 2011 at 16:09, at 17:24 and at 17:40. The rounds agree.', f"{c['names']}; {c['order']!r}")
        check('no page error on the joined map and the Join cards', not errs5, '; '.join(errs5[:3]))
    except Exception as e:
        check('a half replayed and a half carried on, WeMadeFox vs Ravens, Nuke, EM4 finals', False, str(e).split('\n')[0])
    ctx5.close()

    # The match rules (0.26.21; Sujan, 8 Nov 2026), no map needed. compLexity vs WeMadeFox, Nuke, IEM4: the rounds before both
    # teams were first full read "teams not full yet" with Show warmup, restarts and idle rounds; SK vs Na`Vi, Dust2,
    # IEM4: the 6 rounds after SK reached 16 count by themselves (the teams played on to round 30), the Rounds tab and the
    # load summary say so, Stop at 16 holds after the demo is opened again, and Count them brings them back; Burning vs
    # FairFrag, Inferno, ESWC 2010: the team names from the admin's "1st Warmup - FAIRFRAG(CT) vs Burning!(T)".
    # Scores are in tests/expected/ (ground_truth_check.py).
    CW, SN, BF = 'auto-1003030847-de_nuke.dem', 'auto-1003031508-de_dust2.dem', '2010-07-01_15h58_-1007021005-de_inferno Burning vs FairFrag.dem'
    ctx6 = b.new_context(viewport={'width': 1512, 'height': 982}); pg6 = ctx6.new_page()
    pg6.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, '..', 'src', 'vendor', 'three.min.js')), content_type='application/javascript'))
    errs6 = []; pg6.on('pageerror', lambda e: errs6.append(str(e).split('\n')[0]))
    try:
        for n in [CW, SN, BF]:
            if n not in names: raise Exception(f'{n} not found in HALF_LIFE_DIR or DEMO_DIRS')
        pg6.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(hooked)}')
        pg6.set_input_files('#fFolder', HL)
        pg6.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
        JS6 = lambda c: pg6.evaluate('(c) => __v(c)', c)
        def open6(n):
            JS6(f"(() => {{ window.__prevD = D; loadDemoFile(files.demos.find((f) => f.name === {n!r})); }})()")
            pg6.wait_for_function('__v("!!(D && M && D !== window.__prevD && D.fileName === %s)")' % repr(n), timeout=120000)
            JS6('closeSummary()')
        open6(CW)
        r = JS6(r"""(() => { showAll = true; tab = 'rounds'; renderPane();
          const subs = [...$('pane').querySelectorAll('.row .sub')].map((x) => x.textContent.replace(/\s+/g, ' ').trim());
          const out = { notFull: M.rounds.filter((x) => x.notFull).length, first: subs.find((s) => s.startsWith('teams not full yet')) || null, live: M.liveR.length, score: M.liveR[M.liveR.length - 1].scoreAfter.join(':') };
          showAll = false; renderPane(); return out; })()""")
        check('compLexity vs WeMadeFox, IEM4: the 5 rounds before both teams were full say so in the Rounds tab, and the match is the 30 rounds after the knife round',
              r['notFull'] == 5 and r['first'] == 'teams not full yet · elimination · 1 kills' and r['live'] == 30 and r['score'] == '15:15', str(r))
        open6(SN)
        st = lambda: JS6(r"""(() => { tab = 'rounds'; renderPane(); const n = $('pane').querySelector('.note16'); return { live: M.liveR.length, score: M.liveR[M.liveR.length - 1].scoreAfter.join(':'), auto: !!M.auto30, count: !!M.count30, note: n ? n.innerText.replace(/\s+/g, ' ').trim() : null, saved: ls.get('count30:' + demoKey()) }; })()""")
        a = st()
        check('SK vs Na`Vi, IEM4: the 6 rounds after 16 count by themselves, and the Rounds tab says the teams played on to round 30',
              a['live'] == 30 and a['score'] == '12:18' and a['auto'] and a['saved'] is None and a['note'] == 'Counting the 6 rounds played after Team 2 reached 16: the teams played on to round 30. Stop at 16', str(a))
        JS6('setCount30(false)'); b1 = st()
        open6(BF); open6(SN); b2 = st()
        check('Stop at 16 stops at 16, is kept as false for the demo, and still holds when the demo is opened again',
              b1['live'] == 24 and b1['saved'] is False and b2['live'] == 24 and b2['score'] == '8:16' and not b2['auto'], f"{b1}; again: {b2}")
        JS6('setCount30(true)'); c = st()
        check('Count them brings the 6 rounds back, as chosen for this demo', c['live'] == 30 and c['saved'] is True and not c['auto'] and c['note'].startswith('Counting the 6 rounds played after Team 2 reached 16. '), str(c))
        JS6("ls.set('count30:' + demoKey(), null)")
        open6(BF)
        t = JS6('M.tnames.slice()')
        check('Burning vs FairFrag, ESWC 2010: the team names from the admin\'s text, FAIRFRAG on CT at the warmup (the tags read FAiRFRAG and BURNING)', t == ['FAIRFRAG', 'Burning'], str(t))
        check('no page error on the match rules checks', not errs6, '; '.join(errs6[:3]))
    except Exception as e:
        check('the match rules: rounds before both teams were full, rounds after 16, the admin\'s team names', False, str(e).split('\n')[0])
    ctx6.close()
    b.close()
print(f'{len(fails)} failed' if fails else 'all passed')
sys.exit(1 if fails else 0)
