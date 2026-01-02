import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, Building2, Crown, Check, Star, 
  Headphones, Code, Award, MessageCircle 
} from "lucide-react";

const TEAM_QUANTITY = 10;
const TEAM_UNIT_PRICE = 49; // Base personalized price
const TEAM_DISCOUNT = 0.15; // 15% off

export function BusinessOffers() {
  const teamTotalPrice = Math.round(TEAM_QUANTITY * TEAM_UNIT_PRICE * (1 - TEAM_DISCOUNT));
  const teamUnitPrice = Math.round(TEAM_UNIT_PRICE * (1 - TEAM_DISCOUNT));

  const handleEnterpriseContact = () => {
    const message = encodeURIComponent(
      "Bonjour i-wasp, je souhaite obtenir un devis pour un pack Enterprise de [X] cartes pour mon entreprise."
    );
    window.open(`https://wa.me/212600000000?text=${message}`, "_blank");
  };

  const handleTeamOrder = () => {
    // Scroll to pricing or trigger order
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-surface-2">
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
                  <p className="text-sm text-muted-foreground">{TEAM_QUANTITY} cartes personnalisées</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold text-foreground">
                    {teamTotalPrice}€
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {TEAM_QUANTITY * TEAM_UNIT_PRICE}€
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-primary/20 text-primary text-sm font-medium rounded-full">
                    -{Math.round(TEAM_DISCOUNT * 100)}% de réduction
                  </span>
                  <span className="text-sm text-muted-foreground">
                    soit {teamUnitPrice}€/carte
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
                onClick={handleTeamOrder}
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
                onClick={handleEnterpriseContact}
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
    </section>
  );
}
