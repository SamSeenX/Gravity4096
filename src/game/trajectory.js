import { TIERS } from '../config/tiers.js';

const G_CENTER = 38.0;
const SOFT_CENTER = 35;
const SWIRL_DRIFT = 0.08;

export function calculateTrajectory({
  originX,
  originY,
  targetX,
  targetY,
  centerX,
  centerY,
  width,
  height,
  scale = 1,
  tierIndex = 0
}) {
  let dx = targetX - originX;
  let dy = targetY - originY;

  // Enforce upward launch angle from bottom
  if (dy > -15 * scale) dy = -15 * scale;

  const len = Math.hypot(dx, dy) || 1;
  const dirX = dx / len;
  const dirY = dy / len;

  const launchSpeed = 13.5 * scale;
  let simVx = dirX * launchSpeed;
  let simVy = dirY * launchSpeed;
  let simX = originX;
  let simY = originY;

  const tier = TIERS[tierIndex] || TIERS[0];
  const radius = tier.radius * scale;
  const points = [{ x: simX, y: simY }];
  const MAX_STEPS = 42;
  const coreRepelDist = 34 * scale;

  for (let i = 0; i < MAX_STEPS; i++) {
    const cdx = centerX - simX;
    const cdy = centerY - simY;
    const distSq = cdx * cdx + cdy * cdy;
    const dist = Math.sqrt(distSq);
    const softDist = Math.sqrt(distSq + SOFT_CENTER * SOFT_CENTER * scale * scale);
    const pull = (G_CENTER * scale) / softDist;

    if (dist > 1) {
      const nx = cdx / dist;
      const ny = cdy / dist;
      simVx += nx * pull;
      simVy += ny * pull;
      simVx += -ny * SWIRL_DRIFT * scale;
      simVy += nx * SWIRL_DRIFT * scale;

      if (dist < coreRepelDist) {
        const repelForce = (1 - dist / coreRepelDist) * 0.45 * scale;
        simVx -= nx * repelForce;
        simVy -= ny * repelForce;
      }
    }

    simVx *= 0.992;
    simVy *= 0.992;
    simX += simVx;
    simY += simVy;

    // Wall bounce simulation matching physics
    if (simX - radius < 0) {
      simX = radius;
      simVx = Math.abs(simVx) * 0.35;
      simVy *= 0.85;
    } else if (simX + radius > width) {
      simX = width - radius;
      simVx = -Math.abs(simVx) * 0.35;
      simVy *= 0.85;
    }
    if (simY - radius < 0) {
      simY = radius;
      simVy = Math.abs(simVy) * 0.35;
      simVx *= 0.85;
    }

    points.push({ x: simX, y: simY });
  }

  return {
    startX: originX,
    startY: originY,
    endX: points[points.length - 1].x,
    endY: points[points.length - 1].y,
    points,
    launchDir: { x: dirX, y: dirY }
  };
}
