export class GalaxyCore {
  constructor(x, y, radius = 24) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.rotation = 0;
    this.particles = [];
    this.initParticles();
  }

  initParticles() {
    for (let i = 0; i < 24; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        dist: this.radius * (1.2 + Math.random() * 1.8),
        speed: 0.02 + Math.random() * 0.03,
        size: 1.5 + Math.random() * 2,
        alpha: 0.3 + Math.random() * 0.5
      });
    }
  }

  resize(x, y, scale = 1) {
    this.x = x;
    this.y = y;
    this.radius = 24 * scale;
  }

  update() {
    this.rotation += 0.015;
    for (let p of this.particles) {
      p.angle += p.speed;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Accretion disk ambient glow
    const glowGrad = ctx.createRadialGradient(0, 0, this.radius * 0.5, 0, 0, this.radius * 3.0);
    glowGrad.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
    glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.15)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 3.0, 0, Math.PI * 2);
    ctx.fill();

    // Swirling dust particles
    for (let p of this.particles) {
      const px = Math.cos(p.angle) * p.dist;
      const py = Math.sin(p.angle) * p.dist;
      ctx.fillStyle = `rgba(192, 132, 252, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Event horizon core
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#050508';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#c084fc';
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 14;
    ctx.stroke();

    ctx.restore();
  }
}
