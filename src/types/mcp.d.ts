// GitHubからインストールしたMCP TypeScript SDKをImportするための型定義
declare module '@modelcontextprotocol/sdk' {
  export interface McpServerConfig {
    port: number;
    endpoint: string;
    provider: {
      name: string;
      description: string;
      iconUrl: string;
      contactEmail: string;
    };
    tools: Array<{
      slug: string;
      name: string;
      description: string;
      inputSchema: Record<string, any>;
      outputSchema: Record<string, any>;
      handler: (params: Record<string, any>) => Promise<any>;
    }>;
  }

  export class McpServer {
    constructor(config: McpServerConfig);
    start(): Promise<void>;
    stop(): Promise<void>;
  }
}