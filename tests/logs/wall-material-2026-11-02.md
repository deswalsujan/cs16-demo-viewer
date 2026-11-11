# Wall material in the damage rule: measurement of 2 Nov 2026

A report only, no build (Sujan, 2 Nov 2026): measure the wallbang finder's damage rule with each wall's own material, against his answers first, and show him any confirmed answer that changes. From SK vs Na`Vi, Train, DreamHack Winter 2011, R23 1:21, Delpan on markeloff (IDEAS.md, **77 HP on a kill that looks normal**). Measured on 0.26.6 (pull request #31) with `tests/wall_material_variant.py` and `tests/page/wall_material_dump.js`, on Sujan's Mac.

## The rule today and the game's

`tooMuchDamage` (`src/ui/wallbangs.js`) drops a hidden kill when even the best case through a wall couldn't have done the damage: the gun's most damage x 0.6 (wood) x 4 for a headshot or 1.25 for a body hit x the killer's shots, against the victim's health before the kill. `computeHits` drops a hit through cover the same way ("too much for a wall").

ReGameDLL's `FireBullets3` (cbase.cpp): at each surface the bullet passes, `UTIL_TextureHit` (util.cpp) reads the texture there, drops a leading `-0`/`+0` and one of `{ ! ~`, and `TEXTURETYPE_Find` (sound.cpp) looks up its first 16 characters, any case, in `cstrike/sound/materials.txt`; a texture not listed is concrete. The damage left is then multiplied by the material's modifier: metal 0.2, grate 0.4, vent 0.45, computer 0.45, tile 0.3, wood 0.6; concrete, dirt, glass and the rest don't set one, so they keep the modifier of the surface before (0.5 at the first). Through several surfaces the modifiers multiply. Sujan's `materials.txt` has 701 textures.

## Three variants

On the killer's crosshair line at the shot (the line the finder already uses for "the crosshair goes through cover"), every surface's texture read at the point the line enters it (no surface whose texture couldn't be found, on the 7 demos probed):

- **A**: the kill rule with every surface's modifier multiplied, as the game does.
- **B**: A, and the hit rule the same way.
- **C**: the kill rule with one surface, the line's best material (concrete and unlisted 0.5, wood 0.6, metal 0.2 and so on), as today's rule takes one wall at wood's 0.6.

## Against Sujan's answers (`ground_truth_check.py`, 229 kills on 48 demos)

- A: 1 mismatch. Sweden vs Norway, Dust2, ASUS ENC 2010, R24 1:40, Delpan's AWP headshot on RashiE (100 HP), which Sujan confirmed as a real wallbang (CHANGELOG 0.15.5): the crosshair line crosses three concrete surfaces (`sandwlldoordj1`, `sandtrim`, `sandccrete`), 0.125 of the damage, at most 58, so it reads as a normal kill.
- B: the same 1 mismatch.
- C: 0 mismatches, the same 8 known gaps as 0.26.6. PASS.

## On the 64 test demos (`compare_all.sh` with `regress_summary.js`, against 0.26.6)

A, 8 strict wallbangs become normal kills (no other change but the bursts ending in them):

| Kill | Gun, health before | Surfaces on the crosshair line | Most damage left (0.6 today) |
|---|---|---|---|
| Sweden vs Norway, Dust2, ASUS ENC 2010, R24 1:40, Delpan on RashiE | AWP headshot, 100 | concrete door, trim, wall | 58 (276) |
| SK vs eSTRO, Train, WCG 2008, R20 1:32, RobbaN on bail | M4A1 headshot, 38 | metal (`traintop01`), concrete crate | 5 (79) |
| SK vs eSTRO, Dust2, WCG 2008 (`-0811081950-`), R13 1:12, hee on Tentpole | AWP body, 55 | two concrete walls | 36 (86) |
| the same, R19 0:52, bail on walle | AK-47 headshot, 21 | three concrete (crate top twice, ground) | 18 (86) |
| tyloo vs mTw, Nuke, e-Stars Seoul 2009, R7 C4 0:16, Sunde on 2q | AK-47, 2 shots, 7 | metal, wood crate, pavement | 6 (54) |
| Na`Vi vs FX, Train, SEC 2011 final, R19 0:45, Loord on markeloff | AK-47, 12 | concrete wheel end, dirt | 11 (27) |
| Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011, R5 0:17, demo 13:55, Fox on Zeus | AWP body, 74 | one concrete wall (`cuwlln`) | 72 (86) |
| SK vs Na`Vi, Train, DreamHack Winter 2011, R23 1:21, demo 44:25, Delpan on markeloff | AWP body, 77 | one concrete wall (`trainside01-2`) | 72 (86) |

B, the same 8, and 108 of the 1,153 damage bursts (on 46 demos) go: their hits are more than one bullet keeps through the line's surfaces, most of them M4A1 and AK-47 body hits of 21 to 26 through one concrete surface (at most 20 and 22). 21 to 26 is also what those guns do to a vest in the open, so these may be hits in the open whose crosshair line crosses cover; not checked. Sujan's 24 checked bursts (`docs/review-answers.md`, "Wallbang hits check") weren't matched against this.

C, 2 strict wallbangs become normal kills: Delpan on markeloff (SK vs Na`Vi, Train, DreamHack Winter 2011, the one Sujan asked about) and Fox on Zeus (Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011, R5 0:17), each an AWP body hit through one concrete wall on a player with more health than that leaves (77 and 74, at most 72 before armour and range). Nothing else changes. C's multiplier is never lower than A's, so C can only drop kills A drops; this run confirms it.

## What it shows

The game multiplies surface by surface, but the crosshair line recorded about ten times a second (and up to about 1.5° off, `LIMITS.md`) can cross more surfaces than the bullet did; that's the likely reason for Delpan on RashiE, whose line crosses a door, a trim piece and a wall (not checked by eye). So multiplying (A) breaks a confirmed answer, and taking each wall's own material for one surface (C) is the variant that fits all of Sujan's answers. Not built: Sujan decides.
