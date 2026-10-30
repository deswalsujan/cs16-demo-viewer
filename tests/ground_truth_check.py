"""Fails when the viewer stops agreeing with what Sujan confirmed about wallbangs, scores and K-D.

tests/expected/ holds one file per demo, named by the demo's file name without .dem: its SHA-256, event, map, the
expected score and live rounds, the K-D numbers Sujan confirmed, and kills with round, timer, killer, victim, gun and
expected (strict, loose, loose-damage, none, or wallbang: strict or loose of either kind), each with its source. A
joined map's numbers sit under "joined" in its first part's file; numbers with Count them on, under "count_them". A
kill is found by round, killer and victim, names exactly as the viewer has them (a player dies once a round); timer
and gun are compared only where the file has them. A kill with "known_gap" is printed when it differs, never failed.
How the files were filled: tests/README.md, "Wallbang ground truth" (Sujan, 30 Oct 2026).

Usage:  HALF_LIFE_DIR=~/Downloads/Half-Life python3 ground_truth_check.py [--demo TEXT] [--save DIR] [page.html]
Runs every expected file whose demo is found, on every release (1.3 minutes for 45 demos on Sujan's Mac, 30 Oct
2026; Sujan dropped a quicker run on 5 of them the same day). Looks in HALF_LIFE_DIR's cstrike and under
EXTRA_DEMO_DIRS (folders separated by ":", subfolders included); those demos go into an APFS clone of HALF_LIFE_DIR
for the run (macOS; it takes no disk space), as for 0.25.0's comparison.
  --demo TEXT: only the expected files whose name contains TEXT.   --save DIR: keep each run's output there.
Demos are matched by hash; a missing demo, or one whose map isn't in the folder, is skipped with a note. JOBS runs at
once (default 6), TIMEOUT seconds each (default 600). Needs game files, so it can't run in check.yml. Exit 1 on any
mismatch.
"""
import argparse, glob, hashlib, json, os, shutil, subprocess, sys, tempfile, time
from concurrent.futures import ThreadPoolExecutor

here = os.path.dirname(os.path.abspath(__file__))
LEVELS = {'strict', 'loose', 'loose-damage', 'none', 'wallbang'}


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for b in iter(lambda: f.read(1 << 20), b''):
            h.update(b)
    return h.hexdigest()


def find_demos(hl, extra_dirs):
    """{sha256: path} of every demo found, the Half-Life folder's first"""
    paths = sorted(p for p in glob.glob(os.path.join(hl, 'cstrike', '*')) if p.lower().endswith('.dem'))
    for d in extra_dirs:
        paths += sorted(p for p in glob.glob(os.path.join(d, '**', '*'), recursive=True) if p.lower().endswith('.dem'))
    found = {}
    for p in paths:
        found.setdefault(sha256(p), p)
    return found


def maps_in(hl):
    return {os.path.basename(p).lower()[:-4] for p in glob.glob(os.path.join(hl, '*', 'maps', '*')) if p.lower().endswith('.bsp')}


def clone_with(hl, extra):
    """an APFS clone of the Half-Life folder with the demos in `extra` added to its cstrike, or None"""
    tmp = tempfile.mkdtemp(prefix='ground_truth_')
    dst = os.path.join(tmp, 'Half-Life')
    if subprocess.run(['cp', '-cR', hl, dst], capture_output=True).returncode:
        shutil.rmtree(tmp, ignore_errors=True)
        return None, None
    for p in extra:
        subprocess.run(['cp', '-c', p, os.path.join(dst, 'cstrike', os.path.basename(p))], check=True)
    return dst, tmp


