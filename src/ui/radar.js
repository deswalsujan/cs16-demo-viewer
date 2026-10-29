// ---------------- radar rendering ----------------
const cv = $('cv'), ctx = cv.getContext('2d');
let cw = 0, ch = 0, dpr = 1;
function resize() {
  const r = cv.getBoundingClientRect();
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cw = r.width; ch = r.height;
  cv.width = Math.round(cw * dpr); cv.height = Math.round(ch * dpr);
  const t = $('tlc'); const tr = t.getBoundingClientRect();
  t.width = Math.round(tr.width * dpr); t.height = Math.round(tr.height * dpr);
  if (D) { fitView(true); drawTimeline(); }
}
new ResizeObserver(resize).observe($('radar'));
new ResizeObserver(resize).observe(cv);
new ResizeObserver(resize).observe($('tl'));

let base = { s: 1, x: 0, y: 0 };
function fitView(keepUser) {
  const iw = OV ? OV.w : 1024, ih = OV ? OV.h : 768;
  const s = Math.min(cw / iw, ch / ih) * 0.98;
  base = { s, x: (cw - iw * s) / 2, y: (ch - ih * s) / 2 };
  if (!keepUser) view = { s: 1, x: 0, y: 0 };
}
const tx = (px, py) => [base.x * view.s + view.x + px * base.s * view.s, base.y * view.s + view.y + py * base.s * view.s];
function toScreen(x, y) { const [px, py] = w2i(x, y); return tx(px, py); }

// pan and zoom
let drag = null;
cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false }; cv.setPointerCapture(e.pointerId); cv.classList.add('drag'); });
cv.addEventListener('pointermove', (e) => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true; view.x = drag.vx + dx; view.y = drag.vy + dy; });
cv.addEventListener('pointerup', (e) => { cv.classList.remove('drag'); if (drag && !drag.moved) pickPlayer(e); drag = null; });
cv.addEventListener('wheel', (e) => {
  e.preventDefault();
  const r = cv.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top;
  const f = Math.exp(-e.deltaY * 0.0015); const ns = Math.max(0.5, Math.min(8, view.s * f)); const k = ns / view.s;
  view.x = mx - (mx - view.x) * k; view.y = my - (my - view.y) * k; view.s = ns;
}, { passive: false });
function pickPlayer(e) {
  if (!D) return;
  const r = cv.getBoundingClientRect(); const mx = e.clientX - r.left, my = e.clientY - r.top;
  let best = null, bd = 18;
  for (const p of lastPlayers) { const d = Math.hypot(p.sx - mx, p.sy - my); if (d < bd) { bd = d; best = p.e; } }
  if (best) selectPlayer(best);
  else if (selected) selectPlayer(selected);
}

function toggleOpt(k, id) {
  opts[k] = !opts[k]; $(id).classList.toggle('on', opts[k]);
  if (k === 'xray' && opts.xray) showHiddenEnemiesNote(); // POV mode
  savePrefs();
}
// Jump to a moment before a kill and watch it through the shooter's eyes (in 3D)
function watchKill(k, before) {
  if (k.kp && k.killer !== k.victim) selected = k.killer;
  seek(k.t - before); playing = true; setPlayIcon();
  if (viewMode !== '2d') setCam('eyes', true);
  renderPane();
}
// Picking a player follows them; picking the same player again lets go and returns to the free camera
function selectPlayer(e) {
  if (selected === e) {
    // let go: the free camera starts just behind where we were following
    if (viewMode !== '2d' && cam3.mode !== 'free') setCam('free');
    selected = null;
  } else {
    selected = e;
    if (viewMode !== '2d' && cam3.mode === 'free') setCam('eyes', true);
  }
  renderPane();
}
$('tgNames').onclick = () => toggleOpt('names', 'tgNames');
$('tgNades').onclick = () => toggleOpt('nades', 'tgNades');
$('tgLines').onclick = () => toggleOpt('lines', 'tgLines');
$('tgXray').onclick = () => toggleOpt('xray', 'tgXray');
// Reset view: back to where the view starts. In 2D the whole radar (zoom and pan undone); in 3D the overview
// camera the demo opens with, as a free camera, so it stops riding along with a followed player. That player
// stays highlighted. In split view both reset.
$('tgFit').onclick = () => { fitView(); if (viewMode !== '2d' && D) resetCam3(); };

