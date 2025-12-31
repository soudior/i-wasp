import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import PublicCard from "./pages/PublicCard";
import AdminClients from "./pages/AdminClients";
import FirstCardSetup from "./pages/FirstCardSetup";
import OrderPreview from "./pages/OrderPreview";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

function LegacyCardRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/card/${slug ?? ""}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public NFC Card - Main feature */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/c/:slug" element={<LegacyCardRedirect />} />
            <Route path="/card/:slug" element={<PublicCard />} />
            
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            
            {/* Dashboard - Main user hub */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Onboarding flow */}
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboarding/success" element={<OnboardingSuccess />} />
            
            {/* First card setup (legacy) */}
            <Route path="/setup" element={<FirstCardSetup />} />
            
            {/* Order flow */}
            <Route path="/order" element={<OrderPreview />} />
            
            {/* Admin - Client management */}
            <Route path="/admin" element={<AdminClients />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
