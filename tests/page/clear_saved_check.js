// After Clear saved files: no demo open, header, side panel, timeline and buttons back to a first visit.
(() => {
  const vis = (id) => !$(id).hidden;
  return {
    demoOpen: !!D, meta: $('meta').textContent, scoreShown: vis('score'),
    pane: $('pane').textContent.trim(), time: $('time').textContent,
    backButtonShown: vis('btnOpen'), playDisabled: $('bPlay').disabled, timelineOff: $('tl').classList.contains('off'),
    folderTitle: $('hlTitle').textContent, msg: $('msg').textContent,
  };
})()
