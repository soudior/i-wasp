/**
 * CheckoutTunnel - Tunnel de commande en 4 étapes style IWASP Cupertino
 * 
 * Étapes:
 * 1. Sélection - Choix des produits avec panier en temps réel
 * 2. Livraison - Formulaire de livraison (Maroc)
 * 3. Signature - Confirmation blockchain simulée
 * 4. Confirmation - Envoi WhatsApp automatisé
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckout, MOROCCO_CITIES, type Product } from "@/contexts/CheckoutContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ShoppingCart, 
  Truck, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Phone,
  User,
  MessageCircle,
  Sparkles,
  Package,
  Lock,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

// Palette Cupertino IWASP
const CUPERTINO = {
  bg: "#F5F5F7",
  card: "#FFFFFF",
  text: "#1D1D1F",
  textSecondary: "#8E8E93",
  accent: "#007AFF",
  success: "#34C759",
  warning: "#FF9500",
};

// Produits disponibles
const PRODUCTS: Product[] = [
  {
    id: "nfc-card-black",
    name: "Carte NFC Black Edition",
    description: "Finition mate premium, gravure laser",
    priceDH: 290,
    category: "nfc-card",
    isElite: true,
  },
  {
    id: "nfc-card-white",
    name: "Carte NFC Signature Blanche",
    description: "Design épuré, élégance intemporelle",
    priceDH: 250,
    category: "nfc-card",
  },
  {
    id: "nfc-card-gold",
    name: "Carte NFC Gold Prestige",
    description: "Accents dorés, édition limitée",
    priceDH: 390,
    category: "nfc-card",
    isElite: true,
  },
  {
    id: "nfc-tag-5",
    name: "Pack 5 Tags NFC",
    description: "Stickers programmables résistants",
    priceDH: 150,
    category: "nfc-tag",
  },
  {
    id: "nfc-tag-10",
    name: "Pack 10 Tags NFC",
    description: "Pour vitrines et supports multiples",
    priceDH: 250,
    category: "nfc-tag",
  },
  {
    id: "nfc-nail-starter",
    name: "Kit NFC Nail Starter",
    description: "10 puces + applicateur + formation",
    priceDH: 490,
    category: "nfc-nail",
    isElite: true,
  },
];

// Étape 1: Sélection des produits
function StepSelection() {
  const { state, addItem, removeItem, updateQuantity, nextStep, priceCalculation } = useCheckout();
  
  const getItemQuantity = (productId: string) => {
    const item = state.items.find(i => i.product.id === productId);
    return item?.quantity || 0;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: CUPERTINO.text }}>
          Choisissez vos produits
        </h2>
        <p className="text-sm mt-2" style={{ color: CUPERTINO.textSecondary }}>
          Ajoutez les articles à votre panier
        </p>
      </div>

      {/* Liste des produits */}
      <div className="space-y-3">
        {PRODUCTS.map((product) => {
          const qty = getItemQuantity(product.id);
          const isInCart = qty > 0;
          
          return (
            <motion.div
              key={product.id}
              layout
              className="p-4 rounded-2xl"
              style={{ 
                backgroundColor: CUPERTINO.card,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold" style={{ color: CUPERTINO.text }}>
                      {product.name}
                    </h3>
                    {product.isElite && (
                      <span 
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ backgroundColor: "#FFD60A", color: "#1D1D1F" }}
                      >
                        ÉLITE
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-1" style={{ color: CUPERTINO.textSecondary }}>
                    {product.description}
                  </p>
                  <p className="text-lg font-bold mt-2" style={{ color: CUPERTINO.accent }}>
                    {product.priceDH.toLocaleString()} DH
                  </p>
                </div>

                {/* Contrôles quantité */}
                <div className="flex items-center gap-2">
                  {isInCart ? (
                    <>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(product.id, qty - 1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: CUPERTINO.bg }}
                      >
                        {qty === 1 ? <Trash2 size={16} color="#FF3B30" /> : <Minus size={16} />}
                      </motion.button>
                      <span className="w-8 text-center font-semibold" style={{ color: CUPERTINO.text }}>
                        {qty}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateQuantity(product.id, qty + 1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: CUPERTINO.accent }}
                      >
                        <Plus size={16} color="white" />
                      </motion.button>
                    </>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addItem(product)}
                      className="px-4 py-2 rounded-full text-sm font-medium"
                      style={{ backgroundColor: CUPERTINO.accent, color: "white" }}
                    >
                      Ajouter
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Récapitulatif du panier */}
      {state.items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl"
          style={{ 
            backgroundColor: CUPERTINO.card,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium" style={{ color: CUPERTINO.text }}>Sous-total</span>
            <span className="font-bold text-lg" style={{ color: CUPERTINO.text }}>
              {priceCalculation.subtotalDH.toLocaleString()} DH
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span style={{ color: CUPERTINO.textSecondary }}>Livraison</span>
            <span style={{ color: priceCalculation.freeShipping ? CUPERTINO.success : CUPERTINO.text }}>
              {priceCalculation.freeShipping ? "OFFERTE ✨" : `${priceCalculation.shippingDH} DH`}
            </span>
          </div>
          
          {priceCalculation.freeShipping && priceCalculation.isEliteOrder && (
            <p className="text-xs mb-4 p-2 rounded-lg" style={{ backgroundColor: "#FFD60A20", color: "#B8860B" }}>
              🎁 Livraison offerte pour les commandes Élite !
            </p>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: CUPERTINO.bg }}>
            <span className="font-bold text-lg" style={{ color: CUPERTINO.text }}>Total</span>
            <span className="font-bold text-2xl" style={{ color: CUPERTINO.accent }}>
              {priceCalculation.totalDH.toLocaleString()} DH
            </span>
          </div>
        </motion.div>
      )}

      {/* Bouton continuer */}
      <Button
        onClick={nextStep}
        disabled={state.items.length === 0}
        className="w-full h-14 rounded-2xl text-lg font-semibold"
        style={{ 
          backgroundColor: state.items.length > 0 ? CUPERTINO.accent : CUPERTINO.bg,
          color: state.items.length > 0 ? "white" : CUPERTINO.textSecondary
        }}
      >
        Continuer
        <ArrowRight className="ml-2" size={20} />
      </Button>
    </motion.div>
  );
}

// Étape 2: Formulaire de livraison
function StepDelivery() {
  const { state, setDeliveryInfo, isDeliveryValid, nextStep, prevStep } = useCheckout();
  const [showCities, setShowCities] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  
  const filteredCities = MOROCCO_CITIES.filter(city =>
    city.toLowerCase().includes(cityFilter.toLowerCase())
  );
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: CUPERTINO.text }}>
          Adresse de livraison
        </h2>
        <p className="text-sm mt-2" style={{ color: CUPERTINO.textSecondary }}>
          Livraison uniquement au Maroc 🇲🇦
        </p>
      </div>

      <div className="space-y-4">
        {/* Nom complet */}
        <div>
          <Label className="flex items-center gap-2 mb-2" style={{ color: CUPERTINO.text }}>
            <User size={14} />
            Nom complet
          </Label>
          <Input
            value={state.deliveryInfo.fullName}
            onChange={(e) => setDeliveryInfo({ fullName: e.target.value })}
            placeholder="Prénom et Nom"
            className="h-12 rounded-xl"
            style={{ backgroundColor: CUPERTINO.card }}
          />
        </div>

        {/* Téléphone */}
        <div>
          <Label className="flex items-center gap-2 mb-2" style={{ color: CUPERTINO.text }}>
            <Phone size={14} />
            Téléphone
          </Label>
          <Input
            value={state.deliveryInfo.phone}
            onChange={(e) => setDeliveryInfo({ phone: e.target.value })}
            placeholder="+212 6XX XXX XXX"
            type="tel"
            className="h-12 rounded-xl"
            style={{ backgroundColor: CUPERTINO.card }}
          />
        </div>

        {/* Adresse */}
        <div>
          <Label className="flex items-center gap-2 mb-2" style={{ color: CUPERTINO.text }}>
            <MapPin size={14} />
            Adresse
          </Label>
          <Input
            value={state.deliveryInfo.address}
            onChange={(e) => setDeliveryInfo({ address: e.target.value })}
            placeholder="Rue, numéro, quartier"
            className="h-12 rounded-xl"
            style={{ backgroundColor: CUPERTINO.card }}
          />
        </div>

        {/* Ville */}
        <div className="relative">
          <Label className="flex items-center gap-2 mb-2" style={{ color: CUPERTINO.text }}>
            <MapPin size={14} />
            Ville
          </Label>
          <Input
            value={state.deliveryInfo.city}
            onChange={(e) => {
              setDeliveryInfo({ city: e.target.value });
              setCityFilter(e.target.value);
              setShowCities(true);
            }}
            onFocus={() => setShowCities(true)}
            onBlur={() => setTimeout(() => setShowCities(false), 200)}
            placeholder="Sélectionnez une ville"
            className="h-12 rounded-xl"
            style={{ backgroundColor: CUPERTINO.card }}
          />
          
          {/* Liste des villes */}
          <AnimatePresence>
            {showCities && filteredCities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-xl shadow-lg"
                style={{ backgroundColor: CUPERTINO.card }}
              >
                {filteredCities.slice(0, 8).map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setDeliveryInfo({ city });
                      setShowCities(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl"
                    style={{ color: CUPERTINO.text }}
                  >
                    {city}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Code postal */}
        <div>
          <Label className="mb-2" style={{ color: CUPERTINO.text }}>
            Code postal (optionnel)
          </Label>
          <Input
            value={state.deliveryInfo.postalCode}
            onChange={(e) => setDeliveryInfo({ postalCode: e.target.value })}
            placeholder="20000"
            className="h-12 rounded-xl"
            style={{ backgroundColor: CUPERTINO.card }}
          />
        </div>

        {/* Notes */}
        <div>
          <Label className="mb-2" style={{ color: CUPERTINO.text }}>
            Instructions (optionnel)
          </Label>
          <Textarea
            value={state.deliveryInfo.notes}
            onChange={(e) => setDeliveryInfo({ notes: e.target.value })}
            placeholder="Étage, code d'accès, horaires..."
            className="rounded-xl resize-none"
            style={{ backgroundColor: CUPERTINO.card }}
            rows={3}
          />
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1 h-14 rounded-2xl"
        >
          <ArrowLeft className="mr-2" size={18} />
          Retour
        </Button>
        <Button
          onClick={nextStep}
          disabled={!isDeliveryValid()}
          className="flex-1 h-14 rounded-2xl text-lg font-semibold"
          style={{ 
            backgroundColor: isDeliveryValid() ? CUPERTINO.accent : CUPERTINO.bg,
            color: isDeliveryValid() ? "white" : CUPERTINO.textSecondary
          }}
        >
          Continuer
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </motion.div>
  );
}

// Étape 3: Signature
function StepSignature() {
  const { state, signOrder, nextStep, prevStep } = useCheckout();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleSign = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      signOrder();
      toast.success("Commande signée avec succès !");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setIsAnimating(false);
    }, 1500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold" style={{ color: CUPERTINO.text }}>
          Confirmer votre commande
        </h2>
        <p className="text-sm mt-2" style={{ color: CUPERTINO.textSecondary }}>
          Signature électronique sécurisée
        </p>
      </div>

      {/* Animation de signature */}
      <motion.div
        className="p-8 rounded-3xl text-center"
        style={{ 
          backgroundColor: CUPERTINO.card,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
        }}
      >
        {!state.signature.signed ? (
          <>
            <motion.div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: CUPERTINO.bg }}
              animate={isAnimating ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
              transition={{ duration: 1.5 }}
            >
              {isAnimating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Lock size={40} style={{ color: CUPERTINO.accent }} />
                </motion.div>
              ) : (
                <Shield size={40} style={{ color: CUPERTINO.accent }} />
              )}
            </motion.div>
            
            <h3 className="text-lg font-semibold mb-2" style={{ color: CUPERTINO.text }}>
              {isAnimating ? "Signature en cours..." : "Prêt à signer"}
            </h3>
            <p className="text-sm mb-6" style={{ color: CUPERTINO.textSecondary }}>
              Appuyez sur le bouton pour confirmer votre commande
            </p>
            
            <Button
              onClick={handleSign}
              disabled={isAnimating}
              className="w-full h-14 rounded-2xl text-lg font-semibold"
              style={{ backgroundColor: CUPERTINO.accent }}
            >
              <Lock className="mr-2" size={20} />
              Signer ma commande
            </Button>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10 }}
          >
            <div 
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#34C75920" }}
            >
              <CheckCircle2 size={48} style={{ color: CUPERTINO.success }} />
            </div>
            
            <h3 className="text-lg font-semibold mb-2" style={{ color: CUPERTINO.success }}>
              Commande signée !
            </h3>
            
            <div 
              className="p-4 rounded-xl mt-4 text-left"
              style={{ backgroundColor: CUPERTINO.bg }}
            >
              <p className="text-xs font-mono mb-1" style={{ color: CUPERTINO.textSecondary }}>
                Hash de signature :
              </p>
              <p className="text-sm font-mono font-semibold" style={{ color: CUPERTINO.text }}>
                {state.signature.hash}
              </p>
              <p className="text-xs mt-2" style={{ color: CUPERTINO.textSecondary }}>
                {new Date(state.signature.timestamp!).toLocaleString("fr-MA")}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Boutons */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1 h-14 rounded-2xl"
          disabled={state.signature.signed}
        >
          <ArrowLeft className="mr-2" size={18} />
          Retour
        </Button>
        <Button
          onClick={nextStep}
          disabled={!state.signature.signed}
          className="flex-1 h-14 rounded-2xl text-lg font-semibold"
          style={{ 
            backgroundColor: state.signature.signed ? CUPERTINO.success : CUPERTINO.bg,
            color: state.signature.signed ? "white" : CUPERTINO.textSecondary
          }}
        >
          Finaliser
          <ArrowRight className="ml-2" size={18} />
        </Button>
      </div>
    </motion.div>
  );
}

