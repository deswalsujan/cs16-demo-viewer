"""Measures the HUD text variants against Sujan's 800x600 shot, and checks the kill feed's icons and the HUD's colours
(Sujan's brief of 28 Nov 2026, on #73).

Usage:  /usr/bin/python3 analyse.py RENDER_DIR OUT_DIR     (needs Pillow and NumPy: the Mac's own Python has them, the
        tests' venv doesn't); HALF_LIFE_DIR for the kill feed icons (cstrike/sprites/hud.txt and its 640hud sheets).
RENDER_DIR is render.py's output. Writes OUT_DIR/report.md, OUT_DIR/text-variants-3x.png, OUT_DIR/icons-colours.png.

Like for like: his shot is a JPEG at quality 90 with the colour at half resolution (4:2:0; read from the file). His text
and icons are taken out of his shot (filled from the pixels around them), each variant's text and our icons are put on
that background where 0.28.0's layout puts them, and the result goes through the same JPEG (his file's own tables),
then both are measured the same way: a pixel is text when it's at least half way from the background to the text's
colour; per string the ink's width, where the letters part (columns with no ink), the parts' widths and the gaps, the
widths of the strokes across the middle rows of the letters, and how many pixels are ink.
"""
import io, json, os, struct, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.join(HERE, '..', '..')
RD, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
HL = os.path.expanduser(os.environ.get('HALF_LIFE_DIR', '~/code/cs16-data/Half-Life'))
HIS_P = os.path.join(REPO, 'docs', 'reference', 'zeus-r9', '800x600', '20261127163514_1.jpg')
his_im = Image.open(HIS_P)
QT = his_im.quantization
H = np.asarray(his_im.convert('RGB'), dtype=np.float32)
META = {m['spec']['id']: m for m in json.load(open(os.path.join(RD, 'variants.json')))}
A_ID = 'cut128s_ls1'  # what 0.28.0 does
LAY = META[A_ID]

def jpeg(arr):
    buf = io.BytesIO(); Image.fromarray(np.clip(np.rint(arr), 0, 255).astype(np.uint8)).save(buf, 'JPEG', qtables=QT, subsampling=2)
    buf.seek(0); return np.asarray(Image.open(buf).convert('RGB'), dtype=np.float32)

# ---------- the kill feed's icons from the player's files ----------
def find_ci(d, name):
    for f in os.listdir(d):
        if f.lower() == name.lower(): return os.path.join(d, f)
    return None
SPR = os.path.join(HL, 'cstrike', 'sprites')
rects = {}
for line in open(find_ci(SPR, 'hud.txt'), errors='replace').read().splitlines():
    f = line.split()
    if len(f) == 7 and f[1] == '640' and f[0].lower() in ('d_ak47', 'd_m4a1', 'd_headshot'):
        rects[f[0][2:].lower()] = (f[2].lower(), int(f[3]), int(f[4]), int(f[5]), int(f[6]))
def decode_spr(path):
    b = open(path, 'rb').read(); n = struct.unpack_from('<h', b, 40)[0]
    pal = np.frombuffer(b[42:42 + n * 3], dtype=np.uint8).reshape(n, 3).astype(np.float32); p = 42 + n * 3
    w, h = struct.unpack_from('<ii', b, p + 12); p += 20
    return w, h, n, pal, np.frombuffer(b[p:p + w * h], dtype=np.uint8).reshape(h, w)
ICON = {}
for k, (sheet, x, y, w, h) in rects.items():
    sw, sh, n, pal, px = decode_spr(find_ci(SPR, sheet + '.spr'))
    sub = px[y:y + h, x:x + w]
    rgb = np.where((sub < n)[..., None], pal[np.minimum(sub, n - 1)], 0) * np.array([255, 80, 0], np.float32) / 255
    ICON[k] = rgb  # added onto the picture
def lum(a): return a[..., 0] * 0.299 + a[..., 1] * 0.587 + a[..., 2] * 0.114

# his icons: our layout's place, moved to where his picture correlates best with the sprite (within 5 px)
HIS_ICONS = []
for ic in LAY['icons']:
    for name, x0 in ((ic['gun'], ic['gx']), ('headshot', ic['hx'])):
        if x0 is None: continue
        S = lum(ICON[name]); h, w = S.shape; best = None
        for dy in range(-2, 3):
            for dx in range(-5, 6):
                X, Y = x0 + dx, ic['top'] + dy; R = lum(H[Y:Y + h, X:X + w]); R = R - R.mean()
                sc = float((S * R).sum())
                if best is None or sc > best[0]: best = (sc, X, Y)
        HIS_ICONS.append({'row': ic['row'], 'name': name, 'x': best[1], 'y': best[2], 'ours': (x0, ic['top'])})

