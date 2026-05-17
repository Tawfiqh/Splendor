# Study guide — Splendor / Lapidary AI
_A simple non-technical overview of this project, its structure and the trade-offs involved_

## What we're building

A Splendor board-game AI (neural net + reinforcement learning) with a **browser-only** UI. 
- The Python side implements rules and training (these weights are bundled into the webGUI);
- The `webgui/` folder is a **static** page (Vue 2 from `vue.min.js`, no bundler).

## How it works (high level)
1. `webgui/index.html` loads **styles in layers**: `components/base-theme.css` (CSS variables / design tokens, page background, **`#app`** padding and a **wide max-width** (~1600px), `box-sizing`), `components/app-buttons.css` (default `button` look + optional `button--primary` / `button--secondary` / `button--ghost` classes), legacy `style.css` (**CSS Grid** main `.row`, supply/player/market panels, gem tables, modals), then `components/gem-stepper-buttons.css`, `components/gem-selector.css`, `components/move-maker.css`, then feature CSS (`card-display`, `tier-deck-slot`, etc.). Scripts: Vue, Math.js, weights, `game.js` / AI, then shared `components/*.js` in dependency order (`card-display.js` → `tier-deck-slot.js` → `cards-display.js`, then `moves-log-display.js`), then **`components/gem-stepper-buttons.js`** (registers `increment-button` / `decrement-button`), then `script.js` (remaining Vue components + `new Vue()`). The page shell is a **responsive grid** in `.row`: **`.column-left`** (supply + players) and **`.column-right`** (market + turn UI). **`column-right-layout`** is **one column under ~1024px** (market + controls first, nobles + moves log below) and **two columns at desktop** (main + sidebar).
2. All game logic and inference run in the browser.
3. `lapidary/export_weights.py` can regenerate `weights.js` from the trained TensorFlow checkpoint (run from a directory where you want `weights.js` written).

## Key decisions & why
- **Static webgui (no Vite/npm)** — zero build step; easy to host on GitHub Pages or open offline. Tradeoff: you manage vendor files (`vue.min.js`, `math.min.js`) yourself.
- **Layered component CSS** — shared look-and-feel (`base-theme.css`, `app-buttons.css`) and small feature sheets (`gem-selector.css`, `move-maker.css`, `gem-stepper-buttons.css`) load in a deliberate order around legacy `style.css`, instead of one giant stylesheet. Tradeoff: new files need matching `<link>` / `<script>` entries in `index.html` (no bundler to infer the graph).
- **Design tokens (`:root` CSS variables)** — colours, spacing, radii, and shadows live in `base-theme.css` so panels and cards stay visually consistent and you change the theme in one place. Tradeoff: very old browsers without custom-properties support would need a fallback (not a target here).
- **Responsive layout without a framework** — `.row` uses **CSS Grid** (single column then two columns from 768px); `column-right-layout` **stacks** nobles/log under the market until **1024px**. **`.column-right`** is **not** tied to viewport height anymore so the market can use the full grid column. Tradeoff: breakpoint values are manual, not shared with JS.

## How each piece works

- **`webgui/components/*`** — Mostly **one Vue component per file** (`.css` beside it when needed); tiny helpers can sit in the same file (`moveToHtml`, etc.). They read globals from `game.js` and **`script.js`** (e.g. `background_colours` for card faces). Component scripts load **before** `script.js` so `new Vue()` sees every registration.

- **Global UI layers (no bundler)** — **`base-theme.css`** sets **design tokens** (e.g. `--color-bg-primary`, `--space-md`, `--shadow-sm`), page background, and **`#app`** width rhythm (**`max-width: min(100%, 100rem)`** so wide monitors get a larger board). **`app-buttons.css`** gives every `button` shared affordances (hover, disabled, **`focus-visible`** outline) plus optional **`.button--primary`** / **`.button--secondary`** / **`.button--ghost`**. **`gem-stepper-buttons.js` + `.css`** own the +/- table cells used by **`gem-selector`** and **`gem-discarder`**. **`gem-selector.css`** and **`move-maker.css`** hold layout for those components so **`style.css`** stays focused on the rest of the board layout.

- **Gem selector supply hints (`gem-selector.js`)** — When choosing “take gems,” the UI keeps a **draft** count per colour (`gems_selected` in `script.js`) that does **not** change the real board until the player confirms. The component **`gem-selector-draft-cell`** stacks the draft number (coloured disc) with a **hint line** under it: if the draft is zero it shows how many of that colour are **in supply** (e.g. `5 gems in supply`); if the draft is non-zero it shows **`pool in supply · remaining after`** (e.g. `12 in supply · 10 after`), or **`none left`** when the pick would empty that stack. **Gold** uses the same row for the count but hides the hint (gold is not drafted through these controls). The table cell exposes a single **`aria-label`** that combines draft + hint; the visible stack is **`aria-hidden`** so assistive tech does not double-read. This matches the sidebar wording “**Supply**” for the global pool.

- **Market card UI** — **`card-display.js`** = one card; the face uses a **CSS gradient layered on top of** the gem’s base color from `background_colours` (same map as gem counters). **`tier-deck-slot.js`** = reserve from deck top (`index: -1` → `GameState` takes from `cards_in_deck[tier]`). **`cards-display.js`** = one row of face-up cards, **plus** a deck control when reserve is enabled (`tier="hand"` is only the hand—no deck).

- **Page columns** — **`style.css`** lays out **`.row`** as **CSS Grid**: one column on small screens, two columns from **768px** (left: supply/players, right: market + turn UI). **`column-right-layout.css`** switches **`.column-right-layout`** from **column flex** (market first, sidebar below) to **row flex** from **1024px**, with `.column-right-sidebar-top` / `-bottom` for nobles + moves log.

- **Moves log** — **`moveToHtml`** (in `moves-log-display.js`) builds each line’s HTML; colours use `style.css`. The list zebra-stripes rows, highlights the newest, and **auto-scrolls** to the bottom when `moves` grows (`watch` + **`mounted`** + `$nextTick`).

- **State vector vs neural net (`state_vector_v02.js`)** — The JS feature vector must stay **2300** floats wide to match `weights.js` / `INPUT_SIZE` in `lapidary/nn.py`. For the per-player **total gem count** one-hot (`zeros(11)`), simulation can briefly exceed 10 gems before discard; assigning `arr[11] = 1` in JS **extends the array** to length 12 and corrupts the vector. Always index with **`Math.min(player.total_num_gems(), 10)`**, matching Python `set_player_gems(..., 'all', number)` which uses **`min(number, 10)`**.

- **`run.sh`** — Ensures `webgui/vue.min.js` (copy from `docs/`), `webgui/math.min.js` (pinned CDN download), and a stub `dynamic_test_state.js` if missing; then runs `python3 -m http.server` from `webgui/`. Override port with `PORT=9000 ./run.sh`.

## Things that don't work well

- First run needs network once to fetch Math.js unless you drop in `math.min.js` manually.
- `weights.js` is large and not always committed; training/export must produce it for a working AI.
- **Optional button classes** (`button--primary`, etc.) exist in CSS but most templates still use plain `<button>`; you add classes in Vue templates where you want emphasis.
- **`backdrop-filter`** on card action buttons can be a no-op on some browsers; the UI still has a solid light background.

## Key metrics & results

See `README.md` for training scale and self-play statistics.
