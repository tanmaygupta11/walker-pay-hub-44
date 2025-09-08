import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, ChevronLeft } from "lucide-react";

interface VerificationDialogProps {
  onBack: () => void;
  onYes: () => void;
  onNo: () => void;
}

export function VerificationDialog({ onBack, onYes, onNo }: VerificationDialogProps) {
  const [satisfaction, setSatisfaction] = useState<'yes' | 'no' | ''>('');

  const handleProceed = () => {
    if (satisfaction === 'yes') {
      onYes();
    } else if (satisfaction === 'no') {
      onNo();
    }
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
            Verification
          </h1>
          <p className="text-muted-foreground">
            Please confirm your payout details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Are you satisfied with these payout details?
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup 
              value={satisfaction} 
              onValueChange={(value) => setSatisfaction(value as 'yes' | 'no')}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Yes, I'm satisfied</p>
                    <p className="text-sm text-muted-foreground">The details look correct</p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="flex items-center gap-2 cursor-pointer flex-1">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium">No, I have concerns</p>
                    <p className="text-sm text-muted-foreground">Something doesn't look right</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1 flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button 
                onClick={handleProceed}
                disabled={!satisfaction}
                className="flex-1"
              >
                Proceed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}