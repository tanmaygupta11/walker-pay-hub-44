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
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Activity Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <PayoutItem
            icon={<Clock className="w-5 h-5 text-primary" />}
            label="Login Hours"
            value={detail.loginHours}
            suffix="hrs"
          />
          <PayoutItem
            icon={<Package className="w-5 h-5 text-primary" />}
            label="Order Count"
            value={detail.orderCount}
            suffix="orders"
          />
          <PayoutItem
            icon={<Timer className="w-5 h-5 text-primary" />}
            label="OT Hours"
            value={detail.otHours}
            suffix="hrs"
          />
        </CardContent>
      </Card>

      {/* Rewards */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Rewards
            </CardTitle>
            <Badge variant="secondary" className="bg-success-light text-success">
              +₹{totalRewards.toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <PayoutItem
            icon={<Timer className="w-5 h-5 text-success" />}
            label="OT Payout"
            value={detail.otPayout}
            type="reward"
          />
          <PayoutItem
            icon={<Package className="w-5 h-5 text-success" />}
            label="Walker Order Fulfilment"
            value={detail.walkerOrderFulfilment}
            type="reward"
          />
          <PayoutItem
            icon={<Target className="w-5 h-5 text-success" />}
            label="100% On-time Login"
            value={detail.onTimeLoginReward}
            type="reward"
          />
          <PayoutItem
            icon={<Award className="w-5 h-5 text-success" />}
            label="Best Ranked Station Reward"
            value={detail.bestRankedStationReward}
            type="reward"
          />
          <PayoutItem
            icon={<Gift className="w-5 h-5 text-success" />}
            label="Festive Incentives"
            value={detail.festiveIncentives}
            type="reward"
          />
        </CardContent>
      </Card>

      {/* Deductions */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-warning" />
              Deductions
            </CardTitle>
            <Badge variant="secondary" className="bg-warning-light text-warning">
              -₹{totalDeductions.toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <PayoutItem
            icon={<AlertCircle className="w-5 h-5 text-warning" />}
            label="Asset Deduction Amount"
            value={detail.assetDeduction}
            type="deduction"
          />
        </CardContent>
      </Card>

      {/* Penalties */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Penalties
            </CardTitle>
            <Badge variant="secondary" className="bg-destructive-light text-destructive">
              -₹{totalPenalties.toLocaleString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <PayoutItem
            icon={<XCircle className="w-5 h-5 text-destructive" />}
            label="Cancellation Amount"
            value={detail.cancellationAmount}
            type="deduction"
          />
          <PayoutItem
            icon={<AlertTriangle className="w-5 h-5 text-destructive" />}
            label="Walker Late Login"
            value={detail.walkerLateLogin}
            type="deduction"
          />
        </CardContent>
      </Card>

      {/* TDS Amount Section */}
      {showTdsInfo && (
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              TDS Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <PayoutItem
              icon={<span className="w-5 h-5 text-primary flex items-center justify-center font-bold">₹</span>}
              label="Total Earning in FY"
              value={detail.totalEarningFY}
            />
            <PayoutItem
              icon={<span className="w-5 h-5 text-primary flex items-center justify-center font-bold">₹</span>}
              label="Base Payout"
              value={detail.basePayout}
            />
            <PayoutItem
              icon={<span className="w-5 h-5 text-primary flex items-center justify-center font-bold">₹</span>}
              label="Total Earning Including This Month"
              value={detail.totalEarningIncludingThisMonth}
            />
            <div className="flex items-center justify-between p-4 rounded-lg border transition-smooth text-foreground border-card-border bg-card">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-primary" />
                <span className="font-medium">TDS Applicable</span>
              </div>
              <span className="font-semibold">{detail.tdsApplicable ? 'Yes' : 'No'}</span>
            </div>
            {detail.tdsApplicable && (
              <>
                <PayoutItem
                  icon={<Calculator className="w-5 h-5 text-warning" />}
                  label="TDS Amount"
                  value={detail.tdsAmount}
                  type="deduction"
                />
                <PayoutItem
                  icon={<span className="w-5 h-5 text-success flex items-center justify-center font-bold">₹</span>}
                  label="Salary After TDS"
                  value={salaryAfterTDS}
                  type="reward"
                />
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Total Calculation */}
      <Card className="card-payout">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="font-medium">
                {detail.tdsApplicable ? 'Salary After TDS:' : 'Base Payout:'}
              </span>
              <span className="font-semibold">
                ₹{salaryAfterTDS.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-lg text-success">
              <span className="font-medium">+ Total Rewards:</span>
              <span className="font-semibold">₹{totalRewards.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg text-warning">
              <span className="font-medium">- Total Deductions:</span>
              <span className="font-semibold">₹{totalDeductions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-lg text-destructive">
              <span className="font-medium">- Total Penalties:</span>
              <span className="font-semibold">₹{totalPenalties.toLocaleString()}</span>
            </div>
            <hr className="border-success/20" />
            <PayoutItem
              icon={<span className="w-6 h-6 text-success flex items-center justify-center font-bold text-xl">₹</span>}
              label="Total Payout"
              value={totalPayout}
              type="total"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}