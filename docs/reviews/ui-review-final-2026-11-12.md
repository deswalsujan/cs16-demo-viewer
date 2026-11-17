# UI review, final list (12 Nov 2026)

Merged from three independent reviews of 0.26.30, judged from `screenshots/ui-review-2026-11-12` and the live page: an outside agent, a fresh subagent (`docs/reviews/ui-review-subagent-2026-11-12.md`) and a second outside agent. Each point was checked against the screenshots and the code in the review chat. "All 3" means all three reviewers raised it.

Sujan's call (12 Nov 2026): build all 14 on one branch, judged live in the browser instead of mockup rounds (for this work only); items he doesn't like are dropped before the merge, the rest goes to main.

## How to build

- Branch `wip/ui-simpler` from `origin/main` after the contrast pull request is merged, with an "In progress" entry at the top of CHANGELOG.md.
- One commit per item, message `ui: item N, <what>`, so any item can be reverted on its own. When an item needs another one, say so in its commit body.
- Update the checks that look for today's buttons and wording in the same commit as the change. Run the eight checks at the end.
- Record in DECISIONS.md: "built for trial on wip/ui-simpler". The decisions each item reopens move to Superseded only when Sujan merges.
- Give Sujan one paste-ready command to open the branch's build in Chrome on the Mac without switching your own working copy.

## The 14 items

1. **Start screen shows only the start steps** (all 3). No 2D/3D switch, Theatre, Full screen, side panel tabs or bottom bar until a demo is open. Reopens nothing.

2. **Load card** (all 3).
   - Everything loaded and nothing to say: one line, "Ready: 48 rounds", with a **Details** link to today's list, closing itself after a few seconds.
   - A note or a button (**Join the parts**, the map switch, missing files): the card shows only the notes and stays until closed; the green ticks go under **Details**. Today it closes itself after 15 s even while it holds a button (`src/ui/summary.js`).
   - POV: "His view only, in 3D" and the anti-wallhack note as one short line; the full text stays on the **!** of **See through walls**.
   - The card for a demo that can't be played: plain words for what's wrong; the file detail (index, bytes) goes into **Copy debug info**; closing it goes back to the start screen.
   - Reopens: "the load summary says exactly why" (2 Oct, softened, nothing lost); the anti-wallhack line in the load summary (11 Nov, kept, shortened).

