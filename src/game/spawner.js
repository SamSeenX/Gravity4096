export function getRandomSpawnTier(highestTier = 0) {
  const maxPool = Math.min(3, Math.floor(highestTier / 3));
  return Math.floor(Math.random() * (maxPool + 2));
}

export function checkDangerLimit(balls, centerX, centerY, maxRadius, originX, originY, launcherRadius = 32) {
  let isOverflowing = false;
  let isMuzzleBlocked = false;

  // Never trigger game over when the board has only a few balls
  if (balls.length < 4) {
    return { isOverflowing: false, isMuzzleBlocked: false };
  }

  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    if (b.toRemove || b.isMerging) continue;

    const speed = Math.hypot(b.vx, b.vy);

    // Muzzle blockage check: only counts if a slow or stopped ball sits on the launcher
    const distToLauncher = Math.hypot(b.x - originX, b.y - originY);
    if (b.age > 90 && speed < 1.2 && distToLauncher < b.radius + launcherRadius) {
      isMuzzleBlocked = true;
      isOverflowing = true;
      break;
    }

    // Outer perimeter check: only counts settled balls pushed outside safe orbit
    const distToCenter = Math.hypot(b.x - centerX, b.y - centerY);
    if (b.age > 100 && speed < 1.8 && distToCenter + b.radius > maxRadius) {
      isOverflowing = true;
      break;
    }
  }

  return { isOverflowing, isMuzzleBlocked };
}
