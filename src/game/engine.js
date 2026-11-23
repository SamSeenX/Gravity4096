import { Ball } from './ball.js';
import { GalaxyCore } from './galaxyCore.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { FloatingScore } from './particle.js';
import { resolveCollisions } from './orbitalPhysics.js';
import { updateEngineCharge } from './engineCharge.js';
import { getRandomSpawnTier, updateDangerStatus } from './spawner.js';
import { spriteCache } from './spriteCache.js';
import { calculateEngineLayout } from './engineLayout.js';
import { TIERS } from '../config/tiers.js';
import { store } from '../core/store.js';
import { audioManager } from '../audio/sound.js';
import { haptics } from '../audio/haptics.js';

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.renderer = new Renderer(this.ctx);
    this.balls = [];
    this.particles = [];
    this.floatingScores = [];
    this.galaxyCore = new GalaxyCore(200, 270);
    this.nextTier = 0;
    this.currentTrajectory = null;
    this.dangerTimer = 0;
    this.isWarning = false;
    this.canShoot = true;

    this.isAiming = false;
    this.aimPos = null;
    this.chargeTimer = 0;
    this.chargeStrength = 0.5;

    this.initLayout();
    this.initInput();
    this.startLoop();
  }

  initLayout() {
    const layout = calculateEngineLayout(this.canvas);
    Object.assign(this, layout);
    this.galaxyCore.resize(this.centerX, this.centerY, this.scale);
    this.renderer.initStars(this.width, this.height);
    this.nextTier = getRandomSpawnTier(store.getState().highestTier);
  }

  initInput() {
    new InputHandler({
      canvas: this.canvas,
      onAim: (x, y) => this.handleAim(x, y),
      onShoot: () => this.handleShoot()
    });
  }

  handleAim(x, y) {
    if (!this.canShoot || store.getState().isGameOver) return;
    this.isAiming = true;
    this.aimPos = { x, y };
  }

  handleShoot() {
    if (!this.canShoot || !this.currentTrajectory || store.getState().isGameOver) {
      this.isAiming = false;
      this.chargeTimer = 0;
      return;
    }

    this.canShoot = false;
    this.isAiming = false;
    const launchSpeed = (5.0 + this.chargeStrength * 11.5) * this.scale;
    const vx = this.currentTrajectory.launchDir.x * launchSpeed;
    const vy = this.currentTrajectory.launchDir.y * launchSpeed;

    this.balls.push(new Ball(this.originX, this.originY, this.nextTier, false, vx, vy, this.scale));
    audioManager.playLaunch();
    haptics.launch();

    this.nextTier = getRandomSpawnTier(store.getState().highestTier);
    this.currentTrajectory = null;
    this.chargeTimer = 0;

    setTimeout(() => {
      this.canShoot = true;
    }, 450);
  }

  handleMerge(tierIndex, x, y) {
    const points = (TIERS[tierIndex].value || 2) * 2;
    store.addScore(points);
    store.setHighestTier(tierIndex + 1);
    this.floatingScores.push(new FloatingScore(x, y, `+${points}`, TIERS[tierIndex].color, this.scale));
  }

  update() {
    if (store.getState().isGameOver) return;

    updateEngineCharge(this);
    this.galaxyCore.update();
    for (let b of this.balls) b.update(this.width, this.height);

    this.balls = resolveCollisions({
      balls: this.balls,
      particles: this.particles,
      width: this.width,
      height: this.height,
      centerX: this.centerX,
      centerY: this.centerY,
      scale: this.scale,
      onMerge: (tier, x, y) => this.handleMerge(tier, x, y)
    });

    for (let p of this.particles) p.update();
    this.particles = this.particles.filter(p => !p.toRemove);

    for (let fs of this.floatingScores) fs.update();
    this.floatingScores = this.floatingScores.filter(fs => !fs.toRemove);

    updateDangerStatus(this);
  }

  render() {
    this.renderer.drawBackground(
      this.width,
      this.height,
      this.centerX,
      this.centerY,
      this.maxOrbitRadius,
      this.isWarning
    );

    this.galaxyCore.draw(this.ctx);

    if (this.currentTrajectory && this.canShoot && this.isAiming) {
      const tier = TIERS[this.nextTier] || TIERS[0];
      this.renderer.drawTrajectory(this.currentTrajectory, tier.color);
    }

    for (let b of this.balls) b.draw(this.ctx);
    for (let p of this.particles) p.draw(this.ctx);
    for (let fs of this.floatingScores) fs.draw(this.ctx);

    const nextTierConfig = TIERS[this.nextTier] || TIERS[0];
    const nextSprite = spriteCache.getSprite(this.nextTier, nextTierConfig.radius * this.scale);
    this.renderer.drawLauncher(this.originX, this.originY, nextSprite, this.chargeStrength, this.isAiming);
  }

  startLoop() {
    const loop = () => {
      this.update();
      this.render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  reset() {
    this.balls = [];
    this.particles = [];
    this.floatingScores = [];
    this.dangerTimer = 0;
    this.isWarning = false;
    this.canShoot = true;
    this.isAiming = false;
    this.chargeTimer = 0;
    this.currentTrajectory = null;
    this.nextTier = getRandomSpawnTier(0);
    store.reset();
  }
}
