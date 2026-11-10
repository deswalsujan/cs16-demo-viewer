(() => {
  // Where the Tab scoreboard of 0.26.28 (everyone under the side he's on at that moment) lists someone elsewhere than
  // 0.26.27's (each team's people under the side the team had in the round): every second of the demo, live rounds and
  // the rest counted apart, with the first few moments and who moved.
  const S = D.stride, live = { n: 0, diff: 0 }, other = { n: 0, diff: 0 }, samples = [], who = {};
  for (let t = D.start; t <= D.end; t += 1) {
    const r = roundAt(t), si = M.idxAt(t) * S;
    const now = Object.keys(M.pl).map((pid) => { const e = M.slotOf(pid, t); const v = e != null && D.slots[e] ? D.slots[e][si + 5] || 0 : 0; return { pid, e, side: Math.abs(v) }; }).filter((x) => x.e != null);
    { const held = new Set(now.filter((x) => x.pid[0] !== 's').map((x) => x.e)); for (let i = now.length - 1; i >= 0; i--) if (now[i].pid[0] === 's' && (held.has(now[i].e) || !now[i].side)) now.splice(i, 1); }
    let tT = r && r.tTeam != null ? r.tTeam : null;
    if (tT == null) { const v = [0, 0]; for (const x of now) if (x.side && M.teamOf[x.pid] != null) v[M.teamOf[x.pid]] += x.side === 1 ? 1 : -1; tT = v[1] > v[0] ? 1 : 0; }
    const moved = [];
    for (const ti of [0, 1]) {
      const side = tT === ti ? 1 : 2;
      const olds = new Set(M.teams[ti].filter((pid) => M.slotOf(pid, t) != null));
      const news = new Set(now.filter((x) => x.side === side).map((x) => x.pid));
      for (const p of olds) if (!news.has(p)) moved.push(`${M.pl[p].name} (${M.tnames[ti]}) ${(now.find((x) => x.pid === p) || {}).side ? 'on the other side' : 'on neither side'}`);
      for (const p of news) if (!olds.has(p)) moved.push(`${M.pl[p].name} (${M.teamOf[p] != null ? M.tnames[M.teamOf[p]] : 'spectator'}) now under ${M.tnames[ti]}`);
    }
    const c = r && r.live ? live : other; c.n++;
    if (moved.length) {
      c.diff++;
      for (const m of moved) { const k = m.replace(/ now under.*| on the other side| on neither side/, '') + (/now under/.test(m) ? ' -> listed under the other team' : / on the other side/.test(m) ? ' -> on the other side' : ' -> spectators'); who[k] = (who[k] || 0) + (r && r.live ? 1 : 0); }
      if (r && r.live && samples.length < 4) samples.push(`R${r.ln} ${fmt(t - D.start)}: ${moved.slice(0, 3).join('; ')}`);
    }
  }
  const liveWho = Object.entries(who).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => `${k}: ${n} s`);
  return { demo: D.fileName, pov: !!D.pov, liveSeconds: live.n, liveDiffer: live.diff, otherSeconds: other.n, otherDiffer: other.diff, inLive: liveWho, samples };
})()
