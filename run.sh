#!/usr/bin/env bash
# Serve the static Vue-in-browser UI under webgui/ (no npm build).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GUI="${ROOT}/webgui"
PORT="${PORT:-8080}"

if [[ ! -f "${GUI}/weights.js" ]]; then
  echo "warning: webgui/weights.js is missing. Export from Python with lapidary/export_weights.py" >&2
fi

echo "🚀 serving ${GUI} at http://127.0.0.1:${PORT}/"
cd "${GUI}"
exec python3 -m http.server "${PORT}"
