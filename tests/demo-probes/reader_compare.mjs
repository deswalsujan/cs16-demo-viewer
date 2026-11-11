// Two copies of the demo reader on the same demos, field by field (0.25.0, 29 Oct 2026: POV mode came into main
// on the promise that every field 0.24.0's reader returns stays the same, on HLTV and POV demos alike).
//
//   node --max-old-space-size=8192 reader_compare.mjs OLD_demo.mjs NEW_demo.mjs demo.dem [demo.dem ...]
//
// OLD and NEW are copies of src/demo.js saved as .mjs (git show 0de2f7f:src/demo.js > /tmp/old.mjs). Prints one
// JSON line per demo: identical or not, the first differences, and for a POV demo what the new reader adds
// (povData, and the recorder's own position on kills by or on him). The only differences allowed: povData and the
// kills' kOwn and vOwn, and only when the demo reads as POV.
import { readFileSync } from 'fs';
import { pathToFileURL } from 'url';
import { resolve, basename } from 'path';

const [oldPath, newPath, ...demos] = process.argv.slice(2);
const A = await import(pathToFileURL(resolve(oldPath)).href), B = await import(pathToFileURL(resolve(newPath)).href);
const same = (x, y) => x === y || (Number.isNaN(x) && Number.isNaN(y));
function cmp(a, b, path, out, pov) {
  if (out.length >= 10) return;
  if (ArrayBuffer.isView(a) || ArrayBuffer.isView(b)) {
    if (!ArrayBuffer.isView(a) || !ArrayBuffer.isView(b) || a.constructor !== b.constructor || a.length !== b.length) { out.push(`${path}: type or length ${a && a.length} vs ${b && b.length}`); return; }
    for (let i = 0; i < a.length; i++) if (!same(a[i], b[i])) { out.push(`${path}[${i}]: ${a[i]} vs ${b[i]}`); return; }
    return;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) { out.push(`${path}: array vs object`); return; }
    const kill = /^kills\[\d+\]$/.test(path);
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (!(k in a)) { if (pov && ((path === '' && k === 'povData') || (kill && (k === 'kOwn' || k === 'vOwn')))) continue; out.push(`${path}.${k}: only in the new reader`); continue; }
      if (!(k in b)) { out.push(`${path}.${k}: only in the old reader`); continue; }
      cmp(a[k], b[k], Array.isArray(a) ? `${path}[${k}]` : path ? `${path}.${k}` : k, out, pov);
    }
    return;
  }
  if (!same(a, b)) out.push(`${path}: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
}
for (const f of demos) {
  const t0 = Date.now();
  try {
    const buf = readFileSync(f);
    const a = A.parseDemo(new Uint8Array(buf), null);
    const b = B.parseDemo(new Uint8Array(buf), null);
    const out = [];
    if (a.pov !== b.pov) out.push(`pov: ${a.pov} vs ${b.pov}`);
    cmp(a, b, '', out, b.pov);
    const res = { demo: basename(f), pov: b.pov, identical: !out.length, diffs: out, secs: Math.round((Date.now() - t0) / 100) / 10 };
    if (b.pov) {
      const P = b.povData || {}, own = P.ownPos || [];
      let withPos = 0; for (let i = 0; i < own.length; i += 4) if (Number.isFinite(own[i])) withPos++;
      res.added = {
        povData: !!b.povData, viewFrames: P.view ? P.view.length / P.viewStride : 0, ownPosSamples: `${withPos} of ${own.length / 4}`,
        killsBy: b.kills.filter((k) => k.kOwn).length, killsOn: b.kills.filter((k) => k.vOwn).length,
        shotsWithSpot: P.shotOrg ? Array.from({ length: P.shotOrg.length / 3 }, (_, i) => P.shotOrg[i * 3]).filter(Number.isFinite).length : 0,
        teammateHp: P.hpInfo ? P.hpInfo.length / 3 : 0, fovs: P.fovs ? P.fovs.length / 2 : 0, gunAnims: P.wanims ? P.wanims.length / 2 : 0,
      };
      res.slowMotion = b.slow.length; // HLTV's svc_timescale stretches (asked 29 Oct 2026: are there any in a POV demo?)
    }
    console.log(JSON.stringify(res));
  } catch (e) { console.log(JSON.stringify({ demo: basename(f), error: String(e && e.stack || e) })); }
}
