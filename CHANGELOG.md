# Changelog

What changed in the viewer, newest first. The version shows in the viewer's shortcuts panel (press ?) and on the start screen.

## In progress: POV mode (branch `wip/pov-mode`, from 3 Oct 2026)

Experimental (Sujan, 3 Oct 2026): a demo recorded by a player opens in POV mode by itself, in the same viewer. Removed again if it's more trouble than it's worth. Background and findings: IDEAS.md, "POV demos".

Built so far (not released, no version bump):
- **The recording player is drawn where he really was.** The server never puts the recorder's position in the snapshots (his own game moves him), so the viewer drew him at the map's zero point for the whole demo. His position and crouch now come from the messages the server sends him about himself (`clientdata`), which the reader already read and threw away. His aim stays as the snapshots give it, as for everyone else.
- **Kills by or on the recorder have his position**, so their kill lines, death marks and the wallbang check have a place to start from. Before, 40, 14 and 66 kills in the three files had no position (the cause of the "NaN" page error on Match 1).
- Kill lines and death marks with part of a position missing (a player whose height the snapshot never sent, 2 kills in Match 1 CT) are skipped in 3D.

How it was tested (on Sujan's Mac files, 3 Oct 2026):
- The recorder's track against the camera block the game writes about 100 times a second (`tests/demo-probes/pov_own_check.mjs`): the two agree to a median of 0.5 to 3.3 units, 90% within 7, on Match 1 (both files) and Match 3; never at the zero point while alive; speeds of a running player. The crouch flag matches the camera height in 89 to 94% of messages (the rest are mid-crouch). Yaw matches his own mouse aim to a median of 0.1°.
- At the recorder's own gun kills, his crosshair in Player's eyes sits a median of 0.86° (Match 1 T, 8 kills), 1.98° (Match 1 CT, 23) and 2.27° (Match 3, 33) from the victim's head (`tests/page/pov_own_kill.js`). Screenshot: round 5 at 1:01 of Match 1 T, N!njA_kachoRI under the crosshair.
- The reader's output against main's on Na`Vi vs FX, Dust2, SEC 2011 final and NoA vs Pentagram, Train 2006: identical. On the POV demos only the recorder's track and kill positions change.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py` and `late_kill_timing_check.py` pass. `demo_search_check.py` fails on the test folder (it holds none of the demos the check searches for) and fails the same way on main's build.

Still to do, in order: the recorder's own view at full rate (aim, recoil, zoom and gun animations from his frames, about 100 a second), then POV mode itself (opens on the recorder in Player's eyes, the load summary line, which panels hide), then voice. Each step checked with Sujan.

## Known limits (current version)
- HLTV demos don't record the first-person weapon's animation, so it's rebuilt from shots, weapon switches and the player's body animation. Timing can differ slightly from in-game, and idle variations won't match. If a `v_` model is missing, no gun is shown.
- Player models get even lighting, so they don't darken in shaded spots the way they do in-game.
- Custom models are named in the load summary but not checked further yet. One with an unusual skeleton may pose oddly; compressed or 24-bit sounds stay silent.
- A demo that's cut off, never finished or damaged partway plays up to where its readable frames end (0.16.0). Anything after a damaged stretch is left out, even if readable frames follow it. A file damaged in its first frames, before the match begins, still can't be played.
- Which rounds count is exact when the server's admin plugin announces the start ("Live !", "lo3", "3 restart and go !") and the end of each half in chat. Plugins word these differently, and a wording the viewer hasn't met yet falls back to a guess from the restarts, which can still count a warmup or miss a round. A file holding only a warmup, opened on its own, can show one round.
- HLTV demos store about ten snapshots a second, so everything between two snapshots is an estimate. A flick that starts and ends between snapshots can't be recovered, and a sharp turn can look slightly rounder than it was. The view always passes exactly through every recorded snapshot.
- At the moment of a kill, the shooter's crosshair can sit slightly off the victim, usually under 1.5° (through an AWP's 1x zoom that's up to about 60 pixels on a laptop screen). This comes from the demo, not the viewer: see 0.10.0, "Discussed, not changed".
- The sniper scope is rebuilt from the zoom click sounds, since HLTV demos don't record zoom (see 0.10.0). A click the recorder didn't hear would put the zoom one step off until the player's next weapon switch, death or round. Clicks are timed to about a tenth of a second.
- Theatre mode switches on by itself only with the viewer's own full screen (F or the Full screen button). The browser's full screen (F11 on Windows, the green window button or Ctrl+Cmd+F on a Mac) doesn't tell the page, so press T there.
- "Quality: auto" lowers 3D sharpness at most once per visit and doesn't raise it again on its own. Pick "Quality: high" to go back.
- Demos recorded by a player (POV demos) play, with two limits: the player's game only receives the players near them, so others drop in and out of view, and the wallbang finder is less reliable there than in HLTV demos. A recording that switched maps plays the map it spent longest on.
- Keeping the Half-Life folder between visits works in Chrome and Edge (122 or later) on an https page such as GitHub Pages. Firefox and Safari don't have the browser feature it needs, and the claude.ai copy is an embedded page, where browsers don't allow it; those pick the folder on each visit. A copy of index.html opened from your own disk also keeps it (checked in Chrome by Sujan, 1 Oct 2026).
- On maps with a lot of scenery (de_tuscan above all) the demo has no grenade in flight and no gun on the floor: the old engine sends at most 256 objects per snapshot and the map's own objects fill nearly all of them. Smokes, HE explosions and flashbang pops still show where and when they went off (see 0.14.0), but there's no flight path to draw.
- A map split over several demo files is joined by hand (Join the parts, or Join with another demo… in the Rounds tab). The viewer suggests the order from the recording times in the file names, or from the rounds; with 3 or more parts and no times in the names it can't, so the parts are put in order with the arrows. A demo with no real Steam IDs (a LAN server where every player has "0") isn't offered as a part; it can still be joined by hand, with players matched by name.
- A round played between two recordings counts in the score from the game's scoreboard, but its kills are in no file, so player stats leave it out.
- Whether rounds after 16 count can't be read from the demo, so the match stops at 16 unless Count them is switched on for that demo.
- When neither the file name nor a shared clan tag names a team, the header says "Team 1" and "Team 2" (iFNG FX vs fnatic, `auto_ifng-...`). Click the name in the header to type it in; it's remembered for that demo. Left as it is for now (Sujan, 2 Oct 2026; parked in IDEAS.md).
- The demo search looks at file names only. A demo whose name doesn't say the teams or map (`auto_ifng-...`) is found by scrolling.
- The wallbang finder rules out a kill that needed more damage than any shot through a wall can do (0.15.5). It needs the killer's shots in the demo; around a jump in the recording it can't tell, and the kill stays as the walls alone say.
- Health and weapon under the names in 3D show at any distance (0.16.0). With many players far away, the labels can overlap.
- A smoke cloud is drawn as one light green ball for as long as the smoke puffs (about 21 seconds, less when the round restarts). The game's own puffs drift and thin out unevenly, which the viewer doesn't copy.

## 0.16.0 (2026-10-03)

Broken demos, the camera when nobody is picked, and health under far names. All three asked for by Sujan on 2 Oct 2026 (IDEAS.md), built with no mockup at his request.

### Added
- **Cut-off and unfinished demos play up to where they stop.** A GoldSrc demo ends with an index of its segments that the recorder writes only when the recording stops properly. Without it the viewer refused the file. It now reads the frames one by one from the start instead and plays everything up to where the file stops. The same happens for a file damaged partway through: it plays up to the damage.
- **The load summary says exactly why.** Each line comes from the file's own structure, never a guess:
  - "This recording was never finished": the header's pointer to the index is 0, so the recorder never wrote it (HLTV or the game stopped without closing the file, or it was copied or downloaded while still being written).
  - "This file was cut short": the recording was finished, but the index it points to is past the end of the file, or only partly in it.
  - "This file has N extra bytes after its end": something was added after the index. Nothing is missing, so it plays in full.
  - "This file's index is damaged" and "Part of this file is damaged": the index doesn't fit the file, or the frames stop being readable partway.
  - Each also says when the file stops partway through its last frame, and how much recording is readable ("It plays up to where the file stops: 35:42 of recording."). When the only problem is the file stopping early, the card's title says so: "The demo will play up to where the file stops".
  - A file that stops before anyone moved still can't be played, and now says why with the same line instead of a list of likely reasons. In a joined map each part gets its own line ("Part 2: This file was cut short").
  - "Copy debug info" has a "File:" line with the same facts in bytes.

### Changed
- **Free camera to Player's eyes or Behind player, with nobody picked**, now follows the living player nearest the middle of the free camera's view, so the view stays where it was. Before, it was the first living player in the list, wherever the camera was. The button, the V key and both cameras work this way; a player already picked stays picked.
- **The "HP · weapon" line under names shows at any distance**, scoped or not. It stopped at 2,500 units before, so through a scope at long range only the names showed (the Dust2 kills in 0.15.5 were 2,700 to 3,300 units away).
- The can't-play message for a file that isn't a demo at all, or is damaged before the match begins, no longer ends with "check that it was recorded in Counter-Strike 1.6" unless the file isn't a Half-Life demo.

