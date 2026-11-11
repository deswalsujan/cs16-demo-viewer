// The small fixes of 23 Oct 2026, on mTw vs Lions, Nuke, DreamHack Summer 2011 (DEMO=mtw-vs-lions, waits for the map):
//  1. R23, minet on dennis, on a restart skip: listed in R23 with R23's own timer (it read "freeze 0:15", the next
//     round's) and //, the cell clear of the kill beside it; and a freeze time cell goes on two lines
//  2. back on the Rounds tab from the Kills tab, the round playing now is in view
//  3. the timeline's hover note stays inside the window at both ends, a skip note included
//  4. the Join card's "Add another part…" is greyed out while the picker row is open
//  5. Full screen's first note names Full screen (the browser's full screen is stood in for: headless can't)
//  6. the minet and niko kills on restart skips get // in the Kills list and aren't wallbangs
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  const res = {};
  const tabBtn = (t) => document.querySelector(`.tabs button[data-tab="${t}"]`);
  // 1 and 6
  const st = M.skipRestart.find((x) => /freeze/.test(clockText(x)) && D.kills.some((k) => Math.abs(k.t - x) < 0.3 && /minet/.test(M.pl[k.kp] ? M.pl[k.kp].name : '') && /dennis/.test(M.pl[k.vp] ? M.pl[k.vp].name : '')));
  res.restartSkips = M.skipRestart.map((x) => clockText(x));
  if (st != null) {
    playing = false; T = st + 0.01; prevT = T; updateHud(true);
    tabBtn('kills').click(); await wait(200);
    const kk = D.kills.find((k) => Math.abs(k.t - st) < 0.3 && /dennis/.test(M.pl[k.vp] ? M.pl[k.vp].name : ''));
    playing = false; T = kk.t - 0.5; prevT = T; updateHud(true); await wait(200);
    const row = document.querySelector(`#pane .krow[data-kill="${kk.t}"]`);
    res.killRound = (() => { const r = M.rounds.find((x) => x.n === kk.round); return r ? 'R' + r.ln : '?'; })();
    if (row) {
      const n = row.querySelector('.n'), main = row.querySelector('.main');
      const nr = Math.max(...[...n.querySelectorAll('.nw')].map((s) => s.getBoundingClientRect().right));
      res.freezeCell = { text: n.innerText.replace(/\n/g, ' | '), lines: n.querySelectorAll('br').length + 1, cellRight: Math.round(nr), mainLeft: Math.round(main.getBoundingClientRect().left), clear: nr <= main.getBoundingClientRect().left + 0.5, skipMark: !!n.querySelector('.skipk') };
    } else res.freezeCell = 'row not found';
    const fz = M.liveR[3].start + 1; res.freezeCellHtml = clockText(fz) + ' -> ' + cellClock(fz);
    res.minetWb = M.wbs.some((k) => Math.abs(k.t - st) < 0.3);
  } else res.freezeCell = 'restart skip not found';
  // 2
  const r23 = M.liveR.find((r) => r.ln === 23);
  playing = false; T = r23.start + 20; prevT = T; updateHud(true);
  tabBtn('kills').click(); await wait(100); $('pane').scrollTop = 0;
  tabBtn('rounds').click(); await wait(300);
  const cur = $('pane').querySelector('.row.cur'), pr = $('pane').getBoundingClientRect();
  res.roundsScroll = cur ? { cur: cur.textContent.trim().slice(0, 12), inView: cur.getBoundingClientRect().top >= pr.top && cur.getBoundingClientRect().bottom <= pr.bottom, scrollTop: Math.round($('pane').scrollTop) } : 'no current row';
  // 3
  const c = $('tlc').getBoundingClientRect(), [a, b] = tlRange();
  const tipAt = (x) => { $('tl').dispatchEvent(new PointerEvent('pointermove', { clientX: x, clientY: c.top + c.height / 2, bubbles: true })); const t = $('tip').getBoundingClientRect(); return { x: Math.round(x), left: Math.round(t.left), right: Math.round(t.right), inside: t.left >= 0 && t.right <= window.innerWidth, text: $('tip').innerText.slice(0, 60) }; };
  const first = M.skipT[0], last = M.skipT[M.skipT.length - 1];
  res.tip = [tipAt(c.left + 2), tipAt(c.left + (first - a) / (b - a) * c.width), tipAt(c.left + (last - a) / (b - a) * c.width), tipAt(c.right - 2)];
  $('tl').dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
  // 4
  tabBtn('rounds').click(); await wait(100);
  $('bJoinWith').click(); await wait(500);
  for (let i = 0; i < 60 && (JOIN.reading || !$('jSel')); i++) await wait(500);
  res.addPart = { pickerOpen: !!$('jSel'), addDisabled: $('jAdd') ? $('jAdd').disabled : 'no button' };
  closeJoinCard();
  // 5
  Object.defineProperty(document, 'fullscreenElement', { get: () => document.documentElement, configurable: true });
  TH.hintFs = false; setTheatre(true); await wait(100);
  res.fullNote = $('toast') ? $('toast').textContent : 'no toast';
  delete document.fullscreenElement; setTheatre(false);
  return res;
})()
