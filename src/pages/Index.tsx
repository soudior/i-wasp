import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowRight, Wifi, CreditCard, Building2, Hotel, Store, CalendarDays, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFCPhysicalCardSection } from "@/components/print/NFCPhysicalCardSection";
import { useAuth } from "@/contexts/AuthContext";
import { useCards } from "@/hooks/useCards";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import iwaspLogo from "@/assets/iwasp-logo-white.png";

/**
 * Index - Page institutionnelle i-wasp
 * 
 * Interface minimaliste orientée système.
 * Contenu prioritaire : produit, prix, achat.
 * Boutons pricing reliés au checkout via CartContext.
 */

const sectors = [
  { icon: Hotel, label: "Hôtellerie" },
  { icon: Store, label: "Commerce" },
  { icon: Building2, label: "Immobilier" },
  { icon: CalendarDays, label: "Événementiel" },
];

// Grille tarifaire avec paramètres de commande
const pricingPlans = [
  {
    id: "particulier",
    name: "Particulier",
    price: "29",
    priceCents: 2900,
    description: "Carte NFC personnelle",
    features: [
      "1 carte NFC premium",
      "Profil digital illimité",
      "Apple & Google Wallet",
      "QR Code de secours",
    ],
    cta: "Commander",
    popular: false,
    templateId: "signature",
    templateName: "Carte Standard",
    quantity: 1,
  },
  {
    id: "professionnel",
    name: "Professionnel",
    price: "49",
    priceCents: 4900,
    description: "Carte personnalisée entreprise",
    features: [
      "Carte couleur au choix",
      "Logo imprimé",
      "Nom, titre & entreprise",
      "Analytics détaillées",
      "Capture de leads",
    ],
    cta: "Commander",
    popular: true,
    templateId: "signature",
    templateName: "Carte Personnalisée",
    quantity: 1,
  },
  {
    id: "equipe",
    name: "Équipe",
    price: "39",
    priceCents: 3900,
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
    cta: "Demander un devis",
    popular: false,
    templateId: "signature",
    templateName: "Carte Équipe",
    quantity: 10,
    isQuote: true,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cards = [] } = useCards();
  const { addItem, clearCart } = useCart();

  /**
   * Handles order flow:
   * - For quotes, redirect to email
   * - For non-authenticated users, go to /create
   * - For authenticated users without cards, go to /create
   * - For authenticated users with cards, proceed with cart
   */
  const handleOrder = (plan: typeof pricingPlans[0]) => {
    // Pour les demandes de devis, rediriger vers le formulaire de contact
    if (plan.isQuote) {
      window.location.href = `mailto:contact@iwasp.ma?subject=Demande de devis - ${plan.quantity}+ cartes NFC&body=Bonjour,%0A%0AJe souhaite commander ${plan.quantity} cartes NFC ou plus.%0A%0AMerci de me contacter pour un devis personnalisé.`;
      return;
    }

    // Non-authenticated: go to card creation
    if (!user) {
      navigate("/create");
      return;
    }

    // Authenticated but no cards: go to card creation
    if (cards.length === 0) {
      navigate("/create");
      return;
    }

    // User has cards - proceed with cart
    clearCart();
    addItem({
      templateId: plan.templateId,
      templateName: plan.templateName,
      cardName: plan.name,
      quantity: plan.quantity,
      unitPriceCents: plan.priceCents,
    });

    toast.success(`${plan.name} ajouté au panier`);
    navigate("/cart");
  };

  /**
   * Main CTA handler - Try before signup
   * Always goes to /create for guest card creation
   */
  const handleMainCTA = () => {
    // If user has cards, scroll to pricing
    if (user && cards.length > 0) {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    // Otherwise, go to card creation
    navigate("/create");
  };

  return (
    <div className="min-h-[calc(100dvh-3.5rem)] flex flex-col">
      {/* Hero Section - Contenu prioritaire */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Titre principal */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-foreground">
              Cartes NFC professionnelles
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto">
              Partagez vos coordonnées d'un geste. Un achat unique, service digital inclus à vie.
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

          {/* Fonctionnalités clés */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4">
            <div className="p-4 rounded-lg border border-border/30 bg-card/50">
              <CreditCard className="w-5 h-5 text-foreground mb-2" />
              <p className="text-sm font-medium">Carte NFC</p>
              <p className="text-xs text-muted-foreground">Physique + digitale</p>
            </div>
            <div className="p-4 rounded-lg border border-border/30 bg-card/50">
              <Wifi className="w-5 h-5 text-foreground mb-2" />
              <p className="text-sm font-medium">Wi-Fi intégré</p>
              <p className="text-xs text-muted-foreground">QR automatique</p>
            </div>
            <div className="p-4 rounded-lg border border-border/30 bg-card/50">
              <Building2 className="w-5 h-5 text-foreground mb-2" />
              <p className="text-sm font-medium">White-label</p>
              <p className="text-xs text-muted-foreground">Marque client</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button 
              size="lg" 
              className="bg-foreground text-background hover:bg-foreground/90 gap-2"
              onClick={handleMainCTA}
            >
              Commander maintenant
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Link to="/demo">
              <Button variant="outline" size="lg">
                Voir une démonstration
              </Button>
            </Link>
          </div>
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
                  onClick={() => handleOrder(plan)}
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