### Tests
- New `tests/late_kill_timing_check.py` (with `page/late_kill_timing.js`): fails if late kills in NoA vs Pentagram, Train 2006, stop being shown at the victim's death sound (0.15.5), so the fix can't be undone by accident. It re-reads the death sounds from the demo itself and checks all 135 late kills, then the kill Sujan confirmed (R22 0:55, neo's M4 on ave): shown 0.22 s before the message, positions 0.22 s before that, round timer 0:55, the kill feed empty at the shot and just before the death sound and showing the kill at it, ave on 9 HP just before. Run on a build with the fix undone (kills put back at the shot), 4 of its 11 checks fail.
- New `page/free_cam_nearest.js` and `page/hp_line_far.js` for the two changes above.

### How it was tested
- On Sujan's Mac files (`~/Downloads/Half-Life`, 31 demos), copied into the test machine on 3 Oct 2026.
- The file checks on all 31 demos: every index ends exactly at the last byte of its file, and reading the frames from the start ends exactly where the index begins, so the frame-by-frame reading finds the same segments as the index. Every demo reads exactly as in 0.15.5 (kills, rounds, snapshots, shots, health, map, errors: 31 of 31 identical, compared in Node).
- Five damaged copies of Na`Vi vs FX, Dust2, SEC 2011 final, opened in the test browser: cut at 60% (no index in the file, stops 600 bytes into a frame): "This file was cut short", 16 rounds, 35:42 of recording; the same with the pointer set to 0: "This recording was never finished"; 100 bytes added: "100 extra bytes", 27 rounds, plays in full; cut at 20 KB, in the loading part: can't be played, with the cut-short line; a damaged frame halfway: "Part of this file is damaged", 13 rounds, 29:56. A whole file with the pointer set to 0 (NoA vs Pentagram, Train 2006) reads identically to the original.
- Xperia Play 2011 FX vs mTw, Inferno, joined from its two files: mTw 19:17 in R36, as before.
- Free camera: on Na`Vi vs FX, Dust2, with the camera aimed at the last and the middle player of the list, Player's eyes, Behind player and V followed that player (0.15.5 followed the first in the list, starix, in all five). A picked player stays picked.
- HP line: with the camera over 2,500 units from all 10 players, every name drawn had its HP line (0.15.5: 0 of 10).
- `late_kill_timing_check.py` passes. `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py` and `demo_search_check.py` pass.

### Discussed, not changed
- No real broken demo is in either folder now (mousesports vs Virus, ESWC 2011, was deleted 2 Oct 2026), so the cases above were tested on copies damaged by hand. The "never finished" case matches what was read from mousesports vs Virus on 2 Oct 2026 (pointer 0, stops 199 bytes into its last frame).
- "Say when a recording stops partway through its last round" (IDEAS.md) is separate and still needs a mockup.
- At long range many HP lines can overlap each other; nothing is hidden to make room.

## 0.15.5 (2026-10-02)

Two wallbang and kill timing fixes from Sujan's checks on Sweden vs Norway, Dust2 (ASUS ENC 2010) and NoA vs Pentagram, Train 2006.

### Fixed
- **Wallbangs that the damage rules out.** Sweden vs Norway, Dust2, ASUS ENC 2010 listed three AWP kills as wallbangs that Sujan saw were clear shots: R9 1:40 RashiE on Delpan, R9 1:34 RashiE on f0rest, R30 1:41 Delpan on kalle. All three were body shots (no headshot) on players at 100 HP. From the game code (ReGameDLL): after a bullet goes through a wall, what's left of its damage is multiplied by at most 0.6 (wood; 0.5 for concrete and most walls, 0.2 for metal; `FireBullets3` in `cbase.cpp`), and a hit short of the head by at most 1.25 (stomach; `CBasePlayer::TraceAttack` in `player.cpp`); range and armour only take more off. So an AWP (115 damage) body shot through any wall does at most 86, which can't kill a player on 100 HP. The finder now drops a kill when every shot the killer fired just before it, each at that best case through a wall, couldn't have done the damage the victim took. The health comes from the demo (HLTV sends it whenever it changes); the shots counted are the killer's from the victim's last health reading, and at most 0.6 s before the kill. Each gun's damage is from ReGameDLL `weapons.h` (AK 36, M4A1 33, AWP 115, Scout 75, Deagle 54, and the rest). When the demo has no shot from the killer around the kill (a jump in the recording), the kill is left as it was. Delpan's AWP headshot on RashiE (R24 1:40), which Sujan confirmed as a real wallbang, stays: a headshot through a wall can do up to 115 x 0.6 x 4 = 276.
- **The kill feed ahead of the death in the 2006 NoA vs Pentagram Train demo.** At R22 0:55 the kill feed said neo had killed ave while ave was still running on 9 HP. That demo's kill messages arrive late (0.13.0), and 0.13.0 moved each late kill back to the killer's last shot. But in that demo the gun's fire events come about 0.2 s ahead of the hits they cause: neo's last shot is at 27:43.99, ave's last hit and death sound at 27:44.21 (his death animation starts then too), the message at 27:44.43. A late kill is now shown (kill feed, kill markers, death cam, timeline) at the victim's death sound, and the wallbang check still uses where everyone was at the shot, as before. Only kills whose message trails the death sound are moved: 135 in that demo, none of the 2011 demos' wallbangs.

### How it was tested
- Wallbang lists on all 31 demos, 0.15.4 against 0.15.5, with the maps loaded: 29 identical. Sweden vs Norway, Dust2, ASUS ENC 2010: the three above removed, the other 9 unchanged. SK vs Na`Vi, Train, DreamHack Winter 2011: two removed, both AWP body shots on players at 100 HP (R46 C4 0:01 markeloff on RobbaN, R47 1:37 Delpan on edzie). Not yet checked by eye.
- A first version also removed 7 kills in four other demos that sit at a jump in the recording (kills shown in "freeze" time, the dead player's health and his respawn arriving at the same instant, no shot from the killer); requiring the killer's shots put them back.
- NoA vs Pentagram, Train 2006: score, every round and every player's K-D identical (`match_detail.js`); wallbang list identical; neo's kill on ave now shown at 27:44.21, positions from 27:43.99.
- `demo_search_check.py`, `folder_row_test.py` (20 of 20), `start_screen_check.py` and `prefs_check.py` pass.

### Discussed, not changed
- Health under the names in 3D is shown only for players within 2500 units of the camera, so through a scope at long range (the Dust2 kills above were 2,700 to 3,300 units) only the names show. Scaling that distance with the zoom was offered to Sujan; not changed yet.
- A denser check of the victim's body (every 2 units instead of 15 points) finds Delpan and f0rest partly visible in the two R9 kills above, which the current check misses (the damage rule catches them anyway). It would change other demos' lists too, so it's parked in IDEAS.md for Sujan.
- Sujan asked whether this was a demo quirk. Partly: the late kill messages and the fire events coming early are how that 2006 demo was recorded (protocol 47; the 2011 demos don't do it). The wrong wallbangs on the Dust2 demo were the viewer's own limit: at 3,000 units the aim, read from snapshots about ten times a second, is too rough to tell a gap between doors from the doors themselves.

## 0.15.4 (2026-10-02)

### Changed
- "Copy debug info" now says which kind of demo is open: its protocol (47 for demos recorded before the 23 October 2008 update, 48 after) and whether HLTV or a player recorded it (POV). Old demos and POV demos each have known quirks (late kill messages in the 2006 NoA vs Pentagram demo, players dropping in and out of view in POV demos), so a bug report can be read with that in mind. Agreed by Sujan, 2 Oct 2026.

### How it was tested
- The debug text on NoA vs Pentagram, Train 2006 ("protocol 47, HLTV") and Na`Vi vs FX, Dust2, SEC 2011 final ("protocol 48, HLTV").
- `demo_search_check.py`, `folder_row_test.py` (20 of 20), `start_screen_check.py` and `prefs_check.py` pass.

## 0.15.3 (2026-10-02)

The viewer's font, and spacing on the demo search.

### Changed
- **Zalando Sans** for headings and text (Sujan, 2 Oct 2026). It replaces Chakra Petch (the start screen title, team names, score, card titles) and IBM Plex Sans (everything else). IBM Plex Mono stays for file names, timers, numbers and stats tables, where letters of equal width keep columns lined up. Served from Google Fonts like the fonts before it; the page now asks for two font families instead of three. Built screens: [start](docs/zalando-sans-start.png), [a demo open](docs/zalando-sans-demo.png).
- The "Your demos" heading and the count beside it now sit close to the list, with more room above them, so they read as the list's heading rather than part of the search box.

### How it was tested
- Screenshots in the headless browser with the real font files (from Fontsource on npm, since the test machine can't reach Google): the start screen with a search, a demo open in 2D, and the Tab scoreboard. Nothing cut off or overlapping.
- `demo_search_check.py`, `folder_row_test.py` (20 of 20), `start_screen_check.py` and `prefs_check.py` pass.

### Discussed, not changed
- Hosting the font files with the viewer instead of loading them from Google, as sujandeswal.com does since 29 Sept 2026. Left for the move to sujandeswal.com: the claude.ai copy is one file and can only load fonts from Google, and on GitHub Pages the gain is small. It stays in IDEAS.md under privacy hardening.
- Zalando Sans for the mono text too: offered, not taken.

## 0.15.2 (2026-10-02)

A search box for the demo list on the start screen, asked for by Sujan once the folder held 31 demos.

### Added
- **Search your demos.** Once the Half-Life folder is chosen, a search box sits between "Open a demo" and the list. Typing narrows the list to the demos whose file names contain every word typed, in any order and any case: "tu" finds the Tuscan demos, "sk train" finds SK vs Na`Vi, Train (DreamHack Winter 2011), "eswc2010 tuscan" the five ESWC 2010 Tuscan files. The matched letters are lit in the names, and the line above the list says how many are shown ("1 of 31"). Esc or the Clear button empties the box. With no match the list says so, naming the words.
- The box is a darker field with a sand outline and a search icon, and the list has its own "Your demos" heading, so the box doesn't read as one more demo row (Sujan's feedback on the first mockup). Approved mockup: [docs/demo-search-mock.png](docs/demo-search-mock.png); built: [docs/demo-search-built.png](docs/demo-search-built.png).

### How it was tested
- New `tests/demo_search_check.py`, on Sujan's 31 Windows demos: no box before a folder is chosen; the full list and count once it is; for "tu", "TU", "sk train", "eswc2010 tuscan" and "dhwinter", exactly the demos whose names hold every word, the right "N of 31", and every word lit in every row; the no-match line; Esc clears without opening the shortcuts list; Clear; a filtered row opens its demo. All passed.
- `folder_row_test.py` (20 of 20), `start_screen_check.py` and `prefs_check.py` pass.

### Discussed, not changed
- It searches file names only. A demo whose name doesn't say the teams or map (`auto_ifng-...`, say) is found by scrolling, as before (Sujan: fine).
- Also matching the map read from each demo's header, so "train" would find a Train demo with no map in its name, was offered and not taken: plain search was chosen.

## 0.15.1 (2026-10-02)

Round counting, from the accuracy check on a fresh batch of demos (IDEAS.md). The 15 new demos were compared with real results from HLTV.org; two overtime matches were counted wrong.

### Fixed
- **SK vs Na`Vi, Train, DreamHack Winter 2011 quarter-final** read SK 19:16. It now reads Na`Vi 25:23 after three overtimes, as HLTV.org reports. Two rounds were played at 15:15 on the overtime sides before the admin's "MR3 overtime is live", and they were counted as overtime; the viewer then ended the match in the first overtime. A stretch that ran past the end of a half is now cut there when the server announces a new start before the next stretch, as long as what was played past it is short of a whole new half.
- **mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final** (5 files) read Na`Vi 16:8, from file 2 alone. It now reads mTw 25:23 after three overtimes. This server's plugin starts a half with "3 restart and go !" and "Fight !!!", which weren't read as live, so rounds played between halves and before each start counted. Both now open the live window; it already closed on "End of 1st set" and "End of fight". Not confirmed online; it's what the server's own "Finale score" messages add up to (15 15, 3 3, 3 3, 2 4).
- In a joined map, a later part that starts partway through a half now counts its rounds up to its first "End of 1st set" (only the first file did this before). The OT2 file of that Tuscan starts in the first half of the second overtime.
- A round a recording starts partway into, before any player's side is recorded, now takes its sides from the next round of the same half. The OT2 file's first round went to mTw; Na`Vi won it on CT.
- mTw vs Na`Vi, Train, ESWC 2010: still 16:1, but the round played between halves (27:47) no longer counts, and the real last round (29:37) does.

### How it was tested
- Every demo on Sujan's Windows PC (31), 0.15.0 against 0.15.1 (`compare_all.sh` with `match_detail.js`): 25 identical; the 6 that changed are the ESWC 2010 Tuscan and Train files and SK vs Na`Vi, as above. The warmup-only first Tuscan file (`-1007031520-`) still reads 1 round when opened alone (no live announcement in it); joined, it counts none.
- Against real results (HLTV.org, and the demos' own end-of-match messages):

  | Demo | 0.15.0 | 0.15.1 | Real |
  |---|---|---|---|
  | SK vs Na`Vi, Train, DreamHack Winter 2011 | SK 19:16; markeloff 32-23 | Na`Vi 25:23; markeloff 50-29 (T 16-18, CT 34-11, OT 20-11) | Na`Vi 25-23 ([HLTV.org](https://www.hltv.org/news/7849/navi-in-triple-overtime-sk-win)); markeloff 50-29 (Sujan) |
  | mTw vs Na`Vi, Tuscan, ESWC 2010, 5 files joined | Na`Vi 16:8; markeloff 16-10 | mTw 25:23 in round 48; markeloff 44-29 (T 21-16, CT 23-13, OT 17-12) | markeloff 44-29 ([HLTV.org](https://www.hltv.org/news/6001/top-20-players-of-2010-markeloff-1)); score not found online |
  | mTw vs Na`Vi, Train, ESWC 2010 | 16:1 | 16:1 | "Finale score: 16 1" in the demo |

- Joined maps unchanged: Xperia Play 2011 FX vs mTw Inferno (mTw 19:17 in R36, NEO 33-28) and Nuke (FX 22:19 in R41, NEO 42-25); fnatic vs mousesports, Forge, IEM6 Global Challenge Guangzhou final (16:11, zonixx 32-17).
- K-D against numbers Sujan has (2 Oct 2026), all matching except the last two: zonixx 32-17 (Forge, IEM6 GC Guangzhou), markeloff 50-29 (Train, DreamHack Winter 2011) and 44-29 (Tuscan, ESWC 2010), edzie 29-16 (Inferno, Moscow 5 vs Na`Vi, DreamHack Winter 2011; Sujan's list says "edward"), SeDaN 28-11 (Nuke, k1ck vs Earthquake, DreamHack Winter 2011), SpawN 28-16 (Train, Sweden vs Ukraine, ClanBase NationsCup XI), Delpan 38-16 (Dust2, Sweden vs Norway, ASUS ENC 2010), markeloff 20-6 (Tuscan, Adepto BH Open 2011 final); markeloff on the ESWC 2010 Train and karrigan on the GameGune 2012 Dust2 (see below).
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py` pass.

### Discussed, not changed
- markeloff, Train, ESWC 2010 semi-final: the viewer reads 22-4, Sujan's number (HLTV.org's 2010 article) is 21-4. All 22 kills are ordinary kills in live rounds (no team kills, none between rounds). Left as the demo shows it.
- "kArRiG4N" (fnaticRC), Dust2, fnatic vs Na`Vi, GameGune 2012 final: the viewer reads 20-14, Sujan's number is 21-13. Every kill and death involving him in the 23 live rounds was listed; no choice of rounds gives 21-13. Left as the demo shows it.

## 0.15.0 (2026-10-02)

A map recorded in two or more demo files can be joined and counted as one map. Approved design: [docs/split-map-mock.png](docs/split-map-mock.png); built screens next to it: [docs/split-map-built.png](docs/split-map-built.png). Background and decisions: IDEAS.md, "Join a map split over several demo files".

### Added
- **Join the parts of a map.** HLTV often splits one map into two or more files (Xperia Play 2011 FX vs mTw: Inferno and Nuke, two files each). Joined, the parts are one map: one timeline (playback runs straight on from one part to the next, with a 3 second gap), the rounds numbered straight through and counted once (halves, overtime, stop at 16), player stats over all parts. Players are matched across files by Steam ID.
- **The load summary names another part** when one is in the folder: another demo with the same map in its header and at least 8 of the same Steam IDs (read from the first 4 MB of each file; within 6 hours of this one when both file names carry a recording time), while this one starts partway into a round, starts with rounds already on the game's scoreboard, or ends before anyone won. It offers **Join the parts**.
- **The Join card**: the parts in order with arrows to change it, a line for each part counted on its own, how the order was found (the recording times in the file names, else the only order the rounds allow, else the person sets it), and the checks: same map and server, the same players, teams swapped sides, a part that starts partway into a round (its kills count), rounds in no file, parts with no rounds. **Add another part…** takes a demo from the folder or a file from elsewhere. Another map, or fewer than 8 of the same players, is refused with a card of its own. An order the rounds don't allow (the first part must start from 0:0; only the last can have a winner) is explained, with **Keep my order** and **Use the suggested order**; Join stays off until one is chosen.
- **After joining**: a "2 files" chip in the header, "One map, joined from 2 files" in the load summary, a marker in the Rounds tab where the file changes with the part's full file name (it wraps only after a - _ or .), and a hatched row for a round in no file. **Split them** (top of the Rounds tab) undoes it. **Join with another demo…** (bottom of the Rounds tab) is there for every demo. Remembered per file: opening any part opens the joined map while every part is in the folder. Team names and Count them are kept per set of files.
- **Rounds in no file** (played between two recordings): counted in the score from the game's scoreboard at the later part's first live round, with the side that won each; not in player stats.

### Fixed
- Players joined by name only on names used in the live rounds (Sujan, 2 Oct 2026). Any name a connection ever used joined it with another, so two players who both sat on a placeholder nick ("Player") in the warmup became one person. Now a name joins two connections when one of them used it in the live rounds; a name used only outside them joins connections only when at most one of them played live (Edward on Na`Vi vs FX, Dust2, SEC 2011 final, reconnected in the warmup as "Na`Vi Edward /A/" and played as "EdwardwOw~": still one person).
- A stretch running past the end of a half is cut at the first half end after which the teams stayed on the same sides (it was the last half end it crossed). Some servers swap sides with no restart, so a half end where the sides swapped is passed over. Single demos read as before; joined, the Xperia parts' 15:15 rounds played on the same sides were being counted as overtime.

### How it was tested
- Against the numbers Sujan confirmed, joined (`tests/page/join_detail.js`, `join_rounds.js`):

  | Map | Joined | Sujan's confirmed | Before the half-end fix |
  |---|---|---|---|
  | Xperia Play 2011, FX vs mTw, Inferno (`-1104240025` then `-1104240112`) | mTw 19 : 17 Frag eXecutors, won in round 36 (second overtime); NEO 33-28 (regulation 31-24, overtime 2-4) | NEO 33-28, second half 16-11 | mTw 21 : 18, no winner; NEO 34-29 |
  | Xperia Play 2011, FX vs mTw, Nuke (`-1104240212` then `-1104240242`) | Frag eXecutors 22 : 19 mTw, won in round 41 (fourth overtime); NEO 42-25 | NEO 42-25 | mTw 15 : 19, "won" in round 34; NEO 31-19 |

- Every demo on Sujan's Mac (25; mousesports vs Virus left out, as before), 0.14.3 against 0.15.0 (`match_summary.js`): scores, live rounds, first live round, starting sides and every player's K-D identical on all 25. On the way it caught a regression in the Steam ID matching, fixed before shipping: on Na`Vi vs FX, Train and Dust2 (SEC 2011 final) every player's Steam ID is "0", which merged all ten into one. A Steam ID now counts only when it's a number other than 0 and no two connections hold it at the same time.
- The load summary line shows on exactly the four Xperia files, each naming its other half (`summary_text.js` on all 25).
- The screens in the test browser (maps and models, no sounds): Inferno part 2 opened alone, Join the parts, the order from the file names (24 Apr 2011 at 00:25 and at 01:12), part 1 moved down ("This order doesn't add up", Join off), Use the suggested order, Join them, the Rounds tab marker; the Nuke part added to the Inferno parts ("This demo is from another map"); Nuke joined from part 2, reopened from part 1, then Split them (opens part 2 alone, set forgotten) (`split_*.js`).
- A round in no file, made for the test by removing Inferno part 2's 5 kills before its first marker (`split_missing.js`): the card says "1 round isn't in any file … mTw won it"; joined, R16 is "not in any file", mTw, 7:9; still mTw 19:17 in round 36; NEO 33-27. Writing this test found that a later part starting with rounds already on the scoreboard was dropped whole; the stretch where a later part starts now counts as starting fresh.
- Two players given the warmup name "Player" on Na`Vi vs FX, Train, SEC 2011 (`placeholder_names.js`): one person on 0.14.3 (12 people, Na`Vi with 4), two on 0.15.0.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py` pass.

### Discussed, not changed
- Differences from the approved mockup: the card says playback runs straight on (it does, so there's no file switch to describe); the wrong order is explained inside the Join card rather than in a card of its own; Split them sits at the top of the Rounds tab and Join with another demo… at the bottom. Mockup correction agreed before building: Inferno part 2 starts partway into the second half's pistol round, so that round's kills are in the file and count; "1 round isn't in any file" shows only for a round with no kills in any file.
- "This recording ends before anyone won" with no other part in the folder (in the mockup) was dropped (Sujan, 2 Oct 2026). It showed on four demos and was wrong on all four: Fnatic vs mousesports, Tuscan, ESWC 2011 ended 15:15 ("End of fight - Finale score: 15 15"); mousesports vs SK, Mirage and ALTERNATE vs AGAiN, Inferno, both ESWC 2011, stop partway into their last round (at 15:5 and 15:8); Anexis vs fnatic, Tuscan, DreamHack Bucuresti 2012 holds only the overtime ("The match has been ended."). A found part is strong evidence; that line alone isn't.
- The order of 3 or more parts whose file names carry no recording time: the rounds pin only the first and last part, so the viewer makes no suggestion (Sujan's question, 2 Oct 2026). How it could chain them is parked in IDEAS.md.

## 0.14.3 (2026-10-02)

### Fixed
- Every player was drawn one snapshot behind the demo's timeline, since the first version: about a tenth of a second on HLTV demos (0.107 s between snapshots on Na`Vi vs FX, Dust2, SEC 2011; 0.063 s on FX vs mTw, Nuke, Xperia Play 2011). Movement, aim, Player's eyes, the scoreboard's health and weapons, and the positions used to re-time late kill messages (0.13.0) all read the snapshot before. Cause: when a player was first recorded, the demo reader padded their track for every snapshot so far, including the one it was about to add, so each track held one snapshot more than the timeline and everything in it sat one place late. Found while joining the two parts of the Xperia Play 2011 Inferno demo, whose tracks didn't fit the joined timeline.

### How it was tested
- The demo stores where the killer stood at every kill. Compared with the killer's track at the kill's own snapshot: before the fix it matched only when the killer stood still (112 of 212 kills on the Dust2 demo, 37 of 55 on Nuke) and matched one snapshot later every time (212 of 212, 55 of 55); after the fix it matches at the kill's own snapshot every time (212 of 212, 55 of 55). Each track is now exactly as long as the timeline.
- Every demo on Sujan's Mac (25; mousesports vs Virus left out, see 0.14.2's checklist), 0.14.2 against 0.14.3 (`tests/page/match_summary.js`): scores, live rounds, starting sides and every player's K-D identical on all 25.
- Wallbang lists, 0.14.2 against 0.14.3, with the maps loaded: identical on Na`Vi vs FX Dust2 and Train (SEC 2011 final; 10 and 13), SK vs WinFakt Mirage (IEM6 Global Challenge New York final; 2, with 86 kills re-timed) and mTw vs Lions Nuke (DreamHack Summer 2011; 17). Not re-checked: NoA vs Pentagram Train (2006), whose list depends most on re-timed kills, since that demo is only on Sujan's Windows PC.
- The crosshair at headshot kills from 300 units or more, as Player's eyes shows it (`tests/page/aim_shown_at_kills.js`, new): median distance to the victim's head before and after, Dust2 1.49° and 1.50°, Train 1.23° and 1.09°, Mirage 0.93° and 0.95°, Nuke 1.18° and 1.10°. So the offset described in 0.10.0 ("Discussed, not changed") comes from the demo, as said there, and not from this.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `modes_and_toggles.js` and `players_names_dead.js` pass.

## 0.14.2 (2026-10-02)

Round counting and player stats, from Sujan's checks of K-D numbers he knows from the real matches.

### Fixed
- Kills before the first round marker didn't count (the NEO Inferno numbers were short because of it). They now count as a round 0 put in front of round 1. Its winner comes from round 1's score (the side on 1) or from all five of one side dying.
- Team swap suicides counted as deaths. When teams switch sides, every player who changes team dies by "world" within a few seconds. Three or more self-kills within 5 seconds are now a swap, looked for across round markers (fnatic vs EG Dust2, 39:44: two land in the ended round and the third a second later in the next). A swap round with no real round before it is dropped; a real round that ended before the swap still counts.
- Rounds played past the end of a half counted when a restart and more play followed. Half ends: 15, 30, then every 3 rounds of overtime. Both Xperia Play FX vs mTw matches played on at 15:15 on the same sides (5 rounds on Inferno, 6 on Nuke), then restarted and played overtime.
- The IOL false start (SK vs Dateam Dust2): a stretch is now thrown away only when the next stretch is in the same announced window or its window wasn't closed by an end-of-half message. Two rounds in a row with no kills also end a stretch (an idle server).
- Overtime after a restart, with no admin messages: after the last live stretch, new stretches of 1 to 3 real rounds count as overtime.
- Rounds played after the match was won counted. The match now ends when a team reaches 16 with the other on 14 or less, or in overtime (MR3) at 19, 22 and so on with a 2-round lead. Rounds played after that are listed in the Rounds tab faded, tagged "after the match", with no number and no score, and don't count anywhere.

### Added
- **Count them**, per demo. Some events played all 30 rounds and counted them. A note in the Rounds tab and a line in the load summary say how many rounds were played after the match ended, with a "Count them" button (then "Stop at 16"). Counting goes up to round 30 at most and never changes overtime. The choice is remembered per demo file. While the extra rounds aren't counted, the load summary's first line gives both numbers ("Demo read: 30 rounds, 27 counted"). Approved design: [docs/count-after-16-mock.png](docs/count-after-16-mock.png).

### Changed
- Team names read as the plain team name. File names with "_vs_" or ".vs." are read as well as "-vs-" (fnatic vs EG is `fnatic_vs_EG_...`). A shared clan tag is looked up in the list of known teams, whole and then by its first part, so "SK.SWE.AMD" and "SK Gaming |" read as SK Gaming, "fnatic.MSI" and "fnaticRC" as fnatic, "mYm." as MeetYourMakers. An unknown tag stays as written, and a name typed in the header still wins. EG reads as Evil Geniuses, its full name in the list.

### How it was tested
- Against the numbers Sujan confirmed, in the test browser on his Mac files (`tests/page/match_detail.js`):

  | Demo | Viewer | Sujan's number |
  |---|---|---|
  | IOL Final4 2011, SK vs Dateam, Dust2 (`sk-vs-dateam-iolfinal4-1106181158`) | 16:4, f0rest 25-11 (T 8-3, CT 17-8) | f0rest correct |
  | Xperia Play 2011, FX vs mTw Inferno, two files (`-1104240025`, then `-1104240112`) | file 1: 6:9, NEO 15-13; file 2: 13:8, NEO 18-15 (16-11 + overtime 2-4) | NEO 33-28, second half 16-11 |
  | Xperia Play 2011, FX vs mTw Nuke, two files (`-1104240212`, `-1104240242`) | file 1: 8:7, NEO 19-9; file 2: 11:15, NEO 23-16 (12-9 + 4-4 + 7-3) | 42-25 |
  | fnatic vs EG, Dust2, EM3 Global Finals 2009 (`fnatic_vs_EG_EM3Global-0903061800`) | 11:16, f0rest (shows as iZnoGouD) 29-17 (T 15-9, CT 14-8); with Count them: 13:17, 32-19 (T 15-9, CT 17-10) | 32-19 (T 15-9, CT 17-10), all 30 rounds played |
  | iFNG FX vs fnatic, Dust2, Intel Extreme Masters, March 2011 (`auto_ifng-1103030950`) | 16:13, NEO 30-17 (T 12-9, CT 18-8) | 30-17 (CT 18-8, T 12-9) |

- The load summary, team names, Rounds note and faded rows, Count them on and off again, on the EG demo (`tests/page/summary_and_teams.js`): "Demo read: 30 rounds, 27 counted", then "30 rounds" and 13:17 with Count them, then back to 11:16 with 3 faded rows.
- Every demo on Sujan's Mac (25; the 102 MB mousesports vs Virus demo is left out, it doesn't load in the test browser), 0.14.1 against 0.14.2 (`tests/page/match_summary.js`):

  | Demo | 0.14.1 | 0.14.2 | Checked against |
  |---|---|---|---|
  | fnatic vs EG, Dust2, EM3 Global Finals 2009 | 13:17 | 11:16 (13:17 with Count them) | Sujan |
  | Xperia Play 2011, FX vs mTw, Inferno, file 1 / file 2 | 7:9 / 10:8 | 6:9 / 13:8 | Sujan |
  | Xperia Play 2011, FX vs mTw, Nuke, file 2 | 9:11 | 11:15 | Sujan |
  | iFNG FX vs fnatic, Dust2, Intel Extreme Masters, March 2011 | 17:15 | 16:13 | Sujan |
  | IOL Final4 2011, SK vs Dateam, Dust2 | 16:5, from 11:48 | 16:4, from 17:23 | Sujan |
  | Na`Vi vs FX, Dust2, SEC 2011 | 12:16 | 11:16 | the official 16-11 (known since 0.7.1) |
  | SK vs WinFakt, Mirage, IEM6 New York | 17:9 | 16:8 | HLTV.org's report of the final: 10-5 at half, then 6 rounds to 3 ([HLTV.org](https://www.hltv.org/news/7636/sk-win-iem6-gc-new-york)) |
  | Na`Vi vs FX, Train, SEC 2011 | 12:19 | 11:16 | Sujan (2 Oct 2026); not found online |
  | mTw vs Lions, Nuke, DreamHack Summer 2011 | 11:17 | 10:16 | Sujan (2 Oct 2026); not found online |
  | ESWC 2011: Moscow 5 vs Na`Vi Mirage, mouz vs SK Mirage, AGAiN vs ALTERNATE Nuke, Fnatic vs ALTERNATE Nuke | | same score, 1 to 3 players with one death less (team swap suicides) | |
  | Anexis vs fnatic Tuscan (DreamHack Bucuresti 2012), MYM vs SK Inferno (Kode5 2008) | | team names only: fnatic, MeetYourMakers, SK Gaming | |
  | The other 6 | | unchanged | |

- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, and on Na`Vi vs FX Dust2 in 3D `modes_and_toggles.js`, `players_names_dead.js` and `reset_view.js` pass. `reset_view.js` fails when run straight after the other two (they leave the view changed) and passes on its own, on 0.14.1 too.
- Fixed in the tests: `summary_open.js` no longer reopened the load summary since 0.14.0 (a closed card stays closed for that demo); it now clears that first.

### Discussed, not changed
- Count them mockup, Sujan's changes (2 Oct 2026): the load summary's first line reads "Demo read: 30 rounds, 27 counted", so the line under it ("3 rounds were played after…") has its context; the note uses the same team name as the header and the rows. Sujan asked for the plain team name ("SK Gaming", whether players wear "SK", "SK.SWE.AMD" or "SK Gaming |"), which became the team name change above.
- Rounds after the match stay faded in the Rounds tab with no round number and no running score (agreed 2 Oct 2026). Their numbers and scores show once Count them is clicked, so showing them before would only add clutter. The round time stays, so the rows can still be clicked and watched.
- Stop at 16 or play all 30: most demos Sujan has stop at 16, some events played all 30. Detecting it from the demo isn't reliable, so stopping at 16 is the default with a per-demo switch (agreed 2 Oct 2026). Sujan confirmed overtime must stay MR3 and never be treated as "play to 30".
- A match split over two files: reading the second file's starting score from the game's scoreboard doesn't work, since the scoreboard counts by side and resets at every restart (checked on the four Xperia files). Details and what could work instead in [IDEAS.md](IDEAS.md).

## 0.14.1 (2026-10-02)

Fixes from Sujan's feedback on FX vs SK Gaming on Inferno (IEM5, January 2011, `FX-vs-sk-iem5-inf.dem`).

### Fixed
- Wrong score, start and sides on that demo: it read 14:7, with the match starting at 56:54 and Frag eXecutors on CT. It now reads 16:13 to Frag eXecutors, starting at 29:15 with them on T, as Sujan knows the match. Three causes:
  - The admin announced the start as "lo3", which the viewer didn't recognise as a live announcement, so it only saw the later "live" at 56:54 (the second half). "lo3", "l03" and "live on 3" now count.
  - That second half was started, 7 rounds played, then restarted with "live now, sorry, hlsw". Before the first half, two "lo3" starts were restarted after 0 and 1 rounds. A restart puts the score back to 0:0, so inside an announced match, a stretch ended by a restart before a half is complete (under 12 rounds, or 3 in overtime) is now thrown away. Only when the next stretch starts in the same announced window: a stretch the server closed itself (end of half, or the warmup before another overtime) is kept.
  - Restarts less than 60 seconds apart were treated as one, which joined the two "lo3" starts (59 seconds apart). Any restart between two rounds now starts a new stretch.
- KUBEN listed twice. His connection drops at the start of the last round while he plays on, and the viewer started a second player for that slot. A slot whose connection has ended but is still in play now stays with its last occupant.
- "BobbaN" for RobbaN, and "iZnoGouD" for f0rest. Both renamed for fun for a few seconds in the warmup and renamed back, but the viewer kept each player's list of names without repeats and showed the last new one. A player's name is now the one they used for most of the live rounds (the demo reader records when each name was taken).
- "Frag eXecutors" still in front of every name in the Players tab: the two KUBENs would have read the same once shortened, and that turned shortening off for the whole team. Now only the players who would clash keep their full names.
- The PGL plugin's "Neither team has a 6 point lead. The overtime process will now repeat." ends the live stretch. In the Anexis vs fnatic demo a warmup round started before the "Warmup is commencing" line and was counted.

### How it was tested
- Every demo on Sujan's Mac (19) was read by the previous version and this one in the test browser, comparing the score, number of live rounds, first live round and starting sides (`tests/page/match_summary.js`).

  | Demo | Before | After |
  |---|---|---|
  | FX vs SK, Inferno, IEM5 2011 | 14:7, 21 rounds, from 56:54, FX started CT | 16:13, 29 rounds, from 29:15, FX started T |
  | Anexis vs fnatic, Tuscan, 2012 | 11:9, 20 rounds | 11:8, 19 rounds (the warmup round after the overtime message) |
  | The other 16 | | unchanged |

  The 102 MB mousesports vs Virus Inferno demo didn't finish loading in the test browser in either version (it waits 4 minutes), so it isn't compared.
- Names changed only where a player used another name during the match than the one last picked up: "f0restwOw~" is "f0rest" on mousesports vs SK, "minet" is "mTw } minet" on mTw vs Lions, "Edward" is "Edward4[a]" on Na`Vi vs FX Train.
- On FX vs SK: Frag eXecutors NEO, PASHA, taz, Loord, KUBEN; SK f0rest, RobbaN, allen, face, GeT_RiGhT. `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `players_names_dead.js` and `modes_and_toggles.js` pass.

### Discussed, not changed
- The match's online records: HLTV.org's report of FX beating SK in the IEM5 semi-final lists Train, Nuke and Dust2, not Inferno ([HLTV.org](https://www.hltv.org/news/6330/fx-beat-sk-to-move-to-iem5-final)), so this Inferno map is from another IEM5 meeting. 16:13 rests on Sujan's word and the demo's own rounds, which add up to it.

## 0.14.0 (2026-10-02)

Changes from Sujan's feedback on two de_tuscan demos (Anexis vs fnatic, DreamHack Bucharest 2012, and Lions vs mousesports, 2011) and on the free camera.

### Fixed
- Smokes that never appeared, though you could hear them (Anexis vs fnatic at 10:39, Lions vs mousesports at about 15:16). Neither demo has the grenade objects at all: of 86 smokes thrown in Lions vs mousesports, the file has 1 smoke grenade object; Anexis vs fnatic has none of its 116, and no flashbangs, HE grenades or dropped guns either. The cause is the old engine's limit of 256 objects per snapshot ([the same limit hitting HLTV demos of another game](https://github.com/ccoventry/dod-studio/issues/207)). On de_tuscan the map's own objects fill it: every snapshot of the Anexis demo lists exactly 256, the Lions demo 254 on most, against about 50 on Dust2 (65 at most) and at most 127 on Mirage. The viewer reads every object each snapshot lists (checked: the count each packet states matches what's read, in all four demos), so the grenades aren't in the file.
  - What every demo does have is the game's own smoke event, `createsmoke`. Per ReGameDLL (`CGrenade::SG_Detonate` and `SG_Smoke` in `ggrenade.cpp`) the server sends one when the smoke pops, with the cloud's centre, then one a second, 21 more, each with the same centre. That's what the game draws the cloud from. Every smoke now comes from these events: 116 of 116 on the Anexis demo, 87 on Lions vs mousesports.
  - The recorder drops some of them (they're sent unreliably), so the moment a smoke pops comes from its pop sound (`weapons/sg_explode.wav`, which carries the place) when the first event is missing. The cloud lasts 21 seconds from the pop, or until the round restarts.
  - Where the demo does have the grenade object, its flight path is drawn as before and the cloud now comes from the events: 105 of 106 smokes on Dust2 and 91 of 92 on Mirage (M5 vs Na`Vi) matched their events. On Mirage, 5 more smokes now show that were left out before because they were thrown less than 64 units.
  - HE grenades and flashbangs the demo has no object for show as a burst where they went off: HEs from the explosion effect (the game sends two per HE, the second up to 64 units off, so they're merged; the C4's is left out), flashbangs from their pop sound. No flight path, since the file doesn't have one.
- Smoke clouds were in the wrong place and sometimes started too early. The viewer put the cloud where the grenade came to rest, but after a smoke pops the game throws the can up and sideways (a random speed in `SG_Detonate`), so it lands 100 to 250 units from the cloud. On Dust2 the "came to rest" test also often fired at the moment of the throw. The cloud now sits where the smoke popped and starts when it popped.
- Free camera chosen from Player's eyes or Behind player (the button or V) jumped back to wherever the free camera was last left. It now starts at the player: from Behind player it keeps the view exactly, from Player's eyes it steps back behind their shoulder (where Behind player would be) so the player is in view. Picking the player you follow again to let go does the same. Dragging, the mouse wheel and W A S D already carried on from the view on screen and still do.
- A free camera inside a player's head (dragging out of Player's eyes) showed the inside of the model's face. A player the free camera sits inside is now hidden, as in Player's eyes.
- The load summary card came back after being closed. Closing it while it still said "Checking your files…" (×, Esc, or pressing play) lasted only until the check finished. It now stays closed for that demo. A demo that can't be played still says so.

### Changed
- Smokes are light green, in 3D, on the radar and for the flight path, so they read apart from flashbangs (white) and HE grenades (orange).
- Players tab: the clan tag most of a team shares is left off, since the team heading above already names the team. "fnaticRC kArRiG4N@$tY@" shows as "kArRiG4N@$tY@", "NoA.hpx" as "hpx", and a tag on both sides such as "Meet Neo, Your Maker" as "Neo". A tag counts when at least 3 in 5 players have it (so a stand-in doesn't stop it), and it's only cut where a space or symbol separates it from the name ("mouz|ninja" loses "mouz|", never part of the name). Players without the tag, and teams where two players would end up reading the same, keep their full names. The Kills and Wallbangs lists keep full names, since they mix both teams.
- Players tab: hovering a row shows the player's full name.
- Players tab: a dead player shows a red skull in place of their 1 to 0 key number (they can't be followed until the next round anyway), and the "dead" tag, which got cut off on long names, is gone. Hovering says "dead until the next round". Approved design: [docs/players-panel-designs.png](docs/players-panel-designs.png).

### How it was tested
- Demo data, outside the page (`tests/demo-probes`): objects per snapshot, stated against read, on the Anexis, Lions, Dust2 and M5 Mirage demos; createsmoke events, smoke pop sounds and explosion effects counted on each.

  | Demo | Smoke objects | Smokes shown | From events only | HE / flash shown, from events only |
  |---|---|---|---|---|
  | Anexis vs fnatic, Tuscan, 2012 | 0 | 116 | 116 | 117 / 235 |
  | Lions vs mousesports, Tuscan, 2011 | 1 (thrown under 64 units, so never drawn) | 87 | 87 | 109 / 261 |
  | Na`Vi vs FX, Dust2, 2011 | 106 | 107 | 1 | 0 / 0 |
  | M5 vs Na`Vi, Mirage, 2011 | 92 | 97 | 5 | 0 / 1 |

- In the page, on Sujan's files (Tuscan and Dust2 maps, player models; no weapon models or sounds, which aren't needed for these checks): the smoke at 10:39 on the Anexis demo shows in 3D, light green, popping at 10:39.4 and lasting to 11:00.5 (`tests/page/smoke_from_events.js`); on Dust2 106 smokes take their cloud from the events. The Players tab on both demos: shortened names, full names on hover, skulls for exactly the dead players, nothing cut off (`players_names_dead.js`). Free camera from Player's eyes, Behind player and V, after leaving the free camera in a far corner: starts 115 units from the player, facing their way; dragging still takes over the exact view (`free_cam_start.js`). The summary card stays closed (`summary_stays_closed.js`). `modes_and_toggles.js` and `reset_view.js` pass. `folder_row_test.py` (20 of 20), `start_screen_check.py` and `prefs_check.py` pass.
- Name shortening checked on made-up teams too: "Meet X, Your Maker" (MYM), "mousesports | x", "mouz|x" with a stand-in, "LIONS x * QPAD" with one "* KASPERSKY", and a team without tags.

### Discussed, not changed
- Flight paths for grenades the demo has no object for: not possible, the file doesn't have them. Fine by Sujan ("if the smoke does not appear in the demo then I'm fine with it not appearing").
- Strike-through for dead players' names: the skull won, since a line through names full of symbols is hard to read.

## 0.13.1 (2026-10-02)

### Changed
- The wallbang marker on the crosshair no longer has a square frame around it, here and in the shortcuts panel. Sujan asked whether there was a reason to keep it: it was a second cue besides the colour, but the marker already says WALLBANG underneath, so the frame added nothing.

## 0.13.0 (2026-10-02)

Changes from Sujan's feedback on the 2006 NoA vs Pentagram Train demo and on a POV demo he recorded.

### Fixed
- Wrong wallbangs in the 2006 NoA vs Pentagram Train demo (R4 0:50 through a smoke, R15 1:31 hpx on kubenB in plain sight, R21 1:03 with a USP, R28 1:26 LUq on zonic from the front). Cause: in that demo the kill message arrives after the kill, by 0.11 seconds on average and up to 0.33. The viewer checked walls when the message arrived, and by then a peeking AWPer was back behind cover (zonic had moved 48 units, neo 105). The victim's death sound is recorded at the real moment, so a kill whose message trails it by more than 0.05 seconds is now moved back to the killing shot (the killer's last shot up to 0.3 seconds before the death sound), or to the death sound when the demo has no such shot (LUq's AWP shot at R28 isn't in the file). Kills that arrive on time are left exactly as they were.
  - The kill feed, the crosshair marker, the timeline and the death cam use the corrected moment too. Sujan had noticed the marker lagging behind the death sound and death animation (R22 0:54).
  - How often the message is late, measured as the gap between the death sound and the kill message:

    | Demo | Average | Longest |
    |---|---|---|
    | NoA vs Pentagram, Train, 2006 (protocol 47) | 0.11 s | 0.33 s |
    | SK vs WinFakt, Mirage, 2011 | 0.00 s | 0.42 s (a few kills) |
    | Na`Vi vs FX, Train, 2011 | 0.00 s | 0.15 s |
    | Na`Vi vs FX, Dust2, 2011 | 0.00 s | 0.00 s |
    | mTw vs Lions, Nuke, 2011 | 0.00 s | 0.00 s |

    So it's the 2006 recording, not the Train map: the 2011 Train demo is on time.
- Guns that can't wallbang are never listed as wallbangs: USP, Glock, P228, Five-SeveN, Dual Elites, MAC-10, TMP, MP5, UMP45, P90, M3 and XM1014. From the game code (ReGameDLL, a reverse-engineered copy of CS 1.6's): these fire with a penetration count of 1, and the bullet code stops after the first surface (`wpn_<gun>.cpp`, `FireBullets3` in `cbase.cpp`). The Dual Elites pass the bullet type where the count goes, which works out to 1. The shotguns use `FireBullets`, which traces each pellet once with no penetration. Sujan also confirmed in the game that neo's USP kill (R21) wasn't possible.
- Copy list in the Wallbangs tab showed "?" for every victim's name.
- A demo recorded by a player (POV) was refused with "there are no player movements or rounds in it". Two causes, neither the file's fault: the viewer found rounds only through a marker that HLTV recordings carry, and it took the map from the last map the recording saw (Sujan's de_zovine demo ran 37:54 on de_zovine, then 0:04 on de_barcelona after the server changed map, so it opened as de_barcelona). Now rounds come from the round timer when there's no HLTV marker, and a recording that ran on into the next map plays the map it spent longest on. On a POV demo, every round played to a result counts (a public server has no "live on 3" to find).
- Clear saved files with a demo open left the header, side panel and timeline showing the old match. It now closes the demo too, back to a first visit.
- The countdown bar on the load summary moved in steps, 10 a second. It's now animated by the browser, smoothly.

