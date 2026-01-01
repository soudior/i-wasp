/**
 * Step 6: Order Summary
 * /order/summary
 * 
 * - Récapitulatif complet de la commande
 * - Bouton "Procéder au paiement" uniquement ici
 */

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  OrderProgressBar, 
  OrderTrustBadges,
  PageTransition,
  contentVariants,
  itemVariants,
  ClientPreview 
} from "@/components/order";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ArrowRight,
  Package,
  User,
  MapPin,
  Edit2,
  Shield,
  Truck,
  Clock
} from "lucide-react";

// i-wasp logo
import iwaspLogo from "@/assets/iwasp-logo-white.png";

function OrderSummaryContent() {
  const navigate = useNavigate();
  const { state, prevStep, goToStep, markComplete } = useOrderFunnel();

  const handleProceedToPayment = () => {
    markComplete();
    navigate("/order/payment");
  };

  const selectedPalette = state.designConfig?.cardColor || "#1A1A1A";
  const isLightColor = selectedPalette === "#FFFFFF";

  // Get customer type label
  const customerTypeLabel = {
    particulier: "Particulier",
    professionnel: "Professionnel",
    entreprise: "Entreprise"
  }[state.customerType || "particulier"];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Step Indicator */}
            <OrderProgressBar currentStep={6} />

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
                Récapitulatif de commande
              </motion.h1>
              <motion.p 
                className="text-muted-foreground text-lg"
                variants={itemVariants}
              >
                Vérifiez les détails avant de procéder au paiement
              </motion.p>
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
                      Votre carte NFC
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
                        <h3 className="font-semibold text-lg">Carte NFC {customerTypeLabel}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Quantité : {state.orderOptions?.quantity} carte{(state.orderOptions?.quantity || 0) > 1 ? "s" : ""}
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
                    <Button variant="ghost" size="sm" onClick={() => goToStep(2)}>
                      <Edit2 size={14} className="mr-1" />
                      Modifier
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Nom</p>
                        <p className="font-medium">
                          {state.personalInfo?.firstName} {state.personalInfo?.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{state.personalInfo?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Téléphone</p>
                        <p className="font-medium">{state.personalInfo?.phone}</p>
                      </div>
                      {state.personalInfo?.company && (
                        <div>
                          <p className="text-sm text-muted-foreground">Entreprise</p>
                          <p className="font-medium">{state.personalInfo.company}</p>
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
                    <p className="font-medium">{state.digitalInfo?.address}</p>
                    <p className="text-muted-foreground">
                      {state.digitalInfo?.postalCode} {state.digitalInfo?.city}
                    </p>
                    <p className="text-muted-foreground">{state.digitalInfo?.country}</p>
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
                        Carte NFC × {state.orderOptions?.quantity}
                      </span>
                      <span>{formatPrice(state.orderOptions?.totalPriceCents || 0)}</span>
                    </div>
                    {state.orderOptions?.promoDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Réduction ({state.orderOptions.promoCode})</span>
                        <span>-{state.orderOptions.promoDiscount}%</span>
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
                    <span>{formatPrice(state.orderOptions?.totalPriceCents || 0)}</span>
                  </div>

                  {/* Client Preview Button */}
                  <ClientPreview />

                  {/* CTA */}
                  <Button
                    size="lg"
                    onClick={handleProceedToPayment}
                    className="w-full h-14 text-lg rounded-full bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90"
                  >
                    Procéder au paiement
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {/* NFC Trust badges */}
                  <div className="pt-2">
                    <OrderTrustBadges />
                  </div>

                  {/* Standard trust badges */}
                  <div className="space-y-2 pt-3 text-sm">
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
          <motion.div 
            className="flex justify-start mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="ghost" onClick={prevStep} className="gap-2">
              <ArrowLeft size={18} />
              Retour
            </Button>
          </motion.div>
          </div>
        </main>
      </PageTransition>

      <Footer />
    </div>
  );
}

export default function OrderSummary() {
  return (
    <OrderFunnelGuard step={6}>
      <OrderSummaryContent />
    </OrderFunnelGuard>
  );
}
