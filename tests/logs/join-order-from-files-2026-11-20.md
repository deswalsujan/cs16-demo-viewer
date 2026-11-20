# Ordering a map's parts from inside the files: measured, not built (20 Nov 2026)

Not built (Sujan, 20 Nov 2026, on the report): every split test map has recording times in its names, so the rule below would change nothing on them, and a server restart can make counts look consecutive in the wrong order (part 1 at count 3, a restart, a default map, then the match map at count 2). Kept for later, measured (IDEAS.md, **Parts ordered from inside the files**; `DECISIONS.md`).

The Join batch's item 2 (IDEAS.md, **The Join batch after wip/ui-simpler**; Sujan's brief of 20 Nov 2026): for each part of every map in the test demos recorded in parts, the spawn count, the first and last svc_time in the playback part, the demo's own time at each, and the HLTV print line, with where in the file each is. Read with a copy of `src/demo.js` that logs those messages (in the session's scratch folder, not in the repo), on `~/code/cs16-data/test-demos` only; nothing in `src/` reads them yet.

What the review chat found in ReHLDS (a rebuild; the test demos were made by Valve's closed HLTV, so the files decide), as given in the brief: the HLTV proxy writes the game server's spawn count into its own serverinfo unchanged and prints "Protocol Version %i, Spawn count %i (HLTV)" just before it; the game server's count is `++gHostSpawnCount` at each map load and starts at 0 when the server program starts; svc_time in an HLTV demo with a delay is the proxy's own clock, set to 0 when the proxy starts a new game (a new map, or the proxy reconnecting), stopped while paused.

## The values

Times in seconds. "First" and "last" are the first and last svc_time in the playback part; the demo's own time at the first is 0 (±0.003) in every file, and at the last it is the file's last frame (the demo time column). Every file has the print line "Protocol Version 4x, Spawn count N (HLTV)" with the same N as its serverinfo.

| Map (event) | Part (file name's time) | Spawn count | First svc_time | Last svc_time | Demo time at the last |
|---|---|---|---|---|---|
| Na`Vi vs SK, Inferno, ESWC 2011 | 1609 | 10 | 2396.0 | 6472.5 | 4115.7 |
| | 1724 | 15 | 90.1 | 781.4 | 736.5 |
| | 1740 | 21 | 90.1 | 966.2 | 883.1 |
| WeMadeFox vs Ravens, Nuke, EM4 finals | 0951 | 7 | 953.0 | 2913.3 | 2057.3 |
| | 1026 | 7 | 90.0 | 3036.1 | 3071.2 |
| FX vs mTw, Inferno, Xperia Play 2011 | 0025 | 12 | 90.0 | 2724.7 | 2742.0 |
| | 0112 | 13 | 90.1 | 2673.5 | 2583.4 |
| FX vs mTw, Nuke, Xperia Play 2011 | 0212 | 15 | 90.1 | 1780.0 | 1706.7 |
| | 0242 | 16 | 90.1 | 4360.4 | 4270.4 |
| fnatic vs mousesports, Forge, IEM6 Guangzhou | 2145 | 7 | 4.4 | 1504.4 | 1493.5 |
| | 2211 | 2 | 4.3 | 1231.1 | 1389.1 |
| mousesports vs mTw, Inferno, IEM4 | 1349 | 3 | 709.0 | 2074.3 | 1425.3 |
| | 1512 | 3 | 90.0 | 3661.7 | 3866.0 |
| mTw vs Na`Vi, Tuscan, ESWC 2010 | 1530 | 81 | 90.0 | 3225.8 | 3280.2 |
| | 1625 | 82 | 90.0 | 1187.8 | 1198.2 |
| | 1645 | 83 | 90.0 | 598.3 | 598.4 |
| | 1655 | 84 | 90.0 | 906.6 | 911.6 |

Inside each file the clock rises, apart from four steps back of 0.01 to 0.04 s (Na`Vi vs SK 1609, WeMadeFox vs Ravens 1026, Tuscan 1530 twice, Virtus.pro vs aTTaX 2033 twice): jitter, not a reset. It runs slower than the demo's time where the server paused (WeMadeFox vs Ravens 0951: 1,960 s of clock in 2,057 s of demo).

Other test demos with more than one file on a map, read the same way, none of them a joined map in `tests/expected/`:
- Virtus.pro vs aTTaX, Inferno, Extreme Masters II (`virtus.attax.EMII-`): 1948 count 2, 2609.0 to 4102.6; 2033 count 2, 90.0 to 5663.6; their Train files 2013 and 2031 count 1 each, so HLTV watched another server in between and came back to the same map load. The Join card refuses that order ("Part 1 starts with 13 rounds already on the scoreboard, and part 2 starts from 0:0 with the first half") and both files end with a winner: two matches on one map load, not two parts. The same spawn count doesn't mean the same map game.
- SK vs eSTRO, WCG 2008 (`SK_vs_e-STRO_WCG2008-`): counts 8 to 14, one per file in time order (1854 Dust2, 1859 and 1900 Train, 1945 Nuke, 1949 and 1950 Dust2, 2043 Nuke); the short files are warmups or one team alone (`tests/DEMOS.md`).

## Does the same count and a rising clock give the right order?

On none of the 7 joined maps directly: no two parts of a map have the same count and a clock that runs on from one to the next.

- **The counts rise** (4 maps): Na`Vi vs SK 10, 15, 21; FX vs mTw Inferno 12, 13 and Nuke 15, 16; Tuscan 81, 82, 83, 84. The server loaded the map again between parts (each new load makes a new HLTV file), so the clocks all start again at 90, the HLTV delay. Ordering by count gives the right order on all four.
- **The same count, the clock back at its start** (2 maps): WeMadeFox vs Ravens 7 and 7, the clock 953 to 2913, then 90 to 3036; mousesports vs mTw 3 and 3, 709 to 2074, then 90 to 3662. The map wasn't loaded again, but the proxy started a new game between them (it reconnected), so its clock started again. The clock can't say which of two proxy games came first: a part that starts at 90 began a proxy game, one that starts higher began partway into one, and either can come first. Here the later part is the one at 90 in both. (So WeMadeFox vs Ravens' game server most likely didn't restart between its parts, where `tests/DEMOS.md` said "the server crashed": after a restart its count starts again from 0, and it would have had to load maps exactly 7 times again. Part 1 ends with "Retrying HLTV connection ..." from 32:17 to 34:11, and in part 2 the admin applies his crash rule, "rules say 5000 each if it crashes after round 4" at 6:26 and "4-0 score stays" at 6:58; what broke in the game isn't in the files. `tests/DEMOS.md` says so since 20 Nov 2026, Sujan's answer.)
- **The count lower in the later part** (1 map): Forge 7, then 2. The game server restarted between the parts (its count starts again at 0 when the program starts), so the higher count is the earlier part. Ordering by count gives the wrong order, and nothing else in the two files tells: both clocks start at about 4.4 (a new proxy game each), and the rounds allow both orders (`LIMITS.md`).

A count can't tell a restart from an ordinary earlier load: 2 then 7 (two loads more) and 7 then 2 (a restart) look the same. Consecutive counts (each part one more than the one before) are the strongest case: one map load per part, nothing in between; Tuscan and both FX vs mTw maps have them, Na`Vi vs SK doesn't (10, 15, 21).

## How much of each file is needed

- The spawn count: byte 1,065 (the print line) to 1,085 (serverinfo) in all 27 files read, in the loading part.
- The first svc_time of the playback part: between byte 31,556 and 40,626 from the start (after the loading part's resource lists and baselines). So 64 KB from the start holds both; `quickInfo` reads 4 MB.
- The last svc_time: 759 to 1,963 bytes before the end, but a frame can only be found by walking the frames from the start (each frame's header gives its length, the messages can be skipped), or from the full read the Join card already does for every part. The playback part's length in the file's index (its last 188 bytes) gives the demo's time, not the clock's, which stops in pauses (97 s apart on WeMadeFox vs Ravens 0951).

## The rule proposed (not built; Sujan's go first)

Third in trust, after the recording times in the file names and the rounds when only one order fits, and only among the orders the rounds allow:

1. **Consecutive counts**: that order. Example: mTw vs Na`Vi, Tuscan, ESWC 2010, 81, 82, 83, 84: the overtime files the rounds can't put in order among themselves (`LIMITS.md`) would be ordered with no times in their names.
2. **The same count, the clock running on** (one part's first svc_time after the other's last): that order. No test map has this; it's a recording stopped and started again on the same proxy game.
3. **The same count, the clock back at its start**: no order from the files; the rounds decide, as they do for WeMadeFox vs Ravens (part 2 first fails check A) and mousesports vs mTw.
4. **Other different counts** (not consecutive): no order from the files, since a server restart between the parts reverses them. Example: Forge, 7 then 2, which the counts would get wrong; Na`Vi vs SK, 10, 15, 21, which the rounds already order (only part 1 starts from 0:0, only part 3 has a winner).

The verdict line would say what the order comes from, as it does for the names and the rounds. Reading the count and the first clock needs the first 64 KB of each file, so `findOtherParts` could use it too; the last clock needs the Join card's full read.
