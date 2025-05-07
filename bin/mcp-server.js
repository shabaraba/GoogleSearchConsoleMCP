#!/usr/bin/env node

// Google Search Console MCP Server
// 
// このスクリプトはClaude Desktopが起動するとMCPサーバーを自動的に
// 起動し、Claude Desktopが終了すると自動的に終了します。

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM環境でのディレクトリパスの取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// プロセス終了時の処理
let serverProcess = null;

// MCPサーバープロセスを起動
function startServer() {
  console.error('Starting Google Search Console MCP Server...');
  
  // npm run devコマンドを実行
  serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true
  });

  serverProcess.on('error', (error) => {
    console.error(`Failed to start MCP server: ${error.message}`);
  });

  serverProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`MCP server process exited with code ${code}`);
    } else {
      console.error('MCP server process closed');
    }
    serverProcess = null;
  });

  console.error(`MCP Server started with PID: ${serverProcess.pid}`);
}

// 終了時の処理
function cleanupAndExit() {
  if (serverProcess) {
    console.error('Shutting down MCP server...');
    
    // プロセスを終了
    serverProcess.kill();
    serverProcess = null;
    
    console.error('MCP server shutdown complete');
  }
  
  process.exit(0);
}

// プロセス終了シグナルをキャッチ
process.on('SIGINT', cleanupAndExit);  // Ctrl+C
process.on('SIGTERM', cleanupAndExit); // kill
process.on('SIGHUP', cleanupAndExit);  // ターミナル閉じる

// サーバーを起動
startServer();

console.error('MCP server wrapper running. Press Ctrl+C to stop.');
