// Reads a .dem ArrayBuffer and returns a compact match timeline:
// players, sampled positions, kills, rounds, bomb events.
// Message layouts adapted from hlviewer.js (MIT, Stefan Stojkovic).

const DT_BYTE = 1, DT_SHORT = 2, DT_FLOAT = 4, DT_INTEGER = 8, DT_ANGLE = 16,
  DT_TIMEWINDOW_8 = 32, DT_TIMEWINDOW_BIG = 64, DT_STRING = 128, DT_SIGNED = 0x80000000;

class Reader {
  constructor(u8) {
    this.u8 = u8;
    this.dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    this.p = 0; // byte position
    this.b = 0; // bit position (for bit reads)
  }
  ub() { return this.u8[this.p++]; }
  b8() { const v = this.dv.getInt8(this.p); this.p += 1; return v; }
  s() { const v = this.dv.getInt16(this.p, true); this.p += 2; return v; }
  us() { const v = this.dv.getUint16(this.p, true); this.p += 2; return v; }
  i() { const v = this.dv.getInt32(this.p, true); this.p += 4; return v; }
  ui() { const v = this.dv.getUint32(this.p, true); this.p += 4; return v; }
  f() { const v = this.dv.getFloat32(this.p, true); this.p += 4; return v; }
  skip(n) { this.p += n; }
  str() {
    let s = '';
    for (;;) {
      if (this.p >= this.u8.length) throw new Error('string overrun');
      const c = this.u8[this.p++];
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    return s;
  }
  nstr(n) {
    let s = '';
    for (let k = 0; k < n; k++) {
      const c = this.u8[this.p + k];
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    this.p += n;
    return s;
  }
  // bit reading, LSB first
  bitsStart() { this.b = this.p * 8; }
  bitsEnd() { this.p = (this.b + 7) >> 3; }
  bits(n) {
    let v = 0, got = 0, b = this.b;
    const u8 = this.u8;
    while (got < n) {
      const byte = u8[b >> 3];
      if (byte === undefined) throw new Error('bit overrun');
      const off = b & 7;
      const take = Math.min(n - got, 8 - off);
      v += ((byte >> off) & ((1 << take) - 1)) * Math.pow(2, got);
      got += take; b += take;
    }
    this.b = b;
    return v;
  }
  peekBits(n) { const b = this.b; const v = this.bits(n); this.b = b; return v; }
  bitStr() {
    let s = '';
    for (;;) { const c = this.bits(8); if (!c) break; s += String.fromCharCode(c); }
    return s;
  }
  coord() {
    const intf = this.bits(1), frac = this.bits(1);
    if (!intf && !frac) return 0;
    const sign = this.bits(1);
    let i = 0, f = 0;
    if (intf) i = this.bits(12);
    if (frac) f = this.bits(3);
    const v = i + f / 32;
    return sign ? -v : v;
  }
}

// Decode a delta-compressed struct into `out` (fields not sent keep old values).
function readDelta(r, fields, out) {
  const nbytes = r.bits(3);
  const mask = [];
  for (let k = 0; k < nbytes; k++) mask.push(r.bits(8));
  for (let k = 0; k < nbytes; k++) {
    for (let j = 0; j < 8; j++) {
      const idx = k * 8 + j;
      if (idx >= fields.length) return out;
      if (!(mask[k] & (1 << j))) continue;
      const fd = fields[idx];
      const fl = fd.flags;
      if (fl & DT_STRING) { out[fd.name] = r.bitStr(); continue; }
      if (fl & DT_ANGLE) { out[fd.name] = r.bits(fd.bits) * (360 / Math.pow(2, fd.bits)); continue; }
      if (fl & (DT_BYTE | DT_SHORT | DT_INTEGER | DT_FLOAT | DT_TIMEWINDOW_8 | DT_TIMEWINDOW_BIG)) {
        if (fl & DT_SIGNED) {
          const neg = r.bits(1);
          const v = r.bits(fd.bits - 1) / fd.divisor;
          out[fd.name] = neg ? -v : v;
        } else {
          out[fd.name] = r.bits(fd.bits) / fd.divisor;
        }
      }
    }
  }
  return out;
}

const DELTA_DESC = [
  { name: 'flags', bits: 32, divisor: 1, flags: DT_INTEGER },
  { name: 'name', bits: 8, divisor: 1, flags: DT_STRING },
  { name: 'offset', bits: 16, divisor: 1, flags: DT_INTEGER },
  { name: 'size', bits: 8, divisor: 1, flags: DT_INTEGER },
  { name: 'bits', bits: 8, divisor: 1, flags: DT_INTEGER },
  { name: 'divisor', bits: 32, divisor: 4000, flags: DT_FLOAT },
  { name: 'preMultiplier', bits: 32, divisor: 4000, flags: DT_FLOAT },
];

const TE_SIZES = {
  0: 24, 1: 20, 2: 6, 3: 11, 4: 6, 5: 10, 6: 12, 7: 17, 8: 16, 9: 6, 10: 6, 11: 6, 12: 8,
  14: 9, 15: 19, 17: 10, 18: 16, 19: 24, 20: 24, 21: 24, 22: 10, 23: 11, 24: 16, 25: 19,
  27: 12, 28: 16, 30: 17, 31: 17, 99: 2, 100: 10, 101: 14, 102: 12, 103: 14, 104: 9,
  105: 5, 106: 17, 107: 13, 108: 24, 109: 9, 110: 17, 111: 7, 112: 10, 113: 19, 114: 19,
  115: 12, 116: 7, 117: 7, 118: 9, 119: 16, 120: 18, 121: 5, 122: 10, 123: 9, 124: 7,
  125: 1, 126: 18, 127: 15,
};

const SAMPLE_HZ = 30;
const STRIDE = 11; // x, y, z, yaw, pitch, state, weaponModel, ducked, playerModel (index into pmodels), sequence, gaitsequence

globalThis.UM = {}; globalThis.CH = []; globalThis.WATCH = ['iuser4','spectator','body','skin','rendermode','renderamt','renderfx','effects','framerate','scale','colormap','friction','gravity','aiment','controller[0]','controller[1]','controller[2]','controller[3]','blending[0]','blending[1]','basevelocity[0]','fuser1','iuser1','iuser2','iuser3','fov']; globalThis.UMX = {}; globalThis.DF = {};
export function parseDemo(buffer, onProgress) {
  const u8 = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  const r = new Reader(u8);
  if (r.nstr(8) !== 'HLDEMO') throw new Error('Not a Half-Life demo file');
  const header = {
    demoProtocol: r.i(), netProtocol: r.i(), mapName: r.nstr(260), gameDir: r.nstr(260),
    mapCrc: r.i() >>> 0, dirOffset: r.ui(),
  };
  r.p = header.dirOffset;
  const dirCount = r.ui();
  const dirs = [];
  for (let k = 0; k < dirCount; k++) {
    dirs.push({ id: r.ui(), name: r.nstr(64), flags: r.ui(), cdTrack: r.i(), time: r.f(), frames: r.ui(), offset: r.ui(), length: r.ui() });
  }

  // ---- state ----
  const deltas = { delta_description_t: DELTA_DESC };
  const userMsgs = {}; // id -> {name,size}
  let maxClients = 32;
  let serverInfo = null;
  const resources = { models: {}, sounds: {}, events: {} };
  const baseline = [];
  const instBaseline = [];
  let ents = [];
  const players = {}; // entity index (1..32) -> {name, team, isHltv, userId}
  const kills = [], rounds = [], bomb = [], chat = [], roundTimes = [], hp = [], pauses = [];
  // who is in each slot over time (slots get reused when people leave and others join)
  const occupants = [], curOcc = {};
  const brushVis = {}, brushEvents = []; // breakable brush models (vents, glass, logs) shown or hidden
  const brushPoseNow = {}, brushPose = []; // brush models' position and turn over time: time, model, x, y, z, pitch, yaw, roll
  const hltvStatus = [];
  // server text (admin plugins announce warmups, "Live !" and scores this way): { t, s }
  const notes = [];
  // sounds heard in the demo: server sounds, weapon fire events, explosions, radio lines and corpses
  const snds = [];      // time, sound resource index, entity, volume, attenuation, pitch, channel, x, y, z (NaN when not sent)
  const shots = [];     // time, entity, event resource index, bparam1
  const radio = [];     // { t, s: sentence name }
  const corpses = [];   // { t, start, model, pos, yaw, seq, team, e }
  const booms = [];     // time, x, y, z (grenade and C4 explosions)
  let pendingEv = [];
  let scores = { T: 0, CT: 0 };
  let curRound = null;
  let time = 0;
  let inPlayback = false;
  let dead = new Set();
  let errors = 0, errSamples = [];
  const nadeEnts = {}; // ent index -> {type, pts:[]}
  const nades = [];

  // position samples
  const samples = { t: [], slots: {} }; // slots[ent] = number[] of x,y,z,yaw,pitch,alive
  let lastSampleT = -1;

  function slotArr(e) {
    if (!samples.slots[e]) {
      const a = [];
      for (let k = 0; k < samples.t.length; k++) a.push(NaN, NaN, NaN, 0, 0, 0, 0, 0, 0, 0, 0);
      samples.slots[e] = a;
    }
    return samples.slots[e];
  }

  // state: 0 = not playing, 1 = T alive, 2 = CT alive, -1 = T dead, -2 = CT dead
  function takeSample() {
    if (time - lastSampleT < 1 / SAMPLE_HZ) return;
    lastSampleT = time;
    samples.t.push(time);
    for (let e = 1; e <= maxClients; e++) {
      const st = ents[e];
      const p = players[e];
      const side = p ? (p.team === 'TERRORIST' ? 1 : p.team === 'CT' ? 2 : 0) : 0;
      if (!side) {
        if (samples.slots[e]) samples.slots[e].push(NaN, NaN, NaN, 0, 0, 0, 0, 0, 0, 0, 0);
        continue;
      }
      const a = slotArr(e);
      const state = dead.has(e) ? -side : side;
      if (st) a.push(st['origin[0]'] || 0, st['origin[1]'] || 0, st['origin[2]'] || 0, st['angles[1]'] || 0, st['angles[0]'] || 0, state, st.weaponmodel || 0, st.usehull || 0, pmIndex(p, st), st.sequence || 0, st.gaitsequence || 0);
      else a.push(NaN, NaN, NaN, 0, 0, state, 0, 0, 0, 0, 0);
    }
    for (const k in nadeEnts) {
      const st = ents[k];
      if (st) nadeEnts[k].pts.push(time, st['origin[0]'], st['origin[1]'], st['origin[2]']);
    }
    // breakables: visible while the entity exists and isn't flagged "no draw"
    const now = {};
    for (let k = maxClients + 1; k < ents.length; k++) {
      const st = ents[k]; if (!st) continue;
      const m = resources.models[st.modelindex];
      if (!m || m[0] !== '*') continue;
      now[m] = (now[m] || 0) | ((st.effects || 0) & 128 ? 0 : 1);
      // doors and other movers: where the brush is and how it's turned (a door can be open either way)
      const pz = [st['origin[0]'] || 0, st['origin[1]'] || 0, st['origin[2]'] || 0, st['angles[0]'] || 0, st['angles[1]'] || 0, st['angles[2]'] || 0];
      const last = brushPoseNow[m];
      if (!last || pz.some((v, i) => Math.abs(v - last[i]) > 0.05)) { brushPoseNow[m] = pz; brushPose.push(time, +m.slice(1), ...pz); }
    }
    for (const m in now) if (brushVis[m] !== now[m]) { brushVis[m] = now[m]; brushEvents.push(time, +m.slice(1), now[m]); }
    for (const m in brushVis) if (!(m in now) && brushVis[m]) { brushVis[m] = 0; brushEvents.push(time, +m.slice(1), 0); }
  }

  // player models seen in the demo, by the name each player's info gives (falls back to the entity's model)
  const pmodels = [], pmSeen = {};
  function pmIndex(p, st) {
    const name = p && p.model ? `models/player/${p.model}/${p.model}.mdl` : (resources.models[st.modelindex] || '');
    if (!(name in pmSeen)) { pmSeen[name] = pmodels.length; pmodels.push(name); }
    return pmSeen[name];
  }

  function isProxy() {
    if (!serverInfo) return false;
    const p = players[serverInfo.playerIndex + 1];
    return !!(p && p.isHltv);
  }

  function entType(num, custom) {
    if (custom) return 'custom_entity_state_t';
    if (num > 0 && num <= maxClients) return 'entity_state_player_t';
    return 'entity_state_t';
  }

  function modelName(idx) { return resources.models[idx] || ''; }

  function trackNade(num) {
    const st = ents[num];
    if (!st) return;
    const m = modelName(st.modelindex);
    let type = null;
    if (m.includes('w_hegrenade')) type = 'he';
    else if (m.includes('w_flashbang')) type = 'flash';
    else if (m.includes('w_smokegrenade')) type = 'smoke';
    if (!type) { if (nadeEnts[num]) finishNade(num); return; }
    if (!nadeEnts[num] || nadeEnts[num].type !== type) {
      if (nadeEnts[num]) finishNade(num);
      nadeEnts[num] = { type, owner: st.owner || 0, pts: [time, st['origin[0]'], st['origin[1]'], st['origin[2]']] };
    }
  }
  function finishNade(num) {
    const n = nadeEnts[num];
    delete nadeEnts[num];
    if (n && n.pts.length >= 8 && inPlayback) nades.push(n);
  }

  function startRound() {
    if (curRound && curRound.end == null) curRound.end = time;
    for (const k in nadeEnts) finishNade(k);
    curRound = { n: rounds.length + 1, start: time, end: null, winner: null, reason: null, scoreT: scores.T, scoreCT: scores.CT };
    rounds.push(curRound);
    dead = new Set();
  }

  function onUserMsg(name, d) {
    (globalThis.UM[name] = globalThis.UM[name] || { n: 0, sizes: {} }).n++; const um = globalThis.UM[name]; um.sizes[d.length] = (um.sizes[d.length]||0)+1; if (name === 'SetFOV' || name === 'CurWeapon' || name === 'ScopeOn' || name === 'Crosshair') { (globalThis.UMX[name] = globalThis.UMX[name] || []).length < 12 && globalThis.UMX[name].push([+time.toFixed(2), ...d]); }
    const m = new Reader(d);
    try {
      switch (name) {
        case 'DeathMsg': {
          const killer = m.ub(), victim = m.ub(), hs = m.ub(), weapon = m.str();
          dead.add(victim);
          const kp = ents[killer], vp = ents[victim];
          if (inPlayback) kills.push({
            t: time, killer, victim, hs: !!hs, weapon,
            kocc: curOcc[killer] ? curOcc[killer].id : -1, vocc: curOcc[victim] ? curOcc[victim].id : -1,
            round: curRound ? curRound.n : 0,
            kpos: kp ? [kp['origin[0]'], kp['origin[1]'], kp['origin[2]']] : null,
            vpos: vp ? [vp['origin[0]'], vp['origin[1]'], vp['origin[2]']] : null,
            kteam: players[killer] ? players[killer].team : null,
            vteam: players[victim] ? players[victim].team : null,
            kduck: kp ? kp.usehull || 0 : 0, vduck: vp ? vp.usehull || 0 : 0,
            kang: kp ? [kp['angles[0]'] || 0, kp['angles[1]'] || 0] : null,
          });
          break;
        }
        case 'TeamInfo': {
          const id = m.ub(), team = m.str();
          if (!players[id]) players[id] = { name: '?', team };
          players[id].team = team;
          if (team === 'TERRORIST' || team === 'CT') players[id].lastTeam = team;
          break;
        }
        case 'TeamScore': {
          const team = m.str(), score = m.s();
          if (team === 'TERRORIST') scores.T = score; else if (team === 'CT') scores.CT = score;
          break;
        }
        case 'HLTV': {
          const a = m.ub(), b = m.ub();
          if (a === 0 && b === 0 && inPlayback) startRound();
          // health updates for spectators: value is health with flag bit 128 set
          else if (b & 128 && inPlayback) hp.push(time, a, b & 127);
          break;
        }
        case 'TextMsg': {
          m.ub();
          const msg = m.str();
          const ends = {
            '#Terrorists_Win': ['T', 'elimination'], '#CTs_Win': ['CT', 'elimination'],
            '#Target_Bombed': ['T', 'bomb exploded'], '#Bomb_Defused': ['CT', 'bomb defused'],
            '#Target_Saved': ['CT', 'time ran out'], '#Round_Draw': [null, 'draw'],
            '#Hostages_Not_Rescued': ['T', 'time ran out'], '#VIP_Not_Escaped': ['T', 'time ran out'],
          };
          if (ends[msg] && curRound && curRound.winner == null && inPlayback) {
            curRound.winner = ends[msg][0];
            curRound.reason = ends[msg][1];
            curRound.endT = time;
          }
          if (msg === '#Bomb_Planted' && inPlayback) bomb.push({ t: time, type: 'planted', round: curRound ? curRound.n : 0 });
          if (msg === '#Game_will_restart_in' && inPlayback) bomb.push({ t: time, type: 'restart' });
          if (msg && msg[0] !== '#' && inPlayback) notes.push({ t: time, s: msg });
          break;
        }
        case 'RoundTime': {
          if (inPlayback) roundTimes.push({ t: time, secs: m.s() });
          break;
        }
        case 'SendAudio': {
          m.ub(); const s = m.str();
          if (inPlayback && s) radio.push({ t: time, s: s.replace(/^%!/, '') });
          break;
        }
        case 'ClCorpse': {
          const model = m.str();
          const pos = [m.i() / 128, m.i() / 128, m.i() / 128];
          m.s(); const yaw = m.s() / 8; m.s();
          const delay = m.i() / 100, seq = m.ub(); m.ub(); const team = m.ub(), e = m.ub();
          if (inPlayback) corpses.push({ t: time, start: time + delay, model, pos, yaw, seq, team, e });
          break;
        }
        case 'BombDrop': {
          const x = m.s() / 8, y = m.s() / 8, z = m.s() / 8, flag = m.ub();
          if (inPlayback && flag === 1) bomb.push({ t: time, type: 'plantpos', pos: [x, y, z], round: curRound ? curRound.n : 0 });
          break;
        }
        case 'SayText': {
          const id = m.ub();
          const a = m.str();
          let b = '', c = '';
          try { b = m.str(); c = m.str(); } catch (e) { /* optional */ }
          if (inPlayback) chat.push({ t: time, id, fmt: a, text: c || b });
          if (inPlayback && !id) notes.push({ t: time, s: [a, b, c].filter((x) => x && x[0] !== '#').join(' ') });
          break;
        }
      }
    } catch (e) { /* malformed user message, ignore */ }
  }

  function parseMessages(end) {
    while (r.p < end) {
      const type = r.ub();
      if (type >= 64) {
        const um = userMsgs[type];
        let len;
        if (um && um.size > -1) len = um.size; else len = r.ub();
        const d = u8.subarray(r.p, r.p + len);
        r.p += len;
        if (um) onUserMsg(um.name, d);
        continue;
      }
      switch (type) {
        case 0: throw new Error('svc_bad');
        case 1: break; // nop
        case 2: r.str(); break; // disconnect
        case 3: { // event
          r.bitsStart();
          const n = r.bits(5);
          for (let k = 0; k < n; k++) {
            const ei = r.bits(10);
            let pk = -1, ev = null;
            if (r.bits(1)) { pk = r.bits(11); if (r.bits(1)) ev = readDelta(r, deltas.event_t, {}); }
            if (inPlayback) pendingEv.push(ei, pk, ev);
            if (r.bits(1)) r.bits(16);
          }
          r.bitsEnd();
          break;
        }
        case 4: r.ui(); break; // version
        case 5: r.s(); break; // setview
        case 6: { // sound
          r.bitsStart();
          const fl = r.bits(9);
          const sndVol = fl & 1 ? r.bits(8) / 255 : 1;
          const sndAtt = fl & 2 ? r.bits(8) / 64 : 0.8;
          const sch = r.bits(3), se = r.bits(11);
          const si = fl & 4 ? r.bits(16) : r.bits(8);
          const hx = r.bits(1), hy = r.bits(1), hz = r.bits(1);
          const sx = hx ? r.coord() : 0, sy = hy ? r.coord() : 0, sz = hz ? r.coord() : 0;
          const pitch = fl & 8 ? r.bits(8) : 100;
          if (inPlayback && !(fl & (16 | 32))) snds.push(time, si, se, sndVol, sndAtt, pitch, sch, (hx || hy || hz) ? sx : NaN, sy, sz);
          r.bitsEnd();
          break;
        }
        case 7: r.f(); break; // time
        case 8: { const s = r.str(); if (inPlayback && s) notes.push({ t: time, s }); break; } // print
        case 9: r.str(); break; // stufftext
        case 10: r.skip(6); break; // setangle
        case 11: { // serverinfo
          const si = { protocol: r.i(), spawnCount: r.i(), mapCrc: r.i() };
          r.skip(16);
          si.maxPlayers = r.ub(); si.playerIndex = r.ub(); si.deathmatch = r.ub();
          si.gameDir = r.str(); si.hostName = r.str(); si.mapFile = r.str(); si.mapCycle = r.str();
          r.skip(1);
          serverInfo = si;
          maxClients = si.maxPlayers || 32;
          break;
        }
        case 12: r.ub(); r.str(); break; // lightstyle
        case 13: { // updateuserinfo
          const slot = r.ub(), uid = r.ui(), info = r.str();
          r.skip(16);
          const kv = {};
          const parts = info.split('\\');
          for (let k = 1; k + 1 < parts.length; k += 2) kv[parts[k]] = parts[k + 1];
          const e = slot + 1;
          if (!players[e]) players[e] = { team: null };
          if (kv.name !== undefined) players[e].name = kv.name;
          players[e].isHltv = kv['*hltv'] !== undefined;
          players[e].userId = uid;
          if (kv['*sid']) players[e].sid = kv['*sid'];
          // the game draws each player with the model named in their info (not the entity's model index)
          if (kv.model) players[e].model = kv.model.toLowerCase().replace(/[^a-z0-9_\-]/g, '');
          if (!info) players[e].left = true;
          // occupant bookkeeping
          const cur = curOcc[e];
          if (!info) { if (cur) { cur.to = time; delete curOcc[e]; } }
          else if (!cur || cur.uid !== uid) {
            if (cur) cur.to = time;
            const o = { id: occupants.length, slot: e, uid, names: [], from: time, to: null, hltv: kv['*hltv'] !== undefined };
            occupants.push(o); curOcc[e] = o;
          }
          if (info && kv.name && curOcc[e] && !curOcc[e].names.includes(kv.name)) curOcc[e].names.push(kv.name);
          break;
        }
        case 14: { // deltadescription
          const name = r.str();
          const n = r.us();
          r.bitsStart();
          const fields = [];
          for (let k = 0; k < n; k++) fields.push(readDelta(r, DELTA_DESC, {}));
          r.bitsEnd();
          deltas[name] = fields; globalThis.DF[name] = fields.map((f) => f.name + ':' + f.bits);
          break;
        }
        case 15: { // clientdata (empty for HLTV proxy recordings)
          if (isProxy()) break;
          r.bitsStart();
          if (r.bits(1)) r.bits(8);
          readDelta(r, deltas.clientdata_t, {});
          while (r.bits(1)) { r.bits(6); readDelta(r, deltas.weapon_data_t, {}); }
          r.bitsEnd();
          break;
        }
        case 16: r.s(); break; // stopsound
        case 17: { // pings
          r.bitsStart();
          while (r.bits(1)) { r.bits(8); r.bits(8); r.bits(8); }
          r.bitsEnd();
          break;
        }
        case 18: r.skip(11); break; // particle
        case 19: break; // damage
        case 20: { // spawnstatic
          r.skip(2 + 1 + 1 + 2 + 1 + 9);
          const rm = r.b8();
          if (rm) r.skip(1 + 3 + 1);
          break;
        }
        case 21: { // event reliable
          r.bitsStart();
          const ei = r.bits(10);
          const ev = readDelta(r, deltas.event_t, {});
          if (r.bits(1)) r.bits(16);
          if (inPlayback) pendingEv.push(ei, -1, ev);
          r.bitsEnd();
          break;
        }
        case 22: { // spawnbaseline
          r.bitsStart();
          for (;;) {
            const num = r.bits(11);
            if (num === 2047) break;
            const t = r.bits(2);
            const st = { };
            readDelta(r, deltas[t & 1 ? entType(num, false) : 'custom_entity_state_t'], st);
            baseline[num] = st;
          }
          const foot = r.bits(5);
          if (foot !== 31) throw new Error('bad spawnbaseline footer');
          const ni = r.bits(6);
          for (let k = 0; k < ni; k++) instBaseline[k] = readDelta(r, deltas.entity_state_t, {});
          r.bitsEnd();
          break;
        }
        case 23: { // temp entity
          const t = r.ub();
          if (t === 3) { // explosion: plays its own sound unless flagged silent
            const x = r.s() / 8, y = r.s() / 8, z = r.s() / 8; r.skip(4); const fl = r.ub();
            if (inPlayback && !(fl & 4)) booms.push(time, x, y, z);
          }
          else if (t === 13) { r.skip(8); if (r.s()) r.skip(2); }
          else if (t === 29) {
            r.skip(5);
            const effect = r.ub();
            r.skip(8 + 6);
            if (effect === 2) r.skip(2);
            r.str();
          }
          else if (TE_SIZES[t] !== undefined) r.skip(TE_SIZES[t]);
          else throw new Error('unknown temp entity ' + t);
          break;
        }
        case 24: { const on = r.ub(); if (inPlayback) pauses.push({ t: time, on: !!on }); break; } // setpause
        case 25: r.ub(); break; // signonnum
        case 26: { const s = r.str(); if (inPlayback && s) notes.push({ t: time, s }); break; } // centerprint
        case 27: case 28: case 30: case 42: break;
        case 29: r.skip(14); break; // spawnstaticsound
        case 31: case 34: r.str(); break; // finale, cutscene
        case 32: r.skip(2); break; // cdtrack
        case 33: { r.str(); const n = r.ub(); for (let k = 0; k < n; k++) r.str(); break; }
        case 35: r.skip(2); break; // weaponanim
        case 36: r.ub(); r.str(); break; // decalname
        case 37: r.us(); break; // roomtype
        case 38: r.s(); break; // addangle
        case 39: { // newusermsg
          const idx = r.ub(), size = r.b8(), name = r.nstr(16);
          userMsgs[idx] = { name, size };
          break;
        }
        case 40: { // packetentities (full)
          r.bitsStart();
          r.bits(16);
          const next = [];
          let num = 0;
          for (;;) {
            if (r.peekBits(16) === 0) { r.bits(16); break; }
            if (r.bits(1)) num++;
            else if (r.bits(1)) num = r.bits(11);
            else num += r.bits(6);
            const custom = r.bits(1);
            let base = baseline[num];
            if (r.bits(1)) base = instBaseline[r.bits(6)];
            const st = Object.assign({}, base || {});
            readDelta(r, deltas[entType(num, custom)], st);
            next[num] = st;
          }
          r.bitsEnd();
          ents = next;
          for (let k = maxClients + 1; k < ents.length; k++) if (ents[k]) trackNade(k);
          for (const k in nadeEnts) if (!ents[k]) finishNade(k);
          break;
        }
        case 41: { // deltapacketentities
          r.bitsStart();
          r.bits(16);
          r.bits(8);
          let num = 0;
          for (;;) {
            if (r.peekBits(16) === 0) { r.bits(16); break; }
            const remove = r.bits(1);
            if (r.bits(1)) num = r.bits(11); else num += r.bits(6);
            if (remove) { ents[num] = undefined; if (nadeEnts[num]) finishNade(num); continue; }
            const custom = r.bits(1);
            let st = ents[num];
            if (!st) { st = Object.assign({}, baseline[num] || {}); ents[num] = st; }
            const before = num <= maxClients ? Object.assign({}, st) : null;
            readDelta(r, deltas[entType(num, custom)], st);
            if (before && inPlayback) for (const f of globalThis.WATCH) if (st[f] !== before[f]) globalThis.CH.push([time, num, f, before[f], st[f]]);
            if (num > maxClients) trackNade(num);
          }
          r.bitsEnd();
          break;
        }
        case 43: { // resourcelist
          r.bitsStart();
          const n = r.bits(12);
          for (let k = 0; k < n; k++) {
            const t = r.bits(4), name = r.bitStr(), idx = r.bits(12);
            r.bits(24);
            if (r.bits(3) & 4) r.b += 128;
            if (r.bits(1)) r.b += 256;
            if (t === 2) resources.models[idx] = name;
            else if (t === 5) resources.events[idx] = name;
            else if (t === 0) resources.sounds[idx] = name;
          }
          if (r.bits(1)) while (r.bits(1)) r.b += r.bits(1) ? 5 : 10;
          r.bitsEnd();
          break;
        }
        case 44: { // newmovevars
          r.skip(4 * 16 + 1 + 4 * 2 + 4 * 6); r.str(); break;
        }
        case 45: r.skip(8); break; // resourcerequest
        case 46: { // customization
          r.ub(); r.ub(); r.str(); r.us(); r.ui();
          const fl = r.ub();
          if (fl & 4) r.skip(16);
          break;
        }
        case 47: r.skip(2); break; // crosshairangle
        case 48: r.skip(4); break; // soundfade
        case 49: r.str(); break; // filetxferfailed
        case 50: { // hltv
          const mode = r.ub();
          if (mode === 1) r.skip(18);
          break;
        }
        case 51: { // director
          const n = r.ub();
          // DRC_CMD_STATUS (8): slots (long), spectators watching the broadcast (long), relay proxies (short)
          if (n >= 11 && u8[r.p] === 8 && inPlayback) hltvStatus.push(time, r.dv.getInt32(r.p + 5, true));
          r.skip(n);
          break;
        }
        case 52: r.str(); r.ub(); break; // voiceinit
        case 53: { r.ub(); const n = r.us(); r.skip(n); break; } // voicedata
        case 54: r.str(); r.ub(); break; // sendextrainfo
        case 55: r.f(); break; // timescale
        case 56: r.str(); break; // resourcelocation
        case 57: r.str(); break; // sendcvarvalue
        case 58: r.ui(); r.str(); break; // sendcvarvalue2
        default: throw new Error('unknown svc ' + type);
      }
    }
  }

  const totalLen = dirs.reduce((a, d) => a + d.length, 0);
  let doneLen = 0, lastProg = 0;
  let playbackStart = null;

  for (let di = 0; di < dirs.length; di++) {
    const d = dirs[di];
    inPlayback = di > 0;
    r.p = d.offset;
    const segEnd = d.offset + d.length;
    let done = false;
    while (!done && r.p < segEnd) {
      const ftype = r.ub();
      const ftime = r.f();
      r.ui();
      if (inPlayback) {
        time = ftime;
        if (playbackStart == null) playbackStart = ftime;
      }
      switch (ftype) {
        case 0: case 1: {
          r.skip(464);
          const len = r.ui();
          const end = r.p + len;
          try { parseMessages(end); }
          catch (e) { errors++; if (errSamples.length < 10) errSamples.push(e.message + ' @' + time.toFixed(2)); }
          if (pendingEv.length) {
            // an event names its entity by position in this frame's entity list
            let order = null;
            for (let k = 0; k < pendingEv.length; k += 3) {
              const ev = pendingEv[k + 2]; let e = ev && ev.entindex ? ev.entindex : 0;
              if (!e && pendingEv[k + 1] >= 0) { if (!order) { order = []; for (let n = 0; n < ents.length; n++) if (ents[n]) order.push(n); } e = order[pendingEv[k + 1]] || 0; }
              shots.push(time, e, pendingEv[k], ev && ev.bparam1 ? 1 : 0);
            }
            pendingEv = [];
          }
          r.p = end;
          if (inPlayback) takeSample();
          break;
        }
        case 2: break;
        case 3: r.skip(64); break;
        case 4: r.skip(32); break;
        case 5: done = true; break;
        case 6: r.skip(84); break;
        case 7: r.skip(8); break;
        case 8: { r.skip(4); const n = r.ui(); r.skip(n + 16); break; }
        case 9: { const n = r.ui(); r.skip(n); break; }
        default: throw new Error('bad frame type ' + ftype + ' at ' + (r.p - 9));
      }
      if (onProgress) {
        const prog = (doneLen + (r.p - d.offset)) / totalLen;
        if (prog - lastProg > 0.01) { lastProg = prog; onProgress(prog); }
      }
    }
    doneLen += d.length;
  }
  if (curRound && curRound.end == null) curRound.end = time;
  for (const k in nadeEnts) finishNade(k);

  // pack samples into typed arrays
  const slots = {};
  for (const e in samples.slots) slots[e] = new Float32Array(samples.slots[e]);

  return {
    header, serverInfo, maxClients,
    mapName: (serverInfo && serverInfo.mapFile) ? serverInfo.mapFile.replace(/^maps\//, '').replace(/\.bsp$/, '') : header.mapName,
    start: playbackStart || 0, end: time,
    players, kills, rounds, bomb, chat, nades, roundTimes, pauses, hp: new Float32Array(hp),
    occupants, brushEvents: new Float32Array(brushEvents), brushPose: new Float32Array(brushPose), viewers: hltvStatus, notes,
    times: new Float32Array(samples.t), slots,
    finalScore: { ...scores }, models: resources.models, stride: STRIDE,
    pmodels, sounds: resources.sounds, events: resources.events, snds: new Float32Array(snds), shots: new Float32Array(shots), booms: new Float32Array(booms), radio, corpses,
    errors, errSamples,
  };
}
