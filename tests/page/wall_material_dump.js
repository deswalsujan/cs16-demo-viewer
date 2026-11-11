// With tests/wall_material_variant.py (2 Nov 2026), after regress_summary.js: every kill the damage rule looked at,
// with the surfaces on the crosshair line and their materials, and whether its answer changed from wood's 0.6.
(() => {
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  const at = (t) => { const r = roundAt(t); return (r && r.live ? 'R' + r.ln : '-') + ' ' + killClock(t); };
  const L = window.__matLog || [], seen = new Set(), rows = [];
  for (const x of L) { const key = x.t + ':' + x.kp + ':' + x.vp; if (seen.has(key)) continue; seen.add(key); rows.push(x); }
  const unk = rows.filter((x) => x.seen && x.seen.some((s) => s.includes(':?:'))).length;
  const listed = new Set(M.wbs || []);
  return {
    demo: D.fileName, checked: rows.length, unknownFace: unk, noSurface: rows.filter((x) => !x.seen).length,
    changed: rows.filter((x) => x.old !== x.now).map((x) => `${at(x.t)} ${fmt(x.t - D.start)} ${nm(x.kp)} -> ${nm(x.vp)} ${x.gun}${x.hs ? ' HS' : ''} hp ${x.hp} shots ${x.shots} max ${x.max} (0.6: ${Math.round(x.per * 0.6 * (x.hs ? 4 : 1.25) * x.shots)}) m ${x.m} [${(x.seen || []).join(', ')}]`),
    mats: rows.reduce((o, x) => { for (const s of x.seen || []) { const c = s.split(':')[1]; o[c] = (o[c] || 0) + 1; } return o; }, {}),
    hits: (window.__hitLog || []).map((h) => `${at(h.t)} ${fmt(h.t - D.start)} ${nm(M.personAt(h.s, h.t))} -> ${nm(M.personAt(h.v, h.t))} ${h.gun} ${h.dmg}${h.head ? ' HS' : ''} m ${h.m} [${(h.seen || []).join(', ')}]`),
  };
})()
