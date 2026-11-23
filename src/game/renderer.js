export class Renderer {
  constructor(ctx) {
    this.ctx = ctx;
    this.stars = [];
  }

  initStars(width, height) {
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.6
      });
    }
  }

  drawBackground(width, height, centerX, centerY, maxRadius, isWarning = false) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, width, height);

    const bgGrad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, width * 0.8);
    bgGrad.addColorStop(0, '#0f0c29');
    bgGrad.addColorStop(0.5, '#0d0d1e');
    bgGrad.addColorStop(1, '#05050a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    for (let star of this.stars) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.setLineDash([8, 10]);
    ctx.lineWidth = isWarning ? 2.5 : 1.2;
    ctx.strokeStyle = isWarning ? 'rgba(239, 68, 68, 0.75)' : 'rgba(99, 102, 241, 0.22)';
    if (isWarning) {
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
    }
    ctx.stroke();
    ctx.restore();
  }

  drawTrajectory(trajectory, color = '#a855f7') {
    if (!trajectory || !trajectory.points || trajectory.points.length < 2) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.2;
    ctx.setLineDash([6, 7]);

    ctx.beginPath();
    ctx.moveTo(trajectory.points[0].x, trajectory.points[0].y);
    for (let i = 1; i < trajectory.points.length; i++) {
      ctx.lineTo(trajectory.points[i].x, trajectory.points[i].y);
    }
    ctx.stroke();

    const last = trajectory.points[trajectory.points.length - 1];
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(last.x, last.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawLauncher(originX, originY, nextSprite, chargeStrength = 0.5, isAiming = false) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(originX, originY);

    const gaugeRadius = 36;

    // Static muzzle ring
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 30, Math.PI, 0);
    ctx.stroke();

    // Oscillating strength meter gauge
    if (isAiming) {
      // Gauge background track
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, gaugeRadius, Math.PI, 0);
      ctx.stroke();

      // Gauge active power arc
      const powerColor = chargeStrength > 0.82 ? '#f472b6' : (chargeStrength > 0.58 ? '#fef08a' : '#86efac');
      ctx.strokeStyle = powerColor;
      ctx.lineWidth = 5.5;
      ctx.shadowColor = powerColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(0, 0, gaugeRadius, Math.PI, Math.PI + chargeStrength * Math.PI);
      ctx.stroke();

      // Power percentage readout
      ctx.shadowBlur = 0;
      ctx.font = '700 11px "Outfit", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = powerColor;
      ctx.fillText(`${Math.round(chargeStrength * 100)}%`, 0, 22);
    }

    if (nextSprite) {
      ctx.drawImage(nextSprite.canvas, -nextSprite.offset, -nextSprite.offset);
    }
    ctx.restore();
  }
}
