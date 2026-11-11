"""Fails unless the POV mockup round's items work as approved (docs/pov-mockup-round-mock.jpg; Sujan, 11 Nov 2026).

On the GP Tourney POV of Team Guardians vs Lanka Dahan, Mirage, Match 8, 25 Oct 2026 (forgotten-de_mirage-2026.dem,
recorded by BAJRANG || forgotteN_), in POV mode, and on mTw vs mousesports, Inferno, IEM4 World Championship, part 1
(an HLTV demo):
- the reader keeps what his game was told: the Damage messages (28 HP at 742.87 from the shooter's middle,
  -1182.25 1611.125 133.625), the plant and defuse bars (BarTime2 at 1086.08: 3 s, 59%) and his Tab presses
  (+showscores and -showscores, 684 presses on de_mirage_32, one held from 344.43 to 347.16);
- from them: the hit arcs at R7 1:31 (rear and left, gone 0.4 s later), the bar at R11 0:28 (73%, picked up from
  BarTime2's 59%; none after he switched to rob!! at 0.28 or before he came back at 0:29), and the Tab scoreboard
  opening by itself with "He held Tab here" while he held Tab, and closing after;
- the options by demo type: in the POV demo no 2D, 3D and 3D + radar switch, opened in 3D though 2D was the saved
  choice, no Reset view, no Wallbangs tab (the server held enemies back), the ! on See through walls, the load
  summary's two lines, a notice at the top middle, no shortcuts line; the ! shows the anti-wallhack note at the top middle and
  closes it, and switching See through walls on doesn't show it; in the HLTV demo the switch, 2D (the saved choice),
  Reset view and the Wallbangs tab are back, the POV mode row and its heading in View settings are gone, no !;
- the Kills tab of the POV demo lists his kills and deaths for the whole match, by round, every row his, the round
  playing now highlighted; the HLTV demo's lists the round playing now;
- at the widest kill feed rows of the POV demo (R3, 4 rows), with "Stopping at 16" and the anti-wallhack note open,
  the notice and the note overlap neither the feed, the round pill, View settings nor each other, at 1512x982
  (Interface size Auto and 115%, the largest it allows there) and 1280x720;
- the shortcuts line doesn't move while the POV demo plays through R3's kills at 1280x720: in POV mode it's hidden
  (Sujan, 11 Nov 2026, on #60), and in the 3D view of a POV demo nothing shows it.

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 pov_mockup_round_check.py [page.html]
Needs both demos in the Half-Life folder or DEMO_DIRS (demo_dirs.py), and de_mirage_32 and de_inferno in the folder.
Exit code 0 = pass. Fails on 0.26.28.
"""
import functools, http.server, json, os, sys, threading, time
from playwright.sync_api import sync_playwright
import demo_dirs

