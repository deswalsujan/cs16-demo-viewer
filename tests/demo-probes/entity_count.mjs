import { parseDemo } from './demo_probe_count.mjs';
import fs from 'fs';
parseDemo(fs.readFileSync(process.argv[2]));
const C = globalThis.CMP; let eq=0, more=0, less=0; const ex=[];
for (const [h,c] of C) { if (h===c) eq++; else if (h>c) { more++; if (ex.length<5) ex.push([h,c]); } else less++; }
const hs = C.map(x=>x[0]).sort((a,b)=>a-b);
console.log('packets', C.length, 'header==decoded', eq, 'header>decoded', more, 'header<decoded', less, 'examples', JSON.stringify(ex), 'header median', hs[hs.length>>1], 'max', hs.at(-1));
