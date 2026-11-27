"""Renders every HUD text variant of variants.html in headless Chromium (Sujan's brief of 28 Nov 2026, on #73).

Usage:  python3 render.py OUT_DIR      (the tests' Python, with Playwright: ~/.venvs/cs16-tests on Sujan's Mac)
Writes OUT_DIR/<id>.png (the text layer, 800x600, transparent) and OUT_DIR/variants.json (each variant's spec, where each
string and icon went). analyse.py then measures them against Sujan's 800x600 shot. Only the browser's own text drawing.
"""
import base64, json, os, sys
from playwright.sync_api import sync_playwright

out = sys.argv[1]
os.makedirs(out, exist_ok=True)
page = 'file://' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'variants.html')

def specs():
    LS = (0, 0.5, 1, 1.5, 2)
    for grid in (False, True):
        g = 'g' if grid else ''
        for cut in (64, 96, 128, 160, 192):
            for smear in (False, True):
                for ls in LS: yield {'id': f'cut{cut}{"s" if smear else ""}{g}_ls{ls}', 'mode': 'cut', 'cut': cut, 'smear': smear, 'ls': ls, 'weight': 400, 'grid': grid}
        for weight in (400, 700):
            for smear in (False, True):
                for ls in ((-1, -0.5) if weight == 700 else ()) + LS:
                    yield {'id': f'smooth{"" if weight == 400 else "B"}{"s" if smear else ""}{g}_ls{ls}', 'mode': 'smooth', 'cut': 0, 'smear': smear, 'ls': ls, 'weight': weight, 'grid': grid}
        for cut in (96, 128, 160):
            for smear in (False, True):
                for ls in LS: yield {'id': f'ss4cut{cut}{"s" if smear else ""}{g}_ls{ls}', 'mode': 'ss4', 'cut': cut, 'smear': smear, 'ls': ls, 'weight': 400, 'grid': grid}

def extra():
    # the kill feed's letters: each advance rounded up a little (Windows' hinted widths at 12 px), or the size the
    # scheme's height gives (EngineFont tall 15: 15 / 1.2153 = 12.34 px per em)
    for base in (('ss4cut128s', 'ss4', 128), ('ss4cut160s', 'ss4', 160), ('cut192s', 'cut', 192)):
        for bias in (0.2, 0.3, 0.4, 0.5):
            yield {'id': f'{base[0]}g_b{bias}_ls1', 'mode': base[1], 'cut': base[2], 'smear': True, 'ls': 1, 'weight': 400, 'grid': True, 'bias': bias}
        for size in (12.34, 12.5):
            yield {'id': f'{base[0]}g_e{size}_ls1', 'mode': base[1], 'cut': base[2], 'smear': True, 'ls': 1, 'weight': 400, 'grid': True, 'efSize': size}
    # the kill feed's 12 px letters cut harder, so their stems come out 1 px before the smear
    for cut in (208, 224, 240):
        for size in (12, 12.34, 12.5):
            yield {'id': f'cut{cut}sg' + ('' if size == 12 else f'_e{size}') + '_ls1', 'mode': 'cut', 'cut': cut, 'smear': True, 'ls': 1, 'weight': 400, 'grid': True, 'efSize': size}

def extra2():
    for f in (0.8, 0.9, 1.0, 1.1):
        for size in (12, 12.34):
            yield {'id': f'area{f}s' + ('' if size == 12 else f'_e{size}') + '_ls1', 'mode': 'area', 'area': f, 'cut': 0, 'smear': True, 'ls': 1, 'weight': 400, 'grid': True, 'efSize': size}

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 800, 'height': 600}, device_scale_factor=1)
    pg.goto(page)
    meta = []
    for s in list(specs()) + list(extra()) + list(extra2()):
        r = pg.evaluate('(s) => renderVariant(s)', s)
        open(os.path.join(out, s['id'] + '.png'), 'wb').write(base64.b64decode(r['png'].split(',')[1]))
        meta.append({'spec': s, 'strings': r['strings'], 'icons': r['icons'], 'caps': r['caps']})
    json.dump(meta, open(os.path.join(out, 'variants.json'), 'w'))
    # every printable character's ink for the candidates, against the smoothed drawing's: which ones lose their thin parts
    ink = {}
    for vid, s in (('smooth', {'mode': 'smooth', 'cut': 0, 'smear': False, 'ls': 1, 'weight': 400, 'grid': True}),
                   ('cut192sg', {'mode': 'cut', 'cut': 192, 'smear': False, 'ls': 1, 'weight': 400, 'grid': True}),
                   ('cut208sg', {'mode': 'cut', 'cut': 208, 'smear': False, 'ls': 1, 'weight': 400, 'grid': True}),
                   ('cut224sg', {'mode': 'cut', 'cut': 224, 'smear': False, 'ls': 1, 'weight': 400, 'grid': True}),
                   ('area0.9', {'mode': 'area', 'area': 0.9, 'cut': 0, 'smear': False, 'ls': 1, 'weight': 400, 'grid': True}),
                   ('area1.0', {'mode': 'area', 'area': 1.0, 'cut': 0, 'smear': False, 'ls': 1, 'weight': 400, 'grid': True})):
        ink[vid] = {str(sz): pg.evaluate('([s, z]) => glyphInk(s, z)', [s, sz]) for sz in (11, 12, 12.34)}
    json.dump(ink, open(os.path.join(out, 'glyph_ink.json'), 'w'))
    print(len(meta), 'variants rendered into', out)
    b.close()
