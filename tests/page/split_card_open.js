(async () => {
  // Click "Join the parts" in the load summary and wait until the Join card has read every part
  $('sumJoin').click();
  const done = () => !JOIN.reading && JOIN.list.length && JOIN.list.every((f) => JOIN.F.has(f.name)) && $('jGo');
  for (let i = 0; i < 900 && !done(); i++) await new Promise((r) => setTimeout(r, 200));
  await new Promise((r) => setTimeout(r, 300));
  return { order: JOIN.list.map((f) => f.name), joinOn: !$('jGo').disabled, text: $('joinCard').innerText.replace(/\n+/g, ' | ') };
})()
