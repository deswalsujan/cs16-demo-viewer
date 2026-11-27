# The HUD's text, icons and colours against Sujan's 800x600 shot (28 Nov 2026, on #73)

Sujan's brief of 28 Nov 2026, on #73's 3x comparison (`screenshots/0.28.0`, `0.28.0-compare-3x.png`): don't merge #73 yet; 0.28.0's text looks broken next to the game's (uneven strokes, letters merging in "Counter-Terrorists", "ceh9", "markeloff", heavier); make a test page outside the build comparing ways of drawing it with the browser's own text drawing only (no FreeType, no fonts read from the computer, no permission prompt, no new dependency): a) 0.28.0, b) smoothed, no cut, with and without the smear, c) drawn at 4x, cut there, shrunk, d) cut levels with and without the smear, letter spacing fitted to the game's widths; with how far strokes, letter widths and spacing are from the game's; check the kill feed's icons (soft and washed out over the sky in his shot) and the colours (ours brighter) against his shot and match them; image and recommendation before the build changes. Nothing in the build changed; the release checks never started.

## How it was measured

`tests/text_variants/`: `variants.html` (the test page) draws the top bar, the bottom name and the four kill feed rows at 0.28.0's places; `render.py` renders 243 variants in headless Chromium; `analyse.py` (Pillow and NumPy, the Mac's own Python) takes his text and icons out of his shot (filled from the pixels around them), puts each variant and our icons on his background, runs it through his JPEG's own compression (quality 90, colour at half resolution, 4:2:0, read from his file), and measures both the same way. The bars' text sits on a plain dark bar, so its figures are clean; the kill feed's names sit on textured walls, so their "merged" counts carry noise (even the best variants show 40-odd there), and a second count is taken on each variant's own lossless letters: how many neighbouring letters touch.

## Findings

- **Text.** 0.28.0's letters sit at fractional places, so each letter's strokes land on the pixel grid differently (some 2 px wide, some 3), and the cut at half plus the 1-px smear thickens strokes that are already 2 px: strokes 2.72 px in the feed and 2.52 in the bars against the game's 2.15, 1.20 times the game's ink, 15 of 108 feed letters and 14 of 72 bar letters touching their neighbour. Without the smear (b1, d without smear) it's too thin (ink 0.47 to 0.88): the game's weight-600 text really is 1 px bolder. The fix is letters on whole pixels (each letter drawn on its own, its advance rounded) with the right amount of ink before the smear.
- **4x, cut, shrunk** (c): without the smear too thin (feed ink 0.46); with it (c2) the weight is right (ink 0.96, strokes 2.31) but the bars' letters still merge (25 of 58), since the letters stay at fractional places. Smoothed with the smear (b2) is as heavy as 0.28.0 (ink 1.12, 15 of 108 feed letters touching).
- **Widths.** At 11 px (bars) whole-pixel letters with 1 px between them give the game's widths within 0.2 px. At 12 px (feed) they come out 3.9% narrow; the scheme's height gives the feed's size as 15 / 1.215 = 12.34 px per em, not 12, and at 12.34 px the feed is 1.8% narrow (12.5 px: 1.4% wide).
- **Fixed cut levels lose thin parts.** Cut at 208 of 255 (feed) and 192 (bars) scores best on this sample (R1), but at 12.34 px it loses half the ink of `"`, `(`, `+`, `[`, `f`, `l`, `|` and `~` (a 1-px stroke falling between two pixels), and 224 erases the hyphens ("SK.GeT_RiGhT  A"). The level depends on how the browser smooths, which differs between the Mac and Windows.
- **Each letter keeps its most covered pixels** (R6): drawn on its own, it keeps as many pixels as 0.8 times its smoothed coverage, the most covered first, then the smear. No printable character loses ink at 11, 12 or 12.34 px, and it adapts to however the browser smooths.
- **Icons.** No change: where his look white, they lie over the bright sky, and ours added onto the same background turn white the same way (`text-variants-3x.png`, rows 1 and 2). A Gaussian blur of 0 to 0.6 px changes the fit to his pixels by under 0.5 RMS (of 255), within the JPEG's noise, so his shot can't show whether the game smooths them; his JPEG softens our sharp icons as much as his.
- **Colours.** No change: 0.28.0 read brighter because its text is heavier (more fully coloured pixels) and because his JPEG dulls thin text. R6 drawn in the scheme's colours, through his JPEG: T names 231 74 76 (his 229 73 75), CT names 161 203 244 (163 201 240), the bars 241 178 34 (235 178 46), the bottom name 232 74 75 (225 75 76). His 1920x1440 shot of the same moment, whose strokes are 2 to 4 px wide: 244 67 70, 156 204 250, 248 177 15, near the scheme's 255 64 64, 153 204 255, 255 176 0. Matching his JPEG's sampled colours would make ours duller on screen than his game. The bars stay a little more saturated (blue 34 against 46).

## The summary table (R6 recommended)

| | 0.28.0 (a) | R6: whole pixels, 0.8 of coverage, smear, feed 12.34 px | R1: whole pixels, cut 208 feed / 192 bars, smear, feed 12.34 px | the game |
|---|---|---|---|---|
| Bars: width against his | 2.4 px (-2.1%) | 0.2 px (+0.2%) | 0.2 px (+0.2%) | |
| Bars: places his letters part and ours don't | 26 of 58 | 5 of 58 | 0 of 58 | |
| Bars: strokes; ink | 2.52 px; 1.20 | 2.26 px; 1.06 | 2.19 px; 1.03 | 2.15 px; 1 |
| Bars: letters touching (own render) | 14 of 72 | 3 of 72 | 0 of 72 | |
| Feed: width against his | 2.9 px (-2.7%) | 3.1 px (-1.8%) | 3.2 px (-1.9%) | |
| Feed: strokes; ink | 2.72 px; 1.20 | 2.39 px; 1.02 | 2.30 px; 0.91 | 2.15 px; 1 |
| Feed: letters touching (own render) | 15 of 108 | 9 of 108 | 1 of 108 | |
| Characters losing half their ink or more (feed, 12.34 px) | | none | `"` `(` `+` `[` `f` `l` `|` `~` | |

Images on `screenshots/0.28.0`: `text-variants-3x.png` (his, a, b1, b2, c1, c2, d at 128 and 192 without smear and 160 and 192 with it, e, R1, R6) and `icons-colours.png`.

## The i, the marks and the character sheet (28 Nov 2026, evening)

Sujan, on `0.28.0-r6-3x.png`: Na`Vi read Na`Vf in every row and at every size. What R6 did to the feed's 12.34 px i: its dot kept 2 pixels (255 and 153), 3 after the smear, wider than the 2-px stem; the stem's right column was all one grey (128) and the 0.8 cut fell inside it, keeping one of them, the top one, a bump under the dot like an f's bar; the empty row was there, holding only the dot's shadow. V to i: 2 empty columns at the stem rows in his shot and in ours, the V's shadow in one of them in both; at the top rows ours had the 3-px dot reaching toward the V's 3-px arm.

