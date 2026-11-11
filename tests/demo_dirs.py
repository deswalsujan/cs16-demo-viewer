"""Where the tests find demos: every .dem in HALF_LIFE_DIR (anywhere in it, as the viewer lists them) and in the
DEMO_DIRS folders (subfolders included; separated by ":", ";" on Windows). On Sujan's Mac the test demos are in
~/code/cs16-data/test-demos, outside the Half-Life folder, since 1 Nov 2026 (tests/README.md, "Settings").

The viewer only lists the demos in the folder it's given, so when DEMO_DIRS adds any, the tests give it an APFS clone
of the Half-Life folder with those demos added to its cstrike (macOS; no disk space, under a second), or a copy made
of hard links elsewhere, deleted when the test ends. A byte-identical copy of a demo already there is left out; two
different demos with one file name stop the test (Sujan, 1 Nov 2026).

Used by harness.py, ground_truth_check.py, compare_all.sh, demo_search_check.py, panel_click_check.py and the Theatre
checks.

The hold-out guard (Sujan, 2 Nov 2026): every test stops when a hold-out demo (tests/holdout-manifest.md) is among the
demos it finds in HALF_LIFE_DIR or DEMO_DIRS, by its name, by a folder named holdout-demos, or by its size and SHA-256
(a renamed copy). Only holdout_score.py lets them through, for its own run (HOLDOUT_SCORE=1). Sujan copies a hold-out
demo into cstrike to watch it in the game; the tests stop until the copy is deleted. On its own (no browser):
  python3 demo_dirs.py list              every demo's file name, one per line, the Half-Life folder's first
  python3 demo_dirs.py expected          every demo of tests/expected/ (joined parts too) is found by SHA-256
  python3 demo_dirs.py check FOLDER...   the folders against tests/demos-manifest.md: every test demo found by
                                         SHA-256 under any name or subfolder (a backup copy, say); no settings needed
Exit code 1 when a demo is missing.
"""
import atexit, glob, hashlib, json, os, re, shutil, subprocess, sys, tempfile

here = os.path.dirname(os.path.abspath(__file__))
MANIFEST = os.path.join(here, 'demos-manifest.md')
HOLDOUT_MANIFEST = os.path.join(here, 'holdout-manifest.md')


def fail(msg):
    sys.exit('demo_dirs: ' + msg)


def half_life():
    """HALF_LIFE_DIR, checked"""
    if os.environ.get('EXTRA_DEMO_DIRS'):
        fail('EXTRA_DEMO_DIRS was renamed DEMO_DIRS on 1 Nov 2026 (tests/README.md, "Settings"): set DEMO_DIRS instead')
    hl = os.path.abspath(os.path.expanduser(os.environ.get('HALF_LIFE_DIR', '')))
    if not os.environ.get('HALF_LIFE_DIR') or not os.path.isdir(os.path.join(hl, 'cstrike')):
        fail(f"set HALF_LIFE_DIR to the Half-Life folder, the one with cstrike (now: {os.environ.get('HALF_LIFE_DIR') or 'not set'})")
    return hl


def demo_dirs():
    """the DEMO_DIRS folders, checked: a mistyped one would quietly find fewer demos"""
    dirs = [os.path.abspath(os.path.expanduser(d.strip())) for d in os.environ.get('DEMO_DIRS', '').split(os.pathsep) if d.strip()]
    for d in dirs:
        if not os.path.isdir(d):
            fail(f'a DEMO_DIRS folder does not exist: {d}')
    return dirs


def dems(folder):
    """every .dem under folder, subfolders included, in a fixed order"""
    out = []
    for root, sub, names in os.walk(folder):
        sub.sort()
        out += [os.path.join(root, n) for n in sorted(names) if n.lower().endswith('.dem')]
    return out


_sha = {}


def sha256(path):
    st = os.stat(path)
    key = (os.path.realpath(path), st.st_size, st.st_mtime_ns)
    if key not in _sha:
        h = hashlib.sha256()
        with open(path, 'rb') as f:
            for b in iter(lambda: f.read(1 << 20), b''):
                h.update(b)
        _sha[key] = h.hexdigest()
    return _sha[key]


