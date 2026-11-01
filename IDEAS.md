# Ideas

Parked ideas and features we've discussed but not built yet. Each entry keeps enough of the discussion that it can be picked up later without starting over. When something here gets built, it moves to the [changelog](CHANGELOG.md).

Only what is open stays here. An open item keeps a three-line header (Status, Next step, Decided so far; each answer in Decided so far also has its line in `STATE.md`); a parked item keeps one line, since nothing happens until Sujan picks it up. Done items, and the full text of open ones, go to [IDEAS-ARCHIVE.md](IDEAS-ARCHIVE.md) word for word, under the same section and block names (since 29 Oct 2026). A section that older notes, code comments, `tests/README.md` or `tests/DEMOS.md` point to and that isn't here, such as "Tell exactly why a demo is broken", is in the archive under the same name.

## Open follow-ups (checklist, updated 2 Nov 2026, 0.26.6)

Everything raised in conversation that isn't finished, in one place. Each item says who does it. Ideas for new features are further down; this list is for loose ends.

**Sujan's feedback of 1 Nov 2026** (from watching Na`Vi vs SK, Inferno, ESWC 2011; AGAiN vs Na`Vi, Train, recorded 24 Oct 2011; SK vs Na`Vi, Train, DreamHack Winter 2011; investigated by Claude the same day on 0.26.4; Sujan answered 2 Nov 2026; demos and events in `tests/DEMOS.md`)
- Done, in the archive: SeDaN on fox LOOSE confirmed by eye; the round keys, the Kills tab's scroll, // in the Wallbangs list and the round timer across a pause (0.26.5); EdwardwOw~ on Delpan (LOOSE with a known gap) and a minimum damage for LOOSE (none), closed 2 Nov 2026; **See-through cover hides the victim** (0.26.6).
- [ ] **A file that starts during a round: its kills read freeze time** (found 2 Nov 2026 while adding Delpan on markeloff to `tests/expected/`)
  - Status: Na`Vi vs SK, Inferno, ESWC 2011, the third file (`-1110241740-`) starts during a round. Delpan's AWP kill on markeloff in it reads "freeze 0:17" in the Kills and Wallbangs lists, opened alone (R1, demo 0:44) and joined: R31 at demo 69:24 with the first file only, as Sujan watched it, and R37 at demo 81:44 with all three (the second file, `-1110241724-`, holds 6 rounds). A kill can't happen in freeze time; the cause isn't known yet.
  - Next step: Claude finds where the timer comes from in such a file and what it should read; to raise with Sujan, along with which round number is right (R31 or R37).
  - Decided so far: nothing.
- [ ] **77 HP on a kill that looks normal** (SK vs Na`Vi, Train, DreamHack Winter 2011, R23 1:21, demo 44:25, Delpan on markeloff, AWP)
  - Status: STRICT WB, 25 pixels at the shot, 204 at 0.1 s before (what the 3D view draws then) and 1,216 at 0.2 s before. The 77 is the killing bullet alone, the health markeloff had left (0.26.4 gives every wallbang kill its numbers); no hit of the round went through a wall. One AWP body hit took 77 HP; through the train car's side between them (`trainside01-2`, not in the game's materials list, so concrete to a bullet) an AWP body hit keeps about 66 at most. The damage rule lets it through since it takes wood's 0.6 for every wall.
  - Measured 2 Nov 2026 on 0.26.6 (`tests/logs/wall-material-2026-11-02.md`): multiplying every surface on the crosshair line, as the game does, breaks one confirmed answer, Delpan on RashiE (Sweden vs Norway, Dust2, ASUS ENC 2010, R24 1:40, AWP headshot through three concrete surfaces on the line); one surface at its own material fits all 229 answers and changes 2 wallbangs on the 64 demos, this kill and Fox on Zeus (Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011, R5 0:17, AWP body, 74 HP, one concrete wall).
  - Next step: Sujan decides whether to build the one-surface version, and checks Fox on Zeus by eye; nothing built.
  - Decided so far: yes to each wall's own material, measured first (Sujan, 2 Nov 2026); the measurement is a report only, after the see-through fix (Sujan, 2 Nov 2026).
