#!/usr/bin/env bash
# Run one page script on every demo in the Half-Life folder, 6 at a time, and collect what it returns.
#
#   HALF_LIFE_DIR=/path/to/Half-Life bash compare_all.sh OUT_DIR PAGE_A [PAGE_B] [SCRIPT]
#
# One page: writes OUT_DIR/a/<demo>.out for each demo (for a fresh batch: score, rounds and K-D to check
# against known results). Two pages (say main's build and a branch): also OUT_DIR/b/<demo>.out, then lists
# the demos whose results differ. SCRIPT defaults to page/match_summary.js (match_detail.js gives round by
# round and T/CT K-D). Uses MAP_NEEDED=0, so maps aren't needed. About 4 minutes for 25 demos.
#
# Each run gets its own copy of the page: harness.py writes _test_<page name> next to the page and deletes it
# at the end, so parallel runs on one page name break each other (found 2 Oct 2026, a run lost its page).
set -u
# paths are resolved before moving into tests/, so they can be given relative to where you are
OUT=$(realpath -m "$1"); A=$(realpath "$2"); B=${3:+$(realpath "$3")}; SCRIPT=${4:-page/match_summary.js}
# a script path as given, or relative to tests/ (page/match_detail.js)
[ -n "${4:-}" ] && [ -f "$4" ] && SCRIPT=$(realpath "$4")
cd "$(dirname "$0")"
[ -n "${HALF_LIFE_DIR:-}" ] || { echo "Set HALF_LIFE_DIR to the Half-Life folder"; exit 1; }
mkdir -p "$OUT/a"; [ -n "$B" ] && mkdir -p "$OUT/b"
one() {
  n="$1"; side="$2"; src="$3"; i="$4"; page="_p_${side}_$i.html"
  cp "$src" "$page"
  key=$(echo "$n" | tr 'A-Z' 'a-z')
  MAP_NEEDED=0 DEMO="$key" timeout 500 python3 harness.py "$page" "$SCRIPT" > "$OUT/$side/$n.out" 2>&1
  rm -f "$page" "_test_$page"
}
export -f one; export OUT SCRIPT
i=0
ls "$HALF_LIFE_DIR/cstrike" | grep -i '\.dem$' | while read -r n; do
  i=$((i + 1)); echo "$n a $A $i"; [ -n "$B" ] && echo "$n b $B $i"
done | xargs -P 6 -L 1 bash -c 'one "$0" "$1" "$2" "$3"'
python3 - "$OUT" "$B" <<'EOF'
import json, os, sys
out, two = sys.argv[1], bool(sys.argv[2])
def res(p):
    try:
        for l in open(p):
            try: d = json.loads(l)
            except Exception: continue
            if isinstance(d, dict): return d
    except FileNotFoundError: pass
    return None
names = sorted(f[:-4] for f in os.listdir(os.path.join(out, 'a')))
bad = [n for n in names if res(os.path.join(out, 'a', n + '.out')) is None]
for n in bad: print('NO RESULT (see the .out file):', n)
if two:
    diff = [n for n in names if res(os.path.join(out, 'a', n + '.out')) != res(os.path.join(out, 'b', n + '.out'))]
    for n in diff: print('DIFFERENT:', n)
    print(f'{len(names) - len(diff)} of {len(names)} identical')
else:
    print(f'{len(names) - len(bad)} of {len(names)} read')
EOF