# ---------- his text out of his shot ----------
def box(s, pad=4):
    return max(0, s['inkL'] - pad), min(800, s['inkR'] + pad + 2), max(0, s['cap'] - 5), min(600, s['cap'] + 15)
def proj(img, bg, c):
    d = np.asarray(c, np.float32) - bg; n = (d * d).sum(-1); n = np.where(n < 1, 1, n)
    return ((img - bg) * d).sum(-1) / n
mask = np.zeros((600, 800), bool)
for s in LAY['strings']:
    x0, x1, y0, y1 = box(s, 5)
    reg = H[y0:y1, x0:x1]; med = np.median(reg.reshape(-1, 3), 0)
    t = proj(reg, med, s['rgb']) > 0.3
    m = np.zeros((600, 800), bool); m[y0:y1, x0:x1] = t
    if s['font'] == 'EF': m[1:, 1:] |= m[:-1, :-1]  # the shadow, 1 px right and down
    m2 = m.copy(); m2[1:] |= m[:-1]; m2[:-1] |= m[1:]; m2[:, 1:] |= m[:, :-1]; m2[:, :-1] |= m[:, 1:]
    mask |= m2
clean = H.copy()
ys, xs = np.nonzero(mask)
for y, x in zip(ys, xs):
    vals, wts = [], []
    xl = x - 1
    while xl >= 0 and mask[y, xl]: xl -= 1
    xr = x + 1
    while xr < 800 and mask[y, xr]: xr += 1
    if xl >= 0 and xr < 800: f = (x - xl) / (xr - xl); vals.append(H[y, xl] * (1 - f) + H[y, xr] * f); wts.append(1 / (xr - xl))
    yu = y - 1
    while yu >= 0 and mask[yu, x]: yu -= 1
    yd = y + 1
    while yd < 600 and mask[yd, x]: yd += 1
    if yu >= 0 and yd < 600 and not (yu < 80 <= yd) and not (yu < 520 <= yd): f = (y - yu) / (yd - yu); vals.append(H[yu, x] * (1 - f) + H[yd, x] * f); wts.append(1 / (yd - yu))
    if vals: clean[y, x] = sum(v * w for v, w in zip(vals, wts)) / sum(wts)
for ic in HIS_ICONS:  # his icons: filled down the columns from the rows just above and below (below only under the bar)
    h, w = ICON[ic['name']].shape[:2]; X, Y = ic['x'], ic['y']
    lo = clean[Y + h + 1, X - 1:X + w + 1]; hi = clean[Y - 2, X - 1:X + w + 1] if Y - 2 >= 80 else lo
    for j in range(-1, h + 1):
        f = (j + 2) / (h + 3); clean[Y + j, X - 1:X + w + 1] = hi * (1 - f) + lo * f

# ---------- composite a variant ----------
def layer(vid):
    a = np.asarray(Image.open(os.path.join(RD, vid + '.png')).convert('RGBA'), dtype=np.float32)
    return a[..., :3], a[..., 3:] / 255
def composite(text_ids, icon_model='sharp', icon_scale=1.0, base=None):
    img = (clean if base is None else base).copy()
    # EF strings (the feed, rows 75 to 500) from one render, DF strings (the bars) from another
    ef, df = text_ids if isinstance(text_ids, tuple) else (text_ids, text_ids)
    lay = META[ef]
    for ic in lay['icons']:
        for name, x0 in ((ic['gun'], ic['gx']), ('headshot', ic['hx'])):
            if x0 is None: continue
            h, w = ICON[name].shape[:2]; I = icon_filter(ICON[name], icon_model) * icon_scale
            img[ic['top'] - 1:ic['top'] + h + 1, x0 - 1:x0 + w + 1] = np.minimum(255, img[ic['top'] - 1:ic['top'] + h + 1, x0 - 1:x0 + w + 1] + I)
    for vid, rows in ((ef, slice(75, 500)), (df, slice(0, 75)), (df, slice(500, 600))):
        rgb, al = layer(vid)
        img[rows] = img[rows] * (1 - al[rows]) + rgb[rows] * al[rows]
    return img
def icon_filter(I, model):
    P = np.zeros((I.shape[0] + 2, I.shape[1] + 2, 3), np.float32); P[1:-1, 1:-1] = I
    if model == 'sharp': return P
    if model == 'half-pixel bilinear':  # a 1:1 draw half a pixel off: each pixel the average of 2x2
        Q = np.zeros_like(P); Q[1:, 1:] = (P[1:, 1:] + P[:-1, 1:] + P[1:, :-1] + P[:-1, :-1]) / 4; return Q
    k = {'blur 0.5 px': [0.13, 0.74, 0.13], 'blur 0.8 px': [0.22, 0.56, 0.22]}[model]
    Q = P * k[1]; Q[:, 1:] += P[:, :-1] * k[0]; Q[:, :-1] += P[:, 1:] * k[0]
    R = Q * k[1]; R[1:] += Q[:-1] * k[0]; R[:-1] += Q[1:] * k[0]
    return R

