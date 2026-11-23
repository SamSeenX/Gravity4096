import './styles/main.css';
import { initErrorBoundary } from './core/errorBoundary.js';
import { Engine } from './game/engine.js';
import { HUD } from './ui/hud.js';
import { GameOverModal } from './ui/gameOverModal.js';

window.addEventListener('DOMContentLoaded', () => {
  initErrorBoundary();

  const viewport = document.querySelector('.game-viewport');
  const canvas = document.getElementById('gameCanvas');
  const hudContainer = document.getElementById('hudContainer');

  const engine = new Engine(canvas);

  new HUD(hudContainer, () => {
    engine.reset();
  });

  new GameOverModal(viewport, () => {
    engine.reset();
  });

  window.addEventListener('resize', () => {
    engine.initLayout();
  });
});
