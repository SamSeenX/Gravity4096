export function drawGlossBall(ctx, tier, r, center) {
  ctx.save();

  // 1. Outer Dark Neon Glow
  const glow = ctx.createRadialGradient(center, center, r * 0.7, center, center, r * 1.3);
  glow.addColorStop(0, tier.glow + '55');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(center, center, r * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // 2. 3D Spherical Radial Body
  const sphere = ctx.createRadialGradient(
    center - r * 0.35,
    center - r * 0.35,
    r * 0.08,
    center,
    center,
    r
  );
  sphere.addColorStop(0, '#ffffff');
  sphere.addColorStop(0.2, tier.color);
  sphere.addColorStop(0.85, '#0d0d1e');
  sphere.addColorStop(1, '#050508');

  ctx.fillStyle = sphere;
  ctx.beginPath();
  ctx.arc(center, center, r, 0, Math.PI * 2);
  ctx.fill();

  // 3. Crisp Metallic Edge Light
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = Math.max(1.5, r * 0.07);
  ctx.stroke();

  // 4. Modern Cyber Typography
  const fontSize = Math.max(10, Math.round(r * 0.46));
  ctx.font = `800 ${fontSize}px "Outfit", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = tier.glow;
  ctx.shadowBlur = 6;
  ctx.fillText(tier.name, center, center);

  ctx.restore();
}