# ---------- measuring a string ----------
def measure(img, s, his_box=None):
    x0, x1, y0, y1 = his_box or box(s, 4)
    ys0, ys1 = max(y0, s['cap'] - 3), min(y1, s['cap'] + 13)
    reg, bg = img[ys0:ys1, x0:x1], clean[ys0:ys1, x0:x1]
    T = proj(reg, bg, s['rgb']) >= 0.5
    contrast = float(np.sqrt(((np.asarray(s['rgb'], np.float32) - bg) ** 2).sum(-1)).mean())
    cols = T.any(0)
    if not cols.any(): return None
    l, r = int(np.argmax(cols)), int(len(cols) - 1 - np.argmax(cols[::-1]))
    c = cols[l:r + 1]
    gaps, segs, i = [], [], 0
    while i < len(c):
        j = i
        while j < len(c) and c[j] == c[i]: j += 1
        (segs if c[i] else gaps).append((i, j - i)); i = j
    mid = T[(s['cap'] + 3) - ys0:(s['cap'] + 7) - ys0, l:r + 1]
    runs = []
    for row in mid:
        k = 0
        while k < len(row):
            if row[k]:
                e = k
                while e < len(row) and row[e]: e += 1
                runs.append(e - k); k = e
            else: k += 1
    return {'w': r - l + 1, 'gaps': gaps, 'segs': segs, 'runs': runs, 'ink': int(T[:, l:r + 1].sum()), 'contrast': contrast, 'x': (x0 + l, x0 + r)}

def compare(h, v):
    sc = h['w'] / v['w']
    hs = [g[0] + g[1] / 2 for g in h['gaps']]; vs = [(g[0] + g[1] / 2) * sc for g in v['gaps']]
    merged = sum(1 for p in hs if not any(abs(p - q) <= 1.01 for q in vs))
    extra = sum(1 for q in vs if not any(abs(p - q) <= 1.01 for p in hs))
    dseg = [abs(a[1] - b[1]) for a in h['segs'] for b in v['segs'] if abs(a[0] - b[0] * sc) <= 1.01]
    return {'dw': v['w'] - h['w'], 'merged': merged, 'extra': extra, 'nsep': len(hs), 'dseg': dseg}
def hist(runs):
    b = np.array([sum(1 for r in runs if r == 1), sum(1 for r in runs if r == 2), sum(1 for r in runs if r == 3), sum(1 for r in runs if r == 4), sum(1 for r in runs if r >= 5)], np.float32)
    return b / max(1, b.sum())

HISM = {}
for s in LAY['strings']:
    m = measure(H, s, box(s, 5))
    key = (s['str'], s['cap'])
    if m and m['contrast'] >= 70: HISM[key] = m
def score(vid_ef, vid_df=None):
    """The variant against his shot, per font: EF from vid_ef's render, DF from vid_df's."""
    vid_df = vid_df or vid_ef
    img = jpeg(composite((vid_ef, vid_df)))
    res = {}
    for font, vid in (('EF', vid_ef), ('DF', vid_df)):
        agg = {'dw': [], 'merged': 0, 'extra': 0, 'nsep': 0, 'dseg': [], 'runs_h': [], 'runs_v': [], 'ink_h': 0, 'ink_v': 0, 'gap_h': [], 'gap_v': [], 'strings': 0}
        for s in META[vid]['strings']:
            if s['font'] != font: continue
            h = HISM.get((s['str'], s['cap']))
            if not h: continue
            v = measure(img, s)
            if not v: continue
            c = compare(h, v)
            agg['dw'].append(c['dw']); agg['merged'] += c['merged']; agg['extra'] += c['extra']; agg['nsep'] += c['nsep']; agg['dseg'] += c['dseg']
            agg['runs_h'] += h['runs']; agg['runs_v'] += v['runs']; agg['ink_h'] += h['ink']; agg['ink_v'] += v['ink']
            agg['gap_h'] += [g[1] for g in h['gaps'] if g[1] < 3]; agg['gap_v'] += [g[1] for g in v['gaps'] if g[1] < 3]; agg['strings'] += 1
        hh, hv = hist(agg['runs_h']), hist(agg['runs_v'])
        res[font] = {'strings': agg['strings'], 'width_px': float(np.mean(np.abs(agg['dw']))) if agg['dw'] else None, 'width_signed': float(np.mean(agg['dw'])) if agg['dw'] else None,
                     'width_pct': None, 'merged': agg['merged'], 'extra': agg['extra'], 'seps': agg['nsep'],
                     'letter_px': float(np.mean(agg['dseg'])) if agg['dseg'] else None,
                     'gap_his': float(np.mean(agg['gap_h'])) if agg['gap_h'] else None, 'gap_var': float(np.mean(agg['gap_v'])) if agg['gap_v'] else None,
                     'stroke_his': float(np.mean([r for r in agg['runs_h'] if r <= 4])), 'stroke_var': float(np.mean([r for r in agg['runs_v'] if r <= 4])) if agg['runs_v'] else None,
                     'stroke_hist_l1': float(np.abs(hh - hv).sum()), 'hist_his': hh.round(2).tolist(), 'hist_var': hv.round(2).tolist(),
                     'ink': agg['ink_v'] / max(1, agg['ink_h'])}
        widths_h = [HISM[(s['str'], s['cap'])]['w'] for s in META[vid]['strings'] if s['font'] == font and (s['str'], s['cap']) in HISM]
        if widths_h: res[font]['width_pct'] = 100 * res[font]['width_signed'] / float(np.mean(widths_h))
    return res, img

