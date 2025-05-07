#!/bin/bash

# スクリプトのディレクトリの絶対パスを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# スクリプトパスを出力（デバッグ用）
echo "Starting MCP server from: $SCRIPT_DIR"

# Node.jsでサーバーを起動
node --loader ts-node/esm src/index.ts