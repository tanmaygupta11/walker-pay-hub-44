import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PayoutBreakdown } from "./payout-breakdown";
import { Calendar, ChevronLeft } from "lucide-react";
import { MOCK_AGGREGATE_PAYOUT } from "@/data/mockData";

interface PayoutDetailsPageProps {
  onBack: () => void;
  onViewDaywise: () => void;
  onProceed: () => void;
}

export function PayoutDetailsPage({ onBack, onViewDaywise, onProceed }: PayoutDetailsPageProps) {
  const [selectedBillingCycle, setSelectedBillingCycle] = useState("");

  const billingCycles = [
    { id: "2024-01", label: "January 2024 (1st - 31st Jan)" },
    { id: "2023-12", label: "December 2023 (1st - 31st Dec)" },
    { id: "2023-11", label: "November 2023 (1st - 30th Nov)" },
  ];

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

        <div className="space-y-6">
          {/* Billing Cycle Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Billing Cycle</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedBillingCycle} onValueChange={setSelectedBillingCycle}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose billing cycle" />
                </SelectTrigger>
                <SelectContent>
                  {billingCycles.map((cycle) => (
                    <SelectItem key={cycle.id} value={cycle.id}>
                      {cycle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Day-wise Option */}
          {selectedBillingCycle && (
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Aggregate Payout Details</h2>
              <Button 
                variant="outline" 
                onClick={onViewDaywise}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                View Day-wise Details
              </Button>
            </div>
          )}

          {/* Payout Breakdown */}
          {selectedBillingCycle && (
            <>
              <PayoutBreakdown 
                detail={MOCK_AGGREGATE_PAYOUT}
                title="Aggregate Payout Details"
              />
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button onClick={onProceed}>
                  Continue
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}