# ---------- every variant, the best letter spacing per family ----------
def family(vid): return vid.rsplit('_ls', 1)[0]
fams = {}
for vid in META: fams.setdefault(family(vid), []).append(vid)
results = {}
for vid in META: results[vid] = score(vid)[0]
def pick(fam, font):
    c = [v for v in fams[fam] if results[v][font]['width_px'] is not None]
    return min(c, key=lambda v: (results[v][font]['width_px'], results[v][font]['merged']))
def badness(r):  # for ordering the table only
    return r['merged'] + r['extra'] + 2 * r['width_px'] + 10 * r['stroke_hist_l1'] + 20 * abs(r['ink'] - 1)
best = {}
for fam in fams:
    best[fam] = {'EF': pick(fam, 'EF'), 'DF': pick(fam, 'DF')}

def row(name, ef, df):
    r = score(ef, df)[0]
    return name, ef, df, r
def fmt(x, d=1): return '' if x is None else (f'{x:+.{d}f}' if isinstance(x, float) and d < 0 else f'{x:.{d}f}')
lines = ['# HUD text variants against Sujan\'s 800x600 shot', '', 'Generated by `tests/text_variants/analyse.py` from `render.py`\'s output. EF: the kill feed\'s names (EngineFont, 12 px, ' + str(results[A_ID]['EF']['strings']) + ' strings with enough contrast against their background); DF: the bars\' text (Default, 11 px, ' + str(results[A_ID]['DF']['strings']) + ' strings). Each figure is the variant against his shot, both measured after the same JPEG.', '',
         '- width: mean of |ink width - his| per string, px (and the mean signed difference as % of his width)',
         '- parts merged: places where his letters part (a column with no ink) and the variant\'s don\'t, of how many; split: places the variant parts and his don\'t',
         '- letter: mean |width - his| of the parts (letters) that start where his do, px',
         '- gap: mean width of the 1-2 px gaps between letters, his then the variant\'s',
         '- stroke: mean width of the strokes (runs of ink up to 4 px) across the middle rows, his then the variant\'s; mix: how far the share of 1, 2, 3, 4 and 5+ px runs is from his (0 the same, 2 nothing alike)',
         '- ink: ink pixels against his (1.00 the same; above 1 heavier)', '',
         '| Variant | font | letter spacing | width px (%) | parts merged / of | split | letter px | gap his / var | stroke his / var | mix | ink |', '|---|---|---|---|---|---|---|---|---|---|---|']
def table_rows(name, ids):
    out = []
    for font in ('EF', 'DF'):
        vid = ids[font] if isinstance(ids, dict) else ids
        r = results[vid][font]
        out.append(f"| {name} | {font} | {META[vid]['spec']['ls']} | {r['width_px']:.1f} ({r['width_pct']:+.1f}%) | {r['merged']} / {r['seps']} | {r['extra']} | {fmt(r['letter_px'], 2)} | {r['gap_his']:.2f} / {fmt(r['gap_var'], 2)} | {r['stroke_his']:.2f} / {fmt(r['stroke_var'], 2)} | {r['stroke_hist_l1']:.2f} | {r['ink']:.2f} |")
    return out
SHOW = [('a) 0.28.0: cut at 128, smear, 1 px', A_ID),
        ('b1) smoothed, no smear, 1 px', 'smooth_ls1'), ('b2) smoothed, smear, 1 px', 'smoothS_ls1'.replace('S', 's')),
        ('b1*) smoothed, no smear, spacing fitted', best['smooth']), ('b2*) smoothed, smear, spacing fitted', best['smooths']),
        ('b3*) Verdana Bold, smoothed, spacing fitted (extra)', best['smoothB']),
        ('c1) 4x, cut at 128 there, shrunk, no smear, 1 px', 'ss4cut128_ls1'), ('c2) 4x, cut, smear, shrunk, 1 px', 'ss4cut128s_ls1'),
        ('c1*) the same, spacing fitted', best['ss4cut128']), ('c2*) the same, spacing fitted', best['ss4cut128s'])]
