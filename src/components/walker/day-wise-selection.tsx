import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { DayWiseDetail } from "@/types/walker";
import { MOCK_DAYWISE_DATA } from "@/data/mockData";

interface DayWiseSelectionProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onBack: () => void;
  onViewDetails: () => void;
}

export function DayWiseSelection({
  selectedDate,
  onDateChange,
  onBack,
  onViewDetails
}: DayWiseSelectionProps) {
  const formatDateOption = (detail: DayWiseDetail) => {
    const date = new Date(detail.date);
    const formattedDate = date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    return `${detail.dayName}, ${formattedDate}`;
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className="card-elevated">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-primary">Day-wise Details</CardTitle>
          <CardDescription className="text-base">
            Select a specific date to view your detailed payout breakdown
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Select Date
            </label>
            <Select value={selectedDate} onValueChange={onDateChange}>
              <SelectTrigger className="w-full h-12 transition-smooth focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Choose a date to view details" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_DAYWISE_DATA.map((detail) => (
                  <SelectItem key={detail.date} value={detail.date}>
                    {formatDateOption(detail)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2 px-6 h-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button 
              onClick={onViewDetails}
              disabled={!selectedDate}
              className="px-8 h-12 bg-primary hover:bg-primary-muted transition-smooth"
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="card-elevated border-primary/20 bg-primary-light/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-primary font-medium">Selected Date</div>
              <div className="text-lg font-semibold text-primary">
                {formatDateOption(MOCK_DAYWISE_DATA.find(d => d.date === selectedDate)!)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}