import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Check, CreditCard, Smartphone, Truck, Users, ChevronRight, 
  Upload, X, Palette, User, Building2, Briefcase, Crown, Star,
  Headphones, Code, Award, MessageCircle
} from "lucide-react";
import { toast } from "sonner";

type CardType = "standard" | "personalized";
type CardColor = "black" | "white" | "gold" | "silver" | "navy" | "burgundy";

interface OrderConfig {
  quantity: number;
  cardType: CardType;
  color: CardColor;
  logoFile: File | null;
  logoPreview: string | null;
  printedName: string;
  printedTitle: string;
  printedCompany: string;
  b2bPersonalization: boolean;
}

const STANDARD_PRICE = 29;
const PERSONALIZED_PRICE = 49;
const B2B_EXTRA_PRICE = 10;

const colorOptions: { value: CardColor; label: string; hex: string; textColor: string }[] = [
  { value: "black", label: "Noir", hex: "#0a0a0a", textColor: "white" },
  { value: "white", label: "Blanc", hex: "#fafafa", textColor: "black" },
  { value: "gold", label: "Or", hex: "#d4af37", textColor: "black" },
  { value: "silver", label: "Argent", hex: "#c0c0c0", textColor: "black" },
  { value: "navy", label: "Bleu Navy", hex: "#1e3a5f", textColor: "white" },
  { value: "burgundy", label: "Bordeaux", hex: "#722f37", textColor: "white" },
];

