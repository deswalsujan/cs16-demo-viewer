"""Chat and radio lines in the game's look (0.28.1): the players' chat and the radio's words at the bottom left of the 3D
view, on the HUD layer of 0.28.0 (tests/logs/kill-feed-spectating-2026-11-27.md, "The build plan", PR 3; tests/logs/0.28.1.md).

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 chat_check.py [page.html] [shots dir]
Needs SK vs Na`Vi, Train, DreamHack Winter 2011 (sk-vs-navi-dhwinter2011-1111261019-de_train) and the GP Tourney POV
(Team Guardians vs Lanka Dahan, Mirage, 25 Oct 2026; forgotten-de_mirage-2026) and Sujan's own POV on Korfez
(s-deswal-korfez-knd), with de_train, de_mirage_32, de_korfez32 and the
player's cstrike/resource/cstrike_english.txt. Exit code 0 = pass. Fails on 0.28.0 (no chat or radio lines).

1. The reader: SK vs Na`Vi has no radio words (an HLTV demo has the radio's sounds only) and 43 dead players' all-chat
   lines, each with the sender's name and team; the GP Tourney POV has 599 radio lines, each "#Game_radio" with a name
   and a phrase the player's file has.
2. SK vs Na`Vi at the moment Na`Vi Zeus /A/ writes "ok go 3 rs np" (R51), 800x600 (1 unit a pixel), Player's eyes,
   Vanilla, Theatre mode: 5 lines, the top one's capitals at 437 (his 800x600 shot's line) and the next 16 apart, each
   line's ink from the origin 22 units in (the shot's "<" at 24); "*DEAD*" in the chat's yellow, the SK names in the CT
   blue, Zeus in the T red. The top line leaves 5 s of game time after it became the top line, the rest moving up.
3. The GP Tourney POV: while he plays, a radio line and team chat, the top line's capitals at 430; the radio line yellow
   from end to end, the chat's name in its team's colour; a line arriving while 5 are up pushes the top one out; while
   he's dead the lines from 437; at full flashbang white (the whiteout ticked) the lines drawn over the white.
4. Never drawn: the server's and plugins' lines ("<e-s.se | DH MSI BEAT IT>", "[GP WAR]", "Your money", the name change).
5. A line wider than the screen less 40 wraps at its last space, the rest starting with a space, at 800 units wide.
6. The 2D view draws none (the game's look is the 3D view's, Sujan, 28 Nov 2026).
7. The bottom-left strip while the bars are up (Sujan, 28 Nov 2026): inside the bottom bar, never over the followed
   player's centred name: SK vs Na`Vi in a view of 800x600 (an 800-wide window), the whole strip above the name and
   below the chat's 5th line; the GP Tourney POV watching BAJRANG || Yedzavni Shizuka in a 1000x700 window (the whole
   strip above the name) and a 900x560 one (icons only, beside it); back in full in 2D.
8. Sujan's Korfez POV (s-deswal-korfez-knd): a living player's all-chat line, the name in the team colour and the rest
   yellow (Valve's HLSDK; Sujan, 28 Nov 2026); no page errors.
"""
import functools, http.server, json, os, shutil, sys, threading
from playwright.sync_api import sync_playwright
import demo_dirs

here = os.path.dirname(os.path.abspath(__file__))
page = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'index.html'))
shots = sys.argv[2] if len(sys.argv) > 2 else None
hl, inside, outside = demo_dirs.collect()
SK = demo_dirs.find('sk-vs-navi-dhwinter2011-1111261019-de_train', inside, outside).lower()
POVD = demo_dirs.find('forgotten-de_mirage-2026', inside, outside).lower()
KOR = demo_dirs.find('s-deswal-korfez-knd', inside, outside).lower()
HL = demo_dirs.stage(outside)
html = open(page, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
root = os.path.join(os.path.dirname(page), '_chat_check')
os.makedirs(root, exist_ok=True)
open(os.path.join(root, 'page.html'), 'w', encoding='utf-8').write(html)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=root))
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/page.html'
THREE = os.path.join(here, '..', 'src', 'vendor', 'three.min.js')
results = []
def check(name, ok, detail=''):
    results.append(bool(ok))
    print(('PASS ' if ok else 'FAIL ') + name + (('  ' + json.dumps(detail, ensure_ascii=False)) if detail != '' else ''))

