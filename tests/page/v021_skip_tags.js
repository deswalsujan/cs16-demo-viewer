// Skip tags in the Kills list (0.21.0, docs/skip-tags-mock.png): WALLBANG and UNSURE on their own line under the gun,
// inside the panel, and // by the time of every kill on a skip, wallbangs included. Waits for the map (the wallbang
// finder needs it). Run with DEMO=fx-vs-lions (FX vs Lions, Nuke, DreamHack Winter 2010: R2, 742 on Xizt, C4 0:16).
// Leaves the Kills tab of R2 open with that kill clicked, for a screenshot.
(async () => {
  const t0 = Date.now();
  while (!(M && M.wbs && MAP && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 180000) await new Promise((r) => setTimeout(r, 500));
  const r = M.liveR[1];
  const k = r.kills.find((x) => x.wb && skipNear(x.t));
  seek(k.t + 0.5); playing = false;
  document.querySelector('.tabs button[data-tab="kills"]').click();
  renderPane();
  const row = document.querySelector(`#pane [data-kill="${k.t}"]`); row.click(); renderPane();
  const pane = $('pane').getBoundingClientRect();
  const rows = [...document.querySelectorAll('#pane [data-kill]')].map((el) => {
    const tags = [...el.querySelectorAll('.ktags .wbtag')];
    const kill = r.kills.find((x) => String(x.t) === el.dataset.kill);
    return {
      time: el.querySelector('.n').innerText.replace(/\s+/g, ' ').trim(),
      killer: M.pl[kill.kp] ? M.pl[kill.kp].name : '', victim: M.pl[kill.vp] ? M.pl[kill.vp].name : '',
      skipMark: !!el.querySelector('.skipk'), tags: tags.map((t) => t.innerText),
      tagsInside: tags.every((t) => { const b = t.getBoundingClientRect(); return b.right <= pane.right && b.width > 0 && t.scrollWidth <= t.clientWidth + 1; }),
      tagsUnderGun: tags.length ? tags[0].getBoundingClientRect().top >= el.querySelector('.gun').getBoundingClientRect().bottom - 1 : null,
    };
  });
  // every demo-wide kill on a skip: how many get the //, wallbangs included
  const onSkip = M.liveR.flatMap((x) => x.kills).filter((x) => skipNear(x.t));
  return { round: r.ln, rows, killsOnSkip: onSkip.length, wallbangsOnSkip: onSkip.filter((x) => x.wb).length };
})()
