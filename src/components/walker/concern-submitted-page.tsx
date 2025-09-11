import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";

interface ConcernSubmittedPageProps {
  onBackToHome: () => void;
}

export function ConcernSubmittedPage({ onBackToHome }: ConcernSubmittedPageProps) {
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
          <h1 className="payout-heading text-primary-blue mb-2">
            Concern Submitted
          </h1>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-orange-600" />
            </div>
            <CardTitle className="text-2xl text-orange-600">
              Your Concern is Noted
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Thank you for reporting your concern.
              </p>
              <p className="text-muted-foreground">
                Our team will review your submission and get back to you soon.
              </p>
            </div>
            
            <div className="pt-4">
              <Button onClick={onBackToHome} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}