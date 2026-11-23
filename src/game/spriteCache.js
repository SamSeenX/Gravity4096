import { TIERS } from '../config/tiers.js';

class SpriteCache {
  constructor() {
    this.cache = new Map();
  }

  clear() {
    this.cache.clear();
  }

  getSprite(tierIndex, radius) {
    const key = `${tierIndex}_${Math.round(radius)}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const tier = TIERS[tierIndex] || TIERS[0];
    const padding = Math.ceil(radius * 0.45);
    const size = Math.ceil((radius + padding) * 2);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const center = size / 2;

    // Outer atmospheric glow
    const glowGrad = ctx.createRadialGradient(center, center, radius * 0.7, center, center, radius + padding);
    glowGrad.addColorStop(0, tier.glow);
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(center, center, radius + padding, 0, Math.PI * 2);
    ctx.fill();

    // 3D celestial sphere body
    const sphereGrad = ctx.createRadialGradient(
      center - radius * 0.32,
      center - radius * 0.32,
      radius * 0.1,
      center,
      center,
      radius
    );
    sphereGrad.addColorStop(0, '#ffffff');
    sphereGrad.addColorStop(0.2, tier.color);
    sphereGrad.addColorStop(0.85, this.darkenColor(tier.color, 0.4));
    sphereGrad.addColorStop(1, '#0a0a14');

    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle edge rim light
    ctx.lineWidth = Math.max(1.2, radius * 0.05);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.stroke();

    // Value text
    ctx.font = `bold ${Math.round(radius * 0.62)}px "Outfit", system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 4;
    ctx.fillText(tier.value.toString(), center, center);

    const spriteData = { canvas, offset: center };
    this.cache.set(key, spriteData);
    return spriteData;
  }

  darkenColor(hex, factor = 0.5) {
    if (!hex.startsWith('#')) return hex;
    const c = hex.slice(1);
    const num = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
    const r = Math.floor(((num >> 16) & 255) * factor);
    const g = Math.floor(((num >> 8) & 255) * factor);
    const b = Math.floor((num & 255) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export const spriteCache = new SpriteCache();
