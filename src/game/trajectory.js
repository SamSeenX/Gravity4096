import { TIERS } from '../config/tiers.js';

const G_CENTER = 0.32;
const SOFT_CENTER = 35;
const SWIRL_DRIFT = 0.035;

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
  const MAX_STEPS = 28;

  for (let i = 0; i < MAX_STEPS; i++) {
    // Center gravity pull in trajectory projection
    const cdx = centerX - simX;
    const cdy = centerY - simY;
    const distSq = cdx * cdx + cdy * cdy;
    const dist = Math.sqrt(distSq);
    const softDist = Math.sqrt(distSq + SOFT_CENTER * SOFT_CENTER * scale * scale);
    const pull = (G_CENTER * scale) / softDist;

    if (dist > 1) {
      simVx += (cdx / dist) * pull;
      simVy += (cdy / dist) * pull;
      simVx += (-cdy / dist) * SWIRL_DRIFT * scale;
      simVy += (cdx / dist) * SWIRL_DRIFT * scale;
    }

    simVx *= 0.992;
    simVy *= 0.992;
    simX += simVx;
    simY += simVy;

    // Wall bounce simulation in trajectory
    if (simX - radius < 0) {
      simX = radius;
      simVx = Math.abs(simVx) * 0.65;
    } else if (simX + radius > width) {
      simX = width - radius;
      simVx = -Math.abs(simVx) * 0.65;
    }
    if (simY - radius < 0) {
      simY = radius;
      simVy = Math.abs(simVy) * 0.65;
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
