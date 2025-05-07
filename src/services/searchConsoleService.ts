import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class SearchConsoleService {
  private searchConsole;
  
  constructor(authClient: OAuth2Client) {
    this.searchConsole = google.searchconsole({ version: 'v1', auth: authClient });
  }

  /**
   * Get a list of sites in the property
   */
  async getSitesList() {
    try {
      const response = await this.searchConsole.sites.list();
      return response.data;
    } catch (error) {
      console.error('Error getting sites list:', error);
      throw error;
    }
  }

  /**
   * Get search analytics data for a site
   */
  async getSearchAnalytics(siteUrl: string, params: { 
    startDate: string;
    endDate: string;
    dimensions?: string[];
    rowLimit?: number;
  }) {
    try {
      const { startDate, endDate, dimensions = ['query'], rowLimit = 10 } = params;
      
      const response = await this.searchConsole.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate,
          endDate,
          dimensions,
          rowLimit
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting search analytics:', error);
      throw error;
    }
  }

  /**
   * Get URL inspection results
   */
  async inspectUrl(siteUrl: string, inspectionUrl: string) {
    try {
      const response = await this.searchConsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl,
          siteUrl
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error inspecting URL:', error);
      throw error;
    }
  }
}