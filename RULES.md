# RULES.md - Project Guidelines for Gravity4096

## 1. Modular Architecture & 200-Line Limit
- Every code file (.js, .css) must strictly stay under 200 lines of code
- Proactively split modules at around 180 lines
- Maintain clean separation between core, game, ui, config, and audio

## 2. Vanilla Philosophy
- Standard ES2022 modules and Vanilla CSS only
- Zero third-party runtime dependencies
- No React, no Tailwind CSS

## 3. Local Persistence
- Tier 1: localStorage for high scores and preferences wrapped in try/catch
- 1-click JSON backup and restore utility

## 4. Decoupled Core
- Reactive Store for centralized state
- Decoupled EventBus for cross-component events
- Event delegation on parent containers
- Lifecycle cleanup on components with intervals or listeners

## 5. Visuals & Mobile-First
- CSS tokens in tokens.css
- Touch targets at minimum 48px
- Support safe-area insets (env(safe-area-inset-top), env(safe-area-inset-bottom))
- Compact 1:1 square OpenGraph link previews (256x256)
