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
open(os.path.join(here, 'demo_probe.mjs'), 'w').write(s)
print('wrote demo_probe.mjs')
