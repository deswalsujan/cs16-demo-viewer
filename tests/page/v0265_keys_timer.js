// 0.26.5 (Sujan's feedback of 2 Nov 2026), run on AGAiN vs Na`Vi, Train, recorded 24 Oct 2011 (DEMO=1110240934, waits for
// the map): the round timer across a pause (R7, where the server stopped for 40 s at 65:06), the round keys in every
// view, paused and playing at 1x, 2x and 8x, from 1 s and 10 s into a round, Up pressed twice 0.3 s apart, a held key's
// repeats, keys with the volume slider, a checkbox or a list focused, and the side panel's scroll on the Kills tab.
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && R3 && view3.map === MAP.name) && Date.now() - t0 < 200000) await wait(500);
  const out = {};
  // the timer: every kill of the round with the pause, and the stretches the reader found
  const r7 = M.liveR.find((r) => r.ln === 7);
  out.stops = (D.stops || []).map(([a, b, g]) => `${fmt(a - D.start)} +${(b - a).toFixed(1)}s demo, ${g.toFixed(2)}s server`);
  out.r7 = r7 ? r7.kills.map((k) => `${fmt(k.t - D.start)} ${killClock(k.t)} ${M.pl[k.kp] ? M.pl[k.kp].name : '?'} -> ${M.pl[k.vp] ? M.pl[k.vp].name : '?'}`) : null;
  out.r7Length = r7 ? fmt(clockSpan(r7.start, r7.start + r7.dur)) : null;
  // the keys
  const rs = M.liveR, lnAt = () => { const r = roundAt(T); return r && r.live ? r.ln : (r ? 'x' + r.n : null); };
  const press = (key, target, repeat) => (target || document.body).dispatchEvent(new KeyboardEvent('keydown', { key, repeat: !!repeat, bubbles: true, cancelable: true }));
  const picks = [rs[3], rs[Math.floor(rs.length / 2)], rs[rs.length - 3]];
  const setups = [['2d', 'free'], ['3d', 'free'], ['3d', 'eyes'], ['3d', 'chase'], ['split', 'eyes']];
  let n = 0; const bad = [];
  for (const [vm, cm] of setups) {
    setView(vm); if (vm !== '2d') { selected = null; setCam(cm, true); }
    await wait(300);
    for (const pl of [false, true]) for (const sp of pl ? [1, 2, 8] : [1]) {
      setSpeed(sp);
      for (const r of picks) for (const [act, off] of [['down', 1], ['down', 10], ['up', 1], ['up', 10], ['upup', 10]]) {
        playing = false; seek(r.start + off); if (vm !== '2d' && cm !== 'free') { const al = alivePlayers(); selected = al[0] || null; }
        playing = pl; setPlayIcon(); await wait(120);
        const before = lnAt();
        if (act === 'down') press('ArrowDown'); else if (act === 'up') press('ArrowUp'); else { press('ArrowUp'); await wait(300); press('ArrowUp'); }
        const now = lnAt(); n++;
        const want = act === 'down' ? before + 1 : act === 'up' ? before - 1 : before - 2;
        if (now !== want) bad.push(`${vm}/${cm} ${pl ? 'play ' + sp + 'x' : 'paused'} R${before}+${off}s ${act}: R${now} (want R${want})`);
      }
    }
  }
  playing = false; setPlayIcon(); setSpeed(1);
  out.keys = { pressed: n, wrong: bad.length, rows: bad.slice(0, 20) };
  // a held key: its repeats move no further
  seek(picks[1].start + 10); { const b = lnAt(); press('ArrowDown'); press('ArrowDown', null, true); press('ArrowDown', null, true); out.held = `R${b} -> R${lnAt()} (want R${b + 1})`; }
  // with a control focused: the key works, and the control keeps its value
  out.focused = [];
  for (const id of ['sndVol', 'glow3', 'q3', 'xh3']) {
    const el = $(id); if (!el) continue;
    seek(picks[1].start + 10); const b = lnAt(), v0 = el.type === 'checkbox' ? el.checked : el.value;
    el.focus(); const ev = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }); el.dispatchEvent(ev);
    out.focused.push(`${id}: R${b} -> R${lnAt()} (want R${b - 1}), default prevented ${ev.defaultPrevented}, value kept ${String(el.type === 'checkbox' ? el.checked : el.value) === String(v0)}`);
    el.blur();
  }
  // a text box still takes its keys: the search box isn't on this screen, so a stand-in
  { const tb = document.createElement('input'); tb.type = 'text'; document.body.appendChild(tb); tb.focus(); seek(picks[1].start + 10); const b = lnAt(); const ev = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }); tb.dispatchEvent(ev); out.textBox = `R${b} -> R${lnAt()} (want R${b}), default prevented ${ev.defaultPrevented}`; tb.remove(); }
  // the Kills tab opens at the top, and stays there at a new round
  const tabBtn = (t) => document.querySelector(`.tabs button[data-tab="${t}"]`);
  seek(rs[rs.length - 2].start + 20); updateHud(true);
  tabBtn('rounds').click(); await wait(200);
  const roundsTop = $('pane').scrollTop;
  tabBtn('kills').click(); await wait(200);
  const head = $('pane').querySelector('.sechead');
  out.killsTab = { roundsScrolled: roundsTop, killsScroll: $('pane').scrollTop, heading: head ? head.innerText.replace(/\s+/g, ' ') : null, headingInView: head ? head.getBoundingClientRect().top >= $('pane').getBoundingClientRect().top - 1 : false };
  $('pane').scrollTop = 200; press('ArrowUp'); await wait(250); updateHud(false); await wait(100);
  out.killsTabNewRound = { scroll: $('pane').scrollTop, heading: $('pane').querySelector('.sechead') ? $('pane').querySelector('.sechead').innerText.replace(/\s+/g, ' ') : null };
  tabBtn('rounds').click();
  return out;
})()
