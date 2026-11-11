"""The viewer's wallbangs scored against Sujan's own answers on the hold-out demos (Sujan, 2 Nov 2026).

Run it only when Sujan asks for a hold-out score (AGENTS.md, "Hold-out demos"): it's the one script that opens the
hold-out demos, and only from the folder named on the command line.

  HALF_LIFE_DIR=~/code/cs16-data/Half-Life python3 holdout_score.py ~/code/cs16-data/holdout-demos [--demo TEXT] [page.html]

Answers: one text file per demo in HOLDOUT/answers/, named after the demo (`koreamoscownuke-1112091644-de_nuke.txt`)
or holding a `demo: <file name>` line. One line per kill, as in the game:

  rounds: all                         the rounds watched in full: all, or a list like 1-15, 18, 20-30
  R4 1:12 Delpan > markeloff awp loose
  R12 C4 0:21 f0rest > Zeus m4a1 normal
  R20 1:05 face > ceh9 unsure         the gun is optional; any part of a name only one player has, without >
  # a comment

Verdicts: strict, loose, normal, unsure. Every kill in the watched rounds that isn't listed is normal. A kill is
matched on round, killer and victim (a victim dies once a round); the timer and gun are checked in the report.

What it counts, per demo and in all: Sujan's wallbangs (strict or loose) and how many the viewer lists at all (the
rest are missed); the viewer's wallbangs in the watched rounds and how many Sujan calls normal (false); of the kills
both call wallbangs, how many have the same level (the viewer's LOOSE from pixels and from damage are both loose);
unsure answers; answer lines that match no kill or can't be read.

The terminal gets only those counts (Sujan, 2 Nov 2026). Every kill, the missed and false ones by name, and each line
that didn't match go only into the report, HOLDOUT/scores/<date and time>.md, which no session reads.

Each demo is checked against tests/holdout-manifest.md by SHA-256, then opened as the ground truth check opens a
demo (regress_summary.js and ground_truth_kills.js through harness.py, the map and the picture check waited for), in
a clone of the Half-Life folder with the demo in its cstrike, deleted at the end. HOLDOUT_SCORE=1 lets that run past
the hold-out guard (demo_dirs.py). About half a minute a demo, 6 at a time (JOBS). --manifest is for testing this
script on stand-in demos. Exit code 1 when a demo can't be scored.
"""
import argparse, datetime, glob, os, re, subprocess, sys, tempfile, shutil
from concurrent.futures import ThreadPoolExecutor

here = os.path.dirname(os.path.abspath(__file__))
os.environ['HOLDOUT_SCORE'] = '1'  # before demo_dirs runs anything: this script's own run passes the guard
import demo_dirs
import ground_truth_check as gt

VERDICTS = {'strict', 'loose', 'normal', 'unsure'}
GUNS = {'ak47', 'm4a1', 'awp', 'deagle', 'usp', 'glock18', 'p228', 'fiveseven', 'elite', 'famas', 'galil', 'aug', 'sg552',
        'scout', 'g3sg1', 'sg550', 'm249', 'mp5navy', 'tmp', 'mac10', 'ump45', 'p90', 'm3', 'xm1014', 'knife', 'grenade'}


def parse_rounds(text):
    """'all' -> None (every round); '1-15, 18' -> {1..15, 18}"""
    text = text.strip().lower()
    if text == 'all':
        return None
    out = set()
    for part in re.split(r'[,\s]+', text):
        if not part:
            continue
        m = re.fullmatch(r'(\d+)(?:-(\d+))?', part)
        if not m:
            raise ValueError(part)
        a, b = int(m.group(1)), int(m.group(2) or m.group(1))
        out.update(range(a, b + 1))
    return out


def parse_answers(path):
    """(demo name or None, rounds or None for all, [answer], [(line number, why)]) from one answers file"""
    demo, rounds, have_rounds, answers, bad = None, None, False, [], []
    with open(path, encoding='utf-8') as f:
        for i, raw in enumerate(f, 1):
            line = raw.split('#', 1)[0].strip()
            if not line:
                continue
            m = re.match(r'(demo|rounds)\s*:\s*(.+)$', line, re.I)
            if m:
                if m.group(1).lower() == 'demo':
                    demo = m.group(2).strip()
                else:
                    try:
                        rounds, have_rounds = parse_rounds(m.group(2)), True
                    except ValueError:
                        bad.append((i, f'rounds: "{m.group(2)}" isn\'t a list of rounds'))
                continue
            m = re.match(r'R(\d+)\s+((?:C4\s+)?\d+:\d\d)\s+(.+?)\s*>\s*(.+)$', line, re.I)
            if not m:
                bad.append((i, f'can\'t read "{line}"'))
                continue
            rest = m.group(4).split()
            if not rest or rest[-1].lower() not in VERDICTS:
                bad.append((i, f'no verdict (strict, loose, normal or unsure) at the end of "{line}"'))
                continue
            verdict = rest.pop().lower()
            gun = rest.pop().lower() if len(rest) > 1 and rest[-1].lower() in GUNS else None
            answers.append({'line': i, 'round': int(m.group(1)), 'timer': re.sub(r'(?i)^c4\s+', 'C4 ', m.group(2)),
                            'killer': m.group(3).strip(), 'victim': ' '.join(rest), 'gun': gun, 'verdict': verdict})
    if not have_rounds:
        bad.append((0, 'no "rounds:" line, so unlisted kills can\'t count as normal; read as "rounds: all"'))
    return demo, rounds, answers, bad


