# Hold-out demo manifest

The hold-out demos (Sujan, 2 Nov 2026): 11 demos in `~/code/cs16-data/holdout-demos` on Sujan's Mac, kept apart so that no change to the viewer is ever tuned on them. They are never in the Half-Life folder's `cstrike`, `DEMO_DIRS`, `compare_all.sh` or any other test, and no session opens, parses or analyses them unless Sujan asks for a hold-out score (`AGENTS.md`, "Sujan's files"). They aren't test demos, so they aren't in `tests/DEMOS.md` or `tests/demos-manifest.md`.

Each demo's size and SHA-256, so a copy of the folder can be checked. Computed on 2 Nov 2026 with `shasum -a 256` and the file sizes only, which read the bytes without parsing anything (Sujan's instruction). 11 demos, 387,838,157 bytes (388 MB).

The events aren't checked, since checking them means opening the demos: "From the file name" is all that's known, and Sujan's answers can name them. Sujan writes answers for the 4 marked **answers first**; the other 7 are **reserves**, each replacing a hold-out demo once that one is used to fix something. A hold-out demo used to fix a bug moves to `~/code/cs16-data/test-demos`, with its rows in `tests/DEMOS.md` and `tests/demos-manifest.md`, and its row here says so with the date (Sujan, 1 Nov 2026).

| Demo file | Bytes | SHA-256 | From the file name | Status |
|---|---|---|---|---|
| `1110231130--auto_de_mirage.dem_Anexis-vs-NAVI.dem` | 32,772,155 | `80fad4e0db1dd2861f376a9b390b6790ac9c41acba1e11f826f0f16d938e619c` | Anexis vs Na`Vi, Mirage, recorded 23 Oct 2011 | reserve |
| `chinaswedendust2-1112091815-de_dust2.dem` | 29,449,313 | `396bb74479756de51a68a6561fa8c82495fa43931a9dc0fcbd0d258a46b8d9f5` | China vs Sweden, Dust2, recorded 9 Dec 2011 | reserve |
| `koreamoscownuke-1112091644-de_nuke.dem` | 26,355,538 | `4a0e1f7efb18bace8bf3fee09f3df75164d2b2a3d5160536abb7bfc495193f54` | Korea vs Moscow, Nuke, recorded 9 Dec 2011 | **answers first** |
| `moscowkoreainferno-1112091731-de_inferno.dem` | 25,593,251 | `3021e073bb3489d927c5fc4f732a39ae6f360b755e51050df33a2ba1efa6bfa9` | Moscow vs Korea, Inferno, recorded 9 Dec 2011 | reserve |
| `navi-vs-sk-iem6kiev-1112181845-de_mirage.dem` | 16,941,146 | `a4aa970f80fb72fd2b8e7be48b298ca5ac2ef84904dece9c0d18eaa1e70032ff` | Na`Vi vs SK, Mirage, IEM6 Kiev, recorded 18 Dec 2011 | reserve |
| `sk_vs_tpusports_arbaleteu-0912061106-de_tuscan.dem` | 24,404,976 | `811b491108f8b517135dcdd71ecdd0af63ed8591f958183ea21596df00071fbd` | SK vs tpusports, Tuscan, "arbaleteu", recorded 6 Dec 2009 | **answers first** |
| `sk-vs-winfakt-iem6kiev-1112181349-de_mirage.dem` | 101,234,980 | `61602ab29c283d7ee9ed8724ba4ad12e1c6aefd633419b483d48e13fd78f5e2a` | SK vs winfakt, Mirage, IEM6 Kiev, recorded 18 Dec 2011 | reserve |
| `sk.eg.nixwtf-0912061520-de_dust2.dem` | 35,212,820 | `be0a74d941c042dcf3a83c0c0b2fbdb666dc8eac7e0bd03659fd176215cada26` | SK vs EG, Dust2, "nixwtf", recorded 6 Dec 2009 | **answers first** |
| `swedenchinainferno-1112091645-de_inferno.dem` | 31,938,592 | `bb652dedb5cf2e714685f13ba614a4562a7968b042fd8a9395cb7ae33860ecb8` | Sweden vs China, Inferno, recorded 9 Dec 2011 | **answers first** |
| `swedenchinanuke-1112091737-de_nuke.dem` | 24,612,961 | `e27fb673fb35d191d6668d8051daa573e878d20f57dd8e86db267f1b5255d96d` | Sweden vs China, Nuke, recorded 9 Dec 2011 | reserve |
| `swedenpolanddust2-1112111108-de_dust2.dem` | 39,322,425 | `96fc8e239fe642a7e59123a8d5472d18ac8b32519c6b4178bc9ee201be204d43` | Sweden vs Poland, Dust2, recorded 11 Dec 2011 | reserve |

To check a copy (Sujan, or a session he asks; it hashes the files and nothing else):

```
cd ~/code/cs16-data/holdout-demos && shasum -a 256 *.dem
```

and compare the hashes with the table.
