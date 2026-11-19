# wip/ui-simpler: the UI review's 14 items, for trial

The full test run on the branch, before Sujan judges the items live (`docs/reviews/ui-review-final-2026-11-12.md`). It becomes the release's log, `tests/logs/<version>.md`, when the branch is released.

## The full test run (Sujan's go, 17 Nov 2026), on a3f987c

The eight checks, `pov_feedback_check.py`, `pov_mockup_round_check.py`, `light_check.py` and `theatre_test.py` at all five window sizes, one after another, each on its own exit code, 14:18 to 14:38 (20 minutes against the 14 expected: the Mac's load average was about 17 during the run, the cause not checked).

| Check | First run | Run again alone, the same commit, 14:39 to 14:46 |
|---|---|---|
| `folder_row_test.py` | PASS, 24 of 24, 8 s | |
| `start_screen_check.py` | PASS, 7 s | |
| `prefs_check.py` | PASS, 4 s | |
| `demo_search_check.py` | FAIL, 2 steps, 276 s: the AWP's zoom in Player's eyes not yet applied 400 ms after the seek (fov 73.74 where 30.54 is wanted); the label layer after an error drawn in 6 frames where more are wanted | PASS, all, 154 s |
| `late_kill_timing_check.py` | PASS, 7 s | |
| `panel_click_check.py` | PASS, 10 s | |
| `ground_truth_check.py` | PASS: 233 kills and 46 scores and K-D on 56 demos, 0 mismatches, 9 known gaps (the same 9), 0 skipped, 178 s | |
| `pov_reopen_check.py` | PASS, 17 s | |
| `pov_feedback_check.py` | FAIL, 2 steps, 46 s: a new round's heading and a round with no kill of his, both read before the seek's round change had drawn | PASS, 28 s |
| `pov_mockup_round_check.py` | FAIL, 2 steps, 37 s: 3.22 s of demo played where more than 4 are wanted; the notices over the kill feed's rows at 1512x982 before they had stepped down | PASS, 22 s |
| `light_check.py` | PASS, 8 of 8, 20 s | |
| `theatre_test.py`, 1512x982 at 2x | 38 of 39 (exit code 0), 167 s: "Top edge shows the header and camera buttons", the camera bar's opacity read 400 ms after the mouse reached the top | 39 of 39, 88 s |
| `theatre_test.py`, 1440x900 at 2x | 38 of 39 (exit code 0), 163 s: the same step | 39 of 39, 88 s |
| `theatre_test.py`, 1920x1080 at 1x | 39 of 39, 108 s | |
| `theatre_test.py`, 1536x864 at 1.25x | 39 of 39, 88 s | |
| `theatre_test.py`, 1707x960 at 1.5x | 39 of 39, 85 s | |

Every step that failed waits a fixed time for something the page draws over several frames, and each passed when run again alone, at its usual speed, on the same commit. `theatre_test.py` exits 0 even when a step fails (IDEAS.md, **theatre_test.py exits 0 when a step fails**).

## Sujan's fixups to items 3, 6 and 8 (17 Nov 2026), the checks they touch

| Check | Commit | Result |
|---|---|---|
| `panel_click_check.py` | items 6 and 8 before their commits (built page as committed in 4114db3 and 610b20d) | PASS, 9 s |
| `pov_mockup_round_check.py` | the same | PASS, 21 s, with the new step: no row tinted for the round playing, in the POV and the HLTV demo |
| `demo_search_check.py` | the three fixups before their commits | 1 step of 130 failed, 7 min 17 s: SK vs AGAiN, Train, Arbalet Cup Europe 2009, the folder pick not done in 30 s (the speed button and the new Wallbangs dropdown step passed); that block alone on the same page, 6 s, PASS |
| `demo_search_check.py` | 8ab46f4 (Sujan's go) | PASS, 135 steps, 2 min 27 s |
| `notes_check.py` | each commit | PASS |

## Sujan's judgement of 19 Nov 2026: the fixups and bug fixes built, the checks not run yet

Sujan judged the branch live on 19 Nov 2026 and kept all 14 items; his fixups and bug fixes of that day, and his answers of the same day in the review chat, are built on the branch (`DECISIONS.md`, 19 Nov 2026), from e7fbc13 on. On his word the checks they touch wait until the review chat has checked the commits, and run once after that, on his go: `demo_search_check.py`, `theatre_test.py` at all five window sizes, `pov_mockup_round_check.py`, `pov_feedback_check.py`, `pov_reopen_check.py`, `panel_click_check.py`, `folder_row_test.py`, `start_screen_check.py`, `prefs_check.py` and `notes_check.py`, about 12 minutes; `ground_truth_check.py`, `late_kill_timing_check.py` and `light_check.py` are left out, since nothing in these changes touches counting, kill timing or the light. The checks were updated for the new words and buttons, with new steps for each change, but none of them has run on these commits; `start_screen_check.py` ran once, by mistake, before the estimate was given, on 81e113b's build before its commit: its words step passed (the rest of its output not kept).

`notes_check.py` passed before every commit. Each change was looked at in the headless page with a throwaway script (not one of the checks), with the Half-Life folder alone and the test demos opened from elsewhere, or with them in the folder:

| Change | Demo | Seen |
|---|---|---|
| The load card's first line and one-line title | SK vs Na`Vi, Train, DreamHack Winter 2011; the GP Tourney POV | "Ready: HLTV demo, 48 rounds (2D and 3D)"; "You are viewing a POV demo (3D only)" and the anti-wallhack line, the card open |
| The split-map note, no other part | Fnatic vs mousesports, Tuscan, ESWC 2011 (15:15); WeMadeFox vs Ravens, Nuke, EM4 finals, part 1, each from elsewhere | the one-line card, the note under **Details**, **Join parts…** opening the Join card's picker |
| The split-map note, part 2 in the folder | WeMadeFox vs Ravens, part 1 from the demo list | the full card, open, naming part 2, with **Join parts…** |
| The map switch | SK vs Na`Vi with D.maps set to 40 s and 75 s of de_dust2 | under **Details**, then on the card |
| A POV file without the player's view | the GP Tourney POV, `demoKindLine` with D.povOn off | "You are viewing a POV demo without the player's view (2D and 3D available)" |
| The header | the same demos | "HLTV demo · de_train · 103:25 · …", "POV demo · de_mirage_32 · 38:18 · …" |
| The Join card's verdict | Na`Vi vs SK, Inferno, ESWC 2011, 3 files; WeMadeFox vs Ravens, part 2 first | the verdict closed and open; 16:09, 17:40, 17:24 with its warning, **Use the recorded order** putting them back; part 2 first: one **Use the recorded order** and **Keep my order** |
| The Rounds tab's switch | SK vs Na`Vi | "Show 52 uncounted rounds" first, 48 rows off, 100 on |
| The start screen | the folder alone; a folder with no demos | the headline, step 2's two lines, no **More**; the no-demos message's new end |
| The bottom bar | SK vs Na`Vi at 1512x982 and 1138x640 | the group's middle within 0.01 px of the bar's, **Help** flush right, the speed list above its button |
| A kill with no player killer | SK vs Na`Vi, R48, Delpan's fall | Delpan followed, the kill marked, playing |
| A click on a timeline kill mark | SK vs Na`Vi from R31, RobbaN on edzie at R23 1:18; the GP Tourney POV, R7's first kill | the Kills tab on R23, the row marked, its details in view; in POV 3.97 s before, playing, nothing else |
| The Tab scoreboard and the start screen | SK vs Na`Vi with Tab held; the GP Tourney POV paused at 345.63 s | hidden over the start screen, back with the POV demo |
| The Rounds tab on opening | SK vs Na`Vi, the Kills tab last used | the Rounds tab |
| The POV round box over "ROULETTE" | the GP Tourney POV, R1 freeze 0:07, on main 0.26.31 and on the branch | the same on both: BAJRANG \|\| ROULETTE's name label in the 3D view, gone with **Names** off; in IDEAS.md |

## Sujan's look in Chrome, 20 Nov 2026: eight changes built, the checks not run yet

Sujan looked at the branch in Chrome on 20 Nov 2026 (review chat); everything else he checked passed. The eight changes are built from 95f5fe6 on (`DECISIONS.md`, 20 Nov 2026), pushed without running the checks, on his word. The checks were updated for them, none run: `demo_search_check.py` (the split-map note's words, a joined map's lines, the Join card's link and gold button, the remembered join's sizes, the same file twice, the Wall damage tooltip) and `theatre_test.py` (the Rounds tab's switch on one line each at Auto and at 200%). The checks they touch are the same ten as above, about 13 minutes with the new steps. `notes_check.py` passed before every commit.

### The same file twice under two names, before the fix (Sujan's question)

A copy of `2011-10-24_16h08_NaVi_SK-1110241609-de_inferno.dem` (Na`Vi vs SK, Inferno, ESWC 2011, the first file) as `NaVi_SK_inferno_copy.dem` in the session's scratch folder (not `cstrike`, not the hold-out folder), with the three real parts, in the Join card on 1d418f1's build (the Half-Life folder alone, the demos opened from elsewhere):

- The card: no warning. The copy's line "Starts from 0:0, 30 rounds, no winner"; the verdict "The files don't say which order they go in. Put the parts in order with the arrows." (the copy has no recording time in its name), no suggested order; behind it "Same map: de_inferno, same server", "Same 10 players, by Steam ID", "Teams swapped sides between parts 1 and 2" (a tick), and the same-sides notes for parts 3 and 4. **Join parts** on.
- In the order 16:09, copy, 17:24, 17:40: "In your order. The rounds agree."; joined: 47 live rounds, 22:25, a winner, the parts counting 30, 6, 6 and 5 rounds: the copy's first 6 rounds counted as overtime after the 15:15. The three real parts joined: 41 rounds, Natus Vincere 19 : 22 SK Gaming, parts counting 30, 6 and 5.

Whether the order check catches a part that starts from 0:0 after one that already played rounds (nothing built; IDEAS.md): not as such. `orderProblem` catches it only when part 1 starts late and a later part is fresh ("part N starts from 0:0 with the first half"), or through the sides: the map partway through a half with the teams on other sides in the next part, or at 15 rounds with the same sides. After a 15:15 part, a 0:0 part with the sides swapped reads as overtime starting, as above; with the same sides before a half's end it's a half replayed from 0:0 (0.26.19).

### Each change, looked at in the headless page

With a throwaway script (not one of the checks), with the Half-Life folder and the test demos in its clone, or the folder alone and the demos opened from elsewhere:

| Change | Demo | Seen |
|---|---|---|
| The split-map note, no other part | Fnatic vs mousesports, Tuscan, ESWC 2011; WeMadeFox vs Ravens, Nuke, EM4 finals, part 2 alone; Na`Vi vs SK's third file alone, then as if it had a winner | "This recording ends at 15:15 with no winner." and "…ends at 13:13 with no winner.", with "It may have been a draw, …"; "This recording starts partway through the map and ends with no winner." with the line on how it starts; "This recording starts partway through the map." |
| A joined map's note | WeMadeFox vs Ravens joined | "Part 1: …", "Part 2: …", "Split them in the Rounds tab." on three lines under **Details** |
| The Rounds tab's switch | Na`Vi vs FX, Dust2, SEC 2011 final, at 1512x982, 1440x900, 1920x1080, 1536x864 and 1707x960, each at Auto and at 200% (1.15, 1.1, 1.5, 1.2 and 1.3) | "Show 24 uncounted rounds" and "warmup, restarts and idle rounds, like time-outs" each on one line; the tooltip and Help the same words |
| The verdict's link | WeMadeFox vs Ravens | "Show 3 checks" at the verdict's right, then "Hide checks" |
| The gold **Use the recorded order** | WeMadeFox vs Ravens, part 2 first; Na`Vi vs SK, 16:09, 17:40, 17:24 | in the box, **Keep my order** and the gold **Use the recorded order**, the warning with its text only; no box, the warning's button gold |
| A remembered join | WeMadeFox vs Ravens joined, then part 1 opened again | the joined map; with part 2's remembered size changed, part 1 alone, the join forgotten, "This file was joined with … before. … has changed, so it opened on its own." on the open card; part 2 out of the folder list: "… isn't in your Half-Life folder now, …"; a join saved without sizes: "The viewer can't tell whether the parts have changed since, …" |
| The same file twice | the four Na`Vi vs SK files above; WeMadeFox part 1 and a copy made in the page | "Part 2 is the same recording as part 1, under another name" with **Remove part 2**, **Join parts** off; moved to part 4, "Part 4 is …"; removed, "In the order they were recorded: 16:09, 17:24, 17:40. The rounds agree." and **Join parts** on |

### The start screen, item 12's two fixups (Sujan, 20 Nov 2026)

Looked at in the headless page with a throwaway script, at 1512x982, 1440x900, 1920x1080, 1536x864 and 1707x960, each at Auto and at Interface size 200% (1.15, 1.1, 1.5, 1.2 and 1.3), before a folder is picked, with the Half-Life folder alone (no demos: "No demos found.") and with the test demos in its clone (79 demos), then the folder alone again:

| State | Headline | Step 2's bracket |
|---|---|---|
| No folder yet | full size (38 px at Auto, 57 px at 1920x1080 and 200%), two lines, nothing cut | one piece, beside "HLTV or POV demos both play" |
| Folder with no demos | the same full size as before the pick, at every size | one piece, moved whole to the next line (the button is **Open .dem from elsewhere** by then) |
| Folder with demos | one line, 20 px at Auto (30 px at 1920x1080 and 200%) | one piece, on the next line |
| The folder alone again | full size | one piece |

`start_screen_check.py` (the bracket at the five sizes) and `folder_row_test.py` (the headline in B1 and B5) were updated for them, not run.
