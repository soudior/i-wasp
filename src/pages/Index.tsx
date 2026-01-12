/**
 * Index / Home Page — i-wasp Landing
 * 
 * Design épuré, lisible, compréhensible immédiatement
 * Mode clair par défaut avec support dark mode
 */

import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Users, 
  Check,
  Star,
  CreditCard,
  Wifi,
  ShoppingBag,
  Play,
  Briefcase,
  Share2,
  Phone,
  Mail,
  Linkedin,
  ChevronDown,
  Clock,
  Shield,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRef, useState, Suspense, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { useAuth } from "@/contexts/AuthContext";

// Lazy load the 3D animation for performance
const NFCAnimation3D = lazy(() => import("@/components/NFCAnimation3D"));

// Comment ça marche - 3 étapes simples
const howItWorks = [
  {
    step: "1",
    title: "Commandez votre carte",
    description: "Choisissez votre design et recevez votre carte NFC en 48h.",
    icon: ShoppingBag,
  },
  {
    step: "2", 
    title: "Créez votre profil",
    description: "Ajoutez vos infos, réseaux sociaux et liens en 2 minutes.",
    icon: Users,
  },
  {
    step: "3",
    title: "Partagez d'un tap",
    description: "Approchez votre carte d'un téléphone. C'est tout.",
    icon: Wifi,
  },
];

// Avantages clés
const benefits = [
  {
    icon: Zap,
    title: "Instantané",
    description: "Un tap suffit pour partager toutes vos coordonnées.",
  },
  {
    icon: TrendingUp,
    title: "Professionnel",
    description: "Impressionnez vos contacts avec une carte premium.",
  },
  {
    icon: Shield,
    title: "Écologique",
    description: "Fini les cartes papier jetées. Une seule carte pour toujours.",
  },
];

// Offres
const offers = [
  {
    name: "Essentiel",
    price: "277",
    description: "Pour bien commencer",
    features: ["Carte NFC blanche", "Profil digital", "3 liens", "QR code"],
  },
  {
    name: "Signature",
    price: "555",
    description: "Notre best-seller",
    popular: true,
    features: ["Carte NFC premium", "Liens illimités", "Photos & vidéos", "Capture de leads", "Statistiques"],
  },
  {
    name: "Élite",
    price: "925",
    description: "Sur mesure",
    features: ["Design personnalisé", "Tout Signature inclus", "Support prioritaire", "Formation incluse"],
  },
];

