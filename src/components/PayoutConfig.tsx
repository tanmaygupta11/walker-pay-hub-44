/**
 * Payout Configuration Component
 * 
 * This component allows users to configure the Google Sheets integration
 * for dynamic payout data fetching.
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PayoutService } from '@/services/payoutService';
import { usePayoutData } from '@/hooks/usePayoutData';
import { Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PayoutConfigProps {
  onConfigChange?: (config: { apiUrl: string; spreadsheetId: string }) => void;
}

export function PayoutConfig({ onConfigChange }: PayoutConfigProps) {
  const [apiUrl, setApiUrl] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [testFeid, setTestFeid] = useState('FE94469');
  const [isConfigured, setIsConfigured] = useState(false);
  
  const { loading, error, testConnection, fetchPayoutData } = usePayoutData();

  const handleSaveConfig = () => {
    if (apiUrl && spreadsheetId) {
      PayoutService.setApiUrl(apiUrl);
      PayoutService.setDefaultConfig({ spreadsheetId });
      setIsConfigured(true);
      onConfigChange?.({ apiUrl, spreadsheetId });
    }
  };

  const handleTestConnection = async () => {
    if (!apiUrl || !spreadsheetId) {
      alert('Please enter both API URL and Spreadsheet ID');
      return;
    }
    
    PayoutService.setApiUrl(apiUrl);
    PayoutService.setDefaultConfig({ spreadsheetId });
    
    const result = await testConnection({ spreadsheetId });
    if (result.success) {
      alert('Connection test successful!');
    } else {
      alert(`Connection test failed: ${result.error}`);
    }
  };

  const handleTestFeid = async () => {
    if (!apiUrl || !spreadsheetId || !testFeid) {
      alert('Please enter API URL, Spreadsheet ID, and test FEID');
      return;
    }
    
    PayoutService.setApiUrl(apiUrl);
    PayoutService.setDefaultConfig({ spreadsheetId });
    
    const result = await fetchPayoutData(testFeid, { spreadsheetId });
    if (result.success) {
      alert(`Test successful! Total payout: ₹${result.data?.totalPayout?.toLocaleString()}`);
    } else {
      alert(`Test failed: ${result.error}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Payout Data Configuration
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Configuration Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          {isConfigured ? (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Configured
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Configured
            </Badge>
          )}
        </div>

        {/* API URL Configuration */}
        <div className="space-y-2">
          <Label htmlFor="apiUrl">Google Apps Script Web App URL</Label>
          <Input
            id="apiUrl"
            type="url"
            placeholder="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Deploy your Google Apps Script as a Web App and paste the URL here
          </p>
        </div>

        {/* Spreadsheet ID Configuration */}
        <div className="space-y-2">
          <Label htmlFor="spreadsheetId">Google Sheets ID</Label>
          <Input
            id="spreadsheetId"
            type="text"
            placeholder="1ABC123def456GHI789jkl012MNO345pqr678"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            The ID from your Google Sheets URL (the long string between /d/ and /edit)
          </p>
        </div>

        {/* Test Configuration */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium">Test Configuration</h4>
          
          <div className="space-y-2">
            <Label htmlFor="testFeid">Test FEID</Label>
            <Input
              id="testFeid"
              type="text"
              placeholder="FE94469"
              value={testFeid}
              onChange={(e) => setTestFeid(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleTestConnection}
              disabled={loading || !apiUrl || !spreadsheetId}
              variant="outline"
              size="sm"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
            
            <Button
              onClick={handleTestFeid}
              disabled={loading || !apiUrl || !spreadsheetId || !testFeid}
              variant="outline"
              size="sm"
            >
              {loading ? 'Testing...' : 'Test FEID'}
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Save Configuration */}
        <Button
          onClick={handleSaveConfig}
          disabled={!apiUrl || !spreadsheetId}
          className="w-full"
        >
          Save Configuration
        </Button>

        {/* Instructions */}
        <div className="space-y-3 text-sm text-gray-600">
          <h4 className="font-medium text-gray-800">Setup Instructions:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Create a Google Apps Script project at script.google.com</li>
            <li>Copy the provided script code from the project files</li>
            <li>Deploy as Web App with "Anyone" access</li>
            <li>Copy the Web App URL and paste it above</li>
            <li>Get your Google Sheets ID from the URL</li>
            <li>Test the connection and save configuration</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
