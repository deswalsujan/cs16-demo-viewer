"""Checks the Half-Life folder row on the start screen (0.12.0, reworked in 0.12.1). No Half-Life folder needed; under a minute.

Chrome's real folder picker and its "Allow on every visit" prompt can't be driven in a headless browser, so
part A stands in a fake folder for the browser's folder API (showDirectoryPicker, the folder handle, its
permission and how it's saved). Part B uses a real temporary folder through the ordinary folder pick, the way
Firefox, Safari and the claude.ai artifact work. Part C loads the page inside a frame from another site, like
the artifact, where the folder API must not be used.

    python3 folder_row_test.py [page]      (default ../index.html; screenshots go to tests/folder_*.png)
"""
import os, sys, json, shutil, tempfile, threading, functools, http.server
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'index.html'))
THREE = os.environ.get('THREE_JS', os.path.join(HERE, 'three.min.js'))

def serve(directory):
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=directory); h.log_message = lambda *a: None
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

# A fake folder API for part A: the folder's contents live in localStorage (so the test can change them between
# checks), the permission state too, and a saved handle survives a reload like a real one would.
FAKE = r"""
(() => {
  const fs = () => JSON.parse(localStorage.getItem('__fakefs'));
  const perm = () => localStorage.getItem('__perm') || 'granted';
  function fileHandle(k, name) { return { kind: 'file', name, async getFile() { const [sz, mt] = fs().files[k]; return new File([new Uint8Array(sz)], name, { lastModified: mt }); } }; }
  function dirHandle(path, name) {
    return { kind: 'directory', name, __fake: true,
      async queryPermission() { return perm(); },
      async requestPermission() { window.__requested = (window.__requested || 0) + 1; localStorage.setItem('__perm', 'granted'); return 'granted'; },
      async *entries() {
        const f = fs().files, pre = path ? path + '/' : '', seen = new Set();
        for (const k in f) {
          if (!k.startsWith(pre)) continue;
          const rest = k.slice(pre.length), i = rest.indexOf('/');
          if (i < 0) yield [rest, fileHandle(k, rest)];
          else { const d = rest.slice(0, i); if (!seen.has(d)) { seen.add(d); yield [d, dirHandle(pre + d, d)]; } }
        }
      } };
  }
  window.showDirectoryPicker = async () => { window.__picked = (window.__picked || 0) + 1; return dirHandle('', fs().name); };
  const put = IDBObjectStore.prototype.put, get = IDBObjectStore.prototype.get;
  const res = Object.getOwnPropertyDescriptor(IDBRequest.prototype, 'result').get;
  IDBObjectStore.prototype.put = function (v, k) { return put.call(this, v && v.__fake ? 'FAKE' : v, k); };
  IDBObjectStore.prototype.get = function (k) {
    const r = get.call(this, k);
    if (k === 'hl:handle') Object.defineProperty(r, 'result', { get() { return res.call(r) === 'FAKE' ? dirHandle('', fs().name) : undefined; } });
    return r;
  };
})();
"""

BASE = {'cstrike/maps/de_dust2.bsp': [4000, 1000], 'cstrike/overviews/de_dust2.bmp': [300, 1000],
        'cstrike/overviews/de_dust2.txt': [40, 1000], 'cstrike/models/player/leet/leet.mdl': [900, 1000],
        'cstrike/sound/weapons/ak47-1.wav': [200, 1000], 'cstrike/navi-vs-fx.dem': [3000, 1000],
        'cstrike/old-2006.dem': [2000, 1000], 'cstrike/readme.txt': [10, 1000], 'valve/halflife.wad': [500, 1000]}

results = []
def check(name, ok, detail=''):
    results.append(ok); print(('PASS ' if ok else 'FAIL ') + name + (f'  ({detail})' if detail and not ok else ''))

def row(pg):
    return pg.evaluate("({ title: document.getElementById('hlTitle').textContent, status: document.getElementById('hlStatus').textContent,"
                       " refresh: document.getElementById('btnHlRefresh').hidden ? null : document.getElementById('btnHlRefresh').textContent,"
                       " pick: document.getElementById('btnFolder').textContent, demos: document.querySelectorAll('#demoList button').length,"
                       " done: document.getElementById('stepFolder').classList.contains('done'), demo_off: document.getElementById('btnDemo').disabled })")

def wait_status(pg, text, ms=10000):
    pg.wait_for_function("t => document.getElementById('hlStatus').textContent.includes(t)", arg=text, timeout=ms)

def setup(pg):
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))

def shot(pg, name):
    pg.locator('#stepFolder').screenshot(path=os.path.join(HERE, f'folder_{name}.png'))

