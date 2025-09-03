import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Unlock, Clock, ArrowRight, CheckCircle, AlertTriangle, Key, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecoveryStep3 = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8 * 60 * 60); // 8 hours in seconds
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }

    const userObj = JSON.parse(userData);
    if (!userObj.step1Completed || !userObj.step2Completed) {
      navigate("/recovery/step1");
      return;
    }

    setUser(userObj);

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

  const handleFinalPayment = () => {
    setIsLoading(true);
    
    // Simulate final payment processing
    setTimeout(() => {
      // Store completion
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.step3Completed = true;
      userData.recoveryCompleted = true;
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Recovery Completed Successfully!",
        description: "Final Unlock Stage Completed! Your wallet is now accessible.",
      });
      
      navigate("/recovery/complete");
      setIsLoading(false);
    }, 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-crypto-dark to-crypto-darker">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Unlock className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">KODAKTECHIE RECOVERY</h1>
                <p className="text-sm text-primary">Step 3 of 3: Final Unlock</p>
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
              <span className="text-primary">Step 3 of 3</span>
            </div>
            <Progress value={100} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="text-primary">✓ Extraction</span>
              <span className="text-primary">✓ Firewall</span>
              <span className="text-primary">Final Unlock</span>
            </div>
          </div>

          {/* Status Updates */}
          <div className="space-y-4">
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">🟢 Vault Sync: Completed</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">🟢 Firewall Uplink: Stable</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">🟢 Session Continuity: Verified</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-500/10 border-orange-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-500">🟡 Private Key Bind: Pending Final Decryption</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Card */}
          <Card className="bg-card/90 backdrop-blur-sm border-primary/20 shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/20 border border-primary/30 animate-pulse">
                  <Unlock className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">🔓 Final Unlock Stage</CardTitle>
              <CardDescription>Last Decryption Phase</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Congratulations Message */}
              <Alert className="border-primary/30 bg-primary/10">
                <Key className="h-4 w-4" />
                <AlertDescription className="text-foreground">
                  <strong>Dear {user.email?.split('@')[0]},</strong><br/>
                  Congratulations! Your recovery case has reached the Final Unlock Phase. All preliminary steps are complete.
                </AlertDescription>
              </Alert>

              {/* Final Requirements */}
              <Card className="bg-secondary/50 border-border/30">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-center text-foreground">
                      To finalize wallet release, a Final Phase Execution Fee is required to:
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="text-sm">Release encrypted data from the blockchain vault</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-primary" />
                        <span className="text-sm">Bind the wallet address to your access environment</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Unlock className="h-5 w-5 text-primary" />
                        <span className="text-sm">Generate your private key access string</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Warning */}
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-foreground">
                  <strong>⚠️ Important:</strong> Complete this payment within 6-12 hours to avoid auto-lock and session expiration. 
                  No recovery attempts will be allowed after expiration.
                </AlertDescription>
              </Alert>

              {/* Fee Information */}
              <Card className="bg-gradient-to-r from-primary/20 to-crypto-green-glow/20 border-primary/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-foreground">Final Phase Execution Fee</h3>
                    <div className="space-y-2">
                      <p className="text-4xl font-bold text-primary">₦350,000</p>
                      <p className="text-sm text-muted-foreground">Final decryption and key generation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Badges */}
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Final Stage Authentication
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Private Key Generation
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Blockchain Release Protocol
                </Badge>
              </div>

              {/* Final Payment Button */}
              <Button
                onClick={handleFinalPayment}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-crypto-green-glow hover:from-primary/90 hover:to-crypto-green-glow/90 text-primary-foreground font-bold py-4 text-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Processing Final Unlock...
                  </div>
                ) : (
                  <>
                    Complete Final Unlock - Pay ₦350,000
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Final secure transaction. Upon completion, your wallet will be immediately accessible with full recovery confirmation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecoveryStep3;