- [ ] **Kill details**: for each kill, how many bullets hit, how many through a wall, damage per bullet and where each hit. The demo says head or body from the hit sound; stomach, chest, arm or leg only as an estimate from the damage. Next step: Claude makes a mockup (Sujan, 2 Nov 2026: mockup first); Claude's suggestion was the picked row in the Kills and Wallbangs lists opening to one line per bullet.
- [ ] **Damage numbers setting** (direct hits only, wallbangs only, or both; today numbers come only for hits through cover), **Vanilla** (one switch for every overlay, the single toggles still working after), and **the red skull for the killing hit** in place of the ✕. Next step: Claude makes mockups of the **View settings** changes (Sujan, 2 Nov 2026: mockup first). Decided so far: what **Vanilla** turns off and keeps (`STATE.md`, Sujan, 2 Nov 2026); the killing bullet ends in a ✕, option A (Sujan, 27 Oct 2026); **Glow on hits** (Sujan, 26 Oct 2026).
- [ ] **Sizes on big screens**: on a 27-inch 2560x1440 screen the labels, buttons, menus and notes are too small; every size is fixed in pixels. Next step: Claude builds it, no mockup (Sujan, 2 Nov 2026); Claude's suggestion was a scale that follows the window plus an **Interface size** setting.

**Damage numbers and the moment a kill is judged** (Sujan, 31 Oct 2026): done, the block is in the archive: the two bugs fixed in 0.26.3 and 0.26.4, and **The moment the finder judges a kill at** closed: the finder keeps judging at the moment of the shot (Sujan, 1 Nov 2026).

**Wallbang ground truth** (30 Oct 2026; `tests/ground_truth_check.py`, `tests/expected/`, rules in `tests/README.md`)
- Done, in the archive: the 10 kills where Sujan's answer and the viewer disagreed (answered 30 Oct 2026); **The 0.5 s window misses a hit at 0.5 s by rounding** (fixed in 0.26.1, 30 Oct 2026).

**Test demos** (1 Nov 2026; `tests/demo_dirs.py`, `tests/demos-manifest.md`)
- The Mac's test demos are in `~/code/cs16-data/test-demos` since 1 Nov 2026, found by every test through `DEMO_DIRS` (`tests/README.md`, "Settings"; `STATE.md`, "Test files on the Mac").
- [ ] **Hold-out set of new demos** (Sujan, 1 and 2 Nov 2026)
  - Status: 11 demos in `~/code/cs16-data/holdout-demos` (Sujan, 2 Nov 2026), never in `cstrike`, `DEMO_DIRS` or `compare_all.sh`, so no change to the viewer is ever tuned on them; their names, sizes and SHA-256 in `tests/holdout-manifest.md` (computed with `shasum` only), and the rule in `AGENTS.md` ("Sujan's files"): no session opens them unless Sujan asks for a hold-out score. No answers or scoring script yet.
  - Next step: Claude proposes the answer format and the scoring script, after the wall material report; Sujan writes his answers for the 4 first demos (marked in `tests/holdout-manifest.md`).
  - Decided so far: a hold-out demo used to fix a bug moves to `test-demos` (with its row in `tests/DEMOS.md` and `tests/demos-manifest.md`) and is replaced by a fresh one (Sujan, 1 Nov 2026); 4 demos get answers first, SK vs tpusports (Tuscan, 2009), Korea vs Moscow (Nuke), Sweden vs China (Inferno) and SK vs EG (Dust2, 2009), and the other 7 are reserves; the answers are his own verdict per kill, normal, strict or loose; the score counts the wallbangs the viewer misses, not only the ones it lists (Sujan, 2 Nov 2026).

**Sliver kills** (30 Oct 2026; built in 0.26.0)
- Done, in the archive: **The sight points see a sliver the picture doesn't** (built in 0.26.0, 30 Oct 2026: strict at 0 pixels, LOOSE from 1 to 49); **Railings and Nuke vents** (railings built in 0.26.0; the vent exception withdrawn, 30 Oct 2026); **Sliver kills, by eye (0.26.0)** (confirmed by Sujan, 31 Oct 2026).
- [ ] **One line for strict: 0 pixels for hidden kills too?** (for later, Sujan, 30 Oct 2026)
  - Status: kills the finder's sight points call hidden read strict under 50 pixels of the victim in the picture (0.23.0), but sliver kills need 0 pixels for strict (0.26.0), so two kills with the same picture can get different tags.
  - Next step: Claude, later: check whether 0 pixels should be the strict line for both, against Sujan's answers in `tests/expected/` (which hidden kills at 1 to 49 pixels he answered, and whether he called them strict or loose); then Sujan decides.
  - Decided so far: hidden kills strict under 50 pixels, LOOSE from 50 (Sujan, 25 Oct 2026); sliver kills strict at 0, LOOSE from 1 to 49 (Sujan, 30 Oct 2026).

