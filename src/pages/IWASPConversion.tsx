/**
 * I-WASP Conversion Landing Page
 * 
 * High-conversion, business-focused homepage
 * Clear value proposition, professional tone
 * Focus: Trust, Credibility, Revenue
 */

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Check, 
  ArrowRight, 
  CreditCard, 
  Smartphone, 
  Share2, 
  Zap,
  Users,
  TrendingUp,
  Shield,
  Clock,
  X,
  AlertTriangle,
  Target,
  Handshake,
  ChevronRight
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

// Problem points
const problems = [
  { icon: AlertTriangle, text: "Image peu professionnelle qui fait perdre des opportunités" },
  { icon: X, text: "Cartes de visite papier oubliées ou jetées" },
  { icon: AlertTriangle, text: "Liens dispersés sur plusieurs plateformes" },
  { icon: X, text: "Manque de crédibilité immédiate face aux prospects" },
];

// Solution benefits
const solutions = [
  { icon: CreditCard, title: "Une seule carte", desc: "Tout votre réseau accessible d'un geste" },
  { icon: Target, title: "Un seul lien", desc: "Profil professionnel complet et mémorable" },
  { icon: Shield, title: "Image impeccable", desc: "Crédibilité renforcée à chaque rencontre" },
  { icon: Zap, title: "Accès instantané", desc: "Vos prospects vous trouvent en 1 seconde" },
];

// Business logic flow
const businessLogic = [
  { 
    metric: "Première impression",
    result: "Plus de confiance",
    icon: Users
  },
  { 
    metric: "Plus de confiance",
    result: "Plus de réponses",
    icon: TrendingUp
  },
  { 
    metric: "Plus de réponses",
    result: "Plus de ventes",
    icon: Handshake
  },
];

// How it works steps
const steps = [
  { number: "01", title: "Commandez", desc: "Choisissez votre offre et personnalisez votre carte", icon: CreditCard },
  { number: "02", title: "Activez", desc: "Configurez votre profil en 5 minutes", icon: Smartphone },
  { number: "03", title: "Partagez", desc: "Un tap suffit pour partager vos infos", icon: Share2 },
  { number: "04", title: "Convertissez", desc: "Transformez vos contacts en clients", icon: Handshake },
];

// Product features
const productFeatures = [
  "Carte NFC premium avec votre design",
  "QR Code professionnel",
  "Profil digital illimité",
  "Partage instantané par lien",
  "Mises à jour en temps réel",
  "Tableau de bord analytics",
  "Support prioritaire",
  "Hébergement sécurisé à vie",
];