HELPERS = r"""
window.__frames = async () => { await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); await new Promise((r) => setTimeout(r, 1200)); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); };
window.__px = (id) => { const c = $(id); return { w: c.width, h: c.height, d: c.getContext('2d').getImageData(0, 0, c.width, c.height).data }; };
// a pixel's kind by its hue, at half coverage or more (the layer's own colour, not premultiplied)
window.__kind = (P, x, y) => { const o = (y * P.w + x) * 4, r = P.d[o], g = P.d[o + 1], b = P.d[o + 2];
  if (P.d[o + 3] < 128) return null;
  if (r > 200 && g > 110 && g < 210 && b < 90 && r - b > 150) return 'yel';
  if (r > g + 60 && r > b + 60 && g < 140) return 'red';
  if (b > r + 40 && g > r + 20) return 'blue';
  return null; };
// per line drawn (HUDCH.lines: its text and capitals' row; the band from 4 above to 12 below): the first ink row of its
// first capital letter (an * or a bracket reaches above the capitals), found from the advances before it, the first ink
// column, and counts of each kind
window.__bands = () => { const S = __px('spec3'); return HUDCH.lines.map((l) => {
  const cap = l.cap, out = { top: null, left: null, yel: 0, red: 0, blue: 0 };
  for (let y = cap - 4; y < cap + 12; y++) for (let x = 0; x < Math.min(S.w, 700); x++) { const k = __kind(S, x, y); if (!k) continue;
    out[k]++; if (out.left == null || x < out.left) out.left = x; }
  const i = [...l.text].findIndex((ch) => /[A-Z]/.test(ch));
  if (i >= 0) { const pre = [...l.text].slice(0, i).join(''), x0 = Math.round(HUD_CHAT_X + (pre ? hudAdvance(pre, HUD_EF) : 0)), x1 = x0 + Math.floor(hudAdvance(l.text[i], HUD_EF)) - 1;
    for (let y = cap - 4; y < cap + 12 && out.top == null; y++) for (let x = x0; x < x1; x++) if (__kind(S, x, y)) { out.top = y; break; } }
  return out; }); };
// the strip and the bottom name (view CSS pixels): the name's ink 560 to 573 units, its width from hud.js
window.__strip = () => { const g = $('radar').getBoundingClientRect(), l = $('legend').getBoundingClientRect(), H = g.height, W = g.width, k = H / 600;
  const nw = HUDB.nameW * k, name = HUDB.nameW ? [W / 2 - nw / 2, 560 * k, W / 2 + nw / 2, 573 * k] : null;
  const strip = [l.left - g.left, l.top - g.top, l.right - g.left, l.bottom - g.top];
  const over = name ? !(strip[2] <= name[0] || strip[0] >= name[2] || strip[3] <= name[1] || strip[1] >= name[3]) : null;
  const last = HUDCH.lines.length ? (HUDCH.lines[HUDCH.lines.length - 1].cap + 10) * k : 0;
  return { view: [W, H], barTop: H - Math.round(H * 80 / 600), strip: strip.map(Math.round), name: name && name.map(Math.round), over, icons: $('legend').classList.contains('icons'), lastLineBottom: Math.round(last), bars: $('radar').classList.contains('bars') }; };
"""

def ev(pg, js):
    return pg.evaluate('(c) => __v(c)', js)