**Sujan's feedback of 23 Oct 2026** (HLTV viewer; built in 0.22.0 unless said; demos and events in `tests/DEMOS.md`)
- Done, in the archive: **Republish the claude.ai viewer**, closed 29 Oct 2026 without republishing (the claude.ai copy stays at 0.23.0, GitHub Pages is the only live viewer, Sujan 29 Oct 2026); Sujan's answers on the 23 Oct review page (24 Oct 2026, on the 0.22.0 fixes), the three levels of wallbang (0.23.0 and 0.24.0), wallbang hits that didn't kill and the damage per wallbang (0.24.0); **Strict and LOOSE wallbangs, by eye (0.23.0)** and **Light purple for loose wallbangs, by eye (0.24.0)** (checked by Sujan, 31 Oct 2026; THREAT on LoordB moved to **The moment the finder judges a kill at**).
- [ ] **Bug: short names leave a bracket**
  - Status: found 27 Oct 2026, not fixed. "[fnaticMSI.cArn]" reads "cArn]" in the lists and over the players (fnatic vs Moscow Five, Nuke, DreamHack Summer 2011).
  - Next step: Claude fixes `shortNames` in `src/ui/names.js`, which cuts the shared "[fnaticMSI." but not the closing "]".
  - Decided so far: names over the players and in the Kills and Wallbangs lists go without the tag or sponsor; the kill feed, the name bar, the Tab scoreboard and Copy list keep full names (Sujan, 14 Oct 2026, 0.18.0).
- [ ] **Later (Sujan, 26 Oct 2026): a simpler UI, tooltips, feature names in bold in the viewer's own text.** One piece of work with the two items under "User experience" below, and tracked there.

**Sujan's feedback of 14 Oct 2026**: done, every item confirmed by Sujan by eye (0.18.0 to 0.21.1, 14 and 15 Oct 2026); the block is in the archive.

**Wallbangs and kill timing** (0.15.5, 2 Oct 2026): done (0.15.5 and 0.16.0; the denser hidden check closed 5 Oct 2026, with the finder left as in 0.17.0); the block is in the archive. Its branch `wip/denser-hidden-check` (last commit `99c7106`, never merged) was deleted by Sujan on GitHub on 29 Oct 2026; checked the same day with `git ls-remote --heads origin`, which then listed only `main` and `wip/pov-mode`.

**Across both viewers** (raised during the POV work, 4 and 5 Oct 2026)
- Done, in the archive: **Bullet path**, dropped by Sujan 5 Oct 2026 (what its bot test found about wallbangs is kept there).
- Closed 29 Oct 2026 in 0.25.0, when POV mode came into main on main's code (Sujan's answer of 29 Oct 2026: POV mode gets them all), in the archive: **Subtler kill markers at the crosshair**, **Round announcements**, **Defusal kits and the carried bomb on the players**, **The 0.18.0 and 0.18.1 changes**, **C4 timer counting down**, **The 0.22.0 changes**, **Two kills at one moment picked apart in the lists (0.22.2)**, **Strict and LOOSE wallbangs (0.23.0)**. What's left to see of them in a POV demo is in **POV mode in main, by eye (0.25.0)** under "POV demos" below.
- [ ] **Feature names in bold** (was: in single quotes, 5 Oct 2026)
  - Status: the docs follow it since 25 Oct 2026; the viewer's own text not yet.
  - Next step: Claude, together with the tooltips ("User experience" below).
  - Decided so far: **bold**, capitalized as on screen, no quotes, in the viewer's text (tooltips, notes, load summary) and in the docs, following Microsoft's and Google's style guides (Sujan, 25 Oct 2026).
