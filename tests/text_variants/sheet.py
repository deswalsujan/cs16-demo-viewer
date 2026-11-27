"""The character sheet (Sujan, 28 Nov 2026, on #73): every printable character and the pairs that matter in player names,
each line in the viewer's text as built (R6, src/hud.js) and in plain smoothed browser Verdana (no edge cutting, the smear
setting closest to his game's weight: 0.75), in the feed's T red and CT blue (12.34 px, with their black shadow, on a
wall-coloured background) and the bars' orange (11 px, on the bar's dark), at actual size and at 3x nearest pixel.

Usage:  python3 sheet.py render DIR          (the tests' Python, with Playwright: ~/.venvs/cs16-tests)
        /usr/bin/python3 sheet.py compose DIR OUT.png   (the Mac's own Python, with Pillow)
Only the browser's own text drawing.
"""
import base64, io, json, os, sys

LINES = [('A to Z', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), ('a to z', 'abcdefghijklmnopqrstuvwxyz'), ('digits', '0123456789'),
         ('punctuation and symbols', ''.join(chr(c) for c in range(33, 127) if not chr(c).isalnum())), ('pairs in player names', 'Vi Vf il li rn m 1l O0 fi fl ff tt'),
         ('accented letters (extra)', 'éèêëàâäçïîôöüûñ ÉÀÖÜÅ')]
R6 = {'mode': 'build', 'efSize': 12.34}
PLAIN = {'mode': 'smooth', 'cut': 0, 'smear': True, 'smearAmt': 0.75, 'ls': 1, 'weight': 400, 'grid': False, 'efSize': 12.34}
WALL, BAR = (120, 116, 96), (30, 29, 25)
ROWS = [('R6', R6, 12.34, (255, 64, 64), True, WALL, 'T red, feed'), ('plain', PLAIN, 12.34, (255, 64, 64), True, WALL, 'T red, feed'),
        ('R6', R6, 12.34, (153, 204, 255), True, WALL, 'CT blue, feed'), ('plain', PLAIN, 12.34, (153, 204, 255), True, WALL, 'CT blue, feed'),
        ('R6', R6, 11, (255, 176, 0), False, BAR, 'orange, bars'), ('plain', PLAIN, 11, (255, 176, 0), False, BAR, 'orange, bars')]
D = sys.argv[2]
if sys.argv[1] == 'render':
    from playwright.sync_api import sync_playwright
    os.makedirs(D, exist_ok=True); index = []
    page = 'file://' + os.path.join(os.path.dirname(os.path.abspath(__file__)), 'variants.html')
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(); pg.goto(page)
        for li, (title, text) in enumerate(LINES):
            for ri, (kind, V, size, rgb, sh, bg, lab) in enumerate(ROWS):
                png = pg.evaluate('([V, z, c, s, bg, t]) => renderLine(V, z, c, s, bg, t)', [V, size, list(rgb), sh, list(bg), text])
                fn = f'line{li}_row{ri}.png'; open(os.path.join(D, fn), 'wb').write(base64.b64decode(png.split(',')[1]))
                index.append({'line': li, 'title': title, 'label': f'{"R6 (as built)" if kind == "R6" else "plain smoothed, smear 0.75"} · {lab} {size} px', 'file': fn})
        b.close()
    json.dump(index, open(os.path.join(D, 'index.json'), 'w')); print(len(index), 'lines rendered'); sys.exit(0)
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[3]
try:
    F = ImageFont.truetype('/System/Library/Fonts/Supplemental/Verdana.ttf', 15); FB = ImageFont.truetype('/System/Library/Fonts/Supplemental/Verdana Bold.ttf', 18)
except Exception:
    F = FB = ImageFont.load_default()
blocks = []
for li, (title, text) in enumerate(LINES):
    rows = [(e['label'], Image.open(os.path.join(D, e['file'])).convert('RGB')) for e in json.load(open(os.path.join(D, 'index.json'))) if e['line'] == li]
    blocks.append((title, text, rows))
LW = 330; W1 = max(im.width for _, _, rows in blocks for _, im in rows); W3 = W1 * 3
W = LW + W1 + 30 + W3 + 30
H = 70 + sum(40 + sum(im.height * 3 + 10 for _, im in rows) for _, _, rows in blocks)
sheet = Image.new('RGB', (W, H), (22, 24, 27)); d = ImageDraw.Draw(sheet)
d.text((12, 12), "Character sheet: the viewer's text as built (R6) against plain smoothed browser Verdana (no edge cutting, smear 0.75). Left: actual size (800x600). Right: 3x, nearest pixel.", font=FB, fill=(240, 236, 228))
y = 60
for title, text, rows in blocks:
    d.text((12, y + 8), title, font=FB, fill=(242, 184, 75)); y += 40
    for lab, im in rows:
        d.text((12, y + im.height * 3 // 2 - 9), lab, font=F, fill=(210, 206, 198))
        sheet.paste(im, (LW, y + im.height)); sheet.paste(im.resize((im.width * 3, im.height * 3), Image.NEAREST), (LW + W1 + 30, y))
        y += im.height * 3 + 10
sheet.save(out); print(sheet.size)
