# CS 1.6 Demo Viewer

Play Counter-Strike 1.6 HLTV demos in your browser. 2D radar, textured 3D replay with the real player models and game sounds, first-person and chase cameras, a kill timeline, round and player stats, heatmaps, and an automatic wallbang finder.

> [!IMPORTANT]
> **You need your own legitimate copy of Counter-Strike 1.6, installed through [Steam](https://store.steampowered.com/app/10/CounterStrike/).**
> The viewer uses the maps, textures, player models and sounds from your installation. It does not include, download or share any of the game's files, and it is not meant to be used with copies of the game obtained any other way.

Everything runs locally in the browser. The page reads the files it needs from your own Half-Life folder (maps, textures, overviews, player models, sounds, kill feed icons, demos). Nothing is uploaded. The only thing this project stores from the game is a short fingerprint of each stock model file, used to tell stock models from custom ones.

This is an unofficial fan project. It is not affiliated with or endorsed by Valve. Counter-Strike, Half-Life and Steam are trademarks of Valve Corporation.

## How to use it

1. Open the viewer at **https://deswalsujan.github.io/cs16-demo-viewer/** in Chrome or Edge. It always has the latest version, so there's nothing to download.
2. Click **Choose folder** and pick your `Half-Life` folder (the one that contains `cstrike` and `valve`). Chrome asks whether to let the page view the folder; the files stay on your computer.
   On your next visit (after closing the tab) Chrome asks once more. Choose **Allow on every visit**, and from then on the folder opens by itself (Chrome and Edge 122 or later). This also works with a downloaded copy of `index.html` opened from your disk.
3. Pick a demo from the list, or open any `.dem` file.
4. Press `?` for keyboard shortcuts.

Three ways to watch: **Normal** shows everything. **Theatre** (`T`) fills the browser window with the view and hides the viewer's own controls until you move the mouse to the top, right or bottom edge. **Full screen** (`F`) is Theatre mode with the browser's tabs and address bar gone too.

The start screen shows which folder is selected and whether it's the right one. Choosing a folder without a `cstrike` folder inside, or the `cstrike` folder itself, says so and explains what to pick. When you add or remove demos, maps, models or sounds, the viewer picks up the changes by itself when you come back to the page. **Open .dem** works once the folder is chosen, for demos kept anywhere.

To start over as on a first visit, click **Clear saved files** on the start screen (it forgets the folder and the files this browser saved), then click the icon left of the address bar and choose **Remove access**.

Firefox, Safari and the claude.ai copy of the viewer can't keep folder access, so there you pick the folder on each visit (Chrome's prompt there says "upload", which is only its wording for picking a folder). The viewer still remembers the folder's name and its list of files, never their contents, so it can show which folder you used last time.

Custom maps work too, as long as the map's `.bsp` (and its `.wad` files if it uses any) are in `cstrike/maps` or `cstrike_downloads/maps`.

## Features