// Étape 4: Confirmation
function StepConfirmation() {
  const { state, priceCalculation, generateWhatsAppUrl, completeOrder, resetCheckout } = useCheckout();
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  
  useEffect(() => {
    if (!orderNumber) {
      const num = completeOrder();
      setOrderNumber(num);
      
      // Confetti de célébration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);
  
  const handleWhatsAppOrder = () => {
    window.open(generateWhatsAppUrl(), "_blank");
    toast.success("Redirection vers WhatsApp...");
  };
  
  const handleNewOrder = () => {
    resetCheckout();
    navigate("/boutique");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Succès header */}
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "#34C75920" }}
        >
          <Sparkles size={40} style={{ color: CUPERTINO.success }} />
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-2" style={{ color: CUPERTINO.text }}>
          Commande prête ! 🎉
        </h2>
        <p className="text-sm" style={{ color: CUPERTINO.textSecondary }}>
          N° {orderNumber}
        </p>
      </div>

      {/* Récapitulatif */}
      <div 
        className="p-5 rounded-2xl space-y-4"
        style={{ backgroundColor: CUPERTINO.card }}
      >
        <h3 className="font-semibold flex items-center gap-2" style={{ color: CUPERTINO.text }}>
          <Package size={18} />
          Récapitulatif
        </h3>
        
        {state.items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span style={{ color: CUPERTINO.textSecondary }}>
              {item.product.name} × {item.quantity}
            </span>
            <span style={{ color: CUPERTINO.text }}>
              {(item.product.priceDH * item.quantity).toLocaleString()} DH
            </span>
          </div>
        ))}
        
        <div className="pt-3 border-t" style={{ borderColor: CUPERTINO.bg }}>
          <div className="flex justify-between">
            <span style={{ color: CUPERTINO.textSecondary }}>Livraison</span>
            <span style={{ color: priceCalculation.freeShipping ? CUPERTINO.success : CUPERTINO.text }}>
              {priceCalculation.freeShipping ? "OFFERTE" : `${priceCalculation.shippingDH} DH`}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-lg font-bold pt-2">
          <span style={{ color: CUPERTINO.text }}>Total</span>
          <span style={{ color: CUPERTINO.accent }}>
            {priceCalculation.totalDH.toLocaleString()} DH
          </span>
        </div>
      </div>

      {/* Livraison */}
      <div 
        className="p-5 rounded-2xl"
        style={{ backgroundColor: CUPERTINO.card }}
      >
        <h3 className="font-semibold flex items-center gap-2 mb-3" style={{ color: CUPERTINO.text }}>
          <Truck size={18} />
          Livraison
        </h3>
        <p className="text-sm" style={{ color: CUPERTINO.text }}>
          {state.deliveryInfo.fullName}
        </p>
        <p className="text-sm" style={{ color: CUPERTINO.textSecondary }}>
          {state.deliveryInfo.address}
        </p>
        <p className="text-sm" style={{ color: CUPERTINO.textSecondary }}>
          {state.deliveryInfo.city}, Maroc
        </p>
        <p className="text-sm" style={{ color: CUPERTINO.textSecondary }}>
          📞 {state.deliveryInfo.phone}
        </p>
      </div>

      {/* Bouton WhatsApp */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleWhatsAppOrder}
        className="w-full p-5 rounded-2xl flex items-center justify-center gap-3 text-white font-semibold text-lg"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle size={24} />
        Envoyer via WhatsApp
      </motion.button>

      <p className="text-xs text-center" style={{ color: CUPERTINO.textSecondary }}>
        Le bon de commande sera envoyé automatiquement à notre équipe.
        Vous serez recontacté sous 24h pour confirmer.
      </p>

      <Button
        onClick={handleNewOrder}
        variant="outline"
        className="w-full h-12 rounded-xl"
      >
        Nouvelle commande
      </Button>
    </motion.div>
  );
}

