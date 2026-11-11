(() => {
  const ts = D.times, n = ts.length, S = D.stride;
  // de-jittered times: local straight-line fit of time against snapshot number, within stretches with no gap over 0.3 s
  const fit = (W) => { const out = new Float64Array(n); let s0 = 0;
    for (let i = 0; i < n; i++) {
      if (i > 0 && ts[i] - ts[i - 1] > 0.3) s0 = i;
      let s1 = i; while (s1 + 1 < n && s1 - i < W && ts[s1 + 1] - ts[s1] <= 0.3) s1++;
      const lo = Math.max(s0, i - W), hi = s1;
      let sx = 0, sy = 0, sxx = 0, sxy = 0, m = 0; for (let k = lo; k <= hi; k++) { sx += k; sy += ts[k]; sxx += k * k; sxy += k * ts[k]; m++; }
      const b = m > 1 ? (m * sxy - sx * sy) / (m * sxx - sx * sx) : 0, a = (sy - b * sx) / m; out[i] = a + b * i;
    } return out; };
  const res = {};
  for (const [label, tt] of [['raw', ts], ['fit4', fit(4)], ['fit8', fit(8)], ['fit16', fit(16)]]) {
    // for running players: how much does speed change from one snapshot gap to the next?
    let sum = 0, cnt = 0;
    for (const e in D.slots) { const a = D.slots[e];
      for (let i = 2; i < n; i++) { const ok = (k) => a[k*S+5] > 0 && !isNaN(a[k*S]); if (!ok(i) || !ok(i-1) || !ok(i-2)) continue;
        const d1 = tt[i-1]-tt[i-2], d2 = tt[i]-tt[i-1]; if (d1 <= 0.02 || d2 <= 0.02 || d1 > 0.3 || d2 > 0.3) continue;
        const v1 = Math.hypot(a[(i-1)*S]-a[(i-2)*S], a[(i-1)*S+1]-a[(i-2)*S+1]) / d1, v2 = Math.hypot(a[i*S]-a[(i-1)*S], a[i*S+1]-a[(i-1)*S+1]) / d2;
        if (v1 < 150 || v2 < 150 || v1 > 400 || v2 > 400) continue; sum += Math.abs(v2 - v1); cnt++; } }
    res[label] = { meanSpeedChange: +(sum / cnt).toFixed(1), pairs: cnt };
  }
  const f = fit(8); let md = 0; for (let i = 0; i < n; i++) md = Math.max(md, Math.abs(f[i] - ts[i]));
  res.maxShiftMs = +(md * 1000).toFixed(1);
  return res;
})()
