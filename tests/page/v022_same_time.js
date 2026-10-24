// Two kills at the same moment (0.22.2): FX vs Lions, Nuke, DreamHack Winter 2010 (DEMO=fx-vs-lions), R20 C4 0:05,
// KUB3N on Xizt and NEO's wallbang on NIKO arrive in one snapshot. Clicking each row in the Kills list, and NEO's in
// the Wallbangs list, must pick that kill and follow its own killer (Sujan, 24 Oct 2026: NEO's row showed KUB3N's view).
(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  while (!(MAP && M && M.wbs && MAP.name === D.mapName.toLowerCase()) && Date.now() - t0 < 150000) await wait(500);
  await wait(1000);
  while ((M.seenPending || D.kills.some((k) => k.wb && k.seenPx == null)) && Date.now() - t0 < 600000) await wait(500);
  const nm = (p) => (M.pl[p] ? M.pl[p].name : '?');
  const r20 = M.liveR.find((r) => r.ln === 20);
  const same = r20.kills.filter((k) => r20.kills.some((o) => o !== k && o.t === k.t));
  const out = { sameTime: same.map((k) => `${nm(k.kp)} -> ${nm(k.vp)}${k.wb ? ' WB' : ''}`), kills: [], wb: null };
  playing = false; T = r20.start + 5; prevT = T; updateHud(true);
  document.querySelector('.tabs button[data-tab="kills"]').click(); await wait(200);
  for (const k of same) {
    const row = document.querySelector(`#pane .krow[data-ki="${D.kills.indexOf(k)}"]`);
    row.click(); await wait(300);
    out.kills.push({ row: `${nm(k.kp)} -> ${nm(k.vp)}`, picked: pickedKill === k, follows: selected != null ? nameAt(selected, T) : null, ok: pickedKill === k && selected === k.killer });
  }
  const wbk = same.find((k) => k.wb);
  if (wbk) {
    document.querySelector('.tabs button[data-tab="wb"]').click(); await wait(200);
    document.querySelector(`#pane .wbrow[data-ki="${D.kills.indexOf(wbk)}"]`).click(); await wait(300);
    out.wb = { row: `${nm(wbk.kp)} -> ${nm(wbk.vp)}`, picked: pickedKill === wbk, follows: selected != null ? nameAt(selected, T) : null, ok: pickedKill === wbk && selected === wbk.killer };
  }
  out.pass = out.kills.length >= 2 && out.kills.every((x) => x.ok) && (!out.wb || out.wb.ok);
  return out;
})()
