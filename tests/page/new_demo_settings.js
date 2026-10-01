// Settings when opening another demo (0.12.3): viewing preferences carry over, speed goes back to 1x, paused.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  setView('3d'); setSpeed(0.25); playing = true;
  toggleOpt('names', 'tgNames'); toggleOpt('nades', 'tgNades'); toggleOpt('xray', 'tgXray');
  $('bScope').click(); await wait(500);
  const first = D.fileName;
  loadDemoFile(files.demos.find((f) => f.name.includes('de_train')));
  for (let i = 0; i < 240 && !(D.fileName !== first && M && MAP && view3.map === MAP.name); i++) await wait(500);
  await wait(800);
  const on = (id) => $(id).classList.contains('on');
  return {
    new_demo: D.fileName, speed, playing, view: viewMode, view_button_3d_on: document.querySelector('#viewSeg [data-v="3d"]').classList.contains('on'),
    names: opts.names, names_btn: on('tgNames'), nades: opts.nades, nades_btn: on('tgNades'), lines: opts.lines, xray: opts.xray, xray_btn: on('tgXray'),
    scope, scope_label: $('bScope').textContent, speed_1x_highlighted: [...$('speeds').children].find((b) => b.classList.contains('on')).textContent,
    saved: ls.get('prefs'),
  };
})()
