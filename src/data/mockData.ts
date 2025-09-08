import { WalkerDetails, PayoutDetail, DayWiseDetail, BillingCycle } from '@/types/walker';

// Mock verified walkers database
export const VERIFIED_WALKERS: WalkerDetails[] = [
  {
    walkerName: 'Rajesh Kumar',
    feId: 'FE001',
    walkerNumber: '9876543210',
    stationName: 'New Delhi Railway Station'
  },
  {
    walkerName: 'Priya Sharma',
    feId: 'FE002', 
    walkerNumber: '9876543211',
    stationName: 'Mumbai Central'
  },
  {
    walkerName: 'Arjun Singh',
    feId: 'FE003',
    walkerNumber: '9876543212', 
    stationName: 'Bangalore City'
  }
];

export const BILLING_CYCLES: BillingCycle[] = [
  {
    id: 'bc001',
    label: 'January 2024 (1st - 31st)',
    startDate: '2024-01-01',
    endDate: '2024-01-31'
  },
  {
    id: 'bc002',
    label: 'February 2024 (1st - 29th)',
    startDate: '2024-02-01',
    endDate: '2024-02-29'
  },
  {
    id: 'bc003',
    label: 'March 2024 (1st - 31st)',
    startDate: '2024-03-01',
    endDate: '2024-03-31'
  }
];

export const STATION_NAMES = [
  'New Delhi Railway Station',
  'Mumbai Central',
  'Bangalore City',
  'Chennai Central',
  'Kolkata Howrah',
  'Hyderabad Deccan',
  'Pune Junction',
  'Ahmedabad Junction'
];

// Mock aggregate payout data
export const MOCK_AGGREGATE_PAYOUT: PayoutDetail = {
  loginHours: 184,
  orderCount: 245,
  otHours: 12,
  otPayout: 2400,
  walkerOrderFulfilment: 4900,
  onTimeLoginReward: 1000,
  bestRankedStationReward: 500,
  festiveIncentives: 750,
  assetDeduction: 200,
  cancellationAmount: 150,
  walkerLateLogin: 300,
  basePayout: 18400,
  // TDS related fields
  totalEarningFY: 185000,
  totalEarningIncludingThisMonth: 205000,
  tdsApplicable: true,
  tdsAmount: 1840
};

// Mock day-wise data
export const MOCK_DAYWISE_DATA: DayWiseDetail[] = [
  {
    date: '2024-01-01',
    dayName: 'Monday',
    loginHours: 8,
    orderCount: 12,
    otHours: 1,
    otPayout: 200,
    walkerOrderFulfilment: 240,
    onTimeLoginReward: 50,
    bestRankedStationReward: 25,
    festiveIncentives: 100,
    assetDeduction: 10,
    cancellationAmount: 5,
    walkerLateLogin: 0,
    basePayout: 800,
    // TDS related fields
    totalEarningFY: 185000,
    totalEarningIncludingThisMonth: 205000,
    tdsApplicable: false,
    tdsAmount: 0
  },
  {
    date: '2024-01-02',
    dayName: 'Tuesday',
    loginHours: 7.5,
    orderCount: 10,
    otHours: 0,
    otPayout: 0,
    walkerOrderFulfilment: 200,
    onTimeLoginReward: 50,
    bestRankedStationReward: 25,
    festiveIncentives: 0,
    assetDeduction: 0,
    cancellationAmount: 0,
    walkerLateLogin: 15,
    basePayout: 750,
    // TDS related fields
    totalEarningFY: 185000,
    totalEarningIncludingThisMonth: 205000,
    tdsApplicable: false,
    tdsAmount: 0
  }
];

export const calculateTotalPayout = (detail: PayoutDetail): number => {
  const rewards = detail.otPayout + detail.walkerOrderFulfilment + 
                 detail.onTimeLoginReward + detail.bestRankedStationReward + 
                 detail.festiveIncentives;
                 
  const deductions = detail.assetDeduction;
  const penalties = detail.cancellationAmount + detail.walkerLateLogin;
  const salaryAfterTDS = detail.basePayout - detail.tdsAmount;
                     
  return salaryAfterTDS + rewards - deductions - penalties;
};