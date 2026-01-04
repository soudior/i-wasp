/**
 * Step 7: Payment
 * /order/payment
 * 
 * Hybrid payment system:
 * - Morocco: Cash on Delivery (COD) - No payment required
 * - Europe: Credit Card via Stripe
 */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder, OrderItem } from "@/hooks/useOrders";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  OrderProgressBar,
  PageTransition,
  contentVariants,
  itemVariants 
} from "@/components/order";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  CreditCard,
  Lock,
  Shield,
  Loader2,
  Banknote,
  Truck,
  CheckCircle2,
  MessageCircle,
  Phone,
  MapPin
} from "lucide-react";
import { toast } from "sonner";

// European countries for Stripe
const EUROPEAN_COUNTRIES = [
  "France", "Belgique", "Espagne", "Portugal", "Italie", "Allemagne", 
  "Suisse", "Pays-Bas", "Luxembourg", "Autriche", "Royaume-Uni",
  "Belgium", "Spain", "Italy", "Germany", "Switzerland", "Netherlands",
  "Austria", "United Kingdom", "UK"
];

// Check if country is in Europe
const isEuropeanCountry = (country: string | undefined): boolean => {
  if (!country) return false;
  return EUROPEAN_COUNTRIES.some(
    eu => country.toLowerCase().includes(eu.toLowerCase()) || 
         eu.toLowerCase().includes(country.toLowerCase())
  );
};

// Check if country is Morocco
const isMorocco = (country: string | undefined): boolean => {
  if (!country) return true; // Default to Morocco
  const moroccoNames = ["maroc", "morocco", "ma", "المغرب"];
  return moroccoNames.some(name => 
    country.toLowerCase().includes(name) || 
    name.includes(country.toLowerCase())
  );
};

