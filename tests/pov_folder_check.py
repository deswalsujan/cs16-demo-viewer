"""POV mode's files through Chrome and Edge's folder access (0.26.8). Needs HALF_LIFE_DIR; about a minute.

Chrome and Edge read the Half-Life folder through a folder handle (showDirectoryPicker), and the viewer keeps only
the files HL_WANT lists in src/ui/folder.js; up to 0.26.7 that left out cstrike/config.cfg (POV mode's crosshair)
and cstrike/sprites/weapon_*.txt (the POV HUD's ammo icons). The other tests feed the folder through the ordinary
folder pick, which hands the page every file, so they never saw it. This one feeds the real Half-Life folder
through a stand-in for the folder handle (Chrome's picker can't be driven headless): every file of the folder is
listed, and the viewer's own scan picks what it keeps. A stand-in cstrike/config.cfg with settings unlike the
game's defaults is added in the page only (the Mac's Half-Life folder has none; nothing is written to the folder).
Then it opens a POV demo with POV mode on (DEMO, default Match 1 CT, public server, de_barcelona, 27 Mar 2025) and
checks the crosshair settings came from that config.cfg and every gun he used with an ammo line in its
weapon_*.txt has its ammo icon. Fails (exit code 1) on 0.26.7.

    python3 pov_folder_check.py [page] [screenshot.png]      (default ../index.html)
"""
import os, sys, json, threading, http.server, functools
from playwright.sync_api import sync_playwright
import demo_dirs

HERE = os.path.dirname(os.path.abspath(__file__))
_hl, _inside, _outside = demo_dirs.collect()
DEMO = demo_dirs.find(os.environ.get('DEMO', 'match-1_de_barcelona-cts'), _inside, _outside).lower()
HL = demo_dirs.stage(_outside)
PAGE = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'index.html'))
SHOT = sys.argv[2] if len(sys.argv) > 2 else None
THREE = os.environ.get('THREE_JS', os.path.join(HERE, '..', 'src', 'vendor', 'three.min.js'))
print('pov_folder_check: opening ' + DEMO, file=sys.stderr)

html = open(PAGE, encoding='utf-8').read()
i = html.rindex('})();')
html = html[:i] + 'window.__v = (c) => eval(c);\n' + html[i:]
page_path = os.path.join(os.path.dirname(PAGE), '_test_pov_folder_' + os.path.basename(PAGE))
open(page_path, 'w', encoding='utf-8').write(html)
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
h = functools.partial(Quiet, directory=os.path.dirname(page_path))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/{os.path.basename(page_path)}'

# the stand-in config.cfg: cyan, small, not translucent (the game's defaults are green, medium, translucent)
CFG = 'cl_crosshair_color "0 255 255"\ncl_crosshair_size "small"\ncl_crosshair_translucent "0"\n'

# A folder handle over the files of a hidden ordinary input (the real files, read from disk when the viewer asks),
# plus the stand-in config.cfg; showDirectoryPicker returns it, as Chrome's picker would return the real one
HANDLE = r"""
(cfg) => {
  const list = [...document.getElementById('__src').files];
  const root = list[0].webkitRelativePath.split('/')[0];
  const tree = { dirs: {}, files: {} };
  const add = (path, f) => { const seg = path.split('/').slice(1); let d = tree; for (const s of seg.slice(0, -1)) d = d.dirs[s] || (d.dirs[s] = { dirs: {}, files: {} }); d.files[seg[seg.length - 1]] = f; };
  for (const f of list) add(f.webkitRelativePath, f);
  const cs = Object.keys(tree.dirs).find((n) => n.toLowerCase() === 'cstrike');
  if (cs && !Object.keys(tree.dirs[cs].files).some((n) => n.toLowerCase() === 'config.cfg')) tree.dirs[cs].files['config.cfg'] = new File([cfg], 'config.cfg', { lastModified: 1000 });
  else window.__cfgReal = true;
  const dirHandle = (d, name) => ({ kind: 'directory', name,
    async queryPermission() { return 'granted'; }, async requestPermission() { return 'granted'; },
    async *entries() {
      for (const n in d.files) { const f = d.files[n]; yield [n, { kind: 'file', name: n, async getFile() { return f; } }]; }
      for (const n in d.dirs) yield [n, dirHandle(d.dirs[n], n)];
    } });
  window.showDirectoryPicker = async () => dirHandle(tree, root);
  return list.length;
}
"""

