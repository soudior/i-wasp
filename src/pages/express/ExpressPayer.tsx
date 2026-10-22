import { useAccountOperation } from "@/hooks/useAccountOperation";
import { expressPublicProfile } from "@/lib/expressPublicProfile";
/**
 * Express Step 3: Récapitulatif + Paiement
 * /express/payer
 * 
 * Style: OMNIA — Obsidienne, champagne, ivoire
 */

import { useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useExpressCheckout, EXPRESS_OFFERS, ExpressPaymentMethod } from "@/contexts/ExpressCheckoutContext";
import { useMarketCurrency } from "@/contexts/CurrencyContext";
import { formatMadCents } from "@/lib/nfcPricing";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Banknote, Check, MapPin, User, Shield, Loader2 } from "lucide-react";
import { CHECKOUT_BRAND as CHECKOUT } from "@/lib/checkoutBrandPalette";
import "@/styles/checkout-brand.css";
import { toast } from "sonner";
import { useExpressCheckoutTracking } from "@/hooks/useAnalyticsEvents";

export default function ExpressPayer() {
  const navigate = useNavigate();
  const { state, setPaymentMethod, markComplete, canAccessStep, resetCheckout } = useExpressCheckout();
  const { user } = useAuth();
  const { start, isBusy: isProcessing, accountEpoch } = useAccountOperation(user?.id);
  const createdCardFor = useRef<string | null>(null);
  const createdOrder = useRef<{ key: string; id: string; orderNumber: string } | null>(null);
  useEffect(() => {
    createdCardFor.current = null;
    createdOrder.current = null;
  }, [user?.id, accountEpoch]);
  const { trackPurchase } = useExpressCheckoutTracking('payer');

  useEffect(() => {
    if (!canAccessStep(3)) {
      navigate(state.selectedOffer ? "/express/infos" : "/express/offre", { replace: true });
    }
  }, [canAccessStep, state.selectedOffer, navigate]);

  const selectedOffer = EXPRESS_OFFERS.find(o => o.id === state.selectedOffer);
  const marketCurrency = useMarketCurrency();

  const formatPrice = (cents: number): string => formatMadCents(cents, marketCurrency);

  const handlePaymentSelect = (method: ExpressPaymentMethod) => {
    setPaymentMethod(method);
  };

  const generateSlug = (firstName: string, lastName: string): string => {
    const base = `${firstName}-${lastName}`.toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');
    return `${base}-${Date.now().toString(36)}`;
  };

  const handleConfirmOrder = async () => {
    if (!state.customerInfo || !selectedOffer) return;
    const operation = start();
    if (!operation) return;
    let completed = false;

    try {
      const { firstName, lastName, email, phone, address, city } = state.customerInfo;
      const cardKey = JSON.stringify([user?.id, state.customerInfo]);
      const orderKey = JSON.stringify([cardKey, state.selectedOffer, state.paymentMethod]);
      const orderNumber = createdOrder.current?.key === orderKey
        ? createdOrder.current.orderNumber : `EXP-${Date.now().toString(36).toUpperCase()}`;
      
      if (user?.id) {
        const slug = generateSlug(firstName, lastName);
        
        const publicProfile = expressPublicProfile(state.customerInfo);
        if (publicProfile && createdCardFor.current !== cardKey) {
          const { error: cardError } = await supabase.from('digital_cards').insert({
            user_id: user.id,
            slug,
            ...publicProfile,
            is_active: true,
          });
          if (!operation.isCurrent()) return;
          if (cardError) throw cardError;
          createdCardFor.current = cardKey;
        }

        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!operation.isCurrent()) return;
        if (existingSub) {
          await supabase.from('subscriptions').update({
            plan: 'gold',
            status: 'active',
            expires_at: oneYearFromNow.toISOString(),
            notes: `Express Checkout - ${selectedOffer.name}`,
            updated_at: new Date().toISOString(),
          }).eq('user_id', user.id);
        } else {
          await supabase.from('subscriptions').insert({
            user_id: user.id,
            plan: 'gold',
            status: 'active',
            price_cents: selectedOffer.price,
            expires_at: oneYearFromNow.toISOString(),
            notes: `Express Checkout - ${selectedOffer.name}`,
          });
        }
        if (!operation.isCurrent()) return;
      }

      const orderItems = [{
        id: crypto.randomUUID(),
        templateId: "iwasp-express",
        templateName: `Carte NFC IWASP ${selectedOffer.name}`,
        cardName: `${firstName} ${lastName}`,
        quantity: 1,
        unitPriceCents: selectedOffer.price,
        logoUrl: null,
      }];

      const { data: order, error: orderError } = createdOrder.current?.key === orderKey
        ? { data: createdOrder.current, error: null }
        : await supabase.from('orders').insert({
        order_number: orderNumber,
        user_id: user?.id || null,
        order_items: orderItems,
        quantity: 1,
        unit_price_cents: selectedOffer.price,
        total_price_cents: selectedOffer.price,
        order_type: "personalized",
        template: "signature",
        card_color: "#0B0B0B",
        currency: "MAD",
        shipping_name: `${firstName} ${lastName}`,
        shipping_phone: phone,
        shipping_address: address,
        shipping_city: city,
        shipping_country: "MA",
        customer_email: email,
        payment_method: state.paymentMethod,
        status: state.paymentMethod === "cod" ? "pending" : "pending",
      } as import("@/integrations/supabase/types").TablesInsert<"orders">).select().single();

      if (!operation.isCurrent()) return;
      if (orderError) throw orderError;
      if (!order?.id) throw new Error('Missing created order identifier');
      createdOrder.current = { key: orderKey, id: order.id, orderNumber };

      if (state.paymentMethod === "stripe" && order?.id) {
        toast.info("Redirection vers le paiement...");
        
        // Le montant est fixé CÔTÉ SERVEUR à partir du tierId (grille canonique).
        const { data, error } = await supabase.functions.invoke('create-nfc-payment', {
          body: {
            tierId: state.selectedOffer,
            orderId: order.id,
            email,
          },
        });

        if (!operation.isCurrent()) return;
        if (error) throw error;

        if (data?.url) {
          window.location.href = data.url;
          completed = true;
          return;
        } else {
          throw new Error('No checkout URL received');
        }
      }

      trackPurchase(orderNumber, selectedOffer.price / 100, selectedOffer.name, state.paymentMethod || 'cod');
      
      supabase.functions.invoke('send-admin-alert', {
        body: {
          type: 'express',
          orderId: order?.id || '',
          orderNumber: orderNumber,
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          customerPhone: phone,
          city: city,
          offerName: selectedOffer.name,
          totalPrice: selectedOffer.price,
          paymentMethod: state.paymentMethod || 'cod',
        }
      }).catch(err => console.error('Admin alert failed:', err));
      
      markComplete();
      resetCheckout();
      toast.success("Commande confirmée !");
      navigate("/express/succes");
      completed = true;

    } catch (error) {
      if (!operation.isCurrent()) return;
      console.error("Order error:", error);
      toast.error("Erreur lors de la commande. Veuillez réessayer.");
    } finally {
      if (!completed) operation.finish();
    }
  };

  if (!state.customerInfo || !selectedOffer) {
    return null;
  }

  return (
    <div className="brand-checkout min-h-screen" style={{ backgroundColor: CHECKOUT.background }}>
      {/* Processing overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: CHECKOUT.overlay }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: CHECKOUT.accent }} />
              <p className="text-lg font-medium" style={{ color: CHECKOUT.text }}>Création de votre commande...</p>
              <p className="text-sm mt-2" style={{ color: CHECKOUT.textSecondary }}>Ne fermez pas cette page</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-6 py-6">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/express/infos")}
            disabled={isProcessing}
            className="flex items-center gap-2 transition-all disabled:opacity-50"
            style={{ color: CHECKOUT.textSecondary }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
          
          <Link 
            to="/"
            className="checkout-wordmark text-xl font-semibold tracking-tight"
            style={{ color: CHECKOUT.text }}
          >
            IWASP
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-6 mb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: CHECKOUT.accent }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: CHECKOUT.accent }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: CHECKOUT.accent }} />
          </div>
          <p className="text-center mt-3 text-xs font-medium" style={{ color: CHECKOUT.textMuted }}>
            Étape 3 sur 3 — Paiement
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="px-6 pb-44">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 
              className="text-2xl font-semibold tracking-tight"
              style={{ color: CHECKOUT.text }}
            >
              Finalisez votre commande
            </h1>
          </motion.div>

          {/* Récap compact */}
          <motion.div 
            className="space-y-3 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Produit */}
            <div 
              className="p-5 flex items-center justify-between"
              style={{ 
                backgroundColor: CHECKOUT.card,
                borderRadius: CHECKOUT.radiusLg,
                boxShadow: CHECKOUT.shadowCard,
              }}
            >
              <div>
                <p className="font-semibold" style={{ color: CHECKOUT.text }}>
                  IWASP {selectedOffer.name}
                </p>
                <p className="text-sm mt-0.5" style={{ color: CHECKOUT.textSecondary }}>
                  Carte NFC + Profil digital
                </p>
              </div>
              <span className="text-xl font-semibold" style={{ color: CHECKOUT.accent }}>
                {formatPrice(selectedOffer.price)}
              </span>
            </div>

            {/* Infos client mini */}
            <div 
              className="p-5 grid grid-cols-2 gap-4"
              style={{ 
                backgroundColor: CHECKOUT.card,
                borderRadius: CHECKOUT.radiusLg,
                boxShadow: CHECKOUT.shadowCard,
              }}
            >
              <div className="flex items-start gap-3">
                <User size={16} style={{ color: CHECKOUT.accent }} className="mt-0.5" />
                <div>
                  <p className="text-xs font-medium" style={{ color: CHECKOUT.textSecondary }}>Client</p>
                  <p className="text-sm font-medium" style={{ color: CHECKOUT.text }}>
                    {state.customerInfo.firstName} {state.customerInfo.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={16} style={{ color: CHECKOUT.accent }} className="mt-0.5" />
                <div>
                  <p className="text-xs font-medium" style={{ color: CHECKOUT.textSecondary }}>Livraison</p>
                  <p className="text-sm font-medium" style={{ color: CHECKOUT.text }}>
                    {state.customerInfo.city}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Choix paiement */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-sm font-medium" style={{ color: CHECKOUT.textSecondary }}>
              Mode de paiement
            </p>

            {/* COD */}
            <button
              onClick={() => handlePaymentSelect("cod")}
              disabled={isProcessing}
              className="w-full p-4 flex items-center gap-4 transition-all duration-200"
              style={{
                backgroundColor: CHECKOUT.card,
                borderRadius: CHECKOUT.radiusLg,
                border: `2px solid ${state.paymentMethod === "cod" ? CHECKOUT.accent : CHECKOUT.border}`,
                boxShadow: state.paymentMethod === "cod" ? `0 0 0 4px ${CHECKOUT.accentSubtle}` : CHECKOUT.shadowCard,
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: state.paymentMethod === "cod" ? CHECKOUT.accent : CHECKOUT.backgroundSubtle,
                }}
              >
                <Banknote 
                  className="w-6 h-6" 
                  style={{ color: state.paymentMethod === "cod" ? CHECKOUT.background : CHECKOUT.textSecondary }}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold" style={{ color: CHECKOUT.text }}>
                  Paiement à la livraison
                </p>
                <p className="text-sm" style={{ color: CHECKOUT.textSecondary }}>
                  Espèces à la réception · Recommandé
                </p>
              </div>
              {state.paymentMethod === "cod" && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: CHECKOUT.accent }}
                >
                  <Check className="w-4 h-4" style={{ color: CHECKOUT.background }} />
                </div>
              )}
            </button>

            {/* Carte bancaire */}
            <button
              onClick={() => handlePaymentSelect("stripe")}
              disabled={isProcessing}
              className="w-full p-4 flex items-center gap-4 transition-all duration-200"
              style={{
                backgroundColor: CHECKOUT.card,
                borderRadius: CHECKOUT.radiusLg,
                border: `2px solid ${state.paymentMethod === "stripe" ? CHECKOUT.accent : CHECKOUT.border}`,
                boxShadow: state.paymentMethod === "stripe" ? `0 0 0 4px ${CHECKOUT.accentSubtle}` : CHECKOUT.shadowCard,
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  backgroundColor: state.paymentMethod === "stripe" ? CHECKOUT.accent : CHECKOUT.backgroundSubtle,
                }}
              >
                <CreditCard 
                  className="w-6 h-6" 
                  style={{ color: state.paymentMethod === "stripe" ? CHECKOUT.background : CHECKOUT.textSecondary }}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold" style={{ color: CHECKOUT.text }}>
                  Carte bancaire
                </p>
                <p className="text-sm" style={{ color: CHECKOUT.textSecondary }}>
                  Visa, Mastercard · Sécurisé par Stripe
                </p>
              </div>
              {state.paymentMethod === "stripe" && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: CHECKOUT.accent }}
                >
                  <Check className="w-4 h-4" style={{ color: CHECKOUT.background }} />
                </div>
              )}
            </button>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA */}
      <div 
        className="checkout-action-bar fixed bottom-0 left-0 right-0 z-20 px-6 py-5"
        style={{ 
          backgroundColor: CHECKOUT.background,
          borderTop: `1px solid ${CHECKOUT.border}`,
        }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            onClick={handleConfirmOrder}
            disabled={isProcessing}
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl transition-all duration-200 disabled:opacity-70"
            style={{ 
              backgroundColor: CHECKOUT.accent,
              color: CHECKOUT.background,
              fontWeight: 600,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-base">Traitement...</span>
              </>
            ) : (
              <span className="text-base">
                {state.paymentMethod === "stripe" 
                  ? `Payer ${formatPrice(selectedOffer.price)}` 
                  : `Confirmer · ${formatPrice(selectedOffer.price)}`
                }
              </span>
            )}
          </motion.button>
          
          <div className="flex items-center justify-center gap-2 mt-3">
            <Shield className="w-4 h-4" style={{ color: CHECKOUT.textMuted }} />
            <span className="text-xs" style={{ color: CHECKOUT.textMuted }}>
              Paiement 100% sécurisé
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
