# Joined maps: a half replayed from 0:0, and a half carried on across a crash (7 Nov 2026)

Measurement for Sujan's bug report of 7 Nov 2026: WeMadeFox vs Ravens, Nuke, EM4 finals, joined from its two files, reads Ravens 16-9, and the real result is WeMadeFox 17-13. A measurement only: nothing is built (Sujan: "plan only, don't build"). On 0.26.18, Sujan's Mac, headless Chromium (`tests/harness.py`, `MAP_NEEDED=0` unless said), the 67 demos in `~/code/cs16-data/test-demos`. The open items: IDEAS.md, **WeMadeFox vs Ravens joined reads Ravens 16-9** and the two after it.

## What the two files hold

Times are each file's own, as 0.26.18 reads them (rounds, scoreboard by side, the admin's chat, where the restarts are). The admin's lines are "<IEM Global Finals #3>" in chat.

Part 1, `ravens.wmf.em4finals-1003030951-de_nuke.dem`:
- 15:46 to 15:48 three restarts, 15:52 the admin's "live". 12 rounds from 15:51 to 26:05, 6:6 on the scoreboard, Ravens on T. The admin at 20:20 "he is rebooing", 20:22 "rebooting", 20:26 "sound was dead", 25:17 "he's connecting", 26:13 "rdy?".
- 27:09 to 27:11 three restarts, 27:15 the admin's "live". One round from 0:0 (27:14, a Ravens win on T), then players' chat "admin, rs" and "rsrsrsrsrsrsrsrs" (27:57 to 28:07), and two restarts at 28:38 and 28:39.
- 28:42 to 31:37: 4 rounds from 0:0, all won by WeMadeFox on CT. 32:17 "Retrying HLTV connection ...", the file ends at 34:26.

Part 2, `ravens.wmf.em4finals-1003031026-de_nuke.dem`:
- 2:00 to 5:23: a round on a 0:5 scoreboard, then three Ravens wins on T from 0:0. The admin at 6:26 "rules say 5000 each if it crashes after round 4", 6:43 "yes", 6:58 "4-0 score stays". Two restarts at 7:21 and 7:24.
- 7:26 to 22:17: 11 rounds from 0:0 on the same sides, Ravens 6, WeMadeFox 5. 23:55: the side swap round (the server scores it, 6:6; not counted). 24:32 to 25:15 restarts.
- 25:18 to 42:09: the second half, 15 rounds, WeMadeFox 8 (on T), Ravens 7. 43:55 to 47:55: three rounds with no kills, after the match. No end-of-half message in either file.

So the map is 4 + 11 = 15 first-half rounds (WeMadeFox 9-6) and 15 second-half rounds (WeMadeFox 8-7): 17-13 with all 30 counted. WeMadeFox reaches 16 in the 29th round, so a viewer that stops at 16 reads 16-13, and **Count them** gives 17-13 (as fnatic vs EG, EM3 Global Finals 2009, 17:13).

Why the numbers alone can't decide: the stretches on the first half's sides are 12, 1 and 4 rounds in part 1 and 3 and 11 in part 2. Two sets of whole stretches ending in part 2's 11 make a half of 15: 4 + 11, and 1 + 3 + 11. Where the restarts and the file break fall has to decide.

## Why 0.26.18 reads Ravens 16-9

The admin's "live" at 15:52 opens one announced window, and nothing closes it, so every stretch of both files is judged inside it (`liveWindows`, `src/ui/wallbangs.js`). In `derive` (`src/ui/match.js`) a stretch followed by a restart in the same window is thrown away when it has fewer than 12 rounds. Part 1's 12 rounds (exactly 12) stay; its 1 and its 4 go; part 2's 3 go; part 2's 11, with the swap round still counted at that point, stay. Then the cut at the end of a half drops part 2's first-half rounds after its third (12 + 3 = 15), and the second half runs until Ravens reach 16 after 10 rounds: 9-16.

## The candidate rule

