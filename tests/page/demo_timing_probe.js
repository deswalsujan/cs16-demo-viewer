(() => {
  const ts = D.times; const gaps = [];
  for (let i = 1; i < ts.length; i++) gaps.push(ts[i] - ts[i - 1]);
  gaps.sort((a, b) => a - b);
  const q = (p) => +gaps[Math.floor(gaps.length * p)].toFixed(4);
  // how often does a player's stored position repeat the previous sample (a stale snapshot)?
  let same = 0, tot = 0, pitchSame = 0;
  for (const e in D.slots) { const a = D.slots[e], S = D.stride; for (let i = 1; i < ts.length; i++) { if (!(a[i*S+5] > 0) || !(a[(i-1)*S+5] > 0)) continue; tot++; if (a[i*S] === a[(i-1)*S] && a[i*S+1] === a[(i-1)*S+1]) same++; if (a[i*S+4] === a[(i-1)*S+4]) pitchSame++; } }
  const r = M.liveR[0];
  return { samples: ts.length, stride: D.stride, gap: { p10: q(0.1), p50: q(0.5), p90: q(0.9), max: q(0.999) }, samePos: same / tot, samePitch: pitchSame / tot, round1: { start: r.start, end: r.end }, viewMode, names: opts.names };
})()
