/**
 * Club / Abonnement — Avantages membres i-wasp
 * Tarifs, avantages, CTA rejoindre le club
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClubNavbar } from "@/components/ClubNavbar";
import { 
  Crown, 
  Check, 
  ArrowRight,
  Sparkles,
  Bell,
  Users,
  BarChart3,
  Shield,
  Zap,
  Star,
  Gift
} from "lucide-react";

const WHATSAPP_CLUB_URL = "https://wa.me/33626424394?text=Bonjour%20👋%0AJe%20souhaite%20rejoindre%20le%20club%20i-wasp.";

// Member benefits
const memberBenefits = [
  {
    icon: Crown,
    title: "Cartes NFC illimitées",
    description: "Crée autant de profils digitaux que tu veux. Mets-les à jour à l'infini."
  },
  {
    icon: Sparkles,
    title: "IA intégrée",
    description: "Suggestions de contenu, optimisation de profil, réponses automatiques."
  },
  {
    icon: Bell,
    title: "Notifications push",
    description: "Envoie des messages aux personnes qui ont scanné ta carte."
  },
  {
    icon: BarChart3,
    title: "Analytics avancés",
    description: "Qui scanne, d'où, quand. Statistiques détaillées en temps réel."
  },
  {
    icon: Users,
    title: "Réseau exclusif",
    description: "Accès à la communauté mondiale de membres i-wasp."
  },
  {
    icon: Shield,
    title: "Support prioritaire",
    description: "Réponse garantie en moins de 2h par la conciergerie."
  }
];

// Plans
const plans = [
  {
    name: "Starter",
    price: "Gratuit",
    period: "",
    description: "Pour découvrir i-wasp",
    features: [
      "1 carte NFC de base",
      "1 profil digital",
      "Statistiques basiques",
      "Support email"
    ],
    cta: "Commencer",
    popular: false
  },
  {
    name: "Pro",
    price: "19€",
    period: "/mois",
    description: "Pour les professionnels",
    features: [
      "5 cartes NFC premium",
      "Profils illimités",
      "Notifications push",
      "Analytics complets",
      "Support WhatsApp",
      "Sans engagement"
    ],
    cta: "Devenir Pro",
    popular: true
  },
  {
    name: "Club",
    price: "49€",
    period: "/mois",
    description: "L'expérience complète",
    features: [
      "Cartes illimitées",
      "IA intégrée",
      "Notifications push avancées",
      "API & intégrations",
      "Conciergerie dédiée",
      "Réseau exclusif",
      "Événements VIP"
    ],
    cta: "Rejoindre le Club",
    popular: false
  }
];

// Testimonials
const testimonials = [
  {
    quote: "Le club i-wasp a changé ma façon de networker. Les notifications push sont game-changer.",
    author: "Marc L.",
    role: "Entrepreneur"
  },
  {
    quote: "La conciergerie dédiée est incroyable. Ils ont créé tout mon système NFC en 48h.",
    author: "Sophie R.",
    role: "Restauratrice"
  }
];

export default function Club() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      <ClubNavbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <Crown className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-300/80">Club privé mondial</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Rejoins le club<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">i-wasp</span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Un cercle exclusif de professionnels connectés. 
              Outils premium, IA, conciergerie et réseau mondial.
            </p>
            
            <a href={WHATSAPP_CLUB_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 gap-2">
                <Crown className="w-5 h-5" />
                Rejoindre maintenant
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
      
      {/* Benefits Grid */}
      <section className="py-20 px-6 bg-[#121212]">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Les avantages <span className="text-amber-400">membres</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Tout ce dont tu as besoin pour connecter, engager et convertir.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-white/50">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-24 px-6 bg-[#0B0B0B]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choisis ton <span className="text-amber-400">plan</span>
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Des formules adaptées à chaque besoin. Sans engagement.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-3xl border transition-all ${
                  plan.popular 
                    ? "bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/50" 
                    : "bg-white/5 border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-semibold">
                    Le plus populaire
                  </div>
                )}
                
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-white/50 text-sm mb-6">{plan.description}</p>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-white/50 ml-1">{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <a href={WHATSAPP_CLUB_URL} target="_blank" rel="noopener noreferrer">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black" 
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-[#121212]">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-white/50">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#0B0B0B] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Gift className="w-12 h-12 text-amber-400 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prêt à rejoindre le club ?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Démarre avec le plan Starter gratuit ou contacte-nous pour un accompagnement personnalisé.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={WHATSAPP_CLUB_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-semibold px-8 gap-2">
                  <Crown className="w-5 h-5" />
                  Rejoindre le Club
                </Button>
              </a>
              <Link to="/conciergerie">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8">
                  Parler à un conseiller
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 bg-[#0A0A0A] border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold text-white">
              i-wasp<span className="text-amber-400">.</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-white/50">
              <Link to="/about" className="hover:text-white transition-colors">À propos</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
            </div>
            <div className="text-sm text-white/30">
              © 2025 i-wasp. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
