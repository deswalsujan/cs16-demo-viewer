# Changelog

What changed in the viewer, newest first. The version shows in the viewer's shortcuts panel (press ?) and on the start screen.

## Known limits (current version)
- HLTV demos don't record the first-person weapon's animation, so it's rebuilt from shots, weapon switches and the player's body animation. Timing can differ slightly from in-game, and idle variations won't match. If a `v_` model is missing, no gun is shown.
- Player models get even lighting, so they don't darken in shaded spots the way they do in-game.
- Custom models are named in the load summary but not checked further yet. One with an unusual skeleton may pose oddly; compressed or 24-bit sounds stay silent.
- A demo that's cut off (interrupted download or recording) can't be opened at all yet, even though the part before the cut is readable. See [IDEAS.md](IDEAS.md).
- Which rounds count is exact when the server's admin plugin announces "Live !" and the end of each half in chat. Demos without those messages fall back to a guess from the restarts, which can still count a warmup or miss a round.
- Na`Vi vs FX on Dust2 shows 17-11 against the official 16-11, because the demo has an extra first-half round played by admin mistake. Not re-checked since 0.7.1.
- HLTV demos store about ten snapshots a second, so everything between two snapshots is an estimate. A flick that starts and ends between snapshots can't be recovered, and a sharp turn can look slightly rounder than it was. The view always passes exactly through every recorded snapshot.
- At the moment of a kill, the shooter's crosshair can sit slightly off the victim, usually under 1.5° (through an AWP's 1x zoom that's up to about 60 pixels on a laptop screen). This comes from the demo, not the viewer: see 0.10.0, "Discussed, not changed".
- The sniper scope is rebuilt from the zoom click sounds, since HLTV demos don't record zoom (see 0.10.0). A click the recorder didn't hear would put the zoom one step off until the player's next weapon switch, death or round. Clicks are timed to about a tenth of a second.
- Theatre mode switches on by itself only with the viewer's own full screen (F or the Full screen button). The browser's full screen (F11 on Windows, the green window button or Ctrl+Cmd+F on a Mac) doesn't tell the page, so press T there.
- "Quality: auto" lowers 3D sharpness at most once per visit and doesn't raise it again on its own. Pick "Quality: high" to go back.
- Keeping the Half-Life folder between visits works in Chrome and Edge (122 or later) on an https page such as GitHub Pages. Firefox and Safari don't have the browser feature it needs, and the claude.ai copy is an embedded page, where browsers don't allow it; those pick the folder on each visit. A copy of index.html opened from your own disk also keeps it (checked in Chrome by Sujan, 1 Oct 2026).

## 0.12.3 (2026-10-01)

### Changed
- Opening another demo keeps your viewing settings and starts playback fresh. Kept: the view (2D, 3D or 3D + radar), Names, Grenades, Kill lines, See through walls, Team colours, Quality, sound and volume, and the timeline's match or round setting. Reset: speed goes back to 1x and the demo opens paused. Before, the speed carried over too (a new demo could start at 0.25x).
- Those settings are also remembered between visits, in this browser (Team colours, Quality and sound already were). "Clear saved files" leaves them alone, since they're preferences rather than files from your folder.

### How it was tested
On Sujan's files: Dust2 switched to 3D at 0.25x, playing, with Names and Grenades off, See through walls on and the timeline on round; then the 2006 Train demo opened in 3D at 1x, paused, with all of those kept (`tests/page/new_demo_settings.js`). `tests/prefs_check.py`: the defaults on a first visit, saved settings restored after a reload, and damaged saved settings falling back to the defaults. The folder and start screen checks still pass.

## 0.12.2 (2026-10-01)

### Fixed
- Reset view now works in 3D. It used to reset only the 2D radar's zoom and pan, so in 3D it did nothing. Now it goes back to the starting view everywhere: the whole radar in 2D, and in 3D the overview camera the demo opens with, as a free camera (it stops riding along in Player's eyes or Behind player; the player you were following stays highlighted). In split view both reset. Checked on Dust2 from Player's eyes, Behind player and a moved free camera, in 2D, 3D and split view (`tests/page/reset_view.js`).

## 0.12.1 (2026-10-01)

Changes from Sujan's first hands-on test of 0.12.0.

### Changed
- Changes in the folder are now picked up by themselves. Every time you come back to the page or to the start screen (at most once every 2 seconds), the viewer reads the folder again and the demo list updates. The "Changes found: 10 demos removed. Refresh to use them." note and its Refresh button are gone. Why: the note and the list disagreed (it said 10 demos were removed while all 16 were still listed), and the viewer only looked again after 30 seconds, so a second change made soon after the first wasn't seen and the note looked stuck.
- The row says "Folder selected: <name>" instead of "Half-Life folder: <name>", so it doesn't claim the folder is right before it's checked. Before a folder is chosen it explains what's expected, with an example: the Half-Life folder from your Steam install, which contains cstrike and valve, usually `C:\Program Files (x86)\Steam\steamapps\common\Half-Life` on Windows (the default install path, as given in [this CS 1.6 setup guide](https://djdallmann.github.io/GamingPCSetup/CONTENT/DOCS/GAMECONFIGS/CS16/SETUPCONFIG.html)). The same text is the row title's tooltip.
- A demo can only be opened once the folder is chosen. "Open .dem" is greyed out until then, and dropping a demo on the page asks for the folder first. Without the folder there's no map, overview, models or sound, so a demo showed players as dots on an empty grid.
- "Clear saved files" now also forgets the folder, and the start screen goes straight back to how it looks on a first visit, without a reload. Its confirm click says so ("Click again to forget the folder and delete … of saved files"). Chrome's own permission to read the folder stays until you remove it (the icon left of the address bar, then Remove access); the note after clearing says so.

### Added
- Checks on the chosen folder:
  - **Not the Half-Life folder** (red), when it has no cstrike folder inside, with what to choose instead and the example path. Nothing from it is loaded.
  - The same when the cstrike, cstrike_downloads or valve folder itself was chosen, asking for the folder one level up.
  - **No demos found** (orange), when it's the right folder but has no .dem files. Open .dem still works for demos kept elsewhere.
  - **Up to date. 16 demos found.** (green) otherwise.

### How it was tested
`tests/folder_row_test.py`, now 20 checks, all passed: first visit with the example path and Open .dem greyed out; picking; changes applied by themselves, including a second change right after the first; Reconnect; opening by itself on the next visit; a wrong folder, the cstrike folder itself and a Half-Life folder without demos; Clear saved files back to the first-visit state, also after a reload; dropping a demo with no folder; the ordinary folder pick, including a wrong folder; and the page inside a frame from another site. Also run on Sujan's real files (Dust2): the demo, map and models load through the reworked folder code.

### Discussed, not changed
- Bundling the competitive maps' radar overviews so a demo could play in 2D without the folder: ruled out. The overviews are Valve's game files (`cstrike/overviews`, about 770 KB each as .bmp), and the project doesn't host Valve's files. Even with them, it would only be dots on a flat radar, with no 3D, models or sound.
- Putting "Open a demo" first: no, the folder comes first and is now required, since everything but the demo itself comes from it.
- A downloaded index.html opened from disk keeps the folder too (checked by Sujan).

## 0.12.0 (2026-10-01)

### Added
- The viewer remembers your Half-Life folder between visits. In Chrome and Edge (122 or later) on an https page, pick it once; on the next visit Chrome asks once more, and choosing "Allow on every visit" means it opens by itself from then on ([Chrome's announcement](https://developer.chrome.com/blog/persistent-permissions-for-the-file-system-access-api)). The viewer only keeps the browser's permission to read the folder, plus the folder's name and its list of files (names, sizes and dates, never contents), in this browser.
- A permanent "Half-Life folder" row on the start screen, in place of the old step 1. It shows the folder's name and its state:
  - **Up to date.** When the page opens, anything that changed since your last visit is picked up straight away and listed ("Picked up since last time: 3 new demos, 1 removed").
  - **Changes found** (replaced in 0.12.1: changes are now applied by themselves). Coming back to the page (at most every 30 seconds) or to the start screen (at most every 5 seconds), the viewer reads the folder again. If demos, maps, models, sounds, overviews or texture files were added, removed or replaced, it lists them and offers **Refresh**. While a demo is open, a short note says so too. Refreshing reloads any changed model, sound or the current map.
  - **Reconnect,** when Chrome wants your OK again (you chose "Allow this time" last visit).
  - Elsewhere (Firefox, Safari, the claude.ai copy), the row keeps the folder's name and asks you to choose it again for this visit; once chosen, it still says what changed since last time.
- The "Choose Half-Life folder" buttons in the 3D view and the load summary become "Refresh Half-Life folder" when the folder is remembered.

### Changed
- Choosing or refreshing the folder now reads it afresh, so files deleted since the last pick drop out of the lists. Before, maps, models and sounds from an earlier pick stayed listed.

### How it was tested
`tests/folder_row_test.py`, 13 checks, all passed: first visit, picking the folder, changes found while the page is open (3 new demos, 1 removed, 1 model replaced) and Refresh, Reconnect on the next visit, the folder opening by itself on the visit after with its changes applied, the ordinary folder pick with its "since last time" summary, the name remembered for the next visit, and the page inside a frame from another site (like the claude.ai copy) falling back to the ordinary pick. Chrome's real folder picker and its prompts can't be operated in the headless test browser, so those checks use a stand-in for Chrome's folder access. Checked by hand by Sujan (1 Oct 2026): on GitHub Pages Chrome's prompt says "view files", and a downloaded index.html opened from disk keeps the folder across reloads. Still to check by hand: Reconnect and "Allow on every visit", which only appear after every tab of the site was closed (a reload keeps Chrome's access: it lasts "until you close the last tab of the origin", per Chrome's announcement).

Also run on Sujan's real files (Dust2, Na`Vi vs FX): the demo, map, textures, overview and models load through the new folder code with no page errors (`tests/page/modes_and_toggles.js`, which no longer clicks the Smooth aim button removed in 0.10.0). And the 2006 Team3D vs Fnatic demo on Train, for 0.11.1: the file says protocol 47, it reads with zero errors, 30 live rounds.

