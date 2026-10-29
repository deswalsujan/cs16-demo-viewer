# Working on this repo

Rules for agents working in this repo, so nothing is lost between chats and machines. Claude Code loads this file and `STATE.md` (what's open, what's decided) through `CLAUDE.md`; other tools read this file directly.

## Before changing anything
- `STATE.md` is already loaded (Claude Code imports it; with another tool, read it first). Then read the "Known limits" section of CHANGELOG.md and its last two release entries, then only the IDEAS.md item you are about to touch. IDEAS.md starts with the checklist of everything open; CHANGELOG.md says what was built, how it was tested, and what was "Discussed, not changed".
- Don't read CHANGELOG.md end to end, or all of IDEAS.md: they are long, and `STATE.md` says which part matters.
- Discuss issues with Sujan before changing code when he asks for that, and before building any visible change, ask whether he wants to see a mockup first; make one only when he says yes (see `docs/` for the approved ones). Rule set 2 Oct 2026, replacing "always make a side-by-side image".
- Warn before anything that runs a long time (a full test run, a big measurement), or stop partway to ask.
- Think about the user experience in every change (Sujan, 25 Oct 2026): what a first-time user sees, whether a feature or option needs a tooltip, and whether the UI could be simpler. Open UX items are under "User experience" in IDEAS.md.

## How each change ships
1. Change `src/`, then `python3 build.py` (writes `index.html` and `dist/artifact.html`).
2. Bump `VERSION` for anything user-facing; add a CHANGELOG entry (Fixed / Changed / Added, "How it was tested", "Discussed, not changed") and update "Known limits" at the top.
3. Move built items out of IDEAS.md and add new loose ends to its checklist.
4. Test in the headless browser on Sujan's real files (`tests/README.md`), and run the six checks: `folder_row_test.py`, `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py`, `late_kill_timing_check.py` (guards the 0.15.5 late-kill timing, added 3 Oct 2026) and `panel_click_check.py` (marked "Run on every release" in `tests/README.md`). The first three need no game files; the last three need `HALF_LIFE_DIR` with Sujan's demos.
5. Commit, push a branch and open a pull request; Sujan merges it on GitHub (GitHub Pages deploys from main). Then republish the claude.ai artifact https://claude.ai/artifact/KHjQXfeVe17XXPrqarFDrS from `dist/artifact.html` (Sujan, 29 Oct 2026).

## Recording what Sujan confirms
- When Sujan says something is checked, done or decided, in that same turn and on the current branch: change its line in `STATE.md` (a replaced decision moves to Superseded, with the date and what replaced it), tick or change the IDEAS.md item, and push it, even when he says "just answer" or "don't act": writing down his answer is not acting on it. Unrecorded confirmations come back as open items in the next session (3 Oct 2026: the 0.13.0 in-game wallbang check and the scope comparison were asked about twice).
- When a claude.ai review page returns answers, copy the answers into the repo in the same turn (the IDEAS.md item, and `STATE.md` for a decision); the page URL stays only as a link to the pictures.
- When a confirmation could match more than one open item (two lists of "removed wallbangs"), ask which one before ticking, and quote the item's name back.
- In messages listing open items, say what each check is in one line (what to open, what to look for), not only its release number.

## Facts
- Verify factual claims before stating them, and say plainly when unsure.
- **Guns:** before saying what a gun can or can't do (wallbangs, penetration, damage), read that weapon's own code in ReGameDLL (`regamedll/dlls/wpn_shared/wpn_<gun>.cpp`, and `FireBullets3` / `FireBullets` in `cbase.cpp`), never a general number. ReGameDLL is a reverse-engineered copy of CS 1.6's game code. Sujan's in-game checks outrank code readings. (Rule set 1 Oct 2026 after a wrong claim that the USP could wallbang thin cover; it can't.)
- Never bundle or host Valve's files. Everything game-related (maps, overviews, models, sounds, kill feed icons) is read from the player's own Half-Life folder.

## Sujan's files
- Windows: `D:\SteamLibrary\steamapps\common\Half-Life`. Mac: `~/Downloads/Half-Life`, a copy of the Windows folder; on 3 Oct 2026 Sujan added de_nuke32, de_zovine, de_forge, de_mirage_32 and css_cache to it, and put back de_tuscan and de_tuscan32 (lost while copying; all checked by listing), so both machines have the same maps. If a Tuscan demo shows no 3D map on the Mac, check `cstrike_downloads/maps/de_tuscan.bsp` first. On 23 Oct 2026 Sujan added de_mirage (map and overview) to the Mac's `cstrike_downloads`; Windows not checked.
- **Which demos are where:** `tests/README.md`, "Demos and their events", is the one list: every demo with its event, how the event is known, which machine has it (Mac, Windows) and its status (regression set, new batch with date, deleted with date). Update that table whenever demos are added or deleted; don't keep a second list or a count here. How the regression set and the new batch came about is at the end of that section.
- POV demos the game records by itself while Sujan plays are not test demos: leave them out of counts and accuracy checks.
- **Ignore any demo whose name starts with `PPG` or `GP`** (e.g. `PPGpub_de_dust2[Cts]_...`, `GP-[PuB]_...`). The game records these automatically while Sujan plays. Don't list them as extra, analyze them or add them to the table. Only analyze or consider a demo when Sujan names it (Sujan, 3 Oct 2026; he named `GP-[PuB]_M-[css_cache]_D-[10_03_2026]_T-[17_29].dem` for the POV checks of 4 Oct 2026).
- **Name the event with every demo** in notes, commit messages and messages to Sujan ("Na`Vi vs FX, Train, SEC 2011", "mTw vs Lions, Nuke, DreamHack Summer 2011"), so a lost or deleted demo can be found again. The events are listed in `tests/README.md` ("Demos and their events"); add new demos there, and say how the event is known (Sujan, the demo's own text, the file name, a web source). Rule set 2 Oct 2026.
- Fonts: Zalando Sans (headings and text) and IBM Plex Mono (file names, numbers, stats), from Google Fonts since 0.15.3. The test machine can't reach Google, so for screenshots with the real fonts serve the files from Fontsource on npm (`npm pack @fontsource-variable/zalando-sans @fontsource/ibm-plex-mono`); the test scripts otherwise replace Google Fonts with nothing.
- Mockups waiting for approval go in `docs/proposed/`, and move to `docs/` once approved.
- **One set of notes, on main** (29 Oct 2026): the POV notes from `wip/pov-mode` are folded into main's IDEAS.md ("POV demos"). Don't add notes on that branch.
- Which branches exist: `git ls-remote --heads origin`; the current version: `VERSION`. Don't restate either here. POV mode is built in `pov/src/` on `wip/pov-mode` (`python3 pov/build.py` writes `pov/pov.html`); `STATE.md` says what's next for it. Notes on past branches are in IDEAS.md, "Moved from CLAUDE.md".
- Work not yet shipped lives on a `wip/...` branch, with an "In progress" entry at the top of CHANGELOG.md saying what's built and what's left.
- Writing style for docs and messages: plain words, no em dashes, no "not X but Y" framing. Feature and button names in **bold**, capitalized as on screen (**See through walls**, **Player's eyes**), in docs, messages and the viewer's own text; no quotes around them (Sujan, 25 Oct 2026, following Microsoft's and Google's style guides).
