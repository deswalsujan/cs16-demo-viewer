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

1. **Kill feed** (`updateFeed`, `.feed`), in POV and HLTV demos: up to 4 rows, the newest; no box; flush against the picture's right edge: the killer, 5 px, the weapon icon, the headshot icon, the victim; names in the game's team colours (T 255,64,64; CT 153,204,255; spectators and the world 204 grey), drawn with hard edges (see "Two findings from the game's own files" below); each row ending whole at the picture's edge: the victim placed by the right edge of his name's ink and its shadow, not by the text's advance width, which left the last letter cut off in the first mockup (Sujan, 27 Nov 2026); the icons tinted 255,80,0 (team kills 10,240,10) and added onto the picture (`mix-blend-mode: plus-lighter`, as `#hud3`); Verdana bold with a 1-px black shadow; six seconds a row, as today. The first row: 7.1% of the height while he plays in **POV mode**; just under the top spectator bar while spectating, which is every HLTV demo (the video's 11.5%; cs16-client's 20.3%; **Confirm**).
2. **The size basis**, one for the whole HUD: the resolution Sujan plays at, fixed, the same for every user (Sujan, 27 Nov 2026), from his R9 0:27 screenshots and his resolution: the video at 800x600 gives rows 3.35% apart and capitals 1.5% of the height, the mockup's sizes. Today's POV HUD sizes itself as if the screen were 768 lines high (`H / 768`), where cs16-client's 20 px rows would be 2.6% apart and `EngineFont` is 16 tall (768 to 1023 lines). The text's height is `EngineFont`'s for his band of screen heights (finding 2 below), not a share of the height.
3. **Spectator bars while following a player in an HLTV demo** (**Player's eyes** and **Behind player**; not the free camera, not 2D): `drawSpecBars` reused: the score and the clock at the top right, the followed player's name and health at the bottom. They replace the name box (`#pov`) and the header's score while following; the header's score comes back when the bars go. What stays: the round pill, showing only "Round N" while the bars are up, and the camera buttons, moved under the top bar; the kill feed, under the top bar; the button strip, lifted above the bottom bar (in the mockup also while he spectates in a POV demo, where a long name meets it); **View settings** and the "Press ? for help" line.
4. **Chat and radio lines** (un-parked), in POV and HLTV demos, the players' chat and radio only, no server or plugin lines (Sujan, 27 Nov 2026): the reader also keeps the radio TextMsg (destination 5, `#Game_radio`, the sender's name and the phrase); the lines kept as `saytext.cpp` keeps them (5 lines, the oldest leaving every 5 s); bottom left, 15 px in at 800 (about 1.9% of the width), the first line 71.6% down, lines 2.7% apart; Verdana bold, black shadow, hard edges (finding 1 below); the yellow-orange of the viewer's centre messages (250,188,80), the sender's name in his team colour where the format says `\x03`; the words from the player's own `cstrike_english.txt`.
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

## Two findings from the game's own files, before the build (27 Nov 2026)

From the Mac copy of `valve/resource/TrackerScheme.res` (an older build than his Windows one; checked by Claude the same day):

1. **Hard pixel edges.** The kill feed and the chat are drawn in `EngineFont`: Verdana, weight 600, `dropshadow` 1, and none of its bands has an `antialias` line, while 14 other fonts in the same file do (UiHeadline, MenuLarge, CreditsFont among them). So the game draws this text with no smoothing, every pixel fully on or off, then the 1-px shadow. The browser smooths text, which is why the mockup doesn't look like the game. The build draws this text with its edges forced fully on or off: each line drawn into an offscreen canvas, its alpha cut to 0 or 255, then the 1-px black shadow under it, the result put on the page at one device pixel per text pixel. A limit to check against his screenshot: cutting the alpha of the browser's own Verdana gives hard edges but not necessarily the letter shapes Windows draws for a small unsmoothed font, which are hinted to the pixel grid.
2. **The height is fixed per band of screen heights**, not scaled with the screen: `tall` 13 for 480 to 599 lines, 15 for 600 to 767, 16 for 768 to 1023, 21 for 1024 to 1299, 28 for 1300 to 1699, then 35 (1700 to 1899), 42 (1900 to 2499), 56 (2500 to 2999) and 70. The mockup used the video's 800x600 basis (15 in 600, 2.5% of the height); at 1080 lines it's 21 (1.94%), so the mockup's text reads about 29% too big for a 1080p player. cs16-client's 20 px between kill feed rows would be less than a 21-px line at 1080p, so the row step at his resolution is measured from his screenshot, not taken from cs16-client.

