export function calculateEngineLayout(canvas) {
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = rect.width;
  const height = rect.height;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const scale = Math.min(width / 400, height / 640);
  const centerX = width / 2;
  const centerY = height * 0.44;
  const originX = width / 2;
  const originY = height - 40 * scale;
  const maxOrbitRadius = Math.min(width * 0.46, height * 0.38);

  return {
    width,
    height,
    scale,
    centerX,
    centerY,
    originX,
    originY,
    maxOrbitRadius
  };
}
