import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Zap, Shield, Star, ArrowRight } from "lucide-react";
import { SUBSCRIPTION_PLANS, FEATURE_COMPARISON } from "@/lib/subscriptionPlans";

const faqs = [
  {
    question: "Quelle est la différence entre FREE et GOLD ?",
    answer: "FREE vous permet de découvrir iWasp avec les fonctionnalités de base. GOLD débloque tout : analytics avancées, stories 24h, capture de leads, notifications push, et bien plus.",
  },
  {
    question: "Puis-je passer de FREE à GOLD à tout moment ?",
    answer: "Oui ! Vous pouvez upgrader vers GOLD à tout moment depuis votre dashboard. L'activation est instantanée.",
  },
  {
    question: "La carte NFC est-elle incluse ?",
    answer: "La carte NFC physique est vendue séparément. L'abonnement GOLD concerne les fonctionnalités digitales premium de votre profil.",
  },
  {
    question: "Puis-je annuler mon abonnement GOLD ?",
    answer: "Oui, vous pouvez annuler à tout moment. Votre accès GOLD reste actif jusqu'à la fin de la période payée.",
  },
];

export default function Pricing() {
  const renderValue = (value: boolean | string) => {
    if (typeof value === "string") {
      return <span className="text-sm text-foreground">{value}</span>;
    }
    return value ? (
      <Check className="w-5 h-5 text-primary" />
    ) : (
      <X className="w-5 h-5 text-muted-foreground/30" />
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground tracking-widest uppercase mb-6">
            Conciergerie digitale
          </p>
          
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6 text-foreground">
            Choisissez le niveau de service
            <span className="block">qui correspond à votre image.</span>
          </h1>
          
          <div className="max-w-xl mx-auto space-y-2 mt-8">
            <p className="text-lg text-foreground font-medium">
              La carte physique est incluse.
            </p>
            <p className="text-muted-foreground">
              Le service est ce qui fait la différence.
            </p>
          </div>
        </div>
      </section>

      {/* Plans Comparison */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* FREE Plan */}
            <div className="p-6 lg:p-8 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-5">
                <Zap className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-1">{SUBSCRIPTION_PLANS.FREE.name}</h3>
              <p className="text-muted-foreground text-sm mb-5">{SUBSCRIPTION_PLANS.FREE.tagline}</p>
              
              <div className="mb-5">
                <span className="text-4xl font-semibold text-foreground">Gratuit</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Commence gratuitement avec une carte NFC simple.
              </p>
              
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20commencer%20gratuitement%20avec%20une%20carte%20NFC%20i-wasp."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  className="w-full py-5 font-medium border-border text-foreground hover:bg-muted"
                >
                  Commencer gratuitement
                </Button>
              </a>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Inclus</p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.FREE.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Check className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* GOLD Plan */}
            <div className="relative p-6 lg:p-8 rounded-2xl bg-card border-2 border-primary">
              {/* Recommended Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  RECOMMANDÉ
                </span>
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 mt-2">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-3xl font-semibold text-foreground mb-1 flex items-center gap-3">
                {SUBSCRIPTION_PLANS.GOLD.name}
                <Star className="w-5 h-5 text-primary fill-primary" />
              </h3>
              <p className="text-primary font-medium mb-5">{SUBSCRIPTION_PLANS.GOLD.tagline}</p>
              
              {/* Pricing Options */}
              <div className="mb-6 space-y-3">
                {/* Annual */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 relative">
                  <div className="absolute -top-2 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      2 MOIS OFFERTS
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold text-foreground">{SUBSCRIPTION_PLANS.GOLD.priceAnnual}</span>
                    <span className="text-muted-foreground">{SUBSCRIPTION_PLANS.GOLD.currency}{SUBSCRIPTION_PLANS.GOLD.periodAnnual}</span>
                  </div>
                  <p className="text-primary text-sm mt-1">≈ 41 MAD/mois</p>
                </div>
                
                {/* Monthly */}
                <div className="p-3 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold text-muted-foreground">{SUBSCRIPTION_PLANS.GOLD.priceMonthly}</span>
                    <span className="text-muted-foreground/60">{SUBSCRIPTION_PLANS.GOLD.currency}{SUBSCRIPTION_PLANS.GOLD.periodMonthly}</span>
                  </div>
                  <p className="text-muted-foreground/60 text-xs mt-1">Facturation mensuelle</p>
                </div>
              </div>
              
              <p className="text-sm text-primary/80 mb-6">
                Transforme ta carte NFC en véritable outil business.
              </p>
              
              <Link to="/order/type">
                <Button className="w-full py-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Crown className="w-5 h-5 mr-2" />
                  Passer GOLD
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-primary/20">
                <p className="text-xs font-medium text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Star className="w-3 h-3 fill-primary" />
                  Solution Business Complète
                </p>
                <ul className="space-y-2.5">
                  {SUBSCRIPTION_PLANS.GOLD.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-foreground text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Business Features */}
                <div className="mt-5 p-4 rounded-xl bg-muted/50 border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    + Avantages Business
                  </p>
                  <ul className="space-y-2">
                    {SUBSCRIPTION_PLANS.GOLD.businessFeatures.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Shield className="w-3 h-3 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            Comparaison détaillée
          </h2>
          
          <div className="rounded-xl overflow-hidden border border-border">
            {/* Header */}
            <div className="grid grid-cols-3 bg-card">
              <div className="p-4 font-medium text-muted-foreground">Fonctionnalité</div>
              <div className="p-4 text-center font-medium text-foreground border-x border-border">FREE</div>
              <div className="p-4 text-center font-medium text-primary bg-primary/5">GOLD</div>
            </div>
            
            {/* Rows */}
            {FEATURE_COMPARISON.map((feature, index) => (
              <div 
                key={index}
                className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}
              >
                <div className="p-4 text-foreground text-sm">{feature.name}</div>
                <div className="p-4 flex justify-center items-center border-x border-border">
                  {renderValue(feature.free)}
                </div>
                <div className="p-4 flex justify-center items-center bg-primary/5">
                  {renderValue(feature.gold)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="p-6 rounded-xl bg-card border border-border"
              >
                <h3 className="text-lg font-medium text-foreground mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-2xl bg-card border border-border">
            <Crown className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-semibold text-foreground mb-4">
              Prêt à passer au niveau supérieur ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Rejoignez les professionnels qui ont choisi iWasp GOLD.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="outline" size="lg" className="border-border text-foreground hover:bg-muted">
                  Commencer FREE
                </Button>
              </Link>
              <Link to="/order/type">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  <Crown className="w-5 h-5 mr-2" />
                  Passer GOLD
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