The fix in `hudKeep` (`src/hud.js`): (0) a row of a letter whose strongest pixel is under 200 and a dip of 64 or more against the pixels above and below it keeps nothing (the 12.34 px ! reads 255, 190, 157, 255 down its stem and dot); (1) a letter's parts, the pieces of its drawing at 96 or more, those rows left out; (2) each part keeps 0.8 of its own coverage, a run of equal greys at the cut kept all or none; (3) a small part above or below a bigger one keeps runs no wider than the bigger one's usual run; (4) such parts keep an empty row between them. The a lost the curl on its second row's left, which his shot doesn't have either. Against his shot: the bars 3 merged places of 58 (R6 5), ink 1.05; the feed ink 1.00 (R6 1.02), widths unchanged.

Plain smoothed text by smear, the feed at 12.34 px (ink against his, feed and bars; strokes against his 2.15): no smear 0.67 and 0.79, 1.78 and 1.58 px; 0.5: 0.75 and 0.89; 0.75: 0.91 and 1.14, 2.22 and 2.43 px; the full smear 1.14 and 1.21, 2.64 and 2.60 px. The closest to his game's weight is 0.75.

The character sheet (`tests/text_variants/sheet.py`; `0.28.0-character-sheet.png` on `screenshots/0.28.0`): A-Z, a-z, 0-9, every punctuation mark and symbol, the pairs Vi Vf il li rn m 1l O0 fi fl ff tt, and accented letters, in R6 as built and plain smoothed with the 0.75 smear, in T red and CT blue at the feed's size with their shadow and the bars' orange at 11 px, at actual size and 3x. Claude's read: R6 as built still merges I and J into a box in the feed ("GH□KL"), loses the $'s vertical bar there (it reads as an S), and draws # oddly in the bars; rn comes close to m in the feed (the game's own text is tight there too). Plain smoothed text has none of these.

## R6 dropped; plain smoothed text shipped (28 Nov 2026, night)

Sujan, on the character sheet: switch #73 to plain smoothed browser text with the 0.75 smear, no edge cutting, for the feed and the bars; the rest of the HUD as built. R6's code, as it was at commit 778510a, is kept in `tests/text_variants/r6.js` for the test page's 'r6' mode and the sheet; the test page's 'build' mode is the shipped text since. The shipped text against his shot (through his JPEG): the feed 0.7% narrower, ink 0.91, strokes 2.24 px; the bars 2.3% narrower, ink 1.14, strokes 2.43 px (his 2.15). Its colours through his JPEG read a little darker than his game's (T names 215 63 65 against 229 73 75), since fewer of its pixels are fully covered; the colours stay unchanged (Sujan, 28 Nov 2026). `tests/hud_check.py` lost the items only R6 needed and keeps the dot/stem gaps where the smoothed drawing has them (all but the feed's !, whose 12.34 px drawing has no empty row). Image: `0.28.0-text-3x.png` on `screenshots/0.28.0`.

## The full report (generated by `analyse.py`)

# HUD text variants against Sujan's 800x600 shot

Generated by `tests/text_variants/analyse.py` from `render.py`'s output. EF: the kill feed's names (EngineFont, 12 px, 8 strings with enough contrast against their background); DF: the bars' text (Default, 11 px, 5 strings). Each figure is the variant against his shot, both measured after the same JPEG.

- width: mean of |ink width - his| per string, px (and the mean signed difference as % of his width)
- parts merged: places where his letters part (a column with no ink) and the variant's don't, of how many; split: places the variant parts and his don't
- letter: mean |width - his| of the parts (letters) that start where his do, px
- gap: mean width of the 1-2 px gaps between letters, his then the variant's
- stroke: mean width of the strokes (runs of ink up to 4 px) across the middle rows, his then the variant's; mix: how far the share of 1, 2, 3, 4 and 5+ px runs is from his (0 the same, 2 nothing alike)
- ink: ink pixels against his (1.00 the same; above 1 heavier)

