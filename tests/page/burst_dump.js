// The trial's wallbang damage bursts on one victim between two demo times (window.__bd = {v, from, to}): each hit with
// its time, shooter, damage and headshot, and the kill it joins. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  const f = window.__bd, nm = (e) => (D.players[e] || {}).name;
  if (window.__debugV) return { why: M.hitWhy, bursts: (M.bursts || []).filter((b) => b.v === f.v && b.end >= f.from && b.start <= f.to).length };
  return (M.bursts || []).filter((b) => b.v === f.v && b.end >= f.from && b.start <= f.to).map((b) => ({ total: b.total, kill: b.kill ? `${nm(b.kill.killer)} ${b.kill.weapon}${b.kill.hs ? ' HS' : ''}` : null, hits: b.hits.map((h) => `${h.t.toFixed(3)} ${nm(h.s)} -${h.dmg}${h.head ? ' HS' : ''}${h.kill ? ' (kill)' : ''}`) }));
})()
