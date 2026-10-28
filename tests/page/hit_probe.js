// Raw data around wallbang kills, for checking the trial's damage numbers by hand (26 Oct 2026, tyloo vs mTw, Nuke,
// e-Stars Seoul 2009): for each kill in window.__kp = [{tag:'R23 1:09', killer:'whimp'}], every health reading, hit
// sound and fire event between 3 s before and 0.5 s after, for everyone, plus the bursts found. Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  const nm = (e) => { const n = (D.players[e] || {}).name; return n ? n.replace(/^mTw\.Mindfactory \| /, '').replace(/^tyloo /, '').replace(/^.*'(.+)'.*$/, '$1').trim() : '#' + e; };
  const out = [];
  for (const w of window.__kp) {
    const k = D.kills.find((k) => { const r = M.rounds.find((x) => x.n === k.round); return r && `R${r.ln} ${clockText(k.t)}` === w.tag && M.pl[k.kp] && M.pl[k.kp].name.includes(w.killer); });
    if (!k) { out.push({ missing: w }); continue; }
    const a = k.t - (w.before || 3), b = k.t + 0.5, ev = [];
    for (let i = 0; i < D.hp.length; i += 3) if (D.hp[i] >= a && D.hp[i] <= b) ev.push([D.hp[i], `hp   ${nm(D.hp[i + 1])} = ${D.hp[i + 2]}`]);
    const sn = D.snds || [];
    for (let i = 0; i < sn.length; i += 10) { const s = String(D.sounds[sn[i + 1]] || ''); if (sn[i] >= a && sn[i] <= b && /player\/(bhit|headshot)/.test(s)) ev.push([sn[i], `snd  ${nm(sn[i + 2])} ${s.replace(/^.*\//, '')}`]); }
    const sh = D.shots || [];
    for (let i = 0; i < sh.length; i += 4) if (sh[i] >= a && sh[i] <= b) ev.push([sh[i], `fire ${nm(sh[i + 1])} ${String(D.events[sh[i + 2]] || '').replace(/^.*\//, '')}`]);
    for (const kk of D.kills) if (kk.t >= a && kk.t <= b) ev.push([kk.t, `KILL ${nm(kk.killer)} -> ${nm(kk.victim)} ${kk.weapon}${kk.hs ? ' HS' : ''}${kk.wb ? ' wb' : ''}${kk.tMsg != null ? ' msg ' + (kk.tMsg - k.t).toFixed(3) : ''}`]);
    ev.sort((x, y) => x[0] - y[0]);
    const bursts = M.bursts.filter((x) => x.end >= a - 2 && x.start <= b).map((x) => ({ v: nm(x.v), total: x.total, kill: x.kill ? nm(x.kill.killer) : null, hits: x.hits.map((h) => `${(h.t - k.t).toFixed(3)} ${nm(h.s)} -${h.dmg}${h.head ? ' HS' : ''}${h.kill ? ' (kill)' : ''}`) }));
    out.push({ tag: w.tag, killer: nm(k.killer), victim: nm(k.victim), events: ev.map(([t, s]) => `${(t - k.t).toFixed(3)} ${s}`), bursts });
  }
  return out;
})()
