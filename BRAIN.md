# BRAIN.md - Architectural Record for Gravity4096

## Architectural Philosophy
Gravity4096 is a celestial physics-based 2048/4096 number-merge game. Instead of standard downward gravity stacks, bodies orbit around a central galactic attractor with gentle swirl and mutual gravitational clustering.

## Core Modules & Physics Design
- **Orbital Physics (`src/game/orbitalPhysics.js`)**:
  - Central Attractor: Radial acceleration towards screen center with Plummer softening: a = G_center / (r^2 + epsilon^2)
  - Swirl Drift: Tangential velocity vector introducing a gentle galactic rotation
  - Soft Mutual N-body Gravity: O(N^2) mutual pull between bodies enabling orbital clustering without chaos
  - Boundary Elasticity: Left, right, and top wall rebounds with energy restitution
- **Trajectory Predictor (`src/game/trajectory.js`)**:
  - Forward simulates 35 time steps using the orbital physics kernel to draw an accurate aiming laser
- **Celestial Tiers (`src/config/tiers.js`)**:
  - 12 tiers from Asteroid (2) up to Galaxy (4096) with calibrated radii and masses
- **Renderer & Procedural Caching (`src/game/spriteCache.js`, `src/game/renderer.js`)**:
  - Offscreen canvas procedural caching for 60 FPS performance without repetitive path tracing
- **Decoupled State & Events (`src/core/store.js`, `src/core/eventBus.js`)**:
  - Micro-store and pub-sub architecture under 100 lines each
