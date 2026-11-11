import fs from 'fs';
const u8 = new Uint8Array(fs.readFileSync(process.argv[2])); const dv = new DataView(u8.buffer);
const dir = dv.getUint32(540, true); const n = dv.getInt32(dir, true);
const segs = []; for (let k = 0; k < n; k++) { const b = dir + 4 + k * 92; segs.push({ off: dv.getUint32(b + 84, true), len: dv.getUint32(b + 88, true) }); }
let p = segs[1].off, shown = 0, count = 0;
const want = +process.argv[3] || 20000;
while (p < segs[1].off + segs[1].len) {
  const ft = u8[p], t = dv.getFloat32(p + 1, true); p += 9;
  if (ft === 0 || ft === 1) {
    count++;
    if (count >= want && shown < 3) { shown++;
      const fl = []; for (let o = 0; o < 236; o += 4) fl.push(o + ':' + dv.getFloat32(p + o, true).toFixed(2));
      console.log('t', t.toFixed(3), fl.join(' '));
      const uc = []; for (let o = 236; o < 288; o += 4) uc.push(o + ':' + dv.getFloat32(p + o, true).toFixed(2)); console.log(' cmd', uc.join(' '), 'buttons@?', dv.getUint16(p + 266, true), dv.getUint16(p + 270, true));
    }
    p += 464; const len = dv.getUint32(p, true); p += 4 + len;
  } else if (ft === 2) {} else if (ft === 3) p += 64; else if (ft === 4) p += 32; else if (ft === 5) break; else if (ft === 6) p += 84; else if (ft === 7) p += 8; else if (ft === 8) { p += 4; const l = dv.getUint32(p, true); p += 4 + l + 16; } else if (ft === 9) { const l = dv.getUint32(p, true); p += 4 + l; } else { console.log('bad', ft); break; }
}
