export function drawGlossBall(ctx, tier, r, center) {
  ctx.save();

  // 1. Outer soft glow aura
  const padding = Math.max(4, Math.round(r * 0.15));
  const aura = ctx.createRadialGradient(center, center, r * 0.75, center, center, r + padding - 1);
  aura.addColorStop(0, tier.glow);
  aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(center, center, r + padding - 1, 0, Math.PI * 2);
  ctx.fill();

  // 2. Spherical radial gradient body (authentic 3D shiny candy glass sphere)
  const body = ctx.createRadialGradient(
    center - r * 0.25,
    center - r * 0.25,
    Math.max(1, r * 0.05),
    center,
    center,
    r
  );
  body.addColorStop(0, '#ffffff');
  body.addColorStop(0.35, tier.color);
  body.addColorStop(1, tier.glow);
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(center, center, r, 0, Math.PI * 2);
  ctx.fill();

  // 3. Specular glass gloss reflection
  ctx.fillStyle = 'rgba(255, 255, 255, 0.44)';
  ctx.beginPath();
  ctx.arc(center - r * 0.35, center - r * 0.35, r * 0.28, 0, Math.PI * 2);
  ctx.fill();

  // 4. Clean bold typography
  ctx.fillStyle = '#07090e';
  const fontSize = Math.max(9, Math.round(r * 0.46));
  ctx.font = `900 ${fontSize}px "Outfit", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(tier.name, center, center + 1);

  ctx.restore();
}