Inside the announced match only (the branch of `derive` that uses `liveWindows`):
1. Replay, in one file: a restart followed by play on the same sides, before the stretch reaches a half (15 rounds; 3 in overtime), replays the half: the stretch before it doesn't count. Today the same rule needs fewer than 12 rounds, whatever the sides; 12 is a whole half in MR12, but with the teams kept on the same sides it can't be one.
2. Carry, across files: when the next stretch is in a later file, on the same sides, and the stretch doesn't end at a half end (15, 30, then every 3 rounds of overtime), it counts: the later file carries on the half.
3. Check: a carried stretch and the rounds after it on the same sides must fit in that half. If they don't, the later file replayed the half and the carried rounds don't count.

The sides are compared at each stretch's first round: its last can be the swap round itself, with the players already on their new teams.

The variant measured (on `src/ui/match.js` of 0.26.18; built in a scratch copy, never on a branch):

```diff
   // "LIVE LIVE LIVE") when a half starts, "End of 1st set" or "half time" when it ends, and "Current
   // set canceled" when a start is thrown away. When the demo has these, a round counts only if it
   // started while the match was announced live; otherwise the guess from restarts below decides.
+  // VARIANT: the teams' sides at a round's start, for the replay and carry rules
+  const sideSetV = (r) => { const t = Math.min(r.start + 5, r.end), s = new Set(); for (const e in D.slots) { const a = D.slots[e]; if (Math.abs(a[idxAt(t) * S + 5]) === 1) s.add(personAt(+e, t)); } return s; };
+  const sameSidesV = (a, b) => { const x = sideSetV(a), y = sideSetV(b); let n = 0; for (const p of x) if (y.has(p)) n++; return n > Math.min(x.size, y.size) / 2; };
   const windows = liveWindows(D.notes || [], (D.parts || []).slice(1).map((p) => p.start));
   if (windows.length) {
     for (const r of rounds) r.live = counts(r) && windows.some(([a, b]) => r.start >= a - 10 && r.start < b - 1);
@@ -199,7 +202,19 @@
       // start at 11:48 was followed by "Warmup Settings have been loaded".)
       const w = winOf(rs[rs.length - 1]);
       const closedByEnd = w >= 0 && windows[w][2] === 'end';
-      if (next && (winOf(next) === w || !closedByEnd) && rs.length < (total >= 24 ? 3 : 12)) { for (const r of rs) r.live = false; continue; }
+      const sameWin = !!next && (winOf(next) === w || !closedByEnd);
+      const lastR = rs[rs.length - 1];
+      const crossPart = !!next && next.part !== lastR.part;
+      // the stretch's first round: its last can be the side swap itself, with the players already on their new teams
+      const same = !!next && sameSidesV(rs[0], next);
+      // VARIANT carry: the next stretch is in a later recording and picks up on the same sides
+      // (a stretch that ends at a half end, 15, 30 or every 3 rounds of overtime, is a whole half: overtime starts on the
+      // second half's sides, so the next recording picking up on them carries nothing)
+      const atHalfEnd = (x) => x === 15 || x === 30 || (x > 30 && (x - 30) % 3 === 0);
+      if (sameWin && crossPart && same && !atHalfEnd(total + rs.length)) { for (const r of rs) r.carry = true; total += rs.length; continue; }
+      // VARIANT replay: a restart in the same recording, the teams on the same sides, before the half is over
+      if (sameWin && !crossPart && same && rs.length < (total >= 24 ? 3 : 15)) { for (const r of rs) { r.live = false; r.replayed = true; } continue; }
+      if (sameWin && rs.length < (total >= 24 ? 3 : 12)) { for (const r of rs) r.live = false; continue; }
       total += rs.length;
     }
   } else if (D.pov) {
@@ -269,6 +284,23 @@
   // A round played between two recordings of a joined map (in neither file) counts when its part has live
   // rounds. It's in the stretch of the part's start, often not the one the part's live rounds are in.
   for (const r of rounds) if (r.missing) r.live = rounds.some((x) => x.part === r.part && x.live && !x.missing);
+  // VARIANT: a carried stretch and the rounds after it on the same sides must fit in one half; if they don't, the later
+  // recording replayed the half and the carried rounds don't count
+  {
+    const lr = rounds.filter((r) => r.live);
+    let pos = 0;
+    for (let i = 0; i < lr.length;) {
+      const r = lr[i];
+      if (!r.carry) { pos++; i++; continue; }
+      const segR = lr.filter((x) => x.seg === r.seg && x.carry);
+      let n = 0;
+      for (let j = i; j < lr.length && (lr[j].missing || sameSidesV(segR[0], lr[j])); j++) n++;
+      const halfEnd = pos < 15 ? 15 : pos < 30 ? 30 : 30 + 3 * (Math.floor((pos - 30) / 3) + 1);
+      if (pos + n > halfEnd) { for (const x of segR) { x.live = false; x.carry = false; x.replayed = true; } }
+      else pos += segR.length;
+      i += segR.length;
+    }
+  }
   // A stretch can't run past the end of a half when a restart and more play follow. Both Xperia Play FX vs mTw
   // matches played on for 5 (Inferno) and 6 (Nuke) rounds at 15:15 on the same sides, then the admins
   // restarted and played the overtime from its start. Half ends: 15, 30, then every 3 rounds of overtime.
```