**What comes in from Sujan:** native-resolution screenshots at R9 0:27 of SK vs Na`Vi, Train, DreamHack Winter 2011 (the review zip's d), his resolution, any HUD scale setting he uses, and his Windows copies of `valve/resource/TrackerScheme.res` and `cstrike/resource/ClientScheme.res` from the 25th Anniversary build, which outrank the Mac copy where they differ.

**When they're in:** Claude redoes the mockup at his resolution with the edge-forced text, and shows a crop of his screenshot beside the viewer's own at 100%, with no scaling of either, so the size, the position, the row step and the letter shapes compare pixel for pixel. Then the size basis (part 2) and the feed's first row (part 1) are fixed from them. No build before (Sujan, 27 Nov 2026).

## The build, once answered (the first plan; replaced by "The build plan" at the end)

One branch from origin/main, one pull request, as 0.28.0 (a visible batch across the HUD), with a headless check that fails on 0.27.6 and passes after: at most 4 feed rows; chat and radio lines in a POV demo; spectators one per line; the spectator bars while following a player in an HLTV demo; the names over a full whiteout. Then the nine release checks (16 minutes on 0.27.6) and screenshots on `screenshots/0.28.0`. The wallbang labels don't change, so no comparison against main on the 88 demos beyond the release checks.

## How the mockup was made

`tests/harness.py` on 0.27.6's `index.html`, 1440x900: for each frame a script seeks and pauses, a screenshot, then a mock layer drawn over the page (DOM text and icon layers, a canvas for the bars, the radar's dot size halved, the scoreboard's spectators split) and a second screenshot; then the crops and the shots put together with Pillow. Frames: the GP Tourney POV at R20 1:22 (alive), R5 with the bomb down (dead, watching a teammate), R3 1:17 (full white, **Flashbang whiteout** ticked) and R16 1:08 (his Tab); SK vs Na`Vi, Train, DreamHack Winter 2011 at R9 0:27, **Player's eyes** on Na`Vi Zeus /A/.

## His files and checks, 27 Nov 2026 (evening)

Sujan's brief of 27 Nov 2026 (evening): his answers on the review zip of 26 Nov 2026 (`~/Downloads/cs16-review-2026-11-26.zip`, a to d), his files in `~/Downloads/cs-assets`, checks and the mockup only, no viewer code changed. Branch `notes/after-0.27.6-c`, from `notes/after-0.27.6-b`.

### 1. Reference files

- In the repo: `docs/reference/game-schemes/TrackerScheme.res` and `ClientScheme.res` (his Windows copies, CS 1.6 25th Anniversary build) and his F5 screenshots of the game's HLTV playback of SK vs Na`Vi, Train, DreamHack Winter 2011, R9, on Na`Vi Zeus /A/: `docs/reference/zeus-r9/800x600/` (12: six in first person, 163513 to 163518, six in the chase camera, 163535 to 163542) and `docs/reference/zeus-r9/1920x1440/` (10). No HUD scale setting changed: both sets use the game's defaults (Sujan).
- His Windows files are the Mac's: `TrackerScheme.res` byte for byte, `ClientScheme.res` apart from its line endings. "An older build than his Windows one" in "Two findings" above is wrong; the findings stand.
- The fonts, by band of screen heights (lines):

| Font | 480-599 | 600-767 | 768-1023 | 1024-1299 | 1300-1699 | 1700-1899 | 1900-2499 | 2500-2999 | 3000+ |
|---|---|---|---|---|---|---|---|---|---|
| TrackerScheme `EngineFont` (kill feed, chat): Verdana, weight 600, drop shadow, no antialias line in any band | 13 | 15 | 16 | 21 | 28 | 35 | 42 | 56 | 70 |

