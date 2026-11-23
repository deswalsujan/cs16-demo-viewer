# Sujan's feedback on five new demos: report, nothing built (23 Nov 2026)

Sujan's brief of 23 Nov 2026: his in-game answers on three wallbang labels (A), the rounds of a Nuke demo (B) and AWP shots in a protocol 47 demo (C). Read on 0.27.4 (main at `98c6f01`). The five demos moved from `~/Downloads/new-demos` to `~/code/cs16-data/test-demos` first (`tests/DEMOS.md`), so every run found them there (the hold-out guard passed). Nothing in `src/` changed. The page scripts, the reader copies that keep each fire event's fields, and the scratch build with the candidate fixes stayed in the session's scratch folder, outside the repo. Game code read: ReGameDLL (`s1lentq/ReGameDLL_CS`, master: `wpn_shared/wpn_*.cpp`, `cbase.cpp`'s FireBullets3, `pm_shared.cpp`) and ReHLDS (`dreamstalker/rehlds`, master: `engine/sv_user.cpp`).

## The five demos

| File | Event | How it's known |
|---|---|---|
| `52.386.1065131-0902121944-de_tuscan.dem` | Norway vs Romania, Tuscan, 12 Feb 2009, 19:44: event unknown | the players' tags; the file name has ClanBase's layout and a "[CB]LoSaH" spectator is on the server, but the demo's text has only HLTV.org's and VeryGames' ads, and no web source was found (Liquipedia and HLTV.org refused the fetch) |
| `53.47.1132498-0904082227-de_dust2.dem`, `53.47.1132498-0904082305-de_nuke.dem` | Sweden vs Poland, Dust2 then Nuke, 8 Apr 2009: event unknown | the players' tags; one match number in both names; ClanBase's layout, a "[CB]Nicky" spectator, MYM's server ("<Game-Hosting.com: MYM> LIVE!!!"); nothing names the event |
| `eml.agaming.wcgfsemi-0710071910-de_dust2.dem` (protocol 47) | emuLate vs Amazing Gaming, Dust2, WCG 2007 Grand Final, a semi-final (7 Oct 2007, 19:10) | demo text "<War: France(emuLate) vs Ukraine(Amazing Gaming)> Welcome to the World Cyber Games 2007 Grand Final." and the HLTV's "WCG 2007 - Semi-Finals"; the file name's "wcgfsemi" |
| `final-tusca-0811091552-de_tuscan.dem` | SK Gaming vs mTw, Tuscan, WCG 2008 Grand Final, the final (9 Nov 2008, 15:52) | demo text "<WCG2008 Stage>"; the file name's "final"; Esports Earnings (WCG 2008, Cologne, 5 to 9 Nov 2008): mTw first, SK Gaming second, with this demo's players |

## A. Three wallbang labels

Sujan's answers, spectating the shooter in first person in his game (`DECISIONS.md`, 23 Nov 2026): PeRRy on REAL and RobbaN on whiMp are partial wallbangs, pasha on Tentpole a wallbang. The viewer's 3D view showed all three as his game did.

How the finder decides (`computeWallbangs`, `src/ui/wallbangs.js`): 15 sight points on the victim (5 heights from 30 below his origin to 30 above, 3 columns 12 units apart; 12 when he crouches) say whether part of him is in view. Then the recorded aim line at the shot: clear means "hit in the open" and the kill gets no tag (unless F1b applies: part of him seen, the line to his middle through cover, the aim one snapshot before through cover too). Through cover and hidden to all 15 points, a **Wallbang**, then the picture check (`checkSeen`) turns it **Partial** at 50 pixels or more. Through cover with part of him seen, the damage rule (`computeHits`) makes it **Partial** when one of the killer's bullets on him 0.5 s or less before went through a surface by its damage, else the picture check lists it under 50 pixels.

### A1. Norway vs Romania, Tuscan, R14 1:31: PeRRy's AK-47 on REAL, no tag