| Variant | font | letter spacing | width px (%) | parts merged / of | split | letter px | gap his / var | stroke his / var | mix | ink |
|---|---|---|---|---|---|---|---|---|---|---|
| a) 0.28.0: cut at 128, smear, 1 px | EF | 1 | 2.9 (-2.7%) | 47 / 96 | 29 | 2.59 | 1.60 / 1.46 | 2.15 / 2.72 | 1.01 | 1.20 |
| a) 0.28.0: cut at 128, smear, 1 px | DF | 1 | 2.4 (-2.1%) | 26 / 58 | 13 | 1.58 | 1.53 / 1.21 | 2.15 / 2.52 | 0.70 | 1.20 |
| b1) smoothed, no smear, 1 px | EF | 1 | 3.8 (-3.6%) | 36 / 96 | 29 | 1.14 | 1.60 / 1.59 | 2.15 / 1.71 | 0.74 | 0.64 |
| b1) smoothed, no smear, 1 px | DF | 1 | 3.2 (-3.3%) | 21 / 58 | 20 | 0.93 | 1.53 / 1.71 | 2.15 / 1.58 | 1.00 | 0.79 |
| b2) smoothed, smear, 1 px | EF | 1 | 2.9 (-2.7%) | 41 / 96 | 22 | 2.29 | 1.60 / 1.60 | 2.15 / 2.64 | 0.81 | 1.12 |
| b2) smoothed, smear, 1 px | DF | 1 | 2.2 (-2.3%) | 28 / 58 | 12 | 2.03 | 1.53 / 1.19 | 2.15 / 2.60 | 0.90 | 1.21 |
| b1*) smoothed, no smear, spacing fitted | EF | 1 | 3.8 (-3.6%) | 36 / 96 | 29 | 1.14 | 1.60 / 1.59 | 2.15 / 1.71 | 0.74 | 0.64 |
| b1*) smoothed, no smear, spacing fitted | DF | 1 | 3.2 (-3.3%) | 21 / 58 | 20 | 0.93 | 1.53 / 1.71 | 2.15 / 1.58 | 1.00 | 0.79 |
| b2*) smoothed, smear, spacing fitted | EF | 1 | 2.9 (-2.7%) | 41 / 96 | 22 | 2.29 | 1.60 / 1.60 | 2.15 / 2.64 | 0.81 | 1.12 |
| b2*) smoothed, smear, spacing fitted | DF | 1 | 2.2 (-2.3%) | 28 / 58 | 12 | 2.03 | 1.53 / 1.19 | 2.15 / 2.60 | 0.90 | 1.21 |
| b3*) Verdana Bold, smoothed, spacing fitted (extra) | EF | 0.5 | 3.0 (+0.5%) | 46 / 96 | 42 | 1.57 | 1.60 / 1.64 | 2.15 / 2.62 | 0.88 | 1.19 |
| b3*) Verdana Bold, smoothed, spacing fitted (extra) | DF | 0.5 | 1.2 (+1.2%) | 9 / 58 | 7 | 0.73 | 1.53 / 1.31 | 2.15 / 2.56 | 1.04 | 1.33 |
| c1) 4x, cut at 128 there, shrunk, no smear, 1 px | EF | 1 | 4.5 (-4.3%) | 45 / 96 | 42 | 1.93 | 1.60 / 1.53 | 2.15 / 1.39 | 1.20 | 0.46 |
| c1) 4x, cut at 128 there, shrunk, no smear, 1 px | DF | 1 | 3.4 (-3.5%) | 24 / 58 | 23 | 1.26 | 1.53 / 1.89 | 2.15 / 1.40 | 1.27 | 0.71 |
| c2) 4x, cut, smear, shrunk, 1 px | EF | 1 | 3.1 (-3.0%) | 39 / 96 | 32 | 1.27 | 1.60 / 1.65 | 2.15 / 2.31 | 0.34 | 0.96 |
| c2) 4x, cut, smear, shrunk, 1 px | DF | 1 | 2.4 (-2.5%) | 25 / 58 | 17 | 1.36 | 1.53 / 1.21 | 2.15 / 2.40 | 0.64 | 1.14 |
| c1*) the same, spacing fitted | EF | 1.5 | 3.9 (+0.8%) | 52 / 96 | 53 | 2.62 | 1.60 / 1.40 | 2.15 / 1.38 | 1.20 | 0.46 |
| c1*) the same, spacing fitted | DF | 1.5 | 3.4 (+3.5%) | 23 / 58 | 24 | 0.85 | 1.53 / 1.91 | 2.15 / 1.40 | 1.28 | 0.70 |
| c2*) the same, spacing fitted | EF | 1 | 3.1 (-3.0%) | 39 / 96 | 32 | 1.27 | 1.60 / 1.65 | 2.15 / 2.31 | 0.34 | 0.96 |
| c2*) the same, spacing fitted | DF | 1 | 2.4 (-2.5%) | 25 / 58 | 17 | 1.36 | 1.53 / 1.21 | 2.15 / 2.40 | 0.64 | 1.14 |
| d) cut at 64, no smear, spacing fitted | EF | 1 | 3.1 (-2.7%) | 47 / 96 | 36 | 1.92 | 1.60 / 1.69 | 2.15 / 2.35 | 0.37 | 1.01 |
| d) cut at 64, no smear, spacing fitted | DF | 1 | 2.8 (-2.5%) | 20 / 58 | 19 | 0.78 | 1.53 / 1.43 | 2.15 / 2.05 | 0.29 | 1.04 |
| d) cut at 64, smear, spacing fitted | EF | 1 | 2.2 (-1.7%) | 58 / 96 | 29 | 3.14 | 1.60 / 1.20 | 2.15 / 3.02 | 1.51 | 1.43 |
| d) cut at 64, smear, spacing fitted | DF | 1 | 2.2 (-1.5%) | 35 / 58 | 8 | 5.79 | 1.53 / 1.09 | 2.15 / 2.90 | 1.47 | 1.45 |
| d) cut at 96, no smear, spacing fitted | EF | 1 | 3.4 (-3.0%) | 54 / 96 | 48 | 1.48 | 1.60 / 1.57 | 2.15 / 2.22 | 0.31 | 0.88 |
| d) cut at 96, no smear, spacing fitted | DF | 1 | 2.8 (-2.5%) | 20 / 58 | 19 | 0.80 | 1.53 / 1.55 | 2.15 / 1.87 | 0.51 | 0.94 |
| d) cut at 96, smear, spacing fitted | EF | 1 | 2.6 (-2.0%) | 61 / 96 | 32 | 2.70 | 1.60 / 1.41 | 2.15 / 3.01 | 1.37 | 1.31 |
| d) cut at 96, smear, spacing fitted | DF | 1 | 2.2 (-1.5%) | 31 / 58 | 10 | 3.43 | 1.53 / 1.11 | 2.15 / 2.74 | 1.18 | 1.34 |
| d) cut at 128, no smear, spacing fitted | EF | 1 | 4.1 (-3.9%) | 42 / 96 | 39 | 0.94 | 1.60 / 1.59 | 2.15 / 1.97 | 0.47 | 0.71 |
| d) cut at 128, no smear, spacing fitted | DF | 1 | 3.0 (-3.1%) | 21 / 58 | 20 | 0.83 | 1.53 / 1.69 | 2.15 / 1.55 | 1.02 | 0.81 |
| d) cut at 128, smear, spacing fitted | EF | 1 | 2.9 (-2.7%) | 47 / 96 | 29 | 2.59 | 1.60 / 1.46 | 2.15 / 2.72 | 1.01 | 1.20 |
| d) cut at 128, smear, spacing fitted | DF | 1 | 2.4 (-2.1%) | 26 / 58 | 13 | 1.58 | 1.53 / 1.21 | 2.15 / 2.52 | 0.70 | 1.20 |
| d) cut at 160, no smear, spacing fitted | EF | 1 | 4.0 (-3.8%) | 56 / 96 | 51 | 1.31 | 1.60 / 1.71 | 2.15 / 1.82 | 0.56 | 0.62 |
| d) cut at 160, no smear, spacing fitted | DF | 1 | 3.4 (-3.5%) | 25 / 58 | 24 | 1.10 | 1.53 / 1.86 | 2.15 / 1.40 | 1.29 | 0.73 |
| d) cut at 160, smear, spacing fitted | EF | 1 | 2.9 (-2.7%) | 45 / 96 | 32 | 2.10 | 1.60 / 1.54 | 2.15 / 2.55 | 0.75 | 1.08 |
| d) cut at 160, smear, spacing fitted | DF | 1 | 2.4 (-2.5%) | 26 / 58 | 20 | 1.06 | 1.53 / 1.24 | 2.15 / 2.38 | 0.44 | 1.12 |
| d) cut at 192, no smear, spacing fitted | EF | 1 | 4.2 (-4.0%) | 56 / 96 | 53 | 1.68 | 1.60 / 1.75 | 2.15 / 1.55 | 0.99 | 0.47 |
| d) cut at 192, no smear, spacing fitted | DF | 1.5 | 3.2 (+3.3%) | 26 / 58 | 29 | 1.15 | 1.53 / 1.79 | 2.15 / 1.21 | 1.61 | 0.63 |
| d) cut at 192, smear, spacing fitted | EF | 1 | 2.8 (-2.6%) | 42 / 96 | 33 | 1.56 | 1.60 / 1.67 | 2.15 / 2.41 | 0.41 | 0.96 |
| d) cut at 192, smear, spacing fitted | DF | 1 | 2.4 (-2.5%) | 25 / 58 | 22 | 0.92 | 1.53 / 1.38 | 2.15 / 2.25 | 0.25 | 1.04 |
| e) letters on whole pixels: cut128 (extra) | EF | 1.5 | 4.1 (+1.3%) | 51 / 96 | 44 | 1.73 | 1.60 / 1.77 | 2.15 / 1.95 | 0.45 | 0.73 |
| e) letters on whole pixels: cut128 (extra) | DF | 1 | 0.8 (+0.0%) | 17 / 58 | 18 | 0.79 | 1.53 / 1.62 | 2.15 / 1.44 | 1.19 | 0.78 |
| e) letters on whole pixels: cut128s (extra) | EF | 1 | 3.6 (-3.4%) | 56 / 96 | 34 | 2.61 | 1.60 / 1.29 | 2.15 / 2.63 | 0.88 | 1.17 |
| e) letters on whole pixels: cut128s (extra) | DF | 1 | 1.0 (+1.0%) | 22 / 58 | 11 | 1.66 | 1.53 / 1.44 | 2.15 / 2.39 | 0.50 | 1.18 |
| e) letters on whole pixels: cut160 (extra) | EF | 1.5 | 4.0 (+1.2%) | 54 / 96 | 53 | 2.12 | 1.60 / 1.70 | 2.15 / 1.79 | 0.62 | 0.62 |
| e) letters on whole pixels: cut160 (extra) | DF | 1 | 0.8 (-0.4%) | 23 / 58 | 24 | 1.02 | 1.53 / 1.89 | 2.15 / 1.31 | 1.44 | 0.69 |
| e) letters on whole pixels: cut160s (extra) | EF | 1 | 3.8 (-3.6%) | 57 / 96 | 44 | 2.37 | 1.60 / 1.44 | 2.15 / 2.49 | 0.63 | 1.07 |
| e) letters on whole pixels: cut160s (extra) | DF | 1 | 0.6 (+0.6%) | 25 / 58 | 23 | 0.55 | 1.53 / 1.47 | 2.15 / 2.28 | 0.29 | 1.09 |
| e) letters on whole pixels: cut192 (extra) | EF | 1.5 | 4.6 (-0.1%) | 54 / 96 | 57 | 1.69 | 1.60 / 1.69 | 2.15 / 1.50 | 1.02 | 0.48 |
| e) letters on whole pixels: cut192 (extra) | DF | 1 | 0.8 (-0.8%) | 9 / 58 | 10 | 1.12 | 1.53 / 2.00 | 2.15 / 1.20 | 1.61 | 0.63 |
| e) letters on whole pixels: cut192s (extra) | EF | 1 | 4.0 (-3.8%) | 49 / 96 | 44 | 1.50 | 1.60 / 1.55 | 2.15 / 2.38 | 0.32 | 0.96 |
| e) letters on whole pixels: cut192s (extra) | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.19 | 0.15 | 1.03 |
| e) letters on whole pixels: cut208s (extra) | EF | 1 | 4.2 (-4.0%) | 51 / 96 | 47 | 1.44 | 1.60 / 1.59 | 2.15 / 2.34 | 0.26 | 0.92 |
| e) letters on whole pixels: cut208s (extra) | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.16 | 0.13 | 1.00 |
| e) letters on whole pixels: cut224s (extra) | EF | 1 | 8.2 (-7.8%) | 62 / 96 | 59 | 1.44 | 1.60 / 1.67 | 2.15 / 2.23 | 0.13 | 0.82 |
| e) letters on whole pixels: cut224s (extra) | DF | 1 | 0.2 (+0.2%) | 4 / 58 | 5 | 0.42 | 1.53 / 1.78 | 2.15 / 2.09 | 0.10 | 0.92 |
| e) letters on whole pixels: cut240s (extra) | EF | 1 | 8.4 (-8.0%) | 60 / 96 | 52 | 1.49 | 1.60 / 1.73 | 2.15 / 2.15 | 0.11 | 0.69 |
| e) letters on whole pixels: cut240s (extra) | DF | 1 | 0.2 (+0.2%) | 9 / 58 | 10 | 0.76 | 1.53 / 1.71 | 2.15 / 2.04 | 0.20 | 0.82 |
| e) letters on whole pixels: cut64 (extra) | EF | 1 | 3.9 (-3.7%) | 54 / 96 | 40 | 1.43 | 1.60 / 1.73 | 2.15 / 2.42 | 0.41 | 1.00 |
| e) letters on whole pixels: cut64 (extra) | DF | 1 | 1.0 (+0.6%) | 17 / 58 | 13 | 1.27 | 1.53 / 1.48 | 2.15 / 1.86 | 0.66 | 0.98 |
| e) letters on whole pixels: cut64s (extra) | EF | 1 | 2.9 (-2.7%) | 61 / 96 | 30 | 3.98 | 1.60 / 1.23 | 2.15 / 3.10 | 1.54 | 1.41 |
| e) letters on whole pixels: cut64s (extra) | DF | 1 | 1.6 (+1.7%) | 28 / 58 | 7 | 4.09 | 1.53 / 1.41 | 2.15 / 2.63 | 1.04 | 1.39 |
| e) letters on whole pixels: cut96 (extra) | EF | 1 | 3.9 (-3.7%) | 55 / 96 | 47 | 1.38 | 1.60 / 1.70 | 2.15 / 2.31 | 0.29 | 0.92 |
| e) letters on whole pixels: cut96 (extra) | DF | 1 | 1.0 (+0.6%) | 16 / 58 | 17 | 0.77 | 1.53 / 1.53 | 2.15 / 1.63 | 0.92 | 0.87 |
| e) letters on whole pixels: cut96s (extra) | EF | 1 | 2.9 (-2.7%) | 58 / 96 | 30 | 3.50 | 1.60 / 1.25 | 2.15 / 3.12 | 1.49 | 1.34 |
| e) letters on whole pixels: cut96s (extra) | DF | 1 | 1.6 (+1.7%) | 28 / 58 | 12 | 3.06 | 1.53 / 1.41 | 2.15 / 2.50 | 0.72 | 1.27 |
| e) letters on whole pixels: smoothB (extra) | EF | 0.5 | 3.4 (+1.1%) | 52 / 96 | 41 | 1.80 | 1.60 / 1.66 | 2.15 / 2.74 | 1.02 | 1.22 |
| e) letters on whole pixels: smoothB (extra) | DF | 0.5 | 2.2 (+1.5%) | 25 / 58 | 19 | 1.32 | 1.53 / 1.32 | 2.15 / 2.52 | 1.05 | 1.33 |
| e) letters on whole pixels: smoothBs (extra) | EF | 0.5 | 3.9 (+2.0%) | 70 / 96 | 32 | 5.21 | 1.60 / 1.13 | 2.15 / 3.42 | 1.53 | 1.61 |
| e) letters on whole pixels: smoothBs (extra) | DF | 0.5 | 2.4 (+2.5%) | 46 / 58 | 12 | 12.67 | 1.53 / 1.20 | 2.15 / 3.35 | 1.71 | 1.70 |
| e) letters on whole pixels: smooth (extra) | EF | 1.5 | 4.4 (+1.1%) | 48 / 96 | 41 | 1.88 | 1.60 / 1.77 | 2.15 / 1.78 | 0.65 | 0.66 |
| e) letters on whole pixels: smooth (extra) | DF | 1 | 0.8 (-0.4%) | 23 / 58 | 24 | 0.93 | 1.53 / 1.79 | 2.15 / 1.43 | 1.23 | 0.76 |
| e) letters on whole pixels: smooths (extra) | EF | 1 | 3.8 (-3.6%) | 53 / 96 | 36 | 1.87 | 1.60 / 1.50 | 2.15 / 2.49 | 0.62 | 1.08 |
| e) letters on whole pixels: smooths (extra) | DF | 1 | 0.8 (+0.8%) | 20 / 58 | 13 | 1.16 | 1.53 / 1.45 | 2.15 / 2.37 | 0.51 | 1.17 |
| e) letters on whole pixels: ss4cut128 (extra) | EF | 1.5 | 4.2 (+0.7%) | 49 / 96 | 52 | 2.26 | 1.60 / 1.52 | 2.15 / 1.46 | 1.12 | 0.47 |
| e) letters on whole pixels: ss4cut128 (extra) | DF | 1 | 0.8 (-0.8%) | 9 / 58 | 10 | 1.06 | 1.53 / 1.96 | 2.15 / 1.25 | 1.55 | 0.67 |
| e) letters on whole pixels: ss4cut128s (extra) | EF | 1 | 4.1 (-3.9%) | 50 / 96 | 43 | 1.75 | 1.60 / 1.62 | 2.15 / 2.28 | 0.27 | 0.95 |
| e) letters on whole pixels: ss4cut128s (extra) | DF | 1 | 0.2 (+0.2%) | 5 / 58 | 2 | 0.57 | 1.53 / 1.49 | 2.15 / 2.24 | 0.30 | 1.09 |
| e) letters on whole pixels: ss4cut160 (extra) | EF | 1.5 | 4.2 (-0.2%) | 53 / 96 | 54 | 2.27 | 1.60 / 1.59 | 2.15 / 1.37 | 1.30 | 0.42 |
| e) letters on whole pixels: ss4cut160 (extra) | DF | 1 | 0.8 (-0.8%) | 9 / 58 | 10 | 1.06 | 1.53 / 1.96 | 2.15 / 1.21 | 1.61 | 0.65 |
| e) letters on whole pixels: ss4cut160s (extra) | EF | 1 | 4.0 (-3.8%) | 48 / 96 | 38 | 1.90 | 1.60 / 1.69 | 2.15 / 2.26 | 0.25 | 0.92 |
| e) letters on whole pixels: ss4cut160s (extra) | DF | 1 | 0.2 (+0.2%) | 4 / 58 | 2 | 0.42 | 1.53 / 1.45 | 2.15 / 2.21 | 0.25 | 1.07 |
| e) letters on whole pixels: ss4cut96 (extra) | EF | 1.5 | 4.4 (+0.8%) | 48 / 96 | 46 | 1.96 | 1.60 / 1.67 | 2.15 / 1.51 | 1.05 | 0.50 |
| e) letters on whole pixels: ss4cut96 (extra) | DF | 1 | 0.8 (-0.8%) | 9 / 58 | 10 | 1.05 | 1.53 / 1.96 | 2.15 / 1.28 | 1.49 | 0.69 |
| e) letters on whole pixels: ss4cut96s (extra) | EF | 1 | 4.0 (-3.8%) | 48 / 96 | 39 | 1.69 | 1.60 / 1.61 | 2.15 / 2.32 | 0.37 | 0.98 |
| e) letters on whole pixels: ss4cut96s (extra) | DF | 1 | 0.2 (+0.2%) | 6 / 58 | 3 | 0.54 | 1.53 / 1.45 | 2.15 / 2.29 | 0.38 | 1.11 |
| e+) each letter keeps 0.8 x its coverage, smear, letters on whole pixels, the feed at 12 px (extra) | EF | 1 | 4.0 (-3.8%) | 50 / 96 | 37 | 2.11 | 1.60 / 1.43 | 2.15 / 2.44 | 0.46 | 1.00 |
| e+) each letter keeps 0.8 x its coverage, smear, letters on whole pixels, the feed at 12 px (extra) | DF | 1 | 0.2 (+0.2%) | 5 / 58 | 3 | 0.59 | 1.53 / 1.50 | 2.15 / 2.26 | 0.24 | 1.06 |
| e+) each letter keeps 0.8 x its coverage, smear, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.1 (-1.8%) | 46 / 96 | 32 | 2.46 | 1.60 / 1.56 | 2.15 / 2.39 | 0.42 | 1.02 |
| e+) each letter keeps 0.8 x its coverage, smear, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 0.2 (+0.2%) | 5 / 58 | 3 | 0.59 | 1.53 / 1.50 | 2.15 / 2.26 | 0.24 | 1.06 |
| e+) each letter keeps 0.9 x its coverage, smear, letters on whole pixels, the feed at 12 px (extra) | EF | 1 | 3.8 (-3.6%) | 56 / 96 | 38 | 2.72 | 1.60 / 1.43 | 2.15 / 2.57 | 0.70 | 1.09 |
| e+) each letter keeps 0.9 x its coverage, smear, letters on whole pixels, the feed at 12 px (extra) | DF | 1 | 0.8 (+0.8%) | 18 / 58 | 11 | 1.26 | 1.53 / 1.46 | 2.15 / 2.34 | 0.39 | 1.13 |
| e+) each letter keeps 0.9 x its coverage, smear, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.4 (-1.5%) | 52 / 96 | 33 | 2.19 | 1.60 / 1.53 | 2.15 / 2.66 | 0.81 | 1.13 |
| e+) each letter keeps 0.9 x its coverage, smear, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 0.8 (+0.8%) | 18 / 58 | 11 | 1.26 | 1.53 / 1.46 | 2.15 / 2.34 | 0.39 | 1.13 |
| e+) each letter keeps 1.0 x its coverage, smear, letters on whole pixels, the feed at 12 px (extra) | EF | 1 | 3.2 (-3.1%) | 65 / 96 | 39 | 3.20 | 1.60 / 1.28 | 2.15 / 2.73 | 1.00 | 1.19 |
| e+) each letter keeps 1.0 x its coverage, smear, letters on whole pixels, the feed at 12 px (extra) | DF | 1 | 1.2 (+1.2%) | 26 / 58 | 6 | 3.49 | 1.53 / 1.32 | 2.15 / 2.46 | 0.60 | 1.22 |
| e+) each letter keeps 1.0 x its coverage, smear, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.5 (-1.4%) | 54 / 96 | 30 | 2.77 | 1.60 / 1.45 | 2.15 / 2.79 | 1.12 | 1.24 |
| e+) each letter keeps 1.0 x its coverage, smear, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 1.2 (+1.2%) | 26 / 58 | 6 | 3.49 | 1.53 / 1.32 | 2.15 / 2.46 | 0.60 | 1.22 |
| e+) each letter keeps 1.1 x its coverage, smear, letters on whole pixels, the feed at 12 px (extra) | EF | 1 | 2.9 (-2.7%) | 57 / 96 | 30 | 3.22 | 1.60 / 1.29 | 2.15 / 3.02 | 1.37 | 1.29 |
| e+) each letter keeps 1.1 x its coverage, smear, letters on whole pixels, the feed at 12 px (extra) | DF | 1 | 1.6 (+1.7%) | 30 / 58 | 7 | 4.68 | 1.53 / 1.36 | 2.15 / 2.48 | 0.84 | 1.31 |
| e+) each letter keeps 1.1 x its coverage, smear, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.4 (-1.1%) | 56 / 96 | 30 | 3.31 | 1.60 / 1.41 | 2.15 / 2.97 | 1.37 | 1.35 |
| e+) each letter keeps 1.1 x its coverage, smear, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 1.6 (+1.7%) | 30 / 58 | 7 | 4.68 | 1.53 / 1.36 | 2.15 / 2.48 | 0.84 | 1.31 |
| e+) cut192s, letters on whole pixels, each advance rounded after adding 0.2 (extra) | EF | 1 | 3.5 (-1.7%) | 47 / 96 | 41 | 1.57 | 1.60 / 1.69 | 2.15 / 2.39 | 0.35 | 0.94 |
| e+) cut192s, letters on whole pixels, each advance rounded after adding 0.2 (extra) | DF | 1 | 1.2 (+1.2%) | 14 / 58 | 15 | 0.27 | 1.53 / 1.61 | 2.15 / 2.19 | 0.15 | 1.03 |
| e+) cut192s, letters on whole pixels, each advance rounded after adding 0.3 (extra) | EF | 1 | 5.4 (+3.2%) | 50 / 96 | 47 | 1.15 | 1.60 / 1.72 | 2.15 / 2.38 | 0.35 | 0.94 |
| e+) cut192s, letters on whole pixels, each advance rounded after adding 0.3 (extra) | DF | 1 | 1.4 (+1.5%) | 14 / 58 | 15 | 0.26 | 1.53 / 1.60 | 2.15 / 2.19 | 0.15 | 1.03 |
| e+) cut192s, letters on whole pixels, each advance rounded after adding 0.4 (extra) | EF | 1 | 5.6 (+4.6%) | 47 / 96 | 47 | 1.53 | 1.60 / 1.75 | 2.15 / 2.39 | 0.35 | 0.95 |
| e+) cut192s, letters on whole pixels, each advance rounded after adding 0.4 (extra) | DF | 1 | 1.4 (+1.5%) | 14 / 58 | 15 | 0.26 | 1.53 / 1.60 | 2.15 / 2.19 | 0.15 | 1.03 |
| e+) cut192s, letters on whole pixels, each advance rounded after adding 0.5 (extra) | EF | 1 | 5.6 (+4.6%) | 47 / 96 | 47 | 1.53 | 1.60 / 1.75 | 2.15 / 2.39 | 0.35 | 0.95 |
| e+) cut192s, letters on whole pixels, each advance rounded after adding 0.5 (extra) | DF | 1 | 2.0 (+2.1%) | 21 / 58 | 22 | 0.30 | 1.53 / 1.58 | 2.15 / 2.19 | 0.15 | 1.03 |
| e+) cut192s, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.1 (-1.8%) | 46 / 96 | 33 | 2.02 | 1.60 / 1.57 | 2.15 / 2.40 | 0.39 | 0.97 |
| e+) cut192s, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.19 | 0.15 | 1.03 |
| e+) cut192s, letters on whole pixels, the feed at 12.5 px (extra) | EF | 1 | 3.5 (+1.4%) | 44 / 96 | 37 | 1.95 | 1.60 / 1.62 | 2.15 / 2.41 | 0.39 | 0.99 |
| e+) cut192s, letters on whole pixels, the feed at 12.5 px (extra) | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.19 | 0.15 | 1.03 |
| e+) cut208s, letters on whole pixels, the feed at 12 px (extra) | EF | 1 | 4.2 (-4.0%) | 51 / 96 | 47 | 1.44 | 1.60 / 1.59 | 2.15 / 2.34 | 0.26 | 0.92 |
| e+) cut208s, letters on whole pixels, the feed at 12 px (extra) | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.16 | 0.13 | 1.00 |
| e+) cut208s, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.2 (-1.9%) | 39 / 96 | 34 | 1.90 | 1.60 / 1.56 | 2.15 / 2.30 | 0.24 | 0.91 |
| e+) cut208s, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.16 | 0.13 | 1.00 |
| e+) cut208s, letters on whole pixels, the feed at 12.5 px (extra) | EF | 1 | 3.5 (+1.4%) | 48 / 96 | 45 | 1.82 | 1.60 / 1.62 | 2.15 / 2.28 | 0.26 | 0.94 |
| e+) cut208s, letters on whole pixels, the feed at 12.5 px (extra) | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.16 | 0.13 | 1.00 |
| e+) cut224s, letters on whole pixels, the feed at 12 px (extra) | EF | 1 | 8.2 (-7.8%) | 62 / 96 | 59 | 1.44 | 1.60 / 1.67 | 2.15 / 2.23 | 0.13 | 0.82 |
| e+) cut224s, letters on whole pixels, the feed at 12 px (extra) | DF | 1 | 0.2 (+0.2%) | 4 / 58 | 5 | 0.42 | 1.53 / 1.78 | 2.15 / 2.09 | 0.10 | 0.92 |
| e+) cut224s, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 2.9 (-2.7%) | 46 / 96 | 38 | 1.44 | 1.60 / 1.59 | 2.15 / 2.19 | 0.10 | 0.83 |
| e+) cut224s, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 0.2 (+0.2%) | 4 / 58 | 5 | 0.42 | 1.53 / 1.78 | 2.15 / 2.09 | 0.10 | 0.92 |
| e+) cut224s, letters on whole pixels, the feed at 12.5 px (extra) | EF | 1 | 2.6 (+0.6%) | 50 / 96 | 49 | 1.71 | 1.60 / 1.65 | 2.15 / 2.17 | 0.07 | 0.86 |
| e+) cut224s, letters on whole pixels, the feed at 12.5 px (extra) | DF | 1 | 0.2 (+0.2%) | 4 / 58 | 5 | 0.42 | 1.53 / 1.78 | 2.15 / 2.09 | 0.10 | 0.92 |
| e+) cut240s, letters on whole pixels, the feed at 12 px (extra) | EF | 1 | 8.4 (-8.0%) | 60 / 96 | 52 | 1.49 | 1.60 / 1.73 | 2.15 / 2.15 | 0.11 | 0.69 |
| e+) cut240s, letters on whole pixels, the feed at 12 px (extra) | DF | 1 | 0.2 (+0.2%) | 9 / 58 | 10 | 0.76 | 1.53 / 1.71 | 2.15 / 2.04 | 0.20 | 0.82 |
| e+) cut240s, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.4 (-3.2%) | 51 / 96 | 52 | 1.16 | 1.60 / 1.68 | 2.15 / 2.12 | 0.20 | 0.74 |
| e+) cut240s, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 0.2 (+0.2%) | 9 / 58 | 10 | 0.76 | 1.53 / 1.71 | 2.15 / 2.04 | 0.20 | 0.82 |
| e+) cut240s, letters on whole pixels, the feed at 12.5 px (extra) | EF | 1 | 2.9 (+0.4%) | 52 / 96 | 46 | 1.40 | 1.60 / 1.67 | 2.15 / 2.09 | 0.16 | 0.72 |
| e+) cut240s, letters on whole pixels, the feed at 12.5 px (extra) | DF | 1 | 0.2 (+0.2%) | 9 / 58 | 10 | 0.76 | 1.53 / 1.71 | 2.15 / 2.04 | 0.20 | 0.82 |
| e+) ss4cut128s, letters on whole pixels, each advance rounded after adding 0.2 (extra) | EF | 1 | 3.5 (-1.7%) | 48 / 96 | 34 | 1.77 | 1.60 / 1.64 | 2.15 / 2.32 | 0.35 | 0.95 |
| e+) ss4cut128s, letters on whole pixels, each advance rounded after adding 0.2 (extra) | DF | 1 | 1.2 (+1.2%) | 16 / 58 | 14 | 0.57 | 1.53 / 1.55 | 2.15 / 2.24 | 0.35 | 1.09 |
| e+) ss4cut128s, letters on whole pixels, each advance rounded after adding 0.3 (extra) | EF | 1 | 5.5 (+2.9%) | 48 / 96 | 46 | 1.05 | 1.60 / 1.63 | 2.15 / 2.30 | 0.28 | 0.94 |
| e+) ss4cut128s, letters on whole pixels, each advance rounded after adding 0.3 (extra) | DF | 1 | 1.4 (+1.5%) | 16 / 58 | 14 | 0.58 | 1.53 / 1.51 | 2.15 / 2.24 | 0.37 | 1.10 |
| e+) ss4cut128s, letters on whole pixels, each advance rounded after adding 0.4 (extra) | EF | 1 | 5.8 (+4.3%) | 42 / 96 | 42 | 1.47 | 1.60 / 1.69 | 2.15 / 2.33 | 0.32 | 0.95 |
| e+) ss4cut128s, letters on whole pixels, each advance rounded after adding 0.4 (extra) | DF | 1 | 1.4 (+1.5%) | 16 / 58 | 14 | 0.58 | 1.53 / 1.51 | 2.15 / 2.24 | 0.37 | 1.10 |
| e+) ss4cut128s, letters on whole pixels, each advance rounded after adding 0.5 (extra) | EF | 1 | 5.8 (+4.3%) | 42 / 96 | 42 | 1.47 | 1.60 / 1.69 | 2.15 / 2.33 | 0.32 | 0.95 |
| e+) ss4cut128s, letters on whole pixels, each advance rounded after adding 0.5 (extra) | DF | 1 | 2.2 (+2.3%) | 12 / 58 | 12 | 0.38 | 1.53 / 1.55 | 2.15 / 2.23 | 0.34 | 1.09 |
| e+) ss4cut128s, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.1 (-1.8%) | 44 / 96 | 29 | 2.03 | 1.60 / 1.67 | 2.15 / 2.32 | 0.32 | 0.99 |
| e+) ss4cut128s, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 0.2 (+0.2%) | 5 / 58 | 2 | 0.57 | 1.53 / 1.49 | 2.15 / 2.24 | 0.30 | 1.09 |
| e+) ss4cut128s, letters on whole pixels, the feed at 12.5 px (extra) | EF | 1 | 3.5 (+1.4%) | 48 / 96 | 34 | 1.97 | 1.60 / 1.73 | 2.15 / 2.40 | 0.43 | 1.02 |
| e+) ss4cut128s, letters on whole pixels, the feed at 12.5 px (extra) | DF | 1 | 0.2 (+0.2%) | 5 / 58 | 2 | 0.57 | 1.53 / 1.49 | 2.15 / 2.24 | 0.30 | 1.09 |
| e+) ss4cut160s, letters on whole pixels, each advance rounded after adding 0.2 (extra) | EF | 1 | 3.5 (-1.7%) | 48 / 96 | 38 | 1.64 | 1.60 / 1.64 | 2.15 / 2.31 | 0.30 | 0.92 |
| e+) ss4cut160s, letters on whole pixels, each advance rounded after adding 0.2 (extra) | DF | 1 | 1.2 (+1.2%) | 17 / 58 | 15 | 0.49 | 1.53 / 1.55 | 2.15 / 2.23 | 0.27 | 1.07 |
| e+) ss4cut160s, letters on whole pixels, each advance rounded after adding 0.3 (extra) | EF | 1 | 5.1 (+2.7%) | 55 / 96 | 53 | 1.11 | 1.60 / 1.61 | 2.15 / 2.27 | 0.22 | 0.92 |
| e+) ss4cut160s, letters on whole pixels, each advance rounded after adding 0.3 (extra) | DF | 1 | 1.4 (+1.5%) | 17 / 58 | 15 | 0.48 | 1.53 / 1.53 | 2.15 / 2.23 | 0.26 | 1.07 |
| e+) ss4cut160s, letters on whole pixels, each advance rounded after adding 0.4 (extra) | EF | 1 | 5.5 (+4.0%) | 48 / 96 | 47 | 1.32 | 1.60 / 1.61 | 2.15 / 2.28 | 0.25 | 0.92 |
| e+) ss4cut160s, letters on whole pixels, each advance rounded after adding 0.4 (extra) | DF | 1 | 1.4 (+1.5%) | 17 / 58 | 15 | 0.48 | 1.53 / 1.53 | 2.15 / 2.23 | 0.26 | 1.07 |
| e+) ss4cut160s, letters on whole pixels, each advance rounded after adding 0.5 (extra) | EF | 1 | 5.5 (+4.0%) | 48 / 96 | 47 | 1.32 | 1.60 / 1.61 | 2.15 / 2.28 | 0.25 | 0.92 |
| e+) ss4cut160s, letters on whole pixels, each advance rounded after adding 0.5 (extra) | DF | 1 | 2.2 (+2.3%) | 13 / 58 | 14 | 0.14 | 1.53 / 1.51 | 2.15 / 2.21 | 0.25 | 1.07 |
| e+) ss4cut160s, letters on whole pixels, the feed at 12.34 px (extra) | EF | 1 | 3.1 (-1.8%) | 45 / 96 | 28 | 2.24 | 1.60 / 1.62 | 2.15 / 2.30 | 0.28 | 0.97 |
| e+) ss4cut160s, letters on whole pixels, the feed at 12.34 px (extra) | DF | 1 | 0.2 (+0.2%) | 4 / 58 | 2 | 0.42 | 1.53 / 1.45 | 2.15 / 2.21 | 0.25 | 1.07 |
| e+) ss4cut160s, letters on whole pixels, the feed at 12.5 px (extra) | EF | 1 | 3.4 (+1.3%) | 48 / 96 | 33 | 1.93 | 1.60 / 1.71 | 2.15 / 2.39 | 0.36 | 1.00 |
| e+) ss4cut160s, letters on whole pixels, the feed at 12.5 px (extra) | DF | 1 | 0.2 (+0.2%) | 4 / 58 | 2 | 0.42 | 1.53 / 1.45 | 2.15 / 2.21 | 0.25 | 1.07 |

