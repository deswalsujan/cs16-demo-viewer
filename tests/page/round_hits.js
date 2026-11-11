// One player's damage in one round, for checking the wallbang damage finder by hand (27 Oct 2026): every health reading,
// hit sound, fire event (of the shooters named) and kill on him, why the finder counted or skipped each drop, and his
// bursts. window.__q = {ln: round as listed, victim: part of his name, shooters: [parts of names], t1, t2 (optional)}.
// Used on k1ck vs eq, Nuke, DreamHack Winter 2011 (szrtech R25, EneRyYyYy R26) and fnatic vs Moscow Five, Nuke,
// DreamHack Summer 2011 (cArn R2). Waits for the map.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.bursts && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  const q = window.__q, nm = (e) => ((D.players[e] || {}).name || '#' + e);
  const r = M.rounds.find((x) => x.ln === q.ln);
  const vid = +Object.keys(D.players).find((e) => nm(e).toLowerCase().includes(q.victim.toLowerCase()));
  const a = q.t1 != null ? q.t1 : r.start, z = q.t2 != null ? q.t2 : (r.end || r.start + 200);
  window.__debugV = { v: vid, from: a, to: z }; computeHits();
  const bursts = M.bursts.filter((b) => b.v === vid && b.round === r.n).map((b) => ({ total: b.total, kill: b.kill ? nm(b.kill.killer) : null, hits: b.hits.map((h) => `${h.t.toFixed(2)} ${clockText(h.t)} ${nm(h.s)} ${h.gun} -${h.dmg}${h.head ? ' HS' : ''}${h.kill ? ' (kill)' : ''}`) }));
  const ev = [];
  for (let i = 0; i < D.hp.length; i += 3) if (D.hp[i] >= a && D.hp[i] <= z && D.hp[i + 1] === vid) ev.push([D.hp[i], `hp ${D.hp[i + 2]}`]);
  const sn = D.snds || [];
  for (let i = 0; i < sn.length; i += 10) { const s = String(D.sounds[sn[i + 1]] || ''); if (sn[i] >= a && sn[i] <= z && sn[i + 2] === vid && /player\/(bhit|headshot)/.test(s)) ev.push([sn[i], 'snd ' + s.replace(/^.*\//, '')]); }
  const sh = D.shots || [];
  for (let i = 0; i < sh.length; i += 4) { const g = String(D.events[sh[i + 2]] || ''); if (sh[i] >= a && sh[i] <= z && !/smoke/.test(g) && (!q.shooters || q.shooters.some((s) => nm(sh[i + 1]).toLowerCase().includes(s)))) ev.push([sh[i], `fire ${nm(sh[i + 1])} ${g.replace(/^.*\//, '')}`]); }
  for (const k of D.kills) if (k.t >= a && k.t <= z && (k.victim === vid || k.killer === vid)) ev.push([k.t, `KILL ${nm(k.killer)} -> ${nm(k.victim)} ${k.weapon}${k.hs ? ' HS' : ''}${k.wb ? ' wb' : ''}`]);
  ev.sort((x, y) => x[0] - y[0]);
  return { round: r.n, victim: nm(vid), firesKept: M.firesKept, events: ev.map(([t, s]) => `${t.toFixed(2)} ${clockText(t)} ${s}`), why: M.hitWhy, bursts };
})()
