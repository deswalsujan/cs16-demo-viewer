// Reads the load summary card: headline, text, rows, and whether the countdown bar is animated smoothly.
(() => {
  const c = document.querySelector('#sumCard');
  const bar = document.querySelector('#sumBar');
  const anims = bar && bar.getAnimations ? bar.getAnimations().map((a) => a.playState) : [];
  return {
    shown: !c.hidden,
    title: (c.querySelector('h2') || {}).textContent,
    text: (c.querySelector('.sum-top p') || {}).textContent,
    rows: [...c.querySelectorAll('.sum-list li')].map((li) => li.textContent.replace(/\s+/g, ' ').trim()),
    barAnimations: anims, count: ($('sumCount') || {}).textContent,
  };
})()
