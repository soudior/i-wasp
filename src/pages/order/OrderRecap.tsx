/**
 * Step 5: Récapitulatif Final
 * /order/recap
 * 
 * Style: Haute Couture Digitale — Noir, minimaliste
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useOrderFunnel, OrderFunnelGuard, OFFERS } from "@/contexts/OrderFunnelContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder, OrderItem } from "@/hooks/useOrders";
import { supabase } from "@/integrations/supabase/client";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { ArrowLeft, MapPin, CreditCard, Banknote, Check } from "lucide-react";
import { toast } from "sonner";
import { OrderLoader } from "@/components/order/OrderLoader";

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
      const { firstName, lastName, email, phone, title, company, whatsapp, instagram, linkedin, website, bio } = state.digitalIdentity || {};

      // Sécurité/UX: si l'email appartient déjà à un compte (ou si l'utilisateur n'est pas connecté),
      // on demande une connexion au lieu de tenter un "auto-signup".
      if (!user) {
        setIsProcessing(false);
        toast.error("Veuillez vous connecter pour finaliser votre commande");
        navigate(`/login?redirect=${encodeURIComponent("/order/recap")}`);
        return;
      }

      const userId = user.id;
      const userEmail = user.email;

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
            email: (email || userEmail) || null,
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
          toast.success("Carte digitale activée");
        }
      }

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
        customer_email: (email || userEmail) || null,
        payment_method: paymentMethod,
        user_id: userId,
      });

      if (paymentMethod === "stripe" && order?.id) {
        toast.info("Redirection vers le paiement...");
        
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

      markComplete();
      navigate("/order/confirmation");
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Erreur lors de la commande");
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Order Processing Loader */}
      <AnimatePresence>
        {isProcessing && (
          <OrderLoader 
            message="Création de votre commande"
            submessage="Préparation en cours..."
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen" style={{ backgroundColor: COUTURE.jet }}>
      {/* Honeycomb texture */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100' fill='none' stroke='${encodeURIComponent("#1a1a1a")}' stroke-width='0.4' stroke-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => prevStep()}
            className="flex items-center gap-2 transition-all duration-500"
            style={{ color: COUTURE.textMuted }}
            onMouseEnter={(e) => e.currentTarget.style.color = COUTURE.silk}
            onMouseLeave={(e) => e.currentTarget.style.color = COUTURE.textMuted}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.15em]">Retour</span>
          </button>
          
          <Link 
            to="/"
            className="font-display text-lg tracking-[0.1em]"
            style={{ color: COUTURE.silk }}
          >
            i-wasp
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress indicator */}
      <div className="relative z-10 px-6 mb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 justify-center">
            <span 
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: COUTURE.gold }}
            >
              06
            </span>
            <div 
              className="w-12 h-px"
              style={{ backgroundColor: `${COUTURE.gold}40` }}
            />
            <span 
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: COUTURE.textMuted }}
            >
              Récapitulatif
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-32">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          >
            <h1 
              className="font-display text-2xl md:text-3xl font-light italic mb-3"
              style={{ color: COUTURE.silk }}
            >
              Votre <span style={{ color: COUTURE.gold }}>commande.</span>
            </h1>
          </motion.div>

          {/* Summary */}
          <motion.div 
            className="space-y-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            {/* Offer */}
            <div 
              className="p-6"
              style={{ 
                backgroundColor: COUTURE.jetSoft,
                border: `1px solid ${COUTURE.jetMuted}`,
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Offre
                </span>
                <span className="font-display font-light" style={{ color: COUTURE.gold }}>
                  i-wasp {selectedOffer?.name}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Quantité
                </span>
                <span className="font-light" style={{ color: COUTURE.silk }}>
                  1 carte
                </span>
              </div>
              <div 
                className="h-px my-4"
                style={{ backgroundColor: COUTURE.jetMuted }}
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Total TTC
                </span>
                <span className="text-xl font-light" style={{ color: COUTURE.gold }}>
                  {formatPrice(selectedOffer?.price || 0)}
                </span>
              </div>
            </div>

            {/* Shipping */}
            <div 
              className="p-6"
              style={{ 
                backgroundColor: COUTURE.jetSoft,
                border: `1px solid ${COUTURE.jetMuted}`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={14} style={{ color: COUTURE.gold }} />
                <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                  Livraison
                </span>
              </div>
              <p className="font-light text-sm" style={{ color: COUTURE.silk }}>
                {state.shippingInfo?.address}
              </p>
              <p className="text-sm font-light" style={{ color: COUTURE.textMuted }}>
                {state.shippingInfo?.city}, {state.shippingInfo?.country}
              </p>
            </div>

            {/* Payment method */}
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
                Paiement
              </span>

              <button
                onClick={() => setPaymentMethod("stripe")}
                className="w-full p-5 flex items-center gap-4 transition-all duration-500"
                style={{
                  backgroundColor: paymentMethod === "stripe" ? `${COUTURE.gold}10` : 'transparent',
                  border: `1px solid ${paymentMethod === "stripe" ? COUTURE.gold : COUTURE.jetSoft}`,
                }}
              >
                <div 
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ 
                    backgroundColor: paymentMethod === "stripe" ? COUTURE.gold : COUTURE.jetSoft,
                  }}
                >
                  <CreditCard 
                    className="w-5 h-5" 
                    style={{ color: paymentMethod === "stripe" ? COUTURE.jet : COUTURE.textMuted }} 
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-light" style={{ color: COUTURE.silk }}>
                    Carte bancaire
                  </p>
                  <p className="text-[11px]" style={{ color: COUTURE.textMuted }}>
                    Sécurisé par Stripe
                  </p>
                </div>
                {paymentMethod === "stripe" && (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COUTURE.gold }}
                  >
                    <Check className="w-3 h-3" style={{ color: COUTURE.jet }} />
                  </div>
                )}
              </button>

              <button
                onClick={() => setPaymentMethod("cod")}
                className="w-full p-5 flex items-center gap-4 transition-all duration-500"
                style={{
                  backgroundColor: paymentMethod === "cod" ? `${COUTURE.gold}10` : 'transparent',
                  border: `1px solid ${paymentMethod === "cod" ? COUTURE.gold : COUTURE.jetSoft}`,
                }}
              >
                <div 
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ 
                    backgroundColor: paymentMethod === "cod" ? COUTURE.gold : COUTURE.jetSoft,
                  }}
                >
                  <Banknote 
                    className="w-5 h-5" 
                    style={{ color: paymentMethod === "cod" ? COUTURE.jet : COUTURE.textMuted }} 
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-light" style={{ color: COUTURE.silk }}>
                    Paiement à la livraison
                  </p>
                  <p className="text-[11px]" style={{ color: COUTURE.textMuted }}>
                    Espèces à la réception
                  </p>
                </div>
                {paymentMethod === "cod" && (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: COUTURE.gold }}
                  >
                    <Check className="w-3 h-3" style={{ color: COUTURE.jet }} />
                  </div>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-6"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleConfirmOrder}
            disabled={isProcessing || state.isTransitioning}
            className="w-full py-4 text-[11px] uppercase tracking-[0.2em] font-light transition-all duration-700 disabled:opacity-50"
            style={{ 
              backgroundColor: COUTURE.gold,
              color: COUTURE.jet,
            }}
          >
            {isProcessing 
              ? "Traitement..." 
              : paymentMethod === "stripe" 
                ? `Payer ${formatPrice(selectedOffer?.price || 0)}` 
                : "Confirmer ma commande"
            }
          </button>
          <p 
            className="text-[10px] text-center mt-3"
            style={{ color: COUTURE.textMuted }}
          >
            {paymentMethod === "stripe" 
              ? "Paiement sécurisé par Stripe" 
              : "Règlement à la réception"}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default function OrderRecap() {
  return (
    <OrderFunnelGuard step={6}>
      <OrderRecapContent />
    </OrderFunnelGuard>
  );
}
