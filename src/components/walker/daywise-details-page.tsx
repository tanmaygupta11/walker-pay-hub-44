import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PayoutBreakdown } from "./payout-breakdown";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { MOCK_DAYWISE_DATA } from "@/data/mockData";

interface DaywiseDetailsPageProps {
<<<<<<< HEAD
  onBack?: () => void;
  onBackWithState?: (state: { scrollY: number }) => void;
  onProceed: () => void;
}

export function DaywiseDetailsPage({ onBack, onBackWithState, onProceed }: DaywiseDetailsPageProps) {
=======
  onBack: () => void;
  onProceed: () => void;
}

export function DaywiseDetailsPage({ onBack, onProceed }: DaywiseDetailsPageProps) {
>>>>>>> dcf3ddfc010611596681cae27ad1869038839c93
  const [selectedDate, setSelectedDate] = useState<Date>();

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
            Day-wise Details
          </h1>
          <p className="text-muted-foreground">
            Select a date to view specific day payout
          </p>
        </div>

        <div className="space-y-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
<<<<<<< HEAD

              {/* Back button placed immediately after the date dropdown */}
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="rounded-md px-4 py-2 hover:bg-accent/60 transition-smooth"
                  onClick={() => (onBack ? onBack() : onBackWithState ? onBackWithState({ scrollY: window.scrollY }) : undefined)}
                >
                  Back
                </Button>
              </div>
=======
>>>>>>> dcf3ddfc010611596681cae27ad1869038839c93
            </CardContent>
          </Card>

          {/* Day Payout Details */}
          {selectedDate && getSelectedDayData() && (
            <>
              <PayoutBreakdown 
                detail={getSelectedDayData()!}
                title={getDetailsTitle()}
                showTdsInfo={false}
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