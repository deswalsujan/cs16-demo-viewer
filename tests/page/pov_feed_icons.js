// POV mode: the kill feed with the game's weapon and headshot icons (0.18.0's, ported 22 Oct 2026). Moves to just
// after the recorder's kill nearest window.__feedAt (demo seconds from the start, default 122) and reads the feed:
// rows, icons drawn, any weapon still shown as a word. Leaves the view there for a screenshot.
(() => {
  const at = window.__feedAt != null ? window.__feedAt : 122;
  const k = D.kills.reduce((b, x) => (!b || Math.abs(x.t - D.start - at) < Math.abs(b.t - D.start - at) ? x : b), null);
  const tt = k.t + 0.6;
  seek(tt); playing = false; POV.i = 0; povFollow(tt); updateHud(true);
  const rows = [...document.querySelectorAll('#feed > div')];
  return { at: fmt(tt - D.start), iconsLoaded: Object.keys(KICONS).length, headshotIcon: !!KICONS.headshot,
    rows: rows.map((r) => ({ text: r.innerText.replace(/\s+/g, ' ').trim(), icons: [...r.querySelectorAll('.kico')].map((i) => i.className.replace('kico ', '')) })) };
})()
