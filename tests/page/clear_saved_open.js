// Clear saved files with a demo open: go to the start screen and click Clear saved files twice.
(async () => {
  showLoad(true);
  $('bClear').click();
  await new Promise((r) => setTimeout(r, 300));
  $('bClear').click();
  return 'clicked twice';
})()
