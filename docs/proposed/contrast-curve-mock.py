"""Contrast mockup (item 11): the same moments under today's look, Valve's defaults and one brighter step, drawn
into the running viewer at 1512x982 with contrast.js. Also reruns the wallbang picture check under Valve's defaults
and compares every kill's pixel count with today's.
Usage (from docs/proposed, with HALF_LIFE_DIR and DEMO_DIRS set): python3 contrast-curve-mock.py <out dir> [groups: sk,pov]
The pictures: grid of <name>-<look>.png per moment; docs/proposed/contrast-curve-mock.jpg and -models-closeup-mock.jpg were put
together from them with Pillow. Mockup only (12 Nov 2026), never part of the tests.
"""
import functools, http.server, json, os, sys, threading, time
REPO = '/Users/deswalsujan-mac/code/cs16-demo-viewer'
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(REPO, 'tests'))
from playwright.sync_api import sync_playwright
import demo_dirs

OUT = os.path.abspath(sys.argv[1]); os.makedirs(OUT, exist_ok=True)
GROUPS = sys.argv[2].split(',') if len(sys.argv) > 2 else ['sk', 'pov']
hl, inside, outside = demo_dirs.collect()
SK = demo_dirs.find('sk-vs-navi-dhwinter2011-1111261019', inside, outside).lower()
POVD = demo_dirs.find('forgotten-de_mirage-2026', inside, outside).lower()
HL = demo_dirs.stage(outside)
html = open(os.path.join(REPO, 'index.html'), encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
test_page = os.path.join(REPO, '_test_contrast_index.html')
open(test_page, 'w', encoding='utf-8').write(html)
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=REPO)
h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/_test_contrast_index.html'
CX = open(os.path.join(HERE, 'contrast-curve-mock.js')).read()

VARIANTS = [
    ('today', "'today'"),
    ('valve', "{ gamma: 2.5, brightness: 1, texgamma: 2, lightgamma: 2.5, ob: 1 }"),
    ('brighter', "{ gamma: 2.5, brightness: 2, texgamma: 2, lightgamma: 2.5, ob: 1 }"),
]
report = {'moments': [], 'seen': {}}
t0 = time.time()

with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1512, 'height': 982})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto(url)
    js = lambda c: pg.evaluate('(c) => __v(c)', c)
    jsj = lambda body: json.loads(js('JSON.stringify((() => { ' + body + ' })())'))
    pg.set_input_files('#fFolder', HL)
    pg.wait_for_function('__v("files.demos.length > 0")', timeout=60000)

    def open_demo(name):
        js(f"loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === {json.dumps(name)})); 0")
        pg.wait_for_function('(c) => __v(c)', arg='!!(D && M && MAP && R3 && view3.map === MAP.name && D.fileName.toLowerCase() === %s)' % json.dumps(name), timeout=300000)
        pg.wait_for_timeout(1500)
        js('closeSummary(); 0')
        js(CX)

    def frames(name, label, setup):
        setup(); pg.wait_for_timeout(1800)
        box = pg.query_selector('#radar').bounding_box()
        info = {}
        for key, v in VARIANTS:
            info[key] = js(f'JSON.stringify(__cx.apply({v}, {json.dumps(key)}))')
            pg.wait_for_timeout(700)
            pg.screenshot(path=os.path.join(OUT, f'{name}-{key}.png'), clip=box)
        js("__cx.apply('today'); 0")
        report['moments'].append({'name': name, 'label': label, 'info': {k: json.loads(v) for k, v in info.items()}})
        print(f'{time.time() - t0:5.0f}s {name}', flush=True)

    def seen_check(tag):
        # every kill the picture check drew, counted again under Valve's defaults
        r = pg.evaluate('''(c) => __v(c)''', '''(async () => {
          const ks = D.kills.filter((k) => k.seenPx != null && k.seenPx >= 0);
          const before = ks.map((k) => k.seenPx);
          __cx.apply({ gamma: 2.5, brightness: 1, texgamma: 2, lightgamma: 2.5, ob: 1 }, 'valve');
          for (const k of ks) k.seenPx = null;
          await checkSeen();
          const after = ks.map((k) => k.seenPx);
          __cx.apply('today');
          const diff = []; ks.forEach((k, i) => { if (before[i] !== after[i]) diff.push([labelAt(k.killer, k.t), labelAt(k.victim, k.t), before[i], after[i]]); });
          return JSON.stringify({ drawn: ks.length, same: ks.length - diff.length, diff, nonzero: before.filter((x) => x > 0).length });
        })()''')
        report['seen'][tag] = json.loads(r)
        print(tag, report['seen'][tag], flush=True)

    if 'sk' in GROUPS:
        open_demo(SK)
        js("setView('3d'); 0"); pg.wait_for_timeout(800)
        pg.wait_for_function('__v("!M.seenPending")', timeout=180000)
        # edzie (SAS on CT) in shade and in full light: his floor's lightmap value near 50 and at 255
        pick = jsj('''const e = 7, S = D.stride, rows = [];
          for (const r of M.liveR) for (let t = r.start + 8; t < (r.end || r.start + 100) - 2; t += 1) {
            const a = D.slots[e]; const s = playerStateAt(e, t); if (!s) continue;
            if (!/\\/sas\\//i.test(playerModelName(a[M.idxAt(t) * S + 8]))) continue;
            const f = __cx.floorLM(g3(s.x, s.y, s.z)); if (!f || f.dist > 60) continue;
            rows.push({ t, ln: r.ln, clock: clockText(t), L: Math.max(...f.rgb) });
          }
          const shade = rows.filter((x) => x.L >= 40 && x.L <= 70).sort((a, b) => Math.abs(a.L - 55) - Math.abs(b.L - 55))[0];
          const light = rows.filter((x) => x.L === 255).sort((a, b) => b.ln - a.ln)[0];
          return { shade, light, n: rows.length };''')
        print('edzie', pick, flush=True)
        report['edzie'] = pick
        for key in ('shade', 'light'):
            m = pick[key]
            frames(f'sas-{key}', f"SAS model in {key} (edzie, R{m['ln']} {m['clock']}, floor light {m['L']})",
                   lambda m=m: js(f"playing = false; setPlayIcon(); selected = 7; setCam('chase', true); seek({m['t']}); 0"))
        frames('train-dark', 'Train, a dark corner (starix, R4 1:30, floor light 12)',
               lambda: js("playing = false; setPlayIcon(); selected = 8; setCam('chase', true); seek(801.96); 0"))
        seen_check('sk-vs-navi-train')

    if 'pov' in GROUPS:
        open_demo(POVD)
        frames('mirage-dark', 'Mirage, a dark corner (the GP Tourney POV, R19 1:16, floor light 27)',
               lambda: js("playing = false; setPlayIcon(); seek(1919.89); 0"))
        frames('mirage-dark-2', 'Mirage, a dark corner, watching a teammate after his death (the GP Tourney POV, R11 0:58, floor light 34)',
               lambda: js("playing = false; setPlayIcon(); seek(1057.18); 0"))
        pg.wait_for_function('__v("!M.seenPending")', timeout=180000)
        seen_check('gp-tourney-mirage')

    b.close()
try: os.remove(test_page)
except OSError: pass
json.dump(report, open(os.path.join(OUT, 'report.json'), 'w'), indent=1)
print(f'done {time.time() - t0:.0f} s', errs[:10])
