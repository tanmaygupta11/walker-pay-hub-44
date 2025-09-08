import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Smartphone, Shield } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (walkerData: any) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (mobile.length !== 10) return;
    
    setLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    
    setLoading(true);
    // Simulate verification and data fetch from Google Sheets
    setTimeout(() => {
      const mockWalkerData = {
        walkerName: "Rajesh Kumar",
        feId: "FE001234",
        walkerNumber: "WK5678",
        stationName: "New Delhi Railway Station"
      };
      setLoading(false);
      onLoginSuccess(mockWalkerData);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/src/assets/zomato-logo.png" 
              alt="Zomato Logo" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            IRCTC Walker Login
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'mobile' ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="mobile" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                />
              </div>
              
              <Button 
                onClick={handleSendOTP}
                disabled={mobile.length !== 10 || loading}
                className="w-full"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center text-sm text-muted-foreground mb-4">
                OTP sent to +91 {mobile}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('mobile')}
                  className="flex-1"
                >
                  Change Number
                </Button>
                <Button 
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6 || loading}
                  className="flex-1"
                >
                  {loading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}