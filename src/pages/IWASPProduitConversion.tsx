/**
 * I-WASP Product Page - Conversion Focused
 * 
 * Dedicated product page for the digital business card
 * Clear value proposition, who it's for, why it increases sales
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Check, 
  ArrowRight, 
  ArrowLeft,
  CreditCard, 
  Smartphone, 
  Share2, 
  Users,
  TrendingUp,
  Shield,
  Clock,
  Target,
  Handshake,
  Briefcase,
  Building2,
  UserCheck,
  Globe,
  Zap,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NFC_PRICING, formatPriceMad } from "@/lib/nfcPricing";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

// Target audiences
const audiences = [
  { 
    icon: Briefcase, 
    title: "Entrepreneurs", 
    desc: "Fondateurs, CEOs, indépendants qui veulent impressionner dès le premier contact" 
  },
  { 
    icon: Building2, 
    title: "Agents immobiliers", 
    desc: "Professionnels qui rencontrent des prospects tous les jours" 
  },
  { 
    icon: UserCheck, 
    title: "Consultants", 
    desc: "Experts qui vendent leur expertise et leur crédibilité" 
  },
  { 
    icon: Globe, 
    title: "Import/Export", 
    desc: "Commerciaux qui travaillent à l'international" 
  },
];

// Why it increases sales
const salesReasons = [
  {
    title: "Image professionnelle instantanée",
    desc: "Une carte premium crée immédiatement une impression de sérieux et de réussite.",
    result: "+40% de taux de réponse"
  },
  {
    title: "Mémorabilité garantie",
    desc: "Vos contacts se souviennent de vous. Votre carte ne finit pas à la poubelle.",
    result: "5x plus de rappels"
  },
  {
    title: "Accès instantané à vos infos",
    desc: "Un tap et votre prospect a tout : téléphone, email, LinkedIn, site web.",
    result: "Conversion 2x plus rapide"
  },
];

// Product inclusions
const inclusions = [
  { item: "Carte NFC premium avec design personnalisé", highlight: true },
  { item: "QR Code professionnel intégré", highlight: true },
  { item: "Profil digital complet et illimité", highlight: false },
  { item: "Partage instantané par lien", highlight: false },
  { item: "Mises à jour en temps réel", highlight: false },
  { item: "Tableau de bord avec analytics", highlight: false },
  { item: "Hébergement sécurisé à vie", highlight: false },
  { item: "Support prioritaire", highlight: false },
];

// Comparisons
const comparisons = [
  { 
    vs: "Carte papier",
    problems: ["Jetée ou perdue", "Jamais à jour", "Pas de lien cliquable"],
    advantage: "Toujours avec vous, toujours à jour"
  },
  { 
    vs: "LinkedIn seul",
    problems: ["Noyé parmi des millions", "Distractions constantes", "Pas d'identité propre"],
    advantage: "100% vous, 0% distraction"
  },
  { 
    vs: "Site web classique",
    problems: ["Difficile à partager en personne", "Pas optimisé mobile", "Lent à charger"],
    advantage: "Partagé en 1 seconde, ultra-optimisé"
  },
];

export default function IWASPProduitConversion() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-b border-foreground/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link 
            to="/iwasp" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Retour</span>
          </Link>
          <Link to="/iwasp" className="font-display text-xl tracking-widest">
            I-WASP
          </Link>
          <Link to="/express/offre">
            <Button className="bg-foreground text-background hover:bg-foreground/90 text-sm px-6">
              Commander
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 md:px-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.p 
            variants={fadeUp}
            className="text-sm uppercase tracking-widest text-muted-foreground mb-6"
          >
            Carte de visite digitale I-WASP
          </motion.p>
          
          <motion.h1 
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-8"
          >
            L'outil qui transforme<br />
            <span className="text-muted-foreground">vos contacts en clients</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10"
          >
            Une carte de visite NFC premium + un profil digital professionnel. 
            Conçu pour les décideurs qui veulent faire plus de business.
          </motion.p>
          
          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/express/offre">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-base px-8 py-6 w-full sm:w-auto"
              >
                Commander maintenant
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* For Whom */}
      <section className="py-20 px-4 md:px-6 bg-card/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Pour qui ?</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Conçue pour les professionnels<br />
              <span className="text-muted-foreground">qui veulent se démarquer</span>
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {audiences.map((audience, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="p-6 bg-background border border-foreground/5"
              >
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-foreground/5">
                  <audience.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-display text-lg mb-2">{audience.title}</h3>
                <p className="text-sm text-muted-foreground">{audience.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Why It Increases Sales */}
      <section className="py-20 px-4 md:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">L'impact business</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Pourquoi I-WASP augmente<br />
              <span className="text-muted-foreground">vos ventes</span>
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="space-y-6"
          >
            {salesReasons.map((reason, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="flex flex-col md:flex-row gap-6 p-8 bg-card border border-foreground/5"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-foreground text-background font-display">
                      {i + 1}
                    </div>
                    <h3 className="font-display text-xl">{reason.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{reason.desc}</p>
                </div>
                <div className="md:w-48 flex items-center justify-center p-6 bg-foreground/5 border border-foreground/10">
                  <div className="text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-foreground" />
                    <p className="text-sm font-medium text-foreground">{reason.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4 md:px-6 bg-foreground text-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-background/60 mb-4">Ce qui est inclus</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Tout ce dont vous avez besoin<br />
              <span className="text-background/70">pour impressionner</span>
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-4"
          >
            {inclusions.map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className={`flex items-center gap-4 p-5 border ${
                  item.highlight 
                    ? 'border-background/30 bg-background/10' 
                    : 'border-background/10'
                }`}
              >
                <div className={`w-6 h-6 flex items-center justify-center ${
                  item.highlight ? 'bg-background text-foreground' : 'bg-background/20'
                }`}>
                  <Check className="w-4 h-4" />
                </div>
                <span className={item.highlight ? 'font-medium' : 'text-background/80'}>
                  {item.item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Comparisons */}
      <section className="py-20 px-4 md:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Comparaison</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Pourquoi c'est mieux<br />
              <span className="text-muted-foreground">que les alternatives</span>
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {comparisons.map((comp, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="p-6 bg-card border border-foreground/5"
              >
                <h3 className="font-display text-lg mb-4">vs {comp.vs}</h3>
                <div className="space-y-2 mb-6">
                  {comp.problems.map((problem, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-destructive mt-0.5">✕</span>
                      <span>{problem}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-foreground/10">
                  <div className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                    <span className="font-medium text-foreground">{comp.advantage}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 md:px-6 bg-card/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            variants={fadeUp}
            className="p-8 md:p-12 bg-background border border-foreground/10 text-center"
          >
            <div className="inline-block px-4 py-1 bg-foreground text-background text-xs uppercase tracking-wider mb-6">
              Offre unique
            </div>
            
            <p className="text-5xl md:text-6xl font-display mb-2">
              {formatPriceMad(NFC_PRICING.tiers.SINGLE.priceMad)}
            </p>
            <p className="text-muted-foreground mb-8">
              Paiement unique • Pas d'abonnement • Hébergement à vie
            </p>
            
            <Link to="/express/offre">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-base px-10 py-6"
              >
                Commander maintenant
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <div className="mt-8 pt-8 border-t border-foreground/10">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Paiement sécurisé
                </span>
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Livraison 48h
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Garantie à vie
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 md:px-6 bg-foreground text-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2 
            variants={fadeUp}
            className="font-display text-3xl md:text-4xl tracking-tight mb-6"
          >
            Prêt à convertir plus de clients ?
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="text-background/70 mb-10 max-w-xl mx-auto"
          >
            Commandez votre carte I-WASP et commencez à faire la différence dès votre prochaine rencontre.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/express/offre">
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 text-base px-10 py-6"
              >
                Commander ma carte
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 border-t border-foreground/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Link to="/iwasp" className="font-display text-lg tracking-widest">I-WASP</Link>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/iwasp" className="hover:text-foreground transition-colors">Accueil</Link>
              <Link to="/express/offre" className="hover:text-foreground transition-colors">Commander</Link>
              <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} I-WASP. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
