// 0.18.0 basics on the open demo: short names per team, slow-motion stretches and game time, dropped bombs,
// the kill feed and round text styles. Returns what it finds; run on FX vs Lions, Nuke, DreamHack Winter 2010.
(() => {
  const out = {};
  out.teams = M.teams.map((t) => t.map((p) => [M.pl[p].name, shortName(p)]));
  out.slow = (D.slow || []).length;
  out.slowFirst = (D.slow || []).slice(0, 2).map(([a, b, v]) => [+a.toFixed(2), +b.toFixed(2), v]);
  out.gameLost = +(D.end - gameTime(D.end)).toFixed(2);
  out.c4drops = (D.c4drops || []).length / 5;
  out.c4sample = Array.from((D.c4drops || []).slice(0, 10)).map((x) => +x.toFixed(1));
  // kills at the two jumps: round timer as the viewer shows them now
  out.kills = D.kills.filter((k) => Math.abs(k.t - 677.93) < 0.05 || Math.abs(k.t - 1265.72) < 0.05).map((k) => [M.pl[k.kp] && M.pl[k.kp].name, M.pl[k.vp] && M.pl[k.vp].name, clockText(k.t), +k.t.toFixed(2)]);
  return out;
})()