def manifest_rows(path):
    """[(file name, bytes, sha256)] from a manifest table: demos-manifest.md or holdout-manifest.md"""
    rows = []
    with open(path, encoding='utf-8') as f:
        for line in f:
            m = re.match(r'\|\s*`([^`]+\.dem)`\s*\|\s*([\d,]+)\s*\|\s*`([0-9a-f]{64})`', line)
            if m:
                rows.append((m.group(1), int(m.group(2).replace(',', '')), m.group(3)))
    return rows


def holdout_guard(paths):
    """stop when a hold-out demo is among paths: by name (any case), a folder named holdout-demos, or size and SHA-256.
    Reads only tests/holdout-manifest.md, never the hold-out folder; a file is hashed only when its size is a hold-out
    demo's. HOLDOUT_SCORE=1 (set by holdout_score.py alone) lets them through."""
    if os.environ.get('HOLDOUT_SCORE') == '1' or not os.path.exists(HOLDOUT_MANIFEST):
        return
    rows = manifest_rows(HOLDOUT_MANIFEST)
    names, sizes = {n.lower() for n, _, _ in rows}, {}
    for n, size, h in rows:
        sizes.setdefault(size, set()).add(h)
    hits = []
    for p in paths:
        n = os.path.basename(p).lower()
        if n in names or 'holdout-demos' in os.path.normpath(p).lower().split(os.sep):
            hits.append(p)
        elif os.path.getsize(p) in sizes and sha256(p) in sizes[os.path.getsize(p)]:
            hits.append(p)
    if hits:
        fail('a hold-out demo is where the tests look (AGENTS.md, "Hold-out demos"; tests/holdout-manifest.md):\n  '
             + '\n  '.join(hits) + '\nHold-out demos stay in ~/code/cs16-data/holdout-demos. A copy put in cstrike to '
             'watch it in the game: delete it, then run the test again.')


def collect():
    """(hl, inside, outside): the Half-Life folder, its demos, and the DEMO_DIRS demos the viewer is to get on top.
    A DEMO_DIRS demo byte-identical to one already taken is left out; two different demos with one name (any case:
    the viewer and macOS match names that way) stop here."""
    hl = half_life()
    dirs = demo_dirs()
    inside = dems(hl)
    cand = inside + [p for d in dirs for p in dems(d)]
    holdout_guard(cand)
    sizes = {}
    for p in cand:
        sizes.setdefault(os.path.getsize(p), []).append(p)
    same = lambda a, b: os.path.getsize(a) == os.path.getsize(b) and sha256(a) == sha256(b)
    taken, outside = {}, []
    for p in cand:
        mine = p in inside
        twins = [q for q in sizes[os.path.getsize(p)] if q != p and q in taken.values()]
        if not mine and any(same(p, q) for q in twins):
            continue
        n = os.path.basename(p).lower()
        if n in taken and not same(p, taken[n]):
            fail(f'two different demos named {os.path.basename(p)}:\n  {taken[n]}\n  {p}\nRename or remove one.')
        taken.setdefault(n, p)
        if not mine:
            outside.append(p)
    return hl, inside, outside


def names(inside, outside):
    """file names as the viewer lists them, one per demo (identical copies inside the Half-Life folder once)"""
    seen, out = set(), []
    for p in inside + outside:
        n = os.path.basename(p)
        if n.lower() not in seen:
            seen.add(n.lower())
            out.append(n)
    return out


def find(part, inside, outside):
    """the one demo whose file name is `part` (with or without .dem) or contains it; several or none stop here"""
    want = part.lower()
    all_ = names(inside, outside)
    exact = [n for n in all_ if n.lower() in (want, want + '.dem')]
    if exact:
        return exact[0]
    hits = [n for n in all_ if want in n.lower()]
    if len(hits) == 1:
        return hits[0]
    if not hits:
        fail(f'no demo name contains "{part}" in HALF_LIFE_DIR or DEMO_DIRS ({len(all_)} demos)')
    fail(f'{len(hits)} demos match "{part}"; set DEMO to more of the name:\n  ' + '\n  '.join(hits))


