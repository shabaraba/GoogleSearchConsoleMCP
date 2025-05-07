// @ts-ignore - GitHub package import
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { mcpConfig } from './config/mcpConfig.js';
import { MCPController } from './controllers/mcpController.js';

/**
 * Claude Desktop Launcher for MCP Google Search Console Server
 * 
 * This file is designed to be executed directly by Claude Desktop.
 * It starts the MCP server and handles automatic shutdown when Claude Desktop exits.
 */
async function main() {
  console.error('Google Search Console MCP Server starting...');
  console.error(`Process ID: ${process.pid}`);
  console.error(`Current working directory: ${process.cwd()}`);
  
  // Ensure we're in the right directory
  if (!process.cwd().includes('GoogleSearchConsoleMCP')) {
    console.error('Changing working directory to the project root');
    // 実行ファイルの場所からプロジェクトルートを取得
    const path = require('path');
    const projectRoot = path.resolve(__dirname, '..');
    process.chdir(projectRoot);
    console.error(`New working directory: ${process.cwd()}`);
  }
  
  try {
    // 環境変数設定
    process.env.NODE_ENV = 'development';
    
    // 1. MCPコントローラーの初期化
    console.error('Initializing MCP controller...');
    const mcpController = new MCPController();
    
    let initialized = false;
    try {
      initialized = await mcpController.initialize();
    } catch (error) {
      console.error('Error initializing MCP controller:', error);
      console.error('Continuing in mock mode for development...');
    }
    
    if (!initialized) {
      console.error('MCP controller not initialized, running in mock mode');
    } else {
      console.error('MCP controller initialized successfully');
    }
    
    // 2. MCPサーバーの準備
    console.error('Starting MCP server...');
    const server = new McpServer({
      name: mcpConfig.provider.name,
      version: '1.0.0'
    });
    
    // 3. ツールの登録
    // get-sites-list ツール
    server.tool(
      'get-sites-list',
      'Get a list of sites in Google Search Console',
      {},
      async () => {
        try {
          const result = await mcpController.getSitesList();
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          console.error('Error in get-sites-list tool:', error);
          return {
            content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
          };
        }
      }
    );
    
    // get-search-analytics ツール
    server.tool(
      'get-search-analytics', 
      'Get search analytics data for a site',
      {
        siteUrl: z.string().describe('The URL of the site to get analytics for'),
        startDate: z.string().describe('Start date in YYYY-MM-DD format'),
        endDate: z.string().describe('End date in YYYY-MM-DD format'),
        dimensions: z.array(z.string()).optional().describe('Dimensions to group data by (e.g., query, page, country)'),
        rowLimit: z.number().optional().describe('Maximum number of rows to return')
      },
      async (params) => {
        try {
          const result = await mcpController.getSearchAnalytics(params);
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          console.error('Error in get-search-analytics tool:', error);
          return {
            content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
          };
        }
      }
    );
    
    // inspect-url ツール
    server.tool(
      'inspect-url',
      'Get URL inspection results',
      {
        siteUrl: z.string().describe('The URL of the property in Search Console'),
        inspectionUrl: z.string().describe('The URL to inspect')
      },
      async (params) => {
        try {
          const result = await mcpController.inspectUrl(params);
          return {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          };
        } catch (error) {
          console.error('Error in inspect-url tool:', error);
          return {
            content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
            isError: true
          };
        }
      }
    );
    
    // 4. Signal handlers for graceful shutdown
    setupSignalHandlers(server);
    
    // 5. 標準入出力に接続
    console.error('Connecting to stdio transport...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('MCP server is running. Will exit automatically when Claude Desktop closes.');
    
  } catch (error) {
    console.error('Error starting MCP server:', error);
    process.exit(1);
  }
}

/**
 * Setup signal handlers for graceful shutdown
 * This ensures the server closes properly when Claude Desktop is closed
 */
function setupSignalHandlers(server: McpServer) {
  // SIGINT is sent when user presses Ctrl+C
  process.on('SIGINT', () => handleShutdown(server, 'SIGINT'));
  
  // SIGTERM is the standard termination signal
  process.on('SIGTERM', () => handleShutdown(server, 'SIGTERM'));
  
  // SIGHUP is sent when the terminal is closed
  process.on('SIGHUP', () => handleShutdown(server, 'SIGHUP'));
  
  // Handle parent process disconnection
  // This is important for detecting when Claude Desktop closes
  process.on('disconnect', () => handleShutdown(server, 'disconnect'));
  
  // Handle when parent process exits (Claude Desktop)
  process.on('beforeExit', () => handleShutdown(server, 'beforeExit'));
  
  // Detect when stdin is closed (Claude Desktop stops communication)
  process.stdin.on('end', () => handleShutdown(server, 'stdin end'));
  
  // Handle unexpected errors
  process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    handleShutdown(server, 'uncaughtException');
  });
}

/**
 * Handle graceful shutdown of the server
 */
async function handleShutdown(server: McpServer, signal: string) {
  console.error(`Received ${signal} signal. Shutting down MCP server...`);
  
  try {
    // Here you would add any server shutdown logic
    // For example: await server.close();
    
    console.error('MCP server shutdown complete.');
  } catch (error) {
    console.error('Error during shutdown:', error);
  } finally {
    // Force exit after a short timeout if graceful shutdown fails
    setTimeout(() => {
      console.error('Forcing exit after timeout');
      process.exit(0);
    }, 1000);
  }
}

// アプリケーションを起動
main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
