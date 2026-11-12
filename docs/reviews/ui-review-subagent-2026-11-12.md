UI review: CS 1.6 Demo Viewer (v0.26.30)

What I looked at: README.md and all 58 pictures on screenshots/ui-review-2026-11-12 (plus the 1920x1080 set), and the live page's start screen text. No other repo file. The branch is checked out at /private/tmp/claude-501/-Users-deswalsujan-mac-code-cs16-demo-viewer/ef5a6687-b563-4cac-bbe6-f09e63a208ab/scratchpad/shots-branch/ (pictures in its 1512x982/ folder). The live start screen has the same text as picture 01.

## 1. The 15 changes, ranked by how much simpler they make the app

**1. Start screen: show only the start steps** (01 to 06)
- **Today:** The whole viewer frames the two steps. That's the 2D / 3D / 3D + radar switch, Theatre, Full screen, four side tabs, play buttons, "0:00 / 0:00", "Timeline: match", volume, Shortcuts and six speed buttons. None of them work yet. A first-time visitor sees about 20 controls before learning what the app needs. Theatre, Full screen and Shortcuts look active, so people will click them and nothing happens.
- **Change:** Until a demo is open, show only the logo and the start card. Bring in the header switch, side panel and bottom bar once a demo loads.
- **Effort:** small to medium.
- **Lost:** nothing. Shortcuts help can stay as a footer link.

**2. Load summary: show it only when there is news** (08, 43, 46)
- **Today:** Every opened demo shows "Ready to watch" with seven green ticks, such as "Weapons in hand 14 of 14", "First-person weapons 14 of 14" and "Sounds 102 of 102". The card covers the view and closes itself after 3 to 13 seconds.
- The real news sits in the same list: "this recording ends before anyone won... Join the parts" (43), and the POV limits and anti-wallhack plugin (46). The card still counts down and closes even though it holds a button. Look away and you miss the Join offer.
- "Weapons in hand" vs "First-person weapons" means nothing to a player.
- **Change:** If all loaded, show no card, or a one-line "48 rounds, ready". Otherwise list only the lines that matter. Never auto-close a card that asks for a decision. Put the full checklist behind "What loaded", or in Copy debug info.
- **Effort:** small.
- **Lost:** seeing the full list every time. It stays one click away.

**3. One place for what's drawn on the view, and a simpler View settings** (10, 13, 17, 47, 53, 54)
- **Today, the controls are split:**
  - Names, Grenades, Kill lines, See through walls and Reset view sit bottom left.
  - Damage numbers, Glow on hits, Team colours, Crosshair and Vanilla sit in View settings. In HLTV that's top left in the camera row; in POV it's under the radar.
  - "Vanilla: every overlay off" overlaps the bottom toggles. A player can't tell if Vanilla also turns off Names, or which one wins.
- **Today, inside View settings:**
  - There are three kinds of control: tick boxes, a button that reads "Off" (Team colours), and menus.
  - Two settings cover damage ("Damage numbers: Wallbangs" and "Glow on hits: damage through walls, no kill").
  - Two tick boxes cover one flashbang.
  - A POV demo shows the heading "Demos recorded by a player", which is the demo you're already in.
- **Change:**
  - Put the toggles and the View settings button in one strip, in the same spot for 2D, 3D and POV.
  - Use one control type throughout.
  - Merge the two damage settings into "Damage shown: Off / Through walls / All hits".
  - Make flashbang one menu: Off / Dot / White / Both.
  - Drop the POV heading.
  - Turn Vanilla into a "Plain view, like the game" preset that flips the toggles, so they always show what's on.
- **Effort:** medium.
- **Lost:** glow without numbers.

**4. One name for each kind of wallbang** (20, 31 to 35, 37, 38)
- **Today:** One idea has many labels:
  - Filters: "Strict wb", "Loose wb", "Damage".
  - Row tags: STRICT WB, LOOSE WB, DAMAGE, plus an orange icon.
  - Kill markers: "WALLBANG · HS" and "LOOSE WB".
  - Timeline tooltip: "HS WB".
