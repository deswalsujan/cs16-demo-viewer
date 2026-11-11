// Every wallbang in the live rounds, with what blocked the view: for each of the 15 body points the finder
// traces (bodyVisible), the brush that stopped the line first, and for the crosshair line every brush it
// passed. Each brush is named with its entity (class, render mode and amount, textures), whether it's a
// breakable, and whether it was broken at the kill or within 1.5 s after. Set window.__want to a list of
// "R<n> <clock>" strings to report only those (23 Oct 2026, wallbang checks from Sujan's feedback).
(async () => {
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await new Promise((r) => setTimeout(r, 500));
  if (!MAP || MAP.name !== D.mapName.toLowerCase()) return { map: 'not loaded' };
  const bsp = MAP.bsp, nm = (p) => (M.pl[p] ? M.pl[p].name : '?');
  const ents = {}; for (const e of bsp.entities) if (e.model && e.model[0] === '*') ents[+e.model.slice(1)] = e;
  const texOf = (m) => { const md = bsp.models[m]; const s = new Set(); for (let i = 0; i < md.numFaces && s.size < 6; i++) { const f = bsp.faces[md.firstFace + i]; const ti = bsp.texinfo[f.tex]; const t = bsp.textures[ti.mip]; if (t) s.add(t.name); } return [...s]; };
  const desc = (m, t) => {
    if (m === 0) return 'world';
    const e = ents[m] || {};
    let s = `*${m} ${e.classname}`;
    if (e.rendermode) s += ` rm${e.rendermode}/${e.renderamt == null ? '-' : e.renderamt}`;
    if (MAP.breakables.has(m)) { const bAt = (brk[m] || []); let when = null; for (let i = 0; i < bAt.length; i += 2) if (!bAt[i + 1] && bAt[i] > t - 0.05 && when == null) when = bAt[i]; s += ` BREAKABLE${when != null ? ` broken +${(when - t).toFixed(2)}s` : ''}${e.material ? ' mat' + e.material : ''}`; }
    s += ` [${texOf(m).join(',')}]`;
    return s;
  };
  const eyeOf = (p) => [p[0], p[1], p[2] + (p[3] ? 12 : 17)];
  const out = [];
  for (const k of M.wbs) {
    const r = M.rounds.find((x) => x.n === k.round);
    const tag = `R${r ? r.ln : '?'} ${clockText(k.t)}`;
    if (window.__want && !window.__want.includes(tag)) continue;
    const tP = k.tPos != null ? k.tPos : k.t;
    const skip = brokenSet(tP - 0.05), poses = posesAt(tP - 0.05);
    const eye = eyeOf([...k.kpos, k.kduck]), v = [...k.vpos, k.vduck];
    const dx = v[0] - eye[0], dy = v[1] - eye[1]; const hl = Math.hypot(dx, dy) || 1; const px = -dy / hl, py = dx / hl;
    const zs = v[3] ? [-12, 0, 10, 16] : [-30, -12, 6, 22, 30];
    const pts = {};
    for (const z of zs) for (const sd of [-12, 0, 12]) {
      const res = solidAlong(bsp, eye, [v[0] + px * sd, v[1] + py * sd, v[2] + z], 2, skip, poses);
      const key = res.hit.map((h) => h.model).join('+') || 'clear';
      pts[key] = (pts[key] || 0) + 1;
    }
    let raw = k.kang ? k.kang[0] : 0; if (raw > 180) raw -= 360;
    const pitch = -raw * 3 * Math.PI / 180, yaw = (k.kang ? k.kang[1] : 0) * Math.PI / 180;
    const dist = Math.hypot(k.vpos[0] - eye[0], k.vpos[1] - eye[1], k.vpos[2] - eye[2]);
    const end = [eye[0] + Math.cos(pitch) * Math.cos(yaw) * dist, eye[1] + Math.cos(pitch) * Math.sin(yaw) * dist, eye[2] - Math.sin(pitch) * dist];
    const aim = solidAlong(bsp, eye, end, 2, skip, poses);
    const models = new Set(); for (const key in pts) for (const m of key.split('+')) if (m !== 'clear') models.add(+m); for (const h of aim.hit) models.add(h.model);
    out.push({
      tag, demoT: fmt(k.t - D.start), who: `${nm(k.kp)} ${k.weapon}${k.hs ? ' HS' : ''} -> ${nm(k.vp)}`, dist: Math.round(dist), thick: k.wb.thick,
      points: pts, aim: aim.hit.map((h) => `${h.model}:${Math.round((h.f1 - h.f0) * aim.len)}u@${Math.round(h.f0 * aim.len)}`).join(' '),
      brushes: [...models].map((m) => desc(m, tP)), skipNear: typeof skipNear === 'function' ? !!skipNear(k.t) : null,
    });
  }
  return { demo: D.fileName, n: M.wbs.length, out };
})()