| Font | 480-599 | 600-767 | 768-1023 | 1024-1199 | 1200-6000 |
|---|---|---|---|---|---|
| ClientScheme `Default` (spectator bars): Verdana, weight 600, no drop shadow line | 12 | 13 | 14, antialias | 20, antialias | 24, antialias |

  `DefaultSmall` has the same sizes at weight 0. ClientScheme's colours: `team0` 204 204 204 (spectators), `team1` 255 64 64, `team2` 153 204 255 (its comments call them CT's and T's the other way round), `BaseText` 255 176 0.
- Stale state in his shots: the 1920 set reads Counter-Terrorists : 5 where the 800 set reads 4 at the same kill feed; 4 : 4 is R9's score, so the 1920 score is stale (Sujan: the game's HLTV player doesn't reset round state when the slider seeks, unless it goes back past a round start). The clock is stale too: shot 163514 reads 0:42, but its four kill feed rows (f0rest on starix, demo 1378.76 s, to markeloff on RobbaN, 1381.78 s, before f0rest on edzie, 1384.69 s) put it at the viewer's 0:31; the chase camera shots read 0:22 to 0:14 with an older feed (f0rest on starix alone). And the chat line in the 800 shots, "<e-s.se | DH MSI BEAT IT> For MSI BEAT IT coverage go to www.HLTV.org", is a server message (svc_print) from R1's start, demo 530.2 s, still on his screen in R9.

### 2. Check a: the Glock's burst fire (nothing changed)

His answer: around edzie's bomb pickup and plant, starix at the train ladder fires only bursts (markeloff's YouTube POV); the game's HLTV playback plays the same single-shot sound for single and burst fire and its gun never shows a burst; the viewer plays the same sound but its gun switches between single and burst.

a) **Why it flips.** `vmAnim` (`src/players3d.js`, the line `opts[lastK % opts.length]`) takes the shoot1, shoot2 and shoot3 animations the gun has and cycles through them by the shot's count among all of that player's shots in the demo. `v_glock18.mdl` has `shoot` (31 frames at 40 fps, 0.78 s), `shoot2` (31, 0.78 s) and `shoot3` (21, 0.53 s), no `shoot1`, so the Glock alternates `shoot2` and `shoot3` shot by shot. `shoot` and `shoot2` are burst animations (the slide cycles three times in the first 8 frames, the arm kicks up 9 to 11°); `shoot3` is a single shot (one slide cycle, the arm barely moves). A burst is three fire events, an odd number, so each burst flips the next one: in R1, 0:29 `shoot2` (burst look), 0:27 `shoot3` (single look), 0:26 `shoot2`. The game: cs16-client's `event_glock18.cpp` plays `GLOCK18_SHOOT` when the burst flag is set and `GLOCK18_SHOOT3` otherwise, and the flag is the watcher's own Glock's (`g_iWeaponFlags`), never set for someone watching a demo, so the game's demo player always shows `shoot3`, as he saw.

b) **What the demo carries.** No ammo: an HLTV demo has no player's CurWeapon or AmmoX (this one has 2 and 32 in all, the HLTV's own, with no player in them); the clip below is rebuilt by counting fire events from 20 after each reload animation (`ref_reload_onehanded`). Each event's `bparam1` (clip empty after the shot) is 0 for all his R1 shots, as the rebuilt clip says. A burst is visible: ReGameDLL (`wpn_glock18.cpp`, `weapons.cpp` `FireRemaining`) fires its second and third shots on the next player frames, with a fixed 0.05 spread, and the next burst no sooner than 0.5 s; single fire is at least 0.15 s apart, so three single shots can't fall in one 0.1-s HLTV frame. The burst's later events send the punch ×10000 instead of ×100, but it's 0 unless he was just hit, so that doesn't help. starix in R1 (demo time; R1 went live at 541.72 s; events in one frame; clip after the frame; what 0.27.6 shows):