srv = serve(os.path.dirname(PAGE)); url = f'http://127.0.0.1:{srv.server_port}/{os.path.basename(PAGE)}'
with sync_playwright() as p:
    b = p.chromium.launch()

    # ---- A: the remembered folder (fake folder API) ----
    ctx = b.new_context(viewport={'width': 1280, 'height': 800}); ctx.add_init_script(FAKE)
    pg = ctx.new_page(); setup(pg); errors = []; pg.on('pageerror', lambda e: errors.append(str(e)))
    setfs = lambda name, files: pg.evaluate("fs => localStorage.setItem('__fakefs', JSON.stringify(fs))", {'name': name, 'files': files})
    look = lambda: (pg.wait_for_timeout(2300), pg.evaluate("window.dispatchEvent(new Event('focus'))"), pg.wait_for_timeout(700))
    pg.goto(url); pg.evaluate('localStorage.clear()'); setfs('Half-Life', BASE)
    pg.reload(); pg.wait_for_timeout(600)
    r = row(pg); check('A1 first visit: asks for the folder, example path shown, Open .dem greyed out', r['title'] == 'Choose your Half-Life folder' and 'Program Files (x86)' in r['status'] and r['demo_off'] and not r['done'], r); shot(pg, 'a1_first_visit')
    pg.click('#btnFolder'); wait_status(pg, 'Up to date.')
    r = row(pg); check('A2 picked: "Folder selected", up to date, 2 demos, Open .dem on', r['title'] == 'Folder selected: Half-Life' and '2 demos found' in r['status'] and r['demos'] == 2 and r['done'] and not r['demo_off'], r); shot(pg, 'a2_up_to_date')
    fs2 = dict(BASE); fs2.pop('cstrike/old-2006.dem')
    for n in ('a', 'b', 'c'): fs2[f'cstrike/new-{n}.dem'] = [1000, 2000]
    fs2['cstrike/models/player/leet/leet.mdl'] = [950, 2000]
    setfs('Half-Life', fs2); look()
    r = row(pg); check('A3 coming back after changes: applied by itself (4 demos), no Refresh button, no summary', r['demos'] == 4 and r['refresh'] is None and '4 demos found' in r['status'] and 'removed' not in r['status'], r); shot(pg, 'a3_auto_applied')
    fs3 = dict(fs2); fs3['cstrike/new-d.dem'] = [1000, 3000]; setfs('Half-Life', fs3); look()
    r = row(pg); check('A4 a second change right after the first is picked up too (5 demos)', r['demos'] == 5, r)
    pg.evaluate("localStorage.setItem('__perm', 'prompt')"); pg.reload(); pg.wait_for_timeout(800)
    r = row(pg); check('A5 next visit without "every visit": Reconnect, Open .dem greyed out until then', r['refresh'] == 'Reconnect' and 'Half-Life' in r['title'] and r['demos'] == 0 and r['demo_off'], r); shot(pg, 'a5_reconnect')
    pg.click('#btnHlRefresh'); wait_status(pg, 'Up to date.')
    r = row(pg); check('A6 Reconnect asks once and loads the folder', pg.evaluate('window.__requested') == 1 and r['demos'] == 5, r)
    fs4 = dict(fs3); fs4['cstrike/new-e.dem'] = [1000, 4000]; setfs('Half-Life', fs4)
    pg.reload(); wait_status(pg, 'Up to date.')
    r = row(pg); check('A7 next visit with access kept: opens by itself, with the new demo', pg.evaluate('window.__picked || 0') == 0 and r['demos'] == 6, r)
    setfs('sprint-builds-review', {'src/index.ts': [100, 1], 'README.md': [10, 1], 'old/match.dem': [500, 1]})
    pg.click('#btnFolder'); wait_status(pg, 'Not the Half-Life folder')
    r = row(pg); check('A8 a folder without cstrike: "Not the Half-Life folder" with the example path, nothing loaded', 'sprint-builds-review' in r['title'] and 'no cstrike folder inside' in r['status'] and 'Program Files (x86)' in r['status'] and r['demos'] == 0 and r['demo_off'] and not r['done'], r); shot(pg, 'a8_wrong_folder')
    setfs('cstrike', {'maps/de_dust2.bsp': [4000, 1], 'navi.dem': [3000, 1]})
    pg.click('#btnFolder'); wait_status(pg, 'one level up')
    r = row(pg); check('A9 the cstrike folder itself: asks for the folder one level up', 'one level up' in r['status'] and r['demo_off'], r); shot(pg, 'a9_cstrike_picked')
    nodem = {k: v for k, v in BASE.items() if not k.endswith('.dem')}; setfs('Half-Life', nodem)
    pg.click('#btnFolder'); wait_status(pg, 'No demos found')
    r = row(pg); check('A10 Half-Life folder with no demos: "No demos found" warning, Open .dem still on', 'No demos found' in r['status'] and not r['demo_off'] and r['demos'] == 0, r); shot(pg, 'a10_no_demos')
    setfs('Half-Life', BASE); pg.click('#btnFolder'); wait_status(pg, '2 demos found')
    pg.click('#bClear'); pg.wait_for_timeout(300); pg.click('#bClear'); pg.wait_for_timeout(700)
    r = row(pg); m = pg.inner_text('#msg')
    check('A11 Clear saved files: back to the first-visit state at once, without a reload', r['title'] == 'Choose your Half-Life folder' and r['demos'] == 0 and r['demo_off'] and not r['done'] and 'forgotten' in m, (r, m)); shot(pg, 'a11_cleared')
    pg.reload(); pg.wait_for_timeout(800)
    r = row(pg); check('A12 and still so after a reload', r['title'] == 'Choose your Half-Life folder' and r['demo_off'], r)
    pg.evaluate("""() => { const dt = new DataTransfer(); dt.items.add(new File([new Uint8Array(10)], 'x.dem')); document.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true })); }""")
    pg.wait_for_timeout(300); m = pg.inner_text('#msg')
    check('A13 dropping a demo with no folder chosen asks for the folder first', 'Choose your Half-Life folder first' in m, m)
    check('A14 no page errors', not errors, errors)
    pg.set_viewport_size({'width': 390, 'height': 800}); pg.wait_for_timeout(200); shot(pg, 'a15_phone_width')
    ctx.close()

    # ---- B: the ordinary folder pick (no folder API) ----
    tmp = tempfile.mkdtemp(); hl = os.path.join(tmp, 'Half-Life')
    def write_tree(files):
        if os.path.exists(hl): shutil.rmtree(hl)
        for k, (sz, mt) in files.items():
            fp = os.path.join(hl, k); os.makedirs(os.path.dirname(fp), exist_ok=True)
            open(fp, 'wb').write(b'\0' * sz); os.utime(fp, (mt, mt))
    ctx = b.new_context(viewport={'width': 1280, 'height': 800}); ctx.add_init_script('delete window.showDirectoryPicker;')
    pg = ctx.new_page(); setup(pg); pg.goto(url); pg.evaluate('localStorage.clear()'); pg.reload(); pg.wait_for_timeout(600)
    r = row(pg); check('B1 without the folder API the note about Chrome\'s "upload" wording shows', 'upload' in r['status'] and r['demo_off'], r)
    write_tree(BASE); pg.set_input_files('#fFolder', hl); wait_status(pg, 'Up to date.')
    r = row(pg); check('B2 picked: up to date, 2 demos', r['demos'] == 2 and 'Half-Life' in r['title'], r)
    write_tree(fs2); pg.set_input_files('#fFolder', hl); wait_status(pg, '4 demos found')
    r = row(pg); check('B3 picked again after changes: 4 demos', r['demos'] == 4, r)
    other = os.path.join(tmp, 'Downloads'); os.makedirs(os.path.join(other, 'misc')); open(os.path.join(other, 'misc', 'a.txt'), 'w').write('x')
    pg.set_input_files('#fFolder', other); wait_status(pg, 'Not the Half-Life folder')
    r = row(pg); check('B3b ordinary pick of a wrong folder: "Not the Half-Life folder"', r['demo_off'] and r['demos'] == 0, r)
    pg.set_input_files('#fFolder', hl); wait_status(pg, '4 demos found')
    pg.reload(); pg.wait_for_timeout(800)
    r = row(pg); check('B4 next visit: folder name remembered, asks to choose it again', 'Half-Life' in r['title'] and 'Choose it again' in r['status'] and r['pick'] == 'Choose folder', r); shot(pg, 'b4_fallback_remembered')
    ctx.close(); shutil.rmtree(tmp)

    # ---- C: inside a frame from another site (like the claude.ai artifact) ----
    outer = tempfile.mkdtemp(); open(os.path.join(outer, 'frame.html'), 'w').write(f'<iframe src="{url}" style="width:1200px;height:760px;border:0"></iframe>')
    so = serve(outer); ctx = b.new_context(viewport={'width': 1280, 'height': 800}); pg = ctx.new_page(); setup(pg)
    pg.goto(f'http://localhost:{so.server_port}/frame.html'); pg.wait_for_timeout(1200)
    fr = pg.frames[1]; st = fr.evaluate("document.getElementById('hlStatus').textContent")
    check('C1 in a frame from another site: ordinary pick, with the "upload" note', 'upload' in st, st)
    ctx.close(); shutil.rmtree(outer)
    b.close()

print(f'\n{sum(results)} of {len(results)} passed')
sys.exit(0 if all(results) else 1)