- Strict vs loose is explained only in the kill markers part of the Shortcuts panel (37). On the Wallbangs tab a player can't tell what Strict, Loose or Damage mean. Many won't read "wb" as wallbang. This is a core reason the app exists.
- **Change:** Pick plain names, for example "Wallbang kill" (victim hidden), "Partial wallbang" (victim partly in view) and "Wall damage" (hit, no kill). Use them in filters, tags, markers and the tooltip. Put a one-line key at the top of the Wallbangs tab.
- **Effort:** small.
- **Lost:** nothing.

**5. Shorter start screen text** (01 to 06)
- **Today:**
  - The tagline "CS 1.6 HLTV demos, played in your browser" leaves out POV.
  - Step 2 says "Also plays pre-2008 (protocol 47) demos". Few players know what protocol 47 is.
  - "or an overview .bmp and .txt pair" is a mapper's file, not a player's.
  - "Found 36 maps, 31 overviews, 23 player models, 2858 sounds and 78 demos" repeats "78 demos found" and lists things nobody asked about.
  - "Clear saved files" doesn't say what it clears. In 06 it also forgets the folder.
  - The button text changes from "Open .dem" to "Open .dem from elsewhere".
- **Change:**
  - Tagline: "CS 1.6 demos, played in your browser".
  - Step 2: "A .dem file from HLTV or from a player. Pick one below or open a file from anywhere."
  - Drop line: "Or drop a .dem file anywhere on this page."
  - Remove the "Found..." line.
  - Rename "Clear saved files" to "Forget my folder" and add one line on what it removes.
  - Use one open-button label in both states.
  - Mention protocol 47 and overview files only where they apply.
- **Effort:** small.
- **Lost:** less advertising of old-demo support.

**6. Merge Theatre and Full screen** (01, 37, 41, 42)
- **Today:** Two header buttons do nearly the same thing. The Shortcuts panel needs a sentence to explain them: "full screen uses Theatre mode". You have to try both to learn the difference.
- **Change:** One "Full screen" button (F) that fills the screen with controls at the edges. Keep T as a key for theatre inside the window.
- **Effort:** small.
- **Lost:** theatre-in-window as a button. It stays on a key.

**7. Radar becomes a toggle in 3D, not a third view** (13, 16, 46)
- **Today:** "3D + radar" is just 3D with the radar in a corner, but it reads like a separate mode and widens the header. The POV load card has to explain "no 2D or 3D + radar view".
- **Change:** The switch becomes 2D / 3D. Add "Radar" to the on/off strip from item 3.
- **Effort:** medium.
- **Lost:** nothing.

**8. Kills tab works the same in HLTV and POV** (22, 56)
- **Today:** In HLTV the Kills tab lists only the current round ("ROUND 23, 7 KILLS"). In POV it lists the whole match, grouped by round. Same tab name, two behaviours. In HLTV, finding a kill from another round means changing rounds first.
- **Change:** Use the POV layout for both: the whole match, grouped by round, scrolled to the round playing now.
- **Effort:** medium.
- **Lost:** nothing.

**9. Shorter rows in Kills and Wallbangs** (20, 22, 31 to 35)
- **Today:** A kill takes three lines. A wallbang takes five (killer, gun, tag, damage, victim), plus a three-line time ("R4 · 1:30 / 13:22"). That time needs a legend: "Times: round and in-game round timer, then demo time." Only about 6 of 45 wallbangs fit on screen. The kill feed shows the same facts on one line.
- **Change:** Use the kill-feed line ("R4 1:30, killer [gun] victim") with a small second line for tag and damage. Drop demo time from the row (keep it in Copy list), and the legend goes with it.
- **Effort:** medium.
- **Lost:** demo time at a glance.