def person(part, people):
    """the one player whose name contains part (any case), or None and why"""
    hits = [p for p in people if part.lower() in p.lower()]
    if len(hits) == 1:
        return hits[0], None
    exact = [p for p in hits if p.lower() == part.lower()]
    if len(exact) == 1:
        return exact[0], None
    return None, (f'no player\'s name contains "{part}"' if not hits else f'"{part}" is in {len(hits)} names: {", ".join(hits)}')


def secs(timer):
    m = re.search(r'(\d+):(\d\d)$', timer or '')
    return int(m.group(1)) * 60 + int(m.group(2)) if m else None


def score_demo(answers, rounds, got):
    """match the answers to the viewer's kills; the counts and the report rows"""
    kills, people = got['kills'], got['people']
    rows, bad, verdict_of = [], [], {}
    for a in answers:
        k_name, why_k = person(a['killer'], people)
        v_name, why_v = person(a['victim'], people)
        if why_k or why_v:
            bad.append((a['line'], why_k or why_v))
            continue
        c = [k for k in kills if k['round'] == a['round'] and k['killer'] == k_name and k['victim'] == v_name]
        if len(c) != 1:
            bad.append((a['line'], f'{"no" if not c else len(c)} kill{"s" if len(c) > 1 else ""} of {v_name} by {k_name} in R{a["round"]}'))
            continue
        i = kills.index(c[0])
        if i in verdict_of:
            bad.append((a['line'], f'the same kill as line {verdict_of[i]["line"]}'))
            continue
        verdict_of[i] = a
    n = {'yours': 0, 'found': 0, 'viewer': 0, 'false': 0, 'both': 0, 'level': 0, 'unsure': 0}
    for i, k in enumerate(kills):
        a = verdict_of.get(i)
        # a listed kill counts in any round; an unlisted one only in the rounds watched in full, where it's normal
        if k['round'] is None or (not a and rounds is not None and k['round'] not in rounds):
            continue
        mine = a['verdict'] if a else 'normal'
        tag = k['tag']
        theirs = 'none' if tag == 'none' else 'strict' if tag == 'strict' else 'loose'
        if mine == 'unsure':
            n['unsure'] += 1
            result = 'unsure'
        elif mine in ('strict', 'loose'):
            n['yours'] += 1
            if theirs == 'none':
                result = 'missed'
            else:
                n['found'] += 1
                n['both'] += 1
                n['level'] += theirs == mine
                result = 'right' if theirs == mine else 'level wrong'
        else:
            result = 'false' if theirs != 'none' else None
        if theirs != 'none' and mine != 'unsure':
            n['viewer'] += 1
            n['false'] += mine == 'normal'
        if a or theirs != 'none':
            notes = []
            if a and secs(a['timer']) is not None and secs(k['timer']) is not None and abs(secs(a['timer']) - secs(k['timer'])) > 1:
                notes.append(f'your timer {a["timer"]}')
            if a and a['gun'] and a['gun'] != k['gun']:
                notes.append(f'your gun {a["gun"]}')
            rows.append((k, mine, tag, result or 'right', a['line'] if a else None, '; '.join(notes)))
    return n, rows, bad


