# The players' settings in the test demos: a report (20 Nov 2026)

Sujan's request of 20 Nov 2026 (`DECISIONS.md`; IDEAS.md, **Players' and the server's settings from the demo**): a spreadsheet of every player setting the demos hold, to see what players used on LAN and online. Nothing in the viewer; Sujan decides after seeing it. The spreadsheet is `~/code/cs16-data/reports/player-settings-2026-11-20.xlsx`, outside the repo and never committed. This page has the findings only: the network settings with their values, every other userinfo key by name only. No password value is in the spreadsheet, here or in any message (five demos carry an admin's `password` key, all on the HLTV proxy's or a spectator's slot, which the spreadsheet leaves out).

## How it was made

All 83 test demos (`DEMO_DIRS`, the four of 20 Nov 2026 among them), on Sujan's go of 20 Nov 2026, in 2.5 minutes: a copy of `src/demo.js` in the session's scratch folder that logs every svc_updateuserinfo, svc_pings, svc_newmovevars, svc_stufftext and printed cvar change, the values of keys other than the five network settings dropped in that script (25 s); then the viewer itself (0.27.4, `harness.py`, no map) for each person and the team it puts him in (126 s). A row is one player in one demo: the people the viewer puts in the two teams; the HLTV slot and spectators are left out. 1,076 player rows.

Sheets: **Players** (demo file, event from `tests/DEMOS.md`, date from the file name, LAN or online, team, player, `rate`, `cl_updaterate`, `cl_lw`, `cl_lc`, `cl_dlmax`, every change during the match with its demo time, the other setinfo keys by name, ping median, worst, spread (worst minus best), loss median, number of ping readings); **Demos** (event, date, LAN or online and why, what the event in `tests/DEMOS.md` says, the movement settings, every server cvar change announced, HLTV's snapshots a second, the ex_interp line); **Summary** (for LAN, online and not known, how many players used each value of `rate`, `cl_updaterate`, `cl_lw` and `cl_lc`, all years and by year, by the value each player started the match with).

## LAN or online

From the pings, per demo, by each player's median ping alone (Sujan, 20 Nov 2026, replacing his first rule, which also wanted each player's ping steady: spikes happen on LAN too): LAN when nearly every player's median is 15 ms or less, measured as at least 80% of the players with 5 ping readings or more; online otherwise. **64 demos LAN, 13 online, 6 not known.**