here = os.path.dirname(os.path.abspath(__file__))
page = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'index.html'))
hl, inside, outside = demo_dirs.collect()
POVD = demo_dirs.find('forgotten-de_mirage-2026', inside, outside).lower()
HLTV = demo_dirs.find('mouz.mtw.em4finals-1003021349', inside, outside).lower()
HL = demo_dirs.stage(outside)
html = open(page, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
test_page = os.path.join(os.path.dirname(page), '_test_povround_' + os.path.basename(page))
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

READER = js(r'''(() => {
  const near = (a, n, t, eps) => { const o = []; for (let i = 0; i < a.length; i += n) if (Math.abs(a[i] - t) < eps) o.push(Array.from(a.slice(i, i + n)).map((x) => +x.toFixed(3))); return o; };
  let plus = 0; for (let i = 1; i < D.tabs.length; i += 2) plus += D.tabs[i];
  return { dmg: near(D.dmg, 6, 742.87, 0.02), bar2: near(D.bars, 3, 1086.08, 0.02), plus, tab: near(D.tabs, 2, 344.43, 0.02).concat(near(D.tabs, 2, 347.16, 0.02)) };
})()''')
DRAWN = js(r'''({ pain: [742.88, 743.3].map((t) => povPainAt(t).map((x) => +x.toFixed(2))), bar: [1085.5, 1086.5, 1086.8].map((t) => { const f = povBarAt(t); return f == null ? null : +f.toFixed(2); }) })''')
SB = js(r'''({ open: !$('sb').hidden, held: !!$('sb').querySelector('.sbheld') })''')
def offers_js():
    return js(r'''(() => {
  const vis = (el) => !!el && !el.hidden && !!el.offsetParent;
  const row = $('pov3').closest('.vrow'), head = row.previousElementSibling;
  const rr = $('radar').getBoundingClientRect(), top = (el) => el && el.getBoundingClientRect().top - rr.top;
  toast('Stopping at 16. Rounds tab: Count them to count the rounds played after.', 20000);
  return { view: viewMode, seg: !$('viewSeg').hidden, fit: !$('tgFit').hidden, wbTab: !document.querySelector('.tabs button[data-tab=wb]').hidden,
    povRow: !row.hidden, povHead: !head.hidden, mark: vis($('xrayMark')),
    hintTop: vis($('hint3')) ? top($('hint3')) : null, toastTop: top($('toast')), viewH: rr.height };
})()''')
NOTE = js(r'''(() => {
  const n0 = $('povNote'), was = !!n0 && !n0.hidden;
  $('xrayMark').click(); const n = $('povNote'), rr = $('radar').getBoundingClientRect();
  const open = !!n && !n.hidden, top = open ? n.getBoundingClientRect().top - rr.top : null, text = open ? n.textContent : '';
  $('xrayMark').click(); const closed = !n || n.hidden;
  const x0 = opts.xray; $('tgXray').click(); if (!opts.xray) $('tgXray').click(); const after = $('povNote'), byXray = !!after && !after.hidden; if (opts.xray !== x0) $('tgXray').click();
  return { was, open, top, viewH: rr.height, text: text.includes('anti-wallhack plugin') && text.includes('11,503'), closed, byXray };
})()''')
# the notices' column against the kill feed, the round pill and the camera row (View settings), and each other
OVERLAP = js(r'''(() => {
  const rr = $('radar').getBoundingClientRect();
  const R = (e) => { if (!e || e.hidden || !e.offsetParent) return null; const r = e.getBoundingClientRect(); return r.width ? { l: r.left - rr.left, t: r.top - rr.top, r: r.right - rr.left, b: r.bottom - rr.top } : null; };
  const hit = (a, b) => a && b && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
  const notes = { hint: R($('hint3')), toast: R($('toast')), note: R($('povNote')) }, others = { pill: R($('rclock')), cam: R($('cam3')) };
  [...$('feed').children].forEach((e, i) => { others['feed' + i] = R(e); });
  const over = []; for (const n in notes) for (const o in others) if (hit(notes[n], others[o])) over.push(n + '/' + o);
  for (const [a, b] of [['hint', 'toast'], ['toast', 'note'], ['hint', 'note']]) if (hit(notes[a], notes[b])) over.push(a + '/' + b);
  return { UI, rows: $('feed').children.length, shown: Object.keys(notes).filter((k) => notes[k]), over };
})()''')
HINT = js(r'''({ pos: (() => { const e = $('hint3'); if (!e || !e.offsetParent) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)]; })(), rows: $('feed').children.length, T: +T.toFixed(2) })''')
KILLS = js(r'''(() => {
  document.querySelector('.tabs button[data-tab=kills]').click();
  const rows = [...$('pane').querySelectorAll('.krow')], heads = [...$('pane').querySelectorAll('.sechead')];
  const rec = D.serverInfo.playerIndex + 1;
  const his = (k) => k && (k.killer === rec || k.victim === rec);
  let want = 0; for (const r of M.liveR) for (const k of r.kills) if (his(k)) want++;
  const cur = roundAt(T);
  return { rows: rows.length, allHis: rows.every((el) => his(D.kills[+el.dataset.ki])), want, rounds: heads.filter((h) => /^Round /.test(h.textContent)).length,
    curHead: (heads.find((h) => h.classList.contains('cur')) || {}).textContent || null, curRound: cur && cur.live ? 'Round ' + cur.ln : null, top: heads[0] ? heads[0].textContent : null };
})()''')

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
        # POV mode on, and 2D as the saved choice of view
        pg.evaluate("__v(\"$('pov3').checked = true; setView('2d')\")")
        pg.evaluate('__v("{ const g = onDemo; window.__opened = 0; onDemo = async () => { await g(); window.__opened++; }; } 0")')
        pg.set_input_files('#fFolder', HL)
        pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
        ev = lambda c: json.loads(pg.evaluate('(c) => __v(c)', c))

        def open_demo(name):
            pg.evaluate('__v("window.__before = window.__opened")')
            pg.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === ${JSON.stringify(n)}))`)', name)
            pg.wait_for_function(f'__v("{READY}")', timeout=240000)
            pg.evaluate('__v("playing = false; setPlayIcon(); SUM.closedFor = null; loadSummary(true)")')
            # the load summary, built afresh and read as soon as its lines are there (it closes by itself later)
            pg.wait_for_function('__v("!$(\'sumCard\').hidden && $(\'sumCard\').querySelectorAll(\'.sum-list li\').length > 0")', timeout=30000)
            return [l for l in json.loads(pg.evaluate('__v("JSON.stringify([...document.querySelectorAll(\'#sumCard .sum-list li\')].map((l) => l.textContent))")'))]

        def at(t):
            pg.evaluate(f'__v("playing = false; setPlayIcon(); seek({t})")')
            pg.wait_for_timeout(400)

        sum1 = open_demo(POVD)
        r = ev(READER)
        check(r.get('dmg') == [[742.874, 0, 28, -1182.25, 1611.125, 133.625]] and r.get('bar2') == [[1086.084, 3, 59]] and r.get('plus') == 684
              and [x[1] for x in r.get('tab', [])] == [1, 0], 'reader: Damage, BarTime2 and his Tab presses kept', r)
        d = ev(DRAWN)
        pain = d.get('pain') or [[], []]
        check(not d.get('err') and pain[0][0] == 0 and pain[0][1] == 0 and pain[0][2] > 0.8 and pain[0][3] > 0.45 and pain[1] == [0, 0, 0, 0]
              and d.get('bar') == [None, 0.73, None], 'hit arcs at R7 1:31 and the plant bar at R11 0:28', d)
        at(345.63)
        s1 = ev(SB)
        at(349.0)
        s2 = ev(SB)
        check(s1.get('open') and s1.get('held') and not s2.get('open'), 'Tab scoreboard while he held Tab, closed after', {'held': s1, 'after': s2})
        at(809.0)
        o = ev(offers_js())
        o['sumOnly'] = any('Only his own view, in 3D' in x for x in sum1)
        o['sumPlugin'] = any('This server seems to use an anti-wallhack plugin' in x for x in sum1)
        check(o.get('view') == '3d' and not o.get('seg') and not o.get('fit') and not o.get('wbTab') and o.get('povRow') and o.get('povHead') and o.get('mark')
              and o.get('sumOnly') and o.get('sumPlugin') and o.get('hintTop') is None and o.get('toastTop') is not None and o['toastTop'] < 100,
              'options by demo type: the POV demo', o)
        n = ev(NOTE)
        check(n.get('open') and n.get('text') and n.get('top') is not None and n['top'] < n['viewH'] / 3 and n.get('closed') and not n.get('byXray'),
              'the ! shows the anti-wallhack note at the top middle and closes it; See through walls alone does not', n)
        at(742.91)
        k = ev(KILLS)
        check(k.get('rows') == k.get('want') and k.get('rows', 0) > 20 and k.get('allHis') and k.get('rounds', 0) >= 10 and k.get('curHead', '') .startswith(k.get('curRound') or '?'),
              'Kills tab: his kills and deaths, the whole match by round, R7 highlighted', k)
        # the widest kill feed rows in this demo (R3, 4 rows from 498.33), with "Stopping at 16" and the note open,
        # at 1512x982 (Auto and the largest Interface size it allows, 115%) and 1280x720 (100%)
        ov = []
        for (w, hh, size) in [(1512, 982, 'auto'), (1512, 982, '200'), (1280, 720, 'auto')]:
            pg.set_viewport_size({'width': w, 'height': hh})
            pg.evaluate(f'''__v("localStorage.setItem('uiSize', JSON.stringify('{size}')); applyUiSize(); dispatchEvent(new Event('uisize')); 0")''')
            at(498.38)
            pg.evaluate('''__v("toast('Stopping at 16. Rounds tab: Count them to count the rounds played after.', 20000); showHiddenEnemiesNote(true); 0")''')
            pg.wait_for_timeout(300)
            ov.append(dict(ev(OVERLAP), size=f'{w}x{hh} {size}'))
            pg.evaluate('__v("showHiddenEnemiesNote(false); $(\'toast\').hidden = true; 0")')
        # the shortcuts line while the demo plays with kills coming in (R3, demo 8:14 to 8:21, at 1x, 1280x720): it must not
        # move. In POV mode it's hidden (Sujan, 11 Nov 2026, on #60): placed at the top middle, it stepped down past the kill
        # feed and back up as the rows came and went, several times a round at 1280x720
        pg.evaluate('__v("seek(494.5); playing = true; setPlayIcon(); 0")')
        hs = []
        for _ in range(70):
            hs.append(ev(HINT)); pg.wait_for_timeout(100)
        pg.evaluate('__v("playing = false; setPlayIcon(); 0")')
        poss = sorted({json.dumps(x.get('pos')) for x in hs}); rows = sorted({x.get('rows') for x in hs})
        played = round(hs[-1].get('T', 0) - hs[0].get('T', 0), 2)
        check(len(poss) == 1 and len(rows) >= 2 and played > 4, 'the shortcuts line stays put while kills come in (hidden in POV mode)',
              {'positions': poss[:6], 'feed rows seen': rows, 'played s': played})
        pg.set_viewport_size({'width': 1512, 'height': 982})
        pg.evaluate('''__v("localStorage.removeItem('uiSize'); applyUiSize(); dispatchEvent(new Event('uisize')); 0")''')
        check(all(not o.get('err') and o.get('rows', 0) >= 4 and o.get('shown') == ['toast', 'note'] and not o.get('over') for o in ov),
              'notices and the note clear of the kill feed, the round pill and View settings at the widest feed', ov)
        sum2 = open_demo(HLTV)
        o2 = ev(offers_js())
        o2['sumOnly'] = any('Only his own view' in x for x in sum2)
        o2['sumPlugin'] = any('This server seems to use an anti-wallhack plugin' in x for x in sum2)
        check(o2.get('view') == '2d' and o2.get('seg') and o2.get('fit') and o2.get('wbTab') and not o2.get('povRow') and not o2.get('povHead') and not o2.get('mark')
              and not o2.get('sumOnly') and not o2.get('sumPlugin') and o2.get('toastTop') is not None and o2['toastTop'] > o2['viewH'] / 2,
              'options by demo type: the HLTV demo', o2)
        pg.evaluate("__v(\"setView('3d', false)\")")
        k2 = ev(KILLS)
        check((k2.get('top') or '').startswith('Round ') and k2.get('rounds') == 1, 'Kills tab of the HLTV demo: the round playing now', k2)
        check(not errs, 'no page errors', errs[:3])
        b.close()
finally:
    srv.shutdown()
    os.remove(test_page)
for ok, name, got in checks:
    print(('ok   ' if ok else 'FAIL ') + name + '  ' + json.dumps(got))
passed = len(checks) == 11 and all(c[0] for c in checks)
print(f'{"PASS" if passed else "FAIL"} ({time.time() - t0:.0f} s)')
sys.exit(0 if passed else 1)
