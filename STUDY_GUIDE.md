# Study guide — Splendor / Lapidary AI
_A simple non-technical overview of this project, its structure and the trade-offs involved_

## What we're building

A Splendor board-game AI (neural net + reinforcement learning) with a **browser-only** UI. 
- The Python side implements rules and training (these weights are bundled into the webGUI);
- The `webgui/` folder is a **static** page (Vue 2 from `vue.min.js`, no bundler).

## How it works (high level)
1. `webgui/index.html` loads Vue, Math.js, exported weights, then game/AI scripts, then shared UI `components/`, then **card market components** in a fixed order (`card-display.js` → `tier-deck-slot.js` → `cards-display.js`, because `cards-display` nests the other two), then **`column-right-layout.js`** (two-column shell for market vs sidebar), **`moves-log-display.js`** (depends on `game.js` for `colours` / `all_colours` and on Math.js for round labels), then `script.js` (Vue app bootstrap).
2. All game logic and inference run in the browser.
3. `lapidary/export_weights.py` can regenerate `weights.js` from the trained TensorFlow checkpoint (run from a directory where you want `weights.js` written).

## Key decisions & why
- **Static webgui (no Vite/npm)** — zero build step; easy to host on GitHub Pages or open offline. Tradeoff: you manage vendor files (`vue.min.js`, `math.min.js`) yourself.

## How each piece works

- **`webgui/components/*`** — Mostly **one Vue component per file** (`.css` beside it when needed); tiny helpers can sit in the same file (`moveToHtml`, etc.). They read globals from `game.js` and tags from `script.js`. Component scripts load **before** `script.js` so `new Vue()` sees every registration.

- **Market card UI** — **`card-display.js`** = one card. **`tier-deck-slot.js`** = reserve from deck top (`index: -1` → `GameState` takes from `cards_in_deck[tier]`). **`cards-display.js`** = one row of face-up cards, **plus** a deck control when reserve is enabled (`tier="hand"` is only the hand—no deck).

- **Right column layout** — **`column-right-layout`** splits `.column-right`: main column (market, moves, AI) vs sidebar (**nobles** on top, **moves log** below, scrollable). Extra CSS widens `.column-right` so both columns fit.

- **Moves log** — **`moveToHtml`** (in `moves-log-display.js`) builds each line’s HTML; colours use `style.css`. The list zebra-stripes rows, highlights the newest, and **auto-scrolls** to the bottom when `moves` grows (`watch` + **`mounted`** + `$nextTick`).

- **`run.sh`** — Ensures `webgui/vue.min.js` (copy from `docs/`), `webgui/math.min.js` (pinned CDN download), and a stub `dynamic_test_state.js` if missing; then runs `python3 -m http.server` from `webgui/`. Override port with `PORT=9000 ./run.sh`.

## Things that don't work well

- First run needs network once to fetch Math.js unless you drop in `math.min.js` manually.
- `weights.js` is large and not always committed; training/export must produce it for a working AI.

## Key metrics & results

See `README.md` for training scale and self-play statistics.
