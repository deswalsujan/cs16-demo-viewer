// ---------------- overview ----------------
function parseOverviewTxt(txt) {
  const g = (re) => { const m = re.exec(txt); return m ? m : null; };
  const z = g(/ZOOM\s+([-\d.]+)/i), o = g(/ORIGIN\s+([-\d.]+)\s+([-\d.]+)/i), r = g(/ROTATED\s+(\d)/i);
  return { zoom: z ? +z[1] : 1, ox: o ? +o[1] : 0, oy: o ? +o[2] : 0, rotated: r ? r[1] === '1' : false };
}

async function imageFromBlob(blob) {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('image decode failed')); img.src = url; });
    const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const id = x.getImageData(0, 0, c.width, c.height), p = id.data;
    // CS overviews use pure green as the transparent colour
    for (let i = 0; i < p.length; i += 4) if (p[i] < 40 && p[i + 1] > 215 && p[i + 2] < 40) p[i + 3] = 0;
    x.putImageData(id, 0, 0);
    return c;
  } finally { URL.revokeObjectURL(url); }
}

async function tryLoadOverview(map) {
  const key = map.toLowerCase();
  let bmp = null, txt = null;
  const f = files.overviews[key];
  if (f && f.bmp && f.txt) {
    try { txt = await f.txt.text(); await f.bmp.slice(0, 2).arrayBuffer(); bmp = f.bmp; idb.put(key, { bmp, txt }); }
    catch (e) { noteStale(e, `overviews/${key}.bmp`); bmp = txt = null; }
  }
  if (!bmp || !txt) {
    const cached = await idb.get(key);
    if (cached) { bmp = cached.bmp; txt = cached.txt; }
  }
  if (!bmp || !txt) return false;
  try {
    const img = await imageFromBlob(bmp);
    OV = Object.assign(parseOverviewTxt(txt), { img, w: img.width, h: img.height });
    return true;
  } catch (e) { return false; }
}

// world -> overview image pixel (formulas from the HL SDK spectator overview)
function w2i(x, y) {
  if (OV) {
    const a = 4 / 3, z = OV.zoom;
    if (OV.rotated) return [(x - (OV.ox - 4096 / z)) / (8192 / z) * OV.w, ((OV.oy + 4096 / (z * a)) - y) / (8192 / (z * a)) * OV.h];
    return [((OV.oy + 4096 / z) - y) / (8192 / z) * OV.w, ((OV.ox + 4096 / (z * a)) - x) / (8192 / (z * a)) * OV.h];
  }
  const b = M.bounds;
  return [(x - b.x0) * b.k + b.px, (b.y1 - y) * b.k + b.py];
}
const unitsPerPx = () => OV ? 8 / OV.zoom : 1 / M.bounds.k;


// ---------------- map geometry (.bsp + .wad) ----------------
let MAP = null;          // { bsp, tex: {name: {w,h,data}}, name }
const MOVERS = /^func_(door|door_rotating|rotating|train|tracktrain|plat|pushable|vehicle)$/;
let mapLoading = null;
async function loadMap(map) {
  const key = map.toLowerCase();
  if (MAP && MAP.name === key) return MAP;
  if (mapLoading) return mapLoading;
  mapLoading = (async () => {
    status3(`Loading ${map}…`);
    let bspBlob = files.maps[key] || null, tex = null;
    let bspU8 = bspBlob ? await readPicked(bspBlob, `maps/${key}.bsp`) : null;
    // not in the folder, or changed on disk since it was chosen: use this browser's saved copy if there is one
    if (!bspU8) {
      const c = await idb.get('map2:' + key);
      if (c) { bspBlob = c.bsp; tex = c.tex; bspU8 = new Uint8Array(await bspBlob.arrayBuffer()); }
    }
    if (!bspU8) { clear3d(); status3(STALE.has(`maps/${key}.bsp`) ? `${map}.bsp changed on disk after you chose the folder. ${HL.handle ? 'Refresh' : 'Choose'} your Half-Life folder again.` : `The map file ${map}.bsp was not found.`, true); return null; }
    let bsp;
    try { bsp = parseBsp(bspU8); }
    catch (e) { status3(`Could not read ${map}.bsp: ${e.message}`, true); return null; }
    if (!tex) {
      tex = {};
      const missing = new Set(bsp.textures.filter((t) => !t.data).map((t) => t.name));
      // listed wads first, then everything else in the folder
      const order = [...bsp.wads.filter((w) => files.wads[w]), ...Object.keys(files.wads).filter((w) => !bsp.wads.includes(w))];
      for (const w of order) {
        if (!missing.size) break;
        status3(`Loading textures from ${w}…`);
        try {
          const u8 = await readPicked(files.wads[w], w); if (!u8) continue;
          const found = parseWad(u8, missing);
          for (const n in found) { tex[n] = found[n]; missing.delete(n); }
        } catch (e) { /* skip unreadable wad */ }
      }
      idb.put('map2:' + key, { bsp: bspBlob, tex });
    }
    MAP = { name: key, bsp, tex };
    MAP.missingTex = bsp.textures.filter((t) => !t.data && !tex[t.name]).length;
    // breakable brushes (vents, glass, wooden planks): these can be shot out during a round
    MAP.breakables = new Set(bsp.entities.filter((e) => e.classname === 'func_breakable' && e.model && e.model[0] === '*').map((e) => +e.model.slice(1)));
    // doors and other brushes that move: model -> where the map file puts them (the demo says where they really are)
    MAP.movers = new Map(bsp.solids.filter((s) => MOVERS.test(s.cls)).map((s) => [s.model, s.origin]));
    status3('');
    await loadMaterials();
    computeWallbangs();
    if (view3.ready === false || view3.map !== key) build3d();
    return MAP;
  })();
  try { return await mapLoading; } finally { mapLoading = null; }
}
