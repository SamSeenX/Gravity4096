# BRAIN.md - Architectural Record for Gravity4096

## Architectural Philosophy
Gravity4096 is a celestial physics-based 2048/4096 number-merge game. Instead of standard downward gravity stacks, bodies orbit around a central galactic attractor with gentle swirl and mutual gravitational clustering.

## Core Modules & Physics Design
- **Orbital Gravity (`src/game/orbitalGravity.js`)**:
  - Central Attractor: Radial acceleration towards screen center with Plummer softening: `a = G_center / sqrt(r^2 + soft^2)`
  - Swirl Drift: Tangential velocity vector introducing a gentle galactic rotation
  - Soft Mutual N-body Gravity: O(N^2) pairwise pull between bodies enabling orbital clustering without slingshot instability
  - Atmospheric Drag & Speed Clamp: `DRAG = 0.992` and `MAX_VELOCITY = 14` prevent runaway accelerations
- **Collision & Merge Solver (`src/game/orbitalPhysics.js`)**:
  - Pairwise overlap resolution with mass-weighted displacement
  - Restitution impulses and boundary bouncing on left, right, top, and bottom clearance
  - Contact detection triggering collapse animation and next-tier spawning
- **Trajectory Predictor (`src/game/trajectory.js`)**:
  - Forward simulates 28 time steps using the orbital physics kernel to draw an accurate aiming laser
- **Celestial Tiers (`src/config/tiers.js`)**:
  - 12 tiers from Asteroid (2) up to Black Hole (4096) with calibrated radii and masses
- **Renderer & Procedural Caching (`src/game/spriteCache.js`, `src/game/renderer.js`)**:
  - Offscreen canvas procedural caching for 60 FPS performance without repetitive path tracing
- **Decoupled State & Events (`src/core/store.js`, `src/core/eventBus.js`)**:
  - Micro-store and pub-sub architecture under 100 lines each
- **Layout & Responsiveness (`src/game/engineLayout.js`)**:
  - Dynamic DPI scaling and aspect ratio calculation keeping orbital proportions consistent across viewports
