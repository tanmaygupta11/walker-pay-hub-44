/**
 * Payout Test Page
 * 
 * This page demonstrates the Google Sheets integration for payout data.
 * It shows both static and dynamic data fetching capabilities.
 */

import { useState } from 'react';
import { PayoutConfig } from '@/components/PayoutConfig';
import { BillingCyclePayoutBreakdown } from '@/components/walker/billing-cycle-payout-breakdown';
import { MOCK_AGGREGATE_PAYOUT } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Settings, TestTube } from 'lucide-react';

interface PayoutTestConfig {
  apiUrl: string;
  spreadsheetId: string;
}

export default function PayoutTest() {
  const [config, setConfig] = useState<PayoutTestConfig | null>(null);
  const [testFeid, setTestFeid] = useState('FE94469');

  const handleConfigChange = (newConfig: PayoutTestConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Payout Data Integration Test
          </h1>
          <p className="text-muted-foreground">
            Test the Google Sheets integration for dynamic payout data
          </p>
        </div>

        <Tabs defaultValue="config" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="static" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Static Data
            </TabsTrigger>
            <TabsTrigger value="dynamic" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Dynamic Data
            </TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="config" className="space-y-4">
            <PayoutConfig onConfigChange={handleConfigChange} />
          </TabsContent>

          {/* Static Data Tab */}
          <TabsContent value="static" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Static Payout Data (Mock)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  This shows the payout breakdown using static mock data
                </p>
              </CardHeader>
              <CardContent>
                <BillingCyclePayoutBreakdown
                  detail={MOCK_AGGREGATE_PAYOUT}
                  title="August 2025 Payout"
                  feId="FE001234"
                  useDynamicData={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dynamic Data Tab */}
          <TabsContent value="dynamic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Dynamic Payout Data (Google Sheets)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  This shows the payout breakdown using data from Google Sheets
                </p>
                
                {config ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-100 text-green-800">
                      Configured
                    </Badge>
                    <span className="text-xs text-gray-500">
                      API: {config.apiUrl.substring(0, 50)}...
                    </span>
                  </div>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 mt-2">
                    Not Configured
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {config ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Test FEID:</label>
                      <input
                        type="text"
                        value={testFeid}
                        onChange={(e) => setTestFeid(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                        placeholder="FE94469"
                      />
                    </div>
                    
                    <BillingCyclePayoutBreakdown
                      detail={MOCK_AGGREGATE_PAYOUT} // Fallback data
                      title="Dynamic Payout Data"
                      feId={testFeid}
                      useDynamicData={true}
                      spreadsheetId={config.spreadsheetId}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Please configure the Google Sheets integration first</p>
                    <p className="text-sm">Go to the Configuration tab to set up your API URL and Spreadsheet ID</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm font-medium">Google Apps Script</div>
                <div className="text-xs text-gray-500">Ready for deployment</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm font-medium">Payout Service</div>
                <div className="text-xs text-gray-500">API integration complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">✅</div>
                <div className="text-sm font-medium">Dashboard Integration</div>
                <div className="text-xs text-gray-500">Dynamic data support</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