### Changed
- Kills and Wallbangs lists: each kill on three lines, killer, then the gun, then the victim, so long clan tags are no longer cut off. The gun line has the kill feed icon from your own game files (`cstrike/sprites/hud.txt` and the `640hud*.spr` sheets it points to, read like maps and models, nothing bundled), the weapon's name, and the game's headshot icon. Without those files the row shows the name only.
- Highlights you can see. The kill you clicked in Kills or Wallbangs keeps a sand tint, a thick bar and a bookmark until you click another or open another demo; a kill playback is passing gets a lighter tint. The round playing (Rounds) and the player you follow (Players) get the strong tint. Before, all of these were a 3-pixel bar on a background two shades from the panel's, which Sujan didn't notice at all.
- The wall thickness ("Through 42 units of wall or crate") is gone from the Wallbangs rows and from the crosshair marker. It shows on hover over a row and in Copy list. Most viewers don't know what a unit is, and the number isn't something to trust on its own.
- Error messages: a demo that can't be played says what was found and lists the likely reasons, the likeliest first. A demo that changed after the folder was read (for example one still being recorded) says so, instead of "no longer in your folder".
- The load summary notes when a demo was recorded by a player, and when a recording switched maps.

### How it was tested
- The wallbang check was rebuilt outside the page and gives exactly the viewer's 12 results on the 2006 Train demo before the change. Wallbangs listed, before and after:

  | Demo | Before | After | Changed |
  |---|---|---|---|
  | NoA vs Pentagram, Train, 2006 | 12 | 9 | Removed: R4 0:51 zonic AWP on neo, R12 1:01 Paddy M4 on kubenB, R15 1:31 hpx AWP on kubenB, R21 1:04 neo USP on MJE, R28 1:27 LUq AWP on zonic. Added: R18 1:22 MJE AK on kubenB (96 units), R21 1:09 neo M4 on zonic (50 units) |
  | Na`Vi vs FX, Train, 2011 | 14 | 13 | Removed: R9 1:21 Zeus AK on PASHA (160 units) |
  | SK vs WinFakt, Mirage, 2011 | 6 | 3 | Removed: R4 0:37 face M4 on JiGetus, R9 0:50 RobbaN M4 on JiGetus, R19 1:26 i'M(BA-SiC)K FAMAS on Delpan (one added in a warmup round, not listed) |
  | Na`Vi vs FX, Dust2, 2011 | 10 | 10 | none |
  | mTw vs Lions, Nuke, 2011 | 19 | 19 | none |

  None of these is checked in the game yet; they're on the list in [IDEAS.md](IDEAS.md).
