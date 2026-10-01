# Changelog

What changed in the viewer, newest first. The version shows in the viewer's shortcuts panel (press ?) and on the start screen.

## Known limits (current version)
- HLTV demos don't record the first-person weapon's animation, so it's rebuilt from shots, weapon switches and the player's body animation. Timing can differ slightly from in-game, and idle variations won't match. If a `v_` model is missing, no gun is shown.
- Player models get even lighting, so they don't darken in shaded spots the way they do in-game.
- Custom models are named in the load summary but not checked further yet. One with an unusual skeleton may pose oddly; compressed or 24-bit sounds stay silent.
- A demo that's cut off (interrupted download or recording) can't be opened at all yet, even though the part before the cut is readable. See [IDEAS.md](IDEAS.md).
- Which rounds count is exact when the server's admin plugin announces "Live !" and the end of each half in chat. Demos without those messages fall back to a guess from the restarts, which can still count a warmup or miss a round.
- Na`Vi vs FX on Dust2 shows 17-11 against the official 16-11, because the demo has an extra first-half round played by admin mistake. Not re-checked since 0.7.1.
- HLTV demos store about ten snapshots a second, so everything between two snapshots is an estimate. A flick that starts and ends between snapshots can't be recovered, and a sharp turn can look slightly rounder than it was. Turn "Smooth aim" off to see the recorded aim without the extra smoothing.
- Theatre mode: in testing on a 14-inch MacBook-sized screen, the header stayed up when the mouse rested just below it near the top edge, instead of hiding after 2 seconds. See 0.9.0 below.
- Theatre mode switches on by itself only with the viewer's own full screen (F or the Full screen button). The browser's full screen (F11 on Windows, the green window button or Ctrl+Cmd+F on a Mac) doesn't tell the page, so press T there.
- "Quality: auto" lowers 3D sharpness at most once per visit and doesn't raise it again on its own. Pick "Quality: high" to go back.

## 0.9.0 (2026-10-01)

### Added
- Theatre mode (T, or the Theatre button in the header): the view fills the whole window, with no header, side panel or bottom bar. Move the mouse to an edge for the controls on that side: the top brings in the header and camera buttons, the right the rounds, kills and players panel, the bottom the timeline, playback controls and display toggles.
  - The controls float over the view, so the view never changes size when they come and go.
  - They stay while the mouse is on them (or a menu from them is open), even if the mouse stops moving, and hide shortly after it moves away. Near an edge but not on the bar, they hide after 2 seconds without the mouse moving.
  - Dragging to look around in 3D, or to pan the radar, never pulls them in, even when the drag ends at an edge.
  - The round pill also shows the score and team names, since the header is hidden. The kill feed, round pill, player name strip and split-view radar move out of the way of whichever bar is showing.
  - The mouse pointer hides after 2 seconds without moving.
- Full screen (F) now uses Theatre mode. Leaving full screen puts back the layout you had before.
- The start screen ("Open another demo") shows the normal layout; going back to the demo returns to Theatre mode.

### How it was tested
A script drove a real mouse and keyboard through 39 checks on five screen setups: a 14-inch and a 13-inch MacBook (Retina, 2x), and a Windows screen at 100%, 125% and 150% scaling (the Windows display setting). Among the checks: the view fills the window exactly, each edge brings in its own controls, the view keeps its size when they appear, a bar that slides in under a still mouse stays, timeline scrubbing works and keeps the bar, drags don't pull bars in, full screen switches Theatre mode on and back off, and no page errors.

Results on the final build: the 13-inch Mac, Windows 100% and Windows 125% passed all 39. Windows 150% passed all 39 on the build just before the last fix (that fix only ignores pointer events where the mouse didn't move) and wasn't rerun.

**One check still fails, on the 14-inch Mac setup (1512 × 982 at 2x):** with the mouse resting just below the header, inside the top edge zone, the header should hide after 2 seconds; in the test it stayed up for more than 30 seconds. The same check passes on the 13-inch Mac and on Windows. Not yet known whether this is a real bug or an effect of the test browser drawing 3D in software (at this size it took about 10 seconds to process the mouse moves). Next step: log every pointer event the page receives at that moment, or check it by hand on a real 14-inch MacBook.

Two things found and fixed while testing: a bar that slid in under a mouse that wasn't moving used to hide after 2 seconds even with the pointer on it, and Chrome's "moves" sent when something slides under a still mouse used to restart the hide countdown.

## 0.8.0 (2026-10-01)

### Changed
- Smoother playback, most of all in Player's eyes. HLTV demos store about ten snapshots a second (every 107 ms on the Na`Vi vs FX Dust2 demo), and the viewer used to join them with straight lines, which turned corners with a jolt at every snapshot. Movement and aim now follow smooth curves through the snapshots around each moment. The curves never swing past a snapshot, so a player who stops dead or turns back doesn't overshoot.
- Up and down aim is now filled in between snapshots too. Before, it held still and then snapped to the next snapshot, which was most of the stutter in Player's eyes.
- The demo stamps its snapshots a little unevenly (a 156 ms gap followed by a 68 ms one while the player runs at a steady speed). Filling in between snapshots now uses evened-out times, which removes most of that wobble. Kills, sounds and every other event keep their exact times.
- Less work per frame: names are checked for being behind walls about ten times a second instead of every frame, grenades, smokes, kill lines and death marks are reused instead of rebuilt every frame, the timeline is drawn once and only the playhead moves, and the page no longer re-reads its font from the styles on every frame.

