# SK vs AGAiN, Train, Arbalet Cup Europe 2009: Claude's report on Sujan's four points (8 Nov 2026)

Sujan's batch of 8 Nov 2026 on a new demo, `SK_vs_AGAiN_ArbaletEU-0912051316-de_train.dem` (moved from `~/Downloads` into `~/code/cs16-data/test-demos` the same day; the event from the demo's own text, "<Arbalet Cup Europe Server 1>", the admin plugin's server name, and "ArbaletEU" in the file name; recorded 5 Dec 2009 at 13:16 by the file name). A report before building: nothing in `src/` is changed until Sujan answers. Measured on 0.26.24 (pull request #55) and on a copy of it with the three proposals below behind switches; every test demo with its map (76), 4.2 minutes. All on Sujan's Mac, headless Chromium, `HALF_LIFE_DIR=~/code/cs16-data/Half-Life`, `DEMO_DIRS=~/code/cs16-data/test-demos`.

## 1. Team names: the tag every player of a team shares

The header reads "AGAiN ArbaletEU": `teamsFromFileName` (`src/ui/lookups.js`) takes "AGAiN_ArbaletEU" after "vs" up to the recording time, and "ArbaletEU" is the event.

The rule as tried (Sujan's proposal): where the file name names both teams, a team whose players all share a clan tag, and whose part of the file name starts with that tag (case, spaces and punctuation ignored), reads the tag. The tag is the start or the end all the team's names have in common, cut back to a separator, without the separators around it ("SK|" reads SK, "AGAiN  " AGAiN, "Na`Vi " Na`Vi). Names from the admin's text or from the tags alone, and names Sujan typed in, are left as they are.

17 names change on 17 demos:

| Demo | Before | After |
|---|---|---|
| SK vs AGAiN, Train, Arbalet Cup Europe 2009 | AGAiN ArbaletEU, SK Gaming | AGAiN, SK |
| AGAiN vs Na`Vi, Train, recorded 24 Oct 2011 (`1110240934--auto_de_train.dem_Again-vs-Navi`) | Natus Vincere | Na`Vi |
| fnatic vs Na`Vi, Dust2, GameGune 2012 | Natus Vincere | Na`Vi |
| mTw vs Na`Vi, ESWC 2010 semi-final, the 4 Tuscan files and Train | Natus Vincere | Na`Vi |
| Na`Vi vs FX, SEC 2011 final, Train and Dust2 | Natus Vincere | Na`Vi |
| Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | Natus Vincere, Moscow Five | Na`Vi, M5 |
| SK vs Na`Vi, Train, DreamHack Winter 2011 | SK Gaming, Natus Vincere | SK, Na`Vi |
| FX vs SK, Inferno, IEM5 | SK Gaming | SK |
| SK vs Dateam, Dust2, IOL Final4 2011 | SK Gaming | SK |
| SK vs WinFakt, Mirage, IEM6 New York | SK Gaming | SK |
| fnatic vs EG, Dust2, EM3 Global Finals 2009 | Evil Geniuses | EG |
| k1ck vs eq, Nuke, DreamHack Winter 2011 | K1ck, EQ | K1CK, Eq |

Unchanged, as Sujan asked: Frag eXecutors everywhere (the files say "fx", which doesn't start with the players' "Frag eXecutors"); mTw on FX vs mTw, Xperia Play 2011 (the players' tag is "mymTw.com"); eSTRO on SK vs eSTRO, WCG 2008 (the tag is "KOREA.eSTRO"); SK Gaming there too (the tag is "SKWEDEN"). fnatic stays fnatic where the players read "fnaticMSI" or "fnaticRC" (longer than the file's "fnatic").

One thing to decide with it: the rule only reaches names from the file name, so the same teams keep the long names elsewhere. After the change Na`Vi would read "Na`Vi" on 11 demos and "Natus Vincere" on 4 (Na`Vi vs SK, Inferno, ESWC 2011, its 3 files, named by the admin's text; fnatic vs Na`Vi, Tuscan, `auto-server1-1106262105`, named by the tags), and SK "SK" on 5 and "SK Gaming" on 12 (the 7 WCG 2008 files, the 3 ESWC 2011 Inferno files, SK vs compLexity, Inferno, IEM4, mousesports vs SK, Nuke, EMII).

## 2. The skip from mid-R3 into R4's freeze time

At demo 14:10 (850.64) the recording jumps from R3 0:14 into R4's freeze time: in one snapshot the two players still alive move 1,606 units (taz) and 4,072 (face), the other 8 come back alive at the spawns, and face's kill on taz arrives (face's kill on luqi came at 14:08, R3 0:16, 2.4 s before the jump, in the recording).

Why `findSkips` (`src/ui/skips.js`) misses it while it finds the demo's other 5: near a round start a jump counts only when a kill lands in the same snapshot, and that holds here. But with only 1 or 2 players alive, "all of them too fast" also needs silent damage at the same moment (health down 20 or more with no hit sound), and silent damage is never counted within 2 s of a round start (respawns). This skip lands on R4's start, so it can't pass. The other skips of this demo had 3 or more alive (the first test) or weren't at a round start.

Proposed fix: at a round start, the kill landing in the respawn snapshot stands in for the silent damage (it's what the round-start exception already treats as the sign of a skip). Then the skip is found as one across a round restart, so it gets //, "Recording skips here", and the existing treatment: face's kill on taz is no wallbang, leaves the Wallbangs list, stays in the Kills list, and reads "R3 0:14" in place of "R3 freeze 0:10".

On every test demo it finds 13 skips more, on 12 demos, all across a round restart, every one with a kill in the respawn snapshot:

| Demo | Skip | Kills on it, wallbang before → after |
|---|---|---|
| SK vs AGAiN, Train, Arbalet Cup Europe 2009 | 14:10, R3 to R4 | face on taz: strict → none |
| mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, part 1 (`-1007031530-`) | 50:30, R28 0:33 | ceh9 on Sunde: wallbang → none |
| roccat vs eSTRO, Inferno, Extreme Masters II | 23:06, R13 C4 0:07 | contE on solo: wallbang → none |
| Burning vs FairFrag, Inferno, ESWC 2010 | 12:37, a round not counted | drizzerEstachE! on ioRek (a teamkill): wallbang → none |
| FX vs SK, Inferno, IEM5 | 22:30, a round not counted | 3 kills, one a sliver kill to check → none |
| fnatic vs Na`Vi, Dust2, GameGune 2012 | 7:09, a round not counted | kArRiG4N on starix: none |
| fnatic vs EG, Dust2, EM3 Global Finals 2009 | 14:48 and 16:44, rounds not counted | cArn on n0thing: wallbang → none; 3 others none |
| FX vs eSahara, Dust2, DreamHack Winter 2010 | 38:57, a round not counted | PASHA on LoordB (a teamkill): sliver kill to check → none |
| EG vs eXecutors, Train, EM4 finals | 0:58, a round not counted | Loord on Storm: sliver kill to check → none |
| mousesports vs SK, Nuke, Extreme Masters II | 31:18, a round not counted | walle on Tixo: wallbang → none; 6 "world" deaths |
| WeMadeFox vs Ravens, Nuke, EM4 finals, part 1 | 25:06, a round not counted | Snappi on solo: sliver kill to check → none; Friis on SIA none |
| SK vs Dateam, Dust2, IOL Final4 2011 | 1:30, a round not counted | GeT_RiGhT on kerre: none |

Three listed wallbangs leave the Wallbangs list (the first three rows, all in live rounds); none of them is in `tests/expected/`. Correction, found while building 0.26.25 (8 Nov 2026, `tests/logs/0.26.25.md`): the table names each skip by the round at the snapshot after it, one round late for the kills on it, which belong to the round before: ceh9 on Sunde is R27, contE on solo R12, and walle on Tixo (mousesports vs SK, Nuke, Extreme Masters II) R15, a live round, where it was a listed STRICT WB. So 4 listed wallbangs leave the list, not 3; none of the 4 is in `tests/expected/`. The rest are in rounds that don't count. "Sliver kill to check": the finder's points see him with the crosshair through cover, so the picture check would decide whether it's listed.

Kill details on such a kill, for Sujan to decide: with the fix, face's kill on taz reads "Earlier: −25 from walle at 0:30, −31 from walle at 0:29, −12 from face at 0:18, −95 at freeze 0:10, source unknown", then "−5 HS: head · in the open". Health is counted from each round's start, so taz's reading at the jump (32 down to 5) counts as R4's, from 100: −95. Taz really went from 32 to 5 (−27) somewhere in the missing stretch. And "in the open" now says what the viewer can't know. It's older than this change: every kill on a skip across a restart reads like this. Proposal: readings in the snapshot of a skip across a restart count in the round before it, so the line reads "−27 at 0:14, source unknown", and the killing bullet says the recording skips here instead of "in the open" or "through a wall".

## 3. walle on Neo, R18 1:06 (demo 33:03), AK47

Listed STRICT WB on 0.26.24. walle's killing shot is the kill itself (no earlier moment found for it); Neo had 13 HP left.

| Moment | walle's eye | Pixels of Neo | The finder's 15 sight lines |
|---|---|---|---|
| The shot (what the finder and the picture check judge) | (−522, −849, −271) | 0 | all blocked, 12 to 114 units |
| 0.05 s before | (−518, −848, −271) | 772 | 5 clear |
| The kill feed time, as the 3D view draws them (0.1 s back) | (−517, −847, −271) | 1,476 | 10 clear |

Neo stood still (he moved 1 unit). walle's eye moved 5 units, from beside the pillar's edge to behind it, in the last tenth of a second. In the picture at the shot the pillar covers Neo completely; 0.1 s back his side shows beside its edge (the pictures were saved while measuring, `neo_0.png` at the shot and `neo_1.png` 0.1 s back, not in the repo).

So it's the THREAT-on-LoordB case: hidden at the shot, in view 0.1 s back. This time the killer moved, not the victim. The picture check works as built at the shot, so nothing changes without Sujan's say (1 Nov 2026: the finder judges at the shot). The kill is in `tests/expected/` as loose with a `known_gap`; `ground_truth_check.py --demo SK_vs_AGAiN` passes with the gap printed.

**Glow on hits**: yes, it draws him through the pillar. The glow is drawn on the label layer over the 3D picture, at the hit player's position, with nothing tested against the walls (`update3`, `src/view3d.part.js`), so it shows wherever he is. It says a hit through a wall landed there, not that he was in view.

## 4. The kill feed carries kills into the next round

`updateFeed` (`src/ui/playback.js`) shows the last 5 kills of the last 6 s, whatever the round. Jimmy's kill on kubenB at R4 1:15 (demo 14:50) came 4.9 s before R5 started, so it's still there at R5 freeze 0:09.

When a round starts: in an HLTV demo the viewer's round start is the HLTV message (0, 0) that the server sends to spectators in `RestartRound`, and the same call starts freeze time, so the round restart and the freeze start are one moment, one server frame (ReGameDLL, `multiplay_gamerules.cpp`, `CHalfLifeMultiplay::RestartRound`, read on GitHub 8 Nov 2026). In a POV demo it's the first round timer after the round ended. What the game's own demo player does with its kill feed at that moment isn't something Claude can check: it needs the game running and clicks in it. The open-source rebuild of the CS 1.6 client (FWGS `cs16-client`, `cl_dll/death.cpp`) empties the list in `InitHUDData`, but which message calls it at a new round wasn't found there, and it isn't Valve's code.

Proposed fix: the feed shows only kills from the round playing now (`roundAt(T)`), still within 6 s. Tried in a copy of 0.26.24:

| Demo | Round starts with the last round's kills in the feed half a second in | Cleared |
|---|---|---|
| SK vs AGAiN, Train | 28 of 56 | 26 |
| WeMadeFox vs Ravens, Nuke, EM4 finals, joined (2 files) | 48 of 89 | 45 |
| Na`Vi vs SK, Inferno, ESWC 2011, joined (3 files) | 46 of 74 | 44 |

The 7 left are kills that land at or after the round start, which belong to the new round: the kill in the respawn snapshot of a skip across a restart (face on taz; Jimmy on walle at 9:01 of SK vs AGAiN), and "world" deaths of players changing team as a round starts. Jimmy on kubenB at R5 freeze 0:09: in the feed with 0.26.24's rule, gone with this one; seeking back to half a second before R5's start brings it back, seeking forward again clears it. On both joined maps, nothing carries over a part boundary (the last kill before part 2 came 208 s and 16 s before it, with either rule).

## Checks

- `ground_truth_check.py --demo SK_vs_AGAiN` on 0.26.24 with walle on Neo added: 1 kill, 0 mismatches, 1 known gap: PASS.
- Nothing built, so the seven checks weren't run for this report.
