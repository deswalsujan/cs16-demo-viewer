# Ideas

Parked ideas and features we've discussed but not built yet. Each entry keeps enough of the discussion that it can be picked up later without starting over. When something here gets built, it moves to the [changelog](CHANGELOG.md).

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

- **Test suite.** Known answers per demo (final score, round count, zero read errors), wallbang ground truth checked in-game, break-it tests with corrupt files and nasty player names, scripted browser run-throughs, and a folder of custom model and sound packs that must load or fall back cleanly. Could run on every push through GitHub Actions. Verified results so far: WinFakt vs Check-Six Mirage 16-6, Na`Vi vs FX Dust2 16-11 (viewer shows 17-11, known quirk), M5 vs Na`Vi Mirage 16-9.
- **Safety with custom and bad files.** Fall back to the simple figure when a model's skeleton or animations don't match stock CS, cap model and sound size, decode unusual WAVs through the browser, audit every place player names and demo text reach the page, and bail out of files with nonsense values.
- **Privacy hardening for sujandeswal.com.** Self-host three.js and the fonts, and add a security header that blocks the page from sending data anywhere.
- **Highlight finder** (parked, not urgent). 3Ks, 4Ks, aces, clutches and quick multi-kills, filterable by player and weapon.
- **Record a clip** from the 3D view, with sound, to a video file.
- **Bookmarks with notes**, exportable with the same timestamps as the wallbang list.
- **Sounds on the radar**: gunshots and footsteps as brief pulses in 2D.
- **Share a moment by link**, such as `#r12` to open round 12.
- **Product basics still to do**: a compatibility note (browsers, HLTV vs POV demos) and a license.
- **1.6-era look** (parked, not urgent) as an optional theme: VGUI-style panels, Verdana/Tahoma, orange HUD numbers, sprites read from the player's own `cstrike/sprites`.
- **Shaded lighting on player models** so they darken in shadowed areas like in-game.
