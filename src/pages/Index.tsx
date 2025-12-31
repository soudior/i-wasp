import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Hotel, Store, CalendarDays, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFCPhysicalCardSection } from "@/components/print/NFCPhysicalCardSection";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

/**
 * Index - Page institutionnelle i-wasp
 * 
 * Interface minimaliste orientée système.
 * PARCOURS OBLIGATOIRE : Toujours /order, jamais d'achat direct.
 */

const sectors = [
  { icon: Hotel, label: "Hôtellerie" },
  { icon: Store, label: "Commerce" },
  { icon: Building2, label: "Immobilier" },
  { icon: CalendarDays, label: "Événementiel" },
];

// Grille tarifaire - CONFIGURATION OBLIGATOIRE (pas d'achat direct)
const pricingPlans = [
  {
    id: "particulier",
    name: "Particulier",
    price: "29",
    description: "Carte NFC personnelle",
    features: [
      "1 carte NFC premium",
      "Profil digital illimité",
      "Apple & Google Wallet",
      "QR Code de secours",
    ],
    cta: "Configurer ma carte",
    popular: false,
  },
  {
    id: "professionnel",
    name: "Professionnel",
    price: "49",
    description: "Carte personnalisée entreprise",
    features: [
      "Carte couleur au choix",
      "Logo imprimé",
      "Nom, titre & entreprise",
      "Analytics détaillées",
      "Capture de leads",
    ],
    cta: "Configurer ma carte",
    popular: true,
  },
  {
    id: "equipe",
    name: "Équipe",
    price: "39",
    priceNote: "/ carte dès 10",
    description: "Tarif dégressif entreprise",
    features: [
      "Design unifié équipe",
      "Personnalisation corporate",
      "Paiement à la livraison",
      "Support prioritaire",
      "-15% dès 10 cartes",
      "-20% dès 25 cartes",
    ],
    cta: "Configurer ma carte",
    popular: false,
  },
];

const Index = () => {
  const navigate = useNavigate();

  /**
   * PARCOURS OBLIGATOIRE : Toujours rediriger vers /order
   * JAMAIS d'achat direct, configuration obligatoire
   */
  const handleConfigureCard = () => {
    navigate("/order/type");
  };

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex flex-col">
      {/* Hero Section - Value proposition claire */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Titre principal */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              Partagez vos contacts en un geste
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
              Une carte NFC premium. Un achat unique.
              <span className="block">Votre profil digital inclus à vie.</span>
            </p>
          </div>

          {/* Secteurs supportés */}
          <div className="flex flex-wrap justify-center gap-3 py-4">
            {sectors.map(({ icon: Icon, label }) => (
              <div 
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-muted/30"
              >
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Actions - CTA principal vers configuration */}
          <div className="flex flex-col items-center gap-2 pt-4">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 gap-2 px-8 py-6 text-base"
              onClick={handleConfigureCard}
            >
              Configurer ma carte
              <ArrowRight className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Configuration guidée en 5 étapes</span>
          </div>
        </div>
      </section>

      {/* Demo Section - Étapes du parcours */}
      <section className="py-12 px-4 bg-muted/30 border-y border-border/20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground">
              Créez votre carte en 5 étapes
            </h2>
            <p className="text-muted-foreground">
              Parcours guidé, simple et sécurisé.
            </p>
          </div>

          {/* Étapes du parcours */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 py-4">
            {[
              { step: 1, title: "Type de client", desc: "Particulier, Pro, Équipe" },
              { step: 2, title: "Vos infos", desc: "Nom, email, téléphone" },
              { step: 3, title: "Design carte", desc: "Logo & couleur" },
              { step: 4, title: "Quantité", desc: "Prix dégressifs" },
              { step: 5, title: "Récapitulatif", desc: "Validation finale" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="p-4 rounded-xl border border-border/30 bg-card/50">
                <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-semibold text-foreground">{step}</span>
                </div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{desc}</p>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="lg"
            className="gap-2"
            onClick={handleConfigureCard}
          >
            Commencer la configuration
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Section Pricing - OBLIGATOIRE ET VISIBLE */}
      <section id="pricing" className="py-16 px-4 bg-muted/20 border-t border-border/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-2">
              Tarifs clairs et transparents
            </h2>
            <p className="text-muted-foreground">
              Un achat unique. Pas d'abonnement. Service digital inclus à vie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative p-6 rounded-2xl border transition-all ${
                  plan.popular 
                    ? "border-foreground bg-foreground/5 shadow-lg" 
                    : "border-border/50 bg-card/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                    Populaire
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}€</span>
                    {plan.priceNote && (
                      <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  onClick={handleConfigureCard}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* Promotion */}
          <div className="mt-8 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <p className="text-sm font-medium text-foreground">
              🎁 Offre de lancement : -10% avec le code <span className="font-mono bg-foreground/10 px-2 py-0.5 rounded">IWASP10</span>
            </p>
          </div>
        </div>
      </section>

      {/* Section Template carte physique NFC */}
      <NFCPhysicalCardSection logoUrl={iwaspLogo} />

      {/* Footer minimal */}
      <footer className="py-6 px-4 border-t border-border/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} i-wasp</span>
          <span>Infrastructure NFC métier</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;