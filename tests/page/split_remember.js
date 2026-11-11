(async () => {
  // After joining: opening either part opens the joined map; Split them goes back to the part playing now, and
  // forgets the set (split maps)
  const until = async (ok) => { for (let i = 0; i < 1200 && !ok(); i++) await new Promise((r) => setTimeout(r, 250)); };
  const names = D.parts.map((p) => p.fileName);
  const p2 = files.demos.find((f) => f.name === names[1]);
  closeSummary();
  const old = D;
  loadDemoFile(files.demos.find((f) => f.name === names[0]));
  await until(() => D !== old && D && D.parts && M && M.liveR.some((r) => r.part === 1) && !$('sumCard').hidden);
  const reopened = { parts: D.parts.length, score: M.liveR[M.liveR.length - 1].scoreAfter.join(':') };
  T = D.parts[1].start + 60;
  const old2 = D;
  splitJoined();
  await until(() => D !== old2 && D && !D.parts && D.fileName === names[1] && M && M.liveR.length && M.liveR.every((r) => r.part == null));
  const split = { file: D.fileName, chipHidden: $('partsChip').hidden, remembered: [ls.get('join:' + names[0]), ls.get('join:' + names[1])] };
  const old3 = D;
  loadDemoFile(p2);
  await until(() => D !== old3 && D && D.fileName === names[1] && M);
  await new Promise((r) => setTimeout(r, 1000));
  return { reopened, split, afterSplitOpensAlone: !D.parts };
})()