- Not known (too few ping readings: HLTV sent svc_pings only a few times in these files, 0 to 19 a player): fnatic vs mousesports, Tuscan, ESWC 2011; AGAiN vs Na`Vi, Train, probably ESWC 2011; fnatic vs ALTERNATE aTTaX, Nuke, ESWC 2011; SK vs eSTRO, WCG 2008's warmup files 1859 and 1949; Virtus.pro vs aTTaX, Train, Extreme Masters II (2031).
- Online: the four ClanBase NationsCup and ASUS ENC demos (BIH vs SLOVENIA, medians 15 to 44 ms; Team Belgium vs France, 8 to 42; Sweden vs Ukraine, NationsCup XI, 38 to 87; Sweden vs Norway, ASUS ENC 2010, 10 to 24), the GP Tourney POV (3 to 53), the eight POV demos on public servers (4 to 136).
- **Where the pings and `tests/DEMOS.md`'s event disagree**: none. fnatic vs EG, Dust2, EM3 Global Finals 2009 (6 Mar 2009, a LAN final), all 10 players at medians of 3 to 4 ms, read online under the first rule, since 3 of them had spikes (their 5th to 95th percentile more than 15 ms apart); by the medians it reads LAN.
- Where `tests/DEMOS.md` doesn't say whether the event was on LAN (no event word the reading knows): ASUS ENC 2010 (online by the pings); Arbalet Cup Europe 2009 (both demos LAN by the pings); Adepto BH Open 2011 final (LAN); Xperia Play 2011 (all four FX vs mTw files LAN); NoA vs Pentagram, Train, 2006 (LAN). The event words read as LAN: ESWC, IEM and Intel Extreme Masters, Extreme Masters and EM3/EM4, CeBIT, DreamHack, WCG, CPL, e-Stars, GameGune, IOL Final4, SEC 2011, MSI Beat IT; as online: ClanBase, NationsCup, public server, the GP Tourney.

## What players used

**LAN** (630 players, 64 demos; medians 1 to 18 ms, 3 at the median):
- `rate`: 25000 for 435, 30000 for 143, 20000 for 42, 7500 for 5, 1048576 for 3, 10000 for 2.
- `cl_updaterate`: 101 for 587, 100 for 43.
- `cl_lw` 1 and `cl_lc` 1 for all 630.
- `cl_dlmax`: 128 for 559, 80 for 46, 96 for 16, a few others.
- By year: `rate` 25000 throughout (all 20 players in 2006, 88 of 100 in 2008, 34 of 50 in 2009, 171 of 220 in 2011); 30000 grows in 2010 (85 of 220 players, then 32 of 220 in 2011); `cl_updaterate` 101 nearly everywhere, 100 for 20 of 50 in 2009 and fewer after.

**Online, tournaments** (ClanBase NationsCup XI and XII, ASUS ENC 2010, the GP Tourney; 68 players, 5 demos; medians 3 to 87 ms, 19 at the median): `rate` 25000 for 32, 20000 for 6, 30000 for 2; `cl_updaterate` 101 for 36, 100 for 4; `cl_lw` and `cl_lc` 1 for all 40 who send them. The GP Tourney's 28 players send none of the network keys (a POV demo: that server leaves them out).

**Online, public servers** (the 8 POV demos, 336 players; medians 4 to 136 ms, 28 at the median): 304 players send none of the network keys; of the 32 who do, `rate` 100000 for 29, `cl_updaterate` 102 for 24, `cl_lw` and `cl_lc` 1, `cl_dlmax` 512 or 1024.

So on LAN and in the tournaments online the network settings are the same (25000 or 30000, 101, 1, 1); only the public servers, ten years on, show the higher `rate` and `cl_updaterate` 102.

The network settings are what each player asked for; the server caps `cl_updaterate` at its `sv_maxupdaterate`, which a demo doesn't record (ReHLDS `sv_main.cpp`, SV_CheckUpdateRate; the cvar isn't FCVAR_SERVER, so its changes aren't announced).

**Changes during a match**: 33 players, nearly all `rate` (between 20000, 25000 and 30000, some at a reconnect); `cl_updaterate` 100 and 101 back and forth (SK.f0rest, FX vs SK, Inferno, IEM5; MEET NEO, mTw vs MYM, Dust2, EM3 Global Finals 2009); `cl_lw` 1 to 0 at a reconnect (SWEDEN|SpawN, Sweden vs Ukraine, Train, ClanBase NationsCup XI); a `rate` of 2500 for a second or two and back (FRANCE! MAMAMJ3RRRRRR!, Team Belgium vs France; ROCCAT.lurppis, roccat vs eSTRO, Inferno, Extreme Masters II).

**Other userinfo keys** (by name, the number of player rows that carry them): `model` 1,076, `topcolor` and `bottomcolor` 906, `status_monitor` 45, `lang` 25, `*fid` and `*fname` 10, `Svamp` 7, `translit` 6, `src` 6, `fontcolor` 5, `boost` 3, `xredir` 3, `vgui_menus` 2, `prot_ban` 2, `prot_patch` 2, and one each of `ah`, `dm`, `lefthand`, `s8`, `nrate`, `sredirfwd`; on one POV public server (Match 3, css_cache) the keys starting with "_" (`_cl_autowepswitch` 34, `_ah` 33, `_vgui_menus` 32, `_demorecorder` 2, `_damage`, `_dm`, `_uid`, `_pw`, `_pw-pcw` 1 each), which Valve's server leaves out everywhere else.

## The servers

- `sv_airaccelerate` 10 on every LAN demo but one (70), on the 6 not known and on the ClanBase and ENC servers; 100 on the GP Tourney and the public servers. `sv_maxspeed` 900 on 56 demos, 320 on 22, 800 on 4, 1000 on 1. gravity 800, `sv_stopspeed` 75, `sv_friction` 4 and `sv_stepsize` 18 everywhere (`tests/logs/new-demos-feedback-2026-11-20.md`, B).
- The ex_interp line ("ex_interp 0.15", or 0.10) is in every HLTV demo and in no POV demo; HLTV's snapshots a second are in the Demos sheet.
