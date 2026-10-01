import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2]));
const zid = +Object.entries(d.sounds).find(([k, v]) => /zoom/.test(v))[0];
const clicks = []; for (let i = 0; i < d.snds.length; i += 10) if (d.snds[i + 1] === zid) clicks.push([d.snds[i], d.snds[i + 2]]);
const byF = {};
for (const [t, e, f, a, b] of globalThis.CH) (byF[f] ||= []).push([t, e, a, b]);
for (const f in byF) {
  const ch = byF[f];
  const near = ch.filter(([t, e]) => clicks.some(([ct, ce]) => ce === e && Math.abs(ct - t) < 0.15)).length;
  const covered = clicks.filter(([ct, ce]) => ch.some(([t, e]) => e === ce && Math.abs(ct - t) < 0.15)).length;
  const vals = [...new Set(ch.map((x) => x[3]))].slice(0, 8);
  console.log(f.padEnd(16), 'changes', String(ch.length).padStart(6), '| near a zoom click', String(near).padStart(5), '| zoom clicks with a change', covered + '/' + clicks.length, '| values', JSON.stringify(vals));
}
