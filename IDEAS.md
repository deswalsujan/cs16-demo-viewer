# Ideas

Parked ideas and features we've discussed but not built yet. Each entry keeps enough of the discussion that it can be picked up later without starting over. When something here gets built, it moves to the [changelog](CHANGELOG.md).

Only what is open stays here. An open item keeps a three-line header (Status, Next step, Decided so far; each answer in Decided so far also has its line in `STATE.md`); a parked item keeps one line, since nothing happens until Sujan picks it up. Done items, and the full text of open ones, go to [IDEAS-ARCHIVE.md](IDEAS-ARCHIVE.md) word for word, under the same section and block names (since 29 Oct 2026). A section that older notes, code comments or `tests/README.md` point to and that isn't here, such as "Tell exactly why a demo is broken", is in the archive under the same name.

## Open follow-ups (checklist, updated 29 Oct 2026, 0.24.0)

Everything raised in conversation that isn't finished, in one place. Each item says who does it. Ideas for new features are further down; this list is for loose ends.

**Sujan's feedback of 23 Oct 2026** (HLTV viewer; built in 0.22.0 unless said; demos and events in `tests/README.md`)
- Done, in the archive: Sujan's answers on the 23 Oct review page (24 Oct 2026, on the 0.22.0 fixes), the three levels of wallbang (0.23.0 and 0.24.0), wallbang hits that didn't kill and the damage per wallbang (0.24.0).
- [ ] **Strict and LOOSE wallbangs, by eye (0.23.0)**
  - Status: built in 0.23.0; not yet checked by Sujan. The 21 LOOSE kills on the 50 demos are listed in CHANGELOG.md, 0.23.0.
  - Next step: Sujan opens FX vs Lions, Nuke, DreamHack Winter 2010: R13 1:19 NIKO on LoordB should read LOOSE, R22 0:47 THREAT on LoordB strict, in the Wallbangs and Kills lists (tag after the gun, pixels on hover); the heading counts both.
  - Decided so far: strict under 50 pixels of the victim in view, LOOSE from 50, still listed (Sujan, 25 Oct 2026).
- [ ] **Light purple for loose wallbangs, by eye (0.24.0)**
  - Status: built in 0.24.0, live since 28 Oct 2026; not yet checked by Sujan.
  - Next step: Sujan opens k1ck vs eq, Nuke, DreamHack Winter 2011, R2 1:18, spekz on DECE (loose from damage): light purple on the LOOSE WB crosshair marker in **Player's eyes**, the ring, the kill line, the timeline diamond, the ✕ on the numbers and the death banner; strict ones stay pink.
  - Decided so far: loose light purple wherever it's marked, strict pink; a kill is loose from damage when a bullet of the killer's that only a surface explains lands 0.5 s or less before it, same spray only (Sujan, 28 Oct 2026).
- [ ] **Republish the claude.ai viewer**
  - Status: https://claude.ai/artifact/KHjQXfeVe17XXPrqarFDrS shows 0.23.0; GitHub Pages is on 0.24.0. Tried 28 Oct 2026: the Artifact tool wanted the whole live page (7,066 lines) read first, which didn't fit in that session.
  - Next step: a claude.ai session republishes it from `dist/artifact.html` (`STATE.md`).
  - Decided so far: each change ships as a pull request that Sujan merges, then this page is republished (Sujan, 29 Oct 2026).
- [ ] **Bug: short names leave a bracket**
  - Status: found 27 Oct 2026, not fixed. "[fnaticMSI.cArn]" reads "cArn]" in the lists and over the players (fnatic vs Moscow Five, Nuke, DreamHack Summer 2011).
  - Next step: Claude fixes `shortNames` in `src/template.html`, which cuts the shared "[fnaticMSI." but not the closing "]".
  - Decided so far: names over the players and in the Kills and Wallbangs lists go without the tag or sponsor; the kill feed, the name bar, the Tab scoreboard and Copy list keep full names (Sujan, 14 Oct 2026, 0.18.0).
- [ ] **Later (Sujan, 26 Oct 2026): a simpler UI, tooltips, feature names in bold in the viewer's own text.** One piece of work with the two items under "User experience" below, and tracked there.

**Sujan's feedback of 14 Oct 2026**: done, every item confirmed by Sujan by eye (0.18.0 to 0.21.1, 14 and 15 Oct 2026); the block is in the archive.

**Wallbangs and kill timing** (0.15.5, 2 Oct 2026): done (0.15.5 and 0.16.0; the denser hidden check closed 5 Oct 2026, with the finder left as in 0.17.0); the block is in the archive.

**Across both viewers** (raised during the POV work, 4 and 5 Oct 2026; the same block is on main and on `wip/pov-mode`)
- Each open item here is built in the HLTV viewer and waits for POV mode, which comes into main on main's code behind a **POV mode** setting (work item 6.5; Sujan, 29 Oct 2026). Once that's built, the items close except their POV-only parts; the 6.5 report lists which. Done, in the archive: **Bullet path**, dropped by Sujan 5 Oct 2026 (what its bot test found about wallbangs is kept there).
- [ ] **Subtler kill markers at the crosshair**
  - Status: HLTV viewer, built in 0.17.0, confirmed by Sujan (5 Oct 2026). POV mode not done.
  - Next step: Claude, in 6.5.
  - Decided so far: option A, thin ticks past the crosshair's arms, and no ring around the victim in **Player's eyes** (Sujan, 5 Oct 2026).
- [ ] **Feature names in bold** (was: in single quotes, 5 Oct 2026)
  - Status: the docs follow it since 25 Oct 2026; the viewer's own text not yet.
  - Next step: Claude, together with the tooltips ("User experience" below).
  - Decided so far: **bold**, capitalized as on screen, no quotes, in the viewer's text (tooltips, notes, load summary) and in the docs, following Microsoft's and Google's style guides (Sujan, 25 Oct 2026).
