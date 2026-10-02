// Opens the load summary again (the harness closes it) so the next script can read it. Since 0.14.0 a closed card stays
// closed for that demo, so the flag is cleared first.
(() => { SUM.closedFor = null; loadSummary(); return 'summary opened'; })()
