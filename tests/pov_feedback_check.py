"""Fails unless Sujan's POV mode feedback of 11 Nov 2026 works as approved (docs/pov-scoreboard-radar-flashbang-mock.jpg,
with his answers of 11 Nov 2026 in STATE.md, Decisions; 0.26.30).

On the GP Tourney POV of Team Guardians vs Lanka Dahan, Mirage, Match 8, 25 Oct 2026 (forgotten-de_mirage-2026.dem,
recorded by BAJRANG || forgotteN_), and on SK vs Na`Vi, Train, DreamHack Winter 2011 (an HLTV demo):
- no POV mode setting: no checkbox, no POV mode line in the load summary, and the POV demo opens in POV mode by itself;
- the reader: latency from svc_pings, read 5, 12 and 7 bits per entry (in the POV demo the last value he got at R9 0:56,
  none before his first Tab hold; in the HLTV demo the values at demo 20:00), the white ScreenFades (70, the one at
  R10 1:34: 8.69 s, held 1.93 s, alpha 255) with the other 347 kept only as the moments a fade ended, and the Radar
  messages (7,150, the first one's values);
- the flashbang: 255 at R10 1:33, about 136 at 1:28, nothing at demo 3:15 where the server's clear ended a white fade;
  the dot and the whiteout off by default, shown only when ticked, with that opacity; their rows only in POV mode;
- his Crosshair row in POV mode (From config.cfg by default, Small, Medium, Large set the size), the viewer's in HLTV;
- the Tab scoreboard in the game's look in both demos: the server's name, latency, his row lit in the POV demo; the
  # column only in the HLTV demo with 10 players or fewer listed;
- the Kills tab of the POV demo: round headings set apart with his side; at a new round during playback that round's
  heading at the top of the list; the list where it was at a round with no kill or death of his and after a click on
  a kill in another round; no kill details;
- his HUD and radar on their own layer, added onto the picture (mix-blend-mode: plus-lighter), the radar top left with
  the round pill under it.

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 pov_feedback_check.py [page.html]
Also opens Match 2 T (public server, de_mirage_32, 27 Mar 2025) for a round with no kill or death of his (R11), which
the GP Tourney POV doesn't have. Needs the three demos in the Half-Life folder or DEMO_DIRS (demo_dirs.py), and
de_mirage_32 and de_train in the folder.
Exit code 0 = pass. Fails on 0.26.29.
"""
import functools, http.server, json, os, sys, threading, time
from playwright.sync_api import sync_playwright
import demo_dirs

here = os.path.dirname(os.path.abspath(__file__))
page = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'index.html'))
hl, inside, outside = demo_dirs.collect()
POVD = demo_dirs.find('forgotten-de_mirage-2026', inside, outside).lower()
HLTV = demo_dirs.find('sk-vs-navi-dhwinter2011-1111261019', inside, outside).lower()
MATCH2 = demo_dirs.find('match-2_de_mirage_32[ts]', inside, outside).lower()
HL = demo_dirs.stage(outside)
html = open(page, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
test_page = os.path.join(os.path.dirname(page), '_test_povfb_' + os.path.basename(page))
open(test_page, 'w', encoding='utf-8').write(html)
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.dirname(test_page))
h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/{os.path.basename(test_page)}'
READY = '!!(D && M && MAP && R3 && view3.map === MAP.name && window.__opened > window.__before)'

# each probe returns a value, or {err: message} when it throws (as it does on a build without the feature)
def js(body):
    return '(() => { try { return JSON.stringify(' + body + '); } catch (e) { return JSON.stringify({ err: String(e.message || e) }); } })()'

READER_POV = js(r'''({ pov: D.povOn, noSetting: !$('pov3'),
  pings: [1, 2, 3, 4].map((e) => pingAt(e, 885.94)), before: pingAt(1, 5.0),
  fades: D.fades.length / 5, stops: D.fadeStops.length, f942: (() => { const F = D.fades; for (let i = 0; i < F.length; i += 5) if (Math.abs(F[i] - 942.48) < 0.05) return [+F[i + 1].toFixed(2), +F[i + 2].toFixed(2), F[i + 3]]; return null; })(),
  radar: D.radarPos.length / 5, r0: Array.from(D.radarPos.slice(0, 5)).map((x) => +x.toFixed(2)),
  flash: [943.48, 948.48, 195].map((t) => Math.round(povFlashAt(t))) })''')
