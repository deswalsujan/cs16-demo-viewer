(async () => {
  // The load summary card's text, built afresh (the harness closes it at load), for checking its lines
  SUM.closedFor = null;
  await loadSummary(Promise.resolve());
  return { demo: D.fileName, text: $('sumCard').innerText.replace(/\n+/g, ' | ') };
})()
