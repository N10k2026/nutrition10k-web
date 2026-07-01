#!/bin/bash
set -euo pipefail

PROJECT_DIR="/home/z/my-project"
cd "$PROJECT_DIR"

# Clear old log
: > "$PROJECT_DIR/dev.log"

# Start dev server in background
bun run dev >> "$PROJECT_DIR/dev.log" 2>&1 &
DEV_PID=$!

# Detach from this script so it survives the script exiting
disown "$DEV_PID" 2>/dev/null || true

# Wait briefly to confirm it started
sleep 5
if ! kill -0 "$DEV_PID" 2>/dev/null; then
    echo "ERROR: dev server failed to start"
    cat "$PROJECT_DIR/dev.log" | tail -20
    exit 1
fi

echo "OK: dev server started (PID: $DEV_PID)"

# Unset so the implicit EXIT trap won't kill it
unset DEV_PID
exit 0
