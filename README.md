# Screenshots for 0.26.29 (the POV mockup round)

Pictures shown in the pull request for 0.26.29. This branch is never merged into main and never deleted, since the pull request shows its pictures from here (`AGENTS.md`, "How each change ships").

From the pull request's build, headless Chromium with SwiftShader, a 1512x982 window (Interface size Auto), 11 Nov 2026, with Sujan's game files. The POV demo is the GP Tourney POV of Team Guardians vs Lanka Dahan, Mirage, Match 8, 25 Oct 2026 (`forgotten-de_mirage-2026.dem`, recorded by BAJRANG || forgotteN_), **POV mode** on; no public server's POV demo is on screen, so none of their crude player names is (as for 0.26.16). The approved mockup is `docs/pov-mockup-round-mock.jpg`.

- `01-summary-*`: the load summary with its two new lines, "Only his own view, in 3D" and "This server seems to use an anti-wallhack plugin".
- `02-hud-rest-*`: R8 1:40, 12 s after the last change: every HUD number faint (100 of 255), as the game draws it at rest; no 2D, 3D and 3D + radar switch, no **Reset view**, no Wallbangs tab, the ! on **See through walls**.
- `03-hit-arcs-*`: R7 1:31, just after a 28 HP hit from behind him: the rear and left arcs round the crosshair; health 20 in red, lit up.
- `04-money-plus-*`: R3 1:18, 0.4 s after his kill: a green +300 over the money, the balance green and bright.
- `05-money-minus-*`: R3 freeze 0:06, after a buy: a red −650, the balance red.
- `06-timer-red-*`: R15 0:20: the round timer red (it flips with the HUD colour from 20 s), health 22 red and lit up, the ammo lit up after a shot.
- `07-plant-bar-spectating-*`: R11 0:28, dead, watching ~br0nzE^ plant in first person: the bar at 73%, picked up at 59% from BarTime2 at 0:29.
- `08-tab-held-*`: R3 1:10: his Tab scoreboard, open by itself while he held Tab, with "He held Tab here".
- `09-kills-tab-*`: R7 1:31, the Kills tab: his kills and deaths for the whole match by round (18 kills, 23 deaths), R7 highlighted.
- `10-notices-top-*`: R8 1:29: "Press ? for keyboard shortcuts" and the "Stopping at 16" notice at the top middle, the HUD's corners clear. Retaken after the notices were made to step down past the kill feed.
- `11-note-from-mark-*`: the same moment after a click on the !: the anti-wallhack note at the top middle under the notices, with its ×; his health and armour stay in view. Retaken: with the note open the column reached within 8 px of the feed's rows, so it steps down below them.
- `12-hltv-view-settings-*`: Na`Vi vs FX, Dust2, SEC 2011 final: **View settings** with no **POV mode** row or heading, and the 2D, 3D and 3D + radar switch and **Reset view** as before.
- `13-notices-past-the-feed-1280x720-*`: the worst case of the notices against the kill feed (Sujan, 11 Nov 2026): R17 1:13, the feed's 5 rows at their widest, a 1280x720 window, "Stopping at 16" and the note open: the column steps down below the feed; with the note open it reaches the middle of the view.
