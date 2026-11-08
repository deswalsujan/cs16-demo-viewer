# Report, 9 Nov 2026: the one-bullet rule measured, and the two AK-47 kills through 903 and 606 units

Claude's report on Sujan's answers of 9 Nov 2026 (`STATE.md`, Decisions; IDEAS.md, **ED1KASDDSA's AWP on face reads STRICT WB from 100 HP** and **Batch A: gun flash, shells and blood puffs**). Nothing in the viewer is built. Measured on Sujan's Mac, headless Chromium, `HALF_LIFE_DIR=~/code/cs16-data/Half-Life`, `DEMO_DIRS=~/code/cs16-data/test-demos` (77 demos), on a measurement copy of 0.26.25 kept outside the repo.

## A. The one-bullet rule (ED1KASDDSA's AWP on face, SK vs EYESports, Inferno, Arbalet Cup Europe 2009, R24 1:22)

**The rule as measured.** In `tooMuchDamage` (`src/ui/wallbangs.js`), an AWP or Scout kill with no recorded shot of the killer's counts one bullet, unless the recording skips within the window, or the victim has a blood point or helmet sparks (TE_BLOODSPRITE or TE_STREAK_SPLASH within 40 units across and 48 up or down of him) earlier in the 0.6 s before the kill. For that, the measurement copy's reader keeps those two temp entities (`src/demo.js`, joined maps in `src/ui/open.js`).

**How it was measured.** Each demo opened once with the rule on, its wallbangs and damage rows read, then read again with the rule off (the finder run again in the same page). With the rule off the copy gives exactly what 0.26.25 gives (checked on SK vs EYESports against 0.26.25 itself). 77 demos in 3.6 minutes (`compare_all.sh`, 6 at a time), then `ground_truth_check.py` on the copy with the rule on, 2.2 minutes: 233 kills and 44 scores and K-D on 55 demos, 0 mismatches, the same 9 known gaps. No confirmed answer changes.

**What the rule looks at.** 46 AWP and Scout kills with no recorded shot reach it: 15 in demos that keep fire events, 31 in demos that lose them (it only sees kills that are wallbang candidates). It drops 19, leaves 12 alone because the recording skips there, and leaves 15 alone because one bullet through a wall could do it (headshots, or a victim on low health). The blood guard left none alone: no victim had a blood point or helmet sparks in the window before the kill. 14 of the 19 aren't wallbangs either way (the crosshair line is clear, or the picture check sees the victim), so nothing changes for them. Damage rows don't change on any demo.

**Every wallbang it drops** (5):

| Demo | Kill | Fire events | Victim's health before | Last health reading before the kill |
|---|---|---|---|---|
| SK vs EYESports, Inferno, Arbalet Cup Europe 2009 | R24 1:22, ED1KASDDSA on face, AWP, strict, 34 units | kept | 100 | 9.8 s (the round started 32.5 s before the kill) |
| SK vs eSTRO, Train, WCG 2008 semi-final (`-0811081900-`) | R15 1:30, hee on Tentpole, AWP, strict, 2 units | lost | 100 | 29.4 s: his respawn, no reading since |
| mTw vs MYM, Dust2, EM3 Global Finals 2009, consolation final | R14 0:55, Sunde on NEO, AWP, strict, 318 units | kept | 100 | 79.9 s: his respawn, no reading since |
| fnatic vs mousesports, Tuscan, ESWC 2011 (`1110231216`) | warmup, Gux on cArn, AWP, a teamkill | kept | 100 | 23.0 s: his respawn |
| fnatic vs Na`Vi, Dust2, GameGune 2012, grand final | warmup, f0rest on kArRiG4N, AWP, a teamkill | lost | 100 | 22.7 s: his respawn |

The two warmup teamkills were never in the Wallbangs tab (warmup, and a teamkill since 0.26.22). So in the 31 demos that lose fire events the rule takes one listed wallbang off, hee on Tentpole, and in the demos that keep them two, ED1KASDDSA on face and Sunde on NEO. None of the five is in `tests/expected/`.

**Can the health reading be trusted there?** The server sends the HLTV health message at the end of `TakeDamage` (ReGameDLL `player.cpp`: `int(health) | DRC_FLAG_FACEPLAYER`), so each bullet hit leaves its own reading, and a hit between the last reading and the kill would show. On the three listed kills: no blood point or helmet sparks on the victim anywhere in the round; Tentpole's and NEO's only hit sound in the round is the killing bullet's own `bhit_kevlar` (no blood fits an AWP body hit on a player with armour, where the game sends none). face's last reading, 9.8 s before the kill, came with two hit sounds and still read 100, so they took nothing off; nothing hit him after it.

**Proposed for the build:** the rule as measured, with the guard, as its own pull request (`notes/gun-flash` folded in), after Sujan's go. The reader then keeps the blood points, which Batch A needs anyway for the blood puffs.

## walle on XEK (R26 1:33) and RobbaN on ED1KASDDSA (R28 1:04), AK-47, SK vs EYESports

**Cause: the crosshair line leaves out the recoil.** Both killers duck at the same spot in banana (180, 1292) and spray at B site, 1,423 and 1,205 units away; both kills come late in a long spray (RobbaN's is his 15th bullet). HLTV records each player's view angles, but the bullet flies along the view angles plus the recoil (`AK47Fire`, `wpn_ak47.cpp`: `UTIL_MakeVectors(v_angle + punchangle)`), and a player pulls his aim down against it. The fire event carries that recoil (`iparam1` and `iparam2`, punchangle x 100) and the shot's spread (`fparam1` and `fparam2`, what `FireBullets3` returns). For the two killing shots the recoil is 4.27 and 4.28 degrees up; the recorded aim is 2.79 and 2.08 degrees down, so the bullets went 1.48 and 2.20 degrees up, where the victims were (1.77 and 2.56 degrees up). The viewer's crosshair line uses the recorded aim alone, so it runs into the ground in front of B site: the 903 and 606 units are ground (`pi_corbel`, `cugroundi`).

**On the bullet's line** (the recorded aim plus the killing shot's recoil and spread): walle's line ends 8 units from XEK's middle and RobbaN's 4 units from ED1KASDDSA's, and each crosses one wall, `cuwllj` (concrete in the materials list's terms: not listed), 212 and 162 units along the line. The server's own blood point from RobbaN's killing bullet, on ED1KASDDSA's head (TE_BLOODSPRITE size 12 with TE_BLOODSTREAM, the headshot), is behind the same wall: the line from RobbaN's eye to it crosses 166 units of it.

**Does any gun get through that much?** In the game's own code, a wall's thickness doesn't stop a bullet: after the first surface, `FireBullets3` starts the next trace only `iPenetrationPower` units further on (39 for the AK-47's bullet, x 0.25 on concrete: 9 units), inside the wall, and the engine's trace from inside a wall goes on through it to whatever comes next (`SV_RecursiveHullCheck` and `SV_Move` in ReHLDS, a reverse-engineered copy of the HLDS engine, and the same in Xash3D). What limits it is the gun's number of surfaces (the AK-47's 2: one wall, then the player) and the material (concrete keeps 0.5). The demo's health agrees: the hits XEK took in the half second before the kill read 15, 12 and 12 HP. An AK-47 bullet from walle's spot does 34 at the wall, 17 after the concrete, 16 at XEK, 12 on armour (15 on the stomach); in the open it would be 25 (31 on the stomach). So both kills look like real wallbangs through that wall, and only the thickness the viewer shows is wrong. Sujan's check in the game outranks this: in the game's demo player, R28 1:04, a free camera behind ED1KASDDSA should show the blood from RobbaN's last bullet on the far side of the wall from banana.

**Proposed fix:** the thickness the viewer shows for a wallbang (the WB tag's tooltip, **Copy list**'s "(N units)") measured on the bullet's line, the recorded aim plus the killing shot's recoil and spread from its fire event, when the event has them; as now otherwise, and the line to his middle when the bullet's line is clear (as now when the crosshair line is). Which kills are wallbangs, and the wall's material in the damage rule, stay on the recorded crosshair line. It needs the reader to keep each fire event's four values, which the one-bullet rule's pull request touches anyway, so it could go into that pull request; Sujan decides. Measured on the same run (the 767 wallbangs listed with the rule on): 664 have the recoil in their killing shot's fire event; on the bullet's line 391 read within 10 units of today's number, 111 less wall, 78 more, and 84 cross no wall. 66 read 200 units or more today; of those with the recoil recorded, most drop to the wall itself (walle on XEK 903 to 212, RobbaN on ED1KASDDSA 606 to 162, f0rest on markeloff, Na`Vi vs SK, Inferno, ESWC 2011, R19 0:36, 879 to 106).

