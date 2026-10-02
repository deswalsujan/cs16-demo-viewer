(async () => {
  // 0.14.2: the load summary's lines (rounds read and counted, rounds after 16), the team names in the header,
  // the Rounds tab note, and the same after Count them and back.
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // the harness closes the summary after loading; open it again and wait for the check to finish
  SUM.closedFor = null; loadSummary();
  for (let i = 0; i < 120 && !(ASSETS && $('sumCard') && $('sumCard').textContent.includes('Demo read')); i++) await wait(500);
  const sumLines = () => [...$('sumCard').querySelectorAll('li')].map((li) => li.textContent.replace(/\s+/g, ' ').trim());
  const header = () => [...document.querySelectorAll('header *')].map((e) => e.children.length ? '' : e.textContent.trim()).filter((t) => t && M.tnames.some((n) => t.includes(n))).slice(0, 4);
  const roundsNote = () => { tab = 'rounds'; renderPane(); const n = document.querySelector('.note16'); return n ? n.textContent.replace(/\s+/g, ' ').trim() : null; };
  const afterRows = () => document.querySelectorAll('.row.after16').length;
  const out = { demo: D.fileName, tnames: M.tnames.slice(), header: header(), summary: sumLines(), note: roundsNote(), fadedRows: afterRows(), live: M.liveR.length, after16: M.after16 ? M.after16.extra : 0 };
  if (M.after16) {
    setCount30(true); await wait(500); renderPane();
    SUM.closedFor = null; loadSummary(); for (let i = 0; i < 60 && !$('sumCard').textContent.includes('Demo read'); i++) await wait(500);
    out.counted = { summary: sumLines(), live: M.liveR.length, note: roundsNote(), fadedRows: afterRows(), score: M.liveR[M.liveR.length - 1].scoreAfter.join(':') };
    setCount30(false); await wait(500); renderPane();
    SUM.closedFor = null; loadSummary(); for (let i = 0; i < 60 && !$('sumCard').textContent.includes('Demo read'); i++) await wait(500);
    out.back = { summary: sumLines(), live: M.liveR.length, note: roundsNote(), fadedRows: afterRows(), score: M.liveR[M.liveR.length - 1].scoreAfter.join(':') };
  }
  return out;
})()
