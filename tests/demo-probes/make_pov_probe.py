# Writes pov_probe_demo.mjs for pov_probe.mjs (POV trial, 3 Oct 2026): a copy of pov/src/demo.js that also records,
# per frame, the recording player's own view (camera, angles, recoil, health, buttons), the clientdata messages
# (zoom, recoil, weapon), weapon animations and voice packets. Run from tests/demo-probes.
s = open('../../pov/src/demo.js').read()
G = '(globalThis.__P ||= {cd:[],voice:[],wanim:0,wanimF:0,info:[],setview:0})'
reps = [
  # the reader runs twice on a POV demo (to spot it, then to find its rounds): keep only the last run
  ("export function parseDemo(buffer, onProgress, opts = {}) {", "export function parseDemo(buffer, onProgress, opts = {}) {\n  globalThis.__P = null;"),
  # each clientdata message on its own (since wip/pov-mode the reader also builds them up into the recorder's state)
  ("readDelta(r, deltas.clientdata_t, own);", "{ const before = { ...own }; readDelta(r, deltas.clientdata_t, own); const o = {}; for (const k in own) if (own[k] !== before[k] || !(k in before)) o[k] = own[k]; " + G + ".cd.push([time, o]); }"),
  ("case 53: { r.ub(); const n = r.us(); r.skip(n); break; } // voicedata", "case 53: { const who = r.ub(); const n = r.us(); r.skip(n); " + G + ".voice.push([time, who, n]); break; } // voicedata"),
  ("case 35: r.skip(2); break; // weaponanim", "case 35: r.skip(2); " + G + ".wanim++; break; // weaponanim"),
  ("case 7: r.skip(8); break;", "case 7: r.skip(8); " + G + ".wanimF++; break;"),
  ("case 5: r.s(); break; // setview", "case 5: r.s(); " + G + ".setview++; break; // setview"),
  # the 464 bytes before each frame's messages: timestamp, then the view (vieworg at 4, viewangles at 16,
  # health at 144 as a whole number, punch angle at 164, viewentity 180, playernum 184), then the user command
  # (its viewangles at 240, buttons at 266)
  ("case 0: case 1: {\n          r.skip(464);", "case 0: case 1: {\n          { const dv = r.dv, b = r.p; const f = (o) => dv.getFloat32(b + o, true); " + G + ".info.push([ftime, f(4), f(8), f(12), f(16), f(20), f(24), f(164), f(168), dv.getInt32(b+180,true), dv.getInt32(b+184,true), dv.getInt32(b+144,true), dv.getUint16(b+266,true), f(240), f(244)]); }\n          r.skip(464);"),
]
for a, b in reps:
    assert a in s, a
    s = s.replace(a, b, 1)
open('pov_probe_demo.mjs', 'w').write(s)
print('wrote pov_probe_demo.mjs')
