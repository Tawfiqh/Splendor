# Study guide — Splendor / Lapidary AI
_A simple non-technical overview of this project, its structure and the trade-offs involved_

## What we're building

A Splendor board-game AI (neural net + reinforcement learning) with a **browser-only** UI. 
- The Python side implements rules and training (these weights are bundled into the webGUI);
- The `webgui/` folder is a **static** page (Vue 2 from `vue.min.js`, no bundler).

## How it works (high level)
1. `webgui/index.html` loads Vue, Math.js, exported weights, then game/AI scripts, then shared UI `components/`, then **card market components** in a fixed order (`card-display.js` → `tier-deck-slot.js` → `cards-display.js`, because `cards-display` nests the other two), then `script.js` (Vue app bootstrap).
2. All game logic and inference run in the browser.
3. `lapidary/export_weights.py` can regenerate `weights.js` from the trained TensorFlow checkpoint (run from a directory where you want `weights.js` written).

## Key decisions & why
- **Static webgui (no Vite/npm)** — zero build step; easy to host on GitHub Pages or open offline. Tradeoff: you manage vendor files (`vue.min.js`, `math.min.js`) yourself.

## How each piece works

- **`webgui/components/*`** — Each file registers one Vue component plus matching CSS where needed. Shared pieces: `gem-selector.js`, `move-maker.js`, `supply-display.js`, `nobles-display.js`, etc. They rely on globals from `game.js` and on tags defined in `script.js` (for example `gems-table`). Scripts load before `script.js` so components register before `new Vue()`.

- **Market card UI** — `card-display.js` renders one development card (points, cost, buy/reserve). `tier-deck-slot.js` is the face-down **deck** control for blind reserve: clicking it emits a reserve with `index: -1`, which `GameState` implements by popping from `cards_in_deck[tier]`. `cards-display.js` lays out one row: optional deck slot (only when `tier` is not `"hand"` and reserve is enabled) plus the face-up cards; it receives `deck_count` from `state.tier_N.length` for tier 3/2/1. The player’s reserved cards in hand reuse `cards-display` with `tier="hand"`, which hides the deck slot.


- **`run.sh`** — Ensures `webgui/vue.min.js` (copy from `docs/`), `webgui/math.min.js` (pinned CDN download), and a stub `dynamic_test_state.js` if missing; then runs `python3 -m http.server` from `webgui/`. Override port with `PORT=9000 ./run.sh`.

## Things that don't work well

- First run needs network once to fetch Math.js unless you drop in `math.min.js` manually.
- `weights.js` is large and not always committed; training/export must produce it for a working AI.

## Key metrics & results

See `README.md` for training scale and self-play statistics.
