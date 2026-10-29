# Agent brief: cs16-demo-viewer

Read this before the repo's own docs. It is the shortest correct path to working in this repo, and it
is written to be acted on, not argued with.

Verified 29 Oct 2026 against `main` at `afbc051`, VERSION 0.24.0. The repo moves fast: run section 3
before trusting anything below. The evidence for each claim is in `cs16-agent-audit.md` if you have it;
you do not need it to finish the work.

Do **one work item per session**, on its own branch, then stop and report (section 9). Sujan reviews
and merges each one before the next starts.

---

## 1. What this is

A Counter-Strike 1.6 demo viewer that runs entirely in the browser. It reads `.dem` files and the
player's own Half-Life folder (maps, models, sounds), and renders a 2D radar, a 3D replay, a kill
timeline and a wallbang finder. It plays HLTV demos, and POV demos (recorded by a player) are being
brought in as a main feature (work item 6.5). The only build step is `python3 build.py`, with no
dependencies. There is no CI yet.

## 2. Non-negotiable rules

- **`src/` is the source. `index.html` is generated.** Never edit `index.html` by hand. After any
  `src/` change run `python3 build.py` and commit the result.
- **Never bundle Valve's files.** Maps, models, sounds, kill feed icons are read from the player's own
  folder at runtime.
- **Never push to `main`, and never merge, rebase or delete branches.** Create your own branch
  (`docs/...` or `wip/...`), push only that branch, open a pull request, and stop. Sujan merges it on
  GitHub. GitHub Pages deploys from `main`, so `main` is the live site.
- **Do not touch anything in `src/` as part of a docs task.** Docs commits must leave `index.html`
  byte-identical: prove it with `git diff --exit-code -- index.html` after `python3 build.py`.
- **Move, do not rewrite.** When this brief asks you to reorganise documentation, every sentence from
  the old file must still exist somewhere. Paraphrasing loses decisions. "Delete" in this brief always
  means "move to the file that owns it", never "remove from the repo".
- **Never state a fact you have not checked.** This repo has been burned by that, repeatedly. Every
  claim in section 5 has a command attached; run it before you repeat the claim.

## 3. Verify first (about 60 seconds)

```sh
git log -1 --oneline                       # has main moved past afbc051?
cat VERSION
head -3 index.html                         # before 6.3: starts <!doctype html>, no generated banner
python3 build.py && git diff --exit-code -- index.html   # must print nothing: the build is reproducible
git ls-remote --heads origin               # which branches actually exist
wc -c CLAUDE.md AGENTS.md STATE.md README.md CHANGELOG.md IDEAS.md 2>/dev/null
```

If `STATE.md` and `AGENTS.md` both exist, work item 6.1 is already done. If `python3 build.py` changes
`index.html`, stop and report it: that contradicts everything below.

## 4. The repo as it stands

| Thing | Size | Note |
|---|---|---|
| `CHANGELOG.md` | 154 KB | history; never read end to end |
| `IDEAS.md` | 103 KB | 74% is the open-items checklist, and 58 KB of that is already-ticked items |
| `src/template.html` | 320 KB, 4,525 lines | 82% is one inline `<script>` (264 KB); 12% `<style>` (39 KB); 186 functions |
| `src/*.js` | 7 files | already inlined by `build.py` at the `/*PARSER*/`, `/*BSP*/` and `/*VIEW3D*/` markers |
| `index.html` | 480 KB | generated, committed, **no banner saying so** |
| `tests/` | 88 page scripts, 6 python checks | 86 scripts documented in `tests/README.md` |

The two facts that shape all of the work: an agent that follows the old pre-read rule spends about 68k
tokens before reading code, and the file any UI change needs is 320 KB.

## 5. Statements in the repo that are currently false

Do not repeat these, and fix them if your task touches the file.

