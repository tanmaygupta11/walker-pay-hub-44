// Example component showing how to use the Google Sheets integration
import React, { useState } from 'react';
import { useSheets } from '@/hooks/useSheets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, CheckCircle, XCircle, AlertCircle, Smartphone } from 'lucide-react';

export function SheetsIntegration() {
  const [mobileNumber, setMobileNumber] = useState('');
  const {
    userData,
    loading,
    error,
    searchByMobile,
    testConnection,
    healthCheck,
    clearError,
    clearData,
    isConnected,
    lastSearch
  } = useSheets();

  const handleSearch = async () => {
    if (!mobileNumber.trim()) return;
    await searchByMobile(mobileNumber);
  };

  const handleTestConnection = async () => {
    await testConnection();
  };

  const handleHealthCheck = async () => {
    await healthCheck();
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (error) return <XCircle className="h-4 w-4 text-red-500" />;
    if (userData) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusColor = () => {
    if (loading) return 'bg-blue-100 text-blue-800';
    if (error) return 'bg-red-100 text-red-800';
    if (userData) return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = () => {
    if (loading) return 'Searching...';
    if (error) return 'Error';
    if (userData) return 'User Found';
    return 'Ready';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Smartphone className="h-6 w-6" />
            Google Sheets Integration
          </CardTitle>
          <p className="text-gray-600">
            Search for users by mobile number using Google Sheets
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status Display */}
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            {getStatusIcon()}
            <span className="font-medium">Status:</span>
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            {isConnected && (
              <Badge className="bg-green-100 text-green-800">
                Connected
              </Badge>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="ml-2"
                >
                  Clear
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Search Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <div className="flex gap-2">
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter mobile number (e.g., 9876543210)"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  disabled={loading}
                />
                <Button
                  onClick={handleSearch}
                  disabled={!mobileNumber.trim() || loading}
                  className="px-6"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={handleTestConnection}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                Test Connection
              </Button>
              <Button
                onClick={handleHealthCheck}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                Health Check
              </Button>
              <Button
                onClick={clearData}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                Clear Data
              </Button>
            </div>
          </div>

          {/* User Data Display */}
          {userData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Information</CardTitle>
                <p className="text-sm text-gray-600">
                  Found for mobile: {lastSearch}
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(userData)
                    .filter(([key]) => key !== '_originalHeaders')
                    .map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-sm font-medium capitalize">
                          {key.replace(/_/g, ' ')}:
                        </Label>
                        <div className="text-sm text-gray-700">
                          {String(value) || 'N/A'}
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* Raw Data (for debugging) */}
                <details className="mt-4">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                    View Raw Data
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </details>
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Deploy the Google Apps Script as a web app</p>
              <p>2. Update the API URL in <code>src/services/sheetsService.ts</code></p>
              <p>3. Configure your Google Sheet with the required columns</p>
              <p>4. Test the connection using the buttons above</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

