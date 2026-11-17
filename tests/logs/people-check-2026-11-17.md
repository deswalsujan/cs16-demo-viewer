# People joined wrongly, and wallbangs on skips (17 Nov 2026)

Two questions from Sujan on wip/ui-simpler, 17 Nov 2026, answered on the branch's build (ecf0658), the test demos in `~/code/cs16-data/test-demos` only. Neither changes the viewer. The IDEAS.md item: **Bug: walle and GeT_RiGhT joined into one person, mousesports vs SK, Nuke, Extreme Masters II**.

## mousesports vs SK, Nuke, Extreme Masters II

`mouz.SK.EM2.real-0803091025-de_nuke.dem` (event from the file name, `tests/DEMOS.md`). 30 live rounds, the first from demo 12:06. SK shows 4 players in the Players tab; "SK|GeT_RiGhT[TTFU]" reads 33-39. The connections the reader keeps for slots 10 and 11 (times are demo time; no connection in this demo has a Steam ID):

| Connection | Slot | On the server | Names, with when each was taken |
|---|---|---|---|
| 9 | 10 | 0:00 to 7:59.6 | "ESL Pro Series Player" at 0:00, "SK\|walle[TTFU]SK" at 3:29.3, "SK\|walle[TTFU]" at 3:34.0 |
| 10, 12, 15 | 11 | 0:00 to 4:40.7, in three | "Player" |
| 17 | 11 | 7:50.1 to 57:10.9 | "ESL Pro Series Player" at 7:50.1, "SK\|GeT_RiGhT[TFFU]" at 9:05.9, "SK\|GeT_RiGhT[TTFU]" at 10:10.0 |
| 18 | 10 | 8:30.4 to 57:23.6 | "SK\|walle[TTFU]" |

`group` in `src/ui/match.js`, run the second time with the names used in the live rounds:

1. "SK|walle[TTFU]": connection 18 used it in the live rounds, connection 9 only before them, so 9 joins 18.
2. "ESL Pro Series Player": connections 9 and 17 used it only before the live rounds. Such a name joins its connections when at most one of them played live; 9 never did and 17 did, so 17 joins 9, and with it 18.

So connections 9, 17 and 18 are one person, named by the name used most in the live rounds, GeT_RiGhT's. Connections 17 and 18 were on the server together from 8:30.4 to 57:10.9, which one person can't be. Slots 10 and 11 carry the name "SK|GeT_RiGhT[TTFU]" together for 2,060 s, 1,812 of them in the live rounds (both T at R4, 3 s in). The person dies twice in 17 of the 30 live rounds.

Where to fix it, when Sujan picks it up: the "at most one played live" rule looks at each connection, not at the person it already belongs to; and nothing stops a join of two connections on the server at the same time. "ESL Pro Series Player" is the ESL server's name for a new connection, as "Player" is the game's, but `placeholder` only matters for two Steam accounts, which this demo doesn't have.

## Every test demo: deaths and names

A script run on each of the 79 demos in `test-demos` (the sweep took 116 s, 6 at a time; every demo gave a result, no page error), in the viewer's own terms: a player is a person (`M.pl`), deaths and rounds as the Players tab counts them (`statsFor('all')`: live rounds only, a round counted for a player who is on a side 5 s into it), and the names as the view shows them, every second of the demo, over the slots on a team.

| Check | Demos that fail |
|---|---|
| A player with more deaths than the match has live rounds | 1: mousesports vs SK, Nuke, Extreme Masters II (GeT_RiGhT 39 in 30) |
| Two players with the same name at the same moment | 2: mousesports vs SK (slots 10 and 11, 2,060 s, 1,812 of them live); Burning vs FairFrag, Inferno, 2010 (`2010-07-01_15h58_-1007021005-de_inferno Burning vs FairFrag.dem`): "BURNING! Rara Qpad.se" on slots 7, 8 and 11 at once, 1,997 s of the live rounds |
| Either | 2 of 79 |

Burning vs FairFrag fails for the same reason. These connections have no real Steam ID ("0", a LAN server's). Rara (slot 7, from 14:25), MAJ3R (slot 8, from 17:09) and NTEP (slot 11, from 26:48) each first connected as "Player", before the live rounds (the first from 35:31). Only NTEP's connection played live with it, so the three joined, and their reconnections joined them by their own names. Rara reads 79-27 in 30 live rounds. Every slot in that demo has connections (checked the same day). This looks like the cause of IDEAS.md's **Burning vs FairFrag: two of Burning's players in no team**.

Checked against the rounds each player played (`rounds` in `statsFor`) instead of the match's live rounds, 5 more demos fail, all of them public-server POV demos: Match 1 CT (`match-1_de_barcelona-...`: 3 players), Match 2 CT and Match 2 T (1 each), Match 4 (`match-4-[PuB]_...`: 1) and Sujan's Korfez POV (`s-deswal-korfez-knd.dem`: 2, with 0 rounds counted and 1 death each). Each of them has a death in a round where he wasn't on a side 5 s in, when the viewer samples sides; most likely he joined during that round, as players do on public servers. None has more deaths than the match has live rounds, and none shares a name with another player. That's how `rounds` is counted, not a join; the Players tab doesn't show it.

## Every test demo: PARTIAL WALLBANG and UNSURE on one kill

The same run: for the 35 demos with a kill within 0.3 s of a skip in the recording (`skipNear`, what puts UNSURE on a wallbang), 337 such kills in all, the run waited for the 3D map and the picture check (every map loaded, every picture check finished), then read each such kill's tags from the Kills list's own row (`killRow3`).

- PARTIAL WALLBANG and UNSURE on one kill: 1. `roccat.estro.EMII.cebit-0803081202-de_inferno.dem`, R17 1:27 (demo 29:20), ROCCAT.ruuit on eSTRO : hee, m4a1, 28 pixels of him in view: roccat vs eSTRO, Inferno, Extreme Masters II, CeBIT (8 Mar 2008).
- WALLBANG and UNSURE: 24, 17 of them in live rounds, every one at 0 pixels.
