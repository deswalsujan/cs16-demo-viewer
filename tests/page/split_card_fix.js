(async () => {
  // Use the suggested order: back to the order from the file names, Join on
  $('jSugg').click();
  await new Promise((r) => setTimeout(r, 200));
  return { order: JOIN.list.map((f) => f.name), joinOn: !$('jGo').disabled };
})()
