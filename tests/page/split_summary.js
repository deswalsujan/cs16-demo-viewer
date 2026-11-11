(async () => {
  // The load summary of a part opened on its own (split maps): built afresh, since the harness closes it at load
  SUM.closedFor = null;
  await loadSummary(Promise.resolve());
  return $('sumCard').innerText.replace(/\n+/g, ' | ');
})()