**Not proposed: the bullet's line deciding wallbangs.** Of the 84 whose bullet's line crosses no wall, 79 are LOOSE and 49 are Sujan's confirmed answers (Edward-FoCuS on Gux, SK vs Na`Vi, Dust2, IEM4, R11 0:52, among them). That fits a loose wallbang from damage, whose verdict comes from an earlier bullet of the spray through a surface, with the killing bullet in the open. The other 5 are strict. Written down in IDEAS.md for later, measured against the answers before anything changes (**The crosshair line leaves out the recoil**).

## For Batch A: where the gun flash goes from behind

Sujan's reading of cs16-client's `GameStudioModelRenderer.cpp` holds: in `_StudioDrawPlayer`, when the `p_` gun model has attachments (`WeaponHasAttachments`), the shot events run after the gun is drawn, with the gun's attachments copied over the player model's (`memcpy(saveent.attachment, ...)`, then `StudioClientEvents`); with none, they run before, on the player model's own attachment.

Read from the stock `p_` models in Sujan's folder, each in its own first pose, against its geometry along its barrel:
- **No attachments:** `p_m4a1.mdl`, `p_scout.mdl`, `p_m3.mdl` (and `p_m3super90.mdl`, which the game doesn't use), and the ones with no gun flash anyway: `p_knife.mdl`, `p_c4.mdl`, `p_flashbang.mdl`, `p_hegrenade.mdl`, `p_smokegrenade.mdl`. So the M4A1 (silenced or not, one model), the Scout and the M3 flash from the player model's attachment at the right hand, mid-gun.
- **Attachment 0 at the muzzle:** every other gun, within 0.6 to 1.8 units of the end of its geometry (the FAMAS 3.2 units past it, on bone `p_famas`; the others on a bone named `flash`, the MP5's `Mflash`, the Galil's on `p_galil`). The Elites have two: `rflash` and `lflash`, one at each gun's muzzle, for the events 5001 and 5011. The shield model's is on its Five-SeveN.
- **None away from the muzzle:** no stock `p_` model has attachment 0 anywhere but the muzzle.

So by Sujan's rule, the Scout's and the M3's gun flash from behind sit mid-gun like the M4A1's.

**Files:** on 9 Nov 2026 Sujan copied Windows' whole `valve` folder over the Mac's. Found: `valve/sprites/blood.spr` (9 frames, 16 px), `bloodspray.spr` (10 frames, 64 px), `blooddrop.spr`, both decoded; `valve/models/shotgunshell.mdl` (a version 10 model). The viewer's folder pick already keeps `valve/models/*.mdl`, with `cstrike`'s own files first; the sprites need Batch A's change to the file list (`HL_WANT` in `src/ui/folder.js`).

## Test run for A's pull request

After Sujan's go: a check that fails on 0.26.25 (ED1KASDDSA's kill on face in the Wallbangs tab), `compare_all.sh` on the 77 demos to confirm the five changes above and nothing else (about 4 minutes), and the seven checks (about 4 minutes, `ground_truth_check.py` 2.2 of them). About 10 minutes in all.
