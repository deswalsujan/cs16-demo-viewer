# The 3D picture's contrast: the mockup of 12 Nov 2026

Item 11 of Sujan's POV mode feedback of 11 Nov 2026 (IDEAS.md, **The 3D picture's contrast**). Mockup only, drawn into the running viewer (main, 0.26.30) at 1512x982 in headless Chromium with SwiftShader, nothing built: `docs/proposed/contrast-curve-mock.jpg` (the 3D view at half size, six moments, three looks; Korfez's row added later the same day) and `docs/proposed/contrast-models-closeup-mock.jpg` (the player models and his gun at full size). The code that draws it is `docs/proposed/contrast-curve-mock.js` (evaluated in the page through the test hook) and `docs/proposed/contrast-curve-mock.py` (opens the demos, picks the moments, takes the pictures).

## The three looks

- **Today**: the map is each texture times min(lightmap × 2, 1.8), then to the power 0.85 (`SHADER` in `src/view3d.part.js`); players and guns get three.js's fixed light, ambient 0.75 plus a sun of 0.5 from above, the same everywhere on the map (`init3`, `vmScene`).
- **Valve's defaults**: gamma 2.5, brightness 1, texgamma 2, lightgamma 2.5, with the tables built as Xash3D FWGS builds them (`BuildGammaTable`, `engine/client/gamma.c`, commit 707596f of 10 Nov 2026):
  - textures: each colour to the power texgamma / gamma (0.8), which lifts dark colours (0.1 to 0.16, 0.2 to 0.28, 0.4 to 0.48);
  - the lightmap, per texel, as `R_BuildLightMap` (`ref/gl/gl_rsurf.c`) does: the byte times 264 (light style 0, "m") times 256, shifted down 14 (the byte times 4.125), at most 1023, through the light table (lightgamma, then the brightness shift, then 1 / gamma), then drawn at 4/3: `gl_overbright` 1 blends the lightmap with DST_COLOR, SRC_COLOR and the colour 128/192 (`R_BlendLightmaps`). `gl_overbright` is 1 because Valve Developer Community's list of Half-Life console variables gives it as 1 (https://developer.valvesoftware.com/wiki/HL_cvars); with it at 0 Xash3D scales the lightmap by 2^(1/lightgamma) instead and draws it at 1, which gives nearly the same darks and mid-tones and no light above the texture's own colour;
  - players, guns and his own gun (the view model), as `R_EntityDynamicLight` (`ref/common/ref_light.c`) and `R_StudioLighting` (`ref/gl/gl_studio.c`) light them: the light is the lightmap under the model (traced straight down from 8 units above its origin), times 264 / 256; 90% of it comes from one direction (`direct` 0.9) and 10% is ambient (at most 128, the two together at most 255); each vertex gets the ambient plus the directional part by its normal (SHADE_LAMBERT 1.4953241), through the same light table, times the light's colour. The mockup takes the direction as straight down, where the game takes it from the lightmap's slope around the model; his own gun takes the light under his eyes.
- **One brighter step**: brightness 2 (the game's brightness above 1 multiplies the light before the shift), the rest as Valve's defaults.

Not changed in any look: water (drawn as today), the sky colour, the HUD, the labels and the viewer's own controls.

## What the game's curve does to player models

Light on a model, before its texture, by the floor under it (Valve's defaults, then one brighter step, then today):

| Floor light | Top | Side | Underside |
|---|---|---|---|
| 255 (full light) | 1.00, 1.00 | 0.73, 0.93 | 0.14, 0.19 |
| 55 (shade, edzie at R16 1:39) | 0.32, 0.42 | 0.22, 0.29 | 0.03, 0.04 |
| 12 (a dark corner, starix at R4 1:30) | 0.07, 0.09 | 0.05, 0.06 | 0.00, 0.01 |
| Today, anywhere | 1.2 | 0.75 to 0.93 | 0.75 |

## The moments

| Row | Demo | Moment | Camera | Floor light under the model (lightmap byte, brightest channel) |
|---|---|---|---|---|
| SAS model in shade | SK vs Na`Vi, Train, DreamHack Winter 2011 | R16 1:39 (demo 2135.19 s) | Behind player on edzie (SAS) | 55 |
| SAS model in light | the same | R48 1:34 (5703.36 s) | Behind player on edzie (SAS) | 255 |
| Train, a dark corner | the same | R4 1:30 (801.96 s) | Behind player on starix (Arctic) | 12 |
| Mirage, a dark corner | GP Tourney POV, Team Guardians vs Lanka Dahan, Mirage, 25 Oct 2026 | R19 1:16 (1919.89 s) | his view (POV) | 27 under his eyes |
| Mirage, a dark corner, watching a teammate | the same | R11 0:58 (1057.18 s) | the teammate he watched | 34 |
| Korfez, bright walls | Sujan's POV on de_korfez32, a public server, 7 Mar 2020 (`s-deswal-korfez-knd.dem`) | R9 1:09 (759.49 s) | his view (POV) | 255 under his eyes |

The shade and light moments are edzie's, found by sampling his floor light once a second through the match (1,133 samples on the SAS model): the one nearest 55 and the latest at 255. The dark corners are the darkest floors found by sampling every player every few seconds (Train) and his view every 2 s (Mirage). Korfez's moment (added 12 Nov 2026, from the demo Sujan added that day; the `korfez` group of the script) was found by drawing his view in today's look every 20 s of every round after freeze time (99 moments) and counting the pixels with every channel above 225. The top one, R19 1:09 (15.6%), was mostly sunlit floor, so the row uses the fourth, R9 1:09 (8.5%), picked by eye for the sunlit walls filling the view (`KORFEZ_T=759.48828125`). In that picture, the pixels with every channel above 225: today 9.0%, Valve's defaults 0.0%, one brighter step 4.6%; the mean of the three channels over the picture: 170, 153 and 167. Under Valve's defaults the sunlit walls and floor are paler and less orange, and still bright. The radar top left in today's look fades into the sunlit wall behind it, since the HUD is added onto the picture (0.26.30).

## The wallbang picture check under the new curve

Checked again 12 Nov 2026, as the item asks: every kill the picture check had drawn was drawn again with the map and the models under Valve's defaults, and its count of the victim's flat magenta pixels compared. SK vs Na`Vi, Train, DreamHack Winter 2011: 41 kills drawn, 41 with the same count (32 of them above 0). The GP Tourney POV: 19 drawn, 19 the same (14 above 0). The check draws the victim in flat magenta with no lighting and counts pixels near (255, 0, 255); the map's colours only hide or show him, and its see-through holes (texture alpha under 0.5) are the same in every look.
