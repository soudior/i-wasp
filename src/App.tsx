import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GuestCardProvider } from "@/contexts/GuestCardContext";
import { DashboardGuard } from "@/components/DashboardGuard";
import { CardRequiredGuard } from "@/components/CardRequiredGuard";
import PublicCard from "./pages/PublicCard";
import AdminClients from "./pages/AdminClients";
import FirstCardSetup from "./pages/FirstCardSetup";
import OrderPreview from "./pages/OrderPreview";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import Dashboard from "./pages/Dashboard";
import GuestCardCreator from "./pages/GuestCardCreator";
import FinalizeCard from "./pages/FinalizeCard";
import Index from "./pages/Index";

const queryClient = new QueryClient();

function LegacyCardRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/card/${slug ?? ""}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GuestCardProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<Index />} />
              
              {/* Public NFC Card */}
              <Route path="/c/:slug" element={<LegacyCardRedirect />} />
              <Route path="/card/:slug" element={<PublicCard />} />
              
              {/* Auth */}
              <Route path="/login" element={<Login />} />
              
              {/* Guest card creation - no auth required */}
              <Route path="/create" element={<GuestCardCreator />} />
              
              {/* Finalize card after auth */}
              <Route path="/onboarding/finalize" element={<FinalizeCard />} />
              
              {/* Dashboard - Main user hub (guarded) */}
              <Route path="/dashboard" element={<DashboardGuard><Dashboard /></DashboardGuard>} />
              
              {/* Legacy onboarding (for logged in users) */}
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/onboarding/success" element={<OnboardingSuccess />} />
              
              {/* First card setup (legacy) */}
              <Route path="/setup" element={<FirstCardSetup />} />
              
              {/* Order flow - All require at least 1 card */}
              <Route path="/order" element={<CardRequiredGuard><OrderPreview /></CardRequiredGuard>} />
              <Route path="/cart" element={<CardRequiredGuard><Cart /></CardRequiredGuard>} />
              <Route path="/checkout" element={<CardRequiredGuard><Checkout /></CardRequiredGuard>} />
              
              {/* Admin - Client management */}
              <Route path="/admin" element={<AdminClients />} />
              <Route path="/admin/clients" element={<AdminClients />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GuestCardProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
