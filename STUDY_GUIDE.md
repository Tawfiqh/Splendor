# Study guide — Splendor / Lapidary AI
_A simple non-technical overview of this project, its structure and the trade-offs involved_

## What we're building

A Splendor board-game AI (neural net + reinforcement learning) with a **browser-only** UI. 
- The Python side implements rules and training (these weights are bundled into the webGUI);
- The `webgui/` folder is a **static** page (Vue 2 from `vue.min.js`, no bundler).

## How it works (high level)
1. `webgui/index.html` loads **styles in layers**: `components/base-theme.css` (page font, colors, `box-sizing`), `components/app-buttons.css` (default `button` look), legacy `style.css`, then `components/gem-stepper-buttons.css`, `components/gem-selector.css`, `components/move-maker.css`, then feature CSS (`card-display`, `tier-deck-slot`, etc.). Scripts: Vue, Math.js, weights, `game.js` / AI, then shared `components/*.js` in dependency order (`card-display.js` → `tier-deck-slot.js` → `cards-display.js`, then `moves-log-display.js`), then **`components/gem-stepper-buttons.js`** (registers `increment-button` / `decrement-button`), then `script.js` (remaining Vue components + `new Vue()`). The page shell is **two flex columns** in `.row`: **`.column-left`** (supply + players) and **`.column-right`** (market + move UI + `column-right-layout` sidebar for nobles + moves log).
2. All game logic and inference run in the browser.
3. `lapidary/export_weights.py` can regenerate `weights.js` from the trained TensorFlow checkpoint (run from a directory where you want `weights.js` written).

## Key decisions & why
- **Static webgui (no Vite/npm)** — zero build step; easy to host on GitHub Pages or open offline. Tradeoff: you manage vendor files (`vue.min.js`, `math.min.js`) yourself.
- **Layered component CSS** — shared look-and-feel (`base-theme.css`, `app-buttons.css`) and small feature sheets (`gem-selector.css`, `move-maker.css`, `gem-stepper-buttons.css`) load in a deliberate order around legacy `style.css`, instead of one giant stylesheet. Tradeoff: new files need matching `<link>` / `<script>` entries in `index.html` (no bundler to infer the graph).

## How each piece works

- **`webgui/components/*`** — Mostly **one Vue component per file** (`.css` beside it when needed); tiny helpers can sit in the same file (`moveToHtml`, etc.). They read globals from `game.js` and **`script.js`** (e.g. `background_colours` for card faces). Component scripts load **before** `script.js` so `new Vue()` sees every registration.

- **Global UI layers (no bundler)** — **`base-theme.css`** replaces the old “everything in `style.css`” approach for typography and resets. **`app-buttons.css`** gives every `button` a shared affordance (hover, disabled). **`gem-stepper-buttons.js` + `.css`** own the +/- table cells used by **`gem-selector`** and **`gem-discarder`**. **`gem-selector.css`** and **`move-maker.css`** hold layout for those components so **`style.css`** stays focused on the rest of the board layout.

- **Market card UI** — **`card-display.js`** = one card; the face uses a **CSS gradient layered on top of** the gem’s base color from `background_colours` (same map as gem counters). **`tier-deck-slot.js`** = reserve from deck top (`index: -1` → `GameState` takes from `cards_in_deck[tier]`). **`cards-display.js`** = one row of face-up cards, **plus** a deck control when reserve is enabled (`tier="hand"` is only the hand—no deck).

- **Page columns** — **`style.css`** lays out **`.row`** as flex: **`.column-left`** (supply/players) and **`.column-right`** (market + turn UI). **`column-right-layout.css`** defines `.column-right-sidebar-top` / `-bottom` for nobles + moves log beside the market.

- **Moves log** — **`moveToHtml`** (in `moves-log-display.js`) builds each line’s HTML; colours use `style.css`. The list zebra-stripes rows, highlights the newest, and **auto-scrolls** to the bottom when `moves` grows (`watch` + **`mounted`** + `$nextTick`).

- **State vector vs neural net (`state_vector_v02.js`)** — The JS feature vector must stay **2300** floats wide to match `weights.js` / `INPUT_SIZE` in `lapidary/nn.py`. For the per-player **total gem count** one-hot (`zeros(11)`), simulation can briefly exceed 10 gems before discard; assigning `arr[11] = 1` in JS **extends the array** to length 12 and corrupts the vector. Always index with **`Math.min(player.total_num_gems(), 10)`**, matching Python `set_player_gems(..., 'all', number)` which uses **`min(number, 10)`**.

- **`run.sh`** — Ensures `webgui/vue.min.js` (copy from `docs/`), `webgui/math.min.js` (pinned CDN download), and a stub `dynamic_test_state.js` if missing; then runs `python3 -m http.server` from `webgui/`. Override port with `PORT=9000 ./run.sh`.

## Things that don't work well

- First run needs network once to fetch Math.js unless you drop in `math.min.js` manually.
- `weights.js` is large and not always committed; training/export must produce it for a working AI.

## Key metrics & results

See `README.md` for training scale and self-play statistics.