### Discussed, not changed
- Changes found when the page opens are applied without a click (it's a fresh start anyway); changes found while it's open wait for Refresh, so the list doesn't shift under you. Agreed 1 Oct 2026.
- GitHub Pages (https://deswalsujan.github.io/cs16-demo-viewer/) is live since 1 Oct 2026 and updates on every push, so the folder can be remembered without waiting for sujandeswal.com.

## 0.11.1 (2026-10-01)

### Added
- A note on the start screen and in the README that the viewer plays old protocol 47 demos, which the Steam version of CS 1.6 won't open. Sujan confirmed it with a 2006 demo.
  - CS 1.6 recorded demos as protocol 47 until the update of 23 October 2008, which moved the game to protocol 48. HLTV.org warned beforehand that all older demos would stop playing ([22 Oct 2008](https://www.hltv.org/news/1779/cs-16-update-coming-soon)), then reported on release day that a 47 demo can be converted by editing the protocol number in the file, and that it would convert its archive ([23 Oct 2008](https://www.hltv.org/news/1787/cs-16-update-live)). So "protocol 47" means anything recorded before late October 2008, not only 2005-2006 as first thought.
  - That today's Steam version still refuses them rests on those posts and Sujan's own test; no recent source says so directly.
  - The viewer reads the protocol number from the file header but doesn't check it, so it reads both kinds the same way.

### Fixed
- `tests/start_screen_check.py` had a broken first line and didn't run.

## 0.11.0 (2026-10-01)

### Added
- "See through walls" (H), replacing "Names through walls". Players behind walls are drawn on top of the walls as see-through bodies in their team colour (red for Terrorists, blue for Counter-Terrorists), with their names. Players in plain sight look as usual. Made for admins checking suspected wallhackers: follow the suspect in Player's eyes with it on, and watch whether their crosshair tracks enemies they can't see. It works whether or not names are shown. There's no distance limit: far-away players are small on screen anyway, and a wallhacker can track people anywhere.
  - "Behind a wall" uses the same line-of-sight check as the names: from the camera to the player's head and feet, through the map and its doors and breakables. Each player is re-checked about 10 times a second, so a body can take up to a tenth of a second to switch when someone steps out of cover.
  - Checked on Dust2 (round 4, Player's eyes): 7 players were behind walls, and those 7, and only those, were drawn through the walls.
- "Team colours", replacing the "Player models" button. It draws the real player models in flat red (Terrorists) and blue (Counter-Terrorists), with their shading kept, so the sides read at a glance. Weapons keep their normal look. Off by default; the choice is remembered.

### Changed
- The simple figures (the capsule shapes) are no longer a choice. They're used automatically for any player whose model file is missing or can't be read, as before. Checked by removing the model files: all 10 players switched to figures.

### Discussed, not changed
- What "units" are: the game's measure of distance, roughly an inch each. A standing player is 72 units tall and 32 wide, a crouching one 36 tall. "Through 16 units of wall" in the Wallbangs tab means about 16 inches of cover.
- Measuring wallhacks automatically (how long a player's crosshair stays on enemies hidden behind walls) is parked in [IDEAS.md](IDEAS.md).

## 0.10.1 (2026-10-01)

### Changed
- The sniper scope now looks like the game's: thin black lines, six mil-dots along each half of both lines, and a red dot in the middle. Two other styles stay in the code, unused, so either can be switched on later without a menu option: "clean" (lines and red dot, no mil-dots, so dots never cover a dark player model) and "lines" (lines only, as in 0.10.0). They're shown side by side in [docs/scope-designs.png](docs/scope-designs.png); the switch is `SCOPE_STYLE` in `src/view3d.part.js`.

### Removed
- The no-scope and quick-scope labels on sniper kills, added in 0.10.0. An HLTV demo stamps the zoom click and the shot to its snapshots, about a tenth of a second apart, so it can't tell a real quick-scope (right-click immediately followed by left-click) from a scope that was just a little quicker than usual. Karrigan's two "quick-scopes" on Tuscan (round 12) are a case in point: the zoom click and the shot landed in the same snapshot. A search for an established cut-off turned up nothing measured: no AMX Mod X plugin found that detects quick-scopes in CS 1.6 (the AlliedModders threads on quick-scope plugins are for CS:S and CS:GO and couldn't be opened), only config scripts and memes. Viewers judge for themselves by watching the scope come up before the shot.

### Discussed, not changed
- Accuracy over looks, for both the crosshair and the scope: the viewer shows what the demo recorded and what the game shows, even where a tidier version would read better (no snapping the crosshair onto the victim at a kill, and the game's own scope with mil-dots).
- A choice of scope styles in the menu: decided against for now, as it would clutter the menu for little gain.

## 0.10.0 (2026-10-01)

### Added
- Sniper scope in Player's eyes. When the player you follow zooms in with an AWP, Scout, G3SG1 or SG550, the view narrows to the game's zoom (AWP: 1x and 2x) and shows the scope: black around a round lens with crosshair lines across it, and no gun in hand.
  - HLTV demos don't record zoom: the only zoom messages in the file are for the HLTV recorder itself, and none of the player fields the demo stores changes when someone zooms (checked on Tuscan: of the 766 zoom clicks, the closest-matching field lines up with just 1). What the demo does record is the zoom click sound the game plays on every right-click with a sniper rifle, with the time and the player. The scope is rebuilt from those clicks.
  - The rules, as the game applies them and confirmed in the demos: each click steps the zoom (none, 1x, 2x, none). An AWP or Scout shot drops the zoom while the bolt cycles, and it comes back by itself at the same level: between consecutive AWP shots on Tuscan, 27 of 28 times there was no click and no weapon switch. Switching weapons drops the zoom: 18 of 19 single clicks between shots followed a weapon switch (the knife quick-switch). Dying and a new round drop it too.
  - Checked against kills: 20 of 24 sniper kills on Dust2 and 48 of 60 on Tuscan have a zoom click by the killer in the 3 seconds before; the rest were zoomed in earlier than that.
- No-scope and quick-scope labels on sniper kills (removed in 0.10.1, see there), in the Kills list and on the crosshair kill marker. No-scope: not zoomed in when the shot was fired. Quick-scope: zoomed in at most 0.3 seconds before the shot (a first guess, open in [IDEAS.md](IDEAS.md) until checked against real kills). Clicks and shots are stamped to the demo's snapshots, about a tenth of a second apart, so a zoom-in and its shot can land in the same snapshot; the scope then shows for 0.1 seconds before the shot, so a quick-scope is visible instead of lasting zero frames, and the kill still counts as a quick-scope.

### Removed
- "Smooth aim". The whole story:
  - **The problem.** HLTV demos store about ten snapshots a second (every 107 ms on the Na`Vi vs FX Dust2 demo). Up to 0.7.1 the viewer joined them with straight lines and didn't fill in up and down aim at all, so Player's eyes stuttered.
  - **What 0.8.0 did.** Two things. First, movement and aim follow smooth curves that pass exactly through every recorded snapshot, up and down aim included, using evened-out snapshot times. Second, "Smooth aim" (on by default): the camera trailed the recorded aim by about 30 ms (an exponential lag with a 30 ms time constant), snapping straight to the aim after a jump of more than 0.3 seconds, a new player or a camera switch.
  - **What each part was worth.** Over six 10-second stretches at 60 frames a second, aim jolts went from 691 (0.7.1) to 487 with the curves alone, and 465 with Smooth aim on top. The biggest jolt went from 15.1° to 6.4° with the curves, and 4.0° with Smooth aim. Up and down aim stopped freezing (3,124 frozen frames down to 80). So the curves did almost all the work, and Smooth aim only softened fast flicks. Sujan saw no difference at normal speed.
  - **Why it was removed.** It's artificial: it shows the aim where it was about 30 ms ago, not where it was. During a fast flick of 300° a second, the crosshair sits about 9° behind the player's real aim, exactly at the moments that matter most here: judging a flick, a quick-scope or a suspicious lock-on through a wall. The curves stay, because they pass through every recorded snapshot exactly and only fill the gaps, which the old straight lines also had to guess. An accurate view beats a slightly smoother one, and the 3D bar has one button less.

### Discussed, not changed
- Crosshair not on the victim at the moment of a kill (Sujan spotted it on PASHA's kills on EdwardwOw~ and Zeus, and markeloff's on 742, Dust2 round 25). Checked on Dust2:
  - **Not a viewer bug in camera height or aim.** Across 63 headshots from more than 300 units away, the aim at the kill landed on average 0.5° below a guessed head centre and 0.3° to the side, with misses scattered both ways (half within about -1.8° to +0.7° up and down). A wrong eye height or pitch would push every miss the same way by a similar amount.
  - **It's how HLTV records.** The demo stores aim and positions about ten times a second, and a shot falls between two of those snapshots, so the kill shows up at the next one. A victim moving at 140 units a second moves 14 units, half a body width, in a tenth of a second. On top of that, the shooter's game draws enemies about 0.1 seconds in the past (ex_interp), and the server checks the hit against that older position, while HLTV stores the server's current one. Moving victims back in time didn't close the gap consistently, so that isn't the whole story either.
  - **The viewer adds a little.** Its in-between curve can shift the aim at the kill moment slightly either way (for example markeloff's AWP kill on PASHA in round 10: on target in the stored snapshot, 1.2° off in the viewer; other kills move the other way). Neither is the true moment of the shot, which the demo doesn't contain.
  - **Why it looks big through a scope.** At the AWP's 1x zoom, 1° is about 40 pixels on a laptop-sized view, against about 17 without the scope.
  - Left as it is. Worth checking one of these kills in the game's own demo player, which is expected to show the same offset.

## 0.9.3 (2026-10-01)

### Fixed
- Theatre and Full screen could be clicked on the start screen before any demo was open. They're now greyed out until a demo is open, like the other controls.

## 0.9.2 (2026-10-01)

### Changed
- Theatre mode: the header, side panel and bottom bar now come in and go out together. Moving the mouse to the top, right or bottom edge brings back the normal layout; moving back to the middle hides it again. Before, each edge brought in only its own panel, which made the panels overlap and was one more thing to learn. Dragging to look around or pan the radar still never brings them in.
- The score in the round pill is hidden while the header is showing, so it doesn't appear twice.

### Discussed, not changed
- Showing each panel on its own edge versus all together: all together matches what video players do and what Normal mode looks like, so it's one thing to learn and nothing can overlap. The trigger stays at the edges rather than any mouse movement (as YouTube does), because dragging to look around is the main thing the mouse does here.

## 0.9.1 (2026-10-01)

### Fixed
- Theatre mode: reaching for the side panel's tabs (Rounds, Kills, Players, Wallbangs) also brought in the header, and the panel covered it. While the mouse is on the side panel, header or bottom bar, the other edges no longer pull theirs in. The side panel now sits between the header and the bottom bar, as in the normal layout, so all three can be open together without covering each other (the header's Theatre, Full screen and Open another demo buttons stay reachable).

## 0.9.0 (2026-10-01)

### Added
- Theatre mode (T, or the Theatre button in the header): the view fills the whole window, with no header, side panel or bottom bar. Move the mouse to an edge for the controls on that side (changed in 0.9.2: all of them come in together).
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

One check failed only in the test browser on the 14-inch Mac setup (1512 × 982 at 2x): with the mouse resting just below the header, the header stayed up instead of hiding after 2 seconds. Checked by hand on a real MacBook on 1 Oct 2026: the header hides after about 2 seconds as it should. The failure came from the test browser, which draws 3D without a graphics chip and was too slow at that screen size.

Two things found and fixed while testing: a bar that slid in under a mouse that wasn't moving used to hide after 2 seconds even with the pointer on it, and Chrome's "moves" sent when something slides under a still mouse used to restart the hide countdown.

### Discussed, not changed
- The name: "raw" was considered but could be read as "raw aim", next to the Smooth aim button. Theatre mode it is.
- Normal, Theatre and full screen: Normal shows everything. Theatre hides the viewer's own header, side panel and bottom bar but keeps the browser's tabs and address bar. Full screen is Theatre mode with the browser's top bar gone too. In the claude.ai artifact, Theatre fills only the artifact's area.

## 0.8.0 (2026-10-01)

### Changed
- Smoother playback, most of all in Player's eyes. HLTV demos store about ten snapshots a second (every 107 ms on the Na`Vi vs FX Dust2 demo), and the viewer used to join them with straight lines, which turned corners with a jolt at every snapshot. Movement and aim now follow smooth curves through the snapshots around each moment. The curves never swing past a snapshot, so a player who stops dead or turns back doesn't overshoot.
- Up and down aim is now filled in between snapshots too. Before, it held still and then snapped to the next snapshot, which was most of the stutter in Player's eyes.
- The demo stamps its snapshots a little unevenly (a 156 ms gap followed by a 68 ms one while the player runs at a steady speed). Filling in between snapshots now uses evened-out times, which removes most of that wobble. Kills, sounds and every other event keep their exact times.
- Less work per frame: names are checked for being behind walls about ten times a second instead of every frame, grenades, smokes, kill lines and death marks are reused instead of rebuilt every frame, the timeline is drawn once and only the playhead moves, and the page no longer re-reads its font from the styles on every frame.

### Added
- "Smooth aim" in the 3D bar (on by default; removed in 0.10.0, see there for why): in Player's eyes the view trails the recorded aim by about 30 ms, which takes the edge off the jolts the snapshots still leave. It snaps straight to the aim after a jump in time, a new player or a camera switch. Turn it off to see the recorded aim exactly.
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

### Discussed, not changed
- Smooth aim made no visible difference at normal speed in Sujan's first look. It's meant to be subtle: it shows on fast flicks, best at 0.25x or 0.5x. Removed in 0.10.0: see there for the reasons.
- How "Quality: auto" decides: it starts at the screen's full sharpness (2 screen pixels per point each way on a Retina Mac), counts frames every 3 seconds while the 3D view is showing, and if that's under 45 a second it drops once to 1 pixel per point and says so. It ignores one-off freezes and hidden tabs, never raises sharpness again by itself, and does nothing on a normal (non-Retina) screen. "Low" draws 0.75 pixels per point, which is why the gun looks soft there.

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
