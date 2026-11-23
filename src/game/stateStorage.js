import { storage } from '../core/storage.js';
import { Ball } from './ball.js';
import { store } from '../core/store.js';

export function saveGameState(engine) {
  if (store.getState().isGameOver) return;
  if (!engine.balls || engine.balls.length === 0) {
    storage.clearGameState();
    return;
  }

  const serializedBalls = engine.balls
    .filter(b => !b.toRemove && !b.isMerging)
    .map(b => ({
      x: b.x,
      y: b.y,
      tierIndex: b.tierIndex,
      vx: Math.abs(b.vx) > 0.05 ? b.vx : 0,
      vy: Math.abs(b.vy) > 0.05 ? b.vy : 0
    }));

  storage.setGameState({
    score: store.getState().score,
    highestTier: store.getState().highestTier,
    nextTier: engine.nextTier,
    balls: serializedBalls,
    timestamp: Date.now()
  });
}

export function restoreGameState(engine) {
  const saved = storage.getGameState();
  if (!saved || !saved.balls || saved.balls.length === 0) return false;

  engine.balls = saved.balls.map(d =>
    new Ball(d.x, d.y, d.tierIndex, false, d.vx || 0, d.vy || 0, engine.scale)
  );
  engine.nextTier = saved.nextTier ?? 0;
  store.setScore(saved.score || 0);
  store.setHighestTier(saved.highestTier || 0);
  return true;
}

export function clearSavedGameState() {
  storage.clearGameState();
}