| Claim | Where | Truth | Check |
|---|---|---|---|
| The release ritual is 5 scripts | `CLAUDE.md` "How each change ships" | It is 6: `panel_click_check.py` is missing from the list but marked "Run on every release" in the test docs and appears in every 0.23.0 and 0.24.0 entry | `grep -n panel_click_check CLAUDE.md tests/README.md` |
| "30 demos on each machine" | `CLAUDE.md`, "Sujan's files" | Counts disagree across three files; the folder has grown since | `grep -rn "30 demos\|34 demos\|37 demos" *.md tests/README.md` |
| `wip/denser-hidden-check` was deleted | `CLAUDE.md`, `IDEAS.md` | Still on the remote at `99c7106`, abandoned. Sujan deletes it on GitHub | `git ls-remote --heads origin` |
| Scripts are for "0.8.0 to 0.11.0" | `tests/README.md` line 3 | They run to 0.24.0 | `head -3 tests/README.md` |
| POV notes are one set on one branch | `CLAUDE.md` | Two sets, synced by duplicate commits | `diff <(git show origin/wip/pov-mode:IDEAS.md) IDEAS.md \| head` |
| Feature names in 'single quotes' (parked item) | `IDEAS.md`, item from 5 Oct 2026 | Replaced on 25 Oct 2026: feature names in **bold**, no quotes (`CLAUDE.md`, writing style). Move the old item to Superseded | `grep -n "single quotes" IDEAS.md` |
| "No glow on wallbang kills in any case" | `IDEAS.md`, the wallbang hits item | Replaced: glow on every hit through cover, killing bullet included, **Glow on hits** checkbox on by default (CHANGELOG 0.24.0) | `grep -n "no glow on wallbang kills" IDEAS.md` |

The claude.ai copy of the viewer still shows 0.23.0 (open item in `IDEAS.md`). Claude Code cannot
republish it; leave the item open for a claude.ai session.

`wip/pov-mode` is 87 commits behind main and 43 ahead, still at 0.16.0, and carries 1.4 MB of
duplicated app and notes. Do not "fix" it by rebasing. Work item 6.5 says what happens to it.

## 6. Work order

Do these in order, one per session. Each has a check so you can skip work already done.

### 6.1 Set up the memory, and make it portable (30 minutes, biggest payoff)

- Check: `ls STATE.md AGENTS.md 2>/dev/null`
- Steps:
  1. If `STATE.md` does not exist, create it with two parts. **Open now:** each open item in one line
     (who does it, what to open, what to look for). **Decisions:** the current answers, one line each
     with a date and the version it shipped in. Keep it under one screen and about 7 KB.
     If a draft of it already exists in the repo or as a patch file, apply that instead of rewriting it.
     Sources, in order: the "Known limits" section of `CHANGELOG.md`, the last two release entries, the
     facts already in `CLAUDE.md`, and the open checklist at the top of `IDEAS.md`. Add nothing that is
     not decided, and no history: a decision that changed is one line for the current answer, with the
     old one in a **Superseded** list at the bottom with the date it was replaced and what replaced it.
     6.2 adds the rest of the decisions as it works through `IDEAS.md`.
  2. Fold in the POV branch's notes, so there is one set from now on: copy the "In progress: POV mode"
     entry from `git show origin/wip/pov-mode:CHANGELOG.md` and the POV-only items from
     `git show origin/wip/pov-mode:IDEAS.md` into main's `IDEAS.md` (under "POV demos"), word for word,
     and add their open items to `STATE.md`. Do not edit the branch.
  3. `git mv CLAUDE.md AGENTS.md`. Then create `CLAUDE.md` with exactly these two lines:
     ```
     @AGENTS.md
     @STATE.md
     ```
     Claude Code expands `@path` imports at launch, so both files load into every session without the
     agent having to choose to read them. (When both `CLAUDE.md` and `AGENTS.md` exist, Claude Code
     reads only `CLAUDE.md` by default, so a plain "Read AGENTS.md" sentence would rely on the agent
     following it.) Other tools read `AGENTS.md` directly.
  4. In `AGENTS.md`, replace the "read these first" rule with: `STATE.md` is already loaded; then read
     the "Known limits" section of `CHANGELOG.md` and the last two release entries, then only the
     `IDEAS.md` item you are about to touch. Add one line saying not to read `CHANGELOG.md` end to end,
     or all of `IDEAS.md`.
  5. In `AGENTS.md` "Recording what Sujan confirms": when Sujan confirms or decides something, update
     its line in `STATE.md` (moving a replaced decision to Superseded) as well as ticking `IDEAS.md`,
     in the same turn, on the current branch. Add: when a claude.ai review page returns answers, copy
     the answers into the repo in the same turn; the page URL stays only as a link to the pictures.
  6. Fix the false statements in section 5 that live in `CLAUDE.md`/`AGENTS.md`. Move anything that
     restates state (demo counts, versions, branch names) out of `AGENTS.md`: demo counts point at the
     demo table in `tests/README.md`, branches at `git ls-remote --heads origin`, the current
     version at `VERSION`. Durable facts stay (the Windows and Mac Half-Life paths, the rules).
