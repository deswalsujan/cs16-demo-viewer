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
- Test demos: Na`Vi vs FX Dust2 and Train (2011), mTw vs Lions Nuke, SK vs WinFakt Mirage and other Mirage demos, NoA vs Pentagram Train (2006, protocol 47, has late kill messages), Team3D vs Fnatic Train (2006), the GP Pub de_zovine POV demo (1 Oct 2026). For K-D and score checks (numbers Sujan confirmed are in CHANGELOG.md, 0.14.2): IOL Final SK vs Dateam Dust2, the Xperia Play FX vs mTw Inferno and Nuke (two files each), fnatic vs EG EM3 Dust2, iFNG FX vs fnatic Dust2, FX vs SK IEM5 Inferno, MYM vs SK Inferno. The 102 MB mousesports vs Virus demo doesn't load in the test browser within 4 minutes.
- Mockups waiting for approval go in `docs/proposed/`, and move to `docs/` once approved.
- Work not yet shipped lives on a `wip/...` branch, with an "In progress" entry at the top of CHANGELOG.md saying what's built and what's left.
- Writing style for docs and messages: plain words, no em dashes, no "not X but Y" framing.
