// ---------------- sound ----------------
// Plays the demo's sounds from the game's own .wav files: gunshots (from the weapon events), footsteps,
// reloads, hits, grenades, bomb beeps and the radio lines, placed around the listener like in-game:
// quieter with distance, panned left/right. The listener is the 3D camera, or in 2D the player you
// follow (or the middle of the radar).
const SND = { ctx: null, out: null, bufs: {}, loading: {}, on: ls.get('snd-on') !== false, vol: ls.get('snd-level') ?? 0.6, sentences: null, chans: {}, iSnd: 0, iShot: 0, iBoom: 0, iRad: 0 };
// weapon fire events -> the sounds the CS client plays for them
const FIRE = {
  ak47: ['ak47-1', 'ak47-2'], aug: ['aug-1'], awp: ['awp1'], deagle: ['deagle-1', 'deagle-2'], elite_left: ['elite_fire'], elite_right: ['elite_fire'],
  famas: ['famas-1', 'famas-2'], fiveseven: ['fiveseven-1'], g3sg1: ['g3sg1-1'], galil: ['galil-1', 'galil-2'], glock18: ['glock18-1', 'glock18-2'],
  m249: ['m249-1', 'm249-2'], m3: ['m3-1'], mac10: ['mac10-1'], mp5n: ['mp5-1', 'mp5-2'], p228: ['p228-1'], p90: ['p90-1'], scout: ['scout_fire-1'],
  sg550: ['sg550-1'], sg552: ['sg552-1', 'sg552-2'], tmp: ['tmp-1', 'tmp-2'], ump45: ['ump45-1'], xm1014: ['xm1014-1'],
  m4a1: { on: ['m4a1-1'], off: ['m4a1_unsil-1', 'm4a1_unsil-2'] }, usp: { on: ['usp1', 'usp2'], off: ['usp_unsil-1'] },
};
function fireSound(ev, silenced, k) {
  const f = FIRE[ev]; if (!f) return null;
  const list = Array.isArray(f) ? f : silenced ? f.on : f.off;
  return 'weapons/' + list[k % list.length] + '.wav';
}
// CS 1.6 weapon ids (as CurWeapon gives them) -> the fire event names FIRE uses
const WEAPON_EVENT = { 1: 'p228', 3: 'scout', 5: 'xm1014', 7: 'mac10', 8: 'aug', 10: 'elite_left', 11: 'fiveseven', 12: 'ump45', 13: 'sg550', 14: 'galil', 15: 'famas', 16: 'usp', 17: 'glock18', 18: 'awp', 19: 'mp5n', 20: 'm249', 21: 'm3', 22: 'm4a1', 23: 'tmp', 24: 'g3sg1', 26: 'deagle', 27: 'sg552', 28: 'ak47', 30: 'p90' };
const eventName = (idx) => ((D.events && D.events[idx]) || '').replace(/^events\//, '').replace(/\.sc$/, '');
const sndName = (idx) => (D.sounds && D.sounds[idx] ? D.sounds[idx].replace(/^\*/, '').replace(/\\/g, '/').toLowerCase() : '');

// every sound this demo can play, so they can be loaded before they're needed
function demoSoundList() {
  const need = new Set();
  const s = D.snds || [];
  for (let i = 0; i < s.length; i += 10) { const n = sndName(s[i + 1]); if (n) need.add(n); }
  const sh = D.shots || [];
  const seen = new Set();
  for (let i = 0; i < sh.length; i += 4) seen.add(eventName(sh[i + 2]));
  for (let i = 1; i < (D.ownAmmo || []).length; i += 3) seen.add(WEAPON_EVENT[D.ownAmmo[i]]); // POV: his own guns
  for (const ev of seen) { const f = FIRE[ev]; if (!f) continue; for (const x of Array.isArray(f) ? f : [...f.on, ...f.off]) need.add('weapons/' + x + '.wav'); }
  if (D.booms && D.booms.length) for (const x of ['explode3', 'explode4', 'explode5']) need.add('weapons/' + x + '.wav');
  if (SND.sentences) for (const r of D.radio || []) { const p = SND.sentences[r.s.toUpperCase()]; if (p) need.add(p); }
  return [...need];
}
async function loadSentences() {
  if (SND.sentences) return;
  let txt = null;
  if (files.sentences) { txt = await files.sentences.text(); idb.put('sentences', txt); }
  else txt = await idb.get('sentences');
  if (!txt) return;
  const out = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = /^\s*([A-Za-z0-9_]+)\s+(\S+)/.exec(line); if (!m || line.trim().startsWith('//')) continue;
    out[m[1].toUpperCase()] = m[2].replace(/\\/g, '/').toLowerCase() + '.wav';
  }
  SND.sentences = out;
}
let sndPreload = 0;
async function preloadSounds() {
  if (!D) return;
  const run = ++sndPreload;
  await loadSentences();
  if (!D || run !== sndPreload) return; // the demo was closed or another one opened meanwhile
  for (const n of demoSoundList()) { if (run !== sndPreload) return; await loadSound(n); }
}
// .wav files from GoldSrc: 8 or 16 bit PCM, mono or stereo; decoded by hand so every file works
function decodeWav(u8, ctx) {
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  if (dv.getUint32(0, false) !== 0x52494646) throw new Error('not a wav');
  let p = 12, fmt = null, data = null;
  while (p + 8 <= u8.length) {
    const id = String.fromCharCode(u8[p], u8[p + 1], u8[p + 2], u8[p + 3]), len = dv.getUint32(p + 4, true);
    if (id === 'fmt ') fmt = { tag: dv.getUint16(p + 8, true), ch: dv.getUint16(p + 10, true), rate: dv.getUint32(p + 12, true), bits: dv.getUint16(p + 22, true) };
    else if (id === 'data') data = { off: p + 8, len: Math.min(len, u8.length - p - 8) };
    p += 8 + len + (len & 1);
  }
  if (!fmt || !data || fmt.tag !== 1) throw new Error('unsupported wav');
  const bps = fmt.bits / 8, frames = Math.floor(data.len / (bps * fmt.ch));
  if (!frames) throw new Error('empty wav');
  const buf = ctx.createBuffer(fmt.ch, frames, fmt.rate);
  for (let c = 0; c < fmt.ch; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < frames; i++) {
      const o = data.off + (i * fmt.ch + c) * bps;
      d[i] = bps === 1 ? (u8[o] - 128) / 128 : dv.getInt16(o, true) / 32768;
    }
  }
  return buf;
}
// The slider is 0..1. Hearing is logarithmic, so the slider maps to decibels: the far left is
// silent (and shows as muted), the first step is barely audible, the far right is full volume.
const volGain = (v) => (v <= 0 ? 0 : Math.pow(10, (v - 1) * 2.5)); // 0.01 -> about -50 dB, 1 -> 0 dB
function audio() {
  if (!SND.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    SND.ctx = new AC();
    SND.out = SND.ctx.createGain(); SND.out.gain.value = volGain(SND.vol);
    // a limiter at the end, so a burst of shots and explosions never clips or blasts
    const lim = SND.ctx.createDynamicsCompressor();
    lim.threshold.value = -18; lim.knee.value = 6; lim.ratio.value = 12; lim.attack.value = 0.003; lim.release.value = 0.25;
    SND.out.connect(lim); lim.connect(SND.ctx.destination);
  }
  if (SND.ctx.state === 'suspended') SND.ctx.resume().catch(() => {});
  return SND.ctx;
}
function loadSound(name) {
  if (SND.bufs[name] !== undefined) return Promise.resolve(SND.bufs[name]);
  if (SND.loading[name]) return SND.loading[name];
  return SND.loading[name] = (async () => {
    let blob = files.snd[name] || null;
    let fromFolder = !!blob;
    try {
      const ctx = audio(); if (!ctx) return null;
      let u8 = blob ? await readPicked(blob, 'sound/' + name) : null;
      // not in the folder, or changed on disk since it was chosen: use this browser's saved copy if there is one
      if (!u8) { fromFolder = false; blob = await idb.get('snd:' + name); u8 = blob ? new Uint8Array(await blob.arrayBuffer()) : null; }
      if (!u8) { SND.bufs[name] = null; return null; }
      const b = decodeWav(u8, ctx);
      if (fromFolder) idb.put('snd:' + name, blob);
      return SND.bufs[name] = b;
    } catch (e) { return SND.bufs[name] = null; }
    finally { delete SND.loading[name]; }
  })();
}
function retryMissingSounds() { for (const k in SND.bufs) if (SND.bufs[k] === null) delete SND.bufs[k]; }

