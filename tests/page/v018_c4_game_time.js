// C4 timer in game time (0.18.0): from each plant to its explosion, on the demo's clock and in game time.
// The game's C4 timer is fixed, so game time must read the same for every explosion, slow motion or not.
(() => D.bomb.filter((b) => b.type === 'planted').map((b) => {
  const end = D.centre.find((c) => c.t > b.t && /Target_Bombed/.test(c.s));
  const next = D.bomb.find((x) => x.t > b.t && x.type === 'planted');
  if (!end || (next && next.t < end.t)) return null;
  return { plant: fmt(b.t - D.start), demo: +(end.t - b.t).toFixed(2), game: +gameSpan(b.t, end.t).toFixed(2), clockAtBoom: clockText(end.t - 0.01) };
}).filter(Boolean))()
