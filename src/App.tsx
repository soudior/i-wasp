import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GuestCardProvider } from "@/contexts/GuestCardContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderFunnelProvider, CartGuard } from "@/contexts/OrderFunnelContext";
import { DashboardGuard } from "@/components/DashboardGuard";
import { AdminGuard } from "@/components/AdminGuard";
import { FeatureValidationProvider } from "@/components/FeatureValidationProvider";
// Debug panel removed for production build
import ErrorBoundary from "@/components/ErrorBoundary";
import { SplashScreen } from "@/components/SplashScreen";
import { NetworkProvider } from "@/components/NetworkProvider";
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
import Demo from "./pages/Demo";
import Cart from "./pages/Cart";
import HerbalismCard from "./pages/HerbalismCard";
import CardSuccess from "./pages/CardSuccess";
import UserGuide from "./pages/UserGuide";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import Install from "./pages/Install";
import Help from "./pages/Help";
import DemoDashboard from "./pages/DemoDashboard";
import Nails from "./pages/Nails";
import Partenaires from "./pages/Partenaires";
import DevenirPartenaire from "./pages/DevenirPartenaire";
import CertificatPartenaire from "./pages/CertificatPartenaire";
import RentalDemo from "./pages/RentalDemo";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { MobileBottomNav } from "@/components/MobileBottomNav";

// Order funnel pages - 7 steps strict flow
import OrderType from "./pages/order/OrderType";
import OrderIdentity from "./pages/order/OrderIdentity";
import OrderDigital from "./pages/order/OrderDigital";
import OrderDesign from "./pages/order/OrderDesign";
import OrderOptions from "./pages/order/OrderOptions";
import OrderSummary from "./pages/order/OrderSummary";
import OrderPreviewFinal from "./pages/order/OrderPreviewFinal";
import OrderPayment from "./pages/order/OrderPayment";
import OrderConfirmation from "./pages/order/OrderConfirmation";

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

// Redirect /order to /order/type
function OrderRedirect() {
  return <Navigate to="/order/type" replace />;
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);
    
    // Only show splash on first visit per session in standalone mode
    if (!standalone) {
      setShowSplash(false);
    } else {
      const splashShown = sessionStorage.getItem('splash-shown');
      if (splashShown) {
        setShowSplash(false);
      }
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splash-shown', 'true');
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <NetworkProvider>
          <AuthProvider>
            <GuestCardProvider>
              <CartProvider>
                <TooltipProvider>
                  <FeatureValidationProvider showOverlay={true}>
                    {/* Splash Screen for installed PWA */}
                    {showSplash && isStandalone && (
                      <SplashScreen onComplete={handleSplashComplete} minDuration={2000} />
                    )}
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <ErrorBoundary>
                        <OrderFunnelProvider>
                    <Routes>
                      {/* HOME - ALWAYS VALID */}
                      <Route path="/" element={<Index />} />
                      
                      {/* Demo - ALWAYS VALID */}
                      <Route path="/demo" element={<Demo />} />
                      
                      {/* Public NFC Card */}
                      <Route path="/c/:slug" element={<LegacyCardRedirect />} />
                      <Route path="/card/:slug" element={<PublicCard />} />
                      
                      {/* Client Demo Cards */}
                      <Route path="/card/herbalism-marrakech" element={<HerbalismCard />} />
                      
                      {/* Auth */}
                      <Route path="/login" element={<Login />} />
                      
                      {/* Guest card creation - no auth required */}
                      <Route path="/create" element={<GuestCardCreator />} />
                      <Route path="/success" element={<CardSuccess />} />
                      <Route path="/guide" element={<UserGuide />} />
                      <Route path="/templates" element={<Templates />} />
                      <Route path="/install" element={<Install />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/faq" element={<Help />} />
                      <Route path="/demo-dashboard" element={<DemoDashboard />} />
                      <Route path="/nails" element={<Nails />} />
                      <Route path="/partenaires" element={<Partenaires />} />
                      <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
                      <Route path="/certificat-partenaire" element={<CertificatPartenaire />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/rental-demo" element={<RentalDemo />} />
                      {/* Finalize card after auth */}
                      <Route path="/onboarding/finalize" element={<FinalizeCard />} />
                      
                      {/* Dashboard - Main user hub (guarded) */}
                      <Route path="/dashboard" element={<DashboardGuard><Dashboard /></DashboardGuard>} />
                      <Route path="/settings" element={<DashboardGuard><Settings /></DashboardGuard>} />
                      
                      {/* Legacy onboarding (for logged in users) */}
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/onboarding/success" element={<OnboardingSuccess />} />
                      
                      {/* First card setup (legacy) */}
                      <Route path="/setup" element={<FirstCardSetup />} />
                      
                      {/* ORDER FUNNEL - 7 steps STRICT */}
                      <Route path="/order" element={<OrderRedirect />} />
                      <Route path="/order/type" element={<OrderType />} />
                      <Route path="/order/identity" element={<OrderIdentity />} />
                      <Route path="/order/digital" element={<OrderDigital />} />
                      <Route path="/order/design" element={<OrderDesign />} />
                      <Route path="/order/options" element={<OrderOptions />} />
                      <Route path="/order/summary" element={<OrderSummary />} />
                      <Route path="/order/preview" element={<OrderPreviewFinal />} />
                      <Route path="/order/payment" element={<OrderPayment />} />
                      <Route path="/order/confirmation" element={<OrderConfirmation />} />
                      
                      {/* Cart - Protected, only after full configuration */}
                      <Route path="/cart" element={<CartGuard><Cart /></CartGuard>} />
                      
                      {/* Admin - Protected by AdminGuard */}
                      <Route path="/admin" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                      <Route path="/admin-iwasp" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                      <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                      <Route path="/admin/clients" element={<AdminGuard><AdminClients /></AdminGuard>} />
                      
                      {/* 404 - FALLBACK TO HOME */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    {/* Mobile Bottom Navigation */}
                    <MobileBottomNav />
                    {/* PWA Install Prompt */}
                    <PWAInstallPrompt />
                  </OrderFunnelProvider>
                </ErrorBoundary>
              </BrowserRouter>
            </FeatureValidationProvider>
          </TooltipProvider>
        </CartProvider>
      </GuestCardProvider>
    </AuthProvider>
  </NetworkProvider>
</QueryClientProvider>
</ErrorBoundary>
  );
};

export default App;
