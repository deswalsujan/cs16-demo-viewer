// Rounds tab: the round that's playing gets the strong highlight.
(() => { document.querySelector('.tabs button[data-tab="rounds"]').click(); return { cur: [...document.querySelectorAll('#pane .row.cur')].map((x) => x.textContent.replace(/\s+/g, ' ').trim()) }; })()