for cut in (64, 96, 128, 160, 192):
    for sm in ('', 's'):
        SHOW.append((f'd) cut at {cut}{", smear" if sm else ", no smear"}, spacing fitted', best[f'cut{cut}{sm}']))
for fam in sorted(f for f in fams if f.endswith('g')):
    SHOW.append((f'e) letters on whole pixels: {fam[:-1]} (extra)', best[fam]))
for fam in sorted(f for f in fams if ('_b' in f or '_e' in f or f in ('cut208sg', 'cut224sg', 'cut240sg') or f.startswith('area')) and fams[f]):
    base, how = fam.split('_', 1) if '_' in fam else (fam, 'e12')
    lab = f"each letter keeps {base[4:-1]} x its coverage, smear" if base.startswith('area') else base[:-1]
    SHOW.append((f"e+) {lab}, letters on whole pixels, " + (f"each advance rounded after adding {how[1:]}" if how[0] == 'b' else f"the feed at {how[1:]} px") + ' (extra)', best[fam]))
for name, ids in SHOW: lines += table_rows(name, ids)
# the five best by the ordering
ranked = sorted(((badness(results[best[f]['EF']]['EF']) + badness(results[best[f]['DF']]['DF']), f) for f in fams))
lines += ['', 'Ordered by merged + split + 2 x width + 10 x mix + 20 x |ink - 1| (both fonts), the first ten families: ' + ', '.join(f'{f} ({b:.1f})' for b, f in ranked[:10])]

# ---------- the 3x image ----------
try:
    F = ImageFont.truetype('/System/Library/Fonts/Supplemental/Verdana.ttf', 15); FB = ImageFont.truetype('/System/Library/Fonts/Supplemental/Verdana Bold.ttf', 17)
except Exception:
    F = FB = ImageFont.load_default()
CROP = (420, 8, 800, 156)
def tile(img, label, sub=''):
    c = Image.fromarray(np.clip(np.rint(img), 0, 255).astype(np.uint8)).crop(CROP)
    c = c.resize((c.width * 3, c.height * 3), Image.NEAREST)
    t = Image.new('RGB', (c.width, c.height + 44), (22, 24, 27)); d = ImageDraw.Draw(t)
    d.text((4, 2), label, font=FB, fill=(240, 236, 228)); d.text((4, 23), sub, font=F, fill=(190, 186, 178)); t.paste(c, (0, 44))
    return t
def subline(ids):
    ef = ids['EF'] if isinstance(ids, dict) else ids; df = ids['DF'] if isinstance(ids, dict) else ids
    re_, rd = results[ef]['EF'], results[df]['DF']
    return f"feed: width {re_['width_px']:.1f} px, merged {re_['merged']}/{re_['seps']}, stroke {re_['stroke_var']:.2f} (his {re_['stroke_his']:.2f}), ink {re_['ink']:.2f}   bars: width {rd['width_px']:.1f}, merged {rd['merged']}/{rd['seps']}, ink {rd['ink']:.2f}"
tiles = [tile(H, "Sujan's game (his JPEG)", 'the clock is stale (0:42); the icons over the sky are his')]
# the combinations proposed: the bars' 11 px text and the feed's 12 px text each with its best settings
COMBOS = [('R1) feed: whole pixels, cut 208, smear, 12.34 px; bars: whole pixels, cut 192, smear', {'EF': 'cut208sg_e12.34_ls1', 'DF': 'cut192sg_ls1'}),
          ('R2) feed: whole pixels, cut 224, smear, 12.5 px; bars: whole pixels, cut 192, smear', {'EF': 'cut224sg_e12.5_ls1', 'DF': 'cut192sg_ls1'}),
          ('R3) feed: whole pixels, 4x cut, smear, shrunk, 12.34 px; bars: whole pixels, cut 192, smear', {'EF': 'ss4cut128sg_e12.34_ls1', 'DF': 'cut192sg_ls1'}),
          ('R4) feed and bars: each letter keeps 1.0 x its coverage, smear, whole pixels; feed 12.34 px', {'EF': 'area1.0s_e12.34_ls1', 'DF': 'area1.0s_e12.34_ls1'}),
          ('R5) feed and bars: each letter keeps 0.9 x its coverage, smear, whole pixels; feed 12.34 px', {'EF': 'area0.9s_e12.34_ls1', 'DF': 'area0.9s_e12.34_ls1'}),
          ('R6) feed and bars: each letter keeps 0.8 x its coverage, smear, whole pixels; feed 12.34 px', {'EF': 'area0.8s_e12.34_ls1', 'DF': 'area0.8s_e12.34_ls1'}),
          ('R6 as built: each part of a letter keeps 0.8 x its coverage, no bumps, gap rows kept, marks no wider than their stroke', {'EF': 'build_e12.34_ls1', 'DF': 'build_e12.34_ls1'})]
