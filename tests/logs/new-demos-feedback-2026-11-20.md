# Sujan's feedback on four new demos: report, nothing built (20 Nov 2026)

Sujan's brief of 20 Nov 2026, with his two additions the same day (A4 is a full wallbang; the question there is why the viewer's 3D view shows R!Go- in the open). Read on 0.27.3 (main at `ee451c4`), the four demos in `~/Downloads/new-demos`, added to `DEMO_DIRS` for each run only (the hold-out guard passed). Nothing in `src/` changed. The page scripts, the reader copy for part B and the scratch build with the candidate fixes stayed in the session's scratch folder, outside the repo. Pictures: the `screenshots/new-demos-feedback` branch (never merged), listed at the end.

## The four demos

| File | Event | How it's known |
|---|---|---|
| `1110231221--auto_de_train.dem_navi-vs-winfast.dem` | Na`Vi vs WinFakt, Train, ESWC 2011 (23 Oct 2011, 12:21) | Sujan (Esports Earnings lists Team WinFakt at ESWC 2011); the HLTV is "www.VeryGames.net HLTV", as in the other ESWC 2011 demos |
| `287.288.1031580-0901182030-de_nuke.dem` | BIH vs SLOVENIA, Nuke, 18 Jan 2009, 20:30 | the file name. The event isn't in the demo's text (the admin plugin says only "LeiSuRe expCS by www.FSHost.de"); probably ClanBase NationsCup XII: a spectator named "[NC] MasterC" is on the server, the [NC] tag the NationsCup admin in the Belgium vs France demo signs with, and the file name has ClanBase's layout, as `485.53.706623-0803162045-de_train.dem` (NationsCup XI) does. Not confirmed |
| `wmf-vs-ate-beatit-1009041509-de_dust2.dem` | WeMadeFox vs ATE Gaming, Dust2, MSI Beat IT! 2010 (4 Sep 2010, 15:09) | Sujan (Liquipedia: 4 to 6 Sep 2010); the file name; the HLTV's own name "MSI Beat It Global Final #2" |
| `37.49.1056874-0902051946-de_tuscan.dem` | Team Belgium vs France, Tuscan, ClanBase NationsCup XII (5 Feb 2009, 19:46) | demo text: "- CounterStrike Nations Cup 12 server settings loaded -" and "LIVE -GL&HF- Play all 30 rounds,all rounds count -[NC] KarolisK"; the file name |

They stay in `~/Downloads/new-demos` until Sujan answers (`AGENTS.md`, "A new demo in cstrike"); no rows in `tests/DEMOS.md` yet.

## A. Wallbang labels

Sujan's checks in his game are the answers (`DECISIONS.md`, 20 Nov 2026). On 0.27.3 the four demos' live kills read: Na`Vi vs WinFakt 6 **Wallbang**, 3 **Partial wallbang**; BIH vs SLOVENIA 7 and 3; WeMadeFox vs ATE Gaming 4 and 4; Team Belgium vs France 4 and 5.

### A1. Na`Vi vs WinFakt, Train, ESWC 2011, R8 1:29: bartZi's M4A1 on Edward, no tag

The viewer has the kill at R8 1:29 (demo 42:58). Sujan's 1:31 is the first bullet of the burst before it, which the Wallbangs tab lists as a **Wall damage** row of 93 HP (1 HS, 6 hits) at 1:31.

What decides the label (`computeWallbangs`, `src/ui/wallbangs.js`):
- bartZi crouched, 621 units from Edward, who is crouched behind the end of a train car's wheels (texture `wheelend02`, not in `materials.txt`, so concrete). The kill's positions are the snapshot's (gap 0 for bartZi, 5.9 units for Edward).
- The sight points: 4 of 12 (crouched) see Edward, the column 12 units to one side; the middle and the other side pass through 16 and 30 units of the wheel end.
- The aim line at the kill's snapshot: clear, 17.7 units from his middle (24.1 from his head), beside the wheel end. The line to his middle: 16 units of `wheelend02`.
- So `aim.solid` is 0 and the finder stops there ("the victim was hit in the open"): no `seenAim`, so neither the picture check nor the damage rule runs, and the kill has no tag. The Wall damage row is the burst without its kill, since a burst joins a kill only when the kill is a wallbang.
- Drawn as the picture check draws it, 133 pixels of Edward show at the shot (108 drawn 0.1 s back): as a sliver kill it would read **Partial wallbang** from the pixels alone.

The demo's own data:
- Edward's health: 100, then 61 (helmet hit sound and helmet sparks, 1:31), then 52, 43, 34, 25, 16 and 7, each with a kevlar hit sound, then 0 at the kill (a kevlar sound): 8 bullets, the first 7 from 1.17 to 0.20 s before the kill. Each is pinned on bartZi, who fired in the 0.2 s before each, aiming 2 to 15 units from Edward; the next closest enemy was 54 units or more off.
- What they did: 9 HP each on armour, and 39 on a helmet. bartZi's M4A1 at 615 units does at least 21 to an armoured chest and 84 to a helmeted head in the open (`openLow`), so only a surface explains 9 and 39: all seven bullets before the kill went through the wheel end.
- The killing bullet: Edward had 7 HP left, so its damage says nothing.
- The aim at each snapshot (0.053 s apart in this demo, 19.6 a second): from 0.25 to 0.05 s before the kill, the line runs through 12 to 16 units of `wheelend02`, 2 to 9 units from his middle. At the kill's snapshot bartZi's yaw moved 1.3° (214.98 to 216.29) and Edward 5.9 units, and the line passes beside the wheel end. A turn of 0.55° (yaw −0.54°, pitch +0.1°) puts it back through 2 units of the wheel end, its end 11 units from his middle, on his body. HLTV's aim at a kill can be about 1.5° off (`LIMITS.md`).
- So the evidence on the killing bullet is thin either way, and the evidence that bartZi was shooting through the wheel end is strong: seven bullets by their damage, the last 0.20 s before the kill, and the aim through it one snapshot before.

### A2. BIH vs SLOVENIA, Nuke, 18 Jan 2009, R9 1:24: shad's M4A1 on prophe7, **Partial wallbang**

