# dsn's AWP leg hit on Edward-FoCuS: the cause, and leg hits judged on five heights (8 Nov 2026)

Sujan's report on 0.26.23 (8 Nov 2026): Na`Vi vs fnatic, Train, IEM4 World Championship, the final by his folder name (`auto-1003061629-de_train.dem`), R14 1:31: dsn's AWP hit on Edward-FoCuS, 82 HP, is still a DAMAGE row in the Wallbangs tab, where he sees a direct leg shot: in **Player's eyes** Edward-FoCuS's legs show through the gap under the train car, between the wheels, his body behind the car. A report only: nothing in `src/` is changed until Sujan answers. All on Sujan's Mac, headless Chromium, `HALF_LIFE_DIR=~/code/cs16-data/Half-Life`, `DEMO_DIRS=~/code/cs16-data/test-demos` (75 demos).

## The hit, as 0.26.23 reads it

- Demo 1313.94, the fire event, the hit sound (`bhit_flesh-1`) and his health 100 to 18 all in one snapshot. dsn crouched, 1782 units away; the finder's note: "cover by 3 off 22" (dsn, 22 units off his line).
- `openParts`: 82 with the flesh sound at 1782 units fits a leg only (`['leg']`), and `openLow` is 82: exactly what an AWP does to a leg in the open there. So the damage did point to the legs, and the line to the legs was tried.
- Edward-FoCuS is standing (not ducking) and in the air: he jumped about 0.2 s before (his origin -188, -175, -165, -157, -151 over the last 0.2 s, the floor at -224), so his feet are 37 units off the floor at the hit, still rising.
- What's on dsn's line: the train car, worldspawn (side texture `trainside01-1`, underside `black`), solid from z -175 to -91, from 180 to 510 units in front of Edward-FoCuS; under it a clear gap of 50 units down to the floor (-225). No wheel and nothing else on this line between the floor and the car's bottom.
- The line to his middle (origin +10) runs 336 units through the car, and so does the crosshair line.
- The leg line (`PART_Z.leg`, origin -20 standing: 16 units above his feet, about the knee) is 2 units too high: at the car's front edge it's at z -173.7, just inside the car's flat underside, and runs 112 units in it (from 172 to 282 units in front of him). Every line from his feet up to origin -22 (14 units of his legs) passes under the car, clear.

So the cause: one point per body part. The leg line aims at the knee, and only his feet and shins showed under the car.

The 0.1 s lag: a snapshot back (0.05 s) his legs are clear up to origin -17, and 0.1 s back (where the 3D view draws him, 14 units lower in his jump) up to origin -8, so in what Sujan sees the knee line would be clear too. The finder keeps judging at the shot (Sujan, 1 Nov 2026), so the proposed fix doesn't use it.

## Proposed fix: a leg hit judged on five heights

A hit whose damage fits a leg in the open is judged on lines to five heights on him, from his feet to his hips, in place of the one at the knee: origin -32, -26, -20, -14 and -8 standing (4 to 28 units above the feet), -16, -10 and -4 ducking. It's in the open when any of them is clear, as today with the knee line, the line to his middle and the crosshair line. The knee line is one of the five, so a hit in the open on 0.26.23 stays in the open; only hits through cover can change. Chest and stomach keep their one line.

Measured in a copy of 0.26.23 with the change and a switch, each demo with its map, the Wallbangs tab read with the switch off and on in one page (`compare_all.sh`, 75 demos, 4.6 minutes). No wallbang kill changes, in either level. DAMAGE rows 620 to 617.

Hits that move from through a wall to in the open (8), with the heights clear on him (origin-relative) and what covers the knee line:

