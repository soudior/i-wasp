/**
 * OrderFunnel - Multi-step order process
 * 
 * STEPS:
 * 1. Customer Type (Particulier, Professionnel, Quantité)
 * 2. Card Type (based on customer type)
 * 3. Customization (logo, color, preview)
 * 4. Summary (review before payment)
 * 5. Redirect to Checkout (payment)
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, PRICING, calculateB2CPrice, calculateB2BPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PhotoUpload } from "@/components/PhotoUpload";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Briefcase, 
  Users, 
  Check, 
  CreditCard,
  Palette,
  Image,
  ShoppingBag,
  Sparkles,
  Building2,
  Package
} from "lucide-react";
import { toast } from "sonner";

// Import card images
import cardBlackMatte from "@/assets/cards/card-black-matte.png";
import cardWhiteMinimal from "@/assets/cards/card-white-minimal.png";
import cardNavyExecutive from "@/assets/cards/card-navy-executive.png";
import cardGoldAccent from "@/assets/cards/card-gold-accent.png";
import cardLuxuryEco from "@/assets/cards/card-luxury-eco.png";

// Customer types
type CustomerType = "particulier" | "professionnel" | "quantite";

// Card products
interface CardProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  basePriceCents: number;
  features: string[];
  availableFor: CustomerType[];
  isCustomizable: boolean;
  colors: string[];
}

const CARD_PRODUCTS: CardProduct[] = [
  {
    id: "nfc-standard",
    name: "Carte NFC Standard",
    description: "Carte de visite NFC classique, sobre et efficace",
    image: cardWhiteMinimal,
    basePriceCents: 4900,
    features: ["NFC haute qualité", "Compatible tous smartphones", "1 profil digital"],
    availableFor: ["particulier", "professionnel"],
    isCustomizable: false,
    colors: ["#FFFFFF", "#1A1A1A"],
  },
  {
    id: "nfc-premium",
    name: "Carte NFC Premium",
    description: "Finition premium avec design personnalisé",
    image: cardNavyExecutive,
    basePriceCents: 6900,
    features: ["Finition mate luxe", "Design exclusif", "Support prioritaire", "QR code intégré"],
    availableFor: ["particulier", "professionnel"],
    isCustomizable: true,
    colors: ["#1A1A1A", "#0F172A", "#FFFFFF", "#D4AF37"],
  },
  {
    id: "nfc-custom",
    name: "Carte Personnalisée",
    description: "Votre logo et couleurs pour une identité unique",
    image: cardGoldAccent,
    basePriceCents: 7900,
    features: ["Logo personnalisé", "Couleur au choix", "Finition premium", "Livraison express"],
    availableFor: ["particulier", "professionnel", "quantite"],
    isCustomizable: true,
    colors: ["#1A1A1A", "#0F172A", "#FFFFFF", "#D4AF37", "#991B1B", "#166534"],
  },
  {
    id: "nfc-enterprise",
    name: "Carte Entreprise",
    description: "Solution sur-mesure pour équipes et flottes",
    image: cardBlackMatte,
    basePriceCents: 2900, // Prix unitaire pour grandes quantités
    features: ["Prix dégressifs", "Personnalisation complète", "Account manager dédié", "Facturation entreprise"],
    availableFor: ["quantite"],
    isCustomizable: true,
    colors: ["#1A1A1A", "#0F172A", "#FFFFFF", "#D4AF37"],
  },
];

// Step indicator
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  const steps = [
    { number: 1, label: "Type" },
    { number: 2, label: "Carte" },
    { number: 3, label: "Personnalisation" },
    { number: 4, label: "Récapitulatif" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all ${
              currentStep >= step.number
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > step.number ? <Check size={16} /> : step.number}
          </div>
          <span
            className={`hidden sm:block ml-2 text-sm ${
              currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-0.5 mx-2 ${
                currentStep > step.number ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Step 1: Customer Type Selection
function Step1CustomerType({
  selected,
  onSelect,
}: {
  selected: CustomerType | null;
  onSelect: (type: CustomerType) => void;
}) {
  const options = [
    {
      id: "particulier" as CustomerType,
      icon: User,
      title: "Particulier",
      description: "Commande individuelle pour usage personnel ou professionnel",
      priceHint: "À partir de 49€",
    },
    {
      id: "professionnel" as CustomerType,
      icon: Briefcase,
      title: "Professionnel",
      description: "Indépendant, freelance ou petite équipe (1-9 cartes)",
      priceHint: "À partir de 44€/carte",
    },
    {
      id: "quantite" as CustomerType,
      icon: Users,
      title: "Commande en quantité",
      description: "Entreprise, équipe ou revendeur (10+ cartes)",
      priceHint: "À partir de 29€/carte",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
          Quel type de client êtes-vous ?
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez votre profil pour voir les options adaptées
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] ${
              selected === option.id
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                : "border-border hover:border-primary/50 bg-card"
            }`}
          >
            {selected === option.id && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check size={14} className="text-primary-foreground" />
              </div>
            )}
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <option.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
            <p className="text-sm font-medium text-primary">{option.priceHint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 2: Card Type Selection
function Step2CardType({
  customerType,
  selected,
  onSelect,
}: {
  customerType: CustomerType;
  selected: string | null;
  onSelect: (cardId: string) => void;
}) {
  const availableCards = CARD_PRODUCTS.filter((card) =>
    card.availableFor.includes(customerType)
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
          Choisissez votre carte NFC
        </h2>
        <p className="text-muted-foreground">
          Sélectionnez le modèle qui correspond à vos besoins
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableCards.map((card) => (
          <button
            key={card.id}
            onClick={() => onSelect(card.id)}
            className={`relative rounded-2xl border-2 text-left transition-all duration-300 hover:scale-[1.02] overflow-hidden ${
              selected === card.id
                ? "border-primary shadow-lg shadow-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            {selected === card.id && (
              <div className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Check size={14} className="text-primary-foreground" />
              </div>
            )}
            
            {/* Card Image */}
            <div className="relative h-40 bg-gradient-to-br from-surface-2 to-surface-1 overflow-hidden">
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
              <h3 className="font-semibold text-lg mb-1">{card.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{card.description}</p>
              
              <ul className="space-y-1 mb-4">
                {card.features.slice(0, 3).map((feature, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <Check size={12} className="text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold">{formatPrice(card.basePriceCents)}</span>
                {customerType === "quantite" && (
                  <span className="text-xs text-muted-foreground">/carte (100+)</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Step 3: Customization
function Step3Customization({
  card,
  config,
  onConfigChange,
}: {
  card: CardProduct;
  config: {
    color: string;
    logoUrl: string | null;
    quantity: number;
  };
  onConfigChange: (config: { color: string; logoUrl: string | null; quantity: number }) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
          Personnalisez votre carte
        </h2>
        <p className="text-muted-foreground">
          Configurez les options de votre carte NFC
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Preview */}
        <div className="order-2 lg:order-1">
          <Card className="overflow-hidden">
            <div
              className="relative aspect-[1.6/1] flex items-center justify-center p-8"
              style={{ backgroundColor: config.color }}
            >
              {config.logoUrl ? (
                <img
                  src={config.logoUrl}
                  alt="Logo"
                  className="max-w-[60%] max-h-[60%] object-contain"
                />
              ) : (
                <div className="text-center">
                  <Image
                    size={48}
                    className={`mx-auto mb-2 ${
                      config.color === "#FFFFFF" || config.color === "#D4AF37"
                        ? "text-gray-400"
                        : "text-white/40"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      config.color === "#FFFFFF" || config.color === "#D4AF37"
                        ? "text-gray-500"
                        : "text-white/60"
                    }`}
                  >
                    Votre logo ici
                  </p>
                </div>
              )}
              {/* NFC indicator */}
              <div className="absolute bottom-4 right-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-4 h-4 rounded-full bg-white/60" />
                </div>
              </div>
            </div>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">Aperçu en temps réel</p>
            </CardContent>
          </Card>
        </div>

        {/* Configuration */}
        <div className="order-1 lg:order-2 space-y-6">
          {/* Color Selection */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Palette size={16} />
              Couleur de la carte
            </Label>
            <div className="flex flex-wrap gap-3">
              {card.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onConfigChange({ ...config, color })}
                  className={`relative w-12 h-12 rounded-xl border-2 transition-all ${
                    config.color === color
                      ? "border-primary scale-110 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {config.color === color && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check
                        size={16}
                        className={
                          color === "#FFFFFF" || color === "#D4AF37"
                            ? "text-gray-800"
                            : "text-white"
                        }
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Upload */}
          {card.isCustomizable && (
            <div>
              <Label className="flex items-center gap-2 mb-3">
                <Image size={16} />
                Votre logo (optionnel)
              </Label>
              <PhotoUpload
                value={config.logoUrl}
                onChange={(url) => onConfigChange({ ...config, logoUrl: url })}
                type="logo"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Format recommandé: PNG transparent, 500x500px minimum
              </p>
            </div>
          )}

          {/* Quantity */}
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Package size={16} />
              Quantité
            </Label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() =>
                  onConfigChange({ ...config, quantity: Math.max(1, config.quantity - 1) })
                }
                disabled={config.quantity <= 1}
              >
                -
              </Button>
              <Input
                type="number"
                min="1"
                max="999"
                value={config.quantity}
                onChange={(e) =>
                  onConfigChange({
                    ...config,
                    quantity: Math.max(1, Math.min(999, parseInt(e.target.value) || 1)),
                  })
                }
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onConfigChange({ ...config, quantity: config.quantity + 1 })}
              >
                +
              </Button>
            </div>
          </div>

          {/* Price Preview */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Prix estimé</p>
                  <p className="text-xs text-muted-foreground">
                    {config.quantity} carte{config.quantity > 1 ? "s" : ""}
                  </p>
                </div>
                <p className="text-2xl font-bold">
                  {formatPrice(card.basePriceCents * config.quantity)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Step 4: Summary
function Step4Summary({
  customerType,
  card,
  config,
}: {
  customerType: CustomerType;
  card: CardProduct;
  config: {
    color: string;
    logoUrl: string | null;
    quantity: number;
  };
}) {
  const customerTypeLabels: Record<CustomerType, string> = {
    particulier: "Particulier",
    professionnel: "Professionnel",
    quantite: "Commande en quantité",
  };

  const totalPrice = card.basePriceCents * config.quantity;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
          Récapitulatif de votre commande
        </h2>
        <p className="text-muted-foreground">
          Vérifiez votre commande avant de passer au paiement
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Product Preview */}
            <div className="flex gap-4">
              <div
                className="w-24 h-16 rounded-xl flex-shrink-0 flex items-center justify-center"
                style={{ backgroundColor: config.color }}
              >
                {config.logoUrl ? (
                  <img
                    src={config.logoUrl}
                    alt="Logo"
                    className="max-w-[70%] max-h-[70%] object-contain"
                  />
                ) : (
                  <CreditCard
                    className={
                      config.color === "#FFFFFF" || config.color === "#D4AF37"
                        ? "text-gray-400"
                        : "text-white/60"
                    }
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{card.name}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type de client</span>
                <span className="font-medium">{customerTypeLabels[customerType]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Couleur</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full border border-border"
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="font-medium">
                    {config.color === "#FFFFFF"
                      ? "Blanc"
                      : config.color === "#1A1A1A"
                      ? "Noir"
                      : config.color === "#0F172A"
                      ? "Bleu nuit"
                      : config.color === "#D4AF37"
                      ? "Or"
                      : config.color}
                  </span>
                </div>
              </div>
              {config.logoUrl && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Logo personnalisé</span>
                  <span className="font-medium text-primary flex items-center gap-1">
                    <Check size={14} />
                    Inclus
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Quantité</span>
                <span className="font-medium">{config.quantity} carte{config.quantity > 1 ? "s" : ""}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prix unitaire</span>
                <span className="font-medium">{formatPrice(card.basePriceCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span className="font-medium text-green-600">Gratuite</span>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total TTC</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* What's included */}
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-sm font-medium mb-2">Ce qui est inclus :</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {card.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    {feature}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <Check size={14} className="text-primary" />
                  Livraison gratuite au Maroc
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main OrderFunnel Component
export default function OrderFunnel() {
  const navigate = useNavigate();
  const { addItem, clearCart } = useCart();

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [config, setConfig] = useState({
    color: "#1A1A1A",
    logoUrl: null as string | null,
    quantity: 1,
  });

  const selectedCard = CARD_PRODUCTS.find((c) => c.id === selectedCardId);

  // Reset card selection when customer type changes
  useEffect(() => {
    setSelectedCardId(null);
  }, [customerType]);

  // Set default color when card changes
  useEffect(() => {
    if (selectedCard) {
      setConfig((prev) => ({
        ...prev,
        color: selectedCard.colors[0],
      }));
    }
  }, [selectedCard]);

  // Navigation
  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return customerType !== null;
      case 2:
        return selectedCardId !== null;
      case 3:
        return true; // Always can proceed from customization
      case 4:
        return true; // Proceed to checkout
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canGoNext()) return;

    if (currentStep === 4) {
      // Add to cart and go to checkout
      if (selectedCard) {
        clearCart(); // Clear existing cart
        addItem({
          templateId: selectedCard.id,
          templateName: selectedCard.name,
          cardName: config.logoUrl ? "Carte personnalisée" : selectedCard.name,
          quantity: config.quantity,
          unitPriceCents: selectedCard.basePriceCents,
          logoUrl: config.logoUrl,
        });
        toast.success("Carte ajoutée au panier !");
        navigate("/checkout");
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-32">
        <div className="container mx-auto px-4 md:px-6">
          {/* Step Indicator */}
          <StepIndicator currentStep={currentStep} totalSteps={4} />

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[500px]"
            >
              {currentStep === 1 && (
                <Step1CustomerType
                  selected={customerType}
                  onSelect={setCustomerType}
                />
              )}

              {currentStep === 2 && customerType && (
                <Step2CardType
                  customerType={customerType}
                  selected={selectedCardId}
                  onSelect={setSelectedCardId}
                />
              )}

              {currentStep === 3 && selectedCard && (
                <Step3Customization
                  card={selectedCard}
                  config={config}
                  onConfigChange={setConfig}
                />
              )}

              {currentStep === 4 && selectedCard && customerType && (
                <Step4Summary
                  customerType={customerType}
                  card={selectedCard}
                  config={config}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 z-50">
            <div className="container mx-auto flex justify-between items-center gap-4 max-w-4xl">
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2"
              >
                <ArrowLeft size={16} />
                {currentStep === 1 ? "Accueil" : "Retour"}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-background"
              >
                {currentStep === 4 ? (
                  <>
                    <ShoppingBag size={16} />
                    Passer au paiement
                  </>
                ) : (
                  <>
                    Continuer
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
