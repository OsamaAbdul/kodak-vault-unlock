import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Clock, Shield, ArrowRight, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecoveryStep1 = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8 * 60 * 60); // 8 hours in seconds
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem("user");
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePayment = () => {
    if (!walletAddress) {
      toast({
        variant: "destructive",
        title: "Wallet Address Required",
        description: "Please enter your wallet address to proceed",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Store progress
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.step1Completed = true;
      userData.walletAddress = walletAddress;
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Payment Successful",
        description: "Extraction Fee Processed. Proceeding to Security Configuration.",
      });
      
      navigate("/recovery/step2");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-crypto-dark to-crypto-darker">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">KODAKTECHIE RECOVERY</h1>
                <p className="text-sm text-primary">Step 1 of 3: Extraction</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-mono text-orange-500">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">Recovery Progress</span>
              <span className="text-primary">Step 1 of 3</span>
            </div>
            <Progress value={33} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Extraction</span>
              <span>Firewall</span>
              <span>Final Unlock</span>
            </div>
          </div>

          {/* Main Card */}
          <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/20 border border-primary/30">
                  <Wallet className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Wallet Address Submission</CardTitle>
              <CardDescription>Initialize your fund recovery process</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Alert */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-500 mb-1">Time-Sensitive Process</p>
                  <p className="text-foreground">
                    Complete this step within the allocated time to maintain session security and prevent auto-lock.
                  </p>
                </div>
              </div>

              {/* Wallet Input */}
              <div className="space-y-3">
                <Label htmlFor="wallet" className="text-base font-medium">
                  Cryptocurrency Wallet Address
                </Label>
                <Input
                  id="wallet"
                  placeholder="Enter your wallet address (BTC, ETH, USDT, etc.)"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-input border-border/50 focus:border-primary h-12"
                />
                <p className="text-xs text-muted-foreground">
                  This is where your recovered funds will be transferred upon completion
                </p>
              </div>

              {/* Fee Information */}
              <Card className="bg-secondary/50 border-border/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-foreground">Extraction Fee Required</h3>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-primary">₦75,000</p>
                      <p className="text-sm text-muted-foreground">One-time processing fee</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-foreground">
                        This fee covers:
                      </p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Blockchain network transaction costs</li>
                        <li>• Secure wallet verification protocols</li>
                        <li>• Encrypted data extraction processes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  256-bit Encryption
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Blockchain Verified
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Secure Processing
                </Badge>
              </div>

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing Payment...
                  </div>
                ) : (
                  <>
                    Pay Extraction Fee & Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By proceeding, you agree to the terms of service and acknowledge that this is a secure transaction processed through our encrypted payment gateway.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecoveryStep1;