- Done when: `STATE.md` exists and is under about 7 KB; `AGENTS.md` holds the rules; `CLAUDE.md` is the
  two import lines; the pre-read rule names `STATE.md`; and
  `python3 build.py && git diff --exit-code -- index.html` is still clean, because this item touches no
  code.
- Why: this is the change that stops a decision being lost, and it cuts the start of every session from
  about 68k tokens to about 10k.

### 6.2 Cut `IDEAS.md` to what is open and archive the rest (the main token fix)

- Check: `wc -c IDEAS.md` (103 KB before, under 25 KB after)
- Steps:
  1. Create `IDEAS-ARCHIVE.md`.
  2. For each open checklist item: keep a three-line header in `IDEAS.md` (`Status`, `Next step`,
     `Decided so far`) plus only what a session needs to resume, and move the rest of the item's text,
     unchanged, into a matching section of `IDEAS-ARCHIVE.md`, newest first. Each `Decided so far`
     answer also gets its line in `STATE.md` (6.1).
  3. For items already ticked: move the whole item, unchanged, to `IDEAS-ARCHIVE.md`, and leave one line
     in `IDEAS.md` (or none, if the release entry in `CHANGELOG.md` covers it) naming the release.
     Ticked items often hold reasoning and Sujan's answers that the changelog does not, so they move;
     they are never dropped.
- Constraints: move text, never rewrite it. No `<details>` element and no collapsing: an agent reads
  the file's text, so a collapsed section costs exactly as many tokens as an open one.
- Done when: `IDEAS.md` is under 25 KB, every open item still says who does what next, and no sentence
  from the old file has been deleted (spot-check with `grep` for a distinctive phrase from each moved
  block in `IDEAS-ARCHIVE.md`).
- Risk: this is the one item where a careless edit can lose a decision. Do it in three commits, by
  checklist block, and stop if a block is ambiguous.

### 6.3 Stamp the build and gate the push (30 minutes)

- Check: `head -3 index.html` and `ls .github/workflows 2>/dev/null`
- Steps:
  1. In `build.py`, put `<!-- Generated by build.py from src/. Do not edit. -->` on the line right after
     `<!doctype html>` in `index.html` (keep the doctype first). This changes `index.html` once, which
     is expected and correct; commit it on its own so later byte-identical checks compare against it.
  2. Add `.github/workflows/check.yml`: run `python3 build.py`, then
     `git diff --exit-code -- index.html`, then the three checks that need no game files:
     `tests/start_screen_check.py`, `tests/prefs_check.py`, `tests/folder_row_test.py`.
  3. The checks need `tests/three.min.js`, which is gitignored; fetch it with
     `npm pack three@0.128.0` and unpack, as `tests/README.md` describes.
- Done when: the workflow exists, and a PR that changes `src/` without rebuilding fails it.
- Do not add a workflow that needs Sujan's Half-Life folder. Only those three checks are portable.

### 6.4 Get the page-store answers into the repo

- Check: `grep -rn "claude.ai/artifact" --include=*.md . | wc -l` (12 references, 6 distinct pages)
- Steps: the answers were pulled from every page's store in a claude.ai session on 29 Oct 2026, into
  `review-answers.md` next to this brief. Copy it into the repo unchanged as `docs/review-answers.md`,
  link it from `AGENTS.md`, and turn each answer that backs a current decision into a line in
  `STATE.md`. One page (`Q9dNFKwNrF37utKP3fGJaM`, the 5 Oct denser hidden check) can no longer be
  opened; its answers are already quoted in `IDEAS.md`. If the file is missing, ask Sujan for it and
  stop: Claude Code cannot read those stores.
- Done when: no decision in the repo depends on a URL as its only home. Keep the URLs as references
  to pictures.

### 6.5 Bring POV mode into main (decided by Sujan, 29 Oct 2026)

Decision: POV mode goes into main behind a **POV mode** setting, **off by default**. With it off, the
viewer behaves exactly as 0.24.0. Sujan checks it on his POV recordings; once he signs it off, it turns
on by default for POV demos. Most users are expected to open POV demos, so this is a main feature.

