import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GuestCardProvider } from "@/contexts/GuestCardContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderFunnelProvider } from "@/contexts/OrderFunnelContext";
import { DashboardGuard } from "@/components/DashboardGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import PublicCard from "./pages/PublicCard";
import AdminClients from "./pages/AdminClients";
import FirstCardSetup from "./pages/FirstCardSetup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminOrders from "./pages/AdminOrders";
import Onboarding from "./pages/Onboarding";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import Dashboard from "./pages/Dashboard";
import GuestCardCreator from "./pages/GuestCardCreator";
import FinalizeCard from "./pages/FinalizeCard";
import Index from "./pages/Index";

// Order funnel pages
import OrderOffer from "./pages/order/OrderOffer";
import OrderInfo from "./pages/order/OrderInfo";
import OrderDesignNew from "./pages/order/OrderDesignNew";
import OrderOptions from "./pages/order/OrderOptions";
import OrderSummaryNew from "./pages/order/OrderSummaryNew";
import OrderPayment from "./pages/order/OrderPayment";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function LegacyCardRedirect() {
  const { slug } = useParams<{ slug: string }>();
  return <Navigate to={`/card/${slug ?? ""}`} replace />;
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GuestCardProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ErrorBoundary>
                  <OrderFunnelProvider>
                    <Routes>
                      {/* HOME - ALWAYS VALID */}
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
                      
                      {/* ORDER FUNNEL - 6 steps */}
                      <Route path="/order" element={<OrderOffer />} />
                      <Route path="/order/info" element={<OrderInfo />} />
                      <Route path="/order/design" element={<OrderDesignNew />} />
                      <Route path="/order/options" element={<OrderOptions />} />
                      <Route path="/order/summary" element={<OrderSummaryNew />} />
                      <Route path="/order/payment" element={<OrderPayment />} />
                      
                      {/* Admin */}
                      <Route path="/admin" element={<AdminOrders />} />
                      <Route path="/admin/orders" element={<AdminOrders />} />
                      <Route path="/admin/clients" element={<AdminClients />} />
                      
                      {/* 404 - FALLBACK TO HOME */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </OrderFunnelProvider>
                </ErrorBoundary>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </GuestCardProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
