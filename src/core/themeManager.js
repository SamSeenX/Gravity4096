import { storage } from './storage.js';
import { eventBus } from './eventBus.js';
import { TIERS } from '../config/tiers.js';
import { applyThemeToTiers } from '../config/tierThemes.js';
import { spriteCache } from '../game/spriteCache.js';

class ThemeManager {
  constructor() {
    this.currentTheme = storage.getTheme?.() || 'pastel';
  }

  init() {
    this.applyTheme(this.currentTheme, false);
  }

  getTheme() {
    return this.currentTheme;
  }

  getThemeIcon() {
    return this.currentTheme === 'dark' ? '🌸' : '⚡';
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'dark' ? 'pastel' : 'dark';
    this.applyTheme(nextTheme, true);
    return nextTheme;
  }

  applyTheme(theme, save = true) {
    this.currentTheme = theme;
    if (save && storage.setTheme) {
      storage.setTheme(theme);
    }

    document.documentElement.setAttribute('data-theme', theme);
    applyThemeToTiers(TIERS, theme);
    spriteCache.clear();

    eventBus.emit('theme:changed', {
      theme: this.currentTheme,
      icon: this.getThemeIcon()
    });
  }
}

export const themeManager = new ThemeManager();
