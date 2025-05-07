#!/bin/bash

# MCP サーバーを起動
cd "$(dirname "$0")"
npm run start-server &
MCP_PID=$!

# Claude Desktop を起動
open -a "Claude"

# MCP サーバーの終了を監視
sleep 3
echo "MCP Server running with PID: $MCP_PID"
echo "Press Ctrl+C to stop MCP server and exit"

function cleanup {
  echo "Shutting down MCP server..."
  kill $MCP_PID
  wait $MCP_PID 2>/dev/null
  echo "MCP server stopped"
  exit 0
}

trap cleanup SIGINT SIGTERM

# Claude が終了するまで待機
while true; do
  if ! pgrep -x "Claude" > /dev/null; then
    echo "Claude Desktop has closed, stopping MCP server..."
    cleanup
  fi
  sleep 5
done