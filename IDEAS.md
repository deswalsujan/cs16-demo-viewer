# Ideas

Parked ideas and features we've discussed but not built yet. Each entry keeps enough of the discussion that it can be picked up later without starting over. When something here gets built, it moves to the [changelog](CHANGELOG.md).

Only what is open stays here. An open item keeps a three-line header (Status, Next step, Decided so far; each answer in Decided so far also has its line in `STATE.md`); a parked item keeps one line, since nothing happens until Sujan picks it up. Done items, and the full text of open ones, go to [IDEAS-ARCHIVE.md](IDEAS-ARCHIVE.md) word for word, under the same section and block names (since 29 Oct 2026). A section that older notes, code comments, `tests/README.md` or `tests/DEMOS.md` point to and that isn't here, such as "Tell exactly why a demo is broken", is in the archive under the same name.

## By-eye round

Sujan's checks by eye of merged builds, kept for one sitting that he runs when he chooses (Sujan, 3 Nov 2026; rule in `AGENTS.md`). One line each: what to open, what to look for, the version, the machine; on GitHub Pages unless a line says otherwise. Each merged change adds its lines here instead of asking Sujan after the merge; a line he passes moves to the archive with the date, one he fails becomes an item in the checklist below. Mockups and decisions still go to him when they're ready; the hold-out answers stay their own item (**Hold-out set of new demos**). Firefox on the Mac stays parked in the checklist. The full text these lines came from is in the archive, under each item's own name.

