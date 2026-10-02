"""Fails if late kills in the 2006 NoA vs Pentagram Train demo stop being shown at the victim's death sound.

Guards the 0.15.5 fix (CHANGELOG.md): that demo's kill messages arrive after the death sound, and its gun fire
events about 0.2 s before the hits they cause, so each late kill is shown at the victim's death sound, with
positions and aim from the killing shot. Checks every late kill, and the one Sujan confirmed by eye on
2 Oct 2026 (round 22, 0:55, neo's M4 on ave): the kill feed stays empty at the shot and just before the death
sound, and shows the kill at it.

Usage:  HALF_LIFE_DIR=~/Downloads/Half-Life python3 late_kill_timing_check.py [page.html]
Needs noa.penta-0610211800-de_train.dem in cstrike (no map needed). About a minute. Exit code 0 = pass.
"""
import json, os, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
page = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, '..', 'index.html')
env = dict(os.environ, DEMO='noa.penta-0610211800', MAP_NEEDED='0')
p = subprocess.run([sys.executable, os.path.join(here, 'harness.py'), page, os.path.join(here, 'page', 'late_kill_timing.js')],
                   env=env, capture_output=True, text=True, timeout=600)
res = None
for line in p.stdout.splitlines():
    if line.startswith('{'):
        res = json.loads(line)
if not res or 'checks' not in res:
    print('FAIL: the demo did not open or the page script did not run')
    print(p.stdout[-2000:], p.stderr[-2000:])
    sys.exit(1)
for c in res['checks']:
    print(('ok   ' if c['pass'] else 'FAIL ') + c['name'] + ('' if c['got'] is None else f"  ({json.dumps(c['got'])})"))
print('PASS' if res['pass'] else 'FAIL')
sys.exit(0 if res['pass'] else 1)
