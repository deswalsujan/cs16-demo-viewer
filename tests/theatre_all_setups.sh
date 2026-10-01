cd "$(dirname "$0")"
for cfg in "mac14 1512 982 2" "mac13 1440 900 2" "win1080 1920 1080 1" "win1080at125 1536 864 1.25" "win1440at150 1707 960 1.5"; do
  set -- $cfg; timeout 1200 python3 theatre_test.py "${PAGE:-../index.html}" $1 $2 $3 $4 > th_$1.log 2>&1; grep -E '^==|FAIL|passed' th_$1.log
done
