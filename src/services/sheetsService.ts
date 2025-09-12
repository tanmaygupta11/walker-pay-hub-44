// Google Sheets Integration Service
// Handles communication with Google Apps Script web app

// Configuration - Update this with your deployed web app URL
// IMPORTANT: Replace this with your Google Apps Script Web App URL
// The URL should look like: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbz_mRG9_pPE6_OPXBrzMOa0TcImS-EgJwHOA12L9zImuLEXQU-_On7AkT9TQRHGh4Y/exec';


// TypeScript interfaces
export interface UserData {
  [key: string]: any;
  _originalHeaders?: string[];
}

export interface SheetsResponse {
  success: boolean;
  data?: UserData;
  message?: string;
  error?: string;
  code?: string;
  timestamp?: string;
}

export interface SheetsError {
  success: false;
  error: string;
  code: string;
  timestamp?: string;
}

export class SheetsService {
  private static apiUrl: string = SHEETS_API_URL;

  /**
   * Set the API URL (useful for testing or different environments)
   */
  static setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  /**
   * Test if the API URL is accessible
   */
  static async testUrlAccessibility(): Promise<{ accessible: boolean; error?: string; status?: number }> {
    try {
      console.log('🔍 Testing URL accessibility...');
      console.log('🔗 Testing URL:', this.apiUrl);
      
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        mode: 'cors',
      });
      
      console.log('📡 URL test status:', response.status);
      
      return {
        accessible: response.ok,
        status: response.status,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };
      
    } catch (error) {
      console.error('❌ URL accessibility test failed:', error);
      return {
        accessible: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Search for user by mobile number
   */
  static async searchByMobile(mobileNumber: string): Promise<SheetsResponse> {
    try {
      console.log('🔍 Searching for mobile number:', mobileNumber);

      // Validate mobile number
      const validation = this.validateMobileNumber(mobileNumber);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error || 'Invalid mobile number',
          code: 'INVALID_MOBILE',
          timestamp: new Date().toISOString()
        };
      }

      // Make the API request
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          mobileNumber: mobileNumber
        }),
      });

      console.log('📡 API response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SheetsResponse = await response.json();
      console.log('📊 API response data:', result);

      return result;

    } catch (error) {
      console.error('❌ Sheets service error:', error);
      
      // Try with CORS proxy as fallback
      try {
        console.log('🔄 Trying with CORS proxy...');
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + this.apiUrl;
        const proxyResponse = await fetch(proxyUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({
            mobileNumber: mobileNumber
          }),
        });
        
        if (proxyResponse.ok) {
          const result: SheetsResponse = await proxyResponse.json();
          console.log('✅ Proxy request successful:', result);
          return result;
        }
      } catch (proxyError) {
        console.error('❌ Proxy also failed:', proxyError);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        code: 'NETWORK_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Test the API connection
   */
  static async testConnection(): Promise<SheetsResponse> {
    try {
      console.log('🧪 Testing API connection...');
      console.log('🔗 API URL:', this.apiUrl);
      
      const response = await fetch(`${this.apiUrl}?action=test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result: SheetsResponse = await response.json();
      console.log('✅ Connection test successful:', result);
      
      return result;

    } catch (error) {
      console.error('❌ Connection test failed:', error);
      
      // Try with CORS proxy as fallback
      try {
        console.log('🔄 Trying with CORS proxy...');
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + this.apiUrl;
        const proxyResponse = await fetch(`${proxyUrl}?action=test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        
        if (proxyResponse.ok) {
          const result: SheetsResponse = await proxyResponse.json();
          console.log('✅ Proxy connection test successful:', result);
          return result;
        }
      } catch (proxyError) {
        console.error('❌ Proxy also failed:', proxyError);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
        code: 'CONNECTION_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Perform health check
   */
  static async healthCheck(): Promise<SheetsResponse> {
    try {
      console.log('🏥 Performing health check...');
      console.log('🔗 API URL:', this.apiUrl);
      
      const response = await fetch(`${this.apiUrl}?action=health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      console.log('📡 Health check status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Health check error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result: SheetsResponse = await response.json();
      console.log('✅ Health check successful:', result);
      
      return result;

    } catch (error) {
      console.error('❌ Health check failed:', error);
      
      // Try with CORS proxy as fallback
      try {
        console.log('🔄 Trying health check with CORS proxy...');
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + this.apiUrl;
        const proxyResponse = await fetch(`${proxyUrl}?action=health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        
        if (proxyResponse.ok) {
          const result: SheetsResponse = await proxyResponse.json();
          console.log('✅ Proxy health check successful:', result);
          return result;
        }
      } catch (proxyError) {
        console.error('❌ Proxy health check also failed:', proxyError);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Health check failed',
        code: 'HEALTH_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get API information
   */
  static async getInfo(): Promise<SheetsResponse> {
    try {
      console.log('ℹ️ Getting API information...');
      console.log('🔗 API URL:', this.apiUrl);
      
      const response = await fetch(`${this.apiUrl}?action=info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      console.log('📡 API info status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API info error:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result: SheetsResponse = await response.json();
      console.log('✅ API info retrieved:', result);
      
      return result;

    } catch (error) {
      console.error('❌ Failed to get API info:', error);
      
      // Try with CORS proxy as fallback
      try {
        console.log('🔄 Trying API info with CORS proxy...');
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + this.apiUrl;
        const proxyResponse = await fetch(`${proxyUrl}?action=info`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        
        if (proxyResponse.ok) {
          const result: SheetsResponse = await proxyResponse.json();
          console.log('✅ Proxy API info successful:', result);
          return result;
        }
      } catch (proxyError) {
        console.error('❌ Proxy API info also failed:', proxyError);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get API info',
        code: 'INFO_ERROR',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Validate mobile number format
   */
  static validateMobileNumber(mobileNumber: string): { valid: boolean; error?: string } {
    if (!mobileNumber) {
      return { valid: false, error: 'Mobile number is required' };
    }

    // Remove all non-digit characters
    const cleaned = mobileNumber.replace(/\D/g, '');
    
    // Check if it's a valid mobile number (10 digits)
    if (cleaned.length === 10) {
      return { valid: true };
    }
    
    // Check if it has country code (12 digits starting with 91)
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return { valid: true };
    }
    
    // Check if it has leading zero (11 digits starting with 0)
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return { valid: true };
    }

    return { 
      valid: false, 
      error: 'Please enter a valid 10-digit mobile number' 
    };
  }

  /**
   * Format mobile number for display
   */
  static formatMobileNumber(mobileNumber: string): string {
    const cleaned = mobileNumber.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
      const withoutCountryCode = cleaned.substring(2);
      return `+91 ${withoutCountryCode.slice(0, 5)} ${withoutCountryCode.slice(5)}`;
    } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
      const withoutZero = cleaned.substring(1);
      return `+91 ${withoutZero.slice(0, 5)} ${withoutZero.slice(5)}`;
    }
    
    return mobileNumber;
  }
}

// Types are already exported above with the interfaces