| Demo s | R1 | Events | Gap s | Clip | 0.27.6 |
|---|---|---|---|---|---|
| 542.42 | 1:44 | 1 | | 19, reload at 1:44 | shoot2 |
| 546.16 | 1:40 | 3 | 3.73 | 17, reload at 1:39 | shoot3 |
| 587.25 to 590.77 | 0:59 to 0:55 | 1 each, 11 frames | 0.29 to 0.51 | 16 to 9 | shoot2 and shoot3 by turns |
| 592.97, 594.29, 594.79, 595.29 | 0:53 to 0:51 | 1 each | 2.21, 1.32, 0.50, 0.50 | 8 to 5, reload at 0:51 | by turns |
| 609.69 | 0:37 | 3 | 14.40 | 17 | shoot3 |
| 610.19 | 0:36 | 3 | 0.50 | 14 | shoot2 |
| 612.21 | 0:34 | 3 | 2.03 | 11 | shoot3 |
| 613.42 | 0:33 | 3 | 1.20 | 8 | shoot2 |
| 614.02 | 0:32 | 1 | 0.61 | 7, reload at 0:32 | shoot3 |
| 617.54 | 0:29 | 3 | 3.52 | 17 | shoot2 |
| 619.36 | 0:27 | 3 | 1.82 | 14 | shoot3 |
| 619.87 | 0:26 | 3 | 0.50 | 11 | shoot2 |
| 625.50, 626.01, 626.31 | 0:21, 0:20, 0:20 | 1 each | 5.64, 0.51, 0.30 | 10 to 8, reload at 0:19 | by turns |
| 631.65 | 0:15 | 2 | 5.34 | 18; GeT_RiGhT kills him | shoot3 |

edzie picks up the bomb at 0:51 (after markeloff dies with it at 0:53), drops it at 0:48, picks it up again at 0:28 (ScoreAttrib, demo 618.45 s) and plants at 0:23 (623.29 s). Between the pickup and the plant starix fires bursts at 0:29, 0:27 and 0:26, three events in one frame each, 0.5 s or more apart: the demo agrees with the YouTube POV. His single events at 0:59 to 0:55 are 0.29 to 0.41 s apart, too close for burst mode, so single fire. After the plant, 0:21 and 0:20 are single events 0.51 and 0.30 s apart; 0.30 s is too short for burst mode, so either he switched to single fire or the demo lost two events from each of three bursts, which it never does elsewhere in this stretch; markeloff's POV would tell. Across the 81 test demos with Glock fire (14,385 events, a player's events less than 0.15 s apart counted together): 7,594 alone, 1,175 pairs, 1,460 threes, 14 larger groups; a three is always a burst; a pair can be a burst cut short (29 pairs end with the clip empty) or two fast single shots in neighbouring frames, so it proves nothing.

c) **Proposal.** The flipping goes: the Glock's animation comes from the frame's own events, not from the shot count. Where one player's three Glock events arrive within 0.25 s (certain burst), `shoot`, the animation his own game played for a burst; everything else, `shoot3`, as the game's demo player does. That shows a burst only where the demo proves one. The strictly-as-the-game choice is `shoot3` always. The sound stays as it is: three events in one frame on the shooter's weapon channel cut each other in the game (and in 0.27.6, `src/audio.js`, "a new sound on the same entity channel cuts the previous one"), so the game plays one shot; the burst's three shots are one player frame apart (about 10 ms at 100 fps), which the demo doesn't keep, so three separate sounds would be a guess, and at 10 ms they'd still sound like one.

### 3. Checks b and c: the legs (nothing changed)