def counts_line(n):
    return (f"your wallbangs {n['yours']}, the viewer lists {n['found']} (missed {n['yours'] - n['found']}); "
            f"the viewer's wallbangs {n['viewer']}, you call {n['false']} normal; "
            f"level right {n['level']} of {n['both']}; unsure {n['unsure']}")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('holdout', help='the hold-out folder, ~/code/cs16-data/holdout-demos')
    ap.add_argument('page', nargs='?', default=os.path.join(here, '..', 'index.html'))
    ap.add_argument('--demo', default='', help='only the answers files whose demo name contains this')
    ap.add_argument('--manifest', default=demo_dirs.HOLDOUT_MANIFEST, help='for testing this script on stand-in demos')
    a = ap.parse_args()
    hold = os.path.abspath(os.path.expanduser(a.holdout))
    page = os.path.abspath(a.page)
    rows = {n.lower(): (n, size, h) for n, size, h in demo_dirs.manifest_rows(a.manifest)}
    files = sorted(glob.glob(os.path.join(hold, 'answers', '*.txt')))
    if not files:
        sys.exit(f'no answers files in {os.path.join(hold, "answers")}')
    jobs, problems = [], []
    for f in files:
        demo, rounds, answers, bad = parse_answers(f)
        demo = demo or os.path.basename(f)[:-4] + '.dem'
        if not demo.lower().endswith('.dem'):
            demo += '.dem'
        if a.demo and a.demo.lower() not in demo.lower():
            continue
        path = os.path.join(hold, demo)
        if demo.lower() not in rows:
            problems.append((demo, 'not in the hold-out manifest'))
            continue
        if not os.path.exists(path):
            problems.append((demo, 'not in the hold-out folder'))
            continue
        if demo_dirs.sha256(path) != rows[demo.lower()][2]:
            problems.append((demo, "its SHA-256 isn't the manifest's"))
            continue
        jobs.append({'file': f, 'demo': os.path.basename(path), 'path': path, 'rounds': rounds, 'answers': answers, 'bad': bad})
    version = open(os.path.join(here, '..', 'VERSION')).read().strip()
    folder = demo_dirs.stage([j['path'] for j in jobs]) if jobs else None
    work = tempfile.mkdtemp(prefix='holdout_pages_')
    try:
        with ThreadPoolExecutor(int(os.environ.get('JOBS', 6))) as ex:
            results = list(ex.map(lambda ij: gt.harness(page, ['regress_summary.js', 'ground_truth_kills.js'], ij[1]['demo'], folder, work, ij[0]), enumerate(jobs)))
    finally:
        shutil.rmtree(work, ignore_errors=True)
    total = {'yours': 0, 'found': 0, 'viewer': 0, 'false': 0, 'both': 0, 'level': 0, 'unsure': 0}
    when = datetime.datetime.now()
    rep = [f'# Hold-out score, {when:%Y-%m-%d %H:%M}', '', f'Viewer {version} ({os.path.basename(page)}), `tests/holdout_score.py`. '
           'Per kill: every one you listed, and every one the viewer lists as a wallbang in the rounds you watched in full.', '']
    print(f'Hold-out score, viewer {version}')
    failed = 0
    for j, (res, errors, err) in zip(jobs, results):
        rep += [f'## {j["demo"]}', '']
        if len(res) < 2 or 'kills' not in res[-1] or not (res[0].get('mapLoaded') and res[0].get('pictureCheckDone')):
            failed += 1
            print(f'{j["demo"][:-4]}: not scored, the demo, its map or the picture check didn\'t finish (see the report)')
            rep += ['Not scored: the demo, its map or the picture check didn\'t finish.', '', '```', (err or '').strip()[-1500:], '```', '']
            continue
        n, krows, bad = score_demo(j['answers'], j['rounds'], res[-1])
        bad = j['bad'] + bad
        for x in total:
            total[x] += n[x]
        print(f'{j["demo"][:-4]}: {counts_line(n)}; answer lines not matched {sum(1 for b in bad if b[0])}')
        rep += [counts_line(n) + '.', '', '| Round | Timer | Killer | Victim | Gun | Yours | Viewer | Result | Line | Note |', '|---|---|---|---|---|---|---|---|---|---|']
        for k, mine, tag, result, line, note in krows:
            rep.append(f"| R{k['round']} | {k['timer']} | {k['killer']} | {k['victim']} | {k['gun']} | {mine} | {tag} | {result} | {line or ''} | {note} |")
        if bad:
            rep += ['', 'Answer lines not used:', ''] + [f'- line {i}: {why}' if i else f'- {why}' for i, why in bad]
        if errors:
            rep += ['', f'Page errors: {errors[:500]}']
        rep.append('')
    for demo, why in problems:
        failed += 1
        print(f'{demo[:-4]}: not scored, {why}')
        rep += [f'## {demo}', '', f'Not scored: {why}.', '']
    print(f'All: {counts_line(total)}')
    os.makedirs(os.path.join(hold, 'scores'), exist_ok=True)
    out = os.path.join(hold, 'scores', f'{when:%Y-%m-%d-%H%M%S}.md')
    with open(out, 'w', encoding='utf-8') as f:
        f.write('\n'.join(rep) + '\n')
    print(f'Report (per kill, not for sessions to read): {out}')
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
