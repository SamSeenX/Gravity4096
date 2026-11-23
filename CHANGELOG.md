# CHANGELOG.md

## [1.0.5] - 2026-11-23
### Changed
- Increased maximum launch velocity from 13.0 to 16.5 at peak strength in engine.js and trajectory.js
- Raised velocity ceiling in orbitalGravity.js to 16.5 to support high-power orbital penetration
- Introduced a 25-frame launch transit grace period allowing full-power shots to travel cleanly across to the far side of the cluster without premature core braking
- Extended trajectory path simulation from 36 to 48 steps to accurately project the full arc around the back of the center core
