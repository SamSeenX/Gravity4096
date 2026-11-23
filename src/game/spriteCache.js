import { TIERS } from '../config/tiers.js';
import { drawAnimeBall } from './animeSprite.js';
import { drawGlossBall } from './glossSprite.js';

class SpriteCache {
  constructor() {
    this.cache = new Map();
  }

  clear() {
    this.cache.clear();
  }

  getSprite(tierIndex, radius) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const key = `${tierIndex}_${Math.round(radius)}_${isDark ? 'dark' : 'pastel'}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const tier = TIERS[tierIndex] || TIERS[0];
    const padding = Math.ceil(radius * 0.45);
    const size = Math.ceil((radius + padding) * 2);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const center = size / 2;

    if (isDark) {
      drawGlossBall(ctx, tier, radius, center);
    } else {
      const glowGrad = ctx.createRadialGradient(center, center, radius * 0.7, center, center, radius + padding);
      glowGrad.addColorStop(0, tier.glow + '44');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(center, center, radius + padding, 0, Math.PI * 2);
      ctx.fill();

      drawAnimeBall(ctx, tier, radius, center);
    }

    const spriteData = { canvas, offset: center };
    this.cache.set(key, spriteData);
    return spriteData;
  }
}

export const spriteCache = new SpriteCache();
