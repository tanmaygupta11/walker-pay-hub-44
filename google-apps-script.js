/**
 * Google Apps Script for Walker Payout Data Integration
 * 
 * This script fetches payout data from Google Sheets and returns it as JSON
 * for the Walker Pay Hub application.
 * 
 * Deployment Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Copy this code
 * 4. Deploy as Web App with "Anyone" access
 * 5. Copy the Web App URL for use in the frontend
 */

// Configuration for column mappings
const COLUMN_MAPPINGS = {
  'Base Pay': 'basePayout',
  'Morning OT Payout': 'otPayout', 
  'Walker Order Fulfilment': 'walkerOrderFulfilment',
  'Normal OT Payout': 'onTimeLogin',
  'Best Ranked Station': 'bestRankedStationReward',
  'Festival Incentives': 'festiveIncentives',
  'Walker Cancellation': 'cancellationAmount',
  'SM Cancellation': 'walkerLateLogin'
};

/**
 * Main function to handle GET requests
 * Expected parameters:
 * - spreadsheetId: Google Sheets ID
 * - sheetId: Sheet ID (optional, defaults to 0)
 * - feid: FEID to lookup
 */
function doGet(e) {
  try {
    // Enable CORS
    const response = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      }
    };

    // Get parameters
    const spreadsheetId = e.parameter.spreadsheetId;
    const sheetId = e.parameter.sheetId || 0;
    const feid = e.parameter.feid;

    // Validate required parameters
    if (!spreadsheetId || !feid) {
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Missing required parameters: spreadsheetId and feid are required'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Fetch data from spreadsheet
    const payoutData = fetchPayoutData(spreadsheetId, sheetId, feid);
    
    return ContentService
      .createTextOutput(JSON.stringify(payoutData))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Internal server error: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle POST requests (for future extension)
 */
function doPost(e) {
  return doGet(e);
}

/**
 * Fetch payout data for a specific FEID
 * @param {string} spreadsheetId - Google Sheets ID
 * @param {number} sheetId - Sheet ID (0 for first sheet)
 * @param {string} feid - FEID to lookup
 * @returns {Object} Payout data or error
 */
function fetchPayoutData(spreadsheetId, sheetId, feid) {
  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheets()[sheetId];
    
    if (!sheet) {
      return { error: 'Sheet not found' };
    }

    // Get all data from the sheet
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length < 2) {
      return { error: 'No data found in sheet' };
    }

    // First row contains headers
    const headers = values[0];
    const dataRows = values.slice(1);

    // Find FEID column index
    const feidColumnIndex = headers.findIndex(header => 
      header.toString().toLowerCase().includes('feid') || 
      header.toString().toLowerCase().includes('fe id')
    );

    if (feidColumnIndex === -1) {
      return { error: 'FEID column not found in sheet' };
    }

    // Find the row with matching FEID
    const targetRow = dataRows.find(row => 
      row[feidColumnIndex] && row[feidColumnIndex].toString().trim() === feid.trim()
    );

    if (!targetRow) {
      return { error: 'FEID not found' };
    }

    // Map the data according to our column mappings
    const mappedData = mapRowData(headers, targetRow);
    
    // Calculate total payout
    const totalPayout = calculateTotalPayout(mappedData);
    
    return {
      feid: feid,
      ...mappedData,
      totalPayout: totalPayout
    };

  } catch (error) {
    console.error('Error fetching payout data:', error);
    return { error: 'Failed to fetch data: ' + error.toString() };
  }
}

/**
 * Map row data to our expected format
 * @param {Array} headers - Column headers
 * @param {Array} row - Data row
 * @returns {Object} Mapped data
 */
function mapRowData(headers, row) {
  const mappedData = {};
  
  // Initialize all fields with 0
  Object.values(COLUMN_MAPPINGS).forEach(key => {
    mappedData[key] = 0;
  });

  // Map each column
  headers.forEach((header, index) => {
    const headerStr = header.toString().trim();
    const mappedKey = COLUMN_MAPPINGS[headerStr];
    
    if (mappedKey && row[index] !== undefined) {
      // Convert to number, handling various formats
      const value = parseNumericValue(row[index]);
      mappedData[mappedKey] = value;
    }
  });

  return mappedData;
}

/**
 * Parse numeric value from various formats
 * @param {*} value - Value to parse
 * @returns {number} Parsed number
 */
function parseNumericValue(value) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  // Convert to string and clean
  let strValue = value.toString().trim();
  
  // Remove currency symbols and commas
  strValue = strValue.replace(/[₹$,\s]/g, '');
  
  // Parse as float
  const numValue = parseFloat(strValue);
  
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Calculate total payout
 * @param {Object} data - Mapped payout data
 * @returns {number} Total payout amount
 */
function calculateTotalPayout(data) {
  const positive = (data.basePayout || 0) + 
                   (data.otPayout || 0) + 
                   (data.walkerOrderFulfilment || 0) + 
                   (data.onTimeLogin || 0) + 
                   (data.bestRankedStationReward || 0) + 
                   (data.festiveIncentives || 0);
  
  const negative = (data.cancellationAmount || 0) + 
                   (data.walkerLateLogin || 0);
  
  return positive - negative;
}

/**
 * Test function for development
 */
function testFetchPayoutData() {
  // Replace with your actual spreadsheet ID and FEID for testing
  const testSpreadsheetId = 'YOUR_SPREADSHEET_ID_HERE';
  const testFeid = 'FE94469';
  
  const result = fetchPayoutData(testSpreadsheetId, 0, testFeid);
  console.log('Test result:', JSON.stringify(result, null, 2));
  return result;
}