PLAIN = [(f'plain smoothed, smear {amt}, feed 12.34 px', {'EF': f'plain_m{amt}_e12.34_ls1', 'DF': f'plain_m{amt}_e12.34_ls1'}) for amt in (0, 0.25, 0.5, 0.75, 1)]
lines += ['', '### Plain smoothed text (no edge cutting), by smear', '', lines[lines.index(next(l for l in lines if l.startswith('| Variant |')))], '|---|---|---|---|---|---|---|---|---|---|---|']
for name, ids in PLAIN: lines += table_rows(name, ids)
lines += ['', '### The combinations proposed', '', lines[lines.index(next(l for l in lines if l.startswith('| Variant |')))], '|---|---|---|---|---|---|---|---|---|---|---|']
for name, ids in COMBOS: lines += table_rows(name, ids)
PICK = [SHOW[0], SHOW[1], SHOW[2], SHOW[6], SHOW[7]] + [s_ for s_ in SHOW if s_[0] in ('d) cut at 128, no smear, spacing fitted', 'd) cut at 192, no smear, spacing fitted', 'd) cut at 160, smear, spacing fitted', 'd) cut at 192, smear, spacing fitted')] + [s_ for s_ in SHOW if s_[0] == 'e) letters on whole pixels: cut192s (extra)'] + [COMBOS[0], COMBOS[5], COMBOS[6]]
for name, ids in PICK:
    ef = ids['EF'] if isinstance(ids, dict) else ids; df = ids['DF'] if isinstance(ids, dict) else ids
    sp = f" (spacing feed {META[ef]['spec']['ls']}, bars {META[df]['spec']['ls']})" if isinstance(ids, dict) else ''
    tiles.append(tile(jpeg(composite((ef, df))), name + sp, subline(ids)))
