import { SearchConsoleService } from '../services/searchConsoleService.js';
import { authorize } from '../config/credentials.js';

export class MCPController {
  private searchConsoleService: SearchConsoleService | null = null;
  private mockMode = false;
  
  constructor() {}
  
  /**
   * Initialize the Google Search Console service with authorized credentials
   */
  async initialize() {
    try {
      const authClient = await authorize();
      this.searchConsoleService = new SearchConsoleService(authClient);
      return true;
    } catch (error) {
      console.error('Failed to initialize Search Console service:', error);
      console.error('Switching to mock mode...');
      this.mockMode = true;
      return false;
    }
  }
  
  /**
   * Check if we're running in mock mode
   */
  isMockMode() {
    return this.mockMode;
  }
  
  /**
   * Get a list of sites from Search Console
   */
  async getSitesList() {
    if (this.mockMode) {
      console.error('Mock mode: Returning mock sites list');
      return {
        siteEntry: [
          { siteUrl: 'https://example.com', permissionLevel: 'siteOwner' },
          { siteUrl: 'https://blog.example.com', permissionLevel: 'siteOwner' }
        ]
      };
    }
    
    if (!this.searchConsoleService) {
      throw new Error('Search Console service not initialized');
    }
    
    return await this.searchConsoleService.getSitesList();
  }
  
  /**
   * Get search analytics data
   */
  async getSearchAnalytics(params: { 
    siteUrl: string;
    startDate: string;
    endDate: string;
    dimensions?: string[];
    rowLimit?: number;
  }) {
    if (this.mockMode) {
      console.error('Mock mode: Returning mock search analytics data');
      return {
        rows: [
          { keys: ['search term 1'], clicks: 120, impressions: 1200, ctr: 0.1, position: 12.3 },
          { keys: ['search term 2'], clicks: 45, impressions: 900, ctr: 0.05, position: 8.7 }
        ]
      };
    }
    
    if (!this.searchConsoleService) {
      throw new Error('Search Console service not initialized');
    }
    
    const { siteUrl, ...rest } = params;
    return await this.searchConsoleService.getSearchAnalytics(siteUrl, rest);
  }
  
  /**
   * Inspect a URL
   */
  async inspectUrl(params: { siteUrl: string; inspectionUrl: string }) {
    if (this.mockMode) {
      console.error('Mock mode: Returning mock URL inspection data');
      const { inspectionUrl } = params;
      return {
        inspectionResult: {
          indexStatusResult: {
            verdict: 'PASS',
            coverageState: 'Indexed',
            lastCrawlTime: '2023-01-01T00:00:00Z'
          },
          mobileUsabilityResult: {
            verdict: 'PASS'
          },
          richResultsResult: {
            verdict: 'PASS'
          },
          pageUrl: inspectionUrl
        }
      };
    }
    
    if (!this.searchConsoleService) {
      throw new Error('Search Console service not initialized');
    }
    
    const { siteUrl, inspectionUrl } = params;
    return await this.searchConsoleService.inspectUrl(siteUrl, inspectionUrl);
  }
}