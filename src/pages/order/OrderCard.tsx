/**
 * Step 2: Card Model Selection
 * /order/card
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOrderFunnel, OrderFunnelGuard } from "@/contexts/OrderFunnelContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatPrice, calculateB2CPrice, calculateB2BPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Minus, 
  Plus,
  Sparkles,
  Tag
} from "lucide-react";
import { toast } from "sonner";

// Card images
import cardBlackMatte from "@/assets/cards/card-black-matte.png";
import cardWhiteMinimal from "@/assets/cards/card-white-minimal.png";
import cardNavyExecutive from "@/assets/cards/card-navy-executive.png";
import cardGoldAccent from "@/assets/cards/card-gold-accent.png";
import cardLuxuryEco from "@/assets/cards/card-luxury-eco.png";

interface CardModel {
  id: string;
  name: string;
  description: string;
  image: string;
  basePriceCents: number;
  features: string[];
  isCustomizable: boolean;
}

const CARD_MODELS: CardModel[] = [
  {
    id: "nfc-standard",
    name: "Carte NFC Standard",
    description: "Design épuré, sobre et efficace",
    image: cardWhiteMinimal,
    basePriceCents: 4900,
    features: ["NFC haute qualité", "Compatible tous smartphones", "1 profil digital"],
    isCustomizable: false,
  },
  {
    id: "nfc-premium",
    name: "Carte NFC Premium",
    description: "Finition mate luxe avec design exclusif",
    image: cardNavyExecutive,
    basePriceCents: 6900,
    features: ["Finition mate luxe", "Design exclusif", "Support prioritaire"],
    isCustomizable: true,
  },
  {
    id: "nfc-signature",
    name: "Carte i-WASP Signature",
    description: "Notre bestseller avec personnalisation complète",
    image: cardBlackMatte,
    basePriceCents: 7900,
    features: ["Logo personnalisé", "Couleur au choix", "Finition premium", "Livraison express"],
    isCustomizable: true,
  },
  {
    id: "nfc-gold",
    name: "Carte Gold Edition",
    description: "Édition limitée avec finition dorée",
    image: cardGoldAccent,
    basePriceCents: 9900,
    features: ["Finition dorée", "Numérotée", "Coffret premium", "Garantie à vie"],
    isCustomizable: true,
  },
];

// Promo codes
const PROMO_CODES: Record<string, number> = {
  "IWASP10": 10,
  "WELCOME20": 20,
  "VIP30": 30,
};

function OrderCardContent() {
  const { state, setCardSelection, nextStep, prevStep } = useOrderFunnel();
  
  const [selectedModel, setSelectedModel] = useState<string | null>(
    state.cardSelection?.modelId || null
  );
  const [quantity, setQuantity] = useState(state.cardSelection?.quantity || 1);
  const [promoCode, setPromoCode] = useState(state.cardSelection?.promoCode || "");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(
    state.cardSelection?.promoCode && state.cardSelection?.promoDiscount
      ? { code: state.cardSelection.promoCode, discount: state.cardSelection.promoDiscount }
      : null
  );

  // Get min quantity based on customer type
  const minQuantity = state.customerType === "entreprise" ? 10 : 1;
  const maxQuantity = state.customerType === "entreprise" ? 1000 : 9;

  useEffect(() => {
    if (quantity < minQuantity) {
      setQuantity(minQuantity);
    }
  }, [minQuantity, quantity]);

  const selectedCard = CARD_MODELS.find(c => c.id === selectedModel);

  // Calculate price
  const calculateTotalPrice = () => {
    if (!selectedCard) return 0;
    
    let unitPrice = selectedCard.basePriceCents;
    
    // Apply B2B pricing for quantity orders
    if (state.customerType === "entreprise" || state.customerType === "professionnel") {
      const b2bPrice = calculateB2BPrice(quantity);
      unitPrice = Math.min(unitPrice, b2bPrice);
    }
    
    let total = unitPrice * quantity;
    
    // Apply promo discount
    if (appliedPromo) {
      total = total * (1 - appliedPromo.discount / 100);
    }
    
    return Math.round(total);
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (PROMO_CODES[code]) {
      setAppliedPromo({ code, discount: PROMO_CODES[code] });
      toast.success(`Code promo appliqué : -${PROMO_CODES[code]}%`);
    } else {
      toast.error("Code promo invalide");
    }
  };

  const handleContinue = () => {
    if (!selectedCard) {
      toast.error("Veuillez sélectionner un modèle de carte");
      return;
    }

    const unitPrice = selectedCard.basePriceCents;
    const totalPrice = calculateTotalPrice();

    setCardSelection({
      modelId: selectedCard.id,
      modelName: selectedCard.name,
      quantity,
      unitPriceCents: unitPrice,
      totalPriceCents: totalPrice,
      promoCode: appliedPromo?.code,
      promoDiscount: appliedPromo?.discount,
    });

    nextStep();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-32 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center gap-2 text-sm">
                {step > 1 && <div className={`w-8 h-1 rounded-full ${step <= 2 ? "bg-primary" : "bg-muted"}`} />}
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  step < 2 ? "bg-primary/20 text-primary" : 
                  step === 2 ? "bg-primary text-primary-foreground" : 
                  "bg-muted text-muted-foreground"
                }`}>
                  {step < 2 ? <Check size={16} /> : step}
                </span>
              </div>
            ))}
          </div>

          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Choisissez votre carte NFC
            </h1>
            <p className="text-muted-foreground text-lg">
              Sélectionnez le modèle et la quantité
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
            {CARD_MODELS.map((card, index) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedModel(card.id)}
                className={`relative rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
                  selectedModel === card.id
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {selectedModel === card.id && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <Check size={14} className="text-primary-foreground" />
                  </motion.div>
                )}
                
                {/* Card Image */}
                <div className="relative h-32 bg-gradient-to-br from-surface-2 to-surface-1 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                  {card.isCustomizable && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-amber-500/90 text-xs font-medium text-background flex items-center gap-1">
                      <Sparkles size={10} />
                      Personnalisable
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base mb-1">{card.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{card.description}</p>
                  
                  <ul className="space-y-1 mb-3">
                    {card.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                        <Check size={10} className="text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="text-lg font-bold text-primary">
                    {formatPrice(card.basePriceCents)}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Quantity & Promo */}
          {selectedCard && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto space-y-6"
            >
              {/* Quantity */}
              <Card>
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-3 block">Quantité</Label>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(minQuantity, quantity - 1))}
                      disabled={quantity <= minQuantity}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="text-2xl font-bold w-16 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  {state.customerType === "entreprise" && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Minimum 10 cartes pour les commandes entreprise
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card>
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-3 block">Code promo</Label>
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Entrez votre code"
                      className="flex-1"
                      disabled={!!appliedPromo}
                    />
                    {appliedPromo ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAppliedPromo(null);
                          setPromoCode("");
                        }}
                      >
                        Retirer
                      </Button>
                    ) : (
                      <Button onClick={handleApplyPromo} disabled={!promoCode.trim()}>
                        Appliquer
                      </Button>
                    )}
                  </div>
                  {appliedPromo && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                      <Tag size={14} />
                      -{appliedPromo.discount}% appliqué
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Price Summary */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">{formatPrice(calculateTotalPrice())}</span>
                      {quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          soit {formatPrice(Math.round(calculateTotalPrice() / quantity))}/carte
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 max-w-md mx-auto">
            <Button variant="ghost" onClick={prevStep} className="gap-2">
              <ArrowLeft size={18} />
              Retour
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedModel}
              className="px-8 h-14 text-lg rounded-full bg-gradient-to-r from-primary to-amber-500"
            >
              Continuer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderCard() {
  return (
    <OrderFunnelGuard step={2}>
      <OrderCardContent />
    </OrderFunnelGuard>
  );
}
