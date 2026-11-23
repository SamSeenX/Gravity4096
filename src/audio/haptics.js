export const haptics = {
  vibrate(pattern) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  },

  tap() {
    this.vibrate(10);
  },

  launch() {
    this.vibrate(18);
  },

  merge() {
    this.vibrate([25, 40, 30]);
  },

  danger() {
    this.vibrate([40, 60, 40]);
  },

  gameOver() {
    this.vibrate([80, 100, 120]);
  }
};
