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
          <CardTitle className="text-2xl font-bold">Activity Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Login hrs</div>
            <div className="text-lg font-bold">{detail.loginHours}hrs</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Orders</div>
            <div className="text-lg font-bold">{detail.orderCount} orders</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">OT hrs</div>
            <div className="text-lg font-bold">{detail.otHours}hrs</div>
          </div>
        </CardContent>
      </Card>

      {/* TDS Section */}
      {showTdsInfo && (
        <Card className="card-elevated border-2 border-dashed" style={{borderColor: '#3A11BC', backgroundColor: '#bcabff'}}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-black">TDS</CardTitle>
              {detail.tdsApplicable && (
                <Badge className="text-white border-white/20" style={{backgroundColor: '#3A11BC'}}>
                  TDS Applicable
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-black">₹{detail.totalEarningFY.toLocaleString()}</span>
              <span className="text-xl font-bold text-black">₹{detail.totalEarningIncludingThisMonth.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-black">
              <span>Total Earnings in FY</span>
              <span>Total Earnings (Including this month)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Salary Section */}
      <Card className="card-elevated bg-blue-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Salary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Base Payout</span>
            <span className="font-semibold">₹{detail.basePayout.toLocaleString()}</span>
          </div>
          {detail.tdsApplicable && (
            <div className="flex items-center justify-between text-destructive">
              <span>TDS Amount (10%)</span>
              <span className="font-semibold">₹{detail.tdsAmount.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between font-semibold">
            <span>Total Salary</span>
            <span>₹{salaryAfterTDS.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Section */}
      <Card className="card-elevated bg-green-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Rewards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>OT Payout</span>
            <span className="font-semibold">₹{detail.otPayout.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Walker Order Fulfilment</span>
            <span className="font-semibold">₹{detail.walkerOrderFulfilment.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>100% On-time login</span>
            <span className="font-semibold">₹{detail.onTimeLoginReward.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Best Ranked Station Reward</span>
            <span className="font-semibold">₹{detail.bestRankedStationReward.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Festive Incentives</span>
            <span className="font-semibold">₹{detail.festiveIncentives.toLocaleString()}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between font-semibold">
            <span>Total Rewards</span>
            <span>₹{totalRewards.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Deductions Section */}
      <Card className="card-elevated bg-orange-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Deductions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Assets Deduction Amount</span>
            <span className="font-semibold text-destructive">₹{detail.assetDeduction.toLocaleString()}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between font-semibold">
            <span>Total Deductions</span>
            <span className="text-destructive">₹{totalDeductions.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Penalties Section */}
      <Card className="card-elevated bg-red-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Penalties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Cancellation Amount</span>
            <span className="font-semibold text-destructive">₹{detail.cancellationAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Walker late login</span>
            <span className="font-semibold text-destructive">₹{detail.walkerLateLogin.toLocaleString()}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex items-center justify-between font-semibold">
            <span>Total Penalties</span>
            <span className="text-destructive">₹{totalPenalties.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payout Summary */}
      <Card className="card-elevated bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Payout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span>Total Salary</span>
            <span className="font-semibold">₹{salaryAfterTDS.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Rewards</span>
            <span className="font-semibold">₹{totalRewards.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Deductions</span>
            <span className="font-semibold text-destructive">₹{totalDeductions.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total Penalties</span>
            <span className="font-semibold text-destructive">₹{totalPenalties.toLocaleString()}</span>
          </div>
          <hr className="border-gray-300" />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total Payout</span>
            <span>₹{totalPayout.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}