### Added
- "Smooth aim" in the 3D bar (on by default): in Player's eyes the view trails the recorded aim by about 30 ms, which takes the edge off the jolts the snapshots still leave. It snaps straight to the aim after a jump in time, a new player or a camera switch. Turn it off to see the recorded aim exactly.
- "Quality" in the 3D bar: high draws the 3D view at the screen's full sharpness (up to 2x on Retina and other high-density screens), low draws fewer pixels than the screen for slower machines, and auto (the default) starts at high and steps down to 1x if the 3D view averages under 45 frames a second for a few seconds. The choice is remembered.

### How it was measured
Six 10-second stretches of the Na`Vi vs FX Dust2 demo (rounds 1, 4, 11, 15, 21 and 28, each following the busiest living player in Player's eyes), stepped at exactly 60 frames a second in a headless browser, recording the camera on every frame. A "jolt" is a frame where the camera's turning or movement changes more than a set amount from the frame before (0.5 degrees for aim, 0.5 units for movement).

| | 0.7.1 | 0.8.0 |
|---|---|---|
| Aim jolts (of 3,594 frames) | 691 | 465 |
| Biggest aim jolt, top 1% | 6.2° | 2.5° |
| Biggest aim jolt | 15.1° | 4.0° |
| Frames where up/down aim didn't move at all | 3,124 | 80 |
| Movement jolts | 353 | 218 |
| Biggest movement jolt | 4.4 units | 1.9 units |
| The viewer's own work per frame in Player's eyes (3D drawing not counted) | 4.9 ms | 1.9 ms |

With "Smooth aim" off, 0.8.0 still has 487 aim jolts and a biggest jolt of 6.4°; the curves do most of the work and Smooth aim takes off the rest. Frame times are from a headless browser that draws 3D in software, so only the before and after comparison means anything, not the numbers themselves.

## 0.7.1 (2026-10-01)

### Fixed
- Wrong scores when the second-half warmup was played as real rounds. mousesports vs AGAiN (Inferno, ESWC 2011 final) showed 15-15 over 32 rounds; it now reads 16-11 to mousesports over 27, and Fnatic vs mousesports (Tuscan) 15-15 instead of 16-15. When the server's admin plugin announces "Live !", "End of 1st set" or "Current set canceled", the viewer now uses those to decide which rounds count. Checked round by round against the plugin's "Current score" messages on all three test demos (Nuke, Tuscan, Inferno): every score matches. Demos without such messages still use the restart-based guess, which now also drops a short warmup stretch at half time.
- Players who died showed as alive again in the Players tab a few seconds later (for example PASHA, 742 and ninja at 23:00 on Inferno). The demo stops sending a dead player's body after a moment, and that gap was read as alive.
- Inferno's lamp posts showed as brown wooden pillars. Each lamp has an invisible box around it for players to bump into; the viewer drew that box. Entities with a see-through render mode and no amount set are now invisible, as in the game.
- The Inferno vent showed as a slatted box. Map faces are now drawn one-sided like the game, so the vent's sides hidden inside the wall no longer show.

## 0.7.0 (2026-10-01)

### Fixed
- Doors are no longer treated as always closed. The demo records where every door is and how far it's turned, and the viewer now uses that: open doors (either way) no longer count as cover in the wallbang finder, and in 3D doors open and close as they did in the match. Applies to every door, including the Nuke rotating door, the Tuscan A site door and the Inferno blue door. On Fnatic vs ALTERNATE (Nuke) 7 false wallbangs through the open door are gone; on Fnatic vs mousesports (Tuscan) 3, including both round 14 kills at 1:05. Kills through the Nuke glass doors while they're shut still count.
- First-person weapons are held in the right hand, like CS 1.6's default. The stock model files are left-handed, and the game mirrors them.
- The start screen scrolls on smaller screens, so the demo list, messages and "Clear saved files" are always reachable.
- Opening a demo that was deleted or moved after choosing the folder no longer hangs on the progress bar. It says the file is gone, takes it off the list, and asks to choose the folder again.

### Added
- Coming back to the page checks the listed demos are still in the folder, and takes any that were deleted or moved off the list with a note.
- The load summary warns when files in the Half-Life folder changed on disk after the folder was chosen (for example when copying the folder over again), names a few, and offers "Choose Half-Life folder". Until then the viewer uses the copies this browser saved, where it has them.
- Dead players are greyed out in the Players tab with a "dead" tag and can't be picked (or jumped to with 1 to 0) until the next round. Clicking one says why.
- Clearer notes in the load summary: where the radar overview files belong, and how many of the missing sounds are weapon sounds.

## 0.6.0 (2026-10-01)

### Changed
- The load summary is now a card in the middle of the view instead of a note in the corner. It opens with "Checking your files…" as soon as the demo is read, then lists each check with a tick, a warning or a cross, and what it means for playback (for example "Those players show as simple figures").
- A headline on the card says whether the demo will play: "Ready to watch", "The demo will play, with a few gaps", "The demo will play, in 2D only", or "This demo can't be played".
- The card closes on its own: after 6 seconds when everything loaded, 15 seconds when there are gaps. A bar and "Closes in N s" count down. Moving the mouse over the card pauses it. The × button, Esc, clicking outside the card, or pressing play closes it straight away. A "can't play" card stays until closed.
- Custom models are listed on their own line in the card (they're used, just flagged).
- Files that aren't demos, and demos that are cut off, now explain why in plain words instead of showing a technical error.

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
