// The POV mode setting (0.25.0, Sujan 29 Oct 2026), on a POV demo opened with it off (run without POV_MODE): the load
// summary's line and its button, then the button: the demo opens again in POV mode at the same moment, with the 3D
// bar down to View settings and its Crosshair and Glow on hits rows hidden. Leaves View settings open for a screenshot.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rows = () => [...document.querySelectorAll('#vsetPanel .vrow')].filter((r) => !r.hidden).map((r) => r.firstElementChild.firstChild.textContent.trim());
  const out = { before: { povMode: !!D.povOn, checkbox: $('pov3').checked } };
  setView('3d'); seek(D.start + 200); playing = false; const t = T;
  SUM.closedFor = null; await loadSummary(Promise.resolve()); await wait(300);
  const li = [...document.querySelectorAll('#sumCard .sum-list li')].find((x) => /POV/.test(x.innerText));
  out.summaryLine = li ? li.innerText.replace(/\s+/g, ' ').trim() : null;
  out.button = $('sumPov') ? $('sumPov').textContent : null;
  out.barBefore = { cameras: !$('cam3').querySelector('.camseg').hidden, rowsInViewSettings: rows() };
  if (!$('sumPov')) return out;
  $('sumPov').click();
  const t0 = Date.now();
  while (!(D && D.povOn && M && $('load').hidden) && Date.now() - t0 < 120000) await wait(300);
  await wait(500);
  out.after = { povMode: !!D.povOn, checkbox: $('pov3').checked, saved: ls.get('povMode'), sameMoment: Math.abs(T - t) < 0.01, cameras: !$('cam3').querySelector('.camseg').hidden, prevNext: !$('bPrevP').hidden, rowsInViewSettings: rows() };
  SUM.closedFor = null; await loadSummary(Promise.resolve()); await wait(300);
  const li2 = [...document.querySelectorAll('#sumCard .sum-list li')].find((x) => /POV/.test(x.innerText));
  out.after.summaryLine = li2 ? li2.innerText.replace(/\s+/g, ' ').trim() : null;
  closeSummary();
  $('bVset').click();
  return out;
})()
