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
import { ExpressCheckoutProvider } from "@/contexts/ExpressCheckoutContext";
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
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";

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
const TarifsComplets = lazy(() => import("./pages/TarifsComplets"));
const SaaSPricing = lazy(() => import("./pages/SaaSPricing"));
const SaaSDashboard = lazy(() => import("./pages/SaaSDashboard"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const BrandAssets = lazy(() => import("./pages/BrandAssets"));
const CardStudio = lazy(() => import("./pages/CardStudio"));
const ProduitsNFC = lazy(() => import("./pages/ProduitsNFC"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Conciergerie = lazy(() => import("./pages/Conciergerie"));
const Club = lazy(() => import("./pages/Club"));
const Contact = lazy(() => import("./pages/Contact"));
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

// EXPRESS CHECKOUT - 3 steps optimized for conversion
const ExpressOffre = lazy(() => import("./pages/express/ExpressOffre"));
const ExpressInfos = lazy(() => import("./pages/express/ExpressInfos"));
const ExpressPayer = lazy(() => import("./pages/express/ExpressPayer"));
const ExpressSucces = lazy(() => import("./pages/express/ExpressSucces"));
const SovereignDashboard = lazy(() => import("./pages/SovereignDashboard"));

// I-WASP Premium Landing
const IWASPLanding = lazy(() => import("./pages/IWASPLanding"));
const IWASPProduit = lazy(() => import("./pages/IWASPProduit"));
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
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
const WebStudioLegacy = lazy(() => import("./pages/WebStudio"));
const NFCPaymentSuccess = lazy(() => import("./pages/NFCPaymentSuccess"));
const PromoPackSuccess = lazy(() => import("./pages/PromoPackSuccess"));

// NEW Web Studio funnel pages
const WebStudioLayout = lazy(() => import("./pages/web-studio/WebStudioLayout"));
const WebStudioEntry = lazy(() => import("./pages/web-studio/WebStudioEntry"));
const StepEntreprise = lazy(() => import("./pages/web-studio/StepEntreprise"));
const StepProduits = lazy(() => import("./pages/web-studio/StepProduits"));
const StepDesign = lazy(() => import("./pages/web-studio/StepDesign"));
const StepContact = lazy(() => import("./pages/web-studio/StepContact"));
const StepRecapitulatif = lazy(() => import("./pages/web-studio/StepRecapitulatif"));
const TrackWebStudioOrder = lazy(() => import("./pages/TrackWebStudioOrder"));
const WebStudioPaymentSuccess = lazy(() => import("./pages/web-studio/WebStudioPaymentSuccess"));
const WebStudioPaymentCancelled = lazy(() => import("./pages/web-studio/WebStudioPaymentCancelled"));
const WebStudioCheckout = lazy(() => import("./pages/web-studio/WebStudioCheckout"));

// NEW Web Studio IA pages
const WebStudioOffres = lazy(() => import("./pages/web-studio/WebStudioOffres"));
const WebStudioConfiguration = lazy(() => import("./pages/web-studio/WebStudioConfiguration"));
const WebStudioPaiement = lazy(() => import("./pages/web-studio/WebStudioPaiement"));
const WebStudioIASuccess = lazy(() => import("./pages/web-studio/WebStudioIASuccess"));
const BlogEditor = lazy(() => import("./pages/web-studio/BlogEditor"));
const WebsitePreview = lazy(() => import("./pages/web-studio/WebsitePreview"));
const PublicWebsite = lazy(() => import("./pages/web-studio/PublicWebsite"));
const AdminWebStudioIA = lazy(() => import("./pages/admin/AdminWebStudioIA"));
const AdminGeneratedWebsites = lazy(() => import("./pages/admin/AdminGeneratedWebsites"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes - reduce refetches
      gcTime: 1000 * 60 * 30, // 30 minutes cache
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
{/* HOME - I-WASP Premium Landing */}
                            <Route path="/" element={<IWASPLanding />} />
                            <Route path="/produit" element={<IWASPProduit />} />
                            <Route path="/home-legacy" element={<HomeLuxeMax />} />
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
                              
                              {/* Guest card creation - redirect to express checkout */}
                              <Route path="/create" element={<Navigate to="/express/offre" replace />} />
                              <Route path="/success" element={<CardSuccess />} />
                              <Route path="/nfc-success" element={<NFCPaymentSuccess />} />
                              <Route path="/pack-success" element={<PromoPackSuccess />} />
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
                              <Route path="/saas-pricing" element={<SaaSPricing />} />
                              <Route path="/saas-dashboard" element={<DashboardGuard><SaaSDashboard /></DashboardGuard>} />
                              <Route path="/tarifs" element={<Pricing />} />
                              <Route path="/tarifs-complets" element={<TarifsComplets />} />
                              <Route path="/enterprise" element={<Enterprise />} />
                              <Route path="/entreprises" element={<Enterprise />} />
                              <Route path="/business" element={<Enterprise />} />
                              <Route path="/services" element={<Services />} />
                              <Route path="/cartes-nfc" element={<CartesNFC />} />
                              <Route path="/coming-soon" element={<ComingSoon />} />
                              <Route path="/bientot" element={<ComingSoon />} />
                              
                              {/* Public website display - Short URL */}
                              <Route path="/s/:slug" element={<PublicWebsite />} />
                              
                              {/* Web Studio Standalone Pages - Must be before the layout with children */}
                              <Route path="/web-studio/suivi" element={<TrackWebStudioOrder />} />
                              <Route path="/web-studio/checkout" element={<WebStudioCheckout />} />
                              <Route path="/web-studio/payment-success" element={<WebStudioPaymentSuccess />} />
                              <Route path="/web-studio/payment-cancelled" element={<WebStudioPaymentCancelled />} />
                              <Route path="/web-studio/blog-editor" element={<BlogEditor />} />
                              <Route path="/web-studio/preview" element={<WebsitePreview />} />
                              <Route path="/web-studio/offres" element={<WebStudioOffres />} />
                              <Route path="/web-studio/configuration" element={<WebStudioConfiguration />} />
                              <Route path="/web-studio/paiement" element={<WebStudioPaiement />} />
                              <Route path="/web-studio/ia-success" element={<WebStudioIASuccess />} />
                              
                              {/* Web Studio - Funnel with layout (must be after standalone routes) */}
                              <Route path="/web-studio/*" element={<WebStudioLayout />}>
                                <Route path="" element={<WebStudioEntry />} />
                                <Route path="entreprise" element={<StepEntreprise />} />
                                <Route path="produits" element={<StepProduits />} />
                                <Route path="design" element={<StepDesign />} />
                                <Route path="contact" element={<StepContact />} />
                                <Route path="recapitulatif" element={<StepRecapitulatif />} />
                              </Route>
                              
                              {/* Admin Web Studio IA */}
                              <Route path="/admin/web-studio-ia" element={<AdminWebStudioIA />} />
                              <Route path="/web-studio-legacy" element={<WebStudioLegacy />} />
                              <Route path="/rental-demo" element={<RentalDemo />} />
                              <Route path="/demo/ultra-luxe" element={<UltraLuxeDemo />} />
                              <Route path="/demo/vcard-airbnb-booking" element={<VCardAirbnbBookingDemo />} />
                              <Route path="/demo/studio" element={<DemoStudio />} />
                              <Route path="/sovereign" element={<SovereignDashboard />} />
                              <Route path="/legacy-map" element={<LegacyMap />} />
                              <Route path="/alliance" element={<LegacyMap />} />
                              
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
                              
                              {/* EXPRESS CHECKOUT - 3 steps optimized */}
                              <Route path="/express" element={<Navigate to="/express/offre" replace />} />
                              <Route path="/express/offre" element={<ExpressCheckoutProvider><ExpressOffre /></ExpressCheckoutProvider>} />
                              <Route path="/express/infos" element={<ExpressCheckoutProvider><ExpressInfos /></ExpressCheckoutProvider>} />
                              <Route path="/express/payer" element={<ExpressCheckoutProvider><ExpressPayer /></ExpressCheckoutProvider>} />
                              <Route path="/express/succes" element={<ExpressSucces />} />
                              
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
                              <Route path="/admin/webstudio" element={<AdminGuard><AdminWebStudioIA /></AdminGuard>} />
                              <Route path="/admin/web-studio" element={<AdminGuard><AdminWebStudioIA /></AdminGuard>} />
                              <Route path="/admin/web-studio-ia" element={<AdminGuard><AdminWebStudioIA /></AdminGuard>} />
                              <Route path="/admin/web-studio-orders" element={<AdminGuard><AdminWebStudioOrders /></AdminGuard>} />
                              <Route path="/admin/sites" element={<AdminGuard><AdminGeneratedWebsites /></AdminGuard>} />
                              <Route path="/admin/generated-websites" element={<AdminGuard><AdminGeneratedWebsites /></AdminGuard>} />
                              
                              {/* 404 */}
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Suspense>
                          <MobileBottomNav />
                          <OnboardingTour />
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
