/**
 * Cart Page
 * 
 * Premium cart experience with template preview, quantity controls,
 * and seamless checkout flow.
 */

import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ShoppingCart, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-32 pb-24">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-surface-2 flex items-center justify-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                Votre panier est vide
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Explorez nos templates premium et créez votre carte NFC personnalisée.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-background font-semibold rounded-full px-8"
                onClick={() => navigate("/templates")}
              >
                Découvrir les templates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Votre panier
            </h1>
            <p className="text-muted-foreground">
              {totalItems} article{totalItems > 1 ? "s" : ""} dans votre panier
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="premium" className="p-6">
                      <div className="flex gap-6">
                        {/* Template Preview */}
                        <div className="w-32 h-24 rounded-xl overflow-hidden bg-surface-2 flex-shrink-0">
                          <img
                            src={getTemplateImage(item.templateId)}
                            alt={item.templateName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <span className="text-xs text-amber-400 font-medium tracking-wider uppercase">
                                {item.templateName}
                              </span>
                              <h3 className="text-lg font-semibold text-foreground mt-1 truncate">
                                {item.cardName}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">
                                Carte NFC Premium
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          {/* Quantity & Price */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="text-lg font-semibold w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-foreground">
                                {formatPrice(item.unitPriceCents * item.quantity)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-xs text-muted-foreground">
                                  {formatPrice(item.unitPriceCents)} / unité
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear Cart */}
              <div className="pt-4">
                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Vider le panier
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card variant="premium" className="p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Récapitulatif
                  </h2>

                  {/* Items Summary */}
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

                  {/* Total */}
                  <div className="flex justify-between items-center py-4 border-t border-b border-border/50 mb-6">
                    <span className="text-lg font-semibold text-foreground">Total TTC</span>
                    <span className="text-2xl font-bold text-foreground">
                      {formatPrice(totalPriceCents)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-background font-semibold rounded-full"
                    onClick={() => navigate("/checkout")}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Passer commande
                  </Button>

                  {/* Trust Badges */}
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

      <Footer />
    </div>
  );
}
