(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms)); await wait(3000); closeSummary();
  const res = {};
  // cycle every mode while playing at 8x across a round change; any error shows up in PAGE ERRORS
  speed = 8; playing = true;
  for (const m of ['chase', 'free', 'eyes']) { setCam(m); await wait(1500); }
  for (const v of ['split', '2d', '3d']) { setView(v); await wait(1500); }
  // jump across rounds: overlays must reset
  jumpRound(1); await wait(800); res.afterJump = R3.ov.key;
  // toggles
  $('tgSmooth').click(); res.smoothOff = !opts.smoothAim; $('tgSmooth').click();
  $('q3').value = 'low'; $('q3').onchange(); res.lowRatio = R3.renderer.getPixelRatio();
  $('q3').value = 'high'; $('q3').onchange(); res.highRatio = R3.renderer.getPixelRatio();
  $('q3').value = 'auto'; $('q3').onchange();
  toggleOpt('names', 'tgNames'); await wait(600); toggleOpt('names', 'tgNames');
  toggleOpt('xray', 'tgXray'); await wait(600); toggleOpt('xray', 'tgXray');
  playing = false; speed = 1;
  res.timelineCached = !!tlCache.key;
  setView('split'); setCam('eyes'); await wait(1200);
  return res;
})()
