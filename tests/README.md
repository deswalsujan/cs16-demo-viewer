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
| `reset_view.js` | Reset view from Player's eyes, Behind player and a moved free camera, in 2D, 3D and split view | 0.12.2 |
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
| `match_detail.js` | Score, every live round with its winner, rounds dropped as team swaps or after the match, and every player's K-D overall, on T and on CT | wip |
| `match_summary.js` | Score, live rounds, first live round, starting sides and Players tab names, for comparing versions across all demos (run with `MAP_NEEDED=0`) | 0.14.1 |

Stand-alone checks:

| Script | Checks | Time |
|---|---|---|
| `theatre_test.py <page> <label> <width> <height> <scale>` | 39 Theatre mode checks with a real mouse and keyboard, for one screen setup | about 10 minutes |
| `theatre_all_setups.sh` | The above for five setups: 14-inch and 13-inch MacBook (2x), Windows at 100%, 125% and 150% | about 45 minutes |
| `theatre_side_panel_test.py`, `theatre_together_test.py` | The 0.9.1 and 0.9.2 checks: the side panel doesn't bring in the header; all panels come and go together | about 5 minutes each |
| `start_screen_check.py` | Theatre and Full screen are greyed out before a demo is open (no Half-Life folder needed) | under a minute |
| `folder_row_test.py` | The Half-Life folder row (0.12.0, 0.12.1): first visit, picking, changes applied by themselves, Reconnect, opening by itself on the next visit, wrong folders and no demos, Clear saved files, dropping a demo with no folder, the ordinary folder pick, and the page inside a frame from another site. Uses a stand-in for Chrome's folder access, since its picker and prompts can't be driven headless (no Half-Life folder needed) | under a minute |
| `prefs_check.py` | Viewing settings restored on the next visit, and defaults when the saved ones are damaged (no Half-Life folder needed) | a few seconds |

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
