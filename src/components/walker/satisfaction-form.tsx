import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HelpCircle, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { SatisfactionResponse } from "@/types/walker";
import { useToast } from "@/hooks/use-toast";

interface SatisfactionFormProps {
  onBack: () => void;
  onComplete: (response: SatisfactionResponse) => void;
}

export function SatisfactionForm({ onBack, onComplete }: SatisfactionFormProps) {
  const [satisfaction, setSatisfaction] = useState<SatisfactionResponse>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!satisfaction) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (satisfaction === 'yes') {
      toast({
        title: "Response Recorded",
        description: "Payment will be processed at the end of billing cycle.",
        className: "border-success bg-success-light text-success-foreground"
      });
    } else {
      toast({
        title: "Response Recorded", 
        description: "Payment processing stopped. Further details required.",
        className: "border-warning bg-warning-light text-warning-foreground"
      });
    }
    
    onComplete(satisfaction);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <Card className="card-elevated">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-primary">Satisfaction Confirmation</CardTitle>
          <CardDescription className="text-base">
            Please confirm if you are satisfied with the payout details shown
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">
              Are you satisfied with the details?
            </label>
            <RadioGroup
              value={satisfaction || ''}
              onValueChange={(value) => setSatisfaction(value as SatisfactionResponse)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-4 p-4 rounded-lg border border-card-border hover:bg-success-light/30 transition-smooth cursor-pointer">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <div className="font-medium text-success">Yes, I'm satisfied</div>
                      <div className="text-sm text-muted-foreground">
                        Payment will be processed at the end of billing cycle
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-lg border border-card-border hover:bg-warning-light/30 transition-smooth cursor-pointer">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <div>
                      <div className="font-medium text-warning">No, I have concerns</div>
                      <div className="text-sm text-muted-foreground">
                        Payment processing will be stopped for review
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex gap-4 justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center gap-2 px-6 h-12"
              disabled={isSubmitting}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!satisfaction || isSubmitting}
              className="px-8 h-12 bg-primary hover:bg-primary-muted transition-smooth"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                'Save Response'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {satisfaction && (
        <Card className={`card-elevated ${satisfaction === 'yes' ? 'border-success/20 bg-success-light/50' : 'border-warning/20 bg-warning-light/50'}`}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-sm font-medium ${satisfaction === 'yes' ? 'text-success' : 'text-warning'}`}>
                Selected Response
              </div>
              <div className={`text-lg font-semibold ${satisfaction === 'yes' ? 'text-success' : 'text-warning'}`}>
                {satisfaction === 'yes' ? 'Satisfied with details' : 'Have concerns with details'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}