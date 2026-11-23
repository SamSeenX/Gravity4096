export class Particle {
  constructor(x, y, color, scale = 1) {
    this.x = x;
    this.y = y;
    this.color = color;
    const speed = (2 + Math.random() * 5) * scale;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = (2.5 + Math.random() * 3.5) * scale;
    this.alpha = 1;
    this.decay = 0.025 + Math.random() * 0.02;
    this.toRemove = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.94;
    this.vy *= 0.94;
    this.alpha -= this.decay;
    if (this.alpha <= 0) this.toRemove = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class Shockwave {
  constructor(x, y, color, maxRadius, scale = 1) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = 10 * scale;
    this.maxRadius = maxRadius;
    this.alpha = 0.8;
    this.toRemove = false;
  }

  update() {
    this.radius += (this.maxRadius - this.radius) * 0.2 + 2;
    this.alpha *= 0.88;
    if (this.alpha <= 0.04 || this.radius >= this.maxRadius) {
      this.toRemove = true;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

export class FloatingScore {
  constructor(x, y, text, color = '#fbbf24', scale = 1) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.alpha = 1;
    this.vy = -1.8 * scale;
    this.toRemove = false;
  }

  update() {
    this.y += this.vy;
    this.vy *= 0.96;
    this.alpha -= 0.022;
    if (this.alpha <= 0) this.toRemove = true;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.font = 'bold 18px "Outfit", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = this.color;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
