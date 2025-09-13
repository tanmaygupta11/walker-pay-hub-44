import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Hash, Phone, MapPin } from "lucide-react";
import zomatoLogo from "@/assets/zomato-logo.png";

interface BasicDetailsPageProps {
  walkerData: {
    walkerName: string;
    feId: string;
    walkerNumber: string;
    stationName: string;
  };
  onProceed: () => void;
  onBack: () => void;
}

export function BasicDetailsPage({ walkerData, onProceed, onBack }: BasicDetailsPageProps) {
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
            Walker Details
          </h1>
          <p className="text-muted-foreground">
            Your verified information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="basic-subheading">Walker Name</p>
                  <p className="basic-value">{walkerData.walkerName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Hash className="w-5 h-5 text-primary" />
                <div>
                  <p className="basic-subheading">FE ID</p>
                  <p className="basic-value">{walkerData.feId}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="basic-subheading">Walker Number</p>
                  <p className="basic-value">{walkerData.walkerNumber}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="basic-subheading">Station Name</p>
                  <p className="basic-value">{walkerData.stationName}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}