The viewer's kill row reads 1:31; Sujan's 1:32 is where the **Wall damage** row starts (61 HP: −49 on REAL's helmet at demo 1513.85 and −12 at 1513.91, both pinned on PeRRy and both through the wood by their damage).

1. What decided it: 5 of the 15 points see REAL, the column 12 units to his left at every height; the middle passes through 18 units of `kano_wood1b`, the right 36. The aim at the shot (demo 1514.354) is clear: its end lies 27 units from his middle, 17 to the right and 21 up, 18 from his head. So the finder stops at "hit in the open". F1b can't apply: the aim is clear at every snapshot from 0.31 s before the kill to the kill itself. The picture check and the damage rule never ran.
2. The bullet: the fire event says punch −0.82° pitch (up) and −0.22° yaw, spread 0 and 0. Recorded aim plus that punch is still clear, its end now 40 units from his middle (21 right, 34 up), 26 from his head: over his right shoulder. The spread the event can't tell (below) moves it up to 9 units either way, still clear at every corner. So the demo can't put this bullet through the wood: what's left is the aim's own error (the angles are the snapshot's, 0.06 s apart; PeRRy's pitch moved 0.8° between the last two as he crouched).
3. The picture from PeRRy's eye: 0 pixels of REAL at the shot, 453 pixels 0.1 s before (REAL was stepping behind the wood, 5 units in that 0.1 s). Sujan's game, spectating PeRRy, draws REAL 0.1 s back, as the viewer's 3D view does in playback, so it shows part of him. By the 20 Nov rule (the labels judge the moment of the shot only, FLEX0R on R!Go-), REAL is hidden at the shot. The fix below makes this kill **Partial** through the damage rule, not through pixels; which moment, and whose eye, decides a sliver like this one stays Sujan's call (open point 1, at the end).

### A2. SK Gaming vs mTw, Tuscan, WCG 2008 final, R30 1:22: RobbaN's AK-47 on whiMp, no tag

The kill row reads 1:22; the **Wall damage** row at 1:23 is 61 HP (−49 helmet at 2762.39 and −12 at 2762.70 through the crate; −12 at 2762.49 in the open).

1. What decided it: none of the 15 points sees whiMp (8 to 56 units of `kano_crate1c` on every line). The aim at the shot (2763.312) is clear, its end 36 units from his middle, 20 to his left and 30 below: past the crate's edge at his shins. A clear aim makes the kill "in the open" before the sight points matter, so a victim hidden to all 15 points gets no tag when the recorded aim passes beside the cover. F1b needs part of him seen, so it can't apply.
2. The bullet: punch −4.28° pitch and −1.16° yaw. He was spraying: whiMp lost 15 HP at 2763.106 with no fire event near it, and the demo lost the fire events of the shots between 2762.70 and 2763.31 (this demo keeps too few to count as one that keeps them). Recorded aim plus the punch goes through 20 units of the crate, its end 8 units from his head (the hit sound says helmet: a headshot). Every corner of the spread's range goes through the crate (6 to 36 units). So here the real bullet's line does cross the crate where the recorded aim misses it.
3. The picture: 130 pixels of whiMp at the shot (114 at 0.1 s before), part of him past the crate: **Partial** by the 50-pixel line, once the finder gets that far.

### A3. Sweden vs Poland, Dust2, R15 1:09: pasha's Galil on Tentpole, **Partial wallbang**

1. What decided it: 2 of the 15 points see Tentpole, the top row's middle and left, 30 units over his origin. The aim at the shot goes through 22 units of `sandtrim`, 5 units from his middle. Part of him seen and the aim through cover, so the damage rule: pasha's −40 on his helmet at 1293.413, 0.35 s before the kill, where the Galil does at least 89 to a helmeted head in the open at 162 units, so only a surface explains it: **Partial** by damage. The picture check never ran: the damage rule had decided first.
2. The bullet: the Galil sends its punch ×10,000,000 (`wpn_galil.cpp`; the FAMAS too), which overflows the event's 18-bit field: every Galil shot here reads ±131071, so only the punch's direction is known. Tried at 0.25° to 3° up: the line goes through 16 to 22 units of the sandtrim or the wall under it at every one. The bullet went through the wall whatever its recoil.
3. Why a sight point saw him: the posed model's top is 25.9 units over his origin at the shot (26.2 at 0.1 s before; 24.5 to 26.6 on all three victims). The top row of sight points, at 30, sits 4 units above his head, so those two lines pass over the wall's top and over him. The picture from pasha's eye shows 0 pixels at the shot and 0 at 0.1 s before. The picture check's camera is pasha's eye at the kill's snapshot (his origin plus 17, standing), Tentpole posed where he is at the shot; the 3D view, paused by **Jump to this kill** 0.1 s later, draws Tentpole at the same moment from pasha's eye 0.1 s later (2 units over), the same picture: none of him, as Sujan's game shows.

### What a demo can rebuild of the bullet's line

From ReGameDLL (`wpn_ak47.cpp`'s AK47Fire, `cbase.cpp`'s FireBullets3) and ReHLDS (`sv_user.cpp`'s SV_FinishPMove):
- After each move the engine stores the view angles with the punch added once (`v_angle` = the command's angles + `punchangle`; the model's `angles`, which the demo records, are the same with a third of the pitch). The gun then fires along `v_angle + punchangle`: the punch a second time, then FireBullets3 adds the spread, `x × spread × right + y × spread × up`. So the bullet = the recorded aim + the punch + the spread.
- The punch at the shot: in the fire event, `int(punchangle × 100)` in iparam1 and iparam2 (0.01° steps) for the AK-47, M4A1, SG552, AUG, MP5, P90, UMP45, MAC-10, TMP, M249, Deagle, Glock, P228 and Five-SeveN; the pitch only for the AWP, Scout, G3SG1, SG550 and USP (the AWP's is 0 at a shot: its kick comes after it); not for the Galil and FAMAS (×10,000,000, overflowing to ±131071) or the Elites. It's there only when the demo kept the fire event.
- The spread: in fparam1 and fparam2, `x × spread` and `y × spread`, which the event cuts to 0.01 toward zero (its 20-bit field, ÷100): most shots read 0, so the spread is known only to within 0.57° either way (9 units at 900).
- Not in a demo: the shared random seed (the player's connection sequence number, `random_seed`), which doesn't matter since the event carries the spread's result; the view angles at the server frame of the shot (the snapshot's are 0.03 to 0.1 s apart); and where lag compensation put the victim (the server traces the bullet against him as the shooter's game drew him, about 0.1 s back).
- Checked on 8 demos (the five's Tuscan and Dust2, SK vs Na`Vi, Train; Na`Vi vs FX, Dust2; k1ck vs eq, Nuke; SK vs Na`Vi, Dust2, IEM4; fnatic vs Moscow Five, Nuke; the WCG 2008 final): on 275 rifle headshot kills with the killing shot's event in the kill's frame, the line's end lies a median 19 units from the victim's head with the recorded aim, 13 with the punch added, 28 with it taken away; on the 162 with 1° of punch or more, 27.6 against 13, closer on 136. On 476 body kills, 18.4 against 14.6. So the recorded aim is one punch short, as the code says.

### The fix proposed (F4′), the smallest that gets all three right

Measured in two steps (below): F4, with the punch added to every aim, broke 33 of Sujan's confirmed answers, so F4′ adds it only where the recorded aim is clear.

1. A clear recorded aim at the shot is checked again with the killing shot's punch added, from the killer's fire event in the kill's frame (the guns above; none for the Galil, FAMAS and Elites): when that line goes through cover, it's the aim. A recorded aim through cover stays as it is.
2. The top row of sight points at 24 units over a standing victim's origin, not 30, inside the model's top (24.5 to 26.6).
3. A kill whose aim is clear, with the punch added too, but ends more than 24 units from the part the kill hit (his head for a headshot, his middle otherwise), with part of him in view and the line to that part through cover, goes to the damage rule as F1b's kills do: **Partial** only when one of the killer's bullets on him 0.5 s or less before went through a surface by its damage.

On the three: PeRRy's aim with the punch ends 26 units from REAL's head, the line to his head passes 18 units of wood, and PeRRy's −12 0.44 s before went through it (the AK does 25 to a leg in the open there): **Partial** by damage. RobbaN's aim with the punch goes through the crate and whiMp is hidden to the points: **Wallbang**, then 130 pixels: **Partial**. pasha's Tentpole is hidden to the points once the top row is at 24: **Wallbang**, 0 pixels: **Wallbang**. A stronger part 3, judging the kill on the line to the part hit with no damage needed, changed 7 kills on SK vs Na`Vi, Train alone (two of them strict from nothing), so it was left out.

### What the fixes change on the 88 test demos

Measured on a scratch build of 0.27.4 with each part behind a switch, the finder run again for each setting in one page load per demo, on the 79 HLTV demos (the 9 POV demos were left out): 11,549 kills in live rounds, 852 listed as wallbangs today.

F4, the first measurement, with the punch on every aim:
- the punch alone changes 112 kills on 52 demos: 62 **Partial wallbang** and 6 **Wallbang** lose their tag, 41 gain **Partial wallbang** and 3 **Wallbang**;
- the top row at 24 alone, 14 kills on 9 demos: 7 **Partial wallbang** become **Wallbang**, 4 slivers stay **Wallbang**, 2 gain **Partial wallbang**, 1 stays **Partial** for another reason;
- the miss rule alone, 26 kills on 19 demos, all gaining **Partial wallbang** by damage (the stronger form, judging on the line to the part hit: 175 kills on 64 demos);
- all three, 138 kills on 59 demos, and `ground_truth_check.py` found 35 of the 243 confirmed kills differing: 33 from the punch, each a confirmed partial wallbang whose aim through cover the punch clears (and gob b on Xizt, a known gap), 2 from the top row.

So the punch can't replace the recorded aim. It puts the line closer to the head on average, but with part of the victim in view, a line 13 units off can land on either side of the cover's edge, and on Sujan's confirmed partials it lands on the open side 33 times.

F4′, measured second (on Sujan's second go), is the proposal:
- 72 kills change on 43 demos: 44 by the punch rescuing a clear aim (41 gain **Partial wallbang**, 3 **Wallbang**), 14 by the miss rule (all **Partial wallbang** by damage), 14 by the top row (as above); 13 **Wall damage** rows go, joining their kill, and none is new;
- `tests/expected/`: 2 of the 243 confirmed kills differ, both from the top row. GeT_RiGhT on KORN (Sweden vs Norway, Dust2, ASUS ENC 2010, R7 1:12), confirmed partial, reads **Wallbang**: 15 pixels of KORN show, and a kill the points see reads **Partial** from 1 pixel, one they don't only from 50 (the parked question **One line for strict: 0 pixels for hidden kills too?**). face on nsutOtO (SK vs WinFakt, Mirage, IEM6 New York, R14 1:09) stays **Partial wallbang**, by its 69 pixels instead of by damage, which its expected file names. The three new answers pass; the 9 known gaps are the same;
- without the top row: 58 kills on 38 demos, every one gaining a tag, none of them a confirmed answer (the second check's two mismatches both come from the top row), but pasha's Tentpole stays **Partial**.

Every kill F4′ changes, for the ones Sujan wants to check in his game first:

| Demo | Kill | Now -> with F4′ | Part |
|---|---|---|---|
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem` | R4 1:05 fnaticMSI Gux <3 pingu -> mousesports \| gob  b deagle | **Wallbang** (sliver) -> **Wallbang** | top row |
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem` | R6 0:33 fnaticMSI pita /iBRA/ -> mousesports \| ninja ak47 | no tag -> **Partial** (112px) | top row |
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem` | R15 1:30 mousesports \| ninja -> fnaticMSI cArn m4a1 | no tag -> **Wallbang** | recoil |
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem` | R20 0:45 fnaticMSI Gux <3 pingu -> mousesports \| zonixx m4a1 | no tag -> **Partial** (damage) | recoil |
| `1110231221--auto_de_train.dem_navi-vs-winfast.dem` | R2 C4 0:27 WinFakt aslak [M] ^^yoso *A -> Na`Vi starix /A/ famas | no tag -> **Partial** (damage) | miss rule |
| `1110231221--auto_de_train.dem_navi-vs-winfast.dem` | R13 C4 0:08 Na`Vi Zeus /A/ -> WinFakt aslak [M] ^^yoso *A ak47 | no tag -> **Partial** (damage) | recoil |
| `1110241407--auto_de_inferno.dem_mousesports-vs-AGAIN.dem` | R13 0:49 mousesports \| ninja -> AGAiN  742 m4a1 | no tag -> **Partial** (damage) | recoil |
| `2011-10-24_16h08_NaVi_SK-1110241724-de_inferno.dem` | R1 freeze 0:11 SK.face -> Na`Vi EdwardwOw~ ak47 | no tag -> **Partial** (damage) | miss rule |
| `2011-10-24_16h08_NaVi_SK-1110241724-de_inferno.dem` | R4 C4 0:19 SK.RobbaN -> Na`Vi starix /A/ m4a1 | no tag -> **Partial** (418px) | recoil |
| `52.386.1065131-0902121944-de_tuscan.dem` | R14 1:31 Romania.PeRRy -> NORWAY \| REAL ak47 | no tag -> **Partial** (damage) | miss rule |
| `53.47.1132498-0904082227-de_dust2.dem` | R15 1:09 POLSKA pasha -> SWEDEN Tentpole <3 Tezz galil | **Partial** (damage) -> **Wallbang** | top row |
| `53.52.1646548-1005272144-de_dust2.dem` | R3 C4 0:09 SWIIIIIDEEEN  FoReSt -> NORWAY RashiE ak47 | no tag -> **Partial** (damage) | recoil |
| `53.52.1646548-1005272144-de_dust2.dem` | R7 1:12 SWIIIIIDEEEN  GeT_RiGhT -> NORWAY KORN ak47 | **Partial** (15px) -> **Wallbang** | top row |
| `53.52.1646548-1005272144-de_dust2.dem` | R20 1:18 SWIIIIIDEEEN  alleN -> NORWAY tacky m4a1 | no tag -> **Partial** (171px) | recoil |
| `53.52.1646548-1005272144-de_dust2.dem` | R28 0:59 SWIIIIIDEEEN  Delpan -> NORWAY KORN m4a1 | no tag -> **Partial** (damage) | recoil |
| `FX-vs-sk-iem5-inf.dem` | R12 1:04 Frag eXecutors  taz -> SK.RobbaN ak47 | no tag -> **Partial** (damage) | recoil |
| `SK_vs_AGAiN_ArbaletEU-0912051316-de_train.dem` | R21 1:18 AGAiN  Neo  ZOWiE -> SK\|RobbaN[ios] ak47 | no tag -> **Partial** (damage) | recoil |
| `SK_vs_e-STRO_WCG2008-0811081900-de_train.dem` | R18 1:32 SKWEDEN zet -> KOREA.eSTRO : bail ak47 | no tag -> **Partial** (damage) | recoil |
| `SK_vs_e-STRO_WCG2008-0811081950-de_dust2.dem` | R8 1:25 SKWEDEN zet -> KOREA.eSTRO : termi m4a1 | no tag -> **Partial** (damage) | recoil |
| `SK_vs_e-STRO_WCG2008-0811082043-de_nuke.dem` | R9 1:25 SKWEDEN RobbaN[alitdg] -> KOREA.eSTRO : hee m4a1 | no tag -> **Partial** (damage) | recoil |
| `SK_vs_e-STRO_WCG2008-0811082043-de_nuke.dem` | R19 1:26 KOREA.eSTRO : hee -> SKWEDEN Tentpole <3 Tezz m4a1 | no tag -> **Partial** (124px) | recoil |
| `auto-1003030847-de_nuke.dem` | R28 C4 0:14 WemadeFOX : termi[EU] -> coL.dboorN ak47 | no tag -> **Partial** (damage) | miss rule |
| `auto-1003032023-de_inferno.dem` | R19 0:36 SK\|Gux -> coL.thomz ak47 | no tag -> **Partial** (damage) | recoil |
| `auto-1003051236-de_inferno.dem` | R6 C4 0:05 dsn -> face m4a1 | no tag -> **Partial** (damage) | recoil |
| `auto-1003051236-de_inferno.dem` | R9 C4 0:21 RobbaN -> GeT_RiGhT4J ak47 | no tag -> **Partial** (damage) | recoil |
| `auto-1003051321-de_train.dem` | R10 C4 0:01 GeT_RiGhT4J -> RobbaN m4a1 | no tag -> **Wallbang** | recoil |
| `auto-1003051321-de_train.dem` | R20 1:07 cArn -> Gux ak47 | no tag -> **Partial** (damage) | recoil |
| `auto-1003061629-de_train.dem` | R8 1:00 THREAT -> Zeus m4a1 | no tag -> **Partial** (damage) | miss rule |
| `auto-1003061629-de_train.dem` | R15 C4 0:20 starix -> THREAT ak47 | **Wallbang** (sliver) -> **Wallbang** | top row |
| `auto_ifng-1110042211-de_forge.dem` | R4 1:26 fnaticMSI CARN -> mousesports \| ninja m4a1 | no tag -> **Partial** (26px) | recoil |
| `auto_ifng-1110042211-de_forge.dem` | R12 1:26 fnaticMSI CARN -> mousesports \| KARRiGAN m4a1 | no tag -> **Partial** (damage) | recoil |
| `de_nuke.dem_Fnatic-vs-ALTERNATE.dem` | R9 0:57 fnaticMSI Xizt -> ALTERNATE aTTaX \| hool ak47 | no tag -> **Partial** (damage) | recoil |
| `de_nuke.dem_Fnatic-vs-ALTERNATE.dem` | R21 0:53 fnaticMSI Xizt -> ALTERNATE aTTaX \| ROMAN R m4a1 | no tag -> **Partial** (damage) | recoil |
| `final-tusca-0811091552-de_tuscan.dem` | R4 0:54 zet -> whiMp m4a1 | no tag -> **Partial** (damage) | miss rule |
| `final-tusca-0811091552-de_tuscan.dem` | R27 0:55 Sunde -> walle m4a1 | no tag -> **Partial** (damage) | recoil |
| `final-tusca-0811091552-de_tuscan.dem` | R30 1:22 RobbaN -> whiMp ak47 | no tag -> **Partial** (130px) | recoil |
| `fnatic-vs-m5-dhs11-1106191035-de_nuke.dem` | R3 1:18 [fnaticMSI.manne] -> M5 ROMJkE2H ^DS^ ak47 | no tag -> **Partial** (damage) | miss rule |
| `fx-vs-esahara-dhw2010-1011271131-de_nuke.dem` | R19 C4 0:20 Frag eXecutors  742 -> ESAHARA.net sadliGENO ak47 | no tag -> **Partial** (damage) | recoil |
| `fx-vs-lions-dhw2010-bronze-1011272002-de_inferno.dem` | R18 1:29 LIONS NIKO DA PANDA * QPAD -> Frag eXecutors  LoordB * QPAD ak47 | no tag -> **Partial** (damage) | miss rule |
| `fx-vs-mtw-xperia2011-1104240242-de_nuke.dem` | R7 0:57 Frag eXecutors  PASHA[t] -> zonic@mymTw.com ak47 | no tag -> **Partial** (damage) | miss rule |
| `fx.eg.em4finals-1003021929-de_train.dem` | R28 1:22 EG.n0thing -> eXecutors  neo m4a1 | no tag -> **Partial** (damage) | recoil |
| `k1ck-vs-eq-dhwinter2011-1111260056-de_nuke.dem` | R20 C4 0:12 K1CK mUtcb -> -Eq- SeDaN m4a1 | no tag -> **Partial** (230px) | recoil |
| `mouz.SK.EM2.real-0803091025-de_nuke.dem` | R3 C4 0:00 mousesports \| cyx -> SK\|walle[TTFU] m4a1 | **Partial** (damage) -> **Wallbang** | top row |
| `mouz.SK.EM2.real-0803091025-de_nuke.dem` | R22 1:37 SK\|RobbaN[TTFU] -> mousesports \| Kapi O m4a1 | **Partial** (damage) -> **Wallbang** | top row |
| `mouz.mtw.em4finals-1003021512-de_inferno.dem` | R2 C4 0:10 mTw.Mindfactory \| trace -> mousesports \| Kapio m4a1 | **Partial** (49px) -> **Wallbang** | top row |
| `mouz.mtw.em4finals-1003021512-de_inferno.dem` | R7 0:40 mTw.Mindfactory \| Sunde -> mousesports \| Kapio m4a1 | **Wallbang** (sliver) -> **Wallbang** | top row |
| `mtw-vs-lions-dhs11-1106191044-de_nuke.dem` | R3 1:16 LIONS kHRYSTAL ' KASPERSKY -> mTw \| ArcadioN ak47 | no tag -> **Partial** (damage) | recoil |
| `mtw-vs-navi-eswc2010semi-real-1007031530-de_tuscan.dem` | R17 1:26 Na`Vi markeloff /A/ -> mTw.Mindfactory \| ave galil | no tag -> **Partial** (damage) | miss rule |
| `mtw-vs-navi-eswc2010semi-real-1007031530-de_tuscan.dem` | R22 1:14 Na`Vi f0cuswOw~ -> mTw.Mindfactory \| minet ak47 | no tag -> **Partial** (damage) | miss rule |
| `mtw-vs-navi-eswc2010semi-real-1007031645-de_tuscan.dem` | R4 0:45 mTw.Mindfactory \| traceFFFFFFFF -> Na`Vi Zeus /A/ m4a1 | no tag -> **Partial** (damage) | recoil |
| `mtw-vs-navi-eswc2010semi-real-1007031645-de_tuscan.dem` | R5 0:38 mTw.Mindfactory \| ave -> Na`Vi markeloff /A/ m4a1 | no tag -> **Partial** (damage) | recoil |
| `mtw.mym.consfinal.EM3-0903081339-de_dust2.dem` | R29 C4 0:07 mTw \| whimp -> MEET KUBENB, YOUR MAKER m4a1 | no tag -> **Partial** (damage) | recoil |
| `mym.fnatic.final-0612201357-de_train.dem` | R22 1:22 MYM\|juve www.bet24.com -> fnatic.TeNt[Q.o-12] ak47 | no tag -> **Partial** (damage) | recoil |
| `navi-vs-m5-dhwinter2011-1111250937-de_inferno.dem` | R13 1:01 M5 Dosia[v] -> Na`Vi edzie ak47 | no tag -> **Partial** (damage) | recoil |
| `navi-vs-m5-dhwinter2011-1111250937-de_inferno.dem` | R14 1:14 Na`Vi edzie -> M5 ED1K m4a1 | no tag -> **Partial** (damage) | recoil |
| `noa.penta-0610211800-de_train.dem` | R23 C4 0:25 NoA.ave -> PENTAGRAM G-Shock \| neo[t] m4a1 | no tag -> **Partial** (damage) | recoil |
| `noa.penta-0610211800-de_train.dem` | R24 0:58 NoA.ave -> PENTAGRAM G-Shock \| neo[t] m4a1 | no tag -> **Partial** (damage) | recoil |
| `ravens.wmf.em4finals-1003031026-de_nuke.dem` | R10 1:06 Ravens.zE- * Steelseries -> WemadeFOX : SIA ak47 | no tag -> **Partial** (damage) | miss rule |
| `ravens.wmf.em4finals-1003031026-de_nuke.dem` | R15 1:24 Ravens.Friis * Dansk Metal -> WemadeFOX : solo m4a1 | no tag -> **Partial** (damage) | recoil |
| `roccat.estro.EMII.cebit-0803081202-de_inferno.dem` | R13 C4 0:12 eSTRO : hee -> ROCCAT.contE m4a1 | no tag -> **Partial** (205px) | top row |
| `roccat.fnatic.EMII-0803071948-de_inferno.dem` | R5 C4 0:06 fnatic Torgersen -> roccat > Samu A. <plastE> ak47 | no tag -> **Partial** (damage) | recoil |
| `sk-vs-dateam-iolfinal4-1106181158-de_dust2.dem` | R8 0:59 SK.RobbaN -> dt.REASPEL.se rape m4a1 | no tag -> **Wallbang** | recoil |
| `sk-vs-dateam-iolfinal4-1106181158-de_dust2.dem` | R11 0:49 SK.RobbaN -> dt.REASPEL.se STRIKER m4a1 | no tag -> **Partial** (damage) | recoil |
| `sk-vs-navi-dhwinter2011-1111261019-de_train.dem` | R7 C4 0:03 Na`Vi starix -> SK.face ak47 | no tag -> **Partial** (79px) | recoil |
| `sk-vs-navi-dhwinter2011-1111261019-de_train.dem` | R45 0:19 SK.f0rest -> Na`Vi Zeus /A/ m4a1 | no tag -> **Partial** (damage) | miss rule |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | R2 1:13 WinFakt aslak4yoso+M *Allihoppa -> SK.face deagle | **Wallbang** (sliver) -> **Wallbang** | top row |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | R5 1:13 SK.face -> WinFakt JiGetus =)DD m4a1 | **Partial** (29px) -> **Wallbang** | top row |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | R10 0:26 SK.Delpan <3 Johan Wedel -> WinFakt SIppRuL^:-) <3NY  [p] awp | no tag -> **Partial** (damage) | miss rule |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | R12 1:17 SK.RobbaN -> WinFakt SIppRuL^:-) <3NY  [p] m4a1 | no tag -> **Partial** (damage) | recoil |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | R14 1:09 SK.face -> WinFakt nsutOtO~ m4a1 | **Partial** (damage) -> **Partial** (69px) | top row |
| `virtus.attax.EMII-0803072033-de_inferno.dem` | R26 1:35 Virtus.pro > Ioann S. <Edward> -> ALTERNATE aTTaX \| CHEF-KOCH ak47 | no tag -> **Partial** (damage) | recoil |
| `wmf-vs-ate-beatit-1009041509-de_dust2.dem` | R12 C4 0:06 WemadeFOX : bAiL:)) -> A+e.gaming \| r4iD.pompom m4a1 | **Partial** (damage) -> **Wallbang** | top row |

## B. Sweden vs Poland, Nuke (`53.47.1132498-0904082305-de_nuke.dem`): 8 rounds counted of 39

The demo is 52:46 long. The recording starts in the first round of the first half, which goes 9:6 to Sweden (CT) over its 15 rounds (0:00 to 19:14); the half-time side swap kills all ten at 19:14; the admins' "live on 3" restarts at 19:22, 19:24 and 19:26, then MYM's plugin prints "<Game-Hosting.com: MYM> LIVE!!!" fourteen times from 19:30. Sweden, now T, win 7 of the next 8, which makes 16; the players leave at 29:21, and the HLTV records an empty server for 22 more minutes, 11 rounds lost on time with nobody on a team.

What decided it (`derive`, `src/ui/match.js`): the demo has an announced start, so "What the server's admin plugin announced beats guessing" holds: a round counts only if it started inside a window `liveWindows` (`src/ui/wallbangs.js`) opens. The only window opens at the first "LIVE!!!", 19:30. The first half's "LIVE!!!" came before the recording started, and MYM's plugin never says when a half ends, so the rule for a file that starts partway through a half (everything before its first end of half counts) has nothing to go by. The 15 first-half rounds fall outside every window. Every round:

| # | Starts (demo) | Live | Winner (how) | Kills | Score at its start, T:CT | Counted | Why |
|---|---|---|---|---|---|---|---|
| 0 | 0:00 | - | CT (elimination) | 7 | 0:0 | no | before the file's first "LIVE!!!" (19:30): outside every announced window (the recording starts during it) |
| 1 | 0:50 | - | CT (bomb defused) | 6 | 0:1 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 2 | 1:56 | - | T (bomb exploded) | 7 | 0:2 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 3 | 4:12 | - | T (bomb exploded) | 5 | 1:2 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 4 | 5:28 | - | T (elimination) | 6 | 2:2 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 5 | 6:44 | - | T (elimination) | 6 | 3:2 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 6 | 7:32 | - | CT (elimination) | 5 | 4:2 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 7 | 8:48 | - | T (bomb exploded) | 5 | 4:3 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 8 | 9:58 | - | CT (elimination) | 8 | 5:3 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 9 | 11:54 | - | CT (elimination) | 8 | 5:4 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 10 | 12:45 | - | CT (bomb defused) | 6 | 5:5 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 11 | 13:52 | - | T (elimination) | 9 | 5:6 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 12 | 16:01 | - | CT (bomb defused) | 8 | 6:6 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 13 | 17:13 | - | CT (elimination) | 6 | 6:7 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 14 | 18:00 | - | CT (elimination) | 8 | 6:8 | no | before the file's first "LIVE!!!" (19:30): outside every announced window |
| 15 | 19:14 | - | none | 0 | 6:9 | no | the half-time side swap: 7 suicides, no winner |
| 16 | 19:23 | - | none | 0 | 0:0 | no | a "live on 3" restart round: no kills, no winner |
| 17 | 19:25 | - | none | 0 | 0:0 | no | a "live on 3" restart round: no kills, no winner |
| 18 | 19:29 | R1 | T (elimination) | 9 | 0:0 | yes | inside the window the "LIVE!!!" opened |
| 19 | 20:38 | R2 | T (elimination) | 6 | 1:0 | yes | inside the window the "LIVE!!!" opened |
| 20 | 21:38 | R3 | T (elimination) | 6 | 2:0 | yes | inside the window the "LIVE!!!" opened |
| 21 | 23:00 | R4 | CT (elimination) | 5 | 3:0 | yes | inside the window the "LIVE!!!" opened |
| 22 | 23:55 | R5 | T (elimination) | 6 | 3:1 | yes | inside the window the "LIVE!!!" opened |
| 23 | 25:57 | R6 | T (elimination) | 9 | 4:1 | yes | inside the window the "LIVE!!!" opened |
| 24 | 27:46 | R7 | T (elimination) | 7 | 5:1 | yes | inside the window the "LIVE!!!" opened |
| 25 | 28:33 | R8 | T (elimination) | 7 | 6:1 | yes | inside the window the "LIVE!!!" opened |
| 26 | 29:21 | - | none (draw) | 0 | 7:1 | no | no kills and no winner (a draw; 3 CTs left 5 s in) |
| 27 | 29:34 | - | CT (time ran out) | 0 | 7:1 | no | no kills: nobody on a team, the round lost on time |
| 28 | 31:34 | - | CT (time ran out) | 0 | 7:2 | no | no kills: nobody on a team, the round lost on time |
| 29 | 33:34 | - | CT (time ran out) | 0 | 7:3 | no | no kills: nobody on a team, the round lost on time |
| 30 | 35:34 | - | CT (time ran out) | 0 | 7:4 | no | no kills: nobody on a team, the round lost on time |
| 31 | 37:34 | - | CT (time ran out) | 0 | 7:5 | no | no kills: nobody on a team, the round lost on time |
| 32 | 39:34 | - | CT (time ran out) | 0 | 7:6 | no | no kills: nobody on a team, the round lost on time |
| 33 | 41:34 | - | CT (time ran out) | 0 | 7:7 | no | no kills: nobody on a team, the round lost on time |
| 34 | 43:34 | - | CT (time ran out) | 0 | 7:8 | no | no kills: nobody on a team, the round lost on time |
| 35 | 45:34 | - | CT (time ran out) | 0 | 7:9 | no | no kills: nobody on a team, the round lost on time |
| 36 | 47:34 | - | CT (time ran out) | 0 | 7:10 | no | no kills: nobody on a team, the round lost on time |
| 37 | 49:34 | - | CT (time ran out) | 0 | 7:11 | no | no kills: nobody on a team, the round lost on time |
| 38 | 51:34 | - | none | 0 | 7:12 | no | cut by the end of the recording: no winner |

The idle-server rule (two rounds in a row with no kills and a winner end the stretch, the loop after the half-time swap in `derive`) is met at rounds 27 and 28, but changes nothing: those rounds are already out, having no kills (`counts` needs one), and no live round comes after them. No kills are missing: every round with a winner up to round 25 has its kills, and each death message matches a health reading of 0 (the same number of each in every round); the kill-less rounds with a winner had nobody on a team.

The real score: **Sweden 16 : 7 Poland**, Sweden 9:6 on CT, then 7:1 on T; the viewer reads POLSKA 1 : 7 SWEDEN. Sweden's 16th round is the last one played, and the players leave right after it.

The fix proposed (F5), in `derive` after `liveWindows`: when the demo's first announced window opens after its first round, the stretch from the file's start to the first restart counts as a half when it starts at 0:0, has 15 rounds played to a winner (12 for MR12), and the next live stretch has the teams on the other sides.

What F5 changes, measured on the 88 test demos with the rule's test alone (it isn't in the scratch build): it adds rounds to this demo only, its 15 first-half rounds, which makes Sweden 16 : 7 in 23 by the round winners. 44 other demos have their first announced start after their first round, but none of their first stretches is a whole half from 0:0 with the sides swapped after it. The nearest: FX vs SK, Inferno, IEM5 plays 15 rounds first, on a score carried from an earlier start; Burning vs FairFrag, Inferno, ESWC 2010 plays 42 and mym vs fnatic, Train 50, warm-ups and knife rounds with them. No expected file changes: none of them is one of these demos.

## C. emuLate vs Amazing Gaming, Dust2, WCG 2007 (protocol 47): AWP shots with no scope, sound or rechamber

What the demo has:
- **Fire events**: 18 AWP fire events in the whole demo (306 for the AK-47, 370 for the M4A1). Of its 49 AWP kills, 6 have the killer's fire event at the kill; 48 of 112 M4A1 kills and 27 of 99 AK-47 kills have theirs. The viewer plays a gunshot, the rechamber in **Player's eyes**, the gun flash and the shell only from a fire event, and drops the scope for the bolt only on one (`buildZoom`, `src/ui/lookups.js`), so a shot without one has none of them.
- **Zoom**: the server's click, `weapons/zoom.wav`, 552 times. The viewer's zoom comes from these clicks, so the scope does open there: at mSx's R12 1:41 kill on strike the viewer has 1x from his click at 1:44. With no fire event, though, the viewer doesn't know he fired: the scope stays up through that shot and his next at 1:39, where the game drops it for the bolt and brings it back.
- **The shots themselves**: the player model's body animation, which the snapshots do record. At every shot the shooter's sequence turns into `ref_shoot_rifle` (`crouch_shoot_rifle` crouched; the AWP and Scout use the rifle's), for two or three snapshots. Counted that way the demo has 138 AWP and Scout shots, against 18 fire events, each of which falls on one of them (within 0.15 s); 44 of the 49 AWP kills have theirs. The other 5: four killers had already switched to the knife or USP in the kill's snapshot, and xaoc's at R14 0:05 shows a shoot animation 0.22 s before the kill message.
- **starix at R14 around 1:29** (demo 33:42 to 33:58): he holds the AWP, unzoomed, with no zoom click, no fire event and no shoot animation from 1:35 to 1:20, so the demo shows no shot there. His AWP shots by the body animation are in warm-up rounds 3 to 7 and 11, and at R5 0:22 and 0:30 and R15 1:21 (open point 3).

Every AWP and Scout shot in the demo (warm-up rounds are the uncounted ones before the match, numbered as the reader numbers them; "Viewer zoom" is the level the viewer has from the clicks, 1 or 2; "Shot sound" is the same in the viewer and in the game, both playing it from the fire event):

| Round | Demo time | Shooter | Gun | Kill | Fire event | Zoom clicks (s before) | Viewer zoom at the shot | Shot sound in the viewer |
|---|---|---|---|---|---|---|---|---|
| warm-up 1 2:56 | 29.66 | mSx | awp | - | no | none | 1 | no |
| warm-up 1 2:53 | 31.97 | HaRtsSSsSsSsSSS | awp | B1ad3 | no | none | 1 | no |
| warm-up 1 2:45 | 40.61 | mSx | awp | - | no | -1.10 | 1 | no |
| warm-up 1 2:43 | 42.25 | HaRtsSSsSsSsSSS | awp | - | no | -0.87 | 1 | no |
| warm-up 1 2:37 | 48.60 | HaRtsSSsSsSsSSS | awp | - | no | -0.55 | 1 | no |
| warm-up 1 2:30 | 55.37 | HaRtsSSsSsSsSSS | awp | xaoc | no | -2.08 | 1 | no |
| warm-up 2 2:43 | 82.40 | mSx | awp | xaoc | no | -2.74, -2.41, -0.55 | 1 | no |
| warm-up 2 2:40 | 85.13 | mSx | awp | - | no | none | 0 | no |
| warm-up 2 2:36 | 89.06 | mSx | awp | - | no | -0.54 | 1 | no |
| warm-up 2 2:27 | 97.82 | mSx | awp | - | no | -2.08, -1.64, -1.32, -0.76, -0.33 | 1 | no |
| warm-up 2 2:13 | 112.35 | ioRek | awp | - | yes | -0.76 | 1 | yes, at 112.35 |
| warm-up 3 2:57 | 120.56 | starix | awp | ioRek | no | -1.42, -1.09 | 2 | no |
| warm-up 3 2:55 | 122.42 | xaoc | awp | - | no | -1.86, -1.53 | 2 | no |
| warm-up 3 2:55 | 122.53 | starix | awp | - | no | none | 2 | no |
| warm-up 3 2:55 | 122.75 | strike | awp | - | no | -0.98 | 1 | no |
| warm-up 3 2:53 | 124.83 | strike | awp | - | no | none | 1 | no |
| warm-up 3 2:52 | 125.38 | xaoc | awp | mSx (HS) | no | none | 2 | no |
| warm-up 3 2:49 | 128.88 | starix | awp | HaRtsSSsSsSsSSS | no | none | 2 | no |
| warm-up 3 2:46 | 131.39 | starix | awp | R!Go | no | none | 2 | no |
| warm-up 4 2:56 | 145.94 | MaT | awp | - | no | -2.52, -2.19 | 2 | no |
| warm-up 4 2:54 | 147.79 | xaoc | awp | - | yes | -0.97 | 1 | yes, at 147.79 |
| warm-up 4 2:53 | 148.78 | starix | awp | - | no | -2.74, -2.40, -0.33, 0.00 | 2 | no |
| warm-up 4 2:52 | 149.98 | HaRtsSSsSsSsSSS | awp | strike | no | -2.51 | 0 | no |
| warm-up 4 2:50 | 151.62 | starix | awp | - | yes | -2.84, -0.43, -0.11 | 2 | yes, at 151.62 |
| warm-up 4 2:49 | 152.83 | xaoc | awp | HaRtsSSsSsSsSSS | no | none | 1 | no |
| warm-up 4 2:39 | 162.78 | starix | awp | - | no | -1.86, -0.98, -0.44 | 0 | no |
| warm-up 4 2:34 | 167.48 | MaT | awp | weissds | yes | -2.40 | 1 | yes, at 167.48 |
| warm-up 4 2:34 | 167.81 | starix | awp | - | no | -2.84, -1.74 | 2 | no |
| warm-up 4 2:33 | 168.90 | xaoc | awp | - | no | -0.75 | 1 | no |
| warm-up 4 2:32 | 169.78 | MaT | awp | - | no | -0.33 | 1 | no |
| warm-up 4 2:31 | 170.55 | starix | awp | - | no | -0.88 | 1 | no |
| warm-up 4 2:31 | 170.66 | xaoc | awp | - | no | -2.51 | 1 | no |
| warm-up 4 2:29 | 172.51 | xaoc | awp | mSx | no | none | 1 | no |
| warm-up 4 2:24 | 177.98 | starix | awp | - | no | -0.88, -0.55 | 1 | no |
| warm-up 5 2:45 | 215.18 | HaRtsSSsSsSsSSS | awp | xaoc (HS) | no | -2.63, -1.76 | 2 | no |
| warm-up 5 2:42 | 218.13 | starix | awp | mSx | no | -0.67, -0.33 | 1 | no |
| warm-up 5 2:39 | 221.09 | HaRtsSSsSsSsSSS | awp | starix | no | -1.65, -1.21 | 2 | no |
| warm-up 6 2:55 | 248.65 | starix | awp | - | no | -0.99, -0.67 | 2 | no |
| warm-up 6 2:52 | 251.81 | starix | awp | - | yes | -0.98 | 1 | yes, at 251.81 |
| warm-up 6 2:49 | 254.77 | starix | awp | mSx | no | -0.98, -0.66 | 2 | no |
| warm-up 6 2:40 | 263.73 | starix | awp | - | no | -0.77, -0.44 | 2 | no |
| warm-up 6 2:37 | 266.47 | starix | awp | - | no | 0.00 | 0 | no |
| warm-up 7 2:57 | 278.40 | starix | awp | - | no | -1.10 | 1 | no |
| warm-up 7 2:57 | 278.51 | ioRek | awp | starix | no | -0.87, -0.54 | 2 | no |
| warm-up 7 2:36 | 299.73 | ioRek | awp | - | no | 0.00 | 1 | no |
| warm-up 7 2:34 | 301.69 | ioRek | awp | - | no | -1.96, -0.10 | 1 | no |
| warm-up 8 2:55 | 311.75 | ioRek | awp | xaoc | no | -2.30, -1.97 | 2 | no |
| warm-up 8 2:52 | 314.59 | strike | awp | R!Go | no | none | 2 | no |
| warm-up 8 2:49 | 318.31 | strike | awp | mSx | no | -1.75 | 1 | no |
| warm-up 10 2:54 | 380.56 | HaRtsSSsSsSsSSS | awp | - | no | -2.75, -2.41 | 2 | no |
| warm-up 10 2:50 | 383.84 | HaRtsSSsSsSsSSS | awp | strike | no | -0.88 | 1 | no |
| warm-up 11 2:55 | 412.05 | starix | awp | - | yes | -2.74 | 1 | yes, at 412.05 |
| warm-up 11 2:49 | 418.07 | starix | awp | ioRek | yes | -1.20, -0.87 | 2 | yes, at 418.07 |
| warm-up 11 2:43 | 424.30 | starix | awp | - | no | -1.21 | 1 | no |
| warm-up 14 2:55 | 529.63 | xaoc | awp | - | no | -2.85, -2.51 | 2 | no |
| warm-up 14 2:54 | 530.29 | strike | awp | - | yes | -2.62, -2.30 | 2 | yes, at 530.29 |
| warm-up 14 2:52 | 532.48 | strike | awp | - | no | none | 2 | no |
| warm-up 14 2:50 | 534.67 | xaoc | awp | mSx | yes | none | 2 | yes, at 534.67 |
| warm-up 14 2:41 | 543.08 | xaoc | awp | - | no | -1.74, -1.09 | 1 | no |
| warm-up 14 2:39 | 545.05 | xaoc | awp | R!Go | no | none | 1 | no |
| warm-up 14 2:35 | 549.54 | xaoc | awp | - | no | -2.63, -0.34 | 0 | no |
| warm-up 14 2:33 | 551.61 | strike | awp | - | yes | -0.44, -0.11 | 1 | yes, at 551.61 |
| warm-up 14 2:31 | 553.14 | strike | awp | - | no | -1.97, -1.63, 0.00 | 2 | no |
| warm-up 14 2:30 | 554.24 | xaoc | awp | - | no | none | 0 | no |
| warm-up 14 2:30 | 554.57 | strike | awp | - | no | -1.42, 0.00 | 0 | no |
| warm-up 14 2:28 | 556.10 | strike | awp | - | no | -2.95, -1.53 | 0 | no |
| warm-up 15 2:55 | 567.36 | strike | awp | - | no | -1.63, -1.31 | 2 | no |
| warm-up 15 2:52 | 569.99 | strike | awp | R!Go | no | -0.88 | 1 | no |
| warm-up 15 2:38 | 583.66 | strike | awp | MaT | no | none | 0 | no |
| warm-up 15 2:36 | 585.74 | strike | awp | HaRtsSSsSsSsSSS | no | none | 0 | no |
| warm-up 16 2:33 | 623.81 | strike | awp | HaRtsSSsSsSsSSS | no | -2.85, -2.63, -1.10, -0.54 | 1 | no |
| warm-up 16 2:23 | 634.08 | strike | awp | ioRek (HS) | no | none | 0 | no |
| R4 1:41 | 927.87 | mSx | awp | starix | no | none | 0 | no |
| R5 0:30 | 1123.99 | starix | awp | - | yes | none | 0 | yes, at 1123.99 |
| R5 0:29 | 1125.29 | xaoc | awp | R!Go | yes | -1.19, -0.65 | 0 | yes, at 1125.29 |
| R5 0:22 | 1132.18 | starix | awp | - | no | none | 2 | no |
| R6 1:41 | 1185.13 | mSx | awp | - | no | -0.99 | 1 | no |
| R6 C4 0:20 | 1231.29 | mSx | awp | - | no | -0.66 | 1 | no |
| R6 C4 0:21 | 1232.82 | mSx | awp | - | no | -2.19 | 1 | no |
| R7 1:41 | 1269.90 | mSx | awp | - | no | -1.20 | 1 | no |
| R7 0:25 | 1346.13 | xaoc | awp | - | no | -0.43 | 1 | no |
| R7 0:22 | 1348.54 | mSx | awp | - | no | -2.09 | 1 | no |
| R7 0:21 | 1349.96 | xaoc | awp | - | no | -1.09, -0.76 | 2 | no |
| R7 0:17 | 1353.45 | xaoc | awp | MaT | no | -0.87, -0.54 | 2 | no |
| R7 0:15 | 1356.08 | xaoc | awp | - | no | -0.76 | 1 | no |
| R7 0:12 | 1358.48 | mSx | awp | xaoc | no | -0.65 | 0 | no |
| R8 1:23 | 1409.02 | mSx | awp | xaoc | no | -2.73, -1.64, -1.20 | 0 | no |
| R8 1:08 | 1423.90 | strike | awp | mSx | no | -1.75 | 1 | no |
| R8 0:43 | 1448.50 | ioRek | awp | - | no | none | 0 | no |
| R8 C4 0:08 | 1491.38 | strike | awp | - | no | none | 0 | no |
| R8 C4 0:09 | 1492.92 | strike | awp | - | no | 0.00 | 1 | no |
| R9 1:20 | 1538.85 | ioRek | awp | - | no | none | 1 | no |
| R9 C4 0:28 | 1620.33 | ioRek | awp | B1ad3 | no | none | 1 | no |
| R10 1:05 | 1680.17 | strike | awp | ioRek | no | none | 1 | no |
| R10 0:58 | 1686.40 | strike | awp | - | no | none | 1 | no |
| R10 0:37 | 1708.06 | strike | awp | - | no | none | 2 | no |
| R10 0:35 | 1709.81 | strike | awp | - | no | none | 2 | no |
| R11 1:41 | 1769.10 | mSx | awp | - | no | -2.74, -2.41 | 2 | no |
| R11 0:55 | 1814.59 | strike | awp | - | no | -0.11 | 1 | no |
| R11 0:38 | 1831.65 | mSx | awp | - | no | none | 1 | no |
| R11 0:28 | 1841.39 | strike | awp | - | yes | none | 1 | yes, at 1841.39 |
| R11 0:15 | 1854.63 | strike | awp | - | yes | none | 0 | yes, at 1854.63 |
| R11 0:14 | 1856.15 | mSx | awp | B1ad3 (HS) | no | -0.22 | 1 | no |
| R11 0:13 | 1857.02 | strike | awp | - | no | -0.54 | 1 | no |
| R11 0:07 | 1862.50 | mSx | awp | - | no | none | 0 | no |
| R11 C4 0:00 | 1863.05 | strike | awp | - | no | none | 0 | no |
| R11 C4 0:01 | 1864.47 | strike | awp | - | no | 0.00 | 1 | no |
| R12 1:41 | 1891.37 | mSx | awp | strike (HS) | no | none | 1 | no |
| R12 1:39 | 1893.12 | mSx | awp | - | no | none | 1 | no |
| R12 1:22 | 1909.86 | mSx | awp | - | no | 0.00 | 1 | no |
| R13 1:30 | 1956.78 | mSx | awp | - | no | 0.00 | 1 | no |
| R14 1:40 | 2017.49 | mSx | awp | - | no | -2.52, -2.09 | 2 | no |
| R14 0:59 | 2058.71 | strike | awp | ioRek | yes | none | 1 | yes, at 2058.71 |
| R14 0:59 | 2058.71 | xaoc | awp | - | no | none | 1 | no |
| R14 0:39 | 2078.62 | strike | awp | - | no | none | 0 | no |
| R14 0:21 | 2096.13 | strike | awp | - | yes | none | 0 | yes, at 2096.13 |
| R14 0:16 | 2101.92 | xaoc | awp | - | no | none | 2 | no |
| R14 0:14 | 2104.00 | xaoc | awp | - | no | none | 2 | no |
| R14 0:10 | 2107.51 | mSx | awp | - | no | -0.77 | 2 | no |
| R14 0:08 | 2110.01 | xaoc | awp | R!Go | no | -2.07, -0.43 | 0 | no |
| R14 0:02 | 2115.59 | xaoc | awp | MaT (HS) | no | -0.44 | 1 | no |
| R14 0:00 | 2121.28 | mSx | awp | - | no | -0.88 | 1 | no |
| R14 0:00 | 2121.40 | strike | awp | - | no | -0.66 | 1 | no |
| R14 0:00 | 2122.71 | mSx | awp | - | yes | -2.30 | 1 | yes, at 2122.71 |
| R15 1:40 | 2142.72 | mSx | awp | - | no | none | 2 | no |
| R15 1:21 | 2161.65 | starix | awp | - | no | none | 1 | no |
| R15 1:21 | 2161.74 | mSx | awp | starix | no | -2.07, -1.09 | 2 | no |
| R15 1:17 | 2165.58 | strike | awp | mSx | no | -2.41 | 0 | no |
| R15 1:06 | 2176.30 | xaoc | awp | - | no | none | 0 | no |
| R15 C4 0:04 | 2180.79 | xaoc | awp | - | no | -1.21 | 1 | no |
| R15 C4 0:06 | 2182.97 | HaRtsSSsSsSsSSS | awp | - | no | -0.87, -0.55 | 1 | no |
| R15 C4 0:10 | 2187.46 | xaoc | awp | - | no | -0.44 | 1 | no |
| R22 1:41 | 2847.54 | mSx | awp | - | no | -0.76, -0.33 | 2 | no |
| R22 1:18 | 2870.19 | ioRek | awp | - | no | -1.97 | 0 | no |
| R22 0:54 | 2893.81 | ioRek | awp | - | no | -1.10, -0.77 | 1 | no |
| R22 0:23 | 2925.53 | mSx | awp | starix | yes | -1.42, -0.66, -0.33 | 0 | yes, at 2925.53 |
| R22 0:21 | 2927.17 | mSx | awp | - | no | -2.30, -1.97 | 0 | no |
| R22 0:20 | 2928.59 | mSx | awp | - | no | none | 0 | no |

Protocol 47 against 48: the reader has no code that reads protocol 47 differently (`src/demo.js` reads events, sounds and deltas the same way for both), and the loss isn't the protocol's. AWP kills with the killer's fire event:

| Demo | Protocol | AWP and Scout kills | with the killer's fire event | with the shoot animation |
|---|---|---|---|---|
| emuLate vs Amazing Gaming, Dust2, WCG 2007 | 47 | 49 | 6 | 44 |
| NoA vs Pentagram, Train, 2006 | 47 | 34 | 18 | 29 |
| mym vs fnatic, Train, CPL Winter 2006 (probably) | 47 | 57 | 30 | 49 |
| Sweden vs Ukraine, Train, ClanBase NationsCup XI | 47 | 10 | 9 | 8 |
| Virtus.pro vs aTTaX, Inferno, Extreme Masters II (`-0803072033-`) | 47 | 37 | 36 | 34 |
| SK vs Na`Vi, Train, DreamHack Winter 2011 (AWPs look right) | 48 | 71 | 71 | 61 |
| iFNG FX vs fnatic, Dust2, IEM 2011 (AWPs look right) | 48 | 45 | 45 | 45 |
| Na`Vi vs FX, Dust2, SEC 2011 final | 48 | 24 | 9 | 19 |
| WeMadeFox vs ATE Gaming, Dust2, MSI Beat IT! 2010 | 48 | 11 | 1 | 11 |

Protocol 47 demos keep from 12% to 97% of them, protocol 48 demos from 9% to 100%: how much a demo keeps is the recording's, not the protocol's.

The sounds:
- **In the demo itself**: the game's demo player also plays a gunshot only from the fire event (CS's client event scripts), so a shot the demo lost is silent there too: 120 of the 138 here. No event in any of these demos carries a fire-time delay (the svc_event field the reader skips), and no AWP or Scout fire event comes sooner than the gun can fire again after another of the same player's. So the demo has no delayed or doubled AWP sound. A later AWP sound is a later shot whose event survived, after earlier ones that were silent: mSx at R14 0:00 fires at demo 2121.28 (no event, silent) and again at 2122.71, one AWP cycle later (event, heard).
- **What the viewer adds**: the first time a sound file is needed, the viewer loads it and skips that play (`playSound`, `src/audio.js`), so the first AWP shot of a visit is silent; a frame more than 0.5 s after the last one (a seek, a busy tab) skips the sounds in between (`soundTick`); and at 4× speed or faster footsteps are left out. A new shot of the same player cuts his last one, as the game's weapon channel does.

The fix proposed (C1): the AWP and Scout shots from the body animation, where the demo has no fire event within 0.15 s, for the gunshot, the rechamber, the scope's drop and return, the gun flash and the shell; the wallbang finder keeps reading fire events only, so no label changes. The other guns' shoot animation runs on while they spray, so it can't count their shots; the AWP's and Scout's one shot per animation can.

What C1 changes, measured on the 79 HLTV test demos (the 9 POV demos left out: the recorder's own shots come from his gun's round count, `povShots`): the body animation shows 4,385 AWP and Scout shots, 3,578 of them on a fire event and 807 with none (120 in this demo; 21 demos have 10 or more), the shots C1 would give a sound, a rechamber and the scope's drop. In the 29 demos that keep the fire event of every AWP and Scout kill, 41 of their 1,352 shoot animations have no fire event (3%: shots whose event a quick switch lost, or an animation with no shot), and the animation finds 1,311 of their 1,466 fire events. No wallbang label and no expected file changes, since the finder keeps reading fire events only.

## Open points for Sujan

1. Which moment, and whose eye, decides a sliver: PeRRy's REAL shows 0 pixels from PeRRy's eye at the shot and 453 pixels 0.1 s before, where Sujan's game, spectating PeRRy, draws him; the server traces the bullet against REAL as PeRRy's game drew him (lag compensation, about 0.1 s back). FLEX0R on R!Go- (20 Nov) was judged from the victim's eye at the shot. F4′ gets PeRRy right through the damage rule either way.
2. Whether to build F4′, F5 and C1, each with its own pull request or together; for F4′, whether GeT_RiGhT's 15 pixels on KORN should keep it **Partial** (a 0-pixel line for hidden kills too, the parked question) or the top row stays at 30 and pasha's Tentpole stays a known gap.
3. starix at R14 around 1:29: the moment Sujan saw (the demo time on the timer's hover), since the demo shows no shot of his there.

## How it was measured

- Each kill and the round and AWP tables: page scripts run with `tests/harness.py` on main's build and the scratch builds (about 10 s a demo); the fire events' fields, delays and the recoil statistics: node scripts on reader copies (`src/demo.js` plus the fields it skips), 3 to 8 s a demo.
- The first all-demo run (F4's parts on and off, B's rule, C's counts; 88 demos): 6.2 minutes on Sujan's go, then `ground_truth_check.py` on that build, 2.0 minutes, 35 mismatches. The second (F4′, three settings): 5.1 minutes on his second go, then `ground_truth_check.py`, 2.1 minutes, 2 mismatches, the three new kills passing.
- On main: `ground_truth_check.py` on the three new expected files, PASS with three known gaps; `notes_check.py` PASS; the test demo folder checked with `demo_dirs.py check`, 88 demos.

## D. Follow-up, 23 Nov 2026: the unlag moment, a 1-pixel line for hidden kills, the recoil's size

Sujan's go of 23 Nov 2026: F5 approved; F4′ and C1 wait for his checks in his game (`~/Downloads/cs16-review-2026-11-23.zip`, checks a to e; `DECISIONS.md`). This section measures three more questions on the scratch build, each behind a switch, nothing built.

### D1. The victim where the server traced the bullet

ReHLDS (`engine/sv_user.cpp`, SV_GetUnlagTargetTime) traces a shot against the other players where they were at the server's time minus the shooter's latency minus his interpolation (`lerp_msec`, at most 0.1 s, or one message interval if that's longer), plus `sv_unlagpush`, the latency capped at `sv_maxunlag`. The setting measured draws the victim in the picture check at the shot minus the shooter's ping from svc_pings at that moment plus 0.1 s, from the shooter's eye at the shot, the map (doors, broken glass) as at the shot; which kills get a picture, and the 50-pixel and 1-pixel lines, stay as today.

Measured on the 79 HLTV test demos and with `ground_truth_check.py` on a build with the setting on, against today (the victim at the shot). The shooters' pings at the confirmed kills: 3 to 6 ms on LAN (so 0.103 to 0.106 s back), 21 to 75 ms online (ClanBase, ENC); 201 of 232 are 10 ms or less, and 10 kills come before the demo's first ping message (taken as 0).

**FLEX0R on R!Go-** (Team Belgium vs France, Tuscan, ClanBase NationsCup XII, R21 0:39; confirmed **Wallbang**): FLEX0R's ping is 21 ms, so R!Go- is drawn 0.121 s before the shot: 2,181 pixels of him show, against 0 at the shot. Since the 15 points see part of him and the aim goes through cover, it's a sliver kill, and a sliver with 50 pixels or more isn't listed: the kill reads no tag. **PeRRy on REAL**: PeRRy's ping is 35 ms, so 0.135 s back: 830 pixels of REAL (453 at 0.1 s back, 0 at the shot); the kill still reads no tag, since its aim is clear and the picture check never runs on it.

The confirmed answers that change (9 break, 2 known gaps come right, and 2 known gaps read otherwise but stay wrong):

| Match | Kill | Confirmed | Today | At the unlag moment | Pixels: shot, unlag moment (ping) |
|---|---|---|---|---|---|
| Team Belgium vs France, Tuscan, ClanBase NationsCup XII | R21 0:39 FLEX0R on R!Go- | **Wallbang** | **Wallbang** | no tag | 0, 2,181 (21 ms) |
| Sweden vs Norway, Dust2, ASUS ENC 2010 | R7 1:12 GeT_RiGhT on KORN | **Partial** | **Partial** | **Wallbang** | 15, 0 (22 ms) |
| fnatic vs mousesports, Forge, IEM6 Guangzhou final, file 1 | R15 1:28 Friis on KARRiGAN | **Partial** | **Partial** | no tag | 26, 974 (5 ms) |
| fnatic vs Na`Vi, Dust2, GameGune 2012 final | R20 0:36 markeloff on Xizt | **Partial** | **Partial** | **Wallbang** | 410, 0 (3 ms) |
| FX vs eSahara, Dust2, DreamHack Winter 2010 | R18 0:21 KUBEN on RARA | **Partial** | **Partial** | no tag | 41, 336 (3 ms) |
| FX vs mTw, Nuke, Xperia Play 2011, part 2 | R21 C4 0:13 ave on PASHA | **Partial** | **Partial** | no tag | 15, 50 (3 ms) |
| mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, `-1655-` | R6 C4 0:25 minet on ceh9 | **Partial** | **Partial** | **Wallbang** | 69, 0 (3 ms) |
| MYM vs mTw, Dust2, EM3 2009 consolation final | R29 C4 0:13 ave on taz | **Partial** | **Partial** | **Wallbang** | 210, 16 (3 ms) |
| Na`Vi vs FX, Dust2, SEC 2011 final | R4 1:05 Edward on 742 | **Partial** | **Partial** | **Wallbang** | 98, 0 (3 ms) |
| FX vs Lions, Nuke, DreamHack Winter 2010 | R22 0:47 THREAT on LoordB | **Partial** | **Wallbang** (known gap) | **Partial**, right | 38, 64 (4 ms) |
| SK vs eSTRO, Dust2, WCG 2008, the 5-minute file | R1 1:35 Tentpole on zet | **Partial** | **Wallbang** (known gap) | **Partial**, right | 0, 7 (3 ms) |
| Sweden vs Ukraine, Train, ClanBase NationsCup XI | R22 1:26 LMBT on RobbaN | **Partial** by damage | no tag (known gap) | **Partial** by its pixels | 316, 49 (45 ms) |
| Sweden vs Norway, Dust2, ASUS ENC 2010 | R25 0:46 REAL on alleN | **Partial** | **Wallbang** (known gap) | no tag | 0, 1,718 (21 ms) |

On the 79 demos, 64 kills change their label on 38 demos (28 **Wallbang** to **Partial**, 8 **Partial** to **Wallbang**, 6 of each to no tag, 13 no tag to **Wallbang** and 3 to **Partial**), and 32 more **Partial** kills only their pixel count. Of the 1,409 pictures drawn both ways, 544 show more of the victim at the unlag moment and 375 less; 40 go from 0 pixels to some, 27 from some to 0.

So the unlag moment doesn't fit Sujan's answers better than the shot: it breaks 9 and puts 2 right. 4 of the 9 are slivers that show 50 pixels or more there (FLEX0R's 2,181), which the sliver rule then takes out of the list; 5 of the 9 lose their pixels at the unlag moment, 4 gain them. 7 of the 9 are LAN kills (3 to 5 ms), where the two moments are 0.1 s apart.

### D2. Hidden kills **Partial** from 1 pixel, with the top row at 24

The parked question **One line for strict: 0 pixels for hidden kills too?**: a kill none of the sight points sees is strict up to 49 pixels today, where a sliver kill (seen by a point, the aim through cover) is strict only at 0. Measured with hidden kills **Partial** from 1 pixel and F4′'s top row at 24, nothing else of F4′.

Measured the same way (`ground_truth_check.py` on a build with both on).

**GeT_RiGhT on KORN** (Sweden vs Norway, Dust2, ASUS ENC 2010, R7 1:12; confirmed **Partial**): 15 pixels at the shot. With the top row at 24 alone (F4′) none of the points sees KORN, and as a hidden kill under 50 pixels it read **Wallbang**; with the 1-pixel line it reads **Partial**, as confirmed.

The confirmed answers that change (1 breaks, 1 keeps its label for another reason, 2 known gaps come right):

| Match | Kill | Confirmed | Today | Top row at 24, 1-pixel line | Pixels at the shot |
|---|---|---|---|---|---|
| mousesports vs AGAiN, Inferno, ESWC 2011 final | R4 1:13 742 on gob b | **Wallbang** | **Wallbang** | **Partial** | 49 |
| SK vs WinFakt, Mirage, IEM6 New York | R14 1:09 face on nsutOtO | **Partial** by damage | **Partial** by damage | **Partial** by its 69 pixels (the top row) | 69 |
| FX vs Lions, Nuke, DreamHack Winter 2010 | R22 0:47 THREAT on LoordB | **Partial** | **Wallbang** (known gap) | **Partial**, right | 38 |
| Sweden vs Poland, Dust2, 8 Apr 2009 | R15 1:09 pasha on Tentpole | **Wallbang** | **Partial** (known gap) | **Wallbang**, right (the top row) | 0 |

On the 79 demos, 24 kills change their label on 18 demos: 18 hidden kills with 1 to 49 pixels go from **Wallbang** to **Partial**, and the top row's own 4 **Partial** to **Wallbang** and 2 no tag to **Partial**.

742 on gob b is the one 1-pixel case Sujan answered the other way: 49 pixels, hidden to the points. With F4′'s top row the 1-pixel line keeps GeT_RiGhT on KORN and puts THREAT on LoordB right; on its own it would turn 18 **Wallbang** kills on the test demos into **Partial**.

### D3. The recoil's size on F4′'s 44 rescued kills and F4's 33 broken answers

From the same run, for each kill: the recoil at the killing shot (from its fire event) and how far into cover the recorded line and the recoil line (the recorded aim plus the recoil) go, to the victim's distance.

On F4′'s 44 rescued kills the recorded line is clear on every one, by definition. The recoil is 0.51° to 5.63° (median 2.58°), and the recoil line goes 2 to 321 units into cover (median 12). The rule "1° or more and 8 units or more into cover" keeps 26 of the 44, RobbaN on whiMp among them (4.43°, 20 units of the crate). It drops 18: 5 under 1°, 16 under 8 units, 3 both. It breaks none of the 243 confirmed answers. F4′'s rescue as measured changed none of them (both mismatches of its check came from the top row), and the rule rescues fewer of the same kills.

On the 33 confirmed answers the recoil broke in F4, the recoil line goes 0 units into cover on every one (it's clear), where the recorded line goes 2 to 327 units into it (27 of them 8 or more). 31 of the 33 have a recoil of 1° or more (0.16° to 5.63°). So the recoil's size doesn't tell them apart from the 44: only the direction does (a recorded line through cover that the recoil clears, against a clear line the recoil puts into cover). That direction is what F4′ already uses: it never lets the recoil clear a line.

The 44 rescued kills, the ones the rule keeps first:

| Demo | Kill | Recoil (pitch, yaw) | Recoil line into cover | Kept by 1° and 8 units | With F4′ |
|---|---|---|---|---|---|
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem` | R15 1:30 mousesports \| ninja -> fnaticMSI cArn m4a1 | 2.87° (-2.55, -1.32) | 16 units | yes | Wallbang |
| `1110241407--auto_de_inferno.dem_mousesports-vs-AGAIN.dem` | R13 0:49 mousesports \| ninja -> AGAiN  742 m4a1 | 2.52° (-2.30, -1.03) | 16 units | yes | Partial (damage) |
| `53.52.1646548-1005272144-de_dust2.dem` | R28 0:59 SWIIIIIDEEEN  Delpan -> NORWAY KORN m4a1 | 2.37° (-2.26, +0.71) | 32 units | yes | Partial (damage) |
| `53.52.1646548-1005272144-de_dust2.dem` | R3 C4 0:09 SWIIIIIDEEEN  FoReSt -> NORWAY RashiE ak47 | 3.31° (-3.17, -0.95) | 18 units | yes | Partial (damage) |
| `FX-vs-sk-iem5-inf.dem` | R12 1:04 Frag eXecutors  taz -> SK.RobbaN ak47 | 1.28° (-1.23, +0.37) | 12 units | yes | Partial (damage) |
| `SK_vs_e-STRO_WCG2008-0811081950-de_dust2.dem` | R8 1:25 SKWEDEN zet -> KOREA.eSTRO : termi m4a1 | 2.59° (-2.49, +0.71) | 14 units | yes | Partial (damage) |
| `SK_vs_e-STRO_WCG2008-0811082043-de_nuke.dem` | R19 1:26 KOREA.eSTRO : hee -> SKWEDEN Tentpole <3 Tezz m4a1 | 2.47° (-2.46, -0.27) | 16 units | yes | Partial (124px) |
| `SK_vs_e-STRO_WCG2008-0811082043-de_nuke.dem` | R9 1:25 SKWEDEN RobbaN[alitdg] -> KOREA.eSTRO : hee m4a1 | 2.84° (-2.55, +1.24) | 12 units | yes | Partial (damage) |
| `auto-1003032023-de_inferno.dem` | R19 0:36 SK\|Gux -> coL.thomz ak47 | 4.73° (-4.53, +1.37) | 28 units | yes | Partial (damage) |
| `auto-1003051236-de_inferno.dem` | R6 C4 0:05 dsn -> face m4a1 | 2.49° (-2.28, -1.01) | 22 units | yes | Partial (damage) |
| `auto-1003051236-de_inferno.dem` | R9 C4 0:21 RobbaN -> GeT_RiGhT4J ak47 | 5.63° (-5.26, +2.02) | 321 units | yes | Partial (damage) |
| `auto-1003051321-de_train.dem` | R20 1:07 cArn -> Gux ak47 | 4.36° (-4.00, +1.73) | 32 units | yes | Partial (damage) |
| `auto_ifng-1110042211-de_forge.dem` | R12 1:26 fnaticMSI CARN -> mousesports \| KARRiGAN m4a1 | 2.39° (-2.27, +0.76) | 40 units | yes | Partial (damage) |
| `final-tusca-0811091552-de_tuscan.dem` | R27 0:55 Sunde -> walle m4a1 | 2.50° (-2.39, +0.72) | 8 units | yes | Partial (damage) |
| `final-tusca-0811091552-de_tuscan.dem` | R30 1:22 RobbaN -> whiMp ak47 | 4.43° (-4.28, -1.16) | 20 units | yes | Partial (130px) |
| `fx-vs-esahara-dhw2010-1011271131-de_nuke.dem` | R19 C4 0:20 Frag eXecutors  742 -> ESAHARA.net sadliGENO ak47 | 2.40° (-2.40, -0.13) | 8 units | yes | Partial (damage) |
| `fx.eg.em4finals-1003021929-de_train.dem` | R28 1:22 EG.n0thing -> eXecutors  neo m4a1 | 2.76° (-2.71, -0.52) | 24 units | yes | Partial (damage) |
| `k1ck-vs-eq-dhwinter2011-1111260056-de_nuke.dem` | R20 C4 0:12 K1CK mUtcb -> -Eq- SeDaN m4a1 | 2.46° (-2.46, +0.09) | 8 units | yes | Partial (230px) |
| `mtw-vs-navi-eswc2010semi-real-1007031645-de_tuscan.dem` | R5 0:38 mTw.Mindfactory \| ave -> Na`Vi markeloff /A/ m4a1 | 2.41° (-2.27, +0.80) | 10 units | yes | Partial (damage) |
| `navi-vs-m5-dhwinter2011-1111250937-de_inferno.dem` | R14 1:14 Na`Vi edzie -> M5 ED1K m4a1 | 2.43° (-2.34, +0.67) | 22 units | yes | Partial (damage) |
| `noa.penta-0610211800-de_train.dem` | R23 C4 0:25 NoA.ave -> PENTAGRAM G-Shock \| neo[t] m4a1 | 2.22° (-2.22, +0.08) | 20 units | yes | Partial (damage) |
| `noa.penta-0610211800-de_train.dem` | R24 0:58 NoA.ave -> PENTAGRAM G-Shock \| neo[t] m4a1 | 2.30° (-2.24, +0.54) | 36 units | yes | Partial (damage) |
| `roccat.fnatic.EMII-0803071948-de_inferno.dem` | R5 C4 0:06 fnatic Torgersen -> roccat > Samu A. <plastE> ak47 | 4.73° (-4.53, -1.37) | 20 units | yes | Partial (damage) |
| `sk-vs-navi-dhwinter2011-1111261019-de_train.dem` | R7 C4 0:03 Na`Vi starix -> SK.face ak47 | 3.31° (-3.19, -0.87) | 34 units | yes | Partial (79px) |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | R12 1:17 SK.RobbaN -> WinFakt SIppRuL^:-) <3NY  [p] m4a1 | 2.59° (-2.49, -0.71) | 8 units | yes | Partial (damage) |
| `virtus.attax.EMII-0803072033-de_inferno.dem` | R26 1:35 Virtus.pro > Ioann S. <Edward> -> ALTERNATE aTTaX \| CHEF-KOCH ak47 | 4.73° (-4.53, +1.37) | 18 units | yes | Partial (damage) |
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem` | R20 0:45 fnaticMSI Gux <3 pingu -> mousesports \| zonixx m4a1 | 2.62° (-2.50, -0.78) | 2 units | no | Partial (damage) |
| `1110231221--auto_de_train.dem_navi-vs-winfast.dem` | R13 C4 0:08 Na`Vi Zeus /A/ -> WinFakt aslak [M] ^^yoso *A ak47 | 5.21° (-5.03, -1.36) | 6 units | no | Partial (damage) |
| `2011-10-24_16h08_NaVi_SK-1110241724-de_inferno.dem` | R4 C4 0:19 SK.RobbaN -> Na`Vi starix /A/ m4a1 | 1.78° (-1.69, -0.55) | 2 units | no | Partial (418px) |
| `53.52.1646548-1005272144-de_dust2.dem` | R20 1:18 SWIIIIIDEEEN  alleN -> NORWAY tacky m4a1 | 2.62° (-2.50, +0.78) | 4 units | no | Partial (171px) |
| `SK_vs_AGAiN_ArbaletEU-0912051316-de_train.dem` | R21 1:18 AGAiN  Neo  ZOWiE -> SK\|RobbaN[ios] ak47 | 0.51° (-0.49, +0.14) | 140 units | no | Partial (damage) |
| `SK_vs_e-STRO_WCG2008-0811081900-de_train.dem` | R18 1:32 SKWEDEN zet -> KOREA.eSTRO : bail ak47 | 4.52° (-4.49, +0.52) | 6 units | no | Partial (damage) |
| `auto-1003051321-de_train.dem` | R10 C4 0:01 GeT_RiGhT4J -> RobbaN m4a1 | 0.69° (-0.65, -0.22) | 14 units | no | Wallbang |
| `auto_ifng-1110042211-de_forge.dem` | R4 1:26 fnaticMSI CARN -> mousesports \| ninja m4a1 | 0.77° (-0.74, -0.21) | 2 units | no | Partial (26px) |
| `de_nuke.dem_Fnatic-vs-ALTERNATE.dem` | R21 0:53 fnaticMSI Xizt -> ALTERNATE aTTaX \| ROMAN R m4a1 | 1.04° (-1.01, +0.26) | 2 units | no | Partial (damage) |
| `de_nuke.dem_Fnatic-vs-ALTERNATE.dem` | R9 0:57 fnaticMSI Xizt -> ALTERNATE aTTaX \| hool ak47 | 3.45° (-3.31, +0.97) | 2 units | no | Partial (damage) |
| `mtw-vs-lions-dhs11-1106191044-de_nuke.dem` | R3 1:16 LIONS kHRYSTAL ' KASPERSKY -> mTw \| ArcadioN ak47 | 3.43° (-3.20, -1.23) | 2 units | no | Partial (damage) |
| `mtw-vs-navi-eswc2010semi-real-1007031645-de_tuscan.dem` | R4 0:45 mTw.Mindfactory \| traceFFFFFFFF -> Na`Vi Zeus /A/ m4a1 | 2.37° (-2.26, +0.71) | 4 units | no | Partial (damage) |
| `mtw.mym.consfinal.EM3-0903081339-de_dust2.dem` | R29 C4 0:07 mTw \| whimp -> MEET KUBENB, YOUR MAKER m4a1 | 0.85° (-0.80, +0.28) | 4 units | no | Partial (damage) |
| `mym.fnatic.final-0612201357-de_train.dem` | R22 1:22 MYM\|juve www.bet24.com -> fnatic.TeNt[Q.o-12] ak47 | 2.59° (-2.48, -0.76) | 2 units | no | Partial (damage) |
| `navi-vs-m5-dhwinter2011-1111250937-de_inferno.dem` | R13 1:01 M5 Dosia[v] -> Na`Vi edzie ak47 | 0.70° (-0.67, -0.21) | 2 units | no | Partial (damage) |
| `ravens.wmf.em4finals-1003031026-de_nuke.dem` | R15 1:24 Ravens.Friis * Dansk Metal -> WemadeFOX : solo m4a1 | 2.58° (-2.31, -1.16) | 6 units | no | Partial (damage) |
| `sk-vs-dateam-iolfinal4-1106181158-de_dust2.dem` | R11 0:49 SK.RobbaN -> dt.REASPEL.se STRIKER m4a1 | 1.04° (-1.01, +0.26) | 6 units | no | Partial (damage) |
| `sk-vs-dateam-iolfinal4-1106181158-de_dust2.dem` | R8 0:59 SK.RobbaN -> dt.REASPEL.se rape m4a1 | 2.81° (-2.55, -1.19) | 4 units | no | Wallbang |

The 33 confirmed answers the recoil broke in F4:

| Match | Kill | Confirmed | Recoil (pitch, yaw) | Recorded line into cover | Recoil line into cover |
|---|---|---|---|---|---|
| FX vs eSahara, Nuke, DreamHack Winter 2010 | R9 1:11 ESAHARA.net MAHE -> Frag eXecutors  NEO[t] | loose-damage | 5.63° (-5.26, -2.02) | 2 units | 0 units |
| k1ck vs eq, Nuke, DreamHack Winter 2011 | R10 1:29 K1CK n0rx     <pacheco> -> -Eq- DECE[A] * | loose-damage | 5.21° (-5.03, -1.36) | 4 units | 0 units |
| Na`Vi vs fnatic, Tuscan, Adepto BH Open 2011 | R2 0:55 Na`Vi iOANN4[a] <3 BiH -> fnatic.MSi Gux /PiNGU/ | loose-damage | 4.73° (-4.53, -1.37) | 14 units | 0 units |
| FX vs Lions, Nuke, DreamHack Winter 2010 | R13 1:19 LIONS NIKO DA PANDA * QPAD -> Frag eXecutors  LoordB | loose | 4.73° (-4.53, -1.37) | 78 units | 0 units |
| FX vs eSahara, Dust2, DreamHack Winter 2010 | R18 0:21 Frag eXecutors  KUBEN[t] -> ESAHARA.net RARA | loose | 4.64° (-4.51, -1.09) | 24 units | 0 units |
| Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R10 1:02 ALTERNATE aTTaX \| paN -> Virtus.pro > Ioann S. <Edward> | loose | 4.52° (-4.49, +0.49) | 16 units | 0 units |
| Sweden vs Norway, Dust2, ASUS ENC 2010 | R14 0:59 SWIIIIIDEEEN  Gux -> NORWAY REAL | loose-damage | 4.43° (-4.28, +1.16) | 16 units | 0 units |
| FX vs mTw, Inferno, Xperia Play 2011, part 1 | R15 1:19 ArcadioN@mymTw.com -> Frag eXecutors  KUBEN[t] | loose-damage | 4.43° (-4.28, +1.16) | 84 units | 0 units |
| k1ck vs eq, Nuke, DreamHack Winter 2011 | R2 1:18 K1CK spekz -> -Eq- DECE[A] * | loose-damage | 4.43° (-4.28, +1.16) | 54 units | 0 units |
| Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R25 1:40 Virtus.pro > Aleksey K. <LeX> -> ALTERNATE aTTaX \| approx | loose-damage | 4.43° (-4.28, -1.16) | 84 units | 0 units |
| Na`Vi vs FX, Dust2, SEC 2011 final | R3 0:40 Na`Vi markeloff /A/ -> Loord | loose-damage | 4.26° (-4.25, +0.24) | 327 units | 0 units |
| FX vs eSahara, Nuke, DreamHack Winter 2010 | R10 1:20 ESAHARA.net RARA -> Frag eXecutors  PASHA[t] | loose-damage | 3.79° (-3.66, -1.00) | 28 units | 0 units |
| MYM vs mTw, Dust2, EM3 2009 consolation final | R29 C4 0:13 mTw \| ave -> MEET TAZ, YOUR MAKER | loose | 3.79° (-3.66, -1.00) | 40 units | 0 units |
| k1ck vs eq, Nuke, DreamHack Winter 2011 | R2 1:11 K1CK mUtcb -> -Eq- Darky | loose-damage | 3.62° (-3.62, +0.02) | 16 units | 0 units |
| Burning vs FairFrag, Inferno, ESWC 2010 | R13 0:59 BURNING! MAJ3R -> FAiRFRAG\|drizzerEstachE! | loose-damage | 3.31° (-3.19, -0.89) | 4 units | 0 units |
| SK vs eSTRO, Dust2, WCG 2008 | R8 1:18 SKWEDEN Tentpole <3 Tezz -> KOREA.eSTRO : hee | loose-damage | 3.11° (-2.99, +0.87) | 18 units | 0 units |
| mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, file 1 | R24 1:31 Na`Vi f0cuswOw~ -> mTw.Mindfactory \| ave | loose | 3.11° (-2.99, -0.87) | 186 units | 0 units |
| Sweden vs Norway, Dust2, ASUS ENC 2010 | R22 C4 0:09 SWIIIIIDEEEN  Gux -> NORWAY KORN | loose-damage | 2.98° (-2.76, +1.13) | 10 units | 0 units |
| FX vs SK, Inferno, IEM5 | R17 0:58 Frag eXecutors  PASHA[t] -> SK.face | loose-damage | 2.94° (-2.57, +1.43) | 48 units | 0 units |
| FX vs eSahara, Nuke, DreamHack Winter 2010 | R6 1:05 Frag eXecutors  KUBEN[t] -> ESAHARA.net MAJ3R | loose-damage | 2.81° (-2.54, -1.20) | 12 units | 0 units |
| Sweden vs Norway, Dust2, ASUS ENC 2010 | R23 1:05 NORWAY REAL -> SWIIIIIDEEEN  Delpan | loose-damage | 2.77° (-2.66, +0.76) | 14 units | 0 units |
| FX vs SK, Inferno, IEM5 | R10 0:55 SK.GeT_RiGhT -> Frag eXecutors  Loord | loose-damage | 2.72° (-2.70, -0.33) | 28 units | 0 units |
| fnatic vs Na`Vi, Dust2, GameGune 2012 final | R12 C4 0:04 Na`Vi starix -> fnaticRC f0restBambiJQgarN^ | loose | 2.68° (-2.51, -0.94) | 46 units | 0 units |
| Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R28 C4 0:22 M5 Fox -> Na`Vi edzie | loose-damage | 2.63° (-2.50, +0.81) | 52 units | 0 units |
| SK vs Na`Vi, Dust2, IEM4 | R11 0:52 Edward-FoCuS -> Gux | loose | 2.46° (-2.46, -0.05) | 18 units | 0 units |
| Na`Vi vs FX, Dust2, SEC 2011 final | R10 1:04 742 -> Na`Vi starix /A/ | loose-damage | 2.43° (-2.43, +0.00) | 32 units | 0 units |
| MYM vs mTw, Dust2, EM3 2009 consolation final | R28 1:21 MEET LOORDB, YOUR MAKER -> mTw \| MJE | loose | 2.40° (-2.40, -0.13) | 18 units | 0 units |
| MYM vs fnatic, Train, CPL Winter 2006 (probably) | R19 1:09 MYM\|XioNe www.icemat.com -> fnatic.dsn[tw] | loose-damage | 2.34° (-2.28, +0.54) | 2 units | 0 units |
| Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R20 0:59 ALTERNATE aTTaX \| CHEF-KOCH -> Virtus.pro > Roman M. <ROMJkE^> | loose-damage | 2.22° (-2.22, -0.08) | 16 units | 0 units |
| k1ck vs eq, Nuke, DreamHack Winter 2011 | R6 1:25 -Eq- DECE[A] * -> K1CK n0rx     <pacheco> | loose-damage | 1.73° (-1.66, +0.50) | 26 units | 0 units |
| SK vs Na`Vi, Train, DreamHack Winter 2011 | R23 1:15 Na`Vi starix -> SK.RobbaN | loose-damage | 1.23° (-1.19, -0.30) | 20 units | 0 units |
| Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 1:13 Na`Vi ceh9 /A/ -> M5 ED1K | loose-damage | 0.87° (-0.83, +0.25) | 4 units | 0 units |
| FX vs mTw, Nuke, Xperia Play 2011, part 2 | R21 C4 0:13 ave@mymTw.com -> Frag eXecutors  PASHA[t] | loose | 0.16° (-0.15, +0.06) | 2 units | 0 units |

How it was measured: one run over the 88 demos on a scratch build with the three settings as switches (5.8 minutes, on Sujan's go of 23 Nov 2026), then `ground_truth_check.py` on a build with the unlag moment on (2.0 minutes, 9 mismatches, 10 known gaps) and one with the 1-pixel line and the top row at 24 (2.0 minutes, 2 mismatches, 10 known gaps).

## E. Sujan's answers on the review zip (23 Nov 2026)

Spectating the shooter in first person in his game (`DECISIONS.md`): a, alleN on tacky (Sweden vs Norway, Dust2, ASUS ENC 2010, R20 1:18), a partial wallbang, through cover with tacky's arm in view; b, Delpan on KORN (R28 0:59, a headshot), partial, through cover with most of KORN in view; c, ninja on cArn (Fnatic vs mousesports, Tuscan, ESWC 2011, R15 1:30), a wallbang with cArn not in view, **Sujan not sure** (bullet decals and sparks made it hard to see), so in the notes only; d, pita on ninja (R6 0:33), partial, part of ninja's head in view, and since the kill wasn't a headshot the bullet went through cover; e, HaRtsSSsSsSsSSS's AWP on B1ad3 (emuLate vs Amazing Gaming, Dust2, WCG 2007, warm-up round 1, 2:53), no shot sound in his game, the rechamber not to judge since he switched weapons. a, b and d are in `tests/expected/`, each with a known gap until F4′ is built. With F4′ (A), a reads **Partial** (171 pixels, the recoil's rescue), b **Partial** by damage (the rescue), c **Wallbang** (the rescue) and d **Partial** (112 pixels, the top row). The recoil's size limit of D3 would drop a (2.62°, but only 4 units into cover).

His decisions the same day: the unlag moment rejected, the labels keep judging the moment of the shot; starix's moment dropped; F4′, F5 and C1 built together.
