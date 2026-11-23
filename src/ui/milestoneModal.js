import { eventBus } from '../core/eventBus.js';
import { audioManager } from '../audio/sound.js';
import { fireCelebrationConfetti, stopCelebrationConfetti } from './confetti.js';

export class MilestoneModal {
  constructor(container) {
    this.container = container;
    this.modalEl = null;
    this.canvasEl = null;
    this.titleEl = null;
    this.descEl = null;
    this.celebratedTiers = new Set();
    this.render();
    this.bind();
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-backdrop hidden';
    this.modalEl.id = 'milestoneModal';
    this.modalEl.innerHTML = `
      <canvas id="milestoneConfettiCanvas" class="confetti-canvas"></canvas>
      <div class="modal-card">
        <div class="modal-emoji" id="milestoneEmoji">🎉</div>
        <h2 class="modal-title" id="milestoneTitle">MILESTONE UNLOCKED!</h2>
        <p class="modal-subtitle" id="milestoneDesc">You unlocked a new planetary body!</p>
        <button class="primary-btn" id="milestoneContinueBtn">CONTINUE ORBIT 🚀</button>
      </div>
    `;
    this.container.appendChild(this.modalEl);

    this.canvasEl = this.modalEl.querySelector('#milestoneConfettiCanvas');
    this.titleEl = this.modalEl.querySelector('#milestoneTitle');
    this.descEl = this.modalEl.querySelector('#milestoneDesc');
  }

  bind() {
    eventBus.on('milestone:unlocked', ({ tier, isWin4096 }) => {
      if (this.celebratedTiers.has(tier.value)) return;
      this.celebratedTiers.add(tier.value);

      if (isWin4096) {
        this.titleEl.textContent = 'YOU WON 4096!';
        this.descEl.innerHTML = `Magnificent! You crafted the legendary <strong>${tier.name}</strong>!`;
        audioManager.playVictory();
      } else {
        this.titleEl.textContent = 'MILESTONE UNLOCKED!';
        this.descEl.innerHTML = `You discovered <strong>${tier.name} (${tier.value})</strong>!`;
        audioManager.playMilestone();
      }

      this.modalEl.classList.remove('hidden');
      fireCelebrationConfetti(this.canvasEl);
    });

    const btn = this.modalEl.querySelector('#milestoneContinueBtn');
    btn?.addEventListener('click', () => {
      this.modalEl.classList.add('hidden');
      stopCelebrationConfetti(this.canvasEl);
    });
  }
}