- [ ] **Round announcements**
  - Status: HLTV viewer, built in 0.17.0, in the game's look and place since 0.18.0. POV mode not done, and not yet checked in a POV demo.
  - Next step: Claude, in 6.5.
  - Decided so far: text in the centre like the game, in 2D too, no mockup (Sujan, 5 Oct 2026); orange Verdana, the top of the text 35% down (Sujan, 14 Oct 2026).
- [ ] **Defusal kits and the carried bomb on the players**
  - Status: HLTV viewer, built in 0.17.0, confirmed by Sujan (5 Oct 2026). POV mode not done.
  - Next step: Claude, in 6.5.
  - Decided so far: on the 3D models and in the Tab scoreboard (Sujan, 5 Oct 2026); in the HLTV viewer the C4 carrier and a dropped bomb are also on the radar since 0.18.0 (Sujan, 14 Oct 2026).
- [ ] **The 0.18.0 and 0.18.1 changes**: side panel clicks kept during playback, kill feed icons, short names, round announcements in the game's look, three crosshair sizes, the C4 on the radar, a wider Tab scoreboard, HLTV slow motion at real speed, the shorter 3D bar
  - Status: HLTV viewer, built. POV mode has the kill feed icons (22 Oct 2026, on `wip/pov-mode`); the rest not done.
  - Next step: Claude, in 6.5; which of them POV mode gets was left as Sujan's call.
  - Decided so far: Sujan's answers of 14 Oct 2026 (archive, "Sujan's feedback of 14 Oct 2026").
- [ ] **C4 timer counting down**
  - Status: HLTV viewer, built in 0.21.0. POV mode's copy still counts up.
  - Next step: Claude, in 6.5; whether POV mode gets it was left as Sujan's call.
  - Decided so far: counts down from 0:35, holds 0:00 after the explosion, stops at a defuse; list times stay time since the plant (Sujan, 15 Oct 2026).
- [ ] **The 0.22.0 changes**: invisible brushes and what bullets break aren't cover, the picture check for bodies in view, skips across a round restart, a demo counts as POV only with no HLTV audience updates, five small fixes
  - Status: HLTV viewer, built. POV mode not done.
  - Next step: Claude, in 6.5; which of them POV mode gets was left as Sujan's call.
  - Decided so far: fences, grates and ladders stay cover (Sujan, 23 Oct 2026); the picture check's 100-pixel drop became the strict and LOOSE split in 0.23.0.
- [ ] **Two kills at one moment picked apart in the lists (0.22.2)**
  - Status: HLTV viewer, built. POV mode not done (same code in its copy).
  - Next step: Claude, in 6.5.
  - Decided so far: nothing to decide.
- [ ] **Strict and LOOSE wallbangs (0.23.0)**
  - Status: HLTV viewer, built. POV mode not done.
  - Next step: Claude, in 6.5; whether POV mode gets it was left as Sujan's call.
  - Decided so far: strict under 50 pixels of the victim in view, LOOSE from 50 (Sujan, 25 Oct 2026).
- [ ] **The 0.24.0 changes**: crosshair sizes a step smaller, the 3D view 0.1 s behind, wallbang damage with **Glow on hits**, loose wallbangs from damage, light purple for loose
  - Status: HLTV viewer, built. POV mode not done. A POV demo carries the recorder's own health and damage, which may make wallbang damage exact there.
  - Next step: Claude, in 6.5; which of them POV mode gets was left as Sujan's call.
  - Decided so far: the 0.24.0 decisions in `STATE.md` (Sujan, 25 to 28 Oct 2026).

**POV demos** (3 Oct 2026; findings under "POV demos" below)
- The POV checklist from `wip/pov-mode` was folded in on 29 Oct 2026; its done items are in the archive. POV mode goes into main behind a **POV mode** setting, off by default, and on by default for POV demos once Sujan signs it off (Sujan, 29 Oct 2026; work item 6.5, not built). This replaces "goes back into main only if it works as intended" (3 Oct 2026).
- [ ] **Kill feed icons in POV mode, on Windows**
  - Status: built 22 Oct 2026 on `wip/pov-mode`, ported from 0.18.0; not yet checked by Sujan.
  - Next step: Sujan opens `pov/pov.html` on `wip/pov-mode`, any POV demo, and looks at the top right after a kill: orange gun icon, headshot icon on headshots, no "m4a1" or "HS" words.
  - Decided so far: built at Sujan's request in the HLTV viewer's look, no mockup (22 Oct 2026).
- [ ] **The hidden-enemies note is easy to miss**
  - Status: raised by Sujan 5 Oct 2026, apply or park to be decided: when the demo opens, the eye is on the load summary, and the note's box and text are small.
  - Next step: Sujan decides. One idea: show it only after the load summary closes, and larger.
  - Decided so far: option B, a note above **See through walls** (Sujan, 4 Oct 2026), reworded for players 5 Oct 2026 ("This server seems to use an anti-wallhack plugin").
