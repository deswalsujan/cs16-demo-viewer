(async () => {
  // Join them, wait for the joined map, then show the Rounds tab at the marker where the file changes
  $('jGo').click();
  for (let i = 0; i < 1200 && !(D && D.parts && M && !$('sumCard').hidden && !/Checking/.test($('sumCard').innerText)); i++) await new Promise((r) => setTimeout(r, 250));
  const summary = $('sumCard').innerText.replace(/\n+/g, ' | ');
  closeSummary();
  document.querySelector('.tabs button[data-tab="rounds"]').click();
  const m = document.querySelector('.partmark'); if (m) { m.scrollIntoView({ block: 'center' }); $('pane').scrollTop -= 60; }
  const last = M.liveR[M.liveR.length - 1];
  return { parts: D.parts.map((p) => p.fileName), chip: $('partsChip').textContent, meta: $('meta').textContent, score: last.scoreAfter.join(':'), teams: M.tnames, remembered: ls.get('join:' + D.parts[1].fileName), summary, marker: m && m.innerText };
})()
