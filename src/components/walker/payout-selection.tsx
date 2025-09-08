import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { CalendarDays, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { BillingCycle, DetailType } from "@/types/walker";
import { BILLING_CYCLES } from "@/data/mockData";

interface PayoutSelectionProps {
  selectedBillingCycle: string;
  selectedDetailType: DetailType | null;
  onBillingCycleChange: (cycle: string) => void;
  onDetailTypeChange: (type: DetailType) => void;
  onNext: () => void;
  onBack: () => void;
}

export function PayoutSelection({
  selectedBillingCycle,
  selectedDetailType,
  onBillingCycleChange,
  onDetailTypeChange,
  onNext,
  onBack
}: PayoutSelectionProps) {
  const canProceed = selectedBillingCycle && selectedDetailType;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="w-5 h-5 text-primary" />
            Choose Billing Cycle
          </CardTitle>
          <CardDescription>
            Select the billing period for your payout details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBillingCycle} onValueChange={onBillingCycleChange}>
            <SelectTrigger className="w-full h-12 transition-smooth focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              {BILLING_CYCLES.map((cycle) => (
                <SelectItem key={cycle.id} value={cycle.id}>
                  {cycle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="w-5 h-5 text-primary" />
            Select Details Type
          </CardTitle>
          <CardDescription>
            Choose how you want to view your payout information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedDetailType || ''}
            onValueChange={(value) => onDetailTypeChange(value as DetailType)}
            className="space-y-4"
          >
            <div className="flex items-center space-x-4 p-4 rounded-lg border border-card-border hover:bg-accent/50 transition-smooth cursor-pointer">
              <RadioGroupItem value="aggregate" id="aggregate" />
              <Label 
                htmlFor="aggregate" 
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Aggregate Details</div>
                    <div className="text-sm text-muted-foreground">
                      View summary of all activities for the entire billing cycle
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-lg border border-card-border hover:bg-accent/50 transition-smooth cursor-pointer">
              <RadioGroupItem value="day-wise" id="day-wise" />
              <Label 
                htmlFor="day-wise" 
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Day-wise Details</div>
                    <div className="text-sm text-muted-foreground">
                      View detailed breakdown for each individual day
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="px-8 h-12"
        >
          Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={!canProceed}
          className="px-8 h-12 bg-primary hover:bg-primary-muted transition-smooth"
        >
          Next
        </Button>
      </div>
    </div>
  );
}