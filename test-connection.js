// Quick connection test script
// Run this in your browser console or Node.js

const API_URL = 'https://script.google.com/macros/s/AKfycbz_mRG9_pPE6_OPXBrzMOa0TcImS-EgJwHOA12L9zImuLEXQU-_On7AkT9TQRHGh4Y/exec';

async function testConnection() {
  console.log('🔍 Testing Google Apps Script Connection...');
  console.log('API URL:', API_URL);
  
  try {
    // Test 1: Basic connection test
    console.log('\n1️⃣ Testing basic connection...');
    const testResponse = await fetch(`${API_URL}?action=test`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Status:', testResponse.status);
    console.log('Status Text:', testResponse.statusText);
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Test Response:', testData);
    } else {
      console.log('❌ Test failed with status:', testResponse.status);
    }
    
    // Test 2: Health check
    console.log('\n2️⃣ Testing health check...');
    const healthResponse = await fetch(`${API_URL}?action=health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Health Status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health Response:', healthData);
    } else {
      console.log('❌ Health check failed');
    }
    
    // Test 3: API info
    console.log('\n3️⃣ Testing API info...');
    const infoResponse = await fetch(`${API_URL}?action=info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Info Status:', infoResponse.status);
    
    if (infoResponse.ok) {
      const infoData = await infoResponse.json();
      console.log('✅ Info Response:', infoData);
    } else {
      console.log('❌ Info check failed');
    }
    
    // Test 4: POST request (mobile search)
    console.log('\n4️⃣ Testing mobile search...');
    const searchResponse = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobileNumber: '9876543210'
      }),
    });
    
    console.log('Search Status:', searchResponse.status);
    
    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      console.log('✅ Search Response:', searchData);
    } else {
      console.log('❌ Search failed');
    }
    
  } catch (error) {
    console.error('❌ Connection Error:', error);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('1. Check if the Google Apps Script is deployed as a web app');
    console.log('2. Verify "Who has access" is set to "Anyone"');
    console.log('3. Check if the script has the correct Google Sheets ID');
    console.log('4. Look at the Apps Script execution logs');
  }
}

// Run the test
testConnection();

