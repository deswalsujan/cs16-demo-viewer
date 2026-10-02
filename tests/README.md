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

The test demos used so far are Na`Vi vs FX on Dust2 (SEC 2011 final) and Fnatic vs mousesports on Tuscan.

## Demos and their events

Every demo used in testing, with the event it's from, so a lost demo can be found again. Some were deleted from Sujan's Mac on 2 Oct 2026 (the list is in CLAUDE.md, "Sujan's files"); they stay here so they can be found again. Notes in CHANGELOG.md and IDEAS.md name the event along with the demo (rule in CLAUDE.md). "Demo text" means the event's name is in the demo itself: the game server's name in admin messages, or the HLTV server's name (read 2 Oct 2026 with a probe over every demo on Sujan's Mac).

| Demo file | Event | How we know |
|---|---|---|
| `navi-vs-fx-sec2011-final-1110091449-de_train.dem`, `...-1110091531-de_dust2.dem` | SEC 2011, final (9 Oct 2011) | Sujan; demo text "SEC #2 \| ProGamers.pl"; file name |
| `mtw-vs-lions-dhs11-1106191044-de_nuke.dem` | DreamHack Summer 2011 (19 Jun 2011) | Sujan; demo text "DHS Main tournament #1" |
| `fx-vs-mtw-xperia2011-1104240025-de_inferno.dem`, `-1104240112-de_inferno.dem` (Inferno, parts 1 and 2), `-1104240212-de_nuke.dem`, `-1104240242-de_nuke.dem` (Nuke, parts 1 and 2) | Xperia Play 2011 (24 Apr 2011) | file name |
| `sk-vs-dateam-iolfinal4-1106181158-de_dust2.dem` | IOL Final4 (18 Jun 2011) | demo text "IOL FINAL4 SM-FINAL #1"; file name |
| `sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem` | IEM6 Global Challenge New York, final (16 Oct 2011) | demo text "IEM Global Challenge New York Server 1"; [HLTV.org's report](https://www.hltv.org/news/7636/sk-win-iem6-gc-new-york) |
| `FX-vs-sk-iem5-inf.dem` | IEM5 (January 2011) | file name; Sujan (0.14.1) |
| `auto_ifng-1103030950-de_dust2.dem` (iFNG FX vs fnatic) | Intel Extreme Masters, 3 Mar 2011; which stage isn't checked | demo text "Intel Extreme Masters #Stage"; date from the file name |
| `fnatic_vs_EG_EM3Global-0903061800-de_dust2.dem` | EM3 Global Finals (6 Mar 2009) | file name only |
| `mym.sk.bronzedecider-0805111924-de_inferno.dem` | Kode5 2008, grand final, bronze decider (11 May 2008) | demo text "Kode5 Grand Final server #2"; file name |
| `PGL.DreamHack_Bucuresti_2012.03-Winner.Anexis.vs.fnatic.HLTV.3.de_tuscan.dem` | DreamHack Bucuresti 2012 (PGL) | demo text (HLTV server "DreamHack Bucuresti 2012:3"); file name |
| `1110231216--auto_de_tuscan.dem_Fnatic-vs-mousesports.dem`, `1110231453--auto_de_nuke.dem_AGAIN-vs-ALTERNATE.dem`, `1110231530--auto_de_tuscan.dem_Lions-vs-Mousesports.dem`, `1110231538--auto_de_inferno.dem_ALTERNATE-vs-AGAIN.dem`, `1110231614--auto_de_mirage.dem_Moscow-5-vs-NAVI.dem`, `1110231623--auto_de_dust2.dem_AGAIN-vs-ALTERNATE.dem`, `1110231835--auto_de_mirage.dem_Mousesports-vs-SK.dem`, `1110241407--auto_de_inferno.dem_mousesports-vs-AGAIN.dem`, `de_mirage.dem_Z-Antwerp-Aces-vs-LIONS-E-SPORT.dem`, `de_nuke.dem_Fnatic-vs-ALTERNATE.dem` | ESWC 2011 (Paris, 21 to 24 Oct 2011) | demo text "[AdminBot 9.1] ESWC 2011 Grand Final." The bot says "Grand Final" in every one of these, group games too, so it doesn't tell the stage. Moscow 5 vs Na`Vi also from [HLTV.org's match page](https://www.hltv.org/matches/1901911/natus-vincere-vs-moscow-five-eswc-2011); mousesports vs AGAiN Inferno is the final |
| `2006-07-02_15h00_Team3D_Fnatic-0607021359-de_train.dem` | ESWC 2006, probably (2 Jul 2006) | HLTV server name "HLTV-ESWC" and the date in the file name; not checked further |
| `de_inferno.dem_mousesports-vs-Virus-.dem` | ESWC 2011 | demo text "CS 1.6 ESWC #2 by Verygames", read frame by frame (the file has no index, so the viewer can't open it yet; see IDEAS.md, "Tell exactly why a demo is broken") |
| NoA vs Pentagram, Train, 2006 (Windows only) | not known | |
| GP Pub de_zovine POV demo (Windows only, `GP-[PuB]_M-[de_zovine]_D-[10_01_2026]_T-[19_08].dem`) | none: a public server game Sujan recorded on 1 Oct 2026 | |

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
| `summary_text.js` | The load summary's text, built afresh (for checking its lines across all demos) | split maps (wip) |

Stand-alone checks:

| Script | Checks | Time |
|---|---|---|
| `theatre_test.py <page> <label> <width> <height> <scale>` | 39 Theatre mode checks with a real mouse and keyboard, for one screen setup | about 10 minutes |
| `theatre_all_setups.sh` | The above for five setups: 14-inch and 13-inch MacBook (2x), Windows at 100%, 125% and 150% | about 45 minutes |
| `theatre_side_panel_test.py`, `theatre_together_test.py` | The 0.9.1 and 0.9.2 checks: the side panel doesn't bring in the header; all panels come and go together | about 5 minutes each |
| `start_screen_check.py` | Theatre and Full screen are greyed out before a demo is open (no Half-Life folder needed) | under a minute |
| `folder_row_test.py` | The Half-Life folder row (0.12.0, 0.12.1): first visit, picking, changes applied by themselves, Reconnect, opening by itself on the next visit, wrong folders and no demos, Clear saved files, dropping a demo with no folder, the ordinary folder pick, and the page inside a frame from another site. Uses a stand-in for Chrome's folder access, since its picker and prompts can't be driven headless (no Half-Life folder needed) | under a minute |
| `prefs_check.py` | Viewing settings restored on the next visit, and defaults when the saved ones are damaged (no Half-Life folder needed) | a few seconds |
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

## Lessons

- The headless browser draws 3D without a graphics chip, so it's slow. Checks that wait a fixed time can fail there and pass on a real machine: wait for the outcome instead, and confirm timing failures by hand before chasing them. The one Theatre check that failed on the 14-inch setup worked on a real MacBook.
- Give an estimate before long runs. One full Theatre round across five setups takes about 45 minutes.
- Parallel runs of `harness.py` need a copy of the page each: it writes `_test_<page name>` beside the page and deletes it at the end, so two runs on one page name break each other (`compare_all.sh` does this). Found 2 Oct 2026.
- A page script that opens another demo and waits for it must wait for a new demo object (`D !== old`), not just for `D.parts` or `M`: those still hold the previous demo's values until its counting has run, so the check passes early and reads old numbers. Found 2 Oct 2026, twice.