// Player state at time t, filled in between the demo's snapshots (HLTV stores about ten a second).
// Movement and aim follow a smooth curve through the snapshots around t instead of straight lines,
// so speed and turning change gradually rather than jumping at every snapshot. The curve never swings
// past a snapshot (no overshoot when a player stops or turns back), and it only uses snapshots from the
// same life: a respawn, a death or a long gap in the recording falls back to straight lines or a hold.
const wrap180 = (d) => { d %= 360; return d > 180 ? d - 360 : d < -180 ? d + 360 : d; };
// slope at a snapshot for a curve that can't overshoot (Fritsch-Carlson): zero at peaks, capped near sharp bends
function slopeAt(dl, dr, hl, hr) {
  if (dl == null) return dr; if (dr == null) return dl;
  if (dl * dr <= 0) return 0;
  const m = (dl * hr + dr * hl) / (hl + hr);
  const cap = 3 * Math.min(Math.abs(dl), Math.abs(dr));
  return Math.sign(m) * Math.min(Math.abs(m), cap);
}
function hermite(p0, p1, m0, m1, h, f) {
  const f2 = f * f, f3 = f2 * f;
  return (2 * f3 - 3 * f2 + 1) * p0 + (f3 - 2 * f2 + f) * h * m0 + (-2 * f3 + 3 * f2) * p1 + (f3 - f2) * h * m1;
}
// HLTV stamps its snapshots a little unevenly (a 156 ms gap followed by a 68 ms one while the player runs at
// a steady speed), and a curve through those times would turn the unevenness into speed wobble. For filling
// in between snapshots we use evened-out times: a straight-line fit of time against snapshot number over the
// 8 snapshots either side, kept within stretches with no gap over 0.3 s and never moved more than 50 ms.
// Kills, sounds and every other event keep the demo's own times.
function evenTimes() {
  if (D._even) return D._even;
  const ts = D.times, n = ts.length, W = 8, out = new Float64Array(n);
  let s0 = 0;
  // a stretch also ends where HLTV's slow motion starts or stops: the gaps there double or halve
  const rate = new Float32Array(n); for (let i = 0; i < n; i++) rate[i] = slowAt(ts[i]);
  for (let i = 0; i < n; i++) {
    if (i > 0 && (ts[i] - ts[i - 1] > 0.3 || rate[i] !== rate[i - 1])) s0 = i;
    let hi = i; while (hi + 1 < n && hi - i < W && ts[hi + 1] - ts[hi] <= 0.3 && rate[hi + 1] === rate[i]) hi++;
    const lo = Math.max(s0, i - W);
    let sx = 0, sy = 0, sxx = 0, sxy = 0, m = 0;
    for (let k = lo; k <= hi; k++) { const x = k - i; sx += x; sy += ts[k]; sxx += x * x; sxy += x * ts[k]; m++; }
    const den = m * sxx - sx * sx, b = den > 0 ? (m * sxy - sx * sy) / den : 0, fit = (sy - b * sx) / m;
    out[i] = Math.abs(fit - ts[i]) <= 0.05 ? fit : ts[i];
    if (i > 0 && out[i] <= out[i - 1]) out[i] = out[i - 1] + 1e-4;
  }
  return D._even = out;
}
// last snapshot at or before t on the evened-out times
function evenIdx(tt, t) {
  let lo = 0, hi = tt.length - 1;
  if (t <= tt[0]) return 0;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (tt[mid] <= t) lo = mid; else hi = mid - 1; }
  return lo;
}
const PS = { t: NaN, D: null, map: new Map() }; // states at the current time, shared by the 2D, 3D and sound code each frame
function playerState(e, t) {
  if (t === T && PS.t === T && PS.D === D) { const c = PS.map.get(e); if (c !== undefined) return c; }
  else if (t === T) { PS.t = T; PS.D = D; PS.map.clear(); }
  const s = playerStateAt(e, t);
  if (t === T) PS.map.set(e, s);
  return s;
}
function playerStateAt(e, t) {
  const a = D.slots[e]; if (!a) return null;
  const S = D.stride; const times = evenTimes(), n = times.length;
  const i = evenIdx(times, t), j = Math.min(i + 1, n - 1);
  const ai = i * S, aj = j * S;
  const state = a[ai + 5];
  if (!state) return null;
  let x = a[ai], y = a[ai + 1], z = a[ai + 2], yaw = a[ai + 3];
  if (isNaN(x)) return null;
  let pr = a[ai + 4]; if (pr > 180) pr -= 360;
  // snapshot k belongs to the same stretch as snapshot i when it exists, has the same state and isn't far away in time
  const same = (k, prev) => k >= 0 && k < n && !isNaN(a[k * S]) && a[k * S + 5] === state && Math.abs(times[k] - times[prev]) < 0.5
    && !(M.skipIdx && M.skipIdx.has(Math.max(k, prev))); // no sliding across a skip in the recording: the player snaps (0.19.0)
  const span = times[j] - times[i];
  if (j !== i && span > 0 && same(j, i)) {
    const f = Math.max(0, Math.min(1, (t - times[i]) / span));
    const hasL = same(i - 1, i), hasR = same(j + 1, j);
    const hl = hasL ? times[i] - times[i - 1] : 0, hr = hasR ? times[j + 1] - times[j] : 0;
    // one value through four snapshots: v(k) reads it at snapshot k, unwrapped around the value at i for angles
    const curve = (v) => {
      const p0 = v(i), p1 = v(j);
      const d = (p1 - p0) / span;
      const dl = hasL ? (p0 - v(i - 1)) / hl : null, dr = hasR ? (v(j + 1) - p1) / hr : null;
      return hermite(p0, p1, slopeAt(dl, d, hl, span), slopeAt(d, dr, span, hr), span, f);
    };
    const yaw0 = a[ai + 3], pr0 = pr;
    const yawK = (k) => yaw0 + wrap180(a[k * S + 3] - yaw0);
    const prK = (k) => { let p = a[k * S + 4]; if (p > 180) p -= 360; return pr0 + wrap180(p - pr0); };
    x = curve((k) => a[k * S]); y = curve((k) => a[k * S + 1]); z = curve((k) => a[k * S + 2]);
    yaw = curve(yawK); pr = curve(prK);
  }
  return { x, y, z, yaw, pitch: -pr * 3, duck: a[ai + 7], state, weapon: D.models[a[ai + 6]] };
}

