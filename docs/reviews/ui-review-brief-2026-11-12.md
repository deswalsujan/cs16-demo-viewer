# The brief for the UI review of 12 Nov 2026

Sujan's brief for both reviewers of the "UI can be simpler" review (12 Nov 2026), word for word. The subagent got this text and, after it, the two sentences Sujan added the same day: "Judge only from the screenshots on screenshots/ui-review-2026-11-12 and the live page. Don't open any other file in the repo."

---

You're reviewing the interface of a web app, the CS 1.6 Demo Viewer, to find where it can be simpler. You have no other context, and that is on purpose: judge only what a player sees.

What it is: a browser viewer for Counter-Strike 1.6 demo recordings (.dem files). It reads the player's own Half-Life game folder on their computer (nothing is uploaded, nothing from the game is hosted), then plays HLTV demos (recorded by a spectator server, everyone visible) and POV demos (recorded by one player, through his eyes) in 2D and 3D, with stats, a kill list and a wallbang finder. Who it's for, in the owner's words, is the first line of the README below.

What to look at, and only this:
- The screenshots and their index on the branch screenshots/ui-review-2026-11-12 of https://github.com/deswalsujan/cs16-demo-viewer (README.md there lists every picture and how to reach it).
- The live page, https://deswalsujan.github.io/cs16-demo-viewer/ (without a Half-Life folder you'll only reach the start screen; that's expected).
- Don't read any other file in the repo (no notes, changelogs, plans or docs). They hold past decisions, and this review should not be shaped by them.

Constraints the design must keep: it runs on desktop browsers only (Chrome, Edge, Safari, Firefox; Mac and Windows), never on phones; it needs the player's own game folder; it collects no data; it never hosts the game's files.

Your task: find where the interface can be simpler for (a) a first-time visitor and (b) a regular user who watches demos weekly. Look for options that could be removed, merged, renamed, moved or hidden until needed; labels or words a player wouldn't understand; places where two parts of the app do the same thing differently; screens that ask too much at once. Don't propose new features, unless one replaces something more complicated.

Write your report in plain language, short sentences, no em dashes. Structure:
1. The 15 changes you'd make, ranked by how much simpler they make the app. For each: what and where (picture numbers), what a player would struggle with today and why you think so from the picture, the change you propose, effort (small, medium, large), and what capability, if any, would be lost.
2. Up to 5 things that work well and should not change.
3. After your changes, would a first-visit guided tour still be needed? If yes, what are the 3 to 6 moments it must cover.
4. Anything you couldn't judge from the pictures, and what you'd need to see.
