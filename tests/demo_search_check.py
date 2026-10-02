"""Checks the search box over the demo list on the start screen (0.15.2).

Usage: HALF_LIFE_DIR=/path/to/Half-Life python3 demo_search_check.py [page.html] [screenshot.png]
Needs the Half-Life folder (for its demos), not maps or sounds. Under a minute.
"""
import os, sys, http.server, functools, threading
from playwright.sync_api import sync_playwright

page_path = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'index.html'))
shot = sys.argv[2] if len(sys.argv) > 2 else None
HL = os.environ['HALF_LIFE_DIR']
here = os.path.dirname(os.path.abspath(__file__))
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=os.path.dirname(page_path)); h.log_message = lambda *a: None
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
names = sorted(f for f in os.listdir(os.path.join(HL, 'cstrike')) if f.lower().endswith('.dem'))
fails = []
def check(label, ok, extra=''):
    print(('PASS ' if ok else 'FAIL ') + label + (f'  ({extra})' if extra else ''))
    if not ok: fails.append(label)

with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 880, 'height': 1300})
    pg.route('**/three.min.js', lambda r: r.fulfill(path=os.environ.get('THREE_JS', os.path.join(here, 'three.min.js')), content_type='application/javascript'))
    pg.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))
    pg.goto(f'http://127.0.0.1:{srv.server_port}/{os.path.basename(page_path)}')
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
    pg.fill('#demoQ', 'sk train'); pg.click('#demoList button')
    pg.wait_for_function('() => document.getElementById("load").hidden', timeout=120000)
    check('a filtered row opens its demo', True)
    b.close()
print(f'{len(fails)} failed' if fails else 'all passed')
sys.exit(1 if fails else 0)