- Closed 29 Oct 2026, in the archive: **The 0.24.0 changes**, when Sujan kept the 0.1 s delay for the other players in POV mode, as in the HLTV viewer (`STATE.md`).

**POV demos** (3 Oct 2026; findings under "POV demos" below)
- The POV checklist from `wip/pov-mode` was folded in on 29 Oct 2026; its done items are in the archive. POV mode goes into main behind a **POV mode** setting, off by default, and on by default for POV demos once Sujan signs it off (Sujan, 29 Oct 2026; work item 6.5, built in 0.25.0, pull request #5). The setting is a **POV mode** checkbox in **View settings** ("for demos recorded by a player"), plus a line with a button in a POV demo's load summary, no mockup; with it off every demo plays exactly as in 0.24.0, the recording player drawn at the map's zero point included (Sujan, 29 Oct 2026). This replaces "goes back into main only if it works as intended" (3 Oct 2026).
- [ ] **POV mode in main, by eye (0.25.0)**
  - Status: in main since 0.25.0 (merged 29 Oct 2026, pull request #5), checked by Claude in the headless browser on the Mac (CHANGELOG.md, 0.25.0); not yet by Sujan.
  - Next step: Sujan, on Windows: tick **POV mode** in **View settings** (or press **Turn on POV mode** in a POV demo's load summary) and open Match 1 CT (public server, de_barcelona, 27 Mar 2025) or one of his own recordings. Look for: the demo opening again at the same moment; his crosshair in the colour and size of his `config.cfg`, at 70%; at his kills, the marker's ticks just past his crosshair's arms; round announcements in the middle ("Target has been saved!"); the HUD's round timer gone after a plant (back right away on a server with `mp_show_bomb_timer 1`); the spectator bars' clock counting the C4 down; the C4 on a carrier's back and a CT's kit on the 3D models, and the C4 on the radar when his game had it (kits never show on the radar, Sujan 5 Oct 2026); **View settings** with only Team colours, Quality and **POV mode**. Then untick it: the demo plays as in 0.24.0, the recording player at the map's zero point.
  - Decided so far: the **POV mode** setting and what POV mode gets, in `STATE.md` (Sujan, 29 Oct 2026).
- [ ] **Kill feed icons in POV mode, on Windows**
  - Status: built 22 Oct 2026 on `wip/pov-mode`, ported from 0.18.0; in main since 0.25.0 (the HLTV viewer's own kill feed, which POV mode now uses); not yet checked by Sujan.
  - Next step: Sujan, with **POV mode** on in main's viewer (not the separate POV page of the deleted `wip/pov-mode` branch any more), any POV demo, and looks at the top right after a kill: orange gun icon, headshot icon on headshots, no "m4a1" or "HS" words.
  - Decided so far: built at Sujan's request in the HLTV viewer's look, no mockup (22 Oct 2026).
- [ ] **The hidden-enemies note is easy to miss**
  - Status: raised by Sujan 5 Oct 2026, apply or park to be decided: when the demo opens, the eye is on the load summary, and the note's box and text are small.
  - Next step: Sujan decides. One idea: show it only after the load summary closes, and larger.
  - Decided so far: option B, a note above **See through walls** (Sujan, 4 Oct 2026), reworded for players 5 Oct 2026 ("This server seems to use an anti-wallhack plugin").
- [ ] **Kills the wallbang finder can't check**
  - Status: the server held the victim back, so he isn't in the file at the kill and there's nothing to trace to: 4 of 31 gun kills in the GP css_cache pub demo of 3 Oct 2026 (Sujan's wallbang at 4:13), and his M4A1 headshot on r`GrimeS at 2:02 in `PPGpub_de_barcelona[Cts]_21-10-2026_15.54.26.dem` (public server, 21 Oct 2026). Left unmarked.
  - Next step: Sujan decides on Claude's idea of 22 Oct 2026: on a server that holds enemies back, list a victim never sent to the recorder's game before the kill as "not seen on his screen", without claiming a wallbang. Not counted across his demos yet; it would change the 5 Oct decision.
  - Decided so far: no marker or message for kills the finder can't check ("it'll just confuse players", Sujan, 5 Oct 2026).
- [ ] **See through walls and an aimbot catcher in POV mode** (Sujan asked 3 Oct 2026)
  - Status: **See through walls** works, on what the server sent (checked 4 Oct 2026: anti-wallhack servers send enemies only when they're about to be seen). The aimbot catcher is not started.
  - Next step: Claude builds the aimbot catcher; not started.
  - Decided so far: **See through walls** stays in POV mode, for admins checking a suspect's POV (Sujan, 3 Oct 2026).
- [ ] Parked (Sujan, 5 Oct 2026): a deeper check of his own gun animations, weapon by weapon (draw, reload, silencer, shots, grenades, knife), beyond the M4A1 silencer seen so far.
- [ ] Parked (Sujan, 3 Oct 2026): voice from other players.
- [ ] Parked (Sujan, 3 Oct 2026): in-game chat messages, while alive and dead.

**Done blocks** (2 to 5 Oct 2026), in the archive whole: Demo search (0.15.2 and 0.15.3), 0.16.0 by eye, Hand checks for Sujan (0.10.0 to 0.16.0), Small decisions not yet taken (0.12.1 to 0.16.0), Count them (0.14.2), and the list "Done since this list was written" (0.12.4 to 0.23.0). The blocks below keep only their open items; their done items are in the archive too.

**Broken demos** (raised 2 Oct 2026; both fixes built in 0.16.0)
- [ ] Later (Sujan, 3 Oct 2026; he'll say when he has one; still none, 5 Oct 2026): when a broken demo turns up, open it and check the load summary's line and how far it plays. No real one is in the folders now; the line for mousesports vs Virus (ESWC 2011) would be "This recording was never finished".

**How accurate is the viewer, on a fresh batch of demos** (done 2 Oct 2026 on Windows; fixes in 0.15.1)
- [ ] Parked: a file holding only a warmup, opened on its own, shows one round; it could show none. It needs another warmup-only file: the one example (mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final, its first file) was deleted 3 Oct 2026. Then also check the error Sujan remembers it showing (5 Oct 2026).

**A map split over two or more demo files** (shipped in 0.15.0, 2 Oct 2026)
- [ ] Parked: suggest the order of 3 or more parts whose file names carry no recording time (below, under "Join a map split over several demo files"). Sujan's plan (5 Oct 2026): download a map split into 3 or more files, rename them so the names carry no recording time, then open them.

**Not yet tested on real demos**
- [ ] The 145 MB Moscow 5 vs Na`Vi Mirage demo, ESWC 2011 (memory and load time on a laptop). Deleted 2 Oct 2026; needs a big demo again. Still to confirm (Sujan, 5 Oct 2026).

**User experience** (Sujan, 25 Oct 2026: "We should constantly be thinking about user experience")
- [ ] **A review of how simple the UI is** (Sujan, 25 Oct 2026)
  - Status: not started.
  - Next step: Claude, later: one or more separate agents review how the viewer's UI could be simpler, or confirm it already is simple enough.
  - Decided so far: the agents get the built page and screenshots, without Claude's own conclusions (Sujan, 25 Oct 2026).
- [ ] **Tooltips, and feature names in bold in the viewer's text** (Sujan, 25 and 26 Oct 2026)
  - Status: not started.
  - Next step: Claude makes a mockup of one tooltip look, for every flagship feature and any option that could confuse a first-time user (the Wallbangs filters among them): it reads as a tooltip at a glance, distinct from the rest of the viewer yet subtle. Feature names go **bold** in the viewer's own text (tooltips, notes, load summary) in the same change.
  - Decided so far: mockup first; feature names in **bold**, capitalized as on screen, no quotes (Sujan, 25 Oct 2026).

**Tied to moving to sujandeswal.com** (not a dependency for anything else)
- [ ] Remove the `noindex` tag that `build.py` adds to `index.html` (kept out of search results until then; indexing is fine on sujandeswal.com).
- [ ] Privacy hardening (see "Other parked ideas").

**Next on the roadmap:** item 2, the README Requirements list (below), then item 4, the next features, starting with opening duels and trades. The accuracy check on a fresh batch is done (0.15.1).

## Roadmap (agreed 1 Oct 2026, in this order)

Who the viewer is for, in Sujan's words (30 Oct 2026): "The viewer is for CS 1.6 players who want to watch HLTV and POV demos in the browser without opening the game, with easier controls and more information than the game's own player, and to find wallbangs; a second use is admins checking suspected cheaters with **See through walls**." The order below stays as it is (Sujan, 30 Oct 2026).

Item 1, smoother playback, is done (0.8.0; Smooth aim later removed in 0.10.0). Theatre mode (0.9.0 to 0.9.3), the sniper scope (0.10.0 and 0.10.1), See through walls and Team colours (0.11.0) were added along the way.

2. **Requirements section in the README.** What's left: a short "Requirements" list (desktop computer, recent Chrome or Edge, a browser with WebGL for 3D, 8 GB RAM recommended for long demos, phones not supported, Firefox and Safari work without remembering the folder). Already done, nothing to add: the README's "You need your own legitimate copy of Counter-Strike 1.6, installed through Steam" box at the top, and on the start screen the folder row's "The Half-Life folder from your Steam install" text (0.12.1). The start screen also says plainly "Needs your own copy of Counter-Strike 1.6, installed through Steam" since 0.12.4.
3. **Keep folder access between visits.** Done in 0.12.0.
4. **Next features, in order:**
   - **Opening duels and trades.** The first kill of each round (who, where, which side) and whether a death was traded, meaning a teammate got the killer back within a few seconds. Per player: opening kills, opening deaths, and how often their deaths were traded. One of the most-used stats in CS analysis, and the demo has everything needed.
   - **Buy type per round.** Full buy, force buy, eco or pistol round, worked out from the weapons each team holds just after freeze time. HLTV demos don't carry players' money, so it's an estimate from weapons, and armour isn't visible. It still explains most rounds at a glance.
   - **Bomb site per round.** A or B, plant or retake, and win rate per site per side. The demo records where the bomb was planted, and the map file marks the sites.
   - **Grenades per player.**
   - **Broadcast camera mode.** Check the director data in the demo first.
   - **Small improvements:** next and previous kill keys, "Copy this moment", resume where I left off, open .zip demos, filter kills by player or weapon.
5. **Safety fixes and the test suite**, as listed under "Other parked ideas" below: audit demo text shown on the page, size limits, fallbacks for custom models and unusual sounds.

**Decided:** never host Valve's game files. A "lite mode" made only from the project's own assets is an option for later.

## Kept for later

Parked after a feasibility check; the checks are in the archive under the same names.

- **Bullet marks (decals)** (parked 1 Oct 2026 by Sujan): HLTV demos don't record where the player aimed at each shot, so marks on walls would land 1 to 2 degrees off and partly be made up. Worth revisiting if POV demos store the exact aim for every shot (they hold the recorder's own view about 100 times a second: "POV demos" in the archive). Blood and grenade scorch marks are parked with them.
- **Scope styles** (1 Oct 2026): the viewer uses "game"; "clean" was the runner-up; switch with `SCOPE_STYLE` in `src/view3d.part.js`. A menu choice was ruled out for now as clutter.
- **Quick-scope and no-scope labels** (built in 0.10.0, removed in 0.10.1): HLTV timing can't separate a real quick-scope from a slightly quicker normal scope. Worth revisiting with finer timing (POV demos record the player's own zoom) or a well-sourced community definition.

## POV demos

The findings of 3 Oct 2026 (what a POV demo holds, what the viewer got wrong, the headless browser run) and what's built so far on `wip/pov-mode` ("In progress: POV mode", copied from that branch's CHANGELOG on 29 Oct 2026, with how each part was tested) are in the archive under this heading; work item 6.5 started from there and shipped in 0.25.0 (pull request #5). The open POV items are in the checklist above.

Ideas from the discussion (3 Oct 2026, not decided):
- A wallbang check for the recorder's own kills only: with aim stored 100 times a second it could be more precise than on HLTV demos.

## Other parked ideas

*From the 30 Sept 2026 discussion on product practices and features. Not yet built.* Long items are cut to a line here; their full text is in the archive under the same name.

- **Test suite.** Known answers per demo, wallbang ground truth checked in game, break-it tests with corrupt files and nasty player names, scripted browser run-throughs, and custom model and sound packs that must load or fall back cleanly. The scripts are in [tests/](tests/README.md) and run by hand, except three that run on every pull request since work item 6.3 (`.github/workflows/check.yml`, 29 Oct 2026).
- **Join a map split over several demo files**: built in 0.15.0. What's left:
  - **Order of 3 or more parts without recording times in the file names** (Sujan's question, 2 Oct 2026): chain the parts by the game's scoreboard by side and by the teams' sides across each join, which would usually leave one order. Not tested: Sujan has no demo split into more than two files.
  - **Words:** "map", not "match", in everything the viewer says about it (Sujan, 2 Oct 2026).
- **Show the event's name while a demo plays** (parked 2 Oct 2026 by Sujan, not urgent): 19 of 26 demos on the Mac name the event in their own text (the game server's or the HLTV server's name); show it somewhere quiet (the load summary, the header's file line, the hold-Tab scoreboard or Copy debug info).
- **Team names when nothing names the team** (parked 2 Oct 2026 by Sujan, leave as is for now): the header says "Team 1" and "Team 2", click to rename; a fix would need a list of known players per team and year, which goes stale.
- **Safety with custom and bad files.** Fall back to the simple figure when a model's skeleton or animations don't match stock CS, cap model and sound size, decode unusual WAVs through the browser, audit every place player names and demo text reach the page, and bail out of files with nonsense values.
- **Privacy hardening for sujandeswal.com.** Self-host the fonts (three.js is built into the page since 0.26.2), and add a security header that blocks the page from sending data anywhere.
- **Wallhack measure** (parked, from the "See through walls" discussion, 1 Oct 2026). Measure how long each player's crosshair stays on enemies hidden behind walls, compared with the same players in the open. A high share of time tracking hidden enemies is a sign admins could use alongside watching the view.
- **Highlight finder** (parked, not urgent). 3Ks, 4Ks, aces, clutches and quick multi-kills, filterable by player and weapon.
- **Record a clip** from the 3D view, with sound, to a video file.
- **Bookmarks with notes**, exportable with the same timestamps as the wallbang list.
- **Sounds on the radar**: gunshots and footsteps as brief pulses in 2D.
- **Share a moment by link**, such as `#r12` to open round 12.
- **Product basics still to do**: a compatibility note (browsers, HLTV vs POV demos); the license is done (MIT, `LICENSE`, Sujan 30 Oct 2026).
- **1.6-era look** (parked, not urgent) as an optional theme: VGUI-style panels, Verdana/Tahoma, orange HUD numbers, sprites read from the player's own `cstrike/sprites`.
- **Say when a recording stops partway through its last round** (found 2 Oct 2026): mousesports vs SK, Mirage, and ALTERNATE vs AGAiN, Inferno, both ESWC 2011, read one round short of a win; the load summary could say "The recording stops partway through the last round". Belongs with the broken demo messages of 0.16.0; needs a mockup.
- **Shaded lighting on player models** so they darken in shadowed areas like in-game.
- **Team names for demos without "-vs-" in the file name** (found 1 Oct 2026). `2006-07-02_15h00_Team3D_Fnatic-...-de_train.dem` names its teams "fnatic" and "o of 3D": the guess from clan tags picked up part of a name. Worth reading names like `Team3D_Fnatic` from the file name too.
- **A wall thickness limit per gun** (2 Oct 2026). How thick a wall each gun can shoot through would catch wrong wallbangs on its own, but the numbers need care: the game moves a bullet ahead by its "penetration power" (AWP 45, AK 39, M4 35 units, cut by the material: a quarter on concrete) after each hit, and the thickest wall it gets through also depends on how the engine traces from inside a wall. Not used until that's checked in the code and in the game.
- **Late kill messages in other old demos** (2 Oct 2026). The 2006 NoA vs Pentagram demo is the only one so far where the kill message trails the kill (see CHANGELOG 0.13.0). A second protocol 47 demo would show whether all old demos do this.
- **Left-hand option for first-person weapons** (discussed 1 Oct 2026). The viewer now shows weapons in the right hand like CS 1.6's default (cl_righthand 1). A toggle for people who play left-handed is a one-line change if anyone asks.

Built in 0.16.0, in the archive: **Tell exactly why a demo is broken** and **Play cut-off demos up to where they end**.
