# Every LOOSE kill on the 64 test demos, lowest through-wall damage first (0.26.4)

Run on 1 Nov 2026 with `tests/page/loose_list.js` through `compare_all.sh` (one page, 0.26.4's build, the 64 demos of `~/code/cs16-data/test-demos`, 2.2 minutes), for Sujan's question of that day: should LOOSE have a minimum through-wall damage? Saved here on 2 Nov 2026 at his request. His answer: no minimum (STATE.md Decisions, 2 Nov 2026).

- 634 wallbang kills in the live rounds: 424 strict (14 of them sliver kills at 0 pixels), 210 LOOSE (179 from damage, 23 by pixels, 8 sliver kills at 1 to 49 pixels).
- "Through-wall HP" is the number the Wallbangs list shows on the kill: the killer's hits through cover in the burst, plus the killing bullet, which counts as the health the victim had left. A low number often means the victim was already hurt, not that little went through the wall (KUBEN on RARA shows 5 because RARA had 5 left).
- How many LOOSE kills a minimum would drop, and how many of those Sujan had confirmed as wallbangs in `tests/expected/`: 10 HP, 6 and 4; 15 HP, 15 and 11; 20 HP, 33 and 25; 25 HP, 48 and 35; 35 HP, 71 and 49.
- By the number: under 10, 6; 10 to 19, 27; 20 to 34, 38; 35 to 49, 44; 50 or more, 95.
- "Before kill" is the killer's hits through cover before the killing bullet, and how many. "//" after a round means the kill is on a skip in the recording. Events as in `tests/DEMOS.md`; the Na`Vi vs SK Inferno files are from ESWC 2011 (Sujan, 1 Nov 2026), named here as the run had them.


| # | Through-wall HP (row) | Before kill | Killing bullet (HP left) | Level | Event | Round | Killer → victim | Gun |
|---|---|---|---|---|---|---|---|---|
| 1 | 4 | 0 | 4 | LOOSE (sliver) 29 px | SK vs WinFakt, Mirage, IEM6 New York | R5 1:13 (demo 20:14) | SK.face → WinFakt JiGetus =)DD | m4a1 |
| 2 | 4 | 0 | 4 | LOOSE (pixels) 371 px | roccat vs fnatic, Inferno, Extreme Masters II | R13 1:37 (demo 33:37) | fnatic Torgersen → roccat > Niko K. <NASU> | ak47 HS |
| 3 | 5 | 0 | 5 | LOOSE (sliver) 41 px | FX vs eSahara, Dust2, DreamHack Winter 2010 | R18 0:21 (demo 126:11) | Frag eXecutors  KUBEN[t] → ESAHARA.net RARA | ak47 |
| 4 | 7 | 0 | 7 | LOOSE (sliver) 28 px | roccat vs eSTRO, Inferno, Extreme Masters II 2008 | R17 1:27 (demo 29:20) // | ROCCAT.ruuit → eSTRO : hee | m4a1 HS |
| 5 | 8 | 0 | 8 | LOOSE (pixels) 410 px | fnatic vs Na`Vi, Dust2, GameGune 2012 final | R20 0:36 (demo 51:37) | Na`Vi markeloff → fnaticRC Xizt | awp |
| 6 | 8 | 0 | 8 | LOOSE (pixels) 163 px | mousesports vs SK, Nuke, Extreme Masters II | R5 1:35 (demo 19:12) | mousesports | Kapi O → SK|Tentpole[TTFU] | m4a1 |
| 7 | 10 | 0 | 10 | LOOSE (pixels) 872 px | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 0:54 (demo 51:15) | Na`Vi ceh9 /A/ → M5 XEK | ak47 |
| 8 | 10 | 0 | 10 | LOOSE (pixels) 210 px | SK vs eSTRO, Nuke, WCG 2008 | R15 C4 0:23 (demo 27:20) | KOREA.eSTRO : hee → SKWEDEN walle | ak47 |
| 9 | 10 | 8 in 1 | 2 | LOOSE (damage) | roccat vs fnatic, Inferno, Extreme Masters II | R4 C4 0:08 (demo 22:19) | fnatic Sattermon → roccat > Samu A. <plastE> | m4a1 |
| 10 | 11 | 9 in 1 | 2 | LOOSE (damage) | Fnatic vs mousesports, Tuscan, ESWC 2011 | R8 1:01 (demo 41:02) | mousesports | ninja → fnaticMSI pita /iBRA/ | m4a1 |
| 11 | 12 | 9 in 1 | 3 | LOOSE (damage) | SK vs WinFakt, Mirage, IEM6 New York | R14 1:09 (demo 32:36) | SK.face → WinFakt nsutOtO~ | m4a1 |
| 12 | 12 | 0 | 12 | LOOSE (pixels) 172 px | mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, file -1645- | R4 0:36 (demo 6:26) | Na`Vi markeloff /A/ → mTw.Mindfactory | minet | ak47 |
| 13 | 13 | 12 in 1 | 1 | LOOSE (damage) | Na`Vi vs FX, Dust2, SEC 2011 final | R3 0:40 (demo 16:51) | Na`Vi markeloff /A/ → Loord | ak47 |
| 14 | 14 | 10 in 1 | 4 | LOOSE (damage) | FX vs mTw, Inferno, Xperia Play 2011, part 1 | R3 1:08 (demo 15:56) | Frag eXecutors  Loord → zonic@mymTw.com | m4a1 |
| 15 | 14 | 12 in 1 | 2 | LOOSE (damage) | fnatic vs EG, Dust2, EM3 Global Finals 2009 | R10 0:59 (demo 32:54) | fnatic.MSI iZnoGouD → EG.Hanes | ak47 |
| 16 | 15 | 0 | 15 | LOOSE (pixels) 97 px | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R9 C4 0:20 (demo 31:52) | SK.Delpan <3 Johan Wedel → Na`Vi starix /A/ | awp |
| 17 | 15 | 0 | 15 | LOOSE (sliver) 29 px | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R26 1:22 (demo 61:32) | Na`Vi Zeus /A/ → SK.RobbaN | m4a1 |
| 18 | 15 | 14 in 1 | 1 | LOOSE (damage) | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R17 C4 0:03 (demo 49:55) | Virtus.pro > Ioann S. <Edward> → ALTERNATE aTTaX | ROMAN R. | m4a1 |
| 19 | 15 | 0 | 15 | LOOSE (pixels) 53 px | fnatic vs Moscow Five, Nuke, DreamHack Summer 2011 | R14 C4 0:17 (demo 24:58) | [fnaticMSI.Xizt] → M5 ED1K 5x5 AP DNISHE GO | ak47 HS |
| 20 | 15 | 9 in 1 | 6 | LOOSE (damage) | fnatic vs mousesports, Forge, IEM6 Guangzhou, part 2 | R5 1:32 (demo 6:58) | fnaticMSI Xizt → mousesports | gob b | famas |
| 21 | 16 | 0 | 16 | LOOSE (pixels) 124 px | FX vs Lions, Nuke, DreamHack Winter 2010 | R13 1:19 (demo 28:04) | LIONS NIKO DA PANDA * QPAD → Frag eXecutors  LoordB | ak47 |
| 22 | 16 | 15 in 1 | 1 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R8 1:04 (demo 41:34) | Frag eXecutors  Loord → SK.f0rest | ak47 |
| 23 | 16 | 12 in 1 | 4 | LOOSE (damage) | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R8 C4 0:19 (demo 13:23) | [Ukraine] - edzie → SWEDEN|allen | ak47 |
| 24 | 17 | 12 in 1 | 5 | LOOSE (damage) | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 C4 0:15 (demo 51:55) | Na`Vi edzie → M5 Fox | ak47 HS |
| 25 | 18 | 12 in 1 | 6 | LOOSE (damage) | mousesports vs AGAiN, Inferno, ESWC 2011 final | R23 1:17 (demo 54:38) | mousesports | zonixx → AGAiN  Loord | ak47 |
| 26 | 19 | 12 in 1 | 7 | LOOSE (damage) | FX vs Lions, Inferno, DreamHack Winter 2010 | R5 C4 0:25 (demo 13:11) | Frag eXecutors  742 → LIONS NIKO DA PANDA * QPAD | ak47 |
| 27 | 19 | 12 in 1 | 7 | LOOSE (damage) | FX vs mTw, Inferno, Xperia Play 2011, part 1 | R6 0:16 (demo 21:22) | trace@mymTw.com → Frag eXecutors  PASHA[t] | ak47 |
| 28 | 19 | 12 in 1 | 7 | LOOSE (damage) | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R21 0:52 (demo 46:57) | ALTERNATE aTTaX | apxwOw~ → fnaticMSI Xizt | ak47 |
| 29 | 19 | 12 in 1 | 7 | LOOSE (damage) | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R14 0:26 (demo 41:56) | Na`Vi starix /A/ → SK.RobbaN | ak47 |
| 30 | 19 | 12 in 1 | 7 | LOOSE (damage) | Sweden vs Norway, Dust2, ASUS ENC 2010 | R14 0:59 (demo 17:47) | SWIIIIIDEEEN  Gux → NORWAY REAL | ak47 |
| 31 | 19 | 12 in 1 | 7 | LOOSE (damage) | Sweden vs Norway, Dust2, ASUS ENC 2010 | R23 1:05 (demo 31:37) | NORWAY REAL → SWIIIIIDEEEN  Delpan | ak47 |
| 32 | 19 | 11 in 1 | 8 | LOOSE (damage) | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R7 0:44 (demo 11:19) | SWEDEN|cArNaGe! → [Ukraine] - edzie | m4a1 |
| 33 | 19 | 18 in 2 | 1 | LOOSE (damage) | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R8 1:10 (demo 33:46) | Virtus.pro > DaniiL T. <Zeus> → ALTERNATE aTTaX | CHEF-KOCH | m4a1 |
| 34 | 20 | 12 in 1 | 8 | LOOSE (damage) | FX vs mTw, Inferno, Xperia Play 2011, part 2 | R20 0:24 (demo 39:39) | ArcadioN@mymTw.com → Frag eXecutors  PASHA[t] | ak47 |
| 35 | 20 | 0 | 20 | LOOSE (pixels) 98 px | Na`Vi vs FX, Dust2, SEC 2011 final | R4 1:05 (demo 18:28) | Na`Vi EdwardwOw~ → 742 | ak47 HS |
| 36 | 20 | 9 in 1 | 11 | LOOSE (damage) | mTw vs Na`Vi, Train, ESWC 2010 semi-final | R3 1:08 (demo 13:40) | Na`Vi ceh9 /A/ → mTw.Mindfactory | ave | famas |
| 37 | 21 | 15 in 1 | 6 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R9 0:10 (demo 44:19) | Frag eXecutors  NEO[t] → SK.f0rest | ak47 |
| 38 | 21 | 13 in 1 | 8 | LOOSE (damage) | iFNG FX vs fnatic, Dust2, IEM March 2011 | R2 1:04 (demo 7:38) | Loord → Delpan4Miichy | famas |
| 39 | 22 | 12 in 1 | 10 | LOOSE (damage) | FX vs eSahara, Dust2, DreamHack Winter 2010 | R8 C4 0:34 (demo 63:57) | ESAHARA.net MAHE → Frag eXecutors  PASHA[t] | ak47 |
| 40 | 22 | 19 in 2 | 3 | LOOSE (damage) | Na`Vi vs FX, Dust2, SEC 2011 final | R7 0:54 (demo 22:36) | 742 → Na`Vi starix /A/ | m4a1 |
| 41 | 22 | 10 in 1 | 12 | LOOSE (damage) | roccat vs eSTRO, Inferno, Extreme Masters II 2008 | R6 0:59 (demo 16:12) | eSTRO : hee → ROCCAT.contE | m4a1 |
| 42 | 22 | 18 in 2 | 4 | LOOSE (damage) | tyloo vs mTw, Nuke, e-Stars Seoul 2009 | R6 C4 0:18 (demo 13:56) | tyloo Xuefeng ' xf ' Lai → mTw.Mindfactory | MJE | m4a1 |
| 43 | 23 | 12 in 1 | 11 | LOOSE (damage) | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R15 0:40 (demo 24:48) | [Ukraine] - B1ad3 _R → SWEDEN|sTriKeR | ak47 |
| 44 | 23 | 18 in 2 | 5 | LOOSE (damage) | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R20 0:31 (demo 54:04) | ALTERNATE aTTaX | ROMAN R. → Virtus.pro > Aleksey K. <LeX> | m4a1 |
| 45 | 24 | 18 in 2 | 6 | LOOSE (damage) | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R6 1:05 (demo 23:23) | ALTERNATE aTTaX | apxwOw~ → fnaticMSI CARN | m4a1 |
| 46 | 24 | 22 in 2 | 2 | LOOSE (damage) | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R10 0:20 (demo 30:07) | fnaticMSI fR11$+- → ALTERNATE aTTaX | apxwOw~ | ak47 |
| 47 | 24 | 12 in 1 | 12 | LOOSE (damage) | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R26 1:25 (demo 61:29) | SK.RobbaN → Na`Vi markeloff /A/ | ak47 |
| 48 | 24 | 19 in 2 | 5 | LOOSE (damage) | roccat vs eSTRO, Inferno, Extreme Masters II 2008 | R6 1:45 (demo 15:25) | eSTRO : bailRR → ROCCAT.plastE | m4a1 |
| 49 | 25 | 24 in 2 | 1 | LOOSE (damage) | Burning vs FairFrag, Inferno, ESWC 2010 | R5 0:14 (demo 44:57) | BURNING! Rara Qpad.se → FAiRFRAG|CosMo/M/ | ak47 |
| 50 | 25 | 24 in 2 | 1 | LOOSE (damage) | FX vs mTw, Nuke, Xperia Play 2011, part 1 | R6 0:50 (demo 13:21) | Frag eXecutors  NEO[t] → ave@mymTw.com | ak47 |
| 51 | 25 | 0 | 25 | LOOSE (pixels) 907 px | MYM vs mTw, Dust2, EM3 2009 consolation final | R28 1:21 (demo 66:53) | MEET LOORDB, YOUR MAKER → mTw | MJE | ak47 |
| 52 | 25 | 9 in 1 | 16 | LOOSE (damage) | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R21 C4 0:03 (demo 55:51) | ALTERNATE aTTaX | paN → Virtus.pro > Viktor F. <Sally^> | m4a1 HS |
| 53 | 26 | 16 in 1 | 10 | LOOSE (damage) | Burning vs FairFrag, Inferno, ESWC 2010 | R13 0:59 (demo 58:30) | BURNING! Rara Qpad.se → FAiRFRAG|drizzerEstachE! | ak47 HS |
| 54 | 26 | 20 in 1 | 6 | LOOSE (damage) | fnatic vs Na`Vi, Dust2, GameGune 2012 final | R8 C4 0:08 (demo 32:36) | fnaticRC MODDII /12hrs/ → Na`Vi Ioann | ak47 |
| 55 | 26 | 23 in 2 | 3 | LOOSE (damage) | mousesports vs SK, Nuke, Extreme Masters II | R3 C4 0:00 (demo 16:41) | mousesports | cyx → SK|GeT_RiGhT[TTFU] | m4a1 HS |
| 56 | 27 | 19 in 2 | 8 | LOOSE (damage) | FX vs mTw, Inferno, Xperia Play 2011, part 2 | R17 0:27 (demo 34:34) | trace@mymTw.com → Frag eXecutors  TaZ | m4a1 |
| 57 | 27 | 0 | 27 | LOOSE (pixels) 74 px | FX vs mTw, Nuke, Xperia Play 2011, part 1 | R11 0:41 (demo 22:04) | Frag eXecutors  NEO[t] → ArcadioN@mymTw.com | ak47 HS |
| 58 | 27 | 9 in 1 | 18 | LOOSE (damage) | mousesports vs AGAiN, Inferno, ESWC 2011 final | R3 0:32 (demo 17:20) | AGAiN  PASHA[t] → mousesports | ninja | m4a1 |
| 59 | 28 | 18 in 2 | 10 | LOOSE (damage) | mousesports vs SK, Nuke, Extreme Masters II | R9 C4 0:10 (demo 23:16) | mousesports | gob b → SK|allen[TTFU] | m4a1 |
| 60 | 29 | 28 in 2 | 1 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R13 0:38 (demo 51:35) | Frag eXecutors  KUBEN[t] → SK.GeT_RiGhT | ak47 |
| 61 | 30 | 16 in 1 | 14 | LOOSE (damage) | SK vs eSTRO, Dust2, WCG 2008 | R8 1:18 (demo 18:20) | SKWEDEN Tentpole <3 Tezz → KOREA.eSTRO : hee | ak47 |
| 62 | 31 | 27 in 3 | 4 | LOOSE (damage) | iFNG FX vs fnatic, Dust2, IEM March 2011 | R13 1:19 (demo 23:14) | NEO[t] → Xizt | m4a1 |
| 63 | 31 | 12 in 1 | 19 | LOOSE (damage) | mousesports vs SK, Nuke, Extreme Masters II | R12 1:16 (demo 27:42) | SK|RobbaN[TTFU] → mousesports | Kapi O | ak47 |
| 64 | 32 | 12 in 1 | 20 | LOOSE (damage) | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R20 0:40 (demo 45:23) | ALTERNATE aTTaX | hool → fnaticMSI fR11$+- | ak47 |
| 65 | 33 | 23 in 2 | 10 | LOOSE (damage) | AGAiN vs Na`Vi, Train, recorded 24 Oct 2011 | R22 1:27 (demo 89:23) | Na`Vi starix /A/ → AGAiN  PASHA[t] | m4a1 |
| 66 | 33 | 12 in 1 | 21 | LOOSE (damage) | NoA vs Pentagram, Train, 2006 | R26 1:26 (demo 33:54) | NoA.zonic'10 -.- → PENTAGRAM G-Shock | kubenB | ak47 |
| 67 | 33 | 24 in 2 | 9 | LOOSE (damage) | SK vs Dateam, Dust2, IOL Final4 2011 | R6 1:06 (demo 27:33) | SK.RobbaN → dt.REASPEL.se rape | m4a1 |
| 68 | 33 | 12 in 1 | 21 | LOOSE (pixels) 1199 px | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R10 1:02 (demo 37:49) | ALTERNATE aTTaX | paN → Virtus.pro > Ioann S. <Edward> | ak47 HS |
| 69 | 34 | 15 in 1 | 19 | LOOSE (damage) | MYM vs mTw, Dust2, EM3 2009 consolation final | R29 C4 0:23 (demo 68:49) | MEET LOORDB, YOUR MAKER → mTw | whimp | ak47 |
| 70 | 34 | 12 in 1 | 22 | LOOSE (damage) | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R3 0:55 (demo 6:27) | SWEDEN|SpawN → [Ukraine] - B1ad3 _R | galil HS |
| 71 | 34 | 31 in 2 | 3 | LOOSE (damage) | mousesports vs AGAiN, Inferno, ESWC 2011 final | R4 0:49 (demo 19:12) | AGAiN  PASHA[t] → mousesports | ninja | m4a1 |
| 72 | 35 | 29 in 2 | 6 | LOOSE (damage) | AGAiN vs Na`Vi, Train, recorded 24 Oct 2011 | R2 C4 0:13 (demo 57:35) | AGAiN  NEO[t] → Na`Vi starix /A/ | m4a1 |
| 73 | 35 | 19 in 2 | 16 | LOOSE (damage) | MYM vs fnatic, Train, CPL Winter 2006 (probably) | R19 1:09 (demo 58:12) | MYM|XioNe www.icemat.com → fnatic.dsn[tw] | m4a1 |
| 74 | 35 | 27 in 2 | 8 | LOOSE (damage) | SK vs eSTRO, Train, WCG 2008 | R8 1:15 (demo 15:04) | SKWEDEN walle → KOREA.eSTRO : bail | ak47 |
| 75 | 36 | 27 in 2 | 9 | LOOSE (damage) | FX vs eSahara, Nuke, DreamHack Winter 2010 | R3 0:08 (demo 15:02) | ESAHARA.net MAHE → Frag eXecutors  742 | ak47 |
| 76 | 36 | 12 in 1 | 24 | LOOSE (damage) | SK vs Na`Vi, Train, DreamHack Winter 2011 | R39 C4 0:24 (demo 79:20) | Na`Vi starix → SK.face | ak47 |
| 77 | 36 | 12 in 1 | 24 | LOOSE (damage) | fnatic vs EG, Dust2, EM3 Global Finals 2009 | R26 1:11 (demo 50:17) | EG.fRoD[A] → fnatic.MSI cArn | ak47 |
| 78 | 37 | 24 in 2 | 13 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R22 C4 0:17 (demo 72:06) | Frag eXecutors  NEO[t] → SK.GeT_RiGhT | ak47 |
| 79 | 37 | 36 in 3 | 1 | LOOSE (damage) | FX vs mTw, Inferno, Xperia Play 2011, part 2 | R21 0:57 (demo 41:40) | trace@mymTw.com → Frag eXecutors  NEO[t] | ak47 |
| 80 | 37 | 12 in 1 | 25 | LOOSE (damage) | SK vs eSTRO, Train, WCG 2008 | R24 1:30 (demo 34:50) | KOREA.eSTRO : termi → SKWEDEN zet | ak47 |
| 81 | 37 | 0 | 37 | LOOSE (pixels) 743 px | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R23 1:25 (demo 32:29) | SWEDEN|cArNaGe! → [Ukraine] - edzie | ak47 HS |
| 82 | 37 | 31 in 2 | 6 | LOOSE (damage) | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R20 0:59 (demo 53:36) | ALTERNATE aTTaX | CHEF-KOCH → Virtus.pro > Roman M. <ROMJkE^> | m4a1 |
| 83 | 38 | 30 in 2 | 8 | LOOSE (damage) | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R18 1:12 (demo 42:15) | fnaticMSI pita → ALTERNATE aTTaX | hool | m4a1 |
| 84 | 38 | 36 in 3 | 2 | LOOSE (damage) | Na`Vi vs FX, Train, SEC 2011 final | R22 1:17 (demo 34:54) | 742 → Na`Vi starix /A/ | ak47 |
| 85 | 38 | 33 in 2 | 5 | LOOSE (damage) | SK vs eSTRO, Dust2, WCG 2008 | R26 0:04 (demo 49:37) | SKWEDEN RobbaN[alitdg] → KOREA.eSTRO : termi | m4a1 |
| 86 | 38 | 14 in 1 | 24 | LOOSE (damage) | tyloo vs mTw, Nuke, e-Stars Seoul 2009 | R17 1:23 (demo 35:05) | mTw.Mindfactory | ave → tyloo Xuefeng ' xf ' Lai | m4a1 HS |
| 87 | 39 | 9 in 1 | 30 | LOOSE (damage) | Fnatic vs mousesports, Tuscan, ESWC 2011 | R5 C4 0:05 (demo 35:56) | mousesports | zonixx → fnaticMSI Gux <3 pingu | m4a1 HS |
| 88 | 40 | 30 in 2 | 10 | LOOSE (damage) | FX vs Lions, Nuke, DreamHack Winter 2010 | R5 0:26 (demo 16:07) | LIONS kHRYSTAL * KASPERSKY → Frag eXecutors  742 | ak47 |
| 89 | 40 | 24 in 2 | 16 | LOOSE (damage) | Fnatic vs mousesports, Tuscan, ESWC 2011 | R13 1:17 (demo 46:48) | mousesports | ninja → fnaticMSI cArn | m4a1 |
| 90 | 41 | 15 in 1 | 26 | LOOSE (damage) | SK vs eSTRO, Nuke, WCG 2008 | R8 0:44 (demo 17:46) | KOREA.eSTRO : termi → SKWEDEN zet | ak47 |
| 91 | 41 | 0 | 41 | LOOSE (sliver) 26 px | fnatic vs mousesports, Forge, IEM6 Guangzhou final, file 1 | R15 1:28 (demo 23:06) | fnaticMSI Friis <3 bambi → mousesports | KARRiGAN | awp |
| 92 | 41 | 39 in 1 | 2 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R26 1:27 (demo 32:44) | K1CK spekz → -Eq- szrtech | m4a1 |
| 93 | 42 | 12 in 1 | 30 | LOOSE (damage) | mTw vs Na`Vi, Train, ESWC 2010 semi-final | R15 C4 0:09 (demo 27:23) | mTw.Mindfactory | ave → Na`Vi Zeus /A/ | ak47 |
| 94 | 42 | 30 in 2 | 12 | LOOSE (damage) | mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, file 1 | R6 1:14 (demo 11:36) | mTw.Mindfactory | traceFFFFFFFF → Na`Vi ceh9 /A/ | ak47 |
| 95 | 43 | 39 in 3 | 4 | LOOSE (damage) | SK vs Na`Vi, Train, DreamHack Winter 2011 | R25 1:09 (demo 47:38) | SK.RobbaN → Na`Vi starix | ak47 |
| 96 | 43 | 36 in 3 | 7 | LOOSE (damage) | iFNG FX vs fnatic, Dust2, IEM March 2011 | R6 0:28 (demo 13:48) | carn → PASHA[t] | ak47 |
| 97 | 44 | 32 in 3 | 12 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R5 0:02 (demo 37:13) | SK.GeT_RiGhT → Frag eXecutors  KUBEN[t] | m4a1 HS |
| 98 | 44 | 10 in 1 | 34 | LOOSE (damage) | SK vs eSTRO, Nuke, WCG 2008 | R17 0:44 (demo 30:57) | SKWEDEN Tentpole <3 Tezz → KOREA.eSTRO : termi | ak47 HS |
| 99 | 44 | 36 in 2 | 8 | LOOSE (damage) | SK vs eSTRO, Train, WCG 2008 | R12 1:04 (demo 19:51) | SKWEDEN zet → KOREA.eSTRO : ari | ak47 |
| 100 | 44 | 31 in 3 | 13 | LOOSE (damage) | Sweden vs Norway, Dust2, ASUS ENC 2010 | R22 C4 0:09 (demo 30:28) | SWIIIIIDEEEN  Gux → NORWAY KORN | m4a1 HS |
| 101 | 44 | 15 in 1 | 29 | LOOSE (damage) | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R8 0:48 (demo 34:08) | ALTERNATE aTTaX | mooN <M> → Virtus.pro > DaniiL T. <Zeus> | ak47 HS |
| 102 | 45 | 39 in 3 | 6 | LOOSE (damage) | SK vs Na`Vi, Train, DreamHack Winter 2011 | R26 0:26 (demo 50:10) | Na`Vi ceh9 32-33y → SK.GeT_RiGhT -A- | m4a1 HS |
| 103 | 46 | 12 in 1 | 34 | LOOSE (damage) | FX vs Lions, Nuke, DreamHack Winter 2010 | R10 0:22 (demo 24:18) | LIONS NIKO DA PANDA * QPAD → Frag eXecutors  LoordB | ak47 HS |
| 104 | 46 | 12 in 1 | 34 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R25 0:35 (demo 76:53) | SK.allen → Frag eXecutors  NEO[t] | ak47 HS |
| 105 | 46 | 12 in 1 | 34 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R28 0:41 (demo 87:27) | SK.allen → Frag eXecutors  Loord | ak47 HS |
| 106 | 46 | 38 in 2 | 8 | LOOSE (damage) | Fnatic vs mousesports, Tuscan, ESWC 2011 | R14 1:05 (demo 47:43) | fnaticMSI Gux <3 pingu → mousesports | zonixx | ak47 |
| 107 | 46 | 39 in 3 | 7 | LOOSE (damage) | fnatic vs mousesports, Forge, IEM6 Guangzhou, part 2 | R4 1:24 (demo 5:22) | mousesports | zonixx → fnaticMSI CARN | ak47 |
| 108 | 46 | 24 in 2 | 22 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R26 1:26 (demo 32:45) | -Eq- Darky → K1CK spekz | ak47 HS |
| 109 | 47 | 39 in 1 | 8 | LOOSE (damage) | FX vs mTw, Inferno, Xperia Play 2011, part 1 | R6 0:17 (demo 21:22) | Frag eXecutors  PASHA[t] → zonic@mymTw.com | m4a1 |
| 110 | 47 | 0 | 47 | LOOSE (sliver) 15 px | Sweden vs Norway, Dust2, ASUS ENC 2010 | R7 1:12 (demo 8:56) | SWIIIIIDEEEN  GeT_RiGhT → NORWAY KORN | ak47 HS |
| 111 | 47 | 9 in 1 | 38 | LOOSE (damage) | roccat vs fnatic, Inferno, Extreme Masters II | R28 1:38 (demo 62:27) | fnatic Torgersen → roccat > Niko K. <NASU> | m4a1 HS |
| 112 | 48 | 24 in 2 | 24 | LOOSE (damage) | SK vs Dateam, Dust2, IOL Final4 2011 | R11 1:25 (demo 36:05) | dt.REASPEL.se rape → SK.Delpan4M =DDD | ak47 |
| 113 | 48 | 12 in 1 | 36 | LOOSE (damage) | tyloo vs mTw, Nuke, e-Stars Seoul 2009 | R13 1:23 (demo 24:26) | mTw.Mindfactory | Sunde → tyloo Xuefeng ' xf ' Lai | ak47 HS |
| 114 | 49 | 0 | 49 | LOOSE (sliver) 16 px | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R23 0:31 (demo 57:48) | Na`Vi starix /A/ → SK.Delpan <3 Johan Wedel | awp HS |
| 115 | 49 | 45 in 5 | 4 | LOOSE (damage) | Sweden vs Norway, Dust2, ASUS ENC 2010 | R25 0:47 (demo 35:23) | SWIIIIIDEEEN  Gux → NORWAY kalle | m4a1 |
| 116 | 50 | 33 in 3 | 17 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R17 0:58 (demo 64:48) | Frag eXecutors  PASHA[t] → SK.face | m4a1 |
| 117 | 50 | 31 in 3 | 19 | LOOSE (damage) | FX vs eSahara, Nuke, DreamHack Winter 2010 | R18 1:09 (demo 38:28) | Frag eXecutors  LoordB → ESAHARA.net MAHE | galil |
| 118 | 50 | 35 in 3 | 15 | LOOSE (pixels) 138 px | fnatic vs Na`Vi, Dust2, GameGune 2012 final | R12 C4 0:04 (demo 38:26) | Na`Vi starix → fnaticRC f0restBambiJQgarN^ | m4a1 |
| 119 | 52 | 16 in 1 | 36 | LOOSE (damage) | FX vs mTw, Nuke, Xperia Play 2011, part 1 | R2 0:29 (demo 7:41) | minet@mymTw.com → Frag eXecutors  KUBEN[t] | m4a1 HS |
| 120 | 53 | 20 in 1 | 33 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R2 1:11 (demo 6:19) | K1CK mUtcb → -Eq- Darky | ak47 HS |
| 121 | 55 | 0 | 55 | LOOSE (sliver) 15 px | FX vs mTw, Nuke, Xperia Play 2011, part 2 | R21 C4 0:13 (demo 41:21) | ave@mymTw.com → Frag eXecutors  PASHA[t] | m4a1 HS |
| 122 | 55 | 12 in 1 | 43 | LOOSE (damage) | Fnatic vs mousesports, Tuscan, ESWC 2011 | R25 0:59 (demo 61:22) | mousesports | roman[K] → fnaticMSI Gux <3 pingu | ak47 HS |
| 123 | 55 | 49 in 3 | 6 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R20 C4 0:21 (demo 27:31) | -Eq- EneRyYyYy → K1CK mUtcb | ak47 |
| 124 | 56 | 52 in 4 | 4 | LOOSE (damage) | SK vs eSTRO, Dust2, WCG 2008 | R18 1:22 (demo 34:30) | SKWEDEN allen <3 Sophie → KOREA.eSTRO : bail | m4a1 |
| 125 | 57 | 20 in 1 | 37 | LOOSE (damage) | Sweden vs Norway, Dust2, ASUS ENC 2010 | R18 1:00 (demo 24:40) | NORWAY REAL → SWIIIIIDEEEN  Gux | ak47 |
| 126 | 58 | 57 in 5 | 1 | LOOSE (damage) | Na`Vi vs FX, Train, SEC 2011 final | R5 C4 0:14 (demo 10:01) | 742 → Na`Vi markeloff /A/ | famas |
| 127 | 58 | 25 in 2 | 33 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R6 1:25 (demo 10:37) | -Eq- DECE[A] * → K1CK n0rx     <pacheco> | m4a1 HS |
| 128 | 58 | 50 in 4 | 8 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R15 C4 0:10 (demo 19:58) | -Eq- Darky → K1CK n0rx     <pacheco> | m4a1 |
| 129 | 59 | 40 in 2 | 19 | LOOSE (damage) | MYM vs mTw, Dust2, EM3 2009 consolation final | R3 C4 0:23 (demo 17:30) | mTw | MJE → MEET LUq, YOUR MAKER | ak47 |
| 130 | 59 | 45 in 3 | 14 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R10 1:29 (demo 14:11) | K1CK n0rx     <pacheco> → -Eq- DECE[A] * | ak47 |
| 131 | 60 | 57 in 3 | 3 | LOOSE (damage) | SK vs eSTRO, Dust2, WCG 2008 | R9 0:41 (demo 19:47) | SKWEDEN zet → KOREA.eSTRO : ari | m4a1 HS |
| 132 | 60 | 18 in 2 | 42 | LOOSE (damage) | roccat vs fnatic, Inferno, Extreme Masters II | R26 1:34 (demo 60:12) | fnatic Holm → roccat > Niko K. <NASU> | famas HS |
| 133 | 61 | 57 in 3 | 4 | LOOSE (damage) | fnatic vs Na`Vi, Dust2, GameGune 2012 final | R11 1:23 (demo 35:24) | Na`Vi ceh9 3a DPy3iB → fnaticRC MODDII /12hrs/ | m4a1 |
| 134 | 62 | 50 in 3 | 12 | LOOSE (damage) | Na`Vi vs FX, Train, SEC 2011 final | R13 0:05 (demo 21:05) | Na`Vi Edward4[a] → PASHA[t] | ak47 |
| 135 | 62 | 45 in 3 | 17 | LOOSE (damage) | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, part 2 | R5 1:13 (demo 9:23) | Na`Vi Zeus /A/ → SK.f0restwOw~ | ak47 |
| 136 | 62 | 52 in 2 | 10 | LOOSE (pixels) 165 px | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R9 0:59 (demo 14:25) | [Ukraine] - B1ad3 _R → SWEDEN|RobbaN | ak47 HS |
| 137 | 62 | 24 in 2 | 38 | LOOSE (pixels) 67 px | fnatic vs mousesports, Forge, IEM6 Guangzhou final, file 1 | R12 1:08 (demo 19:58) | fnaticMSI pita * Sensei → mousesports | zonixx | ak47 HS |
| 138 | 63 | 9 in 1 | 54 | LOOSE (damage) | iFNG FX vs fnatic, Dust2, IEM March 2011 | R14 0:40 (demo 25:16) | NEO[t] → pita 4 Balkan | m4a1 HS |
| 139 | 64 | 18 in 2 | 46 | LOOSE (damage) | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R15 0:16 (demo 30:48) | Na`Vi edzie → M5 XEK | famas HS |
| 140 | 64 | 61 in 2 | 3 | LOOSE (damage) | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R24 0:37 (demo 49:34) | Na`Vi ceh9 /A/ → M5 ROMJkE2H^ | ak47 HS |
| 141 | 65 | 64 in 4 | 1 | LOOSE (damage) | FX vs eSahara, Nuke, DreamHack Winter 2010 | R24 0:45 (demo 48:26) | Frag eXecutors  KUBEN[t] → ESAHARA.net RARA | ak47 |
| 142 | 65 | 48 in 3 | 17 | LOOSE (damage) | Na`Vi vs fnatic, Tuscan, Adepto BH Open 2011 | R2 0:55 (demo 14:59) | Na`Vi iOANN4[a] <3 BiH → fnatic.MSi Gux /PiNGU/ | ak47 |
| 143 | 65 | 60 in 4 | 5 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R2 1:18 (demo 6:12) | K1CK spekz → -Eq- DECE[A] * | ak47 |
| 144 | 66 | 64 in 1 | 2 | LOOSE (damage) | SK vs Na`Vi, Train, DreamHack Winter 2011 | R19 1:13 (demo 39:06) | SK.GeT_RiGhT -A- → Na`Vi starix | ak47 |
| 145 | 66 | 52 in 3 | 14 | LOOSE (damage) | SK vs Na`Vi, Train, DreamHack Winter 2011 | R19 0:53 (demo 39:26) | SK.face → Na`Vi markeloff ~~~ | ak47 |
| 146 | 67 | 24 in 2 | 43 | LOOSE (damage) | FX vs eSahara, Nuke, DreamHack Winter 2010 | R10 1:20 (demo 24:42) | ESAHARA.net RARA → Frag eXecutors  PASHA[t] | ak47 HS |
| 147 | 67 | 63 in 6 | 4 | LOOSE (damage) | FX vs mTw, Nuke, Xperia Play 2011, part 2 | R26 1:30 (demo 48:49) | Frag eXecutors  KUBEN[t] → trace@mymTw.com | m4a1 |
| 148 | 67 | 57 in 4 | 10 | LOOSE (damage) | SK vs Na`Vi, Train, DreamHack Winter 2011 | R9 0:04 (demo 23:28) | Na`Vi markeloff ~~~ → SK.Delpan <3 Johan Wedel | ak47 |
| 149 | 68 | 45 in 3 | 23 | LOOSE (damage) | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R7 1:10 (demo 24:12) | ALTERNATE aTTaX | apxwOw~ → fnaticMSI CARN | m4a1 HS |
| 150 | 69 | 56 in 4 | 13 | LOOSE (damage) | fnatic vs EG, Dust2, EM3 Global Finals 2009 | R22 1:36 (demo 46:39) | fnatic.MSI GeT_RiGhT[JFK] → EG.n0thing | m4a1 |
| 151 | 70 | 65 in 2 | 5 | LOOSE (damage) | mousesports vs SK, Nuke, Extreme Masters II | R28 1:37 (demo 53:36) | SK|GeT_RiGhT[TTFU] → mousesports | gob b | m4a1 |
| 152 | 73 | 36 in 3 | 37 | LOOSE (damage) | Burning vs FairFrag, Inferno, ESWC 2010 | R12 1:15 (demo 56:47) | BURNING! Rara Qpad.se → FAiRFRAG|ioRek | ak47 HS |
| 153 | 73 | 60 in 5 | 13 | LOOSE (damage) | FX vs Lions, Inferno, DreamHack Winter 2010 | R28 0:46 (demo 55:30) | LIONS NIKO DA PANDA * QPAD → Frag eXecutors  KUB3N[t] | ak47 HS |
| 154 | 73 | 45 in 3 | 28 | LOOSE (damage) | FX vs eSahara, Nuke, DreamHack Winter 2010 | R9 1:11 (demo 22:58) | ESAHARA.net MAHE → Frag eXecutors  NEO[t] | ak47 |
| 155 | 73 | 61 in 2 | 12 | LOOSE (damage) | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R25 1:40 (demo 60:17) | Virtus.pro > Aleksey K. <LeX> → ALTERNATE aTTaX | approx | ak47 |
| 156 | 74 | 64 in 2 | 10 | LOOSE (damage) | FX vs mTw, Nuke, Xperia Play 2011, part 1 | R6 1:08 (demo 13:03) | Frag eXecutors  NEO[t] → trace@mymTw.com | ak47 |
| 157 | 74 | 60 in 5 | 14 | LOOSE (damage) | Fnatic vs mousesports, Tuscan, ESWC 2011 | R24 0:37 (demo 59:39) | fnaticMSI Xizt → mousesports | zonixx | ak47 |
| 158 | 74 | 64 in 1 | 10 | LOOSE (damage) | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R13 0:39 (demo 39:14) | Na`Vi markeloff /A/ → SK.f0restwOw~ | ak47 |
| 159 | 74 | 24 in 2 | 50 | LOOSE (damage) | SK vs Na`Vi, Train, DreamHack Winter 2011 | R7 0:23 (demo 19:33) | Na`Vi markeloff ~~~ → SK.Delpan <3 Johan Wedel | ak47 HS |
| 160 | 74 | 62 in 3 | 12 | LOOSE (pixels) 223 px | fnatic vs mousesports, Forge, IEM6 Guangzhou final, file 1 | R14 1:05 (demo 22:17) | mousesports | gob b → fnaticMSI Xizt | m4a1 |
| 161 | 74 | 28 in 2 | 46 | LOOSE (damage) | mousesports vs AGAiN, Inferno, ESWC 2011 final | R18 1:05 (demo 46:41) | AGAiN  742 → mousesports | zonixx | m4a1 HS |
| 162 | 75 | 50 in 3 | 25 | LOOSE (damage) | FX vs eSahara, Nuke, DreamHack Winter 2010 | R24 0:19 (demo 48:51) | Frag eXecutors  PASHA[t] → ESAHARA.net MAJ3R | ak47 |
| 163 | 78 | 77 in 7 | 1 | LOOSE (damage) | k1ck vs eq, Nuke, DreamHack Winter 2011 | R15 1:10 (demo 19:20) | -Eq- SeDaN → K1CK fox <pacheco> C.N. | m4a1 |
| 164 | 78 | 75 in 5 | 3 | LOOSE (damage) | mTw vs Na`Vi, Tuscan, ESWC 2010, part 2 | R6 1:10 (demo 19:08) | mTw.Mindfactory | ave → Na`Vi markeloff /A/ | m4a1 |
| 165 | 79 | 68 in 4 | 11 | LOOSE (damage) | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R14 1:34 (demo 22:02) | SWEDEN|SpawN → [Ukraine] - LMBT~R~3A HEHbKY! | m4a1 |
| 166 | 80 | 56 in 1 | 24 | LOOSE (damage) | mTw vs Na`Vi, Train, ESWC 2010 semi-final | R2 C4 0:04 (demo 12:31) | Na`Vi markeloff /A/ → mTw.Mindfactory | traceFFFFFFFF | m4a1 |
| 167 | 82 | 49 in 1 | 33 | LOOSE (damage) | Na`Vi vs fnatic, Tuscan, Adepto BH Open 2011 | R5 0:39 (demo 19:20) | Na`Vi markeloff <3 BiH → fnatic.MSi dsn | ak47 HS |
| 168 | 85 | 73 in 3 | 12 | LOOSE (damage) | FX vs eSahara, Dust2, DreamHack Winter 2010 | R26 C4 0:23 (demo 138:54) | Frag eXecutors  742 → ESAHARA.net sadliGENO | ak47 HS |
| 169 | 85 | 78 in 8 | 7 | LOOSE (damage) | SK vs WinFakt, Mirage, IEM6 New York | R4 0:37 (demo 18:50) | SK.face → WinFakt JiGetus =)DD | m4a1 |
| 170 | 85 | 80 in 2 | 5 | LOOSE (damage) | SK vs eSTRO, Dust2, WCG 2008 | R2 1:10 (demo 8:57) | SKWEDEN walle → KOREA.eSTRO : solo | ak47 |
| 171 | 86 | 84 in 7 | 2 | LOOSE (damage) | SK vs eSTRO, Dust2, WCG 2008 | R12 0:59 (demo 24:26) | SKWEDEN zet → KOREA.eSTRO : ari | ak47 |
| 172 | 87 | 60 in 4 | 27 | LOOSE (damage) | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R28 C4 0:22 (demo 57:29) | M5 Fox → Na`Vi edzie | m4a1 HS |
| 173 | 88 | 77 in 2 | 11 | LOOSE (damage) | Burning vs FairFrag, Inferno, ESWC 2010 | R10 1:20 (demo 53:02) | BURNING! Rara Qpad.se → FAiRFRAG|CosMo/M/ | ak47 |
| 174 | 88 | 80 in 4 | 8 | LOOSE (damage) | Na`Vi vs FX, Train, SEC 2011 final | R27 C4 0:01 (demo 40:51) | Na`Vi Zeus /A/ <3 ( 8 ) → 742 | m4a1 HS |
| 175 | 88 | 60 in 5 | 28 | LOOSE (damage) | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R23 C4 0:11 (demo 46:57) | Na`Vi markeloff ~~~ → M5 Fox | ak47 HS |
| 176 | 88 | 18 in 2 | 70 | LOOSE (damage) | mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, file 1 | R22 1:06 (demo 43:45) | mTw.Mindfactory | zonic → Na`Vi starix /A/ | m4a1 HS |
| 177 | 88 | 44 in 3 | 44 | LOOSE (damage) | mousesports vs SK, Nuke, Extreme Masters II | R22 1:37 (demo 41:47) | SK|RobbaN[TTFU] → mousesports | Kapi O | m4a1 HS |
| 178 | 90 | 34 in 2 | 56 | LOOSE (damage) | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R7 0:51 (demo 29:02) | SK.RobbaN → Na`Vi markeloff /A/ | m4a1 HS |
| 179 | 96 | 10 in 1 | 86 | LOOSE (damage) | FX vs mTw, Nuke, Xperia Play 2011, part 2 | R25 0:38 (demo 47:40) | Frag eXecutors  NEO[t] → minet@mymTw.com | m4a1 HS |
| 180 | 97 | 49 in 1 | 48 | LOOSE (pixels) 69 px | mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, file -1655- | R6 C4 0:25 (demo 13:24) | mTw.Mindfactory | minet → Na`Vi ceh9 /A/ | ak47 HS |
| 181 | 100 | 97 in 5 | 3 | LOOSE (damage) | FX vs Lions, Inferno, DreamHack Winter 2010 | R5 0:16 (demo 12:39) | Frag eXecutors  NEO[t] → LIONS Xizt * MAXFPS | ak47 |
| 182 | 100 | 96 in 7 | 4 | LOOSE (damage) | FX vs Lions, Inferno, DreamHack Winter 2010 | R7 1:20 (demo 16:08) | Frag eXecutors  742 → LIONS THREAT * KASPERSKY | ak47 |
| 183 | 100 | 90 in 4 | 10 | LOOSE (damage) | FX vs SK, Inferno, IEM5 | R10 0:55 (demo 45:26) | SK.GeT_RiGhT → Frag eXecutors  Loord | m4a1 |
| 184 | 100 | 84 in 6 | 16 | LOOSE (damage) | FX vs eSahara, Nuke, DreamHack Winter 2010 | R6 1:05 (demo 19:16) | Frag eXecutors  KUBEN[t] → ESAHARA.net MAJ3R | m4a1 |
| 185 | 100 | 27 in 2 | 73 | LOOSE (damage) | FX vs mTw, Inferno, Xperia Play 2011, part 1 | R15 1:19 (demo 38:35) | ArcadioN@mymTw.com → Frag eXecutors  KUBEN[t] | ak47 HS |
| 186 | 100 | 42 in 2 | 58 | LOOSE (damage) | FX vs mTw, Inferno, Xperia Play 2011, part 2 | R5 1:13 (demo 6:19) | Frag eXecutors  NEO[t] → minet@mymTw.com | ak47 HS |
| 187 | 100 | 91 in 3 | 9 | LOOSE (damage) | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R23 C4 0:33 (demo 49:32) | ALTERNATE aTTaX | hool → fnaticMSI fR11$+- | ak47 |
| 188 | 100 | 92 in 6 | 8 | LOOSE (damage) | MYM vs mTw, Dust2, EM3 2009 consolation final | R7 1:31 (demo 24:53) | mTw | ave → MEET KUBENB, YOUR MAKER | ak47 |
| 189 | 100 | 12 in 1 | 88 | LOOSE (pixels) 210 px | MYM vs mTw, Dust2, EM3 2009 consolation final | R29 C4 0:13 (demo 68:39) | mTw | ave → MEET TAZ, YOUR MAKER | ak47 HS |
| 190 | 100 | 0 | 100 | LOOSE (pixels) 72 px | Match 3, css_cache, public server 2022 (POV demo, played as HLTV) | R21 0:56 (demo 37:47) | Call 911 i m in town.` → -F[T]L^ | Suygetsu<3 | awp HS |
| 191 | 100 | 12 in 1 | 88 | LOOSE (damage) | Na`Vi vs FX, Dust2, SEC 2011 final | R4 0:47 (demo 18:45) | Na`Vi markeloff /A/ → NEO[t] | ak47 HS |
| 192 | 100 | 36 in 3 | 64 | LOOSE (damage) | Na`Vi vs FX, Dust2, SEC 2011 final | R10 1:04 (demo 24:45) | 742 → Na`Vi starix /A/ | m4a1 HS |
| 193 | 100 | 0 | 100 | LOOSE (pixels) 561 px | Na`Vi vs FX, Train, SEC 2011 final | R23 C4 0:01 (demo 35:54) | NEO[t] → Na`Vi markeloff /A/ | awp HS |
| 194 | 100 | 98 in 2 | 2 | LOOSE (damage) | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R5 0:20 (demo 13:53) | M5 ROMJkE2H^ → Na`Vi starix | ak47 |
| 195 | 100 | 85 in 4 | 15 | LOOSE (damage) | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 1:13 (demo 50:55) | Na`Vi ceh9 /A/ → M5 ED1K | ak47 |
| 196 | 100 | 76 in 2 | 24 | LOOSE (damage) | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R24 0:57 (demo 58:49) | SK.face → Na`Vi starix /A/ | ak47 HS |
| 197 | 100 | 88 in 3 | 12 | LOOSE (damage) | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known | R29 0:32 (demo 66:16) | SK.GeT_RiGhT -A- → Na`Vi markeloff /A/ | ak47 |
| 198 | 100 | 97 in 4 | 3 | LOOSE (damage) | Na`Vi vs SK, Inferno, recorded 24 Oct 2011, part 3 | R1 C4 0:02 (demo 1:02) | Na`Vi cehe4ka yHocuT → SK.Delpan <3 Johan Wedel | ak47 |
| 199 | 100 | 80 in 1 | 20 | LOOSE (damage) | NoA vs Pentagram, Train, 2006 | R5 1:10 (demo 7:59) | PENTAGRAM G-Shock | taz[b] → NoA.hpx | ak47 HS |
| 200 | 100 | 18 in 2 | 82 | LOOSE (damage) | SK vs Na`Vi, Train, DreamHack Winter 2011 | R23 1:15 (demo 44:30) | Na`Vi starix → SK.RobbaN | m4a1 HS |
| 201 | 100 | 15 in 1 | 85 | LOOSE (damage) | SK vs WinFakt, Mirage, IEM6 New York | R18 0:20 (demo 44:32) | SK.GeT_RiGhT -A- → WinFakt nsutOtO~ | ak47 HS |
| 202 | 100 | 98 in 4 | 2 | LOOSE (damage) | SK vs eSTRO, Nuke, WCG 2008 | R3 1:27 (demo 11:33) | SKWEDEN allen <3 Sophie → KOREA.eSTRO : bail | famas HS |
| 203 | 100 | 64 in 1 | 36 | LOOSE (damage) | Sweden vs Norway, Dust2, ASUS ENC 2010 | R26 1:28 (demo 36:32) | NORWAY REAL → SWIIIIIDEEEN  FoReSt | ak47 HS |
| 204 | 100 | 78 in 2 | 22 | LOOSE (damage) | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R5 1:06 (demo 8:50) | SWEDEN|sTriKeR → [Ukraine] - LMBT~R~3A HEHbKY! | m4a1 HS |
| 205 | 100 | 70 in 5 | 30 | LOOSE (damage) | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R15 1:10 (demo 24:18) | SWEDEN|SpawN → [Ukraine] - STRIKE | m4a1 HS |
| 206 | 100 | 62 in 1 | 38 | LOOSE (damage) | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803071948-) | R17 1:41 (demo 20:37) | ALTERNATE aTTaX | ROMAN R. → Virtus.pro > Aleksey K. <LeX> | ak47 HS |
| 207 | 100 | 64 in 1 | 36 | LOOSE (damage) | mTw vs Lions, Nuke, DreamHack Summer 2011 | R18 1:28 (demo 31:04) | mTw } minet → LIONS SNAJDINHOOOAOAOAO | ak47 HS |
| 208 | 100 | 0 | 100 | LOOSE (pixels) 240 px | mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, file 1 | R24 1:31 (demo 45:15) | Na`Vi f0cuswOw~ → mTw.Mindfactory | ave | ak47 HS |
| 209 | 100 | 88 in 8 | 12 | LOOSE (damage) | mousesports vs AGAiN, Inferno, ESWC 2011 final | R21 0:51 (demo 51:11) | AGAiN  KUBEN[t] → mousesports | gob b | m4a1 HS |
| 210 | 100 | 99 in 9 | 1 | LOOSE (damage) | mousesports vs SK, Nuke, Extreme Masters II | R20 1:42 (demo 40:21) | SK|allen[TTFU] → mousesports | gob b | m4a1 |
