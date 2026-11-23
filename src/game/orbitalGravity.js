const G_CENTER = 21.0;
const SOFT_CENTER = 40;
const G_MUTUAL = 0.08;
const SOFT_MUTUAL = 26;
const MAX_VELOCITY = 16.5;

export function applyGravityForces(balls, centerX, centerY, scale = 1) {
  const n = balls.length;
  const coreRepelDist = 28 * scale;
  const clusterZone = 180 * scale;

  for (let i = 0; i < n; i++) {
    const b = balls[i];
    if (b.toRemove || b.isMerging) continue;

    const dx = centerX - b.x;
    const dy = centerY - b.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);
    const softDist = Math.sqrt(distSq + SOFT_CENTER * SOFT_CENTER * scale * scale);
    const pull = (G_CENTER * scale) / softDist;

    if (dist > 1) {
      const nx = dx / dist;
      const ny = dy / dist;
      b.vx += nx * pull;
      b.vy += ny * pull;

      // Gentle orbital drift
      if (dist < clusterZone) {
        b.vx += -ny * 0.015 * scale;
        b.vy += nx * 0.015 * scale;
      }

      // Soft core buffer
      if (dist < coreRepelDist) {
        const repel = (1 - dist / coreRepelDist) * 0.45 * scale;
        b.vx -= nx * repel;
        b.vy -= ny * repel;
      }
    }

    // Mutual gravitational attraction pulling bodies into a cluster
    for (let j = i + 1; j < n; j++) {
      const b2 = balls[j];
      if (b2.toRemove || b2.isMerging) continue;

      const mdx = b2.x - b.x;
      const mdy = b2.y - b.y;
      const mDistSq = mdx * mdx + mdy * mdy;
      const mDist = Math.sqrt(mDistSq);
      if (mDist < 1) continue;

      const mSoft = Math.sqrt(mDistSq + SOFT_MUTUAL * SOFT_MUTUAL * scale * scale);
      const mPull = (G_MUTUAL * scale) / mSoft;

      const mnx = mdx / mDist;
      const mny = mdy / mDist;

      b.vx += mnx * mPull * (b2.mass / 2);
      b.vy += mny * mPull * (b2.mass / 2);
      b2.vx -= mnx * mPull * (b.mass / 2);
      b2.vy -= mny * mPull * (b.mass / 2);
    }

    // Launch transit grace period: preserve initial momentum across the screen
    const isTransit = b.age < 26;
    const currentDrag = (dist < clusterZone && !isTransit) ? 0.948 : 0.985;
    b.vx *= currentDrag;
    b.vy *= currentDrag;

    // Settle resting bodies after transit phase
    const speed = Math.hypot(b.vx, b.vy);
    if (!isTransit && dist < 120 * scale && speed < 0.35 * scale) {
      b.vx *= 0.88;
      b.vy *= 0.88;
    }

    if (speed > MAX_VELOCITY * scale) {
      b.vx = (b.vx / speed) * MAX_VELOCITY * scale;
      b.vy = (b.vy / speed) * MAX_VELOCITY * scale;
    }
  }
}