- In the page, on Sujan's files: the 2006 Train demo gives the same 9 (135 kills moved earlier, none later), all 30 kill feed icons load, the clicked row keeps its bookmark (`tests/page/kill_timing_and_lists.js`). Dust2: no kills moved, the same 10 wallbangs; `modes_and_toggles.js` and `reset_view.js` pass. The POV demo opens on de_zovine with 27 rounds and both notes in the summary, and the summary bar runs as a browser animation (`tests/page/pov_demo.js`, `summary_open.js`, `summary_read.js`). Clear saved files with Dust2 open: no demo, empty header, panel and timeline, no "Back to the demo", no page errors (`clear_saved_open.js`, `clear_saved_check.js`; it first showed a sound loader still reading the closed demo, fixed). `folder_row_test.py` (20 of 20), `start_screen_check.py` and `prefs_check.py` pass.

### Discussed, not changed
- A wall thickness limit per gun (how far a bullet can travel inside a wall) was proposed and withdrawn: the numbers first given (15, 35, 39, 45 units) are how far a bullet skips ahead after a hit, not the thickest wall it gets through, which also depends on how the engine traces from inside a wall. Not used until that's checked.
- Is it Train, the old demo or protocol 47? The late kill message is in the 2006 demo only; the 2011 Train demo is on time. Whether every protocol 47 demo does this needs a second old demo.

