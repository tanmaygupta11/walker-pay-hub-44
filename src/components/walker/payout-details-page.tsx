import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PayoutBreakdown } from "./payout-breakdown";
import { Calendar, ChevronLeft, User, Hash, Phone, MapPin } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DayPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { MOCK_AGGREGATE_PAYOUT, MOCK_DAYWISE_DATA } from "@/data/mockData";
import { generateBillingCyclesForYear } from "@/lib/billing-cycles";
import { format } from "date-fns";

interface PayoutDetailsPageProps {
  onBack: () => void;
  onViewDaywise: () => void;
  onProceed: () => void;
  // kept optional for compatibility with previous version
  selectedBillingCycle?: string;
  setSelectedBillingCycle?: (value: string) => void;
  restoreScrollY?: number;
  walkerData?: {
    walkerName: string;
    feId: string;
    walkerNumber: string;
    stationName: string;
  } | null;
}

export function PayoutDetailsPage({ onBack, onViewDaywise, onProceed, selectedBillingCycle: selectedBillingCycleProp, setSelectedBillingCycle: setSelectedBillingCycleProp, walkerData }: PayoutDetailsPageProps) {
  const [selectedBillingCycleState, setSelectedBillingCycleState] = useState("");
  const [selectedView, setSelectedView] = useState<"billing" | "daywise">("billing");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const selectedBillingCycle = selectedBillingCycleProp ?? selectedBillingCycleState;
  const setSelectedBillingCycle = setSelectedBillingCycleProp ?? setSelectedBillingCycleState;

  const billingCycles = generateBillingCyclesForYear(new Date().getFullYear());

  // Preselect previous billing cycle based on current month and show details immediately
  useEffect(() => {
    if (!selectedBillingCycle) {
      const now = new Date();
      const prevMonthIndex = (now.getMonth() + 11) % 12; // previous calendar month
      const defaultCycle = billingCycles.find((c) => c.monthIndex === prevMonthIndex) ?? billingCycles[0];
      if (defaultCycle) {
        setSelectedBillingCycle(defaultCycle.label);
      }
    }
  }, [selectedBillingCycle, billingCycles, setSelectedBillingCycle]);

  // Helpers for day-wise details (mirrors DaywiseDetailsPage)
  const getSelectedDayData = () => {
    if (!selectedDate) return null;
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    return MOCK_DAYWISE_DATA.find(d => d.date === dateString) || MOCK_DAYWISE_DATA[0];
  };

  const getDetailsTitle = () => {
    if (!selectedDate) return "";
    const dayData = getSelectedDayData();
    if (dayData) {
      const formattedDate = format(selectedDate, 'dd MMM yyyy');
      return `${dayData.dayName}, ${formattedDate}`;
    }
    return format(selectedDate, 'dd MMM yyyy');
  };

  // Default Day-wise selection to previous day when switching to Day-wise
  useEffect(() => {
    if (selectedView === "daywise" && !selectedDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      setSelectedDate(yesterday);
    }
  }, [selectedView, selectedDate]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/src/assets/zomato-logo.png" 
              alt="Zomato Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Payout Details
          </h1>
          <p className="text-muted-foreground">
            View your earnings and deductions
          </p>
        </div>

        {/* Walker Basic Information (compact) */}
        {walkerData && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Walker Name</p>
                    <p className="font-semibold">{walkerData.walkerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Hash className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">FE ID</p>
                    <p className="font-semibold">{walkerData.feId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Walker Number</p>
                    <p className="font-semibold">{walkerData.walkerNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Station Name</p>
                    <p className="font-semibold">{walkerData.stationName}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6">
          {/* Selection section: Billing cycle vs Day-wise */}
          <div className="space-y-3">
            <div className="font-semibold text-lg sm:text-xl text-center">Select payout details based on</div>
            <RadioGroup
              value={selectedView}
              onValueChange={(val) => setSelectedView(val as "billing" | "daywise")}
              className="flex items-center justify-center gap-8"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem id="view-billing" value="billing" className="h-5 w-5" />
                <Label
                  htmlFor="view-billing"
                  className={(selectedView === "billing" ? "text-primary font-medium " : "") + "cursor-pointer text-base sm:text-lg"}
                >
                  Billing cycle
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <RadioGroupItem id="view-daywise" value="daywise" className="h-5 w-5" />
                <Label
                  htmlFor="view-daywise"
                  className={(selectedView === "daywise" ? "text-primary font-medium " : "") + "cursor-pointer text-base sm:text-lg"}
                >
                  Day-wise
                </Label>
              </div>
            </RadioGroup>
          </div>
          {/* Conditional selector below the radio group */}
          {selectedView === "billing" ? (
            <div>
              <Select value={selectedBillingCycle} onValueChange={setSelectedBillingCycle}>
                <SelectTrigger className="h-12 text-base sm:text-lg">
                  <SelectValue placeholder="Choose billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  {billingCycles.map((cycle) => (
                    <SelectItem key={cycle.label} value={cycle.label} className="text-base sm:text-lg">
                      {cycle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto text-base sm:text-lg"
                  />
                </PopoverContent>
              </Popover>
              {/* Inline Day-wise Details */}
              {selectedDate && getSelectedDayData() && (
                <div className="mt-6">
                  <PayoutBreakdown 
                    detail={getSelectedDayData()!}
                    showTdsInfo={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* Payout Breakdown - Billing cycle only */}
          {selectedView === "billing" && selectedBillingCycle && (
            <>
              <PayoutBreakdown 
                detail={MOCK_AGGREGATE_PAYOUT}
              />
            </>
          )}

          {/* Persistent Actions */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-accent/60 transition-smooth">
              Home
            </Button>
            <Button onClick={onProceed}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}