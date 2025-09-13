import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PayoutDetail } from "@/types/walker";
import { calculateTotalPayout } from "@/data/mockData";
import { useState, useEffect } from "react";
import { usePayoutData } from "@/hooks/usePayoutData";
import { PayoutData } from "@/services/payoutService";
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
  Info,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface BillingCyclePayoutBreakdownProps {
  detail: PayoutDetail;
  title?: string;
  showTdsInfo?: boolean;
  feId?: string;
  useDynamicData?: boolean;
  spreadsheetId?: string;
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

function InfoModal({ isOpen, onClose, title, content }: InfoModalProps) {
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
        </div>
      </div>
    </div>
  );
}

export function BillingCyclePayoutBreakdown({ 
  detail, 
  title, 
  showTdsInfo = true, 
  feId = "12345",
  useDynamicData = false,
  spreadsheetId
}: BillingCyclePayoutBreakdownProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  
  // Collapsible state for each section
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [deductionsOpen, setDeductionsOpen] = useState(false);
  const [penaltiesOpen, setPenaltiesOpen] = useState(false);
  const [tdsOpen, setTdsOpen] = useState(false);

  // Dynamic data hook
  const { payoutData, loading, error, fetchPayoutData } = usePayoutData();

  // Fetch dynamic data when component mounts or feId changes
  useEffect(() => {
    if (useDynamicData && feId && spreadsheetId) {
      fetchPayoutData(feId, { spreadsheetId });
    }
  }, [useDynamicData, feId, spreadsheetId, fetchPayoutData]);
  
  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };

  // Helper functions to generate modal content for Billing Cycle
  const getOTPayoutContent = () => (
    <div className="space-y-3">
      <div>
        <h4 className="font-semibold text-gray-900">Over-Time Payout</h4>
        <p className="text-sm text-gray-600 mt-1">Eligibility criteria - Paid when worked extra hours than normal</p>
        <p className="text-sm text-gray-600">OT Payout = No.of Extra hours worked x Rs.10</p>
      </div>
      <div>
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

  // Get data source (dynamic or static)
  const dataSource = useDynamicData && payoutData ? payoutData : detail;
  
  // Billing Cycle specific calculations
  const totalRewards = (dataSource.otPayout || 0) + (dataSource.walkerOrderFulfilment || 0) + (dataSource.festiveIncentives || 0);
  const totalDeductions = dataSource.assetDeduction || 0;
  const totalPenalties = (dataSource.cancellationAmount || 0) + (dataSource.walkerLateLogin || 0);
  const salaryAfterTDS = dataSource.tdsApplicable ? (dataSource.basePayout || 0) - (dataSource.tdsAmount || 0) : (dataSource.basePayout || 0);
  const totalPayout = useDynamicData && payoutData ? payoutData.totalPayout : 23960;

  return (
    <div className="space-y-6">
      {title && (
        <Card className="card-elevated">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">{title}</CardTitle>
            {useDynamicData && loading && (
              <p className="text-sm text-gray-500 mt-2">Loading payout data...</p>
            )}
            {useDynamicData && error && (
              <p className="text-sm text-red-500 mt-2">Error: {error}</p>
            )}
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

      {/* Main Payout Card */}
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Payout Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          
          {/* Base Payout */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Base Payout</span>
              {loading && <span className="text-xs text-gray-500">Loading...</span>}
            </div>
            <span className="font-bold text-blue-600">₹{(dataSource.basePayout || 0).toLocaleString()}</span>
          </div>

          {/* Rewards Collapsible */}
          <Collapsible open={rewardsOpen} onOpenChange={setRewardsOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Total Rewards</span>
                  {rewardsOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                </div>
                <span className="font-bold text-green-600">+₹{totalRewards.toLocaleString()}</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 ml-8 space-y-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">Rewards Details</span>
                  <button
                    onClick={() => openModal('Rewards Information', 
                      <div className="space-y-4">
                        <h4 className="font-semibold">Rewards Section</h4>
                        <p className="text-sm text-gray-600">This section includes all performance-based rewards and incentives.</p>
                        <div className="space-y-3">
                          {getOTPayoutContent()}
                          {getWalkerOrderFulfilmentContent()}
                          {getOnTimeLoginContent()}
                          {getBestRankedStationContent()}
                          {getFestiveIncentivesContent()}
                        </div>
                      </div>
                    )}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-green-200">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">OT Payout</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">₹{(dataSource.otPayout || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Walker Order Fulfilment</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">₹{(dataSource.walkerOrderFulfilment || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">100% On-time login</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-500">₹{(dataSource.onTimeLogin || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Best Ranked Station Reward</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-500">₹{(dataSource.bestRankedStationReward || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-pink-500" />
                    <span className="text-sm">Festive Incentives</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">₹{(dataSource.festiveIncentives || 0).toLocaleString()}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Deductions Collapsible */}
          <Collapsible open={deductionsOpen} onOpenChange={setDeductionsOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Total Deductions</span>
                  {deductionsOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                </div>
                <span className="font-bold text-orange-600">-₹{totalDeductions.toLocaleString()}</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 ml-8 space-y-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">Deductions Details</span>
                  <button
                    onClick={() => openModal('Deductions Information', 
                      <div className="space-y-4">
                        <h4 className="font-semibold">Deductions Section</h4>
                        <p className="text-sm text-gray-600">This section includes all asset-related deductions from your payout.</p>
                        <div className="space-y-3">
                          <div className="space-y-3">
                            <h5 className="font-medium">Assets Deduction Amount</h5>
                            {/** reuse existing content */}
                            {(<div className="space-y-3"><p className="text-sm text-gray-600">Criteria : It is charged when the no. of t-shirts used is greater than 1</p><p className="text-sm text-gray-600">Calculation = (No. of tshirts used-1) x Rs.200</p><p className="text-sm text-gray-600">Your FE ID - FE001234</p></div>)}
                          </div>
                        </div>
                      </div>
                    )}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-orange-200">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Assets Deduction Amount</span>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">-₹{(dataSource.assetDeduction || 0).toLocaleString()}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Penalties Collapsible */}
          <Collapsible open={penaltiesOpen} onOpenChange={setPenaltiesOpen}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Total Penalties</span>
                  {penaltiesOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                </div>
                <span className="font-bold text-red-600">-₹{totalPenalties.toLocaleString()}</span>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 ml-8 space-y-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">Penalties Details</span>
                  <button
                    onClick={() => openModal('Penalties Information', 
                      <div className="space-y-4">
                        <h4 className="font-semibold">Penalties Section</h4>
                        <p className="text-sm text-gray-600">This section includes penalties applied for policy violations.</p>
                        <div className="space-y-3">
                          {getCancellationAmountContent()}
                          {getWalkerLateLoginContent()}
                        </div>
                      </div>
                    )}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-red-200">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Cancellation Amount</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">-₹{(dataSource.cancellationAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Walker late login</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600">-₹{(dataSource.walkerLateLogin || 0).toLocaleString()}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* TDS Collapsible */}
          {showTdsInfo && (
            <Collapsible open={tdsOpen} onOpenChange={setTdsOpen}>
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg border border-purple-200 hover:bg-purple-50 cursor-pointer transition-colors" style={{backgroundColor: '#bcabff'}}>
                  <div className="flex items-center gap-3">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    <span className="font-medium">TDS</span>
                    {tdsOpen ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                    {detail.tdsApplicable && (
                      <Badge className="text-white ml-2" style={{backgroundColor: '#3A11BC', fontSize: '10px'}}>
                        TDS Applicable
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-purple-600">-₹{detail.tdsAmount.toLocaleString()}</span>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 ml-8 space-y-2 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">TDS Details</span>
                    <button
                      onClick={() => openModal('TDS', <div className="space-y-3"><p className="text-sm text-gray-600">Aadhar Status : Verified</p><p className="text-sm text-gray-600">PAN Status : Verified</p><p className="text-sm text-gray-600">Criteria :</p><p className="text-sm text-gray-600">TDS is applied if</p><p className="text-sm text-gray-600">     FY Salary &gt; 1,00,000</p><p className="text-sm text-gray-600">          OR</p><p className="text-sm text-gray-600">     Salary(in month) &gt; 30,000</p><p className="text-sm text-gray-600">Your FE ID - FE001234</p></div>)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Info className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 pl-4 border-l-2 border-purple-200">
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm">Total Earnings in FY</span>
                    <span className="text-sm font-semibold">₹{detail.totalEarningFY.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm">Total Earnings (Including this month)</span>
                    <span className="text-sm font-semibold">₹{detail.totalEarningIncludingThisMonth.toLocaleString()}</span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Total Payout */}
          <div className="mt-6 pt-4 border-t-2 border-gray-200">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 border-2 border-primary shadow-md">
              <div className="flex items-center gap-3">
                <Calculator className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">Total Payout</span>
              </div>
              <span className="text-2xl font-bold text-primary">₹{totalPayout.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <InfoModal
        isOpen={modalOpen}
        onClose={closeModal}
        title={modalTitle}
        content={modalContent}
      />
    </div>
  );
}