// FAQ
const faqs = [
  {
    question: "Est-ce compatible avec tous les téléphones ?",
    answer: "Oui. Tous les iPhone récents (XS et +) et smartphones Android. Aucune application à installer.",
  },
  {
    question: "Puis-je modifier mes informations ?",
    answer: "Oui, à tout moment depuis votre espace. Les modifications sont instantanées.",
  },
  {
    question: "Comment ça marche exactement ?",
    answer: "Approchez votre carte du téléphone de votre contact. Votre profil s'affiche automatiquement dans son navigateur.",
  },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  return (
    <div ref={containerRef} className="bg-background min-h-screen">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — Message clair en 3 secondes
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge simple */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary mb-6 sm:mb-8"
          >
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Carte de visite NFC</span>
          </motion.div>
          
          {/* Titre principal — TRÈS LISIBLE sur mobile */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[1.75rem] leading-[1.2] sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground sm:leading-tight mb-4 sm:mb-6"
          >
            Partagez vos contacts
            <br />
            <span className="text-primary">en un seul geste</span>
          </motion.h1>
          
          {/* Sous-titre — Direct et compréhensible */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2"
          >
            Une carte NFC premium qui remplace vos cartes de visite papier.
            <span className="hidden sm:inline"> Approchez, tapez, connectez.</span>
          </motion.p>
          
          {/* CTAs - Plus gros sur mobile pour faciliter le tap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-2"
          >
            <Link to="/order/offre" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-[15px] sm:text-base h-14 sm:h-auto px-6 sm:px-8 sm:py-6 gap-2 font-medium">
                <ShoppingBag className="w-5 h-5" />
                Commander ma carte
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/demo" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-[15px] sm:text-base h-14 sm:h-auto px-6 sm:px-8 sm:py-6 gap-2">
                <Play className="w-5 h-5" />
                Voir une démo
              </Button>
            </Link>
          </motion.div>
          
          {/* Preuves sociales - Stack sur très petit écran */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-6 text-[13px] sm:text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Livraison gratuite au Maroc</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Paiement à la livraison</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Satisfait ou remboursé</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DEMO VISUELLE — Animation 3D du tap NFC
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Animation 3D du tap NFC */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px] aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-background to-muted/50 shadow-xl">
                <Suspense 
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 rounded-2xl bg-muted animate-pulse" />
                    </div>
                  }
                >
                  <NFCAnimation3D className="w-full h-full" />
                </Suspense>
                
                {/* Badge indicatif */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/90 text-background px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg backdrop-blur-sm flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  <span>Tap NFC en action</span>
                </div>
              </div>
            </motion.div>
            
            {/* Explication - Responsive */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-4 sm:mb-6">
                Comment ça marche ?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Approchez votre carte du téléphone de votre contact.
                Votre profil s'ouvre instantanément.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                {howItWorks.map((step) => (
                  <div key={step.step} className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center flex-shrink-0 text-sm sm:text-base">
                      {step.step}
                    </div>
                    <div className="pt-1">
                      <h3 className="font-medium text-foreground mb-0.5 sm:mb-1 text-[15px] sm:text-base">{step.title}</h3>
                      <p className="text-muted-foreground text-[13px] sm:text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          AVANTAGES — Pourquoi choisir i-wasp
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3 sm:mb-4">
              Pourquoi passer au NFC ?
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Une solution moderne pour les professionnels.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 sm:p-8 rounded-2xl bg-card border border-border"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">{benefit.title}</h3>
                <p className="text-[13px] sm:text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          OFFRES — Tarifs clairs
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3 sm:mb-4">
              Nos offres
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Choisissez la formule qui vous correspond.
            </p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-5 sm:p-6 md:p-8 rounded-2xl bg-card border-2 ${
                  offer.popular ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                {offer.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[11px] sm:text-xs font-medium px-3 sm:px-4 py-1 rounded-full whitespace-nowrap">
                    Populaire
                  </div>
                )}
                
                <div className="text-center mb-5 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1.5 sm:mb-2">{offer.name}</h3>
                  <p className="text-[13px] sm:text-sm text-muted-foreground mb-3 sm:mb-4">{offer.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">{offer.price}</span>
                    <span className="text-sm text-muted-foreground">MAD</span>
                  </div>
                </div>
                
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {offer.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 sm:gap-3 text-[13px] sm:text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/order/offre" className="block">
                  <Button 
                    className="w-full h-11 sm:h-10 text-[13px] sm:text-sm" 
                    variant={offer.popular ? "default" : "outline"}
                  >
                    Choisir {offer.name}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FAQ — Questions fréquentes
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground mb-3 sm:mb-4">
              Questions fréquentes
            </h2>
          </motion.div>
          
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-card hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground pr-3 sm:pr-4 text-[14px] sm:text-base leading-snug">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-[13px] sm:text-sm text-muted-foreground bg-card leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA FINAL — Appel à l'action
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6">
              Prêt à passer au digital ?
            </h2>
            <p className="text-base sm:text-lg opacity-80 mb-6 sm:mb-8 max-w-xl mx-auto px-2">
              Rejoignez les professionnels qui ont adopté la carte de visite du futur.
            </p>
            <Link to="/order/offre">
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 text-[15px] sm:text-base h-14 sm:h-auto px-6 sm:px-8 sm:py-6 gap-2 w-full sm:w-auto"
              >
                <ShoppingBag className="w-5 h-5" />
                Commander maintenant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
};

export default Index;