// where the listener is and which way is "right"
function listener() {
  if (viewMode !== '2d' && R3) {
    const c = R3.camera, d = new THREE.Vector3(); c.getWorldDirection(d);
    return { p: [c.position.x, -c.position.z, c.position.y], right: [-d.z, -d.x, 0], flat: false };
  }
  const s = selected && playerState(selected, T);
  if (s && s.state > 0) { const yr = s.yaw * Math.PI / 180; return { p: [s.x, s.y, s.z + 17], right: [Math.sin(yr), -Math.cos(yr), 0], flat: false }; }
  // middle of the radar, heard from above: only left/right placement, no height
  const A = w2i(0, 0), B = w2i(1, 0), C = w2i(0, 1);
  const S = base.s * view.s, cx = (cw / 2 - base.x * view.s - view.x) / S, cy = (ch / 2 - base.y * view.s - view.y) / S;
  const a = B[0] - A[0], b = C[0] - A[0], c = B[1] - A[1], d = C[1] - A[1], det = a * d - b * c || 1;
  const wx = (d * (cx - A[0]) - b * (cy - A[1])) / det, wy = (-c * (cx - A[0]) + a * (cy - A[1])) / det;
  const rx = d / det, ry = -c / det, rl = Math.hypot(rx, ry) || 1; // world direction of "screen right"
  return { p: [wx, wy, 0], right: [rx / rl, ry / rl, 0], flat: true };
}
function playSound(name, pos, vol, atten, pitch, key, L) {
  const buf = SND.bufs[name];
  if (buf === undefined) { loadSound(name); return; }
  if (!buf) return;
  const ctx = audio(); if (!ctx) return;
  let gain = vol, pan = 0;
  if (pos && !isNaN(pos[0])) {
    const dx = pos[0] - L.p[0], dy = pos[1] - L.p[1], dz = L.flat ? 0 : pos[2] - L.p[2];
    const dist = Math.hypot(dx, dy, dz);
    // GoldSrc: loudness falls off linearly, reaching silence at 1000 units / attenuation
    gain *= Math.max(0, 1 - dist * atten / 1000);
    if (dist > 1) pan = Math.max(-1, Math.min(1, (dx * L.right[0] + dy * L.right[1]) / dist)) * 0.8;
  }
  if (gain < 0.01) return;
  const src = ctx.createBufferSource(); src.buffer = buf;
  src.playbackRate.value = (pitch || 100) / 100;
  const g = ctx.createGain(); g.gain.value = Math.min(1, gain);
  let node = g;
  if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; g.connect(p); node = p; }
  node.connect(SND.out);
  src.connect(g);
  // a new sound on the same entity channel cuts the previous one, as in the game (rapid fire, reloads)
  if (key) { const old = SND.chans[key]; if (old) try { old.stop(); } catch (e) { } SND.chans[key] = src; src.onended = () => { if (SND.chans[key] === src) delete SND.chans[key]; }; }
  src.start();
}
// first index in a flat, time-sorted array (stride n) with time > t
function firstAfter(arr, n, t) { let lo = 0, hi = arr.length / n; while (lo < hi) { const m = (lo + hi) >> 1; if (arr[m * n] > t) hi = m; else lo = m + 1; } return lo; }
function entPos(e, t) { if (e >= 1 && e <= 64) { const s = playerState(e, t); if (s) return [s.x, s.y, s.z]; } return null; }
// play everything that happened between the last frame and now
function soundTick(t0, t1) {
  if (!SND.on || !D || !D.snds || t1 <= t0 || t1 - t0 > 0.5 * Math.max(1, speed)) return;
  const L = listener();
  const fast = speed >= 4; // at high speed, keep it to shots, explosions and the radio
  const s = D.snds;
  for (let i = firstAfter(s, 10, t0); i * 10 < s.length && s[i * 10] <= t1; i++) {
    const o = i * 10, name = sndName(s[o + 1]); if (!name) continue;
    if (fast && /pl_step|pl_dirt|pl_duct|pl_metal|pl_tile|pl_grate|pl_snow|pl_slosh|pl_wade|pl_ladder/.test(name)) continue;
    const e = s[o + 2];
    const pos = !isNaN(s[o + 7]) ? [s[o + 7], s[o + 8], s[o + 9]] : entPos(e, s[o]);
    playSound(name, pos, s[o + 3], s[o + 4], s[o + 5], s[o + 6] ? e + ':' + s[o + 6] : null, L);
  }
  const sh = D.shots || [], so = D.shotOrg;
  for (let i = firstAfter(sh, 4, t0); i * 4 < sh.length && sh[i * 4] <= t1; i++) {
    const o = i * 4, name = fireSound(eventName(sh[o + 2]), sh[o + 3], i); if (!name) continue;
    // where it was fired: the message's own position when it has one (the shooter wasn't in the snapshot,
    // most shots in a POV demo), else the shooter's. With neither, it isn't played: before, it played at full
    // volume as if next to you (Sujan, 3 Oct 2026)
    const org = so && !isNaN(so[i * 3]) ? [so[i * 3], so[i * 3 + 1], so[i * 3 + 2]] : entPos(sh[o + 1], sh[o]);
    if (!org && D.pov) continue;
    playSound(name, org, 1, 0.64, 94 + (i * 7) % 16, sh[o + 1] + ':w', L);
  }
  // POV mode: the recorder's own shots. The server never sends a player his own fire (his game plays it
  // itself), so they come from his gun's round count going down (CurWeapon), and play at the listener.
  const os = D.ownShots; // see povShots
  if (os && os.length) for (let i = firstAfter(os, 3, t0); i * 3 < os.length && os[i * 3] <= t1; i++) {
    const o = i * 3, name = fireSound(WEAPON_EVENT[os[o + 1]], os[o + 2], i); if (!name) continue;
    playSound(name, null, 1, 0, 94 + (i * 7) % 16, 'own:w', L);
  }
  const b = D.booms || [];
  for (let i = firstAfter(b, 4, t0); i * 4 < b.length && b[i * 4] <= t1; i++) {
    const o = i * 4; playSound('weapons/explode' + (3 + i % 3) + '.wav', [b[o + 1], b[o + 2], b[o + 3]], 1, 0.3, 100, null, L);
  }
  if (SND.sentences) for (const r of D.radio || []) if (r.t > t0 && r.t <= t1) { const p = SND.sentences[r.s.toUpperCase()]; if (p) playSound(p, null, 0.8, 0, 100, 'radio', L); }
}
function stopSounds() { for (const k in SND.chans) try { SND.chans[k].stop(); } catch (e) { } SND.chans = {}; }
function setVolume(v) {
  if (v <= 0) { setSound(false); return; } // the far left of the slider is mute
  SND.vol = v; ls.set('snd-level', v);
  if (SND.out) SND.out.gain.value = volGain(v);
  if (!SND.on) setSound(true); else showVolume();
}
function showVolume() {
  const el = $('sndVol'); el.value = SND.on ? SND.vol : 0;
  el.title = SND.on ? `Volume ${Math.round(SND.vol * 100)}%` : 'Muted';
}
function setSound(on) {
  SND.on = on; ls.set('snd-on', on);
  showVolume();
  $('bSnd').classList.toggle('on', on); $('bSnd').setAttribute('aria-pressed', on);
  $('sndIcon').innerHTML = on ? '<path d="M2 6h3l4-3v10l-4-3H2z"/><path d="M11 5.5c1 .8 1 4.2 0 5M12.6 4c2 1.6 2 6.4 0 8" fill="none" stroke="currentColor" stroke-width="1.3"/>' : '<path d="M2 6h3l4-3v10l-4-3H2z"/><path d="M11 6l4 4M15 6l-4 4" fill="none" stroke="currentColor" stroke-width="1.3"/>';
  if (on) audio(); else stopSounds();
}
