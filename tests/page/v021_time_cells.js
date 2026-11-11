// Time cells in the Kills and Wallbangs lists (0.21.1): "C4 0:16" stays on one line, under "R2 ·" in the Wallbangs
// list, with and without the clicked kill's bookmark, and nothing spills into the kill next to it. Waits for the map.
// Run with DEMO=fx-vs-lions (FX vs Lions, Nuke, DreamHack Winter 2010: R2, 742 on Xizt at C4 0:16).
(async () => {
  const t0 = Date.now();
  while (!(M && M.wbs && MAP && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 180000) await new Promise((r) => setTimeout(r, 500));
  const k = M.liveR[1].kills.find((x) => x.wb && skipNear(x.t));
  const lines = (el) => { const n = el.querySelector('.n'), out = []; const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); let x; const rows = new Map();
    while ((x = w.nextNode())) { const rg = document.createRange(); rg.selectNodeContents(x); for (const b of rg.getClientRects()) { const y = Math.round(b.top); rows.set(y, (rows.get(y) || '') + x.textContent.slice(0)); } }
    return n.innerText.split('\n').map((s) => s.trim()).filter(Boolean); };
  const fits = (el) => el.querySelector('.n').getBoundingClientRect().right <= el.querySelector('.main').getBoundingClientRect().left;
  const out = {};
  for (const tab of ['kills', 'wb']) {
    seek(k.t + 0.5); playing = false; pickedKill = null;
    document.querySelector(`.tabs button[data-tab="${tab}"]`).click(); renderPane();
    const sel = tab === 'kills' ? `[data-kill="${k.t}"]` : `[data-wb="${k.t}"]`;
    let el = document.querySelector('#pane ' + sel);
    out[tab] = { plain: lines(el), plainFits: fits(el) };
    el.click(); renderPane(); el = document.querySelector('#pane ' + sel);
    out[tab].picked = lines(el); out[tab].pickedFits = fits(el);
  }
  return out;
})()
