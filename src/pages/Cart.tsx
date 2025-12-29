/**
 * Cart Page - Mobile-First Design
 * 
 * Premium cart experience optimized for touch:
 * - Single column layout on mobile
 * - 48px+ touch targets
 * - Sticky bottom CTA
 * - Haptic-style feedback
 */

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StickyBottomCTA } from "@/components/StickyBottomCTA";
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  CreditCard,
  Shield,
  Package
} from "lucide-react";
import { formatPrice } from "@/lib/pricing";

// Template images mapping
import cardBlackMatte from "@/assets/cards/card-black-matte.png";
import cardWhiteMinimal from "@/assets/cards/card-white-minimal.png";
import cardNavyExecutive from "@/assets/cards/card-navy-executive.png";
import cardGoldAccent from "@/assets/cards/card-gold-accent.png";
import cardHotel from "@/assets/cards/card-hotel.png";
import cardTourism from "@/assets/cards/card-tourism.png";

const templateImages: Record<string, string> = {
  signature: cardBlackMatte,
  minimal: cardWhiteMinimal,
  executive: cardNavyExecutive,
  luxe: cardGoldAccent,
  hotel: cardHotel,
  tourism: cardTourism,
  production: cardBlackMatte,
  "production-light": cardWhiteMinimal,
  "signature-light": cardWhiteMinimal,
  "hotel-guide": cardHotel,
  "hotel-guide-light": cardHotel,
  "hotel-concierge": cardHotel,
  modern: cardNavyExecutive,
  creative: cardGoldAccent,
  tech: cardBlackMatte,
};

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalItems, totalPriceCents, updateItemQuantity, removeItem, clearCart } = useCart();

  const getTemplateImage = (templateId: string) => {
    return templateImages[templateId] || cardBlackMatte;
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-mobile-screen bg-background">
        <main className="pt-8 md:pt-32 pb-32 md:pb-24 px-4 md:px-6">
          <div className="mobile-container md:max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 md:mb-8 rounded-full bg-surface-2 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 md:w-12 md:h-12 text-muted-foreground" />
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-semibold text-foreground mb-3 md:mb-4">
                Votre panier est vide
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8">
                Explorez nos templates premium et créez votre carte NFC personnalisée.
              </p>
              
              {/* Desktop button */}
              <div className="hidden md:block">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-background font-semibold rounded-full px-8"
                  onClick={() => navigate("/templates")}
                >
                  Découvrir les templates
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
        
        {/* Mobile sticky CTA */}
        <StickyBottomCTA
          onClick={() => navigate("/templates")}
          variant="chrome"
        >
          Découvrir les templates
          <ArrowRight className="ml-2 h-5 w-5" />
        </StickyBottomCTA>
      </div>
    );
  }

  return (
    <div className="min-h-mobile-screen bg-background">
      <main className="pt-4 md:pt-32 pb-40 md:pb-24 px-4 md:px-6">
        <div className="mobile-container md:max-w-6xl md:mx-auto">
          {/* Header - Desktop only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-12 hidden md:block"
          >
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Votre panier
            </h1>
            <p className="text-muted-foreground">
              {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
            </p>
          </motion.div>

          {/* Mobile summary */}
          <div className="md:hidden mb-4 text-center">
            <p className="text-sm text-muted-foreground">
              {totalItems} article{totalItems > 1 ? "s" : ""} • {formatPrice(totalPriceCents)}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card variant="premium" className="p-4 md:p-6">
                      <div className="flex gap-4 md:gap-6">
                        {/* Template Preview */}
                        <div className="w-20 h-16 md:w-32 md:h-24 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                          <img
                            src={getTemplateImage(item.templateId)}
                            alt={item.templateName}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] md:text-xs text-amber-400 font-medium tracking-wider uppercase">
                                {item.templateName}
                              </span>
                              <h3 className="text-sm md:text-lg font-semibold text-foreground mt-0.5 truncate">
                                {item.cardName}
                              </h3>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeItem(item.id)}
                              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-muted-foreground active:text-destructive active:bg-destructive/10 transition-colors touch-manipulation"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>

                          {/* Quantity & Price */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground active:bg-surface-3 transition-colors touch-manipulation"
                              >
                                <Minus size={16} />
                              </motion.button>
                              <span className="text-base md:text-lg font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground active:bg-surface-3 transition-colors touch-manipulation"
                              >
                                <Plus size={16} />
                              </motion.button>
                            </div>
                            <div className="text-right">
                              <p className="text-base md:text-lg font-bold text-foreground">
                                {formatPrice(item.unitPriceCents * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart */}
              <div className="pt-2 md:pt-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground active:text-destructive transition-colors touch-manipulation min-h-[44px]"
                >
                  Vider le panier
                </button>
              </div>
            </div>

            {/* Order Summary - Desktop only */}
            <div className="hidden lg:block lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="premium" className="p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Récapitulatif
                  </h2>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate max-w-[60%]">
                          {item.cardName} × {item.quantity}
                        </span>
                        <span className="text-foreground font-medium">
                          {formatPrice(item.unitPriceCents * item.quantity)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Livraison</span>
                      <span className="text-green-500 font-medium">Gratuite</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-t border-b border-border/50 mb-6">
                    <span className="text-lg font-semibold text-foreground">Total TTC</span>
                    <span className="text-2xl font-bold text-foreground">
                      {formatPrice(totalPriceCents)}
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-background font-semibold rounded-full"
                    onClick={() => navigate("/checkout")}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Passer commande
                  </Button>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4 text-amber-500" />
                      <span>Paiement sécurisé à la livraison</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Package className="h-4 w-4 text-amber-500" />
                      <span>Livraison gratuite au Maroc</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <StickyBottomCTA
        onClick={() => navigate("/checkout")}
        variant="chrome"
      >
        <CreditCard className="mr-2 h-5 w-5" />
        Passer commande • {formatPrice(totalPriceCents)}
      </StickyBottomCTA>
    </div>
  );
}
