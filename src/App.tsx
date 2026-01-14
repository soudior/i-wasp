import { useState, useEffect, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GuestCardProvider } from "@/contexts/GuestCardContext";
import { BrandProvider } from "@/contexts/BrandContext";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { OrderFunnelProvider } from "@/contexts/OrderFunnelContext";
import { CheckoutProvider } from "@/contexts/CheckoutContext";
import { DashboardGuard } from "@/components/DashboardGuard";
import { AdminGuard } from "@/components/AdminGuard";
import { FeatureValidationProvider } from "@/components/FeatureValidationProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import { SplashScreen } from "@/components/SplashScreen";
import { NetworkProvider } from "@/components/NetworkProvider";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { RouteLoader } from "@/components/RouteLoader";

// Route-level code-splitting (performance mobile)
const PublicCard = lazy(() => import("./pages/PublicCard"));
const AdminClients = lazy(() => import("./pages/AdminClients"));
const AdminCreator = lazy(() => import("./pages/AdminCreator"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminInstantCard = lazy(() => import("./pages/AdminInstantCard"));
const EvolisPrintPage = lazy(() => import("./pages/EvolisPrint"));
const FirstCardSetup = lazy(() => import("./pages/FirstCardSetup"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminOrders = lazy(() => import("./pages/AdminOrders"));
const AdminWebStudioOrders = lazy(() => import("./pages/AdminWebStudioOrders"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const OnboardingSuccess = lazy(() => import("./pages/OnboardingSuccess"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EliteDashboard = lazy(() => import("./pages/EliteDashboard"));
const GuestCardCreator = lazy(() => import("./pages/GuestCardCreator"));
const FinalizeCard = lazy(() => import("./pages/FinalizeCard"));
const HomeSaaS = lazy(() => import("./pages/HomeSaaS"));
const HomeLuxeMax = lazy(() => import("./pages/HomeLuxeMax"));
const Index = lazy(() => import("./pages/Index"));
const Demo = lazy(() => import("./pages/Demo"));
const Cart = lazy(() => import("./pages/Cart"));
const HerbalismCard = lazy(() => import("./pages/HerbalismCard"));
const CardSuccess = lazy(() => import("./pages/CardSuccess"));
const UserGuide = lazy(() => import("./pages/UserGuide"));
const Templates = lazy(() => import("./pages/Templates"));
const Settings = lazy(() => import("./pages/Settings"));
const Install = lazy(() => import("./pages/Install"));
const Help = lazy(() => import("./pages/Help"));
const FAQ = lazy(() => import("./pages/FAQ"));
const DemoDashboard = lazy(() => import("./pages/DemoDashboard"));
const Nails = lazy(() => import("./pages/Nails"));
const Partenaires = lazy(() => import("./pages/Partenaires"));
const DevenirPartenaire = lazy(() => import("./pages/DevenirPartenaire"));
const CertificatPartenaire = lazy(() => import("./pages/CertificatPartenaire"));
const RentalDemo = lazy(() => import("./pages/RentalDemo"));
const UltraLuxeDemo = lazy(() => import("./pages/UltraLuxeDemo"));
const VCardAirbnbBookingDemo = lazy(() => import("./pages/VCardAirbnbBookingDemo"));
const ClientForm = lazy(() => import("./pages/ClientForm"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const About = lazy(() => import("./pages/About"));
const Maison = lazy(() => import("./pages/Maison"));
const Vision = lazy(() => import("./pages/Vision"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const BrandAssets = lazy(() => import("./pages/BrandAssets"));
const CardStudio = lazy(() => import("./pages/CardStudio"));
const NFCDemo3D = lazy(() => import("./pages/NFCDemo3D"));
const ProduitsNFC = lazy(() => import("./pages/ProduitsNFC"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Conciergerie = lazy(() => import("./pages/Conciergerie"));
const Club = lazy(() => import("./pages/Club"));
const Contact = lazy(() => import("./pages/Contact"));
const Showroom3D = lazy(() => import("./pages/Showroom3D"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const CGV = lazy(() => import("./pages/CGV"));
const DualBrandShowcase = lazy(() => import("./pages/DualBrandShowcase"));
const Studio = lazy(() => import("./pages/Studio"));
const DemoStudio = lazy(() => import("./pages/DemoStudio"));
const MaisonBOpticCard = lazy(() => import("./pages/MaisonBOpticCard"));
const AdminCardEditor = lazy(() => import("./pages/AdminCardEditor"));
const AdminCardGenerator = lazy(() => import("./pages/AdminCardGenerator"));

// NEW Order funnel pages - 7 steps strict flow
const OrderType = lazy(() => import("./pages/order/OrderType"));
const OrderOffre = lazy(() => import("./pages/order/OrderOffre"));
const OrderTemplate = lazy(() => import("./pages/order/OrderTemplate"));
const OrderIdentite = lazy(() => import("./pages/order/OrderIdentite"));
const OrderCarte = lazy(() => import("./pages/order/OrderCarte"));
const OrderLivraison = lazy(() => import("./pages/order/OrderLivraison"));
const OrderRecap = lazy(() => import("./pages/order/OrderRecap"));
const OrderConfirmationNew = lazy(() => import("./pages/order/OrderConfirmationNew"));
const CheckoutTunnel = lazy(() => import("./pages/CheckoutTunnel"));
const SovereignDashboard = lazy(() => import("./pages/SovereignDashboard"));
const AriellaCard = lazy(() => import("./pages/AriellaCard"));
const LegacyMap = lazy(() => import("./pages/LegacyMap"));
const Subscription = lazy(() => import("./pages/Subscription"));
const OrderDetails = lazy(() => import("./pages/OrderDetails"));
const Orders = lazy(() => import("./pages/Orders"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const WalletPassDownload = lazy(() => import("./pages/WalletPassDownload"));
const WalletCustomizer = lazy(() => import("./pages/WalletCustomizer"));
const AppStoreChecklist = lazy(() => import("./pages/AppStoreChecklist"));
const CharlesLazimiCard = lazy(() => import("./pages/CharlesLazimiCard"));
const KechExcluCard = lazy(() => import("./pages/KechExcluCard"));
const LuxePrestigeCard = lazy(() => import("./pages/LuxePrestigeCard"));
const Services = lazy(() => import("./pages/Services"));
const CartesNFC = lazy(() => import("./pages/CartesNFC"));
const WebStudio = lazy(() => import("./pages/WebStudio"));
const TrackWebStudioOrder = lazy(() => import("./pages/TrackWebStudioOrder"));

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
  const [showSplash, setShowSplash] = useState(() => {
    const path = window.location.pathname || "/";
    const isCardRoute = path.startsWith("/card/") || path.startsWith("/c/");
    if (isCardRoute) return false;

    const splashShown = sessionStorage.getItem("splash-shown");
    return !splashShown;
  });

  useEffect(() => {
    const path = window.location.pathname || "/";
    const isCardRoute = path.startsWith("/card/") || path.startsWith("/c/");
    if (isCardRoute) {
      sessionStorage.setItem("splash-shown", "true");
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
              <CurrencyProvider>
                <GuestCardProvider>
                  <CartProvider>
                  <CheckoutProvider>
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
                          <Suspense fallback={<RouteLoader />}>
                            <Routes>
                            {/* HOME */}
                            <Route path="/" element={<HomeLuxeMax />} />
                            <Route path="/legacy" element={<HomeSaaS />} />
                            <Route path="/classic" element={<Index />} />
                            
                            {/* NEW PAGES - Final structure */}
                            <Route path="/produits" element={<ProduitsNFC />} />
                            <Route path="/produits/:productId" element={<ProductDetail />} />
                            <Route path="/conciergerie" element={<Conciergerie />} />
                            <Route path="/club" element={<Club />} />
                            <Route path="/contact" element={<Contact />} />
                            
                            {/* Demo */}
                              <Route path="/demo" element={<Demo />} />
                              
                              {/* Public NFC Card */}
                              <Route path="/c/:slug" element={<LegacyCardRedirect />} />
                              <Route path="/card/medina-travertin/*" element={<DualBrandShowcase />} />
                              <Route path="/card/herbalism-marrakech" element={<HerbalismCard />} />
                              <Route path="/card/maison-b-optic" element={<MaisonBOpticCard />} />
                              <Route path="/card/charles-lazimi" element={<CharlesLazimiCard />} />
                              <Route path="/card/kech-exclu" element={<KechExcluCard />} />
                              <Route path="/card/luxe-prestige" element={<LuxePrestigeCard />} />
                              <Route path="/card/:slug" element={<PublicCard />} />
                              {/* Auth */}
                              <Route path="/login" element={<Login />} />
                              <Route path="/signup" element={<Signup />} />
                              <Route path="/register" element={<Signup />} />
                              <Route path="/forgot-password" element={<ForgotPassword />} />
                              <Route path="/reset-password" element={<ResetPassword />} />
                              
                              {/* Guest card creation - redirect to order funnel */}
                              <Route path="/create" element={<Navigate to="/order/offre" replace />} />
                              <Route path="/success" element={<CardSuccess />} />
                              <Route path="/guide" element={<UserGuide />} />
                              <Route path="/templates" element={<Templates />} />
                              <Route path="/install" element={<Install />} />
                              <Route path="/help" element={<Help />} />
                              <Route path="/faq" element={<FAQ />} />
                              <Route path="/demo-dashboard" element={<DemoDashboard />} />
                              <Route path="/nails" element={<Nails />} />
                              <Route path="/partenaires" element={<Partenaires />} />
                              <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
                              <Route path="/certificat-partenaire" element={<CertificatPartenaire />} />
                              <Route path="/privacy" element={<PrivacyPolicy />} />
                              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                              <Route path="/mentions-legales" element={<MentionsLegales />} />
                              <Route path="/cgv" element={<CGV />} />
                              <Route path="/about" element={<About />} />
                              <Route path="/a-propos" element={<About />} />
                              <Route path="/maison" element={<Maison />} />
                              <Route path="/vision" element={<Vision />} />
                              <Route path="/features" element={<Features />} />
                              <Route path="/fonctionnalites" element={<Features />} />
                              <Route path="/pricing" element={<Pricing />} />
                              <Route path="/tarifs" element={<Pricing />} />
                              <Route path="/enterprise" element={<Enterprise />} />
                              <Route path="/entreprises" element={<Enterprise />} />
                              <Route path="/business" element={<Enterprise />} />
                              <Route path="/services" element={<Services />} />
                              <Route path="/cartes-nfc" element={<CartesNFC />} />
                              <Route path="/web-studio" element={<WebStudio />} />
                              <Route path="/web-studio/suivi" element={<TrackWebStudioOrder />} />
                              <Route path="/track-web-studio" element={<TrackWebStudioOrder />} />
                              <Route path="/rental-demo" element={<RentalDemo />} />
                              <Route path="/demo/ultra-luxe" element={<UltraLuxeDemo />} />
                              <Route path="/demo/vcard-airbnb-booking" element={<VCardAirbnbBookingDemo />} />
                              <Route path="/demo/nfc-3d" element={<NFCDemo3D />} />
                              <Route path="/demo/studio" element={<DemoStudio />} />
                              <Route path="/sovereign" element={<SovereignDashboard />} />
                              <Route path="/legacy-map" element={<LegacyMap />} />
                              <Route path="/alliance" element={<LegacyMap />} />
                              <Route path="/nfc-animation" element={<NFCDemo3D />} />
                              <Route path="/showroom" element={<Showroom3D />} />
                              <Route path="/showroom-3d" element={<Showroom3D />} />
                              
                              {/* Public order tracking */}
                              <Route path="/track" element={<TrackOrder />} />
                              <Route path="/suivi" element={<TrackOrder />} />
                              {/* Client Form */}
                              <Route path="/form" element={<ClientForm />} />
                              <Route path="/formulaire" element={<ClientForm />} />
                              
                              {/* Finalize card after auth */}
                              <Route path="/onboarding/finalize" element={<FinalizeCard />} />
                              
                              {/* Dashboard */}
                              <Route path="/dashboard" element={<DashboardGuard><Dashboard /></DashboardGuard>} />
                              <Route path="/elite" element={<DashboardGuard><EliteDashboard /></DashboardGuard>} />
                              <Route path="/settings" element={<DashboardGuard><Settings /></DashboardGuard>} />
                              <Route path="/subscription" element={<DashboardGuard><Subscription /></DashboardGuard>} />
                              <Route path="/orders" element={<DashboardGuard><Orders /></DashboardGuard>} />
                              <Route path="/orders/:orderId" element={<DashboardGuard><OrderDetails /></DashboardGuard>} />
                              <Route path="/studio" element={<DashboardGuard><Studio /></DashboardGuard>} />
                              <Route path="/editor" element={<DashboardGuard><CardStudio /></DashboardGuard>} />
                              <Route path="/card-studio" element={<DashboardGuard><CardStudio /></DashboardGuard>} />
                              
                              {/* Legacy onboarding */}
                              <Route path="/onboarding" element={<Onboarding />} />
                              <Route path="/onboarding/success" element={<OnboardingSuccess />} />
                              
                              {/* First card setup */}
                              <Route path="/setup" element={<FirstCardSetup />} />
                              
                              {/* NEW ORDER FUNNEL - 7 steps STRICT */}
                              <Route path="/order" element={<Navigate to="/order/offre" replace />} />
                              <Route path="/order/type" element={<Navigate to="/order/offre" replace />} />
                              <Route path="/order/offre" element={<OrderOffre />} />
                              <Route path="/order/template" element={<OrderTemplate />} />
                              <Route path="/order/identite" element={<OrderIdentite />} />
                              <Route path="/order/carte" element={<OrderCarte />} />
                              <Route path="/order/livraison" element={<OrderLivraison />} />
                              <Route path="/order/recap" element={<OrderRecap />} />
                              <Route path="/order/confirmation" element={<OrderConfirmationNew />} />
                              
                              {/* Legacy order routes - redirect to new funnel */}
                              <Route path="/order/identity" element={<Navigate to="/order/identite" replace />} />
                              <Route path="/order/digital" element={<Navigate to="/order/identite" replace />} />
                              <Route path="/order/design" element={<Navigate to="/order/carte" replace />} />
                              <Route path="/order/options" element={<Navigate to="/order/offre" replace />} />
                              <Route path="/order/summary" element={<Navigate to="/order/recap" replace />} />
                              <Route path="/order/payment" element={<Navigate to="/order/livraison" replace />} />
                              
                              {/* Cart & Checkout */}
                              <Route path="/cart" element={<Cart />} />
                              <Route path="/boutique" element={<Navigate to="/order/type" replace />} />
                              <Route path="/shop" element={<Navigate to="/order/type" replace />} />
                              <Route path="/checkout-tunnel" element={<CheckoutTunnel />} />
                              
                              {/* Wallet Pass */}
                              <Route path="/pass/:slug" element={<WalletPassDownload />} />
                              <Route path="/wallet-customizer" element={<DashboardGuard><WalletCustomizer /></DashboardGuard>} />
                              <Route path="/appstore-checklist" element={<AppStoreChecklist />} />
                              
                              {/* Admin */}
                              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                              <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                              <Route path="/admin-iwasp" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                              <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
                              <Route path="/admin/clients" element={<AdminGuard><AdminClients /></AdminGuard>} />
                              <Route path="/admin/creator" element={<AdminGuard><AdminCreator /></AdminGuard>} />
                              <Route path="/admin/cards" element={<AdminGuard><AdminCreator /></AdminGuard>} />
                              <Route path="/admin/instant" element={<AdminGuard><AdminInstantCard /></AdminGuard>} />
                              <Route path="/admin/instant-card" element={<AdminGuard><AdminInstantCard /></AdminGuard>} />
                              <Route path="/admin/vcard/create" element={<Navigate to="/admin/instant" replace />} />
                              <Route path="/admin/vcard/edit" element={<Navigate to="/admin/instant" replace />} />
                              <Route path="/admin/evolis" element={<AdminGuard><EvolisPrintPage /></AdminGuard>} />
                              <Route path="/admin/print" element={<AdminGuard><EvolisPrintPage /></AdminGuard>} />
                              <Route path="/admin/print-evolis" element={<AdminGuard><EvolisPrintPage /></AdminGuard>} />
                              <Route path="/admin/brand-assets" element={<AdminGuard><BrandAssets /></AdminGuard>} />
                              <Route path="/brand-assets" element={<AdminGuard><BrandAssets /></AdminGuard>} />
                              <Route path="/admin/card-editor" element={<AdminGuard><AdminCardEditor /></AdminGuard>} />
                              <Route path="/admin/card-editor/:cardSlug" element={<AdminGuard><AdminCardEditor /></AdminGuard>} />
                              <Route path="/admin/generator" element={<AdminGuard><AdminCardGenerator /></AdminGuard>} />
                              <Route path="/admin/webstudio" element={<AdminGuard><AdminWebStudioOrders /></AdminGuard>} />
                              <Route path="/admin/web-studio" element={<AdminGuard><AdminWebStudioOrders /></AdminGuard>} />
                              <Route path="/admin/web-studio-orders" element={<AdminGuard><AdminWebStudioOrders /></AdminGuard>} />
                              
                              {/* 404 */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                          <MobileBottomNav />
                          <FloatingWhatsApp />
                          <PWAInstallPrompt />
                        </OrderFunnelProvider>
                      </ErrorBoundary>
                    </BrowserRouter>
                  </FeatureValidationProvider>
                </TooltipProvider>
              </CheckoutProvider>
              </CartProvider>
            </GuestCardProvider>
          </CurrencyProvider>
        </BrandProvider>
      </AuthProvider>
    </NetworkProvider>
  </QueryClientProvider>
</ErrorBoundary>
  );
};

export default App;
