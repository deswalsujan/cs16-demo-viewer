// The wallbang list with the map loaded (waits for it), for comparing two builds on every demo:
// HALF_LIFE_DIR=... bash compare_all.sh OUT old.html new.html page/wallbang_list.js (0.15.5). About 5 minutes for 31 demos.
(async () => {
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await new Promise((r) => setTimeout(r, 500));
  if (!M.wbs) return { map: 'not loaded' };
  const nm = (p) => M.pl[p] ? M.pl[p].name : '?';
  return { n: M.wbs.length, list: M.wbs.map((k) => { const r = M.rounds.find((x) => x.n === k.round); return `R${r ? r.ln : '?'} ${clockText(k.t)} ${nm(k.kp)} ${k.weapon}${k.hs ? ' HS' : ''} -> ${nm(k.vp)}`; }) };
})()
