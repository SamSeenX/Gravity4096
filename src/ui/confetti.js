const COLORS = ['#f9a8d4', '#fde047', '#86efac', '#7dd3fc', '#c084fc', '#fb923c', '#ffffff'];
let animId = null;

export function fireCelebrationConfetti(canvas) {
  if (!canvas) return;
  stopCelebrationConfetti(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = (canvas.width = Math.round(rect.width * dpr));
  const h = (canvas.height = Math.round(rect.height * dpr));

  const particles = [];
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (3 + Math.random() * 8) * dpr;
    particles.push({
      x: w * 0.5,
      y: h * 0.35,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: (3 + Math.random() * 5) * dpr,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      decay: 0.015 + Math.random() * 0.012
    });
  }

  const startTime = performance.now();
  function loop(time) {
    const elapsed = time - startTime;
    ctx.clearRect(0, 0, w, h);
    let active = 0;

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12 * dpr;
      p.vx *= 0.98;
      p.alpha = Math.max(0, p.alpha - p.decay);

      if (p.alpha > 0) {
        active++;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      }
    }

    if (active > 0 && elapsed < 3500) {
      animId = requestAnimationFrame(loop);
    } else {
      stopCelebrationConfetti(canvas);
    }
  }

  animId = requestAnimationFrame(loop);
}

export function stopCelebrationConfetti(canvas) {
  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
