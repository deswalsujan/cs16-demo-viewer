# Report, 9 Nov 2026: ED1KASDDSA's AWP, the counts, and the Batch A plan

Claude's report on Sujan's answers and questions of 8 Nov 2026 (`STATE.md`, Decisions; IDEAS.md, **Batch A: gun flash, shells and blood puffs** and **ED1KASDDSA's AWP on face reads STRICT WB from 100 HP**). Nothing in the viewer is changed. Game code read in ReGameDLL (a reverse-engineered copy of CS 1.6's server code, checked out 9 Nov 2026); what the player's own game draws is read in cs16-client and Xash3D, rebuilds of CS 1.6's client and of the engine, not Valve's code. Sujan's checks in the game outrank all of it.

## A. ED1KASDDSA's AWP kill on face (SK vs EYESports, Inferno, Arbalet Cup Europe 2009, R24 1:22)

**What the game allows.** `wpn_awp.cpp`: `AWPFire` fires one bullet of 115 (`AWP_DAMAGE`), range modifier 0.99 per 500 units, and `PrimaryAttack` waits 1.45 s between shots. `FireBullets3` (`cbase.cpp`): after a surface the bullet keeps 0.5 (concrete, anything not in the materials list), 0.6 at best (wood). The player's `TraceAttack` (`player.cpp`): at most 1.25 short of a headshot (stomach). So one AWP bullet through any wall does at most 115 x 0.6 x 1.25 = 86 before range and armour. Here the wall on his crosshair line is 34 units of concrete (0.5): at most 72. face had 100 HP.

**What the viewer does.** It lists the kill STRICT WB as a sliver kill: part of face is in view to the finder's 15 sight points, his crosshair line runs through 34 units of wall, and the picture check sees 0 pixels of him. `tooMuchDamage` (`src/ui/wallbangs.js`) is the rule that should drop it, and it returns false: it counts the killer's fire events between face's last health reading and the kill, and there are none. On 0 shots it gives up by design ("the number of bullets isn't known, so leave it"), which was written for a jump in the recording.

**Why there's no fire event.** The demo has no event from ED1KASDDSA within 3 s of the kill (6,214 gun fire events in the demo; the kill's snapshot holds other players' M4A1 events). In that same snapshot (demo time 2529.76) his player model starts `ref_shoot_rifle` and his gun model changes from `p_awp.mdl` to `p_flashbang.mdl`; 0.22 s later it's the AWP again. That's the quick switch after a shot. The server still sends the AWP's late shell for it: a Brass message from him at 2531.27, after the AWP was out again. Why the engine drops the fire event isn't in ReGameDLL (the engine's event code isn't), so the cause stays "not recorded".

**How often.** Over the 77 test demos (gun kills: AK-47, AUG, AWP, Desert Eagle, FAMAS, G3SG1, Galil, M249, M4A1, Scout, SG550, SG552):
- 46 demos keep their fire events (90% or more of gun kills have one): 182 of 9,088 gun kills have no fire event of the killer in the 0.6 s before; 90 of them have a gun switch in the kill's snapshot; 40 are AWP or Scout kills. markeloff does the same switch, to the knife, after his AWP shot at R23 1:22 of SK vs Na`Vi, Train, DreamHack Winter 2011 (found while making the mockup).
- 31 demos lose fire events (most of 2008 and 2009): 2,727 of 6,820 gun kills have none; 844 are AWP or Scout kills.

**Proposed fix.** In `tooMuchDamage`, for the AWP and the Scout only: a kill with no recorded shot counts one bullet, unless the recording skips within the window. Neither gun can fire twice in the rule's 0.6 s window (1.45 s between AWP shots, 1.25 s between Scout shots, their `PrimaryAttack`), so one bullet is exact whether or not the event was recorded. Other guns stay as now: without the events the number of bullets isn't known. With it, this kill needs 100 where at most 72 gets through: it leaves the Wallbangs tab and the Kills list's WALLBANG tag, and its kill details read as a hit in the open.

