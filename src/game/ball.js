import { TIERS } from '../config/tiers.js';
import { spriteCache } from './spriteCache.js';
import { updateMergeAnimation } from './ballMerge.js';

export class Ball {
  constructor(x, y, tierIndex, isSpawning = false, initialVx = 0, initialVy = 0, scale = 1) {
    this.x = x;
    this.y = y;
    this.tierIndex = tierIndex;
    this.scale = scale;
    const t = TIERS[tierIndex] || TIERS[0];
    this.radius = t.radius * scale;
    this.mass = t.mass;
    this.vx = initialVx;
    this.vy = initialVy;
    this.scaleX = isSpawning ? 1.3 : 1.0;
    this.scaleY = isSpawning ? 0.7 : 1.0;
    this.rotation = Math.random() * Math.PI * 2;
    this.angularVelocity = (Math.random() - 0.5) * 0.04;
    this.age = 0;
    this.toRemove = false;

    this.isMerging = false;
    this.isMergeLeader = false;
    this.mergePartner = null;
    this.mergeFrame = 0;
    this.targetX = x;
    this.targetY = y;
    this.nextTier = tierIndex;
    this.alpha = 1;
  }

  startMerge(targetX, targetY, nextTier, isLeader, sharedVx = 0, sharedVy = 0, partner = null) {
    this.isMerging = true;
    this.isMergeLeader = isLeader;
    this.mergePartner = partner;
    this.targetX = targetX;
    this.targetY = targetY;
    this.nextTier = nextTier;
    this.vx = sharedVx;
    this.vy = sharedVy;
    this.mergeFrame = 0;
  }

  update(width, height) {
    if (this.isMerging) {
      updateMergeAnimation(this, width, height);
      return;
    }

    this.age++;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.angularVelocity;

    this.scaleX += (1 - this.scaleX) * 0.12;
    this.scaleY += (1 - this.scaleY) * 0.12;
    if (Math.abs(1 - this.scaleX) < 0.005) this.scaleX = 1;
    if (Math.abs(1 - this.scaleY) < 0.005) this.scaleY = 1;
  }

  draw(ctx) {
    const sprite = spriteCache.getSprite(this.tierIndex, this.radius);
    if (!sprite) return;

    ctx.save();
    if (this.alpha < 1) ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.drawImage(sprite.canvas, -sprite.offset, -sprite.offset);
    ctx.restore();
  }
}