cols = 2; tw, th = tiles[0].width, tiles[0].height
sheet = Image.new('RGB', (cols * tw + 30, ((len(tiles) + cols - 1) // cols) * (th + 16) + 60), (22, 24, 27)); d = ImageDraw.Draw(sheet)
d.text((10, 10), "The top right at 3x, nearest pixel. Every variant drawn on his background with our icons, then through his JPEG's own compression", font=FB, fill=(240, 236, 228))
for i, t in enumerate(tiles): sheet.paste(t, (10 + (i % cols) * (tw + 10), 50 + (i // cols) * (th + 16)))
sheet.save(os.path.join(OUT, 'text-variants-3x.png'))

# ---------- the icons: does the game smooth them? ----------
lines += ['', '## The kill feed\'s icons', '', 'His icons found where his picture matches the sprite best: ' + ', '.join(f"row {i['row'] + 1} {i['name']} at {i['x']},{i['y']} (ours {i['ours'][0]},{i['ours'][1]})" for i in HIS_ICONS), '',
          'Each model: the sprite added onto his background (his icons taken out) at his icon\'s place, through his JPEG, against his pixels in the icon\'s box (RMS of the difference, 0 to 255; lower is closer). Rows 1 and 2 lie over the bright sky, rows 3 and 4 over walls.', '',
          '| Icon | sharp | half-pixel bilinear | blur 0.5 px | blur 0.8 px | sharp at 80% | sharp at 120% |', '|---|---|---|---|---|---|---|']
MODELS = [('sharp', 1.0), ('half-pixel bilinear', 1.0), ('blur 0.5 px', 1.0), ('blur 0.8 px', 1.0), ('sharp', 0.8), ('sharp', 1.2)]
icon_tiles = []
for ic in HIS_ICONS:
    I0 = ICON[ic['name']]; h, w = I0.shape[:2]; X, Y = ic['x'], ic['y']
    rms = []
    for model, k in MODELS:
        img = clean.copy(); I = icon_filter(I0, model) * k
        img[Y - 1:Y + h + 1, X - 1:X + w + 1] = np.minimum(255, img[Y - 1:Y + h + 1, X - 1:X + w + 1] + I)
        j = jpeg(img); rms.append(float(np.sqrt(((j[Y:Y + h, X:X + w] - H[Y:Y + h, X:X + w]) ** 2).mean())))
        if model == 'sharp' and k == 1.0: sharp_img = j
        if model == 'half-pixel bilinear': soft_img = j
    lines.append(f"| row {ic['row'] + 1} {ic['name']} | " + ' | '.join(f'{v:.1f}' for v in rms) + ' |')
    pad = 3; bx = (X - pad, Y - pad, X + w + pad, Y + h + pad)
    z = lambda a: Image.fromarray(np.clip(np.rint(a), 0, 255).astype(np.uint8)).crop(bx).resize(((w + 2 * pad) * 8, (h + 2 * pad) * 8), Image.NEAREST)
    icon_tiles.append((f"row {ic['row'] + 1} {ic['name']}", z(H), z(sharp_img), z(soft_img)))

def kern(sig, sh):
    if sig < 0.05:  # a shift alone: linear interpolation
        f = abs(sh); return {0: 1 - f, (1 if sh > 0 else -1): f} if f else {0: 1.0}
    ks = {i: float(np.exp(-((i - sh) ** 2) / (2 * sig * sig))) for i in range(-3, 4)}; t = sum(ks.values()); return {i: v / t for i, v in ks.items()}
def blur(I, sig, sx, sy):
    P = np.zeros((I.shape[0] + 6, I.shape[1] + 6, 3), np.float32); P[3:-3, 3:-3] = I
    Q = np.zeros_like(P)
    for i, v in kern(sig, sx).items(): Q += np.roll(P, i, axis=1) * v
    R = np.zeros_like(P)
    for i, v in kern(sig, sy).items(): R += np.roll(Q, i, axis=0) * v
    return R
lines += ['', 'A finer scan: the sprite blurred by a Gaussian of each width (0 = sharp), at the best of 9 sub-pixel offsets (0 or half a pixel either way), RMS against his pixels in the icon\'s box, after his JPEG:', '',
          '| Icon | ' + ' | '.join(f'{g:.1f}' for g in (0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2)) + ' | best |', '|---|' + '---|' * 8]
for ic in HIS_ICONS:
    I0 = ICON[ic['name']]; h, w = I0.shape[:2]; X, Y = ic['x'], ic['y']; vals = []
    for sig in (0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2):
        bestv = None
        for sx in (-0.5, 0, 0.5):
            for sy in (-0.5, 0, 0.5):
                img = clean.copy(); B = blur(I0, sig, sx, sy)
                img[Y - 3:Y + h + 3, X - 3:X + w + 3] = np.minimum(255, img[Y - 3:Y + h + 3, X - 3:X + w + 3] + B)
                j = jpeg(img); v = float(np.sqrt(((j[Y:Y + h, X:X + w] - H[Y:Y + h, X:X + w]) ** 2).mean()))
                bestv = v if bestv is None else min(bestv, v)
        vals.append(bestv)
    k = int(np.argmin(vals))
    lines.append(f"| row {ic['row'] + 1} {ic['name']} | " + ' | '.join(f'{v:.1f}' for v in vals) + f" | {(0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2)[k]:.1f} |")

# ---------- the colours ----------
def sat_fifth(img, msk):
    p = img[msk]
    if not len(p): return None
    s = p.max(1) - p.min(1); k = max(1, len(p) // 5)
    return p[np.argsort(-s)[:k]].mean(0)
def group_masks(img, ids):
    out = {'T names (feed)': np.zeros((600, 800), bool), 'CT names (feed)': np.zeros((600, 800), bool), 'bars (BaseText)': np.zeros((600, 800), bool), 'bottom name (T)': np.zeros((600, 800), bool)}
    for s in META[ids]['strings']:
        key = (s['str'], s['cap'])
        if key not in HISM: continue
        x0, x1, y0, y1 = box(s, 4)
        T = proj(img[y0:y1, x0:x1], clean[y0:y1, x0:x1], s['rgb']) >= 0.5
        g = 'bars (BaseText)' if s['region'] == 'top' else 'bottom name (T)' if s['region'] == 'bottom' else ('T names (feed)' if s['rgb'][0] == 255 else 'CT names (feed)')
        out[g][y0:y1, x0:x1] |= T
    return out
CANDS = [COMBOS[5], COMBOS[6]]
cand_imgs = [(n, jpeg(composite((i['EF'], i['DF']) if isinstance(i, dict) else i)), i) for n, i in CANDS]
ours_a = jpeg(composite(A_ID))
gh, go = group_masks(H, A_ID), group_masks(ours_a, A_ID)
lines += ['', '## Colours', '', 'The most saturated fifth of each group\'s text pixels (the way the earlier mockup measured them), his shot against 0.28.0 put through his JPEG, and what 0.28.0 draws. Then the 1920x1440 shots of the same moment, whose strokes are 2 to 4 px wide, so their middles keep their colour through the JPEG.', '',
          '| Group | his 800x600 | 0.28.0 through his JPEG | 0.28.0 draws | ' + ' | '.join(n[:2] + ', through his JPEG' for n, _ in CANDS) + ' |', '|---|---|---|---|' + '---|' * len(CANDS)]
DRAWN = {'T names (feed)': (255, 64, 64), 'CT names (feed)': (153, 204, 255), 'bars (BaseText)': (255, 176, 0), 'bottom name (T)': (255, 64, 64)}
colour_rows = []
for g in gh:
    a, b = sat_fifth(H, gh[g]), sat_fifth(ours_a, go[g])
    if a is None or b is None: continue
    colour_rows.append((g, a, b, DRAWN[g]))
    extra_c = []
    for n, im_, ids in cand_imgs:
        ef = ids['EF'] if isinstance(ids, dict) else ids
        cc = sat_fifth(im_, group_masks(im_, ef)[g]); extra_c.append(' '.join(str(int(round(v))) for v in cc) if cc is not None else '')
    lines.append(f"| {g} | {' '.join(str(int(round(v))) for v in a)} | {' '.join(str(int(round(v))) for v in b)} | {' '.join(map(str, DRAWN[g]))} | " + ' | '.join(extra_c) + ' |')
# 1920x1440: text pixels by colour family in boxes of the top right (the first shot of the set)
B19 = np.asarray(Image.open(os.path.join(REPO, 'docs', 'reference', 'zeus-r9', '1920x1440', '20261127163200_1.jpg')).convert('RGB'), dtype=np.float32)
fam = {'bars (BaseText)': ((1440, 30, 1900, 120), lambda p: (p[..., 0] > 150) & (p[..., 1] > 90) & (p[..., 1] < 210) & (p[..., 2] < 90)),
       'T names (feed)': ((1250, 190, 1900, 370), lambda p: (p[..., 0] > 150) & (p[..., 1] < 120) & (p[..., 2] < 120) & (np.abs(p[..., 1] - p[..., 2]) < 40)),
       'CT names (feed)': ((1450, 190, 1900, 370), lambda p: (p[..., 2] > 200) & (p[..., 1] > 170) & (p[..., 0] > 110) & (p[..., 0] < 210) & (p[..., 2] - p[..., 0] > 40))}
lines += ['', '| Group | his 1920x1440 (shot 163200, the most saturated fifth) | pixels |', '|---|---|---|']
for g, ((x0, y0, x1, y1), f) in fam.items():
    reg = B19[y0:y1, x0:x1]; m = f(reg); c = sat_fifth(reg, m)
    if c is not None: lines.append(f"| {g} | {' '.join(str(int(round(v))) for v in c)} | {int(m.sum())} |")

# icons and colours image
z = 8; parts = []
for name, a, b, c in icon_tiles:
    t = Image.new('RGB', (a.width * 3 + 40, a.height + 30), (22, 24, 27)); d = ImageDraw.Draw(t)
    d.text((0, 2), f'{name}: his | ours sharp, through his JPEG | ours half-pixel bilinear, through his JPEG', font=F, fill=(220, 216, 208))
    t.paste(a, (0, 28)); t.paste(b, (a.width + 20, 28)); t.paste(c, (2 * a.width + 40, 28)); parts.append(t)
sw = Image.new('RGB', (1500, 60 + 50 * len(colour_rows)), (22, 24, 27)); d = ImageDraw.Draw(sw)
d.text((0, 4), 'Colours (the most saturated fifth): his 800x600 | 0.28.0 through his JPEG | what 0.28.0 draws', font=FB, fill=(240, 236, 228))
for i, (g, a, b, c) in enumerate(colour_rows):
    y = 40 + 50 * i; d.text((0, y + 10), g, font=F, fill=(220, 216, 208))
    for j, col in enumerate((a, b, c)):
        d.rectangle((300 + j * 260, y, 300 + j * 260 + 120, y + 40), fill=tuple(int(round(v)) for v in col)); d.text((300 + j * 260 + 128, y + 10), ' '.join(str(int(round(v))) for v in col), font=F, fill=(220, 216, 208))
parts.append(sw)
W = max(p.width for p in parts) + 20; Hh = sum(p.height + 20 for p in parts) + 20
img = Image.new('RGB', (W, Hh), (22, 24, 27)); y = 10
for p in parts: img.paste(p, (10, y)); y += p.height + 20
img.save(os.path.join(OUT, 'icons-colours.png'))
Image.fromarray(np.clip(np.rint(clean), 0, 255).astype(np.uint8)).crop(CROP).resize(((CROP[2] - CROP[0]) * 3, (CROP[3] - CROP[1]) * 3), Image.NEAREST).save(os.path.join(OUT, 'his-background-3x.png'))
open(os.path.join(OUT, 'report.md'), 'w').write('\n'.join(lines) + '\n')
print('\n'.join(lines))
