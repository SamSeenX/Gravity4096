import { eventBus } from './eventBus.js';
import { storage } from './storage.js';

class Store {
  constructor() {
    this.state = {
      score: 0,
      bestScore: storage.getBestScore(),
      highestTier: 0,
      isGameOver: false,
      isPaused: false,
      combo: 0
    };
  }

  getState() {
    return this.state;
  }

  setScore(newScore) {
    this.state.score = newScore;
    if (newScore > this.state.bestScore) {
      this.state.bestScore = newScore;
      storage.setBestScore(newScore);
    }
    eventBus.emit('score:updated', {
      score: this.state.score,
      bestScore: this.state.bestScore
    });
  }

  addScore(points) {
    this.setScore(this.state.score + points);
  }

  setCombo(combo) {
    this.state.combo = combo;
    eventBus.emit('combo:updated', combo);
  }

  setHighestTier(tier) {
    if (tier > this.state.highestTier) {
      this.state.highestTier = tier;
      eventBus.emit('tier:unlocked', tier);
    }
  }

  setGameOver(isGameOver) {
    this.state.isGameOver = isGameOver;
    eventBus.emit('game:over', isGameOver);
  }

  reset() {
    this.state.score = 0;
    this.state.highestTier = 0;
    this.state.isGameOver = false;
    this.state.combo = 0;
    eventBus.emit('game:reset');
    eventBus.emit('score:updated', {
      score: 0,
      bestScore: this.state.bestScore
    });
  }
}

export const store = new Store();