- His video, `~/Downloads/cs-assets/clip_17,95,77,43,13,536.mp4`: 88.0 s, 1920x1440, HEVC at 60 frames a second, AAC sound, 241.7 MB; R1 of SK vs Na`Vi, Train, DreamHack Winter 2011 in the game's HLTV playback with its chase camera: 0 to 1 s freeze time (0:08, 0:07), a jump, then 2 to 36 s on Na`Vi ceh9 (R1 1:44 to 1:10), 37 and 38 s switching (SK.RobbaN, SK.f0rest), 39 s to the end on Na`Vi edzie (1:07 to the plant at 0:23; health 100, then 16 from 0:46).
- The video's second v is demo time less 539.17 s: three kill feed rows appear within 0.1 s of that (markeloff's death, 593.49 s, at v 54.35; edzie on face, 594.60 s, at 55.35; ceh9 on Delpan, 599.52 s, at 60.35). The game's spectator clock rounds down, as the viewer's, so the zip's R1 1:14 to 1:11 is v 32.6 to 36.5 and 0:47 to 0:45 is v 59.6 to 62.5.
- 0.27.6 drawn at the same moments (`tests/harness.py`'s way, Theatre mode, 1200x900, **Behind player**), frame grabs side by side on the branch `screenshots/checks-2026-11-27` (`legs-compare.png`):

| | His game | 0.27.6 |
|---|---|---|
| ceh9, R1 1:13 to 1:12, moving 82° to 102° off his view | legs side-on along the move, striding left, his back turned to his view, no flipping | legs along the move (82° to 102°), the run forward, no flipping |
| edzie, R1 0:46 to 0:45, backing away 135° to 165° off his view | coming toward the camera with his back and heels to it: the legs face his view and the run plays backward | legs turned around (15° to 45° off his view), the run backward |

- cs16-client's `StudioEstimateGait`, read again: the speed and direction come from the drawn origin's move since the last drawn frame, so between two 0.1-s snapshots it's the move between them, as 0.27.6 has it. **The game matches 0.27.6 on both; nothing to change.** The cameras differ (his sits higher and further back; **Behind player** is pulled in by walls, at 35 s and 61 s), which is IDEAS.md, **The Behind player camera against the game's chase camera**.

### 4. The resolution decision, and how the HUD scales today

Sujan's decision (27 Nov 2026, `DECISIONS.md`): every HUD element (kill feed, chat, spectator bars) is laid out in 800x600 screen units with the 800x600 fonts (EngineFont 15, Default 13, no smoothing) and the sprites at their own size, then the whole HUD layer is scaled to the viewer's picture with no smoothing. At 1920x1440 the game drops the round timer's digits and the "(100)" in the spectator bars, and its icons don't grow; the viewer doesn't copy that.

How it scales today (0.27.6):
- **POV mode**'s HUD, plant bar and radar (`drawPovHud`, `drawPovBar`, `drawPovRadar`): sprites at `H / 768` of the view's height, at any fraction, smoothed, on canvases at the screen's own pixels.
- The spectator bars (`drawSpecBars`): 40 of 480 lines high (the game's are 64 of 480: 80 at 600), their text sized by **Interface size**, not by the view.
- The kill feed (`#feed`) and the Tab scoreboard (`#sb`): page elements sized by **Interface size**.

Where it conflicts: (1) the POV HUD's basis moves from 768 lines to 600, so it grows by 28%; (2) the kill feed, chat and spectator bars stop following **Interface size** and follow the view's height, as the game's do (**Interface size** keeps sizing the viewer's own controls); (3) the Tab scoreboard isn't part of this (in the game it's a separate panel); it stays as it is unless Sujan says otherwise.

The width: units 600 high and as wide as the view's shape needs (1067 at 16:9), each element held to the edge the game holds it to (the kill feed to the right, chat to the left, the bars across the whole width); 800x600 is the 4:3 case. Scale factors that aren't whole: k = the view's height in screen pixels / 600 (900 lines: 1.5; a 720-point view on a 2x screen: 2.4). Straight nearest-neighbour at 1.5 makes some 1-px strokes 2 pixels and others 1, and they shimmer as the window changes size; whole factors only would leave the HUD at 1x up to a 1199-line view. Proposed: when k is whole, nearest-neighbour; otherwise draw the layer at the next whole factor up with nearest-neighbour and scale that down to k with smoothing ("sharp bilinear"): every game pixel keeps the same width, with at most one soft screen pixel at its edge.

### 5. The mockup at 800x600

