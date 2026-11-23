import { store } from '../core/store.js';
import { audioManager } from '../audio/sound.js';
import { haptics } from '../audio/haptics.js';

export function getRandomSpawnTier(highestTier = 0) {
  const maxPool = Math.min(3, Math.floor(highestTier / 3));
  return Math.floor(Math.random() * (maxPool + 2));
}

export function checkDangerLimit(balls, centerX, centerY, maxRadius, originX, originY, launcherRadius = 32) {
  if (balls.length < 4) {
    return { isOverflowing: false, isMuzzleBlocked: false };
  }

  for (let i = 0; i < balls.length; i++) {
    const b = balls[i];
    if (b.toRemove || b.isMerging) continue;

    const speed = Math.hypot(b.vx, b.vy);
    const distToLauncher = Math.hypot(b.x - originX, b.y - originY);
    if (b.age > 90 && speed < 1.2 && distToLauncher < b.radius + launcherRadius) {
      return { isOverflowing: true, isMuzzleBlocked: true };
    }

    const distToCenter = Math.hypot(b.x - centerX, b.y - centerY);
    if (b.age > 100 && speed < 1.8 && distToCenter + b.radius > maxRadius) {
      return { isOverflowing: true, isMuzzleBlocked: false };
    }
  }

  return { isOverflowing: false, isMuzzleBlocked: false };
}

export function updateDangerStatus(engine) {
  const { isOverflowing } = checkDangerLimit(
    engine.balls,
    engine.centerX,
    engine.centerY,
    engine.maxOrbitRadius,
    engine.originX,
    engine.originY
  );

  engine.isWarning = isOverflowing;
  if (isOverflowing) {
    engine.dangerTimer++;
    if (engine.dangerTimer % 30 === 0) haptics.danger();
    if (engine.dangerTimer > 180) {
      store.setGameOver(true);
      audioManager.playGameOver();
      haptics.gameOver();
    }
  } else {
    engine.dangerTimer = Math.max(0, engine.dangerTimer - 2);
  }
}
