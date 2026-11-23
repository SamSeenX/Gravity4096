export function initErrorBoundary() {
  window.addEventListener('error', (e) => {
    console.error('Unhandled runtime error:', e.error || e.message);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}
