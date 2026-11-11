// Every burst the wallbang damage finder lists, one line each (27 Oct 2026), for comparing two builds of the finder:
// run it on both pages and diff the lines. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  const nm = (e) => ((D.players[e] || {}).name || '#' + e);
  return M.bursts.map((b) => { const r = M.rounds.find((x) => x.n === b.round); return `R${r ? r.ln : '?'} ${clockText(b.start)} ${nm(b.v)} ${b.total}${b.kill ? ' kill' : ''}${b.solo ? ' solo' : ''}: ` + b.hits.map((h) => `${nm(h.s)} -${h.dmg}${h.head ? 'HS' : ''}`).join(', '); });
})()
