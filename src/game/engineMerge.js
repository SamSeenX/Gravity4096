import { TIERS } from '../config/tiers.js';
import { FloatingScore } from './particle.js';
import { saveGameState } from './stateStorage.js';
import { store } from '../core/store.js';
import { eventBus } from '../core/eventBus.js';
import { audioManager } from '../audio/sound.js';

export function handleEngineMerge(engine, tierIndex, x, y) {
  const now = performance.now();
  engine.combo = (now - engine.lastMergeTime < 1500) ? engine.combo + 1 : 1;
  engine.lastMergeTime = now;

  if (engine.combo >= 2) {
    eventBus.emit('combo:updated', engine.combo);
    audioManager.playCombo(engine.combo);
  }

  const baseVal = TIERS[tierIndex].value || 2;
  const points = baseVal * 2 * engine.combo;
  store.addScore(points);
  store.setHighestTier(tierIndex + 1);

  const label = engine.combo > 1 ? `+${points} (${engine.combo}x)` : `+${points}`;
  engine.floatingScores.push(new FloatingScore(x, y, label, TIERS[tierIndex].color, engine.scale));

  if (tierIndex + 1 >= 8 && TIERS[tierIndex + 1]) {
    eventBus.emit('milestone:unlocked', {
      tier: TIERS[tierIndex + 1],
      isWin4096: tierIndex + 1 >= 11
    });
  }

  if (!engine.hasRecordedNewBest && engine.initialBestScore > 0 && store.getState().score > engine.initialBestScore) {
    engine.hasRecordedNewBest = true;
    eventBus.emit('score:newRecord', store.getState().score);
  }

  saveGameState(engine);
}
