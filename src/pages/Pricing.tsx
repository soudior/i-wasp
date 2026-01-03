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
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* FREE Plan - Neutre et discret */}
            <div className="relative p-6 lg:p-8 rounded-2xl bg-[#1F1F1F] border border-[#E5E5E5]/10 opacity-90 hover:opacity-100 transition-all">
              <div className="w-10 h-10 rounded-lg bg-[#E5E5E5]/10 flex items-center justify-center mb-5">
                <Zap className="w-5 h-5 text-[#E5E5E5]" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-1">{SUBSCRIPTION_PLANS.FREE.name}</h3>
              <p className="text-[#E5E5E5]/60 text-sm mb-5">{SUBSCRIPTION_PLANS.FREE.tagline}</p>
              
              <div className="mb-5">
                <span className="text-4xl font-bold text-white">Gratuit</span>
              </div>
              
              <p className="text-sm text-[#E5E5E5]/70 mb-6 italic">
                Commence gratuitement avec une carte NFC simple.
              </p>
              
              <Link to="/signup">
                <Button 
                  variant="outline"
                  className="w-full py-5 font-medium border-[#E5E5E5]/20 text-[#E5E5E5] hover:bg-white/5 hover:border-[#E5E5E5]/30"
                >
                  Commencer gratuitement
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-[#E5E5E5]/10">
                <p className="text-xs font-medium text-[#E5E5E5]/40 uppercase tracking-wide mb-3">Inclus</p>
                <ul className="space-y-2">
                  {SUBSCRIPTION_PLANS.FREE.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-[#E5E5E5]/70 text-sm">
                      <Check className="w-4 h-4 text-[#E5E5E5]/40 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* GOLD Plan - Mise en avant maximale */}
            <div className="relative p-6 lg:p-8 rounded-2xl bg-gradient-to-b from-[#FFC700]/20 via-[#1F1F1F] to-[#1F1F1F] border-2 border-[#FFC700] shadow-[0_0_40px_rgba(255,199,0,0.3)] animate-fade-in">
              {/* Badge Recommandé */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <span className="px-6 py-2 rounded-full bg-[#FFC700] text-[#0B0B0B] text-sm font-bold shadow-lg shadow-[#FFC700]/40 flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  RECOMMANDÉ
                </span>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-[#FFC700]/5 blur-xl -z-10" />
              
              <div className="w-12 h-12 rounded-xl bg-[#FFC700]/20 flex items-center justify-center mb-5 mt-2">
                <Crown className="w-6 h-6 text-[#FFC700]" />
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                {SUBSCRIPTION_PLANS.GOLD.name}
                <Star className="w-6 h-6 text-[#FFC700] fill-[#FFC700]" />
              </h3>
              <p className="text-[#FFC700] font-medium mb-5">{SUBSCRIPTION_PLANS.GOLD.tagline}</p>
              
              <div className="mb-5">
                <span className="text-5xl font-bold text-white">{SUBSCRIPTION_PLANS.GOLD.price}</span>
                <span className="text-[#E5E5E5]/60 ml-2 text-lg">{SUBSCRIPTION_PLANS.GOLD.currency}{SUBSCRIPTION_PLANS.GOLD.period}</span>
              </div>
              
              <p className="text-sm text-[#FFC700]/80 mb-6 italic">
                Transforme ta carte NFC en véritable outil business.
              </p>
              
              <Link to="/order/type">
                <Button 
                  className="w-full py-6 font-bold text-lg bg-[#FFC700] hover:bg-[#FFC700]/90 text-[#0B0B0B] shadow-lg shadow-[#FFC700]/30 transition-all hover:shadow-[#FFC700]/50 hover:scale-[1.02]"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Passer GOLD
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-[#FFC700]/30">
                <p className="text-xs font-medium text-[#FFC700] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Star className="w-3 h-3 fill-[#FFC700]" />
                  Solution Business Complète
                </p>
                <ul className="space-y-2.5">
                  {SUBSCRIPTION_PLANS.GOLD.included.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-white text-sm">
                      <Check className="w-4 h-4 text-[#FFC700] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Business Features Highlight */}
                <div className="mt-5 p-4 rounded-xl bg-[#FFC700]/10 border border-[#FFC700]/20">
                  <p className="text-xs font-medium text-[#FFC700] uppercase tracking-wide mb-3">
                    + Avantages Business
                  </p>
                  <ul className="space-y-2">
                    {SUBSCRIPTION_PLANS.GOLD.businessFeatures.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[#E5E5E5] text-xs">
                        <Shield className="w-3 h-3 text-[#FFC700] flex-shrink-0" />
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
