(async () => {
  // 0.14.0: a summary card closed while it was still checking doesn't come back when the check finishes
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const seen = [];
  for (let i = 0; i < 12; i++) { seen.push($('sumCard').hidden); await wait(500); }
  return { hiddenThroughout: seen.every(Boolean), samples: seen.length };
})()
