// Round number and round timer for the kills whose wallbang result changed in 0.13.0 (demo times from
// the measurement), so they can be checked in the game's own demo player.
(() => {
  const want = { 'navi-vs-fx-sec2011-final-1110091449-de_train.dem': ['15:24'], 'sk-vs-winfakt-iem6newyork-1110161608-de_mirage.dem': ['3:19', '18:50', '25:39', '42:43'], 'noa.penta-0610211800-de_train.dem': ['13:53', '15:38', '6:04', '18:01', '26:23', '36:40', '23:09', '26:17'] }[D.fileName] || [];
  const f2 = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  return want.map((w) => {
    const [m, s] = w.split(':').map(Number), at = m * 60 + s;
    const k = D.kills.filter((x) => x.weapon && Math.abs((x.tMsg ?? x.t) - D.start - at - 0.5) < 1.2).sort((a, b) => Math.abs(a.tMsg - D.start - at) - Math.abs(b.tMsg - D.start - at))[0];
    if (!k) return w + ' not found';
    const r = M.rounds.find((x) => x.n === k.round);
    return `${w}: R${r && r.live ? r.ln : '?'} ${clockText(k.t)} ${M.pl[k.kp] ? M.pl[k.kp].name : '?'} ${k.weapon} -> ${M.pl[k.vp] ? M.pl[k.vp].name : '?'} | now ${k.wb ? 'wallbang ' + k.wb.thick + 'u' : 'not a wallbang'}`;
  });
})()
