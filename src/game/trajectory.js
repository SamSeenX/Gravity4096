import { TIERS } from '../config/tiers.js';

const G_CENTER = 36.0;
const SOFT_CENTER = 30;
const LAUNCH_SPEED = 9.5;

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

  if (dy > -15 * scale) dy = -15 * scale;

  const len = Math.hypot(dx, dy) || 1;
  const dirX = dx / len;
  const dirY = dy / len;

  const speed = LAUNCH_SPEED * scale;
  let simVx = dirX * speed;
  let simVy = dirY * speed;
  let simX = originX;
  let simY = originY;

  const tier = TIERS[tierIndex] || TIERS[0];
  const radius = tier.radius * scale;
  const points = [{ x: simX, y: simY }];
  const MAX_STEPS = 36;
  const coreRepelDist = 26 * scale;
  const clusterZone = 180 * scale;

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

      if (dist < clusterZone) {
        simVx += -ny * 0.018 * scale;
        simVy += nx * 0.018 * scale;
      }

      if (dist < coreRepelDist) {
        const repel = (1 - dist / coreRepelDist) * 0.55 * scale;
        simVx -= nx * repel;
        simVy -= ny * repel;
      }
    }

    const currentDrag = dist < clusterZone ? 0.945 : 0.985;
    simVx *= currentDrag;
    simVy *= currentDrag;
    simX += simVx;
    simY += simVy;

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