// Composant principal du tunnel
export default function CheckoutTunnel() {
  const { state } = useCheckout();
  
  const steps = [
    { id: 1, icon: ShoppingCart, label: "Sélection" },
    { id: 2, icon: Truck, label: "Livraison" },
    { id: 3, icon: Shield, label: "Signature" },
    { id: 4, icon: CheckCircle2, label: "Confirmation" },
  ];
  
  return (
    <div className="min-h-screen" style={{ backgroundColor: CUPERTINO.bg }}>
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className="flex flex-col items-center"
                  animate={{
                    opacity: state.currentStep >= step.id ? 1 : 0.4,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                    style={{
                      backgroundColor: state.currentStep >= step.id ? CUPERTINO.accent : CUPERTINO.card,
                      color: state.currentStep >= step.id ? "white" : CUPERTINO.textSecondary,
                    }}
                  >
                    {state.currentStep > step.id ? (
                      <Check size={18} />
                    ) : (
                      <step.icon size={18} />
                    )}
                  </div>
                  <span 
                    className="text-[10px] font-medium"
                    style={{ color: state.currentStep >= step.id ? CUPERTINO.text : CUPERTINO.textSecondary }}
                  >
                    {step.label}
                  </span>
                </motion.div>
                
                {index < steps.length - 1 && (
                  <div 
                    className="flex-1 h-0.5 mx-2"
                    style={{
                      backgroundColor: state.currentStep > step.id ? CUPERTINO.accent : CUPERTINO.card,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu de l'étape */}
        <AnimatePresence mode="wait">
          {state.currentStep === 1 && <StepSelection key="selection" />}
          {state.currentStep === 2 && <StepDelivery key="delivery" />}
          {state.currentStep === 3 && <StepSignature key="signature" />}
          {state.currentStep === 4 && <StepConfirmation key="confirmation" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
