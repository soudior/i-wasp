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
import { useRef, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GlobalFooter } from "@/components/GlobalFooter";
import { useAuth } from "@/contexts/AuthContext";

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
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Badge simple */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8"
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium">Carte de visite NFC</span>
          </motion.div>
          
          {/* Titre principal — TRÈS LISIBLE */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6"
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
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Une carte NFC premium qui remplace vos cartes de visite papier.
            <br className="hidden sm:block" />
            Approchez, tapez, connectez. Simple comme bonjour.
          </motion.p>
          
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link to="/order/offre">
              <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 gap-2">
                <ShoppingBag className="w-5 h-5" />
                Commander ma carte
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 py-6 gap-2">
                <Play className="w-5 h-5" />
                Voir une démo
              </Button>
            </Link>
          </motion.div>
          
          {/* Preuves sociales simples */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Livraison gratuite au Maroc</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Paiement à la livraison</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Garantie satisfait ou remboursé</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          DEMO VISUELLE — Montrer comment ça marche
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Visuel de la carte */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Carte NFC simulée */}
              <div className="relative mx-auto w-72 h-44 rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 shadow-2xl p-6 text-background">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-semibold">i-wasp</span>
                  <Wifi className="w-6 h-6 opacity-60" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-xs opacity-60 mb-1">Votre nom ici</div>
                  <div className="text-sm font-medium">CEO · Votre Entreprise</div>
                </div>
              </div>
              
              {/* Badge NFC */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                NFC intégré
              </div>
            </motion.div>
            
            {/* Explication */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-6">
                Comment ça marche ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Approchez simplement votre carte du téléphone de votre contact.
                Votre profil digital s'ouvre instantanément dans son navigateur.
                Il peut enregistrer vos coordonnées en un clic.
              </p>
              
              <div className="space-y-4">
                {howItWorks.map((step, index) => (
                  <div key={step.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">{step.title}</h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
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
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Pourquoi passer au NFC ?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une solution moderne pour les professionnels qui veulent se démarquer.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border border-border"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          OFFRES — Tarifs clairs
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Nos offres
            </h2>
            <p className="text-lg text-muted-foreground">
              Choisissez la formule qui vous correspond.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {offers.map((offer, index) => (
              <motion.div
                key={offer.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl bg-card border-2 ${
                  offer.popular ? 'border-primary shadow-lg' : 'border-border'
                }`}
              >
                {offer.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-4 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{offer.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{offer.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{offer.price}</span>
                    <span className="text-muted-foreground">MAD</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {offer.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/order/offre" className="block">
                  <Button 
                    className="w-full" 
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
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-foreground mb-4">
              Questions fréquentes
            </h2>
          </motion.div>
          
          <div className="space-y-4">
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
                  className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 text-muted-foreground bg-card">
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
      <section className="py-20 px-6 bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
              Prêt à passer au digital ?
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
              Rejoignez les professionnels qui ont déjà adopté la carte de visite du futur.
            </p>
            <Link to="/order/offre">
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 text-base px-8 py-6 gap-2"
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
