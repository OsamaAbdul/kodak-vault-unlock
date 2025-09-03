import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RecoveryStep1 from "./pages/RecoveryStep1";
import RecoveryStep2 from "./pages/RecoveryStep2";
import RecoveryStep3 from "./pages/RecoveryStep3";
import RecoveryComplete from "./pages/RecoveryComplete";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recovery/step1" element={<RecoveryStep1 />} />
          <Route path="/recovery/step2" element={<RecoveryStep2 />} />
          <Route path="/recovery/step3" element={<RecoveryStep3 />} />
          <Route path="/recovery/complete" element={<RecoveryComplete />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
