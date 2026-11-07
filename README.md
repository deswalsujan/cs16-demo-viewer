# Screenshots for 0.26.19 (a half replayed from 0:0, a half carried on across a crash)

Pictures shown in the pull request for 0.26.19. This branch is never merged into main and never deleted, since the pull request shows its pictures from here (`AGENTS.md`, "How each change ships").

The "before" pictures (`*-0.26.18.jpg`) come from 0.26.18, main at `4932f5c`; the "after" pictures (`*-0.26.19.jpg`) from the pull request's build. Headless Chromium with SwiftShader, at 1x, Interface size Auto (100% at 1512x982, 130% at 2560x1440), 7 Nov 2026:

- `card-*`: WeMadeFox vs Ravens, Nuke, EM4 finals, part 1 open, **Join the parts** with both files in the suggested order. 0.26.18: part 1 "16 rounds, ends at WeMadeFox 10 : 6 Ravens", part 2 "Starts from 0:0", "8 of the same 10 players". 0.26.19: the approved words (`docs/join-replay-carry-mock.png`, Sujan, 7 Nov 2026), "Carries on at WeMadeFox 4 : 0 Ravens, 26 rounds, no winner.", **Part 2 carries on part 1's half**, the same 10 players. Retaken 7 Nov 2026 after Sujan dropped "after the crash" from that line before the merge.
- `wrong-*`: the same with part 2 moved first. 0.26.18: "Your order. The rounds agree." and a green tick; 0.26.19: "This order doesn't add up" (check A), the recording times named, no green tick, **Join them** off.
- `rounds-*`: the two files joined, the Rounds tab with **Show warmup, restarts and idle rounds** on, around part 1's R1. 0.26.18: the 12 replayed rounds counted; 0.26.19: "replayed from 0:0" before their result, R1 to R4 the 4-0.
- `navi-*`: Na`Vi vs SK, Inferno, ESWC 2011, **Join the parts** with its three files: 0.26.18 suggests 1609, 1740, 1724 ("at 16:08, at 16:08 and at 16:08"); 0.26.19 suggests 1609, 1724, 1740 from the times later in the names.

Measurements: `tests/logs/0.26.19.md` on main.
