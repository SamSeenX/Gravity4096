const STORAGE_KEY_BEST = 'gravity4096_best';
const STORAGE_KEY_STATE = 'gravity4096_state';

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

  exportBackup() {
    try {
      const data = {
        bestScore: this.getBestScore(),
        timestamp: Date.now()
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gravity4096_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return true;
    } catch {
      return false;
    }
  },

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data.bestScore === 'number') {
        this.setBestScore(data.bestScore);
        return { success: true, bestScore: data.bestScore };
      }
      return { success: false, error: 'Invalid backup format' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