let lastPlayers = [];
function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cw, ch);
  if (!D) return;
  const r = roundAt(T);
  const S = base.s * view.s;

  // map
  if (OV) {
    const [x0, y0] = tx(0, 0);
    ctx.imageSmoothingEnabled = view.s < 2.5;
    ctx.drawImage(OV.img, x0, y0, OV.w * S, OV.h * S);
  } else {
    ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
    const step = 256 * M.bounds.k * S;
    const [ox, oy] = tx(0, 0);
    for (let x = ox % step; x < cw; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ch); ctx.stroke(); }
    for (let y = oy % step; y < ch; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cw, y); ctx.stroke(); }
  }
  if (heatOn()) drawHeat();
  const upx = 1 / (unitsPerPx()) * S; // screen px per world unit

  // bomb
  if (r) {
    const bp = D.bomb.find((b) => b.type === 'plantpos' && b.t >= r.start && b.t <= T && b.t <= r.end);
    if (bp) {
      const [sx, sy] = toScreen(bp.pos[0], bp.pos[1]);
      const pulse = 0.5 + 0.5 * Math.sin((T - bp.t) * 6);
      ctx.fillStyle = `rgba(255,154,60,${0.25 + pulse * 0.35})`;
      ctx.beginPath(); ctx.arc(sx, sy, 10 + pulse * 4, 0, 7); ctx.fill();
      ctx.fillStyle = COL.kill; ctx.fillRect(sx - 5, sy - 4, 10, 8);
      ctx.fillStyle = '#111'; ctx.font = '600 7px ' + monoFont(); ctx.textAlign = 'center'; ctx.fillText('C4', sx, sy + 2.5);
    }
  }
  // the bomb on the floor, dropped or left by a dead carrier, until it's picked up (0.18.0, Sujan 14 Oct 2026).
  // The game's radar doesn't show it to spectators; this viewer does. Same tag as the planted bomb, no pulse.
  const C4D = D.c4drops || [];
  for (let i = 0; i < C4D.length; i += 5) {
    if (C4D[i] > T || C4D[i + 1] <= T) continue;
    const [sx, sy] = toScreen(C4D[i + 2], C4D[i + 3]);
    c4Tag(sx, sy, false);
  }

  // grenades
  if (opts.nades) for (const g of M.nades) {
    if (T < g.t0 || T > g.t1 + 1) continue;
    const p = g.pts;
    const col = g.type === 'he' ? '#ff9a3c' : g.type === 'flash' ? '#f2f0e6' : '#9fd88a';
    if (g.type === 'smoke' && T >= g.stop) {
      let cx, cy;
      if (g.cloud) [cx, cy] = toScreen(g.cloud[0], g.cloud[1]);
      else {
        let k = -1; for (let i = 0; i < p.length; i += 4) if (p[i] >= g.stop) { k = i; break; }
        [cx, cy] = k >= 0 ? toScreen(p[k + 1], p[k + 2]) : toScreen(p[p.length - 3], p[p.length - 2]);
      }
      const age = T - g.stop, fade = Math.min(1, age / 1.5) * Math.min(1, (g.t1 - T) / 2 + 0.2);
      ctx.fillStyle = `rgba(150,206,132,${0.55 * Math.max(0, fade)})`;
      ctx.beginPath(); ctx.arc(cx, cy, 140 * upx, 0, 7); ctx.fill();
      continue;
    }
    if (T > g.t1) {
      if (g.type === 'smoke') continue;
      const [sx, sy] = toScreen(p[p.length - 3], p[p.length - 2]);
      const a = 1 - (T - g.t1);
      ctx.fillStyle = g.type === 'he' ? `rgba(255,154,60,${a * 0.6})` : `rgba(255,255,240,${a * 0.7})`;
      ctx.beginPath(); ctx.arc(sx, sy, (g.type === 'he' ? 180 : 110) * upx * (0.6 + 0.4 * (1 - a)), 0, 7); ctx.fill();
      continue;
    }
    ctx.strokeStyle = col; ctx.globalAlpha = 0.7; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
    ctx.beginPath();
    let hx = 0, hy = 0;
    for (let i = 0; i < p.length && p[i] <= T; i += 4) { const [sx, sy] = toScreen(p[i + 1], p[i + 2]); if (i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy); hx = sx; hy = sy; }
    ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(hx, hy, 3, 0, 7); ctx.fill();
  }

  // deaths this round, and kill lines
  if (r) for (const k of r.kills) {
    if (k.t > T || !k.vpos) continue;
    const [vx, vy] = toScreen(k.vpos[0], k.vpos[1]);
    const vs = k.vteam === 'TERRORIST' ? COL.t : COL.ct;
    const age = T - k.t;
    const life = k.wb ? 6 : 2.5;
    if (opts.lines && age < life && k.kpos && k.killer !== k.victim) {
      const [kx, ky] = toScreen(k.kpos[0], k.kpos[1]);
      ctx.strokeStyle = k.wb ? (k.wb.loose ? `rgba(201,163,232,${1 - age / life})` : `rgba(255,79,216,${1 - age / life})`) : `rgba(255,154,60,${1 - age / life})`; ctx.lineWidth = 2;
      if (k.wb) ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(vx, vy); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.strokeStyle = vs; ctx.globalAlpha = 0.75; ctx.lineWidth = 2;
    const s = 5;
    ctx.beginPath(); ctx.moveTo(vx - s, vy - s); ctx.lineTo(vx + s, vy + s); ctx.moveTo(vx + s, vy - s); ctx.lineTo(vx - s, vy + s); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // hit markers: a ring that bursts out from the victim when the kill lands
  for (const f of flashes) {
    const k = f.k; if (!k.vpos) continue;
    const a = (performance.now() - f.at) / FLASH_MS;
    const [vx, vy] = toScreen(k.vpos[0], k.vpos[1]);
    ctx.strokeStyle = k.wb ? (k.wb.loose ? COL.loose : COL.wb) : k.hs ? COL.kill : '#ffffff';
    ctx.globalAlpha = 1 - a; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(vx, vy, 8 + a * 26, 0, 7); ctx.stroke(); ctx.globalAlpha = 1;
  }

  // selected player trail
  if (selected && D.slots[selected]) {
    ctx.strokeStyle = COL.sand; ctx.lineWidth = 2; ctx.globalAlpha = 0.6; ctx.beginPath();
    let started = false;
    for (let t = Math.max(r ? r.start : T - 8, T - 8); t <= T; t += 0.1) {
      const s = playerState(selected, t); if (!s || s.state < 0) { started = false; continue; }
      const [sx, sy] = toScreen(s.x, s.y);
      if (!started) { ctx.moveTo(sx, sy); started = true; } else ctx.lineTo(sx, sy);
    }
    ctx.stroke(); ctx.globalAlpha = 1;
  }

  // players
  lastPlayers = [];
  const mono = monoFont();
  const rad = Math.max(5, Math.min(9, 6 * Math.sqrt(view.s)));
  for (const e in D.slots) {
    const s = playerState(+e, T);
    if (!s || s.state < 0) continue;
    const [sx, sy] = toScreen(s.x, s.y);
    const col = sideCol(s.state);
    // facing: world yaw 0 = +x. Convert via a second point.
    const a = s.yaw * Math.PI / 180;
    const [fx, fy] = toScreen(s.x + Math.cos(a) * 60, s.y + Math.sin(a) * 60);
    const ang = Math.atan2(fy - sy, fx - sx);
    ctx.fillStyle = col; ctx.globalAlpha = 0.28;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.arc(sx, sy, rad * 3.2, ang - 0.38, ang + 0.38); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.arc(sx, sy, rad, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 1.5; ctx.stroke();
    if (+e === selected) { ctx.strokeStyle = COL.sand; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx, sy, rad + 4, 0, 7); ctx.stroke(); }
    // the Terrorist carrying the bomb: a C4 tag on his dot (0.18.0; the 3D models and the Tab scoreboard have it since 0.17.0)
    if (s.state === 1 && packAt(+e, T)) c4Tag(sx - rad - 1, sy + rad - 1, true);
    lastPlayers.push({ e: +e, sx, sy });
    if (opts.names) {
      const nm = labelAt(+e, T);
      const w = weaponShort(s.weapon);
      ctx.font = `500 11px ${mono}`; ctx.textAlign = 'left';
      const label = nm.length > 16 ? nm.slice(0, 15) + '…' : nm;
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(8,10,12,.85)';
      ctx.strokeText(label, sx + rad + 4, sy - 1); ctx.fillStyle = '#eee8dc'; ctx.fillText(label, sx + rad + 4, sy - 1);
      const hpv = hpAt(+e, T);
      const sub = [hpv != null ? hpv + ' hp' : '', w].filter(Boolean).join(' · ');
      if (sub) { ctx.font = `400 10px ${mono}`; ctx.strokeText(sub, sx + rad + 4, sy + 10); ctx.fillStyle = col; ctx.fillText(sub, sx + rad + 4, sy + 10); }
    }
  }
}

// a small orange "C4" tag, as on the planted bomb; small: the one on a carrier's dot
function c4Tag(x, y, small) {
  const w = small ? 14 : 16, h = small ? 9 : 11;
  ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(x - w / 2 - 1, y - h / 2 - 1, w + 2, h + 2);
  ctx.fillStyle = COL.kill; ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.fillStyle = '#111'; ctx.font = `700 ${small ? 7 : 8}px ` + monoFont(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('C4', x, y + 0.5); ctx.textBaseline = 'alphabetic';
}

// ---------------- heatmap ----------------
let heat = null;
const heatOn = () => $('hmMode').value !== 'off';
['hmMode', 'hmSide', 'hmScope'].forEach((id) => $(id).onchange = () => { heat = null; });
// when a round is live: from the end of freeze time to the moment it's won
function playSpan(r) {
  const rts = (D.roundTimes || []).filter((x) => x.t >= r.start - 1 && x.t < r.end);
  const start = rts.length >= 2 ? rts[1].t : r.start; // first timer is freeze time, the second starts the round
  return [start, r.endT != null ? r.endT : r.end];
}
function pausedAt(t) { let on = false; for (const p of D.pauses || []) { if (p.t > t) break; on = p.on; } return on; }
function buildHeat() {
  const mode = $('hmMode').value, side = $('hmSide').value, sc = $('hmScope').value;
  const W = 256, H = 192; const iw = OV ? OV.w : 1024, ih = OV ? OV.h : 768;
  const grid = new Float32Array(W * H);
  const cr = roundAt(T);
  const rounds = sc === 'round' && cr ? [cr] : M.liveR;
  const add = (x, y, wgt) => {
    const [px, py] = w2i(x, y); const gx = px / iw * W, gy = py / ih * H;
    const R = 6;
    for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) {
      const X = Math.round(gx) + i, Y = Math.round(gy) + j; if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
      grid[Y * W + X] += wgt * Math.exp(-(i * i + j * j) / 10);
    }
  };
  const want = (teamName) => side === 'all' || (side === '1' ? teamName === 'TERRORIST' : teamName === 'CT');
  for (const r of rounds) {
    if (mode === 'deaths' || mode === 'kills') {
      for (const k of r.kills) {
        if (mode === 'deaths' && k.vpos && want(k.vteam) && (!selected || k.victim === selected)) add(k.vpos[0], k.vpos[1], 1);
        if (mode === 'kills' && k.kpos && k.killer !== k.victim && want(k.kteam) && (!selected || k.killer === selected)) add(k.kpos[0], k.kpos[1], 1);
      }
    } else {
      // only while the round is actually being played: not freeze time at the start, not the few
      // seconds after the round is decided, and not while the match is paused
      const [p0, p1] = playSpan(r);
      const S = D.stride; const i0 = M.idxAt(p0), i1 = M.idxAt(sc === 'round' ? Math.min(p1, T) : p1);
      for (const e in D.slots) {
        if (selected && +e !== selected) continue;
        const a = D.slots[e];
        for (let i = i0; i <= i1; i += 15) { const st = a[i * S + 5]; if (st <= 0 || isNaN(a[i * S])) continue; if (side !== 'all' && String(st) !== side) continue; if (pausedAt(D.times[i])) continue; add(a[i * S], a[i * S + 1], 0.2); }
      }
    }
  }
  let mx = 0; for (let i = 0; i < grid.length; i++) mx = Math.max(mx, grid[i]);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'); const id = x.createImageData(W, H);
  for (let i = 0; i < grid.length; i++) {
    const v = mx ? Math.pow(grid[i] / mx, 0.6) : 0; if (v < 0.04) continue;
    // ramp: deep blue -> amber -> red-white
    const r = v < 0.5 ? 40 + v * 2 * 190 : 230 + (v - 0.5) * 50;
    const g = v < 0.5 ? 60 + v * 2 * 110 : 170 - (v - 0.5) * 2 * 110;
    const b = v < 0.5 ? 160 - v * 2 * 120 : 40;
    id.data[i * 4] = r; id.data[i * 4 + 1] = g; id.data[i * 4 + 2] = b; id.data[i * 4 + 3] = Math.min(220, 60 + v * 200);
  }
  x.putImageData(id, 0, 0);
  heat = { c, key: mode + side + sc + (selected || '') + (sc === 'round' ? Math.floor(T) : '') };
}
function drawHeat() {
  const key = $('hmMode').value + $('hmSide').value + $('hmScope').value + (selected || '');
  if (!heat || !heat.key.startsWith(key) || ($('hmScope').value === 'round' && $('hmMode').value === 'presence' && heat.key !== key + Math.floor(T))) buildHeat();
  const iw = OV ? OV.w : 1024, ih = OV ? OV.h : 768;
  const [x0, y0] = tx(0, 0); const S = base.s * view.s;
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(heat.c, x0, y0, iw * S, ih * S);
}
