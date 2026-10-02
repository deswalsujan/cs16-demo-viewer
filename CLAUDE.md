# Working on this repo

Notes for Claude sessions, so nothing is lost between chats and machines.

## Before changing anything
- Read README.md, CHANGELOG.md and IDEAS.md first. IDEAS.md starts with the checklist of everything open; CHANGELOG.md says what was built, how it was tested, and what was "Discussed, not changed".
- Discuss issues with Sujan before changing code when he asks for that, and before building any visible change, ask whether he wants to see a mockup first; make one only when he says yes (see `docs/` for the approved ones). Rule set 2 Oct 2026, replacing "always make a side-by-side image".
- Warn before anything that runs a long time (a full test run, a big measurement), or stop partway to ask.

## How each change ships
1. Change `src/`, then `python3 build.py` (writes `index.html` and `dist/artifact.html`).
2. Bump `VERSION` for anything user-facing; add a CHANGELOG entry (Fixed / Changed / Added, "How it was tested", "Discussed, not changed") and update "Known limits" at the top.
3. Move built items out of IDEAS.md and add new loose ends to its checklist.
4. Test in the headless browser on Sujan's real files (`tests/README.md`), and run `folder_row_test.py`, `start_screen_check.py`, `prefs_check.py`, `demo_search_check.py` and `late_kill_timing_check.py` (guards the 0.15.5 late-kill timing, added 3 Oct 2026).
5. Commit, push to main (GitHub Pages deploys from it), and republish the claude.ai artifact https://claude.ai/artifact/KHjQXfeVe17XXPrqarFDrS from `dist/artifact.html`.

## Recording what Sujan confirms
- When Sujan says something is checked, done or decided, tick or change the IDEAS.md item in that same turn and push it, even when he says "just answer" or "don't act": writing down his answer is not acting on it. Unrecorded confirmations come back as open items in the next session (3 Oct 2026: the 0.13.0 in-game wallbang check and the scope comparison were asked about twice).
- When a confirmation could match more than one open item (two lists of "removed wallbangs"), ask which one before ticking, and quote the item's name back.
- In messages listing open items, say what each check is in one line (what to open, what to look for), not only its release number.

## Facts
- Verify factual claims before stating them, and say plainly when unsure.
- **Guns:** before saying what a gun can or can't do (wallbangs, penetration, damage), read that weapon's own code in ReGameDLL (`regamedll/dlls/wpn_shared/wpn_<gun>.cpp`, and `FireBullets3` / `FireBullets` in `cbase.cpp`), never a general number. ReGameDLL is a reverse-engineered copy of CS 1.6's game code. Sujan's in-game checks outrank code readings. (Rule set 1 Oct 2026 after a wrong claim that the USP could wallbang thin cover; it can't.)
- Never bundle or host Valve's files. Everything game-related (maps, overviews, models, sounds, kill feed icons) is read from the player's own Half-Life folder.

## Sujan's files
- Windows: `D:\SteamLibrary\steamapps\common\Half-Life`. Mac: `~/Downloads/Half-Life`, a copy made before 2 Oct 2026, so it lacks `cstrike_downloads/maps/de_zovine.bsp`. The GP Pub de_zovine POV demo was deleted on Windows on 2 Oct 2026. Seven of Sujan's own public-server POV demos went onto the Mac on 3 Oct 2026 for the POV trial (`tests/README.md`, "POV demos"; IDEAS.md, "POV demos").
- **Which demos are where:** `tests/README.md`, "Demos and their events", is the one list: every demo with its event, how the event is known, which machine has it (Mac, Windows) and its status (regression set, new batch with date, deleted with date). Update that table whenever demos are added or deleted; don't keep a second list here.
- The regression set: the 16 demos of 2 Oct 2026 (confirmed K-D and scores in CHANGELOG.md, 0.14.2) plus the new batch, added 3 Oct 2026 once Sujan had checked 0.15.1 by eye (30 demos on the Mac; the warmup-only ESWC 2010 Tuscan file `-1007031520-` was deleted that day, and the Windows copy is Sujan's to delete). The 102 MB mousesports vs Virus demo (ESWC 2011) was broken, confirmed by Sujan, and is deleted; the reason is kept in the table and IDEAS.md.
- 15 new demos ("new batch" in the table) went onto both machines on 2 Oct 2026; the accuracy check on them was done that day on Windows and led to 0.15.1 (results in CHANGELOG.md 0.15.1 and IDEAS.md). The Windows folder was listed again at the end of that session: 31 demos, matching the table. POV demos the game records by itself while Sujan plays are not test demos: leave them out of counts and accuracy checks.
- Open branch: `wip/pov-mode` (POV mode, experimental, from 3 Oct 2026). Its CHANGELOG "In progress" entry says what's built and what's next; Sujan's feedback on it is pending. Everything else is on main. `wip/split-maps` (0.15.0, last commit `bb0c81f`) and `wip/team-swap-and-match-end` (0.14.2, last commit `6503c5b`) were fully merged and deleted on 2 Oct 2026, by Sujan on GitHub (this session's GitHub access can't delete branches). Their commits stay in main's history; a branch can be recreated from its last commit if ever needed.
- **Name the event with every demo** in notes, commit messages and messages to Sujan ("Na`Vi vs FX, Train, SEC 2011", "mTw vs Lions, Nuke, DreamHack Summer 2011"), so a lost or deleted demo can be found again. The events are listed in `tests/README.md` ("Demos and their events"); add new demos there, and say how the event is known (Sujan, the demo's own text, the file name, a web source). Rule set 2 Oct 2026.
- Fonts: Zalando Sans (headings and text) and IBM Plex Mono (file names, numbers, stats), from Google Fonts since 0.15.3. The test machine can't reach Google, so for screenshots with the real fonts serve the files from Fontsource on npm (`npm pack @fontsource-variable/zalando-sans @fontsource/ibm-plex-mono`); the test scripts otherwise replace Google Fonts with nothing.
- Mockups waiting for approval go in `docs/proposed/`, and move to `docs/` once approved.
- Work not yet shipped lives on a `wip/...` branch, with an "In progress" entry at the top of CHANGELOG.md saying what's built and what's left.
- Writing style for docs and messages: plain words, no em dashes, no "not X but Y" framing.