**Mac, the 27-inch 2560x1440 screen**
- [ ] **Interface size** (0.26.13), in Chrome and in Safari: the start screen and a demo in **3D + radar** are larger than on the laptop (Auto about 130% maximized), and so are the Tab scoreboard, **View settings**, the ? panel and the load summary; **View settings**, **Interface size**: 150% and 200% make it larger, 100% looks as on 0.26.12, and the choice is still there after a reload; drag the window to the laptop's screen and back: the size follows without a reload; on the laptop, Auto looks exactly as before.
- [ ] **Widescreen view** (0.26.15): SK vs Na`Vi, Train, DreamHack Winter 2011, R23 1:22, **Player's eyes** on markeloff: the AWP in his hands and GeT_RiGhT and RobbaN ahead are the size they are in the game, unscoped and through the AWP's scope.
- [ ] **POV mode**'s crosshair on a wide view (0.26.15): **POV mode** on, Match 1 CT (public server, de_barcelona, 27 Mar 2025), R1 0:49: his crosshair against H@rDRoCk is the size it is in the game, and its lines look right at 1 px or should be 2 px (since 0.26.15 they're 1 px at 2560x1440, 2 px before).

**Mac, any screen**
- [ ] **Kill details** (0.26.16): SK vs Na`Vi, Train, DreamHack Winter 2011, R24 0:35, click ceh9's kill on Delpan in the Kills list: 5 hits, "Earlier: −7 from a grenade at 0:45.", −30 then three −17 then −12 HS with the red skull; click line 2: playback jumps to that bullet, paused, through ceh9's eyes.
- [ ] **Kill details** in a crossfire (0.26.16): the same demo, R23 1:18, click edzie's kill on face: "Earlier:" names "−21 from starix at 1:19", after the three grenades and before "−21 at 1:19, source unknown".
- [ ] **Damage numbers** and the red skull (0.26.16): the same demo, R24 0:35 in **Player's eyes** on ceh9, **View settings**, **Damage numbers** on Both: the −30 in white beside Delpan, the three −17 in orange, −12 HS ending in the red skull; on Direct hits only the −30; on Off none.
- [ ] **Vanilla** (0.26.16): **View settings**, **Vanilla** on: names, HP, damage numbers, glow, kill lines, grenade paths and the kill markers go, the kill feed, timer, score, crosshair and name bar stay, and after a plant the round pill reads "C4" with no countdown; **Names** alone comes back with a click; **Vanilla** off brings everything back.
- [ ] **Kill details** in **POV mode** (0.26.16): **POV mode** on, Match 1 CT, R1 0:49, click his kill on H@rDRoCk in the Kills list: "No hit details. A demo recorded by a player has only his teammates' health, not H@rDRoCk's."; **View settings** has no **Damage numbers**.
- [ ] **Join the parts**, a half replayed and a half carried on (0.26.19): WeMadeFox vs Ravens, Nuke, EM4 finals, both files cloned into `cstrike` (`tests/DEMOS.md` says how), part 1 open, **Join the parts**: the card as in `docs/join-replay-carry-mock.png`, part 2's line "Carries on at WeMadeFox 4 : 0 Ravens, 26 rounds, no winner."; part 2 moved first: "This order doesn't add up" and the recording times named, no green tick; joined: WeMadeFox 16-13, 17-13 with **Count them**, all 10 players in the Players tab, and with **Show warmup, restarts and idle rounds** on, "replayed from 0:0" on the 16 replayed rounds.
- [ ] **Join the parts**, the order (0.26.19): Na`Vi vs SK, Inferno, ESWC 2011, its three files cloned into `cstrike`, the first open, **Join the parts**: 1609, 1724, 1740, "24 Oct 2011 at 16:09, at 17:24 and at 17:40".
- [ ] The keys (0.26.20): any demo in **Player's eyes**: ↑ goes to the next player and ↓ to the previous one, Z and X to the previous and next round (held down, one round); press ?: the list says Z X for rounds, ↑ or click and ↓ or right-click for players; the tooltips of the round buttons and the player arrows name the keys.
- [ ] **Join with another demo…** with no other demo (0.26.20): pick the Half-Life folder (its `cstrike` holds no test demo), open any test demo with **Open .dem from elsewhere**, Rounds tab, **Join with another demo…**: "There are no other demos in your Half-Life folder." beside **A file from elsewhere…**, no empty list.

**Windows**
- [ ] **Interface size** (0.26.13), in Chrome or Edge: as on the Mac above, on the Windows screen.
- [ ] The keys (0.26.20), in Chrome or Edge: as on the Mac above; ↑ and ↓ don't scroll the side panel after clicking in it.
- [ ] **POV mode** in main (0.25.0; check on 0.26.8 or later, which reads his crosshair settings and ammo icons from `cstrike/config.cfg` in Chrome and Edge): tick **POV mode** in **View settings** (or **Turn on POV mode** in a POV demo's load summary) and open Match 1 CT or one of his own recordings: the demo opens again at the same moment; his crosshair in the colour and size of his `config.cfg`, at 70%; at his kills, the marker's ticks just past his crosshair's arms; round announcements in the middle ("Target has been saved!"); the HUD's round timer gone after a plant (back at once on a server with `mp_show_bomb_timer 1`); the spectator bars' clock counting the C4 down; the C4 on a carrier's back and a CT's kit on the 3D models, and the C4 on the radar when his game had it (kits never on the radar); **View settings** without **Crosshair**, **Glow on hits** and **Damage numbers**. Untick it: the demo plays like an HLTV demo, the recording player at the map's zero point.
- [ ] Kill feed icons in **POV mode** (0.25.0): **POV mode** on, any POV demo, the top right after a kill: the orange gun icon, the headshot icon on headshots, no "m4a1" or "HS" words.

## Open follow-ups (checklist, updated 8 Nov 2026, 0.26.20)

Everything raised in conversation that isn't finished, in one place. Each item says who does it. Ideas for new features are further down; this list is for loose ends.

**Sujan's feedback of 8 Nov 2026: IEM4 World Championship** (CeBIT, March 2010; seven demos, now test demos, `tests/DEMOS.md`: compLexity vs WeMadeFox, Nuke; SK vs Na`Vi, Dust2; SK vs fnatic, Train; fnatic vs SK, Inferno; mousesports vs mTw, Inferno, in 2 files; SK vs compLexity, Inferno. Sujan's order: the keys and the Join card's empty list built at once, with no mockup; Claude's reports on the match rules and the wallbang finder, and one mockup round for the dialogs, all in one handover; nothing else built before he answers)
- Done, in the archive: **↑ and ↓ pick players, Z and X move rounds** and **The Join card's empty list of demos** (0.26.20, 8 Nov 2026).
- [ ] **Rounds count before both teams are full** (Sujan's point 5)
  - Status: compLexity vs WeMadeFox, Nuke: R1 counts as a compLexity win with 1 kill while players were still joining. Measured 8 Nov 2026 (`tests/logs/iem4-reports-2026-11-08.md`): the whole first stretch, a 15-round warmup before "rdy for knife?" and the knife round, counts as the first half (WeMadeFox 16:6 in 22; by the game's scoreboard the match in this file is 7:8 and 8:7, 15:15 in 30). SK vs fnatic, Train, IEM4 counts the rounds GeT_RiGhT and f0rest missed, with SK's face on fnatic's side (SK 16:2; from the match's start at 21:30, fnatic 16:6). Sujan's rule as worded (a round counts only with 5 on each side) changes 14 of 81 maps and breaks two confirmed scores (mTw vs Lions 10:16, SK vs WinFakt 16:8); Claude's reading (the match starts at the first round with both teams full), with two guards (a round a file starts partway into, and a file with one team only, left alone), changes 3: those two and mousesports vs mTw, Inferno, part 2 opened alone (14:9 to 14:8). A knife round as the start changes the first two only.
  - Next step: Claude builds it in PR 2, with the expected results below as checks, and finds why mousesports vs mTw, Inferno, IEM4, joined, stops at 16 (16:8 in 24; the result is 19-11, the parts hold 30 rounds) and fixes it there, with no confirmed score changed, reporting every test demo that changes.
  - Decided so far: Claude's reading with the two guards (Sujan, 8 Nov 2026): the match starts at the first round with both teams full, 5 s into it; a round a file starts partway into, and a file where no round has both teams full, are left as they are. Results from Fragbite's IEM IV World Championship page (Sujan): compLexity vs WeMade Fox 15-15; fnatic won SK vs fnatic 2-0, so Train, map score not found; SK vs Na`Vi 18-12; SK vs compLexity 16-3; mousesports vs mTw 19-11. IEM4's group stage played all 30 rounds.
- [ ] **Team names from more sources** (Sujan's point 10)
  - Status: with no file name or known team to go on, the header reads "Team 1" and "Team 2" unless the player names it. Measured 8 Nov 2026 (`tests/logs/iem4-reports-2026-11-08.md`): on 81 maps the file name names 39, a shared tag 31, and 11 read Team 1 and Team 2 (SK vs Na`Vi, Dust2, IEM4; fnatic vs SK, Inferno and Train, IEM4; iFNG FX vs fnatic, Dust2; 7 public-server POV games). Nothing in those 4 tournament demos names the teams (no shared tag, the IEM4 admin says only "rdy?", "col?"); the folder a demo sits in (`fnatic.sk.em4finals`) and the same Steam IDs with a tag in another demo of the folder would. Tags before the file name, as in Sujan's list, would make 20 maps' names worse ("Frag eXecuto", "mymTw.com", "KOREA.eSTRO"). ESWC's AdminBot names both teams and their sides ("1st Warmup - SK(CT) vs Navi(T)") in 15 maps that already have names. Looking wrong today: "MEET" for MeetYourMakers, "SWIIIIIDEEEN" for Sweden, "Esahara".
  - Next step: Claude builds it in PR 2.
  - Decided so far: a name the player picked still wins; then the file name, then the admin's text, then shared clan tags; no folder name and no tags from other demos; MEET, SWIIIIIDEEEN and Esahara fixed in the known-teams list, the spellings checked first with the source named (Sujan, 8 Nov 2026).
