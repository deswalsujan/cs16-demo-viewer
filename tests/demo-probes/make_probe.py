"""Writes demo_probe.mjs: a copy of src/demo.js that also records user message counts, delta field names and
changes to extra player fields (for finding out what a demo records, e.g. zoom). Run from tests/demo-probes/."""
import os
here = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(here, '..', '..', 'src', 'demo.js')).read()
s = s.replace("  function onUserMsg(name, d) {\n", "  function onUserMsg(name, d) {\n    (globalThis.UM[name] = globalThis.UM[name] || { n: 0 }).n++;\n", 1)
s = s.replace("          deltas[name] = fields;", "          deltas[name] = fields; globalThis.DF[name] = fields.map((f) => f.name + ':' + f.bits);")
old = "            readDelta(r, deltas[entType(num, custom)], st);\n            if (num > maxClients) trackNade(num);"
new = """            const before = num <= maxClients ? Object.assign({}, st) : null;
            readDelta(r, deltas[entType(num, custom)], st);
            if (before && inPlayback) for (const f of globalThis.WATCH) if (st[f] !== before[f]) globalThis.CH.push([time, num, f, before[f], st[f]]);
            if (num > maxClients) trackNade(num);"""
assert old in s, 'demo.js changed: update make_probe.py'
s = s.replace(old, new)
s = s.replace("export function parseDemo", "globalThis.UM = {}; globalThis.DF = {}; globalThis.CH = []; globalThis.WATCH = ['iuser4','spectator','body','skin','rendermode','renderamt','renderfx','effects','framerate','scale','colormap','friction','gravity','aiment','controller[0]','controller[1]','controller[2]','controller[3]','blending[0]','blending[1]','basevelocity[0]'];\nexport function parseDemo")
# every event with its fields and the shooter's state at that frame (bullet marks check)
old = "              shots.push(time, e, pendingEv[k], ev && ev.bparam1 ? 1 : 0);"
assert old in s, 'demo.js changed: update make_probe.py'
s = s.replace(old, old + "\n              (globalThis.EV = globalThis.EV || []).push({ t: time, e, ei: pendingEv[k], ev, ang: ents[e] ? [ents[e]['angles[0]'], ents[e]['angles[1]']] : null, pos: ents[e] ? [ents[e]['origin[0]'], ents[e]['origin[1]'], ents[e]['origin[2]']] : null });")
s = s.replace("deltas[name] = fields; globalThis.DF[name] = fields.map((f) => f.name + ':' + f.bits);", "deltas[name] = fields; globalThis.DF[name] = fields.map((f) => f.name + ':' + f.bits + '/' + f.divisor + (f.flags & 0x80000000 ? 's' : ''));")
open(os.path.join(here, 'demo_probe.mjs'), 'w').write(s)
print('wrote demo_probe.mjs')

# demo_probe_count.mjs: also records, for every delta packet, the object count the packet states and how many
# objects are held after reading it (0.14.0: on de_tuscan every snapshot holds the engine's maximum of 256)
c = s
old = """        case 41: { // deltapacketentities
          r.bitsStart();
          r.bits(16);"""
assert old in c, 'demo.js changed: update make_probe.py'
c = c.replace(old, """        case 41: { // deltapacketentities
          r.bitsStart();
          const __n = r.bits(16); globalThis.__pending = __n;""")
old = """            if (num > maxClients) trackNade(num);
          }
          r.bitsEnd();"""
assert old in c, 'demo.js changed: update make_probe.py'
c = c.replace(old, old + """
          { let n = 0; for (let k = 1; k < ents.length; k++) if (ents[k]) n++; (globalThis.CMP = globalThis.CMP || []).push([globalThis.__pending, n]); }""")
open(os.path.join(here, 'demo_probe_count.mjs'), 'w').write(c)

# nades_fn.mjs: the page's addNadesFromEvents, for nadecheck.mjs
t = open(os.path.join(here, '..', '..', 'src', 'template.html')).read()
i, j = t.index('function addNadesFromEvents'), t.index('// ---------------- sniper zoom')
open(os.path.join(here, 'nades_fn.mjs'), 'w').write('export ' + t[i:j])
print('wrote demo_probe_count.mjs and nades_fn.mjs')