## 0.12.4 (2026-10-01)

### Added
- A line on the start screen, under "Everything stays on your computer": "Needs your own copy of Counter-Strike 1.6, installed through Steam." It matches the box at the top of the README.

### Checked
- Sujan confirmed the line on the live page (1 Oct 2026). His Windows screenshot from the same day also shows the 0.12.1 folder row working on his Windows game folder: "Folder selected: Half-Life, Up to date, 13 demos found" (159 maps, 56 overviews, 58 player models, 3,191 sounds).

## 0.12.3 (2026-10-01)

### Changed
- Opening another demo keeps your viewing settings and starts playback fresh. Kept: the view (2D, 3D or 3D + radar), Names, Grenades, Kill lines, See through walls, Team colours, Quality, sound and volume, and the timeline's match or round setting. Reset: speed goes back to 1x and the demo opens paused. Before, the speed carried over too (a new demo could start at 0.25x).
- Those settings are also remembered between visits, in this browser (Team colours, Quality and sound already were). "Clear saved files" leaves them alone, since they're preferences rather than files from your folder.

### How it was tested
On Sujan's files: Dust2 switched to 3D at 0.25x, playing, with Names and Grenades off, See through walls on and the timeline on round; then the 2006 Train demo opened in 3D at 1x, paused, with all of those kept (`tests/page/new_demo_settings.js`). `tests/prefs_check.py`: the defaults on a first visit, saved settings restored after a reload, and damaged saved settings falling back to the defaults. The folder and start screen checks still pass.

