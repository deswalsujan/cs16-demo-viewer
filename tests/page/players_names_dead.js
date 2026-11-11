(async () => {
  // 0.14.0: Players tab with shared clan tags dropped, full name on hover, skull in place of the key number while dead
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  closeSummary();
  // a moment in a live round after a few kills, so someone is dead
  const r = M.liveR[Math.min(5, M.liveR.length - 1)];
  const k = r.kills[Math.min(2, r.kills.length - 1)];
  playing = false; seek(k.t + 1);
  document.querySelector('.tabs [data-tab="players"]').click(); await wait(500);
  const rows = [...document.querySelectorAll('.prow:not(.stathead)')].map((el) => ({
    shown: el.querySelector('.nm')?.textContent, title: el.title, skull: !!el.querySelector('.skull'), key: el.querySelector('.pnum:not(.skull)')?.textContent ?? null,
    cut: (() => { const m = el.querySelector('.main'); return m.scrollWidth > m.clientWidth; })(),
  }));
  return { at: fmt(T - D.start), rows };
})()
