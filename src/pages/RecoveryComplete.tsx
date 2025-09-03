import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Wallet, Copy, ExternalLink, Shield, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RecoveryComplete = () => {
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
    if (!userObj.recoveryCompleted) {
      navigate("/recovery/step1");
      return;
    }

    setUser(userObj);
  }, [navigate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: `${label} copied successfully`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  // Generate mock transaction details for demo
  const transactionId = "TXN-KDK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const privateKey = "5K" + Math.random().toString(36).substr(2, 49).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-crypto-dark to-crypto-darker">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">KODAKTECHIE RECOVERY</h1>
                <p className="text-sm text-primary">Recovery Completed Successfully</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="border-border/50 hover:bg-secondary"
            >
              Exit Portal
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Banner */}
          <Card className="bg-gradient-to-r from-primary/20 to-crypto-green-glow/20 border-primary/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="p-4 rounded-full bg-primary/20 border border-primary/30">
                    <CheckCircle className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    🎉 Recovery Completed Successfully!
                  </h1>
                  <p className="text-lg text-primary">
                    Your wallet is now accessible. Check your registered wallet address for funds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recovery Summary */}
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-6 w-6 text-primary" />
                Recovery Summary
              </CardTitle>
              <CardDescription>Complete details of your successful fund recovery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Recovered Amount</label>
                    <p className="text-2xl font-bold text-primary">{user.refundAmount}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-secondary px-2 py-1 rounded border flex-1 truncate">
                        {user.walletAddress || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(user.walletAddress || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "Wallet Address")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Transaction ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-sm bg-secondary px-2 py-1 rounded border flex-1">
                        {transactionId}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(transactionId, "Transaction ID")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Recovery Status</label>
                    <div className="mt-1">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        COMPLETED & VERIFIED
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Completion Date</label>
                    <p className="text-sm text-foreground mt-1">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Processing Time</label>
                    <p className="text-sm text-foreground mt-1">All steps completed within security timeframe</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Credentials */}
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Private Key Access
              </CardTitle>
              <CardDescription>Your generated private key for wallet access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-secondary/50 rounded-lg border border-border/30">
                <label className="text-sm font-medium text-muted-foreground block mb-2">Private Key</label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-background px-3 py-2 rounded border flex-1 font-mono break-all">
                    {privateKey}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(privateKey, "Private Key")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Keep this private key secure. Anyone with access to this key can control your wallet.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>What to do after successful recovery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="p-1 rounded-full bg-primary/20 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Check Your Wallet</h4>
                    <p className="text-sm text-muted-foreground">
                      Use your wallet software to verify the funds have been received at your address.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="p-1 rounded-full bg-primary/20 mt-0.5">
                    <Download className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Save Your Recovery Details</h4>
                    <p className="text-sm text-muted-foreground">
                      Download or print this page for your records. Keep the transaction ID safe.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="p-1 rounded-full bg-primary/20 mt-0.5">
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Blockchain Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      You can verify the transaction on blockchain explorers using the transaction ID above.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="bg-primary/10 border-primary/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-foreground">Need Support?</h3>
                <p className="text-sm text-muted-foreground">
                  If you have any questions about your recovery or need additional assistance, 
                  our support team is available 24/7.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Email:</strong> support@kodaktechie.com
                  </p>
                  <p className="text-sm">
                    <strong>Reference ID:</strong> {transactionId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RecoveryComplete;