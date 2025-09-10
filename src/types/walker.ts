export interface WalkerDetails {
  walkerName: string;
  feId: string;
  walkerNumber: string;
  stationName: string;
}

export interface PayoutDetail {
  loginHours: number;
  orderCount: number;
  otHours: number;
  otPayout: number;
  walkerOrderFulfilment: number;
  onTimeLoginReward: number;
  bestRankedStationReward: number;
  festiveIncentives: number;
  assetDeduction: number;
  cancellationAmount: number;
  walkerLateLogin: number;
  basePayout: number;
  // TDS related fields
  totalEarningFY: number;
  totalEarningIncludingThisMonth: number;
  tdsApplicable: boolean;
  tdsAmount: number;
}

export interface DayWiseDetail extends PayoutDetail {
  date: string;
  dayName: string;
}

export interface BillingCycle {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
}

export type DetailType = 'aggregate' | 'day-wise';
export type SatisfactionResponse = 'yes' | 'no' | null;