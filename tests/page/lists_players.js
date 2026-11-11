// Players tab: the player being followed gets the strong highlight.
(() => {
  const alive = Object.keys(D.slots).map(Number).find((e) => { const s = playerState(e, T); return s && s.state > 0; });
  selectPlayer(alive);
  document.querySelector('.tabs button[data-tab="players"]').click();
  return { sel: [...document.querySelectorAll('#pane .prow.sel')].map((x) => x.textContent.replace(/\s+/g, ' ').trim()) };
})()
