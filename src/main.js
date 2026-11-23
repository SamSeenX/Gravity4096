import './styles/main.css';
import { initErrorBoundary } from './core/errorBoundary.js';
import { themeManager } from './core/themeManager.js';
import { Engine } from './game/engine.js';
import { HUD } from './ui/hud.js';
import { GameOverModal } from './ui/gameOverModal.js';
import { MilestoneModal } from './ui/milestoneModal.js';
import { HighScoreModal } from './ui/highScoreModal.js';
import { ComboBadge } from './ui/comboBadge.js';
import { TutorialController } from './game/tutorial.js';

window.addEventListener('DOMContentLoaded', () => {
  initErrorBoundary();
  themeManager.init();

  const viewport = document.querySelector('.game-viewport');
  const canvas = document.getElementById('gameCanvas');
  const hudContainer = document.getElementById('hudContainer');

  const engine = new Engine(canvas);

  new HUD(hudContainer, {
    onReset: () => engine.reset(),
    onTogglePause: () => engine.togglePause()
  });

  new ComboBadge(viewport);
  new MilestoneModal(viewport);
  new HighScoreModal(viewport);
  new GameOverModal(viewport, () => engine.reset());
  new TutorialController(viewport);

  window.addEventListener('resize', () => {
    engine.initLayout();
  });
});
