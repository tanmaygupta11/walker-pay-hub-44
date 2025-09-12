import React, { useState } from 'react';
import { SheetsService, SheetsResponse } from '../services/sheetsService';

const SheetsTest: React.FC = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [result, setResult] = useState<SheetsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState<'search' | 'connection' | 'health' | 'info' | 'url'>('search');

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      let response: SheetsResponse;

      switch (testType) {
        case 'search':
          if (!mobileNumber.trim()) {
            setResult({
              success: false,
              error: 'Please enter a mobile number',
              code: 'MISSING_MOBILE',
              timestamp: new Date().toISOString()
            });
            return;
          }
          response = await SheetsService.searchByMobile(mobileNumber);
          break;
        case 'connection':
          response = await SheetsService.testConnection();
          break;
        case 'health':
          response = await SheetsService.healthCheck();
          break;
        case 'info':
          response = await SheetsService.getInfo();
          break;
        case 'url':
          const urlTest = await SheetsService.testUrlAccessibility();
          response = {
            success: urlTest.accessible,
            data: { status: urlTest.status },
            message: urlTest.accessible ? 'URL is accessible' : 'URL is not accessible',
            error: urlTest.error,
            code: urlTest.accessible ? 'URL_ACCESSIBLE' : 'URL_NOT_ACCESSIBLE',
            timestamp: new Date().toISOString()
          };
          break;
        default:
          response = {
            success: false,
            error: 'Invalid test type',
            code: 'INVALID_TEST',
            timestamp: new Date().toISOString()
          };
      }

      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const formatResult = (result: SheetsResponse) => {
    if (result.success) {
      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Success</h3>
          {result.message && (
            <p className="text-green-700 mb-2">{result.message}</p>
          )}
          {result.data && (
            <div className="mt-3">
              <h4 className="font-medium text-green-800 mb-2">User Data:</h4>
              <pre className="bg-white p-3 rounded border text-sm overflow-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}
          {result.timestamp && (
            <p className="text-xs text-green-600 mt-2">
              Timestamp: {new Date(result.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      );
    } else {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">❌ Error</h3>
          <p className="text-red-700 mb-2">{result.error}</p>
          {result.code && (
            <p className="text-sm text-red-600 mb-2">Code: {result.code}</p>
          )}
          {result.timestamp && (
            <p className="text-xs text-red-600">
              Timestamp: {new Date(result.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Google Sheets Integration Test</h2>
      
      {/* Test Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Test Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            { value: 'search', label: 'Search Mobile' },
            { value: 'connection', label: 'Test Connection' },
            { value: 'health', label: 'Health Check' },
            { value: 'info', label: 'API Info' },
            { value: 'url', label: 'Test URL' }
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setTestType(type.value as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                testType === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Number Input (only for search) */}
      {testType === 'search' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <input
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter mobile number (e.g., 9876543210)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supports formats: 9876543210, +919876543210, 09876543210
          </p>
        </div>
      )}

      {/* Test Button */}
      <div className="mb-6">
        <button
          onClick={handleTest}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testing...
            </span>
          ) : (
            `Run ${testType === 'search' ? 'Search' : testType === 'connection' ? 'Connection' : testType === 'health' ? 'Health' : testType === 'info' ? 'Info' : 'URL'} Test`
          )}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Test Result</h3>
          {formatResult(result)}
        </div>
      )}

      {/* API URL Display */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Current API Configuration</h4>
        <p className="text-sm text-gray-600 break-all">
          <strong>URL:</strong> {SheetsService['apiUrl']}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          This URL should point to your deployed Google Apps Script web app
        </p>
      </div>
    </div>
  );
};

export default SheetsTest;