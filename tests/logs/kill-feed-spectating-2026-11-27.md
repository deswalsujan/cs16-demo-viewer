# Item 3: the kill feed, chat and radio, the spectator bars, radar dots and the scoreboard in the game's look

Plan and mockup only, nothing built (Sujan's brief of 27 Nov 2026; IDEAS.md, **The kill feed and the spectating screen in the game's look**). The mockup: `docs/proposed/kill-feed-spectating-mock.jpg`, six rows, each today (0.27.6) and the proposal drawn over the viewer's page in the headless browser, with Sujan's answers of 27 Nov 2026 drawn in. A three-column version with the matching shots from his YouTube POV stays outside the repo, `~/Downloads/cs16-kill-feed-spectating-mock-full-2026-11-27.jpg` on Sujan's Mac (Sujan, 27 Nov 2026: YouTube crops out of the repo). The earlier findings (cs16-client's `death.cpp`, the font): `tests/logs/refinements-2026-11-26.md`, 3.

Sources: Sujan's 10 screenshots of a YouTube POV (Na`Vi vs SK, Inferno, ESWC 2011, markeloff's POV, an older build of the game; on Sujan's Mac in `~/Downloads/cs-hud-design-screenshots/_for-claude`, shot01 to shot10, 2276x1706, not in the repo; crops of shots 1, 3, 4, 8, 9 and 10 only in the version outside the repo); cs16-client (`death.cpp`, `saytext.cpp`, `util.cpp`); the player's own `cstrike/resource/cstrike_english.txt` and `cstrike/sprites`. Sujan's own screenshots from the review zip (d, R9 0:27 of SK vs Na`Vi, Train, DreamHack Winter 2011) haven't come back: what they must confirm is marked **Confirm**, and they outrank the video where they differ.

## What the shots measure (shares of the 4:3 picture)