**10. Thinner header, fewer repeats** (09, 13, 37, 39, 45)
- **Today:**
  - The header holds map, file name, duration, teams, score, spectator count, the view switch, Theatre, Full screen, Open another demo, and sometimes "3 files". At 1512 wide the file name and duration are cut ("· 103...").
  - The spectator count ("9 watching") is also on the Tab scoreboard.
  - In 3D, a "Press ? for keyboard shortcuts" chip repeats the "Shortcuts ?" button.
  - The Shortcuts panel also holds the kill marker key, version, What's new, Report a bug and Copy debug info.
  - "Timeline: match" names the current state, not what clicking does.
- **Change:**
  - Header: map, teams and score, view switch, one full screen button, Open another demo. Show file name and length when you hover the map name.
  - Drop the spectator count from the header.
  - Show the "Press ?" chip only on a first visit.
  - Rename "Shortcuts" to "Help".
  - Label the timeline button by its action ("Zoom to round" / "Whole match").
- **Effort:** small.
- **Lost:** file name and spectator count at a glance. One hover or Tab away.

**11. Rounds tab and joining parts: show only when needed** (07, 23 to 26, 43 to 45)
- **Today:**
  - Every Rounds tab, HLTV and POV, starts with "Show warmup, restarts and idle rounds". Most players never need it, and it also reshapes the timeline (24).
  - Every demo ends with "Is this map split over two or more demo files? Join with another demo…", even a finished 48-round match. Yet the app already knows when a demo stops early (43).
  - The Join card has two add controls at once ("Add a part from your folder [Pick a demo…] [A file from elsewhere…]" and a greyed "Add another part…"), and up/down arrows for a single part (26).
  - With three parts (44) it lists six checks, several just notes ("Its kills from where the recording starts are in the file and count").
- **Change:**
  - Move the warmup box to the bottom of the list.
  - Show the Join row only when a demo looks unfinished. Otherwise make it a small link at the end.
  - In the card: one add control, arrows only with two or more parts, and one line "Same map, server and players" when checks pass. Show warnings in full; put the rest behind "Details".
- **Effort:** small to medium.
- **Lost:** nothing.

**12. Heatmap filters only when a heatmap is on; no See through walls in 2D** (10, 11, 18, 37)
- **Today:**
  - 2D shows three menus: "Heatmap: off", "Both sides" and "Whole match". The side and time menus look active with nothing to filter.
  - "See through walls" sits among the 2D toggles, but the radar already shows everyone. The Shortcuts panel describes it as "(3D)". A player will press it in 2D and see no change.
- **Change:** Show one Heatmap menu. Show the side and time menus only after a heatmap is picked. Hide See through walls in 2D, or say what it does there.
- **Effort:** small.
- **Lost:** nothing.

**13. Players tab vs Tab scoreboard: same words, different numbers** (27 to 30, 36, 58)
- **Today:**
  - At R23, the scoreboard gives GeT_RiGhT 27 kills while the Players tab gives 48. One is the server's count now; the other is the whole match from the kill feed. Only a five-line note under the tables explains the difference.
  - The unlabelled key column (1 to 0) turns into a red skull for players dead right now. That's live state inside a whole-match table.
- **Change:**
  - Rename "Total" to "Whole match".
  - Head the key column "Key".
  - Drop the skull here; it's already on the scoreboard and in the view.
  - Cut the note to one line: "From the kill feed. Bomb points and team kills don't count."
- **Effort:** small.
- **Lost:** who's dead now in this table. It's still visible elsewhere.

**14. Write health and damage one way; shorter kill details** (14, 20, 31, 35)
- **Today:**
  - Health appears as "100 hp" over heads but "(48)", with no unit, in the name bar.
  - Damage appears as "−19" in kill details but "52 HP" in the Wallbangs list. There, HP means damage dealt, not health.
  - Kill details pack "Earlier: −12 from a grenade at 1:25, −8 from a grenade at 1:23, −13 ..., −21 at 1:19, source unknown" plus the footnote "*Estimated from the damage; the demo says only head or body."
- **Change:**
  - Health is always "48 hp". Damage is always "−52".
  - Collapse "Earlier" to "Earlier: 75 damage from 5 hits", with the list on click.
  - Replace the asterisk and footnote with "chest or arm (estimated)".
