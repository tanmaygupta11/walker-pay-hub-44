import React from 'react';
import SheetsTest from '../components/SheetsTest';

const SheetsDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Google Sheets Integration Demo
          </h1>
          <p className="text-gray-600">
            Test your Google Apps Script integration with mobile number lookup
          </p>
        </div>
        
        <SheetsTest />
        
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Integration Guide</h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p><strong>1. Search Mobile:</strong> Enter a mobile number to search in your Google Sheet</p>
            <p><strong>2. Test Connection:</strong> Verify the API is accessible</p>
            <p><strong>3. Health Check:</strong> Check the API configuration and status</p>
            <p><strong>4. API Info:</strong> Get information about available endpoints</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetsDemo;


