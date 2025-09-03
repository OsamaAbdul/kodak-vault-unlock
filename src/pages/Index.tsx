import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-crypto-dark to-crypto-darker">
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-6 rounded-full bg-primary/20 border border-primary/30">
                <Shield className="h-20 w-20 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground">
                KODAKTECHIE
              </h1>
              <p className="text-xl md:text-2xl text-primary font-semibold">
                CRYPTO AND FUNDS RECOVERY
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Professional cryptocurrency recovery services with advanced security protocols 
                and blockchain expertise. Recover your lost or stolen digital assets safely.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Advanced Security</CardTitle>
                <CardDescription>
                  Military-grade encryption and blockchain verification for maximum protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Fast Recovery</CardTitle>
                <CardDescription>
                  Streamlined 3-step process designed for quick and efficient fund recovery
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <Lock className="h-12 w-12 text-primary mx-auto" />
                <CardTitle>Secure Portal</CardTitle>
                <CardDescription>
                  End-to-end encrypted communication and secure transaction processing
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg"
            >
              Access Recovery Portal
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              © 2024 KODAKTECHIE Recovery Services. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
