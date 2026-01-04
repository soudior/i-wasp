import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GuestCardProvider } from "@/contexts/GuestCardContext";
import { BrandProvider } from "@/contexts/BrandContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderFunnelProvider } from "@/contexts/OrderFunnelContext";
import { DashboardGuard } from "@/components/DashboardGuard";
import { AdminGuard } from "@/components/AdminGuard";
import { FeatureValidationProvider } from "@/components/FeatureValidationProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SplashScreen } from "@/components/SplashScreen";
import { NetworkProvider } from "@/components/NetworkProvider";
import PublicCard from "./pages/PublicCard";
import AdminClients from "./pages/AdminClients";
import AdminCreator from "./pages/AdminCreator";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInstantCard from "./pages/AdminInstantCard";
import EvolisPrintPage from "./pages/EvolisPrint";
import FirstCardSetup from "./pages/FirstCardSetup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminOrders from "./pages/AdminOrders";
import Onboarding from "./pages/Onboarding";
import OnboardingSuccess from "./pages/OnboardingSuccess";
import Dashboard from "./pages/Dashboard";
import GuestCardCreator from "./pages/GuestCardCreator";
import FinalizeCard from "./pages/FinalizeCard";
import HomeSaaS from "./pages/HomeSaaS";
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
import UltraLuxeDemo from "./pages/UltraLuxeDemo";
import VCardAirbnbBookingDemo from "./pages/VCardAirbnbBookingDemo";
import ClientForm from "./pages/ClientForm";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import Vision from "./pages/Vision";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Enterprise from "./pages/Enterprise";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import BrandAssets from "./pages/BrandAssets";

// NEW Order funnel pages - 6 steps strict flow
import OrderOffre from "./pages/order/OrderOffre";
import OrderIdentite from "./pages/order/OrderIdentite";
import OrderCarte from "./pages/order/OrderCarte";
import OrderLivraison from "./pages/order/OrderLivraison";
import OrderRecap from "./pages/order/OrderRecap";
import OrderConfirmationNew from "./pages/order/OrderConfirmationNew";

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

