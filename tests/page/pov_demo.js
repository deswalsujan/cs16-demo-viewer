// 0.13.0: a demo recorded by a player (POV) that ran on into the next map. Expected: it opens on the map
// it spent longest on, rounds are found from the round timer, and the load summary notes both.
(() => {
  const card = document.querySelector('#sumCard .sum');
  return {
    demo: D.fileName, map: D.mapName, maps: D.maps, pov: D.pov,
    rounds: M.rounds.length, liveRounds: M.liveR.length, kills: D.kills.length, killsRetimed: D.killsRetimed,
    summary: window.__sum || null,
    score: [...document.querySelectorAll('#score .num')].map((x) => x.textContent).join(':'),
  };
})()
