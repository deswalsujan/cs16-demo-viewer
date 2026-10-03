# Tests and measurements

Scripts used while building 0.8.0 to 0.11.0 (1 Oct 2026). They're the starting point for the test suite in [IDEAS.md](../IDEAS.md). They're run by hand, not on every push yet.

## Setup

1. Python 3 with Playwright: `pip install playwright`, then `python3 -m playwright install chromium`.
2. three.js r128, the version the viewer loads from cdnjs, as `tests/three.min.js`:
   ```
   npm pack three@0.128.0
   tar xzf three-0.128.0.tgz
   cp package/build/three.min.js tests/three.min.js
   ```
   (Or point `THREE_JS` at a copy elsewhere. The scripts serve this file in place of the CDN, so they also run without internet.)
3. Node 18 or later, for the demo data probes.
4. Build the viewer first (`python3 build.py`). The browser checks run against `index.html` in the repo root unless told otherwise.

Settings (environment variables):

| Name | What it is | Default |
|---|---|---|
| `HALF_LIFE_DIR` | Your Half-Life folder (the one with `cstrike` and `valve`). Required for the browser checks. | none |
| `THREE_JS` | Path to three.min.js r128 | `tests/three.min.js` |
| `DEMO` | Part of the demo file name to open (`harness.py` only) | `dust2` |
| `MAP_NEEDED` | `0` to start without waiting for the map (for a demo whose map isn't in the folder) | `1` |
| `PAGE` | Page to test (Theatre checks) | `../index.html` |

The demos on each machine are listed in "Demos and their events" below. Most checks default to Na`Vi vs FX on Dust2 (SEC 2011 final).

## Demos and their events

Every demo used in testing: the event it's from, which of Sujan's machines has it, and whether it's still in use. This table is the one place that tracks the demo set; CLAUDE.md points here. Deleted demos keep their row so they can be found again. Notes in CHANGELOG.md and IDEAS.md name the event along with the demo (rule in CLAUDE.md). "Demo text" means the event's name is in the demo itself: the game server's name in admin messages, or the HLTV server's name (read 2 Oct 2026 with a probe over every demo on Sujan's Mac).

**When demos are added or deleted:** add or change the rows here (file, event, how the event is known, which machines, status with the date), then check the Mac folder matches by listing `cstrike/*.dem`. Windows is checked by Sujan.

Status values: **regression set** (kept on purpose: K-D and scores Sujan confirmed, or a known quirk; compared on every release; the new batch of 2 Oct 2026 joined it on 3 Oct 2026, once Sujan had checked 0.15.1 by eye), **new batch, date** (added for an accuracy check in IDEAS.md), **deleted, date**.

### In use

| Demo file | Event | How we know | On | Status |
|---|---|---|---|---|
| `navi-vs-fx-sec2011-final-1110091449-de_train.dem`, `...-1110091531-de_dust2.dem` | SEC 2011, final (9 Oct 2011) | Sujan; demo text "SEC #2 \| ProGamers.pl"; file name | Mac, Windows | regression set (main test demo for Dust2) |
| `mtw-vs-lions-dhs11-1106191044-de_nuke.dem` | DreamHack Summer 2011 (19 Jun 2011) | Sujan; demo text "DHS Main tournament #1" | Mac, Windows | regression set |
| `fx-vs-mtw-xperia2011-1104240025-de_inferno.dem`, `-1104240112-de_inferno.dem` (Inferno, parts 1 and 2), `-1104240212-de_nuke.dem`, `-1104240242-de_nuke.dem` (Nuke, parts 1 and 2) | Xperia Play 2011 (24 Apr 2011) | file name | Mac, Windows | regression set (confirmed numbers, split maps) |
| `sk-vs-dateam-iolfinal4-1106181158-de_dust2.dem` | IOL Final4 (18 Jun 2011) | demo text "IOL FINAL4 SM-FINAL #1"; file name | Mac, Windows | regression set (confirmed numbers) |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | IEM6 Global Challenge New York, final (16 Oct 2011) | demo text "IEM Global Challenge New York Server 1"; [HLTV.org's report](https://www.hltv.org/news/7636/sk-win-iem6-gc-new-york) | Mac, Windows | regression set |
| `FX-vs-sk-iem5-inf.dem` | IEM5 (January 2011) | file name; Sujan (0.14.1) | Mac, Windows | regression set (confirmed numbers) |
| `auto_ifng-1103030950-de_dust2.dem` (iFNG FX vs fnatic) | Intel Extreme Masters, 3 Mar 2011; which stage isn't checked | demo text "Intel Extreme Masters #Stage"; date from the file name | Mac, Windows | regression set (confirmed numbers) |
| `fnatic_vs_EG_EM3Global-0903061800-de_dust2.dem` | EM3 Global Finals (6 Mar 2009) | file name only | Mac, Windows | regression set (confirmed numbers) |
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem` | ESWC 2011 (Paris, 21 to 24 Oct 2011) | demo text "[AdminBot 9.1] ESWC 2011 Grand Final." (the bot says this in every ESWC 2011 game, group games too, so it doesn't tell the stage) | Mac, Windows | regression set (main test demo for Tuscan) |
| `de_nuke.dem_Fnatic-vs-ALTERNATE.dem` | ESWC 2011 | demo text, as above | Mac, Windows | regression set |
| `1110241407--auto_de_inferno.dem_mousesports-vs-AGAIN.dem` | ESWC 2011, final | demo text, as above; the final by the teams and date | Mac, Windows | regression set |
| `noa.penta-0610211800-de_train.dem` (NoA vs Pentagram, Train; protocol 47) | not known; recorded 21 Oct 2006 at 18:00 by the file name | file name (checked 2 Oct 2026, when Sujan copied it to the Mac) | Mac, Windows | regression set (protocol 47, late kill messages) |
| `mtw-vs-navi-eswc2010semi-real-1007031530-de_tuscan.dem`, `-1007031625-`, `-1007031645-`, `-1007031655-de_tuscan.dem` (Tuscan, 4 files), `-1007031710-de_train.dem` (Train) | ESWC 2010, semi-final (3 Jul 2010); Tuscan was map 2, Train map 3 | file name; HLTV server "HLTV.org - VeryGames.de"; [HLTV.org's match page](https://www.hltv.org/matches/1457651/mtw-vs-natus-vincere-eswc-2010) and [markeloff's 2010 profile](https://www.hltv.org/news/6001/top-20-players-of-2010-markeloff-1) (map order). The warmup-only first Tuscan file `-1007031520-` is deleted (below) | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |
| `navi-vs-m5-dhwinter2011-1111250937-de_inferno.dem` (Na`Vi vs Moscow 5, Inferno) | DreamHack Winter 2011, group C (25 Nov 2011) | file name; demo text "DreamHack MSI BEAT IT"; [HLTV.org's event page](https://www.hltv.org/events/850/dreamhack-winter-2011) (16-12) | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |
| `k1ck-vs-eq-dhwinter2011-1111260056-de_nuke.dem` (k1ck vs eq, Nuke) | DreamHack Winter 2011, group D (26 Nov 2011) | file name; demo text, as above; [HLTV.org's event page](https://www.hltv.org/events/850/dreamhack-winter-2011) (10-16) | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |
| `sk-vs-navi-dhwinter2011-1111261019-de_train.dem` (SK vs Na`Vi, Train) | DreamHack Winter 2011, quarter-final, map 2 (26 Nov 2011) | file name; demo text, as above; [HLTV.org's report](https://www.hltv.org/news/7849/navi-in-triple-overtime-sk-win) (Na`Vi 25-23 after three overtimes) | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |
| `auto_ifng-1110042145-de_forge.dem`, `auto_ifng-1110042211-de_forge.dem` (fnatic vs mousesports, Forge, probably one map in 2 files) | IEM6 Global Challenge Guangzhou, grand final, map 3 (HLTV.org dates it 5 Oct 2011; the file names say 4 Oct, 21:45) | demo text "Intel Extreme Masters #1"; team tags in player names; [HLTV.org's report](https://www.hltv.org/news/7569/fnatic-win-iem6-gc-guangzhou) (Forge 16-11, the only Forge in it) | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |
| `auto-server1-1106262105-de_tuscan.dem` (Na`Vi vs fnatic, Tuscan) | Adepto BH Open 2011, final, map 2 (26 Jun 2011) | demo text "Adepto BH OPEN #1"; team tags in player names; [HLTV.org's report](https://www.hltv.org/news/7075/navi-win-adepto-bh-open) (16-0) | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |
| `fnatic-vs-navi-gamegune2012-1207282133-de_dust2.dem` | GameGune 2012, grand final, map 1 (28 Jul 2012) | demo text "GameGune 2012 Grand Final"; file name; [HLTV.org's report](https://www.hltv.org/news/8857/fnatic-win-gamegune-2012) (16-7) | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |
| `485.53.706623-0803162045-de_train.dem` (Sweden vs Ukraine, Train; protocol 47) | ClanBase NationsCup XI (16 Mar 2008 by the file name) | Sujan, with [HLTV.org's match page](https://www.hltv.org/matches/586491/ukraine-vs-sweden-cb-nationscup-xi) (2 Oct 2026);  country tags in player names (SpawN, RobbaN, edzie); HLTV server "HLTV.org - VeryGames.de" | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |
| `53.52.1646548-1005272144-de_dust2.dem` (Sweden vs Norway, Dust2) | ASUS ENC 2010 (27 May 2010) | [HLTV.org match page](https://www.hltv.org/matches/1421903/sweden-vs-norway-asus-enc-2010) (same day; no map score on it); country tags in player names (Sweden: GeT_RiGhT, f0rest, alleN, Gux, Delpan; Norway: REAL, kalle, RashiE, KORN, tacky); admin "XpreZ [raven]", www.SpeedGaming.dk | Mac, Windows | regression set (new batch of 2 Oct 2026, added 3 Oct 2026) |

The Windows copies of the regression set are Sujan's copies from the Mac (2 Oct 2026). The new batch was checked on Windows by listing `cstrike/*.dem` on 2 Oct 2026: all 31 demos in this table are there, none missing and none extra; listed again at the end of the session the same day, still 31. On 3 Oct 2026 the warmup-only Tuscan file was deleted on the Mac (30 demos there, listed) and by Sujan on Windows. The same day the seven POV demos went onto both machines: 37 demos on the Mac (listed), and on Windows by Sujan's word. The new batch rows were read from the demos on the Mac on 2 Oct 2026 (server and admin messages, player names); stages and scores were looked up on 2 Oct 2026 (sources in the rows); no map score was found for Sweden vs Norway or for the ESWC 2010 maps.

### POV demos (recorded by a player)

Sujan's own recordings on 32-player public servers (16 vs 16), added to the Mac and Windows on 3 Oct 2026 for the POV trial (IDEAS.md, "POV demos"). Not regression demos: whether they stay depends on that trial. No event: the event column gives the server and date. Recorder names are as the demo shows them.

| Demo file | Event | How we know | On | Status |
|---|---|---|---|---|
| `match-1_de_barcelona-Cts_27-03-2025_15.10.23.dem`, `match-1_de_barcelona-Ts_27-03-2025_15.32.54.dem` (Match 1, CT then T) | none: public server, 27 Mar 2025, de_barcelona; recorder "ac shadows optical mouse" | Sujan; file name; demo text | Mac, Windows | POV trial, 3 Oct 2026 |
| `match-2_de_mirage_32[Cts]_27-03-2025_14.47.11.dem`, `match-2_de_mirage_32[Ts]_27-03-2025_14.23.27.dem` (Match 2) | none: public server, 27 Mar 2025, de_mirage_32 | Sujan; file name | Mac, Windows | POV trial, 3 Oct 2026 |
| `match-3_css_cache_00-23-35_28-07-2022.dem` (Match 3) | none: public server, 28 Jul 2022, css_cache; recorder "tp optical mouse"; custom weapon skins | Sujan; file name | Mac, Windows | POV trial, 3 Oct 2026 |
| `match-4-[PuB]_M-[de_nuke32]_D-[08_24_2021]_T-[00_44].dem`, `match-5-[PuB]_M-[de_nuke32]_D-[08_25_2021]_T-[22_09].dem` (Match 4 and 5) | none: public server, 24 and 25 Aug 2021, de_nuke32 | Sujan; file name | Mac, Windows | POV trial, 3 Oct 2026 |

### Deleted

| Demo file | Event | How we know | Was on | Status |
|---|---|---|---|---|
| `1110231453--auto_de_nuke.dem_AGAIN-vs-ALTERNATE.dem`, `1110231623--auto_de_dust2.dem_AGAIN-vs-ALTERNATE.dem`, `1110231530--auto_de_tuscan.dem_Lions-vs-Mousesports.dem`, `1110231538--auto_de_inferno.dem_ALTERNATE-vs-AGAIN.dem`, `1110231835--auto_de_mirage.dem_Mousesports-vs-SK.dem`, `de_mirage.dem_Z-Antwerp-Aces-vs-LIONS-E-SPORT.dem` | ESWC 2011 | demo text, as above | Mac, Windows | deleted 2 Oct 2026 (Mac by Claude, Windows by Sujan) |
| `1110231614--auto_de_mirage.dem_Moscow-5-vs-NAVI.dem` | ESWC 2011 | demo text; [HLTV.org's match page](https://www.hltv.org/matches/1901911/natus-vincere-vs-moscow-five-eswc-2011) | Mac, Windows | deleted 2 Oct 2026 |
| `mtw-vs-navi-eswc2010semi-real-1007031520-de_tuscan.dem` (2.5 MB, warmup only: "Match stopped") | ESWC 2010, semi-final, mTw vs Na`Vi, Tuscan (3 Jul 2010) | file name, as the other ESWC 2010 files | Mac, Windows | deleted 3 Oct 2026 on the Mac by Claude, at Sujan's request (the Join card refuses it: only 5 of the same 10 players, by name), and on Windows by Sujan |
| `de_inferno.dem_mousesports-vs-Virus-.dem` (102 MB, broken: no index, stops 199 bytes into its last frame) | ESWC 2011 | demo text "CS 1.6 ESWC #2 by Verygames", read frame by frame (see IDEAS.md, "Tell exactly why a demo is broken") | Mac, Windows | deleted 2 Oct 2026 |
| `mym.sk.bronzedecider-0805111924-de_inferno.dem` | Kode5 2008, grand final, bronze decider (11 May 2008) | demo text "Kode5 Grand Final server #2"; file name | Mac, Windows | deleted 2 Oct 2026 |
| `PGL.DreamHack_Bucuresti_2012.03-Winner.Anexis.vs.fnatic.HLTV.3.de_tuscan.dem` | DreamHack Bucuresti 2012 (PGL) | demo text (HLTV server "DreamHack Bucuresti 2012:3"); file name | Mac, Windows | deleted 2 Oct 2026 |
| `2006-07-02_15h00_Team3D_Fnatic-0607021359-de_train.dem` | ESWC 2006, probably (2 Jul 2006) | HLTV server name "HLTV-ESWC" and the date in the file name; not checked further | Mac, Windows | deleted 2 Oct 2026 |
| `GP-[PuB]_M-[de_zovine]_D-[10_01_2026]_T-[19_08].dem` (GP Pub de_zovine POV demo) | none: a public server game Sujan recorded on 1 Oct 2026 | | Windows | deleted 2 Oct 2026 by Sujan |

Some older page scripts in the table below name a deleted demo (`DEMO=anexis`, `DEMO=gp-[pub]`, the 2006 Train in `new_demo_settings.js`); they need that demo back to run.

## Browser checks (headless Chromium)

`harness.py` loads a built page, feeds it the Half-Life folder, opens a demo, waits for the 3D map, then runs one or more page scripts in order and prints what each returns. It copies the page and adds a small hook (`window.__v`) so scripts can reach the viewer's internals; the shipped page is never changed.

```
cd tests
HALF_LIFE_DIR=~/Downloads/Half-Life python3 harness.py ../index.html page/smoothness_and_frame_cost.js
HALF_LIFE_DIR=~/Downloads/Half-Life python3 harness.py ../index.html page/see_through_walls.js,page/team_colours.js,page/figure_fallback.js shot
```
A third argument saves a screenshot after each script (`shot0.png`, `shot1.png`, ...). Loading the Dust2 demo with its map takes 1 to 3 minutes.

Page scripts in `page/`:

| Script | Checks | Used for |
|---|---|---|
| `demo_timing_probe.js` | Snapshot gaps, how often positions repeat | 0.8.0 |
| `snapshot_timing_jitter.js` | Whether evened-out snapshot times fit movement better | 0.8.0 |
| `smoothness_and_frame_cost.js` | Aim and movement jolts in Player's eyes over six 10-second stretches, and the viewer's own work per frame | 0.8.0 numbers |
| `overlays_grenade.js`, `overlays_smoke.js`, `eyes_view_kill.js`, `modes_and_toggles.js` | Reused grenade, smoke and kill-line objects; every view and camera at 8x; the toggles | 0.8.0 |
| `scope_and_sniper_kills.js`, `scope_final.js` | Looking through the scope at an AWP kill; the Kills list | 0.10.0, 0.10.1 |
| `scope_style_render.js` | Renders a scope style; set `window.__variant` to `'game'` or `'clean'` in a script run just before it | docs/scope-designs.png |
| `sniper_kill_list.js` | Sniper kills in the live rounds (with `DEMO=tuscan MAP_NEEDED=0` for Tuscan) | 0.10.0 |
| `aim_at_sniper_kills.js`, `aim_bias_headshots.js` | How far the crosshair is from the victim at kills, and whether misses lean one way | CHANGELOG 0.10.0, "Discussed, not changed" |
| `see_through_walls.js`, then `team_colours.js`, then `figure_fallback.js` | Bodies through walls only for hidden players; Team colours on every model; plain figures when model files are missing. Run in this order, in one go: each picks up where the previous one left off. | 0.11.0 |
| `reset_view.js` | Reset view from Player's eyes, Behind player and a moved free camera, in 2D, 3D and split view. Run it on its own: after `modes_and_toggles.js` it fails, since that leaves the view changed | 0.12.2 |
| `new_demo_settings.js` | Opening another demo (needs the Dust2 and 2006 Train demos): viewing settings kept, speed back to 1x, paused | 0.12.3 |
| `kill_timing_and_lists.js` | Kills moved to the killing shot, the 1-surface gun rule, the wallbang list, kill feed icons, the clicked row (run with `DEMO=noa.penta` and `DEMO=dust2`) | 0.13.0 |
| `kill_labels.js` | Round and round timer of the kills whose wallbang result changed in 0.13.0 | 0.13.0 |
| `lists_kills.js`, `lists_rounds.js`, `lists_players.js` | The clicked, playing-now, current-round and followed-player highlights, for screenshots | 0.13.0 |
| `pov_demo.js`, then `summary_open.js`, `summary_read.js` | A POV demo that switched maps (`DEMO=gp-[pub]`): map, rounds, the notes in the load summary, the smooth countdown bar | 0.13.0 |
| `clear_saved_open.js`, then `clear_saved_check.js` | Clear saved files with a demo open goes back to a first visit | 0.13.0 |
| `smoke_from_events.js` | Grenades by source (objects or the game's events), and one smoke seen in 3D before and after it pops. Set `window.__smokeAt` (demo seconds) in a script run just before it to pick the smoke (run with `DEMO=anexis` and `DEMO=dust2`) | 0.14.0 |
| `players_names_dead.js` | Players tab: shortened names, full names on hover, skulls for dead players, nothing cut off | 0.14.0 |
| `free_cam_start.js` | Free camera from Player's eyes, Behind player and V starts at the player; dragging keeps the exact view. Moves the camera, so run `reset_view.js` in a separate run | 0.14.0 |
| `summary_stays_closed.js` | The load summary card closed while checking stays closed | 0.14.0 |
| `match_detail.js` | Score, every live round with its winner, rounds dropped as team swaps or after the match, and every player's K-D overall, on T and on CT | 0.14.2 |
| `summary_and_teams.js` | The load summary's lines (rounds read and counted), team names, the Rounds tab note and faded rows, with Count them switched on and off again (run with `DEMO=fnatic_vs_eg MAP_NEEDED=0`) | 0.14.2 |
| `aim_shown_at_kills.js` | How far the crosshair is from the victim's head at headshot kills, as Player's eyes draws them | 0.14.3 |
| `match_summary.js` | Score, live rounds, first live round, starting sides and Players tab names, for comparing versions across all demos (run with `MAP_NEEDED=0`) | 0.14.1 |
| `join_detail.js`, `join_rounds.js` | A map joined from its parts (set `window.__parts` to parts of the file names, in order, in a script run just before): score, rounds and K-D like `match_detail.js`; and every round with its part, stretch, scoreboard, kills, and whether it counts or why not (run with `MAP_NEEDED=0`) | split maps (wip) |
| `placeholder_names.js` | Two players who used the same placeholder name in the warmup stay two people: gives two live players the warmup name "Player" and recounts (run with `DEMO=1110091449 MAP_NEEDED=0`, Na`Vi vs FX, Train, SEC 2011 final, whose Steam IDs are all "0") | split maps (wip) |
| `split_summary.js`, `split_card_open.js`, `split_card_swap.js`, `split_card_fix.js`, `split_join_go.js`, `split_wrong_map.js`, in that order | The split map screens on a part opened alone (`DEMO=1104240112` for Inferno part 2): the summary line, the Join card, a wrong order and the suggested one, joining, adding another map. Add `shot` for screenshots | split maps (wip) |
| `split_remember.js` | After `split_join_go.js`: opening a part opens the joined map, Split them opens the part playing alone and forgets the set | split maps (wip) |
| `split_missing.js`, then `split_missing_go.js` | A round in no file, made by removing Inferno part 2's kills before its first marker: the card's check, then the joined Rounds tab and score (`DEMO=1104240025`) | split maps (wip) |
| `wallbang_list.js` | Every wallbang (round, timer, killer, gun, headshot, victim), waiting for the map to load even with `MAP_NEEDED=0`, for comparing two builds with `compare_all.sh` | 0.15.5 |
| `summary_text.js` | The load summary's text, built afresh (for checking its lines across all demos) | split maps (wip) |
| `pov_view.js` (run on `../pov/pov.html`) | POV mode part 1: view frames a second; at the recorder's own gun kills, the middle of the screen against the victim's head; camera buttons hidden and locked; whose eyes the view is in, alive and dead; where shot sounds play from; his own shots and silencer; teammates with HP. Leaves the view on the median kill | POV mode (wip) |
| `pov_crosshair.js` (on `../pov/pov.html`) | The recorder's crosshair gap through his longest spray (rest, 4 shots, last shot, 0.5 and 1.5 s after) and the settings read from config.cfg; leaves the view mid-spray | POV mode (wip) |
| `pov_death_cam.js` (on `../pov/pov.html`) | 2 s after his first death: spectator mode, whose eyes, whether his body is hidden; when first person on a teammate starts. Leaves the view on the death camera | POV mode (wip) |
| `pov_kill_lag.js` (on `../pov/pov.html`) | At his own kills, the aim against the victim drawn 0 to 0.2 s in the past (does the game's interpolation delay need copying? It doesn't) | POV mode (wip) |
| `pov_dead_view.js` (on `../pov/pov.html`) | After his first death, the view in the eyes of the player he spectated, for a screenshot | POV mode (wip) |
| `pov_own_kill.js` (run with `PAGE=../pov/pov.html`) | At the recorder's own gun kills in a POV demo: how far the victim's head is from his aim in Player's eyes, then the view left on the median kill (`window.__killN` picks another) | POV mode (wip) |
| `pov_trial.js`, then `pov_2d.js` | A POV demo as the viewer handles it today: the load summary, the recorder (found by name) and whether his position is real, following him, how many players have a position through the match; then the 2D radar mid-demo for a screenshot (`DEMO=match-1_de_barcelona-ts`, `DEMO=match-3`) | POV trial, 3 Oct 2026 |
| `late_kill_timing.js` | Late kills shown at the victim's death sound (NoA vs Pentagram, Train 2006); run through `late_kill_timing_check.py` | 0.16.0, guards 0.15.5 |
| `free_cam_nearest.js` | Free camera to Player's eyes, Behind player and V with nobody picked follows the player nearest the middle of the view; a picked player stays (`DEMO=1110091531`, Dust2) | 0.16.0 |
| `hp_line_far.js` | The "HP · weapon" line under every name with the camera over 2,500 units away (`DEMO=1110091531`) | 0.16.0 |

Stand-alone checks:

| Script | Checks | Time |
|---|---|---|
| `theatre_test.py <page> <label> <width> <height> <scale>` | 39 Theatre mode checks with a real mouse and keyboard, for one screen setup | about 10 minutes |
| `theatre_all_setups.sh` | The above for five setups: 14-inch and 13-inch MacBook (2x), Windows at 100%, 125% and 150% | about 45 minutes |
| `theatre_side_panel_test.py`, `theatre_together_test.py` | The 0.9.1 and 0.9.2 checks: the side panel doesn't bring in the header; all panels come and go together | about 5 minutes each |
| `start_screen_check.py` | Theatre and Full screen are greyed out before a demo is open (no Half-Life folder needed) | under a minute |
| `folder_row_test.py` | The Half-Life folder row (0.12.0, 0.12.1): first visit, picking, changes applied by themselves, Reconnect, opening by itself on the next visit, wrong folders and no demos, Clear saved files, dropping a demo with no folder, the ordinary folder pick, and the page inside a frame from another site. Uses a stand-in for Chrome's folder access, since its picker and prompts can't be driven headless (no Half-Life folder needed) | under a minute |
| `demo_search_check.py [page] [screenshot]` | The search box over the demo list (0.15.2): hidden before a folder is chosen, filtering by every word typed, the "N of M" count, highlighting, the no-match line, Esc and Clear, opening a filtered row. Needs `HALF_LIFE_DIR` (demos only, no maps) | under a minute |
| `prefs_check.py` | Viewing settings restored on the next visit, and defaults when the saved ones are damaged (no Half-Life folder needed) | a few seconds |
| `late_kill_timing_check.py [page]` | Fails (exit code 1) if late kills in NoA vs Pentagram, Train 2006, stop being shown at the victim's death sound (0.15.5): all 135, and R22 0:55 neo on ave with the kill feed at the shot, just before and at the death sound. Needs `HALF_LIFE_DIR` with that demo (no map). Run on every release | about a minute |
| `compare_all.sh OUT PAGE_A [PAGE_B] [SCRIPT]` | A page script (default `page/match_summary.js`) on every demo in `HALF_LIFE_DIR`, 6 at a time. With two pages (main's build and a branch, say `git show origin/main:index.html > old.html`) it lists the demos whose results differ; with one it collects the results, for checking a fresh batch against known scores and K-D (`page/match_detail.js` gives round by round and T/CT). Needs no maps | about 4 minutes for 25 demos |

## Demo data probes (Node)

For finding out what a demo file records, without the browser. `make_probe.py` writes `demo_probe.mjs`, a copy of `src/demo.js` with a few lines added to count user messages and log changes to extra player fields.

```
cd tests/demo-probes
python3 make_probe.py
node zoom.mjs ~/Downloads/Half-Life/cstrike/<demo>.dem
```

| Script | Finds |
|---|---|
| `run.mjs` | Which user messages the demo has, and which fields it stores per player |
| `fields.mjs` | Which extra player fields change when zoom clicks happen (none do) |
| `zoom.mjs` | Zoom click sounds and how many sniper kills have one just before |
| `resume.mjs` | Clicks between consecutive AWP shots (does the scope come back by itself?) |
| `qs.mjs` | Whether single clicks between shots follow a weapon switch (the knife quick-switch) |
| `bullets.mjs`, `bullets_hs.mjs`, `bullets_sweep.mjs` | What weapon fire events carry (spread, recoil); how close a rebuilt killing bullet passes to the victim's head; whether shifting aim or victim by a snapshot helps. `make_probe.py` adds the event capture (bullet marks check, 1 Oct 2026) |
| `pov_own_check.mjs` (run `python3 make_pov_probe.py` first) | The recorder's track in a POV demo against the camera block written every frame: position gap, speeds, crouch flag against camera height, yaw and pitch against his own mouse aim | POV mode (wip) |
| `pov_probe.mjs` (run `python3 make_pov_probe.py` first), `pov_raw.mjs` | What a POV demo stores beyond HLTV: the recorder's own view every frame (camera, aim, recoil, health, buttons), zoom from clientdata, weapon animations, voice packets, models listed, players per snapshot; `pov_raw.mjs <demo> <frame number>` prints the raw 464-byte view block, to check the field positions | POV trial, 3 Oct 2026 |
| `kill_lag.mjs` | How late each kill message arrives after the victim's death sound, the killer's last shot and the victim's health reaching 0 (0.13.0). Needs `cp ../../src/demo.js demo.mjs` |
| `wallbang_timing.mjs` | The viewer's wallbang rules rebuilt outside the page; lists the kills whose result changes when late kills are re-timed (0.13.0). Needs `demo.mjs` and `cp ../../src/bsp.js bsp.mjs`; run as `node wallbang_timing.mjs <demo> <map.bsp>` |

0.14.0 probes (run `python3 make_probe.py` first; it also writes `demo_probe_count.mjs` and `nades_fn.mjs`, the page's grenade code):

```
node nade_events.mjs <demo>              # grenade objects, createsmoke events, pop and explosion sounds
node entity_count.mjs <demo>             # objects each snapshot states vs. read (de_tuscan sits at the 256 limit)
node nadecheck.mjs <demo> [from] [to]    # grenades as the page builds them, by source; lists those between two demo times
node per_round.mjs <demo> <player>       # every round: winner, the player's side, kills and deaths (own suicides left out), restarts between
node sum_rounds.mjs <demo> <player> "label=1-15;label=16-30"   # the player's K-D and round wins over chosen rounds
node rounds_and_people.mjs <demo>        # 0.14.1: server messages, every round with its winner and score, restarts, and each connection's names
```

## Testing on Sujan's Mac files from a cloud session

The Claude session runs on a cloud machine, while the files are on the Mac. On 3 Oct 2026 the folder was reached through the linked desktop app: access granted to `~/Downloads/Half-Life` only, then everything but the demos packed into one archive (`_claude_transfer/assets.tar.zst`, 227 MB, made on the Mac with `tar` and `zstd`) and copied over together with the 31 demos, and unpacked on the test machine. The Mac's sandboxed shell can't download a browser, so the tests themselves run on the cloud machine. The `_claude_transfer` folder was left in the Half-Life folder (the session couldn't delete files there without asking) and Sujan deleted it on 3 Oct 2026. Next time, ask for delete permission (the device's delete permission prompt) and remove it at the end of the session, or ask Sujan first.

## Lessons

- The headless browser draws 3D without a graphics chip, so it's slow. Checks that wait a fixed time can fail there and pass on a real machine: wait for the outcome instead, and confirm timing failures by hand before chasing them. The one Theatre check that failed on the 14-inch setup worked on a real MacBook.
- Give an estimate before long runs. One full Theatre round across five setups takes about 45 minutes.
- Parallel runs of `harness.py` need a copy of the page each: it writes `_test_<page name>` beside the page and deletes it at the end, so two runs on one page name break each other (`compare_all.sh` does this). Found 2 Oct 2026.
- A page script that opens another demo and waits for it must wait for a new demo object (`D !== old`), not just for `D.parts` or `M`: those still hold the previous demo's values until its counting has run, so the check passes early and reads old numbers. Found 2 Oct 2026, twice.