const quantityOptions = [1, 2, 5, 10, 25, 50];

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
  const [config, setConfig] = useState<OrderConfig>({
    quantity: 1,
    cardType: "standard",
    color: "black",
    logoFile: null,
    logoPreview: null,
    printedName: "",
    printedTitle: "",
    printedCompany: "",
    b2bPersonalization: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isB2B = config.quantity >= 10;
  const isCustomQuote = config.quantity >= 50;

  // Price calculation
  const calculatePrice = () => {
    if (isCustomQuote) return { unit: 0, customization: 0, total: 0, isCustom: true };

    let unitPrice = config.cardType === "standard" ? STANDARD_PRICE : PERSONALIZED_PRICE;
    let customizationCost = 0;

    // B2B personalization extra
    if (isB2B && config.b2bPersonalization) {
      customizationCost = B2B_EXTRA_PRICE * config.quantity;
    }

    // Bulk discounts
    let discount = 0;
    if (config.quantity >= 25) discount = 0.20;
    else if (config.quantity >= 10) discount = 0.15;
    else if (config.quantity >= 5) discount = 0.10;
    else if (config.quantity >= 2) discount = 0.05;

    const discountedUnitPrice = unitPrice * (1 - discount);
    const baseTotal = discountedUnitPrice * config.quantity;
    const total = baseTotal + customizationCost;

    return {
      unit: discountedUnitPrice,
      customization: customizationCost,
      total,
      discount: discount * 100,
      isCustom: false,
    };
  };

  const pricing = calculatePrice();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Le fichier est trop volumineux (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setConfig({
        ...config,
        logoFile: file,
        logoPreview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setConfig({ ...config, logoFile: null, logoPreview: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCheckout = () => {
    if (isCustomQuote) {
      window.location.href = "mailto:contact@iwasp.com?subject=Demande de devis IWASP - 50+ cartes personnalisées";
      return;
    }

    // Validate personalized card fields
    if (config.cardType === "personalized") {
      if (!config.printedName.trim()) {
        toast.error("Veuillez entrer le nom à imprimer");
        return;
      }
    }

    // In production, this would open Stripe checkout
    console.log("Order config:", config);
    console.log("Pricing:", pricing);
    toast.success("Redirection vers le paiement...");
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

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Step 1: Quantity */}
          <Card variant="glass" className="p-6 animate-fade-up">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm text-primary">1</span>
              Quantité
            </h3>
            <div className="flex flex-wrap gap-3">
              {quantityOptions.map((qty) => (
                <button
                  key={qty}
                  onClick={() => setConfig({ ...config, quantity: qty })}
                  className={`px-5 py-3 rounded-xl font-medium transition-all ${
                    config.quantity === qty
                      ? "bg-foreground text-background shadow-lg"
                      : "bg-surface-2 text-foreground hover:bg-surface-3 border border-border/50"
                  }`}
                >
                  {qty === 50 ? "50+" : qty} {qty === 1 ? "carte" : "cartes"}
                </button>
              ))}
            </div>
            {isB2B && !isCustomQuote && (
              <p className="text-sm text-primary mt-3">
                Commande entreprise — Paiement à la livraison disponible
              </p>
            )}
          </Card>

          {/* Step 2: Card Type */}
          <Card variant="glass" className="p-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm text-primary">2</span>
              Type de carte
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Standard Card */}
              <div
                onClick={() => setConfig({ ...config, cardType: "standard" })}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  config.cardType === "standard"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">Carte Standard</h4>
                    <p className="text-sm text-muted-foreground">Noir ou blanc, design épuré</p>
                  </div>
                  <span className="text-xl font-bold text-foreground">{STANDARD_PRICE}€</span>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    Couleurs fixes (noir / blanc)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    Design minimaliste
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    NFC haute qualité
                  </li>
                </ul>
              </div>

              {/* Personalized Card */}
              <div
                onClick={() => setConfig({ ...config, cardType: "personalized" })}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                  config.cardType === "personalized"
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-primary/30"
                }`}
              >
                <div className="absolute -top-2.5 right-4 px-2 py-0.5 bg-gradient-gold text-primary-foreground text-xs font-medium rounded-full">
                  Populaire
                </div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">Carte Personnalisée</h4>
                    <p className="text-sm text-muted-foreground">Votre identité imprimée</p>
                  </div>
                  <span className="text-xl font-bold text-foreground">{PERSONALIZED_PRICE}€</span>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    Couleur au choix
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    Logo imprimé
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-primary" />
                    Nom, titre & entreprise
                  </li>
                </ul>
              </div>
            </div>

            {/* B2B Personalization option */}
            {isB2B && !isCustomQuote && (
              <div className="mt-4 p-4 rounded-xl bg-surface-2 border border-border/50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.b2bPersonalization}
                    onChange={(e) => setConfig({ ...config, b2bPersonalization: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-border accent-primary"
                  />
                  <div>
                    <span className="font-medium text-foreground">Personnalisation entreprise</span>
                    <span className="ml-2 text-sm text-primary">+{B2B_EXTRA_PRICE}€ / carte</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Logo corporate, couleurs de marque, design unifié pour toute l'équipe
                    </p>
                  </div>
                </label>
              </div>
            )}
          </Card>

          {/* Step 3: Customization (only for personalized) */}
          {config.cardType === "personalized" && !isCustomQuote && (
            <Card variant="glass" className="p-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-sm text-primary">3</span>
                Personnalisation
              </h3>

              <div className="space-y-6">
                {/* Color picker */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Palette size={16} className="text-muted-foreground" />
                    Couleur de la carte
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setConfig({ ...config, color: color.value })}
                        className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center ${
                          config.color === color.value
                            ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.label}
                      >
                        {config.color === color.value && (
                          <Check size={18} style={{ color: color.textColor }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logo upload */}
                <div>
                  <Label className="flex items-center gap-2 mb-3">
                    <Upload size={16} className="text-muted-foreground" />
                    Logo (optionnel)
                  </Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  {config.logoPreview ? (
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl bg-surface-2 border border-border/50 overflow-hidden">
                        <img
                          src={config.logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={removeLogo}>
                        <X size={14} className="mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-8 border-2 border-dashed border-border/50 rounded-xl hover:border-primary/50 transition-colors flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Upload size={24} />
                      <span className="text-sm">Cliquez pour télécharger votre logo</span>
                      <span className="text-xs text-muted-foreground">PNG, JPG (max 5MB)</span>
                    </button>
                  )}
                </div>

                {/* Printed info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="printed-name" className="flex items-center gap-2 mb-2">
                      <User size={14} className="text-muted-foreground" />
                      Nom à imprimer *
                    </Label>
                    <Input
                      id="printed-name"
                      value={config.printedName}
                      onChange={(e) => setConfig({ ...config, printedName: e.target.value })}
                      placeholder="Jean Dupont"
                      className="bg-surface-2 border-border/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="printed-title" className="flex items-center gap-2 mb-2">
                      <Briefcase size={14} className="text-muted-foreground" />
                      Titre / Poste
                    </Label>
                    <Input
                      id="printed-title"
                      value={config.printedTitle}
                      onChange={(e) => setConfig({ ...config, printedTitle: e.target.value })}
                      placeholder="Directeur Commercial"
                      className="bg-surface-2 border-border/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="printed-company" className="flex items-center gap-2 mb-2">
                    <Building2 size={14} className="text-muted-foreground" />
                    Entreprise
                  </Label>
                  <Input
                    id="printed-company"
                    value={config.printedCompany}
                    onChange={(e) => setConfig({ ...config, printedCompany: e.target.value })}
                    placeholder="Ma Société"
                    className="bg-surface-2 border-border/50"
                  />
                </div>

                {/* Card Preview */}
                <div>
                  <Label className="mb-3 block">Aperçu</Label>
                  <div
                    className="w-full max-w-xs mx-auto aspect-[1.6/1] rounded-2xl p-4 flex flex-col justify-between shadow-2xl"
                    style={{
                      backgroundColor: colorOptions.find((c) => c.value === config.color)?.hex,
                      color: colorOptions.find((c) => c.value === config.color)?.textColor,
                    }}
                  >
                    <div className="flex justify-between items-start">
                      {config.logoPreview ? (
                        <img src={config.logoPreview} alt="Logo" className="h-8 w-auto object-contain" />
                      ) : (
                        <div className="h-8 w-16 rounded bg-white/20" />
                      )}
                      <div className="text-xs opacity-60">NFC</div>
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {config.printedName || "Votre Nom"}
                      </div>
                      <div className="text-sm opacity-80">
                        {config.printedTitle || "Votre Titre"}
                      </div>
                      <div className="text-xs opacity-60 mt-1">
                        {config.printedCompany || "Votre Entreprise"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* What's included */}
          <Card variant="glass" className="p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center">
              Inclus avec chaque carte
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {includedFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-sm text-secondary-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Checkout Summary */}
          <Card variant="premium" className="p-6 animate-fade-up">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Price breakdown */}
              <div className="flex-1">
                <p className="text-muted-foreground text-sm mb-2">Récapitulatif</p>
                {pricing.isCustom ? (
                  <div>
                    <span className="text-2xl font-display font-bold text-foreground">
                      Devis personnalisé
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pour les commandes de 50+ cartes, contactez-nous
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-display font-bold text-foreground">
                        {pricing.total.toFixed(0)}€
                      </span>
                      {pricing.discount > 0 && (
                        <span className="text-sm text-primary font-medium">
                          -{pricing.discount}%
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p>
                        {config.quantity} × {config.cardType === "standard" ? "Standard" : "Personnalisée"} à{" "}
                        {pricing.unit.toFixed(2)}€
                      </p>
                      {pricing.customization > 0 && (
                        <p>Personnalisation entreprise: +{pricing.customization}€</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="flex flex-col items-stretch lg:items-end gap-3 w-full lg:w-auto">
                <Button
                  variant="chrome"
                  size="lg"
                  className="min-w-[200px]"
                  onClick={handleCheckout}
                >
                  {pricing.isCustom ? "Demander un devis" : "Commander maintenant"}
                  <ChevronRight size={18} className="ml-1" />
                </Button>

                {/* Payment methods */}
                <div className="flex items-center justify-center lg:justify-end gap-4 text-muted-foreground">
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
                  {isB2B && (
                    <div className="flex items-center gap-1.5 text-xs">
                      <Truck size={14} />
                      <span>À la livraison</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 text-muted-foreground text-sm">
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

      {/* Business Offers Section */}
      <div className="py-24 bg-gradient-to-b from-background to-surface-2">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Building2 size={16} />
              Offres Business
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Solutions <span className="text-gradient-gold">Entreprises</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Équipez toute votre équipe avec des cartes NFC premium. 
              Prix dégressifs et gestion centralisée.
            </p>
          </div>

          {/* Offers Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Team Pack */}
            <Card 
              variant="premium" 
              className="relative overflow-hidden animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Popular Badge */}
              <div className="absolute -top-1 -right-1">
                <div className="bg-gradient-gold text-primary-foreground px-4 py-1.5 text-sm font-semibold rounded-bl-xl rounded-tr-xl flex items-center gap-1.5">
                  <Star size={14} className="fill-current" />
                  Plus Populaire
                </div>
              </div>

              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      Pack Team
                    </h3>
                    <p className="text-sm text-muted-foreground">10 cartes personnalisées</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-bold text-foreground">
                      417€
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      490€
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-sm font-medium rounded-full">
                      -15% de réduction
                    </span>
                    <span className="text-sm text-muted-foreground">
                      soit 42€/carte
                    </span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-secondary-foreground">
                      Gravure personnalisée pour chaque collaborateur
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-secondary-foreground">
                      Dashboard de gestion centralisé
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-secondary-foreground">
                      Une seule facture, gestion simplifiée
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-secondary-foreground">
                      Paiement à la livraison accepté
                    </span>
                  </li>
                </ul>

                {/* CTA */}
                <Button 
                  variant="chrome" 
                  size="lg" 
                  className="w-full"
                  onClick={() => setConfig({ ...config, quantity: 10 })}
                >
                  Commander le Pack Team
                </Button>
              </div>
            </Card>

            {/* Enterprise Pack */}
            <Card 
              variant="glass" 
              className="relative overflow-hidden animate-fade-up border-2 border-border/50"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
                    <Crown size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      Pack Enterprise
                    </h3>
                    <p className="text-sm text-muted-foreground">50+ cartes sur mesure</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-display font-bold text-gradient-gold">
                      Sur Devis
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Prix dégressif selon volume commandé
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Code size={12} className="text-primary" />
                    </div>
                    <span className="text-secondary-foreground">
                      Intégration API personnalisée
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Headphones size={12} className="text-primary" />
                    </div>
                    <span className="text-secondary-foreground">
                      Support dédié 24/7
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award size={12} className="text-primary" />
                    </div>
                    <span className="text-secondary-foreground">
                      Badge de vérification GOLD offert pour tous les profils
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Building2 size={12} className="text-primary" />
                    </div>
                    <span className="text-secondary-foreground">
                      Image de marque unifiée (hôtel, agence, banque)
                    </span>
                  </li>
                </ul>

                {/* CTA */}
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full border-primary/50 hover:bg-primary/10 group"
                  onClick={() => {
                    const message = encodeURIComponent(
                      "Bonjour i-wasp, je souhaite obtenir un devis pour un pack Enterprise de [X] cartes pour mon entreprise."
                    );
                    window.open(`https://wa.me/212600000000?text=${message}`, "_blank");
                  }}
                >
                  <MessageCircle size={18} className="mr-2 group-hover:text-primary transition-colors" />
                  Demander un Devis
                </Button>
              </div>
            </Card>
          </div>

          {/* Trust Section */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">Ils nous font confiance</p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              <div className="text-xl font-display font-bold text-foreground">Hôtels 5★</div>
              <div className="text-xl font-display font-bold text-foreground">Agences Immobilières</div>
              <div className="text-xl font-display font-bold text-foreground">Banques</div>
              <div className="text-xl font-display font-bold text-foreground">Startups</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
