"""Fails if the teams of two POV demos split wrong again (0.26.28), or the split depends on the order players come in.

Up to 0.26.27 any one pair of players "on the same side more often than not" joined their groups, and a pair's count
was kept under two keys when their slots swapped, so T and CT became one team on Match 2's CT file (public server,
de_mirage_32, 27 Mar 2025: all 41 in Team 1) and on the GP Tourney POV of Team Guardians vs Lanka Dahan, Mirage, 25 Oct
2026 (`forgotten-de_mirage-2026.dem`: all 28 in Team 1). On each, in POV mode: both teams must have 5 players or more,
and groupTeams must give the same teams for 20 shuffled orders of the players and of their pairs; on the GP Tourney
demo the teams must be Lanka Dahan's and Team Guardians' tags, BAJRANG and Guardians, 14 each. Prints each join with its
counts (rounds on the same side, rounds apart) for the notes.

Usage:  HALF_LIFE_DIR=~/code/cs16-data/Half-Life DEMO_DIRS=~/code/cs16-data/test-demos python3 pov_teams_check.py [page.html]
Needs both demos in the Half-Life folder or DEMO_DIRS (demo_dirs.py; no map). About half a minute. Exit code 0 = pass.
"""
import json, os, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
page = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'index.html')
ok = True
for demo, names in (('match-2_de_mirage_32[cts]', None), ('forgotten-de_mirage-2026', ('BAJRANG', 'Guardians'))):
    env = dict(os.environ, DEMO=demo, MAP_NEEDED='0', POV_MODE='1')
    p = subprocess.run([sys.executable, os.path.join(here, 'harness.py'), page, os.path.join(here, 'page', 'pov_teams.js')],
                       env=env, capture_output=True, text=True, timeout=600)
    res = None
    for line in p.stdout.splitlines():
        if line.startswith('{'):
            res = json.loads(line)
    if not res or 'checks' not in res:
        print(f'FAIL {demo}: the demo did not open or the page script did not run')
        print(p.stdout[-1500:], p.stderr[-1500:])
        ok = False
        continue
    if names:
        got = sorted(t['name'] for t in res['teams'])
        res['checks'].append({'name': 'the teams are ' + ' and '.join(names) + ', 14 each', 'pass': got == sorted(names) and all(t['n'] == 14 for t in res['teams']), 'got': res['teams']})
    print(res['file'], '| teams', ', '.join(f"{t['name']} {t['n']}" for t in res['teams']), '| between the two teams: same side', res['betweenTeams']['same'], 'apart', res['betweenTeams']['apart'])
    for c in res['checks']:
        print(('  ok   ' if c['pass'] else '  FAIL ') + c['name'] + ('' if c['got'] is None else f"  ({json.dumps(c['got'])})"))
        ok = ok and c['pass']
    print('  joins (same side / apart):', '; '.join(f"{j['a']} + {j['b']} {j['same']}/{j['apart']}" for j in res['joins']))
print('PASS' if ok else 'FAIL')
sys.exit(0 if ok else 1)