- `docs/proposed/kill-feed-spectating-mock.png`: 800x600, lossless; `docs/proposed/kill-feed-spectating-compare.png`: his shot (`docs/reference/zeus-r9/800x600/20261127163514_1.jpg`) and the mockup side by side at 100%, then the kill feed, chat, top bar and bottom bar at 3x nearest-neighbour: his game, the proposal, and the browser's own text (the fallback below). The first mockup, `docs/proposed/kill-feed-spectating-mock.jpg` (six rows, POV mode included), stays for the parts this one doesn't show.
- The moment: demo 1382.0 s (R9, the viewer's 0:31), after markeloff on RobbaN and before f0rest on edzie, so the same four kill feed rows; 0.27.6's 3D view at exactly 800x600, **Player's eyes** on Zeus with **Vanilla** on; Zeus where his shot has him. Zeus's AK is still coming out in ours (no gun on screen); his shot has it up. That's the gun, not the HUD.
- **How the game draws this text** (found by measuring, not in the scheme files): Windows draws "Verdana, weight 600" as Verdana Regular made bold, each letter 1 px wider and smeared 1 px to the right, at the em size the scheme's height gives as a cell height: EngineFont 15 is 12 px, Default 13 is 11 px. FreeType's hinted 1-bit rendering with that rule gives every width and capital height on his shot within 1 px: Counter-Terrorists : 4, 146 px (his 145); Spectators 9, 82 (82); Na`Vi Zeus /A/ (100), 140 (140); SK.RobbaN, 76 (76); Na`Vi starix, 85 (85); the chat line, 531 (531); capitals 8 px in the bars and 9 in the feed and chat. Verdana Bold at the same sizes is 1 to 7% too narrow (SK.RobbaN 71, the chat line 497), and its strokes are heavier.
- **The browser can't draw these letters by itself.** Its canvas text has no font hinting: with the edges cut at any level (96 to 224 of 255), with or without the smear, the letters differ and lines come out 1 to 2% narrower (the chat line 520 px against 531). The mockup's text is drawn the way that matches: the font's own hinting (FreeType), Verdana from the computer (`/System/Library/Fonts/Supplemental/Verdana.ttf` on the Mac). In the page, that means FreeType built to WebAssembly (FreeType License, credited) and the player's own Verdana, read through the local fonts permission of Chrome and Edge (one prompt); without the permission, the browser's own text with the edges cut and 1 px between letters, the "fallback" rows: heavier and a little narrower. No Verdana bytes or glyph bitmaps are shipped. Sujan decides.
- **The layout at 800x600, measured on his shot** (the proposal follows it): bars 0 to 79 and 520 to 599, black at 196 of 255; kill feed rows 20 px apart from the bar's edge, capitals from y 83, 103, 123, 143; each row's victim ends 15 px from the right edge (its letters at 783); 6 px between the killer, the gun icon, the headshot icon and the victim (cs16-client has 5, then none); icons at their own size (`d_ak47` and `d_m4a1` 48x16, `d_headshot` 36x16 from `640hud1.spr`), tinted 255 80 0 and added onto the picture; chat from x 24, capitals at 437; top bar: the score lines' letters end at x 677, capitals at 20 and 36; a divider at x 691, y 15 to 51, 255 176 0 at about a quarter; Spectators from 702 (capitals 20); the clock icon, the player's `valve/gfx/vgui/800_timer.tga` at its own 16x16, at 701, 32; the clock from 720 (capitals 36); the bottom bar's name and health centred on 399.5, capitals at 562. In 640x480 units these are 5, 12, 64 and 16: the game scales its 640 layout to the screen while its fonts and sprites keep their own size.
- **Measured on both** (his shot is a JPEG, so the proposal was put through JPEG at quality 90 for the colours; positions from its lossless copy):

| | His game | Proposed |
|---|---|---|
| Capital height, feed and chat / bars | 9 / 8 | 9 / 8 |
| Kill feed row step | 20 | 20 |
| Right margin, victim's letters to the edge | 16 (783) | 16 (783) |
| Killer, gun, headshot icon, victim | 6 px apart | 6 px apart; every name and icon within 1 px of his (row profiles cross-correlated; the two guns over his bright sky can't be matched) |
| Icons | 48x16, 36x16, as drawn | the same sprites |
| Team colours, after JPEG | T 230 73 76, CT 161 204 242 | T 226 76 73, CT 161 203 241 (drawn 255 64 64 and 153 204 255) |
| Bar text, after JPEG | 235 177 48 | 237 178 42 (drawn 255 176 0) |
| Chat, after JPEG | 242 181 56 | 240 179 35 (drawn 255 179 0) |
| Shadow | 1 px right and down | 1 px right and down; none in the bars, in both |
| Chat line, ink | x 24 to 554, capitals 437 | x 24 to 554, capitals 437 |
| Bottom name, ink | x 330 to 469 | x 330 to 469 |

- **Differences of more than 1 px, or in colour:** (1) the clock reads 0:31 in ours and 0:42 in his, his being stale; (2) the chat line is drawn here only to compare its letters: it's a server line from R1, which his answer (d) of 27 Nov 2026 leaves out, so the build won't show it; (3) the chat's yellow: his is paler in blue after JPEG (56 against 35), so it may be nearer 255 180 40 than 255 179 0; a lossless screenshot (Steam can keep an uncompressed copy) would settle it; (4) the clock icon is about 10% brighter in ours (111 114 51 against 124 127 58), so the game may draw it dimmed; (5) the icons over his bright sky look white in his and orange in ours: the pictures behind them differ, the icons don't; (6) his game draws a small crosshair in first person; **Player's eyes** draws none in HLTV demos (IDEAS.md, for later). Everything else is within 1 px.

### Seeking rebuilds the round's state (nothing changed)

The same moments reached five ways in 0.27.6 (opened fresh; from R10; from later in R9; from R8; played into from 8 s before), **Behind player** on Zeus: at 1382.0 s and at 1384.4 s (with a smoke and two bodies down), the score (4 : 4), clock, kill markers and lines, grenades, smoke, bodies and players are the same every way, and the pictures are identical to the pixel. The viewer works everything out from the moment (score from the round, bodies from the kills, smokes and blood by time); it draws no decals (bullet holes, blood and scorch marks on walls), so there are none to rebuild.

### What's next

Sujan: the Glock's animation (bursts shown where the demo proves them, or `shoot3` always, as the game); the text renderer (FreeType with the player's own Verdana through the local fonts permission, or the browser's own text); the mockup. No build before his answers.

## Sujan's decisions on #71 (27 Nov 2026)

1. The Glock: the burst animation (`shoot`) only where three of one player's shots come in the same tenth of a second; the single-shot animation (`shoot3`) everywhere else; the sound unchanged, one shot per burst.
2. The text: the browser's own (the "fallback" rows of `docs/proposed/kill-feed-spectating-compare.png`); FreeType with the player's own Verdana kept as an opt-in for later (IDEAS.md, "Kept for later").
3. Sizes and scaling: **POV mode**'s HUD 28% larger (600 lines, not 768), the kill feed and spectator bars by the view's height instead of **Interface size**, the bars 64 of 480 lines; drawn at the next whole size with no smoothing, then shrunk with smoothing; **Interface size** still sizes the Tab scoreboard.
4. The bars' clock icon as dim as the game's (about 10% under the file's colours), fixed in the build.
5. The review zip's demo, `sk-vs-navi-dhwinter2011-1111261019-de_train.dem`: byte for byte the test demo (SHA-256 `ddd178a207efa59d506bf5b4d298eca7b75768d4e6b42f78fa60cd10030d9243`, 40,049,341 bytes, read straight from the zip; the same in `~/code/cs16-data/test-demos` and `tests/demos-manifest.md`; the repo keeps no demos). Nothing deleted.

How bursts arrive, for decision 1 (all 81 test demos with Glock fire): of 1,460 three-shot groups, 1,024 come in one frame, 1,415 within 0.12 s (one frame or two neighbouring ones), 1,432 within 0.25 s, none over 0.30 s; three single shots need at least 0.30 s.

## The build plan (27 Nov 2026, waiting for Sujan's approval)

Three pull requests, each from origin/main (the third stacked on the second), each with its own version, CHANGELOG entry, `LIMITS.md` update, by-eye lines, screenshots branch and one run of the nine release checks (about 16 minutes; asked before each run).

**PR 1, 0.27.7: the Glock, the POV radar dots, the scoreboard's spectators** (small, independent of the HUD layer)
- The Glock (`src/players3d.js`, `vmAnim` and `povVmAnim`): for `v_glock18.mdl`, `shoot` when the shot is one of three of that player's Glock shots within 0.12 s, else `shoot3`; the other guns keep today's turns. In **POV mode**, his own shots by the same rule, and an animation his game recorded still wins.
- The POV radar's dots 2 of the radar's 128 units instead of 4, the marks above, below and the bomb's cross halved with them (`drawPovRadar`).
- The Tab scoreboard's spectators one per line, a line under their heading (`showScoreboard`, `src/app.css`).
- Checked: a headless script on SK vs Na`Vi, Train, DreamHack Winter 2011, R1, failing on 0.27.6: starix's animation at 0:59 to 0:55 `shoot3` on every shot, at 0:37 to 0:26 `shoot` on the bursts and `shoot3` at 0:32; on the GP Tourney POV (Team Guardians vs Lanka Dahan, Mirage, 25 Oct 2026) the dot size and the spectators' lines.

**PR 2, 0.28.0: the HUD layer, the kill feed and the spectator bars in the game's look**
- A new file, `src/hud.js` (in the 3D view's script; `build.py` and "Where the code is" in `AGENTS.md`): the layer in 800x600 units (600 high, as wide as the view's shape), drawn at the next whole size with no smoothing, then shrunk to the view with smoothing (directly at whole sizes); text and bars on `#spec3`, icons added onto the picture on `#hud3`; redrawn only when what it shows changes.
- Text: the browser's Verdana Regular, 12 px (EngineFont) and 11 px (Default), 1 px between letters, edges cut at half, the 1-px smear, a 1-px black shadow for EngineFont only.
- Kill feed, in 3D (every camera): 4 rows, 6 s each, rows 20 apart, the first at 80 (spectating, every HLTV demo, dead in POV) or 42 (alive in POV), ending 15 from the right edge, 6 between the names and the icons, the game's team colours, the player's own icons at their size, tinted 255 80 0 (team kills 10 240 10) and added onto the picture; the names readable over a full flashbang white, the icons gone in it.
- Spectator bars, while following a player in an HLTV demo (**Player's eyes**, **Behind player**) and while he spectates in a POV demo: 80 units each, black at 196 of 255; Counter-Terrorists : n and Terrorists : n, the divider, Spectators n, the clock with the player's `valve/gfx/vgui/800_timer.tga` at 90% (the folder pick reads it from now on); the followed player's name and health at the bottom; his money when he's dead in a POV demo. While they're up: no name box, no header score, the round pill "Round N" alone, the camera buttons under the top bar, the bottom-left strip above the bottom bar.
- **POV mode**'s HUD, plant bar and radar on the 600-line basis (28% larger), sprites unsmoothed.
- Checked: a headless script on SK vs Na`Vi, Train at demo 1382.0 s, 800x600: the bars, rows, gaps and icons where his shot has them (within 1 px; the letters are the browser's, 1 to 2% narrower); at 1440x900 and 2560x1440 the scale and even strokes; free camera without bars; the GP Tourney POV's HUD size. The by-eye line **Flashbangs (0.26.30)** changes (the names over the white).

**PR 3, 0.28.1: chat and radio lines** (on PR 2's layer)
- The reader (`src/demo.js`) also keeps the radio text (TextMsg to the radio, `#Game_radio`: who and the phrase); only POV demos carry it. The chat (SayText) it already keeps; server and plugin lines stay out (his answer (d)).
- The words from the player's own `cstrike_english.txt`; yellow 255 179 0, the sender's name in his team's colour where the game's text asks for it.
- EngineFont, from 24 units in, the first line's capitals at 437 while spectating (his shot) and at about 430 while alive in POV (his YouTube POV, 71.6%); up to 5 lines, the oldest leaving every 5 s, readable over a full flashbang white.
- Checked: `reader_compare.mjs` (only the radio text added), radio lines at known moments of the GP Tourney POV, dead players' all-chat in SK vs Na`Vi, Train.

**Questions with the plan**
- (1) "The same tenth of a second": one frame only (1,024 of the 1,460 bursts) or within 0.12 s (1,415). Recommended: 0.12 s.
- (2) The 2D view keeps today's kill feed (the game's look belongs to the game's picture). Recommended: yes.
- (3) The kill feed in the free camera in the game's look, without the bars (the bars only while following, decided 27 Nov 2026). Recommended: yes.

When Batch B adds blood marks and scorch marks on walls, they're drawn from the moment, as everything else, so seeking keeps rebuilding them.
