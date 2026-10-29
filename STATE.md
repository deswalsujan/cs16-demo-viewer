# State

What is open and what is decided, right now. Loaded into every session through `CLAUDE.md`. Full items: `IDEAS.md`; what shipped: `CHANGELOG.md`; current version: `VERSION`. When Sujan confirms or decides something, change its line here in the same turn (old answer to Superseded) and tick `IDEAS.md`.

## Open now
- **Sujan, by eye (0.23.0):** FX vs Lions, Nuke, DreamHack Winter 2010: R13 1:19 NIKO on LoordB reads LOOSE, R22 0:47 THREAT on LoordB strict; Wallbangs heading counts both.
- **Sujan, by eye (0.24.0):** k1ck vs eq, Nuke, DreamHack Winter 2011, R2 1:18, spekz on DECE: loose wallbang in light purple (LOOSE WB crosshair marker in **Player's eyes**, ring, kill line, timeline diamond, ✕ on the numbers, death banner); strict ones stay pink.
- **A claude.ai session:** republish https://claude.ai/artifact/KHjQXfeVe17XXPrqarFDrS from `dist/artifact.html` (it shows 0.23.0; Claude Code can't).
- **Claude, bug:** short names leave a bracket, "[fnaticMSI.cArn]" reads "cArn]" (fnatic vs Moscow Five, Nuke, DreamHack Summer 2011; `shortNames` in `src/template.html`).
- **Claude, next work item:** POV mode into main behind a **POV mode** setting (agent brief 6.5). Plan first, wait for Sujan's go.
- **Claude, later:** separate agent(s) review whether the UI can be simpler (give them the page and screenshots, not Claude's conclusions); tooltips on flagship features and confusing options, one look that reads as a tooltip (mockup first); feature names in **bold** in the viewer's own text.
- **Sujan, on Windows (POV):** open `pov/pov.html` on branch `wip/pov-mode`, any POV demo, top right after a kill: orange gun icon, headshot icon, no "m4a1" or "HS" words.
- **Sujan to decide (POV):** the hidden-enemies note is easy to miss (show it after the load summary closes, larger?); list a victim never sent to the recorder's game as "not seen on his screen" (would change the 5 Oct decision below).
- **Claude (POV):** aimbot catcher, not started. **See through walls** in POV works on what the server sent.
- **Parked:** POV gun animations weapon by weapon; POV voice and chat; a broken demo's load summary line (when one turns up); a warmup-only file showing one round (needs a new file); order of 3+ parts with no times in their names; load time of a big (145 MB) demo; on the move to sujandeswal.com, drop `noindex` and harden privacy.
- **Sujan, on GitHub:** delete `wip/denser-hidden-check` (abandoned, still on the remote at `99c7106`).
- **Roadmap next:** README Requirements list, then opening duels and trades.

## Decisions
- Wallbang levels: strict under 50 pixels of the victim in view, LOOSE from 50, still listed (Sujan, 25 Oct 2026, 0.23.0).
- Loose wallbang from damage: a killer's bullet only a surface explains, 0.5 s or less before the kill, same spray only (Sujan, 28 Oct 2026, 0.24.0).
- A bullet through another player isn't a wallbang (Sujan, 28 Oct 2026, 0.24.0).
- In demos that lose fire events, a hit matched by the killer's aim alone counts (Sujan, 28 Oct 2026, 0.24.0).
- Wallbang damage listed from 35 HP, hits in one burst when each is within 2 s of the last (Sujan, 23 and 25 Oct 2026, 0.24.0); "hits" are bullets other than headshots (Sujan, 26 Oct 2026, 0.24.0).
- Damage floats up beside the hit player's head, option C (Sujan, 26 Oct 2026, 0.24.0); killing bullet ends in a ✕, option A (Sujan, 27 Oct 2026, 0.24.0).
- **Glow on hits**: checkbox in **View settings**, on by default, glow at every hit through a wall, killing bullet included (Sujan, 26 Oct 2026, 0.24.0).
- Through a player's eyes or from behind him, only his own hits show numbers and glow; in Free view everyone's (Sujan, 26 Oct 2026, 0.24.0).
- 3D view runs 0.1 s behind kill feed, timers, sounds and radar, no switch (Sujan, 26 Oct 2026, 0.24.0).
- Crosshair sizes one step smaller; a saved size keeps its look (Sujan, 26 Oct 2026, 0.24.0).
- Loose wallbangs light purple everywhere they're marked, strict pink (Sujan, 28 Oct 2026, 0.24.0).
- C4 timer counts down from 0:35, holds 0:00 after the explosion, stops at a defuse; list times stay time since the plant (Sujan, 15 Oct 2026, 0.21.0).
- Round announcements as text in the centre, in 2D too, no mockup (Sujan, 5 Oct 2026, 0.17.0).
- Defusal kits and the carried bomb on 3D models and the Tab scoreboard, not the radar (Sujan, 5 Oct 2026, 0.17.0).
- Crosshair kill markers: option A, thin ticks past the crosshair's arms (Sujan, 5 Oct 2026, 0.17.0).
- No marker or message for kills the wallbang finder can't check (Sujan, 5 Oct 2026, POV branch).
- Unnamed teams read "Team 1" and "Team 2", click to rename; left as is (Sujan, 2 Oct 2026).
- Never host Valve's files; a "lite mode" from the project's own assets is an option for later (1 Oct 2026).
- POV mode goes into main behind a **POV mode** setting, off by default; on by default for POV demos once Sujan signs it off (Sujan, 29 Oct 2026, not built).
- A POV demo opens in POV mode by itself, in the same viewer (Sujan, 3 Oct 2026, POV branch).
- POV mode: no Free camera, no opponents' HP (teammates' stays), **See through walls** stays, no player numbers (Sujan, 3 Oct 2026, POV branch).
- POV crosshair at 70% of the game's size; spectator bars 40/480 each; hidden-enemies note as option B, above **See through walls** (Sujan, 4 Oct 2026, POV branch).
- One set of notes, on main; POV notes folded in from `wip/pov-mode` (29 Oct 2026).
- Mockup only when Sujan says yes to one (Sujan, 2 Oct 2026).
- Feature names in **bold**, capitalized as on screen, no quotes, in docs and the viewer's text (Sujan, 25 Oct 2026; viewer text still to do).
- Demos starting `PPG` or `GP` are ignored unless Sujan names one (Sujan, 3 Oct 2026).

## Superseded
- "No glow on wallbang kills in any case" (Claude's suggestion while planning wallbang damage, 23 to 26 Oct 2026), replaced 26 Oct 2026 by **Glow on hits** above.
- Wallbang dropped at 100 or more pixels in view (23 Oct 2026, 0.22.0), replaced 25 Oct 2026 by the strict/LOOSE split at 50 (0.23.0).
- Feature names in single quotes (Sujan, 5 Oct 2026), replaced 25 Oct 2026 by **bold**.
- POV work in a separate copy on `wip/pov-mode` until it works (Sujan, 3 Oct 2026), replaced 29 Oct 2026 by the **POV mode** setting on main.
- Notes kept on two branches, POV on `wip/pov-mode` (Sujan, 5 Oct 2026), replaced 29 Oct 2026 by one set on main.
- Always make a side-by-side image (before 2 Oct 2026), replaced 2 Oct 2026 by asking first.
