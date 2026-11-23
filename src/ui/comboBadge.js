import { eventBus } from '../core/eventBus.js';

export class ComboBadge {
  constructor(container) {
    this.container = container;
    this.badgeEl = null;
    this.timer = null;
    this.render();
    this.bind();
  }

  render() {
    this.badgeEl = document.createElement('div');
    this.badgeEl.className = 'combo-badge hidden';
    this.badgeEl.id = 'comboBadge';
    this.badgeEl.innerHTML = `<span class="combo-text">2x COMBO!</span>`;
    this.container.appendChild(this.badgeEl);
  }

  bind() {
    eventBus.on('combo:updated', (combo) => {
      if (combo >= 2) {
        this.show(combo);
      } else {
        this.hide();
      }
    });
  }

  show(combo) {
    if (!this.badgeEl) return;
    if (this.timer) clearTimeout(this.timer);

    this.badgeEl.innerHTML = `<span class="combo-text">${combo}x COMBO! 🔥</span>`;
    this.badgeEl.classList.remove('hidden');
    this.badgeEl.classList.add('combo-pop');

    this.timer = setTimeout(() => {
      this.hide();
    }, 1400);
  }

  hide() {
    if (this.badgeEl) {
      this.badgeEl.classList.add('hidden');
      this.badgeEl.classList.remove('combo-pop');
    }
  }
}
