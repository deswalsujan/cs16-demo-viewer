# Working on this repo

Notes for Claude sessions, so nothing is lost between chats and machines.

## Before changing anything
- Read README.md, CHANGELOG.md and IDEAS.md first. IDEAS.md starts with the checklist of everything open; CHANGELOG.md says what was built, how it was tested, and what was "Discussed, not changed".
- Discuss issues with Sujan before changing code when he asks for that, and show a side-by-side image of any visible change before building it (see `docs/` for the approved ones).
- Warn before anything that runs a long time (a full test run, a big measurement), or stop partway to ask.

## How each change ships
1. Change `src/`, then `python3 build.py` (writes `index.html` and `dist/artifact.html`).
2. Bump `VERSION` for anything user-facing; add a CHANGELOG entry (Fixed / Changed / Added, "How it was tested", "Discussed, not changed") and update "Known limits" at the top.
3. Move built items out of IDEAS.md and add new loose ends to its checklist.
4. Test in the headless browser on Sujan's real files (`tests/README.md`), and run `folder_row_test.py`, `start_screen_check.py` and `prefs_check.py`.
5. Commit, push to main (GitHub Pages deploys from it), and republish the claude.ai artifact https://claude.ai/artifact/KHjQXfeVe17XXPrqarFDrS from `dist/artifact.html`.

## Facts
- Verify factual claims before stating them, and say plainly when unsure.
- **Guns:** before saying what a gun can or can't do (wallbangs, penetration, damage), read that weapon's own code in ReGameDLL (`regamedll/dlls/wpn_shared/wpn_<gun>.cpp`, and `FireBullets3` / `FireBullets` in `cbase.cpp`), never a general number. ReGameDLL is a reverse-engineered copy of CS 1.6's game code. Sujan's in-game checks outrank code readings. (Rule set 1 Oct 2026 after a wrong claim that the USP could wallbang thin cover; it can't.)
- Never bundle or host Valve's files. Everything game-related (maps, overviews, models, sounds, kill feed icons) is read from the player's own Half-Life folder.

## Sujan's files
- Windows: `D:\SteamLibrary\steamapps\common\Half-Life`. Mac: `~/Downloads/Half-Life`, a copy made before 2 Oct 2026, so it lacks the GP Pub POV demo and `cstrike_downloads/maps/de_zovine.bsp`.
- **Which demos are where:** `tests/README.md`, "Demos and their events", is the one list: every demo with its event, how the event is known, which machine has it (Mac, Windows) and its status (regression set, new batch with date, deleted with date). Update that table whenever demos are added or deleted; don't keep a second list here.
- From 2 Oct 2026 both machines have the same 16-demo regression set (the confirmed K-D and score numbers are in CHANGELOG.md, 0.14.2). The 102 MB mousesports vs Virus demo (ESWC 2011) was broken, confirmed by Sujan, and is deleted; the reason is kept in the table and IDEAS.md.
- The demo set is growing (2 Oct 2026): Sujan is adding a fresh batch to both machines for an accuracy check (IDEAS.md, top of the checklist), run in a new chat on Windows. Add each new demo to the table; keep the regression set.
- Work that shipped is on main; the `wip/split-maps` branch is merged (0.15.0) and points at the same commit as main.
- **Name the event with every demo** in notes, commit messages and messages to Sujan ("Na`Vi vs FX, Train, SEC 2011", "mTw vs Lions, Nuke, DreamHack Summer 2011"), so a lost or deleted demo can be found again. The events are listed in `tests/README.md` ("Demos and their events"); add new demos there, and say how the event is known (Sujan, the demo's own text, the file name, a web source). Rule set 2 Oct 2026.
- Mockups waiting for approval go in `docs/proposed/`, and move to `docs/` once approved.
- Work not yet shipped lives on a `wip/...` branch, with an "In progress" entry at the top of CHANGELOG.md saying what's built and what's left.
- Writing style for docs and messages: plain words, no em dashes, no "not X but Y" framing.
