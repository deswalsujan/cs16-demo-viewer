(async () => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms));
  const out = {};
  // a missing model: the plain figures take over for those players
  $('tgModels').click();
  for (const k in MODELS) if (/models\/player\//.test(k)) { MODELS[k].status = 'missing'; }
  clearRigs(); await w(1200);
  out.figuresShown = Object.values(R3.players).filter((f) => f.g.visible).length;
  for (const k in MODELS) if (/models\/player\//.test(k) && MODELS[k].mdl) MODELS[k].status = 'ok';
  return out;
})()
