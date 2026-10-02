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
- The regression set, on both machines from 2 Oct 2026 (16 demos, the only demos on the Mac until the new batch arrives): the four Xperia Play 2011 FX vs mTw files, SK vs Dateam Dust2 (IOL Final4 2011), fnatic vs EG Dust2 (EM3 2009), iFNG FX vs fnatic Dust2 (Intel Extreme Masters 2011), FX vs SK Inferno (IEM5), Na`Vi vs FX Dust2 and Train (SEC 2011), mTw vs Lions Nuke (DreamHack Summer 2011), SK vs WinFakt Mirage (IEM6 New York), NoA vs Pentagram Train (`noa.penta-0610211800-de_train.dem`, protocol 47, 21 Oct 2006 by the file name), and from ESWC 2011 Fnatic vs ALTERNATE Nuke, Fnatic vs mousesports Tuscan and mousesports vs AGAiN Inferno. Deleted from the Mac on 2 Oct 2026 at Sujan's request, and from Windows by Sujan: the other ESWC 2011 demos (AGAiN vs ALTERNATE Nuke and Dust2, Lions vs mousesports Tuscan, ALTERNATE vs AGAiN Inferno, mousesports vs SK Mirage, Z-Antwerp Aces vs LIONS Mirage, Moscow 5 vs Na`Vi Mirage, mousesports vs Virus Inferno), MYM vs SK Inferno (Kode5 2008), Team3D vs Fnatic Train (2006), Anexis vs fnatic Tuscan (DreamHack Bucuresti 2012) and the GP Pub de_zovine POV demo. Their events stay listed in `tests/README.md` so they can be found again.
- Test demos (events and how they're known: `tests/README.md`, "Demos and their events"): Na`Vi vs FX Dust2 and Train (SEC 2011 final), mTw vs Lions Nuke (DreamHack Summer 2011), SK vs WinFakt Mirage (IEM6 Global Challenge New York final), the ESWC 2011 demos (Mirage, Nuke, Tuscan, Inferno, Dust2), NoA vs Pentagram Train (2006, protocol 47, has late kill messages, event not known), Team3D vs Fnatic Train (probably ESWC 2006), the GP Pub de_zovine POV demo (a public server game, 1 Oct 2026). For K-D and score checks (numbers Sujan confirmed are in CHANGELOG.md, 0.14.2): SK vs Dateam Dust2 (IOL Final4 2011), FX vs mTw Inferno and Nuke (Xperia Play 2011, two files each), fnatic vs EG Dust2 (EM3 Global Finals 2009), FX vs fnatic Dust2 (iFNG, Intel Extreme Masters, March 2011), FX vs SK Inferno (IEM5). The 102 MB mousesports vs Virus demo (ESWC 2011) is broken, confirmed by Sujan: its index was never written and it stops 199 bytes into its last frame, so the viewer can't open it yet, though it's all readable frame by frame.
- The demo set is being replaced (2 Oct 2026): Sujan is moving to a fresh batch on Windows for an accuracy check (IDEAS.md, top of the checklist). When the new batch is in, update the lists above and in `tests/README.md`; keep the confirmed-number demos as the regression set.
- Work that shipped is on main; the `wip/split-maps` branch is merged (0.15.0) and points at the same commit as main.
- **Name the event with every demo** in notes, commit messages and messages to Sujan ("Na`Vi vs FX, Train, SEC 2011", "mTw vs Lions, Nuke, DreamHack Summer 2011"), so a lost or deleted demo can be found again. The events are listed in `tests/README.md` ("Demos and their events"); add new demos there, and say how the event is known (Sujan, the demo's own text, the file name, a web source). Rule set 2 Oct 2026.
- Mockups waiting for approval go in `docs/proposed/`, and move to `docs/` once approved.
- Work not yet shipped lives on a `wip/...` branch, with an "In progress" entry at the top of CHANGELOG.md saying what's built and what's left.
- Writing style for docs and messages: plain words, no em dashes, no "not X but Y" framing.
