export const mcpConfig = {
  // MCP設定
  port: process.env.PORT || 3000,
  endpoint: '/api/mcp',
  
  // MCPプロバイダーの情報
  provider: {
    name: 'GoogleSearchConsoleMCP',
    description: 'Google Search Console MCP Provider',
    iconUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    contactEmail: 'your-email@example.com',
  },

  // MCPツールの設定
  tools: [
    {
      slug: 'get-sites-list',
      name: 'Get Sites List',
      description: 'Get a list of sites in Google Search Console',
      inputSchema: {},
      outputSchema: {
        type: 'object',
        properties: {
          sites: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                siteUrl: { type: 'string' },
                permissionLevel: { type: 'string' }
              }
            }
          }
        }
      }
    },
    {
      slug: 'get-search-analytics',
      name: 'Get Search Analytics',
      description: 'Get search analytics data for a site',
      inputSchema: {
        type: 'object',
        required: ['siteUrl', 'startDate', 'endDate'],
        properties: {
          siteUrl: { 
            type: 'string',
            description: 'The URL of the site to get analytics for'
          },
          startDate: { 
            type: 'string', 
            description: 'Start date in YYYY-MM-DD format'
          },
          endDate: { 
            type: 'string', 
            description: 'End date in YYYY-MM-DD format'
          },
          dimensions: { 
            type: 'array', 
            description: 'Dimensions to group data by (e.g., query, page, country)',
            items: { type: 'string' },
            default: ['query']
          },
          rowLimit: { 
            type: 'number', 
            description: 'Maximum number of rows to return',
            default: 10
          }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          rows: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                keys: { 
                  type: 'array', 
                  items: { type: 'string' }
                },
                clicks: { type: 'number' },
                impressions: { type: 'number' },
                ctr: { type: 'number' },
                position: { type: 'number' }
              }
            }
          }
        }
      }
    },
    {
      slug: 'inspect-url',
      name: 'Inspect URL',
      description: 'Get URL inspection results',
      inputSchema: {
        type: 'object',
        required: ['siteUrl', 'inspectionUrl'],
        properties: {
          siteUrl: { 
            type: 'string',
            description: 'The URL of the property in Search Console'
          },
          inspectionUrl: { 
            type: 'string', 
            description: 'The URL to inspect'
          }
        }
      },
      outputSchema: {
        type: 'object',
        properties: {
          inspectionResult: {
            type: 'object',
            properties: {
              indexStatusResult: { type: 'object' },
              mobileUsabilityResult: { type: 'object' },
              richResultsResult: { type: 'object' }
            }
          }
        }
      }
    }
  ]
};