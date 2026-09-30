# Changelog

What changed in the viewer, newest first. Dates are when the change went live.

## 2026-09-30

### Added
- Real player and weapon models in 3D, read from your Half-Life folder. Legs run with the movement, the upper body aims where the player looks, shots and reloads animate, and bodies stay on the floor until the round ends. "Player models" toggle to switch back to simple figures.
- First-person weapons in Player's eyes view: draw, shoot, reload, grenade throws and bomb plants, worked out from the demo. USP and M4A1 show with or without the silencer.
- Sound from your game files: gunshots, footsteps, reloads, hits, grenades, bomb and radio lines, placed around the listener. Speaker button, volume slider, M to mute.
- Full screen button in the header, and F to toggle it.

### Changed
- Players are drawn with the model named in their player info, the same one the game uses. Before, some players showed the wrong model (for example all of Na`Vi in the same skin on Mirage).
- "Names through walls" is off by default.
- The "where players stand" heatmap only counts time when the round is being played: freeze time, the seconds after a round is won, and match pauses are left out, so spawns no longer show as hot spots.
- Heatmap options renamed to say what they show: "where players died", "where kills were made from", "where players stand".
- Volume slider follows loudness in decibels, the far left is mute, finer steps, and a limiter stops bursts from clipping.

### Fixed
- Practice rounds before a "live on 3" were counted as part of the match (Moscow 5 vs Na`Vi on Mirage showed 1:3 at the real round 1).
- Fences and grates rendered with a purple tint.

### Discussed, not changed
- Heatmap and players shifting back and forth while holding a spot. The "where players stand" map samples every player twice a second and spreads each sample over a small area, so small movements in one spot already add up into a single hot spot. No extra handling needed for now; revisit if a real case shows otherwise.

## Earlier
- 2D radar, textured 3D and split view; free, eyes and chase cameras; kill timeline with wallbangs, bomb plants and pauses; round, kill and player stats; wallbang finder with copyable timestamps; grenades and smokes; heatmaps; hold-Tab scoreboard with spectators and HLTV audience; kill markers and death cam; breakable vents and glass.
