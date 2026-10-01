// What the weapon fire events in an HLTV demo carry (for bullet marks)
import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const d = parseDemo(fs.readFileSync(process.argv[2]));
console.log('event_t fields:', JSON.stringify(globalThis.DF.event_t));
const EV = globalThis.EV;
const name = (i) => (d.events[i] || '').replace(/^events\//, '').replace(/\.sc$/, '');
const fire = EV.filter((x) => /^(ak47|m4a1|deagle|awp|usp|glock18|famas|galil|mp5n|p90|scout|aug|sg552)$/.test(name(x.ei)));
console.log('weapon fire events', fire.length, 'of', EV.length);
const have = {}; for (const x of fire) for (const k in (x.ev || {})) have[k] = (have[k] || 0) + 1;
console.log('fields present (count):', JSON.stringify(have));
for (const x of fire.slice(200, 215)) console.log(name(x.ei).padEnd(7), x.t.toFixed(2), 'ent', x.e, JSON.stringify(x.ev), 'entity angles', JSON.stringify(x.ang && x.ang.map((v) => +v.toFixed(2))));