Ordered by merged + split + 2 x width + 10 x mix + 20 x |ink - 1| (both fonts), the first ten families: cut208sg_e12.34 (86.4), ss4cut160sg_e12.34 (93.0), cut192sg_e12.34 (93.2), ss4cut128sg_e12.34 (95.0), cut192sg_e12.5 (95.6), area0.8s_e12.34 (100.7), ss4cut160sg_e12.5 (101.6), ss4cut128sg_e12.5 (105.9), cut224sg_e12.34 (106.0), cut208sg_e12.5 (106.5)

### The combinations proposed

| Variant | font | letter spacing | width px (%) | parts merged / of | split | letter px | gap his / var | stroke his / var | mix | ink |
|---|---|---|---|---|---|---|---|---|---|---|
| R1) feed: whole pixels, cut 208, smear, 12.34 px; bars: whole pixels, cut 192, smear | EF | 1 | 3.2 (-1.9%) | 39 / 96 | 34 | 1.90 | 1.60 / 1.56 | 2.15 / 2.30 | 0.24 | 0.91 |
| R1) feed: whole pixels, cut 208, smear, 12.34 px; bars: whole pixels, cut 192, smear | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.19 | 0.15 | 1.03 |
| R2) feed: whole pixels, cut 224, smear, 12.5 px; bars: whole pixels, cut 192, smear | EF | 1 | 2.6 (+0.6%) | 50 / 96 | 49 | 1.71 | 1.60 / 1.65 | 2.15 / 2.17 | 0.07 | 0.86 |
| R2) feed: whole pixels, cut 224, smear, 12.5 px; bars: whole pixels, cut 192, smear | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.19 | 0.15 | 1.03 |
| R3) feed: whole pixels, 4x cut, smear, shrunk, 12.34 px; bars: whole pixels, cut 192, smear | EF | 1 | 3.1 (-1.8%) | 44 / 96 | 29 | 2.03 | 1.60 / 1.67 | 2.15 / 2.32 | 0.32 | 0.99 |
| R3) feed: whole pixels, 4x cut, smear, shrunk, 12.34 px; bars: whole pixels, cut 192, smear | DF | 1 | 0.2 (+0.2%) | 0 / 58 | 1 | 0.23 | 1.53 / 1.50 | 2.15 / 2.19 | 0.15 | 1.03 |
| R4) feed and bars: each letter keeps 1.0 x its coverage, smear, whole pixels; feed 12.34 px | EF | 1 | 3.5 (-1.4%) | 54 / 96 | 30 | 2.77 | 1.60 / 1.45 | 2.15 / 2.79 | 1.12 | 1.24 |
| R4) feed and bars: each letter keeps 1.0 x its coverage, smear, whole pixels; feed 12.34 px | DF | 1 | 1.2 (+1.2%) | 26 / 58 | 6 | 3.49 | 1.53 / 1.32 | 2.15 / 2.46 | 0.60 | 1.22 |
| R5) feed and bars: each letter keeps 0.9 x its coverage, smear, whole pixels; feed 12.34 px | EF | 1 | 3.4 (-1.5%) | 52 / 96 | 33 | 2.19 | 1.60 / 1.53 | 2.15 / 2.66 | 0.81 | 1.13 |
| R5) feed and bars: each letter keeps 0.9 x its coverage, smear, whole pixels; feed 12.34 px | DF | 1 | 0.8 (+0.8%) | 18 / 58 | 11 | 1.26 | 1.53 / 1.46 | 2.15 / 2.34 | 0.39 | 1.13 |
| R6) feed and bars: each letter keeps 0.8 x its coverage, smear, whole pixels; feed 12.34 px | EF | 1 | 3.1 (-1.8%) | 46 / 96 | 32 | 2.46 | 1.60 / 1.56 | 2.15 / 2.39 | 0.42 | 1.02 |
| R6) feed and bars: each letter keeps 0.8 x its coverage, smear, whole pixels; feed 12.34 px | DF | 1 | 0.2 (+0.2%) | 5 / 58 | 3 | 0.59 | 1.53 / 1.50 | 2.15 / 2.26 | 0.24 | 1.06 |

