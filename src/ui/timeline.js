// ---------------- timeline ----------------
const tl = $('tl'), tlc = $('tlc'), tctx = tlc.getContext('2d');
function tlRange() {
  if (scope === 'round') { const r = roundAt(T); if (r) return [r.start, Math.max(r.end, r.start + 1)]; }
  if (!showAll && M.liveR.length) return [M.liveR[0].start - 2, M.liveR[M.liveR.length - 1].end + 2];
  return [D.start, D.end];
}
// The timeline (rounds, kills, pauses, wallbangs, plants) only changes when its range, size or content
// changes, so it's drawn once into a hidden canvas and copied each frame; only the playhead moves.
const tlCache = { cv: document.createElement('canvas'), key: '' };
function drawTimeline() {
  if (!D) return;
  const W = tlc.width / dpr, H = tlc.height / dpr;
  const [a, b] = tlRange();
  const key = [D.fileName, D.end, tlc.width, tlc.height, dpr, a, b, showAll, visibleRounds().length, M.wbs ? M.wbs.length : -1, M.skipT ? M.skipT.length : 0].join('|');
  if (tlCache.key !== key) { tlCache.key = key; drawTimelineInto(tlCache.cv, W, H, a, b); }
  tctx.setTransform(1, 0, 0, 1, 0, 0);
  tctx.clearRect(0, 0, tlc.width, tlc.height);
  tctx.drawImage(tlCache.cv, 0, 0);
}
function drawTimelineInto(cv, W, H, a, b) {
  cv.width = tlc.width; cv.height = tlc.height;
  const tctx = cv.getContext('2d');
  tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  tctx.clearRect(0, 0, W, H);
  const X = (t) => (t - a) / (b - a) * W;
  // rounds
  const rs = visibleRounds();
  for (const r of rs) {
    const x0 = X(r.start), x1 = X(r.end);
    if (x1 < 0 || x0 > W) continue;
    tctx.fillStyle = r.winner === 'T' ? 'rgba(232,87,77,.16)' : r.winner === 'CT' ? 'rgba(94,163,232,.16)' : 'rgba(255,255,255,.05)';
    tctx.fillRect(x0 + 0.5, 14, Math.max(1, x1 - x0 - 1), H - 14);
    if (r.live && x1 - x0 > 16) { tctx.fillStyle = '#8d959c'; tctx.font = '10px ' + monoFont(); tctx.textAlign = 'left'; tctx.fillText(r.ln, x0 + 3, 11); }
  }
  // kills
  const liveSet = new Set(rs.map((r) => r.n));
  for (const k of D.kills) {
    if (!liveSet.has(k.round)) continue;
    const x = X(k.t); if (x < 0 || x > W) continue;
    tctx.fillStyle = k.kteam === 'TERRORIST' ? COL.t : k.kteam === 'CT' ? COL.ct : COL.muted;
    tctx.fillRect(Math.round(x) - 1, k.hs ? 16 : 22, 2, k.hs ? H - 16 : H - 22);
  }
  // match pauses
  for (let i = 0; i < (D.pauses || []).length; i++) {
    const p0 = D.pauses[i]; if (!p0.on) continue;
    const p1 = D.pauses.slice(i + 1).find((x) => !x.on);
    const x0 = X(p0.t), x1 = X(p1 ? p1.t : D.end);
    tctx.fillStyle = 'rgba(231,227,217,.35)'; tctx.fillRect(x0, 14, Math.max(2, x1 - x0), H - 14);
  }
  // wallbangs
  // wallbang damage: hollow diamonds in the damage colour (wip/wallbang-hits)
  if (M.bursts) for (const b of M.bursts) { if (b.kill) continue; const x = X(b.start); if (x < 0 || x > W) continue; tctx.strokeStyle = '#ffb347'; tctx.lineWidth = 1.4; tctx.beginPath(); tctx.moveTo(x, 12.5); tctx.lineTo(x + 3.5, 16); tctx.lineTo(x, 19.5); tctx.lineTo(x - 3.5, 16); tctx.closePath(); tctx.stroke(); }
  if (M.wbs) for (const k of M.wbs) { const x = X(k.t); if (x < 0 || x > W) continue; tctx.fillStyle = k.wb.loose ? COL.loose : COL.wb; tctx.beginPath(); tctx.moveTo(x, 12); tctx.lineTo(x + 4, 16); tctx.lineTo(x, 20); tctx.lineTo(x - 4, 16); tctx.fill(); }
  // skips in the recording: a break mark // (0.19.0)
  for (const t of M.skipT || []) {
    const x = X(t); if (x < 0 || x > W) continue;
    tctx.fillStyle = '#0e1012'; tctx.fillRect(x - 3, 14, 6, H - 14);
    tctx.strokeStyle = '#e7e3d9'; tctx.lineWidth = 1.5; tctx.beginPath();
    tctx.moveTo(x - 3.5, H - 2); tctx.lineTo(x - 0.5, 15); tctx.moveTo(x + 0.5, H - 2); tctx.lineTo(x + 3.5, 15); tctx.stroke();
  }
  // bomb plants
  for (const bp of D.bomb) if (bp.type === 'plantpos') { const x = X(bp.t); if (x < 0 || x > W) continue; tctx.fillStyle = COL.kill; tctx.beginPath(); tctx.moveTo(x, H - 8); tctx.lineTo(x + 4, H); tctx.lineTo(x - 4, H); tctx.fill(); }
}
function drawPlayhead() {
  if (!D) return;
  const W = tlc.width / dpr, H = tlc.height / dpr;
  const [a, b] = tlRange();
  const x = (T - a) / (b - a) * W;
  drawTimeline();
  tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  tctx.fillStyle = COL.sand; tctx.fillRect(Math.round(x) - 1, 0, 2, H);
  tctx.beginPath(); tctx.moveTo(x - 5, 0); tctx.lineTo(x + 5, 0); tctx.lineTo(x, 6); tctx.fill();
}
let tlDrag = false;
const tlTime = (e) => { const r = tlc.getBoundingClientRect(); const [a, b] = tlRange(); return a + Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (b - a); };
tl.addEventListener('pointerdown', (e) => { if (!D) return; tlDrag = true; tl.setPointerCapture(e.pointerId); seek(tlTime(e)); });
tl.addEventListener('pointermove', (e) => {
  if (!D) return;
  const t = tlTime(e);
  if (tlDrag) seek(t);
  // tooltip: nearest kill within 6px
  const r = tlc.getBoundingClientRect(); const [a, b] = tlRange();
  let best = null, bd = 6;
  const liveSet = new Set(visibleRounds().map((x) => x.n));
  for (const k of D.kills) { if (!liveSet.has(k.round)) continue; const x = (k.t - a) / (b - a) * r.width; const d = Math.abs(x - (e.clientX - r.left)); if (d < bd) { bd = d; best = k; } }
  const tip = $('tip');
  const rr = roundAt(t);
  tip.innerHTML = best ? `${rr && rr.live ? 'R' + rr.ln + ' ' : ''}${killClock(best.t)} · ${killHtml(best)}` : `${fmt(t - D.start)}${rr && rr.live ? ' · round ' + rr.ln + ' · ' + clockText(t) : ''}`;
  // a skip in the recording within 6 px: say what the // means, above the rest
  const sk = (M.skipT || []).find((st) => Math.abs((st - a) / (b - a) * r.width - (e.clientX - r.left)) < 6);
  if (sk != null) tip.innerHTML = `<b>Recording skips here</b>: HLTV left part of the game out, so players jump<br>` + tip.innerHTML;
  // centred on the mouse, but kept whole inside the window: measured after filling it, since a skip note is far
  // wider than a kill (it ran off the left edge at round 3 and the right edge at the last rounds; Sujan, 23 Oct 2026)
  tip.hidden = false;
  const half = tip.offsetWidth / 2, tr = tl.getBoundingClientRect(), lo = 8 + half - tr.left, hi = window.innerWidth - 8 - half - tr.left;
  tip.style.left = (hi < lo ? lo : Math.max(lo, Math.min(hi, e.clientX - tr.left))) + 'px';
});
tl.addEventListener('pointerup', () => { tlDrag = false; });
tl.addEventListener('pointerleave', () => { $('tip').hidden = true; });
