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
