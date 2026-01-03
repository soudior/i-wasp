import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Building2, Crown } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Pour démarrer avec le NFC",
    price: "290",
    currency: "MAD",
    period: "",
    features: [
      "1 carte NFC premium",
      "Profil digital personnalisable",
      "5 liens maximum",
      "QR code backup",
      "Statistiques basiques",
      "Support email",
    ],
    cta: "Commander",
    popular: false,
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    description: "Le choix des professionnels",
    price: "490",
    currency: "MAD",
    period: "/an",
    features: [
      "1 carte NFC premium",
      "Profil digital illimité",
      "Liens illimités",
      "Templates métiers",
      "Analytics avancées",
      "Stories 24h",
      "Export leads Excel",
      "Support prioritaire",
      "Badge vérifié",
    ],
    cta: "Choisir Pro",
    popular: true,
    icon: Star,
  },
  {
    id: "business",
    name: "Business",
    description: "Pour les équipes et entreprises",
    price: "Sur mesure",
    currency: "",
    period: "",
    features: [
      "Cartes NFC pour équipe",
      "Dashboard admin centralisé",
      "Branding entreprise",
      "Gestion des collaborateurs",
      "Analytics équipe",
      "Intégration CRM",
      "Support dédié",
      "Onboarding personnalisé",
    ],
    cta: "Nous contacter",
    popular: false,
    icon: Building2,
  },
];

const faqs = [
  {
    question: "La carte est-elle réutilisable ?",
    answer: "Oui, la carte NFC est illimitée. Vous pouvez modifier votre profil digital autant de fois que vous voulez sans jamais réimprimer.",
  },
  {
    question: "Comment fonctionne l'abonnement Pro ?",
    answer: "L'abonnement Pro est annuel et donne accès à toutes les fonctionnalités premium : liens illimités, analytics avancées, stories 24h, et plus encore.",
  },
  {
    question: "Puis-je utiliser la carte sans abonnement ?",
    answer: "Oui, avec le plan Starter vous avez une carte NFC fonctionnelle avec les fonctionnalités de base, sans abonnement récurrent.",
  },
  {
    question: "Comment fonctionne l'offre Business ?",
    answer: "L'offre Business est sur mesure pour les équipes. Contactez-nous pour discuter de vos besoins spécifiques et obtenir un devis personnalisé.",
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-iwasp-bg">
      {/* Hero */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-iwasp-card border border-gold-500/20 mb-8">
            <Crown className="w-4 h-4 text-gold-500" />
            <span className="text-sm font-medium text-gold-500">Tarifs transparents</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Choisissez votre
            <span className="text-gold-500"> formule</span>
          </h1>
          
          <p className="text-xl text-iwasp-gray max-w-2xl mx-auto">
            Des tarifs simples, sans surprise. Commencez avec Starter et passez à Pro quand vous êtes prêt.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-6 lg:p-8 rounded-3xl border transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-b from-gold-500/10 to-iwasp-card border-gold-500/30 ring-1 ring-gold-500/20 scale-105'
                    : 'bg-iwasp-card border-white/5 hover:border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 rounded-full bg-gold-500 text-black text-sm font-semibold">
                      Le plus populaire
                    </span>
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                  plan.popular ? 'bg-gold-500/20' : 'bg-white/5'
                }`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-gold-500' : 'text-white'}`} />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-iwasp-gray mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-iwasp-gray ml-1">{plan.currency}{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 mt-0.5 ${plan.popular ? 'text-gold-500' : 'text-green-500'}`} />
                      <span className="text-white/90">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to={plan.id === "business" ? "/contact" : "/order/type"}>
                  <Button 
                    className={`w-full py-6 font-semibold ${
                      plan.popular
                        ? 'bg-gold-500 hover:bg-gold-600 text-black'
                        : 'bg-white/10 hover:bg-white/15 text-white'
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
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
            <h2 className="text-3xl font-bold text-white mb-4">
              Encore des questions ?
            </h2>
            <p className="text-iwasp-gray mb-8">
              Notre équipe est là pour vous aider à choisir la formule adaptée à vos besoins.
            </p>
            <Link to="/contact">
              <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-black font-semibold">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