## The kill feed's icons

His icons found where his picture matches the sprite best: row 1 m4a1 at 602,80 (ours 603,80), row 1 headshot at 657,81 (ours 657,80), row 2 ak47 at 564,100 (ours 563,100), row 2 headshot at 619,101 (ours 617,100), row 3 m4a1 at 596,120 (ours 598,120), row 4 ak47 at 653,140 (ours 654,140)

Each model: the sprite added onto his background (his icons taken out) at his icon's place, through his JPEG, against his pixels in the icon's box (RMS of the difference, 0 to 255; lower is closer). Rows 1 and 2 lie over the bright sky, rows 3 and 4 over walls.

| Icon | sharp | half-pixel bilinear | blur 0.5 px | blur 0.8 px | sharp at 80% | sharp at 120% |
|---|---|---|---|---|---|---|
| row 1 m4a1 | 22.4 | 21.3 | 22.1 | 22.0 | 22.6 | 22.4 |
| row 1 headshot | 31.1 | 31.8 | 29.6 | 29.5 | 31.1 | 31.6 |
| row 2 ak47 | 39.4 | 38.6 | 38.6 | 38.2 | 40.5 | 38.4 |
| row 2 headshot | 25.0 | 25.7 | 22.5 | 21.9 | 25.9 | 24.6 |
| row 3 m4a1 | 39.6 | 38.5 | 39.4 | 39.4 | 39.5 | 40.2 |
| row 4 ak47 | 20.8 | 19.6 | 20.1 | 20.2 | 22.5 | 20.0 |