- [ ] **Kills the wallbang finder can't check**
  - Status: the server held the victim back, so he isn't in the file at the kill and there's nothing to trace to: 4 of 31 gun kills in the GP css_cache pub demo of 3 Oct 2026 (Sujan's wallbang at 4:13), and his M4A1 headshot on r`GrimeS at 2:02 in `PPGpub_de_barcelona[Cts]_21-10-2026_15.54.26.dem` (public server, 21 Oct 2026). Left unmarked.
  - Next step: Sujan decides on Claude's idea of 22 Oct 2026: on a server that holds enemies back, list a victim never sent to the recorder's game before the kill as "not seen on his screen", without claiming a wallbang. Not counted across his demos yet; it would change the 5 Oct decision.
  - Decided so far: no marker or message for kills the finder can't check ("it'll just confuse players", Sujan, 5 Oct 2026).
- [ ] **See through walls and an aimbot catcher in POV mode** (Sujan asked 3 Oct 2026)
  - Status: **See through walls** works, on what the server sent (checked 4 Oct 2026: anti-wallhack servers send enemies only when they're about to be seen). The aimbot catcher is not started.
  - Next step: Claude builds the aimbot catcher; not started, and not in the work order in `STATE.md`.
  - Decided so far: **See through walls** stays in POV mode, for admins checking a suspect's POV (Sujan, 3 Oct 2026).
- [ ] Parked (Sujan, 5 Oct 2026): a deeper check of his own gun animations, weapon by weapon (draw, reload, silencer, shots, grenades, knife), beyond the M4A1 silencer seen so far.
- [ ] Parked (Sujan, 3 Oct 2026): voice from other players.
- [ ] Parked (Sujan, 3 Oct 2026): in-game chat messages, while alive and dead.

**Demo search** (built in 0.15.2, 2 Oct 2026)
- [x] confirmed by Sujan 3 Oct 2026: the search box by eye on your own folder (type "tu", "sk train", then Esc). Built screen next to the mockup: [docs/demo-search-built.png](docs/demo-search-built.png).
- [x] confirmed by Sujan 3 Oct 2026: 0.15.3 by eye, Zalando Sans across the start screen, a demo, the side panel and the shortcuts list (press ?), and the "Your demos" heading now sitting by the list.

**Broken demos** (raised 2 Oct 2026)
- [x] Sujan: decided 2 Oct 2026, build both "Tell exactly why a demo is broken" and "Play cut-off demos up to where they end" (below).
- [x] Claude: built in 0.16.0 (3 Oct 2026), no mockup. Tested on copies of Na`Vi vs FX, Dust2, SEC 2011 final, damaged by hand (CHANGELOG 0.16.0).
- [ ] Later (Sujan, 3 Oct 2026; he'll say when he has one; still none, 5 Oct 2026): when a broken demo turns up, open it and check the load summary's line and how far it plays. No real one is in the folders now; the line for mousesports vs Virus (ESWC 2011) would be "This recording was never finished".

**How accurate is the viewer, on a fresh batch of demos** (done 2 Oct 2026 on Windows; fixes in 0.15.1)
- [x] Sujan: 15 new demos are on the Mac and Windows (2 Oct 2026; Windows checked by listing the folder: all 31 demos in the table, none missing or extra), listed with their events in `tests/README.md` ("new batch").
- [x] Claude, 2 Oct 2026, on Windows files: the 16 regression demos give the CHANGELOG numbers exactly. New batch: 7 of 9 maps matched; the other two (SK vs Na`Vi, Train, DreamHack Winter 2011; mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final) are fixed in 0.15.1. K-D checked against Sujan's numbers: all match but markeloff on the ESWC 2010 Train (22-4 against 21-4) and karrigan on the GameGune 2012 Dust2 (20-14 against 21-13), left as the demos show them (CHANGELOG 0.15.1, "Discussed, not changed").
- [x] confirmed by Sujan 3 Oct 2026: 0.15.1 by eye, the Rounds tab on SK vs Na`Vi, Train (DreamHack Winter 2011) and on the five ESWC 2010 Tuscan files joined.
- [ ] Parked: a file holding only a warmup, opened on its own, shows one round. It could show none when its messages say warmup and never live. The one example, the first ESWC 2010 Tuscan file (`mtw-vs-navi-eswc2010semi-real-1007031520-de_tuscan.dem`, mTw vs Na`Vi, ESWC 2010 semi-final), was deleted on 3 Oct 2026 at Sujan's request (the Join card refuses it: only 5 of the 10 players), so this needs another warmup-only file to test. Sujan (5 Oct 2026) remembers that file showing an error when he opened it, which he took for a broken-file message; the notes say the Join card refused it (only 5 of the 10 players) and that, opened alone, it read 1 round (0.15.1). Check both when another warmup-only file turns up.
- [x] Sujan: known results given (one player's K-D on each of 10 maps, 2 Oct 2026); Claude looked up the final scores on HLTV.org (found for 7 of the 10 maps; not found for Sweden vs Norway, ASUS ENC 2010, and the two ESWC 2010 maps).
- [x] Earlier wording of the first step, kept for the rule in it: put the new demos in `cstrike`, ideally with known results (final score, and K-D of a few players from HLTV.org or memory), and name the event of each (CLAUDE.md rule). Keep the demos whose numbers are confirmed in CHANGELOG.md (0.14.2 table, 0.15.0 Xperia Play 2011 FX vs mTw) somewhere, even outside the folder: they're the regression set every counting change is checked against, and the 0.15.0 Steam ID "0" bug was only caught because Na`Vi vs FX (SEC 2011) was in it.
- [x] Claude: read the new batch with `tests/compare_all.sh` and `page/match_detail.js` (score, every round's winner, K-D overall, T and CT), and `page/summary_text.js` for the load summary; compare with Sujan's known results; list every mismatch round by round before changing anything. Also run the regression set (16 demos) with `compare_all.sh` to confirm Windows gives the same numbers as the Mac. Warn Sujan before the full run (about 4 minutes for 25 demos).

**A map split over two or more demo files** (shipped in 0.15.0, 2 Oct 2026)
- [x] confirmed by Sujan 3 Oct 2026: 0.15.0 by eye on your side, with sounds: open `fx-vs-mtw-xperia2011-1104240112-de_inferno.dem` (Xperia Play 2011, Inferno part 2), Join the parts, then watch playback across the join at round 16 in 2D and 3D; open part 1 later and check it opens joined; Split them. Built screens next to the mockup: [docs/split-map-built.png](docs/split-map-built.png).
- [ ] Parked: suggest the order of 3 or more parts whose file names carry no recording time (below, under "Join a map split over several demo files"). Sujan's plan (5 Oct 2026): download a map split into 3 or more files, rename them so the names carry no recording time, then open them.

- [x] confirmed by Sujan 3 Oct 2026: the Count them note, faded rows and "Demo read: 30 rounds, 27 counted" on the fnatic vs EG demo, by eye (0.14.2).

**0.16.0 by eye** (3 Oct 2026)
- [x] confirmed by Sujan 3 Oct 2026: in 3D, with nobody picked (just after opening a demo), aim the free camera at a player and press Player's eyes, Behind player or V: it should follow that player.
- [x] confirmed by Sujan 3 Oct 2026: the "HP · weapon" line under far names shows whether the AWP is scoped in or not.
- [x] Deleted by Sujan on Windows, 3 Oct 2026: `mtw-vs-navi-eswc2010semi-real-1007031520-de_tuscan.dem` (mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, warmup only). Deleted on the Mac the same day.
- [x] Deleted by Sujan, 3 Oct 2026: the `_claude_transfer` folder Claude left in `~/Downloads/Half-Life` on 3 Oct 2026 (a 227 MB copy of the game files, made to test on the Mac's files; the session can't delete files there). Nothing reads it.

**Hand checks for Sujan** (things the headless test browser can't do). Every feature named here is built and shipped; an open box means Sujan hasn't yet confirmed it on his own machine, or (Theatre 150%) a test run wasn't repeated. Sujan confirmed several on 2 Oct 2026, ticked below. Several name demos deleted on 2 Oct 2026 (Lions vs mousesports and Moscow 5 vs Na`Vi from ESWC 2011, Anexis vs fnatic from DreamHack Bucuresti 2012, Team3D vs Fnatic Train 2006, MYM vs SK from Kode5 2008, the GP Pub de_zovine POV demo); those checks need the demo back, or can be dropped. `tests/README.md` keeps their events.
- [x] **0.14.0 on your side**, confirmed by Sujan 3 Oct 2026: the Lions vs mousesports smoke Threat throws at about 15:16 (it pops at 15:19) and the Anexis vs fnatic one at 10:39, both light green; the Players tab on the 2006 Train demo (PENTAGRAM rows should each show their own name) and on any MYM demo you have; the skull on dead players; Free camera from Player's eyes and Behind player starting at the player. Checked in the test browser only, with no weapon models or sounds loaded.
- [x] **The wallbangs that changed in 0.13.0**, confirmed by Sujan 3 Oct 2026 in the game's demo player (he first said so on 2 Oct, "Wallbangs that have been removed, I've confirmed", but it wasn't written down here) (round and round timer as the viewer shows them). Files: `noa.penta-0610211800-de_train.dem` (NoA vs Pentagram, Train 2006; protocol 47, so the Steam game can't play it and those checks are dropped, Sujan 2 Oct 2026), `navi-vs-fx-sec2011-final-1110091449-de_train.dem` (Na`Vi vs FX, Train, SEC 2011 final) and `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` (SK vs WinFakt, Mirage, IEM6 GC New York final), both protocol 48, checked:
  - (dropped, protocol 47) NoA vs Pentagram, Train 2006, newly listed: R18 1:22 MJE AK on kubenB, R21 1:09 neo M4 on zonic. No longer listed, not commented on yet: R12 1:01 Paddy M4 on kubenB. Still listed and not checked: R4 0:40 and R5 1:24 taz AK on zonic, R10 1:03 Paddy M4 on neo, R22 0:55 neo M4 on ave, R24 0:38 zonic AK on LoordB, R28 1:17 MJE AK on LoordB, R28 1:12 neo M4 on MJE.
  - Na`Vi vs FX, Train 2011, no longer listed: R9 1:21 Zeus AK on PASHA.
  - SK vs WinFakt, Mirage 2011, no longer listed: R4 0:37 face M4 on JiGetus, R9 0:50 RobbaN M4 on JiGetus, R19 1:26 i'M(BA-SiC)K FAMAS on Delpan.
- [x] **Dropped by Sujan, 5 Oct 2026** (superseded by the POV demos section above, and the demo is deleted). **The GP Pub POV demo on your side** (0.13.0, superseded by the POV demos section above, 3 Oct 2026): it should open on de_zovine with 27 rounds and the two notes in the load summary. Then watch a minute of it in 3D: it was only checked loading in the test browser, never by eye. The demo was deleted on Windows by Sujan on 2 Oct 2026 and was never on the Mac, so no POV demo is on either machine now: this check needs a new POV demo (Sujan's next chat, from 3 Oct 2026, is about whether POV demos play). No de_zovine overview exists, so the 2D radar shows a plain grid.
- [x] **The 0.13.0 side panel by eye**, confirmed by Sujan 3 Oct 2026: Kills and Wallbangs on three lines with the kill feed icons, the clicked kill keeping its bookmark and tint, the lighter tint on the kill playback is passing, Rounds and Players highlights; Clear saved files with a demo open; the summary card's countdown bar moving smoothly. Approved designs: [docs/side-panel-designs.png](docs/side-panel-designs.png).
- [x] **Reconnect and "Allow on every visit"** (0.12.0): works in a normal window, Sujan, 2 Oct 2026. In an incognito window, with the window kept open (viewer tab closed, reopened in the same window), Reconnect works but Chrome skips the "Allow on every visit" choice. The page asks the same way in both windows, so this is Chrome's doing; Chrome's own write-up of the feature doesn't mention incognito, so not confirmed from a source. Nothing to change. Original check: In a normal (not incognito) Chrome window: open the GitHub Pages link, choose the folder, close every tab of the viewer, open the link again, click Reconnect and choose "Allow on every visit", close the tab again and reopen it. Expected: it goes straight to "Up to date" with no prompt. Not yet done: a reload doesn't show the prompt, because Chrome keeps the access until the last tab of the site closes.
- [x] **The 0.12.1 folder row on a real folder**, all three checks confirmed by Sujan 2 Oct 2026: choose a wrong folder (for example `sprint-builds-review`), then the `cstrike` folder itself, then the right one; move demos in and out while the page is open (the list should update when you click back into the tab); click Clear saved files twice (should go straight back to "Choose your Half-Life folder").
- [x] **Reset view (0.12.2)**, confirmed by Sujan 2 Oct 2026 from Player's eyes in 3D: should go back to the starting overview.
- [x] **Settings carry over (0.12.3)**, confirmed by Sujan 2 Oct 2026: change view, speed and toggles, open another demo: settings kept, speed back to 1x and paused; reload the page: settings still there.
- [x] **The game's own demo player vs the viewer**, confirmed by Sujan 3 Oct 2026 (the scope and the crosshair themselves are built and confirmed; this is only the comparison with the game, and Sujan may drop it), two checks on one demo (see "Open decisions"): does the in-game player show the AWP scope for an HLTV demo, and does it show the same small crosshair offset at a kill (CHANGELOG 0.10.0)?
- [x] **Windows 150% Theatre run** (Claude's automated test, not a hand check), rerun 5 Oct 2026 on 0.16.0: 39 of 39 passed (`theatre_test.py`, 1707x960 at 1.5x, on Sujan's Windows copy of Na`Vi vs FX, Dust2, SEC 2011 final, with the de_dust2 map). Earlier it had passed on the build before the last 0.9.x fix and wasn't rerun after it.

**Not yet tested on real demos**
- [x] The 102 MB mousesports vs Virus Inferno demo (event not known): broken, confirmed by Sujan (2 Oct 2026; he knew, and had meant to delete it). See "Tell exactly why a demo is broken" below.
- [x] Breakables on Nuke and Inferno (vents) and Tuscan (logs) disappear in 3D when shot out: confirmed by Sujan, 2 Oct 2026.
- [ ] The 145 MB Moscow 5 vs Na`Vi Mirage demo, ESWC 2011 (memory and load time on a laptop). Deleted 2 Oct 2026; needs a big demo again. Still to confirm (Sujan, 5 Oct 2026).
- [x] confirmed by Sujan 3 Oct 2026: WinFakt vs Check-Six Mirage (16-6): that demo isn't in the Mac's folder. Na`Vi vs FX Dust2 now reads the official 16-11 and M5 vs Na`Vi Mirage 16-9 (0.14.2).

**Small decisions not yet taken**
- [x] Free camera to Player's eyes or Behind player with nobody picked follows the living player nearest the middle of the view (decided by Sujan 2 Oct 2026): built in 0.16.0.
- [x] Show the demo's protocol (47 or 48) in "Copy debug info": built in 0.15.4, with HLTV or POV.
- [x] Since 0.12.1 a demo can only be opened after the folder is chosen; in Firefox and Safari that means choosing the folder on every visit. Accepted by Sujan, 2 Oct 2026; it's in CHANGELOG.md "Known limits" (those browsers lack the feature that keeps folder access).

**User experience** (Sujan, 25 Oct 2026: "We should constantly be thinking about user experience")
- [ ] Later (Sujan, 25 Oct 2026): a review by one or more separate agents of how the viewer's UI could be simpler, or confirmation that it already is simple enough. Give them the built page and screenshots, not Claude's own conclusions.
- [ ] Tooltips on every flagship feature and on any option that could confuse a first-time user (the Wallbangs filters among them), in one consistent design that reads as a tooltip at a glance, before anyone reads it: distinct from the rest of the viewer yet subtle, in its style. Mockup first.

**Tied to moving to sujandeswal.com** (not a dependency for anything else)
- [ ] Remove the `noindex` tag that `build.py` adds to `index.html` (kept out of search results until then; indexing is fine on sujandeswal.com).
- [ ] Privacy hardening (see "Other parked ideas").

**Done since this list was written:** 0.23.0 (25 Oct 2026: strict and LOOSE wallbangs, split at 50 pixels in view); 0.22.2 (24 Oct 2026: two kills at one moment picked apart in the lists); 0.22.1 (23 Oct 2026: sight and bullet lines judged apart for Inferno's lamp posts); 0.22.0 (23 Oct 2026: Sujan's feedback of 23 Oct; breakables and invisible brushes aren't cover, the picture check for bodies in view, skips across a round restart, the POV label, five small fixes); 0.21.0 and 0.21.1 (15 Oct 2026, all confirmed by Sujan by eye: the C4 timer counts down from 0:35 and holds 0:00 after the explosion; WALLBANG and UNSURE on their own line in the Kills list, // on every kill on a skip; "C4 0:16" kept in one piece in the list time cells); 0.18.0 to 0.20.0 (14 Oct 2026: Sujan's feedback of 14 Oct, skips in the recording found and marked); Sujan's by-eye checks of 0.14.0 to 0.15.3, the 0.13.0 wallbangs and the scope and crosshair in the game's demo player (3 Oct 2026); 0.16.0 (cut-off and unfinished demos play up to where they stop, and the load summary says exactly why; Free camera to a player follows the one nearest the middle of the view; health under names at any distance; a test guarding the 0.15.5 late-kill timing); Sujan confirmed the five 0.15.5 wallbang removals and the NoA vs Pentagram kill feed (2 Oct 2026); 0.15.3 (Zalando Sans for headings and text; the "Your demos" heading by the list); 0.15.2 (search box for the demo list); 0.15.1 (round counting from the accuracy check: SK vs Na`Vi, Train, DreamHack Winter 2011 and mTw vs Na`Vi, Tuscan, ESWC 2010 now right); the accuracy check on the new batch; 0.15.0 (a map split over several demo files joined as one; players joined by live-round names only); 0.14.3 (players were drawn one snapshot late, fixed); Sujan confirmed the two 0.14.2 scores not found online (Na`Vi vs FX Train 11:16, mTw vs Lions Nuke 10:16); 0.14.2 (round counting: stop at 16 with Count them, team swap suicides, rounds past a half, the IOL false start, plain team names); the Count them mockup and the team name change, approved by Sujan (2 Oct 2026); 0.14.1 (FX vs SK Inferno: lo3, restarted halves, KUBEN twice, renamed players); 0.14.0 (smokes from the game's own smoke events, HE and flash bursts on maps where the demo has no grenade objects, light green smokes, shorter names and the skull in the Players tab, Free camera starting at the player); and earlier: Train in 3D on Sujan's side (the 2006 NoA vs Pentagram demo, 1 Oct 2026, which led to 0.13.0); 0.13.0 (kills timed from the real moment, the gun rule, POV demos, Clear saved files closing the demo, the smooth summary bar, the side panel lists); the start screen line "Needs your own copy of Counter-Strike 1.6, installed through Steam" (0.12.4, confirmed by Sujan).

**Next on the roadmap:** item 2, the README Requirements list (below), then item 4, the next features, starting with opening duels and trades. The accuracy check on a fresh batch is done (0.15.1).

## Roadmap (agreed 1 Oct 2026, in this order)

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

## Next up (raised 1 Oct 2026, after 0.11.0): all five settled

1. Old protocol 47 demos: done in 0.11.1.
2. Remember the Half-Life folder, with a folder row on the start screen: done in 0.12.0 and 0.12.1.
3. Reset view in 3D: done in 0.12.2.
4. Settings when opening another demo: done in 0.12.3.
5. Bullet marks: checked and parked (see "Kept for later").

## Kept for later

- **Bullet marks (decals)** (parked 1 Oct 2026 by Sujan, after a feasibility check). For seeing where a spray actually lands while the crosshair is pulled down against recoil.
  - **Why parked:** HLTV demos don't record where the player was aiming at the moment of each shot, so marks on walls would land 1 to 2 degrees off and partly be made up. That goes against showing only what the demo recorded.
  - **Feasibility check, 1 Oct 2026 (Dust2, Na`Vi vs FX):**
  - What the game sends with every shot (ReGameDLL source, `wpn_ak47.cpp` and `FireBullets3` in `cbase.cpp`): the spread already worked out from the random seed (two numbers, `fparam1` and `fparam2`), and the recoil at the moment of the shot (punch angle times 100, `iparam1` and `iparam2`). The shot's start point and view angles are left empty for the receiving game to fill in from the shooter.
  - What the HLTV demo keeps: the spread (2,316 of 2,317 fire events, stored to 0.01, about half a degree) and the recoil (to 0.01 degrees). The view angles of the shot are missing (10 of 2,317 events), so the aim has to come from the player's snapshots, about ten a second, as everywhere else in the viewer.
  - Accuracy, from 68 to 71 headshot kills: the rebuilt killing bullet passes a median of about 16 to 17 units from the head centre (a head is about 10 units across), so it hits the head in about 1 case in 10. Shifting the aim or the victim by a snapshot either way doesn't fix it. Recoil clearly helps in sprays (for example 38 units off without it, 13 with it; 35 and 10), so the recoil data is real; the error is the aim between snapshots, the same limit as the crosshair-at-kill finding in CHANGELOG 0.10.0 (1 to 2 degrees).
  - So: the shape of a spray (how far each bullet lands from the crosshair) is exact, but where the whole spray lands in the world is off by about 1 to 2 degrees, about a body width at 600 units.
  - Scripts: `tests/demo-probes/bullets.mjs` (what fire events carry), `bullets_hs.mjs` (headshot test), `bullets_sweep.mjs` (timing offsets).
  - Untested: burst weapons (the FAMAS and Glock burst events seem to use the recoil numbers for something else), and how bullets go through walls (the game reduces penetration by material).
  - **Options that were on the table:** (1) park, chosen; (2) a spray readout in Player's eyes, dots around the crosshair showing where each bullet went compared with the aim, which is exact data; (3) wall marks labelled as approximate, advised against.
  - **Worth revisiting if:** POV demos (recorded by a player, not HLTV) turn out to store the exact aim for every shot. Not checked yet. Blood and grenade scorch marks were to follow bullet marks and are parked with them.
- **Scope styles** (1 Oct 2026). Three sniper scope styles are in the code; the viewer uses "game" (like CS 1.6: thin lines, mil-dots, red dot). "clean" (lines and red dot, no mil-dots) was the runner-up: mil-dots carry no information in CS 1.6 (there's no bullet drop) and can cover a dark player model. "lines" is the 0.10.0 look. Switch with `SCOPE_STYLE` in `src/view3d.part.js`; all three compared in [docs/scope-designs.png](docs/scope-designs.png) (A is "game", B is "clean"). A menu choice was ruled out for now as clutter.
- **Quick-scope and no-scope labels** (built in 0.10.0, removed in 0.10.1). HLTV timing (about a tenth of a second) can't separate a real quick-scope from a slightly quicker normal scope, and no measured cut-off was found. Worth revisiting only with demos that carry finer timing (for example POV demos, which record the player's own zoom), or a well-sourced community definition.

## Decisions (both closed 3 Oct 2026)

- **Crosshair at the moment of a kill** (closed 3 Oct 2026: Sujan compared it in the game's demo player and asked for no change). The viewer shows the shooter's crosshair up to about 1.5 degrees off the victim at some kills (CHANGELOG 0.10.0, "Discussed, not changed"); the same limit sank bullet marks. Expected to look the same in the game's own demo player. Check one of the kills listed there in-game (for example markeloff's AWP kill on PASHA, Dust2 round 10).
- **How the game's own demo player shows the scope** (closed 3 Oct 2026: Sujan compared it in the game's demo player and asked for no change). Sujan has seen the scope in HLTV demos in-game. The viewer rebuilds it from the zoom click sounds, because no zoom field could be found in the demo (checked on Dust2 and Tuscan). If the game shows the scope for these exact demos, it gets it from somewhere still unread, which would be more reliable than the clicks. Worth checking one AWP kill in-game against the viewer.

## POV demos

The findings of 3 Oct 2026 (what a POV demo holds, what the viewer got wrong, the headless browser run) and what's built so far on `wip/pov-mode` ("In progress: POV mode", copied from that branch's CHANGELOG on 29 Oct 2026, with how each part was tested) are in the archive under this heading; work item 6.5 starts from there. The open POV items are in the checklist above.

Ideas from the discussion (3 Oct 2026, not decided):
- A wallbang check for the recorder's own kills only: with aim stored 100 times a second it could be more precise than on HLTV demos.

## Other parked ideas

*From the 30 Sept 2026 discussion on product practices and features. Not yet built.*

- **Test suite.** Known answers per demo (final score, round count, zero read errors), wallbang ground truth checked in-game, break-it tests with corrupt files and nasty player names, scripted browser run-throughs, and a folder of custom model and sound packs that must load or fall back cleanly. Could run on every push through GitHub Actions. Verified results so far: WinFakt vs Check-Six Mirage 16-6, Na`Vi vs FX Dust2 16-11 (right since 0.14.2), SK vs WinFakt Mirage 16-8 (IEM6 New York final, 0.14.2), M5 vs Na`Vi Mirage 16-9, and (1 Oct 2026, every round checked against the admin plugin's "Current score" messages) Fnatic vs ALTERNATE aTTaX Nuke 8-16, Fnatic vs mousesports Tuscan 15-15, mousesports vs AGAiN Inferno 16-11. Lessons from testing 0.8.0 and 0.9.x (1 Oct 2026): the headless test browser draws 3D without a graphics chip, so it's slow, and checks that depend on timing (a bar hiding after 2 seconds) can fail there and pass on a real machine. Wait for the outcome instead of a fixed time, and confirm timing failures by hand before chasing them. One full Theatre mode run of 39 checks on five screen setups took about 45 minutes. The scripts used so far are in [tests/](tests/README.md): the browser harness and page checks, the Theatre mode checks, and the demo data probes, with setup and run instructions. They run by hand; wiring them into GitHub Actions is the next step for the suite.
- **Join a map split over several demo files**: built in 0.15.0 (CHANGELOG.md has what it does and the findings behind it: the scoreboard counts by side and resets at every restart, every player's Steam ID is the same in both parts, the demo's own clock restarts in every file). What's left:
  - **Order of 3 or more parts without recording times in the file names** (Sujan's question, 2 Oct 2026). Today the rounds pin only the first part (starts from 0:0) and the last (the only one with a winner), so with 5 parts the 3 in the middle could go 6 ways and the viewer makes no suggestion. What the files could add: inside a half, the game's scoreboard by side should carry on from the end of one part to the start of the next (or be one or two rounds ahead when rounds fall between the files), and the teams should be on the same sides across a join except at a half end. Chaining parts by those would usually leave one order. Not tested: Sujan has no demo split into more than two files.
  - **Words:** "map", not "match", in everything the viewer says about it (Sujan, 2 Oct 2026).

- **Show the event's name while a demo plays** (parked 2 Oct 2026 by Sujan, not urgent). Many demos carry it: checked on every demo on the Mac, 19 of 26 name the event in their own text, either the game server's name in admin messages ("SEC #2 | ProGamers.pl", "DHS Main tournament #1", "IEM Global Challenge New York Server 1", "Kode5 Grand Final server #2", "IOL FINAL4 SM-FINAL #1", "Intel Extreme Masters #Stage") or the HLTV server's name ("DreamHack Bucuresti 2012:3", "HLTV-ESWC"). The ESWC 2011 demos say "[AdminBot 9.1] ESWC 2011 Grand Final." in every game, group games too, so the text names the event but not always the stage. Others name only the recording service ("HLTV.org - VeryGames.de", "www.VeryGames.net HLTV"); the Xperia Play, IEM5 FX vs SK and EM3 fnatic vs EG demos have the event in the file name only. So: the server's name as written, with the service names left out, is accurate where it's there; turning "SEC #2 | ProGamers.pl" into "SEC 2011" needs a list of known events. Where to show it: somewhere quiet, since the view is already busy (Sujan). Candidates: the load summary, the header's file line (where the map and file name are now), the hold-Tab scoreboard, or "Copy debug info". The list of demos and events is in `tests/README.md`.
- **Team names when nothing names the team** (parked 2 Oct 2026 by Sujan, leave as is for now). When the file name has no "-vs-"/"_vs_" and neither team wears a shared clan tag, the header says "Team 1" and "Team 2" (iFNG FX vs fnatic, `auto_ifng-1103030950`: FX play as "NEO[t]", "taz 8)", fnatic with no tags). Clicking the name renames it, remembered per demo. A fix would need a list of known players per team and year, which goes stale with roster changes and could name the wrong team.
- **Safety with custom and bad files.** Fall back to the simple figure when a model's skeleton or animations don't match stock CS, cap model and sound size, decode unusual WAVs through the browser, audit every place player names and demo text reach the page, and bail out of files with nonsense values.
- **Privacy hardening for sujandeswal.com.** Self-host three.js and the fonts, and add a security header that blocks the page from sending data anywhere.
- **Wallhack measure** (parked, from the "See through walls" discussion, 1 Oct 2026). Measure how long each player's crosshair stays on enemies hidden behind walls, compared with the same players in the open. A high share of time tracking hidden enemies is a sign admins could use alongside watching the view.
- **Highlight finder** (parked, not urgent). 3Ks, 4Ks, aces, clutches and quick multi-kills, filterable by player and weapon.
- **Record a clip** from the 3D view, with sound, to a video file.
- **Bookmarks with notes**, exportable with the same timestamps as the wallbang list.
- **Sounds on the radar**: gunshots and footsteps as brief pulses in 2D.
- **Share a moment by link**, such as `#r12` to open round 12.
- **Product basics still to do**: a compatibility note (browsers, HLTV vs POV demos) and a license.
- **1.6-era look** (parked, not urgent) as an optional theme: VGUI-style panels, Verdana/Tahoma, orange HUD numbers, sprites read from the player's own `cstrike/sprites`.
- **Tell exactly why a demo is broken**: built in 0.16.0 with the three checks below (CHANGELOG 0.16.0). The discussion is kept for the reasoning. (Raised 2 Oct 2026, from the mousesports vs Virus demo; Sujan: only if the viewer is 100% right.) What a GoldSrc demo looks like: a header (the first 544 bytes) whose last field points to an index at the end of the file. The recorder writes the frames as it goes and writes the index, and that pointer, only when recording stops properly. Checked on all 26 demos on the Mac: in the 25 good ones the index ends exactly at the last byte of the file. In mousesports vs Virus the pointer is 0, so the index was never written, and the file also stops 199 bytes into its last frame. So it was never finished: HLTV crashed, or the file was copied or downloaded while still being written. Everything before that is readable: walked frame by frame from the start, 350,083 frames, about 150 minutes of game time.
  - Three checks that are certain, from the file's own structure, before reading any game data: (1) the index pointer is 0: the recording was never finished; (2) the pointer is past the end of the file, or the index doesn't end at the last byte: the file was cut short or changed after recording; (3) the frames, read from the start, stop partway through one: cut off. Any one means the file isn't as a finished recording leaves it. None can be wrong about a file a recorder finished, since every finished demo has the index there.
  - Today the viewer shows "This demo can't be played: the file ends partway through, so it may be cut off or still downloading", guessed from the wording of the reader's error, followed by "check that it was recorded in Counter-Strike 1.6", which doesn't fit this case. With the checks it could say plainly which of the three it is.
  - Best of all with the next item: say what's wrong and play what's there.
  - Lesson for testing: the test harness waited 4 minutes for this demo and timed out, so it looked slow. It now stops as soon as the page shows a can't-play card and prints its text (2 Oct 2026).
  - **What's in mousesports vs Virus** (2 Oct 2026, read frame by frame from the start, without the index): the whole map. 149:46 of recording, 0 read errors, 127 round markers, 446 kills, ending with the admin bot's "End of fight - Finale score: 14 16" for mousesports. It's from ESWC 2011 (demo text "CS 1.6 ESWC #2 by Verygames"). The recorder ran on into the next match ("Loading match viva algeria vs Anexis") and the file stops 199 bytes into its last frame. The same frame-by-frame reading on a healthy file (FX vs mTw, Nuke, Xperia Play 2011) ends exactly where its index starts, so the reading can be trusted. (An earlier note here said 274 bytes; 199 is from this reading.)
  - So the honest message for this demo is "the recording was never closed properly; it plays up to where the file stops", and the viewer can play all of it. Today it refuses it.
- **Say when a recording stops partway through its last round** (found 2 Oct 2026 while checking the split-map summary line). mousesports vs SK, Mirage, ESWC 2011, stops 11 seconds into its last round at 15:5 to SK; ALTERNATE vs AGAiN, Inferno, ESWC 2011, stops 42 seconds into its last round at 15:8 to ALTERNATE. Both read one round short of a win. The demo shows it plainly (the last round starts, then the file ends), so the load summary could say "The recording stops partway through the last round", and the score could note it. Belongs with "Tell exactly why a demo is broken"; needs a mockup.
- **Play cut-off demos up to where they end**: built in 0.16.0, no mockup (Sujan: "just build and deploy the message"). Original note: a demo that was cut off (interrupted download, crashed recording) currently can't be opened at all, because the file's index sits at the end. Reading it frame by frame from the start would recover everything up to the cut. Shown to work on the mousesports vs Virus demo (ESWC 2011, 2 Oct 2026): every frame up to the last 199 bytes reads cleanly, 149:46 and the whole map. Needs a mockup of the load summary line ("This recording was never finished; it plays up to where it stops").
- **Shaded lighting on player models** so they darken in shadowed areas like in-game.
- **Team names for demos without "-vs-" in the file name** (found 1 Oct 2026). `2006-07-02_15h00_Team3D_Fnatic-...-de_train.dem` names its teams "fnatic" and "o of 3D": the guess from clan tags picked up part of a name. Worth reading names like `Team3D_Fnatic` from the file name too.
- **A wall thickness limit per gun** (2 Oct 2026). How thick a wall each gun can shoot through would catch wrong wallbangs on its own, but the numbers need care: the game moves a bullet ahead by its "penetration power" (AWP 45, AK 39, M4 35 units, cut by the material: a quarter on concrete) after each hit, and the thickest wall it gets through also depends on how the engine traces from inside a wall. Not used until that's checked in the code and in the game.
- **Late kill messages in other old demos** (2 Oct 2026). The 2006 NoA vs Pentagram demo is the only one so far where the kill message trails the kill (see CHANGELOG 0.13.0). A second protocol 47 demo would show whether all old demos do this.
- **Left-hand option for first-person weapons** (discussed 1 Oct 2026). The viewer now shows weapons in the right hand like CS 1.6's default (cl_righthand 1). A toggle for people who play left-handed is a one-line change if anyone asks.

## Moved from CLAUDE.md (29 Oct 2026)

Moved word for word when CLAUDE.md became AGENTS.md. Both are replaced: notes are one set on main since 29 Oct 2026 (`STATE.md`, Superseded), and `wip/denser-hidden-check` is still on the remote at `99c7106` as of 29 Oct 2026 (checked with `git ls-remote --heads origin`), not deleted as said below.

- **Notes on two branches (Sujan, 5 Oct 2026):** while `wip/pov-mode` is open, notes stay on their own branch (POV work on the branch, HLTV work on main), except where a point applies to both viewers: then it goes into the notes on both (example: a change made to both viewers). The two sets will be merged when POV mode goes into main, so write them to complement each other: never two versions of one fact, and nothing that would silently overwrite the other when merged.
- Open branch: `wip/pov-mode` (POV mode, experimental, from 3 Oct 2026). Its CHANGELOG "In progress" entry says what's built and what's next. Sujan wants the main viewer left alone while it's built: all POV work goes in the copy in `pov/src/` (build: `python3 pov/build.py`, writes `pov/pov.html`), and `src/` stays as on main. It goes back into main only once it works as intended. Everything else is on main. `wip/split-maps` (0.15.0, last commit `bb0c81f`) and `wip/team-swap-and-match-end` (0.14.2, last commit `6503c5b`) were fully merged and deleted on 2 Oct 2026, by Sujan on GitHub (this session's GitHub access can't delete branches). Their commits stay in main's history; a branch can be recreated from its last commit if ever needed. `wip/denser-hidden-check` (body-outline hidden check, last commit `99c7106`) was deleted unmerged by Sujan on 5 Oct 2026, after the check proved not conclusive (IDEAS.md); its commits are not in main.
