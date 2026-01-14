/**
 * Floating Cart Summary - Résumé du panier flottant
 * Affiche le total et permet de payer
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Trash2, Plus, Minus, CreditCard, Loader2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePricingCart } from '@/contexts/PricingCartContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const COLORS = {
  noir: "#050505",
  noirSoft: "#0A0A0A",
  noirCard: "#111111",
  or: "#D4A853",
  orLight: "#E8C87A",
  ivoire: "#F5F5F5",
  gris: "#6B6B6B",
  border: "#1A1A1A",
};

export function FloatingCartSummary() {
  const { items, currency, itemCount, getTotal, getTotalFormatted, removeItem, updateQuantity, clearCart, hasPackage } = usePricingCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (!hasPackage()) {
      toast.error('Veuillez sélectionner un forfait de base');
      return;
    }

    setIsLoading(true);
    try {
      // Find the package
      const packageItem = items.find(item => item.type === 'package');
      if (!packageItem) throw new Error('No package selected');

      // Get package type from ID
      const packageType = packageItem.id.replace('web-', '').toUpperCase();

      const { data, error } = await supabase.functions.invoke('create-direct-webstudio-payment', {
        body: { 
          packageType,
          currency,
          // Include options in metadata for manual processing
          options: items.filter(i => i.type !== 'package').map(i => ({
            id: i.id,
            name: i.name,
            quantity: i.quantity,
            price: currency === 'MAD' ? i.priceMAD : i.priceEUR,
          })),
          totalAmount: getTotal(),
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Redirection vers le paiement sécurisé...');
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Erreur lors de la création du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppQuote = () => {
    const itemsList = items.map(item => {
      const price = currency === 'MAD' ? item.priceMAD : item.priceEUR;
      const unit = currency === 'MAD' ? 'DH' : '€';
      return `- ${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}: ${(price * item.quantity).toLocaleString('fr-FR')} ${unit}`;
    }).join('%0A');
    
    const total = getTotalFormatted();
    const message = `Bonjour 👋%0A%0AJe souhaite un devis pour:%0A${itemsList}%0A%0A*Total: ${total}*`;
    
    window.open(`https://wa.me/33626424394?text=${message}`, '_blank');
  };

  if (itemCount === 0) return null;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
          boxShadow: `0 8px 32px ${COLORS.or}50`,
        }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ShoppingCart size={24} style={{ color: COLORS.noir }} />
        <span 
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
          style={{ backgroundColor: COLORS.noir, color: COLORS.or }}
        >
          {itemCount}
        </span>
      </motion.button>

      {/* Cart Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
              style={{ backgroundColor: COLORS.noirCard }}
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 border-b"
                style={{ borderColor: COLORS.border }}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} style={{ color: COLORS.or }} />
                  <h2 className="text-lg font-medium" style={{ color: COLORS.ivoire }}>
                    Votre devis
                  </h2>
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${COLORS.or}20`, color: COLORS.or }}
                  >
                    {itemCount} article{itemCount > 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5"
                >
                  <X size={20} style={{ color: COLORS.gris }} />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map((item) => {
                  const price = currency === 'MAD' ? item.priceMAD : item.priceEUR;
                  const unit = currency === 'MAD' ? 'DH' : '€';
                  const totalItemPrice = price * item.quantity;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-4 rounded-xl"
                      style={{ backgroundColor: COLORS.noirSoft, border: `1px solid ${COLORS.border}` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-sm" style={{ color: COLORS.ivoire }}>
                            {item.name}
                          </p>
                          <p className="text-xs" style={{ color: COLORS.gris }}>
                            {price.toLocaleString('fr-FR')} {unit}{item.unit || ''}{item.period || ''}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                        >
                          <Trash2 size={14} style={{ color: '#ef4444' }} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        {item.type !== 'package' && (
                          <div 
                            className="flex items-center gap-2 rounded-lg px-2 py-1"
                            style={{ backgroundColor: `${COLORS.border}` }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 rounded transition-colors hover:bg-white/10"
                            >
                              <Minus size={14} style={{ color: COLORS.gris }} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium" style={{ color: COLORS.ivoire }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded transition-colors hover:bg-white/10"
                            >
                              <Plus size={14} style={{ color: COLORS.gris }} />
                            </button>
                          </div>
                        )}
                        {item.type === 'package' && <div />}

                        {/* Item Total */}
                        <p className="font-medium" style={{ color: COLORS.or }}>
                          {totalItemPrice.toLocaleString('fr-FR')} {unit}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer with Total and Actions */}
              <div 
                className="p-6 border-t space-y-4"
                style={{ borderColor: COLORS.border, backgroundColor: COLORS.noir }}
              >
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: COLORS.gris }}>Total</span>
                  <span 
                    className="text-2xl font-light"
                    style={{ color: COLORS.or }}
                  >
                    {getTotalFormatted()}
                  </span>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    className="w-full h-12 font-medium text-xs uppercase tracking-[0.15em] rounded-xl"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.or} 0%, ${COLORS.orLight} 100%)`,
                      color: COLORS.noir,
                    }}
                    onClick={handleCheckout}
                    disabled={isLoading || !hasPackage()}
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <CreditCard size={16} className="mr-2" />
                    )}
                    {isLoading ? 'Chargement...' : 'Payer maintenant'}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-10 font-normal text-[10px] uppercase tracking-[0.12em] rounded-xl"
                    style={{ borderColor: COLORS.border, color: COLORS.gris }}
                    onClick={handleWhatsAppQuote}
                  >
                    <MessageCircle size={14} className="mr-2" />
                    Envoyer par WhatsApp
                  </Button>

                  <button
                    onClick={clearCart}
                    className="w-full text-center text-xs py-2 transition-colors hover:text-red-400"
                    style={{ color: COLORS.gris }}
                  >
                    Vider le panier
                  </button>
                </div>

                {!hasPackage() && (
                  <p className="text-xs text-center" style={{ color: '#ef4444' }}>
                    Sélectionnez un forfait pour continuer
                  </p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
