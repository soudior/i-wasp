/**
 * Express Step 3: Récapitulatif + Paiement
 * /express/payer
 * 
 * Page finale: récap compact + choix paiement + CTA
 * PAS DE LOGIN REQUIS - checkout invité
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useExpressCheckout, EXPRESS_OFFERS, ExpressPaymentMethod } from "@/contexts/ExpressCheckoutContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CreditCard, Banknote, Check, MapPin, User, Shield, Loader2 } from "lucide-react";
import { COUTURE } from "@/lib/hauteCouturePalette";
import { toast } from "sonner";

export default function ExpressPayer() {
  const navigate = useNavigate();
  const { state, setPaymentMethod, markComplete, canAccessStep, resetCheckout } = useExpressCheckout();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if info not complete
  useEffect(() => {
    if (!canAccessStep(3)) {
      navigate("/express/offre", { replace: true });
    }
  }, [canAccessStep, navigate]);

  const selectedOffer = EXPRESS_OFFERS.find(o => o.id === state.selectedOffer);

  const formatPrice = (cents: number): string => {
    return `${(cents / 100).toFixed(0)} MAD`;
  };

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
    if (isProcessing || !state.customerInfo || !selectedOffer) return;
    
    setIsProcessing(true);

    try {
      const { firstName, lastName, email, phone, address, city } = state.customerInfo;

      // Générer un ID de commande unique
      const orderNumber = `EXP-${Date.now().toString(36).toUpperCase()}`;
      
      // Si l'utilisateur est connecté, créer la carte digitale
      if (user?.id) {
        const slug = generateSlug(firstName, lastName);
        
        await supabase.from('digital_cards').insert({
          user_id: user.id,
          slug,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          template: 'signature',
          is_active: true,
          nfc_enabled: true,
          wallet_enabled: true,
        });

        // Upgrade subscription
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

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
      }

      // Créer la commande
      const orderItems = [{
        id: crypto.randomUUID(),
        templateId: "iwasp-express",
        templateName: `Carte NFC i-Wasp ${selectedOffer.name}`,
        cardName: `${firstName} ${lastName}`,
        quantity: 1,
        unitPriceCents: selectedOffer.price,
        logoUrl: null,
      }];

      const { data: order, error: orderError } = await supabase.from('orders').insert({
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
      }).select().single();

      if (orderError) throw orderError;

      // Si paiement Stripe, rediriger vers checkout
      if (state.paymentMethod === "stripe" && order?.id) {
        toast.info("Redirection vers le paiement...");
        
        const { data, error } = await supabase.functions.invoke('create-nfc-payment', {
          body: { 
            quantity: 1,
            offerId: state.selectedOffer,
            priceInCents: selectedOffer.price,
            orderId: order.id,
            customerEmail: email,
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

      // Si COD, marquer comme complet et rediriger
      markComplete();
      resetCheckout();
      toast.success("Commande confirmée ! Vous recevrez votre carte sous 48-72h.");
      navigate("/express/succes");

    } catch (error) {
      console.error("Order error:", error);
      toast.error("Erreur lors de la commande. Veuillez réessayer.");
      setIsProcessing(false);
    }
  };

  if (!state.customerInfo || !selectedOffer) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COUTURE.jet }}>
      {/* Processing overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: COUTURE.gold }} />
              <p className="text-lg" style={{ color: COUTURE.silk }}>Création de votre commande...</p>
              <p className="text-sm mt-2" style={{ color: COUTURE.textMuted }}>Ne fermez pas cette page</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate("/express/infos")}
            disabled={isProcessing}
            className="flex items-center gap-2 transition-all duration-300 disabled:opacity-50"
            style={{ color: COUTURE.textMuted }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] uppercase tracking-[0.1em]">Retour</span>
          </button>
          
          <Link 
            to="/"
            className="font-display text-xl tracking-[0.1em]"
            style={{ color: COUTURE.silk }}
          >
            i-wasp
          </Link>
          
          <div className="w-16" />
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 px-6 mb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.gold }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.gold }} />
            <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: COUTURE.gold }} />
          </div>
          <p className="text-center mt-3 text-[11px] uppercase tracking-[0.15em]" style={{ color: COUTURE.textMuted }}>
            Étape 3/3 — Paiement
          </p>
        </div>
      </div>

      {/* Main content */}
      <main className="relative z-10 px-6 pb-44">
        <div className="max-w-lg mx-auto">
          {/* Title */}
          <motion.div 
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h1 
              className="font-display text-2xl font-light italic mb-2"
              style={{ color: COUTURE.silk }}
            >
              Finalisez votre <span style={{ color: COUTURE.gold }}>commande.</span>
            </h1>
          </motion.div>

          {/* Récap compact */}
          <motion.div 
            className="space-y-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Produit */}
            <div 
              className="p-4 flex items-center justify-between"
              style={{ backgroundColor: COUTURE.jetSoft, border: `1px solid ${COUTURE.jetMuted}` }}
            >
              <div>
                <p className="font-display" style={{ color: COUTURE.gold }}>
                  i-wasp {selectedOffer.name}
                </p>
                <p className="text-xs mt-1" style={{ color: COUTURE.textMuted }}>
                  Carte NFC + Profil digital
                </p>
              </div>
              <span className="text-xl font-light" style={{ color: COUTURE.gold }}>
                {formatPrice(selectedOffer.price)}
              </span>
            </div>

            {/* Infos client mini */}
            <div 
              className="p-4 grid grid-cols-2 gap-4"
              style={{ backgroundColor: COUTURE.jetSoft, border: `1px solid ${COUTURE.jetMuted}` }}
            >
              <div className="flex items-start gap-2">
                <User size={14} style={{ color: COUTURE.gold }} className="mt-0.5" />
                <div>
                  <p className="text-xs" style={{ color: COUTURE.textMuted }}>Client</p>
                  <p className="text-sm" style={{ color: COUTURE.silk }}>
                    {state.customerInfo.firstName} {state.customerInfo.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} style={{ color: COUTURE.gold }} className="mt-0.5" />
                <div>
                  <p className="text-xs" style={{ color: COUTURE.textMuted }}>Livraison</p>
                  <p className="text-sm" style={{ color: COUTURE.silk }}>
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
            <p className="text-[11px] uppercase tracking-[0.1em]" style={{ color: COUTURE.textMuted }}>
              Mode de paiement
            </p>

            {/* COD - Défaut pour le Maroc */}
            <button
              onClick={() => handlePaymentSelect("cod")}
              disabled={isProcessing}
              className="w-full p-4 flex items-center gap-4 transition-all duration-300"
              style={{
                backgroundColor: state.paymentMethod === "cod" ? `${COUTURE.gold}15` : 'transparent',
                border: `2px solid ${state.paymentMethod === "cod" ? COUTURE.gold : COUTURE.jetSoft}`,
              }}
            >
              <div 
                className="w-10 h-10 flex items-center justify-center"
                style={{ 
                  backgroundColor: state.paymentMethod === "cod" ? COUTURE.gold : COUTURE.jetSoft,
                }}
              >
                <Banknote 
                  className="w-5 h-5" 
                  style={{ color: state.paymentMethod === "cod" ? COUTURE.jet : COUTURE.textMuted }} 
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium" style={{ color: COUTURE.silk }}>
                  Paiement à la livraison
                </p>
                <p className="text-xs" style={{ color: COUTURE.textMuted }}>
                  Espèces à la réception · Recommandé
                </p>
              </div>
              {state.paymentMethod === "cod" && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COUTURE.gold }}
                >
                  <Check className="w-3 h-3" style={{ color: COUTURE.jet }} />
                </div>
              )}
            </button>

            {/* Carte bancaire */}
            <button
              onClick={() => handlePaymentSelect("stripe")}
              disabled={isProcessing}
              className="w-full p-4 flex items-center gap-4 transition-all duration-300"
              style={{
                backgroundColor: state.paymentMethod === "stripe" ? `${COUTURE.gold}15` : 'transparent',
                border: `2px solid ${state.paymentMethod === "stripe" ? COUTURE.gold : COUTURE.jetSoft}`,
              }}
            >
              <div 
                className="w-10 h-10 flex items-center justify-center"
                style={{ 
                  backgroundColor: state.paymentMethod === "stripe" ? COUTURE.gold : COUTURE.jetSoft,
                }}
              >
                <CreditCard 
                  className="w-5 h-5" 
                  style={{ color: state.paymentMethod === "stripe" ? COUTURE.jet : COUTURE.textMuted }} 
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium" style={{ color: COUTURE.silk }}>
                  Carte bancaire
                </p>
                <p className="text-xs" style={{ color: COUTURE.textMuted }}>
                  Visa, Mastercard · Sécurisé par Stripe
                </p>
              </div>
              {state.paymentMethod === "stripe" && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COUTURE.gold }}
                >
                  <Check className="w-3 h-3" style={{ color: COUTURE.jet }} />
                </div>
              )}
            </button>
          </motion.div>
        </div>
      </main>

      {/* Fixed CTA - Grand */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-20 px-6 py-5"
        style={{ 
          backgroundColor: COUTURE.jet,
          borderTop: `1px solid ${COUTURE.jetSoft}`,
        }}
      >
        <div className="max-w-lg mx-auto">
          <motion.button
            onClick={handleConfirmOrder}
            disabled={isProcessing}
            whileHover={{ scale: isProcessing ? 1 : 1.02 }}
            whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-3 py-4 transition-all duration-300 disabled:opacity-70"
            style={{ 
              backgroundColor: COUTURE.gold,
              color: COUTURE.jet,
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm uppercase tracking-[0.15em] font-medium">Traitement...</span>
              </>
            ) : (
              <span className="text-sm uppercase tracking-[0.15em] font-medium">
                {state.paymentMethod === "stripe" 
                  ? `Payer ${formatPrice(selectedOffer.price)}` 
                  : `Confirmer · ${formatPrice(selectedOffer.price)}`
                }
              </span>
            )}
          </motion.button>
          
          <div className="flex items-center justify-center gap-2 mt-3">
            <Shield className="w-3 h-3" style={{ color: COUTURE.gold }} />
            <p className="text-[10px]" style={{ color: COUTURE.textMuted }}>
              {state.paymentMethod === "stripe" ? "Paiement sécurisé par Stripe" : "Livraison 48-72h · Satisfait ou remboursé"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
