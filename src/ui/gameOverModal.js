import { store } from '../core/store.js';
import { eventBus } from '../core/eventBus.js';

export class GameOverModal {
  constructor(container, onReplay) {
    this.container = container;
    this.onReplay = onReplay;
    this.modalEl = null;
    this.scoreValEl = null;
    this.bestValEl = null;
    this.render();
    this.bind();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop hidden';
    this.modalEl.id = 'gameOverModal';
    this.modalEl.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">ORBIT COLLAPSED</h2>
        <p class="modal-subtitle">Celestial cluster overflowed outer perimeter</p>
        <div class="modal-stats">
          <div class="stat-box">
            <span class="stat-label">FINAL SCORE</span>
            <span class="stat-value" id="modalFinalScore">0</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">RECORD</span>
            <span class="stat-value" id="modalRecordScore">0</span>
          </div>
        </div>
        <button class="primary-btn" id="modalReplayBtn">LAUNCH AGAIN 🚀</button>
      </div>
    `;
    this.container.appendChild(this.modalEl);

    this.scoreValEl = this.modalEl.querySelector('#modalFinalScore');
    this.bestValEl = this.modalEl.querySelector('#modalRecordScore');
  }

  bind() {
    eventBus.on('game:over', (isOver) => {
      if (isOver) {
        const state = store.getState();
        if (this.scoreValEl) this.scoreValEl.textContent = state.score;
        if (this.bestValEl) this.bestValEl.textContent = state.bestScore;
        this.modalEl.classList.remove('hidden');
      } else {
        this.modalEl.classList.add('hidden');
      }
    });

    const replayBtn = this.modalEl.querySelector('#modalReplayBtn');
    replayBtn?.addEventListener('click', () => {
      this.modalEl.classList.add('hidden');
      if (this.onReplay) this.onReplay();
    });
  }
}
