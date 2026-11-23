import { TIERS } from '../config/tiers.js';
import { Ball } from './ball.js';
import { Particle, Shockwave } from './particle.js';
import { audioManager } from '../audio/sound.js';
import { haptics } from '../audio/haptics.js';
import { applyGravityForces } from './orbitalGravity.js';

const SOLVER_ITERATIONS = 4;

function detectMerges(balls, scale = 1) {
  const n = balls.length;
  const contactBuffer = 2.0 * scale;
  for (let i = 0; i < n; i++) {
    const b1 = balls[i];
    if (b1.toRemove || b1.isMerging) continue;

    for (let j = i + 1; j < n; j++) {
      const b2 = balls[j];
      if (b2.toRemove || b2.isMerging) continue;
      if (b1.tierIndex !== b2.tierIndex || b1.tierIndex >= TIERS.length - 1) continue;

      const contactDist = b1.radius + b2.radius + contactBuffer;
      const dx = b2.x - b1.x;
      const dy = b2.y - b1.y;

      if (dx * dx + dy * dy <= contactDist * contactDist) {
        const targetX = (b1.x + b2.x) * 0.5;
        const targetY = (b1.y + b2.y) * 0.5;
        const sharedVx = (b1.vx + b2.vx) * 0.45;
        const sharedVy = (b1.vy + b2.vy) * 0.45;
        b1.startMerge(targetX, targetY, b1.tierIndex + 1, true, sharedVx, sharedVy, b2);
        b2.startMerge(targetX, targetY, b1.tierIndex + 1, false, sharedVx, sharedVy, b1);
        break;
      }
    }
  }
}

export function resolveCollisions({ balls, particles, width, height, centerX, centerY, scale = 1, onMerge }) {
  applyGravityForces(balls, centerX, centerY, scale);
  detectMerges(balls, scale);

  const n = balls.length;
  for (let iter = 0; iter < SOLVER_ITERATIONS; iter++) {
    for (let i = 0; i < n; i++) {
      const b1 = balls[i];
      if (b1.toRemove) continue;

      for (let j = i + 1; j < n; j++) {
        const b2 = balls[j];
        if (b2.toRemove || (b1.isMerging && b2.isMerging && b1.mergePartner === b2)) continue;

        const minDist = b1.radius + b2.radius;
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const distSq = dx * dx + dy * dy;

        if (distSq >= minDist * minDist || distSq === 0) continue;

        const dist = Math.sqrt(distSq);
        const overlap = minDist - dist;
        const nx = dx / dist;
        const ny = dy / dist;

        const totalMass = b1.mass + b2.mass;
        const invM1 = b2.mass / totalMass;
        const invM2 = b1.mass / totalMass;

        b1.x -= nx * overlap * invM1 * 0.55;
        b1.y -= ny * overlap * invM1 * 0.55;
        b2.x += nx * overlap * invM2 * 0.55;
        b2.y += ny * overlap * invM2 * 0.55;

        const rvx = b2.vx - b1.vx;
        const rvy = b2.vy - b1.vy;
        const velAlongNormal = rvx * nx + rvy * ny;

        if (velAlongNormal < 0) {
          const restitution = 0.28;
          const impulse = -(1 + restitution) * velAlongNormal / (1 / b1.mass + 1 / b2.mass);
          b1.vx -= (impulse / b1.mass) * nx;
          b1.vy -= (impulse / b1.mass) * ny;
          b2.vx += (impulse / b2.mass) * nx;
          b2.vy += (impulse / b2.mass) * ny;
        }
      }
    }

    // Boundary bounces
    for (let i = 0; i < n; i++) {
      const b = balls[i];
      if (b.toRemove) continue;
      const r = b.radius;
      if (b.x - r < 0) {
        b.x = r;
        b.vx = Math.abs(b.vx) * 0.65;
        audioManager.playBounce();
      } else if (b.x + r > width) {
        b.x = width - r;
        b.vx = -Math.abs(b.vx) * 0.65;
        audioManager.playBounce();
      }
      if (b.y - r < 0) {
        b.y = r;
        b.vy = Math.abs(b.vy) * 0.65;
        audioManager.playBounce();
      } else if (b.y + r > height - 10) {
        b.y = height - 10 - r;
        b.vy = -Math.abs(b.vy) * 0.65;
        audioManager.playBounce();
      }
    }
  }

  detectMerges(balls, scale);

  const newBalls = [];
  for (let i = 0; i < n; i++) {
    const b = balls[i];
    if (b.isMerging && b.toRemove && b.isMergeLeader) {
      const nextTier = b.nextTier;
      const tierConfig = TIERS[nextTier] || TIERS[TIERS.length - 1];
      const ballScale = b.scale || scale;
      const spawnX = b.targetX;
      const spawnY = b.targetY;

      particles.push(new Shockwave(spawnX, spawnY, tierConfig.color, tierConfig.radius * 2.2, ballScale));
      for (let p = 0; p < 16; p++) {
        particles.push(new Particle(spawnX, spawnY, tierConfig.color, ballScale));
      }

      audioManager.playMerge(b.tierIndex);
      haptics.merge();
      if (onMerge) onMerge(b.tierIndex, spawnX, spawnY);

      newBalls.push(new Ball(spawnX, spawnY, nextTier, true, b.vx, b.vy, ballScale));
    }
  }

  return balls.filter(b => !b.toRemove).concat(newBalls);
}
