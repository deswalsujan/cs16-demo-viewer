// ---------------- debug info for bug reports ----------------
const ERRLOG = [];
window.addEventListener('error', (e) => { ERRLOG.push(`${e.message} (${(e.filename || '').split('/').pop()}:${e.lineno})`); if (ERRLOG.length > 20) ERRLOG.shift(); });
window.addEventListener('unhandledrejection', (e) => { ERRLOG.push('Promise: ' + (e.reason && e.reason.message || e.reason)); if (ERRLOG.length > 20) ERRLOG.shift(); });
function debugInfo() {
  let gpu = '';
  try { const gl = document.createElement('canvas').getContext('webgl'); const x = gl && gl.getExtension('WEBGL_debug_renderer_info'); gpu = gl ? (x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : 'WebGL available') : 'no WebGL'; } catch (e) { gpu = 'unknown'; }
  const L = [`CS 1.6 Demo Viewer __VERSION__`, `Browser: ${navigator.userAgent}`, `Screen: ${screen.width}x${screen.height} at ${devicePixelRatio}x, window ${innerWidth}x${innerHeight}`, `Graphics: ${gpu}`];
  L.push(`Folder: ${Object.keys(files.maps).length} maps, ${Object.keys(files.overviews).length} overviews, ${Object.keys(files.mdl).length} models, ${Object.keys(files.snd).length} sounds, ${files.demos.length} demos`);
  if (D) {
    L.push(`Demo: ${D.fileName}, protocol ${(D.header && D.header.netProtocol) || '?'}, ${D.pov ? 'POV (recorded by a player)' : 'HLTV'}, map ${D.mapName}, length ${fmt(D.end - D.start)}, ${M.liveR.length} live rounds, final ${M.liveR.length ? M.liveR[M.liveR.length - 1].scoreAfter.join(':') : '-'}`);
    const hs = (D.parts ? D.parts.map((P) => P.health) : [D.health]).map((h) => !h ? '?' : h.index + (h.walked ? `, read frame by frame to byte ${h.stopAt} of ${h.fileLen}` : '') + (h.cutInFrame ? `, stops ${h.cutInFrame} bytes into a frame` : '') + (h.badFrame != null ? `, damaged frame (type ${h.badFrame}) at byte ${h.stopAt}` : '') + (h.extra ? `, ${h.extra} bytes after the index` : ''));
    L.push(`File: index ${hs.join('; ')}`);
    L.push(`Read errors: ${D.errors}${D.errSamples && D.errSamples.length ? ' (' + D.errSamples.join('; ') + ')' : ''}`);
    L.push(`Now: ${fmt(T - D.start)}, view ${viewMode}, camera ${cam3.mode}, speed ${speed}x, sound ${SND.on ? Math.round(SND.vol * 100) + '%' : 'off'}`);
  } else L.push('Demo: none open');
  if (ASSETS) {
    const A = ASSETS, list = (o) => `${o.found}/${o.total}` + (o.custom && o.custom.length ? `, custom: ${o.custom.join(' ')}` : '') + (o.missing.length ? `, missing: ${o.missing.join(' ')}` : '') + (o.broken && o.broken.length ? `, unreadable: ${o.broken.join(' ')}` : '');
    L.push(`Map: ${A.map ? 'loaded' + (A.map.missingTex ? `, ${A.map.missingTex} textures missing` : '') : 'not found'}; overview ${A.overview ? 'loaded' : 'missing'}`);
    L.push(`Player models: ${list(A.players)}`, `Weapon models: ${list(A.weapons)}`, `First-person weapons: ${list(A.views)}`);
    L.push(`Sounds: ${A.sounds.found}/${A.sounds.total}` + (A.sounds.missing.length ? `, missing: ${A.sounds.missing.slice(0, 30).join(' ')}${A.sounds.missing.length > 30 ? ' ...' : ''}` : ''));
  }
  L.push(`Page errors: ${ERRLOG.length ? ERRLOG.join(' | ') : 'none'}`);
  return L.join('\n');
}
$('bDebug').onclick = () => {
  const txt = debugInfo(), b = $('bDebug'), box = $('dbgBox');
  const shown = () => { box.value = txt; box.hidden = false; box.focus(); box.select(); };
  const ok = () => { b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy debug info', 1500); };
  try { navigator.clipboard.writeText(txt).then(ok, () => { b.textContent = 'Select and copy below'; shown(); }); } catch (e) { b.textContent = 'Select and copy below'; shown(); }
};