// Redirect /order to /order/offre
function OrderRedirect() {
  return <Navigate to="/order/offre" replace />;
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashShown = sessionStorage.getItem('splash-shown');
    if (splashShown) {
      setShowSplash(false);
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
            <BrandProvider>
              <GuestCardProvider>
                <CartProvider>
                <TooltipProvider>
                  <FeatureValidationProvider showOverlay={true}>
                    {showSplash && (
                      <SplashScreen onComplete={handleSplashComplete} minDuration={800} />
                    )}
                    <Toaster />
                    <Sonner />
                    <BrowserRouter>
                      <ScrollToTop />
                      <ErrorBoundary>
                        <OrderFunnelProvider>
                          <Routes>
                            {/* HOME */}
                            <Route path="/" element={<HomeSaaS />} />
                            <Route path="/legacy" element={<Index />} />
                            
                            {/* Demo */}
                            <Route path="/demo" element={<Demo />} />
                            
                            {/* Public NFC Card */}
                            <Route path="/c/:slug" element={<LegacyCardRedirect />} />
                            <Route path="/card/:slug" element={<PublicCard />} />
                            <Route path="/card/herbalism-marrakech" element={<HerbalismCard />} />
                            
                            {/* Auth */}
                            <Route path="/login" element={<Login />} />
                            
                            {/* Guest card creation */}
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
                            <Route path="/about" element={<About />} />
                            <Route path="/a-propos" element={<About />} />
                            <Route path="/vision" element={<Vision />} />
                            <Route path="/features" element={<Features />} />
                            <Route path="/fonctionnalites" element={<Features />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/tarifs" element={<Pricing />} />
                            <Route path="/enterprise" element={<Enterprise />} />
                            <Route path="/entreprises" element={<Enterprise />} />
                            <Route path="/business" element={<Enterprise />} />
                            <Route path="/rental-demo" element={<RentalDemo />} />
                            <Route path="/demo/ultra-luxe" element={<UltraLuxeDemo />} />
                            <Route path="/demo/vcard-airbnb-booking" element={<VCardAirbnbBookingDemo />} />
                            
                            {/* Client Form */}
                            <Route path="/form" element={<ClientForm />} />
                            <Route path="/formulaire" element={<ClientForm />} />
                            
                            {/* Finalize card after auth */}
                            <Route path="/onboarding/finalize" element={<FinalizeCard />} />
                            
                            {/* Dashboard */}
                            <Route path="/dashboard" element={<DashboardGuard><Dashboard /></DashboardGuard>} />
                            <Route path="/settings" element={<DashboardGuard><Settings /></DashboardGuard>} />
                            
                            {/* Legacy onboarding */}
                            <Route path="/onboarding" element={<Onboarding />} />
                            <Route path="/onboarding/success" element={<OnboardingSuccess />} />
                            
                            {/* First card setup */}
                            <Route path="/setup" element={<FirstCardSetup />} />
                            
                            {/* NEW ORDER FUNNEL - 6 steps STRICT */}
                            <Route path="/order" element={<OrderRedirect />} />
                            <Route path="/order/offre" element={<OrderOffre />} />
                            <Route path="/order/identite" element={<OrderIdentite />} />
                            <Route path="/order/carte" element={<OrderCarte />} />
                            <Route path="/order/livraison" element={<OrderLivraison />} />
                            <Route path="/order/recap" element={<OrderRecap />} />
                            <Route path="/order/confirmation" element={<OrderConfirmationNew />} />
                            
                            {/* Legacy order routes - redirect to new funnel */}
                            <Route path="/order/type" element={<Navigate to="/order/offre" replace />} />
                            <Route path="/order/identity" element={<Navigate to="/order/identite" replace />} />
                            <Route path="/order/digital" element={<Navigate to="/order/identite" replace />} />
                            <Route path="/order/design" element={<Navigate to="/order/carte" replace />} />
                            <Route path="/order/options" element={<Navigate to="/order/offre" replace />} />
                            <Route path="/order/summary" element={<Navigate to="/order/recap" replace />} />
                            <Route path="/order/payment" element={<Navigate to="/order/livraison" replace />} />
                            
                            {/* Cart */}
                            <Route path="/cart" element={<Cart />} />
                            
                            {/* Admin */}
                            <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                            <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                            <Route path="/admin-iwasp" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                            <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                            <Route path="/admin/clients" element={<AdminGuard><AdminClients /></AdminGuard>} />
                            <Route path="/admin/creator" element={<AdminGuard><AdminCreator /></AdminGuard>} />
                            <Route path="/admin/cards" element={<AdminGuard><AdminCreator /></AdminGuard>} />
                            <Route path="/admin/instant" element={<AdminGuard><AdminInstantCard /></AdminGuard>} />
                            <Route path="/admin/vcard/create" element={<Navigate to="/admin/instant" replace />} />
                            <Route path="/admin/vcard/edit" element={<Navigate to="/admin/instant" replace />} />
                            <Route path="/admin/evolis" element={<AdminGuard><EvolisPrintPage /></AdminGuard>} />
                            <Route path="/admin/print" element={<AdminGuard><EvolisPrintPage /></AdminGuard>} />
                            <Route path="/admin/print-evolis" element={<AdminGuard><EvolisPrintPage /></AdminGuard>} />
                            <Route path="/admin/brand-assets" element={<AdminGuard><BrandAssets /></AdminGuard>} />
                            <Route path="/brand-assets" element={<AdminGuard><BrandAssets /></AdminGuard>} />
                            
                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                          <MobileBottomNav />
                          <FloatingWhatsApp />
                          <PWAInstallPrompt />
                        </OrderFunnelProvider>
                      </ErrorBoundary>
                    </BrowserRouter>
                  </FeatureValidationProvider>
                </TooltipProvider>
              </CartProvider>
            </GuestCardProvider>
          </BrandProvider>
        </AuthProvider>
      </NetworkProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  );
};

export default App;
