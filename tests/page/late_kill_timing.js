// Guards the 0.15.5 fix (NoA vs Pentagram, Train 2006, protocol 47): a kill whose message arrives after the
// victim's death sound is shown at the death sound, with positions and aim from the killing shot.
// Run on noa.penta-0610211800-de_train.dem (late_kill_timing_check.py does this). Returns { pass, checks }.
(() => {
  const checks = [];
  const ok = (name, pass, got) => checks.push({ name, pass: !!pass, got });
  // the victim's death sounds, read again from the demo here (not from the viewer's own re-timing)
  const sn = (i) => String((D.sounds && D.sounds[i]) || '').toLowerCase();
  const die = {};
  for (let i = 0; i < D.snds.length; i += 10) if (/player\/(die|death)/.test(sn(D.snds[i + 1]))) (die[D.snds[i + 2]] || (die[D.snds[i + 2]] = [])).push(D.snds[i]);
  const deathBefore = (e, t) => { let r = null; for (const x of die[e] || []) { if (x > t + 0.001) break; if (x > t - 1) r = x; } return r; };

  // 1. every late kill sits exactly on its victim's death sound, and its positions come from no later than that
  let late = 0, wrong = [];
  for (const k of D.kills) {
    if (k.killer === k.victim || k.tMsg == null) continue;
    const ds = deathBefore(k.victim, k.tMsg);
    if (ds == null || k.tMsg - ds <= 0.05) continue;
    late++;
    if (Math.abs(k.t - ds) > 0.002 || !(k.tPos <= k.t + 0.001) || !(k.tPos >= ds - 0.301)) wrong.push({ t: +k.t.toFixed(2), death: +ds.toFixed(2), msg: +k.tMsg.toFixed(2), pos: k.tPos && +k.tPos.toFixed(2) });
  }
  ok('late kills found (0.15.5 counted 135)', late === 135, late);
  ok('every late kill shown at the death sound, positions from the shot', !wrong.length, wrong.slice(0, 5));
  ok('viewer says it moved the same number', D.killsRetimed === late, D.killsRetimed);

  // 2. the kill Sujan checked: round 22, 0:55, neo (M4) on ave
  const r = M.rounds.find((x) => x.live && x.ln === 22);
  const nm = (p) => (p != null && M.pl[p] ? M.pl[p].name : '');
  const k = r && D.kills.find((x) => x.t >= r.start && x.t <= r.end && /neo/i.test(nm(x.kp)) && /ave/i.test(nm(x.vp)));
  ok('round 22: neo on ave found', !!k, k ? `${nm(k.kp)} on ${nm(k.vp)}` : null);
  if (k) {
    ok('shown at the death sound, before the message', k.tMsg - k.t > 0.15 && k.tMsg - k.t < 0.3, +(k.tMsg - k.t).toFixed(2));
    ok('positions from the shot, before the death sound', k.t - k.tPos > 0.15 && k.t - k.tPos < 0.3, +(k.t - k.tPos).toFixed(2));
    ok('round timer 0:55 at the kill', clockText(k.t) === '0:55', clockText(k.t));
    const feedHas = (t) => { seek(t); updateHud(true); return /ave/i.test($('feed').textContent); };
    ok('kill feed empty of it at the shot', !feedHas(k.tPos + 0.01), null);
    ok('kill feed empty of it just before the death sound', !feedHas(k.t - 0.03), null);
    ok('kill feed shows it at the death sound', feedHas(k.t + 0.01), $('feed').textContent);
    if (!hpIdx) buildHp(); // built when the 3D view first draws names; this test runs without the map
    const hp = hpAt(k.victim, k.t - 0.03);
    ok('ave still alive just before (0.15.5: 9 HP)', hp != null && hp > 0, hp);
  }
  return { pass: checks.every((c) => c.pass), checks };
})()
