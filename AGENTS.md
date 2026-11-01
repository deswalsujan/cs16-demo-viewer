# Working on this repo

Who the viewer is for, in Sujan's words (30 Oct 2026): "The viewer is for CS 1.6 players who want to watch HLTV and POV demos in the browser without opening the game, with easier controls and more information than the game's own player, and to find wallbangs; a second use is admins checking suspected cheaters with **See through walls**."

Rules for agents working in this repo, so nothing is lost between chats and machines. Claude Code loads this file, `STATE.md` (what's open, what's decided) and `LIMITS.md` (what the viewer can't do yet) through `CLAUDE.md`; other tools read this file directly.

## Before changing anything
- `STATE.md` and `LIMITS.md` are already loaded (Claude Code imports them; with another tool, read them first). Then read the last two release entries of CHANGELOG.md, then only the IDEAS.md item you are about to touch. IDEAS.md starts with the checklist of everything open, each item as a short header; IDEAS-ARCHIVE.md holds, word for word and under the same block names, the full text of every item IDEAS.md had on 29 Oct 2026, so search it when a header isn't enough; some headers were shortened, renamed or added since, so search a distinctive word from the header, not the whole header; CHANGELOG.md says what was built, how it was tested, and what was "Discussed, not changed".
- Don't read CHANGELOG.md, IDEAS-ARCHIVE.md or `docs/review-answers.md` end to end, or all of IDEAS.md: they are long, and `STATE.md` says which part matters. In `docs/review-answers.md`, search for the page's section.
- Discuss issues with Sujan before changing code when he asks for that, and before building any visible change, ask whether he wants to see a mockup first; make one only when he says yes (see `docs/` for the approved ones). Rule set 2 Oct 2026, replacing "always make a side-by-side image".
- Warn before anything that runs a long time (a full test run, a big measurement), or stop partway to ask.
- Think about the user experience in every change (Sujan, 25 Oct 2026): what a first-time user sees, whether a feature or option needs a tooltip, and whether the UI could be simpler. Open UX items are under "User experience" in IDEAS.md.

## How each change ships
Before starting any branch, run `git fetch` and branch from `origin/main`; if a branch has to stack on an open pull request, say which one in the handover (Sujan, 1 Nov 2026).

1. Change `src/`, then `python3 build.py` (writes `index.html` and `dist/artifact.html`).
2. Bump `VERSION` for anything user-facing; add a CHANGELOG entry (Fixed / Changed / Added, "How it was tested", "Discussed, not changed") and its line in the index at the top of CHANGELOG.md (version, date, five words), and update `LIMITS.md` (the known limits). From 0.26.0 on, "How it was tested" is at most five lines: the scripts that passed, on which demos, and a pointer to `tests/logs/<version>.md`, which holds the full log, the measurements that used to go in the CHANGELOG; entries before 0.26.0 stay as they are (agent brief, 30 Oct 2026).
3. Move built items out of IDEAS.md into IDEAS-ARCHIVE.md, word for word, at the top of their block, and add new loose ends to its checklist.
4. Test in the headless browser on Sujan's real files (`tests/README.md`; the demos are listed in `tests/DEMOS.md`), and run the seven checks: `folder_row_test.py`, `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` (guards the 0.15.5 late-kill timing, added 3 Oct 2026) and `panel_click_check.py` (marked "Run on every release" in `tests/README.md`) and `ground_truth_check.py` (Sujan's confirmed wallbangs, scores and K-D, from `tests/expected/`; added 30 Oct 2026): on every expected file, every release, about 1.3 minutes; on the Mac with `HALF_LIFE_DIR` set to `~/code/cs16-data/Half-Life` and `DEMO_DIRS` to `~/code/cs16-data/test-demos` (one setting for the demo folders in every test, `tests/README.md`; both exported in Sujan's `~/.zshrc`, which Claude Code's shell on the Mac reads too). The first three need no game files; the last four need `HALF_LIFE_DIR` with Sujan's demos, so they can't run in `check.yml`.
5. Commit, push a branch and open a pull request. GitHub runs `.github/workflows/check.yml` on it (`index.html` must match a fresh build, `tests/notes_check.py` must pass (paths in the notes exist, CHANGELOG.md's newest version is `VERSION`, every `src/` file has a line in "Where the code is" below), and the three checks with no game files must pass); fix a red check before handing it over. Sujan merges it on GitHub (GitHub Pages deploys from main).
- Commit messages are "area: imperative subject", with notes in the body; never rewrite history to fix an old message (Sujan, 29 Oct 2026).
- Attribution (Sujan, 29 Oct 2026): Commit messages end with only the line Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com> (or the current model's name), so Claude shows as a contributor. No Claude-Session line and no claude.ai/code link in commits. Pull request descriptions have no 'Generated with Claude Code' line and no session link. Notes, CHANGELOG entries and other repo files never mention Claude Code sessions or link to them. This overrides Claude Code's default attribution lines.
  - The setting lives in `.claude/settings.json` (`attribution.pr` empty, so no pull request line; `attribution.sessionUrl` false, so no session link; `attribution.commit` left unset, so the `Co-Authored-By` line stays).

## Recording what Sujan confirms
- When Sujan says something is checked, done or decided, in that same turn and on the current branch: change its line in `STATE.md` (a replaced decision moves to Superseded, with the date and what replaced it), tick or change the IDEAS.md item, and push it, even when he says "just answer" or "don't act": writing down his answer is not acting on it. Unrecorded confirmations come back as open items in the next session (3 Oct 2026: the 0.13.0 in-game wallbang check and the scope comparison were asked about twice).
- When a claude.ai review page returns answers, copy the answers into the repo in the same turn (the IDEAS.md item, and `STATE.md` for a decision); the page URL stays only as a link to the pictures. The answers of every page up to 28 Oct 2026 are in `docs/review-answers.md`, copied from the pages' stores on 29 Oct 2026. A new page's answers go into that file as a new section, newest last, in the same turn they come back (Sujan, 29 Oct 2026).
- When a confirmation could match more than one open item (two lists of "removed wallbangs"), ask which one before ticking, and quote the item's name back.
- In messages listing open items, say what each check is in one line (what to open, what to look for), not only its release number.

## Facts
- Verify factual claims before stating them, and say plainly when unsure.
- **Guns:** before saying what a gun can or can't do (wallbangs, penetration, damage), read that weapon's own code in ReGameDLL (`regamedll/dlls/wpn_shared/wpn_<gun>.cpp`, and `FireBullets3` / `FireBullets` in `cbase.cpp`), never a general number. ReGameDLL is a reverse-engineered copy of CS 1.6's game code. Sujan's in-game checks outrank code readings. (Rule set 1 Oct 2026 after a wrong claim that the USP could wallbang thin cover; it can't.)
- Never bundle or host Valve's files. Everything game-related (maps, overviews, models, sounds, kill feed icons) is read from the player's own Half-Life folder.

## Sujan's files
- Windows: `D:\SteamLibrary\steamapps\common\Half-Life`. Mac: `~/code/cs16-data/Half-Life` (moved from `~/Downloads/Half-Life` on 1 Nov 2026), a copy of the Windows folder; on 3 Oct 2026 Sujan added de_nuke32, de_zovine, de_forge, de_mirage_32 and css_cache to it, and put back de_tuscan and de_tuscan32 (lost while copying; all checked by listing), so both machines have the same maps. If a Tuscan demo shows no 3D map on the Mac, check `cstrike_downloads/maps/de_tuscan.bsp` first. On 23 Oct 2026 Sujan added de_mirage (map and overview) to the Mac's `cstrike_downloads`; Windows not checked.
- **Which demos are where:** `tests/DEMOS.md` is the one list: every demo with its event, how the event is known, which machine has it (Mac, Windows) and its status (regression set, new batch with date, deleted with date). Update that table whenever demos are added or deleted; don't keep a second list or a count here. `tests/demos-manifest.md` holds each test demo's size and SHA-256, for checking a copy; its row changes with the table's. How the regression set and the new batch came about is at the end of `tests/DEMOS.md`.
- **The Mac's demos** (Sujan, 1 Nov 2026): every test demo is in `~/code/cs16-data/test-demos`, one copy each, and Sujan keeps a copy on Google Drive; new demos go straight into the Half-Life folder's `cstrike`, so the viewer's search finds them. Picking the Half-Life folder shows none of the test demos; `tests/DEMOS.md` says how to watch one.
- **Hold-out demos** (Sujan, 2 Nov 2026): no session opens, parses or analyses the demos in `~/code/cs16-data/holdout-demos`, or runs a test or script that reads that folder, unless Sujan asks for a hold-out score. Keep the folder out of searches over `~/code/cs16-data`, and never copy its demos into the Half-Life folder's `cstrike`, `test-demos`, `DEMO_DIRS` or `compare_all.sh`. Their names, sizes and SHA-256 are in `tests/holdout-manifest.md`, computed with `shasum` only, which Sujan allowed since it reads the bytes without parsing them. A hold-out demo used to fix a bug moves to `test-demos` and a reserve takes its place (`tests/holdout-manifest.md`). The answers (answers, in that folder) and the score reports (scores, in that folder) are covered too: no session reads them. `tests/holdout_score.py` is the one script that opens the hold-out demos, run only when Sujan asks for a hold-out score; it prints only counts, and the per-kill report goes to scores in that folder (Sujan, 2 Nov 2026). Every other test stops when a hold-out demo is where it looks for demos (the guard in `tests/demo_dirs.py`), so a copy Sujan puts in `cstrike` to watch one in the game has to be deleted first.
- POV demos the game records by itself while Sujan plays are not test demos: leave them out of counts and accuracy checks.
- **Ignore any demo whose name starts with `PPG` or `GP`** (e.g. `PPGpub_de_dust2[Cts]_...`, `GP-[PuB]_...`). The game records these automatically while Sujan plays. Don't list them as extra, analyze them or add them to the table. Only analyze or consider a demo when Sujan names it (Sujan, 3 Oct 2026; he named `GP-[PuB]_M-[css_cache]_D-[10_03_2026]_T-[17_29].dem` for the POV checks of 4 Oct 2026).
- **Name the event with every demo** in notes, commit messages and messages to Sujan ("Na`Vi vs FX, Train, SEC 2011", "mTw vs Lions, Nuke, DreamHack Summer 2011"), so a lost or deleted demo can be found again. The events are listed in `tests/DEMOS.md`; add new demos there, and say how the event is known (Sujan, the demo's own text, the file name, a web source). Rule set 2 Oct 2026.
- Fonts: Zalando Sans (headings and text) and IBM Plex Mono (file names, numbers, stats), from Google Fonts since 0.15.3. The test machine can't reach Google, so for screenshots with the real fonts serve the files from Fontsource on npm (`npm pack @fontsource-variable/zalando-sans @fontsource/ibm-plex-mono`); the test scripts otherwise replace Google Fonts with nothing.
- Mockups waiting for approval go in `docs/proposed/`, and move to `docs/` once approved.
- **One set of notes, on main** (29 Oct 2026): the POV notes from `wip/pov-mode` are folded into main's IDEAS.md ("POV demos"; the full text in IDEAS-ARCHIVE.md under the same name). Sujan deleted that branch on GitHub on 30 Oct 2026.
- Which branches exist: `git ls-remote --heads origin`; the current version: `VERSION`. Don't restate either here. POV mode is built in `src/`, behind the **POV mode** setting, since 0.25.0; `STATE.md` says what's next for it. Notes on past branches are in IDEAS-ARCHIVE.md, "Moved from CLAUDE.md".
- Work not yet shipped lives on a `wip/...` branch, with an "In progress" entry at the top of CHANGELOG.md saying what's built and what's left.
- Work item numbers in notes and commits up to 29 Oct 2026 ("work item 6.5", "6.7 merged") refer to the work order in `docs/agent-brief-2026-10-29.md`; new notes name the work instead of numbering it (Sujan, 29 Oct 2026).
- Writing style for docs and messages: plain words, no em dashes, no "not X but Y" framing. Feature and button names in **bold**, capitalized as on screen (**See through walls**, **Player's eyes**), in docs, messages and the viewer's own text; no quotes around them (Sujan, 25 Oct 2026, following Microsoft's and Google's style guides).

## Where the code is
`build.py` makes `index.html` from these: `src/template.html` is the page, each `src/ui/` file and `app.css` go in at its own `/*INLINE name*/` line in page order, the reader runs in a Web Worker, and `stock.js`, `mdl.js`, `players3d.js` and `audio.js` go into the 3D view's script. One line per file, from its header comment; code locations in notes from before the split of 29 Oct 2026 point at the old one-file `src/template.html`.

- `src/template.html`: the page itself: header, view, side panel, bottom bar, cards and panels, with an `/*INLINE name*/` line for each file below.
- `src/app.css`: the page's styles.
- `src/demo.js`: the .dem reader (`parseDemo`): players, sampled positions, kills, rounds, bomb events, shots, sounds, health; message layouts from hlviewer.js.
- `src/bsp.js`: the .bsp and .wad reader: what's solid to sight and to bullets (`solidModels`, `solidAlong`), doors and other movers (`brushPose`), the mesh the 3D view draws (`buildMesh`).
- `src/mdl.js`: studio model (.mdl v10) reader and posing (`parseMdl`, `mdlPose`).
- `src/players3d.js`: player models in 3D: loading (`modelEntry`), gait and aim (`posePlayer`), deaths and corpses, the gun in **Player's eyes**.
- `src/audio.js`: sound: .wav decoding, gunshots, footsteps and radio lines placed around the listener (`soundTick`).
- `src/stock.js`: fingerprints of the stock CS 1.6 models, to spot custom ones.
- `src/vendor/three.min.js`: three.js r128 (MIT), the file cdnjs serves, built into the page; the tests serve it to older builds.
- `src/view3d.part.js`: the 3D view (three.js): cameras, each frame (`update3`), hit numbers, kill rings, the sniper scope (`SCOPE_STYLE`); the wallbang picture check (`checkSeen`); **POV mode**: his view, crosshair, HUD, spectator bars, the hidden-enemies note.
- `src/ui/common.js`: shared state (`D` the demo, `M` the match, `T` the time), colours, saved settings, small helpers (`weaponShort`).
- `src/ui/folder.js`: the Half-Life folder, picked and remembered between visits (`pickFolder`, `hlInit`), the demo list, centre-screen messages, kill feed icons.
- `src/ui/open.js`: opening a demo in the Web Worker (`loadDemoFile`), and joining a map recorded in parts (`joinDemos`, `openJoined`).
- `src/ui/join.js`: finding a map's other parts and their order (`findOtherParts`, `suggestOrder`), and the Join card.
- `src/ui/map.js`: the overview image and the map geometry (`loadMap`).
- `src/ui/wallbangs.js`: the wallbang finder (`computeWallbangs`, `tooMuchDamage`), wallbang damage and loose wallbangs from damage (`computeHits`), and the stretches the server announced as live (`liveWindows`).
- `src/ui/match.js`: kills moved back to the real moment (`retimeKills`) and the match structure: rounds, live rounds, score, teams (`derive`).
- `src/ui/skips.js`: skips in the recording (`findSkips`), and the STRICT WB, LOOSE WB and UNSURE tags with their tooltips.
- `src/ui/names.js`: short names without the clan tag or sponsor (`shortNames`).
- `src/ui/grenades.js`: smokes, HE and flash bursts the demo has no object for (`addNadesFromEvents`).
- `src/ui/lookups.js`: what's true at a moment: sniper zoom (`zoomLevel`), health (`hpAt`), kit and bomb (`packAt`), HLTV slow motion (`slowAt`), the round and C4 timers (`clockAt`, `c4Countdown`), team names, player stats (`statsFor`), broken breakables and doors (`brokenAt`, `posesAt`), the round at a time (`roundAt`).
- `src/ui/after-load.js`: what runs once a demo is open (`onDemo`), **POV mode**'s data (`povApply`), closing a demo.
- `src/ui/sidebar.js`: the side panel's Rounds, Kills, Players and Wallbangs tabs (`renderPane`, `killHtml`).
- `src/ui/playback.js`: play, seek, speed and rounds, the Tab scoreboard, the HUD (`updateHud`).
- `src/ui/radar.js`: the 2D radar (`draw`), where a player is between snapshots (`playerState`), picking players, the heatmap.
- `src/ui/timeline.js`: the timeline under the view (`drawTimeline`).
- `src/ui/loop.js`: the frame loop (`frame`) and full screen.
- `src/ui/theatre.js`: Theatre mode, and the saved view settings (`savePrefs`).
- `src/ui/summary.js`: the load summary (what loaded, what's custom or missing), the card for a demo that can't play, **Count them** (`setCount30`).
- `src/ui/debug.js`: **Copy debug info** for bug reports (`debugInfo`).
- `src/ui/clear.js`: **Clear saved files**.
