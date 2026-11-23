const G_CENTER = 0.32;
const SOFT_CENTER = 35;
const SWIRL_DRIFT = 0.035;
const G_MUTUAL = 0.045;
const SOFT_MUTUAL = 28;
const DRAG = 0.992;
const MAX_VELOCITY = 14;

export function applyGravityForces(balls, centerX, centerY, scale = 1) {
  const n = balls.length;
  for (let i = 0; i < n; i++) {
    const b = balls[i];
    if (b.toRemove || b.isMerging) continue;

    // Central galaxy gravity with Plummer softening
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

      // Tangential galaxy swirl
      b.vx += -ny * SWIRL_DRIFT * scale;
      b.vy += nx * SWIRL_DRIFT * scale;
    }

    // Mutual soft gravity between celestial bodies
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

    // Atmospheric orbit drag and velocity clamping
    b.vx *= DRAG;
    b.vy *= DRAG;
    const speed = Math.hypot(b.vx, b.vy);
    if (speed > MAX_VELOCITY * scale) {
      b.vx = (b.vx / speed) * MAX_VELOCITY * scale;
      b.vy = (b.vy / speed) * MAX_VELOCITY * scale;
    }
  }
}
