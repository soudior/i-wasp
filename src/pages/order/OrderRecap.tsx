/**
 * Step 5: Récapitulatif Final
 * /order/recap
 * 
 * IWASP Stealth Luxury Style
 * - Choix du mode de paiement (Stripe ou COD)
 * - Création automatique compte client
 * - Création automatique carte digitale ACTIVE
 * - Création commande
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard, OFFERS } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder, OrderItem } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { OrderProgressBar, PageTransition, contentVariants, itemVariants } from "@/components/order";
import { LoadingButton } from "@/components/ui/LoadingButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhysicalCardPreview } from "@/components/PhysicalCardPreview";
import { STEALTH } from "@/lib/stealthPalette";
import { ArrowLeft, CheckCircle2, MapPin, CreditCard, Banknote, Shield, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = "stripe" | "cod";

function OrderRecapContent() {
  const navigate = useNavigate();
  const { state, prevStep, markComplete, setPaymentInfo } = useOrderFunnel();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");

  const selectedOffer = OFFERS.find(o => o.id === state.selectedOffer);

  const formatPrice = (cents: number): string => {
    return `${(cents / 100).toFixed(0)} MAD`;
  };

  // Generate unique slug from name
  const generateSlug = (firstName: string, lastName: string): string => {
    const base = `${firstName}-${lastName}`.toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    return `${base}-${Date.now().toString(36)}`;
  };

  const handleConfirmOrder = async () => {
    if (isProcessing || state.isTransitioning) return;
    
    setIsProcessing(true);
    setPaymentInfo({ method: paymentMethod });

    try {
      let userId = user?.id;
      let userEmail = user?.email;
      const { firstName, lastName, email, phone, title, company, whatsapp, instagram, linkedin, website, bio } = state.digitalIdentity || {};

      // 1. Auto-create account if not logged in
      if (!user && email) {
        const tempPassword = `iwasp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: tempPassword,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              first_name: firstName,
              last_name: lastName,
            }
          }
        });

        if (authError) {
          console.error("Auto signup error:", authError);
          if (!authError.message.includes("already registered")) {
            throw authError;
          }
        } else if (authData.user) {
          userId = authData.user.id;
          userEmail = authData.user.email;
          toast.success("Compte créé avec succès !");
        }
      }

      // 2. Create digital card (ACTIVE immediately)
      if (userId && firstName && lastName) {
        const slug = generateSlug(firstName, lastName);
        
        const { error: cardError } = await supabase
          .from('digital_cards')
          .insert({
            user_id: userId,
            slug,
            first_name: firstName,
            last_name: lastName,
            title: title || null,
            company: company || null,
            email: email || null,
            phone: phone || null,
            whatsapp: whatsapp || null,
            instagram: instagram || null,
            linkedin: linkedin || null,
            website: website || null,
            tagline: bio || null,
            template: 'iwasp-signature',
            is_active: true,
            nfc_enabled: true,
            wallet_enabled: true,
          });

        if (cardError) {
          console.error("Card creation error:", cardError);
        } else {
          toast.success("Carte digitale activée !");
        }
      }

      // 3. Create order
      const orderItem: OrderItem = {
        id: crypto.randomUUID(),
        templateId: "iwasp-signature",
        templateName: `Carte NFC i-Wasp ${selectedOffer?.name || ""}`,
        cardName: `${firstName} ${lastName}`,
        quantity: 1,
        unitPriceCents: selectedOffer?.price || 59900,
        logoUrl: state.cardPersonalization?.imageUrl || null,
      };

      const order = await createOrder.mutateAsync({
        order_items: [orderItem],
        quantity: 1,
        unit_price_cents: selectedOffer?.price || 59900,
        total_price_cents: selectedOffer?.price || 59900,
        order_type: "personalized",
        template: "iwasp-signature",
        card_color: "#0B0B0B",
        logo_url: state.cardPersonalization?.imageUrl || null,
        currency: "MAD",
        shipping_name: `${firstName} ${lastName}`,
        shipping_phone: state.shippingInfo?.phone || phone,
        shipping_address: state.shippingInfo?.address,
        shipping_city: state.shippingInfo?.city,
        shipping_postal_code: "",
        shipping_country: "MA",
        customer_email: email,
        payment_method: paymentMethod,
      });

      // 4. If Stripe payment, redirect to checkout with order ID
      if (paymentMethod === "stripe" && order?.id) {
        toast.info("Redirection vers le paiement sécurisé...");
        
        const { data, error } = await supabase.functions.invoke('create-nfc-payment', {
          body: { 
            quantity: 1,
            offerId: state.selectedOffer,
            priceInCents: selectedOffer?.price || 59900,
            orderId: order.id,
          },
        });

        if (error) throw error;

        if (data?.url) {
          window.location.href = data.url;
          return;
        } else {
          throw new Error('No checkout URL received');
        }
      }

      // COD: go directly to confirmation
      markComplete();
      navigate("/order/confirmation");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Erreur lors de la commande. Veuillez réessayer.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: STEALTH.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-lg mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={6} />

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: STEALTH.accent }}
                variants={itemVariants}
              >
                Étape 6 sur 7 – Récapitulatif de votre commande
              </motion.p>
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-2"
                style={{ color: STEALTH.text }}
                variants={itemVariants}
              >
                Récapitulatif de votre commande
              </motion.h1>
              <motion.p 
                style={{ color: STEALTH.textSecondary }}
                variants={itemVariants}
              >
                Vos données sont protégées et modifiables à tout moment depuis votre espace i‑wasp
              </motion.p>
            </motion.div>

            {/* Clean Summary Card */}
            <motion.div
              className="rounded-3xl p-6 space-y-5"
              style={{ 
                backgroundColor: STEALTH.bgCard,
                border: `1px solid ${STEALTH.border}`
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Offre */}
              <div className="flex justify-between items-center">
                <span style={{ color: STEALTH.textSecondary }}>Offre</span>
                <span className="font-semibold" style={{ color: STEALTH.accent }}>
                  i-Wasp {selectedOffer?.name}
                </span>
              </div>

              {/* Quantité */}
              <div className="flex justify-between items-center">
                <span style={{ color: STEALTH.textSecondary }}>Quantité</span>
                <span className="font-medium" style={{ color: STEALTH.text }}>1 carte</span>
              </div>

              {/* Visuel carte */}
              {state.cardPersonalization && (
                <div className="flex justify-between items-center">
                  <span style={{ color: STEALTH.textSecondary }}>Visuel carte</span>
                  <span 
                    className="font-medium capitalize"
                    style={{ color: STEALTH.text }}
                  >
                    {state.cardPersonalization.visualType === "logo" ? "Logo" : "Photo"}
                  </span>
                </div>
              )}

              <Separator style={{ backgroundColor: STEALTH.border }} />

              {/* Adresse de livraison */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} style={{ color: STEALTH.accent }} />
                  <p className="text-sm" style={{ color: STEALTH.textSecondary }}>Livraison</p>
                </div>
                <p className="font-medium" style={{ color: STEALTH.text }}>
                  {state.shippingInfo?.address}
                </p>
                <p className="text-sm" style={{ color: STEALTH.textSecondary }}>
                  {state.shippingInfo?.city}, {state.shippingInfo?.country}
                </p>
                <p className="text-sm mt-1" style={{ color: STEALTH.textSecondary }}>
                  Tél: {state.shippingInfo?.phone}
                </p>
              </div>

              <Separator style={{ backgroundColor: STEALTH.border }} />

              {/* Prix Total */}
              <div className="flex justify-between items-center pt-2">
                <span 
                  className="text-lg font-semibold"
                  style={{ color: STEALTH.text }}
                >
                  Total TTC
                </span>
                <span 
                  className="text-2xl font-bold"
                  style={{ color: STEALTH.accent }}
                >
                  {formatPrice(selectedOffer?.price || 0)}
                </span>
              </div>
            </motion.div>

            {/* Payment Method Selection */}
            <motion.div
              className="mt-6 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <p 
                className="text-sm font-medium mb-3"
                style={{ color: STEALTH.textSecondary }}
              >
                Mode de paiement
              </p>

              {/* Stripe Option */}
              <button
                onClick={() => setPaymentMethod("stripe")}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === "stripe" 
                    ? "border-[#D4AF37] bg-[#D4AF37]/10" 
                    : "border-white/10 hover:border-white/20"
                }`}
                style={{ backgroundColor: paymentMethod === "stripe" ? "rgba(212, 175, 55, 0.1)" : STEALTH.bgCard }}
              >
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === "stripe" ? "bg-[#D4AF37]" : "bg-white/10"
                  }`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMethod === "stripe" ? "text-black" : "text-white/60"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold" style={{ color: STEALTH.text }}>
                    Paiement par carte
                  </p>
                  <p className="text-sm" style={{ color: STEALTH.textSecondary }}>
                    Visa, Mastercard • Sécurisé par Stripe
                  </p>
                </div>
                {paymentMethod === "stripe" && (
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                )}
              </button>

              {/* COD Option */}
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === "cod" 
                    ? "border-[#D4AF37] bg-[#D4AF37]/10" 
                    : "border-white/10 hover:border-white/20"
                }`}
                style={{ backgroundColor: paymentMethod === "cod" ? "rgba(212, 175, 55, 0.1)" : STEALTH.bgCard }}
              >
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === "cod" ? "bg-[#D4AF37]" : "bg-white/10"
                  }`}
                >
                  <Banknote className={`w-6 h-6 ${paymentMethod === "cod" ? "text-black" : "text-white/60"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold" style={{ color: STEALTH.text }}>
                    Paiement à la livraison
                  </p>
                  <p className="text-sm" style={{ color: STEALTH.textSecondary }}>
                    Espèces à la réception
                  </p>
                </div>
                {paymentMethod === "cod" && (
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                )}
              </button>
            </motion.div>

            {/* Physical Card Preview */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <PhysicalCardPreview compact />
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <LoadingButton
                size="xl"
                onClick={handleConfirmOrder}
                isLoading={isProcessing}
                loadingText={paymentMethod === "stripe" ? "Redirection..." : "Traitement..."}
                disabled={state.isTransitioning}
                className="w-full rounded-full font-semibold h-14 text-lg gap-2"
                style={{ 
                  backgroundColor: STEALTH.accent,
                  color: STEALTH.bg
                }}
              >
                {paymentMethod === "stripe" ? (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Payer {formatPrice(selectedOffer?.price || 0)}
                    <ExternalLink className="h-4 w-4 opacity-60" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Confirmer ma commande
                  </>
                )}
              </LoadingButton>

              <div className="flex items-center justify-center gap-2 mt-3">
                <Shield className="w-4 h-4" style={{ color: STEALTH.textMuted }} />
                <p 
                  className="text-xs"
                  style={{ color: STEALTH.textMuted }}
                >
                  {paymentMethod === "stripe" 
                    ? "Paiement sécurisé par Stripe" 
                    : "Règlement en espèces à la réception"}
                </p>
              </div>
            </motion.div>

            {/* Back Button */}
            <motion.div 
              className="flex justify-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="ghost" 
                onClick={prevStep}
                disabled={state.isTransitioning || isProcessing}
                className="gap-2"
                style={{ color: STEALTH.textSecondary }}
              >
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

export default function OrderRecap() {
  return (
    <OrderFunnelGuard step={6}>
      <OrderRecapContent />
    </OrderFunnelGuard>
  );
}