READER_HLTV = js(r'''({ pov: !!D.povOn, pings: [1, 2, 3, 4].map((e) => pingAt(e, 1200)), n: D.pings.length / 3 })''')
ROWS = js(r'''(() => { const sh = (id) => !!$(id) && !$(id).closest('.vrow').hidden; return { xh: sh('xh3'), xhp: sh('xhp3'), dot: sh('fbDot3'), white: sh('fbWhite3'), glow: sh('glow3'), dn: sh('dn3'),
  xhpVal: $('xhp3') ? $('xhp3').value : null, opts: $('xhp3') ? [...$('xhp3').options].map((o) => o.value) : null, dotOn: $('fbDot3') ? $('fbDot3').checked : null, whiteOn: $('fbWhite3') ? $('fbWhite3').checked : null }; })()''')
XHAIR = js(r'''(() => { const o = {}; for (const v of ['large', 'small', 'medium', 'cfg']) { $('xhp3').value = v; o[v] = povXhBase(); } o.cfgBase = XCFG.base; return o; })()''')
SUMMARY = js(r'''({ lines: [...document.querySelectorAll('#sumCard .sum-list li')].map((l) => l.textContent) })''')
FLASH = js(r'''({ white: !$('flash3').hidden, wo: +getComputedStyle($('flash3')).opacity, dot: !$('fbdot').hidden, dO: +getComputedStyle($('fbdot')).opacity })''')
SB = js(r'''(() => { const g = $('sb').querySelector('.gsb'); if (!g) return { gsb: false };
  const rows = [...g.querySelectorAll('.gr:not(.title):not(.th)')], lat = rows.map((r) => r.lastElementChild.textContent).filter((x) => /^\d+$/.test(x)).length;
  return { gsb: true, open: !$('sb').hidden, title: g.querySelector('.gr.title').textContent, rows: rows.length, lat, kn: g.querySelectorAll('.gr:not(.title):not(.th) .kn').length, me: g.querySelectorAll('.gr.me').length,
    words: [...new Set(rows.map((r) => r.children[1].textContent).filter(Boolean))], spec: !!g.querySelector('.spech') }; })()''')
KILLS = js(r'''(() => { const heads = [...$('pane').querySelectorAll('.sechead.rhead')]; return { heads: heads.length, chips: $('pane').querySelectorAll('.sechead.rhead .sdchip').length }; })()''')
TOP = js(r'''(() => { const P = $('pane'), cur = P.querySelector('.sechead.rhead.cur'); return { round: roundAt(T) && roundAt(T).ln, scroll: Math.round(P.scrollTop), cur: cur ? cur.firstElementChild.textContent : null,
  off: cur ? Math.round(cur.getBoundingClientRect().top - P.getBoundingClientRect().top) : null }; })()''')
LAYER = js(r'''(() => { const c = $('hud3'), x = c.getContext('2d'), d = (a, b, w, h) => { const p = x.getImageData(a, b, w, h).data; let n = 0; for (let i = 0; i < p.length; i += 4) if (p[i] + p[i + 1] + p[i + 2] > 0) n++; return n; };
  const dpr = c.width / c.getBoundingClientRect().width, rr = $('radar').getBoundingClientRect(), rc = $('rclock').getBoundingClientRect();
  return { blend: getComputedStyle(c).mixBlendMode, radarPx: d(0, 0, Math.round(100 * dpr), Math.round(100 * dpr)), hudPx: d(0, c.height - Math.round(140 * dpr), Math.round(300 * dpr), Math.round(140 * dpr)),
    room: parseFloat($('radar').style.getPropertyValue('--pov-radar')) || 0, pillTop: Math.round(rc.top - rr.top) }; })()''')

