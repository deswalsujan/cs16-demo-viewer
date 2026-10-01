import { parseDemo } from './demo_probe.mjs';
import fs from 'fs';
const t0=Date.now();
const d = parseDemo(fs.readFileSync(process.argv[2]));
const EV = globalThis.EV||[]; const cnt={};
for (const x of EV) { const n=d.events[x.ei]||x.ei; cnt[n]=(cnt[n]||0)+1; }
console.log('parse s', ((Date.now()-t0)/1000).toFixed(0), 'nades', d.nades.length, JSON.stringify(d.nades.reduce((a,g)=>(a[g.type]=(a[g.type]||0)+1,a),{})));
console.log('events', JSON.stringify(Object.entries(cnt).filter(([k])=>/smoke|grenade|flash|explo/i.test(k))));
const sm = EV.filter(x=>/createsmoke/.test(d.events[x.ei]||'')).slice(0,3);
console.log('createsmoke samples', JSON.stringify(sm.map(x=>({t:x.t,e:x.e,ev:x.ev}))));
const sn = {}; for (const [k,v] of Object.entries(d.sounds)) if (/sg_explode|flashbang-|explode[345]/.test(v)) sn[k]=v;
const S=d.snds, c={}; for (let i=0;i<S.length;i+=10) if (sn[S[i+1]]) c[sn[S[i+1]]]=(c[sn[S[i+1]]]||0)+1;
console.log('sounds', JSON.stringify(c), 'booms', d.booms.length/ (d.booms.length? 1:1));
