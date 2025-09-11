import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PayoutDetail } from "@/types/walker";
import { calculateTotalPayout } from "@/data/mockData";
import { 
  Clock, 
  Package, 
  Timer, 
  TrendingUp, 
  Award, 
  Target, 
  Gift, 
  AlertTriangle,
  XCircle,
  AlertCircle,
  Calculator,
  TrendingDown
} from "lucide-react";

interface PayoutBreakdownProps {
  detail: PayoutDetail;
  title?: string;
  showTdsInfo?: boolean;
}

interface PayoutItemProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  type?: 'default' | 'reward' | 'deduction' | 'total';
  suffix?: string;
}

function PayoutItem({ icon, label, value, type = 'default', suffix = '' }: PayoutItemProps) {
  const getStyles = () => {
    switch (type) {
      case 'reward':
        return 'text-success border-success/20 bg-success-light';
      case 'deduction':
        return 'text-warning border-warning/20 bg-warning-light';
      case 'total':
        return 'text-success font-bold text-lg border-success bg-success-light shadow-lg';
      default:
        return 'text-foreground border-card-border bg-card';
    }
  };

  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return type === 'total' ? `₹${val.toLocaleString()}` : 
             suffix === 'hrs' ? `${val}${suffix}` :
             suffix === 'orders' ? `${val} ${suffix}` :
             `₹${val.toLocaleString()}`;
    }
    return val;
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg border transition-smooth ${getStyles()}`}>
      <div className="flex items-center gap-3">
        {icon}
        <span className={type === 'total' ? 'text-lg font-medium' : 'font-medium'}>{label}</span>
      </div>
      <span className={type === 'total' ? 'text-xl font-bold' : 'font-semibold'}>
        {formatValue(value)}
      </span>
    </div>
  );
}

export function PayoutBreakdown({ detail, title, showTdsInfo = true }: PayoutBreakdownProps) {
  const totalRewards = detail.otPayout + detail.walkerOrderFulfilment + 
                      detail.onTimeLoginReward + detail.bestRankedStationReward + 
                      detail.festiveIncentives;
                      
  const totalDeductions = detail.assetDeduction;
  const totalPenalties = detail.cancellationAmount + detail.walkerLateLogin;
  const salaryAfterTDS = detail.tdsApplicable ? detail.basePayout - detail.tdsAmount : detail.basePayout;
  const totalPayout = calculateTotalPayout(detail);

  return (
    <div className="space-y-6">
      {title && (
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">{title}</CardTitle>
          </CardHeader>
        </Card>
      )}

      {/* Activity Details */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="activity-heading">Activity Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="basic-subheading mb-1">Login hrs</div>
            <div className="basic-value">{detail.loginHours}hrs</div>
          </div>
          <div>
            <div className="basic-subheading mb-1">Orders</div>
            <div className="basic-value">{detail.orderCount} orders</div>
          </div>
          <div>
            <div className="basic-subheading mb-1">OT hrs</div>
            <div className="basic-value">{detail.otHours}hrs</div>
          </div>
        </CardContent>
      </Card>

      {/* Salary Section */}
      <Card className="card-elevated border-2 border-dashed" style={{backgroundColor: '#E1F2FF', borderColor: '#028EF8'}}>
        <CardHeader className="pb-2">
          <CardTitle className="payout-section-heading">Salary</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="payout-content">Base Payout</span>
            <span className="payout-content" style={{color: '#028EF8', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.basePayout.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Section */}
      <Card className="card-elevated border-2 border-dashed" style={{backgroundColor: '#E3FEEF', borderColor: '#28C269'}}>
        <CardHeader className="pb-2">
          <CardTitle className="payout-section-heading">Rewards</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="payout-content">OT Payout</span>
            <span className="payout-content" style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.otPayout.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="payout-content">Walker Order Fulfilment</span>
            <span className="payout-content" style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.walkerOrderFulfilment.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="payout-content">100% On-time login</span>
            <span className="payout-content" style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.onTimeLoginReward.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="payout-content">Best Ranked Station Reward</span>
            <span className="payout-content" style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.bestRankedStationReward.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="payout-content">Festive Incentives</span>
            <span className="payout-content" style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.festiveIncentives.toLocaleString()}</span>
          </div>
          <hr className="payout-line" />
          <div className="flex items-center justify-between payout-total">
            <span>Total Rewards</span>
            <span style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{totalRewards.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Deductions Section */}
      <Card className="card-elevated border-2 border-dashed" style={{backgroundColor: '#FFFAEB', borderColor: '#DC6803'}}>
        <CardHeader className="pb-2">
          <CardTitle className="payout-section-heading">Deductions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="payout-content">Assets Deduction Amount</span>
            <span className="payout-content" style={{color: '#DC6803', fontSize: '14px', fontWeight: 'bold'}}>-₹{detail.assetDeduction.toLocaleString()}</span>
          </div>
          <hr className="payout-line" />
          <div className="flex items-center justify-between payout-total">
            <span>Total Deductions</span>
            <span style={{color: '#DC6803', fontSize: '14px', fontWeight: 'bold'}}>-₹{totalDeductions.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Penalties Section */}
      <Card className="card-elevated border-2 border-dashed" style={{backgroundColor: '#FFEDED', borderColor: '#FE4141'}}>
        <CardHeader className="pb-2">
          <CardTitle className="payout-section-heading">Penalties</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center justify-between">
            <span className="payout-content">Cancellation Amount</span>
            <span className="payout-content" style={{color: '#FE4141', fontSize: '14px', fontWeight: 'bold'}}>-₹{detail.cancellationAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="payout-content">Walker late login</span>
            <span className="payout-content" style={{color: '#FE4141', fontSize: '14px', fontWeight: 'bold'}}>-₹{detail.walkerLateLogin.toLocaleString()}</span>
          </div>
          <hr className="payout-line" />
          <div className="flex items-center justify-between payout-total">
            <span>Total Penalties</span>
            <span style={{color: '#FE4141', fontSize: '14px', fontWeight: 'bold'}}>-₹{totalPenalties.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* TDS Section */}
      {showTdsInfo && (
        <Card className="card-elevated border-2 border-dashed" style={{backgroundColor: '#EFECFC', borderColor: '#937DEC'}}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="payout-section-heading">TDS</CardTitle>
              {detail.tdsApplicable && (
                <Badge className="text-white" style={{backgroundColor: '#3A11BC', fontSize: '10px'}}>
                  TDS Applicable
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <span style={{color: '#1F2D3D', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.totalEarningFY.toLocaleString()}</span>
              <span style={{color: '#1F2D3D', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.totalEarningIncludingThisMonth.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between" style={{color: '#1F2D3D', fontSize: '10px'}}>
              <span>Total Earnings in FY</span>
              <span>Total Earnings (Including this month)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Final Payout Summary */}
      <Card className="card-elevated bg-gray-50">
        <CardHeader>
          <CardTitle className="payout-section-heading">Payout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="payout-content">Base Payout</span>
            <span className="payout-content" style={{color: '#028EF8', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.basePayout.toLocaleString()}</span>
          </div>
          {detail.tdsApplicable && (
            <div className="flex items-center justify-between">
              <span className="payout-content">TDS Amount (10%)</span>
              <span className="payout-content" style={{color: '#937DEC', fontSize: '14px', fontWeight: 'bold'}}>-₹{detail.tdsAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="payout-content">Total Rewards</span>
            <span className="payout-content" style={{color: '#28C269', fontSize: '14px', fontWeight: 'bold'}}>₹{totalRewards.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="payout-content">Total Deductions</span>
            <span className="payout-content" style={{color: '#DC6803', fontSize: '14px', fontWeight: 'bold'}}>-₹{totalDeductions.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="payout-content">Total Penalties</span>
            <span className="payout-content" style={{color: '#FE4141', fontSize: '14px', fontWeight: 'bold'}}>-₹{totalPenalties.toLocaleString()}</span>
          </div>
          <hr className="payout-line" />
          <div className="flex items-center justify-between payout-total">
            <span>Total Payout</span>
            <span style={{fontSize: '14px', fontWeight: 'bold'}}>₹{totalPayout.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}