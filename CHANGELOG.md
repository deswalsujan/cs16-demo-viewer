# Changelog

What changed in the viewer, newest first. The version shows in the viewer's shortcuts panel (press ?) and on the start screen. Code locations in entries up to 0.25.1 are as they were before the `src/ui/` split of 29 Oct 2026 (pull request #10); the current map is in AGENTS.md, "Where the code is". The index below has one line per version; from 0.26.0 on, each release's full test log is in `tests/logs/<version>.md`.

## Versions

- [0.26.4](#0264-2026-11-01) 2026-11-01: Numbers on every wallbang kill
- [0.26.3](#0263-2026-11-01) 2026-11-01: Damage numbers with the kill feed
- [0.26.2](#0262-2026-10-30) 2026-10-30: three.js built into the page
- [0.26.1](#0261-2026-10-30) 2026-10-30: Loose wallbang rounding fix
- [0.26.0](#0260-2026-10-30) 2026-10-30: Sliver kills; railings aren't cover
- [0.25.1](#0251-2026-10-29) 2026-10-29: Source on GitHub link
- [0.25.0](#0250-2026-10-29) 2026-10-29: POV mode setting in main
- [0.24.0](#0240-2026-10-28) 2026-10-28: Wallbang damage, loose from damage
- [0.23.0](#0230-2026-10-25) 2026-10-25: Strict and LOOSE wallbangs
- [0.22.2](#0222-2026-10-24) 2026-10-24: Two kills at one moment
- [0.22.1](#0221-2026-10-23) 2026-10-23: Lamp posts and fence holes
- [0.22.0](#0220-2026-10-23) 2026-10-23: Wallbang and skip fixes
- [0.21.1](#0211-2026-10-15) 2026-10-15: Wallbangs list times line up
- [0.21.0](#0210-2026-10-15) 2026-10-15: C4 countdown, skip tags
- [0.20.0](#0200-2026-10-14) 2026-10-14: Skips found more reliably
- [0.19.1](#0191-2026-10-14) 2026-10-14: Skip note before the skip
- [0.19.0](#0190-2026-10-14) 2026-10-14: Skips in the recording marked
- [0.18.1](#0181-2026-10-14) 2026-10-14: A shorter 3D bar
- [0.18.0](#0180-2026-10-14) 2026-10-14: Panel clicks, slow motion, timers
- [0.17.0](#0170-2026-10-05) 2026-10-05: Round announcements, C4 and kits
- [0.16.0](#0160-2026-10-03) 2026-10-03: Broken demos play, camera fixes
- [0.15.5](#0155-2026-10-02) 2026-10-02: Wallbang damage rule, kill timing
- [0.15.4](#0154-2026-10-02) 2026-10-02: Debug info names demo kind
- [0.15.3](#0153-2026-10-02) 2026-10-02: Zalando Sans font
- [0.15.2](#0152-2026-10-02) 2026-10-02: Search your demos
- [0.15.1](#0151-2026-10-02) 2026-10-02: Round counting fixes
- [0.15.0](#0150-2026-10-02) 2026-10-02: Join a map's parts
- [0.14.3](#0143-2026-10-02) 2026-10-02: Players no longer drawn late
- [0.14.2](#0142-2026-10-02) 2026-10-02: Round counting and player stats
- [0.14.1](#0141-2026-10-02) 2026-10-02: FX vs SK score, names
- [0.14.0](#0140-2026-10-02) 2026-10-02: Smokes and cameras, Tuscan feedback
- [0.13.1](#0131-2026-10-02) 2026-10-02: Plainer wallbang crosshair marker
- [0.13.0](#0130-2026-10-02) 2026-10-02: Wallbang fixes, POV demos open
- [0.12.4](#0124-2026-10-01) 2026-10-01: Start screen: needs CS 1.6
- [0.12.3](#0123-2026-10-01) 2026-10-01: Viewing settings remembered
- [0.12.2](#0122-2026-10-01) 2026-10-01: Reset view in 3D
- [0.12.1](#0121-2026-10-01) 2026-10-01: Folder row after first test
- [0.12.0](#0120-2026-10-01) 2026-10-01: Half-Life folder remembered
- [0.11.1](#0111-2026-10-01) 2026-10-01: Protocol 47 demos note
- [0.11.0](#0110-2026-10-01) 2026-10-01: See through walls, Team colours
- [0.10.1](#0101-2026-10-01) 2026-10-01: Scope like the game's
- [0.10.0](#0100-2026-10-01) 2026-10-01: Sniper scope in Player's eyes
- [0.9.3](#093-2026-10-01) 2026-10-01: Theatre off on start screen
- [0.9.2](#092-2026-10-01) 2026-10-01: Theatre mode bars and score
- [0.9.1](#091-2026-10-01) 2026-10-01: Theatre mode side panel fix
- [0.9.0](#090-2026-10-01) 2026-10-01: Theatre mode and full screen
- [0.8.0](#080-2026-10-01) 2026-10-01: Smoother playback
- [0.7.1](#071-2026-10-01) 2026-10-01: Scores, deaths, Inferno props fixed
- [0.7.0](#070-2026-10-01) 2026-10-01: Doors, right-handed guns, start screen
- [0.6.0](#060-2026-10-01) 2026-10-01: Load summary card
- [0.5.0](#050-2026-09-30) 2026-09-30: Version, debug info, summary
- [0.4.0](#040-2026-09-30) 2026-09-30: Player models, heatmap, full screen
- [0.3.0](#030-2026-09-30) 2026-09-30: First-person weapons
- [0.2.0](#020-2026-09-30) 2026-09-30: Real models and sound
- [0.1.0](#010-before-2026-09-30) before 2026-09-30: First version: radar, 3D, kills

## Known limits
Moved to [LIMITS.md](LIMITS.md) on 30 Oct 2026; release entries below still say "Known limits" for that list.

## 0.26.4 (2026-11-01)

### Fixed
- **Damage numbers on every wallbang kill**: 115 of the 634 wallbang kills on the 64 test demos showed no numbers in the 3D view (62 strict, 52 loose from damage, 1 loose). Their hits through cover came to under 35 HP, and the 35 HP minimum dropped them after the kill had been tied to them, so the killing bullet's own number and ✕ were skipped too: starix on RobbaN (Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known, R14 0:26), 12 HP through cover and the 7 he had left, was one (Sujan, 31 Oct 2026). The 35 HP minimum now holds only for damage that didn't kill, so the DAMAGE rows, the **Damage** filter and the timeline's damage marks are as before (Sujan, 1 Nov 2026).

### How it was tested
- `regress_summary.js` (with `compare_all.sh`) on the 64 demos, 0.26.2's build against this one: the 115 bursts added, each ending in its wallbang kill; no wallbang, score or K-D changed. `page/wb_no_numbers.js` (new): 115 kills with no numbers before, 0 now.
- `ground_truth_check.py` (0 mismatches, 7 known gaps) and the other six checks pass on Sujan's Mac.
- Full log: `tests/logs/0.26.4.md`.
### Discussed, not changed
- Showing only the killing bullet on such kills: it would hide the hit through cover that makes 52 of them loose from damage (Sujan, 1 Nov 2026, approving the plan).

## 0.26.3 (2026-11-01)

### Fixed
- **Damage numbers on time**: the numbers, the killing bullet's ✕ and **Glow on hits** come at the moment itself, with the kill feed and the hit sounds, in place of 0.1 s later with the rest of the 3D view (Sujan, 31 Oct 2026). They still sit on the player as the 3D view draws him, so at a kill the ✕ shows beside the victim for a tenth of a second before he falls.
- **The kill feed** is brought up to date every frame, not every 0.1 s with the rest of the HUD, so a kill shows in it in the same frame as its ✕ (Sujan, 1 Nov 2026); before, it could come up to 0.1 s late.

### How it was tested
- `page/hit_numbers_timing.js` (new) on k1ck vs eq, Nuke, DreamHack Winter 2011 and Na`Vi vs FX, Dust2, SEC 2011: on every kill played, the ✕ comes in the same frame as the kill feed; on 0.26.2's build it came 0.1 s after the kill on every one.
- `ground_truth_check.py` (0 mismatches, 7 known gaps) and the other six checks pass on Sujan's Mac.
- Full log: `tests/logs/0.26.3.md`.
### Discussed, not changed
- Kill rings and kill lines in the 3D view stay on the 3D view's time, 0.1 s behind (Sujan asked for the numbers and the ✕).

## 0.26.2 (2026-10-30)

### Changed
- **three.js is built into the page**: r128, from `src/vendor/three.min.js` (the same file as cdnjs's and npm's `three@0.128.0`, by SHA-256), in place of the script from cdnjs, so the viewer keeps working if cdnjs changes or goes down, and a saved copy of `index.html` opens without internet. The fonts still come from Google Fonts (self-hosting stays parked until the move to sujandeswal.com). The page is about 600 KB larger.
- The tests serve that file to older builds (`THREE_JS` defaults to it), and the Python packages are pinned in `tests/requirements.txt`, which `check.yml` installs (Playwright 1.60.0, the Mac's; GitHub had 1.64.1).

### How it was tested
- `start_screen_check.py` (in `check.yml`) now refuses every outside request but Google Fonts: it fails on 0.26.1's build and passes on this one.
- `ground_truth_check.py` (0 mismatches, 6 known gaps) and the other six checks pass on Sujan's Mac; `check.yml` passes with the pinned packages.
- Full log: `tests/logs/0.26.2.md`.
### Discussed, not changed
- Serving three.js as its own file beside `index.html` (the brief's other choice): a saved copy of `index.html` would then need the file next to it, so it's built in. With nothing loaded from cdnjs, `integrity` and `crossorigin` aren't needed.

## 0.26.1 (2026-10-30)

### Fixed
- **Loose wallbangs from damage**: the 0.5 s window allows a millisecond more, since the demo's times are 32-bit floats. Darky's kill on n0rx (k1ck vs eq, Nuke, DreamHack Winter 2011, R15 C4 0:10), with his hit through cover 0.500244 s before, now reads LOOSE WB, as Sujan answered (30 Oct 2026). One more kill changed with it: starix on RobbaN (Na`Vi vs SK, Inferno, recorded 24 Oct 2011, event not known), R14 0:26, AK, now loose from damage.

### How it was tested
- `regress_summary.js` (with `compare_all.sh`) on 64 demos, 0.26.0 against this build: the two kills above changed, nothing else.
- `ground_truth_check.py`: 0 mismatches, 6 known gaps, PASS. The other six checks pass on Sujan's Mac, `panel_click_check.py` after a fix to the test itself.
- Full log: `tests/logs/0.26.1.md`.
### Discussed, not changed
- Kills the sight points call hidden read strict under 50 pixels, sliver kills only at 0 (0.26.0); whether 0 should be the line for both is in IDEAS.md for later, to be checked against Sujan's answers (Sujan, 30 Oct 2026).

## 0.26.0 (2026-10-30)

The sliver kills (Sujan, 30 Oct 2026; the measurements are in IDEAS-ARCHIVE.md, "Sliver kills", and his answers in `docs/review-answers.md`, "Wallbang sliver check").

### Changed
- **Wallbangs**: a kill where some of the finder's 15 sight points see the victim, but the crosshair line goes through cover, now also gets the picture check from the killer's eye, and with under 50 pixels of him in view it's listed: strict at 0 pixels, LOOSE from 1 to 49 (Sujan's split, 30 Oct 2026, in place of option A's LOOSE for all, which he picked first). The points can see a sliver that isn't there: on markeloff's AWP kill on Delpan (SK vs Na`Vi, Train, DreamHack Winter 2011, R40 1:25), which markeloff's own POV video shows was through cover, the 4 clear points sit 3 to 6 units off Delpan's body. Two guards (Sujan, 30 Oct 2026): the kill's positions within 32 units of the snapshots the picture is drawn from, and the damage rule hidden kills already have. A kill already loose from damage stays so. Hovering a LOOSE one's tag says some of the finder's sight lines reach him and how many pixels show. On the 50 test demos this adds 19 wallbangs, 13 strict and 6 LOOSE (M4A1 6, AK 6, Deagle 3, AWP 3, FAMAS 1), each with its numbers.
- **Railings aren't cover** in the picture check: what the map draws but bullets pass at full damage (a `func_illusionary` in a see-through render mode: de_train's and Inferno's railings, Inferno's vines, Nuke's wires) is left out of the picture, as the sight lines already left it out (Sujan, 30 Oct 2026). GeT_RiGhT's kill on markeloff through the highway slope's railing (SK vs Na`Vi, Train, DreamHack Winter 2011, R31 C4 0:09) shows 2,054 pixels of markeloff and stays a normal kill. No wallbang on the 50 test demos changed with it.

### How it was tested
- `regress_summary.js` (with `compare_all.sh`) on the 50 test demos, 0.25.1 against this build: 19 wallbangs added (13 strict, 6 LOOSE), none removed or changed; scores, live rounds, kills and K-D identical.
- `ground_truth_check.py`: 223 kills and 27 scores and K-D on 45 demos, 0 mismatches, 7 known gaps, PASS; 11 of Sujan's 13 answers on these kills pass.
- The other six checks pass on Sujan's Mac; `index.html` matches a fresh build.
- Full log: `tests/logs/0.26.0.md`.
### Discussed, not changed
- **Option A** (every sliver kill under 50 pixels LOOSE) fit 5 of Sujan's 13 answers; the split fits 11. Options B (the same kills, read strict) and C (only where the killing bullet is the killer's only hit, 12 kills) weren't picked.
- **A Nuke vent as cover for the first bullet through it** (Sujan's note on the sliver check, 30 Oct 2026) was withdrawn the same day: breakable surfaces (vents, glass, shutters) are never cover, even for the bullet that breaks them, as since 0.22.0; an unbreakable one, such as the semi-glass door at Nuke's lower site, stays cover even where the player shows through it (Sujan, 30 Oct 2026). Nothing in `tests/expected/` relied on the exception.

## 0.25.1 (2026-10-29)

### Added
- **Source on GitHub** on the start screen, after the version in its footer ("Version 0.25.1 · Source on GitHub"), linking to https://github.com/deswalsujan/cs16-demo-viewer in a new tab, in the link colour of the shortcuts panel's **What's new** and **Report a bug**. **Clear saved files** stays where it was. No mockup: one link in an existing line (Sujan, 29 Oct 2026).

### How it was tested
- The footer measured and screenshotted in the headless browser at 1440, 375 and 320 px wide: on one line with the button at 1440 px; at 375 and 320 px the button wraps under the version and the link, which stay on one line; nothing overlaps and the page doesn't scroll sideways. Screenshots checked by eye.
- `start_screen_check.py` now also checks the link (address, new tab, `rel="noopener"`, its words) and the footer at 375 px; it fails on the 0.25.0 build and passes on this one. `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass on Sujan's Mac; `python3 build.py && git diff --exit-code -- index.html` is clean.

## 0.25.0 (2026-10-29)

POV mode comes into main behind a **POV mode** setting, off by default (Sujan, 29 Oct 2026; work item 6.5). It was built on `wip/pov-mode` from 3 Oct 2026 in its own copy of the viewer (IDEAS-ARCHIVE.md, "In progress: POV mode", has every part and how it was tested there) and is ported onto main's code by hand, without merging or rebasing that branch, which stays until Sujan deletes it (deleted by Sujan, 30 Oct 2026). With the setting off, every demo plays exactly as in 0.24.0, a POV demo's recording player at the map's zero point included (Sujan, 29 Oct 2026). It turns on by default for POV demos once Sujan signs it off.

### Added
- **POV mode** in **View settings** ("for demos recorded by a player"), a checkbox saved like the others, off on a first visit. A POV demo's load summary says whether it's on, and while it's off has a **Turn on POV mode** button. Changing it with a POV demo open opens that demo again at the same moment. No mockup (Sujan, 29 Oct 2026).
- With it on, a POV demo plays as the branch built it: the recording player where he really was (from his own state; the snapshots never carry it), his own view about 80 times a second with his recoil and zoom, locked to what his game showed (his eyes, the death camera behind his body, then whoever he watched), his crosshair opening with his shots at 70% of the game's size in his `config.cfg` colour, his gun's own recorded animations, his HUD in the game's sprites, the spectator bars, shot sounds from where they were fired and his own shots, teammates' HP, no player numbers, and the note when the server held enemies back.
- Kills by or on him get his position before the late-kill retiming, the wallbang finder and the picture check read them (52 of 52 on Match 1 joined, CT and T).
- Joining the parts of a POV map keeps all of it, each part's recording player on his own stretch.

### Changed, in POV mode only
- What POV mode gets of the HLTV viewer's changes since 0.16.0 (Sujan, 29 Oct 2026: all of them, except where the plan said otherwise): round announcements, kits and the carried bomb in 3D, on the Tab scoreboard and on the radar (when his game had them), kill feed icons, short names, the C4 countdown above the view and in the spectator bars, the 0.22.0 rules for cover, strict and LOOSE wallbangs, light purple for loose.
- The exceptions: his own crosshair, so **View settings** hides the Crosshair size there; no wallbang damage, and so no loose wallbang from damage (the server sends a player only his teammates' health), so **View settings** hides **Glow on hits** there too (Sujan, 29 Oct 2026) and the Wallbangs list's **Damage** filter says why on hover; the kill marker's ticks start past his crosshair's arms as it opens and closes; no ring around the victim while the view is in someone's eyes. His view, gun, crosshair and HUD stay on the moment itself, and the other players are drawn 0.1 s behind it as in the HLTV viewer, Sujan's pick of 29 Oct 2026 (measurements below).
- The HUD's round timer follows the timer messages (Sujan, 29 Oct 2026): hidden from the plant's BombDrop message, as the game's client hides it, and back with the next RoundTime message, which a ReGameDLL server with `mp_show_bomb_timer 1` sends right after the plant with the C4's time left (ReGameDLL `wpn_c4.cpp`, `ggrenade.cpp` and `player.cpp`, read 29 Oct 2026). Before, the branch hid it at every plant.
- The hidden-enemies note writes **See through walls** in bold, where it had single quotes.

### How it was tested
- **The reader**, `tests/demo-probes/reader_compare.mjs` (new): 0.24.0's reader (`0de2f7f`) and this one on 61 demos, every field compared value by value. The 54 HLTV demos (the 38 in the Mac's Half-Life folder and 16 from `~/Downloads/test demos` and `~/Downloads/test-demos-2`, listed in `tests/README.md`) are identical. The 7 POV demos are identical in every field 0.24.0 returns; the new reader adds `povData` and the recorder's position on kills by or on him (Match 1 T, public server, de_barcelona, 27 Mar 2025: 55,960 view frames, 8 kills by him and 2,582 shots with a spot, as the branch measured, and 6 kills on him). None of the 7 POV demos has a slow-motion stretch.
- **With POV mode off**, `tests/compare_all.sh` (now runs on macOS) with `tests/page/regress_summary.js` (new: score, live rounds, kills, every player's K-D, every wallbang with its tag once the picture check is done, every damage burst with its shooters) on the 0.24.0 build and this one, the same 61 demos (the 7 POV demos too, with the setting off): 61 of 61 identical (45 from the Half-Life folder, 16 from the two test folders, through an APFS clone of the folder with those 16 demos in it, which takes no disk space). Every run loaded its map and finished the picture check. Compared: 15,855 kills, 820 players' K-D, 610 wallbangs (410 strict, 200 loose, 177 of those from damage) and 1,016 damage bursts. A first run differed only in a timing field the script returned, since dropped.
- **With POV mode on** (`harness.py` has a `POV_MODE` setting now), the branch's scripts, copied to `tests/page/`, on Match 1 CT and T and Match 3 (public server, css_cache, 28 Jul 2022), with screenshots checked by eye. They give the branch's results: view about 82 frames a second; at his gun kills his aim a median of 0.86° (Match 1 T, 8 kills), 1.98° (Match 1 CT, 23) and 2.27° (Match 3, 33) from the victim's head; the view on him in every sample while alive (752, 1,602 and 4,097); shot sounds 2,582 from the message's spot, 847 from the shooter and 11 skipped (Match 1 T), his own 361 shots; the crosshair through his 30-shot spray on Match 1 CT at 0:28 gap 4, 12.1 after 4 shots, 15 at the last, 4.9 half a second later; the death camera then first person on shizznit after 4.4 s (T) and 5.2 s (CT); the HUD at 0:30 on Match 1 CT health 41, armor 70 with helmet, M4A1 16 | 90; the spectator bars and the note (50 enemy sightings against 5,266 for teammates). One count differs by a few samples: after his deaths the view is in a player's eyes in 493 of 611 samples on Match 1 T (the branch had 490) and 937 of 1,089 on Match 1 CT (919). The Mac's folder has no `cstrike/config.cfg`, so his crosshair's colour was checked only with the defaults.
- `tests/page/pov_setting.js` (new) on Match 1 T: the load summary's line and **Turn on POV mode** with the setting off; the button opens it again in POV mode at the same moment, the camera buttons and arrows gone, **View settings** down to Team colours, Quality and **POV mode**. Screenshot checked.
- Match 1's CT and T files joined in POV mode: 167,586 view frames (both files), his track real in both parts and never at the zero point while alive, 52 kills by or on him, all with a position.
- **The 0.1 s question**, `tests/page/pov_lag_compare.js` (new): at his gun kills, his aim against the victim drawn at the moment and 0.1 s before it, on the kills where the victim has a position at both moments (129 kills on the 7 POV demos). Median off at 0 and 0.1 s: Match 1 CT 1.49° and 1.56° (18 kills), Match 1 T 1.49° and 1.45° (6), Match 2 CT (public server, de_mirage_32, 27 Mar 2025) 2.40° and 2.20° (14), Match 2 T 1.53° and 1.35° (8), Match 3 1.47° and 1.48° (23), Match 4 (public server, de_nuke32, 24 Aug 2021) 2.23° and 2.53° (35), Match 5 (public server, de_nuke32, 25 Aug 2021) 2.97° and 3.28° (25). Kill by kill, 47 are closer at 0 s, 55 at 0.1 s, 27 the same. Neither lines up clearly better; Sujan picked 0.1 s (29 Oct 2026).
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py` (now also: **POV mode** off on a first visit), `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass on the 0.25.0 build, on Sujan's Mac (Playwright in a virtual environment outside the repo, 29 Oct 2026); `python3 build.py && git diff --exit-code -- index.html` is clean.

### Discussed, not changed
- **The 0.1 s delay in POV mode**: the other players stay 0.1 s behind, as in the HLTV viewer, Sujan's pick of 29 Oct 2026; measurements under "How it was tested".
- **His exact aim for the wallbang finder**: his kills are judged with the snapshots' aim, as on the branch. The aim in his own frames, about 100 times a second, could judge them more precisely ("POV demos" in the archive); not done.

## 0.24.0 (2026-10-28)

Wallbang damage, Sujan's level 3 of wallbang, and loose wallbangs found from the demo's damage. Built and checked as a trial on branch `wip/wallbang-hits` (26 to 28 Oct 2026, its own page https://claude.ai/artifact/APnX9iobz6AAEDFsGaAe9L), then merged.

### Added and changed
- **Wallbang damage found in the viewer** (`computeHits` in `src/template.html`, grown from the prototype `tests/page/wb_hits.js`, which it now supersedes): hits through cover that didn't kill, grouped in bursts (each hit within 2 s of the last), listed from 35 HP with every shooter's share; a burst ending in a wallbang kill joins it. Each health drop is paired with its hit sound, the earliest unused one up to 0.4 s before it (in some demos the health follows the sound by 0.1 to 0.33 s, several readings at once: tyloo vs mTw, Nuke, e-Stars Seoul 2009, R15, zonic; NoA vs Pentagram, Train 2006, R10, neo), and judged at the sound's time; a death reading takes its own sound, so the kill's headshot sound isn't given to the hit before it. Enemies whose fire events the demo left out compete when they aim within 32 units (Go's spray on zonic, R15 27:45, has one fire event in two seconds: GoodRifle, 76 units off, had taken his headshot; now Go has all of it, 42 HS, 10, 10, and the kill for 38). Falls (a drop on landing after 100 units or more) and grenade blasts are left out, and so is damage a wall can't let through.
- **Wallbangs list**: filters **All · Strict wb · Loose wb · Damage**, each with a tooltip; rows tagged STRICT WB, LOOSE WB or DAMAGE; under the gun the health taken and the hits it took ("88 HP (1 HS, 4 hits)"), on every wallbang kill too (Sujan, 26 Oct 2026), a kill with no hit through cover before it showing the killing bullet alone ("5 HP (1 hit)"), and teammates' share on a line of its own (Sujan, 26 Oct 2026: "Xi '2q' Wang 49 before" was cut off at "War"). "Hits" are the bullets other than headshots (Sujan, 26 Oct 2026). A damage row opens the burst 3 s early through the main shooter's eyes. Copy list adds the damage rows. In the Kills list a loose kill reads LOOSE WB, a strict one keeps WALLBANG.
- **Timeline**: damage as hollow diamonds in the damage colour.
- **On the player hit, in 3D** (option C, chosen by Sujan 26 Oct 2026; A, his label, and B, a chip, dropped): each hit's damage floats up beside his head and fades in 0.9 s ("−49 HS", "−12"), above the crosshair's arms when it would touch them. **Glow on hits** in **View settings**, a checkbox, on by default: a short pink glow at each hit through a wall, the killing bullet too (Sujan, 26 Oct 2026). Through a player's eyes or from behind him, only his own hits show their numbers and glow (Sujan, 26 Oct 2026: in whimp's view at R23 1:10, tyloo vs mTw, Nuke, e-Stars Seoul 2009, four other players' hits showed); in Free view everyone's.
- **3D timing like the game** (Sujan, 26 Oct 2026, no switch): the 3D view runs 0.1 s behind the kill feed, timers, sounds and radar, as the game's demo player seems to (Dosia's kill on cArn, fnatic vs Moscow Five, Nuke, DreamHack Summer 2011, R2 1:13: the game shows cArn in the doorway at the kill feed). The wallbang finder and the picture check still judge at the killing shot.
- **Crosshair sizes moved down a step** (Sujan, 26 Oct 2026: large was too big): large is the old medium, medium the old small, small is new (arms 3 to 8 px). A size saved before keeps its look (old small reads medium, old medium and large read large); with none saved it's large, the old default look.
- **Loose wallbangs found from damage** (Sujan, 28 Oct 2026, from his check of 165 kills on the check page https://claude.ai/artifact/AijsuFRmrrp6CDMcoNFoqH: 156 loose, 9 not sure, none no). A kill the 15 points see, with the killer's crosshair line through cover, is a loose wallbang when a bullet of the killer's landed 0.5 s or less before the kill with less damage than his gun does in the open at that distance for that hit sound (`openLow`, the game's numbers from ReGameDLL; only a surface explains it). Not counted: an unsure shooter, a teammate of the victim who fired at him then, or another player on the line (a bullet through a player isn't a wallbang, Sujan 28 Oct 2026; cArNaGe on STRIKE, Sweden vs Ukraine, Train, ClanBase NationsCup XI). A hit matched by the killer's aim alone (demos that lose fire events) counts, since the kill confirms he was shooting at him (Sujan's yes, 28 Oct 2026). Kills where the bullet through cover came earlier, or the killing bullet was in the open, stay normal kills (Sujan: same spray only). Those hits join the kill's burst, so it shows its numbers; the hover on LOOSE WB gives the bullet ("12 HP where his gun does at least 27 in the open").
- **Loose wallbangs in light purple** wherever they're marked (Sujan, 28 Oct 2026: easier to tell from a strict one): the crosshair marker in Player's eyes, now labelled LOOSE WB, the ring around the victim, the kill line, the timeline diamond, the kill mark on the floating numbers, the death banner ("loose wallbang") and the shortcuts panel, which explains LOOSE WB. Strict wallbangs stay pink.
- **Kill mark on the killing bullet** (option A, Sujan 27 Oct 2026): its floating number is the health he had left, so it ends in a pink ✕ ("−8 HS ✕"); whimp's "−8 HS" on Go (tyloo vs mTw, Nuke, e-Stars Seoul 2009, R23 1:09) read like an 8-damage headshot. Option B (✕ with no number) was the other one shown.
- **Enemies with no fire event at a hit only compete in demos that lose fire events** (27 Oct 2026, from Sujan's b11 "not sure" and his catch on EneRyYyYy). The finder counts, per demo, how many gun kills have the killer's fire event at the kill: 94 to 100% in the 2010 and 2011 Nuke demos (k1ck vs eq, DreamHack Winter 2011: 193 of 193), 47 to 71% in the 2008 and 2009 ones (tyloo vs mTw: 114 of 235; mousesports vs SK, Extreme Masters II: 125 of 266; SK vs eSTRO, WCG 2008: 155 of 217). At 90% or more, an enemy merely aiming at him can't take a hit; below, he can as before (Go on zonic still has his 42 HS). Fixed in k1ck vs eq, Nuke, DreamHack Winter 2011: szrtech's burst (R25 1:24) is back, 63 HP (coachi 9, 9, spekz 9, mUtcb 36 HS; n0rx, aiming 9 units off, hadn't fired: his first shot came 0.09 s later); EneRyYyYy's "78 HP (1 HS)" from coachi (R26 1:30) is gone: fox's FAMAS fired it (from 708 units a FAMAS headshot on a helmet does exactly 78; coachi's M4 from 799 would do 84, and coachi's first shot came 0.6 s later), and it was in the open (more than a FAMAS does through a wall); fox's own 9 and 9 through the wall make 18, under 35. Other bursts it changes are under "How it was tested".

### How it was tested
- Level 2 measured, 27 Oct 2026 (Sujan's GO, after cArn's bullets): `seen_through_cover.js` (new) on the 50 demos, run on the Linux VM on Sujan's Mac (`compare`-style, 3 at a time, a few minutes). 799 kills where the 15 points see the victim and the crosshair line goes through cover. A bullet of the killer's that only a surface explains (less than the gun does in the open at that distance, for that hit sound; shooters unsure, grenade blasts, falls and possible teammate hits left out): 167 within 0.5 s of the kill, 47 earlier, 11 more where the killing bullet itself was in the open (he had more health left than a surface lets through). No proof: 474. Killing bullet in the open: 100. The model checked against 2,171 hits on 6 demos (`__calib`): clear-line hits peak where the game code says, cover-line hits at about half. Listed on the check page https://claude.ai/artifact/AijsuFRmrrp6CDMcoNFoqH (every bullet per kill; Sujan's answers in its store, collection `answers`).
- Loose wallbangs from damage, 28 Oct 2026, on the Linux VM on Sujan's Mac: `v024_dmgloose.js` (new) on the 50 demos: 168 loose wallbangs from damage (566 wallbangs: 393 strict, 173 loose), every one with its numbers; 166 of them are the kills `seen_through_cover.js` puts in the same spray (2 more where computeHits finds the shooter and the probe doesn't; 2 of the probe's left out, where the shooter aimed more than 64 units off). Of Sujan's answers, 128 he called loose are listed, and 3 of his 9 not sure (NIKO on LoordB, FX vs Lions, Nuke, R10 0:22; hool on fR11, Fnatic vs ALTERNATE, Nuke, R20 0:40; markeloff on NEO, Na`Vi vs FX, Dust2, SEC 2011, R4 0:47). k1ck vs eq, Nuke, DreamHack Winter 2011: 8, among them spekz on DECE (R2 1:18, 16 HP at -0.09 s where the AK does 25 in the open, numbers 65 HP). `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass; no page errors on the 50 demos.
- Light purple for loose, 28 Oct 2026: `loose_colours.js` (new) on k1ck vs eq, Nuke, DreamHack Winter 2011, R2 1:18, spekz on DECE: the LOOSE WB tag reads rgb(201, 163, 232) and the kill mark on the numbers is light purple (screenshot); strict kills unchanged.
- Wallbang damage, 26 Oct 2026: `v024_hits.js` on FX vs Lions, Nuke, DreamHack Winter 2010: 27 bursts (14 with a kill, 8 of them the killing bullet alone), 13 damage rows; filters 28, 14, 1, 13; every kill row with its numbers; Xizt's burst (R18 0:55) 88 HP, 49 HS, 12, 12, 12 and the kill for 3, "(1 HS, 4 hits)"; screenshot of the numbers in Player's eyes. `burst_dump.js` (new): zonic, tyloo vs mTw, R15: Go 42 HS, 10, 10 and the kill; neo, NoA vs Pentagram, R10: no damage burst (Paddy's five hits were in the open, see IDEAS.md). `hit_probe.js` (new, 26 Oct 2026): every health reading, hit sound and fire event around a kill, for checking numbers by hand: tyloo vs mTw, R23 1:09, whimp on Go: 9 by zonic, then two helmet sounds on Go from whimp (47 to 8, the kill), so 39 HS and the kill for 8; R25 1:22, whimp on 2q: 2q at 20 HP from 8 s before, then 9, 9 and the headshot for the last 2. `hits_view.js` (new): whimp's eyes at R23 1:09, only his numbers and the glow on the killing bullet; the Wallbangs row for Go on zonic with "Xi '2q' Wang 49 before" on its own line. `v024_lag.js`: at the kill message the camera reads Dosia's aim from 0.1 s before (179.00) with the kill feed showing. `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.
- Kill mark and fire-event rule, 27 Oct 2026, on the Linux VM on Sujan's Mac (`CHROME` set to a Chromium from GitHub): `bursts_all.js` (new) on the 8 Nuke demos before and after the change. Unchanged: the three that lose fire events (tyloo vs mTw; mousesports vs SK; SK vs eSTRO `-0811082043-`), mTw vs Lions, DreamHack Summer 2011, and FX vs mTw, Xperia Play 2011 (`-1104240212-`). Changed: k1ck vs eq, as above, plus fox's 72 HP from DECE (R5 1:28, 58 HS and 14) gone (DECE's nearest fire event was 77 s before), fox's burst from SeDaN (R15 1:11, b12, which Sujan answered real at 77 HP) back to 77 from 44, and fox's 40 HP with the kill (R26 1:29) now the killing bullet alone (SeDaN's 9 had no fire event); fnatic vs Moscow Five, Nuke, DreamHack Summer 2011: Fox's 46 HP (R5 1:29) now 36, one 12 given to Gux^pingu, who fired, in place of Xizt, who didn't; FX vs Lions, Nuke, DreamHack Winter 2010: kHRYSTAL's burst from NEO (R18 0:46) 63 HP from 51 (a hit that tied with an aiming enemy now goes to NEO). Of the 24 bursts Sujan checked, only b11 and b12 change, both toward his answers. `fire_check.js` (new) gives the fire-event counts above (and NoA vs Pentagram, Train 2006: 147 of 213). `round_hits.js` (new) for szrtech, EneRyYyYy and cArn. Screenshots: whimp's eyes at R23 1:09 with "−8 HS ✕"; mUtcb's eyes at R25 1:24, k1ck vs eq, with "−36 HS" on szrtech. `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.
- Before the merge, 28 Oct 2026: `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass on the 0.24.0 build.

### Discussed, not changed
- **Dosia on cArn** (fnatic vs Moscow Five, Nuke, DreamHack Summer 2011, R2 1:13) stays a normal kill: his four bullets were 30, 22, 37 and the kill; 30 and 37 are more than an M4 does after a surface at 757 units, and 22 fits a leg in the open. No bullet that must have gone through, as Sujan saw in the game's demo player.
- **Kills where the bullet through cover came earlier** than 0.5 s before the kill, or where the killing bullet itself was in the open, stay normal kills (Sujan, 28 Oct 2026: the same spray only). On the 50 demos about 40 and 10.
- **A bullet through another player** isn't a wallbang (Sujan, 28 Oct 2026). A hit with a player on the line is left out of the proof.
- **NEO on Edward** (Na`Vi vs FX, Dust2, SEC 2011 final, R23 1:09): Sujan saw NEO reloading at a hit the first probe gave him; the demo has no shot of NEO's there (that demo loses fire events) and no reload sounds, so it can't say. Outside the same spray, so not a loose wallbang either way.
- Found while checking: the short names leave a bracket, "[fnaticMSI.cArn]" reads "cArn]" (fnatic vs Moscow Five, Nuke, DreamHack Summer 2011). In IDEAS.md, not fixed yet.

## 0.23.0 (2026-10-25)

Sujan's three levels of wallbang (24 Oct 2026), the first two: a kill by a bullet through cover is a wallbang whether or not part of the victim was in view. Line decided from a pixel count, as Sujan asked (25 Oct 2026: "do a pixel count first and based on the results accordingly make a recommendation and apply it").

### Changed
- **Wallbangs where part of the victim was in view are listed again, tagged LOOSE.** 0.22.0 dropped a wallbang when 100 or more pixels of the victim showed from the shooter's eye at the killing shot. The count now splits instead: under 50 pixels it's a strict wallbang (nothing of him in view), 50 or more a loose one, kept in the Wallbangs list with a LOOSE tag (in the Kills list beside WALLBANG), the pixel count on hover, and "LOOSE: part of him in view" in Copy list. The heading says how many of each. Example: FX vs Lions, Nuke, DreamHack Winter 2010, R13 1:19 NIKO on LoordB (124 pixels) is back as LOOSE; R22 0:47 THREAT on LoordB (38) is strict.
- **Why 50.** The count on 50 demos (the 34 in Sujan's Half-Life folder and 16 HLTV demos from his two test folders): of 398 kills the finder's 15 points call wallbangs, 364 show 0 pixels, 13 show 1 to 49, 5 show 50 to 99, 16 show 100 or more. Sujan's answers of 24 Oct 2026 had 742 on gob b (49) hidden, and Xizt on ED1K (53), pita on zonixx (67), minet on ceh9 (69) and Edward on 742 (98) in view, so 50 fits 5 of his 7 close calls. It misses NEO on ArcadioN (FX vs mTw, Nuke, Xperia Play 2011, R11 0:41, 74), which he finds hidden, and gob b on Xizt (fnatic vs mousesports, Forge, IEM6 Guangzhou, R14 1:05, 223). A line at 1 (strict only at 0) would miss 742 on gob b as well. The 12 kills at 100 or more that Sujan checked were all in view, so they read LOOSE.
- The shortcuts list explains LOOSE beside WALLBANG · HS.

### How it was tested
- `v022_seen.js` on 0.22.2 over the 50 demos for the count above (`compare_all.sh`, now with `JOBS` and `TIMEOUT` settings for a small machine: 2 at a time, about 14 s a demo).
- `v023_levels.js` (new) on the same 50: 398 wallbangs listed (382 in 0.22.2: the 16 at 100 pixels or more come back), 377 strict and 21 LOOSE; every LOOSE kill tagged in the Wallbangs list and in its Kills list row, no strict one tagged, none at 50 pixels or more left strict. Screenshot of the Wallbangs list on FX vs Lions checked.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.

### Discussed, not changed
- **Sujan's question on the kill feed: no delay** (`tests/demo-probes/kill_moments.mjs`). In these demos the killing shot, the last hit, health 0, the death sound and the kill message share one snapshot, and the viewer starts the kill feed, the death animation and the picture check there. Details in IDEAS.md, "Three levels of wallbang".
- The level 3, wallbang damage that didn't kill, is next: mockups first (IDEAS.md).

## 0.22.2 (2026-10-24)

### Fixed
- **Clicking one of two kills that happened at the same moment picked the other one.** The Kills list found the clicked kill by its time, and kills that arrive in one snapshot share it, so the first of them won: FX vs Lions, Nuke, DreamHack Winter 2010, R20 C4 0:05, NEO's wallbang on NIKO showed KUB3N's view, as KUB3N killed Xizt in the same snapshot (Sujan, 24 Oct 2026, with a screenshot). Rows now carry the kill's place in the list. The Wallbangs list had the same code, and only looked right because one of the two was a wallbang.

### How it was tested
- `v022_same_time.js` (new) on FX vs Lions, R20: clicking KUB3N's row and NEO's row in the Kills list picks each kill and follows its own killer; NEO's row in the Wallbangs list follows NEO.
- `v021_skip_tags.js` and `v021_time_cells.js` as before; `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.

### Discussed, not changed
- **Sujan's check of 0.22.0 and 0.22.1, 24 Oct 2026** (34 cases on the review page https://claude.ai/artifact/Y4V77jgiF3SEb79HJfLVKu; full results in IDEAS.md): the lamp posts (3), the window (1), the skips across a round restart (5) and the small fixes (6) all right. Of the 13 wallbangs the picture check dropped, 12 right; gob b on Xizt (fnatic vs mousesports, Forge, IEM6 Guangzhou, R14 1:05, 223 pixels) he finds hidden at the moment of the kill. Of the 6 closest calls it kept, 4 had the victim in view (53 to 98 pixels), so the 100-pixel line is too high. Left as it is for now: Sujan proposes three levels of wallbang instead (IDEAS.md), which would turn the line into a split rather than a cut.

## 0.22.1 (2026-10-23)

### Fixed
- **Wallbangs through Inferno's lamp posts.** The post you see is a func_illusionary, which bullets pass through; around it sits an invisible func_wall of the same size, which bullets hit. 0.22.0 stopped the invisible box counting as cover anywhere, so a victim fully hidden behind a post and shot through it lost his wallbang: ave on PASHA, FX vs mTw, Inferno, Xperia Play 2011, R9 0:53. The finder now judges sight and bullets separately: the lines to the victim's body count what's drawn (the post hides him, the invisible box doesn't), and the crosshair line counts what a bullet hits (the box stops it, the post doesn't). mooN on Zeus (ALTERNATE aTTaX vs Virtus.pro, Inferno, Extreme Masters II, R8 0:48) stays dropped: Zeus stood beside the post, in view. See through walls also treats the posts as hiding a player now.
- In the picture check, the holes of a fence, grate or ladder are filled only when bullets hit it (Sujan: fences count as cover). Railings and vines that bullets pass through (func_illusionary) stay see-through, as in the game. ALTERNATE aTTaX vs Virtus.pro, Inferno, Extreme Masters II, R10 1:02, paN's AK headshot on Edward: Edward's head shows through the balcony railing above the plank floor paN shot through (856 pixels), so it's no longer listed.

### How it was tested
- Wallbang lists with the maps, 0.22.0 against 0.22.1, on the 29 Dust2, Inferno, Mirage and Tuscan demos of Sujan's Half-Life folder and test folders (the maps with drawn-only brushes; Nuke, Train and Forge have none and are unaffected): 27 identical; ave on PASHA back; paN on Edward removed. Both pictures checked by eye.
- 0.22.0 against main (0.21.1) on more demos, the same day: SK vs WinFakt, Mirage, IEM6 New York, now that Sujan added de_mirage to his Mac: wallbangs unchanged (2 and 2). The 19 demos of his two test folders (`~/Downloads/test-demos-2` and `~/Downloads/test demos`, not counting the copy of the regression set and the POV folder): scores, rounds and K-D identical on all 19; wallbangs 132 to 118, every one removed either reported by Sujan, a kill on a skip across a round restart, or the picture check (also mousesports vs SK, Nuke, Extreme Masters II, R5 1:35 Kapi O on Tentpole, 163 pixels).
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.

## 0.22.0 (2026-10-23)

From Sujan's feedback of 23 Oct 2026, on the WCG 2008, Extreme Masters II, EM3 2009, e-Stars Seoul 2009, ESWC 2010 and DreamHack Summer 2011 demos he added (events in `tests/README.md`). The rule for bodies in view was decided by Sujan the same day.

### Fixed
- **Wallbangs where part of the victim was in view.** The finder tests 15 points on the victim's body, and they missed a head or shoulder showing over cover: SK vs eSTRO, Nuke, WCG 2008, R15 C4 0:23 hee on walle; roccat vs fnatic, Inferno, Extreme Masters II, R13 1:37 Torgersen on Niko; MYM vs mTw, Dust2, EM3 2009, R28 1:21 LoordB on MJE (Sujan, with screenshots). Every wallbang the points leave is now also drawn from the killer's eye at the killing shot, with the map as it was at that moment and the victim's body posed for it. If 100 or more pixels of his body show past the walls, it's not a wallbang. The picture is always the same size around the victim (640 x 400, 220 units high at his distance), so the count doesn't depend on the screen: 100 pixels is a patch about 5 by 6 units, a piece of a head. Only the body counts: a gun barrel past the corner doesn't (paN on Edward, ALTERNATE aTTaX vs Virtus.pro, Inferno, Extreme Masters II, R10 1:02, stays). This is the check parked on 5 Oct 2026 as not conclusive; at the killing shot itself, with a 100 pixel line, it fits all three of Sujan's cases (210, 371 and 907 pixels).
- **The boxes around Inferno's lamp posts counted as walls.** They are invisible brushes, there for players to bump into. ALTERNATE aTTaX vs Virtus.pro, Inferno, Extreme Masters II, R8 0:48 mooN on Zeus was listed with Zeus in full view (Sujan's guess was right). Invisible brushes (a see-through render mode with no amount) are now never cover: not for the finder, See through walls or the camera.
- **Kills through what bullets break.** Nuke's vents and upper-site windows and Inferno's shutters (a func_breakable not flagged "only trigger") aren't cover for the finder any more (Sujan: a kill through them isn't a wallbang). SK vs eSTRO, Nuke, R22 C4 0:13 zet on solo through the vent; tyloo vs mTw, Nuke, e-Stars Seoul 2009, R4 1:03 Xuefeng on ave and R22 1:11 Sunde on Xuefeng through the windows. RobbaN on hee, SK vs eSTRO, Nuke, R26 1:21, stays, as Sujan wanted: the vent was already gone, and his line passes only through its frame. Dust2's crates (only the bomb breaks them) and Nuke's sliding glass doors at the lower site still count as cover, and so do fences, grates and ladders (Sujan).
- **Skips across a round restart weren't found.** HLTV sometimes leaves out the end of a round and the restart together, so the kills that ended the round arrive in the snapshot where everyone is back at the spawns. The skip finder ignored every jump near a round start, since that is normally the respawn; it now counts one when kills arrive in that same snapshot. Sujan's cases: roccat vs fnatic, Inferno, Extreme Masters II, R18, R21 and R26 (he took it for slow motion); fnatic vs Moscow Five, Nuke, DreamHack Summer 2011, R4 1:22 ED1K and Dosia; mTw vs Lions, Nuke, DreamHack Summer 2011, R23 minet on dennis; Burning vs FairFrag, Inferno, ESWC 2010, R17 Rara on HaRts. These kills get // in the Kills list and the skip note, and leave the Wallbangs list: the finder had judged them from the next round's spawns, thousands of units apart (Orwall's AWP on coNTE, roccat vs fnatic, R21: "4,023 units" of wall). Their timer is now the round's own as last recorded (minet on dennis read "freeze 0:15", the next round's freeze time; now 1:20).
- **A 13-second HLTV file read as a POV demo** (SK vs eSTRO, Train, WCG 2008, `-0811081859-`): it has no round marker, which was taken to mean a demo recorded by a player. A demo is now POV only when it also has no HLTV audience updates, which only HLTV recordings carry. Sujan's POV demos still read as POV (checked on Match 1, T side).
- **The timeline's hover note ran off the window** at the left and right ends (the skip note at round 3). It's measured after it's filled and kept whole inside the window.
- **"Freeze 0:15" ran into the gun icon** in the Kills and Wallbangs lists. It now reads on two lines, "freeze" and the time.

### Changed
- **Full screen has its own first note:** "Full screen. Move the mouse to the top, right or bottom edge for the controls. F or Esc leaves it." Choosing Full screen first showed Theatre mode's note, which says T leaves it.
- **Back on the Rounds tab, the list opens at the round playing** (it opened at the top, so at round 23 it had to be scrolled by hand).
- **"Add another part…" is greyed out while the picker row is open** in the Join card. Clicking it there only closed the empty "Pick a demo…" row.

### How it was tested
- Every demo in Sujan's Half-Life folder (34: the 31 of the regression set and the three he added: fnatic vs Moscow Five; tyloo vs mTw; Burning vs FairFrag), brought over from his Mac, main's build against 0.22.0:
  - Scores, every round's winner and every player's K-D overall, on T and on CT (`match_detail.js`): identical on all 34.
  - Wallbang lists with the maps (`wallbang_list.js`, which now waits for the picture check): 287 to 262 on 33 demos (no de_mirage.bsp in the Mac's folder, so SK vs WinFakt, Mirage, IEM6 New York has no list there); 17 identical. Every one removed, with why:
    - picture check (pixels of the body in view at the shot): f0cus on ave, mTw vs Na`Vi, Tuscan, ESWC 2010, R24 1:31 (240); markeloff on minet, same match, file `-1007031645-`, R4 0:36 (172); gob b on Xizt, fnatic vs mousesports, Forge, IEM6 Guangzhou, R14 1:05 (223); NEO's AWP on markeloff, Na`Vi vs FX, Train, SEC 2011, R23 C4 0:01 (561); B1ad3 on RobbaN, R9 0:59 (165) and cArNaGe on edzie, R23 1:25 (743), Sweden vs Ukraine, Train, ClanBase NationsCup XI; NIKO on LoordB, FX vs Lions, Nuke, DreamHack Winter 2010, R13 1:19 (124); starix on f0rest, R12 C4 0:04 (138) and markeloff's AWP on Xizt, R20 0:36 (410), fnatic vs Na`Vi, Dust2, GameGune 2012; ceh9 on XEK, Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011, R25 0:54 (872). Not yet seen by Sujan (IDEAS.md).
    - lamp post boxes: KUBEN on gob b, mousesports vs AGAiN, Inferno, ESWC 2011 final, R21 0:51; ave on PASHA, FX vs mTw, Inferno, Xperia Play 2011, R9 0:53; XEK on ceh9, Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011, R7 1:15. (ave on PASHA is back since 0.22.1: PASHA was hidden behind the post.)
    - Nuke's upper windows: tyloo vs mTw R4 1:03 and R22 1:11.
    - on a skip across a round restart: FX vs SK, Inferno, IEM5, R27 (2); fnatic vs Moscow Five R4 (2); k1ck vs eq, Nuke, DreamHack Winter 2011, R4; mTw vs Lions R19 and R23; tyloo vs mTw R28; fnatic vs EG, Dust2, EM3 2009, R19 (killer and victim 3,514 units apart); Burning vs FairFrag R17.
  - Skips across a round restart (`restart_skips.js`): none in the 7 SK vs eSTRO files, Na`Vi vs FX, Dust2, FX vs Lions, GameGune 2012 or NoA vs Pentagram; each one found has kills in the respawn snapshot.
- Sujan's demos in `~/Downloads/test-demos-2`: the picture check (`v022_seen.js`) drops hee on walle (210), Torgersen on Niko (371), LoordB on MJE (907) and ave on TAZ, MYM vs mTw, R29 C4 0:13 (210); paN on Edward stays (0 for the body). mooN on Zeus, zet on solo (R22) and the restart-skip kills leave the lists (`wb_detail.js` names what blocked each).
- `v022_ui.js` (new) on mTw vs Lions, Nuke: minet on dennis in R23 at 1:20 with //, not a wallbang; a freeze cell on two lines; the Rounds tab scrolled to R23 from the Kills tab; the hover note inside the window at the left end, round 3's skip, the last skip and the right end; "Add another part…" disabled with the picker open; Full screen's note.
- `v019_skips.js`, `v021_skip_tags.js`, `v021_c4_countdown.js` and `v021_time_cells.js` give the same results as on 0.21.1. `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py` (34 demos), `late_kill_timing_check.py` and `panel_click_check.py` pass.

### Discussed, not changed
- **SK vs eSTRO, Dust2 and Nuke, WCG 2008, don't join** (Sujan): the small files aren't parts. `-0811081854-` (Dust2, 5 minutes, 1:6) holds only the five SK players, and `-0811081945-` (Nuke, one round) only the five eSTRO players. The maps are whole in `-0811081950-` (Dust2, SK 16:11) and `-0811082043-` (Nuke, SK 16:12), and Train in `-0811081900-` (eSTRO 16:12), as [fragbite's write-up](https://fragbite.se/cs/blog/9/thorins-take/post/10362/estro-2008-the-year-that-could-have-been) has them.
- **zet on solo, SK vs eSTRO, Nuke, R10 1:22** (Sujan asked whether two smokes made it a wallbang): the finder doesn't look at smokes. From zet's eye solo is fully behind the doorway, and the crosshair line passes through 2 units of the frame's corner, 94 units from zet. It stays, as a close call: aim is recorded about ten times a second.
- Kills on a skip across a round restart stay in the round they ended, with its timer; when exactly they happened inside the skip isn't in the file.

## 0.21.1 (2026-10-15)

### Fixed
- **The time in the Wallbangs list reads the same on every row**: the round ("R2 ·"), then the round timer in one piece ("C4 0:16"), then the demo time, each on its own line (Sujan, 15 Oct 2026, on FX vs Lions, Nuke, DreamHack Winter 2010). It used to wrap wherever the narrow column ran out, so an unclicked row read "R2 · C4" with "0:16" below, and a clicked one, with its bookmark, read "R2 ·" with "C4 0:16" below. The Kills list keeps "C4 0:16" in one piece too: clicked, it used to split after "C4".

### How it was tested
- `v021_time_cells.js` (new) on FX vs Lions, R2, 742 on Xizt: Wallbangs list "R2 ·", "C4 0:16", "11:17" and Kills list "C4 0:16", "//", clicked and not, with nothing running into the kill beside it; every time cell in R2's Kills list fits its column (clicked). Screenshot of both lists checked.
- `v021_c4_countdown.js` and `v021_skip_tags.js` as in 0.21.0; `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.

## 0.21.0 (2026-10-15)

Two fixes from Sujan's feedback of 14 and 15 Oct 2026, decided 15 Oct 2026, in one release.

### Changed
- **The C4 timer above the view counts down**, as the game's does: 0:35 at the plant, down to 0:00, and it stays at 0:00 from the explosion until the next round. When the bomb is defused it stops where it was (mTw vs Lions, Nuke, DreamHack Summer 2011: plant at 20:00, defused at C4 0:26). It counted up before, from 0:00 at the plant, and ran on past 0:35 until the new round (0:40 at R24, plant at 38:22). It counts game time, so HLTV slow motion doesn't stretch it (0.18.0). The times in the Kills and Wallbangs lists, Copy list and the timeline's hover stay as they were: "C4 0:15" is 15 seconds after the plant, which places a kill in the bomb's 35 s.
- **Skip tags in the Kills list**, from the approved mockup ([docs/skip-tags-mock.png](docs/skip-tags-mock.png)): WALLBANG and UNSURE sit on their own line under the gun, so they always fit the panel (UNSURE used to be cut off after WALLBANG, "UNSUF" in Sujan's screenshot), and the // by the time now shows on every kill that lands on a skip, wallbangs included; a wallbang there keeps UNSURE as well (FX vs Lions, Nuke, DreamHack Winter 2010, R2: 742's Deagle wallbang on Xizt at C4 0:16). The Wallbangs list puts the tags on their own line too, since it draws kills the same way.

### How it was tested
- `v021_c4_countdown.js` (new) on mTw vs Lions, Nuke, DreamHack Summer 2011, all 13 plants: 0:35 at every plant; 10 s of game time later 0:24 on the timer and C4 0:10 in the lists; the four bombs that went off (7:13, 9:37, 13:10, 38:22; fuse 35.11 to 35.25 s of game time) read 0:00 just before the explosion, at it and up to the next round, which then shows freeze time; the defused bomb (20:00) holds 0:26 after the defuse. The timer itself at R24 (plant at 38:22): "C4 0:34" just after the plant, "C4 0:21" 15 s of demo time later (slow motion), "C4 0:00" after the explosion; the lists there still read C4 0:00, 0:05, 0:29 and 0:38.
- `v021_skip_tags.js` (new) on FX vs Lions, Nuke, DreamHack Winter 2010, with the map: in R2, 742 on Xizt (C4 0:16) shows // with WALLBANG and UNSURE on the line under the gun, both inside the panel and not cut; the other five kills show neither. 6 kills land on a skip in the live rounds, 2 of them wallbangs, all with //. Screenshot of the panel checked against the mockup.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py` (on the names of the 31 demos in the Mac's folder), `late_kill_timing_check.py` and `panel_click_check.py` pass.
- Run on a copy of Sujan's Mac folder (`~/Downloads/Half-Life`), brought over through the linked desktop app; the temporary `_claude_transfer` folder was deleted from the Mac at once, with his permission.

### Discussed, not changed
- The countdown assumes a 35 s fuse. Every bomb measured in 47 demos took 35.1 to 35.5 s of game time unless a skip cut it short (0.20.0), so 35 fits the tournament servers in the folder. The game's own default (`mp_c4timer` in ReGameDLL `game.cpp`) is 45, so a demo from a server left on the default would count down too fast. Reading the fuse from the demo isn't possible: the server's settings aren't in an HLTV recording.
- The timer drops whole seconds as the game's round timer does, so it reads 0:34 a moment after the plant and 0:00 for the last part of a second before the explosion.
- A bomb that is still ticking when the round ends (the Terrorists killed every CT) keeps counting down until the next round, as it does in the game.
- The // stays out of the Wallbangs list, where UNSURE already says the same, as in the mockup.

## 0.20.0 (2026-10-14)

Skips in the recording, found more reliably, and marked on every kill that lands on one (Sujan, 14 Oct 2026: build both).

### Changed
- **How a skip is found.** A player counts as moving too fast when he moved over 60 units and over 400 units a second, measured over the actual time since the snapshot before and over the last two snapshots (the game caps running at 260 a second, ReGameDLL `weapons.h`; 400 allows for bunny hopping). 0.19.0 assumed snapshots 0.1 s apart, so a gap in the snapshots (0.34 s at mym vs fnatic, Train, 2006, 45:10.9; 0.6 s at roccat vs fnatic, Inferno, Extreme Masters II, 25:52.6, followed by a stale snapshot) looked like a skip. A skip needs at least 3 living players, and 60% of them, too fast at once, as before.

### Added
- **Skips with only 1 or 2 alive**: all of them too fast, and silent damage at the same moment: health down 20 or more with no hit, pain, death or fall sound and no grenade blast (742 went from 100 to 36 HP at FX vs Lions 11:17.9 with no hit). 9 in the 47 demos checked.
- **Skips with players standing still**: silent damage to 3 or more players at once. 1 in the 47 demos (SK vs Dateam, Dust2, IOL Final4 2011, 9:36.8).
- **// in the Kills list** by the time of any kill that lands on a skip ("Happened inside a skip in the recording: you won't see it happen"). A wallbang there keeps UNSURE instead. 141 kills in the 47 demos (fnatic vs Na`Vi, Dust2, GameGune 2012: MODDII's three MAC-10 kills at 12:44 all land in one snapshot).

### How it was tested
- **The bomb's fuse**, 47 demos (the 31 regression demos and 16 from Sujan's `test-demos-2` and `test demos` folders, listed in `tests/README.md`): the fuse is a fixed 35 s in game time, so a skip between plant and explosion makes the bomb go off early. 7 bombs went off early (25.1 to 30.1 s against each demo's usual 35.1 to 35.4) and every one has a skip in its fuse; none of the 118 bombs that took the full time has one. With 0.19.0's rule, 1 of the 118 had a false skip (roccat vs fnatic 25:52.6).
- The file has no marker of its own: packet numbers, update numbering and full snapshots run on without a gap through every skip (checked on FX vs Lions and fnatic vs EG).
- 121 skips in the 47 demos (111 by the jump rule, 9 with 1 or 2 alive, 1 standing still); none in 19 of them.
- `v019_skips.js` in the viewer: FX vs Lions 7 skips, Sweden vs Norway 3, SK vs Dateam 5 (including 9:36 and 24:54), k1ck vs eq none; players held at the snapshot before just ahead of a skip.
- Wallbang lists with the maps, 0.19.1 against 0.20.0, 31 regression demos: identical.
- The Kills list on fnatic vs Na`Vi, GameGune 2012, round of 12:44: // on the three kills in the skip, not on the others.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.

### Discussed, not changed
- Why HLTV skips is still not known. The bomb's fuse shows how much is missing: 5 to 10 s of game each time.
- 2 lone cases of silent damage (one player, nothing else) aren't treated as skips: one signal on one player is too little.

## 0.19.1 (2026-10-14)

### Changed
- **"// Recording skips here" now comes before the skip**: from 2 seconds of game time before it to 1 second after, so there's time to read it and then watch the jump happen (Sujan, 14 Oct 2026). In 0.19.0 it showed only after the skip, for 2 seconds, when the jump had already gone by.

### How it was tested
- `v019_skips.js` on FX vs Lions, Nuke, DreamHack Winter 2010 and Na`Vi vs FX, Dust2, SEC 2011: the note is off 3 s before the first skip, on 1.5 s before and 0.5 s after, off 1.5 s after. The skip times and UNSURE kills are as in 0.19.0.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py` and `late_kill_timing_check.py` pass.

## 0.19.0 (2026-10-14)

Skips in the recording, from the approved mockup ([docs/recording-skip-mock.png](docs/recording-skip-mock.png); Sujan, 14 Oct 2026: build it and judge it by eye in the viewer).

### Added
- **The viewer finds skips in the recording**: snapshots where at least 3 living players, and at least 60% of them, moved over 60 units from the snapshot before (running covers at most about 25), away from round starts. HLTV left that stretch of game out of the file (see 0.18.0, "Discussed, not changed"). FX vs Lions, Nuke, DreamHack Winter 2010: 7 (5:46, 11:17, 16:15, 21:05, 26:54, 31:33, 37:26); Sweden vs Norway, Dust2, ASUS ENC 2010: 3; mTw vs Lions, Nuke, DreamHack Summer 2011: 3; Na`Vi vs FX, Dust2, SEC 2011: 1 (45:46); k1ck vs eq, Nuke, DreamHack Winter 2011: none. The same counts as the measurement of 14 Oct.
- **"// Recording skips here"** above the name bar for 2 seconds after a skip (from 2 s before to 1 s after since 0.19.1), in 2D and 3D, and a // break mark on the timeline at each skip. Hovering the mark says what it means.
- **UNSURE** on a wallbang that lands within 0.3 s of a skip, in the Wallbangs and Kills lists (hover: the recording skips at this kill, so the wallbang was judged from where everyone stood after the skip) and at the end of its line in Copy list. Three in the test demos: 742 on Xizt (R2) and kHRYSTAL on PASHA (R8), FX vs Lions; ArcadioN on SNAJDINHO (R15), mTw vs Lions.

### Changed
- **Players snap across a skip** instead of sliding to the new spot over 0.1 s, often through walls.

### How it was tested
- `v019_skips.js` on the five demos above: the skip times; just before the first skip every player checked is still exactly where the snapshot before put him (3 of 3, 3 of 3, 10 of 10, 10 of 10); the note shows 0.5 s after a skip and is gone 3 s after; the UNSURE kills.
- Wallbang lists with the maps, 0.18.1 against 0.19.0, all 31 demos: identical, so snapping changes no verdict.
- In the test browser on FX vs Lions, R2 11:17.9 in Player's eyes: the note above the name bar, the // marks, the hover on the R8 mark, UNSURE on R2 and R8 in the Wallbangs list.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.

## 0.18.1 (2026-10-14)

### Changed
- **A shorter 3D bar**, so the kill feed at the top right doesn't run into it (Sujan, 14 Oct 2026: with two or more kills, long names reached the bar). The three cameras are one control (Free, Eyes, Behind; the full names are on hover), Prev and Next player are arrows, and Team colours, Quality and Crosshair sit in one "View settings" panel that opens under its button and closes with a click elsewhere or Esc. At 1,512 px wide the bar now ends at 348 px; it used to run to about 850 px. No button to hide it: Theatre and Full screen already hide it until the mouse reaches the top edge, and an open View settings panel keeps it showing there, as an open menu did. The "smaller row" Sujan chose over stacking the options down the left side.

### Fixed
- A sound whose position, or the listener's, was not a number for a frame (as while the view is resized) set its volume to NaN, which the browser reports as a page error. Such a sound is now skipped. Found by `theatre_test.py`.

### How it was tested
- `theatre_test.py` at the 14-inch MacBook size (1512 x 982 at 2x): 39 of 39, with its menu check now opening View settings (before: focusing the Quality menu, which is inside the panel now). The first run failed only on the sound error above.
- In the test browser on FX vs Lions, Nuke, DreamHack Winter 2010, R8 at 21:06 in Player's eyes with two kills in the feed: the bar ends at 348 px, the feed's longest line starts at 615 px. View settings opens with Team colours Off, Quality Auto, Crosshair Medium, and Esc closes it.
- `modes_and_toggles.js` (every view and camera, Quality), `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` and `panel_click_check.py` pass.

## 0.18.0 (2026-10-14)

From Sujan's feedback of 14 Oct 2026, on FX vs Lions, Nuke, DreamHack Winter 2010, Sweden vs Norway, Dust2, ASUS ENC 2010, and mym vs fnatic, Train, 2006. Built without a mockup at his request, except the start screen (option A of [docs/start-screen-step2-mock.png](docs/start-screen-step2-mock.png)).

### Fixed
- **Clicks on the side panel needing two or three tries.** While a demo played, the Kills and Wallbangs lists were rebuilt every half second (every frame at 8x), the Players tab on every death and every list at each new round. A click is a press and a release on the same row, so a row replaced in between lost it. Now the "playback is passing" tint moves in place without a rebuild, and a rebuild that comes while a mouse button is held on the panel waits until the click has gone through. The demo list on the start screen redraws only when demos change, so it didn't have the problem.
- **HLTV slow motion.** Some HLTV broadcasts slowed to half speed for a few seconds around a kill (svc_timescale 0.5): 15 of the 31 test demos do it, 6 to 62 times each. Inside those stretches the demo's clock runs twice as fast as the game's (a snapshot every 0.2 s of demo time for 0.1 s of game, checked against the demo's own game clock in every stretch of 7 demos, all within 0.12 s). Playback now runs through them at double speed, so the match plays at real speed. The timeline and "demo time" stay on the demo's clock.
- **Round and C4 timers counted slow motion as game time.** They count game time now, as the game's do. A kill after a slow stretch in the same round showed a timer 1 to 5 seconds off from the game (Sweden vs Ukraine, Train, ClanBase NationsCup XI, R19: 0:49, now 0:54), which matters when finding a wallbang in the game's demo player. The C4 timer now reads 0:35 at every explosion (mTw vs Lions, Nuke, DreamHack Summer 2011, plant at 38:22: 0:36 before, 36.94 s on the demo's clock and 35.19 s in game time).
- **The load summary kept counting down behind the start screen** after "Open another demo". It closes at once.
- **Behind player showed the followed player's name twice**: over the player and in the name bar under the view. The label over the player is gone in Behind player, as in Player's eyes.
- In-between movement no longer averages snapshot times across the start or end of a slow-motion stretch, where the gaps between snapshots double or halve.

### Changed
- **Names without clan tags** over the players in 2D and 3D and in the Kills and Wallbangs lists, as the Players tab has had since 0.14.0, worked out once over each whole team so a name reads the same everywhere. Two more things go: a web address as a word of its own ("MYM|REAL www.steelseries.com" reads "REAL", mym vs fnatic, Train, 2006) and a sponsor after a separator most of the team uses ("LIONS Xizt * MAXFPS" reads "Xizt", FX vs Lions). A note only one player has stays ("fnatic.Archi *Bday 19!"). Hovering a name in the lists shows the full one. The kill feed, the name bar under the view, the Tab scoreboard and Copy list keep the full names, as the game shows them.
- **Kill feed icons.** The kill feed at the top right shows the weapon's kill feed icon and the headshot icon from your own `cstrike/sprites`, in orange as in the game, in place of the words "ak47" and "HS". Without those files it shows the words.
- **Round announcements in the game's look.** Drawn in the game's own "Default" font from `cstrike/resource/ClientScheme.res` (Verdana, weight 600, 12 to 24 px tall by screen height: 14 px from 768 to 1023 lines), orange (about rgb 250, 188, 80) with a one-pixel dark shadow, the top of the text 35% of the way down, all measured from Sujan's two in-game screenshots (FX vs ALTERNATE aTTaX, Nuke, 1024 x 768: text at 271 of 768). 0.17.0 had them centred at 25%, from Xash3D's code, in the viewer's own font. Shown for 2.5 seconds of game time.
- **The hold-Tab scoreboard is wider**: up to 1,080 px (was 760), so long names fit.
- **The start screen, once the Half-Life folder is fine:** the folder step shrinks to one quiet line (folder name, status, Change), and "Open a demo" becomes the outlined card holding the search box and your demos. Its button reads "Open .dem from elsewhere". Before the folder is fine (first visit, wrong folder, Reconnect) both steps look as before. Option A of the mockup, chosen by Sujan.

### Added
- **Crosshair size**: "Crosshair: small / medium / large" in the 3D bar, shown in Player's eyes. Small is the crosshair before 0.18.0; medium (the default) and large are longer and thicker. The kill markers keep their size and move out with the arms, so they still start just past them. Remembered in this browser.
- **The C4 on the radar**: a "C4" tag on the carrier's dot, and the dropped bomb where it lies, from the moment it falls until it's picked up or the round resets. The game sends a bomb lying still only when it changes, so the reader keeps it from its last update until the object goes (Na`Vi vs FX, Dust2, SEC 2011: 59 drops; FX vs Lions: 57; Fnatic vs mousesports, Tuscan, ESWC 2011: 5; the ESWC 2010 Tuscan files: none). The planted bomb was there already. The game's radar shows neither to spectators; this changes the decision of 5 Oct 2026, at Sujan's request.

### How it was tested
- On Sujan's Mac files (`~/Downloads/Half-Life` with the `cstrike/resource` and `cstrike/sprites` folders he added on 14 Oct 2026, 31 demos), copied into the test machine.
- Scores, every round's winner and every player's K-D overall, on T and on CT, 0.17.0 against 0.18.0 (`compare_all.sh` with `match_detail.js`): identical on all 31.
- Wallbang lists with the maps loaded, 0.17.0 against 0.18.0 (`wallbang_list.js`): the same kills on all 31; 20 identical, and on 11 slow-motion demos only the round timers of kills after a slow stretch changed (by 1 to 5 seconds).
- Game time: `v018_c4_game_time.js` on mTw vs Lions, Nuke: 35.25, 35.11, 35.16 and 35.22 s from plant to explosion, the C4 timer at 0:35 for all four. Each slow stretch's lost time against the demo's own game clock (svc_time) on 7 demos: within 0.12 s.
- New `tests/panel_click_check.py`: at 8x, aim at a row, press, play on while it's held 0.3 s, release; three times on the Kills tab, once on the Players tab across deaths. 0.18.0 passes 4 of 4 in 5 runs out of 5; 0.17.0 fails 4 of 4 every time.
- Names (`v018_basics.js`): FX vs Lions reads 742, KUB3N, NEO, PASHA, LoordB and THREAT, NIKO DA PANDA, kHRYSTAL, FYRR73, Xizt. Copy list's text is unchanged apart from the timers.
- Screens in the test browser on FX vs Lions: the kill feed's icons, "Terrorists Win!" at 35% in 14 px orange, the three crosshairs, Behind player without the label, the carrier's tag (THREAT, R2) and a dropped bomb on the radar, the Tab scoreboard with full names, the Wallbangs list, the start screen. No page errors.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py` and `late_kill_timing_check.py` pass.

### Discussed, not changed
- **Players teleporting in FX vs Lions** (742 on Xizt, R2 11:17.9; kHRYSTAL on PASHA, R8 21:05.7). Rendered frame by frame following 742: at 11:17.82 he's on the roof with 100 HP, one snapshot later on another rooftop with 36 HP, and every other living player jumps at the same moment (3,329 units in total against about 40 normally). The file has every frame and its game clock runs on in steady steps, so HLTV left that stretch out of the recording; no viewer can show it. 7 such jumps in FX vs Lions, 3 in Sweden vs Norway, 3 in mTw vs Lions, 1 in Na`Vi vs FX, Dust2; none in three demos without slow motion. Correction (14 Oct 2026, later the same day): not every bomb took 35 s, as first written here. Across all 31 demos, 77 bombs went off with no jump around them, after 35.1 to 35.5 s of game time; the three that went off early (28.8, 29.5 and 30.1 s) were all planted at a skip (FX vs Lions 16:15.8; mousesports vs AGAiN, Inferno, ESWC 2011 final, 56:41.6; Fnatic vs mousesports, Tuscan, ESWC 2011, 56:47.9). So those skips left out about 5 to 6 s of game each, measured by the game's own fuse, and none was found away from a jump. Why HLTV does it isn't known (no source found). How the viewer should show them is open in IDEAS.md.
- The kill feed keeps full names, as in the game (Sujan). So do the name bar under the view and Copy list, so a pasted list matches the game's names.
- The round announcement stays above the middle of the screen: in Player's eyes the middle is the crosshair, and the game puts it at 35%.
- The heatmap's "where players stand" samples on the demo's clock, so a slow-motion stretch counts its few seconds twice. Small next to a whole match; left as it is.

## 0.17.0 (2026-10-05)

Round announcements, the C4 and defusal kits, and quieter kill markers. All three asked for by Sujan on 5 Oct 2026.

### Added
- **Round announcements on screen.** "Terrorists Win!", "Counter-Terrorists Win!", "Round Draw!", "The bomb has been planted!", "The bomb has been defused!", "Target Successfully Bombed!", "Target has been saved!", "Game Commencing!", "The game will restart in 1 SECOND" and the hostage and VIP ones, in the middle of the view a quarter of the way down, for 2.5 seconds of demo time, in 2D, 3D, 3D + radar and Theatre mode. The voices already played; the text didn't. The demo records each one as the game's centre-screen message (TextMsg sent to the centre of the screen) at the moment it happened: 60 in Na`Vi vs FX, Dust2, SEC 2011 final. The words come from your own `cstrike/resource/cstrike_english.txt`, like everything else from the game, with the same English lines when that file isn't there.
- **The C4 and defusal kits on the players.** The game marks a Terrorist carrying the bomb and a Counter-Terrorist with a kit with one value on the player (`body` 1; ReGameDLL `GiveDefuser` and the C4 pickup in `player.cpp`), and every stock player model carries the pack as a second piece of its "backpack" part: a C4 backpack on the T models, a kit pouch on the CT models. The viewer now reads that value and draws the pack, as the game does. The hold-Tab scoreboard tags the carrier "C4" and each kit holder "Kit". Not on the radar: the game's radar doesn't show them either (Sujan, 5 Oct 2026).

### Changed
- **Kill markers around the crosshair are quieter** (option A of the mockup, [docs/crosshair-markers-mock.png](docs/crosshair-markers-mock.png)). Four thin ticks now start just past the crosshair's arms instead of sitting on them, the label underneath is smaller, and the marker lasts 0.45 s instead of 0.75 s. In Player's eyes the ring that bursts from the victim is gone: the victim is usually at the crosshair there, so it covered it too. Other views keep the ring.

### How it was tested
- In the test browser on Sujan's Windows files (30 HLTV demos, the maps, player and weapon models), on Na`Vi vs FX, Dust2, SEC 2011 final: the "Counter-Terrorists Win!" at R6 in 3D and 2D, "The bomb has been planted!" in Player's eyes, each in the middle a quarter of the way down; 320 lines read from the game's `cstrike_english.txt`. One Terrorist with the C4 20 seconds into each live round checked, never two in any round; the C4 backpack on markeloff and the kit pouch on KUBEN in 3D (R6); the Tab scoreboard with "C4" on markeloff and "Kit" on 742, PASHA and KUBEN.
- Scores, every round's winner and every player's K-D on all 30 demos, 0.16.0 against 0.17.0 (`compare_all.sh` with `match_detail.js`): identical on all 30.
- `folder_row_test.py` (20 of 20), `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py` and `late_kill_timing_check.py` pass.

### Discussed, not changed
- Where the game puts the round text: a quarter of the way down and 2.5 seconds are from Xash3D, a reimplementation of the GoldSrc engine (`CL_CenterPrint` with 0.25, `scr_centertime` 2.5). Sujan compared it with the game on 5 Oct 2026: it matches.
- The kit pouch on the CT models is small (a pouch at the waist), as the stock models draw it. The scoreboard tag is the easier place to read it.
- A denser check for "fully hidden" in the wallbang finder (a point every 2 units over the body). Sujan checked its 14 changes on 5 Oct 2026: the 4 removals were right, but 6 of the 10 additions showed an arm, elbow or gloved hand. Tracing to the player model's own points got 12 of 14, and drawing the killer's view and counting the victim's pixels got all 14 only at one moment before the shot and not at others, and called face on JiGetus (SK vs WinFakt, Mirage, IEM6 New York, R4 0:37) hidden, which Sujan ruled out in game. Not conclusive, so the finder stays as it is (Sujan, 5 Oct 2026). The branch was deleted unmerged. Details in IDEAS.md.

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
