# The scope after a quick-switch, his own gun's sounds in POV mode, and the score as the game showed it (28 Nov 2026)

Sujan's brief of 28 Nov 2026, after 0.28.2 (#75) merged: four items, investigated and reported, nothing built until he approves. Run on the Mac (Apple M5), Chrome headless (Playwright) through `tests/harness.py`, on main at 0.28.2, `HALF_LIFE_DIR=~/code/cs16-data/Half-Life`, `DEMO_DIRS=~/code/cs16-data/test-demos`. Two measurements needed values the reader doesn't keep (the AWP fire event's spread, every TeamScore message with its time); they ran on a copy of the built page with three lines added to the reader, made in a scratch folder, not in the repo. ReGameDLL read on GitHub (s1lentq/ReGameDLL_CS, master): `wpn_awp.cpp`, `wpn_scout.cpp`, `wpn_usp.cpp`, `wpn_knife.cpp`, `weapons.cpp`, `weapons.h`, `cbase.cpp`, `player.cpp`.

## 1. The AWP scope stays open after a quick-switch (SK vs Na`Vi, Train, DreamHack Winter 2011)

`sk-vs-navi-dhwinter2011-1111261019-de_train.dem`, R25 0:46 to 0:27 (demo 47:58 to 48:21), markeloff (slot 13) in **Player's eyes**. Sujan, 28 Nov 2026, from markeloff's own POV on YouTube (39:18 in https://www.youtube.com/watch?v=hWORUXhxSYM): he fired the AWP and quick-switched (weapon away and back) to skip the rechamber, so in the game his scope closed at the shot and stayed closed until he scoped in again.

### How the viewer decides (`buildZoom`, `src/ui/lookups.js`, since 0.10.0)
HLTV demos carry no zoom for the players (the only SetFOV messages are the HLTV's own, 0.10.0). The viewer rebuilds it from what the demo has: each `weapons/zoom.wav` click by the player steps none, 1x, 2x, none; an AWP or Scout fire event closes the scope 0.1 s after the shot and opens it again by itself at the same level once the bolt has cycled (AWP 1.45 s, Scout 1.25 s); a weapon model change in a snapshot, death and a new round close it.

### What the game does (ReGameDLL)
- `CAWP::AWPFire`: a shot while zoomed sets `m_bResumeZoom`, keeps the level in `m_iLastZoom` and sets the view back to 90; the next shot and the next right-click both wait 1.45 s.
- `CBasePlayerWeapon::ItemPostFrame`: once the next shot is allowed, the zoom comes back to `m_iLastZoom` by itself. So the scope coming back after the bolt is the game's own rule, and players fire again from it without a new click.
- `DefaultDeploy` (any weapon drawn): the view back to 90, `m_iLastZoom` 90, `m_bResumeZoom` false. A quick-switch cancels the coming back.
- `CAWP::GetMaxSpeed`: 210 unscoped, 150 scoped (Scout 260 and 220, G3SG1 and SG550 210 and 150, `weapons.h`).
- Drawing the USP plays no sound the server sends (`CUSP::Deploy` is `DefaultDeploy` only); drawing the knife does (`CKnife::Deploy`, `weapons/knife_deploy1.wav`).

### What the demo carries at R25
| demo time | round clock | what |
|---|---|---|
| 2880.258 | 0:48 | zoom click (1x) |
| 2880.657 | 0:47 | AWP fire event; scope closed at 2880.757 |
| 2882.107 | 0:46 | (the viewer: scope back at 1x, the bolt's 1.45 s) |
| 2882.278 | 0:46 | zoom click (the viewer: 1x to 2x) |
| 2882.377 | 0:46 | AWP fire event; scope closed at 2882.477 |
| 2883.827 | 0:44 | (the viewer: scope back at 2x, with no click) |
| 2883.8 to 2899 | 0:44 to 0:29 | no zoom click, no shot, no weapon change; he runs, 1-s averages 136 to 214 units/s |
| 2901.242 | 0:27 | killed by slot 3 (AK-47) |

Every snapshot from 2882.075 to 2884.098 (21 of them, about 10 a second in this demo) has `p_awp.mdl` in his hands: the switch away and back fell between two snapshots, so the demo has no trace of it. No `knife_deploy1.wav` from him either, so it wasn't the knife; his last other weapon was the USP (seen at 0:56 for half a second, after his 0:56 shot), and the USP's draw is silent. Nothing in the demo is about his zoom besides the clicks.

Why the viewer keeps the scope open: it applies the game's coming-back rule at 0:44 and sees nothing that cancels it until his death. His speed says the game had him unscoped: over 0:40 to 0:34 he moves at 205 to 224 units/s on the ground, which only an unscoped AWP reaches (210; the snapshots' timing reads about 3 to 5% high: 210 to 219 at 1:38 to 1:35 with the AWP unscoped, 255 to 262 with the knife's 250).

### Sujan's proposed rule against the demos
The rule: every AWP and Scout shot closes the scope, any weapon change closes it, and it opens again only on a zoom click. To check it, the AWP fire event's two float values: `FireBullets3` (`cbase.cpp`) returns x·spread and y·spread, x and y each between -1 and 1, and `AWPFire` sends them in the event. Standing or ducking the spread is 0.001 or 0 scoped and 0.081 or 0.08 unscoped (`CAWP::PrimaryAttack`, `AWPFire` adds 0.08 unscoped). The demo stores them to 0.01, so a scoped shot fired standing or ducking reads exactly 0, and an unscoped one reads 0 about 1.5 times in 100 (both values under 0.005). A 0 is taken as a shot proven scoped; a wider one can be scoped while moving, so it isn't counted.

| demo (event) | AWP shots proven scoped | scoped today | scoped, Sujan's rule | scoped, speed rule |
|---|---|---|---|---|
| SK vs Na`Vi, Train, DreamHack Winter 2011 | 158 | 129 | 111 | 131 |
| Na`Vi vs FX, Dust2, SEC 2011 final | 32 | 30 | 27 | 30 |
| Fnatic vs mousesports, Tuscan, ESWC 2011 | 97 | 92 | 72 | 92 |
| SK vs Na`Vi, Dust2, IEM4 (`auto-1003031508`) | 105 | 102 | 80 | 102 |
| SK Gaming vs mTw, Tuscan, WCG 2008 final | 5 | 5 | 5 | 5 |
| emuLate vs Amazing Gaming, Dust2, WCG 2007 | 15 | 12 | 12 | 14 |
| Norway vs Romania, Tuscan, 12 Feb 2009 | 51 | 47 | 42 | 47 |
| Sweden vs Poland, Nuke, 8 Apr 2009 | 8 | 8 | 8 | 8 |
| mTw vs Lions, Nuke, DreamHack Summer 2011 | 14 | 9 | 9 | 9 |
| Team Belgium vs France, Tuscan, ClanBase NationsCup XII | 28 | 27 | 25 | 27 |
| Na`Vi vs fnatic, Tuscan, Adepto BH Open 2011 | 22 | 21 | 17 | 21 |
| total, 11 of the 88 test demos | 535 | 482 | 408 | 486 |

Sujan's rule shows 74 of today's 482 proven-scoped shots unscoped (15%): each was fired from a scope that came back by itself after the bolt, as the game does, with no new click (on Train, Delpan at R11 1:12 to 1:01: six AWP shots in a row, each read 0, with no click between them). At R25 it closes markeloff's scope from the 0:46 shot, as the game had it.

The speed rule keeps the coming back, and cancels it when the player then moves on the ground faster than his gun allows scoped: over half a second, the same gun in every snapshot, height within 6 units, more than 12% over the scoped top speed (AWP, G3SG1, SG550 above 168 units/s; Scout above 246), the half second starting at least 0.25 s after the scope opened (he slows down after scoping in). A scope that came back by itself is then taken as never having come back (the quick-switch the snapshots missed); a clicked scope closes from the start of that half second. It keeps all 482 and adds 4 proven-scoped shots that today's rule has unscoped (the next click counted from no zoom). At R25 it closes markeloff's scope from the 0:46 shot, as Sujan's rule does. It doesn't catch R25 1:02 to 0:57 (the same pattern after his 1:04 kill: 1x shown while he runs at 178 to 213 units/s), most likely because the height test drops his windows on Train's slopes; tuning for the build. A quick-switch followed by standing still has no speed to show it, so the scope would stay open there until his next click, shot or visible switch.

The sweep ran on 11 demos (44 s for 10); all 88 test demos would take about 7 minutes, asked before running.

Found along the way, for later: 49 of the 535 proven-scoped shots read unscoped today, with any rule (no click the viewer counts before them); not looked into.

## 2. His own Glock's reload sound in POV mode

- In all 9 POV test demos the server sends no sound for the recorder's own reloads, for any gun: his game plays them itself, from the gun model's animation (studio event 5004). Sounds on his own slot are only `knife_deploy1`, `gunpickup2`, `ammopickup2`, `kevlar`, hits, deaths, `dryfire_rifle`, `zoom` and the like.
- The viewer plays the server's sounds, the fire events' gunshots, his own shots (from CurWeapon) and the radio; it plays none of a gun model's own sounds. So in **POV mode** his reloads are silent for every gun, as are his draws and silencer on and off; the Glock isn't a special case.
- `v_glock18.mdl` (his Half-Life folder): `reload` (sequence 7, 35 fps) has `weapons/clipout1.wav` at frame 16, `clipin1.wav` at 48 and `sliderelease1.wav` at 62; `reload2` (12, 30 fps) the same at 11, 32 and 43; `draw` and `draw2` have `slideback1.wav`. The other guns' models have their own (USP: `usp_clipout`, `usp_clipin`, `usp_sliderelease`, `de_deploy`, `usp_slideback`, the silencer's; M4A1: `m4a1_clipout`, `m4a1_clipin`, `m4a1_boltpull`, `m4a1_deploy`, the silencer's; AK-47: `ak47_clipout`, `ak47_clipin`, `ak47_boltpull`).
- His Glock reloads are in the test demos, with the reload animations written by his game (demo frame type 7: sequences 12 and 7): Match 2, T file (`match-2_de_mirage_32[Ts]_27-03-2025_14.23.27.dem`, public server, 27 Mar 2025), 4 reloads, the first at demo 1:07; Match 5 (`match-5-[PuB]_M-[de_nuke32]_D-[08_25_2021]_T-[22_09].dem`, public server, 25 Aug 2021), 3. His demo isn't needed.
- Other players' reloads near him: the server sends each player within 512 units a ReloadSound message (`CBasePlayerWeapon::ReloadSound`, `weapons.cpp`; the demos register it); the viewer doesn't read it. Not looked into further.

## 3. The score as the game showed it

`TeamScore` messages in SK vs Na`Vi, Train, DreamHack Winter 2011: 258, by side (CT and TERRORIST), sent at each round's end and at every restart. The server's score goes back to 0 : 0 at halftime and at the start of each overtime half: R16, R31, R34, R37, R40, R43 and R46 all start at CT 0 : T 0 (the demo has three overtimes, MR3 each, R31 to R48). Rounds the viewer doesn't count carry their own values (the round after R15, CT 11 : T 5 at demo 2096.5; the stretch between R36 and R37, up to T 6 : CT 5), which the game showed then.

| moment | header today | top bar today | Tab today | what the game showed (TeamScore) |
|---|---|---|---|---|
| R16 1:35 (demo 35:40), SK on T | hidden while the bars are up | CT 5, T 10 | SK Gaming · Terrorists 10, Natus Vincere · Counter-Terrorists 5 | CT 0, T 0 |
| R31 (OT) 1:34 (demo 58:12), SK on CT | hidden | CT 15, T 15 | SK Gaming 15, Natus Vincere 15 | CT 0, T 0 |
| R32 (OT) 1:41 (demo 60:00), SK on CT | hidden | CT 16, T 15 | SK Gaming 16, Natus Vincere 15 | CT 1, T 0 |

The header's score is today's match score (10 : 5, 15 : 15, 16 : 15), hidden by `#score.bars` while the bars are up (0.28.0). Screenshots of the three moments (1440x900, **Player's eyes** on markeloff, Tab held) were sent in chat.

## 4. The Glock's burst sound
No change (Sujan, 28 Nov 2026): one shot sound per burst, as decided on 27 Nov 2026.
