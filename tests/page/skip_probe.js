// What happens around a kill the skip finder missed (23 Oct 2026): round starts nearby, the kills nearby with
// how far apart killer and victim stood, and every snapshot from 3 s before to 1 s after with its game-time gap,
// living players, how many moved too fast and whether the skip finder ignores it as a round start.
// window.__at = [demo times in seconds from the demo's start, as the lists show them (52:05 -> 3125)].
(async () => {
  const S = D.stride, tt = D.times;
  const starts = D.rounds.map((r) => ['D', r.start]).concat(M.rounds.map((r) => ['M' + (r.ln || ''), r.start]));
  const out = [];
  for (const at of window.__at) {
    const t = D.start + at;
    const res = { at: fmt(at), starts: starts.filter(([, s]) => Math.abs(s - t) < 20).map(([w, s]) => `${w}@${(s - t).toFixed(2)}`),
      kills: D.kills.filter((k) => Math.abs(k.t - t) < 12).map((k) => `${(k.t - t).toFixed(2)} ${M.pl[k.kp] ? M.pl[k.kp].name : k.killer}>${M.pl[k.vp] ? M.pl[k.vp].name : k.victim} ${k.weapon} d${k.kpos && k.vpos ? Math.round(Math.hypot(k.kpos[0] - k.vpos[0], k.kpos[1] - k.vpos[1])) : '?'}${k.tMsg != null && k.tMsg !== k.t ? ' msg' + (k.tMsg - t).toFixed(2) : ''}`),
      snaps: [] };
    for (let i = 1; i < tt.length; i++) {
      if (tt[i] < t - 3 || tt[i] > t + 1) continue;
      let alive = 0, fast = 0, sum = 0;
      for (const e in D.slots) {
        const a = D.slots[e], p = (i - 1) * S, q = i * S;
        if (!(a[q + 5] > 0) || a[q + 5] !== a[p + 5] || isNaN(a[p]) || isNaN(a[q])) continue;
        alive++; const m = Math.hypot(a[q] - a[p], a[q + 1] - a[p + 1]); sum += m; if (m > 60) fast++;
      }
      res.snaps.push(`${(tt[i] - t).toFixed(2)} gap${gameSpan(tt[i - 1], tt[i]).toFixed(3)} alive${alive} fast${fast} move${Math.round(sum)}${starts.some(([, s]) => Math.abs(tt[i] - s) < 1.5) ? ' NEARSTART' : ''}${M.skipIdx.has(i) ? ' SKIP' : ''}`);
    }
    out.push(res);
  }
  return out;
})()
