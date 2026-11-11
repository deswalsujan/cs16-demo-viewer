// A victim's health around a burst (26 Oct 2026, Sujan's questions on the wallbang hits check page): every health
// reading, hit and death sound, kill message, and the shots of the given shooters, between two demo times.
// Usage: node burst_timeline.mjs <demo> <victim slot> <from demo s> <to demo s> [shooter slots, comma]
import { parseDemo } from './demo.mjs';
import fs from 'fs';
const [, , file, vs, from, to, sh] = process.argv;
const d = parseDemo(new Uint8Array(fs.readFileSync(file)));
const v = +vs, a = +from, b = +to, shooters = (sh || '').split(',').filter(Boolean).map(Number);
const nm = (e) => (d.players[e] || {}).name || '?';
const ev = [];
for (let i = 0; i < d.hp.length; i += 3) if (d.hp[i + 1] === v && d.hp[i] >= a && d.hp[i] <= b) ev.push([d.hp[i], `health ${d.hp[i + 2]}`]);
for (let i = 0; i < d.snds.length; i += 10) { const s = String(d.sounds[d.snds[i + 1]] || ''); if (d.snds[i + 2] === v && d.snds[i] >= a && d.snds[i] <= b && /player\//.test(s)) ev.push([d.snds[i], `sound ${s.replace(/^.*player\//, '')}`]); }
for (const k of d.kills) if ((k.victim === v || k.killer === v) && k.t >= a && k.t <= b) ev.push([k.t, `KILL ${nm(k.killer)} ${k.weapon}${k.hs ? ' HS' : ''} -> ${nm(k.victim)}`]);
for (let i = 0; i < d.shots.length; i += 4) if (shooters.includes(d.shots[i + 1]) && d.shots[i] >= a && d.shots[i] <= b) ev.push([d.shots[i], `shot ${nm(d.shots[i + 1])} ${String(d.events[d.shots[i + 2]] || '').replace(/^.*\//, '')}`]);
ev.sort((x, y) => x[0] - y[0]);
const fmt = (s) => `${Math.floor((s - d.start) / 60)}:${((s - d.start) % 60).toFixed(2).padStart(5, '0')}`;
console.log(`victim ${nm(v)}`);
for (const [t, l] of ev) console.log(fmt(t), t.toFixed(3), l);
