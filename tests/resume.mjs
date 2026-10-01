import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2]));
const ev = (i) => (d.events[i] || '').replace(/^events\//, '').replace(/\.sc$/, '');
const zid = +Object.entries(d.sounds).find(([k, v]) => /zoom/.test(v))[0];
const clicks = {}; for (let i = 0; i < d.snds.length; i += 10) if (d.snds[i + 1] === zid) (clicks[d.snds[i + 2]] ||= []).push(d.snds[i]);
const shots = {}; for (let i = 0; i < d.shots.length; i += 4) if (ev(d.shots[i + 2]) === 'awp') (shots[d.shots[i + 1]] ||= []).push(d.shots[i]);
// consecutive AWP shots by the same player 1.4-4 s apart (bolt time is about 1.45 s): any click between them?
let none = 0, one = 0, two = 0, more = 0; const firstClickAfterShot = [];
for (const e in shots) { const s = shots[e], c = clicks[e] || [];
  for (let i = 1; i < s.length; i++) { const g = s[i] - s[i - 1]; if (g < 1.4 || g > 4) continue;
    const n = c.filter((t) => t > s[i - 1] && t <= s[i]).length; if (!n) none++; else if (n === 1) one++; else if (n === 2) two++; else more++; } 
  for (const t of s) { const n = c.find((x) => x > t); if (n != null && n - t < 3) firstClickAfterShot.push(+(n - t).toFixed(2)); } }
console.log('AWP shot pairs 1.4-4 s apart, clicks between: none', none, '| one', one, '| two', two, '| 3+', more);
firstClickAfterShot.sort((a, b) => a - b);
const q = (p) => firstClickAfterShot[Math.floor(firstClickAfterShot.length * p)];
console.log('first click after a shot (s): 10%', q(.1), 'median', q(.5), '90%', q(.9), 'n', firstClickAfterShot.length);