Two first tries that went wrong, for whoever builds it:
- Sides compared at the stretch's last round: part 2's 11 first-half rounds were thrown away, since its last round is the swap round, where the players are already on their new teams 5 seconds in, so the stretch looked like a restart on the same sides.
- Carry also at a half end: Na`Vi vs SK, Inferno, ESWC 2011 went from 19:22 to 16:6. Its first file's second half ends at 15:15, and the first overtime in the second file starts on the same sides, as overtime does; the second half was carried, then read as a half too long and thrown away.

## Results

Scores, 0.26.18 and the candidate, every test demo opened alone (67): all the same score, live rounds and winners round by round, except part 1 of WeMadeFox vs Ravens alone: WeMadeFox 10:6 in 16 rounds, now 4:0 in 4. Part 2 alone reads 13:13 in 26 rounds on both (it has no announced window, so the guess from restarts counts it, and that part of `derive` doesn't change).

Every joined map (live rounds in brackets; Count them only where rounds came after 16):

| Map | 0.26.18 | Candidate |
|---|---|---|
| FX vs mTw, Inferno, Xperia Play 2011 (2 files) | mTw 19:17 FX (36) | the same |
| FX vs mTw, Nuke, Xperia Play 2011 (2 files) | mTw 19:22 FX (41) | the same |
| mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final (4 files) | Na`Vi 23:25 mTw (48) | the same |
| fnatic vs mousesports, Forge, IEM6 Guangzhou final (2 files) | fnatic 16:11 mousesports (27) | the same |
| Na`Vi vs SK, Inferno, ESWC 2011 (3 files) | Na`Vi 19:22 SK (41) | the same |
| WeMadeFox vs Ravens, Nuke, EM4 finals (2 files) | WeMadeFox 9:16 Ravens (25); Count them 14:16 (30) | WeMadeFox 16:13 Ravens (29), 9:6 at half time; Count them 17:13 (30) |
| WeMadeFox vs Ravens, part 2 put first | WeMadeFox 10:6 (16) | WeMadeFox 4:0 (4) |

Three more pairs were joined to see that nothing moves, none of them a confirmed map: Match 1 CT and T (public server, de_barcelona, 27 Mar 2025, POV), Match 2 T and CT (public server, de_mirage_32, POV) and Virtus.pro vs aTTaX's two Inferno files (Extreme Masters II): unchanged.

`ground_truth_check.py` on the candidate: PASS, 231 kills and 27 scores and K-D on 48 demos, 0 mismatches, 8 known gaps, 0 skipped (1.6 minutes): the same counts as 0.26.18.

WeMadeFox vs Ravens joined, with the 3D map and the picture check done: 16 wallbangs on 0.26.18, 26 on the candidate. One leaves (termi[EU] on Friis, M4A1, R6 on 0.26.18, in the 12 replayed rounds); 11 come in: 4 in part 1's 4 rounds, 4 in part 2's first-half rounds 0.26.18 cut as past the half (R9 twice, R10, R13), 3 in second-half rounds that came after Ravens' 16 on 0.26.18 (R26, R27, R28); 4 more are the same kills under a new round number or a new name (below). Damage bursts that didn't kill: 8 then 14.

## Found on the way, older than the change: three players counted as one

