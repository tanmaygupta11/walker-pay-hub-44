import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, MessageSquare } from "lucide-react";

interface WalkerConcernPageProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function WalkerConcernPage({ onBack, onSubmit }: WalkerConcernPageProps) {
  const [description, setDescription] = useState("");
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);

  const concernOptions = [
    { id: "login-hours", label: "Login Hours" },
    { id: "order-count", label: "Order Count" },
    { id: "rewards", label: "Rewards" },
    { id: "deductions", label: "Deductions" },
    { id: "ot-payout", label: "OT Payout" },
    { id: "base-payout", label: "Base Payout" },
  ];

  const handleConcernChange = (concernId: string, checked: boolean) => {
    if (checked) {
      setSelectedConcerns([...selectedConcerns, concernId]);
    } else {
      setSelectedConcerns(selectedConcerns.filter(id => id !== concernId));
    }
  };

  const handleSubmit = () => {
    // Here you would typically send the concern data to your backend/Google Sheets
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
            Report Concern
          </h1>
          <p className="text-muted-foreground">
            Let us know what's not right with your payout details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Describe Your Concern
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Issue Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe the issue you're facing with your payout details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Select areas of concern:</Label>
              <div className="grid grid-cols-2 gap-3">
                {concernOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={selectedConcerns.includes(option.id)}
                      onCheckedChange={(checked) => 
                        handleConcernChange(option.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1 flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!description.trim() && selectedConcerns.length === 0}
                className="flex-1"
              >
                Submit Concern
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}