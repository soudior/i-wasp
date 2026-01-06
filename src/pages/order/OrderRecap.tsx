/**
 * Step 5: Récapitulatif Final
 * /order/recap
 * 
 * IWASP Cupertino Style
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
import { ArrowLeft, CheckCircle2, Package, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";

// IWASP Cupertino Palette
const CUPERTINO = {
  bg: "#F5F5F7",
  card: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#8E8E93",
  accent: "#007AFF",
};

function OrderRecapContent() {
  const navigate = useNavigate();
  const { state, prevStep, markComplete } = useOrderFunnel();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const [isProcessing, setIsProcessing] = useState(false);

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
          // If user already exists, try to continue without account creation
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
            is_active: true, // CARTE DIGITALE ACTIVE IMMÉDIATEMENT
            nfc_enabled: true,
            wallet_enabled: true,
          });

        if (cardError) {
          console.error("Card creation error:", cardError);
          // Continue with order even if card creation fails
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

      await createOrder.mutateAsync({
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
        payment_method: "cod",
      });

      markComplete();
      navigate("/order/confirmation");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Erreur lors de la commande. Veuillez réessayer.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: CUPERTINO.bg }}>
      <Navbar />
      
      <PageTransition>
        <main className="pt-24 pb-32 px-4">
          <div className="max-w-lg mx-auto">
            {/* Progress Bar */}
            <OrderProgressBar currentStep={5} />

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              variants={contentVariants}
              initial="initial"
              animate="animate"
            >
              <motion.p 
                className="text-sm tracking-widest uppercase mb-3"
                style={{ color: CUPERTINO.accent }}
                variants={itemVariants}
              >
                Étape 5 sur 6
              </motion.p>
              <motion.h1 
                className="text-2xl md:text-3xl font-display font-bold mb-2"
                style={{ color: CUPERTINO.text }}
                variants={itemVariants}
              >
                Récapitulatif
              </motion.h1>
              <motion.p 
                style={{ color: CUPERTINO.textSecondary }}
                variants={itemVariants}
              >
                Vérifiez avant de confirmer
              </motion.p>
            </motion.div>

            {/* Clean Summary Card */}
            <motion.div
              className="rounded-3xl p-6 space-y-5 shadow-sm"
              style={{ backgroundColor: CUPERTINO.card }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Offre */}
              <div className="flex justify-between items-center">
                <span style={{ color: CUPERTINO.textSecondary }}>Offre</span>
                <span className="font-semibold" style={{ color: CUPERTINO.accent }}>
                  i-Wasp {selectedOffer?.name}
                </span>
              </div>

              {/* Quantité */}
              <div className="flex justify-between items-center">
                <span style={{ color: CUPERTINO.textSecondary }}>Quantité</span>
                <span className="font-medium" style={{ color: CUPERTINO.text }}>1 carte</span>
              </div>

              {/* Mode de paiement */}
              <div className="flex justify-between items-center">
                <span style={{ color: CUPERTINO.textSecondary }}>Paiement</span>
                <span className="font-medium" style={{ color: CUPERTINO.text }}>À la livraison</span>
              </div>

              {/* Visuel carte */}
              {state.cardPersonalization && (
                <div className="flex justify-between items-center">
                  <span style={{ color: CUPERTINO.textSecondary }}>Visuel carte</span>
                  <span className="font-medium capitalize" style={{ color: CUPERTINO.text }}>
                    {state.cardPersonalization.visualType === "logo" ? "Logo" : "Photo"}
                  </span>
                </div>
              )}

              <Separator className="bg-gray-200" />

              {/* Adresse de livraison */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} style={{ color: CUPERTINO.accent }} />
                  <p className="text-sm" style={{ color: CUPERTINO.textSecondary }}>Livraison</p>
                </div>
                <p className="font-medium" style={{ color: CUPERTINO.text }}>{state.shippingInfo?.address}</p>
                <p className="text-sm" style={{ color: CUPERTINO.textSecondary }}>
                  {state.shippingInfo?.city}, {state.shippingInfo?.country}
                </p>
                <p className="text-sm mt-1" style={{ color: CUPERTINO.textSecondary }}>
                  Tél: {state.shippingInfo?.phone}
                </p>
              </div>

              <Separator className="bg-gray-200" />

              {/* Prix Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-semibold" style={{ color: CUPERTINO.text }}>Total TTC</span>
                <span className="text-2xl font-bold" style={{ color: CUPERTINO.accent }}>
                  {formatPrice(selectedOffer?.price || 0)}
                </span>
              </div>
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
                loadingText="Traitement..."
                disabled={state.isTransitioning}
                className="w-full rounded-full font-semibold h-14 text-lg text-white"
                style={{ backgroundColor: CUPERTINO.accent }}
              >
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Confirmer ma commande
              </LoadingButton>

              <p className="text-xs text-center mt-3" style={{ color: CUPERTINO.textSecondary }}>
                Règlement en espèces à la réception
              </p>
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
                style={{ color: CUPERTINO.textSecondary }}
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
    <OrderFunnelGuard step={5}>
      <OrderRecapContent />
    </OrderFunnelGuard>
  );
}
