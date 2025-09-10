import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Home, FileText } from "lucide-react";
import { SatisfactionResponse } from "@/types/walker";

interface CompletionScreenProps {
  satisfaction: SatisfactionResponse;
  onStartOver: () => void;
}

export function CompletionScreen({ satisfaction, onStartOver }: CompletionScreenProps) {
  const isPositive = satisfaction === 'yes';

  return (
    <div className="max-w-lg mx-auto">
      <Card className={`card-elevated ${isPositive ? 'border-success/20' : 'border-warning/20'}`}>
        <CardHeader className="text-center space-y-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${isPositive ? 'bg-success-light' : 'bg-warning-light'}`}>
            {isPositive ? (
              <CheckCircle className="w-10 h-10 text-success" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-warning" />
            )}
          </div>
          <div>
            <CardTitle className={`text-2xl ${isPositive ? 'text-success' : 'text-warning'}`}>
              {isPositive ? 'Response Confirmed!' : 'Concerns Noted'}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              {isPositive 
                ? 'Your satisfaction has been recorded successfully'
                : 'Your concerns have been forwarded for review'
              }
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-xl ${isPositive ? 'bg-success-light' : 'bg-warning-light'}`}>
            <div className="text-center">
              <div className={`text-lg font-semibold ${isPositive ? 'text-success' : 'text-warning'} mb-2`}>
                {isPositive ? 'Payment Processing Confirmed' : 'Payment Processing Stopped'}
              </div>
              <div className={`${isPositive ? 'text-success' : 'text-warning'}/80`}>
                {isPositive 
                  ? 'Your payment will be processed at the end of the billing cycle as scheduled.'
                  : 'Payment processing has been paused. Our team will review your concerns and contact you soon.'
                }
              </div>
            </div>
          </div>

          {isPositive && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary-light">
                <FileText className="w-5 h-5 text-primary" />
                <div className="text-sm">
                  <div className="font-medium text-primary">Next Steps</div>
                  <div className="text-primary/80">Payment will be credited to your registered account</div>
                </div>
              </div>
            </div>
          )}

          {!isPositive && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warning-light">
                <FileText className="w-5 h-5 text-warning" />
                <div className="text-sm">
                  <div className="font-medium text-warning">What happens next?</div>
                  <div className="text-warning/80">Our support team will contact you within 24-48 hours</div>
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={onStartOver}
            className="w-full h-12 mt-6 bg-primary hover:bg-primary-muted transition-smooth"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}