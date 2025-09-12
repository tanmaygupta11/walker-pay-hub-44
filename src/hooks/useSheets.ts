// React hook for Google Sheets integration
import { useState, useCallback } from 'react';
import { SheetsService, UserData, SheetsResponse } from '@/services/sheetsService';

interface UseSheetsReturn {
  // Data
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  searchByMobile: (mobileNumber: string) => Promise<SheetsResponse>;
  testConnection: () => Promise<SheetsResponse>;
  healthCheck: () => Promise<SheetsResponse>;
  clearError: () => void;
  clearData: () => void;
  
  // Status
  isConnected: boolean;
  lastSearch: string | null;
}

export function useSheets(): UseSheetsReturn {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastSearch, setLastSearch] = useState<string | null>(null);

  const searchByMobile = useCallback(async (mobileNumber: string): Promise<SheetsResponse> => {
    setLoading(true);
    setError(null);
    setLastSearch(mobileNumber);

    try {
      const result = await SheetsService.searchByMobile(mobileNumber);
      
      if (result.success && result.data) {
        setUserData(result.data);
        setIsConnected(true);
      } else {
        setError(result.error || 'User not found');
        setUserData(null);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      setUserData(null);
      setIsConnected(false);
      
      return {
        success: false,
        error: errorMessage,
        code: 'SEARCH_ERROR',
        timestamp: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const testConnection = useCallback(async (): Promise<SheetsResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await SheetsService.testConnection();
      
      if (result.success) {
        setIsConnected(true);
      } else {
        setError(result.error || 'Connection test failed');
        setIsConnected(false);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      setIsConnected(false);
      
      return {
        success: false,
        error: errorMessage,
        code: 'CONNECTION_ERROR',
        timestamp: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const healthCheck = useCallback(async (): Promise<SheetsResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await SheetsService.healthCheck();
      
      if (result.success) {
        setIsConnected(true);
      } else {
        setError(result.error || 'Health check failed');
        setIsConnected(false);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Health check failed';
      setError(errorMessage);
      setIsConnected(false);
      
      return {
        success: false,
        error: errorMessage,
        code: 'HEALTH_ERROR',
        timestamp: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setUserData(null);
    setError(null);
    setLastSearch(null);
  }, []);

  return {
    // Data
    userData,
    loading,
    error,
    
    // Actions
    searchByMobile,
    testConnection,
    healthCheck,
    clearError,
    clearData,
    
    // Status
    isConnected,
    lastSearch
  };
}

