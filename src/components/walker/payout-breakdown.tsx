import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PayoutDetail } from "@/types/walker";
import { calculateTotalPayout } from "@/data/mockData";
import { useState } from "react";
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
  TrendingDown,
  Info
} from "lucide-react";

interface PayoutBreakdownProps {
  detail: PayoutDetail;
  title?: string;
  showTdsInfo?: boolean;
  isBillingCycle?: boolean;
  feId?: string;
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

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  showDayWiseMessage?: boolean;
}

function InfoModal({ isOpen, onClose, title, content, showDayWiseMessage = false }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-6">
          {content}
          {showDayWiseMessage && (
            <p className="text-gray-600 mt-4 text-sm">
              Check day-wise records for each day
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function PayoutBreakdown({ detail, title, showTdsInfo = true, isBillingCycle = false, feId = "12345" }: PayoutBreakdownProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  
  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

  // Helper functions to generate modal content
  const getOTPayoutContent = () => (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-gray-900">Over-Time Payout</h4>
        <p className="text-sm text-gray-600 mt-1">Eligibility criteria - Paid when worked extra hours than normal</p>
        <p className="text-sm text-gray-600">OT Payout = No.of Extra hours worked x Rs.10</p>
      </div>
      <div>
        <span className="text-sm font-medium" style={{color: '#000000'}}>Eligibility Status : </span>
        <span className="text-sm font-medium" style={{color: '#1F9A53'}}>Eligible</span>
      </div>
      <div>
        <p className="text-sm text-gray-600">Your FE ID - FE001234</p>
      </div>
    </div>
  );

  const getWalkerOrderFulfilmentContent = () => (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-600">Eligibility criteria - Paid when you fulfill all the orders on time</p>
        <p className="text-sm text-gray-600">Calculation = </p>
      </div>
      <div>
      <span className="text-sm font-medium" style={{color: '#000000'}}>Eligibility Status : </span>
        <span className="text-sm font-medium" style={{color: '#1F9A53'}}>Eligible</span>
      </div>
      <div>
        <p className="text-sm text-gray-600">Your FE ID - FE001234</p>
      </div>
    </div>
  );

  const getOnTimeLoginContent = () => (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-600">Eligibility criteria - Paid when you have loged in on time</p>
        <p className="text-sm text-gray-600">Calculation = </p>
      </div>
      <div>
        <span className="text-sm font-medium" style={{color: '#000000'}}>Eligibility Status : </span>
        <span className="text-sm font-medium" style={{color: '#000000'}}>Not Eligible</span>
      </div>
      <div>
        <p className="text-sm text-gray-600">Your FE ID - FE001234</p>
      </div>
    </div>
  );

  const getBestRankedStationContent = () => (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-600">Eligibility criteria - </p>
        <p className="text-sm text-gray-600">Calculation = </p>
      </div>
      <div>
        <span className="text-sm font-medium" style={{color: '#000000'}}>Eligibility Status : </span>
        <span className="text-sm font-medium" style={{color: '#000000'}}>Not Eligible</span>
      </div>
      <div>
        <p className="text-sm text-gray-600">Your FE ID - FE001234</p>
      </div>
    </div>
  );

  const getFestiveIncentivesContent = () => (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-600">Eligibility criteria - Paid according to the festivals</p>
        <p className="text-sm text-gray-600">Calculation = </p>
      </div>
      <div>
        <span className="text-sm font-medium" style={{color: '#000000'}}>Eligibility Status : </span>
        <span className="text-sm font-medium" style={{color: '#1F9A53'}}>Eligible</span>
      </div>
      <div>
        <p className="text-sm text-gray-600">Your FE ID - FE001234</p>
      </div>
    </div>
  );

  const getCancellationAmountContent = () => (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-600">Criteria - Penalty given if you have cancelled more than 5 orders</p>
        <p className="text-sm text-gray-600">Calculation = No. of orders cancelled x Rs. 15</p>
      </div>
      <div>
        <span className="text-sm font-medium" style={{color: '#EA0000'}}>Penalty Applied</span>
      </div>
      <div>
        <p className="text-sm text-gray-600">Your FE ID - FE001234</p>
      </div>
    </div>
  );

  const getWalkerLateLoginContent = () => (
    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-600">Criteria - Penalty given if you have logined late for more than 5 days</p>
        <p className="text-sm text-gray-600">Calculation = No. of late logins x Rs. 15</p>
      </div>
      <div>
        <span className="text-sm font-medium" style={{color: '#EA0000'}}>Penalty Applied</span>
      </div>
      <div>
        <p className="text-sm text-gray-600">Your FE ID - FE001234</p>
      </div>
    </div>
  );

  // Updated total rewards calculation - Best Ranked Station Reward and 100% On-time Login are now "NA"
  const totalRewards = detail.otPayout + detail.walkerOrderFulfilment + detail.festiveIncentives;
                      
  const totalDeductions = detail.assetDeduction;
  const totalPenalties = detail.cancellationAmount + detail.walkerLateLogin;
  const salaryAfterTDS = detail.tdsApplicable ? detail.basePayout - detail.tdsAmount : detail.basePayout;
  const totalPayout = 23960; // Updated to ₹23960 as requested

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
            <div className="flex items-center gap-2">
              <span className="payout-content">OT Payout</span>
              <button
                onClick={() => openModal('OT Payout', getOTPayoutContent())}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <span className="payout-content" style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.otPayout.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="payout-content">Walker Order Fulfilment</span>
              <button
                onClick={() => openModal('Walker Order Fulfilment', getWalkerOrderFulfilmentContent())}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <span className="payout-content" style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.walkerOrderFulfilment.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="payout-content">100% On-time login</span>
              <button
                onClick={() => openModal('100% On-time login', getOnTimeLoginContent())}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <span className="payout-content" style={{color: '#000000', fontSize: '14px', fontWeight: 'bold'}}>NA</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="payout-content">Best Ranked Station Reward</span>
              <button
                onClick={() => openModal('Best Ranked Station Reward', getBestRankedStationContent())}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <span className="payout-content" style={{color: '#000000', fontSize: '14px', fontWeight: 'bold'}}>NA</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="payout-content">Festive Incentives</span>
              <button
                onClick={() => openModal('Festive Incentives', getFestiveIncentivesContent())}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <span className="payout-content" style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹{detail.festiveIncentives.toLocaleString()}</span>
          </div>
          <hr className="payout-line" />
          <div className="flex items-center justify-between payout-total">
            <span>Total Rewards</span>
            <span style={{color: '#1F9A53', fontSize: '14px', fontWeight: 'bold'}}>₹8050</span>
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
            <div className="flex items-center gap-2">
              <span className="payout-content">Assets Deduction Amount</span>
              <button
                onClick={() => openModal('Assets Deduction Amount', <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                  Criteria - If more than 1 t-shirts have been used in the orders, then 100% of the assets deduction will be applied
                  </p>
                  <p className="text-sm text-gray-600">
                  Calculation = No. of t-shirts used x Price of t-shirt
                  </p>
                  <p className="text-sm text-gray-600">Your FE ID - FE001234</p></div>)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
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
            <div className="flex items-center gap-2">
              <span className="payout-content">Cancellation Amount</span>
              <button
                onClick={() => openModal('Cancellation Amount', getCancellationAmountContent())}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
            <span className="payout-content" style={{color: '#FE4141', fontSize: '14px', fontWeight: 'bold'}}>-₹{detail.cancellationAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="payout-content">Walker late login</span>
              <button
                onClick={() => openModal('Walker late login', getWalkerLateLoginContent())}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Info className="h-4 w-4" />
              </button>
            </div>
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
              <div className="flex items-center gap-2">
                <CardTitle className="payout-section-heading">TDS</CardTitle>
                <button
                  onClick={() => openModal('TDS', <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      PAN Status - Linked<br/>
                      Aadhar Status - Linked<br/>
                      <br/>
                      Criteria - <br/>
                      If the total earnings in Full Year is more than ₹1,00,000<br/>
                      OR<br/>
                      If the total earnings in this month is more than ₹30,000<br/>
                      then 10% TDS will be applied
                      </p>
                    <p className="text-sm text-gray-600">Your FE ID - FE001234</p></div>)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </button>
              </div>
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
            <span className="payout-content" style={{color: '#28C269', fontSize: '14px', fontWeight: 'bold'}}>₹8050</span>
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
            <span style={{fontSize: '14px', fontWeight: 'bold'}}>₹23960</span>
          </div>
        </CardContent>
      </Card>
      
      <InfoModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        title={modalTitle}
        content={modalContent}
        showDayWiseMessage={isBillingCycle}
      />
    </div>
  );
}