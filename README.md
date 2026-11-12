The viewer is for CS 1.6 players who want to watch HLTV and POV demos in the browser without opening the game, with easier controls and more information than the game's own player, and to find wallbangs; a second use is admins checking suspected cheaters with **See through walls**. Live page: https://deswalsujan.github.io/cs16-demo-viewer/

# UI review screenshots, 12 Nov 2026

Every screen and state of the CS 1.6 Demo Viewer, version 0.26.30 (main on 12 Nov 2026), in Chrome (headless) on a Mac, Interface size Auto, opened on a Half-Life folder with 78 demos in it.

- `1512x982/`: all 58 pictures, at 1512x982.
- `1920x1080/`: the 11 pictures listed under "Also at 1920x1080", with the same file names.

Demos on screen: SK vs Na`Vi, Train, DreamHack Winter 2011 (an HLTV demo); Na`Vi vs SK, Inferno, ESWC 2011, a map recorded in three files (HLTV); the GP Tourney POV of Team Guardians vs Lanka Dahan, Mirage, 25 Oct 2026 (a POV demo, recorded by one player); a copy of the first one cut off after 60 KB, for the card shown when a demo can't be played. Times like "R23 1:18" are the round and the in-game round timer.

## Pictures

One line each: the file, what is on screen, then how to get there.