- **Effort:** small.
- **Lost:** nothing.

**15. Plain words on the "can't be played" card** (07)
- **Today:** The card says "the index it ends with isn't in the file", "stops 105 bytes into its last frame". "Index" and "frame" are file-format words. Behind it, an empty viewer shows "Team 1 0 : 0 Team 2", "Not counted · 0:11", heatmap menus and the Join row.
- **Change:** "This file is incomplete. The download or copy probably stopped early. Try getting the file again." Keep the byte detail for Copy debug info. Show the card over the start screen.
- **Effort:** small.
- **Lost:** nothing.

## 2. Things that work well and should not change

1. **The folder step (02, 03).**
   - The wrong-folder message says exactly what's missing.
   - The step shrinks to one line once it's done.
   - "Your browser may call it an upload, but nothing leaves your computer" answers the scary browser prompt before it appears.
2. **Demo search (04).** It highlights the match, shows "3 of 78" and has a Clear button.
3. **The timeline (10, 38).** Round numbers, kill marks and the hover tooltip show where the action is at a glance.
4. **One click from a kill or wallbang row to the killer's eyes (20, 21, 35).** Each bullet line is also a jump point.
5. **Game-like parts stay game-like.** That's the Tab scoreboard (36), "He held Tab here" (49) and the death banner "killed by ... press ↑ for the next player" (19). POV also hides what it can't do: no 2D switch, no Wallbangs tab (46 to 48).

## 3. Is a first-visit guided tour still needed?

Not for the start screen. After change 1 and change 5 it explains itself.

Inside the viewer, yes, but small: one-time hints at the moment they matter, not a slideshow. The best features are hidden in clicks and keys. Moments to cover:
1. **First demo open, the timeline:** "Numbers are rounds, marks are kills. Click to jump, hover for who killed whom."
2. **The side panel:** "Click any kill or wallbang to watch it through the killer's eyes."
3. **Following a player:** "Click a player or press 1 to 0. ↑ and ↓ switch. V changes the camera."
4. **The scoreboard:** "Hold Tab for the scoreboard."
5. **First POV demo:** "You see only what he saw: no 2D, no free camera, only his kills."
6. **Optional, for admins:** See through walls (H), and what the "!" means on servers with anti-wallhack.

## 4. What I couldn't judge, and what I'd need

1. **Windows and other browsers.** Every picture is Chrome on a Mac. The live page has a "Windows:" line whose path I couldn't see. I need step 1 on Windows, plus the browser's own folder prompt in Chrome, Edge, Firefox and Safari.
2. **A returning visit.** I can't tell if the folder is remembered, or what a weekly user sees on opening the page. I need a picture of a second visit.
3. **Demo list order and length.** Only 7 of 78 rows show, and the order is unclear (a 2026 file, then 2009, then 2011). If it isn't newest first, sorting that way would cut most searching. I need the scrolled list and the order rule.
4. **Loading and motion.** I couldn't judge loading time (for example the 151 MB demo) or how the card looks while loading. Playback, camera moves, kill markers and the Theatre slide-in are all frozen in pictures.
5. **What some controls do.** I can't tell what See through walls does in 2D, or what Reset view does in Eyes and Behind.
6. **The picked player in 2D (12).** Beyond a path line I can't see the highlight or the name bar the README mentions. I need a before/after crop.
7. **Unlabelled times in Rounds rows.** I can't tell what the right-hand times mean (1:58, 1:05). Round length?
8. **Smaller screens and larger Interface sizes** (1366x768, 150 to 200%). The header already cuts the file name at 1512 wide.
9. **Hover tooltips** on tags and buttons. They might already explain Strict/Loose.
10. **Team rename (40).** Nothing hints that it exists. I can't tell why a player would use it, or whether it's kept.
11. **The POV Players note (58)** is cut off in the picture.
12. **Not about simplicity, but worth a look:** in 49 and 50 the kill feed covers the scoreboard's column headers. In 46 and 47 the round pill covers red HUD text on the left.
