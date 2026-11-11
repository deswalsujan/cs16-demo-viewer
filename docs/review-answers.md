# Review answers from claude.ai pages

Sujan's answers to the review pages Claude made on claude.ai, copied out of each page's store on 29 Oct 2026 so they live in the repo. Agents outside claude.ai can't read those stores. The pages stay as links to the pictures; this file is the record of the answers.

Answers and notes are copied exactly as Sujan wrote them, typos included. What each answer led to is in `IDEAS.md` and `CHANGELOG.md` (the release named under each page). Demos and their events: `tests/DEMOS.md`.

| Page | Asked | Answered | Where the outcome is recorded |
|---|---|---|---|
| [Wallbang fix check, 0.22.1](https://claude.ai/artifact/Y4V77jgiF3SEb79HJfLVKu) | 34 cases from 0.22.0/0.22.1 | 24 Oct 2026 | CHANGELOG 0.22.2, IDEAS (23 Oct feedback) |
| [Wallbang hits mockups](https://claude.ai/artifact/MocQAxuyCwDfSd3p9oSTDn) | 4 design questions for wallbang damage | 25 Oct 2026 | IDEAS, "Wallbang hits that didn't kill"; CHANGELOG 0.24.0 |
| [Wallbang hits check](https://claude.ai/artifact/19rqQbuSRY6VtgKPLvtXLZ) | 24 bursts on 7 Nuke demos, plus the picture style | 25 and 26 Oct 2026 | IDEAS, "Wallbang hits that didn't kill"; CHANGELOG 0.24.0 |
| [Wallbang hits damage options](https://claude.ai/artifact/9w1Ur8jevh9rweDagvHFhB) | Where damage shows (A/B/C), headshot icon | Not on the page: answered in chat, 26 Oct 2026 | IDEAS, "Decided by Sujan 26 Oct 2026": the letters HS, option A with changes |
| [Loose wallbang check](https://claude.ai/artifact/AijsuFRmrrp6CDMcoNFoqH) | 225 seen kills with a bullet only a surface explains | 27 and 28 Oct 2026, 165 of 225 | IDEAS ("Sujan's check, 27 and 28 Oct 2026"); CHANGELOG 0.24.0 |
| [Wallbang damage trial](https://claude.ai/artifact/APnX9iobz6AAEDFsGaAe9L) | A trial copy of the viewer, no questions | | Nothing stored |
| [Wallbang sliver check](https://claude.ai/artifact/V93PEpQPJFLufvBKy7ZZgw) | 10 kills where the sight points see a sliver and the picture under 50 pixels, 30 Oct 2026 | 30 Oct 2026 | IDEAS, "Sliver kills"; STATE.md Decisions (railings; the vent exception, withdrawn the same day) |
| [Denser hidden check](https://claude.ai/artifact/Q9dNFKwNrF37utKP3fGJaM) | 14 cards, 5 Oct 2026 | 5 Oct 2026 | The page can no longer be opened (deleted or not shared). The answers are quoted in full in IDEAS, the 5 Oct item on `wip/denser-hidden-check` |

## Wallbang fix check, 0.22.1 (24 Oct 2026)

https://claude.ai/artifact/Y4V77jgiF3SEb79HJfLVKu, store collection `answers`. 34 of 34 answered.

Each case asked its own question. The Answer column gives the option Sujan picked, in the page's words, and in brackets whether that option said the viewer's call was right or wrong.

### Dropped: part of the victim in view

| Demo | Round | Kill | What the check said | Question | Answer | Note |
|---|---|---|---|---|---|---|
| mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final | R24 1:31 | Na`Vi f0cuswOw~ on mTw.Mindfactory / ave | Dropped as a wallbang · 240 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final | R4 0:36 | Na`Vi markeloff /A/ on mTw.Mindfactory / minet | Dropped as a wallbang · 172 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| fnatic vs mousesports, Forge, IEM6 Guangzhou final | R14 1:05 | mousesports / gob b on fnaticMSI Xizt | Dropped as a wallbang · 223 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | No, he was fully hidden (wrong) | I used 0.25x speed and paused the demo right when the kill feed notification showed up and I can't see a body. And definitely not the 223 pixels you've mentioned. |
| Na`Vi vs FX, Train, SEC 2011 final | R23 C4 0:01 | NEO[t] on Na`Vi markeloff /A/ | Dropped as a wallbang · 561 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| Sweden vs Ukraine, Train, ClanBase NationsCup XI | R9 0:59 | [Ukraine] - B1ad3 _R on SWEDEN/RobbaN | Dropped as a wallbang · 165 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| Sweden vs Ukraine, Train, ClanBase NationsCup XI | R23 1:25 | SWEDEN/cArNaGe! on [Ukraine] - edzie | Dropped as a wallbang · 743 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| FX vs Lions, Nuke, DreamHack Winter 2010 | R13 1:19 | LIONS NIKO DA PANDA * QPAD on Frag eXecutors  LoordB | Dropped as a wallbang · 124 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| fnatic vs Na`Vi, Dust2, GameGune 2012 final | R12 C4 0:04 | Na`Vi starix on fnaticRC f0restBambiJQgarN^ | Dropped as a wallbang · 138 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| fnatic vs Na`Vi, Dust2, GameGune 2012 final | R20 0:36 | Na`Vi markeloff on fnaticRC Xizt | Dropped as a wallbang · 410 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| mousesports vs SK, Nuke, Extreme Masters II | R5 1:35 | mousesports / Kapi O on SK/Tentpole[TTFU] | Dropped as a wallbang · 163 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| MYM vs mTw, Dust2, EM3 2009 consolation final | R29 C4 0:13 | mTw / ave on MEET TAZ, YOUR MAKER | Dropped as a wallbang · 210 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 0:54 | Na`Vi ceh9 /A/ on M5 XEK | Dropped as a wallbang · 872 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| ALTERNATE aTTaX vs Virtus.pro, Inferno, Extreme Masters II | R10 1:02 | ALTERNATE aTTaX / paN on Virtus.pro > Ioann S. <Edward> | Dropped as a wallbang · 856 pixels of his body in view at the shot | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |

### Kept: the closest calls

| Demo | Round | Kill | What the check said | Question | Answer | Note |
|---|---|---|---|---|---|---|
| mTw vs Na`Vi, Tuscan, ESWC 2010 semi-final | R6 C4 0:25 | mTw.Mindfactory / minet on Na`Vi ceh9 /A/ | Still a wallbang · 69 pixels of his body in view at the shot | At the killing shot, was the victim fully hidden from the killer? | No, part of him was in view (wrong) |  |
| FX vs mTw, Nuke, Xperia Play 2011 | R11 0:41 | Frag eXecutors  NEO[t] on ArcadioN@mymTw.com | Still a wallbang · 74 pixels of his body in view at the shot | At the killing shot, was the victim fully hidden from the killer? | Yes, fully hidden (right) | Correct me if I'm wrong here but is there a delay between when someone dies and the kill feed shows they're dead? Because again in the demo viewer I cannot see the portion of the body you mentioned but it was there miliseconds ago when arcadion was getting hit. The exact same issue happened in Gob b's case also on forge (auto_ifng-1110042145-de_forge.dem) - when I see carnage dead - just momentarily before that he did show the body part you've highlighted but when he died he was completely removed from my view. |
| fnatic vs mousesports, Forge, IEM6 Guangzhou final | R12 1:08 | fnaticMSI pita * Sensei on mousesports / zonixx | Still a wallbang · 67 pixels of his body in view at the shot | At the killing shot, was the victim fully hidden from the killer? | No, part of him was in view (wrong) |  |
| Na`Vi vs FX, Dust2, SEC 2011 final | R4 1:05 | Na`Vi EdwardwOw~ on 742 | Still a wallbang · 98 pixels of his body in view at the shot | At the killing shot, was the victim fully hidden from the killer? | No, part of him was in view (wrong) |  |
| mousesports vs AGAiN, Inferno, ESWC 2011 final | R4 1:13 | AGAiN  742 on mousesports / gob b | Still a wallbang · 49 pixels of his body in view at the shot | At the killing shot, was the victim fully hidden from the killer? | Yes, fully hidden (right) | Again, same as the earlier two cases I mentioned - when gob b died, he was completely hidden in my demo view.9 |
| fnatic vs Moscow Five, Nuke, DreamHack Summer 2011 | R14 C4 0:17 | [fnaticMSI.Xizt] on M5 ED1K 5x5 AP DNISHE GO | Still a wallbang · 53 pixels of his body in view at the shot | At the killing shot, was the victim fully hidden from the killer? | No, part of him was in view (wrong) |  |

### Inferno's lamp posts

| Demo | Round | Kill | What the check said | Question | Answer | Note |
|---|---|---|---|---|---|---|
| FX vs mTw, Inferno, Xperia Play 2011 | R9 0:53 | ave@mymTw.com on Frag eXecutors  PASHA[t] | Still a wallbang · 0 pixels of his body in view at the shot | At the killing shot, was the victim fully hidden from the killer? | Yes, fully hidden (right) |  |
| mousesports vs AGAiN, Inferno, ESWC 2011 final | R21 0:51 | AGAiN  KUBEN[t] on mousesports / gob b | Dropped as a wallbang | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |
| Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R7 1:15 | M5 XEK on Na`Vi ceh9 /A/ | Dropped as a wallbang | At the killing shot, could the killer see any part of the victim's body? | Yes, part of him was in view (right) |  |

### Nuke's upper windows

| Demo | Round | Kill | What the check said | Question | Answer | Note |
|---|---|---|---|---|---|---|
| tyloo vs mTw, Nuke, e-Stars Seoul 2009 | R22 1:11 | mTw.Mindfactory / Sunde on tyloo Xuefeng ' xf ' Lai | Dropped as a wallbang | Was this shot through the window glass by the upper site ladder? | Yes, through the glass: right to drop (right) |  |

### Skips across a round restart

| Demo | Round | Kill | What the check said | Question | Answer | Note |
|---|---|---|---|---|---|---|
| fnatic vs Moscow Five, Nuke, DreamHack Summer 2011 | R10 0:26 | M5 ED1K 5x5 AP DNISHE GO on [fnaticMSI.dsn] | Marked as a skip | In the Kills list, does this kill show // with the round's own timer (not "freeze"), with the "Recording skips here" note, and do the players jump at that moment? | Yes, all of that (right) |  |
| fnatic vs EG, Dust2, EM3 Global Finals 2009 | R19 1:17 | EG.Hanes on fnatic.MSI iZnoGouD | Marked as a skip | In the Kills list, does this kill show // with the round's own timer (not "freeze"), with the "Recording skips here" note, and do the players jump at that moment? | Yes, all of that (right) |  |
| FX vs SK, Inferno, IEM5 | R27 0:00 | Frag eXecutors  taz on SK.GeT_RiGhT | Marked as a skip | In the Kills list, does this kill show // with the round's own timer (not "freeze"), with the "Recording skips here" note, and do the players jump at that moment? | Yes, all of that (right) |  |
| k1ck vs eq, Nuke, DreamHack Winter 2011 | R4 C4 0:39 | -Eq- SeDaN on K1CK coachi | Marked as a skip | In the Kills list, does this kill show // with the round's own timer (not "freeze"), with the "Recording skips here" note, and do the players jump at that moment? | Yes, all of that (right) |  |
| ALTERNATE aTTaX vs Virtus.pro, Inferno, Extreme Masters II | R19 1:23 | Virtus.pro > Roman M. <ROMJkE^> on ALTERNATE aTTaX / approx | Marked as a skip | In the Kills list, does this kill show // with the round's own timer (not "freeze"), with the "Recording skips here" note, and do the players jump at that moment? | Yes, all of that (right) |  |

### The small fixes

| Fix | Answer |
|---|---|
| "Add another part…" is greyed out while picking | right |
| Kills on a restart skip keep their own timer | right |
| Full screen has its own note | right |
| The 13-second Train file no longer says POV | right |
| The Rounds tab opens at the round playing | right |
| Timeline hover notes stay whole at both ends | right |

## Wallbang hits mockups (25 Oct 2026)

https://claude.ai/artifact/MocQAxuyCwDfSd3p9oSTDn, store collection `answers`.

**q1. The picture in Player's eyes: glow, ring and damage box** (options: keep it like this / no glow, only the ring and the box / box only / something else)  
Answer: **other** (2026-10-25)  
Note: A headshot should be marked differently (maybe an icon if you can find one along with the damage number the headshot caused). And if I'm understanding your design correctly, we have quite a lot of information on the screen. And the boxes themselves will overlap with each other + you also have the lines connecting the rings with the boxes. This needs to be simplified. I'd like to see the glow first before committing to whether it should be removed or kept. The body shot boxes should be shown under the neck so on the right/left side so that the enemy model is still clearly visible. If the rings are not accurate then we should just remove them and instead mention the boxes only. The headshot box should not overlap with the damage boxes so it will be placed above and near right/left to the head. And we can remove the connecting lines altogether. If you have any other recommendations then let me know.

**q2. Where should wallbang damage show?** (A, a Hits tab / B, the Wallbangs list with filters / C, under each round / something else)  
Answer: **B** (2026-10-25)  
Note: We're showing "Damage" and "Loose" from the filters in Option B. Should we replace "Wallbang" label with "Strict" instead? and if it landed a kill then "Strict" "Kill" together? And all of these wallbang filters should also carry tool-tips explaining what they do. Also, the only difference between "Damage" and "Loose" comes down to that Loose resulted in a kill right?

**q3. Damage of each wallbang** (1, by the shooter's name / 2, a line under the gun (as IDEAS records it) / others)  
Answer: **2** (2026-10-25)

**q4. Build now, or check bursts by eye first?** ("check" = check about 20 bursts by eye before building (IDEAS))  
Answer: **check** (2026-10-25)

## Wallbang hits check (25 and 26 Oct 2026)

https://claude.ai/artifact/19rqQbuSRY6VtgKPLvtXLZ, store collection `checks`. Question per burst: real wallbang hit? (yes / no / not sure). 24 of 24 answered: 22 yes, 2 not sure (b08, b11), none no.

**Picture style** (no rings or lines; body hits in one box by the neck, headshots in their own box; glow pulsing at each hit): **yes** (2026-10-25)  
Note: But the damage boxes are too close to the crosshair, in fact overlapping with the right horizontal bar. That should not happen including the overlap on the wallbanged opponents body. If you put a fixed distance then it should be customized for the different crosshair sizes.

| # | Demo | Where | Burst | Answer | Note |
|---|---|---|---|---|---|
| b01 | fnatic vs Moscow Five, Nuke, DreamHack Summer 2011 | R14 C4 0:16 · demo 24:57 · follow ED1K in Player's eyes | Xizt lost 68 HP through walls in one hit: ED1K 68. | yes (2026-10-25) |  |
| b02 | fnatic vs Moscow Five, Nuke, DreamHack Summer 2011 | R21 1:10 · demo 35:57 · follow cArn in Player's eyes | ED1K lost 42 HP through walls in 0.9 s: cArn 42. | yes (2026-10-25) |  |
| b03 | fnatic vs Moscow Five, Nuke, DreamHack Summer 2011 | R2 1:13 · demo 9:28 · follow Dosia in Player's eyes | cArn lost 37 HP through walls in one hit: Dosia 37. | yes (2026-10-25) | He died in a wallbang also after the 37 damage hit, correct? So it would be 2 hits and not a single hit of 37? Or did the last bullet that killed Carn was on the body. Let me know. |
| b04 | FX vs Lions, Nuke, DreamHack Winter 2010 | R18 0:55 · demo 36:14 · follow LoordB in Player's eyes | Xizt lost 88 HP through walls in 0.4 s: LoordB 88. Ends in LoordB's wallbang kill (ak47). | yes (2026-10-25) | Not sure if having damage number boxes show up on two different sides of the player is good UX. It's taking up too much real estate on the screen. I haven't yet seen this live in the demo viewer so I'm judging this crowded screen based on the mockup you've shared. And the headshot icon needs a rework (give me some options if you're not sure which is best) - it does not clearly denote a headshot. |
| b05 | FX vs Lions, Nuke, DreamHack Winter 2010 | R7 1:26 · demo 18:43 · follow NEO in Player's eyes | THREAT lost 52 HP through walls in 1.1 s: NEO 52. Ends in NEO's wallbang kill (m4a1). | yes (2026-10-25) | Help me understand these numbers - Threat had 52 hp then how did 49 damage kill from Neo kill him? Did he receive any other damage also in between? |
| b06 | FX vs Lions, Nuke, DreamHack Winter 2010 | R11 1:04 · demo 25:22 · follow THREAT in Player's eyes | LoordB lost 36 HP through walls in 0.2 s: THREAT 36. Ends in THREAT's wallbang kill (ak47). | yes (2026-10-25) | Same as Neo's kill on Threat, if LoordB was 36hp then how did 35 damage kill him? |
| b07 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R6 0:50 · demo 13:20 · follow PASHA in Player's eyes | ave lost 51 HP through walls in 0.2 s: PASHA 39, KUBEN 12. | yes (2026-10-25) | I see the first bullet that pasha hit gave 12 damage to ave (his hp went from 100 to 88). I can't make out the other damage because Neo was also shooting him so all I can do is to trust your calculations here. Double check them to be sure. |
| b08 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R10 1:21 · demo 19:20 · follow KUBEN in Player's eyes | zonic lost 92 HP through walls in 0.9 s: KUBEN 92. Ends in KUBEN's wallbang kill (ak47). | unsure (2026-10-25) | Zonic did get a wallbang but he was 92hp first. Then he fell down and came to 46hp. And then Kuben killed him in wallbang. And it was a headshot wallbang which the mockup doesn't show. Is it because you show a headshot wallbang hit if that's the bullet that started the damage and not the bullet that killed the opponent? |
| b09 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R5 1:23 · demo 11:03 · follow minet in Player's eyes | NEO lost 68 HP through walls in 1.1 s: minet 68. Ends in minet's wallbang kill (m4a1). | yes (2026-10-25) | Again, not sure if he was given 68hp damage then why does the damage box say 54 and 5 hits |
| b10 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R5 1:31 · demo 10:54 · follow NEO in Player's eyes | minet lost 39 HP through walls in 0.4 s: NEO 39. | yes (2026-10-25) |  |
| b11 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R25 1:24 · demo 31:52 · follow mUtcb in Player's eyes | szrtech lost 54 HP through walls in 0.9 s: mUtcb 36, coachi 9, spekz 9. | unsure (2026-10-26) | I'm checking this demo in the latest artifact in claude.ai web site and neither the damage numbers or the glow is showing so I can't be sure although mutcb's crosshair does seem to have gone on szrtech's head. I checked another different demo than this and the glow and damage numbers are working there. |
| b12 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R15 1:11 · demo 19:18 · follow SeDaN in Player's eyes | fox lost 77 HP through walls in 1.6 s: SeDaN 77. | yes (2026-10-25) |  |
| b13 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R10 1:29 · demo 14:10 · follow n0rx in Player's eyes | DECE[A] lost 45 HP through walls in 0.3 s: n0rx 45. | yes (2026-10-25) |  |
| b14 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R8 1:27 · demo 12:18 · follow szrtech in Player's eyes | spekz lost 39 HP through walls in one hit: szrtech 39. | yes (2026-10-25) |  |
| b15 | mousesports vs SK, Nuke, Extreme Masters II | R19 0:44 · demo 39:48 · follow GeT_RiGhT in Player's eyes | Tixo lost 70 HP through walls in 0.7 s: GeT_RiGhT 70. Ends in GeT_RiGhT's wallbang kill (m4a1). | yes (2026-10-26) |  |
| b16 | mousesports vs SK, Nuke, Extreme Masters II | R19 1:31 · demo 39:01 · follow allen in Player's eyes | Kapi O lost 47 HP through walls in 0.3 s: allen 47. | yes (2026-10-25) |  |
| b17 | mousesports vs SK, Nuke, Extreme Masters II | R9 1:34 · demo 22:46 · follow RobbaN in Player's eyes | Tixo lost 36 HP through walls in 0.6 s: RobbaN 36. Ends in RobbaN's wallbang kill (ak47). | yes (2026-10-25) | It's a wallbang hit but it's being counted incorrectly. Tixo was killed completely by a wallbang from 100hp to 0 not just 36hp. Double check this. |
| b18 | mTw vs Lions, Nuke, DreamHack Summer 2011 | R8 1:10 · demo 14:40 · follow NoSound in Player's eyes | SNAJDINHOOOAOAOAO lost 89 HP through walls in 1.2 s: NoSound 89. Ends in NoSound's wallbang kill (m4a1). | yes (2026-10-25) | Yes correct but I again don't understand why does the box say 69 damge and 6 hits. Actually, hold on, I just figured what is happening. Total damage was 89hp but in the mockup that you've shown I can see 69 damage because the mockup was taken in between when snajdan was still getting the damage. That's why his hp in the mockup shows 20 hp. I think this answers some of my previous comments. Confirm if that is the case. |
| b19 | mTw vs Lions, Nuke, DreamHack Summer 2011 | R15 1:08 · demo 23:58 · follow NoSound in Player's eyes | dennis=D! lost 56 HP through walls in one hit: NoSound 56. | yes (2026-10-25) | Design note again, the damage box is taking so much space that it's overlapping on top of Denni's nick label as well as his hp. |
| b20 | mTw vs Lions, Nuke, DreamHack Summer 2011 | R11 1:27 · demo 17:43 · follow zonic in Player's eyes | niko lost 37 HP through walls in 0.7 s: zonic 37. | yes (2026-10-25) |  |
| b21 | SK vs eSTRO, Nuke, WCG 2008 (-0811082043-) | R23 1:12 · demo 36:28 · follow allen in Player's eyes | bail lost 88 HP through walls in 2.2 s: allen 52, RobbaN 36. Ends in allen's wallbang kill (ak47). | yes (2026-10-25) |  |
| b22 | SK vs eSTRO, Nuke, WCG 2008 (-0811082043-) | R12 C4 0:20 · demo 24:11 · follow Tentpole in Player's eyes | ari lost 48 HP through walls in 0.1 s: Tentpole 27, RobbaN 21. | yes (2026-10-25) | Ari had 60 hp then 39 hp and then dead. Can you double check the damage numbers again? |
| b23 | SK vs eSTRO, Nuke, WCG 2008 (-0811082043-) | R7 1:26 · demo 15:28 · follow RobbaN in Player's eyes | ari lost 91 HP through walls in 0.6 s: RobbaN 91. Ends in RobbaN's wallbang kill (m4a1). | yes (2026-10-25) |  |
| b24 | SK vs eSTRO, Nuke, WCG 2008 (-0811082043-) | R10 1:22 · demo 19:59 · follow zet in Player's eyes | solo lost 58 HP through walls in 0.0 s: zet 58. Ends in zet's wallbang kill (m4a1). | yes (2026-10-25) |  |

## Loose wallbang check (27 and 28 Oct 2026)

https://claude.ai/artifact/AijsuFRmrrp6CDMcoNFoqH, store collection `answers`. Seen kills with the crosshair through cover where a bullet of the killer's lost damage only a surface explains. 165 of the 225 answered: 156 loose wb, 9 not sure, none no.

### Answers with a note, or not sure

| Id | Demo | Round | Kill | Answer | Note |
|---|---|---|---|---|---|
| k00005 | Burning vs FairFrag, Inferno, ESWC 2010 | R10 1:20 | Rara on CosMo/M/ | loose | How was Rara able to give 62 damage to Cosmo with one bullet? |
| k02006 | FX vs Lions, Nuke, DreamHack Winter 2010 | R10 0:22 | NIKO DA PANDA on LoordB | unsure | Seems like a normal kill to me |
| k03014 | FX vs SK, Inferno, IEM5 | R12 C4 0:21 | face on KUBEN | unsure | I wouldn't call this a loose wallbang because kuben was given damage first and then he was completely in the open when he was killed. |
| k04000 | FX vs eSahara, Dust2, DreamHack Winter 2010 | R4 C4 0:08 | MAHE on 742 | loose | Yes, he gave him damage first. Then there was a brief stop and then loose wb |
| k09004 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R7 1:23 | KUBEN on trace | unsure | Seemed like a normal kill to me but if he was hit through a surface then it's correctly a loose wb. |
| k11010 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R20 0:40 | hool on fR11$+- | unsure | Like the previous option where I mentioned not sure too; same here. Through your analysis I can see that he got 12 dmg and I think just one of the bullets hit for that but the rest were on his body only. If this is correct then it does feel like as if he got no wallbang at all but technically he did. The check is doing its job correctly. We should keep it as is. |
| k11012 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R21 0:52 | apxwOw~ on Xizt | loose | Can you confirm if Kapio gave any damage to Xizt? Because Apxwow and Kapio seem to be shooting at the same time from the same spot. |
| k12003 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R5 C4 0:05 | zonixx on Gux <3 pingu | loose | Very very loose wb. Just 9 damage but regardless of that - the check is doing its job correctly. |
| k12006 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R7 0:33 | Xizt on gob  b | loose | So like i've said earlier it was just one bullet that went through the wall and then it was straight kill in the open (body was fully visible). I'm just sharing this as context. A very very loose wb. Also bug - the damage numbers were not working in the demo and neither the glow. This has happened in some other demos also (like the k1ck vs EQ one). Please double check. |
| k14001 | Na`Vi vs FX, Dust2, SEC 2011 final | R4 0:47 | markeloff on NEO | unsure |  |
| k14018 | Na`Vi vs FX, Dust2, SEC 2011 final | R23 1:13 | EdwardwOw~ on Loord | loose | Again, a very very loose wb. |
| k14019 | Na`Vi vs FX, Dust2, SEC 2011 final | R23 1:09 | NEO on EdwardwOw~ | unsure | from 45>37 that you've mentioned as 'through a surface' at the exact time neo was reloading (at least that's what the demo shows). So I'm not sure how he could have given edward that 8dmg. |
| k16023 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 1:20 | markeloff ~~~ on ROMJkE2H^ | unsure |  |
| k27001 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R4 1:27 | Gux on KORN | loose | Very very loose wb |
| k28003 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R4 1:04 | RobbaN on B1ad3 _R | unsure |  |
| k28021 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R17 1:12 | STRIKE on allen | loose | Again, not seeing the glow or the damage numbers. |
| k28025 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R22 C4 0:07 | cArNaGe! on STRIKE | unsure | This seemed like the bullet went through not a wall but his own teammate. Can you confirm if that's the case and if that's being treated as a wallbang since his teammate is technically a surface? And regardless of that Im not sure if this was a wallbang |
| k37003 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R6 1:25 | DECE[A] * on n0rx     <pacheco> | loose | Can you double check the damage numbers here? It felt like as if after 89 hp n0rx got another headshot (separate from the one that killed him) |

### Settled later in chat (30 Oct 2026)

Five of the answers above, checked again by Sujan by eye on 30 Oct 2026 when the wallbang ground truth test was planned (his words in brackets). Later answers win over the page's.

| Id | Demo | Round | Kill | Answer |
|---|---|---|---|---|
| k11010 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R20 0:40 | hool on fR11$+- | [loose] (was unsure) |
| k03014 | FX vs SK, Inferno, IEM5 | R12 C4 0:21 | face on KUBEN | [none] (was unsure) |
| k28025 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R22 C4 0:07 | cArNaGe! on STRIKE | [none] (was unsure) |
| k09004 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R7 1:23 | KUBEN on trace | [leave out] (was unsure) |
| k10017 | FX vs mTw, Nuke, Xperia Play 2011 (part 2) | R26 1:30 | KUBEN on trace | [loose] (loose on this page already; on the 5 Oct denser check Sujan had called him hidden) |

### Every answer

| Id | Demo | Round | Kill | Answer |
|---|---|---|---|---|
| k00000 | Burning vs FairFrag, Inferno, ESWC 2010 | R3 1:03 | Rara on CosMo/M/ | loose |
| k00002 | Burning vs FairFrag, Inferno, ESWC 2010 | R5 0:14 | Rara on CosMo/M/ | loose |
| k00005 | Burning vs FairFrag, Inferno, ESWC 2010 | R10 1:20 | Rara on CosMo/M/ | loose |
| k00009 | Burning vs FairFrag, Inferno, ESWC 2010 | R12 1:15 | Rara on ioRek | loose |
| k00011 | Burning vs FairFrag, Inferno, ESWC 2010 | R13 0:59 | Rara on drizzerEstachE! | loose |
| k01001 | FX vs Lions, Inferno, DreamHack Winter 2010 | R5 0:16 | NEO on Xizt | loose |
| k01003 | FX vs Lions, Inferno, DreamHack Winter 2010 | R5 C4 0:25 | 742 on NIKO DA PANDA | loose |
| k01004 | FX vs Lions, Inferno, DreamHack Winter 2010 | R7 1:20 | 742 on THREAT | loose |
| k01006 | FX vs Lions, Inferno, DreamHack Winter 2010 | R14 1:08 | PASHA on Xizt | loose |
| k01013 | FX vs Lions, Inferno, DreamHack Winter 2010 | R28 0:46 | NIKO DA PANDA on KUB3N | loose |
| k02001 | FX vs Lions, Nuke, DreamHack Winter 2010 | R5 0:26 | kHRYSTAL on 742 | loose |
| k02003 | FX vs Lions, Nuke, DreamHack Winter 2010 | R7 1:23 | 742 on kHRYSTAL | loose |
| k02006 | FX vs Lions, Nuke, DreamHack Winter 2010 | R10 0:22 | NIKO DA PANDA on LoordB | unsure |
| k03004 | FX vs SK, Inferno, IEM5 | R5 0:02 | GeT_RiGhT on KUBEN | loose |
| k03007 | FX vs SK, Inferno, IEM5 | R8 1:04 | Loord on f0rest | loose |
| k03009 | FX vs SK, Inferno, IEM5 | R9 0:10 | NEO on f0rest | loose |
| k03011 | FX vs SK, Inferno, IEM5 | R10 0:55 | GeT_RiGhT on Loord | loose |
| k03014 | FX vs SK, Inferno, IEM5 | R12 C4 0:21 | face on KUBEN | unsure |
| k03016 | FX vs SK, Inferno, IEM5 | R13 0:38 | KUBEN on GeT_RiGhT | loose |
| k03020 | FX vs SK, Inferno, IEM5 | R17 0:58 | PASHA on face | loose |
| k03025 | FX vs SK, Inferno, IEM5 | R22 C4 0:17 | NEO on GeT_RiGhT | loose |
| k03027 | FX vs SK, Inferno, IEM5 | R25 0:35 | allen on NEO | loose |
| k03029 | FX vs SK, Inferno, IEM5 | R28 0:41 | allen on Loord | loose |
| k04000 | FX vs eSahara, Dust2, DreamHack Winter 2010 | R4 C4 0:08 | MAHE on 742 | loose |
| k04002 | FX vs eSahara, Dust2, DreamHack Winter 2010 | R8 C4 0:34 | MAHE on PASHA | loose |
| k04013 | FX vs eSahara, Dust2, DreamHack Winter 2010 | R26 C4 0:23 | 742 on sadliGENO | loose |
| k05001 | FX vs eSahara, Nuke, DreamHack Winter 2010 | R3 0:08 | MAHE on 742 | loose |
| k05002 | FX vs eSahara, Nuke, DreamHack Winter 2010 | R6 1:05 | KUBEN on MAJ3R | loose |
| k05003 | FX vs eSahara, Nuke, DreamHack Winter 2010 | R9 1:11 | MAHE on NEO | loose |
| k05004 | FX vs eSahara, Nuke, DreamHack Winter 2010 | R10 1:20 | RARA on PASHA | loose |
| k05008 | FX vs eSahara, Nuke, DreamHack Winter 2010 | R18 1:09 | LoordB on MAHE | loose |
| k05012 | FX vs eSahara, Nuke, DreamHack Winter 2010 | R24 0:45 | KUBEN on RARA | loose |
| k05013 | FX vs eSahara, Nuke, DreamHack Winter 2010 | R24 0:19 | PASHA on MAJ3R | loose |
| k06000 | FX vs fnatic, Dust2, IEM March 2011 | R2 1:04 | Loord on Delpan4Miichy | loose |
| k06002 | FX vs fnatic, Dust2, IEM March 2011 | R6 0:28 | carn on PASHA | loose |
| k06005 | FX vs fnatic, Dust2, IEM March 2011 | R13 1:19 | NEO on Xizt | loose |
| k06006 | FX vs fnatic, Dust2, IEM March 2011 | R14 0:40 | NEO on pita 4 Balkan | loose |
| k07001 | FX vs mTw, Inferno, Xperia Play 2011 (part 1) | R3 1:08 | Loord on zonic | loose |
| k07002 | FX vs mTw, Inferno, Xperia Play 2011 (part 1) | R6 0:17 | PASHA on zonic | loose |
| k07003 | FX vs mTw, Inferno, Xperia Play 2011 (part 1) | R6 0:16 | trace on PASHA | loose |
| k07008 | FX vs mTw, Inferno, Xperia Play 2011 (part 1) | R15 1:19 | ArcadioN on KUBEN | loose |
| k08000 | FX vs mTw, Inferno, Xperia Play 2011 (part 2) | R5 1:13 | NEO on minet | loose |
| k08007 | FX vs mTw, Inferno, Xperia Play 2011 (part 2) | R17 0:27 | trace on TaZ | loose |
| k08008 | FX vs mTw, Inferno, Xperia Play 2011 (part 2) | R20 0:24 | ArcadioN on PASHA | loose |
| k08009 | FX vs mTw, Inferno, Xperia Play 2011 (part 2) | R21 0:57 | trace on NEO | loose |
| k09000 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R2 0:29 | minet on KUBEN | loose |
| k09002 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R6 1:08 | NEO on trace | loose |
| k09003 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R6 0:50 | NEO on ave | loose |
| k09004 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R7 1:23 | KUBEN on trace | unsure |
| k09007 | FX vs mTw, Nuke, Xperia Play 2011 (part 1) | R12 1:10 | PASHA on ave | loose |
| k10001 | FX vs mTw, Nuke, Xperia Play 2011 (part 2) | R4 0:39 | zonic on TaZ | loose |
| k10016 | FX vs mTw, Nuke, Xperia Play 2011 (part 2) | R25 0:38 | NEO on minet | loose |
| k10017 | FX vs mTw, Nuke, Xperia Play 2011 (part 2) | R26 1:30 | KUBEN on trace | loose |
| k11001 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R3 0:36 | Xizt on ROMAN R | loose |
| k11004 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R6 1:05 | apxwOw~ on CARN | loose |
| k11005 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R7 1:10 | apxwOw~ on CARN | loose |
| k11007 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R10 0:20 | fR11$+- on apxwOw~ | loose |
| k11009 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R18 1:12 | pita on hool | loose |
| k11010 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R20 0:40 | hool on fR11$+- | unsure |
| k11012 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R21 0:52 | apxwOw~ on Xizt | loose |
| k11014 | Fnatic vs ALTERNATE, Nuke, ESWC 2011 | R23 C4 0:33 | hool on fR11$+- | loose |
| k12003 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R5 C4 0:05 | zonixx on Gux <3 pingu | loose |
| k12006 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R7 0:33 | Xizt on gob  b | loose |
| k12008 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R8 1:01 | ninja on pita /iBRA/ | loose |
| k12012 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R13 1:17 | ninja on cArn | loose |
| k12013 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R14 1:05 | Gux <3 pingu on zonixx | loose |
| k12017 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R24 0:37 | Xizt on zonixx | loose |
| k12019 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R25 0:59 | roman[K] on Gux <3 pingu | loose |
| k13016 | MYM vs fnatic, Train, CPL Winter 2006 (probably) | R19 1:09 | XioNe on dsn[tw] | loose |
| k14000 | Na`Vi vs FX, Dust2, SEC 2011 final | R3 0:40 | markeloff on Loord | loose |
| k14001 | Na`Vi vs FX, Dust2, SEC 2011 final | R4 0:47 | markeloff on NEO | unsure |
| k14004 | Na`Vi vs FX, Dust2, SEC 2011 final | R7 0:56 | starix on NEO | loose |
| k14005 | Na`Vi vs FX, Dust2, SEC 2011 final | R7 0:54 | 742 on starix | loose |
| k14008 | Na`Vi vs FX, Dust2, SEC 2011 final | R10 1:04 | 742 on starix | loose |
| k14018 | Na`Vi vs FX, Dust2, SEC 2011 final | R23 1:13 | EdwardwOw~ on Loord | loose |
| k14019 | Na`Vi vs FX, Dust2, SEC 2011 final | R23 1:09 | NEO on EdwardwOw~ | unsure |
| k15006 | Na`Vi vs FX, Train, SEC 2011 final | R5 C4 0:14 | 742 on markeloff | loose |
| k15012 | Na`Vi vs FX, Train, SEC 2011 final | R13 0:05 | Edward4[a] on PASHA | loose |
| k15014 | Na`Vi vs FX, Train, SEC 2011 final | R15 1:18 | Edward4[a] on PASHA | loose |
| k15015 | Na`Vi vs FX, Train, SEC 2011 final | R19 0:56 | Edward4[a] on PASHA | loose |
| k15017 | Na`Vi vs FX, Train, SEC 2011 final | R22 1:17 | 742 on starix | loose |
| k15021 | Na`Vi vs FX, Train, SEC 2011 final | R27 C4 0:01 | Zeus /A/ <3 ( 8 ) on 742 | loose |
| k16004 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R5 0:20 | ROMJkE2H^ on starix | loose |
| k16015 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R15 0:16 | edzie on XEK | loose |
| k16020 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R23 C4 0:11 | markeloff ~~~ on Fox | loose |
| k16022 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R24 0:37 | ceh9 /A/ on ROMJkE2H^ | loose |
| k16023 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 1:20 | markeloff ~~~ on ROMJkE2H^ | unsure |
| k16024 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 1:13 | ceh9 /A/ on ED1K | loose |
| k16025 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R25 C4 0:15 | edzie on Fox | loose |
| k16028 | Na`Vi vs Moscow 5, Inferno, DreamHack Winter 2011 | R28 C4 0:22 | Fox on edzie | loose |
| k17000 | Na`Vi vs fnatic, Tuscan, Adepto BH Open 2011 | R2 0:55 | iOANN4[a] <3 BiH on Gux /PiNGU/ | loose |
| k17002 | Na`Vi vs fnatic, Tuscan, Adepto BH Open 2011 | R5 0:39 | markeloff <3 BiH on dsn | loose |
| k18003 | NoA vs Pentagram, Train, 2006 | R5 1:10 | taz[b] on hpx | loose |
| k18017 | NoA vs Pentagram, Train, 2006 | R21 1:09 | neo[t] on zonic'10 -.- | loose |
| k18023 | NoA vs Pentagram, Train, 2006 | R26 1:26 | zonic'10 -.- on kubenB | loose |
| k19009 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R7 0:23 | markeloff ~~~ on Delpan <3 Johan Wedel | loose |
| k19011 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R8 1:27 | ceh9 32-33y on f0rest | loose |
| k19013 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R9 0:04 | markeloff ~~~ on Delpan <3 Johan Wedel | loose |
| k19020 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R19 1:13 | GeT_RiGhT -A- on starix | loose |
| k19021 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R19 0:53 | face on markeloff ~~~ | loose |
| k19025 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R23 1:15 | starix on RobbaN | loose |
| k19027 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R25 1:09 | RobbaN on starix | loose |
| k19028 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R26 0:26 | ceh9 32-33y on GeT_RiGhT -A- | loose |
| k19042 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R39 C4 0:24 | starix on face | loose |
| k19052 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R45 0:24 | GeT_RiGhT -A- on starix | loose |
| k20004 | SK vs WinFakt, Mirage, IEM6 New York | R4 0:37 | face on JiGetus =)DD | loose |
| k20013 | SK vs WinFakt, Mirage, IEM6 New York | R14 1:09 | face on nsutOtO~ | loose |
| k20015 | SK vs WinFakt, Mirage, IEM6 New York | R18 0:20 | GeT_RiGhT -A- on nsutOtO~ | loose |
| k21002 | SK vs dAT, Dust2, IOL Final4 2011 | R6 1:12 | f0rest on STRIKER | loose |
| k21003 | SK vs dAT, Dust2, IOL Final4 2011 | R6 1:06 | RobbaN on rape | loose |
| k21007 | SK vs dAT, Dust2, IOL Final4 2011 | R9 1:03 | STRIKER on f0rest | loose |
| k21009 | SK vs dAT, Dust2, IOL Final4 2011 | R11 1:25 | rape on Delpan4M =DDD | loose |
| k22000 | SK vs eSTRO, Dust2, WCG 2008 | R2 1:10 | walle on solo | loose |
| k22005 | SK vs eSTRO, Dust2, WCG 2008 | R8 1:18 | Tentpole <3 Tezz on hee | loose |
| k22006 | SK vs eSTRO, Dust2, WCG 2008 | R9 0:41 | zet on ari | loose |
| k22007 | SK vs eSTRO, Dust2, WCG 2008 | R12 0:59 | zet on ari | loose |
| k22010 | SK vs eSTRO, Dust2, WCG 2008 | R18 1:22 | allen <3 Sophie on bail | loose |
| k22017 | SK vs eSTRO, Dust2, WCG 2008 | R26 0:04 | RobbaN[alitdg] on termi | loose |
| k23000 | SK vs eSTRO, Dust2, WCG 2008 (-0811081854-, SK players only) | R1 1:35 | Tentpole <3 Tezz on zet | loose |
| k24000 | SK vs eSTRO, Nuke, WCG 2008 | R3 1:27 | allen <3 Sophie on bail | loose |
| k24005 | SK vs eSTRO, Nuke, WCG 2008 | R8 0:44 | termi on zet | loose |
| k24007 | SK vs eSTRO, Nuke, WCG 2008 | R15 1:29 | solo on RobbaN[alitdg] | loose |
| k24008 | SK vs eSTRO, Nuke, WCG 2008 | R17 0:44 | Tentpole <3 Tezz on termi | loose |
| k26002 | SK vs eSTRO, Train, WCG 2008 | R8 1:15 | walle on bail | loose |
| k26005 | SK vs eSTRO, Train, WCG 2008 | R12 1:04 | zet on ari | loose |
| k26010 | SK vs eSTRO, Train, WCG 2008 | R18 1:20 | solo on zet | loose |
| k26014 | SK vs eSTRO, Train, WCG 2008 | R24 1:30 | termi on zet | loose |
| k27001 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R4 1:27 | Gux on KORN | loose |
| k27005 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R14 0:59 | Gux on REAL | loose |
| k27011 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R22 C4 0:09 | Gux on KORN | loose |
| k27012 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R23 1:05 | REAL on Delpan | loose |
| k27016 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R25 0:47 | Gux on kalle | loose |
| k27019 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R26 1:28 | REAL on FoReSt | loose |
| k27021 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R30 0:56 | REAL on FoReSt | loose |
| k28000 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R2 1:25 | B1ad3 _R on RobbaN | loose |
| k28001 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R3 0:55 | SpawN on B1ad3 _R | loose |
| k28003 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R4 1:04 | RobbaN on B1ad3 _R | unsure |
| k28004 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R5 1:06 | sTriKeR on LMBT~R~3A HEHbKY! | loose |
| k28006 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R7 0:44 | cArNaGe! on edzie | loose |
| k28010 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R8 C4 0:19 | edzie on allen | loose |
| k28016 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R14 1:34 | SpawN on LMBT~R~3A HEHbKY! | loose |
| k28019 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R15 1:10 | SpawN on STRIKE | loose |
| k28020 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R15 0:40 | B1ad3 _R on sTriKeR | loose |
| k28021 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R17 1:12 | STRIKE on allen | loose |
| k28024 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R22 1:26 | LMBT~R~3A HEHbKY! on RobbaN | loose |
| k28025 | Sweden vs Ukraine, Train, ClanBase NationsCup XI | R22 C4 0:07 | cArNaGe! on STRIKE | unsure |
| k29002 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803071948-) | R17 1:41 | ROMAN R. on Aleksey K. <LeX> | loose |
| k30000 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R8 1:10 | DaniiL T. <Zeus> on CHEF-KOCH | loose |
| k30001 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R8 0:48 | mooN <M> on DaniiL T. <Zeus> | loose |
| k30007 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R17 C4 0:03 | Ioann S. <Edward> on ROMAN R. | loose |
| k30010 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R20 0:59 | CHEF-KOCH on Roman M. <ROMJkE^> | loose |
| k30011 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R20 0:31 | ROMAN R. on Aleksey K. <LeX> | loose |
| k30012 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R21 C4 0:03 | paN on Viktor F. <Sally^> | loose |
| k30014 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R23 1:34 | Ioann S. <Edward> on paN | loose |
| k30015 | Virtus.pro vs aTTaX, Inferno, Extreme Masters II (-0803072033-) | R25 1:40 | Aleksey K. <LeX> on approx | loose |
| k37000 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R2 1:18 | spekz on DECE[A] * | loose |
| k37001 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R2 1:11 | mUtcb on Darky | loose |
| k37003 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R6 1:25 | DECE[A] * on n0rx     <pacheco> | loose |
| k37005 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R10 1:29 | n0rx     <pacheco> on DECE[A] * | loose |
| k37006 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R11 1:29 | Darky on fox <pacheco> C.N. | loose |
| k37009 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R15 1:10 | SeDaN on fox <pacheco> C.N. | loose |
| k37010 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R15 C4 0:10 | Darky on n0rx     <pacheco> | loose |
| k37013 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R20 C4 0:21 | EneRyYyYy on mUtcb | loose |
| k37015 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R26 1:27 | spekz on szrtech | loose |
| k37016 | k1ck vs eq, Nuke, DreamHack Winter 2011 | R26 1:26 | Darky on spekz | loose |

## Denser hidden check (5 Oct 2026): later evidence

The page no longer opens; its answers are quoted in IDEAS-ARCHIVE.md, the 5 Oct item ("Wallbangs and kill timing"). Later evidence for one of its kills, given by Sujan in chat:

| Demo | Round | Kill | 5 Oct answer | Later evidence |
|---|---|---|---|---|
| SK vs Na`Vi, Train, DreamHack Winter 2011 | R40 1:25 | markeloff on Delpan (AWP headshot, one bullet) | hidden, a wallbang | markeloff's own POV video shows Delpan fully hidden at the shot: https://www.youtube.com/watch?v=hWORUXhxSYM, at 1:07:10. Strict, confirmed by the real game (Sujan, 30 Oct 2026) |

## Wallbang sliver check (30 Oct 2026)

https://claude.ai/artifact/V93PEpQPJFLufvBKy7ZZgw, store collection `answers`. 10 of 10 answered, 30 Oct 2026.

Ten kills the finder doesn't list: some of its sight points see the victim, the crosshair line goes through cover, and the picture from the killer's eye shows under 50 pixels of him. The question for each: at the killing shot, through the killer's eyes at 0.25x, was the victim fully hidden (strict), partly in view (loose), or is it not a wallbang (none)? Names as in the demo; the "|" in the mousesports names is written "\|" so the table holds.

| Card | Demo | Round | Kill | What the page said | Answer | Note |
|---|---|---|---|---|---|---|
| g01 | FX vs eSahara, Dust2, DreamHack Winter 2010 | R18 0:21 | Frag eXecutors  KUBEN[t] on ESAHARA.net RARA | 2 of 15 sight points clear, 41 pixels; crosshair through 24 units; AK-47, 307 units | loose (part of him in view) |  |
| g02 | FX vs mTw, Nuke, Xperia Play 2011, part 2 | R21 C4 0:13 | ave@mymTw.com on Frag eXecutors  PASHA[t] | 2 of 15 sight points clear, 15 pixels; crosshair through 2 units; M4A1 HS, 755 units | loose (part of him in view) |  |
| g03 | Fnatic vs mousesports, Tuscan, ESWC 2011 | R4 1:05 | fnaticMSI Gux <3 pingu on mousesports \| gob  b | 3 of 15 sight points clear, 0 pixels; crosshair through 66 units; DEAGLE, 253 units | strict (fully hidden) |  |
| g04 | SK vs Na`Vi, Train, DreamHack Winter 2011 | R31 C4 0:09 | SK.GeT_RiGhT -A- on Na`Vi markeloff ~~~ | 11 of 15 sight points clear, 0 pixels; crosshair through 4 units; M4A1, 1452 units | none (not a wallbang) | This is a good false-positive or trap to have. What you're seeing is get_right shooting through a railing on in the in-site highway slope. That railing acts only as an obstacle for the player model but you can shoot through it with 100% damage as if there was no railing. It's the same like the inferno railings in one of the sites. This should not however be confused with breakable surfaces like nuke vents where the first bullet damage is a wallbang - which then also breaks the vent cover - and then gives full 100% damage from thereon. |
| g05 | SK vs WinFakt, Mirage, IEM6 New York | R2 1:13 | WinFakt aslak4yoso+M *Allihoppa on SK.face | 3 of 15 sight points clear, 0 pixels; crosshair through 64 units; DEAGLE HS, 603 units | strict (fully hidden) |  |
| g06 | SK vs eSTRO, Nuke, WCG 2008 | R24 C4 0:30 | SKWEDEN RobbaN[alitdg] on KOREA.eSTRO : ari | 3 of 15 sight points clear, 0 pixels; crosshair through 76 units; AK-47, 1301 units | strict (fully hidden) |  |
| g07 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R7 1:12 | SWIIIIIDEEEN  GeT_RiGhT on NORWAY KORN | 3 of 15 sight points clear, 15 pixels; crosshair through 2 units; AK-47 HS, 577 units | loose (part of him in view) |  |
| g08 | Sweden vs Norway, Dust2, ASUS ENC 2010 | R25 0:46 | NORWAY REAL on SWIIIIIDEEEN  alleN | 5 of 15 sight points clear, 0 pixels; crosshair through 46 units; AK-47 HS, 633 units | loose (part of him in view) | In the demo viewer, at the exact same time when I pause the screen when the kill notification comes, I can see some part of his body but it's only for a split second. Your mockup shows no body parts highlighted. I think this happens because he got a headshot in the air which throws the body behind aggressively. |
| g09 | fnatic vs mousesports, Forge, IEM6 Guangzhou final, file 1 | R15 1:28 | fnaticMSI Friis <3 bambi on mousesports \| KARRiGAN | 5 of 15 sight points clear, 26 pixels; crosshair through 8 units; AWP, 1150 units | loose (part of him in view) |  |
| g10 | mousesports vs AGAiN, Inferno, ESWC 2011 final | R24 0:29 | AGAiN  Loord on mousesports \| karriganbOb~ | 5 of 15 sight points clear, 0 pixels; crosshair through 22 units; M4A1, 484 units | strict (fully hidden) | This is also a good example of a visual trap. At the exact killing shot - yes he was fully hidden but right before that almost all of the damage he received was a loose wb (because he was right at the corner of the surface). |

Then, in chat the same day: option A (the picture check on these kills too, under 50 pixels LOOSE), with both guards, and two decisions from the notes on g04 (STATE.md Decisions, Sujan, 30 Oct 2026). Later that day, once option A was built: strict at 0 pixels and LOOSE from 1 to 49 in its place (11 of his 13 answers on these kills fit), and Tentpole on zet (SK vs eSTRO, Dust2, WCG 2008, R1 1:35) loose (STATE.md Decisions). Later still, Sujan withdrew the vent part of his note on g04: breakable surfaces, vents included, are never cover, even for the first bullet (STATE.md Decisions).