- [`01-start-first-visit.png`](1512x982/01-start-first-visit.png): The start screen on a first visit: step 1 asks for the Half-Life folder, step 2 (Open a demo) is greyed out. How: Open the page.
- [`02-start-wrong-folder.png`](1512x982/02-start-wrong-folder.png): The start screen after a folder that is not the Half-Life folder was picked. How: Choose folder, then pick a folder without cstrike and valve in it.
- [`03-start-folder-picked.png`](1512x982/03-start-folder-picked.png): The start screen after the Half-Life folder was picked: step 1 done, the search box and the list of demos found in the folder. How: Choose folder (or Choose again), then pick the Half-Life folder.
- [`04-start-demo-search.png`](1512x982/04-start-demo-search.png): The demo search with "dhwinter" typed: the list narrowed to the matching demos. How: After the folder pick, type in the search box above the demo list.
- [`05-start-clear-saved-files.png`](1512x982/05-start-clear-saved-files.png): Clear saved files after one click: the button asks for a second click and says how much would be deleted. How: Start screen, bottom right: Clear saved files, clicked once.
- [`06-start-saved-files-cleared.png`](1512x982/06-start-saved-files-cleared.png): The start screen after the second click on Clear saved files: the message under the steps, and the folder step back to its first-visit state. How: Start screen: Clear saved files, clicked twice.
- [`07-cant-play-card.png`](1512x982/07-cant-play-card.png): The card for a demo that can't be played (a file that stops in its first few kilobytes), over the 2D view. How: Open .dem (step 2), then pick a damaged or cut-off .dem file.
- [`08-hltv-load-summary.png`](1512x982/08-hltv-load-summary.png): The load summary over the view right after an HLTV demo (SK vs Na`Vi, Train, DreamHack Winter 2011) opened: what loaded from the Half-Life folder. How: Click a demo in the start screen list; the card shows while it loads and closes by itself, or with its ×.
- [`09-hltv-opened-2d.png`](1512x982/09-hltv-opened-2d.png): The viewer right after the load summary closed: 2D radar view at the start of the first round, paused, Rounds tab in the side panel. How: Open an HLTV demo and close the load summary.
- [`10-hltv-2d.png`](1512x982/10-hltv-2d.png): The 2D radar view mid-round (R23), paused just after a kill: players, kill feed top right, round pill top left, Names / Grenades / Kill lines / See through walls / Reset view along the bottom of the view, the Heatmap menus, the timeline and bottom bar. How: 2D in the header switch.
- [`11-hltv-2d-heatmap.png`](1512x982/11-hltv-2d-heatmap.png): The 2D view with Heatmap: where players died, Both sides, Whole match. How: 2D view: the Heatmap menu at the bottom of the view.
- [`12-hltv-2d-player-picked.png`](1512x982/12-hltv-2d-player-picked.png): The 2D view with one player picked (highlighted on the radar and in the name bar under the view). How: 2D view: click a player dot.
- [`13-hltv-3d-free.png`](1512x982/13-hltv-3d-free.png): The 3D view, Free camera, at the same moment: the camera row (Free / Eyes / Behind, previous and next player, View settings) at the top. How: 3D in the header switch; Free in the camera row (V switches camera).
- [`14-hltv-3d-eyes.png`](1512x982/14-hltv-3d-eyes.png): The 3D view, Player's eyes on the killer just after his kill: his gun, crosshair, kill markers, HUD and name bar. How: 3D view: Eyes in the camera row, or click a player in the Players tab.
- [`15-hltv-3d-behind.png`](1512x982/15-hltv-3d-behind.png): The 3D view, Behind player camera on the same player. How: 3D view: Behind in the camera row.
- [`16-hltv-3d-radar.png`](1512x982/16-hltv-3d-radar.png): 3D + radar: Player's eyes with the 2D radar beside it. How: 3D + radar in the header switch.
- [`17-hltv-view-settings.png`](1512x982/17-hltv-view-settings.png): View settings open in the 3D view of an HLTV demo: Vanilla, Team colours, Damage numbers, Glow on hits, Crosshair, Quality, Interface size. How: 3D view: View settings in the camera row.
- [`18-hltv-3d-see-through-walls.png`](1512x982/18-hltv-3d-see-through-walls.png): The 3D view, Free camera, with See through walls on: players behind walls and their names drawn over the walls. How: 3D view: See through walls at the bottom of the view (H).
- [`19-hltv-3d-death-cam.png`](1512x982/19-hltv-3d-death-cam.png): Player's eyes on the victim just after he died: the death view with the killed-by banner. How: 3D view: Eyes on a player, paused just after his death.
- [`20-hltv-kills-kill-details.png`](1512x982/20-hltv-kills-kill-details.png): The Kills tab with one kill picked: its kill details open under the row (each bullet, damage, body part, Earlier:), and the view showing the kill from the killer's eyes. How: Side panel: Kills tab, click a kill.
- [`21-hltv-kill-details-bullet.png`](1512x982/21-hltv-kill-details-bullet.png): After a click on the first bullet's line in kill details: playback jumps to that bullet's moment (R23 1:19), paused, in the killer's eyes. How: Kills tab: click a kill, then click one of the numbered bullet lines in its details.
- [`22-hltv-kills-tab.png`](1512x982/22-hltv-kills-tab.png): The Kills tab: the kills of the round playing now, with round timer, killer, weapon icon and victim. How: Side panel: Kills tab.
- [`23-hltv-rounds-tab.png`](1512x982/23-hltv-rounds-tab.png): The Rounds tab: the "Show warmup, restarts and idle rounds" box, then every live round with its winner, how it ended and the score. How: Side panel: Rounds tab.
- [`24-hltv-rounds-tab-show-all.png`](1512x982/24-hltv-rounds-tab-show-all.png): The Rounds tab with "Show warmup, restarts and idle rounds" ticked: the rounds before and between the live rounds listed too. How: Rounds tab: tick the box at the top.
- [`25-hltv-rounds-tab-end.png`](1512x982/25-hltv-rounds-tab-end.png): The end of the Rounds tab list: the overtime rounds and the "Is this map split over two or more demo files? Join with another demo…" row. How: Rounds tab, scrolled to the bottom.
- [`26-hltv-join-with-another-demo.png`](1512x982/26-hltv-join-with-another-demo.png): The Join card opened from "Join with another demo…": the demo playing, and a way to add another file as a part of the same map. How: Rounds tab, bottom: Join with another demo…
- [`27-hltv-players-all.png`](1512x982/27-hltv-players-all.png): The Players tab on Total: each team's players with kills, deaths and the other stats, and the note under the tables. How: Side panel: Players tab, then Total at its top.
- [`28-hltv-players-t.png`](1512x982/28-hltv-players-t.png): The Players tab on T side: each team's players with kills, deaths and the other stats, and the note under the tables. How: Side panel: Players tab, then T side at its top.
- [`29-hltv-players-ct.png`](1512x982/29-hltv-players-ct.png): The Players tab on CT side: each team's players with kills, deaths and the other stats, and the note under the tables. How: Side panel: Players tab, then CT side at its top.
- [`30-hltv-players-ot.png`](1512x982/30-hltv-players-ot.png): The Players tab on Overtime: each team's players with kills, deaths and the other stats, and the note under the tables. How: Side panel: Players tab, then Overtime at its top.
- [`31-hltv-wallbangs-all.png`](1512x982/31-hltv-wallbangs-all.png): The Wallbangs tab on All 45: every wallbang kill and every hit through a wall found in the match, each tagged (STRICT WB, LOOSE WB, DAMAGE), with round, in-game timer and demo time, and Copy list. How: Side panel: Wallbangs tab, then All at its top.
- [`32-hltv-wallbangs-strict.png`](1512x982/32-hltv-wallbangs-strict.png): The Wallbangs tab on Strict wb 6: only the kills tagged STRICT WB. How: Side panel: Wallbangs tab, then Strict wb at its top.
- [`33-hltv-wallbangs-loose.png`](1512x982/33-hltv-wallbangs-loose.png): The Wallbangs tab on Loose wb 9: only the kills tagged LOOSE WB. How: Side panel: Wallbangs tab, then Loose wb at its top.
- [`34-hltv-wallbangs-damage.png`](1512x982/34-hltv-wallbangs-damage.png): The Wallbangs tab on Damage 30: only the rows tagged DAMAGE, hits through a wall with the HP they took. How: Side panel: Wallbangs tab, then Damage at its top.
- [`35-hltv-wallbangs-picked.png`](1512x982/35-hltv-wallbangs-picked.png): The Wallbangs tab with one wallbang picked: the view jumps to the kill in the killer's eyes, with its kill details under the row. How: Wallbangs tab: click a row.
- [`36-hltv-tab-scoreboard.png`](1512x982/36-hltv-tab-scoreboard.png): The Tab scoreboard over the 3D view: the server's name, both teams by side with their score, each player's number key, HP, weapon, kills, deaths and latency, the Dead and Kit tags, and the spectators. How: Hold Tab while a demo plays (3D or 2D).
- [`37-hltv-shortcuts.png`](1512x982/37-hltv-shortcuts.png): The Shortcuts and kill markers panel: the playback, players and 3D camera keys, the four kill markers, the version with What's new and Report a bug, and Copy debug info. How: Bottom bar: Shortcuts ? (or press ?).
- [`38-hltv-timeline-tooltip.png`](1512x982/38-hltv-timeline-tooltip.png): The timeline under the view with the mouse over a kill mark: the tooltip with its round, timer, killer, weapon and victim. How: Move the mouse over the timeline above the bottom bar.
- [`39-hltv-timeline-round.png`](1512x982/39-hltv-timeline-round.png): The timeline showing only the round playing now (Timeline: round), with its kills and events marked. How: Bottom bar: Timeline: match, clicked once (it switches to Timeline: round).
- [`40-hltv-header-team-rename.png`](1512x982/40-hltv-header-team-rename.png): The header's team name in edit mode, its text selected for typing a new name. How: Click a team name in the header.
- [`41-hltv-theatre.png`](1512x982/41-hltv-theatre.png): Theatre mode: the 3D view fills the window, controls hidden, with the note on how to bring them back. How: Header: Theatre (T). Full screen (F) also uses it.
- [`42-hltv-theatre-controls.png`](1512x982/42-hltv-theatre-controls.png): Theatre mode with the mouse at the bottom edge: the header, side panel and bottom bar slid in over the view. How: In Theatre mode, move the mouse to the top, right or bottom edge.
- [`43-join-load-summary.png`](1512x982/43-join-load-summary.png): The load summary of a demo that is one part of a map recorded in three files (Na`Vi vs SK, Inferno, ESWC 2011, first file): its line about the other parts, with Join the parts. How: Open the first file of a map recorded in parts.
- [`44-join-card.png`](1512x982/44-join-card.png): The Join card, "Count these demos as one map?": the three parts found in the folder in the suggested order, with arrows to reorder them, where the order comes from, the checks on the parts, Add another part…, Cancel and Join them. How: Load summary: Join the parts (or Rounds tab: Join with another demo…).
- [`45-join-joined.png`](1512x982/45-join-joined.png): The map joined from three files: the "3 files" chip in the header, and the Rounds tab with "One map, joined from 3 files. Split them". How: Join card: Join them.
- [`46-pov-load-summary.png`](1512x982/46-pov-load-summary.png): The load summary of a POV demo (the GP Tourney POV of Team Guardians vs Lanka Dahan, Mirage, 25 Oct 2026): its lines on the recorder's own view and on the server's anti-wallhack plugin. How: Click a POV demo in the start screen list.
- [`47-pov-opened.png`](1512x982/47-pov-opened.png): The viewer right after a POV demo opened: his own view in 3D, his HUD, crosshair and radar, the side panel on the Rounds tab. How: Open a POV demo and close the load summary.
- [`48-pov-playing.png`](1512x982/48-pov-playing.png): A POV demo mid-round (R3): his view, gun, crosshair, HUD (health, armour, money, ammo), radar top left, kill feed, round pill and View settings under the radar. How: Any moment of a POV demo.
- [`49-pov-tab-scoreboard-held.png`](1512x982/49-pov-tab-scoreboard-held.png): The Tab scoreboard at a moment the recorder held Tab in his game: it opens by itself, marked "He held Tab here". How: Play a POV demo through a moment he held Tab.
- [`50-pov-tab-scoreboard.png`](1512x982/50-pov-tab-scoreboard.png): The Tab scoreboard of a POV demo, opened with the Tab key. How: Hold Tab while a POV demo plays.
- [`51-pov-hit-arcs.png`](1512x982/51-pov-hit-arcs.png): A POV demo just as the recorder was hit (R7 1:31): the red hit arcs on his HUD showing where the damage came from. How: A moment of a POV demo when he takes damage.
- [`52-pov-spectating-plant-bar.png`](1512x982/52-pov-spectating-plant-bar.png): A POV demo after the recorder died (R11 0:28): he watches a teammate in first person, with the spectator bars at the top and bottom and the bomb plant bar. How: A moment of a POV demo after his death, while a teammate plants.
- [`53-pov-flashbang.png`](1512x982/53-pov-flashbang.png): A POV demo with Flashbang dot and Flashbang whiteout ticked, at a moment he was partly blinded (R10 1:28): the white over the view and the dot under the crosshair. How: View settings: tick Flashbang dot and Flashbang whiteout (both off by default), then a moment he was flashed.
- [`54-pov-view-settings.png`](1512x982/54-pov-view-settings.png): View settings open in a POV demo: Vanilla, Team colours, Crosshair (size only), Quality, Interface size, and under Demos recorded by a player, Flashbang dot and Flashbang whiteout. How: POV demo: View settings under the radar.
- [`55-pov-anti-wallhack-note.png`](1512x982/55-pov-anti-wallhack-note.png): The anti-wallhack note at the top middle of the view, opened from the ! beside See through walls. How: POV demo: the ! on See through walls at the bottom of the view.
- [`56-pov-kills-tab.png`](1512x982/56-pov-kills-tab.png): A POV demo's Kills tab: only the recorder's own kills and deaths, for the whole match, under a heading for each round. How: Side panel: Kills tab.
- [`57-pov-rounds-tab.png`](1512x982/57-pov-rounds-tab.png): A POV demo's Rounds tab. How: Side panel: Rounds tab.
- [`58-pov-players-tab.png`](1512x982/58-pov-players-tab.png): A POV demo's Players tab, with the note on what POV demos count. How: Side panel: Players tab.

## Also at 1920x1080

- [`03-start-folder-picked.png`](1920x1080/03-start-folder-picked.png)
- [`10-hltv-2d.png`](1920x1080/10-hltv-2d.png)
- [`14-hltv-3d-eyes.png`](1920x1080/14-hltv-3d-eyes.png)
- [`16-hltv-3d-radar.png`](1920x1080/16-hltv-3d-radar.png)
- [`31-hltv-wallbangs-all.png`](1920x1080/31-hltv-wallbangs-all.png)
- [`36-hltv-tab-scoreboard.png`](1920x1080/36-hltv-tab-scoreboard.png)
- [`37-hltv-shortcuts.png`](1920x1080/37-hltv-shortcuts.png)
- [`42-hltv-theatre-controls.png`](1920x1080/42-hltv-theatre-controls.png)
- [`44-join-card.png`](1920x1080/44-join-card.png)
- [`48-pov-playing.png`](1920x1080/48-pov-playing.png)
- [`55-pov-anti-wallhack-note.png`](1920x1080/55-pov-anti-wallhack-note.png)
