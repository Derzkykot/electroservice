#!/bin/sh
set -eu
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1; then
  node node_modules/vite/bin/vite.js --host 127.0.0.1 "$@"
elif [ -x /Users/denisdimitrov/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node ]; then
  /Users/denisdimitrov/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node node_modules/vite/bin/vite.js --host 127.0.0.1 "$@"
else
  echo 'Для запуска нужен Node.js. После установки выполните npm install и npm run dev.' >&2
  exit 1
fi
