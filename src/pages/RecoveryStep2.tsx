import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, ArrowRight, CheckCircle, Zap, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecoveryStep2 = () => {
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

    const user = JSON.parse(userData);
    if (!user.step1Completed) {
      navigate("/recovery/step1");
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
    setIsLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Store progress
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.step2Completed = true;
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Firewall Configuration Completed",
        description: "Vault Synchronization in Progress. Proceeding to Final Unlock.",
      });
      
      navigate("/recovery/step3");
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
                <p className="text-sm text-primary">Step 2 of 3: Firewall Configuration</p>
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
              <span className="text-primary">Step 2 of 3</span>
            </div>
            <Progress value={66} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="text-primary">✓ Extraction</span>
              <span className="text-primary">Firewall</span>
              <span>Final Unlock</span>
            </div>
          </div>

          {/* Status Update */}
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold text-primary">Step 1 Completed Successfully</h3>
                  <p className="text-sm text-foreground">Wallet verification and extraction fee processed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Card */}
          <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/20 border border-primary/30">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Security Firewall Configuration</CardTitle>
              <CardDescription>Advanced malware protection and security hardening</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Security Features */}
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Anti-Malware Scanning</h4>
                    <p className="text-sm text-muted-foreground">Detect and eliminate threats</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Firewall Hardening</h4>
                    <p className="text-sm text-muted-foreground">Block unauthorized access attempts</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium text-foreground">Secure Channel Creation</h4>
                    <p className="text-sm text-muted-foreground">Encrypted communication pathway</p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <Card className="bg-orange-500/10 border-orange-500/30">
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-orange-500 mb-2">Critical Security Step</h3>
                  <p className="text-sm text-foreground">
                    Security Firewall Configuration is required to secure your refund and eliminate 
                    malware that could alert scammers to your recovery process. This step ensures 
                    your funds remain protected during the final transfer phase.
                  </p>
                </CardContent>
              </Card>

              {/* Fee Information */}
              <Card className="bg-secondary/50 border-border/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-foreground">Firewall Configuration Fee</h3>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-primary">₦125,000</p>
                      <p className="text-sm text-muted-foreground">Advanced security implementation</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-foreground">This fee covers:</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Advanced firewall configuration</li>
                        <li>• Real-time malware scanning</li>
                        <li>• Secure communication protocols</li>
                        <li>• Anti-scammer protection systems</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Military-Grade Security
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Real-time Protection
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Zero-Trust Architecture
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
                    Configuring Security...
                  </div>
                ) : (
                  <>
                    Pay ₦125,000 for Firewall Configuration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Secure payment processed through encrypted channels. Your security is our priority.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecoveryStep2;