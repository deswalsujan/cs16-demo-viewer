"""Checks the Half-Life folder row on the start screen (0.12.0; one way to choose the folder since 0.26.11). No
Half-Life folder needed; under a minute.

Since 0.26.11 the folder is chosen with the browser's ordinary folder pick, in every browser, on every visit, and
nothing about it is kept between visits (Sujan, 2 Nov 2026, docs/folder-one-pick-mock.png). Part A checks the row
before picking on each system, from what a stand-in browser says about it (Windows, Mac, Linux, and a Mac browser
without navigator.userAgentData, like Firefox and Safari). Part B picks a real temporary folder through the ordinary
pick: the row after picking, wrong folders, no demos, demos deleted or changed after the pick (found when one is
clicked and when the player comes back to the page), Clear saved files, the next visit. Part C loads the page inside
a frame from another site, like the claude.ai artifact.

    python3 folder_row_test.py [page]      (default ../index.html; screenshots go to tests/folder_*.png)
"""
import os, sys, shutil, tempfile, threading, functools, http.server
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'index.html'))
THREE = os.environ.get('THREE_JS', os.path.join(HERE, '..', 'src', 'vendor', 'three.min.js'))

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

def serve(directory):
    s = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=directory))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

# what the browser says about the system: navigator.userAgentData.platform (Chrome and Edge) and navigator.platform
def system(ua, plat):
    return (f"Object.defineProperty(Navigator.prototype, 'userAgentData', {{ get: () => ({ua!r} ? {{ platform: {ua!r}, brands: [], mobile: false }} : undefined) }});"
            f"Object.defineProperty(Navigator.prototype, 'platform', {{ get: () => {plat!r} }});")
WINDOWS = system('Windows', 'Win32')
# Chrome and Edge's folder access, counting its calls: the page must never use it (0.26.11)
NO_FOLDER_ACCESS = "window.showDirectoryPicker = async () => { window.__picked = (window.__picked || 0) + 1; throw new DOMException('aborted', 'AbortError'); };"

BASE = {'cstrike/maps/de_dust2.bsp': [4000, 1000], 'cstrike/overviews/de_dust2.bmp': [300, 1000],
        'cstrike/overviews/de_dust2.txt': [40, 1000], 'cstrike/models/player/leet/leet.mdl': [900, 1000],
        'cstrike/sound/weapons/ak47-1.wav': [200, 1000], 'cstrike/navi-vs-fx.dem': [3000, 1000],
        'cstrike/old-2006.dem': [2000, 1000], 'cstrike/readme.txt': [10, 1000], 'valve/halflife.wad': [500, 1000],
        'cstrike/config.cfg': [300, 1000], 'cstrike/sprites/weapon_ak47.txt': [200, 1000]}
WIN_PATH, MAC_PATH = 'Program Files (x86)', 'Library/Application Support/Steam'
TIP, UPLOAD = 'Cmd+Shift+G', 'Your browser may call it an upload, but nothing leaves your computer.'
HELP = 'The Half-Life folder from your Steam install, the one with cstrike and valve inside.'
TOOLTIP = 'New demos show up when you choose the folder again.'

results = []
def check(name, ok, detail=''):
    ok = bool(ok); results.append(ok); print(('PASS ' if ok else 'FAIL ') + name + (f'  ({detail})' if detail and not ok else ''))

def row(pg):
    return pg.evaluate("""() => { const $ = (id) => document.getElementById(id), vis = (id) => $(id) && !$(id).hidden && !$(id).closest('[hidden]');
      return { title: $('hlTitle').textContent, status: $('hlStatus').textContent, dot: !!$('hlStatus').querySelector('.hlst'),
        pick: $('btnFolder').textContent, tip: $('btnFolder').title, demos: document.querySelectorAll('#demoList button').length,
        done: $('stepFolder').classList.contains('done'), demo_off: $('btnDemo').disabled,
        paths: $('hlPaths').hidden ? null : $('hlPaths').innerText, win: vis('hlWin'), mac: vis('hlMac'), mactip: vis('hlTip'),
        old: ['hlAlt', 'btnHlInput', 'btnHlRefresh'].filter((id) => $(id)), msg: $('msg').textContent }; }""")