In part 1, alone and joined, SIA, bail and BERRY are one person on 0.26.18: "WemadeFOX : SIA" with 20-30 in part 1 alone and 22-58 joined, and BERRY isn't listed; part 2 alone has all 10 players. Their Steam IDs are real and all different (SIA ...9671062, bail ...7826679, BERRY ...0141954). The names join them (`group` in `derive`): in part 1's warmup SIA was "Player" and bail and BERRY "(1)Player", both in slot 5, and BERRY came back as "Player" at 25:53, during the live rounds, after his reboot. A name used in the live rounds joins every connection that used it, and a warmup name joins its connections when at most one of them played live, so all three end as one. On the candidate the 12 rounds stop counting, BERRY's "Player" is no longer in a live round, and the merge moves (bail 12-45 joined); still wrong. Two wallbang lines show it: "SIA on SIA" (R22 1:16, Galil) on 0.26.18 is "bail on bail" on the candidate. A fix to measure later: never join two connections by name when both have real Steam IDs and they differ (LAN servers where every ID is "0" aren't touched, since "0" identifies nobody).

## The Join card

With part 2 put first (by the arrows; the file names' times suggest part 1 first), the card says "Your order. The rounds agree." and shows the green "Teams swapped sides between the parts", and **Join them** gives WeMadeFox 10:6 (4:0 on the candidate). `orderProblem` (`src/ui/join.js`) checks only that the first part starts from 0:0 and that only the last part has a winner. `-1003031026-` starts from 0:0 after its 7:21 restart and ends at 13:13 with no winner, so it passes both; the sides line reports what it sees. The recording times (09:51 and 10:26) are named only inside "This order doesn't add up", which the rounds never open here.

Two checks from what the card already reads, tested on every order of the six joined maps above (the right order is the file names' times, and 1609, 1724, 1740 for Na`Vi vs SK):
- A: when the first part's teams change sides, it's after a whole half (15 rounds, or 12 for MR12); otherwise its first half began in an earlier file.
- B: where the teams are on other sides from one part to the next, the parts before end at a half end (15, 30 or every 3 rounds of overtime; 12, 24 and every 3 after for MR12); where they're on the same sides, not at 15 or 12.

| Map | Right order | Wrong orders | Caught today | With A and B | With the times too |
|---|---|---|---|---|---|
| FX vs mTw, Inferno | passes A and B | 1 | 1 | 1 | 1 |
| FX vs mTw, Nuke | passes | 1 | 0 | 1 (A: sides change after 18 rounds; B: other sides after 26) | 1 |
| mTw vs Na`Vi, Tuscan (4 files) | passes | 23 | 6 | 18 | 23 |
| fnatic vs mousesports, Forge | passes | 1 | 0 | 0 (part 2 holds 12 rounds, a whole MR12 half) | 1 |
| Na`Vi vs SK, Inferno (3 files) | passes | 5 | 4 | 4 | 4 |
| WeMadeFox vs Ravens | passes | 1 | 0 | 1 (A: sides change after 11 rounds; B: other sides after 26) | 1 |

The same on 0.26.18's counting and the candidate's. The 5 Tuscan orders left after A and B swap the three overtime files among themselves (6 rounds each, the sides changing at every join): only the times tell them apart. The Na`Vi vs SK order nothing catches is 1609, 1740, 1724, the one the card suggests today: `fileTime` reads "2011-10-24_16h08", the same at the start of all three names, never the 1609, 1724 and 1740 later in them (IDEAS.md, **A file that starts during a round**).

## How it was measured

Scratch page scripts, run through `tests/harness.py` with a first script that sets `window.__names` (the 67 file names in `~/code/cs16-data/test-demos`) and `window.__joins` (the parts of each joined map, in order):
- Every demo alone and every joined map: each file read in a worker (`parseInWorker`), counted with `derive`, joined with `joinDemos` after `partFacts` (as `openJoined` does, without opening the map); score, live rounds, the score after 15, the winners round by round, and Count them where there are rounds after 16. 40 seconds a page, 0.26.18 and the candidate side by side.
- The Join card: `partFacts` for each part, then for every order of the parts `orderProblem`, the sides from one part to the next, checks A and B, and whether the order follows the times.
- WeMadeFox vs Ravens with the map: `openJoined`, then waiting for the picture check as `tests/page/regress_summary.js` does; wallbangs, damage bursts, K-D. The people list: each person's connections (slot, Steam ID, names) on 0.26.18.
