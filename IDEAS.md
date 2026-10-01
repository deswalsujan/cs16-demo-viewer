# Ideas

Parked ideas and features we've discussed but not built yet. Each entry keeps enough of the discussion that it can be picked up later without starting over. When something here gets built, it moves to the [changelog](CHANGELOG.md).

## Roadmap (agreed 1 Oct 2026, in this order)

Item 1, smoother playback, is done (0.8.0; Smooth aim later removed in 0.10.0). Theatre mode (0.9.0 to 0.9.3), the sniper scope (0.10.0 and 0.10.1), See through walls and Team colours (0.11.0) were added along the way.

2. **Requirements.** A "Requirements" section in the README: desktop, recent Chrome or Edge, WebGL, Steam CS 1.6; 8 GB RAM recommended for long demos; phones not supported; Firefox and Safari untested. Plus a one-line "needs your own copy of CS 1.6 on Steam" on the viewer's start screen.
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

## Next up (raised 1 Oct 2026, after 0.11.0)

Five points Sujan raised, with the recommendations so far. Confirm with Sujan before starting each. Point 1 (old protocol 47 demos) was done in 0.11.1, point 2 (remember the Half-Life folder, with a folder row on the start screen) in 0.12.0 and 0.12.1, point 3 (Reset view in 3D) in 0.12.2, point 4 (settings when opening another demo) in 0.12.3.

5. **Bullet marks (decals).** For seeing where a spray actually lands while the crosshair is pulled down against recoil.
   - **Feasibility check, 1 Oct 2026 (Dust2, Na`Vi vs FX), waiting on Sujan's decision.**
   - What the game sends with every shot (ReGameDLL source, `wpn_ak47.cpp` and `FireBullets3` in `cbase.cpp`): the spread already worked out from the random seed (two numbers, `fparam1` and `fparam2`), and the recoil at the moment of the shot (punch angle times 100, `iparam1` and `iparam2`). The shot's start point and view angles are left empty for the receiving game to fill in from the shooter.
   - What the HLTV demo keeps: the spread (2,316 of 2,317 fire events, stored to 0.01, about half a degree) and the recoil (to 0.01 degrees). The view angles of the shot are missing (10 of 2,317 events), so the aim has to come from the player's snapshots, about ten a second, as everywhere else in the viewer.
   - Accuracy, from 68 to 71 headshot kills: the rebuilt killing bullet passes a median of about 16 to 17 units from the head centre (a head is about 10 units across), so it hits the head in about 1 case in 10. Shifting the aim or the victim by a snapshot either way doesn't fix it. Recoil clearly helps in sprays (for example 38 units off without it, 13 with it; 35 and 10), so the recoil data is real; the error is the aim between snapshots, the same limit as the crosshair-at-kill finding in CHANGELOG 0.10.0 (1 to 2 degrees).
   - So: the shape of a spray (how far each bullet lands from the crosshair) is exact, but where the whole spray lands in the world is off by about 1 to 2 degrees, about a body width at 600 units.
   - Scripts: `tests/demo-probes/bullets.mjs` (what fire events carry), `bullets_hs.mjs` (headshot test), `bullets_sweep.mjs` (timing offsets).
   - Untested: burst weapons (the FAMAS and Glock burst events seem to use the recoil numbers for something else), and how bullets go through walls (the game reduces penetration by material).

## Kept for later

- **Scope styles** (1 Oct 2026). Three sniper scope styles are in the code; the viewer uses "game" (like CS 1.6: thin lines, mil-dots, red dot). "clean" (lines and red dot, no mil-dots) was the runner-up: mil-dots carry no information in CS 1.6 (there's no bullet drop) and can cover a dark player model. "lines" is the 0.10.0 look. Switch with `SCOPE_STYLE` in `src/view3d.part.js`; all three compared in [docs/scope-designs.png](docs/scope-designs.png) (A is "game", B is "clean"). A menu choice was ruled out for now as clutter.
- **Quick-scope and no-scope labels** (built in 0.10.0, removed in 0.10.1). HLTV timing (about a tenth of a second) can't separate a real quick-scope from a slightly quicker normal scope, and no measured cut-off was found. Worth revisiting only with demos that carry finer timing (for example POV demos, which record the player's own zoom), or a well-sourced community definition.

## Open decisions

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

- **Test suite.** Known answers per demo (final score, round count, zero read errors), wallbang ground truth checked in-game, break-it tests with corrupt files and nasty player names, scripted browser run-throughs, and a folder of custom model and sound packs that must load or fall back cleanly. Could run on every push through GitHub Actions. Verified results so far: WinFakt vs Check-Six Mirage 16-6, Na`Vi vs FX Dust2 16-11 (viewer shows 17-11, known quirk), M5 vs Na`Vi Mirage 16-9, and (1 Oct 2026, every round checked against the admin plugin's "Current score" messages) Fnatic vs ALTERNATE aTTaX Nuke 8-16, Fnatic vs mousesports Tuscan 15-15, mousesports vs AGAiN Inferno 16-11. The Dust2 and Mirage demos should be re-checked with 0.7.1, since round counting now also reads admin announcements. Lessons from testing 0.8.0 and 0.9.x (1 Oct 2026): the headless test browser draws 3D without a graphics chip, so it's slow, and checks that depend on timing (a bar hiding after 2 seconds) can fail there and pass on a real machine. Wait for the outcome instead of a fixed time, and confirm timing failures by hand before chasing them. One full Theatre mode run of 39 checks on five screen setups took about 45 minutes. The scripts used so far are in [tests/](tests/README.md): the browser harness and page checks, the Theatre mode checks, and the demo data probes, with setup and run instructions. They run by hand; wiring them into GitHub Actions is the next step for the suite.
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
- **Left-hand option for first-person weapons** (discussed 1 Oct 2026). The viewer now shows weapons in the right hand like CS 1.6's default (cl_righthand 1). A toggle for people who play left-handed is a one-line change if anyone asks.
