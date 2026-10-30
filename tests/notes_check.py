"""The notes agree with the repo (agent brief of 30 Oct 2026, "Notes consistency check"). No game files needed.

Checks, each failure printed as "file:line: what's wrong", exit code 1 on any:
- every path in backticks in STATE.md, AGENTS.md, IDEAS.md and README.md is a tracked file or folder, or ends one
  (`page/regress_summary.js`, `folder_row_test.py`), so a fresh clone gives the same result as a working copy. Left
  out: branch names, the player's game folder, build output in `dist/` (gitignored), placeholders and the few paths
  in IGNORE;
- the newest version in CHANGELOG.md is `VERSION`;
- no CHANGELOG entry at or above `VERSION` says "until then", "not yet decided" or "In progress", and an unshipped
  "In progress" entry is only on a `wip/` branch;
- every file in `src/` has a line in AGENTS.md, "Where the code is".

Usage: python3 notes_check.py   (from anywhere; it reads the repo it's in)
"""
import os, re, subprocess, sys

root = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
NOTES = ['STATE.md', 'AGENTS.md', 'IDEAS.md', 'README.md']
# a backtick token is taken as a path when it has no spaces and has a slash or a file extension
EXT = re.compile(r'\.(md|js|mjs|py|html|json|yml|yaml|txt|sh|css|png|jpg|svg)$')
# paths that aren't the repo's: branches, the player's Half-Life folder and its files, build.py's output in dist/
# (gitignored, so a fresh clone has none until it builds), placeholders
NOT_REPO = re.compile(r'^(wip/|origin/|refs/|~|/|https?:)|[<>*{}]|\.\.\.|^(cstrike|cstrike_downloads|valve|dist)(/|$)|\.(cfg|dem|bsp|wad|mdl|wav|spr)$')
# the short list of paths named on purpose that aren't in the repo
IGNORE = {
    'regamedll/dlls/wpn_shared/wpn_<gun>.cpp',  # ReGameDLL's own source (AGENTS.md, "Facts")
}


def git(*a):
    return subprocess.run(['git', '-C', root, *a], capture_output=True, text=True).stdout


def branch():
    return os.environ.get('GITHUB_HEAD_REF') or os.environ.get('GITHUB_REF_NAME') or git('rev-parse', '--abbrev-ref', 'HEAD').strip()


def vkey(v):
    return tuple(int(x) for x in v.split('.'))


fails = []
tracked = git('ls-files').split()
dirs = {d for p in tracked for d in [os.path.dirname(p)] if d}
dirs |= {'/'.join(d.split('/')[:i]) for d in list(dirs) for i in range(1, d.count('/') + 1)}

# 1. paths in backticks
for f in NOTES:
    for n, line in enumerate(open(os.path.join(root, f), encoding='utf-8'), 1):
        for t in re.findall(r'`([^`\n]+)`', line):
            if ' ' in t or not ('/' in t or EXT.search(t)) or t in IGNORE or NOT_REPO.search(t):
                continue
            p = t.rstrip('/')
            # tracked only: a gitignored file on this disk (dist/, tests/three.min.js) isn't in a fresh clone
            if any(x == p or x.endswith('/' + p) for x in tracked) or any(d == p or d.endswith('/' + p) for d in dirs):
                continue
            fails.append(f'{f}:{n}: `{t}` is not in the repo')

# 2 and 3. the changelog against VERSION
version = open(os.path.join(root, 'VERSION'), encoding='utf-8').read().strip()
cl = open(os.path.join(root, 'CHANGELOG.md'), encoding='utf-8').read().split('\n')
heads = [(i + 1, l[3:]) for i, l in enumerate(cl) if l.startswith('## ')] + [(len(cl) + 1, None)]
versions = [(n, re.match(r'\d+\.\d+\.\d+', h).group()) for n, h in heads[:-1] if re.match(r'\d+\.\d+\.\d+', h)]
if not versions:
    fails.append('CHANGELOG.md:1: no version heading ("## 1.2.3 (date)")')
elif versions[0][1] != version:
    fails.append(f'CHANGELOG.md:{versions[0][0]}: the newest version is {versions[0][1]}, VERSION says {version}')
for (n, h), (end, _) in zip(heads, heads[1:]):
    if h.lower().startswith('in progress'):
        if not branch().startswith('wip/'):
            fails.append(f'CHANGELOG.md:{n}: an "In progress" entry, on branch {branch()} (only a wip/ branch may have one)')
        continue
    m = re.match(r'\d+\.\d+\.\d+', h)
    if not m or vkey(m.group()) < vkey(version):
        continue
    for k in range(n, end - 1):
        for phrase, flags in (('until then', re.I), ('not yet decided', re.I), ('In progress', 0)):
            if re.search(re.escape(phrase), cl[k], flags):
                fails.append(f'CHANGELOG.md:{k + 1}: "{phrase}" in the {m.group()} entry')

# 4. the code map
agents = open(os.path.join(root, 'AGENTS.md'), encoding='utf-8').read().split('\n')
start = next((i for i, l in enumerate(agents) if l.startswith('## Where the code is')), None)
if start is None:
    fails.append('AGENTS.md:1: no "## Where the code is" section')
else:
    end = next((i for i in range(start + 1, len(agents)) if agents[i].startswith('## ')), len(agents))
    named = {m.group(1) for l in agents[start:end] for m in [re.match(r'- `(src/[^`]+)`', l)] if m}
    for p in sorted(x for x in tracked if x.startswith('src/')):
        if p not in named:
            fails.append(f'AGENTS.md:{start + 1}: no line for `{p}` in "Where the code is"')

for f in fails:
    print('FAIL', f)
print(f'FAIL: {len(fails)} found' if fails else 'PASS: paths in the notes, CHANGELOG against VERSION, the code map')
sys.exit(1 if fails else 0)
