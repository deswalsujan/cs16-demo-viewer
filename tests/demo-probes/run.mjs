
import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const f = process.argv[2];
const d = parseDemo(fs.readFileSync(f));
console.log('USER MESSAGES', Object.entries(globalThis.UM).map(([k,v]) => k + '=' + v.n).join(' '));
console.log('SAMPLES', JSON.stringify(globalThis.UMX));
console.log('PLAYER FIELDS', globalThis.DF['entity_state_player_t'].join(' '));
console.log('CLIENTDATA FIELDS', (globalThis.DF['clientdata_t']||[]).filter(x=>/fov|zoom|weapon/i.test(x)).join(' '));
