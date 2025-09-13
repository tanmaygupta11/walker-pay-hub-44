# Google Sheets Payout Integration

This document describes the Google Sheets integration for dynamic payout data fetching in the Walker Pay Hub application.

## Overview

The integration allows the dashboard to pull real-time payout data from a Google Spreadsheet named "Final Payout Sheet" and display it dynamically in the payout breakdown components.

## Architecture

```
Frontend (React) → PayoutService → Google Apps Script Web App → Google Sheets
```

## Components

### 1. Google Apps Script (`google-apps-script.js`)

**Location**: Root directory of the project

**Features**:
- Deployed as a Web App URL
- Accepts query parameters: `spreadsheetId`, `sheetId`, `feid`
- Returns JSON response with mapped payout attributes
- Handles CORS and error cases
- Modular design for future extensions

**Column Mappings**:
- Base Pay → `basePayout`
- Morning OT Payout → `otPayout`
- Walker Order Fulfilment → `walkerOrderFulfilment`
- Normal OT Payout → `onTimeLogin`
- Best Ranked Station → `bestRankedStationReward`
- Festival Incentives → `festiveIncentives`
- Walker Cancellation → `cancellationAmount`
- SM Cancellation → `walkerLateLogin`

### 2. Payout Service (`src/services/payoutService.ts`)

**Features**:
- TypeScript service for API communication
- Error handling and validation
- Configuration management
- Connection testing capabilities

**Key Methods**:
- `fetchPayoutData(feid, config)` - Fetch payout data for a specific FEID
- `testConnection(config)` - Test API connectivity
- `setApiUrl(url)` - Configure the Apps Script URL
- `setDefaultConfig(config)` - Set default spreadsheet configuration

### 3. React Hook (`src/hooks/usePayoutData.ts`)

**Features**:
- React hook for easy integration
- Loading and error states
- Automatic data fetching
- Connection status tracking

### 4. Updated Components

**BillingCyclePayoutBreakdown**:
- Added `useDynamicData` prop to enable/disable dynamic fetching
- Added `spreadsheetId` prop for configuration
- Displays loading states and error messages
- Falls back to static data when dynamic data is unavailable

**PayoutConfig**:
- Configuration interface for setting up the integration
- Test connection and FEID functionality
- Visual status indicators

**PayoutTest Page**:
- Test page at `/payout-test` route
- Side-by-side comparison of static vs dynamic data
- Configuration management interface

## Setup Instructions

### 1. Deploy Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Copy the code from `google-apps-script.js`
4. Save the project
5. Deploy as Web App:
   - Click "Deploy" → "New deployment"
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Copy the Web App URL

### 2. Configure Google Sheets

1. Create a Google Spreadsheet with the name "Final Payout Sheet"
2. Set up the header row with the required column names:
   - FEID (or FE ID)
   - Base Pay
   - Morning OT Payout
   - Walker Order Fulfilment
   - Normal OT Payout
   - Best Ranked Station
   - Festival Incentives
   - Walker Cancellation
   - SM Cancellation
3. Add your data rows with FEIDs and corresponding values
4. Copy the Spreadsheet ID from the URL

### 3. Configure the Application

1. Navigate to `/payout-test` in the application
2. Go to the "Configuration" tab
3. Enter your Google Apps Script Web App URL
4. Enter your Google Sheets ID
5. Test the connection
6. Save the configuration

## Usage

### Basic Usage

```tsx
import { BillingCyclePayoutBreakdown } from '@/components/walker/billing-cycle-payout-breakdown';

// Static data (existing behavior)
<BillingCyclePayoutBreakdown
  detail={mockData}
  title="August 2025 Payout"
  feId="FE001234"
  useDynamicData={false}
/>

// Dynamic data from Google Sheets
<BillingCyclePayoutBreakdown
  detail={mockData} // Fallback data
  title="August 2025 Payout"
  feId="FE001234"
  useDynamicData={true}
  spreadsheetId="your-spreadsheet-id"
/>
```

### Using the Hook

```tsx
import { usePayoutData } from '@/hooks/usePayoutData';

function MyComponent() {
  const { payoutData, loading, error, fetchPayoutData } = usePayoutData();
  
  const handleFetch = async () => {
    const result = await fetchPayoutData('FE94469', {
      spreadsheetId: 'your-spreadsheet-id'
    });
    
    if (result.success) {
      console.log('Payout data:', result.data);
    }
  };
  
  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {payoutData && (
        <div>
          <p>Total Payout: ₹{payoutData.totalPayout.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
```

## API Response Format

### Success Response

```json
{
  "feid": "FE94469",
  "basePayout": 15020,
  "otPayout": 0,
  "walkerOrderFulfilment": 0,
  "onTimeLogin": 0,
  "bestRankedStationReward": 0,
  "festiveIncentives": 0,
  "cancellationAmount": 625,
  "walkerLateLogin": 0,
  "totalPayout": 13995
}
```

### Error Response

```json
{
  "error": "FEID not found"
}
```

## Error Handling

The integration includes comprehensive error handling:

- **Missing Parameters**: Validates required parameters
- **FEID Not Found**: Returns appropriate error message
- **Connection Issues**: Handles network and API errors
- **Invalid Data**: Validates response format
- **Loading States**: Shows loading indicators during data fetching

## Testing

### Test Page

Visit `/payout-test` to:
- Configure the integration
- Test API connectivity
- Compare static vs dynamic data
- Test with different FEIDs

### Test Functions

The Apps Script includes a test function:

```javascript
function testFetchPayoutData() {
  const testSpreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
  const testFeid = 'FE94469';
  
  const result = fetchPayoutData(testSpreadsheetId, 0, testFeid);
  console.log('Test result:', JSON.stringify(result, null, 2));
  return result;
}
```

## Future Extensions

The system is designed to be extensible:

1. **Multiple Sheets**: Easy to add support for additional sheets
2. **Additional Mappings**: Simple to add new column mappings
3. **Authentication**: Can be extended with user authentication
4. **Caching**: Can add caching layer for better performance
5. **Real-time Updates**: Can implement real-time data synchronization

## Security Considerations

- Apps Script is deployed with "Anyone" access for simplicity
- Consider implementing authentication for production use
- Validate all input parameters
- Sanitize data before processing
- Use HTTPS for all communications

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure Apps Script is deployed as Web App with "Anyone" access
2. **FEID Not Found**: Check that the FEID exists in the spreadsheet
3. **Invalid Response**: Verify column names match the expected mappings
4. **Connection Timeout**: Check network connectivity and API URL

### Debug Steps

1. Test the Apps Script directly in the script editor
2. Check browser console for error messages
3. Verify spreadsheet permissions
4. Test with the `/payout-test` page
5. Check Apps Script execution logs

## Files Created/Modified

### New Files
- `google-apps-script.js` - Google Apps Script code
- `src/services/payoutService.ts` - API service
- `src/hooks/usePayoutData.ts` - React hook
- `src/components/PayoutConfig.tsx` - Configuration component
- `src/pages/PayoutTest.tsx` - Test page
- `GOOGLE_SHEETS_PAYOUT_INTEGRATION.md` - This documentation

### Modified Files
- `src/components/walker/billing-cycle-payout-breakdown.tsx` - Added dynamic data support
- `src/App.tsx` - Added test route

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the test page at `/payout-test`
3. Check browser console for error messages
4. Verify Apps Script deployment and permissions
