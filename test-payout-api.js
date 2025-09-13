/**
 * Test script for Google Sheets Payout API
 * 
 * This script tests the Google Apps Script web app to verify
 * the payout data integration is working correctly.
 */

const PAYOUT_API_URL = 'https://script.google.com/macros/s/AKfycbyb2tnEBxwX6LLDS7JuO0zw7y1tat1izHW1YFtol9AMZHET17ApTjvAQMhGRk9M75Jc4g/exec';

async function testPayoutAPI() {
  console.log('🧪 Testing Google Sheets Payout API...\n');
  
  // Test parameters - you'll need to replace these with your actual values
  const testParams = {
    spreadsheetId: 'YOUR_SPREADSHEET_ID', // Replace with your actual spreadsheet ID
    feid: 'FE94469' // Test FEID
  };
  
  try {
    // Build the test URL
    const url = new URL(PAYOUT_API_URL);
    url.searchParams.append('spreadsheetId', testParams.spreadsheetId);
    url.searchParams.append('feid', testParams.feid);
    
    console.log('📡 Making request to:', url.toString());
    console.log('📊 Test parameters:', testParams);
    console.log('');
    
    // Make the API request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    console.log('📈 Response status:', response.status);
    console.log('📈 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📊 Response data:', JSON.stringify(data, null, 2));
    
    // Validate response structure
    if (data.error) {
      console.log('❌ API returned error:', data.error);
      if (data.error.includes('FEID not found')) {
        console.log('💡 This is expected if the FEID doesn\'t exist in your sheet');
      }
    } else if (data.feid && typeof data.totalPayout === 'number') {
      console.log('✅ API response is valid!');
      console.log(`💰 Total payout for ${data.feid}: ₹${data.totalPayout.toLocaleString()}`);
    } else {
      console.log('⚠️  API response format is unexpected');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log('💡 This might be a CORS issue or the Apps Script is not deployed');
      console.log('💡 Make sure your Google Apps Script is deployed as a Web App');
    }
  }
}

// Run the test
testPayoutAPI();
