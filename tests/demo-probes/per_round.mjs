import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
// per round: winner, a player's side, kills (no TK/suicide), deaths, self-kills; restarts and notes in between
const [file, who] = process.argv.slice(2);
const d = parseDemo(fs.readFileSync(file));
const f = (t) => Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0');
const nm = (e) => (d.players[e] || {}).name || String(e);
const re = new RegExp(who, 'i');
const restarts = d.bomb.filter((b) => b.type === 'restart').map((b) => b.t);
let ri = 0;
for (const r of d.rounds) {
  const rs = []; while (ri < restarts.length && restarts[ri] < r.start) rs.push(f(restarts[ri++]));
  if (rs.length) console.log('   -- restart', rs.join(' '));
  for (const n of d.notes) if (n.t >= (r.prev || 0) && n.t < r.start && !/pending|Retrying|paused|unpaused/i.test(n.s)) console.log('   NOTE', f(n.t), n.s.replace(/[\x00-\x1f]/g, ' ').trim().slice(0, 90));
  const ks = d.kills.filter((k) => k.round === r.n);
  const self = ks.filter((k) => k.killer === k.victim).length;
  let side = '', K = 0, Dd = 0;
  for (const k of ks) {
    if (re.test(nm(k.victim))) { side = k.vteam; if (k.killer !== k.victim) Dd++; }
    if (re.test(nm(k.killer)) && k.killer !== k.victim) { side = side || k.kteam; if (k.kteam !== k.vteam) K++; }
  }
  if (!side) { const p = Object.keys(d.players).find((e) => re.test(nm(e))); side = '?'; }
  console.log(`R${r.n} ${f(r.start)} ${r.winner || '-'} ${r.reason || ''} kills ${ks.length}${self ? ' self ' + self : ''} | ${who} ${side} ${K}-${Dd}`);
  const nx = d.rounds[r.n]; if (nx) nx.prev = r.start;
}
for (; ri < restarts.length; ri++) console.log('   -- restart', f(restarts[ri]));
