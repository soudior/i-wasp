import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "0",
    description: "Pour découvrir IWASP",
    features: ["1 carte digitale", "Templates basiques", "Lien de partage", "QR Code", "Support email"],
    cta: "Commencer gratuitement",
    popular: false,
  },
  {
    name: "Professional",
    price: "9",
    description: "Pour les professionnels",
    features: [
      "5 cartes digitales",
      "Tous les templates premium",
      "Apple & Google Wallet",
      "Capture de leads",
      "Analyses détaillées",
      "vCard automatique",
      "Support prioritaire",
    ],
    cta: "Essai gratuit 14 jours",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "29",
    description: "Pour les équipes",
    features: [
      "Cartes illimitées",
      "Templates personnalisés",
      "API complète",
      "Gestion d'équipe",
      "Intégration CRM",
      "Analytics avancées",
      "Support dédié 24/7",
      "Formation incluse",
    ],
    cta: "Contacter les ventes",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Tarifs <span className="text-gradient-gold">transparents</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Annulez à tout moment.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={plan.name} className="relative animate-fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-gold text-primary-foreground text-sm font-medium rounded-full">
                  Populaire
                </div>
              )}

              <Card
                variant={plan.popular ? "premium" : "default"}
                className={`h-full p-8 ${plan.popular ? "ring-2 ring-primary/50" : ""}`}
              >
                <div className="text-center mb-8">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold text-foreground">{plan.price}€</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-sm text-secondary-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/signup" className="block">
                  <Button variant={plan.popular ? "chrome" : "outline"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
