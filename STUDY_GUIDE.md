# Study guide — Splendor / Lapidary AI
_A simple non-technical overview of this project, its structure and the trade-offs involved_

## What we're building

A Splendor board-game AI (neural net + reinforcement learning) with a **browser-only** UI. 
- The Python side implements rules and training (these weights are bundled into the webGUI);
- The `webgui/` folder is a **static** page (Vue 2 from `vue.min.js`, no bundler).

## How it works (high level)
1. `webgui/index.html` loads Vue, Math.js, exported weights, then game/AI scripts, then `move-maker.js` and `script.js` (Vue app bootstrap).
2. All game logic and inference run in the browser.
3. `lapidary/export_weights.py` can regenerate `weights.js` from the trained TensorFlow checkpoint (run from a directory where you want `weights.js` written).

## Key decisions & why
- **Static webgui (no Vite/npm)** — zero build step; easy to host on GitHub Pages or open offline. Tradeoff: you manage vendor files (`vue.min.js`, `math.min.js`) yourself.

## How each piece works

- **`webgui/move-maker.js`** — Registers the Vue `move-maker` component (take-gems UI). Loaded before `script.js` so it is registered before `new Vue()` runs; it relies on globals from `game.js` (`colours`) and on `gem-selector` from `script.js` (Vue resolves child components when the app renders).

- **`run.sh`** — Ensures `webgui/vue.min.js` (copy from `docs/`), `webgui/math.min.js` (pinned CDN download), and a stub `dynamic_test_state.js` if missing; then runs `python3 -m http.server` from `webgui/`. Override port with `PORT=9000 ./run.sh`.

## Things that don't work well

- First run needs network once to fetch Math.js unless you drop in `math.min.js` manually.
- `weights.js` is large and not always committed; training/export must produce it for a working AI.

## Key metrics & results

See `README.md` for training scale and self-play statistics.
