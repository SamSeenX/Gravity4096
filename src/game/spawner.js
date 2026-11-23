export function getRandomSpawnTier(highestTier = 0) {
  // Spawns from 2 to 16, gradually introducing 32 as highest tier advances
  const maxPool = Math.min(3, Math.floor(highestTier / 3));
  return Math.floor(Math.random() * (maxPool + 2));
}

export function checkDangerLimit(balls, centerX, centerY, maxRadius, originX, originY, launcherRadius = 30) {
  let isOverflowing = false;
  let isMuzzleBlocked = false;

  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    if (b.toRemove || b.isMerging) continue;

    // Check launcher clearance
    const distToLauncher = Math.hypot(b.x - originX, b.y - originY);
    if (b.age > 45 && distToLauncher < b.radius + launcherRadius) {
      isMuzzleBlocked = true;
      isOverflowing = true;
      break;
    }

    // Check outer perimeter danger limit
    const distToCenter = Math.hypot(b.x - centerX, b.y - centerY);
    if (b.age > 60 && distToCenter + b.radius > maxRadius) {
      isOverflowing = true;
      break;
    }
  }

  return { isOverflowing, isMuzzleBlocked };
}
