"""Fails if the 3D view stops drawing the game's light (0.26.31; Sujan, 12 Nov 2026: Valve's defaults for everyone,
models lit by the floor under them as the game does, with the sky light and the light's direction from Xash3D's
R_EntityDynamicLight).

On SK vs Na`Vi, Train, DreamHack Winter 2011 (`sk-vs-navi-dhwinter2011-1111261019-de_train.dem`), in 3D:
- the sky light comes from the demo's movevars (sv_skycolor 363 363 239, the sun's direction from de_train's
  light_environment, pitch -65, yaw 102);
- starix in the dark corner at R4 1:30 gets the light under him (12 of 255 on the lightmap, 12 after light style "m"),
  90% of it from one direction, and edzie in shade at R16 1:39 his (56 on the lightmap texel the engine reads, so 57;
  the mockup, reading the drawn mesh, said 55, so 56 to 57 pass);
- RobbaN in the open at R4 1:20 gets the sky's colour, from the sun's direction, at the most a model can get (255);
- his gun in Player's eyes gets the light at his eyes;
- Team colours keeps the even light (its red and blue clear in the dark);
- the textures go through texgamma (one of de_train's walls) but the masked ones ({) don't, water has no lightmap;
- no page errors.

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 light_check.py [page.html]
Needs the demo in the Half-Life folder or DEMO_DIRS (demo_dirs.py) and de_train in the folder. Exit code 0 = pass.
Fails on 0.26.30, which had none of it.
"""
import functools, http.server, json, os, sys, threading, time
from playwright.sync_api import sync_playwright
import demo_dirs

here = os.path.dirname(os.path.abspath(__file__))
page = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'index.html'))
hl, inside, outside = demo_dirs.collect()
SK = demo_dirs.find('sk-vs-navi-dhwinter2011-1111261019', inside, outside).lower()
HL = demo_dirs.stage(outside)
html = open(page, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
test_page = os.path.join(os.path.dirname(page), '_test_light_' + os.path.basename(page))
open(test_page, 'w', encoding='utf-8').write(html)
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.dirname(test_page))
h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/{os.path.basename(test_page)}'
# the light on a rig, from its first part's material (null on a build without the game's light)
RIG = '''((k) => { const r = R3.rigs && R3.rigs[k]; if (!r || !r.g.visible) return null; const u = r.parts[0].mat.uniforms;
  if (!u || !u.amb) return null; return { amb: u.amb.value, shade: u.shade.value, col: u.lcol.value.toArray(), dir: u.ldir.value.toArray(), even: u.even.value }; })'''