def open_demo(pg, name, pov=False):
    ev(pg, 'window.__oldD = D; 0')
    pg.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === ${JSON.stringify(n)}))`)', name)
    pg.wait_for_function('__v("!!(D && D !== window.__oldD && M && MAP && R3 && view3.map === MAP.name' + (' && POV.on' if pov else '') + ')")', timeout=300000)
    ev(pg, 'closeSummary()')

def shot(pg, name):
    if shots:
        os.makedirs(shots, exist_ok=True)
        pg.screenshot(path=os.path.join(shots, name))

# the lines a state shows, as text
LINES = "(st) => st ? st.lines.map((l) => l.toks.map((k) => k.ch || '').join('')) : []"

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    errs = []
    pg = b.new_page(viewport={'width': 800, 'height': 600}, device_scale_factor=1)
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
    pg.goto(url)
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
    open_demo(pg, SK)
    ev(pg, HELPERS + '0')
    has = ev(pg, "typeof drawGameChat === 'function' && typeof hudChatStates === 'function' && Array.isArray(D.radioText)")
    check('the build has chat and radio lines (hud.js, drawGameChat; the reader\'s radioText)', has)
    if not has:
        b.close(); srv.shutdown(); shutil.rmtree(root, ignore_errors=True)
        print(f'{results.count(False)} FAILED'); sys.exit(1)
    pg.wait_for_function('__v("!!LANG.fmt")', timeout=30000)
    ev(pg, f'window.__lines = {LINES}; 0')

    # 1. the reader on SK vs Na`Vi
    R = ev(pg, r"""(() => { const dead = D.chat.filter((c) => c.fmt === '#Cstrike_Chat_AllDead');
      return { radioText: D.radioText.length, dead: dead.length, named: dead.filter((c) => c.name && (c.team === 'CT' || c.team === 'TERRORIST')).length }; })()""")
    check('reader, SK vs Na`Vi: no radio words, 43 dead all-chat lines, each with its name and team', R['radioText'] == 0 and R['dead'] == 43 and R['named'] == 43, R)

    # 2. SK vs Na`Vi, 800x600, at "ok go 3 rs np"
    A = ev(pg, r"""(async () => { setView('3d'); setTheatre(true); setVanilla(true);
      const c = D.chat.find((c) => /ok go 3 rs/.test(c.text)), t = c.t + 0.4;
      const alive = Object.keys(D.slots).map(Number).find((e) => { const s = playerState(e, t); return s && s.state > 0; });
      selected = alive; playing = false; setCam('eyes', true); T = t; await __frames();
      return { t, k: $('spec3').height / 600, lines: HUDCH.lines, bands: __bands(), star: hudMask('*', HUD_EF).inkL }; })()""")
    shot(pg, 'chat-sk-800x600.png')
    L = A['lines']
    print('SK at', A['t'], json.dumps([l['text'] for l in L], ensure_ascii=False))
    check('800x600: the view 600 lines (1 unit a pixel)', A['k'] == 1, A['k'])
    check('SK vs Na`Vi: 5 lines, the newest Zeus\'s', len(L) == 5 and L[0]['text'] == '*DEAD* SK.GeT_RiGhT -A- :  no one restart, 3rs' and L[4]['text'] == '*DEAD* Na`Vi Zeus /A/ :  ok go 3 rs np', [l['text'] for l in L])
    bands = A['bands']
    check('the lines\' capitals at 437, 453, 469, 485, 501 (his shot\'s 437, 16 apart), in the pixels', [x['top'] for x in bands] == [437, 453, 469, 485, 501], [x['top'] for x in bands])
    check('each line\'s ink from the origin 22 ("*" starts its ink %d after it)' % A['star'], all(x['left'] == 22 + A['star'] for x in bands), [x['left'] for x in bands])
    check('"*DEAD*" yellow, the SK names CT blue, Zeus T red', all(x['yel'] > 60 for x in bands) and all(x['blue'] > 15 and x['red'] == 0 for x in bands[:4]) and bands[4]['red'] > 15 and bands[4]['blue'] == 0,
          [{k: x[k] for k in ('yel', 'red', 'blue')} for x in bands])
    # the top line leaves 5 s of game time after it became the top line
    S5 = ev(pg, r"""(() => { const t0 = T, top = (t) => (__lines(hudChatAt(800, t))[0] || '');
      const cur = top(t0); let a = t0; while (a > t0 - 30 && top(a - 0.01) === cur) a -= 0.01;
      let z = t0; while (z < t0 + 30 && top(z + 0.01) === cur) z += 0.01;
      const after = __lines(hudChatAt(800, z + 0.02)), before = __lines(hudChatAt(800, z - 0.02));
      return { became: a, left: z, span: gameSpan(a, z), before: before.length, after: after.length, movedUp: after[0] === before[1] }; })()""")
    check('the top line leaves 5 s of game time after it became the top line, the rest moving up', abs(S5['span'] - 5) < 0.03 and S5['after'] == S5['before'] - 1 and S5['movedUp'], S5)
    # never drawn: the server's lines and the name change
    N = ev(pg, r"""(() => { const bad = []; for (const st of hudChatStates(800)) for (const l of __lines(st)) if (/e-s\.se|HLTV\.org|changed name to|Match is about/.test(l)) bad.push(l);
      return { states: hudChatStates(800).length, bad: bad.slice(0, 3), server: D.chat.filter((c) => !c.id).length }; })()""")
    check('SK vs Na`Vi: none of the server\'s %d lines or the name change drawn' % N['server'], not N['bad'] and N['server'] > 0, N)
    W1 = ev(pg, r"""(() => { const out = { wrapped: 0, over: 0, badStart: 0 };
      for (const st of hudChatStates(800)) st.lines.forEach((l) => { const s = l.toks.map((k) => k.ch || '').join(''); if (l.cont) { out.wrapped++; if (s[0] !== ' ') out.badStart++; }
        if (22 + [...s].reduce((w, ch) => w + hudCharW(ch), 0) > 760 + hudCharW(' ')) out.over++; });
      return out; })()""")
    # 2D: none drawn
    D2 = ev(pg, r"""(async () => { setView('2d'); await __frames(); const r = getComputedStyle($('spec3')).display; setView('3d'); await __frames(); return r; })()""")
    check('the 2D view draws no chat (the HUD layer hidden there)', D2 == 'none', D2)
    # 7. the strip, SK vs Na`Vi: an 800-wide window gives the 4:3 view 800x600 with the page's controls
    pg.set_viewport_size({'width': 800, 'height': 820})
    G1 = ev(pg, r"""(async () => { setTheatre(false); await __frames(); T = T + 0; await __frames(); return __strip(); })()""")
    shot(pg, 'chat-sk-strip-800x600.png')
    ok = G1['bars'] and G1['view'] == [800, 600] and not G1['icons'] and G1['over'] is False and G1['strip'][1] >= G1['barTop'] and G1['strip'][3] <= G1['name'][1] and G1['strip'][1] > G1['lastLineBottom']
    check('the strip, 800x600: whole, inside the bottom bar, above the name and below the chat\'s 5th line', ok, G1)
    G2 = ev(pg, r"""(async () => { setView('2d'); await __frames(); const r = { icons: $('legend').classList.contains('icons'), bars: $('radar').classList.contains('bars') }; setView('3d'); await __frames(); return r; })()""")
    check('the strip back in full in 2D, no bars', not G2['icons'] and not G2['bars'], G2)
    pg.set_viewport_size({'width': 800, 'height': 600})

    # 3. the GP Tourney POV
    open_demo(pg, POVD, pov=True)
    ev(pg, HELPERS + f'window.__lines = {LINES}; 0')
    R2 = ev(pg, r"""(() => { const rt = D.radioText; const ph = new Set(rt.map((r) => r.args[1]));
      return { n: rt.length, fmt: [...new Set(rt.map((r) => r.fmt))], twoArgs: rt.every((r) => r.args.length === 2 && r.args[0]), phrases: [...ph], unknown: [...ph].filter((x) => !(LANG.map && LANG.map[x.slice(1)])) }; })()""")
    check('reader, GP Tourney POV: 599 radio lines, each "#Game_radio", a name and a phrase the player\'s file has', R2['n'] == 599 and R2['fmt'] == ['#Game_radio'] and R2['twoArgs'] and not R2['unknown'], R2)
    def pov_find(cond, white='false'):
        return ev(pg, f"""(async () => {{ setView('3d'); setTheatre(true); setVanilla(false); $('fbWhite3').checked = {white};
          let t = null; for (const r of M.liveR) {{ for (let x = r.start + 3; x < r.end && t == null; x += 0.1) {{ const st = hudChatAt(800, x), [mode] = povObs(x); if (st && ({cond})) t = x; }} if (t != null) break; }}
          if (t == null) return {{ none: true }};
          playing = false; T = t; await __frames();
          return {{ t, mode: POV.mode, flash: povFlashAt(t), flashShown: !$('flash3').hidden, lines: HUDCH.lines, bands: __bands() }}; }})()""")
    P1 = pov_find("mode === 0 && !st.spec && st.lines.length >= 3 && st.lines.some((l) => l.kind === 'radio') && st.lines.some((l) => l.kind === 'chat' && /^\\(Terrorist\\)|^\\(Counter/.test(l.toks.map((k) => k.ch || '').join('')))")
    shot(pg, 'chat-pov-alive.png')
    print('POV alive at', P1.get('t'), json.dumps([l['text'] for l in P1.get('lines', [])], ensure_ascii=False))
    ok = not P1.get('none') and P1['mode'] == 0 and P1['bands'] and P1['bands'][0]['top'] == 430
    check('POV, playing: the top line\'s capitals at 430, the next 16 apart', ok and [x['top'] for x in P1['bands']] == [430 + 16 * i for i in range(len(P1['bands']))], P1.get('bands') and [x['top'] for x in P1['bands']])
    if ok:
        rad = [x for l, x in zip(P1['lines'], P1['bands']) if l['kind'] == 'radio']
        team = [x for l, x in zip(P1['lines'], P1['bands']) if l['kind'] == 'chat' and l['text'].startswith('(')]
        check('POV: the radio line yellow from end to end, the team chat\'s name in its team\'s colour', rad and all(x['yel'] > 60 and x['red'] == 0 and x['blue'] == 0 for x in rad) and team and all(x['red'] + x['blue'] > 15 for x in team),
              {'radio': rad, 'team chat': team})
    else:
        check('POV: the radio line yellow from end to end, the team chat\'s name in its team\'s colour', False, P1)
    # a line coming in while 5 are up pushes the top one out
    PU = ev(pg, r"""(() => { const S = hudChatStates(800);
      for (let i = 1; i < S.length; i++) { const a = S[i - 1], b = S[i];
        if (a.lines.length === 5 && b.lines.length === 5 && b.lines[4] !== a.lines[4] && b.g > a.g) return { g: b.g, before: __lines(a)[0], after: __lines(b)[0], ok: b.lines[0] === a.lines[1] && b.lines[3] === a.lines[4] }; }
      return { none: true }; })()""")
    check('POV: a line coming in while 5 are up pushes the top one out, the rest moving up', PU.get('ok'), PU)
    P2 = pov_find("mode !== 0 && st.spec && st.lines.length >= 3")
    shot(pg, 'chat-pov-dead.png')
    check('POV, dead (spectating when the newest line came in): the top line\'s capitals at 437', not P2.get('none') and P2['bands'] and P2['bands'][0]['top'] == 437, P2.get('bands') and [x['top'] for x in P2['bands']])
    P3 = pov_find("st.lines.length >= 2 && povFlashAt(x) >= 255", 'true')
    shot(pg, 'chat-pov-full-white.png')
    check('POV at full flashbang white (whiteout ticked): every line drawn over the white', not P3.get('none') and P3['flash'] >= 255 and P3['flashShown'] and len(P3['bands']) >= 2 and all(x['yel'] > 60 for x in P3['bands']),
          {k: P3.get(k) for k in ('t', 'flash', 'flashShown')} | {'yellow': [x['yel'] for x in P3.get('bands', [])]})
    ev(pg, "$('fbWhite3').checked = false; 0")
    N2 = ev(pg, r"""(() => { const bad = []; for (const st of hudChatStates(800)) for (const l of __lines(st)) if (/GP WAR|ScoreBoard|Your money|whatsapp|Tourney|\[INFO\]/i.test(l)) bad.push(l);
      return { bad: bad.slice(0, 3), plugin: D.chat.filter((c) => !/^#Cstrike_Chat_/.test(c.fmt)).length }; })()""")
    check('GP Tourney POV: none of the %d plugin and server lines drawn' % N2['plugin'], not N2['bad'] and N2['plugin'] > 100, N2)
    # 7. the strip in narrow windows, watching the teammate with the longest name, his Tab scoreboard closed
    def narrow(w, h):
        pg.set_viewport_size({'width': w, 'height': h})
        return ev(pg, r"""(async () => { setTheatre(false); setVanilla(false);
          const cand = []; for (const r of M.liveR) for (let x = r.start + 3; x < r.end; x += 0.5) { const [mode, tg] = povObs(x); if (mode !== 4 || !tg || tg === povView(x).rec) continue;
            const st = hudChatAt(1067, x); if (!st || st.lines.length < 3) continue; const s = playerState(tg, x); if (!s || s.state <= 0) continue; cand.push({ x, n: nameAt(tg, x).length }); }
          cand.sort((a, b) => b.n - a.n || a.x - b.x);
          for (const c of cand.slice(0, 40)) { playing = false; T = c.x; await __frames(); if ($('sb').hidden) return { t: c.x, who: HUDB.bottom, ...__strip() }; }
          return { none: true }; })()""")
    G3 = narrow(1000, 700)
    shot(pg, 'chat-pov-strip-1000x700.png')
    check('the strip, 1000x700, a long name: whole, inside the bottom bar, above the name, not over it', not G3.get('none') and G3['bars'] and not G3['icons'] and G3['over'] is False and G3['strip'][1] >= G3['barTop'] and G3['strip'][3] <= G3['name'][1], G3)
    G4 = narrow(900, 560)
    shot(pg, 'chat-pov-strip-900x560.png')
    check('the strip, 900x560, a long name: icons only, inside the bottom bar, not over the name', not G4.get('none') and G4['bars'] and G4['icons'] and G4['over'] is False and G4['strip'][1] >= G4['barTop'], G4)
    pg.set_viewport_size({'width': 800, 'height': 600})
    W2 = ev(pg, r"""(() => { const out = { wrapped: 0, over: 0, badStart: 0 };
      for (const st of hudChatStates(800)) st.lines.forEach((l) => { const s = l.toks.map((k) => k.ch || '').join(''); if (l.cont) { out.wrapped++; if (s[0] !== ' ') out.badStart++; }
        if (22 + [...s].reduce((w, ch) => w + hudCharW(ch), 0) > 760 + hudCharW(' ')) out.over++; });
      return out; })()""")
    # a made-up line wider than 800 units, through the wrap itself
    WM = ev(pg, r"""(() => { const toks = hudChatTokens('\x01*DEAD*(Terrorist) \x03%s1\x01 :  %s2', ['BAJRANG || Yedzavni Shizuka', 'a bolre b bolre bc adha adha khel rahe ho kya, ek site pe chalo sab saath mein aur jaldi karo yaar please'], 'TERRORIST');
      const parts = hudWrap(toks, 760).map((p) => p.map((k) => k.ch || '').join(''));
      return { parts, widths: parts.map((s) => 22 + [...s].reduce((w, ch) => w + hudCharW(ch), 0)) }; })()""")
    check('a line wider than 760 units wraps at its last space, the rest starting with a space; no line in either demo runs past it',
          len(WM['parts']) == 2 and WM['parts'][1].startswith(' ') and not WM['parts'][0].endswith(' ') and all(w <= 760 + 8 for w in WM['widths']) and W1['over'] == 0 and W2['over'] == 0 and W1['badStart'] == 0 and W2['badStart'] == 0,
          {'made up': WM, 'SK': W1, 'GP Tourney': W2})
    # 8. Sujan's Korfez POV: a living player's all-chat line
    open_demo(pg, KOR, pov=True)
    ev(pg, HELPERS + f'window.__lines = {LINES}; 0')
    K = ev(pg, r"""(async () => { setView('3d'); setTheatre(true); setVanilla(false);
      const S = hudChatStates(800), live = (l) => l.kind === 'chat' && l.toks[0] && l.toks[0].rgb && l.toks[0].rgb !== HUD_YEL && l.toks[0].rgb !== HUD_GREY;
      const st = S.find((s) => s.lines.length === 1 && live(s.lines[0])); if (!st) return { none: true };
      let x = 0; while (gameTime(x) < st.g + 0.3) x += 0.05;
      playing = false; T = x; await __frames();
      const L = HUDCH.lines[0], b = __bands()[0], name = L.text.split(' :  ')[0];
      return { t: x, text: L.text, colours: L.colours, name, nameW: hudAdvance(name, HUD_EF), ...b }; })()""")
    shot(pg, 'chat-korfez-all-chat.png')
    check('Korfez POV: a living player\'s all-chat, the name in the team colour, the rest yellow', not K.get('none') and len(K['colours']) == 2 and K['colours'][0] in ('255 64 64', '153 204 255') and K['colours'][1] == '255 179 0' and K['red'] + K['blue'] > 30 and K['yel'] > 30, K)
    check('no page errors', not errs, errs[:5])
    b.close()
srv.shutdown()
shutil.rmtree(root, ignore_errors=True)
print('ALL PASS' if all(results) else f'{results.count(False)} FAILED')
sys.exit(0 if all(results) else 1)
