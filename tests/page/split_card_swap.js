(async () => {
  // Move part 1 down: the order breaks the rounds, so the card explains it and Join is off
  document.querySelector('[data-mv="0,1"]').click();
  await new Promise((r) => setTimeout(r, 200));
  return { order: JOIN.list.map((f) => f.name), joinOn: !$('jGo').disabled, text: $('joinCard').innerText.replace(/\n+/g, ' | ') };
})()
