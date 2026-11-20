"""Fails a demo where one person seems to hold two slots at once (Sujan's rule of 17 Nov 2026; built 20 Nov 2026).

Two checks on every demo in DEMO_DIRS, and on every joined map of tests/expected/, as the run of 17 Nov 2026
(tests/logs/people-check-2026-11-17.md) did them:
  - no player has more deaths than the match has live rounds (deaths as the Players tab counts them);
  - no two slots on a team carry the same name at the same moment (the name the view labels each slot with, every
    second of the demo).
Before 0.27.1 both failed on mousesports vs SK, Nuke, Extreme Masters II and Burning vs FairFrag, Inferno, ESWC 2010,
where connections that were on the server at the same time were joined into one person by a shared name. Also prints
the joins the viewer refused for that reason (0.27.1 on), with the two people's names, slots and the seconds they
overlap, so a player who crashed and came back on a new slot before the server dropped the old one shows up here.

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 people_check.py [--kd] [--demo TEXT] [--save DIR] [page.html]
  --kd: also print every player's K-D for each demo and joined map.   --demo TEXT: only the demos whose file name
  contains TEXT.   --save DIR: keep each run's output there.
The demos come from demo_dirs.py, so the hold-out guard applies. JOBS runs at once (default 6), TIMEOUT seconds each
(default 600). Prints "N of M passed"; exit 1 on any failure, or a demo with no result. Needs game files, so it can't
run in check.yml.
"""
import argparse, glob, json, os, re, shutil, sys, tempfile, time
from concurrent.futures import ThreadPoolExecutor
import demo_dirs
from ground_truth_check import harness

here = os.path.dirname(os.path.abspath(__file__))


def events():
    """{file name (lower case): its event}, from the table in tests/DEMOS.md; the matches of tests/expected/ come first"""
    out = {}
    with open(os.path.join(here, 'DEMOS.md'), encoding='utf-8') as f:
        for line in f:
            cells = [c.strip() for c in line.split('|')]
            if len(cells) < 4 or '.dem`' not in cells[1]:
                continue
            names = re.findall(r'`([^`]+\.dem)`', cells[1])
            first = names[0].lstrip('.')
            for n in names:
                if n.startswith('...') or n.startswith('-'):
                    m = re.search(r'-\d{6,}', first)
                    n = (first[:m.start()] if m else '') + n.lstrip('.')
                out.setdefault(n.lower(), cells[2])
    for p in glob.glob(os.path.join(here, 'expected', '*.json')):
        with open(p) as f:
            w = json.load(f)
        out[w['demo'].lower()] = w['match']
    return out


def and_(xs):
    xs = [str(x) for x in xs]
    return xs[0] if len(xs) == 1 else ', '.join(xs[:-1]) + ' and ' + xs[-1]


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('page', nargs='?', default=os.path.join(here, '..', 'index.html'))
    ap.add_argument('--kd', action='store_true')
    ap.add_argument('--demo', default='')
    ap.add_argument('--save')
    a = ap.parse_args()
    hl, inside, outside = demo_dirs.collect()
    page = os.path.abspath(a.page)
    t0 = time.time()

    # every demo in DEMO_DIRS, by the name the viewer lists it under (a byte-identical copy already in the Half-Life
    # folder goes by that copy's name)
    by_sha = {}
    for p in inside + outside:
        by_sha.setdefault(demo_dirs.sha256(p), os.path.basename(p))
    demos = []
    for d in demo_dirs.demo_dirs():
        for p in demo_dirs.dems(d):
            n = by_sha[demo_dirs.sha256(p)]
            if n not in demos and a.demo.lower() in n.lower():
                demos.append(n)
    if not demos:
        sys.exit('people_check: no demo in DEMO_DIRS' + (f' whose name contains "{a.demo}"' if a.demo else '') + ': set DEMO_DIRS')
    ev = events()
    jobs = [(n, f"{n} ({ev.get(n.lower(), 'event not in tests/DEMOS.md')})", None) for n in demos]
    # the joined maps of tests/expected/ whose parts are all found
    for p in sorted(glob.glob(os.path.join(here, 'expected', '*.json'))):
        with open(p) as f:
            w = json.load(f)
        if 'joined' not in w or not any(a.demo.lower() in x.lower() for x in w['joined']['parts']):
            continue
        if all(h in by_sha for h in w['joined']['sha256']):
            parts = [by_sha[h].lower() for h in w['joined']['sha256']]
            jobs.append((parts[0], f"{w['match'].split(', part')[0].split(', file')[0]}, joined ({', '.join(by_sha[h] for h in w['joined']['sha256'])})", {'parts': parts}))
        else:
            print(f"people_check: joined map of {w['demo']} left out: a part isn't found by SHA-256", flush=True)
    n_demos = len(demos)
    print(f"people_check: {n_demos} demos in DEMO_DIRS and {len(jobs) - n_demos} joined maps, {os.environ.get('JOBS', 6)} at a time", flush=True)

    folder = demo_dirs.stage(outside)
    work = tempfile.mkdtemp(prefix='people_check_pages_')
    if a.save:
        os.makedirs(a.save, exist_ok=True)
    try:
        with ThreadPoolExecutor(int(os.environ.get('JOBS', 6))) as ex:
            results = list(ex.map(lambda ij: harness(page, ['people_check.js'], ij[1][0], folder, work, ij[0], ij[1][2], a.save), enumerate(jobs)))
    finally:
        shutil.rmtree(work, ignore_errors=True)

    passed = {'demo': 0, 'joined': 0}
    failed, refusals = [], 0
    for (demo, label, gt), (res, errors, err) in zip(jobs, results):
        kind = 'joined' if gt else 'demo'
        r = res[-1] if res else None
        if not r or 'deaths' not in r:
            failed.append(label)
            print(f"FAIL  {label}: no result ({(r or {}).get('cant_play') or err.strip()[-200:] or 'see --save'})")
            continue
        bad = [f"{x['name']}: {x['deaths']} deaths in {x['live']} live rounds" for x in r['deaths']]
        bad += [f"\"{x['name']}\" on slots {and_(x['slots'])} at once: {x['s']:,} s from demo {x['from'] // 60}:{x['from'] % 60:02d}, {x['live']:,} s of them in live rounds" for x in r['same']]
        if bad:
            failed.append(label)
        else:
            passed[kind] += 1
        print(f"{'FAIL' if bad else 'PASS'}  {label}: {r['live']} live rounds")
        for b in bad:
            print('        ' + b)
        for x in r['refused']:
            refusals += 1
            by = f" (by the name \"{x['by']}\")" if x['by'] else ' (by Steam ID)'
            print(f"        refused join{by}: \"{x['a']}\" (slot {and_(x['aSlots'])}) and \"{x['b']}\" (slot {and_(x['bSlots'])}), on the server together {x['over']:,} s")
        if errors:
            print('        page errors: ' + errors[:300])
        if a.kd:
            for name, kd in r['kd']:
                print(f"        K-D  {name}  {kd}")
    total = len(jobs)
    print(f"{passed['demo'] + passed['joined']} of {total} passed ({passed['demo']} of {n_demos} demos, {passed['joined']} of {total - n_demos} joined maps); "
          f"{refusals} refused joins; {time.time() - t0:.0f} s")
    print('FAIL' if failed else 'PASS')
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