def harness(page, scripts, demo, folder, work, n, gt=None, save=None):
    """one harness.py run: the JSON each script returned, and any page errors"""
    copy = os.path.join(work, f'gt_{n}.html')
    shutil.copy(page, copy)
    paths = []
    if gt is not None:
        paths.append(os.path.join(work, f'gt_{n}_set.js'))
        with open(paths[0], 'w') as f:
            f.write(f'window.__gt = {json.dumps(gt)};\n')
    paths += [os.path.join(here, 'page', s) for s in scripts]
    env = dict(os.environ, DEMO=demo.lower(), MAP_NEEDED='0', HALF_LIFE_DIR=folder)
    try:
        p = subprocess.run([sys.executable, os.path.join(here, 'harness.py'), copy, ','.join(paths)], env=env,
                           capture_output=True, text=True, timeout=int(os.environ.get('TIMEOUT', 600)))
        out, err = p.stdout, p.stderr
    except subprocess.TimeoutExpired as e:
        out = e.stdout.decode(errors='replace') if isinstance(e.stdout, bytes) else (e.stdout or '')
        err = 'timed out'
    if save:
        with open(os.path.join(save, f'{n}_{demo[:-4]}.out'), 'w') as f:
            f.write(out + '\n' + err)
    res = []
    for line in out.splitlines():
        try:
            d = json.loads(line)
        except ValueError:
            continue
        if isinstance(d, dict):
            res.append(d)
    errors = out.split('PAGE ERRORS:', 1)[1].strip() if 'PAGE ERRORS:' in out else ''
    return res, errors, err


def kd_of(lines):
    return {l.rsplit(' ', 1)[0]: l.rsplit(' ', 1)[1] for l in lines}


def score_ok(want, got):
    """"16:4", or with any_order the two numbers either way round (a source that names only the winner)"""
    if want.get('any_order'):
        return sorted(want['value'].split(':')) == sorted(got.split(':'))
    return want['value'] == got


