/**
 * React hook for fetching payout data from Google Sheets
 */

import { useState, useCallback } from 'react';
import { PayoutService, PayoutData, PayoutResponse, PayoutServiceConfig } from '@/services/payoutService';

interface UsePayoutDataReturn {
  // Data
  payoutData: PayoutData | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPayoutData: (feid: string, config?: Partial<PayoutServiceConfig>) => Promise<PayoutResponse>;
  testConnection: (config?: Partial<PayoutServiceConfig>) => Promise<PayoutResponse>;
  clearError: () => void;
  clearData: () => void;
  
  // Status
  isConnected: boolean;
  lastFeid: string | null;
}

export function usePayoutData(): UsePayoutDataReturn {
  const [payoutData, setPayoutData] = useState<PayoutData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastFeid, setLastFeid] = useState<string | null>(null);

  const fetchPayoutData = useCallback(async (feid: string, config?: Partial<PayoutServiceConfig>): Promise<PayoutResponse> => {
    setLoading(true);
    setError(null);
    setLastFeid(feid);

    try {
      const result = await PayoutService.fetchPayoutData(feid, config);
      
      if (result.success && result.data) {
        setPayoutData(result.data);
        setIsConnected(true);
      } else {
        setError(result.error || 'Failed to fetch payout data');
        setPayoutData(null);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Fetch failed';
      setError(errorMessage);
      setPayoutData(null);
      setIsConnected(false);
      
      return {
        success: false,
        error: errorMessage,
        code: 'FETCH_ERROR',
        timestamp: new Date().toISOString()
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const testConnection = useCallback(async (config?: Partial<PayoutServiceConfig>): Promise<PayoutResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await PayoutService.testConnection(config);
      
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setPayoutData(null);
    setError(null);
    setLastFeid(null);
  }, []);

  return {
    // Data
    payoutData,
    loading,
    error,
    
    // Actions
    fetchPayoutData,
    testConnection,
    clearError,
    clearData,
    
    // Status
    isConnected,
    lastFeid
  };
}
