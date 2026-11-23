# CHANGELOG.md

## [1.0.1] - 2026-11-23
### Changed
- Increased central gravity constant from 0.32 to 38.0 in orbitalGravity.js and trajectory.js for realistic orbital capture
- Added inner core repulsion buffer (34px) preventing singular point clumping at the black hole center
- Dampened border bounce restitution from 0.65 to 0.35 and applied wall friction to prevent pinball ricochets
- Extended aiming trajectory simulator to 42 steps for clear visual orbit projection
- Relaxed danger limit in spawner.js: minimum 4 active balls required and filters out fast-moving bodies to prevent false-positive game overs
