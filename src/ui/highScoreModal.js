import { eventBus } from '../core/eventBus.js';
import { audioManager } from '../audio/sound.js';
import { fireCelebrationConfetti, stopCelebrationConfetti } from './confetti.js';

export class HighScoreModal {
  constructor(container) {
    this.container = container;
    this.modalEl = null;
    this.canvasEl = null;
    this.scoreEl = null;
    this.hasCelebrated = false;
    this.render();
    this.bind();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop hidden';
    this.modalEl.id = 'highScoreModal';
    this.modalEl.innerHTML = `
      <canvas id="highScoreConfettiCanvas" class="confetti-canvas"></canvas>
      <div class="modal-card">
        <div class="modal-emoji">👑</div>
        <h2 class="modal-title">NEW HIGH SCORE!</h2>
        <p class="modal-subtitle">You surpassed your galactic record!</p>
        <div class="stat-box">
          <span class="stat-label">RECORD SCORE</span>
          <span class="stat-value" id="highScoreModalVal">0</span>
        </div>
        <button class="primary-btn" id="highScoreContinueBtn">KEEP GOING 🚀</button>
      </div>
    `;
    this.container.appendChild(this.modalEl);

    this.canvasEl = this.modalEl.querySelector('#highScoreConfettiCanvas');
    this.scoreEl = this.modalEl.querySelector('#highScoreModalVal');
  }

  bind() {
    eventBus.on('score:newRecord', (score) => {
      if (this.hasCelebrated) return;
      this.hasCelebrated = true;

      if (this.scoreEl) this.scoreEl.textContent = score;
      this.modalEl.classList.remove('hidden');
      audioManager.playVictory();
      fireCelebrationConfetti(this.canvasEl);
    });

    eventBus.on('game:reset', () => {
      this.hasCelebrated = false;
    });

    const btn = this.modalEl.querySelector('#highScoreContinueBtn');
    btn?.addEventListener('click', () => {
      this.modalEl.classList.add('hidden');
      stopCelebrationConfetti(this.canvasEl);
    });
  }
}
