// Kills tab in round 15 of the 2006 Train demo, with the first kill clicked and playback a few seconds on.
(() => {
  const r = M.liveR[14]; T = r.start + 20; playing = false;
  document.querySelector('.tabs button[data-tab="kills"]').click();
  const first = document.querySelector('#pane [data-kill]'); if (first) first.click();
  playing = false; renderPane();
  return { round: r.ln, kills: document.querySelectorAll('#pane [data-kill]').length, picked: document.querySelectorAll('#pane .row.pick').length, passing: document.querySelectorAll('#pane .row.pass').length };
})()