- The video's resolution: cs16-client draws the kill feed's rows 20 px apart and the video has them 3.35% of the height apart, so it ran at about 800x600.
- Kill feed, alive (shots 6 to 9): the first row's text top at 7.4% (cs16-client's row top, `YRES(32) + 2`, is 7.1%); rows 3.35% apart; capitals 1.5% of the height.
- Kill feed, dead and spectating (shots 1, 2, 4): the first row's text top at 11.5%, just under the top spectator bar, which ends at about 10.6%; cs16-client: `ScreenHeight / 5 + 2`, 20.3%. **Confirm**.
- Chat and radio lines (shots 1, 2, 5, 8, 9, 10): the left edge 1.9 to 2.1% of the width (about 15 px at 800); the first line's text top 71.6% alive and dead (74.3% in shot 2, as lines scroll); lines 2.7% apart; at most 4 lines in these shots. cs16-client: `ScreenHeight - 60` alive and 4/5 of the height spectating, less 6 line heights (74% and 64% at 600 lines); the video's 71.6% for both, **Confirm**.
- Colours (the most saturated fifth of each text's pixels): the yellow-orange of the radio lines, the chat labels, the centre messages and the top bar 242,190,75; cs16-client's `g_ColorYellow` is 255,179,0, the viewer's centre messages 250,188,80. CT names 172,207,249 and T names 231,87,80, where cs16-client has 153,204,255 and 255,64,64; the video's compression and gamma shift both.
- Radar (shot 10): the see-through radar about 430 to 450 px across in the screenshot, a teammate's dot 6 to 7 px, about 1/68 of its width.
- Full white (shot 8): the kill feed's names and the radio lines readable, with their shadows; the gun and headshot icons gone, their places blank; the HUD and the see-through radar gone.
- The top bar: about 10.6% of the height (51/480); the viewer's spectator bars are 40/480 (Sujan, 4 Oct 2026). It shows "Counter-Terrorists : 0", "Terrorists : 0", his money ($100) and the round timer; "First Person" in the middle when the camera changes (left out on purpose, Sujan, 4 Oct 2026).

## The game's text, from the player's `cstrike_english.txt`

- `Game_radio`: `\x02%s1 (RADIO): %s2`, the phrase from `Cstrike_TitlesTXT_<name>` (`#Fire_in_the_hole`: "Fire in the hole!"), the same lookup as the centre messages.
- `Cstrike_Chat_CT`: `\x01(Counter-Terrorist) \x03%s1\x01 :  %s2`; `_T` "(Terrorist) "; `_CT_Dead` and `_T_Dead` "*DEAD*(Counter-Terrorist) " and "*DEAD*(Terrorist) "; `_Spec` "(Spectator) "; `_AllDead` "*DEAD* "; `_All` `\x02%s1 :  %s2`.
- cs16-client's `saytext.cpp`: `\x01` the normal yellow, `\x03` the sender's team colour, `\x04` green; `\x02` isn't handled, and the video's radio lines are yellow from end to end, so `\x02` reads as yellow for the whole line. Whether alive all-chat (`_All`) is yellow from end to end too: **Confirm** (none in the shots).
- Kept lines: `MAX_LINES` 5; `hud_saytext_time` 5, so the oldest line leaves every 5 s; a new line when 5 are shown pushes the oldest out.

## What the demos carry (chat and radio)

Read with a copy of `src/demo.js` that also keeps every TextMsg:

| Demo | SayText by kind | Radio text (TextMsg 5) | Radio sounds (SendAudio) |
|---|---|---|---|
| SK vs Na`Vi, Train, DreamHack Winter 2011 (HLTV) | dead all-chat 43, server and plugin 40 | 0 | 100 |
| Na`Vi vs FX, Train, SEC 2011 (HLTV) | dead all-chat 22, server and plugin 23 | 0 | 47 |
| fnatic vs EG, Dust2, EM3 Global Finals (HLTV) | dead all-chat 50 | 0 | 83 |
| mTw vs Lions, Nuke, DreamHack Summer 2011 (HLTV) | dead all-chat 6, server and plugin 32 | 0 | 49 |
| NoA vs Pentagram, Train (HLTV, protocol 47) | dead all-chat 13, server and plugin 54 | 0 | 50 |
| GP Tourney POV, Team Guardians vs Lanka Dahan, Mirage, 25 Oct 2026 | T 60, CT 11, T dead 29, CT dead 30, spectators 22, plugin 85, `%s` 67 | 1,198 | 661 |
| Match 1 CT (public server, de_barcelona, 27 Mar 2025, POV) | dead all-chat 14, all-chat 2, plugin 289, `%s` 30 | 1,246 | 659 |
| `match-3_css_cache_00-23-35_28-07-2022.dem` (POV) | plugin 513, `%s` 11 | 264 | 217 |

So HLTV demos carry dead players' all-chat and the server's lines, but no team chat and no radio text, though they have the radio sounds; POV demos carry the recorder's team chat, spectator chat and his team's radio text. The reader keeps SayText today (`chat`) but no radio text.

## Plan, part by part

1. **Kill feed** (`updateFeed`, `.feed`), in POV and HLTV demos: up to 4 rows, the newest; no box; flush against the picture's right edge: the killer, 5 px, the weapon icon, the headshot icon, the victim; names in the game's team colours (T 255,64,64; CT 153,204,255; spectators and the world 204 grey); each row ending whole at the picture's edge: the victim placed by the right edge of his name's ink and its shadow, not by the text's advance width, which left the last letter cut off in the first mockup (Sujan, 27 Nov 2026); the icons tinted 255,80,0 (team kills 10,240,10) and added onto the picture (`mix-blend-mode: plus-lighter`, as `#hud3`); Verdana bold with a 1-px black shadow; six seconds a row, as today. The first row: 7.1% of the height while he plays in **POV mode**; just under the top spectator bar while spectating, which is every HLTV demo (the video's 11.5%; cs16-client's 20.3%; **Confirm**).
2. **The size basis**, one for the whole HUD: the resolution Sujan plays at, fixed, the same for every user (Sujan, 27 Nov 2026), from his R9 0:27 screenshots and his resolution: the video at 800x600 gives rows 3.35% apart and capitals 1.5% of the height, the mockup's sizes. Today's POV HUD sizes itself as if the screen were 768 lines high (`H / 768`), where cs16-client's 20 px rows would be 2.6% apart and `EngineFont` is 16 tall (768 to 1023 lines).
3. **Spectator bars while following a player in an HLTV demo** (**Player's eyes** and **Behind player**; not the free camera, not 2D): `drawSpecBars` reused: the score and the clock at the top right, the followed player's name and health at the bottom. They replace the name box (`#pov`) and the header's score while following; the header's score comes back when the bars go. What stays: the round pill, showing only "Round N" while the bars are up, and the camera buttons, moved under the top bar; the kill feed, under the top bar; the button strip, lifted above the bottom bar (in the mockup also while he spectates in a POV demo, where a long name meets it); **View settings** and the "Press ? for help" line.
4. **Chat and radio lines** (un-parked), in POV and HLTV demos, the players' chat and radio only, no server or plugin lines (Sujan, 27 Nov 2026): the reader also keeps the radio TextMsg (destination 5, `#Game_radio`, the sender's name and the phrase); the lines kept as `saytext.cpp` keeps them (5 lines, the oldest leaving every 5 s); bottom left, 15 px in at 800 (about 1.9% of the width), the first line 71.6% down, lines 2.7% apart; Verdana bold, black shadow; the yellow-orange of the viewer's centre messages (250,188,80), the sender's name in his team colour where the format says `\x03`; the words from the player's own `cstrike_english.txt`.
5. **Flashbang**: the kill feed's names and the chat and radio lines over the whiteout (above `.flash3`); the feed's icons added onto the picture, so they vanish at full white, as the HUD does; the solid radar and the viewer's own controls as decided. The by-eye line **Flashbangs (0.26.30)** in IDEAS.md changes with it: the names and the radio lines stay readable at full white.
6. **POV radar dots**: `radaropaque640.spr` is 128 by 128; the dots are 4 of its units today (1/32 of its width); proposed 2 (1/64), against the video's about 1/68 (cs16-client's 4 px is overruled by the video); the other marks (above, below, the bomb's cross) scaled the same; the solid radar kept (Sujan, 19 Nov 2026).
7. **Tab scoreboard**: the spectators one per line, with a line under their heading, as the game lists them; the extra columns, the team names and the server's name as the title kept.
8. **His money** in the top spectator bar while he's dead in a POV demo, on the upper line beside the score, the clock under it, as the game (Sujan, 27 Nov 2026); HLTV demos have none.

## Questions for Sujan with the mockup

- (a) The first row of the kill feed while spectating: just under the top bar, as the video, or cs16-client's fifth of the height; and the size basis (part 2). His screenshots decide both.
- (b) The header's score while following a player in an HLTV demo: hidden, as asked, while the top bar shows it; the team names stay.
- (c) The round pill's clock repeats the top bar's while following: keep it, or the round number alone.
- (d) Server and plugin lines in the chat (85 in the GP Tourney POV: a WhatsApp link, "Your money set to $16000", the tourney's banners): with the players' lines, or players' chat and radio only. Recommended: players' chat and radio only, for a first build.
- (e) His money in the top bar while he spectates in a POV demo, as the video shows ($100): the approved bars leave it out; HLTV demos have no money.
- (f) The scoreboard's other differences from shots 3 and 10, none of them decided before: the title (the video's "Counter-Strike", the viewer's server name); a line under the Spectators heading; the video's build lists the HLTV relay under the Counter-Terrorists, Dead, where the viewer puts relays among the spectators (no change proposed).

## Sujan's answers (27 Nov 2026; `DECISIONS.md`)

- (a) Waits for his R9 0:27 screenshots and his resolution; then one fixed size basis for every user, the resolution he plays at.
- (b) Yes: the header's score hidden while the bars show it, back when they go.
- (c) The round pill kept, only "Round N" while the bars are up.
- (d) The players' chat and radio only, no server or plugin lines.
- (e) Yes: his money in the top bar when dead in a POV demo.
- (f) The title stays the server's name (his decision of 11 Nov 2026); a line under the Spectators heading.
- The first mockup cut the last letter of the right-hand names (Gullu Bhai, BAJRANG || JD, forgotteN_, D Ξ Λ T H N O, Na`Vi ceh9 32-33y, SK.f0rest); fixed in the mockup (part 1).
- No build until his screenshots are in.

## The build, once answered

One branch from origin/main, one pull request, as 0.28.0 (a visible batch across the HUD), with a headless check that fails on 0.27.6 and passes after: at most 4 feed rows; chat and radio lines in a POV demo; spectators one per line; the spectator bars while following a player in an HLTV demo; the names over a full whiteout. Then the nine release checks (16 minutes on 0.27.6) and screenshots on `screenshots/0.28.0`. The wallbang labels don't change, so no comparison against main on the 88 demos beyond the release checks.

## How the mockup was made

`tests/harness.py` on 0.27.6's `index.html`, 1440x900: for each frame a script seeks and pauses, a screenshot, then a mock layer drawn over the page (DOM text and icon layers, a canvas for the bars, the radar's dot size halved, the scoreboard's spectators split) and a second screenshot; then the crops and the shots put together with Pillow. Frames: the GP Tourney POV at R20 1:22 (alive), R5 with the bomb down (dead, watching a teammate), R3 1:17 (full white, **Flashbang whiteout** ticked) and R16 1:08 (his Tab); SK vs Na`Vi, Train, DreamHack Winter 2011 at R9 0:27, **Player's eyes** on Na`Vi Zeus /A/.