checks, t0 = [], time.time()
def check(ok, name, got):
    checks.append((bool(ok), name, got))
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = b.new_page(viewport={'width': 1512, 'height': 982})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(url)
        pg.evaluate('__v("{ const g = onDemo; window.__opened = 0; onDemo = async () => { await g(); window.__opened++; }; } 0")')
        pg.set_input_files('#fFolder', HL)
        pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
        ev = lambda c: json.loads(pg.evaluate('(c) => __v(c)', c))

        def open_demo(name):
            pg.evaluate('__v("window.__before = window.__opened")')
            pg.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === ${JSON.stringify(n)}))`)', name)
            pg.wait_for_function(f'__v("{READY}")', timeout=240000)
            pg.evaluate('__v("playing = false; setPlayIcon(); SUM.closedFor = null; loadSummary(true)")')
            pg.wait_for_function('__v("!$(\'sumCard\').hidden && $(\'sumCard\').querySelectorAll(\'.sum-list li\').length > 0")', timeout=30000)
            s = ev(SUMMARY)
            pg.evaluate('__v("closeSummary(); 0")')
            return s

        def at(t, wait=500):
            pg.evaluate(f'__v("playing = false; setPlayIcon(); seek({t}); 0")')
            pg.wait_for_timeout(wait)

        def play_from(t, secs):
            pg.evaluate(f'__v("seek({t}); speed = 1; playing = true; setPlayIcon(); 0")')
            pg.wait_for_timeout(int(secs * 1000))
            pg.evaluate('__v("playing = false; setPlayIcon(); 0")')

        # ---- the POV demo ----
        s1 = open_demo(POVD)
        r = ev(READER_POV)
        check(r.get('pov') is True and r.get('noSetting') is True and not any('POV mode' in x for x in s1.get('lines', [])), 'no POV mode setting: the POV demo opens in POV mode, no setting, no POV mode line in the load summary', {'pov': r.get('pov'), 'noSetting': r.get('noSetting'), 'summary': [x[:60] for x in s1.get('lines', [])]})
        check(r.get('pings') == [7, 24, 2, 15] and r.get('before') is None, 'latency from svc_pings: his last Tab hold at R9 0:56, none before his first', {k: r.get(k) for k in ('pings', 'before', 'err')})
        check(r.get('fades') == 70 and r.get('stops') == 347 and r.get('f942') == [8.69, 1.93, 255], 'white ScreenFades read (70, R10 1:34: 8.69 s, held 1.93 s, alpha 255), the other 347 only as ends', {k: r.get(k) for k in ('fades', 'stops', 'f942', 'err')})
        check(r.get('radar') == 7150 and r.get('r0') == [0.19, 1, -1279.75, 485.75, 20], 'Radar messages read (7,150; the first one)', {k: r.get(k) for k in ('radar', 'r0', 'err')})
        check(r.get('flash') == [255, 136, 0], 'the flashbang: 255 at R10 1:33, about 136 at 1:28, none after the server cleared it', r.get('flash') or r)
        rows = ev(ROWS)
        check(rows.get('xhp') and not rows.get('xh') and rows.get('opts') == ['cfg', 'small', 'medium', 'large'] and rows.get('xhpVal') == 'cfg' and rows.get('dot') and rows.get('white')
              and rows.get('dotOn') is False and rows.get('whiteOn') is False and not rows.get('glow') and not rows.get('dn'),
              "View settings in POV mode: his Crosshair row (From config.cfg by default), the flashbang rows off", rows)
        xh = ev(XHAIR)
        check(xh.get('large') == 640 and xh.get('small') == 1024 and xh.get('medium') == 800 and xh.get('cfg') == xh.get('cfgBase'), 'the Crosshair row sets his crosshair size; From config.cfg keeps the file\'s', xh)
        # the flashbang dot and whiteout, off, then on
        at(943.48)
        f0 = ev(FLASH)
        pg.evaluate("__v(\"if ($('fbWhite3')) { $('fbWhite3').checked = true; $('fbDot3').checked = true; } 0\")")
        at(943.48); f1 = ev(FLASH)
        at(948.48); f2 = ev(FLASH)
        at(1000.0); f3 = ev(FLASH)
        pg.evaluate("__v(\"if ($('fbWhite3')) { $('fbWhite3').checked = false; $('fbDot3').checked = false; } 0\")")
        check(not f0.get('white') and not f0.get('dot') and f1.get('white') and f1.get('dot') and abs(f1.get('wo', 0) - 1) < 0.01 and abs(f2.get('wo', 0) - 0.532) < 0.01
              and abs(f2.get('dO', 0) - 0.532) < 0.01 and not f3.get('white') and not f3.get('dot'),
              'the dot and the whiteout: none while off; on, full at R10 1:33, 0.53 at 1:28, gone after', {'off': f0, '1:33': f1, '1:28': f2, 'later': f3})
        # his radar and HUD on the added layer, the round pill under the radar (R11 1:26, alive on T)
        at(1028.2, 900)
        ly = ev(LAYER)
        check(ly.get('blend') == 'plus-lighter' and ly.get('radarPx', 0) > 1000 and ly.get('hudPx', 0) > 200 and ly.get('room', 0) > 100 and ly.get('pillTop', 0) > ly.get('room', 0),
              'his HUD and radar added onto the picture, the round pill under the radar', ly)
        # the Tab scoreboard while he held Tab, R9 0:56
        at(885.94, 700)
        sb = ev(SB)
        check(sb.get('gsb') and sb.get('open') and sb.get('title', '').startswith('~G|P~| Tourney Server') and sb.get('lat', 0) >= 20 and sb.get('kn') == 0 and sb.get('me') == 1
              and 'Dead' in sb.get('words', []) and 'Bomb' in sb.get('words', []) and sb.get('spec'),
              "Tab scoreboard in the game's look: server name, latency, Dead and Bomb, his row lit, no # column in POV mode", sb)
        # the Kills tab: headings, scroll at a new round, at a round with none of his, after a click; no kill details
        pg.evaluate("__v(\"document.querySelector('.tabs button[data-tab=kills]').click(); 0\")")
        k = ev(KILLS)
        check(k.get('heads', 0) >= 15 and k.get('chips') == k.get('heads'), 'Kills tab: every round heading set apart, with his side', k)
        play_from(784.6, 2.6)  # R7 into R8 (R8 starts at demo 13:06.27)
        t1 = ev(TOP)
        check(t1.get('round') == 8 and (t1.get('cur') or '').startswith('Round 8') and t1.get('off') is not None and abs(t1['off']) <= 2,
              "a new round during playback brings its heading to the top of the list", t1)
        at(800.0)
        pg.evaluate('__v("$(\'pane\').scrollTop = 500; 0")')
        clk = ev(js(r'''(() => { const P = $('pane'), before = Math.round(P.scrollTop), r0 = roundAt(T).ln; const el = [...P.querySelectorAll('.krow')].find((e) => { const k = D.kills[+e.dataset.ki]; const rr = k && roundAt(k.t); return rr && rr.ln !== r0 && e.getBoundingClientRect().top > P.getBoundingClientRect().top && e.getBoundingClientRect().bottom < P.getBoundingClientRect().bottom; });
          if (!el) return { none: true }; el.click(); return { before, after: Math.round(P.scrollTop), r0, r1: roundAt(T).ln, kdet: !!P.querySelector('.kdet') }; })()'''))
        pg.wait_for_timeout(300)
        clk['later'] = ev(js(r'''Math.round($('pane').scrollTop)'''))
        check(not clk.get('none') and clk.get('r1') != clk.get('r0') and clk.get('after') == clk.get('before') and abs(clk.get('later', -9) - clk.get('before', -1)) <= 1 and not clk.get('kdet'),
              'a click on a kill in another round leaves the list where it is, with no kill details', clk)
        # ---- a round with no kill or death of his: Match 2 T (public server, de_mirage_32, 27 Mar 2025), R11, since in the
        # GP Tourney POV he has one in every round ----
        open_demo(MATCH2)
        pg.evaluate("__v(\"document.querySelector('.tabs button[data-tab=kills]').click(); 0\")")
        nores = ev(js(r'''(() => { const his = new Set(); for (const r of M.liveR) if (r.kills.some(povHis)) his.add(r.n); const i = M.liveR.findIndex((x, k) => k > 1 && !his.has(x.n) && his.has(M.liveR[k - 1].n)); return i > 0 ? [M.liveR[i].ln, M.liveR[i].start] : null; })()'''))
        t2a = t2 = None
        if nores and isinstance(nores, list):
            at(nores[1] - 3)
            pg.evaluate('__v("$(\'pane\').scrollTop = 120; 0")')
            t2a = ev(TOP)
            play_from(nores[1] - 1.2, 2.2)
            t2 = ev(TOP)
        check(t2 is not None and t2.get('round') == nores[0] and t2a.get('scroll', 0) > 0 and abs(t2.get('scroll', -1) - t2a.get('scroll', -2)) <= 1,
              'a round with no kill or death of his leaves the list where it is (Match 2 T, R11)', {'round': nores, 'before': t2a, 'after': t2})
        # ---- the HLTV demo ----
        s2 = open_demo(HLTV)
        r2 = ev(READER_HLTV)
        check(r2.get('pov') is False and r2.get('pings') == [26, 30, 4, 4] and r2.get('n', 0) > 100, 'latency in the HLTV demo from svc_pings (demo 20:00)', r2)
        rows2 = ev(ROWS)
        check(rows2.get('xh') and not rows2.get('xhp') and not rows2.get('dot') and not rows2.get('white'), "View settings in an HLTV demo: the viewer's Crosshair row, no POV rows", rows2)
        at(1200.0)
        pg.evaluate('__v("showScoreboard(true); 0")')
        pg.wait_for_timeout(300)
        sb2 = ev(SB)
        num = ev(js(r'''[sbNumCol(10), sbNumCol(11)]'''))
        pg.evaluate('__v("showScoreboard(false); 0")')
        check(sb2.get('gsb') and sb2.get('title', '') and sb2.get('lat', 0) >= 8 and sb2.get('kn') == 10 and sb2.get('me') == 0 and num == [True, False],
              "Tab scoreboard in the HLTV demo: the game's look, latency, the # column with 10 listed, none with 11", {'sb': sb2, 'num 10, 11': num})
        check(not errs, 'no page errors', errs[:3])
        b.close()
finally:
    srv.shutdown()
    os.remove(test_page)
for ok, name, got in checks:
    print(('ok   ' if ok else 'FAIL ') + name + '  ' + json.dumps(got)[:900])
passed = len(checks) == 18 and all(c[0] for c in checks)
print(f'{"PASS" if passed else "FAIL"} ({time.time() - t0:.0f} s)')
sys.exit(0 if passed else 1)