def wait_status(pg, text, ms=10000):
    pg.wait_for_function("t => document.getElementById('hlStatus').textContent.includes(t)", arg=text, timeout=ms)

def setup(pg):
    pg.route('**/three.min.js', lambda r: r.fulfill(path=THREE, content_type='application/javascript'))

def shot(pg, name):
    pg.locator('#stepFolder').screenshot(path=os.path.join(HERE, f'folder_{name}.png'))

srv = serve(os.path.dirname(PAGE)); url = f'http://127.0.0.1:{srv.server_port}/{os.path.basename(PAGE)}'
with sync_playwright() as p:
    b = p.chromium.launch()

    # ---- A: before picking, on each system ----
    for key, init, want in [('windows', WINDOWS, 'win'), ('mac', system('macOS', 'MacIntel'), 'mac'),
                            ('linux', system('Linux', 'Linux x86_64'), 'both'), ('mac_no_ua_data', system('', 'MacIntel'), 'mac')]:
        ctx = b.new_context(viewport={'width': 1280, 'height': 800}); ctx.add_init_script(init); ctx.add_init_script(NO_FOLDER_ACCESS)
        pg = ctx.new_page(); setup(pg); errors = []; pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.goto(url); pg.wait_for_timeout(500)
        r = row(pg)
        paths_ok = {'win': r['win'] and not r['mac'] and not r['mactip'] and WIN_PATH in r['paths'] and MAC_PATH not in r['paths'],
                    'mac': r['mac'] and r['mactip'] and not r['win'] and MAC_PATH in r['paths'] and WIN_PATH not in r['paths'],
                    'both': r['win'] and r['mac'] and r['mactip']}[want]
        check(f'A1 {key}: first visit asks for the folder, the help in one sentence, {"both paths" if want == "both" else "only its own path"}, the upload line, Open .dem greyed out',
              r['title'] == 'Choose your Half-Life folder' and r['status'] == HELP and r['pick'] == 'Choose folder' and not r['tip'] and paths_ok
              and UPLOAD in r['paths'] and r['demo_off'] and not r['done'] and not r['old'], r)
        shot(pg, f'a1_{key}')
        if key == 'windows':
            with pg.expect_file_chooser() as fc: pg.click('#btnFolder')
            check('A2 Choose folder opens the ordinary folder pick, never Chrome and Edge\'s folder access', fc.value.element.get_attribute('id') == 'fFolder' and not pg.evaluate('window.__picked || 0'))
        check(f'A3 {key}: no page errors', not errors, errors)
        ctx.close()

    # ---- B: the ordinary folder pick of a real folder ----
    tmp = tempfile.mkdtemp(); hl = os.path.join(tmp, 'Half-Life')
    def write_tree(files):
        if os.path.exists(hl): shutil.rmtree(hl)
        for k, (sz, mt) in files.items():
            fp = os.path.join(hl, k); os.makedirs(os.path.dirname(fp), exist_ok=True)
            open(fp, 'wb').write(b'\0' * sz); os.utime(fp, (mt, mt))
    ctx = b.new_context(viewport={'width': 1280, 'height': 800}); ctx.add_init_script(WINDOWS); ctx.add_init_script(NO_FOLDER_ACCESS)
    pg = ctx.new_page(); setup(pg); errors = []; pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto(url); pg.wait_for_timeout(500)
    write_tree(BASE); pg.set_input_files('#fFolder', hl); wait_status(pg, '2 demos found.')
    r = row(pg)
    check('B1 picked: "Folder selected: Half-Life", "2 demos found." with no dot, Choose again with its tooltip, no paths, Open .dem on',
          r['title'] == 'Folder selected: Half-Life' and r['status'] == '2 demos found.' and not r['dot'] and r['pick'] == 'Choose again'
          and r['tip'] == TOOLTIP and r['paths'] is None and r['demos'] == 2 and r['done'] and not r['demo_off'], r); shot(pg, 'b1_picked')
    fs2 = dict(BASE); fs2.pop('cstrike/old-2006.dem')
    for n in ('a', 'b', 'c'): fs2[f'cstrike/new-{n}.dem'] = [1000, 2000]
    write_tree(fs2); pg.set_input_files('#fFolder', hl); wait_status(pg, '4 demos found.')
    r = row(pg); check('B2 chosen again after changes: 4 demos, the deleted one gone', r['demos'] == 4 and 'old-2006' not in pg.inner_text('#demoList'), r)
    other = os.path.join(tmp, 'Downloads'); os.makedirs(os.path.join(other, 'misc')); open(os.path.join(other, 'misc', 'a.txt'), 'w').write('x')
    pg.set_input_files('#fFolder', other); wait_status(pg, 'Not the Half-Life folder')
    r = row(pg); check('B3 a folder without cstrike: "Not the Half-Life folder", its own path and the upload line again, nothing loaded',
                       'Downloads' in r['title'] and 'no cstrike folder inside' in r['status'] and r['win'] and not r['mac'] and UPLOAD in (r['paths'] or '')
                       and r['pick'] == 'Choose again' and not r['tip'] and r['demos'] == 0 and r['demo_off'] and not r['done'], r); shot(pg, 'b3_wrong_folder')
    pg.set_input_files('#fFolder', os.path.join(hl, 'cstrike')); wait_status(pg, 'one level up')
    r = row(pg); check('B4 the cstrike folder itself: asks for the folder one level up', 'one level up' in r['status'] and r['demo_off'], r)
    write_tree({k: v for k, v in BASE.items() if not k.endswith('.dem')}); pg.set_input_files('#fFolder', hl); wait_status(pg, 'No demos found')
    r = row(pg); check('B5 Half-Life folder with no demos: "No demos found" warning, Open .dem still on', r['dot'] and not r['demo_off'] and r['demos'] == 0, r); shot(pg, 'b5_no_demos')

    # demos deleted or changed after the pick: the page finds out only when it reads them
    fs3 = dict(BASE); fs3['cstrike/third.dem'] = [1500, 1000]; fs3['cstrike/fourth.dem'] = [1500, 1000]
    write_tree(fs3); pg.set_input_files('#fFolder', hl); wait_status(pg, '4 demos found.'); pg.evaluate("document.getElementById('msg').textContent = ''")
    os.remove(os.path.join(hl, 'cstrike', 'old-2006.dem'))
    pg.wait_for_timeout(300); r = row(pg)
    check('B6 a demo deleted on disk stays listed until the page reads it (no event tells the page)', r['demos'] == 4 and not r['msg'], r)
    pg.click('#demoList button:has-text("old-2006.dem")'); pg.wait_for_function("document.getElementById('msg').textContent.includes(\"couldn't be read\")", timeout=5000)
    r = row(pg)
    check('B7 clicking it: "couldn\'t be read … choose the folder again", taken off the list, the count says 3', 'old-2006.dem couldn\'t be read' in r['msg']
          and 'choose the folder again' in r['msg'] and r['demos'] == 3 and r['status'] == '3 demos found.', r)
    pg.evaluate("document.getElementById('msg').textContent = ''")
    os.remove(os.path.join(hl, 'cstrike', 'third.dem'))
    pg.evaluate("window.dispatchEvent(new Event('focus'))"); pg.wait_for_function("document.getElementById('msg').textContent.includes('taken off the list')", timeout=5000)
    r = row(pg)
    check('B8 coming back to the page (window focus) on the start screen: the deleted demo taken off with a note, the count says 2',
          'third.dem is no longer in your folder' in r['msg'] and r['demos'] == 2 and r['status'] == '2 demos found.', r); shot(pg, 'b8_deleted_demo')
    pg.evaluate("document.getElementById('msg').textContent = ''")
    with open(os.path.join(hl, 'cstrike', 'fourth.dem'), 'ab') as f: f.write(b'\1' * 500)
    pg.click('#demoList button:has-text("fourth.dem")'); pg.wait_for_function("document.getElementById('msg').textContent.includes(\"couldn't be read\")", timeout=5000)
    r = row(pg); check('B9 a demo changed after the pick (still being recorded): clicking it says it couldn\'t be read, taken off the list',
                       'fourth.dem couldn\'t be read' in r['msg'] and 'still recording' in r['msg'] and r['demos'] == 1, r)

    write_tree(BASE); pg.set_input_files('#fFolder', hl); wait_status(pg, '2 demos found.')
    # what 0.26.10 and earlier kept in the browser: deleted on the next visit
    pg.evaluate("""() => new Promise((res) => { const o = indexedDB.open('wallbang-viewer', 1); o.onsuccess = () => { const t = o.result.transaction('overviews', 'readwrite'), s = t.objectStore('overviews');
      s.put({ name: 'Half-Life', files: { 'cstrike/a.dem': [1, 1] } }, 'hl:snap'); s.put(true, 'hl:input'); s.put('handle', 'hl:handle'); t.oncomplete = res; }; })""")
    pg.click('#bClear'); pg.wait_for_timeout(300); pg.click('#bClear'); pg.wait_for_timeout(700)
    r = row(pg)
    check('B10 Clear saved files: back to the first visit at once, without a reload; no Remove access note', r['title'] == 'Choose your Half-Life folder' and r['demos'] == 0
          and r['demo_off'] and not r['done'] and 'saved files are deleted' in r['msg'] and 'Remove access' not in r['msg'], r); shot(pg, 'b10_cleared')
    pg.set_input_files('#fFolder', hl); wait_status(pg, '2 demos found.')
    pg.evaluate("""() => new Promise((res) => { const o = indexedDB.open('wallbang-viewer', 1); o.onsuccess = () => { const t = o.result.transaction('overviews', 'readwrite'), s = t.objectStore('overviews');
      s.put({ name: 'Half-Life', files: { 'cstrike/a.dem': [1, 1] } }, 'hl:snap'); s.put(true, 'hl:input'); s.put('handle', 'hl:handle'); t.oncomplete = res; }; })""")
    pg.reload(); pg.wait_for_timeout(800)
    r = row(pg)
    kept = pg.evaluate("""() => new Promise((res) => { const o = indexedDB.open('wallbang-viewer', 1); o.onsuccess = () => { const s = o.result.transaction('overviews').objectStore('overviews'), out = [];
      let n = 0; for (const k of ['hl:snap', 'hl:input', 'hl:handle']) { const q = s.get(k); q.onsuccess = () => { if (q.result !== undefined) out.push(k); if (++n === 3) res(out); }; } }; })""")
    check('B11 next visit: starts like the first, no folder name kept; what 0.26.10 kept (hl:snap, hl:input, hl:handle) deleted',
          r['title'] == 'Choose your Half-Life folder' and r['status'] == HELP and r['pick'] == 'Choose folder' and r['demo_off'] and not kept, (r, kept))
    pg.evaluate("""() => { const dt = new DataTransfer(); dt.items.add(new File([new Uint8Array(10)], 'x.dem')); document.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true })); }""")
    pg.wait_for_timeout(300); m = pg.inner_text('#msg')
    check('B12 dropping a demo with no folder chosen asks for the folder first', 'Choose your Half-Life folder first' in m, m)
    check('B13 no page errors, and the folder access never used', not errors and not pg.evaluate('window.__picked || 0'), errors)
    # B14, at 375 px wide no sideways scrolling, dropped 3 Nov 2026: phone width isn't checked (Sujan: no phone has a Half-Life folder)
    ctx.close(); shutil.rmtree(tmp)

    # ---- C: inside a frame from another site (like the claude.ai artifact) ----
    outer = tempfile.mkdtemp(); open(os.path.join(outer, 'frame.html'), 'w').write(f'<iframe src="{url}" style="width:1200px;height:760px;border:0"></iframe>')
    so = serve(outer); ctx = b.new_context(viewport={'width': 1280, 'height': 800}); pg = ctx.new_page(); setup(pg)
    pg.goto(f'http://localhost:{so.server_port}/frame.html'); pg.wait_for_timeout(1200)
    fr = pg.frames[1]; st = fr.evaluate("[document.getElementById('hlStatus').textContent, document.getElementById('hlPaths').hidden ? '' : document.getElementById('hlPaths').innerText]")
    check('C1 in a frame from another site: the same row, with the upload line', st[0] == HELP and UPLOAD in st[1], st)
    ctx.close(); shutil.rmtree(outer)
    b.close()

print(f'\n{sum(results)} of {len(results)} passed')
sys.exit(0 if all(results) else 1)
