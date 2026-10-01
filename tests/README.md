# Tests and measurements (1 Oct 2026)

Scripts used while building 0.8.0 to 0.11.0. They're kept as a starting point for the test suite in [IDEAS.md](../IDEAS.md), not yet wired up to run on their own: paths to the Half-Life folder and to a local copy of three.js r128 are hard-coded at the top of each, and need changing for your machine.

Browser checks (Python + Playwright, headless Chromium):
- `harness.py` loads a built page, feeds it a Half-Life folder, opens the Na`Vi vs FX Dust2 demo, waits for the 3D map, then runs one or more page scripts and prints what they return. Usage: `python3 harness.py index.html script.js[,script2.js] [screenshot prefix]`. It copies the page and adds a small hook (`window.__v`) so scripts can reach the viewer's internals; the shipped page is never changed.
- `measure.js` smoothness and per-frame cost in Player's eyes (the 0.8.0 numbers).
- `aim_check.js`, `hs_bias.js` how far the crosshair is from the victim at kills, and whether misses lean one way (CHANGELOG 0.10.0, "Discussed, not changed").
- `scope_check.js` sniper zoom labels and a look through the scope.
- `theatre_test.py` the 39 Theatre mode checks across five screen setups (about 45 minutes for all five). `all_test.py` the quick 0.9.2 check that all panels come and go together.

Demo data checks (Node, run against `src/demo.js` with a few lines added to record extra data; see each file):
- `fields.mjs` which player fields change when zoom clicks happen (none do).
- `zoom.mjs`, `resume.mjs`, `qs.mjs` zoom clicks around sniper kills, whether the scope comes back after a shot, and the quick-switch check.

Lesson: the headless browser draws 3D without a graphics chip, so it's slow, and checks that wait a fixed time can fail there and pass on a real machine. Wait for the outcome instead, and confirm timing failures by hand before chasing them.
