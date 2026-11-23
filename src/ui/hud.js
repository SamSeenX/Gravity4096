import { store } from '../core/store.js';
import { eventBus } from '../core/eventBus.js';
import { audioManager } from '../audio/sound.js';
import { themeManager } from '../core/themeManager.js';

export class HUD {
  constructor(container, { onReset, onTogglePause }) {
    this.container = container;
    this.onReset = onReset;
    this.onTogglePause = onTogglePause;
    this.scoreEl = null;
    this.bestEl = null;
    this.muteBtn = null;
    this.pauseBtn = null;
    this.themeBtn = null;
    this.render();
    this.bind();
  }

  render() {
    this.container.innerHTML = `
      <header class="game-hud">
        <div class="hud-left">
          <div class="hud-pill score-pill">
            <span class="hud-label">SCORE</span>
            <span class="hud-value" id="hudScore">0</span>
          </div>
          <div class="hud-pill best-pill">
            <span class="hud-label">BEST</span>
            <span class="hud-value" id="hudBest">${store.getState().bestScore}</span>
          </div>
        </div>
        <div class="hud-right">
          <button class="icon-btn" id="hudThemeBtn" aria-label="Toggle Theme" title="Theme">
            ${themeManager.getThemeIcon()}
          </button>
          <button class="icon-btn" id="hudMuteBtn" aria-label="Toggle Sound" title="Sound">
            🔊
          </button>
          <button class="icon-btn" id="hudPauseBtn" aria-label="Pause Game" title="Pause">
            ⏸️
          </button>
          <button class="icon-btn" id="hudResetBtn" aria-label="Restart Game" title="Restart">
            🔄
          </button>
        </div>
      </header>
    `;

    this.scoreEl = this.container.querySelector('#hudScore');
    this.bestEl = this.container.querySelector('#hudBest');
    this.muteBtn = this.container.querySelector('#hudMuteBtn');
    this.pauseBtn = this.container.querySelector('#hudPauseBtn');
    this.themeBtn = this.container.querySelector('#hudThemeBtn');
  }

  bind() {
    eventBus.on('score:updated', ({ score, bestScore }) => {
      if (this.scoreEl) this.scoreEl.textContent = score;
      if (this.bestEl) this.bestEl.textContent = bestScore;
    });

    eventBus.on('theme:changed', ({ icon }) => {
      if (this.themeBtn) this.themeBtn.textContent = icon;
    });

    this.themeBtn?.addEventListener('click', () => {
      themeManager.toggleTheme();
    });

    this.resetBtn = this.container.querySelector('#hudResetBtn');
    this.resetBtn?.addEventListener('click', () => {
      if (this.onReset) this.onReset();
    });

    this.muteBtn?.addEventListener('click', () => {
      const isMuted = audioManager.toggleMute();
      this.muteBtn.textContent = isMuted ? '🔇' : '🔊';
    });

    this.pauseBtn?.addEventListener('click', () => {
      if (this.onTogglePause) {
        const isPaused = this.onTogglePause();
        this.pauseBtn.textContent = isPaused ? '▶️' : '⏸️';
      }
    });
  }
}
