import { Ball } from './ball.js';
import { getRandomSpawnTier } from './spawner.js';
import { saveGameState } from './stateStorage.js';
import { store } from '../core/store.js';
import { audioManager } from '../audio/sound.js';
import { haptics } from '../audio/haptics.js';

export function executeShoot(engine) {
  if (!engine.canShoot || !engine.currentTrajectory || store.getState().isGameOver || engine.isPaused) {
    engine.isAiming = false;
    engine.chargeTimer = 0;
    return;
  }

  engine.canShoot = false;
  engine.isAiming = false;
  const launchSpeed = (4.8 + engine.chargeStrength * 8.4) * engine.scale;
  const vx = engine.currentTrajectory.launchDir.x * launchSpeed;
  const vy = engine.currentTrajectory.launchDir.y * launchSpeed;

  engine.balls.push(new Ball(engine.originX, engine.originY, engine.nextTier, false, vx, vy, engine.scale));
  audioManager.playLaunch();
  haptics.launch();

  engine.nextTier = getRandomSpawnTier(store.getState().highestTier);
  engine.currentTrajectory = null;
  engine.chargeTimer = 0;
  saveGameState(engine);

  setTimeout(() => {
    engine.canShoot = true;
  }, 450);
}