A finer scan: the sprite blurred by a Gaussian of each width (0 = sharp), at the best of 9 sub-pixel offsets (0 or half a pixel either way), RMS against his pixels in the icon's box, after his JPEG:

| Icon | 0.0 | 0.2 | 0.4 | 0.6 | 0.8 | 1.0 | 1.2 | best |
|---|---|---|---|---|---|---|---|---|
| row 1 m4a1 | 21.3 | 21.3 | 21.3 | 21.4 | 21.9 | 22.4 | 23.0 | 0.4 |
| row 1 headshot | 29.2 | 29.2 | 29.1 | 29.0 | 29.2 | 29.6 | 30.1 | 0.6 |
| row 2 ak47 | 38.6 | 38.6 | 38.5 | 38.3 | 38.0 | 37.7 | 37.7 | 1.2 |
| row 2 headshot | 20.9 | 20.9 | 20.9 | 20.9 | 21.1 | 21.3 | 21.8 | 0.4 |
| row 3 m4a1 | 38.4 | 38.4 | 38.4 | 38.4 | 38.9 | 39.3 | 39.8 | 0.4 |
| row 4 ak47 | 19.6 | 19.6 | 19.6 | 19.5 | 19.9 | 20.4 | 21.2 | 0.6 |

## Colours

The most saturated fifth of each group's text pixels (the way the earlier mockup measured them), his shot against 0.28.0 put through his JPEG, and what 0.28.0 draws. Then the 1920x1440 shots of the same moment, whose strokes are 2 to 4 px wide, so their middles keep their colour through the JPEG.

| Group | his 800x600 | 0.28.0 through his JPEG | 0.28.0 draws | R1, through his JPEG | R6, through his JPEG |
|---|---|---|---|---|---|
| T names (feed) | 229 73 75 | 239 70 72 | 255 64 64 | 231 74 76 | 232 74 76 |
| CT names (feed) | 163 201 240 | 158 204 247 | 153 204 255 | 161 203 242 | 161 203 244 |
| bars (BaseText) | 235 178 46 | 246 177 23 | 255 176 0 | 240 178 37 | 241 178 34 |
| bottom name (T) | 225 75 76 | 238 71 74 | 255 64 64 | 232 73 73 | 232 74 75 |

| Group | his 1920x1440 (shot 163200, the most saturated fifth) | pixels |
|---|---|---|
| bars (BaseText) | 248 177 15 | 2337 |
| T names (feed) | 244 67 70 | 5381 |
| CT names (feed) | 156 204 250 | 3441 |
