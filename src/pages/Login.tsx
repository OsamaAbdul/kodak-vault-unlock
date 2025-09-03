import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login validation
    setTimeout(() => {
      if (email && password) {
        // Store user data in localStorage (for demo purposes)
        localStorage.setItem("user", JSON.stringify({
          email,
          refundAmount: "₦2,450,000",
          loginTime: new Date().toISOString()
        }));
        
        toast({
          title: "Login Successful",
          description: "Welcome to KODAKTECHIE Recovery Platform",
        });
        
        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please enter valid credentials",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-crypto-dark to-crypto-darker flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }} />
      
      <Card className="w-full max-w-md bg-card/90 backdrop-blur-sm border-border/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/20 border border-primary/30">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">KODAKTECHIE</CardTitle>
            <CardDescription className="text-primary font-semibold">CRYPTO AND FUNDS RECOVERY</CardDescription>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Secure Access Portal</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-xs text-primary">256-bit Encrypted</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border/50 focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border/50 focus:border-primary pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Authenticating...
                </div>
              ) : (
                "Access Recovery Portal"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="text-center text-xs text-muted-foreground">
              <p>Protected by KODAKTECHIE Security Protocol</p>
              <p className="mt-1">© 2024 KODAKTECHIE Recovery Services</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;