checks, t0 = [], time.time()
near = lambda a, b, d: abs(a - b) <= d
try:
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = b.new_page(viewport={'width': 1440, 'height': 900})
        errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(url)
        js = lambda c: pg.evaluate('(c) => __v(c)', c)
        pg.set_input_files('#fFolder', HL)
        pg.wait_for_function('__v("files.demos.length > 0")', timeout=30000)
        js(f"loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === {json.dumps(SK)})); 0")
        pg.wait_for_function('(c) => __v(c)', arg='!!(D && M && MAP && R3 && view3.map === MAP.name)', timeout=240000)
        js("closeSummary(); setView('3d'); 0")

        def check(name, ok, got):
            checks.append((bool(ok), name, got))

        sky = js("JSON.stringify(D.sky || null)")
        sky = json.loads(sky)
        check('the sky light from the demo\'s movevars', sky and [round(c) for c in sky['color']] == [363, 363, 239] and near(sky['vec'][2], -0.906, 0.01), sky)

        def at(sel, t, cam='chase'):
            js(f"playing = false; setPlayIcon(); selected = {sel}; setCam('{cam}', true); seek({t}); 0")
            pg.wait_for_timeout(1500)

        at(8, 801.96)  # starix, R4 1:30, a dark corner
        L = js(f'JSON.stringify({RIG}("p8"))'); L = json.loads(L) if L else None
        check('starix in the dark corner: the light under him, 90% from one direction', L and near(L['amb'] + L['shade'], 12, 0.5) and near(L['shade'], 10.8, 0.2), L)
        at(7, 2135.19)  # edzie, R16 1:39, in shade
        L = js(f'JSON.stringify({RIG}("p7"))'); L = json.loads(L) if L else None
        check('edzie in shade: the light under him', L and near(L['amb'] + L['shade'], 56.5, 1), L)
        at(3, 811.96)  # RobbaN, R4 1:20, in the open
        L = js(f'JSON.stringify({RIG}("p3"))'); L = json.loads(L) if L else None
        # the sun's direction in three.js space: (x, z, -y) of sv_skyvec
        want = [sky['vec'][0], sky['vec'][2], -sky['vec'][1]] if sky else [0, 0, 0]
        check('RobbaN in the sun: the sky\'s colour, from the sun\'s direction', L and near(L['amb'] + L['shade'], 255, 0.5) and near(L['col'][2], 239 / 363, 0.01)
              and all(near(a, w, 0.01) for a, w in zip(L['dir'], want)), L)
        at(3, 811.96, 'eyes')
        V = js("JSON.stringify(VM && VM.rig && VM.rig.parts[0].mat.uniforms && VM.rig.parts[0].mat.uniforms.amb ? { amb: VM.rig.parts[0].mat.uniforms.amb.value, shade: VM.rig.parts[0].mat.uniforms.shade.value } : null)")
        V = json.loads(V) if V else None
        E = json.loads(js("JSON.stringify((() => { const c = R3.camera.position; const L = entityLight(c.x, -c.z, c.y); return { amb: L.amb, shade: L.shade }; })())")) if V else None
        check('his gun in Player\'s eyes: the light at his eyes', V and E and near(V['amb'], E['amb'], 0.01) and near(V['shade'], E['shade'], 0.01), {'gun': V, 'eyes': E})
        js("opts.teamColours = true; tcShow(); 0")
        at(8, 801.96)
        L = js(f'JSON.stringify({RIG}("p8"))'); L = json.loads(L) if L else None
        check('Team colours keeps the even light', L and L['even'] == 1, L)
        js("opts.teamColours = false; tcShow(); 0")
        T = json.loads(js('''JSON.stringify(typeof CURVE === 'undefined' ? { plain: null } : (() => {
          // a texture of the map's own (or a .wad's) against its source: texgamma on its colours unless masked
          const src = (name) => { const bt = MAP.bsp.textures.find((t) => t.name === name); return (bt && bt.data) ? bt.data : (MAP.tex[name] ? MAP.tex[name].data : null); };
          let plain = null, masked = null;
          for (const [name, t] of Object.entries(R3.texCache || {})) {
            const s = src(name); if (!s) continue; const d = t.image.data; let k = -1;
            for (let i = 0; i < s.length; i += 4) if (s[i + 3] && s[i] > 20 && s[i] < 200) { k = i; break; }
            if (k < 0) continue;
            const r = { name, src: s[k], drawn: d[k], gamma: CURVE.tex[s[k]] };
            if (name[0] === '{') { if (!masked) masked = r; } else if (!plain) plain = r;
          }
          // water (names starting with !) has no lightmap, every other surface has
          const wrongLit = R3.world.children.filter((c) => c.material.uniforms && c.material.uniforms.lit && c.material.uniforms.lit.value !== ((c.userData.tex || '')[0] === '!' ? 0 : 1)).length;
          const water = R3.world.children.filter((c) => (c.userData.tex || '')[0] === '!').length;
          return { plain, masked, wrongLit, water, surfaces: R3.world.children.length };
        })())'''))
        check('texgamma on a texture, not on a masked one; water with no lightmap', T['plain'] and T['plain']['drawn'] == T['plain']['gamma'] and T['plain']['drawn'] != T['plain']['src']
              and (not T['masked'] or T['masked']['drawn'] == T['masked']['src']) and T['wrongLit'] == 0 and T['surfaces'] > 0, T)
        check('no page errors', not errs, errs[:3])
        b.close()
finally:
    srv.shutdown()
    os.remove(test_page)
for ok, name, got in checks:
    print(('ok   ' if ok else 'FAIL ') + name + '  ' + json.dumps(got)[:300])
passed = len(checks) == 8 and all(c[0] for c in checks)
print(f'{"PASS" if passed else "FAIL"} ({time.time() - t0:.0f} s)')
sys.exit(0 if passed else 1)
