# CS 1.6 Demo Viewer

Play Counter-Strike 1.6 HLTV demos in your browser. 2D radar, textured 3D replay with the real player models and game sounds, first-person and chase cameras, a kill timeline, round and player stats, heatmaps, and an automatic wallbang finder.

Everything runs locally in the browser. The page reads your own Counter-Strike 1.6 files (maps, textures, overviews, player models, sounds, demos) from your computer. Nothing is uploaded and no game files are included here.

## How to use it

1. Open the viewer page in Chrome or Edge.
2. Click **Choose folder** and pick your `Half-Life` folder (the one that contains `cstrike` and `valve`).
   Chrome will ask whether to "upload" the files. That is Chrome's standard wording for picking a folder. The files stay on your computer.
3. Pick a demo from the list, or open any `.dem` file.
4. Press `?` for keyboard shortcuts.

Custom maps work too, as long as the map's `.bsp` (and its `.wad` files if it uses any) are in `cstrike/maps` or `cstrike_downloads/maps`.

## Features

- 2D radar on the in-game overview, 3D view with the map's real textures and lighting, or both side by side
- Cameras: free fly, player's eyes, behind the player
- Real player and weapon models from your game files: legs run with the movement, the upper body aims where the player looks, shots and reloads animate, and bodies stay on the floor until the round ends
- Sound from your game files: gunshots, footsteps, reloads, hits, grenades, bomb beeps and radio lines, quieter with distance and panned left or right (M to mute)
- Timeline with kill ticks, wallbangs, bomb plants and pauses; speeds from 0.25x to 8x
- Round list, kill list, and player stats split by T side, CT side and overtime
- Wallbang finder: kills where the victim was fully hidden and the crosshair was on the wall, with a copyable list of timestamps
- Kill markers on the crosshair (kill, headshot, wallbang) and a death cam
- Health, weapons, grenades, smokes, heatmaps, a hold-Tab scoreboard with spectators and the HLTV audience count
- Breakable vents and windows disappear in 3D when they are shot out

## Project layout

```
src/demo.js         GoldSrc demo (.dem) parser. Runs in a Web Worker.
src/bsp.js          Map (.bsp) and texture (.wad) reader, line-of-sight checks
src/view3d.part.js  3D view (three.js)
src/mdl.js          Studio model (.mdl) reader and skeletal animation
src/players3d.js    Player models in the 3D view: gait, aiming, deaths, corpses
src/audio.js        Sound: .wav decoding, positional playback, radio lines
src/template.html   The page: layout, styles, 2D radar, timeline, panels
build.py            Combines everything into one self-contained page
index.html          The built page (what GitHub Pages serves)
```

To rebuild after editing anything in `src/`:

```
python3 build.py
```

## Credits

- Demo message layouts were adapted from [hlviewer.js](https://github.com/skyrim/hlviewer.js) by Stefan Stojković (MIT license).
- 3D rendering uses [three.js](https://threejs.org/) r128 (MIT license), loaded from cdnjs.
- Counter-Strike and Half-Life are trademarks of Valve. This project is unofficial and not affiliated with Valve.
