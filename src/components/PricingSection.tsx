import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard, Smartphone, Truck, Users, Minus, Plus, ChevronRight } from "lucide-react";

interface PricingOption {
  quantity: number;
  price: number;
  unitPrice: number;
  popular?: boolean;
  badge?: string;
}

const b2cOptions: PricingOption[] = [
  { quantity: 1, price: 29, unitPrice: 29 },
  { quantity: 2, price: 49, unitPrice: 24.5, popular: true, badge: "Économisez 15%" },
  { quantity: 5, price: 99, unitPrice: 19.8, badge: "Économisez 32%" },
];

const b2bOptions: PricingOption[] = [
  { quantity: 10, price: 179, unitPrice: 17.9, badge: "Équipes" },
  { quantity: 25, price: 399, unitPrice: 15.96, popular: true, badge: "Best value" },
  { quantity: 50, price: 0, unitPrice: 0, badge: "Devis personnalisé" },
];

const includedFeatures = [
  "Carte NFC premium gravée",
  "Profil digital personnalisé",
  "Apple & Google Wallet",
  "QR Code de secours",
  "Capture de leads illimitée",
  "Analytics détaillées",
  "Templates premium",
  "Support prioritaire",
];

export function PricingSection() {
  const [selectedB2C, setSelectedB2C] = useState<number>(1);
  const [selectedB2B, setSelectedB2B] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"b2c" | "b2b">("b2c");

  const getSelectedOption = () => {
    if (activeTab === "b2c") {
      return b2cOptions.find((o) => o.quantity === selectedB2C);
    }
    return b2bOptions.find((o) => o.quantity === selectedB2B);
  };

  const handleCheckout = () => {
    const option = getSelectedOption();
    if (!option) return;

    if (option.quantity >= 50) {
      // Contact sales for custom quote
      window.location.href = "mailto:contact@iwasp.com?subject=Demande de devis IWASP - 50+ cartes";
      return;
    }

    // In real implementation, this would open Stripe checkout
    console.log("Checkout:", option);
  };

  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Cartes NFC <span className="text-gradient-gold">Premium</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un achat unique. Pas d'abonnement. Service digital inclus à vie.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-surface-2 rounded-2xl border border-border/50">
            <button
              onClick={() => {
                setActiveTab("b2c");
                setSelectedB2B(null);
              }}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === "b2c"
                  ? "bg-foreground text-background shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Particuliers
            </button>
            <button
              onClick={() => {
                setActiveTab("b2b");
                setSelectedB2C(1);
              }}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === "b2b"
                  ? "bg-foreground text-background shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users size={16} />
              Entreprises
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Pricing options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {(activeTab === "b2c" ? b2cOptions : b2bOptions).map((option, index) => {
              const isSelected =
                activeTab === "b2c" ? selectedB2C === option.quantity : selectedB2B === option.quantity;
              const isCustom = option.quantity >= 50;

              return (
                <div
                  key={option.quantity}
                  className="relative animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {option.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium rounded-full z-10 ${
                        option.popular
                          ? "bg-gradient-gold text-primary-foreground"
                          : "bg-surface-3 text-foreground border border-border/50"
                      }`}
                    >
                      {option.badge}
                    </div>
                  )}

                  <Card
                    variant={isSelected ? "premium" : "default"}
                    className={`h-full p-6 cursor-pointer transition-all duration-300 ${
                      isSelected ? "ring-2 ring-primary/50 scale-[1.02]" : "hover:border-primary/30"
                    }`}
                    onClick={() => {
                      if (activeTab === "b2c") {
                        setSelectedB2C(option.quantity);
                      } else {
                        setSelectedB2B(option.quantity);
                      }
                    }}
                  >
                    <div className="text-center">
                      {/* Quantity */}
                      <div className="mb-4">
                        <span className="text-5xl font-display font-bold text-foreground">
                          {option.quantity}
                        </span>
                        <span className="text-lg text-muted-foreground ml-2">
                          {option.quantity === 1 ? "carte" : "cartes"}
                        </span>
                      </div>

                      {/* Price */}
                      {isCustom ? (
                        <div className="mb-4">
                          <span className="text-2xl font-display font-bold text-foreground">
                            Sur devis
                          </span>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <span className="text-3xl font-display font-bold text-foreground">
                            {option.price}€
                          </span>
                          <div className="text-sm text-muted-foreground mt-1">
                            {option.unitPrice.toFixed(2)}€ / carte
                          </div>
                        </div>
                      )}

                      {/* Selection indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 mx-auto transition-all ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <Check size={12} className="text-primary-foreground m-auto mt-0.5" />}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* What's included */}
          <Card variant="glass" className="p-8 mb-8">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
              Inclus avec chaque carte
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {includedFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm text-secondary-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Checkout section */}
          <Card variant="premium" className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Summary */}
              <div className="text-center md:text-left">
                <p className="text-muted-foreground text-sm mb-1">Votre commande</p>
                {getSelectedOption() ? (
                  getSelectedOption()!.quantity >= 50 ? (
                    <div>
                      <span className="text-2xl font-display font-bold text-foreground">
                        50+ cartes
                      </span>
                      <p className="text-sm text-muted-foreground mt-1">Contactez-nous pour un devis personnalisé</p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-display font-bold text-foreground">
                        {getSelectedOption()!.price}€
                      </span>
                      <span className="text-muted-foreground ml-2">
                        pour {getSelectedOption()!.quantity} {getSelectedOption()!.quantity === 1 ? "carte" : "cartes"}
                      </span>
                    </div>
                  )
                ) : (
                  <p className="text-muted-foreground">Sélectionnez une option</p>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col items-center md:items-end gap-3">
                <Button
                  variant="chrome"
                  size="lg"
                  className="min-w-[200px]"
                  onClick={handleCheckout}
                  disabled={!getSelectedOption()}
                >
                  {getSelectedOption()?.quantity && getSelectedOption()!.quantity >= 50
                    ? "Demander un devis"
                    : "Commander maintenant"}
                  <ChevronRight size={18} className="ml-1" />
                </Button>

                {/* Payment methods */}
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1.5 text-xs">
                    <CreditCard size={14} />
                    <span>Carte</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Smartphone size={14} />
                    <span>Apple Pay</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Smartphone size={14} />
                    <span>Google Pay</span>
                  </div>
                  {activeTab === "b2b" && selectedB2B && selectedB2B >= 10 && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Truck size={14} />
                      <span>Paiement à la livraison</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>Livraison gratuite en France</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>Garantie 2 ans</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>Paiement 100% sécurisé</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
