import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
import zomatoLogo from "@/assets/zomato-logo.png";

interface ConfirmationPageProps {
  onBackToHome: () => void;
}

export function ConfirmationPage({ onBackToHome }: ConfirmationPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={zomatoLogo} 
              alt="Zomato Logo" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="payout-heading text-primary-blue mb-2">
            Confirmation
          </h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">
              Thank You!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Thanks for confirming your payout details.
              </p>
              <p className="text-muted-foreground">
                Your payment will be processed at the end of the billing cycle.
              </p>
            </div>
            
            <div className="pt-4">
              <Button onClick={onBackToHome} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
            
            {/* Logout button positioned at bottom left */}
            <div className="fixed bottom-4 left-4">
              <button 
                onClick={onBackToHome}
                className="text-sm text-muted-foreground hover:text-red-600 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}