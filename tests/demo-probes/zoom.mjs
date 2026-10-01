import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2]));
const zi = Object.entries(d.sounds).filter(([k, v]) => /zoom/i.test(v)).map(([k, v]) => [+k, v]);
console.log('zoom sound resources', JSON.stringify(zi));
const ids = new Set(zi.map((x) => x[0]));
const s = d.snds, zs = [];
for (let i = 0; i < s.length; i += 10) if (ids.has(s[i + 1])) zs.push([s[i], s[i + 2], s[i + 3]]);
console.log('zoom sounds in demo', zs.length);
// AWP and scout kills: zoom clicks by the killer in the 3 s before
const snip = d.kills.filter((k) => /awp|scout|g3sg1|sg550/.test(k.weapon) && k.killer !== k.victim);
let withZoom = 0; const ex = [];
for (const k of snip) {
  const z = zs.filter((x) => x[1] === k.killer && x[0] <= k.t && x[0] > k.t - 3).map((x) => +(k.t - x[0]).toFixed(2));
  if (z.length) withZoom++;
  if (ex.length < 14) ex.push(`${k.weapon} kill at ${k.t.toFixed(1)}: clicks ${JSON.stringify(z)} s before`);
}
console.log('sniper kills', snip.length, 'with a zoom click by the killer in the 3 s before:', withZoom);
console.log(ex.join('\n'));
// timing resolution: gaps between consecutive zoom clicks by the same player
const gaps = []; const last = {};
for (const [t, e] of zs) { if (last[e] != null && t - last[e] < 1) gaps.push(+(t - last[e]).toFixed(3)); last[e] = t; }
gaps.sort((a, b) => a - b);
console.log('fast double clicks (<1 s apart):', gaps.length, 'smallest gaps', JSON.stringify(gaps.slice(0, 12)));