- Before writing code, present a plan and wait for Sujan's go (this is not a pure move, section 8).
- How: do not rebase or merge the branch. The POV work is small: diff `pov/src/` on `wip/pov-mode`
  against `src/` at the commit the two split from (`git merge-base origin/main origin/wip/pov-mode`,
  `89835e7`): about 590 changed lines, mostly in `view3d.part.js` (395), then `demo.js` (86),
  `players3d.js` (53), `template.html` (37), `audio.js` (19). Port those changes onto current `src/`,
  each behind the setting. Main has changed about 1,200 lines in the same files since, so expect
  conflicts and resolve them toward main's current behaviour.
- Proof it's safe: with the setting off, the HLTV regression set (demo table in `tests/README.md`) gives
  the same scores, K-D and wallbangs as 0.24.0, and all six checks pass. The POV branch's reader was
  already shown to give identical output to main's on HLTV demos; re-check that after the port.
- The "for POV mode too" items in `IDEAS.md` close once POV runs on main's code, except POV-only parts
  (its crosshair, HUD and death cam). List which close and which stay in the report.
- Done when: the setting exists and is off by default, the proof above holds, and Sujan has a list of
  what to check by eye on his POV demos. The branch stays until Sujan deletes it.

### 6.6 Split the inline code out of `src/template.html` (the big one, after 6.5)

- Do this last, so it doesn't collide with the POV port.
- Check: `wc -c src/template.html` (320 KB) and `grep -c '^<script>' src/template.html`
- Steps: move the UI JavaScript out of the one inline `<script>` into `src/ui/*.js`, split by concern.
  The `// ---------------- name ----------------` section comments already in the file are the natural
  cut lines. Insert markers in `template.html` and extend `build.py` to inline each file at its marker,
  exactly the way it already inlines `demo.js` and `view3d.part.js`. Do the same for the `<style>` block
  into `src/app.css`.
- Constraint: **pure move**. No logic change, no renaming, no reformatting, no reordering.
- After every single extraction: `python3 build.py && git diff --exit-code -- index.html` must print
  nothing. If it prints anything, the move was not pure: revert that commit and redo it.
- Done when: `template.html` is under 60 KB, each `src/ui/` file is under 40 KB, and the build output
  is byte-identical to the build before the refactor (`md5sum index.html` before and after).
- Commit one file per commit, so a bad move is one revert.

### 6.7 Smaller cleanups, only if the task asks

- `tests/README.md`: move the demo table to `tests/DEMOS.md` (and update every pointer to it); the
  instructions drop from 47 KB to about 15 KB.
- Add `docs/README.md`: one line per image, so nobody opens a PNG to find out what it is.
- Commit messages from now on: `area: imperative subject`, notes in the body. Do not rewrite history.

## 7. How to verify a change

```sh
python3 build.py && git diff --exit-code -- index.html   # reproducibility (must be clean after a build)
python3 tests/prefs_check.py        # no game files needed
python3 tests/start_screen_check.py # no game files needed
python3 tests/folder_row_test.py    # no game files needed
```

The other three checks (`demo_search_check.py`, `late_kill_timing_check.py`, `panel_click_check.py`)
need `HALF_LIFE_DIR` with Sujan's demos. On Sujan's Mac that is `~/Downloads/Half-Life`, so a session
running there can run all six. Anywhere else, don't run them; say so plainly in your report instead of
claiming a test passed. Say how long a run will take before starting anything over a few minutes.

## 8. Stop and ask before

- Changing anything in `src/` that is not a pure move.
- Any branch operation beyond creating, committing to and pushing your own branch.
- Deleting or rewording existing documentation text rather than moving it.
- Adding a dependency, a workflow step, or a new file at the repo root (beyond `STATE.md`, `AGENTS.md`
  and `IDEAS-ARCHIVE.md`, which this brief approves).
- Anything that will run longer than a few minutes (a full test run, `compare_all.sh` on 50 demos).

## 9. What to report back

Short, in this shape:

1. What you changed, per commit, with the file count and `git diff --stat` total, and the pull request
   link.
2. How you verified it. Quote the actual command output for the build diff and any test you ran. If
   you did not run something, say which and why.
3. What you did not do, and why.
4. Anything you found that contradicts this brief. The brief is dated; the repo is not frozen.
