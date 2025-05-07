// @ts-ignore - GitHub package import
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { mcpConfig } from './config/mcpConfig.js';
import { MCPController } from './controllers/mcpController.js';

async function main() {
  try {
    // 1. MCPコントローラーの初期化
    console.error('Initializing MCP controller...');
    const mcpController = new MCPController();
    const initialized = await mcpController.initialize();
    
    if (!initialized) {
      console.error('Failed to initialize MCP controller. Exiting...');
      process.exit(1);
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
    
    // 4. 標準入出力に接続
    console.error('Connecting to stdio transport...');
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    console.error('MCP server is running. Press Ctrl+C to exit.');
    
  } catch (error) {
    console.error('Error starting MCP server:', error);
    process.exit(1);
  }
}

// アプリケーションを起動
main().catch(console.error);
