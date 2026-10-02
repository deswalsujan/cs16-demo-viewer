# Ideas

Parked ideas and features we've discussed but not built yet. Each entry keeps enough of the discussion that it can be picked up later without starting over. When something here gets built, it moves to the [changelog](CHANGELOG.md).

## Open follow-ups (checklist, updated 2 Oct 2026)

Everything raised in conversation that isn't finished, in one place. Each item says who does it. Ideas for new features are further down; this list is for loose ends.

**A map split over two or more demo files** (next, raised 2 Oct 2026; details under "Join a map split over several demo files" below)
- [ ] Sujan: approve or change the revised mockup, [docs/proposed/split-match-mock.png](docs/proposed/split-match-mock.png) (2 Oct 2026, second version: "map", order and arrows, wrong-map and wrong-order cards, full file names).
- [ ] Sujan: the Count them note, faded rows and "Demo read: 30 rounds, 27 counted" on the fnatic vs EG demo, by eye (0.14.2).

**Hand checks for Sujan** (things the headless test browser can't do)
- [ ] **0.14.0 on your side:** the Lions vs mousesports smoke Threat throws at about 15:16 (it pops at 15:19) and the Anexis vs fnatic one at 10:39, both light green; the Players tab on the 2006 Train demo (PENTAGRAM rows should each show their own name) and on any MYM demo you have; the skull on dead players; Free camera from Player's eyes and Behind player starting at the player. Checked in the test browser only, with no weapon models or sounds loaded.
- [ ] **The wallbangs that changed in 0.13.0**, in the game's demo player (round and round timer as the viewer shows them):
  - NoA vs Pentagram, Train 2006, newly listed: R18 1:22 MJE AK on kubenB, R21 1:09 neo M4 on zonic. No longer listed, not commented on yet: R12 1:01 Paddy M4 on kubenB. Still listed and not checked: R4 0:40 and R5 1:24 taz AK on zonic, R10 1:03 Paddy M4 on neo, R22 0:55 neo M4 on ave, R24 0:38 zonic AK on LoordB, R28 1:17 MJE AK on LoordB, R28 1:12 neo M4 on MJE.
  - Na`Vi vs FX, Train 2011, no longer listed: R9 1:21 Zeus AK on PASHA.
  - SK vs WinFakt, Mirage 2011, no longer listed: R4 0:37 face M4 on JiGetus, R9 0:50 RobbaN M4 on JiGetus, R19 1:26 i'M(BA-SiC)K FAMAS on Delpan.
- [ ] **The GP Pub POV demo on your side** (0.13.0): it should open on de_zovine with 27 rounds and the two notes in the load summary. Then watch a minute of it in 3D: it was only checked loading in the test browser, never by eye. On the Mac, copy `cstrike/GP-[PuB]_M-[de_zovine]_D-[10_01_2026]_T-[19_08].dem` and `cstrike_downloads/maps/de_zovine.bsp` over from Windows first (the Mac's Half-Life copy predates them). No de_zovine overview exists, so the 2D radar shows a plain grid.
- [ ] **The 0.13.0 side panel by eye**: Kills and Wallbangs on three lines with the kill feed icons, the clicked kill keeping its bookmark and tint, the lighter tint on the kill playback is passing, Rounds and Players highlights; Clear saved files with a demo open; the summary card's countdown bar moving smoothly. Approved designs: [docs/side-panel-designs.png](docs/side-panel-designs.png).
- [ ] **Reconnect and "Allow on every visit"** (0.12.0). In a normal (not incognito) Chrome window: open the GitHub Pages link, choose the folder, close every tab of the viewer, open the link again, click Reconnect and choose "Allow on every visit", close the tab again and reopen it. Expected: it goes straight to "Up to date" with no prompt. Not yet done: a reload doesn't show the prompt, because Chrome keeps the access until the last tab of the site closes.
- [ ] **The 0.12.1 folder row on a real folder** (picking the right folder confirmed on Windows, 1 Oct 2026; the rest still to do): choose a wrong folder (for example `sprint-builds-review`), then the `cstrike` folder itself, then the right one; move demos in and out while the page is open (the list should update when you click back into the tab); click Clear saved files twice (should go straight back to "Choose your Half-Life folder").
- [ ] **Reset view (0.12.2)** from Player's eyes in 3D: should go back to the starting overview.
- [ ] **Settings carry over (0.12.3):** change view, speed and toggles, open another demo: settings kept, speed back to 1x and paused; reload the page: settings still there.
- [ ] **The game's own demo player vs the viewer**, two checks on one demo (see "Open decisions"): does the in-game player show the AWP scope for an HLTV demo, and does it show the same small crosshair offset at a kill (CHANGELOG 0.10.0)?
- [ ] **Windows 150% Theatre run.** Passed all 39 checks on the build before the last 0.9.x fix and wasn't rerun after it.

**Not yet tested on real demos**
- [ ] The 102 MB mousesports vs Virus Inferno demo: doesn't finish loading in the test browser within 4 minutes (0.14.1 comparison). Check it opens on your side and its score looks right.
- [ ] Breakables on Nuke and Inferno (vents) and Tuscan (logs): do they disappear in 3D when shot out?
- [ ] The 145 MB Moscow 5 vs Na`Vi Mirage demo (memory and load time on a laptop).
- [ ] Re-check WinFakt vs Check-Six Mirage (16-6): that demo isn't in the Mac's folder. Na`Vi vs FX Dust2 now reads the official 16-11 and M5 vs Na`Vi Mirage 16-9 (0.14.2).

**Small decisions not yet taken**
- [ ] Free camera to Player's eyes or Behind player with nobody picked follows the first living player in the list, wherever the camera is. Following the player nearest the middle of the free camera's view would keep the place, the same way 0.14.0 does in the other direction. Offered on 2 Oct 2026.
- [ ] Show the demo's protocol (47 or 48) in "Copy debug info", so bug reports say which kind of demo it was. A one-line change; offered on 1 Oct 2026, not answered.
- [ ] Since 0.12.1 a demo can only be opened after the folder is chosen. Before, maps and models this browser had saved let a demo open without the folder. Fine for Chrome (the folder is remembered); in Firefox and Safari it means choosing the folder on every visit before opening a demo. Confirm this is acceptable.

**Tied to moving to sujandeswal.com** (not a dependency for anything else)
- [ ] Remove the `noindex` tag that `build.py` adds to `index.html` (kept out of search results until then; indexing is fine on sujandeswal.com).
- [ ] Privacy hardening (see "Other parked ideas").

**Done since this list was written:** Sujan confirmed the two 0.14.2 scores not found online (Na`Vi vs FX Train 11:16, mTw vs Lions Nuke 10:16); 0.14.2 (round counting: stop at 16 with Count them, team swap suicides, rounds past a half, the IOL false start, plain team names); the Count them mockup and the team name change, approved by Sujan (2 Oct 2026); 0.14.1 (FX vs SK Inferno: lo3, restarted halves, KUBEN twice, renamed players); 0.14.0 (smokes from the game's own smoke events, HE and flash bursts on maps where the demo has no grenade objects, light green smokes, shorter names and the skull in the Players tab, Free camera starting at the player); and earlier: Train in 3D on Sujan's side (the 2006 NoA vs Pentagram demo, 1 Oct 2026, which led to 0.13.0); 0.13.0 (kills timed from the real moment, the gun rule, POV demos, Clear saved files closing the demo, the smooth summary bar, the side panel lists); the start screen line "Needs your own copy of Counter-Strike 1.6, installed through Steam" (0.12.4, confirmed by Sujan).

**Next on the roadmap:** item 2, the README Requirements list (below).

## Roadmap (agreed 1 Oct 2026, in this order)

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

## Next up (raised 1 Oct 2026, after 0.11.0): all five settled

1. Old protocol 47 demos: done in 0.11.1.
2. Remember the Half-Life folder, with a folder row on the start screen: done in 0.12.0 and 0.12.1.
3. Reset view in 3D: done in 0.12.2.
4. Settings when opening another demo: done in 0.12.3.
5. Bullet marks: checked and parked (see "Kept for later").

## Kept for later

- **Bullet marks (decals)** (parked 1 Oct 2026 by Sujan, after a feasibility check). For seeing where a spray actually lands while the crosshair is pulled down against recoil.
  - **Why parked:** HLTV demos don't record where the player was aiming at the moment of each shot, so marks on walls would land 1 to 2 degrees off and partly be made up. That goes against showing only what the demo recorded.
  - **Feasibility check, 1 Oct 2026 (Dust2, Na`Vi vs FX):**
  - What the game sends with every shot (ReGameDLL source, `wpn_ak47.cpp` and `FireBullets3` in `cbase.cpp`): the spread already worked out from the random seed (two numbers, `fparam1` and `fparam2`), and the recoil at the moment of the shot (punch angle times 100, `iparam1` and `iparam2`). The shot's start point and view angles are left empty for the receiving game to fill in from the shooter.
  - What the HLTV demo keeps: the spread (2,316 of 2,317 fire events, stored to 0.01, about half a degree) and the recoil (to 0.01 degrees). The view angles of the shot are missing (10 of 2,317 events), so the aim has to come from the player's snapshots, about ten a second, as everywhere else in the viewer.
  - Accuracy, from 68 to 71 headshot kills: the rebuilt killing bullet passes a median of about 16 to 17 units from the head centre (a head is about 10 units across), so it hits the head in about 1 case in 10. Shifting the aim or the victim by a snapshot either way doesn't fix it. Recoil clearly helps in sprays (for example 38 units off without it, 13 with it; 35 and 10), so the recoil data is real; the error is the aim between snapshots, the same limit as the crosshair-at-kill finding in CHANGELOG 0.10.0 (1 to 2 degrees).
  - So: the shape of a spray (how far each bullet lands from the crosshair) is exact, but where the whole spray lands in the world is off by about 1 to 2 degrees, about a body width at 600 units.
  - Scripts: `tests/demo-probes/bullets.mjs` (what fire events carry), `bullets_hs.mjs` (headshot test), `bullets_sweep.mjs` (timing offsets).
  - Untested: burst weapons (the FAMAS and Glock burst events seem to use the recoil numbers for something else), and how bullets go through walls (the game reduces penetration by material).
  - **Options that were on the table:** (1) park, chosen; (2) a spray readout in Player's eyes, dots around the crosshair showing where each bullet went compared with the aim, which is exact data; (3) wall marks labelled as approximate, advised against.
  - **Worth revisiting if:** POV demos (recorded by a player, not HLTV) turn out to store the exact aim for every shot. Not checked yet. Blood and grenade scorch marks were to follow bullet marks and are parked with them.
- **Scope styles** (1 Oct 2026). Three sniper scope styles are in the code; the viewer uses "game" (like CS 1.6: thin lines, mil-dots, red dot). "clean" (lines and red dot, no mil-dots) was the runner-up: mil-dots carry no information in CS 1.6 (there's no bullet drop) and can cover a dark player model. "lines" is the 0.10.0 look. Switch with `SCOPE_STYLE` in `src/view3d.part.js`; all three compared in [docs/scope-designs.png](docs/scope-designs.png) (A is "game", B is "clean"). A menu choice was ruled out for now as clutter.
- **Quick-scope and no-scope labels** (built in 0.10.0, removed in 0.10.1). HLTV timing (about a tenth of a second) can't separate a real quick-scope from a slightly quicker normal scope, and no measured cut-off was found. Worth revisiting only with demos that carry finer timing (for example POV demos, which record the player's own zoom), or a well-sourced community definition.

## Open decisions

- **Crosshair at the moment of a kill** (open since 1 Oct 2026). The viewer shows the shooter's crosshair up to about 1.5 degrees off the victim at some kills (CHANGELOG 0.10.0, "Discussed, not changed"); the same limit sank bullet marks. Expected to look the same in the game's own demo player. Check one of the kills listed there in-game (for example markeloff's AWP kill on PASHA, Dust2 round 10).
- **How the game's own demo player shows the scope** (open since 1 Oct 2026). Sujan has seen the scope in HLTV demos in-game. The viewer rebuilds it from the zoom click sounds, because no zoom field could be found in the demo (checked on Dust2 and Tuscan). If the game shows the scope for these exact demos, it gets it from somewhere still unread, which would be more reliable than the clicks. Worth checking one AWP kill in-game against the viewer.

## Wallbang hits that didn't kill

*Discussed 30 Sept 2026. Parked.*

**The idea.** The wallbang finder only looks at kills. Many spots see players damaged through walls without dying (spraying through doors, common angles). List those too.

**What the demo gives us.** There is no "A damaged B" message in an HLTV demo; the game only sends damage to the player who was hit, and the HLTV recorder isn't that player. It can be pieced together from three things the demo does record:
1. Health changes: HLTV sends each player's health whenever it changes ("starix 100 → 73 at 14:02").
2. Hit sounds: body, kevlar, helmet and headshot sounds play on the player who was hit, confirming a real bullet hit.
3. Every shot: who fired, when, and where they were aiming.

Checked on two demos:

| | Dust2 (Na`Vi vs FX) | Mirage (M5 vs Na`Vi) |
|---|---|---|
| Non-fatal hits (health dropped, player survived) | 491 | 363 |
| With a matching hit sound | 491 | 359 |
| With an enemy shot in the 0.4 s before | 367 | 304 |
| Only one enemy shooting at that moment | 311 | 222 |
| Near a grenade explosion | 68 | 31 |

**How it would work.** For each hit:
1. Find the enemies who fired just before it. If only one did, it's them.
2. If several did, pick the one whose aim line passes closest to the victim. If it's still unclear, skip it rather than guess.
3. Skip it if a grenade went off nearby, or if nobody fired (fall damage).
4. Run the same wallbang test as for kills: victim fully hidden from the shooter, and the shooter's aim line passing through cover.
5. Record it: "Dosia → starix, 27 damage, through 16 units of wall".

**Where it could go wrong.**
- Several players spraying the same spot: most can be attributed by aim line, the rest skipped or marked as a guess.
- Recoil and spread: in a long spray the bullet lands away from the crosshair. Kill wallbangs share this; checking against in-game playback handles it.
- Aim is recorded 30 times a second, so a fast flick can fall between samples. Small effect.
- Volume: far more of these than wallbang kills. A spray through a door should be grouped into one entry ("3 hits, 61 damage") instead of one per bullet.

**Open decisions.**
1. Show them in a separate "Wallbang hits" list, or mixed with wallbang kills behind a filter? Leaning separate, with a hollow diamond on the timeline so kills stay easy to find for clips.
2. Minimum damage to count (10 or 20?), so grazes through thick walls don't flood the list.
3. List a wallbang hit even when the same shooter later kills that player in the open? Leaning yes, since the wallbang is the clip-worthy part.

**Side benefit.** Once hits are tied to shooters, per-player damage and ADR come almost for free for the Players tab, and "hits by player" could filter the heatmap.

**Validation plan.** Flag about 20 on the Dust2 demo, check them in-game, tune, then add them to the wallbang test set.

## Other parked ideas

*From the 30 Sept 2026 discussion on product practices and features. Not yet built.*

- **Test suite.** Known answers per demo (final score, round count, zero read errors), wallbang ground truth checked in-game, break-it tests with corrupt files and nasty player names, scripted browser run-throughs, and a folder of custom model and sound packs that must load or fall back cleanly. Could run on every push through GitHub Actions. Verified results so far: WinFakt vs Check-Six Mirage 16-6, Na`Vi vs FX Dust2 16-11 (right since 0.14.2), SK vs WinFakt Mirage 16-8 (IEM6 New York final, 0.14.2), M5 vs Na`Vi Mirage 16-9, and (1 Oct 2026, every round checked against the admin plugin's "Current score" messages) Fnatic vs ALTERNATE aTTaX Nuke 8-16, Fnatic vs mousesports Tuscan 15-15, mousesports vs AGAiN Inferno 16-11. Lessons from testing 0.8.0 and 0.9.x (1 Oct 2026): the headless test browser draws 3D without a graphics chip, so it's slow, and checks that depend on timing (a bar hiding after 2 seconds) can fail there and pass on a real machine. Wait for the outcome instead of a fixed time, and confirm timing failures by hand before chasing them. One full Theatre mode run of 39 checks on five screen setups took about 45 minutes. The scripts used so far are in [tests/](tests/README.md): the browser harness and page checks, the Theatre mode checks, and the demo data probes, with setup and run instructions. They run by hand; wiring them into GitHub Actions is the next step for the suite.
- **Join a map split over several demo files** (raised 2 Oct 2026, next to build once the mockup is approved). HLTV often splits one map into two files (the Xperia Play FX vs mTw Inferno and Nuke demos), sometimes three (Sujan has seen three, never four). A third file can be noise (a few seconds the recorder kept) or a whole overtime. Today each file is scored on its own, so the total score and player K-D have to be added up by hand, and each file is counted as if it started at 0:0.
  - **Words:** "map", not "match", in everything the viewer says. A match is often several maps (Dust2, Inferno, Nuke), each its own demo or demos; only the parts of one map are joined (Sujan, 2 Oct 2026).
  - **What the files show** (checked 2 Oct 2026 on the four Xperia files, `tests/demo-probes/rounds_and_people.mjs` and a Steam ID probe):
    - The game's scoreboard counts by side (T and CT) and resets at every restart, so it never carries the map's score into the next part. Inferno part 1 (`-1104240025`) runs 0:0 to 6:9 by side, then two idle rounds; part 2 (`-1104240112`) starts at 0:1, so one round was played before the recording started and is in neither file. Nuke part 1 (`-1104240212`) runs 0:0 to 7:8; part 2 (`-1104240242`) starts at 0:0, exactly like a new map.
    - Both part 1 files end with no winner (nobody reached 16), on the same server ("HLTV.org - VeryGames.net").
    - Every player has a Steam ID in the demo (the `*sid` in their player info, already read by `src/demo.js`), the same in both parts. That identifies the same ten people across files even if someone renames.
    - The teams are on swapped sides at the start of part 2.
    - The demo's own clock can't order the parts: the HLTV server clock restarts at 1:30 in every file (checked on all four).
  - **What one file can tell on its own:** it ends before anyone won, or it starts with rounds already on the scoreboard. A later part that starts at 0:0 (Nuke) can't be told apart from a new map.
  - **Finding the other parts:** another demo on the same map with at least 8 of the same 10 Steam IDs, where the parts together make one map. Offered in the load summary; the person confirms. A manual "Join with another demo…" covers parts kept elsewhere or renamed.
  - **Order, in this order of trust:** (1) the recording time in the file names, when every part has one (`1104240025` is 24 Apr 2011, 00:25; `1110231216--auto_...` and `2006-07-02_15h00_...` are other forms; names like `FX-vs-sk-iem5-inf.dem` have none); (2) the rounds: the only order that makes a valid map, where the first part starts from 0:0, every earlier part ends without a winner and only the last has one; (3) neither decides: no suggestion, the person sets it. The card says which one it used. Arrows move parts up or down. If the person's order breaks (2), the "This order doesn't add up" card explains why and offers the suggested order; "Keep my order" is allowed, since files can be odd, and the load summary keeps a note on it.
  - **Refused outright:** another map ("This demo is from another map", Sujan asked for an error here), or fewer than 8 of the same 10 players. A part with no rounds in it is listed as "no rounds in it" and adds nothing.
  - **File names on screen:** shown in full, with .dem, never cut short (the part that tells two parts apart is often in the middle). They wrap only after a - _ or . (with `<wbr>`), never inside "de_inferno.dem". The names on Sujan's Mac are 21 to 76 characters, most 40 to 56; the longest (`PGL.DreamHack_Bucuresti_2012.03-Winner.Anexis.vs.fnatic.HLTV.3.de_tuscan.dem`) takes two lines in the card and the Rounds tab.
  - **Design:** [docs/proposed/split-match-mock.png](docs/proposed/split-match-mock.png). After joining, one map numbered straight through, a marker with the part's file name where the file changes, the round missing between files shown as a gap and counted in the score from the scoreboard (its winner is the side with the extra point), but not in player stats. Remembered per set of files; "Split them" undoes it.
  - **How it counts:** the rounds of all parts go in one list and are counted once (halves, overtime, stop at 16). Players are matched by Steam ID.
  - **First version (agreed 2 Oct 2026):** joined score, rounds and player stats; playback switches file at the marker. All parts are read when they're joined and kept in memory, so the switch is a short pause, not a new load (about 50 MB each for the Xperia demos; the 145 MB Mirage demo would be the test for memory).
  - **Later: seamless playback across the parts.** What it would take: one timeline over all parts, with each part's times shifted so they follow on; the followed player, camera and Player's eyes carrying over by Steam ID (a player's slot number changes between files); the round numbers, kill list, wallbangs and heatmaps reading across files; reading the next part ahead of time near the end of a part so there's no pause; and a memory limit for three large files. None of it is needed for correct numbers, which is why it waits.

- **Team names when nothing names the team** (parked 2 Oct 2026 by Sujan, leave as is for now). When the file name has no "-vs-"/"_vs_" and neither team wears a shared clan tag, the header says "Team 1" and "Team 2" (iFNG FX vs fnatic, `auto_ifng-1103030950`: FX play as "NEO[t]", "taz 8)", fnatic with no tags). Clicking the name renames it, remembered per demo. A fix would need a list of known players per team and year, which goes stale with roster changes and could name the wrong team.
- **Safety with custom and bad files.** Fall back to the simple figure when a model's skeleton or animations don't match stock CS, cap model and sound size, decode unusual WAVs through the browser, audit every place player names and demo text reach the page, and bail out of files with nonsense values.
- **Privacy hardening for sujandeswal.com.** Self-host three.js and the fonts, and add a security header that blocks the page from sending data anywhere.
- **Wallhack measure** (parked, from the "See through walls" discussion, 1 Oct 2026). Measure how long each player's crosshair stays on enemies hidden behind walls, compared with the same players in the open. A high share of time tracking hidden enemies is a sign admins could use alongside watching the view.
- **Highlight finder** (parked, not urgent). 3Ks, 4Ks, aces, clutches and quick multi-kills, filterable by player and weapon.
- **Record a clip** from the 3D view, with sound, to a video file.
- **Bookmarks with notes**, exportable with the same timestamps as the wallbang list.
- **Sounds on the radar**: gunshots and footsteps as brief pulses in 2D.
- **Share a moment by link**, such as `#r12` to open round 12.
- **Product basics still to do**: a compatibility note (browsers, HLTV vs POV demos) and a license.
- **1.6-era look** (parked, not urgent) as an optional theme: VGUI-style panels, Verdana/Tahoma, orange HUD numbers, sprites read from the player's own `cstrike/sprites`.
- **Play cut-off demos up to where they end.** A demo that was cut off (interrupted download, crashed recording) currently can't be opened at all, because the file's index sits at the end. Reading it frame by frame from the start would recover everything up to the cut.
- **Shaded lighting on player models** so they darken in shadowed areas like in-game.
- **Team names for demos without "-vs-" in the file name** (found 1 Oct 2026). `2006-07-02_15h00_Team3D_Fnatic-...-de_train.dem` names its teams "fnatic" and "o of 3D": the guess from clan tags picked up part of a name. Worth reading names like `Team3D_Fnatic` from the file name too.
- **A wall thickness limit per gun** (2 Oct 2026). How thick a wall each gun can shoot through would catch wrong wallbangs on its own, but the numbers need care: the game moves a bullet ahead by its "penetration power" (AWP 45, AK 39, M4 35 units, cut by the material: a quarter on concrete) after each hit, and the thickest wall it gets through also depends on how the engine traces from inside a wall. Not used until that's checked in the code and in the game.
- **Late kill messages in other old demos** (2 Oct 2026). The 2006 NoA vs Pentagram demo is the only one so far where the kill message trails the kill (see CHANGELOG 0.13.0). A second protocol 47 demo would show whether all old demos do this.
- **Left-hand option for first-person weapons** (discussed 1 Oct 2026). The viewer now shows weapons in the right hand like CS 1.6's default (cl_righthand 1). A toggle for people who play left-handed is a one-line change if anyone asks.
