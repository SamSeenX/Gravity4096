import { storage } from '../core/storage.js';

export class TutorialController {
  constructor(container) {
    this.container = container;
    this.handEl = null;
    this.isRunning = false;
    this.animId = null;
    this.render();
    this.bind();
  }

  render() {
    if (storage.getTutorialSeen()) return;

    this.handEl = document.createElement('div');
    this.handEl.className = 'phantom-tutorial';
    this.handEl.id = 'phantomTutorial';
    this.handEl.innerHTML = `
      <div class="phantom-hand">👆</div>
      <div class="phantom-badge">Hold to Charge • Release to Shoot</div>
    `;
    this.container.appendChild(this.handEl);
    this.isRunning = true;
  }

  bind() {
    const dismiss = () => {
      if (!this.isRunning) return;
      this.dismiss();
    };

    window.addEventListener('pointerdown', dismiss, { once: true });
    window.addEventListener('touchstart', dismiss, { once: true });
  }

  dismiss() {
    this.isRunning = false;
    storage.setTutorialSeen();
    if (this.handEl) {
      this.handEl.classList.add('fade-out');
      setTimeout(() => this.handEl?.remove(), 300);
    }
  }
}