- [ ] **A wallbang on a teammate** (Sujan's point 6)
  - Status: compLexity vs WeMadeFox, Nuke, R8 1:41: glow kills his teammate solo with the M4A1, listed as STRICT WB. Cause (8 Nov 2026, `tests/logs/iem4-reports-2026-11-08.md`): `computeWallbangs` never compares the killer's and the victim's teams. The Kills tab has no TK tag on a kill row today (only the Players tab counts TKs). That R8 is in the warmup stretch of point 5.
  - Next step: Claude builds it in PR 3.
  - Decided so far: such a kill stays a wallbang but leaves the Wallbangs tab, its counts, **Copy list** and the timeline's wallbang diamonds, and the Kills row gets a TK tag (Sujan, 8 Nov 2026).
- [ ] **Edward-FoCuS on Gux reads strict where Gux was in view** (Sujan's point 7)
  - Status: SK vs Na`Vi, Dust2, R11 0:52, M4A1: listed STRICT WB; Sujan saw Gux, so LOOSE WB at most. Cause (8 Nov 2026, `tests/logs/iem4-reports-2026-11-08.md`): in one spray Gux took 21, 21, 21 standing in view, then the recorded positions have him crouched behind the wall's top from 0.1 s before the kill; he took 21 again 0.04 s before it, the full damage of a hit in the open (through the wall it would be about half), so the game hit him where Edward saw him, a little back in time. The same class as THREAT on LoordB, with the demo's damage as proof.
  - Next step: Claude tries the narrow rule in PR 3, measured on the 231 answers first.
  - Decided so far: the narrow rule, "a kill reads at most LOOSE when the killer's bullet on him within 0.15 s before it did the full damage of a hit in the open"; if it flips any confirmed strict, it's dropped and the kill goes into `tests/expected/` as a known gap, as THREAT on LoordB (Sujan, 8 Nov 2026).
- [ ] **AWP leg hits listed as wallbang damage** (Sujan's points 8 and 9)
  - Status: listed as wallbang damage where Sujan sees direct leg shots: SK vs Na`Vi, Dust2, R30 1:30, RobbaN on Zeus, 83 HP; SK vs fnatic, Train, R15 1:36, RobbaN on cArn, 84 HP, and R15 1:33, RobbaN on face, 82 HP. In the Train screenshot cArn's legs look hidden behind a crate.
  - Found (8 Nov 2026, `tests/logs/iem4-reports-2026-11-08.md`, with the AWP's damage through each material): each is exactly an AWP leg hit in the open at that distance (83 at 1526 units, 84 at 1131, 82 at 1963), the hit sound is "flesh", and the lines to the legs are clear; through any one wall a leg hit can't pass 51 (wood). The positions aren't wrong: `computeHits` judges a body hit on the lines to the body's middle and the crosshair, never the legs. Its cap is the gun x 0.6 x 1.25 (86) whatever the hit sound and the wall; `tooMuchDamage` judges kills only. cArn was in the air at the shot (45 units up); the 3D view draws him 0.1 s back, lower, which hides his legs behind the crate in the screenshot. face was a fnatic stand-in then, so not RobbaN's teammate (point 5).
  - Next step: Claude builds it in PR 3; his check in the game has the final say.
  - Decided so far: each damage hit is judged on the line to the body part its damage points to; the 0.6 cap of 2 Nov 2026 stays, not the wall's own material (Sujan, 8 Nov 2026).
- [ ] **The Join card's "This order doesn't add up" box runs into the footer** (Sujan's point 3; mockup round)
  - Status: the orange left bar and box run into the footer row (Sujan's screenshot, 8 Nov 2026). Mockup: `docs/dialogs-mock.jpg`, section 1 (8 Nov 2026).
  - Next step: Claude builds it with the other dialogs in PR 4.
  - Decided so far: the box sits in the card's structure; the mockup approved (Sujan, 8 Nov 2026).
- [ ] **Dialogs and cards reworked** (Sujan's point 4; mockup round)
  - Status: the load summary, the Join card, the can't-play card, the shortcuts list and the **View settings** panel. Mockup: `docs/dialogs-mock.jpg` (8 Nov 2026), with the patterns borrowed from Claude's cookie dialog and plan cards and Stripe's docs and design guidelines at its top; two proposals there are new behaviour, his to approve: **Open another demo** and **Close** on the can't-play card, and **View settings** in three groups.
  - Next step: Claude builds it in PR 4.
  - Decided so far: the viewer's colours and fonts stay; the mockup approved with two changes: on the can't-play card **Open another demo** is the main (filled) button and **Close** a plain one; **View settings** keeps the three groups and today's row height, so the panel stays about as tall as now, checked at the largest **Interface size** on a 1512x982 window (Sujan, 8 Nov 2026).

**Sujan's report of 7 Nov 2026: WeMadeFox vs Ravens** (Nuke, EM4 finals, one map in 2 files, now test demos, `tests/DEMOS.md`; measured on 0.26.18, `tests/logs/join-replay-carry-2026-11-07.md`; Sujan answered the plan the same day: one batch, one mockup round, one build, on the branch feat/join-replay-carry)
- Done, in the archive: **WeMadeFox vs Ravens joined reads Ravens 16-9**, **The Join card ticks a wrong order of WeMadeFox vs Ravens** and **Three players counted as one in WeMadeFox vs Ravens, part 1** (0.26.19, 7 Nov 2026: a half replayed from 0:0 in one file doesn't count and a half carried on into a later file does; the Join card's words for it, checks A and B and the recording times; two Steam accounts one person only by a name both used in the live rounds, never a placeholder), and the Join card's order for Na`Vi vs SK, Inferno, ESWC 2011 (`fileTime`, 0.26.19).

**Sujan's report of 7 Nov 2026** (EG vs eXecutors, Train, EM4 finals, now a test demo, `tests/DEMOS.md`)
- Done, in the archive: **Damage numbers freeze the viewer at a kill with no death spot** (0.26.17, 7 Nov 2026: such a kill shows no number); **One error stops the frame loop for good** (0.26.18, 7 Nov 2026: the loop keeps running, each different error is recorded once, and the first one in a page shows a toast once).
- [ ] **Toasts cover the name bar in Player's eyes** (seen 7 Nov 2026 in `docs/frame-error-toast-mock.png`): at a 1512x982 window, a two-line toast at the view's bottom left covers the left half of the name bar under the view ("Na`Vi ceh9 32-33y (100) m4a1", SK vs Na`Vi, Train, DreamHack Winter 2011, R24 0:39, **Player's eyes** on ceh9). Every toast sits there today (`toast()` in `src/ui/after-load.js`), so it isn't new with the error toast. For later (Sujan, 7 Nov 2026: not moved in 0.26.18).

**Sujan's report and rules of 3 Nov 2026** (rules in `AGENTS.md`: no pull request for notes alone; things found while building go here for later, unless the change caused them; related features batched into one mockup round, one build and one test run; phones aren't a target)
- Done, in the archive: **Guns and players too big in Player's eyes on a wide screen** (0.26.15, 3 Nov 2026: the view keeps the game's 4:3 picture whole, adding room at the sides on a wider view and top and bottom on a narrower one; **POV mode**'s crosshair sized to match).
- Moved to the **By-eye round** (3 Nov 2026): **Widescreen view, by eye (0.26.15)**; its full text is in the archive.
- [ ] **The start screen on a phone** (for later, Sujan, 3 Nov 2026): at phone width the start screen reads properly and says the viewer needs a computer with CS 1.6 installed, since no phone has a Half-Life folder.
- [ ] Parked (Sujan, 3 Nov 2026): a 4:3 view option (black bars or stretched, as in the game) for POV and admin checks.

**Sujan's report and rules of 2 Nov 2026** (rules in `AGENTS.md`: the viewer collects no user data; the same experience on Mac and Windows, in Chrome and Edge, on any screen size, so a bug on one platform only is a real bug)
- Done, in the archive: **Google Fonts and the no user data rule** (0.26.9, 2 Nov 2026: Tahoma and Verdana from the player's computer); **Bug, top priority: Chrome won't open a Half-Life folder under Program Files** (0.26.10, 2 Nov 2026: **Choose it this way**); **Steam's default folder, by eye (0.26.10)** (passed on Windows, Sujan, 2 Nov 2026); **One way to choose the Half-Life folder** (0.26.11; passed by eye in Chrome on the Mac and on Windows and in Safari on the Mac, Sujan, 3 Nov 2026; Firefox parked below); **"Reading …" left on the start screen** (0.26.12, 3 Nov 2026).
- [ ] Parked: Firefox on the Mac with the folder row of 0.26.11 or later, Sujan's for later (3 Nov 2026; not checked, so it hasn't passed there): what Firefox's prompt says when he picks the Half-Life folder (the row's upload line says "may" for this), and the note after deleting a demo the list shows (pick the folder, delete a test demo, click it).
**Sujan's feedback of 1 Nov 2026** (from watching Na`Vi vs SK, Inferno, ESWC 2011; AGAiN vs Na`Vi, Train, recorded 24 Oct 2011; SK vs Na`Vi, Train, DreamHack Winter 2011; investigated by Claude the same day on 0.26.4; Sujan answered 2 Nov 2026; demos and events in `tests/DEMOS.md`)
- Done, in the archive: **Kill details** and **Damage numbers setting**, with **Vanilla** and the red skull (0.26.16, 3 Nov 2026); SeDaN on fox LOOSE confirmed by eye; the round keys, the Kills tab's scroll, // in the Wallbangs list and the round timer across a pause (0.26.5); EdwardwOw~ on Delpan (LOOSE with a known gap) and a minimum damage for LOOSE (none), closed 2 Nov 2026; **See-through cover hides the victim** (0.26.6); **77 HP on a kill that looks normal** (0.26.7); **Sizes on big screens** (0.26.13, 3 Nov 2026).
- [ ] **A file that starts during a round: its kills read freeze time** (found 2 Nov 2026 while adding Delpan on markeloff to `tests/expected/`)
  - Status: Na`Vi vs SK, Inferno, ESWC 2011, the third file (`-1110241740-`) starts during a round. Delpan's AWP kill on markeloff in it reads "freeze 0:17" in the Kills and Wallbangs lists, opened alone (R1, demo 0:44) and joined: R37 at demo 81:44 with all three files, the right number (Sujan, 2 Nov 2026: the scores chain; the second file, `-1110241724-`, holds the first overtime), and R31 at demo 69:24 with the first file only, as Sujan first watched it. A kill can't happen in freeze time; the cause isn't known yet. The same files, seen 3 Nov 2026 in the 0.26.13 screenshots (the same on 0.26.12): opening the first file (`-1110241609-`) and **Join the parts** in its load summary suggests 1609, 1740, 1724, saying "Order: from the recording times in the file names, 24 Oct 2011 at 16:08, at 16:08 and at 16:08. The rounds agree." All three names start `2011-10-24_16h08`, so the names don't tell them apart; the order Sujan settled on 2 Nov 2026 is 1609, 1724, 1740.
  - Next step: for later (Sujan, 2 Nov 2026): Claude finds where the timer comes from in such a file and what it should read. The Join card's wrong order is fixed in 0.26.19 (Sujan, 7 Nov 2026: `fileTime` read "2011-10-24_16h08", the same at the start of all three names; IDEAS.md, **Sujan's report of 7 Nov 2026: WeMadeFox vs Ravens**).
  - Decided so far: the kill is in R37 (Sujan, 2 Nov 2026); the Join card's order is looked at together with this bug, since the third file is the same one (Sujan, 3 Nov 2026).
- Moved to the **By-eye round** (3 Nov 2026): **Kill details, Damage numbers, the red skull and Vanilla, by eye (0.26.16)** and **Interface size, by eye (0.26.13)**; their full text is in the archive.

**Seen while building 0.26.13** (3 Nov 2026, in the 0.26.13 screenshots at 2560x1440, `tests/logs/0.26.13.md`; for later, no fixes now (Sujan, 3 Nov 2026). The Join card's order for Na`Vi vs SK, Inferno went to **A file that starts during a round** above, and the two overlays on the POV HUD, the hidden-enemies note and "Press ? for keyboard shortcuts", to **The hidden-enemies note is easy to miss** (Sujan, 3 Nov 2026))
- [ ] **Radar labels cut off at the right edge of the 3D view's radar**: in **3D + radar**, the name and the HP and gun line of a player near the radar's right edge run past it and are cut: "ceh9 32-3", "100 hp · al", "m4a" (SK vs Na`Vi, Train, DreamHack Winter 2011, R7 0:23, demo 19:33). The same in 0.26.12 (Sujan; checked in its screenshot, 3 Nov 2026). For later.
- [ ] **2D radar labels overlap when players stand together**: edzie's and starix's names and HP and gun lines run into each other at T spawn, and GeT_RiGhT's and f0rest's at CT spawn (SK vs Na`Vi, Train, DreamHack Winter 2011, R1 freeze 0:12, demo 8:49). The same in 0.26.12 (checked in its screenshot, 3 Nov 2026). For later.
- Done, in the archive: **The Heatmap, Both sides and Whole match controls cover player labels in 2D** (0.26.14, 3 Nov 2026: the 2D map ends above them where it opens or resets).
- [ ] Parked (Sujan, 3 Nov 2026: phones aren't a target): **At phone width, the Heatmap and Both sides lists sit over the buttons beside them** (Names to See through walls), at 390x844 in 2D; and the round pill sits on the map's top left corner. The same on 0.26.13 (seen 3 Nov 2026 while checking 0.26.14 at phone width, SK vs Na`Vi, Train, DreamHack Winter 2011, R1 freeze 0:12).

**Damage numbers and the moment a kill is judged** (Sujan, 31 Oct 2026): done, the block is in the archive: the two bugs fixed in 0.26.3 and 0.26.4, and **The moment the finder judges a kill at** closed: the finder keeps judging at the moment of the shot (Sujan, 1 Nov 2026).

**Wallbang ground truth** (30 Oct 2026; `tests/ground_truth_check.py`, `tests/expected/`, rules in `tests/README.md`)
- Done, in the archive: the 10 kills where Sujan's answer and the viewer disagreed (answered 30 Oct 2026); **The 0.5 s window misses a hit at 0.5 s by rounding** (fixed in 0.26.1, 30 Oct 2026).

**Test demos** (1 Nov 2026; `tests/demo_dirs.py`, `tests/demos-manifest.md`)
- The Mac's test demos are in `~/code/cs16-data/test-demos` since 1 Nov 2026, found by every test through `DEMO_DIRS` (`tests/README.md`, "Settings"; `STATE.md`, "Test files on the Mac").
- [ ] **Hold-out set of new demos** (Sujan, 1 and 2 Nov 2026)
  - Status: 11 demos in `~/code/cs16-data/holdout-demos` (Sujan, 2 Nov 2026), never in `cstrike`, `DEMO_DIRS` or `compare_all.sh`, so no change to the viewer is ever tuned on them; their names, sizes and SHA-256 in `tests/holdout-manifest.md` (computed with `shasum` only), and the rule in `AGENTS.md` ("Sujan's files"): no session opens them unless Sujan asks for a hold-out score. `tests/holdout_score.py` and the guard in `tests/demo_dirs.py` built 2 Nov 2026, tested on a stand-in folder made from a test demo; no answers yet.
  - Next step: Sujan writes his answers for the 4 first demos (marked in `tests/holdout-manifest.md`) in `~/code/cs16-data/holdout-demos/answers/`, judging in the game's demo player, then asks for a hold-out score.
  - Decided so far: a hold-out demo used to fix a bug moves to `test-demos` (with its row in `tests/DEMOS.md` and `tests/demos-manifest.md`) and is replaced by a fresh one (Sujan, 1 Nov 2026); 4 demos get answers first, SK vs tpusports (Tuscan, 2009), Korea vs Moscow (Nuke), Sweden vs China (Inferno) and SK vs EG (Dust2, 2009), and the other 7 are reserves; the answers are his own verdict per kill, normal, strict or loose; the score counts the wallbangs the viewer misses, not only the ones it lists (Sujan, 2 Nov 2026); the answer format, the script printing only counts and the report file in the hold-out folder that no session reads (`STATE.md`, "Hold-out answers and score", Sujan, 2 Nov 2026); the pass line, written before any hold-out score exists: the viewer passes when it finds at least 95 of every 100 wallbangs Sujan calls, lists no more than 1 fake wallbang per demo, and does this on two exams in a row on fresh demos with no rule changes in between; after that, formal reviewing stops; "1 fake wallbang per demo" is an average (an exam's fakes in total no more than its number of demos), and a wallbang found at the other level counts as found (Sujan, 2 Nov 2026).

**Sliver kills** (30 Oct 2026; built in 0.26.0)
- Done, in the archive: **The sight points see a sliver the picture doesn't** (built in 0.26.0, 30 Oct 2026: strict at 0 pixels, LOOSE from 1 to 49); **Railings and Nuke vents** (railings built in 0.26.0; the vent exception withdrawn, 30 Oct 2026); **Sliver kills, by eye (0.26.0)** (confirmed by Sujan, 31 Oct 2026).
- [ ] **One line for strict: 0 pixels for hidden kills too?** (for later, Sujan, 30 Oct 2026)
  - Status: kills the finder's sight points call hidden read strict under 50 pixels of the victim in the picture (0.23.0), but sliver kills need 0 pixels for strict (0.26.0), so two kills with the same picture can get different tags.
  - Next step: Claude, later: check whether 0 pixels should be the strict line for both, against Sujan's answers in `tests/expected/` (which hidden kills at 1 to 49 pixels he answered, and whether he called them strict or loose); then Sujan decides.
  - Decided so far: hidden kills strict under 50 pixels, LOOSE from 50 (Sujan, 25 Oct 2026); sliver kills strict at 0, LOOSE from 1 to 49 (Sujan, 30 Oct 2026).

**Sujan's feedback of 23 Oct 2026** (HLTV viewer; built in 0.22.0 unless said; demos and events in `tests/DEMOS.md`)
- Done, in the archive: **Bug: POV mode's crosshair settings and ammo icons aren't read in Chrome and Edge** (fixed in 0.26.8, 2 Nov 2026); **Republish the claude.ai viewer**, closed 29 Oct 2026 without republishing (the claude.ai copy stays at 0.23.0, GitHub Pages is the only live viewer, Sujan 29 Oct 2026); Sujan's answers on the 23 Oct review page (24 Oct 2026, on the 0.22.0 fixes), the three levels of wallbang (0.23.0 and 0.24.0), wallbang hits that didn't kill and the damage per wallbang (0.24.0); **Strict and LOOSE wallbangs, by eye (0.23.0)** and **Light purple for loose wallbangs, by eye (0.24.0)** (checked by Sujan, 31 Oct 2026; THREAT on LoordB moved to **The moment the finder judges a kill at**).
- [ ] **Bug: short names leave a bracket**
  - Status: found 27 Oct 2026, not fixed. "[fnaticMSI.cArn]" reads "cArn]" in the lists and over the players (fnatic vs Moscow Five, Nuke, DreamHack Summer 2011).
  - Next step: Claude fixes `shortNames` in `src/ui/names.js`, which cuts the shared "[fnaticMSI." but not the closing "]".
  - Decided so far: names over the players and in the Kills and Wallbangs lists go without the tag or sponsor; the kill feed, the name bar, the Tab scoreboard and Copy list keep full names (Sujan, 14 Oct 2026, 0.18.0).
- [ ] **Later (Sujan, 26 Oct 2026): a simpler UI, tooltips, feature names in bold in the viewer's own text.** One piece of work with the two items under "User experience" below, and tracked there.

**Sujan's feedback of 14 Oct 2026**: done, every item confirmed by Sujan by eye (0.18.0 to 0.21.1, 14 and 15 Oct 2026); the block is in the archive.

**Wallbangs and kill timing** (0.15.5, 2 Oct 2026): done (0.15.5 and 0.16.0; the denser hidden check closed 5 Oct 2026, with the finder left as in 0.17.0); the block is in the archive. Its branch `wip/denser-hidden-check` (last commit `99c7106`, never merged) was deleted by Sujan on GitHub on 29 Oct 2026; checked the same day with `git ls-remote --heads origin`, which then listed only `main` and `wip/pov-mode`.

**Across both viewers** (raised during the POV work, 4 and 5 Oct 2026)
- Done, in the archive: **Bullet path**, dropped by Sujan 5 Oct 2026 (what its bot test found about wallbangs is kept there).
- Closed 29 Oct 2026 in 0.25.0, when POV mode came into main on main's code (Sujan's answer of 29 Oct 2026: POV mode gets them all), in the archive: **Subtler kill markers at the crosshair**, **Round announcements**, **Defusal kits and the carried bomb on the players**, **The 0.18.0 and 0.18.1 changes**, **C4 timer counting down**, **The 0.22.0 changes**, **Two kills at one moment picked apart in the lists (0.22.2)**, **Strict and LOOSE wallbangs (0.23.0)**. What's left to see of them in a POV demo is in **POV mode in main, by eye (0.25.0)** under "POV demos" below.
- [ ] **Feature names in bold** (was: in single quotes, 5 Oct 2026)
  - Status: the docs follow it since 25 Oct 2026; the viewer's own text not yet.
  - Next step: Claude, together with the tooltips ("User experience" below).
  - Decided so far: **bold**, capitalized as on screen, no quotes, in the viewer's text (tooltips, notes, load summary) and in the docs, following Microsoft's and Google's style guides (Sujan, 25 Oct 2026).
- Closed 29 Oct 2026, in the archive: **The 0.24.0 changes**, when Sujan kept the 0.1 s delay for the other players in POV mode, as in the HLTV viewer (`STATE.md`).

**POV demos** (3 Oct 2026; findings under "POV demos" below)
- The POV checklist from `wip/pov-mode` was folded in on 29 Oct 2026; its done items are in the archive. POV mode goes into main behind a **POV mode** setting, off by default, and on by default for POV demos once Sujan signs it off (Sujan, 29 Oct 2026; work item 6.5, built in 0.25.0, pull request #5). The setting is a **POV mode** checkbox in **View settings** ("for demos recorded by a player"), plus a line with a button in a POV demo's load summary, no mockup; with it off every demo plays exactly as in 0.24.0, the recording player drawn at the map's zero point included (Sujan, 29 Oct 2026). This replaces "goes back into main only if it works as intended" (3 Oct 2026).
- Moved to the **By-eye round** (3 Nov 2026): **POV mode in main, by eye (0.25.0)** and **Kill feed icons in POV mode, on Windows**; their full text is in the archive.
- [ ] **The hidden-enemies note is easy to miss**
  - Status: raised by Sujan 5 Oct 2026, apply or park to be decided: when the demo opens, the eye is on the load summary, and the note's box and text are small. Seen 3 Nov 2026 in the 0.26.13 screenshots (the same on 0.26.12), two overlays on the POV HUD: the note, bottom left above **See through walls**, covers the HUD's health and armour, and "Press ? for keyboard shortcuts", bottom right of the 3D view, sits on the HUD's ammo (Match 1 CT, public server, de_barcelona, 27 Mar 2025).
  - Next step: Sujan decides, both overlays on the POV HUD included. One idea: show the note only after the load summary closes, and larger.
  - Decided so far: option B, a note above **See through walls** (Sujan, 4 Oct 2026), reworded for players 5 Oct 2026 ("This server seems to use an anti-wallhack plugin"); the note covering the HUD's health and armour, and "Press ? for keyboard shortcuts" over its ammo, are part of this decision, not items of their own (Sujan, 3 Nov 2026: both are overlays on the POV HUD).
- [ ] **Kills the wallbang finder can't check**
  - Status: the server held the victim back, so he isn't in the file at the kill and there's nothing to trace to: 4 of 31 gun kills in the GP css_cache pub demo of 3 Oct 2026 (Sujan's wallbang at 4:13), and his M4A1 headshot on r`GrimeS at 2:02 in `PPGpub_de_barcelona[Cts]_21-10-2026_15.54.26.dem` (public server, 21 Oct 2026). Left unmarked.
  - Next step: Sujan decides on Claude's idea of 22 Oct 2026: on a server that holds enemies back, list a victim never sent to the recorder's game before the kill as "not seen on his screen", without claiming a wallbang. Not counted across his demos yet; it would change the 5 Oct decision.
  - Decided so far: no marker or message for kills the finder can't check ("it'll just confuse players", Sujan, 5 Oct 2026).
- [ ] **See through walls and an aimbot catcher in POV mode** (Sujan asked 3 Oct 2026)
  - Status: **See through walls** works, on what the server sent (checked 4 Oct 2026: anti-wallhack servers send enemies only when they're about to be seen). The aimbot catcher is not started.
  - Next step: Claude builds the aimbot catcher; not started.
  - Decided so far: **See through walls** stays in POV mode, for admins checking a suspect's POV (Sujan, 3 Oct 2026).
- [ ] Parked (Sujan, 5 Oct 2026): a deeper check of his own gun animations, weapon by weapon (draw, reload, silencer, shots, grenades, knife), beyond the M4A1 silencer seen so far.
- [ ] Parked (Sujan, 3 Oct 2026): voice from other players.
- [ ] Parked (Sujan, 3 Oct 2026): in-game chat messages, while alive and dead.

**Done blocks** (2 to 5 Oct 2026), in the archive whole: Demo search (0.15.2 and 0.15.3), 0.16.0 by eye, Hand checks for Sujan (0.10.0 to 0.16.0), Small decisions not yet taken (0.12.1 to 0.16.0), Count them (0.14.2), and the list "Done since this list was written" (0.12.4 to 0.23.0). The blocks below keep only their open items; their done items are in the archive too.

**Broken demos** (raised 2 Oct 2026; both fixes built in 0.16.0)
- [ ] Later (Sujan, 3 Oct 2026; he'll say when he has one; still none, 5 Oct 2026): when a broken demo turns up, open it and check the load summary's line and how far it plays. No real one is in the folders now; the line for mousesports vs Virus (ESWC 2011) would be "This recording was never finished".

**How accurate is the viewer, on a fresh batch of demos** (done 2 Oct 2026 on Windows; fixes in 0.15.1)
- [ ] Parked: a file holding only a warmup, opened on its own, shows one round; it could show none. It needs another warmup-only file: the one example (mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, its first file) was deleted 3 Oct 2026. Then also check the error Sujan remembers it showing (5 Oct 2026).

**A map split over two or more demo files** (shipped in 0.15.0, 2 Oct 2026)
- [ ] Parked: suggest the order of 3 or more parts whose file names carry no recording time (below, under "Join a map split over several demo files"). Sujan's plan (5 Oct 2026): download a map split into 3 or more files, rename them so the names carry no recording time, then open them.

**Not yet tested on real demos**
- [ ] The 145 MB Moscow 5 vs Na`Vi Mirage demo, ESWC 2011 (memory and load time on a laptop). Deleted 2 Oct 2026; needs a big demo again. Still to confirm (Sujan, 5 Oct 2026).

**User experience** (Sujan, 25 Oct 2026: "We should constantly be thinking about user experience")
- [ ] **A review of how simple the UI is** (Sujan, 25 Oct 2026)
  - Status: not started.
  - Next step: Claude, later: one or more separate agents review how the viewer's UI could be simpler, or confirm it already is simple enough.
  - Decided so far: the agents get the built page and screenshots, without Claude's own conclusions (Sujan, 25 Oct 2026).
- [ ] **Tooltips, and feature names in bold in the viewer's text** (Sujan, 25 and 26 Oct 2026)
  - Status: not started.
  - Next step: Claude makes a mockup of one tooltip look, for every flagship feature and any option that could confuse a first-time user (the Wallbangs filters among them): it reads as a tooltip at a glance, distinct from the rest of the viewer yet subtle. Feature names go **bold** in the viewer's own text (tooltips, notes, load summary) in the same change.
  - Decided so far: mockup first; feature names in **bold**, capitalized as on screen, no quotes (Sujan, 25 Oct 2026).

**Tied to moving to sujandeswal.com** (not a dependency for anything else)
- [ ] Remove the `noindex` tag that `build.py` adds to `index.html` (kept out of search results until then; indexing is fine on sujandeswal.com).
- [ ] Privacy hardening (see "Other parked ideas").

**Next on the roadmap:** item 2, the README Requirements list (below), then item 4, the next features, starting with opening duels and trades. The accuracy check on a fresh batch is done (0.15.1).

## Roadmap (agreed 1 Oct 2026, in this order)

Who the viewer is for, in Sujan's words (30 Oct 2026): "The viewer is for CS 1.6 players who want to watch HLTV and POV demos in the browser without opening the game, with easier controls and more information than the game's own player, and to find wallbangs; a second use is admins checking suspected cheaters with **See through walls**." The order below stays as it is (Sujan, 30 Oct 2026).

Item 1, smoother playback, is done (0.8.0; Smooth aim later removed in 0.10.0). Theatre mode (0.9.0 to 0.9.3), the sniper scope (0.10.0 and 0.10.1), See through walls and Team colours (0.11.0) were added along the way.

2. **Requirements section in the README.** What's left: a short "Requirements" list (desktop computer, recent Chrome or Edge, a browser with WebGL for 3D, 8 GB RAM recommended for long demos, phones not supported, Firefox and Safari work without remembering the folder). Already done, nothing to add: the README's "You need your own legitimate copy of Counter-Strike 1.6, installed through Steam" box at the top, and on the start screen the folder row's "The Half-Life folder from your Steam install" text (0.12.1). The start screen also says plainly "Needs your own copy of Counter-Strike 1.6, installed through Steam" since 0.12.4.
3. **Keep folder access between visits.** Done in 0.12.0.
4. **Next features, in order:**
   - **Opening duels and trades.** The first kill of each round (who, where, which side) and whether a death was traded, meaning a teammate got the killer back within a few seconds. Per player: opening kills, opening deaths, and how often their deaths were traded. One of the most-used stats in CS analysis, and the demo has everything needed.
   - **Buy type per round.** Full buy, force buy, eco or pistol round, worked out from the weapons each team holds just after freeze time. HLTV demos don't carry players' money, so it's an estimate from weapons, and armour isn't visible. It still explains most rounds at a glance.
   - **Bomb site per round.** A or B, plant or retake, and win rate per site per side. The demo records where the bomb was planted, and the map file marks the sites.
   - **Grenades per player.**
   - **Broadcast camera mode.** Check the director data in the demo first.
   - **Small improvements:** next and previous kill keys, "Copy this moment", resume where I left off, open .zip demos, filter kills by player or weapon.
5. **Safety fixes and the test suite**, as listed under "Other parked ideas" below: audit demo text shown on the page, size limits, fallbacks for custom models and unusual sounds.

**Decided:** never host Valve's game files. A "lite mode" made only from the project's own assets is an option for later.

## Kept for later

Parked after a feasibility check; the checks are in the archive under the same names.

- **Bullet marks (decals)** (parked 1 Oct 2026 by Sujan): HLTV demos don't record where the player aimed at each shot, so marks on walls would land 1 to 2 degrees off and partly be made up. Worth revisiting if POV demos store the exact aim for every shot (they hold the recorder's own view about 100 times a second: "POV demos" in the archive). Blood and grenade scorch marks are parked with them.
- **Scope styles** (1 Oct 2026): the viewer uses "game"; "clean" was the runner-up; switch with `SCOPE_STYLE` in `src/view3d.part.js`. A menu choice was ruled out for now as clutter.
- **Quick-scope and no-scope labels** (built in 0.10.0, removed in 0.10.1): HLTV timing can't separate a real quick-scope from a slightly quicker normal scope. Worth revisiting with finer timing (POV demos record the player's own zoom) or a well-sourced community definition.

## POV demos

The findings of 3 Oct 2026 (what a POV demo holds, what the viewer got wrong, the headless browser run) and what's built so far on `wip/pov-mode` ("In progress: POV mode", copied from that branch's CHANGELOG on 29 Oct 2026, with how each part was tested) are in the archive under this heading; work item 6.5 started from there and shipped in 0.25.0 (pull request #5). The open POV items are in the checklist above.

Ideas from the discussion (3 Oct 2026, not decided):
- A wallbang check for the recorder's own kills only: with aim stored 100 times a second it could be more precise than on HLTV demos.

## Other parked ideas

*From the 30 Sept 2026 discussion on product practices and features. Not yet built.* Long items are cut to a line here; their full text is in the archive under the same name.

- **Test suite.** Known answers per demo, wallbang ground truth checked in game, break-it tests with corrupt files and nasty player names, scripted browser run-throughs, and custom model and sound packs that must load or fall back cleanly. The scripts are in [tests/](tests/README.md) and run by hand, except three that run on every pull request since work item 6.3 (`.github/workflows/check.yml`, 29 Oct 2026).
- **Join a map split over several demo files**: built in 0.15.0. What's left:
  - **Order of 3 or more parts without recording times in the file names** (Sujan's question, 2 Oct 2026): chain the parts by the game's scoreboard by side and by the teams' sides across each join, which would usually leave one order. Not tested: Sujan has no demo split into more than two files.
  - **Words:** "map", not "match", in everything the viewer says about it (Sujan, 2 Oct 2026).
- **Show the event's name while a demo plays** (parked 2 Oct 2026 by Sujan, not urgent): 19 of 26 demos on the Mac name the event in their own text (the game server's or the HLTV server's name); show it somewhere quiet (the load summary, the header's file line, the hold-Tab scoreboard or Copy debug info).
- **Team names when nothing names the team** (parked 2 Oct 2026 by Sujan, leave as is for now): the header says "Team 1" and "Team 2", click to rename; a fix would need a list of known players per team and year, which goes stale.
- **Safety with custom and bad files.** Fall back to the simple figure when a model's skeleton or animations don't match stock CS, cap model and sound size, decode unusual WAVs through the browser, audit every place player names and demo text reach the page, and bail out of files with nonsense values.
- **Privacy hardening for sujandeswal.com.** Self-host the fonts (three.js is built into the page since 0.26.2), and add a security header that blocks the page from sending data anywhere.
- **Wallhack measure** (parked, from the "See through walls" discussion, 1 Oct 2026). Measure how long each player's crosshair stays on enemies hidden behind walls, compared with the same players in the open. A high share of time tracking hidden enemies is a sign admins could use alongside watching the view.
- **Highlight finder** (parked, not urgent). 3Ks, 4Ks, aces, clutches and quick multi-kills, filterable by player and weapon.
- **Record a clip** from the 3D view, with sound, to a video file.
- **Bookmarks with notes**, exportable with the same timestamps as the wallbang list.
- **Sounds on the radar**: gunshots and footsteps as brief pulses in 2D.
- **Share a moment by link**, such as `#r12` to open round 12.
- **Product basics still to do**: a compatibility note (browsers, HLTV vs POV demos); the license is done (MIT, `LICENSE`, Sujan 30 Oct 2026).
- **1.6-era look** (parked, not urgent) as an optional theme: VGUI-style panels, Verdana/Tahoma, orange HUD numbers, sprites read from the player's own `cstrike/sprites`.
- **Say when a recording stops partway through its last round** (found 2 Oct 2026): mousesports vs SK, Mirage, and ALTERNATE vs AGAiN, Inferno, both ESWC 2011, read one round short of a win; the load summary could say "The recording stops partway through the last round". Belongs with the broken demo messages of 0.16.0; needs a mockup.
- **Shaded lighting on player models** so they darken in shadowed areas like in-game.
- **Team names for demos without "-vs-" in the file name** (found 1 Oct 2026). `2006-07-02_15h00_Team3D_Fnatic-...-de_train.dem` names its teams "fnatic" and "o of 3D": the guess from clan tags picked up part of a name. Worth reading names like `Team3D_Fnatic` from the file name too.
- **A wall thickness limit per gun** (2 Oct 2026). How thick a wall each gun can shoot through would catch wrong wallbangs on its own, but the numbers need care: the game moves a bullet ahead by its "penetration power" (AWP 45, AK 39, M4 35 units, cut by the material: a quarter on concrete) after each hit, and the thickest wall it gets through also depends on how the engine traces from inside a wall. Not used until that's checked in the code and in the game.
- **Late kill messages in other old demos** (2 Oct 2026). The 2006 NoA vs Pentagram demo is the only one so far where the kill message trails the kill (see CHANGELOG 0.13.0). A second protocol 47 demo would show whether all old demos do this.
- **Left-hand option for first-person weapons** (discussed 1 Oct 2026). The viewer now shows weapons in the right hand like CS 1.6's default (cl_righthand 1). A toggle for people who play left-handed is a one-line change if anyone asks.

Built in 0.16.0, in the archive: **Tell exactly why a demo is broken** and **Play cut-off demos up to where they end**.
