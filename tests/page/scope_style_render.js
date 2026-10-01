(async () => {
  const w = (ms) => new Promise((r) => setTimeout(r, ms)); await w(2500); closeSummary();
  const k = D.kills.find((x) => x.scope && M.pl[x.kp].name.startsWith('PASHA') && M.pl[x.vp].name.includes('Edward'));
  setView('3d'); selected = k.killer; setCam('eyes', true); playing = false; T = k.t - 0.02;
  const variant = window.__variant;
  drawScope = function (lx, W, H) {
    const cx = W / 2, cy = H / 2, r = Math.min(W, H) * 0.46;
    lx.save();
    lx.fillStyle = '#000';
    lx.beginPath(); lx.rect(0, 0, W, H); lx.arc(cx, cy, r, 0, Math.PI * 2, true); lx.fill('evenodd');
    lx.strokeStyle = '#000';
    lx.lineWidth = variant === 'game' ? 1 : 1.5;
    lx.beginPath(); lx.moveTo(cx - r, cy); lx.lineTo(cx + r, cy); lx.moveTo(cx, cy - r); lx.lineTo(cx, cy + r); lx.stroke();
    lx.lineWidth = 2; lx.beginPath(); lx.arc(cx, cy, r, 0, Math.PI * 2); lx.stroke();
    if (variant === 'game') {
      // mil-dots along both lines, as in the game's AWP scope
      lx.fillStyle = '#000';
      const step = r * 0.075;
      for (let i = 1; i <= 6; i++) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { lx.beginPath(); lx.arc(cx + dx * i * step, cy + dy * i * step, 2.6, 0, Math.PI * 2); lx.fill(); }
    }
    // red dot in the middle
    lx.fillStyle = '#ff2a1f'; lx.beginPath(); lx.arc(cx, cy, 2.6, 0, Math.PI * 2); lx.fill();
    lx.restore();
  };
  await w(1500);
  return variant;
})()