function OrderPaymentContent() {
  const navigate = useNavigate();
  const { state, resetFunnel } = useOrderFunnel();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "card">(
    isMorocco(state.digitalInfo?.country) ? "cod" : "card"
  );

  // Determine available payment methods based on country
  const countryInfo = useMemo(() => {
    const country = state.digitalInfo?.country;
    const inMorocco = isMorocco(country);
    const inEurope = isEuropeanCountry(country);
    
    return {
      country: country || "Maroc",
      isMorocco: inMorocco,
      isEurope: inEurope,
      showCOD: inMorocco,
      showCard: inEurope || !inMorocco, // Show card for Europe or unknown countries
    };
  }, [state.digitalInfo?.country]);

  // Handle COD order submission
  const handleCODOrder = async () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour continuer");
      navigate("/login?redirect=/order/payment");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order item
      const orderItem: OrderItem = {
        id: crypto.randomUUID(),
        templateId: "iwasp-signature",
        templateName: "Carte NFC i-wasp",
        cardName: `${state.personalInfo?.firstName} ${state.personalInfo?.lastName}`,
        quantity: state.orderOptions?.quantity || 1,
        unitPriceCents: state.orderOptions?.unitPriceCents || 9900,
        logoUrl: state.designConfig?.logoUrl,
      };

      // Create COD order
      await createOrder.mutateAsync({
        order_items: [orderItem],
        quantity: state.orderOptions?.quantity || 1,
        unit_price_cents: state.orderOptions?.unitPriceCents || 9900,
        total_price_cents: state.orderOptions?.totalPriceCents || 9900,
        order_type: "personalized",
        template: "iwasp-signature",
        card_color: state.designConfig?.cardColor || "#1A1A1A",
        logo_url: state.designConfig?.logoUrl,
        currency: "MAD",
        shipping_name: `${state.personalInfo?.firstName} ${state.personalInfo?.lastName}`,
        shipping_phone: state.personalInfo?.phone,
        shipping_address: state.digitalInfo?.address,
        shipping_city: state.digitalInfo?.city,
        shipping_postal_code: state.digitalInfo?.postalCode,
        shipping_country: "MA",
        customer_email: state.personalInfo?.email,
        payment_method: "cod",
      });

      // Success - navigate to confirmation
      resetFunnel();
      navigate("/order/confirmation?method=cod");
    } catch (error) {
      console.error("COD order error:", error);
      toast.error("Erreur lors de la création de la commande. Veuillez réessayer.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Card payment (Stripe)
  const handleCardPayment = async () => {
    // For now, show that Stripe is coming soon
    toast.info("Le paiement par carte bancaire sera bientôt disponible. Contactez-nous pour plus d'informations.");
    // TODO: Implement Stripe checkout
  };

  const handlePayment = async () => {
    if (paymentMethod === "cod") {
      await handleCODOrder();
    } else {
      await handleCardPayment();
    }
  };

  const goBack = () => {
    navigate("/order/summary");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={7} />

            {/* Header */}
            <motion.div 
              className="text-center mb-10"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.h1 
                className="text-3xl md:text-4xl font-display font-bold mb-3"
                variants={itemVariants}
              >
                Finaliser la commande
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                {countryInfo.isMorocco 
                  ? "Payez à la livraison, en toute confiance" 
                  : "Paiement sécurisé par carte bancaire"}
              </motion.p>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {state.orderOptions?.quantity} carte{(state.orderOptions?.quantity || 0) > 1 ? "s" : ""} NFC i-wasp
                    </span>
                    <span>{formatPrice(state.orderOptions?.totalPriceCents || 0, countryInfo.isMorocco ? "MAD" : "EUR")}</span>
                  </div>
                  {state.orderOptions?.promoDiscount && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction ({state.orderOptions.promoCode})</span>
                      <span>-{state.orderOptions.promoDiscount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(state.orderOptions?.totalPriceCents || 0, countryInfo.isMorocco ? "MAD" : "EUR")}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin size={18} className="text-primary" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">
                    {state.personalInfo?.firstName} {state.personalInfo?.lastName}
                  </p>
                  <p className="text-muted-foreground">{state.digitalInfo?.address}</p>
                  {state.digitalInfo?.neighborhood && (
                    <p className="text-muted-foreground">Quartier: {state.digitalInfo.neighborhood}</p>
                  )}
                  <p className="text-muted-foreground">
                    {state.digitalInfo?.postalCode} {state.digitalInfo?.city}
                  </p>
                  <p className="text-muted-foreground">{state.digitalInfo?.country}</p>
                  <p className="text-muted-foreground mt-2 flex items-center gap-2">
                    <Phone size={14} />
                    {state.personalInfo?.phone}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Mode de paiement</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={(v) => setPaymentMethod(v as "cod" | "card")}
                    className="space-y-4"
                  >
                    {/* COD Option - Morocco Only */}
                    {countryInfo.showCOD && (
                      <div 
                        className={`relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "cod" 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("cod")}
                      >
                        <RadioGroupItem value="cod" id="cod" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="cod" className="flex items-center gap-2 font-semibold text-base cursor-pointer">
                            <Banknote className="h-5 w-5 text-green-600" />
                            Paiement à la livraison
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Payez en espèces dès réception de votre commande partout au Maroc 🇲🇦
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                              Pas de paiement maintenant
                            </span>
                            <span className="flex items-center gap-1">
                              <Truck className="h-3 w-3 text-primary" />
                              Livraison 48h-72h
                            </span>
                          </div>
                        </div>
                        {paymentMethod === "cod" && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Payment - Europe */}
                    {countryInfo.showCard && (
                      <div 
                        className={`relative flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          paymentMethod === "card" 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setPaymentMethod("card")}
                      >
                        <RadioGroupItem value="card" id="card" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="card" className="flex items-center gap-2 font-semibold text-base cursor-pointer">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            Carte bancaire
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Paiement sécurisé par Visa, Mastercard ou American Express
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Lock className="h-3 w-3 text-green-600" />
                              SSL 256-bit
                            </span>
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3 text-primary" />
                              3D Secure
                            </span>
                          </div>
                        </div>
                        {paymentMethod === "card" && (
                          <div className="absolute top-3 right-3">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </div>
                        )}
                      </div>
                    )}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>

            {/* COD Confirmation Info */}
            {paymentMethod === "cod" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800 dark:text-green-200 mb-1">
                      Confirmation par WhatsApp
                    </p>
                    <p className="text-green-700 dark:text-green-300">
                      Notre équipe vous contactera par téléphone ou WhatsApp pour confirmer l'adresse avant l'expédition.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 space-y-4">
                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>Vos données sont protégées</span>
                  </div>

                  {/* Submit Button - LoadingButton for single-tap UX */}
                  <LoadingButton
                    size="xl"
                    onClick={handlePayment}
                    isLoading={isProcessing}
                    loadingText="Traitement en cours..."
                    className="w-full rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
                  >
                    {paymentMethod === "cod" ? (
                      <>
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        Confirmer ma commande
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Payer {formatPrice(state.orderOptions?.totalPriceCents || 0, countryInfo.isMorocco ? "MAD" : "EUR")}
                      </>
                    )}
                  </LoadingButton>

                  {/* Trust info for COD */}
                  {paymentMethod === "cod" && (
                    <p className="text-xs text-center text-muted-foreground">
                      Vous ne payez rien maintenant. Règlement en espèces à la réception.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation */}
            <motion.div 
              className="flex justify-start mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="ghost" onClick={goBack} className="gap-2">
                <ArrowLeft size={18} />
                Retour au récapitulatif
              </Button>
            </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default function OrderPayment() {
  return (
    <OrderFunnelGuard step={7}>
      <OrderPaymentContent />
    </OrderFunnelGuard>
  );
}