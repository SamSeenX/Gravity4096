export function updateMergeAnimation(ball, width, height) {
  ball.mergeFrame++;
  const mergeDuration = 14;
  const progress = Math.min(1, ball.mergeFrame / mergeDuration);

  // Smooth ease-in collapse towards target merge center
  const ease = progress * progress * (3 - 2 * progress);
  ball.x += (ball.targetX - ball.x) * 0.35;
  ball.y += (ball.targetY - ball.y) * 0.35;

  ball.alpha = Math.max(0, 1 - ease);
  ball.scaleX = 1 + Math.sin(progress * Math.PI) * 0.4;
  ball.scaleY = ball.scaleX;

  if (progress >= 1) {
    ball.toRemove = true;
  }
}
