// ---------------- shorter names ----------------
// The team heading already names the team, so the clan tag most of the team shares is dropped there:
// "fnaticRC kArRiG4N@$tY@" -> "kArRiG4N@$tY@", "Meet Neo, Your Maker" -> "Neo". Tags are cut only where a
// space or symbol separates them from the name, so "mouz|ninja" and "mouz|nEx" lose "mouz|", not "mouz|n".
// The full name shows on hover. Players without the tag (a stand-in) keep their name as it is.
// Since 0.18.0 the same short names are used for the names over players in 2D and 3D and in the Kills and
// Wallbangs lists (Sujan, 14 Oct 2026), and two more things go:
//   - a web address as a word of its own: "MYM|REAL www.steelseries.com" -> "REAL" (mym vs fnatic, Train, 2006)
//   - a sponsor after a separator most of the team uses, each player's own: "LIONS Xizt * MAXFPS",
//     "LIONS kHRYSTAL * KASPERSKY" -> "Xizt", "kHRYSTAL" (FX vs Lions, Nuke, DreamHack Winter 2010)
// A note only one player has stays ("fnatic.Archi      *Bday 19!"). The kill feed at the top right, the name
// bar under the view, the Tab scoreboard and Copy list keep the full names, as the game shows them.
const SKULL = '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.9 2 3 5.7 3 10.5c0 2.8 1.4 4.9 3.5 6.1V19a1 1 0 0 0 1 1h1.5v2h2v-2h2v2h2v-2h1.5a1 1 0 0 0 1-1v-2.4c2.1-1.2 3.5-3.3 3.5-6.1C21 5.7 17.1 2 12 2Zm-3.5 7.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM12 14l1.3 2.3h-2.6L12 14Z"/></svg>';
function tagCuts(names) {
  const isSep = (c) => !/[\p{L}\p{N}]/u.test(c);
  const need = Math.max(2, Math.ceil(names.length * 0.6));
  // the longest piece, ending (prefix) or starting (suffix) at a separator, that enough names share
  const best = (cands, has) => {
    let out = '';
    for (const c of cands) if (c.length > out.length && c.trim().length >= 2 && names.filter((n) => has(n, c)).length >= need) out = c;
    return out;
  };
  const pre = new Set(), suf = new Set();
  for (const n of names) for (let i = 0; i < n.length; i++) if (isSep(n[i])) { pre.add(n.slice(0, i + 1)); suf.add(n.slice(i)); }
  return { pre: best(pre, (n, c) => n.startsWith(c) && n.length > c.length), suf: best(suf, (n, c) => n.endsWith(c) && n.length > c.length) };
}
const WEB = /^(?:https?:\/\/)?(?:www\.[^\s]+|[a-z0-9-]{2,}(?:\.[a-z0-9-]+)*\.(?:com|net|org|de|se|ru|pl|eu|info|tv|gg|dk|no|fi|fr|uk|co\.uk|nl|cz|sk|ua|kz|by|ro|bg|hu|it|es|pt|br|us|ca|au|cn|kr|jp)\/?)$/i;
function dropWeb(n) {
  const words = n.split(/(\s+)/), keep = words.filter((w) => !WEB.test(w));
  const t = keep.join('').trim();
  return t.length >= 2 && t !== n.trim() ? t : n;
}
// "Xizt * MAXFPS": a separator of spaces and symbols with at least one symbol, then one or two words. When most
// of the team have the same separator there, what follows is a sponsor and goes.
function sponsorCut(names) {
  const need = Math.max(2, Math.ceil(names.length * 0.6));
  const sepOf = (n) => { const m = n.match(/\S(\s+[^\p{L}\p{N}\s]+\s+)[\p{L}\p{N}][^\s]*(?:\s[^\s]+)?$/u); return m ? m[1].replace(/\s+/g, ' ') : null; };
  const count = {};
  for (const n of names) { const sp = sepOf(n); if (sp) count[sp] = (count[sp] || 0) + 1; }
  const sep = Object.keys(count).find((k) => count[k] >= need);
  if (!sep) return names;
  return names.map((n) => { const sp = sepOf(n); if (sp !== sep) return n; const i = n.replace(/\s+/g, ' ').lastIndexOf(sep); const t = n.replace(/\s+/g, ' ').slice(0, i).trim(); return t.length >= 2 ? t : n; });
}
function shortNames(ents) {
  const out = {};
  const full = ents.map((e) => M.pl[e].name);
  if (full.length < 2) return out;
  // web addresses first, then the clan tag the team shares, then a sponsor after the name
  const names = full.map(dropWeb);
  const { pre, suf } = tagCuts(names);
  // separators left over at a cut ("mousesports | ninja" -> "ninja"); the name's own ends are never touched
  let res = names.map((n) => {
    let t = n;
    if (pre && t.startsWith(pre)) t = t.slice(pre.length).replace(/^[\s|*.,:;\-_/\\~>\]})]+/, '');
    if (suf && t.endsWith(suf) && t.length > suf.length) t = t.slice(0, t.length - suf.length).replace(/[\s|*.,:;\-_/\\<\[({]+$/, '');
    return t.length >= 2 ? t : n;
  });
  res = sponsorCut(res);
  // two players who would read the same keep their full names
  ents.forEach((e, i) => { if (res[i] !== full[i] && res.filter((x) => x === res[i]).length === 1) out[e] = res[i]; });
  return out;
}
// short names for the whole demo, by person: worked out over each whole team (M.teams), so a name reads the
// same in the labels, the lists and the Players tab
function buildShort() {
  M.short = {};
  for (const team of M.teams || []) Object.assign(M.short, shortNames(team));
}
const shortName = (pid) => (M.short && M.short[pid]) || (M.pl[pid] ? M.pl[pid].name : '?');
const labelAt = (slot, t) => shortName(M.personAt(slot, t));