- 2D radar on the in-game overview, 3D view with the map's real textures and lighting, or both side by side
- Cameras: free fly, player's eyes, behind the player. Movement and aim are filled in smoothly between the demo's snapshots (HLTV stores about ten a second)
- Quality setting for the 3D view (auto, high, low) for slower machines
- Theatre mode (T): the view fills the window, and the controls slide back in when the mouse moves to the top, right or bottom edge. Full screen (F) uses it too
- Real player and weapon models from your game files: legs run with the movement, the upper body aims where the player looks, shots and reloads animate, and bodies stay on the floor until the round ends. Team colours (red and blue) on request; simple figures stand in when a model file is missing
- See through walls (H): players behind walls drawn through them in their team colour, with their names, for checking suspected wallhackers
- First-person weapons in Player's eyes view, animated from the demo: drawing, shooting, reloading, grenade throws and bomb plants
- Sniper scope in Player's eyes (AWP, Scout, G3SG1, SG550), as it looks in the game, rebuilt from the zoom clicks the demo records
- Sound from your game files: gunshots, footsteps, reloads, hits, grenades, bomb beeps and radio lines, quieter with distance and panned left or right (M to mute)
- Timeline with kill ticks, wallbangs, bomb plants and pauses; speeds from 0.25x to 8x
- Round list, kill list, and player stats split by T side, CT side and overtime. Warmups, knife rounds and cancelled starts are left out, using the server's own "Live" and end-of-half announcements when the demo has them
- Wallbang finder: kills where the victim was fully hidden and the crosshair was on the wall, with a copyable list of timestamps. Checked at the moment of the killing shot, and never for guns whose bullets stop at the first surface (pistols except the Deagle, SMGs, shotguns)
- Kill lists that read like the game's kill feed: killer, the weapon's kill feed icon from your game files, victim
- Kill markers on the crosshair (kill, headshot, wallbang) and a death cam
- Health, weapons, grenades, smokes, heatmaps, a hold-Tab scoreboard with spectators and the HLTV audience count
- Demos recorded by a player (POV) too, with limits: a player's game only receives the players near them, so others drop in and out of view
- A map recorded in two or more demo files counted as one map: the viewer spots the other part in your folder (same map, same players), puts the parts in order and joins them, with one score, one round list and player stats over all of it. Split them undoes it
- Old demos too. CS 1.6 recorded demos as protocol 47 until the update of 23 October 2008 ([announced](https://www.hltv.org/news/1779/cs-16-update-coming-soon) and [released](https://www.hltv.org/news/1787/cs-16-update-live) on HLTV.org). The Steam version only plays protocol 48, so it refuses those older demos unless they're converted. The viewer plays both as they are
- Remembers your Half-Life folder between visits (Chrome and Edge) and tells you when demos, maps, models or sounds in it change
- Breakable vents and windows disappear in 3D when they are shot out, and doors open and close as they did in the match (the wallbang finder uses where each door really was)

## Project layout

```
src/demo.js         GoldSrc demo (.dem) parser. Runs in a Web Worker.
src/bsp.js          Map (.bsp) and texture (.wad) reader, line-of-sight checks
src/view3d.part.js  3D view (three.js)
src/mdl.js          Studio model (.mdl) reader and skeletal animation
src/players3d.js    Player models in the 3D view: gait, aiming, deaths, corpses, first-person weapons
src/audio.js        Sound: .wav decoding, positional playback, radio lines
src/template.html   The page: layout, styles, 2D radar, timeline, panels
build.py            Combines everything into one self-contained page
CHANGELOG.md        What changed, newest first
docs/               Design images: scope styles, the approved side panel designs (0.13.0), Count them and split maps
tests/              Test and measurement scripts: browser checks, Theatre mode checks, demo data probes (see tests/README.md)
IDEAS.md            Parked ideas and open decisions, with the discussion behind them
CLAUDE.md           How Claude sessions work on this repo: workflow, checking facts, where the test files are
VERSION             Current version, shown in the viewer
src/stock.js        Fingerprints of the stock CS 1.6 models, to spot custom ones
index.html          The built page (what GitHub Pages serves at https://deswalsujan.github.io/cs16-demo-viewer/, updated on every push to main)
```

## Reporting a bug

In the viewer, press `?` and click **Copy debug info**, then open an issue on GitHub and paste it in. It lists your browser, the demo name, what loaded and any errors. It never includes file contents.

## Building

To rebuild after editing anything in `src/`:

```
python3 build.py
```

## Credits

- Demo message layouts were adapted from [hlviewer.js](https://github.com/skyrim/hlviewer.js) by Stefan Stojković (MIT license).
- 3D rendering uses [three.js](https://threejs.org/) r128 (MIT license), loaded from cdnjs.
- Counter-Strike and Half-Life are trademarks of Valve. This project is unofficial and not affiliated with Valve.
