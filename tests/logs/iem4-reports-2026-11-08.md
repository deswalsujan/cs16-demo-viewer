# Reports on Sujan's feedback of 8 Nov 2026 (IEM4 World Championship): match rules and the wallbang finder

Measurements behind Claude's reports on points 5, 10 (the match rules) and 6 to 9 (the wallbang finder), before any change to the viewer (Sujan, 8 Nov 2026: report first, he decides). All on Sujan's Mac, on 0.26.20 (whose match and wallbang code is 0.26.19's), headless Chromium, the 74 test demos and 7 joined maps (`tests/DEMOS.md`). Scratch scripts, not kept in the repo: a page script that lists every round with the players on each side, and every source of team names; the same page with each variant of the rule applied where `derive` first marks the live rounds, all variants in one page load per demo (108 s for the 74 demos, 27 s for the joined maps); and page scripts that dump a hit's or a kill's data. The real results on HLTV.org and Liquipedia couldn't be read (both refuse automated fetches), so the numbers below come from the demos' own scoreboards.

## Point 5: rounds counted before both teams are full

compLexity vs WeMadeFox, Nuke (`auto-1003030847-de_nuke.dem`) reads WeMadeFox 16:6 in 22 rounds. The first stretch, 15 rounds from 0:0 (3:21 to 18:55), is a warmup: 1 against 1 at R1, 4 against 2 at R2, 5 against 5 from R6, the admin asking "rdy?" (7:53) and "col?" (13:35) in it, then "rdy for knife?" (19:04), a knife round (19:17), restarts, and the match from 20:34: 15 rounds to 7:8, the side swap, then 15 more from 48:10 to 8:7 (by the game's scoreboard), 15:15 at the end of the file. The viewer counts the warmup as the first half and stops at 16 seven rounds into the real one. So R1 isn't the only round wrongly counted: the whole first half is.

SK vs fnatic, Train (`auto-1003051321-de_train.dem`) reads Team 2 (SK) 16:2 in 18 rounds. GeT_RiGhT was gone from 8:11 to 17:10 and f0rest from 7:45 to 10:45 (their connections in the demo); in that stretch SK's face (his Steam ID, the same in fnatic vs SK, Inferno) played on fnatic's side, and the viewer counts those rounds. The match runs from 21:30.

The rule tried in four ways, on all 81 maps, against the current reading:

| Variant | Maps changed | Confirmed results it breaks |
|---|---|---|
| A, Sujan's words: a round counts only when both teams have 5 players at 5 s into it | 14 | mTw vs Lions, Nuke, DHS 2011: 10:16 would read 11:15; SK vs WinFakt, Mirage, IEM6 New York: 16:8 would read 16:7; the joined mTw vs Na`Vi, Tuscan, ESWC 2010 and WeMadeFox vs Ravens (16:13 would read 12:7): a drop or a late player inside the match takes the round out |
| B, Claude's reading: the match starts at the first round with both teams full; rounds after it count whatever the numbers | 7 | none, but 4 side effects (below) |
| G, B with two guards: a round the recording starts partway into is left alone, and so is a file where no round ever has both teams full | 3 | none |
| C, a knife round: rounds before the last knife round (3 kills or more, 60% or more of them with the knife) don't count | 2 | none |

B's side effects, gone with G: `mtw-vs-navi-eswc2010semi-real-1007031645-de_tuscan.dem` alone 3:3 to 2:3 and `virtus.attax.EMII-0803072013-de_train.dem` alone 0:2 to 0:1 (each file starts partway into a round, before every player is in a snapshot), and two SK vs eSTRO files from WCG 2008 with one team only (`-0811081854-de_dust2`, `-0811081945-de_nuke`).

What G changes:

| Map | Now | With G |
|---|---|---|
| compLexity vs WeMadeFox, Nuke, IEM4 | WeMadeFox 16:6 in 22, from 3:21 | 15:15 in 30, from 20:34, halves 7:8 and 8:7 (with R1 to R5 out, the warmup stretch is too short to be a half, so the existing false-start rule drops all of it) |
| SK vs fnatic, Train, IEM4 | SK 16:2 in 18, from 0:08 | fnatic 16:6 in 22, from 21:30, 11:4 at half time |
| mousesports vs mTw, Inferno, IEM4, part 2 opened alone | mousesports 14:9 in 23 | 14:8 in 22 (its first round at 16:13 had a team short); joined unchanged, 16:8 |

C changes only the first two, the same way. No score or K-D in `tests/expected/` changes with G or C (the files they change have no expected file); `ground_truth_check.py` not run on a build yet.

## Point 10: team names

Today: a name the player typed, else the file name (when it names both teams), else a clan tag most of a team's players share (looked up in the known teams), else Team 1 and Team 2. On the 81 maps: the file name wins in 39, the shared tag in 31; Team 1 and Team 2 in 11: 4 tournament demos (SK vs Na`Vi, Dust2, IEM4; fnatic vs SK, Inferno and Train, IEM4; iFNG FX vs fnatic, Dust2) and the 7 public-server POV games.

What each source finds:
- Shared clan tags: found for both teams in 64 maps. In the 20 where they disagree with the file name (18 demos and the 2 joined Xperia Play maps), the tag reads worse every time: "Frag eXecuto" (cut at 12 letters), "mymTw.com", "KOREA.eSTRO", "SKWEDEN", "fnaticMSI", "fnaticRC", "ESAHARA.net", "dt.REASPEL.s", "K1CK" and "Eq". So putting tags before the file name, as in Sujan's list, would make those 20 worse.
- Chat and HUD text: the ESWC 2010 and 2011 servers (VeryGames' AdminBot, 13 demos and 2 of the joined maps) print "<War: SK vs Navi>", "1st Warmup - SK(CT) vs Navi(T)" and "Current score : Navi (0) - (1) SK", which name both teams and their sides; every one of those demos already has its names from the file name or tags (spelled differently: "mTw.dk", "NaVi", "Again", "FAIRFRAG", "Burning!"). The IEM4 admin says only "rdy?", "col?", "mtw?", "knife". Players' "1:0", "3:1!!" in dead chat name no team.
- File names: 39, as today; the four tournament demos with Team 1 and Team 2 are named `auto-…`.
- So no source in the demo itself names the four. Sources outside the file that would: the folder a demo sits in (Sujan's were in `fnatic.sk.em4finals`), and the same players' Steam IDs with a tag in another demo of the folder (SK|RobbaN, SK|face and the rest in SK vs compLexity, Inferno, IEM4, with the same Steam IDs as in the three untagged files).
- Names shown today that look wrong: "MEET" for MeetYourMakers (`mtw.mym.consfinal.EM3-0903081339-de_dust2.dem`), "SWIIIIIDEEEN" for Sweden (Sweden vs Norway, ASUS ENC 2010), "Esahara" for eSahara.

## Point 6: a wallbang on a teammate

`computeWallbangs` (`src/ui/wallbangs.js`) leaves out suicides, grenades, knives and guns whose bullet stops at the first surface; it never compares the killer's and the victim's teams, so a teamkill through a wall is listed like any other (glow on solo, compLexity vs WeMadeFox, Nuke, R8 1:41 by today's numbering, which is in the warmup stretch above). The Kills tab has no TK tag on a kill row today: only the Players tab counts "1 TK", and the row shows WALLBANG under the gun.

## Point 7: Edward-FoCuS on Gux, SK vs Na`Vi, Dust2, R11 0:52 (demo 19:02), M4A1

The kill reads strict: 0 pixels of Gux in the picture check, none of the points in view, 18 units of the wall's top (`sandtrim`, concrete) on the crosshair line. One spray, a bullet every 0.1 s: Gux took 21, 21 and 21 (hit sound: kevlar) at 0.35, 0.30 and 0.20 s before the kill, standing, 6 of the 15 points in view; the recorded positions have him crouching from 0.10 s before the kill (z 36 to 18), behind the wall's top, 0 points in view; he took 21 again at 0.04 s before it and died to the bullet at 0.00 s. 21 is what an M4A1 does to an armoured chest in the open at 530 units; through 18 units of concrete it would be about half. So the game hit him in the open, though the positions have him already behind the wall: the server judges a hit against where the shooter saw the victim, a little back in time. This is the class of THREAT on LoordB and EdwardwOw~ on Delpan (`LIMITS.md`; Sujan's decision of 1 Nov 2026 that the finder keeps judging at the shot), with one difference: here the demo's damage proves it. The kill wasn't moved back to a shot (a fire event lands exactly on the kill message).

## Points 8 and 9: AWP leg hits listed as wallbang damage

The AWP (ReGameDLL `wpn_awp.cpp`): 115 damage, 0.99 per 500 units, a penetration of 3 and power 45. Through a surface, `FireBullets3` (`cbase.cpp`) multiplies what's left (a whole number) by metal 0.2, grate 0.4, vent and computer 0.45, tile 0.3, wood 0.6, anything else 0.5; `TraceAttack` (`player.cpp`) by head 4, chest and arms 1, stomach 1.25, legs 0.75; armour lets the AWP through at 0.5 x 1.95 = 0.975, on everything but the legs. The most an AWP does through one wall, at no distance:

| Wall | leg (no armour / armour) | chest or arm | stomach | head |
|---|---|---|---|---|
| concrete, and any texture not listed (keeps 0.5) | 42 / 42 | 57 / 55 | 71 / 69 | 228 / 222 |
| wood (0.6) | 51 / 51 | 69 / 67 | 86 / 84 | 276 / 269 |
| vent, computer (0.45) | 38 / 38 | 51 / 49 | 63 / 62 | 204 / 198 |
| grate (0.4) | 34 / 34 | 46 / 44 | 57 / 56 | 184 / 179 |
| tile (0.3) | 25 / 25 | 34 / 33 | 42 / 41 | 136 / 132 |
| metal (0.2) | 17 / 17 | 23 / 22 | 28 / 28 | 92 / 89 |

In the open: leg 86, chest 115, stomach 143, head 460, less 1% per 500 units.

| Hit | Damage, hit sound | AWP leg in the open at that distance | Lines from his eye | Wall |
|---|---|---|---|---|
| SK vs Na`Vi, Dust2, R30 1:30 (with **Count them**), RobbaN on Zeus | 83, flesh | 83 at 1526 units | feet, shins and knees clear; thighs up through the wall | `-0cssandwall`, concrete, 80 to 100 units |
| SK vs fnatic, Train, R15 1:36 (today's numbering), RobbaN on cArn | 84, flesh | 84 at 1131 units | feet, shins and knees clear; thighs up through the train car | `trainside02`, concrete, 126 units |
| the same, R15 1:33, RobbaN on face | 82, flesh | 82 at 1963 units | feet to pelvis clear; body and head through the train car | `trainside02`, concrete, 152 units |

Each damage is exactly an AWP leg hit in the open at that distance, the hit sound is "flesh" (a leg, or a body without armour), and the lines to his legs are clear. Neither explanation in Sujan's brief fits as put: the positions aren't wrong, and no wall lets 80 through to a leg (51 at most, through wood). The cause is in `computeHits`: a body hit is judged on the lines to the body's middle (origin + 10) and the crosshair, never the legs, so a leg shot under cover reads as through the wall. `tooMuchDamage` is the kill rule and doesn't judge hits; the hit rule's cap is the gun x 0.6 x 1.25, 86 for the AWP whatever the hit sound and the wall, so 82 to 84 pass it. The wall's own material (0.26.7) is used for kills only; with it, the cap here would be 71 (concrete) and all three would be thrown out. cArn was in the air at the shot: from z -188 he rises to -146 at the hit and -143 0.1 s later; the 3D view draws players 0.1 s back, about 9 units lower, which is why his legs look hidden behind the crate in Sujan's screenshot. face was a fnatic stand-in at that moment (point 5), so RobbaN's hit on him isn't on a teammate; with G or C the two Train hits are in no live round and leave the Wallbangs list.