### Discussed, not changed
- Bullet marks: checked and parked. The demo stores each shot's spread and recoil exactly, but not where the player was aiming at the moment of the shot, so marks on walls would land 1 to 2 degrees off (a rebuilt killing bullet passes a median of about 17 units from the head on 71 headshot kills). Details, the numbers and the options considered are in [IDEAS.md](IDEAS.md) under "Kept for later"; the scripts are `tests/demo-probes/bullets*.mjs`.
- Open loose ends from this round of work (hand checks, untested demos, small decisions) are now listed in one checklist at the top of [IDEAS.md](IDEAS.md).

## 0.12.2 (2026-10-01)

### Fixed
- Reset view now works in 3D. It used to reset only the 2D radar's zoom and pan, so in 3D it did nothing. Now it goes back to the starting view everywhere: the whole radar in 2D, and in 3D the overview camera the demo opens with, as a free camera (it stops riding along in Player's eyes or Behind player; the player you were following stays highlighted). In split view both reset. Checked on Dust2 from Player's eyes, Behind player and a moved free camera, in 2D, 3D and split view (`tests/page/reset_view.js`).

## 0.12.1 (2026-10-01)

Changes from Sujan's first hands-on test of 0.12.0.

### Changed
- Changes in the folder are now picked up by themselves. Every time you come back to the page or to the start screen (at most once every 2 seconds), the viewer reads the folder again and the demo list updates. The "Changes found: 10 demos removed. Refresh to use them." note and its Refresh button are gone. Why: the note and the list disagreed (it said 10 demos were removed while all 16 were still listed), and the viewer only looked again after 30 seconds, so a second change made soon after the first wasn't seen and the note looked stuck.
- The row says "Folder selected: <name>" instead of "Half-Life folder: <name>", so it doesn't claim the folder is right before it's checked. Before a folder is chosen it explains what's expected, with an example: the Half-Life folder from your Steam install, which contains cstrike and valve, usually `C:\Program Files (x86)\Steam\steamapps\common\Half-Life` on Windows (the default install path, as given in [this CS 1.6 setup guide](https://djdallmann.github.io/GamingPCSetup/CONTENT/DOCS/GAMECONFIGS/CS16/SETUPCONFIG.html)). The same text is the row title's tooltip.
- A demo can only be opened once the folder is chosen. "Open .dem" is greyed out until then, and dropping a demo on the page asks for the folder first. Without the folder there's no map, overview, models or sound, so a demo showed players as dots on an empty grid.
- "Clear saved files" now also forgets the folder, and the start screen goes straight back to how it looks on a first visit, without a reload. Its confirm click says so ("Click again to forget the folder and delete … of saved files"). Chrome's own permission to read the folder stays until you remove it (the icon left of the address bar, then Remove access); the note after clearing says so.

### Added
- Checks on the chosen folder:
  - **Not the Half-Life folder** (red), when it has no cstrike folder inside, with what to choose instead and the example path. Nothing from it is loaded.
  - The same when the cstrike, cstrike_downloads or valve folder itself was chosen, asking for the folder one level up.
  - **No demos found** (orange), when it's the right folder but has no .dem files. Open .dem still works for demos kept elsewhere.
  - **Up to date. 16 demos found.** (green) otherwise.

### How it was tested
`tests/folder_row_test.py`, now 20 checks, all passed: first visit with the example path and Open .dem greyed out; picking; changes applied by themselves, including a second change right after the first; Reconnect; opening by itself on the next visit; a wrong folder, the cstrike folder itself and a Half-Life folder without demos; Clear saved files back to the first-visit state, also after a reload; dropping a demo with no folder; the ordinary folder pick, including a wrong folder; and the page inside a frame from another site. Also run on Sujan's real files (Dust2): the demo, map and models load through the reworked folder code.

### Discussed, not changed
- Bundling the competitive maps' radar overviews so a demo could play in 2D without the folder: ruled out. The overviews are Valve's game files (`cstrike/overviews`, about 770 KB each as .bmp), and the project doesn't host Valve's files. Even with them, it would only be dots on a flat radar, with no 3D, models or sound.
- Putting "Open a demo" first: no, the folder comes first and is now required, since everything but the demo itself comes from it.
- A downloaded index.html opened from disk keeps the folder too (checked by Sujan).

## 0.12.0 (2026-10-01)