Sujan: a full wallbang, none of prophe7 in view.
- shad crouched, 1,246 units away; prophe7 behind a wall (`out_wall7`, 68 units on the line to his middle). The kill's positions are the snapshot's (gaps 0 and 3.3 units).
- The sight points: none of 15. The picture check: 0 pixels (0 drawn 0.1 s back too). The aim line: 75 units off his middle, into the ground (`out_pave1`).
- So it starts as **Wallbang**. The rule that made it partial: 0.26.22's "full damage in the open just before" (the last loop of `computeHits`; Sujan, 8 Nov 2026): a health drop of the victim with a hit sound 0.15 s or less before the kill, the killer firing in the 0.2 s before it, at least what his gun does in the open at that distance. Here: −30 at 1:24 (demo 1070.904), 0.09 s before the kill, a flesh sound, against the 21 shad's M4A1 does at least in the open at 1,246 units; shad was spraying.
- That hit was snaroGOD's. prophe7 took three −30 flesh hits, at 1070.799, 1070.904 and 1070.994, each pinned by the hit finder on snaroGOD (shad's teammate, M4A1, 923 units, aiming 10 to 22 units from prophe7, the line to him clear); 30 is a chest hit without armour in the open from an M4A1 at that distance. shad's aim was 75 to 86 units off. The last bullet, at the kill (10 HP left; two flesh sounds and two blood sprites at 1070.994), gave the kill to shad.
- The rule checks only that the killer fired then, not whose bullet it was.

### A3. WeMadeFox vs ATE Gaming, Dust2, MSI Beat IT! 2010, R20 1:14: Wall damage 46 HP on bAiL from Rshkhn^'s Deagle