Not proposed: counting the shot from the Brass message (shells pair loosely with shots: their delay runs from 0.5 to 1.8 s with switches and draws, and in SK vs Na`Vi 64 of 198 shells match no AWP fire event 0.4 to 1.8 s before them); from the player model's shoot animation (only 33 of the 182 kills above show one in the snapshots, ten a second).

**Before building.** Measured on every test demo with the change on and off (`compare_all.sh`, 77 demos, about 7 minutes) and `ground_truth_check.py` (about 2 minutes), every wallbang that changes listed; if a confirmed answer in `tests/expected/` changes, stop and show Sujan. Most of its reach should be in the demos that lose fire events, and only body-shot AWP and Scout kills on more health than a wall leaves change.

**Seen in the same demo, not looked into:** walle on XEK (R26 1:33, AK-47) and RobbaN on ED1KASDDSA (R28 1:04, AK-47) read STRICT WB through 903 and 606 units of wall (IDEAS.md, in the item above).

## B. What HLTV recorded: counts on two test demos

SK vs EYESports, Inferno, Arbalet Cup Europe 2009, and SK vs Na`Vi, Train, DreamHack Winter 2011 (quarter-final, map 2). Temp entities in the whole file, warmups included; read with a copy of `src/demo.js` that keeps them (it skips them today, except explosions).

| Message | What it is | EYESports | SK vs Na`Vi |
|---|---|---|---|
| TE_BLOODSPRITE (115) | blood puff at the hit point (`UTIL_BloodDrips`) | 277 | 552 |
| TE_STREAK_SPLASH (25) | sparks on a helmet headshot (`TraceAttack`) | 123 | 206 |
| TE_BLOODSTREAM (101) | blood stream on a headshot without a helmet (`BloodSplat`) | 36 | 123 |
| TE_WORLDDECAL (116) | a mark on the world: blood on walls, HE scorch | 495 | 952 |
| TE_DECAL (104) | a mark on a door or other brush object | 9 | 5 |
| TE_PLAYERDECAL (112) | players' spray logos | 166 | 278 |
| TE_GLOWSPRITE (23) | the planted C4's light (all `sprites/ledglow.spr`) | 179 | 230 |
| TE_BREAKMODEL (108) | glass and wood shards | 22 | 5 |
| TE_EXPLOSION (3) | HE explosions and others | 324 | 534 |
| Brass (user message) | the AWP's, Scout's and M3's shell, from the server | 95 | 198 |

None of TE_WORLDDECALHIGH, TE_DECALHIGH, TE_GUNSHOTDECAL or TE_MODEL in either: bullet holes are drawn by each player's own game, so no demo has them, which fits keeping them parked.

**Blood against the hits the viewer knows** (live rounds; blood sprites and helmet sparks, both sent at the bullet's hit point):

| | EYESports | SK vs Na`Vi |
|---|---|---|
| points in live rounds (blood + helmet sparks) | 318 (230 + 88) | 490 (361 + 129) |
| within 40 units of a player | 318 | 490 |
| on a hit the viewer knows (`computeHits`) | 150 | 279 |
| on a killing bullet | 106 | 155 |
| on a health drop the viewer saw but didn't pin on a shooter | 58 | 56 |
| on nothing | 4 | 0 |
| the viewer's hits with a point: flesh sound | 109 of 121 | 191 of 212 |
| kevlar sound | 22 of 245 | 62 of 519 |
| helmet or headshot sound | 19 of 19 | 26 of 26 |

Armoured body hits rarely have one because the game sends none: `TraceAttack` makes no blood on a chest, stomach or arm hit on a player with armour, and a helmet headshot gives sparks instead; legs always bleed. So the game itself shows no puff on most body hits in a pro match, and the viewer would show exactly what the game did.

**Could the exact point feed `bodyPart` and the wallbang finder?** Its height above his feet tells head from the rest (helmet sparks 41 to 62 units, middle 56). Against `bodyPart`'s estimate from damage, rough height bands agree on 74 and 122 hits and disagree on 28 and 51, mostly chest against stomach at 35 to 40 units, where height bands are too rough: it would need the player model's hitboxes in his pose. The line from the shooter's eye to the point, against the finder's own call on each hit, agrees on 136 of 150 and 268 of 279; where they differ it's mostly the point's line through cover and the finder's in the open (14 and 7, the other way 0 and 4). The point is where the bullet really went, but the server judges hits on players moved back to where the shooter saw them, so it can sit a few units from where HLTV has the victim. Worth its own look later; nothing in the finder changes in this batch.

## C. The Batch A plan

**Gun flash.**
- What draws it in the game: an event on the first frame of each shoot animation. Its options pick the sprite and size, as Xash3D's `R_MuzzleFlash` reads them: options "XY" give `muzzleflash` number (Y mod 10 mod 3) + 1 and scale X / 10 (1 pixel of sprite is 1 unit). The sprite lives one frame, additive, at a random frame and roll. Sprites: `cstrike/sprites/muzzleflash1.spr` (48 px, 1 frame), `muzzleflash2.spr` (64 px, 3 frames), `muzzleflash3.spr` (72 px, 3 frames).
- Player's eyes, from the `v_` models in Sujan's folder: AK-47, AUG, FAMAS, Galil, SG552, SG550, G3SG1, M249 "22" (muzzleflash3, 0.2); AWP "31" (muzzleflash2, 0.3); Scout, Desert Eagle, Glock, M3, XM1014 "21"; MP5, MAC-10, UMP45, P228, Five-SeveN, TMP "11"; P90 "12"; the Elites 5001 and 5011 on each gun; M4A1 unsilenced 5021 "22", silenced 5001 "11"; USP unsilenced 5021 "11", silenced 5001 "11".
- In 3D on every player: the `p_` models carry no events; the player model's shoot animations do: AK-47 and carbine "40", rifle and MP5 "30", one-handed "10", dual pistols "10" on each hand, shotgun and M249 "50". Its attachment is at the right hand (10.85 units out from `Bip01 R Hand`), so the third-person gun flash sits at the gun's middle, not its muzzle (mockup frame 3).
- **Question for Sujan, the silenced guns:** the models don't confirm "no gun flash". The silenced M4A1's shoot animations carry 5001 "11": muzzleflash2 at 0.1, 6 units, at the silencer's tip (attachment 0, 18.5 units out; the bare muzzle's is at 14.25). The silenced USP and the TMP carry the same, and cs16-client plays every 5001 event with no silencer check. In third person the player model's rifle and one-handed shoot animations don't know about silencers either, so another player's silenced M4A1 would flash like an unsilenced one. Mockup frames 5 and 6 show both; what the game shows, first person and on another player, decides it.
- **Question for Sujan, a shot from the scope:** the viewer keeps the scope for 0.1 s after a sniper shot (0.10.0), so in Player's eyes the AWP's one-frame gun flash would fall inside the scope. Frame 4 draws it on the first frame that shows the gun; the other way is no gun flash on shots from the scope.
- When: at each fire event, the same time base as the gun animation, so the 3D view's 0.1 s delay applies; one frame long. The Scout gets one like every gun (Sujan, 8 Nov 2026). **Vanilla** keeps it (Sujan, 8 Nov 2026). In **POV mode**, the recorder's own shots drive his gun's flash.
- The short light (the engine's EF_MUZZLEFLASH light: about 200 to 231 units, 0.1 s): cheap on player models, which use three.js's lit material: a few lights made once and kept dark between shots, so nothing is rebuilt. The map's walls use the viewer's own lightmap shader, so lighting them needs a change there; proposed: models only.
- Code: `src/ui/folder.js` reads the three sprites from the picked folder (its file filter doesn't take them today), `decodeSpr` extended to every frame; `src/players3d.js` and `src/view3d.part.js` place and draw them (the mockup's attachment and event reading is the core of it).

**Shells.**
- Rifles, pistols, SMGs and the XM1014: each player's own game ejects them at each fire event (cs16-client's `EV_EjectBrass` in each gun's event): in third person from his eye, 20 forward, 12 down, 4 to the side; in first person 20 forward, 8 down, 10 to the side; flying at half his speed plus 50 to 70 to the side, 75 to 175 up and 25 to 250 forward; 2.5 s; `rshell.mdl` for rifles, `pshell.mdl` for pistols and SMGs, `shotgunshell.mdl` for the XM1014. Rebuilt from the fire events like the gun animation. The side they fly to is checked in the game during the build (the rebuild's sign reads as the left; the mockup throws them right).
- AWP, Scout and M3: the server ejects them 0.55, 0.56 and 0.45 s after the shot (`EjectBrassLate`, `weapons.cpp`) as a Brass message, which the demo records with the exact spot, speed and model (`rshell_big.mdl`); drawn from those. A Brass message with model 0 (the gun was switched) shows nothing.
- Gravity 800, a bounce on the map, and one landing sound each: `valve/sound/player/pl_shell1.wav` to 3 (in Sujan's Mac folder), `valve/sound/weapons/sshell1.wav` to 3 for shotgun shells. One shared model per shell type, so a spray of 30 is cheap.
- `shotgunshell.mdl` isn't in the Mac's Half-Life folder (no `valve/models` there); without it, no XM1014 and M3 shells.

**Blood puffs.**
- From the demo: each TE_BLOODSPRITE at its exact point, with its size (3 to 16, from the damage before armour), drawn as the engine's `R_BloodSprite` does: `bloodspray.spr` for the puff, `blood.spr` for drops. Proposed in the same batch, since they're the same shot feedback: TE_STREAK_SPLASH as sparks on a helmet headshot, and TE_BLOODSTREAM on a headshot without a helmet. The reader keeps them (about 400 to 900 a demo).
- `valve/sprites/bloodspray.spr` and `blood.spr` aren't in the Mac's Half-Life folder: its `valve` holds only the `.wad` files and `sound` (so the mockup's puff is a stand-in). Windows' full install should have them; for the build's tests and screenshots on the Mac, Sujan copies `valve/sprites` from `D:\SteamLibrary\steamapps\common\Half-Life\valve\sprites`. Without the files, no blood puff.
- **Vanilla**: proposed to keep shells and blood puffs too, as the game's own look, unless Sujan says otherwise.

**Mockup:** `docs/proposed/gun-flash-shells-blood-mock.jpg` (moved to `docs/gun-flash-shells-blood-mock.jpg` on 9 Nov 2026, once Sujan answered it), rendered in the viewer from Sujan's own game files on SK vs Na`Vi, Train, DreamHack Winter 2011: 1. Zeus's AK-47, Behind player, R5 C4 0:17 (three shells in flight); 2. starix's AK-47, Player's eyes, R3 1:12 (two shells in flight); 3. markeloff's AWP, Behind player, R23 1:22; 4. markeloff's AWP, Player's eyes, R10 1:16; 5 and 6. RobbaN's silenced M4A1, Player's eyes, R5 C4 0:21, with no gun flash and as the model's event has it; 7. the blood puff (stand-in sprite) on face from Zeus's AK-47, R8 1:36. Times as the Kills list gives them.

**Test run for the build** (after Sujan's go on the mockup and the two questions): checks that fail on 0.26.25 (a gun flash at a known fire event for one frame, at the attachment; shells after a spray; the blood puffs of a round equal to its recorded blood sprites); `compare_all.sh` on the 77 test demos to show no score, K-D or wallbang changes (about 7 minutes); the seven checks (about 4 minutes); screenshots at 1512x982 and 2560x1440. About 15 minutes in all. The fix in A is measured on its own first: about 9 minutes (`compare_all.sh` and `ground_truth_check.py`).