### Added
- The viewer remembers your Half-Life folder between visits. In Chrome and Edge (122 or later) on an https page, pick it once; on the next visit Chrome asks once more, and choosing "Allow on every visit" means it opens by itself from then on ([Chrome's announcement](https://developer.chrome.com/blog/persistent-permissions-for-the-file-system-access-api)). The viewer only keeps the browser's permission to read the folder, plus the folder's name and its list of files (names, sizes and dates, never contents), in this browser.
- A permanent "Half-Life folder" row on the start screen, in place of the old step 1. It shows the folder's name and its state:
  - **Up to date.** When the page opens, anything that changed since your last visit is picked up straight away and listed ("Picked up since last time: 3 new demos, 1 removed").
  - **Changes found** (replaced in 0.12.1: changes are now applied by themselves). Coming back to the page (at most every 30 seconds) or to the start screen (at most every 5 seconds), the viewer reads the folder again. If demos, maps, models, sounds, overviews or texture files were added, removed or replaced, it lists them and offers **Refresh**. While a demo is open, a short note says so too. Refreshing reloads any changed model, sound or the current map.
  - **Reconnect,** when Chrome wants your OK again (you chose "Allow this time" last visit).
  - Elsewhere (Firefox, Safari, the claude.ai copy), the row keeps the folder's name and asks you to choose it again for this visit; once chosen, it still says what changed since last time.
- The "Choose Half-Life folder" buttons in the 3D view and the load summary become "Refresh Half-Life folder" when the folder is remembered.

### Changed
- Choosing or refreshing the folder now reads it afresh, so files deleted since the last pick drop out of the lists. Before, maps, models and sounds from an earlier pick stayed listed.

### How it was tested
`tests/folder_row_test.py`, 13 checks, all passed: first visit, picking the folder, changes found while the page is open (3 new demos, 1 removed, 1 model replaced) and Refresh, Reconnect on the next visit, the folder opening by itself on the visit after with its changes applied, the ordinary folder pick with its "since last time" summary, the name remembered for the next visit, and the page inside a frame from another site (like the claude.ai copy) falling back to the ordinary pick. Chrome's real folder picker and its prompts can't be operated in the headless test browser, so those checks use a stand-in for Chrome's folder access. Checked by hand by Sujan (1 Oct 2026): on GitHub Pages Chrome's prompt says "view files", and a downloaded index.html opened from disk keeps the folder across reloads. Still to check by hand: Reconnect and "Allow on every visit", which only appear after every tab of the site was closed (a reload keeps Chrome's access: it lasts "until you close the last tab of the origin", per Chrome's announcement).

Also run on Sujan's real files (Dust2, Na`Vi vs FX): the demo, map, textures, overview and models load through the new folder code with no page errors (`tests/page/modes_and_toggles.js`, which no longer clicks the Smooth aim button removed in 0.10.0). And the 2006 Team3D vs Fnatic demo on Train, for 0.11.1: the file says protocol 47, it reads with zero errors, 30 live rounds.

### Discussed, not changed
- Changes found when the page opens are applied without a click (it's a fresh start anyway); changes found while it's open wait for Refresh, so the list doesn't shift under you. Agreed 1 Oct 2026.
- GitHub Pages (https://deswalsujan.github.io/cs16-demo-viewer/) is live since 1 Oct 2026 and updates on every push, so the folder can be remembered without waiting for sujandeswal.com.

## 0.11.1 (2026-10-01)

### Added
- A note on the start screen and in the README that the viewer plays old protocol 47 demos, which the Steam version of CS 1.6 won't open. Sujan confirmed it with a 2006 demo.
  - CS 1.6 recorded demos as protocol 47 until the update of 23 October 2008, which moved the game to protocol 48. HLTV.org warned beforehand that all older demos would stop playing ([22 Oct 2008](https://www.hltv.org/news/1779/cs-16-update-coming-soon)), then reported on release day that a 47 demo can be converted by editing the protocol number in the file, and that it would convert its archive ([23 Oct 2008](https://www.hltv.org/news/1787/cs-16-update-live)). So "protocol 47" means anything recorded before late October 2008, not only 2005-2006 as first thought.
  - That today's Steam version still refuses them rests on those posts and Sujan's own test; no recent source says so directly.
  - The viewer reads the protocol number from the file header but doesn't check it, so it reads both kinds the same way.

### Fixed
- `tests/start_screen_check.py` had a broken first line and didn't run.

## 0.11.0 (2026-10-01)

### Added
- "See through walls" (H), replacing "Names through walls". Players behind walls are drawn on top of the walls as see-through bodies in their team colour (red for Terrorists, blue for Counter-Terrorists), with their names. Players in plain sight look as usual. Made for admins checking suspected wallhackers: follow the suspect in Player's eyes with it on, and watch whether their crosshair tracks enemies they can't see. It works whether or not names are shown. There's no distance limit: far-away players are small on screen anyway, and a wallhacker can track people anywhere.
  - "Behind a wall" uses the same line-of-sight check as the names: from the camera to the player's head and feet, through the map and its doors and breakables. Each player is re-checked about 10 times a second, so a body can take up to a tenth of a second to switch when someone steps out of cover.
  - Checked on Dust2 (round 4, Player's eyes): 7 players were behind walls, and those 7, and only those, were drawn through the walls.
- "Team colours", replacing the "Player models" button. It draws the real player models in flat red (Terrorists) and blue (Counter-Terrorists), with their shading kept, so the sides read at a glance. Weapons keep their normal look. Off by default; the choice is remembered.

### Changed
- The simple figures (the capsule shapes) are no longer a choice. They're used automatically for any player whose model file is missing or can't be read, as before. Checked by removing the model files: all 10 players switched to figures.

### Discussed, not changed
- What "units" are: the game's measure of distance, roughly an inch each. A standing player is 72 units tall and 32 wide, a crouching one 36 tall. "Through 16 units of wall" in the Wallbangs tab means about 16 inches of cover.
- Measuring wallhacks automatically (how long a player's crosshair stays on enemies hidden behind walls) is parked in [IDEAS.md](IDEAS.md).

## 0.10.1 (2026-10-01)

### Changed
- The sniper scope now looks like the game's: thin black lines, six mil-dots along each half of both lines, and a red dot in the middle. Two other styles stay in the code, unused, so either can be switched on later without a menu option: "clean" (lines and red dot, no mil-dots, so dots never cover a dark player model) and "lines" (lines only, as in 0.10.0). They're shown side by side in [docs/scope-designs.png](docs/scope-designs.png); the switch is `SCOPE_STYLE` in `src/view3d.part.js`.

### Removed
- The no-scope and quick-scope labels on sniper kills, added in 0.10.0. An HLTV demo stamps the zoom click and the shot to its snapshots, about a tenth of a second apart, so it can't tell a real quick-scope (right-click immediately followed by left-click) from a scope that was just a little quicker than usual. Karrigan's two "quick-scopes" on Tuscan (round 12) are a case in point: the zoom click and the shot landed in the same snapshot. A search for an established cut-off turned up nothing measured: no AMX Mod X plugin found that detects quick-scopes in CS 1.6 (the AlliedModders threads on quick-scope plugins are for CS:S and CS:GO and couldn't be opened), only config scripts and memes. Viewers judge for themselves by watching the scope come up before the shot.

### Discussed, not changed
- Accuracy over looks, for both the crosshair and the scope: the viewer shows what the demo recorded and what the game shows, even where a tidier version would read better (no snapping the crosshair onto the victim at a kill, and the game's own scope with mil-dots).
- A choice of scope styles in the menu: decided against for now, as it would clutter the menu for little gain.

## 0.10.0 (2026-10-01)

### Added
- Sniper scope in Player's eyes. When the player you follow zooms in with an AWP, Scout, G3SG1 or SG550, the view narrows to the game's zoom (AWP: 1x and 2x) and shows the scope: black around a round lens with crosshair lines across it, and no gun in hand.
  - HLTV demos don't record zoom: the only zoom messages in the file are for the HLTV recorder itself, and none of the player fields the demo stores changes when someone zooms (checked on Tuscan: of the 766 zoom clicks, the closest-matching field lines up with just 1). What the demo does record is the zoom click sound the game plays on every right-click with a sniper rifle, with the time and the player. The scope is rebuilt from those clicks.
  - The rules, as the game applies them and confirmed in the demos: each click steps the zoom (none, 1x, 2x, none). An AWP or Scout shot drops the zoom while the bolt cycles, and it comes back by itself at the same level: between consecutive AWP shots on Tuscan, 27 of 28 times there was no click and no weapon switch. Switching weapons drops the zoom: 18 of 19 single clicks between shots followed a weapon switch (the knife quick-switch). Dying and a new round drop it too.
  - Checked against kills: 20 of 24 sniper kills on Dust2 and 48 of 60 on Tuscan have a zoom click by the killer in the 3 seconds before; the rest were zoomed in earlier than that.
- No-scope and quick-scope labels on sniper kills (removed in 0.10.1, see there), in the Kills list and on the crosshair kill marker. No-scope: not zoomed in when the shot was fired. Quick-scope: zoomed in at most 0.3 seconds before the shot (a first guess, open in [IDEAS.md](IDEAS.md) until checked against real kills). Clicks and shots are stamped to the demo's snapshots, about a tenth of a second apart, so a zoom-in and its shot can land in the same snapshot; the scope then shows for 0.1 seconds before the shot, so a quick-scope is visible instead of lasting zero frames, and the kill still counts as a quick-scope.

### Removed
- "Smooth aim". The whole story:
  - **The problem.** HLTV demos store about ten snapshots a second (every 107 ms on the Na`Vi vs FX Dust2 demo). Up to 0.7.1 the viewer joined them with straight lines and didn't fill in up and down aim at all, so Player's eyes stuttered.
  - **What 0.8.0 did.** Two things. First, movement and aim follow smooth curves that pass exactly through every recorded snapshot, up and down aim included, using evened-out snapshot times. Second, "Smooth aim" (on by default): the camera trailed the recorded aim by about 30 ms (an exponential lag with a 30 ms time constant), snapping straight to the aim after a jump of more than 0.3 seconds, a new player or a camera switch.
  - **What each part was worth.** Over six 10-second stretches at 60 frames a second, aim jolts went from 691 (0.7.1) to 487 with the curves alone, and 465 with Smooth aim on top. The biggest jolt went from 15.1° to 6.4° with the curves, and 4.0° with Smooth aim. Up and down aim stopped freezing (3,124 frozen frames down to 80). So the curves did almost all the work, and Smooth aim only softened fast flicks. Sujan saw no difference at normal speed.
  - **Why it was removed.** It's artificial: it shows the aim where it was about 30 ms ago, not where it was. During a fast flick of 300° a second, the crosshair sits about 9° behind the player's real aim, exactly at the moments that matter most here: judging a flick, a quick-scope or a suspicious lock-on through a wall. The curves stay, because they pass through every recorded snapshot exactly and only fill the gaps, which the old straight lines also had to guess. An accurate view beats a slightly smoother one, and the 3D bar has one button less.

### Discussed, not changed
- Crosshair not on the victim at the moment of a kill (Sujan spotted it on PASHA's kills on EdwardwOw~ and Zeus, and markeloff's on 742, Dust2 round 25). Checked on Dust2:
  - **Not a viewer bug in camera height or aim.** Across 63 headshots from more than 300 units away, the aim at the kill landed on average 0.5° below a guessed head centre and 0.3° to the side, with misses scattered both ways (half within about -1.8° to +0.7° up and down). A wrong eye height or pitch would push every miss the same way by a similar amount.
  - **It's how HLTV records.** The demo stores aim and positions about ten times a second, and a shot falls between two of those snapshots, so the kill shows up at the next one. A victim moving at 140 units a second moves 14 units, half a body width, in a tenth of a second. On top of that, the shooter's game draws enemies about 0.1 seconds in the past (ex_interp), and the server checks the hit against that older position, while HLTV stores the server's current one. Moving victims back in time didn't close the gap consistently, so that isn't the whole story either.
  - **The viewer adds a little.** Its in-between curve can shift the aim at the kill moment slightly either way (for example markeloff's AWP kill on PASHA in round 10: on target in the stored snapshot, 1.2° off in the viewer; other kills move the other way). Neither is the true moment of the shot, which the demo doesn't contain.
  - **Why it looks big through a scope.** At the AWP's 1x zoom, 1° is about 40 pixels on a laptop-sized view, against about 17 without the scope.
  - Left as it is. Worth checking one of these kills in the game's own demo player, which is expected to show the same offset.

## 0.9.3 (2026-10-01)

### Fixed
- Theatre and Full screen could be clicked on the start screen before any demo was open. They're now greyed out until a demo is open, like the other controls.

## 0.9.2 (2026-10-01)

### Changed
- Theatre mode: the header, side panel and bottom bar now come in and go out together. Moving the mouse to the top, right or bottom edge brings back the normal layout; moving back to the middle hides it again. Before, each edge brought in only its own panel, which made the panels overlap and was one more thing to learn. Dragging to look around or pan the radar still never brings them in.
- The score in the round pill is hidden while the header is showing, so it doesn't appear twice.

### Discussed, not changed
- Showing each panel on its own edge versus all together: all together matches what video players do and what Normal mode looks like, so it's one thing to learn and nothing can overlap. The trigger stays at the edges rather than any mouse movement (as YouTube does), because dragging to look around is the main thing the mouse does here.

## 0.9.1 (2026-10-01)

### Fixed
- Theatre mode: reaching for the side panel's tabs (Rounds, Kills, Players, Wallbangs) also brought in the header, and the panel covered it. While the mouse is on the side panel, header or bottom bar, the other edges no longer pull theirs in. The side panel now sits between the header and the bottom bar, as in the normal layout, so all three can be open together without covering each other (the header's Theatre, Full screen and Open another demo buttons stay reachable).

## 0.9.0 (2026-10-01)

### Added
- Theatre mode (T, or the Theatre button in the header): the view fills the whole window, with no header, side panel or bottom bar. Move the mouse to an edge for the controls on that side (changed in 0.9.2: all of them come in together).
  - The controls float over the view, so the view never changes size when they come and go.
  - They stay while the mouse is on them (or a menu from them is open), even if the mouse stops moving, and hide shortly after it moves away. Near an edge but not on the bar, they hide after 2 seconds without the mouse moving.
  - Dragging to look around in 3D, or to pan the radar, never pulls them in, even when the drag ends at an edge.
  - The round pill also shows the score and team names, since the header is hidden. The kill feed, round pill, player name strip and split-view radar move out of the way of whichever bar is showing.
  - The mouse pointer hides after 2 seconds without moving.
- Full screen (F) now uses Theatre mode. Leaving full screen puts back the layout you had before.
- The start screen ("Open another demo") shows the normal layout; going back to the demo returns to Theatre mode.

### How it was tested
A script drove a real mouse and keyboard through 39 checks on five screen setups: a 14-inch and a 13-inch MacBook (Retina, 2x), and a Windows screen at 100%, 125% and 150% scaling (the Windows display setting). Among the checks: the view fills the window exactly, each edge brings in its own controls, the view keeps its size when they appear, a bar that slides in under a still mouse stays, timeline scrubbing works and keeps the bar, drags don't pull bars in, full screen switches Theatre mode on and back off, and no page errors.

Results on the final build: the 13-inch Mac, Windows 100% and Windows 125% passed all 39. Windows 150% passed all 39 on the build just before the last fix (that fix only ignores pointer events where the mouse didn't move) and wasn't rerun.

One check failed only in the test browser on the 14-inch Mac setup (1512 × 982 at 2x): with the mouse resting just below the header, the header stayed up instead of hiding after 2 seconds. Checked by hand on a real MacBook on 1 Oct 2026: the header hides after about 2 seconds as it should. The failure came from the test browser, which draws 3D without a graphics chip and was too slow at that screen size.

Two things found and fixed while testing: a bar that slid in under a mouse that wasn't moving used to hide after 2 seconds even with the pointer on it, and Chrome's "moves" sent when something slides under a still mouse used to restart the hide countdown.

### Discussed, not changed
- The name: "raw" was considered but could be read as "raw aim", next to the Smooth aim button. Theatre mode it is.
- Normal, Theatre and full screen: Normal shows everything. Theatre hides the viewer's own header, side panel and bottom bar but keeps the browser's tabs and address bar. Full screen is Theatre mode with the browser's top bar gone too. In the claude.ai artifact, Theatre fills only the artifact's area.

## 0.8.0 (2026-10-01)

### Changed
- Smoother playback, most of all in Player's eyes. HLTV demos store about ten snapshots a second (every 107 ms on the Na`Vi vs FX Dust2 demo), and the viewer used to join them with straight lines, which turned corners with a jolt at every snapshot. Movement and aim now follow smooth curves through the snapshots around each moment. The curves never swing past a snapshot, so a player who stops dead or turns back doesn't overshoot.
- Up and down aim is now filled in between snapshots too. Before, it held still and then snapped to the next snapshot, which was most of the stutter in Player's eyes.
- The demo stamps its snapshots a little unevenly (a 156 ms gap followed by a 68 ms one while the player runs at a steady speed). Filling in between snapshots now uses evened-out times, which removes most of that wobble. Kills, sounds and every other event keep their exact times.
- Less work per frame: names are checked for being behind walls about ten times a second instead of every frame, grenades, smokes, kill lines and death marks are reused instead of rebuilt every frame, the timeline is drawn once and only the playhead moves, and the page no longer re-reads its font from the styles on every frame.

### Added
- "Smooth aim" in the 3D bar (on by default; removed in 0.10.0, see there for why): in Player's eyes the view trails the recorded aim by about 30 ms, which takes the edge off the jolts the snapshots still leave. It snaps straight to the aim after a jump in time, a new player or a camera switch. Turn it off to see the recorded aim exactly.
- "Quality" in the 3D bar: high draws the 3D view at the screen's full sharpness (up to 2x on Retina and other high-density screens), low draws fewer pixels than the screen for slower machines, and auto (the default) starts at high and steps down to 1x if the 3D view averages under 45 frames a second for a few seconds. The choice is remembered.

### How it was measured
Six 10-second stretches of the Na`Vi vs FX Dust2 demo (rounds 1, 4, 11, 15, 21 and 28, each following the busiest living player in Player's eyes), stepped at exactly 60 frames a second in a headless browser, recording the camera on every frame. A "jolt" is a frame where the camera's turning or movement changes more than a set amount from the frame before (0.5 degrees for aim, 0.5 units for movement).

| | 0.7.1 | 0.8.0 |
|---|---|---|
| Aim jolts (of 3,594 frames) | 691 | 465 |
| Biggest aim jolt, top 1% | 6.2° | 2.5° |
| Biggest aim jolt | 15.1° | 4.0° |
| Frames where up/down aim didn't move at all | 3,124 | 80 |
| Movement jolts | 353 | 218 |
| Biggest movement jolt | 4.4 units | 1.9 units |
| The viewer's own work per frame in Player's eyes (3D drawing not counted) | 4.9 ms | 1.9 ms |

With "Smooth aim" off, 0.8.0 still has 487 aim jolts and a biggest jolt of 6.4°; the curves do most of the work and Smooth aim takes off the rest. Frame times are from a headless browser that draws 3D in software, so only the before and after comparison means anything, not the numbers themselves.

### Discussed, not changed
- Smooth aim made no visible difference at normal speed in Sujan's first look. It's meant to be subtle: it shows on fast flicks, best at 0.25x or 0.5x. Removed in 0.10.0: see there for the reasons.
- How "Quality: auto" decides: it starts at the screen's full sharpness (2 screen pixels per point each way on a Retina Mac), counts frames every 3 seconds while the 3D view is showing, and if that's under 45 a second it drops once to 1 pixel per point and says so. It ignores one-off freezes and hidden tabs, never raises sharpness again by itself, and does nothing on a normal (non-Retina) screen. "Low" draws 0.75 pixels per point, which is why the gun looks soft there.

## 0.7.1 (2026-10-01)

### Fixed
- Wrong scores when the second-half warmup was played as real rounds. mousesports vs AGAiN (Inferno, ESWC 2011 final) showed 15-15 over 32 rounds; it now reads 16-11 to mousesports over 27, and Fnatic vs mousesports (Tuscan) 15-15 instead of 16-15. When the server's admin plugin announces "Live !", "End of 1st set" or "Current set canceled", the viewer now uses those to decide which rounds count. Checked round by round against the plugin's "Current score" messages on all three test demos (Nuke, Tuscan, Inferno): every score matches. Demos without such messages still use the restart-based guess, which now also drops a short warmup stretch at half time.
- Players who died showed as alive again in the Players tab a few seconds later (for example PASHA, 742 and ninja at 23:00 on Inferno). The demo stops sending a dead player's body after a moment, and that gap was read as alive.
- Inferno's lamp posts showed as brown wooden pillars. Each lamp has an invisible box around it for players to bump into; the viewer drew that box. Entities with a see-through render mode and no amount set are now invisible, as in the game.
- The Inferno vent showed as a slatted box. Map faces are now drawn one-sided like the game, so the vent's sides hidden inside the wall no longer show.

## 0.7.0 (2026-10-01)

### Fixed
- Doors are no longer treated as always closed. The demo records where every door is and how far it's turned, and the viewer now uses that: open doors (either way) no longer count as cover in the wallbang finder, and in 3D doors open and close as they did in the match. Applies to every door, including the Nuke rotating door, the Tuscan A site door and the Inferno blue door. On Fnatic vs ALTERNATE (Nuke) 7 false wallbangs through the open door are gone; on Fnatic vs mousesports (Tuscan) 3, including both round 14 kills at 1:05. Kills through the Nuke glass doors while they're shut still count.
- First-person weapons are held in the right hand, like CS 1.6's default. The stock model files are left-handed, and the game mirrors them.
- The start screen scrolls on smaller screens, so the demo list, messages and "Clear saved files" are always reachable.
- Opening a demo that was deleted or moved after choosing the folder no longer hangs on the progress bar. It says the file is gone, takes it off the list, and asks to choose the folder again.

### Added
- Coming back to the page checks the listed demos are still in the folder, and takes any that were deleted or moved off the list with a note.
- The load summary warns when files in the Half-Life folder changed on disk after the folder was chosen (for example when copying the folder over again), names a few, and offers "Choose Half-Life folder". Until then the viewer uses the copies this browser saved, where it has them.
- Dead players are greyed out in the Players tab with a "dead" tag and can't be picked (or jumped to with 1 to 0) until the next round. Clicking one says why.
- Clearer notes in the load summary: where the radar overview files belong, and how many of the missing sounds are weapon sounds.

## 0.6.0 (2026-10-01)

### Changed
- The load summary is now a card in the middle of the view instead of a note in the corner. It opens with "Checking your files…" as soon as the demo is read, then lists each check with a tick, a warning or a cross, and what it means for playback (for example "Those players show as simple figures").
- A headline on the card says whether the demo will play: "Ready to watch", "The demo will play, with a few gaps", "The demo will play, in 2D only", or "This demo can't be played".
- The card closes on its own: after 6 seconds when everything loaded, 15 seconds when there are gaps. A bar and "Closes in N s" count down. Moving the mouse over the card pauses it. The × button, Esc, clicking outside the card, or pressing play closes it straight away. A "can't play" card stays until closed.
- Custom models are listed on their own line in the card (they're used, just flagged).
- Files that aren't demos, and demos that are cut off, now explain why in plain words instead of showing a technical error.

## 0.5.0 (2026-09-30)

### Added
- Version number in the shortcuts panel and on the start screen, with links to this changelog and to report a bug.
- "Copy debug info" in the shortcuts panel: browser, screen, graphics card, demo name and length, what loaded, read errors and page errors, ready to paste into a bug report. It never includes file contents.
- A short summary after a demo opens: map and textures, overview, player models, weapon models and sounds found, custom models by name, and files that couldn't be read. Custom models are spotted by comparing each file's fingerprint with the stock CS 1.6 files.
- "Clear saved files" on the start screen deletes the maps, models, sounds and overviews this browser saved. It asks for a second click first.
- Bug report and idea templates on GitHub.

## 0.4.0 (2026-09-30)

### Changed
- Players are drawn with the model named in their player info, the same one the game uses. Before, some players showed the wrong model (for example all of Na`Vi in the same skin on Mirage).
- "Names through walls" is off by default.
- The "where players stand" heatmap only counts time when the round is being played: freeze time, the seconds after a round is won, and match pauses are left out, so spawns no longer show as hot spots.
- Heatmap options renamed to say what they show: "where players died", "where kills were made from", "where players stand".
- Cached maps are rebuilt once after this update (for the fence fix), so the first open of each map takes a little longer.

### Added
- Full screen button in the header, and F to toggle it.

### Fixed
- Fences and grates rendered with a purple tint.

### Discussed, not changed
- Heatmap and players shifting back and forth while holding a spot. The "where players stand" map samples every player twice a second and spreads each sample over a small area, so small movements in one spot already add up into a single hot spot. No extra handling needed for now; revisit if a real case shows otherwise.

## 0.3.0 (2026-09-30)

### Added
- First-person weapons in Player's eyes view: draw, shoot, reload, grenade throws and bomb plants, worked out from the demo. USP and M4A1 show with or without the silencer.

### Changed
- Volume slider follows loudness in decibels, the far left is mute, finer steps, and a limiter stops bursts from clipping.
- The GitHub Pages copy is hidden from search engines for now (a "noindex" tag, set in `build.py`). Remove it when the viewer moves to sujandeswal.com.

### Fixed
- Practice rounds before a "live on 3" were counted as part of the match (Moscow 5 vs Na`Vi on Mirage showed 1:3 at the real round 1). It now reads 16-9 to Na`Vi, matching the result posted on [HLTV's match page](https://www.hltv.org/matches/1901911/natus-vincere-vs-moscow-five-eswc-2011) (ESWC 2011).

## 0.2.0 (2026-09-30)

### Added
- Real player and weapon models in 3D, read from your Half-Life folder. Legs run with the movement, the upper body aims where the player looks, shots and reloads animate, and bodies stay on the floor until the round ends. "Player models" toggle to switch back to simple figures.
- Sound from your game files: gunshots, footsteps, reloads, hits, grenades, bomb and radio lines, placed around the listener. Speaker button, volume slider, M to mute.
- The start screen reports how many player models and sounds it found in your folder. Models and sounds are cached in the browser like maps, so later visits can open a demo without picking the folder again.

## 0.1.0 (before 2026-09-30)
- 2D radar, textured 3D and split view; free, eyes and chase cameras; kill timeline with wallbangs, bomb plants and pauses; round, kill and player stats; wallbang finder with copyable timestamps; grenades and smokes; heatmaps; hold-Tab scoreboard with spectators and HLTV audience; kill markers and death cam; breakable vents and glass.