Sujan: nobody damaged bAiL through a wall then, and he died to a USP.
- The kill: WUZZ (A+e.gaming), USP, headshot, R20 1:13, demo 29:04 (1744.812).
- bAiL's health that round: 100 until 1:14; then 88 and 54 (1744.388, a kevlar and a helmet hit sound in the same snapshot, helmet sparks on him); 46, 31, 23 and 0 arrive together at 1744.921, 0.1 s after the kill, for the hit sounds at 1744.592 (two, kevlar), 1744.704 (kevlar) and 1744.812 (helmet, the kill). So he was hit 6 times in 0.42 s, the last one killing him. Some demos deliver health this late; the hit finder pairs each drop with the earliest unused hit sound up to 0.4 s before it.
- This demo keeps few fire events (1,000 in the whole match, 80 of them USP, for 184 kills), so the viewer reads it as one that loses them (`M.firesKept` false): there, an enemy aiming at him competes for a hit with no fire event. Nobody has a fire event near these hits.
- WUZZ aimed 4.7, 16.5, 12.4, 12.4, 4.2 and 11.5 units from bAiL at the six hit sounds, 702 to 717 units away, the line to him clear: he fits every hit, and the kill is his. But the aim fallback takes only enemies holding a gun that can go through a wall (`MAX_DMG` in `computeHits`): pistols, SMGs and shotguns never compete, so WUZZ's USP isn't a candidate. (In demos that keep fire events, a shot from one of those guns isn't a candidate either.)
- Left: Rshkhn^, Deagle, 1,744 units away, aiming 15 and 17 units off at the first two hits, the line to bAiL through 899 units of the map. Alone in range, he takes both, −12 and −34 HS, both read through cover (the line to the part hit is blocked, and the damage is under the most a Deagle bullet keeps through a wall), so a **Wall damage** row of 46 (1 HS, 1 hit). The three later hits before the kill have no shooter (Rshkhn^ is 745 units off by then).
- The hit finder doesn't cap how much cover a hit passes: 899 units of map is far more than any wall.

### A4. Team Belgium vs France, Tuscan, ClanBase NationsCup XII, R21 0:39: FLEX0R's AWP on R!Go-

Sujan (his second message): a full wallbang. Spectating R!Go- in his game, FLEX0R isn't in his view when he dies. His decision: the labels judge the moment of the shot only (`DECISIONS.md`).

The label on 0.27.3: **Wallbang**, by the sliver rule of 0.26.0, as Sujan says and as the old build's STRICT WB said:
- The sight points: 5 of 15 see him (the column 12 units to one side, beside his body), so he counts as seen; the aim line and the line to his middle go through 12 and 14 units of a crate (`kano_crate1a`, concrete by `materials.txt`), so `seenAim` is set.
- The picture check: 0 pixels (2,238 pixels of him with nothing in front), so a sliver kill under 50 pixels, at 0: **Wallbang**.
- The kill's positions are the snapshot's (gap 0 for both). Tuscan's 256-object limit doesn't drop R!Go- here: he's in every snapshot of the last 0.56 s, 10 of them, 0.034 to 0.069 s apart.

Each snapshot of the last 0.5 s. FLEX0R stays crouched at the same spot, his eye at z 222, until he stands 0.065 s after the shot. R!Go- lands from a jump.

| Before the shot | R!Go- (x, y, z) | Sight points on R!Go- from FLEX0R's eye | Picture check, pixels | Sight points on FLEX0R from R!Go-'s eye | Eye to eye, units of cover |
|---|---|---|---|---|---|
| 0.493 s | 663.9, −345.2, 270.8, crouched in the air | 0 of 12 | 0 | 4 of 12 | 18 |
| 0.424 s | 656.8, −331.4, 273.0, crouched | 0 of 12 | 0 | 4 of 12 | 12 |
| 0.361 s | 649.7, −317.7, 271.3, crouched | 4 of 12 | 113 | 4 of 12 | 6 |
| 0.297 s | 643.7, −305.8, 266.8, crouched | 8 of 12 | 1,382 | 8 of 12 | 0 |
| 0.234 s | 636.6, −292.0, 257.9, crouched | 12 of 12 | 2,282 | 8 of 12 | 0 |
| 0.168 s | 631.5, −282.2, 249.1, crouched | 12 of 12 | 2,325 | 8 of 12 | 0 |
| 0.100 s | 624.4, −268.4, 233.4, standing | 10 of 15 | 2,179 | 8 of 12 | 0 |
| 0.066 s | 620.7, −261.2, 228.0, standing | 5 of 15 | 939 | 4 of 12 | 2 |
| 0 (the shot) | 617.1, −255.2, 228.0, standing | 5 of 15 | 0 (47 when drawn a millisecond earlier; under 50 either way) | 0 of 12 | 14 |

So he was in FLEX0R's view from 0.36 s before the shot, most of him from 0.30 to 0.10 s before, and hidden behind the near crate's right edge at the shot; FLEX0R was in his view until 0.066 s before, and not at the shot.

The 3D view at the kill row's moment (T at the kill, 1939.964): the 3D view draws 0.1 s back, at 1939.864, where it puts R!Go- at (622.9, −265.4, 230.8), between the snapshots of 0.100 and 0.066 s before on the evened-out times; drawn from FLEX0R's eye there, 1,903 of his 2,380 pixels show. Through R!Go-'s eyes at that moment, FLEX0R is in view. With T 0.1 s later (the 3D view drawn at the shot), R!Go- is behind the crate's edge, and FLEX0R is out of R!Go-'s view, as in Sujan's game.

Which it is: (a), LAG3, the 3D view's 0.1 s. Not (b): the positions match the snapshots exactly, with no gap. Not (c): the same model and pose code, drawn at the shot, gives 0 pixels; 0.05 s back, 964 pixels.

How it fits Sujan's game: the game's demo player seems to draw players about 0.1 s back too (`LIMITS.md`, 0.24.0), so in his game R!Go-'s model falls 0.1 s after the kill feed line, drawn at the shot, which is when "FLEX0R isn't in his view". In the viewer, the kill row's moment is the kill feed line's: kill details' **Jump to this kill** pauses 0.03 s after it, where the 3D view shows 0.07 s before the shot. The test demos' known gaps point the same way: of the five kills Sujan saw as partial where the viewer reads **Wallbang** (`tests/expected/`, known gaps), three show the victim in the 3D view at the kill row's moment: REAL on alleN (Sweden vs Norway, Dust2, ASUS ENC 2010, R25 0:46) 1,615 pixels, walle on Neo (SK vs AGAiN, Train, Arbalet Cup Europe 2009, R18 1:06) 1,476, THREAT on LoordB (FX vs Lions, Nuke, DreamHack Winter 2010, R22 0:47) 85; Tentpole on zet shows 7 and Edward on Delpan 0. So his game, paused at the kill feed, likely shows what the viewer shows; judging at the shot (his decision) is what makes the label agree with the moment the victim falls.

The same mismatch across the test demos (all 83 demos in `DEMO_DIRS` with the four new ones; every **Wallbang**, strict or sliver, drawn from the killer's eye with both players where the 3D view draws them at the kill row's moment): 534 kills drawn (one couldn't be), 56 show 50 pixels or more of the victim there, the line where a picture would read partial; 19 show 1 to 49; 459 show none. The 56 include the three known gaps above and FLEX0R on R!Go- (1,903). The largest: Warden on Gux (fnatic vs EG, Dust2, EM3 Global Finals 2009, R17 1:47) 3,462, Xizt on 742 (FX vs Lions, Nuke, DreamHack Winter 2010, R4 0:43) 3,377, ave on PASHA (FX vs mTw, Inferno, Xperia Play 2011, R9 0:53) 3,142; each reads 0 at the shot.

FLEX0R's health: one reading, 88, at 1939.964, the kill's own snapshot: a flesh hit (the server's blood sprite low on him), pinned on R!Go-'s AK-47, through the crate by the hit finder: R!Go- shot him at the same moment. The name bar under the 3D view ("TEAM BELGIUM - FLEX0R (100)") and the labels in the 3D view read health at the 3D view's time, 0.1 s back, so they show 100 until 0.1 s after the kill (`hpAt(selected, T)` inside `update3`, `src/view3d.part.js`); the 2D radar and the Tab scoreboard read it at the moment itself, 88 at the kill. Sujan's game shows 88 right after the kill.

### The fixes proposed, measured

Measured on a scratch build of 0.27.3 with each fix behind a switch, on all 83 demos (each fix alone, then together; 9.8 minutes), and with `ground_truth_check.py` on the build with the three proposed together (1.9 minutes). On 0.27.3 the 83 demos' live kills read: 535 **Wallbang** (24 of them sliver kills at 0 pixels), 290 **Partial wallbang** (229 from damage, 46 from pixels, 15 from the full damage in the open just before), 14,638 normal.

- **F1b, for A1** (proposed): a kill whose aim line at the shot is clear, with part of the victim seen by the sight points and the line to his middle through cover, still goes to the damage rule when the killer's recorded aim one snapshot before (0.16 s or less) went through cover with its end 24 units or less from the victim's middle. Then a bullet of the killer's that only a surface explains, 0.5 s or less before the kill, makes it **Partial wallbang**, as for the seen kills since 28 Oct 2026. bartZi on Edward reads **Partial wallbang**. On the 83 demos it adds 18 **Partial wallbang** kills, listed below. The first version, F1, without the condition on the snapshot before, added 74; too many.
- **F2, for A2** (proposed): the full-damage-in-the-open rule leaves out a hit the hit finder pinned on another shooter. On the 83 demos 2 kills change, both **Partial wallbang** to **Wallbang**: shad on prophe7, and zonic on dennis (mTw vs Lions, Nuke, DreamHack Summer 2011, R8 1:07), not in `tests/expected/`.
- **F3b, for A3** (proposed): in a demo that loses fire events, an enemy aiming at the victim with a pistol, SMG or shotgun competes for the hit too, and a hit pinned on him is never through cover (his bullet stops at the first surface). bAiL's six hits go to WUZZ, in the open, and the Wall damage row goes. On the 83 demos no label changes. 3 **Wall damage** rows go: bAiL's, and two in Team Belgium vs France (1:20, APOLLO <3 SJLOT, 59 HP; 1:29, R!Go-, 63 HP). Two wallbang kills lose hits from their damage: Ioann's 41 HP before MODDII's kill (fnatic vs Na`Vi, Dust2, GameGune 2012, 0:55) leaves the killing bullet alone, and NEO's 68 before minet's kill (FX vs mTw, Nuke, Xperia Play 2011, part 1, 1:23) reads 58. 1,084 more hits are pinned on a shooter for kill details and **Damage numbers**.
- **F3, the wider form** (not proposed): the same in every demo, also for shots with a fire event. It changes 3 labels, **Partial wallbang** to none, two of them Sujan's confirmed answers (PASHA on face, FX vs SK, Inferno, IEM5, R17 0:58; iOANN4 on Gux, Na`Vi vs fnatic, Tuscan, Adepto BH Open 2011 final, R2 0:55), and 10 damage rows go and 2 change.
- For A4: no label change (Sujan's decision). Two display fixes, for Sujan to decide: **Jump to this kill** (and each bullet's jump in kill details) pauses 0.1 s later than today, so the paused 3D picture is the shot itself, with the kill feed and the damage number already showing; and the name bar and the 3D labels read health at the moment itself, as the damage numbers do since 0.26.3, so FLEX0R reads 88 at the kill as the radar does. Neither measured; neither touches a label.

`ground_truth_check.py` on the build with F1b, F2 and F3b: PASS, 233 kills and 46 scores and K-D on 56 demos, 0 mismatches, the same 9 known gaps as 0.27.3, 0 skipped. No confirmed answer changes.

The 18 kills F1b adds (none of them in `tests/expected/`; Sujan may want to check a few by eye before it's built):
- `1110231221--auto_de_train.dem_navi-vs-winfast`, R8 1:29 WinFakt BASiC[T_T]   *bartZi > Na`Vi Edward /A/ m4a1: the bullet through cover 0.20 s before (9 HP, 21 in the open); the aim 0.05 s before through 12 units, ending 9 units from his middle; at the kill 18 units off
- `1110240934--auto_de_train.dem_Again-vs-Navi`, R21 1:23 AGAiN  NEO[t] > Na`Vi EdwardwOw~ ak47: the bullet through cover 0.15 s before (12 HP, 26 in the open); the aim 0.05 s before through 12 units, ending 9 units from his middle; at the kill 24 units off
- `2010-07-01_15h58_-1007021005-de_inferno Burning vs FairFrag`, R7 C4 0:33 FAiRFRAG|CosMo/M/ > BURNING! MAJ3R m4a1: the bullet through cover 0.40 s before (10 HP, 21 in the open); the aim 0.10 s before through 72 units, ending 20 units from his middle; at the kill 19 units off
- `2010-07-01_15h58_-1007021005-de_inferno Burning vs FairFrag`, R14 C4 0:29 BURNING! NTEP redcore.fr > FAiRFRAG|DIODELs2LAETITIA ak47: the bullet through cover 0.20 s before (15 HP, 27 in the open); the aim 0.10 s before through 22 units, ending 23 units from his middle; at the kill 33 units off
- `37.49.1056874-0902051946-de_tuscan`, R3 1:20 FRANCE! mSx[///////] > TEAM BELGIUM - APOLLO <3 SJLOT m4a1: the bullet through cover 0.10 s before (18 HP, 23 in the open); the aim 0.10 s before through 18 units, ending 23 units from his middle; at the kill 9 units off
- `SK_vs_e-STRO_WCG2008-0811081950-de_dust2`, R3 C4 0:19 SKWEDEN allen <3 Sophie > KOREA.eSTRO : hee ak47: the bullet through cover 0.22 s before (12 HP, 24 in the open); the aim 0.11 s before through 18 units, ending 18 units from his middle; at the kill 20 units off
- `SK_vs_e-STRO_WCG2008-0811081950-de_dust2`, R17 0:34 SKWEDEN zet > KOREA.eSTRO : ari ak47: the bullet through cover 0.00 s before (42 HP, 108 in the open); the aim 0.11 s before through 16 units, ending 5 units from his middle; at the kill 18 units off
- `auto-1003030847-de_nuke`, R8 0:48 coL.NineSpot > WemadeFOX : SIA     *RAZER ak47: the bullet through cover 0.10 s before (49 HP, 108 in the open); the aim 0.05 s before through 8 units, ending 23 units from his middle; at the kill 14 units off
- `auto_ifng-1103030950-de_dust2`, R18 0:55 Delpan4Miichy > taz 8) famas: the bullet through cover 0.09 s before (48 HP, 104 in the open); the aim 0.05 s before through 10 units, ending 4 units from his middle; at the kill 6 units off
- `de_nuke.dem_Fnatic-vs-ALTERNATE`, R14 C4 0:11 ALTERNATE aTTaX | ROMAN R > fnaticMSI Gux^pingu m4a1: the bullet through cover 0.32 s before (39 HP, 81 in the open); the aim 0.05 s before through 2 units, ending 20 units from his middle; at the kill 16 units off
- `fnatic_vs_EG_EM3Global-0903061800-de_dust2`, R11 0:44 fnatic.MSI GeT_RiGhT[JFK] > EG.Warden[A] ak47: the bullet through cover 0.21 s before (12 HP, 26 in the open); the aim 0.11 s before through 18 units, ending 6 units from his middle; at the kill 9 units off
- `fnatic_vs_EG_EM3Global-0903061800-de_dust2`, R22 1:44 fnatic.MSI Gux^turtlepower > EG.Warden[A] ak47: the bullet through cover 0.10 s before (64 HP, 140 in the open); the aim 0.10 s before through 34 units, ending 12 units from his middle; at the kill 7 units off
- `fx-vs-lions-dhw2010-bronze-1011272059-de_nuke`, R12 C4 0:13 Frag eXecutors  PASHA[t] > LIONS kHRYSTAL * KASPERSKY m4a1: the bullet through cover 0.12 s before (9 HP, 21 in the open); the aim 0.12 s before through 6 units, ending 6 units from his middle; at the kill 9 units off
- `mouz.mtw.em4finals-1003021512-de_inferno`, R16 0:33 mousesports | gob b > mTw.Mindfactory | ave m4a1: the bullet through cover 0.21 s before (9 HP, 21 in the open); the aim 0.11 s before through 2 units, ending 22 units from his middle; at the kill 17 units off
- `mtw-vs-navi-eswc2010semi-real-1007031655-de_tuscan`, R6 C4 0:23 mTw.Mindfactory | minet > Na`Vi starix /A/ ak47: the bullet through cover 0.33 s before (12 HP, 27 in the open); the aim 0.10 s before through 4 units, ending 11 units from his middle; at the kill 7 units off
- `mtw.mym.consfinal.EM3-0903081339-de_dust2`, R17 C4 0:08 mTw | whimp > MEET LUq, YOUR MAKER m4a1: the bullet through cover 0.10 s before (9 HP, 21 in the open); the aim 0.10 s before through 64 units, ending 10 units from his middle; at the kill 20 units off
- `mtw.tyloo.estars-0907250910-de_nuke`, R5 0:25 mTw.Mindfactory | Sunde > tyloo Chao 'GoodRifle' Xue m4a1: the bullet through cover 0.44 s before (36 HP, 86 in the open); the aim 0.11 s before through 8 units, ending 6 units from his middle; at the kill 15 units off
- `noa.penta-0610211800-de_train`, R23 C4 0:25 NoA.ave > PENTAGRAM G-Shock | neo[t] m4a1: the bullet through cover 0.22 s before (10 HP, 23 in the open); the aim 0.11 s before through 8 units, ending 24 units from his middle; at the kill 31 units off

## B. What the demos say about the players' and the server's settings

Read with a copy of `src/demo.js` that logs every svc_updateuserinfo, svc_stufftext, svc_print, svc_newmovevars and svc_pings, on all 83 demos (the 79 test demos and the four new ones); the table gives one demo per event. Nothing in the viewer reads these yet, apart from the names, models, Steam IDs and pings it already uses.

What a demo holds:
- **Each player's userinfo** (svc_updateuserinfo, sent at each connect and each change): `name`, `model`, `topcolor`, `bottomcolor` and the network settings `rate`, `cl_updaterate`, `cl_lw`, `cl_lc`, `cl_dlmax` in every HLTV demo, and `*sid` (the Steam ID). No key starting with "_" in any HLTV demo, as ReHLDS's SV_FullClientUpdate predicts for Valve's path; only one POV demo, Match 3 (public server, css_cache, 28 Jul 2022), has them (`_ah`, `_cl_autowepswitch`, `_vgui_menus` and others). Some players add their own: `status_monitor` (31 demos), `lang` (15), and a few others (`Svamp`, `translit`, `src`, `fontcolor`, `lefthand`, `dm`, `ah`); `password`, an admin's own setinfo, in 5 demos (its values aren't copied here). Over the 83 demos: `rate` mostly 25000, then 30000, 20000 and 10000; `cl_updaterate` 101 for most players, some 100, 102, 20 or 10; `cl_lw` and `cl_lc` 1 for all but 2 connections; `cl_dlmax` mostly 128.
- **Changes during the recording**: `model` at every side change (the game sets it), names, and rarely a setting: Edward's `rate` 20000 to 30000 at 26:58 in Na`Vi vs WinFakt.
- **HLTV's own slot**: `*hltv`, `hspecs`, `hslots`, `hdelay` (the broadcast delay, 90, 30 or 0 s), with its own `rate` and `cl_updaterate` (10, 20 or 40).
- **stufftext**: in HLTV demos, `fullserverinfo` (with the proxy's address) and **"ex_interp 0.15"** (64 demos; "ex_interp 0.10" in 10) at 0:00, twice. So the demos do carry an ex_interp line: HLTV sends it to its spectators, and Sujan's game doesn't apply it (his check, `DECISIONS.md`); why isn't in the files. POV demos have none, and other server lines (voice settings, `VTC_CheckStart`, `slot10`, `mp3 play`, `spk`, `reconnect`).
- **Server cvar changes**, printed '"name" changed to "value"' (only FCVAR_SERVER cvars, and only changes during the recording, so a setting made before the recording started isn't there; each line is in the file twice): `sv_restartround` (the restarts), `mp_freezetime`, `sv_alltalk`, `mp_autokick`, `mp_forcechasecam`, `mp_forcecamera`, `mp_autoteambalance`, `sv_restart`; in POV demos also `mp_buytime`, `mp_startmoney` and `sv_accelerate`.
- **Movement settings** (svc_newmovevars, at the map load): gravity 800, stopspeed 75, friction 4 and stepsize 18 everywhere; `sv_accelerate` 5 (10 on a few servers), `sv_airaccelerate` 10 on most tournament servers and 100 on some (70 on one), `sv_maxspeed` 320 or 900 (800 and 1000 on some POV servers).
- **Ping and loss** (svc_pings, every 2 s in an HLTV demo): the players' medians 1 to 9 ms at LAN events, 17 to 48 ms online, with spikes to hundreds of ms; loss 0 at its median everywhere, its worst reading up to 98. Two old demos have no ping messages.
- **Snapshots**: about 9.4 a second in most HLTV demos (0.106 s apart), 4 to 20 (19.6 in Na`Vi vs WinFakt); a POV demo has a frame for each of the recorder's own frames, 160 to 190 a second in the test demos.

What a demo can't give: `cl_cmdrate`, `ex_interp`, sensitivity, `fps_max`, the crosshair and other client settings: the game sends a server only the userinfo keys, and these aren't among them unless a player adds them with setinfo, which none here did. (A POV demo's frame rate follows the recorder's own, roughly.)

| Demo (event) | rate | cl_updaterate | cl_dlmax | Other keys | Changed during the recording | ex_interp line | Server cvars announced | Movevars: accelerate, airaccelerate, maxspeed | HLTV: rate, cl_updaterate, hdelay | Ping, median of players (worst) | Snapshots a second |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Na`Vi vs WinFakt, Train, ESWC 2011 (`1110231221--auto_de_train.dem_navi-vs-winfast.dem`) | 25000 (10), 20000 (6), 30000 (3), 7500 (2) | 101 | 128 (17), 80 (4) | status_monitor (2) | model x49, name x5, rate x1 | ex_interp 0.15 | none | 5, 10, 320 | 20000, 10, 90 | 3 ms (40 ms); loss median 0, worst 0 | 19.62 |
| BIH vs SLOVENIA, Nuke, 18 Jan 2009 (`287.288.1031580-0901182030-de_nuke.dem`) | 25000 (5), 20000 (5), 5000 (2) | 101 (7), 100 (3), 20 (2) | 128 (6), 80 (2), 512 (2), 120 (1) … | lang (5), vgui_menus (1), ah (1), lefthand (1), dm (1), Svamp (1), xredir (1) | model x13 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 10, 90 | 33 ms (252 ms); loss median 0, worst 7 | 9.62 |
| WeMadeFox vs ATE Gaming, Dust2, MSI Beat IT! 2010 (`wmf-vs-ate-beatit-1009041509-de_dust2.dem`) | 30000 (6), 25000 (4) | 101 (7), 100 (3) | 128 (9), 80 (1) | none | model x10 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 20, ? | 3.5 ms (19 ms); loss median 0, worst 0 | 9.17 |
| Team Belgium vs France, Tuscan, ClanBase NationsCup XII (`37.49.1056874-0902051946-de_tuscan.dem`) | 25000 (11), 20000 (1) | 101 (11), 100 (1) | 128 (7), 80 (4), 2048 (1) | lang (1), status_monitor (1) | model x33, name x10, rate x2 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 10, 90 | 19 ms (156 ms); loss median 0, worst 60 | 30.73 |
| Na`Vi vs FX, Train, SEC 2011 final (`navi-vs-fx-sec2011-final-1110091449-de_train.dem`) | 25000 (10), 30000 (3), 2500 (2) | 101 (13), 20 (2) | 128 (13), 80 (2) | status_monitor (2) | model x16, name x1 | ex_interp 0.15 | none | 5, 10, 320 | 10000, 20, 30 | 1 ms (47 ms); loss median 0, worst 0 | 9.27 |
| mTw vs Lions, Nuke, DreamHack Summer 2011 (`mtw-vs-lions-dhs11-1106191044-de_nuke.dem`) | 25000 (9), 30000 (3), 7500 (1) | 101 (12), 100 (1) | 128 (8), 80 (3), 1 (1), 15000 (1) | status_monitor (3), lang (2), sredirfwd (1) | model x14, name x8 | ex_interp 0.15 | none | 5, 10, 320 | 10000, 10, 90 | 3 ms (17 ms); loss median 0, worst 1 | 9.69 |
| FX vs mTw, Inferno, Xperia Play 2011 (`fx-vs-mtw-xperia2011-1104240025-de_inferno.dem`) | 25000 (9), 30000 (1), 40000 (1) | 101 (10), 20 (1) | 128 (9), 80 (2) | status_monitor (2), lang (2) | model x18 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 10, 90 | 3 ms (2684 ms); loss median 0, worst 1 | 29.22 |
| SK vs dAT team, Dust2, IOL Final4 2011 (`sk-vs-dateam-iolfinal4-1106181158-de_dust2.dem`) | 25000 (9), 25000 (2), 30000 (2), 40000 (1) | 101 (11), 100 (2), 100 (1) | 128 (12), 96 (2) | lang (1), xredir (1) | model x25, name x8, rate x1 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 10, 90 | 9 ms (17 ms); loss median 0, worst 1 | 9.64 |
| SK vs WinFakt, Mirage, IEM6 GC New York (`sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem`) | 25000 | 101 (13), 100 (1) | 128 (8), 80 (5), 96 (1) | none | model x26, name x1 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 20, 0 | 4.5 ms (176 ms); loss median 0, worst 0 | 9.43 |
| FX vs SK, Inferno, IEM5 (`FX-vs-sk-iem5-inf.dem`) | 25000 | 101 (17), 100 (2) | 128 | none | model x51, name x41, cl_updaterate x2 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 20, 90 | 3 ms (40 ms); loss median 0, worst 0 | 9.09 |
| iFNG FX vs fnatic, Dust2, Intel Extreme Masters, 3 Mar 2011 (`auto_ifng-1103030950-de_dust2.dem`) | 25000 (13), 30000 (2) | 101 | 128 (14), 96 (1) | Svamp (1), src (1) | model x39, name x6 | ex_interp 0.10 | none | 5, 10, 320 | 10000, 20, 0 | 4 ms (40 ms); loss median 0, worst 0 | 19.36 |
| fnatic vs EG, Dust2, EM3 Global Finals 2009 (`fnatic_vs_EG_EM3Global-0903061800-de_dust2.dem`) | 30000 (5), 25000 (4), 30000 (3), 25000 (3) | 100 (8), 101 (5), 100 (2) | 128 | none | model x42 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 10, 0 | 3 ms (40 ms); loss median 0, worst 0 | 9.27 |
| fnatic vs mousesports, Tuscan, ESWC 2011 (`1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem`) | 25000 (8), 20000 (8), 30000 (1) | 101 (16), 100 (1) | 128 (12), 96 (2), 5000 (2), 80 (1) | status_monitor (1), fontcolor (1), translit (1), Svamp (1), src (1) | model x45, rate x8, cl_updaterate x4, name x3 | ex_interp 0.15 | none | 5, 10, 900 | 20000, 10, 0 | none | 19.46 |
| NoA vs Pentagram, Train, 2006 (event not known) (`noa.penta-0610211800-de_train.dem`) | 25000 | 101 | 128 | none | model x10 | ex_interp 0.15 | none | 5, 10, 320 | 10000, 20, 0 | 3 ms (15 ms); loss median 0, worst 0 | 9.14 |
| mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final (`mtw-vs-navi-eswc2010semi-real-1007031530-de_tuscan.dem`) | 20000 (5), 25000 (4), 30000 (1) | 101 (9), 101 (1) | 128 | none | model x12 | ex_interp 0.15 | none | 5, 10, 900 | 20000, 10, 90 | 3 ms (62 ms); loss median 0, worst 0 | 9 |
| Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 (`navi-vs-m5-dhwinter2011-1111250937-de_inferno.dem`) | 25000 (5), 10000 (2), 25000 (2), 7500 (1) … | 101 | 128 (10), 80 (1) | status_monitor (1), prot_patch (1), prot_ban (1) | model x23, name x6 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 10, 90 | 3 ms (40 ms); loss median 0, worst 0 | 9.92 |
| fnatic vs mousesports, Forge, IEM6 GC Guangzhou (`auto_ifng-1110042145-de_forge.dem`) | 25000 (6), 30000 (4) | 101 (9), 100 (1) | 128 (6), 96 (2), 80 (1), 5000 (1) | Svamp (1), src (1), fontcolor (1), translit (1), status_monitor (1) | model x27, name x1 | ex_interp 0.10 | none | 5, 10, 900 | 20000, 10, 0 | 8 ms (16 ms); loss median 0, worst 0 | 18.49 |
| Na`Vi vs fnatic, Tuscan, Adepto BH Open 2011 final (`auto-server1-1106262105-de_tuscan.dem`) | 25000 (11), 2500 (5), 30000 (1) | 101 (12), 20 (5) | 128 (7), 80 (4), 96 (1) | status_monitor (3), Svamp (1), src (1) | model x30, name x3 | ex_interp 0.10 | none | 5, 10, 320 | 10000, 10, 90 | 3 ms (461 ms); loss median 0, worst 89 | 19.73 |
| fnatic vs Na`Vi, Dust2, GameGune 2012 (`fnatic-vs-navi-gamegune2012-1207282133-de_dust2.dem`) | 25000 (9), 30000 (4) | 101 (11), 100 (2) | 128 (7), 80 (5), 96 (1) | status_monitor (2), fontcolor (2), translit (2) | model x26, name x3, rate x1 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 20, 90 | 3 ms (39 ms); loss median 0, worst 95 | 9.31 |
| Sweden vs Ukraine, Train, ClanBase NationsCup XI (`485.53.706623-0803162045-de_train.dem`) | 25000 (10), 30000 (4) | 101 | 128 (11), 80 (2), 5000 (1) | team (1), s8 (1) (cl_lw/cl_lc: 1/1 x12, 0/1 x2) | model x14 | ex_interp 0.15 | none | 5, 10, 320 | 10000, 10, 90 | 48 ms (655 ms); loss median 0, worst 31 | 8.99 |
| FX vs Lions, Nuke, DreamHack Winter 2010 (`fx-vs-lions-dhw2010-bronze-1011272059-de_nuke.dem`) | 25000 (8), 30000 (4), 25000 (2), 16000 (1) | 101 (10), 20 (2), 100 (2), 60 (1) | 128 (11), 80 (1), 512 (1) | status_monitor (1) | model x16 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 10, 90 | 3.5 ms (16 ms); loss median 0, worst 0 | 9.1 |
| Sweden vs Norway, Dust2, ASUS ENC 2010 (`53.52.1646548-1005272144-de_dust2.dem`) | 25000 | 101 | 128 (8), 80 (2) | nrate (1) | model x10 | ex_interp 0.15 | none | 5, 10, 320 | 10000, 10, 90 | 17 ms (91 ms); loss median 0, worst 4 | 9.64 |
| tyloo vs mTw, Nuke, e-Stars Seoul 2009 (`mtw.tyloo.estars-0907250910-de_nuke.dem`) | 25000 (10), 20000 (3), 30000 (2), 25000 (1) | 101 (15), 100 (1) | 128 (15), 80 (1) | status_monitor (3), vgui_menus (1) | model x17, name x10 | ex_interp 0.15 | none | 5, 70, 900 | 20000, 40, 90 | 4 ms (65 ms); loss median 0, worst 10 | 9.14 |
| AGAiN vs Na`Vi, Train, 24 Oct 2011 (event not known) (`1110240934--auto_de_train.dem_Again-vs-Navi.dem`) | 25000 (18), 30000 (10), 20000 (5) | 101 | 128 (30), 80 (3) | status_monitor (3) | model x67, name x8, rate x4, cl_updaterate x2 | ex_interp 0.15 | none | 5, 10, 320 | 20000, 10, 0 | none | 18.19 |
| EG vs eXecutors, Train, EM4 finals (`fx.eg.em4finals-1003021929-de_train.dem`) | 25000 (5), 30000 (5), 30000 (1) | 101 (9), 100 (1), 100 (1) | 128 (10), 80 (1) | none | model x30, name x12 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 20, 0 | 3 ms (12 ms); loss median 0, worst 0 | 9.11 |
| compLexity vs WeMadeFox, Nuke, IEM4 World Championship (`auto-1003030847-de_nuke.dem`) | 30000 (12), 25000 (1) | 101 (11), 100 (2) | 128 | lang (1), status_monitor (1) | model x34, name x8, rate x1 | ex_interp 0.10 | none | 5, 10, 900 | 10000, 20, 0 | 3 ms (118 ms); loss median 0, worst 0 | 19.66 |
| SK vs AGAiN, Train, Arbalet Cup Europe 2009 (`SK_vs_AGAiN_ArbaletEU-0912051316-de_train.dem`) | 30000 (8), 25000 (6), 25000 (1) | 101 (11), 100 (4) | 128 (13), 80 (1), 96 (1) | lang (1) | model x24, name x5, rate x1 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 10, 90 | 3 ms (40 ms); loss median 0, worst 0 | 9.28 |
| SK vs eSTRO, Dust2, WCG 2008 (the 5-minute file) (`SK_vs_e-STRO_WCG2008-0811081854-de_dust2.dem`) | 25000 | 101 | 128 | none | model x2 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 20, 0 | 4 ms (39 ms); loss median 0, worst 0 | 8.89 |
| mousesports vs SK, Nuke, Extreme Masters II (`mouz.SK.EM2.real-0803091025-de_nuke.dem`) | 25000 (13), 30000 (4), 20000 (2) | 101 (14), 20 (5) | 128 | none | model x32, name x4, rate x1 | ex_interp 0.15 | none | 5, 10, 320 | 10000, 40, 90 | 4 ms (44 ms); loss median 0, worst 9 | 8.8 |
| MYM vs fnatic, Train, probably CPL Winter 2006 (`mym.fnatic.final-0612201357-de_train.dem`) | 25000 | 101 | 128 | none | model x62, name x1 | ex_interp 0.15 | none | 5, 10, 900 | 10000, 20, 90 | 4 ms (11 ms); loss median 0, worst 93 | 9.25 |
| Team Guardians vs Lanka Dahan, Mirage, GP Tourney (POV) (`forgotten-de_mirage-2026.dem`) |  |  |  | none (cl_lw/cl_lc: None/None x79) | model x280, name x1 | none | sv_restartround x68, mp_freezetime x18, sv_alltalk x4, mp_buytime x4, mp_forcechasecam x4, mp_forcecamera x4 | 5, 100, 900 | none (POV) | 7 ms (244 ms); loss median 0, worst 98 | 190.32 |
| Public server, Korfez, 7 Mar 2020 (Sujan's POV) (`s-deswal-korfez-knd.dem`) |  |  |  | none (cl_lw/cl_lc: None/None x105) | model x175 | none | sv_restartround x44, mp_freezetime x12, mp_startmoney x2 | 5, 100, 1000 | none (POV) | 20.5 ms (279 ms); loss median 0, worst 98 | 187.31 |

Where a player's settings could show (for Sujan to decide; nothing built): the Players tab, a line under each player on hover or a click: `rate` and `cl_updaterate`, the ping and loss (median and worst), and any setting changed during the match with its time; the load card's **Details**, the server's: the movement settings that differ from the defaults (`sv_airaccelerate` 100, say), the cvar changes with their times, HLTV's delay and snapshot rate.

## C. Team names, Sujan's rule

Sujan's rule (20 Nov 2026; it would replace the order of 8 Nov 2026, "file name, then the admin's text, then clan tags", and the SK vs AGAiN rule that a tag only cuts extra words off the file name's team): (1) the tag a team's players share, through the known teams for full names; (2) the file name's team; (3) the admin's text; (4) Team 1 and Team 2. A shared tag loses a short bracketed bit at its end and never keeps an unpaired bracket.

Measured by the rule worked out from each header's rosters (a scratch copy of `tryAffix`, `knownTeam` and `KNOWN_TEAMS` from 0.27.3), with the bracket fix: a bracketed bit of 4 letters or fewer at the tag's end goes ("SLOVENIA [o]" reads SLOVENIA), an opening bracket with no closing one after it cuts the tag there, and a closing one with no opening one before it cuts it up to there; only ( ) [ ] { } count as brackets, so "roccat >" keeps roccat. Today "SLOVENIA [o" comes from the separator strip in `tryAffix` (`src/ui/match.js`), which takes the "]" off "SLOVENIA [o]".

The 12-letter cap in `tryAffix`: a tag longer than 12 letters is cut. "ALTERNATE aTTaX" is found as "ALTERNATE aT", which reads ALTERNATE aTTaX only through the known teams (its first word, alternate); a team not in the list would read cut. With the file name first, as today, the cap rarely shows; with the tag first it does: "Frag eXecutors" reads "Frag eXecuto" on 11 headers. A cap of 20 reads every tag in the test demos whole.

The four new demos:
- Na`Vi vs WinFakt, Train, ESWC 2011: Natus Vincere and WinFakt (today Natus Vincere and Winfast, from the file name).
- BIH vs SLOVENIA, Nuke: BIH and SLOVENIA (today BIH and SLOVENIA [o).
- WeMadeFox vs ATE Gaming, Dust2, MSI Beat IT! 2010: WeMadeFox and A+e.gaming, from the tag "A+e.gaming |" (today WeMadeFox and ATE Beatit, from the file name). Sujan decides between A+e.gaming and ATE Gaming (a known-teams entry, `aegaming: 'ATE Gaming'`, would read ATE Gaming).
- Team Belgium vs France, Tuscan: TEAM BELGIUM and FRANCE, the tags as the players wrote them, in capitals (the same today).

Every header that changes, of 90 (the 83 demos and the 7 joined maps of `tests/expected/` and Na`Vi vs SK's three parts), with the cap at 12; 65 stay as they are:

| Demo (event) | Today | With the rule | With the cap at 20, where it differs |
|---|---|---|---|
| Na`Vi vs WinFakt, Train, ESWC 2011 | Natus Vincere / Winfast | Natus Vincere / WinFakt | |
| BIH vs SLOVENIA, Nuke, 18 Jan 2009 | BIH / SLOVENIA [o | BIH / SLOVENIA | |
| WeMadeFox vs ATE Gaming, Dust2, MSI Beat IT! 2010 | WeMadeFox / ATE Beatit | WeMadeFox / A+e.gaming | |
| fnatic vs mousesports, Tuscan, ESWC 2011 | fnatic / mousesports | fnaticMSI / mousesports | |
| fnatic vs ALTERNATE aTTaX, Nuke, ESWC 2011 | ALTERNATE aTTaX / fnatic | ALTERNATE aTTaX / fnaticMSI | |
| fnatic vs Na`Vi, Dust2, GameGune 2012 | Natus Vincere / fnatic | Natus Vincere / fnaticRC | |
| Burning vs FairFrag, Inferno, ESWC 2010 | FAIRFRAG / Burning | FAiRFRAG / BURNING | |
| k1ck vs eq, Nuke, DreamHack Winter 2011 | K1ck / EQ | K1CK / Eq | |
| SK vs dAT team, Dust2, IOL Final4 2011 | SK Gaming / Dateam | SK Gaming / dt.REASPEL.s | SK Gaming / dt.REASPEL.se |
| SK vs eSTRO, WCG 2008 (5 files: Dust2 1854 and 1950, Train 1900, Nuke 1945 and 2043) | SK Gaming / eSTRO | SKWEDEN / KOREA.eSTRO (the 1854 file: SKWEDEN / eSTRO; 1945: KOREA.eSTRO / SK Gaming) | |
| FX vs SK, Inferno, IEM5 | Frag eXecutors / SK Gaming | Frag eXecuto / SK Gaming | Frag eXecutors / SK Gaming |
| FX vs eSahara, Dust2 and Nuke, DreamHack Winter 2010 (2 files) | Frag eXecutors / eSahara | Frag eXecuto / eSahara | Frag eXecutors / eSahara |
| FX vs Lions, Inferno and Nuke, DreamHack Winter 2010 (2 files) | Frag eXecutors / LIONS | Frag eXecuto / LIONS | Frag eXecutors / LIONS |
| FX vs mTw, Inferno and Nuke, Xperia Play 2011 (4 files, and the 2 joined maps) | mTw / Frag eXecutors | mymTw.com / Frag eXecuto | mymTw.com / Frag eXecutors |

Team names in `tests/expected/`: one file names its teams, the GP Tourney POV of Team Guardians vs Lanka Dahan, Mirage (`forgotten-de_mirage-2026`), BAJRANG and Guardians; it stays the same.

Open for Sujan with the tag first: "mymTw.com" (the players' "@mymTw.com", where the file name has mTw; reading the file name's team when the tag contains it would give mTw); "fnaticMSI" and "fnaticRC" (a known team with a sponsor joined to it; reading a known team at the start of a tag would give fnatic); SKWEDEN and KOREA.eSTRO (the national tags of WCG 2008); the tags' own capitals (TEAM BELGIUM, BURNING, K1CK); "dt.REASPEL.se" for dAT team; the cap.

## Pictures

On `screenshots/new-demos-feedback` (never merged), from 0.27.3. The picture check's frames are 640 x 400 around the victim, the map as it was then and the victim alone in flat magenta, from the killer's eye; the views are the viewer at 1440 x 900, paused, **Player's eyes** on the shooter, the 3D view 0.1 s behind the playhead.
- `a1-train-r8-picture-check-at-shot.png` (133 pixels), `a1-train-r8-bartzi-eyes-at-kill.png`
- `a2-nuke-r9-picture-check-at-shot.png` (0 pixels), `a2-nuke-r9-shad-eyes-at-kill.png`
- `a3-dust2-r20-picture-from-rshkhn-at-hits.png` (0 pixels), `a3-dust2-r20-picture-from-wuzz-at-hits.png` (2,741 of 2,771), `a3-dust2-r20-rshkhn-eyes-at-hits.png`, `a3-dust2-r20-wuzz-eyes-at-hits.png`, `a3-dust2-r20-wuzz-eyes-at-usp-kill.png`
- `a4-tuscan-r21-picture-check-at-shot.png` (0), `a4-tuscan-r21-picture-0.05s-before.png` (964), `a4-tuscan-r21-picture-0.1s-before.png` (1,903); `a4-tuscan-r21-flexor-eyes-at-kill.png` (the kill row's moment, the 3D view at 0.1 s before the shot), `a4-tuscan-r21-flexor-eyes-at-shot-no-lag.png` (the playhead 0.1 s after the kill, so the 3D view is at the shot), `a4-tuscan-r21-flexor-eyes-0.5s-before.png` (the 3D view 0.5 s before the shot), `a4-tuscan-r21-flexor-eyes-0.2s-before.png` (0.2 s before, R!Go- in the gap), `a4-tuscan-r21-rigo-eyes-at-kill.png` and `a4-tuscan-r21-rigo-eyes-at-shot.png` (through R!Go-'s eyes: FLEX0R in view at the kill row's moment, behind the crate at the shot).