def stage(outside):
    """the folder to give the viewer: HALF_LIFE_DIR itself when DEMO_DIRS adds nothing, else a clone of it with
    `outside` in its cstrike, deleted when this process ends"""
    hl = half_life()
    if not outside:
        return hl
    tmp = tempfile.mkdtemp(prefix='demo_dirs_')
    atexit.register(shutil.rmtree, tmp, True)
    dst = os.path.join(tmp, 'Half-Life')
    # cp -c is an APFS clone on macOS only (GNU cp's -c is something else and would copy everything)
    if not (sys.platform == 'darwin' and subprocess.run(['cp', '-cpR', hl, dst], capture_output=True).returncode == 0):
        shutil.rmtree(dst, ignore_errors=True)
        try:
            shutil.copytree(hl, dst, copy_function=os.link)
        except OSError as e:
            fail(f"can't add the DEMO_DIRS demos here: no APFS clone or hard link from {hl} to {tmp} ({e}). "
                 'Put the demos in the Half-Life folder\'s cstrike, or unset DEMO_DIRS.')
    for p in outside:
        to = os.path.join(dst, 'cstrike', os.path.basename(p))
        if not (sys.platform == 'darwin' and subprocess.run(['cp', '-cp', p, to], capture_output=True).returncode == 0):
            try:
                os.link(p, to)
            except OSError as e:
                fail(f"can't add {p} to the staged folder ({e})")
    return dst


def expected():
    """[(sha256, demo name, match)] of every demo tests/expected/ needs, joined parts included"""
    out = []
    for f in sorted(glob.glob(os.path.join(here, 'expected', '*.json'))):
        with open(f) as fh:
            w = json.load(fh)
        out.append((w['sha256'], w['demo'], w['match']))
        if 'joined' in w:
            for h, n in zip(w['joined']['sha256'], w['joined']['parts']):
                if h != w['sha256']:
                    out.append((h, n, w['match'] + ', joined part'))
    seen = set()
    return [e for e in out if not (e[0] in seen or seen.add(e[0]))]


def manifest():
    """[(file name, bytes, sha256)] from tests/demos-manifest.md"""
    return manifest_rows(MANIFEST)


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'list':
        hl, inside, outside = collect()
        print('\n'.join(names(inside, outside)))
    elif cmd == 'expected':
        hl, inside, outside = collect()
        found = {}
        for p in inside + outside:
            found.setdefault(sha256(p), p)
        want = expected()
        miss = [e for e in want if e[0] not in found]
        for h, n, match in miss:
            print(f'MISSING {n} ({match}), sha256 {h}')
        moved = [(n, found[h]) for h, n, _ in want if h in found and os.path.basename(found[h]) != n]
        for n, p in moved:
            print(f'NOTE {n} found as {p}')
        print(f'{len(want) - len(miss)} of {len(want)} demos of tests/expected/ found by SHA-256 in {hl}'
              + ''.join(f' and {d}' for d in demo_dirs()))
        print('FAIL' if miss else 'PASS')
        sys.exit(1 if miss else 0)
    elif cmd == 'check' and len(sys.argv) > 2:
        rows = manifest()
        paths = []
        for d in sys.argv[2:]:
            if not os.path.isdir(os.path.expanduser(d)):
                fail(f'not a folder: {d}')
            paths += dems(os.path.expanduser(d))
        holdout_guard(paths)
        by_size = {}
        for p in paths:
            by_size.setdefault(os.path.getsize(p), []).append(p)
        found, miss = {}, []
        for n, size, h in rows:
            hit = next((p for p in by_size.get(size, []) if sha256(p) == h), None)
            if hit:
                found[h] = hit
                if os.path.basename(hit) != n:
                    print(f'NOTE {n} found under another name: {hit}')
            else:
                miss.append(n)
                print(f'MISSING {n} ({size:,} bytes)')
        known = set(found.values())
        extra = [p for p in paths if p not in known]
        for p in extra:
            h = sha256(p)
            print(f'COPY {p} (the same bytes as {os.path.basename(found[h])})' if h in found else f'NOT IN THE MANIFEST {p}')
        print(f'{len(rows) - len(miss)} of {len(rows)} demos of tests/demos-manifest.md found by SHA-256, '
              f'{len(extra)} other .dem files (copies and demos not listed)')
        print('FAIL' if miss else 'PASS')
        sys.exit(1 if miss else 0)
    else:
        print(__doc__)
        sys.exit(2)


if __name__ == '__main__':
    main()
