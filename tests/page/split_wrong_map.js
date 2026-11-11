(async () => {
  // Join with another demo from another map: refused with its own card
  closeSummary();
  await openJoinCard(D.partFiles);
  const nuke = files.demos.find((f) => f.name.includes('1104240212'));
  await addJoinPart(nuke);
  return $('joinCard').innerText.replace(/\n+/g, ' | ');
})()
