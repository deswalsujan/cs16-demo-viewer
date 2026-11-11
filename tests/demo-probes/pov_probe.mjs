// POV probe (3 Oct 2026): what a demo recorded by a player stores that HLTV demos don't.
// Usage: python3 make_pov_probe.py, then node pov_probe.mjs <demo.dem>. make_pov_probe.py writes pov_probe_demo.mjs:
// src/demo.js with a few lines that record the recorder's own view, clientdata, weapon animations and voice.
import { parseDemo } from './pov_probe_demo.mjs';
import fs from 'fs';
const file = process.argv[2];
const t0 = Date.now();
const d = parseDemo(new Uint8Array(fs.readFileSync(file)));
const P = globalThis.__P;
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const out = {};
out.file = file.split('/').pop();
out.protocol = [d.header.demoProtocol, d.header.netProtocol];
out.map = d.mapName; out.maps = d.maps.map(m => `${m.map} ${fmt(m.dur)}`);
out.pov = d.pov; out.length = fmt(d.end - d.start); out.readErrors = d.errors; out.errSamples = d.errSamples.slice(0, 3);
out.health = d.health; out.parseSec = ((Date.now() - t0) / 1000).toFixed(1);
const ents = Object.keys(d.players).map(Number);
out.players = ents.length;
out.kills = d.kills.length; out.rounds = d.rounds.length; out.maxClients = d.maxClients;
out.score = d.finalScore;
// player models named by players' info, and models in the resource list that aren't stock
out.playerModels = [...new Set(Object.values(d.players).map(p => p.model).filter(Boolean))];
const stockPl = new Set(['arctic','gign','gsg9','guerilla','leet','sas','terror','urban','vip']);
out.nonStockPlayerModels = out.playerModels.filter(m => !stockPl.has(m));
const ms = Object.values(d.models).filter(m => /\.mdl$/i.test(m));
out.modelFilesListed = ms.length;
out.nonStockModelFiles = ms.filter(m => !/^models\/(p_|v_|w_|player\/(arctic|gign|gsg9|guerilla|leet|sas|terror|urban|vip)\/|shell|pshell|rshell|hgibs|grenade|w_|player\.mdl|.*gib|bonegibs|agibs|hostage|scientist|chick|mechgibs|metalplategibs|glassgibs|woodgibs|cindergibs|computergibs|rockgibs|ceilinggibs|fleshgibs|saiga|wood|flesh|rock|stone)/i.test(m)).slice(0, 40);
// frame data: the recording player's own view, every frame
const info = P.info.filter(x => x[0] >= d.start);
const dts = []; for (let i = 1; i < info.length; i++) { const dt = info[i][0] - info[i - 1][0]; if (dt > 0 && dt < 1) dts.push(dt); }
dts.sort((a, b) => a - b);
out.viewFrames = info.length; out.viewFramesPerSec = dts.length ? (1 / dts[dts.length >> 1]).toFixed(1) : null;
out.snapshotsPerSec = (d.times.length / (d.end - d.start)).toFixed(1);
const nonzeroPunch = info.filter(x => Math.abs(x[7]) > 0.01 || Math.abs(x[8]) > 0.01).length;
out.framesWithRecoil = nonzeroPunch;
out.viewentity = [...new Set(info.map(x => x[9]))].slice(0, 6); out.playernum = [...new Set(info.map(x => x[10]))].slice(0, 6);
const fire = info.filter(x => x[12] & 1).length; out.framesWithFireButton = fire;
const alive = info.filter(x => x[11] > 0); out.recorderAliveShare = (alive.length / info.length).toFixed(2);
out.recoilWhileAlive = alive.filter(x => Math.abs(x[7]) > 0.01 || Math.abs(x[8]) > 0.01).length;
const dead = info.filter(x => x[11] <= 0); out.deadFramesCameraNotOwnAim = dead.filter(x => Math.abs(((x[5] - x[14]) % 360 + 540) % 360 - 180) > 1).length + ' of ' + dead.length;
// samples: a few frames mid-demo
const mid = info[info.length >> 1]; out.sampleFrame = mid && { t: fmt(mid[0] - d.start), vieworg: mid.slice(1, 4).map(v => +v.toFixed(1)), viewangles: mid.slice(4, 7).map(v => +v.toFixed(2)), punch: mid.slice(7, 9).map(v => +v.toFixed(2)), health: mid[11], cmdAngles: mid.slice(13, 15).map(v => +v.toFixed(2)) };
// clientdata: the recording player's own state (health, zoom, recoil, ammo)
out.clientdataMsgs = P.cd.length;
const keys = {}; for (const [, o] of P.cd) for (const k in o) keys[k] = (keys[k] || 0) + 1;
out.clientdataFields = Object.entries(keys).sort((a, b) => b[1] - a[1]).slice(0, 25).map(([k, n]) => `${k}:${n}`);
const fovs = {}; for (const [, o] of P.cd) if ('fov' in o) fovs[o.fov] = (fovs[o.fov] || 0) + 1; out.fovValues = fovs;
out.weaponAnimMsgs = P.wanim; out.weaponAnimFrames = P.wanimF; out.setview = P.setview;
out.voicePackets = P.voice.length; out.voiceBytes = P.voice.reduce((a, v) => a + v[2], 0);
out.voiceSpeakers = [...new Set(P.voice.map(v => v[1]))].length;
// is the recording player in the entity snapshots like everyone else?
const ve = info.length ? info[info.length >> 1][10] + 1 : null;
out.recorderEntity = ve; out.recorderName = ve && d.players[ve] ? d.players[ve].name : null;
if (ve && d.slots[ve]) {
  const sl = d.slots[ve], st = d.stride; let n = 0, has = 0, sumd = 0;
  for (let i = 0; i < d.times.length; i += 50) {
    const x = sl[i * st]; if (!x && !sl[i * st + 1]) continue; has++;
    const t = d.times[i]; let j = info.findIndex(f => f[0] >= t); if (j < 0) continue;
    const f = info[j]; sumd += Math.hypot(f[1] - sl[i * st], f[2] - sl[i * st + 1]); n++;
  }
  out.recorderTrack = { samplesWithPosition: has, medianishGapToView: n ? +(sumd / n).toFixed(1) : null };
} else out.recorderTrack = 'no track';
// how many players are in each snapshot (the "drop in and out" limit)
const counts = []; for (let i = 0; i < d.times.length; i += 20) { let c = 0; for (const e in d.slots) { const s = d.slots[e]; if (s[i * d.stride] || s[i * d.stride + 1]) c++; } counts.push(c); }
counts.sort((a, b) => a - b); out.playersVisiblePerSnapshot = { min: counts[0], median: counts[counts.length >> 1], max: counts[counts.length - 1] };
console.log(JSON.stringify(out, null, 1));