def check_totals(label, want, got, fails):
    n = 0
    if 'score' in want:
        n += 1
        if not score_ok(want['score'], got['score']):
            fails.append(f"{label}, score: expected {want['score']['value']}, got {got['score']}")
        if 'live' in want['score'] and want['score']['live'] != got['live']:
            fails.append(f"{label}, live rounds: expected {want['score']['live']}, got {got['live']}")
    have = kd_of(got['kd'])
    for e in want.get('kd', []):
        n += 1
        if have.get(e['player']) != e['kd']:
            fails.append(f"{label}, K-D of {e['player']}: expected {e['kd']}, got {have.get(e['player'], 'no such player')}")
    return n


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('page', nargs='?', default=os.path.join(here, '..', 'index.html'))
    ap.add_argument('--demo', default='')
    ap.add_argument('--save')
    a = ap.parse_args()
    hl = os.path.abspath(os.path.expanduser(os.environ.get('HALF_LIFE_DIR', '')))
    if not os.path.isdir(os.path.join(hl, 'cstrike')):
        sys.exit('Set HALF_LIFE_DIR to the Half-Life folder (the one with cstrike)')
    extra_dirs = [os.path.expanduser(d) for d in os.environ.get('EXTRA_DEMO_DIRS', '').split(':') if d]
    page = os.path.abspath(a.page)
    t0 = time.time()

    want = []
    for p in sorted(glob.glob(os.path.join(here, 'expected', '*.json'))):
        if a.demo.lower() in os.path.basename(p).lower():
            with open(p) as f:
                want.append(json.load(f))
    for w in want:
        bad = [k for k in w['kills'] if k['expected'] not in LEVELS or not k.get('source')]
        if bad:
            sys.exit(f"{w['demo']}: a kill with an unknown expected value or no source: {bad[0]}")

    found = find_demos(hl, extra_dirs)
    maps = maps_in(hl)
    in_hl = lambda p: os.path.dirname(p) == os.path.join(hl, 'cstrike')
    notes, runs = [], []
    for w in want:
        need = [w['sha256']] + (w['joined']['sha256'] if 'joined' in w else [])
        missing = [h for h in need if h not in found]
        if missing:
            notes.append(f"skipped {w['match']} ({w['demo']}): {'demo' if w['sha256'] in missing else 'a part of the joined map'} not found")
            continue
        if w['map'].lower() not in maps:
            notes.append(f"skipped {w['match']} ({w['demo']}): map {w['map']} not in the Half-Life folder")
            continue
        runs.append(w)

    extra = sorted({found[h] for w in runs for h in [w['sha256']] + w.get('joined', {}).get('sha256', []) if not in_hl(found[h])})
    folder, tmp = hl, None
    if extra:
        folder, tmp = clone_with(hl, extra)
        if not folder:
            notes.append('skipped the demos outside the Half-Life folder: an APFS clone (cp -c) did not work here')
            runs = [w for w in runs if in_hl(found[w['sha256']])]
            folder = hl
    name = lambda h: os.path.basename(found[h])
    jobs = []
    for w in runs:
        jobs.append((w, 'main', name(w['sha256']), ['regress_summary.js', 'ground_truth_kills.js'], None))
        if 'count_them' in w:
            jobs.append((w, 'count_them', name(w['sha256']), ['ground_truth_totals.js'], {'count30': True}))
        if 'joined' in w:
            parts = [name(h) for h in w['joined']['sha256']]
            jobs.append((w, 'joined', parts[0], ['ground_truth_totals.js'], {'parts': [p.lower() for p in parts]}))
    print(f"{len(runs)} of {len(want)} expected files, {len(jobs)} runs, {os.environ.get('JOBS', 6)} at a time", flush=True)

    work = tempfile.mkdtemp(prefix='ground_truth_pages_')
    if a.save:
        os.makedirs(a.save, exist_ok=True)
    try:
        with ThreadPoolExecutor(int(os.environ.get('JOBS', 6))) as ex:
            results = list(ex.map(lambda ij: harness(page, ij[1][3], ij[1][2], folder, work, ij[0], ij[1][4], a.save), enumerate(jobs)))
    finally:
        shutil.rmtree(work, ignore_errors=True)
        if tmp:
            shutil.rmtree(tmp, ignore_errors=True)

    fails, gaps, count = [], [], {'kills': 0, 'totals': 0}
    for (w, kind, demo, _, _), (res, errors, err) in zip(jobs, results):
        label = f"{w['match']} ({w['demo'][:-4]}{', joined' if kind == 'joined' else ', Count them' if kind == 'count_them' else ''})"
        if errors:
            notes.append(f"{label}: page errors: {errors[:300]}")
        if kind != 'main':
            if not res or 'kd' not in res[-1]:
                fails.append(f"{label}: no result ({err.strip()[-200:] or 'see --save'})")
            else:
                count['totals'] += check_totals(label, w[kind], res[-1], fails)
            continue
        if len(res) < 2 or 'kills' not in res[-1]:
            fails.append(f"{label}: no result ({(res[0].get('cant_play') if res else None) or err.strip()[-200:] or 'see --save'})")
            continue
        summary, got = res[0], res[1]
        if not (summary.get('mapLoaded') and summary.get('pictureCheckDone')):
            fails.append(f"{label}: the map or the picture check didn't finish, so its wallbangs can't be judged")
            continue
        count['totals'] += check_totals(label, w, summary, fails)
        for e in w['kills']:
            count['kills'] += 1
            at = f"{label}, R{e['round']} {e.get('timer') or '?'}, {e['killer']} on {e['victim']}"
            c = [k for k in got['kills'] if k['round'] == e['round'] and k['killer'] == e['killer'] and k['victim'] == e['victim']]
            if len(c) != 1:
                fails.append(f"{at}: expected one such kill, found {len(c)}")
                continue
            k, diff = c[0], []
            if e.get('timer') and e['timer'] != k['timer']:
                diff.append(f"timer: expected {e['timer']}, got {k['timer']}")
            if e.get('gun') and e['gun'] != k['gun']:
                diff.append(f"gun: expected {e['gun']}, got {k['gun']}")
            ok = k['tag'] in ('strict', 'loose', 'loose-damage') if e['expected'] == 'wallbang' else k['tag'] == e['expected']
            if not ok:
                diff.append(f"expected {e['expected']}, got {k['tag']}")
            if diff:
                (gaps if e.get('known_gap') and ok is False and len(diff) == 1 else fails).append(f"{at}: {'; '.join(diff)}")

    for n in notes:
        print('NOTE', n)
    for g in gaps:
        print('KNOWN GAP', g)
    for f in fails:
        print('FAIL', f)
    mins = (time.time() - t0) / 60
    print(f"{count['kills']} kills and {count['totals']} scores and K-D on {len(runs)} demos: "
          f"{len(fails)} mismatches, {len(gaps)} known gaps, {sum(n.startswith('skipped') for n in notes)} skipped ({mins:.1f} minutes)")
    print('PASS' if not fails else 'FAIL')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
