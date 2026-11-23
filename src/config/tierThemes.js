export const PASTEL_PALETTE = [
  { color: '#f9a8d4', glow: '#f472b6' }, // 2: Sakura Pink
  { color: '#fdba74', glow: '#fb923c' }, // 4: Peach Custard
  { color: '#fef08a', glow: '#fde047' }, // 8: Buttercup Mochi
  { color: '#86efac', glow: '#4ade80' }, // 16: Matcha Milk
  { color: '#7dd3fc', glow: '#38bdf8' }, // 32: Boba Sky
  { color: '#c4b5fd', glow: '#a78bfa' }, // 64: Lavender Cloud
  { color: '#d8b4fe', glow: '#c084fc' }, // 128: Taro Dream
  { color: '#f472b6', glow: '#ec4899' }, // 256: Sweet Bubblegum
  { color: '#fda4af', glow: '#fb7185' }, // 512: Soft Coral
  { color: '#fcd34d', glow: '#f59e0b' }, // 1024: Honey Amber
  { color: '#6ee7b7', glow: '#34d399' }, // 2048: Mint Sorbet
  { color: '#67e8f9', glow: '#22d3ee' }  // 4096: Pastel Cyan
];

export const DARK_PALETTE = [
  { color: '#f43f5e', glow: '#fb7185' }, // 2: Neon Ruby
  { color: '#fb923c', glow: '#f97316' }, // 4: Neon Tangerine
  { color: '#facc15', glow: '#eab308' }, // 8: Electric Gold
  { color: '#10b981', glow: '#34d399' }, // 16: Emerald Laser
  { color: '#06b6d4', glow: '#38bdf8' }, // 32: Cyan Pulse
  { color: '#6366f1', glow: '#818cf8' }, // 64: Indigo Warp
  { color: '#a855f7', glow: '#c084fc' }, // 128: Purple Nova
  { color: '#ec4899', glow: '#f472b6' }, // 256: Hot Magenta
  { color: '#f59e0b', glow: '#fbbf24' }, // 512: Amber Sun
  { color: '#ef4444', glow: '#f87171' }, // 1024: Crimson Star
  { color: '#3b82f6', glow: '#60a5fa' }, // 2048: Cobalt Giant
  { color: '#8b5cf6', glow: '#a78bfa' }  // 4096: Deep Void
];

export function applyThemeToTiers(tiers, theme = 'pastel') {
  const palette = theme === 'dark' ? DARK_PALETTE : PASTEL_PALETTE;
  tiers.forEach((tier, i) => {
    if (palette[i]) {
      tier.color = palette[i].color;
      tier.glow = palette[i].glow;
    }
  });
}
