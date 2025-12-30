/**
 * Step 5: Order Summary
 * /order/summary
 * 
 * - Récapitulatif complet de la commande
 * - Bouton "Payer" uniquement ici
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Check, 
  CreditCard,
  Package,
  User,
  Palette,
  MapPin,
  Edit2,
  Shield,
  Truck,
  Clock
} from "lucide-react";
import { toast } from "sonner";

// i-wasp logo
import iwaspLogo from "@/assets/iwasp-logo-white.png";

function OrderSummaryContent() {
  const navigate = useNavigate();
  const { state, prevStep, goToStep, resetFunnel } = useOrderFunnel();
  const { user } = useAuth();
  const { addItem } = useCart();

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error("Veuillez vous connecter pour continuer");
      // Store funnel state before redirecting
      navigate("/login?redirect=/order/summary");
      return;
    }

    // Verify all steps are complete
    if (!state.customerType || !state.cardSelection || !state.profileInfo || !state.designConfig) {
      toast.error("Configuration incomplète");
      return;
    }

    // Add to cart and proceed to checkout
    addItem({
      id: `order-${Date.now()}`,
      templateId: state.cardSelection.modelId,
      templateName: state.cardSelection.modelName,
      cardName: `Carte ${state.cardSelection.modelName}`,
      quantity: state.cardSelection.quantity,
      unitPriceCents: Math.round(state.cardSelection.totalPriceCents / state.cardSelection.quantity),
      logoUrl: state.designConfig.logoUrl || undefined,
    });

    // Navigate to checkout
    navigate("/checkout");
  };

  const selectedPalette = state.designConfig?.cardColor || "#1A1A1A";
  const isLightColor = selectedPalette === "#FFFFFF";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center gap-2 text-sm">
                {step > 1 && <div className="w-8 h-1 rounded-full bg-primary" />}
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step < 5 ? "bg-primary/20 text-primary" : "bg-primary text-primary-foreground"
                }`}>
                  {step < 5 ? <Check size={16} /> : step}
                </span>
              </div>
            ))}
          </div>

          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Récapitulatif de commande
            </h1>
            <p className="text-muted-foreground text-lg">
              Vérifiez les détails avant de payer
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card Preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package size={20} className="text-primary" />
                      Votre carte
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(4)}>
                      <Edit2 size={14} className="mr-1" />
                      Modifier
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 items-center">
                      {/* Mini card preview */}
                      <div
                        className="relative w-40 aspect-[1.6/1] rounded-xl shadow-lg overflow-hidden flex-shrink-0"
                        style={{ 
                          backgroundColor: selectedPalette,
                          boxShadow: `0 10px 25px -5px ${selectedPalette}40`
                        }}
                      >
                        {/* i-wasp logo */}
                        <div className="absolute top-2 right-2">
                          <img
                            src={iwaspLogo}
                            alt="i-wasp"
                            className="h-3 object-contain"
                            style={{ 
                              filter: isLightColor ? "invert(1)" : "none",
                              opacity: 0.7
                            }}
                          />
                        </div>
                        {/* Client logo */}
                        {state.designConfig?.logoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <img
                              src={state.designConfig.logoUrl}
                              alt="Logo"
                              className="max-w-[60%] max-h-[50%] object-contain"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{state.cardSelection?.modelName}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Quantité : {state.cardSelection?.quantity} carte{(state.cardSelection?.quantity || 0) > 1 ? "s" : ""}
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-5 h-5 rounded-full border"
                            style={{ 
                              backgroundColor: selectedPalette,
                              borderColor: isLightColor ? "#e5e5e5" : selectedPalette
                            }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {selectedPalette === "#1A1A1A" && "Noir Élégant"}
                            {selectedPalette === "#FFFFFF" && "Blanc Minimal"}
                            {selectedPalette === "#0F172A" && "Bleu Nuit"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Profile Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User size={20} className="text-primary" />
                      Vos coordonnées
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(3)}>
                      <Edit2 size={14} className="mr-1" />
                      Modifier
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Nom</p>
                        <p className="font-medium">
                          {state.profileInfo?.firstName} {state.profileInfo?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{state.profileInfo?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{state.profileInfo?.phone}</p>
                      </div>
                      {state.profileInfo?.company && (
                        <div>
                          <p className="text-sm text-muted-foreground">Entreprise</p>
                          <p className="font-medium">{state.profileInfo.company}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Delivery Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin size={20} className="text-primary" />
                      Adresse de livraison
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => goToStep(3)}>
                      <Edit2 size={14} className="mr-1" />
                      Modifier
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{state.profileInfo?.address}</p>
                    <p className="text-muted-foreground">
                      {state.profileInfo?.postalCode} {state.profileInfo?.city}
                    </p>
                    <p className="text-muted-foreground">{state.profileInfo?.country}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Price Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Total de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Line items */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {state.cardSelection?.modelName} × {state.cardSelection?.quantity}
                      </span>
                      <span>{formatPrice(state.cardSelection?.totalPriceCents || 0)}</span>
                    </div>
                    {state.cardSelection?.promoDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction ({state.cardSelection.promoCode})</span>
                        <span>-{state.cardSelection.promoDiscount}%</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-green-600 font-medium">Gratuite</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total TTC</span>
                    <span>{formatPrice(state.cardSelection?.totalPriceCents || 0)}</span>
                  </div>

                  {/* CTA */}
                  <Button
                    size="lg"
                    onClick={handleProceedToCheckout}
                    className="w-full h-14 text-lg rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payer maintenant
                  </Button>

                  {/* Trust badges */}
                  <div className="space-y-2 pt-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>Paiement 100% sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Production : 2-3 jours ouvrés</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4 text-primary" />
                      <span>Livraison offerte</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex justify-start mt-10">
            <Button variant="ghost" onClick={prevStep} className="gap-2">
              <ArrowLeft size={18} />
              Retour
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderSummary() {
  return (
    <OrderFunnelGuard step={5}>
      <OrderSummaryContent />
    </OrderFunnelGuard>
  );
}
