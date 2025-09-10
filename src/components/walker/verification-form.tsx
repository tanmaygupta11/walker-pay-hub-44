import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalkerDetails } from "@/types/walker";
import { VERIFIED_WALKERS, STATION_NAMES } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Shield, User, MapPin, Phone, IdCard } from "lucide-react";

interface VerificationFormProps {
  onVerified: (walker: WalkerDetails) => void;
}

export function VerificationForm({ onVerified }: VerificationFormProps) {
  const [formData, setFormData] = useState<WalkerDetails>({
    walkerName: '',
    feId: '',
    walkerNumber: '',
    stationName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Skip database validation for testing - accept any values
    toast({
      title: "Verification Successful",
      description: `Welcome back, ${formData.walkerName}!`,
      className: "border-success bg-success-light text-success-foreground"
    });
    onVerified(formData);

    setIsLoading(false);
  };

  const handleInputChange = (field: keyof WalkerDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="card-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl text-primary">Walker Verification</CardTitle>
            <CardDescription className="text-base mt-2">
              Enter your details to access your payout information
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="walkerName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Walker Name
              </Label>
              <Input
                id="walkerName"
                type="text"
                value={formData.walkerName}
                onChange={(e) => handleInputChange('walkerName', e.target.value)}
                placeholder="Enter your full name"
                required
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feId" className="flex items-center gap-2">
                <IdCard className="w-4 h-4" />
                FE ID
              </Label>
              <Input
                id="feId"
                type="text"
                value={formData.feId}
                onChange={(e) => handleInputChange('feId', e.target.value)}
                placeholder="Enter your FE ID"
                required
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="walkerNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Walker Number
              </Label>
              <Input
                id="walkerNumber"
                type="tel"
                value={formData.walkerNumber}
                onChange={(e) => handleInputChange('walkerNumber', e.target.value)}
                placeholder="Enter your mobile number"
                required
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stationName" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Station Name
              </Label>
              <Select 
                value={formData.stationName} 
                onValueChange={(value) => handleInputChange('stationName', value)}
                required
              >
                <SelectTrigger className="transition-smooth focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select your station" />
                </SelectTrigger>
                <SelectContent>
                  {STATION_NAMES.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6 h-12 text-base font-medium bg-primary hover:bg-primary-muted transition-smooth"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Submit & Verify'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}