# after the demo is open: his first moment alive in his own eyes holding a gun with a crosshair, the HUD drawn there,
# then what was read
CHECK = r"""
(async () => {
  setView('3d');
  const A = D.ownAmmo || [];
  let at = null;
  for (let i = 0; i < A.length && at == null; i += 3) {
    const id = A[i + 1], t = A[i] + 1;
    if (!id || NO_XHAIR[id] || [4, 6, 9, 25, 29].includes(id) || t < D.start + 20) continue; // past the warmup's restart
    POV.i = 0; povFollow(t);
    if (POV.mode === 0 && POV.who === POV.v.rec && povGun(t) === id) at = t;
  }
  if (at != null) { seek(at); playing = true; await new Promise((r) => setTimeout(r, 1200)); playing = false; setPlayIcon(); }
  for (let k = 0; k < 150 && !(HUDS.from && !HUDS.loading && XCFG.r !== undefined); k++) { loadHudSprites(); readCrosshairCfg(); await new Promise((r) => setTimeout(r, 100)); }
  await new Promise((r) => setTimeout(r, 1500));
  const guns = [...new Set(A.filter((_, i) => i % 3 === 1))].filter((id) => id && W_NAME[id]);
  const withAmmo = [];
  for (const id of guns) { const f = files.hud.wtxt && files.hud.wtxt['weapon_' + W_NAME[id]]; if (f && /^\s*ammo\s+640\s/m.test(await f.text())) withAmmo.push(id); }
  return {
    at: at == null ? null : fmt(at - D.start), gun: at == null ? null : W_NAME[povGun(at)],
    cfg: files.cfg ? files.cfg.name : null, weaponTxt: Object.keys(files.hud.wtxt || {}).length,
    crosshair: { r: XCFG.r, g: XCFG.g, b: XCFG.b, base: XCFG.base, additive: XCFG.additive },
    gunsUsed: guns.map((id) => W_NAME[id]), gunsWithAmmoLine: withAmmo.map((id) => W_NAME[id]),
    ammoIcons: Object.keys(HUDS.ammo).map((id) => W_NAME[id]), hudSprites: Object.keys(HUDS.spr).length,
    view: { pov: POV.on, camera: cam3.mode, inHisEyes: POV.who === POV.v.rec && POV.mode === 0, gunNow: W_NAME[povGun(POV.t)] },
  };
})()
"""

results = []
def check(name, ok, detail=''):
    results.append(ok); print(('PASS ' if ok else 'FAIL ') + name + (f'  ({detail})' if detail and not ok else ''))

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME') or None, args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1440, 'height': 900})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(url)
    pg.evaluate("() => { const i = document.createElement('input'); i.type = 'file'; i.id = '__src'; i.webkitdirectory = true; i.hidden = true; document.body.appendChild(i); }")
    pg.set_input_files('#__src', HL)
    n = pg.evaluate(HANDLE, CFG)
    real_cfg = pg.evaluate('!!window.__cfgReal')
    check('the page uses the folder handle, as in Chrome and Edge on GitHub Pages', pg.evaluate('__v("fsaOK()")'))
    pg.evaluate('__v("pickFolder()")')
    pg.wait_for_function('__v("HL.ok && files.demos.length > 0")', timeout=60000)
    print(f'  folder: {n} files listed, the viewer kept the ones HL_WANT names' + ('; its own cstrike/config.cfg' if real_cfg else '; stand-in cstrike/config.cfg added'), file=sys.stderr)
    pg.evaluate("__v(\"$('pov3').checked = true\")")
    pg.evaluate('(n) => __v(`loadDemoFile(files.demos.find((f) => f.name.toLowerCase() === ${JSON.stringify(n)}))`)', DEMO)
    pg.wait_for_function('__v("!!(D && M && MAP && R3 && view3.map === MAP.name)")', timeout=240000)
    pg.evaluate('__v("closeSummary()")')
    out = pg.evaluate('(c) => __v(c)', CHECK)
    print(json.dumps(out), file=sys.stderr)
    check('cstrike/config.cfg found through the folder handle', out['cfg'] == 'config.cfg', out['cfg'])
    if not real_cfg:
        x = out['crosshair']
        check('crosshair settings read from it: cyan, small, not translucent', (x['r'], x['g'], x['b'], x['base'], x['additive']) == (0, 255, 255, 1024, False), x)
    check('cstrike/sprites/weapon_*.txt found through the folder handle', out['weaponTxt'] > 0, out['weaponTxt'])
    check('an ammo icon for every gun he used that has one', bool(out['gunsWithAmmoLine']) and set(out['gunsWithAmmoLine']) <= set(out['ammoIcons']), (out['gunsWithAmmoLine'], out['ammoIcons']))
    check('a moment in his eyes with a crosshair gun, for the picture', out['at'] is not None)
    check('no page errors', not errs, errs[:5])
    if SHOT:
        pg.wait_for_timeout(800); pg.screenshot(path=SHOT)
    b.close()
srv.shutdown(); os.remove(page_path)
print(f'\n{sum(results)} of {len(results)} passed')
sys.exit(0 if all(results) else 1)
