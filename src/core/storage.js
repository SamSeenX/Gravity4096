const STORAGE_KEY_BEST = 'gravity4096_best';
const STORAGE_KEY_STATE = 'gravity4096_saved_state';
const STORAGE_KEY_THEME = 'gravity4096_theme';
const STORAGE_KEY_TUTORIAL = 'gravity4096_tutorial';

export const storage = {
  getBestScore() {
    try {
      const val = localStorage.getItem(STORAGE_KEY_BEST);
      return val ? parseInt(val, 10) || 0 : 0;
    } catch {
      return 0;
    }
  },

  setBestScore(score) {
    try {
      localStorage.setItem(STORAGE_KEY_BEST, score.toString());
    } catch {}
  },

  getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY_THEME) || 'pastel';
    } catch {
      return 'pastel';
    }
  },

  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {}
  },

  getTutorialSeen() {
    try {
      return localStorage.getItem(STORAGE_KEY_TUTORIAL) === 'true';
    } catch {
      return false;
    }
  },

  setTutorialSeen() {
    try {
      localStorage.setItem(STORAGE_KEY_TUTORIAL, 'true');
    } catch {}
  },

  getGameState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_STATE);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setGameState(state) {
    try {
      localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
    } catch {}
  },

  clearGameState() {
    try {
      localStorage.removeItem(STORAGE_KEY_STATE);
    } catch {}
  }
};
