/**
 * Payout Service for Google Sheets Integration
 * 
 * This service handles communication with the Google Apps Script web app
 * to fetch dynamic payout data from Google Sheets.
 */

// Configuration - Update this with your deployed Google Apps Script Web App URL
const PAYOUT_API_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// TypeScript interfaces
export interface PayoutData {
  feid: string;
  basePayout: number;
  otPayout: number;
  walkerOrderFulfilment: number;
  onTimeLogin: number;
  bestRankedStationReward: number;
  festiveIncentives: number;
  cancellationAmount: number;
  walkerLateLogin: number;
  totalPayout: number;
}

export interface PayoutResponse {
  success: boolean;
  data?: PayoutData;
  error?: string;
  code?: string;
  timestamp?: string;
  message?: string;
}

export interface PayoutServiceConfig {
  spreadsheetId: string;
  sheetId?: number;
  apiUrl?: string;
}

export class PayoutService {
  private static apiUrl: string = PAYOUT_API_URL;
  private static defaultConfig: PayoutServiceConfig = {
    spreadsheetId: '',
    sheetId: 0
  };

  /**
   * Set the API URL for the Google Apps Script web app
   */
  static setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  /**
   * Set default configuration
   */
  static setDefaultConfig(config: Partial<PayoutServiceConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Fetch payout data for a specific FEID
   */
  static async fetchPayoutData(feid: string, config?: Partial<PayoutServiceConfig>): Promise<PayoutResponse> {
    try {
      console.log('🔍 Fetching payout data for FEID:', feid);

      // Merge with default config
      const finalConfig = { ...this.defaultConfig, ...config };

      // Validate required parameters
      if (!feid.trim()) {
        return {
          success: false,
          error: 'FEID is required',
          code: 'MISSING_FEID',
          timestamp: new Date().toISOString()
        };
      }

      if (!finalConfig.spreadsheetId) {
        return {
          success: false,
          error: 'Spreadsheet ID is required',
          code: 'MISSING_SPREADSHEET_ID',
          timestamp: new Date().toISOString()
        };
      }

      // Build query parameters
      const params = new URLSearchParams({
        spreadsheetId: finalConfig.spreadsheetId,
        feid: feid.trim()
      });

      if (finalConfig.sheetId !== undefined) {
        params.append('sheetId', finalConfig.sheetId.toString());
      }

      const url = `${this.apiUrl}?${params.toString()}`;

      console.log('📡 Making API request to:', url);

      // Make the API request
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('📊 API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📊 API response data:', result);

      // Check if the response contains an error
      if (result.error) {
        return {
          success: false,
          error: result.error,
          code: 'SHEETS_ERROR',
          timestamp: new Date().toISOString()
        };
      }

      // Validate the response structure
      if (!result.feid || typeof result.totalPayout !== 'number') {
        return {
          success: false,
          error: 'Invalid response format from sheets',
          code: 'INVALID_RESPONSE',
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        data: result as PayoutData,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Payout service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'FETCH_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Test the API connection
   */
  static async testConnection(config?: Partial<PayoutServiceConfig>): Promise<PayoutResponse> {
    try {
      console.log('🔍 Testing payout API connection...');

      const finalConfig = { ...this.defaultConfig, ...config };

      if (!finalConfig.spreadsheetId) {
        return {
          success: false,
          error: 'Spreadsheet ID is required for testing',
          code: 'MISSING_SPREADSHEET_ID',
          timestamp: new Date().toISOString()
        };
      }

      // Test with a dummy FEID to check connectivity
      const testResult = await this.fetchPayoutData('TEST_FEID', finalConfig);
      
      if (testResult.success || testResult.code === 'FEID_NOT_FOUND') {
        return {
          success: true,
          data: undefined,
          message: 'API connection successful',
          timestamp: new Date().toISOString()
        };
      }

      return testResult;

    } catch (error) {
      console.error('❌ Connection test error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
        code: 'CONNECTION_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get API configuration info
   */
  static getConfig(): PayoutServiceConfig & { apiUrl: string } {
    return {
      ...this.defaultConfig,
      apiUrl: this.apiUrl
    };
  }
}

// Export default instance
export default PayoutService;
