// ---------------- loop ----------------
let lastNow = performance.now(), hudAcc = 0;
function frame(now) {
  const dt = Math.min(0.1, (now - lastNow) / 1000); lastNow = now;
  if (D && playing && !tlDrag) {
    T += dt * speed / slowAt(T); // slow-motion stretches play at real speed (see slowAt)
    if (T >= D.end) { T = D.end; playing = false; setPlayIcon(); }
  }
  if (D) {
    // a kill "lands" when playback moves forward past it (not when you jump around)
    if (prevT != null && T > prevT && T - prevT < 1) for (const k of D.kills) if (k.t > prevT && k.t <= T && k.killer !== k.victim && k.kp) flashes.push({ k, at: now });
    if (prevT != null && playing && !tlDrag) soundTick(prevT, T);
    prevT = T;
    while (flashes.length && now - flashes[0].at > FLASH_MS) flashes.shift();
  }
  if (D) {
    if (selected && view.s > 1.3 && playing) {
      const s = playerState(selected, T);
      if (s && s.state > 0) { const [px, py] = w2i(s.x, s.y); const S = base.s * view.s; view.x += ((cw / 2 - (base.x * view.s + px * S)) - view.x) * 0.08; view.y += ((ch / 2 - (base.y * view.s + py * S)) - view.y) * 0.08; }
    }
    updateFeed(); // before the 3D view draws the ✕, so both come in the same frame
    if (viewMode !== '3d') draw();
    drawPlayhead(); updateCentre();
    if (viewMode !== '2d') { if (MAP && view3.map !== MAP.name) build3d(); update3(); }
    hudAcc += dt; if (hudAcc > 0.1) { hudAcc = 0; updateHud(false); }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// restore overview cache note
setMsg('');
setControls(false);
// Team colours: real models in flat red and blue. The simple figures are only used when a model file is missing or broken.
const tcShow = () => { $('tgModels').classList.toggle('on', opts.teamColours); $('tgModels').textContent = opts.teamColours ? 'On' : 'Off'; };
$('tgModels').onclick = () => { opts.teamColours = !opts.teamColours; tcShow(); ls.set('teamColours', opts.teamColours); };
if (ls.get('teamColours') === true) { opts.teamColours = true; tcShow(); }
// View settings (0.18.1): opens under its button; a click outside it or Esc closes it
const vsetOpen = (on) => { $('vsetPanel').hidden = !on; $('bVset').setAttribute('aria-expanded', on ? 'true' : 'false'); };
$('bVset').onclick = (e) => { e.stopPropagation(); vsetOpen($('vsetPanel').hidden); };
document.addEventListener('pointerdown', (e) => { if (!$('vsetPanel').hidden && !e.target.closest('.vset')) vsetOpen(false); }, true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('vsetPanel').hidden) { e.stopPropagation(); vsetOpen(false); $('bVset').focus(); } }, true);
ls.set('models', null); // the old "Player models" switch is gone (0.11.0): forget its setting
ls.set('smoothAim', null); // Smooth aim was removed in 0.10.0: forget the old setting
$('q3').value = ['auto', 'high', 'low'].includes(ls.get('quality')) ? ls.get('quality') : 'auto';
$('q3').onchange = () => { ls.set('quality', $('q3').value); applyQuality(true); };
// crosshair size in Player's eyes (0.18.0, Sujan 14 Oct 2026): small is the size before 0.18.0; medium is the default
// crosshair sizes moved down one step on 26 Oct 2026 (large = the old medium): a size saved before keeps its look
{ const old = ls.get('crosshair'), now = ls.get('crosshair2');
  $('xh3').value = ['small', 'medium', 'large'].includes(now) ? now : old === 'small' ? 'medium' : 'large'; }
$('xh3').onchange = () => { ls.set('crosshair2', $('xh3').value); };
$('glow3').checked = ls.get('hitGlow') !== 'off';
$('glow3').onchange = () => { ls.set('hitGlow', $('glow3').checked ? 'on' : 'off'); };
// POV mode (0.25.0, Sujan 29 Oct 2026): off by default until Sujan signs it off; with it off every demo plays as in 0.24.0
$('pov3').checked = ls.get('povMode') === 'on';
$('pov3').onchange = () => { ls.set('povMode', $('pov3').checked ? 'on' : 'off'); reopenForPov(); };
if (document.fonts) document.fonts.ready.then(() => { tlCache.key = ''; });
$('bSnd').onclick = () => setSound(!SND.on);
// full screen: the whole viewer fills the screen (Esc or F leaves it)
function toggleFull() {
  const el = document.documentElement;
  if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
  const req = el.requestFullscreen ? el.requestFullscreen() : Promise.reject(new Error('no fullscreen'));
  req.catch(() => { setMsg('Full screen is blocked here. Press F11 in your browser instead.'); if (D) toast('Full screen is blocked here. Press F11 in your browser instead.'); });
}
$('bFull').onclick = toggleFull;
document.addEventListener('fullscreenchange', () => {
  const fs = !!document.fullscreenElement;
  $('bFull').textContent = fs ? 'Exit full screen' : 'Full screen';
  // full screen always uses Theatre mode; leaving it puts back whatever was on before
  if (fs) { TH.before = TH.on; setTheatre(true); } else setTheatre(TH.before);
});
