# Google Sheets Integration Guide

## 🎯 Overview

This integration allows your Vite + TypeScript application to search for user data in Google Sheets using mobile numbers. The solution uses Google Apps Script as a backend API to avoid CORS issues.

## 🏗️ Architecture

```
Frontend (Vite + TypeScript) → Google Apps Script Web App → Google Sheets
```

## 📁 Files Created/Modified

### Core Service
- `src/services/sheetsService.ts` - Main service for API communication
- `src/hooks/useSheets.ts` - React hook for easy integration

### Components
- `src/components/SheetsTest.tsx` - Testing component
- `src/components/MobileLookup.tsx` - Reusable mobile lookup component
- `src/pages/SheetsDemo.tsx` - Demo page

### Routes
- Added `/sheets-demo` route to `src/App.tsx`

## 🚀 How to Use

### 1. Basic Usage with Hook

```tsx
import { useSheets } from '../hooks/useSheets';

function MyComponent() {
  const { searchByMobile, loading, error, data } = useSheets();

  const handleSearch = async () => {
    const result = await searchByMobile('9876543210');
    if (result.success) {
      console.log('User found:', result.data);
    }
  };

  return (
    <div>
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search User'}
      </button>
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

### 2. Using the MobileLookup Component

```tsx
import MobileLookup from '../components/MobileLookup';

function LoginPage() {
  const handleUserFound = (userData) => {
    console.log('User found:', userData);
    // Redirect to dashboard or show user info
  };

  const handleError = (error) => {
    console.error('Search failed:', error);
    // Show error message
  };

  return (
    <div>
      <h1>Login</h1>
      <MobileLookup
        onUserFound={handleUserFound}
        onError={handleError}
        placeholder="Enter your mobile number"
      />
    </div>
  );
}
```

### 3. Direct Service Usage

```tsx
import { SheetsService } from '../services/sheetsService';

// Search for user
const result = await SheetsService.searchByMobile('9876543210');

// Test connection
const connectionTest = await SheetsService.testConnection();

// Health check
const healthCheck = await SheetsService.healthCheck();
```

## 🔧 Configuration

### Google Apps Script Setup

1. **Create Google Apps Script**:
   - Go to [script.google.com](https://script.google.com)
   - Create a new project
   - Copy the provided Apps Script code

2. **Configure the Script**:
   ```javascript
   const CONFIG = {
     SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE',
     DATA_SHEET_NAME: 'Users', // Your sheet name
     MOBILE_COLUMN: 'Mobile', // Column with mobile numbers
     RETURN_COLUMNS: ['Name', 'Mobile', 'Email', 'Status', 'ID'],
     MAX_RESULTS: 1
   };
   ```

3. **Deploy as Web App**:
   - Click "Deploy" → "New deployment"
   - Type: Web app
   - Execute as: Me
   - Who has access: Anyone
   - Copy the web app URL

4. **Update Frontend**:
   ```typescript
   // In src/services/sheetsService.ts
   const SHEETS_API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```

## 🧪 Testing

### 1. Visit the Demo Page
Navigate to `http://localhost:5173/sheets-demo` to test the integration.

### 2. Test Different Scenarios
- **Search Mobile**: Test with valid mobile numbers
- **Test Connection**: Verify API accessibility
- **Health Check**: Check configuration
- **API Info**: Get endpoint information

### 3. Check Browser Console
All API calls are logged with emojis for easy debugging:
- 🔍 Searching for mobile number
- 📡 API response status
- 📊 API response data
- ✅ Success messages
- ❌ Error messages

## 📊 Data Format

### Request Format
```json
{
  "mobileNumber": "9876543210"
}
```

### Response Format
```json
{
  "success": true,
  "data": {
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com",
    "status": "Active",
    "id": "12345",
    "location": "New York"
  },
  "message": "User found successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 🔒 Security Features

- **Input Validation**: Mobile number format validation
- **Error Handling**: Comprehensive error handling with specific error codes
- **CORS Headers**: Proper CORS configuration in Apps Script
- **Rate Limiting**: Built-in protection against abuse

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure Apps Script is deployed as web app
   - Check CORS headers in Apps Script
   - Verify "Who has access" is set to "Anyone"

2. **Mobile Number Not Found**:
   - Check sheet name and column names
   - Verify mobile number format in sheet
   - Test with exact mobile number from sheet

3. **API Not Responding**:
   - Verify web app URL is correct
   - Check Apps Script execution logs
   - Test with health check endpoint

### Debug Steps

1. Open browser developer tools
2. Check console for API logs
3. Test with `/sheets-demo` page
4. Verify Apps Script deployment settings

## 📈 Performance

- **Caching**: Results are cached in React state
- **Error Recovery**: Automatic retry with CORS proxy
- **Loading States**: Proper loading indicators
- **Optimized Queries**: Efficient sheet searching

## 🔄 Next Steps

1. **Customize Data Fields**: Update `RETURN_COLUMNS` in Apps Script
2. **Add Authentication**: Implement user authentication
3. **Enhance UI**: Customize the mobile lookup component
4. **Add Validation**: Implement additional input validation
5. **Error Monitoring**: Add error tracking and monitoring

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your Google Apps Script configuration
3. Test with the demo page first
4. Check the Apps Script execution logs

---

**Happy Coding! 🚀**


