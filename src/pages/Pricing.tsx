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
      return <span className="text-sm text-white/90">{value}</span>;
    }
    return value ? (
      <Check className="w-5 h-5 text-gold-500" />
    ) : (
      <X className="w-5 h-5 text-white/20" />
    );
  };

  return (
    <div className="min-h-screen bg-iwasp-bg">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iwasp-card border border-gold-500/20 mb-8">
            <Crown className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-500">2 plans simples</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            FREE ou
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500"> GOLD</span>
          </h1>
          
          <p className="text-xl text-iwasp-gray max-w-2xl mx-auto">
            Commencez gratuitement. Passez GOLD quand vous voulez tout débloquer.
          </p>
        </div>
      </section>

      {/* Plans Comparison - Side by Side */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* FREE Plan */}
            <div className="relative p-6 lg:p-8 rounded-3xl bg-iwasp-card border border-white/10 hover:border-white/20 transition-all">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-2">{SUBSCRIPTION_PLANS.FREE.name}</h3>
              <p className="text-iwasp-gray mb-6">{SUBSCRIPTION_PLANS.FREE.tagline}</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">Gratuit</span>
              </div>
              
              <p className="text-sm text-iwasp-gray mb-8">
                {SUBSCRIPTION_PLANS.FREE.description}
              </p>
              
              <Link to="/signup">
                <Button 
                  variant="outline"
                  className="w-full py-6 font-semibold border-white/20 text-white hover:bg-white/5"
                >
                  Commencer gratuitement
                </Button>
              </Link>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-sm font-medium text-white mb-4">Ce qui est inclus :</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>1 carte NFC premium</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Profil digital basique</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>3 liens sociaux maximum</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>1 template</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Support email</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* GOLD Plan */}
            <div className="relative p-6 lg:p-8 rounded-3xl bg-gradient-to-b from-gold-500/15 to-iwasp-card border-2 border-gold-500/50 ring-1 ring-gold-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black text-sm font-bold shadow-lg shadow-gold-500/30">
                  RECOMMANDÉ
                </span>
              </div>
              
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center mb-6">
                <Crown className="w-6 h-6 text-gold-500" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                {SUBSCRIPTION_PLANS.GOLD.name}
                <Star className="w-6 h-6 text-gold-500 fill-gold-500" />
              </h3>
              <p className="text-gold-500 mb-6">{SUBSCRIPTION_PLANS.GOLD.tagline}</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">{SUBSCRIPTION_PLANS.GOLD.price}</span>
                <span className="text-iwasp-gray ml-2">{SUBSCRIPTION_PLANS.GOLD.currency}{SUBSCRIPTION_PLANS.GOLD.period}</span>
              </div>
              
              <p className="text-sm text-iwasp-gray mb-8">
                {SUBSCRIPTION_PLANS.GOLD.description}
              </p>
              
              <Link to="/order/type">
                <Button 
                  className="w-full py-6 font-bold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black shadow-lg shadow-gold-500/30"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Passer GOLD
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="mt-8 pt-8 border-t border-gold-500/20">
                <p className="text-sm font-medium text-gold-500 mb-4">Tout FREE + :</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Profil digital <strong>illimité</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Liens sociaux <strong>illimités</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Stories 24h <strong>illimitées</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Dashboard Analytics complet</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Capture de Leads + CRM</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Push Notifications</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Badge Certifié GOLD</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Coach IA personnalisé</span>
                  </li>
                  <li className="flex items-center gap-3 text-white/90">
                    <Check className="w-5 h-5 text-gold-500 flex-shrink-0" />
                    <span>Support Prioritaire 24/7</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Comparaison détaillée
          </h2>
          
          <div className="rounded-2xl overflow-hidden border border-white/10">
            {/* Header */}
            <div className="grid grid-cols-3 bg-iwasp-card">
              <div className="p-4 font-medium text-white/60">Fonctionnalité</div>
              <div className="p-4 text-center font-medium text-white">FREE</div>
              <div className="p-4 text-center font-medium text-gold-500 bg-gold-500/10">GOLD</div>
            </div>
            
            {/* Rows */}
            {FEATURE_COMPARISON.map((feature, index) => (
              <div 
                key={index}
                className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'}`}
              >
                <div className="p-4 text-white/80 text-sm">{feature.name}</div>
                <div className="p-4 flex justify-center items-center">
                  {renderValue(feature.free)}
                </div>
                <div className="p-4 flex justify-center items-center bg-gold-500/5">
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
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-iwasp-card border border-white/5"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-iwasp-gray">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-gold-500/10 to-iwasp-card border border-gold-500/20">
            <Crown className="w-12 h-12 text-gold-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Prêt à passer au niveau supérieur ?
            </h2>
            <p className="text-iwasp-gray mb-8">
              Rejoignez les professionnels qui ont choisi iWasp GOLD.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/5">
                  Commencer FREE
                </Button>
              </Link>
              <Link to="/order/type">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600 text-black font-bold shadow-lg shadow-gold-500/30">
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
