import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, X, Crown, Star, ArrowRight, Shield, Users } from "lucide-react";
import { SUBSCRIPTION_PLANS, FEATURE_COMPARISON } from "@/lib/subscriptionPlans";

const faqs = [
  {
    question: "La carte NFC est-elle incluse ?",
    answer: "Oui. La carte NFC premium est incluse dans chaque niveau de service. Aucun frais caché.",
  },
  {
    question: "Quelle est la différence entre Essentiel et Signature ?",
    answer: "Essentiel vous donne accès à la conciergerie avec un profil standard. Signature débloque toute l'expérience : mises à jour illimitées, statistiques, capture de contacts, et support prioritaire.",
  },
  {
    question: "Puis-je passer de Essentiel à Signature ?",
    answer: "Oui. Vous pouvez upgrader à tout moment depuis votre espace. L'activation est instantanée.",
  },
  {
    question: "Comment fonctionne le service Élite ?",
    answer: "Élite est conçu pour les équipes et entreprises. Contactez-nous pour une offre personnalisée adaptée à vos besoins.",
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

      {/* Plans - 3 niveaux de service */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            
            {/* ESSENTIEL */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-5">
                <Star className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-1">Essentiel</h3>
              <p className="text-muted-foreground text-sm mb-5">Votre entrée dans la conciergerie</p>
              
              <div className="mb-5">
                <span className="text-3xl font-semibold text-foreground">290 DH</span>
                <span className="text-muted-foreground text-sm ml-2">mise en service</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Carte NFC premium + profil digital.
              </p>
              
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20accéder%20au%20service%20Essentiel%20i-Wasp."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  className="w-full py-5 font-medium"
                >
                  Accéder au service
                </Button>
              </a>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Inclus</p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.ESSENTIEL.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Check className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SIGNATURE - POPULAIRE */}
            <div className="relative p-6 rounded-2xl bg-card border-2 border-primary md:-mt-4 md:mb-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  POPULAIRE
                </span>
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 mt-2">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-1">Signature</h3>
              <p className="text-primary font-medium text-sm mb-5">L'expérience conciergerie complète</p>
              
              <div className="mb-4 space-y-3">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 relative">
                  <div className="absolute -top-2 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      2 MOIS OFFERTS
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-foreground">490 DH</span>
                    <span className="text-muted-foreground">/an</span>
                  </div>
                  <p className="text-primary text-sm mt-1">≈ 41 DH/mois</p>
                </div>
                
                <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-muted-foreground">49 DH</span>
                    <span className="text-muted-foreground/60">/mois</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Nous gérons votre identité. Vous restez concentré.
              </p>
              
              <Link to="/order/type">
                <Button className="w-full py-6 font-semibold">
                  <Crown className="w-5 h-5 mr-2" />
                  Choisir Signature
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-primary/20">
                <p className="text-xs font-medium text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Star className="w-3 h-3 fill-primary" />
                  Service complet
                </p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.SIGNATURE.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-foreground text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-5 p-4 rounded-xl bg-secondary/50 border border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    + Avantages
                  </p>
                  <ul className="space-y-2">
                    {SUBSCRIPTION_PLANS.SIGNATURE.businessFeatures.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground text-xs">
                        <Shield className="w-3 h-3 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ÉLITE */}
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center mb-5">
                <Users className="w-5 h-5 text-background" />
              </div>
              
              <h3 className="text-2xl font-semibold text-foreground mb-1">Élite</h3>
              <p className="text-muted-foreground text-sm mb-5">Service sur-mesure entreprises</p>
              
              <div className="mb-5">
                <span className="text-2xl font-semibold text-foreground">Sur devis</span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Une conciergerie dédiée pour votre équipe.
              </p>
              
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20en%20savoir%20plus%20sur%20le%20service%20Élite%20pour%20mon%20équipe."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="outline"
                  className="w-full py-5 font-medium"
                >
                  Nous contacter
                </Button>
              </a>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">Inclus</p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.ELITE.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Check className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Comparison */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
            Comparaison des services
          </h2>
          
          <div className="rounded-xl overflow-hidden border border-border">
            {/* Header */}
            <div className="grid grid-cols-3 bg-card">
              <div className="p-4 font-medium text-muted-foreground">Service</div>
              <div className="p-4 text-center font-medium text-foreground border-x border-border">Essentiel</div>
              <div className="p-4 text-center font-medium text-primary bg-primary/5">Signature</div>
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
          <div className="p-8 md:p-12 rounded-2xl bg-foreground text-background">
            <Crown className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-semibold mb-4">
              Prêt à confier votre image à i-Wasp ?
            </h2>
            <p className="text-background/70 mb-8">
              Rejoignez les professionnels qui font confiance à notre conciergerie.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20accéder%20au%20service%20Essentiel."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-background/20 text-background hover:bg-background/10">
                  Service Essentiel
                </Button>
              </a>
              <Link to="/order/type">
                <Button size="lg" className="font-semibold">
                  <Crown className="w-5 h-5 mr-2" />
                  Choisir Signature
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
