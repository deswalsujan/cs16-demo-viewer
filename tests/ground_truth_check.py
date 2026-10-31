"""Fails when the viewer stops agreeing with what Sujan confirmed about wallbangs, scores and K-D.

tests/expected/ holds one file per demo, named by the demo's file name without .dem: its SHA-256, event, map, the
expected score and live rounds, the K-D numbers Sujan confirmed, and kills with round, timer, killer, victim, gun and
expected (strict, loose, loose-damage, none, or wallbang: strict or loose of either kind), each with its source. A
joined map's numbers sit under "joined" in its first part's file; numbers with Count them on, under "count_them". A
kill is found by round, killer and victim, names exactly as the viewer has them (a player dies once a round); timer
and gun are compared only where the file has them. A kill with "known_gap" is printed when it differs, never failed.
How the files were filled: tests/README.md, "Wallbang ground truth" (Sujan, 30 Oct 2026).

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 ground_truth_check.py [--demo TEXT] [--save DIR] [page.html]
Runs every expected file whose demo is found, on every release (1.3 minutes for 45 demos on Sujan's Mac, 30 Oct
2026; Sujan dropped a quicker run on 5 of them the same day). Looks in HALF_LIFE_DIR and DEMO_DIRS (demo_dirs.py:
subfolders included, the DEMO_DIRS demos added to an APFS clone of the Half-Life folder for the run).
  --demo TEXT: only the expected files whose name contains TEXT.   --save DIR: keep each run's output there.
Demos are matched by hash. An expected file whose demo, joined part or map isn't found is skipped, listed in a
warning before the run and again at the end; more than 3 skipped, or none run, is a failure, so a missing folder
never reads as PASS (Sujan, 1 Nov 2026). JOBS runs at once (default 6), TIMEOUT seconds each (default 600). Needs game
files, so it can't run in check.yml. Exit 1 on any mismatch, or too many skipped.
"""
import argparse, glob, json, os, shutil, subprocess, sys, tempfile, time
from concurrent.futures import ThreadPoolExecutor
import demo_dirs

here = os.path.dirname(os.path.abspath(__file__))
LEVELS = {'strict', 'loose', 'loose-damage', 'none', 'wallbang'}
MAX_SKIPPED = 3  # more skipped expected files than this fails the run (Sujan, 1 Nov 2026)


def maps_in(hl):
    return {os.path.basename(p).lower()[:-4] for p in glob.glob(os.path.join(hl, '*', 'maps', '*')) if p.lower().endswith('.bsp')}


def warn_skipped(skipped, total, where):
    """the skipped expected files, in a block that can't be missed (Sujan, 1 Nov 2026)"""
    if not skipped:
        return
    bar = '!' * 100
    print(bar)
    print(f'!!! WARNING: {len(skipped)} of {total} expected files skipped ({where}); more than {MAX_SKIPPED} fails the run')
    for x in skipped:
        print('!!!   skipped ' + x)
    print(bar, flush=True)


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
    env = dict(os.environ, DEMO=demo.lower(), MAP_NEEDED='0', HALF_LIFE_DIR=folder, DEMO_DIRS='')
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
    hl, inside, outside = demo_dirs.collect()
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

    found = {}
    for p in inside + outside:
        found.setdefault(demo_dirs.sha256(p), p)
    maps = maps_in(hl)
    notes, skipped, runs = [], [], []
    for w in want:
        need = [w['sha256']] + (w['joined']['sha256'] if 'joined' in w else [])
        missing = [h for h in need if h not in found]
        if missing:
            skipped.append(f"{w['match']} ({w['demo']}): {'demo' if w['sha256'] in missing else 'a part of the joined map'} not found")
        elif w['map'].lower() not in maps:
            skipped.append(f"{w['match']} ({w['demo']}): map {w['map']} not in the Half-Life folder")
        else:
            runs.append(w)
    where = f"HALF_LIFE_DIR={hl}, DEMO_DIRS={os.environ.get('DEMO_DIRS') or '(not set)'}"
    warn_skipped(skipped, len(want), where)

    # the viewer gets the Half-Life folder with every DEMO_DIRS demo in its cstrike, as harness.py gives it
    folder = demo_dirs.stage(outside)
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
    warn_skipped(skipped, len(want), where)
    too_many, none_ran = len(skipped) > MAX_SKIPPED, not runs
    if too_many:
        print(f'FAIL {len(skipped)} of {len(want)} expected files skipped, more than {MAX_SKIPPED}: are HALF_LIFE_DIR and DEMO_DIRS right?')
    if none_ran:
        print('FAIL no expected file ran')
    mins = (time.time() - t0) / 60
    print(f"{count['kills']} kills and {count['totals']} scores and K-D on {len(runs)} demos: "
          f"{len(fails)} mismatches, {len(gaps)} known gaps, {len(skipped)} skipped ({mins:.1f} minutes)")
    bad = fails or too_many or none_ran
    print('FAIL' if bad else f'PASS, {len(skipped)} expected file{"s" * (len(skipped) != 1)} skipped (see the warning above)' if skipped else 'PASS')
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