3. **One set of wallbang words and one time format** (all 3).
   - **Wallbang** (victim fully hidden, today's STRICT WB), **Partial wallbang** (part of him in view, today's LOOSE WB), **Wall damage** (a hit through a wall, no kill, today's DAMAGE). The tab stays **Wallbangs**: finding wallbangs is why the viewer exists. Filters: All, Wallbang, Partial, Wall damage. The kill feed, the kill-marker legend, the Kills list tags and the tooltips use the same words (HS added for a headshot).
   - Times in the lists and tooltips: "R23 1:18" in one shape (C4 0:16 after the plant); demo time on hover and in **Copy list**. The "Times: round and in-game round timer, then demo time." line goes. The round pill keeps "Round 23 · 1:18".
   - Reopens: the Wallbangs list labels (25 Oct, 0.24.0); the three-line time in the lists (15 Oct, CHANGELOG 0.21.1).

4. **View options in one place** (all 3). One strip at the bottom left in 2D, 3D and POV: **Names**, **Grenades**, **Kill lines**, **See through walls** (not in 2D, where it does nothing: only the 3D view reads `opts.xray`), **Reset view** (not in POV), then **View settings**, opening upward, with only the rows the current view uses (so **Interface size** is reachable in 2D). **Vanilla** becomes **Hide all overlays**, same behaviour. Not built: folding **Names**, **Grenades** and **Kill lines** into the menu (two reviewers suggested it); Sujan can ask for it after trying this.
   - Reopens: the 3D bar (14 Oct, 0.18.1); the name **Vanilla** (3 Nov).

5. **A Radar toggle replaces 3D + radar** (all 3). The header switch is 2D | 3D; **Radar** is a row in **View settings** in 3D for HLTV demos, saved like the other settings; a saved "3D + radar" opens as 3D with Radar on. Fix the radar labels cut off at its right edge (open item, **Seen while building 0.26.13**). Reopens nothing.

6. **The Kills tab lists the whole match in HLTV demos too** (2 of 3), by round with the round headings of POV demos (11 Nov look), scrolled to the round playing at a new round; a click on a row leaves the list where it is. Reopens nothing.

7. **One Full screen button** (all 3). It uses Theatre mode as today (F); T still fills the window without full screen, with no button of its own. The button shows its on state instead of renaming itself. Reopens nothing.

8. **Bottom bar** (all 3, in parts).
   - Speed: one button showing the current speed ("1×") that opens the six; [ and ] stay.
   - Timeline: a two-part switch, **Match** | **Round**, in place of "Timeline: match".
   - Heatmap: one control; side and range show only while it's on. The 2D map still fits above the controls (3 Nov).
   - "Press ? for keyboard shortcuts" in the view: shown for the first few demos, then only in Help (the 11 Nov rule hiding it in POV, 2D, Theatre and under 1100 px stays).

9. **Shortcuts becomes Help** (all 3). The bottom bar button reads **Help ?** (the ? key opens it). Three parts: Keys; Colours and marks (the kill-marker legend, and the timeline's bar colours, diamonds and gaps, which nothing explains today); About (version, What's new, Source, Report a bug, **Copy debug info**). Reopens nothing.

10. **Quieter Join** (all 3). The Rounds tab's question ("Is this map split over two or more demo files?") shows only when the demo looks unfinished (no winner at the end, or the load summary offered to join); otherwise a small "Join with another demo…" link at the end of the list. In the card, checks that pass fold into one line that opens on a click; warnings stay in full; each part's own line stays as approved. One name for the action, **Join parts**.
    - Reopens: how the Join card shows its checks (7 Nov).

11. **Kill details lead with the summary** (all 3). The summary line, then one row per hit (damage, body part, wall or open). "Earlier:" becomes one line ("75 HP lost before this fight") that opens today's list on a click. The time column says what it is ("0.51 s before"). The * note moves to hover text on the starred word.
    - Reopens: kill details with "Earlier:" open (3 Nov, 0.26.16).

12. **Start screen text and demo list** (all 3).
    - Tagline: HLTV and POV demos (today it says HLTV only).
    - Step 2 in one sentence ("Pick a demo below, or open a .dem file from anywhere."); the pre-2008 (protocol 47) note behind a **More** link.
    - The drop line: "Or drop a .dem file anywhere on this page"; the overview pair goes to Help.
    - "Found 36 maps, 31 overviews…" becomes "78 demos".
    - Once a folder is picked, the big heading shrinks to one line so more of the list shows.
    - Each demo row: name and the file's date (newest first, as sorted today in `src/ui/folder.js`); the size on hover. Showing HLTV or POV per row is left for later (it needs every file read at the pick).
    - A Copy button beside each path. Both paths stay, word for word (2 Nov folder text).
    - **Clear saved files** gets a name that says it deletes the saved map overviews and forgets the folder (`src/ui/clear.js`), in the footer with the version; its two-click confirm stays a button stating the size.

13. **Players and Rounds tabs** (all 3).
    - Players: the digit column headed **Key**, the skull out of that column; the note becomes one line, "Kills and deaths from the kill feed, live rounds only.", the rest in Help.
    - Rounds: **Show warmup, restarts and idle rounds** moves to the end of the list; the right-hand column gets a heading (the score and the round's length).

14. **Thinner header** (2 of 3). The file name no longer cut off at 1512 px (map and teams first, the full name on hover); the spectator count leaves the header (it's in the Tab scoreboard). Reopens nothing.

## Found along the way, for IDEAS.md

- In a POV demo the kill feed covers the Tab scoreboard's column headers (screenshot 50).

## After the merge

- The first-visit tour (parked) becomes four or five one-time hints, built together with the tooltips, in one look: the timeline, clicking a kill to watch it, Tab for the scoreboard, 1 to 0 and the arrows for players, the first POV demo.