| Demo | Hit | Clear | Knee line |
|---|---|---|---|
| Na`Vi vs fnatic, Train, IEM4 final (`auto-1003061629-de_train`) | R14 1:31 dsn > Edward-FoCuS awp -82, 1782 u, in a jump, feet 37 off the floor | -36 to -22 (feet and shins) | 112 u of the train car's underside |
| the same | R2 1:32 THREAT > cehe4ka m4a1 -21, 1056 u, feet 32 off the floor | -36 to -26 (feet) | 14 u of `wood01` |
| the same | R2 1:31 THREAT > Edward-FoCuS m4a1 -21, 1059 u, on the floor | -18 to +8 (thighs and hips) | 16 u of `crete3_wall02`, 90 u in front of him |
| Sweden vs Norway, Dust2, ASUS ENC 2010 (`53.52.1646548-1005272144-de_dust2`) | R5 C4 0:00 FoReSt > RashiE ak47 -24, 1569 u, on the floor | -36 to -28 (feet) | 16 u of `-0cssandwall` |
| FX vs eSahara, Nuke, DreamHack Winter 2010, playoffs (`fx-vs-esahara-dhw2010-1011271131-de_nuke`) | R19 C4 0:20 742 > sadliGENO ak47 -26, 433 u, on the floor | -14 to +4 (thighs and hips) | 8 u of `silo2_cor`, 25 u in front of him |
| mTw vs MYM, Dust2, EM3 Global Finals 2009, consolation final (`mtw.mym.consfinal.EM3-0903081339-de_dust2`) | R21 1:08 LoordB > zonic ak47 -25, 1138 u, on the floor | -36 to -28 (feet), and +16 up (chest and head) | 2 u of `sandtrim` |
| MYM vs fnatic, Train, probably CPL Winter 2006, final (`mym.fnatic.final-0612201357-de_train`) | R15 1:00 prb > Archi ak47 -25, 1195 u, ducking | -18 to -12 (feet) | 4 u of `trainside02-1`, near prb |
| Virtus.pro vs aTTaX, Inferno, Extreme Masters II, the third file (`virtus.attax.EMII-0803072033-de_inferno`) | R24 1:05 mooN > Ioann S. <Edward> m4a1 -21, 1053 u, 9 off the floor | -36 to -30 (feet) | 2 u of `cuwlla` |

The rifle hits are of 21 to 26 HP with the flesh sound. On a victim with armour, flesh means a leg (the game plays the kevlar sound for an armoured body, as `HIT_LOW` in `src/ui/wallbangs.js` reads `Pain` in ReGameDLL's `player.cpp`), and a bullet through a wall keeps at most 0.6 (`MAX_DMG`'s note there), so these are leg hits in the open whatever the lines say. On one without armour (R2 is the round after the pistol round), flesh is also the body, and by the finder's own damage figures (`GUN_DMG`, `openParts`) a stomach hit through a 0.6 wall can do what a leg does in the open (an AK at 433 units: 26 either way); the viewer doesn't read an HLTV demo's armour, so those two R2 hits can't be told apart from the damage alone.

What changes in the Wallbangs tab and the numbers:

- DAMAGE rows gone (3): Na`Vi vs fnatic, Train, R14 1:31, Edward-FoCuS 82 (dsn -82); FX vs eSahara, Nuke, R19 C4 0:20, sadliGENO 38 (742 -26, -12); mTw vs MYM, Dust2, EM3, R21 1:08, zonic 40 (LoordB -25, -15).
- A wallbang kill's numbers lose a hit (1): Na`Vi vs fnatic, Train, R2 1:32, cArn's kill on cehe4ka: 70 (THREAT -21, cArn -12, cArn -37 HS) becomes 49 (cArn -12, cArn -37 HS), from 1:31.
- The other 4 hits weren't in a listed row: they change from orange to white in **Damage numbers**, and kill details can name the part (leg*) instead of "body".

The hit list was compared by moment and victim, so a hit sharing its moment with another hit on the same victim could have been left out (one such pair, XioNe's -20 and -9 on dsn, MYM vs fnatic, Train, R19 1:10, checked by hand: in the open in both modes). The rows and their numbers are compared in full.

## Checks

- `ground_truth_check.py` on the changed copy: 232 kills and 43 scores and K-D on 53 demos, 0 mismatches, the same 8 known gaps, 0 skipped (1.9 minutes): PASS.
- `computeHits` run again three times on 0.26.23 (MYM vs fnatic, Train) gives the same hits, kills and rows each time.
