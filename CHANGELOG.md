# Changelog

What changed in the viewer, newest first. The version shows in the viewer's shortcuts panel (press ?) and on the start screen.

## Known limits (current version)
- HLTV demos don't record the first-person weapon's animation, so it's rebuilt from shots, weapon switches and the player's body animation. Timing can differ slightly from in-game, and idle variations won't match. If a `v_` model is missing, no gun is shown.
- Player models get even lighting, so they don't darken in shaded spots the way they do in-game.
- Custom models are named in the load summary but not checked further yet. One with an unusual skeleton may pose oddly; compressed or 24-bit sounds stay silent.
- Na`Vi vs FX on Dust2 shows 17-11 against the official 16-11, because the demo has an extra first-half round played by admin mistake.

## 0.5.0 (2026-09-30)

### Added
- Version number in the shortcuts panel and on the start screen, with links to this changelog and to report a bug.
- "Copy debug info" in the shortcuts panel: browser, screen, graphics card, demo name and length, what loaded, read errors and page errors, ready to paste into a bug report. It never includes file contents.
- A short summary after a demo opens: map and textures, overview, player models, weapon models and sounds found, custom models by name, and files that couldn't be read. Custom models are spotted by comparing each file's fingerprint with the stock CS 1.6 files.
- "Clear saved files" on the start screen deletes the maps, models, sounds and overviews this browser saved. It asks for a second click first.
- Bug report and idea templates on GitHub.

## 0.4.0 (2026-09-30)

### Changed
- Players are drawn with the model named in their player info, the same one the game uses. Before, some players showed the wrong model (for example all of Na`Vi in the same skin on Mirage).
- "Names through walls" is off by default.
- The "where players stand" heatmap only counts time when the round is being played: freeze time, the seconds after a round is won, and match pauses are left out, so spawns no longer show as hot spots.
- Heatmap options renamed to say what they show: "where players died", "where kills were made from", "where players stand".
- Cached maps are rebuilt once after this update (for the fence fix), so the first open of each map takes a little longer.

### Added
- Full screen button in the header, and F to toggle it.

### Fixed
- Fences and grates rendered with a purple tint.

### Discussed, not changed
- Heatmap and players shifting back and forth while holding a spot. The "where players stand" map samples every player twice a second and spreads each sample over a small area, so small movements in one spot already add up into a single hot spot. No extra handling needed for now; revisit if a real case shows otherwise.

## 0.3.0 (2026-09-30)

### Added
- First-person weapons in Player's eyes view: draw, shoot, reload, grenade throws and bomb plants, worked out from the demo. USP and M4A1 show with or without the silencer.

### Changed
- Volume slider follows loudness in decibels, the far left is mute, finer steps, and a limiter stops bursts from clipping.
- The GitHub Pages copy is hidden from search engines for now (a "noindex" tag, set in `build.py`). Remove it when the viewer moves to sujandeswal.com.

### Fixed
- Practice rounds before a "live on 3" were counted as part of the match (Moscow 5 vs Na`Vi on Mirage showed 1:3 at the real round 1). It now reads 16-9 to Na`Vi, matching the result posted on [HLTV's match page](https://www.hltv.org/matches/1901911/natus-vincere-vs-moscow-five-eswc-2011) (ESWC 2011).

## 0.2.0 (2026-09-30)

### Added
- Real player and weapon models in 3D, read from your Half-Life folder. Legs run with the movement, the upper body aims where the player looks, shots and reloads animate, and bodies stay on the floor until the round ends. "Player models" toggle to switch back to simple figures.
- Sound from your game files: gunshots, footsteps, reloads, hits, grenades, bomb and radio lines, placed around the listener. Speaker button, volume slider, M to mute.
- The start screen reports how many player models and sounds it found in your folder. Models and sounds are cached in the browser like maps, so later visits can open a demo without picking the folder again.

## 0.1.0 (before 2026-09-30)
- 2D radar, textured 3D and split view; free, eyes and chase cameras; kill timeline with wallbangs, bomb plants and pauses; round, kill and player stats; wallbang finder with copyable timestamps; grenades and smokes; heatmaps; hold-Tab scoreboard with spectators and HLTV audience; kill markers and death cam; breakable vents and glass.
