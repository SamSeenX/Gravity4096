import { calculateTrajectory } from './trajectory.js';

export function updateEngineCharge(engine) {
  if (!engine.isAiming || !engine.canShoot || !engine.aimPos) {
    engine.chargeTimer = 0;
    engine.chargeStrength = 0.4;
    return;
  }

  engine.chargeTimer++;
  // Smooth sine wave oscillating between 0.35 and 1.0 (approx 1.2 second full cycle)
  const wave = 0.5 + 0.5 * Math.sin(engine.chargeTimer * 0.08 - Math.PI / 2);
  engine.chargeStrength = 0.35 + 0.65 * wave;

  engine.currentTrajectory = calculateTrajectory({
    originX: engine.originX,
    originY: engine.originY,
    targetX: engine.aimPos.x,
    targetY: engine.aimPos.y,
    centerX: engine.centerX,
    centerY: engine.centerY,
    width: engine.width,
    height: engine.height,
    scale: engine.scale,
    tierIndex: engine.nextTier,
    power: engine.chargeStrength
  });
}
