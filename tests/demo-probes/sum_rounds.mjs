import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
// a player's kills and deaths over given rounds (kills on enemies only; deaths not counting their own suicides)
const [file, who, spec] = process.argv.slice(2);
const d = parseDemo(fs.readFileSync(file));
const nm = (e) => (d.players[e] || {}).name || '';
const re = new RegExp(who, 'i');
for (const part of spec.split(';')) {
  const [label, list] = part.split('=');
  const set = new Set(); for (const x of list.split(',')) { const [a, b] = x.split('-').map(Number); for (let i = a; i <= (b || a); i++) set.add(i); }
  let K = 0, Dd = 0, selfD = 0, tk = 0;
  const wins = { T: 0, CT: 0 };
  for (const r of d.rounds) if (set.has(r.n) && r.winner) wins[r.winner]++;
  for (const k of d.kills) {
    if (!set.has(k.round)) continue;
    if (re.test(nm(k.victim))) { if (k.killer === k.victim) selfD++; else Dd++; }
    if (re.test(nm(k.killer)) && k.killer !== k.victim) { if (k.kteam === k.vteam) tk++; else K++; }
  }
  console.log(`${label}: ${who} ${K}-${Dd}${selfD ? ` (+${selfD} own suicide)` : ''}${tk ? ` ${tk} TK` : ''} | rounds ${set.size}, won T ${wins.T} CT ${wins.CT}`);
}