export default function IWASPConversion() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-b border-foreground/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl tracking-widest">
            I-WASP
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/iwasp/produit"
              className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              En savoir plus
            </Link>
            <Link to="/express/offre">
              <Button className="bg-foreground text-background hover:bg-foreground/90 text-sm px-6">
                Commander
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Most Important */}
      <section className="pt-32 pb-20 px-4 md:px-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-6"
          >
            Transformez chaque contact<br />
            <span className="text-muted-foreground">en opportunité business.</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Carte de visite digitale + site professionnel conçus pour inspirer confiance et vendre plus.
          </motion.p>
          
          <motion.div 
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/express/offre">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-base px-8 py-6 w-full sm:w-auto"
              >
                Commander ma carte
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="#comment-ca-marche">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-6 w-full sm:w-auto border-foreground/20"
              >
                Voir comment ça fonctionne
              </Button>
            </Link>
          </motion.div>
          
          {/* Trust badges */}
          <motion.div 
            variants={fadeUp}
            className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Livraison 48h</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>+500 professionnels</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 md:px-6 bg-card/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Le problème</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Pourquoi la majorité des entrepreneurs<br />
              <span className="text-muted-foreground">perdent des opportunités</span>
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid sm:grid-cols-2 gap-4"
          >
            {problems.map((problem, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="flex items-start gap-4 p-6 bg-background border border-foreground/5"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-destructive/10 flex-shrink-0">
                  <problem.icon className="w-5 h-5 text-destructive" />
                </div>
                <p className="text-foreground/80 leading-relaxed">{problem.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 md:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">La solution</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              I-WASP centralise votre identité<br />
              <span className="text-muted-foreground">et renforce votre crédibilité</span>
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {solutions.map((solution, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="p-6 bg-card border border-foreground/5 text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-foreground/5">
                  <solution.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-display text-lg mb-2">{solution.title}</h3>
                <p className="text-sm text-muted-foreground">{solution.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Business Logic Section */}
      <section className="py-20 px-4 md:px-6 bg-foreground text-background">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-background/60 mb-4">La logique business</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Comment I-WASP vous aide<br />
              <span className="text-background/70">à gagner plus</span>
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
          >
            {businessLogic.map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="flex items-center gap-4"
              >
                <div className="text-center p-6 bg-background/5 border border-background/10">
                  <item.icon className="w-8 h-8 mx-auto mb-3 text-background/80" />
                  <p className="text-sm text-background/60 mb-1">{item.metric}</p>
                  <p className="font-display text-lg">{item.result}</p>
                </div>
                {i < businessLogic.length - 1 && (
                  <ChevronRight className="w-6 h-6 text-background/40 hidden md:block" />
                )}
              </motion.div>
            ))}
          </motion.div>
          
          <motion.p 
            variants={fadeUp}
            className="text-center mt-10 text-background/70 max-w-xl mx-auto"
          >
            C'est simple : une image professionnelle génère plus de confiance. 
            Plus de confiance génère plus de business.
          </motion.p>
        </motion.div>
      </section>

      {/* Product Section */}
      <section className="py-20 px-4 md:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Le produit</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              Votre identité professionnelle complète
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Carte NFC premium + profil digital = tout ce dont vous avez besoin pour impressionner et convertir.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeUp}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Features list */}
            <div className="p-8 bg-card border border-foreground/5">
              <h3 className="font-display text-xl mb-6">Ce qui est inclus</h3>
              <div className="space-y-4">
                {productFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center bg-foreground text-background">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-foreground/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Why better */}
            <div className="p-8 bg-card border border-foreground/5">
              <h3 className="font-display text-xl mb-6">Pourquoi c'est mieux</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">vs Carte papier</h4>
                  <p className="text-sm text-muted-foreground">
                    Jamais perdue, toujours à jour, impossible à ignorer.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">vs LinkedIn seul</h4>
                  <p className="text-sm text-muted-foreground">
                    Votre propre identité, sans distractions, 100% professionnelle.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">vs Site web classique</h4>
                  <p className="text-sm text-muted-foreground">
                    Partageable en 1 seconde, optimisé pour la conversion.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="py-20 px-4 md:px-6 bg-card/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Le processus</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Comment ça fonctionne
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                variants={fadeUp}
                className="relative p-6 bg-background border border-foreground/5"
              >
                <span className="absolute top-4 right-4 text-4xl font-display text-foreground/10">
                  {step.number}
                </span>
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-foreground/5">
                  <step.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-display text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 md:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Ils nous font confiance</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight">
              Rejoint par +500 professionnels
            </h2>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid sm:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeUp} className="p-6">
              <p className="text-4xl font-display mb-2">+500</p>
              <p className="text-sm text-muted-foreground">Cartes actives</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6">
              <p className="text-4xl font-display mb-2">98%</p>
              <p className="text-sm text-muted-foreground">Clients satisfaits</p>
            </motion.div>
            <motion.div variants={fadeUp} className="p-6">
              <p className="text-4xl font-display mb-2">48h</p>
              <p className="text-sm text-muted-foreground">Livraison moyenne</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={fadeUp}
            className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground"
          >
            <span className="px-4 py-2 bg-card border border-foreground/5">Entrepreneurs</span>
            <span className="px-4 py-2 bg-card border border-foreground/5">Agents immobiliers</span>
            <span className="px-4 py-2 bg-card border border-foreground/5">Consultants</span>
            <span className="px-4 py-2 bg-card border border-foreground/5">Import/Export</span>
            <span className="px-4 py-2 bg-card border border-foreground/5">Commerciaux</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 md:px-6 bg-card/50">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Tarifs</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4">
              Prix clairs, valeur évidente
            </h2>
            <p className="text-muted-foreground">
              Pas d'abonnement caché. Payez une fois, profitez à vie.
            </p>
          </motion.div>
          
          <motion.div 
            variants={fadeUp}
            className="p-8 md:p-12 bg-background border border-foreground/10 text-center"
          >
            <div className="inline-block px-4 py-1 bg-foreground text-background text-xs uppercase tracking-wider mb-6">
              Offre complète
            </div>
            <p className="text-5xl md:text-6xl font-display mb-2">
              {formatPriceMad(NFC_PRICING.tiers.SINGLE.priceMad)}
            </p>
            <p className="text-muted-foreground mb-8">
              Carte NFC + Profil digital + Hébergement à vie
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-md mx-auto text-left">
              {productFeatures.slice(0, 6).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-foreground" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <Link to="/express/offre">
              <Button 
                size="lg" 
                className="bg-foreground text-background hover:bg-foreground/90 text-base px-10 py-6"
              >
                Commander maintenant
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <p className="text-xs text-muted-foreground mt-6">
              Livraison gratuite au Maroc • Expédition sous 48h
            </p>
          </motion.div>
          
          {/* Packs for businesses */}
          <motion.div 
            variants={fadeUp}
            className="mt-8 text-center"
          >
            <p className="text-muted-foreground">
              Besoin de plusieurs cartes pour votre équipe ?{" "}
              <Link to="/order/offre" className="text-foreground underline underline-offset-4 hover:no-underline">
                Voir les packs entreprise
              </Link>
            </p>
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
            Prêt à transformer votre image professionnelle ?
          </motion.h2>
          <motion.p 
            variants={fadeUp}
            className="text-background/70 mb-10 max-w-xl mx-auto"
          >
            Commandez votre carte I-WASP aujourd'hui et commencez à convertir plus de contacts en clients.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link to="/express/offre">
              <Button 
                size="lg" 
                className="bg-background text-foreground hover:bg-background/90 text-base px-10 py-6"
              >
                Commander ma carte maintenant
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
            <span className="font-display text-lg tracking-widest">I-WASP</span>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/iwasp/produit" className="hover:text-foreground transition-colors">Produit</Link>
              <Link to="/express/offre" className="hover:text-foreground transition-colors">Commander</Link>
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
