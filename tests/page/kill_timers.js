// Every kill's round and round timer as the Kills list shows them, and each live round's length as the Rounds tab shows
// it, for comparing two builds with compare_all.sh (MAP_NEEDED=0 is enough); with the server's pauses the reader found
// (0.26.5: the round and C4 timers stand still through them).
(() => {
  const nm = (e) => (M.pl[e] ? M.pl[e].name : '?');
  return {
    demo: D.fileName,
    stops: (D.stops || []).map(([a, b, g]) => `${fmt(a - D.start)} +${(b - a).toFixed(1)}s`),
    rounds: M.liveR.map((r) => `R${r.ln} ${fmt(clockSpanOr(r.start, r.start + r.dur))}`),
    kills: D.kills.map((k) => { const r = M.rounds.find((x) => x.n === k.round); return `${r && r.live ? 'R' + r.ln : '-'} ${killClock(k.t)} ${fmt(k.t - D.start)} ${nm(k.kp)} -> ${nm(k.vp)}`; }),
  };
  // clockSpan is new in 0.26.5; an older build has only gameSpan
  function clockSpanOr(a, b) { return typeof clockSpan === 'function' ? clockSpan(a, b) : gameSpan(a, b); }
})()
